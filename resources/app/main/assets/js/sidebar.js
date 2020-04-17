$('body').on('hide.bs.dropdown', function (e) {
    if (e.clickEvent) {
      e.preventDefault();
    }
})

// List-click Handler
function OnListClick(e) {

    // Get current namespace
    var j = JSON.parse(e.target.id);
    currentNamespace = j;

    // Create json
    var json = {
        type: "changeNamespaceOrGroup",
        payload: e.target.attributes.id.value
    };

    // Fill group list (used for auto completion)
    groupList = [];
    var end = e.target.parentElement.childNodes.length;
    for (var i = 1; i < end; i++) {
        var val = "" 

        try {
            val = e.target.parentElement.childNodes[i].childNodes[1].innerHTML;
        } catch (ex) {
            val = e.target.parentElement.parentElement.childNodes[i].childNodes[1].innerHTML;
            end = e.target.parentElement.parentElement.childNodes.length;
        }

        groupList.push(val);
    }
    
    astilectron.sendMessage(JSON.stringify(json), function(message) {});
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

    // Make table sort icons invisible
    sortIdIcon.style.visibility = "hidden";
    sortNameIcon.style.visibility = "hidden";
    sortSizeIcon.style.visibility = "hidden";
    sortDateIcon.style.visibility = "hidden";
    sortPublicIcon.style.visibility = "hidden";

    // Remove filters
    displayFilters = [];
    searchbar.value = "";
}