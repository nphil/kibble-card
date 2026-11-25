var Cu=Object.create;var Ji=Object.defineProperty;var $u=Object.getOwnPropertyDescriptor;var Su=Object.getOwnPropertyNames;var Eu=Object.getPrototypeOf,Tu=Object.prototype.hasOwnProperty;var Pu=(t,r)=>()=>(t&&(r=t(t=0)),r);var C=(t,r)=>()=>(r||t((r={exports:{}}).exports,r),r.exports),Au=(t,r)=>{for(var e in r)Ji(t,e,{get:r[e],enumerable:!0})},Ra=(t,r,e,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of Su(r))!Tu.call(t,s)&&s!==e&&Ji(t,s,{get:()=>r[s],enumerable:!(i=$u(r,s))||i.enumerable});return t};var Ru=(t,r,e)=>(e=t!=null?Cu(Eu(t)):{},Ra(r||!t||!t.__esModule?Ji(e,"default",{value:t,enumerable:!0}):e,t)),At=t=>Ra(Ji({},"__esModule",{value:!0}),t);var Jr=C(Xe=>{"use strict";Object.defineProperty(Xe,"__esModule",{value:!0});Xe.ERROR_PACKET=Xe.PACKET_TYPES_REVERSE=Xe.PACKET_TYPES=void 0;var ke=Object.create(null);Xe.PACKET_TYPES=ke;ke.open="0";ke.close="1";ke.ping="2";ke.pong="3";ke.message="4";ke.upgrade="5";ke.noop="6";var td=Object.create(null);Xe.PACKET_TYPES_REVERSE=td;Object.keys(ke).forEach(t=>{td[ke[t]]=t});var pf={type:"error",data:"parser error"};Xe.ERROR_PACKET=pf});var ld=C(Ri=>{"use strict";Object.defineProperty(Ri,"__esModule",{value:!0});Ri.encodePacket=void 0;Ri.encodePacketToBinary=hf;var uf=Jr(),sd=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",nd=typeof ArrayBuffer=="function",od=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,ad=({type:t,data:r},e,i)=>sd&&r instanceof Blob?e?i(r):id(r,i):nd&&(r instanceof ArrayBuffer||od(r))?e?i(r):id(new Blob([r]),i):i(uf.PACKET_TYPES[t]+(r||""));Ri.encodePacket=ad;var id=(t,r)=>{let e=new FileReader;return e.onload=function(){let i=e.result.split(",")[1];r("b"+(i||""))},e.readAsDataURL(t)};function rd(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}var io;function hf(t,r){if(sd&&t.data instanceof Blob)return t.data.arrayBuffer().then(rd).then(r);if(nd&&(t.data instanceof ArrayBuffer||od(t.data)))return r(rd(t.data));ad(t,!1,e=>{io||(io=new TextEncoder),r(io.encode(e))})}});var cd=C(Wt=>{"use strict";Object.defineProperty(Wt,"__esModule",{value:!0});Wt.decode=Wt.encode=void 0;var Vt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Mi=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<Vt.length;t++)Mi[Vt.charCodeAt(t)]=t;var ff=t=>{let r=new Uint8Array(t),e,i=r.length,s="";for(e=0;e<i;e+=3)s+=Vt[r[e]>>2],s+=Vt[(r[e]&3)<<4|r[e+1]>>4],s+=Vt[(r[e+1]&15)<<2|r[e+2]>>6],s+=Vt[r[e+2]&63];return i%3===2?s=s.substring(0,s.length-1)+"=":i%3===1&&(s=s.substring(0,s.length-2)+"=="),s};Wt.encode=ff;var mf=t=>{let r=t.length*.75,e=t.length,i,s=0,n,o,a,l;t[t.length-1]==="="&&(r--,t[t.length-2]==="="&&r--);let u=new ArrayBuffer(r),h=new Uint8Array(u);for(i=0;i<e;i+=4)n=Mi[t.charCodeAt(i)],o=Mi[t.charCodeAt(i+1)],a=Mi[t.charCodeAt(i+2)],l=Mi[t.charCodeAt(i+3)],h[s++]=n<<2|o>>4,h[s++]=(o&15)<<4|a>>2,h[s++]=(a&3)<<6|l&63;return u};Wt.decode=mf});var pd=C(ts=>{"use strict";Object.defineProperty(ts,"__esModule",{value:!0});ts.decodePacket=void 0;var es=Jr(),bf=cd(),gf=typeof ArrayBuffer=="function",_f=(t,r)=>{if(typeof t!="string")return{type:"message",data:dd(t,r)};let e=t.charAt(0);return e==="b"?{type:"message",data:vf(t.substring(1),r)}:es.PACKET_TYPES_REVERSE[e]?t.length>1?{type:es.PACKET_TYPES_REVERSE[e],data:t.substring(1)}:{type:es.PACKET_TYPES_REVERSE[e]}:es.ERROR_PACKET};ts.decodePacket=_f;var vf=(t,r)=>{if(gf){let e=(0,bf.decode)(t);return dd(e,r)}else return{base64:!0,data:t}},dd=(t,r)=>{switch(r){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}}});var Kt=C(te=>{"use strict";Object.defineProperty(te,"__esModule",{value:!0});te.decodePayload=te.decodePacket=te.encodePayload=te.encodePacket=te.protocol=void 0;te.createPacketEncoderStream=wf;te.createPacketDecoderStream=kf;var so=ld();Object.defineProperty(te,"encodePacket",{enumerable:!0,get:function(){return so.encodePacket}});var no=pd();Object.defineProperty(te,"decodePacket",{enumerable:!0,get:function(){return no.decodePacket}});var ud=Jr(),hd="",yf=(t,r)=>{let e=t.length,i=new Array(e),s=0;t.forEach((n,o)=>{(0,so.encodePacket)(n,!1,a=>{i[o]=a,++s===e&&r(i.join(hd))})})};te.encodePayload=yf;var xf=(t,r)=>{let e=t.split(hd),i=[];for(let s=0;s<e.length;s++){let n=(0,no.decodePacket)(e[s],r);if(i.push(n),n.type==="error")break}return i};te.decodePayload=xf;function wf(){return new TransformStream({transform(t,r){(0,so.encodePacketToBinary)(t,e=>{let i=e.length,s;if(i<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,i);else if(i<65536){s=new Uint8Array(3);let n=new DataView(s.buffer);n.setUint8(0,126),n.setUint16(1,i)}else{s=new Uint8Array(9);let n=new DataView(s.buffer);n.setUint8(0,127),n.setBigUint64(1,BigInt(i))}t.data&&typeof t.data!="string"&&(s[0]|=128),r.enqueue(s),r.enqueue(e)})}})}var ro;function is(t){return t.reduce((r,e)=>r+e.length,0)}function rs(t,r){if(t[0].length===r)return t.shift();let e=new Uint8Array(r),i=0;for(let s=0;s<r;s++)e[s]=t[0][i++],i===t[0].length&&(t.shift(),i=0);return t.length&&i<t[0].length&&(t[0]=t[0].slice(i)),e}function kf(t,r){ro||(ro=new TextDecoder);let e=[],i=0,s=-1,n=!1;return new TransformStream({transform(o,a){for(e.push(o);;){if(i===0){if(is(e)<1)break;let l=rs(e,1);n=(l[0]&128)===128,s=l[0]&127,s<126?i=3:s===126?i=1:i=2}else if(i===1){if(is(e)<2)break;let l=rs(e,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),i=3}else if(i===2){if(is(e)<8)break;let l=rs(e,8),u=new DataView(l.buffer,l.byteOffset,l.length),h=u.getUint32(0);if(h>Math.pow(2,21)-1){a.enqueue(ud.ERROR_PACKET);break}s=h*Math.pow(2,32)+u.getUint32(4),i=3}else{if(is(e)<s)break;let l=rs(e,s);a.enqueue((0,no.decodePacket)(n?l:ro.decode(l),r)),i=0}if(s===0||s>t){a.enqueue(ud.ERROR_PACKET);break}}}})}te.protocol=4});var ss=C(fd=>{fd.Emitter=Z;function Z(t){if(t)return Cf(t)}function Cf(t){for(var r in Z.prototype)t[r]=Z.prototype[r];return t}Z.prototype.on=Z.prototype.addEventListener=function(t,r){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(r),this};Z.prototype.once=function(t,r){function e(){this.off(t,e),r.apply(this,arguments)}return e.fn=r,this.on(t,e),this};Z.prototype.off=Z.prototype.removeListener=Z.prototype.removeAllListeners=Z.prototype.removeEventListener=function(t,r){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var e=this._callbacks["$"+t];if(!e)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var i,s=0;s<e.length;s++)if(i=e[s],i===r||i.fn===r){e.splice(s,1);break}return e.length===0&&delete this._callbacks["$"+t],this};Z.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var r=new Array(arguments.length-1),e=this._callbacks["$"+t],i=1;i<arguments.length;i++)r[i-1]=arguments[i];if(e){e=e.slice(0);for(var i=0,s=e.length;i<s;++i)e[i].apply(this,r)}return this};Z.prototype.emitReserved=Z.prototype.emit;Z.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};Z.prototype.hasListeners=function(t){return!!this.listeners(t).length}});var bt=C(Fe=>{"use strict";Object.defineProperty(Fe,"__esModule",{value:!0});Fe.defaultBinaryType=Fe.globalThisShim=Fe.nextTick=void 0;Fe.createCookieJar=$f;Fe.nextTick=typeof Promise=="function"&&typeof Promise.resolve=="function"?r=>Promise.resolve().then(r):(r,e)=>e(r,0);Fe.globalThisShim=typeof self<"u"?self:typeof window<"u"?window:Function("return this")();Fe.defaultBinaryType="arraybuffer";function $f(){}});var gt=C(Yt=>{"use strict";Object.defineProperty(Yt,"__esModule",{value:!0});Yt.pick=Sf;Yt.installTimerFunctions=Pf;Yt.byteLength=Rf;Yt.randomString=Lf;var Ze=bt();function Sf(t,...r){return r.reduce((e,i)=>(t.hasOwnProperty(i)&&(e[i]=t[i]),e),{})}var Ef=Ze.globalThisShim.setTimeout,Tf=Ze.globalThisShim.clearTimeout;function Pf(t,r){r.useNativeTimers?(t.setTimeoutFn=Ef.bind(Ze.globalThisShim),t.clearTimeoutFn=Tf.bind(Ze.globalThisShim)):(t.setTimeoutFn=Ze.globalThisShim.setTimeout.bind(Ze.globalThisShim),t.clearTimeoutFn=Ze.globalThisShim.clearTimeout.bind(Ze.globalThisShim))}var Af=1.33;function Rf(t){return typeof t=="string"?Mf(t):Math.ceil((t.byteLength||t.size)*Af)}function Mf(t){let r=0,e=0;for(let i=0,s=t.length;i<s;i++)r=t.charCodeAt(i),r<128?e+=1:r<2048?e+=2:r<55296||r>=57344?e+=3:(i++,e+=4);return e}function Lf(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}});var oo=C(ns=>{"use strict";Object.defineProperty(ns,"__esModule",{value:!0});ns.encode=Of;ns.decode=If;function Of(t){let r="";for(let e in t)t.hasOwnProperty(e)&&(r.length&&(r+="&"),r+=encodeURIComponent(e)+"="+encodeURIComponent(t[e]));return r}function If(t){let r={},e=t.split("&");for(let i=0,s=e.length;i<s;i++){let n=e[i].split("=");r[decodeURIComponent(n[0])]=decodeURIComponent(n[1])}return r}});var bd=C((d1,md)=>{var Gt=1e3,Qt=Gt*60,Xt=Qt*60,_t=Xt*24,Hf=_t*7,Df=_t*365.25;md.exports=function(t,r){r=r||{};var e=typeof t;if(e==="string"&&t.length>0)return Ff(t);if(e==="number"&&isFinite(t))return r.long?Nf(t):zf(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))};function Ff(t){if(t=String(t),!(t.length>100)){var r=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(t);if(r){var e=parseFloat(r[1]),i=(r[2]||"ms").toLowerCase();switch(i){case"years":case"year":case"yrs":case"yr":case"y":return e*Df;case"weeks":case"week":case"w":return e*Hf;case"days":case"day":case"d":return e*_t;case"hours":case"hour":case"hrs":case"hr":case"h":return e*Xt;case"minutes":case"minute":case"mins":case"min":case"m":return e*Qt;case"seconds":case"second":case"secs":case"sec":case"s":return e*Gt;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return e;default:return}}}}function zf(t){var r=Math.abs(t);return r>=_t?Math.round(t/_t)+"d":r>=Xt?Math.round(t/Xt)+"h":r>=Qt?Math.round(t/Qt)+"m":r>=Gt?Math.round(t/Gt)+"s":t+"ms"}function Nf(t){var r=Math.abs(t);return r>=_t?os(t,r,_t,"day"):r>=Xt?os(t,r,Xt,"hour"):r>=Qt?os(t,r,Qt,"minute"):r>=Gt?os(t,r,Gt,"second"):t+" ms"}function os(t,r,e,i){var s=r>=e*1.5;return Math.round(t/e)+" "+i+(s?"s":"")}});var _d=C((p1,gd)=>{function jf(t){e.debug=e,e.default=e,e.coerce=l,e.disable=o,e.enable=s,e.enabled=a,e.humanize=bd(),e.destroy=u,Object.keys(t).forEach(h=>{e[h]=t[h]}),e.names=[],e.skips=[],e.formatters={};function r(h){let p=0;for(let f=0;f<h.length;f++)p=(p<<5)-p+h.charCodeAt(f),p|=0;return e.colors[Math.abs(p)%e.colors.length]}e.selectColor=r;function e(h){let p,f=null,m,b;function x(...v){if(!x.enabled)return;let $=x,D=Number(new Date),z=D-(p||D);$.diff=z,$.prev=p,$.curr=D,p=D,v[0]=e.coerce(v[0]),typeof v[0]!="string"&&v.unshift("%O");let R=0;v[0]=v[0].replace(/%([a-zA-Z%])/g,(G,w)=>{if(G==="%%")return"%";R++;let E=e.formatters[w];if(typeof E=="function"){let L=v[R];G=E.call($,L),v.splice(R,1),R--}return G}),e.formatArgs.call($,v),($.log||e.log).apply($,v)}return x.namespace=h,x.useColors=e.useColors(),x.color=e.selectColor(h),x.extend=i,x.destroy=e.destroy,Object.defineProperty(x,"enabled",{enumerable:!0,configurable:!1,get:()=>f!==null?f:(m!==e.namespaces&&(m=e.namespaces,b=e.enabled(h)),b),set:v=>{f=v}}),typeof e.init=="function"&&e.init(x),x}function i(h,p){let f=e(this.namespace+(typeof p>"u"?":":p)+h);return f.log=this.log,f}function s(h){e.save(h),e.namespaces=h,e.names=[],e.skips=[];let p=(typeof h=="string"?h:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let f of p)f[0]==="-"?e.skips.push(f.slice(1)):e.names.push(f)}function n(h,p){let f=0,m=0,b=-1,x=0;for(;f<h.length;)if(m<p.length&&(p[m]===h[f]||p[m]==="*"))p[m]==="*"?(b=m,x=f,m++):(f++,m++);else if(b!==-1)m=b+1,x++,f=x;else return!1;for(;m<p.length&&p[m]==="*";)m++;return m===p.length}function o(){let h=[...e.names,...e.skips.map(p=>"-"+p)].join(",");return e.enable(""),h}function a(h){for(let p of e.skips)if(n(h,p))return!1;for(let p of e.names)if(n(h,p))return!0;return!1}function l(h){return h instanceof Error?h.stack||h.message:h}function u(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return e.enable(e.load()),e}gd.exports=jf});var vt=C((ie,as)=>{ie.formatArgs=Bf;ie.save=Uf;ie.load=Vf;ie.useColors=qf;ie.storage=Wf();ie.destroy=(()=>{let t=!1;return()=>{t||(t=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();ie.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function qf(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let t;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(t=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(t[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function Bf(t){if(t[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+t[0]+(this.useColors?"%c ":" ")+"+"+as.exports.humanize(this.diff),!this.useColors)return;let r="color: "+this.color;t.splice(1,0,r,"color: inherit");let e=0,i=0;t[0].replace(/%[a-zA-Z%]/g,s=>{s!=="%%"&&(e++,s==="%c"&&(i=e))}),t.splice(i,0,r)}ie.log=console.debug||console.log||(()=>{});function Uf(t){try{t?ie.storage.setItem("debug",t):ie.storage.removeItem("debug")}catch{}}function Vf(){let t;try{t=ie.storage.getItem("debug")||ie.storage.getItem("DEBUG")}catch{}return!t&&typeof process<"u"&&"env"in process&&(t=process.env.DEBUG),t}function Wf(){try{return localStorage}catch{}}as.exports=_d()(ie);var{formatters:Kf}=as.exports;Kf.j=function(t){try{return JSON.stringify(t)}catch(r){return"[UnexpectedJSONParseError]: "+r.message}}});var Li=C(Je=>{"use strict";var Yf=Je&&Je.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Je,"__esModule",{value:!0});Je.Transport=Je.TransportError=void 0;var Gf=Kt(),Qf=ss(),Xf=gt(),Zf=oo(),Jf=Yf(vt()),em=(0,Jf.default)("engine.io-client:transport"),ls=class extends Error{constructor(r,e,i){super(r),this.description=e,this.context=i,this.type="TransportError"}};Je.TransportError=ls;var ao=class extends Qf.Emitter{constructor(r){super(),this.writable=!1,(0,Xf.installTimerFunctions)(this,r),this.opts=r,this.query=r.query,this.socket=r.socket,this.supportsBinary=!r.forceBase64}onError(r,e,i){return super.emitReserved("error",new ls(r,e,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(r){this.readyState==="open"?this.write(r):em("transport is not open, discarding packets")}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(r){let e=(0,Gf.decodePacket)(r,this.socket.binaryType);this.onPacket(e)}onPacket(r){super.emitReserved("packet",r)}onClose(r){this.readyState="closed",super.emitReserved("close",r)}pause(r){}createUri(r,e={}){return r+"://"+this._hostname()+this._port()+this.opts.path+this._query(e)}_hostname(){let r=this.opts.hostname;return r.indexOf(":")===-1?r:"["+r+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(r){let e=(0,Zf.encode)(r);return e.length?"?"+e:""}};Je.Transport=ao});var co=C(Zt=>{"use strict";var tm=Zt&&Zt.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Zt,"__esModule",{value:!0});Zt.Polling=void 0;var im=Li(),rm=gt(),vd=Kt(),sm=tm(vt()),me=(0,sm.default)("engine.io-client:polling"),lo=class extends im.Transport{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(r){this.readyState="pausing";let e=()=>{me("paused"),this.readyState="paused",r()};if(this._polling||!this.writable){let i=0;this._polling&&(me("we are currently polling - waiting to pause"),i++,this.once("pollComplete",function(){me("pre-pause polling complete"),--i||e()})),this.writable||(me("we are currently writing - waiting to pause"),i++,this.once("drain",function(){me("pre-pause writing complete"),--i||e()}))}else e()}_poll(){me("polling"),this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(r){me("polling got data %s",r);let e=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};(0,vd.decodePayload)(r,this.socket.binaryType).forEach(e),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"?this._poll():me('ignoring poll - transport state "%s"',this.readyState))}doClose(){let r=()=>{me("writing close packet"),this.write([{type:"close"}])};this.readyState==="open"?(me("transport open - closing"),r()):(me("transport not open - deferring close"),this.once("open",r))}write(r){this.writable=!1,(0,vd.encodePayload)(r,e=>{this.doWrite(e,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){let r=this.opts.secure?"https":"http",e=this.query||{};return this.opts.timestampRequests!==!1&&(e[this.opts.timestampParam]=(0,rm.randomString)()),!this.supportsBinary&&!e.sid&&(e.b64=1),this.createUri(r,e)}};Zt.Polling=lo});var xd=C(cs=>{"use strict";Object.defineProperty(cs,"__esModule",{value:!0});cs.hasCORS=void 0;var yd=!1;try{yd=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}cs.hasCORS=yd});var ps=C(Ce=>{"use strict";var nm=Ce&&Ce.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Ce,"__esModule",{value:!0});Ce.XHR=Ce.Request=Ce.BaseXHR=void 0;var om=co(),am=ss(),wd=gt(),Cd=bt(),lm=xd(),cm=nm(vt()),po=(0,cm.default)("engine.io-client:polling");function dm(){}var ds=class extends om.Polling{constructor(r){if(super(r),typeof location<"u"){let e=location.protocol==="https:",i=location.port;i||(i=e?"443":"80"),this.xd=typeof location<"u"&&r.hostname!==location.hostname||i!==r.port}}doWrite(r,e){let i=this.request({method:"POST",data:r});i.on("success",e),i.on("error",(s,n)=>{this.onError("xhr post error",s,n)})}doPoll(){po("xhr poll");let r=this.request();r.on("data",this.onData.bind(this)),r.on("error",(e,i)=>{this.onError("xhr poll error",e,i)}),this.pollXhr=r}};Ce.BaseXHR=ds;var ze=class t extends am.Emitter{constructor(r,e,i){super(),this.createRequest=r,(0,wd.installTimerFunctions)(this,i),this._opts=i,this._method=i.method||"GET",this._uri=e,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var r;let e=(0,wd.pick)(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");e.xdomain=!!this._opts.xd;let i=this._xhr=this.createRequest(e);try{po("xhr open %s: %s",this._method,this._uri),i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&i.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(r=this._opts.cookieJar)===null||r===void 0||r.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var s;i.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},po("xhr data %s",this._data),i.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=t.requestsCount++,t.requests[this._index]=this)}_onError(r){this.emitReserved("error",r,this._xhr),this._cleanup(!0)}_cleanup(r){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=dm,r)try{this._xhr.abort()}catch{}typeof document<"u"&&delete t.requests[this._index],this._xhr=null}}_onLoad(){let r=this._xhr.responseText;r!==null&&(this.emitReserved("data",r),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};Ce.Request=ze;ze.requestsCount=0;ze.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",kd);else if(typeof addEventListener=="function"){let t="onpagehide"in Cd.globalThisShim?"pagehide":"unload";addEventListener(t,kd,!1)}}function kd(){for(let t in ze.requests)ze.requests.hasOwnProperty(t)&&ze.requests[t].abort()}var pm=function(){let t=$d({xdomain:!1});return t&&t.responseType!==null}(),uo=class extends ds{constructor(r){super(r);let e=r&&r.forceBase64;this.supportsBinary=pm&&!e}request(r={}){return Object.assign(r,{xd:this.xd},this.opts),new ze($d,this.uri(),r)}};Ce.XHR=uo;function $d(t){let r=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!r||lm.hasCORS))return new XMLHttpRequest}catch{}if(!r)try{return new Cd.globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}});var hs=C(et=>{"use strict";var um=et&&et.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(et,"__esModule",{value:!0});et.WS=et.BaseWS=void 0;var hm=Li(),Sd=gt(),fm=Kt(),fo=bt(),mm=um(vt()),bm=(0,mm.default)("engine.io-client:websocket"),Ed=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative",us=class extends hm.Transport{get name(){return"websocket"}doOpen(){let r=this.uri(),e=this.opts.protocols,i=Ed?{}:(0,Sd.pick)(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(r,e,i)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=r=>this.onClose({description:"websocket connection closed",context:r}),this.ws.onmessage=r=>this.onData(r.data),this.ws.onerror=r=>this.onError("websocket error",r)}write(r){this.writable=!1;for(let e=0;e<r.length;e++){let i=r[e],s=e===r.length-1;(0,fm.encodePacket)(i,this.supportsBinary,n=>{try{this.doWrite(i,n)}catch{bm("websocket closed before onclose event")}s&&(0,fo.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){let r=this.opts.secure?"wss":"ws",e=this.query||{};return this.opts.timestampRequests&&(e[this.opts.timestampParam]=(0,Sd.randomString)()),this.supportsBinary||(e.b64=1),this.createUri(r,e)}};et.BaseWS=us;var ho=fo.globalThisShim.WebSocket||fo.globalThisShim.MozWebSocket,mo=class extends us{createSocket(r,e,i){return Ed?new ho(r,e,i):e?new ho(r,e):new ho(r)}doWrite(r,e){this.ws.send(e)}};et.WS=mo});var go=C(Jt=>{"use strict";var gm=Jt&&Jt.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Jt,"__esModule",{value:!0});Jt.WT=void 0;var _m=Li(),vm=bt(),Td=Kt(),ym=gm(vt()),Oi=(0,ym.default)("engine.io-client:webtransport"),bo=class extends _m.Transport{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(r){return this.emitReserved("error",r)}this._transport.closed.then(()=>{Oi("transport closed gracefully"),this.onClose()}).catch(r=>{Oi("transport closed due to %s",r),this.onError("webtransport error",r)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(r=>{let e=(0,Td.createPacketDecoderStream)(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=r.readable.pipeThrough(e).getReader(),s=(0,Td.createPacketEncoderStream)();s.readable.pipeTo(r.writable),this._writer=s.writable.getWriter();let n=()=>{i.read().then(({done:a,value:l})=>{if(a){Oi("session is closed");return}Oi("received chunk: %o",l),this.onPacket(l),n()}).catch(a=>{Oi("an error occurred while reading: %s",a)})};n();let o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(r){this.writable=!1;for(let e=0;e<r.length;e++){let i=r[e],s=e===r.length-1;this._writer.write(i).then(()=>{s&&(0,vm.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var r;(r=this._transport)===null||r===void 0||r.close()}};Jt.WT=bo});var _o=C(fs=>{"use strict";Object.defineProperty(fs,"__esModule",{value:!0});fs.transports=void 0;var xm=ps(),wm=hs(),km=go();fs.transports={websocket:wm.WS,webtransport:km.WT,polling:xm.XHR}});var yo=C(vo=>{"use strict";Object.defineProperty(vo,"__esModule",{value:!0});vo.parse=Sm;var Cm=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,$m=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Sm(t){if(t.length>8e3)throw"URI too long";let r=t,e=t.indexOf("["),i=t.indexOf("]");e!=-1&&i!=-1&&(t=t.substring(0,e)+t.substring(e,i).replace(/:/g,";")+t.substring(i,t.length));let s=Cm.exec(t||""),n={},o=14;for(;o--;)n[$m[o]]=s[o]||"";return e!=-1&&i!=-1&&(n.source=r,n.host=n.host.substring(1,n.host.length-1).replace(/;/g,":"),n.authority=n.authority.replace("[","").replace("]","").replace(/;/g,":"),n.ipv6uri=!0),n.pathNames=Em(n,n.path),n.queryKey=Tm(n,n.query),n}function Em(t,r){let e=/\/{2,9}/g,i=r.replace(e,"/").split("/");return(r.slice(0,1)=="/"||r.length===0)&&i.splice(0,1),r.slice(-1)=="/"&&i.splice(i.length-1,1),i}function Tm(t,r){let e={};return r.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,s,n){s&&(e[s]=n)}),e}});var Co=C($e=>{"use strict";var Pm=$e&&$e.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty($e,"__esModule",{value:!0});$e.Socket=$e.SocketWithUpgrade=$e.SocketWithoutUpgrade=void 0;var Am=_o(),Pd=gt(),Rm=oo(),Ad=yo(),Mm=ss(),Rd=Kt(),xo=bt(),Lm=Pm(vt()),M=(0,Lm.default)("engine.io-client:socket"),wo=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ii=[];wo&&addEventListener("offline",()=>{M("closing %d connection(s) because the network was lost",Ii.length),Ii.forEach(t=>t())},!1);var yt=class t extends Mm.Emitter{constructor(r,e){if(super(),this.binaryType=xo.defaultBinaryType,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,r&&typeof r=="object"&&(e=r,r=null),r){let i=(0,Ad.parse)(r);e.hostname=i.host,e.secure=i.protocol==="https"||i.protocol==="wss",e.port=i.port,i.query&&(e.query=i.query)}else e.host&&(e.hostname=(0,Ad.parse)(e.host).host);(0,Pd.installTimerFunctions)(this,e),this.secure=e.secure!=null?e.secure:typeof location<"u"&&location.protocol==="https:",e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.hostname=e.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=e.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},e.transports.forEach(i=>{let s=i.prototype.name;this.transports.push(s),this._transportsByName[s]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},e),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=(0,Rm.decode)(this.opts.query)),wo&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(M("adding listener for the 'offline' event"),this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ii.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=(0,xo.createCookieJar)()),this._open()}createTransport(r){M('creating transport "%s"',r);let e=Object.assign({},this.opts.query);e.EIO=Rd.protocol,e.transport=r,this.id&&(e.sid=this.id);let i=Object.assign({},this.opts,{query:e,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[r]);return M("options: %j",i),new this._transportsByName[r](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}let r=this.opts.rememberUpgrade&&t.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";let e=this.createTransport(r);e.open(),this.setTransport(e)}setTransport(r){M("setting transport %s",r.name),this.transport&&(M("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=r,r.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",e=>this._onClose("transport close",e))}onOpen(){M("socket open"),this.readyState="open",t.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(r){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(M('socket receive: type "%s", data "%s"',r.type,r.data),this.emitReserved("packet",r),this.emitReserved("heartbeat"),r.type){case"open":this.onHandshake(JSON.parse(r.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":let e=new Error("server error");e.code=r.data,this._onError(e);break;case"message":this.emitReserved("data",r.data),this.emitReserved("message",r.data);break}else M('packet received with socket readyState "%s"',this.readyState)}onHandshake(r){this.emitReserved("handshake",r),this.id=r.sid,this.transport.query.sid=r.sid,this._pingInterval=r.pingInterval,this._pingTimeout=r.pingTimeout,this._maxPayload=r.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);let r=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+r,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},r),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){let r=this._getWritablePackets();M("flushing %d packets in socket",r.length),this.transport.send(r),this._prevBufferLen=r.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let e=1;for(let i=0;i<this.writeBuffer.length;i++){let s=this.writeBuffer[i].data;if(s&&(e+=(0,Pd.byteLength)(s)),i>0&&e>this._maxPayload)return M("only send %d out of %d packets",i,this.writeBuffer.length),this.writeBuffer.slice(0,i);e+=2}return M("payload size is %d (max: %d)",e,this._maxPayload),this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;let r=Date.now()>this._pingTimeoutTime;return r&&(M("throttled timer detected, scheduling connection close"),this._pingTimeoutTime=0,(0,xo.nextTick)(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),r}write(r,e,i){return this._sendPacket("message",r,e,i),this}send(r,e,i){return this._sendPacket("message",r,e,i),this}_sendPacket(r,e,i,s){if(typeof e=="function"&&(s=e,e=void 0),typeof i=="function"&&(s=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;let n={type:r,data:e,options:i};this.emitReserved("packetCreate",n),this.writeBuffer.push(n),s&&this.once("flush",s),this.flush()}close(){let r=()=>{this._onClose("forced close"),M("socket closing - telling transport to close"),this.transport.close()},e=()=>{this.off("upgrade",e),this.off("upgradeError",e),r()},i=()=>{this.once("upgrade",e),this.once("upgradeError",e)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():r()}):this.upgrading?i():r()),this}_onError(r){if(M("socket error %j",r),t.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return M("trying next transport"),this.transports.shift(),this._open();this.emitReserved("error",r),this._onClose("transport error",r)}_onClose(r,e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(M('socket close with reason: "%s"',r),this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),wo&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){let i=Ii.indexOf(this._offlineEventListener);i!==-1&&(M("removing listener for the 'offline' event"),Ii.splice(i,1))}this.readyState="closed",this.id=null,this.emitReserved("close",r,e),this.writeBuffer=[],this._prevBufferLen=0}}};$e.SocketWithoutUpgrade=yt;yt.protocol=Rd.protocol;var ms=class extends yt{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade){M("starting upgrade probes");for(let r=0;r<this._upgrades.length;r++)this._probe(this._upgrades[r])}}_probe(r){M('probing transport "%s"',r);let e=this.createTransport(r),i=!1;yt.priorWebsocketSuccess=!1;let s=()=>{i||(M('probe transport "%s" opened',r),e.send([{type:"ping",data:"probe"}]),e.once("packet",p=>{if(!i)if(p.type==="pong"&&p.data==="probe"){if(M('probe transport "%s" pong',r),this.upgrading=!0,this.emitReserved("upgrading",e),!e)return;yt.priorWebsocketSuccess=e.name==="websocket",M('pausing current transport "%s"',this.transport.name),this.transport.pause(()=>{i||this.readyState!=="closed"&&(M("changing transport and sending upgrade packet"),h(),this.setTransport(e),e.send([{type:"upgrade"}]),this.emitReserved("upgrade",e),e=null,this.upgrading=!1,this.flush())})}else{M('probe transport "%s" failed',r);let f=new Error("probe error");f.transport=e.name,this.emitReserved("upgradeError",f)}}))};function n(){i||(i=!0,h(),e.close(),e=null)}let o=p=>{let f=new Error("probe error: "+p);f.transport=e.name,n(),M('probe transport "%s" failed because of error: %s',r,p),this.emitReserved("upgradeError",f)};function a(){o("transport closed")}function l(){o("socket closed")}function u(p){e&&p.name!==e.name&&(M('"%s" works - aborting "%s"',p.name,e.name),n())}let h=()=>{e.removeListener("open",s),e.removeListener("error",o),e.removeListener("close",a),this.off("close",l),this.off("upgrading",u)};e.once("open",s),e.once("error",o),e.once("close",a),this.once("close",l),this.once("upgrading",u),this._upgrades.indexOf("webtransport")!==-1&&r!=="webtransport"?this.setTimeoutFn(()=>{i||e.open()},200):e.open()}onHandshake(r){this._upgrades=this._filterUpgrades(r.upgrades),super.onHandshake(r)}_filterUpgrades(r){let e=[];for(let i=0;i<r.length;i++)~this.transports.indexOf(r[i])&&e.push(r[i]);return e}};$e.SocketWithUpgrade=ms;var ko=class extends ms{constructor(r,e={}){let i=typeof r=="object",s=i?{...r}:{...e};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(n=>Am.transports[n]).filter(n=>!!n)),super(i?s:r,s)}};$e.Socket=ko});var Md=C(bs=>{"use strict";Object.defineProperty(bs,"__esModule",{value:!0});bs.Fetch=void 0;var Om=co(),$o=class extends Om.Polling{doPoll(){this._fetch().then(r=>{if(!r.ok)return this.onError("fetch read error",r.status,r);r.text().then(e=>this.onData(e))}).catch(r=>{this.onError("fetch read error",r)})}doWrite(r,e){this._fetch(r).then(i=>{if(!i.ok)return this.onError("fetch write error",i.status,i);e()}).catch(i=>{this.onError("fetch write error",i)})}_fetch(r){var e;let i=r!==void 0,s=new Headers(this.opts.extraHeaders);return i&&s.set("content-type","text/plain;charset=UTF-8"),(e=this.socket._cookieJar)===null||e===void 0||e.appendCookies(s),fetch(this.uri(),{method:i?"POST":"GET",body:i?r:null,headers:s,credentials:this.opts.withCredentials?"include":"omit"}).then(n=>{var o;return(o=this.socket._cookieJar)===null||o===void 0||o.parseCookies(n.headers.getSetCookie()),n})}};bs.Fetch=$o});var Hd=C(A=>{"use strict";Object.defineProperty(A,"__esModule",{value:!0});A.WebTransport=A.WebSocket=A.NodeWebSocket=A.XHR=A.NodeXHR=A.Fetch=A.nextTick=A.parse=A.installTimerFunctions=A.transports=A.TransportError=A.Transport=A.protocol=A.SocketWithUpgrade=A.SocketWithoutUpgrade=A.Socket=void 0;var Ld=Co();Object.defineProperty(A,"Socket",{enumerable:!0,get:function(){return Ld.Socket}});var Od=Co();Object.defineProperty(A,"SocketWithoutUpgrade",{enumerable:!0,get:function(){return Od.SocketWithoutUpgrade}});Object.defineProperty(A,"SocketWithUpgrade",{enumerable:!0,get:function(){return Od.SocketWithUpgrade}});A.protocol=Ld.Socket.protocol;var Id=Li();Object.defineProperty(A,"Transport",{enumerable:!0,get:function(){return Id.Transport}});Object.defineProperty(A,"TransportError",{enumerable:!0,get:function(){return Id.TransportError}});var Im=_o();Object.defineProperty(A,"transports",{enumerable:!0,get:function(){return Im.transports}});var Hm=gt();Object.defineProperty(A,"installTimerFunctions",{enumerable:!0,get:function(){return Hm.installTimerFunctions}});var Dm=yo();Object.defineProperty(A,"parse",{enumerable:!0,get:function(){return Dm.parse}});var Fm=bt();Object.defineProperty(A,"nextTick",{enumerable:!0,get:function(){return Fm.nextTick}});var zm=Md();Object.defineProperty(A,"Fetch",{enumerable:!0,get:function(){return zm.Fetch}});var Nm=ps();Object.defineProperty(A,"NodeXHR",{enumerable:!0,get:function(){return Nm.XHR}});var jm=ps();Object.defineProperty(A,"XHR",{enumerable:!0,get:function(){return jm.XHR}});var qm=hs();Object.defineProperty(A,"NodeWebSocket",{enumerable:!0,get:function(){return qm.WS}});var Bm=hs();Object.defineProperty(A,"WebSocket",{enumerable:!0,get:function(){return Bm.WS}});var Um=go();Object.defineProperty(A,"WebTransport",{enumerable:!0,get:function(){return Um.WT}})});var Dd=C(Ne=>{"use strict";Object.defineProperty(Ne,"__esModule",{value:!0});Ne.TimeoutError=void 0;Ne.singletonPromise=Vm;Ne.timeoutPromise=Wm;Ne.timeoutFunction=Km;Ne.createPromiseDebouncer=Ym;Ne.createMapPromiseDebouncer=Gm;function Vm(t,r,e=0){if(t?.promise)return t;let i=r();return t?t.promise=i:t={promise:i,cacheDuration:e},i.finally(()=>setTimeout(()=>t.promise=void 0,t.cacheDuration)),t}var Hi=class extends Error{promise;constructor(r){super("Operation Timed Out"),this.promise=r}};Ne.TimeoutError=Hi;function Wm(t,r){return new Promise((e,i)=>{let s=setTimeout(()=>i(new Hi(r)),t);r.then(n=>{clearTimeout(s),e(n)}).catch(n=>{clearTimeout(s),i(n)})})}function Km(t,r){return new Promise((e,i)=>{let s=!1,n=r(()=>s),o=setTimeout(()=>{s=!0,i(new Hi(n))},t);n.then(a=>{clearTimeout(o),e(a)}).catch(a=>{clearTimeout(o),i(a)})})}function Ym(){let t;return r=>(t||(t=r().finally(()=>t=void 0)),t)}function Gm(){let t=new Map;return(r,e,i)=>{let s=JSON.stringify(r),n=t.get(s);return n||(n=i().finally(()=>{if(!e){t.delete(s);return}setTimeout(()=>t.delete(s),e)}),t.set(s,n)),n}}});var Ee=C(tt=>{"use strict";Object.defineProperty(tt,"__esModule",{value:!0});tt.RpcPeer=tt.RPCResultError=void 0;tt.startPeriodicGarbageCollection=Fd;tt.getEvalSource=Qm;function Fd(){globalThis.gc||console.warn("rpc peer garbage collection not available: global.gc is not exposed.");let t;try{t=globalThis}catch{}let r=0;return setInterval(()=>{let e=Date.now(),i=e-r,s=Y.remotesCreated;Y.remotesCreated=0;let n=Y.remotesCollected;Y.remotesCollected=0,(s||n||i>5*60*1e3)&&(r=e,t?.gc?.())},1e4)}var gs=class t{peer;entry;constructorName;proxyProps;proxyOneWayMethods;static iteratorMethods=new Set(["next","throw","return"]);constructor(r,e,i,s,n){this.peer=r,this.entry=e,this.constructorName=i,this.proxyProps=s,this.proxyOneWayMethods=n}toPrimitive(){let r=this.peer;return`RpcProxy-${r.selfName}:${r.peerName}: ${this.constructorName}`}get(r,e,i){if(e===Symbol.asyncIterator)return this.proxyProps?.[Symbol.asyncIterator.toString()]?()=>new Proxy(()=>{},this):void 0;if(t.iteratorMethods.has(e?.toString())){let n=this.proxyProps?.[Symbol.asyncIterator.toString()]?.[e];if(n)return new Proxy(()=>n,this)}if(e===Y.PROPERTY_PROXY_ID)return this.entry.id;if(e==="__proxy_constructor")return this.constructorName;if(e===Y.PROPERTY_PROXY_PEER)return this.peer;if(e===Y.PROPERTY_PROXY_PROPERTIES)return this.proxyProps;if(e===Y.PROPERTY_PROXY_ONEWAY_METHODS)return this.proxyOneWayMethods;if(e===Y.PROPERTY_JSON_DISABLE_SERIALIZATION||e===Y.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN||e==="then"||e==="constructor")return;if(this.proxyProps?.[e]!==void 0)return this.proxyProps?.[e];let s=Y.handleFunctionInvocations(this,r,e,i);return s||new Proxy(()=>e,this)}set(r,e,i,s){return e===Y.finalizerIdSymbol?this.entry.finalizerId=i:(this.proxyProps||={},this.proxyProps[e]=i),!0}apply(r,e,i){let s=r()||null,n=this.proxyOneWayMethods?.includes?.(s);if(Object.isFrozen(this.peer.pendingResults))return n?Promise.resolve():Promise.reject(new Se(this.peer,"RpcPeer has been killed (apply) "+r()));let o=[],a={};for(let p of i||[])o.push(this.peer.serialize(p,a));let l={type:"apply",id:void 0,proxyId:this.entry.id,args:o,method:s};if(n)return l.oneway=!0,s===null&&delete l.method,this.peer.send(l,void 0,a),Promise.resolve();let u=this.peer.createPendingResult(s,(p,f)=>{l.id=p,this.peer.send(l,f,a)}),h=this.proxyProps?.[Symbol.asyncIterator.toString()];return!h||s!==h.next&&s!==h.return?u:u.then(p=>s===h.return?{done:!0,value:void 0}:{value:p,done:!1}).catch(p=>{if(p.name==="StopAsyncIteration")return{done:!0,value:void 0};throw p})}},Se=class extends Error{cause;constructor(r,e,i,s){super(`${e}
${r.selfName}:${r.peerName}`),this.cause=i,s?.name&&(this.name=s?.name),s?.stack&&(this.stack=`${i?.stack||s.stack}
${r.peerName}:${r.selfName}`)}};tt.RPCResultError=Se;try{let t=FinalizationRegistry}catch{window.WeakRef=class{target;constructor(e){this.target=e}deref(){return this.target}},window.FinalizationRegistry=class{register(){}}}var Y=class t{selfName;peerName;send;params={};pendingResults={};localProxied=new Map;localProxyMap=new Map;remoteWeakProxies={};finalizers=new FinalizationRegistry(r=>this.finalize(r));nameDeserializerMap=new Map;onProxyTypeSerialization=new Map;onProxySerialization;constructorSerializerMap=new Map;transportSafeArgumentTypes=t.getDefaultTransportSafeArgumentTypes();killed;killedSafe;killedDeferred;tags={};yieldedAsyncIterators=new Set;static finalizerIdSymbol=Symbol("rpcFinalizerId");static remotesCollected=0;static remotesCreated=0;static activeRpcPeer;static isRpcProxy(r){return!!r?.[t.PROPERTY_PROXY_ID]}static getDefaultTransportSafeArgumentTypes(){let r=new Set;return r.add(Number.name),r.add(String.name),r.add(Object.name),r.add(Boolean.name),r.add(Array.name),r}static handleFunctionInvocations(r,e,i,s){if(i==="apply")return(n,o)=>r.apply(e,r,o);if(i==="call")return(n,...o)=>r.apply(e,r,o);if(i==="toString"||i===Symbol.toPrimitive)return(n,...o)=>r.toPrimitive()}static getIteratorNext(r){return r[Symbol.asyncIterator]?r[this.PROPERTY_PROXY_PROPERTIES]?.[Symbol.asyncIterator.toString()]?.next||"next":void 0}static prepareProxyProperties(r){let e=r?.[t.PROPERTY_PROXY_PROPERTIES];return r[Symbol.asyncIterator]&&(e||={},e[Symbol.asyncIterator.toString()]||(e[Symbol.asyncIterator.toString()]={next:"next",throw:"throw",return:"return"})),e}static RANDOM_DIGITS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";static RPC_RESULT_ERROR_NAME="RPCResultError";static PROPERTY_PROXY_ID="__proxy_id";static PROPERTY_PROXY_PEER="__proxy_peer";static PROPERTY_PROXY_ONEWAY_METHODS="__proxy_oneway_methods";static PROPERTY_JSON_DISABLE_SERIALIZATION="__json_disable_serialization";static PROPERTY_PROXY_PROPERTIES="__proxy_props";static PROPERTY_JSON_COPY_SERIALIZE_CHILDREN="__json_copy_serialize_children";static PROBED_PROPERTIES=new Set(["then","constructor","__proxy_id","__proxy_constructor",t.PROPERTY_PROXY_PEER,t.PROPERTY_PROXY_ONEWAY_METHODS,t.PROPERTY_JSON_DISABLE_SERIALIZATION,t.PROPERTY_PROXY_PROPERTIES,t.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]);constructor(r,e,i){this.selfName=r,this.peerName=e,this.send=i,this.killed=new Promise((s,n)=>{this.killedDeferred={resolve:s,reject:n,method:void 0}}).catch(s=>s.message||"Unknown Error"),this.killedSafe=this.killed.then(()=>{}).catch(()=>{})}static isTransportSafe(r){return r?!r[Symbol.asyncIterator]&&!r[t.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.getDefaultTransportSafeArgumentTypes().has(r.constructor?.name):!0}isTransportSafe(r){return r?!r[Symbol.asyncIterator]&&!r[t.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.transportSafeArgumentTypes.has(r.constructor?.name):!0}static generateId(){return[...new Array(8)].map(()=>t.RANDOM_DIGITS.charAt(Math.floor(Math.random()*t.RANDOM_DIGITS.length))).join("")}createPendingResult(r,e){if(Object.isFrozen(this.pendingResults))return Promise.reject(new Se(this,"RpcPeer has been killed (createPendingResult)"));let i=new Promise((s,n)=>{let o=t.generateId();this.pendingResults[o]={resolve:s,reject:n,method:r},e(o,a=>n(new Se(this,a.message,a)))});return i.catch(()=>{}),i}kill(r){if(Object.isFrozen(this.pendingResults))return;let e=new Se(this,r||"peer was killed");this.killedDeferred.reject(e);for(let i of Object.values(this.pendingResults))i.reject(e);for(let i of this.yieldedAsyncIterators)i.throw(e).catch(()=>{});this.yieldedAsyncIterators.clear(),this.pendingResults=Object.freeze({}),this.params=Object.freeze({}),this.remoteWeakProxies=Object.freeze({}),this.localProxyMap.clear(),this.localProxied.clear()}addSerializer(r,e,i){this.nameDeserializerMap.set(e,i),this.constructorSerializerMap.set(r,e)}finalize(r){t.remotesCollected++,delete this.remoteWeakProxies[r.id];let e={__local_proxy_id:r.id,__local_proxy_finalizer_id:r.finalizerId,type:"finalize"};this.send(e)}async getParam(r){return this.createPendingResult("getParam",(e,i)=>{let s={id:e,type:"param",param:r};this.send(s,i)})}createErrorResult(r,e){return r.result=this.serializeError(e),r.throw=!0,r}deserialize(r,e){if(!r)return r;let i=r[t.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN];if(i){if(Array.isArray(i)){let m=[];for(let b of i)m.push(this.deserialize(b,e));return m}let f={};for(let[m,b]of Object.entries(r))f[m]=this.deserialize(b,e);return f}let{__remote_proxy_id:s,__remote_proxy_finalizer_id:n,__local_proxy_id:o,__remote_constructor_name:a,__serialized_value:l,__remote_proxy_props:u,__remote_proxy_oneway_methods:h}=r;if(a===t.RPC_RESULT_ERROR_NAME)return this.deserializeError(l);if(s){let f=this.remoteWeakProxies[s]?.deref();f||(f=this.newProxy(s,a,u,h)),f[t.finalizerIdSymbol]=n;let m=this.nameDeserializerMap.get(a);return m?m.deserialize(f,e):f}if(o){let f=this.localProxyMap.get(o);if(!f)throw new Se(this,`invalid local proxy id ${o}`);return f}let p=this.nameDeserializerMap.get(a);return p?p.deserialize(l,e):r}deserializeError(r){let{name:e,stack:i,message:s}=r;return new Se(this,s,void 0,{name:e,stack:i})}serializeError(r){let e={stack:r.stack||"[no stack]",name:r.name||"[no name]",message:r.message||"[no message]"};return{__remote_constructor_name:t.RPC_RESULT_ERROR_NAME,__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_proxy_oneway_methods:void 0,__remote_proxy_props:void 0,__serialized_value:e}}serialize(r,e){if(r?.[t.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]===!0){if(Array.isArray(r)){let f=[];for(let m of r)f.push(this.serialize(m,e));return{[t.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]:f}}let p={};for(let[f,m]of Object.entries(r))p[f]=this.serialize(m,e);return p}if(this.isTransportSafe(r))return r;let i=r.__proxy_constructor||r.constructor?.name?.toString();if(r instanceof Error)return this.serializeError(r);let s=this.constructorSerializerMap.get(r.constructor);if(s){i=s;let p=this.nameDeserializerMap.get(s);if(!p)throw new Error("serializer not found for "+s);let f=p.serialize(r,e);return{__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_constructor_name:i,__remote_proxy_props:t.prepareProxyProperties(r),__remote_proxy_oneway_methods:r?.[t.PROPERTY_PROXY_ONEWAY_METHODS],__serialized_value:f}}let n=this.localProxied.get(r);if(n){let{proxyId:p,properties:f}=this.onProxySerialization?.(r)||{proxyId:n.id,properties:t.prepareProxyProperties(r)};if(p!==n.id)throw new Error("onProxySerialization proxy id mismatch");let m=t.generateId();return n.finalizerId=m,{__remote_proxy_id:p,__remote_proxy_finalizer_id:m,__remote_constructor_name:i,__remote_proxy_props:f,__remote_proxy_oneway_methods:r?.[t.PROPERTY_PROXY_ONEWAY_METHODS]}}let{__proxy_id:o,__proxy_peer:a}=r;if(o&&a===this)return{__local_proxy_id:o};this.onProxyTypeSerialization.get(i)?.(r);let{proxyId:l,properties:u}=this.onProxySerialization?.(r)||{proxyId:t.generateId(),properties:t.prepareProxyProperties(r)};return n={id:l,finalizerId:l},this.localProxied.set(r,n),this.localProxyMap.set(l,r),{__remote_proxy_id:l,__remote_proxy_finalizer_id:l,__remote_constructor_name:i,__remote_proxy_props:u,__remote_proxy_oneway_methods:r?.[t.PROPERTY_PROXY_ONEWAY_METHODS]}}newProxy(r,e,i,s){t.remotesCreated++;let n={id:r,finalizerId:void 0},o=new gs(this,n,e,i,s),a=e==="Function"||e==="AsyncFunction"?function(){}:o,l=new Proxy(a,o),u=new WeakRef(l);return this.remoteWeakProxies[r]=u,this.finalizers.register(o,n),l}handleMessage(r,e){try{t.activeRpcPeer=this,this.handleMessageInternal(r,e)}finally{t.activeRpcPeer=void 0}}sendResult(r,e){this.send(r,i=>{this.send(this.createErrorResult(r,i),void 0,e)},e)}async handleMessageInternal(r,e){if(!Object.isFrozen(this.pendingResults))try{switch(r.type){case"param":{let i=r,s={},n;try{n={type:"result",id:i.id,result:this.serialize(this.params[i.param],s)}}catch(o){this.createErrorResult(n,o)}this.sendResult(n,s);break}case"apply":{let i=r,s={type:"result",id:i.id||""},n={};try{let o=this.localProxyMap.get(i.proxyId);if(!o)throw new Error(`proxy id ${i.proxyId} not found`);let a=[];for(let u of i.args||[])a.push(this.deserialize(u,e));let l;if(i.method){if(!o[i.method])throw new Error(`target ${o?.constructor?.name} does not have method ${i.method}`);let h=t.getIteratorNext(o)===i.method;if(h&&this.yieldedAsyncIterators.delete(o),l=await o[i.method](...a),h){if(l.done)throw{name:"StopAsyncIteration",message:void 0};Object.isFrozen(this.pendingResults)?o.throw(new Se(this,"RpcPeer has been killed (yield)")).catch(()=>{}):this.yieldedAsyncIterators.add(o),l=l.value}}else l=await o(...a);s.result=this.serialize(l,n)}catch(o){this.createErrorResult(s,o)}i.oneway||this.sendResult(s,n);break}case"result":{let i=r,s=this.pendingResults[i.id];if(delete this.pendingResults[i.id],!s)throw new Error(`unknown result ${i.id}`);let n=this.deserialize(i.result,e);i.throw?s.reject(n):s.resolve(n);break}case"finalize":{let i=r,s=this.localProxyMap.get(i.__local_proxy_id);if(s){let n=this.localProxied.get(s);if(i.__local_proxy_finalizer_id&&i.__local_proxy_finalizer_id!==n?.finalizerId)break;this.localProxyMap.delete(i.__local_proxy_id),this.localProxied.delete(s)}break}default:throw new Error(`unknown rpc message type ${r.type}`)}}catch(i){console.error("unhandled rpc error",this.peerName,i);return}}};tt.RpcPeer=Y;function Qm(){return`
    (() => {
        ${gs}

        ${Y}

        ${Fd}

        return {
            startPeriodicGarbageCollection,
            RpcPeer,
            RpcProxy,
        };
    })();
    `}});var zd=C(_s=>{"use strict";Object.defineProperty(_s,"__esModule",{value:!0});_s.MediaObject=void 0;var Xm=Ee(),So=class{mimeType;data;__proxy_props;constructor(r,e,i){this.mimeType=r,this.data=e,this.__proxy_props={},i||={},i.mimeType=r,i.convert||=null,i.toMimeTypes||=null;for(let[s,n]of Object.entries(i))Xm.RpcPeer.isTransportSafe(n)&&(this.__proxy_props[s]=n),this[s]=n}async getData(){return Promise.resolve(this.data)}};_s.MediaObject=So});var xt=C(k=>{"use strict";Object.defineProperty(k,"__esModule",{value:!0});k.ScryptedMimeTypes=k.ScryptedInterface=k.MediaPlayerState=k.SecuritySystemObstruction=k.SecuritySystemMode=k.AirQuality=k.AirPurifierMode=k.AirPurifierStatus=k.ChargeState=k.LockState=k.PanTiltZoomMovement=k.ThermostatMode=k.TemperatureUnit=k.FanMode=k.HumidityMode=k.ScryptedDeviceType=k.ScryptedInterfaceDescriptors=k.ScryptedInterfaceMethod=k.ScryptedInterfaceProperty=k.DeviceBase=k.TYPES_VERSION=void 0;k.TYPES_VERSION="0.5.55";var Eo=class{};k.DeviceBase=Eo;var Nd;(function(t){t.id="id",t.info="info",t.interfaces="interfaces",t.mixins="mixins",t.name="name",t.nativeId="nativeId",t.pluginId="pluginId",t.providedInterfaces="providedInterfaces",t.providedName="providedName",t.providedRoom="providedRoom",t.providedType="providedType",t.providerId="providerId",t.room="room",t.type="type",t.scryptedRuntimeArguments="scryptedRuntimeArguments",t.on="on",t.brightness="brightness",t.colorTemperature="colorTemperature",t.rgb="rgb",t.hsv="hsv",t.buttons="buttons",t.sensors="sensors",t.running="running",t.paused="paused",t.docked="docked",t.temperatureSetting="temperatureSetting",t.temperature="temperature",t.temperatureUnit="temperatureUnit",t.humidity="humidity",t.resolution="resolution",t.audioVolumes="audioVolumes",t.recordingActive="recordingActive",t.ptzCapabilities="ptzCapabilities",t.lockState="lockState",t.entryOpen="entryOpen",t.batteryLevel="batteryLevel",t.chargeState="chargeState",t.online="online",t.fromMimeType="fromMimeType",t.toMimeType="toMimeType",t.converters="converters",t.binaryState="binaryState",t.tampered="tampered",t.sleeping="sleeping",t.powerDetected="powerDetected",t.audioDetected="audioDetected",t.motionDetected="motionDetected",t.ambientLight="ambientLight",t.occupied="occupied",t.flooded="flooded",t.ultraviolet="ultraviolet",t.luminance="luminance",t.position="position",t.securitySystemState="securitySystemState",t.pm10Density="pm10Density",t.pm25Density="pm25Density",t.vocDensity="vocDensity",t.noxDensity="noxDensity",t.co2ppm="co2ppm",t.airQuality="airQuality",t.airPurifierState="airPurifierState",t.filterChangeIndication="filterChangeIndication",t.filterLifeLevel="filterLifeLevel",t.humiditySetting="humiditySetting",t.fan="fan",t.applicationInfo="applicationInfo",t.chatCompletionCapabilities="chatCompletionCapabilities",t.systemDevice="systemDevice"})(Nd||(k.ScryptedInterfaceProperty=Nd={}));var jd;(function(t){t.listen="listen",t.probe="probe",t.setMixins="setMixins",t.setName="setName",t.setRoom="setRoom",t.setType="setType",t.getPluginJson="getPluginJson",t.turnOff="turnOff",t.turnOn="turnOn",t.setBrightness="setBrightness",t.getTemperatureMaxK="getTemperatureMaxK",t.getTemperatureMinK="getTemperatureMinK",t.setColorTemperature="setColorTemperature",t.setRgb="setRgb",t.setHsv="setHsv",t.pressButton="pressButton",t.sendNotification="sendNotification",t.start="start",t.stop="stop",t.pause="pause",t.resume="resume",t.dock="dock",t.setTemperature="setTemperature",t.setTemperatureUnit="setTemperatureUnit",t.getPictureOptions="getPictureOptions",t.takePicture="takePicture",t.getAudioStream="getAudioStream",t.setAudioVolumes="setAudioVolumes",t.startDisplay="startDisplay",t.stopDisplay="stopDisplay",t.getVideoStream="getVideoStream",t.getVideoStreamOptions="getVideoStreamOptions",t.getPrivacyMasks="getPrivacyMasks",t.setPrivacyMasks="setPrivacyMasks",t.getVideoTextOverlays="getVideoTextOverlays",t.setVideoTextOverlay="setVideoTextOverlay",t.getRecordingStream="getRecordingStream",t.getRecordingStreamCurrentTime="getRecordingStreamCurrentTime",t.getRecordingStreamOptions="getRecordingStreamOptions",t.getRecordingStreamThumbnail="getRecordingStreamThumbnail",t.deleteRecordingStream="deleteRecordingStream",t.setRecordingActive="setRecordingActive",t.ptzCommand="ptzCommand",t.getRecordedEvents="getRecordedEvents",t.getVideoClip="getVideoClip",t.getVideoClips="getVideoClips",t.getVideoClipThumbnail="getVideoClipThumbnail",t.removeVideoClips="removeVideoClips",t.setVideoStreamOptions="setVideoStreamOptions",t.startIntercom="startIntercom",t.stopIntercom="stopIntercom",t.lock="lock",t.unlock="unlock",t.addPassword="addPassword",t.getPasswords="getPasswords",t.removePassword="removePassword",t.activate="activate",t.deactivate="deactivate",t.isReversible="isReversible",t.closeEntry="closeEntry",t.openEntry="openEntry",t.getDevice="getDevice",t.releaseDevice="releaseDevice",t.adoptDevice="adoptDevice",t.discoverDevices="discoverDevices",t.createDevice="createDevice",t.getCreateDeviceSettings="getCreateDeviceSettings",t.reboot="reboot",t.getRefreshFrequency="getRefreshFrequency",t.refresh="refresh",t.getMediaStatus="getMediaStatus",t.load="load",t.seek="seek",t.skipNext="skipNext",t.skipPrevious="skipPrevious",t.convert="convert",t.convertMedia="convertMedia",t.getSettings="getSettings",t.putSetting="putSetting",t.armSecuritySystem="armSecuritySystem",t.disarmSecuritySystem="disarmSecuritySystem",t.setAirPurifierState="setAirPurifierState",t.getReadmeMarkdown="getReadmeMarkdown",t.getOauthUrl="getOauthUrl",t.onOauthCallback="onOauthCallback",t.canMixin="canMixin",t.getMixin="getMixin",t.releaseMixin="releaseMixin",t.onRequest="onRequest",t.onConnection="onConnection",t.onPush="onPush",t.run="run",t.eval="eval",t.loadScripts="loadScripts",t.saveScript="saveScript",t.forkInterface="forkInterface",t.getDetectionInput="getDetectionInput",t.getObjectTypes="getObjectTypes",t.detectObjects="detectObjects",t.generateObjectDetections="generateObjectDetections",t.getDetectionModel="getDetectionModel",t.setHumidity="setHumidity",t.setFan="setFan",t.startRTCSignalingSession="startRTCSignalingSession",t.createRTCSignalingSession="createRTCSignalingSession",t.getScryptedUserAccessControl="getScryptedUserAccessControl",t.generateVideoFrames="generateVideoFrames",t.connectStream="connectStream",t.getTTYSettings="getTTYSettings",t.getChatCompletion="getChatCompletion",t.streamChatCompletion="streamChatCompletion",t.getTextEmbedding="getTextEmbedding",t.getImageEmbedding="getImageEmbedding",t.callLLMTool="callLLMTool",t.getLLMTools="getLLMTools"})(jd||(k.ScryptedInterfaceMethod=jd={}));k.ScryptedInterfaceDescriptors={ScryptedDevice:{name:"ScryptedDevice",methods:["listen","probe","setMixins","setName","setRoom","setType"],properties:["id","info","interfaces","mixins","name","nativeId","pluginId","providedInterfaces","providedName","providedRoom","providedType","providerId","room","type"]},ScryptedPlugin:{name:"ScryptedPlugin",methods:["getPluginJson"],properties:[]},ScryptedPluginRuntime:{name:"ScryptedPluginRuntime",methods:[],properties:["scryptedRuntimeArguments"]},OnOff:{name:"OnOff",methods:["turnOff","turnOn"],properties:["on"]},Brightness:{name:"Brightness",methods:["setBrightness"],properties:["brightness"]},ColorSettingTemperature:{name:"ColorSettingTemperature",methods:["getTemperatureMaxK","getTemperatureMinK","setColorTemperature"],properties:["colorTemperature"]},ColorSettingRgb:{name:"ColorSettingRgb",methods:["setRgb"],properties:["rgb"]},ColorSettingHsv:{name:"ColorSettingHsv",methods:["setHsv"],properties:["hsv"]},Buttons:{name:"Buttons",methods:[],properties:["buttons"]},PressButtons:{name:"PressButtons",methods:["pressButton"],properties:[]},Sensors:{name:"Sensors",methods:[],properties:["sensors"]},Notifier:{name:"Notifier",methods:["sendNotification"],properties:[]},StartStop:{name:"StartStop",methods:["start","stop"],properties:["running"]},Pause:{name:"Pause",methods:["pause","resume"],properties:["paused"]},Dock:{name:"Dock",methods:["dock"],properties:["docked"]},TemperatureSetting:{name:"TemperatureSetting",methods:["setTemperature"],properties:["temperatureSetting"]},Thermometer:{name:"Thermometer",methods:["setTemperatureUnit"],properties:["temperature","temperatureUnit"]},HumiditySensor:{name:"HumiditySensor",methods:[],properties:["humidity"]},Camera:{name:"Camera",methods:["getPictureOptions","takePicture"],properties:[]},Resolution:{name:"Resolution",methods:[],properties:["resolution"]},Microphone:{name:"Microphone",methods:["getAudioStream"],properties:[]},AudioVolumeControl:{name:"AudioVolumeControl",methods:["setAudioVolumes"],properties:["audioVolumes"]},Display:{name:"Display",methods:["startDisplay","stopDisplay"],properties:[]},VideoCamera:{name:"VideoCamera",methods:["getVideoStream","getVideoStreamOptions"],properties:[]},VideoCameraMask:{name:"VideoCameraMask",methods:["getPrivacyMasks","setPrivacyMasks"],properties:[]},VideoTextOverlays:{name:"VideoTextOverlays",methods:["getVideoTextOverlays","setVideoTextOverlay"],properties:[]},VideoRecorder:{name:"VideoRecorder",methods:["getRecordingStream","getRecordingStreamCurrentTime","getRecordingStreamOptions","getRecordingStreamThumbnail"],properties:["recordingActive"]},VideoRecorderManagement:{name:"VideoRecorderManagement",methods:["deleteRecordingStream","setRecordingActive"],properties:[]},PanTiltZoom:{name:"PanTiltZoom",methods:["ptzCommand"],properties:["ptzCapabilities"]},EventRecorder:{name:"EventRecorder",methods:["getRecordedEvents"],properties:[]},VideoClips:{name:"VideoClips",methods:["getVideoClip","getVideoClips","getVideoClipThumbnail","removeVideoClips"],properties:[]},VideoCameraConfiguration:{name:"VideoCameraConfiguration",methods:["setVideoStreamOptions"],properties:[]},Intercom:{name:"Intercom",methods:["startIntercom","stopIntercom"],properties:[]},Lock:{name:"Lock",methods:["lock","unlock"],properties:["lockState"]},PasswordStore:{name:"PasswordStore",methods:["addPassword","getPasswords","removePassword"],properties:[]},Scene:{name:"Scene",methods:["activate","deactivate","isReversible"],properties:[]},Entry:{name:"Entry",methods:["closeEntry","openEntry"],properties:[]},EntrySensor:{name:"EntrySensor",methods:[],properties:["entryOpen"]},DeviceProvider:{name:"DeviceProvider",methods:["getDevice","releaseDevice"],properties:[]},DeviceDiscovery:{name:"DeviceDiscovery",methods:["adoptDevice","discoverDevices"],properties:[]},DeviceCreator:{name:"DeviceCreator",methods:["createDevice","getCreateDeviceSettings"],properties:[]},Battery:{name:"Battery",methods:[],properties:["batteryLevel"]},Charger:{name:"Charger",methods:[],properties:["chargeState"]},Reboot:{name:"Reboot",methods:["reboot"],properties:[]},Refresh:{name:"Refresh",methods:["getRefreshFrequency","refresh"],properties:[]},MediaPlayer:{name:"MediaPlayer",methods:["getMediaStatus","load","seek","skipNext","skipPrevious"],properties:[]},Online:{name:"Online",methods:[],properties:["online"]},BufferConverter:{name:"BufferConverter",methods:["convert"],properties:["fromMimeType","toMimeType"]},MediaConverter:{name:"MediaConverter",methods:["convertMedia"],properties:["converters"]},Settings:{name:"Settings",methods:["getSettings","putSetting"],properties:[]},BinarySensor:{name:"BinarySensor",methods:[],properties:["binaryState"]},TamperSensor:{name:"TamperSensor",methods:[],properties:["tampered"]},Sleep:{name:"Sleep",methods:[],properties:["sleeping"]},PowerSensor:{name:"PowerSensor",methods:[],properties:["powerDetected"]},AudioSensor:{name:"AudioSensor",methods:[],properties:["audioDetected"]},MotionSensor:{name:"MotionSensor",methods:[],properties:["motionDetected"]},AmbientLightSensor:{name:"AmbientLightSensor",methods:[],properties:["ambientLight"]},OccupancySensor:{name:"OccupancySensor",methods:[],properties:["occupied"]},FloodSensor:{name:"FloodSensor",methods:[],properties:["flooded"]},UltravioletSensor:{name:"UltravioletSensor",methods:[],properties:["ultraviolet"]},LuminanceSensor:{name:"LuminanceSensor",methods:[],properties:["luminance"]},PositionSensor:{name:"PositionSensor",methods:[],properties:["position"]},SecuritySystem:{name:"SecuritySystem",methods:["armSecuritySystem","disarmSecuritySystem"],properties:["securitySystemState"]},PM10Sensor:{name:"PM10Sensor",methods:[],properties:["pm10Density"]},PM25Sensor:{name:"PM25Sensor",methods:[],properties:["pm25Density"]},VOCSensor:{name:"VOCSensor",methods:[],properties:["vocDensity"]},NOXSensor:{name:"NOXSensor",methods:[],properties:["noxDensity"]},CO2Sensor:{name:"CO2Sensor",methods:[],properties:["co2ppm"]},AirQualitySensor:{name:"AirQualitySensor",methods:[],properties:["airQuality"]},AirPurifier:{name:"AirPurifier",methods:["setAirPurifierState"],properties:["airPurifierState"]},FilterMaintenance:{name:"FilterMaintenance",methods:[],properties:["filterChangeIndication","filterLifeLevel"]},Readme:{name:"Readme",methods:["getReadmeMarkdown"],properties:[]},OauthClient:{name:"OauthClient",methods:["getOauthUrl","onOauthCallback"],properties:[]},MixinProvider:{name:"MixinProvider",methods:["canMixin","getMixin","releaseMixin"],properties:[]},HttpRequestHandler:{name:"HttpRequestHandler",methods:["onRequest"],properties:[]},EngineIOHandler:{name:"EngineIOHandler",methods:["onConnection"],properties:[]},PushHandler:{name:"PushHandler",methods:["onPush"],properties:[]},Program:{name:"Program",methods:["run"],properties:[]},Scriptable:{name:"Scriptable",methods:["eval","loadScripts","saveScript"],properties:[]},ClusterForkInterface:{name:"ClusterForkInterface",methods:["forkInterface"],properties:[]},ObjectDetector:{name:"ObjectDetector",methods:["getDetectionInput","getObjectTypes"],properties:[]},ObjectDetection:{name:"ObjectDetection",methods:["detectObjects","generateObjectDetections","getDetectionModel"],properties:[]},ObjectDetectionPreview:{name:"ObjectDetectionPreview",methods:[],properties:[]},ObjectDetectionGenerator:{name:"ObjectDetectionGenerator",methods:[],properties:[]},HumiditySetting:{name:"HumiditySetting",methods:["setHumidity"],properties:["humiditySetting"]},Fan:{name:"Fan",methods:["setFan"],properties:["fan"]},RTCSignalingChannel:{name:"RTCSignalingChannel",methods:["startRTCSignalingSession"],properties:[]},RTCSignalingClient:{name:"RTCSignalingClient",methods:["createRTCSignalingSession"],properties:[]},LauncherApplication:{name:"LauncherApplication",methods:[],properties:["applicationInfo"]},ScryptedUser:{name:"ScryptedUser",methods:["getScryptedUserAccessControl"],properties:[]},VideoFrameGenerator:{name:"VideoFrameGenerator",methods:["generateVideoFrames"],properties:[]},StreamService:{name:"StreamService",methods:["connectStream"],properties:[]},TTY:{name:"TTY",methods:[],properties:[]},TTYSettings:{name:"TTYSettings",methods:["getTTYSettings"],properties:[]},ChatCompletion:{name:"ChatCompletion",methods:["getChatCompletion","streamChatCompletion"],properties:["chatCompletionCapabilities"]},TextEmbedding:{name:"TextEmbedding",methods:["getTextEmbedding"],properties:[]},ImageEmbedding:{name:"ImageEmbedding",methods:["getImageEmbedding"],properties:[]},LLMTools:{name:"LLMTools",methods:["callLLMTool","getLLMTools"],properties:[]},ScryptedSystemDevice:{name:"ScryptedSystemDevice",methods:[],properties:["systemDevice"]},ScryptedDeviceCreator:{name:"ScryptedDeviceCreator",methods:[],properties:[]},ScryptedSettings:{name:"ScryptedSettings",methods:[],properties:[]}};var qd;(function(t){t.Builtin="Builtin",t.Internal="Internal",t.Camera="Camera",t.Fan="Fan",t.Light="Light",t.Switch="Switch",t.Outlet="Outlet",t.Sensor="Sensor",t.Scene="Scene",t.Program="Program",t.Automation="Automation",t.Vacuum="Vacuum",t.Notifier="Notifier",t.Thermostat="Thermostat",t.Lock="Lock",t.PasswordControl="PasswordControl",t.Display="Display",t.SmartDisplay="SmartDisplay",t.Speaker="Speaker",t.SmartSpeaker="SmartSpeaker",t.RemoteDesktop="RemoteDesktop",t.Event="Event",t.Entry="Entry",t.Garage="Garage",t.DeviceProvider="DeviceProvider",t.DataSource="DataSource",t.API="API",t.Buttons="Buttons",t.Doorbell="Doorbell",t.Irrigation="Irrigation",t.Valve="Valve",t.Person="Person",t.SecuritySystem="SecuritySystem",t.WindowCovering="WindowCovering",t.Siren="Siren",t.AirPurifier="AirPurifier",t.Internet="Internet",t.Network="Network",t.Bridge="Bridge",t.LLM="LLM",t.Unknown="Unknown"})(qd||(k.ScryptedDeviceType=qd={}));var Bd;(function(t){t.Humidify="Humidify",t.Dehumidify="Dehumidify",t.Auto="Auto",t.Off="Off"})(Bd||(k.HumidityMode=Bd={}));var Ud;(function(t){t.Auto="Auto",t.Manual="Manual"})(Ud||(k.FanMode=Ud={}));var Vd;(function(t){t.C="C",t.F="F"})(Vd||(k.TemperatureUnit=Vd={}));var Wd;(function(t){t.Off="Off",t.Cool="Cool",t.Heat="Heat",t.HeatCool="HeatCool",t.Auto="Auto",t.FanOnly="FanOnly",t.Purifier="Purifier",t.Eco="Eco",t.Dry="Dry",t.On="On"})(Wd||(k.ThermostatMode=Wd={}));var Kd;(function(t){t.Absolute="Absolute",t.Relative="Relative",t.Continuous="Continuous",t.Preset="Preset",t.Home="Home"})(Kd||(k.PanTiltZoomMovement=Kd={}));var Yd;(function(t){t.Locked="Locked",t.Unlocked="Unlocked",t.Jammed="Jammed"})(Yd||(k.LockState=Yd={}));var Gd;(function(t){t.Trickle="trickle",t.Charging="charging",t.NotCharging="not-charging"})(Gd||(k.ChargeState=Gd={}));var Qd;(function(t){t.Inactive="Inactive",t.Idle="Idle",t.Active="Active",t.ActiveNightMode="ActiveNightMode"})(Qd||(k.AirPurifierStatus=Qd={}));var Xd;(function(t){t.Manual="Manual",t.Automatic="Automatic"})(Xd||(k.AirPurifierMode=Xd={}));var Zd;(function(t){t.Unknown="Unknown",t.Excellent="Excellent",t.Good="Good",t.Fair="Fair",t.Inferior="Inferior",t.Poor="Poor"})(Zd||(k.AirQuality=Zd={}));var Jd;(function(t){t.Disarmed="Disarmed",t.HomeArmed="HomeArmed",t.AwayArmed="AwayArmed",t.NightArmed="NightArmed"})(Jd||(k.SecuritySystemMode=Jd={}));var ep;(function(t){t.Sensor="Sensor",t.Occupied="Occupied",t.Time="Time",t.Error="Error"})(ep||(k.SecuritySystemObstruction=ep={}));var tp;(function(t){t.Idle="Idle",t.Playing="Playing",t.Paused="Paused",t.Buffering="Buffering"})(tp||(k.MediaPlayerState=tp={}));var ip;(function(t){t.ScryptedDevice="ScryptedDevice",t.ScryptedPlugin="ScryptedPlugin",t.ScryptedPluginRuntime="ScryptedPluginRuntime",t.OnOff="OnOff",t.Brightness="Brightness",t.ColorSettingTemperature="ColorSettingTemperature",t.ColorSettingRgb="ColorSettingRgb",t.ColorSettingHsv="ColorSettingHsv",t.Buttons="Buttons",t.PressButtons="PressButtons",t.Sensors="Sensors",t.Notifier="Notifier",t.StartStop="StartStop",t.Pause="Pause",t.Dock="Dock",t.TemperatureSetting="TemperatureSetting",t.Thermometer="Thermometer",t.HumiditySensor="HumiditySensor",t.Camera="Camera",t.Resolution="Resolution",t.Microphone="Microphone",t.AudioVolumeControl="AudioVolumeControl",t.Display="Display",t.VideoCamera="VideoCamera",t.VideoCameraMask="VideoCameraMask",t.VideoTextOverlays="VideoTextOverlays",t.VideoRecorder="VideoRecorder",t.VideoRecorderManagement="VideoRecorderManagement",t.PanTiltZoom="PanTiltZoom",t.EventRecorder="EventRecorder",t.VideoClips="VideoClips",t.VideoCameraConfiguration="VideoCameraConfiguration",t.Intercom="Intercom",t.Lock="Lock",t.PasswordStore="PasswordStore",t.Scene="Scene",t.Entry="Entry",t.EntrySensor="EntrySensor",t.DeviceProvider="DeviceProvider",t.DeviceDiscovery="DeviceDiscovery",t.DeviceCreator="DeviceCreator",t.Battery="Battery",t.Charger="Charger",t.Reboot="Reboot",t.Refresh="Refresh",t.MediaPlayer="MediaPlayer",t.Online="Online",t.BufferConverter="BufferConverter",t.MediaConverter="MediaConverter",t.Settings="Settings",t.BinarySensor="BinarySensor",t.TamperSensor="TamperSensor",t.Sleep="Sleep",t.PowerSensor="PowerSensor",t.AudioSensor="AudioSensor",t.MotionSensor="MotionSensor",t.AmbientLightSensor="AmbientLightSensor",t.OccupancySensor="OccupancySensor",t.FloodSensor="FloodSensor",t.UltravioletSensor="UltravioletSensor",t.LuminanceSensor="LuminanceSensor",t.PositionSensor="PositionSensor",t.SecuritySystem="SecuritySystem",t.PM10Sensor="PM10Sensor",t.PM25Sensor="PM25Sensor",t.VOCSensor="VOCSensor",t.NOXSensor="NOXSensor",t.CO2Sensor="CO2Sensor",t.AirQualitySensor="AirQualitySensor",t.AirPurifier="AirPurifier",t.FilterMaintenance="FilterMaintenance",t.Readme="Readme",t.OauthClient="OauthClient",t.MixinProvider="MixinProvider",t.HttpRequestHandler="HttpRequestHandler",t.EngineIOHandler="EngineIOHandler",t.PushHandler="PushHandler",t.Program="Program",t.Scriptable="Scriptable",t.ClusterForkInterface="ClusterForkInterface",t.ObjectDetector="ObjectDetector",t.ObjectDetection="ObjectDetection",t.ObjectDetectionPreview="ObjectDetectionPreview",t.ObjectDetectionGenerator="ObjectDetectionGenerator",t.HumiditySetting="HumiditySetting",t.Fan="Fan",t.RTCSignalingChannel="RTCSignalingChannel",t.RTCSignalingClient="RTCSignalingClient",t.LauncherApplication="LauncherApplication",t.ScryptedUser="ScryptedUser",t.VideoFrameGenerator="VideoFrameGenerator",t.StreamService="StreamService",t.TTY="TTY",t.TTYSettings="TTYSettings",t.ChatCompletion="ChatCompletion",t.TextEmbedding="TextEmbedding",t.ImageEmbedding="ImageEmbedding",t.LLMTools="LLMTools",t.ScryptedSystemDevice="ScryptedSystemDevice",t.ScryptedDeviceCreator="ScryptedDeviceCreator",t.ScryptedSettings="ScryptedSettings"})(ip||(k.ScryptedInterface=ip={}));var rp;(function(t){t.Url="text/x-uri",t.InsecureLocalUrl="text/x-insecure-local-uri",t.LocalUrl="text/x-local-uri",t.ServerId="text/x-server-id",t.PushEndpoint="text/x-push-endpoint",t.SchemePrefix="x-scrypted/x-scrypted-scheme-",t.MediaStreamUrl="text/x-media-url",t.MediaObject="x-scrypted/x-scrypted-media-object",t.RequestMediaObject="x-scrypted/x-scrypted-request-media-object",t.RequestMediaStream="x-scrypted/x-scrypted-request-stream",t.MediaStreamFeedback="x-scrypted/x-media-stream-feedback",t.FFmpegInput="x-scrypted/x-ffmpeg-input",t.FFmpegTranscodeStream="x-scrypted/x-ffmpeg-transcode-stream",t.RTCSignalingChannel="x-scrypted/x-scrypted-rtc-signaling-channel",t.RTCSignalingSession="x-scrypted/x-scrypted-rtc-signaling-session",t.RTCConnectionManagement="x-scrypted/x-scrypted-rtc-connection-management",t.Image="x-scrypted/x-scrypted-image"})(rp||(k.ScryptedMimeTypes=rp={}))});var Po=C(ei=>{"use strict";Object.defineProperty(ei,"__esModule",{value:!0});ei.SidebandBufferSerializer=ei.BufferSerializer=void 0;var vs=class{serialize(r){return console.warn("Using slow buffer serialization. Ensure the peer supports SidebandBufferSerializer."),r.toString("base64")}deserialize(r){return console.warn("Using slow buffer deserialization. Ensure the peer supports SidebandBufferSerializer."),Buffer.from(r,"base64")}};ei.BufferSerializer=vs;var To=class{bufferSerializer=new vs;serialize(r,e){if(!e)return this.bufferSerializer.serialize(r);let i=e.buffers=e.buffers||[];return i.push(r),i.length-1}deserialize(r,e){return e?.buffers?e.buffers[r]:this.bufferSerializer.deserialize(r)}};ei.SidebandBufferSerializer=To});var Ro=C(be=>{"use strict";Object.defineProperty(be,"__esModule",{value:!0});be.propertyInterfaces=be.allInterfaceProperties=void 0;be.getPropertyInterfaces=sp;be.getInterfaceMethods=np;be.getInterfaceProperties=op;be.isValidInterfaceMethod=Zm;be.isValidInterfaceProperty=Jm;var Ao=xt();be.allInterfaceProperties=[].concat(...Object.values(Ao.ScryptedInterfaceDescriptors).map(t=>t.properties));function sp(t){let r={};for(let e of Object.values(t))for(let i of e.properties)r[i]=e.name;return r}be.propertyInterfaces=sp(Ao.ScryptedInterfaceDescriptors);function np(t,r){return Object.values(t).filter(e=>r.has(e.name)).map(e=>e.methods).flat()}function op(t,r){return Object.values(t).filter(e=>r.has(e.name)).map(e=>e.properties).flat()}function Zm(t,r,e){return np(t,r).includes(e)||t[Ao.ScryptedInterface.ScryptedDevice].methods.includes(e)}function Jm(t,r,e){return op(t,new Set(r)).includes(e)}});var ap=C(Mo=>{"use strict";Object.defineProperty(Mo,"__esModule",{value:!0});Mo.checkProperty=ib;var ti=xt(),eb=Ee(),tb=Ro();function ib(t,r){if(t===ti.ScryptedInterfaceProperty.id)throw new Error("id is read only");if(t===ti.ScryptedInterfaceProperty.nativeId)throw new Error("nativeId is read only");if(t===ti.ScryptedInterfaceProperty.mixins)throw new Error("mixins is read only");if(t===ti.ScryptedInterfaceProperty.interfaces)throw new Error("interfaces is a read only post-mixin computed property, use providedInterfaces");if(eb.RpcPeer.isRpcProxy(r))throw new Error("value must be a primitive type");if(tb.propertyInterfaces[t.toString()]===ti.ScryptedInterface.ScryptedDevice&&t!==ti.ScryptedInterfaceProperty.info)throw new Error(`${t.toString()} can not be set. Use DeviceManager.onDevicesChanges or DeviceManager.onDeviceDiscovered to update the device description.`)}});var lp=C(it=>{"use strict";Object.defineProperty(it,"__esModule",{value:!0});it.StorageImpl=it.DeviceManagerImpl=it.DeviceStateProxyHandler=void 0;var rb=Ee(),sb=ap(),Lo=class{console;nativeId;api;logger;constructor(r,e,i){this.console=i,this.api=r,this.nativeId=e}async ensureLogger(){return this.logger||(this.logger=this.api.getLogger(this.nativeId)),await this.logger}async log(r,e){(await this.ensureLogger()).log(r,e)}a(r){this.log("a",r)}async clear(){(await this.ensureLogger()).clear()}async clearAlert(r){(await this.ensureLogger()).clearAlert(r)}async clearAlerts(){(await this.ensureLogger()).clearAlerts()}d(r){this.log("d",r)}e(r){this.log("e",r)}i(r){this.log("i",r)}v(r){this.log("v",r)}w(r){this.log("w",r)}},Di=class{deviceManager;id;setState;constructor(r,e,i){this.deviceManager=r,this.id=e,this.setState=i}get(r,e,i){return e==="id"?this.id:e===rb.RpcPeer.PROPERTY_PROXY_PROPERTIES?{id:this.id}:e==="setState"?this.setState:this.deviceManager.systemManager.state[this.id][e]?.value}set(r,e,i,s){return(0,sb.checkProperty)(e.toString(),i),this.deviceManager.systemManager.state[this.id][e]={value:i},this.setState(e.toString(),i),!0}};it.DeviceStateProxyHandler=Di;var Oo=class{systemManager;getDeviceConsole;getMixinConsole;api;nativeIds=new Map;deviceStorage=new Map;mixinStorage=new Map;constructor(r,e,i){this.systemManager=r,this.getDeviceConsole=e,this.getMixinConsole=i}async requestRestart(){return this.api.requestRestart()}getDeviceLogger(r){return new Lo(this.api,r,this.getDeviceConsole?.(r)||console)}getDeviceState(r){let e=new Di(this,this.nativeIds.get(r).id,(i,s)=>this.api.setState(r,i,s));return new Proxy(e,e)}createDeviceState(r,e){let i=new Di(this,r,e);return new Proxy(i,i)}getDeviceStorage(r){let e=this.deviceStorage.get(r);return e||(e=new Fi(this,r),this.deviceStorage.set(r,e)),e}getMixinStorage(r,e){let i=this.mixinStorage.get(e);i||(i=new Map,this.mixinStorage.set(e,i));let s=i.get(r);return s||(s=new Fi(this,e,`mixin:${r}:`),i.set(r,s)),s}pruneMixinStorage(){for(let r of this.nativeIds.keys()){let e=this.nativeIds.get(r).storage;for(let i of Object.keys(e)){if(!i.startsWith("mixin:"))continue;let[,s]=i.split(":");s&&!this.systemManager.state[s]&&delete e[i]}}}async onMixinEvent(r,e,i,s){return this.api.onMixinEvent(r,e,i,s)}getNativeIds(){return Array.from(this.nativeIds.keys())}async onDeviceDiscovered(r){return this.api.onDeviceDiscovered(r)}async onDeviceRemoved(r){return this.api.onDeviceRemoved(r)}async onDeviceEvent(r,e,i){return this.api.onDeviceEvent(r,e,i)}async onDevicesChanged(r){return this.api.onDevicesChanged(r)}};it.DeviceManagerImpl=Oo;function ys(t){return t===null?"null":t===void 0?"undefined":t.toString()}var Fi=class t{deviceManager;nativeId;prefix;api;static allowedMethods=["length","clear","getItem","setItem","key","removeItem"];static indexedHandler={get(r,e){let i=e.toString();if(t.allowedMethods.includes(i)){let s=r[i];return i==="length"?s:s.bind(r)}return r.getItem(ys(e))},set(r,e,i){return r.setItem(ys(e),i),!0}};constructor(r,e,i){return this.deviceManager=r,this.nativeId=e,this.prefix=i,this.deviceManager=r,this.api=r.api,this.nativeId=e,this.prefix||(this.prefix=""),new Proxy(this,t.indexedHandler)}get storage(){return this.deviceManager.nativeIds.get(this.nativeId).storage}get length(){return Object.keys(this.storage).filter(r=>r.startsWith(this.prefix)).length}clear(){if(!this.prefix)this.deviceManager.nativeIds.get(this.nativeId).storage={};else{let r=this.storage;Object.keys(this.storage).filter(e=>e.startsWith(this.prefix)).forEach(e=>delete r[e])}this.api.setStorage(this.nativeId,this.storage)}getItem(r){return this.storage[this.prefix+r]}key(r){return this.prefix?Object.keys(this.storage).filter(e=>e.startsWith(this.prefix))[r].substring(this.prefix.length):Object.keys(this.storage)[r]}removeItem(r){delete this.storage[this.prefix+r],this.api.setStorage(this.nativeId,this.storage)}setItem(r,e){r=ys(r),e=ys(e),this.storage[this.prefix+r]!==e&&(this.storage[this.prefix+r]=e,this.api.setStorage(this.nativeId,this.storage))}};it.StorageImpl=Fi});var cp=C(xs=>{"use strict";Object.defineProperty(xs,"__esModule",{value:!0});xs.EndpointManagerImpl=void 0;var ii=xt(),Io=class{deviceManager;api;pluginId;mediaManager;getEndpoint(r){if(!r)return this.pluginId;let e=this.deviceManager.nativeIds.get(r)?.id;if(!e)throw new Error("invalid nativeId "+r);return r?e:this.pluginId}async getUrlSafeIp(){let r=await this.api.getComponent("SCRYPTED_IP_ADDRESS");return r?.includes(":")?`[${r}]`:r}async getAuthenticatedPath(r){return this.getPath(r)}async getInsecurePublicLocalEndpoint(r){return this.getLocalEndpoint(r,{insecure:!0,public:!0})}async getPublicCloudEndpoint(r){return this.getCloudEndpoint(r,{public:!0})}async getPublicLocalEndpoint(r){return this.getLocalEndpoint(r,{public:!0})}async getPublicPushEndpoint(r){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(r)),ii.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,ii.ScryptedMimeTypes.PushEndpoint)}async getPath(r,e){return`/endpoint/${this.getEndpoint(r)}/${e?.public?"public/":""}`}async getLocalEndpoint(r,e){let i=e?.insecure?"http":"https",s=await this.api.getComponent(e?.insecure?"SCRYPTED_INSECURE_PORT":"SCRYPTED_SECURE_PORT"),n=await this.getPath(r,e);return`${i}://${await this.getUrlSafeIp()}:${s}${n}`}async getCloudEndpoint(r,e){let i=await this.getLocalEndpoint(r,e),s=await this.mediaManager.createMediaObject(Buffer.from(i),ii.ScryptedMimeTypes.LocalUrl);return this.mediaManager.convertMediaObjectToUrl(s,ii.ScryptedMimeTypes.LocalUrl)}async getCloudPushEndpoint(r){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(r)),ii.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,ii.ScryptedMimeTypes.PushEndpoint)}async setLocalAddresses(r){return(await this.api.getComponent("addresses")).setLocalAddresses(r)}async getLocalAddresses(){return await(await this.api.getComponent("addresses")).getLocalAddresses()}async setAccessControlAllowOrigin(r){let e=this;return(await this.deviceManager.systemManager.getComponent("setAccessControlAllowOrigin"))(r)}};xs.EndpointManagerImpl=Io});var dp=C(wt=>{"use strict";Object.defineProperty(wt,"__esModule",{value:!0});wt.WebSocketSerializer=wt.WebSocketConnection=void 0;wt.createWebSocketClass=nb;var Ho=Ee(),Do=class{events={};dispatchEvent(r){let e=this.events[r.type];if(e)for(let i of e)i(r)}addEventListener(r,e){let i=this.events[r];i||(i=this.events[r]=[]),i.push(e)}removeEventListener(r,e){let i=this.events[r];if(!i)return;let s=i.indexOf(e);s>-1&&i.splice(s,1)}};function ws(t,r){Object.defineProperty(t,"on"+r,{get:function(){throw new Error(`${r} is write only`)},set:function(e){this.events[r]=[e]}})}function nb(t){class r extends Do{connection;_url;_protocols;readyState;constructor(i,s){super(),this.connection=i,this._url=i.url,this._protocols=s,this.readyState=0,t(i,{connect:(n,o)=>{if(n!=null){this.dispatchEvent({type:"error",message:n.toString()});return}this.readyState=1,this.dispatchEvent({type:"open"})},end:()=>{this.readyState=3,this.dispatchEvent({type:"close",reason:"closed"})},error:n=>{this.readyState=3,this.dispatchEvent({type:"error",message:n.toString()})},data:n=>{this.dispatchEvent({type:"message",data:n,source:this})}})}send(i){this.connection.send(i)}get url(){return this._url}get extensions(){return""}close(i){this.connection.close(i)}}return ws(r.prototype,"close"),ws(r.prototype,"error"),ws(r.prototype,"message"),ws(r.prototype,"open"),r}var Fo=class{url;websocketMethods;[Ho.RpcPeer.PROPERTY_PROXY_PROPERTIES];[Ho.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=["send","close"];constructor(r,e){this.url=r,this.websocketMethods=e,this[Ho.RpcPeer.PROPERTY_PROXY_PROPERTIES]={url:r}}send(r){return this.websocketMethods.send(r)}close(r){return this.websocketMethods.close(r)}};wt.WebSocketConnection=Fo;var zo=class{WebSocket;serialize(r,e){throw new Error("WebSocketSerializer should only be used for deserialization.")}deserialize(r,e){if(this.WebSocket)return new this.WebSocket(r)}};wt.WebSocketSerializer=zo});var up=C(kt=>{"use strict";Object.defineProperty(kt,"__esModule",{value:!0});kt.EventRegistry=kt.EventListenerRegisterImpl=void 0;kt.getMixinEventName=pp;var ob=xt(),zi=class{removeListener;constructor(r){this.removeListener=r}};kt.EventListenerRegisterImpl=zi;function pp(t){let{event:r,mixinId:e}=t||{};return!r&&typeof t=="string"&&(r=t),r||(r=void 0),e?`${r}-mixin-${e}`:r}var ab=new Set([ob.ScryptedInterface.ScryptedDevice,"Logger"]),No=class{systemListeners=new Set;listeners={};listen(r){let e=this.systemListeners;return e.add(r),new zi(()=>{e.delete(r),r=void 0})}listenDevice(r,e,i){let s=pp(e),n=`${r}#${s}`,o=this.listeners[n];return o||(o=new Set,this.listeners[n]=o),o.add(i),new zi(()=>{o.delete(i),i=void 0})}notify(r,e,i,s,n,o){let{changed:a,mixinId:l}=o||{};if(s&&!a)return!1;let u={eventId:void 0,eventInterface:i,eventTime:e,property:s,mixinId:l};return this.notifyEventDetails(r,u,n)}notifyEventDetails(r,e,i,s){if(e.eventId||=Math.random().toString(36).substring(2),s||=e.eventInterface,e.property&&!e.mixinId||ab.has(s))for(let a of this.systemListeners)a(r,e,i);let n=this.listeners[`${r}#${s}`];if(n)for(let a of n)a(e,i);let o=this.listeners[`${r}#undefined`];if(o)for(let a of o)a(e,i);return!0}};kt.EventRegistry=No});var fp=C(ks=>{"use strict";Object.defineProperty(ks,"__esModule",{value:!0});ks.SystemManagerImpl=void 0;var J=xt(),lb=up(),jo=Ee(),Ct=Ro();function cb(t,r){let e=new qo(t,r);return new Proxy(e,e)}var qo=class{id;systemManager;customProperties;device;constructor(r,e){this.id=r,this.systemManager=e}toPrimitive(){return`ScryptedDevice-${this.id}`}ownKeys(r){let e=new Set(this.systemManager.state[this.id].interfaces.value),i=(0,Ct.getInterfaceMethods)(this.systemManager.descriptors||J.ScryptedInterfaceDescriptors,e),s=(0,Ct.getInterfaceProperties)(this.systemManager.descriptors||J.ScryptedInterfaceDescriptors,e);return[...i,...s]}getOwnPropertyDescriptor(r,e){let i=new Set(this.systemManager.state[this.id].interfaces.value),s=(0,Ct.getInterfaceMethods)(this.systemManager.descriptors||J.ScryptedInterfaceDescriptors,i),n=e.toString();if(s.includes(n))return{configurable:!0};if((0,Ct.getInterfaceProperties)(this.systemManager.descriptors||J.ScryptedInterfaceDescriptors,i).includes(n))return{configurable:!0,value:this.systemManager.state[this.id][n]?.value}}deleteProperty(r,e){let i=e.toString();return Object.keys(J.ScryptedInterfaceProperty).includes(i)?!1:(this.customProperties||=new Map,this.customProperties.set(e,void 0),!0)}set(r,e,i,s){let n=e.toString();return Object.keys(J.ScryptedInterfaceProperty).includes(n)?!1:(this.customProperties||=new Map,this.customProperties.set(e,i),!0)}get(r,e,i){if(e==="id")return this.id;if(this.customProperties?.has(e))return this.customProperties.get(e);let s=jo.RpcPeer.handleFunctionInvocations(this,r,e,i);if(s)return s;let n=new Set(this.systemManager.state[this.id].interfaces?.value||[]),o=e.toString();if(this.systemManager.propertyInterfaces?.[o]||Ct.propertyInterfaces[o])return this.systemManager.state[this.id]?.[e]?.value;if((0,Ct.isValidInterfaceMethod)(this.systemManager.descriptors||J.ScryptedInterfaceDescriptors,n,o))return J.ScryptedInterfaceDescriptors[J.ScryptedInterface.ScryptedDevice].methods.includes(o)?this[e].bind(this):new Proxy(()=>e,this)}ensureDevice(){return this.device||(this.device=this.systemManager.api.getDeviceById(this.id)),this.device}async apply(r,e,i){let s=r();return(await this.ensureDevice())[s](...i)}listen(r,e){return this.systemManager.listenDevice(this.id,r,e)}async setName(r){return this.systemManager.api.setDeviceProperty(this.id,J.ScryptedInterfaceProperty.name,r)}async setRoom(r){return this.systemManager.api.setDeviceProperty(this.id,J.ScryptedInterfaceProperty.room,r)}async setType(r){return this.systemManager.api.setDeviceProperty(this.id,J.ScryptedInterfaceProperty.type,r)}async setMixins(r){await(await this.systemManager.getComponent("plugins")).setMixins(this.id,r)}async probe(){return this.apply(()=>"probe",void 0,[])}},Bo=class{promise;constructor(r){this.promise=r}async removeListener(){try{let r=await this.promise;this.promise=void 0,r?.removeListener()}catch(r){console.error("removeListener",r)}}};function hp(t){let r=t,e=r[jo.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]||[];return e.includes(null)||e.push(null),r[jo.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=e,t}var Uo=class{api;state;deviceProxies={};log;events=new lb.EventRegistry;typesVersion;descriptors;propertyInterfaces;getDeviceState(r){return this.state[r]}getSystemState(){return this.state}getDeviceById(r,e){let i;if(this.state[r]){if(e!=null)return;i=r}else for(let n of Object.keys(this.state)){let o=this.state[n];if(o&&o[J.ScryptedInterfaceProperty.pluginId]?.value===r&&o[J.ScryptedInterfaceProperty.nativeId]?.value==e){i=n;break}}if(!i)return;let s=this.deviceProxies[i];return s||(s=this.deviceProxies[i]=cb(i,this)),s}getDeviceByName(r){for(let e of Object.keys(this.state)){let i=this.state[e];if(i.interfaces?.value?.includes(J.ScryptedInterface.ScryptedPlugin)&&i.pluginId?.value===r)return this.getDeviceById(e);if(i.name.value===r)return this.getDeviceById(e)}}listen(r){return this.events.listen(hp((e,i,s)=>r(this.getDeviceById(e),i,s)))}listenDevice(r,e,i){let{watch:s}=e||{};return s?this.events.listenDevice(r,e,(n,o)=>i(this.getDeviceById(r),n,o)):new Bo(this.api.listenDevice(r,e,hp((n,o)=>i(this.getDeviceById(r),n,o))))}async removeDevice(r){return this.api.removeDevice(r)}getComponent(r){return this.api.getComponent(r)}setScryptedInterfaceDescriptors(r,e){return this.typesVersion=r,this.descriptors=e,this.propertyInterfaces=(0,Ct.getPropertyInterfaces)(e),this.api.setScryptedInterfaceDescriptors(r,e)}};ks.SystemManagerImpl=Uo});var mp=C(Cs=>{"use strict";Object.defineProperty(Cs,"__esModule",{value:!0});Cs.ClusterManagerImpl=void 0;var Vo=class{clusterMode;api;clusterWorkerId;clusterServicePromise;constructor(r,e,i){this.clusterMode=r,this.api=e,this.clusterWorkerId=i}getClusterWorkerId(){return this.clusterWorkerId}getClusterAddress(){return process.env.SCRYPTED_CLUSTER_ADDRESS}getClusterMode(){return this.clusterMode}async getClusterWorkers(){return(await this.getClusterService()).getClusterWorkers()}getClusterService(){return this.clusterServicePromise||=this.api.getComponent("cluster-fork"),this.clusterServicePromise}};Cs.ClusterManagerImpl=Vo});var _p=C($s=>{"use strict";Object.defineProperty($s,"__esModule",{value:!0});$s.setupPluginRemote=hb;$s.attachPluginRemote=fb;var ri=xt(),Ko=Ee(),gp=Po(),bp=lp(),db=cp(),Wo=dp(),pb=fp(),ub=mp();async function hb(t,r,e,i,s){try{t.constructorSerializerMap.get(Buffer)||t.addSerializer(Buffer,"Buffer",new gp.BufferSerializer);let o=await(await t.getParam("getRemote"))(r,e,i),a=t.tags.acl,l=(h,p)=>{if(p=p||s()[h],a&&p){p=Object.assign({},p);for(let m of Object.keys(p))a.shouldRejectProperty(h,m)&&delete p[m];let f=p.interfaces?.value;f&&(f=f.filter(m=>!a.shouldRejectInterface(h,m)),p.interfaces={value:f})}return p},u=()=>{let h=s();if(a){h=Object.assign({},h);for(let p of Object.keys(h)){if(a.shouldRejectDevice(p)){delete h[p];continue}h[p]=l(p,h[p])}}return h};return await o.setSystemState(u()),r.listen((h,p,f)=>{if(!a?.shouldRejectEvent(p.property===ri.ScryptedInterfaceProperty.id?f:h,p)){if(p.eventInterface===ri.ScryptedInterface.ScryptedDevice){p.property===ri.ScryptedInterfaceProperty.id?o.updateDeviceState(f,void 0):o.updateDeviceState(h,l(h));return}p.property&&!p.mixinId?o.notify(h,p,s()[h]?.[p.property]).catch(()=>{}):o.notify(h,p,f).catch(()=>{})}}),o}catch(n){throw new Ko.RPCResultError(t,"error while retrieving PluginRemote",n)}}function fb(t,r){let{createMediaManager:e,getServicePort:i,getDeviceConsole:s,getMixinConsole:n}=r||{};t.constructorSerializerMap.get(Buffer)||t.addSerializer(Buffer,"Buffer",new gp.BufferSerializer);let o={},a=new Wo.WebSocketSerializer;t.addSerializer(Wo.WebSocketConnection,"WebSocketConnection",a);let l,u=new Promise(h=>l=h);return t.params.getRemote=async(h,p,f)=>{a.WebSocket=(0,Wo.createWebSocketClass)((w,E)=>{let{url:L}=w;if(L.startsWith("io://")||L.startsWith("ws://")){let j=L.substring(5);o[j]=E,E.connect(void 0,{close:N=>w.close(N),send:N=>w.send(N)})}else throw new Error("unsupported websocket")}),h=await r?.onGetRemote?.(h,p)||h;let m=new pb.SystemManagerImpl,b=new bp.DeviceManagerImpl(m,s,n),x=new db.EndpointManagerImpl,v=new ub.ClusterManagerImpl(void 0,h,void 0),$=await h.getMediaManager();$||(t.params.createMediaManager=async()=>e(m,b));let D=$||await e(m,b);t.params.mediaManager=D,m.api=h,b.api=h;let z=b.getDeviceLogger(void 0);m.log=z;let R={systemManager:m,deviceManager:b,endpointManager:x,mediaManager:D,clusterManager:v,log:z,pluginHostAPI:h,pluginRemoteAPI:void 0,serverVersion:f?.serverVersion,connect:void 0,fork:void 0,connectRPCObject:void 0};delete t.params.getRemote,x.api=h,x.deviceManager=b,x.mediaManager=D,x.pluginId=p;let V=new bp.StorageImpl(b,void 0),G={[Ko.RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION]:!0,[Ko.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]:["notify","updateDeviceState","setSystemState","ioEvent","setNativeId"],getServicePort:i,async createDeviceState(w,E){return b.createDeviceState(w,E)},async ioEvent(w,E,L){let j=o[w];if(j)switch(E){case"message":j.data(L);break;case"close":j.end(),delete o[w];break}},async setNativeId(w,E,L){w===null&&(w=void 0),E?b.nativeIds.set(w?.toString(),{id:E,storage:L}):b.nativeIds.delete(w)},async updateDeviceState(w,E){E?(m.state[w]=E,m.events.notify(w,void 0,ri.ScryptedInterface.ScryptedDevice,void 0,E,{changed:!0})):(delete m.state[w],m.events.notify(void 0,void 0,ri.ScryptedInterface.ScryptedDevice,ri.ScryptedInterfaceProperty.id,w,{changed:!0}))},async notify(w,E,L,j,N,Et){if(typeof E=="number"){let ae=E,le=L;if(j){let ce=m.state?.[w];if(!ce){z.w(`state not found for ${w}`);return}ce[j]=N,m.events.notify(w,ae,le,j,N.value,{changed:Et})}else m.events.notify(w,ae,le,j,N,{changed:Et})}else{let ae=E,le=L;if(ae.property&&!ae.mixinId){let ce=m.state?.[w];if(!ce){z.w(`state not found for ${w}`);return}ce[ae.property]=le,m.events.notifyEventDetails(w,ae,le.value)}else m.events.notifyEventDetails(w,ae,le)}},async setSystemState(w){m.state=w,b.pruneMixinStorage(),l(R)},async loadZip(w,E,L){let j={__filename:void 0,deviceManager:b,systemManager:m,mediaManager:D,endpointManager:x,localStorage:V,pluginHostAPI:h,WebSocket:function(N){if(typeof N=="string")throw new Error("unsupported websocket");return N},pluginRuntimeAPI:R};j.pluginRuntimeAPI=R;try{return await r.onLoadZip(R,j,w,E,L)}catch(N){throw console.error("plugin start/fork failed",N),N}}};return R.pluginRemoteAPI=G,G},u}});var Go=C(si=>{"use strict";Object.defineProperty(si,"__esModule",{value:!0});si.createDuplexRpcPeer=gb;si.createRpcSerializer=vp;si.createRpcDuplexSerializer=Yo;si.createDataChannelSerializer=_b;var mb=Po(),bb=Ee();function gb(t,r,e,i){let s=Yo(i),n=new bb.RpcPeer(t,r,(o,a,l)=>{try{s.sendMessage(o,a,l)}catch(u){a?.(u),e.destroy()}});return s.setupRpcPeer(n),e.on("data",o=>s.onData(o)),e.on("close",s.onDisconnected),e.on("error",s.onDisconnected),n}function vp(t){let r,{sendMessageBuffer:e,sendMessageFinish:i}=t,s=!0,n=()=>{s=!1,r.kill("connection closed.")},o=(f,m,b)=>{if(!s){m?.(new Error("peer disconnected"));return}let x=b?.buffers;if(x)for(let v of x)e(v);i(f)},a;return{kill:f=>{r.kill(f)},sendMessage:o,setupRpcPeer:f=>{r=f,r.addSerializer(Buffer,"Buffer",new mb.SidebandBufferSerializer),r.constructorSerializerMap.set(Uint8Array,"Buffer")},onMessageBuffer:f=>{a=a||{},a.buffers||=[],a.buffers.push(f)},onMessageFinish:f=>{let m=a;a=void 0,r.handleMessage(f,m)},onDisconnected:n}}function Yo(t){let r=(p,f)=>{let m=Buffer.alloc(5);m.writeUInt32BE(f.length+1,0),m.writeUInt8(p,4),t.write(Buffer.concat([m,f]))},e=p=>f=>r(p,f),i=e(1),s=e(0),n=vp({sendMessageBuffer:i,sendMessageFinish:p=>s(Buffer.from(JSON.stringify(p)))}),o,a,l,u;return{onData:p=>{for(;p.length;){if(!a){if(o?o=Buffer.concat([o,p]):o=p,o.length<5)return;p=o.slice(5);let b=o.readUInt32BE(0)-1;u=o.readUInt8(4),p.length>=b&&u===0?(a=p.length===b?p:p.slice(0,b),l=b,p=p.slice(b)):(a=Buffer.alloc(b),l=0),o=void 0}let f=a.length-l;if(f){let b=p.slice(0,f);p=p.slice(f),a.set(b,l),l+=b.length}if(l!==a.length)return;let m=a;if(a=void 0,u===0)try{let b=JSON.parse(m.toString());n.onMessageFinish(b)}catch(b){n.kill("message parse failure "+b.message)}else n.onMessageBuffer(m)}},setupRpcPeer:n.setupRpcPeer,sendMessage:n.sendMessage,onDisconnected:n.onDisconnected}}function _b(t){let r;function i(){if(!r||r.length===0)return;let a=r;r=void 0;for(let l of a){let u=0;for(;u<l.length;){let h=l.length-u,p=Math.min(h,16384),f=l.subarray(u,u+p);t.send(f),u+=p}}}function s(a){let l=!!r;r||(r=[]),r.push(a),l||setTimeout(()=>i(),0)}return Yo({write:a=>{s(a)}})}});var yp=C((N1,vb)=>{vb.exports={name:"@scrypted/client",version:"1.3.26",description:"",main:"dist/packages/client/src/index.js",scripts:{prebuild:"rimraf dist",build:"tsc --outDir dist",prepublishOnly:"npm run build",test:'echo "Error: no test specified" && exit 1'},author:"",license:"ISC",devDependencies:{"@types/ip":"^1.1.3","@types/node":"^24.0.10","@types/ws":"^8.18.1","ts-node":"^10.9.2",typescript:"^5.8.3"},peerDependencies:{"@scrypted/types":"^0.5.44"},dependencies:{"engine.io-client":"^6.6.3","follow-redirects":"^1.15.9",rimraf:"^6.0.1"}}});var kp=C(Ni=>{"use strict";Object.defineProperty(Ni,"__esModule",{value:!0});Ni.isIPV4Address=xp;Ni.isIPV6Address=wp;Ni.isIPAddress=wb;var yb=/^(\d{1,3}\.){3,3}\d{1,3}$/,xb=/^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;function xp(t){return yb.test(t)}function wp(t){return xb.test(t)}function wb(t){return xp(t)||wp(t)}});var Qo=C(re=>{"use strict";Object.defineProperty(re,"__esModule",{value:!0});re.fetchStatusCodeOk=Cp;re.checkStatus=$p;re.getFetchMethod=Sp;re.getHttpFetchAccept=Ep;re.hasHeader=Ss;re.removeHeader=Tp;re.setHeader=Es;re.setDefaultHttpFetchAccept=Pp;re.createHeadersArray=Ap;re.createStringOrBufferBody=Rp;re.domFetchParseIncomingMessage=Mp;re.domFetch=kb;function Cp(t){return t>=200&&t<=299}function $p(t){if(!Cp(t))throw new Error(`http response statusCode ${t}`);return!0}function Sp(t){return t.method||(t.body?"POST":"GET")}function Ep(t){switch(t){case"json":return"application/json";case"text":return"text/plain"}}function Ss(t,r){return r=r.toLowerCase(),t.find(([e])=>e.toLowerCase()===r)}function Tp(t,r){r=r.toLowerCase();let e=t.filter(([i,s])=>i.toLowerCase()!==r);t.length=0,e.forEach(i=>t.push(i))}function Es(t,r,e){Tp(t,r),t.push([r,e])}function Pp(t,r){if(Ss(t,"Accept"))return;let e=Ep(r);e&&Es(t,"Accept",e)}function Ap(t){let r=[];if(!t)return r;if(t instanceof Headers){for(let[e,i]of t.entries())r.push([e,i]);return r}if(t instanceof Array){for(let[e,i]of t)r.push([e,i]);return r}for(let e of Object.keys(t)){let i=t[e];r.push([e,i])}return r}function Rp(t,r){let e;return typeof r=="object"?(r=JSON.stringify(r),e="application/json"):typeof r=="string"&&(e="text/plain"),e&&!Ss(t,"Content-Type")&&Es(t,"Content-Type",e),Ss(t,"Content-Length")||(r=Buffer.from(r),Es(t,"Content-Length",r.length.toString())),r}async function Mp(t,r){switch(r){case"json":return t.json();case"text":return t.text();case"readable":return t}return new Uint8Array(await t.arrayBuffer())}async function kb(t){let r=Ap(t.headers);Pp(r,t.responseType);let{body:e}=t;e&&!(e instanceof ReadableStream)&&(e=Rp(r,e));let i,s;t.timeout&&(i=new AbortController,s=setTimeout(()=>i.abort(),t.timeout),t.signal?.addEventListener("abort",()=>i.abort(t.signal?.reason)));try{let{url:n}=t,o=await fetch(n,{method:Sp(t),credentials:t.withCredentials?"include":void 0,headers:r,signal:i?.signal||t.signal,body:e});if(t?.checkStatusCode===void 0||t?.checkStatusCode)try{if(!(typeof t?.checkStatusCode=="function"?t.checkStatusCode:$p)(o.status))throw new Error(`http response statusCode ${o.status}`)}catch(a){throw o.arrayBuffer().catch(()=>{}),a}return{statusCode:o.status,headers:o.headers,body:await Mp(o,t.responseType)}}finally{clearTimeout(s)}}});var $t={};Au($t,{default:()=>Cb});var Cb,St=Pu(()=>{"use strict";Cb={}});var Ip=C(qi=>{"use strict";Object.defineProperty(qi,"__esModule",{value:!0});qi.getHttpFetchParser=Lp;qi.httpFetchParseIncomingMessage=Op;qi.httpFetch=Pb;var ji=Qo();async function Ts(t){let r=[];t.on("data",i=>r.push(i));let{once:e}=(St(),At($t));return await e(t,"end"),Buffer.concat(r)}var $b={async parse(t){return(await Ts(t)).toString()}},Sb={async parse(t){return JSON.parse((await Ts(t)).toString())}},Eb={async parse(t){return Ts(t)}},Tb={async parse(t){return t}};function Lp(t){switch(t){case"json":return Sb;case"text":return $b;case"readable":return Tb}return Eb}function Op(t,r){return Lp(r).parse(t)}async function Pb(t){let r=(0,ji.createHeadersArray)(t.headers);(0,ji.setDefaultHttpFetchAccept)(r,t.responseType);let{once:e}=(St(),At($t)),{PassThrough:i,Readable:s}=(St(),At($t)),{http:n,https:o}=(St(),At($t)),{url:a}=t,u=a.toString().startsWith("https:")?o:n,{body:h}=t;if(h&&!(h instanceof s)){let v=new i;v.write(Buffer.from((0,ji.createStringOrBufferBody)(r,h))),v.end(),h=v}let p,f;t.timeout&&(p=new AbortController,f=setTimeout(()=>p.abort(),t.timeout),t.signal?.addEventListener("abort",()=>p.abort(t.signal?.reason)));let m=p?.signal||t.signal;m?.addEventListener("abort",()=>x.destroy(new Error(t.signal?.reason||"abort")));let b={};for(let[v,$]of r)b[v]?b[v].push($):b[v]=[$];let x=u.request(a,{method:(0,ji.getFetchMethod)(t),rejectUnauthorized:t.rejectUnauthorized,family:t.family,headers:b,signal:m,timeout:t.timeout});h?h.pipe(x):x.end();try{let[v]=await e(x,"response");if(t?.checkStatusCode===void 0||t?.checkStatusCode)try{let D=typeof t?.checkStatusCode=="function"?t.checkStatusCode:ji.checkStatus;if(!v.statusCode||!D(v.statusCode))throw new Error(`http response statusCode ${v.statusCode}`)}catch(D){throw Ts(v).catch(()=>{}),D}let $=new Headers;for(let[D,z]of Object.entries(v.headers))for(let R of typeof z=="string"?[z]:z)$.append(D,R);return{statusCode:v.statusCode,headers:$,body:await Op(v,t.responseType)}}finally{clearTimeout(f)}}});var zp=C(F=>{"use strict";var Ab=F&&F.__createBinding||(Object.create?function(t,r,e,i){i===void 0&&(i=e);var s=Object.getOwnPropertyDescriptor(r,e);(!s||("get"in s?!r.__esModule:s.writable||s.configurable))&&(s={enumerable:!0,get:function(){return r[e]}}),Object.defineProperty(t,i,s)}:function(t,r,e,i){i===void 0&&(i=e),t[i]=r[e]}),Rb=F&&F.__setModuleDefault||(Object.create?function(t,r){Object.defineProperty(t,"default",{enumerable:!0,value:r})}:function(t,r){t.default=r}),ta=F&&F.__importStar||function(){var t=function(r){return t=Object.getOwnPropertyNames||function(e){var i=[];for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(i[i.length]=s);return i},t(r)};return function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var i=t(r),s=0;s<i.length;s++)i[s]!=="default"&&Ab(e,r,i[s]);return Rb(e,r),e}}(),Mb=F&&F.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(F,"__esModule",{value:!0});F.ScryptedClientLoginError=F.rpc_serializer=F.rpc=void 0;F.logoutScryptedClient=qb;F.getCurrentBaseUrl=Bb;F.loginScryptedClient=Fp;F.checkScryptedClientLogin=ea;F.redirectScryptedLogin=Ub;F.combineBaseUrl=Vi;F.redirectScryptedLogout=Vb;F.connectScryptedClient=Wb;var Xo=ta(Hd()),Lb=Dd(),Ob=zd(),Ib=_p(),Jo=Ee(),Hp=Go(),Hb=Mb(yp()),Db=kp(),Fb=Qo(),zb=Ip();F.rpc=ta(Ee());F.rpc_serializer=ta(Go());var Bi;try{throw new Error}catch{Bi=Fb.domFetch}var Nb=Jo.RpcPeer.generateId();function Zo(t,r){return new Promise((e,i)=>{let s=a=>{o(),i(a)},n=(...a)=>{o(),e(a)},o=()=>{t.removeListener("error",s),t.removeListener(r,n)};t.once("error",s),t.once(r,n)})}function Dp(){return globalThis.navigator?.userAgent.includes("InstalledApp")}function jb(){return globalThis.matchMedia?.("(display-mode: standalone)").matches||Dp()}async function qb(t){let r=Vi(t,"logout");return(await Bi({url:r,withCredentials:!0,responseType:"json",rejectUnauthorized:!1})).body}function Bb(){let t=new URL(window.location.href);t.search="",t.hash="";let e=window.location.pathname.split("/"),i=e.findIndex(n=>n==="endpoint");if(i===-1)return;let s=e.slice(0,i);return s.push(""),t.pathname=s.join("/"),t.toString()}async function Fp(t){let{baseUrl:r,username:e,password:i,change_password:s,maxAge:n}=t;!n&&jb()&&(n=365*24*60*60*1e3);let o=Vi(r,"login"),a=await Bi({url:o,body:{username:e,password:i,change_password:s,maxAge:n},rejectUnauthorized:!1,withCredentials:!0,responseType:"json"});if(a.statusCode!==200)throw new Error("status "+a.statusCode);let{body:l}=a;return{error:l.error,authorization:l.authorization,queryToken:l.queryToken,token:l.token,addresses:l.addresses,externalAddresses:l.externalAddresses,hostname:l.hostname,scryptedCloud:a.headers.get("x-scrypted-cloud")==="true",directAddress:a.headers.get("x-scrypted-direct-address"),cloudAddress:a.headers.get("x-scrypted-cloud-address"),serverId:a.headers.get("x-scrypted-server-id")}}async function ea(t){let{baseUrl:r}=t||{},e=Vi(r,"login"),i=new Headers;if(t?.previousLoginResult?.queryToken){let o=t?.previousLoginResult.username+":"+t.previousLoginResult.token,a=Buffer.from(o).toString("base64");i.set("Authorization",`Basic ${a}`)}let s=await Bi({url:e,withCredentials:!0,headers:i,rejectUnauthorized:!1,responseType:"json"}),{body:n}=s;return{baseUrl:r,hostname:n.hostname,redirect:n.redirect,username:n.username,expiration:n.expiration,hasLogin:!!n.hasLogin,error:n.error,authorization:n.authorization,queryToken:n.queryToken,token:n.token,addresses:n.addresses,externalAddresses:n.externalAddresses,scryptedCloud:s.headers.get("x-scrypted-cloud")==="true",directAddress:s.headers.get("x-scrypted-direct-address"),cloudAddress:s.headers.get("x-scrypted-cloud-address"),serverId:s.headers.get("x-scrypted-server-id")}}var Ui=class extends Error{result;constructor(r){super(r.error),this.result=r}};F.ScryptedClientLoginError=Ui;function Ub(t){let{baseUrl:r,redirect:e}=t||{};if(e=e||"/endpoint/@scrypted/core/public/",r){let s=new URL(e,r);s.searchParams.set("redirect_uri",window.location.href),e=s.toString()}else e=`${e}?redirect_uri=${encodeURIComponent(window.location.href)}`;let i=e;console.log("redirect_uri",i),globalThis.location.href=i}function Vi(t,r){return t?new URL(r,t).toString():"/"+r}async function Vb(t){globalThis.location.href=Vi(t,"logout")}async function Wb(t){let r=Date.now(),{baseUrl:e,pluginId:i,clientName:s,username:n,password:o}=t,a,l,u,h,p,f,m,b,x,v;console.log("@scrypted/client",Hb.default.version);let $={},z=!globalThis.navigator?.userAgent.includes("Chrome")||Dp(),R=!1;if(n&&o){let S=await Fp(t);S.authorization&&($.Authorization=S.authorization),u=S.addresses,h=S.externalAddresses,p=S.scryptedCloud,f=S.directAddress,m=S.cloudAddress,a=S.authorization,l=S.queryToken,x=S.token,b=S.hostname,v=S.serverId,console.log("login result",Date.now()-r,S)}else{let se=function(B){if(B.error||B.redirect)throw new Ui(B);if(!B.authorization||!B.username||!B.queryToken)throw console.error(B),new Error("malformed login result");return B},S=new Set;if(t?.previousLoginResult?.token){for(let B of[...t?.previousLoginResult?.localAddresses||[],t?.previousLoginResult?.directAddress])B&&(z||t.direct)&&S.add(B);for(let B of[...t?.previousLoginResult?.externalAddresses||[],t?.previousLoginResult?.cloudAddress])B&&S.add(B)}let ge=[...S].map(B=>ea({baseUrl:B,previousLoginResult:t?.previousLoginResult}).then(se)),Gi=ea({baseUrl:e,previousLoginResult:t?.previousLoginResult}).then(se);ge.push(Gi);let q;try{q=await Promise.any(ge),R||=q.baseUrl!==e}catch{q=await Gi}if(R&&console.log("Found direct login. Allowing alternate addresses."),q.error||q.redirect)throw new Ui(q);u=q.addresses,h=q.externalAddresses,p=q.scryptedCloud,f=q.directAddress,m=q.cloudAddress,n=q.username,a=q.authorization,l=q.queryToken,x=q.token,b=q.hostname,v=q.serverId,console.log("login checked",Date.now()-r,q)}let V,G=`endpoint/${i}/engine.io/api`,w=e?new URL(G,e).pathname:"/"+G,E=Math.random().toString(36).substring(3,10),L={path:w,query:{cacheBust:E},withCredentials:!0,extraHeaders:$,rejectUnauthorized:!1,transports:t?.transports},j=e||`${globalThis.location.protocol}//${globalThis.location.host}`,N=[],Et=z;R||=p,(R&&t.local===void 0&&Et||t.local)&&u&&N.push(...u);let ae=f&&(z||!(0,Db.isIPAddress)(f));if((R&&t.direct===void 0&&ae||t.direct)&&f&&N.push(f),R&&t.direct===void 0||t.direct){m&&N.push(m);for(let S of h||[])N.push(S)}let le=!!N.length;console.log({tryLocalAddressess:le});let ce={...L,extraHeaders:{...L.extraHeaders}};ce.extraHeaders.Authorization||=a;let oi=[],Ki=[];if(le)for(let S of new Set(N)){console.log("trying",S);let se=new Xo.Socket(S,ce);oi.push(se),Ki.push((async()=>(await Zo(se,"open"),{connectionType:"http-direct",ready:se,address:S}))())}let hu=[...Ki];Ki.push((async()=>{let S=le?1e3:0;if(console.log("waiting",S),S)try{let ge=Promise.any(hu);await(0,Lb.timeoutPromise)(S,ge),console.log("found direct connection, aborting scrypted cloud connection");return}catch{}let se=new Xo.Socket(j,L);return oi.push(se),await Zo(se,"open"),{ready:se,address:j,connectionType:p?"http-cloud":"http"}})());let fu=Promise.any(Ki),{ready:$a,connectionType:Sa,address:Yi,rpcPeer:je}=await fu;console.log("connected",Sa,Yi),V=$a,oi=oi.filter(S=>S!==$a),oi.forEach(S=>{try{S.close()}catch{}});try{if(!je){let O=(0,Hp.createRpcSerializer)({sendMessageBuffer:I=>V.send(I),sendMessageFinish:I=>V.send(JSON.stringify(I))});je=new Jo.RpcPeer(s||"engine.io-client","api",(I,Q,_e)=>{try{O.sendMessage(I,Q,_e)}catch(Xi){Q?.(Xi)}}),V.on("message",I=>{I.constructor===Buffer||I.constructor===ArrayBuffer?O.onMessageBuffer(Buffer.from(I)):O.onMessageFinish(JSON.parse(I))}),O.setupRpcPeer(je)}let S=await(0,Ib.attachPluginRemote)(je,void 0),{serverVersion:se,systemManager:ge,deviceManager:Gi,endpointManager:q,mediaManager:B,clusterManager:mu}=S;console.log("api attached",Date.now()-r),B.createMediaObject=async(O,I,Q)=>new Ob.MediaObject(I,O,Q);let[bu]=await Promise.all([(async()=>{try{return!!await ge.getComponent("info")}catch{}return!1})()]);console.log("api initialized",Date.now()-r);let gu=Object.keys(ge.getSystemState()).map(O=>ge.getDeviceById(O)).find(O=>O.pluginId==="@scrypted/core"&&O.nativeId===`user:${n}`),Qi=new Map,_u=new FinalizationRegistry(O=>{O.kill("object finalized")}),vu=(O,I)=>{if(!I?.dedicatedTransport){let _e=Qi.get(O.port);if(_e)return _e}let Q=(async()=>{let _e="engine.io/connectRPCObject",Zi={path:new URL(_e,Yi).pathname,query:{cacheBust:E,clusterObject:JSON.stringify(O),...l},withCredentials:!0,extraHeaders:$,rejectUnauthorized:!1,transports:t?.transports},Te=new Xo.Socket(Yi,Zi),Tt=!1,qe,de,ve,Ta=()=>{qe&&(clearTimeout(qe),qe=void 0),de&&(clearTimeout(de),de=void 0)},Pa=I?.dedicatedTransport?.receiveTimeout?()=>{qe&&clearTimeout(qe),qe=setTimeout(()=>{ve&&ve.kill("receive timeout")},I.dedicatedTransport.receiveTimeout)}:void 0,zs=I?.dedicatedTransport?.sendTimeout?()=>{de&&clearTimeout(de),de=setTimeout(()=>{ve&&ve.kill("send timeout")},I.dedicatedTransport.sendTimeout)}:void 0;Te.on("close",()=>{if(ve?.kill("socket closed"),I?.dedicatedTransport||Qi.delete(O.port),!Tt)throw new Error("peer disconnected before setup completed")});try{await Zo(Te,"open");let Pt=(0,Hp.createRpcDuplexSerializer)({write:ai=>{zs?.(),Te.send(ai)}});return Te.on("message",ai=>{Pa?.(),Pt.onData(Buffer.from(ai))}),ve=new Jo.RpcPeer(s||"engine.io-client","cluster-proxy",(ai,Aa,wu)=>{try{zs?.(),Pt.sendMessage(ai,Aa,wu)}catch(ku){Aa?.(ku)}}),ve.killedSafe.finally(()=>{Ta(),Te.close()}),Pt.setupRpcPeer(ve),ve.tags.localPort=Nb,Tt=!0,Pa?.(),zs?.(),ve}catch(Pt){throw Ta(),console.error("failure ipc connect",Pt),Te.close(),Pt}})();return I?.dedicatedTransport||Qi.set(O.port,Q),Q},yu=async(O,I)=>{let Q=await Qi.get(I);return Q?.remoteWeakProxies?Object.values(Q.remoteWeakProxies).find(_e=>_e.deref()?.__cluster?.proxyId==O)?.deref():null},xu=async(O,I)=>{let Q=O?.__cluster;if(!Q)return O;let{port:_e,proxyId:Xi}=Q,Zi=await yu(Xi,_e);if(Zi)return Zi;try{let Tt=await vu(Q,I),qe=await Tt.getParam("connectRPCObject");try{let de=await qe(Q);if(!de)throw new Error("ipc object not found?");return I?.dedicatedTransport&&_u.register(de,Tt),de}catch(de){throw I?.dedicatedTransport&&Tt.kill("connectRPCObject failed"),de}}catch(Te){return console.error("failure ipc",Te),O}},Ea={userId:gu?.id,serverVersion:se,username:n,pluginRemoteAPI:void 0,address:Yi,connectionType:Sa,admin:bu,systemManager:ge,clusterManager:mu,deviceManager:Gi,endpointManager:q,mediaManager:B,disconnect(){je.kill("disconnect requested")},pluginHostAPI:void 0,rpcPeer:je,loginResult:{username:n,token:x,directAddress:f,localAddresses:u,externalAddresses:h,scryptedCloud:p,queryToken:l,authorization:a,cloudAddress:m,hostname:b,serverId:v},connectRPCObject:xu,fork:void 0,connect:void 0};return V.on("close",()=>{je.kill("socket closed")}),je.killed.finally(()=>{V.close(),Ea.onClose?.()}),Ea}catch(S){throw V.close(),S}}});var er=globalThis,tr=er.ShadowRoot&&(er.ShadyCSS===void 0||er.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ns=Symbol(),Ma=new WeakMap,li=class{constructor(r,e,i){if(this._$cssResult$=!0,i!==Ns)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(tr&&r===void 0){let i=e!==void 0&&e.length===1;i&&(r=Ma.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),i&&Ma.set(e,r))}return r}toString(){return this.cssText}},K=t=>new li(typeof t=="string"?t:t+"",void 0,Ns),y=(t,...r)=>{let e=t.length===1?t[0]:r.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1],t[0]);return new li(e,t,Ns)},La=(t,r)=>{if(tr)t.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let i=document.createElement("style"),s=er.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,t.appendChild(i)}},js=tr?t=>t:t=>t instanceof CSSStyleSheet?(r=>{let e="";for(let i of r.cssRules)e+=i.cssText;return K(e)})(t):t;var{is:Mu,defineProperty:Lu,getOwnPropertyDescriptor:Ou,getOwnPropertyNames:Iu,getOwnPropertySymbols:Hu,getPrototypeOf:Du}=Object,ir=globalThis,Oa=ir.trustedTypes,Fu=Oa?Oa.emptyScript:"",zu=ir.reactiveElementPolyfillSupport,ci=(t,r)=>t,qs={toAttribute(t,r){switch(r){case Boolean:t=t?Fu:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,r){let e=t;switch(r){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},Ha=(t,r)=>!Mu(t,r),Ia={attribute:!0,type:String,converter:qs,reflect:!1,useDefault:!1,hasChanged:Ha};Symbol.metadata??=Symbol("metadata"),ir.litPropertyMetadata??=new WeakMap;var Pe=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=Ia){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(r,i,e);s!==void 0&&Lu(this.prototype,r,s)}}static getPropertyDescriptor(r,e,i){let{get:s,set:n}=Ou(this.prototype,r)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let a=s?.call(this);n?.call(this,o),this.requestUpdate(r,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Ia}static _$Ei(){if(this.hasOwnProperty(ci("elementProperties")))return;let r=Du(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(ci("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ci("properties"))){let e=this.properties,i=[...Iu(e),...Hu(e)];for(let s of i)this.createProperty(s,e[s])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let i=new Set(r.flat(1/0).reverse());for(let s of i)e.unshift(js(s))}else r!==void 0&&e.push(js(r));return e}static _$Eu(r,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(r.set(i,this[i]),delete this[i]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return La(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,i){this._$AK(r,i)}_$ET(r,e){let i=this.constructor.elementProperties.get(r),s=this.constructor._$Eu(r,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:qs).toAttribute(e,i.type);this._$Em=r,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(r,e){let i=this.constructor,s=i._$Eh.get(r);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:qs;this._$Em=s;let a=o.fromAttribute(e,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(r,e,i,s=!1,n){if(r!==void 0){let o=this.constructor;if(s===!1&&(n=this[r]),i??=o.getPropertyOptions(r),!((i.hasChanged??Ha)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,i))))return;this.C(r,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??e??this[r]),n!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||i||(e=void 0),this._$AL.set(r,e)),s===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw r=!1,this._$EM(),i}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};Pe.elementStyles=[],Pe.shadowRootOptions={mode:"open"},Pe[ci("elementProperties")]=new Map,Pe[ci("finalized")]=new Map,zu?.({ReactiveElement:Pe}),(ir.reactiveElementVersions??=[]).push("2.1.2");var Us=globalThis,Da=t=>t,rr=Us.trustedTypes,Fa=rr?rr.createPolicy("lit-html",{createHTML:t=>t}):void 0,Vs="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,Ws="?"+Ae,Nu=`<${Ws}>`,ot=document,pi=()=>ot.createComment(""),ui=t=>t===null||typeof t!="object"&&typeof t!="function",Ks=Array.isArray,Ua=t=>Ks(t)||typeof t?.[Symbol.iterator]=="function",Bs=`[ 	
\f\r]`,di=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,za=/-->/g,Na=/>/g,st=RegExp(`>|${Bs}(?:([^\\s"'>=/]+)(${Bs}*=${Bs}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ja=/'/g,qa=/"/g,Va=/^(?:script|style|textarea|title)$/i,Ys=t=>(r,...e)=>({_$litType$:t,strings:r,values:e}),c=Ys(1),H=Ys(2),Yg=Ys(3),Re=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Ba=new WeakMap,nt=ot.createTreeWalker(ot,129);function Wa(t,r){if(!Ks(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fa!==void 0?Fa.createHTML(r):r}var Ka=(t,r)=>{let e=t.length-1,i=[],s,n=r===2?"<svg>":r===3?"<math>":"",o=di;for(let a=0;a<e;a++){let l=t[a],u,h,p=-1,f=0;for(;f<l.length&&(o.lastIndex=f,h=o.exec(l),h!==null);)f=o.lastIndex,o===di?h[1]==="!--"?o=za:h[1]!==void 0?o=Na:h[2]!==void 0?(Va.test(h[2])&&(s=RegExp("</"+h[2],"g")),o=st):h[3]!==void 0&&(o=st):o===st?h[0]===">"?(o=s??di,p=-1):h[1]===void 0?p=-2:(p=o.lastIndex-h[2].length,u=h[1],o=h[3]===void 0?st:h[3]==='"'?qa:ja):o===qa||o===ja?o=st:o===za||o===Na?o=di:(o=st,s=void 0);let m=o===st&&t[a+1].startsWith("/>")?" ":"";n+=o===di?l+Nu:p>=0?(i.push(u),l.slice(0,p)+Vs+l.slice(p)+Ae+m):l+Ae+(p===-2?a:m)}return[Wa(t,n+(t[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),i]},hi=class t{constructor({strings:r,_$litType$:e},i){let s;this.parts=[];let n=0,o=0,a=r.length-1,l=this.parts,[u,h]=Ka(r,e);if(this.el=t.createElement(u,i),nt.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=nt.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(Vs)){let f=h[o++],m=s.getAttribute(p).split(Ae),b=/([.?@])?(.*)/.exec(f);l.push({type:1,index:n,name:b[2],strings:m,ctor:b[1]==="."?nr:b[1]==="?"?or:b[1]==="@"?ar:lt}),s.removeAttribute(p)}else p.startsWith(Ae)&&(l.push({type:6,index:n}),s.removeAttribute(p));if(Va.test(s.tagName)){let p=s.textContent.split(Ae),f=p.length-1;if(f>0){s.textContent=rr?rr.emptyScript:"";for(let m=0;m<f;m++)s.append(p[m],pi()),nt.nextNode(),l.push({type:2,index:++n});s.append(p[f],pi())}}}else if(s.nodeType===8)if(s.data===Ws)l.push({type:2,index:n});else{let p=-1;for(;(p=s.data.indexOf(Ae,p+1))!==-1;)l.push({type:7,index:n}),p+=Ae.length-1}n++}}static createElement(r,e){let i=ot.createElement("template");return i.innerHTML=r,i}};function at(t,r,e=t,i){if(r===Re)return r;let s=i!==void 0?e._$Co?.[i]:e._$Cl,n=ui(r)?void 0:r._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(t),s._$AT(t,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(r=at(t,s._$AS(t,r.values),s,i)),r}var sr=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:i}=this._$AD,s=(r?.creationScope??ot).importNode(e,!0);nt.currentNode=s;let n=nt.nextNode(),o=0,a=0,l=i[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new Rt(n,n.nextSibling,this,r):l.type===1?u=new l.ctor(n,l.name,l.strings,this,r):l.type===6&&(u=new lr(n,this,r)),this._$AV.push(u),l=i[++a]}o!==l?.index&&(n=nt.nextNode(),o++)}return nt.currentNode=ot,s}p(r){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(r,i,e),e+=i.strings.length-2):i._$AI(r[e])),e++}},Rt=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,i,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=at(this,r,e),ui(r)?r===d||r==null||r===""?(this._$AH!==d&&this._$AR(),this._$AH=d):r!==this._$AH&&r!==Re&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Ua(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==d&&ui(this._$AH)?this._$AA.nextSibling.data=r:this.T(ot.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:i}=r,s=typeof i=="number"?this._$AC(r):(i.el===void 0&&(i.el=hi.createElement(Wa(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new sr(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(r){let e=Ba.get(r.strings);return e===void 0&&Ba.set(r.strings,e=new hi(r)),e}k(r){Ks(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let n of r)s===e.length?e.push(i=new t(this.O(pi()),this.O(pi()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let i=Da(r).nextSibling;Da(r).remove(),r=i}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},lt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,i,s,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=r,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(r,e=this,i,s){let n=this.strings,o=!1;if(n===void 0)r=at(this,r,e,0),o=!ui(r)||r!==this._$AH&&r!==Re,o&&(this._$AH=r);else{let a=r,l,u;for(r=n[0],l=0;l<n.length-1;l++)u=at(this,a[i+l],e,l),u===Re&&(u=this._$AH[l]),o||=!ui(u)||u!==this._$AH[l],u===d?r=d:r!==d&&(r+=(u??"")+n[l+1]),this._$AH[l]=u}o&&!s&&this.j(r)}j(r){r===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},nr=class extends lt{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===d?void 0:r}},or=class extends lt{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==d)}},ar=class extends lt{constructor(r,e,i,s,n){super(r,e,i,s,n),this.type=5}_$AI(r,e=this){if((r=at(this,r,e,0)??d)===Re)return;let i=this._$AH,s=r===d&&i!==d||r.capture!==i.capture||r.once!==i.once||r.passive!==i.passive,n=r!==d&&(i===d||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},lr=class{constructor(r,e,i){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(r){at(this,r)}},Ya={M:Vs,P:Ae,A:Ws,C:1,L:Ka,R:sr,D:Ua,V:at,I:Rt,H:lt,N:or,U:ar,B:nr,F:lr},ju=Us.litHtmlPolyfillSupport;ju?.(hi,Rt),(Us.litHtmlVersions??=[]).push("3.3.3");var Ga=(t,r,e)=>{let i=e?.renderBefore??r,s=i._$litPart$;if(s===void 0){let n=e?.renderBefore??null;i._$litPart$=s=new Rt(r.insertBefore(pi(),n),n,void 0,e??{})}return s._$AI(t),s};var Gs=globalThis,_=class extends Pe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=Ga(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Re}};_._$litElement$=!0,_.finalized=!0,Gs.litElementHydrateSupport?.({LitElement:_});var qu=Gs.litElementPolyfillSupport;qu?.({LitElement:_});(Gs.litElementVersions??=[]).push("4.2.2");var Bu={feeding:{domain:"binary_sensor",translationKeys:["feeding"],idSuffixes:["_feeding"]},eating:{domain:"binary_sensor",translationKeys:["eating"],idSuffixes:["_eating"]},bowlFill:{domain:"sensor",translationKeys:["bowl_fill","bowl_fill_1"],idSuffixes:["_bowl_fill","_bowl_fill_1","_bowl_fill_hopper_1"]},hopperLevel1:{domain:"sensor",translationKeys:["hopper_1_level"],idSuffixes:["_hopper_1_level"]},hopperLevel2:{domain:"sensor",translationKeys:["hopper_2_level"],idSuffixes:["_hopper_2_level"]},hopperRemaining1:{domain:"sensor",translationKeys:["hopper_1_remaining"],idSuffixes:["_hopper_1_remaining"]},hopperRemaining2:{domain:"sensor",translationKeys:["hopper_2_remaining"],idSuffixes:["_hopper_2_remaining"]},markFullHopper1:{domain:"button",translationKeys:["hopper_1_full"],idSuffixes:["_hopper_1_full"]},markFullHopper2:{domain:"button",translationKeys:["hopper_2_full"],idSuffixes:["_hopper_2_full"]},markFullBoth:{domain:"button",translationKeys:["hopper_full"],idSuffixes:["_hopper_full"]},hopperDivider:{domain:"switch",translationKeys:["hopper_divider"],idSuffixes:["_hopper_divider"]},hopperFood1:{domain:"text",translationKeys:["hopper_1_food"],idSuffixes:["_hopper_1_food"]},hopperFood2:{domain:"text",translationKeys:["hopper_2_food"],idSuffixes:["_hopper_2_food"]},desiccantDays:{domain:"sensor",translationKeys:["desiccant_days","desiccant_left"],idSuffixes:["_desiccant_days","_desiccant_left"]},schedule:{domain:"sensor",translationKeys:["schedule"],idSuffixes:["_schedule"]},scheduleCardState:{domain:"sensor",translationKeys:["schedule_card_state"],idSuffixes:["_schedule_card_state"]},feedButton:{domain:"button",translationKeys:["feed"],idSuffixes:["_feed"]},feedButtonHopper1:{domain:"button",translationKeys:["feed_hopper_1"],idSuffixes:["_feed_hopper_1"]},feedButtonHopper2:{domain:"button",translationKeys:["feed_hopper_2"],idSuffixes:["_feed_hopper_2"]},cancelFeedButton:{domain:"button",translationKeys:["cancel_feed"],idSuffixes:["_cancel_feed"]},callCatsButton:{domain:"button",translationKeys:["call_cats"],idSuffixes:["_call_cats"]},feedAmount:{domain:"number",translationKeys:["feed_amount"],idSuffixes:["_feed_amount"]},feedAmountHopper1:{domain:"number",translationKeys:["feed_amount_hopper_1"],idSuffixes:["_feed_amount_hopper_1"]},feedAmountHopper2:{domain:"number",translationKeys:["feed_amount_hopper_2"],idSuffixes:["_feed_amount_hopper_2"]},cloudSwitch:{domain:"switch",translationKeys:["cloud","petkit_cloud"],idSuffixes:["_cloud","_petkit_cloud"]},stackSelect:{domain:"select",translationKeys:["stack"],idSuffixes:["_stack"]},cloudConnection:{domain:"sensor",translationKeys:["cloud_connection"],idSuffixes:["_cloud_connection"]},nightVisionSwitch:{domain:"switch",translationKeys:["night","night_vision"],idSuffixes:["_night","_night_vision"]},statusLedSwitch:{domain:"switch",translationKeys:["light","status_led"],idSuffixes:["_light","_status_led"]},microphoneSwitch:{domain:"switch",translationKeys:["microphone"],idSuffixes:["_microphone"]},lastSeenPet:{domain:"sensor",translationKeys:["last_seen_pet"],idSuffixes:["_last_seen_pet"]},dishBefore:{domain:"image",translationKeys:["dish_before"],idSuffixes:["_dish_before"]},dishAfter:{domain:"image",translationKeys:["dish_after"],idSuffixes:["_dish_after"]},wifiNetwork:{domain:"sensor",translationKeys:["wifi_network","wifi","rssi"],idSuffixes:["_wifi_network","_wifi","_rssi"]},lastDetection:{domain:"sensor",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionsToday:{domain:"sensor",translationKeys:["detections_today"],idSuffixes:["_detections_today"]},lastDetectionImage:{domain:"image",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionOverlaySwitch:{domain:"switch",translationKeys:["detection_overlay"],idSuffixes:["_detection_overlay"]}};function cr(t){return t.slice(0,t.indexOf("."))}function Qs(t){return t.slice(t.indexOf(".")+1)}function Uu(t,r){if(cr(t.entity_id)!==r.domain)return!1;if(t.translation_key&&r.translationKeys.includes(t.translation_key))return!0;let e=Qs(t.entity_id);return r.idSuffixes.some(i=>e.endsWith(i))}function Vu(t){let r=t.name??t.original_name;if(r)return r.replace(/\s+present$/i,"").trim()||r;let s=Qs(t.entity_id).replace(/_present$/,"").split("_").filter(Boolean).pop();return s?s[0].toUpperCase()+s.slice(1):"Cat"}function Wu(t){return cr(t.entity_id)!=="binary_sensor"?!1:t.translation_key==="present"||t.translation_key?.endsWith("_present")?!0:Qs(t.entity_id).endsWith("_present")}function Be(t,r){let e={deviceId:r,catPresence:[]},i=Object.values(t).filter(s=>s.device_id===r&&!s.disabled_by);for(let s of i){if(cr(s.entity_id)==="camera"&&!e.camera){e.camera=s.entity_id;continue}if(cr(s.entity_id)==="media_player"&&!e.speaker){e.speaker=s.entity_id;continue}if(Wu(s)){e.catPresence.push({entityId:s.entity_id,name:Vu(s)});continue}for(let n of Object.entries(Bu)){let[o,a]=n;if(!e[o]&&Uu(s,a)){e[o]=s.entity_id;break}}}return e.catPresence.sort((s,n)=>s.name.localeCompare(n.name)),e}function Mt(t,r){if(!r)return;let e=t[r];return e?.config_entry_id??e?.config_entries?.[0]}function Qa(t,r){let e=i=>i===void 0||i==="unavailable"||i==="unknown";return t.length===0||t.every(e)?"unreachable":r==="on"?"dispensing":"idle"}function Xs(t,r){return t==="unreachable"?"Feeder unreachable. Check that kibbled is running":t==="dispensing"?"Dispensing\u2026":r?`Fed ${r}`:"Ready to feed"}function dr(t,r){let e=Math.floor(Math.max(0,r.getTime()-t.getTime())/6e4);if(e<1)return{unit:"now",value:0};if(e<60)return{unit:"minutes",value:e};let i=Math.floor(e/60);return i<24?{unit:"hours",value:i}:{unit:"days",value:Math.floor(i/24)}}function Xa(t,r){let e=dr(t,r);if(e.unit==="now")return"just now";let i=e.unit==="minutes"?"m":e.unit==="hours"?"h":"d";return`${e.value}${i} ago`}function Lt(t,r){let e=dr(t,r);if(e.unit==="now")return"just now";let i=e.unit==="minutes"?"min":e.unit==="hours"?"h":"d";return`${e.value} ${i} ago`}var Me={setTimeout:(t,r)=>globalThis.setTimeout(t,r),clearTimeout:t=>globalThis.clearTimeout(t),now:()=>Date.now()},ct=[1e3,2e3,5e3,1e4,3e4],dt=15e3;function Ot(t,r=ct){let e=Math.min(Math.max(0,Math.floor(t)),r.length-1);return r[e]}function pr(t){return t&&typeof t=="object"&&"code"in t&&typeof t.code=="string"?t.code:null}function fi(t,r,e=Me){return new Promise((i,s)=>{let n=e.setTimeout(()=>s({code:"timeout",message:"Kibble took too long to answer."}),r);t.then(o=>{e.clearTimeout(n),i(o)},o=>{e.clearTimeout(n),s(o)})})}var Ku={data:null,error:null,loading:!1,reconnecting:!1},X=class{constructor(r,e={}){this._lastWatched=null;this._requestId=0;this._state=Ku;this._failures=0;this._retryHandle=null;this._lastRun=null;this._onChange=r,this._options=e,this._timers=e.timers??Me}get state(){return this._state}sync(r,e){r!==this._lastWatched&&(this._lastWatched=r,this.refresh(e))}refresh(r){this._lastRun=r,this._failures=0,this._cancelRetry(),this._start(r,{error:null,reconnecting:!1})}retryNow(){this._lastRun&&this.refresh(this._lastRun)}patch(r){this._state.data!==null&&(this._state={...this._state,data:r(this._state.data)},this._onChange())}dispose(){this._requestId++,this._cancelRetry()}_start(r,e){let i=++this._requestId;this._state={...this._state,loading:!0,...e},this._onChange();let s;try{s=r()}catch(o){s=Promise.reject(o)}let n=this._options.timeoutMs;n&&(s=fi(s,n,this._timers)),s.then(o=>{i===this._requestId&&(this._failures=0,this._state={data:o,error:null,loading:!1,reconnecting:!1},this._onChange())},o=>{if(i!==this._requestId)return;let a=this._options.retry;this._state={...this._state,error:U(o),loading:!1,reconnecting:!!a&&this._state.data!==null},this._onChange(),a&&this._scheduleRetry(r,a)})}_scheduleRetry(r,e){let i=Ot(this._failures++,e);this._cancelRetry(),this._retryHandle=this._timers.setTimeout(()=>{this._retryHandle=null,this._start(r,{error:this._state.error,reconnecting:this._state.reconnecting})},i)}_cancelRetry(){this._retryHandle!==null&&(this._timers.clearTimeout(this._retryHandle),this._retryHandle=null)}};function Za(t,r){return r.filter(e=>!!e).map(e=>`${e}=${t.states[e]?.state??""}`).join("|")}function U(t){if(t instanceof Error)return t.message;if(t&&typeof t=="object"&&"message"in t){let r=t.message;if(typeof r=="string"&&r)return r}return"Something went wrong."}function ur(t){let r=t?.attributes?.entries;return Array.isArray(r)?r:[]}function It(t){let r=/^(\d{1,2}):(\d{2})$/.exec(t.trim());if(!r)throw new Error(`Invalid schedule time "${t}"`);let e=Number(r[1]),i=Number(r[2]);if(e>23||i>59)throw new Error(`Invalid schedule time "${t}"`);return e*60+i}function Yu(t,r){let e=r.getHours()*60+r.getMinutes(),i=null;for(let s of t){if(!s.enabled)continue;let o=((It(s.time)-e)%1440+1440)%1440;(i===null||o<i.minutesUntil)&&(i={entry:s,minutesUntil:o})}return i}function Ue(t,r){let e=It(t);return new Date(2e3,0,1,Math.floor(e/60),e%60).toLocaleTimeString(r,{hour:"numeric",minute:"2-digit"})}var Gu=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function Ja(t,r,e){if(t.length===0)return"No schedule set";let i=Yu(t,r);if(!i)return"All feeds paused";let s=t.filter(o=>o.enabled).length,n=Gu[s]??String(s);return`Next feed ${Ue(i.entry.time,e)}, ${n} a day`}var mi=20;function Qu(t){return t===1?"1 portion":`${t} portions`}function pt(t,r){let e=r?.trim();return e||`Hopper ${t}`}function bi(t,r,e,i){if(r)return Qu(Math.max(t.amount_l,t.amount_r));let s=[];return t.amount_l>0&&s.push(`${pt(1,e)} ${t.amount_l}`),t.amount_r>0&&s.push(`${pt(2,i)} ${t.amount_r}`),s.length>0?s.join(" + "):"No food"}function hr(t){return[...t].sort((r,e)=>It(r.time)-It(e.time))}function Js(t){if(!/^\d{1,2}:\d{2}$/.test(t.time.trim()))return"Pick a time";try{It(t.time)}catch{return"Pick a time"}for(let r of[t.amount_l,t.amount_r])if(!Number.isInteger(r)||r<0||r>mi)return`Portions go from 0 to ${mi}`;return t.amount_l===0&&t.amount_r===0?"Pick at least one portion":null}function Zs(t){let r=It(t),e=String(Math.floor(r/60)).padStart(2,"0"),i=String(r%60).padStart(2,"0");return`${e}:${i}:00`}function el(t,r){return{device_id:t,time:Zs(r.time),hopper1_g:r.amount_l,hopper2_g:r.amount_r,enabled:!0}}function tl(t,r,e){if(!t.some(i=>i.id===r))throw new Error("That feed was removed meanwhile. Reopen the schedule and try again.");return t.map(i=>i.id===r?{entry_id:i.id,time:Zs(e.time),hopper1_g:e.amount_l,hopper2_g:e.amount_r,enabled:i.enabled}:{entry_id:i.id,time:Zs(i.time),hopper1_g:i.amount_l,hopper2_g:i.amount_r,enabled:i.enabled})}function en(t){if(typeof t=="string"&&t.trim())return t.trim();if(typeof t=="object"&&t!==null){let r=t.message;if(typeof r=="string"&&r.trim())return r.trim()}return"Home Assistant did not accept the change"}var ye=class{constructor(){this._urls=new Map;this._refs=new Map;this._pending=new Set;this._waiters=new Map}acquire(r,e,i){let s=e.id;this._refs.set(s,(this._refs.get(s)??0)+1);let n=this._urls.get(s);if(n!==void 0)return n;let o=this._waiters.get(s)??new Set;return o.add(i),this._waiters.set(s,o),this._pending.has(s)||(this._pending.add(s),this._fetch(r,e.url).then(a=>{this._pending.delete(s);let l=this._waiters.get(s);this._waiters.delete(s),a&&(this._refs.get(s)??0)>0?this._urls.set(s,a):a&&URL.revokeObjectURL(a);for(let u of l??[])u(a)})),null}release(r){let e=(this._refs.get(r)??0)-1;if(e>0){this._refs.set(r,e);return}this._refs.delete(r),queueMicrotask(()=>{(this._refs.get(r)??0)>0||this._evictIfOverCap()})}_evictIfOverCap(){if(!(this._urls.size<=200))for(let[r,e]of this._urls){if(this._urls.size<=200)break;(this._refs.get(r)??0)>0||(this._urls.delete(r),URL.revokeObjectURL(e))}}async _fetch(r,e){if(!r.fetchWithAuth)return null;try{let i=await r.fetchWithAuth(e);if(!i.ok)return null;let s=await i.blob();return URL.createObjectURL(s)}catch{return null}}dispose(){for(let r of this._urls.values())URL.revokeObjectURL(r);this._urls.clear(),this._refs.clear(),this._pending.clear(),this._waiters.clear()}},Ve=class{constructor(){this._acquiredId=null;this._cache=null;this._url=null;this._failed=!1}get url(){return this._url}get failed(){return this._failed}retry(r,e,i,s){this._release(),this._url=null,this._failed=!1,this.sync(r,e,i,s)}sync(r,e,i,s){if((i?.id??null)!==this._acquiredId&&(this._release(),this._url=null,this._failed=!1),!i||!r||!e||this._acquiredId===i.id)return;this._acquiredId=i.id,this._cache=e;let o=i.id,a=e.acquire(r,i,l=>{this._acquiredId===o&&(this._url=l,this._failed=l===null,s())});a!==null&&(this._url=a)}_release(){this._acquiredId&&this._cache&&this._cache.release(this._acquiredId),this._acquiredId=null,this._cache=null}dispose(){this._release(),this._url=null,this._failed=!1}};var Xu={cog:"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",cloudCheck:"M13 19C13 19.34 13.04 19.67 13.09 20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.32 7.4 19 9.05 19 11C20.15 11.13 21.1 11.63 21.86 12.5C22.37 13.07 22.7 13.71 22.86 14.42C21.82 13.54 20.5 13 19 13C18.89 13 18.79 13 18.68 13C18.62 13 18.56 13 18.5 13H17V11C17 9.62 16.5 8.44 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18H13.09C13.04 18.33 13 18.66 13 19M17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84L17.75 19.43Z",cloudLock:"M6.5 18H13V20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.08 7.16 18.73 8.5 18.93 10C18.23 10 17.56 10.19 16.95 10.46C16.84 9.31 16.38 8.31 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18M23 17.3V20.8C23 21.4 22.4 22 21.7 22H16.2C15.6 22 15 21.4 15 20.7V17.2C15 16.6 15.6 16 16.2 16V14.5C16.2 13.1 17.6 12 19 12S21.8 13.1 21.8 14.5V16C22.4 16 23 16.6 23 17.3M20.5 14.5C20.5 13.7 19.8 13.2 19 13.2S17.5 13.7 17.5 14.5V16H20.5V14.5Z",cloudAlert:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M11 7H13V13H11V7Z",cloudQuestion:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M14.43 8.68C14.97 9.13 15.24 9.75 15.24 10.5C15.24 11 15.09 11.41 14.8 11.82C14.5 12.21 14.13 12.5 13.67 12.75C13.41 12.91 13.24 13.07 13.15 13.26C13.06 13.45 13 13.69 13 14H11C11 13.45 11.11 13.08 11.3 12.82C11.5 12.56 11.85 12.25 12.37 11.91C12.63 11.75 12.84 11.56 13 11.32C13.15 11.09 13.23 10.81 13.23 10.5C13.23 10.18 13.14 9.94 12.96 9.76C12.78 9.56 12.5 9.47 12.2 9.47C11.93 9.47 11.71 9.55 11.5 9.7C11.35 9.85 11.25 10.08 11.25 10.39H9.28C9.23 9.64 9.5 9 10.06 8.59C10.6 8.2 11.31 8 12.2 8C13.14 8 13.89 8.23 14.43 8.68Z",airFilter:"M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",wifi:"M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",fullscreen:"M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z",fullscreenExit:"M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z",weatherNight:"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",ledOn:"M11,0V4H13V0H11M18.3,2.29L15.24,5.29L16.64,6.71L19.7,3.71L18.3,2.29M5.71,2.29L4.29,3.71L7.29,6.71L8.71,5.29L5.71,2.29M12,6A4,4 0 0,0 8,10V16H6V18H9V23H11V18H13V23H15V18H18V16H16V10A4,4 0 0,0 12,6M2,9V11H6V9H2M18,9V11H22V9H18Z",microphone:"M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z",microphoneOff:"M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z",volumeOff:"M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z",volumeHigh:"M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",openInNew:"M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",speaker:"M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",refresh:"M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",check:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",dotsVertical:"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",helpCircle:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6C9.79,6 8,7.79 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",eye:"M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",eyeOff:"M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",deleteOutline:"M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",undo:"M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",plus:"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",cat:"M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M11,14H13L12.3,15.39C12.5,16.03 13.06,16.5 13.75,16.5A1.5,1.5 0 0,0 15.25,15H15.75A2,2 0 0,1 13.75,17C13,17 12.35,16.59 12,16V16H12C11.65,16.59 11,17 10.25,17A2,2 0 0,1 8.25,15H8.75A1.5,1.5 0 0,0 10.25,16.5C10.94,16.5 11.5,16.03 11.7,15.39L11,14Z",play:"M8,5.14V19.14L19,12.14L8,5.14Z",flash:"M7,2V13H10V22L17,10H13L17,2H7Z",cancel:"M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C10.1 4 8.4 4.6 7.1 5.7L18.3 16.9C19.3 15.5 20 13.8 20 12C20 7.6 16.4 4 12 4M16.9 18.3L5.7 7.1C4.6 8.4 4 10.1 4 12C4 16.4 7.6 20 12 20C13.9 20 15.6 19.4 16.9 18.3Z",imageBroken:"M21,5V11.59L18,8.58L14,12.59L10,8.59L6,12.59L3,9.58V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5M18,11.42L21,14.43V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V12.42L6,15.41L10,11.41L14,15.41",chevronLeft:"M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",chevronRight:"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",arrowExpand:"M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z",arrowCollapse:"M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z",imageMultiple:"M21,17H7V3H21M21,1H7A2,2 0 0,0 5,3V17A2,2 0 0,0 7,19H21A2,2 0 0,0 23,17V3A2,2 0 0,0 21,1M3,5H1V21A2,2 0 0,0 3,23H19V21H3M15.96,10.29L13.21,13.83L11.25,11.47L8.5,15H19.5L15.96,10.29Z"};function g(t){return H`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d=${Xu[t]}></path></svg>`}var il="0.29.1";var fr="#43A96A",sl="#2F8551",mr="#10301D",nl="#F4A452",br="#DE8A3A",ol="#3A2C28",al="#E5484D",rl=["#3FA7A0","#9A5B9E","#7FA05A","#4F86C6"];function W(t){let r=rl.length;return rl[(t%r+r)%r]}function ll(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0}function sn(t){return t==="empty"||t==="low"||t==="ok"?t:null}function nn(t){if(!t)return null;let r=t.state,e=r==="unknown"||r==="unavailable"||r===""?null:Number(r),i=t.attributes??{};return{portions:e!=null&&Number.isFinite(e)?e:null,fullAt:typeof i.full_at=="string"?i.full_at:null,portionsSinceFull:typeof i.portions_since_full=="number"?i.portions_since_full:null,fullToLow:typeof i.full_to_low=="number"?i.full_to_low:null}}var gr=.34,rn={empty:0,low:.2,ok:.64};function cl(t,r){let e=dr(t,r);if(e.unit==="now")return"just now";let i=e.unit==="minutes"?"minute":e.unit==="hours"?"hour":"day";return`${e.value} ${i}${e.value===1?"":"s"} ago`}function Ju(t){if(!t)return null;let r=new Date(t);return Number.isNaN(r.getTime())?null:r}var eh=30;function th(t,r){let i=1-(t??0)/(eh*r);return Math.max(rn.ok,Math.min(1,i))}function ih(t,r){let e=r>0?Math.max(0,Math.min(1,t/r)):0;return gr+(1-gr)*e}function tn(t,r,e,i=new Date){let s=t===null?2:1,n=Ju(e?.fullAt??null),o=e?.portionsSinceFull??null,a=o!=null&&o>0?`, ${o} portion${o===1?"":"s"} since`:"",l=n?`Filled ${cl(n,i)}${a}`:null;if(r===null)return{index:t,level:null,tone:"unknown",headline:"Unknown",fillFraction:null,detail:null};if(r==="low"||r==="empty")return{index:t,level:r,tone:r,headline:r==="low"?"Low":"Empty",fillFraction:rn[r],detail:l};if(e?.portions!=null&&e.fullToLow!=null&&e.fullToLow>0){let{portions:u,fullToLow:h}=e,p=Math.round(u),f=`About ${p} portion${p===1?"":"s"} left`;return{index:t,level:r,tone:"ok",headline:`About ${p} left`,fillFraction:ih(u,h),detail:n?`${f} \xB7 filled ${cl(n,i)}`:f}}return n?{index:t,level:r,tone:"ok",headline:`Filled ${Xa(n,i)}`,fillFraction:th(o,s),detail:l}:{index:t,level:r,tone:"ok",headline:"Stocked",fillFraction:rn.ok,detail:null}}function dl(t){return t.index===null?"Hopper":`Hopper ${t.index}`}function Ht(t){if(!t||t.state==="unavailable"||t.state==="unknown")return null;let r=t.state.trim();return r.length>0?r:null}function gi(t,r,e){return t===1?r:t===2?e:null}function ut(t,r){if(t.index===null)return dl(t);let e=r?.trim();return e||dl(t)}function _r(t,r=null){let e=ut(t,r);if(t.tone==="unknown")return`${e}: level unknown`;let i=`${e}: ${t.headline}`;return t.detail?`${i}. ${t.detail}`:i}var pl={empty:0,low:1,ok:2};function ul(t,r){return t==null||r==null?null:t+r}function rh(t,r,e,i){let s=[t,r].filter(l=>l!==null),n=s.length===0?null:s.reduce((l,u)=>pl[l]<=pl[u]?l:u);if(!e&&!i)return{level:n,remaining:null};let o=[e?.fullAt,i?.fullAt].filter(l=>typeof l=="string"),a=[e?.portionsSinceFull,i?.portionsSinceFull].filter(l=>typeof l=="number");return{level:n,remaining:{portions:ul(e?.portions??null,i?.portions??null),fullAt:o.length?o.reduce((l,u)=>Date.parse(l)>=Date.parse(u)?l:u):null,portionsSinceFull:a.length?a.reduce((l,u)=>l+u,0):null,fullToLow:ul(e?.fullToLow??null,i?.fullToLow??null)}}}function vr(t,r,e,i,s,n=new Date){if(!t)return[tn(1,r,i,n),tn(2,e,s,n)];let{level:o,remaining:a}=rh(r,e,i,s);return[tn(null,o,a,n)]}var sh={"choose-hopper":{start:"confirm-empty"},"confirm-empty":{"empty-confirmed":"collecting"},collecting:{capture:"collecting","review-full":"mark-full"},"mark-full":{"full-marked":"offer-inherit"},"offer-inherit":{"inherit-resolved":"done"},done:{restart:"choose-hopper"}};function Le(t,r){return sh[t][r]??t}function hl(t){return t.some(r=>r.portions>0)}function fl(t,r){let e=t[t.length-1];return!e||r.score>=e.score?null:{previousPortions:e.portions,previousScore:e.score,newScore:r.score}}function _i(t){if(!t)return{kind:"never",inheritedFromDisplay:null,measuredAt:null,note:null,finished:!1};let r=typeof t.source=="object"?t.source.inherited_from:null;return{kind:r!==null?"inherited":"measured",inheritedFromDisplay:r!==null?r+1:null,measuredAt:t.measured_at,note:t.note||null,finished:t.full_portions!=null}}function ml(t,r){if(!t||t.full_portions==null||t.full_score==null)return null;let e=[...t.points].sort((s,n)=>s.portions-n.portions),i=e[0];if(!i)return null;if(r<=i.score)return 0;if(r>=t.full_score)return 100;for(let s=1;s<e.length;s+=1){let n=e[s-1],o=e[s];if(r>o.score)continue;let a=o.score-n.score,l=a<=0?0:(r-n.score)/a,h=(n.portions+l*(o.portions-n.portions))/t.full_portions*100;return Math.max(0,Math.min(100,h))}return 100}function bl(t){return t?t.hoppers[0]??t.hoppers[1]??null:null}function gl(t,r){return t??(r?"1":"both")}var _l=300,vl=250,ne=70,oe=160,he=16,Oe=116,ht=24,oh=132,xr=160,an=150,Cr=182,$l=72,ah=7,ln=238,wr=5,lh=6e4,Ie={top:"#f0b774",mid:"#c9853f",deep:"#8e5424",hi:"#ffe1b8"},We={top:"#f6e7cc",mid:"#dcc19a",deep:"#b3916a",hi:"#fffaf0"},yl={frosted:{name:"Frosted glass",body:["#1f2835","#141a23"],stroke:"#ffffff26",sheen:.1,chute:["#8b98a6","#4d5864"],bowl:["#262f3b","#11161d"],rim:"#c3ccd6",light:!1},ceramic:{name:"Soft ceramic",body:["#ffffff","#e7edf3"],stroke:"#1a253122",sheen:.45,chute:["#c9d2db","#9aa7b4"],bowl:["#ffffff","#dfe6ee"],rim:"#ffffff",light:!0}},yr={ok:"var(--kibble-feed, #43a96a)",low:"var(--kibble-amber-dark, #de8a3a)",empty:"var(--error-color, #db4437)",unknown:"var(--secondary-text-color, #8b98a6)"};function ch(t,r,e,i){let s=[0,120,240].map(n=>{let o=(n+i)*Math.PI/180;return H`<circle cx=${(t+Math.cos(o)*e*.55).toFixed(1)} cy=${(r+Math.sin(o)*e*.55).toFixed(1)} r=${(e*.62).toFixed(1)} />`});return H`<g>${s}</g>`}function dh(){return H`
    <pattern id="tex-dot" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
      <circle cx="2" cy="2" r="1.2" fill="#000" opacity="0.13" />
      <circle cx="5.5" cy="5.5" r="1.2" fill="#fff" opacity="0.09" />
    </pattern>
    <pattern id="tex-fleck" width="11" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
      <path d="M1 2h4M7 6h3M2 7h2" stroke="#6b5234" stroke-width="1.3" stroke-linecap="round" opacity="0.28" />
      <path d="M6 1.5h2" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.35" />
    </pattern>
  `}function kr(t,r){return H`
    <linearGradient id=${t} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${r.top} />
      <stop offset="0.55" stop-color=${r.mid} />
      <stop offset="1" stop-color=${r.deep} />
    </linearGradient>
  `}function ph(t,r,e,i,s,n,o){let a=i-r;return H`
    <rect x=${t} y=${r} width=${e} height=${a} fill="url(#${s})" />
    <rect x=${t} y=${r} width=${e} height=${a} fill="url(#${n})" />
    <rect x=${t} y=${r} width=${e} height="2" fill=${o} opacity="0.85" />
  `}function uh(t,r){let e=r.length===1,i=r.map(s=>s.fraction>.01?ph(s.x,he+6+(Oe-12)*(1-s.fraction),s.w,he+Oe,s.gradientId,s.textureId,s.food.hi):d);return H`
    <defs>
      <linearGradient id="hopper-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${t.body[0]} />
        <stop offset="1" stop-color=${t.body[1]} />
      </linearGradient>
      <linearGradient id="hopper-sheen" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.08" stop-color="#fff" stop-opacity=${t.sheen} />
        <stop offset="0.22" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.85" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.95" stop-color="#fff" stop-opacity=${t.sheen*.6} />
        <stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="hopper-inner-shadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity=${t.light?.06:.35} />
        <stop offset="0.12" stop-color="#000" stop-opacity="0" />
        <stop offset="0.88" stop-color="#000" stop-opacity="0" />
        <stop offset="1" stop-color="#000" stop-opacity=${t.light?.08:.4} />
      </linearGradient>
      ${dh()}
      ${kr("hopper-food-1",Ie)}
      ${kr("hopper-food-2",We)}
      <clipPath id="hopper-interior-clip">
        <rect x=${ne+3} y=${he+3} width=${oe-6} height=${Oe-6} rx=${ht-3} />
      </clipPath>
      <filter id="hopper-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect x=${ne} y=${he+6} width=${oe} height=${Oe} rx=${ht} fill="#000" opacity=${t.light?.08:.35} filter="url(#hopper-shadow-blur)" />
    <rect x=${ne} y=${he} width=${oe} height=${Oe} rx=${ht} fill="url(#hopper-body)" />
    <g clip-path="url(#hopper-interior-clip)">
      ${i}
      <rect x=${ne} y=${he} width=${oe} height=${Oe} fill="url(#hopper-inner-shadow)" />
    </g>
    ${e?d:H`<line x1=${ne+oe/2} x2=${ne+oe/2} y1=${he+8} y2=${he+Oe-8} stroke=${t.light?"#1a253140":"#ffffff40"} stroke-width="2" stroke-linecap="round" />`}
    <rect x=${ne} y=${he} width=${oe} height=${Oe} rx=${ht} fill="url(#hopper-sheen)" />
    <rect x=${ne+.75} y=${he+.75} width=${oe-1.5} height=${Oe-1.5} rx=${ht} fill="none" stroke=${t.stroke} stroke-width="1.5" />
    <path d="M${ne+ht} ${he+1.5} H${ne+oe-ht}" stroke="#fff" stroke-opacity=${t.light?.9:.18} stroke-width="1.2" stroke-linecap="round" />
  `}function hh(t,r){let e=oh,i=xr;return H`
    <defs>
      <linearGradient id="chute-body" x1="0" x2="1">
        <stop offset="0" stop-color=${t.chute[1]} />
        <stop offset="0.45" stop-color=${t.chute[0]} />
        <stop offset="1" stop-color=${t.chute[1]} />
      </linearGradient>
    </defs>
    <path
      d="M104 ${e} L196 ${e} Q192 ${e+4} 170 ${i-6} L163 ${i} L137 ${i} L130 ${i-6} Q108 ${e+4} 104 ${e} Z"
      fill="url(#chute-body)"
      stroke=${t.light?"#1a253120":"#00000040"}
    />
    <rect
      x="139"
      y=${i-3}
      width="22"
      height="4"
      rx="2"
      fill=${r?"#f7c948":t.light?"#6b7886":"#0a0d12"}
      style=${r?"filter:drop-shadow(0 0 6px #f7c948)":""}
    />
  `}function Sl(t){let r=ln-wr,e=r-Cr;return r-e*Math.max(0,Math.min(1,t))}function El(){let t=an,r=Cr,e=$l-wr,i=ln-wr;return`M${t-e} ${r} C${t-e+2} ${r+37} ${t-38} ${i} ${t} ${i} C${t+38} ${i} ${t+e-2} ${r+37} ${t+e} ${r} Z`}function fh(t,r,e){let i=an,s=Cr,n=$l,o=ah,a=ln,l=`M${i-n} ${s} C${i-n+2} ${s+40} ${i-42} ${a} ${i} ${a} C${i+42} ${a} ${i+n-2} ${s+40} ${i+n} ${s} Z`,u=a-wr,h=El(),p=r==null?0:Math.max(0,Math.min(1,r)),f=Math.max(0,Math.min(1,e)),m=Sl(p),b=n*2,x=p>.02,v=x&&f>.01,$=Math.max(0,1-f-.06).toFixed(3),D=Math.min(1,1-f+.06).toFixed(3);return H`
    <defs>
      ${kr("bowl-food-1",Ie)}
      ${kr("bowl-food-2",We)}
      <clipPath id="bowl-interior-clip"><path d=${h} /></clipPath>
      <linearGradient id="bowl-wall" x1="0" x2="1">
        <stop offset="0" stop-color=${t.bowl[0]} stop-opacity="0.55" />
        <stop offset="0.2" stop-color="#fff" stop-opacity=${t.light?.5:.1} />
        <stop offset="0.45" stop-color=${t.bowl[1]} stop-opacity="0.25" />
        <stop offset="0.9" stop-color="#fff" stop-opacity=${t.light?.3:.06} />
        <stop offset="1" stop-color=${t.bowl[0]} stop-opacity="0.55" />
      </linearGradient>
      <linearGradient id="bowl-mix-gradient" x1="0" x2="1">
        <stop offset=${$} stop-color="#fff" stop-opacity="0" />
        <stop offset=${D} stop-color="#fff" stop-opacity="1" />
      </linearGradient>
      <mask id="bowl-mix-mask" maskContentUnits="userSpaceOnUse">
        <rect x=${i-n} y=${s-10} width=${b} height=${a-s+20} fill="url(#bowl-mix-gradient)" />
      </mask>
    </defs>
    <ellipse cx=${i} cy=${a+5} rx=${n*.7} ry="5" fill="#000" opacity=${t.light?.1:.4} />
    <path d=${h} fill=${t.light?"#e9eef3":"#0b0f15"} />
    <g clip-path="url(#bowl-interior-clip)">
      ${x?H`
            <rect x=${i-n} y=${m} width=${b} height=${u-m+2} fill="url(#bowl-food-1)" />
            <rect x=${i-n} y=${m} width=${b} height=${u-m+2} fill="url(#tex-dot)" />
            ${v?H`<g mask="url(#bowl-mix-mask)">
                  <rect x=${i-n} y=${m} width=${b} height=${u-m+2} fill="url(#bowl-food-2)" />
                  <rect x=${i-n} y=${m} width=${b} height=${u-m+2} fill="url(#tex-fleck)" />
                </g>`:d}
            <rect x=${i-n} y=${m} width=${b} height="2" fill="#fff" opacity="0.55" />
          `:d}
    </g>
    <path d=${l} fill="url(#bowl-wall)" stroke=${t.light?"#1a253126":"#ffffff30"} stroke-width="1.5" />
    <ellipse cx=${i} cy=${s} rx=${n} ry=${o} fill="none" stroke=${t.light?"#ffffff":t.rim} stroke-width="2.5" />
  `}function mh(t){return t==="1"?[Ie.mid,Ie.top,Ie.deep]:t==="2"?[We.mid,We.top,We.deep]:[Ie.mid,Ie.top,We.mid,We.top]}var xl=600,wl=[{dx:-1.3,rotationDeg:-10,phase:0},{dx:1.1,rotationDeg:14,phase:1/3},{dx:-.2,rotationDeg:4,phase:2/3}];function bh(t,r,e,i,s){let n=r>=3?wl:wl.slice(0,2),o=(s-i).toFixed(1),a=n.map((l,u)=>{let p=`--fall-delay:${Math.round(l.phase*xl)}ms;--fall-duration:${xl}ms;--fall-to:${o}px;`;return H`<g class="pour-piece" style=${p} fill=${t[u%t.length]}>${ch(e+l.dx,i,3.6,l.rotationDeg)}</g>`});return H`
    <defs>
      <clipPath id="pour-clip">
        <rect x=${e-6} y=${xr-4} width="12" height=${Cr-xr+4} />
        <path d=${El()} />
      </clipPath>
    </defs>
    <g class="pour-pieces" clip-path="url(#pour-clip)">${a}</g>
  `}function kl(t,r,e){if(t==null)return"Bowl level unknown";let i=r??t*100;return e?`Bowl about ${Math.round(i)}% full`:`Bowl ${Math.round(i)}% full`}function Cl(t,r,e){return t.length===1?`${ut(t[0],null)}: ${t[0].headline}`:t.map(i=>`${ut(i,gi(i.index,r,e))}: ${i.headline}`).join(", ")}function gh(t,r,e){let i=ut(t,r),s=_r(t,r);return c`
    <button type="button" class="chip" data-tone=${t.tone} style=${`--chip-c:${yr[t.tone]}`} aria-label=${s} title=${t.detail??""} @click=${e}>
      <span class="chip-dot"></span>
      <span class="chip-name">${i}</span>
      <span class="chip-word">${t.headline}</span>
    </button>
  `}var on=class extends _{constructor(){super();this._wasFeeding=!1;this._dropping=!1;this.fill=null,this.hopperLevel1=null,this.hopperLevel2=null,this.hopperRemaining1=null,this.hopperRemaining2=null,this.singleHopper=!1,this.food1=null,this.food2=null,this.feeding=!1,this.portions=1,this.calibration=null,this.darkMode=!1,this.bowlMix=0,this.pourSource=null}static{this.properties={fill:{type:Number},hopperLevel1:{type:String},hopperLevel2:{type:String},hopperRemaining1:{attribute:!1},hopperRemaining2:{attribute:!1},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},feeding:{type:Boolean},portions:{type:Number},calibration:{attribute:!1},darkMode:{type:Boolean},bowlMix:{type:Number},pourSource:{attribute:!1},fillSource:{type:String}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._dropTimer)}_openHopperDetail(){this.dispatchEvent(new CustomEvent("hopper-detail-requested",{bubbles:!0,composed:!0}))}willUpdate(e){e.has("feeding")&&(this.feeding&&!this._wasFeeding?(clearTimeout(this._dropTimer),this._dropping=!0,this._dropTimer=setTimeout(()=>{this._dropping=!1,this.requestUpdate()},lh)):!this.feeding&&this._wasFeeding&&this._dropping&&(clearTimeout(this._dropTimer),this._dropTimer=setTimeout(()=>{this._dropping=!1,this.requestUpdate()},900)),this._wasFeeding=this.feeding)}_compartments(e){if(e.length===1){let n=e[0];return[{x:ne,w:oe,fraction:n.fillFraction??0,food:Ie,gradientId:"hopper-food-1",textureId:"tex-dot",toneColor:yr[n.tone]}]}let[i,s]=e;return[{x:ne,w:oe/2,fraction:i.fillFraction??0,food:Ie,gradientId:"hopper-food-1",textureId:"tex-dot",toneColor:yr[i.tone]},{x:ne+oe/2,w:oe/2,fraction:s.fillFraction??0,food:We,gradientId:"hopper-food-2",textureId:"tex-fleck",toneColor:yr[s.tone]}]}render(){let e=this.darkMode?yl.frosted:yl.ceramic,i=vr(this.singleHopper,this.hopperLevel1,this.hopperLevel2,this.hopperRemaining1,this.hopperRemaining2),s=this._compartments(i),n=this.fill==null?null:ml(this.calibration,this.fill/100),o=this.fill==null?null:this.fill/100,a=gl(this.pourSource,this.singleHopper),l=mh(a),u=xr-2,h=Sl(o??0),p=this.fillSource==="estimate",f=`${Cl(i,this.food1,this.food2)}. ${kl(o,n,p)}`;return c`
      <svg class="art" viewBox="0 0 ${_l} ${vl}" role="img" aria-label=${f} preserveAspectRatio="xMidYMid meet">
        <g class="hopper-scene">
          <title>${Cl(i,this.food1,this.food2)}</title>
          ${uh(e,s)}
        </g>
        ${hh(e,this.feeding)}
        <g class="bowl-scene">
          <title>${kl(o,n,p)}</title>
          ${fh(e,o,this.bowlMix)}
        </g>
        ${this._dropping&&!ll()?bh(l,this.portions,an,u,h):d}
      </svg>
      ${n!=null?c`<div class="calibrated" role="status">${Math.round(n)}% full <span class="raw">\u00b7 raw ${Math.round(this.fill)}</span></div>`:d}
      <div class="chips">${i.map(m=>gh(m,gi(m.index,this.food1,this.food2),()=>this._openHopperDetail()))}</div>
    `}static{this.styles=y`
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
      aspect-ratio: ${_l} / ${vl};
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
  `}};customElements.define("kibble-bowl",on);function Tl(t,r){return t>0&&r>0?{hopper:"both",amount:t,amount2:r}:t>0?{hopper:"1",amount:t}:r>0?{hopper:"2",amount:r}:null}function cn(t,r){if(!r)return null;let e=r.detection_areas_hash??"#detection-areas";if(t===e)return"detection-areas";let i=r.calibrate_hash??"#calibrate";return t===i?"calibrate":null}function Pl(t,r,e=new Date){if(r)return 0;let i=(e.getTime()-432e5)/1e3;for(let s of t){if(s.kind!=="feed"||s.start<i)continue;let n=s.feed?.sides;if(!n||n.length===0)continue;let o=n.reduce((l,u)=>l+u.portions,0);if(o<=0)continue;return(n.find(l=>l.hopper===2)?.portions??0)/o}return 0}var $r={phase:"idle",elapsedMs:0},Sr={timeoutMs:1e4};function Al(){return{phase:"requesting",elapsedMs:0}}function Rl(t,r,e){if(t.phase!=="requesting")return t;let i=t.elapsedMs+r;return i>=e.timeoutMs?{phase:"timeout",elapsedMs:e.timeoutMs}:{phase:"requesting",elapsedMs:i}}function Ml(t,r){return r?{phase:"feeding",elapsedMs:0}:t.phase==="feeding"?$r:t}function dn(){return $r}var pn=class extends _{static{this.properties={value:{type:String},options:{attribute:!1},groupLabel:{type:String,attribute:"group-label"},disabled:{type:Boolean},contentFit:{type:Boolean,attribute:"content-fit"}}}constructor(){super(),this.value="",this.options=[],this.groupLabel="",this.disabled=!1,this.contentFit=!1}render(){return c`
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
    `}_select(r){this.dispatchEvent(new CustomEvent("option-selected",{detail:{value:r},bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-segmented-picker",pn);var un=class extends _{static{this.properties={value:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.min=1,this.max=20,this.step=1,this.disabled=!1}render(){return c`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value<=this.min} @click=${this._decrement} aria-label="Fewer portions">
          &minus;
        </button>
        <span class="value">${this.value}</span>
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value>=this.max} @click=${this._increment} aria-label="More portions">
          &plus;
        </button>
      </div>
    `}_decrement(){this._emit(Math.max(this.min,this.value-this.step))}_increment(){this._emit(Math.min(this.max,this.value+this.step))}_emit(r){this.dispatchEvent(new CustomEvent("value-selected",{detail:{value:r},bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-stepper",un);var{I:_h}=Ya,Ll=t=>t;var Il=t=>t.strings===void 0,Ol=()=>document.createComment(""),Dt=(t,r,e)=>{let i=t._$AA.parentNode,s=r===void 0?t._$AB:r._$AA;if(e===void 0){let n=i.insertBefore(Ol(),s),o=i.insertBefore(Ol(),s);e=new _h(n,o,t,t.options)}else{let n=e._$AB.nextSibling,o=e._$AM,a=o!==t;if(a){let l;e._$AQ?.(t),e._$AM=t,e._$AP!==void 0&&(l=t._$AU)!==o._$AU&&e._$AP(l)}if(n!==s||a){let l=e._$AA;for(;l!==n;){let u=Ll(l).nextSibling;Ll(i).insertBefore(l,s),l=u}}}return e},Ke=(t,r,e=t)=>(t._$AI(r,e),t),vh={},Hl=(t,r=vh)=>t._$AH=r,Dl=t=>t._$AH,Er=t=>{t._$AR(),t._$AA.remove()};var Tr={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},vi=t=>(...r)=>({_$litDirective$:t,values:r}),Ft=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,e,i){this._$Ct=r,this._$AM=e,this._$Ci=i}_$AS(r,e){return this.update(r,e)}update(r,e){return this.render(...e)}};var yi=(t,r)=>{let e=t._$AN;if(e===void 0)return!1;for(let i of e)i._$AO?.(r,!1),yi(i,r);return!0},Pr=t=>{let r,e;do{if((r=t._$AM)===void 0)break;e=r._$AN,e.delete(t),t=r}while(e?.size===0)},Fl=t=>{for(let r;r=t._$AM;t=r){let e=r._$AN;if(e===void 0)r._$AN=e=new Set;else if(e.has(t))break;e.add(t),wh(r)}};function yh(t){this._$AN!==void 0?(Pr(this),this._$AM=t,Fl(this)):this._$AM=t}function xh(t,r=!1,e=0){let i=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(r)if(Array.isArray(i))for(let n=e;n<i.length;n++)yi(i[n],!1),Pr(i[n]);else i!=null&&(yi(i,!1),Pr(i));else yi(this,t)}var wh=t=>{t.type==Tr.CHILD&&(t._$AP??=xh,t._$AQ??=yh)},Ar=class extends Ft{constructor(){super(...arguments),this._$AN=void 0}_$AT(r,e,i){super._$AT(r,e,i),Fl(this),this.isConnected=r._$AU}_$AO(r,e=!0){r!==this.isConnected&&(this.isConnected=r,r?this.reconnected?.():this.disconnected?.()),e&&(yi(this,r),Pr(this))}setValue(r){if(Il(this._$Ct))this._$Ct._$AI(r,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=r,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var T=()=>new fn,fn=class{},hn=new WeakMap,P=vi(class extends Ar{render(t){return d}update(t,[r]){let e=r!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=r,this.ht=t.options?.host,this.rt(this.ct=t.element)),d}rt(t){if(this.G!==void 0)if(this.isConnected||(t=void 0),typeof this.G=="function"){let r=this.ht??globalThis,e=hn.get(r);e===void 0&&(e=new WeakMap,hn.set(r,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return typeof this.G=="function"?hn.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var xi={phase:"idle",elapsedMs:0,firedStages:[],releaseProgress:0},Rr={durationMs:1500,stageThresholds:[.33,.66,.86],nearCompleteAt:.88,drainMs:300};function zl(){return{phase:"charging",elapsedMs:0,firedStages:[],releaseProgress:0}}function Nl(t,r,e){if(t.phase==="charging"){let i=t.elapsedMs+r;return i>=e.durationMs?{phase:"completed",elapsedMs:e.durationMs,firedStages:t.firedStages,releaseProgress:0}:{...t,elapsedMs:i}}if(t.phase==="draining"){let i=t.elapsedMs+r;return i>=e.drainMs?xi:{...t,elapsedMs:i}}return t}function jl(t,r){if(t.phase!=="charging")return t;let e=Math.min(1,t.elapsedMs/r.durationMs);return{phase:"draining",elapsedMs:0,firedStages:[],releaseProgress:e}}function Mr(t,r){if(t.phase==="idle")return 0;if(t.phase==="completed")return 1;if(t.phase==="charging")return Math.min(1,t.elapsedMs/r.durationMs);let e=r.drainMs>0?Math.min(1,t.elapsedMs/r.drainMs):1;return t.releaseProgress*(1-e)}function ql(t,r){return t.phase!=="charging"?!1:Mr(t,r)>=r.nearCompleteAt}function Bl(t,r){if(t.phase!=="charging")return[];let e=Mr(t,r),i=[];return r.stageThresholds.forEach((s,n)=>{e>=s&&!t.firedStages.includes(n)&&i.push(n)}),i}function Ul(t,r){return r.length===0?t:{...t,firedStages:[...t.firedStages,...r]}}function pe(t){typeof window>"u"||window.dispatchEvent(new CustomEvent("haptic",{detail:t}))}var kh=600,Ch=260,$h=450,wi=6,Wl=["#34d3c3","#9b87f5","#f7c948"];function Sh(t){let r=1-t;return 1-r*r*r}var mn=class extends _{constructor(){super();this._holdState=xi;this._config=Rr;this._pointerId=null;this._rafId=null;this._lastFrameMs=0;this._reducedMotion=!1;this._completed=!1;this._buttonRef=T();this._tapFlashRef=T();this._shockRef=T();this._ringRef=T();this._triangle1Ref=T();this._triangle2Ref=T();this._dotRefs=Array.from({length:8},()=>T());this._onPointerDown=e=>{if(this.disabled||this._holdState.phase==="charging")return;e.preventDefault();let i=e.currentTarget;try{i.setPointerCapture(e.pointerId),this._pointerId=e.pointerId}catch{}this._begin()};this._onPointerUp=e=>{this._pointerId!==null&&e.pointerId!==this._pointerId||this._release()};this._onKeyDown=e=>{e.key!==" "&&e.key!=="Enter"||e.repeat||this.disabled||this._holdState.phase==="charging"||(e.preventDefault(),this._begin())};this._onKeyUp=e=>{e.key!==" "&&e.key!=="Enter"||this._release()};this._onBlur=()=>{this._release()};this._suppressOsGesture=e=>{e.preventDefault()};this._tapActivate=()=>{this.disabled||(this._prefersReducedMotion()||this._playTapPulse(),this._activate())};this._chargeFrame=e=>{let i=Math.min(48,e-this._lastFrameMs);this._lastFrameMs=e;let s=this._holdState.phase;this._holdState=Nl(this._holdState,i,this._config);let n=Bl(this._holdState,this._config);if(n.length>0&&(this._holdState=Ul(this._holdState,n),this._onStagesCrossed()),this._paintProgress(this._displayProgress()),s!=="completed"&&this._holdState.phase==="completed"){this._onCompleted();return}this._holdState.phase==="charging"||this._holdState.phase==="draining"?this._rafId=requestAnimationFrame(this._chargeFrame):(this._rafId=null,this.requestUpdate())};this.label="Hold to feed",this.variant="feed",this.disabled=!1,this.holdMs=1500,this.pending=!1}static{this.properties={label:{type:String},variant:{type:String},disabled:{type:Boolean},holdMs:{type:Number,attribute:"hold-ms"},pending:{type:Boolean}}}disconnectedCallback(){super.disconnectedCallback(),this._stopChargeLoop(),clearTimeout(this._settleTimer),clearTimeout(this._staticGlowTimer),this._holdState=xi,this._pointerId=null}firstUpdated(){this._paintProgress(0)}updated(e){e.has("disabled")&&this.disabled&&this._release(),e.has("holdMs")&&(this._config={...Rr,durationMs:this._duration()})}_duration(){return Number.isFinite(this.holdMs)&&this.holdMs>0?this.holdMs:1500}_prefersReducedMotion(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0}_emblemTemplate(){let e=this._dotRefs.map((i,s)=>{let n=s/this._dotRefs.length*Math.PI*2,o=(24+Math.cos(n)*21).toFixed(2),a=(24+Math.sin(n)*21).toFixed(2);return H`<circle ${P(i)} class="dot" cx=${o} cy=${a} r="1.8"></circle>`});return H`
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
    `}render(){let e=this.variant==="feed",i=this._holdState.phase,s=["button",e?"feed":"cancel",i==="charging"?"holding":"",this._completed?"completed":"",e&&this.pending?"pending":"",this._reducedMotion?"reduced-motion":""].filter(Boolean).join(" "),n=i==="charging"?`${this.label}. Keep holding to continue.`:this.label;return c`
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
                  <span class="label-check" aria-hidden="true">${g("check")}</span>
                </span>
              `:c`<span class="tap-flash" ${P(this._tapFlashRef)} aria-hidden="true"></span>
                <span class="label"><span class="label-text">${this.label}</span></span>`}
        </button>
      </div>
    `}_begin(){this._reducedMotion=this._prefersReducedMotion(),this._config={...Rr,durationMs:this._duration()},this._holdState=zl(),this._completed=!1,clearTimeout(this._settleTimer),this.requestUpdate(),this._paintProgress(0),this._lastFrameMs=performance.now(),this._stopChargeLoop(),this._rafId=requestAnimationFrame(this._chargeFrame)}_release(){this._releasePointerCapture(),this._pointerId=null,this._holdState.phase==="charging"&&(this._holdState=jl(this._holdState,this._config),this.requestUpdate())}_releasePointerCapture(){let e=this._pointerId,i=this._buttonRef.value;if(!(e===null||!i))try{i.hasPointerCapture(e)&&i.releasePointerCapture(e)}catch{}}_playTapPulse(){let e=this._buttonRef.value,i=this._tapFlashRef.value;e?.classList.remove("tap-pulse"),i?.classList.remove("flash-pulse"),e?.offsetWidth,e?.classList.add("tap-pulse"),i?.classList.add("flash-pulse")}_activate(){this.dispatchEvent(new CustomEvent("activate",{bubbles:!0,composed:!0}))}_stopChargeLoop(){this._rafId!=null&&cancelAnimationFrame(this._rafId),this._rafId=null}_displayProgress(){let e=Mr(this._holdState,this._config);if(this._holdState.phase!=="draining"||this._config.drainMs<=0)return e;let i=this._holdState.releaseProgress;if(i<=0)return 0;let s=Math.min(1,this._holdState.elapsedMs/this._config.drainMs);return i*(1-Sh(s))}_tierColor(e){let i=0;for(let s of this._config.stageThresholds)e>=s&&(i+=1);return Wl[Math.min(i,Wl.length-1)]}_paintProgress(e){let i=this._buttonRef.value;if(!i)return;let s=Math.max(0,Math.min(1,e)),n=this._tierColor(s);i.style.setProperty("--p",s.toFixed(4)),i.style.setProperty("--c",n);let o=ql(this._holdState,this._config)&&!this._reducedMotion;i.classList.toggle("tense",o);let a=(u,h)=>Math.max(0,Math.min(1,(s-u)/(h-u))),l=u=>(100-u*100).toFixed(2);this._ringRef.value?.setAttribute("stroke-dashoffset",l(a(0,.45))),this._triangle1Ref.value?.setAttribute("stroke-dashoffset",l(a(.3,.7))),this._triangle2Ref.value?.setAttribute("stroke-dashoffset",l(a(.6,.95))),this._dotRefs.forEach((u,h)=>{u.value?.classList.toggle("lit",s>=(h+1)/(this._dotRefs.length+1))})}_onStagesCrossed(){pe("light"),this._pulseShock(!1)}_pulseShock(e){let i=this._shockRef.value;if(i){if(clearTimeout(this._staticGlowTimer),i.classList.remove("go","static"),i.classList.toggle("complete",e),i.offsetWidth,this._reducedMotion){i.classList.add("static"),this._staticGlowTimer=window.setTimeout(()=>i.classList.remove("static","complete"),e?$h:Ch);return}i.classList.add("go")}}_onCompleted(){this._releasePointerCapture(),this._pointerId=null,this._completed=!0,this.requestUpdate(),pe("success"),this._pulseShock(!0),this._activate(),this._settleTimer=window.setTimeout(()=>{this._completed=!1,this._holdState=xi,this._paintProgress(0),this.requestUpdate()},kh)}static{this.styles=y`
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
      left: ${wi}px;
      top: 50%;
      transform: translateY(-50%);
      width: calc(var(--kibble-feed-button-height, 56px) - ${wi*2}px);
      height: calc(var(--kibble-feed-button-height, 56px) - ${wi*2}px);
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
      padding-left: calc(${wi}px + (var(--kibble-feed-button-height, 56px) - ${wi*2}px) + 8px);
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
  `}};customElements.define("kibble-hold-button",mn);var Kl={time:"12:00",amount_l:1,amount_r:0},bn=class extends _{constructor(){super();this._openNew=()=>{this._error=null,this._confirmRemove=!1,this._draft={...Kl},this._target="new"};this._closeForm=()=>{this._target=null,this._confirmRemove=!1};this._onTimeInput=e=>{this._draft={...this._draft,time:e.target.value}};this._onSubmit=e=>{e.preventDefault(),this._save()};this.entries=[],this.food1=null,this.food2=null,this._target=null,this._draft={...Kl},this._confirmRemove=!1,this._busy=!1,this._error=null,this._toggling=new Set}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},deviceId:{type:String},food1:{type:String},food2:{type:String},_target:{state:!0},_draft:{state:!0},_confirmRemove:{state:!0},_busy:{state:!0},_error:{state:!0},_toggling:{state:!0}}}willUpdate(e){e.has("entries")&&this._target!==null&&this._target!=="new"&&!this.entries.some(i=>i.id===this._target)&&this._closeForm()}render(){let e=hr(this.entries);return c`
      ${this._error?c`<p class="error" role="alert">${this._error}</p>`:d}
      ${e.length===0&&this._target!=="new"?c`<p class="empty">No feeds scheduled</p>`:d}
      <ul class="entries">
        ${e.map(i=>c`<li>${this._target===i.id?this._renderForm(i):this._renderRow(i)}</li>`)}
      </ul>
      ${this._target==="new"?c`<div class="form-slot">${this._renderForm(null)}</div>`:c`
            <button type="button" class="add" ?disabled=${this._busy||!this.deviceId} @click=${this._openNew}>
              <span class="add-icon">${g("plus")}</span><span>Add feed</span>
            </button>
          `}
    `}_renderRow(e){let i=`${Ue(e.time)}, ${bi(e,!1,this.food1,this.food2)}, ${e.enabled?"on":"paused"}`;return c`
      <div class="row ${e.enabled?"":"paused"}">
        <button type="button" class="row-main" aria-label="Edit feed: ${i}" ?disabled=${this._busy} @click=${()=>this._openEdit(e)}>
          <span class="time">${Ue(e.time)}</span>
          ${this._renderAmount(pt(1,this.food1),e.amount_l)} ${this._renderAmount(pt(2,this.food2),e.amount_r)}
        </button>
        <button
          type="button"
          class="switch ${e.enabled?"on":""}"
          role="switch"
          aria-checked=${e.enabled}
          aria-label="${Ue(e.time)} feed ${e.enabled?"on":"paused"}"
          ?disabled=${this._busy||this._toggling.has(e.id)}
          @click=${()=>this._toggle(e)}
        >
          <span class="track"><span class="thumb"></span></span>
          <span class="switch-word">${e.enabled?"On":"Paused"}</span>
        </button>
      </div>
    `}_renderAmount(e,i){return c`
      <span class="amount ${i===0?"zero":""}">
        <span class="amount-name">${e}</span>
        <span class="amount-value">${i}</span>
      </span>
    `}_renderForm(e){if(e&&this._confirmRemove)return this._renderRemoveConfirm(e);let i=this._draft,s=Js(i),n=pt(1,this.food1),o=pt(2,this.food2);return c`
      <form class="form" @submit=${this._onSubmit} novalidate>
        <h3>${e?"Edit feed":"Add feed"}</h3>
        <label class="field">
          <span class="field-label">Time</span>
          <input type="time" step="60" required .value=${i.time} ?disabled=${this._busy} @input=${this._onTimeInput} />
        </label>
        <div class="field">
          <span class="field-label">${n}</span>
          <kibble-stepper
            .value=${i.amount_l}
            .min=${0}
            .max=${mi}
            aria-label="${n} portions"
            ?disabled=${this._busy}
            @value-selected=${a=>this._setAmount("amount_l",a)}
          ></kibble-stepper>
        </div>
        <div class="field">
          <span class="field-label">${o}</span>
          <kibble-stepper
            .value=${i.amount_r}
            .min=${0}
            .max=${mi}
            aria-label="${o} portions"
            ?disabled=${this._busy}
            @value-selected=${a=>this._setAmount("amount_r",a)}
          ></kibble-stepper>
        </div>
        ${s?c`<p class="hint" role="status">${s}</p>`:d}
        <div class="actions">
          ${e?c`<button type="button" class="btn danger-text" ?disabled=${this._busy} @click=${()=>this._confirmRemove=!0}>
                <span class="btn-icon">${g("deleteOutline")}</span><span>Remove</span>
              </button>`:d}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${this._busy} @click=${this._closeForm}>Cancel</button>
          <button type="submit" class="btn primary" ?disabled=${this._busy||s!==null}>${this._busy?"Saving\u2026":"Save"}</button>
        </div>
      </form>
    `}_renderRemoveConfirm(e){return c`
      <div class="form" role="alertdialog" aria-label="Remove this feed?">
        <h3>Remove the ${Ue(e.time)} feed?</h3>
        <p class="confirm-text">
          ${bi(e,!1,this.food1,this.food2)} will no longer be given at that time. This cannot be undone.
        </p>
        <div class="actions">
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${this._busy} @click=${()=>this._confirmRemove=!1}>Keep</button>
          <button type="button" class="btn danger" ?disabled=${this._busy} @click=${()=>this._remove(e)}>
            ${this._busy?"Removing\u2026":"Remove feed"}
          </button>
        </div>
      </div>
    `}_openEdit(e){this._error=null,this._confirmRemove=!1,this._draft={time:e.time.padStart(5,"0"),amount_l:e.amount_l,amount_r:e.amount_r},this._target=e.id}_setAmount(e,i){i.stopPropagation(),this._draft={...this._draft,[e]:i.detail.value}}async _run(e,i){this._error=null,this._busy=!0;try{return await i(),!0}catch(s){return this._error=`${e}: ${en(s)}`,!1}finally{this._busy=!1}}async _save(){let e=this._target;if(e===null||Js(this._draft)!==null)return;let i=this.deviceId;if(!i){this._error="Could not save the feed: the feeder was not found";return}let s=this._draft;await this._run("Could not save the feed",()=>e==="new"?this.hass.callService("kibble","schedule_add",el(i,s)):this.hass.callService("kibble","schedule_set",{device_id:i,entries:tl(this.entries,e,s)}))&&(pe("success"),this._closeForm())}async _remove(e){let i=this.deviceId;if(!i){this._error="Could not remove the feed: the feeder was not found";return}await this._run("Could not remove the feed",()=>this.hass.callService("kibble","schedule_remove",{device_id:i,entry_id:e.id}))&&this._closeForm()}async _toggle(e){let i=this.deviceId;if(i){this._error=null,this._toggling=new Set(this._toggling).add(e.id);try{await this.hass.callService("kibble","schedule_set_enabled",{device_id:i,entry_id:e.id,enabled:!e.enabled})}catch(s){this._error=`Could not ${e.enabled?"pause":"turn on"} the feed: ${en(s)}`}finally{let s=new Set(this._toggling);s.delete(e.id),this._toggling=s}}}static{this.styles=y`
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
  `}};customElements.define("kibble-schedule-editor",bn);var gn="dispenser-schedule-card",_n=class extends _{constructor(){super();this._embedRef=T();this._configureEmbed=e=>{if(!e||!this.scheduleCardStateEntity)return;let i=e.querySelector(gn);if(i){i.hass=this.hass;return}let s=document.createElement(gn);s.setConfig({type:"custom:dispenser-schedule-card",device:{type:"custom",entity:this.scheduleCardStateEntity,max_entries:24,min_amount:1,max_amount:20,step_amount:1,status_map:["0 -> dispensed","1 -> failed","2 -> pending","3 -> dispensing"],status_pattern:"(?<id>[^,]+),(?<hour>[0-9]{1,2}),(?<minute>[0-9]{1,2}),(?<amount>[0-9]{1,2}),(?<status>[0-9]);?",actions:{add:"kibble.schedule_card_add",edit:"kibble.schedule_card_edit",remove:"kibble.schedule_card_remove",toggle:"kibble.schedule_card_toggle"}},unit_of_measurement:{one:"portion",other:"portions"}}),s.hass=this.hass,e.appendChild(s)};this.entries=[],this.singleHopper=!1,this.food1=null,this.food2=null}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},scheduleCardStateEntity:{type:String},singleHopper:{type:Boolean},deviceId:{type:String},food1:{type:String},food2:{type:String}}}updated(){this._embedRef.value&&this.hass&&(this._embedRef.value.hass=this.hass)}render(){if(!this.singleHopper)return c`<kibble-schedule-editor
        .hass=${this.hass}
        .entries=${this.entries}
        .deviceId=${this.deviceId}
        .food1=${this.food1}
        .food2=${this.food2}
      ></kibble-schedule-editor>`;if(this._canEmbed())return c`<div ${P(this._configureEmbed)}></div>`;if(this.entries.length===0)return c`<p class="empty">No schedule set</p>`;let e=hr(this.entries);return c`
      <ul class="entries">
        ${e.map(i=>c`
            <li class=${i.enabled?"":"disabled"}>
              <span class="time">${Ue(i.time)}</span>
              <span class="amounts">${bi(i,!0)}</span>
              <span class="state">${i.enabled?"On":"Paused"}</span>
            </li>
          `)}
      </ul>
    `}_canEmbed(){if(!customElements.get(gn)||!this.scheduleCardStateEntity)return!1;let e=this.hass?.states[this.scheduleCardStateEntity];return e!==void 0&&e.state!=="unavailable"}static{this.styles=y`
    :host {
      display: block;
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
  `}};customElements.define("kibble-schedule-body",_n);var vn=class extends _{constructor(){super();this._expanded=!1;this.entries=[],this.deviceName="Kibble",this.singleHopper=!1,this.food1=null,this.food2=null}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},scheduleCardStateEntity:{type:String},deviceName:{type:String},singleHopper:{type:Boolean},deviceId:{type:String},food1:{type:String},food2:{type:String}}}render(){let e=new Date,i=Ja(this.entries,e);return c`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${i}</span>
        <span class="chevron ${this._expanded?"open":""}">${g("chevronDown")}</span>
      </button>
      ${this._expanded?c`<div class="expanded">
            <kibble-schedule-body
              .hass=${this.hass}
              .entries=${this.entries}
              .scheduleCardStateEntity=${this.scheduleCardStateEntity}
              .singleHopper=${this.singleHopper}
              .deviceId=${this.deviceId}
              .food1=${this.food1}
              .food2=${this.food2}
            ></kibble-schedule-body>
          </div>`:d}
    `}_toggle(){this._expanded=!this._expanded,this.requestUpdate()}static{this.styles=y`
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
  `}};customElements.define("kibble-schedule-summary",vn);var Eh="calibration_busy";function yn(t){return`${t} portion${t===1?"":"s"}`}function Lr(t){return String(Math.round(t*100))}var xn=class extends _{constructor(){super();this._closeButtonRef=T();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&this._close()};this._loadCalibration=()=>{let e=this.hass?.callWS,i=this.entryId;if(!e||!i){this._loadError="Not connected.";return}this._loading=!0,this._loadError=null,e({type:"kibble/calibration",entry_id:i}).then(s=>{this._calibration=s,this._loading=!1},s=>{this._loadError=U(s),this._loading=!1})};this._confirmEmpty=()=>{if(this._hopper===null)return;let e=this._hopper,i=this._note.trim();this._runAction({action:"begin",hopper:e,...i?{note:i}:{}},this._confirmEmpty,()=>{this._runAction({action:"point",hopper:e,portions:0},this._confirmEmpty,s=>{this._calibration=s,this._regression=null,this._step=Le(this._step,"empty-confirmed")})})};this._capturePoint=()=>{if(this._hopper===null)return;let e=this._hopper,i=this._hopperData(e)?.points??[],s=(i[i.length-1]?.portions??0)+1;this._runAction({action:"point",hopper:e,portions:s},this._capturePoint,n=>{let o=n.hoppers[e]?.points.find(a=>a.portions===s);this._regression=o?fl(i,o):null,this._calibration=n,this._step=Le(this._step,"capture")})};this._confirmMarkFull=()=>{if(this._hopper===null||this._markFullPortions===null)return;let e=this._hopper,i=this._markFullPortions;this._runAction({action:"full",hopper:e,portions:i},this._confirmMarkFull,s=>{this._calibration=s,this._step=this.singleHopper?"done":Le(this._step,"full-marked")})};this._acceptInherit=()=>{if(this._hopper===null)return;let e=this._hopper,i=e===0?1:0;this._runAction({action:"inherit",hopper:i,from:e},this._acceptInherit,s=>{this._calibration=s,this._inheritedTo=i,this._step=Le(this._step,"inherit-resolved")})};this._runClear=()=>{if(this._hopper===null)return;let e=this._hopper;this._runAction({action:"clear",hopper:e},this._runClear,i=>{this._calibration=i})};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.singleHopper=!1,this.food1=null,this.food2=null,this.entryId=void 0,this._resetWizard()}static{this.properties={hass:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},_step:{state:!0},_hopper:{state:!0},_calibration:{state:!0},_loading:{state:!0},_loadError:{state:!0},_note:{state:!0},_busy:{state:!0},_error:{state:!0},_waitingForBowl:{state:!0},_regression:{state:!0},_markFullPortions:{state:!0},_clearConfirmArmed:{state:!0},_inheritedTo:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),clearTimeout(this._clearConfirmTimer)}updated(e){e.has("open")&&this.open&&(this._resetWizard(),this._closeButtonRef.value?.focus(),this._loadCalibration())}_resetWizard(){this._step="choose-hopper",this._hopper=null,this._calibration=null,this._loading=!1,this._loadError=null,this._note="",this._busy=!1,this._error=null,this._waitingForBowl=!1,this._regression=null,this._markFullPortions=null,this._clearConfirmArmed=!1,this._inheritedTo=null}_hopperData(e){return e===null||!this._calibration?null:this._calibration.hoppers[e]}_runAction(e,i,s){let n=this.hass?.callWS,o=this.entryId;!n||!o||(this._busy=!0,this._error=null,this._waitingForBowl=!1,n({type:"kibble/calibration/action",entry_id:o,...e}).then(a=>{this._busy=!1,s(a),this.dispatchEvent(new CustomEvent("calibration-changed",{bubbles:!0,composed:!0}))},a=>{if(this._busy=!1,a?.code===Eh){this._waitingForBowl=!0;return}this._error={message:U(a),retry:i}}))}_selectHopper(e){this._hopper=e,this._error=null}_beginRequested(){this._note="",this._step=Le(this._step,"start")}_reviewFull(){this._markFullPortions=null,this._step=Le(this._step,"review-full")}_declineInherit(){this._inheritedTo=null,this._step=Le(this._step,"inherit-resolved")}_clearRequested(){if(this._clearConfirmArmed){clearTimeout(this._clearConfirmTimer),this._clearConfirmArmed=!1,this._runClear();return}this._clearConfirmArmed=!0,this._clearConfirmTimer=setTimeout(()=>{this._clearConfirmArmed=!1},3e3)}_restart(){let e=this._hopper===0?1:this._hopper===1?0:null;this._step=Le(this._step,"restart"),this._hopper=e,this._note="",this._markFullPortions=null,this._regression=null,this._inheritedTo=null,this._clearConfirmArmed=!1}render(){return this.open?c`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Calibrate bowl">
        <div class="sheet" @click=${e=>e.stopPropagation()}>
          <header>
            <span>Calibrate bowl</span>
            <button type="button" class="icon-button" ${P(this._closeButtonRef)} @click=${this._close} aria-label="Close">${g("close")}</button>
          </header>
          <div class="body">
            ${!this.hass?.callWS||!this.entryId?c`<p class="hint">Calibration isn't available right now.</p>`:this._renderStep()}
          </div>
        </div>
      </div>
    `:d}_renderStep(){switch(this._step){case"choose-hopper":return this._renderChooseHopper();case"confirm-empty":return this._renderConfirmEmpty();case"collecting":return this._renderCollecting();case"mark-full":return this._renderMarkFull();case"offer-inherit":return this._renderOfferInherit();case"done":return this._renderDone()}}_hopperLabel(e){return this.singleHopper?"Hopper":`Hopper ${e+1}`}_hopperRowLabel(e){let i=this._hopperLabel(e);if(this.singleHopper)return i;let s=(e===0?this.food1:this.food2)?.trim();return s?`${i} \xB7 ${s}`:i}_renderChooseHopper(){if(this._loading)return c`<p class="hint">Loading calibration\u2026</p>`;if(this._loadError)return c`
        <div class="error">
          <span>Couldn't load calibration. ${this._loadError}</span>
          <button type="button" @click=${this._loadCalibration}>Try again</button>
        </div>
      `;let e=this.singleHopper?[0]:[0,1];return c`
      <p class="hint">
        ${this.singleHopper?"Dispensing known portions into an empty bowl builds the curve your fill reading is interpreted against.":"Pick a hopper. Each side keeps its own curve, since the two hoppers can hold different food."}
      </p>
      <div class="hopper-rows">${e.map(i=>this._renderHopperRow(i))}</div>
      ${this._hopper!==null?this._renderHopperActions(this._hopper):d}
    `}_renderHopperRow(e){let i=_i(this._hopperData(e));return c`
      <button type="button" class="hopper-row ${this._hopper===e?"selected":""}" @click=${()=>this._selectHopper(e)}>
        <span class="hopper-row-label">${this._hopperRowLabel(e)}</span>
        <span class="hopper-row-status">${this._statusLine(i)}</span>
        ${i.note?c`<span class="hopper-row-note">${i.note}</span>`:d}
      </button>
    `}_statusLine(e){if(e.kind==="never")return"Never calibrated";let i=e.measuredAt?Lt(new Date(e.measuredAt*1e3),new Date):null,s=e.finished?"":" (unfinished)";return e.kind==="inherited"?`Inherited from Hopper ${e.inheritedFromDisplay}${i?` \xB7 ${i}`:""}${s}`:`Measured${i?` ${i}`:""}${s}`}_renderHopperActions(e){let i=_i(this._hopperData(e)),s=this._hopperLabel(e);return i.kind==="never"?c`<button type="button" class="primary" @click=${()=>this._beginRequested()}>Calibrate ${s}</button>`:c`
      <div class="hopper-actions">
        <button type="button" class="danger ${this._clearConfirmArmed?"confirming":""}" ?disabled=${this._busy} @click=${()=>this._clearRequested()}>
          ${this._clearConfirmArmed?"Tap again to clear":"Clear calibration"}
        </button>
        <button type="button" class="primary" @click=${()=>this._beginRequested()}>Recalibrate ${s}</button>
      </div>
      ${this._renderError()}
    `}_renderConfirmEmpty(){let e=this._hopper;if(e===null)return d;let i=this._hopperLabel(e),s=_i(this._hopperData(e)).kind!=="never";return c`
      <p class="hint">Make sure ${i}'s side of the bowl is completely empty, then start.</p>
      ${s?c`<div class="warning">Starting discards ${i}'s existing calibration.</div>`:d}
      <label class="field">
        <span>What food is this? (optional)</span>
        <input
          type="text"
          .value=${this._note}
          placeholder="e.g. freeze-dried on this side"
          @input=${n=>{this._note=n.target.value}}
        />
      </label>
      ${this._waitingForBowl?this._renderWaitingForBowl():d}
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._confirmEmpty}>${this._busy?"Starting\u2026":"Bowl is empty, start"}</button>
      </div>
    `}_renderCollecting(){let e=this._hopper;if(e===null)return d;let i=this._hopperData(e)?.points??[];return c`
      <p class="hint">Dispense one portion into ${this._hopperLabel(e)}'s side yourself, then capture the reading.</p>
      ${this._renderCurve(i)}
      ${this._regression?c`<div class="warning">
            This step's score (${Lr(this._regression.newScore)}) is lower than the previous step's (${Lr(this._regression.previousScore)}). A
            curve that dips can't be interpolated. Recapture this step before continuing.
          </div>`:d}
      ${this._waitingForBowl?this._renderWaitingForBowl():d}
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy||!hl(i)} @click=${()=>this._reviewFull()}>This is full</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._capturePoint}>${this._busy?"Capturing\u2026":"Capture reading"}</button>
      </div>
    `}_renderCurve(e){return e.length===0?d:c`
      <ul class="curve">
        ${e.map((i,s)=>{let n=s>0?e[s-1]:null,o=n!==null&&i.score<n.score;return c`
            <li class="curve-row ${o?"dropped":""}">
              <span>${yn(i.portions)}</span>
              <span class="score">${Lr(i.score)}</span>
            </li>
          `})}
      </ul>
    `}_renderMarkFull(){let e=this._hopper;if(e===null)return d;let i=(this._hopperData(e)?.points??[]).filter(s=>s.portions>0);return c`
      <p class="hint">Which step looked full?</p>
      <ul class="curve selectable">
        ${i.map(s=>c`
            <li>
              <button type="button" class="curve-choice ${this._markFullPortions===s.portions?"selected":""}" @click=${()=>this._markFullPortions=s.portions}>
                <span>${yn(s.portions)}</span>
                <span class="score">${Lr(s.score)}</span>
              </button>
            </li>
          `)}
      </ul>
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy||this._markFullPortions===null} @click=${this._confirmMarkFull}>
          ${this._busy?"Saving\u2026":this._markFullPortions===null?"Mark full":`Mark full at ${yn(this._markFullPortions)}`}
        </button>
      </div>
    `}_renderOfferInherit(){let e=this._hopper;if(e===null)return d;let i=e===0?1:0,s=_i(this._hopperData(i)).kind!=="never";return c`
      <p class="hint">${this._hopperLabel(e)} is calibrated.</p>
      <p class="hint">
        Copy this curve to ${this._hopperLabel(i)}? Only do this if it's the same food in both hoppers. This is a shortcut for
        "same food," not a second measurement.${s?c` This replaces ${this._hopperLabel(i)}'s existing calibration.`:d}
      </p>
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy} @click=${()=>this._declineInherit()}>Not now</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._acceptInherit}>${this._busy?"Copying\u2026":`Copy to ${this._hopperLabel(i)}`}</button>
      </div>
    `}_renderDone(){let e=this._hopper;return e===null?d:c`
      <p class="hint">${this._hopperLabel(e)} is calibrated.${this._inheritedTo!==null?c` Copied to ${this._hopperLabel(this._inheritedTo)} too.`:d}</p>
      <div class="actions">
        ${this.singleHopper?d:c`<button type="button" @click=${()=>this._restart()}>Calibrate the other hopper</button>`}
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
    `:d}static{this.styles=y`
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
  `}};customElements.define("kibble-calibration-dialog",xn);function ft(t){return Math.min(1,Math.max(0,t))}function He(t,r,e){return e.width<=0||e.height<=0?{x:0,y:0}:{x:ft((t-e.left)/e.width),y:ft((r-e.top)/e.height)}}function ki(t,r){return[Math.min(t.x,r.x),Math.min(t.y,r.y),Math.max(t.x,r.x),Math.max(t.y,r.y)]}function Ye(t){return Math.max(0,t[2]-t[0])}function zt(t){return Math.max(0,t[3]-t[1])}function Yl(t,r=.01){return Ye(t)>=r&&zt(t)>=r}function Or(t){if(!Array.isArray(t)||t.length!==4)return null;let r=t.map(Number);if(r.some(i=>!Number.isFinite(i)))return null;let e=[r[0],r[1],r[2],r[3]];return e.some(i=>i<0||i>1)||Ye(e)<=0||zt(e)<=0?null:e}function wn(t){return Array.isArray(t)?t.flatMap(r=>{let e=Or(r);return e?[e]:[]}):[]}var Gl=["nw","n","ne","e","se","s","sw","w"];function Ir(t,r){let[e,i,s,n]=t,o=(e+s)/2,a=(i+n)/2;switch(r){case"nw":return{x:e,y:i};case"n":return{x:o,y:i};case"ne":return{x:s,y:i};case"e":return{x:s,y:a};case"se":return{x:s,y:n};case"s":return{x:o,y:n};case"sw":return{x:e,y:n};case"w":return{x:e,y:a}}}var kn=.02;function Cn(t,r,e,i=kn){let[s,n,o,a]=t,l=ft(e.x),u=ft(e.y);return(r==="nw"||r==="w"||r==="sw")&&(s=Math.min(l,o-i)),(r==="ne"||r==="e"||r==="se")&&(o=Math.max(l,s+i)),(r==="nw"||r==="n"||r==="ne")&&(n=Math.min(u,a-i)),(r==="sw"||r==="s"||r==="se")&&(a=Math.max(u,n+i)),[s,n,o,a]}function Ci(t,r,e){let i=Ye(t),s=zt(t),n=Math.min(Math.max(t[0]+r,0),Math.max(0,1-i)),o=Math.min(Math.max(t[1]+e,0),Math.max(0,1-s));return[n,o,n+i,o+s]}var Ge=[1/3,2/3,2/3,1];function Hr(t){return String(Math.round(t*1e4)/100)+"%"}function Fr(t){return{left:Hr(t[0]),top:Hr(t[1]),width:Hr(t[2]-t[0]),height:Hr(t[3]-t[1])}}function Nt(t,r){let e=r[2]-r[0],i=r[3]-r[1];if(e<=0||i<=0||t[2]<=t[0]||t[3]<=t[1])return null;let s=Math.max(t[0],r[0]),n=Math.max(t[1],r[1]),o=Math.min(t[2],r[2]),a=Math.min(t[3],r[3]);return o<=s||a<=n?null:[(s-r[0])/e,(n-r[1])/i,(o-r[0])/e,(a-r[1])/i]}function Dr(t,r,e){return Math.min(e,Math.max(r,t))}function Th(t,r,e){return t.left<r.left+r.width+e&&t.left+t.width+e>r.left&&t.top<r.top+r.height+e&&t.top+t.height+e>r.top}function Ql(t,r,e,i=4,s=0){let n=Math.max(0,s),o=[...t].sort((l,u)=>l.box[0]+l.box[2]-(u.box[0]+u.box[2])),a=[];for(let l of o){let u=l.height??22,h=Math.max(0,r-l.width),p=Math.max(0,e-u),f=l.box[0]*r,m=l.box[1]*e,b=m-u-i<n,x=Dr(f,0,h),v=Math.max(m+i,n),$=Dr(b?v:m-u-i,0,p),D=new Set([x,0,h]);for(let w of a)D.add(Dr(w.left+w.width+i,0,h)),D.add(Dr(w.left-l.width-i,0,h));let z=[...D].sort((w,E)=>Math.abs(w-x)-Math.abs(E-x)),R=[$],V=u+i;for(let w=V;w<=e;w+=V){let E=$+w,L=$-w;E<=p&&R.push(E),L>=(b?v:n)&&R.push(L)}let G;for(let w of R){for(let E of z){let L={key:l.key,left:E,top:w,flipped:b,width:l.width,height:u};if(!a.some(j=>Th(L,j,i))){G=L;break}}if(G)break}a.push(G??{key:l.key,left:x,top:$,flipped:b,width:l.width,height:u})}return a.map(({key:l,left:u,top:h,flipped:p})=>({key:l,left:u,top:h,flipped:p}))}var Ph=1e3,zr=.01,Ah=50,Rh={nw:"nwse-resize",n:"ns-resize",ne:"nesw-resize",e:"ew-resize",se:"nwse-resize",s:"ns-resize",sw:"nesw-resize",w:"ew-resize"},$n=class extends _{constructor(){super();this._imageRef=T();this._cancelRef=T();this._imageUrl=null;this._imagePath=null;this._objectUrl=null;this._masks=[];this._bowl=Ge;this._baseline=null;this._selected=null;this._hidden=new Set;this._undoStack=[];this._drawStart=null;this._drawing=null;this._pointerId=null;this._edit=null;this._showDetections=!1;this._visionFrame=null;this._visionTimer=void 0;this._confirmDiscard=!1;this._loading=!1;this._saving=!1;this._error=null;this._loadGeneration=0;this._onImageLoad=()=>{this.requestUpdate()};this._pollVision=()=>{let e=this.hass?.callWS,i=this.entryId;!e||!i||e({type:"kibble/vision/last",entry_id:i}).then(s=>{this._visionFrame=s.frame,this.requestUpdate()},()=>{})};this._toggleDetections=()=>{this._showDetections=!this._showDetections,this._showDetections?(this._pollVision(),this._visionTimer=setInterval(this._pollVision,Ph)):this._stopVisionPolling(),this.requestUpdate()};this._onStagePointerDown=e=>{if(this._saving||e.button!==0)return;let i=this._imageRef.value;if(!i)return;let s=He(e.clientX,e.clientY,i.getBoundingClientRect());this._selected=null,this._drawStart=s,this._drawing=[s.x,s.y,s.x,s.y],this._pointerId=e.pointerId,e.currentTarget.setPointerCapture(e.pointerId),e.preventDefault(),this.requestUpdate()};this._onStageMove=e=>{if(this._pointerId!==e.pointerId||!this._drawStart)return;let i=this._imageRef.value;if(!i)return;let s=He(e.clientX,e.clientY,i.getBoundingClientRect());this._drawing=ki(this._drawStart,s),this.requestUpdate()};this._onStageUp=e=>{if(this._pointerId!==e.pointerId||!this._drawStart)return;let i=this._imageRef.value;if(i){let s=He(e.clientX,e.clientY,i.getBoundingClientRect()),n=ki(this._drawStart,s);Yl(n)&&(this._pushUndo(),this._masks=[...this._masks,n],this._selected={kind:"mask",index:this._masks.length-1})}this._finishStageDraw(e)};this._onStageCancel=e=>{this._pointerId===e.pointerId&&this._finishStageDraw(e)};this._beginMove=(e,i)=>{if(this._saving||e.button!==0)return;e.stopPropagation();let s=this._imageRef.value;if(!s)return;this._pushUndo(),this._selected=i;let n=He(e.clientX,e.clientY,s.getBoundingClientRect());this._edit={pointerId:e.pointerId,target:i,handle:null,start:n,original:this._areaFor(i)},e.currentTarget.setPointerCapture(e.pointerId),e.preventDefault(),this.requestUpdate()};this._beginResize=(e,i,s)=>{if(this._saving||e.button!==0)return;e.stopPropagation();let n=this._imageRef.value;if(!n)return;this._pushUndo(),this._selected=i;let o=He(e.clientX,e.clientY,n.getBoundingClientRect());this._edit={pointerId:e.pointerId,target:i,handle:s,start:o,original:this._areaFor(i)},e.currentTarget.setPointerCapture(e.pointerId),e.preventDefault(),this.requestUpdate()};this._onEditMove=e=>{let i=this._edit;if(!i||i.pointerId!==e.pointerId)return;let s=this._imageRef.value;if(!s)return;let n=He(e.clientX,e.clientY,s.getBoundingClientRect()),o=i.handle?Cn(i.original,i.handle,n):Ci(i.original,n.x-i.start.x,n.y-i.start.y);this._setAreaFor(i.target,o),this.requestUpdate()};this._onEditEnd=e=>{let i=this._edit;if(!i||i.pointerId!==e.pointerId)return;let s=e.currentTarget;s.hasPointerCapture(e.pointerId)&&s.releasePointerCapture(e.pointerId),this._edit=null,this.requestUpdate()};this._selectTarget=e=>{this._selected=e,this.requestUpdate()};this._toggleVisibility=e=>{let i=new Set(this._hidden);i.has(e)?i.delete(e):(i.add(e),this._selected?.kind==="mask"&&this._selected.index===e&&(this._selected=null)),this._hidden=i,this.requestUpdate()};this._deleteMask=e=>{this._pushUndo(),this._masks=this._masks.filter((i,s)=>s!==e),this._hidden=new Set([...this._hidden].filter(i=>i!==e).map(i=>i>e?i-1:i)),this._selected?.kind==="mask"&&(this._selected.index===e?this._selected=null:this._selected.index>e&&(this._selected={kind:"mask",index:this._selected.index-1})),this.requestUpdate()};this._resetBowl=()=>{this._pushUndo(),this._bowl=Ge,this.requestUpdate()};this._undo=()=>{let e=this._undoStack.pop();e&&(this._masks=e.masks,this._bowl=e.bowl,this._selected=null,this.requestUpdate())};this._onKeydown=e=>{if(e.key==="Escape"&&!this._saving){e.preventDefault(),this._requestClose();return}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="z"&&!this._saving){e.preventDefault(),this._undo();return}if(!this._selected||this._saving)return;let s={ArrowLeft:{x:-zr,y:0},ArrowRight:{x:zr,y:0},ArrowUp:{x:0,y:-zr},ArrowDown:{x:0,y:zr}}[e.key];if(s){e.preventDefault(),this._pushUndo();let n=this._areaFor(this._selected),o=e.shiftKey?Cn(n,"se",{x:n[2]+s.x,y:n[3]+s.y}):Ci(n,s.x,s.y);this._setAreaFor(this._selected,o),this.requestUpdate();return}(e.key==="Delete"||e.key==="Backspace")&&this._selected.kind==="mask"&&(e.preventDefault(),this._deleteMask(this._selected.index))};this._requestClose=()=>{if(!this._saving){if(this._isDirty()&&!this._confirmDiscard){this._confirmDiscard=!0,this.requestUpdate();return}this._confirmDiscard=!1,this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}};this._keepEditing=()=>{this._confirmDiscard=!1,this.requestUpdate()};this.open=!1}static{this.properties={hass:{attribute:!1},cameraEntity:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0}}}disconnectedCallback(){super.disconnectedCallback(),this._revokeObjectUrl(),this._stopVisionPolling()}updated(e){e.has("open")&&this.open&&(this._cancelRef.value?.focus(),this._loadEditor()),e.has("open")&&!this.open&&(this._drawStart=null,this._drawing=null,this._pointerId=null,this._edit=null,this._selected=null,this._confirmDiscard=!1,this._showDetections=!1,this._stopVisionPolling())}render(){if(!this.open)return d;let e=!this._loading&&!this._saving&&!!this.entryId;return c`
      <div class="backdrop" @click=${this._requestClose}>
        <section
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detection-areas-title"
          @click=${i=>i.stopPropagation()}
          @keydown=${this._onKeydown}
        >
          <header class="header">
            <h2 id="detection-areas-title">Detection areas</h2>
            <button type="button" class="icon-button" aria-label="Close" @click=${this._requestClose}>${g("close")}</button>
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
                ${g("undo")}Undo
              </button>
            </div>

            <div class="stage-wrap">
              ${this._imageUrl?this._renderStage():c`<div class="empty-stage">${this._loading?"Loading camera still\u2026":"Camera still unavailable"}</div>`}
            </div>

            ${this._error?c`<p class="error" role="alert">${this._error}</p>`:d}

            <div class="lists">
              <section class="mask-section">
                <h3>Ignore masks</h3>
                ${this._masks.length?c`<ul class="mask-list">${this._masks.map((i,s)=>this._renderMaskRow(i,s))}</ul>`:d}
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
    `}_renderStage(){let e=this._selected?this._areaFor(this._selected):null,i=this._stageAspectRatio(),s=`aspect-ratio:${i};width:min(100%, calc(min(60vh, 640px) * ${i}));`;return c`
      <div
        class="stage"
        style=${s}
        @pointerdown=${this._onStagePointerDown}
        @pointermove=${this._onStageMove}
        @pointerup=${this._onStageUp}
        @pointercancel=${this._onStageCancel}
      >
        <img ${P(this._imageRef)} src=${this._imageUrl} alt="Feeder camera still" @load=${this._onImageLoad} />
        ${this._showDetections?this._renderDetections():d}
        ${this._masks.length===0?c`<p class="stage-hint" aria-hidden="true">Drag to mask an area</p>`:d}
        ${this._renderShape(this._bowl,{kind:"bowl"},this._selected?.kind==="bowl","bowl","Bowl zone")}
        ${this._masks.map((n,o)=>{if(this._hidden.has(o))return d;let a=this._selected?.kind==="mask"&&this._selected.index===o;return this._renderShape(n,{kind:"mask",index:o},a,"mask",`Mask ${o+1}`)})}
        ${this._drawing?this._renderDrawingPreview(this._drawing):d}
        ${this._selected&&e?Gl.map(n=>this._renderHandle(e,this._selected,n)):d}
      </div>
    `}_renderDetections(){return(this._visionFrame?.detections??[]).map(i=>{let s=Fr([i.x1,i.y1,i.x2,i.y2]),n=`left:${s.left};top:${s.top};width:${s.width};height:${s.height};`;return c`<div class="detection ${i.admitted?"":"quiet"}" style=${n}></div>`})}_renderShape(e,i,s,n,o){let a=`left:${e[0]*100}%;top:${e[1]*100}%;width:${Ye(e)*100}%;height:${zt(e)*100}%;`;return c`
      <div class="shape ${n} ${s?"selected":""}" style=${a}>
        <button
          type="button"
          class="shape-body"
          aria-label="${o}${s?", selected":""}"
          @pointerdown=${l=>this._beginMove(l,i)}
          @pointermove=${this._onEditMove}
          @pointerup=${this._onEditEnd}
          @pointercancel=${this._onEditEnd}
          @click=${()=>this._selectTarget(i)}
          @contextmenu=${l=>this._onShapeContextMenu(l,i)}
        >
          <span class="shape-tag">${o}</span>
        </button>
      </div>
    `}_renderHandle(e,i,s){let n=Ir(e,s),o=`left:${n.x*100}%;top:${n.y*100}%;cursor:${Rh[s]};`;return c`
      <div
        class="handle"
        style=${o}
        aria-hidden="true"
        @pointerdown=${a=>this._beginResize(a,i,s)}
        @pointermove=${this._onEditMove}
        @pointerup=${this._onEditEnd}
        @pointercancel=${this._onEditEnd}
      >
        <span class="handle-dot"></span>
      </div>
    `}_renderDrawingPreview(e){let i=`left:${e[0]*100}%;top:${e[1]*100}%;width:${Ye(e)*100}%;height:${zt(e)*100}%;`;return c`<div class="shape mask drawing" style=${i}><div class="shape-body"></div></div>`}_renderMaskRow(e,i){let s=this._selected?.kind==="mask"&&this._selected.index===i,n=this._hidden.has(i);return c`
      <li class="mask-row ${s?"selected":""}">
        <button type="button" class="mask-row-label" @click=${()=>this._selectTarget({kind:"mask",index:i})}>
          <span class="swatch exclude"></span>Mask ${i+1}
        </button>
        <button
          type="button"
          class="icon-button"
          aria-label="${n?"Show":"Hide"} mask ${i+1}"
          @click=${()=>this._toggleVisibility(i)}
        >
          ${g(n?"eyeOff":"eye")}
        </button>
        <button type="button" class="icon-button" aria-label="Delete mask ${i+1}" @click=${()=>this._deleteMask(i)}>
          ${g("deleteOutline")}
        </button>
      </li>
    `}_renderBowlRow(){let e=this._selected?.kind==="bowl";return c`
      <div class="mask-row bowl-row ${e?"selected":""}">
        <button type="button" class="mask-row-label" @click=${()=>this._selectTarget({kind:"bowl"})}>
          <span class="swatch bowl"></span>Bowl zone
        </button>
        <button type="button" class="quiet-button" @click=${this._resetBowl}>Reset</button>
      </div>
    `}async _loadEditor(){let e=++this._loadGeneration;this._error=null,this._selected=null,this._drawing=null,this._undoStack=[],this._hidden=new Set,this._confirmDiscard=!1,this._loading=!0,this.requestUpdate(),await Promise.all([this._loadAreas(),this._loadImage()]),e===this._loadGeneration&&(this._loading=!1,this.requestUpdate())}async _loadAreas(){let e=this.hass?.callWS;if(!e||!this.entryId){this._masks=[],this._bowl=Ge,this._baseline={masks:[],bowl:Ge};return}try{let[i,s]=await Promise.all([e({type:"kibble/vision/areas",entry_id:this.entryId}),e({type:"kibble/vision/bowl",entry_id:this.entryId})]);this._masks=wn(i.exclude),this._bowl=Or(s.bowl_roi)??Ge}catch(i){this._error=U(i),this._masks=[],this._bowl=Ge}this._baseline={masks:this._masks,bowl:this._bowl}}async _loadImage(){let e=this.cameraEntity?this.hass?.states[this.cameraEntity]:void 0,i=typeof e?.attributes.entity_picture=="string"?e.attributes.entity_picture:null;if(!(i===this._imagePath&&this._imageUrl)){if(this._imagePath=i,!i){this._imageUrl||this.requestUpdate();return}if(!this.hass.fetchWithAuth){this._imageUrl=i,this.requestUpdate();return}try{let s=await this.hass.fetchWithAuth(i);if(!s.ok)throw new Error("Camera still could not be loaded.");let n=await s.blob(),o=URL.createObjectURL(n);this._revokeObjectUrl(),this._objectUrl=o,this._imageUrl=o}catch(s){this._imageUrl||(this._error=s instanceof Error?s.message:"Camera still could not be loaded.")}this.requestUpdate()}}_stageAspectRatio(){let e=this._imageRef.value;return e&&e.naturalWidth>0&&e.naturalHeight>0?e.naturalWidth/e.naturalHeight:this._visionFrame?.w&&this._visionFrame?.h?this._visionFrame.w/this._visionFrame.h:16/9}_stopVisionPolling(){this._visionTimer!==void 0&&clearInterval(this._visionTimer),this._visionTimer=void 0}_finishStageDraw(e){let i=e.currentTarget;i.hasPointerCapture(e.pointerId)&&i.releasePointerCapture(e.pointerId),this._pointerId=null,this._drawStart=null,this._drawing=null,this.requestUpdate()}_onShapeContextMenu(e,i){e.preventDefault(),i.kind==="mask"&&this._deleteMask(i.index)}_areaFor(e){return e.kind==="bowl"?this._bowl:this._masks[e.index]}_setAreaFor(e,i){e.kind==="bowl"?this._bowl=i:this._masks=this._masks.map((s,n)=>n===e.index?i:s)}_pushUndo(){this._undoStack.push({masks:this._masks,bowl:this._bowl}),this._undoStack.length>Ah&&this._undoStack.shift()}_isDirty(){if(!this._baseline)return!1;let e=i=>i.map(s=>Math.round(s*1e4)).join(",");return this._masks.length!==this._baseline.masks.length||e(this._bowl)!==e(this._baseline.bowl)?!0:this._masks.some((i,s)=>e(i)!==e(this._baseline.masks[s]))}async _save(){let e=this.hass?.callWS;if(!(!e||!this.entryId)){this._saving=!0,this._error=null,this.requestUpdate();try{try{await e({type:"kibble/vision/areas/set",entry_id:this.entryId,exclude:this._masks})}catch(n){throw new Error(`Could not save masks. ${U(n)}`)}try{await e({type:"kibble/vision/bowl/set",entry_id:this.entryId,bowl_roi:this._bowl})}catch(n){throw new Error(`Masks saved, but the bowl zone failed to save. ${U(n)}`)}let[i,s]=await Promise.all([e({type:"kibble/vision/areas",entry_id:this.entryId}),e({type:"kibble/vision/bowl",entry_id:this.entryId})]);this._masks=wn(i.exclude),this._bowl=Or(s.bowl_roi)??Ge,this._baseline={masks:this._masks,bowl:this._bowl},this._undoStack=[],this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(i){this._error=i instanceof Error?i.message:"Could not save detection areas."}finally{this._saving=!1,this.requestUpdate()}this._error||this._requestClose()}}_revokeObjectUrl(){this._objectUrl&&URL.revokeObjectURL(this._objectUrl),this._objectUrl=null}static{this.styles=y`
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
  `}};customElements.define("kibble-detection-areas-dialog",$n);function Sn(t){return Number.isNaN(t)?50:Math.min(100,Math.max(0,t))}function Xl(t,r){switch(r){case"ArrowLeft":case"ArrowDown":return Sn(t-5);case"ArrowRight":case"ArrowUp":return Sn(t+5);case"Home":return 0;case"End":return 100;default:return null}}function Zl(t,r){return r.width<=0?50:Sn((t-r.left)/r.width*100)}function Jl(t,r){let e=t||null,i=r||null;return{before:e,after:i,hasPair:e!==null&&i!==null}}var En=class extends _{constructor(){super();this._frameRef=T();this._beginDrag=e=>{e.preventDefault(),e.currentTarget.setPointerCapture(e.pointerId),this._updateFromPointer(e.clientX)};this._onDrag=e=>{e.buttons!==0&&(e.preventDefault(),this._updateFromPointer(e.clientX))};this._endDrag=e=>{let i=e.currentTarget;i.hasPointerCapture(e.pointerId)&&i.releasePointerCapture(e.pointerId)};this._onHandleKeydown=e=>{let i=Xl(this._wipePosition,e.key);i!==null&&(e.preventDefault(),this._wipePosition=i)};this.beforeSrc=null,this.afterSrc=null,this.beforeLabel="Before",this.afterLabel="After",this.caption=null,this.aspect=16/9,this._mode="split",this._wipePosition=50}static{this.properties={beforeSrc:{type:String},afterSrc:{type:String},beforeLabel:{type:String},afterLabel:{type:String},caption:{type:String},aspect:{type:Number},_mode:{state:!0},_wipePosition:{state:!0}}}render(){let e=Jl(this.beforeSrc,this.afterSrc);if(!e.before&&!e.after)return d;if(!e.hasPair){let i=e.before??e.after,s=e.before?this.beforeLabel:this.afterLabel;return c`
        <figure class="tile">
          <div class="frame" style="aspect-ratio: ${this.aspect};">
            <img src=${i} alt=${s} loading="lazy" />
            <span class="tag tag-solo">${s}</span>
          </div>
          ${this.caption?c`<figcaption>${this.caption}</figcaption>`:d}
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
        ${this.caption?c`<figcaption>${this.caption}</figcaption>`:d}
      </figure>
    `}_renderSplit(e,i){return c`
      <div class="split">
        <div class="half">
          <img src=${e} alt=${this.beforeLabel} loading="lazy" />
          <span class="tag">${this.beforeLabel}</span>
        </div>
        <div class="divider"></div>
        <div class="half">
          <img src=${i} alt=${this.afterLabel} loading="lazy" />
          <span class="tag">${this.afterLabel}</span>
        </div>
      </div>
    `}_renderWipe(e,i){let s=this._wipePosition;return c`
      <div
        class="wipe"
        ${P(this._frameRef)}
        @pointerdown=${this._beginDrag}
        @pointermove=${this._onDrag}
        @pointerup=${this._endDrag}
        @pointercancel=${this._endDrag}
      >
        <img class="layer" src=${i} alt=${this.afterLabel} loading="lazy" />
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
    `}_setMode(e){this._mode=e}_updateFromPointer(e){let i=this._frameRef.value?.getBoundingClientRect();i&&(this._wipePosition=Zl(e,i))}static{this.styles=y`
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
  `}};customElements.define("kibble-before-after",En);var ec=3e3;function Tn(t,r){if(!r)return null;let e=t.states[r];if(!e)return null;let i=Number(e.state);return Number.isNaN(i)?null:{value:i,min:Number(e.attributes.min??1),max:Number(e.attributes.max??20),step:Number(e.attributes.step??1)}}var Pn=class extends _{constructor(){super();this._cloudConfirmArmed=!1;this._cloudConfirmTimer=void 0;this._stackConfirmArmed=!1;this._stackConfirmTimer=void 0;this.open=!1,this.singleHopper=!1,this.food1=null,this.food2=null,this._calibrationOpen=!1,this._detectionAreasOpen=!1}static{this.properties={hass:{attribute:!1},entities:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},_calibrationOpen:{state:!0},_detectionAreasOpen:{state:!0}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._cloudConfirmTimer),clearTimeout(this._stackConfirmTimer)}render(){if(!this.open)return d;let e=this.entities;return c`
      <div class="backdrop" @click=${this._close}></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Kibble settings" @keydown=${this._onKeydown}>
        <header>
          <h2>Settings</h2>
          <button type="button" class="icon-button" @click=${this._close} aria-label="Close">${g("close")}</button>
        </header>
        <div class="body">
          ${e.feedButtonHopper1||e.feedButtonHopper2?this._renderHopperSection():d}
          ${e.bowlFill?this._renderCalibrationSection():d}
          ${e.camera?this._renderCameraSection():d}
          ${e.feedAmount?this._renderMoreAmountSection():d}
          ${this._renderToggles()}
          ${e.cloudSwitch?this._renderCloud():d}
          ${e.stackSelect?this._renderStack():d}
          ${e.wifiNetwork?this._renderWifi():d}
          ${e.dishBefore||e.dishAfter?this._renderDishPhotos():d}
          ${e.speaker?this._renderSpeaker():d}
          <button type="button" class="device-link" @click=${this._openDevicePage}>
            Open device page ${g("openInNew")}
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
    `}_renderMoreAmountSection(){let e=Tn(this.hass,this.entities.feedAmount);return e?c`
      <section>
        <h3>Feed amount</h3>
        ${this._renderStepper(this.entities.feedAmount,e)}
      </section>
    `:d}_renderHopperSection(){let{feedAmountHopper1:e,feedAmountHopper2:i,feedButtonHopper1:s,feedButtonHopper2:n}=this.entities;return c`
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
                  ${this._renderStepper(e,Tn(this.hass,e))}
                  ${s?c`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(s)}></kibble-hold-button>`:d}
                </div>
              `:d}
          ${i&&!this.singleHopper?c`
                <div class="hopper">
                  <span class="hopper-label">${this._hopperFeedLabel(2)}</span>
                  ${this._renderStepper(i,Tn(this.hass,i))}
                  ${n?c`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(n)}></kibble-hold-button>`:d}
                </div>
              `:d}
        </div>
      </section>
    `}_hopperFeedLabel(e){return this.singleHopper?"Hopper":(e===1?this.food1:this.food2)??`Hopper ${e}`}_renderCalibrationSection(){return c`
      <section>
        <h3>Bowl calibration</h3>
        <p class="hint">
          Turns the bowl's raw fill reading into a real percentage by dispensing known portions
          into an empty bowl.${this.singleHopper?d:" Each hopper keeps its own curve."}
        </p>
        <button type="button" class="cloud-toggle" @click=${this._openCalibration}>Calibrate bowl</button>
      </section>
    `}_renderStepper(e,i){return i?c`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${i.value<=i.min} @click=${()=>this._setNumber(e,Math.max(i.min,i.value-i.step))}>
          &minus;
        </button>
        <span class="step-value">${i.value}</span>
        <button type="button" class="step-btn" ?disabled=${i.value>=i.max} @click=${()=>this._setNumber(e,Math.min(i.max,i.value+i.step))}>
          &plus;
        </button>
      </div>
    `:d}_renderToggles(){let i=[{id:this.entities.nightVisionSwitch,icon:"weatherNight",label:"Night vision"},{id:this.entities.statusLedSwitch,icon:"ledOn",label:"Status LED"},{id:this.entities.microphoneSwitch,icon:"microphone",label:"Microphone"}].filter(s=>s.id!==void 0);return i.length===0?d:c`
      <section>
        <h3>Device</h3>
        ${i.map(s=>this._renderToggleRow(s.id,s.icon,s.label))}
      </section>
    `}_renderToggleRow(e,i,s){let n=this.hass.states[e],o=n?.state==="on",a=!n||n.state==="unavailable";return c`
      <button type="button" class="toggle-row" ?disabled=${a} @click=${()=>this._toggleSwitch(e)}>
        <span class="toggle-icon">${g(i)}</span>
        <span class="toggle-label">${s}</span>
        <span class="toggle-pill ${o?"on":""}"><span class="toggle-knob"></span></span>
      </button>
    `}_renderCloud(){let i=this.hass.states[this.entities.cloudSwitch]?.state==="on",s=this.entities.cloudConnection?this.hass.states[this.entities.cloudConnection]?.state:void 0;return c`
      <section>
        <h3>Petkit cloud</h3>
        <p class="hint">${s?`Connection: ${s}`:"Turns the feeder's cloud link on or off."}</p>
        <button type="button" class="cloud-toggle ${this._cloudConfirmArmed?"confirming":""}" @click=${this._onCloudToggleClick}>
          ${this._cloudConfirmArmed?`Tap again to turn ${i?"off":"on"}`:i?"On, tap to turn off":"Off, tap to turn on"}
        </button>
      </section>
    `}_renderWifi(){let e=this.hass.states[this.entities.wifiNetwork];return c`
      <section>
        <h3>Wi-Fi</h3>
        <p class="hint">${e?e.state:"Unavailable"}</p>
      </section>
    `}_renderDishPhotos(){let e=this.entities.dishBefore?this.hass.states[this.entities.dishBefore]:void 0,i=this.entities.dishAfter?this.hass.states[this.entities.dishAfter]:void 0,s=e&&e.state!=="unavailable",n=i&&i.state!=="unavailable";return!s&&!n?d:c`
      <section>
        <h3>Last feed</h3>
        <kibble-before-after
          .beforeSrc=${s?String(e.attributes.entity_picture??""):null}
          .afterSrc=${n?String(i.attributes.entity_picture??""):null}
          aspect="1.333"
        ></kibble-before-after>
      </section>
    `}_renderSpeaker(){let e=this.hass.states[this.entities.speaker];if(!e)return d;let i=typeof e.attributes.volume_level=="number"?e.attributes.volume_level:.5;return c`
      <section>
        <h3>Speaker</h3>
        <p class="hint">${e.state}</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          .value=${String(i)}
          @change=${s=>this.hass.callService("media_player","volume_set",{volume_level:Number(s.target.value)},{entity_id:this.entities.speaker})}
        />
      </section>
    `}_pressButton(e){this.hass.callService("button","press",{},{entity_id:e})}_toggleSwitch(e){this.hass.callService("switch","toggle",{},{entity_id:e})}_setNumber(e,i){this.hass.callService("number","set_value",{value:i},{entity_id:e})}_renderStack(){let e=this.hass.states[this.entities.stackSelect];if(!e||e.state==="unavailable")return d;let i=e.state,s=i==="librefeed"?"vendor":"librefeed",n=o=>o==="librefeed"?"KibbleOS":"Petkit stack";return c`
      <section>
        <h3>Stack</h3>
        <p class="hint">Running ${n(i)}. Switching reboots the feeder; it is back in about a minute.</p>
        <button type="button" class="cloud-toggle ${this._stackConfirmArmed?"confirming":""}" @click=${this._onStackClick}>
          ${this._stackConfirmArmed?`Tap again to boot ${n(s)}`:`Switch to ${n(s)}`}
        </button>
      </section>
    `}_onStackClick(){let i=this.hass.states[this.entities.stackSelect]?.state==="librefeed"?"vendor":"librefeed";if(this._stackConfirmArmed){clearTimeout(this._stackConfirmTimer),this._stackConfirmArmed=!1,this.hass.callService("select","select_option",{entity_id:this.entities.stackSelect,option:i}),this.requestUpdate();return}this._stackConfirmArmed=!0,this.requestUpdate(),this._stackConfirmTimer=setTimeout(()=>{this._stackConfirmArmed=!1,this.requestUpdate()},ec)}_onCloudToggleClick(){if(this._cloudConfirmArmed){clearTimeout(this._cloudConfirmTimer),this._cloudConfirmArmed=!1,this._toggleSwitch(this.entities.cloudSwitch),this.requestUpdate();return}this._cloudConfirmArmed=!0,this.requestUpdate(),this._cloudConfirmTimer=setTimeout(()=>{this._cloudConfirmArmed=!1,this.requestUpdate()},ec)}_openDevicePage(){let e=this.entities.deviceId;history.pushState(null,"",`/config/devices/device/${e}`),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0})),this._close()}_onKeydown(e){e.key==="Escape"&&this._close()}_openCalibration(){this._calibrationOpen=!0}_openDetectionAreas(){this._detectionAreasOpen=!0}_closeDetectionAreas(e){e.stopPropagation(),this._detectionAreasOpen=!1}_closeCalibration(e){e.stopPropagation(),this._calibrationOpen=!1}_close(){this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-settings-dialog",Pn);var Lh=46,De=5,jt=8,mt=34,An=7,Oh=2,tc=8,Ih=7,Hh=2,Dh=24,Fh=48;function ic(t){let r=`hopper-clip-${t.index??"all"}`,e=t.index===null?Fh:Dh,i=e+De*2,s=De+(e-tc)/2,n=(jt+mt*(1-gr)).toFixed(1),o=t.fillFraction;return H`
    <svg class="tank" data-tone=${t.tone} data-wide=${t.index===null} viewBox="0 0 ${i} ${Lh}" aria-hidden="true">
      <defs>
        <clipPath id=${r}><rect x=${De} y=${jt} width=${e} height=${mt} rx=${An} /></clipPath>
      </defs>
      <rect class="tank-cap" x=${s} y=${Oh} width=${tc} height=${Ih} rx=${Hh} />
      <rect class="tank-body" x=${De} y=${jt} width=${e} height=${mt} rx=${An} />
      ${o!=null&&o>0?H`<g clip-path="url(#${r})"><rect class="tank-fill" x=${De} y=${(jt+mt*(1-o)).toFixed(1)} width=${e} height=${(mt*o+1).toFixed(1)} /></g>`:""}
      ${t.tone!=="unknown"?H`<line class="tank-low-line" x1=${De+2} y1=${n} x2=${De+e-2} y2=${n} />`:H`<text class="tank-unknown" x=${De+e/2} y=${jt+mt/2+1} text-anchor="middle" dominant-baseline="central">\u2013</text>`}
      <rect class="tank-outline" x=${De} y=${jt} width=${e} height=${mt} rx=${An} />
    </svg>
  `}var rc=`
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
`;var zh=1100,Rn=class extends _{constructor(){super();this._closeButtonRef=T();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&this._close()};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.hopperLevel1=null,this.hopperLevel2=null,this.hopperRemaining1=null,this.hopperRemaining2=null,this.singleHopper=!1,this.food1=null,this.food2=null,this._confirmed=null}static{this.properties={hass:{attribute:!1},entities:{attribute:!1},open:{type:Boolean,reflect:!0},hopperLevel1:{attribute:!1},hopperLevel2:{attribute:!1},hopperRemaining1:{attribute:!1},hopperRemaining2:{attribute:!1},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},_confirmed:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),clearTimeout(this._confirmTimer)}updated(e){e.has("open")&&this.open&&(clearTimeout(this._confirmTimer),this._confirmed=null,this._closeButtonRef.value?.focus())}_entityFor(e){return e==="1"?this.entities?.markFullHopper1:e==="2"?this.entities?.markFullHopper2:this.entities?.markFullBoth}_markFull(e){let i=this._entityFor(e);i&&(this.hass.callService("button","press",{},{entity_id:i}),clearTimeout(this._confirmTimer),this._confirmed=e,pe("success"),this._confirmTimer=window.setTimeout(()=>{this._confirmed=null,this.requestUpdate()},zh))}render(){if(!this.open)return d;let e=vr(this.singleHopper,this.hopperLevel1,this.hopperLevel2,this.hopperRemaining1,this.hopperRemaining2),i=!!(this.entities?.markFullHopper1||this.entities?.markFullHopper2||this.entities?.markFullBoth);return c`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.singleHopper?"Hopper":"Hoppers"}>
        <div class="sheet" @click=${s=>s.stopPropagation()}>
          <header>
            <span>${this.singleHopper?"Hopper":"Hoppers"}</span>
            <button type="button" class="icon-button" ${P(this._closeButtonRef)} @click=${this._close} aria-label="Close">${g("close")}</button>
          </header>
          <div class="body">
            ${e.map(s=>this._renderRow(s,gi(s.index,this.food1,this.food2)))}
            ${i?c`
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
                `:d}
          </div>
        </div>
      </div>
    `}_renderRow(e,i){let s=ut(e,i),n=_r(e,i);return c`
      <div class="hopper-row" data-tone=${e.tone} aria-label=${n}>
        <span class="hopper-row-glyph">${ic(e)}</span>
        <div class="hopper-row-text">
          <span class="hopper-row-name">${s}</span>
          <span class="hopper-row-word">${e.tone==="unknown"?"Level unknown":e.headline}</span>
          ${e.detail?c`<span class="hopper-row-detail">${e.detail}</span>`:d}
        </div>
      </div>
    `}_renderMarkButton(e,i,s,n){let o=this._confirmed===e;return c`
      <button
        type="button"
        class="mark-button ${n??""} ${o?"confirmed":""}"
        ?disabled=${!s||o}
        @click=${()=>this._markFull(e)}
      >
        ${o?c`<span class="mark-check">${g("check")}</span><span>Marked full</span>`:i}
      </button>
    `}static{this.styles=y`
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
    ${K(rc)}
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
  `}};customElements.define("kibble-hopper-sheet",Rn);function Qe(){return H`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `}function xe(t){let r=0;for(let e=0;e<t.length;e++)r=r*31+t.charCodeAt(e)|0;return W(r)}var Mn=class extends _{constructor(){super();this._ref=new Ve;this._visible=!1;this._observer=null;this._reportedFailure=null;this.alt="",this.rounded=!1,this.fit="cover",this.eager=!1}static{this.properties={hass:{attribute:!1},asset:{attribute:!1},cache:{attribute:!1},alt:{type:String},rounded:{type:Boolean},fit:{type:String},eager:{type:Boolean}}}connectedCallback(){super.connectedCallback(),this._visible=!1,this._observer=new IntersectionObserver(e=>{e.some(i=>i.isIntersecting)&&this._markVisible()},{rootMargin:"200px"}),this._observer.observe(this),requestAnimationFrame(()=>{if(this._visible||!this.isConnected)return;let e=this.getBoundingClientRect(),i=window.innerHeight||document.documentElement.clientHeight;e.width>0&&e.height>0&&e.bottom>-200&&e.top<i+200&&this._markVisible()})}_markVisible(){this._visible||(this._visible=!0,this._sync(),this.requestUpdate(),this._observer?.disconnect(),this._observer=null)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=null,this._ref.dispose()}willUpdate(e){this.eager&&!this._visible&&this._markVisible(),(e.has("asset")||e.has("cache")||e.has("hass"))&&this._sync()}_sync(){this._visible&&this._ref.sync(this.hass,this.cache,this.asset,()=>this.requestUpdate())}updated(){let e=this._ref.failed?this.asset?.id??null:null;e!==this._reportedFailure&&(this._reportedFailure=e,e&&this.dispatchEvent(new CustomEvent("image-failed",{bubbles:!0,composed:!0})))}get failed(){return this._ref.failed}retry(){this._reportedFailure=null,this._ref.retry(this.hass,this.cache,this.asset,()=>this.requestUpdate()),this.requestUpdate()}render(){let e=this._ref.url;return c`
      <div class="box ${this.rounded?"rounded":""}">
        ${e?c`<img src=${e} alt=${this.alt} style="object-fit:${this.fit}" />`:c`<div class="placeholder">${this._ref.failed?g("imageBroken"):d}</div>`}
      </div>
    `}static{this.styles=y`
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
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: color-mix(in srgb, var(--primary-text-color) 32%, transparent);
      container-type: size;
    }
    .placeholder svg {
      font-size: min(32px, 40cqmin);
    }
  `}};customElements.define("kibble-image",Mn);var Ln=class extends _{constructor(){super();this._ownCache=new ye;this.name=null,this.colorIndex=null,this.asset=null}static{this.properties={hass:{attribute:!1},name:{type:String},colorIndex:{type:Number,attribute:"color-index"},asset:{attribute:!1},cache:{attribute:!1}}}disconnectedCallback(){super.disconnectedCallback(),this._ownCache.dispose()}render(){if(!this.name)return c`<div class="avatar neutral">${Qe()}</div>`;let e=this.colorIndex!=null?W(this.colorIndex):xe(this.name);return c`
      <div class="avatar" style="--kibble-avatar-color: ${e}">
        ${this.asset?c`<kibble-image rounded .hass=${this.hass} .asset=${this.asset} .cache=${this.cache??this._ownCache} alt=""></kibble-image>`:c`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `}static{this.styles=y`
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
  `}};customElements.define("kibble-avatar",Ln);var On=new EventTarget,In="kibble-review-changed";function sc(t){On.dispatchEvent(new CustomEvent(In,{detail:{entryId:t}}))}function qt(t,r){let e=i=>{i.detail.entryId===t()&&r()};return On.addEventListener(In,e),()=>On.removeEventListener(In,e)}function nc(t){return typeof t=="number"&&Number.isFinite(t)?Math.max(0,Math.round(t)):0}function Nh(t){if(!t||typeof t!="object")return!1;let{sample:r,visit:e}=t;return typeof r?.uid=="string"&&typeof e?.uid=="string"}async function Hn(t,r,e=null,i=24){let s=await t({type:"kibble/review/photos",entry_id:r,limit:i,...e?{cursor:e}:{}});return{items:Array.isArray(s?.items)?s.items.filter(Nh):[],remaining:nc(s?.remaining),visits:nc(s?.visits),cursor:typeof s?.cursor=="string"&&s.cursor?s.cursor:null,has_more:s?.has_more===!0}}async function oc(t,r){return(await Hn(t,r,null,1)).remaining}var ac=1,jh=["not_found","agent_rejected"];function lc(t){return`kibble:outbox:${t}`}function cc(t){return t.kind==="photo"?`photo:${t.sampleUid}`:`ate:${t.visitUid}`}function qh(t){let r=pr(t);return r!==null&&jh.includes(r)?r:null}function Bh(t){if(!t||typeof t!="object")return!1;let r=t;return r.kind==="photo"?typeof r.sampleUid=="string"&&typeof r.label=="string":r.kind==="ate"?typeof r.visitUid=="string"&&Array.isArray(r.ate)&&r.ate.length>0&&r.ate.every(e=>typeof e=="string"):!1}function Uh(t){if(!t)return[];let r;try{r=JSON.parse(t)}catch{return[]}if(!r||typeof r!="object")return[];let e=r;if(e.v!==ac||!Array.isArray(e.entries))return[];let i=new Map;for(let s of e.entries){if(!s||typeof s!="object")continue;let{seq:n,answer:o}=s;if(typeof n!="number"||!Number.isFinite(n)||!Bh(o))continue;let a=cc(o),l=i.get(a);(!l||l.seq<n)&&i.set(a,{id:a,seq:n,answer:o})}return[...i.values()].sort((s,n)=>s.seq-n.seq)}var Nr=class{constructor(r){this._tries=new Map;this._inFlight=null;this._timer=null;this._disposed=!1;this._drops=[];this._listeners=new Set;this._options=r,this._timers=r.timers??Me;let e=null;try{e=r.storage?.getItem(r.key)??null}catch{e=null}this._entries=Uh(e),this._seq=this._entries.reduce((i,s)=>Math.max(i,s.seq),0)}start(){this._pump()}get size(){return this._entries.length}get entries(){return this._entries}get drops(){return this._drops}clearDrops(){this._drops.length!==0&&(this._drops=[],this._emit({type:"change"}))}pendingLabel(r){let e=this._entries.find(i=>i.id===`photo:${r}`);return e&&e.answer.kind==="photo"?e.answer.label:void 0}pendingPhotoLabels(){let r=new Map;for(let e of this._entries)e.answer.kind==="photo"&&r.set(e.answer.sampleUid,e.answer.label);return r}subscribe(r){return this._listeners.add(r),()=>this._listeners.delete(r)}enqueue(r){let e=cc(r);this._entries=[...this._entries.filter(i=>i.id!==e),{id:e,seq:++this._seq,answer:r}],this._persist(),this._emit({type:"change"}),this._pump()}sendNow(){this._entries.length!==0&&(this._tries.clear(),this._emit({type:"change"}),this._pump())}dispose(){this._disposed=!0,this._cancelTimer(),this._listeners.clear()}_emit(r){for(let e of[...this._listeners])e(r)}_persist(){try{this._options.storage?.setItem(this._options.key,JSON.stringify({v:ac,entries:this._entries.map(({seq:r,answer:e})=>({seq:r,answer:e}))}))}catch{}}_cancelTimer(){this._timer!==null&&(this._timers.clearTimeout(this._timer),this._timer=null)}_pump(){if(this._inFlight||this._disposed)return;this._cancelTimer();let r=this._timers.now(),e=null,i=1/0;for(let o of this._entries){let a=this._tries.get(o.seq)?.retryAt??0;if(a<=r){e=o;break}i=Math.min(i,a)}if(!e){i<1/0&&(this._timer=this._timers.setTimeout(()=>this._pump(),Math.max(0,i-r)));return}let s=e;this._inFlight=s;let n;try{n=this._options.send(s.answer)}catch(o){n=Promise.reject(o)}n.then(o=>this._settled(s,{ok:!0,result:o}),o=>this._settled(s,{ok:!1,err:o}))}_settled(r,e){if(this._inFlight=null,!this._disposed){if(this._entries.some(i=>i.seq===r.seq)){if(e.ok)this._remove(r),this._emit({type:"delivered",answer:r.answer,result:e.result});else{let i=qh(e.err);if(i)this._remove(r),this._drops=[...this._drops,{answer:r.answer,reason:i}],this._emit({type:"dropped",answer:r.answer,reason:i});else{let s=(this._tries.get(r.seq)?.failures??0)+1;this._tries.set(r.seq,{failures:s,retryAt:this._timers.now()+Ot(s-1,this._options.schedule??ct)})}}this._emit({type:"change"})}this._pump()}}_remove(r){this._entries=this._entries.filter(e=>e.seq!==r.seq),this._tries.delete(r.seq),this._persist()}};function Dn(t){return t>0?t===1?"1 answer waiting to send":`${t} answers waiting to send`:""}function jr(t){if(t.length===0)return"";let r=t.length>1,e=new Set(t.map(({answer:n,reason:o})=>o==="agent_rejected"?"rejected":n.kind==="ate"?"visit":"photo")),i=r?`${t.length} answers could not be saved`:"1 answer could not be saved";if(e.size!==1)return i;let s=[...e][0];return s==="rejected"?`${i}: Kibble did not accept ${r?"them":"it"}`:s==="visit"?`${i}: ${r?"those visits no longer exist":"that visit no longer exists"}`:`${i}: ${r?"those photos no longer exist":"that photo no longer exists"}`}async function dc(t,r,e){if(!t.callWS)throw new Error("Not connected.");return await t.callWS({type:"kibble/sample/label",entry_id:r,sample_uid:e.sampleUid,label:e.label})}async function pc(t,r,e){if(!t.callWS)throw new Error("Not connected.");return(await t.callWS({type:"kibble/session/ate",entry_id:r,uid:e.visitUid,ate:[...e.ate]})).visit}function $i(){try{return typeof localStorage>"u"?null:localStorage}catch{return null}}function Vh(t,r,e=Me){return async i=>{let s=t();if(!s)throw new Error("Not connected.");if(i.kind==="photo"){let{sample:o,visit:a}=await fi(dc(s,r,{sampleUid:i.sampleUid,label:i.label}),dt,e);return{kind:"photo",sample:o,visit:a}}return{kind:"ate",visit:await fi(pc(s,r,{visitUid:i.visitUid,ate:i.ate}),dt,e)}}}var Fn=new Map,Wh=600,uc=!1;function hc(){for(let t of Fn.values())t.outbox.sendNow()}function Kh(){uc||typeof document>"u"||(uc=!0,document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&hc()}),typeof window<"u"&&window.addEventListener("online",hc))}function Yh(t,r){let e;t.subscribe(i=>{i.type==="delivered"&&(clearTimeout(e),e=setTimeout(()=>sc(r),Wh))})}function Bt(t,r){let e=t.connected!==!1,i=Fn.get(r);if(i)return i.live.hass=t,e&&!i.live.connected&&i.outbox.sendNow(),i.live.connected=e,i.outbox;let s={hass:t,connected:e},n=new Nr({key:lc(r),storage:$i(),send:Vh(()=>s.hass,r)});return Fn.set(r,{outbox:n,live:s}),Yh(n,r),Kh(),n.start(),n}function qr(t,r){let e=typeof t=="number"&&Number.isFinite(t)?Math.round(t):0;return new Intl.NumberFormat(r).format(e)}function ee(t,r,e,i){let s=typeof t=="number"&&Number.isFinite(t)?Math.round(t):0;return`${qr(s,i)} ${Math.abs(s)===1?r:e}`}var fc=(t,r,e)=>{let i=new Map;for(let s=r;s<=e;s++)i.set(t[s],s);return i},mc=vi(class extends Ft{constructor(t){if(super(t),t.type!==Tr.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,r,e){let i;e===void 0?e=r:r!==void 0&&(i=r);let s=[],n=[],o=0;for(let a of t)s[o]=i?i(a,o):o,n[o]=e(a,o),o++;return{values:n,keys:s}}render(t,r,e){return this.dt(t,r,e).values}update(t,[r,e,i]){let s=Dl(t),{values:n,keys:o}=this.dt(r,e,i);if(!Array.isArray(s))return this.ut=o,n;let a=this.ut??=[],l=[],u,h,p=0,f=s.length-1,m=0,b=n.length-1;for(;p<=f&&m<=b;)if(s[p]===null)p++;else if(s[f]===null)f--;else if(a[p]===o[m])l[m]=Ke(s[p],n[m]),p++,m++;else if(a[f]===o[b])l[b]=Ke(s[f],n[b]),f--,b--;else if(a[p]===o[b])l[b]=Ke(s[p],n[b]),Dt(t,l[b+1],s[p]),p++,b--;else if(a[f]===o[m])l[m]=Ke(s[f],n[m]),Dt(t,s[p],s[f]),f--,m++;else if(u===void 0&&(u=fc(o,m,b),h=fc(a,p,f)),u.has(a[p]))if(u.has(a[f])){let x=h.get(o[m]),v=x!==void 0?s[x]:null;if(v===null){let $=Dt(t,s[p]);Ke($,n[m]),l[m]=$}else l[m]=Ke(v,n[m]),Dt(t,s[p],v),s[x]=null;m++}else Er(s[f]),f--;else Er(s[p]),p++;for(;m<=b;){let x=Dt(t,l[b+1]);Ke(x,n[m]),l[m++]=x}for(;p<=f;){let x=s[p++];x!==null&&Er(x)}return this.ut=o,Hl(t,l),Re}});var Br=class{constructor(){this._held=new Map}sync(r,e,i){let s=new Map;if(r&&e)for(let n of i)n&&s.set(n.id,n);for(let[n,o]of this._held)s.has(n)&&o===e||(o.release(n),this._held.delete(n));for(let[n,o]of s)this._held.has(n)||(this._held.set(n,e),e.acquire(r,o,()=>{}))}dispose(){for(let[r,e]of this._held)e.release(r);this._held.clear()}};var bc="Not used for learning";function Ur(t){let r=t.map(e=>({id:"cat:"+e.name,kind:"cat",cat:e.name,text:e.name,value:e.name,hint:null}));return t.length===2&&r.push({id:"both",kind:"both",cat:null,text:"Both in this photo",value:"both",hint:bc}),r.push({id:"not_a_cat",kind:"not_a_cat",cat:null,text:"Not a cat",value:"not_a_cat",hint:null}),r.push({id:"skip",kind:"skip",cat:null,text:"Don\u2019t use",value:"skip",hint:bc}),r.map((e,i)=>({...e,hotkey:i<9?String(i+1):null}))}function zn(t){return t===null||t==="follow"?null:t==="both"||t==="not_a_cat"||t==="skip"?t:"cat:"+t}var Gh=.6;function Vr(t,r){let e=zn(t.guess);return e!==null&&r.some(i=>i.id===e)?e:null}function Si(t){if(!t.guess)return null;let r=t.guess_confidence===null||t.guess_confidence>=Gh;return t.guess==="not_a_cat"?r?"Probably not a cat":"Maybe not a cat":`${r?"Looks like":"Maybe"} ${t.guess}`}function Wr(t){switch(t.review??t.label){case"skip":return{kind:"skip",text:"Not used"};case"both":return{kind:"both",text:"Both cats"};case"not_a_cat":return{kind:"not_a_cat",text:"Not a cat"};default:return null}}function gc(t,r){let e=new Map,i={total:0,named:[],both:0,notACat:0,skipped:0};for(let n of t)n!=="follow"&&(i.total++,n==="both"?i.both++:n==="not_a_cat"?i.notACat++:n==="skip"?i.skipped++:e.set(n,(e.get(n)??0)+1));let s=[...r,...[...e.keys()].filter(n=>!r.includes(n))];return i.named=s.filter(n=>e.has(n)).map(n=>({cat:n,count:e.get(n)})),i}function _c(t){let r=t.named.map(({cat:e,count:i})=>({kind:"cat",cat:e,text:e,count:i}));return t.both>0&&r.push({kind:"both",cat:null,text:"Both cats",count:t.both}),t.notACat>0&&r.push({kind:"not_a_cat",cat:null,text:"Not a cat",count:t.notACat}),t.skipped>0&&r.push({kind:"skip",cat:null,text:"Not used",count:t.skipped}),r}function vc(t,r){return`${ee(t,"photo","photos",r)} checked`}function yc(t){return t.kind==="feed"?null:t.thumb??t.scene??null}function xc(t){return t.kind!=="feed"&&!t.open&&t.cat===null}function wc(t){let r=Math.floor(t/60),e=t%60;return r===0?`${e} sec`:e===0?`${r} min`:`${r} min ${e} sec`}function Kr(t){return t.kind!=="eat"||t.open||t.end==null||t.end<=t.start?null:wc(t.end-t.start)}function kc(t,r){return!Number.isFinite(t)||!Number.isFinite(r)||r<=t?null:wc(Math.floor(r-t))}function Ut(t){return t.open?t.kind==="eat"?"is eating":"is here":t.kind==="eat"?"ate":"came by"}function Yr(t){return t.kind==="feed"?Ti(t):t.cat?`${t.cat} ${Ut(t)}`:t.kind==="eat"?"Someone is eating":"Someone is here"}function Nn(t){return`${t} portion${t===1?"":"s"}`}function Ti(t){let r=t.feed;if(!r||r.portions==null)return"Fed";if(r.single||r.sides.length===0)return`Fed ${Nn(r.portions)}`;if(r.sides.length===1){let[s]=r.sides,n=s.food?`of ${s.food}`:`from hopper ${s.hopper}`;return`Fed ${Nn(s.portions)} ${n}`}let[e,i]=r.sides;return e.food&&i.food?`Fed ${e.portions} ${e.food} and ${i.portions} ${i.food}`:e.portions===i.portions?`Fed ${Nn(e.portions)} from each hopper`:`Fed ${e.portions} from hopper ${e.hopper} and ${i.portions} from hopper ${i.hopper}`}function fe(t,r){return new Date(t*1e3).toLocaleTimeString(r,{hour:"numeric",minute:"2-digit"})}function jn(t,r,e){let i=new Date(t*1e3),s=o=>new Date(o.getFullYear(),o.getMonth(),o.getDate()).getTime(),n=Math.round((s(r)-s(i))/864e5);return n<=0?null:n<7?i.toLocaleDateString(e,{weekday:"short"}):i.toLocaleDateString(e,{month:"short",day:"numeric"})}function Cc(t,r,e){let i=jn(t,r,e),s=fe(t,e);return i?`${i} ${s}`:s}function Gr(t){return t.kind!=="eat"&&t.kind!=="feed"||!t.before||!t.after?null:{before:t.before,after:t.after}}var Qh=5*60;function Xh(t){return t.length<2?t[0]??"":t.length===2?t[0]+" and "+t[1]:t.slice(0,-1).join(", ")+", and "+t[t.length-1]}function Qr(t){return[...t].sort((r,e)=>+(e.kind==="eat")-+(r.kind==="eat")||+(r.cat===null)-+(e.cat===null))}function $c(t){let r=Qr(t),e=r.map(n=>n.cat??"Who?"),i=r.every(n=>n.kind===r[0]?.kind),s=r.every(n=>n.open===r[0]?.open);if(i&&s&&r[0]?.kind!=="feed"){let n=r[0]?.kind,o=r[0]?.open?n==="eat"?"are eating":"are here":n==="eat"?"ate":"came by";return Xh(e)+" "+o}return r.map((n,o)=>e[o]+" "+Ut(n)).join(", ")}function Sc(t,r=Date.now()/1e3){let e=new Map;for(let o of t){if(o.session===null||o.session===void 0)continue;let a=e.get(o.session)??[];a.push(o),e.set(o.session,a)}let i=new Map;for(let o of e.values()){let a=[...o].sort((p,f)=>p.start-f.start),l=[],u=Number.NEGATIVE_INFINITY,h=()=>{if(l.length>1){let p=new Set(l.map(v=>v.uid)),f=t.filter(v=>p.has(v.uid)),m=Math.min(...f.map(v=>v.start)),b=Math.max(...f.map(v=>Math.max(v.start,v.end??r))),x={event:f[0],events:f,together:!0,start:m,end:b};for(let v of f)i.set(v.uid,x)}l=[],u=Number.NEGATIVE_INFINITY};for(let p of a){let f=Math.max(p.start,p.end??r);l.length>0&&p.start>u&&h(),l.push(p),u=Math.max(u,f)}h()}let s=[],n=new Set;for(let o of t){let a=i.get(o.uid);if(a){n.has(a)||(n.add(a),s.push(a));continue}let l=s[s.length-1];if(l&&!l.together&&l.event.kind===o.kind&&l.event.cat===o.cat&&l.event.start-o.start<=Qh){l.events.push(o);continue}s.push({event:o,events:[o]})}return s.sort((o,a)=>(a.start??a.event.start)-(o.start??o.event.start))}function Ec(t,r){return`${r} ${t==="eat"?"meal":t==="feed"?"feed":"visit"}${r===1?"":"s"}`}function Ei(t){return`${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`}function Zh(t,r){if(Ei(t)===Ei(r))return"Today";let e=new Date(r.getFullYear(),r.getMonth(),r.getDate()-1);return Ei(t)===Ei(e)?"Yesterday":t.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}function Tc(t,r){let e=[],i=null;for(let s of t){let n=new Date((s.start??s.event.start)*1e3),o=Ei(n);o!==i&&(i=o,e.push({label:Zh(n,r),groups:[]})),e[e.length-1].groups.push(s)}return e}var Jh="clamp(360px, calc(100dvh - 200px), 900px)";function qn(t){let r=(t??"").trim();return r==="none"?"":`max-height:${r||Jh}`}var ef=4;function Pc(t,r,e){let i=new Set(r),s=[];for(let n of t.items){let o=n.sample.uid;i.has(o)||e.has(o)||(i.add(o),s.push(n))}return s}function Ac(t,r){return Math.max(0,t.remaining-r.size)}function Bn(t,r){return{items:Pc(t,new Set,r),answers:new Map,history:[],remaining:Ac(t,r),cursor:t.cursor,hasMore:t.has_more&&!!t.cursor}}function Un(t,r,e){let i=new Set(t.items.map(s=>s.sample.uid));return{...t,items:[...t.items,...Pc(r,i,e)],remaining:Ac(r,e),cursor:r.cursor,hasMore:r.has_more&&!!r.cursor}}function Vn(t){return t.items.filter(r=>!t.answers.has(r.sample.uid))}function we(t){return t.items.find(r=>!t.answers.has(r.sample.uid))??null}function Wn(t,r){return Vn(t).slice(1,1+r)}function Rc(t){return t.hasMore&&Vn(t).length<=ef}function Kn(t){return we(t)===null&&!t.hasMore}function Mc(t,r){let e=we(t);if(!e)return t;let i=e.sample.uid;return{...t,answers:new Map(t.answers).set(i,r),history:[...t.history,i],remaining:Math.max(0,t.remaining-1)}}function Xr(t){let r=t.history[t.history.length-1],e=r===void 0?void 0:t.answers.get(r);return r!==void 0&&e!==void 0?{uid:r,label:e}:null}function Lc(t){let r=Xr(t);if(!r)return t;let e=new Map(t.answers);return e.delete(r.uid),{...t,answers:e,history:t.history.slice(0,-1),remaining:t.remaining+1}}function Oc(t){return Math.max(t.remaining,we(t)?1:0)}function Ic(t,r){return`${ee(t,"photo","photos",r)} left`}function Zr(t,r,e){return`${jn(t.start,r,e)??"Today"}, ${fe(t.start,e)}, ${t.kind==="eat"?"meal":"visit"}`}function Hc(t){return{items:Vn(t),remaining:t.remaining,visits:0,cursor:t.cursor,has_more:t.hasMore}}function Dc(t,r,e){if(!t.needs_ate||e.has(t.uid))return null;let i=t.cats.map(s=>s.cat);return i.length>=2?{visitUid:t.uid,cats:i,start:r}:null}function Pi(t){let r=t.map(e=>({id:"ate:"+e,text:e,ate:[e]}));return t.length===2&&r.push({id:"ate:both",text:"Both",ate:[...t]}),r}function Yn(t,r){if(t.altKey)return null;let e=t.key.length===1?t.key.toLowerCase():t.key;if(t.ctrlKey||t.metaKey)return e==="z"&&!t.repeat?{type:"undo"}:null;if(t.repeat)return null;if(e==="z"||e==="u"||e==="Backspace")return{type:"undo"};if(e==="s"||e==="ArrowUp"||e==="ArrowDown")return{type:"scene"};let i=r.find(s=>s.hotkey===e);return i?{type:"answer",optionId:i.id}:null}var Fc=10,tf=.5,rf=24;function zc(t,r){return Math.abs(t)<Fc&&Math.abs(r)<Fc?null:Math.abs(t)>Math.abs(r)*1.2}function Nc(t){return Math.min(140,Math.max(64,t*.25))}function jc(t,r){return t===0?{side:null,progress:0}:{side:t<0?"left":"right",progress:Math.min(1,Math.abs(t)/Nc(r))}}function qc(t,r,e){let i=t<0?"left":"right";return Math.abs(t)>=Nc(e)||Math.abs(r)>=tf&&Math.abs(t)>=rf&&Math.sign(r)===Math.sign(t)?i:null}function Bc(t,r){let e=r.filter(i=>i.kind==="cat");return e.length!==2?null:(t==="left"?e[0]:e[1]).id}var Ai=class extends _{static{this.shadowRootOptions={..._.shadowRootOptions,delegatesFocus:!0}}static{this.properties={hass:{attribute:!1},cache:{attribute:!1},label:{type:String},cats:{attribute:!1},icon:{type:String},state:{type:String,reflect:!0},hint:{type:String},caption:{type:String},disabled:{type:Boolean,reflect:!0},busy:{type:Boolean},pop:{type:Boolean}}}constructor(){super(),this.label="",this.cats=[],this.icon=null,this.state="neutral",this.hint=null,this.caption=null,this.disabled=!1,this.busy=!1,this.pop=!1}render(){let r=this.cats.length===1?W(this.cats[0].color):null;return c`
      <button type="button" class=${this.state} aria-pressed=${this.state==="selected"} ?disabled=${this.disabled} style=${r?`--choice-color:${r}`:""}>
        <span class="picture ${this.cats.length>1?"several":""}">
          ${this.cats.length?this.cats.slice(0,3).map(e=>c`<kibble-avatar .hass=${this.hass} .name=${e.name} .colorIndex=${e.color} .asset=${e.avatar} .cache=${this.cache}></kibble-avatar>`):c`<span class="glyph">${this.icon?g(this.icon):d}</span>`}
          ${this.busy?c`<span class="badge spinner">${g("refresh")}</span>`:this.state==="selected"?c`<span class="badge check ${this.pop?"pop":""}">${g("check")}</span>`:d}
        </span>
        <span class="text">
          <span class="label">${this.label}</span>
          ${this.caption?c`<span class="caption">${this.caption}</span>`:d}
        </span>
        ${this.hint?c`<kbd aria-hidden="true">${this.hint}</kbd>`:d}
      </button>
    `}static{this.styles=y`
    :host {
      display: block;
      min-width: 0;
      /* The button lays itself out from the width its parent gives it (so the parent must give
         one: a grid or flex track): narrow shows the picture above the name, wide beside it. */
      container-type: inline-size;
    }
    button {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: var(--kibble-choice-height, 64px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 8px;
      border: 2px solid transparent;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
      line-height: 1.2;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      transition:
        transform 90ms ease-out,
        background-color 150ms ease-out,
        border-color 150ms ease-out;
    }
    button:active:not(:disabled) {
      transform: scale(0.96);
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    @media (hover: hover) {
      button:hover:not(:disabled) {
        background: color-mix(in srgb, var(--choice-color, var(--primary-text-color)) 12%, transparent);
      }
    }
    button.suggested {
      border-style: dashed;
      border-color: var(--choice-color, var(--secondary-text-color));
      background: color-mix(in srgb, var(--choice-color, var(--secondary-text-color)) 10%, transparent);
    }
    button.selected {
      border-color: var(--choice-color, var(--secondary-text-color));
      background: color-mix(in srgb, var(--choice-color, var(--secondary-text-color)) 20%, transparent);
    }
    .picture {
      position: relative;
      display: flex;
      flex: none;
      --kibble-avatar-size: var(--kibble-choice-picture, 36px);
    }
    .picture.several kibble-avatar + kibble-avatar {
      margin-left: calc(var(--kibble-choice-picture, 36px) * -0.4);
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--ha-dialog-surface-background, var(--ha-card-background, var(--card-background-color, #fff)));
    }
    .glyph {
      width: var(--kibble-choice-picture, 36px);
      height: var(--kibble-choice-picture, 36px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: calc(var(--kibble-choice-picture, 36px) * 0.72);
      color: var(--secondary-text-color);
    }
    .badge {
      position: absolute;
      right: -3px;
      bottom: -3px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      box-shadow: 0 0 0 2px var(--ha-dialog-surface-background, var(--ha-card-background, var(--card-background-color, #fff)));
    }
    .badge.spinner {
      background: var(--secondary-text-color);
      color: var(--card-background-color, #fff);
    }
    .text {
      min-width: 0;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .label {
      max-width: 100%;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .caption {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    kbd {
      display: none;
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 18px;
      box-sizing: border-box;
      padding: 1px 4px;
      border-radius: 4px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 24%, transparent);
      font: inherit;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    @container (min-width: 220px) {
      button {
        flex-direction: row;
        justify-content: flex-start;
        gap: 12px;
        padding: 8px 12px;
      }
      .text {
        align-items: flex-start;
        flex: 1;
      }
      kbd {
        position: static;
        flex: none;
      }
    }
    /* A key hint only helps where there is a keyboard: a fine pointer that can hover. */
    @media (hover: hover) and (pointer: fine) {
      kbd {
        display: block;
      }
    }
    @media (prefers-reduced-motion: no-preference) {
      .spinner svg {
        animation: kibble-choice-spin 0.9s linear infinite;
      }
      .check.pop {
        animation: kibble-choice-pop 400ms ease;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
      button:active:not(:disabled) {
        transform: none;
      }
    }
    @keyframes kibble-choice-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes kibble-choice-pop {
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
  `}};customElements.define("kibble-choice",Ai);var Gn=class extends _{constructor(){super();this._repositionLabels=()=>{let e=this.getBoundingClientRect();if(e.width<=0||e.height<=0)return;let i=[...this.renderRoot.querySelectorAll(".label")],s=this.boxes.flatMap(a=>{let l=a.label??(a.tone==="not-cat"?"Not a cat":null);if(!l)return[];let h=i.find(p=>p.dataset.labelKey===a.key)?.getBoundingClientRect();return[{key:a.key,box:a.box,width:h?.width||Math.max(44,l.length*7+34),height:h?.height||22}]}),n=Object.fromEntries(Ql(s,e.width,e.height,4,this.labelSafeTop).map(a=>[a.key,a])),o=Object.keys(n);o.length===Object.keys(this._labelPositions).length&&o.every(a=>{let l=this._labelPositions[a],u=n[a];return l?.left===u?.left&&l?.top===u?.top&&l?.flipped===u?.flipped})||(this._labelPositions=n)};this.boxes=[],this.labelSafeTop=0,this._labelPositions={}}static{this.properties={boxes:{attribute:!1},hass:{attribute:!1},cache:{attribute:!1},labelSafeTop:{attribute:!1},_labelPositions:{state:!0}}}firstUpdated(){this._resizeObserver=new ResizeObserver(()=>this._repositionLabels()),this._resizeObserver.observe(this),this._repositionLabels()}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._resizeObserver=void 0}updated(e){(e.has("boxes")||e.has("labelSafeTop"))&&this._repositionLabels()}render(){return c`<div class="overlay" aria-hidden="true">${this.boxes.map(e=>this._renderBox(e))}</div>`}_renderBox(e){let i=Fr(e.box),s=`left:${i.left};top:${i.top};width:${i.width};height:${i.height};--box-color:${e.color??"rgba(255,255,255,.9)"};`,n=e.emphasis??"normal",o=e.label??(e.tone==="not-cat"?"Not a cat":null),a=this._labelPositions[e.key],l=a?`left:${a.left}px;top:${a.top}px;`:`left:${i.left};top:${i.top};`;return c`
      <div class="box-wrap tone-${e.tone} emphasis-${n}" style=${s}>
        <span class="stroke"></span>
      </div>
      ${o?c`<span class="label tone-${e.tone} emphasis-${n}" data-label-key=${e.key} style=${l}>
        ${e.tone==="cat"?c`<span class="avatar-ring" style=${`--box-color:${e.color??"var(--primary-color)"}`}><span class="monogram" aria-hidden="true">${o.trim().charAt(0).toUpperCase()}</span>${e.avatar?c`<kibble-image .hass=${this.hass} .asset=${e.avatar} .cache=${this.cache} alt=""></kibble-image>`:d}</span>`:e.tone==="unknown"?c`<span class="unknown-avatar">?</span>`:d}
        <span class="label-text">${o}</span>
      </span>`:d}`}static{this.styles=y`
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
  `}};customElements.define("kibble-box-overlay",Gn);var sf=["idle","waiting","learning","rechecking","retrying"];function ue(t){return typeof t=="number"&&Number.isFinite(t)?t:null}function nf(t){if(!t||typeof t!="object")return null;let r=t,e=ue(r.finished);if(e===null)return null;let i={};if(r.learned&&typeof r.learned=="object")for(let[s,n]of Object.entries(r.learned)){let o=ue(n);o!==null&&Math.round(o)!==0&&(i[s]=Math.round(o))}return{finished:e,duration:Math.max(0,ue(r.duration)??0),answers:Math.max(0,ue(r.answers)??0),learned:i,renamed:Math.max(0,ue(r.renamed)??0),rechecked:Math.max(0,ue(r.rechecked)??0)}}function Uc(t){if(!t||typeof t!="object")return null;let r=t,e=sf.find(i=>i===r.state);return e?{state:e,pending:Math.max(0,ue(r.pending)??0),done:ue(r.done),total:ue(r.total),starts_at:ue(r.starts_at),retry_at:ue(r.retry_at),started:ue(r.started),last:nf(r.last),error:typeof r.error=="string"&&r.error?r.error:null}:null}function of(t){return t<90?`${t} s`:`${Math.ceil(t/60)} min`}function Vc(t,r,e){if(!t)return"";let i=t.pending>0?`${ee(t.pending,"answer","answers",e)} saved`:null;switch(t.state){case"waiting":return i?`${i}, learning starts when you pause`:"Learning starts when you pause";case"learning":return"Learning from your answers\u2026";case"rechecking":{let s=t.total!==null&&t.total>0?Math.round(t.total):null,n=Math.min(Math.max(0,Math.round(t.done??0)),s??0),o=s===null?"checking your visits again":`learning ${qr(n,e)} of ${qr(s,e)} visits`;return i?`${i}, ${o}`:o.charAt(0).toUpperCase()+o.slice(1)}case"retrying":{let s=t.retry_at===null?null:Math.ceil(t.retry_at-r);return`Something went wrong, trying again ${s===null?"soon":s<=0?"now":`in ${of(s)}`}. Your answers are safe.`}default:return""}}function Wc(t){return!t||t.state!=="rechecking"||t.total===null||t.total<=0?null:Math.min(1,Math.max(0,(t.done??0)/t.total))}function Kc(t,r){return t?.state==="retrying"&&t.retry_at!==null&&t.retry_at>r}var af=6*60*60;function lf(t,r){let e=Object.entries(t.learned).filter(([,s])=>s!==0).sort(([s,n],[o,a])=>Math.abs(a)-Math.abs(n)||s.localeCompare(o)).map(([s,n])=>`${s} ${n>0?"+":"-"}${ee(Math.abs(n),"photo","photos",r)}`),i=t.renamed>0?`${ee(t.renamed,"visit","visits",r)} got a new name.`:"";return e.length>0?["Kibble learned from your answers: "+e.join(", ")+".",i].filter(Boolean).join(" "):["Kibble checked your answers.",i||"Nothing changed."].join(" ")}function Yc(t,r,e,i){let s=t?.last;return!s||s.answers<=0||s.finished<=e||r-s.finished>af?null:{finished:s.finished,text:lf(s,i)}}function Gc(t){return`kibble:learning-dismissed:${t}`}function Qc(t,r){try{let e=Number(t?.getItem(Gc(r)));return Number.isFinite(e)&&e>0?e:0}catch{return 0}}function Xc(t,r,e){try{t?.setItem(Gc(r),String(e))}catch{}}var Qn=class{constructor(r,e=Me){this._entryId=r;this._timers=e;this._connected=!0;this._status=null;this._unsupported=!1;this._generation=0;this._subscribing=!1;this._unsubscribe=null;this._failures=0;this._retryHandle=null;this._listeners=new Set}get status(){return this._status}attach(r){let e=r.connected!==!1,i=e&&!this._connected;this._connected=e,r.connection!==this._connection&&(this._connection=r.connection,this._stop()),i&&(this._failures=0),this._listeners.size>0&&(i||!this._unsubscribe)&&this._connect()}listen(r){return this._listeners.add(r),this._listeners.size===1&&this._connect(),()=>{this._listeners.delete(r),this._listeners.size===0&&this._stop()}}_set(r){this._status=r;for(let e of[...this._listeners])e()}_connect(){let r=this._connection;if(!r||this._unsubscribe||this._subscribing||this._unsupported||this._listeners.size===0)return;this._cancelRetry();let e=++this._generation;this._subscribing=!0;let i;try{i=r.subscribeMessage(s=>{let n=Uc(s?.learning);e===this._generation&&n&&this._set(n)},{type:"kibble/learning/subscribe",entry_id:this._entryId})}catch(s){i=Promise.reject(s)}i.then(s=>{if(e!==this._generation){s().catch(()=>{});return}this._subscribing=!1,this._unsubscribe=s,this._failures=0},s=>{if(e===this._generation){if(this._subscribing=!1,pr(s)==="unknown_command"){this._unsupported=!0,this._set(null);return}this._retryHandle=this._timers.setTimeout(()=>{this._retryHandle=null,this._connect()},Ot(this._failures++))}})}_stop(){this._generation++,this._subscribing=!1,this._cancelRetry();let r=this._unsubscribe;this._unsubscribe=null,r&&r().catch(()=>{}),this._status=null}_cancelRetry(){this._retryHandle!==null&&(this._timers.clearTimeout(this._retryHandle),this._retryHandle=null)}},Zc=new Map;function Jc(t){let r=Zc.get(t);return r||(r=new Qn(t),Zc.set(t,r)),r}var Xn=class extends _{constructor(){super();this._dismissed=0;this._feed=null;this._unlisten=null;this._empty=!0;this._dismiss=e=>{this.entryId&&(Xc($i(),this.entryId,e),this._dismissed=e)};this.summary=!1}static{this.properties={hass:{attribute:!1},entryId:{type:String},summary:{type:Boolean},_dismissed:{state:!0}}}connectedCallback(){super.connectedCallback(),this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this._unlisten?.(),this._unlisten=null,this._feed=null,clearInterval(this._ticker),this._ticker=void 0}willUpdate(e){let{hass:i,entryId:s}=this;if(!i||!s)return;let n=Jc(s);n.attach(i),n!==this._feed&&(this._unlisten?.(),this._feed=n,this._unlisten=n.listen(()=>this.requestUpdate())),this._dismissedFor!==s&&(this._dismissedFor=s,this._dismissed=Qc($i(),s))}updated(){this.toggleAttribute("hidden",this._empty);let e=this._feed?.status??null,i=Kc(e,Date.now()/1e3);i&&this._ticker===void 0?this._ticker=setInterval(()=>this.requestUpdate(),1e3):!i&&this._ticker!==void 0&&(clearInterval(this._ticker),this._ticker=void 0)}render(){let e=this._feed?.status??null,i=Date.now()/1e3,s=this.hass?.locale?.language??this.hass?.language,n=Vc(e,i,s),o=Wc(e),a=this.summary?Yc(e,i,this._dismissed,s):null;return this._empty=!n&&!a,this._empty?d:c`
      ${n?c`<div class="line ${e?.state??""}" role="status" title=${e?.error??""}>
            <span class="dot" aria-hidden="true"></span>
            <span class="text">${n}</span>
            ${o!==null?c`<span class="bar" aria-hidden="true"><span style=${`transform:scaleX(${o})`}></span></span>`:d}
          </div>`:d}
      ${a?c`<div class="done" role="status">
            <span class="check">${g("check")}</span>
            <span class="text">${a.text}</span>
            <button type="button" aria-label="Dismiss" @click=${()=>this._dismiss(a.finished)}>${g("close")}</button>
          </div>`:d}
    `}static{this.styles=y`
    :host {
      display: block;
    }
    :host([hidden]) {
      display: none;
    }
    .line,
    .done {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 8px;
      font-size: 13px;
      line-height: 1.3;
      color: var(--secondary-text-color);
    }
    .line + .done {
      margin-top: 8px;
    }
    .text {
      flex: 1;
      min-width: 0;
    }
    .dot {
      flex: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
    }
    .line.retrying .dot {
      background: var(--warning-color, #ffa600);
    }
    .bar {
      flex-basis: 100%;
      height: 3px;
      border-radius: 2px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .bar span {
      display: block;
      height: 100%;
      background: var(--primary-color, #03a9f4);
      transform-origin: left center;
      transition: transform 300ms ease-out;
    }
    .done {
      flex-wrap: nowrap;
      align-items: flex-start;
      padding: 8px 4px 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--kibble-feed, #43a96a) 14%, transparent);
    }
    .check {
      flex: none;
      display: flex;
      align-items: center;
      height: 20px;
      color: var(--kibble-feed, #43a96a);
      font-size: 18px;
    }
    .done button {
      flex: none;
      width: 40px;
      height: 40px;
      margin: -8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
      font-size: 20px;
      cursor: pointer;
    }
    .done button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
    }
    @media (prefers-reduced-motion: no-preference) {
      .line.waiting .dot,
      .line.learning .dot,
      .line.rechecking .dot {
        animation: kibble-learning-pulse 1.4s ease-in-out infinite;
      }
    }
    @keyframes kibble-learning-pulse {
      50% {
        opacity: 0.35;
      }
    }
  `}};customElements.define("kibble-learning-line",Xn);var cf=350,Zn=class extends _{constructor(){super();this._readyAt=0;this._skip=()=>{performance.now()<this._readyAt||this.dispatchEvent(new CustomEvent("ate-skipped",{bubbles:!0,composed:!0}))};this.question=null,this.roster=[],this.hotkeys=!1,this.skippable=!1}static{this.properties={hass:{attribute:!1},cache:{attribute:!1},question:{attribute:!1},roster:{attribute:!1},hotkeys:{type:Boolean},skippable:{type:Boolean}}}connectedCallback(){super.connectedCallback(),this._readyAt=performance.now()+cf}choose(e){let i=this.question,s=i?Pi(i.cats)[e]:void 0;i&&s&&this._choose(i,s)}_choiceCat(e,i){return this.roster.find(s=>s.name===e)??{name:e,color:i,avatar:null}}_choose(e,i){if(performance.now()<this._readyAt)return;let s={visitUid:e.visitUid,ate:i.ate};this.dispatchEvent(new CustomEvent("ate-chosen",{detail:s,bubbles:!0,composed:!0}))}render(){let e=this.question;if(!e)return d;let i=this.hass?.locale?.language??this.hass?.language,s=Cc(e.start,new Date,i);return c`
      <section aria-labelledby="ask">
        <h3 id="ask">Who ate? <span class="when">${s}</span></h3>
        <div class="options">
          ${Pi(e.cats).map((n,o)=>{let a=n.ate.map(l=>this._choiceCat(l,e.cats.indexOf(l)));return c`<kibble-choice
              .hass=${this.hass}
              .cache=${this.cache}
              .label=${n.text}
              .cats=${a}
              .hint=${this.hotkeys?String(o+1):null}
              @click=${()=>this._choose(e,n)}
            ></kibble-choice>`})}
        </div>
        ${this.skippable?c`<button type="button" class="later" @click=${this._skip}>Not now</button>`:d}
      </section>
    `}static{this.styles=y`
    :host {
      display: block;
    }
    section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 1.2;
    }
    .when {
      margin-left: 4px;
      font-size: 14px;
      font-weight: 400;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
    }
    .later {
      align-self: flex-start;
      min-height: 48px;
      padding: 0 16px;
      border: 0;
      border-radius: 8px;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 14px;
      cursor: pointer;
    }
    .later:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `}};customElements.define("kibble-who-ate",Zn);var ed=260,df=3;function Jn(t){return t.body??t.face}var eo=class extends _{constructor(){super();this._open=!1;this._queue=null;this._ateQueue=[];this._scene=!1;this._leaving=null;this._imageFailed=!1;this._first=this._makeQuery();this._more=this._makeQuery();this._rosterQuery=this._makeQuery();this._foldedFirst=null;this._foldedMore=null;this._asked=new Set;this._outbox=null;this._unsubscribeOutbox=null;this._preloader=new Br;this._connected=!0;this._swipe=null;this._focusedKey=null;this._loadFirst=()=>{this._first.refresh(()=>this._fetchPage(null))};this._undo=()=>{let e=this._queue,i=e?Xr(e):null;if(!e||!i||!this._outbox)return;clearTimeout(this._leaveTimer),this._leaving=null,this._outbox.enqueue({kind:"photo",sampleUid:i.uid,label:"follow"});let s=e.items.find(n=>n.sample.uid===i.uid)?.visit.uid;s&&(this._asked.delete(s),this._ateQueue=this._ateQueue.filter(n=>n.visitUid!==s)),this._queue=Lc(e),this._scene=!1,this._imageFailed=!1,pe("light")};this._onAteChosen=e=>{let{visitUid:i,ate:s}=e.detail;this._outbox?.enqueue({kind:"ate",visitUid:i,ate:s}),this._ateQueue=this._ateQueue.filter(n=>n.visitUid!==i),pe("success")};this._onAteSkipped=()=>{this._ateQueue=this._ateQueue.slice(1)};this._close=()=>{if(!this._open)return;this._open=!1,clearTimeout(this._leaveTimer),this._leaving=null,this._first.dispose(),this._more.dispose();let e=this._queue?.history.length??0,i=this._outbox?.size??0;if(i>0){let s=`${Dn(i)}. Kibble keeps trying.`;this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:s},bubbles:!0,composed:!0}))}this.dispatchEvent(new CustomEvent("review-closed",{detail:{answered:e},bubbles:!0,composed:!0}))};this._onCancel=e=>{e.preventDefault(),this._ateQueue.length>0?this._onAteSkipped():this._scene?this._scene=!1:this._close()};this._onFrameClick=e=>{e.target===e.currentTarget&&this._close()};this._onKeydown=e=>{if(e.stopPropagation(),e.key==="Escape"||e.key==="Tab"||e.key==="Enter"||e.key===" ")return;let i=this._view();if(i==="ate"){let n=this._ateQueue[0],o=n?Pi(n.cats).map((l,u)=>({id:l.id,hotkey:String(u+1)})):[],a=Yn(e,o);if(a?.type!=="answer")return;e.preventDefault(),this.renderRoot.querySelector("kibble-who-ate")?.choose(o.findIndex(l=>l.id===a.optionId));return}if(i!=="photo")return;let s=Yn(e,this._options());s&&(e.preventDefault(),this._run(s))};this._toggleScene=()=>{(this._queue?we(this._queue):null)?.visit.scene&&(this._scene=!this._scene,this._imageFailed=!1)};this._retryImage=()=>{this._imageFailed=!1,this.renderRoot.querySelector(".card.current kibble-image")?.retry()};this._onPointerDown=e=>{if(e.button!==0||!this._swipeEnabled()||e.composedPath().some(s=>s instanceof HTMLButtonElement))return;let i=e.currentTarget;this._swipe={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:e.timeStamp,velocity:0,sideways:null,armed:null,el:i,width:i.offsetWidth}};this._onPointerMove=e=>{let i=this._swipe;if(!i||e.pointerId!==i.id)return;let s=e.clientX-i.x;if(i.sideways===null){if(i.sideways=zc(s,e.clientY-i.y),i.sideways===!1){this._swipe=null;return}if(i.sideways===null)return;i.el.setPointerCapture(i.id),i.el.classList.add("dragging")}let n=e.timeStamp-i.lastT;n>0&&(i.velocity=(e.clientX-i.lastX)/n),i.lastX=e.clientX,i.lastT=e.timeStamp;let o=jc(s,i.width);i.el.style.setProperty("--dx",`${s}px`),i.el.style.setProperty("--tilt",`${s/i.width*10}deg`),i.el.style.setProperty("--swipe",String(o.progress)),i.el.dataset.side=o.side??"";let a=o.progress>=1?o.side:null;a!==i.armed&&(i.armed=a,i.el.toggleAttribute("data-armed",a!==null),a&&pe("light"))};this._onPointerUp=e=>{let i=this._swipe;if(this._swipe=null,!i||e.pointerId!==i.id||!i.sideways)return;i.el.classList.remove("dragging");let n=e.type==="pointercancel"?null:qc(e.clientX-i.x,i.velocity,i.width),o=n?Bc(n,this._options()):null;if(n&&o){this._choose(o,n);return}i.el.style.removeProperty("--dx"),i.el.style.removeProperty("--tilt"),i.el.style.removeProperty("--swipe"),i.el.removeAttribute("data-armed"),delete i.el.dataset.side};this.cats=[]}static{this.properties={hass:{attribute:!1},entryId:{type:String},cats:{attribute:!1},cache:{attribute:!1},_open:{state:!0},_queue:{state:!0},_ateQueue:{state:!0},_scene:{state:!0},_leaving:{state:!0},_imageFailed:{state:!0}}}_makeQuery(){return new X(()=>this.requestUpdate(),{retry:ct,timeoutMs:dt})}show(){if(this._open)return;this._open=!0,this._scene=!1,this._imageFailed=!1,this._ateQueue=[],this._asked.clear();let e=this._queue?Hc(this._queue):null;this._queue=e&&e.items.length>0?Bn(e,this._hidden()):null,this._more.dispose(),this._more=this._makeQuery(),this._foldedMore=null,this._requestedCursor=void 0,this._rosterQuery.state.data===null&&this._rosterQuery.retryNow(),this._loadFirst()}connectedCallback(){super.connectedCallback(),this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._leaveTimer),this._unsubscribeOutbox?.(),this._unsubscribeOutbox=null,this._outbox=null,this._first.dispose(),this._more.dispose(),this._rosterQuery.dispose(),this._preloader.dispose()}willUpdate(e){let{hass:i,entryId:s}=this;i&&s&&(this._joinOutbox(Bt(i,s)),e.has("hass")&&this._noticeConnection(i.connected!==!1)),this._open&&(this._loadRoster(),this._foldPages(),this._prefetch())}updated(){let e=this.renderRoot.querySelector("dialog");if(e&&this._open&&!e.open&&e.showModal(),e&&!this._open&&e.open&&e.close(),!this._open){this._preloader.sync(void 0,void 0,[]);return}this._warmUp(),this._moveFocus()}_joinOutbox(e){e!==this._outbox&&(this._unsubscribeOutbox?.(),this._outbox=e,this._unsubscribeOutbox=e.subscribe(i=>this._onOutbox(i)))}_onOutbox(e){e.type==="change"?this.requestUpdate():e.type==="delivered"&&this._delivered(e.result)}_hidden(){let e=new Set;for(let[i,s]of this._outbox?.pendingPhotoLabels()??[])s!=="follow"&&e.add(i);return e}_delivered(e){if(e.kind!=="photo"||!this._open||!this._queue)return;let i=e.sample.uid,s=this._queue.items.find(o=>o.sample.uid===i);if(!s||!this._queue.answers.has(i))return;let n=Dc(e.visit,s.visit.start,this._asked);n&&(this._asked.add(n.visitUid),this._ateQueue=[...this._ateQueue,n])}_call(e){let i=this.hass?.callWS;return i?i(e):Promise.reject(new Error("Not connected."))}_fetchPage(e){let i=this.entryId;return!this.hass?.callWS||!i?Promise.reject(new Error("Not connected.")):Hn(s=>this._call(s),i,e)}_loadRoster(){let e=this.entryId;this.cats.length>0||!e||!this.hass?.callWS||this._rosterQuery.sync(e,()=>this._call({type:"kibble/cats",entry_id:e}))}_foldPages(){let e=this._first.state.data;if(e&&e!==this._foldedFirst){this._foldedFirst=e,this._requestedCursor=void 0;let s=!this._queue||this._queue.history.length===0;this._queue=s?Bn(e,this._hidden()):Un(this._queue,e,this._hidden())}let i=this._more.state.data;i&&i!==this._foldedMore&&(this._foldedMore=i,this._queue&&(this._queue=Un(this._queue,i,this._hidden())))}_prefetch(){let e=this._queue;if(!e||!Rc(e)||!this.hass?.callWS||!this.entryId)return;let i=e.cursor;this._requestedCursor===i||this._more.state.loading||(this._requestedCursor=i,this._more.refresh(()=>this._fetchPage(i)))}_noticeConnection(e){if(e&&!this._connected&&this._open)for(let i of[this._first,this._more,this._rosterQuery])i.state.error!==null&&i.retryNow();this._connected=e}_warmUp(){let e=this._queue,i=e&&this._view()==="photo"?we(e):null;if(!e||!i){this._preloader.sync(void 0,void 0,[]);return}this._preloader.sync(this.hass,this.cache,[Jn(i.sample),i.visit.scene,...Wn(e,df).map(s=>Jn(s.sample))])}_roster(){return this.cats.length?this.cats:this._rosterQuery.state.data?.cats??[]}_options(){return Ur(this._roster())}_rosterPending(){return this.cats.length===0&&this._rosterQuery.state.data===null}_reconnecting(){return this._queue!==null&&(this._first.state.error!==null||this._more.state.error!==null)}_choose(e,i){let s=this._queue,n=s?we(s):null,o=this._outbox;if(!s||!n||!o||this._view()!=="photo")return;let a=this._roster(),l=this._options().find(p=>p.id===e);if(!l)return;let u=l.kind==="cat"?a.filter(p=>p.name===l.cat):l.kind==="both"?a:[],h=l.kind==="cat"||l.kind==="both"?"up":"down";l.kind==="cat"&&a.length===2&&(h=a[0]?.name===l.cat?"left":"right"),o.enqueue({kind:"photo",sampleUid:n.sample.uid,label:l.value}),this._leaving={photo:n,side:i??h,label:l.kind==="both"?"Both cats":l.kind==="skip"?"Not used":l.text,cats:u},clearTimeout(this._leaveTimer),this._leaveTimer=setTimeout(()=>{this._leaving=null},ed),this._queue=Mc(s,l.value),this._scene=!1,this._imageFailed=!1,pe(Kn(this._queue)?"success":"light")}_run(e){e.type==="undo"?this._undo():e.type==="scene"?this._toggleScene():this._choose(e.optionId)}async _moveFocus(){let e=this._queue?we(this._queue):null,i=this._view()+":"+(e?.sample.uid??"")+":"+(this._ateQueue[0]?.visitUid??"");if(i===this._focusedKey)return;this._focusedKey=i;let n=this.renderRoot.querySelector("[data-autofocus]")??this.renderRoot.querySelector(".answers");n instanceof Ai&&await n.updateComplete,i===this._focusedKey&&n?.focus({preventScroll:!0})}_sceneBoxes(e){let{sample:i,visit:s}=e;if(!s.in_scene||!i.box)return[];let n=i.peers.map((o,a)=>({key:`peer-${a}`,box:o,tone:"peer",emphasis:"dim"}));return n.push({key:"this",box:i.box,tone:"cat",emphasis:"selected",color:"var(--primary-color, #03a9f4)"}),n}_swipeEnabled(){return this._view()==="photo"&&!this._scene&&this._roster().length===2}_view(){let e=this._queue;return!e||this._rosterPending()?e===null&&this._first.state.error!==null||this._rosterPending()&&this._rosterQuery.state.error!==null?"error":"loading":this._ateQueue.length>0?"ate":we(e)?"photo":Kn(e)?"caught-up":"loading"}render(){return c`
      <dialog aria-label="Check photos" @cancel=${this._onCancel} @keydown=${this._onKeydown}>
        ${this._open?this._renderFrame():d}
      </dialog>
    `}_renderFrame(){let e=this._view(),i=this._queue,s=i&&e==="photo"?we(i):null;return c`
      <div class="frame" @click=${this._onFrameClick}>
        <div class="panel view-${e}">
          ${this._renderTop(e,i)}
          <div class="stage">${this._renderStage(e,i,s)}</div>
          <div class="answers" tabindex="-1" role="group" aria-label=${e==="ate"?"Who ate?":"Who is in this photo?"}>${this._renderAnswers(e,s)}</div>
          ${this._renderFooter(e,i)}
          <p class="sr-only" aria-live="polite">${s?this._spoken(s):""}</p>
        </div>
      </div>
    `}_locale(){return this.hass?.locale?.language??this.hass?.language}_spoken(e){let i=Si(e.sample);return`Photo, ${Zr(e.visit,new Date,this._locale())}.${i?" "+i+".":""}`}_renderTop(e,i){let s=i&&e==="photo"?Ic(Oc(i),this._locale()):null;return c`
      <header class="top">
        <div class="head">
          <div class="titles">
            <h2 class="title">Check photos</h2>
            ${s?c`<span class="count">${s}</span>`:d}
          </div>
          <button type="button" class="icon-btn" aria-label="Close" @click=${this._close}>${g("close")}</button>
        </div>
        ${this._renderNotices()}
      </header>
    `}_renderNotices(){let e=this._outbox,i=e?.size??0,s=e?.drops??[];return c`
      <div class="notices">
        ${s.length>0?c`<div class="notice" role="status"><span class="notice-text">${jr(s)}</span><button type="button" class="pill-btn" @click=${()=>e?.clearDrops()}>OK</button></div>`:d}
        ${i>0?c`<div class="notice" role="status"><span class="notice-text">${Dn(i)}</span><button type="button" class="pill-btn" @click=${()=>e?.sendNow()}>Send now</button></div>`:d}
        ${this._reconnecting()?c`<div class="notice quiet" role="status"><span class="spin">${g("refresh")}</span><span class="notice-text">Reconnecting\u2026</span></div>`:d}
        <kibble-learning-line .hass=${this.hass} .entryId=${this.entryId}></kibble-learning-line>
      </div>
    `}_renderStage(e,i,s){if(e==="loading")return c`<div class="card placeholder" aria-label="Loading photos"></div><p class="when">Loading photos\u2026</p>`;if(e==="error")return c`<div class="result"><span class="result-glyph muted">${g("cloudAlert")}</span><p class="result-line">Couldn\u2019t load photos. Trying again\u2026</p></div>`;if(e==="ate")return c`<div class="result ask">${this._renderAte()}</div>`;if(e==="caught-up"&&i)return this._renderCaughtUp(i);if(!i||!s)return d;let n=[];this._leaving&&this._leaving.photo.sample.uid!==s.sample.uid&&n.push({photo:this._leaving.photo,role:"leaving"}),n.push({photo:s,role:"current"});let o=Wn(i,1)[0];return o&&!n.some(a=>a.photo.sample.uid===o.sample.uid)&&n.push({photo:o,role:"next"}),c`
      <div class="deck">${mc(n,a=>a.photo.sample.uid,a=>this._renderCard(a.photo,a.role))}</div>
      <div class="meta">
        <p class="when">${Zr(s.visit,new Date,this._locale())}</p>
        ${s.visit.scene?c`<button type="button" class="scene-btn" aria-pressed=${this._scene} @click=${this._toggleScene}>${g(this._scene?"arrowCollapse":"arrowExpand")}<span>${this._scene?"Back to close-up":"See whole picture"}</span></button>`:d}
      </div>
    `}_renderCard(e,i){let s=Jn(e.sample);if(i!=="current"){let u=i==="leaving"?this._leaving:null;return c`
        <div class="card ${i} ${u?"to-"+u.side:""}" aria-hidden="true">
          ${this._renderPhoto(s,"")}
          ${u?c`<span class="stamp shown">${this._renderStampBody(u.cats,u.label)}</span>`:d}
        </div>
      `}let n=this._roster(),o=this._swipeEnabled(),a=n[0],l=n[1];return c`
      <div
        class="card current ${o?"swipeable":""}"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @image-failed=${()=>{this._imageFailed=!0}}
      >
        ${this._scene?this._renderScene(e):this._renderPhoto(s,Zr(e.visit,new Date,this._locale()))}
        ${this._imageFailed?c`<div class="photo-error">${g("imageBroken")}<span>Photo didn\u2019t load</span><button type="button" class="pill-btn" @click=${this._retryImage}>Retry</button></div>`:d}
        ${o&&a&&l?c`
              <span class="stamp left">${this._renderStampBody([a],a.name)}</span>
              <span class="stamp right">${this._renderStampBody([l],l.name)}</span>
              <span class="swipe-hint left" aria-hidden="true">${g("chevronLeft")}<kibble-avatar .hass=${this.hass} .name=${a.name} .colorIndex=${a.color} .asset=${a.avatar} .cache=${this.cache}></kibble-avatar></span>
              <span class="swipe-hint right" aria-hidden="true"><kibble-avatar .hass=${this.hass} .name=${l.name} .colorIndex=${l.color} .asset=${l.avatar} .cache=${this.cache}></kibble-avatar>${g("chevronRight")}</span>
            `:d}
      </div>
    `}_renderPhoto(e,i){return e?c`<kibble-image eager fit="contain" .hass=${this.hass} .cache=${this.cache} .asset=${e} alt=${i}></kibble-image>`:c`<span class="no-photo">${Qe()}</span>`}_renderScene(e){return c`
      <div class="scene">
        <div class="scene-frame">
          ${this._renderPhoto(e.visit.scene,"The whole picture")}
          <kibble-box-overlay .boxes=${this._sceneBoxes(e)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>
        </div>
      </div>
    `}_renderStampBody(e,i){return c`
      <span class="stamp-body ${e.length?"":"bare"}" style=${e.length===1?`--stamp-color:${W(e[0].color)}`:""}>
        ${e.map(s=>c`<kibble-avatar .hass=${this.hass} .name=${s.name} .colorIndex=${s.color} .asset=${s.avatar} .cache=${this.cache}></kibble-avatar>`)}
        <span>${i}</span>
      </span>
    `}_renderAte(){return c`<kibble-who-ate
      .hass=${this.hass}
      .cache=${this.cache}
      .question=${this._ateQueue[0]??null}
      .roster=${this._roster()}
      hotkeys
      skippable
      @ate-chosen=${this._onAteChosen}
      @ate-skipped=${this._onAteSkipped}
    ></kibble-who-ate>`}_renderCaughtUp(e){let i=this._roster(),s=gc(e.answers.values(),i.map(o=>o.name)),n=_c(s);return c`
      <div class="result">
        <span class="result-glyph done">${g("check")}</span>
        <p class="result-big">All caught up</p>
        <p class="result-line">${s.total>0?vc(s.total,this._locale()):"Every photo has an answer."}</p>
        ${n.length?c`<ul class="tallies">
              ${n.map(o=>{let a=o.kind==="cat"?i.find(l=>l.name===o.cat):void 0;return c`
                  <li class="tally ${o.kind}" style=${a?`--tally-color:${W(a.color)}`:""}>
                    ${o.kind==="cat"?c`<kibble-avatar .hass=${this.hass} .name=${o.text} .colorIndex=${a?.color??null} .asset=${a?.avatar??null} .cache=${this.cache}></kibble-avatar>`:o.kind==="both"?c`<span class="tally-glyph pair">${i.slice(0,2).map(l=>c`<kibble-avatar .hass=${this.hass} .name=${l.name} .colorIndex=${l.color} .asset=${l.avatar} .cache=${this.cache}></kibble-avatar>`)}</span>`:c`<span class="tally-glyph">${g(o.kind==="not_a_cat"?"cancel":"eyeOff")}</span>`}
                    <span class="tally-text"><span class="tally-name">${o.text}</span><span class="tally-sub">${ee(o.count,"photo","photos",this._locale())}</span></span>
                  </li>
                `})}
            </ul>`:d}
      </div>
    `}_renderAnswers(e,i){if(e==="error")return c`<div class="actions"><button type="button" class="primary-btn" data-autofocus @click=${this._loadFirst}>Retry</button></div>`;if(e==="caught-up")return c`<div class="actions"><button type="button" class="primary-btn" data-autofocus @click=${this._close}>Done</button></div>`;if(e!=="photo"||!i)return d;let s=this._roster(),n=this._options(),o=Vr(i.sample,n),a=l=>{let u=l.id===o?"suggested":"neutral",h=l.kind==="cat"?s.filter(p=>p.name===l.cat):l.kind==="both"?s:[];return c`<kibble-choice
        .hass=${this.hass}
        .cache=${this.cache}
        .label=${l.text}
        .cats=${h}
        .icon=${l.kind==="not_a_cat"?"cancel":l.kind==="skip"?"eyeOff":null}
        .state=${u}
        .hint=${l.hotkey}
        .caption=${u==="suggested"?Si(i.sample):l.hint}
        ?data-autofocus=${u==="suggested"}
        @click=${()=>this._choose(l.id)}
      ></kibble-choice>`};return c`
      <div class="answer-row cats">${n.filter(l=>l.kind==="cat").map(a)}</div>
      <div class="answer-row others">${n.filter(l=>l.kind!=="cat").map(a)}</div>
    `}_renderFooter(e,i){if(e!=="photo"&&e!=="caught-up")return d;let s=i!==null&&Xr(i)!==null;return c`
      <footer class="footer">
        <button type="button" class="plain-btn undo" ?disabled=${!s} @click=${this._undo}>${g("undo")}<span>Undo</span><kbd aria-hidden="true">Z</kbd></button>
      </footer>
    `}static{this.styles=y`
    :host {
      display: contents;
    }
    dialog {
      inset: 0;
      width: 100%;
      height: 100%;
      max-width: none;
      max-height: none;
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      overflow: hidden;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.6);
    }
    .frame {
      container: review / size;
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
    }
    .panel {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr) auto auto;
      grid-template-areas: "top" "stage" "answers" "footer";
      gap: 12px;
      padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
      background: var(--ha-dialog-surface-background, var(--ha-card-background, var(--card-background-color, #fff)));
      --kibble-choice-height: 64px;
    }
    .top {
      grid-area: top;
      min-width: 0;
    }
    .head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
    }
    .titles {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      column-gap: 12px;
      min-width: 0;
    }
    .title {
      margin: 0;
      font-size: 22px;
      font-weight: 500;
      line-height: 1.2;
    }
    .count {
      font-size: 14px;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .notices {
      display: flex;
      flex-direction: column;
    }
    .notices > * {
      margin-top: 6px;
    }
    .notice {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 36px;
      font-size: 13px;
      line-height: 1.3;
      color: var(--secondary-text-color);
    }
    .notice-text {
      flex: 1;
      min-width: 0;
    }
    .notice.quiet {
      min-height: 0;
    }
    .notice .spin {
      display: inline-flex;
      font-size: 16px;
    }
    .icon-btn {
      width: 48px;
      height: 48px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background: none;
      color: var(--primary-text-color);
      font-size: 24px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform 90ms ease-out;
    }
    .icon-btn:active {
      transform: scale(0.92);
    }

    /* ---- Stage ---- */
    .stage {
      grid-area: stage;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .deck {
      position: relative;
      flex: 1;
      min-height: 0;
    }
    .card {
      position: absolute;
      inset: 0;
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 12px);
      background: color-mix(in srgb, var(--primary-text-color) 6%, var(--card-background-color, #fff));
      transition:
        transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 220ms ease-out;
    }
    .card.placeholder {
      position: relative;
      flex: 1;
    }
    .card.next {
      z-index: 1;
      transform: translateY(8px) scale(0.95);
      opacity: 0.5;
    }
    .card.current {
      z-index: 2;
      transform: translate3d(var(--dx, 0px), 0, 0) rotate(var(--tilt, 0deg));
    }
    .card.swipeable {
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
    }
    /* The photo never takes the pointer itself: a mouse drag on an <img> would start the
       browser's own image drag and cancel the swipe. */
    .card kibble-image {
      pointer-events: none;
    }
    .card.dragging {
      transition: none;
      cursor: grabbing;
    }
    .card.leaving {
      z-index: 3;
      pointer-events: none;
      animation: kibble-review-leave-up ${ed}ms ease-in forwards;
    }
    .card.leaving.to-left {
      animation-name: kibble-review-leave-left;
    }
    .card.leaving.to-right {
      animation-name: kibble-review-leave-right;
    }
    .card.leaving.to-down {
      animation-name: kibble-review-leave-down;
    }
    @keyframes kibble-review-leave-left {
      from {
        transform: translate3d(var(--dx, 0px), 0, 0) rotate(var(--tilt, 0deg));
        opacity: 1;
      }
      to {
        transform: translate3d(-110%, 0, 0) rotate(-12deg);
        opacity: 0;
      }
    }
    @keyframes kibble-review-leave-right {
      from {
        transform: translate3d(var(--dx, 0px), 0, 0) rotate(var(--tilt, 0deg));
        opacity: 1;
      }
      to {
        transform: translate3d(110%, 0, 0) rotate(12deg);
        opacity: 0;
      }
    }
    @keyframes kibble-review-leave-up {
      to {
        transform: translate3d(0, -24%, 0) scale(0.92);
        opacity: 0;
      }
    }
    @keyframes kibble-review-leave-down {
      to {
        transform: translate3d(0, 16%, 0) scale(0.92);
        opacity: 0;
      }
    }
    .no-photo {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 24%, transparent);
    }
    .no-photo svg {
      width: 96px;
      height: 96px;
    }
    .photo-error {
      position: absolute;
      inset: 0;
      z-index: 3;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 14px;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 6%, var(--card-background-color, #fff));
    }
    .photo-error svg {
      width: 32px;
      height: 32px;
      fill: currentColor;
      opacity: 0.6;
    }
    /* The whole camera picture, framed the way the event sheet frames it (16:10) so the boxes
       it draws land on the right animals. */
    .scene {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      container-type: size;
      background: #000;
    }
    .scene-frame {
      position: relative;
      width: min(100cqw, 160cqh);
      aspect-ratio: 1.6;
    }
    .meta {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-height: 48px;
    }
    .when {
      margin: 0;
      min-width: 0;
      font-size: 14px;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .scene-btn {
      flex: none;
      min-height: 48px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0 12px;
      border: 0;
      border-radius: 8px;
      background: none;
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .scene-btn svg {
      font-size: 20px;
    }
    .stamp {
      position: absolute;
      top: 16px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
    }
    .stamp.shown {
      opacity: 1;
    }
    .card[data-side="left"] .stamp.left,
    .card[data-side="right"] .stamp.right {
      opacity: var(--swipe, 0);
    }
    .stamp-body {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px 6px 6px;
      border-radius: 999px;
      border: 2px solid var(--stamp-color, var(--secondary-text-color));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 500;
      --kibble-avatar-size: 36px;
    }
    .stamp-body.bare {
      padding-left: 16px;
    }
    .stamp-body kibble-avatar + kibble-avatar {
      margin-left: -20px;
    }
    .card[data-armed] .stamp-body {
      background: color-mix(in srgb, var(--stamp-color, var(--secondary-text-color)) 24%, var(--card-background-color, #fff));
    }
    .swipe-hint {
      display: none;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      align-items: center;
      padding: 4px;
      border-radius: 999px;
      font-size: 20px;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--card-background-color, #fff) 86%, transparent);
      pointer-events: none;
      --kibble-avatar-size: 28px;
    }
    .swipe-hint.left {
      left: 8px;
    }
    .swipe-hint.right {
      right: 8px;
    }
    /* The swipe hint is for fingers; with a mouse the buttons and keys are the way in. */
    @media (pointer: coarse) {
      .swipe-hint {
        display: inline-flex;
      }
      .card.dragging .swipe-hint {
        opacity: 0;
      }
    }

    /* ---- Result cards (all caught up, a question, an error) ---- */
    .result {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      text-align: center;
    }
    .result.ask {
      align-items: stretch;
      justify-content: flex-end;
      text-align: left;
    }
    .result-glyph {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
    }
    .result-glyph.done {
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .result-glyph.muted {
      color: color-mix(in srgb, var(--primary-text-color) 32%, transparent);
    }
    .result-big {
      margin: 0;
      font-size: 34px;
      font-weight: 500;
      line-height: 1.1;
    }
    .result-line {
      margin: 0;
      font-size: 16px;
      color: var(--secondary-text-color);
    }
    .tallies {
      list-style: none;
      margin: 12px 0 0;
      padding: 0;
      width: min(100%, 420px);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .tally {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      text-align: left;
      background: color-mix(in srgb, var(--tally-color, var(--primary-text-color)) 10%, transparent);
      --kibble-avatar-size: 48px;
    }
    .tally-glyph {
      width: 48px;
      height: 48px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: var(--secondary-text-color);
    }
    .tally-glyph.pair {
      --kibble-avatar-size: 32px;
    }
    .tally-glyph.pair kibble-avatar + kibble-avatar {
      margin-left: -12px;
    }
    .tally-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .tally-name {
      font-size: 16px;
      font-weight: 500;
    }
    .tally-sub {
      font-size: 14px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }

    /* ---- Answers ---- */
    .answers {
      grid-area: answers;
      display: flex;
      flex-direction: column;
      gap: 8px;
      outline: none;
    }
    .answer-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
      gap: 8px;
    }
    .answer-row.others {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    /* "Don't use" sits alone on the last row when the answers before it are an odd number. */
    .answer-row.others > :last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .primary-btn,
    .plain-btn {
      min-height: 56px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0 24px;
      border: 0;
      border-radius: 8px;
      font: inherit;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform 90ms ease-out;
    }
    .primary-btn {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .plain-btn {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--primary-text-color);
    }
    .primary-btn:active:not(:disabled),
    .plain-btn:active:not(:disabled) {
      transform: scale(0.97);
    }
    .primary-btn:disabled,
    .plain-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }

    /* ---- Footer ---- */
    .footer {
      grid-area: footer;
      display: flex;
      align-items: center;
      min-height: 48px;
    }
    .plain-btn.undo {
      min-height: 48px;
      padding: 0 16px 0 12px;
      font-size: 14px;
      background: none;
    }
    .plain-btn.undo svg {
      font-size: 20px;
    }
    kbd {
      display: none;
      min-width: 18px;
      box-sizing: border-box;
      padding: 1px 4px;
      border-radius: 4px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 24%, transparent);
      font: inherit;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    @media (hover: hover) and (pointer: fine) {
      kbd {
        display: inline-block;
      }
    }
    .pill-btn {
      flex: none;
      min-height: 36px;
      padding: 0 12px;
      border: 0;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    /* A screen with nothing in its footer gives the row back (the two-pane layout below keeps its own). */
    @container review (max-width: 699px) {
      .panel.view-loading,
      .panel.view-error,
      .panel.view-ate {
        grid-template-rows: auto minmax(0, 1fr) auto;
        grid-template-areas: "top" "stage" "answers";
      }
    }

    /* ---- Two panes: tablet and desktop ---- */
    @container review (min-width: 700px) {
      .panel {
        width: min(1200px, 100cqw - 48px);
        height: min(840px, 100cqh - 48px);
        border-radius: var(--ha-dialog-border-radius, var(--ha-card-border-radius, 12px));
        grid-template-columns: minmax(0, 1fr) clamp(280px, 32cqw, 380px);
        grid-template-rows: auto minmax(0, 1fr) auto;
        grid-template-areas: "stage top" "stage answers" "stage footer";
        column-gap: 16px;
        padding: 16px;
        --kibble-choice-height: 56px;
      }
      .answers {
        overflow-y: auto;
        align-content: start;
        padding: 2px;
      }
      .answer-row,
      .answer-row.others {
        grid-template-columns: minmax(0, 1fr);
      }
      .answer-row.others > :last-child:nth-child(odd) {
        grid-column: auto;
      }
      .titles {
        flex-direction: column;
        align-items: flex-start;
        row-gap: 2px;
      }
    }
    @container review (min-width: 700px) and (max-height: 520px) {
      .panel {
        width: 100%;
        height: 100%;
        border-radius: 0;
        padding: max(8px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(8px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
        gap: 8px;
        --kibble-choice-height: 60px;
      }
      /* Too short for five stacked answers: back to rows, so none scrolls away. */
      .answer-row {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      }
      .answer-row.others {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .answer-row.others > :last-child:nth-child(odd) {
        grid-column: 1 / -1;
      }
      .title {
        font-size: 16px;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .card.placeholder {
        animation: kibble-review-pulse 1.2s ease-in-out infinite alternate;
      }
      .result-glyph.done {
        animation: kibble-review-pop 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .tally {
        animation: kibble-review-rise 220ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
      }
      .tally:nth-child(2) {
        animation-delay: 60ms;
      }
      .tally:nth-child(3) {
        animation-delay: 120ms;
      }
      .notice .spin svg {
        animation: kibble-review-spin 0.9s linear infinite;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .card,
      .icon-btn,
      .primary-btn,
      .plain-btn {
        transition: opacity 120ms linear;
      }
      .card.current,
      .card.next {
        transform: none;
      }
      .card.next {
        opacity: 0;
      }
      .card.leaving,
      .card.leaving.to-left,
      .card.leaving.to-right,
      .card.leaving.to-down {
        animation: kibble-review-fade 120ms linear forwards;
      }
      .icon-btn:active,
      .primary-btn:active:not(:disabled),
      .plain-btn:active:not(:disabled) {
        transform: none;
      }
    }
    @keyframes kibble-review-fade {
      to {
        opacity: 0;
      }
    }
    @keyframes kibble-review-pulse {
      from {
        opacity: 0.5;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes kibble-review-pop {
      0% {
        transform: scale(0.4);
        opacity: 0;
      }
      60% {
        transform: scale(1.12);
        opacity: 1;
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes kibble-review-rise {
      from {
        transform: translateY(8px);
        opacity: 0;
      }
      to {
        transform: none;
        opacity: 1;
      }
    }
    @keyframes kibble-review-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}};customElements.define("kibble-review-queue",eo);var to=class extends _{constructor(){super();this._remaining=null;this._generation=0;this._stopListening=null;this._outbox=null;this._unsubscribeOutbox=null;this._loadCount=()=>{let e=this.hass?.callWS,i=this.entryId;if(!e||!i)return;this._countedEntry=i;let s=++this._generation;oc(e,i).then(n=>{s===this._generation&&(this._remaining=n)},()=>{})};this.cats=[],this.variant="bar"}static{this.properties={hass:{attribute:!1},entryId:{type:String},cats:{attribute:!1},cache:{attribute:!1},variant:{type:String,reflect:!0},revision:{attribute:!1},_remaining:{state:!0}}}open(){this.renderRoot.querySelector("kibble-review-queue")?.show()}connectedCallback(){super.connectedCallback(),this._stopListening=qt(()=>this.entryId,()=>this._loadCount())}disconnectedCallback(){super.disconnectedCallback(),this._stopListening?.(),this._stopListening=null,this._unsubscribeOutbox?.(),this._unsubscribeOutbox=null,this._outbox=null,this._generation++}willUpdate(e){let{hass:i,entryId:s}=this;i&&s&&this._joinOutbox(Bt(i,s)),!!(i?.callWS&&s)&&(s!==this._countedEntry||e.has("revision"))&&this._loadCount()}_joinOutbox(e){e!==this._outbox&&(this._unsubscribeOutbox?.(),this._outbox=e,this._unsubscribeOutbox=e.subscribe(()=>this.requestUpdate()))}_waitingCount(){let e=[...this._outbox?.pendingPhotoLabels().values()??[]].filter(i=>i!=="follow").length;return Math.max(0,(this._remaining??0)-e)}render(){let e=this._waitingCount(),i=e>0?`Check photos, ${ee(e,"photo","photos")} waiting`:"Check photos";return c`
      ${this.variant==="chip"?e>0?c`<button type="button" class="chip" aria-label=${i} @click=${()=>this.open()}>${g("helpCircle")}<span>${e} to check</span></button>`:d:c`<button type="button" class="bar" aria-label=${i} @click=${()=>this.open()}>
            <span class="bar-glyph">${g("helpCircle")}</span>
            <span class="bar-label">Check photos</span>
            ${e>0?c`<span class="badge">${e}</span>`:d}
            <span class="bar-chevron">${g("chevronRight")}</span>
          </button>`}
      <kibble-review-queue .hass=${this.hass} .entryId=${this.entryId} .cats=${this.cats} .cache=${this.cache} @review-closed=${this._loadCount}></kibble-review-queue>
    `}static{this.styles=y`
    :host {
      display: block;
    }
    :host([variant="chip"]) {
      display: contents;
    }
    button {
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform 90ms ease-out;
    }
    button:active {
      transform: scale(0.97);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .bar {
      width: 100%;
      min-height: 48px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 8px 8px 12px;
      border: 0;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--primary-text-color);
      font-size: 14px;
      text-align: left;
    }
    .bar-glyph {
      display: flex;
      font-size: 24px;
      color: var(--secondary-text-color);
    }
    .bar-label {
      flex: 1;
      min-width: 0;
      font-weight: 500;
    }
    .badge {
      min-width: 24px;
      box-sizing: border-box;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    .bar-chevron {
      display: flex;
      font-size: 24px;
      color: var(--secondary-text-color);
    }
    .chip {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px 6px 8px;
      border: 0;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      font-size: inherit;
      font-weight: 500;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .chip svg {
      font-size: 18px;
    }
    /* The pill is small on the video; this keeps its tap target at 44px. */
    .chip::after {
      content: "";
      position: absolute;
      inset: -8px -4px;
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
      button:active {
        transform: none;
      }
    }
  `}};customElements.define("kibble-review-entry",to);var Np=Ru(zp(),1);function ra(t){for(let r of Object.values(t.entities??{}))if(r.platform==="scrypted"&&r.entity_id.startsWith("sensor.scrypted_token")){let e=t.states[r.entity_id]?.state;if(e&&e!=="unavailable"&&e!=="unknown")return e}}var ia=class{constructor(){this.options={proxy:!0,userAgent:navigator.userAgent,capabilities:{audio:RTCRtpReceiver.getCapabilities?.("audio")??{codecs:[],headerExtensions:[]},video:RTCRtpReceiver.getCapabilities?.("video")??{codecs:[],headerExtensions:[]}},screen:{devicePixelRatio:window.devicePixelRatio,width:screen.width,height:screen.height}};this.__proxy_props={options:this.options}}async getOptions(){return this.options}createPeerConnection(r){if(this.pc)return this.pc;let e=new RTCPeerConnection(r.configuration);this.pc=e,e.addEventListener("iceconnectionstatechange",()=>{["disconnected","failed","closed"].includes(e.iceConnectionState)&&this.onClosed?.()});let i=new MediaStream;if(e.addEventListener("track",s=>{i.addTrack(s.track),this.onTrack?.(i)}),r.datachannel&&e.createDataChannel(r.datachannel.label,r.datachannel.dict),r.audio){let s=e.addTransceiver("audio",r.audio);(r.audio.direction==="sendrecv"||r.audio.direction==="sendonly")&&(this.microphone=s.sender)}return r.video&&e.addTransceiver("video",r.video),e}async createLocalDescription(r,e,i){let s=this.createPeerConnection(e),n=new Promise(u=>{s.onicecandidate=h=>{h.candidate?i?.(JSON.parse(JSON.stringify(h.candidate))):u()},s.onicegatheringstatechange=()=>{s.iceGatheringState==="complete"&&u()}}),o=r==="offer"?await s.createOffer({offerToReceiveAudio:!!e.audio,offerToReceiveVideo:!!e.video}):await s.createAnswer(),a=s.setLocalDescription(o);if(i)return{type:o.type,sdp:o.sdp};await a,await n;let l=s.localDescription??o;return{type:l.type,sdp:l.sdp}}async setRemoteDescription(r,e){await this.createPeerConnection(e).setRemoteDescription(r)}async addIceCandidate(r){await this.pc?.addIceCandidate(r)}async endSession(){}async setMicrophone(r){if(!this.microphone)throw new Error("this stream has no return-audio channel");if(r&&!this.micTrack){let e=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1});this.micTrack=e.getAudioTracks()[0],await this.microphone.replaceTrack(this.micTrack)}this.micTrack&&(this.micTrack.enabled=r)}close(){this.micTrack?.stop(),this.pc?.getSenders().forEach(r=>r.track?.stop()),this.pc?.close(),this.pc=void 0}},Ps=class{constructor(r){this.state="idle";this.hasIntercom=!1;this.onChange=r}async open(r,e){this.close(),this.setState("connecting");try{let i=`${location.origin}/api/scrypted/${r.token}/`,s=await(0,Np.connectScryptedClient)({baseUrl:i,pluginId:"@scrypted/core",clientName:"kibble-card"});this.client=s;let n=s.systemManager.getDeviceById(r.deviceId);if(!n)throw new Error(`Scrypted has no device ${r.deviceId}`);let o=n.interfaces??[];if(!o.includes("RTCSignalingChannel"))throw new Error(`${n.name} has no WebRTC channel in Scrypted`);this.hasIntercom=o.includes("Intercom");let a=new ia;this.session=a,a.onTrack=u=>{e.srcObject!==u&&(e.srcObject=u,e.play().catch(()=>{})),this.setState("live")},a.onClosed=()=>{this.session===a&&this.fail("stream disconnected")};let l=n;this.control=await l.startRTCSignalingSession(a)}catch(i){throw this.fail(i instanceof Error?i.message:String(i)),i}}async talk(r){if(!this.session)throw new Error("not connected");await this.session.setMicrophone(r),await this.control?.setPlayback({audio:r,video:!0})}close(){this.control?.setPlayback({audio:!1,video:!0}).catch(()=>{}),this.control=void 0,this.session?.close(),this.session=void 0,this.client?.disconnect?.(),this.client=void 0,this.state!=="idle"&&this.setState("idle")}fail(r){this.error=r,this.session?.close(),this.session=void 0,this.setState("error")}setState(r){this.state=r,r!=="error"&&(this.error=void 0),this.onChange()}};function jp(t,r,e){return t&&r?{kind:"scrypted",deviceId:t,token:r}:e?{kind:"ha-camera",entityId:e}:{kind:"none"}}function qp(t){return Math.min(t*2,3e4)}var Wi={visible:!0},Kb={visible:!1};function Bp(t){return t.visible?{state:t,consumed:!1}:{state:Wi,consumed:!0}}function Up(t,r){return r?t:Kb}function Vp(t,r){return t.visible&&!r}var Gb=8e3,Qb=2e3,Xb=6e4,Zb=1e3,Jb=1e4,eg=1100,tg=1,ig=2.4,rg=64,sa=class extends _{constructor(){super();this._starting=!1;this._backoffMs=1e3;this._lastProgress=0;this._hiddenPaused=!1;this._visionQuery=new X(()=>this.requestUpdate());this._watchedStillImg=null;this._live=new Ps(()=>{this._tick=(this._tick??0)+1});this._onScryptedLoadedMetadata=()=>{this._applyMute();let e=this.renderRoot.querySelector("#video");e&&this._reportMediaAspect(e.videoWidth,e.videoHeight)};this._onStillImgLoad=e=>{let i=e.target;this._reportMediaAspect(i.naturalWidth,i.naturalHeight)};this._start=async()=>{let e=ra(this.hass);if(!e||!this.scryptedId)return;this._starting=!0,this._playing=!0,this._lastProgress=performance.now(),await this.updateComplete;let i=this.renderRoot.querySelector("#video");if(!i){this._starting=!1;return}try{await this._live.open({deviceId:this.scryptedId,token:e},i),this._reconnecting=!1,this._backoffMs=1e3}catch{this._beginReconnect();return}finally{this._starting=!1}};this._onTimeUpdate=()=>{this._lastProgress=performance.now()};this._checkStall=()=>{this._videoSource().kind==="scrypted"&&(!this._playing||this._reconnecting||document.hidden||performance.now()-this._lastProgress>Gb&&this._beginReconnect())};this._pollVision=()=>{let e=this.hass?.callWS,i=this.entryId;!e||!i||this._visionQuery.refresh(()=>e({type:"kibble/vision/last",entry_id:i}).then(s=>s))};this._onVisibilityChange=()=>{if(this._videoSource().kind==="scrypted"){if(document.hidden){clearTimeout(this._hiddenTimer),this._hiddenTimer=setTimeout(this._pauseForHidden,Xb);return}if(clearTimeout(this._hiddenTimer),this._hiddenTimer=void 0,this._hiddenPaused){this._hiddenPaused=!1,this._backoffMs=1e3,this.requestUpdate();return}this._playing&&(this._lastProgress=performance.now())}};this._pauseForHidden=()=>{this._hiddenTimer=void 0,this._videoSource().kind==="scrypted"&&(!this._playing&&!this._reconnecting||(this._hiddenPaused=!0,this._reconnecting=!1,clearTimeout(this._reconnectTimer),this._reconnectTimer=void 0,this._live.close(),this._playing=!1,this._talking=!1))};this._stop=()=>{clearTimeout(this._reconnectTimer),this._reconnectTimer=void 0,clearTimeout(this._hiddenTimer),this._hiddenTimer=void 0,this._live.close(),this._playing=!1,this._talking=!1,this._starting=!1,this._reconnecting=!1,this._hiddenPaused=!1,this._backoffMs=1e3};this._onFrameClick=e=>{if(!this._overlayIdle.visible){this._applyOverlayIdle(Bp(this._overlayIdle).state),this._armIdleTimer(),e.stopPropagation();return}if(this._onOverlayActivity(),e.target.closest?.(".chip")){e.stopPropagation();return}this._expanded||this._expand()};this._collapse=e=>{e?.stopPropagation(),this._onOverlayActivity(),document.removeEventListener("keydown",this._onKeyDown),this._fullscreen&&(document.exitFullscreen?.()??Promise.resolve()).catch(()=>{}),this._expanded=!1};this._onKeyDown=e=>{e.key==="Escape"&&this._collapse()};this._toggleFullscreen=async e=>{if(e.stopPropagation(),this._onOverlayActivity(),this._fullscreen){await(document.exitFullscreen?.()??Promise.resolve()).catch(()=>{});return}let i=this.renderRoot.querySelector("#frame"),s=this.renderRoot.querySelector("#video");try{i?.requestFullscreen?await i.requestFullscreen():s?.webkitEnterFullscreen&&s.webkitEnterFullscreen()}catch{}};this._onFullscreenChange=()=>{let e=this.renderRoot,i=document,s=e.fullscreenElement??e.webkitFullscreenElement??null,n=document.fullscreenElement??i.webkitFullscreenElement??null,o=!1;for(let a=this;a&&n;a=a.host??a.parentNode)if(a===n){o=!0;break}this._fullscreen=s!==null||o};this._toggleMute=()=>{this._onOverlayActivity(),this._muted=!this._muted,this._videoSource().kind==="scrypted"&&this._applyMute()};this._applyMute=()=>{let e=this.renderRoot.querySelector("#video");e&&(e.muted=this._muted,e.play().catch(()=>{}))};this._toggleTalk=async()=>{this._onOverlayActivity();let e=!this._talking;this._talking=e;try{await this._live.talk(e)}catch{e&&(this._talking=!1)}};this._callCats=e=>{if(e.stopPropagation(),this._onOverlayActivity(),this._callingCats||!this.callCatsEntity)return;let i=this.callCatsEntity;this._callingCats=!0,this._pulsingCue=!0,this._cooldownTimer=setTimeout(()=>{this._callingCats=!1},Jb),this._pulseTimer=setTimeout(()=>{this._pulsingCue=!1},eg),this.hass.callService("button","press",{entity_id:i}).catch(()=>{})};this._onOverlayActivity=()=>{this._applyOverlayIdle(Wi),this._armIdleTimer()};this._onFrameFocusIn=e=>{this._onOverlayActivity();let i=e.target;this._controlsFocusVisible=typeof i.matches=="function"&&i.matches(":focus-visible")};this._onFrameFocusOut=e=>{let i=e.relatedTarget,s=this.renderRoot.querySelector("#frame");(!i||!s?.contains(i))&&(this._controlsFocusVisible=!1)};this._onIdleTimerFired=()=>{this._idleTimer=void 0,this._applyOverlayIdle(Up(this._overlayIdle,this._idlePinned()))};this.cats=[],this._playing=!1,this._talking=!1,this._muted=!0,this._reconnecting=!1,this._expanded=!1,this._fullscreen=!1,this._tick=0,this._callingCats=!1,this._pulsingCue=!1,this._overlayIdle=Wi,this._controlsFocusVisible=!1}static{this.properties={hass:{attribute:!1},cameraEntity:{attribute:!1},cats:{attribute:!1},cache:{attribute:!1},scryptedId:{attribute:!1},entryId:{attribute:!1},overlayEntity:{attribute:!1},callCatsEntity:{attribute:!1},externalPin:{attribute:!1},_playing:{state:!0},_talking:{state:!0},_muted:{state:!0},_reconnecting:{state:!0},_expanded:{state:!0},_fullscreen:{state:!0},_tick:{state:!0},_callingCats:{state:!0},_pulsingCue:{state:!0},_overlayIdle:{state:!0},_controlsFocusVisible:{state:!0}}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),document.addEventListener("fullscreenchange",this._onFullscreenChange),document.addEventListener("webkitfullscreenchange",this._onFullscreenChange),this._stallCheckInterval=setInterval(this._checkStall,Qb),this._armIdleTimer()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibilityChange),document.removeEventListener("fullscreenchange",this._onFullscreenChange),document.removeEventListener("webkitfullscreenchange",this._onFullscreenChange),document.removeEventListener("keydown",this._onKeyDown),clearInterval(this._stallCheckInterval),this._stallCheckInterval=void 0,clearInterval(this._visionTimer),this._visionTimer=void 0,clearTimeout(this._cooldownTimer),this._cooldownTimer=void 0,clearTimeout(this._pulseTimer),this._pulseTimer=void 0,clearTimeout(this._idleTimer),this._idleTimer=void 0,this._stop()}_videoSource(){return this.hass?jp(this.scryptedId,ra(this.hass),this.cameraEntity):{kind:"none"}}updated(e){this._syncVisionPolling(),this._syncStillAspectWatch(),(e.has("_talking")||e.has("_pulsingCue")||e.has("_controlsFocusVisible")||e.has("externalPin"))&&this._syncIdlePin();let i=this._videoSource();if(i.kind!=="scrypted"){(this._starting||this._reconnecting||this._hiddenPaused||this._live.state!=="idle")&&this._stop(),this._playing=i.kind==="ha-camera";return}if(this._live.state==="error"&&this._playing){this._beginReconnect();return}this._playing||this._starting||this._reconnecting||this._hiddenPaused||this._start()}render(){let e=this._videoSource();return c`
      ${this._expanded?c`<div class="backdrop" @click=${this._collapse}></div>`:d}
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
        ${this._playing?this._renderVideo(e):d}
        ${this._playing?this._renderDetections():d}
        ${this._expanded?c`<div class="topbar ${this._overlayIdle.visible?"":"idle-hidden"}">
              <button class="chip" aria-label=${this._fullscreen?"Leave fullscreen":"Fullscreen"} title=${this._fullscreen?"Leave fullscreen":"Fullscreen"} @click=${this._toggleFullscreen}>
                ${g(this._fullscreen?"fullscreenExit":"fullscreen")}
              </button>
              <button class="chip" aria-label="Close" title="Close" @click=${this._collapse}>${g("close")}</button>
            </div>`:d}
        ${e.kind==="scrypted"&&this._reconnecting?c`<div class="reconnect" role="status" aria-label="Reconnecting to the feeder's camera">${g("refresh")}</div>`:d}
        <div class="controls ${this._overlayIdle.visible?"":"idle-hidden"}">
          ${this._playing?c`<button
                class="chip"
                aria-pressed=${!this._muted}
                aria-label=${this._muted?"Unmute the feeder":"Mute the feeder"}
                title=${this._muted?"Unmute the feeder":"Mute the feeder"}
                @click=${this._toggleMute}
              >
                ${g(this._muted?"volumeOff":"volumeHigh")}
              </button>`:d}
          ${this._playing&&e.kind==="scrypted"&&this._live.hasIntercom?c`<button
                class="chip talk"
                aria-pressed=${this._talking}
                aria-label=${this._talking?"Stop talking to the feeder":"Talk to the feeder"}
                title=${this._talking?"Stop talking to the feeder":"Talk to the feeder"}
                @click=${this._toggleTalk}
              >
                ${g(this._talking?"microphone":"microphoneOff")}
              </button>`:d}
          ${this._callCatsAvailable()?c`<button
                class="chip call-cats ${this._pulsingCue?"pulsing":""}"
                aria-label="Call the cats"
                title="Call the cats"
                ?disabled=${this._callingCats}
                @click=${this._callCats}
              >
                ${g("cat")}
              </button>`:d}
        </div>
        ${e.kind==="scrypted"&&this._live.state==="error"&&!this._reconnecting?c`<div class="note error">${this._live.error}</div>`:d}
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
      ></ha-camera-stream>`:d}_renderStill(){if(!this.cameraEntity)return c`<div class="placeholder">No camera on this device</div>`;if(customElements.get("hui-image"))return c`<hui-image .hass=${this.hass} .cameraImage=${this.cameraEntity} cameraView="auto"></hui-image>`;let e=this.hass.states[this.cameraEntity]?.attributes.entity_picture;return typeof e=="string"?c`<img src=${e} alt="The feeder's camera" @load=${this._onStillImgLoad} />`:c`<div class="placeholder">Camera unavailable</div>`}_reportMediaAspect(e,i){if(!Number.isFinite(e)||!Number.isFinite(i)||e<=0||i<=0)return;let s=Math.min(ig,Math.max(tg,e/i));this._reportedAspect!==void 0&&Math.abs(this._reportedAspect-s)<.001||(this._reportedAspect=s,this.style.setProperty("--kibble-hero-aspect",String(s)),this.dispatchEvent(new CustomEvent("media-aspect-changed",{detail:{ratio:s},bubbles:!0,composed:!0})))}_syncStillAspectWatch(){let i=this.renderRoot.querySelector("hui-image")?.shadowRoot?.querySelector("img")??null;i!==this._watchedStillImg&&(this._watchedStillImg&&this._watchedStillImg.removeEventListener("load",this._onStillImgLoad),this._watchedStillImg=i,i&&(i.complete&&i.naturalWidth>0&&this._reportMediaAspect(i.naturalWidth,i.naturalHeight),i.addEventListener("load",this._onStillImgLoad,{once:!0})))}_renderDetections(){let e=this._visionQuery.state.data?.frame;if(!this._overlayOn()||!e?.detections)return d;let i=e.overlay_suppressed??!0,s=e.detections.filter(o=>o.admitted||i);if(s.length===0)return d;let n=s.map((o,a)=>{let l=o.cat||null,u=l?this.cats?.find(p=>p.name===l):void 0,h=o.admitted&&l!==null;return{key:`vision-${o.sid??"unmatched"}-${a}`,box:[o.x1,o.y1,o.x2,o.y2],tone:o.admitted?h?"cat":"unknown":"clutter",color:h?u?W(u.color):xe(l):void 0,label:h?l:void 0,avatar:u?.avatar??null}});return c`<kibble-box-overlay class="detections" .boxes=${n} .hass=${this.hass} .cache=${this.cache} .labelSafeTop=${rg}></kibble-box-overlay>`}_beginReconnect(){this._playing=!1,this._reconnecting=!0,this._talking=!1,this._live.close(),this._reconnectTimer===void 0&&(this._reconnectTimer=setTimeout(()=>{this._reconnectTimer=void 0,this._start()},this._backoffMs),this._backoffMs=qp(this._backoffMs))}_overlayOn(){let e=this.overlayEntity;return e!==void 0&&this.hass?.states[e]?.state==="on"}_syncVisionPolling(){let e=this._playing&&this._overlayOn()&&!!this.entryId&&!!this.hass?.callWS,i=this._visionTimer!==void 0;if(e!==i){if(!e){this._stopVisionPolling();return}this._pollVision(),this._visionTimer=setInterval(this._pollVision,Zb)}}_stopVisionPolling(){clearInterval(this._visionTimer),this._visionTimer=void 0,this._visionQuery=new X(()=>this.requestUpdate())}_expand(){this._expanded=!0,document.addEventListener("keydown",this._onKeyDown)}_callCatsAvailable(){let e=this.callCatsEntity;return e!==void 0&&this.hass?.states[e]?.state!=="unavailable"}notifyActivity(){this._onOverlayActivity()}_applyOverlayIdle(e){let i=e.visible!==this._overlayIdle.visible;this._overlayIdle=e,i&&this.dispatchEvent(new CustomEvent("overlay-idle-changed",{detail:{visible:e.visible},bubbles:!0,composed:!0}))}_idlePinned(){return this._talking||this._pulsingCue||this._controlsFocusVisible||!!this.externalPin}_syncIdlePin(){if(this._idlePinned()){clearTimeout(this._idleTimer),this._idleTimer=void 0,this._overlayIdle.visible||this._applyOverlayIdle(Wi);return}this._idleTimer===void 0&&this._armIdleTimer()}_armIdleTimer(){clearTimeout(this._idleTimer),this._idleTimer=void 0,Vp(this._overlayIdle,this._idlePinned())&&(this._idleTimer=setTimeout(this._onIdleTimerFired,5e3))}static{this.styles=y`
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
  `}};customElements.define("kibble-live-hero",sa);async function Wp(){return customElements.get("bubble-card")?!0:(await Promise.race([customElements.whenDefined("bubble-card"),new Promise(t=>setTimeout(t,2e3))]),!!customElements.get("bubble-card"))}var na=class extends _{constructor(){super(...arguments);this._builtFor=""}static{this.properties={hass:{attribute:!1},config:{attribute:!1}}}updated(){this._sync()}async _sync(){if(!this.config)return;let e=JSON.stringify(this.config);if(e!==this._builtFor){this._builtFor=e;let i=await window.loadCardHelpers?.();if(!i||e!==this._builtFor)return;let s=i.createCardElement({type:"custom:bubble-card",...this.config});this._element?.remove(),this._element=s,this.renderRoot.querySelector(".slot")?.appendChild(s)}this._element&&this.hass&&(this._element.hass=this.hass)}render(){return c`<div class="slot"></div>`}static{this.styles=y`
    :host {
      display: block;
    }
    .slot > * {
      /* Bubble rows carry their own outer margin for stacking; the card lays them out itself. */
      --bubble-margin: 0;
    }
  `}};customElements.define("kibble-bubble-row",na);var sg=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"scrypted_id",selector:{text:{}}},{name:"settings_hash",selector:{text:{}}},{name:"detection_areas_hash",selector:{text:{}}},{name:"schedule_hash",selector:{text:{}}}],ng={device_id:"Kibble device",name:"Name (optional)",scrypted_id:"Scrypted camera id (optional, adds low-latency video and talk)",settings_hash:"Settings pop-up hash (optional)",detection_areas_hash:"Detection areas pop-up hash (optional)",schedule_hash:"Schedule handled by dashboard (optional hash)"},oa=class extends _{constructor(){super(...arguments);this._computeLabel=e=>ng[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${sg}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():d}_renderFallback(){let e=Object.values(this.hass?.entities??{}),i=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return c`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${i.map(s=>c`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateSettingsHash(e){this._config&&(this._config={...this._config,settings_hash:e||void 0},this._fireConfigChanged())}_updateDetectionAreasHash(e){this._config&&(this._config={...this._config,detection_areas_hash:e||void 0},this._fireConfigChanged())}_updateScheduleHash(e){this._config&&(this._config={...this._config,schedule_hash:e||void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-card-editor",oa);var Rs=class{constructor(r){this._onChanged=r;this._unsubscribe=null;this._subscribing=!1}sync(r,e){e!==this._entryId&&(this._entryId=e,this._resubscribe(r,e))}async _resubscribe(r,e){let i=this._unsubscribe;if(this._unsubscribe=null,i&&await i().catch(()=>{}),!(!r?.connection||!e||this._subscribing)){this._subscribing=!0;try{let s=await r.connection.subscribeMessage(()=>{this._entryId===e&&this._onChanged()},{type:"kibble/timeline/subscribe",entry_id:e});if(this._subscribing=!1,this._entryId!==e){s().catch(()=>{});return}this._unsubscribe=s}catch{this._subscribing=!1}}}dispose(){let r=this._unsubscribe;this._unsubscribe=null,this._entryId=void 0,r&&r().catch(()=>{})}};var Ms=class{constructor(r){this._onChange=r;this.state={items:null,loading:!1,loadingMore:!1,cursor:null,hasMore:!1,error:null};this._key=null;this._generation=0;this._lastLimit=30;this._live=new Rs(()=>this._onLiveChange())}sync(r,e,i){this._lastHass=r,this._lastEntryId=e,this._lastLimit=i,this._live.sync(r,e);let s=e?`${e}:${i}`:null;s!==this._key&&(this._key=s,!(!r?.callWS||!e)&&this._readPage(r,e,i,null,++this._generation,!0))}loadMore(r,e,i){!r?.callWS||!e||this.state.loading||this.state.loadingMore||!this.state.hasMore||this._readPage(r,e,i,this.state.cursor,this._generation,!1)}refresh(r,e,i){!r?.callWS||!e||this._readPage(r,e,i,null,++this._generation,!0)}replaceItem(r,e){let i=this.state.items;if(!i)return;let s=i.findIndex(o=>o.uid===r);if(s===-1)return;let n=i.slice();n[s]=e,this.state={...this.state,items:n},this._onChange()}removeItem(r){let e=this.state.items;e&&e.some(i=>i.uid===r)&&(this.state={...this.state,items:e.filter(i=>i.uid!==r)},this._onChange())}restoreItems(r){this.state={...this.state,items:r},this._onChange()}_onLiveChange(){this.refresh(this._lastHass,this._lastEntryId,this._lastLimit)}async _readPage(r,e,i,s,n,o){this.state=o?{...this.state,loading:!0,error:null}:{...this.state,loadingMore:!0,error:null},this._onChange();try{let a=await r.callWS({type:"kibble/timeline",entry_id:e,limit:i,...s?{cursor:s}:{}});if(n!==this._generation)return;let l=o?a.items:[...this.state.items??[],...a.items];this.state={items:l,loading:!1,loadingMore:!1,cursor:a.cursor,hasMore:a.has_more,error:null}}catch(a){if(n!==this._generation)return;this.state={...this.state,loading:!1,loadingMore:!1,error:U(a)}}this._onChange()}dispose(){this._generation+=1,this._live.dispose()}};function Kp(t,r){return t>0?`${ee(t,"photo","photos",r)} updated`:null}function og(t){return t.length<=1?t[0]??"":t.length===2?t[0]+" and "+t[1]:t.slice(0,-1).join(", ")+", and "+t[t.length-1]}function Yp(t,r){if(r.identity==="not_a_cat")return"Not a cat";if(t.length===0)return"Who was here?";let e=new Map;for(let i of t){let s=r.open?i.ate?"is eating":"is here":i.ate?"ate":"came by",n=e.get(s)??[];n.push(i.cat),e.set(s,n)}return[...e].map(([i,s])=>og(s)+" "+i).join(", ")}function Gp(t,r){if(r.length<2)return[];let e=r.map(n=>({cat:n.cat,samples:[]})),i=new Map(e.map(n=>[n.cat,n])),s=[];for(let n of t){let o=n.cat?i.get(n.cat):void 0;o?o.samples.push(n):s.push(n)}return s.length>0&&e.reduce((o,a)=>a.samples.length>o.samples.length?a:o).samples.push(...s),e}function Qp(t,r){let e=t*1e3-r-3e3;return Math.max(0,e)/1e3}var ag=["button:not([disabled])","[href]","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),lg=350,cg=700,dg=48,aa=class extends _{constructor(){super();this._index=0;this._pulse=null;this._closeRef=T();this._touchStartX=0;this._touchStartY=0;this._keydownHandler=e=>{if(!this.open)return;if(e.key==="Escape"){e.preventDefault(),this._requestClose();return}if(e.key==="ArrowLeft"){e.preventDefault(),this._go(-1);return}if(e.key==="ArrowRight"){e.preventDefault(),this._go(1);return}if(e.key!=="Tab")return;let i=[...this.renderRoot.querySelectorAll(ag)];if(i.length===0){e.preventDefault(),this._closeRef.value?.focus();return}let s=this.renderRoot.querySelector(":focus"),n=s?i.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=i.length)&&(e.preventDefault(),(e.shiftKey?i[i.length-1]:i[0])?.focus())};this._requestClose=()=>{this.dispatchEvent(new CustomEvent("viewer-close-requested",{bubbles:!0,composed:!0}))};this._onTouchStart=e=>{let i=e.touches[0];i&&(this._touchStartX=i.clientX,this._touchStartY=i.clientY)};this._onTouchEnd=e=>{let i=e.changedTouches[0];if(!i)return;let s=i.clientX-this._touchStartX,n=i.clientY-this._touchStartY;Math.abs(s)<dg||Math.abs(s)<Math.abs(n)*1.5||this._go(s<0?1:-1)};this._requestBoxesVisibility=()=>{this.dispatchEvent(new CustomEvent("boxes-visibility-requested",{detail:{visible:!this.showBoxes},bubbles:!0,composed:!0}))};this.open=!1,this.cats=[],this.samples=[],this.initialIndex=0,this.showBoxes=!0}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},cache:{attribute:!1},cats:{attribute:!1},samples:{attribute:!1},initialIndex:{type:Number},showBoxes:{type:Boolean},_index:{state:!0},_pulse:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),clearTimeout(this._pulseTimer),clearTimeout(this._advanceTimer)}willUpdate(e){e.has("open")&&this.open&&(this._index=this.initialIndex,this._pulse=null)}updated(e){e.has("open")&&this.open&&this._closeRef.value?.focus()}_go(e){let i=this._index+e;i<0||i>=this.samples.length||(this._index=i,this._pulse=null)}_catColor(e){let i=this.cats.find(s=>s.name===e);return i?W(i.color):xe(e)}_photoOverlayBoxes(e){if(!e.body||!e.box||!e.crop)return[];let i=Nt(e.box,e.crop);if(!i)return[];let s=e.label??e.guess,n=s!==null&&s!=="not_a_cat"&&s!=="skip"&&s!=="both"?s:null,o=n?"cat":s==="not_a_cat"?"not-cat":"unknown",a=n?this.cats.find(l=>l.name===n):null;return[{key:"sample:"+e.uid,box:i,tone:o,label:n??(o==="not-cat"?"Not a cat":"Who?"),color:n?this._catColor(n):void 0,avatar:a?.avatar??null},...e.peers.flatMap((l,u)=>{let h=Nt(l,e.crop);return h?[{key:"peer:"+e.uid+":"+u,box:h,tone:"peer"}]:[]})]}render(){if(!this.open)return d;let e=this.samples[this._index];if(!e)return d;let i=this.samples.length,s=e.body??e.face,n=e.body&&e.face?e.face:null,o=Wr(e);return c`
      <div class="scrim" role="dialog" aria-modal="true" aria-label=${`Photo ${this._index+1} of ${i}`} @click=${this._requestClose}>
        <div class="panel" @click=${a=>a.stopPropagation()} @touchstart=${this._onTouchStart} @touchend=${this._onTouchEnd}>
          <div class="panel-top">
            <span class="counter">${this._index+1} / ${i}</span>
            <button type="button" class="close" ${P(this._closeRef)} aria-label="Close photo" @click=${this._requestClose}>${g("close")}</button>
          </div>
          <div class="stage">
            ${s?c`<div class="image-frame"><kibble-image .hass=${this.hass} .asset=${s} .cache=${this.cache} alt="" fit="contain"></kibble-image>${e.body&&this.showBoxes?c`<kibble-box-overlay .boxes=${this._photoOverlayBoxes(e)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>`:d}</div>`:d}
            ${o?c`<span class="tag">${o.text}</span>`:d}
            ${e.body&&e.box&&e.crop?c`<button type="button" class="box-toggle" aria-pressed=${this.showBoxes} aria-label=${this.showBoxes?"Hide boxes":"Show boxes"} @click=${this._requestBoxesVisibility}>${g(this.showBoxes?"eye":"eyeOff")}</button>`:d}
            ${n?c`<span class="face-inset"><kibble-image .hass=${this.hass} .asset=${n} .cache=${this.cache} alt="" rounded></kibble-image></span>`:d}
            <button type="button" class="nav prev" aria-label="Previous photo" ?disabled=${this._index===0} @click=${()=>this._go(-1)}>
              <span class="chevron chevron-left">${g("chevronDown")}</span>
            </button>
            <button type="button" class="nav next" aria-label="Next photo" ?disabled=${this._index===i-1} @click=${()=>this._go(1)}>
              <span class="chevron chevron-right">${g("chevronDown")}</span>
            </button>
          </div>
          ${this._renderAnswers(e)}
        </div>
      </div>
    `}_renderAnswers(e){let i=Ur(this.cats),s=zn(e.review),n=e.review===null?Vr(e,i):null;return c`
      <div class="answers">
        <div class="chip-row" role="group" aria-label="Who is in this photo?">
          ${i.map(o=>{let a=o.id===s?"selected":o.id===n?"suggested":"neutral",l=o.kind==="cat"?this.cats.filter(u=>u.name===o.cat):o.kind==="both"?this.cats:[];return c`<kibble-choice
              .hass=${this.hass}
              .cache=${this.cache}
              .label=${o.text}
              .cats=${l}
              .icon=${o.kind==="not_a_cat"?"cancel":o.kind==="skip"?"eyeOff":null}
              .state=${a}
              .caption=${a==="suggested"?Si(e):o.hint}
              .pop=${this._pulse?.uid===e.uid&&this._pulse.optionId===o.id}
              @click=${()=>this._answer(e,o.value,o.id)}
            ></kibble-choice>`})}
        </div>
        ${e.review!==null?c`<button type="button" class="undo" @click=${()=>this._answer(e,"follow",null)}>${g("undo")}<span>Undo</span></button>`:d}
      </div>
    `}_answer(e,i,s){if(this.dispatchEvent(new CustomEvent("sample-answer-requested",{detail:{sampleUid:e.uid,label:i},bubbles:!0,composed:!0})),clearTimeout(this._pulseTimer),clearTimeout(this._advanceTimer),s===null){this._pulse=null;return}this._pulse={uid:e.uid,optionId:s},this._pulseTimer=setTimeout(()=>{this._pulse=null},cg),this._advanceTimer=setTimeout(()=>{this._index<this.samples.length-1&&this._go(1)},lg)}static{this.styles=y`
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
      font-size: 14px;
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
    /* The answers sit on their own solid HA-theme surface, distinct from the black photo
     * chrome above (image on top, flexing; answers beneath, never overlapping), so the shared
     * answer buttons read the same here as everywhere else in light and dark. */
    .answers {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      padding-bottom: max(8px, env(safe-area-inset-bottom));
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .chip-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 12px 12px 4px;
    }
    .chip-row kibble-choice {
      flex: 1 1 0;
      min-width: 96px;
    }
    .undo {
      align-self: flex-start;
      min-height: 48px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin: 0 12px;
      padding: 0 12px;
      border: 0;
      border-radius: 8px;
      background: none;
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .undo:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .tag {
      position: absolute;
      z-index: 8;
      top: 8px;
      left: 16px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
    }
    .box-toggle:focus-visible,
    .close:focus-visible,
    .nav:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  `}};customElements.define("kibble-photo-viewer",aa);var pg=["button:not([disabled])","[href]","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),ug=3600,hg=1.6,la=12,fg=6,da="kibble:show-boxes",ca="kibble-boxes-visibility-changed";function mg(){try{return localStorage.getItem(da)!=="false"}catch{return!0}}var pa=class extends _{constructor(){super();this._photosExpanded=!1;this._viewerIndex=null;this._zoom=null;this._lastEventUid=null;this._beforeRef=new Ve;this._afterRef=new Ve;this._sceneRef=new Ve;this._closeButtonRef=T();this._videoRef=T();this._clipSrc=null;this._clipError=!1;this._clipEventUid=null;this._keydownHandler=e=>{if(!this.open||this._viewerIndex!==null)return;if(e.key==="Escape"){e.preventDefault(),this._zoom?this._zoom=null:this._close();return}if(e.key!=="Tab")return;let i=[...this.renderRoot.querySelectorAll(pg)];if(i.length===0){e.preventDefault(),this._closeButtonRef.value?.focus();return}let s=this.renderRoot.querySelector(":focus"),n=s?i.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=i.length)&&(e.preventDefault(),(e.shiftKey?i[i.length-1]:i[0])?.focus())};this._onSharedBoxesChange=e=>{let i=e.detail?.visible;typeof i=="boolean"&&(this._showBoxes=i)};this._onStorage=e=>{e.key===da&&(this._showBoxes=e.newValue!=="false")};this._toggleBoxes=()=>this._setBoxesVisible(!this._showBoxes);this._onBoxesVisibilityRequested=e=>{let i=e.detail?.visible;typeof i=="boolean"&&this._setBoxesVisible(i)};this._onViewerClose=()=>{this._viewerIndex=null};this._retrySamples=()=>{this.dispatchEvent(new CustomEvent("samples-retry-requested",{bubbles:!0,composed:!0}))};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.cats=[],this.summary=null,this.samples=null,this.samplesFailed=!1,this.group=[],this.groupTogether=!1,this.sceneSubjects=[],this.sessionCats=null,this._showBoxes=mg()}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},entryId:{type:String},cache:{attribute:!1},cats:{attribute:!1},summary:{attribute:!1},samples:{attribute:!1},sceneSubjects:{attribute:!1},sessionCats:{attribute:!1},samplesFailed:{type:Boolean},group:{attribute:!1},groupTogether:{type:Boolean},_photosExpanded:{state:!0},_viewerIndex:{state:!0},_zoom:{state:!0},_clipSrc:{state:!0},_clipError:{state:!0},_showBoxes:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler),window.addEventListener(ca,this._onSharedBoxesChange),window.addEventListener("storage",this._onStorage)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),window.removeEventListener(ca,this._onSharedBoxesChange),window.removeEventListener("storage",this._onStorage),this._beforeRef.dispose(),this._afterRef.dispose(),this._sceneRef.dispose(),this._stopClipPlayback()}_setBoxesVisible(e){this._showBoxes=e;try{localStorage.setItem(da,String(e))}catch{}window.dispatchEvent(new CustomEvent(ca,{detail:{visible:e}}))}willUpdate(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus();let i=this.summary;this._beforeRef.sync(this.hass,this.cache,i?.before,()=>this.requestUpdate()),this._afterRef.sync(this.hass,this.cache,i?.after,()=>this.requestUpdate()),this._sceneRef.sync(this.hass,this.cache,i?.scene??null,()=>this.requestUpdate());let s=i?.uid??null;s!==this._lastEventUid&&(this._lastEventUid=s,this._photosExpanded=!1,this._viewerIndex=null,this._zoom=null),(e.has("open")&&!this.open||s!==this._clipEventUid)&&(this._clipEventUid=s,this._releaseClip())}render(){let e=this.summary;if(!this.open||!e)return d;let i=this._sessionCatsFor(e),s=e.kind==="feed",n=this.hass?.locale?.language??this.hass?.language,o=s?Ti(e):Yp(i,e),a=this._stageKind(e);return c`
      <div class="backdrop" @click=${this._close}>
        <div class="sheet" role="dialog" aria-modal="true" aria-label=${o} @click=${l=>l.stopPropagation()}>
          ${this._renderHeader(e,n,o,i)}
          <div class="scroll">
            <div class="layout ${a==="none"?"no-media":""}">
              ${a!=="none"?c`
                    <div class="media-col">
                      ${a==="media"?this._renderMediaStage(e):this._renderCompare()}
                      ${a==="media"&&e.before&&e.after?this._renderCompare():d}
                    </div>
                  `:d}
              <div class="info-col">${s?d:c`${this._renderAsk(e,i)}${this._renderPhotos(e,i)}`}</div>
            </div>
          </div>
          <footer><button type="button" class="primary-btn" @click=${this._close}>Done</button></footer>
        </div>
        ${this._zoom?this._renderZoom():d}
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
        @viewer-close-requested=${this._onViewerClose}
      ></kibble-photo-viewer>
    `}_catColor(e){let i=this.cats.find(s=>s.name===e);return i?W(i.color):xe(e)}_sceneOverlayBoxes(){return this.sceneSubjects.map((e,i)=>{let s=e.label&&e.label!=="not_a_cat"?e.label:null,n=s?this.cats.find(a=>a.name===s):null,o=s?"cat":e.label==="not_a_cat"?"not-cat":"unknown";return{key:"scene:"+i,box:e.box,tone:o,label:s??(o==="not-cat"?"Not a cat":"Who?"),color:s?this._catColor(s):void 0,avatar:n?.avatar??null}})}_renderBoxesToggle(){return c`<button type="button" class="box-toggle" aria-pressed=${this._showBoxes} aria-label=${this._showBoxes?"Hide boxes":"Show boxes"} @click=${e=>{e.stopPropagation(),this._toggleBoxes()}}>${g(this._showBoxes?"eye":"eyeOff")}</button>`}_photoOverlayBoxes(e){if(!e.body||!e.box||!e.crop)return[];let i=Nt(e.box,e.crop);if(!i)return[];let s=e.label??e.guess,n=s!==null&&s!=="not_a_cat"&&s!=="skip"&&s!=="both"?s:null,o=n?"cat":s==="not_a_cat"?"not-cat":"unknown",a=n?this.cats.find(l=>l.name===n):null;return[{key:"sample:"+e.uid,box:i,tone:o,color:n?this._catColor(n):void 0,avatar:a?.avatar??null},...e.peers.flatMap((l,u)=>{let h=Nt(l,e.crop);return h?[{key:"peer:"+e.uid+":"+u,box:h,tone:"peer"}]:[]})]}_renderHeader(e,i,s,n){let o=Kr(e),a=n.find(h=>h.ate)?.cat??n[0]?.cat??e.cat,l=a?this._catColor(a):null,u=this.group.findIndex(h=>h.uid===e.uid);return c`
      <header>
        ${this.group.length>1&&!this.groupTogether?this._renderPager(u):d}
        <div class="heading">
          <span class="title">${s}</span>
          <span class="meta">
            ${fe(e.start,i)}${o?c`, ${o}`:d}
            ${e.open?this._renderLiveBadge(l):d}
          </span>
        </div>
        <button type="button" class="close" ${P(this._closeButtonRef)} @click=${this._close} aria-label="Close">${g("close")}</button>
      </header>
    `}_renderLiveBadge(e){return c`
      <span class="live-badge" style="--dot-color:${e??"var(--kibble-live, #e5484d)"}" aria-label="Happening now">
        <span class="live-core"></span>
        <span class="live-pulse"></span>
      </span>
    `}_renderPager(e){let i=this.group.length;return c`
      <div class="pager">
        <button type="button" class="pager-btn" aria-label="Previous event" ?disabled=${e<=0} @click=${()=>this._goToGroupIndex(e-1)}>
          <span class="chevron chevron-left">${g("chevronDown")}</span>
        </button>
        <span class="pager-count">${e+1} of ${i}</span>
        <button
          type="button"
          class="pager-btn"
          aria-label="Next event"
          ?disabled=${e===-1||e>=i-1}
          @click=${()=>this._goToGroupIndex(e+1)}
        >
          <span class="chevron chevron-right">${g("chevronDown")}</span>
        </button>
      </div>
    `}_goToGroupIndex(e){let i=this.group[e];i&&this.dispatchEvent(new CustomEvent("event-requested",{detail:{uid:i.uid},bubbles:!0,composed:!0}))}_hasClip(e){return e.kind==="eat"&&!!e.clip&&!!e.scene&&!this._clipError}_stageKind(e){return e.scene||this._hasClip(e)?"media":e.before&&e.after?"compare":"none"}_renderMediaStage(e){if(this._clipSrc)return c`
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
      `;let i=e.scene,s=this._hasClip(e);return c`
      <div class="stage">
        ${i?c`
              <button type="button" class="stage-zoom" aria-label="View photo full screen" @click=${()=>{this._zoom=i}}>
                <kibble-image .hass=${this.hass} .asset=${i} .cache=${this.cache} alt="" fit="contain"></kibble-image>
              </button>
              ${s?c`
                    <button type="button" class="clip-play" aria-label="Play video" @click=${n=>{n.stopPropagation(),this._playClip(e)}}>
                      ${g("play")}
                    </button>
                  `:d}
            `:d}
        ${this._showBoxes&&this.sceneSubjects.length?c`<kibble-box-overlay .boxes=${this._sceneOverlayBoxes()} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>`:d}
        ${this.sceneSubjects.length?this._renderBoxesToggle():d}
      </div>
    `}async _playClip(e){let i=this.hass,s=this.entryId;if(!i?.callWS||!s||!e.clip)return;let n=`/api/kibble/${s}/clip/${e.uid}`;try{let o=await i.callWS({type:"auth/sign_path",path:n,expires:ug});if(this.summary?.uid!==e.uid)return;this._clipError=!1,this._clipSrc=o.path}catch{this._clipError=!0}}_seekClip(e){let i=this._videoRef.value;!i||!e.clip||(i.currentTime=Qp(e.start,e.clip.start_ms))}_onClipError(){this._stopClipPlayback(),this._clipError=!0}_stopClipPlayback(){let e=this._videoRef.value;e&&(e.pause(),e.removeAttribute("src"),e.load()),this._clipSrc=null}_releaseClip(){this._stopClipPlayback(),this._clipError=!1}_renderCompare(){return c`<kibble-before-after class="compare" .beforeSrc=${this._beforeRef.url} .afterSrc=${this._afterRef.url} .aspect=${hg}></kibble-before-after>`}_renderZoom(){let e=this.summary;return c`
      <div class="zoom" @click=${i=>{i.stopPropagation(),this._zoom=null}}>
        <div class="zoom-scene" @click=${i=>i.stopPropagation()}>
          <kibble-image .hass=${this.hass} .asset=${this._zoom} .cache=${this.cache} alt="" fit="contain"></kibble-image>
          ${e&&this._showBoxes&&this.sceneSubjects.length?c`<kibble-box-overlay .boxes=${this._sceneOverlayBoxes()} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>`:d}
        </div>
        ${this.sceneSubjects.length?this._renderBoxesToggle():d}
        <button type="button" class="zoom-close" aria-label="Close photo" @click=${i=>{i.stopPropagation(),this._zoom=null}}>${g("close")}</button>
      </div>
    `}_sessionCatsFor(e){return this.sessionCats?this.sessionCats:e.cat?[{cat:e.cat,ate:e.kind==="eat",confirmed:e.identity==="reviewed",confidence:e.confidence??null,photos:e.sample_count??0}]:[]}_renderAsk(e,i){let s=i.map(o=>o.cat),n=e.needs_ate&&s.length>=2?{visitUid:e.uid,cats:s,start:e.start}:null;return c`
      <div class="ask">
        ${n?c`<kibble-who-ate .hass=${this.hass} .cache=${this.cache} .question=${n} .roster=${this.cats}></kibble-who-ate>`:d}
        ${this.samples?.length?c`<p class="hint">Tap a photo to say who is in it.</p>`:d}
      </div>
    `}_renderPhotos(e,i){if(this.samplesFailed)return c`<div class="photos"><div class="photos-heading">Photos</div><p class="photos-error"><span>Couldn't load photos.</span> <button type="button" @click=${this._retrySamples}>Retry</button></p></div>`;if(this.samples===null)return c`<div class="photos"><div class="photos-heading">Photos</div><div class="photos-grid">${Array.from({length:fg},()=>c`<div class="photo-skeleton"></div>`)}</div></div>`;if(this.samples.length===0)return d;let s=Gp(this.samples,i);return s.length===0?c`<div class="photos"><div class="photos-heading"><span>Photos</span><span class="photos-count">${this.samples.length}</span></div>${this._renderPhotoGrid(this.samples)}</div>`:c`<div class="photos">${s.map(n=>c`
      <section class="photo-section" aria-label=${n.cat+" photos"}>
        <div class="photos-heading"><span><span class="photo-section-dot" style=${"--section-color:"+(this._catColor(n.cat)??"var(--secondary-text-color)")}></span>${n.cat}</span><span class="photos-count">${n.samples.length}</span></div>
        ${this._renderPhotoGrid(n.samples)}
      </section>`)}</div>`}_renderPhotoGrid(e){let i=this._photosExpanded||e.length<=la,s=i?e:e.slice(0,la),n=e.length-la;return c`<div class="photos-grid">
      ${s.map(o=>this._renderPhotoTile(o,this.samples.findIndex(a=>a.uid===o.uid)))}
      ${i?d:c`<button type="button" class="photo-tile photo-more" @click=${()=>{this._photosExpanded=!0}}>+${n}</button>`}
    </div>`}_catBadge(e){return e.review===null||e.review===e.cat?null:this.cats.find(i=>i.name===e.review)??null}_renderPhotoTile(e,i){let s=e.body??e.face,n=Wr(e),o=this._catBadge(e),a=`Photo ${i+1} of ${this.samples.length}${n?", "+n.text.toLowerCase():""}`;return c`
      <button type="button" class="photo-tile ${n?.kind==="skip"?"dim":""}" aria-label=${a} @click=${()=>{this._viewerIndex=i}}>
        ${s?c`<kibble-image .hass=${this.hass} .asset=${s} .cache=${this.cache} alt=""></kibble-image>`:c`<span class="photo-neutral">${Qe()}</span>`}
        ${n?c`<span class="photo-tag">${n.text}</span>`:d}
        ${o?c`<span class="photo-badge photo-badge-avatar"><kibble-avatar .hass=${this.hass} .name=${o.name} .colorIndex=${o.color??null} .asset=${o.avatar??null} .cache=${this.cache}></kibble-avatar></span>`:d}
        ${this._showBoxes&&e.body&&e.box&&e.crop?c`<kibble-box-overlay .boxes=${this._photoOverlayBoxes(e)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>`:d}
      </button>`}static{this.styles=y`
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
      font-size: 14px;
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
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .close:focus-visible,
    .pager-btn:focus-visible,
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
      border-radius: 8px;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      font: inherit;
      font-size: 16px;
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
      border-radius: 8px;
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


    .ask {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .hint {
      margin: 0;
      font-size: var(--kibble-text-caption, 12px);
      color: var(--secondary-text-color);
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
      font-size: 14px;
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
      border-radius: 8px;
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
      font-size: 16px;
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
    .photo-tag {
      position: absolute;
      left: 4px;
      bottom: 4px;
      max-width: calc(100% - 8px);
      padding: 2px 6px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
    }
    .photo-skeleton {
      aspect-ratio: 1;
      border-radius: 8px;
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
      font-size: 14px;
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
  `}};customElements.define("kibble-label-sheet",pa);var bg=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"limit",selector:{number:{min:1,mode:"box"}}}],gg={device_id:"Kibble device",name:"Name (optional)",limit:"Rows before \u201CShow more\u201D (optional, default 30)"},ua=class extends _{constructor(){super(...arguments);this._computeLabel=e=>gg[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${bg}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():d}_renderFallback(){let e=Object.values(this.hass?.entities??{}),i=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return c`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${i.map(s=>c`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateLimit(e){if(!this._config)return;let i=Number(e);this._config={...this._config,limit:e&&Number.isFinite(i)?i:void 0},this._fireConfigChanged()}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-timeline-card-editor",ua);var _g={deviceId:"",catPresence:[]},Ls=30;function Xp(t,r){let e=r==="follow"?null:r;return{...t,review:e,label:e}}var ha=class extends _{constructor(){super();this._entities=_g;this._timelineFeed=new Ms(()=>this.requestUpdate());this._imageCache=new ye;this._catsQuery=new X(()=>this.requestUpdate());this._detailGeneration=0;this._sheetTrigger=null;this._sentinelRef=T();this._railRef=T();this._sentinelObserver=null;this._observedSentinel=null;this._observedSentinelCapped=null;this._newestKnownUid=null;this._animateUids=new Set;this._sheetPhotoUids=new Set;this._stopReviewListening=null;this._outbox=null;this._unsubscribeOutbox=null;this._onRailScroll=()=>{this._updateEdges()};this._onEventRequested=e=>{this._loadEventDetail(e.detail.uid)};this._onSamplesRetryRequested=()=>{let e=this._sheetSummary?.uid;e&&this._loadEventDetail(e)};this._closeSheet=()=>{let e=Kp(this._sheetPhotoUids.size,this._locale());this._sheetSummary=null,this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetSamplesFailed=!1,this._sheetGroup=[],this._sheetTogether=!1,this._sheetPhotoUids=new Set,this._sheetTrigger?.focus(),this._sheetTrigger=null,e&&this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:e},bubbles:!0,composed:!0}))};this._onSampleAnswer=e=>{let{sampleUid:i,label:s}=e.detail;this._outbox&&(this._outbox.enqueue({kind:"photo",sampleUid:i,label:s}),this._sheetPhotoUids.add(i),this._sheetSamples&&(this._sheetSamples=this._sheetSamples.map(n=>n.uid===i?Xp(n,s):n)))};this._onAteChosen=e=>{let{visitUid:i,ate:s}=e.detail;this._outbox&&(this._outbox.enqueue({kind:"ate",visitUid:i,ate:s}),this._sheetSummary?.uid===i&&(this._sheetSummary={...this._sheetSummary,needs_ate:!1}))};this._loadOlder=()=>{this._timelineFeed.loadMore(this.hass,this._entryId,this._config?.limit??Ls)};this._retryTimeline=()=>{this._timelineFeed.refresh(this.hass,this._entryId,this._config?.limit??Ls)};this._sheetSummary=null,this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetSamplesFailed=!1,this._sheetGroup=[],this._sheetTogether=!1,this._edgeTop=!1,this._edgeBottom=!1}static{this.properties={hass:{attribute:!1},_config:{state:!0},_sheetSummary:{state:!0},_sheetSamples:{state:!0},_sheetSceneSubjects:{state:!0},_sheetSessionCats:{state:!0},_sheetSamplesFailed:{state:!0},_sheetGroup:{state:!0},_sheetTogether:{state:!0},_edgeTop:{state:!0},_edgeBottom:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-timeline-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-timeline-card-editor")}connectedCallback(){super.connectedCallback(),this._stopReviewListening=qt(()=>this._entryId,()=>{this._timelineFeed.refresh(this.hass,this._entryId,this._config?.limit??Ls),this._refreshCats();let e=this._sheetSummary?.uid;e&&this._loadEventDetail(e,!0)})}disconnectedCallback(){super.disconnectedCallback(),this._stopReviewListening?.(),this._stopReviewListening=null,this._unsubscribeOutbox?.(),this._unsubscribeOutbox=null,this._outbox=null,this._imageCache.dispose(),this._timelineFeed.dispose(),this._sentinelObserver?.disconnect(),this._detailGeneration+=1}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=Be(this.hass.entities??{},e),this._entryId=Mt(this.hass.devices??{},e)),this.hass&&this._entryId&&this._joinOutbox(Bt(this.hass,this._entryId)),this._timelineFeed.sync(this.hass,this._entryId,this._config?.limit??Ls);let i=this.hass?.callWS;if(this.hass&&this._entryId&&i&&this._entryId!==this._catsEntryId){this._catsEntryId=this._entryId;let s=this._entryId;this._catsQuery.sync(s,()=>i({type:"kibble/cats",entry_id:s}).then(n=>n))}this._syncAnimation()}_syncAnimation(){let e=this._timelineFeed.state.items;if(!e||e.length===0)return;let i=e[0].uid;if(i===this._newestKnownUid){this._animateUids=new Set;return}let s=new Set;if(this._newestKnownUid!==null)for(let n of e){if(n.uid===this._newestKnownUid)break;s.add(n.uid)}this._animateUids=s,this._newestKnownUid=i}updated(){this._syncSentinel(),this._updateEdges()}_syncSentinel(){let e=this._sentinelRef.value??null,i=qn(this._config?.max_height)!=="";if(!(e===this._observedSentinel&&i===this._observedSentinelCapped)){if(this._sentinelObserver?.disconnect(),this._observedSentinel=e,this._observedSentinelCapped=i,!e){this._sentinelObserver=null;return}this._sentinelObserver=new IntersectionObserver(s=>{s.some(n=>n.isIntersecting)&&this._loadOlder()},{root:i?this._railRef.value:null,rootMargin:"200px"}),this._sentinelObserver.observe(e)}}_updateEdges(){let e=this._railRef.value;if(!e){(this._edgeTop||this._edgeBottom)&&(this._edgeTop=!1,this._edgeBottom=!1);return}let i=e.scrollTop>2,s=e.scrollHeight-e.scrollTop-e.clientHeight>2;i!==this._edgeTop&&(this._edgeTop=i),s!==this._edgeBottom&&(this._edgeBottom=s)}_locale(){return this.hass?.locale?.language??this.hass?.language}_catColor(e){if(!e)return null;let i=this._catsQuery.state.data?.cats.find(s=>s.name===e);return i?W(i.color):xe(e)}render(){if(!this._config||!this.hass)return d;let e=this._timelineFeed.state,i=Sc(e.items??[],Date.now()/1e3),s=Tc(i,new Date),n=e.hasMore,o=!e.error&&!e.loading&&e.items!==null&&s.length===0;return c`
      <ha-card>
        <div class="container">
          ${this._config.name?c`<div class="label">${this._config.name}</div>`:d}
          <kibble-review-entry
            class="review-entry"
            .hass=${this.hass}
            .entryId=${this._entryId}
            .cats=${this._catsQuery.state.data?.cats??[]}
            .cache=${this._imageCache}
            .revision=${e.items}
          ></kibble-review-entry>
          <div class="rail-wrap">
            <div class="rail" style=${qn(this._config.max_height)} @scroll=${this._onRailScroll} ${P(this._railRef)}>
              ${e.error?this._renderError(e.error):d}
              ${o?this._renderEmpty():d}
              ${s.map(a=>this._renderDay(a))}
              ${n?c`<div class="sentinel" ${P(this._sentinelRef)}></div>`:d}
              ${e.loadingMore?c`<p class="loading-more">Loading older events…</p>`:d}
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
        .samplesFailed=${this._sheetSamplesFailed}
        .group=${this._sheetGroup}
        .groupTogether=${this._sheetTogether}
        @close-requested=${this._closeSheet}
        @sample-answer-requested=${this._onSampleAnswer}
        @ate-chosen=${this._onAteChosen}
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
        <div class="day-items">${e.groups.map(i=>this._renderRow(i))}</div>
      </div>
    `}_renderRow(e){let i=e.event,s=e.together===!0,n=fe(e.start??i.start,this._locale()),o=s?"var(--secondary-text-color)":this._catColor(i.cat)??"var(--secondary-text-color)",a=e.events.some(l=>this._animateUids.has(l.uid));return c`
      <div class="row ${a?"row-enter":""}">
        <time class="time">${n}</time>
        <span class="dot-col"><span class="dot" style="--dot-color:${s?this._togetherDotStyle(e.events):o}"></span></span>
        <div class="content">${s?this._renderTogether(e):this._renderKnown(e,o)}</div>
      </div>`}_renderTogether(e){let i=$c(e.events),s=e.start!=null&&e.end!=null?kc(e.start,e.end):null;return c`
      <div class="together-heading">
        <button type="button" class="together-open" aria-label=${i} @click=${n=>this._openSheet(e,n.currentTarget)}>
          <span class="title together-title">${this._renderTogetherTitle(e.events)}</span>
        </button>
      </div>
      ${s?c`<span class="meta">for ${s}</span>`:d}
      ${this._renderTogetherMedia(e)}`}_renderTogetherTitle(e){let i=Qr(e),s=i.map(a=>a.cat?c`<span class="cat-name" style="color:${this._catColor(a.cat)??"var(--secondary-text-color)"}">${a.cat}</span>`:c`<span class="together-unknown-name">Who?</span>`),n=c`${s.map((a,l)=>c`${l===0?d:l===s.length-1?s.length===2?" and ":", and ":", "}${a}`)}`,o=i[0];if(o&&o.kind!=="feed"&&i.every(a=>a.kind===o.kind&&a.open===o.open)){let a=o.open?o.kind==="eat"?"are eating":"are here":Ut(o);return c`${n} ${a}`}return c`${i.map((a,l)=>c`${l?", ":d}${s[l]} ${Ut(a)}`)}`}_togetherDotStyle(e){let i=Qr(e);if(i.length===0)return"var(--secondary-text-color)";let s=100/i.length;return`conic-gradient(${i.map((o,a)=>`${o.cat?this._catColor(o.cat)??"var(--secondary-text-color)":"var(--secondary-text-color)"} ${a*s}% ${(a+1)*s}%`).join(", ")})`}_renderTogetherMedia(e){let i=e.events,s=i.find(l=>l.kind==="eat"&&Gr(l)!==null),n=i.find(l=>l.kind==="eat"&&!!l.clip&&!!l.scene)??i.find(l=>!!l.scene)??i.find(l=>l.kind==="eat"&&!!l.clip)??i.find(l=>l.kind==="eat"&&!!l.thumb)??i.find(l=>!!l.thumb)??e.event,o=i.find(l=>l.scene)?.scene??i.find(l=>l.thumb)?.thumb??null,a={...e,event:n};if(s){let l=Gr(s);if(l){let u={...e,event:s};return o?c`
          <div class="media media-eat">
            ${this._renderPhotoButton(a,o,"photo-tile photo-third")}
            ${this._renderComparePair(u,l,"third")}
          </div>
        `:c`<div class="media media-eat">${this._renderComparePair(u,l,"full")}</div>`}}return c`<div class="media">${this._renderPhotoButton(a,o,"photo-tile photo-visit")}</div>`}_renderKnown(e,i){let s=e.event;return c`
      ${this._renderTitle(e,i)}
      ${this._renderMeta(s)}
      ${this._renderMedia(e,s)}`}_renderTitle(e,i){let s=e.event,n=s.kind==="feed"?c`${Ti(s)}`:s.cat?c`<span class="cat-name" style="color:${i}">${s.cat}</span> ${Ut(s)}`:c`${s.open?s.kind==="eat"?"Someone is eating":"Someone is here":"Who was here?"}`,o=xc(s),a=o?`Who was here? ${fe(s.start,this._locale())}`:`Review ${Yr(s)}, ${fe(s.start,this._locale())}`;return c`<button type="button" class="title-open ${o?"asks":""}" aria-label=${a} @click=${l=>this._openSheet(e,l.currentTarget)}>
      <span class="title-line">
        <span class="title">${n}</span>
        ${o?c`<span class="ask-chevron">${g("chevronRight")}</span>`:d}
        ${s.open?this._renderLiveRing(i):d}
        ${e.events.length>1?c`<span class="count-badge">${Ec(s.kind,e.events.length)}</span>`:d}
      </span></button>`}_renderLiveRing(e){return c`
      <span class="live-badge" style="--dot-color:${e}" aria-label="Happening now">
        <span class="live-core"></span>
        <span class="live-pulse"></span>
      </span>
    `}_renderMeta(e){if(e.kind==="feed")return d;let i=Kr(e);return i?c`<span class="meta">for ${i}</span>`:d}_renderMedia(e,i){let s=Gr(i);if(i.kind==="feed")return s?this._renderComparePair(e,s,"full"):d;let n=yc(i);return i.kind==="eat"&&s?n?c`
        <div class="media media-eat">
          ${this._renderPhotoButton(e,n,"photo-tile photo-third")}
          ${this._renderComparePair(e,s,"third")}
        </div>
      `:c`<div class="media media-eat">${this._renderComparePair(e,s,"full")}</div>`:c`<div class="media">${this._renderPhotoButton(e,n,"photo-tile photo-visit")}</div>`}_renderPhotoButton(e,i,s){let n=e.event,o=n.kind==="eat"&&!!n.clip,a=`View and correct: ${Yr(n)}, ${fe(n.start,this._locale())}${o?". Has video.":""}`;return c`
      <button type="button" class="${s}" aria-label=${a} @click=${l=>this._openSheet(e,l.currentTarget)}>
        ${i?c`<kibble-image .hass=${this.hass} .asset=${i} .cache=${this._imageCache} alt=""></kibble-image>`:c`<span class="neutral-icon">${Qe()}</span>`}
        ${o?c`<span class="clip-badge">${g("play")}</span>`:d}
      </button>
    `}_renderComparePair(e,i,s){let n=`View and correct: ${Yr(e.event)}, ${fe(e.event.start,this._locale())}`;return c`
      <div class="compare-pair ${s==="full"?"compare-full":"compare-third"}">
        <button type="button" class="compare-tile" aria-label=${`${n}. Before.`} @click=${o=>this._openSheet(e,o.currentTarget)}>
          ${i.before?c`<kibble-image .hass=${this.hass} .asset=${i.before} .cache=${this._imageCache} alt=""></kibble-image>`:d}
          <span class="compare-label">Before</span>
        </button>
        <button type="button" class="compare-tile" aria-label=${`${n}. After.`} @click=${o=>this._openSheet(e,o.currentTarget)}>
          ${i.after?c`<kibble-image .hass=${this.hass} .asset=${i.after} .cache=${this._imageCache} alt=""></kibble-image>`:d}
          <span class="compare-label">After</span>
        </button>
      </div>
    `}_refreshCats(){let e=this.hass,i=this._entryId,s=e?.callWS;!s||!i||this._catsQuery.refresh(()=>s({type:"kibble/cats",entry_id:i}).then(n=>n))}_applySheetDetail(e){let i=this._outbox?.pendingPhotoLabels(),s=this._outbox?.entries.some(n=>n.answer.kind==="ate"&&n.answer.visitUid===e.event.uid)??!1;this._sheetSummary=s?{...e.event,needs_ate:!1}:e.event,this._sheetSamples=e.samples.map(n=>{let o=i?.get(n.uid);return o===void 0?n:Xp(n,o)}),this._sheetSceneSubjects=e.scene_subjects,this._sheetSessionCats=e.cats,this._sheetSamplesFailed=!1,this.requestUpdate()}_loadEventDetail(e,i=!1){let s=this._sheetGroup.find(l=>l.uid===e);s&&(this._sheetSummary=s),i||(this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetSamplesFailed=!1);let n=++this._detailGeneration,o=this.hass?.callWS,a=this._entryId;if(!o||!a){this._sheetSamplesFailed=!i;return}o({type:"kibble/event",entry_id:a,uid:e}).then(l=>{n===this._detailGeneration&&this._applySheetDetail(l)}).catch(()=>{n===this._detailGeneration&&(i||(this._sheetSamplesFailed=!0),this.requestUpdate())})}_openSheet(e,i){this._sheetTrigger=i,this._sheetGroup=e.events,this._sheetTogether=e.together===!0,this._sheetPhotoUids=new Set,this._sheetSessionCats=null,this._loadEventDetail(e.event.uid)}_joinOutbox(e){e!==this._outbox&&(this._unsubscribeOutbox?.(),this._outbox=e,this._unsubscribeOutbox=e.subscribe(i=>this._onOutbox(i)))}_onOutbox(e){let i=this._outbox,s=this._sheetSummary?.uid;e.type!=="dropped"||!i||!s||(this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:jr(i.drops)},bubbles:!0,composed:!0})),i.clearDrops(),this._loadEventDetail(s,!0))}static{this.styles=y`
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
    .review-entry {
      margin: 12px 16px 4px;
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
    /* A visit nobody has named: the question is the row's action, so it looks like one. */
    .title-open.asks .title-line {
      display: inline-flex;
      flex-wrap: nowrap;
      gap: 4px;
      padding: 8px 4px 8px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .ask-chevron {
      display: flex;
      font-size: 20px;
      color: var(--secondary-text-color);
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
      border-radius: 8px;
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
      border-radius: 8px;
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
    .compare-tile:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
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
  `}};customElements.define("kibble-timeline-card",ha);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-timeline-card",name:"Kibble Timeline",description:"Today's feeds and who's been by, one calm list, newest first, with real photos.",preview:!0});var Zp={items:null,total:0,pageIndex:0,hasNext:!1,hasPrevious:!1,loading:!1,error:null},ni=class{constructor(r,e){this._type=r;this._onChange=e;this.state=Zp;this._cursors=[null];this._key=null;this._generation=0}sync(r,e,i,s){if(e!==this._key){if(this._key=e,this._cursors=[null],!r?.callWS||!e){this.state=Zp;return}this._load(r,i,s,0,++this._generation)}}refresh(r,e,i){!r?.callWS||!this._key||this._load(r,e,i,this.state.pageIndex,++this._generation)}next(r,e,i){!r?.callWS||this.state.loading||!this.state.hasNext||this._load(r,e,i,this.state.pageIndex+1,this._generation)}previous(r,e,i){!r?.callWS||this.state.loading||this.state.pageIndex===0||this._load(r,e,i,this.state.pageIndex-1,this._generation)}async _load(r,e,i,s,n){this.state={...this.state,loading:!0,error:null},this._onChange();try{let o=this._cursors[s]??null,a={type:this._type,limit:i,...e,...o?{cursor:o}:{}},l=await r.callWS(a);if(n!==this._generation)return;this._cursors[s+1]=l.cursor,this.state={items:l.items,total:l.total,pageIndex:s,hasNext:l.has_more,hasPrevious:s>0,loading:!1,error:null}}catch(o){if(n!==this._generation)return;this.state={...this.state,loading:!1,error:U(o)}}this._onChange()}dispose(){this._generation+=1}};function fa(t){let r=t/1048576;if(r<1e3)return`${r<10?r.toFixed(1):Math.round(r)} MB`;let e=r/1024;return`${e<10?e.toFixed(1):Math.round(e)} GB`}function Jp(t){let r=t.retention_days===1?"1 day":`${t.retention_days} days`;return`Using ${fa(t.used_bytes)}, keeping ${r}`}function eu(t){return t?`Feeder buffer ${fa(t.used_bytes)} of ${fa(t.cap_bytes)}`:null}var vg="cat_recognition",yg={learning:"learning",paused:"paused",learned:"learned"};function xg(t){return t.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function tu(t,r,e){let i=`cat_recognition_${xg(e)}`;for(let s of Object.values(t))if(!(s.device_id!==r||s.disabled_by)&&s.entity_id.startsWith("sensor.")&&s.translation_key===vg&&(s.unique_id?s.unique_id.endsWith(i):s.entity_id.endsWith(`_${i}`)))return s.entity_id}function iu(t,r){if(!r)return null;let e=t.states[r];if(!e||e.state==="unknown"||e.state==="unavailable")return null;let i=Number(e.state);if(!Number.isFinite(i))return null;let s=yg[String(e.attributes.learning_state)]??"learning";return{percent:Math.max(0,Math.min(100,i)),state:s}}var wg={nw:"se",ne:"sw",se:"nw",sw:"ne"},kg={se:{x:1,y:1},sw:{x:-1,y:1},ne:{x:1,y:-1},nw:{x:-1,y:-1}},ru=kn;function ma(t){return Number.isFinite(t.width)&&Number.isFinite(t.height)&&t.width>0&&t.height>0}function Os(t){if(!ma(t))return[0,0,1,1];let{width:r,height:e}=t;if(r===e)return[0,0,1,1];if(r>e){let s=e/r/2;return[.5-s,0,.5+s,1]}let i=r/e/2;return[0,.5-i,1,.5+i]}function su(t,r,e){return Ci(t,r,e)}function nu(t,r,e,i,s=ru){if(!ma(i))return t;let{width:n,height:o}=i,a=Ir(t,wg[r]),l=kg[r],u=Math.abs(e.x-a.x)*n,h=Math.abs(e.y-a.y)*o,p=(l.x>0?1-a.x:a.x)*n,f=(l.y>0?1-a.y:a.y)*o,m=s*Math.min(n,o),b=Math.min(Math.max(u,h,m),p,f),x=ft(a.x+l.x*(b/n)),v=ft(a.y+l.y*(b/o));return ki(a,{x,y:v})}function ou(t,r,e,i=ru){if(!ma(e)||!Number.isFinite(r)||r<=0)return t;let{width:s,height:n}=e,o=(t[0]+t[2])/2,a=(t[1]+t[3])/2,l=i*Math.min(s,n),u=Math.min(s,n),h=Math.min(u,Math.max(l,Ye(t)*s*r)),p=h/s/2,f=h/n/2,m=Math.min(1-p,Math.max(p,o)),b=Math.min(1-f,Math.max(f,a));return[m-p,b-f,m+p,b+f]}function ba(t,r){return Math.hypot(t.x-r.x,t.y-r.y)}var Cg=[0,0,1,1];function $g(t,r,e=1600){let i=Math.max(t,r);if(i<=0||i<=e)return{width:t,height:r};let s=e/i;return{width:Math.max(1,Math.round(t*s)),height:Math.max(1,Math.round(r*s))}}async function au(t){if(typeof createImageBitmap!="function")return null;try{return await createImageBitmap(t,{imageOrientation:"from-image"})}catch{return null}}async function lu(t){if(typeof Image>"u"||typeof URL>"u")return null;let r=URL.createObjectURL(t);try{return await new Promise((e,i)=>{let s=new Image;s.onload=()=>e(s),s.onerror=()=>i(new Error("decode failed")),s.src=r})}catch{return null}finally{URL.revokeObjectURL(r)}}async function Is(t){let r=await au(t)??await lu(t);if(!r)return null;try{let{width:e,height:i}="naturalWidth"in r?{width:r.naturalWidth,height:r.naturalHeight}:{width:r.width,height:r.height};return e>0&&i>0?{width:e,height:i}:null}finally{"close"in r&&r.close()}}async function Hs(t,r=Cg,e=1600){let i=await au(t)??await lu(t);if(!i)return t;try{let{width:s,height:n}="naturalWidth"in i?{width:i.naturalWidth,height:i.naturalHeight}:{width:i.width,height:i.height};if(s<=0||n<=0)return t;let[o,a,l,u]=r,h=Math.min(s-1,Math.max(0,Math.round(o*s))),p=Math.min(n-1,Math.max(0,Math.round(a*n))),f=Math.max(1,Math.round((l-o)*s)),m=Math.max(1,Math.round((u-a)*n)),{width:b,height:x}=$g(f,m,e),v=document.createElement("canvas");v.width=b,v.height=x;let $=v.getContext("2d");return $?($.drawImage(i,h,p,f,m,0,0,b,x),await new Promise(z=>v.toBlob(z,"image/jpeg",.85))??t):t}catch{return t}finally{"close"in i&&i.close()}}function Ds(t,r){return r===t?t.name:`${t.name.replace(/\.[^./\\]+$/,"")||"photo"}.jpg`}var Sg={queued:!0,compressing:!0,uploading:!0,added:!1,duplicate:!1,no_cat:!1,error:!1,canceled:!1},Eg={queued:!1,compressing:!1,uploading:!1,added:!0,duplicate:!0,no_cat:!0,error:!0,canceled:!0},Fs=class{constructor(r,e,i=2){this._handlers=r;this._onChange=e;this._concurrency=i;this._items=new Map;this._order=[];this._controllers=new Map;this._active=0;this._disposed=!1}get items(){return this._order.map(r=>this._items.get(r))}get(r){return this._items.get(r)}enqueue(r){let e=!1;for(let i of r)this._items.has(i)||(this._items.set(i,{id:i,status:"queued",message:null}),this._order.push(i),e=!0);e&&this._onChange()}start(){this._pump()}retry(r){let e=this._items.get(r);!e||e.status!=="error"||(this._items.set(r,{id:r,status:"queued",message:null}),this._onChange(),this._pump())}cancelPending(){let r=!1;for(let e of this._order){let i=this._items.get(e);Sg[i.status]&&(i.status==="queued"?(this._items.set(e,{id:e,status:"canceled",message:null}),r=!0):this._controllers.get(e)?.abort())}r&&this._onChange()}get allSettled(){return this._order.length>0&&this._order.every(r=>Eg[this._items.get(r).status])}tally(){let r={added:0,duplicate:0,no_cat:0,error:0,canceled:0};for(let e of this._items.values())e.status in r&&(r[e.status]+=1);return r}dispose(){this._disposed=!0;for(let r of this._controllers.values())r.abort()}_pump(){if(!this._disposed)for(;this._active<this._concurrency;){let r=this._order.find(e=>this._items.get(e)?.status==="queued");if(!r)return;this._run(r)}}_run(r){let e=new AbortController;this._controllers.set(r,e),this._active++,this._set(r,"compressing",null),this._handlers.compress(r,e.signal).then(i=>(this._set(r,"uploading",null),this._handlers.upload(r,i,e.signal))).then(i=>{this._set(r,i.status,i.message??null)}).catch(i=>{let s=e.signal.aborted||i instanceof DOMException&&i.name==="AbortError";this._set(r,s?"canceled":"error",s?null:i instanceof Error?i.message:"Couldn't upload this photo.")}).finally(()=>{this._controllers.delete(r),this._active--,this._pump()})}_set(r,e,i){this._items.has(r)&&(this._items.set(r,{id:r,status:e,message:i}),this._onChange())}};async function cu(t,r,e,i){if(t.fetchWithAuth)return t.fetchWithAuth(r,{method:"POST",body:e,signal:i});let s=t.auth?.data.access_token;if(!s||!t.hassUrl)throw new Error("Not authenticated.");let n=new Headers({Authorization:`Bearer ${s}`});return fetch(new URL(r,t.hassUrl),{method:"POST",body:e,headers:n,signal:i})}async function du(t,r,e,i,s,n){let o=new FormData;o.append("file",i,s);let a=await cu(t,`/api/kibble/${r}/upload/training/${encodeURIComponent(e)}`,o,n);try{return await a.json()}catch{throw new Error(`Upload failed (${a.status}).`)}}async function pu(t,r,e,i,s,n){let o=new FormData;o.append("file",i,s);let a=await cu(t,`/api/kibble/${r}/upload/avatar/${encodeURIComponent(e)}`,o,n);try{return await a.json()}catch{throw new Error(`Upload failed (${a.status}).`)}}var Tg=["nw","ne","se","sw"],ga=class extends _{constructor(){super();this._stageRef=T();this._pointers=new Map;this._dragCorner=null;this._dragMoveStart=null;this._pinchStart=null;this._resizeObserver=null;this.imageUrl="",this.naturalWidth=0,this.naturalHeight=0,this.crop=[0,0,1,1],this.circleGuide=!1,this.interactive=!0,this.fitParent=!1}static{this.properties={imageUrl:{type:String},naturalWidth:{type:Number},naturalHeight:{type:Number},crop:{attribute:!1},circleGuide:{type:Boolean},interactive:{type:Boolean},fitParent:{type:Boolean}}}connectedCallback(){super.connectedCallback(),this.fitParent&&this.parentElement&&typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(()=>this._applyParentFit()),this._resizeObserver.observe(this.parentElement))}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._resizeObserver=null}updated(e){this.fitParent&&(e.has("naturalWidth")||e.has("naturalHeight"))&&this._applyParentFit()}_applyParentFit(){let e=this.parentElement;if(!e||this.naturalWidth<=0||this.naturalHeight<=0)return;let i=e.clientWidth,s=e.clientHeight;if(i<=0||s<=0)return;let n=Math.min(i/this.naturalWidth,s/this.naturalHeight);this.style.width=`${Math.max(1,this.naturalWidth*n)}px`,this.style.height=`${Math.max(1,this.naturalHeight*n)}px`}_pointToNormalized(e,i){let s=this._stageRef.value?.getBoundingClientRect();return s?He(e,i,s):null}_emitChange(e){this.crop=e,this.dispatchEvent(new CustomEvent("crop-changed",{detail:{crop:e},bubbles:!0,composed:!0}))}_beginPinch(){this._dragCorner=null,this._dragMoveStart=null;let e=[...this._pointers.values()];e.length<2||(this._pinchStart={distance:ba(e[0],e[1]),crop:this.crop})}_capture(e){this._stageRef.value?.setPointerCapture(e.pointerId);let i=this._pointToNormalized(e.clientX,e.clientY);i&&this._pointers.set(e.pointerId,i)}_onHandlePointerDown(e,i){i.preventDefault(),i.stopPropagation(),this._capture(i),this._pointers.size>=2?this._beginPinch():this._dragCorner=e}_onBodyPointerDown(e){if(!this.interactive)return;if(e.preventDefault(),this._capture(e),this._pointers.size>=2){this._beginPinch();return}let i=this._pointToNormalized(e.clientX,e.clientY);i&&(this._dragMoveStart={point:i,crop:this.crop})}_onPointerMove(e){if(!this._pointers.has(e.pointerId))return;let i=this._pointToNormalized(e.clientX,e.clientY);if(!i)return;this._pointers.set(e.pointerId,i);let s={width:this.naturalWidth,height:this.naturalHeight};if(this._pinchStart&&this._pointers.size>=2){let n=[...this._pointers.values()],o=ba(n[0],n[1]);this._pinchStart.distance>0&&this._emitChange(ou(this._pinchStart.crop,o/this._pinchStart.distance,s));return}if(this._dragCorner){this._emitChange(nu(this.crop,this._dragCorner,i,s));return}this._dragMoveStart&&this._emitChange(su(this._dragMoveStart.crop,i.x-this._dragMoveStart.point.x,i.y-this._dragMoveStart.point.y))}_onPointerUp(e){this._pointers.delete(e.pointerId),this._pointers.size<2&&(this._pinchStart=null),this._pointers.size===0&&(this._dragCorner=null,this._dragMoveStart=null)}render(){let[e,i,s,n]=this.crop,o=`left:${e*100}%;top:${i*100}%;width:${(s-e)*100}%;height:${(n-i)*100}%;`,a=this.naturalWidth>0&&this.naturalHeight>0?`${this.naturalWidth} / ${this.naturalHeight}`:"1 / 1";return c`
      <div
        class="stage"
        style="aspect-ratio:${a};cursor:${this.interactive?"move":"default"}"
        ${P(this._stageRef)}
        @pointerdown=${l=>this._onBodyPointerDown(l)}
        @pointermove=${l=>this._onPointerMove(l)}
        @pointerup=${l=>this._onPointerUp(l)}
        @pointercancel=${l=>this._onPointerUp(l)}
      >
        ${this.imageUrl?c`<img src=${this.imageUrl} alt="" draggable="false" />`:d}
        <div class="frame" style=${o}>
          ${this.circleGuide?c`<div class="circle-guide"></div>`:d}
          ${this.interactive?Tg.map(l=>c`<button type="button" class="handle handle-${l}" aria-label="Resize crop" @pointerdown=${u=>this._onHandlePointerDown(l,u)}></button>`):d}
        </div>
      </div>
    `}static{this.styles=y`
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
  `}};customElements.define("kibble-crop-editor",ga);var Pg=["button:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),_a=class extends _{constructor(){super();this._queue=null;this._tileGeneration=0;this._loadedFiles=null;this._closeButtonRef=T();this._keydownHandler=e=>{if(!this.open)return;if(e.key==="Escape"){e.preventDefault(),this._adjustingId?this._adjustingId=null:this._requestClose();return}if(e.key!=="Tab")return;let i=[...this.renderRoot.querySelectorAll(Pg)];if(i.length===0)return;let s=this.renderRoot.querySelector(":focus"),n=s?i.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=i.length)&&(e.preventDefault(),(e.shiftKey?i[i.length-1]:i[0])?.focus())};this.open=!1,this.files=[],this._tiles=[],this._adjustingId=null,this._queueTick=0}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},entryId:{type:String},cat:{type:String},files:{attribute:!1},_tiles:{state:!0},_adjustingId:{state:!0},_queueTick:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),this._disposeTiles(),this._queue?.dispose()}willUpdate(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus(),this.open&&this.files!==this._loadedFiles&&(this._loadedFiles=this.files,this._resetForFiles(this.files))}_disposeTiles(){for(let e of this._tiles)URL.revokeObjectURL(e.objectUrl)}_resetForFiles(e){this._queue?.dispose(),this._queue=null,this._disposeTiles(),this._adjustingId=null;let i=++this._tileGeneration;this._tiles=e.map((s,n)=>({id:`f${n}`,file:s,objectUrl:URL.createObjectURL(s),naturalSize:null,crop:[0,0,1,1]}));for(let s of this._tiles)Is(s.file).then(n=>{i!==this._tileGeneration||!n||(s.naturalSize=n,s.crop=Os(n),this.requestUpdate())})}_removeTile(e){let i=this._tiles.find(s=>s.id===e);i&&URL.revokeObjectURL(i.objectUrl),this._tiles=this._tiles.filter(s=>s.id!==e)}_onCropChanged(e,i){let s=this._tiles.find(n=>n.id===e);s&&(s.crop=i),this.requestUpdate()}_startUpload(){let e=this.hass,i=this.entryId,s=this.cat;if(!e||!i||!s||this._tiles.length===0||this._queue)return;let n=this._tiles,o=new Fs({compress:a=>Hs(n.find(l=>l.id===a).file,n.find(l=>l.id===a).crop),upload:async(a,l,u)=>{let h=n.find(f=>f.id===a),p=await du(e,i,s,l,Ds(h.file,l),u);return{status:p.status,message:p.message}}},()=>{this._queueTick++},2);o.enqueue(n.map(a=>a.id)),o.start(),this._queue=o,this._queueTick++}_requestClose(){this._queue?.cancelPending(),this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}render(){if(!this.open)return d;let e=this._adjustingId?this._tiles.find(i=>i.id===this._adjustingId):void 0;return c`
      <div class="backdrop" role="dialog" aria-modal="true" aria-label="Add photos">
        <div class="sheet">
          <header>
            <span class="title">Add photos${this.cat?c` of ${this.cat}`:d}</span>
            <button type="button" class="close" ${P(this._closeButtonRef)} @click=${()=>this._requestClose()} aria-label="Close">${g("close")}</button>
          </header>
          ${this._tiles.length===0?c`<p class="empty">No photos chosen.</p>`:c`<div class="grid">${this._tiles.map(i=>this._renderTile(i))}</div>`}
          ${this._renderFooter()}
        </div>
        ${e?this._renderAdjust(e):d}
      </div>
    `}_renderTile(e){let i=this._queue?.get(e.id)?.status,s=this._queue?.get(e.id)?.message??null;return c`
      <div class="tile">
        <button type="button" class="tile-photo" aria-label="Adjust crop" ?disabled=${!!this._queue} @click=${()=>{this._adjustingId=e.id}}>
          <kibble-crop-editor .imageUrl=${e.objectUrl} .naturalWidth=${e.naturalSize?.width??0} .naturalHeight=${e.naturalSize?.height??0} .crop=${e.crop} .interactive=${!1}></kibble-crop-editor>
        </button>
        ${this._queue?d:c`<button type="button" class="remove" aria-label="Remove this photo" @click=${()=>this._removeTile(e.id)}>${"\xD7"}</button>`}
        ${i?this._renderTileStatus(e.id,i,s):d}
      </div>
    `}_renderTileStatus(e,i,s){return i==="queued"?d:i==="compressing"||i==="uploading"?c`<span class="tile-badge busy" aria-label="Uploading">${g("refresh")}</span>`:i==="added"?c`<span class="tile-badge added" aria-label="Added">${g("check")}</span>`:i==="duplicate"?c`<span class="tile-badge muted">Duplicate</span>`:i==="no_cat"?c`<span class="tile-badge muted">Not a cat</span>`:i==="canceled"?c`<span class="tile-badge muted">Canceled</span>`:c`
      <span class="tile-badge error" title=${s??"Couldn't upload this photo."}>
        Failed
        <button type="button" @click=${()=>this._queue?.retry(e)}>Retry</button>
      </span>
    `}_renderFooter(){let e=this._queue;if(e&&e.allSettled)return c`
        <div class="footer">
          <p class="tally">${this._tallyPhrase(e.tally())}</p>
          <button type="button" class="primary" @click=${()=>this._requestClose()}>Done</button>
        </div>
      `;if(e){let i=this._tiles.filter(s=>e.get(s.id)?.status!=="queued"&&e.get(s.id)?.status!=="compressing"&&e.get(s.id)?.status!=="uploading").length;return c`<div class="footer"><p class="progress">Adding ${i} of ${this._tiles.length}\u2026</p></div>`}return c`
      <div class="footer">
        <button type="button" class="primary" ?disabled=${this._tiles.length===0} @click=${()=>this._startUpload()}>Add ${this._tiles.length} photo${this._tiles.length===1?"":"s"}</button>
      </div>
    `}_tallyPhrase(e){let i=[];return e.added&&i.push(`${e.added} added`),e.duplicate&&i.push(`${e.duplicate} duplicate${e.duplicate===1?"":"s"}`),e.no_cat&&i.push(`${e.no_cat} not a cat`),e.error&&i.push(`${e.error} failed`),e.canceled&&i.push(`${e.canceled} canceled`),i.length>0?i.join(", "):"Nothing added."}_renderAdjust(e){return c`
      <div class="adjust">
        <div class="adjust-stage">
          <kibble-crop-editor
            .imageUrl=${e.objectUrl}
            .naturalWidth=${e.naturalSize?.width??0}
            .naturalHeight=${e.naturalSize?.height??0}
            .crop=${e.crop}
            .fitParent=${!0}
            @crop-changed=${i=>this._onCropChanged(e.id,i.detail.crop)}
          ></kibble-crop-editor>
        </div>
        <button type="button" class="adjust-done" @click=${()=>{this._adjustingId=null}}>Done</button>
      </div>
    `}static{this.styles=y`
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
      border-radius: 8px;
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
      font-size: 14px;
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
      font-size: 12px;
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
      border-radius: 8px;
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
  `}};customElements.define("kibble-add-photos-sheet",_a);var va=24,Ag=["button:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),ya=class extends _{constructor(){super();this._trainingFeed=new ni("kibble/training",()=>this.requestUpdate());this._uploadObjectUrl="";this._uploadGeneration=0;this._closeButtonRef=T();this._fileInputRef=T();this._keydownHandler=e=>{if(!this.open)return;if(e.key==="Escape"){e.preventDefault(),this._uploadFile?this._cancelUpload():this._requestClose();return}if(e.key!=="Tab")return;let i=[...this.renderRoot.querySelectorAll(Ag)];if(i.length===0)return;let s=this.renderRoot.querySelector(":focus"),n=s?i.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=i.length)&&(e.preventDefault(),(e.shiftKey?i[i.length-1]:i[0])?.focus())};this.open=!1,this.cat=null,this._uploadFile=null,this._uploadNaturalSize=null,this._uploadCrop=[0,0,1,1],this._busy=!1,this._error=null}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},entryId:{type:String},cache:{attribute:!1},cat:{attribute:!1},_uploadFile:{state:!0},_uploadNaturalSize:{state:!0},_uploadCrop:{attribute:!1},_busy:{state:!0},_error:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),this._trainingFeed.dispose(),this._cancelUpload()}willUpdate(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus(),e.has("open")&&!this.open&&(this._cancelUpload(),this._error=null);let i=this.hass,s=this.entryId,n=this.cat;this.open&&i?.callWS&&s&&n&&this._trainingFeed.sync(i,`${s}:${n.name}`,this._feedParams(),va)}_feedParams(){return{entry_id:this.entryId,cat:this.cat?.name}}_requestClose(){this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}_emitChanged(e,i){let s=this.cat;s&&this.dispatchEvent(new CustomEvent("avatar-changed",{detail:{cat:s.name,avatar:e,avatarCustom:i},bubbles:!0,composed:!0}))}async _chooseExisting(e){let i=this.hass,s=this.entryId,n=this.cat;if(!(!i?.callWS||!s||!n||!e||this._busy)){this._busy=!0,this._error=null;try{let o=await i.callWS({type:"kibble/cats/avatar/set",entry_id:s,cat:n.name,asset_id:e.id});this._emitChanged(o.avatar,!0),this._requestClose()}catch(o){this._error=U(o)}finally{this._busy=!1}}}async _onReset(){let e=this.hass,i=this.entryId,s=this.cat;if(!(!e?.callWS||!i||!s||this._busy)){this._busy=!0,this._error=null;try{let n=await e.callWS({type:"kibble/cats/avatar/clear",entry_id:i,cat:s.name});this._emitChanged(n.avatar,!1),this._requestClose()}catch(n){this._error=U(n)}finally{this._busy=!1}}}_onFileChosen(e){let i=e.target,s=i.files?.[0]??null;if(i.value="",!s)return;this._uploadFile=s,this._uploadObjectUrl=URL.createObjectURL(s),this._uploadNaturalSize=null,this._uploadCrop=[0,0,1,1];let n=++this._uploadGeneration;Is(s).then(o=>{n!==this._uploadGeneration||!o||(this._uploadNaturalSize=o,this._uploadCrop=Os(o))})}_cancelUpload(){this._uploadObjectUrl&&URL.revokeObjectURL(this._uploadObjectUrl),this._uploadObjectUrl="",this._uploadFile=null,this._uploadNaturalSize=null}async _confirmUpload(){let e=this.hass,i=this.entryId,s=this.cat,n=this._uploadFile;if(!(!e||!i||!s||!n||this._busy)){this._busy=!0,this._error=null;try{let o=await Hs(n,this._uploadCrop),a=await pu(e,i,s.name,o,Ds(n,o),new AbortController().signal);if(a.error||!a.avatar){this._error=a.error??"Couldn't save that photo.";return}this._emitChanged(a.avatar,!0),this._requestClose()}catch(o){this._error=o instanceof Error?o.message:"Couldn't save that photo."}finally{this._busy=!1}}}render(){let e=this.cat;return!this.open||!e?d:c`
      <div class="backdrop" role="dialog" aria-modal="true" aria-label=${`Change ${e.name}'s picture`}>
        <div class="sheet">
          <header>
            <span class="title">Change picture</span>
            <button type="button" class="close" ${P(this._closeButtonRef)} @click=${()=>this._requestClose()} aria-label="Close">${g("close")}</button>
          </header>
          ${this._uploadFile?this._renderUploadAdjust():this._renderGrid(e)}
          ${this._error?c`<p class="error">${this._error}</p>`:d}
        </div>
      </div>
    `}_renderGrid(e){let i=this._trainingFeed.state;return c`
      <input type="file" accept="image/*" hidden ${P(this._fileInputRef)} @change=${s=>this._onFileChosen(s)} />
      <div class="grid">
        <button type="button" class="tile upload-tile" ?disabled=${this._busy} @click=${()=>this._fileInputRef.value?.click()}>Upload</button>
        ${(i.items??[]).map(s=>this._renderSampleTile(e,s))}
      </div>
      ${i.error?c`<p class="error">${i.error}</p>`:d}
      ${i.items&&i.items.length===0?c`<p class="empty">No training photos yet -- upload one instead.</p>`:d}
      ${this._renderPager(i)}
      ${e.avatar_custom?c`<button type="button" class="reset" ?disabled=${this._busy} @click=${()=>this._onReset()}>Reset to automatic</button>`:d}
    `}_renderSampleTile(e,i){let s=i.body??i.face,n=!!(s&&e.avatar?.id===s.id);return c`
      <button type="button" class="tile photo-tile ${n?"current":""}" ?disabled=${this._busy||!s} aria-label="Use this photo" @click=${()=>this._chooseExisting(s)}>
        ${s?c`<kibble-image .hass=${this.hass} .asset=${s} .cache=${this.cache} alt=""></kibble-image>`:d}
      </button>
    `}_renderPager(e){return e.items===null||!e.hasNext&&!e.hasPrevious?d:c`
      <div class="pager">
        <button type="button" ?disabled=${!e.hasPrevious||e.loading} @click=${()=>this._trainingFeed.previous(this.hass,this._feedParams(),va)}>Previous</button>
        <button type="button" ?disabled=${!e.hasNext||e.loading} @click=${()=>this._trainingFeed.next(this.hass,this._feedParams(),va)}>Next</button>
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
            @crop-changed=${i=>{this._uploadCrop=i.detail.crop}}
          ></kibble-crop-editor>
        </div>
        <div class="adjust-actions">
          <button type="button" class="secondary" ?disabled=${this._busy} @click=${()=>this._cancelUpload()}>Back</button>
          <button type="button" class="primary" ?disabled=${this._busy} @click=${()=>this._confirmUpload()}>Use this photo</button>
        </div>
      </div>
    `}static{this.styles=y`
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
      border-radius: 8px;
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
      border-radius: 8px;
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
  `}};customElements.define("kibble-avatar-picker",ya);var Rg=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}}],Mg={device_id:"Kibble device",name:"Name (optional)"},xa=class extends _{constructor(){super(...arguments);this._computeLabel=e=>Mg[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${Rg}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():d}_renderFallback(){let e=Object.values(this.hass?.entities??{}),i=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return c`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${i.map(s=>c`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-cats-card-editor",xa);var Lg={deviceId:"",catPresence:[]},rt=24,Og=3e3,Ig={learning:"still learning",paused:"learning paused",learned:"learned"},wa=class extends _{constructor(){super();this._entities=Lg;this._catsQuery=new X(()=>this.requestUpdate(),{retry:ct,timeoutMs:dt});this._trainingFeeds=new Map;this._imageCache=new ye;this._stopReviewListening=null;this._onCatMenuFocusOut=e=>{let i=e.currentTarget,s=e.relatedTarget;(!s||!i.contains(s))&&this._closeCatMenu()};this._onCatMenuKeydown=e=>{if(e.key!=="Escape")return;let i=e.currentTarget.querySelector(".cat-menu-trigger");this._closeCatMenu(),i?.focus()};this._onAvatarChanged=e=>{let{cat:i,avatar:s,avatarCustom:n}=e.detail;this._catsQuery.patch(o=>({...o,cats:o.cats.map(a=>a.name===i?{...a,avatar:s,avatar_custom:n}:a)}))};this._addName="",this._addBusy=!1,this._addError=null,this._actionError=null,this._openMenuFor=null,this._deleteConfirmFor=null,this._expandedTraining=null,this._addPhotosOpen=!1,this._addPhotosCat=null,this._addPhotosFiles=[],this._avatarPickerCat=null}static{this.properties={hass:{attribute:!1},_config:{state:!0},_addName:{state:!0},_addBusy:{state:!0},_addError:{state:!0},_actionError:{state:!0},_openMenuFor:{state:!0},_deleteConfirmFor:{state:!0},_expandedTraining:{state:!0},_addPhotosOpen:{state:!0},_addPhotosCat:{state:!0},_addPhotosFiles:{state:!0},_avatarPickerCat:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Cats card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 8}static getStubConfig(e){return{type:"custom:kibble-cats-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-cats-card-editor")}connectedCallback(){super.connectedCallback(),this._catsQuery.retryNow(),this._stopReviewListening=qt(()=>this._entryId,()=>{this._refreshCats();let e=this._expandedTraining;e&&this._trainingFeed(e).refresh(this.hass,{entry_id:this._entryId,cat:e},rt)})}disconnectedCallback(){super.disconnectedCallback(),this._stopReviewListening?.(),this._stopReviewListening=null,this._catsQuery.dispose(),this._imageCache.dispose();for(let e of this._trainingFeeds.values())e.dispose();clearTimeout(this._deleteConfirmTimer)}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=Be(this.hass.entities??{},e),this._entryId=Mt(this.hass.devices??{},e));let i=this.hass?.callWS,s=this._entryId;if(this.hass&&s&&i&&(this._catsQuery.sync(s,()=>i({type:"kibble/cats",entry_id:s}).then(n=>n)),this._expandedTraining)){let n=this._expandedTraining;this._trainingFeed(n).sync(this.hass,`${s}:${n}`,{entry_id:s,cat:n},rt)}}_trainingFeed(e){let i=this._trainingFeeds.get(e);return i||(i=new ni("kibble/training",()=>this.requestUpdate()),this._trainingFeeds.set(e,i)),i}render(){if(!this._config||!this.hass)return d;let e=this._catsQuery.state.data?.cats??[],i=this._catsQuery.state.data?.storage??null,s=i?eu(i.device_spool):null;return c`
      <ha-card>
        <div class="container">
          ${this._config.name?c`<div class="label">${this._config.name}</div>`:d}
          ${this._actionError?this._renderActionError():d}
          ${this._catsQuery.state.reconnecting?c`<p class="storage-line" role="status"><span>Reconnecting\u2026</span></p>`:d}
          <section class="roster">
            ${this._renderRosterBody(e)}
            ${this._renderAddCat()}
          </section>
          ${this._expandedTraining?this._renderTrainingPanel(this._expandedTraining):d}
          ${e.length>0?c`
                <kibble-review-entry .hass=${this.hass} .entryId=${this._entryId} .cats=${e} .cache=${this._imageCache} .revision=${this._catsQuery.state.data}></kibble-review-entry>
                <kibble-learning-line summary .hass=${this.hass} .entryId=${this._entryId}></kibble-learning-line>
              `:d}
          ${i?c`
                <p class="storage-line">
                  <span>${Jp(i)}</span>
                  ${s?c`<span class="quiet">${s}</span>`:d}
                </p>
              `:d}
        </div>
      </ha-card>
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
    `}_renderRosterBody(e){let{data:i,error:s}=this._catsQuery.state;return i===null?s?c`<div class="error"><span>Couldn\u2019t load your cats.</span><button type="button" @click=${()=>this._catsQuery.retryNow()}>Try again</button></div>`:c`<p class="empty">Loading your cats\u2026</p>`:e.length===0?c`<p class="empty">No cats yet. Add one to start training.</p>`:c`<div class="cat-list">${e.map(n=>this._renderCatTile(n))}</div>`}_renderActionError(){let e=this._actionError;return e?c`
      <div class="error">
        <span>${e.message}</span>
        <button
          type="button"
          @click=${()=>{this._actionError=null,e.retry()}}
        >
          Try again
        </button>
      </div>
    `:d}_renderCatTile(e){let i=new Date,s=e.last_seen!=null?`Seen ${Lt(new Date(e.last_seen*1e3),i)}`:"Not seen yet",n=`${e.meals_today} ${e.meals_today===1?"meal":"meals"} today`,o=e.training.total===0?"Not trained yet":`${e.training.total} ${e.training.total===1?"photo":"photos"} trained`,a=this._config?.device_id,l=this.hass&&a?tu(this.hass.entities??{},a,e.name):void 0,u=this.hass?iu(this.hass,l):null;return c`
      <div class="cat-tile">
        <kibble-avatar class=${e.present?"present":""} .hass=${this.hass} .name=${e.name} .colorIndex=${e.color} .asset=${e.avatar} .cache=${this._imageCache}></kibble-avatar>
        <div class="cat-text">
          <span class="cat-name">${e.name}</span>
          <span class="cat-meta">${s}, ${n}</span>
          <span class="cat-meta quiet">${o}</span>
          ${u?c`
                <div class="learning-row">
                  <span class="learning-track" aria-hidden="true"><span class="learning-fill" style="width:${u.percent}%"></span></span>
                </div>
                <span class="learning-state">${u.percent}% recognized, ${Ig[u.state]}</span>
              `:d}
        </div>
        <div class="cat-menu" @focusout=${this._onCatMenuFocusOut} @keydown=${this._onCatMenuKeydown}>
          <button
            type="button"
            class="cat-menu-trigger"
            aria-haspopup="menu"
            aria-label=${`Options for ${e.name}`}
            @click=${()=>this._toggleCatMenu(e.name)}
          >
            ${g("dotsVertical")}
          </button>
          ${this._openMenuFor===e.name?this._renderCatMenu(e):d}
        </div>
      </div>
    `}_renderCatMenu(e){let i=this._deleteConfirmFor===e.name,s=this._expandedTraining===e.name;return c`
      <div class="menu" role="menu">
        <button type="button" role="menuitem" @click=${()=>this._openAvatarPicker(e.name)}>Change picture</button>
        <button type="button" role="menuitem" @click=${()=>this._toggleTraining(e.name)}>${s?"Hide training photos":`View training (${e.training.total})`}</button>
        <button type="button" role="menuitem" class="danger ${i?"confirming":""}" @click=${()=>this._onDeleteCatClick(e.name)}>
          ${i?"Tap again to delete":"Delete cat\u2026"}
        </button>
      </div>
    `}_toggleCatMenu(e){this._openMenuFor=this._openMenuFor===e?null:e}_closeCatMenu(){this._openMenuFor=null,clearTimeout(this._deleteConfirmTimer),this._deleteConfirmFor=null}_toggleTraining(e){this._openMenuFor=null,this._expandedTraining=this._expandedTraining===e?null:e}_openAvatarPicker(e){this._openMenuFor=null,this._avatarPickerCat=e}_closeAvatarPicker(){this._avatarPickerCat=null,this._refreshCats()}_onDeleteCatClick(e){if(this._deleteConfirmFor===e){clearTimeout(this._deleteConfirmTimer),this._deleteConfirmFor=null,this._openMenuFor=null,this._deleteCat(e);return}this._deleteConfirmFor=e,this._deleteConfirmTimer=setTimeout(()=>{this._deleteConfirmFor=null,this.requestUpdate()},Og)}_deleteCat(e){let i=this._callWS("kibble/cats/delete",{name:e});i&&i.then(()=>{this._trainingFeeds.delete(e),this._expandedTraining===e&&(this._expandedTraining=null),this._refreshCats()}).catch(s=>{this._actionError={message:`Couldn't delete ${e}. ${U(s)}`,retry:()=>this._deleteCat(e)}})}_renderAddCat(){return c`
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
        ${this._addError?c`<span class="inline-error">${this._addError}</span>`:d}
      </form>
    `}async _onAddCatSubmit(e){e.preventDefault();let i=this._addName.trim(),s=i?this._callWS("kibble/cats/add",{name:i}):null;if(s){this._addBusy=!0,this._addError=null;try{await s,this._addName="",this._refreshCats()}catch(n){this._addError=U(n)}finally{this._addBusy=!1}}}_renderTrainingPanel(e){let i=this._trainingFeed(e),s=i.state;return c`
      <section class="training">
        <div class="training-heading">
          <span>${e}\u2019s training photos${s.items!==null?` (${s.total})`:""}</span>
          <button type="button" class="icon-button" aria-label="Close training photos" @click=${()=>this._toggleTraining(e)}>${g("close")}</button>
        </div>
        <div class="training-actions">
          <button type="button" class="add-photos-button" @click=${()=>this._openAddPhotos(e)}>Add photos</button>
        </div>
        ${s.error?this._renderPagedError(s.error,()=>i.refresh(this.hass,{entry_id:this._entryId,cat:e},rt)):d}
        ${s.items&&s.items.length===0?c`<p class="empty">No training photos yet.</p>`:d}
        <div class="training-grid">${(s.items??[]).map(n=>this._renderTrainingTile(e,n))}</div>
        ${this._renderPager(s,rt,()=>i.previous(this.hass,{entry_id:this._entryId,cat:e},rt),()=>i.next(this.hass,{entry_id:this._entryId,cat:e},rt))}
      </section>
    `}_renderTrainingTile(e,i){let s=new Date(i.created*1e3).toLocaleDateString();return c`
      <div class="training-tile">
        <span class="training-crops">
          ${i.body?c`<kibble-image .hass=${this.hass} .asset=${i.body} .cache=${this._imageCache} alt=""></kibble-image>`:d}
          ${i.face?c`<kibble-image .hass=${this.hass} .asset=${i.face} .cache=${this._imageCache} alt=""></kibble-image>`:d}
        </span>
        <button type="button" class="remove" aria-label=${`Remove this training photo of ${e}, added ${s}`} @click=${()=>this._removeTraining(e,i.uid)}>
          ${g("close")}
        </button>
      </div>
    `}_removeTraining(e,i){let s=this._callWS("kibble/training/remove",{uids:[i]});s&&s.then(()=>{this._trainingFeed(e).refresh(this.hass,{entry_id:this._entryId,cat:e},rt),this._refreshCats()}).catch(n=>{this._actionError={message:`Couldn't remove this photo. ${U(n)}`,retry:()=>this._removeTraining(e,i)}})}_openAddPhotos(e){this._addPhotosCat=e,this.renderRoot.querySelector(".add-photos-file-input")?.click()}_onAddPhotosChosen(e){let i=e.target,s=i.files?[...i.files]:[];i.value="",s.length!==0&&(this._addPhotosFiles=s,this._addPhotosOpen=!0)}_closeAddPhotos(){this._addPhotosOpen=!1;let e=this._addPhotosCat;this._refreshCats(),e&&this._expandedTraining===e&&this._trainingFeed(e).refresh(this.hass,{entry_id:this._entryId,cat:e},rt)}_renderPager(e,i,s,n){if(e.items===null||!e.hasNext&&!e.hasPrevious)return d;let o=e.pageIndex*i+1,a=e.pageIndex*i+e.items.length;return c`
      <div class="pager">
        <button type="button" ?disabled=${!e.hasPrevious||e.loading} @click=${s}>Previous</button>
        <span>${o}\u2013${a} of ${e.total}</span>
        <button type="button" ?disabled=${!e.hasNext||e.loading} @click=${n}>Next</button>
      </div>
    `}_renderPagedError(e,i){return c`
      <div class="error">
        <span>${e}</span>
        <button type="button" @click=${i}>Try again</button>
      </div>
    `}_refreshCats(){let e=this.hass?.callWS,i=this._entryId;!e||!i||this._catsQuery.refresh(()=>e({type:"kibble/cats",entry_id:i}).then(s=>s))}_callWS(e,i){let s=this.hass?.callWS,n=this._entryId;return!s||!n?null:s({type:e,entry_id:n,...i}).then(o=>o)}static{this.styles=y`
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
    .learning-state {
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
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
    .training-heading {
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
      min-height: 48px;
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
      width: 48px;
      height: 48px;
      font-size: 20px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .training-grid {
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
      top: 4px;
      right: 4px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    /* The round button is small on the photo; this keeps its tap target at 44px. */
    .remove::after {
      content: "";
      position: absolute;
      inset: -8px;
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
  `}};customElements.define("kibble-cats-card",wa);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-cats-card",name:"Kibble Cats",description:"Enrolled cats, presence, and the review queue for whatever the feeder couldn't name.",preview:!0});var Hg={deviceId:"",catPresence:[]},ka=class extends _{constructor(){super(...arguments);this._entities=Hg}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble schedule card: `device_id` is required.");this._config=e}getCardSize(){return 4}static getStubConfig(e){return{type:"custom:kibble-schedule-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDeviceId=e,this._entities=Be(this.hass.entities??{},e))}render(){if(!this._config||!this.hass)return d;let e=this._entities,i=this.hass.states,s=e.schedule?i[e.schedule]:void 0,n=e.hopperDivider!=null&&i[e.hopperDivider]?.state==="off";return c`
      <ha-card>
        ${!s||s.state==="unavailable"?c`<p class="unavailable">The schedule is unavailable right now</p>`:c`<kibble-schedule-body
              .hass=${this.hass}
              .entries=${ur(s)}
              .scheduleCardStateEntity=${e.scheduleCardState}
              .singleHopper=${n}
              .deviceId=${e.deviceId}
              .food1=${e.hopperFood1?Ht(i[e.hopperFood1]):null}
              .food2=${e.hopperFood2?Ht(i[e.hopperFood2]):null}
            ></kibble-schedule-body>`}
      </ha-card>
    `}static{this.styles=y`
    :host {
      display: block;
      /* The tokens the schedule editor draws with; the hero sets the same ones on its own host. */
      --kibble-feed: ${K(fr)};
      --kibble-ink-on-feed: ${K(mr)};
      --kibble-amber-dark: ${K(br)};
      --kibble-touch-target: 48px;
      --kibble-schedule-size: 14px;
    }
    ha-card {
      display: block;
      padding: 8px 16px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .unavailable {
      margin: 8px 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-schedule-size, 14px);
    }
  `}};customElements.define("kibble-schedule-card",ka);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-schedule-card",name:"Kibble Schedule",description:"The feeding schedule, already open: per-hopper amounts with the divider fitted. For a dashboard pop-up.",preview:!0});var Fg={deviceId:"",catPresence:[]},uu=[1,2,3,4,5],zg=uu.map(t=>({value:String(t),label:String(t)})),Ng=`
  .bubble-button-card-container { background: var(--kibble-feed, #43a96a) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: var(--kibble-ink-on-amber, #241a07) !important; }
  .bubble-icon-container { background: color-mix(in srgb, var(--kibble-ink-on-amber, #241a07) 12%, transparent) !important; }
`;function jg(t,r){return`
  .bubble-button-card-container { height: var(--kibble-touch-target, 48px) !important; ${t?"background: var(--kibble-feed, #43a96a) !important;":""} ${r?"opacity: 0.5;":""} }
  .bubble-button-card { padding: 0 !important; }
  .bubble-name-container { margin: 0 !important; width: 100%; justify-content: center; }
  .bubble-name { width: 100%; justify-content: center; text-align: center; font-size: 17px; font-weight: 600; ${t?"color: var(--kibble-ink-on-amber, #241a07) !important;":""} }
`}var qg=`
  .bubble-button-card-container { background: var(--error-color, #d9534f) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: #fff !important; }
`,Ca=class extends _{constructor(){super();this._entities=Fg;this._wasFeedingForRequest=!1;this._timelineGeneration=0;this._timelineQuery=new X(()=>this.requestUpdate());this._imageCache=new ye;this._catsQuery=new X(()=>this.requestUpdate());this._calibrationQuery=new X(()=>this.requestUpdate());this._calibrationGeneration=0;this._calibrationOpen=!1;this._detectionAreasOpen=!1;this._hopperSheetOpen=!1;this._onBubbleAction=e=>{let i=e.detail,s=i?.config?.[`${i.action}_action`];s?.action!=="fire-dom-event"||!s.kibble||(e.stopPropagation(),s.kibble==="portion"&&typeof s.portion=="number"&&this._entities.feedAmount?this.hass.callService("number","set_value",{value:s.portion},{entity_id:this._entities.feedAmount}):s.kibble==="feed"?this._onFeedActivate():s.kibble==="cancel"?this._onCancelActivate():s.kibble==="calibrate"&&(this._calibrationOpen=!0))};this._onHopper1PortionSelected=e=>{this._setHopperPortion(this._entities.feedAmountHopper1,e)};this._onHopper2PortionSelected=e=>{this._setHopperPortion(this._entities.feedAmountHopper2,e)};this._onFeedActivate=async()=>{if(!this._entities.deviceId||this._feedRequest.phase==="requesting")return;let i=this._singleHopper()?{hopper:"both",amount:this._numberState(this._entities.feedAmount)??1}:Tl(this._numberState(this._entities.feedAmountHopper1)??0,this._numberState(this._entities.feedAmountHopper2)??0);if(i){this._clearFeedRequestTimeoutTimer(),this._clearFeedErrorTimer(),this._feedError=null,this._feedRequest=Al(),this._armFeedRequestTimeout(),this._pourSource=i.hopper;try{await this.hass.callService("kibble","feed",{device_id:this._entities.deviceId,hopper:i.hopper,amount:i.amount,...i.amount2!==void 0?{amount2:i.amount2}:{}})}catch{this._clearFeedRequestTimeoutTimer(),this._feedRequest=dn(),this._pourSource=null,this._feedError="Try hold again",this._resetFeedErrorAfter(5e3)}}};this._onCancelActivate=()=>{this._entities.deviceId&&this.hass.callService("kibble","cancel_feed",{device_id:this._entities.deviceId})};this._openSettings=()=>{this._notifyHeroActivity();let e=this._config?.settings_hash;if(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}));return}this._settingsOpen=!0};this._notifyHeroActivity=()=>{this.renderRoot.querySelector("kibble-live-hero")?.notifyActivity()};this._onHeroOverlayIdleChanged=e=>{this._heroControlsVisible=e.detail.visible};this._onMediaAspectChanged=e=>{let i=e.detail?.ratio;!Number.isFinite(i)||i<=0||this.renderRoot.querySelector(".hero")?.style.setProperty("--kibble-hero-aspect",String(i))};this._closeSettings=()=>{this._settingsOpen=!1};this._onHashChange=()=>{let e=cn(window.location.hash,this._config);e==="calibrate"&&(this._calibrationOpen=!0),e==="detection-areas"&&(this._detectionAreasOpen=!0)};this._closeCalibration=e=>{e.stopPropagation(),this._calibrationOpen=!1,this._clearPopupHash()};this._closeDetectionAreas=e=>{e.stopPropagation(),this._detectionAreasOpen=!1,this._clearPopupHash()};this._openHopperSheet=()=>{this._hopperSheetOpen=!0};this._closeHopperSheet=e=>{e.stopPropagation(),this._hopperSheetOpen=!1};this._onCalibrationChanged=()=>{this._calibrationGeneration+=1,this.requestUpdate()};this._settingsOpen=!1,this._bubble=!1,this._feedRequest=$r,this._feedError=null,this._pourSource=null,this._heroControlsVisible=!0,Wp().then(e=>{this._bubble=e})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_settingsOpen:{state:!0},_calibrationOpen:{state:!0},_detectionAreasOpen:{state:!0},_hopperSheetOpen:{state:!0},_bubble:{state:!0},_feedRequest:{state:!0},_feedError:{state:!0},_pourSource:{state:!0},_heroControlsVisible:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-card-editor")}connectedCallback(){super.connectedCallback(),window.addEventListener("hashchange",this._onHashChange),window.addEventListener("location-changed",this._onHashChange),this._onHashChange(),this._resizeObserver=new ResizeObserver(e=>{let i=e[0]?.contentRect,s=i?.height??this.getBoundingClientRect().height,n=i?.width??this.getBoundingClientRect().width;this.classList.toggle("kiosk",s>=440),this.classList.toggle("compact",n<640&&s>0&&s<=520)}),this._resizeObserver.observe(this)}disconnectedCallback(){window.removeEventListener("hashchange",this._onHashChange),window.removeEventListener("location-changed",this._onHashChange),this._clearFeedRequestTimeoutTimer(),this._clearFeedErrorTimer(),super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._imageCache.dispose()}willUpdate(){let e=this._config?.device_id;this.classList.toggle("dual-hopper",this.hass?!this._singleHopper():!1),this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=Be(this.hass.entities??{},e),this._entryId=Mt(this.hass.devices??{},e));let i=this.hass?.callWS;if(this.hass&&this._entryId&&i&&this._entities.lastSeenPet){let s=this._entryId;this._catsQuery.sync(Za(this.hass,[this._entities.lastSeenPet]),()=>i({type:"kibble/cats",entry_id:s}).then(n=>n))}if(this.hass&&this._entryId&&i&&this._entities.bowlFill){let s=this._entryId;this._calibrationQuery.sync(`${s}:${this._calibrationGeneration}`,()=>i({type:"kibble/calibration",entry_id:s}).then(n=>n))}if(this.hass&&this._entities.feeding){let s=this.hass.states[this._entities.feeding]?.state==="on";s!==this._wasFeedingForRequest&&(this._wasFeedingForRequest=s,this._feedRequest=Ml(this._feedRequest,s),s?(this._clearFeedRequestTimeoutTimer(),this._feedError=null):this._pourSource=null,this._timelineGeneration+=1)}if(this.hass&&this._entryId&&i){let s=this._entryId;this._timelineQuery.sync(`${s}:${this._timelineGeneration}`,()=>i({type:"kibble/timeline",entry_id:s,limit:5}).then(n=>n))}}render(){if(!this._config||!this.hass)return d;let e=this._entities,i=e.feeding?this.hass.states[e.feeding]?.state:void 0,n=[e.feeding,e.bowlFill,e.schedule].filter(ce=>!!ce).map(ce=>this.hass.states[ce]?.state),o=Qa(n,i),a=i==="on",l=this._numberState(e.bowlFill),u=e.bowlFill?this.hass.states[e.bowlFill]?.attributes?.source??null:null,h=bl(this._calibrationQuery.state.data),p=sn(e.hopperLevel1&&this.hass.states[e.hopperLevel1]?.state),f=sn(e.hopperLevel2&&this.hass.states[e.hopperLevel2]?.state),m=e.hopperRemaining1?nn(this.hass.states[e.hopperRemaining1]):null,b=e.hopperRemaining2?nn(this.hass.states[e.hopperRemaining2]):null,x=this._singleHopper(),v=e.hopperFood1?Ht(this.hass.states[e.hopperFood1]):null,$=e.hopperFood2?Ht(this.hass.states[e.hopperFood2]):null,D=this._scheduleEntries(),z=this._numberState(e.feedAmount)??1,R=this._numberState(e.feedAmountHopper1)??0,V=this._numberState(e.feedAmountHopper2)??0,G=x?z:R+V,w=this._heroOverlay(o),E=this._feedError??(this._feedRequest.phase==="requesting"?"Requesting\u2026":"Hold to feed"),L=a?"Feeding":E,j=!x&&R===0&&V===0,N=o==="unreachable"||!a&&this._feedRequest.phase==="requesting"||j,Et=!a&&this._feedRequest.phase==="requesting",ae=this.hass.themes?.darkMode===!0,le=Pl(this._timelineQuery.state.data?.items??[],x);return c`
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
                <span class="live-dot" ?hidden=${!w.live}></span>
                ${w.catName?c`<kibble-avatar
                      .hass=${this.hass}
                      .name=${w.catName}
                      .colorIndex=${w.colorIndex}
                      .asset=${w.avatarAsset}
                      .cache=${this._imageCache}
                    ></kibble-avatar>`:d}
                <span class="hero-status-text" data-tone=${w.tone}>${w.text}</span>
              </div>
              <div class="hero-review">
                <kibble-review-entry
                  variant="chip"
                  .hass=${this.hass}
                  .entryId=${this._entryId}
                  .cats=${this._catsQuery.state.data?.cats??[]}
                  .cache=${this._imageCache}
                  .revision=${this._timelineQuery.state.data}
                ></kibble-review-entry>
              </div>
              <button
                class="gear-button ${this._heroControlsVisible?"":"idle-hidden"}"
                aria-label="Settings"
                @click=${this._openSettings}
                @focus=${this._notifyHeroActivity}
              >
                ${g("cog")}
              </button>
              ${this._config.name?c`<div class="name-chip">${this._config.name}</div>`:d}
            </div>
            <div class="side">
            <div class="panel">
            <kibble-bowl
              class="bowl-art"
              .fill=${l}
              .fillSource=${u}
              .calibration=${h}
              .hopperLevel1=${p}
              .hopperLevel2=${f}
              .hopperRemaining1=${m}
              .hopperRemaining2=${b}
              .singleHopper=${x}
              .food1=${v}
              .food2=${$}
              .feeding=${a}
              .portions=${G}
              .darkMode=${ae}
              .bowlMix=${le}
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
              ${x?c`
                    <kibble-segmented-picker
                      class="picker-full"
                      .value=${String(z)}
                      .options=${zg}
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
                      <span class="hopper-row-label">${v??"Hopper 1"}</span>
                      <kibble-stepper
                        .value=${R}
                        .min=${0}
                        .max=${5}
                        aria-label="${v??"Hopper 1"} portions"
                        ?disabled=${o==="unreachable"||a}
                        @value-selected=${this._onHopper1PortionSelected}
                      ></kibble-stepper>
                    </div>
                    <div class="hopper-row">
                      <span class="hopper-row-label">${$??"Hopper 2"}</span>
                      <kibble-stepper
                        .value=${V}
                        .min=${0}
                        .max=${5}
                        aria-label="${$??"Hopper 2"} portions"
                        ?disabled=${o==="unreachable"||a}
                        @value-selected=${this._onHopper2PortionSelected}
                      ></kibble-stepper>
                    </div>
                  `}
              <kibble-hold-button
                .label=${L}
                .variant=${a?"cancel":"feed"}
                ?disabled=${N}
                ?pending=${Et}
                @activate=${a?this._onCancelActivate:this._onFeedActivate}
              ></kibble-hold-button>
            </div>
            </div>
            ${this._config.schedule_hash?d:c`<kibble-schedule-summary
                  class="schedule-row"
                  .hass=${this.hass}
                  .entries=${D}
                  .scheduleCardStateEntity=${e.scheduleCardState}
                  .singleHopper=${x}
                  .deviceId=${e.deviceId}
                  .food1=${v}
                  .food2=${$}
                ></kibble-schedule-summary>`}
            </div>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog
        .hass=${this.hass}
        .entities=${e}
        .entryId=${this._entryId}
        .singleHopper=${x}
        .food1=${v}
        .food2=${$}
        ?open=${this._settingsOpen}
        @close-requested=${this._closeSettings}
        @calibration-changed=${this._onCalibrationChanged}
      ></kibble-settings-dialog>
      <kibble-hopper-sheet
        .hass=${this.hass}
        .entities=${e}
        ?open=${this._hopperSheetOpen}
        .hopperLevel1=${p}
        .hopperLevel2=${f}
        .hopperRemaining1=${m}
        .hopperRemaining2=${b}
        .singleHopper=${x}
        .food1=${v}
        .food2=${$}
        @close-requested=${this._closeHopperSheet}
      ></kibble-hopper-sheet>
      <kibble-calibration-dialog
        .hass=${this.hass}
        .entryId=${this._entryId}
        .singleHopper=${x}
        .food1=${v}
        .food2=${$}
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
    `}_numberState(e){if(!e)return null;let i=Number(this.hass.states[e]?.state);return Number.isFinite(i)?i:null}_heroOverlay(e){let i=this._entities.camera,s=i?this.hass.states[i]:void 0,n=s!==void 0&&s.state!=="unavailable";if(e==="unreachable")return{text:Xs(e,null),tone:"error",live:n,catName:null,colorIndex:null,avatarAsset:null};if(e==="dispensing")return{text:Xs(e,null),tone:"amber",live:n,catName:null,colorIndex:null,avatarAsset:null};let o=this._catSeen(),a=this._entities.eating,l=a!==void 0&&this.hass.states[a]?.state==="on";if(!o)return{text:l?"Eating now":"Ready to feed",tone:"normal",live:n,catName:null,colorIndex:null,avatarAsset:null};let u=this._catsQuery.state.data?.cats.find(h=>h.name===o.name)??null;return{text:l?`${o.name} is eating`:`${o.name} seen ${o.relative}`,tone:"normal",live:n,catName:o.name,colorIndex:u?.color??null,avatarAsset:u?.avatar??null}}_catSeen(){let e=this._entities.lastSeenPet,i=e?this.hass.states[e]:void 0;if(!i||i.state==="unavailable"||i.state.toLowerCase()==="unknown")return null;let s=i.attributes?.last_identified,n=typeof s=="string"?new Date(s):new Date(i.last_changed),o=Number.isNaN(n.getTime())?new Date(i.last_changed):n;return{name:i.state,relative:Lt(o,new Date)}}_scheduleEntries(){let e=this._entities.schedule;return ur(e?this.hass.states[e]:void 0)}_portionConfigs(e,i){let s={action:"none"};return uu.map(n=>{let o={tap_action:i?s:{action:"fire-dom-event",kibble:"portion",portion:n},double_tap_action:s,hold_action:s};return{card_type:"button",button_type:"name",name:String(n),show_icon:!1,show_state:!1,styles:jg(n===e,i),...o,button_action:o}})}_feedRowConfig(e,i){let s={action:"none"},n={tap_action:e&&!i?{action:"fire-dom-event",kibble:"cancel"}:s,double_tap_action:s,hold_action:!e&&!i?{action:"fire-dom-event",kibble:"feed"}:s};return{card_type:"button",button_type:"name",name:i?"Feeder unreachable":e?"Feeding\u2026 tap to cancel":"Hold to feed",icon:e?"mdi:stop-circle-outline":"mdi:bowl-mix",styles:e?qg:Ng,...n,button_action:n}}_onPortionSelected(e){this._setHopperPortion(this._entities.feedAmount,e)}_setHopperPortion(e,i){if(!e)return;let s=Number(i.detail.value);Number.isFinite(s)&&this.hass.callService("number","set_value",{value:s},{entity_id:e})}_singleHopper(){let e=this._entities.hopperDivider;return e!=null&&this.hass.states[e]?.state==="off"}_armFeedRequestTimeout(){this._clearFeedRequestTimeoutTimer(),this._feedRequestTimeoutTimer=setTimeout(()=>{this._feedRequestTimeoutTimer=void 0,this._feedRequest.phase==="requesting"&&(this._feedRequest=Rl(this._feedRequest,Sr.timeoutMs,Sr),this._pourSource=null,this._feedError="No response from the feeder",this._resetFeedErrorAfter(5e3))},Sr.timeoutMs)}_clearFeedRequestTimeoutTimer(){this._feedRequestTimeoutTimer!==void 0&&clearTimeout(this._feedRequestTimeoutTimer),this._feedRequestTimeoutTimer=void 0}_resetFeedErrorAfter(e){this._clearFeedErrorTimer(),this._feedErrorTimer=setTimeout(()=>{this._feedErrorTimer=void 0,this._feedError=null,this._feedRequest=dn()},e)}_clearFeedErrorTimer(){this._feedErrorTimer!==void 0&&clearTimeout(this._feedErrorTimer),this._feedErrorTimer=void 0}_clearPopupHash(){cn(window.location.hash,this._config)!==null&&history.replaceState(null,"",`${window.location.pathname}${window.location.search}`)}static{this.styles=y`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${K(nl)};
      --kibble-amber-dark: ${K(br)};
      /* The feed action, deliberately not the food's amber -- see the token's own doc. */
      --kibble-feed: ${K(fr)};
      --kibble-feed-dark: ${K(sl)};
      --kibble-ink-on-feed: ${K(mr)};
      --kibble-ink-on-amber: ${K(ol)};
      --kibble-live: ${K(al)};
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
    /* Visits waiting for a name, right under "who was seen": one tap opens the review queue. */
    .hero-review {
      position: absolute;
      top: 44px;
      left: 8px;
      font-size: 13px;
    }
    :host(.compact) .hero-review {
      display: none;
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
  `}};console.info(`%c KIBBLE-CARD %c ${il} `,"background:#43A96A;color:#10301D;font-weight:700","background:#10301D;color:#fff");customElements.define("kibble-card",Ca);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-card",name:"Kibble",description:"The full daily control surface for a Kibble Petkit feeder: live camera, who's been by, feed, and schedule.",preview:!0});export{Ca as KibbleCard};
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

lit-html/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
