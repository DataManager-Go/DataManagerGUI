// RMB listener on table elements
$('#tableDiv').on('contextmenu', function(e) {

    clickedItem = clickInsideElement( e, "table_entry" );
  
    if (clickedItem) {
        // alert(clickedItem.childNodes[0].innerHTML);
        // Prevent default
        e.preventDefault();

        // Open Menu
        rmbOverlayIsOpened = true;
        var top = e.pageY - 10;
        var left = e.pageX - 90;
        $("#context-menu").css({
            display: "block",
            top: top,
            left: left
        }).addClass("show");

    } else {
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
$("body").on("click", function() {
    clickedInsideOverlay = clickInsideElement(e, "context-menu");
    if (rmbOverlayIsOpened && !clickedInsideOverlay)
        closeRmbOverlay();
});

// Closes the overlay
function closeRmbOverlay() {
    rmbOverlayIsOpened = false;
    $("#context-menu").removeClass("show").hide();
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