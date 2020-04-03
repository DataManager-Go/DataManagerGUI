package main

import (
	"fmt"

	"github.com/Yukaru-san/DataManager_Client/models"
	"github.com/asticode/go-astikit"
	"github.com/asticode/go-astilectron"
)

var (
	app             *astilectron.Astilectron
	window          *astilectron.Window
	elementsPerPage = 30
	userToken       string
	config          *models.Config
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
	config, err = models.InitConfig(models.GetDefaultConfigFile(), "")
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if config == nil {
		fmt.Println(err.Error())
		return
	}

	StartLoginWindow(app)
	/*
		if config.IsLoggedIn() {
			StartMainWindow(app)
		} else {
			StartLoginWindow(app)
		}
	*/
}

// StartLoginWindow opens the login window
func StartLoginWindow(a *astilectron.Astilectron) {
	// New window
	var err error
	if window, err = a.NewWindow("./resources/app/login/index.html", &astilectron.WindowOptions{
		Center:    astikit.BoolPtr(true),
		Height:    astikit.IntPtr(689),
		Width:     astikit.IntPtr(900),
		MinHeight: astikit.IntPtr(689),
		MinWidth:  astikit.IntPtr(900),
		MaxHeight: astikit.IntPtr(689),
		MaxWidth:  astikit.IntPtr(900),
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
	if len(config.Server.URL) > 0 {
		println(config.Server.URL)
		SendString("URL%%"+config.Server.URL, HandleResponses)
	}

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
		Width:     astikit.IntPtr(900),
		MinHeight: astikit.IntPtr(500),
		MinWidth:  astikit.IntPtr(500),
	}); err != nil {
		//	l.Fatal(fmt.Errorf("main: new window failed: %w", err))
	}

	// Create windows
	if err := window.Create(); err != nil {
		//	l.Fatal(fmt.Errorf("main: creating window failed: %w", err))
	}

	// Message handler
	window.OnMessage(HandleMessages)

	// DEBUG
	// window.OpenDevTools()
	SendMessage("namespace/groups", `{"content":[["Default", "Group1", "Group2"], ["Namespace2", "Group1"]]}`, HandleResponses)
	// DEBUG

	// Blocking pattern
	a.Wait()
}
