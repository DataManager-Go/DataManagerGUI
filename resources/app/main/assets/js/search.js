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
function setTagFilter(tag) {
  var isActive = false;
  for (var i = 0; i < tagFilters.length; i++) {
    if (tagFilters[i] === tag) {
      isActive = true;
      tagFilters.splice(i, 1);
      break;
    }
  }

  if (!isActive) {
    tagFilters.push(tag);
  }

   // Load files again
   loadFilesFromPage(1);
   createNavigationButtons(1);
   makeTableHighlightable();
}