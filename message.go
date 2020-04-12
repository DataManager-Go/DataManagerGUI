package main

import (
	"encoding/json"
	"fmt"
	"log"
	"path/filepath"
	"strings"

	jsprotocol "github.com/DataManager-Go/DataManagerGUI/jsProtocol"
	dmlib "github.com/DataManager-Go/libdatamanager"
	"github.com/JojiiOfficial/gaw"
	"github.com/asticode/go-astilectron"
)

type message struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}

type namespaceGroupInfo struct {
	Group     string `json:"group"`
	Namespace string `json:"namespace"`
}

// HandleMessages handles incoming messages from the JS
func HandleMessages(m *astilectron.EventMessage) interface{} {
	// Unmarshal into (json-)string
	var s string
	err := m.Unmarshal(&s)

	// Unmarshal into struct
	var ms message
	err = json.Unmarshal([]byte(s), &ms)

	if err != nil {
		fmt.Println(err.Error())
	}

	// Process message
	if ms.Type == "download" {
		fileIDs, err := strToUIntslice(strings.Split(ms.Payload, ";"))
		if err != nil {
			return ""
		}
		DownloadFiles(fileIDs, filepath.Join(gaw.GetHome(), "Downloads"))
		//os.Getenv("download") TODO
		return ""
	} else if ms.Type == "changeNamespaceOrGroup" {
		// Parse payload json
		var info namespaceGroupInfo
		err = json.Unmarshal([]byte(ms.Payload), &info)

		// Receive initial files data
		var json string
		var err error
		if info.Group == "ShowAllFiles" {
			json, err = GetFiles("", 0, false, dmlib.FileAttributes{Namespace: info.Namespace}, 0)
		} else {
			json, err = GetFiles("", 0, false, dmlib.FileAttributes{Namespace: info.Namespace, Groups: []string{info.Group}}, 0)
		}

		if err != nil {
			fmt.Println(err.Error())
		} else {
			SendMessage("files", json, HandleResponses)
		}
		return ""
	}
	return nil
}

// HandleResponses handles potential answers on messages
func HandleResponses(m *astilectron.EventMessage) {
	// Unmarshal
	var s string
	m.Unmarshal(&s)

	// Process message
	log.Printf("received %s\n", s)
}

// SendMessage sends a message towards the javascript
func SendMessage(typ, payload string, responeHandler func(m *astilectron.EventMessage)) {
	b, _ := json.Marshal(&message{Type: typ, Payload: payload})
	window.SendMessage(string(b), responeHandler)
}

// SendString sends a string towards the javascript
func SendString(s string, responeHandler func(m *astilectron.EventMessage)) {
	window.SendMessage(s, responeHandler)
}

// SendTags sends the gui all tags within the desired namespace
func SendTags(namespace string) {
	var tagContent []string
	tagResp, err := manager.GetTags(namespace)

	if err == nil {
		for _, t := range tagResp {
			tagContent = append(tagContent, string(t))
		}
	}

	tagMsg := jsprotocol.TagList{User: config.User.Username, Content: tagContent}
	tags, err := json.Marshal(tagMsg)

	if err == nil {
		fmt.Println(string(tags))
		SendMessage("tags", string(tags), HandleResponses)
		// SendMessage("tags", `{"user":"Yukaru", "content":["tag#1", "tag#2", "tag#3", "tag#123"]}`, HandleResponses)
	}
}

// SendInitialData sends the all initial data to the gui
func SendInitialData() error {
	// Find data from default namespace
	nsResp, err := manager.GetNamespaces()

	// Error in config / server
	if err != nil {
		return err
	}

	var content [][]string
	for i := 0; i < len(nsResp.Slice); i++ {
		// Request Groups from server
		var ns []string
		groupResp, err := manager.GetGroups(nsResp.Slice[i])

		if err != nil {
			fmt.Println(err.Error())
			break
		}

		if nsResp.Slice[i][len(config.User.Username)+1:] == "default" {
			ns = append(ns, "Default")
		} else {
			ns = append(ns, nsResp.Slice[i][len(config.User.Username)+1:])
		}

		// Convert Attribute to string one after another
		for _, att := range groupResp {
			ns = append(ns, string(att))
		}

		content = append(content, ns)

	}

	msg := jsprotocol.NamespaceGroupsList{User: config.User.Username, Content: content}
	namespaces, err := json.Marshal(msg)
	fmt.Println(string(namespaces))

	if err == nil {
		SendMessage("namespace/groups", string(namespaces), HandleResponses)
	}
	//SendMessage("namespace/groups", `{"content":[["Default", "Group1", "Group2"], ["Namespace2", "Group1"]]}`, HandleResponses)
	SendTags(nsResp.Slice[0])
	return nil
}
