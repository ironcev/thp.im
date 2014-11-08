$(function () {
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
            && !(obj.hostname == location.hostname);
    };
    
    $("a:external").addClass("new-window");
        
    $('a.new-window').click(function () {
        window.open(this.href);
        return false;
    });
});