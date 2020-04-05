package main

import (
	"fmt"
	"strings"

	jsprotocol "github.com/DataManager-Go/DataManagerGUI/jsProtocol"
	dmlib "github.com/DataManager-Go/libdatamanager"
	"github.com/asticode/go-astikit"
	"github.com/asticode/go-astilectron"
)

var (
	app             *astilectron.Astilectron
	window          *astilectron.Window
	elementsPerPage = 30
	userToken       string
	config          *dmlib.Config
	manager         *dmlib.LibDM
)

func main() {
	// Create astilectron
	var err error
	app, err = astilectron.New(nil, astilectron.Options{
		AppName:            "Test",
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
	config, err = dmlib.InitConfig(dmlib.GetDefaultConfigFile(), "")
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	// No config found: use the newly created one
	if config == nil {
		config, err = dmlib.InitConfig(dmlib.GetDefaultConfigFile(), "")
		if err != nil {
			fmt.Println(err.Error())
			return
		}
	}

	// Create corresponding manager
	manager = dmlib.NewLibDM(config.ToRequestConfig())

	if config.IsLoggedIn() {
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

	if window, err = a.NewWindow("./resources/app/login/index.html", &astilectron.WindowOptions{
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
	if err := window.Create(); err != nil {
		fmt.Println(err.Error())
	}

	// Message handler
	window.OnMessage(HandleLogin)

	// Server IP
	if len(config.Server.URL) > 0 && !strings.Contains(config.Server.URL, "localhost") {
		SendString("URL%%"+config.Server.URL, HandleResponses)
	}

	// window.OpenDevTools()

	// Blocking pattern
	a.Wait()
}

// StartMainWindow starts the main programm (file explorer)
func StartMainWindow(a *astilectron.Astilectron) {

	// New window
	var err error
	if window, err = a.NewWindow("./resources/app/main/index.html", &astilectron.WindowOptions{
		Center:    astikit.BoolPtr(true),
		Height:    astikit.IntPtr(700),
		Width:     astikit.IntPtr(1100),
		MinHeight: astikit.IntPtr(500),
		MinWidth:  astikit.IntPtr(500),
	}); err != nil {
		fmt.Println(err.Error())
	}

	// Create windows
	if err := window.Create(); err != nil {
		fmt.Println(err.Error())
	}

	// Message handler
	window.OnMessage(HandleMessages)

	// Find data from default namespace
	resp, err := manager.GetNamespaces()

	var content [][]string

	msg := jsprotocol.NamespaceGroupsList{user: config.User.Username, content: content}

	// Error in config / server
	if err != nil {
		fmt.Println(err)
		StartLoginWindow(app)
		return
	}

	fmt.Println("Namespaces: ")
	fmt.Println(manager.GetNamespaces())
	SendMessage("namespace/groups", `{"user":"`+config.User.Username+`","content":[["Default", "Group1", "Group2"], ["Namespace2", "Group1"]]}`, HandleResponses)
	// DEBUG

	// Blocking pattern
	a.Wait()
}
