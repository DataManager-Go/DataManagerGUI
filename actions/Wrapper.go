package actions

import (
	"fmt"

	dmlib "github.com/DataManager-Go/libdatamanager"
)

/*
*	This wraps some js calls as go functions to improve
*	codestyle and prevent duplicate code
 */

const (
	openDownloadModal  = "openDownloadOverlay"
	closeDownloadModal = "closeDownloadOverlay"
	transferError      = "downloadError"
	transferSuccess    = "downloadSuccess"
	refreshType        = "refresh"
)

// OpenFileTransferMoal opens the download modal
func OpenFileTransferMoal(fileName string) {
	SendMessage(openDownloadModal, fileName, HandleResponses)
}

// CloseTransferModal close the dl modal
func CloseTransferModal() {
	SendMessage(closeDownloadModal, "", HandleResponses)
}

// FileTransferError display error for occured while a
// file transfer
func FileTransferError(text string) {
	// TODO view reason for error
	SendMessage(transferError, "", HandleResponses)
}

// FileTransferSuccess file transfered successfull
func FileTransferSuccess() {
	SendMessage(transferSuccess, "", HandleResponses)
}

// RefreshList refreshs filelist
func RefreshList() {
	SendMessage(refreshType, "", HandleResponses)
}

// LoadFiles loads and displays files
func LoadFiles(attributes dmlib.FileAttributes) {
	json, err := GetFiles("", 0, false, attributes, 0)
	if err != nil {
		fmt.Println(err)
		return
	}

	SendMessage("files", json, HandleResponses)
}
