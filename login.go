package main

import (
	"fmt"
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
	var f = loginForm{}
	err := m.Unmarshal(&f)

	if err != nil {
		fmt.Println(err)
	}

	// Process message
	if f.Type == "register" {

		//Do request
		resp, err := server.NewRequest(server.EPRegister, server.CredentialsRequest{
			Username: f.Name,
			Password: f.Password,
		}, config).Do(nil)

		if err != nil {
			fmt.Println("Err", err.Error())
			return err.Error()
		}

		if resp.Status == server.ResponseSuccess {
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
			return ""
		}
		return resp.Status

		///       							///
		/// 			LOGIN 				///
		///       							///
	} else if f.Type == "login" {
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
		Password: f.Password,
		Username: f.Name,
	}, config).Do(&response)

	if err != nil {
		return err.Error()
	}
	if resp.Status == server.ResponseError && resp.HTTPCode == 403 {
		return fmt.Sprint(resp.Status)
	} else if resp.Status == server.ResponseSuccess && len(response.Token) > 0 {
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
		return ""
	}
	return ""
}
