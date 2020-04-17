package actions

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
func GetFiles(name string, id uint, allNamespaces bool, fileAttributes dmlib.FileAttributes, verbose uint8) (string, error) {
	fmt.Println(fileAttributes.Namespace)
	filesResp, err := Manager.ListFiles(name, id, allNamespaces, fileAttributes, verbose)

	if err != nil {
		return "", err
	}
	files, err := json.Marshal(filesResp.Files)

	if err != nil {
		return "", err
	}

	return string(files), nil
}
