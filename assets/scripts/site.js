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

    // Piwik.
    var _paq = _paq || [];
    _paq.push(["setCookieDomain", "*.thehumbleprogrammer.com"]);
    _paq.push(["setDomains", ["*.thehumbleprogrammer.com"]]);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function () {
        var u = (("https:" == document.location.protocol) ? "https" : "http") + "://piwik.t-hp.me/";
        _paq.push(['setTrackerUrl', u + 'piwik.php']);
        _paq.push(['setSiteId', 1]);
        var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0]; g.type = 'text/javascript';
        g.defer = true; g.async = true; g.src = u + 'piwik.js'; s.parentNode.insertBefore(g, s);
    })();

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