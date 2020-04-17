package jsprotocol

import (
	"fmt"
	"strings"

	dmlib "github.com/DataManager-Go/libdatamanager"
)

// GetAttributes returns fileattributes from UploadSettingsinfo
func (uis UploadInfoSettings) GetAttributes() dmlib.FileAttributes {
	return dmlib.FileAttributes{
		Groups:    uis.Groups,
		Tags:      uis.Tags,
		Namespace: uis.Namespace,
	}
}

// GetUserNamespace returns formattet namespace for user
func (uis UploadInfoSettings) GetUserNamespace(libdm *dmlib.LibDM) string {
	return fmt.Sprintf("%s_%s", libdm.Config.Username, strings.ToLower(uis.Namespace))
}
