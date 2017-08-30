'use strict';

/*控制器设置基本配置*/
angular.module('app')
    .controller('AppController', ['toolUtil', '$scope', 'loginService', 'appService', function (toolUtil, $scope, loginService, appService) {
        var self = this,
            debug = true/*测试模式*/;

        /*模型--基本配置*/
        this.app_config = {
            issupport: toolUtil.isSupport()/*是否兼容*/,
            isloading: 'g-d-hidei'/*加载组件初始化*/
        };


        /*模型--系统信息*/
        this.info = toolUtil.getSystemInfo();

        /*模型--个人信息*/
        this.message = {
            isshow: true,
            active: true,
            login: [{
                    name: '张三',
                    id: '1'
                },
                {
                    name: '李四',
                    id: '2'
                },
                {
                    name: '王五',
                    id: '3'
                },
                {
                    name: '赵六',
                    id: '4'
                }]
        };

        /*模型--系统信息*/
        this.viewmode = 'default'/*视口类型*/;

        /*模型--菜单*/
        this.menu = {
            headeritem: []/*主导航显示区*/,
            headersubitem: []/*主导航隐藏*/,
            isshow: false/*是否显示子导航*/,
            active: false/*是否是激活状态*/
        };


        /*模型--用户数据*/
        this.login = {
            islogin: loginService.isLogin()/*登录标识*/,
            username: '',
            password: '',
            identifyingCode: '',
            loginerror: ''
        };

        /*获取菜单数组*/
        if (self.login.islogin) {
            (function () {
                var tempmenu = appService.calculateMenu(loginService.getMenuData(true));
                self.menu.headeritem = tempmenu.mainmenu;
                self.menu.headersubitem = tempmenu.submenu;
                self.menu.isshow = tempmenu.subshow;
            }());
        }

        /*绑定提交*/
        this.formSubmit = function () {
            /*校验成功*/
            loginService.reqAction({
                login: self.login,
                menu: self.menu,
                message: self.message,
                viewmode: self.viewmode,
                app_config: self.app_config,
                debug: debug
            });
        };
        /*获取验证码*/
        this.getValidCode = function () {
            loginService.getValidCode({
                wrap: 'validcode_wrap',
                debug: debug,
                url: "/sysuser/identifying/code"
            });
        };
        /*退出*/
        this.loginOut = function () {
            self.login = {
                islogin: false,
                username: '',
                password: '',
                identifyingCode: '',
                loginerror: ''
            };
            self.menu.headeritem = [];
            self.menu.headersubitem = [];
            self.menu.isshow = false;
            loginService.loginOut(true);
        };

        /**/
        $scope.$on('changeViewMode', function (event, value) {
            self.viewmode = value;
            var tempmenu = appService.changeViewMode(value);
            self.menu.headeritem = tempmenu.mainmenu;
            self.menu.headersubitem = tempmenu.submenu;
            self.menu.isshow = tempmenu.subshow;
        });


    }]);
