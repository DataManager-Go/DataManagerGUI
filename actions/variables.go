package actions

import (
	dmlib "github.com/DataManager-Go/libdatamanager"
	dmConfig "github.com/DataManager-Go/libdatamanager/config"
	"github.com/asticode/go-astilectron"
)

// ...
var (
	Window          *astilectron.Window
	ElementsPerPage = 30
	Config          *dmConfig.Config
	Manager         *dmlib.LibDM
)
