$(function () {
    // Open external links in a new window.
    $.expr[':'].external = function (obj) {
        return !(obj.href == "")
            && !obj.href.match(/^mailto\:/)
            && !(obj.hostname == location.hostname);
    };

    $("a:external").addClass("new-window");
        
    $("a.new-window").click(function () {
        window.open(this.href);
        return false;
    });

});