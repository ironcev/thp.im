// jquery.scrollup.js
(function($, window, document) {

    // Main function
    $.fn.scrollUp = function (options) {

        // Ensure that only one scrollUp exists
        if (!$.data(document.body, 'scrollUp')) {
            $.data(document.body, 'scrollUp', true);
            $.fn.scrollUp.init(options);
        }
    };

    // Init
    $.fn.scrollUp.init = function(options) {

        // Apply any options to the settings, override the defaults
        var o = $.fn.scrollUp.settings = $.extend({}, $.fn.scrollUp.defaults, options),

        // Set scrollTitle
        scrollTitle = (o.scrollTitle) ? o.scrollTitle : o.scrollText,

        // Create element
        $self;
        if (o.scrollTrigger) {
            $self = $(o.scrollTrigger);
        } else {
            $self = $('<a/>', {
                id: o.scrollName,
                href: '#top',
                title: scrollTitle
            });
        }
        $self.appendTo('body');

        // If not using an image display text
        if (!(o.scrollImg || o.scrollTrigger)) {
            $self.html(o.scrollText);
        }

        // Minimum CSS to make the magic happen
        $self.css({
            display: 'none',
            position: 'fixed',
            zIndex: o.zIndex
        });

        // Active point overlay
        if (o.activeOverlay) {
            $('<div/>', { id: o.scrollName + '-active' }).css({ position: 'absolute', 'top': o.scrollDistance + 'px', width: '100%', borderTop: '1px dotted' + o.activeOverlay, zIndex: o.zIndex }).appendTo('body');
        }

        // Switch animation type
        var animIn, animOut, animSpeed, scrollDis;

        switch (o.animation) {
            case 'fade':
                animIn  = 'fadeIn';
                animOut = 'fadeOut';
                animSpeed = o.animationInSpeed;
                break;
            case 'slide':
                animIn  = 'slideDown';
                animOut = 'slideUp';
                animSpeed = o.animationInSpeed;
                break;
            default:
                animIn  = 'show';
                animOut = 'hide';
                animSpeed = 0;
        }

        // If from top or bottom
        if (o.scrollFrom === 'top') {
            scrollDis = o.scrollDistance;
        } else {
            scrollDis = $(document).height() - $(window).height() - o.scrollDistance;
        }

        // Trigger visible false by default
        var triggerVisible = false;

        // Scroll function
        scrollEvent = $(window).scroll(function() {
            if ( $(window).scrollTop() > scrollDis ) {
                if (!triggerVisible) {
                    $self[animIn](animSpeed);
                    triggerVisible = true;
                }
            } else {
                if (triggerVisible) {
                    $self[animOut](animSpeed);
                    triggerVisible = false;
                }
            }
        });

        var scrollTarget;
        if (o.scrollTarget) {
            if (typeof o.scrollTarget === 'number') {
                scrollTarget = o.scrollTarget;
            } else if (typeof o.scrollTarget === 'string') {
                scrollTarget = Math.floor($(o.scrollTarget).offset().top);
            }
        } else {
            scrollTarget = 0;
        }

        // To the top
        $self.click(function(e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: scrollTarget
            }, o.scrollSpeed, o.easingType);
        });
    };

    // Defaults
    $.fn.scrollUp.defaults = {
        scrollName: 'scrollUp', // Element ID
        scrollDistance: 300, // Distance from top/bottom before showing element (px)
        scrollFrom: 'top', // 'top' or 'bottom'
        scrollSpeed: 300, // Speed back to top (ms)
        easingType: 'linear', // Scroll to top easing (see http://easings.net/)
        animation: 'fade', // Fade, slide, none
        animationInSpeed: 200, // Animation in speed (ms)
        animationOutSpeed: 200, // Animation out speed (ms)
        scrollTrigger: false, // Set a custom triggering element. Can be an HTML string or jQuery object
        scrollTarget: false, // Set a custom target element for scrolling to. Can be element or number
        scrollText: 'Scroll to top', // Text for element, can contain HTML
        scrollTitle: false, // Set a custom <a> title if required. Defaults to scrollText
        scrollImg: false, // Set true to use image
        activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
        zIndex: 2147483647 // Z-Index for the overlay
    };

    // Destroy scrollUp plugin and clean all modifications to the DOM
    $.fn.scrollUp.destroy = function (scrollEvent){
        $.removeData( document.body, 'scrollUp' );
        $( '#' + $.fn.scrollUp.settings.scrollName ).remove();
        $( '#' + $.fn.scrollUp.settings.scrollName + '-active' ).remove();

        // If 1.7 or above use the new .off()
        if ($.fn.jquery.split('.')[1] >= 7) {
            $(window).off( 'scroll', scrollEvent );

        // Else use the old .unbind()
        } else {
            $(window).unbind( 'scroll', scrollEvent );
        }
    };

    $.scrollUp = $.fn.scrollUp;

})(jQuery, window, document);


$(function () {
    function stringFormat() {
        var input = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            input = input.replace(reg, arguments[i + 1]);
        }
        return input;
    };

    $.scrollUp({
        scrollName: 'scrollUp',
        topDistance: '300', 
        topSpeed: 300,
        animation: 'fade', 
        animationInSpeed: 200,
        animationOutSpeed: 200,
        scrollText: 'Scroll to top',
        activeOverlay: false,
    });

    // Open external links in a new window.
    $.expr[':'].external = function (obj) {
        return !(obj.href == "")
            && !obj.href.match(/^mailto\:/)
            && !(obj.hostname == location.hostname)
            && !$(obj).hasClass("twitter")
            && !$(obj).hasClass("googlePlus")
            && !$(obj).hasClass("facebook");
    };

    $("a:external").addClass("new-window");
        
    $("a.new-window").click(function () {
        window.open(this.href);
        return false;
    });

    // Share on Twitter and Google Plus.
    $(".twitter, .googlePlus").click(function (event) {
        var anchor = $(event.currentTarget);
        var width = 600, height = 600;
        var url = stringFormat(anchor.attr("href") + anchor.attr("data-href"),
                               encodeURIComponent(anchor.attr("data-text")),
                               encodeURIComponent(anchor.attr("data-url")));
        var left = (window.screen.width / 2) - (width / 2);
        var top = (window.screen.height / 2) - (height / 2);
        window.open(url, "",
                    stringFormat('toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width={0},height={1},top={2},left={3}', width, height, top, left));
        event.preventDefault();
    });

    // Share on Facebook.
    $(".facebook").click(function (event) {
        var anchor = $(event.currentTarget);
        var width = 800, height = 600;
        var url = stringFormat(anchor.attr("href") + anchor.attr("data-href"),
                               encodeURIComponent(anchor.attr("data-link")),
                               anchor.attr("data-has-picture").length >0 ? encodeURIComponent(anchor.attr("data-picture")) : "",
                               encodeURIComponent(anchor.attr("data-description")),
                               encodeURIComponent(anchor.attr("data-name")));
        var left = (window.screen.width / 2) - (width / 2);
        var top = (window.screen.height / 2) - (height / 2);
        window.open(url, "",
                    stringFormat('toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width={0},height={1},top={2},left={3}', width, height, top, left));
        event.preventDefault();
    });
});