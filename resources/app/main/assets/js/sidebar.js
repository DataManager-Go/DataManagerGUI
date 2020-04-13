$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

(function($) {
    let win = $(window);
    let w = win.width();
    
    let body = $('body');
    let btn = $('#sidebarToggle');
    let sidebar = $('.sidebar');
    
    // Collapse on load
    if (win.width() < 900) {
        sidebar.addClass('collapsed');
    }
    
    sidebar.removeClass('mobile-hid');
    
    // Events
    btn.click(toggleSidebar);
    win.resize(function() {
        
        if (w==win.width()) {
            return;
        }
        
        w = win.width();
        
        if (w < 900 && !sidebar.hasClass('collapsed')) {
            toggleSidebar();
        } else if (w > 900 && sidebar.hasClass('collapsed')) {
            toggleSidebar();
        }
    });
    
    function toggleSidebar() { 
        
        if (win.width() < 900 || !sidebar.hasClass('collapsed')) {
            body.animate({'padding-left':'0'},100);
        }
        else if (win.width() > 900 && sidebar.hasClass('collapsed')) {
            body.animate({'padding-left':'14rem'},100);
        }
        
        if (!sidebar.hasClass('collapsed')) {
            sidebar.fadeOut(100,function(){
                btn.hide();
                sidebar.addClass('collapsed');
                btn.fadeIn(100);
            });
        }
        else {
            sidebar.removeClass('collapsed');
            sidebar.fadeIn(100);
        }
       
    }
})(jQuery)


// List-click Handler
function OnListClick(e) {

    var json = {
        type: "changeNamespaceOrGroup",
        payload: e.target.attributes.id.value
    };

    astilectron.sendMessage(JSON.stringify(json), function(message) {});
}

// Resize Handler
function onResize() {
    console.log($(window).height());
    if ($(window).height() < 70 * namespaceCount) {    
        document.getElementById("SideBar").classList.remove("flex-column");
        document.getElementById("title").setAttribute("style", "padding-left: 1.655rem");
    } else {
        document.getElementById("SideBar").classList.add("flex-column");
        document.getElementById("title").setAttribute("style", "padding-left: 0rem");
    }
}
