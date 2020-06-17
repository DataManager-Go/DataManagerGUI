// Mouse listener (Main events)
$('body').on('contextmenu', function(e) {   
    handleRmbEvent_RightClick(e);
    return false; //blocks default Webbrowser right click menu
}).on("click", function(e) {
   handleRmbEvent_LeftClick(e);
});

// Mouse listener (Non-element click)
$('html').on('contextmenu', function(e) { 
    handleRmbEvent_LeftClick(e); // rmb events need to do the lmb event here
    return false; //blocks default Webbrowser right click menu
}).on("click", function(e) {
    handleRmbEvent_LeftClick(e);
});

// Function to handle right clicks
function handleRmbEvent_RightClick(e) {
    sidebarItem   =   clickInsideElement(e, "sidebar");
    namespaceItem =   clickInsideElement(e, "namespace");
    allFilesItem  =   clickInsideElement(e, "allFiles");
    groupItem     =   clickInsideElement(e, "group");
    tableItem     =   clickInsideElement(e, "table_entry");
    tagList       =   clickInsideElement(e, "tagList");
    tagItem       =   clickInsideElement(e, "tagBtn");
  
      // Set the pressed object
      lastRmbElement2 = e.srcElement || e.target;

    if (sidebarItem || namespaceItem || groupItem || tableItem || allFilesItem || tagList || tagItem) {
        // Prevent default
        e.preventDefault();

        // Close potential other overlays
        closeRmbOverlay();

        // Open Menu
        rmbOverlayIsOpened = true;
        var top = e.pageY - 10;
        var left = e.pageX - 90;

        // Set the pressed object
        lastRmbElement = e.srcElement || e.target;

        // Namespace menu
        if (namespaceItem) {

            // Find the Namespace's name
            var name = "";
            try {
                name = lastRmbElement.childNodes[1].innerHTML;
            } catch {
                name = lastRmbElement.parentNode.childNodes[1].innerHTML;
            }

            // Open the overlay if it is not the "Default" Namespace
            if (name != "Default") {
                $("#context-menu-namespace").css({
                    display: "block",
                    top: top,
                    left: left
                }).addClass("show");
            }
        }
        // Group menu
        else if (groupItem) 
            $("#context-menu-group").css({
                display: "block",
                top: top,
                left: left
            }).addClass("show");
        // All files menu
        else if (allFilesItem)
            $("#context-menu-group-2").css({
                display: "block",
                top: top,
                left: left
            }).addClass("show");
        // Table menu
        else if (tableItem) 
            $("#context-menu-table").css({
                display: "block",
                top: top,
                left: left
            }).addClass("show");
        // Sidebar menu
        else if (sidebarItem && !clickInsideElement(e, "allFiles")) 
            $("#context-menu-sidebar").css({
                display: "block",
                top: top,
                left: left
            }).addClass("show");
        // Tag
        else if (tagItem)
        $("#context-menu-tag").css({
            display: "block",
            top: top,
            left: left
        }).addClass("show");
        // TagList
        else if (tagList)
        $("#context-menu-tagList").css({
            display: "block",
            top: top,
            left: left
        }).addClass("show");

    } else {
        // Something pressed that we didn't want: dont open
        clickedItem = null;
        closeRmbOverlay();
    }
}

// Function to handle left clicks
function handleRmbEvent_LeftClick(e) {
     // Close when pressing anywhere on the body except the elements
     clickedInsideSidebarOverlay = clickInsideElementID(e, "context-menu-sidebar");
     clickedInsideNamespaceOverlay = clickInsideElementID(e, "context-menu-namespace");
     clickedInsideTableOverlay = clickInsideElementID(e, "context-menu-table");
     clickedInsideGroupOverlay = clickInsideElementID(e, "context-menu-group");
     clickedInsideAllFilesOverlay = clickInsideElementID(e, "context-menu-group-2");
     clickedInsideTagOverlay = clickInsideElementID(e, "context-menu-tag");
     clickedInsideTagListOverlay = clickInsideElementID(e, "context-menu-tagList");
 
     if (rmbOverlayIsOpened && !clickedInsideNamespaceOverlay && !clickedInsideTableOverlay && !clickedInsideGroupOverlay && !clickedInsideSidebarOverlay && !clickedInsideAllFilesOverlay && !clickedInsideTagOverlay && !clickedInsideTagListOverlay) {
         closeRmbOverlay();
         if (clickInsideElement(e, "rmbItem"))
             rmbMenuClick(e.target.id);
     }
}

// Closes the overlay
function closeRmbOverlay() {
    rmbOverlayIsOpened = false;
    
    $("#context-menu-sidebar").removeClass("show").hide();
    $("#context-menu-table").removeClass("show").hide();
    $("#context-menu-namespace").removeClass("show").hide();
    $("#context-menu-group").removeClass("show").hide();
    $("#context-menu-group-2").removeClass("show").hide();
    $("#context-menu-tagList").removeClass("show").hide();
    $("#context-menu-tag").removeClass("show").hide();
}

// Checks if a given element contains the given id
function clickInsideElementID(e, idName) {
    var el = e.srcElement || e.target;

    if (el.id === idName)
        return true;
    else 
        return false;
}

// Checks if a given element contains the given class 
function clickInsideElement(e, className) {
    var el = e.srcElement || e.target;

    if (el.classList.contains(className)) {
        return el;
    } else {
        while (el = el.parentNode) {
            if (el.classList && el.classList.contains(className)) {
            return el;
            }
        }
    }

    return false;
}

// Overlay Button press
function rmbMenuClick(menuOption) {
    console.log(menuOption);

    switch (menuOption) {
        // Preview
        case "rmb_1": 
        {
            // Message struct
            var message = {
                type: "previewFile",
                payload: ""+parseInt(lastRmbElement.parentNode.childNodes[0].innerHTML, 10)
            }
            
            // send
            astilectron.sendMessage(JSON.stringify(message), function(msg) {});
            break;
        }
        // Publish
        case "rmb_3": 
        {
            // Payload
            var payload = {
                namespace: currentNamespace,
                file: ""+parseInt(lastRmbElement.parentNode.childNodes[0].innerHTML, 10)
            }

            // Message struct
            var message = {
                type: "publishFile",
                payload: JSON.stringify(payload)
            }

            // send
            astilectron.sendMessage(JSON.stringify(message), function(msg) {});
            break;
        }
        // Copy public URL
        case "rmb_4":
        {
            // get url code if possible
            var urlCode = lastRmbElement.parentNode.childNodes[2].innerHTML;
            if (urlCode.length === 0) 
                createAlert("warning", "", "The selected file isn't public!");
            // send and react to answer
            else {
                astilectron.sendMessage('{"type":"copyPreviewURL", "payload":"'+urlCode+'"}', function(message) {
                    if (message) 
                        createAlert("success", "", "URL copied!");
                    else 
                        createAlert("danger", "Error", "when copying URL!");
                });
            }
            break;
        }
        // Download
        case "rmb_5":
        {
            var requestedFiles = [];

            // Find marked rows and add them to the file list
            for (var i = 0; i < files.length; i++) {
                if (files[i].style.backgroundColor != "") {
                    requestedFiles.push(parseInt(files[i].childNodes[0].innerHTML,10));
                   
                    files[i].style.backgroundColor= files[i].origColor;
                    files[i].hilite = false;
                }
            }

            // No files selected?
            if (requestedFiles.length == 0) {
                createAlert("warning", "", "No files selected");
            }
            else {
                // inner json
                var filesJson = {
                    files: requestedFiles
                }
                // outer json
                var json = {
                    type: "download",
                    payload: "\""+JSON.stringify(filesJson)+"\""
                }
                // send
                astilectron.sendMessage(JSON.stringify(json), function(message) {});
            }
            break;
        }
        // Delete Files
        case "rmb_6": 
        {
            var requestedFiles = [];

            // Find marked rows and add them to the file list
            for (var i = 0; i < files.length; i++) {
                if (files[i].style.backgroundColor != "") {
                    console.log(files[i]);
                    requestedFiles.push(parseInt(files[i].childNodes[0].innerHTML,10));
                   
                    files[i].style.backgroundColor= files[i].origColor;
                    files[i].hilite = false;
                }
            }

            // Confirm dialoge
            if (requestedFiles.length == 0) {
                createAlert("warning", "", "No files selected");
            } else {
                confirmDialog("Do you really want to delete "+requestedFiles.length+" file(s)?", function() {
                    sendDeletionRequest("file", currentNamespace, "", "", requestedFiles);
                });
            }
            break;
        }
        // Create Namespace
        case "rmb_7":
        {
            // Open Input Dialog for creating a namespace
            OpenEnterNameOverlay(1, 0);
            break;
        }
        // Rename Namespace
        case "rmb_8":
        {

            // Find the Namespace's name
            var name = "";
            try {
                name = lastRmbElement.childNodes[1].innerHTML;
            } catch {
                name = lastRmbElement.parentNode.childNodes[1].innerHTML;
            }

            // Open Input Dialog for renaming a namespace
            OpenEnterNameOverlay(0, 0, name);
            break;
        }
        // Delete Namespace
        case "rmb_9" :
        {
            // Find the Namespace's name
            var name = "";
            try {
                name = lastRmbElement.childNodes[1].innerHTML;
            } catch {
                name = lastRmbElement.parentNode.childNodes[1].innerHTML;
            }

            confirmDialog("Do you really want to delete \""+name+"\"?", function() {
                sendDeletionRequest("namespace", name);
            });
            break;
        }
        // Create Group
        case "rmb_10" :
        {
            // Find the Namespace's name
            var nsName = "";

            json = lastRmbElement.parentNode.id;
            if (json.length < 1) {
                nsName = JSON.parse(lastRmbElement.parentNode.childNodes[0].id).namespace;
            } else
                nsName = JSON.parse(json).namespace;

            
            // Open Input Dialog for group's name
            OpenEnterNameOverlay(1, 1, nsName);
            break;
        }
        // Rename Group
        case "rmb_11" :
        {
            // Find the Namespace's and Group's names
            var nsName = "";
            var groupName = "";

            json = lastRmbElement.parentNode.id;
            if (json.length < 1) {
                jsonP = JSON.parse(lastRmbElement.parentNode.childNodes[1].id)
                nsName = jsonP.namespace;
                groupName = jsonP.group;
            } else {
                jsonP = JSON.parse(json)
                nsName = jsonP.namespace;
                groupName = jsonP.group;
             }
 
            // Open Input Dialog for group's name
            OpenEnterNameOverlay(0, 1, nsName, groupName);
            break;
        }
        // Delete Group
        case "rmb_12" :
        {
            // Find the Namespace's and Group's names
            var nsName = "";
            var groupName = "";

            json = lastRmbElement.parentNode.id;
            if (json.length < 1) {
                jsonP = JSON.parse(lastRmbElement.parentNode.childNodes[1].id)
                nsName = jsonP.namespace;
                groupName = jsonP.group;
            } else {
                jsonP = JSON.parse(json)
                nsName = jsonP.namespace;
                groupName = jsonP.group;
            }

            // Confirm dialoge
            confirmDialog("Do you really want to delete \""+groupName+"\"?", function() {
                sendDeletionRequest("group", nsName, groupName);
            });
            break;
        }
        // Create Tag
        case "rmb_13":
        {
            OpenEnterNameOverlay(1, 2);
            break;
        }
        // Rename Tag
        case "rmb_14":
        {
            OpenEnterNameOverlay(0, 2, "", "", lastRmbElement.innerHTML);
            break;
        }
        // Delete Tag
        case "rmb_15":
        {   
            var name = lastRmbElement.innerHTML;

            confirmDialog("Do you really want to delete \""+name+"\"?", function() {
                sendDeletionRequest("tag", "", "", name);
            });
            break;
        }
    }
}

// Sends the JSON containing informations on deleting something
// target = Namespace, Group, Tag, File
function sendDeletionRequest(target, namespace, group, tag, files) {
    // Create the inner JSON
    var delInfoJSON = {
        target: target,
        namespace: namespace,
        group: group,
        tag: tag,
        files: files
    }

    // Create the whole JSON
    var json = {
        type: "delete",
        payload: JSON.stringify(delInfoJSON)
    }

    // send
    astilectron.sendMessage(JSON.stringify(json), function(msg) {});
}