/*admin_member:成员设置*/
(function($){
	'use strict';
	$(function(){
		/*初始化数据*/
		if(public_tool.initMap.isrender){
			/*菜单调用*/
			var logininfo=public_tool.initMap.loginMap;
			public_tool.loadSideMenu(public_vars.$mainmenu,public_vars.$main_menu_wrap,{
				url:'http://120.24.226.70:8081/yttx-agentbms-api/module/menu',
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
				agentupdate_power=public_tool.getKeyPower('修改',powermap),
				agentadd_power=public_tool.getKeyPower('添加',powermap);

			/*dom引用和相关变量定义*/
			var $agent_list_wrap=$('#agent_list_wrap')/*表格*/,
				module_id='agent_add'/*模块id，主要用于本地存储传值*/,
				$data_wrap=$('#data_wrap')/*数据展现面板*/,
				$edit_wrap=$('#edit_wrap')/*发货容器面板*/,
				table=null/*数据展现*/,
				$agent_add_btn=$('#agent_add_btn')/*添加*/,
				$edit_title=$('#edit_title')/*编辑标题*/,
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
				dialogObj=public_tool.dialog()/*回调提示对象*/;

			/*查询对象*/
			var $search_fullName=$('#search_fullName'),
				$search_name=$('#search_name'),
				$search_phone=$('#search_phone'),
				$admin_search_btn=$('#admin_search_btn'),
				$admin_search_clear=$('#admin_search_clear');

			/*表单对象*/
			var edit_form=document.getElementById('edit_form')/*表单dom*/,
				$edit_form=$(edit_form)/*编辑表单*/,
				$agent_id=$('#agent_id'),/*返修id*/
				$agent_cance_btn=$('#agent_cance_btn')/*编辑取消按钮*/,
				$agent_fullname=$('#agent_fullname'),/*快递单号*/
				$agent_shortname=$('#agent_shortname'),
				$agent_userwrap=$('#agent_userwrap'),
				$agent_username=$('#agent_username'),
				$agent_password=$('#agent_password'),
				$agent_nickname=$('#agent_nickname'),
				$agent_name=$('#agent_name')/*发货经手人*/,
				$agent_phone=$('#agent_phone'),
				$agent_tel=$('#agent_tel')/*发货时间*/,
				$agent_province=$('#agent_province'),
				$agent_city=$('#agent_city'),
				$agent_area=$('#agent_area'),
				$agent_province_value=$('#agent_province_value'),
				$agent_city_value=$('#agent_city_value'),
				$agent_area_value=$('#agent_area_value'),
				$agent_address=$('#agent_address'),
				$agent_parentid=$('#agent_parentid');

			/*代理商设置*/
			var	$agent_gradewrap=$('#agent_gradewrap'),
				$agent_gradeAAA=$('#agent_gradeAAA'),
				$agent_gradeAA=$('#agent_gradeAA'),
				$agent_gradeA=$('#agent_gradeA'),
				$agent_gradeSS=$('#agent_gradeSS'),
				gradeobj={
					AAA:$agent_gradeAAA,
					AA:$agent_gradeAA,
					A:$agent_gradeA,
					SS:$agent_gradeSS,
					parentWrap:$agent_parentid
				};

			/*分润设置*/
			var $agent_runsetupwrap=$('#agent_runsetupwrap'),
				$agent_runsetupsetting=$('#agent_runsetupsetting'),
				$agent_profit=$agent_runsetupsetting.find('input'),
				$agent_self=$('#agent_self'),
				$agent_auto=$('#agent_auto'),
				profit_data={},
				maxdata;

			/*数据加载*/
			var agent_config={
				url:"http://120.24.226.70:8081/yttx-agentbms-api/agents/related",
				dataType:'JSON',
				method:'post',
				dataSrc:function ( json ) {
					var code=parseInt(json.code,10);
					if(code!==0){
						if(code===999){
							/*清空缓存*/
							public_tool.clear();
							public_tool.loginTips();
						}
						console.log(json.message);
						return [];
					}
					var list=json.result.list;

					if(!list){
						return [];
					}
					if(list.length===0){
						return list;
					}else{
						var stationobj=list[0];
						if('serivceStationlist' in stationobj){
							list=list.slice(1);
							stationobj=list[0];
							if('serivceStationlist' in stationobj){
								list=list.slice(1);
							}
						}
						return list;
					}



				},
				data:{
					roleId:decodeURIComponent(logininfo.param.roleId),
					adminId:decodeURIComponent(logininfo.param.adminId),
					grade:decodeURIComponent(logininfo.param.grade),
					token:decodeURIComponent(logininfo.param.token)
				}
			};
			table=$agent_list_wrap.DataTable({
				deferRender:true,/*是否延迟加载数据*/
				//serverSide:true,/*是否服务端处理*/
				searching:true,/*是否搜索*/
				ordering:true,/*是否排序*/
				//order:[[1,'asc']],/*默认排序*/
				paging:true,/*是否开启本地分页*/
				pagingType:'simple_numbers',/*分页按钮排列*/
				autoWidth:true,/*是否*/
				info:true,/*显示分页信息*/
				stateSave:false,/*是否保存重新加载的状态*/
				processing:true,/*大消耗操作时是否显示处理状态*/
				ajax:agent_config,/*异步请求地址及相关配置*/
				columns: [
					{"data":"fullName"},
					{"data":"shortName"},
					{"data":"name"},
					{
						"data":"phone",
						"render":function(data, type, full, meta ){
							return public_tool.phoneFormat(data);
						}
					},
					{
						"data":"address",
						"render":function(data, type, full, meta ){
							return data.toString().slice(0,40)+'...';
						}
					},
					{
						"data":"grade",
						"render":function(data, type, full, meta ){
							var str='',
								grade=parseInt(data,10);
							if(grade===1){
								str='A';
							}else if(grade===2){
								str='AA';
							}else if(grade===3){
								str='AAA';
							}
							return str;
						}
					},
					{
						"data":"id",
						"render":function(data, type, full, meta ){
							var btns='';

							if(agentupdate_power){
								/*修改*/
								btns+='<span  data-id="'+data+'" data-action="update" class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
									<i class="fa-pencil"></i>\
									<span>修改</span>\
									</span>';
							}
							return btns;
						}
					}
				],/*控制分页数*/
				aLengthMenu: [
					[5,10,20,30],
					[5,10,20,30]
				],
				lengthChange:true/*是否可改变长度*/
			});

			/*
			 * 初始化
			 * */
			(function(){
				/*重置表单*/
				edit_form.reset();
				/*地址调用*/
				new public_tool.areaSelect().areaSelect({
					$province:$agent_province,
					$city:$agent_city,
					$area:$agent_area,
					$provinceinput:$agent_province_value,
					$cityinput:$agent_city_value,
					$areainput:$agent_area_value
				});

				/*查询上级代理商ID*/
				$.ajax({
					url:"http://120.24.226.70:8081/yttx-agentbms-api/agent/role/check",
					dataType:'JSON',
					method:'post',
					data:{
						roleId:decodeURIComponent(logininfo.param.roleId),
						adminId:decodeURIComponent(logininfo.param.adminId),
						grade:decodeURIComponent(logininfo.param.grade),
						token:decodeURIComponent(logininfo.param.token)
					}
				}).done(function(resp){
					var code=parseInt(resp.code,10);
					if(code!==0){
						if(code===999){
							/*清空缓存*/
							public_tool.clear();
							public_tool.loginTips();
						}
						console.log(resp.message);
						$agent_parentid.attr({
							'data-value':'',
							'data-name':'',
							'data-grade':''
						}).html('');
						return false;
					}

					/*初始化代理商级别*/
					setGradeShow(gradeobj,resp.result);


				}).fail(function(resp){
					console.log('error');
					$agent_parentid.attr({
						'data-id':'',
						'data-grade':'',
						'data-name':''
					}).html('');
				});

			}());

			/*清空查询条件*/
			$admin_search_clear.on('click',function(){
				$.each([$search_fullName,$search_name,$search_phone],function(){
					this.val('');
				});
			});
			$admin_search_clear.trigger('click');

			/*联合查询*/
			$admin_search_btn.on('click',function(){
				var data= $.extend(true,{},agent_config.data);

				$.each([$search_fullName,$search_name,$search_phone],function(){
					var text=this.val(),
						selector=this.selector.slice(1),
						key=selector.split('_');



					if(text===""){
						if(typeof data[key[1]]!=='undefined'){
							delete data[key[1]];
						}
					}else{
						if(key[1].toLowerCase().indexOf('phone')!==-1){
							text=text.replace(/\s*/g,'');
						}
						data[key[1]]=text;
					}

				});
				agent_config.data= $.extend(true,{},data);
				table.ajax.config(agent_config).load(false);
			});

			/*事件绑定*/
			/*绑定查看，修改操作*/
			var operate_item;
			$agent_list_wrap.delegate('span','click',function(e){
				e.stopPropagation();
				e.preventDefault();

				var target= e.target,
					$this,
					id,
					action,
					$tr;

				//适配对象
				if(target.className.indexOf('btn')!==-1){
					$this=$(target);
				}else{
					$this=$(target).parent();
				}
				$tr=$this.closest('tr');
				id=$this.attr('data-id');
				action=$this.attr('data-action');

				var datas=table.row($tr).data();

				/*修改操作*/
				if(action==='update'){
					/*添加高亮状态*/
					if(operate_item){
						operate_item.removeClass('item-lighten');
						operate_item=null;
					}
					operate_item=$tr.addClass('item-lighten');
					/*调整布局*/
					$data_wrap.addClass('collapsed');
					$edit_wrap.removeClass('collapsed');
					$edit_title.html('修改 "<span class="g-c-info">'+datas['fullName']+'</span>" 代理商信息');
					$agent_cance_btn.prev().html('修改');
					$("html,body").animate({scrollTop:300},200);
					$agent_userwrap.addClass('g-d-hidei');
					//重置信息

					for(var i in datas) {
						switch (i) {
							case "id":
								$agent_id.val(id);
								break;
							case "fullName":
								$agent_fullname.val(datas[i]);
								break;
							case "phone":
								$agent_phone.val(public_tool.phoneFormat(datas[i]));
								break;
							case "shortName":
								$agent_shortname.val(datas[i]);
								break;
							case "name":
								$agent_name.val(datas[i]);
								break;
							case "address":
								$agent_address.val(datas[i]);
								break;
						}
					}
				}

			});

			/*添加服务站*/
			$agent_add_btn.on('click',function(e){
				e.preventDefault();
				/*调整布局*/
				$data_wrap.addClass('collapsed');
				$edit_wrap.removeClass('collapsed');
				$edit_title.html('添加代理商');
				$agent_cance_btn.prev().html('添加');
				$("html,body").animate({scrollTop:300},200);
				//重置信息
				edit_form.reset();
				$agent_userwrap.removeClass('g-d-hidei');
				//第一行获取焦点
				$agent_fullname.focus();
			});
			/*配置添加和修改的权限*/
			if(agentadd_power){
				$agent_add_btn.removeClass('g-d-hidei');
				$edit_wrap.removeClass('g-d-hidei');
			};

			/*取消添加或修改*/
			$agent_cance_btn.on('click',function(e){
				/*调整布局*/
				$data_wrap.removeClass('collapsed');
				$edit_wrap.addClass('collapsed');
				$edit_title.html('添加代理商');
				$agent_cance_btn.prev().html('添加');
				edit_form.reset();
				$agent_userwrap.addClass('g-d-hidei');
				if(!$data_wrap.hasClass('collapsed')){
					$("html,body").animate({scrollTop:200},200);
				}
				/*重置选中信息*/
				$agent_runsetupwrap.addClass('g-d-hidei');
				profit_data['isCustomProfit']=0;
				if(typeof profit_data['distributorProfit1']!=='undefined') {
					delete profit_data['distributorProfit1'];
					delete profit_data['distributorProfit2'];
					delete profit_data['distributorProfit3'];
				}
				/*删除高亮状态*/
				if(operate_item){
					operate_item.removeClass('item-lighten');
					operate_item=null;
				}
			});

			/*手机格式化*/
			/*格式化手机号码*/
			$.each([$search_phone,$agent_phone],function(){
				this.on('keyup',function(){
					var phoneno=this.value.replace(/\D*/g,'');
					if(phoneno==''){
						this.value='';
						return false;
					}
					this.value=public_tool.phoneFormat(this.value);
				});
			});

			/*分润切换*/
			profit_data['isCustomProfit']=0;
			$.each([$agent_self,$agent_auto],function(){
					this.on('click', function (){
						var value=this.value;

						profit_data['isCustomProfit']=value;
						if(value==='1'){
							/*自定义*/
							$agent_runsetupwrap.removeClass('g-d-hidei');
							profit_data['distributorProfit1']='';
							profit_data['distributorProfit2']='';
							profit_data['distributorProfit3']='';
						}else if(value==='0'){
							$agent_runsetupwrap.addClass('g-d-hidei');
							if(typeof profit_data['distributorProfit1']!=='undefined') {
								delete profit_data['distributorProfit1'];
								delete profit_data['distributorProfit2'];
								delete profit_data['distributorProfit3'];
							}
						}
					});
			});

			/*绑定分润输入限制*/
			$agent_profit.each(function () {
				$(this).on('keyup',function(){
					var val=this.value.replace(/[^0-9*\-*^\.]/g,'');
					if(val.indexOf('.')!==-1){
						val=val.split('.');
						if(val.length>=3){
							val.length=2;
							val=val[0]+'.'+val[1];
						}else{
							val=val.join('.');
						}
					}
					this.value=val;
				});
			});

			/*最小化窗口*/
			$edit_title.next().on('click',function(e){
				if($data_wrap.hasClass('collapsed')){
					e.stopPropagation();
					e.preventDefault();
					$agent_cance_btn.trigger('click');
				}
			});

			/*表单验证*/
			if($.isFunction($.fn.validate)) {
				/*配置信息*/
				var form_opt={},
					formcache=public_tool.cache;

				if(formcache.form_opt_0){
					$.extend(true,form_opt,formcache.form_opt_0,{
						submitHandler: function(form){
							/*更新*/
							var id=$agent_id.val(),
							isadd=id===''?true:false;

							/*校验分润合法性*/
							if(profit_data['isCustomProfit']==='1'&&!validProfit($agent_profit,dia,profit_data,maxdata)){
								return false;
							}

							if(isadd){
								var config={
									url:"http://120.24.226.70:8081/yttx-agentbms-api/agent/add",
									dataType:'JSON',
									method:'post',
									data:{
										roleId:decodeURIComponent(logininfo.param.roleId),
										adminId:decodeURIComponent(logininfo.param.adminId),
										token:decodeURIComponent(logininfo.param.token),
										fullName:$agent_fullname.val(),
										shortName:$agent_shortname.val(),
										grade:$agent_gradewrap.find('input:checked').val(),
										name:$agent_name.val(),
										province:$agent_province_value.val(),
										city:$agent_city_value.val(),
										country:$agent_area_value.val(),
										address:$agent_address.val(),
										phone:$agent_phone.val().replace(/\s*/g,''),
										tel:$agent_tel.val(),
										parentId:$agent_parentid.attr('data-grade')==='-1'?'':$agent_parentid.attr('data-id'),
										username:$agent_username.val(),
										password:$agent_password.val(),
										nickname:$agent_nickname.val()
									}
								};
							}else{
								if(id===''){
									dia.content('<span class="g-c-bs-warning g-btips-warn">请选择需要操作的代理商</span>').show();
									setTimeout(function(){
										dia.close();
									},3000);
									return false;
								}
								var config={
									url:"http://120.24.226.70:8081/yttx-agentbms-api/agent/update",
									dataType:'JSON',
									method:'post',
									data:{
										agentId:id,
										adminId:decodeURIComponent(logininfo.param.adminId),
										token:decodeURIComponent(logininfo.param.token),
										roleId:decodeURIComponent(logininfo.param.roleId),
										fullName:$agent_fullname.val(),
										shortName:$agent_shortname.val(),
										grade:$agent_gradewrap.find('input:checked').val(),
										name:$agent_name.val(),
										province:$agent_province_value.val(),
										city:$agent_city_value.val(),
										country:$agent_area_value.val(),
										address:$agent_address.val(),
										phone:$agent_phone.val().replace(/\s*/g,''),
										tel:$agent_tel.val(),
										parentId:$agent_parentid.attr('data-grade')==='-1'?'':$agent_parentid.attr('data-id')
									}
								};
							}

							$.extend(true,config.data,profit_data);


							$.ajax(config)
								.done(function(resp){
									var code=parseInt(resp.code,10);
									if(code!==0){
										console.log(resp.message);
										setTimeout(function(){
											isadd?dia.content('<span class="g-c-bs-warning g-btips-warn">添加代理商失败</span>').show():dia.content('<span class="g-c-bs-warning g-btips-warn">修改代理商失败</span>').show();
										},300);
										setTimeout(function () {
											dia.close();
										},2000);
										return false;
									}
									//重绘表格
									table.ajax.reload(null,false);
									//重置表单
									//重置表单
									$agent_cance_btn.trigger('click');
									setTimeout(function(){
										isadd?dia.content('<span class="g-c-bs-success g-btips-succ">添加代理商成功</span>').show():dia.content('<span class="g-c-bs-success g-btips-succ">修改代理商成功</span>').show();
									},300);
									setTimeout(function () {
										dia.close();
									},2000);
								})
								.fail(function(resp){
									console.log(resp.message);
								});
							return false;
						}
					});
				}


				/*提交验证*/
				$edit_form.validate(form_opt);
			}
		}


		/*校验分润设置数据合法性*/
		function validProfit(input,dia,data,maxdata){
			if(!input){
					return false;
			}

			if(!data){
				return false;
			}


			var profit_maxdata=maxdata||100,
				isvalid=false,
				ele_a=input.eq(0).val(),
				ele_aa=input.eq(1).val(),
				ele_aaa=input.eq(2).val(),
				temp_a=parseInt(ele_a * 100,10) / 100,
				temp_aa=parseInt(ele_aa * 100,10) / 100,
				temp_aaa=parseInt(ele_aaa * 100,10) / 100;

			/*设置分润规则*/
			if(isNaN(temp_a)||isNaN(temp_aa)||isNaN(temp_aaa)){
				dia.content('<span class="g-c-bs-warning g-btips-warn">分润设置数据非法值</span>').show();
				isvalid=false;
				return isvalid;
			}
			if((temp_a===0||temp_a>=profit_maxdata)||(temp_aa===0||temp_aa>=profit_maxdata)||(temp_aaa===0||temp_aaa>=profit_maxdata)){
				dia.content('<span class="g-c-bs-warning g-btips-warn">分润设置数据不能大于'+profit_maxdata+'或为0</span>').show();
				isvalid=false;
				return isvalid;
			}else if((temp_a+temp_aa+temp_aaa)>profit_maxdata){
				dia.content('<span class="g-c-bs-warning g-btips-warn">分润设置总和不能大于'+profit_maxdata+'</span>').show();
				isvalid=false;
				return isvalid;
			}else if((temp_a+temp_aa+temp_aaa)<profit_maxdata){
				dia.content('<span class="g-c-bs-warning g-btips-warn">分润设置总和应为'+profit_maxdata+'</span>').show();
				isvalid=false;
				return isvalid;
			}

			/*校验*/
			isvalid=true;

			/*设置值*/
			data['distributorProfit1']=ele_a;
			data['distributorProfit2']=ele_aa;
			data['distributorProfit3']=ele_aaa;

			return isvalid;
		}


		/*代理商级别初始化*/
		var tempgrade='';
		function setGradeShow(obj,result){
			var gradeobj=result?result:tempgrade!==''?tempgrade:'',
				grademap={
					'3':'AAA级代理商',
					'2':'AA级代理商',
					'1':'A级代理商',
					'4':'店长',
					'-1':'总代理',
					'':'自定义设置代理商'
				},
				grade=(gradeobj['grade']||'').toString();


			if(gradeobj){
				if(tempgrade===''){
					tempgrade=gradeobj;
				}
				obj.parentWrap.attr({
					'data-id':gradeobj['parentId']||'',
					'data-grade':grade,
					'data-name':gradeobj['parentName']||''
				}).html(grademap[grade]);
			}else{
				obj.parentWrap.attr({
					'data-id':'',
					'data-grade':'',
					'data-name':''
				}).html(grademap[grade]);
			}
			/*设置级别可见度*/
			if(grade==='3'){
				/*AAA*/
				obj.AAA.addClass('g-d-hidei');
				obj.AA.removeClass('g-d-hidei');
				obj.A.removeClass('g-d-hidei');
				obj.SS.removeClass('g-d-hidei');
			}else if(grade==='2'){
				/*AA*/
				obj.AAA.addClass('g-d-hidei');
				obj.AA.addClass('g-d-hidei');
				obj.A.removeClass('g-d-hidei');
				obj.SS.removeClass('g-d-hidei');
			}else if(grade==='1'){
				/*A*/
				obj.AAA.addClass('g-d-hidei');
				obj.AA.addClass('g-d-hidei');
				obj.A.addClass('g-d-hidei');
				obj.SS.removeClass('g-d-hidei');
			}else if(grade==='4'){
				/*店长*/
				obj.AAA.removeClass('g-d-hidei');
				obj.AA.removeClass('g-d-hidei');
				obj.A.removeClass('g-d-hidei');
				obj.SS.addClass('g-d-hidei');
			}else if(grade==='-1'){
				/*总代理*/
				obj.AAA.removeClass('g-d-hidei');
				obj.AA.removeClass('g-d-hidei');
				obj.A.removeClass('g-d-hidei');
				obj.SS.removeClass('g-d-hidei');
			}else if(grade===''||typeof grade==='undefined'){
				obj.AAA.removeClass('g-d-hidei');
				obj.AA.removeClass('g-d-hidei');
				obj.A.removeClass('g-d-hidei');
				obj.SS.removeClass('g-d-hidei');
			}
		};

	});



})(jQuery);