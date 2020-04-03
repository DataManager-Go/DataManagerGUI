// This will wait for the astilectron namespace to be ready
document.addEventListener('astilectron-ready', function() {
    // This will listen to messages sent by GO
    astilectron.onMessage(function(message) {
        if (message.startsWith("URL")) {
            var s = message.split("%%")[1];
            document.getElementById("serverURL").setAttribute("value", s);
        }
		return message;
    });
})


function login() {
    var json = "";

    url = document.getElementById("serverURL").value;
    name = document.getElementById("username").value;
    password = document.getElementById("password").value;

    json = `{"type":"login","url":"`+url+`", "name":"`+name+`", "password":"`+password+`"}`;

    astilectron.sendMessage(json, function(message) {
        if (message === "ServerError") {
            alert("The chosen Server can't be reached. Please check your input.")
        } else if (message === "LoginError") {
            alert("Your name and / or password is wrong. Please check your input")
        } else {
            alert(message);
        }
    });

}

function register() {
    var json = "";

    url = document.getElementById("serverURL").value;
    name = document.getElementById("username").value;
    password = document.getElementById("password").value;

    // TODO Password retype

    if (name.length > 30) {
        alert("Your Username is too long! A maximum of 30 characters is allowed.");
        return;
    }
    
    if (password.length > 80) {
        alert("Your Password is too long! A maximum of 30 characters is allowed.");
        return;
    }

    if (password.length < 7) {
        alert("Your Password is too short! A minimum of 7 characters is needed.");
        return;
    }


    json = `{"type":"register","url":"`+url+`","name":"`+name+`","password":"`+password+`"}`;
    alert(json);
    astilectron.sendMessage(json, function(message) {
        if (message.length > 0) {
            alert(message);
            alert("The chosen Server sent a bad reply. Please check your input.")
        } 
        return "";
    });

}
