// Get the modal
var modal = document.getElementById("overlayPrefab");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// Download Overlay
function OpenDownloadOverlay(fileName) {

    document.getElementById("overlayTitle").innerHTML = "Download";
    document.getElementById("progressTitle").innerHTML = "Downloading \""+fileName+"\"";
    document.getElementById("progressBar").style.width = "0%";

    modal.style.display = "block";
}

// Updates file name and progress
function UpdateDownloadInformation(informations) {

    if (informations[0] !== "") {
        document.getElementById("progressTitle").innerHTML = "Downloading \""+informations[1]+"\"";
    }
    if (informations[1] !== "") {
        document.getElementById("progressBar").style.width = informations[1]+"%";
    }
}

// Cancels any current download
function cancelDownload() {

    var json = {
        type: "cancelDownload",
        payload: ""
    };

    astilectron.sendMessage(JSON.stringify(json), function(message) {});
}