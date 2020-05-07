package actions

import (
	"path/filepath"

	dmlib "github.com/DataManager-Go/libdatamanager"
	dmConfig "github.com/DataManager-Go/libdatamanager/config"
	"github.com/JojiiOfficial/gaw"
	"github.com/asticode/go-astilectron"
)

// "actions" wide variables
var (
	Window          *astilectron.Window
	ElementsPerPage = 30
	Config          *dmConfig.Config
	Manager         *dmlib.LibDM

	DownloadDir = filepath.Join(gaw.GetHome(), "Downloads")
)
