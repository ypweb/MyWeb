<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
    <%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE>
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>插播广告</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<link rel="stylesheet" href="css/public.css" />
	<link rel="stylesheet" href="css/schcct/css/common.css">
	<link id="cssFile" rel="stylesheet" href="css/schcct/skins/cyan.css">
	<link rel="stylesheet" href="css/pilelot-ui.css"/>
	<script type="text/javascript" src="js/js_common.js"></script>
	<script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
	<script type="text/javascript" src="js/cct-jquery-plugins.js"></script>
	<script type="text/javascript" src="js/behind/advert/advert.js"></script>
	<script type="text/javascript" src="js/jquery.easyui.min.js"></script>

  </head>
  
  <body>
  	<input id="BAI_FEN_BI" type="hidden" value="${BAI_FEN_BI}"/>
		<div class="main_r">
			<h3 class="right_nav">广告管理 > 插播广告管理</h3>

			<div class="table_bg">
				<ul class="inquire">
					<div class="clearfix">
						<li>
							<label class="v">广告名称：</label>
							<input id="advertName" name="advertName" type="text" class="input v">
						</li>
						<li>
						<label class="v">状态：</label> 
						<select style="height: 30px;line-height: 30px;" class="status_btn" id="selectStatus" >
							<option value="">请选择</option>
							<option value="0">禁用</option>
							<option value="1">启用</option>
							<option value="2">转码中</option>
							<option value="3">转码成功</option>
							<option value="4">转码失败</option>
						</select>
						</li>
						<li>
							<button class="btn_cx" type="button" onclick="query()">查询</button>
						</li>
						<li>
							<button class="btn_cx" type="button" onclick="toAdd()">新增广告</button>
						</li>
						<!-- 
						<li >
							<button class="btn_cx" type="button" onclick="toSet()">广告配置</button>
						</li> -->
					</div>

				</ul>
				<div id="div_table03" class="branchTabBox"> 
				  <table class="table1">
				       </table>
				 </div>
			</div>
		</div>
		<!--/right-->
		<!--弹出层-->
	<div id="windowDiv"  style="padding: 0px;" data-options="modal:true,closed:true,iconCls:'icon-nadd',cache:true,minimizable:false,maximizable:false,collapsible:false">
		<iframe id="windowIf" name="windowIf" style="width:100%;height:100%;display: none;"  frameborder="0"></iframe>
	</div>
  </body>
</html>
