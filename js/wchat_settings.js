
//     ������� ����� � http ���� ipcc ������� � �������� ����� "server". ����.: //192.168.1.100:8880 ��� //www.example.com:8880
var IPCC_WEBCHAT_SETTINGS = {
    server:         '//server.com:8880', //����� � HTTP ���� ipcc �������
    path:           '/ipcc/webchat/', //���� � ����� webchat. �� ���������, ������ ���� "/ipcc/webchat/"
    userLang:       'ru', //���� ���-����� �����������. 'ru' -������� 'en' -���������� 'uk' -����������.
    createButton:   true, //������� ������ ����    
    chatBox:        false, //������� ���������� ���
    regPanel:       true, //������� ������ ���������� ������
    logoSrc:        '/ipcc/webchat/logo.png', //���� � ����� � ���������
    chatBoxCol:     'rgb(185,42,36)', //�������� ����� ����������� ����
    chatBoxBackgr:  '#eee', //���� ���� ����������� ����
    chatBoxFontFam: 'Arial, Helvetica, sans-serif', //����� ����������� ����
    buttonPosition: 'right', //������� ������ ���� �� ���-�������� (right - ������ �� ������, left - ����� �� ������)
    buttonBackgr:   'rgb(185,42,36)', //��� ������ ����
    buttonBorder:   '1px solid #eee', //�������,�����,���� ������ ������ ����
    buttonFontCol:  '#fff', //���� ������ ������ ����
    buttonFontFam:  '"Arial Narrow", Arial, sans-serif', //����� ������ ����
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