//const dragAndDropHtml = '<div style="position:fixed; z-index:10; height: 100%; width: 100%;" id="drag_and_drop_overlay" <input id="drag_and_drop_input" class="inputfile" type="file" name="fileUpload" id="fileUploadBtn" title="" multiple onchange=\'prepareFileUploadRequest("btn")\' style="background: red; height: 100%; width: 100%; user-select: none;position:absolute; z-index:10;"> </div>';
const dragAndDrop_innerHtml = '<input id="drag_and_drop_input" class="inputfile" type="file" name="fileUpload" id="fileUploadBtn" title="" multiple onchange=\'prepareFileUploadRequest("btn")\' style="background: red; height: 100%; width: 100%; user-select: none;position:absolute; z-index:10;">';
var appended = false;
var leaves = 0;

// Prepare the variable
const dragAndDrop_DIV = document.createElement("div");
dragAndDrop_DIV.style = "background: rgb(0,0,0); opacity: .5; position:fixed; z-index:10; height: 100%; width: 100%;";
dragAndDrop_DIV.id = "drag_and_drop_overlay";
//dragAndDrop_DIV.innerHTML = dragAndDrop_innerHtml;

// Setup Drag & Drop onm the entire document
$('html').on('drop dragdrop',function(e) {

    // Open upload window
    prepareUploadFromDragAndDrop(e);
    
    // Remove overlay
    removeDragAndDrop();
});
// Prevent default and open overlay
$('html').on('dragenter',function(event){
    event.preventDefault();
    appendDragAndDrop();
});
// Prevent.
$('html').on('dragover',function(event){
    event.preventDefault();
});
// 2 as a workaround that works nicely (tested on windows)
$('html').on('dragleave',function(event){
    leaves++;  
    if (leaves == 2) 
        removeDragAndDrop();
});

// Functions to add and remove the overlay if needed

function appendDragAndDrop() {
    if (!appended)
        document.body.prepend(dragAndDrop_DIV);
}

function removeDragAndDrop() {
    var node = document.getElementById("drag_and_drop_overlay");
    if (node != null)
        node.parentNode.removeChild(node);
    
    // reset
    appended = false;
    leaves = 0; 
}