package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	dmlib "github.com/DataManager-Go/libdatamanager"
	"github.com/JojiiOfficial/configService"
	"github.com/asticode/go-astilectron"
)

type loginForm struct {
	Type     string `json:"type"`
	URL      string `json:"url"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

// HandleLogin handles incoming loginForms from the JS related to user login
func HandleLogin(m *astilectron.EventMessage) interface{} {

	// Unmarshal
	var s string
	err := m.Unmarshal(&s)

	var f loginForm
	err = json.Unmarshal([]byte(s), &f)

	if err != nil {
		fmt.Println(err)
	}

	// Preprocess URL
	if !strings.HasPrefix(f.URL, "https://") {
		f.URL = "https://" + f.URL
	}

	// Process message
	if f.Type == "register" {

		config.Server.URL = f.URL
		manager.Config.URL = f.URL

		resp, err := manager.Register(f.Name, f.Password)

		if resp.Status == dmlib.ResponseSuccess {
			fmt.Println("Response Register Success")
			login := Login(f)
			if login != "success" {
				return login
			}
			var w = window

			go (func() {
				time.Sleep(time.Second)
				w.Destroy()
			})()

			StartMainWindow(app)
			return "success"
		}
		fmt.Println(err.Error())
		return "ServerError"

		///       							///
		/// 			LOGIN 				///
		///       							///
	} else if f.Type == "login" {
		login := Login(f)
		if login != "success" {
			return login
		}
		var w = window

		go (func() {
			time.Sleep(time.Second)
			w.Destroy()
		})()

		StartMainWindow(app)
		return ""

	}

	return "TypeUnknown: " + f.Type
}

// Login tries to log into the server
func Login(f loginForm) string {

	config.Server.URL = f.URL
	manager.Config.URL = f.URL

	resp, err := manager.Login(f.Name, f.Password)

	if err != nil {
		fmt.Println(err.Error())
		return "ServerError"
	} else if len(resp.Token) > 0 {
		fmt.Println("Response Login Success")
		//put username and token in config
		config.User = struct {
			Username     string
			SessionToken string
		}{
			Username:     f.Name,
			SessionToken: resp.Token,
		}

		//Set default namespace to users
		config.Default.Namespace = resp.Namespace

		//Save new config
		err := configService.Save(config, config.File)
		if err != nil {
			fmt.Println("Error saving config:", err.Error())
			return "SaveError"
		}
		manager = dmlib.NewLibDM(config.ToRequestConfig())

		// Success
		return "success"
	}
	return "ServerError"
}
