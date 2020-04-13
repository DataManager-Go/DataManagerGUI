package main

import (
	"fmt"
	"io"
	"path/filepath"
	"strconv"
)

type barProxy struct {
	w     io.Writer
	total int64
	curr  *int64
}

func (proxy barProxy) Write(b []byte) (int, error) {
	percent := int(calcPercent(*proxy.curr, proxy.total))
	SendMessage("downloadProgress", strconv.Itoa(percent), HandleResponses)
	(*proxy.curr) += int64(len(b))
	//fmt.Println(strconv.Itoa(percent))
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
			curr := int64(0)

			barProxy := barProxy{
				w:     w,
				total: resp.Size,
				curr:  &curr,
			}

			return barProxy
		}

		// Write request response to file
		err = resp.WriteToFile(filepath.Join(path, resp.ServerFileName), 0600, nil)
		if err != nil {
			fmt.Println(err)
		}
	}

	SendMessage("closeOverlay", "", HandleResponses)
}
