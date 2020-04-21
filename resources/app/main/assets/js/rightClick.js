// RMB listener
$('body').on('contextmenu', function(e) {

    sidebarItem = clickInsideElement(e, "sidebar");
    namespaceItem = clickInsideElement(e, "namespace");
    groupItem = clickInsideElement(e, "group");
    tableItem = clickInsideElement(e, "table_entry");
  
    if (sidebarItem || namespaceItem || groupItem || tableItem) {
        // Prevent default
        e.preventDefault();

        // Close potential over overlays
        closeRmbOverlay();

        // Open Menu
        rmbOverlayIsOpened = true;
        var top = e.pageY - 10;
        var left = e.pageX - 90;

        if (namespaceItem)
            $("#context-menu-namespace").css({
                display: "block",
                top: top,
                left: left
            }).addClass("show");
        else if (groupItem) 
            $("#context-menu-group").css({
                display: "block",
                top: top,
                left: left
            }).addClass("show");
        else if (tableItem) 
            $("#context-menu-table").css({
                display: "block",
                top: top,
                left: left
            }).addClass("show");
        else if (sidebarItem && !clickInsideElement(e, "allFiles")) 
            $("#context-menu-sidebar").css({
                display: "block",
                top: top,
                left: left
            }).addClass("show");

        lastRmbElement = e.srcElement || e.target;

    } else {
        // Something pressed that we didn't want: dont open
        clickedItem = null;
        closeRmbOverlay();
    }
    
    return false; //blocks default Webbrowser right click menu
  
}).on("click", function(e) {
    // Close when pressing anywhere on the body except the elements
    clickedInsideSidebarOverlay = clickInsideElementID(e, "context-menu-sidebar");
    clickedInsideNamespaceOverlay = clickInsideElementID(e, "context-menu-namespace");
    clickedInsideTableOverlay = clickInsideElementID(e, "context-menu-table");
    clickedInsideGroupOverlay = clickInsideElementID(e, "context-menu-group");
    if (rmbOverlayIsOpened && !clickedInsideNamespaceOverlay && !clickedInsideTableOverlay && !clickedInsideGroupOverlay && !clickedInsideSidebarOverlay) {
        closeRmbOverlay();
        if (clickInsideElement(e, "rmbItem"))
            rmbMenuClick(e.target.id);
    }
});

// Closes the overlay
function closeRmbOverlay() {
    rmbOverlayIsOpened = false;
    
    $("#context-menu-sidebar").removeClass("show").hide();
    $("#context-menu-table").removeClass("show").hide();
    $("#context-menu-namespace").removeClass("show").hide();
    $("#context-menu-group").removeClass("show").hide();
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
        // Copy public URL
        case "rmb_5":
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
        // Download
        case "rmb_6":
            // inner json
            var filesJson = {
                files: [parseInt(lastRmbElement.parentNode.childNodes[0].innerHTML, 10)]
            }
            // outer json
            var json = {
                type: "download",
                payload: "\""+JSON.stringify(filesJson)+"\""
            }
            // send
            astilectron.sendMessage(JSON.stringify(json), function(message) {});
            break;
    }
}