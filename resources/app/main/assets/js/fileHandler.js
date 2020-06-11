// Downloads all files selected inside the table
function downloadSelectedFiles() {

    var requestedFiles = [];
    
    var filesJson = {
        files: requestedFiles
    }

    // Find marked rows and add them to the download list
    for (var i = 0; i < files.length; i++) {
        if (files[i].style.backgroundColor != "") {
            requestedFiles.push(parseInt(files[i].childNodes[0].innerHTML,10));
           
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
        fileNames = [];
        for (var i = 0; i < uploadBtn.files.length; i++) {  
            fileList.push(uploadBtn.files[i].path);
            
            // Easy 2 Read Names
            var path = uploadBtn.files[i].path.split("/"); // linux
            if (path[1] == undefined)
                path = uploadBtn.files[i].path.split("\\"); // windows 
    
            var fileName = path[path.length-1];
            fileNames.push(fileName);
        }

        OpenPrepUploadOverlay(fileNames);
    }
    else if (uploadType === "folderBtn") {

        // Empty directory
        var folderPath = "";
        try {
            folderPath = folderUploadBtn.files[0].path;
        } catch {
            createAlert("danger", "", "Selected folder was empty!");
            return;
        }

        // Easy 2 Read Path
        var path = folderPath.split("/"); // linux
        if (path[1] == undefined)
            path = folderPath.split("\\"); // windows 
    
        var directoryName = path[path.length-2];

        OpenPrepUploadOverlay(directoryName);
    } 
}

// Send upload request to golang
function sendFileUploadRequest() {
    // Dynamic settings
    var fileTags = [];
    var fileGroups = [];
    var shouldEncrypt = false;
    var shouldPublic = false;
    var shouldCompress = false;

    // Find settings according to user input
    if (checkbox_encrypt.checked) shouldEncrypt = true;
    if (checkbox_public.checked)  shouldPublic = true;
    if (checkbox_compressDir.checked)  shouldCompress = true;
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
        compress: shouldCompress
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
        
        CloseUploadPrepOverlay();
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
    CloseUploadPrepOverlay();
    astilectron.sendMessage(JSON.stringify(messageJSON), function(message) {});
}