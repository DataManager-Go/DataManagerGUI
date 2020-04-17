var searchbar = document.getElementById("seachbar");

// Do stuff whenever something was entered in the search bar
function onSearchbarChange() {    
  displayFilters = searchbar.value.replace(",", "").split(" ");
  
  // Load files again
  loadFilesFromPage(1);
  createNavigationButtons(1);
  makeTableHighlightable();
}