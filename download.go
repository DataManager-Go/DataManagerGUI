package main

import (
	"fmt"
	"io"
	"path/filepath"
	"strconv"
)

var (
	cancelDlChan = make(chan bool, 1)
)

type barProxy struct {
	w           io.Writer
	total       int64
	curr        *int64
	lastPercent *uint8
}

func (proxy barProxy) Write(b []byte) (int, error) {
	percent := uint8(calcPercent(*proxy.curr, proxy.total))

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

// DownloadFiles will download the files given inside the array
func DownloadFiles(fileIDs []uint, path string) {
	for _, id := range fileIDs {
		req := manager.NewFileRequestByID(id)
		// Do request
		resp, err := req.Do()
		if err != nil {
			fmt.Println(err)
			continue
		}

		SendMessage("openDownloadOverlay", resp.ServerFileName, HandleResponses)

		// Set progressbar proxy
		req.Proxy = func(w io.Writer) io.Writer {
			curr, lastPercent := int64(0), uint8(0)

			barProxy := barProxy{
				w:           w,
				total:       resp.Size,
				curr:        &curr,
				lastPercent: &lastPercent,
			}

			return barProxy
		}

		// Write request response to file
		err = resp.WriteToFile(filepath.Join(path, resp.ServerFileName), 0600, cancelDlChan)
		if err != nil {
			fmt.Println(err)
		}
	}

	SendMessage("closeOverlay", "", HandleResponses)
}
