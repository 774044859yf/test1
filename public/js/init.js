var utils = (function () {
    return {
        _var: function () {
            return '?_v=2.1'
        }
    }
})();
(function () {
    if (window.location.href.indexOf('display') == -1) {
        window.addEventListener("orientationchange", function () {
            setTimeout(function () {
                var winW = document.documentElement.clientWidth,
                    n = winW / 750;
                if (n > 1.3) {
                    document.documentElement.style.fontSize = (1000 / 750) * 40 + "px";
                } else {
                    document.documentElement.style.fontSize = n * 40 + "px";
                }
            },100)

        }, false);

    }
})();