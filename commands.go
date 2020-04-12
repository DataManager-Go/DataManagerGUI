package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	dmlib "github.com/DataManager-Go/libdatamanager"
)

var (
	baseFilepath = fmt.Sprintf(os.Getenv("HOME"), filepath.Separator, "Documents", filepath.Separator, "DataManager")
)

// GetFiles returns a json containing all found files using the args
func GetFiles(name string, id uint, allNamespaces bool, specificNamespace string, group string, verbose uint8) (string, error) {

	var filesResp *dmlib.FileListResponse
	var err error

	if group == "" || group == "ShowAllFiles" {
		filesResp, err = manager.ListFiles(name, id, allNamespaces, dmlib.FileAttributes{Namespace: specificNamespace}, verbose)
	} else {
		filesResp, err = manager.ListFiles(name, id, allNamespaces, dmlib.FileAttributes{Namespace: specificNamespace, Groups: []string{group}}, verbose)
	}

	if err != nil {
		return "", err
	}
	files, err := json.Marshal(filesResp.Files)

	if err != nil {
		return "", err
	}

	return string(files), nil
}
