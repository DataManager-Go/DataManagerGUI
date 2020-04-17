package actions

import (
	"fmt"
	"io"
	"strconv"

	libdm "github.com/DataManager-Go/libdatamanager"
)

type barProxy struct {
	w           io.Writer
	total       int64
	curr        *int64
	lastPercent *uint8
}

func (proxy barProxy) Write(b []byte) (int, error) {
	percent := uint8(calcPercent(*proxy.curr, proxy.total))

	// Show every 2nd % only
	if percent-2 > *proxy.lastPercent {
		fmt.Println(percent)
		SendMessage("downloadProgress", strconv.FormatUint(uint64(percent), 10), HandleResponses)
		(*proxy.lastPercent) = percent
	}

	(*proxy.curr) += int64(len(b))
	return proxy.w.Write(b)
}

func calcPercent(curr, max int64) int64 {
	return curr * 100 / max
}

func proxyForRequest(size int64) libdm.WriterProxy {
	return func(w io.Writer) io.Writer {
		curr, lastPercent := int64(0), uint8(0)

		barProxy := barProxy{
			w:           w,
			total:       size,
			curr:        &curr,
			lastPercent: &lastPercent,
		}

		return barProxy
	}
}
