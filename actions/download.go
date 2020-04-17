package actions

import (
	"fmt"
	"path/filepath"
	"strconv"

	"github.com/DataManager-Go/DataManagerGUI/utils"
)

var (
	cancelDlChan = make(chan bool, 1)
)

// DownloadFiles will download the files given inside the array
func DownloadFiles(fileIDs []uint, path string) {
	for _, id := range fileIDs {
		req := Manager.NewFileRequestByID(id)
		// Do request
		resp, err := req.Do()
		if err != nil {
			fmt.Println(err)
			FileTransferError(err.Error())
			continue
		}

		OpenDownloadMoal(resp.ServerFileName)

		req.Proxy = proxyForRequest(resp.Size)

		// Write request response to file
		err = resp.WriteToFile(filepath.Join(path, fmt.Sprint(strconv.FormatUint(uint64(resp.FileID), 10), "_", resp.ServerFileName)), 0600, cancelDlChan)
		if err != nil {
			fmt.Println(err)
			FileTransferError(err.Error())

			// Delete file local
			utils.ShredderFile(filepath.Join(path, resp.ServerFileName), -1)
		} else {
			FileTransferSuccess()
		}
	}

	CloseDownloadModal()
}
