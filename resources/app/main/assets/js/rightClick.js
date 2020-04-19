// RMB listener
$('body').on('contextmenu', function(e) {

    sidebarItem = clickInsideElement(e, "sidebar");
    namespaceItem = clickInsideElement(e, "namespace");
    groupItem = clickInsideElement(e, "group");
    tableItem = clickInsideElement( e, "table_entry");
  
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

    } else {
        console.log(e.target.classList);
        // Something pressed that we didn't want: dont open
        clickedItem = null;
        closeRmbOverlay();
    }
    
    return false; //blocks default Webbrowser right click menu
  
}).on("click", function() {
    closeRmbOverlay();
});

  
// Clicked on element within overlay
$("#context-menu a").on("click", function(e) {
    alert(e.target.innerHTML);
    closeRmbOverlay();
});

// Close when pressing anywhere except the overlay
$("body").on("click", function(e) {
    clickedInsideSidebarOverlay = clickInsideElement(e, "context-menu-sidebar");
    clickedInsideNamespaceOverlay = clickInsideElement(e, "context-menu-namespace");
    clickedInsideTableOverlay = clickInsideElement(e, "context-menu-table");
    clickedInsideGroupOverlay = clickInsideElement(e, "context-menu-group");
    if (rmbOverlayIsOpened && !clickedInsideNamespaceOverlay && !clickedInsideTableOverlay && !clickedInsideGroupOverlay && !clickedInsideSidebarOverlay)
        closeRmbOverlay();
});

// Closes the overlay
function closeRmbOverlay() {
    rmbOverlayIsOpened = false;
    
    $("#context-menu-sidebar").removeClass("show").hide();
    $("#context-menu-table").removeClass("show").hide();
    $("#context-menu-namespace").removeClass("show").hide();
    $("#context-menu-group").removeClass("show").hide();
}

// Checks if a given element contains the given class
function clickInsideElement(e, className) {
    var el = e.srcElement || e.target;
    
    if ( el.classList.contains(className) ) {
        return el;
    } else {
        while ( el = el.parentNode ) {
            if ( el.classList && el.classList.contains(className) ) {
            return el;
            }
        }
    }

    return false;
}