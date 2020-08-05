// Upload
var uploadBtn = document.getElementById('fileUploadBtn');
var folderUploadBtn = document.getElementById("folderUploadBtn");

// Upload settings
var directoryName = "";
var fileList = [];
var uploadType = "";

// Top bar
var searchbar = document.getElementById("seachbar");

// Table
var table = document.getElementById('tableID');
var sortIdIcon = document.getElementById("sortIdIcon");
var sortNameIcon = document.getElementById("sortNameIcon");
var sortSizeIcon = document.getElementById("sortSizeIcon");
var sortDateIcon = document.getElementById("sortDateIcon");
var sortPublicIcon = document.getElementById("sortPublicIcon");

// Upload prepare
var tagInput = document.getElementById("upPrep_tagInput");
var groupInput = document.getElementById("upPrep_groupInput");
var uploadPrepOverlay = document.getElementById("uploadPrepOverlay");
var up_prepTitle = document.getElementById("up_prepTitle");
var checkbox_compressDir = document.getElementById("checkbox_compressDir");
var checkbox_public = document.getElementById("checkbox_public");
var checkbox_encrypt = document.getElementById("checkbox_encrypt");
var up_startBtn = document.getElementById("up_startBtn");
var maxPrepOverlayTitleSize = 30;

// Enter Name Overlay
var textinput_overlayTitle = document.getElementById("textinput_overlayTitle");
var textinput_overlayButton = document.getElementById("textinput_overlayButton");
var textinputOverlay = document.getElementById("textinputOverlay");

// Yes-No Dialog
var yes_no_overlay = document.getElementById("yes_no_overlay");
var yes_no_text = document.getElementById("yes_no_text");

// Current info
var shownFileCap = 30;
var namespaceCount = 0;
var currentNamespace = "Default";
var tagList = [];
var files = [];
var groupList = [];
var searchFilters = []; // e.g. search input
var tagFilters = [];
var rmbOverlayIsOpened = false;
var lastRmbElement;

// Input overlay
var currentInputAction = []; // type, origin, namespace, group, tag     type => 0: rename, 1: create;   origin => 0: namespace, 1: group, 2: tag

// List of currently active alerts
var currentAlerts = [];

// Table sorting
var currentlySorted = "";
var currentSortDirection ="";

// RMB Menu
var fileIsAlreadyPublic = false;