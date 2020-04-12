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
    
    astilectron.sendMessage(`{"type":"download", "payload":"`+requestedFiles+`"}`, function(message) {alert(message)});
}