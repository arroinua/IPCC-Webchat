
//     Укажите адрес и http порт ipcc сервера в значении опции "server". Напр.: //192.168.1.100:8880 или //www.example.com:8880
var IPCC_WEBCHAT_SETTINGS = {
    server:         '//server.com:8880', //адрес и HTTP порт ipcc сервера
    path:           '/ipcc/webchat/', //путь к папке webchat. По умолчанию, должен быть "/ipcc/webchat/"
    userLang:       'ru', //язык веб-сайта поумолчанию. 'ru' -русский 'en' -английский 'uk' -украинский.
    createButton:   true, //создать кнопку чата    
    chatBox:        false, //создать встроенный чат
    regPanel:       true, //создать панель заполнения данных
    logoSrc:        '/ipcc/webchat/logo.png', //путь к файлу с логотипом
    chatBoxCol:     'rgb(185,42,36)', //цветовая схема встроенного чата
    chatBoxBackgr:  '#eee', //цвет фона встроенного чата
    chatBoxFontFam: 'Arial, Helvetica, sans-serif', //шрифт встроенного чата
    buttonPosition: 'right', //позиция кнопки чата на веб-странице (right - справа по центру, left - слева по центру)
    buttonBackgr:   'rgb(185,42,36)', //фон кнопки чата
    buttonBorder:   '1px solid #eee', //толщина,форма,цвет границ кнопки чата
    buttonFontCol:  '#fff', //цвет шрифта кнопки чата
    buttonFontFam:  '"Arial Narrow", Arial, sans-serif', //шрифт кнопки чата
    setDefaults:    function() {
                        if(window.screen.width < 800) {
                            this.chatBox = false;
                        }
                        else if(window.XDomainRequest) this.chatBox = false;
                        var lang;
                        var storageLang = window.localStorage["ulang"];
                        if(storageLang) lang = storageLang;
                        else {
                            var path = window.location.pathname.split("/");
                            for(var i=0;i<path.length;i++) {
                                var s = path[i].toLowerCase();
                                if(s.indexOf('en')!= -1 || s.indexOf('eng')!= -1 || s.indexOf('us')!= -1 || s.indexOf('usa')!= -1) {
                                    lang = 'en';
                                    break;
                                }
                                else if(s.indexOf('ua')!= -1 || s.indexOf('ukr')!= -1) {
                                    lang = 'uk';
                                    break;
                                }
                                else if(s.indexOf('ru')!= -1 || s.indexOf('rus')!= -1) {
                                    lang = 'ru';
                                    break;
                                }
                            }
                        }
                        if(lang) this.userLang = lang;
                        
                    }
};
IPCC_WEBCHAT_SETTINGS.setDefaults();