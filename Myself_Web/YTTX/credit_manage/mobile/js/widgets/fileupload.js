/**
name:credit_manage / fileupload;
 author:yipin;
 date:2016-06-07;
 version:1.0.0**/
define(["jquery"],function(a){return{fileUpload:function(b,c){this.type="",this.realdata,this.needdata,this.pattern,this.$input,this.fn=c,this.maxCount,a.extend(this,b),this.tiptime||(this.tiptime=5e3),this.dia||"function"==typeof this.dia||(this.dia=dialog()),this.init()},init:function(){this.size=1024*this.size,""==this.type||null==this.type?this.type="png|jpg|jpeg|gif":-1!=this.type.indexOf(",")&&(this.type=this.type.replace(/,/g,"|")),this.pattern=new RegExp("^image/("+this.type+")$"),this.bindEvents()},bindEvents:function(){var a=this;this.$input.on("change",function(){a.uploadHTML5(this.files)})},uploadHTML5:function(a){if("function"==typeof this.count&&this.count&&this.count()>=this.maxSize)return this.dia.content('<span class="g-c-err">最多只能上传"&nbsp;'+this.maxSize+'&nbsp;"张图片</span>').showModal(),!1;var b=a[0],c=this;if("string"==typeof b.type&&!this.pattern.test(b.type))return this.dia.content('只能上传"&nbsp;<span class="g-c-err">'+this.type.replace(/\|/g,"&nbsp;,&nbsp;")+'&nbsp;</span>"类型图片').showModal(),setTimeout(function(){c.dia.close()},c.tiptime),!1;if(b.size>this.size)return this.realdata=(b.size/1024).toString(),this.needdata=(this.size/1024).toString(),-1==this.realdata.indexOf(".")&&(this.realdata=this.realdata+".00"),this.realdata=this.realdata.split("."),-1==this.needdata.indexOf(".")&&(this.needdata=this.needdata+".00"),this.needdata=this.needdata.split("."),this.dia.content('上传的图片太大(<span class="g-c-err">'+this.realdata[0]+"."+this.realdata[1].slice(0,2)+'kb</span>),需小于(<span class="g-c-info">'+this.needdata[0]+"."+this.needdata[1].slice(0,2)+"kb</span>)").showModal(),setTimeout(function(){c.dia.close()},c.tiptime),!1;var d=new FileReader;d.readAsDataURL(b),d.onload=function(){return c.fn.call(a,d)}}}});