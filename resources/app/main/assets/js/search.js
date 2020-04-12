/* TODO

// Get the input field
var input = document.getElementById("seachbar");

// React on enter press
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault(); 

    // Search files
    var json = {
        type: "changeNamespaceOrGroup",
        payload: {
            namespace: currentNamespace,
            group: currentGroup,
            tag: currentTag,
            name: input.value
        }
    };

  }
}); 

// List-click Handler
function OnListClick(e) {

  

    astilectron.sendMessage(JSON.stringify(json), function(message) {});
}


*/