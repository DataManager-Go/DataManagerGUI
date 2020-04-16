var table = document.getElementById('tableID');
resizableGrid(table);

function resizableGrid(table) {
    var row = table.getElementsByTagName('tr')[0],
    cols = row ? row.children : undefined;
    if (!cols) return;
    
    table.style.overflow = 'hidden';
    
    var tableHeight = table.offsetHeight;
    
    for (var i=0;i<cols.length;i++){
     var div = createDiv(tableHeight);
     cols[i].appendChild(div);
     cols[i].style.position = 'relative';
     setListeners(div);
    }
   
    function setListeners(div){
     var pageX,curCol,nxtCol,curColWidth,nxtColWidth;
   
     div.addEventListener('mousedown', function (e) {
      curCol = e.target.parentElement;
      nxtCol = curCol.nextElementSibling;
      pageX = e.pageX; 
    
      var padding = paddingDiff(curCol);
    
      curColWidth = curCol.offsetWidth - padding;
      if (nxtCol)
       nxtColWidth = nxtCol.offsetWidth - padding;
     });
   
     div.addEventListener('mouseover', function (e) {
      e.target.style.borderRight = '2px solid rgb(33,74,128)';
     })
   
     div.addEventListener('mouseout', function (e) {
      e.target.style.borderRight = '';
     })
   
     document.addEventListener('mousemove', function (e) {
      if (curCol) {
       var diffX = e.pageX - pageX;
    
       if (nxtCol)
        nxtCol.style.width = (nxtColWidth - (diffX))+'px';
   
       curCol.style.width = (curColWidth + diffX)+'px';
      }
     });
   
     document.addEventListener('mouseup', function (e) { 
      curCol = undefined;
      nxtCol = undefined;
      pageX = undefined;
      nxtColWidth = undefined;
      curColWidth = undefined
     });
    }
    
    function createDiv(height){
     var div = document.createElement('div');
     div.style.top = 0;
     div.style.right = 0;
     div.style.width = '5px';
     div.style.position = 'absolute';
     div.style.cursor = 'col-resize';
     div.style.userSelect = 'none';
     div.style.height = height + 'px';
     return div;
    }
    
    function paddingDiff(col){
    
     if (getStyleVal(col,'box-sizing') == 'border-box'){
      return 0;
     }
    
     var padLeft = getStyleVal(col,'padding-left');
     var padRight = getStyleVal(col,'padding-right');
     return (parseInt(padLeft) + parseInt(padRight));
   
    }
   
    function getStyleVal(elm,css){
     return (window.getComputedStyle(elm, null).getPropertyValue(css))
    }
};


// Table highlighting TODO Use it to do stuff (check for hilite - true)
function makeTableHighlightable() {
  for (var i=1;i < table.rows.length;i++){
    table.rows[i].onclick= function () {
        if(!this.hilite){
          this.origColor=this.style.backgroundColor;
          this.style.backgroundColor='#BCD4EC';
          this.hilite = true;
        }
        else{
          this.style.backgroundColor=this.origColor;
          this.hilite = false;
        }
    }
  }
}

/* ------ Table sorting ------ TODO*/ 
var currentlySorted = "";
var currentSortDirection ="";

var sortIdIcon = document.getElementById("sortIdIcon");
var sortNameIcon = document.getElementById("sortNameIcon");
var sortSizeIcon = document.getElementById("sortSizeIcon");
var sortDateIcon = document.getElementById("sortDateIcon");
var sortPublicIcon = document.getElementById("sortPublicIcon");

// Sorts the entire current table by the id's
function sortTableByID() {
    // Sorting options
    currentlySorted="id";
    if (currentSortDirection === "" || currentSortDirection === "inc") {
      currentSortDirection="desc";
      sortIdIcon.classList.add("fa-rotate-180");
    }
    else {   
      currentSortDirection="inc";  
      sortIdIcon.classList.remove("fa-rotate-180");
    }

    sortIdIcon.style.visibility = "visible";
    sortNameIcon.style.visibility = "hidden";
    sortSizeIcon.style.visibility = "hidden";
    sortDateIcon.style.visibility = "hidden";
    sortPublicIcon.style.visibility = "hidden";

    // Bubble sort
    var len = files.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < len-1; i++) {
            if ((currentSortDirection === "desc" && parseInt(files[i].childNodes[0].innerHTML) < parseInt(files[i + 1].childNodes[0].innerHTML)) || (currentSortDirection === "inc" && parseInt(files[i].childNodes[0].innerHTML) > parseInt(files[i + 1].childNodes[0].innerHTML))) {
                let tmp = files[i];
                files[i] = files[i + 1];
                files[i + 1] = tmp;
                swapped = true;
            }
        }
    } while (swapped);

    // Load files again
    loadFilesFromPage(1);
    createNavigationButtons(1);
    makeTableHighlightable();
}

// Sorts the entire current table by the id's
function sortTableByName() {
  // Sorting options
  currentlySorted="id";
  if (currentSortDirection === "" || currentSortDirection === "inc") {
    currentSortDirection="desc";
    sortNameIcon.classList.add("fa-rotate-180");
  }
  else {   
    currentSortDirection="inc";  
    sortNameIcon.classList.remove("fa-rotate-180");
  }

  sortIdIcon.style.visibility = "hidden";
  sortNameIcon.style.visibility = "visible";
  sortSizeIcon.style.visibility = "hidden";
  sortDateIcon.style.visibility = "hidden";
  sortPublicIcon.style.visibility = "hidden";

  // Bubble sort
  var len = files.length;
  let swapped;
  do {
      swapped = false;
      for (let i = 0; i < len-1; i++) {
          if ((currentSortDirection === "desc" && files[i].childNodes[1].innerHTML < files[i + 1].childNodes[1].innerHTML) || (currentSortDirection === "inc" && files[i].childNodes[1].innerHTML > files[i + 1].childNodes[1].innerHTML)) {
              let tmp = files[i];
              files[i] = files[i + 1];
              files[i + 1] = tmp;
              swapped = true;
          }
      }
  } while (swapped);

  // Load files again
  loadFilesFromPage(1);
  createNavigationButtons(1);
  makeTableHighlightable();
}

// Sorts the entire current table by the id's
function sortTableBySize() {
  // Sorting options
  currentlySorted="id";
  if (currentSortDirection === "" || currentSortDirection === "inc") {
    currentSortDirection="desc";
    sortSizeIcon.classList.add("fa-rotate-180");
  }
  else {   
    currentSortDirection="inc";  
    sortSizeIcon.classList.remove("fa-rotate-180");
  }
  sortIdIcon.style.visibility = "hidden";
  sortNameIcon.style.visibility = "hidden";
  sortSizeIcon.style.visibility = "visible";
  sortDateIcon.style.visibility = "hidden";
  sortPublicIcon.style.visibility = "hidden";

  // Bubble sort
  var len = files.length;
  let swapped;
  do {
      swapped = false;
      for (let i = 0; i < len-1; i++) {

          var posI = files[i].childNodes[3].innerHTML.split(" ");
          var val1 = parseFloat(posI[0]);
          var posAboveI = files[i + 1].childNodes[3].innerHTML.split(" ");
          var val2 = parseFloat(posAboveI[0]);
        
          if (posI[1] === "KB")
            val1 *= 1000;
          else if (posI[1] === "MB")
            val1 *= 1000000;
          else if (posI[1] === "GB")
            val1 *= 1000000000;
      
            if (posAboveI[1] === "KB")
            val2 *= 1000;
          else if (posAboveI[1] === "MB")
            val2 *= 1000000;
          else if (posAboveI[1] === "GB")
            val2 *= 1000000000;

          if ((currentSortDirection === "desc" &&  val1 < val2) || (currentSortDirection === "inc" && val1 > val2)) {
              let tmp = files[i];
              files[i] = files[i + 1];
              files[i + 1] = tmp;
              swapped = true;
          }
      }
  } while (swapped);

  // Load files again
  loadFilesFromPage(1);
  createNavigationButtons(1);
  makeTableHighlightable();
}


// Sorts the entire current table by the id's
function sortTableByCreationDate() {
  // Sorting options
  currentlySorted="id";
  if (currentSortDirection === "" || currentSortDirection === "inc") {
    currentSortDirection="desc";
    sortDateIcon.classList.add("fa-rotate-180");
  }
  else {   
    currentSortDirection="inc";  
    sortDateIcon.classList.remove("fa-rotate-180");
  }
  sortIdIcon.style.visibility = "hidden";
  sortNameIcon.style.visibility = "hidden";
  sortSizeIcon.style.visibility = "hidden";
  sortDateIcon.style.visibility = "visible";
  sortPublicIcon.style.visibility = "hidden";
  // Bubble sort
  var len = files.length;
  let swapped;
  do {
      swapped = false;
      for (let i = 0; i < len-1; i++) {
          if ((currentSortDirection === "desc" && files[i].childNodes[3].innerHTML < files[i + 1].childNodes[3].innerHTML) || (currentSortDirection === "inc" && files[i].childNodes[3].innerHTML > files[i + 1].childNodes[3].innerHTML)) {
              let tmp = files[i];
              files[i] = files[i + 1];
              files[i + 1] = tmp;
              swapped = true;
          }
      }
  } while (swapped);

  // Load files again
  loadFilesFromPage(1);
  createNavigationButtons(1);
  makeTableHighlightable();
}

// Sorts the entire current table by the id's
function sortTableByIsPublic() {
  // Sorting options
  currentlySorted="id";
  if (currentSortDirection === "" || currentSortDirection === "inc") {
    currentSortDirection="desc";
    sortPublicIcon.classList.add("fa-rotate-180");
  }
  else {   
    currentSortDirection="inc";  
    sortPublicIcon.classList.remove("fa-rotate-180");
  }
  sortIdIcon.style.visibility = "hidden";
  sortNameIcon.style.visibility = "hidden";
  sortSizeIcon.style.visibility = "hidden";
  sortDateIcon.style.visibility = "hidden";
  sortPublicIcon.style.visibility = "visible";
  // Bubble sort
  var len = files.length;
  let swapped;
  do {
      swapped = false;
      for (let i = 0; i < len-1; i++) {
          if ((currentSortDirection === "desc" && files[i].childNodes[4].innerHTML < files[i + 1].childNodes[4].innerHTML) || (currentSortDirection === "inc" && files[i].childNodes[4].innerHTML > files[i + 1].childNodes[4].innerHTML)) {
              let tmp = files[i];
              files[i] = files[i + 1];
              files[i + 1] = tmp;
              swapped = true;
          }
      }
  } while (swapped);

  // Load files again
  loadFilesFromPage(1);
  createNavigationButtons(1);
  makeTableHighlightable();
}