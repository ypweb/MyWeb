(function($){
	'use strict';
	$(function(){

		var table=null/*数据展现*/;

		/*初始化数据*/
		if(public_tool.initMap.isrender){
			/*菜单调用*/
			var logininfo=public_tool.initMap.loginMap;
			public_tool.loadSideMenu(public_vars.$mainmenu,public_vars.$main_menu_wrap,{
				url:'http://120.76.237.100:8082/mall-buzhubms-api/module/menu',
				async:false,
				type:'post',
				param:{
					roleId:decodeURIComponent(logininfo.param.roleId),
					adminId:decodeURIComponent(logininfo.param.adminId),
					grade:decodeURIComponent(logininfo.param.grade),
					token:decodeURIComponent(logininfo.param.token)
				},
				datatype:'json'
			});


			/*权限调用*/
			var powermap=public_tool.getPower(),
				forbid_power=public_tool.getKeyPower('bzw-forbid-goods',powermap),
				updown_power=public_tool.getKeyPower('bzw-goods-updown',powermap),
				detail_power=public_tool.getKeyPower('bzw-goods-details',powermap),
				audit_power=public_tool.getKeyPower('bzw-audit-goods',powermap);



			/*dom引用和相关变量定义*/
			var $admin_list_wrap=$('#admin_list_wrap')/*表格*/,
				$admin_batchlist_wrap=$('#admin_batchlist_wrap'),
				module_id='bzw-goods-audit'/*模块id，主要用于本地存储传值*/,
				dia=dialog({
					zIndex:2000,
					title:'温馨提示',
					okValue:'确定',
					width:300,
					ok:function(){
						this.close();
						return false;
					},
					cancel:false
				})/*一般提示对象*/,
				$admin_page_wrap=$('#admin_page_wrap'),
				goods_params={
					roleId:decodeURIComponent(logininfo.param.roleId),
					adminId:decodeURIComponent(logininfo.param.adminId),
					grade:decodeURIComponent(logininfo.param.grade),
					token:decodeURIComponent(logininfo.param.token)
				},
				$show_audit_wrap=$('#show_audit_wrap'),
				$show_audit_header=$('#show_audit_header'),
				admin_audit_form=document.getElementById('admin_audit_form'),
				$audit_radio_tip=$('#audit_radio_tip'),
				$audit_radio_wrap=$('#audit_radio_wrap'),
				$admin_id=$('#admin_id'),
				$audit_action=$('#audit_action'),
				sureObj=public_tool.sureDialog(dia)/*回调提示对象*/,
				setSure=new sureObj();

			/*查询对象*/
			var $search_name=$('#search_name'),
				$search_auditStatus=$('#search_auditStatus'),
				$search_providerName=$('#search_providerName'),
				$search_isForbidden=$('#search_isForbidden'),
				$search_gtione=$('#search_gtione'),
				$search_gtitwo=$('#search_gtitwo'),
				$search_gtithree=$('#search_gtithree'),
				$admin_search_btn=$('#admin_search_btn'),
				$admin_search_clear=$('#admin_search_clear'),
				goodstypeid='',
				a_state=parseInt($search_auditStatus.val(),10);


			/*批量配置参数*/
			var $admin_batchitem_btn=$('#admin_batchitem_btn'),
				$admin_batchitem_show=$('#admin_batchitem_show'),
				$admin_batchitem_check=$('#admin_batchitem_check'),
				$admin_batchitem_action=$('#admin_batchitem_action'),
				batchItem=new public_tool.BatchItem();

			/*批量初始化*/
			batchItem.init({
				$batchtoggle:$admin_batchitem_btn,
				$batchshow:$admin_batchitem_show,
				$checkall:$admin_batchitem_check,
				$action:$admin_batchitem_action,
				$listwrap:$admin_batchlist_wrap,
				setSure:setSure,
				powerobj:{
					'forbid':forbid_power,
					'up':updown_power,
					'down':updown_power,
					'audit':audit_power,
					'enable':forbid_power
				},
				fn:function (type) {
					/*批量操作*/
					batchGoods({
						action:type
					});
				}
			});


			/*列表请求配置*/
			var goods_page={
					page:1,
					pageSize:10,
					total:0
				},
				goods_config={
					$admin_list_wrap:$admin_list_wrap,
					$admin_page_wrap:$admin_page_wrap,
					config:{
						processing:true,/*大消耗操作时是否显示处理状态*/
						deferRender:true,/*是否延迟加载数据*/
						autoWidth:true,/*是否*/
						paging:false,
						ajax:{
							url:"http://120.76.237.100:8082/mall-buzhubms-api/goods/list",
							dataType:'JSON',
							method:'post',
							dataSrc:function ( json ) {
								var code=parseInt(json.code,10);
								if(code!==0){
									if(code===999){
										/*清空缓存*/
										public_tool.loginTips(function () {
											public_tool.clear();
											public_tool.clearCacheData();
										});
									}
									console.log(json.message);
									return [];
								}
								var result=json.result;
								if(typeof result==='undefined'){
									return [];
								}
								/*设置分页*/
								goods_page.page=result.page;
								goods_page.pageSize=result.pageSize;
								goods_page.total=result.count;
								/*分页调用*/
								$admin_page_wrap.pagination({
									pageSize:goods_page.pageSize,
									total:goods_page.total,
									pageNumber:goods_page.page,
									onSelectPage:function(pageNumber,pageSize){
										/*再次查询*/
										var param=goods_config.config.ajax.data;
										param.page=pageNumber;
										param.pageSize=pageSize;
										goods_config.config.ajax.data=param;
										getColumnData(goods_page,goods_config);
									}
								});
								return result?result.list||[]:[];
							},
							data:{
								roleId:decodeURIComponent(logininfo.param.roleId),
								adminId:decodeURIComponent(logininfo.param.adminId),
								grade:decodeURIComponent(logininfo.param.grade),
								token:decodeURIComponent(logininfo.param.token),
								auditStatus:a_state,
								page:1,
								pageSize:10
							}
						},
						info:false,
						searching:true,
						order:[[4, "desc" ]],
						columns: [
							{
								"data":"id",
								"orderable" :false,
								"searchable" :false,
								"render":function(data, type, full, meta ){
									return '<input data-forbid="'+full.isForbidden+'" value="'+data+'" data-status="'+full.status+'" name="goodsID" type="checkbox" />';
								}
							},
							{
								"data":"gcode"
							},
							{
								"data":"name"
							},
							{
								"data":"providerName"
							},
							{
								"data":"goodsTypeName"
							},
							{
								"data":"sort"
							},
							{
								"data":"status",
								"render":function(data, type, full, meta ){
									var stauts=parseInt(data,10),
										statusmap={
											0:"仓库",
											1:"上架",
											2:"下架",
											3:"删除",
											4:"待审核"
										},
										str='';

									if(stauts===3){
										str='<div class="g-c-red1">'+statusmap[stauts]+'</div>';
									}else if(stauts===0){
										str='<div class="g-c-warn">'+statusmap[stauts]+'</div>';
									}else if(stauts===1){
										str='<div class="g-c-gray6">'+statusmap[stauts]+'</div>';
									}else if(stauts===2){
										str='<div class="g-c-gray9">'+statusmap[stauts]+'</div>';
									}else if(stauts===4){
										str='<div class="g-c-info">'+statusmap[stauts]+'</div>';
									}
									return str;
								}
							},
							{
								"data":"isForbidden",
								"render":function(data, type, full, meta ){
									var statusmap={
											true:"禁售",
											false:"可售"
										},
										str='';

									if(data){
										str='<div class="g-c-gray9">'+statusmap[data]+'</div>';
									}else{
										str='<div class="g-c-info">'+statusmap[data]+'</div>';
									}
									return str;
								}
							},
							{
								"data":"id",
								"render":function(data, type, full, meta ){
									var id=parseInt(data,10),
										btns='',
										temp_forbid=full.isForbidden,
										temp_status=parseInt(full.status,10);

									if(a_state===0||a_state===2){
										/*待审核，审核失败*/
										if(audit_power){
											btns+='<span  data-action="audit" data-id="'+id+'" class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
												<i class="fa-hand-o-up"></i>\
												<span>审核</span>\
											</span>';
										}
									}else if(a_state===1){
										/*审核成功*/
										/*上架，下架*/
										if(temp_status===1){
											/*上架状态则下架*/
											btns+='<span data-action="down" data-id="'+id+'"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
													<i class="fa-arrow-down"></i>\
													<span>下架</span>\
												</span>';
										}else if(temp_status===2){
											/*下架状态则上架*/
											btns+='<span data-action="up" data-id="'+id+'"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
													<i class="fa-arrow-up"></i>\
													<span>上架</span>\
												</span>';
										}
										/*可售，禁售*/
										if(temp_forbid==='true'){
											/*禁售状态则可售*/
											btns+='<span data-action="enable" data-id="'+id+'"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
													<i class="fa-toggle-off"></i>\
													<span>可售</span>\
												</span>';
										}else if(temp_forbid==='false'){
											/*可售状态则禁售*/
											btns+='<span data-action="forbid" data-id="'+id+'"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
													<i class="fa-toggle-on"></i>\
													<span>禁售</span>\
												</span>';
										}
										/*推荐*/
										btns+='<span data-action="recommend" data-id="'+id+'"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
													<i class="fa-heart"></i>\
													<span>推荐</span>\
												</span>';
									}
									if(detail_power){
										btns+='<span data-action="select" data-id="'+id+'"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
													<i class="fa-file-text-o"></i>\
													<span>查看</span>\
												</span>';
									}
									return btns;
								}
							}
						]
					}
				};


			/*查询分类并绑定分类查询*/
			$.each([$search_gtione,$search_gtitwo,$search_gtithree],function(){
				var selector=this.selector;
				/*初始化查询一级分类*/
				if(selector.indexOf('one')!==-1){
					getGoodsTypes('','one',true);
				}
				this.on('change',function(){
					var $option=$(this).find(':selected'),
						value=this.value,
						hasub=false;
					if(selector.indexOf('one')!==-1){
						if(value===''){
							$search_gtitwo.html('');
							$search_gtithree.html('');
							goodstypeid='';
							return false;
						}
						hasub=$option.attr('data-hassub');
						goodstypeid=value;
						if(hasub==='true'){
							getGoodsTypes(value,'two');
						}
					}else if(selector.indexOf('two')!==-1){
						if(value===''){
							$search_gtithree.html('');
							goodstypeid=$search_gtione.find(':selected').val();
							return false;
						}
						hasub=$option.attr('data-hassub');
						goodstypeid=value;
						if(hasub==='true'){
							getGoodsTypes(value,'three');
						}
					}else if(selector.indexOf('three')!==-1){
						if(value===''){
							goodstypeid=$search_gtitwo.find(':selected').val();
							return false;
						}
						goodstypeid=value;
					}
				});
			});
			

			/*初始化请求*/
			getColumnData(goods_page,goods_config);


			/*清空查询条件*/
			$admin_search_clear.on('click',function(){
				$.each([$search_name,$search_providerName,$search_isForbidden,$search_gtione,$search_gtitwo,$search_gtithree],function(){
					var selector=this.selector;
					if(selector.indexOf('isForbidden')!==-1||selector.indexOf('_gti')!==-1){
						this.find(':selected').prop({
							"selected":false
						});
					}else{
						this.val('');
					}
				});
				/*清空分类值*/
				goodstypeid='';
			});
			$admin_search_clear.trigger('click');


			/*绑定切换不同的状态*/
			$.each([$search_auditStatus],function () {
				this.on('change',function () {
					a_state=parseInt(this.value,0);
					/*清除批量数据*/
					batchItem.clear();
				});
			});


			/*联合查询*/
			$admin_search_btn.on('click',function(){
				var data= $.extend(true,{},goods_config.config.ajax.data);

				$.each([$search_name,$search_providerName,$search_isForbidden,$search_auditStatus],function(){
					var text=this.val(),
						selector=this.selector.slice(1),
						key=selector.split('_');

					if(text===""){
						if(typeof data[key[1]]!=='undefined'){
							delete data[key[1]];
						}
					}else{
						data[key[1]]=text;
					}
				});
				/*分类处理*/
				if(goodstypeid===''){
					delete data['goodsTypeId'];
				}else{
					data['goodsTypeId']=goodstypeid;
				}
				goods_config.config.ajax.data= $.extend(true,{},data);
				getColumnData(goods_page,goods_config);
			});



			/*事件绑定*/
			/*绑定查看，修改操作*/
			var operate_item;
			$admin_list_wrap.delegate('span','click',function(e){
				e.stopPropagation();
				e.preventDefault();

				var target= e.target,
					$this,
					id,
					action,
					$tr,
					actionmap={
						"up":1,
						"down":2,
						"forbid":3,
						"enable":4,
						"recommend":8,
						"audit_yes":5,
						"audit_no":6
					},
					actiontip={
						"up":'上架',
						"down":'下架',
						"forbid":'禁售',
						"enable":'可售',
						"recommend":'推荐',
						"select":'查看',
						"audit":'审核',
						"audit_yes":'审核',
						"audit_no":'审核'
					};
				/*
				 1：上架，
				 2：下架，
				 3：禁售，
				 4：取消禁售，
				 5：审核通过，
				 6：审核不通过，
				 7：删除，
				 8：推荐到
				 * */

				//适配对象
				if(target.className.indexOf('btn')!==-1){
					$this=$(target);
				}else{
					$this=$(target).parent();
				}
				$tr=$this.closest('tr');
				id=$this.attr('data-id');
				action=$this.attr('data-action');

				/*修改,编辑操作*/
				if(action==='select'){
					/*查看*/
					/*public_tool.setParams('mall-provider-goods',id);
					window.location.href='mall-provider-goods.html';*/
				}else if(action==='audit'){
					if(operate_item){
						operate_item.removeClass('item-lighten');
						operate_item=null;
					}
					operate_item=$tr.addClass('item-lighten');
					showAudit(id,$tr);
				}else if(action==='forbid'||action==='enable'){
					if(operate_item){
						operate_item.removeClass('item-lighten');
						operate_item=null;
					}
					operate_item=$tr.addClass('item-lighten');
					/*确认是否启用或禁用*/
					setSure.sure(actiontip[action],function(cf){
						/*to do*/
						goodsAction({
							id:id,
							action:action,
							tip:cf.dia||dia,
							actiontip:actiontip,
							actionmap:actionmap
						},action==='forbid'?"禁售后，商品将不再显示在前端，是否禁售？":"可售后，商品将显示在前端，是否可售？",true);
					});
				}else if(action==='up'||action==='down'||action==='recommend'){
					if(operate_item){
						operate_item.removeClass('item-lighten');
						operate_item=null;
					}
					operate_item=$tr.addClass('item-lighten');

					/*确认是否启用或禁用*/
					/*to do*/
					goodsAction({
						id:id,
						action:action,
						actiontip:actiontip,
						actionmap:actionmap
					});
				}
			});


			/*绑定关闭详情*/
			$.each([$show_audit_wrap],function () {
				this.on('hide.bs.modal',function(){
					if(operate_item){
						setTimeout(function(){
							operate_item.removeClass('item-lighten');
							operate_item=null;
						},1000);
					}
				});
			});



			/*绑定确定收货单审核*/
			$audit_action.on('click',function () {
				executeAudit();
			});

		}


		/*获取数据*/
		function getColumnData(page,opt){
			if(table===null){
				table=opt.$admin_list_wrap.DataTable(opt.config);
			}else{
				table.ajax.config(opt.config.ajax).load();
				/*清除批量数据*/
				batchItem.clear();
			}
		}


		/*获取审核数据*/
		function showAudit(id,$tr) {
			if(typeof id==='undefined'){
				return false;
			}
			admin_audit_form.reset();
			var state='',
				statekey='',
				str='',
				data,
				statusmap={
					0:"仓库",
					1:"上架",
					2:"下架",
					3:"删除",
					4:"待审核"
				};



			/*设置值*/
			$admin_id.val(id);
			if(id.indexOf(',')!==-1){
				/*批量*/
				var len=$tr.length,
					i=0;

				if(len!==0){
					for(i;i<len;i++){
						data=table.row($tr[i].closest("tr")).data();
						if(!$.isEmptyObject(data)){
							state=parseInt(data['status'],10);
							if(state===3){
								statekey='<div class="g-c-red1">'+statusmap[state]+'</div>';
							}else if(state===0){
								statekey='<div class="g-c-warn">'+statusmap[state]+'</div>';
							}else if(state===1){
								statekey='<div class="g-c-gray6">'+statusmap[state]+'</div>';
							}else if(state===2){
								statekey='<div class="g-c-gray9">'+statusmap[state]+'</div>';
							}else if(state===4){
								statekey='<div class="g-c-info">'+statusmap[state]+'</div>';
							}else{
								statekey='<div class="g-c-red1">状态异常</div>';
							}
							str+='<tr><td>'+data["gcode"]+'</td><td>'+data["name"]+'</td><td>'+data["providerName"]+'</td><td>'+data["goodsTypeName"]+'</td><td>'+statekey+'</td></tr>';
						}
					}
					$(str).appendTo($show_audit_header.html(''));
					$show_audit_wrap.modal('show',{backdrop:'static'});
				}
			}else{
				/*单个*/
				data=table.row($tr).data();
				if(!$.isEmptyObject(data)){
					state=parseInt(data['status'],10);
					if(state===3){
						statekey='<div class="g-c-red1">'+statusmap[state]+'</div>';
					}else if(state===0){
						statekey='<div class="g-c-warn">'+statusmap[state]+'</div>';
					}else if(state===1){
						statekey='<div class="g-c-gray6">'+statusmap[state]+'</div>';
					}else if(state===2){
						statekey='<div class="g-c-gray9">'+statusmap[state]+'</div>';
					}else if(state===4){
						statekey='<div class="g-c-info">'+statusmap[state]+'</div>';
					}else{
						statekey='<div class="g-c-red1">状态异常</div>';
					}
					str='<tr><td>'+data["gcode"]+'</td><td>'+data["name"]+'</td><td>'+data["providerName"]+'</td><td>'+data["goodsTypeName"]+'</td><td>'+statekey+'</td></tr>';
					$(str).appendTo($show_audit_header.html(''));
					$show_audit_wrap.modal('show',{backdrop:'static'});
				}
			}
		}


		/*各种操作*/
		function goodsAction(obj){
			var id=obj.id;

			if(typeof id==='undefined'){
				return false;
			}
			var tip=obj.tip||dia,
				action=obj.action;

			var temp_config=$.extend(true,{},goods_params);
			temp_config['operate']=obj.actionmap[action];
			temp_config['ids']=id;
			$.ajax({
					url:"http://120.76.237.100:8082/mall-buzhubms-api/goods/operate",
					dataType:'JSON',
					method:'post',
					data:temp_config
				})
				.done(function(resp){
					var code=parseInt(resp.code,10);
					if(code!==0){
						console.log(resp.message);
						tip.content('<span class="g-c-bs-warning g-btips-warn">'+(resp.message||"操作失败")+'</span>').show();
						setTimeout(function () {
							tip.close();
							if(operate_item){
								operate_item.removeClass('item-lighten');
								operate_item=null;
							}
						},2000);
						return false;
					}
					/*是否是正确的返回数据*/
					/*添加高亮状态*/
					tip.content('<span class="g-c-bs-success g-btips-succ">'+obj.actiontip[action]+'成功</span>').show();
					setTimeout(function () {
						tip.close();
						setTimeout(function () {
							operate_item=null;
							/*请求数据*/
							getColumnData(goods_page,goods_config);
						},1000);
					},1000);
				})
				.fail(function(resp){
					console.log(resp.message);
					tip.content('<span class="g-c-bs-warning g-btips-warn">'+(resp.message||"操作失败")+'</span>').show();
					setTimeout(function () {
						tip.close();
						if(operate_item){
							operate_item.removeClass('item-lighten');
							operate_item=null;
						}
					},2000);
				});
		}



		/*级联类型查询*/
		function getGoodsTypes(value,type,flag){
			var typemap={
					'one':'一级',
					'two':'二级',
					'three':'三级'
				};
			var temp_config=$.extend(true,{},goods_params);
			temp_config['parentId']=value;
			$.ajax({
				url:"http://120.76.237.100:8082/mall-buzhubms-api/goodstype/list",
				dataType:'JSON',
				async:false,
				method:'post',
				data:temp_config
			}).done(function(resp){
				var code=parseInt(resp.code,10);
				if(code!==0){
					if(code===999){
						/*清空缓存*/
						public_tool.loginTips(function () {
							public_tool.clear();
							public_tool.clearCacheData();
						});
					}
					console.log(resp.message);
					return false;
				}



				var result=resp.result;

				if(result){
					var list=result.list;
					if(!list){
						return false;
					}
				}else{
					return false;
				}

				var len=list.length,
					i= 0,
					str='';

				if(len!==0){
					for(i;i<len;i++){
						var item=list[i];
						if(i===0){
							str+='<option value="" selected >请选择'+typemap[type]+'分类</option><option  data-hasSub="'+item["hasSub"]+'" value="'+item["id"]+'" >'+item["name"]+'</option>';
						}else{
							str+='<option data-hasSub="'+item["hasSub"]+'" value="'+item["id"]+'" >'+item["name"]+'</option>';
						}
					}
					if(type==='one'){
						$(str).appendTo($search_gtione.html(''));
						if(flag){
							$search_gtitwo.html('<option value="" selected >请选择二级分类</option>');
							$search_gtithree.html('<option value="" selected >请选择三级分类</option>');
						}
					}else if(type==='two'){
						$(str).appendTo($search_gtitwo.html(''));
					}else if(type==='three'){
						$(str).appendTo($search_gtithree.html(''));
					}
				}else{
					console.log(resp.message||'error');
					if(type==='one'){
						$search_gtione.html('<option value="" selected >请选择一级分类</option>');
						$search_gtitwo.html('<option value="" selected >请选择二级分类</option>');
						$search_gtithree.html('<option value="" selected >请选择三级分类</option>');
					}else if(type==='two'){
						$search_gtitwo.html('<option value="" selected >请选择二级分类</option>');
						$search_gtithree.html('<option value="" selected >请选择三级分类</option>');
					}else if(type==='three'){
						$search_gtithree.html('<option value="" selected >请选择三级分类</option>');
					}
				}
			}).fail(function(resp){
				console.log(resp.message||'error');
				if(type==='one'){
					$search_gtione.html('<option value="" selected >请选择一级分类</option>');
					$search_gtitwo.html('<option value="" selected >请选择二级分类</option>');
					$search_gtithree.html('<option value="" selected >请选择三级分类</option>');
				}else if(type==='two'){
					$search_gtitwo.html('<option value="" selected >请选择二级分类</option>');
					$search_gtithree.html('<option value="" selected >请选择三级分类</option>');
				}else if(type==='three'){
					$search_gtithree.html('<option value="" selected >请选择三级分类</option>');
				}
			});
		}


		/*审核*/
		function executeAudit() {
			setSure.sure('',function(cf){
				/*是否选择了状态*/
				var applystate=parseInt($audit_radio_wrap.find(':checked').val(),10);
				if(isNaN(applystate)){
					$audit_radio_tip.html('您没有选择审核状态');
					setTimeout(function () {
						$audit_radio_tip.html('');
						$audit_radio_wrap.find('input').eq(0).prop({
							'checked':true
						});
					},2000);
					return false;
				}
				/*是否有id*/
				var id=$admin_id.val();
				if(id===''){
					dia.content('<span class="g-c-bs-warning g-btips-warn">您没有选择需要操作的数据</span>').showModal();
					return false;
				}

				var tip=cf.dia,
					temp_config=$.extend(true,{},goods_params);


					temp_config['operate']=applystate;
					temp_config['ids']=id;


				$.ajax({
						url:"http://120.76.237.100:8082/mall-buzhubms-api/goods/operate",
						dataType:'JSON',
						method:'post',
						data:temp_config
					})
					.done(function(resp){
						var code=parseInt(resp.code,10);
						if(code!==0){
							console.log(resp.message);
							tip.content('<span class="g-c-bs-warning g-btips-warn">'+(resp.message||"审核失败")+'</span>').show();
							admin_audit_form.reset();
							setTimeout(function () {
								tip.close();
								if(operate_item){
									operate_item.removeClass('item-lighten');
									operate_item=null;
								}
							},2000);
							return false;
						}
						/*是否是正确的返回数据*/
						tip.content('<span class="g-c-bs-success g-btips-succ">审核成功</span>').show();
						operate_item=null;
						getColumnData(goods_page,goods_config);
						setTimeout(function () {
							$show_audit_wrap.modal('hide');
							tip.close();
							admin_audit_form.reset();
						},2000);
					})
					.fail(function(resp){
						console.log(resp.message);
						admin_audit_form.reset();
						tip.content('<span class="g-c-bs-warning g-btips-warn">'+(resp.message||"审核失败")+'</span>').show();
						setTimeout(function () {
							tip.close();
							if(operate_item){
								operate_item.removeClass('item-lighten');
								operate_item=null;
							}
						},2000);
					});

			},"是否通过该商品的审核?",true);
		}


		/*批量操作*/
		function batchGoods(config) {

			var action=config.action;

			if(action===''||typeof action==='undefined'){
				return false;
			}
			var inputitems=batchItem.getBatchNode(),
				len=inputitems.length,
				i=0;

			if(len===0){
				dia.content('<span class="g-c-bs-warning g-btips-warn">请选中操作数据</span>').show();
				setTimeout(function () {
					dia.close();
				},2000);
				return false;
			}
			var tempid=batchItem.getBatchData(),
				filter=[],
				actionmap={
					"up":1,
					"down":2,
					"forbid":3,
					"enable":4,
					"recommend":8,
					"audit_yes":5,
					"audit_no":6
				},
				actiontip={
					"up":'上架',
					"down":'下架',
					"forbid":'禁售',
					"enable":'可售',
					"recommend":'推荐',
					"select":'查看',
					"audit":'审核',
					"audit_yes":'审核',
					"audit_no":'审核'
				};

			for(i;i<len;i++){
				var tempinput=inputitems[i],
					temp_forbid=tempinput.attr('data-forbid'),
					temp_status=parseInt(tempinput.attr('data-status'));

				if(a_state===0||a_state===2){
					/*待审核，审核失败*/
					if(action!=='audit'){
						dia.content('<span class="g-c-bs-warning g-btips-warn">待审核状态不能做 "'+actiontip[action]+'" 操作</span>').show();
						setTimeout(function () {
							dia.close();
							batchItem.clear();
						},2000);
						return false;
					}
				}else if(a_state===1){
					if(action==='audit'){
						dia.content('<span class="g-c-bs-warning g-btips-warn">审核成功不能做 "'+actiontip[action]+'" 操作</span>').show();
						setTimeout(function () {
							dia.close();
							batchItem.clear();
						},2000);
						return false;
					}
					/*审核成功*/
					/*上架，下架*/
					if(temp_status===1){
						/*上架状态则下架*/
						if(action==='up'){
							filter.push(tempid[i]);
							continue;
						}
					}else if(temp_status===2){
						/*下架状态则上架*/
						if(action==='down'){
							filter.push(tempid[i]);
							continue;
						}
					}
					/*可售，禁售*/
					if(temp_forbid==='true'){
						/*禁售状态则可售*/
						if(action==='forbid'){
							filter.push(tempid[i]);
							continue;
						}
					}else if(temp_forbid==='false'){
						/*可售状态则禁售*/
						if(action==='enable'){
							filter.push(tempid[i]);
							continue;
						}
					}
				}

			}


			if(filter.length!==0){
				dia.content('<span class="g-c-bs-warning g-btips-warn">操作状态和选中状态不匹配,系统将过滤不匹配数据</span>').show();
				batchItem.filterData(filter);
				filter.length=0;
				setTimeout(function () {
					dia.close();
				},2000);
			}
			/*批量操作*/
			tempid=batchItem.getBatchData();
			if(tempid.length!==0){
				if(action==='audit'){
					inputitems=batchItem.getBatchNode();
					showAudit(tempid.join(','),inputitems);
				}else if(action==='forbid'||action==='enable'){
					/*确认是否启用或禁用*/
					setSure.sure(actiontip[action],function(cf){
						/*to do*/
						goodsAction({
							id:tempid.join(','),
							action:action,
							tip:cf.dia||dia,
							actiontip:actiontip,
							actionmap:actionmap
						},action==='forbid'?"禁售后，商品将不再显示在前端，是否禁售？":"可售后，商品将显示在前端，是否可售？",true);
					});
				}else if(action==='up'||action==='down'||action==='recommend'){
					goodsAction({
						id:tempid.join(','),
						action:action,
						actiontip:actiontip,
						actionmap:actionmap
					});
				}
			}
		}






	});


})(jQuery);