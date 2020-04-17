// Creates an alert with the given informations (types: error/warning/success/...)
function createAlert(type, strongText, normalText) {
    var alertNumber = "alertNumber_"+currentAlerts.length;
    var marginBottom = 1 + currentAlerts.length * 5;

    var div = document.createElement("div");
    div.setAttribute("class", "alert alert-"+type+" alert-dismissible fade show");
    div.setAttribute("style", "position: fixed; bottom: 0; right: 0; width: 300px; margin-bottom: "+marginBottom+"rem");
   
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "close");
    btn.setAttribute("data-dismiss", "alert");
    btn.setAttribute("id", alertNumber)
    btn.innerHTML = "&times;";
   
    var strong = document.createElement("strong");
    strong.innerHTML = strongText;
    
    div.appendChild(btn);
    div.appendChild(strong);
    div.innerHTML = div.innerHTML+" "+normalText;
    document.getElementById("alertBox").appendChild(div);
    currentAlerts.push(div);

    // Automatically remove alert after 5 seconds
    setTimeout(function(){
        $("#"+alertNumber).click();

        currentAlerts.shift();
        for (var i = 0; i < currentAlerts.length; i++) {
            currentAlerts[i].style.marginBottom = (1 + i * 5)+"rem";
        }

    }, 5000);
}

// *********** Overlays *********** //

// Download Overlay
function OpenDownloadOverlay(fileName) {

    document.getElementById("dl_overlayTitle").innerHTML = "Download";
    document.getElementById("dl_progressTitle").innerHTML = "Downloading \""+fileName+"\"";
    document.getElementById("dl_progressBar").style.width = "0%";

    document.getElementById("downloadOverlay").style.display = "block";
}

// Cancels any current download
function cancelDownload() {

    var json = {
        type: "cancelDownload",
        payload: ""
    };

    astilectron.sendMessage(JSON.stringify(json), function(message) {});
    createAlert("danger", "", "Download canceled");
}

// -------------------------------------------------------------------------------

// Upload Settings Overlay
function OpenUploadSettingsOverlay() {
   document.getElementById("uploadSettingsOverlay").style.display = "block";
}

function CloseUploadSettingsOverlay() {
    document.getElementById("uploadSettingsOverlay").style.display = "none";
    
    // Reset input
    fileUploadBtn.value = null;
    folderUploadBtn.value = null;
}

// Upload Overlay
function OpenUploadOverlay(fileName) {

    document.getElementById("up_overlayTitle").innerHTML = "Upload";
    document.getElementById("up_progressTitle").innerHTML = "Uploading \""+fileName+"\"";
    document.getElementById("up_progressBar").style.width = "0%";

    document.getElementById("uploadOverlay").style.display = "block";
}

// Cancels any current upload TODO
function cancelUpload() {
    var json = {
        type: "cancelUpload",
        payload: ""
    };

    astilectron.sendMessage(JSON.stringify(json), function(message) {});
    createAlert("danger", "", "Upload canceled");
    
    document.getElementById("uploadOverlay").style.display = "none";

    // Reset input
    fileUploadBtn.value = null;
    folderUploadBtn.value = null;
}

// document.getElementById("uploadSettingsOverlay").style.display = "block";
