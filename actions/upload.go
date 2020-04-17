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
	for i := range files {
		uploadFile(files[i], info, 0)
	}

	// Update fileslist
	LoadFiles(libdm.FileAttributes{Namespace: info.GetUserNamespace(Manager)})

	CloseTransferModal()
}

func uploadFile(file string, info jsprotocol.UploadInfoSettings, replaceID uint) error {
	_, filename := filepath.Split(file)
	OpenFileTransferMoal(filename)

	// Open file
	f, err := os.Open(file)
	if err != nil {
		return err
	}

	attributes := info.GetAttributes()
	attributes.Namespace = info.GetUserNamespace(Manager)

	uploadRequest := Manager.NewUploadRequest(filename, attributes)
	fmt.Println(uploadRequest.Attribute.Namespace)

	uploadRequest.SetFileSizeCallback(func(s int64) {
		uploadRequest.ProxyWriter = proxyForRequest(s)
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
		return libdm.ErrChecksumNotMatch
	}

	return nil
}
