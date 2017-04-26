angular.module('app')
    .service('structroleService',['toolUtil','toolDialog','BASE_CONFIG','loginService','powerService','dataTableColumnService','dataTableCheckAllService','dataTableItemActionService','$timeout','$sce',function(toolUtil,toolDialog,BASE_CONFIG,loginService,powerService,dataTableColumnService,dataTableCheckAllService,dataTableItemActionService,$timeout,$sce){

        /*获取缓存数据*/
        var self=this,
            module_id=10/*模块id*/,
            cache=loginService.getCache();

        var powermap=powerService.getCurrentPower(module_id);

        /*初始化权限*/
        var init_power={
            structadd:toolUtil.isPower('organization-add',powermap,true)/*添加机构*/,
            roleadd:toolUtil.isPower('role-add',powermap,true)/*添加角色*/,
            roleedit:toolUtil.isPower('role-edit',powermap,true)/*编辑角色*/,
            rolegroupadd:toolUtil.isPower('rolegroup-add',powermap,true)/*添加角色组*/
        };




        /*扩展服务--初始化jquery dom节点*/
        this.initJQDom=function (dom) {
            if(dom){
                /*复制dom引用*/
                for(var i in dom){
                    self[i]=dom[i];
                }
            }
        };
        /*扩展服务--查询操作权限*/
        this.getCurrentPower=function () {
            return init_power;
        };


        /*导航服务--查询角色组*/
        this.queryRoleGroup=function () {
            if(cache){
                var param=$.extend(true,{},cache.loginMap.param);

                toolUtil
                    .requestHttp({
                        url:'/rolegroup/list',
                        method:'post',
                        set:true,
                        data:param
                    })
                    .then(function(resp){
                            var data=resp.data,
                                status=parseInt(resp.status,10);

                            if(status===200){
                                var code=parseInt(data.code,10),
                                    message=data.message;
                                if(code!==0){
                                    if(typeof message !=='undefined'&&message!==''){
                                        console.log(message);
                                    }

                                    if(code===999){
                                        /*退出系统*/
                                        cache=null;
                                        toolUtil.loginTips({
                                            clear:true,
                                            reload:true
                                        });
                                    }
                                }else{
                                    /*加载数据*/
                                    var result=data.result;
                                    if(typeof result!=='undefined'){
                                        var list=result.list,
                                            str='';
                                        if(list){
                                            var len=list.length;
                                            if(len===0){
                                                self.$admin_struct_submenu.html('<li><a data-layer="1" data-isrequest="true" data-role="" data-rolegroup="">暂无数据</a></li>');
                                            }else{
                                                /*数据集合，最多嵌套层次*/
                                                str=self.resolveMenuList(list,BASE_CONFIG.submenulimit - 4,{
                                                    layer:0,
                                                    rolegroup:'',
                                                    type:'rolegroup'
                                                });
                                                if(str!==''){
                                                    $(str).appendTo(self.$admin_struct_submenu.html(''));
                                                }
                                            }
                                        }else{
                                            /*填充子数据到操作区域,同时显示相关操作按钮*/
                                            self.$admin_struct_submenu.html('<li><a data-layer="1" data-isrequest="true" data-role="" data-rolegroup="">暂无数据</a></li>');
                                        }
                                    }else{
                                        self.$admin_struct_submenu.html('<li><a data-layer="1" data-isrequest="true" data-role="" data-rolegroup="">暂无数据</a></li>');
                                    }
                                }
                            }
                        },
                        function(resp){
                            var message=resp.data.message;
                            if(typeof message !=='undefined'&&message!==''){
                                console.log(message);
                            }else{
                                console.log('请求菜单失败');
                            }
                            if(layer===0){
                                $wrap.html('<li><a>暂无数据</a></li>');
                            }
                            /*填充子数据到操作区域,同时显示相关操作按钮*/
                            self.initOperate({
                                data:null,
                                $wrap:self.$admin_struct_list,
                                setting:config.setting,
                                table:config.table
                            });
                        });
            }else{
                /*退出系统*/
                cache=null;
                toolUtil.loginTips({
                    clear:true,
                    reload:true
                });
            }
        };
        /*导航服务--解析导航--开始解析*/
        this.resolveMenuList=function (obj,limit,config) {
            if(!obj||typeof obj==='undefined'){
                return false;
            }
            if(typeof limit==='undefined'||limit<=0){
                limit=1;
            }
            var menulist=obj,
                str='',
                i=0,
                len=menulist.length,
                layer=config.layer;

            layer++;

            if(limit>=1 && layer>limit){
                /*如果层级达到设置的极限清除相关*/
                return false;
            }



            if(len!==0){
                for(i;i<len;i++){
                    var curitem=menulist[i];
                    /*到达极限的前一项则不创建子菜单容器*/
                    if(limit>=1 && layer>=limit){
                        str+=self.doItemMenuList(curitem,{
                                flag:false,
                                limit:limit,
                                layer:layer,
                                type:config.type,
                                rolegroup:config.rolegroup
                            })+'</li>';
                    }else{
                        str+=self.doItemMenuList(curitem,{
                                flag:true,
                                limit:limit,
                                layer:layer,
                                type:config.type,
                                rolegroup:config.rolegroup
                            })+'<ul></ul></li>';
                    }
                }
                return str;
            }else{
                return false;
            }
        };
        /*导航服务--解析导航--公共解析*/
        this.doItemMenuList=function (obj,config) {
            var curitem=obj,
                type=config.type,
                label='',
                role='',
                rolegroup='',
                str='',
                flag=config.flag,
                layer=config.layer;

            if(type==='role'){
                label=curitem["roleName"];
            }else if(type==='rolegroup'){
                label=curitem["groupName"];
                rolegroup=curitem['id'];
            }




            if(flag){
                str='<li><a data-isrequest="false" data-role="'+role+'" data-label="'+label+'" data-layer="'+layer+'" data-rolegroud="'+rolegroup+'" class="sub-menu-title" href="#" title="">'+label+'</a>';
            }else{
                str='<li><a  data-role="'+role+'" data-label="'+label+'" data-layer="'+layer+'" data-rolegroud="'+rolegroup+'" href="#" title="">'+label+'</a></li>';
            }

            return str;
        };



        /*角色服务--添加角色*/
        this.addRole=function (config) {
            if(cache){
                var type=config.type,
                    member=config.member,
                    param=$.extend(true,{},cache.loginMap.param),
                    url='';


                if(type==='role'){
                    /*添加角色*/
                    if(member.rolegroup===''){
                        toolDialog.show({
                            type:'warn',
                            value:'不存在角色组，请先添加角色组'
                        });
                        return false;
                    }
                    /*适配参数*/
                    param['groupId']=member.rolegroup;
                    delete param['organizationId'];
                }else if(type==='rolegroup'){
                    /*添加角色组*/
                    /*适配参数*/
                }



                toolUtil
                    .requestHttp({
                        url:'/rolegroup/list',
                        method:'post',
                        set:true,
                        data:param
                    })
                    .then(function(resp){
                            var data=resp.data,
                                status=parseInt(resp.status,10);

                            if(status===200){
                                var code=parseInt(data.code,10),
                                    message=data.message;
                                if(code!==0){
                                    if(typeof message !=='undefined'&&message!==''){
                                        console.log(message);
                                    }

                                    if(code===999){
                                        /*退出系统*/
                                        cache=null;
                                        toolUtil.loginTips({
                                            clear:true,
                                            reload:true
                                        });
                                    }
                                }else{
                                    /*加载数据*/
                                    var result=data.result;
                                    if(typeof result!=='undefined'){
                                        var list=result.list,
                                            str='';
                                        if(list){
                                            var len=list.length;
                                            if(len===0){
                                                self.$admin_struct_submenu.html('<li><a data-layer="1" data-isrequest="true" data-role="" data-rolegroup="">暂无数据</a></li>');
                                            }else{
                                                /*数据集合，最多嵌套层次*/
                                                str=self.resolveMenuList(list,BASE_CONFIG.submenulimit - 4,{
                                                    layer:0,
                                                    rolegroup:'',
                                                    type:'rolegroup'
                                                });
                                                if(str!==''){
                                                    $(str).appendTo(self.$admin_struct_submenu.html(''));
                                                }
                                            }
                                        }else{
                                            /*填充子数据到操作区域,同时显示相关操作按钮*/
                                            self.$admin_struct_submenu.html('<li><a data-layer="1" data-isrequest="true" data-role="" data-rolegroup="">暂无数据</a></li>');
                                        }
                                    }else{
                                        self.$admin_struct_submenu.html('<li><a data-layer="1" data-isrequest="true" data-role="" data-rolegroup="">暂无数据</a></li>');
                                    }
                                }
                            }
                        },
                        function(resp){
                            var message=resp.data.message;
                            if(typeof message !=='undefined'&&message!==''){
                                console.log(message);
                            }else{
                                console.log('请求菜单失败');
                            }
                            if(layer===0){
                                $wrap.html('<li><a>暂无数据</a></li>');
                            }
                            /*填充子数据到操作区域,同时显示相关操作按钮*/
                            self.initOperate({
                                data:null,
                                $wrap:self.$admin_struct_list,
                                setting:config.setting,
                                table:config.table
                            });
                        });
            }else{
                /*退出系统*/
                cache=null;
                toolUtil.loginTips({
                    clear:true,
                    reload:true
                });
            }

        }


    }]);