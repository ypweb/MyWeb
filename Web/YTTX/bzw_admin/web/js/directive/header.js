/*头部栏--公共指令集*/
(function () {
    'use strict';


    /*定义指令*/
    angular
        .module('view', [])/*公共指令集名称*/
        .directive('viewHeaderMenu', viewHeaderMenu)/*头部导航栏指令*/
        .directive('viewHeaderMessage', viewHeaderMessage)/*头部信息栏指令*/
        .directive('viewHeaderDropbtn', viewHeaderDropbtn)/*头部导航栏指令*/
        .directive('viewHeaderLogout', viewHeaderLogout)/*头部退出*/;


    /*指令依赖注入*/
    viewHeaderLogout.$inject = ['$interval', 'loginService'];


    /*指令实现*/
    /*头部导航栏指令*/
    /*
     * demo:
     * <ul class="header-menu-item header-menu-show" data-view-header-menu=""></ul>
     * */
    function viewHeaderMenu() {
        return {
            replace: false,
            restrict: 'EA',
            scope: {
                header: '=header'
            },
            template: '<li ng-repeat="item in header"><a data-id="{{item.id}}" data-code="{{item.code}}" ui-sref-active="menuactive" href="" ui-sref="{{item.href}}" title="">{{item.name}}</a></li>'
        };
    }


    /*指令实现*/
    /*头部信息栏指令*/
    /*
     * demo:
     * <ul class="header-menu-item header-menu-dropdown" data-view-header-message=""></ul>
     * */
    function viewHeaderMessage() {
        return {
            replace: false,
            restrict: 'EA',
            scope: {
                message: '=message',
                action:'&action'
            },
            template: '<li ng-repeat="item in message" data-id="{{item.id}}" title="">{{item.name}}</li>',
            link: headerMessage
        };


        /*link实现*/
        function headerMessage(scope, element, attrs) {
            /*绑定事件*/
            angular.element(element).bind('click', function ($event) {
                var target = $event.target,
                    node = target.nodeName.toLowerCase(),
                    $li;
                if (node === 'li') {
                    $li = angular.element(target);
                } else {
                    return false;
                }
                scope.action($li);
            });
        }
    }



    /*头部下拉菜单按钮*/
    /*
     * demo:
     * <view-header-dropbtn></view-header-dropbtn>
     * */
    function viewHeaderDropbtn() {
        return {
            replace: true,
            restrict: 'EA',
            scope: {
                active: '=active'
            },
            template: '<div class="menu-dropbtn header-menu-dropbtn"></div>',
            link: headerDropbtn
        };
        
        /*link实现*/
        function headerDropbtn(scope, element, attrs) {
            angular.element(element).bind('click', function () {
                scope.$apply(function () {
                    scope.active=!scope.active;
                });
            });
        }
    }

    /*头部退出*/
    /*
     * demo:
     * <view-header-logout class="header-outwrap"></view-header-logout>
     * */
    function viewHeaderLogout($interval, loginService) {
        return {
            replace: true,
            restrict: 'EA',
            scope: {
                action: '&'
            },
            templateUrl: 'view/common/logout.html',
            link: headerLogout
        };


        /*link实现*/
        function headerLogout(scope, element, attrs) {
            /*初始化*/
            scope.time = 0;
            var outid = null,
                $out_btn = angular.element('#admin_logout_btn');
            /*绑定事件*/
            $out_btn.bind('click', function () {
                /*手动监听视图*/
                scope.$apply(function () {
                    scope.time = 2;
                });
                /*定时任务*/
                outid = $interval(function () {
                    scope.time--;
                    if (scope.time <= 0) {
                        $interval.cancel(outid);
                        outid = null;
                        scope.action();
                        scope.time = 0;
                    }
                }, 1000);
            });
            /*设置登录缓存*/
            loginService.outAction({
                $btn: $out_btn
            });
        }
    }
}());
   