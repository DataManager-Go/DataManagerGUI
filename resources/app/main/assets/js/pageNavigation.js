// Handles page navigation - button presses
function onPageBtnClick(page) {
    loadFilesFromPage(page);
    createNavigationButtons(page);
}

// Loads the files that should appear in a specific page's range
function loadFilesFromPage(page) {
    
    // Delete former entries
    document.getElementById("tableBody").innerHTML = "";

    // Find break point
    var stop = page * shownFileCap;
    if (files.length < stop)  {
        stop = files.length;
    }

    // Append new elements
    for (var i = (page-1) * shownFileCap; i < stop; i++) {
        document.getElementById("tableBody").appendChild(files[i]);
    }

    makeTableHighlightable();
}

// According to the amount of files, it will create enough buttons for the user
function createNavigationButtons(currentPage) {

    // Prestuff
    var fileAmount = files.length;
    var buttonsNeeded = Math.floor(fileAmount / shownFileCap);

    // Delete potential former navigation buttons
    document.getElementById("buttonContainer").innerHTML = "";

    // Return if not even a page was filled
    if (fileAmount / shownFileCap < 1) {return;}

    var i = 1;
    var stop = buttonsNeeded;

    // On higher pages, "..." the beginning
    var usedPreBtns = false;
    if (currentPage >= 5 && buttonsNeeded > 5) {
        i = currentPage - 1;

        // Add beginning buttons
        var btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-primary border rounded-circle");
        btn.setAttribute("type", "button");
        btn.setAttribute("style", "color: rgb(0,0,0);background-color: rgba(0,0,0,0.2);");
        btn.setAttribute("onclick", "onPageBtnClick(1)")
        btn.innerHTML = ""+1;

        var btn2 = document.createElement("button");
        btn2.setAttribute("class", "btn btn-primary border rounded-circle");
        btn2.setAttribute("type", "button");
        btn2.setAttribute("style", "color: rgb(0,0,0);background-color: rgba(0,0,0,0.2);");
        btn2.innerHTML = "..."; 

        document.getElementById("buttonContainer").appendChild(btn);
        document.getElementById("buttonContainer").appendChild(btn2);

        usedPreBtns = true;
    }

    // On lower pages, "..." the ending
    var trailDot;
    var trailBtn;
    if (currentPage <= buttonsNeeded - 4  && buttonsNeeded > 5) {

        if (usedPreBtns) {
            stop = i + 2;
        } else {
            stop = 5
        }

        // Add trailing buttons
        trailDot = document.createElement("button");
        trailDot.setAttribute("class", "btn btn-primary border rounded-circle");
        trailDot.setAttribute("type", "button");
        trailDot.setAttribute("style", "color: rgb(0,0,0);background-color: rgba(0,0,0,0.2);");
        trailDot.innerHTML = "...";

        trailBtn = document.createElement("button");
        trailBtn.setAttribute("class", "btn btn-primary border rounded-circle");
        trailBtn.setAttribute("type", "button");
        trailBtn.setAttribute("style", "color: rgb(0,0,0);background-color: rgba(0,0,0,0.2);");
        trailBtn.setAttribute("onclick", "onPageBtnClick("+buttonsNeeded+")");
        trailBtn.innerHTML = buttonsNeeded;
    } else if (usedPreBtns) {
        i = buttonsNeeded - 4;
    }

    while (i <= stop) {
        // Add Buttons
        var btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-primary border rounded-circle");
        btn.setAttribute("type", "button");
        btn.setAttribute("style", "color: rgb(0,0,0);background-color: rgba(0,0,0,0.2);");
        btn.innerHTML = i;

        // Mark current selection
        if (i == currentPage) {
            btn.setAttribute("style", "color: rgb(255,255,255);background-color: rgba(30, 39, 51, 1);");
        } else {
            btn.setAttribute("onclick", "onPageBtnClick("+i+")");
        }

        // Append
        document.getElementById("buttonContainer").appendChild(btn);

        i++
    }

    if (trailDot !== null) {
        document.getElementById("buttonContainer").appendChild(trailDot);
        document.getElementById("buttonContainer").appendChild(trailBtn);
    }
}