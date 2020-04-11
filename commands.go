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
func GetFiles(name string, id uint, allNamespaces bool, specificNamespace string, verbose uint8) (string, error) {
	filesResp, err := manager.ListFiles(name, id, allNamespaces, dmlib.FileAttributes{Namespace: specificNamespace}, verbose)

	if err != nil {
		return "", err
	} else {
		files, err := json.Marshal(filesResp.Files)

		if err != nil {
			return "", err
		}

		return string(files), nil
	}
}
