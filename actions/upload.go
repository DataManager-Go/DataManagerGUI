package actions

import (
	"fmt"
	"os"
	"path/filepath"

	jsprotocol "github.com/DataManager-Go/DataManagerGUI/jsProtocol"
	libdm "github.com/DataManager-Go/libdatamanager"
)

var uploadCancelChan = make(chan bool, 1)

// UploadFiles uploads file
func UploadFiles(files []string, info jsprotocol.UploadInfoSettings) {
	defer CloseUploadModal()
	fmt.Println(info)

	for i := range files {
		if err := uploadFile(files[i], info, 0); err != nil {
			if err != libdm.ErrCancelled {
				UploadError(err.Error())
			}
			return
		}
	}

	// Update fileslist
	LoadFiles(libdm.FileAttributes{Namespace: info.GetUserNamespace(Manager)})
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
	uploadRequest := Manager.NewUploadRequest(filename, attributes)

	proxy := newProxy(0)
	proxy.callback = func(percent uint8) {
		UploadProgress(percent)
	}
	uploadRequest.SetFileSizeCallback(func(s int64) {
		proxy.total = s
		uploadRequest.ProxyWriter = proxy.proxyFunc()
	})

	if replaceID > 0 {
		// Replace file if desired
		uploadRequest.ReplaceFile(replaceID)
	}

	done := make(chan string, 1)

	resp, err := uploadRequest.UploadFile(f, done, uploadCancelChan)
	if err != nil {
		return err
	}

	localChecksum := <-done

	// return error on error
	if resp.Checksum != localChecksum {
		if localChecksum == "cancelled" && resp != nil && resp.FileID != 0 {
			Manager.DeleteFile("", resp.FileID, false, attributes)
			return libdm.ErrCancelled
		}

		return libdm.ErrChecksumNotMatch
	}

	return nil
}
