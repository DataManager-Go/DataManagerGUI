// Filter elements on serachbar change
function onSearchbarChange() {    
  displayFilters = searchbar.value.replace(",", "").split(" ");
  
  // Load files again
  loadFilesFromPage(1);
  createNavigationButtons(1);
  makeTableHighlightable();
}

// Filter elements on filter press
function setTagFilter(tag) {
  var isActive = false;
  for (var i = 0; i < displayFilters.length; i++) {
    if (displayFilters[i] === tag) {
      isActive = true;
      displayFilters.splice(i, 1);
      break;
    }
  }

  if (!isActive) {
    displayFilters.push(tag);
  }

   // Load files again
   loadFilesFromPage(1);
   createNavigationButtons(1);
   makeTableHighlightable();
}