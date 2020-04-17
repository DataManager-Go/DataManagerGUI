package actions

import (
	"fmt"
	"strconv"

	dmlib "github.com/DataManager-Go/libdatamanager"
)

/*
*	This wraps some js calls as go functions to improve
*	codestyle and prevent duplicate code
 */

const (
	openDownloadModal  = "openDownloadOverlay"
	closeDownloadModal = "closeDownloadOverlay"
	downloadError      = "downloadError"
	downloadSuccess    = "downloadSuccess"
	downloadProgress   = "downloadProgress"
	refreshType        = "refresh"

	openUploadModal  = "openUploadOverlay"
	closeUploadModal = "closeUploadOverlay"
	uploadProgress   = "uploadProgress"
	uploadSuccess    = "uploadSuccess"
	uploadError      = "uploadError"
)

// OpenDownloadMoal opens the download modal
func OpenDownloadMoal(fileName string) {
	SendMessage(openDownloadModal, fileName, HandleResponses)
}

// CloseDownloadModal close the dl modal
func CloseDownloadModal() {
	SendMessage(closeDownloadModal, "", HandleResponses)
}

// OpenUploadMoal opens the download modal
func OpenUploadMoal(fileName string) {
	SendMessage(openUploadModal, fileName, HandleResponses)
}

// CloseUploadModal close the dl modal
func CloseUploadModal() {
	SendMessage(closeUploadModal, "", HandleResponses)
}

// UploadProgress send upload progress
func UploadProgress(percent uint8) {
	SendMessage(uploadProgress, strconv.FormatUint(uint64(percent), 10), HandleResponses)
}

// DownloadProgress send upload progress
func DownloadProgress(percent uint8) {
	SendMessage(downloadProgress, strconv.FormatUint(uint64(percent), 10), HandleResponses)
}

// UploadError display error for occured while a
// file transfer
func UploadError(text string) {
	// TODO view reason for error
	fmt.Println(text)
	SendMessage(uploadError, "", HandleResponses)
}

// DownloadError display error for occured while a
// file transfer
func DownloadError(text string) {
	// TODO view reason for error
	SendMessage(downloadError, "", HandleResponses)
}

// DownloadSuccess file transfered successfull
func DownloadSuccess() {
	SendMessage(downloadSuccess, "", HandleResponses)
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
