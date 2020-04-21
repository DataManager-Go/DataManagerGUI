// Handles page navigation - button presses
function onPageBtnClick(page) {
    loadFilesFromPage(page);
    createNavigationButtons(page);
}

// Loads the files that should appear in a specific page's range
var filteredFilesSize = 0;
function loadFilesFromPage(page) {
    
    // Delete former entries
    document.getElementById("tableBody").innerHTML = "";

    // Filter unwanted files
    var wantedFiles = [];
    if (searchFilters.length !== 0 || tagFilters.length !== 0) {
        for (var i = 0; i < files.length; i++) {

            var fileAdded = false;

            // Search for filters from the search bar
            for (var j = 0; j < searchFilters.length; j++) {

                var name = files[i].childNodes[1].innerHTML;
                if (name.toLowerCase().indexOf(searchFilters[j].toLowerCase()) !== -1) {
                    wantedFiles.push(files[i]);
                    fileAdded = true;
                    break;
                }
                else if (files[i].childNodes[0].innerHTML === searchFilters[j]) {
                    wantedFiles.push(files[i]);
                    fileAdded = true;
                    break;
                }
            }
            // Search for tags TODO -> Make search AND combined
            if (!fileAdded) {

                for (var t = 0; t < tagFilters.length; t++) {
                    if (files[i].tags !== undefined) {
                        for (var f = 0; f < files[i].tags.length; f++) {
                            if (files[i].tags[f] === tagFilters[t]) {
                                wantedFiles.push(files[i]);
                                fileAdded = true;
                                break;
                            } else {
                                console.log(files[i].tags[f]);
                            }
                        }
                    }
                    // Exit the outer loop aswell
                    if (fileAdded)
                        break;
                }
            }
        }
    }

    // Update filteredFileSize
    filteredFilesSize = wantedFiles.length;

    // --- Didnt use filters ---- ///
    if (searchFilters.length === 0 && tagFilters.length === 0) {
        var stop = page * shownFileCap;
        if (files.length < stop)  {
            stop = files.length;
        }

        // Append new elements
        for (var i = (page-1) * shownFileCap; i < stop; i++) {
         document.getElementById("tableBody").appendChild(files[i]);
        }
    }

    // ---- Used filters ---- ///
    else {
        // Find break point
        var stop = page * shownFileCap;
        if (wantedFiles.length < stop) {
            stop = wantedFiles.length;
        }

        // Append new elements
        for (var i = (page-1) * shownFileCap; i < stop; i++) {
            document.getElementById("tableBody").appendChild(wantedFiles[i]);
        }
    }

    makeTableHighlightable();
}

// According to the amount of files, it will create enough buttons for the user
function createNavigationButtons(currentPage) {

    // Prestuff
    var fileAmount = files.length;
    if (filteredFilesSize !== 0) {
        fileAmount = filteredFilesSize;
    }
    buttonsNeeded = Math.floor(fileAmount / shownFileCap);

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