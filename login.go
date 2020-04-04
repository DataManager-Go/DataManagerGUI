package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/JojiiOfficial/configService"
	"github.com/Yukaru-san/DataManager_Client/server"
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

		//Do request
		resp, err := server.NewRequest(server.EPRegister, server.CredentialsRequest{
			MachineID: config.MachineID,
			Username:  f.Name,
			Password:  f.Password,
		}, config).Do(nil)

		if err != nil {
			return "ServerError"
		}

		if resp.Status == server.ResponseSuccess {
			fmt.Println("Response Register Success")
			login := Login(f)
			if len(login) > 0 {
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

	var response server.LoginResponse
	//Do request
	resp, err := server.NewRequest(server.EPLogin, server.CredentialsRequest{
		MachineID: config.MachineID,
		Password:  f.Password,
		Username:  f.Name,
	}, config).Do(&response)

	if err != nil {
		return "ServerError"
	}
	if resp.Status == server.ResponseError && resp.HTTPCode == 403 {
		return "ServerError"
	} else if resp.Status == server.ResponseSuccess && len(response.Token) > 0 {
		fmt.Println("Response Login Success")
		//put username and token in config
		config.User = struct {
			Username     string
			SessionToken string
		}{
			Username:     f.Name,
			SessionToken: response.Token,
		}

		//Set default namespace to users
		config.Default.Namespace = response.Namespace

		//Save new config
		err := configService.Save(config, config.File)
		if err != nil {
			fmt.Println("Error saving config:", err.Error())
			return "SaveError"
		}

		// Success
		return "success"
	}
	return fmt.Sprint("", resp.Status)
}
