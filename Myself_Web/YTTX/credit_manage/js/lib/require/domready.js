/**
name:credit_manage / domready;
 author:yipin;
 date:2016-06-06;
 version:1.0.0**/
define(function(){"use strict";function a(a){var b;for(b=0;b<a.length;b+=1)a[b](j)}function b(){var b=k;i&&b.length&&(k=[],a(b))}function c(){i||(i=!0,g&&clearInterval(g),b())}function d(a){return i?a(j):k.push(a),d}var e,f,g,h="undefined"!=typeof window&&window.document,i=!h,j=h?document:null,k=[];if(h){if(document.addEventListener)document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1);else if(window.attachEvent){window.attachEvent("onload",c),f=document.createElement("div");try{e=null===window.frameElement}catch(l){}f.doScroll&&e&&window.external&&(g=setInterval(function(){try{f.doScroll(),c()}catch(a){}},30))}"complete"===document.readyState&&c()}return d.version="2.0.1",d.load=function(a,b,c,e){e.isBuild?c(null):d(c)},d});