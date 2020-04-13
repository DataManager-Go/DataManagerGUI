// Get the modal
var modal = document.getElementById("overlayPrefab");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

/* Unused for downloads so far -> really bad there
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    cancelDownload();
}
*/

// Download Overlay
function OpenDownloadOverlay(fileName) {

    document.getElementById("overlayTitle").innerHTML = "Download";
    document.getElementById("progressTitle").innerHTML = "Downloading \""+fileName+"\"";
    document.getElementById("progressBar").style.width = "0%";

    modal.style.display = "block";
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

function createAlert(type, strongText, normalText) {
    var div = document.createElement("div");
    div.setAttribute("class", "alert alert-"+type+" alert-dismissible fade show");
    div.setAttribute("style", "position: fixed; bottom: 0; right: 0; width: 300px;");
   
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "close");
    btn.setAttribute("data-dismiss", "alert");
    btn.innerHTML = "&times;";
   
    var strong = document.createElement("strong");
    strong.innerHTML = strongText;
    
    div.appendChild(btn);
    div.appendChild(strong);
    div.innerHTML = div.innerHTML+" "+normalText;
    document.getElementById("alertBox").appendChild(div);
}