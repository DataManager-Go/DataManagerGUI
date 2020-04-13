// Downloads all files selected inside the table
function downloadSelectedFiles() {

    var requestedFiles = "";
    var addedFiles = 0;

    // Find marked rows and add them to the download list
    var table = document.getElementById('tableID'); 
    for (var i = 1; i < table.rows.length; i++) {
        if (table.rows[i].style.backgroundColor != "") {
            if (addedFiles == 0) {
                requestedFiles = table.rows[i].cells[0].innerHTML
                addedFiles++;
            } else {
                requestedFiles += ("," + table.rows[i].cells[0].innerHTML)
            }

            table.rows[i].style.backgroundColor= table.rows[i].origColor;
            table.rows[i].hilite = false;
        }
    }
    
    astilectron.sendMessage(`{"type":"download", "payload":"`+requestedFiles+`"}`, function(message) {});
}

// Upload
var uploadBtn = document.getElementById('fileUploadBtn');
var folderUploadBtn = document.getElementById("folderUploadBtn");

function uploadSelectedFiles(uploadType) {

    var fileList;

    if (uploadType === "btn") {
        for (var i = 0; i < uploadBtn.files.length; i++) {  
            fileList.push(uploadBtn.files[i].path);
        }
    }
    else if (uploadType === "folderBtn") { 
        for (var i = 0; i < folderUploadBtn.files.length; i++) {
            fileList.push(folderUploadBtn.files[i].path);
        }
    }

    var json = {
        type: "upload",
        payload: fileList
    }

    astilectron.sendMessage(JSON.stringify(json), function(message) {});
}