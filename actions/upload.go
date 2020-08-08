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

	// Message
	if len(files) > 1 {
		UploadSuccess(3, true)
	} else {
		UploadSuccess(3, false)
	}

	// Refresh
	LoadFiles(libdm.FileAttributes{Namespace: info.Namespace})
}

func upload(item string, replaceID uint, settings jsprotocol.UploadInfoSettings) error {
	s, err := os.Stat(item)
	if err != nil {
		return err
	}

	var filename string
	if s.IsDir() {
		filename = filepath.Base(item)
	} else {
		_, filename = filepath.Split(item)
	}

	OpenUploadMoal(filename)

	attributes := settings.GetAttributes()

	// Bulid correct request
	uploadRequest := Manager.NewUploadRequest(filename, attributes)
	// Replace file if desired
	if replaceID > 0 {
		uploadRequest.ReplaceFileByID(replaceID)
	}

	// add compression
	if settings.Compress {
		uploadRequest.Compress()
	}

	// Make public if desired
	if settings.MakePublic {
		// TODO set public name
		uploadRequest.MakePublic("")
	}

	// Create and init proxyWriter for progressbar
	proxy := newProxy(0)
	proxy.callback = func(percent uint8) {
		UploadProgress(percent)
	}

	uploadRequest.SetFileSizeCallback(func(s int64) {
		fmt.Println("set max size", s)
		proxy.total = s
		uploadRequest.ProxyWriter = proxy.proxyFunc()
	})

	done := make(chan string, 1)
	var resp *libdm.UploadResponse

	// Upload file
	if s.IsDir() {
		resp, err = uploadRequest.UploadArchivedFolder(item, done, uploadCancelChan)
		if err != nil {
			return err
		}
	} else {
		f, err := os.Open(item)
		defer f.Close()
		if err != nil {
			return err
		}

		resp, err = uploadRequest.UploadFile(f, done, uploadCancelChan)
		if err != nil {
			return err
		}
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

func uploadFile(file string, info jsprotocol.UploadInfoSettings, replaceID uint) error {
	return upload(file, replaceID, info)
}

func uploadDirectory(path string, settings jsprotocol.UploadInfoSettings) {
	upload(path, 0, settings)
}
