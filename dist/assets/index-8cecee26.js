var e=Object.defineProperty,t=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,a=(t,i,l)=>i in t?e(t,i,{enumerable:!0,configurable:!0,writable:!0,value:l}):t[i]=l,s=(e,s)=>{for(var r in s||(s={}))i.call(s,r)&&a(e,r,s[r]);if(t)for(var r of t(s))l.call(s,r)&&a(e,r,s[r]);return e};import{cr as r,cq as n,r as o,j as h,P as d,cs as c,R as x,C as g,c as p,H as m,B as y,O as j}from"./index-2823d128.js";import{i as u}from"./use-immer.module-213406a4.js";import{R as f,a as w,b}from"./RichTextSetting-8a64b539.js";import{U as v,g as S,a as C}from"./UploadImage-2db3ec49.js";import"./index-1ed688b1.js";import"./index-b55ce3dc.js";import"./index-4aefaa2e.js";import"./index-576a367d.js";import"./List-6e9e1bbd.js";import"./CheckOutlined-5882b4c5.js";import"./index-998aa9c2.js";import"./index-958d2050.js";import"./index-5c1414bf.js";import"./useForceUpdate-976bebe5.js";import"./DeleteOutlined-1f1b12fc.js";const O={x:300,y:100,z:1,w:180,h:36,type:"text",tag:"text_1",active:!1,text:"请输入文本",style:{fontFamily:"微软雅黑",fontSize:"24px",lineHeight:"24px",color:"#687684",backgroundColor:"#9ac8d8",fontWeight:"",fontStyle:"",textShadow:"",textAlign:"left"}},k={x:320,y:260,z:2,w:160,h:160,type:"image",tag:"image_2",active:!1,url:r},F={width:850,height:480,videoUrl:n},I=()=>{var e;const[t]=u(F),[i,l]=u([O,k]),[a,r]=o.useState((null==(e=i[0])?void 0:e.tag)||""),[n,I]=o.useState(i.length),z=o.useMemo((()=>({position:"relative",width:t.width,height:t.height})),[t]),M=o.useMemo((()=>i.find((e=>e.tag===a))),[a,i]);return h.jsx(d,{plugin:c,children:h.jsxs(x,{gutter:12,children:[h.jsx(g,{span:16,children:h.jsx(p,{title:"合成区域",bordered:!1,bodyStyle:{height:"550px"},children:h.jsx("div",{className:"flex-center",children:h.jsxs("div",{className:"dnd-container",style:s({},z),children:[h.jsx("video",{src:t.videoUrl,controls:!0,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}),i.map(((e,t)=>{return h.jsx(f,{element:e,handlers:(i=e.type,"text"===i?["e","w"]:["n","e","s","w","ne","nw","se","sw"]),onChange:e=>((e,t)=>{l((i=>{i[t]=e})),e.active&&(r(e.tag),l((t=>{t.forEach((t=>{t.tag!==e.tag&&(t.active=!1)}))})))})(e,t),children:"text"===e.type?h.jsx(w,{value:e.text,style:e.style,onChange:e=>{l((i=>{i[t].text=e}))}}):"image"===e.type?h.jsx("img",{src:e.url,draggable:"false"}):h.jsx(h.Fragment,{})},e.tag);var i}))]})})})}),h.jsx(g,{span:8,children:h.jsxs(p,{title:"设置区域",bordered:!1,bodyStyle:{height:"550px"},children:[h.jsxs(m,{colon:!1,labelCol:{span:6},wrapperCol:{span:18},labelAlign:"left",style:{width:"300px",margin:"0 auto"},children:[h.jsx(m.Item,{label:"选择视频",children:h.jsx(y,{type:"primary",style:{width:"100%"},onClick:()=>j.warning("请配置视频资源服务接口！"),children:"选择视频"})}),h.jsx(m.Item,{label:"添加文本",children:h.jsx(y,{block:!0,style:{width:"100%"},onClick:()=>{const e=n+1,t={x:300,y:100,z:i.length,w:180,h:36,type:"text",tag:`text_${e}`,active:!1,text:"请输入文本",style:{fontFamily:"微软雅黑",fontSize:"24px",lineHeight:"24px",color:"#687684",backgroundColor:"#9ac8d8",fontWeight:"",fontStyle:"",textShadow:"",textAlign:"left"}};i.length>4?j.warning("图片上最多叠加5个元素!"):(l((e=>{e.push(t)})),I(e))},children:"添加文本"})}),h.jsx(m.Item,{label:"添加图片",children:h.jsx(v,{name:"添加图片",isFull:!0,onSuccess:e=>{S(e).then((({width:a,height:s})=>{const{width:r,height:o}=C(a,s,Math.floor(t.width/4),Math.floor(t.height/4));(e=>{const t=n+1,a={x:320,y:260,z:i.length,w:e.width,h:e.height,type:"image",tag:`image_${t}`,active:!1,url:e.url};i.length>4?j.warning("图片上最多叠加5个元素!"):(l((e=>{e.push(a)})),I(t))})({url:e,width:r,height:o})}))}})}),h.jsx(m.Item,{label:"删除元素",children:h.jsx(y,{type:"primary",danger:!0,style:{width:"100%"},onClick:()=>{if(!a)return void j.warning("请先选择元素!");const e=i.findIndex((e=>e.tag===a));l((t=>{t.splice(e,1)})),r("")},children:"删除元素"})})]}),M&&"text"===M.type?h.jsx(b,{textValue:M.text,textStyles:M.style,onChangeValue:e=>(e=>{l((t=>{t.forEach((t=>{t.tag===a&&(t.text=e)}))}))})(e),onChangeStyles:e=>(e=>{l((t=>{t.forEach((t=>{t.tag===a&&(t.style=e)}))}))})(e)}):h.jsx(h.Fragment,{})]})})]})})};export{I as default};