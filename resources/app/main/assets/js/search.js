// Filter elements on serachbar change
function onSearchbarChange() {    

  if (searchbar.value.length > 0) {
    searchFilters = searchbar.value.replace(",", "").split(" ");
  } else {
    searchFilters = [];
  }
  
  // Load files again
  loadFilesFromPage(1);
  createNavigationButtons(1);
  makeTableHighlightable();
}

// Filter elements on filter press
function setTagFilter(btn) {

  if (btn.style.backgroundColor === btn.origColor) {
    btn.style.backgroundColor = "rgb(23,64,118)";
    tagFilters.push(btn.innerHTML);
  }
  else {
    btn.style.backgroundColor = btn.origColor;
    for (var i = 0; i < tagFilters.length; i++) {
      if (tagFilters[i] === btn.innerHTML) {
        tagFilters.splice(i, 1);
        break;
      }
    }
  }

   // Load files again
   loadFilesFromPage(1);
   createNavigationButtons(1);
   makeTableHighlightable();
}