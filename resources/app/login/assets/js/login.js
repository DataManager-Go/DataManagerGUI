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

/* ---- Functions ---- */

function login() {

    url = document.getElementById("serverURL").value;
    name = document.getElementById("username").value;
    password = document.getElementById("password").value;

    var json = {
        type: "login",
        url: url,
        name: name,
        password: password
    };

    astilectron.sendMessage(JSON.stringify(json), function(message) {
        if (message === "ServerError") {
            createAlert("danger", "", "The server couldn't be reached. Please check your input");
            return;
        } else {
            createAlert("danger", "", "Your name / password is wrong. Please check your input")
            document.body.focus();
            return;
        }
    });
    return
}

function register() {
    url = document.getElementById("serverURL").value;
    name = document.getElementById("username").value;
    password = document.getElementById("password").value;

    var json = {
        type: "register",
        url: url,
        name: name,
        password: password
    };

    if (name.length > 30) {
        createAlert("danger", "", "Your Username is too long! 30 characters maximum allowed.");
        document.body.focus();
        return;
    }
    
    if (password.length > 80) {
        createAlert("danger", "", "Your Password is too long! 80 characters maxiumum allowed");
        document.body.focus();
        return;
    }

    if (password.length < 7) {
        createAlert("danger", "", "Your Password is too short! 7 characters are needed.");
        document.body.focus();
        return;
    }

    passwordRepeat = ""
    modal.style.display = "block";

}

// ---------- Password Repeat -------------- \\


// Get the modal
var modal = document.getElementById("passwordModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// ---------- Enter press -------------- \\
document.addEventListener('keydown', function(event) {
    if (event.code == 'Enter') {
        if (modal.style.display == "block") {
            // password repeat onEnterPress
            checkPasswords();
        
        } else {
            // global onEnterPress
            login();
        }
    }
});


function checkPasswords() {

    if (document.getElementById("passwordRepeat").value !== password) {
        createAlert("danger", "", "Your passwords do not match!");
        document.getElementById("passwordRepeat").value = "";
        return;
    }

    document.getElementById("passwordRepeat").value = "";

    url = document.getElementById("serverURL").value;
    name = document.getElementById("username").value;
    password = document.getElementById("password").value;

    var json = {
        type: "register",
        url: url,
        name: name,
        password: password
    };

    astilectron.sendMessage(JSON.stringify(json), function(message) {
        if (message === "success") {} else {
            createAlert("danger", "", "Either the chosen server ip is wrong or your username is already taken. Try a different one.")
        }
    });
}