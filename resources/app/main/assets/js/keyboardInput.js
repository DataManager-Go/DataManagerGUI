document.onkeydown= function(key){ reactKey(key); }

// React to keyboard input
function reactKey(event) {
    switch(event.keyCode) {
        // Reload Page (F5)
        case 116: 
        {
            // Create the whole JSON
            var json = {
                type: "reload",
                payload: ""
            }

            // send
            astilectron.sendMessage(JSON.stringify(json), function(msg) {});
            break;
        }
    }
 }