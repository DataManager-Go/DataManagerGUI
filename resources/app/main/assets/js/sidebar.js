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

/*
// Resize Handler
function onResize() {
    console.log($(window).height());
    if ($(window).height() < 70 * namespaceCount) {    
    }
}
*/

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
}