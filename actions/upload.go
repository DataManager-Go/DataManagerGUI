package actions

import (
	"fmt"

	jsprotocol "github.com/DataManager-Go/DataManagerGUI/jsProtocol"
)

// UploadFiles uploads file
func UploadFiles(files []string, info jsprotocol.UploadInfoSettings) {
	fmt.Println(files)
}
