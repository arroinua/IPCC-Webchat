window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine number: '+linenumber);
    return true;
};
var IPCC_WEBCHAT = {
    shared: false,
    updatesSent: false,
    chatStarted: false,
    soundon: true,
    sessionId: 0,
    timestampMsg: 0,
    timestampEvent: 0,
    operRating: 0,
    msgInterval: null,
    toutInterval: null,
    lastClicked: null,
    gotMessage: null,
    currentURL: null,
    category: 'not selected',
    queue: [],
    localEvents: [],
    remoteEvents: [],
    dialog: new Object()
};

function ipcc_connect() {
   // window.localStorage.clear();
    var props = IPCC_WEBCHAT;
    props.dialog.messages = [];
    var l = window.localStorage;
    var storageSid = l.getItem('sid');
    var storageChat = l.getItem('chat');
    var storagePop = l.getItem('popedUp');
    var lang = IPCC_WEBCHAT_SETTINGS.userLang;
    window.onclick = function(event) {
        var e = event || window.event;
        var targ = e.target || e.srcElement;
        var p = IPCC_WEBCHAT;
        if(targ.nodeType == 3) targ = targ.parentNode;
        if(targ.href || targ.parentNode.href) {
            var t = targ.href || targ.parentNode.href;
            if(t.indexOf('mailto:') != -1) {
                p.lastClicked = true;
                setTimeout(function(){IPCC_WEBCHAT.lastClicked = false}, 1000);
                return;
            }
            var s = t.substring(t.indexOf('//')+2);
            if(s.indexOf("www.")!= -1) s = s.substring(4);
            if(s.indexOf('#')!= -1) p.lastClicked = null;
            else if(targ.nodeName.toLowerCase() == 'img') p.lastClicked = null;
            else if(s.indexOf('/')!= -1) p.lastClicked = s.substring(0, s.indexOf('/'));
            else p.lastClicked = s;
        }
    }
    window.onbeforeunload = function(event) {
        var e = event || window.event;
        var p = IPCC_WEBCHAT;
        var h = window.location.host;
        if(h.indexOf("www.")!= -1) h = h.substring(4);
        if(p.lastClicked == h) void(0);
        else if(p.lastClicked == true) e.preventDefault();
        else {
            disjoin_session();
        }
    }
    var query = window.location.search;
    if (query.indexOf('chatSessionId=') != -1) {
        var sid = query.substring(query.indexOf('chatSessionId='));
        sid = sid.substring(sid.indexOf('=')+1);
        join_session(sid);
        var jprms = '\"sid\":\"'+props.sessionId+'\",\"timestamp\":'+props.timestampEvent+',\"events\":[{"shared":"true"}]';
        json_rpc_async('updateEvents', jprms, update_events);
        l.setItem('shared', 'true');
        l.setItem('sid', props.sessionId);
        l.setItem('chat', 'otrue');
    }
    else{
        if(storageSid) {
            props.sessionId = storageSid;
            if(storageChat == 'true' || storageChat == 'otrue') {
                var jprms = '\"sid\":\"'+props.sessionId+'\",\"timestamp\":'+props.timestampEvent+',\"events\":[{"url":"'+document.URL+'"}]';
                json_rpc_async('updateEvents', jprms, update_events);
            }
        }
        else create_session();
        
        if(storageChat != 'otrue') {
            if(IPCC_WEBCHAT_SETTINGS.createButton) create_button(lang);
            if(IPCC_WEBCHAT_SETTINGS.chatBox) {
                if(props.sessionId != undefined) create_chatbox(lang);
                if(storageChat == 'true' && storagePop != 'true') init_chat();
            }
        }
    }
    share_browser();
    if(props.sessionId != undefined) setInterval('check_updates()', 200);
}
function show_chat(category) {
    var cb = document.getElementById('wc_cb');
    var storageChat = localStorage.getItem('chat');
    var storagePop = localStorage.getItem('popedUp');
    if(storageChat === 'otrue') return;
    else if(IPCC_WEBCHAT.chatStarted == true) {
        if(storagePop === 'true') {
           if(IPCC_WEBCHAT.chatWindow) IPCC_WEBCHAT.chatWindow.focus();
           return;
        }
        else if(cb && cb.style.display !== 'none') return;
    }
    
    if(category) IPCC_WEBCHAT.category = category;
    if(IPCC_WEBCHAT_SETTINGS.chatBox) init_chat();
    else return chat_popup();
}
function check_updates() {
    var props = IPCC_WEBCHAT;
    if(props.updatesSent) return;
    var storageChat = window.localStorage.getItem('chat');
    var d = document.URL;
    if(d.indexOf('#') != -1) d = d.substring(0, d.indexOf('#'));
    if(props.currentURL != d && storageChat !== 'otrue'){
        props.currentURL = d;
        json_rpc_async('updateUrl', '\"sid\":\"'+props.sessionId+'\",\"url\":\"'+props.currentURL+'\"', null);
    }
    if(!props.shared) return;
    var jprms = '\"sid\":\"'+props.sessionId+'\",\"timestamp\":'+props.timestampEvent+',\"events\":[';
    if(props.localEvents.length > 0){
        var events = props.localEvents.splice(0, props.localEvents.length);
        var i;
        for(i=0; i < events.length; i++){
            jprms += '{'+events[i]+'},';
        }
    }
    jprms += ']';
    json_rpc_async('updateEvents', jprms, update_events);
    props.updatesSent = true;
}
function share_browser(){
    var storageShared = window.localStorage.getItem('shared');
    addEvent('keyup', event_handler);
    addEvent('keydown', event_handler);
    addEvent('keypress', event_handler);
    if(storageShared != 'true') return;
    addEvent('scroll', scroll_handler);
    addEvent('mousemove', event_handler);
    addEvent('mouseover', event_handler);
    addEvent('mouseout', event_handler);
    addEvent('mouseup', event_handler);
    addEvent('click', event_handler);
    addEvent('select', event_handler);
    var props = IPCC_WEBCHAT;
    var body = document.body;
    props.shared = true;
    var d = document.getElementById('img');
    if(!d) {
        var d = document.createElement('img');
        d.id = 'img';
        d.setAttribute('src', IPCC_WEBCHAT_SETTINGS.path+'icons/pointer.png');
        d.style.position = 'absolute';
        d.style.zIndex = '999999';
        d.style.top = '-1000px';
        if(body.firstChild) {
            body.insertBefore(d, body.firstChild);
        }
        else body.appendChild(d);
    }
    else {
        d.style.display = '';
        d.style.position = 'absolute';
        d.style.zIndex = '999999';
        d.style.top = '-5000px';
    }
}
function unshare_browser(){
    var props = IPCC_WEBCHAT;
    var d = document.getElementById('img');
    var f = document.getElementById('readtext');
    removeEvent('keyup', event_handler);    
    removeEvent('scroll', scroll_handler);
    removeEvent('keydown', event_handler);
    removeEvent('keypress', event_handler);
    removeEvent('mousemove', event_handler);
    removeEvent('mouseover', event_handler);
    removeEvent('mouseout', event_handler);
    removeEvent('mouseup', event_handler);
    removeEvent('click', event_handler);
    removeEvent('select', event_handler);
    if(d) d.style.display = 'none';
    if(f) f.innerHTML = '';
    props.shared = false;
    window.localStorage.removeItem('shared');
}
function getCaretPosition(f) {
    var c = 0;
    if (document.selection) { 
      var s = document.selection.createRange ();
      s.moveStart ('character', -f.value.length);
      c = s.text.length;
    }
    else if (f.selectionStart || f.selectionStart == '0')
      c = f.selectionStart;
    return (c);
}
function changeURL(url) {
    var u = url;
    var d = document;
    var props = IPCC_WEBCHAT;
    var s = u.substring(u.indexOf('//')+2);
    if(s.indexOf('/')!= -1) props.lastClicked = s.substring(0, s.indexOf('/'));
    else props.lastClicked = s;
    var query = d.URL;
    if (query.indexOf('?') !== -1) {
        if(u != query.substring(0, query.indexOf('?')-1)) d.location.href = u;
    }
    else d.location.href = u;
}
function scroll_handler(e) {
    var e = e || window.event;
    var props = IPCC_WEBCHAT;
    var t = window;
    var i;
    var st = t.pageYOffset;
    var sl = t.pageXOffset;
    for(i=0; i < props.remoteEvents.length; i++){
        if(props.remoteEvents[i].sx == sl && props.remoteEvents[i].sy == st) {
            props.remoteEvents.splice(i, 1);
            return;
        }
    }
    var jprms = '\"event\":\"'+e.type+'\",\"sx\":'+sl+',\"sy\":'+st;
    props.localEvents.push(jprms);
}
function event_handler(event) {
    var code;
    var d = document;
    var db = document.body;
    var e = event || window.event;
    var targ = e.target || e.srcElement;
    code = e.charCode || e.keyCode || e.which;
    if(targ.nodeType == 3) targ = targ.parentNode;
    var i;
    var props = IPCC_WEBCHAT;
    for(i=0; i < props.remoteEvents.length; i++){
        if(props.remoteEvents[i].event == 'mousemove'){
            props.remoteEvents.splice(i, 1);
            return;
        }
    }
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    var clientWidth = db.clientWidth;
    var clientHeight = db.clientHeight;
    var x = e.pageX || e.clientX + scrollTop;
    var y = e.pageY || e.clientY + scrollLeft;
    var jprms = '\"event\":\"'+e.type+'\",\"w\":'+db.offsetWidth+',\"h\":'+db.offsetHeight;
    if(targ.id) {
        jprms += ',\"elem\":\"'+targ.id+'\"';
    }
    else if(targ.name) {
        nodes = d.getElementsByName(targ.name);
        for(i=0;i<nodes.length;i++) {
            if(nodes[i] == targ) var tnodei = i;
        }
        jprms += ',\"elemName\":\"'+targ.name+'\",\"elemni\":'+tnodei;
    }
    if(e.type == 'mousemove') {
        jprms += ',\"x\":'+x+',\"y\":'+y;
        for(i=0; i < props.localEvents.length; i++) {
            if(props.localEvents[i].indexOf('mousemove') != -1) {
                props.localEvents.splice(i, 1);
                break;
            }
        }
    }
    else if(e.type == 'keyup' || e.type == 'keydown' || e.type == 'keypress') {
        var c = getCaretPosition(targ);
        if(e.type == 'keyup') {
            if(code == 86 && (e.metaKey || e.ctrlKey)) jprms += ',\"value\":\"'+targ.value+'\"';
            else return false;
        }
        else if(e.type == 'keydown') {
            if(code == 8 || code == 46 || code == 190) jprms += ',\"pos\":'+c+',\"code\":'+code;
            else return false;
        }
        else if(e.type == 'keypress') {
            if(code != 8 && code != 46) jprms += ',\"pos\":'+c+',\"code\":'+code;
            else return false;
        }
    }
    else if(e.type == 'mouseup' || e.type == 'select'){
        var s = window.getSelection() || document.selection.createRange().text;
        if(s.anchorNode !== null) {
            var sn = s.anchorNode.parentNode;
            for(i=0; i<sn.childNodes.length;i++) {
                if(sn.childNodes[i] == s.anchorNode) var schi = i;
            }
            var snn = sn.nodeName.toLowerCase();
            var nodes = d.getElementsByTagName(snn);
            for(i=0;i<nodes.length;i++) {
                if(nodes[i] === sn) var snodei = i;
            }
            var en = s.focusNode.parentNode;
            for(i=0; i<en.childNodes.length;i++) {
                if(en.childNodes[i] == s.focusNode) var echi = i;
            }
            var enn = en.nodeName.toLowerCase();
            nodes = d.getElementsByTagName(enn);
            for(i=0;i<nodes.length;i++) {
                if(nodes[i] === en) var enodei = i;
            }
            var so = s.anchorOffset;
            var eo = s.focusOffset;
            jprms += ',\"sn\":'+snn+',\"sni\":'+snodei+',\"schi\":'+schi+',\"en\":'+enn+',\"eni\":'+enodei+',\"echi\":'+echi+',\"so\":'+so+',\"eo\":'+eo;
        }
    }
    else if(e.type == 'click' || e.type == 'mouseover' || e.type == 'mouseout') {
        var cb = d.getElementById('wc_cb');
        if(cb) {
            if(isDescendant(cb, targ)) return;
        }
        var target = targ.nodeName;
        nodes = d.getElementsByTagName(target);
        for(i=0;i<nodes.length;i++) {
            if(nodes[i] == targ) var tnodei = i;
        }
        jprms += ',\"scx\":'+e.screenX+',\"scy\":'+e.screenY+',\"clw\":'+clientWidth+',\"clh\":'+clientHeight+',\"tn\":'+target+',\"tni\":'+tnodei;
    }
    props.localEvents.push(jprms);
    return true;
}
function update_events(result){
     var props = IPCC_WEBCHAT;
    props.updatesSent = false;
    props.timestampEvent = result.timestamp;
    var d = document;
    var body = d.body;
    var innerW = body.offsetWidth;
    var l = window.localStorage;
    var storageChat = l.getItem('chat');
    var element;
    var i;
    if(!result.events) return; 
    for(i=0; i<result.events.length; i++) {
        var evt = result.events[i];
        if(evt.shared) {
            l.setItem('shared', 'true');
            share_browser();
        }
        var u = evt.url;
        if(u && (u != d.URL && u != d.referrer)) changeURL(u);
        if(storageChat == 'otrue') {
            if(innerW!= evt.w) {
                var rwidth = evt.w + 'px';
                d.body.style.width = rwidth;
            }
        }
        if(evt.event == 'mousemove') {
            var img = d.getElementById('img');
            if(img) {
                img.style.left = evt.x + 'px';
                img.style.top = evt.y + 'px';
            }
        }
        else if(evt.event == 'scroll') {
            window.scrollTo(evt.sx, evt.sy);
        }
        else if(evt.event == 'mouseup'){
            if(evt.sn) {
                var startNode = d.getElementsByTagName(evt.sn)[evt.sni];
                var endNode = d.getElementsByTagName(evt.en)[evt.eni];
                if(d.createRange) {
                    var rng = d.createRange();
                    rng.setStart(startNode.childNodes[evt.schi], evt.so);
                    rng.setEnd(endNode.childNodes[evt.echi], evt.eo);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(rng);
                }
            }
        }
        else if(evt.event == 'keyup' || evt.event == 'keydown' || evt.event == 'keypress') {
            if(evt.elem) element = d.getElementById(evt.elem); 
            else if(evt.elemName) element = d.getElementsByName(evt.elemName)[evt.elemni];
            if(element) {
                var output;
                var a = element.value;
                if(evt.code == 8) {
                    if(evt.pos == a.length-1) output = a.substr(0, evt.pos-1);
                    else if(evt.pos == 0) return;
                    else output = a.substr(0, evt.pos-1) + a.substr(evt.pos);
                    element.value = output;
                }
                else if(evt.code == 46) {
                    output = a.substr(0, evt.pos) + a.substr(evt.pos+1);
                    element.value = output;
                }
                else if(evt.code == 190) {
                    output = a.substr(0, evt.pos) + '.' + a.substr(evt.pos);
                    element.value = output;
                }
                else if(evt.value) {
                    element.value = evt.value;
                }
                else {
                    var c = String.fromCharCode(evt.code);
                    output = a.substr(0, evt.pos) + c + a.substr(evt.pos);
                    element.value = output;
                }
            }
        }
        else {
            if(evt.tn) element = d.getElementsByTagName(evt.tn)[evt.tni];
            else if(evt.elem) element = d.getElementById(evt.elem);
            if(element) {
                var o;
                if (document.createEvent) {
                    if(evt.event == 'select') {
                        o = document.createEvent('UIEvents');
                        o.initUIEvent(evt.event, true, true, window, 1);
                        element.dispatchEvent(o);
                    }
                    else {
                        o = document.createEvent('MouseEvents');
                        o.initMouseEvent(evt.event, true, true, window, 1, evt.scx, evt.scy, evt.clw, evt.clh, false, false, false, false, 0, null);
                        element.dispatchEvent(o);
//                        if(element.focus) element.focus();
                    }
                }
                else {
                    if(document.createEventObject) {
                        element.fireEvent(evt.event);
                    }
                }
            }
        }
        if(evt.event != 'mouseup') props.remoteEvents.push(evt);
    }
}
function send_message_onkey(e) {
    e = e || window.event;
    if((e.keyCode == 10 || e.keyCode == 13) &&  e.ctrlKey) {
        send_message();
        e.preventDefault();
    }
}
function send_message(){
    var textarea = document.getElementById("writetext");
    var text = textarea.value;
    if((text.replace(/\s/g, "") && text.replace(/\n/g, "")) == "") return;
    text = text.replace(/\\/g,'\\\\');
    text = text.replace(/\"/g,'\\"');
    text = text.replace(/\t/g,'\\t');
    text = text.replace(/\r/g,'\\r');
    text = text.replace(/\n/g,'\\n');
    text = text.replace(/^\s+|\s+$/g,'');
    var jprms = '\"sid\":\"'+IPCC_WEBCHAT.sessionId+'\"';
    jprms += ',\"text\":\"'+text+'\"';
    json_rpc_async('setMessage', jprms, null);
    textarea.value = '';
}
function send_close_message(text) {
    var jprms = '\"sid\":\"'+IPCC_WEBCHAT.sessionId+'\"';
    jprms += ',\"text\":\"'+text+'\"';
    json_rpc_async('setMessage', jprms, null);
}
function send_file(){
    var lang = IPCC_WEBCHAT_SETTINGS.userLang;
    var sl = WEBCHAT_LANG[lang];
    var fileUpload = document.getElementById("upload");
    var filelist = fileUpload.files;
    if(filelist && filelist.length == 0) return;
    var reader = new FileReader();
    reader.onload = function(event) {
        send_file_(event.target.result);
    };
    reader.onerror = function(event) {
        alert(sl.transferError + event.target.error.code); 
    };
    reader.readAsDataURL(filelist[0]);
}
function send_file_(dataurl){
    var jprms = '\"sid\":\"'+IPCC_WEBCHAT.sessionId+'\"';
    var fileUpload = document.getElementById("upload");
    var filename = fileUpload.value;
    var n = filename.lastIndexOf("\\");
    if(n != -1) filename = filename.substring(n+1);
    jprms += ',\"file\":\"'+filename+'\"';
    dataurl = dataurl.substring(dataurl.indexOf(',')+1)
    jprms += ',\"text\":\"'+dataurl+'\"';
    json_rpc_async('setMessage', jprms, null);
}
function validPhone(e) {
    var p = document.getElementById('phone');
    var la = document.getElementById('phone-label');
    var phonev = p.value;
    var r = /[A-zА-я]/g;
    if(phonev.match(r)) {
        return false;
    }
    else {
        phonev = phonev.replace(/[^0-9]/g,'');
        if(phonev.charAt(0) === '0') phonev = phonev.substr(1);
        else if(phonev.charAt(0) === '8') phonev = phonev.substr(2);
        else if(phonev.charAt(0) === '3') phonev = phonev.substr(3);
        if(phonev.length === 9 || p.value.length === 0) {
            la.className=la.className.replace('wc_tooltip',"");
            return phonev;
        }
        else {
            return false;
        }
    }
}
function getCategories(categories) {
    var d = document;
    var l = window.localStorage;
    var storageName = l.getItem('uname');
    var phone = d.getElementById('phone');
    var uname = d.getElementById('uname');
    var select = d.getElementById('selectlang');
    if(categories.length == 0){
        switch_tab('wc_sendmail');
    }
    else {
        switch_tab('wc_prechat');
        var i;
        var nlang;
        nlang = IPCC_WEBCHAT_SETTINGS.userLang;
        for(i=0; i < categories.length; i++){
            var lang = categories[i];
            var option = d.createElement('option');
            option.value = lang;
            if(lang == 'ru') option.innerHTML = 'Русский';
            else if(lang == 'en') option.innerHTML = 'English';
            else if(lang == 'uk') option.innerHTML = 'Український';
            select.appendChild(option);
        }
        if(storageName) {
            uname.innerHTML = storageName;
            phone.innerHTML = l.getItem('uphone');
        }
        var j;
        for(j=0; j<select.length; j++) {
            if(nlang == select[j].value) select.selectedIndex = j;
        }
    }
}
function init_chat(){
    var l = localStorage;
    var props = IPCC_WEBCHAT;
    var storageChat = l.getItem('chat');
    var storageSid = l.getItem('sid');
    var storageName = l.getItem('uname');
    props.sessionId = storageSid;
    if(window.opener) {
        window.onclick = function(e) {
            var e = e || window.event;
            var targ = e.target || e.srcElement;
            if(targ.nodeType == 3) targ = targ.parentNode;
            if(targ.href || targ.parentNode.href) {
                var c = (targ.href) ? targ.href : targ.parentNode.href;
                if(c.indexOf('mailto:') != -1) {
                    IPCC_WEBCHAT.lastClicked = true;
                    setTimeout(function(){IPCC_WEBCHAT.lastClicked = false}, 1000);
                }
            }
        };
        window.onbeforeunload = function(e) {
            var e = e || window.event;
            if(IPCC_WEBCHAT.lastClicked == true) e.preventDefault();
            else {
                l.removeItem('popedUp');
                var s = document.getElementById('rateagent');
                if(s) var r = s.value;
                close_chat(r);
            }
        };
        window.onresize = function(){
            var h = 0, c = document.getElementById('wc_cb');
            if( typeof( window.innerWidth ) == 'number' ) {
                h = window.innerHeight;
            } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
                h = document.documentElement.clientHeight;
            }
            c.style.height = h + 'px';
        }
    }
    else {
        var cb = document.getElementById('wc_cb');
        if(cb && cb.style.display == 'none') switch_panel();
        remove_languages();
    }
    if(storageChat == 'true' && props.chatStarted == true) return;
    else if(storageName) {
        var f = document.getElementById('readtext');
        if(f) f.innerHTML = '';
        start_chat();
    }
    else {
        var jprms = '\"sid\":\"'+props.sessionId+'\"';
        json_rpc_async('getLanguages', jprms, getCategories);
    }
}
function start_chat() {
    var l = window.localStorage;
    var storageChat = l.getItem('chat');
    var storageName = l.getItem('uname');
    if(storageChat === 'otrue') return;
    var props = IPCC_WEBCHAT;
    var doc = document;
    props.timestampMsg = 0;
    props.chatStarted = true;
    if(window.opener) window.opener.IPCC_WEBCHAT.chatStarted = true;
    if(storageName) var unamev = storageName;
    else {
        var phone = doc.getElementById('phone');
        var lang = doc.getElementById('selectlang');
        var subject = doc.getElementById('subject');
        var bla = doc.getElementById('acceptbla');
        var uname = doc.getElementById('uname');
        if(phone) var phonev = phone.value;
        var langv = lang.options[lang.selectedIndex].value;
        if(subject) var subjectv = subject.value; 
        var unamev = uname.value;
        var err = false;
        if(unamev == '') {
            var la = document.getElementById('uname-label');
            if(la) la.className = 'wc_tooltip';
            addEventTo(uname, "keypress", function(){la.className=la.className.replace('wc_tooltip',"");});
            err = true;
        }
        if(bla && !bla.checked) {
            var alabel = doc.getElementById('accept');
            if(alabel) {
                alabel.className = 'wc_tooltip';
            addEventTo(bla, "change", function(){alabel.className=alabel.className.replace('wc_tooltip',"")});
            }
            err = true;
        }
        if(phonev && phonev.length != 0) {
            phonev = validPhone();
            if(!phonev) {
                var po = document.getElementById('phone-label');
                po.className = 'wc_tooltip';
                addEventTo(phone, "keyup", validPhone);
                err = true;
            }
        }
        if(err == true) return;
        else { 
            l.setItem('uname', unamev);
            l.setItem('ulang', langv);
            if(phonev != '') l.setItem('uphone', phonev);
        }
    }
    var jprms = '\"sid\":\"'+props.sessionId+'\"';
    if(langv) jprms += ',\"lang\":\"'+langv+'\"';
    if(subjectv) jprms += ',\"subject\":\"'+subjectv+'\"';
    if(unamev) jprms += ',\"uname\":\"'+unamev+'\"';
    if(phonev) jprms += ',\"phone\":\"'+phonev+'\"';
    json_rpc_async('chatRequest', jprms, chat_started);
}
function chat_started(result) {
    var l = window.localStorage;
    var d = new Date();
    var props = IPCC_WEBCHAT;
    var storageSound = l.getItem('soundOn');
    var storageChat = l.getItem('chat');
    if(window.opener) {
        window.opener.IPCC_WEBCHAT.shared = true;
    }
    else {
        props.shared = true;
        setTimeout('header_slideUp()', 5000);
    }
    switch_tab('wc_chat');
    if(storageSound === 'false') switch_sound();
    l.setItem('chat','true');
    props.gotMessage = true;
    if(IPCC_WEBCHAT_SETTINGS.chatBox && window.opener) {
        props.dialog.startTime = window.opener.IPCC_WEBCHAT.dialog.startTime;
        var s = document.getElementById('rateagent');
        s.value = window.opener.IPCC_WEBCHAT.operRating;
    }
    else props.dialog.startTime = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    props.dialog.messages = [];
    props.msgInterval = setInterval('check_messages()', 1000);
    if(storageChat !== 'true') props.toutInterval = setTimeout('chat_timeout()', result.timeout*1000);
}
function switch_sound() {
    var l = window.localStorage;
    var lang = IPCC_WEBCHAT_SETTINGS.userLang;
    var sl = WEBCHAT_LANG[lang];
    var set = IPCC_WEBCHAT_SETTINGS;
    var props = IPCC_WEBCHAT;
    var soundb = document.getElementById('switchsound');
    if(props.soundon == true) {
        props.soundon = false;
        soundb.setAttribute('src', set.path+'icons/soundoff.png');
        soundb.setAttribute('title', sl.soundOnTip);
        showInfobar(sl.soundOffinfo);
    }
    else {
        props.soundon = true;
        soundb.setAttribute('src', set.path+'icons/soundon.png');
        soundb.setAttribute('title', sl.soundOffTip);
        showInfobar(sl.soundOninfo);
    }
    l.setItem('soundOn', props.soundon);
}
function check_messages(){
    var props = IPCC_WEBCHAT;
    if(props.timestampMsg == -1 || props.gotMessage == false) return;
    var jprms = '\"sid\":\"'+props.sessionId+'\"';
    jprms += ',\"timestamp\":'+props.timestampMsg;
    json_rpc_async('getMessages', jprms, check_messages_);
    props.gotMessage = false;
}
function check_messages_(result){
    var set = IPCC_WEBCHAT_SETTINGS;
    var props = IPCC_WEBCHAT;
    var d = document;
    var l = window.localStorage;
    props.gotMessage = true;
    if(result.messages == undefined) return;
    var tx = d.getElementById("readtext");
    var storageName = l.getItem('uname');
    var i;
    for(i=0; i < result.messages.length; i++){
        var date = new Date(result.messages[i].time);
        var from = result.messages[i].from;
        props.queue.push(from);
        var text = result.messages[i].text;
        text = text.replace(/\n/g, '<br>');
        var p = d.createElement('p');
        var hours = date.getHours();
        if(hours.toString().length == 1) hours = '0' + hours;
        var minutes = date.getMinutes();
        if(minutes.toString().length == 1) minutes = '0' + minutes;
        if(from != storageName) {
            p.innerHTML += '<span style="color:'+set.chatBoxCol+'">'+hours+':'+minutes+' '+from+': </span>';
        }
        else p.innerHTML += '<span class="wc_udate">'+hours+':'+minutes+' '+from+': </span>';
        if(result.messages[i].file != undefined){
            text.replace(/\s/g, '%20');
            var innertext = text.substring(text.indexOf('_')+1);
            p.innerHTML += '<a href="http:'+set.server+'/ipcc/'+text+'" onclick="download_file(result.messages[i].text)" target="download_target">'+innertext+'</a>';
            if(i==0) download_file(result.messages[i].text);
        }
        else {
            var a;
            var w = text.split(/(<br>|\s|\n)/);
            for(var j=0; j<w.length;j++) {
                var s = w[j];
                var href = s;
                if(s.charAt(s.length-1) === '.' || s.charAt(s.length-1) === ',' || s.charAt(s.length-1) === ';') href = s.slice(0,-1);
                if(s.indexOf("http://") == 0 || s.indexOf("https://") == 0) {
                   p.innerHTML += '<a href="'+href+'" target="_blank">'+s+'</a> ';
                }
                else if(s.indexOf("www.")==0) {
                   p.innerHTML += '<a href="http://'+href+'" target="_blank">'+s+'</a> ';
                }
                else p.innerHTML += s+" ";
            }
        }
        tx.appendChild(p);
        text = text.replace(/<br>/g, '%0D%0A');
        props.dialog.messages.push('\n'+date.toLocaleString()+' '+from+': '+'\n'+text+'\n'+'%0A');
    }
    tx.scrollTop = tx.scrollHeight;
    if(props.soundon == true && props.timestampMsg != 0 && from != storageName) {
        var sound = d.getElementById('sound');
        sound.volume=0.2;
        if(sound.canPlayType) sound.play();
    }
    var c = 0;
    for(i=0; i<props.queue.length; i++) {
        if(props.queue[i] != '' && props.queue[i] != storageName) c+=1;
    }
    if(c>0) {
        if(l) l.setItem('timeout', 'false');
    }
    var cb = d.getElementById('wc_cb');
    if(cb && cb.style.display == 'none') {
        var sb = d.getElementById('wc_sb');
        if(sb && sb.style.display == 'none') return;
        else {
            switch_panel();
        }
    }
    props.timestampMsg = result.timestamp;
}
function download_file(filename){
    var div = document.createElement('div');
    div.style.display = 'none';
    var link = document.createElement('a');
    link.href = IPCC_WEBCHAT_SETTINGS.server+'/ipcc/'+filename;
    link.target = 'download_target';
    div.appendChild(link);
    document.getElementsByTagName('body')[0].appendChild(div);
    link.click();
}
function chat_timeout() {
    var props = IPCC_WEBCHAT;
    var storageTimeout = window.localStorage.getItem('timeout');
    if(props.timestampMsg > 0 && storageTimeout == 'false') return;
    switch_tab('wc_sendmail');
    clearInterval(props.msgInterval);
    var text = document.getElementById('writetext').value;
    var field = document.getElementById('textbody');
    field.innerHTML = text;
    var jprms = '\"sid\":\"'+props.sessionId+'\"';
    json_rpc_async('closeChat', jprms, null);
}
function close_chatBox() {
    resetView();
    var l = window.localStorage;
    IPCC_WEBCHAT.chatStarted = false;
    l.removeItem('timeout');
    l.removeItem('chat');
}
function close_chat(rating){
    var l = localStorage;
    var props = IPCC_WEBCHAT;
    var set = IPCC_WEBCHAT_SETTINGS;
    var d = document;
    var s = d.getElementById('rateagent');
    var r;
    l.removeItem('timeout');
    clearInterval(props.msgInterval);
    clearInterval(props.toutInterval);
    
    if(window.opener) {
        window.opener.unshare_browser();
        window.opener.IPCC_WEBCHAT.chatStarted = false;
        window.opener.resetView();        
    }
    else {
        unshare_browser();
        props.chatStarted = false;
        resetView();
    }
    
    var jprms = '\"sid\":\"'+props.sessionId+'\"';
    if(rating) r = rating;
    else if(s) r = s.value;
    else r = props.operRating;
    if(r) jprms += ',\"rating\":'+r;
    if(set.chatBox) {
        if(window.opener) json_rpc('closeChat', jprms);
        else json_rpc_async('closeChat', jprms, null);
        l.removeItem('chat');
    }
    else json_rpc('closeChat', jprms);
}
function close_chatWindow(){
    close_chat();
    window.close();
}
function remove_languages() {
    var sel = document.getElementById('selectlang');
    if(!sel) return;
    for(var i = sel.length - 1; i >= 0; i--) {
        sel.remove(i);
    }
}
function chat_popup() {
    var set = IPCC_WEBCHAT_SETTINGS;
    var props = IPCC_WEBCHAT;
    var l = window.localStorage;

    var sb = document.getElementById('wc_sb');
    var path = set.path;
    var lang = IPCC_WEBCHAT_SETTINGS.userLang;
    var html;
    if(sb && set.createButton && !set.chatBox) sb.style.display = 'none';
    if(lang === 'ru') html = 'wchat_ru.html';
    else if(lang === 'uk') html = 'wchat_uk.html';
    else html = 'wchat_en.html';
    var url = path+html;
    var w = 400, h = 500;
    var loff = (screen.width/2) - w/2;
    var toff = (screen.height/2) - h/2;
    props.chatWindow = window.open(url, 'webchat', 'left=' + loff + ',top=' + toff + ',width=' + w + ',height=' + h + ',location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes');
    if (window.focus) props.chatWindow.focus();
    l.setItem('popedUp', 'true');
    //--------------ChatBox----------------
    if(set.chatBox) {
        var sb = document.getElementById('wc_sb');
        var cb = document.getElementById('wc_cb');
        if(sb) sb.style.display = 'none';
        if(cb) cb.style.display = 'none';
        clearInterval(props.msgInterval);
    }
}
function send_chat(id) {
    var props = IPCC_WEBCHAT;
    var body = '';
    for(var i=0; i<props.dialog.messages.length; i++) {
        body += props.dialog.messages[i];
    }
    var hrefcont = "mailto: ?subject= &body="+body;
    var a = document.getElementById(id);
    a.setAttribute("href", hrefcont);
    return;
}
function send_complain(){
    var props = IPCC_WEBCHAT;
    var lang = IPCC_WEBCHAT_SETTINGS.userLang;
    var sl = WEBCHAT_LANG[lang];
    var valid = /\S+@\S+\.\S+/;
    var email = document.getElementById('email2');
    var la = document.getElementById('email2-label');
    var jprms = '\"sid\":\"'+IPCC_WEBCHAT.sessionId+'\"';
    jprms += ',\"uname\":\"'+document.getElementById('uname').value+'\"';
    if(valid.test(email.value)) {
        jprms += ',\"email\":\"'+email.value+'\"';
        la.className=la.className.replace('wc_tooltip',"")
        email.value = '';
    }
    else {
        la.className= 'wc_tooltip';
        addEventTo(email, "keypress", function(){la.className=la.className.replace('wc_tooltip',"");});
        return;
    }
    var dg = '';
    for(var i=0; i<props.dialog.messages.length; i++) {
        dg += props.dialog.messages[i];
    }
    dg = '\n --------------------DIALOG--------------------' + dg;
    var text = document.getElementById("textbody2").value + '\n' + dg;
    text = text.replace(/\\/g,'\\\\');
    text = text.replace(/\"/g,'\\"');
    text = text.replace(/\t/g,'\\t');
    text = text.replace(/\r/g,'\\r');
    text = text.replace(/\n/g,'\\n');
    text = text.replace(/%0D%0A/g, '\\n');
    text = text.replace(/%0A/g, '');
    text = props.dialog.startTime + ': ' + text;
    jprms += ',\"text\":\"'+text+'\"';
    document.getElementById("textbody2").value = '';
    json_rpc_async('sendMail', jprms, null);
    switch_tab('wc_chat');
    showInfobar(sl.sentComplainInfo);
}
function send_mail() {
    var fileUpload = document.getElementById("attachment");
    if(fileUpload) var filelist = fileUpload.files;
    if(!window.FileReader || !filelist || filelist.length == 0) send_mail_(null);
    else{
        var reader = new FileReader();
        reader.onload = function(event) {
            send_mail_(event.target.result);
        };
        reader.onerror = function(event) {
            alert('FileReader: ' + event.target.error.code);
        };
        reader.readAsDataURL(filelist[0]);
    }
}
function send_mail_(dataurl) {
    var doc = document;
    var d = new Date();
    var e = doc.getElementById('oblemail');
    var valid = /\S+@\S+\.\S+/;
    var email = doc.getElementById('email');
    var la = doc.getElementById('email-label');
    var fileUpload = doc.getElementById("attachment");
    var jprms = '\"sid\":\"'+IPCC_WEBCHAT.sessionId+'\"';
    jprms += ',\"uname\":\"'+doc.getElementById('uname').value+'\"';
    if(valid.test(email.value)) {
        jprms += ',\"email\":\"'+email.value+'\"';
        la.className=la.className.replace('wc_tooltip',"");
        if(e) e.style.display = 'block';
    }
    else {
        la.className='wc_tooltip';
        addEventTo(email, "keypress", function(){la.className=la.className.replace('wc_tooltip',"");});
        if(e) e.style.display = 'block';
        return;
    }
    var text = doc.getElementById("textbody");
    var textv = text.value;
    textv = textv.replace(/\\/g,'\\\\');
    textv = textv.replace(/\"/g,'\\"');
    textv = textv.replace(/\t/g,'\\t');
    textv = textv.replace(/\r/g,'\\r');
    textv = textv.replace(/\n/g,'\\n');
    textv = d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + ': ' +'\\n'+textv;
    
    var name = doc.getElementById("uname2");
    var phone = doc.getElementById("phone2");
    var category; 
    if(window.opener) category = window.opener.IPCC_WEBCHAT.productName;
    else category = IPCC_WEBCHAT.category;
    var message = 'Name: '+name.value+'\\n'+'Phone: '+phone.value+'\\n'+'Category: '+category+'\\n'+textv;
    jprms += ',\"text\":\"'+message+'\"';
    if(dataurl != null){
        var filename = fileUpload.value;
        var n = filename.lastIndexOf("\\");
        if(n != -1) filename = filename.substring(n+1);
        jprms += ',\"filename\":\"'+filename+'\"';
        dataurl = dataurl.substring(dataurl.indexOf(',')+1)
        jprms += ',\"filedata\":\"'+dataurl+'\"';
    }
    json_rpc_async('sendMail', jprms, null);
    name.value = '';
    phone.value = '';
    text.value = '';
    email.value = '';
    if(fileUpload) fileUpload.parentNode.replaceChild(fileUpload.cloneNode(true), fileUpload);
    if(window.opener) {
        switch_tab('wc_thankyou');
        setTimeout(close, 3000);
    }
    else {
        switch_panel();
    }
    function close() {
        window.close();
    }
}
function join_session(sid){
    var props = IPCC_WEBCHAT;
    props.currentURL = document.URL;
    props.sessionId = sid;
    var jprms = '\"sid\":\"'+sid+'\"';
    json_rpc('joinSession', jprms);
}
function disjoin_session(){
    var props = IPCC_WEBCHAT;
    var l = window.localStorage;
    var storageChat = l.getItem('chat');
    if(props.chatStarted || storageChat == 'otrue') return;
    var jprms = '\"sid\":\"'+props.sessionId+'\"';
    var result = json_rpc('disjoinSession', jprms);
}
function create_session(){
    var props = IPCC_WEBCHAT;
    var storageChat = window.localStorage.getItem('chat');
    if(storageChat == 'otrue') return;
    props.currentURL = document.URL;
    if(props.currentURL.indexOf('#') != -1) props.currentURL = props.currentURL.substring(0, props.currentURL.indexOf('#'));
    var jprms = '\"url\":\"'+props.currentURL+'\"';
    console.log(jprms);
    json_rpc_async('createSession', jprms, new_session);
}
function new_session(result) {
    console.log(result);
    var props = IPCC_WEBCHAT;
    props.sessionId = result.sid;
    window.localStorage.setItem('sid', props.sessionId);
    props.updInterval = setInterval('check_updates()', 200);
    if(props.chatWindow != undefined) props.chatWindow.init_chat();
    if(props.chatStarted == true) {
        init_chat();
    }
}
function sessionTimeoutHandler(method) {
    var props = IPCC_WEBCHAT;
    var l = window.localStorage;
    l.removeItem('uname');
    l.removeItem('chat');
    l.removeItem('sid');
    l.removeItem('soundOn');
    l.removeItem('chatHeight');
    l.removeItem('chatWidth');
    clearInterval(props.updInterval);
    clearInterval(props.msgInterval);

    if(method === 'disjoinSession' || method === 'closeChat') return;
    else if(method === 'getLanguages') {
        props.chatStarted = true;
        if(window.opener) window.opener.create_session();
        else create_session();
    }
    else if(method === 'getMessages' || method === 'updateEvents') {
        switch_tab('wc_sessiontimeout');
    } 
    else create_session();
}
function xmlhttpErrorHandler(method, status, error) {
    if(method === 'getMessages') IPCC_WEBCHAT.gotMessage = true;
}
function json_rpc(method, params){
    var jsonrpc;
    if(params == null)
        jsonrpc = '{\"method\":\"'+method+'\", \"id\":'+1+'}';
    else
        jsonrpc = '{\"method\":\"'+method+'\", \"params\":{'+params+'}, \"id\":'+1+'}';
    var xmlhttp = getXmlHttp();
    xmlhttp.open("POST", IPCC_WEBCHAT_SETTINGS.server+"/ipcc/$$$", false);
    if(!window.XDomainRequest) {
        xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    }
    xmlhttp.send(jsonrpc);
    var parsedJSON = JSON.parse(xmlhttp.responseText);
    if(parsedJSON.error != undefined){
        if(parsedJSON.error.code == 404 || parsedJSON.error.code == 406) sessionTimeoutHandler(method);
    }
    return parsedJSON.result;
}
function json_rpc_async(method, params, handler){
    var jsonrpc;
    if(params == null)
        jsonrpc = '{\"method\":\"'+method+'\", \"id\":'+1+'}';
    else
        jsonrpc = '{\"method\":\"'+method+'\", \"params\":{'+params+'}, \"id\":'+1+'}';
    var xmlhttp = getXmlHttp();
    if(window.XDomainRequest) {
        var requestTimer = setTimeout(function(){
            xmlhttp.abort();
            IPCC_WEBCHAT.gotMessage = true;
        }, 30000);
        xmlhttp.onload = function() {
            clearTimeout(requestTimer);
            var parsedJSON = JSON.parse(xmlhttp.responseText);
            if(parsedJSON.error != undefined){
                if(parsedJSON.error.message == 'Not Found') sessionTimeoutHandler(method);
            }
            if(parsedJSON.result != undefined && (parsedJSON.result != '' || method === 'getLanguages')){
                if(handler != null) {
                    handler(parsedJSON.result);
                }
            }

        }
        xmlhttp.open("POST", IPCC_WEBCHAT_SETTINGS.server+"/ipcc/$$$", true);
        xmlhttp.onprogress = function() {};
        xmlhttp.send(jsonrpc);
        console.log(IPCC_WEBCHAT_SETTINGS.server+"/ipcc/$$$"+ ' ' +jsonrpc);
    }
    else {
        xmlhttp.open("POST", IPCC_WEBCHAT_SETTINGS.server+"/ipcc/$$$", true);
        var requestTimer = setTimeout(function(){
            xmlhttp.abort();
            IPCC_WEBCHAT.gotMessage = true;
        }, 30000);
        xmlhttp.onreadystatechange = function() {
            console.log(xmlhttp);
            if (xmlhttp.readyState==4){
                clearTimeout(requestTimer);
                if(xmlhttp.status != 200) {
                    xmlhttpErrorHandler(method, xmlhttp.status, null);
                };
                if(xmlhttp.responseText) {
                    var parsedJSON = JSON.parse(xmlhttp.responseText);
                    if(parsedJSON.error != undefined){
                        if(parsedJSON.error.message == 'Not Found') sessionTimeoutHandler(method);
                        else xmlhttpErrorHandler(method, null, parsedJSON.error.message);
                    }
                    else if(parsedJSON.result != undefined && (parsedJSON.result != '' || method === 'getLanguages')){
                        if(handler != null) {
                            handler(parsedJSON.result);
                        }
                    }
                }
            }
        };
        
        xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xmlhttp.send(jsonrpc);
    }
}
function getXmlHttp(){
    var XHR = window.XDomainRequest || window.XMLHttpRequest;
    return new XHR();
} 
function switch_tab(tabid){
    var div = document.getElementById(tabid);
    var parent = div.parentNode;
    var child = parent.firstChild;
    while(child != null){
        if(child.style) child.style.display = 'none';
        child = child.nextSibling;
    }
    div.style.display = '';
}
function get_file(upload){
    var lang = IPCC_WEBCHAT_SETTINGS.userLang;
    var sl = WEBCHAT_LANG[lang];
    if(!window.FileReader) {
        alert(sl.obsoleteBrowser);
        return;
    }
    var fileupload = document.getElementById(upload);
    fileupload.click();
}
function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) return true;
         node = node.parentNode;
     }
     return false;
}
function showInfobar(text){
    var cont = document.getElementById('wc_cb'),
        o = document.createElement('div'),
        s = document.createElement('span'),
        t = document.getElementsByClassName('infobar-container');

    if(t.length){
        for(var i=0;i<t.length;i++){
            t[i].style.opacity ='0';
        }
    }
    o.className = 'infobar-container';
    s.className = 'infobar-text';
    s.innerHTML = text;
    o.appendChild(s);
    cont.appendChild(o);
    o.style.opacity = '1';
    setTimeout(function(){o.style.opacity = '0'}, 3000);
    setTimeout(function(){cont.removeChild(o);}, 3500);
}
function addEvent(evt, func) {
    var d = document;
    if (d.addEventListener) d.addEventListener(evt, func, false);
    else if (d.attachEvent) d.attachEvent('on'+evt, func);
    else d.evnt = func;
}
function removeEvent(evt, func) {
    var d = document;
    if (d.addEventListener) d.removeEventListener(evt, func, false);
    else if (d.attachEvent) d.detachEvent('on'+evt, func);
    else d.evnt = null;
}
function addEventTo(obj, evType, fn) {
  if (obj.addEventListener) obj.addEventListener(evType, fn, false); 
  else if (obj.attachEvent) obj.attachEvent("on"+evType, fn); 
}
function removeEventFrom(obj, evType, fn) {
  if (obj.removeEventListener) obj.removeEventListener(evType, fn, false); 
  else if (obj.detachEvent) obj.detachEvent("on"+evType, fn); 
}

(function() {
    var query = document.URL;
    if(query.indexOf('wchat') != -1) init_chat();
    else ipcc_connect();
}());