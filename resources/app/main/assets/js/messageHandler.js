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
           // addFiles(obj);
        }

		return message;
    });
})

// TODO SECOND GROUPS NOT WORKING
function addNamespaceAndGroups(data) {
 // Payload content: `{"content":[["Default", "Group1", "Group2"], ["Namespace2", "Group1"]]}`
    var namespaces = JSON.parse(data.payload).content;
    alert(namespaces);
            
    for (var i = 0; i < namespaces.length; i++) {
    
        var groups = namespaces[i];

        // Add Namespaces
        var ns = document.createElement("LI");
        ns.setAttribute("class", "nav-item dropdown");
        ns.addEventListener("mousedown", OnListClick);

        var ns_a = document.createElement("a");
        
        ns_a.setAttribute("href", "#");
        ns_a.setAttribute("class", "dropdown-toggle nav-link text-left text-white py-1 px-0 position-relative");
        ns_a.setAttribute("data-toggle", "dropdown");
        ns_a.setAttribute("aria-expanded", "false");

        ns_a_i1 = document.createElement("i");
        ns_a_i1.setAttribute("class", "far fa-list-alt mx-3");
        ns_a.append(ns_a_i1);

        ns_a_span = document.createElement("span");
        ns_a_span.setAttribute("class", "text-nowrap mx-2");
        ns_a_span.innerHTML = groups[0];
        ns_a.append(ns_a_span);

        ns_a_i2 = document.createElement("i");
        ns_a_i2.setAttribute("class", "fas fa-caret-down float-none float-lg-right fa-sm");
        ns_a.append(ns_a_i2);

        ns.appendChild(ns_a);



        var div = document.createElement("div");
        div.setAttribute("class", "dropdown-menu border-0 animated fadeIn");
        div.setAttribute("role", "menu");
        ns.appendChild(div);

        // Add Groups to Namespaces
        for (var j = 0; j < groups.length; j++) {
            var div_a = document.createElement("a");
            div_a.setAttribute("class", "dropdown-item text-white");
            div_a.setAttribute("role", "presentation");
            div_a.setAttribute("href", "#");
            div.appendChild(div_a);

            var div_a_i = document.createElement("i");
            div_a.appendChild(div_a_i);

            var div_a_span = document.createElement("span");
            div_a.appendChild(div_a_span);


            if (j === 0) {
                div_a.setAttribute("id", "group_"+groups[0]+"_ShowAllFiles");
                div_a_i.setAttribute("class", "fas fa-list mx-3");
                div_a_span.innerHTML = "All files";
            } else {
                div_a.setAttribute("id", "group_"+groups[0]+"_"+groups[j]);
                div_a_i.setAttribute("class", "far fa-folder mx-3");
                div_a_span.innerHTML = groups[j];
            }
            div_a.addEventListener("click", OnListClick);
        }   
        
        // finally append to html
        document.getElementById("SideBar").appendChild(ns);
    }
}


/*
<li class="nav-item dropdown">
    <a class="dropdown-toggle nav-link text-left text-white py-1 px-0 position-relative" data-toggle="dropdown" aria-expanded="false" href="#">
        <i class="far fa-list-alt mx-3"></i>
        <span class="text-nowrap mx-2">Namespace2</span>
       <i class="fas fa-caret-down float-none float-lg-right fa-sm"></i>
    </a>

    <div class="dropdown-menu border-0 animated fadeIn" role="menu">
		<a class="dropdown-item text-white" role="presentation" href="#">
			<i class="far fa-folder mx-3"></i>
			<span>Folder 1</span>
         </a>
    </div>
 </li>

 https://stackoverflow.com/questions/24665677/call-javascript-function-by-clicking-on-html-list-element/24665785
*/