
(function(){
    var a;
    var path = '/ipcc/webchat/';
    var query = document.URL;
    if(query.indexOf('wchat') != -1) {
        a = ['js/json3.js','js/wchat_settings.js','js/wchat_lang.js','js/wchat_init.js'];
    }
    else {
        a = ['js/json3.js','js/wchat_settings.js','js/wchat_lang.js','js/wchat_box.js','js/wchat_init.js'];
        (function(x, c) {
            var e = x.createElement(c),
                q = x.getElementsByTagName(c)[0];
            e.rel = 'stylesheet';
            e.type = 'text/css';
            e.href = path+'wchat_box.css';
            q.parentNode.insertBefore(e, q);
        }(document, 'link'));
    }
    (function(d, t) {
        for(var i=0;i<a.length;i++){
            var g = d.createElement(t),
            s = d.getElementsByTagName(t)[0];
            g.src = path+a[i];
            g.charset = 'windows-1251';
            g.async = false;
            s.parentNode.insertBefore(g, s);
        }
    })(document, 'script');
})();