// Upload
var uploadBtn = document.getElementById('fileUploadBtn');
var folderUploadBtn = document.getElementById("folderUploadBtn");

// Upload settings
var directoryName = "";
var fileList = [];
var uploadType = "";

// Elements from the html
var tagInput = document.getElementById("up_set_tagInput");
var groupInput = document.getElementById("up_set_groupInput");
var encryptInput = document.getElementById("up_set_encryptBox");
var publicInput = document.getElementById("up_set_publicBox");
var searchbar = document.getElementById("seachbar");
var table = document.getElementById('tableID');

var sortIdIcon = document.getElementById("sortIdIcon");
var sortNameIcon = document.getElementById("sortNameIcon");
var sortSizeIcon = document.getElementById("sortSizeIcon");
var sortDateIcon = document.getElementById("sortDateIcon");
var sortPublicIcon = document.getElementById("sortPublicIcon");

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