import{r as e,aP as t,aQ as n,c1 as r,Z as o,h as i,aS as u,aR as a,b8 as c,bB as l,bz as s,d4 as f,bv as v,aU as d,aT as h,b_ as m}from"./index-d2d7b15f.js";var g=e.forwardRef((function(u,a){var c=u.height,l=u.offsetY,s=u.offsetX,f=u.children,v=u.prefixCls,d=u.onInnerResize,h=u.innerProps,m=u.rtl,g=u.extra,p={},E={display:"flex",flexDirection:"column"};return void 0!==l&&(p={height:c,position:"relative",overflow:"hidden"},E=t(t({},E),{},n(n(n(n(n({transform:"translateY(".concat(l,"px)")},m?"marginRight":"marginLeft",-s),"position","absolute"),"left",0),"right",0),"top",0))),e.createElement("div",{style:p},e.createElement(r,{onResize:function(e){e.offsetHeight&&d&&d()}},e.createElement("div",o({style:E,className:i(n({},"".concat(v,"-holder-inner"),v)),ref:a},h),f,g)))}));function p(t){var n=t.children,r=t.setRef,o=e.useCallback((function(e){r(e)}),[]);return e.cloneElement(n,{ref:o})}function E(t,n,r){var o=e.useState(t),i=u(o,2),a=i[0],c=i[1],l=e.useState(null),s=u(l,2),f=s[0],v=s[1];return e.useEffect((function(){var e=function(e,t,n){var r,o,i=e.length,u=t.length;if(0===i&&0===u)return null;i<u?(r=e,o=t):(r=t,o=e);var a={__EMPTY_ITEM__:!0};function c(e){return void 0!==e?n(e):a}for(var l=null,s=1!==Math.abs(i-u),f=0;f<o.length;f+=1){var v=c(r[f]);if(v!==c(o[f])){l=f,s=s||v!==c(o[f+1]);break}}return null===l?null:{index:l,multiple:s}}(a||[],t||[],n);void 0!==(null==e?void 0:e.index)&&(null==r||r(e.index),v(t[e.index])),c(t)}),[t]),[f]}g.displayName="Filler";var M="object"===("undefined"==typeof navigator?"undefined":a(navigator))&&/Firefox/i.test(navigator.userAgent);const w=function(t,n,r,o){var i=e.useRef(!1),u=e.useRef(null);var a=e.useRef({top:t,bottom:n,left:r,right:o});return a.current.top=t,a.current.bottom=n,a.current.left=r,a.current.right=o,function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=e?t<0&&a.current.left||t>0&&a.current.right:t<0&&a.current.top||t>0&&a.current.bottom;return n&&r?(clearTimeout(u.current),i.current=!1):r&&!i.current||(clearTimeout(u.current),i.current=!0,u.current=setTimeout((function(){i.current=!1}),50)),!i.current&&r}};function b(t,n,r,o,i,u,a){var l=e.useRef(0),s=e.useRef(null),f=e.useRef(null),v=e.useRef(!1),d=w(n,r,o,i);var h=e.useRef(null),m=e.useRef(null);return[function(e){if(t){c.cancel(m.current),m.current=c((function(){h.current=null}),2);var n=e.deltaX,r=e.deltaY,o=e.shiftKey,i=n,g=r;("sx"===h.current||!h.current&&o&&r&&!n)&&(i=r,g=0,h.current="sx");var p=Math.abs(i),E=Math.abs(g);null===h.current&&(h.current=u&&p>E?"x":"y"),"y"===h.current?function(e,t){if(c.cancel(s.current),!d(!1,t)){var n=e;n._virtualHandled||(n._virtualHandled=!0,l.current+=t,f.current=t,M||n.preventDefault(),s.current=c((function(){var e=v.current?10:1;a(l.current*e,!1),l.current=0})))}}(e,g):function(e,t){a(t,!0),M||e.preventDefault()}(e,i)}},function(e){t&&(v.current=e.detail===f.current)}]}var R=function(){function e(){s(this,e),n(this,"maps",void 0),n(this,"id",0),this.maps=Object.create(null)}return l(e,[{key:"set",value:function(e,t){this.maps[e]=t,this.id+=1}},{key:"get",value:function(e){return this.maps[e]}}]),e}();function S(e){var t=parseFloat(e);return isNaN(t)?0:t}var y=14/15;function x(e){return Math.floor(Math.pow(e,.5))}function L(e,t){return("touches"in e?e.touches[0]:e)[t?"pageX":"pageY"]-window[t?"scrollX":"scrollY"]}var H=e.forwardRef((function(r,o){var a=r.prefixCls,l=r.rtl,s=r.scrollOffset,f=r.scrollRange,v=r.onStartMove,d=r.onStopMove,h=r.onScroll,m=r.horizontal,g=r.spinSize,p=r.containerSize,E=r.style,M=r.thumbStyle,w=e.useState(!1),b=u(w,2),R=b[0],S=b[1],y=e.useState(null),x=u(y,2),H=x[0],T=x[1],z=e.useState(null),D=u(z,2),N=D[0],Y=D[1],C=!l,k=e.useRef(),_=e.useRef(),I=e.useState(!1),P=u(I,2),X=P[0],B=P[1],O=e.useRef(),j=function(){clearTimeout(O.current),B(!0),O.current=setTimeout((function(){B(!1)}),3e3)},A=f-p||0,K=p-g||0,V=e.useMemo((function(){return 0===s||0===A?0:s/A*K}),[s,A,K]),W=e.useRef({top:V,dragging:R,pageY:H,startTop:N});W.current={top:V,dragging:R,pageY:H,startTop:N};var F=function(e){S(!0),T(L(e,m)),Y(W.current.top),v(),e.stopPropagation(),e.preventDefault()};e.useEffect((function(){var e=function(e){e.preventDefault()},t=k.current,n=_.current;return t.addEventListener("touchstart",e,{passive:!1}),n.addEventListener("touchstart",F,{passive:!1}),function(){t.removeEventListener("touchstart",e),n.removeEventListener("touchstart",F)}}),[]);var Q=e.useRef();Q.current=A;var U=e.useRef();U.current=K,e.useEffect((function(){if(R){var e,t=function(t){var n=W.current,r=n.dragging,o=n.pageY,i=n.startTop;c.cancel(e);var u=k.current.getBoundingClientRect(),a=p/(m?u.width:u.height);if(r){var l=(L(t,m)-o)*a,s=i;!C&&m?s-=l:s+=l;var f=Q.current,v=U.current,d=v?s/v:0,g=Math.ceil(d*f);g=Math.max(g,0),g=Math.min(g,f),e=c((function(){h(g,m)}))}},n=function(){S(!1),d()};return window.addEventListener("mousemove",t,{passive:!0}),window.addEventListener("touchmove",t,{passive:!0}),window.addEventListener("mouseup",n,{passive:!0}),window.addEventListener("touchend",n,{passive:!0}),function(){window.removeEventListener("mousemove",t),window.removeEventListener("touchmove",t),window.removeEventListener("mouseup",n),window.removeEventListener("touchend",n),c.cancel(e)}}}),[R]),e.useEffect((function(){return j(),function(){clearTimeout(O.current)}}),[s]),e.useImperativeHandle(o,(function(){return{delayHidden:j}}));var Z="".concat(a,"-scrollbar"),q={position:"absolute",visibility:X?null:"hidden"},G={position:"absolute",background:"rgba(0, 0, 0, 0.5)",borderRadius:99,cursor:"pointer",userSelect:"none"};return m?(q.height=8,q.left=0,q.right=0,q.bottom=0,G.height="100%",G.width=g,C?G.left=V:G.right=V):(q.width=8,q.top=0,q.bottom=0,C?q.right=0:q.left=0,G.width="100%",G.height=g,G.top=V),e.createElement("div",{ref:k,className:i(Z,n(n(n({},"".concat(Z,"-horizontal"),m),"".concat(Z,"-vertical"),!m),"".concat(Z,"-visible"),X)),style:t(t({},q),E),onMouseDown:function(e){e.stopPropagation(),e.preventDefault()},onMouseMove:j},e.createElement("div",{ref:_,className:i("".concat(Z,"-thumb"),n({},"".concat(Z,"-thumb-moving"),R)),style:t(t({},G),M),onMouseDown:F}))}));function T(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=e/(arguments.length>1&&void 0!==arguments[1]?arguments[1]:0)*e;return isNaN(t)&&(t=0),t=Math.max(t,20),Math.floor(t)}var z=["prefixCls","className","height","itemHeight","fullHeight","style","data","children","itemKey","virtual","direction","scrollWidth","component","onScroll","onVirtualScroll","onVisibleChange","innerProps","extraRender","styles"],D=[],N={overflowY:"auto",overflowAnchor:"none"};function Y(l,s){var M=l.prefixCls,Y=void 0===M?"rc-virtual-list":M,C=l.className,k=l.height,_=l.itemHeight,I=l.fullHeight,P=void 0===I||I,X=l.style,B=l.data,O=l.children,j=l.itemKey,A=l.virtual,K=l.direction,V=l.scrollWidth,W=l.component,F=void 0===W?"div":W,Q=l.onScroll,U=l.onVirtualScroll,Z=l.onVisibleChange,q=l.innerProps,G=l.extraRender,J=l.styles,$=d(l,z),ee=e.useCallback((function(e){return"function"==typeof j?j(e):null==e?void 0:e[j]}),[j]),te=function(t,n,r){var o=e.useState(0),i=u(o,2),a=i[0],l=i[1],s=e.useRef(new Map),v=e.useRef(new R),d=e.useRef();function h(){c.cancel(d.current)}function m(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];h();var t=function(){s.current.forEach((function(e,t){if(e&&e.offsetParent){var n=f(e),r=n.offsetHeight,o=getComputedStyle(n),i=o.marginTop,u=o.marginBottom,a=r+S(i)+S(u);v.current.get(t)!==a&&v.current.set(t,a)}})),l((function(e){return e+1}))};e?t():d.current=c(t)}return e.useEffect((function(){return h}),[]),[function(e,o){var i=t(e),u=s.current.get(i);o?(s.current.set(i,o),m()):s.current.delete(i),!u!=!o&&(o?null==n||n(e):null==r||r(e))},m,v.current,a]}(ee,null,null),ne=u(te,4),re=ne[0],oe=ne[1],ie=ne[2],ue=ne[3],ae=!(!1===A||!k||!_),ce=e.useMemo((function(){return Object.values(ie.maps).reduce((function(e,t){return e+t}),0)}),[ie.id,ie.maps]),le=ae&&B&&(Math.max(_*B.length,ce)>k||!!V),se="rtl"===K,fe=i(Y,n({},"".concat(Y,"-rtl"),se),C),ve=B||D,de=e.useRef(),he=e.useRef(),me=e.useRef(),ge=e.useState(0),pe=u(ge,2),Ee=pe[0],Me=pe[1],we=e.useState(0),be=u(we,2),Re=be[0],Se=be[1],ye=e.useState(!1),xe=u(ye,2),Le=xe[0],He=xe[1],Te=function(){He(!0)},ze=function(){He(!1)},De={getKey:ee};function Ne(e){Me((function(t){var n=function(e){var t=e;Number.isNaN(qe.current)||(t=Math.min(t,qe.current));return t=Math.max(t,0),t}("function"==typeof e?e(t):e);return de.current.scrollTop=n,n}))}var Ye=e.useRef({start:0,end:ve.length}),Ce=e.useRef(),ke=E(ve,ee),_e=u(ke,1)[0];Ce.current=_e;var Ie=e.useMemo((function(){if(!ae)return{scrollHeight:void 0,start:0,end:ve.length-1,offset:void 0};var e;if(!le)return{scrollHeight:(null===(e=he.current)||void 0===e?void 0:e.offsetHeight)||0,start:0,end:ve.length-1,offset:void 0};for(var t,n,r,o=0,i=ve.length,u=0;u<i;u+=1){var a=ve[u],c=ee(a),l=ie.get(c),s=o+(void 0===l?_:l);s>=Ee&&void 0===t&&(t=u,n=o),s>Ee+k&&void 0===r&&(r=u),o=s}return void 0===t&&(t=0,n=0,r=Math.ceil(k/_)),void 0===r&&(r=ve.length-1),{scrollHeight:o,start:t,end:r=Math.min(r+1,ve.length-1),offset:n}}),[le,ae,Ee,ve,ue,k]),Pe=Ie.scrollHeight,Xe=Ie.start,Be=Ie.end,Oe=Ie.offset;Ye.current.start=Xe,Ye.current.end=Be;var je=e.useState({width:0,height:k}),Ae=u(je,2),Ke=Ae[0],Ve=Ae[1],We=e.useRef(),Fe=e.useRef(),Qe=e.useMemo((function(){return T(Ke.width,V)}),[Ke.width,V]),Ue=e.useMemo((function(){return T(Ke.height,Pe)}),[Ke.height,Pe]),Ze=Pe-k,qe=e.useRef(Ze);qe.current=Ze;var Ge=Ee<=0,Je=Ee>=Ze,$e=Re<=0,et=Re>=V,tt=w(Ge,Je,$e,et),nt=function(){return{x:se?-Re:Re,y:Ee}},rt=e.useRef(nt()),ot=h((function(e){if(U){var n=t(t({},nt()),e);rt.current.x===n.x&&rt.current.y===n.y||(U(n),rt.current=n)}}));function it(e,t){var n=e;t?(m.flushSync((function(){Se(n)})),ot()):Ne(n)}var ut=function(e){var t=e,n=V?V-Ke.width:0;return t=Math.max(t,0),t=Math.min(t,n)},at=h((function(e,t){t?(m.flushSync((function(){Se((function(t){return ut(t+(se?-e:e))}))})),ot()):Ne((function(t){return t+e}))})),ct=b(ae,Ge,Je,$e,et,!!V,at),lt=u(ct,2),st=lt[0],ft=lt[1];!function(t,n,r){var o,i=e.useRef(!1),u=e.useRef(0),a=e.useRef(0),c=e.useRef(null),l=e.useRef(null),s=function(e){if(i.current){var t=Math.ceil(e.touches[0].pageX),n=Math.ceil(e.touches[0].pageY),o=u.current-t,c=a.current-n,s=Math.abs(o)>Math.abs(c);s?u.current=t:a.current=n;var f=r(s,s?o:c,!1,e);f&&e.preventDefault(),clearInterval(l.current),f&&(l.current=setInterval((function(){s?o*=y:c*=y;var e=Math.floor(s?o:c);(!r(s,e,!0)||Math.abs(e)<=.1)&&clearInterval(l.current)}),16))}},f=function(){i.current=!1,o()},d=function(e){o(),1!==e.touches.length||i.current||(i.current=!0,u.current=Math.ceil(e.touches[0].pageX),a.current=Math.ceil(e.touches[0].pageY),c.current=e.target,c.current.addEventListener("touchmove",s,{passive:!1}),c.current.addEventListener("touchend",f,{passive:!0}))};o=function(){c.current&&(c.current.removeEventListener("touchmove",s),c.current.removeEventListener("touchend",f))},v((function(){return t&&n.current.addEventListener("touchstart",d,{passive:!0}),function(){var e;null===(e=n.current)||void 0===e||e.removeEventListener("touchstart",d),o(),clearInterval(l.current)}}),[t])}(ae,de,(function(e,t,n,r){var o=r;return!tt(e,t,n)&&((!o||!o._virtualHandled)&&(o&&(o._virtualHandled=!0),st({preventDefault:function(){},deltaX:e?t:0,deltaY:e?0:t}),!0))})),function(t,n,r){e.useEffect((function(){var e=n.current;if(t&&e){var o,i,u=!1,a=function(){c.cancel(o)},l=function e(){a(),o=c((function(){r(i),e()}))},s=function(e){var t=e;t._virtualHandled||(t._virtualHandled=!0,u=!0)},f=function(){u=!1,a()},v=function(t){if(u){var n=L(t,!1),r=e.getBoundingClientRect(),o=r.top,c=r.bottom;n<=o?(i=-x(o-n),l()):n>=c?(i=x(n-c),l()):a()}};return e.addEventListener("mousedown",s),e.ownerDocument.addEventListener("mouseup",f),e.ownerDocument.addEventListener("mousemove",v),function(){e.removeEventListener("mousedown",s),e.ownerDocument.removeEventListener("mouseup",f),e.ownerDocument.removeEventListener("mousemove",v),a()}}}),[t])}(le,de,(function(e){Ne((function(t){return t+e}))})),v((function(){function e(e){var t=Ge&&e.detail<0,n=Je&&e.detail>0;!ae||t||n||e.preventDefault()}var t=de.current;return t.addEventListener("wheel",st,{passive:!1}),t.addEventListener("DOMMouseScroll",ft,{passive:!0}),t.addEventListener("MozMousePixelScroll",e,{passive:!1}),function(){t.removeEventListener("wheel",st),t.removeEventListener("DOMMouseScroll",ft),t.removeEventListener("MozMousePixelScroll",e)}}),[ae,Ge,Je]),v((function(){if(V){var e=ut(Re);Se(e),ot({x:e})}}),[Ke.width,V]);var vt=function(){var e,t;null===(e=We.current)||void 0===e||e.delayHidden(),null===(t=Fe.current)||void 0===t||t.delayHidden()},dt=function(n,r,o,i,l,s,f,d){var h=e.useRef(),m=e.useState(null),g=u(m,2),p=g[0],E=g[1];return v((function(){if(p&&p.times<10){if(!n.current)return void E((function(e){return t({},e)}));s();var e=p.targetAlign,u=p.originAlign,a=p.index,c=p.offset,v=n.current.clientHeight,d=!1,h=e,m=null;if(v){for(var g=e||u,M=0,w=0,b=0,R=Math.min(r.length-1,a),S=0;S<=R;S+=1){var y=l(r[S]);w=M;var x=o.get(y);M=b=w+(void 0===x?i:x)}for(var L="top"===g?c:v-c,H=R;H>=0;H-=1){var T=l(r[H]),z=o.get(T);if(void 0===z){d=!0;break}if((L-=z)<=0)break}switch(g){case"top":m=w-c;break;case"bottom":m=b-v+c;break;default:var D=n.current.scrollTop;w<D?h="top":b>D+v&&(h="bottom")}null!==m&&f(m),m!==p.lastTop&&(d=!0)}d&&E(t(t({},p),{},{times:p.times+1,targetAlign:h,lastTop:m}))}}),[p,n.current]),function(e){if(null!=e){if(c.cancel(h.current),"number"==typeof e)f(e);else if(e&&"object"===a(e)){var t,n=e.align;t="index"in e?e.index:r.findIndex((function(t){return l(t)===e.key}));var o=e.offset;E({times:0,index:t,offset:void 0===o?0:o,originAlign:n})}}else d()}}(de,ve,ie,_,ee,(function(){return oe(!0)}),Ne,vt);e.useImperativeHandle(s,(function(){return{nativeElement:me.current,getScrollInfo:nt,scrollTo:function(e){var t;(t=e)&&"object"===a(t)&&("left"in t||"top"in t)?(void 0!==e.left&&Se(ut(e.left)),dt(e.top)):dt(e)}}})),v((function(){if(Z){var e=ve.slice(Xe,Be+1);Z(e,ve)}}),[Xe,Be,ve]);var ht=function(t,n,r,o){var i=e.useMemo((function(){return[new Map,[]]}),[t,r.id,o]),a=u(i,2),c=a[0],l=a[1];return function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e,u=c.get(e),a=c.get(i);if(void 0===u||void 0===a)for(var s=t.length,f=l.length;f<s;f+=1){var v,d=t[f],h=n(d);c.set(h,f);var m=null!==(v=r.get(h))&&void 0!==v?v:o;if(l[f]=(l[f-1]||0)+m,h===e&&(u=f),h===i&&(a=f),void 0!==u&&void 0!==a)break}return{top:l[u-1]||0,bottom:l[a]}}}(ve,ee,ie,_),mt=null==G?void 0:G({start:Xe,end:Be,virtual:le,offsetX:Re,offsetY:Oe,rtl:se,getSize:ht}),gt=function(t,n,r,o,i,u,a,c){var l=c.getKey;return t.slice(n,r+1).map((function(t,r){var c=a(t,n+r,{style:{width:o},offsetX:i}),s=l(t);return e.createElement(p,{key:s,setRef:function(e){return u(t,e)}},c)}))}(ve,Xe,Be,V,Re,re,O,De),pt=null;k&&(pt=t(n({},P?"height":"maxHeight",k),N),ae&&(pt.overflowY="hidden",V&&(pt.overflowX="hidden"),Le&&(pt.pointerEvents="none")));var Et={};return se&&(Et.dir="rtl"),e.createElement("div",o({ref:me,style:t(t({},X),{},{position:"relative"}),className:fe},Et,$),e.createElement(r,{onResize:function(e){Ve({width:e.offsetWidth,height:e.offsetHeight})}},e.createElement(F,{className:"".concat(Y,"-holder"),style:pt,ref:de,onScroll:function(e){var t=e.currentTarget.scrollTop;t!==Ee&&Ne(t),null==Q||Q(e),ot()},onMouseEnter:vt},e.createElement(g,{prefixCls:Y,height:Pe,offsetX:Re,offsetY:Oe,scrollWidth:V,onInnerResize:oe,ref:he,innerProps:q,rtl:se,extra:mt},gt))),le&&Pe>k&&e.createElement(H,{ref:We,prefixCls:Y,scrollOffset:Ee,scrollRange:Pe,rtl:se,onScroll:it,onStartMove:Te,onStopMove:ze,spinSize:Ue,containerSize:Ke.height,style:null==J?void 0:J.verticalScrollBar,thumbStyle:null==J?void 0:J.verticalScrollBarThumb}),le&&V>Ke.width&&e.createElement(H,{ref:Fe,prefixCls:Y,scrollOffset:Re,scrollRange:V,rtl:se,onScroll:it,onStartMove:Te,onStopMove:ze,spinSize:Qe,containerSize:Ke.width,horizontal:!0,style:null==J?void 0:J.horizontalScrollBar,thumbStyle:null==J?void 0:J.horizontalScrollBarThumb}))}var C=e.forwardRef(Y);C.displayName="List";export{C as L};