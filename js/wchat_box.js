//window.onerror = function(msg, url, linenumber) {
//     alert('Error message: '+msg+'\nURL: '+url+'\nLine number: '+linenumber);
//     return true;
// };
 
function create_button(lang) {
//    localStorage.clear();
    var clang = WEBCHAT_LANG[lang];
    var set = IPCC_WEBCHAT_SETTINGS;
    var storageChat = window.localStorage.getItem('chat');
    var storagePop = window.localStorage.getItem('popedUp');
    var pos = set.buttonPosition;
    
    var s_button = document.createElement('div');
    s_button.id = 'wc_sb';
    s_button.setAttribute('onclick', 'show_chat()');
    s_button.style.background = set.buttonBackgr;
    s_button.style.border = set.buttonBorder;
    
    var text_div = document.createElement('div');
    text_div.className = text_div.className + 'wc_div_text';
    text_div.style.color = set.buttonFontCol;
    text_div.style.fontFamily = set.buttonFontFam;
    var br = document.createElement('br');
    var s = clang.buttonText;
    for(var i=0; i<s.length; i++) {
        var span = document.createElement('span');
        span.innerHTML = s[i];
        text_div.appendChild(span);
        if(s[i]==' ') text_div.appendChild(br);
    }
    var img_div = document.createElement('div');
    img_div.className = img_div.className + 'wc_div_img';
    var m = document.createElement('img');
    m.className = m.className + 'wc_button_img';
    m.src = set.path+'icons/schat.png';
    img_div.appendChild(m);
    
    s_button.appendChild(img_div);
    s_button.appendChild(text_div);

    if(pos == 'right') s_button.style.right = '0';
    else if(pos == 'left') s_button.style.left = '0';
    document.getElementsByTagName('body')[0].appendChild(s_button);
    if(storageChat === 'otrue' || storagePop === 'true') s_button.style.display = 'none';
}
function create_chatbox(lang) {
    var clang = WEBCHAT_LANG[lang];
    var set = IPCC_WEBCHAT_SETTINGS;
    var local = window.localStorage;
    var path = set.path;
    var pos = set.buttonPosition;
    var dc = document;
    var b = dc.body;
    var d = 'div';
    var i = 'img';
    var cont = dc.createElement(d);
    cont.id = 'wc_cb';
    cont.className = cont.className + 'wc_cont';
    cont.style.fontFamily = set.chatBoxFontFam;
    cont.style.borderColor = set.chatBoxCol;
    cont.style.display = 'none';
    cont.style.height = local.getItem('chatHeight');
    cont.style.width = local.getItem('chatWidth');
    if(pos == 'right') cont.style.right = '25px';
    else if(pos == 'left') cont.style.left = '25px';
    
//----------creating prechat panel----------
    var bpc = dc.createElement(d);
    bpc.id = 'wc_prechat';
    bpc.className = bpc.className + 'wc_panels';
    bpc.style.background = set.chatBoxBackgr; 
    var wr = dc.createElement(d);
    wr.id = 'wr';
    for(var j=1; j<4; j++) {
        var label = dc.createElement('label');
        var it = dc.createElement('input');
        if(j==1) {
            it.id = 'uname';
            it.setAttribute('placeholder',clang.userNamePlaceholder);
            label.setAttribute('for','uname');
            label.setAttribute('data-title',clang.userNameTooltip);
            label.id = 'uname-label';
            label.innerHTML = '<span style="font-weight:bold">'+clang.userName+'</span><span style="color:red">*</span>';
        }
        else if(j==2) {
            it.id = 'phone';
            it.setAttribute('placeholder',clang.userTelPlaceholder);
            label.setAttribute('for','phone');
            label.setAttribute('data-title',clang.userTelTooltip);
            label.id = 'phone-label';
            label.innerHTML = clang.userTel;
        }
        else { 
            it.id = 'subject';
            it.setAttribute('placeholder',clang.userQuestionPlaceholder);
            label.setAttribute('for','subject');
            label.innerHTML = clang.userQuestion;
        }
        it.type = 'text';
        it.className = it.className + 'wc_bfield';
        it.setAttribute('maxlength','100');
        wr.appendChild(label);
        var br = dc.createElement('br');
        wr.appendChild(br);
        wr.appendChild(it);
        br = dc.createElement('br');
        wr.appendChild(br);
    }     
    label = dc.createElement('label');
    var sel = dc.createElement('select');
    sel.id = 'selectlang';
    sel.className = sel.className + 'wc_sfield';
    label.setAttribute('for','selectlang');
    label.innerHTML = clang.userLanguage;
    wr.appendChild(label);
    br = dc.createElement('br');
    wr.appendChild(br);
    wr.appendChild(sel);
    br = dc.createElement('br');
    wr.appendChild(br); 
    var checkb = dc.createElement('input');
    checkb.id = 'acceptbla';
    checkb.type = 'checkbox';
    checkb.className = checkb.className + 'wc_sfield';
    wr.appendChild(checkb); 
    label = dc.createElement('label');
    label.setAttribute('data-title',clang.checkbTooltip);
    label.id = 'accept';
    label.setAttribute('for','acceptbla');
    label.setAttribute('data-title', clang.checkbTooltip);
    label.innerHTML = '<span style="font-weight:bold">'+clang.acceptLabel+'</span><span style="color:red">*</span><br><a href="conditions.html");return false">'+clang.termsLink+'</a>';
    wr.appendChild(checkb); 
    wr.appendChild(label);
    br = dc.createElement('br');
    wr.appendChild(br);
    var a = dc.createElement('a');
    a.href = '#';
    a.id = 'startchat';
    a.className = a.className + 'wc_startB';
    a.style.background = set.chatBoxCol;
    a.setAttribute('onclick', 'start_chat();return false');
    a.innerHTML = clang.startChatButton;
    wr.appendChild(a);
    a = dc.createElement('a');
    a.href = '#';
    a.id = 'closeChatbox';
    a.className = a.className + 'wc_closeB';
    a.setAttribute('onclick', 'close_chatBox();return false');
    a.innerHTML = clang.closeChatButton;
    wr.appendChild(a);
    bpc.appendChild(wr);

//----------creating chat panel----------
    var bc = dc.createElement(d);
    bc.id = 'wc_chat';
    bc.className = bc.className + 'wc_panels'; 
    bc.style.background = set.chatBoxBackgr;
//creating header
    var hwrap = dc.createElement(d);
    hwrap.className = hwrap.className + 'wc_hw';
    addEventTo(hwrap, "mouseover", header_slideDown);
    addEventTo(hwrap, "mouseout", header_slideUp);
    var header = dc.createElement(d);
    header.id = 'hd';
    header.className = header.className + 'wc_header';
    header.style.background = set.chatBoxCol;
    var hdiv1 = dc.createElement(d);
    hdiv1.id = 'resizebox';
    hdiv1.className = hdiv1.className + 'wc_resize';
    var rimg1 = dc.createElement(i);
    rimg1.src = path+'icons/resize.png';
    rimg1.setAttribute('title', clang.resizeTip);
    hdiv1.appendChild(rimg1);
    header.appendChild(hdiv1);
    var hdiv2 = dc.createElement(d);
    hdiv2.className = hdiv2.className + 'wc_wnavi';
    var rimg4 = dc.createElement(i);
    rimg4.src = path+'icons/close.png';
    rimg4.setAttribute('title', clang.closeTip);
    rimg4.setAttribute('onclick', 'close_chat()');
    hdiv2.appendChild(rimg4);
    var rimg3 = dc.createElement(i);
    rimg3.src = path+'icons/popup.png';
    rimg3.setAttribute('title', clang.newWindowTip);
    rimg3.setAttribute('onclick', 'return chat_popup()');
    hdiv2.appendChild(rimg3);
    var rimg2 = dc.createElement(i);
    rimg2.src = path+'icons/minimize.png';
    rimg2.setAttribute('title', clang.minimizeTip);
    rimg2.setAttribute('onclick', 'switch_panel()');
    hdiv2.appendChild(rimg2);
    header.appendChild(hdiv2);
    hwrap.appendChild(header);
    bc.appendChild(hwrap);
//creating reading field
    var rbody = dc.createElement(d);
    rbody.id = 'rfbody';
    var readf = dc.createElement(d);
    readf.id = 'readtext';
    readf.className = readf.className + 'wc_readfield';
    rbody.appendChild(readf);
    var bimg1 = dc.createElement(i);
    bimg1.id = 'logo';
    bimg1.src = set.logoSrc;
    rbody.appendChild(bimg1);
    
    var bldiv2 = dc.createElement(d);
    bldiv2.className = 'wc_bottomico';
    bldiv2.style.borderTopColor = set.chatBoxCol;
    bldiv2.style.borderBottomColor = set.chatBoxCol;
    var bimg2 = dc.createElement(i);
    bimg2.src= path+'icons/soundon.png';
    bimg2.id='switchsound';
    bimg2.setAttribute('onclick','switch_sound()');
    bimg2.setAttribute('title',clang.soundOffTip);
    bldiv2.appendChild(bimg2);
    var bimg3 = dc.createElement(i);
    bimg3.src= path+'icons/rate.png';
    bimg3.id='brateagent';
    bimg3.className = bimg3.className + 'wc_rightfloat';
    bimg3.setAttribute('onclick','show_rating()');
    bimg3.setAttribute('title',clang.rateAgent);
    bldiv2.appendChild(bimg3);
    var bimg4 = dc.createElement('a');
    bimg4.href='#';
    bimg4.id='sendchat';
    bimg4.className = bimg4.className + 'wc_rightfloat';
    bimg4.setAttribute('onclick',"send_chat(\'sendchat\')");
    var i4 = dc.createElement('img');
    i4.src = path+'icons/send.png';
    i4.setAttribute('title',clang.sendChatTip);
    bimg4.appendChild(i4);
    bldiv2.appendChild(bimg4);
    var bimg5 = dc.createElement(i);
    bimg5.src= path+'icons/file.png';
    bimg5.id='sendfile';
    bimg5.className = bimg5.className + 'wc_rightfloat';
    bimg5.setAttribute('onclick',"get_file(\'upload\')");
    bimg5.setAttribute('title',clang.sendFileTip);
    bldiv2.appendChild(bimg5);
    var bimg6 = dc.createElement(i);
    bimg6.src= path+'icons/complain.png';
    bimg6.id='complain';
    bimg6.className = bimg6.className + 'wc_rightfloat';
    bimg6.setAttribute('onclick',"switch_tab(\'wc_sendcomplain\')");
    bimg6.setAttribute('title',clang.writeComplain);
    bldiv2.appendChild(bimg6);
    var rt = dc.createElement(d);
    rt.id = 'orating';
    for(var i=5; i>=2; i--) {
        var s = document.createElement('span'); 
        s.id = 'r'+i;
        s.setAttribute('onclick', 'rate_oper('+i+')');
        s.innerHTML = i;
        rt.appendChild(s);
    }
    rt.style.display = 'none';
    bldiv2.appendChild(rt);
    bc.appendChild(rbody);    
    bc.appendChild(bldiv2);
//crating writing textarea
    var tfc = dc.createElement('div');
    tfc.className = tfc.className + 'wc_writecont';
    var tf = dc.createElement('textarea');
    tf.id = 'writetext';
    tf.className = tf.className + 'wc_writefield';
    addEventTo(tf, "keypress", send_message_onkey);
    tf.setAttribute('maxlength','1500');
    tf.setAttribute('placeholder', clang.writeMessagePlaceholder);
    tfc.appendChild(tf);
    bc.appendChild(tfc);
//creating send message span
    var s = dc.createElement('span');
    s.id = 'sendmessage';
    s.className = s.className + 'wc_sendspan';
    s.title = clang.sendMessageTip;
    s.setAttribute('onclick', 'send_message()');
    s.innerHTML = 'Ctrl+Enter';
    bc.appendChild(s);
    bc.style.display = 'none';
//creating upload div
    var upl = dc.createElement(d);
    it = dc.createElement('input');
    it.id = 'upload';
    it.type = 'file';
    it.setAttribute('onchange', 'send_file()');
    upl.appendChild(it);
    upl.style.display = 'none';
//craeting audio tag
    var au = dc.createElement('audio');
    au.id = 'sound';
    var sr = dc.createElement('source');
    sr.src = path+'sounds/notify.ogg';
    sr.type = 'audio/ogg';
    au.appendChild(sr);
    sr = dc.createElement('source');
    sr.src = path+'sounds/notify.mp3';
    sr.type = 'audio/mpeg';
    au.appendChild(sr);
//creating iframe for downloading files
    var fr = dc.createElement('iframe');
    fr.name = 'download_target';
    fr.style.display = 'none';
//-----creating complain panel-----
    var bco = dc.createElement(d);
    bco.id = 'wc_sendcomplain';
    bco.className = bco.className + 'wc_panels';
    bco.style.background = set.chatBoxBackgr;
//creating header
    var h = dc.createElement(d);
    h.className = h.className + 'wc_coheader';
    var a1 = dc.createElement('a');
    a1.href = '#';
    a1.className = a1.className + 'wc_backb';
    a1.setAttribute('onclick', 'switch_tab("wc_chat"); return false');
    a1.style.background = set.chatBoxCol;
    a1.innerHTML = clang.backButton;
    var p = dc.createElement('p');
    p.innerHTML = clang.paragraph1;
    var inp = dc.createElement('input');
    inp.setAttribute('type', 'email');
    inp.id = 'email2';
    inp.className = inp.className + 'wc_bfield';
    inp.setAttribute('placeholder', clang.userEmailPlaceholder);
    br = dc.createElement('br');
    var l = dc.createElement('label');
    l.setAttribute('for', 'email2');
    l.setAttribute('data-title',clang.userEmailTooltip);
    l.id = 'email2-label';
    l.innerHTML = clang.userEmail;
    l.style.fontWeight = 'bold';
    h.appendChild(a1);
    h.appendChild(p);
    h.appendChild(l);
    h.appendChild(br);
    h.appendChild(inp);
    bco.appendChild(h);
//creating body
    var bd = dc.createElement(d);
    bd.className = bd.className + 'wc_cobody';
    l = dc.createElement('label');
    l.setAttribute('for', 'textbody2');
    l.innerHTML = clang.writeComplainLabel;
    br = dc.createElement('br');
    var t = dc.createElement('textarea');
    t.id = 'textbody2';
    t.className = t.className + 'wc_cofield';
    t.setAttribute('maxlength', '1500');
    t.setAttribute('placeholder', clang.writeComplainPlaceholder);
    var a2 = dc.createElement('a');
    a2.href = '#';
    a2.className = a2.className + 'wc_sendspan';
    a2.setAttribute('onclick', 'send_complain();return false');
    a2.innerHTML = clang.sendComplain;
    bd.appendChild(a2);
    bd.appendChild(l);
    bd.appendChild(br);
    bd.appendChild(t);
    bco.appendChild(bd);
    bco.style.display = 'none';
//-----creating send message panel-----
    var bm = dc.createElement(d);
    bm.id = 'wc_sendmail';
    bm.className = bm.className + 'wc_panels';
    bm.style.background = set.chatBoxBackgr;
//creating header
    var h = dc.createElement(d);
    h.className = h.className + 'wc_coheader';
    var a1 = dc.createElement('a');
    a1.href = '#';
    a1.className = a1.className + 'wc_backb';
    a1.setAttribute('onclick', 'close_chatBox();return false');
    a1.style.background = set.chatBoxCol;
    a1.innerHTML = clang.closeChatButton;
    var p = dc.createElement('p');
    p.innerHTML = clang.paragraph2;
    
    h.appendChild(a1);
    h.appendChild(p);
    for(j=1;j<4;j++){
        var label = dc.createElement('label');
        var it = dc.createElement('input');
        if(j==1) {
            it.id = 'uname2';
            it.type = 'text';
            it.setAttribute('placeholder',clang.userNamePlaceholder);
            label.setAttribute('for','uname');
            label.innerHTML = clang.userName;
        }
        else if(j==2){
            it.id = 'email';
            it.setAttribute('type','email');
            it.setAttribute('placeholder',clang.userEmailPlaceholder);
            label.setAttribute('for','email');
            label.setAttribute('data-title',clang.userEmailTooltip);
            label.id = 'email-label';
            label.innerHTML = clang.userEmail+'<span style="color:red">*</span>';
        }
        else if(j==3) {
            it.id = 'phone2';
            it.type = 'text';
            it.setAttribute('placeholder',clang.userTelPlaceholder);
            label.setAttribute('for','phone');
            label.innerHTML = clang.userTel;
        }
        it.className = it.className + 'wc_bfield';
        it.setAttribute('maxlength','100');
        h.appendChild(label);
        var br = dc.createElement('br');
        h.appendChild(br);
        h.appendChild(it);
        br = dc.createElement('br');
        h.appendChild(br);
    }
    
    h.appendChild(br);
    bm.appendChild(h);
//creating body
    var bd = dc.createElement(d);
    bd.className = bd.className + 'wc_cobody';
    l = dc.createElement('label');
    l.setAttribute('for', 'textbody');
    l.innerHTML = clang.writeEmailLabel;
    br = dc.createElement('br');
    var t = dc.createElement('textarea');
    t.id = 'textbody';
    t.className = t.className + 'wc_cofield';
    t.setAttribute('maxlength', '1500');
    t.setAttribute('placeholder', clang.writeEmailPlaceholder);
    var a2 = dc.createElement('a');
    a2.href = '#';
    a2.className = a2.className + 'wc_sendspan';
    a2.setAttribute('onclick', 'send_mail();return false');
    a2.innerHTML = clang.sendEmail;
    bd.appendChild(a2);
    bd.appendChild(l);
    bd.appendChild(br);
    bd.appendChild(t);
    bm.appendChild(bd);
    bm.style.display = 'none';
//-----creating session timeout panel-----
    var ba = dc.createElement(d);
    ba.id = 'wc_sessiontimeout';
    ba.className = ba.className + 'wc_panels';
    ba.style.background = set.chatBoxBackgr;
    var p1 = dc.createElement('p');
    p1.innerHTML = clang.paragraph3; 
    ba.appendChild(p1);
    var box = dc.createElement(d);
    box.className = box.className + 'wc_sendBox'; 
    var p2 = dc.createElement('p');
    p2.innerHTML = clang.sendChatLabel; 
    box.appendChild(p2);
    var a3 = dc.createElement('a');
    a3.id = 'sendchat2';
    a3.className = a3.className + 'wc_emailIco';
    a3.setAttribute('onclick', 'send_chat("sendchat2")');
    var i = dc.createElement('img');
    i.src = path+'icons/send.png';
    i.setAttribute('title',clang.sendChatTip);
    a3.appendChild(i);
    box.appendChild(a3);
    var a1 = dc.createElement('a');
    a1.href = '#';
    a1.innerHTML = clang.newChatButton;
    a1.setAttribute('onclick','init_chat();return false');
    a1.style.background = set.chatBoxCol;
    a1.className = a1.className + 'wc_startB';
    ba.appendChild(a1);
    var a2 = dc.createElement('a');
    a2.innerHTML = clang.closeChatButton;
    a2.href = '#';
    a2.setAttribute('onclick','close_chatBox();return false');
    a2.className = a2.className + 'wc_closeB';
    ba.appendChild(a2);
    ba.appendChild(box);
    ba.style.display = 'none';
//-----appending chat panels to the chatbox-----
    cont.appendChild(bpc);
//    cont.appendChild(bt);
    cont.appendChild(bc);
    cont.appendChild(bco);
    cont.appendChild(bm);
    cont.appendChild(ba);
    cont.appendChild(upl);
    cont.appendChild(au);
    cont.appendChild(fr);
//-----appending chatbox to the document's body-----
    document.getElementsByTagName('body')[0].appendChild(cont);
//-----making chatbox resizable-----
    addEventTo(hdiv1, 'mousedown', function(event){
        event.preventDefault();
        var rect = cont.getBoundingClientRect();
        var sT = rect.top, 
        sL = rect.left;
        var Y = event.pageY,
        X = event.pageX;
        var sH = cont.offsetHeight,
        sW = cont.offsetWidth;
        var style = window.getComputedStyle(cont),
        mHp = style.getPropertyValue('min-height'),
        mWp = style.getPropertyValue('min-width');
        var mH = parseInt(mHp.substr(0, mHp.indexOf('px'))),
        mW = parseInt(mWp.substr(0, mWp.indexOf('px')));
    
        var mouseMoveHandler1 = function (event) {
            event.preventDefault();
            var yY = event.pageY, xX = event.pageX;
            if(event.pageY<0) yY = 0; if(event.pageX<0) xX = 0;
            var h = sH + (Y - yY) + 'px';
            var w = sW + (X - xX) + 'px';
            cont.style.height = h;
            cont.style.width = w;
            if(cont.offsetHeight <= mH+2) void(0);
            else cont.style.top = sT + (yY - Y) + 'px';
            if(cont.offsetWidth <= mW+2) void(0);
            else cont.style.left = sL + (xX - X) + 'px';
            if(cont.offsetWidth > mW+200) readf.style.fontSize = '1.15em';
            else if(cont.offsetWidth < mW+200) readf.style.fontSize = '1em';
            
            local.setItem('chatHeight', h);
            local.setItem('chatWidth', w);
        };
        var mouseUpHandler1 = function (event) {
            removeEventFrom(document, "mousemove", mouseMoveHandler1);
            removeEventFrom(document, "mouseup", mouseUpHandler1);
        };
        addEventTo(document, 'mousemove', mouseMoveHandler1);
        addEventTo(document, 'mouseup', mouseUpHandler1);
    });
//-----making chatbox draggable-----
    addEventTo(hdiv2, 'mousedown', function(event){
        event.preventDefault();
        var rect = cont.getBoundingClientRect();
        var startY = event.pageY;
        var startX = event.pageX;
        var startTop = rect.top;
        var startLeft = rect.left;
        
        var mouseMoveHandler2 = function(event) {
            event.preventDefault();
            var yY = event.pageY, xX = event.pageX;
            if(event.pageY<0) yY = 0; if(event.pageX<0) xX = 0;
            var newTop = startTop + (yY - startY);
            cont.style.top = newTop + 'px';
            var newLeft = startLeft + (xX - startX);
            cont.style.left = newLeft + 'px';
            
        };
        var mouseUpHandler2 = function(event) {
            removeEventFrom(document, "mousemove", mouseMoveHandler2);
            removeEventFrom(document, "mouseup", mouseUpHandler2);
        };
        addEventTo(document, 'mousemove', mouseMoveHandler2);
        addEventTo(document, 'mouseup', mouseUpHandler2);
    });
//-----making write field resizable-----
    addEventTo(bldiv2, 'mousedown', function(event){
        event.preventDefault();
        var startY = event.pageY;
        var wstartHeight = tfc.offsetHeight;
        var rstartHeight = rbody.offsetHeight;
        var contHeight = cont.offsetHeight;
        
        var mouseMoveHandler3 = function (event) {
            event.preventDefault();
            var wnewHeight = wstartHeight + (startY - event.pageY);
            var wnewHeightP = (wnewHeight/contHeight)*100;
            tfc.style.height = Math.round(wnewHeightP) + '%';
            var rnewHeight = rstartHeight - (startY - event.pageY);
            var rnewHeightP = (rnewHeight/contHeight)*100;
            rbody.style.height = Math.round(rnewHeightP) + '%';
        };
        var mouseUpHandler3 = function (event) {
            removeEventFrom(document, "mousemove", mouseMoveHandler3);
            removeEventFrom(document, "mouseup", mouseUpHandler3);
        };
        addEventTo(document, 'mousemove', mouseMoveHandler3);
        addEventTo(document, 'mouseup', mouseUpHandler3); 
    });
}

function resetView() {
    var box = document.getElementById('wc_cb'),
    button = document.getElementById('wc_sb'),
    set = IPCC_WEBCHAT_SETTINGS;
    
    if(box) {
        if(set.buttonPosition == 'right') box.style.right = '25px';
        else if(set.buttonPosition == 'left') box.style.left = '25px';
        box.style.top = '';
        box.style.display = 'none';
    }
    if(button) button.style.display = '';
}
function switch_panel() {
    if(localStorage.getItem('chat') === 'otrue') return;
    var box = document.getElementById('wc_cb');
    var button = document.getElementById('wc_sb');
    if(box) {
        if(button && (box.style.display == 'none' && button.style.display == 'none')) box.style.display = 'none';
        else if(box.style.display == 'none') box.style.display = '';
        else box.style.display = 'none';
    }
    if(button) {
        if(button.style.display == 'none') button.style.display = '';
        else button.style.display = 'none';
    }
}
function header_slideDown() {
    var r = document.getElementById('readtext');
    var elem = document.getElementById('hd');
    elem.style.marginTop = '0';
    r.style.top = '18px';
    
}
function header_slideUp() {
    var r = document.getElementById('readtext');
    var elem = document.getElementById('hd');
    elem.style.marginTop = '-18px'; 
    r.style.top = '0'; 
}
function make_visible(e) {
    e = e || window.event;
    var targ = e.target || e.srcElement;
    var d = document.getElementById('wc_cb');
    var c = document.getElementById('wc_chat');
    var b = document.getElementById('wc_sendcomplain');
    if(e.type=='mouseover') {
        c.style.opacity = '1';
        b.style.opacity = '1';
    }
    else if(e.type=='mouseout') {
        c.style.opacity = '0.2';
        b.style.opacity = '0.2';
    }
    else if(e.type=='focus') {
        if(targ.id=='writetext') c.style.opacity = '1';
        else if(targ.id=='textbody2') b.style.opacity = '1';
        removeEventFrom(d, "mouseout", make_visible);
    }
    else if(e.type=='blur') {
        if(targ.id=='writetext') c.style.opacity = '0.2';
        else if(targ.id=='textbody2') b.style.opacity = '0.2';
        addEventTo(d, "mouseout", make_visible);
    }
}
function show_rating() {
    var r = document.getElementById('orating');
    if(r.style.display == 'none') r.style.display = '';
    else r.style.display = 'none';
}
function rate_oper(rating) {
    if(rating != '') IPCC_WEBCHAT.operRating = rating;
    for(var i=2; i<=5; i++) {
        var rt = document.getElementById('r'+i);
        if(i==rating) rt.className = rt.className + 'wc_activeRate';
        else rt.className = '';
    }
    show_rating();
}