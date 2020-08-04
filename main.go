package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/DataManager-Go/DataManagerGUI/actions"
	dmlib "github.com/DataManager-Go/libdatamanager"
	dmConfig "github.com/DataManager-Go/libdatamanager/config"
	"github.com/asticode/go-astikit"
	"github.com/asticode/go-astilectron"
	"github.com/sqweek/dialog"
)

var (
	app       *astilectron.Astilectron
	userToken string
	appName   = "DataManager"
)

func main() {

	// Check for first start
	path := "./example/vendor/"
	if runtime.GOOS == "windows" {
		home := os.Getenv("HOMEDRIVE") + os.Getenv("HOMEPATH")
		if home == "" {
			home = os.Getenv("USERPROFILE")
		}

		path = filepath.Join(home, "AppData", "Roaming", appName, "vendor")
	}
	if _, err := os.Stat(path); os.IsNotExist(err) {
		// First start
		ok := dialog.Message("%s %s %s", "For your first start", appName, "needs to download additional data. Download now?").Title("Additional data required").YesNo()
		if !ok {
			return
		}
	}

	// Create astilectron
	var err error
	app, err = astilectron.New(nil, astilectron.Options{
		AppName:            appName,
		BaseDirectoryPath:  "example",
		AppIconDarwinPath:  "./resources/icon.icns",
		AppIconDefaultPath: "./resources/icon.png",
	})

	if err != nil {
		fmt.Println(err.Error())
	}
	defer app.Close()

	// Handle signals
	app.HandleSignals()

	// Start
	if err = app.Start(); err != nil {
		fmt.Println(err.Error())
	}

	// ------------- Main Stuff ----------------
	//Init config
	actions.Config, err = dmConfig.InitConfig(dmConfig.GetDefaultConfigFile(), "")
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	// No config found: use the newly created one>
	if actions.Config == nil {
		actions.Config, err = dmConfig.InitConfig(dmConfig.GetDefaultConfigFile(), "")
		if err != nil {
			fmt.Println(err.Error())
			return
		}
	}
	// Try to get config
	rconf, err := actions.Config.ToRequestConfig()
	if err != nil {
		// TODO Display error here. Also in login.go:119
		fmt.Println(err.Error())
	}
	// Create corresponding manager
	actions.Manager = dmlib.NewLibDM(rconf)

	if actions.Config.IsLoggedIn() {
		StartMainWindow(app)
	} else {
		StartLoginWindow(app)
	}
}

// StartLoginWindow opens the login window
func StartLoginWindow(a *astilectron.Astilectron) {
	// New window
	var err error

	var width, height int

	for _, x := range a.Displays() {
		if x.IsPrimary() {
			width = x.Bounds().Width / 3
		}
	}

	// width = 900 height = 689
	height = 650

	if actions.Window, err = a.NewWindow("./resources/app/login/index.html", &astilectron.WindowOptions{
		Center:    astikit.BoolPtr(true),
		Height:    &height,
		Width:     &width,
		MinHeight: &height,
		MinWidth:  &width,
		MaxHeight: &height,
		MaxWidth:  &width,
	}); err != nil {
		fmt.Println(err.Error())
	}

	// Create windows
	if err := actions.Window.Create(); err != nil {
		fmt.Println(err.Error())
	}

	// Message handler
	actions.Window.OnMessage(HandleLogin)

	// Server IP
	if len(actions.Config.Server.URL) > 0 && !strings.Contains(actions.Config.Server.URL, "localhost") {
		actions.SendString("URL%%"+actions.Config.Server.URL, actions.HandleResponses)
	}

	// Blocking pattern
	// actions.Window.OpenDevTools()
	a.Wait()
}

// StartMainWindow starts the main programm (file explorer)
func StartMainWindow(a *astilectron.Astilectron) {

	// New window
	var err error
	if actions.Window, err = a.NewWindow("./resources/app/main/index.html", &astilectron.WindowOptions{
		Center:    astikit.BoolPtr(true),
		Height:    astikit.IntPtr(700),
		Width:     astikit.IntPtr(1300),
		MinHeight: astikit.IntPtr(500),
		MinWidth:  astikit.IntPtr(500),
		Icon:      astikit.StrPtr("./resources/icon.png"), // Windows only
	}); err != nil {
		fmt.Println(err.Error())
	}

	// Create windows
	if err := actions.Window.Create(); err != nil {
		fmt.Println(err.Error())
	}

	// Message handler
	actions.Window.OnMessage(func(m *astilectron.EventMessage) (v interface{}) {
		ret, err := actions.HandleMessages(m)
		if err != nil {
			errText := err.Error()

			// If error is a request error, print its reason
			if e, ok := err.(*dmlib.ResponseErr); ok {
				errText = e.Response.Message
			}

			log.Println(errText)
			actions.SendAlert("danger", "Error", errText)

			return nil
		}

		return ret
	})

	// Receive namespaces and groups
	err = actions.SendInitialData()

	// Error in config / server
	if err != nil {
		fmt.Println(err)
		var w = actions.Window
		go (func() {
			time.Sleep(time.Millisecond * 5)
			w.Destroy()
		})()
		StartLoginWindow(app)
		return
	}

	// Receive initial files data
	json, err := actions.GetFiles("", 0, false, dmlib.FileAttributes{Namespace: actions.Config.Default.Namespace}, 3)

	if err != nil {
		fmt.Println(err.Error())
	} else {
		actions.SendMessage("files", json, actions.HandleResponses)
	}

	// Blocking pattern
	// actions.Window.OpenDevTools()
	a.Wait()
}
