package actions

/*
*	This wraps some js calls as go functions to improve
*	codestyle and prevent duplicate code
 */

const (
	openDownloadModal  = "openDownloadOverlay"
	closeDownloadModal = "closeDownloadOverlay"
	transferError      = "downloadError"
	transferSuccess    = "downloadSuccess"
)

// OpenDownloadMoal opens the download modal
func OpenDownloadMoal(fileName string) {
	SendMessage(openDownloadModal, fileName, HandleResponses)
}

// CloseDownloadModal close the dl modal
func CloseDownloadModal() {
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
