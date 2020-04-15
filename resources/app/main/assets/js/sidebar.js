$('body').on('hide.bs.dropdown', function (e) {
    if (e.clickEvent) {
      e.preventDefault();
    }
})
// List-click Handler
function OnListClick(e) {

    var json = {
        type: "changeNamespaceOrGroup",
        payload: e.target.attributes.id.value
    };
    astilectron.sendMessage(JSON.stringify(json), function(message) {});
}

// Resize Handler
function onResize() {
    console.log($(window).height());
    if ($(window).height() < 70 * namespaceCount) {    
        document.getElementById("SideBar").classList.remove("flex-column");
        document.getElementById("title").setAttribute("style", "padding-left: 2.9rem");
        //document.getElementById("title").setAttribute("style", "padding-left: 1.655rem");
    } else {
        document.getElementById("SideBar").classList.add("flex-column");
        document.getElementById("title").setAttribute("style", "padding-left: 0rem");
    }
    
}

// Changes list length on extend / collapse
function AdjustSubentriesInListLength() {

    // length of subentries: this.childNodes[1].childNodes.length
    if (this.id == "namespaceParent_collapsed") {
        // subtract others
        var extended = document.getElementsByTagName("a");
        for (var i = 0; i < extended.length; i++) {
            if (extended[i].id === "namespaceParent_extended") {     
                extended[i].id = "namespaceParent_collapsed";
                namespaceCount -= extended[i].parentElement.childNodes[1].childNodes.length;
            }
        }
        // change
        this.id = "namespaceParent_extended";
        namespaceCount += this.parentElement.childNodes[1].childNodes.length;
    }
    else {
        this.id = "namespaceParent_collapsed";
        namespaceCount -= this.parentElement.childNodes[1].childNodes.length;
    }
    alert(namespaceCount);

    onResize();
}