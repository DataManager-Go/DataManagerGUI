package actions

import (
	"io"

	libdm "github.com/DataManager-Go/libdatamanager"
)

type progressCallback func(percent uint8)

type barProxy struct {
	w           io.Writer
	total       int64
	curr        *int64
	lastPercent *uint8
	callback    progressCallback
}

func (proxy barProxy) Write(b []byte) (int, error) {
	percent := uint8(calcPercent(*proxy.curr, proxy.total))

	// Show every 2nd % only
	if percent-2 > *proxy.lastPercent {
		proxy.callback(percent)
		(*proxy.lastPercent) = percent
	}

	(*proxy.curr) += int64(len(b))
	return proxy.w.Write(b)
}

func calcPercent(curr, max int64) int64 {
	return curr * 100 / max
}

func (proxy *barProxy) proxyFunc() libdm.WriterProxy {
	return func(w io.Writer) io.Writer {
		proxy.w = w
		return proxy
	}
}

func newProxy(size int64) *barProxy {
	curr, lastPercent := int64(0), uint8(0)
	return &barProxy{
		total:       size,
		curr:        &curr,
		lastPercent: &lastPercent,
	}
}
