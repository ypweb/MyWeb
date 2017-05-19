/*首页控制器*/
angular.module('app')
    .controller('FinanceController', ['financeService','toolUtil',function(financeService,toolUtil){
        var self=this;

        /*模型--操作权限列表*/
        this.powerlist=financeService.getCurrentPower();


        /*jquery dom缓存:主要是切换路由时，创建的dom缓存引用与现有的dom引用不一致，需要加载视图更新现有dom引用*/
        var jq_dom={
            $admin_finance_submenu:$('#admin_finance_submenu'),

            $admin_table_checkcolumn1:$('#admin_table_checkcolumn1'),
            $admin_table_checkcolumn2:$('#admin_table_checkcolumn2'),
            $admin_table_checkcolumn3:$('#admin_table_checkcolumn3'),
            $admin_table_checkcolumn4:$('#admin_table_checkcolumn4'),

            $admin_page_wrap1:$('#admin_page_wrap1'),
            $admin_page_wrap2:$('#admin_page_wrap2'),
            $admin_page_wrap3:$('#admin_page_wrap3'),
            $admin_page_wrap4:$('#admin_page_wrap4'),

            $admin_list_wrap1:$('#admin_list_wrap1'),
            $admin_list_wrap2:$('#admin_list_wrap2'),
            $admin_list_wrap3:$('#admin_list_wrap3'),
            $admin_list_wrap4:$('#admin_list_wrap4'),

            $admin_list_colgroup1:$('#admin_list_colgroup1'),
            $admin_list_colgroup2:$('#admin_list_colgroup2'),
            $admin_list_colgroup3:$('#admin_list_colgroup3'),
            $admin_list_colgroup4:$('#admin_list_colgroup4'),

            $admin_batchlist_wrap1:$('#admin_batchlist_wrap1'),
            $admin_batchlist_wrap2:$('#admin_batchlist_wrap2'),
            $admin_batchlist_wrap3:$('#admin_batchlist_wrap3'),
            $admin_batchlist_wrap4:$('#admin_batchlist_wrap4')
        };
        /*切换路由时更新dom缓存*/
        financeService.initJQDom(jq_dom);


        /*模型--操作记录*/
        this.record={
            theme:'profit'/*查询的模块(分润，清算)：profit,clear*/,
            type:'stats'/*查询的业务类型(统计，历史)：stats,history*/,
            searchWord:''/*搜索字段*/,
            filter:''/*过滤字段*/,
            organizationId:'',
            organizationName:'',
            prev:null/*菜单操作:上一次操作菜单*/,
            current:null/*菜单操作:当前操作菜单*/
        };


        /*模型--表格缓存*/
        this.table={
            /*分页配置*/
            list_page1:{
                page:1,
                pageSize:20,
                total:0
            },
            list_page2:{
                page:1,
                pageSize:20,
                total:0
            },
            list_page3:{
                page:1,
                pageSize:20,
                total:0
            },
            list_page4:{
                page:1,
                pageSize:20,
                total:0
            },
            /*表格配置*/
            list_config1:{
                config:{
                    processing:true,/*大消耗操作时是否显示处理状态*/
                    deferRender:true,/*是否延迟加载数据*/
                    autoWidth:true,/*是否*/
                    paging:false,
                    ajax:{
                        url:toolUtil.adaptReqUrl('/finance/profit/stats/list'),
                        dataType:'JSON',
                        method:'post',
                        dataSrc:function ( json ) {
                            var code=parseInt(json.code,10),
                                message=json.message;

                            if(code!==0){
                                if(typeof message !=='undefined'&&message!==''){
                                    console.log(message);
                                }else{
                                    console.log('获取用户失败');
                                }
                                if(code===999){
                                    /*退出系统*/
                                    toolUtil.loginTips({
                                        clear:true,
                                        reload:true
                                    });
                                }
                                return [];
                            }
                            var result=json.result;
                            if(typeof result==='undefined'){
                                /*重置分页*/
                                self.table.list_page1.total=0;
                                self.table.list_page1.page=1;
                                jq_dom.$admin_page_wrap1.pagination({
                                    pageNumber:self.table.list_page1.page,
                                    pageSize:self.table.list_page1.pageSize,
                                    total:self.table.list_page1.total
                                });
                                return [];
                            }

                            if(result){
                                /*设置分页*/
                                self.table.list_page1.total=result.count;
                                /*分页调用*/
                                jq_dom.$admin_page_wrap1.pagination({
                                    pageNumber:self.table.list_page1.page,
                                    pageSize:self.table.list_page1.pageSize,
                                    total:self.table.list_page1.total,
                                    onSelectPage:function(pageNumber,pageSize){
                                        /*再次查询*/
                                        var temp_param=self.table.list_config1.config.ajax.data;
                                        self.table.list_page1.page=pageNumber;
                                        self.table.list_page1.pageSize=pageSize;
                                        temp_param['page']=self.table.list_page1.page;
                                        temp_param['pageSize']=self.table.list_page1.pageSize;
                                        self.table.list_config1.config.ajax.data=temp_param;
                                        financeService.getColumnData(self.table,self.record);
                                    }
                                });

                                var list=result.list;
                                if(list){
                                    var vi=0,
                                        vlen=list.length;
                                    for(vi;vi<vlen;vi++){
                                        if(!list[vi] || list[vi]===null){
                                            return [];
                                        }
                                    }
                                    return list;
                                }else{
                                    return [];
                                }
                            }else{
                                /*重置分页*/
                                self.table.list_page1.total=0;
                                self.table.list_page1.page=1;
                                jq_dom.$admin_page_wrap1.pagination({
                                    pageNumber:self.table.list_page1.page,
                                    pageSize:self.table.list_page1.pageSize,
                                    total:self.table.list_page1.total
                                });
                                return [];
                            }
                        },
                        data:{
                            page:1,
                            pageSize:20
                        }
                    },
                    info:false,
                    dom:'<"g-d-hidei" s>',
                    searching:true,
                    order:[[0, "desc" ],[1, "desc" ]],
                    columns: [
                        {
                            "data":"consigneeName"
                        },
                        {
                            "data":"logistics"
                        },
                        {
                            "data":"deliveryQuantity"
                        },
                        {
                            "data":"status"
                        },
                        {
                            "data":"addTime"
                        },
                        {
                            "data":"deviceType"
                        },
                        {
                            /*to do*/
                            "data":"id",
                            "render":function(data, type, full, meta ){
                                var btns='';

                                /*self.powerlist.deliveryadd*/
                                /*查看发货详情*/
                                if(true){
                                    btns+='<span data-action="detail" data-id="'+data+'"  class="btn-operate">查看</span>';
                                }
                                return btns;
                            }
                        }
                    ]
                }
            },
            list_config2:{
                config:{
                    processing:true,/*大消耗操作时是否显示处理状态*/
                    deferRender:true,/*是否延迟加载数据*/
                    autoWidth:true,/*是否*/
                    paging:false,
                    ajax:{
                        url:toolUtil.adaptReqUrl('/finance/profit/stats/history'),
                        dataType:'JSON',
                        method:'post',
                        dataSrc:function ( json ) {
                            var code=parseInt(json.code,10),
                                message=json.message;

                            if(code!==0){
                                if(typeof message !=='undefined'&&message!==''){
                                    console.log(message);
                                }else{
                                    console.log('获取用户失败');
                                }
                                if(code===999){
                                    /*退出系统*/
                                    toolUtil.loginTips({
                                        clear:true,
                                        reload:true
                                    });
                                }
                                return [];
                            }
                            var result=json.result;
                            if(typeof result==='undefined'){
                                /*重置分页*/
                                self.table.list_page2.total=0;
                                self.table.list_page2.page=1;
                                jq_dom.$admin_page_wrap2.pagination({
                                    pageNumber:self.table.list_page2.page,
                                    pageSize:self.table.list_page2.pageSize,
                                    total:self.table.list_page2.total
                                });
                                return [];
                            }

                            if(result){
                                /*设置分页*/
                                self.table.list_page2.total=result.count;
                                /*分页调用*/
                                jq_dom.$admin_page_wrap2.pagination({
                                    pageNumber:self.table.list_page2.page,
                                    pageSize:self.table.list_page2.pageSize,
                                    total:self.table.list_page2.total,
                                    onSelectPage:function(pageNumber,pageSize){
                                        /*再次查询*/
                                        var temp_param=self.table.list_config2.config.ajax.data;
                                        self.table.list_page2.page=pageNumber;
                                        self.table.list_page2.pageSize=pageSize;
                                        temp_param['page']=self.table.list_page2.page;
                                        temp_param['pageSize']=self.table.list_page2.pageSize;
                                        self.table.list_config2.config.ajax.data=temp_param;
                                        financeService.getColumnData(self.table,self.record);
                                    }
                                });

                                var list=result.list;
                                if(list){
                                    var vi=0,
                                        vlen=list.length;
                                    for(vi;vi<vlen;vi++){
                                        if(!list[vi] || list[vi]===null){
                                            return [];
                                        }
                                    }
                                    return list;
                                }else{
                                    return [];
                                }
                            }else{
                                /*重置分页*/
                                self.table.list_page2.total=0;
                                self.table.list_page2.page=1;
                                jq_dom.$admin_page_wrap2.pagination({
                                    pageNumber:self.table.list_page2.page,
                                    pageSize:self.table.list_page2.pageSize,
                                    total:self.table.list_page2.total
                                });
                                return [];
                            }
                        },
                        data:{
                            page:1,
                            pageSize:20
                        }
                    },
                    info:false,
                    dom:'<"g-d-hidei" s>',
                    searching:true,
                    order:[[0, "desc" ],[1, "desc" ]],
                    columns: [
                        {
                            "data":"consigneeName"
                        },
                        {
                            "data":"logistics"
                        },
                        {
                            "data":"deliveryQuantity"
                        },
                        {
                            "data":"status"
                        },
                        {
                            "data":"addTime"
                        },
                        {
                            "data":"deviceType"
                        },
                        {
                            /*to do*/
                            "data":"id",
                            "render":function(data, type, full, meta ){
                                var btns='';

                                /*self.powerlist.deliveryadd*/
                                /*查看发货详情*/
                                if(true){
                                    btns+='<span data-action="detail" data-id="'+data+'"  class="btn-operate">查看</span>';
                                }
                                return btns;
                            }
                        }
                    ]
                }
            },
            list_config3:{
                config:{
                    processing:true,/*大消耗操作时是否显示处理状态*/
                    deferRender:true,/*是否延迟加载数据*/
                    autoWidth:true,/*是否*/
                    paging:false,
                    ajax:{
                        url:toolUtil.adaptReqUrl('/finance/profit/clear/list'),
                        dataType:'JSON',
                        method:'post',
                        dataSrc:function ( json ) {
                            var code=parseInt(json.code,10),
                                message=json.message;

                            if(code!==0){
                                if(typeof message !=='undefined'&&message!==''){
                                    console.log(message);
                                }else{
                                    console.log('获取用户失败');
                                }
                                if(code===999){
                                    /*退出系统*/
                                    toolUtil.loginTips({
                                        clear:true,
                                        reload:true
                                    });
                                }
                                return [];
                            }
                            var result=json.result;
                            if(typeof result==='undefined'){
                                /*重置分页*/
                                self.table.list_page3.total=0;
                                self.table.list_page3.page=1;
                                jq_dom.$admin_page_wrap3.pagination({
                                    pageNumber:self.table.list_page3.page,
                                    pageSize:self.table.list_page3.pageSize,
                                    total:self.table.list_page3.total
                                });
                                return [];
                            }

                            if(result){
                                /*设置分页*/
                                self.table.list_page3.total=result.count;
                                /*分页调用*/
                                jq_dom.$admin_page_wrap3.pagination({
                                    pageNumber:self.table.list_page3.page,
                                    pageSize:self.table.list_page3.pageSize,
                                    total:self.table.list_page3.total,
                                    onSelectPage:function(pageNumber,pageSize){
                                        /*再次查询*/
                                        var temp_param=self.table.list_config3.config.ajax.data;
                                        self.table.list_page3.page=pageNumber;
                                        self.table.list_page3.pageSize=pageSize;
                                        temp_param['page']=self.table.list_page3.page;
                                        temp_param['pageSize']=self.table.list_page3.pageSize;
                                        self.table.list_config3.config.ajax.data=temp_param;
                                        financeService.getColumnData(self.table,self.record);
                                    }
                                });

                                var list=result.list;
                                if(list){
                                    var vi=0,
                                        vlen=list.length;
                                    for(vi;vi<vlen;vi++){
                                        if(!list[vi] || list[vi]===null){
                                            return [];
                                        }
                                    }
                                    return list;
                                }else{
                                    return [];
                                }
                            }else{
                                /*重置分页*/
                                self.table.list_page3.total=0;
                                self.table.list_page3.page=1;
                                jq_dom.$admin_page_wrap3.pagination({
                                    pageNumber:self.table.list_page3.page,
                                    pageSize:self.table.list_page3.pageSize,
                                    total:self.table.list_page3.total
                                });
                                return [];
                            }
                        },
                        data:{
                            page:1,
                            pageSize:20
                        }
                    },
                    info:false,
                    dom:'<"g-d-hidei" s>',
                    searching:true,
                    order:[[0, "desc" ],[1, "desc" ]],
                    columns: [
                        {
                            "data":"consigneeName"
                        },
                        {
                            "data":"logistics"
                        },
                        {
                            "data":"deliveryQuantity"
                        },
                        {
                            "data":"status"
                        },
                        {
                            "data":"addTime"
                        },
                        {
                            "data":"deviceType"
                        },
                        {
                            /*to do*/
                            "data":"id",
                            "render":function(data, type, full, meta ){
                                var btns='';

                                /*self.powerlist.deliveryadd*/
                                /*查看发货详情*/
                                if(true){
                                    btns+='<span data-action="detail" data-id="'+data+'"  class="btn-operate">查看</span>';
                                }
                                return btns;
                            }
                        }
                    ]
                }
            },
            list_config4:{
                config:{
                    processing:true,/*大消耗操作时是否显示处理状态*/
                    deferRender:true,/*是否延迟加载数据*/
                    autoWidth:true,/*是否*/
                    paging:false,
                    ajax:{
                        url:toolUtil.adaptReqUrl('/finance/profit/clear/history'),
                        dataType:'JSON',
                        method:'post',
                        dataSrc:function ( json ) {
                            var code=parseInt(json.code,10),
                                message=json.message;

                            if(code!==0){
                                if(typeof message !=='undefined'&&message!==''){
                                    console.log(message);
                                }else{
                                    console.log('获取用户失败');
                                }
                                if(code===999){
                                    /*退出系统*/
                                    toolUtil.loginTips({
                                        clear:true,
                                        reload:true
                                    });
                                }
                                return [];
                            }
                            var result=json.result;
                            if(typeof result==='undefined'){
                                /*重置分页*/
                                self.table.list_page4.total=0;
                                self.table.list_page4.page=1;
                                jq_dom.$admin_page_wrap4.pagination({
                                    pageNumber:self.table.list_page4.page,
                                    pageSize:self.table.list_page4.pageSize,
                                    total:self.table.list_page4.total
                                });
                                return [];
                            }

                            if(result){
                                /*设置分页*/
                                self.table.list_page4.total=result.count;
                                /*分页调用*/
                                jq_dom.$admin_page_wrap4.pagination({
                                    pageNumber:self.table.list_page4.page,
                                    pageSize:self.table.list_page4.pageSize,
                                    total:self.table.list_page4.total,
                                    onSelectPage:function(pageNumber,pageSize){
                                        /*再次查询*/
                                        var temp_param=self.table.list_config4.config.ajax.data;
                                        self.table.list_page4.page=pageNumber;
                                        self.table.list_page4.pageSize=pageSize;
                                        temp_param['page']=self.table.list_page4.page;
                                        temp_param['pageSize']=self.table.list_page4.pageSize;
                                        self.table.list_config4.config.ajax.data=temp_param;
                                        financeService.getColumnData(self.table,self.record);
                                    }
                                });

                                var list=result.list;
                                if(list){
                                    var vi=0,
                                        vlen=list.length;
                                    for(vi;vi<vlen;vi++){
                                        if(!list[vi] || list[vi]===null){
                                            return [];
                                        }
                                    }
                                    return list;
                                }else{
                                    return [];
                                }
                            }else{
                                /*重置分页*/
                                self.table.list_page4.total=0;
                                self.table.list_page4.page=1;
                                jq_dom.$admin_page_wrap4.pagination({
                                    pageNumber:self.table.list_page4.page,
                                    pageSize:self.table.list_page4.pageSize,
                                    total:self.table.list_page4.total
                                });
                                return [];
                            }
                        },
                        data:{
                            page:1,
                            pageSize:20
                        }
                    },
                    info:false,
                    dom:'<"g-d-hidei" s>',
                    searching:true,
                    order:[[0, "desc" ],[1, "desc" ]],
                    columns: [
                        {
                            "data":"consigneeName"
                        },
                        {
                            "data":"logistics"
                        },
                        {
                            "data":"deliveryQuantity"
                        },
                        {
                            "data":"status"
                        },
                        {
                            "data":"addTime"
                        },
                        {
                            "data":"deviceType"
                        },
                        {
                            /*to do*/
                            "data":"id",
                            "render":function(data, type, full, meta ){
                                var btns='';

                                /*self.powerlist.deliveryadd*/
                                /*查看发货详情*/
                                if(true){
                                    btns+='<span data-action="detail" data-id="'+data+'"  class="btn-operate">查看</span>';
                                }
                                return btns;
                            }
                        }
                    ]
                }
            },
            /*表格缓存*/
            list_table1:null,
            list_table2:null,
            list_table3:null,
            list_table4:null,
            /*列控制*/
            tablecolumn1:{
                init_len:7/*数据有多少列*/,
                column_flag:true,
                ischeck:false,/*是否有全选*/
                columnshow:true,
                $column_wrap:jq_dom.$admin_table_checkcolumn1/*控制列显示隐藏的容器*/,
                $bodywrap:jq_dom.$admin_batchlist_wrap1/*数据展现容器*/,
                hide_list:[4,5]/*需要隐藏的的列序号*/,
                hide_len:2,
                column_api:{
                    isEmpty:function () {
                        if(self.table.list_table1===null){
                            return false;
                        }
                        return self.table.list_table1.data().length===0;
                    }
                },
                $colgroup:jq_dom.$admin_list_colgroup1/*分组模型*/,
                $column_btn:jq_dom.$admin_table_checkcolumn1.prev(),
                $column_ul:jq_dom.$admin_table_checkcolumn1.find('ul')
            },
            tablecolumn2:{
                init_len:7/*数据有多少列*/,
                column_flag:true,
                ischeck:false,/*是否有全选*/
                columnshow:true,
                $column_wrap:jq_dom.$admin_table_checkcolumn2/*控制列显示隐藏的容器*/,
                $bodywrap:jq_dom.$admin_batchlist_wrap2/*数据展现容器*/,
                hide_list:[4,5]/*需要隐藏的的列序号*/,
                hide_len:2,
                column_api:{
                    isEmpty:function () {
                        if(self.table.list_table2===null){
                            return false;
                        }
                        return self.table.list_table2.data().length===0;
                    }
                },
                $colgroup:jq_dom.$admin_list_colgroup2/*分组模型*/,
                $column_btn:jq_dom.$admin_table_checkcolumn2.prev(),
                $column_ul:jq_dom.$admin_table_checkcolumn2.find('ul')
            },
            tablecolumn3:{
                init_len:7/*数据有多少列*/,
                column_flag:true,
                ischeck:false,/*是否有全选*/
                columnshow:true,
                $column_wrap:jq_dom.$admin_table_checkcolumn3/*控制列显示隐藏的容器*/,
                $bodywrap:jq_dom.$admin_batchlist_wrap3/*数据展现容器*/,
                hide_list:[4,5]/*需要隐藏的的列序号*/,
                hide_len:2,
                column_api:{
                    isEmpty:function () {
                        if(self.table.list_table3===null){
                            return false;
                        }
                        return self.table.list_table3.data().length===0;
                    }
                },
                $colgroup:jq_dom.$admin_list_colgroup3/*分组模型*/,
                $column_btn:jq_dom.$admin_table_checkcolumn3.prev(),
                $column_ul:jq_dom.$admin_table_checkcolumn3.find('ul')
            },
            tablecolumn4:{
                init_len:7/*数据有多少列*/,
                column_flag:true,
                ischeck:false,/*是否有全选*/
                columnshow:true,
                $column_wrap:jq_dom.$admin_table_checkcolumn4/*控制列显示隐藏的容器*/,
                $bodywrap:jq_dom.$admin_batchlist_wrap4/*数据展现容器*/,
                hide_list:[4,5]/*需要隐藏的的列序号*/,
                hide_len:2,
                column_api:{
                    isEmpty:function () {
                        if(self.table.list_table4===null){
                            return false;
                        }
                        return self.table.list_table4.data().length===0;
                    }
                },
                $colgroup:jq_dom.$admin_list_colgroup4/*分组模型*/,
                $column_btn:jq_dom.$admin_table_checkcolumn4.prev(),
                $column_ul:jq_dom.$admin_table_checkcolumn4.find('ul')
            },
            /*按钮*/
            tableitemaction1:{
                $bodywrap:jq_dom.$admin_batchlist_wrap1,
                itemaction_api:{
                    doItemAction:function(config){
                        financeService.doItemAction({
                            record:self.record,
                            table:self.table
                        },config);
                    }
                }
            },
            tableitemaction2:{
                $bodywrap:jq_dom.$admin_batchlist_wrap2,
                itemaction_api:{
                    doItemAction:function(config){
                        financeService.doItemAction({
                            record:self.record,
                            table:self.table
                        },config);
                    }
                }
            },
            tableitemaction3:{
                $bodywrap:jq_dom.$admin_batchlist_wrap3,
                itemaction_api:{
                    doItemAction:function(config){
                        financeService.doItemAction({
                            record:self.record,
                            table:self.table
                        },config);
                    }
                }
            },
            tableitemaction4:{
                $bodywrap:jq_dom.$admin_batchlist_wrap4,
                itemaction_api:{
                    doItemAction:function(config){
                        financeService.doItemAction({
                            record:self.record,
                            table:self.table
                        },config);
                    }
                }
            }
        };



        /*模型--tab选项卡*/
        this.tabitem=[{
            name:'分润统计',
            power:self.powerlist.profitdetails,
            type:'profit',
            active:'tabactive'
        },{
            name:'清算统计',
            power:self.powerlist.profitclear,
            type:'clear',
            active:''
        }];



        /*菜单服务--初始化*/
        this.initSubMenu=function () {
            financeService.getSubMenu({
                table:self.table,
                record:self.record
            });
        };
        /*菜单服务--显示隐藏菜单*/
        this.toggleSubMenu=function (e) {
            financeService.toggleSubMenu(e,{
                table:self.table,
                record:self.record
            });
        };
        /*菜单服务--切换菜单主题*/
        this.toggleTab=function (type) {
            self.record.theme=type;
        };


        /*成员服务--过滤数据*/
        this.filterDataTable=function (type) {
            financeService.filterDataTable(self.table,self.record,type);
        };


        /*查询列表*/
        this.queryFinance=function (type) {
            financeService.getColumnData(self.table,self.record,type);
        };
        
        
        /*查询服务--切换类型*/
        this.changeType=function () {
          console.log(self.record.type);
        };



    }]);