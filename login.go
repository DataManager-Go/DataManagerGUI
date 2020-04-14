package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/DataManager-Go/DataManagerGUI/actions"
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

		actions.Config.Server.URL = f.URL
		actions.Manager.Config.URL = f.URL

		resp, err := actions.Manager.Register(f.Name, f.Password)

		if resp.Status == dmlib.ResponseSuccess {
			fmt.Println("Response Register Success")
			login := Login(f)
			if login != "success" {
				return login
			}
			var w = actions.Window

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
		var w = actions.Window

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

	actions.Config.Server.URL = f.URL
	actions.Manager.Config.URL = f.URL

	resp, err := actions.Manager.Login(f.Name, f.Password)

	if err != nil {
		fmt.Println(err.Error())
		return "ServerError"
	} else if len(resp.Token) > 0 {
		fmt.Println("Response Login Success")
		//put username and token in config
		actions.Config.InsertUser(f.Name, resp.Token)

		//Set default namespace to users
		actions.Config.Default.Namespace = resp.Namespace

		//Save new config
		err := configService.Save(actions.Config, actions.Config.File)
		if err != nil {
			fmt.Println("Error saving config:", err.Error())
			return "SaveError"
		}
		// Try to get config
		rconf, err := actions.Config.ToRequestConfig()
		if err != nil {
			// TODO Display error here
			fmt.Println(err.Error())
			return ""
		}
		actions.Manager = dmlib.NewLibDM(rconf)

		// Success
		return "success"
	}
	return "ServerError"
}
