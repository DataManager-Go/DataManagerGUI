// This will wait for the astilectron namespace to be ready
document.addEventListener('astilectron-ready', function() {
    // This will listen to messages sent by GO
    astilectron.onMessage(function(message) {
        var obj = JSON.parse(message);

        alert(obj.payload);

        // obj contents: obj.type, obj.payload
        if (obj.type === "namespace/groups") {
           addNamespaceAndGroups(obj);
        }
        else if (obj.type === "files") {
            addFiles(obj);
        }

		return message;
    });
})

function addFiles(data) {
    /* Payload: Array hiervon:
    type FileResponseItem struct {
	ID           uint           `json:"id"`
	Size         int64          `json:"size"`
	CreationDate time.Time      `json:"creation"`
	Name         string         `json:"name"`
	PublicName   string         `json:"pubname"`
	IsPublic     bool           `json:"isPub"`
	Attributes   FileAttributes `json:"attrib"`
    Encryption   string         `json:"e"`

        File Attributes: 
    Tags      []string `json:"tags,omitempty"`
	Groups    []string `json:"groups,omitempty"`
	Namespace string   `json:"ns"`
    */
}

function addNamespaceAndGroups(data) {
 // Payload content: `{"content":[["Default", "Group1", "Group2"], ["Namespace2", "Group1"]]}`
    var namespaces = JSON.parse(data.payload).content;
    alert(namespaces);
            
 for (var i = 0; i < namespaces.length; i++) {
    
    var groups = namespaces[i];

    // Add Namespace
    var ns = document.createElement("LI");
    ns.setAttribute("class", "sidebar-brand");

    var ns_a = document.createElement("a");
    ns_a.setAttribute("href", "#");
    ns_a.setAttribute("style", "color: rgb(255,255,255); background-color: rgb(59,58,119);");
    ns_a.innerHTML = groups[0];
    ns.appendChild(ns_a);

    document.getElementById("SideBar").appendChild(ns);

    // Add Groups
    for (var j = 1; j < groups.length; j++) {
        var g = document.createElement("LI");
        
        var a = document.createElement("a");
        a.setAttribute("href", "#");
        a.setAttribute("style", "color: rgb(255,255,255);");
        a.innerHTML="&nbsp; &nbsp;"+groups[j];
        g.appendChild(a);
        
        document.getElementById("SideBar").appendChild(g);
    }
}
}