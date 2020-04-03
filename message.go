package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/asticode/go-astilectron"
)

type message struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}

// HandleMessages handles incoming messages from the JS
func HandleMessages(m *astilectron.EventMessage) interface{} {
	// Unmarshal
	var s string
	err := m.Unmarshal(&s)

	var ms message
	err = m.Unmarshal(&s)

	if err != nil {
		fmt.Println(err.Error())
	}

	// Process message
	if ms.Type == "hello" {
		return "world"
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
