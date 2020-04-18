package actions

import (
	"encoding/json"
	"fmt"
	"log"
	"path/filepath"

	jsprotocol "github.com/DataManager-Go/DataManagerGUI/jsProtocol"
	dmlib "github.com/DataManager-Go/libdatamanager"
	"github.com/JojiiOfficial/gaw"
	"github.com/asticode/go-astilectron"
)

type message struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
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

	switch ms.Type {
	case "download":
		{
			var data jsprotocol.DownloadStruct
			err = json.Unmarshal([]byte(ms.Payload)[1:len(ms.Payload)-1], &data)
			if err != nil {
				fmt.Println(err)
				return ""
			}

			DownloadFiles(data.Files, filepath.Join(gaw.GetHome(), "Downloads"))
			//os.Getenv("download") TODO
			return ""
		}
	case "cancelDownload":
		{
			cancelDlChan <- true
		}
	case "changeNamespaceOrGroup":
		{
			// Parse payload json
			var info jsprotocol.NamespaceGroupInfo
			err = json.Unmarshal([]byte(ms.Payload), &info)

			// Receive initial files data
			var json string
			var err error
			attributes := dmlib.FileAttributes{Namespace: info.Namespace}

			if info.Group != "ShowAllFiles" {
				attributes.Groups = []string{info.Group}
			}

			json, err = GetFiles("", 0, false, attributes, 0)

			if err != nil {
				fmt.Println(err.Error())
			} else {
				SendMessage("files", json, HandleResponses)
			}
			return ""
		}
	case "uploadFiles":
		{
			// Parse payload json
			var uploadInfo jsprotocol.UploadFilesStruct
			err = json.Unmarshal([]byte(ms.Payload), &uploadInfo)
			if err != nil {
				fmt.Println(err.Error())
				return err
			}

			fmt.Println(uploadInfo.Settings)

			// Parse uploadInfo.Settings
			var uploadSettings jsprotocol.UploadInfoSettings
			err = json.Unmarshal([]byte(uploadInfo.Settings), &uploadSettings)
			if err != nil {
				fmt.Println(err.Error())
				return err
			}
			UploadFiles(uploadInfo.Files, uploadSettings)
			return ""
		}
	case "uploadDirectory":
		{
			// Parse payload json
			var uploadInfo jsprotocol.UploadDirectoryStruct
			err = json.Unmarshal([]byte(ms.Payload), &uploadInfo)

			// Parse uploadInfo.Settings
			var uploadSettings jsprotocol.UploadInfoSettings
			err = json.Unmarshal([]byte(uploadInfo.Settings), &uploadSettings)

			fmt.Println(uploadInfo)
			//UploadDirectory(uploadInfo.Path, uploadSettings)
			return ""
		}
	case "cancelUpload":
		{
			uploadCancelChan <- true
		}
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
	Window.SendMessage(string(b), responeHandler)
}

// SendString sends a string towards the javascript
func SendString(s string, responeHandler func(m *astilectron.EventMessage)) {
	Window.SendMessage(s, responeHandler)
}

// SendTags sends the gui all tags within the desired namespace
func SendTags(namespace string) {
	var tagContent []string
	tagResp, err := Manager.GetTags(namespace)

	if err == nil {
		for _, t := range tagResp {
			tagContent = append(tagContent, string(t))
		}
	}

	tagMsg := jsprotocol.TagList{User: Config.User.Username, Content: tagContent}
	tags, err := json.Marshal(tagMsg)

	if err == nil {
		fmt.Println(string(tags))
		SendMessage("tags", string(tags), HandleResponses)
	}
}

// SendInitialData sends the all initial data to the gui
func SendInitialData() error {
	// Find data from default namespace
	nsResp, err := Manager.GetNamespaces()

	// Error in config / server
	if err != nil {
		return err
	}

	var content [][]string
	for i := 0; i < len(nsResp.Slice); i++ {
		// Request Groups from server
		var ns []string
		groupResp, err := Manager.GetGroups(nsResp.Slice[i])

		if err != nil {
			fmt.Println("Error receiving groups for", nsResp.Slice[i])
			fmt.Println(err.Error())
			break
		}

		if nsResp.Slice[i][len(Config.User.Username)+1:] == "default" {
			ns = append(ns, "Default")
		} else {
			ns = append(ns, nsResp.Slice[i][len(Config.User.Username)+1:])
		}

		// Convert Attribute to string one after another
		for _, att := range groupResp {
			ns = append(ns, string(att))
		}

		content = append(content, ns)

	}

	msg := jsprotocol.NamespaceGroupsList{User: Config.User.Username, Content: content}
	namespaces, err := json.Marshal(msg)
	fmt.Println(string(namespaces))

	if err == nil {
		SendMessage("namespace/groups", string(namespaces), HandleResponses)
	}
	//SendMessage("namespace/groups", `{"content":[["Default", "Group1", "Group2"], ["Namespace2", "Group1"]]}`, HandleResponses)
	SendTags(nsResp.Slice[0])
	return nil
}
