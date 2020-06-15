package actions

import (
	"encoding/json"
	"fmt"
	"log"
	"sort"
	"strconv"

	jsprotocol "github.com/DataManager-Go/DataManagerGUI/jsProtocol"
	dmlib "github.com/DataManager-Go/libdatamanager"
	"github.com/asticode/go-astilectron"
	"github.com/atotto/clipboard"
)

type message struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}

type alertStruct struct {
	Type   string `json:"type"`
	Kind   string `json:"kind"`
	Strong string `json:"strongText"`
	Normal string `json:"normalText"`
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

			DownloadFiles(data.Files, DownloadDir)
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
				SendTags(info.Namespace)
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
	/* RMB Events */
	case "copyPreviewURL":
		{
			err = clipboard.WriteAll(ms.Payload)
			if err == nil {
				return true
			}
			fmt.Println("Error on URL Copy", err.Error())
			return false
		}
	case "previewFile":
		{
			id, err := strconv.ParseUint(ms.Payload, 10, 64)
			if err != nil {
				DownloadError(err.Error())
			}
			PreviewFile(uint(id))
		}
	case "delete":
		{
			// Parse payload json
			var deletionInfo jsprotocol.DeleteInformation
			err = json.Unmarshal([]byte(ms.Payload), &deletionInfo)
			if err != nil {
				return err
			}

			switch deletionInfo.Target {
			case "file":
				{
					for _, file := range deletionInfo.Files {
						err := DeleteFile(file)
						if err != nil {
							DeleteError(err.Error())
							return err
						}
					}

					LoadFiles(dmlib.FileAttributes{Namespace: deletionInfo.Namespace})
					DeleteSuccess()
				}
			case "namespace":
				{
					_, err := Manager.DeleteNamespace(deletionInfo.Namespace)
					if err != nil {
						return err
					}

					SendInitialData()
				}
			}

		}
	// If you want to believe it or not
	// But this case will publish your file
	case "publishFile":
		{
			var fileinfo jsprotocol.FileNamespaceStruct

			fmt.Println(ms.Payload)

			err = json.Unmarshal([]byte(ms.Payload), &fileinfo)
			if err != nil {
				fmt.Println(err)
				return err
			}

			fileID, err := strconv.ParseUint(fileinfo.File, 10, 64)
			if err != nil {
				return err
			}

			_, err = Manager.PublishFile("", uint(fileID), "", false, dmlib.FileAttributes{})
			if err != nil {
				fmt.Println(err)
				return err
			}

			LoadFiles(dmlib.FileAttributes{Namespace: fileinfo.Namespace})
		}
	case "create":
		{
			// Parse payload json
			var creationInfo jsprotocol.CreateOrRenameInformation
			err = json.Unmarshal([]byte(ms.Payload), &creationInfo)
			if err != nil {
				return err
			}

			switch creationInfo.Target {
			case "Namespace":
				{
					_, err := Manager.CreateNamespace(creationInfo.Name)
					if err != nil {
						return err
					}
					SendInitialData()
				}
			}
		}
	/* Keyboard Input */
	case "reload":
		{
			fmt.Println("Reload requested.")
			SendInitialData()
		}
	default:
		{
			fmt.Println("Unsupported request:", ms.Type, ms.Payload)
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

// SendAlert creates an alert inside of the GUI
// types: danger/warning/success/...
func SendAlert(typ, strongText, normalText string) {
	b, _ := json.Marshal(&alertStruct{Type: "alert", Kind: typ, Strong: strongText, Normal: normalText})
	Window.SendMessage(string(b))
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
	nsResp, err := Manager.GetUserAttributeData()

	if err != nil {
		return err
	}

	// Sort by namespace name alphabetically
	sort.Sort(dmlib.SortByName(nsResp.Namespace))

	// A Slice of silces containing the namespace, followed by its groups
	var content [][]string
	defaultIndex := 0

	for i, nsData := range nsResp.Namespace {
		ns := make([]string, len(nsData.Groups)+1)

		// Ad namespace as first slice entry
		if nsData.Name[len(Config.User.Username)+1:] == "default" {
			defaultIndex = i
			ns[0] = "Default"
			defer SendTags(nsData.Name)
		} else {
			ns[0] = nsData.Name[len(Config.User.Username)+1:]
		}

		// Add groups
		for i := range nsData.Groups {
			ns[i+1] = nsData.Groups[i]
		}

		content = append(content, ns)
	}

	// Put default as first namespace
	content[defaultIndex], content[0] = content[0], content[defaultIndex]

	msg := jsprotocol.NamespaceGroupsList{User: Config.User.Username, Content: content}
	namespaces, err := json.Marshal(msg)
	fmt.Println(string(namespaces))

	if err == nil {
		SendMessage("namespace/groups", string(namespaces), HandleResponses)
	}

	return nil
}
