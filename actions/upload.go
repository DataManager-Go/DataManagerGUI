package actions

import (
	"os"
	"path/filepath"

	jsprotocol "github.com/DataManager-Go/DataManagerGUI/jsProtocol"
	libdm "github.com/DataManager-Go/libdatamanager"
)

var uploadCancelChan = make(chan bool, 1)

// UploadFiles uploads file
func UploadFiles(files []string, info jsprotocol.UploadInfoSettings) {
	// Close progresspopup afterwards
	defer CloseUploadModal()

	// Upload files in array
	for i := range files {
		if err := uploadFile(files[i], info, 0); err != nil {
			// Print all errors except cancel errors
			if err != libdm.ErrCancelled {
				UploadError(err.Error())
			}

			return
		}
	}

	// Refresh fileslist
	LoadFiles(libdm.FileAttributes{Namespace: info.Namespace})
}

func uploadFile(file string, info jsprotocol.UploadInfoSettings, replaceID uint) error {
	_, filename := filepath.Split(file)
	OpenUploadMoal(filename)

	// Open file
	f, err := os.Open(file)
	if err != nil {
		return err
	}

	attributes := info.GetAttributes()

	// Bulid correct request
	uploadRequest := Manager.NewUploadRequest(filename, attributes)
	// Replace file if desired
	if replaceID > 0 {
		uploadRequest.ReplaceFile(replaceID)
	}

	// Make public if desired
	if info.MakePublic {
		// TODO set public name
		uploadRequest.MakePublic("")
	}

	// Create and init proxyWriter for progressbar
	proxy := newProxy(0)
	proxy.callback = func(percent uint8) {
		UploadProgress(percent)
	}
	uploadRequest.SetFileSizeCallback(func(s int64) {
		proxy.total = s
		uploadRequest.ProxyWriter = proxy.proxyFunc()
	})

	// Upload file
	done := make(chan string, 1)
	resp, err := uploadRequest.UploadFile(f, done, uploadCancelChan)
	if err != nil {
		return err
	}

	// Await upload
	localChecksum := <-done

	// return error on error
	if resp.Checksum != localChecksum {
		// Delete file on cancelled
		if localChecksum == "cancelled" && resp != nil && resp.FileID != 0 {
			Manager.DeleteFile("", resp.FileID, false, attributes)
			return libdm.ErrCancelled
		}

		return libdm.ErrChecksumNotMatch
	}

	return nil
}
