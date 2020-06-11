// Creates an alert with the given informations (types: danger/warning/success/...)
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
    $("#"+alertNumber).on("click", function() {
        currentAlerts.shift();
        console.log(currentAlerts.length);
        for (var i = 0; i < currentAlerts.length; i++) {
            currentAlerts[i].style.marginBottom = (1 + i * 5)+"rem";
        }
    });

    setTimeout(function(e){
        $("#"+alertNumber).click();

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

// Opens the window to adjust the upload request
function OpenPrepUploadOverlay(fileName) {

    var header = "Uploading \""

    // Add every element to title as long as possible
    var fileNameText = "";
    if (Array.isArray(fileName)) {
        fileName.forEach(function(file) {
            fileNameText += file + ",";
        });
        
        header += fileNameText;
        checkbox_encrypt.parentNode.style.display = "none";
        console.log(checkbox_encrypt.parentNode.style.display);
    } else {
        header += fileName;
        checkbox_encrypt.parentNode.style.display = "block";
    }

    // Remove trailing ","
    if (header.lastIndexOf(",") == header.length-1)
        header = header.substring(0, header.length-1);

    // Finishing touches
    if (header.length > maxPrepOverlayTitleSize) 
        header = header.substring(0, maxPrepOverlayTitleSize) + "...\"";
    else 
        header += "\"";

    up_prepTitle.innerHTML = header;
    
    uploadPrepOverlay.style.display = "block";
}

// Cancels and closes the upload preperation
function CloseUploadPrepOverlay() {
    uploadPrepOverlay.style.display = "none";

    // Reset input
    up_prepTitle.innerHTML = "";
    checkbox_compressDir.checked = false;
    checkbox_public.checked = false;
    checkbox_encrypt.checked = false;
}

// -------------------------------------------------------------------------------

// Opens an Overlay with text input
// type => 0: rename, 1: create; origin => 0: namespace, 1: group, 2: tag
// target => rename target
function OpenEnterNameOverlay(type, origin, namespace, group, tag) {

    currentInputAction = [type, origin, namespace, group, tag];

    var title = "";
    var action = "";

    switch (type) {
        case 0: title = "Rename"; action = "Rename"; break;
        case 1: title = "Create"; action = "Create"; break;
    }
    switch (origin) {
        case 0: title += " Namespace"; break;
        case 1: title += " Group";  break;
        case 2: title += " Tag"; break;
    }
    
    if (group != undefined && group != null) 
        title += " \""+group+"\"";
    else if (tag != undefined && tag != null) 
        title += " \""+tag+"\"";
    else if (namespace != undefined && namespace != null) 
        title += " \""+namespace+"\"";
    

    document.getElementById("textinput_overlayTitle").innerHTML = title;
    document.getElementById("textinput_overlayButton").innerHTML = action;
    document.getElementById("textinputOverlay").style.display = "block";
}

// Send the desired input action
function InputOverlayAction() {

    // Get the selected type
    var targetStr = "";

    switch ( currentInputAction[1]) {
        case 0: targetStr = "Namespace"; break;
        case 1: targetStr = "Group";  break;
        case 2: targetStr = "Tag"; break;
    }

    // Get the action
    var action = (currentInputAction[0] == 0) ? "Rename" : "Create";

    // Create the inner JSON
    var targetJson = {
        target:    targetStr,
        name:      textinput_overlayInput.value,
        namespace: currentInputAction[2],
        group:     currentInputAction[3],
        tag:       currentInputAction[4]
    }
    
    // Create the whole JSON
    var json = {
        type: action,
        payload: JSON.stringify(targetJson)
    }

    // Send to GO and close the overlay
    astilectron.sendMessage(JSON.stringify(json), function(message) {});
    CloseTextInputOverlay();
}

// Close any input overlay
function CloseTextInputOverlay() {
    document.getElementById("textinputOverlay").style = "";
}
