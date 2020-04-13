// Downloads all files selected inside the table
function downloadSelectedFiles() {

    var requestedFiles = [];
    
    var filesJson = {
        files: requestedFiles
    }

    // Find marked rows and add them to the download list
    var table = document.getElementById('tableID'); 
    for (var i = 1; i < table.rows.length; i++) {
        if (table.rows[i].style.backgroundColor != "") {
            requestedFiles.push(parseInt(table.rows[i].cells[0].innerHTML,10));

            table.rows[i].style.backgroundColor= table.rows[i].origColor;
            table.rows[i].hilite = false;
        }
    }
    
    var json = {
        type: "download",
        payload: "\""+JSON.stringify(filesJson)+"\""
    }

    astilectron.sendMessage(JSON.stringify(json), function(message) {});
}

// Upload
var uploadBtn = document.getElementById('fileUploadBtn');
var folderUploadBtn = document.getElementById("folderUploadBtn");

// Upload: TODO Select namespace, group, tag
function uploadSelectedFiles(uploadType) {

    // Predefinitions
    var fileList = [];
    var fileJson = {
        type: "upload",
        payload: {
            files: fileList
        }
    }

    // Find files
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
        alert(directoryName);

        var folderJson = {
            type: "uploadDirectory",
            payload: directoryName
        }   

        alert(JSON.stringify(folderJson));
        return;
    }

    // Send message
    alert(JSON.stringify(fileJson));
    astilectron.sendMessage(JSON.stringify(fileJson), function(message) {});
}