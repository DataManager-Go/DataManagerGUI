(function($) {
    
    $('.multilevel .dropdown-menu > *').on('mouseenter click', function(e) {
        
        var elem = $(this);
        
        // Hide all other dropdowns
        
        elem.parent().find('.dropdown-menu').removeClass('show');
        
        // Show the corresponding menu
        
        let menu = elem.find('.dropdown-menu').first();
        
        if (menu.length) {
            // This is a dropdown menu toggle. Show the menu
            // and prevent it from closing on click.
            menu.addClass('show');
            e.stopPropagation();
        }
        
    });
    
    $('body').click( function() {
        // When the body is clicked, hide all multilevel dropdowns.
        $('.multilevel .dropdown-menu').removeClass('show');
    });
    
})(jQuery);