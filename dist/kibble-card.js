var Yd=Object.create;var Oi=Object.defineProperty;var Xd=Object.getOwnPropertyDescriptor;var Zd=Object.getOwnPropertyNames;var Qd=Object.getPrototypeOf,Jd=Object.prototype.hasOwnProperty;var ep=(i,r)=>()=>(i&&(r=i(i=0)),r);var S=(i,r)=>()=>(r||i((r={exports:{}}).exports,r),r.exports),tp=(i,r)=>{for(var e in r)Oi(i,e,{get:r[e],enumerable:!0})},zo=(i,r,e,t)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of Zd(r))!Jd.call(i,s)&&s!==e&&Oi(i,s,{get:()=>r[s],enumerable:!(t=Xd(r,s))||t.enumerable});return i};var ip=(i,r,e)=>(e=i!=null?Yd(Qd(i)):{},zo(r||!i||!i.__esModule?Oi(e,"default",{value:i,enumerable:!0}):e,i)),St=i=>zo(Oi({},"__esModule",{value:!0}),i);var br=S(Ue=>{"use strict";Object.defineProperty(Ue,"__esModule",{value:!0});Ue.ERROR_PACKET=Ue.PACKET_TYPES_REVERSE=Ue.PACKET_TYPES=void 0;var ve=Object.create(null);Ue.PACKET_TYPES=ve;ve.open="0";ve.close="1";ve.ping="2";ve.pong="3";ve.message="4";ve.upgrade="5";ve.noop="6";var ul=Object.create(null);Ue.PACKET_TYPES_REVERSE=ul;Object.keys(ve).forEach(i=>{ul[ve[i]]=i});var cu={type:"error",data:"parser error"};Ue.ERROR_PACKET=cu});var vl=S(pi=>{"use strict";Object.defineProperty(pi,"__esModule",{value:!0});pi.encodePacket=void 0;pi.encodePacketToBinary=pu;var du=br(),ml=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",bl=typeof ArrayBuffer=="function",gl=i=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(i):i&&i.buffer instanceof ArrayBuffer,_l=({type:i,data:r},e,t)=>ml&&r instanceof Blob?e?t(r):hl(r,t):bl&&(r instanceof ArrayBuffer||gl(r))?e?t(r):hl(new Blob([r]),t):t(du.PACKET_TYPES[i]+(r||""));pi.encodePacket=_l;var hl=(i,r)=>{let e=new FileReader;return e.onload=function(){let t=e.result.split(",")[1];r("b"+(t||""))},e.readAsDataURL(i)};function fl(i){return i instanceof Uint8Array?i:i instanceof ArrayBuffer?new Uint8Array(i):new Uint8Array(i.buffer,i.byteOffset,i.byteLength)}var an;function pu(i,r){if(ml&&i.data instanceof Blob)return i.data.arrayBuffer().then(fl).then(r);if(bl&&(i.data instanceof ArrayBuffer||gl(i.data)))return r(fl(i.data));_l(i,!1,e=>{an||(an=new TextEncoder),r(an.encode(e))})}});var yl=S(Ht=>{"use strict";Object.defineProperty(Ht,"__esModule",{value:!0});Ht.decode=Ht.encode=void 0;var Lt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ui=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let i=0;i<Lt.length;i++)ui[Lt.charCodeAt(i)]=i;var uu=i=>{let r=new Uint8Array(i),e,t=r.length,s="";for(e=0;e<t;e+=3)s+=Lt[r[e]>>2],s+=Lt[(r[e]&3)<<4|r[e+1]>>4],s+=Lt[(r[e+1]&15)<<2|r[e+2]>>6],s+=Lt[r[e+2]&63];return t%3===2?s=s.substring(0,s.length-1)+"=":t%3===1&&(s=s.substring(0,s.length-2)+"=="),s};Ht.encode=uu;var hu=i=>{let r=i.length*.75,e=i.length,t,s=0,n,o,a,l;i[i.length-1]==="="&&(r--,i[i.length-2]==="="&&r--);let u=new ArrayBuffer(r),h=new Uint8Array(u);for(t=0;t<e;t+=4)n=ui[i.charCodeAt(t)],o=ui[i.charCodeAt(t+1)],a=ui[i.charCodeAt(t+2)],l=ui[i.charCodeAt(t+3)],h[s++]=n<<2|o>>4,h[s++]=(o&15)<<4|a>>2,h[s++]=(a&3)<<6|l&63;return u};Ht.decode=hu});var wl=S(_r=>{"use strict";Object.defineProperty(_r,"__esModule",{value:!0});_r.decodePacket=void 0;var gr=br(),fu=yl(),mu=typeof ArrayBuffer=="function",bu=(i,r)=>{if(typeof i!="string")return{type:"message",data:xl(i,r)};let e=i.charAt(0);return e==="b"?{type:"message",data:gu(i.substring(1),r)}:gr.PACKET_TYPES_REVERSE[e]?i.length>1?{type:gr.PACKET_TYPES_REVERSE[e],data:i.substring(1)}:{type:gr.PACKET_TYPES_REVERSE[e]}:gr.ERROR_PACKET};_r.decodePacket=bu;var gu=(i,r)=>{if(mu){let e=(0,fu.decode)(i);return xl(e,r)}else return{base64:!0,data:i}},xl=(i,r)=>{switch(r){case"blob":return i instanceof Blob?i:new Blob([i]);case"arraybuffer":default:return i instanceof ArrayBuffer?i:i.buffer}}});var Ot=S(Z=>{"use strict";Object.defineProperty(Z,"__esModule",{value:!0});Z.decodePayload=Z.decodePacket=Z.encodePayload=Z.encodePacket=Z.protocol=void 0;Z.createPacketEncoderStream=yu;Z.createPacketDecoderStream=xu;var cn=vl();Object.defineProperty(Z,"encodePacket",{enumerable:!0,get:function(){return cn.encodePacket}});var dn=wl();Object.defineProperty(Z,"decodePacket",{enumerable:!0,get:function(){return dn.decodePacket}});var kl=br(),Sl="",_u=(i,r)=>{let e=i.length,t=new Array(e),s=0;i.forEach((n,o)=>{(0,cn.encodePacket)(n,!1,a=>{t[o]=a,++s===e&&r(t.join(Sl))})})};Z.encodePayload=_u;var vu=(i,r)=>{let e=i.split(Sl),t=[];for(let s=0;s<e.length;s++){let n=(0,dn.decodePacket)(e[s],r);if(t.push(n),n.type==="error")break}return t};Z.decodePayload=vu;function yu(){return new TransformStream({transform(i,r){(0,cn.encodePacketToBinary)(i,e=>{let t=e.length,s;if(t<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,t);else if(t<65536){s=new Uint8Array(3);let n=new DataView(s.buffer);n.setUint8(0,126),n.setUint16(1,t)}else{s=new Uint8Array(9);let n=new DataView(s.buffer);n.setUint8(0,127),n.setBigUint64(1,BigInt(t))}i.data&&typeof i.data!="string"&&(s[0]|=128),r.enqueue(s),r.enqueue(e)})}})}var ln;function vr(i){return i.reduce((r,e)=>r+e.length,0)}function yr(i,r){if(i[0].length===r)return i.shift();let e=new Uint8Array(r),t=0;for(let s=0;s<r;s++)e[s]=i[0][t++],t===i[0].length&&(i.shift(),t=0);return i.length&&t<i[0].length&&(i[0]=i[0].slice(t)),e}function xu(i,r){ln||(ln=new TextDecoder);let e=[],t=0,s=-1,n=!1;return new TransformStream({transform(o,a){for(e.push(o);;){if(t===0){if(vr(e)<1)break;let l=yr(e,1);n=(l[0]&128)===128,s=l[0]&127,s<126?t=3:s===126?t=1:t=2}else if(t===1){if(vr(e)<2)break;let l=yr(e,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),t=3}else if(t===2){if(vr(e)<8)break;let l=yr(e,8),u=new DataView(l.buffer,l.byteOffset,l.length),h=u.getUint32(0);if(h>Math.pow(2,21)-1){a.enqueue(kl.ERROR_PACKET);break}s=h*Math.pow(2,32)+u.getUint32(4),t=3}else{if(vr(e)<s)break;let l=yr(e,s);a.enqueue((0,dn.decodePacket)(n?l:ln.decode(l),r)),t=0}if(s===0||s>i){a.enqueue(kl.ERROR_PACKET);break}}}})}Z.protocol=4});var xr=S(Cl=>{Cl.Emitter=Y;function Y(i){if(i)return wu(i)}function wu(i){for(var r in Y.prototype)i[r]=Y.prototype[r];return i}Y.prototype.on=Y.prototype.addEventListener=function(i,r){return this._callbacks=this._callbacks||{},(this._callbacks["$"+i]=this._callbacks["$"+i]||[]).push(r),this};Y.prototype.once=function(i,r){function e(){this.off(i,e),r.apply(this,arguments)}return e.fn=r,this.on(i,e),this};Y.prototype.off=Y.prototype.removeListener=Y.prototype.removeAllListeners=Y.prototype.removeEventListener=function(i,r){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var e=this._callbacks["$"+i];if(!e)return this;if(arguments.length==1)return delete this._callbacks["$"+i],this;for(var t,s=0;s<e.length;s++)if(t=e[s],t===r||t.fn===r){e.splice(s,1);break}return e.length===0&&delete this._callbacks["$"+i],this};Y.prototype.emit=function(i){this._callbacks=this._callbacks||{};for(var r=new Array(arguments.length-1),e=this._callbacks["$"+i],t=1;t<arguments.length;t++)r[t-1]=arguments[t];if(e){e=e.slice(0);for(var t=0,s=e.length;t<s;++t)e[t].apply(this,r)}return this};Y.prototype.emitReserved=Y.prototype.emit;Y.prototype.listeners=function(i){return this._callbacks=this._callbacks||{},this._callbacks["$"+i]||[]};Y.prototype.hasListeners=function(i){return!!this.listeners(i).length}});var lt=S(Me=>{"use strict";Object.defineProperty(Me,"__esModule",{value:!0});Me.defaultBinaryType=Me.globalThisShim=Me.nextTick=void 0;Me.createCookieJar=ku;Me.nextTick=typeof Promise=="function"&&typeof Promise.resolve=="function"?r=>Promise.resolve().then(r):(r,e)=>e(r,0);Me.globalThisShim=typeof self<"u"?self:typeof window<"u"?window:Function("return this")();Me.defaultBinaryType="arraybuffer";function ku(){}});var ct=S(It=>{"use strict";Object.defineProperty(It,"__esModule",{value:!0});It.pick=Su;It.installTimerFunctions=Eu;It.byteLength=Pu;It.randomString=Ru;var qe=lt();function Su(i,...r){return r.reduce((e,t)=>(i.hasOwnProperty(t)&&(e[t]=i[t]),e),{})}var Cu=qe.globalThisShim.setTimeout,$u=qe.globalThisShim.clearTimeout;function Eu(i,r){r.useNativeTimers?(i.setTimeoutFn=Cu.bind(qe.globalThisShim),i.clearTimeoutFn=$u.bind(qe.globalThisShim)):(i.setTimeoutFn=qe.globalThisShim.setTimeout.bind(qe.globalThisShim),i.clearTimeoutFn=qe.globalThisShim.clearTimeout.bind(qe.globalThisShim))}var Tu=1.33;function Pu(i){return typeof i=="string"?Au(i):Math.ceil((i.byteLength||i.size)*Tu)}function Au(i){let r=0,e=0;for(let t=0,s=i.length;t<s;t++)r=i.charCodeAt(t),r<128?e+=1:r<2048?e+=2:r<55296||r>=57344?e+=3:(t++,e+=4);return e}function Ru(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}});var pn=S(wr=>{"use strict";Object.defineProperty(wr,"__esModule",{value:!0});wr.encode=Mu;wr.decode=Lu;function Mu(i){let r="";for(let e in i)i.hasOwnProperty(e)&&(r.length&&(r+="&"),r+=encodeURIComponent(e)+"="+encodeURIComponent(i[e]));return r}function Lu(i){let r={},e=i.split("&");for(let t=0,s=e.length;t<s;t++){let n=e[t].split("=");r[decodeURIComponent(n[0])]=decodeURIComponent(n[1])}return r}});var El=S((P_,$l)=>{var Dt=1e3,Ft=Dt*60,zt=Ft*60,dt=zt*24,Hu=dt*7,Ou=dt*365.25;$l.exports=function(i,r){r=r||{};var e=typeof i;if(e==="string"&&i.length>0)return Iu(i);if(e==="number"&&isFinite(i))return r.long?Fu(i):Du(i);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(i))};function Iu(i){if(i=String(i),!(i.length>100)){var r=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(i);if(r){var e=parseFloat(r[1]),t=(r[2]||"ms").toLowerCase();switch(t){case"years":case"year":case"yrs":case"yr":case"y":return e*Ou;case"weeks":case"week":case"w":return e*Hu;case"days":case"day":case"d":return e*dt;case"hours":case"hour":case"hrs":case"hr":case"h":return e*zt;case"minutes":case"minute":case"mins":case"min":case"m":return e*Ft;case"seconds":case"second":case"secs":case"sec":case"s":return e*Dt;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return e;default:return}}}}function Du(i){var r=Math.abs(i);return r>=dt?Math.round(i/dt)+"d":r>=zt?Math.round(i/zt)+"h":r>=Ft?Math.round(i/Ft)+"m":r>=Dt?Math.round(i/Dt)+"s":i+"ms"}function Fu(i){var r=Math.abs(i);return r>=dt?kr(i,r,dt,"day"):r>=zt?kr(i,r,zt,"hour"):r>=Ft?kr(i,r,Ft,"minute"):r>=Dt?kr(i,r,Dt,"second"):i+" ms"}function kr(i,r,e,t){var s=r>=e*1.5;return Math.round(i/e)+" "+t+(s?"s":"")}});var Pl=S((A_,Tl)=>{function zu(i){e.debug=e,e.default=e,e.coerce=l,e.disable=o,e.enable=s,e.enabled=a,e.humanize=El(),e.destroy=u,Object.keys(i).forEach(h=>{e[h]=i[h]}),e.names=[],e.skips=[],e.formatters={};function r(h){let d=0;for(let f=0;f<h.length;f++)d=(d<<5)-d+h.charCodeAt(f),d|=0;return e.colors[Math.abs(d)%e.colors.length]}e.selectColor=r;function e(h){let d,f=null,m,b;function _(...g){if(!_.enabled)return;let C=_,R=Number(new Date),z=R-(d||R);C.diff=z,C.prev=d,C.curr=R,d=R,g[0]=e.coerce(g[0]),typeof g[0]!="string"&&g.unshift("%O");let M=0;g[0]=g[0].replace(/%([a-zA-Z%])/g,(K,x)=>{if(K==="%%")return"%";M++;let E=e.formatters[x];if(typeof E=="function"){let H=g[M];K=E.call(C,H),g.splice(M,1),M--}return K}),e.formatArgs.call(C,g),(C.log||e.log).apply(C,g)}return _.namespace=h,_.useColors=e.useColors(),_.color=e.selectColor(h),_.extend=t,_.destroy=e.destroy,Object.defineProperty(_,"enabled",{enumerable:!0,configurable:!1,get:()=>f!==null?f:(m!==e.namespaces&&(m=e.namespaces,b=e.enabled(h)),b),set:g=>{f=g}}),typeof e.init=="function"&&e.init(_),_}function t(h,d){let f=e(this.namespace+(typeof d>"u"?":":d)+h);return f.log=this.log,f}function s(h){e.save(h),e.namespaces=h,e.names=[],e.skips=[];let d=(typeof h=="string"?h:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let f of d)f[0]==="-"?e.skips.push(f.slice(1)):e.names.push(f)}function n(h,d){let f=0,m=0,b=-1,_=0;for(;f<h.length;)if(m<d.length&&(d[m]===h[f]||d[m]==="*"))d[m]==="*"?(b=m,_=f,m++):(f++,m++);else if(b!==-1)m=b+1,_++,f=_;else return!1;for(;m<d.length&&d[m]==="*";)m++;return m===d.length}function o(){let h=[...e.names,...e.skips.map(d=>"-"+d)].join(",");return e.enable(""),h}function a(h){for(let d of e.skips)if(n(h,d))return!1;for(let d of e.names)if(n(h,d))return!0;return!1}function l(h){return h instanceof Error?h.stack||h.message:h}function u(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return e.enable(e.load()),e}Tl.exports=zu});var pt=S((Q,Sr)=>{Q.formatArgs=Bu;Q.save=Nu;Q.load=Uu;Q.useColors=ju;Q.storage=qu();Q.destroy=(()=>{let i=!1;return()=>{i||(i=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();Q.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function ju(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let i;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(i=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(i[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function Bu(i){if(i[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+i[0]+(this.useColors?"%c ":" ")+"+"+Sr.exports.humanize(this.diff),!this.useColors)return;let r="color: "+this.color;i.splice(1,0,r,"color: inherit");let e=0,t=0;i[0].replace(/%[a-zA-Z%]/g,s=>{s!=="%%"&&(e++,s==="%c"&&(t=e))}),i.splice(t,0,r)}Q.log=console.debug||console.log||(()=>{});function Nu(i){try{i?Q.storage.setItem("debug",i):Q.storage.removeItem("debug")}catch{}}function Uu(){let i;try{i=Q.storage.getItem("debug")||Q.storage.getItem("DEBUG")}catch{}return!i&&typeof process<"u"&&"env"in process&&(i=process.env.DEBUG),i}function qu(){try{return localStorage}catch{}}Sr.exports=Pl()(Q);var{formatters:Vu}=Sr.exports;Vu.j=function(i){try{return JSON.stringify(i)}catch(r){return"[UnexpectedJSONParseError]: "+r.message}}});var hi=S(Ve=>{"use strict";var Wu=Ve&&Ve.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(Ve,"__esModule",{value:!0});Ve.Transport=Ve.TransportError=void 0;var Ku=Ot(),Gu=xr(),Yu=ct(),Xu=pn(),Zu=Wu(pt()),Qu=(0,Zu.default)("engine.io-client:transport"),Cr=class extends Error{constructor(r,e,t){super(r),this.description=e,this.context=t,this.type="TransportError"}};Ve.TransportError=Cr;var un=class extends Gu.Emitter{constructor(r){super(),this.writable=!1,(0,Yu.installTimerFunctions)(this,r),this.opts=r,this.query=r.query,this.socket=r.socket,this.supportsBinary=!r.forceBase64}onError(r,e,t){return super.emitReserved("error",new Cr(r,e,t)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(r){this.readyState==="open"?this.write(r):Qu("transport is not open, discarding packets")}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(r){let e=(0,Ku.decodePacket)(r,this.socket.binaryType);this.onPacket(e)}onPacket(r){super.emitReserved("packet",r)}onClose(r){this.readyState="closed",super.emitReserved("close",r)}pause(r){}createUri(r,e={}){return r+"://"+this._hostname()+this._port()+this.opts.path+this._query(e)}_hostname(){let r=this.opts.hostname;return r.indexOf(":")===-1?r:"["+r+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(r){let e=(0,Xu.encode)(r);return e.length?"?"+e:""}};Ve.Transport=un});var fn=S(jt=>{"use strict";var Ju=jt&&jt.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(jt,"__esModule",{value:!0});jt.Polling=void 0;var eh=hi(),th=ct(),Al=Ot(),ih=Ju(pt()),pe=(0,ih.default)("engine.io-client:polling"),hn=class extends eh.Transport{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(r){this.readyState="pausing";let e=()=>{pe("paused"),this.readyState="paused",r()};if(this._polling||!this.writable){let t=0;this._polling&&(pe("we are currently polling - waiting to pause"),t++,this.once("pollComplete",function(){pe("pre-pause polling complete"),--t||e()})),this.writable||(pe("we are currently writing - waiting to pause"),t++,this.once("drain",function(){pe("pre-pause writing complete"),--t||e()}))}else e()}_poll(){pe("polling"),this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(r){pe("polling got data %s",r);let e=t=>{if(this.readyState==="opening"&&t.type==="open"&&this.onOpen(),t.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(t)};(0,Al.decodePayload)(r,this.socket.binaryType).forEach(e),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"?this._poll():pe('ignoring poll - transport state "%s"',this.readyState))}doClose(){let r=()=>{pe("writing close packet"),this.write([{type:"close"}])};this.readyState==="open"?(pe("transport open - closing"),r()):(pe("transport not open - deferring close"),this.once("open",r))}write(r){this.writable=!1,(0,Al.encodePayload)(r,e=>{this.doWrite(e,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){let r=this.opts.secure?"https":"http",e=this.query||{};return this.opts.timestampRequests!==!1&&(e[this.opts.timestampParam]=(0,th.randomString)()),!this.supportsBinary&&!e.sid&&(e.b64=1),this.createUri(r,e)}};jt.Polling=hn});var Ml=S($r=>{"use strict";Object.defineProperty($r,"__esModule",{value:!0});$r.hasCORS=void 0;var Rl=!1;try{Rl=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}$r.hasCORS=Rl});var Tr=S(ye=>{"use strict";var rh=ye&&ye.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(ye,"__esModule",{value:!0});ye.XHR=ye.Request=ye.BaseXHR=void 0;var sh=fn(),nh=xr(),Ll=ct(),Ol=lt(),oh=Ml(),ah=rh(pt()),mn=(0,ah.default)("engine.io-client:polling");function lh(){}var Er=class extends sh.Polling{constructor(r){if(super(r),typeof location<"u"){let e=location.protocol==="https:",t=location.port;t||(t=e?"443":"80"),this.xd=typeof location<"u"&&r.hostname!==location.hostname||t!==r.port}}doWrite(r,e){let t=this.request({method:"POST",data:r});t.on("success",e),t.on("error",(s,n)=>{this.onError("xhr post error",s,n)})}doPoll(){mn("xhr poll");let r=this.request();r.on("data",this.onData.bind(this)),r.on("error",(e,t)=>{this.onError("xhr poll error",e,t)}),this.pollXhr=r}};ye.BaseXHR=Er;var Le=class i extends nh.Emitter{constructor(r,e,t){super(),this.createRequest=r,(0,Ll.installTimerFunctions)(this,t),this._opts=t,this._method=t.method||"GET",this._uri=e,this._data=t.data!==void 0?t.data:null,this._create()}_create(){var r;let e=(0,Ll.pick)(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");e.xdomain=!!this._opts.xd;let t=this._xhr=this.createRequest(e);try{mn("xhr open %s: %s",this._method,this._uri),t.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){t.setDisableHeaderCheck&&t.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&t.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{t.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{t.setRequestHeader("Accept","*/*")}catch{}(r=this._opts.cookieJar)===null||r===void 0||r.addCookies(t),"withCredentials"in t&&(t.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(t.timeout=this._opts.requestTimeout),t.onreadystatechange=()=>{var s;t.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(t.getResponseHeader("set-cookie"))),t.readyState===4&&(t.status===200||t.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof t.status=="number"?t.status:0)},0))},mn("xhr data %s",this._data),t.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=i.requestsCount++,i.requests[this._index]=this)}_onError(r){this.emitReserved("error",r,this._xhr),this._cleanup(!0)}_cleanup(r){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=lh,r)try{this._xhr.abort()}catch{}typeof document<"u"&&delete i.requests[this._index],this._xhr=null}}_onLoad(){let r=this._xhr.responseText;r!==null&&(this.emitReserved("data",r),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};ye.Request=Le;Le.requestsCount=0;Le.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Hl);else if(typeof addEventListener=="function"){let i="onpagehide"in Ol.globalThisShim?"pagehide":"unload";addEventListener(i,Hl,!1)}}function Hl(){for(let i in Le.requests)Le.requests.hasOwnProperty(i)&&Le.requests[i].abort()}var ch=function(){let i=Il({xdomain:!1});return i&&i.responseType!==null}(),bn=class extends Er{constructor(r){super(r);let e=r&&r.forceBase64;this.supportsBinary=ch&&!e}request(r={}){return Object.assign(r,{xd:this.xd},this.opts),new Le(Il,this.uri(),r)}};ye.XHR=bn;function Il(i){let r=i.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!r||oh.hasCORS))return new XMLHttpRequest}catch{}if(!r)try{return new Ol.globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}});var Ar=S(We=>{"use strict";var dh=We&&We.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(We,"__esModule",{value:!0});We.WS=We.BaseWS=void 0;var ph=hi(),Dl=ct(),uh=Ot(),_n=lt(),hh=dh(pt()),fh=(0,hh.default)("engine.io-client:websocket"),Fl=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative",Pr=class extends ph.Transport{get name(){return"websocket"}doOpen(){let r=this.uri(),e=this.opts.protocols,t=Fl?{}:(0,Dl.pick)(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(t.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(r,e,t)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=r=>this.onClose({description:"websocket connection closed",context:r}),this.ws.onmessage=r=>this.onData(r.data),this.ws.onerror=r=>this.onError("websocket error",r)}write(r){this.writable=!1;for(let e=0;e<r.length;e++){let t=r[e],s=e===r.length-1;(0,uh.encodePacket)(t,this.supportsBinary,n=>{try{this.doWrite(t,n)}catch{fh("websocket closed before onclose event")}s&&(0,_n.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){let r=this.opts.secure?"wss":"ws",e=this.query||{};return this.opts.timestampRequests&&(e[this.opts.timestampParam]=(0,Dl.randomString)()),this.supportsBinary||(e.b64=1),this.createUri(r,e)}};We.BaseWS=Pr;var gn=_n.globalThisShim.WebSocket||_n.globalThisShim.MozWebSocket,vn=class extends Pr{createSocket(r,e,t){return Fl?new gn(r,e,t):e?new gn(r,e):new gn(r)}doWrite(r,e){this.ws.send(e)}};We.WS=vn});var xn=S(Bt=>{"use strict";var mh=Bt&&Bt.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(Bt,"__esModule",{value:!0});Bt.WT=void 0;var bh=hi(),gh=lt(),zl=Ot(),_h=mh(pt()),fi=(0,_h.default)("engine.io-client:webtransport"),yn=class extends bh.Transport{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(r){return this.emitReserved("error",r)}this._transport.closed.then(()=>{fi("transport closed gracefully"),this.onClose()}).catch(r=>{fi("transport closed due to %s",r),this.onError("webtransport error",r)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(r=>{let e=(0,zl.createPacketDecoderStream)(Number.MAX_SAFE_INTEGER,this.socket.binaryType),t=r.readable.pipeThrough(e).getReader(),s=(0,zl.createPacketEncoderStream)();s.readable.pipeTo(r.writable),this._writer=s.writable.getWriter();let n=()=>{t.read().then(({done:a,value:l})=>{if(a){fi("session is closed");return}fi("received chunk: %o",l),this.onPacket(l),n()}).catch(a=>{fi("an error occurred while reading: %s",a)})};n();let o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(r){this.writable=!1;for(let e=0;e<r.length;e++){let t=r[e],s=e===r.length-1;this._writer.write(t).then(()=>{s&&(0,gh.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var r;(r=this._transport)===null||r===void 0||r.close()}};Bt.WT=yn});var wn=S(Rr=>{"use strict";Object.defineProperty(Rr,"__esModule",{value:!0});Rr.transports=void 0;var vh=Tr(),yh=Ar(),xh=xn();Rr.transports={websocket:yh.WS,webtransport:xh.WT,polling:vh.XHR}});var Sn=S(kn=>{"use strict";Object.defineProperty(kn,"__esModule",{value:!0});kn.parse=Sh;var wh=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,kh=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Sh(i){if(i.length>8e3)throw"URI too long";let r=i,e=i.indexOf("["),t=i.indexOf("]");e!=-1&&t!=-1&&(i=i.substring(0,e)+i.substring(e,t).replace(/:/g,";")+i.substring(t,i.length));let s=wh.exec(i||""),n={},o=14;for(;o--;)n[kh[o]]=s[o]||"";return e!=-1&&t!=-1&&(n.source=r,n.host=n.host.substring(1,n.host.length-1).replace(/;/g,":"),n.authority=n.authority.replace("[","").replace("]","").replace(/;/g,":"),n.ipv6uri=!0),n.pathNames=Ch(n,n.path),n.queryKey=$h(n,n.query),n}function Ch(i,r){let e=/\/{2,9}/g,t=r.replace(e,"/").split("/");return(r.slice(0,1)=="/"||r.length===0)&&t.splice(0,1),r.slice(-1)=="/"&&t.splice(t.length-1,1),t}function $h(i,r){let e={};return r.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(t,s,n){s&&(e[s]=n)}),e}});var Tn=S(xe=>{"use strict";var Eh=xe&&xe.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(xe,"__esModule",{value:!0});xe.Socket=xe.SocketWithUpgrade=xe.SocketWithoutUpgrade=void 0;var Th=wn(),jl=ct(),Ph=pn(),Bl=Sn(),Ah=xr(),Nl=Ot(),Cn=lt(),Rh=Eh(pt()),L=(0,Rh.default)("engine.io-client:socket"),$n=typeof addEventListener=="function"&&typeof removeEventListener=="function",mi=[];$n&&addEventListener("offline",()=>{L("closing %d connection(s) because the network was lost",mi.length),mi.forEach(i=>i())},!1);var ut=class i extends Ah.Emitter{constructor(r,e){if(super(),this.binaryType=Cn.defaultBinaryType,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,r&&typeof r=="object"&&(e=r,r=null),r){let t=(0,Bl.parse)(r);e.hostname=t.host,e.secure=t.protocol==="https"||t.protocol==="wss",e.port=t.port,t.query&&(e.query=t.query)}else e.host&&(e.hostname=(0,Bl.parse)(e.host).host);(0,jl.installTimerFunctions)(this,e),this.secure=e.secure!=null?e.secure:typeof location<"u"&&location.protocol==="https:",e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.hostname=e.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=e.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},e.transports.forEach(t=>{let s=t.prototype.name;this.transports.push(s),this._transportsByName[s]=t}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},e),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=(0,Ph.decode)(this.opts.query)),$n&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(L("adding listener for the 'offline' event"),this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},mi.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=(0,Cn.createCookieJar)()),this._open()}createTransport(r){L('creating transport "%s"',r);let e=Object.assign({},this.opts.query);e.EIO=Nl.protocol,e.transport=r,this.id&&(e.sid=this.id);let t=Object.assign({},this.opts,{query:e,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[r]);return L("options: %j",t),new this._transportsByName[r](t)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}let r=this.opts.rememberUpgrade&&i.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";let e=this.createTransport(r);e.open(),this.setTransport(e)}setTransport(r){L("setting transport %s",r.name),this.transport&&(L("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=r,r.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",e=>this._onClose("transport close",e))}onOpen(){L("socket open"),this.readyState="open",i.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(r){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(L('socket receive: type "%s", data "%s"',r.type,r.data),this.emitReserved("packet",r),this.emitReserved("heartbeat"),r.type){case"open":this.onHandshake(JSON.parse(r.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":let e=new Error("server error");e.code=r.data,this._onError(e);break;case"message":this.emitReserved("data",r.data),this.emitReserved("message",r.data);break}else L('packet received with socket readyState "%s"',this.readyState)}onHandshake(r){this.emitReserved("handshake",r),this.id=r.sid,this.transport.query.sid=r.sid,this._pingInterval=r.pingInterval,this._pingTimeout=r.pingTimeout,this._maxPayload=r.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);let r=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+r,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},r),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){let r=this._getWritablePackets();L("flushing %d packets in socket",r.length),this.transport.send(r),this._prevBufferLen=r.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let e=1;for(let t=0;t<this.writeBuffer.length;t++){let s=this.writeBuffer[t].data;if(s&&(e+=(0,jl.byteLength)(s)),t>0&&e>this._maxPayload)return L("only send %d out of %d packets",t,this.writeBuffer.length),this.writeBuffer.slice(0,t);e+=2}return L("payload size is %d (max: %d)",e,this._maxPayload),this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;let r=Date.now()>this._pingTimeoutTime;return r&&(L("throttled timer detected, scheduling connection close"),this._pingTimeoutTime=0,(0,Cn.nextTick)(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),r}write(r,e,t){return this._sendPacket("message",r,e,t),this}send(r,e,t){return this._sendPacket("message",r,e,t),this}_sendPacket(r,e,t,s){if(typeof e=="function"&&(s=e,e=void 0),typeof t=="function"&&(s=t,t=null),this.readyState==="closing"||this.readyState==="closed")return;t=t||{},t.compress=t.compress!==!1;let n={type:r,data:e,options:t};this.emitReserved("packetCreate",n),this.writeBuffer.push(n),s&&this.once("flush",s),this.flush()}close(){let r=()=>{this._onClose("forced close"),L("socket closing - telling transport to close"),this.transport.close()},e=()=>{this.off("upgrade",e),this.off("upgradeError",e),r()},t=()=>{this.once("upgrade",e),this.once("upgradeError",e)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?t():r()}):this.upgrading?t():r()),this}_onError(r){if(L("socket error %j",r),i.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return L("trying next transport"),this.transports.shift(),this._open();this.emitReserved("error",r),this._onClose("transport error",r)}_onClose(r,e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(L('socket close with reason: "%s"',r),this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),$n&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){let t=mi.indexOf(this._offlineEventListener);t!==-1&&(L("removing listener for the 'offline' event"),mi.splice(t,1))}this.readyState="closed",this.id=null,this.emitReserved("close",r,e),this.writeBuffer=[],this._prevBufferLen=0}}};xe.SocketWithoutUpgrade=ut;ut.protocol=Nl.protocol;var Mr=class extends ut{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade){L("starting upgrade probes");for(let r=0;r<this._upgrades.length;r++)this._probe(this._upgrades[r])}}_probe(r){L('probing transport "%s"',r);let e=this.createTransport(r),t=!1;ut.priorWebsocketSuccess=!1;let s=()=>{t||(L('probe transport "%s" opened',r),e.send([{type:"ping",data:"probe"}]),e.once("packet",d=>{if(!t)if(d.type==="pong"&&d.data==="probe"){if(L('probe transport "%s" pong',r),this.upgrading=!0,this.emitReserved("upgrading",e),!e)return;ut.priorWebsocketSuccess=e.name==="websocket",L('pausing current transport "%s"',this.transport.name),this.transport.pause(()=>{t||this.readyState!=="closed"&&(L("changing transport and sending upgrade packet"),h(),this.setTransport(e),e.send([{type:"upgrade"}]),this.emitReserved("upgrade",e),e=null,this.upgrading=!1,this.flush())})}else{L('probe transport "%s" failed',r);let f=new Error("probe error");f.transport=e.name,this.emitReserved("upgradeError",f)}}))};function n(){t||(t=!0,h(),e.close(),e=null)}let o=d=>{let f=new Error("probe error: "+d);f.transport=e.name,n(),L('probe transport "%s" failed because of error: %s',r,d),this.emitReserved("upgradeError",f)};function a(){o("transport closed")}function l(){o("socket closed")}function u(d){e&&d.name!==e.name&&(L('"%s" works - aborting "%s"',d.name,e.name),n())}let h=()=>{e.removeListener("open",s),e.removeListener("error",o),e.removeListener("close",a),this.off("close",l),this.off("upgrading",u)};e.once("open",s),e.once("error",o),e.once("close",a),this.once("close",l),this.once("upgrading",u),this._upgrades.indexOf("webtransport")!==-1&&r!=="webtransport"?this.setTimeoutFn(()=>{t||e.open()},200):e.open()}onHandshake(r){this._upgrades=this._filterUpgrades(r.upgrades),super.onHandshake(r)}_filterUpgrades(r){let e=[];for(let t=0;t<r.length;t++)~this.transports.indexOf(r[t])&&e.push(r[t]);return e}};xe.SocketWithUpgrade=Mr;var En=class extends Mr{constructor(r,e={}){let t=typeof r=="object",s=t?{...r}:{...e};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(n=>Th.transports[n]).filter(n=>!!n)),super(t?s:r,s)}};xe.Socket=En});var Ul=S(Lr=>{"use strict";Object.defineProperty(Lr,"__esModule",{value:!0});Lr.Fetch=void 0;var Mh=fn(),Pn=class extends Mh.Polling{doPoll(){this._fetch().then(r=>{if(!r.ok)return this.onError("fetch read error",r.status,r);r.text().then(e=>this.onData(e))}).catch(r=>{this.onError("fetch read error",r)})}doWrite(r,e){this._fetch(r).then(t=>{if(!t.ok)return this.onError("fetch write error",t.status,t);e()}).catch(t=>{this.onError("fetch write error",t)})}_fetch(r){var e;let t=r!==void 0,s=new Headers(this.opts.extraHeaders);return t&&s.set("content-type","text/plain;charset=UTF-8"),(e=this.socket._cookieJar)===null||e===void 0||e.appendCookies(s),fetch(this.uri(),{method:t?"POST":"GET",body:t?r:null,headers:s,credentials:this.opts.withCredentials?"include":"omit"}).then(n=>{var o;return(o=this.socket._cookieJar)===null||o===void 0||o.parseCookies(n.headers.getSetCookie()),n})}};Lr.Fetch=Pn});var Kl=S(A=>{"use strict";Object.defineProperty(A,"__esModule",{value:!0});A.WebTransport=A.WebSocket=A.NodeWebSocket=A.XHR=A.NodeXHR=A.Fetch=A.nextTick=A.parse=A.installTimerFunctions=A.transports=A.TransportError=A.Transport=A.protocol=A.SocketWithUpgrade=A.SocketWithoutUpgrade=A.Socket=void 0;var ql=Tn();Object.defineProperty(A,"Socket",{enumerable:!0,get:function(){return ql.Socket}});var Vl=Tn();Object.defineProperty(A,"SocketWithoutUpgrade",{enumerable:!0,get:function(){return Vl.SocketWithoutUpgrade}});Object.defineProperty(A,"SocketWithUpgrade",{enumerable:!0,get:function(){return Vl.SocketWithUpgrade}});A.protocol=ql.Socket.protocol;var Wl=hi();Object.defineProperty(A,"Transport",{enumerable:!0,get:function(){return Wl.Transport}});Object.defineProperty(A,"TransportError",{enumerable:!0,get:function(){return Wl.TransportError}});var Lh=wn();Object.defineProperty(A,"transports",{enumerable:!0,get:function(){return Lh.transports}});var Hh=ct();Object.defineProperty(A,"installTimerFunctions",{enumerable:!0,get:function(){return Hh.installTimerFunctions}});var Oh=Sn();Object.defineProperty(A,"parse",{enumerable:!0,get:function(){return Oh.parse}});var Ih=lt();Object.defineProperty(A,"nextTick",{enumerable:!0,get:function(){return Ih.nextTick}});var Dh=Ul();Object.defineProperty(A,"Fetch",{enumerable:!0,get:function(){return Dh.Fetch}});var Fh=Tr();Object.defineProperty(A,"NodeXHR",{enumerable:!0,get:function(){return Fh.XHR}});var zh=Tr();Object.defineProperty(A,"XHR",{enumerable:!0,get:function(){return zh.XHR}});var jh=Ar();Object.defineProperty(A,"NodeWebSocket",{enumerable:!0,get:function(){return jh.WS}});var Bh=Ar();Object.defineProperty(A,"WebSocket",{enumerable:!0,get:function(){return Bh.WS}});var Nh=xn();Object.defineProperty(A,"WebTransport",{enumerable:!0,get:function(){return Nh.WT}})});var Gl=S(He=>{"use strict";Object.defineProperty(He,"__esModule",{value:!0});He.TimeoutError=void 0;He.singletonPromise=Uh;He.timeoutPromise=qh;He.timeoutFunction=Vh;He.createPromiseDebouncer=Wh;He.createMapPromiseDebouncer=Kh;function Uh(i,r,e=0){if(i?.promise)return i;let t=r();return i?i.promise=t:i={promise:t,cacheDuration:e},t.finally(()=>setTimeout(()=>i.promise=void 0,i.cacheDuration)),i}var bi=class extends Error{promise;constructor(r){super("Operation Timed Out"),this.promise=r}};He.TimeoutError=bi;function qh(i,r){return new Promise((e,t)=>{let s=setTimeout(()=>t(new bi(r)),i);r.then(n=>{clearTimeout(s),e(n)}).catch(n=>{clearTimeout(s),t(n)})})}function Vh(i,r){return new Promise((e,t)=>{let s=!1,n=r(()=>s),o=setTimeout(()=>{s=!0,t(new bi(n))},i);n.then(a=>{clearTimeout(o),e(a)}).catch(a=>{clearTimeout(o),t(a)})})}function Wh(){let i;return r=>(i||(i=r().finally(()=>i=void 0)),i)}function Kh(){let i=new Map;return(r,e,t)=>{let s=JSON.stringify(r),n=i.get(s);return n||(n=t().finally(()=>{if(!e){i.delete(s);return}setTimeout(()=>i.delete(s),e)}),i.set(s,n)),n}}});var ke=S(Ke=>{"use strict";Object.defineProperty(Ke,"__esModule",{value:!0});Ke.RpcPeer=Ke.RPCResultError=void 0;Ke.startPeriodicGarbageCollection=Yl;Ke.getEvalSource=Gh;function Yl(){globalThis.gc||console.warn("rpc peer garbage collection not available: global.gc is not exposed.");let i;try{i=globalThis}catch{}let r=0;return setInterval(()=>{let e=Date.now(),t=e-r,s=W.remotesCreated;W.remotesCreated=0;let n=W.remotesCollected;W.remotesCollected=0,(s||n||t>5*60*1e3)&&(r=e,i?.gc?.())},1e4)}var Hr=class i{peer;entry;constructorName;proxyProps;proxyOneWayMethods;static iteratorMethods=new Set(["next","throw","return"]);constructor(r,e,t,s,n){this.peer=r,this.entry=e,this.constructorName=t,this.proxyProps=s,this.proxyOneWayMethods=n}toPrimitive(){let r=this.peer;return`RpcProxy-${r.selfName}:${r.peerName}: ${this.constructorName}`}get(r,e,t){if(e===Symbol.asyncIterator)return this.proxyProps?.[Symbol.asyncIterator.toString()]?()=>new Proxy(()=>{},this):void 0;if(i.iteratorMethods.has(e?.toString())){let n=this.proxyProps?.[Symbol.asyncIterator.toString()]?.[e];if(n)return new Proxy(()=>n,this)}if(e===W.PROPERTY_PROXY_ID)return this.entry.id;if(e==="__proxy_constructor")return this.constructorName;if(e===W.PROPERTY_PROXY_PEER)return this.peer;if(e===W.PROPERTY_PROXY_PROPERTIES)return this.proxyProps;if(e===W.PROPERTY_PROXY_ONEWAY_METHODS)return this.proxyOneWayMethods;if(e===W.PROPERTY_JSON_DISABLE_SERIALIZATION||e===W.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN||e==="then"||e==="constructor")return;if(this.proxyProps?.[e]!==void 0)return this.proxyProps?.[e];let s=W.handleFunctionInvocations(this,r,e,t);return s||new Proxy(()=>e,this)}set(r,e,t,s){return e===W.finalizerIdSymbol?this.entry.finalizerId=t:(this.proxyProps||={},this.proxyProps[e]=t),!0}apply(r,e,t){let s=r()||null,n=this.proxyOneWayMethods?.includes?.(s);if(Object.isFrozen(this.peer.pendingResults))return n?Promise.resolve():Promise.reject(new we(this.peer,"RpcPeer has been killed (apply) "+r()));let o=[],a={};for(let d of t||[])o.push(this.peer.serialize(d,a));let l={type:"apply",id:void 0,proxyId:this.entry.id,args:o,method:s};if(n)return l.oneway=!0,s===null&&delete l.method,this.peer.send(l,void 0,a),Promise.resolve();let u=this.peer.createPendingResult(s,(d,f)=>{l.id=d,this.peer.send(l,f,a)}),h=this.proxyProps?.[Symbol.asyncIterator.toString()];return!h||s!==h.next&&s!==h.return?u:u.then(d=>s===h.return?{done:!0,value:void 0}:{value:d,done:!1}).catch(d=>{if(d.name==="StopAsyncIteration")return{done:!0,value:void 0};throw d})}},we=class extends Error{cause;constructor(r,e,t,s){super(`${e}
${r.selfName}:${r.peerName}`),this.cause=t,s?.name&&(this.name=s?.name),s?.stack&&(this.stack=`${t?.stack||s.stack}
${r.peerName}:${r.selfName}`)}};Ke.RPCResultError=we;try{let i=FinalizationRegistry}catch{window.WeakRef=class{target;constructor(e){this.target=e}deref(){return this.target}},window.FinalizationRegistry=class{register(){}}}var W=class i{selfName;peerName;send;params={};pendingResults={};localProxied=new Map;localProxyMap=new Map;remoteWeakProxies={};finalizers=new FinalizationRegistry(r=>this.finalize(r));nameDeserializerMap=new Map;onProxyTypeSerialization=new Map;onProxySerialization;constructorSerializerMap=new Map;transportSafeArgumentTypes=i.getDefaultTransportSafeArgumentTypes();killed;killedSafe;killedDeferred;tags={};yieldedAsyncIterators=new Set;static finalizerIdSymbol=Symbol("rpcFinalizerId");static remotesCollected=0;static remotesCreated=0;static activeRpcPeer;static isRpcProxy(r){return!!r?.[i.PROPERTY_PROXY_ID]}static getDefaultTransportSafeArgumentTypes(){let r=new Set;return r.add(Number.name),r.add(String.name),r.add(Object.name),r.add(Boolean.name),r.add(Array.name),r}static handleFunctionInvocations(r,e,t,s){if(t==="apply")return(n,o)=>r.apply(e,r,o);if(t==="call")return(n,...o)=>r.apply(e,r,o);if(t==="toString"||t===Symbol.toPrimitive)return(n,...o)=>r.toPrimitive()}static getIteratorNext(r){return r[Symbol.asyncIterator]?r[this.PROPERTY_PROXY_PROPERTIES]?.[Symbol.asyncIterator.toString()]?.next||"next":void 0}static prepareProxyProperties(r){let e=r?.[i.PROPERTY_PROXY_PROPERTIES];return r[Symbol.asyncIterator]&&(e||={},e[Symbol.asyncIterator.toString()]||(e[Symbol.asyncIterator.toString()]={next:"next",throw:"throw",return:"return"})),e}static RANDOM_DIGITS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";static RPC_RESULT_ERROR_NAME="RPCResultError";static PROPERTY_PROXY_ID="__proxy_id";static PROPERTY_PROXY_PEER="__proxy_peer";static PROPERTY_PROXY_ONEWAY_METHODS="__proxy_oneway_methods";static PROPERTY_JSON_DISABLE_SERIALIZATION="__json_disable_serialization";static PROPERTY_PROXY_PROPERTIES="__proxy_props";static PROPERTY_JSON_COPY_SERIALIZE_CHILDREN="__json_copy_serialize_children";static PROBED_PROPERTIES=new Set(["then","constructor","__proxy_id","__proxy_constructor",i.PROPERTY_PROXY_PEER,i.PROPERTY_PROXY_ONEWAY_METHODS,i.PROPERTY_JSON_DISABLE_SERIALIZATION,i.PROPERTY_PROXY_PROPERTIES,i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]);constructor(r,e,t){this.selfName=r,this.peerName=e,this.send=t,this.killed=new Promise((s,n)=>{this.killedDeferred={resolve:s,reject:n,method:void 0}}).catch(s=>s.message||"Unknown Error"),this.killedSafe=this.killed.then(()=>{}).catch(()=>{})}static isTransportSafe(r){return r?!r[Symbol.asyncIterator]&&!r[i.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.getDefaultTransportSafeArgumentTypes().has(r.constructor?.name):!0}isTransportSafe(r){return r?!r[Symbol.asyncIterator]&&!r[i.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.transportSafeArgumentTypes.has(r.constructor?.name):!0}static generateId(){return[...new Array(8)].map(()=>i.RANDOM_DIGITS.charAt(Math.floor(Math.random()*i.RANDOM_DIGITS.length))).join("")}createPendingResult(r,e){if(Object.isFrozen(this.pendingResults))return Promise.reject(new we(this,"RpcPeer has been killed (createPendingResult)"));let t=new Promise((s,n)=>{let o=i.generateId();this.pendingResults[o]={resolve:s,reject:n,method:r},e(o,a=>n(new we(this,a.message,a)))});return t.catch(()=>{}),t}kill(r){if(Object.isFrozen(this.pendingResults))return;let e=new we(this,r||"peer was killed");this.killedDeferred.reject(e);for(let t of Object.values(this.pendingResults))t.reject(e);for(let t of this.yieldedAsyncIterators)t.throw(e).catch(()=>{});this.yieldedAsyncIterators.clear(),this.pendingResults=Object.freeze({}),this.params=Object.freeze({}),this.remoteWeakProxies=Object.freeze({}),this.localProxyMap.clear(),this.localProxied.clear()}addSerializer(r,e,t){this.nameDeserializerMap.set(e,t),this.constructorSerializerMap.set(r,e)}finalize(r){i.remotesCollected++,delete this.remoteWeakProxies[r.id];let e={__local_proxy_id:r.id,__local_proxy_finalizer_id:r.finalizerId,type:"finalize"};this.send(e)}async getParam(r){return this.createPendingResult("getParam",(e,t)=>{let s={id:e,type:"param",param:r};this.send(s,t)})}createErrorResult(r,e){return r.result=this.serializeError(e),r.throw=!0,r}deserialize(r,e){if(!r)return r;let t=r[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN];if(t){if(Array.isArray(t)){let m=[];for(let b of t)m.push(this.deserialize(b,e));return m}let f={};for(let[m,b]of Object.entries(r))f[m]=this.deserialize(b,e);return f}let{__remote_proxy_id:s,__remote_proxy_finalizer_id:n,__local_proxy_id:o,__remote_constructor_name:a,__serialized_value:l,__remote_proxy_props:u,__remote_proxy_oneway_methods:h}=r;if(a===i.RPC_RESULT_ERROR_NAME)return this.deserializeError(l);if(s){let f=this.remoteWeakProxies[s]?.deref();f||(f=this.newProxy(s,a,u,h)),f[i.finalizerIdSymbol]=n;let m=this.nameDeserializerMap.get(a);return m?m.deserialize(f,e):f}if(o){let f=this.localProxyMap.get(o);if(!f)throw new we(this,`invalid local proxy id ${o}`);return f}let d=this.nameDeserializerMap.get(a);return d?d.deserialize(l,e):r}deserializeError(r){let{name:e,stack:t,message:s}=r;return new we(this,s,void 0,{name:e,stack:t})}serializeError(r){let e={stack:r.stack||"[no stack]",name:r.name||"[no name]",message:r.message||"[no message]"};return{__remote_constructor_name:i.RPC_RESULT_ERROR_NAME,__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_proxy_oneway_methods:void 0,__remote_proxy_props:void 0,__serialized_value:e}}serialize(r,e){if(r?.[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]===!0){if(Array.isArray(r)){let f=[];for(let m of r)f.push(this.serialize(m,e));return{[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]:f}}let d={};for(let[f,m]of Object.entries(r))d[f]=this.serialize(m,e);return d}if(this.isTransportSafe(r))return r;let t=r.__proxy_constructor||r.constructor?.name?.toString();if(r instanceof Error)return this.serializeError(r);let s=this.constructorSerializerMap.get(r.constructor);if(s){t=s;let d=this.nameDeserializerMap.get(s);if(!d)throw new Error("serializer not found for "+s);let f=d.serialize(r,e);return{__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_constructor_name:t,__remote_proxy_props:i.prepareProxyProperties(r),__remote_proxy_oneway_methods:r?.[i.PROPERTY_PROXY_ONEWAY_METHODS],__serialized_value:f}}let n=this.localProxied.get(r);if(n){let{proxyId:d,properties:f}=this.onProxySerialization?.(r)||{proxyId:n.id,properties:i.prepareProxyProperties(r)};if(d!==n.id)throw new Error("onProxySerialization proxy id mismatch");let m=i.generateId();return n.finalizerId=m,{__remote_proxy_id:d,__remote_proxy_finalizer_id:m,__remote_constructor_name:t,__remote_proxy_props:f,__remote_proxy_oneway_methods:r?.[i.PROPERTY_PROXY_ONEWAY_METHODS]}}let{__proxy_id:o,__proxy_peer:a}=r;if(o&&a===this)return{__local_proxy_id:o};this.onProxyTypeSerialization.get(t)?.(r);let{proxyId:l,properties:u}=this.onProxySerialization?.(r)||{proxyId:i.generateId(),properties:i.prepareProxyProperties(r)};return n={id:l,finalizerId:l},this.localProxied.set(r,n),this.localProxyMap.set(l,r),{__remote_proxy_id:l,__remote_proxy_finalizer_id:l,__remote_constructor_name:t,__remote_proxy_props:u,__remote_proxy_oneway_methods:r?.[i.PROPERTY_PROXY_ONEWAY_METHODS]}}newProxy(r,e,t,s){i.remotesCreated++;let n={id:r,finalizerId:void 0},o=new Hr(this,n,e,t,s),a=e==="Function"||e==="AsyncFunction"?function(){}:o,l=new Proxy(a,o),u=new WeakRef(l);return this.remoteWeakProxies[r]=u,this.finalizers.register(o,n),l}handleMessage(r,e){try{i.activeRpcPeer=this,this.handleMessageInternal(r,e)}finally{i.activeRpcPeer=void 0}}sendResult(r,e){this.send(r,t=>{this.send(this.createErrorResult(r,t),void 0,e)},e)}async handleMessageInternal(r,e){if(!Object.isFrozen(this.pendingResults))try{switch(r.type){case"param":{let t=r,s={},n;try{n={type:"result",id:t.id,result:this.serialize(this.params[t.param],s)}}catch(o){this.createErrorResult(n,o)}this.sendResult(n,s);break}case"apply":{let t=r,s={type:"result",id:t.id||""},n={};try{let o=this.localProxyMap.get(t.proxyId);if(!o)throw new Error(`proxy id ${t.proxyId} not found`);let a=[];for(let u of t.args||[])a.push(this.deserialize(u,e));let l;if(t.method){if(!o[t.method])throw new Error(`target ${o?.constructor?.name} does not have method ${t.method}`);let h=i.getIteratorNext(o)===t.method;if(h&&this.yieldedAsyncIterators.delete(o),l=await o[t.method](...a),h){if(l.done)throw{name:"StopAsyncIteration",message:void 0};Object.isFrozen(this.pendingResults)?o.throw(new we(this,"RpcPeer has been killed (yield)")).catch(()=>{}):this.yieldedAsyncIterators.add(o),l=l.value}}else l=await o(...a);s.result=this.serialize(l,n)}catch(o){this.createErrorResult(s,o)}t.oneway||this.sendResult(s,n);break}case"result":{let t=r,s=this.pendingResults[t.id];if(delete this.pendingResults[t.id],!s)throw new Error(`unknown result ${t.id}`);let n=this.deserialize(t.result,e);t.throw?s.reject(n):s.resolve(n);break}case"finalize":{let t=r,s=this.localProxyMap.get(t.__local_proxy_id);if(s){let n=this.localProxied.get(s);if(t.__local_proxy_finalizer_id&&t.__local_proxy_finalizer_id!==n?.finalizerId)break;this.localProxyMap.delete(t.__local_proxy_id),this.localProxied.delete(s)}break}default:throw new Error(`unknown rpc message type ${r.type}`)}}catch(t){console.error("unhandled rpc error",this.peerName,t);return}}};Ke.RpcPeer=W;function Gh(){return`
    (() => {
        ${Hr}

        ${W}

        ${Yl}

        return {
            startPeriodicGarbageCollection,
            RpcPeer,
            RpcProxy,
        };
    })();
    `}});var Xl=S(Or=>{"use strict";Object.defineProperty(Or,"__esModule",{value:!0});Or.MediaObject=void 0;var Yh=ke(),An=class{mimeType;data;__proxy_props;constructor(r,e,t){this.mimeType=r,this.data=e,this.__proxy_props={},t||={},t.mimeType=r,t.convert||=null,t.toMimeTypes||=null;for(let[s,n]of Object.entries(t))Yh.RpcPeer.isTransportSafe(n)&&(this.__proxy_props[s]=n),this[s]=n}async getData(){return Promise.resolve(this.data)}};Or.MediaObject=An});var ht=S(k=>{"use strict";Object.defineProperty(k,"__esModule",{value:!0});k.ScryptedMimeTypes=k.ScryptedInterface=k.MediaPlayerState=k.SecuritySystemObstruction=k.SecuritySystemMode=k.AirQuality=k.AirPurifierMode=k.AirPurifierStatus=k.ChargeState=k.LockState=k.PanTiltZoomMovement=k.ThermostatMode=k.TemperatureUnit=k.FanMode=k.HumidityMode=k.ScryptedDeviceType=k.ScryptedInterfaceDescriptors=k.ScryptedInterfaceMethod=k.ScryptedInterfaceProperty=k.DeviceBase=k.TYPES_VERSION=void 0;k.TYPES_VERSION="0.5.55";var Rn=class{};k.DeviceBase=Rn;var Zl;(function(i){i.id="id",i.info="info",i.interfaces="interfaces",i.mixins="mixins",i.name="name",i.nativeId="nativeId",i.pluginId="pluginId",i.providedInterfaces="providedInterfaces",i.providedName="providedName",i.providedRoom="providedRoom",i.providedType="providedType",i.providerId="providerId",i.room="room",i.type="type",i.scryptedRuntimeArguments="scryptedRuntimeArguments",i.on="on",i.brightness="brightness",i.colorTemperature="colorTemperature",i.rgb="rgb",i.hsv="hsv",i.buttons="buttons",i.sensors="sensors",i.running="running",i.paused="paused",i.docked="docked",i.temperatureSetting="temperatureSetting",i.temperature="temperature",i.temperatureUnit="temperatureUnit",i.humidity="humidity",i.resolution="resolution",i.audioVolumes="audioVolumes",i.recordingActive="recordingActive",i.ptzCapabilities="ptzCapabilities",i.lockState="lockState",i.entryOpen="entryOpen",i.batteryLevel="batteryLevel",i.chargeState="chargeState",i.online="online",i.fromMimeType="fromMimeType",i.toMimeType="toMimeType",i.converters="converters",i.binaryState="binaryState",i.tampered="tampered",i.sleeping="sleeping",i.powerDetected="powerDetected",i.audioDetected="audioDetected",i.motionDetected="motionDetected",i.ambientLight="ambientLight",i.occupied="occupied",i.flooded="flooded",i.ultraviolet="ultraviolet",i.luminance="luminance",i.position="position",i.securitySystemState="securitySystemState",i.pm10Density="pm10Density",i.pm25Density="pm25Density",i.vocDensity="vocDensity",i.noxDensity="noxDensity",i.co2ppm="co2ppm",i.airQuality="airQuality",i.airPurifierState="airPurifierState",i.filterChangeIndication="filterChangeIndication",i.filterLifeLevel="filterLifeLevel",i.humiditySetting="humiditySetting",i.fan="fan",i.applicationInfo="applicationInfo",i.chatCompletionCapabilities="chatCompletionCapabilities",i.systemDevice="systemDevice"})(Zl||(k.ScryptedInterfaceProperty=Zl={}));var Ql;(function(i){i.listen="listen",i.probe="probe",i.setMixins="setMixins",i.setName="setName",i.setRoom="setRoom",i.setType="setType",i.getPluginJson="getPluginJson",i.turnOff="turnOff",i.turnOn="turnOn",i.setBrightness="setBrightness",i.getTemperatureMaxK="getTemperatureMaxK",i.getTemperatureMinK="getTemperatureMinK",i.setColorTemperature="setColorTemperature",i.setRgb="setRgb",i.setHsv="setHsv",i.pressButton="pressButton",i.sendNotification="sendNotification",i.start="start",i.stop="stop",i.pause="pause",i.resume="resume",i.dock="dock",i.setTemperature="setTemperature",i.setTemperatureUnit="setTemperatureUnit",i.getPictureOptions="getPictureOptions",i.takePicture="takePicture",i.getAudioStream="getAudioStream",i.setAudioVolumes="setAudioVolumes",i.startDisplay="startDisplay",i.stopDisplay="stopDisplay",i.getVideoStream="getVideoStream",i.getVideoStreamOptions="getVideoStreamOptions",i.getPrivacyMasks="getPrivacyMasks",i.setPrivacyMasks="setPrivacyMasks",i.getVideoTextOverlays="getVideoTextOverlays",i.setVideoTextOverlay="setVideoTextOverlay",i.getRecordingStream="getRecordingStream",i.getRecordingStreamCurrentTime="getRecordingStreamCurrentTime",i.getRecordingStreamOptions="getRecordingStreamOptions",i.getRecordingStreamThumbnail="getRecordingStreamThumbnail",i.deleteRecordingStream="deleteRecordingStream",i.setRecordingActive="setRecordingActive",i.ptzCommand="ptzCommand",i.getRecordedEvents="getRecordedEvents",i.getVideoClip="getVideoClip",i.getVideoClips="getVideoClips",i.getVideoClipThumbnail="getVideoClipThumbnail",i.removeVideoClips="removeVideoClips",i.setVideoStreamOptions="setVideoStreamOptions",i.startIntercom="startIntercom",i.stopIntercom="stopIntercom",i.lock="lock",i.unlock="unlock",i.addPassword="addPassword",i.getPasswords="getPasswords",i.removePassword="removePassword",i.activate="activate",i.deactivate="deactivate",i.isReversible="isReversible",i.closeEntry="closeEntry",i.openEntry="openEntry",i.getDevice="getDevice",i.releaseDevice="releaseDevice",i.adoptDevice="adoptDevice",i.discoverDevices="discoverDevices",i.createDevice="createDevice",i.getCreateDeviceSettings="getCreateDeviceSettings",i.reboot="reboot",i.getRefreshFrequency="getRefreshFrequency",i.refresh="refresh",i.getMediaStatus="getMediaStatus",i.load="load",i.seek="seek",i.skipNext="skipNext",i.skipPrevious="skipPrevious",i.convert="convert",i.convertMedia="convertMedia",i.getSettings="getSettings",i.putSetting="putSetting",i.armSecuritySystem="armSecuritySystem",i.disarmSecuritySystem="disarmSecuritySystem",i.setAirPurifierState="setAirPurifierState",i.getReadmeMarkdown="getReadmeMarkdown",i.getOauthUrl="getOauthUrl",i.onOauthCallback="onOauthCallback",i.canMixin="canMixin",i.getMixin="getMixin",i.releaseMixin="releaseMixin",i.onRequest="onRequest",i.onConnection="onConnection",i.onPush="onPush",i.run="run",i.eval="eval",i.loadScripts="loadScripts",i.saveScript="saveScript",i.forkInterface="forkInterface",i.getDetectionInput="getDetectionInput",i.getObjectTypes="getObjectTypes",i.detectObjects="detectObjects",i.generateObjectDetections="generateObjectDetections",i.getDetectionModel="getDetectionModel",i.setHumidity="setHumidity",i.setFan="setFan",i.startRTCSignalingSession="startRTCSignalingSession",i.createRTCSignalingSession="createRTCSignalingSession",i.getScryptedUserAccessControl="getScryptedUserAccessControl",i.generateVideoFrames="generateVideoFrames",i.connectStream="connectStream",i.getTTYSettings="getTTYSettings",i.getChatCompletion="getChatCompletion",i.streamChatCompletion="streamChatCompletion",i.getTextEmbedding="getTextEmbedding",i.getImageEmbedding="getImageEmbedding",i.callLLMTool="callLLMTool",i.getLLMTools="getLLMTools"})(Ql||(k.ScryptedInterfaceMethod=Ql={}));k.ScryptedInterfaceDescriptors={ScryptedDevice:{name:"ScryptedDevice",methods:["listen","probe","setMixins","setName","setRoom","setType"],properties:["id","info","interfaces","mixins","name","nativeId","pluginId","providedInterfaces","providedName","providedRoom","providedType","providerId","room","type"]},ScryptedPlugin:{name:"ScryptedPlugin",methods:["getPluginJson"],properties:[]},ScryptedPluginRuntime:{name:"ScryptedPluginRuntime",methods:[],properties:["scryptedRuntimeArguments"]},OnOff:{name:"OnOff",methods:["turnOff","turnOn"],properties:["on"]},Brightness:{name:"Brightness",methods:["setBrightness"],properties:["brightness"]},ColorSettingTemperature:{name:"ColorSettingTemperature",methods:["getTemperatureMaxK","getTemperatureMinK","setColorTemperature"],properties:["colorTemperature"]},ColorSettingRgb:{name:"ColorSettingRgb",methods:["setRgb"],properties:["rgb"]},ColorSettingHsv:{name:"ColorSettingHsv",methods:["setHsv"],properties:["hsv"]},Buttons:{name:"Buttons",methods:[],properties:["buttons"]},PressButtons:{name:"PressButtons",methods:["pressButton"],properties:[]},Sensors:{name:"Sensors",methods:[],properties:["sensors"]},Notifier:{name:"Notifier",methods:["sendNotification"],properties:[]},StartStop:{name:"StartStop",methods:["start","stop"],properties:["running"]},Pause:{name:"Pause",methods:["pause","resume"],properties:["paused"]},Dock:{name:"Dock",methods:["dock"],properties:["docked"]},TemperatureSetting:{name:"TemperatureSetting",methods:["setTemperature"],properties:["temperatureSetting"]},Thermometer:{name:"Thermometer",methods:["setTemperatureUnit"],properties:["temperature","temperatureUnit"]},HumiditySensor:{name:"HumiditySensor",methods:[],properties:["humidity"]},Camera:{name:"Camera",methods:["getPictureOptions","takePicture"],properties:[]},Resolution:{name:"Resolution",methods:[],properties:["resolution"]},Microphone:{name:"Microphone",methods:["getAudioStream"],properties:[]},AudioVolumeControl:{name:"AudioVolumeControl",methods:["setAudioVolumes"],properties:["audioVolumes"]},Display:{name:"Display",methods:["startDisplay","stopDisplay"],properties:[]},VideoCamera:{name:"VideoCamera",methods:["getVideoStream","getVideoStreamOptions"],properties:[]},VideoCameraMask:{name:"VideoCameraMask",methods:["getPrivacyMasks","setPrivacyMasks"],properties:[]},VideoTextOverlays:{name:"VideoTextOverlays",methods:["getVideoTextOverlays","setVideoTextOverlay"],properties:[]},VideoRecorder:{name:"VideoRecorder",methods:["getRecordingStream","getRecordingStreamCurrentTime","getRecordingStreamOptions","getRecordingStreamThumbnail"],properties:["recordingActive"]},VideoRecorderManagement:{name:"VideoRecorderManagement",methods:["deleteRecordingStream","setRecordingActive"],properties:[]},PanTiltZoom:{name:"PanTiltZoom",methods:["ptzCommand"],properties:["ptzCapabilities"]},EventRecorder:{name:"EventRecorder",methods:["getRecordedEvents"],properties:[]},VideoClips:{name:"VideoClips",methods:["getVideoClip","getVideoClips","getVideoClipThumbnail","removeVideoClips"],properties:[]},VideoCameraConfiguration:{name:"VideoCameraConfiguration",methods:["setVideoStreamOptions"],properties:[]},Intercom:{name:"Intercom",methods:["startIntercom","stopIntercom"],properties:[]},Lock:{name:"Lock",methods:["lock","unlock"],properties:["lockState"]},PasswordStore:{name:"PasswordStore",methods:["addPassword","getPasswords","removePassword"],properties:[]},Scene:{name:"Scene",methods:["activate","deactivate","isReversible"],properties:[]},Entry:{name:"Entry",methods:["closeEntry","openEntry"],properties:[]},EntrySensor:{name:"EntrySensor",methods:[],properties:["entryOpen"]},DeviceProvider:{name:"DeviceProvider",methods:["getDevice","releaseDevice"],properties:[]},DeviceDiscovery:{name:"DeviceDiscovery",methods:["adoptDevice","discoverDevices"],properties:[]},DeviceCreator:{name:"DeviceCreator",methods:["createDevice","getCreateDeviceSettings"],properties:[]},Battery:{name:"Battery",methods:[],properties:["batteryLevel"]},Charger:{name:"Charger",methods:[],properties:["chargeState"]},Reboot:{name:"Reboot",methods:["reboot"],properties:[]},Refresh:{name:"Refresh",methods:["getRefreshFrequency","refresh"],properties:[]},MediaPlayer:{name:"MediaPlayer",methods:["getMediaStatus","load","seek","skipNext","skipPrevious"],properties:[]},Online:{name:"Online",methods:[],properties:["online"]},BufferConverter:{name:"BufferConverter",methods:["convert"],properties:["fromMimeType","toMimeType"]},MediaConverter:{name:"MediaConverter",methods:["convertMedia"],properties:["converters"]},Settings:{name:"Settings",methods:["getSettings","putSetting"],properties:[]},BinarySensor:{name:"BinarySensor",methods:[],properties:["binaryState"]},TamperSensor:{name:"TamperSensor",methods:[],properties:["tampered"]},Sleep:{name:"Sleep",methods:[],properties:["sleeping"]},PowerSensor:{name:"PowerSensor",methods:[],properties:["powerDetected"]},AudioSensor:{name:"AudioSensor",methods:[],properties:["audioDetected"]},MotionSensor:{name:"MotionSensor",methods:[],properties:["motionDetected"]},AmbientLightSensor:{name:"AmbientLightSensor",methods:[],properties:["ambientLight"]},OccupancySensor:{name:"OccupancySensor",methods:[],properties:["occupied"]},FloodSensor:{name:"FloodSensor",methods:[],properties:["flooded"]},UltravioletSensor:{name:"UltravioletSensor",methods:[],properties:["ultraviolet"]},LuminanceSensor:{name:"LuminanceSensor",methods:[],properties:["luminance"]},PositionSensor:{name:"PositionSensor",methods:[],properties:["position"]},SecuritySystem:{name:"SecuritySystem",methods:["armSecuritySystem","disarmSecuritySystem"],properties:["securitySystemState"]},PM10Sensor:{name:"PM10Sensor",methods:[],properties:["pm10Density"]},PM25Sensor:{name:"PM25Sensor",methods:[],properties:["pm25Density"]},VOCSensor:{name:"VOCSensor",methods:[],properties:["vocDensity"]},NOXSensor:{name:"NOXSensor",methods:[],properties:["noxDensity"]},CO2Sensor:{name:"CO2Sensor",methods:[],properties:["co2ppm"]},AirQualitySensor:{name:"AirQualitySensor",methods:[],properties:["airQuality"]},AirPurifier:{name:"AirPurifier",methods:["setAirPurifierState"],properties:["airPurifierState"]},FilterMaintenance:{name:"FilterMaintenance",methods:[],properties:["filterChangeIndication","filterLifeLevel"]},Readme:{name:"Readme",methods:["getReadmeMarkdown"],properties:[]},OauthClient:{name:"OauthClient",methods:["getOauthUrl","onOauthCallback"],properties:[]},MixinProvider:{name:"MixinProvider",methods:["canMixin","getMixin","releaseMixin"],properties:[]},HttpRequestHandler:{name:"HttpRequestHandler",methods:["onRequest"],properties:[]},EngineIOHandler:{name:"EngineIOHandler",methods:["onConnection"],properties:[]},PushHandler:{name:"PushHandler",methods:["onPush"],properties:[]},Program:{name:"Program",methods:["run"],properties:[]},Scriptable:{name:"Scriptable",methods:["eval","loadScripts","saveScript"],properties:[]},ClusterForkInterface:{name:"ClusterForkInterface",methods:["forkInterface"],properties:[]},ObjectDetector:{name:"ObjectDetector",methods:["getDetectionInput","getObjectTypes"],properties:[]},ObjectDetection:{name:"ObjectDetection",methods:["detectObjects","generateObjectDetections","getDetectionModel"],properties:[]},ObjectDetectionPreview:{name:"ObjectDetectionPreview",methods:[],properties:[]},ObjectDetectionGenerator:{name:"ObjectDetectionGenerator",methods:[],properties:[]},HumiditySetting:{name:"HumiditySetting",methods:["setHumidity"],properties:["humiditySetting"]},Fan:{name:"Fan",methods:["setFan"],properties:["fan"]},RTCSignalingChannel:{name:"RTCSignalingChannel",methods:["startRTCSignalingSession"],properties:[]},RTCSignalingClient:{name:"RTCSignalingClient",methods:["createRTCSignalingSession"],properties:[]},LauncherApplication:{name:"LauncherApplication",methods:[],properties:["applicationInfo"]},ScryptedUser:{name:"ScryptedUser",methods:["getScryptedUserAccessControl"],properties:[]},VideoFrameGenerator:{name:"VideoFrameGenerator",methods:["generateVideoFrames"],properties:[]},StreamService:{name:"StreamService",methods:["connectStream"],properties:[]},TTY:{name:"TTY",methods:[],properties:[]},TTYSettings:{name:"TTYSettings",methods:["getTTYSettings"],properties:[]},ChatCompletion:{name:"ChatCompletion",methods:["getChatCompletion","streamChatCompletion"],properties:["chatCompletionCapabilities"]},TextEmbedding:{name:"TextEmbedding",methods:["getTextEmbedding"],properties:[]},ImageEmbedding:{name:"ImageEmbedding",methods:["getImageEmbedding"],properties:[]},LLMTools:{name:"LLMTools",methods:["callLLMTool","getLLMTools"],properties:[]},ScryptedSystemDevice:{name:"ScryptedSystemDevice",methods:[],properties:["systemDevice"]},ScryptedDeviceCreator:{name:"ScryptedDeviceCreator",methods:[],properties:[]},ScryptedSettings:{name:"ScryptedSettings",methods:[],properties:[]}};var Jl;(function(i){i.Builtin="Builtin",i.Internal="Internal",i.Camera="Camera",i.Fan="Fan",i.Light="Light",i.Switch="Switch",i.Outlet="Outlet",i.Sensor="Sensor",i.Scene="Scene",i.Program="Program",i.Automation="Automation",i.Vacuum="Vacuum",i.Notifier="Notifier",i.Thermostat="Thermostat",i.Lock="Lock",i.PasswordControl="PasswordControl",i.Display="Display",i.SmartDisplay="SmartDisplay",i.Speaker="Speaker",i.SmartSpeaker="SmartSpeaker",i.RemoteDesktop="RemoteDesktop",i.Event="Event",i.Entry="Entry",i.Garage="Garage",i.DeviceProvider="DeviceProvider",i.DataSource="DataSource",i.API="API",i.Buttons="Buttons",i.Doorbell="Doorbell",i.Irrigation="Irrigation",i.Valve="Valve",i.Person="Person",i.SecuritySystem="SecuritySystem",i.WindowCovering="WindowCovering",i.Siren="Siren",i.AirPurifier="AirPurifier",i.Internet="Internet",i.Network="Network",i.Bridge="Bridge",i.LLM="LLM",i.Unknown="Unknown"})(Jl||(k.ScryptedDeviceType=Jl={}));var ec;(function(i){i.Humidify="Humidify",i.Dehumidify="Dehumidify",i.Auto="Auto",i.Off="Off"})(ec||(k.HumidityMode=ec={}));var tc;(function(i){i.Auto="Auto",i.Manual="Manual"})(tc||(k.FanMode=tc={}));var ic;(function(i){i.C="C",i.F="F"})(ic||(k.TemperatureUnit=ic={}));var rc;(function(i){i.Off="Off",i.Cool="Cool",i.Heat="Heat",i.HeatCool="HeatCool",i.Auto="Auto",i.FanOnly="FanOnly",i.Purifier="Purifier",i.Eco="Eco",i.Dry="Dry",i.On="On"})(rc||(k.ThermostatMode=rc={}));var sc;(function(i){i.Absolute="Absolute",i.Relative="Relative",i.Continuous="Continuous",i.Preset="Preset",i.Home="Home"})(sc||(k.PanTiltZoomMovement=sc={}));var nc;(function(i){i.Locked="Locked",i.Unlocked="Unlocked",i.Jammed="Jammed"})(nc||(k.LockState=nc={}));var oc;(function(i){i.Trickle="trickle",i.Charging="charging",i.NotCharging="not-charging"})(oc||(k.ChargeState=oc={}));var ac;(function(i){i.Inactive="Inactive",i.Idle="Idle",i.Active="Active",i.ActiveNightMode="ActiveNightMode"})(ac||(k.AirPurifierStatus=ac={}));var lc;(function(i){i.Manual="Manual",i.Automatic="Automatic"})(lc||(k.AirPurifierMode=lc={}));var cc;(function(i){i.Unknown="Unknown",i.Excellent="Excellent",i.Good="Good",i.Fair="Fair",i.Inferior="Inferior",i.Poor="Poor"})(cc||(k.AirQuality=cc={}));var dc;(function(i){i.Disarmed="Disarmed",i.HomeArmed="HomeArmed",i.AwayArmed="AwayArmed",i.NightArmed="NightArmed"})(dc||(k.SecuritySystemMode=dc={}));var pc;(function(i){i.Sensor="Sensor",i.Occupied="Occupied",i.Time="Time",i.Error="Error"})(pc||(k.SecuritySystemObstruction=pc={}));var uc;(function(i){i.Idle="Idle",i.Playing="Playing",i.Paused="Paused",i.Buffering="Buffering"})(uc||(k.MediaPlayerState=uc={}));var hc;(function(i){i.ScryptedDevice="ScryptedDevice",i.ScryptedPlugin="ScryptedPlugin",i.ScryptedPluginRuntime="ScryptedPluginRuntime",i.OnOff="OnOff",i.Brightness="Brightness",i.ColorSettingTemperature="ColorSettingTemperature",i.ColorSettingRgb="ColorSettingRgb",i.ColorSettingHsv="ColorSettingHsv",i.Buttons="Buttons",i.PressButtons="PressButtons",i.Sensors="Sensors",i.Notifier="Notifier",i.StartStop="StartStop",i.Pause="Pause",i.Dock="Dock",i.TemperatureSetting="TemperatureSetting",i.Thermometer="Thermometer",i.HumiditySensor="HumiditySensor",i.Camera="Camera",i.Resolution="Resolution",i.Microphone="Microphone",i.AudioVolumeControl="AudioVolumeControl",i.Display="Display",i.VideoCamera="VideoCamera",i.VideoCameraMask="VideoCameraMask",i.VideoTextOverlays="VideoTextOverlays",i.VideoRecorder="VideoRecorder",i.VideoRecorderManagement="VideoRecorderManagement",i.PanTiltZoom="PanTiltZoom",i.EventRecorder="EventRecorder",i.VideoClips="VideoClips",i.VideoCameraConfiguration="VideoCameraConfiguration",i.Intercom="Intercom",i.Lock="Lock",i.PasswordStore="PasswordStore",i.Scene="Scene",i.Entry="Entry",i.EntrySensor="EntrySensor",i.DeviceProvider="DeviceProvider",i.DeviceDiscovery="DeviceDiscovery",i.DeviceCreator="DeviceCreator",i.Battery="Battery",i.Charger="Charger",i.Reboot="Reboot",i.Refresh="Refresh",i.MediaPlayer="MediaPlayer",i.Online="Online",i.BufferConverter="BufferConverter",i.MediaConverter="MediaConverter",i.Settings="Settings",i.BinarySensor="BinarySensor",i.TamperSensor="TamperSensor",i.Sleep="Sleep",i.PowerSensor="PowerSensor",i.AudioSensor="AudioSensor",i.MotionSensor="MotionSensor",i.AmbientLightSensor="AmbientLightSensor",i.OccupancySensor="OccupancySensor",i.FloodSensor="FloodSensor",i.UltravioletSensor="UltravioletSensor",i.LuminanceSensor="LuminanceSensor",i.PositionSensor="PositionSensor",i.SecuritySystem="SecuritySystem",i.PM10Sensor="PM10Sensor",i.PM25Sensor="PM25Sensor",i.VOCSensor="VOCSensor",i.NOXSensor="NOXSensor",i.CO2Sensor="CO2Sensor",i.AirQualitySensor="AirQualitySensor",i.AirPurifier="AirPurifier",i.FilterMaintenance="FilterMaintenance",i.Readme="Readme",i.OauthClient="OauthClient",i.MixinProvider="MixinProvider",i.HttpRequestHandler="HttpRequestHandler",i.EngineIOHandler="EngineIOHandler",i.PushHandler="PushHandler",i.Program="Program",i.Scriptable="Scriptable",i.ClusterForkInterface="ClusterForkInterface",i.ObjectDetector="ObjectDetector",i.ObjectDetection="ObjectDetection",i.ObjectDetectionPreview="ObjectDetectionPreview",i.ObjectDetectionGenerator="ObjectDetectionGenerator",i.HumiditySetting="HumiditySetting",i.Fan="Fan",i.RTCSignalingChannel="RTCSignalingChannel",i.RTCSignalingClient="RTCSignalingClient",i.LauncherApplication="LauncherApplication",i.ScryptedUser="ScryptedUser",i.VideoFrameGenerator="VideoFrameGenerator",i.StreamService="StreamService",i.TTY="TTY",i.TTYSettings="TTYSettings",i.ChatCompletion="ChatCompletion",i.TextEmbedding="TextEmbedding",i.ImageEmbedding="ImageEmbedding",i.LLMTools="LLMTools",i.ScryptedSystemDevice="ScryptedSystemDevice",i.ScryptedDeviceCreator="ScryptedDeviceCreator",i.ScryptedSettings="ScryptedSettings"})(hc||(k.ScryptedInterface=hc={}));var fc;(function(i){i.Url="text/x-uri",i.InsecureLocalUrl="text/x-insecure-local-uri",i.LocalUrl="text/x-local-uri",i.ServerId="text/x-server-id",i.PushEndpoint="text/x-push-endpoint",i.SchemePrefix="x-scrypted/x-scrypted-scheme-",i.MediaStreamUrl="text/x-media-url",i.MediaObject="x-scrypted/x-scrypted-media-object",i.RequestMediaObject="x-scrypted/x-scrypted-request-media-object",i.RequestMediaStream="x-scrypted/x-scrypted-request-stream",i.MediaStreamFeedback="x-scrypted/x-media-stream-feedback",i.FFmpegInput="x-scrypted/x-ffmpeg-input",i.FFmpegTranscodeStream="x-scrypted/x-ffmpeg-transcode-stream",i.RTCSignalingChannel="x-scrypted/x-scrypted-rtc-signaling-channel",i.RTCSignalingSession="x-scrypted/x-scrypted-rtc-signaling-session",i.RTCConnectionManagement="x-scrypted/x-scrypted-rtc-connection-management",i.Image="x-scrypted/x-scrypted-image"})(fc||(k.ScryptedMimeTypes=fc={}))});var Ln=S(Nt=>{"use strict";Object.defineProperty(Nt,"__esModule",{value:!0});Nt.SidebandBufferSerializer=Nt.BufferSerializer=void 0;var Ir=class{serialize(r){return console.warn("Using slow buffer serialization. Ensure the peer supports SidebandBufferSerializer."),r.toString("base64")}deserialize(r){return console.warn("Using slow buffer deserialization. Ensure the peer supports SidebandBufferSerializer."),Buffer.from(r,"base64")}};Nt.BufferSerializer=Ir;var Mn=class{bufferSerializer=new Ir;serialize(r,e){if(!e)return this.bufferSerializer.serialize(r);let t=e.buffers=e.buffers||[];return t.push(r),t.length-1}deserialize(r,e){return e?.buffers?e.buffers[r]:this.bufferSerializer.deserialize(r)}};Nt.SidebandBufferSerializer=Mn});var On=S(ue=>{"use strict";Object.defineProperty(ue,"__esModule",{value:!0});ue.propertyInterfaces=ue.allInterfaceProperties=void 0;ue.getPropertyInterfaces=mc;ue.getInterfaceMethods=bc;ue.getInterfaceProperties=gc;ue.isValidInterfaceMethod=Xh;ue.isValidInterfaceProperty=Zh;var Hn=ht();ue.allInterfaceProperties=[].concat(...Object.values(Hn.ScryptedInterfaceDescriptors).map(i=>i.properties));function mc(i){let r={};for(let e of Object.values(i))for(let t of e.properties)r[t]=e.name;return r}ue.propertyInterfaces=mc(Hn.ScryptedInterfaceDescriptors);function bc(i,r){return Object.values(i).filter(e=>r.has(e.name)).map(e=>e.methods).flat()}function gc(i,r){return Object.values(i).filter(e=>r.has(e.name)).map(e=>e.properties).flat()}function Xh(i,r,e){return bc(i,r).includes(e)||i[Hn.ScryptedInterface.ScryptedDevice].methods.includes(e)}function Zh(i,r,e){return gc(i,new Set(r)).includes(e)}});var _c=S(In=>{"use strict";Object.defineProperty(In,"__esModule",{value:!0});In.checkProperty=ef;var Ut=ht(),Qh=ke(),Jh=On();function ef(i,r){if(i===Ut.ScryptedInterfaceProperty.id)throw new Error("id is read only");if(i===Ut.ScryptedInterfaceProperty.nativeId)throw new Error("nativeId is read only");if(i===Ut.ScryptedInterfaceProperty.mixins)throw new Error("mixins is read only");if(i===Ut.ScryptedInterfaceProperty.interfaces)throw new Error("interfaces is a read only post-mixin computed property, use providedInterfaces");if(Qh.RpcPeer.isRpcProxy(r))throw new Error("value must be a primitive type");if(Jh.propertyInterfaces[i.toString()]===Ut.ScryptedInterface.ScryptedDevice&&i!==Ut.ScryptedInterfaceProperty.info)throw new Error(`${i.toString()} can not be set. Use DeviceManager.onDevicesChanges or DeviceManager.onDeviceDiscovered to update the device description.`)}});var vc=S(Ge=>{"use strict";Object.defineProperty(Ge,"__esModule",{value:!0});Ge.StorageImpl=Ge.DeviceManagerImpl=Ge.DeviceStateProxyHandler=void 0;var tf=ke(),rf=_c(),Dn=class{console;nativeId;api;logger;constructor(r,e,t){this.console=t,this.api=r,this.nativeId=e}async ensureLogger(){return this.logger||(this.logger=this.api.getLogger(this.nativeId)),await this.logger}async log(r,e){(await this.ensureLogger()).log(r,e)}a(r){this.log("a",r)}async clear(){(await this.ensureLogger()).clear()}async clearAlert(r){(await this.ensureLogger()).clearAlert(r)}async clearAlerts(){(await this.ensureLogger()).clearAlerts()}d(r){this.log("d",r)}e(r){this.log("e",r)}i(r){this.log("i",r)}v(r){this.log("v",r)}w(r){this.log("w",r)}},gi=class{deviceManager;id;setState;constructor(r,e,t){this.deviceManager=r,this.id=e,this.setState=t}get(r,e,t){return e==="id"?this.id:e===tf.RpcPeer.PROPERTY_PROXY_PROPERTIES?{id:this.id}:e==="setState"?this.setState:this.deviceManager.systemManager.state[this.id][e]?.value}set(r,e,t,s){return(0,rf.checkProperty)(e.toString(),t),this.deviceManager.systemManager.state[this.id][e]={value:t},this.setState(e.toString(),t),!0}};Ge.DeviceStateProxyHandler=gi;var Fn=class{systemManager;getDeviceConsole;getMixinConsole;api;nativeIds=new Map;deviceStorage=new Map;mixinStorage=new Map;constructor(r,e,t){this.systemManager=r,this.getDeviceConsole=e,this.getMixinConsole=t}async requestRestart(){return this.api.requestRestart()}getDeviceLogger(r){return new Dn(this.api,r,this.getDeviceConsole?.(r)||console)}getDeviceState(r){let e=new gi(this,this.nativeIds.get(r).id,(t,s)=>this.api.setState(r,t,s));return new Proxy(e,e)}createDeviceState(r,e){let t=new gi(this,r,e);return new Proxy(t,t)}getDeviceStorage(r){let e=this.deviceStorage.get(r);return e||(e=new _i(this,r),this.deviceStorage.set(r,e)),e}getMixinStorage(r,e){let t=this.mixinStorage.get(e);t||(t=new Map,this.mixinStorage.set(e,t));let s=t.get(r);return s||(s=new _i(this,e,`mixin:${r}:`),t.set(r,s)),s}pruneMixinStorage(){for(let r of this.nativeIds.keys()){let e=this.nativeIds.get(r).storage;for(let t of Object.keys(e)){if(!t.startsWith("mixin:"))continue;let[,s]=t.split(":");s&&!this.systemManager.state[s]&&delete e[t]}}}async onMixinEvent(r,e,t,s){return this.api.onMixinEvent(r,e,t,s)}getNativeIds(){return Array.from(this.nativeIds.keys())}async onDeviceDiscovered(r){return this.api.onDeviceDiscovered(r)}async onDeviceRemoved(r){return this.api.onDeviceRemoved(r)}async onDeviceEvent(r,e,t){return this.api.onDeviceEvent(r,e,t)}async onDevicesChanged(r){return this.api.onDevicesChanged(r)}};Ge.DeviceManagerImpl=Fn;function Dr(i){return i===null?"null":i===void 0?"undefined":i.toString()}var _i=class i{deviceManager;nativeId;prefix;api;static allowedMethods=["length","clear","getItem","setItem","key","removeItem"];static indexedHandler={get(r,e){let t=e.toString();if(i.allowedMethods.includes(t)){let s=r[t];return t==="length"?s:s.bind(r)}return r.getItem(Dr(e))},set(r,e,t){return r.setItem(Dr(e),t),!0}};constructor(r,e,t){return this.deviceManager=r,this.nativeId=e,this.prefix=t,this.deviceManager=r,this.api=r.api,this.nativeId=e,this.prefix||(this.prefix=""),new Proxy(this,i.indexedHandler)}get storage(){return this.deviceManager.nativeIds.get(this.nativeId).storage}get length(){return Object.keys(this.storage).filter(r=>r.startsWith(this.prefix)).length}clear(){if(!this.prefix)this.deviceManager.nativeIds.get(this.nativeId).storage={};else{let r=this.storage;Object.keys(this.storage).filter(e=>e.startsWith(this.prefix)).forEach(e=>delete r[e])}this.api.setStorage(this.nativeId,this.storage)}getItem(r){return this.storage[this.prefix+r]}key(r){return this.prefix?Object.keys(this.storage).filter(e=>e.startsWith(this.prefix))[r].substring(this.prefix.length):Object.keys(this.storage)[r]}removeItem(r){delete this.storage[this.prefix+r],this.api.setStorage(this.nativeId,this.storage)}setItem(r,e){r=Dr(r),e=Dr(e),this.storage[this.prefix+r]!==e&&(this.storage[this.prefix+r]=e,this.api.setStorage(this.nativeId,this.storage))}};Ge.StorageImpl=_i});var yc=S(Fr=>{"use strict";Object.defineProperty(Fr,"__esModule",{value:!0});Fr.EndpointManagerImpl=void 0;var qt=ht(),zn=class{deviceManager;api;pluginId;mediaManager;getEndpoint(r){if(!r)return this.pluginId;let e=this.deviceManager.nativeIds.get(r)?.id;if(!e)throw new Error("invalid nativeId "+r);return r?e:this.pluginId}async getUrlSafeIp(){let r=await this.api.getComponent("SCRYPTED_IP_ADDRESS");return r?.includes(":")?`[${r}]`:r}async getAuthenticatedPath(r){return this.getPath(r)}async getInsecurePublicLocalEndpoint(r){return this.getLocalEndpoint(r,{insecure:!0,public:!0})}async getPublicCloudEndpoint(r){return this.getCloudEndpoint(r,{public:!0})}async getPublicLocalEndpoint(r){return this.getLocalEndpoint(r,{public:!0})}async getPublicPushEndpoint(r){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(r)),qt.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,qt.ScryptedMimeTypes.PushEndpoint)}async getPath(r,e){return`/endpoint/${this.getEndpoint(r)}/${e?.public?"public/":""}`}async getLocalEndpoint(r,e){let t=e?.insecure?"http":"https",s=await this.api.getComponent(e?.insecure?"SCRYPTED_INSECURE_PORT":"SCRYPTED_SECURE_PORT"),n=await this.getPath(r,e);return`${t}://${await this.getUrlSafeIp()}:${s}${n}`}async getCloudEndpoint(r,e){let t=await this.getLocalEndpoint(r,e),s=await this.mediaManager.createMediaObject(Buffer.from(t),qt.ScryptedMimeTypes.LocalUrl);return this.mediaManager.convertMediaObjectToUrl(s,qt.ScryptedMimeTypes.LocalUrl)}async getCloudPushEndpoint(r){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(r)),qt.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,qt.ScryptedMimeTypes.PushEndpoint)}async setLocalAddresses(r){return(await this.api.getComponent("addresses")).setLocalAddresses(r)}async getLocalAddresses(){return await(await this.api.getComponent("addresses")).getLocalAddresses()}async setAccessControlAllowOrigin(r){let e=this;return(await this.deviceManager.systemManager.getComponent("setAccessControlAllowOrigin"))(r)}};Fr.EndpointManagerImpl=zn});var xc=S(ft=>{"use strict";Object.defineProperty(ft,"__esModule",{value:!0});ft.WebSocketSerializer=ft.WebSocketConnection=void 0;ft.createWebSocketClass=sf;var jn=ke(),Bn=class{events={};dispatchEvent(r){let e=this.events[r.type];if(e)for(let t of e)t(r)}addEventListener(r,e){let t=this.events[r];t||(t=this.events[r]=[]),t.push(e)}removeEventListener(r,e){let t=this.events[r];if(!t)return;let s=t.indexOf(e);s>-1&&t.splice(s,1)}};function zr(i,r){Object.defineProperty(i,"on"+r,{get:function(){throw new Error(`${r} is write only`)},set:function(e){this.events[r]=[e]}})}function sf(i){class r extends Bn{connection;_url;_protocols;readyState;constructor(t,s){super(),this.connection=t,this._url=t.url,this._protocols=s,this.readyState=0,i(t,{connect:(n,o)=>{if(n!=null){this.dispatchEvent({type:"error",message:n.toString()});return}this.readyState=1,this.dispatchEvent({type:"open"})},end:()=>{this.readyState=3,this.dispatchEvent({type:"close",reason:"closed"})},error:n=>{this.readyState=3,this.dispatchEvent({type:"error",message:n.toString()})},data:n=>{this.dispatchEvent({type:"message",data:n,source:this})}})}send(t){this.connection.send(t)}get url(){return this._url}get extensions(){return""}close(t){this.connection.close(t)}}return zr(r.prototype,"close"),zr(r.prototype,"error"),zr(r.prototype,"message"),zr(r.prototype,"open"),r}var Nn=class{url;websocketMethods;[jn.RpcPeer.PROPERTY_PROXY_PROPERTIES];[jn.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=["send","close"];constructor(r,e){this.url=r,this.websocketMethods=e,this[jn.RpcPeer.PROPERTY_PROXY_PROPERTIES]={url:r}}send(r){return this.websocketMethods.send(r)}close(r){return this.websocketMethods.close(r)}};ft.WebSocketConnection=Nn;var Un=class{WebSocket;serialize(r,e){throw new Error("WebSocketSerializer should only be used for deserialization.")}deserialize(r,e){if(this.WebSocket)return new this.WebSocket(r)}};ft.WebSocketSerializer=Un});var kc=S(mt=>{"use strict";Object.defineProperty(mt,"__esModule",{value:!0});mt.EventRegistry=mt.EventListenerRegisterImpl=void 0;mt.getMixinEventName=wc;var nf=ht(),vi=class{removeListener;constructor(r){this.removeListener=r}};mt.EventListenerRegisterImpl=vi;function wc(i){let{event:r,mixinId:e}=i||{};return!r&&typeof i=="string"&&(r=i),r||(r=void 0),e?`${r}-mixin-${e}`:r}var of=new Set([nf.ScryptedInterface.ScryptedDevice,"Logger"]),qn=class{systemListeners=new Set;listeners={};listen(r){let e=this.systemListeners;return e.add(r),new vi(()=>{e.delete(r),r=void 0})}listenDevice(r,e,t){let s=wc(e),n=`${r}#${s}`,o=this.listeners[n];return o||(o=new Set,this.listeners[n]=o),o.add(t),new vi(()=>{o.delete(t),t=void 0})}notify(r,e,t,s,n,o){let{changed:a,mixinId:l}=o||{};if(s&&!a)return!1;let u={eventId:void 0,eventInterface:t,eventTime:e,property:s,mixinId:l};return this.notifyEventDetails(r,u,n)}notifyEventDetails(r,e,t,s){if(e.eventId||=Math.random().toString(36).substring(2),s||=e.eventInterface,e.property&&!e.mixinId||of.has(s))for(let a of this.systemListeners)a(r,e,t);let n=this.listeners[`${r}#${s}`];if(n)for(let a of n)a(e,t);let o=this.listeners[`${r}#undefined`];if(o)for(let a of o)a(e,t);return!0}};mt.EventRegistry=qn});var Cc=S(jr=>{"use strict";Object.defineProperty(jr,"__esModule",{value:!0});jr.SystemManagerImpl=void 0;var X=ht(),af=kc(),Vn=ke(),bt=On();function lf(i,r){let e=new Wn(i,r);return new Proxy(e,e)}var Wn=class{id;systemManager;customProperties;device;constructor(r,e){this.id=r,this.systemManager=e}toPrimitive(){return`ScryptedDevice-${this.id}`}ownKeys(r){let e=new Set(this.systemManager.state[this.id].interfaces.value),t=(0,bt.getInterfaceMethods)(this.systemManager.descriptors||X.ScryptedInterfaceDescriptors,e),s=(0,bt.getInterfaceProperties)(this.systemManager.descriptors||X.ScryptedInterfaceDescriptors,e);return[...t,...s]}getOwnPropertyDescriptor(r,e){let t=new Set(this.systemManager.state[this.id].interfaces.value),s=(0,bt.getInterfaceMethods)(this.systemManager.descriptors||X.ScryptedInterfaceDescriptors,t),n=e.toString();if(s.includes(n))return{configurable:!0};if((0,bt.getInterfaceProperties)(this.systemManager.descriptors||X.ScryptedInterfaceDescriptors,t).includes(n))return{configurable:!0,value:this.systemManager.state[this.id][n]?.value}}deleteProperty(r,e){let t=e.toString();return Object.keys(X.ScryptedInterfaceProperty).includes(t)?!1:(this.customProperties||=new Map,this.customProperties.set(e,void 0),!0)}set(r,e,t,s){let n=e.toString();return Object.keys(X.ScryptedInterfaceProperty).includes(n)?!1:(this.customProperties||=new Map,this.customProperties.set(e,t),!0)}get(r,e,t){if(e==="id")return this.id;if(this.customProperties?.has(e))return this.customProperties.get(e);let s=Vn.RpcPeer.handleFunctionInvocations(this,r,e,t);if(s)return s;let n=new Set(this.systemManager.state[this.id].interfaces?.value||[]),o=e.toString();if(this.systemManager.propertyInterfaces?.[o]||bt.propertyInterfaces[o])return this.systemManager.state[this.id]?.[e]?.value;if((0,bt.isValidInterfaceMethod)(this.systemManager.descriptors||X.ScryptedInterfaceDescriptors,n,o))return X.ScryptedInterfaceDescriptors[X.ScryptedInterface.ScryptedDevice].methods.includes(o)?this[e].bind(this):new Proxy(()=>e,this)}ensureDevice(){return this.device||(this.device=this.systemManager.api.getDeviceById(this.id)),this.device}async apply(r,e,t){let s=r();return(await this.ensureDevice())[s](...t)}listen(r,e){return this.systemManager.listenDevice(this.id,r,e)}async setName(r){return this.systemManager.api.setDeviceProperty(this.id,X.ScryptedInterfaceProperty.name,r)}async setRoom(r){return this.systemManager.api.setDeviceProperty(this.id,X.ScryptedInterfaceProperty.room,r)}async setType(r){return this.systemManager.api.setDeviceProperty(this.id,X.ScryptedInterfaceProperty.type,r)}async setMixins(r){await(await this.systemManager.getComponent("plugins")).setMixins(this.id,r)}async probe(){return this.apply(()=>"probe",void 0,[])}},Kn=class{promise;constructor(r){this.promise=r}async removeListener(){try{let r=await this.promise;this.promise=void 0,r?.removeListener()}catch(r){console.error("removeListener",r)}}};function Sc(i){let r=i,e=r[Vn.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]||[];return e.includes(null)||e.push(null),r[Vn.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=e,i}var Gn=class{api;state;deviceProxies={};log;events=new af.EventRegistry;typesVersion;descriptors;propertyInterfaces;getDeviceState(r){return this.state[r]}getSystemState(){return this.state}getDeviceById(r,e){let t;if(this.state[r]){if(e!=null)return;t=r}else for(let n of Object.keys(this.state)){let o=this.state[n];if(o&&o[X.ScryptedInterfaceProperty.pluginId]?.value===r&&o[X.ScryptedInterfaceProperty.nativeId]?.value==e){t=n;break}}if(!t)return;let s=this.deviceProxies[t];return s||(s=this.deviceProxies[t]=lf(t,this)),s}getDeviceByName(r){for(let e of Object.keys(this.state)){let t=this.state[e];if(t.interfaces?.value?.includes(X.ScryptedInterface.ScryptedPlugin)&&t.pluginId?.value===r)return this.getDeviceById(e);if(t.name.value===r)return this.getDeviceById(e)}}listen(r){return this.events.listen(Sc((e,t,s)=>r(this.getDeviceById(e),t,s)))}listenDevice(r,e,t){let{watch:s}=e||{};return s?this.events.listenDevice(r,e,(n,o)=>t(this.getDeviceById(r),n,o)):new Kn(this.api.listenDevice(r,e,Sc((n,o)=>t(this.getDeviceById(r),n,o))))}async removeDevice(r){return this.api.removeDevice(r)}getComponent(r){return this.api.getComponent(r)}setScryptedInterfaceDescriptors(r,e){return this.typesVersion=r,this.descriptors=e,this.propertyInterfaces=(0,bt.getPropertyInterfaces)(e),this.api.setScryptedInterfaceDescriptors(r,e)}};jr.SystemManagerImpl=Gn});var $c=S(Br=>{"use strict";Object.defineProperty(Br,"__esModule",{value:!0});Br.ClusterManagerImpl=void 0;var Yn=class{clusterMode;api;clusterWorkerId;clusterServicePromise;constructor(r,e,t){this.clusterMode=r,this.api=e,this.clusterWorkerId=t}getClusterWorkerId(){return this.clusterWorkerId}getClusterAddress(){return process.env.SCRYPTED_CLUSTER_ADDRESS}getClusterMode(){return this.clusterMode}async getClusterWorkers(){return(await this.getClusterService()).getClusterWorkers()}getClusterService(){return this.clusterServicePromise||=this.api.getComponent("cluster-fork"),this.clusterServicePromise}};Br.ClusterManagerImpl=Yn});var Pc=S(Nr=>{"use strict";Object.defineProperty(Nr,"__esModule",{value:!0});Nr.setupPluginRemote=uf;Nr.attachPluginRemote=hf;var Vt=ht(),Zn=ke(),Tc=Ln(),Ec=vc(),cf=yc(),Xn=xc(),df=Cc(),pf=$c();async function uf(i,r,e,t,s){try{i.constructorSerializerMap.get(Buffer)||i.addSerializer(Buffer,"Buffer",new Tc.BufferSerializer);let o=await(await i.getParam("getRemote"))(r,e,t),a=i.tags.acl,l=(h,d)=>{if(d=d||s()[h],a&&d){d=Object.assign({},d);for(let m of Object.keys(d))a.shouldRejectProperty(h,m)&&delete d[m];let f=d.interfaces?.value;f&&(f=f.filter(m=>!a.shouldRejectInterface(h,m)),d.interfaces={value:f})}return d},u=()=>{let h=s();if(a){h=Object.assign({},h);for(let d of Object.keys(h)){if(a.shouldRejectDevice(d)){delete h[d];continue}h[d]=l(d,h[d])}}return h};return await o.setSystemState(u()),r.listen((h,d,f)=>{if(!a?.shouldRejectEvent(d.property===Vt.ScryptedInterfaceProperty.id?f:h,d)){if(d.eventInterface===Vt.ScryptedInterface.ScryptedDevice){d.property===Vt.ScryptedInterfaceProperty.id?o.updateDeviceState(f,void 0):o.updateDeviceState(h,l(h));return}d.property&&!d.mixinId?o.notify(h,d,s()[h]?.[d.property]).catch(()=>{}):o.notify(h,d,f).catch(()=>{})}}),o}catch(n){throw new Zn.RPCResultError(i,"error while retrieving PluginRemote",n)}}function hf(i,r){let{createMediaManager:e,getServicePort:t,getDeviceConsole:s,getMixinConsole:n}=r||{};i.constructorSerializerMap.get(Buffer)||i.addSerializer(Buffer,"Buffer",new Tc.BufferSerializer);let o={},a=new Xn.WebSocketSerializer;i.addSerializer(Xn.WebSocketConnection,"WebSocketConnection",a);let l,u=new Promise(h=>l=h);return i.params.getRemote=async(h,d,f)=>{a.WebSocket=(0,Xn.createWebSocketClass)((x,E)=>{let{url:H}=x;if(H.startsWith("io://")||H.startsWith("ws://")){let B=H.substring(5);o[B]=E,E.connect(void 0,{close:j=>x.close(j),send:j=>x.send(j)})}else throw new Error("unsupported websocket")}),h=await r?.onGetRemote?.(h,d)||h;let m=new df.SystemManagerImpl,b=new Ec.DeviceManagerImpl(m,s,n),_=new cf.EndpointManagerImpl,g=new pf.ClusterManagerImpl(void 0,h,void 0),C=await h.getMediaManager();C||(i.params.createMediaManager=async()=>e(m,b));let R=C||await e(m,b);i.params.mediaManager=R,m.api=h,b.api=h;let z=b.getDeviceLogger(void 0);m.log=z;let M={systemManager:m,deviceManager:b,endpointManager:_,mediaManager:R,clusterManager:g,log:z,pluginHostAPI:h,pluginRemoteAPI:void 0,serverVersion:f?.serverVersion,connect:void 0,fork:void 0,connectRPCObject:void 0};delete i.params.getRemote,_.api=h,_.deviceManager=b,_.mediaManager=R,_.pluginId=d;let V=new Ec.StorageImpl(b,void 0),K={[Zn.RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION]:!0,[Zn.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]:["notify","updateDeviceState","setSystemState","ioEvent","setNativeId"],getServicePort:t,async createDeviceState(x,E){return b.createDeviceState(x,E)},async ioEvent(x,E,H){let B=o[x];if(B)switch(E){case"message":B.data(H);break;case"close":B.end(),delete o[x];break}},async setNativeId(x,E,H){x===null&&(x=void 0),E?b.nativeIds.set(x?.toString(),{id:E,storage:H}):b.nativeIds.delete(x)},async updateDeviceState(x,E){E?(m.state[x]=E,m.events.notify(x,void 0,Vt.ScryptedInterface.ScryptedDevice,void 0,E,{changed:!0})):(delete m.state[x],m.events.notify(void 0,void 0,Vt.ScryptedInterface.ScryptedDevice,Vt.ScryptedInterfaceProperty.id,x,{changed:!0}))},async notify(x,E,H,B,j,xt){if(typeof E=="number"){let se=E,ne=H;if(B){let oe=m.state?.[x];if(!oe){z.w(`state not found for ${x}`);return}oe[B]=j,m.events.notify(x,se,ne,B,j.value,{changed:xt})}else m.events.notify(x,se,ne,B,j,{changed:xt})}else{let se=E,ne=H;if(se.property&&!se.mixinId){let oe=m.state?.[x];if(!oe){z.w(`state not found for ${x}`);return}oe[se.property]=ne,m.events.notifyEventDetails(x,se,ne.value)}else m.events.notifyEventDetails(x,se,ne)}},async setSystemState(x){m.state=x,b.pruneMixinStorage(),l(M)},async loadZip(x,E,H){let B={__filename:void 0,deviceManager:b,systemManager:m,mediaManager:R,endpointManager:_,localStorage:V,pluginHostAPI:h,WebSocket:function(j){if(typeof j=="string")throw new Error("unsupported websocket");return j},pluginRuntimeAPI:M};B.pluginRuntimeAPI=M;try{return await r.onLoadZip(M,B,x,E,H)}catch(j){throw console.error("plugin start/fork failed",j),j}}};return M.pluginRemoteAPI=K,K},u}});var Jn=S(Wt=>{"use strict";Object.defineProperty(Wt,"__esModule",{value:!0});Wt.createDuplexRpcPeer=bf;Wt.createRpcSerializer=Ac;Wt.createRpcDuplexSerializer=Qn;Wt.createDataChannelSerializer=gf;var ff=Ln(),mf=ke();function bf(i,r,e,t){let s=Qn(t),n=new mf.RpcPeer(i,r,(o,a,l)=>{try{s.sendMessage(o,a,l)}catch(u){a?.(u),e.destroy()}});return s.setupRpcPeer(n),e.on("data",o=>s.onData(o)),e.on("close",s.onDisconnected),e.on("error",s.onDisconnected),n}function Ac(i){let r,{sendMessageBuffer:e,sendMessageFinish:t}=i,s=!0,n=()=>{s=!1,r.kill("connection closed.")},o=(f,m,b)=>{if(!s){m?.(new Error("peer disconnected"));return}let _=b?.buffers;if(_)for(let g of _)e(g);t(f)},a;return{kill:f=>{r.kill(f)},sendMessage:o,setupRpcPeer:f=>{r=f,r.addSerializer(Buffer,"Buffer",new ff.SidebandBufferSerializer),r.constructorSerializerMap.set(Uint8Array,"Buffer")},onMessageBuffer:f=>{a=a||{},a.buffers||=[],a.buffers.push(f)},onMessageFinish:f=>{let m=a;a=void 0,r.handleMessage(f,m)},onDisconnected:n}}function Qn(i){let r=(d,f)=>{let m=Buffer.alloc(5);m.writeUInt32BE(f.length+1,0),m.writeUInt8(d,4),i.write(Buffer.concat([m,f]))},e=d=>f=>r(d,f),t=e(1),s=e(0),n=Ac({sendMessageBuffer:t,sendMessageFinish:d=>s(Buffer.from(JSON.stringify(d)))}),o,a,l,u;return{onData:d=>{for(;d.length;){if(!a){if(o?o=Buffer.concat([o,d]):o=d,o.length<5)return;d=o.slice(5);let b=o.readUInt32BE(0)-1;u=o.readUInt8(4),d.length>=b&&u===0?(a=d.length===b?d:d.slice(0,b),l=b,d=d.slice(b)):(a=Buffer.alloc(b),l=0),o=void 0}let f=a.length-l;if(f){let b=d.slice(0,f);d=d.slice(f),a.set(b,l),l+=b.length}if(l!==a.length)return;let m=a;if(a=void 0,u===0)try{let b=JSON.parse(m.toString());n.onMessageFinish(b)}catch(b){n.kill("message parse failure "+b.message)}else n.onMessageBuffer(m)}},setupRpcPeer:n.setupRpcPeer,sendMessage:n.sendMessage,onDisconnected:n.onDisconnected}}function gf(i){let r;function t(){if(!r||r.length===0)return;let a=r;r=void 0;for(let l of a){let u=0;for(;u<l.length;){let h=l.length-u,d=Math.min(h,16384),f=l.subarray(u,u+d);i.send(f),u+=d}}}function s(a){let l=!!r;r||(r=[]),r.push(a),l||setTimeout(()=>t(),0)}return Qn({write:a=>{s(a)}})}});var Rc=S((nv,_f)=>{_f.exports={name:"@scrypted/client",version:"1.3.26",description:"",main:"dist/packages/client/src/index.js",scripts:{prebuild:"rimraf dist",build:"tsc --outDir dist",prepublishOnly:"npm run build",test:'echo "Error: no test specified" && exit 1'},author:"",license:"ISC",devDependencies:{"@types/ip":"^1.1.3","@types/node":"^24.0.10","@types/ws":"^8.18.1","ts-node":"^10.9.2",typescript:"^5.8.3"},peerDependencies:{"@scrypted/types":"^0.5.44"},dependencies:{"engine.io-client":"^6.6.3","follow-redirects":"^1.15.9",rimraf:"^6.0.1"}}});var Hc=S(yi=>{"use strict";Object.defineProperty(yi,"__esModule",{value:!0});yi.isIPV4Address=Mc;yi.isIPV6Address=Lc;yi.isIPAddress=xf;var vf=/^(\d{1,3}\.){3,3}\d{1,3}$/,yf=/^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;function Mc(i){return vf.test(i)}function Lc(i){return yf.test(i)}function xf(i){return Mc(i)||Lc(i)}});var eo=S(J=>{"use strict";Object.defineProperty(J,"__esModule",{value:!0});J.fetchStatusCodeOk=Oc;J.checkStatus=Ic;J.getFetchMethod=Dc;J.getHttpFetchAccept=Fc;J.hasHeader=Ur;J.removeHeader=zc;J.setHeader=qr;J.setDefaultHttpFetchAccept=jc;J.createHeadersArray=Bc;J.createStringOrBufferBody=Nc;J.domFetchParseIncomingMessage=Uc;J.domFetch=wf;function Oc(i){return i>=200&&i<=299}function Ic(i){if(!Oc(i))throw new Error(`http response statusCode ${i}`);return!0}function Dc(i){return i.method||(i.body?"POST":"GET")}function Fc(i){switch(i){case"json":return"application/json";case"text":return"text/plain"}}function Ur(i,r){return r=r.toLowerCase(),i.find(([e])=>e.toLowerCase()===r)}function zc(i,r){r=r.toLowerCase();let e=i.filter(([t,s])=>t.toLowerCase()!==r);i.length=0,e.forEach(t=>i.push(t))}function qr(i,r,e){zc(i,r),i.push([r,e])}function jc(i,r){if(Ur(i,"Accept"))return;let e=Fc(r);e&&qr(i,"Accept",e)}function Bc(i){let r=[];if(!i)return r;if(i instanceof Headers){for(let[e,t]of i.entries())r.push([e,t]);return r}if(i instanceof Array){for(let[e,t]of i)r.push([e,t]);return r}for(let e of Object.keys(i)){let t=i[e];r.push([e,t])}return r}function Nc(i,r){let e;return typeof r=="object"?(r=JSON.stringify(r),e="application/json"):typeof r=="string"&&(e="text/plain"),e&&!Ur(i,"Content-Type")&&qr(i,"Content-Type",e),Ur(i,"Content-Length")||(r=Buffer.from(r),qr(i,"Content-Length",r.length.toString())),r}async function Uc(i,r){switch(r){case"json":return i.json();case"text":return i.text();case"readable":return i}return new Uint8Array(await i.arrayBuffer())}async function wf(i){let r=Bc(i.headers);jc(r,i.responseType);let{body:e}=i;e&&!(e instanceof ReadableStream)&&(e=Nc(r,e));let t,s;i.timeout&&(t=new AbortController,s=setTimeout(()=>t.abort(),i.timeout),i.signal?.addEventListener("abort",()=>t.abort(i.signal?.reason)));try{let{url:n}=i,o=await fetch(n,{method:Dc(i),credentials:i.withCredentials?"include":void 0,headers:r,signal:t?.signal||i.signal,body:e});if(i?.checkStatusCode===void 0||i?.checkStatusCode)try{if(!(typeof i?.checkStatusCode=="function"?i.checkStatusCode:Ic)(o.status))throw new Error(`http response statusCode ${o.status}`)}catch(a){throw o.arrayBuffer().catch(()=>{}),a}return{statusCode:o.status,headers:o.headers,body:await Uc(o,i.responseType)}}finally{clearTimeout(s)}}});var gt={};tp(gt,{default:()=>kf});var kf,_t=ep(()=>{"use strict";kf={}});var Wc=S(wi=>{"use strict";Object.defineProperty(wi,"__esModule",{value:!0});wi.getHttpFetchParser=qc;wi.httpFetchParseIncomingMessage=Vc;wi.httpFetch=Tf;var xi=eo();async function Vr(i){let r=[];i.on("data",t=>r.push(t));let{once:e}=(_t(),St(gt));return await e(i,"end"),Buffer.concat(r)}var Sf={async parse(i){return(await Vr(i)).toString()}},Cf={async parse(i){return JSON.parse((await Vr(i)).toString())}},$f={async parse(i){return Vr(i)}},Ef={async parse(i){return i}};function qc(i){switch(i){case"json":return Cf;case"text":return Sf;case"readable":return Ef}return $f}function Vc(i,r){return qc(r).parse(i)}async function Tf(i){let r=(0,xi.createHeadersArray)(i.headers);(0,xi.setDefaultHttpFetchAccept)(r,i.responseType);let{once:e}=(_t(),St(gt)),{PassThrough:t,Readable:s}=(_t(),St(gt)),{http:n,https:o}=(_t(),St(gt)),{url:a}=i,u=a.toString().startsWith("https:")?o:n,{body:h}=i;if(h&&!(h instanceof s)){let g=new t;g.write(Buffer.from((0,xi.createStringOrBufferBody)(r,h))),g.end(),h=g}let d,f;i.timeout&&(d=new AbortController,f=setTimeout(()=>d.abort(),i.timeout),i.signal?.addEventListener("abort",()=>d.abort(i.signal?.reason)));let m=d?.signal||i.signal;m?.addEventListener("abort",()=>_.destroy(new Error(i.signal?.reason||"abort")));let b={};for(let[g,C]of r)b[g]?b[g].push(C):b[g]=[C];let _=u.request(a,{method:(0,xi.getFetchMethod)(i),rejectUnauthorized:i.rejectUnauthorized,family:i.family,headers:b,signal:m,timeout:i.timeout});h?h.pipe(_):_.end();try{let[g]=await e(_,"response");if(i?.checkStatusCode===void 0||i?.checkStatusCode)try{let R=typeof i?.checkStatusCode=="function"?i.checkStatusCode:xi.checkStatus;if(!g.statusCode||!R(g.statusCode))throw new Error(`http response statusCode ${g.statusCode}`)}catch(R){throw Vr(g).catch(()=>{}),R}let C=new Headers;for(let[R,z]of Object.entries(g.headers))for(let M of typeof z=="string"?[z]:z)C.append(R,M);return{statusCode:g.statusCode,headers:C,body:await Vc(g,i.responseType)}}finally{clearTimeout(f)}}});var Xc=S(F=>{"use strict";var Pf=F&&F.__createBinding||(Object.create?function(i,r,e,t){t===void 0&&(t=e);var s=Object.getOwnPropertyDescriptor(r,e);(!s||("get"in s?!r.__esModule:s.writable||s.configurable))&&(s={enumerable:!0,get:function(){return r[e]}}),Object.defineProperty(i,t,s)}:function(i,r,e,t){t===void 0&&(t=e),i[t]=r[e]}),Af=F&&F.__setModuleDefault||(Object.create?function(i,r){Object.defineProperty(i,"default",{enumerable:!0,value:r})}:function(i,r){i.default=r}),no=F&&F.__importStar||function(){var i=function(r){return i=Object.getOwnPropertyNames||function(e){var t=[];for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[t.length]=s);return t},i(r)};return function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var t=i(r),s=0;s<t.length;s++)t[s]!=="default"&&Pf(e,r,t[s]);return Af(e,r),e}}(),Rf=F&&F.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(F,"__esModule",{value:!0});F.ScryptedClientLoginError=F.rpc_serializer=F.rpc=void 0;F.logoutScryptedClient=Bf;F.getCurrentBaseUrl=Nf;F.loginScryptedClient=Yc;F.checkScryptedClientLogin=so;F.redirectScryptedLogin=Uf;F.combineBaseUrl=Ci;F.redirectScryptedLogout=qf;F.connectScryptedClient=Vf;var to=no(Kl()),Mf=Gl(),Lf=Xl(),Hf=Pc(),ro=ke(),Kc=Jn(),Of=Rf(Rc()),If=Hc(),Df=eo(),Ff=Wc();F.rpc=no(ke());F.rpc_serializer=no(Jn());var ki;try{throw new Error}catch{ki=Df.domFetch}var zf=ro.RpcPeer.generateId();function io(i,r){return new Promise((e,t)=>{let s=a=>{o(),t(a)},n=(...a)=>{o(),e(a)},o=()=>{i.removeListener("error",s),i.removeListener(r,n)};i.once("error",s),i.once(r,n)})}function Gc(){return globalThis.navigator?.userAgent.includes("InstalledApp")}function jf(){return globalThis.matchMedia?.("(display-mode: standalone)").matches||Gc()}async function Bf(i){let r=Ci(i,"logout");return(await ki({url:r,withCredentials:!0,responseType:"json",rejectUnauthorized:!1})).body}function Nf(){let i=new URL(window.location.href);i.search="",i.hash="";let e=window.location.pathname.split("/"),t=e.findIndex(n=>n==="endpoint");if(t===-1)return;let s=e.slice(0,t);return s.push(""),i.pathname=s.join("/"),i.toString()}async function Yc(i){let{baseUrl:r,username:e,password:t,change_password:s,maxAge:n}=i;!n&&jf()&&(n=365*24*60*60*1e3);let o=Ci(r,"login"),a=await ki({url:o,body:{username:e,password:t,change_password:s,maxAge:n},rejectUnauthorized:!1,withCredentials:!0,responseType:"json"});if(a.statusCode!==200)throw new Error("status "+a.statusCode);let{body:l}=a;return{error:l.error,authorization:l.authorization,queryToken:l.queryToken,token:l.token,addresses:l.addresses,externalAddresses:l.externalAddresses,hostname:l.hostname,scryptedCloud:a.headers.get("x-scrypted-cloud")==="true",directAddress:a.headers.get("x-scrypted-direct-address"),cloudAddress:a.headers.get("x-scrypted-cloud-address"),serverId:a.headers.get("x-scrypted-server-id")}}async function so(i){let{baseUrl:r}=i||{},e=Ci(r,"login"),t=new Headers;if(i?.previousLoginResult?.queryToken){let o=i?.previousLoginResult.username+":"+i.previousLoginResult.token,a=Buffer.from(o).toString("base64");t.set("Authorization",`Basic ${a}`)}let s=await ki({url:e,withCredentials:!0,headers:t,rejectUnauthorized:!1,responseType:"json"}),{body:n}=s;return{baseUrl:r,hostname:n.hostname,redirect:n.redirect,username:n.username,expiration:n.expiration,hasLogin:!!n.hasLogin,error:n.error,authorization:n.authorization,queryToken:n.queryToken,token:n.token,addresses:n.addresses,externalAddresses:n.externalAddresses,scryptedCloud:s.headers.get("x-scrypted-cloud")==="true",directAddress:s.headers.get("x-scrypted-direct-address"),cloudAddress:s.headers.get("x-scrypted-cloud-address"),serverId:s.headers.get("x-scrypted-server-id")}}var Si=class extends Error{result;constructor(r){super(r.error),this.result=r}};F.ScryptedClientLoginError=Si;function Uf(i){let{baseUrl:r,redirect:e}=i||{};if(e=e||"/endpoint/@scrypted/core/public/",r){let s=new URL(e,r);s.searchParams.set("redirect_uri",window.location.href),e=s.toString()}else e=`${e}?redirect_uri=${encodeURIComponent(window.location.href)}`;let t=e;console.log("redirect_uri",t),globalThis.location.href=t}function Ci(i,r){return i?new URL(r,i).toString():"/"+r}async function qf(i){globalThis.location.href=Ci(i,"logout")}async function Vf(i){let r=Date.now(),{baseUrl:e,pluginId:t,clientName:s,username:n,password:o}=i,a,l,u,h,d,f,m,b,_,g;console.log("@scrypted/client",Of.default.version);let C={},z=!globalThis.navigator?.userAgent.includes("Chrome")||Gc(),M=!1;if(n&&o){let $=await Yc(i);$.authorization&&(C.Authorization=$.authorization),u=$.addresses,h=$.externalAddresses,d=$.scryptedCloud,f=$.directAddress,m=$.cloudAddress,a=$.authorization,l=$.queryToken,_=$.token,b=$.hostname,g=$.serverId,console.log("login result",Date.now()-r,$)}else{let ee=function(U){if(U.error||U.redirect)throw new Si(U);if(!U.authorization||!U.username||!U.queryToken)throw console.error(U),new Error("malformed login result");return U},$=new Set;if(i?.previousLoginResult?.token){for(let U of[...i?.previousLoginResult?.localAddresses||[],i?.previousLoginResult?.directAddress])U&&(z||i.direct)&&$.add(U);for(let U of[...i?.previousLoginResult?.externalAddresses||[],i?.previousLoginResult?.cloudAddress])U&&$.add(U)}let fe=[...$].map(U=>so({baseUrl:U,previousLoginResult:i?.previousLoginResult}).then(ee)),Ri=so({baseUrl:e,previousLoginResult:i?.previousLoginResult}).then(ee);fe.push(Ri);let N;try{N=await Promise.any(fe),M||=N.baseUrl!==e}catch{N=await Ri}if(M&&console.log("Found direct login. Allowing alternate addresses."),N.error||N.redirect)throw new Si(N);u=N.addresses,h=N.externalAddresses,d=N.scryptedCloud,f=N.directAddress,m=N.cloudAddress,n=N.username,a=N.authorization,l=N.queryToken,_=N.token,b=N.hostname,g=N.serverId,console.log("login checked",Date.now()-r,N)}let V,K=`endpoint/${t}/engine.io/api`,x=e?new URL(K,e).pathname:"/"+K,E=Math.random().toString(36).substring(3,10),H={path:x,query:{cacheBust:E},withCredentials:!0,extraHeaders:C,rejectUnauthorized:!1,transports:i?.transports},B=e||`${globalThis.location.protocol}//${globalThis.location.host}`,j=[],xt=z;M||=d,(M&&i.local===void 0&&xt||i.local)&&u&&j.push(...u);let se=f&&(z||!(0,If.isIPAddress)(f));if((M&&i.direct===void 0&&se||i.direct)&&f&&j.push(f),M&&i.direct===void 0||i.direct){m&&j.push(m);for(let $ of h||[])j.push($)}let ne=!!j.length;console.log({tryLocalAddressess:ne});let oe={...H,extraHeaders:{...H.extraHeaders}};oe.extraHeaders.Authorization||=a;let Gt=[],Pi=[];if(ne)for(let $ of new Set(j)){console.log("trying",$);let ee=new to.Socket($,oe);Gt.push(ee),Pi.push((async()=>(await io(ee,"open"),{connectionType:"http-direct",ready:ee,address:$}))())}let Fd=[...Pi];Pi.push((async()=>{let $=ne?1e3:0;if(console.log("waiting",$),$)try{let fe=Promise.any(Fd);await(0,Mf.timeoutPromise)($,fe),console.log("found direct connection, aborting scrypted cloud connection");return}catch{}let ee=new to.Socket(B,H);return Gt.push(ee),await io(ee,"open"),{ready:ee,address:B,connectionType:d?"http-cloud":"http"}})());let zd=Promise.any(Pi),{ready:Lo,connectionType:Ho,address:Ai,rpcPeer:Oe}=await zd;console.log("connected",Ho,Ai),V=Lo,Gt=Gt.filter($=>$!==Lo),Gt.forEach($=>{try{$.close()}catch{}});try{if(!Oe){let O=(0,Kc.createRpcSerializer)({sendMessageBuffer:I=>V.send(I),sendMessageFinish:I=>V.send(JSON.stringify(I))});Oe=new ro.RpcPeer(s||"engine.io-client","api",(I,G,me)=>{try{O.sendMessage(I,G,me)}catch(Li){G?.(Li)}}),V.on("message",I=>{I.constructor===Buffer||I.constructor===ArrayBuffer?O.onMessageBuffer(Buffer.from(I)):O.onMessageFinish(JSON.parse(I))}),O.setupRpcPeer(Oe)}let $=await(0,Hf.attachPluginRemote)(Oe,void 0),{serverVersion:ee,systemManager:fe,deviceManager:Ri,endpointManager:N,mediaManager:U,clusterManager:jd}=$;console.log("api attached",Date.now()-r),U.createMediaObject=async(O,I,G)=>new Lf.MediaObject(I,O,G);let[Bd]=await Promise.all([(async()=>{try{return!!await fe.getComponent("info")}catch{}return!1})()]);console.log("api initialized",Date.now()-r);let Nd=Object.keys(fe.getSystemState()).map(O=>fe.getDeviceById(O)).find(O=>O.pluginId==="@scrypted/core"&&O.nativeId===`user:${n}`),Mi=new Map,Ud=new FinalizationRegistry(O=>{O.kill("object finalized")}),qd=(O,I)=>{if(!I?.dedicatedTransport){let me=Mi.get(O.port);if(me)return me}let G=(async()=>{let me="engine.io/connectRPCObject",Hi={path:new URL(me,Ai).pathname,query:{cacheBust:E,clusterObject:JSON.stringify(O),...l},withCredentials:!0,extraHeaders:C,rejectUnauthorized:!1,transports:i?.transports},Se=new to.Socket(Ai,Hi),wt=!1,Ie,ae,be,Io=()=>{Ie&&(clearTimeout(Ie),Ie=void 0),ae&&(clearTimeout(ae),ae=void 0)},Do=I?.dedicatedTransport?.receiveTimeout?()=>{Ie&&clearTimeout(Ie),Ie=setTimeout(()=>{be&&be.kill("receive timeout")},I.dedicatedTransport.receiveTimeout)}:void 0,ps=I?.dedicatedTransport?.sendTimeout?()=>{ae&&clearTimeout(ae),ae=setTimeout(()=>{be&&be.kill("send timeout")},I.dedicatedTransport.sendTimeout)}:void 0;Se.on("close",()=>{if(be?.kill("socket closed"),I?.dedicatedTransport||Mi.delete(O.port),!wt)throw new Error("peer disconnected before setup completed")});try{await io(Se,"open");let kt=(0,Kc.createRpcDuplexSerializer)({write:Yt=>{ps?.(),Se.send(Yt)}});return Se.on("message",Yt=>{Do?.(),kt.onData(Buffer.from(Yt))}),be=new ro.RpcPeer(s||"engine.io-client","cluster-proxy",(Yt,Fo,Kd)=>{try{ps?.(),kt.sendMessage(Yt,Fo,Kd)}catch(Gd){Fo?.(Gd)}}),be.killedSafe.finally(()=>{Io(),Se.close()}),kt.setupRpcPeer(be),be.tags.localPort=zf,wt=!0,Do?.(),ps?.(),be}catch(kt){throw Io(),console.error("failure ipc connect",kt),Se.close(),kt}})();return I?.dedicatedTransport||Mi.set(O.port,G),G},Vd=async(O,I)=>{let G=await Mi.get(I);return G?.remoteWeakProxies?Object.values(G.remoteWeakProxies).find(me=>me.deref()?.__cluster?.proxyId==O)?.deref():null},Wd=async(O,I)=>{let G=O?.__cluster;if(!G)return O;let{port:me,proxyId:Li}=G,Hi=await Vd(Li,me);if(Hi)return Hi;try{let wt=await qd(G,I),Ie=await wt.getParam("connectRPCObject");try{let ae=await Ie(G);if(!ae)throw new Error("ipc object not found?");return I?.dedicatedTransport&&Ud.register(ae,wt),ae}catch(ae){throw I?.dedicatedTransport&&wt.kill("connectRPCObject failed"),ae}}catch(Se){return console.error("failure ipc",Se),O}},Oo={userId:Nd?.id,serverVersion:ee,username:n,pluginRemoteAPI:void 0,address:Ai,connectionType:Ho,admin:Bd,systemManager:fe,clusterManager:jd,deviceManager:Ri,endpointManager:N,mediaManager:U,disconnect(){Oe.kill("disconnect requested")},pluginHostAPI:void 0,rpcPeer:Oe,loginResult:{username:n,token:_,directAddress:f,localAddresses:u,externalAddresses:h,scryptedCloud:d,queryToken:l,authorization:a,cloudAddress:m,hostname:b,serverId:g},connectRPCObject:Wd,fork:void 0,connect:void 0};return V.on("close",()=>{Oe.kill("socket closed")}),Oe.killed.finally(()=>{V.close(),Oo.onClose?.()}),Oo}catch($){throw V.close(),$}}});var Ii=globalThis,Di=Ii.ShadowRoot&&(Ii.ShadyCSS===void 0||Ii.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,us=Symbol(),jo=new WeakMap,Xt=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==us)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(Di&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=jo.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&jo.set(e,r))}return r}toString(){return this.cssText}},le=i=>new Xt(typeof i=="string"?i:i+"",void 0,us),w=(i,...r)=>{let e=i.length===1?i[0]:r.reduce((t,s,n)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new Xt(e,i,us)},Bo=(i,r)=>{if(Di)i.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),s=Ii.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,i.appendChild(t)}},hs=Di?i=>i:i=>i instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return le(e)})(i):i;var{is:rp,defineProperty:sp,getOwnPropertyDescriptor:np,getOwnPropertyNames:op,getOwnPropertySymbols:ap,getPrototypeOf:lp}=Object,Fi=globalThis,No=Fi.trustedTypes,cp=No?No.emptyScript:"",dp=Fi.reactiveElementPolyfillSupport,Zt=(i,r)=>i,fs={toAttribute(i,r){switch(r){case Boolean:i=i?cp:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,r){let e=i;switch(r){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},qo=(i,r)=>!rp(i,r),Uo={attribute:!0,type:String,converter:fs,reflect:!1,useDefault:!1,hasChanged:qo};Symbol.metadata??=Symbol("metadata"),Fi.litPropertyMetadata??=new WeakMap;var Ce=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=Uo){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(r,t,e);s!==void 0&&sp(this.prototype,r,s)}}static getPropertyDescriptor(r,e,t){let{get:s,set:n}=np(this.prototype,r)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let a=s?.call(this);n?.call(this,o),this.requestUpdate(r,a,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Uo}static _$Ei(){if(this.hasOwnProperty(Zt("elementProperties")))return;let r=lp(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(Zt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Zt("properties"))){let e=this.properties,t=[...op(e),...ap(e)];for(let s of t)this.createProperty(s,e[s])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let s of t)e.unshift(hs(s))}else r!==void 0&&e.push(hs(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Bo(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),s=this.constructor._$Eu(r,t);if(s!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:fs).toAttribute(e,t.type);this._$Em=r,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(r,e){let t=this.constructor,s=t._$Eh.get(r);if(s!==void 0&&this._$Em!==s){let n=t.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:fs;this._$Em=s;let a=o.fromAttribute(e,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(r,e,t,s=!1,n){if(r!==void 0){let o=this.constructor;if(s===!1&&(n=this[r]),t??=o.getPropertyOptions(r),!((t.hasChanged??qo)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:s,wrapped:n},o){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??e??this[r]),n!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),s===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,n]of t){let{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};Ce.elementStyles=[],Ce.shadowRootOptions={mode:"open"},Ce[Zt("elementProperties")]=new Map,Ce[Zt("finalized")]=new Map,dp?.({ReactiveElement:Ce}),(Fi.reactiveElementVersions??=[]).push("2.1.2");var bs=globalThis,Vo=i=>i,zi=bs.trustedTypes,Wo=zi?zi.createPolicy("lit-html",{createHTML:i=>i}):void 0,gs="$lit$",$e=`lit$${Math.random().toFixed(9).slice(2)}$`,_s="?"+$e,pp=`<${_s}>`,Qe=document,Jt=()=>Qe.createComment(""),ei=i=>i===null||typeof i!="object"&&typeof i!="function",vs=Array.isArray,Qo=i=>vs(i)||typeof i?.[Symbol.iterator]=="function",ms=`[ 	
\f\r]`,Qt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ko=/-->/g,Go=/>/g,Xe=RegExp(`>|${ms}(?:([^\\s"'>=/]+)(${ms}*=${ms}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yo=/'/g,Xo=/"/g,Jo=/^(?:script|style|textarea|title)$/i,ys=i=>(r,...e)=>({_$litType$:i,strings:r,values:e}),c=ys(1),D=ys(2),Zm=ys(3),Je=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Zo=new WeakMap,Ze=Qe.createTreeWalker(Qe,129);function ea(i,r){if(!vs(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Wo!==void 0?Wo.createHTML(r):r}var ta=(i,r)=>{let e=i.length-1,t=[],s,n=r===2?"<svg>":r===3?"<math>":"",o=Qt;for(let a=0;a<e;a++){let l=i[a],u,h,d=-1,f=0;for(;f<l.length&&(o.lastIndex=f,h=o.exec(l),h!==null);)f=o.lastIndex,o===Qt?h[1]==="!--"?o=Ko:h[1]!==void 0?o=Go:h[2]!==void 0?(Jo.test(h[2])&&(s=RegExp("</"+h[2],"g")),o=Xe):h[3]!==void 0&&(o=Xe):o===Xe?h[0]===">"?(o=s??Qt,d=-1):h[1]===void 0?d=-2:(d=o.lastIndex-h[2].length,u=h[1],o=h[3]===void 0?Xe:h[3]==='"'?Xo:Yo):o===Xo||o===Yo?o=Xe:o===Ko||o===Go?o=Qt:(o=Xe,s=void 0);let m=o===Xe&&i[a+1].startsWith("/>")?" ":"";n+=o===Qt?l+pp:d>=0?(t.push(u),l.slice(0,d)+gs+l.slice(d)+$e+m):l+$e+(d===-2?a:m)}return[ea(i,n+(i[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},ti=class i{constructor({strings:r,_$litType$:e},t){let s;this.parts=[];let n=0,o=0,a=r.length-1,l=this.parts,[u,h]=ta(r,e);if(this.el=i.createElement(u,t),Ze.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=Ze.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(gs)){let f=h[o++],m=s.getAttribute(d).split($e),b=/([.?@])?(.*)/.exec(f);l.push({type:1,index:n,name:b[2],strings:m,ctor:b[1]==="."?Bi:b[1]==="?"?Ni:b[1]==="@"?Ui:tt}),s.removeAttribute(d)}else d.startsWith($e)&&(l.push({type:6,index:n}),s.removeAttribute(d));if(Jo.test(s.tagName)){let d=s.textContent.split($e),f=d.length-1;if(f>0){s.textContent=zi?zi.emptyScript:"";for(let m=0;m<f;m++)s.append(d[m],Jt()),Ze.nextNode(),l.push({type:2,index:++n});s.append(d[f],Jt())}}}else if(s.nodeType===8)if(s.data===_s)l.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf($e,d+1))!==-1;)l.push({type:7,index:n}),d+=$e.length-1}n++}}static createElement(r,e){let t=Qe.createElement("template");return t.innerHTML=r,t}};function et(i,r,e=i,t){if(r===Je)return r;let s=t!==void 0?e._$Co?.[t]:e._$Cl,n=ei(r)?void 0:r._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(r=et(i,s._$AS(i,r.values),s,t)),r}var ji=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,s=(r?.creationScope??Qe).importNode(e,!0);Ze.currentNode=s;let n=Ze.nextNode(),o=0,a=0,l=t[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new Ct(n,n.nextSibling,this,r):l.type===1?u=new l.ctor(n,l.name,l.strings,this,r):l.type===6&&(u=new qi(n,this,r)),this._$AV.push(u),l=t[++a]}o!==l?.index&&(n=Ze.nextNode(),o++)}return Ze.currentNode=Qe,s}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},Ct=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=et(this,r,e),ei(r)?r===p||r==null||r===""?(this._$AH!==p&&this._$AR(),this._$AH=p):r!==this._$AH&&r!==Je&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Qo(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==p&&ei(this._$AH)?this._$AA.nextSibling.data=r:this.T(Qe.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,s=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=ti.createElement(ea(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new ji(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(r){let e=Zo.get(r.strings);return e===void 0&&Zo.set(r.strings,e=new ti(r)),e}k(r){vs(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let n of r)s===e.length?e.push(t=new i(this.O(Jt()),this.O(Jt()),this,this.options)):t=e[s],t._$AI(n),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=Vo(r).nextSibling;Vo(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},tt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,s,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=r,this.name=e,this._$AM=s,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(r,e=this,t,s){let n=this.strings,o=!1;if(n===void 0)r=et(this,r,e,0),o=!ei(r)||r!==this._$AH&&r!==Je,o&&(this._$AH=r);else{let a=r,l,u;for(r=n[0],l=0;l<n.length-1;l++)u=et(this,a[t+l],e,l),u===Je&&(u=this._$AH[l]),o||=!ei(u)||u!==this._$AH[l],u===p?r=p:r!==p&&(r+=(u??"")+n[l+1]),this._$AH[l]=u}o&&!s&&this.j(r)}j(r){r===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},Bi=class extends tt{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===p?void 0:r}},Ni=class extends tt{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==p)}},Ui=class extends tt{constructor(r,e,t,s,n){super(r,e,t,s,n),this.type=5}_$AI(r,e=this){if((r=et(this,r,e,0)??p)===Je)return;let t=this._$AH,s=r===p&&t!==p||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,n=r!==p&&(t===p||s);s&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},qi=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){et(this,r)}},ia={M:gs,P:$e,A:_s,C:1,L:ta,R:ji,D:Qo,V:et,I:Ct,H:tt,N:Ni,U:Ui,B:Bi,F:qi},up=bs.litHtmlPolyfillSupport;up?.(ti,Ct),(bs.litHtmlVersions??=[]).push("3.3.3");var ra=(i,r,e)=>{let t=e?.renderBefore??r,s=t._$litPart$;if(s===void 0){let n=e?.renderBefore??null;t._$litPart$=s=new Ct(r.insertBefore(Jt(),n),n,void 0,e??{})}return s._$AI(i),s};var xs=globalThis,v=class extends Ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=ra(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Je}};v._$litElement$=!0,v.finalized=!0,xs.litElementHydrateSupport?.({LitElement:v});var hp=xs.litElementPolyfillSupport;hp?.({LitElement:v});(xs.litElementVersions??=[]).push("4.2.2");var fp={feeding:{domain:"binary_sensor",translationKeys:["feeding"],idSuffixes:["_feeding"]},eating:{domain:"binary_sensor",translationKeys:["eating"],idSuffixes:["_eating"]},bowlFill:{domain:"sensor",translationKeys:["bowl_fill","bowl_fill_1"],idSuffixes:["_bowl_fill","_bowl_fill_1","_bowl_fill_hopper_1"]},hopperLevel1:{domain:"sensor",translationKeys:["hopper_1_level"],idSuffixes:["_hopper_1_level"]},hopperLevel2:{domain:"sensor",translationKeys:["hopper_2_level"],idSuffixes:["_hopper_2_level"]},hopperRemaining1:{domain:"sensor",translationKeys:["hopper_1_remaining"],idSuffixes:["_hopper_1_remaining"]},hopperRemaining2:{domain:"sensor",translationKeys:["hopper_2_remaining"],idSuffixes:["_hopper_2_remaining"]},markFullHopper1:{domain:"button",translationKeys:["hopper_1_full"],idSuffixes:["_hopper_1_full"]},markFullHopper2:{domain:"button",translationKeys:["hopper_2_full"],idSuffixes:["_hopper_2_full"]},markFullBoth:{domain:"button",translationKeys:["hopper_full"],idSuffixes:["_hopper_full"]},hopperDivider:{domain:"switch",translationKeys:["hopper_divider"],idSuffixes:["_hopper_divider"]},hopperFood1:{domain:"text",translationKeys:["hopper_1_food"],idSuffixes:["_hopper_1_food"]},hopperFood2:{domain:"text",translationKeys:["hopper_2_food"],idSuffixes:["_hopper_2_food"]},desiccantDays:{domain:"sensor",translationKeys:["desiccant_days","desiccant_left"],idSuffixes:["_desiccant_days","_desiccant_left"]},schedule:{domain:"sensor",translationKeys:["schedule"],idSuffixes:["_schedule"]},scheduleCardState:{domain:"sensor",translationKeys:["schedule_card_state"],idSuffixes:["_schedule_card_state"]},feedButton:{domain:"button",translationKeys:["feed"],idSuffixes:["_feed"]},feedButtonHopper1:{domain:"button",translationKeys:["feed_hopper_1"],idSuffixes:["_feed_hopper_1"]},feedButtonHopper2:{domain:"button",translationKeys:["feed_hopper_2"],idSuffixes:["_feed_hopper_2"]},cancelFeedButton:{domain:"button",translationKeys:["cancel_feed"],idSuffixes:["_cancel_feed"]},callCatsButton:{domain:"button",translationKeys:["call_cats"],idSuffixes:["_call_cats"]},feedAmount:{domain:"number",translationKeys:["feed_amount"],idSuffixes:["_feed_amount"]},feedAmountHopper1:{domain:"number",translationKeys:["feed_amount_hopper_1"],idSuffixes:["_feed_amount_hopper_1"]},feedAmountHopper2:{domain:"number",translationKeys:["feed_amount_hopper_2"],idSuffixes:["_feed_amount_hopper_2"]},cloudSwitch:{domain:"switch",translationKeys:["cloud","petkit_cloud"],idSuffixes:["_cloud","_petkit_cloud"]},stackSelect:{domain:"select",translationKeys:["stack"],idSuffixes:["_stack"]},cloudConnection:{domain:"sensor",translationKeys:["cloud_connection"],idSuffixes:["_cloud_connection"]},nightVisionSwitch:{domain:"switch",translationKeys:["night","night_vision"],idSuffixes:["_night","_night_vision"]},statusLedSwitch:{domain:"switch",translationKeys:["light","status_led"],idSuffixes:["_light","_status_led"]},microphoneSwitch:{domain:"switch",translationKeys:["microphone"],idSuffixes:["_microphone"]},lastSeenPet:{domain:"sensor",translationKeys:["last_seen_pet"],idSuffixes:["_last_seen_pet"]},dishBefore:{domain:"image",translationKeys:["dish_before"],idSuffixes:["_dish_before"]},dishAfter:{domain:"image",translationKeys:["dish_after"],idSuffixes:["_dish_after"]},wifiNetwork:{domain:"sensor",translationKeys:["wifi_network","wifi","rssi"],idSuffixes:["_wifi_network","_wifi","_rssi"]},lastDetection:{domain:"sensor",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionsToday:{domain:"sensor",translationKeys:["detections_today"],idSuffixes:["_detections_today"]},lastDetectionImage:{domain:"image",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionOverlaySwitch:{domain:"switch",translationKeys:["detection_overlay"],idSuffixes:["_detection_overlay"]}};function Vi(i){return i.slice(0,i.indexOf("."))}function ws(i){return i.slice(i.indexOf(".")+1)}function mp(i,r){if(Vi(i.entity_id)!==r.domain)return!1;if(i.translation_key&&r.translationKeys.includes(i.translation_key))return!0;let e=ws(i.entity_id);return r.idSuffixes.some(t=>e.endsWith(t))}function bp(i){let r=i.name??i.original_name;if(r)return r.replace(/\s+present$/i,"").trim()||r;let s=ws(i.entity_id).replace(/_present$/,"").split("_").filter(Boolean).pop();return s?s[0].toUpperCase()+s.slice(1):"Cat"}function gp(i){return Vi(i.entity_id)!=="binary_sensor"?!1:i.translation_key==="present"||i.translation_key?.endsWith("_present")?!0:ws(i.entity_id).endsWith("_present")}function $t(i,r){let e={deviceId:r,catPresence:[]},t=Object.values(i).filter(s=>s.device_id===r&&!s.disabled_by);for(let s of t){if(Vi(s.entity_id)==="camera"&&!e.camera){e.camera=s.entity_id;continue}if(Vi(s.entity_id)==="media_player"&&!e.speaker){e.speaker=s.entity_id;continue}if(gp(s)){e.catPresence.push({entityId:s.entity_id,name:bp(s)});continue}for(let n of Object.entries(fp)){let[o,a]=n;if(!e[o]&&mp(s,a)){e[o]=s.entity_id;break}}}return e.catPresence.sort((s,n)=>s.name.localeCompare(n.name)),e}function Et(i,r){if(r)return i[r]?.config_entries?.[0]}function sa(i,r){let e=t=>t===void 0||t==="unavailable"||t==="unknown";return i.length===0||i.every(e)?"unreachable":r==="on"?"dispensing":"idle"}function ks(i,r){return i==="unreachable"?"Feeder unreachable. Check that kibbled is running":i==="dispensing"?"Dispensing\u2026":r?`Fed ${r}`:"Ready to feed"}function Wi(i,r){let e=Math.floor(Math.max(0,r.getTime()-i.getTime())/6e4);if(e<1)return{unit:"now",value:0};if(e<60)return{unit:"minutes",value:e};let t=Math.floor(e/60);return t<24?{unit:"hours",value:t}:{unit:"days",value:Math.floor(t/24)}}function na(i,r){let e=Wi(i,r);if(e.unit==="now")return"just now";let t=e.unit==="minutes"?"m":e.unit==="hours"?"h":"d";return`${e.value}${t} ago`}function Tt(i,r){let e=Wi(i,r);if(e.unit==="now")return"just now";let t=e.unit==="minutes"?"min":e.unit==="hours"?"h":"d";return`${e.value} ${t} ago`}var _p={data:null,error:null,loading:!1},te=class{constructor(r){this._lastWatched=null;this._requestId=0;this._state=_p;this._onChange=r}get state(){return this._state}sync(r,e){r!==this._lastWatched&&(this._lastWatched=r,this.refresh(e))}refresh(r){let e=++this._requestId;this._state={...this._state,loading:!0,error:null},this._onChange(),r().then(t=>{e===this._requestId&&(this._state={data:t,error:null,loading:!1},this._onChange())},t=>{e===this._requestId&&(this._state={...this._state,error:q(t),loading:!1},this._onChange())})}patch(r){this._state.data!==null&&(this._state={...this._state,data:r(this._state.data)},this._onChange())}};function oa(i,r){return r.filter(e=>!!e).map(e=>`${e}=${i.states[e]?.state??""}`).join("|")}function q(i){if(i instanceof Error)return i.message;if(i&&typeof i=="object"&&"message"in i){let r=i.message;if(typeof r=="string"&&r)return r}return"Something went wrong."}var ge=class{constructor(){this._urls=new Map;this._refs=new Map;this._pending=new Set;this._waiters=new Map}acquire(r,e,t){let s=e.id;this._refs.set(s,(this._refs.get(s)??0)+1);let n=this._urls.get(s);if(n!==void 0)return n;let o=this._waiters.get(s)??new Set;return o.add(t),this._waiters.set(s,o),this._pending.has(s)||(this._pending.add(s),this._fetch(r,e.url).then(a=>{this._pending.delete(s);let l=this._waiters.get(s);this._waiters.delete(s),a&&(this._refs.get(s)??0)>0?this._urls.set(s,a):a&&URL.revokeObjectURL(a);for(let u of l??[])u(a)})),null}release(r){let e=(this._refs.get(r)??0)-1;if(e>0){this._refs.set(r,e);return}this._refs.delete(r),queueMicrotask(()=>{(this._refs.get(r)??0)>0||this._evictIfOverCap()})}_evictIfOverCap(){if(!(this._urls.size<=200))for(let[r,e]of this._urls){if(this._urls.size<=200)break;(this._refs.get(r)??0)>0||(this._urls.delete(r),URL.revokeObjectURL(e))}}async _fetch(r,e){if(!r.fetchWithAuth)return null;try{let t=await r.fetchWithAuth(e);if(!t.ok)return null;let s=await t.blob();return URL.createObjectURL(s)}catch{return null}}dispose(){for(let r of this._urls.values())URL.revokeObjectURL(r);this._urls.clear(),this._refs.clear(),this._pending.clear(),this._waiters.clear()}},De=class{constructor(){this._acquiredId=null;this._cache=null;this._url=null}get url(){return this._url}sync(r,e,t,s){if((t?.id??null)!==this._acquiredId&&(this._release(),this._url=null),!t||!r||!e||this._acquiredId===t.id)return;this._acquiredId=t.id,this._cache=e;let o=t.id,a=e.acquire(r,t,l=>{this._acquiredId===o&&(this._url=l,s())});a!==null&&(this._url=a)}_release(){this._acquiredId&&this._cache&&this._cache.release(this._acquiredId),this._acquiredId=null,this._cache=null}dispose(){this._release(),this._url=null}};var vp={cog:"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",cloudCheck:"M13 19C13 19.34 13.04 19.67 13.09 20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.32 7.4 19 9.05 19 11C20.15 11.13 21.1 11.63 21.86 12.5C22.37 13.07 22.7 13.71 22.86 14.42C21.82 13.54 20.5 13 19 13C18.89 13 18.79 13 18.68 13C18.62 13 18.56 13 18.5 13H17V11C17 9.62 16.5 8.44 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18H13.09C13.04 18.33 13 18.66 13 19M17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84L17.75 19.43Z",cloudLock:"M6.5 18H13V20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.08 7.16 18.73 8.5 18.93 10C18.23 10 17.56 10.19 16.95 10.46C16.84 9.31 16.38 8.31 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18M23 17.3V20.8C23 21.4 22.4 22 21.7 22H16.2C15.6 22 15 21.4 15 20.7V17.2C15 16.6 15.6 16 16.2 16V14.5C16.2 13.1 17.6 12 19 12S21.8 13.1 21.8 14.5V16C22.4 16 23 16.6 23 17.3M20.5 14.5C20.5 13.7 19.8 13.2 19 13.2S17.5 13.7 17.5 14.5V16H20.5V14.5Z",cloudAlert:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M11 7H13V13H11V7Z",cloudQuestion:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M14.43 8.68C14.97 9.13 15.24 9.75 15.24 10.5C15.24 11 15.09 11.41 14.8 11.82C14.5 12.21 14.13 12.5 13.67 12.75C13.41 12.91 13.24 13.07 13.15 13.26C13.06 13.45 13 13.69 13 14H11C11 13.45 11.11 13.08 11.3 12.82C11.5 12.56 11.85 12.25 12.37 11.91C12.63 11.75 12.84 11.56 13 11.32C13.15 11.09 13.23 10.81 13.23 10.5C13.23 10.18 13.14 9.94 12.96 9.76C12.78 9.56 12.5 9.47 12.2 9.47C11.93 9.47 11.71 9.55 11.5 9.7C11.35 9.85 11.25 10.08 11.25 10.39H9.28C9.23 9.64 9.5 9 10.06 8.59C10.6 8.2 11.31 8 12.2 8C13.14 8 13.89 8.23 14.43 8.68Z",airFilter:"M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",wifi:"M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",fullscreen:"M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z",fullscreenExit:"M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z",weatherNight:"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",ledOn:"M11,0V4H13V0H11M18.3,2.29L15.24,5.29L16.64,6.71L19.7,3.71L18.3,2.29M5.71,2.29L4.29,3.71L7.29,6.71L8.71,5.29L5.71,2.29M12,6A4,4 0 0,0 8,10V16H6V18H9V23H11V18H13V23H15V18H18V16H16V10A4,4 0 0,0 12,6M2,9V11H6V9H2M18,9V11H22V9H18Z",microphone:"M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z",microphoneOff:"M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z",volumeOff:"M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z",volumeHigh:"M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",openInNew:"M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",speaker:"M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",refresh:"M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",check:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",dotsVertical:"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",helpCircle:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6C9.79,6 8,7.79 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",eye:"M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",eyeOff:"M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",deleteOutline:"M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",undo:"M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",plus:"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",cat:"M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M11,14H13L12.3,15.39C12.5,16.03 13.06,16.5 13.75,16.5A1.5,1.5 0 0,0 15.25,15H15.75A2,2 0 0,1 13.75,17C13,17 12.35,16.59 12,16V16H12C11.65,16.59 11,17 10.25,17A2,2 0 0,1 8.25,15H8.75A1.5,1.5 0 0,0 10.25,16.5C10.94,16.5 11.5,16.03 11.7,15.39L11,14Z",play:"M8,5.14V19.14L19,12.14L8,5.14Z"};function y(i){return D`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d=${vp[i]}></path></svg>`}var aa="0.27.0";var ca="#43A96A",da="#2F8551",pa="#10301D",ua="#F4A452",ha="#DE8A3A",fa="#3A2C28",ma="#E5484D",la=["#3FA7A0","#9A5B9E","#7FA05A","#4F86C6"];function ce(i){let r=la.length;return la[(i%r+r)%r]}function ba(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0}function $s(i){return i==="empty"||i==="low"||i==="ok"?i:null}function Es(i){if(!i)return null;let r=i.state,e=r==="unknown"||r==="unavailable"||r===""?null:Number(r),t=i.attributes??{};return{portions:e!=null&&Number.isFinite(e)?e:null,fullAt:typeof t.full_at=="string"?t.full_at:null,portionsSinceFull:typeof t.portions_since_full=="number"?t.portions_since_full:null,fullToLow:typeof t.full_to_low=="number"?t.full_to_low:null}}var Ki=.34,Cs={empty:0,low:.2,ok:.64};function ga(i,r){let e=Wi(i,r);if(e.unit==="now")return"just now";let t=e.unit==="minutes"?"minute":e.unit==="hours"?"hour":"day";return`${e.value} ${t}${e.value===1?"":"s"} ago`}function xp(i){if(!i)return null;let r=new Date(i);return Number.isNaN(r.getTime())?null:r}var wp=30;function kp(i,r){let t=1-(i??0)/(wp*r);return Math.max(Cs.ok,Math.min(1,t))}function Sp(i,r){let e=r>0?Math.max(0,Math.min(1,i/r)):0;return Ki+(1-Ki)*e}function Ss(i,r,e,t=new Date){let s=i===null?2:1,n=xp(e?.fullAt??null),o=e?.portionsSinceFull??null,a=o!=null&&o>0?`, ${o} portion${o===1?"":"s"} since`:"",l=n?`Filled ${ga(n,t)}${a}`:null;if(r===null)return{index:i,level:null,tone:"unknown",headline:"Unknown",fillFraction:null,detail:null};if(r==="low"||r==="empty")return{index:i,level:r,tone:r,headline:r==="low"?"Low":"Empty",fillFraction:Cs[r],detail:l};if(e?.portions!=null&&e.fullToLow!=null&&e.fullToLow>0){let{portions:u,fullToLow:h}=e,d=Math.round(u),f=`About ${d} portion${d===1?"":"s"} left`;return{index:i,level:r,tone:"ok",headline:`About ${d} left`,fillFraction:Sp(u,h),detail:n?`${f} \xB7 filled ${ga(n,t)}`:f}}return n?{index:i,level:r,tone:"ok",headline:`Filled ${na(n,t)}`,fillFraction:kp(o,s),detail:l}:{index:i,level:r,tone:"ok",headline:"Stocked",fillFraction:Cs.ok,detail:null}}function _a(i){return i.index===null?"Hopper":`Hopper ${i.index}`}function Ts(i){if(!i||i.state==="unavailable"||i.state==="unknown")return null;let r=i.state.trim();return r.length>0?r:null}function ii(i,r,e){return i===1?r:i===2?e:null}function it(i,r){if(i.index===null)return _a(i);let e=r?.trim();return e||_a(i)}function Gi(i,r=null){let e=it(i,r);if(i.tone==="unknown")return`${e}: level unknown`;let t=`${e}: ${i.headline}`;return i.detail?`${t}. ${i.detail}`:t}var va={empty:0,low:1,ok:2};function ya(i,r){return i==null||r==null?null:i+r}function Cp(i,r,e,t){let s=[i,r].filter(l=>l!==null),n=s.length===0?null:s.reduce((l,u)=>va[l]<=va[u]?l:u);if(!e&&!t)return{level:n,remaining:null};let o=[e?.fullAt,t?.fullAt].filter(l=>typeof l=="string"),a=[e?.portionsSinceFull,t?.portionsSinceFull].filter(l=>typeof l=="number");return{level:n,remaining:{portions:ya(e?.portions??null,t?.portions??null),fullAt:o.length?o.reduce((l,u)=>Date.parse(l)>=Date.parse(u)?l:u):null,portionsSinceFull:a.length?a.reduce((l,u)=>l+u,0):null,fullToLow:ya(e?.fullToLow??null,t?.fullToLow??null)}}}function Yi(i,r,e,t,s,n=new Date){if(!i)return[Ss(1,r,t,n),Ss(2,e,s,n)];let{level:o,remaining:a}=Cp(r,e,t,s);return[Ss(null,o,a,n)]}var $p={"choose-hopper":{start:"confirm-empty"},"confirm-empty":{"empty-confirmed":"collecting"},collecting:{capture:"collecting","review-full":"mark-full"},"mark-full":{"full-marked":"offer-inherit"},"offer-inherit":{"inherit-resolved":"done"},done:{restart:"choose-hopper"}};function Ee(i,r){return $p[i][r]??i}function xa(i){return i.some(r=>r.portions>0)}function wa(i,r){let e=i[i.length-1];return!e||r.score>=e.score?null:{previousPortions:e.portions,previousScore:e.score,newScore:r.score}}function ri(i){if(!i)return{kind:"never",inheritedFromDisplay:null,measuredAt:null,note:null,finished:!1};let r=typeof i.source=="object"?i.source.inherited_from:null;return{kind:r!==null?"inherited":"measured",inheritedFromDisplay:r!==null?r+1:null,measuredAt:i.measured_at,note:i.note||null,finished:i.full_portions!=null}}function ka(i,r){if(!i||i.full_portions==null||i.full_score==null)return null;let e=[...i.points].sort((s,n)=>s.portions-n.portions),t=e[0];if(!t)return null;if(r<=t.score)return 0;if(r>=i.full_score)return 100;for(let s=1;s<e.length;s+=1){let n=e[s-1],o=e[s];if(r>o.score)continue;let a=o.score-n.score,l=a<=0?0:(r-n.score)/a,h=(n.portions+l*(o.portions-n.portions))/i.full_portions*100;return Math.max(0,Math.min(100,h))}return 100}function Sa(i){return i?i.hoppers[0]??i.hoppers[1]??null:null}function Ca(i,r){return i??(r?"1":"both")}var $a=300,Ea=250,ie=70,re=160,de=16,Te=116,rt=24,Tp=132,Zi=160,As=150,er=182,La=72,Pp=7,Rs=238,Qi=5,Ap=6e4,Pe={top:"#f0b774",mid:"#c9853f",deep:"#8e5424",hi:"#ffe1b8"},Fe={top:"#f6e7cc",mid:"#dcc19a",deep:"#b3916a",hi:"#fffaf0"},Ta={frosted:{name:"Frosted glass",body:["#1f2835","#141a23"],stroke:"#ffffff26",sheen:.1,chute:["#8b98a6","#4d5864"],bowl:["#262f3b","#11161d"],rim:"#c3ccd6",light:!1},ceramic:{name:"Soft ceramic",body:["#ffffff","#e7edf3"],stroke:"#1a253122",sheen:.45,chute:["#c9d2db","#9aa7b4"],bowl:["#ffffff","#dfe6ee"],rim:"#ffffff",light:!0}},Xi={ok:"var(--kibble-feed, #43a96a)",low:"var(--kibble-amber-dark, #de8a3a)",empty:"var(--error-color, #db4437)",unknown:"var(--secondary-text-color, #8b98a6)"};function Rp(i,r,e,t){let s=[0,120,240].map(n=>{let o=(n+t)*Math.PI/180;return D`<circle cx=${(i+Math.cos(o)*e*.55).toFixed(1)} cy=${(r+Math.sin(o)*e*.55).toFixed(1)} r=${(e*.62).toFixed(1)} />`});return D`<g>${s}</g>`}function Mp(){return D`
    <pattern id="tex-dot" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
      <circle cx="2" cy="2" r="1.2" fill="#000" opacity="0.13" />
      <circle cx="5.5" cy="5.5" r="1.2" fill="#fff" opacity="0.09" />
    </pattern>
    <pattern id="tex-fleck" width="11" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
      <path d="M1 2h4M7 6h3M2 7h2" stroke="#6b5234" stroke-width="1.3" stroke-linecap="round" opacity="0.28" />
      <path d="M6 1.5h2" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.35" />
    </pattern>
  `}function Ji(i,r){return D`
    <linearGradient id=${i} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${r.top} />
      <stop offset="0.55" stop-color=${r.mid} />
      <stop offset="1" stop-color=${r.deep} />
    </linearGradient>
  `}function Lp(i,r,e,t,s,n,o){let a=t-r;return D`
    <rect x=${i} y=${r} width=${e} height=${a} fill="url(#${s})" />
    <rect x=${i} y=${r} width=${e} height=${a} fill="url(#${n})" />
    <rect x=${i} y=${r} width=${e} height="2" fill=${o} opacity="0.85" />
  `}function Hp(i,r){let e=r.length===1,t=r.map(s=>s.fraction>.01?Lp(s.x,de+6+(Te-12)*(1-s.fraction),s.w,de+Te,s.gradientId,s.textureId,s.food.hi):p);return D`
    <defs>
      <linearGradient id="hopper-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${i.body[0]} />
        <stop offset="1" stop-color=${i.body[1]} />
      </linearGradient>
      <linearGradient id="hopper-sheen" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.08" stop-color="#fff" stop-opacity=${i.sheen} />
        <stop offset="0.22" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.85" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.95" stop-color="#fff" stop-opacity=${i.sheen*.6} />
        <stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="hopper-inner-shadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity=${i.light?.06:.35} />
        <stop offset="0.12" stop-color="#000" stop-opacity="0" />
        <stop offset="0.88" stop-color="#000" stop-opacity="0" />
        <stop offset="1" stop-color="#000" stop-opacity=${i.light?.08:.4} />
      </linearGradient>
      ${Mp()}
      ${Ji("hopper-food-1",Pe)}
      ${Ji("hopper-food-2",Fe)}
      <clipPath id="hopper-interior-clip">
        <rect x=${ie+3} y=${de+3} width=${re-6} height=${Te-6} rx=${rt-3} />
      </clipPath>
      <filter id="hopper-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect x=${ie} y=${de+6} width=${re} height=${Te} rx=${rt} fill="#000" opacity=${i.light?.08:.35} filter="url(#hopper-shadow-blur)" />
    <rect x=${ie} y=${de} width=${re} height=${Te} rx=${rt} fill="url(#hopper-body)" />
    <g clip-path="url(#hopper-interior-clip)">
      ${t}
      <rect x=${ie} y=${de} width=${re} height=${Te} fill="url(#hopper-inner-shadow)" />
    </g>
    ${e?p:D`<line x1=${ie+re/2} x2=${ie+re/2} y1=${de+8} y2=${de+Te-8} stroke=${i.light?"#1a253140":"#ffffff40"} stroke-width="2" stroke-linecap="round" />`}
    <rect x=${ie} y=${de} width=${re} height=${Te} rx=${rt} fill="url(#hopper-sheen)" />
    <rect x=${ie+.75} y=${de+.75} width=${re-1.5} height=${Te-1.5} rx=${rt} fill="none" stroke=${i.stroke} stroke-width="1.5" />
    <path d="M${ie+rt} ${de+1.5} H${ie+re-rt}" stroke="#fff" stroke-opacity=${i.light?.9:.18} stroke-width="1.2" stroke-linecap="round" />
  `}function Op(i,r){let e=Tp,t=Zi;return D`
    <defs>
      <linearGradient id="chute-body" x1="0" x2="1">
        <stop offset="0" stop-color=${i.chute[1]} />
        <stop offset="0.45" stop-color=${i.chute[0]} />
        <stop offset="1" stop-color=${i.chute[1]} />
      </linearGradient>
    </defs>
    <path
      d="M104 ${e} L196 ${e} Q192 ${e+4} 170 ${t-6} L163 ${t} L137 ${t} L130 ${t-6} Q108 ${e+4} 104 ${e} Z"
      fill="url(#chute-body)"
      stroke=${i.light?"#1a253120":"#00000040"}
    />
    <rect
      x="139"
      y=${t-3}
      width="22"
      height="4"
      rx="2"
      fill=${r?"#f7c948":i.light?"#6b7886":"#0a0d12"}
      style=${r?"filter:drop-shadow(0 0 6px #f7c948)":""}
    />
  `}function Ha(i){let r=Rs-Qi,e=r-er;return r-e*Math.max(0,Math.min(1,i))}function Oa(){let i=As,r=er,e=La-Qi,t=Rs-Qi;return`M${i-e} ${r} C${i-e+2} ${r+37} ${i-38} ${t} ${i} ${t} C${i+38} ${t} ${i+e-2} ${r+37} ${i+e} ${r} Z`}function Ip(i,r,e){let t=As,s=er,n=La,o=Pp,a=Rs,l=`M${t-n} ${s} C${t-n+2} ${s+40} ${t-42} ${a} ${t} ${a} C${t+42} ${a} ${t+n-2} ${s+40} ${t+n} ${s} Z`,u=a-Qi,h=Oa(),d=r==null?0:Math.max(0,Math.min(1,r)),f=Math.max(0,Math.min(1,e)),m=Ha(d),b=n*2,_=d>.02,g=_&&f>.01,C=Math.max(0,1-f-.06).toFixed(3),R=Math.min(1,1-f+.06).toFixed(3);return D`
    <defs>
      ${Ji("bowl-food-1",Pe)}
      ${Ji("bowl-food-2",Fe)}
      <clipPath id="bowl-interior-clip"><path d=${h} /></clipPath>
      <linearGradient id="bowl-wall" x1="0" x2="1">
        <stop offset="0" stop-color=${i.bowl[0]} stop-opacity="0.55" />
        <stop offset="0.2" stop-color="#fff" stop-opacity=${i.light?.5:.1} />
        <stop offset="0.45" stop-color=${i.bowl[1]} stop-opacity="0.25" />
        <stop offset="0.9" stop-color="#fff" stop-opacity=${i.light?.3:.06} />
        <stop offset="1" stop-color=${i.bowl[0]} stop-opacity="0.55" />
      </linearGradient>
      <linearGradient id="bowl-mix-gradient" x1="0" x2="1">
        <stop offset=${C} stop-color="#fff" stop-opacity="0" />
        <stop offset=${R} stop-color="#fff" stop-opacity="1" />
      </linearGradient>
      <mask id="bowl-mix-mask" maskContentUnits="userSpaceOnUse">
        <rect x=${t-n} y=${s-10} width=${b} height=${a-s+20} fill="url(#bowl-mix-gradient)" />
      </mask>
    </defs>
    <ellipse cx=${t} cy=${a+5} rx=${n*.7} ry="5" fill="#000" opacity=${i.light?.1:.4} />
    <path d=${h} fill=${i.light?"#e9eef3":"#0b0f15"} />
    <g clip-path="url(#bowl-interior-clip)">
      ${_?D`
            <rect x=${t-n} y=${m} width=${b} height=${u-m+2} fill="url(#bowl-food-1)" />
            <rect x=${t-n} y=${m} width=${b} height=${u-m+2} fill="url(#tex-dot)" />
            ${g?D`<g mask="url(#bowl-mix-mask)">
                  <rect x=${t-n} y=${m} width=${b} height=${u-m+2} fill="url(#bowl-food-2)" />
                  <rect x=${t-n} y=${m} width=${b} height=${u-m+2} fill="url(#tex-fleck)" />
                </g>`:p}
            <rect x=${t-n} y=${m} width=${b} height="2" fill="#fff" opacity="0.55" />
          `:p}
    </g>
    <path d=${l} fill="url(#bowl-wall)" stroke=${i.light?"#1a253126":"#ffffff30"} stroke-width="1.5" />
    <ellipse cx=${t} cy=${s} rx=${n} ry=${o} fill="none" stroke=${i.light?"#ffffff":i.rim} stroke-width="2.5" />
  `}function Dp(i){return i==="1"?[Pe.mid,Pe.top,Pe.deep]:i==="2"?[Fe.mid,Fe.top,Fe.deep]:[Pe.mid,Pe.top,Fe.mid,Fe.top]}var Pa=600,Aa=[{dx:-1.3,rotationDeg:-10,phase:0},{dx:1.1,rotationDeg:14,phase:1/3},{dx:-.2,rotationDeg:4,phase:2/3}];function Fp(i,r,e,t,s){let n=r>=3?Aa:Aa.slice(0,2),o=(s-t).toFixed(1),a=n.map((l,u)=>{let d=`--fall-delay:${Math.round(l.phase*Pa)}ms;--fall-duration:${Pa}ms;--fall-to:${o}px;`;return D`<g class="pour-piece" style=${d} fill=${i[u%i.length]}>${Rp(e+l.dx,t,3.6,l.rotationDeg)}</g>`});return D`
    <defs>
      <clipPath id="pour-clip">
        <rect x=${e-6} y=${Zi-4} width="12" height=${er-Zi+4} />
        <path d=${Oa()} />
      </clipPath>
    </defs>
    <g class="pour-pieces" clip-path="url(#pour-clip)">${a}</g>
  `}function Ra(i,r,e){if(i==null)return"Bowl level unknown";let t=r??i*100;return e?`Bowl about ${Math.round(t)}% full`:`Bowl ${Math.round(t)}% full`}function Ma(i,r,e){return i.length===1?`${it(i[0],null)}: ${i[0].headline}`:i.map(t=>`${it(t,ii(t.index,r,e))}: ${t.headline}`).join(", ")}function zp(i,r,e){let t=it(i,r),s=Gi(i,r);return c`
    <button type="button" class="chip" data-tone=${i.tone} style=${`--chip-c:${Xi[i.tone]}`} aria-label=${s} title=${i.detail??""} @click=${e}>
      <span class="chip-dot"></span>
      <span class="chip-name">${t}</span>
      <span class="chip-word">${i.headline}</span>
    </button>
  `}var Ps=class extends v{constructor(){super();this._wasFeeding=!1;this._dropping=!1;this.fill=null,this.hopperLevel1=null,this.hopperLevel2=null,this.hopperRemaining1=null,this.hopperRemaining2=null,this.singleHopper=!1,this.food1=null,this.food2=null,this.feeding=!1,this.portions=1,this.calibration=null,this.darkMode=!1,this.bowlMix=0,this.pourSource=null}static{this.properties={fill:{type:Number},hopperLevel1:{type:String},hopperLevel2:{type:String},hopperRemaining1:{attribute:!1},hopperRemaining2:{attribute:!1},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},feeding:{type:Boolean},portions:{type:Number},calibration:{attribute:!1},darkMode:{type:Boolean},bowlMix:{type:Number},pourSource:{attribute:!1},fillSource:{type:String}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._dropTimer)}_openHopperDetail(){this.dispatchEvent(new CustomEvent("hopper-detail-requested",{bubbles:!0,composed:!0}))}willUpdate(e){e.has("feeding")&&(this.feeding&&!this._wasFeeding?(clearTimeout(this._dropTimer),this._dropping=!0,this._dropTimer=setTimeout(()=>{this._dropping=!1,this.requestUpdate()},Ap)):!this.feeding&&this._wasFeeding&&this._dropping&&(clearTimeout(this._dropTimer),this._dropTimer=setTimeout(()=>{this._dropping=!1,this.requestUpdate()},900)),this._wasFeeding=this.feeding)}_compartments(e){if(e.length===1){let n=e[0];return[{x:ie,w:re,fraction:n.fillFraction??0,food:Pe,gradientId:"hopper-food-1",textureId:"tex-dot",toneColor:Xi[n.tone]}]}let[t,s]=e;return[{x:ie,w:re/2,fraction:t.fillFraction??0,food:Pe,gradientId:"hopper-food-1",textureId:"tex-dot",toneColor:Xi[t.tone]},{x:ie+re/2,w:re/2,fraction:s.fillFraction??0,food:Fe,gradientId:"hopper-food-2",textureId:"tex-fleck",toneColor:Xi[s.tone]}]}render(){let e=this.darkMode?Ta.frosted:Ta.ceramic,t=Yi(this.singleHopper,this.hopperLevel1,this.hopperLevel2,this.hopperRemaining1,this.hopperRemaining2),s=this._compartments(t),n=this.fill==null?null:ka(this.calibration,this.fill/100),o=this.fill==null?null:this.fill/100,a=Ca(this.pourSource,this.singleHopper),l=Dp(a),u=Zi-2,h=Ha(o??0),d=this.fillSource==="estimate",f=`${Ma(t,this.food1,this.food2)}. ${Ra(o,n,d)}`;return c`
      <svg class="art" viewBox="0 0 ${$a} ${Ea}" role="img" aria-label=${f} preserveAspectRatio="xMidYMid meet">
        <g class="hopper-scene">
          <title>${Ma(t,this.food1,this.food2)}</title>
          ${Hp(e,s)}
        </g>
        ${Op(e,this.feeding)}
        <g class="bowl-scene">
          <title>${Ra(o,n,d)}</title>
          ${Ip(e,o,this.bowlMix)}
        </g>
        ${this._dropping&&!ba()?Fp(l,this.portions,As,u,h):p}
      </svg>
      ${n!=null?c`<div class="calibrated" role="status">${Math.round(n)}% full <span class="raw">\u00b7 raw ${Math.round(this.fill)}</span></div>`:p}
      <div class="chips">${t.map(m=>zp(m,ii(m.index,this.food1,this.food2),()=>this._openHopperDetail()))}</div>
    `}static{this.styles=w`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--kibble-rhythm, 10px);
      width: 100%;
    }
    /* width:100% + aspect-ratio gives .art its natural preferred size, same as always -- the
     * new part is min-height: 0, overriding the flex automatic-minimum-size default (which
     * clamps shrinking to an item's own preferred size for anything with an intrinsic aspect
     * ratio and overflow:visible). Without it, a squeezed host (kibble-card.ts's >=960px
     * side-by-side tier, where this column's own height is capped to match the video) could
     * not actually shrink .art at all -- it just kept its natural ~256px height and visually
     * overflowed straight through .calibrated/.chips below it and into whatever sits past this
     * component entirely. flex-shrink is 1 by default; .calibrated/.chips are flex: none
     * (below) and never give up their own space, so a genuine squeeze always comes out of .art
     * first -- preserveAspectRatio="xMidYMid meet" on the svg itself (render(), above) is what
     * then scales the actual artwork down to whatever smaller box results, instead of cropping
     * or distorting it. */
    .art {
      display: block;
      width: 100%;
      aspect-ratio: ${$a} / ${Ea};
      min-height: 0;
      overflow: visible;
    }
    /* The calibrated readout: a real, meaningful number now that a curve exists, so unlike the
     * raw score it earns primary-text weight -- the raw figure stays too, just secondary, since
     * every existing threshold elsewhere is still keyed to it, never this one. */
    .calibrated {
      flex: none;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      color: var(--primary-text-color);
    }
    .calibrated .raw {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .chips {
      flex: none;
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
      width: 100%;
    }
    .chip {
      flex: 1 1 0;
      min-width: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 44px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      font: inherit;
      color: inherit;
      cursor: pointer;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    .chip:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .chip:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 1px;
    }
    .chip-dot {
      flex: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--chip-c);
      box-shadow: 0 0 6px var(--chip-c);
    }
    .chip-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .chip-word {
      flex: none;
      font-size: 12px;
      font-weight: 700;
    }
    .chip[data-tone="low"] .chip-word {
      color: var(--kibble-amber-dark);
    }
    .chip[data-tone="empty"] .chip-word {
      color: var(--error-color, #db4437);
    }
    .pour-piece {
      transform-box: fill-box;
      animation: kibble-pour-fall var(--fall-duration) linear var(--fall-delay) infinite both;
    }
    /* Position samples position at t^2 (0, 0.04, 0.178, 0.415, 0.713, 1) -- true quadratic
     * ease-in between those stops, so the fall visibly accelerates like a dropped object
     * instead of following a stock easing curve. The last stretch (90-100%) holds at the
     * landed position for a brief squash-and-release settle, then fades into the pile. */
    @keyframes kibble-pour-fall {
      0% {
        transform: translateY(0) scale(1);
        opacity: 0;
      }
      6% {
        opacity: 1;
      }
      18% {
        transform: translateY(calc(var(--fall-to) * 0.04));
      }
      38% {
        transform: translateY(calc(var(--fall-to) * 0.178));
      }
      58% {
        transform: translateY(calc(var(--fall-to) * 0.415));
      }
      76% {
        transform: translateY(calc(var(--fall-to) * 0.713));
      }
      90% {
        transform: translateY(var(--fall-to));
      }
      96% {
        transform: translateY(var(--fall-to)) scale(1.15, 0.82);
        opacity: 1;
      }
      100% {
        transform: translateY(var(--fall-to)) scale(1);
        opacity: 0;
      }
    }
  `}};customElements.define("kibble-bowl",Ps);function Ia(i,r){return i>0&&r>0?{hopper:"both",amount:i,amount2:r}:i>0?{hopper:"1",amount:i}:r>0?{hopper:"2",amount:r}:null}function Ms(i,r){if(!r)return null;let e=r.detection_areas_hash??"#detection-areas";if(i===e)return"detection-areas";let t=r.calibrate_hash??"#calibrate";return i===t?"calibrate":null}function Da(i,r,e=new Date){if(r)return 0;let t=(e.getTime()-432e5)/1e3;for(let s of i){if(s.kind!=="feed"||s.start<t)continue;let n=s.feed?.sides;if(!n||n.length===0)continue;let o=n.reduce((l,u)=>l+u.portions,0);if(o<=0)continue;return(n.find(l=>l.hopper===2)?.portions??0)/o}return 0}var tr={phase:"idle",elapsedMs:0},ir={timeoutMs:1e4};function Fa(){return{phase:"requesting",elapsedMs:0}}function za(i,r,e){if(i.phase!=="requesting")return i;let t=i.elapsedMs+r;return t>=e.timeoutMs?{phase:"timeout",elapsedMs:e.timeoutMs}:{phase:"requesting",elapsedMs:t}}function ja(i,r){return r?{phase:"feeding",elapsedMs:0}:i.phase==="feeding"?tr:i}function Ls(){return tr}var Hs=class extends v{static{this.properties={value:{type:String},options:{attribute:!1},groupLabel:{type:String,attribute:"group-label"},disabled:{type:Boolean},contentFit:{type:Boolean,attribute:"content-fit"}}}constructor(){super(),this.value="",this.options=[],this.groupLabel="",this.disabled=!1,this.contentFit=!1}render(){return c`
      <div class="segments" role="radiogroup" aria-label=${this.groupLabel}>
        ${this.options.map(r=>c`
            <button
              type="button"
              role="radio"
              aria-checked=${r.value===this.value}
              class="segment ${r.value===this.value?"selected":""}"
              ?disabled=${this.disabled}
              @click=${()=>this._select(r.value)}
            >
              <span class="segment-label">${r.label}</span>
            </button>
          `)}
      </div>
    `}_select(r){this.dispatchEvent(new CustomEvent("option-selected",{detail:{value:r},bubbles:!0,composed:!0}))}static{this.styles=w`
    :host {
      display: block;
      container-type: inline-size;
    }
    .segments {
      display: flex;
      gap: 6px;
    }
    .segment {
      flex: 1 1 0;
      min-width: var(--kibble-touch-target, 48px);
      min-height: var(--kibble-touch-target, 48px);
      /* Pill radius and a soft translucent surface instead of a 2px outline: the convention
         Mushroom/Bubble-style dashboards settled on, and it stops a row of five segments
         reading as a table of boxes. */
      border-radius: 999px;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font-size: var(--kibble-segment-size, 16px);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1.1;
      overflow: hidden;
      padding: 0 4px;
      box-sizing: border-box;
      transition: background-color 0.15s ease, color 0.15s ease, transform 0.08s ease;
    }
    /* Segments size to their own label (a caller opts in for variable-length text, e.g. the
       hopper choice's "Both" vs. a food name) instead of splitting the row evenly -- "Both"
       stays narrow, a long food name gets the room it actually needs. Falls back to a smaller
       label size before ever truncating, since a name silently getting cut off is worse than a
       slightly smaller one staying whole. */
    :host([content-fit]) .segment {
      flex: 1 1 auto;
      min-width: 0;
      padding: 0 14px;
    }
    @container (max-width: 300px) {
      :host([content-fit]) .segment-label {
        font-size: 13px;
      }
    }
    /* A text label (the hopper choice's "Both"/food names) can run longer than a single
       portion digit ever does -- truncated with an ellipsis rather than wrapping or blowing
       out the pill's fixed touch-target width. */
    .segment-label {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* Press feedback -- the small tactile detail that makes a touch panel feel native. */
    .segment:active:not(:disabled) {
      transform: scale(0.96);
    }
    .segment.selected {
      /* The selected portion belongs to the feed action, not to the food, so it carries the
         action colour -- an amber pill above a green button read as two unrelated controls.
         Fallback hex matches styles/tokens.ts's KIBBLE_FEED/KIBBLE_INK_ON_FEED: this picker
         is also used standalone (dev/parts.html) outside kibble-card's own :host scope,
         which is the only place these custom properties are otherwise ever set. */
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .segment:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .segment:focus-visible {
      outline: 2px solid var(--kibble-feed-dark, #2f8551);
      outline-offset: 2px;
    }
  `}};customElements.define("kibble-segmented-picker",Hs);var Os=class extends v{static{this.properties={value:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.min=1,this.max=20,this.step=1,this.disabled=!1}render(){return c`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value<=this.min} @click=${this._decrement} aria-label="Fewer portions">
          &minus;
        </button>
        <span class="value">${this.value}</span>
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value>=this.max} @click=${this._increment} aria-label="More portions">
          &plus;
        </button>
      </div>
    `}_decrement(){this._emit(Math.max(this.min,this.value-this.step))}_increment(){this._emit(Math.min(this.max,this.value+this.step))}_emit(r){this.dispatchEvent(new CustomEvent("value-selected",{detail:{value:r},bubbles:!0,composed:!0}))}static{this.styles=w`
    :host {
      display: block;
    }
    .stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .step-btn {
      width: var(--kibble-touch-target, 48px);
      height: var(--kibble-touch-target, 48px);
      border-radius: 50%;
      border: 2px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
      flex: none;
    }
    .step-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .step-btn:focus-visible {
      outline: 2px solid var(--kibble-amber-dark);
      outline-offset: 2px;
    }
    .value {
      min-width: 1.6em;
      text-align: center;
      font-size: var(--kibble-segment-size, 16px);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
    }
  `}};customElements.define("kibble-stepper",Os);var{I:zb}=ia;var Ba=i=>i.strings===void 0;var Na={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Is=i=>(...r)=>({_$litDirective$:i,values:r}),rr=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,e,t){this._$Ct=r,this._$AM=e,this._$Ci=t}_$AS(r,e){return this.update(r,e)}update(r,e){return this.render(...e)}};var si=(i,r)=>{let e=i._$AN;if(e===void 0)return!1;for(let t of e)t._$AO?.(r,!1),si(t,r);return!0},sr=i=>{let r,e;do{if((r=i._$AM)===void 0)break;e=r._$AN,e.delete(i),i=r}while(e?.size===0)},Ua=i=>{for(let r;r=i._$AM;i=r){let e=r._$AN;if(e===void 0)r._$AN=e=new Set;else if(e.has(i))break;e.add(i),Np(r)}};function jp(i){this._$AN!==void 0?(sr(this),this._$AM=i,Ua(this)):this._$AM=i}function Bp(i,r=!1,e=0){let t=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(r)if(Array.isArray(t))for(let n=e;n<t.length;n++)si(t[n],!1),sr(t[n]);else t!=null&&(si(t,!1),sr(t));else si(this,i)}var Np=i=>{i.type==Na.CHILD&&(i._$AP??=Bp,i._$AQ??=jp)},nr=class extends rr{constructor(){super(...arguments),this._$AN=void 0}_$AT(r,e,t){super._$AT(r,e,t),Ua(this),this.isConnected=r._$AU}_$AO(r,e=!0){r!==this.isConnected&&(this.isConnected=r,r?this.reconnected?.():this.disconnected?.()),e&&(si(this,r),sr(this))}setValue(r){if(Ba(this._$Ct))this._$Ct._$AI(r,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=r,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var T=()=>new Fs,Fs=class{},Ds=new WeakMap,P=Is(class extends nr{render(i){return p}update(i,[r]){let e=r!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=r,this.ht=i.options?.host,this.rt(this.ct=i.element)),p}rt(i){if(this.G!==void 0)if(this.isConnected||(i=void 0),typeof this.G=="function"){let r=this.ht??globalThis,e=Ds.get(r);e===void 0&&(e=new WeakMap,Ds.set(r,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,i),i!==void 0&&this.G.call(this.ht,i)}else this.G.value=i}get lt(){return typeof this.G=="function"?Ds.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var ni={phase:"idle",elapsedMs:0,firedStages:[],releaseProgress:0},or={durationMs:1500,stageThresholds:[.33,.66,.86],nearCompleteAt:.88,drainMs:300};function qa(){return{phase:"charging",elapsedMs:0,firedStages:[],releaseProgress:0}}function Va(i,r,e){if(i.phase==="charging"){let t=i.elapsedMs+r;return t>=e.durationMs?{phase:"completed",elapsedMs:e.durationMs,firedStages:i.firedStages,releaseProgress:0}:{...i,elapsedMs:t}}if(i.phase==="draining"){let t=i.elapsedMs+r;return t>=e.drainMs?ni:{...i,elapsedMs:t}}return i}function Wa(i,r){if(i.phase!=="charging")return i;let e=Math.min(1,i.elapsedMs/r.durationMs);return{phase:"draining",elapsedMs:0,firedStages:[],releaseProgress:e}}function ar(i,r){if(i.phase==="idle")return 0;if(i.phase==="completed")return 1;if(i.phase==="charging")return Math.min(1,i.elapsedMs/r.durationMs);let e=r.drainMs>0?Math.min(1,i.elapsedMs/r.drainMs):1;return i.releaseProgress*(1-e)}function Ka(i,r){return i.phase!=="charging"?!1:ar(i,r)>=r.nearCompleteAt}function Ga(i,r){if(i.phase!=="charging")return[];let e=ar(i,r),t=[];return r.stageThresholds.forEach((s,n)=>{e>=s&&!i.firedStages.includes(n)&&t.push(n)}),t}function Ya(i,r){return r.length===0?i:{...i,firedStages:[...i.firedStages,...r]}}function st(i){typeof window>"u"||window.dispatchEvent(new CustomEvent("haptic",{detail:i}))}var Up=600,qp=260,Vp=450,oi=6,Za=["#34d3c3","#9b87f5","#f7c948"];function Wp(i){let r=1-i;return 1-r*r*r}var zs=class extends v{constructor(){super();this._holdState=ni;this._config=or;this._pointerId=null;this._rafId=null;this._lastFrameMs=0;this._reducedMotion=!1;this._completed=!1;this._buttonRef=T();this._tapFlashRef=T();this._shockRef=T();this._ringRef=T();this._triangle1Ref=T();this._triangle2Ref=T();this._dotRefs=Array.from({length:8},()=>T());this._onPointerDown=e=>{if(this.disabled||this._holdState.phase==="charging")return;e.preventDefault();let t=e.currentTarget;try{t.setPointerCapture(e.pointerId),this._pointerId=e.pointerId}catch{}this._begin()};this._onPointerUp=e=>{this._pointerId!==null&&e.pointerId!==this._pointerId||this._release()};this._onKeyDown=e=>{e.key!==" "&&e.key!=="Enter"||e.repeat||this.disabled||this._holdState.phase==="charging"||(e.preventDefault(),this._begin())};this._onKeyUp=e=>{e.key!==" "&&e.key!=="Enter"||this._release()};this._onBlur=()=>{this._release()};this._suppressOsGesture=e=>{e.preventDefault()};this._tapActivate=()=>{this.disabled||(this._prefersReducedMotion()||this._playTapPulse(),this._activate())};this._chargeFrame=e=>{let t=Math.min(48,e-this._lastFrameMs);this._lastFrameMs=e;let s=this._holdState.phase;this._holdState=Va(this._holdState,t,this._config);let n=Ga(this._holdState,this._config);if(n.length>0&&(this._holdState=Ya(this._holdState,n),this._onStagesCrossed()),this._paintProgress(this._displayProgress()),s!=="completed"&&this._holdState.phase==="completed"){this._onCompleted();return}this._holdState.phase==="charging"||this._holdState.phase==="draining"?this._rafId=requestAnimationFrame(this._chargeFrame):(this._rafId=null,this.requestUpdate())};this.label="Hold to feed",this.variant="feed",this.disabled=!1,this.holdMs=1500,this.pending=!1}static{this.properties={label:{type:String},variant:{type:String},disabled:{type:Boolean},holdMs:{type:Number,attribute:"hold-ms"},pending:{type:Boolean}}}disconnectedCallback(){super.disconnectedCallback(),this._stopChargeLoop(),clearTimeout(this._settleTimer),clearTimeout(this._staticGlowTimer),this._holdState=ni,this._pointerId=null}firstUpdated(){this._paintProgress(0)}updated(e){e.has("disabled")&&this.disabled&&this._release(),e.has("holdMs")&&(this._config={...or,durationMs:this._duration()})}_duration(){return Number.isFinite(this.holdMs)&&this.holdMs>0?this.holdMs:1500}_prefersReducedMotion(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0}_emblemTemplate(){let e=this._dotRefs.map((t,s)=>{let n=s/this._dotRefs.length*Math.PI*2,o=(24+Math.cos(n)*21).toFixed(2),a=(24+Math.sin(n)*21).toFixed(2);return D`<circle ${P(t)} class="dot" cx=${o} cy=${a} r="1.8"></circle>`});return D`
      <svg viewBox="0 0 48 48">
        <circle class="ring-static" cx="24" cy="24" r="21"></circle>
        <g class="spin">
          <circle ${P(this._ringRef)} class="stroke" cx="24" cy="24" r="21" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></circle>
          <g class="dots">${e}</g>
        </g>
        <g class="spin2">
          <polygon ${P(this._triangle1Ref)} class="stroke" points="24,8 37.9,32 10.1,32" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></polygon>
          <polygon ${P(this._triangle2Ref)} class="stroke" points="24,40 10.1,16 37.9,16" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></polygon>
        </g>
        <circle class="core" cx="24" cy="24" r="3"></circle>
      </svg>
    `}render(){let e=this.variant==="feed",t=this._holdState.phase,s=["button",e?"feed":"cancel",t==="charging"?"holding":"",this._completed?"completed":"",e&&this.pending?"pending":"",this._reducedMotion?"reduced-motion":""].filter(Boolean).join(" "),n=t==="charging"?`${this.label}. Keep holding to continue.`:this.label;return c`
      <div class="frame">
        <button
          type="button"
          ${P(this._buttonRef)}
          class=${s}
          aria-label=${n}
          ?disabled=${this.disabled}
          @pointerdown=${e?this._onPointerDown:void 0}
          @pointerup=${e?this._onPointerUp:void 0}
          @pointerleave=${e?this._onPointerUp:void 0}
          @pointercancel=${e?this._onPointerUp:void 0}
          @lostpointercapture=${e?this._onPointerUp:void 0}
          @keydown=${e?this._onKeyDown:void 0}
          @keyup=${e?this._onKeyUp:void 0}
          @blur=${e?this._onBlur:void 0}
          @click=${e?void 0:this._tapActivate}
          @contextmenu=${this._suppressOsGesture}
          @selectstart=${this._suppressOsGesture}
          @dragstart=${this._suppressOsGesture}
        >
          ${e?c`
                <span class="clip"><span class="fill"></span><span class="edge"></span></span>
                <span class="emblem">${this._emblemTemplate()}</span>
                <span class="shock" ${P(this._shockRef)} aria-hidden="true"></span>
                <span class="flash" aria-hidden="true"></span>
                <span class="label">
                  <span class="label-text">${this.label}</span>
                  <span class="label-check" aria-hidden="true">${y("check")}</span>
                </span>
              `:c`<span class="tap-flash" ${P(this._tapFlashRef)} aria-hidden="true"></span>
                <span class="label"><span class="label-text">${this.label}</span></span>`}
        </button>
      </div>
    `}_begin(){this._reducedMotion=this._prefersReducedMotion(),this._config={...or,durationMs:this._duration()},this._holdState=qa(),this._completed=!1,clearTimeout(this._settleTimer),this.requestUpdate(),this._paintProgress(0),this._lastFrameMs=performance.now(),this._stopChargeLoop(),this._rafId=requestAnimationFrame(this._chargeFrame)}_release(){this._releasePointerCapture(),this._pointerId=null,this._holdState.phase==="charging"&&(this._holdState=Wa(this._holdState,this._config),this.requestUpdate())}_releasePointerCapture(){let e=this._pointerId,t=this._buttonRef.value;if(!(e===null||!t))try{t.hasPointerCapture(e)&&t.releasePointerCapture(e)}catch{}}_playTapPulse(){let e=this._buttonRef.value,t=this._tapFlashRef.value;e?.classList.remove("tap-pulse"),t?.classList.remove("flash-pulse"),e?.offsetWidth,e?.classList.add("tap-pulse"),t?.classList.add("flash-pulse")}_activate(){this.dispatchEvent(new CustomEvent("activate",{bubbles:!0,composed:!0}))}_stopChargeLoop(){this._rafId!=null&&cancelAnimationFrame(this._rafId),this._rafId=null}_displayProgress(){let e=ar(this._holdState,this._config);if(this._holdState.phase!=="draining"||this._config.drainMs<=0)return e;let t=this._holdState.releaseProgress;if(t<=0)return 0;let s=Math.min(1,this._holdState.elapsedMs/this._config.drainMs);return t*(1-Wp(s))}_tierColor(e){let t=0;for(let s of this._config.stageThresholds)e>=s&&(t+=1);return Za[Math.min(t,Za.length-1)]}_paintProgress(e){let t=this._buttonRef.value;if(!t)return;let s=Math.max(0,Math.min(1,e)),n=this._tierColor(s);t.style.setProperty("--p",s.toFixed(4)),t.style.setProperty("--c",n);let o=Ka(this._holdState,this._config)&&!this._reducedMotion;t.classList.toggle("tense",o);let a=(u,h)=>Math.max(0,Math.min(1,(s-u)/(h-u))),l=u=>(100-u*100).toFixed(2);this._ringRef.value?.setAttribute("stroke-dashoffset",l(a(0,.45))),this._triangle1Ref.value?.setAttribute("stroke-dashoffset",l(a(.3,.7))),this._triangle2Ref.value?.setAttribute("stroke-dashoffset",l(a(.6,.95))),this._dotRefs.forEach((u,h)=>{u.value?.classList.toggle("lit",s>=(h+1)/(this._dotRefs.length+1))})}_onStagesCrossed(){st("light"),this._pulseShock(!1)}_pulseShock(e){let t=this._shockRef.value;if(t){if(clearTimeout(this._staticGlowTimer),t.classList.remove("go","static"),t.classList.toggle("complete",e),t.offsetWidth,this._reducedMotion){t.classList.add("static"),this._staticGlowTimer=window.setTimeout(()=>t.classList.remove("static","complete"),e?Vp:qp);return}t.classList.add("go")}}_onCompleted(){this._releasePointerCapture(),this._pointerId=null,this._completed=!0,this.requestUpdate(),st("success"),this._pulseShock(!0),this._activate(),this._settleTimer=window.setTimeout(()=>{this._completed=!1,this._holdState=ni,this._paintProgress(0),this.requestUpdate()},Up)}static{this.styles=w`
    :host {
      display: block;
      /* The pill sits on the card, not floating free of it: base/edge/text all derive from the
       * card's own theme variables, mixed so the pill reads as slightly raised in both a dark
       * and a light theme rather than only working for the one it was tuned against. */
      --kibble-pill-surface: var(--ha-card-background, var(--card-background-color, #1e2533));
      --kibble-pill-ink: var(--primary-text-color, #eef2f7);
      --kibble-pill-edge: var(--divider-color, color-mix(in srgb, var(--kibble-pill-ink) 16%, transparent));
    }
    .frame {
      position: relative;
      display: block;
    }
    .button {
      position: relative;
      z-index: 1;
      width: 100%;
      height: var(--kibble-feed-button-height, 56px);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      isolation: isolate;
      /* Not clipped: the shock glow and the emblem's completion flare both need to bloom a few
       * pixels past the pill's own rounded edge. Only .clip (the fill + edge line) is cropped. */
      overflow: visible;
      cursor: pointer;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      outline: none;
      font: inherit;
      font-size: var(--kibble-feed-label-size, 18px);
      font-weight: 700;
      background: color-mix(in srgb, var(--kibble-pill-surface) 92%, var(--kibble-pill-ink) 8%);
      border: 1px solid var(--kibble-pill-edge);
      color: var(--kibble-pill-ink);
      --kibble-glow: color-mix(
        in srgb,
        color-mix(in srgb, var(--c, #34d3c3) 60%, var(--accent-color, var(--primary-color, #34d3c3)) 40%) 82%,
        var(--kibble-pill-surface) 18%
      );
      box-shadow:
        0 1px 0 0 rgba(255, 255, 255, 0.14) inset,
        0 3px 10px 0 rgba(0, 0, 0, 0.16),
        0 0 calc(var(--p, 0) * 9px) color-mix(in srgb, var(--kibble-glow) calc(var(--p, 0) * 45%), transparent);
      transition: transform 140ms cubic-bezier(0.3, 1.5, 0.5, 1), box-shadow 200ms ease, background 160ms ease, color 160ms ease;
    }
    .button.holding {
      transform: scale(0.975);
    }
    .button.tense {
      animation: kibble-seal-tense 80ms linear infinite;
    }
    .button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .button.completed {
      background: linear-gradient(135deg, #f2c14e, #f6da8a);
      border-color: transparent;
      color: #2a1d00;
      animation: kibble-seal-pop 380ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .clip {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      overflow: hidden;
    }
    .fill {
      position: absolute;
      inset: 0;
      transform-origin: left;
      transform: scaleX(var(--p, 0));
      background: linear-gradient(90deg, color-mix(in srgb, var(--c, #34d3c3) 16%, transparent), color-mix(in srgb, var(--c, #34d3c3) 46%, transparent));
    }
    .button.completed .fill {
      background: transparent;
    }
    .edge {
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(var(--p, 0) * 100% - 1px);
      width: 3px;
      background: var(--c, #34d3c3);
      box-shadow: 0 0 9px 2px var(--c, #34d3c3);
      opacity: calc(min(0.85, var(--p, 0) * 6));
    }
    .button.completed .edge {
      opacity: 0;
    }
    .emblem {
      position: absolute;
      left: ${oi}px;
      top: 50%;
      transform: translateY(-50%);
      width: calc(var(--kibble-feed-button-height, 56px) - ${oi*2}px);
      height: calc(var(--kibble-feed-button-height, 56px) - ${oi*2}px);
      z-index: 2;
      pointer-events: none;
    }
    .emblem svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .ring-static {
      fill: none;
      stroke: currentColor;
      stroke-opacity: 0.16;
      stroke-width: 1.5;
    }
    .stroke {
      fill: none;
      stroke: var(--c, #34d3c3);
      stroke-width: 1.8;
      filter: drop-shadow(0 0 1.8px var(--c, #34d3c3));
    }
    .spin {
      transform-origin: 24px 24px;
      animation: kibble-seal-spin 8s linear infinite;
    }
    .spin2 {
      transform-origin: 24px 24px;
      animation: kibble-seal-spin 5s linear infinite reverse;
    }
    .button.holding .spin {
      animation-duration: 1.6s;
    }
    .button.holding .spin2 {
      animation-duration: 1.2s;
    }
    .dots .dot {
      fill: color-mix(in srgb, currentColor 22%, transparent);
      transition: fill 140ms ease;
    }
    .dots .dot.lit {
      fill: currentColor;
    }
    .core {
      fill: var(--c, #34d3c3);
    }
    .button.completed .emblem {
      animation: kibble-seal-flare 700ms cubic-bezier(0.2, 0.8, 0.3, 1);
    }
    .button.pending .emblem {
      animation: kibble-seal-pulse 1.8s ease-in-out infinite;
    }
    .shock {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: 0;
      box-shadow: 0 0 0 0 transparent;
      pointer-events: none;
    }
    .shock.go {
      animation: kibble-seal-shock 560ms cubic-bezier(0.2, 0.7, 0.3, 1);
    }
    .shock.go.complete {
      animation-name: kibble-seal-shock-complete;
    }
    .shock.static {
      opacity: 0.3;
      box-shadow: 0 0 6px 2px var(--kibble-glow, #34d3c3);
    }
    .shock.static.complete {
      opacity: 0.4;
      box-shadow: 0 0 7px 2px var(--kibble-glow, #34d3c3);
    }
    .flash {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: color-mix(in srgb, var(--kibble-glow, #f7c948) 70%, white 30%);
      opacity: 0;
      pointer-events: none;
      z-index: 3;
    }
    .button.completed .flash {
      animation: kibble-seal-flash 480ms ease-out;
    }
    .button.cancel {
      --kibble-glow: color-mix(in srgb, var(--accent-color, var(--primary-color, #34d3c3)) 78%, var(--kibble-pill-surface) 22%);
      transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 140ms ease;
    }
    .button.cancel:active {
      transform: scale(0.97);
    }
    .tap-flash {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: color-mix(in srgb, var(--kibble-glow, var(--primary-color, #34d3c3)) 65%, white 25%);
      opacity: 0;
      pointer-events: none;
    }
    .tap-flash.flash-pulse {
      animation: kibble-tap-flash 260ms ease-out;
    }
    .button.tap-pulse {
      animation: kibble-tap-pulse 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .label {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 100%;
      user-select: none;
      -webkit-user-select: none;
      pointer-events: none;
    }
    /* Nudged right of true-centre by the emblem's own footprint, so the text optically balances
     * against it instead of sitting dead-centre and crowding it. Cancel has no emblem. */
    .button.feed .label {
      padding-left: calc(${oi}px + (var(--kibble-feed-button-height, 56px) - ${oi*2}px) + 8px);
    }
    .label-text {
      transition: opacity 180ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .label-check {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35em;
      opacity: 0;
      transform: scale(0.4);
      transition: opacity 180ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .button.completed .label-text {
      opacity: 0;
      transform: scale(0.85);
    }
    .button.completed .label-check {
      opacity: 1;
      transform: scale(1);
    }
    @media (prefers-reduced-motion: reduce) {
      .button {
        transition: box-shadow 160ms ease, background 160ms ease, color 160ms ease;
      }
      .button.holding,
      .button.cancel:active {
        transform: none;
      }
      .button.tense,
      .spin,
      .spin2,
      .button.completed,
      .button.completed .emblem,
      .button.pending .emblem,
      .shock.go,
      .button.completed .flash,
      .tap-flash.flash-pulse,
      .button.tap-pulse {
        animation: none;
      }
      .label-text,
      .label-check {
        transition: opacity 180ms ease;
        transform: none !important;
      }
    }
    @keyframes kibble-seal-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes kibble-seal-tense {
      0% {
        translate: 0 0;
      }
      25% {
        translate: -1px 0.5px;
      }
      50% {
        translate: 1px -0.5px;
      }
      75% {
        translate: -0.5px -0.5px;
      }
      100% {
        translate: 0 0;
      }
    }
    @keyframes kibble-seal-shock {
      0% {
        opacity: 0.35;
        box-shadow: 0 0 0 0 var(--kibble-glow, #34d3c3);
      }
      60% {
        opacity: 0.28;
        box-shadow: 0 0 5px 1px var(--kibble-glow, #34d3c3);
      }
      100% {
        opacity: 0;
        box-shadow: 0 0 7px 2px var(--kibble-glow, #34d3c3);
      }
    }
    @keyframes kibble-seal-shock-complete {
      0% {
        opacity: 0.48;
        box-shadow: 0 0 1px 0 var(--kibble-glow, #f7c948);
      }
      55% {
        opacity: 0.4;
        box-shadow: 0 0 5px 2px var(--kibble-glow, #f7c948);
      }
      100% {
        opacity: 0;
        box-shadow: 0 0 6px 3px var(--kibble-glow, #f7c948);
      }
    }
    @keyframes kibble-seal-flash {
      0% {
        opacity: 0.32;
      }
      100% {
        opacity: 0;
      }
    }
    @keyframes kibble-seal-flare {
      0% {
        transform: translateY(-50%) scale(1);
      }
      40% {
        transform: translateY(-50%) scale(1.2);
      }
      100% {
        transform: translateY(-50%) scale(1);
      }
    }
    @keyframes kibble-seal-pulse {
      0%,
      100% {
        opacity: 0.6;
      }
      50% {
        opacity: 0.92;
      }
    }
    @keyframes kibble-seal-pop {
      0% {
        transform: scale(0.975);
      }
      45% {
        transform: scale(1.045);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes kibble-tap-pulse {
      0% {
        transform: scale(1);
      }
      40% {
        transform: scale(1.035);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes kibble-tap-flash {
      0% {
        opacity: 0;
      }
      30% {
        opacity: 0.16;
      }
      100% {
        opacity: 0;
      }
    }
  `}};customElements.define("kibble-hold-button",zs);function Pt(i){let r=/^(\d{1,2}):(\d{2})$/.exec(i.trim());if(!r)throw new Error(`Invalid schedule time "${i}"`);let e=Number(r[1]),t=Number(r[2]);if(e>23||t>59)throw new Error(`Invalid schedule time "${i}"`);return e*60+t}function Kp(i,r){let e=r.getHours()*60+r.getMinutes(),t=null;for(let s of i){if(!s.enabled)continue;let o=((Pt(s.time)-e)%1440+1440)%1440;(t===null||o<t.minutesUntil)&&(t={entry:s,minutesUntil:o})}return t}function ze(i,r){let e=Pt(i);return new Date(2e3,0,1,Math.floor(e/60),e%60).toLocaleTimeString(r,{hour:"numeric",minute:"2-digit"})}var Gp=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function Qa(i,r,e){if(i.length===0)return"No schedule set";let t=Kp(i,r);if(!t)return"All feeds paused";let s=i.filter(o=>o.enabled).length,n=Gp[s]??String(s);return`Next feed ${ze(t.entry.time,e)}, ${n} a day`}var ai=20;function Yp(i){return i===1?"1 portion":`${i} portions`}function nt(i,r){let e=r?.trim();return e||`Hopper ${i}`}function li(i,r,e,t){if(r)return Yp(Math.max(i.amount_l,i.amount_r));let s=[];return i.amount_l>0&&s.push(`${nt(1,e)} ${i.amount_l}`),i.amount_r>0&&s.push(`${nt(2,t)} ${i.amount_r}`),s.length>0?s.join(" + "):"No food"}function lr(i){return[...i].sort((r,e)=>Pt(r.time)-Pt(e.time))}function Bs(i){if(!/^\d{1,2}:\d{2}$/.test(i.time.trim()))return"Pick a time";try{Pt(i.time)}catch{return"Pick a time"}for(let r of[i.amount_l,i.amount_r])if(!Number.isInteger(r)||r<0||r>ai)return`Portions go from 0 to ${ai}`;return i.amount_l===0&&i.amount_r===0?"Pick at least one portion":null}function js(i){let r=Pt(i),e=String(Math.floor(r/60)).padStart(2,"0"),t=String(r%60).padStart(2,"0");return`${e}:${t}:00`}function Ja(i,r){return{device_id:i,time:js(r.time),hopper1_g:r.amount_l,hopper2_g:r.amount_r,enabled:!0}}function el(i,r,e){if(!i.some(t=>t.id===r))throw new Error("That feed was removed meanwhile. Reopen the schedule and try again.");return i.map(t=>t.id===r?{entry_id:t.id,time:js(e.time),hopper1_g:e.amount_l,hopper2_g:e.amount_r,enabled:t.enabled}:{entry_id:t.id,time:js(t.time),hopper1_g:t.amount_l,hopper2_g:t.amount_r,enabled:t.enabled})}function Ns(i){if(typeof i=="string"&&i.trim())return i.trim();if(typeof i=="object"&&i!==null){let r=i.message;if(typeof r=="string"&&r.trim())return r.trim()}return"Home Assistant did not accept the change"}var tl={time:"12:00",amount_l:1,amount_r:0},Us=class extends v{constructor(){super();this._openNew=()=>{this._error=null,this._confirmRemove=!1,this._draft={...tl},this._target="new"};this._closeForm=()=>{this._target=null,this._confirmRemove=!1};this._onTimeInput=e=>{this._draft={...this._draft,time:e.target.value}};this._onSubmit=e=>{e.preventDefault(),this._save()};this.entries=[],this.food1=null,this.food2=null,this._target=null,this._draft={...tl},this._confirmRemove=!1,this._busy=!1,this._error=null,this._toggling=new Set}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},deviceId:{type:String},food1:{type:String},food2:{type:String},_target:{state:!0},_draft:{state:!0},_confirmRemove:{state:!0},_busy:{state:!0},_error:{state:!0},_toggling:{state:!0}}}willUpdate(e){e.has("entries")&&this._target!==null&&this._target!=="new"&&!this.entries.some(t=>t.id===this._target)&&this._closeForm()}render(){let e=lr(this.entries);return c`
      ${this._error?c`<p class="error" role="alert">${this._error}</p>`:p}
      ${e.length===0&&this._target!=="new"?c`<p class="empty">No feeds scheduled</p>`:p}
      <ul class="entries">
        ${e.map(t=>c`<li>${this._target===t.id?this._renderForm(t):this._renderRow(t)}</li>`)}
      </ul>
      ${this._target==="new"?c`<div class="form-slot">${this._renderForm(null)}</div>`:c`
            <button type="button" class="add" ?disabled=${this._busy||!this.deviceId} @click=${this._openNew}>
              <span class="add-icon">${y("plus")}</span><span>Add feed</span>
            </button>
          `}
    `}_renderRow(e){let t=`${ze(e.time)}, ${li(e,!1,this.food1,this.food2)}, ${e.enabled?"on":"paused"}`;return c`
      <div class="row ${e.enabled?"":"paused"}">
        <button type="button" class="row-main" aria-label="Edit feed: ${t}" ?disabled=${this._busy} @click=${()=>this._openEdit(e)}>
          <span class="time">${ze(e.time)}</span>
          ${this._renderAmount(nt(1,this.food1),e.amount_l)} ${this._renderAmount(nt(2,this.food2),e.amount_r)}
        </button>
        <button
          type="button"
          class="switch ${e.enabled?"on":""}"
          role="switch"
          aria-checked=${e.enabled}
          aria-label="${ze(e.time)} feed ${e.enabled?"on":"paused"}"
          ?disabled=${this._busy||this._toggling.has(e.id)}
          @click=${()=>this._toggle(e)}
        >
          <span class="track"><span class="thumb"></span></span>
          <span class="switch-word">${e.enabled?"On":"Paused"}</span>
        </button>
      </div>
    `}_renderAmount(e,t){return c`
      <span class="amount ${t===0?"zero":""}">
        <span class="amount-name">${e}</span>
        <span class="amount-value">${t}</span>
      </span>
    `}_renderForm(e){if(e&&this._confirmRemove)return this._renderRemoveConfirm(e);let t=this._draft,s=Bs(t),n=nt(1,this.food1),o=nt(2,this.food2);return c`
      <form class="form" @submit=${this._onSubmit} novalidate>
        <h3>${e?"Edit feed":"Add feed"}</h3>
        <label class="field">
          <span class="field-label">Time</span>
          <input type="time" step="60" required .value=${t.time} ?disabled=${this._busy} @input=${this._onTimeInput} />
        </label>
        <div class="field">
          <span class="field-label">${n}</span>
          <kibble-stepper
            .value=${t.amount_l}
            .min=${0}
            .max=${ai}
            aria-label="${n} portions"
            ?disabled=${this._busy}
            @value-selected=${a=>this._setAmount("amount_l",a)}
          ></kibble-stepper>
        </div>
        <div class="field">
          <span class="field-label">${o}</span>
          <kibble-stepper
            .value=${t.amount_r}
            .min=${0}
            .max=${ai}
            aria-label="${o} portions"
            ?disabled=${this._busy}
            @value-selected=${a=>this._setAmount("amount_r",a)}
          ></kibble-stepper>
        </div>
        ${s?c`<p class="hint" role="status">${s}</p>`:p}
        <div class="actions">
          ${e?c`<button type="button" class="btn danger-text" ?disabled=${this._busy} @click=${()=>this._confirmRemove=!0}>
                <span class="btn-icon">${y("deleteOutline")}</span><span>Remove</span>
              </button>`:p}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${this._busy} @click=${this._closeForm}>Cancel</button>
          <button type="submit" class="btn primary" ?disabled=${this._busy||s!==null}>${this._busy?"Saving\u2026":"Save"}</button>
        </div>
      </form>
    `}_renderRemoveConfirm(e){return c`
      <div class="form" role="alertdialog" aria-label="Remove this feed?">
        <h3>Remove the ${ze(e.time)} feed?</h3>
        <p class="confirm-text">
          ${li(e,!1,this.food1,this.food2)} will no longer be given at that time. This cannot be undone.
        </p>
        <div class="actions">
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${this._busy} @click=${()=>this._confirmRemove=!1}>Keep</button>
          <button type="button" class="btn danger" ?disabled=${this._busy} @click=${()=>this._remove(e)}>
            ${this._busy?"Removing\u2026":"Remove feed"}
          </button>
        </div>
      </div>
    `}_openEdit(e){this._error=null,this._confirmRemove=!1,this._draft={time:e.time.padStart(5,"0"),amount_l:e.amount_l,amount_r:e.amount_r},this._target=e.id}_setAmount(e,t){t.stopPropagation(),this._draft={...this._draft,[e]:t.detail.value}}async _run(e,t){this._error=null,this._busy=!0;try{return await t(),!0}catch(s){return this._error=`${e}: ${Ns(s)}`,!1}finally{this._busy=!1}}async _save(){let e=this._target;if(e===null||Bs(this._draft)!==null)return;let t=this.deviceId;if(!t){this._error="Could not save the feed: the feeder was not found";return}let s=this._draft;await this._run("Could not save the feed",()=>e==="new"?this.hass.callService("kibble","schedule_add",Ja(t,s)):this.hass.callService("kibble","schedule_set",{device_id:t,entries:el(this.entries,e,s)}))&&(st("success"),this._closeForm())}async _remove(e){let t=this.deviceId;if(!t){this._error="Could not remove the feed: the feeder was not found";return}await this._run("Could not remove the feed",()=>this.hass.callService("kibble","schedule_remove",{device_id:t,entry_id:e.id}))&&this._closeForm()}async _toggle(e){let t=this.deviceId;if(t){this._error=null,this._toggling=new Set(this._toggling).add(e.id);try{await this.hass.callService("kibble","schedule_set_enabled",{device_id:t,entry_id:e.id,enabled:!e.enabled})}catch(s){this._error=`Could not ${e.enabled?"pause":"turn on"} the feed: ${Ns(s)}`}finally{let s=new Set(this._toggling);s.delete(e.id),this._toggling=s}}}static{this.styles=w`
    :host {
      display: block;
    }
    .entries {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    .entries li {
      border-top: 1px solid var(--divider-color);
    }
    .entries li:first-child {
      border-top: none;
    }
    .empty {
      margin: 0 0 8px;
      color: var(--secondary-text-color);
      font-size: var(--kibble-schedule-size, 14px);
    }
    .error {
      margin: 0 0 8px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: var(--kibble-schedule-size, 14px);
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .row.paused .time,
    .row.paused .amount-value {
      color: var(--secondary-text-color);
    }
    .row-main {
      flex: 1;
      min-width: 0;
      display: grid;
      grid-template-columns: 4.6em 1fr 1fr;
      align-items: center;
      gap: 8px;
      min-height: var(--kibble-touch-target, 48px);
      padding: 6px 0;
      background: none;
      border: none;
      font: inherit;
      color: var(--primary-text-color);
      text-align: left;
      cursor: pointer;
    }
    .time {
      font-size: 16px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .amount {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .amount-name {
      font-size: 12px;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .amount-value {
      font-size: 16px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .amount.zero .amount-value {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .switch {
      flex: none;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: var(--kibble-touch-target, 48px);
      padding: 0 0 0 4px;
      background: none;
      border: none;
      font: inherit;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .switch-word {
      min-width: 3.6em;
      text-align: left;
    }
    .track {
      position: relative;
      width: 40px;
      height: 24px;
      border-radius: 12px;
      background: var(--divider-color);
      transition: background 0.15s ease;
    }
    .thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      transition: transform 0.15s ease;
    }
    .switch.on .track {
      background: var(--kibble-feed, #43a96a);
    }
    .switch.on .thumb {
      transform: translateX(16px);
    }
    button:disabled {
      cursor: default;
      opacity: 0.5;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--kibble-amber-dark, #de8a3a);
      outline-offset: 2px;
    }
    .add {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      min-height: var(--kibble-touch-target, 48px);
      padding: 0 12px 0 0;
      background: none;
      border: none;
      font: inherit;
      font-size: var(--kibble-schedule-size, 14px);
      font-weight: 600;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .add-icon {
      display: flex;
      font-size: 20px;
    }
    .form-slot {
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 8px 0;
      padding: 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .field-label {
      min-width: 0;
      font-size: var(--kibble-schedule-size, 14px);
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    input[type="time"] {
      min-height: 44px;
      box-sizing: border-box;
      padding: 0 12px;
      border: 2px solid var(--divider-color);
      border-radius: 8px;
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      font-size: 16px;
      font-variant-numeric: tabular-nums;
    }
    kibble-stepper {
      flex: none;
    }
    .hint {
      margin: 0;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .confirm-text {
      margin: 0;
      font-size: var(--kibble-schedule-size, 14px);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .spacer {
      flex: 1;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 44px;
      padding: 0 16px;
      border-radius: 8px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .btn.primary {
      border-color: transparent;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .btn.danger {
      border-color: transparent;
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .btn.danger-text {
      border-color: transparent;
      padding: 0 8px;
      color: var(--error-color, #db4437);
    }
    .btn-icon {
      display: flex;
      font-size: 18px;
    }
    @media (prefers-reduced-motion: reduce) {
      .track,
      .thumb {
        transition: none;
      }
    }
  `}};customElements.define("kibble-schedule-editor",Us);var qs="dispenser-schedule-card",Vs=class extends v{constructor(){super();this._expanded=!1;this._embedRef=T();this._configureEmbed=e=>{if(!e||!this.scheduleCardStateEntity)return;let t=e.querySelector(qs);if(t){t.hass=this.hass;return}let s=document.createElement(qs);s.setConfig({type:"custom:dispenser-schedule-card",device:{type:"custom",entity:this.scheduleCardStateEntity,max_entries:24,min_amount:1,max_amount:20,step_amount:1,status_map:["0 -> dispensed","1 -> failed","2 -> pending","3 -> dispensing"],status_pattern:"(?<id>[^,]+),(?<hour>[0-9]{1,2}),(?<minute>[0-9]{1,2}),(?<amount>[0-9]{1,2}),(?<status>[0-9]);?",actions:{add:"kibble.schedule_card_add",edit:"kibble.schedule_card_edit",remove:"kibble.schedule_card_remove",toggle:"kibble.schedule_card_toggle"}},unit_of_measurement:{one:"portion",other:"portions"}}),s.hass=this.hass,e.appendChild(s)};this.entries=[],this.deviceName="Kibble",this.singleHopper=!1,this.food1=null,this.food2=null}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},scheduleCardStateEntity:{type:String},deviceName:{type:String},singleHopper:{type:Boolean},deviceId:{type:String},food1:{type:String},food2:{type:String}}}updated(){this._embedRef.value&&this.hass&&(this._embedRef.value.hass=this.hass)}render(){let e=new Date,t=Qa(this.entries,e);return c`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${t}</span>
        <span class="chevron ${this._expanded?"open":""}">${y("chevronDown")}</span>
      </button>
      ${this._expanded?c`<div class="expanded">${this._renderExpanded()}</div>`:p}
    `}_renderExpanded(){if(!this.singleHopper)return c`<kibble-schedule-editor
        .hass=${this.hass}
        .entries=${this.entries}
        .deviceId=${this.deviceId}
        .food1=${this.food1}
        .food2=${this.food2}
      ></kibble-schedule-editor>`;if(this._canEmbed())return c`<div ${P(this._configureEmbed)}></div>`;if(this.entries.length===0)return c`<p class="empty">No schedule set</p>`;let e=lr(this.entries);return c`
      <ul class="entries">
        ${e.map(t=>c`
            <li class=${t.enabled?"":"disabled"}>
              <span class="time">${ze(t.time)}</span>
              <span class="amounts">${li(t,!0)}</span>
              <span class="state">${t.enabled?"On":"Paused"}</span>
            </li>
          `)}
      </ul>
    `}_canEmbed(){if(!customElements.get(qs)||!this.scheduleCardStateEntity)return!1;let e=this.hass?.states[this.scheduleCardStateEntity];return e!==void 0&&e.state!=="unavailable"}_toggle(){this._expanded=!this._expanded,this.requestUpdate()}static{this.styles=w`
    :host {
      display: block;
    }
    .row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: none;
      border: none;
      padding: 10px 4px;
      min-height: var(--kibble-touch-target, 48px);
      font: inherit;
      font-size: var(--kibble-schedule-size, 14px);
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .chevron {
      display: flex;
      color: var(--secondary-text-color);
      transition: transform 0.15s ease;
    }
    .chevron.open {
      transform: rotate(180deg);
    }
    .expanded {
      padding: 0 4px 8px;
    }
    .empty {
      color: var(--secondary-text-color);
      font-size: var(--kibble-schedule-size, 14px);
      margin: 0;
    }
    .entries {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .entries li {
      display: flex;
      gap: 10px;
      align-items: baseline;
      font-size: var(--kibble-schedule-size, 14px);
      color: var(--primary-text-color);
    }
    .entries li.disabled {
      color: var(--secondary-text-color);
      text-decoration: line-through;
      text-decoration-color: var(--divider-color);
    }
    .entries .time {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      min-width: 3.5em;
    }
    .entries .amounts {
      flex: 1;
    }
    .entries .state {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
  `}};customElements.define("kibble-schedule-summary",Vs);var Xp="calibration_busy";function Ws(i){return`${i} portion${i===1?"":"s"}`}function cr(i){return String(Math.round(i*100))}var Ks=class extends v{constructor(){super();this._closeButtonRef=T();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&this._close()};this._loadCalibration=()=>{let e=this.hass?.callWS,t=this.entryId;if(!e||!t){this._loadError="Not connected.";return}this._loading=!0,this._loadError=null,e({type:"kibble/calibration",entry_id:t}).then(s=>{this._calibration=s,this._loading=!1},s=>{this._loadError=q(s),this._loading=!1})};this._confirmEmpty=()=>{if(this._hopper===null)return;let e=this._hopper,t=this._note.trim();this._runAction({action:"begin",hopper:e,...t?{note:t}:{}},this._confirmEmpty,()=>{this._runAction({action:"point",hopper:e,portions:0},this._confirmEmpty,s=>{this._calibration=s,this._regression=null,this._step=Ee(this._step,"empty-confirmed")})})};this._capturePoint=()=>{if(this._hopper===null)return;let e=this._hopper,t=this._hopperData(e)?.points??[],s=(t[t.length-1]?.portions??0)+1;this._runAction({action:"point",hopper:e,portions:s},this._capturePoint,n=>{let o=n.hoppers[e]?.points.find(a=>a.portions===s);this._regression=o?wa(t,o):null,this._calibration=n,this._step=Ee(this._step,"capture")})};this._confirmMarkFull=()=>{if(this._hopper===null||this._markFullPortions===null)return;let e=this._hopper,t=this._markFullPortions;this._runAction({action:"full",hopper:e,portions:t},this._confirmMarkFull,s=>{this._calibration=s,this._step=this.singleHopper?"done":Ee(this._step,"full-marked")})};this._acceptInherit=()=>{if(this._hopper===null)return;let e=this._hopper,t=e===0?1:0;this._runAction({action:"inherit",hopper:t,from:e},this._acceptInherit,s=>{this._calibration=s,this._inheritedTo=t,this._step=Ee(this._step,"inherit-resolved")})};this._runClear=()=>{if(this._hopper===null)return;let e=this._hopper;this._runAction({action:"clear",hopper:e},this._runClear,t=>{this._calibration=t})};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.singleHopper=!1,this.food1=null,this.food2=null,this.entryId=void 0,this._resetWizard()}static{this.properties={hass:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},_step:{state:!0},_hopper:{state:!0},_calibration:{state:!0},_loading:{state:!0},_loadError:{state:!0},_note:{state:!0},_busy:{state:!0},_error:{state:!0},_waitingForBowl:{state:!0},_regression:{state:!0},_markFullPortions:{state:!0},_clearConfirmArmed:{state:!0},_inheritedTo:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),clearTimeout(this._clearConfirmTimer)}updated(e){e.has("open")&&this.open&&(this._resetWizard(),this._closeButtonRef.value?.focus(),this._loadCalibration())}_resetWizard(){this._step="choose-hopper",this._hopper=null,this._calibration=null,this._loading=!1,this._loadError=null,this._note="",this._busy=!1,this._error=null,this._waitingForBowl=!1,this._regression=null,this._markFullPortions=null,this._clearConfirmArmed=!1,this._inheritedTo=null}_hopperData(e){return e===null||!this._calibration?null:this._calibration.hoppers[e]}_runAction(e,t,s){let n=this.hass?.callWS,o=this.entryId;!n||!o||(this._busy=!0,this._error=null,this._waitingForBowl=!1,n({type:"kibble/calibration/action",entry_id:o,...e}).then(a=>{this._busy=!1,s(a),this.dispatchEvent(new CustomEvent("calibration-changed",{bubbles:!0,composed:!0}))},a=>{if(this._busy=!1,a?.code===Xp){this._waitingForBowl=!0;return}this._error={message:q(a),retry:t}}))}_selectHopper(e){this._hopper=e,this._error=null}_beginRequested(){this._note="",this._step=Ee(this._step,"start")}_reviewFull(){this._markFullPortions=null,this._step=Ee(this._step,"review-full")}_declineInherit(){this._inheritedTo=null,this._step=Ee(this._step,"inherit-resolved")}_clearRequested(){if(this._clearConfirmArmed){clearTimeout(this._clearConfirmTimer),this._clearConfirmArmed=!1,this._runClear();return}this._clearConfirmArmed=!0,this._clearConfirmTimer=setTimeout(()=>{this._clearConfirmArmed=!1},3e3)}_restart(){let e=this._hopper===0?1:this._hopper===1?0:null;this._step=Ee(this._step,"restart"),this._hopper=e,this._note="",this._markFullPortions=null,this._regression=null,this._inheritedTo=null,this._clearConfirmArmed=!1}render(){return this.open?c`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Calibrate bowl">
        <div class="sheet" @click=${e=>e.stopPropagation()}>
          <header>
            <span>Calibrate bowl</span>
            <button type="button" class="icon-button" ${P(this._closeButtonRef)} @click=${this._close} aria-label="Close">${y("close")}</button>
          </header>
          <div class="body">
            ${!this.hass?.callWS||!this.entryId?c`<p class="hint">Calibration isn't available right now.</p>`:this._renderStep()}
          </div>
        </div>
      </div>
    `:p}_renderStep(){switch(this._step){case"choose-hopper":return this._renderChooseHopper();case"confirm-empty":return this._renderConfirmEmpty();case"collecting":return this._renderCollecting();case"mark-full":return this._renderMarkFull();case"offer-inherit":return this._renderOfferInherit();case"done":return this._renderDone()}}_hopperLabel(e){return this.singleHopper?"Hopper":`Hopper ${e+1}`}_hopperRowLabel(e){let t=this._hopperLabel(e);if(this.singleHopper)return t;let s=(e===0?this.food1:this.food2)?.trim();return s?`${t} \xB7 ${s}`:t}_renderChooseHopper(){if(this._loading)return c`<p class="hint">Loading calibration\u2026</p>`;if(this._loadError)return c`
        <div class="error">
          <span>Couldn't load calibration. ${this._loadError}</span>
          <button type="button" @click=${this._loadCalibration}>Try again</button>
        </div>
      `;let e=this.singleHopper?[0]:[0,1];return c`
      <p class="hint">
        ${this.singleHopper?"Dispensing known portions into an empty bowl builds the curve your fill reading is interpreted against.":"Pick a hopper. Each side keeps its own curve, since the two hoppers can hold different food."}
      </p>
      <div class="hopper-rows">${e.map(t=>this._renderHopperRow(t))}</div>
      ${this._hopper!==null?this._renderHopperActions(this._hopper):p}
    `}_renderHopperRow(e){let t=ri(this._hopperData(e));return c`
      <button type="button" class="hopper-row ${this._hopper===e?"selected":""}" @click=${()=>this._selectHopper(e)}>
        <span class="hopper-row-label">${this._hopperRowLabel(e)}</span>
        <span class="hopper-row-status">${this._statusLine(t)}</span>
        ${t.note?c`<span class="hopper-row-note">${t.note}</span>`:p}
      </button>
    `}_statusLine(e){if(e.kind==="never")return"Never calibrated";let t=e.measuredAt?Tt(new Date(e.measuredAt*1e3),new Date):null,s=e.finished?"":" (unfinished)";return e.kind==="inherited"?`Inherited from Hopper ${e.inheritedFromDisplay}${t?` \xB7 ${t}`:""}${s}`:`Measured${t?` ${t}`:""}${s}`}_renderHopperActions(e){let t=ri(this._hopperData(e)),s=this._hopperLabel(e);return t.kind==="never"?c`<button type="button" class="primary" @click=${()=>this._beginRequested()}>Calibrate ${s}</button>`:c`
      <div class="hopper-actions">
        <button type="button" class="danger ${this._clearConfirmArmed?"confirming":""}" ?disabled=${this._busy} @click=${()=>this._clearRequested()}>
          ${this._clearConfirmArmed?"Tap again to clear":"Clear calibration"}
        </button>
        <button type="button" class="primary" @click=${()=>this._beginRequested()}>Recalibrate ${s}</button>
      </div>
      ${this._renderError()}
    `}_renderConfirmEmpty(){let e=this._hopper;if(e===null)return p;let t=this._hopperLabel(e),s=ri(this._hopperData(e)).kind!=="never";return c`
      <p class="hint">Make sure ${t}'s side of the bowl is completely empty, then start.</p>
      ${s?c`<div class="warning">Starting discards ${t}'s existing calibration.</div>`:p}
      <label class="field">
        <span>What food is this? (optional)</span>
        <input
          type="text"
          .value=${this._note}
          placeholder="e.g. freeze-dried on this side"
          @input=${n=>{this._note=n.target.value}}
        />
      </label>
      ${this._waitingForBowl?this._renderWaitingForBowl():p}
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._confirmEmpty}>${this._busy?"Starting\u2026":"Bowl is empty, start"}</button>
      </div>
    `}_renderCollecting(){let e=this._hopper;if(e===null)return p;let t=this._hopperData(e)?.points??[];return c`
      <p class="hint">Dispense one portion into ${this._hopperLabel(e)}'s side yourself, then capture the reading.</p>
      ${this._renderCurve(t)}
      ${this._regression?c`<div class="warning">
            This step's score (${cr(this._regression.newScore)}) is lower than the previous step's (${cr(this._regression.previousScore)}). A
            curve that dips can't be interpolated. Recapture this step before continuing.
          </div>`:p}
      ${this._waitingForBowl?this._renderWaitingForBowl():p}
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy||!xa(t)} @click=${()=>this._reviewFull()}>This is full</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._capturePoint}>${this._busy?"Capturing\u2026":"Capture reading"}</button>
      </div>
    `}_renderCurve(e){return e.length===0?p:c`
      <ul class="curve">
        ${e.map((t,s)=>{let n=s>0?e[s-1]:null,o=n!==null&&t.score<n.score;return c`
            <li class="curve-row ${o?"dropped":""}">
              <span>${Ws(t.portions)}</span>
              <span class="score">${cr(t.score)}</span>
            </li>
          `})}
      </ul>
    `}_renderMarkFull(){let e=this._hopper;if(e===null)return p;let t=(this._hopperData(e)?.points??[]).filter(s=>s.portions>0);return c`
      <p class="hint">Which step looked full?</p>
      <ul class="curve selectable">
        ${t.map(s=>c`
            <li>
              <button type="button" class="curve-choice ${this._markFullPortions===s.portions?"selected":""}" @click=${()=>this._markFullPortions=s.portions}>
                <span>${Ws(s.portions)}</span>
                <span class="score">${cr(s.score)}</span>
              </button>
            </li>
          `)}
      </ul>
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy||this._markFullPortions===null} @click=${this._confirmMarkFull}>
          ${this._busy?"Saving\u2026":this._markFullPortions===null?"Mark full":`Mark full at ${Ws(this._markFullPortions)}`}
        </button>
      </div>
    `}_renderOfferInherit(){let e=this._hopper;if(e===null)return p;let t=e===0?1:0,s=ri(this._hopperData(t)).kind!=="never";return c`
      <p class="hint">${this._hopperLabel(e)} is calibrated.</p>
      <p class="hint">
        Copy this curve to ${this._hopperLabel(t)}? Only do this if it's the same food in both hoppers. This is a shortcut for
        "same food," not a second measurement.${s?c` This replaces ${this._hopperLabel(t)}'s existing calibration.`:p}
      </p>
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy} @click=${()=>this._declineInherit()}>Not now</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._acceptInherit}>${this._busy?"Copying\u2026":`Copy to ${this._hopperLabel(t)}`}</button>
      </div>
    `}_renderDone(){let e=this._hopper;return e===null?p:c`
      <p class="hint">${this._hopperLabel(e)} is calibrated.${this._inheritedTo!==null?c` Copied to ${this._hopperLabel(this._inheritedTo)} too.`:p}</p>
      <div class="actions">
        ${this.singleHopper?p:c`<button type="button" @click=${()=>this._restart()}>Calibrate the other hopper</button>`}
        <button type="button" class="primary" @click=${this._close}>Done</button>
      </div>
    `}_renderWaitingForBowl(){let e=this._step==="collecting"?this._capturePoint:this._confirmEmpty;return c`
      <div class="warning">
        <span>No clear bowl reading right now. Something may be in the way, or the feeder hasn't reported one yet. Try again in a moment.</span>
        <button
          type="button"
          @click=${()=>{this._waitingForBowl=!1,e()}}
        >
          Try again
        </button>
      </div>
    `}_renderError(){let e=this._error;return e?c`
      <div class="error">
        <span>${e.message}</span>
        <button
          type="button"
          @click=${()=>{this._error=null,e.retry()}}
        >
          Try again
        </button>
      </div>
    `:p}static{this.styles=w`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
      box-sizing: border-box;
    }
    @media (min-width: 480px) {
      .backdrop {
        align-items: center;
        padding: 24px;
      }
    }
    .sheet {
      width: 100%;
      max-width: 420px;
      max-height: 92vh;
      overflow-y: auto;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      border-radius: 16px 16px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 16px;
      font-weight: 600;
      position: sticky;
      top: 0;
      background: inherit;
    }
    .icon-button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .body {
      padding: 4px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .hint {
      margin: 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .field input {
      min-height: 44px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      padding: 0 12px;
      box-sizing: border-box;
    }
    .hopper-rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .hopper-row {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      width: 100%;
      min-height: 48px;
      padding: 10px 14px;
      border-radius: 10px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-sizing: border-box;
    }
    .hopper-row.selected {
      border-color: var(--primary-color, #03a9f4);
    }
    .hopper-row-label {
      font-weight: 600;
    }
    .hopper-row-status,
    .hopper-row-note {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .hopper-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .curve {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 220px;
      overflow-y: auto;
    }
    .curve-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      font-size: 13px;
      font-variant-numeric: tabular-nums;
    }
    .curve-row.dropped {
      background: color-mix(in srgb, var(--kibble-amber-dark, #de8a3a) 16%, transparent);
      color: var(--kibble-amber-dark, #de8a3a);
      font-weight: 600;
    }
    .curve .score {
      font-weight: 600;
    }
    .curve.selectable {
      gap: 6px;
    }
    .curve-choice {
      display: flex;
      justify-content: space-between;
      width: 100%;
      min-height: 44px;
      padding: 8px 12px;
      border-radius: 8px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      box-sizing: border-box;
    }
    .curve-choice.selected {
      border-color: var(--primary-color, #03a9f4);
    }
    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    button {
      min-height: 44px;
      border-radius: 8px;
      border: none;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      padding: 0 16px;
    }
    .actions button:not(.primary):not(.danger) {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
    }
    .primary {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
    }
    .danger {
      background: none;
      border: 2px solid var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .danger.confirming {
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .warning,
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
    }
    .warning {
      background: color-mix(in srgb, var(--kibble-amber-dark, #de8a3a) 12%, transparent);
      color: var(--kibble-amber-dark, #de8a3a);
    }
    .error {
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
    }
    .warning button,
    .error button {
      flex: 0 0 auto;
      min-height: 32px;
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 12px;
    }
  `}};customElements.define("kibble-calibration-dialog",Ks);function ot(i){return Math.min(1,Math.max(0,i))}function Ae(i,r,e){return e.width<=0||e.height<=0?{x:0,y:0}:{x:ot((i-e.left)/e.width),y:ot((r-e.top)/e.height)}}function ci(i,r){return[Math.min(i.x,r.x),Math.min(i.y,r.y),Math.max(i.x,r.x),Math.max(i.y,r.y)]}function je(i){return Math.max(0,i[2]-i[0])}function At(i){return Math.max(0,i[3]-i[1])}function il(i,r=.01){return je(i)>=r&&At(i)>=r}function dr(i){if(!Array.isArray(i)||i.length!==4)return null;let r=i.map(Number);if(r.some(t=>!Number.isFinite(t)))return null;let e=[r[0],r[1],r[2],r[3]];return e.some(t=>t<0||t>1)||je(e)<=0||At(e)<=0?null:e}function Gs(i){return Array.isArray(i)?i.flatMap(r=>{let e=dr(r);return e?[e]:[]}):[]}var rl=["nw","n","ne","e","se","s","sw","w"];function pr(i,r){let[e,t,s,n]=i,o=(e+s)/2,a=(t+n)/2;switch(r){case"nw":return{x:e,y:t};case"n":return{x:o,y:t};case"ne":return{x:s,y:t};case"e":return{x:s,y:a};case"se":return{x:s,y:n};case"s":return{x:o,y:n};case"sw":return{x:e,y:n};case"w":return{x:e,y:a}}}var Ys=.02;function Xs(i,r,e,t=Ys){let[s,n,o,a]=i,l=ot(e.x),u=ot(e.y);return(r==="nw"||r==="w"||r==="sw")&&(s=Math.min(l,o-t)),(r==="ne"||r==="e"||r==="se")&&(o=Math.max(l,s+t)),(r==="nw"||r==="n"||r==="ne")&&(n=Math.min(u,a-t)),(r==="sw"||r==="s"||r==="se")&&(a=Math.max(u,n+t)),[s,n,o,a]}function di(i,r,e){let t=je(i),s=At(i),n=Math.min(Math.max(i[0]+r,0),Math.max(0,1-t)),o=Math.min(Math.max(i[1]+e,0),Math.max(0,1-s));return[n,o,n+t,o+s]}var Be=[1/3,2/3,2/3,1];function ur(i){return String(Math.round(i*1e4)/100)+"%"}function fr(i){return{left:ur(i[0]),top:ur(i[1]),width:ur(i[2]-i[0]),height:ur(i[3]-i[1])}}function Rt(i,r){let e=r[2]-r[0],t=r[3]-r[1];if(e<=0||t<=0||i[2]<=i[0]||i[3]<=i[1])return null;let s=Math.max(i[0],r[0]),n=Math.max(i[1],r[1]),o=Math.min(i[2],r[2]),a=Math.min(i[3],r[3]);return o<=s||a<=n?null:[(s-r[0])/e,(n-r[1])/t,(o-r[0])/e,(a-r[1])/t]}function hr(i,r,e){return Math.min(e,Math.max(r,i))}function Zp(i,r,e){return i.left<r.left+r.width+e&&i.left+i.width+e>r.left&&i.top<r.top+r.height+e&&i.top+i.height+e>r.top}function sl(i,r,e,t=4,s=0){let n=Math.max(0,s),o=[...i].sort((l,u)=>l.box[0]+l.box[2]-(u.box[0]+u.box[2])),a=[];for(let l of o){let u=l.height??22,h=Math.max(0,r-l.width),d=Math.max(0,e-u),f=l.box[0]*r,m=l.box[1]*e,b=m-u-t<n,_=hr(f,0,h),g=Math.max(m+t,n),C=hr(b?g:m-u-t,0,d),R=new Set([_,0,h]);for(let x of a)R.add(hr(x.left+x.width+t,0,h)),R.add(hr(x.left-l.width-t,0,h));let z=[...R].sort((x,E)=>Math.abs(x-_)-Math.abs(E-_)),M=[C],V=u+t;for(let x=V;x<=e;x+=V){let E=C+x,H=C-x;E<=d&&M.push(E),H>=(b?g:n)&&M.push(H)}let K;for(let x of M){for(let E of z){let H={key:l.key,left:E,top:x,flipped:b,width:l.width,height:u};if(!a.some(B=>Zp(H,B,t))){K=H;break}}if(K)break}a.push(K??{key:l.key,left:_,top:C,flipped:b,width:l.width,height:u})}return a.map(({key:l,left:u,top:h,flipped:d})=>({key:l,left:u,top:h,flipped:d}))}var Qp=1e3,mr=.01,Jp=50,eu={nw:"nwse-resize",n:"ns-resize",ne:"nesw-resize",e:"ew-resize",se:"nwse-resize",s:"ns-resize",sw:"nesw-resize",w:"ew-resize"},Zs=class extends v{constructor(){super();this._imageRef=T();this._cancelRef=T();this._imageUrl=null;this._imagePath=null;this._objectUrl=null;this._masks=[];this._bowl=Be;this._baseline=null;this._selected=null;this._hidden=new Set;this._undoStack=[];this._drawStart=null;this._drawing=null;this._pointerId=null;this._edit=null;this._showDetections=!1;this._visionFrame=null;this._visionTimer=void 0;this._confirmDiscard=!1;this._loading=!1;this._saving=!1;this._error=null;this._loadGeneration=0;this._onImageLoad=()=>{this.requestUpdate()};this._pollVision=()=>{let e=this.hass?.callWS,t=this.entryId;!e||!t||e({type:"kibble/vision/last",entry_id:t}).then(s=>{this._visionFrame=s.frame,this.requestUpdate()},()=>{})};this._toggleDetections=()=>{this._showDetections=!this._showDetections,this._showDetections?(this._pollVision(),this._visionTimer=setInterval(this._pollVision,Qp)):this._stopVisionPolling(),this.requestUpdate()};this._onStagePointerDown=e=>{if(this._saving||e.button!==0)return;let t=this._imageRef.value;if(!t)return;let s=Ae(e.clientX,e.clientY,t.getBoundingClientRect());this._selected=null,this._drawStart=s,this._drawing=[s.x,s.y,s.x,s.y],this._pointerId=e.pointerId,e.currentTarget.setPointerCapture(e.pointerId),e.preventDefault(),this.requestUpdate()};this._onStageMove=e=>{if(this._pointerId!==e.pointerId||!this._drawStart)return;let t=this._imageRef.value;if(!t)return;let s=Ae(e.clientX,e.clientY,t.getBoundingClientRect());this._drawing=ci(this._drawStart,s),this.requestUpdate()};this._onStageUp=e=>{if(this._pointerId!==e.pointerId||!this._drawStart)return;let t=this._imageRef.value;if(t){let s=Ae(e.clientX,e.clientY,t.getBoundingClientRect()),n=ci(this._drawStart,s);il(n)&&(this._pushUndo(),this._masks=[...this._masks,n],this._selected={kind:"mask",index:this._masks.length-1})}this._finishStageDraw(e)};this._onStageCancel=e=>{this._pointerId===e.pointerId&&this._finishStageDraw(e)};this._beginMove=(e,t)=>{if(this._saving||e.button!==0)return;e.stopPropagation();let s=this._imageRef.value;if(!s)return;this._pushUndo(),this._selected=t;let n=Ae(e.clientX,e.clientY,s.getBoundingClientRect());this._edit={pointerId:e.pointerId,target:t,handle:null,start:n,original:this._areaFor(t)},e.currentTarget.setPointerCapture(e.pointerId),e.preventDefault(),this.requestUpdate()};this._beginResize=(e,t,s)=>{if(this._saving||e.button!==0)return;e.stopPropagation();let n=this._imageRef.value;if(!n)return;this._pushUndo(),this._selected=t;let o=Ae(e.clientX,e.clientY,n.getBoundingClientRect());this._edit={pointerId:e.pointerId,target:t,handle:s,start:o,original:this._areaFor(t)},e.currentTarget.setPointerCapture(e.pointerId),e.preventDefault(),this.requestUpdate()};this._onEditMove=e=>{let t=this._edit;if(!t||t.pointerId!==e.pointerId)return;let s=this._imageRef.value;if(!s)return;let n=Ae(e.clientX,e.clientY,s.getBoundingClientRect()),o=t.handle?Xs(t.original,t.handle,n):di(t.original,n.x-t.start.x,n.y-t.start.y);this._setAreaFor(t.target,o),this.requestUpdate()};this._onEditEnd=e=>{let t=this._edit;if(!t||t.pointerId!==e.pointerId)return;let s=e.currentTarget;s.hasPointerCapture(e.pointerId)&&s.releasePointerCapture(e.pointerId),this._edit=null,this.requestUpdate()};this._selectTarget=e=>{this._selected=e,this.requestUpdate()};this._toggleVisibility=e=>{let t=new Set(this._hidden);t.has(e)?t.delete(e):(t.add(e),this._selected?.kind==="mask"&&this._selected.index===e&&(this._selected=null)),this._hidden=t,this.requestUpdate()};this._deleteMask=e=>{this._pushUndo(),this._masks=this._masks.filter((t,s)=>s!==e),this._hidden=new Set([...this._hidden].filter(t=>t!==e).map(t=>t>e?t-1:t)),this._selected?.kind==="mask"&&(this._selected.index===e?this._selected=null:this._selected.index>e&&(this._selected={kind:"mask",index:this._selected.index-1})),this.requestUpdate()};this._resetBowl=()=>{this._pushUndo(),this._bowl=Be,this.requestUpdate()};this._undo=()=>{let e=this._undoStack.pop();e&&(this._masks=e.masks,this._bowl=e.bowl,this._selected=null,this.requestUpdate())};this._onKeydown=e=>{if(e.key==="Escape"&&!this._saving){e.preventDefault(),this._requestClose();return}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="z"&&!this._saving){e.preventDefault(),this._undo();return}if(!this._selected||this._saving)return;let s={ArrowLeft:{x:-mr,y:0},ArrowRight:{x:mr,y:0},ArrowUp:{x:0,y:-mr},ArrowDown:{x:0,y:mr}}[e.key];if(s){e.preventDefault(),this._pushUndo();let n=this._areaFor(this._selected),o=e.shiftKey?Xs(n,"se",{x:n[2]+s.x,y:n[3]+s.y}):di(n,s.x,s.y);this._setAreaFor(this._selected,o),this.requestUpdate();return}(e.key==="Delete"||e.key==="Backspace")&&this._selected.kind==="mask"&&(e.preventDefault(),this._deleteMask(this._selected.index))};this._requestClose=()=>{if(!this._saving){if(this._isDirty()&&!this._confirmDiscard){this._confirmDiscard=!0,this.requestUpdate();return}this._confirmDiscard=!1,this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}};this._keepEditing=()=>{this._confirmDiscard=!1,this.requestUpdate()};this.open=!1}static{this.properties={hass:{attribute:!1},cameraEntity:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0}}}disconnectedCallback(){super.disconnectedCallback(),this._revokeObjectUrl(),this._stopVisionPolling()}updated(e){e.has("open")&&this.open&&(this._cancelRef.value?.focus(),this._loadEditor()),e.has("open")&&!this.open&&(this._drawStart=null,this._drawing=null,this._pointerId=null,this._edit=null,this._selected=null,this._confirmDiscard=!1,this._showDetections=!1,this._stopVisionPolling())}render(){if(!this.open)return p;let e=!this._loading&&!this._saving&&!!this.entryId;return c`
      <div class="backdrop" @click=${this._requestClose}>
        <section
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detection-areas-title"
          @click=${t=>t.stopPropagation()}
          @keydown=${this._onKeydown}
        >
          <header class="header">
            <h2 id="detection-areas-title">Detection areas</h2>
            <button type="button" class="icon-button" aria-label="Close" @click=${this._requestClose}>${y("close")}</button>
          </header>

          <div class="body">
            <div class="toolbar" role="group" aria-label="Editor tools">
              <button
                type="button"
                class="toggle-pill ${this._showDetections?"active":""}"
                aria-pressed=${this._showDetections}
                @click=${this._toggleDetections}
              >
                <span class="swatch detections"></span>Show detections
              </button>
              <button
                type="button"
                class="quiet-button"
                ?disabled=${!this._undoStack.length||this._saving}
                @click=${this._undo}
              >
                ${y("undo")}Undo
              </button>
            </div>

            <div class="stage-wrap">
              ${this._imageUrl?this._renderStage():c`<div class="empty-stage">${this._loading?"Loading camera still\u2026":"Camera still unavailable"}</div>`}
            </div>

            ${this._error?c`<p class="error" role="alert">${this._error}</p>`:p}

            <div class="lists">
              <section class="mask-section">
                <h3>Ignore masks</h3>
                ${this._masks.length?c`<ul class="mask-list">${this._masks.map((t,s)=>this._renderMaskRow(t,s))}</ul>`:p}
              </section>
              <section class="mask-section">
                <h3>Bowl zone</h3>
                ${this._renderBowlRow()}
              </section>
            </div>
          </div>

          <footer class="footer">${this._confirmDiscard?this._renderDiscardConfirm():this._renderFooterActions(e)}</footer>
        </section>
      </div>
    `}_renderFooterActions(e){return c`
      <button type="button" class="cancel" ${P(this._cancelRef)} ?disabled=${this._saving} @click=${this._requestClose}>Cancel</button>
      <button type="button" class="save" ?disabled=${!e} @click=${this._save}>${this._saving?"Saving\u2026":"Save"}</button>
    `}_renderDiscardConfirm(){return c`
      <p class="discard-prompt" role="alert">Discard unsaved changes?</p>
      <button type="button" class="quiet-button" @click=${this._keepEditing}>Keep editing</button>
      <button type="button" class="cancel discard" @click=${this._requestClose}>Discard</button>
    `}_renderStage(){let e=this._selected?this._areaFor(this._selected):null,t=this._stageAspectRatio(),s=`aspect-ratio:${t};width:min(100%, calc(min(60vh, 640px) * ${t}));`;return c`
      <div
        class="stage"
        style=${s}
        @pointerdown=${this._onStagePointerDown}
        @pointermove=${this._onStageMove}
        @pointerup=${this._onStageUp}
        @pointercancel=${this._onStageCancel}
      >
        <img ${P(this._imageRef)} src=${this._imageUrl} alt="Feeder camera still" @load=${this._onImageLoad} />
        ${this._showDetections?this._renderDetections():p}
        ${this._masks.length===0?c`<p class="stage-hint" aria-hidden="true">Drag to mask an area</p>`:p}
        ${this._renderShape(this._bowl,{kind:"bowl"},this._selected?.kind==="bowl","bowl","Bowl zone")}
        ${this._masks.map((n,o)=>{if(this._hidden.has(o))return p;let a=this._selected?.kind==="mask"&&this._selected.index===o;return this._renderShape(n,{kind:"mask",index:o},a,"mask",`Mask ${o+1}`)})}
        ${this._drawing?this._renderDrawingPreview(this._drawing):p}
        ${this._selected&&e?rl.map(n=>this._renderHandle(e,this._selected,n)):p}
      </div>
    `}_renderDetections(){return(this._visionFrame?.detections??[]).map(t=>{let s=fr([t.x1,t.y1,t.x2,t.y2]),n=`left:${s.left};top:${s.top};width:${s.width};height:${s.height};`;return c`<div class="detection ${t.admitted?"":"quiet"}" style=${n}></div>`})}_renderShape(e,t,s,n,o){let a=`left:${e[0]*100}%;top:${e[1]*100}%;width:${je(e)*100}%;height:${At(e)*100}%;`;return c`
      <div class="shape ${n} ${s?"selected":""}" style=${a}>
        <button
          type="button"
          class="shape-body"
          aria-label="${o}${s?", selected":""}"
          @pointerdown=${l=>this._beginMove(l,t)}
          @pointermove=${this._onEditMove}
          @pointerup=${this._onEditEnd}
          @pointercancel=${this._onEditEnd}
          @click=${()=>this._selectTarget(t)}
          @contextmenu=${l=>this._onShapeContextMenu(l,t)}
        >
          <span class="shape-tag">${o}</span>
        </button>
      </div>
    `}_renderHandle(e,t,s){let n=pr(e,s),o=`left:${n.x*100}%;top:${n.y*100}%;cursor:${eu[s]};`;return c`
      <div
        class="handle"
        style=${o}
        aria-hidden="true"
        @pointerdown=${a=>this._beginResize(a,t,s)}
        @pointermove=${this._onEditMove}
        @pointerup=${this._onEditEnd}
        @pointercancel=${this._onEditEnd}
      >
        <span class="handle-dot"></span>
      </div>
    `}_renderDrawingPreview(e){let t=`left:${e[0]*100}%;top:${e[1]*100}%;width:${je(e)*100}%;height:${At(e)*100}%;`;return c`<div class="shape mask drawing" style=${t}><div class="shape-body"></div></div>`}_renderMaskRow(e,t){let s=this._selected?.kind==="mask"&&this._selected.index===t,n=this._hidden.has(t);return c`
      <li class="mask-row ${s?"selected":""}">
        <button type="button" class="mask-row-label" @click=${()=>this._selectTarget({kind:"mask",index:t})}>
          <span class="swatch exclude"></span>Mask ${t+1}
        </button>
        <button
          type="button"
          class="icon-button"
          aria-label="${n?"Show":"Hide"} mask ${t+1}"
          @click=${()=>this._toggleVisibility(t)}
        >
          ${y(n?"eyeOff":"eye")}
        </button>
        <button type="button" class="icon-button" aria-label="Delete mask ${t+1}" @click=${()=>this._deleteMask(t)}>
          ${y("deleteOutline")}
        </button>
      </li>
    `}_renderBowlRow(){let e=this._selected?.kind==="bowl";return c`
      <div class="mask-row bowl-row ${e?"selected":""}">
        <button type="button" class="mask-row-label" @click=${()=>this._selectTarget({kind:"bowl"})}>
          <span class="swatch bowl"></span>Bowl zone
        </button>
        <button type="button" class="quiet-button" @click=${this._resetBowl}>Reset</button>
      </div>
    `}async _loadEditor(){let e=++this._loadGeneration;this._error=null,this._selected=null,this._drawing=null,this._undoStack=[],this._hidden=new Set,this._confirmDiscard=!1,this._loading=!0,this.requestUpdate(),await Promise.all([this._loadAreas(),this._loadImage()]),e===this._loadGeneration&&(this._loading=!1,this.requestUpdate())}async _loadAreas(){let e=this.hass?.callWS;if(!e||!this.entryId){this._masks=[],this._bowl=Be,this._baseline={masks:[],bowl:Be};return}try{let[t,s]=await Promise.all([e({type:"kibble/vision/areas",entry_id:this.entryId}),e({type:"kibble/vision/bowl",entry_id:this.entryId})]);this._masks=Gs(t.exclude),this._bowl=dr(s.bowl_roi)??Be}catch(t){this._error=q(t),this._masks=[],this._bowl=Be}this._baseline={masks:this._masks,bowl:this._bowl}}async _loadImage(){let e=this.cameraEntity?this.hass?.states[this.cameraEntity]:void 0,t=typeof e?.attributes.entity_picture=="string"?e.attributes.entity_picture:null;if(!(t===this._imagePath&&this._imageUrl)){if(this._imagePath=t,!t){this._imageUrl||this.requestUpdate();return}if(!this.hass.fetchWithAuth){this._imageUrl=t,this.requestUpdate();return}try{let s=await this.hass.fetchWithAuth(t);if(!s.ok)throw new Error("Camera still could not be loaded.");let n=await s.blob(),o=URL.createObjectURL(n);this._revokeObjectUrl(),this._objectUrl=o,this._imageUrl=o}catch(s){this._imageUrl||(this._error=s instanceof Error?s.message:"Camera still could not be loaded.")}this.requestUpdate()}}_stageAspectRatio(){let e=this._imageRef.value;return e&&e.naturalWidth>0&&e.naturalHeight>0?e.naturalWidth/e.naturalHeight:this._visionFrame?.w&&this._visionFrame?.h?this._visionFrame.w/this._visionFrame.h:16/9}_stopVisionPolling(){this._visionTimer!==void 0&&clearInterval(this._visionTimer),this._visionTimer=void 0}_finishStageDraw(e){let t=e.currentTarget;t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId),this._pointerId=null,this._drawStart=null,this._drawing=null,this.requestUpdate()}_onShapeContextMenu(e,t){e.preventDefault(),t.kind==="mask"&&this._deleteMask(t.index)}_areaFor(e){return e.kind==="bowl"?this._bowl:this._masks[e.index]}_setAreaFor(e,t){e.kind==="bowl"?this._bowl=t:this._masks=this._masks.map((s,n)=>n===e.index?t:s)}_pushUndo(){this._undoStack.push({masks:this._masks,bowl:this._bowl}),this._undoStack.length>Jp&&this._undoStack.shift()}_isDirty(){if(!this._baseline)return!1;let e=t=>t.map(s=>Math.round(s*1e4)).join(",");return this._masks.length!==this._baseline.masks.length||e(this._bowl)!==e(this._baseline.bowl)?!0:this._masks.some((t,s)=>e(t)!==e(this._baseline.masks[s]))}async _save(){let e=this.hass?.callWS;if(!(!e||!this.entryId)){this._saving=!0,this._error=null,this.requestUpdate();try{try{await e({type:"kibble/vision/areas/set",entry_id:this.entryId,exclude:this._masks})}catch(n){throw new Error(`Could not save masks. ${q(n)}`)}try{await e({type:"kibble/vision/bowl/set",entry_id:this.entryId,bowl_roi:this._bowl})}catch(n){throw new Error(`Masks saved, but the bowl zone failed to save. ${q(n)}`)}let[t,s]=await Promise.all([e({type:"kibble/vision/areas",entry_id:this.entryId}),e({type:"kibble/vision/bowl",entry_id:this.entryId})]);this._masks=Gs(t.exclude),this._bowl=dr(s.bowl_roi)??Be,this._baseline={masks:this._masks,bowl:this._bowl},this._undoStack=[],this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(t){this._error=t instanceof Error?t.message:"Could not save detection areas."}finally{this._saving=!1,this.requestUpdate()}this._error||this._requestClose()}}_revokeObjectUrl(){this._objectUrl&&URL.revokeObjectURL(this._objectUrl),this._objectUrl=null}static{this.styles=w`
    :host(:not([open])) { display: none; }
    :host {
      position: fixed;
      inset: 0;
      z-index: 120;
      color: var(--primary-text-color);
    }
    .backdrop {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: stretch;
      justify-content: center;
      padding: clamp(12px, 3vw, 32px);
      background: rgba(0, 0, 0, 0.76);
      overflow: auto;
    }
    .panel {
      width: min(980px, 100%);
      min-height: min(720px, 100%);
      margin: auto;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      border-radius: 18px;
      background: var(--ha-card-background, var(--card-background-color));
      box-shadow: 0 18px 70px rgba(0, 0, 0, 0.42);
    }
    .header {
      display: flex;
      gap: 20px;
      justify-content: space-between;
      padding: 22px 26px 16px;
      border-bottom: 1px solid var(--divider-color);
    }
    h2 { margin: 0 0 6px; font-size: 23px; }
    .header p { max-width: 690px; margin: 0; color: var(--secondary-text-color); line-height: 1.45; }
    .icon-button {
      width: 44px;
      height: 44px;
      min-height: 44px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 30px;
      line-height: 1;
      cursor: pointer;
    }
    header .icon-button svg { width: 20px; height: 20px; }
    .mask-list .icon-button svg { width: 18px; height: 18px; }
    .body { display: flex; flex: 1; flex-direction: column; gap: 14px; padding: 20px 26px; }
    .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .toggle-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      min-height: 44px;
      padding: 0 14px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      font: inherit;
      font-weight: 650;
      cursor: pointer;
    }
    .toggle-pill.active {
      color: var(--primary-text-color);
      border-color: var(--primary-color, #03a9f4);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
    }
    .swatch { display: inline-block; width: 11px; height: 11px; border-radius: 3px; flex: 0 0 auto; }
    .swatch.detections { background: var(--primary-color, #03a9f4); border: 1px solid var(--primary-color, #03a9f4); }
    .swatch.exclude { background: rgba(224, 80, 78, 0.5); border: 1px solid #f16a66; }
    .swatch.bowl { background: color-mix(in srgb, var(--primary-color, #03a9f4) 25%, transparent); border: 1px solid var(--primary-color, #03a9f4); }
    /* No flex:1/flex-centering here on purpose: .stage already sizes itself precisely to the
     * snapshot's own aspect ratio and centers itself horizontally (its own margin: 0 auto) --
     * a flex-grow wrap would stretch taller than that exact height on a tall viewport and
     * center the (correctly-sized but now shorter) stage inside itself, showing this wrap's
     * own dark background as letterbox bands around an otherwise edge-to-edge image.
     * Shrink-wrapping keeps the wrap exactly as tall as the image, every time. */
    .stage-wrap { border-radius: 12px; background: #101314; overflow: hidden; }
    .stage { position: relative; max-height: min(60vh, 640px); margin: 0 auto; overflow: hidden; touch-action: none; cursor: crosshair; }
    .stage img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .empty-stage { min-height: 280px; display: grid; place-items: center; color: var(--secondary-text-color); }

    .detection { position: absolute; border: 1.5px dashed rgba(255, 255, 255, 0.85); border-radius: 3px; pointer-events: none; }
    .detection.quiet { border-color: rgba(255, 255, 255, 0.4); border-style: dotted; }

    .shape { position: absolute; min-width: 0; min-height: 0; }
    .shape-body {
      position: absolute;
      inset: 0;
      padding: 0;
      margin: 0;
      border: 2px solid;
      border-radius: 4px;
      color: #fff;
      font: inherit;
      font-size: 12px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
      cursor: move;
      overflow: hidden;
      text-align: left;
      touch-action: none;
    }
    .shape-tag { position: absolute; top: 5px; left: 6px; white-space: nowrap; }
    .shape.mask .shape-body {
      border-color: #f16a66;
      background-image: repeating-linear-gradient(45deg, rgba(224, 80, 78, 0.32) 0 6px, rgba(224, 80, 78, 0.12) 6px 12px);
    }
    .shape.bowl .shape-body {
      border-color: var(--primary-color, #03a9f4);
      border-style: dashed;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 10%, transparent);
      cursor: move;
    }
    .shape.drawing { pointer-events: none; }
    .shape.drawing .shape-body { border: 2px dashed #f16a66; background: rgba(224, 80, 78, 0.18); opacity: 0.9; }
    .shape.selected .shape-body { border-width: 3px; box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.85), 0 0 0 5px rgba(255, 255, 255, 0.18); }
    .shape-body:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

    .handle {
      position: absolute;
      width: 44px;
      height: 44px;
      margin: -22px 0 0 -22px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
    }
    .handle-dot { width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 2px solid #24180a; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); }

    .error { margin: 0; color: var(--error-color, #ff8a80); }
    .stage-hint {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      padding: 4px 10px;
      color: rgba(255, 255, 255, 0.65);
      font-size: 13px;
      pointer-events: none;
    }

    .lists { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .mask-section h3 { margin: 0 0 8px; font-size: 14px; font-weight: 650; color: var(--primary-text-color); }
    .mask-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
    .mask-row, .bowl-row { display: flex; align-items: center; gap: 2px; border-radius: 8px; }
    .mask-row.selected, .bowl-row.selected { background: var(--secondary-background-color, rgba(127, 127, 127, 0.13)); }
    .mask-row-label {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding: 0 8px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .quiet-button, .cancel, .save {
      min-height: 44px;
      padding: 0 16px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 10px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .quiet-button svg, .toggle-pill svg { width: 16px; height: 16px; }
    button:disabled { opacity: 0.45; cursor: default; }
    .mask-row-label:focus-visible,
    .icon-button:focus-visible,
    .quiet-button:focus-visible,
    .toggle-pill:focus-visible,
    .save:focus-visible,
    .cancel:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }

    .footer { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 10px; padding: 16px 26px 22px; border-top: 1px solid var(--divider-color); }
    .discard-prompt { flex: 1; min-width: 160px; margin: 0; color: var(--primary-text-color); font-weight: 600; }
    .save { border-color: var(--kibble-amber, #e8ab4f); background: var(--kibble-amber, #e8ab4f); color: var(--kibble-ink-on-amber, #24180a); }
    .cancel.discard { border-color: var(--error-color, #db4437); color: var(--error-color, #db4437); }

    @media (max-width: 640px) {
      .backdrop { padding: 0; }
      .panel { min-height: 100%; border: 0; border-radius: 0; }
      .header, .body, .footer { padding-left: 18px; padding-right: 18px; }
      .lists { grid-template-columns: 1fr; gap: 16px; }
    }
  `}};customElements.define("kibble-detection-areas-dialog",Zs);function Qs(i){return Number.isNaN(i)?50:Math.min(100,Math.max(0,i))}function nl(i,r){switch(r){case"ArrowLeft":case"ArrowDown":return Qs(i-5);case"ArrowRight":case"ArrowUp":return Qs(i+5);case"Home":return 0;case"End":return 100;default:return null}}function ol(i,r){return r.width<=0?50:Qs((i-r.left)/r.width*100)}function al(i,r){let e=i||null,t=r||null;return{before:e,after:t,hasPair:e!==null&&t!==null}}var Js=class extends v{constructor(){super();this._frameRef=T();this._beginDrag=e=>{e.preventDefault(),e.currentTarget.setPointerCapture(e.pointerId),this._updateFromPointer(e.clientX)};this._onDrag=e=>{e.buttons!==0&&(e.preventDefault(),this._updateFromPointer(e.clientX))};this._endDrag=e=>{let t=e.currentTarget;t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId)};this._onHandleKeydown=e=>{let t=nl(this._wipePosition,e.key);t!==null&&(e.preventDefault(),this._wipePosition=t)};this.beforeSrc=null,this.afterSrc=null,this.beforeLabel="Before",this.afterLabel="After",this.caption=null,this.aspect=16/9,this._mode="split",this._wipePosition=50}static{this.properties={beforeSrc:{type:String},afterSrc:{type:String},beforeLabel:{type:String},afterLabel:{type:String},caption:{type:String},aspect:{type:Number},_mode:{state:!0},_wipePosition:{state:!0}}}render(){let e=al(this.beforeSrc,this.afterSrc);if(!e.before&&!e.after)return p;if(!e.hasPair){let t=e.before??e.after,s=e.before?this.beforeLabel:this.afterLabel;return c`
        <figure class="tile">
          <div class="frame" style="aspect-ratio: ${this.aspect};">
            <img src=${t} alt=${s} loading="lazy" />
            <span class="tag tag-solo">${s}</span>
          </div>
          ${this.caption?c`<figcaption>${this.caption}</figcaption>`:p}
        </figure>
      `}return c`
      <figure class="tile">
        <div class="frame" style="aspect-ratio: ${this.aspect};">
          ${this._mode==="split"?this._renderSplit(e.before,e.after):this._renderWipe(e.before,e.after)}
          <div class="mode-toggle" role="group" aria-label="Compare view">
            <button
              type="button"
              class="mode-btn ${this._mode==="split"?"selected":""}"
              aria-pressed=${this._mode==="split"}
              @click=${()=>this._setMode("split")}
            >
              Split
            </button>
            <button
              type="button"
              class="mode-btn ${this._mode==="wipe"?"selected":""}"
              aria-pressed=${this._mode==="wipe"}
              @click=${()=>this._setMode("wipe")}
            >
              Wipe
            </button>
          </div>
        </div>
        ${this.caption?c`<figcaption>${this.caption}</figcaption>`:p}
      </figure>
    `}_renderSplit(e,t){return c`
      <div class="split">
        <div class="half">
          <img src=${e} alt=${this.beforeLabel} loading="lazy" />
          <span class="tag">${this.beforeLabel}</span>
        </div>
        <div class="divider"></div>
        <div class="half">
          <img src=${t} alt=${this.afterLabel} loading="lazy" />
          <span class="tag">${this.afterLabel}</span>
        </div>
      </div>
    `}_renderWipe(e,t){let s=this._wipePosition;return c`
      <div
        class="wipe"
        ${P(this._frameRef)}
        @pointerdown=${this._beginDrag}
        @pointermove=${this._onDrag}
        @pointerup=${this._endDrag}
        @pointercancel=${this._endDrag}
      >
        <img class="layer" src=${t} alt=${this.afterLabel} loading="lazy" />
        <div class="layer clip" style="clip-path: inset(0 ${100-s}% 0 0);">
          <img src=${e} alt=${this.beforeLabel} loading="lazy" />
        </div>
        <span class="tag tag-before">${this.beforeLabel}</span>
        <span class="tag tag-after">${this.afterLabel}</span>
        <div
          class="handle"
          role="slider"
          tabindex="0"
          aria-label="Reveal before vs after"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${Math.round(s)}
          aria-valuetext=${`${Math.round(s)}% ${this.beforeLabel.toLowerCase()}`}
          style="left: ${s}%;"
          @keydown=${this._onHandleKeydown}
        >
          <span class="grip"></span>
        </div>
      </div>
    `}_setMode(e){this._mode=e}_updateFromPointer(e){let t=this._frameRef.value?.getBoundingClientRect();t&&(this._wipePosition=ol(e,t))}static{this.styles=w`
    :host {
      display: block;
    }
    .tile {
      margin: 0;
    }
    .frame {
      position: relative;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      touch-action: none;
    }
    .frame > img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    figcaption {
      margin-top: 6px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .tag {
      position: absolute;
      top: 8px;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      pointer-events: none;
    }
    .tag-solo {
      left: 8px;
    }
    /* Split */
    .split {
      display: flex;
      width: 100%;
      height: 100%;
    }
    .half {
      position: relative;
      flex: 1 1 0;
      min-width: 0;
      overflow: hidden;
    }
    .half img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .half .tag {
      left: 8px;
    }
    .half:last-child .tag {
      left: auto;
      right: 8px;
    }
    .divider {
      flex: 0 0 auto;
      width: 2px;
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
    }
    /* Wipe */
    .wipe {
      position: absolute;
      inset: 0;
      cursor: ew-resize;
    }
    .wipe .layer {
      position: absolute;
      inset: 0;
    }
    .wipe .layer img,
    .wipe img.layer {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .wipe .clip {
      overflow: hidden;
    }
    .tag-before {
      left: 8px;
    }
    .tag-after {
      right: 8px;
    }
    .handle {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
      cursor: ew-resize;
    }
    .handle:focus-visible {
      outline: none;
    }
    .handle:focus-visible .grip {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .grip {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
    /* Mode toggle */
    .mode-toggle {
      position: absolute;
      /* Bottom, not top, so it never sits over the "After"/wipe tags, which are always top:
       * 8px regardless of mode (see .tag above) -- top-right previously hid "After" under
       * this control entirely. */
      bottom: 8px;
      right: 8px;
      display: flex;
      gap: 2px;
      padding: 2px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(2px);
    }
    .mode-btn {
      border: none;
      background: none;
      color: #fff;
      font: inherit;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 999px;
      cursor: pointer;
      min-height: 28px;
    }
    .mode-btn.selected {
      background: var(--kibble-amber, #f4a452);
      color: var(--kibble-ink-on-amber, #3a2c28);
    }
    .mode-btn:focus-visible {
      outline: 2px solid #fff;
      outline-offset: -2px;
    }
  `}};customElements.define("kibble-before-after",Js);var ll=3e3;function en(i,r){if(!r)return null;let e=i.states[r];if(!e)return null;let t=Number(e.state);return Number.isNaN(t)?null:{value:t,min:Number(e.attributes.min??1),max:Number(e.attributes.max??20),step:Number(e.attributes.step??1)}}var tn=class extends v{constructor(){super();this._cloudConfirmArmed=!1;this._cloudConfirmTimer=void 0;this._stackConfirmArmed=!1;this._stackConfirmTimer=void 0;this.open=!1,this.singleHopper=!1,this.food1=null,this.food2=null,this._calibrationOpen=!1,this._detectionAreasOpen=!1}static{this.properties={hass:{attribute:!1},entities:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},_calibrationOpen:{state:!0},_detectionAreasOpen:{state:!0}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._cloudConfirmTimer),clearTimeout(this._stackConfirmTimer)}render(){if(!this.open)return p;let e=this.entities;return c`
      <div class="backdrop" @click=${this._close}></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Kibble settings" @keydown=${this._onKeydown}>
        <header>
          <h2>Settings</h2>
          <button type="button" class="icon-button" @click=${this._close} aria-label="Close">${y("close")}</button>
        </header>
        <div class="body">
          ${e.feedButtonHopper1||e.feedButtonHopper2?this._renderHopperSection():p}
          ${e.bowlFill?this._renderCalibrationSection():p}
          ${e.camera?this._renderCameraSection():p}
          ${e.feedAmount?this._renderMoreAmountSection():p}
          ${this._renderToggles()}
          ${e.cloudSwitch?this._renderCloud():p}
          ${e.stackSelect?this._renderStack():p}
          ${e.wifiNetwork?this._renderWifi():p}
          ${e.dishBefore||e.dishAfter?this._renderDishPhotos():p}
          ${e.speaker?this._renderSpeaker():p}
          <button type="button" class="device-link" @click=${this._openDevicePage}>
            Open device page ${y("openInNew")}
          </button>
        </div>
      </div>
      <kibble-calibration-dialog
        .hass=${this.hass}
        .entryId=${this.entryId}
        .singleHopper=${this.singleHopper}
        .food1=${this.food1}
        .food2=${this.food2}
        ?open=${this._calibrationOpen}
        @close-requested=${this._closeCalibration}
      ></kibble-calibration-dialog>
      <kibble-detection-areas-dialog
        .hass=${this.hass}
        .cameraEntity=${e.camera}
        .entryId=${this.entryId}
        ?open=${this._detectionAreasOpen}
        @close-requested=${this._closeDetectionAreas}
      ></kibble-detection-areas-dialog>
    `}_renderCameraSection(){return c`
      <section>
        <h3>Camera</h3>
        <p class="hint">Choose which parts of the camera frame the detector should use.</p>
        <button type="button" class="cloud-toggle" @click=${this._openDetectionAreas}>
          Detection areas
        </button>
      </section>
    `}_renderMoreAmountSection(){let e=en(this.hass,this.entities.feedAmount);return e?c`
      <section>
        <h3>Feed amount</h3>
        ${this._renderStepper(this.entities.feedAmount,e)}
      </section>
    `:p}_renderHopperSection(){let{feedAmountHopper1:e,feedAmountHopper2:t,feedButtonHopper1:s,feedButtonHopper2:n}=this.entities;return c`
      <section>
        <h3>Per-hopper feed</h3>
        <p class="hint">
          Targets one auger's amount byte directly. This feeder's firmware has been observed to
          spin both augers regardless, so expect roughly double into the bowl.
        </p>
        <div class="hoppers">
          ${e?c`
                <div class="hopper">
                  <span class="hopper-label">${this._hopperFeedLabel(1)}</span>
                  ${this._renderStepper(e,en(this.hass,e))}
                  ${s?c`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(s)}></kibble-hold-button>`:p}
                </div>
              `:p}
          ${t&&!this.singleHopper?c`
                <div class="hopper">
                  <span class="hopper-label">${this._hopperFeedLabel(2)}</span>
                  ${this._renderStepper(t,en(this.hass,t))}
                  ${n?c`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(n)}></kibble-hold-button>`:p}
                </div>
              `:p}
        </div>
      </section>
    `}_hopperFeedLabel(e){return this.singleHopper?"Hopper":(e===1?this.food1:this.food2)??`Hopper ${e}`}_renderCalibrationSection(){return c`
      <section>
        <h3>Bowl calibration</h3>
        <p class="hint">
          Turns the bowl's raw fill reading into a real percentage by dispensing known portions
          into an empty bowl.${this.singleHopper?p:" Each hopper keeps its own curve."}
        </p>
        <button type="button" class="cloud-toggle" @click=${this._openCalibration}>Calibrate bowl</button>
      </section>
    `}_renderStepper(e,t){return t?c`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${t.value<=t.min} @click=${()=>this._setNumber(e,Math.max(t.min,t.value-t.step))}>
          &minus;
        </button>
        <span class="step-value">${t.value}</span>
        <button type="button" class="step-btn" ?disabled=${t.value>=t.max} @click=${()=>this._setNumber(e,Math.min(t.max,t.value+t.step))}>
          &plus;
        </button>
      </div>
    `:p}_renderToggles(){let t=[{id:this.entities.nightVisionSwitch,icon:"weatherNight",label:"Night vision"},{id:this.entities.statusLedSwitch,icon:"ledOn",label:"Status LED"},{id:this.entities.microphoneSwitch,icon:"microphone",label:"Microphone"}].filter(s=>s.id!==void 0);return t.length===0?p:c`
      <section>
        <h3>Device</h3>
        ${t.map(s=>this._renderToggleRow(s.id,s.icon,s.label))}
      </section>
    `}_renderToggleRow(e,t,s){let n=this.hass.states[e],o=n?.state==="on",a=!n||n.state==="unavailable";return c`
      <button type="button" class="toggle-row" ?disabled=${a} @click=${()=>this._toggleSwitch(e)}>
        <span class="toggle-icon">${y(t)}</span>
        <span class="toggle-label">${s}</span>
        <span class="toggle-pill ${o?"on":""}"><span class="toggle-knob"></span></span>
      </button>
    `}_renderCloud(){let t=this.hass.states[this.entities.cloudSwitch]?.state==="on",s=this.entities.cloudConnection?this.hass.states[this.entities.cloudConnection]?.state:void 0;return c`
      <section>
        <h3>Petkit cloud</h3>
        <p class="hint">${s?`Connection: ${s}`:"Turns the feeder's cloud link on or off."}</p>
        <button type="button" class="cloud-toggle ${this._cloudConfirmArmed?"confirming":""}" @click=${this._onCloudToggleClick}>
          ${this._cloudConfirmArmed?`Tap again to turn ${t?"off":"on"}`:t?"On, tap to turn off":"Off, tap to turn on"}
        </button>
      </section>
    `}_renderWifi(){let e=this.hass.states[this.entities.wifiNetwork];return c`
      <section>
        <h3>Wi-Fi</h3>
        <p class="hint">${e?e.state:"Unavailable"}</p>
      </section>
    `}_renderDishPhotos(){let e=this.entities.dishBefore?this.hass.states[this.entities.dishBefore]:void 0,t=this.entities.dishAfter?this.hass.states[this.entities.dishAfter]:void 0,s=e&&e.state!=="unavailable",n=t&&t.state!=="unavailable";return!s&&!n?p:c`
      <section>
        <h3>Last feed</h3>
        <kibble-before-after
          .beforeSrc=${s?String(e.attributes.entity_picture??""):null}
          .afterSrc=${n?String(t.attributes.entity_picture??""):null}
          aspect="1.333"
        ></kibble-before-after>
      </section>
    `}_renderSpeaker(){let e=this.hass.states[this.entities.speaker];if(!e)return p;let t=typeof e.attributes.volume_level=="number"?e.attributes.volume_level:.5;return c`
      <section>
        <h3>Speaker</h3>
        <p class="hint">${e.state}</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          .value=${String(t)}
          @change=${s=>this.hass.callService("media_player","volume_set",{volume_level:Number(s.target.value)},{entity_id:this.entities.speaker})}
        />
      </section>
    `}_pressButton(e){this.hass.callService("button","press",{},{entity_id:e})}_toggleSwitch(e){this.hass.callService("switch","toggle",{},{entity_id:e})}_setNumber(e,t){this.hass.callService("number","set_value",{value:t},{entity_id:e})}_renderStack(){let e=this.hass.states[this.entities.stackSelect];if(!e||e.state==="unavailable")return p;let t=e.state,s=t==="librefeed"?"vendor":"librefeed",n=o=>o==="librefeed"?"KibbleOS":"Petkit stack";return c`
      <section>
        <h3>Stack</h3>
        <p class="hint">Running ${n(t)}. Switching reboots the feeder; it is back in about a minute.</p>
        <button type="button" class="cloud-toggle ${this._stackConfirmArmed?"confirming":""}" @click=${this._onStackClick}>
          ${this._stackConfirmArmed?`Tap again to boot ${n(s)}`:`Switch to ${n(s)}`}
        </button>
      </section>
    `}_onStackClick(){let t=this.hass.states[this.entities.stackSelect]?.state==="librefeed"?"vendor":"librefeed";if(this._stackConfirmArmed){clearTimeout(this._stackConfirmTimer),this._stackConfirmArmed=!1,this.hass.callService("select","select_option",{entity_id:this.entities.stackSelect,option:t}),this.requestUpdate();return}this._stackConfirmArmed=!0,this.requestUpdate(),this._stackConfirmTimer=setTimeout(()=>{this._stackConfirmArmed=!1,this.requestUpdate()},ll)}_onCloudToggleClick(){if(this._cloudConfirmArmed){clearTimeout(this._cloudConfirmTimer),this._cloudConfirmArmed=!1,this._toggleSwitch(this.entities.cloudSwitch),this.requestUpdate();return}this._cloudConfirmArmed=!0,this.requestUpdate(),this._cloudConfirmTimer=setTimeout(()=>{this._cloudConfirmArmed=!1,this.requestUpdate()},ll)}_openDevicePage(){let e=this.entities.deviceId;history.pushState(null,"",`/config/devices/device/${e}`),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0})),this._close()}_onKeydown(e){e.key==="Escape"&&this._close()}_openCalibration(){this._calibrationOpen=!0}_openDetectionAreas(){this._detectionAreasOpen=!0}_closeDetectionAreas(e){e.stopPropagation(),this._detectionAreasOpen=!1}_closeCalibration(e){e.stopPropagation(),this._calibrationOpen=!1}_close(){this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}static{this.styles=w`
    /* When closed, render() returns nothing -- but the HOST still exists, and a host with
       position: fixed and inset: 0 is a full-viewport box that keeps receiving pointer events.
       Without this rule an invisible empty overlay sits on top of Home Assistant and silently
       eats every click on the page (sidebar included) for as long as the card is on a
       dashboard. The open property reflects to an attribute, so the closed state is styleable. */
    :host(:not([open])) {
      display: none;
    }
    :host {
      position: fixed;
      inset: 0;
      z-index: 100;
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    .panel {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: min(380px, 100vw);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      box-shadow: var(--ha-card-box-shadow, 0 2px 12px rgba(0, 0, 0, 0.3));
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color);
      position: sticky;
      top: 0;
      background: inherit;
    }
    h2 {
      margin: 0;
      font-size: 20px;
    }
    .icon-button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      min-width: 48px;
      min-height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .body {
      padding: 8px 16px 24px;
      display: flex;
      flex-direction: column;
    }
    section {
      padding: 14px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    h3 {
      margin: 0 0 8px;
      font-size: 15px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .hint {
      margin: 0 0 10px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .hoppers {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .hopper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .hopper-label {
      font-weight: 600;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .step-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      font-size: 22px;
      cursor: pointer;
    }
    .step-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .step-value {
      min-width: 2.5em;
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .toggle-row {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      background: none;
      border: none;
      color: var(--primary-text-color);
      font: inherit;
      padding: 10px 0;
      min-height: 48px;
      cursor: pointer;
    }
    .toggle-row:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .toggle-icon {
      font-size: 20px;
      color: var(--secondary-text-color);
    }
    .toggle-label {
      flex: 1;
      text-align: left;
    }
    .toggle-pill {
      width: 42px;
      height: 24px;
      border-radius: 12px;
      background: var(--divider-color);
      position: relative;
      transition: background-color 0.15s ease;
    }
    .toggle-pill.on {
      background: var(--kibble-amber);
    }
    .toggle-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--ha-card-background, white);
      transition: transform 0.15s ease;
    }
    .toggle-pill.on .toggle-knob {
      transform: translateX(18px);
    }
    input[type="range"] {
      width: 100%;
      accent-color: var(--kibble-amber);
    }
    .cloud-toggle {
      width: 100%;
      min-height: 48px;
      border-radius: 8px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .cloud-toggle.confirming {
      border-color: var(--kibble-amber-dark);
      color: var(--kibble-amber-dark);
    }
    .device-link {
      margin-top: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      padding: 8px 0;
      align-self: flex-start;
    }
  `}};customElements.define("kibble-settings-dialog",tn);var iu=46,Re=5,Mt=8,at=34,rn=7,ru=2,cl=8,su=7,nu=2,ou=24,au=48;function dl(i){let r=`hopper-clip-${i.index??"all"}`,e=i.index===null?au:ou,t=e+Re*2,s=Re+(e-cl)/2,n=(Mt+at*(1-Ki)).toFixed(1),o=i.fillFraction;return D`
    <svg class="tank" data-tone=${i.tone} data-wide=${i.index===null} viewBox="0 0 ${t} ${iu}" aria-hidden="true">
      <defs>
        <clipPath id=${r}><rect x=${Re} y=${Mt} width=${e} height=${at} rx=${rn} /></clipPath>
      </defs>
      <rect class="tank-cap" x=${s} y=${ru} width=${cl} height=${su} rx=${nu} />
      <rect class="tank-body" x=${Re} y=${Mt} width=${e} height=${at} rx=${rn} />
      ${o!=null&&o>0?D`<g clip-path="url(#${r})"><rect class="tank-fill" x=${Re} y=${(Mt+at*(1-o)).toFixed(1)} width=${e} height=${(at*o+1).toFixed(1)} /></g>`:""}
      ${i.tone!=="unknown"?D`<line class="tank-low-line" x1=${Re+2} y1=${n} x2=${Re+e-2} y2=${n} />`:D`<text class="tank-unknown" x=${Re+e/2} y=${Mt+at/2+1} text-anchor="middle" dominant-baseline="central">\u2013</text>`}
      <rect class="tank-outline" x=${Re} y=${Mt} width=${e} height=${at} rx=${rn} />
    </svg>
  `}var pl=`
  /* The undivided tank keeps the compartment's height and doubles its body width. */
  .tank[data-wide="true"] {
    width: 50px;
  }
  .tank-cap,
  .tank-body {
    fill: var(--silo-mid);
    stroke: var(--primary-text-color);
    stroke-opacity: 0.16;
    stroke-width: 1;
  }
  .tank-outline {
    fill: none;
    stroke: var(--primary-text-color);
    stroke-opacity: 0.16;
    stroke-width: 1;
  }
  .tank-low-line {
    stroke: var(--primary-text-color);
    stroke-opacity: 0.32;
    stroke-width: 1;
    stroke-dasharray: 2 1.4;
  }
  .tank-fill {
    transition: y 400ms cubic-bezier(0.2, 0.8, 0.2, 1), height 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .tank[data-tone="ok"] .tank-fill {
    fill: var(--kibble-feed, #43a96a);
  }
  .tank[data-tone="low"] .tank-fill {
    fill: var(--kibble-amber-dark, #de8a3a);
  }
  .tank[data-tone="empty"] .tank-body,
  .tank[data-tone="empty"] .tank-cap,
  .tank[data-tone="empty"] .tank-outline {
    stroke: var(--error-color, #db4437);
    stroke-opacity: 0.75;
  }
  .tank[data-tone="unknown"] .tank-body,
  .tank[data-tone="unknown"] .tank-cap {
    stroke-dasharray: 2.5 2;
    opacity: 0.55;
  }
  .tank-unknown {
    fill: var(--secondary-text-color);
    font-size: 11px;
    font-weight: 700;
  }
`;var lu=1100,sn=class extends v{constructor(){super();this._closeButtonRef=T();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&this._close()};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.hopperLevel1=null,this.hopperLevel2=null,this.hopperRemaining1=null,this.hopperRemaining2=null,this.singleHopper=!1,this.food1=null,this.food2=null,this._confirmed=null}static{this.properties={hass:{attribute:!1},entities:{attribute:!1},open:{type:Boolean,reflect:!0},hopperLevel1:{attribute:!1},hopperLevel2:{attribute:!1},hopperRemaining1:{attribute:!1},hopperRemaining2:{attribute:!1},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},_confirmed:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),clearTimeout(this._confirmTimer)}updated(e){e.has("open")&&this.open&&(clearTimeout(this._confirmTimer),this._confirmed=null,this._closeButtonRef.value?.focus())}_entityFor(e){return e==="1"?this.entities?.markFullHopper1:e==="2"?this.entities?.markFullHopper2:this.entities?.markFullBoth}_markFull(e){let t=this._entityFor(e);t&&(this.hass.callService("button","press",{},{entity_id:t}),clearTimeout(this._confirmTimer),this._confirmed=e,st("success"),this._confirmTimer=window.setTimeout(()=>{this._confirmed=null,this.requestUpdate()},lu))}render(){if(!this.open)return p;let e=Yi(this.singleHopper,this.hopperLevel1,this.hopperLevel2,this.hopperRemaining1,this.hopperRemaining2),t=!!(this.entities?.markFullHopper1||this.entities?.markFullHopper2||this.entities?.markFullBoth);return c`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.singleHopper?"Hopper":"Hoppers"}>
        <div class="sheet" @click=${s=>s.stopPropagation()}>
          <header>
            <span>${this.singleHopper?"Hopper":"Hoppers"}</span>
            <button type="button" class="icon-button" ${P(this._closeButtonRef)} @click=${this._close} aria-label="Close">${y("close")}</button>
          </header>
          <div class="body">
            ${e.map(s=>this._renderRow(s,ii(s.index,this.food1,this.food2)))}
            ${t?c`
                  <div class="actions">
                    ${this.singleHopper?this._renderMarkButton("both","Mark hopper full",this.entities?.markFullBoth,"primary"):c`
                          ${this._renderMarkButton("1","Mark hopper 1 full",this.entities?.markFullHopper1)}
                          ${this._renderMarkButton("2","Mark hopper 2 full",this.entities?.markFullHopper2)}
                          ${this._renderMarkButton("both","Mark both full",this.entities?.markFullBoth,"primary")}
                        `}
                  </div>
                  <p class="hint">
                    Tip: press the small button on the side of the feeder twice to mark
                    ${this.singleHopper?"the hopper":"both hoppers"} full.
                  </p>
                `:p}
          </div>
        </div>
      </div>
    `}_renderRow(e,t){let s=it(e,t),n=Gi(e,t);return c`
      <div class="hopper-row" data-tone=${e.tone} aria-label=${n}>
        <span class="hopper-row-glyph">${dl(e)}</span>
        <div class="hopper-row-text">
          <span class="hopper-row-name">${s}</span>
          <span class="hopper-row-word">${e.tone==="unknown"?"Level unknown":e.headline}</span>
          ${e.detail?c`<span class="hopper-row-detail">${e.detail}</span>`:p}
        </div>
      </div>
    `}_renderMarkButton(e,t,s,n){let o=this._confirmed===e;return c`
      <button
        type="button"
        class="mark-button ${n??""} ${o?"confirmed":""}"
        ?disabled=${!s||o}
        @click=${()=>this._markFull(e)}
      >
        ${o?c`<span class="mark-check">${y("check")}</span><span>Marked full</span>`:t}
      </button>
    `}static{this.styles=w`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
      box-sizing: border-box;
    }
    @media (min-width: 480px) {
      .backdrop {
        align-items: center;
        padding: 24px;
      }
    }
    .sheet {
      width: 100%;
      max-width: 400px;
      max-height: 92vh;
      overflow-y: auto;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      border-radius: 16px 16px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 16px;
      font-weight: 600;
      position: sticky;
      top: 0;
      background: inherit;
    }
    .icon-button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .body {
      padding: 4px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .hopper-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 12px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }
    /* Reuses the hero tile's own material tokens -- the sheet has no bowl of its own to compute
       them from, so it borrows the same theme-derived plastic look via inherited custom
       properties set on :host below. */
    .tank {
      display: block;
      width: 30px;
      height: 40px;
      overflow: visible;
      flex: none;
    }
    ${le(pl)}
    .hopper-row-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }
    .hopper-row-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      /* A food name can run longer than "Hopper N" ever does -- .hopper-row-text above is
         already min-width: 0, the enabler this ellipsis needs inside the flex row. */
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hopper-row-word {
      font-size: 15px;
      font-weight: 700;
    }
    .hopper-row[data-tone="low"] .hopper-row-word {
      color: var(--kibble-amber-dark);
    }
    .hopper-row[data-tone="empty"] .hopper-row-word {
      color: var(--error-color, #db4437);
    }
    .hopper-row-detail {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 4px;
    }
    .mark-button {
      position: relative;
      min-height: 46px;
      border-radius: 10px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: transform 0.12s ease;
    }
    .mark-button:active:not(:disabled) {
      transform: scale(0.98);
    }
    .mark-button.primary {
      border-color: transparent;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .mark-button:disabled {
      cursor: default;
    }
    .mark-button:disabled:not(.confirmed) {
      opacity: 0.45;
    }
    .mark-button.confirmed {
      border-color: transparent;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      opacity: 1;
      animation: hopper-mark-pulse 700ms ease-out;
    }
    .mark-check {
      display: inline-flex;
      font-size: 16px;
      animation: hopper-check-in 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .hint {
      margin: 2px 0 0;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    @media (prefers-reduced-motion: reduce) {
      .mark-button.confirmed {
        animation: none;
      }
      .mark-check {
        animation: none;
      }
    }
    @keyframes hopper-mark-pulse {
      from {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--kibble-feed, #43a96a) 55%, transparent);
      }
      to {
        box-shadow: 0 0 0 12px color-mix(in srgb, var(--kibble-feed, #43a96a) 0%, transparent);
      }
    }
    @keyframes hopper-check-in {
      from {
        transform: scale(0.3);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `}};customElements.define("kibble-hopper-sheet",sn);function Ne(){return D`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `}function _e(i){let r=0;for(let e=0;e<i.length;e++)r=r*31+i.charCodeAt(e)|0;return ce(r)}var nn=class extends v{constructor(){super();this._ref=new De;this._visible=!1;this._observer=null;this.alt="",this.rounded=!1,this.fit="cover"}static{this.properties={hass:{attribute:!1},asset:{attribute:!1},cache:{attribute:!1},alt:{type:String},rounded:{type:Boolean},fit:{type:String}}}connectedCallback(){super.connectedCallback(),this._visible=!1,this._observer=new IntersectionObserver(e=>{e.some(t=>t.isIntersecting)&&this._markVisible()},{rootMargin:"200px"}),this._observer.observe(this),requestAnimationFrame(()=>{if(this._visible||!this.isConnected)return;let e=this.getBoundingClientRect(),t=window.innerHeight||document.documentElement.clientHeight;e.width>0&&e.height>0&&e.bottom>-200&&e.top<t+200&&this._markVisible()})}_markVisible(){this._visible||(this._visible=!0,this._sync(),this.requestUpdate(),this._observer?.disconnect(),this._observer=null)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=null,this._ref.dispose()}willUpdate(e){(e.has("asset")||e.has("cache")||e.has("hass"))&&this._sync()}_sync(){this._visible&&this._ref.sync(this.hass,this.cache,this.asset,()=>this.requestUpdate())}render(){let e=this._ref.url;return c`
      <div class="box ${this.rounded?"rounded":""}">
        ${e?c`<img src=${e} alt=${this.alt} loading="lazy" style="object-fit:${this.fit}" />`:c`<div class="placeholder"></div>`}
      </div>
    `}static{this.styles=w`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .box {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .box.rounded {
      border-radius: 50%;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    @media (prefers-reduced-motion: no-preference) {
      img {
        animation: kibble-image-in 180ms ease-out;
      }
    }
    @keyframes kibble-image-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .placeholder {
      width: 100%;
      height: 100%;
    }
  `}};customElements.define("kibble-image",nn);var on=class extends v{constructor(){super();this._ownCache=new ge;this.name=null,this.colorIndex=null,this.asset=null}static{this.properties={hass:{attribute:!1},name:{type:String},colorIndex:{type:Number,attribute:"color-index"},asset:{attribute:!1},cache:{attribute:!1}}}disconnectedCallback(){super.disconnectedCallback(),this._ownCache.dispose()}render(){if(!this.name)return c`<div class="avatar neutral">${Ne()}</div>`;let e=this.colorIndex!=null?ce(this.colorIndex):_e(this.name);return c`
      <div class="avatar" style="--kibble-avatar-color: ${e}">
        ${this.asset?c`<kibble-image rounded .hass=${this.hass} .asset=${this.asset} .cache=${this.cache??this._ownCache} alt=""></kibble-image>`:c`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `}static{this.styles=w`
    :host {
      display: block;
      width: var(--kibble-avatar-size, 40px);
      height: var(--kibble-avatar-size, 40px);
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--kibble-avatar-color, var(--primary-color, #03a9f4)) 22%, var(--card-background-color, #fff));
      color: var(--kibble-avatar-color, var(--primary-color, #03a9f4));
      flex: none;
    }
    .avatar.neutral {
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .avatar.neutral svg {
      width: 62%;
      height: 62%;
    }
    kibble-image {
      width: 100%;
      height: 100%;
    }
    .monogram {
      font-size: calc(var(--kibble-avatar-size, 40px) * 0.42);
      font-weight: 700;
      line-height: 1;
      user-select: none;
    }
  `}};customElements.define("kibble-avatar",on);var Zc=ip(Xc(),1);function ao(i){for(let r of Object.values(i.entities??{}))if(r.platform==="scrypted"&&r.entity_id.startsWith("sensor.scrypted_token")){let e=i.states[r.entity_id]?.state;if(e&&e!=="unavailable"&&e!=="unknown")return e}}var oo=class{constructor(){this.options={proxy:!0,userAgent:navigator.userAgent,capabilities:{audio:RTCRtpReceiver.getCapabilities?.("audio")??{codecs:[],headerExtensions:[]},video:RTCRtpReceiver.getCapabilities?.("video")??{codecs:[],headerExtensions:[]}},screen:{devicePixelRatio:window.devicePixelRatio,width:screen.width,height:screen.height}};this.__proxy_props={options:this.options}}async getOptions(){return this.options}createPeerConnection(r){if(this.pc)return this.pc;let e=new RTCPeerConnection(r.configuration);this.pc=e,e.addEventListener("iceconnectionstatechange",()=>{["disconnected","failed","closed"].includes(e.iceConnectionState)&&this.onClosed?.()});let t=new MediaStream;if(e.addEventListener("track",s=>{t.addTrack(s.track),this.onTrack?.(t)}),r.datachannel&&e.createDataChannel(r.datachannel.label,r.datachannel.dict),r.audio){let s=e.addTransceiver("audio",r.audio);(r.audio.direction==="sendrecv"||r.audio.direction==="sendonly")&&(this.microphone=s.sender)}return r.video&&e.addTransceiver("video",r.video),e}async createLocalDescription(r,e,t){let s=this.createPeerConnection(e),n=new Promise(u=>{s.onicecandidate=h=>{h.candidate?t?.(JSON.parse(JSON.stringify(h.candidate))):u()},s.onicegatheringstatechange=()=>{s.iceGatheringState==="complete"&&u()}}),o=r==="offer"?await s.createOffer({offerToReceiveAudio:!!e.audio,offerToReceiveVideo:!!e.video}):await s.createAnswer(),a=s.setLocalDescription(o);if(t)return{type:o.type,sdp:o.sdp};await a,await n;let l=s.localDescription??o;return{type:l.type,sdp:l.sdp}}async setRemoteDescription(r,e){await this.createPeerConnection(e).setRemoteDescription(r)}async addIceCandidate(r){await this.pc?.addIceCandidate(r)}async endSession(){}async setMicrophone(r){if(!this.microphone)throw new Error("this stream has no return-audio channel");if(r&&!this.micTrack){let e=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1});this.micTrack=e.getAudioTracks()[0],await this.microphone.replaceTrack(this.micTrack)}this.micTrack&&(this.micTrack.enabled=r)}close(){this.micTrack?.stop(),this.pc?.getSenders().forEach(r=>r.track?.stop()),this.pc?.close(),this.pc=void 0}},Wr=class{constructor(r){this.state="idle";this.hasIntercom=!1;this.onChange=r}async open(r,e){this.close(),this.setState("connecting");try{let t=`${location.origin}/api/scrypted/${r.token}/`,s=await(0,Zc.connectScryptedClient)({baseUrl:t,pluginId:"@scrypted/core",clientName:"kibble-card"});this.client=s;let n=s.systemManager.getDeviceById(r.deviceId);if(!n)throw new Error(`Scrypted has no device ${r.deviceId}`);let o=n.interfaces??[];if(!o.includes("RTCSignalingChannel"))throw new Error(`${n.name} has no WebRTC channel in Scrypted`);this.hasIntercom=o.includes("Intercom");let a=new oo;this.session=a,a.onTrack=u=>{e.srcObject!==u&&(e.srcObject=u,e.play().catch(()=>{})),this.setState("live")},a.onClosed=()=>{this.session===a&&this.fail("stream disconnected")};let l=n;this.control=await l.startRTCSignalingSession(a)}catch(t){throw this.fail(t instanceof Error?t.message:String(t)),t}}async talk(r){if(!this.session)throw new Error("not connected");await this.session.setMicrophone(r),await this.control?.setPlayback({audio:r,video:!0})}close(){this.control?.setPlayback({audio:!1,video:!0}).catch(()=>{}),this.control=void 0,this.session?.close(),this.session=void 0,this.client?.disconnect?.(),this.client=void 0,this.state!=="idle"&&this.setState("idle")}fail(r){this.error=r,this.session?.close(),this.session=void 0,this.setState("error")}setState(r){this.state=r,r!=="error"&&(this.error=void 0),this.onChange()}};function Qc(i,r,e){return i&&r?{kind:"scrypted",deviceId:i,token:r}:e?{kind:"ha-camera",entityId:e}:{kind:"none"}}function Jc(i){return Math.min(i*2,3e4)}var $i={visible:!0},Wf={visible:!1};function ed(i){return i.visible?{state:i,consumed:!1}:{state:$i,consumed:!0}}function td(i,r){return r?i:Wf}function id(i,r){return i.visible&&!r}var Gf=8e3,Yf=2e3,Xf=6e4,Zf=1e3,Qf=1e4,Jf=1100,em=1,tm=2.4,im=64,lo=class extends v{constructor(){super();this._starting=!1;this._backoffMs=1e3;this._lastProgress=0;this._hiddenPaused=!1;this._visionQuery=new te(()=>this.requestUpdate());this._watchedStillImg=null;this._live=new Wr(()=>{this._tick=(this._tick??0)+1});this._onScryptedLoadedMetadata=()=>{this._applyMute();let e=this.renderRoot.querySelector("#video");e&&this._reportMediaAspect(e.videoWidth,e.videoHeight)};this._onStillImgLoad=e=>{let t=e.target;this._reportMediaAspect(t.naturalWidth,t.naturalHeight)};this._start=async()=>{let e=ao(this.hass);if(!e||!this.scryptedId)return;this._starting=!0,this._playing=!0,this._lastProgress=performance.now(),await this.updateComplete;let t=this.renderRoot.querySelector("#video");if(!t){this._starting=!1;return}try{await this._live.open({deviceId:this.scryptedId,token:e},t),this._reconnecting=!1,this._backoffMs=1e3}catch{this._beginReconnect();return}finally{this._starting=!1}};this._onTimeUpdate=()=>{this._lastProgress=performance.now()};this._checkStall=()=>{this._videoSource().kind==="scrypted"&&(!this._playing||this._reconnecting||document.hidden||performance.now()-this._lastProgress>Gf&&this._beginReconnect())};this._pollVision=()=>{let e=this.hass?.callWS,t=this.entryId;!e||!t||this._visionQuery.refresh(()=>e({type:"kibble/vision/last",entry_id:t}).then(s=>s))};this._onVisibilityChange=()=>{if(this._videoSource().kind==="scrypted"){if(document.hidden){clearTimeout(this._hiddenTimer),this._hiddenTimer=setTimeout(this._pauseForHidden,Xf);return}if(clearTimeout(this._hiddenTimer),this._hiddenTimer=void 0,this._hiddenPaused){this._hiddenPaused=!1,this._backoffMs=1e3,this.requestUpdate();return}this._playing&&(this._lastProgress=performance.now())}};this._pauseForHidden=()=>{this._hiddenTimer=void 0,this._videoSource().kind==="scrypted"&&(!this._playing&&!this._reconnecting||(this._hiddenPaused=!0,this._reconnecting=!1,clearTimeout(this._reconnectTimer),this._reconnectTimer=void 0,this._live.close(),this._playing=!1,this._talking=!1))};this._stop=()=>{clearTimeout(this._reconnectTimer),this._reconnectTimer=void 0,clearTimeout(this._hiddenTimer),this._hiddenTimer=void 0,this._live.close(),this._playing=!1,this._talking=!1,this._starting=!1,this._reconnecting=!1,this._hiddenPaused=!1,this._backoffMs=1e3};this._onFrameClick=e=>{if(!this._overlayIdle.visible){this._applyOverlayIdle(ed(this._overlayIdle).state),this._armIdleTimer(),e.stopPropagation();return}if(this._onOverlayActivity(),e.target.closest?.(".chip")){e.stopPropagation();return}this._expanded||this._expand()};this._collapse=e=>{e?.stopPropagation(),this._onOverlayActivity(),document.removeEventListener("keydown",this._onKeyDown),this._fullscreen&&(document.exitFullscreen?.()??Promise.resolve()).catch(()=>{}),this._expanded=!1};this._onKeyDown=e=>{e.key==="Escape"&&this._collapse()};this._toggleFullscreen=async e=>{if(e.stopPropagation(),this._onOverlayActivity(),this._fullscreen){await(document.exitFullscreen?.()??Promise.resolve()).catch(()=>{});return}let t=this.renderRoot.querySelector("#frame"),s=this.renderRoot.querySelector("#video");try{t?.requestFullscreen?await t.requestFullscreen():s?.webkitEnterFullscreen&&s.webkitEnterFullscreen()}catch{}};this._onFullscreenChange=()=>{let e=this.renderRoot,t=document,s=e.fullscreenElement??e.webkitFullscreenElement??null,n=document.fullscreenElement??t.webkitFullscreenElement??null,o=!1;for(let a=this;a&&n;a=a.host??a.parentNode)if(a===n){o=!0;break}this._fullscreen=s!==null||o};this._toggleMute=()=>{this._onOverlayActivity(),this._muted=!this._muted,this._videoSource().kind==="scrypted"&&this._applyMute()};this._applyMute=()=>{let e=this.renderRoot.querySelector("#video");e&&(e.muted=this._muted,e.play().catch(()=>{}))};this._toggleTalk=async()=>{this._onOverlayActivity();let e=!this._talking;this._talking=e;try{await this._live.talk(e)}catch{e&&(this._talking=!1)}};this._callCats=e=>{if(e.stopPropagation(),this._onOverlayActivity(),this._callingCats||!this.callCatsEntity)return;let t=this.callCatsEntity;this._callingCats=!0,this._pulsingCue=!0,this._cooldownTimer=setTimeout(()=>{this._callingCats=!1},Qf),this._pulseTimer=setTimeout(()=>{this._pulsingCue=!1},Jf),this.hass.callService("button","press",{entity_id:t}).catch(()=>{})};this._onOverlayActivity=()=>{this._applyOverlayIdle($i),this._armIdleTimer()};this._onFrameFocusIn=e=>{this._onOverlayActivity();let t=e.target;this._controlsFocusVisible=typeof t.matches=="function"&&t.matches(":focus-visible")};this._onFrameFocusOut=e=>{let t=e.relatedTarget,s=this.renderRoot.querySelector("#frame");(!t||!s?.contains(t))&&(this._controlsFocusVisible=!1)};this._onIdleTimerFired=()=>{this._idleTimer=void 0,this._applyOverlayIdle(td(this._overlayIdle,this._idlePinned()))};this.cats=[],this._playing=!1,this._talking=!1,this._muted=!0,this._reconnecting=!1,this._expanded=!1,this._fullscreen=!1,this._tick=0,this._callingCats=!1,this._pulsingCue=!1,this._overlayIdle=$i,this._controlsFocusVisible=!1}static{this.properties={hass:{attribute:!1},cameraEntity:{attribute:!1},cats:{attribute:!1},cache:{attribute:!1},scryptedId:{attribute:!1},entryId:{attribute:!1},overlayEntity:{attribute:!1},callCatsEntity:{attribute:!1},externalPin:{attribute:!1},_playing:{state:!0},_talking:{state:!0},_muted:{state:!0},_reconnecting:{state:!0},_expanded:{state:!0},_fullscreen:{state:!0},_tick:{state:!0},_callingCats:{state:!0},_pulsingCue:{state:!0},_overlayIdle:{state:!0},_controlsFocusVisible:{state:!0}}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),document.addEventListener("fullscreenchange",this._onFullscreenChange),document.addEventListener("webkitfullscreenchange",this._onFullscreenChange),this._stallCheckInterval=setInterval(this._checkStall,Yf),this._armIdleTimer()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibilityChange),document.removeEventListener("fullscreenchange",this._onFullscreenChange),document.removeEventListener("webkitfullscreenchange",this._onFullscreenChange),document.removeEventListener("keydown",this._onKeyDown),clearInterval(this._stallCheckInterval),this._stallCheckInterval=void 0,clearInterval(this._visionTimer),this._visionTimer=void 0,clearTimeout(this._cooldownTimer),this._cooldownTimer=void 0,clearTimeout(this._pulseTimer),this._pulseTimer=void 0,clearTimeout(this._idleTimer),this._idleTimer=void 0,this._stop()}_videoSource(){return this.hass?Qc(this.scryptedId,ao(this.hass),this.cameraEntity):{kind:"none"}}updated(e){this._syncVisionPolling(),this._syncStillAspectWatch(),(e.has("_talking")||e.has("_pulsingCue")||e.has("_controlsFocusVisible")||e.has("externalPin"))&&this._syncIdlePin();let t=this._videoSource();if(t.kind!=="scrypted"){(this._starting||this._reconnecting||this._hiddenPaused||this._live.state!=="idle")&&this._stop(),this._playing=t.kind==="ha-camera";return}if(this._live.state==="error"&&this._playing){this._beginReconnect();return}this._playing||this._starting||this._reconnecting||this._hiddenPaused||this._start()}render(){let e=this._videoSource();return c`
      ${this._expanded?c`<div class="backdrop" @click=${this._collapse}></div>`:p}
      <div
        class="frame ${this._expanded?"expanded":""}"
        id="frame"
        @click=${this._onFrameClick}
        @pointermove=${this._onOverlayActivity}
        @pointerenter=${this._onOverlayActivity}
        @wheel=${this._onOverlayActivity}
        @focusin=${this._onFrameFocusIn}
        @focusout=${this._onFrameFocusOut}
      >
        ${this._renderStill()}
        ${this._playing?this._renderVideo(e):p}
        ${this._playing?this._renderDetections():p}
        ${this._expanded?c`<div class="topbar ${this._overlayIdle.visible?"":"idle-hidden"}">
              <button class="chip" aria-label=${this._fullscreen?"Leave fullscreen":"Fullscreen"} title=${this._fullscreen?"Leave fullscreen":"Fullscreen"} @click=${this._toggleFullscreen}>
                ${y(this._fullscreen?"fullscreenExit":"fullscreen")}
              </button>
              <button class="chip" aria-label="Close" title="Close" @click=${this._collapse}>${y("close")}</button>
            </div>`:p}
        ${e.kind==="scrypted"&&this._reconnecting?c`<div class="reconnect" role="status" aria-label="Reconnecting to the feeder's camera">${y("refresh")}</div>`:p}
        <div class="controls ${this._overlayIdle.visible?"":"idle-hidden"}">
          ${this._playing?c`<button
                class="chip"
                aria-pressed=${!this._muted}
                aria-label=${this._muted?"Unmute the feeder":"Mute the feeder"}
                title=${this._muted?"Unmute the feeder":"Mute the feeder"}
                @click=${this._toggleMute}
              >
                ${y(this._muted?"volumeOff":"volumeHigh")}
              </button>`:p}
          ${this._playing&&e.kind==="scrypted"&&this._live.hasIntercom?c`<button
                class="chip talk"
                aria-pressed=${this._talking}
                aria-label=${this._talking?"Stop talking to the feeder":"Talk to the feeder"}
                title=${this._talking?"Stop talking to the feeder":"Talk to the feeder"}
                @click=${this._toggleTalk}
              >
                ${y(this._talking?"microphone":"microphoneOff")}
              </button>`:p}
          ${this._callCatsAvailable()?c`<button
                class="chip call-cats ${this._pulsingCue?"pulsing":""}"
                aria-label="Call the cats"
                title="Call the cats"
                ?disabled=${this._callingCats}
                @click=${this._callCats}
              >
                ${y("cat")}
              </button>`:p}
        </div>
        ${e.kind==="scrypted"&&this._live.state==="error"&&!this._reconnecting?c`<div class="note error">${this._live.error}</div>`:p}
      </div>
    `}_renderVideo(e){return e.kind==="scrypted"?c`<video
        id="video"
        autoplay
        playsinline
        ?muted=${this._muted}
        @loadedmetadata=${this._onScryptedLoadedMetadata}
        @timeupdate=${this._onTimeUpdate}
      ></video>`:e.kind==="ha-camera"&&customElements.get("ha-camera-stream")?c`<ha-camera-stream
        .hass=${this.hass}
        .stateObj=${this.hass.states[e.entityId]}
        .fitMode=${"contain"}
        .muted=${this._muted}
      ></ha-camera-stream>`:p}_renderStill(){if(!this.cameraEntity)return c`<div class="placeholder">No camera on this device</div>`;if(customElements.get("hui-image"))return c`<hui-image .hass=${this.hass} .cameraImage=${this.cameraEntity} cameraView="auto"></hui-image>`;let e=this.hass.states[this.cameraEntity]?.attributes.entity_picture;return typeof e=="string"?c`<img src=${e} alt="The feeder's camera" @load=${this._onStillImgLoad} />`:c`<div class="placeholder">Camera unavailable</div>`}_reportMediaAspect(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)return;let s=Math.min(tm,Math.max(em,e/t));this._reportedAspect!==void 0&&Math.abs(this._reportedAspect-s)<.001||(this._reportedAspect=s,this.style.setProperty("--kibble-hero-aspect",String(s)),this.dispatchEvent(new CustomEvent("media-aspect-changed",{detail:{ratio:s},bubbles:!0,composed:!0})))}_syncStillAspectWatch(){let t=this.renderRoot.querySelector("hui-image")?.shadowRoot?.querySelector("img")??null;t!==this._watchedStillImg&&(this._watchedStillImg&&this._watchedStillImg.removeEventListener("load",this._onStillImgLoad),this._watchedStillImg=t,t&&(t.complete&&t.naturalWidth>0&&this._reportMediaAspect(t.naturalWidth,t.naturalHeight),t.addEventListener("load",this._onStillImgLoad,{once:!0})))}_renderDetections(){let e=this._visionQuery.state.data?.frame;if(!this._overlayOn()||!e?.detections)return p;let t=e.overlay_suppressed??!0,s=e.detections.filter(o=>o.admitted||t);if(s.length===0)return p;let n=s.map((o,a)=>{let l=o.cat||null,u=l?this.cats?.find(d=>d.name===l):void 0,h=o.admitted&&l!==null;return{key:`vision-${o.sid??"unmatched"}-${a}`,box:[o.x1,o.y1,o.x2,o.y2],tone:o.admitted?h?"cat":"unknown":"clutter",color:h?u?ce(u.color):_e(l):void 0,label:h?l:void 0,avatar:u?.avatar??null}});return c`<kibble-box-overlay class="detections" .boxes=${n} .hass=${this.hass} .cache=${this.cache} .labelSafeTop=${im}></kibble-box-overlay>`}_beginReconnect(){this._playing=!1,this._reconnecting=!0,this._talking=!1,this._live.close(),this._reconnectTimer===void 0&&(this._reconnectTimer=setTimeout(()=>{this._reconnectTimer=void 0,this._start()},this._backoffMs),this._backoffMs=Jc(this._backoffMs))}_overlayOn(){let e=this.overlayEntity;return e!==void 0&&this.hass?.states[e]?.state==="on"}_syncVisionPolling(){let e=this._playing&&this._overlayOn()&&!!this.entryId&&!!this.hass?.callWS,t=this._visionTimer!==void 0;if(e!==t){if(!e){this._stopVisionPolling();return}this._pollVision(),this._visionTimer=setInterval(this._pollVision,Zf)}}_stopVisionPolling(){clearInterval(this._visionTimer),this._visionTimer=void 0,this._visionQuery=new te(()=>this.requestUpdate())}_expand(){this._expanded=!0,document.addEventListener("keydown",this._onKeyDown)}_callCatsAvailable(){let e=this.callCatsEntity;return e!==void 0&&this.hass?.states[e]?.state!=="unavailable"}notifyActivity(){this._onOverlayActivity()}_applyOverlayIdle(e){let t=e.visible!==this._overlayIdle.visible;this._overlayIdle=e,t&&this.dispatchEvent(new CustomEvent("overlay-idle-changed",{detail:{visible:e.visible},bubbles:!0,composed:!0}))}_idlePinned(){return this._talking||this._pulsingCue||this._controlsFocusVisible||!!this.externalPin}_syncIdlePin(){if(this._idlePinned()){clearTimeout(this._idleTimer),this._idleTimer=void 0,this._overlayIdle.visible||this._applyOverlayIdle($i);return}this._idleTimer===void 0&&this._armIdleTimer()}_armIdleTimer(){clearTimeout(this._idleTimer),this._idleTimer=void 0,id(this._overlayIdle,this._idlePinned())&&(this._idleTimer=setTimeout(this._onIdleTimerFired,5e3))}static{this.styles=w`
    :host {
      display: block;
      height: 100%;
      /* The frame inside is absolutely positioned, so this element has no intrinsic size and
         takes its height from its parent. In the stacked (phone) layout nothing supplies one,
         and a hero with no loaded frame collapsed to ~60 px -- measured on a 390x844 viewport
         -- then jumped to full height the moment the stream arrived. The ratio reserves the
         space up front, and is always the media's own real ratio once _reportMediaAspect
         learns it (set directly on this host's own --kibble-hero-aspect custom property;
         kibble-card.ts sets the same variable on .hero from the bubbled media-aspect-changed
         event, so the two stay in lockstep even though .hero -- not this element's own
         aspect-ratio -- is what actually sizes the video once this is nested inside the card).
         Where a parent does set a height (the wide layout, where the side column drives the
         row) that height still wins: aspect-ratio only fills in a dimension nothing else has
         decided. */
      aspect-ratio: var(--kibble-hero-aspect, 16 / 9);
      position: relative;
    }
    .frame {
      position: absolute;
      inset: 0;
      background: #101010;
      cursor: zoom-in;
    }
    .frame.expanded {
      position: fixed;
      inset: 0;
      z-index: 1001; /* above HA's app header (z-index 4) and dialogs' scrim */
      cursor: default;
      background: #000;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.85);
    }
    .topbar {
      position: absolute;
      top: max(8px, env(safe-area-inset-top));
      right: max(8px, env(safe-area-inset-right));
      display: flex;
      gap: 6px;
      pointer-events: none;
    }
    .topbar .chip {
      pointer-events: auto;
    }
    video,
    img,
    hui-image,
    ha-camera-stream {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain; /* never cropped, inline or expanded; ha-camera-stream ignores this on its own host -- its .fitMode in _renderVideo carries the same "contain" instead */
    }
    video,
    ha-camera-stream {
      position: absolute;
      inset: 0;
    }
    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #bbb;
      font-size: 14px;
    }
    .controls {
      position: absolute;
      left: 8px;
      right: 8px;
      bottom: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: flex-end;
      pointer-events: none;
    }
    .frame.expanded .controls {
      bottom: max(12px, env(safe-area-inset-bottom));
      right: max(12px, env(safe-area-inset-right));
    }
    /* Video-player-style auto-hide (lib/overlay-idle.ts): no transition property outside the
       no-preference query, so a reduced-motion user's browser snaps the final opacity/position
       instantly instead of animating it, matching .reconnect svg's spin and
       .chip.call-cats.pulsing's rings just below. */
    @media (prefers-reduced-motion: no-preference) {
      .controls,
      .topbar {
        transition: opacity 200ms ease, transform 200ms ease;
      }
    }
    .controls.idle-hidden {
      opacity: 0;
      transform: translateY(6px);
    }
    .topbar.idle-hidden {
      opacity: 0;
      transform: translateY(-6px);
    }
    .controls.idle-hidden .chip,
    .topbar.idle-hidden .chip {
      pointer-events: none;
    }
    .chip {
      pointer-events: auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      cursor: pointer;
      backdrop-filter: blur(2px);
      transition: background 120ms ease, color 120ms ease;
    }
    .chip svg {
      font-size: 20px;
    }
    .chip:hover {
      background: rgba(0, 0, 0, 0.7);
    }
    .chip.talk {
      user-select: none;
    }
    .chip.talk[aria-pressed="true"] {
      background: var(--kibble-amber, #f2a33c);
      color: var(--kibble-ink-on-amber, #241a07);
    }
    .chip.call-cats {
      position: relative;
    }
    .chip.call-cats:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .chip.call-cats.pulsing::before,
    .chip.call-cats.pulsing::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid var(--kibble-amber, #f2a33c);
      opacity: 0;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: no-preference) {
      .chip.call-cats.pulsing::before {
        animation: kibble-cue-pulse 1.1s ease-out;
      }
      .chip.call-cats.pulsing::after {
        animation: kibble-cue-pulse 1.1s ease-out 0.25s;
      }
    }
    @keyframes kibble-cue-pulse {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }
      100% {
        transform: scale(1.9);
        opacity: 0;
      }
    }
    .reconnect {
      position: absolute;
      top: 8px;
      left: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      pointer-events: none;
    }
    .reconnect svg {
      font-size: 16px;
    }
    @media (prefers-reduced-motion: no-preference) {
      .reconnect svg {
        animation: kibble-reconnect-spin 1.1s linear infinite;
      }
    }
    @keyframes kibble-reconnect-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .note {
      position: absolute;
      left: 8px;
      bottom: 54px;
      padding: 3px 9px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 12px;
      max-width: calc(100% - 16px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .note.error {
      color: var(--error-color, #ff8a80);
    }
    .detections {
      position: absolute;
      inset: 0;
    }
  `}};customElements.define("kibble-live-hero",lo);async function rd(){return customElements.get("bubble-card")?!0:(await Promise.race([customElements.whenDefined("bubble-card"),new Promise(i=>setTimeout(i,2e3))]),!!customElements.get("bubble-card"))}var co=class extends v{constructor(){super(...arguments);this._builtFor=""}static{this.properties={hass:{attribute:!1},config:{attribute:!1}}}updated(){this._sync()}async _sync(){if(!this.config)return;let e=JSON.stringify(this.config);if(e!==this._builtFor){this._builtFor=e;let t=await window.loadCardHelpers?.();if(!t||e!==this._builtFor)return;let s=t.createCardElement({type:"custom:bubble-card",...this.config});this._element?.remove(),this._element=s,this.renderRoot.querySelector(".slot")?.appendChild(s)}this._element&&this.hass&&(this._element.hass=this.hass)}render(){return c`<div class="slot"></div>`}static{this.styles=w`
    :host {
      display: block;
    }
    .slot > * {
      /* Bubble rows carry their own outer margin for stacking; the card lays them out itself. */
      --bubble-margin: 0;
    }
  `}};customElements.define("kibble-bubble-row",co);var rm=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"scrypted_id",selector:{text:{}}},{name:"settings_hash",selector:{text:{}}},{name:"detection_areas_hash",selector:{text:{}}},{name:"schedule_hash",selector:{text:{}}}],sm={device_id:"Kibble device",name:"Name (optional)",scrypted_id:"Scrypted camera id (optional, adds low-latency video and talk)",settings_hash:"Settings pop-up hash (optional)",detection_areas_hash:"Detection areas pop-up hash (optional)",schedule_hash:"Schedule handled by dashboard (optional hash)"},po=class extends v{constructor(){super(...arguments);this._computeLabel=e=>sm[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${rm}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():p}_renderFallback(){let e=Object.values(this.hass?.entities??{}),t=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return c`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${t.map(s=>c`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
          </select>
        </label>
        <label>
          <span>Name (optional)</span>
          <input
            type="text"
            .value=${this._config?.name??""}
            @change=${s=>this._updateName(s.target.value)}
          />
        </label>
        <label>
          <span>Settings pop-up hash (optional)</span>
          <input
            type="text"
            placeholder="#settings"
            .value=${this._config?.settings_hash??""}
            @change=${s=>this._updateSettingsHash(s.target.value)}
          />
        </label>
        <label>
          <span>Detection areas pop-up hash (optional)</span>
          <input
            type="text"
            placeholder="#detection-areas"
            .value=${this._config?.detection_areas_hash??""}
            @change=${s=>this._updateDetectionAreasHash(s.target.value)}
          />
        </label>
        <label>
          <span>Schedule pop-up hash (optional)</span>
          <input
            type="text"
            placeholder="#schedule"
            .value=${this._config?.schedule_hash??""}
            @change=${s=>this._updateScheduleHash(s.target.value)}
          />
        </label>
      </div>
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateSettingsHash(e){this._config&&(this._config={...this._config,settings_hash:e||void 0},this._fireConfigChanged())}_updateDetectionAreasHash(e){this._config&&(this._config={...this._config,detection_areas_hash:e||void 0},this._fireConfigChanged())}_updateScheduleHash(e){this._config&&(this._config={...this._config,schedule_hash:e||void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=w`
    .fallback {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    select,
    input {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
    }
  `}};customElements.define("kibble-card-editor",po);var Gr=class{constructor(r){this._onChanged=r;this._unsubscribe=null;this._subscribing=!1}sync(r,e){e!==this._entryId&&(this._entryId=e,this._resubscribe(r,e))}async _resubscribe(r,e){let t=this._unsubscribe;if(this._unsubscribe=null,t&&await t().catch(()=>{}),!(!r?.connection||!e||this._subscribing)){this._subscribing=!0;try{let s=await r.connection.subscribeMessage(()=>{this._entryId===e&&this._onChanged()},{type:"kibble/timeline/subscribe",entry_id:e});if(this._subscribing=!1,this._entryId!==e){s().catch(()=>{});return}this._unsubscribe=s}catch{this._subscribing=!1}}}dispose(){let r=this._unsubscribe;this._unsubscribe=null,this._entryId=void 0,r&&r().catch(()=>{})}};var Yr=class{constructor(r){this._onChange=r;this.state={items:null,loading:!1,loadingMore:!1,cursor:null,hasMore:!1,error:null};this._key=null;this._generation=0;this._lastLimit=30;this._live=new Gr(()=>this._onLiveChange())}sync(r,e,t){this._lastHass=r,this._lastEntryId=e,this._lastLimit=t,this._live.sync(r,e);let s=e?`${e}:${t}`:null;s!==this._key&&(this._key=s,!(!r?.callWS||!e)&&this._readPage(r,e,t,null,++this._generation,!0))}loadMore(r,e,t){!r?.callWS||!e||this.state.loading||this.state.loadingMore||!this.state.hasMore||this._readPage(r,e,t,this.state.cursor,this._generation,!1)}refresh(r,e,t){!r?.callWS||!e||this._readPage(r,e,t,null,++this._generation,!0)}replaceItem(r,e){let t=this.state.items;if(!t)return;let s=t.findIndex(o=>o.uid===r);if(s===-1)return;let n=t.slice();n[s]=e,this.state={...this.state,items:n},this._onChange()}removeItem(r){let e=this.state.items;e&&e.some(t=>t.uid===r)&&(this.state={...this.state,items:e.filter(t=>t.uid!==r)},this._onChange())}restoreItems(r){this.state={...this.state,items:r},this._onChange()}_onLiveChange(){this.refresh(this._lastHass,this._lastEntryId,this._lastLimit)}async _readPage(r,e,t,s,n,o){this.state=o?{...this.state,loading:!0,error:null}:{...this.state,loadingMore:!0,error:null},this._onChange();try{let a=await r.callWS({type:"kibble/timeline",entry_id:e,limit:t,...s?{cursor:s}:{}});if(n!==this._generation)return;let l=o?a.items:[...this.state.items??[],...a.items];this.state={items:l,loading:!1,loadingMore:!1,cursor:a.cursor,hasMore:a.has_more,error:null}}catch(a){if(n!==this._generation)return;this.state={...this.state,loading:!1,loadingMore:!1,error:q(a)}}this._onChange()}dispose(){this._generation+=1,this._live.dispose()}};async function Xr(i,r,e){if(!i.callWS)throw new Error("Not connected.");return(await i.callWS({type:"kibble/sample/label",entry_id:r,sample_uid:e.sampleUid,label:e.label})).sample}function Zr(i){return i.kind==="feed"?null:i.thumb??i.scene??null}function sd(i){let r=Math.floor(i/60),e=i%60;return r===0?`${e} sec`:e===0?`${r} min`:`${r} min ${e} sec`}function Qr(i){return i.kind!=="eat"||i.open||i.end==null||i.end<=i.start?null:sd(i.end-i.start)}function nd(i,r){return!Number.isFinite(i)||!Number.isFinite(r)||r<=i?null:sd(Math.floor(r-i))}function Ye(i){return i.open?i.kind==="eat"?"is eating":"is here":i.kind==="eat"?"ate":"came by"}function Jr(i){return i.kind==="feed"?Kt(i):i.cat?`${i.cat} ${Ye(i)}`:i.kind==="eat"?"Someone is eating":"Someone is here"}function uo(i){return`${i} portion${i===1?"":"s"}`}function Kt(i){let r=i.feed;if(!r||r.portions==null)return"Fed";if(r.single||r.sides.length===0)return`Fed ${uo(r.portions)}`;if(r.sides.length===1){let[s]=r.sides,n=s.food?`of ${s.food}`:`from hopper ${s.hopper}`;return`Fed ${uo(s.portions)} ${n}`}let[e,t]=r.sides;return e.food&&t.food?`Fed ${e.portions} ${e.food} and ${t.portions} ${t.food}`:e.portions===t.portions?`Fed ${uo(e.portions)} from each hopper`:`Fed ${e.portions} from hopper ${e.hopper} and ${t.portions} from hopper ${t.hopper}`}function he(i,r){return new Date(i*1e3).toLocaleTimeString(r,{hour:"numeric",minute:"2-digit"})}function es(i){return i.kind!=="eat"&&i.kind!=="feed"||!i.before||!i.after?null:{before:i.before,after:i.after}}var nm=5*60;function om(i){return i.length<2?i[0]??"":i.length===2?i[0]+" and "+i[1]:i.slice(0,-1).join(", ")+", and "+i[i.length-1]}function ts(i){return[...i].sort((r,e)=>+(e.kind==="eat")-+(r.kind==="eat")||+(r.cat===null)-+(e.cat===null))}function od(i){let r=ts(i),e=r.map(n=>n.cat??"Who?"),t=r.every(n=>n.kind===r[0]?.kind),s=r.every(n=>n.open===r[0]?.open);if(t&&s&&r[0]?.kind!=="feed"){let n=r[0]?.kind,o=r[0]?.open?n==="eat"?"are eating":"are here":n==="eat"?"ate":"came by";return om(e)+" "+o}return r.map((n,o)=>e[o]+" "+Ye(n)).join(", ")}function ad(i,r=Date.now()/1e3){let e=new Map;for(let o of i){if(o.session===null||o.session===void 0)continue;let a=e.get(o.session)??[];a.push(o),e.set(o.session,a)}let t=new Map;for(let o of e.values()){let a=[...o].sort((d,f)=>d.start-f.start),l=[],u=Number.NEGATIVE_INFINITY,h=()=>{if(l.length>1){let d=new Set(l.map(g=>g.uid)),f=i.filter(g=>d.has(g.uid)),m=Math.min(...f.map(g=>g.start)),b=Math.max(...f.map(g=>Math.max(g.start,g.end??r))),_={event:f[0],events:f,together:!0,start:m,end:b};for(let g of f)t.set(g.uid,_)}l=[],u=Number.NEGATIVE_INFINITY};for(let d of a){let f=Math.max(d.start,d.end??r);l.length>0&&d.start>u&&h(),l.push(d),u=Math.max(u,f)}h()}let s=[],n=new Set;for(let o of i){let a=t.get(o.uid);if(a){n.has(a)||(n.add(a),s.push(a));continue}let l=s[s.length-1];if(l&&!l.together&&l.event.kind===o.kind&&l.event.cat===o.cat&&l.event.start-o.start<=nm){l.events.push(o);continue}s.push({event:o,events:[o]})}return s.sort((o,a)=>(a.start??a.event.start)-(o.start??o.event.start))}function ld(i,r){return`${r} ${i==="eat"?"meal":i==="feed"?"feed":"visit"}${r===1?"":"s"}`}function Ei(i){return`${i.getFullYear()}-${i.getMonth()}-${i.getDate()}`}function am(i,r){if(Ei(i)===Ei(r))return"Today";let e=new Date(r.getFullYear(),r.getMonth(),r.getDate()-1);return Ei(i)===Ei(e)?"Yesterday":i.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}function cd(i,r){let e=[],t=null;for(let s of i){let n=new Date((s.start??s.event.start)*1e3),o=Ei(n);o!==t&&(t=o,e.push({label:am(n,r),groups:[]})),e[e.length-1].groups.push(s)}return e}var lm="clamp(360px, calc(100dvh - 200px), 900px)";function ho(i){let r=(i??"").trim();return r==="none"?"":`max-height:${r||lm}`}function cm(i,r){return i.label==="unknown"?null:i.label==="not_a_cat"?"Not a cat":`${i.label} ${Ye(i.event)} at ${he(i.event.start,r)}`}function dm(i){return i<=0?null:`${i} photo${i===1?"":"s"} updated`}function is(i,r){let e=new Map;for(let n of i.events)e.set(n.uid,n);let t=[];for(let n of e.values()){let o=cm(n,r);o&&t.push(o)}let s=dm(i.photosUpdated);return s&&t.push(s),t.length===0?null:`Saved: ${t.join(", ")}`}function rs(i,r){return{cats:i.map(({cat:e,ate:t})=>({cat:e,ate:t})),notACat:r==="not_a_cat",subjects:{}}}function pd(i,r,e){let t=i.cats.some(s=>s.cat===r);return{...i,notACat:!1,cats:t?i.cats.filter(s=>s.cat!==r):[...i.cats,{cat:r,ate:e}]}}function ud(i){return i.notACat?{...i,notACat:!1}:{...i,notACat:!0,cats:[]}}function fo(i,r,e){return{...i,cats:i.cats.map(t=>t.cat===r?{...t,ate:e}:t)}}function hd(i,r,e,t){let s={...i.subjects,[r]:e};return e==="not_a_cat"||i.cats.some(n=>n.cat===e)?{...i,subjects:s}:{...i,subjects:s,notACat:!1,cats:[...i.cats,{cat:e,ate:t}]}}function fd(i,r,e){if(!i.cats.some(s=>s.cat===e))return"neutral";let t=r.find(s=>s.cat===e);return t&&!t.confirmed?"suggested":"confirmed"}function md(i,r,e){let t=Object.entries(i.subjects).map(([o,a])=>({sid:Number(o),label:a})),s=t.length?{subjects:t}:{};return i.notACat?e==="not_a_cat"&&!t.length?{kind:"close",text:"Done"}:{kind:"save",text:"Confirm not a cat",request:{verdict:"not_a_cat",...s}}:i.cats.length===0?{kind:"blocked",text:"Pick who was here"}:e!=="not_a_cat"&&r.length===i.cats.length&&r.every(o=>o.confirmed&&i.cats.some(a=>a.cat===o.cat&&a.ate===o.ate))&&!t.length?{kind:"close",text:"Done"}:{kind:"save",text:"Confirm "+bd(i.cats.map(o=>o.cat)),request:{cats:i.cats.map(o=>({...o})),...s}}}function bd(i){return i.length<=1?i[0]??"":i.length===2?i[0]+" and "+i[1]:i.slice(0,-1).join(", ")+", and "+i[i.length-1]}function gd(i,r){if(r.identity==="not_a_cat")return"Not a cat";if(i.length===0)return"Who was this?";let e=new Map;for(let t of i){let s=r.open?t.ate?"is eating":"is here":t.ate?"ate":"came by",n=e.get(s)??[];n.push(t.cat),e.set(s,n)}return[...e].map(([t,s])=>bd(s)+" "+t).join(", ")}function dd(i,r,e){return Math.min(e,Math.max(r,i))}function _d(i,r,e,t,s,n=8,o=8){if(!(r>0)||!(e>0))return{left:0,top:0,flipped:!1};let a=Math.max(0,Math.min(o,r/2,e/2)),l=Math.min(Math.max(0,t),Math.max(0,r-a*2)),u=Math.min(Math.max(0,s),Math.max(0,e-a*2)),h=r-a-l,d=e-a-u,f=(i[0]+i[2])/2*r,m=dd(f-l/2,a,h),b=i[3]*e+n,_=i[1]*e-n-u,g=b<=d,C=_>=a,R=!g&&C;return{left:m,top:dd(R?_:b,a,d),flipped:R}}function vd(i,r){if(r.length<2)return[];let e=r.map(n=>({cat:n.cat,samples:[]})),t=new Map(e.map(n=>[n.cat,n])),s=[];for(let n of i){let o=n.cat?t.get(n.cat):void 0;o?o.samples.push(n):s.push(n)}return s.length>0&&e.reduce((o,a)=>a.samples.length>o.samples.length?a:o).samples.push(...s),e}async function ss(i,r,e){let t=i.callWS;if(!t)throw new Error("Not connected.");let s=await t({type:"kibble/session/label",entry_id:r,uid:e.uid,...e.cats?{cats:e.cats}:{},...e.verdict?{verdict:e.verdict}:{}});for(let n of e.subjects??[])s=await t({type:"kibble/session/subject",entry_id:r,uid:s.event.uid,sid:n.sid,label:n.label});return s}function yd(i,r){let e=i*1e3-r-3e3;return Math.max(0,e)/1e3}var mo=class extends v{constructor(){super();this._focusTrigger=null;this._pointerDown=e=>{this._pickerKey&&!e.composedPath().includes(this)&&this._closePicker(!1)};this._keyDown=e=>{e.key!=="Escape"||!this._pickerKey||(e.preventDefault(),e.stopPropagation(),this._closePicker(!0))};this._repositionLabels=()=>{let e=this.getBoundingClientRect();if(e.width<=0||e.height<=0)return;let t=[...this.renderRoot.querySelectorAll(".label")],s=this.boxes.flatMap(a=>{let l=a.label??(a.tone==="not-cat"?"Not a cat":null);if(!l)return[];let h=t.find(d=>d.dataset.labelKey===a.key)?.getBoundingClientRect();return[{key:a.key,box:a.box,width:h?.width||Math.max(44,l.length*7+34),height:h?.height||22}]}),n=Object.fromEntries(sl(s,e.width,e.height,4,this.labelSafeTop).map(a=>[a.key,a])),o=Object.keys(n);o.length===Object.keys(this._labelPositions).length&&o.every(a=>{let l=this._labelPositions[a],u=n[a];return l?.left===u?.left&&l?.top===u?.top&&l?.flipped===u?.flipped})||(this._labelPositions=n)};this._repositionPicker=()=>{if(!this._pickerKey)return;let e=this.boxes.find(l=>l.key===this._pickerKey),t=this.renderRoot.querySelector(".picker"),s=this.getBoundingClientRect();if(!e||!t||s.width<=0||s.height<=0)return;let n=t.getBoundingClientRect(),o=_d(e.box,s.width,s.height,n.width,n.height),a=this._pickerPlacement;a?.left===o.left&&a.top===o.top&&a.flipped===o.flipped||(this._pickerPlacement=o)};this.boxes=[],this.cats=[],this.busy=!1,this.labelSafeTop=0,this._labelPositions={},this._pickerKey=null,this._pickerPlacement=null}static{this.properties={boxes:{attribute:!1},hass:{attribute:!1},cache:{attribute:!1},cats:{attribute:!1},busy:{type:Boolean},labelSafeTop:{attribute:!1},_labelPositions:{state:!0},_pickerKey:{state:!0},_pickerPlacement:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("pointerdown",this._pointerDown,!0),window.addEventListener("keydown",this._keyDown,!0)}firstUpdated(){this._resizeObserver=new ResizeObserver(()=>{this._repositionLabels(),this._repositionPicker()}),this._resizeObserver.observe(this),this._repositionLabels()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("pointerdown",this._pointerDown,!0),window.removeEventListener("keydown",this._keyDown,!0),this._resizeObserver?.disconnect(),this._resizeObserver=void 0}updated(e){(e.has("boxes")||e.has("labelSafeTop"))&&this._repositionLabels(),e.has("boxes")&&this._pickerKey&&!this.boxes.some(t=>t.key===this._pickerKey)&&this._closePicker(!1),(e.has("_pickerKey")||e.has("boxes")||e.has("cats"))&&this._repositionPicker()}_openPicker(e,t){this.busy||e.subjectSid==null||(this._focusTrigger=t.currentTarget,this._pickerPlacement=null,this._pickerKey=e.key,this.updateComplete.then(async()=>{this._repositionPicker(),await this.updateComplete,this.renderRoot.querySelector(".picker-option:not([disabled])")?.focus()}))}_closePicker(e){let t=this._focusTrigger;this._pickerKey=null,this._pickerPlacement=null,this._focusTrigger=null,e&&t?.focus()}_chooseSubject(e,t){this.busy||e.subjectSid==null||(this._closePicker(!0),this.dispatchEvent(new CustomEvent("subject-label-requested",{detail:{sid:e.subjectSid,label:t},bubbles:!0,composed:!0})))}render(){let e=this.boxes.some(s=>s.selectable),t=this.boxes.find(s=>s.key===this._pickerKey);return c`
      <div class="overlay ${e?"interactive":"passive"}" ?aria-hidden=${!e}>
        ${this.boxes.map(s=>this._renderBox(s))}
        ${t?this._renderPicker(t):p}
      </div>`}_renderPicker(e){let s=this._pickerPlacement!==null?`left:${this._pickerPlacement.left}px;top:${this._pickerPlacement.top}px;`:"left:8px;top:8px;visibility:hidden;";return c`<div class="picker" role="group" aria-label="Name this animal" style=${s}>
      ${this.cats.map(n=>c`<button type="button" class="picker-option" aria-pressed=${e.subjectLabel===n.name} ?disabled=${this.busy} @click=${()=>this._chooseSubject(e,n.name)}>
        <kibble-avatar .hass=${this.hass} .name=${n.name} .colorIndex=${n.color} .asset=${n.avatar} .cache=${this.cache}></kibble-avatar><span>${n.name}</span>${e.subjectLabel===n.name?c`<span class="picker-check" aria-hidden="true">✓</span>`:p}
      </button>`)}
      <button type="button" class="picker-option" aria-pressed=${e.subjectLabel==="not_a_cat"} ?disabled=${this.busy} @click=${()=>this._chooseSubject(e,"not_a_cat")}>
        <kibble-avatar .name=${null}></kibble-avatar><span>Not a cat</span>${e.subjectLabel==="not_a_cat"?c`<span class="picker-check" aria-hidden="true">✓</span>`:p}
      </button>
    </div>`}_renderBox(e){let t=fr(e.box),s=`left:${t.left};top:${t.top};width:${t.width};height:${t.height};--box-color:${e.color??"rgba(255,255,255,.9)"};`,n=e.emphasis??"normal",o=e.label??(e.tone==="not-cat"?"Not a cat":null),a=this._labelPositions[e.key],l=a?`left:${a.left}px;top:${a.top}px;`:`left:${t.left};top:${t.top};`;return c`
      <div class="box-wrap tone-${e.tone} emphasis-${n}" style=${s}>
        <span class="stroke"></span>
        ${e.selectable?c`<button type="button" class="hit" aria-label=${o?`Name ${o}`:"Name this animal"} @click=${u=>this._openPicker(e,u)}></button>`:p}
      </div>
      ${o?c`<span class="label tone-${e.tone} emphasis-${n}" data-label-key=${e.key} style=${l}>
        ${e.tone==="cat"?c`<span class="avatar-ring" style=${`--box-color:${e.color??"var(--primary-color)"}`}><span class="monogram" aria-hidden="true">${o.trim().charAt(0).toUpperCase()}</span>${e.avatar?c`<kibble-image .hass=${this.hass} .asset=${e.avatar} .cache=${this.cache} alt=""></kibble-image>`:p}</span>`:e.tone==="unknown"?c`<span class="unknown-avatar">?</span>`:p}
        <span class="label-text">${o}</span>
      </span>`:p}`}static{this.styles=w`
    :host {
      position: absolute;
      inset: 0;
      display: block;
      overflow: hidden;
      pointer-events: none;
      contain: layout paint;
    }
    .overlay {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .overlay.passive,
    .overlay.interactive {
      pointer-events: none;
    }
    .picker {
      position: absolute;
      z-index: 20;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: min(264px, calc(100% - 16px));
      max-height: calc(100% - 16px);
      overflow: auto;
      padding: 6px;
      border: 1px solid rgba(255, 255, 255, 0.24);
      border-radius: 14px;
      background: rgba(18, 18, 20, 0.94);
      color: #fff;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.38);
      backdrop-filter: blur(12px);
      pointer-events: auto;
      overscroll-behavior: contain;
    }
    .picker-option {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 48px;
      padding: 4px 8px;
      border: 0;
      border-radius: 9px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .picker-option kibble-avatar {
      flex: none;
      --kibble-avatar-size: 30px;
    }
    .picker-option[aria-pressed="true"] {
      background: rgba(255, 255, 255, 0.14);
    }
    .picker-option:focus-visible {
      outline: 2px solid var(--primary-color, #9c7bff);
      outline-offset: -2px;
    }
    .picker-option:disabled {
      opacity: 0.55;
      cursor: default;
    }
    .picker-check {
      margin-left: auto;
      color: var(--kibble-feed, #6fd398);
      font-weight: 700;
    }
    .box-wrap {
      position: absolute;
      box-sizing: border-box;
      pointer-events: none;
    }
    /* A solid box is a 2 px colour line between two thin dark lines, so it reads on bright day
     * scenes and on the dark purple night (IR) image alike. Cat colours are lifted toward white
     * for the line itself: the darker palette slots (plum) vanish on an IR frame otherwise. */
    .stroke {
      position: absolute;
      inset: 0;
      box-sizing: border-box;
      border: 2px solid rgba(255, 255, 255, 0.9);
      border-radius: 4px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(0, 0, 0, 0.3);
    }
    .tone-cat .stroke {
      border-color: color-mix(in srgb, var(--box-color) 68%, #fff);
    }
    .tone-unknown .stroke {
      border-color: rgba(255, 255, 255, 0.9);
    }
    .tone-not-cat .stroke {
      border-width: 1.5px;
      border-style: dashed;
      border-color: rgba(255, 255, 255, 0.78);
    }
    .tone-clutter .stroke {
      border: 1px dashed rgba(255, 255, 255, 0.45);
      border-radius: 3px;
    }
    .tone-peer .stroke {
      border: 1px dashed rgba(255, 255, 255, 0.6);
      border-radius: 3px;
      box-shadow: none;
    }
    .box-wrap.emphasis-selected .stroke {
      border-width: 3px;
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--box-color) 40%, transparent), 0 0 0 1px rgba(0, 0, 0, 0.45),
        inset 0 0 0 1px rgba(0, 0, 0, 0.3);
    }
    .box-wrap.emphasis-dim,
    .label.emphasis-dim {
      opacity: 0.45;
    }
    .hit {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      height: 100%;
      min-width: 48px;
      min-height: 48px;
      padding: 0;
      border: 0;
      border-radius: 4px;
      background: transparent;
      opacity: 0;
      pointer-events: auto;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
    .box-wrap:focus-within .stroke {
      box-shadow: 0 0 0 3px var(--primary-text-color), 0 0 0 5px rgba(0, 0, 0, 0.65);
    }
    .label {
      position: absolute;
      z-index: 2;
      height: 22px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: min(240px, calc(100% - 4px));
      padding: 3px 8px 3px 3px;
      border-radius: 999px;
      background: rgba(18, 18, 20, 0.72);
      color: #fff;
      font: 600 12px/1.1 var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
      will-change: left, top;
    }
    .avatar-ring,
    .unknown-avatar {
      width: 16px;
      height: 16px;
      flex: none;
      box-sizing: border-box;
      display: inline-grid;
      place-items: center;
      border-radius: 50%;
      overflow: hidden;
    }
    .avatar-ring {
      position: relative;
      border: 1.5px solid var(--box-color);
      background: color-mix(in srgb, var(--box-color) 20%, #121214);
      color: var(--box-color);
    }
    .avatar-ring .monogram {
      position: absolute;
      inset: 0;
      z-index: 0;
      display: grid;
      place-items: center;
    }
    .avatar-ring kibble-image {
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
    }
    .monogram {
      font-size: 9px;
      line-height: 1;
      font-weight: 700;
    }
    .unknown-avatar {
      background: rgba(255, 255, 255, 0.18);
      color: rgba(255, 255, 255, 0.92);
      font-size: 11px;
      font-weight: 700;
    }
    .label-text {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tone-not-cat {
      color: rgba(255, 255, 255, 0.82);
    }
    @media (prefers-reduced-motion: no-preference) {
      .stroke {
        transition: border-color 150ms ease, border-width 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
      }
      .box-wrap {
        transition: left 250ms ease, top 250ms ease, width 250ms ease, height 250ms ease, opacity 150ms ease;
      }
      .label {
        transition: left 250ms ease, top 250ms ease, opacity 150ms ease;
      }
    }
  `}};customElements.define("kibble-box-overlay",mo);var pm=["button:not([disabled])","[href]","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),um=350,hm=700,fm=48,bo=class extends v{constructor(){super();this._index=0;this._pendingOption=null;this._justSavedUid=null;this._closeRef=T();this._touchStartX=0;this._touchStartY=0;this._keydownHandler=e=>{if(!this.open)return;if(e.key==="Escape"){e.preventDefault(),this._requestClose();return}if(e.key==="ArrowLeft"){e.preventDefault(),this._go(-1);return}if(e.key==="ArrowRight"){e.preventDefault(),this._go(1);return}if(e.key!=="Tab")return;let t=[...this.renderRoot.querySelectorAll(pm)];if(t.length===0){e.preventDefault(),this._closeRef.value?.focus();return}let s=this.renderRoot.querySelector(":focus"),n=s?t.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=t.length)&&(e.preventDefault(),(e.shiftKey?t[t.length-1]:t[0])?.focus())};this._requestClose=()=>{this.dispatchEvent(new CustomEvent("viewer-close-requested",{bubbles:!0,composed:!0}))};this._onTouchStart=e=>{let t=e.touches[0];t&&(this._touchStartX=t.clientX,this._touchStartY=t.clientY)};this._onTouchEnd=e=>{let t=e.changedTouches[0];if(!t)return;let s=t.clientX-this._touchStartX,n=t.clientY-this._touchStartY;Math.abs(s)<fm||Math.abs(s)<Math.abs(n)*1.5||this._go(s<0?1:-1)};this._requestBoxesVisibility=()=>{this.dispatchEvent(new CustomEvent("boxes-visibility-requested",{detail:{visible:!this.showBoxes},bubbles:!0,composed:!0}))};this.open=!1,this.cats=[],this.samples=[],this.initialIndex=0,this.event=null,this.busyUid=null,this.error=null,this.showBoxes=!0}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},cache:{attribute:!1},cats:{attribute:!1},samples:{attribute:!1},initialIndex:{type:Number},event:{attribute:!1},busyUid:{attribute:!1},error:{type:String},showBoxes:{type:Boolean},_index:{state:!0},_justSavedUid:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),clearTimeout(this._justSavedTimer),clearTimeout(this._advanceTimer)}willUpdate(e){if(e.has("open")&&this.open&&(this._index=this.initialIndex,this._justSavedUid=null,this._pendingOption=null),e.has("busyUid")){let t=e.get("busyUid");this._pendingOption=null,t&&this.busyUid===null&&!this.error&&this.samples[this._index]?.uid===t&&this._flashSaved(t)}}updated(e){e.has("open")&&this.open&&this._closeRef.value?.focus()}_flashSaved(e){clearTimeout(this._justSavedTimer),this._justSavedUid=e,this._justSavedTimer=setTimeout(()=>{this._justSavedUid=null},hm),clearTimeout(this._advanceTimer),this._advanceTimer=setTimeout(()=>{this._index<this.samples.length-1&&this._go(1)},um)}_go(e){let t=this._index+e;t<0||t>=this.samples.length||(this._index=t,this._justSavedUid=null)}_catColor(e){let t=this.cats.find(s=>s.name===e);return t?ce(t.color):_e(e)}_photoOverlayBoxes(e){if(!e.body||!e.box||!e.crop)return[];let t=Rt(e.box,e.crop);if(!t)return[];let s=e.label??e.guess,n=s==="not_a_cat"?"not-cat":s&&s!=="skip"?"cat":"unknown",o=n==="cat"?this.cats.find(a=>a.name===s):null;return[{key:"sample:"+e.uid,box:t,tone:n,label:s&&s!=="not_a_cat"&&s!=="skip"?s:n==="not-cat"?"Not a cat":"Who?",color:s&&s!=="not_a_cat"&&s!=="skip"?this._catColor(s):void 0,avatar:o?.avatar??null},...e.peers.flatMap((a,l)=>{let u=Rt(a,e.crop);return u?[{key:"peer:"+e.uid+":"+l,box:u,tone:"peer"}]:[]})]}render(){if(!this.open)return p;let e=this.samples[this._index];if(!e)return p;let t=this.samples.length,s=e.body??e.face,n=e.body&&e.face?e.face:null,o=this.busyUid!==null;return c`
      <div class="scrim" role="dialog" aria-modal="true" aria-label=${`Photo ${this._index+1} of ${t}`} @click=${this._requestClose}>
        <div class="panel" @click=${a=>a.stopPropagation()} @touchstart=${this._onTouchStart} @touchend=${this._onTouchEnd}>
          <div class="panel-top">
            <span class="counter">${this._index+1} / ${t}</span>
            <button type="button" class="close" ${P(this._closeRef)} aria-label="Close photo" @click=${this._requestClose}>${y("close")}</button>
          </div>
          <div class="stage">
            ${s?c`<div class="image-frame"><kibble-image .hass=${this.hass} .asset=${s} .cache=${this.cache} alt="" fit="contain"></kibble-image>${e.body&&this.showBoxes?c`<kibble-box-overlay .boxes=${this._photoOverlayBoxes(e)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>`:p}</div>`:p}
            ${e.body&&e.box&&e.crop?c`<button type="button" class="box-toggle" aria-pressed=${this.showBoxes} aria-label=${this.showBoxes?"Hide boxes":"Show boxes"} @click=${this._requestBoxesVisibility}>${y(this.showBoxes?"eye":"eyeOff")}</button>`:p}
            ${n?c`<span class="face-inset"><kibble-image .hass=${this.hass} .asset=${n} .cache=${this.cache} alt="" rounded></kibble-image></span>`:p}
            <button type="button" class="nav prev" aria-label="Previous photo" ?disabled=${this._index===0} @click=${()=>this._go(-1)}>
              <span class="chevron chevron-left">${y("chevronDown")}</span>
            </button>
            <button type="button" class="nav next" aria-label="Next photo" ?disabled=${this._index===t-1} @click=${()=>this._go(1)}>
              <span class="chevron chevron-right">${y("chevronDown")}</span>
            </button>
          </div>
          <div class="chip-row" role="group" aria-label="Who is this, in this photo">
            ${this.cats.map(a=>this._renderChoice(a.name,a,e,o))}
            ${this._renderChoice("not_a_cat",null,e,o)}
            ${this._renderChoice("skip",null,e,o)}
          </div>
          ${this.error?c`<p class="viewer-error">${this.error}</p>`:p}
        </div>
      </div>
    `}_choiceState(e,t){return e==="skip"?t.review==="skip"?"confirmed":"neutral":t.review!==null?t.review===e?"confirmed":"neutral":t.label===e?"suggested":"neutral"}_renderChoice(e,t,s,n){let o=this._choiceState(e,s),a=n&&this.busyUid===s.uid&&this._pendingOption===e,l=this._justSavedUid===s.uid&&o==="confirmed",u=t?t.name:e==="skip"?"Don\u2019t use":"Not a cat";return c`
      <button
        type="button"
        class="choice choice-${o}"
        aria-pressed=${o==="confirmed"}
        style=${t?`--chip-color:${this._catColor(t.name)}`:""}
        ?disabled=${n}
        @click=${()=>this._choose(e,s)}
      >
        <span class="choice-glyph">
          ${e==="skip"?y("eyeOff"):t?c`<kibble-avatar .hass=${this.hass} .name=${t.name} .colorIndex=${t.color} .asset=${t.avatar} .cache=${this.cache}></kibble-avatar>`:c`<kibble-avatar .name=${null}></kibble-avatar>`}
          ${a?c`<span class="choice-spinner">${y("refresh")}</span>`:o==="confirmed"?c`<span class="choice-check ${l?"just-saved":""}">${y("check")}</span>`:p}
        </span>
        <span class="choice-label">${u}</span>
      </button>
    `}_choose(e,t){let s=this.event?.identity==="reviewed"&&this.event.cat===e;this._pendingOption=e,this.dispatchEvent(new CustomEvent("sample-label-requested",{detail:{sampleUid:t.uid,label:s?"follow":e},bubbles:!0,composed:!0}))}static{this.styles=w`
    :host {
      display: contents;
    }
    .scrim {
      position: fixed;
      inset: 0;
      z-index: 1100;
      background: rgba(0, 0, 0, 0.92);
      display: flex;
      align-items: stretch;
      justify-content: center;
      box-sizing: border-box;
    }
    @media (min-width: 600px) {
      .scrim {
        align-items: center;
        padding: 24px;
      }
    }
    .panel {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      background: #000;
      overflow: hidden;
    }
    @media (min-width: 600px) {
      .panel {
        width: min(720px, 92vw);
        max-height: min(760px, 92vh);
        border-radius: 16px;
      }
    }
    .panel-top {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: max(12px, env(safe-area-inset-top)) 12px 8px;
    }
    .counter {
      font-size: 13px;
      font-variant-numeric: tabular-nums;
      color: rgba(255, 255, 255, 0.75);
    }
    .close {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .stage {
      position: relative;
      flex: 1 1 auto;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
    }
    .stage kibble-image {
      width: 100%;
      height: 100%;
    }
    .image-frame {
      position: relative;
      flex: 0 1 auto;
      width: min(100%, 62vh);
      max-height: 100%;
      aspect-ratio: 1;
    }
    .image-frame kibble-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .box-toggle {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      z-index: 8;
      top: 8px;
      right: 20px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      font: inherit;
      cursor: pointer;
      backdrop-filter: blur(8px);
    }
    .box-toggle svg {
      width: 22px;
      height: 22px;
    }
    .face-inset {
      position: absolute;
      left: 16px;
      bottom: 16px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }
    .face-inset kibble-image {
      width: 100%;
      height: 100%;
    }
    .nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
    }
    .nav:disabled {
      opacity: 0.25;
      cursor: default;
    }
    .nav.prev {
      left: 12px;
    }
    .nav.next {
      right: 12px;
    }
    .chevron-left {
      display: inline-flex;
      transform: rotate(90deg);
    }
    .chevron-right {
      display: inline-flex;
      transform: rotate(-90deg);
    }
    /* The chip row is its own solid HA-theme surface, deliberately distinct from the black
     * photo-viewing chrome above it (image on top, flexing; chips beneath, never overlapping)
     * -- the theme tokens are what keep the labels legible in both light and dark, exactly like
     * every other chip in this card set, rather than a fixed light-on-dark scheme that only
     * worked against a black backdrop. */
    .chip-row {
      flex-shrink: 0;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 10px 12px max(10px, env(safe-area-inset-bottom));
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .choice {
      flex: 1 1 0;
      min-width: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 6px 2px;
      border: 2px solid transparent;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 11px;
      cursor: pointer;
      min-height: 44px;
    }
    .choice:disabled {
      cursor: default;
      opacity: 0.6;
    }
    .choice-suggested {
      border-style: dashed;
      border-color: var(--chip-color, var(--secondary-text-color));
      background: none;
    }
    .choice-confirmed {
      border-color: var(--chip-color, var(--secondary-text-color));
      background: color-mix(in srgb, var(--chip-color, var(--secondary-text-color)) 18%, transparent);
    }
    .choice-glyph {
      position: relative;
      width: 30px;
      height: 30px;
    }
    .choice-glyph kibble-avatar {
      --kibble-avatar-size: 30px;
    }
    .choice-glyph > svg {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      color: var(--secondary-text-color);
      padding: 6px;
      box-sizing: border-box;
    }
    .choice-check,
    .choice-spinner {
      position: absolute;
      right: -2px;
      bottom: -2px;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .choice-spinner {
      background: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
      color: #fff;
    }
    @media (prefers-reduced-motion: no-preference) {
      .choice-spinner svg {
        animation: kibble-viewer-spin 0.9s linear infinite;
      }
      .choice-check.just-saved {
        animation: kibble-viewer-pop 400ms ease;
      }
    }
    @keyframes kibble-viewer-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes kibble-viewer-pop {
      0% {
        transform: scale(0.4);
      }
      60% {
        transform: scale(1.25);
      }
      100% {
        transform: scale(1);
      }
    }
    .choice-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .viewer-error {
      flex-shrink: 0;
      margin: 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(219, 68, 55, 0.25);
      color: #ffb4ac;
      font-size: 13px;
    }
    .box-toggle:focus-visible,
    .close:focus-visible,
    .nav:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
    .choice:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `}};customElements.define("kibble-photo-viewer",bo);var mm=["button:not([disabled])","[href]","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),bm=3600,gm=1.6,go=12,_m=6,vm=700,vo="kibble:show-boxes",_o="kibble-boxes-visibility-changed";function ym(){try{return localStorage.getItem(vo)!=="false"}catch{return!0}}var yo=class extends v{constructor(){super();this._pendingLabel=null;this._justSavedLabel=null;this._draft=null;this._photosExpanded=!1;this._viewerIndex=null;this._zoom=null;this._lastEventUid=null;this._beforeRef=new De;this._afterRef=new De;this._sceneRef=new De;this._closeButtonRef=T();this._videoRef=T();this._clipSrc=null;this._clipError=!1;this._clipEventUid=null;this._keydownHandler=e=>{if(!this.open||e.key==="Escape"&&e.composedPath().some(a=>a instanceof Element&&a.matches(".picker"))||this._viewerIndex!==null)return;if(e.key==="Escape"){e.preventDefault(),this._zoom?this._zoom=null:this._close();return}if(e.key!=="Tab")return;let t=[...this.renderRoot.querySelectorAll(mm)];if(t.length===0){e.preventDefault(),this._closeButtonRef.value?.focus();return}let s=this.renderRoot.querySelector(":focus"),n=s?t.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=t.length)&&(e.preventDefault(),(e.shiftKey?t[t.length-1]:t[0])?.focus())};this._onSharedBoxesChange=e=>{let t=e.detail?.visible;typeof t=="boolean"&&(this._showBoxes=t)};this._onStorage=e=>{e.key===vo&&(this._showBoxes=e.newValue!=="false")};this._toggleBoxes=()=>this._setBoxesVisible(!this._showBoxes);this._onSubjectLabelSelected=e=>{let t=this.summary;if(!t)return;let s=this._draft??rs(this._sessionCatsFor(t),t.identity);this._draft=hd(s,e.detail.sid,e.detail.label,t.kind==="eat")};this._onBoxesVisibilityRequested=e=>{let t=e.detail?.visible;typeof t=="boolean"&&this._setBoxesVisible(t)};this._onViewerClose=()=>{this._viewerIndex=null};this._retrySamples=()=>{this.dispatchEvent(new CustomEvent("samples-retry-requested",{bubbles:!0,composed:!0}))};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.cats=[],this.summary=null,this.samples=null,this.samplesFailed=!1,this.group=[],this.groupTogether=!1,this.busy=!1,this.error=null,this.sampleBusyUid=null,this.sceneSubjects=[],this.sessionCats=null,this.multipleCats=!1,this._showBoxes=ym()}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},entryId:{type:String},cache:{attribute:!1},cats:{attribute:!1},summary:{attribute:!1},samples:{attribute:!1},sceneSubjects:{attribute:!1},sessionCats:{attribute:!1},multipleCats:{type:Boolean},samplesFailed:{type:Boolean},group:{attribute:!1},groupTogether:{type:Boolean},busy:{type:Boolean},error:{type:String},sampleBusyUid:{attribute:!1},_pendingLabel:{state:!0},_justSavedLabel:{state:!0},_photosExpanded:{state:!0},_viewerIndex:{state:!0},_zoom:{state:!0},_clipSrc:{state:!0},_clipError:{state:!0},_showBoxes:{state:!0},_draft:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler),window.addEventListener(_o,this._onSharedBoxesChange),window.addEventListener("storage",this._onStorage)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),window.removeEventListener(_o,this._onSharedBoxesChange),window.removeEventListener("storage",this._onStorage),this._beforeRef.dispose(),this._afterRef.dispose(),this._sceneRef.dispose(),this._stopClipPlayback(),clearTimeout(this._justSavedLabelTimer)}_setBoxesVisible(e){this._showBoxes=e;try{localStorage.setItem(vo,String(e))}catch{}window.dispatchEvent(new CustomEvent(_o,{detail:{visible:e}}))}willUpdate(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus();let t=this.summary;this._beforeRef.sync(this.hass,this.cache,t?.before,()=>this.requestUpdate()),this._afterRef.sync(this.hass,this.cache,t?.after,()=>this.requestUpdate()),this._sceneRef.sync(this.hass,this.cache,t?.scene??null,()=>this.requestUpdate());let s=t?.uid??null;s!==this._lastEventUid&&(this._lastEventUid=s,this._photosExpanded=!1,this._viewerIndex=null,this._zoom=null,this._pendingLabel=null,this._draft=null),e.has("sessionCats")&&(this._draft=null),(e.has("open")&&!this.open||s!==this._clipEventUid)&&(this._clipEventUid=s,this._releaseClip()),e.has("busy")&&e.get("busy")&&!this.busy&&(!this.error&&this._pendingLabel&&this._flashSavedLabel(this._pendingLabel),this._pendingLabel=null)}_flashSavedLabel(e){clearTimeout(this._justSavedLabelTimer),this._justSavedLabel=e,this._justSavedLabelTimer=setTimeout(()=>{this._justSavedLabel=null},vm)}render(){let e=this.summary;if(!this.open||!e)return p;let t=this._sessionCatsFor(e),s=this._draft??rs(t,e.identity),n=e.kind==="feed",o=this.hass?.locale?.language??this.hass?.language,a=n?Kt(e):this._draftTitle(e,s),l=this._stageKind(e);return c`
      <div class="backdrop" @click=${this._close}>
        <div class="sheet" role="dialog" aria-modal="true" aria-label=${a} @click=${u=>u.stopPropagation()}>
          ${this._renderHeader(e,n,o,s)}
          <div class="scroll">
            <div class="layout ${l==="none"?"no-media":""}">
              ${l!=="none"?c`
                    <div class="media-col">
                      ${l==="media"?this._renderMediaStage(e):this._renderCompare()}
                      ${l==="media"&&e.before&&e.after?this._renderCompare():p}
                    </div>
                  `:p}
              <div class="info-col">${n?p:c`${this._renderIdentity(e,t,s)}${this._renderPhotos(e,t)}`}</div>
            </div>
          </div>
          ${n?c`<footer><button type="button" class="primary-btn" @click=${this._close}>Done</button></footer>`:this._renderFooter(e,t,s)}
        </div>
        ${this._zoom?this._renderZoom():p}
      </div>
      <kibble-photo-viewer
        ?open=${this._viewerIndex!==null}
        .hass=${this.hass}
        .cache=${this.cache}
        .cats=${this.cats}
        .samples=${this.samples??[]}
        .showBoxes=${this._showBoxes}
        @boxes-visibility-requested=${this._onBoxesVisibilityRequested}
        .initialIndex=${this._viewerIndex??0}
        .event=${e}
        .busyUid=${this.sampleBusyUid}
        .error=${this.error}
        @viewer-close-requested=${this._onViewerClose}
      ></kibble-photo-viewer>
    `}_catColor(e){let t=this.cats.find(s=>s.name===e);return t?ce(t.color):_e(e)}_sceneOverlayBoxes(){let e=this._draft?.subjects??{};return this.sceneSubjects.map((t,s)=>{let n=t.sid!==null&&e[t.sid]!==void 0?e[t.sid]:t.label,o=n&&n!=="not_a_cat"?n:null,a=o?this.cats.find(u=>u.name===o):null,l=o?"cat":n==="not_a_cat"?"not-cat":"unknown";return{key:"scene:"+s,box:t.box,tone:l,label:o??(l==="not-cat"?"Not a cat":"Who?"),color:o?this._catColor(o):void 0,avatar:a?.avatar??null,selectable:t.sid!==null,subjectSid:t.sid,subjectLabel:n}})}_renderBoxesToggle(){return c`<button type="button" class="box-toggle" aria-pressed=${this._showBoxes} aria-label=${this._showBoxes?"Hide boxes":"Show boxes"} @click=${e=>{e.stopPropagation(),this._toggleBoxes()}}>${y(this._showBoxes?"eye":"eyeOff")}</button>`}_photoOverlayBoxes(e){if(!e.body||!e.box||!e.crop)return[];let t=Rt(e.box,e.crop);if(!t)return[];let s=e.label??e.guess,n=s==="not_a_cat"?"not-cat":s&&s!=="skip"?"cat":"unknown",o=n==="cat"?this.cats.find(a=>a.name===s):null;return[{key:"sample:"+e.uid,box:t,tone:n,color:s&&s!=="not_a_cat"&&s!=="skip"?this._catColor(s):void 0,avatar:o?.avatar??null},...e.peers.flatMap((a,l)=>{let u=Rt(a,e.crop);return u?[{key:"peer:"+e.uid+":"+l,box:u,tone:"peer"}]:[]})]}_draftTitle(e,t){return gd(t.cats,{identity:t.notACat?"not_a_cat":"auto",open:e.open})}_renderHeader(e,t,s,n){let o=Qr(e),a=n.cats.find(d=>d.ate)?.cat??n.cats[0]?.cat??e.cat,l=a?this._catColor(a):null,u=t?Kt(e):this._draftTitle(e,n),h=this.group.findIndex(d=>d.uid===e.uid);return c`
      <header>
        ${this.group.length>1&&!this.groupTogether?this._renderPager(h):p}
        <div class="heading">
          <span class="title">${u}</span>
          <span class="meta">
            ${he(e.start,s)}${o?c` \u00b7 ${o}`:p}
            ${e.open?this._renderLiveBadge(l):p}
          </span>
        </div>
        <button type="button" class="close" ${P(this._closeButtonRef)} @click=${this._close} aria-label="Close">${y("close")}</button>
      </header>
    `}_renderLiveBadge(e){return c`
      <span class="live-badge" style="--dot-color:${e??"var(--kibble-live, #e5484d)"}" aria-label="Happening now">
        <span class="live-core"></span>
        <span class="live-pulse"></span>
      </span>
    `}_renderPager(e){let t=this.group.length;return c`
      <div class="pager">
        <button type="button" class="pager-btn" aria-label="Previous event" ?disabled=${e<=0} @click=${()=>this._goToGroupIndex(e-1)}>
          <span class="chevron chevron-left">${y("chevronDown")}</span>
        </button>
        <span class="pager-count">${e+1} of ${t}</span>
        <button
          type="button"
          class="pager-btn"
          aria-label="Next event"
          ?disabled=${e===-1||e>=t-1}
          @click=${()=>this._goToGroupIndex(e+1)}
        >
          <span class="chevron chevron-right">${y("chevronDown")}</span>
        </button>
      </div>
    `}_goToGroupIndex(e){let t=this.group[e];t&&this.dispatchEvent(new CustomEvent("event-requested",{detail:{uid:t.uid},bubbles:!0,composed:!0}))}_hasClip(e){return e.kind==="eat"&&!!e.clip&&!!e.scene&&!this._clipError}_stageKind(e){return e.scene||this._hasClip(e)?"media":e.before&&e.after?"compare":"none"}_renderMediaStage(e){if(this._clipSrc)return c`
        <div class="stage">
          <video
            ${P(this._videoRef)}
            class="stage-video"
            controls
            playsinline
            autoplay
            preload="metadata"
            poster=${this._sceneRef.url??""}
            src=${this._clipSrc}
            @loadedmetadata=${()=>this._seekClip(e)}
            @error=${()=>this._onClipError()}
          ></video>
        </div>
      `;let t=e.scene,s=this._hasClip(e);return c`
      <div class="stage">
        ${t?c`
              <button type="button" class="stage-zoom" aria-label="View photo full screen" @click=${()=>{this._zoom=t}}>
                <kibble-image .hass=${this.hass} .asset=${t} .cache=${this.cache} alt="" fit="contain"></kibble-image>
              </button>
              ${s?c`
                    <button type="button" class="clip-play" aria-label="Play video" @click=${n=>{n.stopPropagation(),this._playClip(e)}}>
                      ${y("play")}
                    </button>
                  `:p}
            `:p}
        ${this._showBoxes&&this.sceneSubjects.length?c`<kibble-box-overlay .boxes=${this._sceneOverlayBoxes()} .hass=${this.hass} .cache=${this.cache} .cats=${this.cats} .busy=${this.busy} @subject-label-requested=${this._onSubjectLabelSelected}></kibble-box-overlay>`:p}
        ${this.sceneSubjects.length?this._renderBoxesToggle():p}
      </div>
    `}async _playClip(e){let t=this.hass,s=this.entryId;if(!t?.callWS||!s||!e.clip)return;let n=`/api/kibble/${s}/clip/${e.uid}`;try{let o=await t.callWS({type:"auth/sign_path",path:n,expires:bm});if(this.summary?.uid!==e.uid)return;this._clipError=!1,this._clipSrc=o.path}catch{this._clipError=!0}}_seekClip(e){let t=this._videoRef.value;!t||!e.clip||(t.currentTime=yd(e.start,e.clip.start_ms))}_onClipError(){this._stopClipPlayback(),this._clipError=!0}_stopClipPlayback(){let e=this._videoRef.value;e&&(e.pause(),e.removeAttribute("src"),e.load()),this._clipSrc=null}_releaseClip(){this._stopClipPlayback(),this._clipError=!1}_renderCompare(){return c`<kibble-before-after class="compare" .beforeSrc=${this._beforeRef.url} .afterSrc=${this._afterRef.url} .aspect=${gm}></kibble-before-after>`}_renderZoom(){let e=this.summary;return c`
      <div class="zoom" @click=${t=>{t.stopPropagation(),this._zoom=null}}>
        <div class="zoom-scene" @click=${t=>t.stopPropagation()}>
          <kibble-image .hass=${this.hass} .asset=${this._zoom} .cache=${this.cache} alt="" fit="contain"></kibble-image>
          ${e&&this._showBoxes&&this.sceneSubjects.length?c`<kibble-box-overlay .boxes=${this._sceneOverlayBoxes()} .hass=${this.hass} .cache=${this.cache} .cats=${this.cats} .busy=${this.busy} @subject-label-requested=${this._onSubjectLabelSelected}></kibble-box-overlay>`:p}
        </div>
        ${this.sceneSubjects.length?this._renderBoxesToggle():p}
        <button type="button" class="zoom-close" aria-label="Close photo" @click=${t=>{t.stopPropagation(),this._zoom=null}}>${y("close")}</button>
      </div>
    `}_sessionCatsFor(e){return this.sessionCats?this.sessionCats:e.cat?[{cat:e.cat,ate:e.kind==="eat",confirmed:e.identity==="reviewed",confidence:e.confidence??null,photos:e.sample_count??0}]:[]}_requestSessionLabel(e,t,s=!1){this._pendingLabel=t,this.dispatchEvent(new CustomEvent("session-label-requested",{detail:{...e,pendingLabel:t,closeOnSuccess:s},bubbles:!0,composed:!0}))}_setDraft(e,t){this.busy||(this._draft=t(this._draft??rs(this._sessionCatsFor(e),e.identity)))}_renderIdentity(e,t,s){let n=e.kind==="eat";return c`
      <div class="identity">
        <div class="identity-heading">
          <span class="identity-title">Who was here?</span>
          <span class="identity-hint ${this.multipleCats&&s.cats.length<2&&!s.notACat?"identity-hint-multiple":""}">${this.multipleCats&&s.cats.length<2&&!s.notACat?"Looks like more than one cat. Tap everyone who was here":"Tap everyone who was here"}</span>
        </div>
        <div class="chip-grid" role="group" aria-label="Who was here?">
          ${this.cats.map(o=>this._renderIdentityChip(o,e,t,s))}
          ${this._renderNotACatChip(e,s)}
        </div>
        ${n&&s.cats.length>=2?c`<div class="meal-roles" role="group" aria-label="Who ate?">${s.cats.map(o=>c`
          <div class="meal-role"><span class="meal-cat">${o.cat}</span><div class="meal-role-options" role="group" aria-label=${o.cat}>
            <button type="button" aria-pressed=${o.ate} ?disabled=${this.busy} @click=${()=>this._setDraft(e,a=>fo(a,o.cat,!0))}>Ate</button>
            <button type="button" aria-pressed=${!o.ate} ?disabled=${this.busy} @click=${()=>this._setDraft(e,a=>fo(a,o.cat,!1))}>Came by</button>
          </div></div>`)}</div>`:p}
        <button type="button" class="not-sure" aria-pressed=${e.identity==="unknown"} ?disabled=${this.busy||e.identity==="unknown"} @click=${()=>this._requestSessionLabel({uid:e.uid,verdict:"unknown"},"unknown",!0)}>Not sure</button>
        ${this.error?c`<p class="identity-error">${this.error}</p>`:p}
      </div>
    `}_renderIdentityChip(e,t,s,n){let o=fd(n,s,e.name),a=o!=="neutral";return c`
      <button type="button" class="chip chip-${o}" aria-pressed=${a} style=${`--chip-color:${this._catColor(e.name)}`} ?disabled=${this.busy} @click=${()=>this._setDraft(t,l=>pd(l,e.name,t.kind==="eat"))}>
        <span class="chip-avatar">
          <kibble-avatar .hass=${this.hass} .name=${e.name} .colorIndex=${e.color} .asset=${e.avatar} .cache=${this.cache}></kibble-avatar>
          ${a?c`<span class="chip-check">${y("check")}</span>`:p}
        </span>
        <span class="chip-label">${e.name}</span>
      </button>`}_renderNotACatChip(e,t){let s=t.notACat?"confirmed":"neutral";return c`
      <button type="button" class="chip chip-${s}" aria-pressed=${t.notACat} ?disabled=${this.busy} @click=${()=>this._setDraft(e,ud)}>
        <span class="chip-avatar">
          <kibble-avatar .name=${null}></kibble-avatar>
          ${t.notACat?c`<span class="chip-check">${y("check")}</span>`:p}
        </span>
        <span class="chip-label">Not a cat</span>
      </button>`}_renderPhotos(e,t){if(this.samplesFailed)return c`<div class="photos"><div class="photos-heading">Photos</div><p class="photos-error"><span>Couldn't load photos.</span> <button type="button" @click=${this._retrySamples}>Retry</button></p></div>`;if(this.samples===null)return c`<div class="photos"><div class="photos-heading">Photos</div><div class="photos-grid">${Array.from({length:_m},()=>c`<div class="photo-skeleton"></div>`)}</div></div>`;if(this.samples.length===0)return p;let s=vd(this.samples,t);return s.length===0?c`<div class="photos"><div class="photos-heading"><span>Photos</span><span class="photos-count">${this.samples.length}</span></div>${this._renderPhotoGrid(this.samples)}</div>`:c`<div class="photos">${s.map(n=>c`
      <section class="photo-section" aria-label=${n.cat+" photos"}>
        <div class="photos-heading"><span><span class="photo-section-dot" style=${"--section-color:"+(this._catColor(n.cat)??"var(--secondary-text-color)")}></span>${n.cat}</span><span class="photos-count">${n.samples.length}</span></div>
        ${this._renderPhotoGrid(n.samples)}
      </section>`)}</div>`}_renderPhotoGrid(e){let t=this._photosExpanded||e.length<=go,s=t?e:e.slice(0,go),n=e.length-go;return c`<div class="photos-grid">
      ${s.map(o=>this._renderPhotoTile(o,this.samples.findIndex(a=>a.uid===o.uid)))}
      ${t?p:c`<button type="button" class="photo-tile photo-more" @click=${()=>{this._photosExpanded=!0}}>+${n}</button>`}
    </div>`}_sampleBadge(e){return e.review===null?null:e.review==="skip"?{kind:"skip"}:e.review==="not_a_cat"?{kind:"not_a_cat"}:e.review!==e.cat?{kind:"cat",name:e.review,cat:this.cats.find(t=>t.name===e.review)??null}:null}_renderPhotoTile(e,t){let s=e.body??e.face,n=this._sampleBadge(e),o=n!==null&&n.kind!=="cat";return c`
      <button type="button" class="photo-tile ${o?"dim":""}" aria-label=${`Photo ${t+1} of ${this.samples.length}`} @click=${()=>{this._viewerIndex=t}}>
        ${s?c`<kibble-image .hass=${this.hass} .asset=${s} .cache=${this.cache} alt=""></kibble-image>`:c`<span class="photo-neutral">${Ne()}</span>`}
        ${n?this._renderPhotoBadge(n):p}
        ${this._showBoxes&&e.body&&e.box&&e.crop?c`<kibble-box-overlay .boxes=${this._photoOverlayBoxes(e)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>`:p}
      </button>`}_renderPhotoBadge(e){return e.kind==="cat"?c`<span class="photo-badge photo-badge-avatar"><kibble-avatar .hass=${this.hass} .name=${e.name} .colorIndex=${e.cat?.color??null} .asset=${e.cat?.avatar??null} .cache=${this.cache}></kibble-avatar></span>`:c`<span class="photo-badge photo-badge-icon">${y(e.kind==="skip"?"eyeOff":"close")}</span>`}_renderFooter(e,t,s){let n=md(s,t,e.identity),o=n.kind==="save"?()=>this._requestSessionLabel({uid:e.uid,...n.request},"confirm",!0):this._close;return c`<footer><button type="button" class="primary-btn" ?disabled=${this.busy||n.kind==="blocked"} @click=${o}>${this.busy&&n.kind==="save"?"Saving":n.text}</button></footer>`}static{this.styles=w`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
      box-sizing: border-box;
    }
    @media (min-width: 600px) {
      .backdrop {
        align-items: center;
        padding: 24px;
      }
    }
    .sheet {
      width: 100%;
      max-width: 600px;
      max-height: 92vh;
      max-height: 94dvh;
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: 16px 16px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 600px) {
      .sheet {
        border-radius: 16px;
      }
    }
    @media (min-width: 900px) {
      .sheet {
        max-width: 1040px;
      }
    }
    header {
      position: relative;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px 16px 0;
    }
    header .close {
      position: absolute;
      top: 12px;
      right: 12px;
    }
    .heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      padding-right: 52px;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      overflow-wrap: anywhere;
    }
    .cat-name {
      font-weight: 700;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .live-badge {
      position: relative;
      width: 12px;
      height: 12px;
      flex: none;
    }
    .live-core {
      position: absolute;
      inset: 2px;
      border-radius: 50%;
      background: var(--dot-color);
    }
    .live-pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1.5px solid var(--dot-color);
      opacity: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .live-pulse {
        animation: kibble-sheet-pulse-ring 1.8s ease-out infinite;
      }
    }
    @keyframes kibble-sheet-pulse-ring {
      0% {
        transform: scale(0.7);
        opacity: 0.7;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    .close {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .pager {
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: flex-start;
    }
    .pager-btn {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
    }
    .pager-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .chevron {
      display: inline-flex;
    }
    .chevron-left {
      transform: rotate(90deg);
    }
    .chevron-right {
      transform: rotate(-90deg);
    }
    .pager-count {
      font-size: 13px;
      font-weight: 600;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .close:focus-visible,
    .pager-btn:focus-visible,
    .chip:focus-visible,
    .not-sure:focus-visible,
    .photo-tile:focus-visible,
    .primary-btn:focus-visible,
    .stage-zoom:focus-visible,
    .box-toggle:focus-visible,
    .zoom-close:focus-visible,
    .clip-play:focus-visible,
    .photos-error button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--divider-color) transparent;
    }
    .layout {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-areas: "media" "info";
      gap: 16px;
      padding: 14px 16px 16px;
    }
    .layout.no-media {
      grid-template-areas: "info";
    }
    @media (min-width: 900px) {
      .layout {
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
        grid-template-areas: "media info";
        align-items: start;
      }
      .layout.no-media {
        grid-template-columns: 1fr;
        grid-template-areas: "info";
        max-width: 560px;
        margin: 0 auto;
        width: 100%;
      }
    }
    .media-col {
      grid-area: media;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 0;
    }
    .media-col > * {
      flex-shrink: 0;
    }
    .info-col {
      grid-area: info;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }
    .info-col > * {
      flex-shrink: 0;
    }
    /* A plain flex sibling of .scroll, never position: sticky -- it sits at the true bottom
     * of the sheet's own flex column, outside the scrolling region entirely, so it can never
     * produce a sticky-positioning compositing seam against the rounded/scrolling content
     * above it. Stays visible whether the sheet's content is short (its natural position) or
     * tall enough that .scroll takes up the remaining space (still the last thing in flow). */
    footer {
      flex-shrink: 0;
      padding: 10px 16px 16px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .primary-btn {
      width: 100%;
      min-height: 48px;
      border: none;
      border-radius: 12px;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      font: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
    }
    .primary-btn:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .stage {
      position: relative;
      width: 100%;
      aspect-ratio: 1.6;
      border-radius: 12px;
      overflow: hidden;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .box-toggle {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      z-index: 12;
      top: 8px;
      right: 8px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      font: inherit;
      cursor: pointer;
      backdrop-filter: blur(8px);
    }
    .box-toggle svg {
      width: 22px;
      height: 22px;
    }

    .stage-zoom {
      all: unset;
      box-sizing: border-box;
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      cursor: zoom-in;
    }
    .stage-zoom kibble-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .stage-video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
    }
    .clip-play {
      all: unset;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 64px;
      height: 64px;
      box-sizing: border-box;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 30px;
      cursor: pointer;
    }
    @media (hover: hover) {
      .clip-play:hover {
        background: rgba(0, 0, 0, 0.7);
      }
    }
    .compare {
      width: 100%;
    }
    .zoom {
      all: unset;
      position: fixed;
      inset: 0;
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: max(12px, env(safe-area-inset-top)) 12px max(12px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.92);
      cursor: zoom-out;
    }
    .zoom kibble-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .zoom {
      cursor: zoom-out;
    }
    .zoom-scene {
      position: relative;
      width: min(calc(100vw - 24px), calc((100dvh - 24px) * 1.6));
      aspect-ratio: 1.6;
      cursor: default;
    }
    .zoom-close {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      z-index: 12;
      top: max(12px, env(safe-area-inset-top));
      left: 12px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      cursor: pointer;
    }


    .identity {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .identity-heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .identity-title {
      font-size: var(--kibble-text-body, 14px);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .identity-hint {
      font-size: var(--kibble-text-caption, 12px);
      color: var(--secondary-text-color);
    }
    .identity-hint-multiple {
      color: var(--warning-color, #f4a452);
      font-weight: 500;
    }
    .chip-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .chip {
      flex: 1 1 72px;
      min-width: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px 4px;
      border: 2px solid transparent;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      min-height: 48px;
    }
    .chip:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .chip-suggested {
      border-style: dashed;
      border-color: var(--chip-color, var(--secondary-text-color));
      background: none;
    }
    .chip-confirmed {
      border-color: var(--chip-color, var(--secondary-text-color));
      background: color-mix(in srgb, var(--chip-color, var(--secondary-text-color)) 18%, transparent);
    }
    .chip-avatar {
      position: relative;
    }
    .chip-avatar kibble-avatar {
      --kibble-avatar-size: 34px;
    }
    .chip-check,
    .chip-spinner {
      position: absolute;
      right: -2px;
      bottom: -2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .chip-spinner {
      background: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
      color: #fff;
    }
    @media (prefers-reduced-motion: no-preference) {
      .chip-spinner svg {
        animation: kibble-sheet-spin 0.9s linear infinite;
      }
      .chip-check.just-saved {
        animation: kibble-sheet-check-pop 400ms ease;
      }
    }
    @keyframes kibble-sheet-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes kibble-sheet-check-pop {
      0% {
        transform: scale(0.4);
      }
      60% {
        transform: scale(1.25);
      }
      100% {
        transform: scale(1);
      }
    }
    .chip-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .not-sure {
      align-self: center;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 13px;
      text-decoration: underline;
      cursor: pointer;
      min-height: 48px;
      padding: 0 8px;
    }
    .not-sure:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .meal-roles {
      display: grid;
      gap: 6px;
      padding-top: 4px;
    }
    .meal-role {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
    }
    .meal-cat {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      font-weight: 600;
    }
    .meal-role-options {
      display: flex;
      gap: 4px;
    }
    .meal-role-options button {
      min-width: 72px;
      min-height: 48px;
      padding: 0 8px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .meal-role-options button[aria-pressed="true"] {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 16%, transparent);
    }
    .meal-role-options button:disabled {
      cursor: default;
    }
    .identity-error {
      margin: 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: 13px;
    }
    .photos {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .photo-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .photo-section-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 6px;
      border-radius: 50%;
      background: var(--section-color);
    }
    .photos {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .photos-heading {
      display: flex;
      align-items: baseline;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .photos-count {
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      gap: 8px;
    }
    .photo-tile {
      position: relative;
      aspect-ratio: 1;
      padding: 0;
      border: none;
      border-radius: 10px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
    }
    .photo-tile kibble-image {
      width: 100%;
      height: 100%;
    }
    .photo-tile.dim kibble-image {
      filter: grayscale(1);
      opacity: 0.55;
    }
    .photo-neutral {
      display: block;
      width: 56%;
      height: 56%;
      margin: 22% auto;
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .photo-more {
      display: flex;
      align-items: center;
      justify-content: center;
      font: inherit;
      font-size: 15px;
      font-weight: 700;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .photo-badge {
      position: absolute;
      right: 3px;
      bottom: 3px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      pointer-events: none;
    }
    .photo-badge-avatar {
      width: 22px;
      height: 22px;
    }
    .photo-badge-avatar kibble-avatar {
      --kibble-avatar-size: 22px;
    }
    .photo-badge-icon {
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .photo-skeleton {
      aspect-ratio: 1;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    @media (prefers-reduced-motion: no-preference) {
      .photo-skeleton {
        animation: kibble-sheet-skeleton-pulse 1.2s ease-in-out infinite;
      }
    }
    @keyframes kibble-sheet-skeleton-pulse {
      0%,
      100% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
    }
    .photos-error {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .photos-error button {
      flex: none;
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 4px 10px;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      min-height: 32px;
    }
  `}};customElements.define("kibble-label-sheet",yo);var xm=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"limit",selector:{number:{min:1,mode:"box"}}}],wm={device_id:"Kibble device",name:"Name (optional)",limit:"Rows before \u201CShow more\u201D (optional, default 30)"},xo=class extends v{constructor(){super(...arguments);this._computeLabel=e=>wm[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${xm}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():p}_renderFallback(){let e=Object.values(this.hass?.entities??{}),t=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return c`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${t.map(s=>c`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
          </select>
        </label>
        <label>
          <span>Name (optional)</span>
          <input
            type="text"
            .value=${this._config?.name??""}
            @change=${s=>this._updateName(s.target.value)}
          />
        </label>
        <label>
          <span>Rows before "Show more" (optional, default 30)</span>
          <input
            type="number"
            min="1"
            .value=${this._config?.limit!=null?String(this._config.limit):""}
            @change=${s=>this._updateLimit(s.target.value)}
          />
        </label>
      </div>
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateLimit(e){if(!this._config)return;let t=Number(e);this._config={...this._config,limit:e&&Number.isFinite(t)?t:void 0},this._fireConfigChanged()}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=w`
    .fallback {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    select,
    input {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
    }
  `}};customElements.define("kibble-timeline-card-editor",xo);var km={deviceId:"",catPresence:[]},ns=30,wo=class extends v{constructor(){super();this._entities=km;this._timelineFeed=new Yr(()=>this.requestUpdate());this._imageCache=new ge;this._catsQuery=new te(()=>this.requestUpdate());this._detailGeneration=0;this._sheetTrigger=null;this._sentinelRef=T();this._railRef=T();this._sentinelObserver=null;this._observedSentinel=null;this._observedSentinelCapped=null;this._newestKnownUid=null;this._animateUids=new Set;this._sheetReviewedEvents=new Map;this._sheetPhotoUids=new Set;this._onRailScroll=()=>{this._updateEdges()};this._onEventRequested=e=>{this._loadEventDetail(e.detail.uid)};this._onSamplesRetryRequested=()=>{let e=this._sheetSummary?.uid;e&&this._loadEventDetail(e)};this._closeSheet=()=>{let e=is({events:[...this._sheetReviewedEvents.values()],photosUpdated:this._sheetPhotoUids.size},this._locale());this._sheetSummary=null,this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._sheetSamplesFailed=!1,this._sheetSampleBusyUid=null,this._sheetGroup=[],this._sheetTogether=!1,this._sheetError=null,this._sheetReviewedEvents=new Map,this._sheetPhotoUids=new Set,this._sheetTrigger?.focus(),this._sheetTrigger=null,e&&this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:e},bubbles:!0,composed:!0}))};this._onSessionLabelRequested=e=>{let t=this._entryId,s=this.hass;if(!t||!s?.callWS)return;let{uid:n,cats:o,verdict:a,subjects:l,closeOnSuccess:u}=e.detail,h={uid:n,...o?{cats:o}:{},...a?{verdict:a}:{},...l?.length?{subjects:l}:{}};this._sheetBusy=!0,this._sheetError=null,ss(s,t,h).then(d=>{this._sheetBusy=!1,this._applySheetDetail(d),this._timelineFeed.refresh(s,t,this._config?.limit??ns),this._refreshCats();for(let f of this._sheetReviewedEvents.keys())(f===d.event.uid||f.startsWith(d.event.uid+":"))&&this._sheetReviewedEvents.delete(f);if(h.verdict)this._sheetReviewedEvents.set(d.event.uid,{uid:d.event.uid,event:d.event,label:h.verdict});else for(let f of h.cats??[]){let m=d.event.uid+":"+f.cat;this._sheetReviewedEvents.set(m,{uid:m,event:{kind:f.ate?"eat":"visit",open:d.event.open,start:d.event.start},label:f.cat})}u?this._closeSheet():this.requestUpdate()}).catch(d=>{this._sheetBusy=!1,this._sheetError=d instanceof Error?d.message:"Couldn't save this label.",this.requestUpdate()})};this._onSampleLabelRequested=e=>{let t=this._entryId,s=this.hass;if(!t||!s?.callWS)return;let{sampleUid:n,label:o}=e.detail;this._sheetSampleBusyUid=n,this._sheetError=null,Xr(s,t,{sampleUid:n,label:o}).then(a=>{this._sheetSampleBusyUid=null,this._sheetSamples&&(this._sheetSamples=this._sheetSamples.map(u=>u.uid===a.uid?a:u)),this._sheetPhotoUids.add(n);let l=this._sheetSummary?.uid;l&&this._loadEventDetail(l,!0),this.requestUpdate()}).catch(a=>{this._sheetSampleBusyUid=null,this._sheetError=a instanceof Error?a.message:"Couldn't save this label.",this.requestUpdate()})};this._loadOlder=()=>{this._timelineFeed.loadMore(this.hass,this._entryId,this._config?.limit??ns)};this._retryTimeline=()=>{this._timelineFeed.refresh(this.hass,this._entryId,this._config?.limit??ns)};this._sheetSummary=null,this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._sheetSamplesFailed=!1,this._sheetSampleBusyUid=null,this._sheetGroup=[],this._sheetTogether=!1,this._sheetBusy=!1,this._sheetError=null,this._edgeTop=!1,this._edgeBottom=!1}static{this.properties={hass:{attribute:!1},_config:{state:!0},_sheetSummary:{state:!0},_sheetSamples:{state:!0},_sheetSceneSubjects:{state:!0},_sheetSessionCats:{state:!0},_sheetMultipleCats:{state:!0},_sheetSamplesFailed:{state:!0},_sheetSampleBusyUid:{state:!0},_sheetGroup:{state:!0},_sheetTogether:{state:!0},_sheetBusy:{state:!0},_sheetError:{state:!0},_edgeTop:{state:!0},_edgeBottom:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-timeline-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-timeline-card-editor")}disconnectedCallback(){super.disconnectedCallback(),this._imageCache.dispose(),this._timelineFeed.dispose(),this._sentinelObserver?.disconnect(),this._detailGeneration+=1}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=$t(this.hass.entities??{},e),this._entryId=Et(this.hass.devices??{},e)),this._timelineFeed.sync(this.hass,this._entryId,this._config?.limit??ns);let t=this.hass?.callWS;if(this.hass&&this._entryId&&t&&this._entryId!==this._catsEntryId){this._catsEntryId=this._entryId;let s=this._entryId;this._catsQuery.sync(s,()=>t({type:"kibble/cats",entry_id:s}).then(n=>n))}this._syncAnimation()}_syncAnimation(){let e=this._timelineFeed.state.items;if(!e||e.length===0)return;let t=e[0].uid;if(t===this._newestKnownUid){this._animateUids=new Set;return}let s=new Set;if(this._newestKnownUid!==null)for(let n of e){if(n.uid===this._newestKnownUid)break;s.add(n.uid)}this._animateUids=s,this._newestKnownUid=t}updated(){this._syncSentinel(),this._updateEdges()}_syncSentinel(){let e=this._sentinelRef.value??null,t=ho(this._config?.max_height)!=="";if(!(e===this._observedSentinel&&t===this._observedSentinelCapped)){if(this._sentinelObserver?.disconnect(),this._observedSentinel=e,this._observedSentinelCapped=t,!e){this._sentinelObserver=null;return}this._sentinelObserver=new IntersectionObserver(s=>{s.some(n=>n.isIntersecting)&&this._loadOlder()},{root:t?this._railRef.value:null,rootMargin:"200px"}),this._sentinelObserver.observe(e)}}_updateEdges(){let e=this._railRef.value;if(!e){(this._edgeTop||this._edgeBottom)&&(this._edgeTop=!1,this._edgeBottom=!1);return}let t=e.scrollTop>2,s=e.scrollHeight-e.scrollTop-e.clientHeight>2;t!==this._edgeTop&&(this._edgeTop=t),s!==this._edgeBottom&&(this._edgeBottom=s)}_locale(){return this.hass?.locale?.language??this.hass?.language}_catColor(e){if(!e)return null;let t=this._catsQuery.state.data?.cats.find(s=>s.name===e);return t?ce(t.color):_e(e)}render(){if(!this._config||!this.hass)return p;let e=this._timelineFeed.state,t=ad(e.items??[],Date.now()/1e3),s=cd(t,new Date),n=e.hasMore,o=!e.error&&!e.loading&&e.items!==null&&s.length===0;return c`
      <ha-card>
        <div class="container">
          ${this._config.name?c`<div class="label">${this._config.name}</div>`:p}
          <div class="rail-wrap">
            <div class="rail" style=${ho(this._config.max_height)} @scroll=${this._onRailScroll} ${P(this._railRef)}>
              ${e.error?this._renderError(e.error):p}
              ${o?this._renderEmpty():p}
              ${s.map(a=>this._renderDay(a))}
              ${n?c`<div class="sentinel" ${P(this._sentinelRef)}></div>`:p}
              ${e.loadingMore?c`<p class="loading-more">Loading older events…</p>`:p}
            </div>
            <div class="edge-fade edge-fade-top ${this._edgeTop?"visible":""}"></div>
            <div class="edge-fade edge-fade-bottom ${this._edgeBottom?"visible":""}"></div>
          </div>
        </div>
      </ha-card>
      <kibble-label-sheet
        ?open=${this._sheetSummary!==null}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cache=${this._imageCache}
        .cats=${this._catsQuery.state.data?.cats??[]}
        .summary=${this._sheetSummary}
        .samples=${this._sheetSamples}
        .sceneSubjects=${this._sheetSceneSubjects}
        .sessionCats=${this._sheetSessionCats}
        .multipleCats=${this._sheetMultipleCats}
        .samplesFailed=${this._sheetSamplesFailed}
        .group=${this._sheetGroup}
        .groupTogether=${this._sheetTogether}
        .busy=${this._sheetBusy}
        .error=${this._sheetError}
        .sampleBusyUid=${this._sheetSampleBusyUid}
        @close-requested=${this._closeSheet}
        @session-label-requested=${this._onSessionLabelRequested}
        @sample-label-requested=${this._onSampleLabelRequested}
        @event-requested=${this._onEventRequested}
        @samples-retry-requested=${this._onSamplesRetryRequested}
      ></kibble-label-sheet>
    `}_renderEmpty(){return c`<p class="empty">Nothing to show yet. Feeds and visits appear here as they happen.</p>`}_renderError(e){return c`
      <div class="error">
        <span>Couldn't load the timeline. ${e}</span>
        <button type="button" @click=${this._retryTimeline}>Try again</button>
      </div>
    `}_renderDay(e){return c`
      <div class="day">
        <div class="day-label">${e.label}</div>
        <div class="day-items">${e.groups.map(t=>this._renderRow(t))}</div>
      </div>
    `}_renderRow(e){let t=e.event,s=e.together===!0,n=he(e.start??t.start,this._locale()),o=s?"var(--secondary-text-color)":this._catColor(t.cat)??"var(--secondary-text-color)",a=e.events.some(l=>this._animateUids.has(l.uid));return c`
      <div class="row ${a?"row-enter":""}">
        <time class="time">${n}</time>
        <span class="dot-col"><span class="dot" style="--dot-color:${s?this._togetherDotStyle(e.events):o}"></span></span>
        <div class="content">${s?this._renderTogether(e):this._renderKnown(e,o)}</div>
      </div>`}_renderTogether(e){let t=od(e.events),s=e.start!=null&&e.end!=null?nd(e.start,e.end):null;return c`
      <div class="together-heading">
        <button type="button" class="together-open" aria-label=${t} @click=${n=>this._openSheet(e,n.currentTarget)}>
          <span class="title together-title">${this._renderTogetherTitle(e.events)}</span>
        </button>
      </div>
      ${s?c`<span class="meta">for ${s}</span>`:p}
      ${this._renderTogetherMedia(e)}`}_renderTogetherTitle(e){let t=ts(e),s=t.map(a=>a.cat?c`<span class="cat-name" style="color:${this._catColor(a.cat)??"var(--secondary-text-color)"}">${a.cat}</span>`:c`<span class="together-unknown-name">Who?</span>`),n=c`${s.map((a,l)=>c`${l===0?p:l===s.length-1?s.length===2?" and ":", and ":", "}${a}`)}`,o=t[0];if(o&&o.kind!=="feed"&&t.every(a=>a.kind===o.kind&&a.open===o.open)){let a=o.open?o.kind==="eat"?"are eating":"are here":Ye(o);return c`${n} ${a}`}return c`${t.map((a,l)=>c`${l?", ":p}${s[l]} ${Ye(a)}`)}`}_togetherDotStyle(e){let t=ts(e);if(t.length===0)return"var(--secondary-text-color)";let s=100/t.length;return`conic-gradient(${t.map((o,a)=>`${o.cat?this._catColor(o.cat)??"var(--secondary-text-color)":"var(--secondary-text-color)"} ${a*s}% ${(a+1)*s}%`).join(", ")})`}_renderTogetherMedia(e){let t=e.events,s=t.find(l=>l.kind==="eat"&&es(l)!==null),n=t.find(l=>l.kind==="eat"&&!!l.clip&&!!l.scene)??t.find(l=>!!l.scene)??t.find(l=>l.kind==="eat"&&!!l.clip)??t.find(l=>l.kind==="eat"&&!!l.thumb)??t.find(l=>!!l.thumb)??e.event,o=t.find(l=>l.scene)?.scene??t.find(l=>l.thumb)?.thumb??null,a={...e,event:n};if(s){let l=es(s);if(l){let u={...e,event:s};return o?c`
          <div class="media media-eat">
            ${this._renderPhotoButton(a,o,"photo-tile photo-third")}
            ${this._renderComparePair(u,l,"third")}
          </div>
        `:c`<div class="media media-eat">${this._renderComparePair(u,l,"full")}</div>`}}return c`<div class="media">${this._renderPhotoButton(a,o,"photo-tile photo-visit")}</div>`}_renderKnown(e,t){let s=e.event;return c`
      ${this._renderTitle(e,t)}
      ${this._renderMeta(s)}
      ${this._renderMedia(e,s)}`}_renderTitle(e,t){let s=e.event,n=s.kind==="feed"?c`${Kt(s)}`:s.cat?c`<span class="cat-name" style="color:${t}">${s.cat}</span> ${Ye(s)}`:c`${s.open?s.kind==="eat"?"Someone is eating":"Someone is here":"Who was here?"}`,o=`Review ${Jr(s)}, ${he(s.start,this._locale())}`;return c`<button type="button" class="title-open" aria-label=${o} @click=${a=>this._openSheet(e,a.currentTarget)}>
      <span class="title-line">
        <span class="title">${n}</span>
        ${s.open?this._renderLiveRing(t):p}
        ${e.events.length>1?c`<span class="count-badge">${ld(s.kind,e.events.length)}</span>`:p}
      </span></button>`}_renderLiveRing(e){return c`
      <span class="live-badge" style="--dot-color:${e}" aria-label="Happening now">
        <span class="live-core"></span>
        <span class="live-pulse"></span>
      </span>
    `}_renderMeta(e){if(e.kind==="feed")return p;let t=Qr(e);return t?c`<span class="meta">for ${t}</span>`:p}_renderMedia(e,t){let s=es(t);if(t.kind==="feed")return s?this._renderComparePair(e,s,"full"):p;let n=Zr(t);return t.kind==="eat"&&s?n?c`
        <div class="media media-eat">
          ${this._renderPhotoButton(e,n,"photo-tile photo-third")}
          ${this._renderComparePair(e,s,"third")}
        </div>
      `:c`<div class="media media-eat">${this._renderComparePair(e,s,"full")}</div>`:c`<div class="media">${this._renderPhotoButton(e,n,"photo-tile photo-visit")}</div>`}_renderPhotoButton(e,t,s){let n=e.event,o=n.kind==="eat"&&!!n.clip,a=`View and correct: ${Jr(n)}, ${he(n.start,this._locale())}${o?". Has video.":""}`;return c`
      <button type="button" class="${s}" aria-label=${a} @click=${l=>this._openSheet(e,l.currentTarget)}>
        ${t?c`<kibble-image .hass=${this.hass} .asset=${t} .cache=${this._imageCache} alt=""></kibble-image>`:c`<span class="neutral-icon">${Ne()}</span>`}
        ${o?c`<span class="clip-badge">${y("play")}</span>`:p}
      </button>
    `}_renderComparePair(e,t,s){let n=`View and correct: ${Jr(e.event)}, ${he(e.event.start,this._locale())}`;return c`
      <div class="compare-pair ${s==="full"?"compare-full":"compare-third"}">
        <button type="button" class="compare-tile" aria-label=${`${n}. Before.`} @click=${o=>this._openSheet(e,o.currentTarget)}>
          ${t.before?c`<kibble-image .hass=${this.hass} .asset=${t.before} .cache=${this._imageCache} alt=""></kibble-image>`:p}
          <span class="compare-label">Before</span>
        </button>
        <button type="button" class="compare-tile" aria-label=${`${n}. After.`} @click=${o=>this._openSheet(e,o.currentTarget)}>
          ${t.after?c`<kibble-image .hass=${this.hass} .asset=${t.after} .cache=${this._imageCache} alt=""></kibble-image>`:p}
          <span class="compare-label">After</span>
        </button>
      </div>
    `}_refreshCats(){let e=this.hass,t=this._entryId,s=e?.callWS;!s||!t||this._catsQuery.refresh(()=>s({type:"kibble/cats",entry_id:t}).then(n=>n))}_applySheetDetail(e){this._sheetSummary=e.event,this._sheetSamples=e.samples,this._sheetSceneSubjects=e.scene_subjects,this._sheetSessionCats=e.cats,this._sheetMultipleCats=e.multiple_cats,this._sheetSamplesFailed=!1,this.requestUpdate()}_loadEventDetail(e,t=!1){let s=this._sheetGroup.find(l=>l.uid===e);s&&(this._sheetSummary=s),t||(this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._sheetSamplesFailed=!1),this._sheetError=null;let n=++this._detailGeneration,o=this.hass?.callWS,a=this._entryId;if(!o||!a){this._sheetSamplesFailed=!t;return}o({type:"kibble/event",entry_id:a,uid:e}).then(l=>{n===this._detailGeneration&&this._applySheetDetail(l)}).catch(()=>{n===this._detailGeneration&&(t||(this._sheetSamplesFailed=!0),this.requestUpdate())})}_openSheet(e,t){this._sheetTrigger=t,this._sheetGroup=e.events,this._sheetTogether=e.together===!0,this._sheetReviewedEvents=new Map,this._sheetPhotoUids=new Set,this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._loadEventDetail(e.event.uid)}static{this.styles=w`
    :host {
      display: block;
      --kibble-text-caption: 13px;
      --kibble-text-body: 15px;
    }
    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .container {
      container-type: inline-size;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      padding: 4px 0 12px;
    }
    .label {
      padding: 12px 16px 0;
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .empty {
      margin: 0;
      padding: 24px 16px;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 8px 16px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: var(--kibble-text-body);
    }
    .error button {
      flex: 0 0 auto;
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font: inherit;
      cursor: pointer;
      min-height: 36px;
    }
    .error button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    /* The rail scrolls inside itself by default -- railStyle's own inline max-height (a real
       bounded cap unless a caller opts out with max_height: none) is what actually turns this
       into a scroll container; overflow/scrollbar rules here just style that container once it
       is one. */
    .rail-wrap {
      position: relative;
    }
    .rail {
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      scrollbar-color: var(--divider-color) transparent;
    }
    .rail::-webkit-scrollbar {
      width: 6px;
    }
    .rail::-webkit-scrollbar-thumb {
      background: var(--divider-color);
      border-radius: 3px;
    }
    /* A soft hint that there is more above/below than the current scroll position shows --
       never blocks a tap (pointer-events: none), never fights the sticky day heading for
       attention (same background colour, so the seam between them is invisible). */
    .edge-fade {
      position: absolute;
      left: 0;
      right: 0;
      height: 28px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease;
    }
    .edge-fade-top {
      top: 0;
      background: linear-gradient(to bottom, var(--ha-card-background, var(--card-background-color, #fff)), transparent);
    }
    .edge-fade-bottom {
      bottom: 0;
      background: linear-gradient(to top, var(--ha-card-background, var(--card-background-color, #fff)), transparent);
    }
    .edge-fade.visible {
      opacity: 1;
    }
    .day-label {
      position: sticky;
      top: 0;
      z-index: 1;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      padding: 18px 16px 8px 96px;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .day-items {
      position: relative;
      margin-left: 96px;
      border-left: 2px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 2px 0;
    }
    .row {
      position: relative;
      padding: 0 16px 0 22px;
    }
    @media (prefers-reduced-motion: no-preference) {
      .row-enter {
        animation: kibble-row-enter 420ms cubic-bezier(0.2, 0.7, 0.3, 1);
      }
    }
    @keyframes kibble-row-enter {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .time {
      position: absolute;
      left: -96px;
      width: 80px;
      padding-top: 2px;
      text-align: right;
      font-size: var(--kibble-text-caption);
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .dot-col {
      position: absolute;
      left: -7px;
      top: 6px;
    }
    .dot {
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--dot-color);
      box-shadow: 0 0 0 3px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    /* The title and Review chip keep 48 px touch targets, but the negative block margin lets the
     * visible text sit exactly where a normal row's title does (top-aligned with its time). */
    .together-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      margin-block: -14px;
    }
    .together-open {
      display: flex;
      align-items: center;
      flex: 1 1 auto;
      gap: 8px;
      min-width: 0;
      min-height: 48px;
      padding: 0;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .title-open {
      display: block;
      width: 100%;
      border: 0;
      margin: 0;
      padding: 0;
      background: none;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
      min-height: 48px;
    }
    .title-open:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .title-line {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .title {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
      overflow-wrap: anywhere;
    }
    .cat-name {
      font-weight: 700;
    }
    .count-badge {
      font-size: var(--kibble-text-caption);
      font-weight: 500;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      border-radius: 999px;
      padding: 2px 10px;
    }
    .meta {
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .live-badge {
      position: relative;
      width: 12px;
      height: 12px;
      flex: none;
    }
    .live-core {
      position: absolute;
      inset: 2px;
      border-radius: 50%;
      background: var(--dot-color);
    }
    .live-pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1.5px solid var(--dot-color);
      opacity: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .live-pulse {
        animation: kibble-pulse-ring 1.8s ease-out infinite;
      }
    }
    @keyframes kibble-pulse-ring {
      0% {
        transform: scale(0.7);
        opacity: 0.7;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    .media {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      padding-bottom: 14px;
    }
    .media-eat {
      align-items: stretch;
    }
    .photo-tile {
      position: relative;
      flex: none;
      padding: 0;
      border: none;
      border-radius: 16px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .clip-badge {
      position: absolute;
      left: 4px;
      bottom: 4px;
      width: 28px;
      height: 28px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 14px;
      pointer-events: none;
    }
    span.photo-tile {
      cursor: default;
    }
    .photo-visit {
      width: 78px;
      height: 78px;
    }
    .photo-third {
      width: 30%;
      max-width: 120px;
      aspect-ratio: 1;
    }
    .photo-unknown {
      width: 100px;
      height: 100px;
    }
    .neutral-icon {
      width: 60%;
      height: 60%;
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .compare-pair {
      display: flex;
      gap: 8px;
      min-width: 0;
    }
    .compare-third {
      flex: 1 1 auto;
    }
    .compare-full {
      flex: 1 1 auto;
      width: 100%;
    }
    .compare-tile {
      position: relative;
      flex: 1 1 0;
      height: 130px;
      padding: 0;
      border: none;
      border-radius: 16px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
    }
    .compare-full .compare-tile {
      height: 150px;
    }
    .compare-tile kibble-image {
      width: 100%;
      height: 100%;
    }
    .compare-label {
      position: absolute;
      left: 8px;
      bottom: 8px;
      padding: 3px 9px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
    }
    .photo-tile:focus-visible,
    .compare-tile:focus-visible,
    .chip:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 6px;
      padding-bottom: 14px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      border: none;
      border-radius: 999px;
      background: color-mix(in srgb, var(--dot-color, var(--primary-color)) 16%, transparent);
      color: var(--dot-color, var(--primary-color, #03a9f4));
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      padding: 7px 16px 7px 10px;
      min-height: 38px;
      cursor: pointer;
    }
    .chip-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--dot-color);
      flex: none;
    }
    .chip.chip-muted {
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      color: var(--secondary-text-color);
      font-weight: 500;
      padding: 7px 16px;
    }
    .chip:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .row-error {
      display: block;
      padding-bottom: 12px;
      font-size: var(--kibble-text-caption);
      color: var(--error-color, #db4437);
    }
    .sentinel {
      height: 1px;
      width: 100%;
    }
    .loading-more {
      margin: 0;
      padding: 10px 16px 2px;
      text-align: center;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    @container (max-width: 380px) {
      .day-label {
        padding-left: 74px;
      }
      .day-items {
        margin-left: 74px;
      }
      .row {
        padding-left: 18px;
      }
      .time {
        left: -74px;
        width: 60px;
      }
      .photo-third {
        max-width: 92px;
      }
      .compare-tile {
        height: 108px;
      }
    }
  `}};customElements.define("kibble-timeline-card",wo);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-timeline-card",name:"Kibble Timeline",description:"Today's feeds and who's been by, one calm list, newest first, with real photos.",preview:!0});var xd={items:null,total:0,pageIndex:0,hasNext:!1,hasPrevious:!1,loading:!1,error:null},vt=class{constructor(r,e){this._type=r;this._onChange=e;this.state=xd;this._cursors=[null];this._key=null;this._generation=0}sync(r,e,t,s){if(e!==this._key){if(this._key=e,this._cursors=[null],!r?.callWS||!e){this.state=xd;return}this._load(r,t,s,0,++this._generation)}}refresh(r,e,t){!r?.callWS||!this._key||this._load(r,e,t,this.state.pageIndex,++this._generation)}next(r,e,t){!r?.callWS||this.state.loading||!this.state.hasNext||this._load(r,e,t,this.state.pageIndex+1,this._generation)}previous(r,e,t){!r?.callWS||this.state.loading||this.state.pageIndex===0||this._load(r,e,t,this.state.pageIndex-1,this._generation)}removeItem(r){let e=this.state.items;if(!e)return;let t=e.filter(s=>!r(s));t.length!==e.length&&(this.state={...this.state,items:t,total:Math.max(0,this.state.total-(e.length-t.length))},this._onChange())}async _load(r,e,t,s,n){this.state={...this.state,loading:!0,error:null},this._onChange();try{let o=this._cursors[s]??null,a={type:this._type,limit:t,...e,...o?{cursor:o}:{}},l=await r.callWS(a);if(n!==this._generation)return;this._cursors[s+1]=l.cursor,this.state={items:l.items,total:l.total,pageIndex:s,hasNext:l.has_more,hasPrevious:s>0,loading:!1,error:null}}catch(o){if(n!==this._generation)return;this.state={...this.state,loading:!1,error:q(o)}}this._onChange()}dispose(){this._generation+=1}};async function wd(i,r,e){if(!i.callWS)throw new Error("Not connected.");return(await i.callWS({type:"kibble/label",entry_id:r,uids:e.uids,label:e.label})).events}function ko(i){let r=i/1048576;if(r<1e3)return`${r<10?r.toFixed(1):Math.round(r)} MB`;let e=r/1024;return`${e<10?e.toFixed(1):Math.round(e)} GB`}function kd(i){let r=i.retention_days===1?"1 day":`${i.retention_days} days`;return`Using ${ko(i.used_bytes)}, keeping ${r}`}function Sd(i){return i?`Feeder buffer ${ko(i.used_bytes)} of ${ko(i.cap_bytes)}`:null}var Sm="cat_recognition",Cm={learning:"learning",paused:"paused",learned:"learned"};function $m(i){return i.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Cd(i,r,e){let t=`cat_recognition_${$m(e)}`;for(let s of Object.values(i))if(!(s.device_id!==r||s.disabled_by)&&s.entity_id.startsWith("sensor.")&&s.translation_key===Sm&&(s.unique_id?s.unique_id.endsWith(t):s.entity_id.endsWith(`_${t}`)))return s.entity_id}function $d(i,r){if(!r)return null;let e=i.states[r];if(!e||e.state==="unknown"||e.state==="unavailable")return null;let t=Number(e.state);if(!Number.isFinite(t))return null;let s=Cm[String(e.attributes.learning_state)]??"learning";return{percent:Math.max(0,Math.min(100,t)),state:s}}var Em={nw:"se",ne:"sw",se:"nw",sw:"ne"},Tm={se:{x:1,y:1},sw:{x:-1,y:1},ne:{x:1,y:-1},nw:{x:-1,y:-1}},Ed=Ys;function So(i){return Number.isFinite(i.width)&&Number.isFinite(i.height)&&i.width>0&&i.height>0}function os(i){if(!So(i))return[0,0,1,1];let{width:r,height:e}=i;if(r===e)return[0,0,1,1];if(r>e){let s=e/r/2;return[.5-s,0,.5+s,1]}let t=r/e/2;return[0,.5-t,1,.5+t]}function Td(i,r,e){return di(i,r,e)}function Pd(i,r,e,t,s=Ed){if(!So(t))return i;let{width:n,height:o}=t,a=pr(i,Em[r]),l=Tm[r],u=Math.abs(e.x-a.x)*n,h=Math.abs(e.y-a.y)*o,d=(l.x>0?1-a.x:a.x)*n,f=(l.y>0?1-a.y:a.y)*o,m=s*Math.min(n,o),b=Math.min(Math.max(u,h,m),d,f),_=ot(a.x+l.x*(b/n)),g=ot(a.y+l.y*(b/o));return ci(a,{x:_,y:g})}function Ad(i,r,e,t=Ed){if(!So(e)||!Number.isFinite(r)||r<=0)return i;let{width:s,height:n}=e,o=(i[0]+i[2])/2,a=(i[1]+i[3])/2,l=t*Math.min(s,n),u=Math.min(s,n),h=Math.min(u,Math.max(l,je(i)*s*r)),d=h/s/2,f=h/n/2,m=Math.min(1-d,Math.max(d,o)),b=Math.min(1-f,Math.max(f,a));return[m-d,b-f,m+d,b+f]}function Co(i,r){return Math.hypot(i.x-r.x,i.y-r.y)}var Pm=[0,0,1,1];function Am(i,r,e=1600){let t=Math.max(i,r);if(t<=0||t<=e)return{width:i,height:r};let s=e/t;return{width:Math.max(1,Math.round(i*s)),height:Math.max(1,Math.round(r*s))}}async function Rd(i){if(typeof createImageBitmap!="function")return null;try{return await createImageBitmap(i,{imageOrientation:"from-image"})}catch{return null}}async function Md(i){if(typeof Image>"u"||typeof URL>"u")return null;let r=URL.createObjectURL(i);try{return await new Promise((e,t)=>{let s=new Image;s.onload=()=>e(s),s.onerror=()=>t(new Error("decode failed")),s.src=r})}catch{return null}finally{URL.revokeObjectURL(r)}}async function as(i){let r=await Rd(i)??await Md(i);if(!r)return null;try{let{width:e,height:t}="naturalWidth"in r?{width:r.naturalWidth,height:r.naturalHeight}:{width:r.width,height:r.height};return e>0&&t>0?{width:e,height:t}:null}finally{"close"in r&&r.close()}}async function ls(i,r=Pm,e=1600){let t=await Rd(i)??await Md(i);if(!t)return i;try{let{width:s,height:n}="naturalWidth"in t?{width:t.naturalWidth,height:t.naturalHeight}:{width:t.width,height:t.height};if(s<=0||n<=0)return i;let[o,a,l,u]=r,h=Math.min(s-1,Math.max(0,Math.round(o*s))),d=Math.min(n-1,Math.max(0,Math.round(a*n))),f=Math.max(1,Math.round((l-o)*s)),m=Math.max(1,Math.round((u-a)*n)),{width:b,height:_}=Am(f,m,e),g=document.createElement("canvas");g.width=b,g.height=_;let C=g.getContext("2d");return C?(C.drawImage(t,h,d,f,m,0,0,b,_),await new Promise(z=>g.toBlob(z,"image/jpeg",.85))??i):i}catch{return i}finally{"close"in t&&t.close()}}function cs(i,r){return r===i?i.name:`${i.name.replace(/\.[^./\\]+$/,"")||"photo"}.jpg`}var Rm={queued:!0,compressing:!0,uploading:!0,added:!1,duplicate:!1,no_cat:!1,error:!1,canceled:!1},Mm={queued:!1,compressing:!1,uploading:!1,added:!0,duplicate:!0,no_cat:!0,error:!0,canceled:!0},ds=class{constructor(r,e,t=2){this._handlers=r;this._onChange=e;this._concurrency=t;this._items=new Map;this._order=[];this._controllers=new Map;this._active=0;this._disposed=!1}get items(){return this._order.map(r=>this._items.get(r))}get(r){return this._items.get(r)}enqueue(r){let e=!1;for(let t of r)this._items.has(t)||(this._items.set(t,{id:t,status:"queued",message:null}),this._order.push(t),e=!0);e&&this._onChange()}start(){this._pump()}retry(r){let e=this._items.get(r);!e||e.status!=="error"||(this._items.set(r,{id:r,status:"queued",message:null}),this._onChange(),this._pump())}cancelPending(){let r=!1;for(let e of this._order){let t=this._items.get(e);Rm[t.status]&&(t.status==="queued"?(this._items.set(e,{id:e,status:"canceled",message:null}),r=!0):this._controllers.get(e)?.abort())}r&&this._onChange()}get allSettled(){return this._order.length>0&&this._order.every(r=>Mm[this._items.get(r).status])}tally(){let r={added:0,duplicate:0,no_cat:0,error:0,canceled:0};for(let e of this._items.values())e.status in r&&(r[e.status]+=1);return r}dispose(){this._disposed=!0;for(let r of this._controllers.values())r.abort()}_pump(){if(!this._disposed)for(;this._active<this._concurrency;){let r=this._order.find(e=>this._items.get(e)?.status==="queued");if(!r)return;this._run(r)}}_run(r){let e=new AbortController;this._controllers.set(r,e),this._active++,this._set(r,"compressing",null),this._handlers.compress(r,e.signal).then(t=>(this._set(r,"uploading",null),this._handlers.upload(r,t,e.signal))).then(t=>{this._set(r,t.status,t.message??null)}).catch(t=>{let s=e.signal.aborted||t instanceof DOMException&&t.name==="AbortError";this._set(r,s?"canceled":"error",s?null:t instanceof Error?t.message:"Couldn't upload this photo.")}).finally(()=>{this._controllers.delete(r),this._active--,this._pump()})}_set(r,e,t){this._items.has(r)&&(this._items.set(r,{id:r,status:e,message:t}),this._onChange())}};async function Ld(i,r,e,t){if(i.fetchWithAuth)return i.fetchWithAuth(r,{method:"POST",body:e,signal:t});let s=i.auth?.data.access_token;if(!s||!i.hassUrl)throw new Error("Not authenticated.");let n=new Headers({Authorization:`Bearer ${s}`});return fetch(new URL(r,i.hassUrl),{method:"POST",body:e,headers:n,signal:t})}async function Hd(i,r,e,t,s,n){let o=new FormData;o.append("file",t,s);let a=await Ld(i,`/api/kibble/${r}/upload/training/${encodeURIComponent(e)}`,o,n);try{return await a.json()}catch{throw new Error(`Upload failed (${a.status}).`)}}async function Od(i,r,e,t,s,n){let o=new FormData;o.append("file",t,s);let a=await Ld(i,`/api/kibble/${r}/upload/avatar/${encodeURIComponent(e)}`,o,n);try{return await a.json()}catch{throw new Error(`Upload failed (${a.status}).`)}}var Lm=["nw","ne","se","sw"],$o=class extends v{constructor(){super();this._stageRef=T();this._pointers=new Map;this._dragCorner=null;this._dragMoveStart=null;this._pinchStart=null;this._resizeObserver=null;this.imageUrl="",this.naturalWidth=0,this.naturalHeight=0,this.crop=[0,0,1,1],this.circleGuide=!1,this.interactive=!0,this.fitParent=!1}static{this.properties={imageUrl:{type:String},naturalWidth:{type:Number},naturalHeight:{type:Number},crop:{attribute:!1},circleGuide:{type:Boolean},interactive:{type:Boolean},fitParent:{type:Boolean}}}connectedCallback(){super.connectedCallback(),this.fitParent&&this.parentElement&&typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(()=>this._applyParentFit()),this._resizeObserver.observe(this.parentElement))}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._resizeObserver=null}updated(e){this.fitParent&&(e.has("naturalWidth")||e.has("naturalHeight"))&&this._applyParentFit()}_applyParentFit(){let e=this.parentElement;if(!e||this.naturalWidth<=0||this.naturalHeight<=0)return;let t=e.clientWidth,s=e.clientHeight;if(t<=0||s<=0)return;let n=Math.min(t/this.naturalWidth,s/this.naturalHeight);this.style.width=`${Math.max(1,this.naturalWidth*n)}px`,this.style.height=`${Math.max(1,this.naturalHeight*n)}px`}_pointToNormalized(e,t){let s=this._stageRef.value?.getBoundingClientRect();return s?Ae(e,t,s):null}_emitChange(e){this.crop=e,this.dispatchEvent(new CustomEvent("crop-changed",{detail:{crop:e},bubbles:!0,composed:!0}))}_beginPinch(){this._dragCorner=null,this._dragMoveStart=null;let e=[...this._pointers.values()];e.length<2||(this._pinchStart={distance:Co(e[0],e[1]),crop:this.crop})}_capture(e){this._stageRef.value?.setPointerCapture(e.pointerId);let t=this._pointToNormalized(e.clientX,e.clientY);t&&this._pointers.set(e.pointerId,t)}_onHandlePointerDown(e,t){t.preventDefault(),t.stopPropagation(),this._capture(t),this._pointers.size>=2?this._beginPinch():this._dragCorner=e}_onBodyPointerDown(e){if(!this.interactive)return;if(e.preventDefault(),this._capture(e),this._pointers.size>=2){this._beginPinch();return}let t=this._pointToNormalized(e.clientX,e.clientY);t&&(this._dragMoveStart={point:t,crop:this.crop})}_onPointerMove(e){if(!this._pointers.has(e.pointerId))return;let t=this._pointToNormalized(e.clientX,e.clientY);if(!t)return;this._pointers.set(e.pointerId,t);let s={width:this.naturalWidth,height:this.naturalHeight};if(this._pinchStart&&this._pointers.size>=2){let n=[...this._pointers.values()],o=Co(n[0],n[1]);this._pinchStart.distance>0&&this._emitChange(Ad(this._pinchStart.crop,o/this._pinchStart.distance,s));return}if(this._dragCorner){this._emitChange(Pd(this.crop,this._dragCorner,t,s));return}this._dragMoveStart&&this._emitChange(Td(this._dragMoveStart.crop,t.x-this._dragMoveStart.point.x,t.y-this._dragMoveStart.point.y))}_onPointerUp(e){this._pointers.delete(e.pointerId),this._pointers.size<2&&(this._pinchStart=null),this._pointers.size===0&&(this._dragCorner=null,this._dragMoveStart=null)}render(){let[e,t,s,n]=this.crop,o=`left:${e*100}%;top:${t*100}%;width:${(s-e)*100}%;height:${(n-t)*100}%;`,a=this.naturalWidth>0&&this.naturalHeight>0?`${this.naturalWidth} / ${this.naturalHeight}`:"1 / 1";return c`
      <div
        class="stage"
        style="aspect-ratio:${a};cursor:${this.interactive?"move":"default"}"
        ${P(this._stageRef)}
        @pointerdown=${l=>this._onBodyPointerDown(l)}
        @pointermove=${l=>this._onPointerMove(l)}
        @pointerup=${l=>this._onPointerUp(l)}
        @pointercancel=${l=>this._onPointerUp(l)}
      >
        ${this.imageUrl?c`<img src=${this.imageUrl} alt="" draggable="false" />`:p}
        <div class="frame" style=${o}>
          ${this.circleGuide?c`<div class="circle-guide"></div>`:p}
          ${this.interactive?Lm.map(l=>c`<button type="button" class="handle handle-${l}" aria-label="Resize crop" @pointerdown=${u=>this._onHandlePointerDown(l,u)}></button>`):p}
        </div>
      </div>
    `}static{this.styles=w`
    :host {
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
    .stage {
      position: relative;
      width: 100%;
      overflow: hidden;
      touch-action: none;
      background: #000;
      border-radius: 8px;
    }
    .stage img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
      pointer-events: none;
      user-select: none;
    }
    .frame {
      position: absolute;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
      border: 2px solid #fff;
      box-sizing: border-box;
    }
    .circle-guide {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1px dashed rgba(255, 255, 255, 0.85);
      pointer-events: none;
    }
    .handle {
      position: absolute;
      width: 28px;
      height: 28px;
      margin: -14px;
      padding: 0;
      border: none;
      background: none;
      touch-action: none;
      cursor: pointer;
    }
    .handle::after {
      content: "";
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }
    .handle-nw {
      left: 0;
      top: 0;
      cursor: nwse-resize;
    }
    .handle-ne {
      right: 0;
      top: 0;
      left: auto;
      cursor: nesw-resize;
    }
    .handle-se {
      right: 0;
      bottom: 0;
      left: auto;
      cursor: nwse-resize;
    }
    .handle-sw {
      left: 0;
      bottom: 0;
      cursor: nesw-resize;
    }
  `}};customElements.define("kibble-crop-editor",$o);var Hm=["button:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),Eo=class extends v{constructor(){super();this._queue=null;this._tileGeneration=0;this._loadedFiles=null;this._closeButtonRef=T();this._keydownHandler=e=>{if(!this.open)return;if(e.key==="Escape"){e.preventDefault(),this._adjustingId?this._adjustingId=null:this._requestClose();return}if(e.key!=="Tab")return;let t=[...this.renderRoot.querySelectorAll(Hm)];if(t.length===0)return;let s=this.renderRoot.querySelector(":focus"),n=s?t.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=t.length)&&(e.preventDefault(),(e.shiftKey?t[t.length-1]:t[0])?.focus())};this.open=!1,this.files=[],this._tiles=[],this._adjustingId=null,this._queueTick=0}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},entryId:{type:String},cat:{type:String},files:{attribute:!1},_tiles:{state:!0},_adjustingId:{state:!0},_queueTick:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),this._disposeTiles(),this._queue?.dispose()}willUpdate(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus(),this.open&&this.files!==this._loadedFiles&&(this._loadedFiles=this.files,this._resetForFiles(this.files))}_disposeTiles(){for(let e of this._tiles)URL.revokeObjectURL(e.objectUrl)}_resetForFiles(e){this._queue?.dispose(),this._queue=null,this._disposeTiles(),this._adjustingId=null;let t=++this._tileGeneration;this._tiles=e.map((s,n)=>({id:`f${n}`,file:s,objectUrl:URL.createObjectURL(s),naturalSize:null,crop:[0,0,1,1]}));for(let s of this._tiles)as(s.file).then(n=>{t!==this._tileGeneration||!n||(s.naturalSize=n,s.crop=os(n),this.requestUpdate())})}_removeTile(e){let t=this._tiles.find(s=>s.id===e);t&&URL.revokeObjectURL(t.objectUrl),this._tiles=this._tiles.filter(s=>s.id!==e)}_onCropChanged(e,t){let s=this._tiles.find(n=>n.id===e);s&&(s.crop=t),this.requestUpdate()}_startUpload(){let e=this.hass,t=this.entryId,s=this.cat;if(!e||!t||!s||this._tiles.length===0||this._queue)return;let n=this._tiles,o=new ds({compress:a=>ls(n.find(l=>l.id===a).file,n.find(l=>l.id===a).crop),upload:async(a,l,u)=>{let h=n.find(f=>f.id===a),d=await Hd(e,t,s,l,cs(h.file,l),u);return{status:d.status,message:d.message}}},()=>{this._queueTick++},2);o.enqueue(n.map(a=>a.id)),o.start(),this._queue=o,this._queueTick++}_requestClose(){this._queue?.cancelPending(),this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}render(){if(!this.open)return p;let e=this._adjustingId?this._tiles.find(t=>t.id===this._adjustingId):void 0;return c`
      <div class="backdrop" role="dialog" aria-modal="true" aria-label="Add photos">
        <div class="sheet">
          <header>
            <span class="title">Add photos${this.cat?c` of ${this.cat}`:p}</span>
            <button type="button" class="close" ${P(this._closeButtonRef)} @click=${()=>this._requestClose()} aria-label="Close">${y("close")}</button>
          </header>
          ${this._tiles.length===0?c`<p class="empty">No photos chosen.</p>`:c`<div class="grid">${this._tiles.map(t=>this._renderTile(t))}</div>`}
          ${this._renderFooter()}
        </div>
        ${e?this._renderAdjust(e):p}
      </div>
    `}_renderTile(e){let t=this._queue?.get(e.id)?.status,s=this._queue?.get(e.id)?.message??null;return c`
      <div class="tile">
        <button type="button" class="tile-photo" aria-label="Adjust crop" ?disabled=${!!this._queue} @click=${()=>{this._adjustingId=e.id}}>
          <kibble-crop-editor .imageUrl=${e.objectUrl} .naturalWidth=${e.naturalSize?.width??0} .naturalHeight=${e.naturalSize?.height??0} .crop=${e.crop} .interactive=${!1}></kibble-crop-editor>
        </button>
        ${this._queue?p:c`<button type="button" class="remove" aria-label="Remove this photo" @click=${()=>this._removeTile(e.id)}>${"\xD7"}</button>`}
        ${t?this._renderTileStatus(e.id,t,s):p}
      </div>
    `}_renderTileStatus(e,t,s){return t==="queued"?p:t==="compressing"||t==="uploading"?c`<span class="tile-badge busy" aria-label="Uploading">${y("refresh")}</span>`:t==="added"?c`<span class="tile-badge added" aria-label="Added">${y("check")}</span>`:t==="duplicate"?c`<span class="tile-badge muted">Duplicate</span>`:t==="no_cat"?c`<span class="tile-badge muted">Not a cat</span>`:t==="canceled"?c`<span class="tile-badge muted">Canceled</span>`:c`
      <span class="tile-badge error" title=${s??"Couldn't upload this photo."}>
        Failed
        <button type="button" @click=${()=>this._queue?.retry(e)}>Retry</button>
      </span>
    `}_renderFooter(){let e=this._queue;if(e&&e.allSettled)return c`
        <div class="footer">
          <p class="tally">${this._tallyPhrase(e.tally())}</p>
          <button type="button" class="primary" @click=${()=>this._requestClose()}>Done</button>
        </div>
      `;if(e){let t=this._tiles.filter(s=>e.get(s.id)?.status!=="queued"&&e.get(s.id)?.status!=="compressing"&&e.get(s.id)?.status!=="uploading").length;return c`<div class="footer"><p class="progress">Adding ${t} of ${this._tiles.length}\u2026</p></div>`}return c`
      <div class="footer">
        <button type="button" class="primary" ?disabled=${this._tiles.length===0} @click=${()=>this._startUpload()}>Add ${this._tiles.length} photo${this._tiles.length===1?"":"s"}</button>
      </div>
    `}_tallyPhrase(e){let t=[];return e.added&&t.push(`${e.added} added`),e.duplicate&&t.push(`${e.duplicate} duplicate${e.duplicate===1?"":"s"}`),e.no_cat&&t.push(`${e.no_cat} not a cat`),e.error&&t.push(`${e.error} failed`),e.canceled&&t.push(`${e.canceled} canceled`),t.length>0?t.join(" \xB7 "):"Nothing added."}_renderAdjust(e){return c`
      <div class="adjust">
        <div class="adjust-stage">
          <kibble-crop-editor
            .imageUrl=${e.objectUrl}
            .naturalWidth=${e.naturalSize?.width??0}
            .naturalHeight=${e.naturalSize?.height??0}
            .crop=${e.crop}
            .fitParent=${!0}
            @crop-changed=${t=>this._onCropChanged(e.id,t.detail.crop)}
          ></kibble-crop-editor>
        </div>
        <button type="button" class="adjust-done" @click=${()=>{this._adjustingId=null}}>Done</button>
      </div>
    `}static{this.styles=w`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
      --kibble-text-title: 16px;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
    }
    .sheet {
      width: 100%;
      max-width: 560px;
      max-height: min(88vh, 780px);
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
      padding-bottom: max(16px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      border-radius: 16px 16px 0 0;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      overflow-y: auto;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .title {
      font-size: var(--kibble-text-title);
      font-weight: 600;
    }
    .close {
      flex: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .empty {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: 10px;
    }
    .tile {
      position: relative;
    }
    .tile-photo {
      display: block;
      width: 100%;
      padding: 0;
      border: none;
      background: none;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
    }
    .tile-photo:disabled {
      cursor: default;
    }
    .remove {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: none;
      background: #222;
      color: #fff;
      font-size: 13px;
      line-height: 1;
      cursor: pointer;
    }
    .tile-badge {
      position: absolute;
      left: 6px;
      bottom: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
    }
    .tile-badge.added {
      background: var(--kibble-feed, #43a96a);
    }
    .tile-badge.error {
      background: var(--error-color, #db4437);
      gap: 6px;
    }
    .tile-badge.error button {
      border: none;
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
      border-radius: 999px;
      padding: 1px 8px;
      font: inherit;
      font-size: 10px;
      cursor: pointer;
    }
    @media (prefers-reduced-motion: no-preference) {
      .tile-badge.busy svg {
        animation: kibble-add-photos-spin 0.9s linear infinite;
      }
    }
    @keyframes kibble-add-photos-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .footer {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .primary {
      min-height: 44px;
      border-radius: 10px;
      border: none;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      font: inherit;
      font-weight: 700;
      font-size: var(--kibble-text-body);
      cursor: pointer;
    }
    .primary:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .progress,
    .tally {
      margin: 0;
      text-align: center;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .adjust {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.94);
    }
    .adjust-stage {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .adjust-stage kibble-crop-editor {
      max-width: 100%;
      max-height: 100%;
    }
    .adjust-done {
      align-self: center;
      min-height: 44px;
      padding: 0 28px;
      border-radius: 999px;
      border: none;
      background: #fff;
      color: #111;
      font: inherit;
      font-weight: 700;
      font-size: var(--kibble-text-body);
      cursor: pointer;
    }
    .close:focus-visible,
    .tile-photo:focus-visible,
    .remove:focus-visible,
    .primary:focus-visible,
    .adjust-done:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `}};customElements.define("kibble-add-photos-sheet",Eo);var To=24,Om=["button:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),Po=class extends v{constructor(){super();this._trainingFeed=new vt("kibble/training",()=>this.requestUpdate());this._uploadObjectUrl="";this._uploadGeneration=0;this._closeButtonRef=T();this._fileInputRef=T();this._keydownHandler=e=>{if(!this.open)return;if(e.key==="Escape"){e.preventDefault(),this._uploadFile?this._cancelUpload():this._requestClose();return}if(e.key!=="Tab")return;let t=[...this.renderRoot.querySelectorAll(Om)];if(t.length===0)return;let s=this.renderRoot.querySelector(":focus"),n=s?t.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=t.length)&&(e.preventDefault(),(e.shiftKey?t[t.length-1]:t[0])?.focus())};this.open=!1,this.cat=null,this._uploadFile=null,this._uploadNaturalSize=null,this._uploadCrop=[0,0,1,1],this._busy=!1,this._error=null}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},entryId:{type:String},cache:{attribute:!1},cat:{attribute:!1},_uploadFile:{state:!0},_uploadNaturalSize:{state:!0},_uploadCrop:{attribute:!1},_busy:{state:!0},_error:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),this._trainingFeed.dispose(),this._cancelUpload()}willUpdate(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus(),e.has("open")&&!this.open&&(this._cancelUpload(),this._error=null);let t=this.hass,s=this.entryId,n=this.cat;this.open&&t?.callWS&&s&&n&&this._trainingFeed.sync(t,`${s}:${n.name}`,this._feedParams(),To)}_feedParams(){return{entry_id:this.entryId,cat:this.cat?.name}}_requestClose(){this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}_emitChanged(e,t){let s=this.cat;s&&this.dispatchEvent(new CustomEvent("avatar-changed",{detail:{cat:s.name,avatar:e,avatarCustom:t},bubbles:!0,composed:!0}))}async _chooseExisting(e){let t=this.hass,s=this.entryId,n=this.cat;if(!(!t?.callWS||!s||!n||!e||this._busy)){this._busy=!0,this._error=null;try{let o=await t.callWS({type:"kibble/cats/avatar/set",entry_id:s,cat:n.name,asset_id:e.id});this._emitChanged(o.avatar,!0),this._requestClose()}catch(o){this._error=q(o)}finally{this._busy=!1}}}async _onReset(){let e=this.hass,t=this.entryId,s=this.cat;if(!(!e?.callWS||!t||!s||this._busy)){this._busy=!0,this._error=null;try{let n=await e.callWS({type:"kibble/cats/avatar/clear",entry_id:t,cat:s.name});this._emitChanged(n.avatar,!1),this._requestClose()}catch(n){this._error=q(n)}finally{this._busy=!1}}}_onFileChosen(e){let t=e.target,s=t.files?.[0]??null;if(t.value="",!s)return;this._uploadFile=s,this._uploadObjectUrl=URL.createObjectURL(s),this._uploadNaturalSize=null,this._uploadCrop=[0,0,1,1];let n=++this._uploadGeneration;as(s).then(o=>{n!==this._uploadGeneration||!o||(this._uploadNaturalSize=o,this._uploadCrop=os(o))})}_cancelUpload(){this._uploadObjectUrl&&URL.revokeObjectURL(this._uploadObjectUrl),this._uploadObjectUrl="",this._uploadFile=null,this._uploadNaturalSize=null}async _confirmUpload(){let e=this.hass,t=this.entryId,s=this.cat,n=this._uploadFile;if(!(!e||!t||!s||!n||this._busy)){this._busy=!0,this._error=null;try{let o=await ls(n,this._uploadCrop),a=await Od(e,t,s.name,o,cs(n,o),new AbortController().signal);if(a.error||!a.avatar){this._error=a.error??"Couldn't save that photo.";return}this._emitChanged(a.avatar,!0),this._requestClose()}catch(o){this._error=o instanceof Error?o.message:"Couldn't save that photo."}finally{this._busy=!1}}}render(){let e=this.cat;return!this.open||!e?p:c`
      <div class="backdrop" role="dialog" aria-modal="true" aria-label=${`Change ${e.name}'s picture`}>
        <div class="sheet">
          <header>
            <span class="title">Change picture</span>
            <button type="button" class="close" ${P(this._closeButtonRef)} @click=${()=>this._requestClose()} aria-label="Close">${y("close")}</button>
          </header>
          ${this._uploadFile?this._renderUploadAdjust():this._renderGrid(e)}
          ${this._error?c`<p class="error">${this._error}</p>`:p}
        </div>
      </div>
    `}_renderGrid(e){let t=this._trainingFeed.state;return c`
      <input type="file" accept="image/*" hidden ${P(this._fileInputRef)} @change=${s=>this._onFileChosen(s)} />
      <div class="grid">
        <button type="button" class="tile upload-tile" ?disabled=${this._busy} @click=${()=>this._fileInputRef.value?.click()}>Upload</button>
        ${(t.items??[]).map(s=>this._renderSampleTile(e,s))}
      </div>
      ${t.error?c`<p class="error">${t.error}</p>`:p}
      ${t.items&&t.items.length===0?c`<p class="empty">No training photos yet -- upload one instead.</p>`:p}
      ${this._renderPager(t)}
      ${e.avatar_custom?c`<button type="button" class="reset" ?disabled=${this._busy} @click=${()=>this._onReset()}>Reset to automatic</button>`:p}
    `}_renderSampleTile(e,t){let s=t.body??t.face,n=!!(s&&e.avatar?.id===s.id);return c`
      <button type="button" class="tile photo-tile ${n?"current":""}" ?disabled=${this._busy||!s} aria-label="Use this photo" @click=${()=>this._chooseExisting(s)}>
        ${s?c`<kibble-image .hass=${this.hass} .asset=${s} .cache=${this.cache} alt=""></kibble-image>`:p}
      </button>
    `}_renderPager(e){return e.items===null||!e.hasNext&&!e.hasPrevious?p:c`
      <div class="pager">
        <button type="button" ?disabled=${!e.hasPrevious||e.loading} @click=${()=>this._trainingFeed.previous(this.hass,this._feedParams(),To)}>Previous</button>
        <button type="button" ?disabled=${!e.hasNext||e.loading} @click=${()=>this._trainingFeed.next(this.hass,this._feedParams(),To)}>Next</button>
      </div>
    `}_renderUploadAdjust(){let e=this._uploadNaturalSize;return c`
      <div class="adjust">
        <div class="adjust-stage">
          <kibble-crop-editor
            .imageUrl=${this._uploadObjectUrl}
            .naturalWidth=${e?.width??0}
            .naturalHeight=${e?.height??0}
            .crop=${this._uploadCrop}
            .circleGuide=${!0}
            .fitParent=${!0}
            @crop-changed=${t=>{this._uploadCrop=t.detail.crop}}
          ></kibble-crop-editor>
        </div>
        <div class="adjust-actions">
          <button type="button" class="secondary" ?disabled=${this._busy} @click=${()=>this._cancelUpload()}>Back</button>
          <button type="button" class="primary" ?disabled=${this._busy} @click=${()=>this._confirmUpload()}>Use this photo</button>
        </div>
      </div>
    `}static{this.styles=w`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
      --kibble-text-title: 16px;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
    }
    .sheet {
      width: 100%;
      max-width: 560px;
      max-height: min(88vh, 780px);
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
      padding-bottom: max(16px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      border-radius: 16px 16px 0 0;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      overflow-y: auto;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .title {
      font-size: var(--kibble-text-title);
      font-weight: 600;
    }
    .close {
      flex: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
      gap: 10px;
    }
    .tile {
      aspect-ratio: 1;
      padding: 0;
      border: none;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
    }
    .tile:disabled {
      cursor: default;
      opacity: 0.6;
    }
    .photo-tile {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      box-sizing: border-box;
      border: 2px solid transparent;
    }
    .photo-tile.current {
      border-color: var(--kibble-feed, #43a96a);
    }
    .upload-tile {
      border: 2px dashed var(--divider-color);
      background: none;
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
    }
    .empty {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .pager button {
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 0 14px;
      min-height: 36px;
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .pager button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .reset {
      align-self: center;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: var(--kibble-text-caption);
      text-decoration: underline;
      cursor: pointer;
      min-height: 32px;
    }
    .reset:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .error {
      margin: 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: var(--kibble-text-caption);
    }
    .adjust {
      display: flex;
      flex-direction: column;
      gap: 14px;
      height: min(70vh, 420px);
    }
    .adjust-stage {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .adjust-stage kibble-crop-editor {
      max-width: 320px;
      max-height: 100%;
    }
    .adjust-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .primary,
    .secondary {
      min-height: 44px;
      padding: 0 22px;
      border-radius: 10px;
      border: none;
      font: inherit;
      font-weight: 700;
      font-size: var(--kibble-text-body);
      cursor: pointer;
    }
    .primary {
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .secondary {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
    }
    .primary:disabled,
    .secondary:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .close:focus-visible,
    .tile:focus-visible,
    .reset:focus-visible,
    .pager button:focus-visible,
    .primary:focus-visible,
    .secondary:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `}};customElements.define("kibble-avatar-picker",Po);var Im=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}}],Dm={device_id:"Kibble device",name:"Name (optional)"},Ao=class extends v{constructor(){super(...arguments);this._computeLabel=e=>Dm[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${Im}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():p}_renderFallback(){let e=Object.values(this.hass?.entities??{}),t=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return c`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${t.map(s=>c`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
          </select>
        </label>
        <label>
          <span>Name (optional)</span>
          <input
            type="text"
            .value=${this._config?.name??""}
            @change=${s=>this._updateName(s.target.value)}
          />
        </label>
      </div>
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=w`
    .fallback {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    select,
    input {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
    }
  `}};customElements.define("kibble-cats-card-editor",Ao);var Fm={deviceId:"",catPresence:[]},Ti=24,yt=24,zm=3e3,Id={learning:"Learning",paused:"Paused",learned:"Learned"},Ro=class extends v{constructor(){super();this._entities=Fm;this._catsQuery=new te(()=>this.requestUpdate());this._reviewFeed=new vt("kibble/review",()=>this.requestUpdate());this._trainingFeeds=new Map;this._imageCache=new ge;this._detailGeneration=0;this._sheetTrigger=null;this._sheetReviewedEvents=new Map;this._sheetPhotoUids=new Set;this._onCatMenuFocusOut=e=>{let t=e.currentTarget,s=e.relatedTarget;(!s||!t.contains(s))&&this._closeCatMenu()};this._onCatMenuKeydown=e=>{if(e.key!=="Escape")return;let t=e.currentTarget.querySelector(".cat-menu-trigger");this._closeCatMenu(),t?.focus()};this._onAvatarChanged=e=>{let{cat:t,avatar:s,avatarCustom:n}=e.detail;this._catsQuery.patch(o=>({...o,cats:o.cats.map(a=>a.name===t?{...a,avatar:s,avatar_custom:n}:a)}))};this._toggleSelectMode=()=>{this._reviewSelectMode=!this._reviewSelectMode,this._reviewSelected=new Set};this._onEventRequested=e=>{this._loadEventDetail(e.detail.uid)};this._onSamplesRetryRequested=()=>{let e=this._sheetSummary?.uid;e&&this._loadEventDetail(e)};this._closeSheet=()=>{let e=this.hass?.locale?.language??this.hass?.language,t=is({events:[...this._sheetReviewedEvents.values()],photosUpdated:this._sheetPhotoUids.size},e);this._sheetSummary=null,this._sheetGroup=[],this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._sheetSamplesFailed=!1,this._sheetSampleBusyUid=null,this._sheetError=null,this._sheetReviewedEvents=new Map,this._sheetPhotoUids=new Set,this._sheetTrigger?.focus(),this._sheetTrigger=null,t&&this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:t},bubbles:!0,composed:!0}))};this._onSessionLabelRequested=e=>{let t=this._entryId,s=this.hass;if(!t||!s?.callWS)return;let{uid:n,cats:o,verdict:a,subjects:l,closeOnSuccess:u}=e.detail,h={uid:n,...o?{cats:o}:{},...a?{verdict:a}:{},...l?.length?{subjects:l}:{}};this._sheetBusy=!0,this._sheetError=null,ss(s,t,h).then(d=>{this._sheetBusy=!1,this._sheetSummary=d.event,this._sheetSamples=d.samples,this._sheetSceneSubjects=d.scene_subjects,this._sheetSessionCats=d.cats,this._sheetMultipleCats=d.multiple_cats,this._sheetSamplesFailed=!1,this._reviewFeed.removeItem(f=>f.uid===h.uid||f.uid===d.event.uid);for(let f of this._sheetReviewedEvents.keys())(f===d.event.uid||f.startsWith(d.event.uid+":"))&&this._sheetReviewedEvents.delete(f);if(h.verdict)this._sheetReviewedEvents.set(d.event.uid,{uid:d.event.uid,event:d.event,label:h.verdict});else for(let f of h.cats??[]){let m=d.event.uid+":"+f.cat;this._sheetReviewedEvents.set(m,{uid:m,event:{kind:f.ate?"eat":"visit",open:d.event.open,start:d.event.start},label:f.cat})}this._refreshCats(),u?this._closeSheet():this.requestUpdate()}).catch(d=>{this._sheetBusy=!1,this._sheetError=d instanceof Error?d.message:"Couldn't save this label.",this.requestUpdate()})};this._onSampleLabelRequested=e=>{let t=this._entryId,s=this.hass;if(!t||!s?.callWS)return;let{sampleUid:n,label:o}=e.detail;this._sheetSampleBusyUid=n,this._sheetError=null,Xr(s,t,{sampleUid:n,label:o}).then(a=>{this._sheetSampleBusyUid=null,this._sheetSamples&&(this._sheetSamples=this._sheetSamples.map(u=>u.uid===a.uid?a:u)),this._sheetPhotoUids.add(n);let l=this._sheetSummary?.uid;l&&this._loadEventDetail(l,!0),this.requestUpdate()}).catch(a=>{this._sheetSampleBusyUid=null,this._sheetError=a instanceof Error?a.message:"Couldn't save this label.",this.requestUpdate()})};this._addName="",this._addBusy=!1,this._addError=null,this._actionError=null,this._openMenuFor=null,this._deleteConfirmFor=null,this._expandedTraining=null,this._reviewSelectMode=!1,this._reviewSelected=new Set,this._bulkBusy=!1,this._sheetSummary=null,this._sheetGroup=[],this._sheetSamples=null,this._sheetSamplesFailed=!1,this._sheetSampleBusyUid=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._sheetBusy=!1,this._sheetError=null,this._addPhotosOpen=!1,this._addPhotosCat=null,this._addPhotosFiles=[],this._avatarPickerCat=null}static{this.properties={hass:{attribute:!1},_config:{state:!0},_addName:{state:!0},_addBusy:{state:!0},_addError:{state:!0},_actionError:{state:!0},_openMenuFor:{state:!0},_deleteConfirmFor:{state:!0},_expandedTraining:{state:!0},_reviewSelectMode:{state:!0},_reviewSelected:{state:!0},_bulkBusy:{state:!0},_sheetSummary:{state:!0},_sheetGroup:{state:!0},_sheetSamples:{state:!0},_sheetSamplesFailed:{state:!0},_sheetSampleBusyUid:{state:!0},_sheetBusy:{state:!0},_sheetError:{state:!0},_sheetSceneSubjects:{state:!0},_sheetSessionCats:{state:!0},_sheetMultipleCats:{state:!0},_addPhotosOpen:{state:!0},_addPhotosCat:{state:!0},_addPhotosFiles:{state:!0},_avatarPickerCat:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Cats card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 8}static getStubConfig(e){return{type:"custom:kibble-cats-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-cats-card-editor")}disconnectedCallback(){super.disconnectedCallback(),this._imageCache.dispose(),this._reviewFeed.dispose();for(let e of this._trainingFeeds.values())e.dispose();clearTimeout(this._deleteConfirmTimer)}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=$t(this.hass.entities??{},e),this._entryId=Et(this.hass.devices??{},e));let t=this.hass?.callWS,s=this._entryId;if(this.hass&&s&&t&&(this._catsQuery.sync(s,()=>t({type:"kibble/cats",entry_id:s}).then(n=>n)),this._reviewFeed.sync(this.hass,s,{entry_id:s},Ti),this._expandedTraining)){let n=this._expandedTraining;this._trainingFeed(n).sync(this.hass,`${s}:${n}`,{entry_id:s,cat:n},yt)}}_trainingFeed(e){let t=this._trainingFeeds.get(e);return t||(t=new vt("kibble/training",()=>this.requestUpdate()),this._trainingFeeds.set(e,t)),t}render(){if(!this._config||!this.hass)return p;let e=this._catsQuery.state.data?.cats??[],t=this._catsQuery.state.data?.storage??null,s=t?Sd(t.device_spool):null;return c`
      <ha-card>
        <div class="container">
          ${this._config.name?c`<div class="label">${this._config.name}</div>`:p}
          ${this._actionError?this._renderActionError():p}
          <section class="roster">
            ${e.length===0?c`<p class="empty">No cats yet. Add one to start training.</p>`:c`<div class="cat-list">${e.map(n=>this._renderCatTile(n))}</div>`}
            ${this._renderAddCat()}
          </section>
          ${this._expandedTraining?this._renderTrainingPanel(this._expandedTraining):p}
          ${this._renderReview()}
          ${t?c`
                <p class="storage-line">
                  <span>${kd(t)}</span>
                  ${s?c`<span class="quiet">${s}</span>`:p}
                </p>
              `:p}
        </div>
      </ha-card>
      <kibble-label-sheet
        ?open=${this._sheetSummary!==null}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cache=${this._imageCache}
        .cats=${e}
        .summary=${this._sheetSummary}
        .samples=${this._sheetSamples}
        .sceneSubjects=${this._sheetSceneSubjects}
        .sessionCats=${this._sheetSessionCats}
        .multipleCats=${this._sheetMultipleCats}
        .samplesFailed=${this._sheetSamplesFailed}
        .group=${this._sheetGroup}
        .busy=${this._sheetBusy}
        .error=${this._sheetError}
        .sampleBusyUid=${this._sheetSampleBusyUid}
        @close-requested=${this._closeSheet}
        @session-label-requested=${this._onSessionLabelRequested}
        @sample-label-requested=${this._onSampleLabelRequested}
        @event-requested=${this._onEventRequested}
        @samples-retry-requested=${this._onSamplesRetryRequested}
      ></kibble-label-sheet>
      <input type="file" class="add-photos-file-input" multiple accept="image/*" hidden @change=${n=>this._onAddPhotosChosen(n)} />
      <kibble-add-photos-sheet
        ?open=${this._addPhotosOpen}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cat=${this._addPhotosCat??void 0}
        .files=${this._addPhotosFiles}
        @close-requested=${()=>this._closeAddPhotos()}
      ></kibble-add-photos-sheet>
      <kibble-avatar-picker
        ?open=${this._avatarPickerCat!==null}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cache=${this._imageCache}
        .cat=${e.find(n=>n.name===this._avatarPickerCat)??null}
        @close-requested=${()=>this._closeAvatarPicker()}
        @avatar-changed=${this._onAvatarChanged}
      ></kibble-avatar-picker>
    `}_renderActionError(){let e=this._actionError;return e?c`
      <div class="error">
        <span>${e.message}</span>
        <button
          type="button"
          @click=${()=>{this._actionError=null,e.retry()}}
        >
          Try again
        </button>
      </div>
    `:p}_renderCatTile(e){let t=new Date,s=e.last_seen!=null?`Seen ${Tt(new Date(e.last_seen*1e3),t)}`:"Not seen yet",n=`${e.meals_today} ${e.meals_today===1?"meal":"meals"} today`,o=e.training.total===0?"Not trained yet":`${e.training.total} ${e.training.total===1?"photo":"photos"} trained`,a=this._config?.device_id,l=this.hass&&a?Cd(this.hass.entities??{},a,e.name):void 0,u=this.hass?$d(this.hass,l):null;return c`
      <div class="cat-tile">
        <kibble-avatar class=${e.present?"present":""} .hass=${this.hass} .name=${e.name} .colorIndex=${e.color} .asset=${e.avatar} .cache=${this._imageCache}></kibble-avatar>
        <div class="cat-text">
          <span class="cat-name">${e.name}</span>
          <span class="cat-meta">${s}, ${n}</span>
          <span class="cat-meta quiet">${o}</span>
          ${u?c`
                <div class="learning-row" aria-label=${`${u.percent}% recognized, ${Id[u.state]}`}>
                  <span class="learning-track"><span class="learning-fill" style="width:${u.percent}%"></span></span>
                  <span class="learning-percent">${u.percent}%</span>
                </div>
                <span class="learning-state">${Id[u.state]}</span>
              `:p}
        </div>
        <div class="cat-menu" @focusout=${this._onCatMenuFocusOut} @keydown=${this._onCatMenuKeydown}>
          <button
            type="button"
            class="cat-menu-trigger"
            aria-haspopup="menu"
            aria-label=${`Options for ${e.name}`}
            @click=${()=>this._toggleCatMenu(e.name)}
          >
            ${y("dotsVertical")}
          </button>
          ${this._openMenuFor===e.name?this._renderCatMenu(e):p}
        </div>
      </div>
    `}_renderCatMenu(e){let t=this._deleteConfirmFor===e.name,s=this._expandedTraining===e.name;return c`
      <div class="menu" role="menu">
        <button type="button" role="menuitem" @click=${()=>this._openAvatarPicker(e.name)}>Change picture</button>
        <button type="button" role="menuitem" @click=${()=>this._toggleTraining(e.name)}>${s?"Hide training photos":`View training (${e.training.total})`}</button>
        <button type="button" role="menuitem" class="danger ${t?"confirming":""}" @click=${()=>this._onDeleteCatClick(e.name)}>
          ${t?"Tap again to delete":"Delete cat\u2026"}
        </button>
      </div>
    `}_toggleCatMenu(e){this._openMenuFor=this._openMenuFor===e?null:e}_closeCatMenu(){this._openMenuFor=null,clearTimeout(this._deleteConfirmTimer),this._deleteConfirmFor=null}_toggleTraining(e){this._openMenuFor=null,this._expandedTraining=this._expandedTraining===e?null:e}_openAvatarPicker(e){this._openMenuFor=null,this._avatarPickerCat=e}_closeAvatarPicker(){this._avatarPickerCat=null,this._refreshCats()}_onDeleteCatClick(e){if(this._deleteConfirmFor===e){clearTimeout(this._deleteConfirmTimer),this._deleteConfirmFor=null,this._openMenuFor=null,this._deleteCat(e);return}this._deleteConfirmFor=e,this._deleteConfirmTimer=setTimeout(()=>{this._deleteConfirmFor=null,this.requestUpdate()},zm)}_deleteCat(e){let t=this._callWS("kibble/cats/delete",{name:e});t&&t.then(()=>{this._trainingFeeds.delete(e),this._expandedTraining===e&&(this._expandedTraining=null),this._refreshCats()}).catch(s=>{this._actionError={message:`Couldn't delete ${e}. ${q(s)}`,retry:()=>this._deleteCat(e)}})}_renderAddCat(){return c`
      <form class="add-cat" @submit=${this._onAddCatSubmit}>
        <input
          type="text"
          placeholder="Add a cat"
          aria-label="New cat's name"
          .value=${this._addName}
          ?disabled=${this._addBusy}
          @input=${e=>{this._addName=e.target.value}}
        />
        <button type="submit" ?disabled=${this._addBusy||!this._addName.trim()}>Add a cat</button>
        ${this._addError?c`<span class="inline-error">${this._addError}</span>`:p}
      </form>
    `}async _onAddCatSubmit(e){e.preventDefault();let t=this._addName.trim(),s=t?this._callWS("kibble/cats/add",{name:t}):null;if(s){this._addBusy=!0,this._addError=null;try{await s,this._addName="",this._refreshCats()}catch(n){this._addError=q(n)}finally{this._addBusy=!1}}}_renderTrainingPanel(e){let t=this._trainingFeed(e),s=t.state;return c`
      <section class="training">
        <div class="training-heading">
          <span>${e}\u2019s training photos${s.items!==null?` (${s.total})`:""}</span>
          <button type="button" class="icon-button" aria-label="Close training photos" @click=${()=>this._toggleTraining(e)}>${y("close")}</button>
        </div>
        <div class="training-actions">
          <button type="button" class="add-photos-button" @click=${()=>this._openAddPhotos(e)}>Add photos</button>
        </div>
        ${s.error?this._renderPagedError(s.error,()=>t.refresh(this.hass,{entry_id:this._entryId,cat:e},yt)):p}
        ${s.items&&s.items.length===0?c`<p class="empty">No training photos yet.</p>`:p}
        <div class="training-grid">${(s.items??[]).map(n=>this._renderTrainingTile(e,n))}</div>
        ${this._renderPager(s,yt,()=>t.previous(this.hass,{entry_id:this._entryId,cat:e},yt),()=>t.next(this.hass,{entry_id:this._entryId,cat:e},yt))}
      </section>
    `}_renderTrainingTile(e,t){let s=new Date(t.created*1e3).toLocaleDateString();return c`
      <div class="training-tile">
        <span class="training-crops">
          ${t.body?c`<kibble-image .hass=${this.hass} .asset=${t.body} .cache=${this._imageCache} alt=""></kibble-image>`:p}
          ${t.face?c`<kibble-image .hass=${this.hass} .asset=${t.face} .cache=${this._imageCache} alt=""></kibble-image>`:p}
        </span>
        <button type="button" class="remove" aria-label=${`Remove this training photo of ${e}, added ${s}`} @click=${()=>this._removeTraining(e,t.uid)}>
          ${"\xD7"}
        </button>
      </div>
    `}_removeTraining(e,t){let s=this._callWS("kibble/training/remove",{uids:[t]});s&&s.then(()=>{this._trainingFeed(e).refresh(this.hass,{entry_id:this._entryId,cat:e},yt),this._refreshCats()}).catch(n=>{this._actionError={message:`Couldn't remove this photo. ${q(n)}`,retry:()=>this._removeTraining(e,t)}})}_openAddPhotos(e){this._addPhotosCat=e,this.renderRoot.querySelector(".add-photos-file-input")?.click()}_onAddPhotosChosen(e){let t=e.target,s=t.files?[...t.files]:[];t.value="",s.length!==0&&(this._addPhotosFiles=s,this._addPhotosOpen=!0)}_closeAddPhotos(){this._addPhotosOpen=!1;let e=this._addPhotosCat;this._refreshCats(),e&&this._expandedTraining===e&&this._trainingFeed(e).refresh(this.hass,{entry_id:this._entryId,cat:e},yt)}_renderReview(){let e=this._reviewFeed.state,t=this._catsQuery.state.data?.cats??[],s=e.items!==null?e.total:null;return c`
      <section class="review">
        <div class="review-heading">
          <span>${s===null?"To review":s===0?"Nothing to review":s===1?"1 to review":`${s} to review`}</span>
          ${e.items&&e.items.length>0?c`<button type="button" class="select-toggle" @click=${this._toggleSelectMode}>${this._reviewSelectMode?"Cancel":"Select"}</button>`:p}
        </div>
        ${this._reviewSelectMode&&this._reviewSelected.size>0?this._renderBulkBar(t):p}
        ${e.error?this._renderPagedError(e.error,()=>this._reviewFeed.refresh(this.hass,{entry_id:this._entryId},Ti)):p}
        ${e.items&&e.items.length===0&&!e.error?c`<p class="empty">Nothing to review. New crops arrive when the feeder sees a cat it can't yet name.</p>`:c`<div class="review-grid" @keydown=${this._onReviewGridKeydown}>${(e.items??[]).map(n=>this._renderReviewTile(n))}</div>`}
        ${this._renderPager(e,Ti,()=>this._reviewFeed.previous(this.hass,{entry_id:this._entryId},Ti),()=>this._reviewFeed.next(this.hass,{entry_id:this._entryId},Ti))}
      </section>
    `}_renderReviewTile(e){let t=Zr(e),s=this._reviewSelected.has(e.uid),n=he(e.start),o=this._reviewSelectMode?`${s?"Deselect":"Select"}, captured ${n}`:`Review this one, captured ${n}`;return c`
      <div class="review-tile">
        <button type="button" class="review-thumb" aria-pressed=${this._reviewSelectMode?s:p} aria-label=${o} @click=${a=>this._onReviewTileClick(e,a.currentTarget)}>
          ${t?c`<kibble-image .hass=${this.hass} .asset=${t} .cache=${this._imageCache} alt=""></kibble-image>`:c`<span class="neutral-icon">${Ne()}</span>`}
          ${this._reviewSelectMode&&s?c`<span class="review-check">${y("check")}</span>`:p}
        </button>
        <span class="review-caption">${n}</span>
      </div>
    `}_onReviewGridKeydown(e){if(!["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(e.key))return;let s=[...e.currentTarget.querySelectorAll(".review-thumb")],n=this.renderRoot.querySelector(":focus"),o=n?s.indexOf(n):-1;if(o===-1)return;e.preventDefault();let a=e.key==="ArrowRight"||e.key==="ArrowDown"?1:-1;s[(o+a+s.length)%s.length]?.focus()}_onReviewTileClick(e,t){if(this._reviewSelectMode){let s=new Set(this._reviewSelected);s.has(e.uid)?s.delete(e.uid):s.add(e.uid),this._reviewSelected=s;return}this._openSheet(e,t)}_renderBulkBar(e){return c`
      <div class="bulk-bar">
        <span>${this._reviewSelected.size} selected</span>
        <div class="bulk-actions">
          ${e.map(t=>c`<button type="button" class="chip" ?disabled=${this._bulkBusy} @click=${()=>this._bulkLabel(t.name)}>${t.name}</button>`)}
          <button type="button" class="chip chip-muted" ?disabled=${this._bulkBusy} @click=${()=>this._bulkLabel("not_a_cat")}>Not a cat</button>
        </div>
      </div>
    `}_bulkLabel(e){let t=this.hass,s=this._entryId;if(!t?.callWS||!s||this._reviewSelected.size===0)return;let n=[...this._reviewSelected];this._bulkBusy=!0,wd(t,s,{uids:n,label:e}).then(()=>{this._bulkBusy=!1;let o=new Set(n);this._reviewFeed.removeItem(a=>o.has(a.uid)),this._reviewSelected=new Set,this._reviewSelectMode=!1,this._refreshCats()}).catch(o=>{this._bulkBusy=!1,this._actionError={message:`Couldn't label those. ${q(o)}`,retry:()=>this._bulkLabel(e)},this.requestUpdate()})}_renderPager(e,t,s,n){if(e.items===null||!e.hasNext&&!e.hasPrevious)return p;let o=e.pageIndex*t+1,a=e.pageIndex*t+e.items.length;return c`
      <div class="pager">
        <button type="button" ?disabled=${!e.hasPrevious||e.loading} @click=${s}>Previous</button>
        <span>${o}\u2013${a} of ${e.total}</span>
        <button type="button" ?disabled=${!e.hasNext||e.loading} @click=${n}>Next</button>
      </div>
    `}_renderPagedError(e,t){return c`
      <div class="error">
        <span>${e}</span>
        <button type="button" @click=${t}>Try again</button>
      </div>
    `}_loadEventDetail(e,t=!1){let s=this._sheetGroup.find(l=>l.uid===e);s&&(this._sheetSummary=s),t||(this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._sheetSamplesFailed=!1),this._sheetError=null;let n=++this._detailGeneration,o=this.hass?.callWS,a=this._entryId;if(!o||!a){this._sheetSamplesFailed=!t;return}o({type:"kibble/event",entry_id:a,uid:e}).then(l=>{if(n!==this._detailGeneration)return;let u=l;this._sheetSummary=u.event,this._sheetSamples=u.samples,this._sheetSceneSubjects=u.scene_subjects,this._sheetSessionCats=u.cats,this._sheetMultipleCats=u.multiple_cats,this._sheetSamplesFailed=!1,this.requestUpdate()}).catch(()=>{n===this._detailGeneration&&(t||(this._sheetSamplesFailed=!0),this.requestUpdate())})}_openSheet(e,t){this._sheetTrigger=t,this._sheetGroup=[e],this._sheetReviewedEvents=new Map,this._sheetPhotoUids=new Set,this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._loadEventDetail(e.uid)}_refreshCats(){let e=this.hass?.callWS,t=this._entryId;!e||!t||this._catsQuery.refresh(()=>e({type:"kibble/cats",entry_id:t}).then(s=>s))}_callWS(e,t){let s=this.hass?.callWS,n=this._entryId;return!s||!n?null:s({type:e,entry_id:n,...t}).then(o=>o)}static{this.styles=w`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
      --kibble-text-title: 16px;
    }
    ha-card {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
      overflow: hidden;
    }
    .container {
      container-type: inline-size;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .label {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .empty {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: var(--kibble-text-body);
    }
    .error button,
    .inline-error {
      font-size: var(--kibble-text-caption);
    }
    .error button {
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font: inherit;
      cursor: pointer;
      min-height: 36px;
    }
    .roster {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cat-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .cat-tile {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    kibble-avatar {
      --kibble-avatar-size: 44px;
    }
    kibble-avatar.present {
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--primary-color, #03a9f4);
    }
    .cat-text {
      display: flex;
      flex-direction: column;
      line-height: 1.35;
    }
    .cat-name {
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .cat-meta {
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .cat-meta.quiet {
      opacity: 0.85;
    }
    .learning-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 2px;
    }
    .learning-track {
      flex: 1 1 auto;
      max-width: 96px;
      height: 4px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      overflow: hidden;
    }
    .learning-fill {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--kibble-feed, #43a96a);
    }
    .learning-percent {
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .learning-state {
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .cat-menu {
      position: relative;
      margin-left: auto;
    }
    .cat-menu-trigger {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
    }
    .cat-menu-trigger:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .menu {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 5;
      margin-top: 4px;
      min-width: 180px;
      display: flex;
      flex-direction: column;
      padding: 6px;
      border-radius: 10px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      box-shadow: var(--ha-card-box-shadow, 0 4px 16px rgba(0, 0, 0, 0.25));
    }
    .menu button {
      border: none;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-size: var(--kibble-text-body);
      text-align: left;
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
      min-height: 40px;
    }
    .menu button:hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .menu .danger {
      color: var(--error-color, #db4437);
    }
    .menu .danger.confirming {
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
    }
    .cat-menu-trigger:focus-visible,
    .menu button:focus-visible,
    .icon-button:focus-visible,
    .select-toggle:focus-visible,
    .review-thumb:focus-visible,
    .chip:focus-visible,
    .pager button:focus-visible,
    .remove:focus-visible,
    .add-photos-button:focus-visible,
    .add-cat button:focus-visible,
    .add-cat input:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .add-cat {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .add-cat input {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
      font-size: var(--kibble-text-body);
    }
    .add-cat button {
      min-height: 40px;
      border-radius: 8px;
      border: none;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      padding: 0 14px;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .add-cat button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .inline-error {
      color: var(--error-color, #db4437);
    }
    .training {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 4px;
      border-top: 1px solid var(--divider-color);
    }
    .training-heading,
    .review-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .training-actions {
      display: flex;
    }
    .add-photos-button {
      min-height: 40px;
      padding: 0 16px;
      border-radius: 8px;
      border: none;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .icon-button {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .training-grid,
    .review-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
      gap: 10px;
    }
    .training-tile {
      position: relative;
    }
    .training-crops {
      display: flex;
      gap: 2px;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .remove {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      background: #222;
      color: #fff;
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
    }
    .review {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .select-toggle {
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 0 14px;
      min-height: 32px;
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .bulk-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      padding: 8px 10px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 10%, transparent);
      font-size: var(--kibble-text-caption);
      color: var(--primary-text-color);
    }
    .bulk-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip {
      border: none;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: 13px;
      font-weight: 600;
      padding: 0 14px;
      min-height: 32px;
      cursor: pointer;
    }
    .chip.chip-muted {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .chip:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .review-tile {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .review-thumb {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      border: none;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      padding: 0;
      cursor: pointer;
      overflow: hidden;
    }
    .neutral-icon {
      display: block;
      width: 62%;
      height: 62%;
      margin: 19% auto;
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .review-check {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--kibble-feed, #43a96a);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }
    .review-caption {
      font-size: 11px;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .pager button {
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 0 14px;
      min-height: 36px;
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .pager button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .storage-line {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .storage-line .quiet {
      opacity: 0.75;
    }
    @container (max-width: 360px) {
      .training-grid,
      .review-grid {
        grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
      }
    }
  `}};customElements.define("kibble-cats-card",Ro);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-cats-card",name:"Kibble Cats",description:"Enrolled cats, presence, and the review queue for whatever the feeder couldn't name.",preview:!0});var Bm={deviceId:"",catPresence:[]},Dd=[1,2,3,4,5],Nm=Dd.map(i=>({value:String(i),label:String(i)})),Um=`
  .bubble-button-card-container { background: var(--kibble-feed, #43a96a) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: var(--kibble-ink-on-amber, #241a07) !important; }
  .bubble-icon-container { background: color-mix(in srgb, var(--kibble-ink-on-amber, #241a07) 12%, transparent) !important; }
`;function qm(i,r){return`
  .bubble-button-card-container { height: var(--kibble-touch-target, 48px) !important; ${i?"background: var(--kibble-feed, #43a96a) !important;":""} ${r?"opacity: 0.5;":""} }
  .bubble-button-card { padding: 0 !important; }
  .bubble-name-container { margin: 0 !important; width: 100%; justify-content: center; }
  .bubble-name { width: 100%; justify-content: center; text-align: center; font-size: 17px; font-weight: 600; ${i?"color: var(--kibble-ink-on-amber, #241a07) !important;":""} }
`}var Vm=`
  .bubble-button-card-container { background: var(--error-color, #d9534f) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: #fff !important; }
`,Mo=class extends v{constructor(){super();this._entities=Bm;this._wasFeedingForRequest=!1;this._timelineGeneration=0;this._timelineQuery=new te(()=>this.requestUpdate());this._imageCache=new ge;this._catsQuery=new te(()=>this.requestUpdate());this._calibrationQuery=new te(()=>this.requestUpdate());this._calibrationGeneration=0;this._calibrationOpen=!1;this._detectionAreasOpen=!1;this._hopperSheetOpen=!1;this._onBubbleAction=e=>{let t=e.detail,s=t?.config?.[`${t.action}_action`];s?.action!=="fire-dom-event"||!s.kibble||(e.stopPropagation(),s.kibble==="portion"&&typeof s.portion=="number"&&this._entities.feedAmount?this.hass.callService("number","set_value",{value:s.portion},{entity_id:this._entities.feedAmount}):s.kibble==="feed"?this._onFeedActivate():s.kibble==="cancel"?this._onCancelActivate():s.kibble==="calibrate"&&(this._calibrationOpen=!0))};this._onHopper1PortionSelected=e=>{this._setHopperPortion(this._entities.feedAmountHopper1,e)};this._onHopper2PortionSelected=e=>{this._setHopperPortion(this._entities.feedAmountHopper2,e)};this._onFeedActivate=async()=>{if(!this._entities.deviceId||this._feedRequest.phase==="requesting")return;let t=this._singleHopper()?{hopper:"both",amount:this._numberState(this._entities.feedAmount)??1}:Ia(this._numberState(this._entities.feedAmountHopper1)??0,this._numberState(this._entities.feedAmountHopper2)??0);if(t){this._clearFeedRequestTimeoutTimer(),this._clearFeedErrorTimer(),this._feedError=null,this._feedRequest=Fa(),this._armFeedRequestTimeout(),this._pourSource=t.hopper;try{await this.hass.callService("kibble","feed",{device_id:this._entities.deviceId,hopper:t.hopper,amount:t.amount,...t.amount2!==void 0?{amount2:t.amount2}:{}})}catch{this._clearFeedRequestTimeoutTimer(),this._feedRequest=Ls(),this._pourSource=null,this._feedError="Try hold again",this._resetFeedErrorAfter(5e3)}}};this._onCancelActivate=()=>{this._entities.deviceId&&this.hass.callService("kibble","cancel_feed",{device_id:this._entities.deviceId})};this._openSettings=()=>{this._notifyHeroActivity();let e=this._config?.settings_hash;if(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}));return}this._settingsOpen=!0};this._notifyHeroActivity=()=>{this.renderRoot.querySelector("kibble-live-hero")?.notifyActivity()};this._onHeroOverlayIdleChanged=e=>{this._heroControlsVisible=e.detail.visible};this._onMediaAspectChanged=e=>{let t=e.detail?.ratio;!Number.isFinite(t)||t<=0||this.renderRoot.querySelector(".hero")?.style.setProperty("--kibble-hero-aspect",String(t))};this._closeSettings=()=>{this._settingsOpen=!1};this._onHashChange=()=>{let e=Ms(window.location.hash,this._config);e==="calibrate"&&(this._calibrationOpen=!0),e==="detection-areas"&&(this._detectionAreasOpen=!0)};this._closeCalibration=e=>{e.stopPropagation(),this._calibrationOpen=!1,this._clearPopupHash()};this._closeDetectionAreas=e=>{e.stopPropagation(),this._detectionAreasOpen=!1,this._clearPopupHash()};this._openHopperSheet=()=>{this._hopperSheetOpen=!0};this._closeHopperSheet=e=>{e.stopPropagation(),this._hopperSheetOpen=!1};this._onCalibrationChanged=()=>{this._calibrationGeneration+=1,this.requestUpdate()};this._settingsOpen=!1,this._bubble=!1,this._feedRequest=tr,this._feedError=null,this._pourSource=null,this._heroControlsVisible=!0,rd().then(e=>{this._bubble=e})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_settingsOpen:{state:!0},_calibrationOpen:{state:!0},_detectionAreasOpen:{state:!0},_hopperSheetOpen:{state:!0},_bubble:{state:!0},_feedRequest:{state:!0},_feedError:{state:!0},_pourSource:{state:!0},_heroControlsVisible:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-card-editor")}connectedCallback(){super.connectedCallback(),window.addEventListener("hashchange",this._onHashChange),window.addEventListener("location-changed",this._onHashChange),this._onHashChange(),this._resizeObserver=new ResizeObserver(e=>{let t=e[0]?.contentRect,s=t?.height??this.getBoundingClientRect().height,n=t?.width??this.getBoundingClientRect().width;this.classList.toggle("kiosk",s>=440),this.classList.toggle("compact",n<640&&s>0&&s<=520)}),this._resizeObserver.observe(this)}disconnectedCallback(){window.removeEventListener("hashchange",this._onHashChange),window.removeEventListener("location-changed",this._onHashChange),this._clearFeedRequestTimeoutTimer(),this._clearFeedErrorTimer(),super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._imageCache.dispose()}willUpdate(){let e=this._config?.device_id;this.classList.toggle("dual-hopper",this.hass?!this._singleHopper():!1),this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=$t(this.hass.entities??{},e),this._entryId=Et(this.hass.devices??{},e));let t=this.hass?.callWS;if(this.hass&&this._entryId&&t&&this._entities.lastSeenPet){let s=this._entryId;this._catsQuery.sync(oa(this.hass,[this._entities.lastSeenPet]),()=>t({type:"kibble/cats",entry_id:s}).then(n=>n))}if(this.hass&&this._entryId&&t&&this._entities.bowlFill){let s=this._entryId;this._calibrationQuery.sync(`${s}:${this._calibrationGeneration}`,()=>t({type:"kibble/calibration",entry_id:s}).then(n=>n))}if(this.hass&&this._entities.feeding){let s=this.hass.states[this._entities.feeding]?.state==="on";s!==this._wasFeedingForRequest&&(this._wasFeedingForRequest=s,this._feedRequest=ja(this._feedRequest,s),s?(this._clearFeedRequestTimeoutTimer(),this._feedError=null):this._pourSource=null,this._timelineGeneration+=1)}if(this.hass&&this._entryId&&t){let s=this._entryId;this._timelineQuery.sync(`${s}:${this._timelineGeneration}`,()=>t({type:"kibble/timeline",entry_id:s,limit:5}).then(n=>n))}}render(){if(!this._config||!this.hass)return p;let e=this._entities,t=e.feeding?this.hass.states[e.feeding]?.state:void 0,n=[e.feeding,e.bowlFill,e.schedule].filter(oe=>!!oe).map(oe=>this.hass.states[oe]?.state),o=sa(n,t),a=t==="on",l=this._numberState(e.bowlFill),u=e.bowlFill?this.hass.states[e.bowlFill]?.attributes?.source??null:null,h=Sa(this._calibrationQuery.state.data),d=$s(e.hopperLevel1&&this.hass.states[e.hopperLevel1]?.state),f=$s(e.hopperLevel2&&this.hass.states[e.hopperLevel2]?.state),m=e.hopperRemaining1?Es(this.hass.states[e.hopperRemaining1]):null,b=e.hopperRemaining2?Es(this.hass.states[e.hopperRemaining2]):null,_=this._singleHopper(),g=e.hopperFood1?Ts(this.hass.states[e.hopperFood1]):null,C=e.hopperFood2?Ts(this.hass.states[e.hopperFood2]):null,R=this._scheduleEntries(),z=this._numberState(e.feedAmount)??1,M=this._numberState(e.feedAmountHopper1)??0,V=this._numberState(e.feedAmountHopper2)??0,K=_?z:M+V,x=this._heroOverlay(o),E=this._feedError??(this._feedRequest.phase==="requesting"?"Requesting\u2026":"Hold to feed"),H=a?"Feeding":E,B=!_&&M===0&&V===0,j=o==="unreachable"||!a&&this._feedRequest.phase==="requesting"||B,xt=!a&&this._feedRequest.phase==="requesting",se=this.hass.themes?.darkMode===!0,ne=Da(this._timelineQuery.state.data?.items??[],_);return c`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">
                <kibble-live-hero
                  .hass=${this.hass}
                  .cats=${this._catsQuery.state.data?.cats??[]}
                  .cache=${this._imageCache}
                  .cameraEntity=${e.camera}
                  .scryptedId=${this._config.scrypted_id}
                  .entryId=${this._entryId}
                  .overlayEntity=${e.detectionOverlaySwitch}
                  .callCatsEntity=${e.callCatsButton}
                  .externalPin=${this._settingsOpen}
                  @overlay-idle-changed=${this._onHeroOverlayIdleChanged}
                  @media-aspect-changed=${this._onMediaAspectChanged}
                ></kibble-live-hero>
              </div>
              <div class="hero-status">
                <span class="live-dot" ?hidden=${!x.live}></span>
                ${x.catName?c`<kibble-avatar
                      .hass=${this.hass}
                      .name=${x.catName}
                      .colorIndex=${x.colorIndex}
                      .asset=${x.avatarAsset}
                      .cache=${this._imageCache}
                    ></kibble-avatar>`:p}
                <span class="hero-status-text" data-tone=${x.tone}>${x.text}</span>
              </div>
              <button
                class="gear-button ${this._heroControlsVisible?"":"idle-hidden"}"
                aria-label="Settings"
                @click=${this._openSettings}
                @focus=${this._notifyHeroActivity}
              >
                ${y("cog")}
              </button>
              ${this._config.name?c`<div class="name-chip">${this._config.name}</div>`:p}
            </div>
            <div class="side">
            <div class="panel">
            <kibble-bowl
              class="bowl-art"
              .fill=${l}
              .fillSource=${u}
              .calibration=${h}
              .hopperLevel1=${d}
              .hopperLevel2=${f}
              .hopperRemaining1=${m}
              .hopperRemaining2=${b}
              .singleHopper=${_}
              .food1=${g}
              .food2=${C}
              .feeding=${a}
              .portions=${K}
              .darkMode=${se}
              .bowlMix=${ne}
              .pourSource=${this._pourSource}
              @hopper-detail-requested=${this._openHopperSheet}
            ></kibble-bowl>
            <div class="controls" @hass-action=${this._onBubbleAction}>
              <!-- Always this card's own controls, never a Bubble Card row.
                   Delegating the feed action to Bubble looked native on a Bubble dashboard
                   and behaved badly everywhere it mattered: no hold animation (Bubble has
                   none to drive), and on Android a long press raised the OS text-selection
                   magnifier because that row suppresses neither selection nor the callout.
                   A press-and-hold control has to own its own pointer handling. -->
              ${_?c`
                    <kibble-segmented-picker
                      class="picker-full"
                      .value=${String(z)}
                      .options=${Nm}
                      group-label="Feed amount, portions"
                      ?disabled=${o==="unreachable"||a}
                      @option-selected=${this._onPortionSelected}
                    ></kibble-segmented-picker>
                    <kibble-stepper
                      class="picker-compact"
                      .value=${z}
                      ?disabled=${o==="unreachable"||a}
                      @value-selected=${this._onPortionSelected}
                    ></kibble-stepper>
                  `:c`
                    <div class="hopper-row">
                      <span class="hopper-row-label">${g??"Hopper 1"}</span>
                      <kibble-stepper
                        .value=${M}
                        .min=${0}
                        .max=${5}
                        aria-label="${g??"Hopper 1"} portions"
                        ?disabled=${o==="unreachable"||a}
                        @value-selected=${this._onHopper1PortionSelected}
                      ></kibble-stepper>
                    </div>
                    <div class="hopper-row">
                      <span class="hopper-row-label">${C??"Hopper 2"}</span>
                      <kibble-stepper
                        .value=${V}
                        .min=${0}
                        .max=${5}
                        aria-label="${C??"Hopper 2"} portions"
                        ?disabled=${o==="unreachable"||a}
                        @value-selected=${this._onHopper2PortionSelected}
                      ></kibble-stepper>
                    </div>
                  `}
              <kibble-hold-button
                .label=${H}
                .variant=${a?"cancel":"feed"}
                ?disabled=${j}
                ?pending=${xt}
                @activate=${a?this._onCancelActivate:this._onFeedActivate}
              ></kibble-hold-button>
            </div>
            </div>
            ${this._config.schedule_hash?p:c`<kibble-schedule-summary
                  class="schedule-row"
                  .hass=${this.hass}
                  .entries=${R}
                  .scheduleCardStateEntity=${e.scheduleCardState}
                  .singleHopper=${_}
                  .deviceId=${e.deviceId}
                  .food1=${g}
                  .food2=${C}
                ></kibble-schedule-summary>`}
            </div>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog
        .hass=${this.hass}
        .entities=${e}
        .entryId=${this._entryId}
        .singleHopper=${_}
        .food1=${g}
        .food2=${C}
        ?open=${this._settingsOpen}
        @close-requested=${this._closeSettings}
        @calibration-changed=${this._onCalibrationChanged}
      ></kibble-settings-dialog>
      <kibble-hopper-sheet
        .hass=${this.hass}
        .entities=${e}
        ?open=${this._hopperSheetOpen}
        .hopperLevel1=${d}
        .hopperLevel2=${f}
        .hopperRemaining1=${m}
        .hopperRemaining2=${b}
        .singleHopper=${_}
        .food1=${g}
        .food2=${C}
        @close-requested=${this._closeHopperSheet}
      ></kibble-hopper-sheet>
      <kibble-calibration-dialog
        .hass=${this.hass}
        .entryId=${this._entryId}
        .singleHopper=${_}
        .food1=${g}
        .food2=${C}
        ?open=${this._calibrationOpen}
        @close-requested=${this._closeCalibration}
        @calibration-changed=${this._onCalibrationChanged}
      ></kibble-calibration-dialog>
      <kibble-detection-areas-dialog
        .hass=${this.hass}
        .cameraEntity=${e.camera}
        .entryId=${this._entryId}
        ?open=${this._detectionAreasOpen}
        @close-requested=${this._closeDetectionAreas}
      ></kibble-detection-areas-dialog>
    `}_numberState(e){if(!e)return null;let t=Number(this.hass.states[e]?.state);return Number.isFinite(t)?t:null}_heroOverlay(e){let t=this._entities.camera,s=t?this.hass.states[t]:void 0,n=s!==void 0&&s.state!=="unavailable";if(e==="unreachable")return{text:ks(e,null),tone:"error",live:n,catName:null,colorIndex:null,avatarAsset:null};if(e==="dispensing")return{text:ks(e,null),tone:"amber",live:n,catName:null,colorIndex:null,avatarAsset:null};let o=this._catSeen(),a=this._entities.eating,l=a!==void 0&&this.hass.states[a]?.state==="on";if(!o)return{text:l?"Eating now":"Ready to feed",tone:"normal",live:n,catName:null,colorIndex:null,avatarAsset:null};let u=this._catsQuery.state.data?.cats.find(h=>h.name===o.name)??null;return{text:l?`${o.name} is eating`:`${o.name} seen ${o.relative}`,tone:"normal",live:n,catName:o.name,colorIndex:u?.color??null,avatarAsset:u?.avatar??null}}_catSeen(){let e=this._entities.lastSeenPet,t=e?this.hass.states[e]:void 0;if(!t||t.state==="unavailable"||t.state.toLowerCase()==="unknown")return null;let s=t.attributes?.last_identified,n=typeof s=="string"?new Date(s):new Date(t.last_changed),o=Number.isNaN(n.getTime())?new Date(t.last_changed):n;return{name:t.state,relative:Tt(o,new Date)}}_scheduleEntries(){let e=this._entities.schedule;if(!e)return[];let s=this.hass.states[e]?.attributes?.entries;return Array.isArray(s)?s:[]}_portionConfigs(e,t){let s={action:"none"};return Dd.map(n=>{let o={tap_action:t?s:{action:"fire-dom-event",kibble:"portion",portion:n},double_tap_action:s,hold_action:s};return{card_type:"button",button_type:"name",name:String(n),show_icon:!1,show_state:!1,styles:qm(n===e,t),...o,button_action:o}})}_feedRowConfig(e,t){let s={action:"none"},n={tap_action:e&&!t?{action:"fire-dom-event",kibble:"cancel"}:s,double_tap_action:s,hold_action:!e&&!t?{action:"fire-dom-event",kibble:"feed"}:s};return{card_type:"button",button_type:"name",name:t?"Feeder unreachable":e?"Feeding\u2026 tap to cancel":"Hold to feed",icon:e?"mdi:stop-circle-outline":"mdi:bowl-mix",styles:e?Vm:Um,...n,button_action:n}}_onPortionSelected(e){this._setHopperPortion(this._entities.feedAmount,e)}_setHopperPortion(e,t){if(!e)return;let s=Number(t.detail.value);Number.isFinite(s)&&this.hass.callService("number","set_value",{value:s},{entity_id:e})}_singleHopper(){let e=this._entities.hopperDivider;return e!=null&&this.hass.states[e]?.state==="off"}_armFeedRequestTimeout(){this._clearFeedRequestTimeoutTimer(),this._feedRequestTimeoutTimer=setTimeout(()=>{this._feedRequestTimeoutTimer=void 0,this._feedRequest.phase==="requesting"&&(this._feedRequest=za(this._feedRequest,ir.timeoutMs,ir),this._pourSource=null,this._feedError="No response from the feeder",this._resetFeedErrorAfter(5e3))},ir.timeoutMs)}_clearFeedRequestTimeoutTimer(){this._feedRequestTimeoutTimer!==void 0&&clearTimeout(this._feedRequestTimeoutTimer),this._feedRequestTimeoutTimer=void 0}_resetFeedErrorAfter(e){this._clearFeedErrorTimer(),this._feedErrorTimer=setTimeout(()=>{this._feedErrorTimer=void 0,this._feedError=null,this._feedRequest=Ls()},e)}_clearFeedErrorTimer(){this._feedErrorTimer!==void 0&&clearTimeout(this._feedErrorTimer),this._feedErrorTimer=void 0}_clearPopupHash(){Ms(window.location.hash,this._config)!==null&&history.replaceState(null,"",`${window.location.pathname}${window.location.search}`)}static{this.styles=w`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${le(ua)};
      --kibble-amber-dark: ${le(ha)};
      /* The feed action, deliberately not the food's amber -- see the token's own doc. */
      --kibble-feed: ${le(ca)};
      --kibble-feed-dark: ${le(da)};
      --kibble-ink-on-feed: ${le(pa)};
      --kibble-ink-on-amber: ${le(fa)};
      --kibble-live: ${le(ma)};
      --kibble-touch-target: 48px;
      --kibble-feed-button-height: 56px;
      --kibble-number-size: 34px;
      --kibble-feed-label-size: 18px;
      --kibble-status-size: 22px;
      --kibble-segment-size: 16px;
      --kibble-schedule-size: 14px;
      /* The one vertical rhythm every gap and every section's own top padding is built from --
       * the art, the chips, the choice row, the stepper, and the pill all breathe by the same
       * amount, so nothing in the hero reads as an accident of whichever element happened to
       * need a number. */
      --kibble-rhythm: 14px;
    }
    :host(.kiosk) {
      --kibble-touch-target: 60px;
      --kibble-feed-button-height: 72px;
      --kibble-number-size: 42px;
      --kibble-feed-label-size: 22px;
      --kibble-status-size: 27px;
      --kibble-segment-size: 20px;
      --kibble-schedule-size: 17px;
    }
    ha-card {
      overflow: hidden;
      height: 100%;
      display: block;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .container {
      container-type: inline-size;
      height: 100%;
    }
    /* One column: the card is exactly as tall as its content, never a scroll box inside the
     * dashboard's own scroll. The two-column layout below boxes itself to the video instead.
     * Zero row gap on purpose: the video and the panel below it are one continuous card
     * surface, not two stacked tiles -- the hero's own square bottom corners (below) are what
     * make that continuity read as intentional rather than a seam. Every panel/schedule gets
     * its own top padding instead, off the same --kibble-rhythm scale. */
    .root {
      display: grid;
      gap: 0;
      grid-template-columns: 1fr;
      grid-template-areas: "hero" "panel" "schedule";
    }
    /* .side only exists as a grid area at >= 960px container width -- display: contents
     * unwraps it entirely below that so .panel/.schedule-row place directly into .root's own
     * "panel"/"schedule" areas, exactly as if .side were never in the markup at all. The
     * @container (min-width: 960px) block below turns it back into a real grid container once
     * there is a second column for it to own. */
    .side {
      display: contents;
    }
    /* Always the stream's true aspect ratio -- --kibble-hero-aspect starts at the sane 16/9
     * default every real feeder stream actually is (main 1920x1080, sub 1280x720) and is
     * overwritten by _onMediaAspectChanged the moment kibble-live-hero reports the real
     * media size, so the box never guesses a ratio the video itself does not have. */
    .hero {
      grid-area: hero;
      position: relative;
      overflow: hidden;
      aspect-ratio: var(--kibble-hero-aspect, 16 / 9);
      background: #1c1c1c;
      /* Square where the panel continues directly below -- rounded only at the top, so the
       * video and the card's own surface read as one shape, not two abutted rectangles. */
      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
    }
    .hero-media {
      position: absolute;
      inset: 0;
    }
    /* Fills .hero exactly; kibble-live-hero never crops beyond this box on its own (it
     * object-fit: contains the actual video/image internally), so there is no object-fit to
     * set here -- it would do nothing anyway, since this child is a custom element, never a
     * replaced one. */
    .hero-media > * {
      display: block;
      width: 100%;
      height: 100%;
    }
    .hero-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #bbb;
      font-size: 14px;
    }
    /* The live dot + latest cat + avatar: the one thing this restyle puts front and center --
     * "who has been by" belongs on the video itself, not buried in a footer row. */
    .hero-status {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      max-width: calc(100% - 56px);
      width: fit-content;
      padding: 5px 10px 5px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
    }
    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--kibble-live);
      flex: 0 0 auto;
    }
    .live-dot[hidden] {
      display: none;
    }
    .hero-status kibble-avatar {
      --kibble-avatar-size: 20px;
    }
    .hero-status-text {
      font-size: 13px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hero-status-text[data-tone="amber"] {
      color: var(--kibble-amber);
    }
    .hero-status-text[data-tone="error"] {
      color: var(--error-color, #ff8a80);
    }
    .gear-button {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      cursor: pointer;
    }
    /* Mirrors <kibble-live-hero>'s own controls/topbar fade (overlay-idle-changed, forwarded by
       _onHeroOverlayIdleChanged) since this button overlaps the hero's video from outside its
       shadow DOM and shares none of its CSS. No transition property outside the no-preference
       query, so a reduced-motion user's browser snaps the opacity instantly. */
    @media (prefers-reduced-motion: no-preference) {
      .gear-button {
        transition: opacity 200ms ease;
      }
    }
    .gear-button.idle-hidden {
      opacity: 0;
      pointer-events: none;
    }
    .name-chip {
      position: absolute;
      left: 12px;
      bottom: 12px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
    }
    /* The one calm panel: the art, the chips (drawn inside kibble-bowl itself), the hopper
     * choice, the portion stepper, and the pill -- one shared content width and one left edge,
     * so the art's own centre lines up with the pill's. Never touched by the container queries
     * below: the same rule places it under the video on a narrow card and beside it on a wide
     * one, capped and centred either way so it never grows into a giant balloon on a big
     * screen. kibble-bowl is the one child allowed to shrink (flex: 1 1 auto) when the wide
     * layout's own height budget is tight; the controls beneath it never do. */
    .panel {
      grid-area: panel;
      display: flex;
      flex-direction: column;
      min-height: 0;
      gap: var(--kibble-rhythm);
      width: 100%;
      max-width: 340px;
      margin: 0 auto;
      box-sizing: border-box;
      padding: var(--kibble-rhythm) 16px calc(var(--kibble-rhythm) + 2px);
    }
    .bowl-art {
      flex: 1 1 auto;
      min-height: 0;
    }
    .controls {
      flex: none;
      display: flex;
      flex-direction: column;
      gap: var(--kibble-rhythm);
      width: 100%;
      container-type: inline-size;
      container-name: feed-controls;
    }
    .controls .picker-full {
      display: none;
    }
    .controls .picker-compact {
      display: block;
    }
    @container feed-controls (min-width: 280px) {
      .controls .picker-full {
        display: block;
      }
      .controls .picker-compact {
        display: none;
      }
    }
    /* One dual-hopper row: the hopper's label left, its stepper right. Both rows share one
     * column edge, so the steppers line up whatever the food names' lengths, and each row is
     * one control tall, so two rows plus the Hold button never grow the hero. */
    .hopper-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 12px;
    }
    .hopper-row-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: var(--kibble-segment-size);
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .schedule-row {
      grid-area: schedule;
      padding: var(--kibble-rhythm) 16px 6px;
    }
    :host(.compact) {
      --kibble-rhythm: 8px;
    }
    :host(.compact) .hero {
      aspect-ratio: auto;
      height: 80px;
    }
    :host(.compact) .hero-status-text {
      font-size: 12px;
    }

    /* 560-959px (dual-hopper: 560-1279px, see the two @container blocks below -- two stepper
     * rows plus the hold button need more height at the same video width, so dual mode keeps
     * this layout until there is room): the video is full width above ONE row -- the bowl art
     * and the feed controls side by side, vertically centred. .root itself stays the
     * single-column stacked grid (only .panel's own internal direction changes) since the
     * video still spans the whole card width in this tier, exactly like the narrower stacked
     * layout above it. Unconditional -- both hopper modes want a row here, only where they
     * leave it differs. */
    @container (min-width: 560px) {
      .panel {
        flex-direction: row;
        align-items: center;
        max-width: 640px;
      }
      .bowl-art {
        flex: 0 1 220px;
        max-width: 220px;
      }
      .controls {
        flex: 1 1 0%;
        width: auto;
        min-width: 0;
      }
    }
    /* >=1100px, single-hopper only (:host(.dual-hopper) gets the same rules at a higher
     * threshold, below): two real columns, video left, panel/schedule stacked right -- .panel
     * reverts to the vertical layout the narrower tiers use (undoing the 560px row above),
     * since it now has its own dedicated column instead of sitting below a full-width video.
     * The video column is ~63% of the card width at its own true ratio (.hero's aspect-ratio,
     * set above): that fixed width plus the aspect ratio gives it a definite, intrinsic
     * height, which is what actually sets the row's height -- align-self: start (rather than
     * the default stretch) keeps the box at exactly that height instead of being stretched to
     * match .side if the panel ever needs more room than the video does. .side keeps the
     * default stretch and matches whatever height that turns out to be; .bowl-art's own
     * flex: 1 1 auto; min-height: 0 (unchanged from the base rule below) is what actually
     * absorbs the difference, since it is the one flexible child in that column -- and
     * kibble-bowl.ts's own .art{min-height:0} is what lets it genuinely shrink that far
     * without kibble-bowl's non-shrinking .calibrated/.chips ever losing their own space.
     * 1100px, not 960px: below it the shrunk art drops under ~70px (measured ~22px at 960,
     * ~45px at 1024) -- legible chips are not enough on their own if the illustration above
     * them has shrunk to a speck, so single mode stays in the 560px row tier (where bowl-art
     * is sized from its own width, never height-squeezed) until there is room for both.
     * .panel's overflow-y: auto and .bowl-art's overflow: hidden are a last-resort safety net
     * for a combination this tight and single mode alone should essentially never reach. */
    @container (min-width: 1100px) {
      :host(:not(.dual-hopper)) .root {
        grid-template-columns: 63% 1fr;
        grid-template-rows: calc(100cqw * 0.63 / var(--kibble-hero-aspect, 1.7778));
        grid-template-areas: "hero side";
        height: auto;
        overflow: visible;
      }
      :host(:not(.dual-hopper)) .hero {
        grid-area: hero;
        align-self: start;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
      }
      :host(:not(.dual-hopper)) .side {
        grid-area: side;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
      }
      :host(:not(.dual-hopper)) .panel {
        flex-direction: column;
        max-width: 340px;
        overflow-y: auto;
      }
      :host(:not(.dual-hopper)) .bowl-art {
        flex: 1 1 auto;
        max-width: none;
        overflow: hidden;
      }
      :host(:not(.dual-hopper)) .controls {
        flex: none;
        width: 100%;
      }
      :host(:not(.dual-hopper)) .panel,
      :host(:not(.dual-hopper)) .schedule-row {
        grid-area: unset;
      }
      :host(:not(.dual-hopper)) .schedule-row {
        align-self: start;
      }
    }
    /* >=1440px, dual-hopper only: identical layout to the single-hopper >=1100px tier above,
     * just a later threshold, for the same ~70px-minimum-art reason. Measured, not guessed: at
     * a true 16:9 video and 63% width, two stepper rows plus the hold button plus kibble-bowl's
     * own non-shrinking hopper-status chips (and, once calibration exists, its
     * calibrated-percent line) leave art around 183px at 960-1200px (comfortable) but the
     * SAME numbers only apply while dual stays in the row tier below -- once forced into this
     * column tier, dual needs noticeably more width than single before art clears ~70px again
     * (measured ~78px right at 1440, well under 70 at 1280) since it is negotiating for space
     * against a taller controls block (two stepper rows, not one). Below this threshold dual
     * mode stays in the 560px row tier above instead, where bowl-art is sized from its own
     * width and never height-squeezed at all. */
    @container (min-width: 1440px) {
      :host(.dual-hopper) .root {
        grid-template-columns: 63% 1fr;
        grid-template-rows: calc(100cqw * 0.63 / var(--kibble-hero-aspect, 1.7778));
        grid-template-areas: "hero side";
        height: auto;
        overflow: visible;
      }
      :host(.dual-hopper) .hero {
        grid-area: hero;
        align-self: start;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
      }
      :host(.dual-hopper) .side {
        grid-area: side;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
      }
      :host(.dual-hopper) .panel {
        flex-direction: column;
        max-width: 340px;
        overflow-y: auto;
      }
      :host(.dual-hopper) .bowl-art {
        flex: 1 1 auto;
        max-width: none;
        overflow: hidden;
      }
      :host(.dual-hopper) .controls {
        flex: none;
        width: 100%;
      }
      :host(.dual-hopper) .panel,
      :host(.dual-hopper) .schedule-row {
        grid-area: unset;
      }
      :host(.dual-hopper) .schedule-row {
        align-self: start;
      }
    }
  `}};console.info(`%c KIBBLE-CARD %c ${aa} `,"background:#43A96A;color:#10301D;font-weight:700","background:#10301D;color:#fff");customElements.define("kibble-card",Mo);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-card",name:"Kibble",description:"The full daily control surface for a Kibble Petkit feeder: live camera, who's been by, feed, and schedule.",preview:!0});export{Mo as KibbleCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
