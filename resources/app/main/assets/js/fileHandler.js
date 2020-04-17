// Downloads all files selected inside the table
function downloadSelectedFiles() {

    var requestedFiles = [];
    
    var filesJson = {
        files: requestedFiles
    }

    // Find marked rows and add them to the download list
    
    
    
   // alert(files[0].childNodes[0].innerHTML+" - "+files[0].hilite);

    for (var i = 0; i < files.length; i++) {
        if (files[i].style.backgroundColor != "") {
            requestedFiles.push(parseInt(files[i].childNodes[0].innerHTML,10));
            alert("adding "+files[i].childNodes[0].innerHTML);

            files[i].style.backgroundColor= files[i].origColor;
            files[i].hilite = false;
        }
    }
    
    var json = {
        type: "download",
        payload: "\""+JSON.stringify(filesJson)+"\""
    }

    astilectron.sendMessage(JSON.stringify(json), function(message) {});
}

// Prepare upload / start settings input
function prepareFileUploadRequest(fileUploadType) {
    uploadType = fileUploadType;
    fileList = [];

    // Select file(s)
    if (uploadType === "btn") {
        for (var i = 0; i < uploadBtn.files.length; i++) {  
            fileList.push(uploadBtn.files[i].path);
        }
    }
    else if (uploadType === "folderBtn") {
        var path = folderUploadBtn.files[0].path.split("/"); // linux
        if (path[1] == undefined)
            path = folderUploadBtn.files[0].path.split("\\"); // windows 
    
        var directoryName = path[path.length-2];
    }

    OpenUploadSettingsOverlay();
}

// Send upload request to golang
function sendFileUploadRequest() {
    // Dynamic settings
    var fileTags = [];
    var fileGroups = [];
    var shouldEncrypt = false;
    var shouldPublic = false;

    // Find settings according to user input
    if (encryptInput.value === "on") shouldEncrypt = true;
    if (publicInput.value === "on") shouldPublic = true;
    fileTags = tagInput.value.replace(", ", ",").split(",");
    if (!fileTags[fileTags.length-1].match(/^[0-9a-zA-Z]+$/)) fileTags.pop();
    fileGroups = groupInput.value.replace(", ", ",").split(",");
    if (!fileGroups[fileGroups.length-1].match(/^[0-9a-zA-Z]+$/)) fileGroups.pop();
    

    // Settings JSON
    var uploadSettings = {
        namespace: currentNamespace,
        tags: fileTags,
        groups: fileGroups,
        encrypt: shouldEncrypt,
        public: shouldPublic,
    }

    // Find files
    if (uploadType === "folderBtn") {

        var path = folderUploadBtn.files[0].path.split("/"); // linux
        if (path[1] == undefined) {
            path = folderUploadBtn.files[0].path.split("\\"); // windows 
        }

        var directoryName = "";
        for (var i = 0; i < path.length-2; i++) {
            directoryName += path[i] + "/";
        }

        // Directory upload - request JSON
        var dirJSON = {
            dir: directoryName,
            settings: JSON.stringify(uploadSettings)
        }
        var messageJSON = {
            type: "uploadDirectory",
            payload: JSON.stringify(dirJSON)
        }
        
        CloseUploadSettingsOverlay();
        astilectron.sendMessage(JSON.stringify(messageJSON), function(message) {});
        return;
    }

    // File upload - request JSON
    var fileJSON = {
        files: fileList,
        settings: JSON.stringify(uploadSettings)
    }
    var messageJSON = {
        type: "uploadFiles",
        payload: JSON.stringify(fileJSON)
    }

    // Close overlay and send message
    CloseUploadSettingsOverlay();
    astilectron.sendMessage(JSON.stringify(messageJSON), function(message) {});
}