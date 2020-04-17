package jsprotocol

import (
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
