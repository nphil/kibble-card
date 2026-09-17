var Fa=Object.create;var ri=Object.defineProperty;var Ba=Object.getOwnPropertyDescriptor;var za=Object.getOwnPropertyNames;var ja=Object.getPrototypeOf,Ua=Object.prototype.hasOwnProperty;var qa=(i,t)=>()=>(i&&(t=i(i=0)),t);var _=(i,t)=>()=>(t||i((t={exports:{}}).exports,t),t.exports),Va=(i,t)=>{for(var e in t)ri(i,e,{get:t[e],enumerable:!0})},Ks=(i,t,e,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of za(t))!Ua.call(i,s)&&s!==e&&ri(i,s,{get:()=>t[s],enumerable:!(r=Ba(t,s))||r.enumerable});return i};var Wa=(i,t,e)=>(e=i!=null?Fa(ja(i)):{},Ks(t||!i||!i.__esModule?ri(e,"default",{value:i,enumerable:!0}):e,i)),nt=i=>Ks(ri({},"__esModule",{value:!0}),i);var xi=_(Pe=>{"use strict";Object.defineProperty(Pe,"__esModule",{value:!0});Pe.ERROR_PACKET=Pe.PACKET_TYPES_REVERSE=Pe.PACKET_TYPES=void 0;var de=Object.create(null);Pe.PACKET_TYPES=de;de.open="0";de.close="1";de.ping="2";de.pong="3";de.message="4";de.upgrade="5";de.noop="6";var On=Object.create(null);Pe.PACKET_TYPES_REVERSE=On;Object.keys(de).forEach(i=>{On[de[i]]=i});var kl={type:"error",data:"parser error"};Pe.ERROR_PACKET=kl});var zn=_(Ot=>{"use strict";Object.defineProperty(Ot,"__esModule",{value:!0});Ot.encodePacket=void 0;Ot.encodePacketToBinary=El;var Sl=xi(),Hn=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Nn=typeof ArrayBuffer=="function",Fn=i=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(i):i&&i.buffer instanceof ArrayBuffer,Bn=({type:i,data:t},e,r)=>Hn&&t instanceof Blob?e?r(t):Dn(t,r):Nn&&(t instanceof ArrayBuffer||Fn(t))?e?r(t):Dn(new Blob([t]),r):r(Sl.PACKET_TYPES[i]+(t||""));Ot.encodePacket=Bn;var Dn=(i,t)=>{let e=new FileReader;return e.onload=function(){let r=e.result.split(",")[1];t("b"+(r||""))},e.readAsDataURL(i)};function In(i){return i instanceof Uint8Array?i:i instanceof ArrayBuffer?new Uint8Array(i):new Uint8Array(i.buffer,i.byteOffset,i.byteLength)}var Tr;function El(i,t){if(Hn&&i.data instanceof Blob)return i.data.arrayBuffer().then(In).then(t);if(Nn&&(i.data instanceof ArrayBuffer||Fn(i.data)))return t(In(i.data));Bn(i,!1,e=>{Tr||(Tr=new TextEncoder),t(Tr.encode(e))})}});var jn=_(dt=>{"use strict";Object.defineProperty(dt,"__esModule",{value:!0});dt.decode=dt.encode=void 0;var ct="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Dt=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let i=0;i<ct.length;i++)Dt[ct.charCodeAt(i)]=i;var $l=i=>{let t=new Uint8Array(i),e,r=t.length,s="";for(e=0;e<r;e+=3)s+=ct[t[e]>>2],s+=ct[(t[e]&3)<<4|t[e+1]>>4],s+=ct[(t[e+1]&15)<<2|t[e+2]>>6],s+=ct[t[e+2]&63];return r%3===2?s=s.substring(0,s.length-1)+"=":r%3===1&&(s=s.substring(0,s.length-2)+"=="),s};dt.encode=$l;var Tl=i=>{let t=i.length*.75,e=i.length,r,s=0,n,o,a,l;i[i.length-1]==="="&&(t--,i[i.length-2]==="="&&t--);let p=new ArrayBuffer(t),d=new Uint8Array(p);for(r=0;r<e;r+=4)n=Dt[i.charCodeAt(r)],o=Dt[i.charCodeAt(r+1)],a=Dt[i.charCodeAt(r+2)],l=Dt[i.charCodeAt(r+3)],d[s++]=n<<2|o>>4,d[s++]=(o&15)<<4|a>>2,d[s++]=(a&3)<<6|l&63;return p};dt.decode=Tl});var qn=_(wi=>{"use strict";Object.defineProperty(wi,"__esModule",{value:!0});wi.decodePacket=void 0;var Ci=xi(),Pl=jn(),Al=typeof ArrayBuffer=="function",Rl=(i,t)=>{if(typeof i!="string")return{type:"message",data:Un(i,t)};let e=i.charAt(0);return e==="b"?{type:"message",data:Ml(i.substring(1),t)}:Ci.PACKET_TYPES_REVERSE[e]?i.length>1?{type:Ci.PACKET_TYPES_REVERSE[e],data:i.substring(1)}:{type:Ci.PACKET_TYPES_REVERSE[e]}:Ci.ERROR_PACKET};wi.decodePacket=Rl;var Ml=(i,t)=>{if(Al){let e=(0,Pl.decode)(i);return Un(e,t)}else return{base64:!0,data:i}},Un=(i,t)=>{switch(t){case"blob":return i instanceof Blob?i:new Blob([i]);case"arraybuffer":default:return i instanceof ArrayBuffer?i:i.buffer}}});var ut=_(W=>{"use strict";Object.defineProperty(W,"__esModule",{value:!0});W.decodePayload=W.decodePacket=W.encodePayload=W.encodePacket=W.protocol=void 0;W.createPacketEncoderStream=Dl;W.createPacketDecoderStream=Il;var Ar=zn();Object.defineProperty(W,"encodePacket",{enumerable:!0,get:function(){return Ar.encodePacket}});var Rr=qn();Object.defineProperty(W,"decodePacket",{enumerable:!0,get:function(){return Rr.decodePacket}});var Vn=xi(),Wn="",Ll=(i,t)=>{let e=i.length,r=new Array(e),s=0;i.forEach((n,o)=>{(0,Ar.encodePacket)(n,!1,a=>{r[o]=a,++s===e&&t(r.join(Wn))})})};W.encodePayload=Ll;var Ol=(i,t)=>{let e=i.split(Wn),r=[];for(let s=0;s<e.length;s++){let n=(0,Rr.decodePacket)(e[s],t);if(r.push(n),n.type==="error")break}return r};W.decodePayload=Ol;function Dl(){return new TransformStream({transform(i,t){(0,Ar.encodePacketToBinary)(i,e=>{let r=e.length,s;if(r<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,r);else if(r<65536){s=new Uint8Array(3);let n=new DataView(s.buffer);n.setUint8(0,126),n.setUint16(1,r)}else{s=new Uint8Array(9);let n=new DataView(s.buffer);n.setUint8(0,127),n.setBigUint64(1,BigInt(r))}i.data&&typeof i.data!="string"&&(s[0]|=128),t.enqueue(s),t.enqueue(e)})}})}var Pr;function ki(i){return i.reduce((t,e)=>t+e.length,0)}function Si(i,t){if(i[0].length===t)return i.shift();let e=new Uint8Array(t),r=0;for(let s=0;s<t;s++)e[s]=i[0][r++],r===i[0].length&&(i.shift(),r=0);return i.length&&r<i[0].length&&(i[0]=i[0].slice(r)),e}function Il(i,t){Pr||(Pr=new TextDecoder);let e=[],r=0,s=-1,n=!1;return new TransformStream({transform(o,a){for(e.push(o);;){if(r===0){if(ki(e)<1)break;let l=Si(e,1);n=(l[0]&128)===128,s=l[0]&127,s<126?r=3:s===126?r=1:r=2}else if(r===1){if(ki(e)<2)break;let l=Si(e,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),r=3}else if(r===2){if(ki(e)<8)break;let l=Si(e,8),p=new DataView(l.buffer,l.byteOffset,l.length),d=p.getUint32(0);if(d>Math.pow(2,21)-1){a.enqueue(Vn.ERROR_PACKET);break}s=d*Math.pow(2,32)+p.getUint32(4),r=3}else{if(ki(e)<s)break;let l=Si(e,s);a.enqueue((0,Rr.decodePacket)(n?l:Pr.decode(l),t)),r=0}if(s===0||s>i){a.enqueue(Vn.ERROR_PACKET);break}}}})}W.protocol=4});var Ei=_(Kn=>{Kn.Emitter=j;function j(i){if(i)return Hl(i)}function Hl(i){for(var t in j.prototype)i[t]=j.prototype[t];return i}j.prototype.on=j.prototype.addEventListener=function(i,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+i]=this._callbacks["$"+i]||[]).push(t),this};j.prototype.once=function(i,t){function e(){this.off(i,e),t.apply(this,arguments)}return e.fn=t,this.on(i,e),this};j.prototype.off=j.prototype.removeListener=j.prototype.removeAllListeners=j.prototype.removeEventListener=function(i,t){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var e=this._callbacks["$"+i];if(!e)return this;if(arguments.length==1)return delete this._callbacks["$"+i],this;for(var r,s=0;s<e.length;s++)if(r=e[s],r===t||r.fn===t){e.splice(s,1);break}return e.length===0&&delete this._callbacks["$"+i],this};j.prototype.emit=function(i){this._callbacks=this._callbacks||{};for(var t=new Array(arguments.length-1),e=this._callbacks["$"+i],r=1;r<arguments.length;r++)t[r-1]=arguments[r];if(e){e=e.slice(0);for(var r=0,s=e.length;r<s;++r)e[r].apply(this,t)}return this};j.prototype.emitReserved=j.prototype.emit;j.prototype.listeners=function(i){return this._callbacks=this._callbacks||{},this._callbacks["$"+i]||[]};j.prototype.hasListeners=function(i){return!!this.listeners(i).length}});var We=_(xe=>{"use strict";Object.defineProperty(xe,"__esModule",{value:!0});xe.defaultBinaryType=xe.globalThisShim=xe.nextTick=void 0;xe.createCookieJar=Nl;xe.nextTick=typeof Promise=="function"&&typeof Promise.resolve=="function"?t=>Promise.resolve().then(t):(t,e)=>e(t,0);xe.globalThisShim=typeof self<"u"?self:typeof window<"u"?window:Function("return this")();xe.defaultBinaryType="arraybuffer";function Nl(){}});var Ke=_(ht=>{"use strict";Object.defineProperty(ht,"__esModule",{value:!0});ht.pick=Fl;ht.installTimerFunctions=jl;ht.byteLength=ql;ht.randomString=Wl;var Ae=We();function Fl(i,...t){return t.reduce((e,r)=>(i.hasOwnProperty(r)&&(e[r]=i[r]),e),{})}var Bl=Ae.globalThisShim.setTimeout,zl=Ae.globalThisShim.clearTimeout;function jl(i,t){t.useNativeTimers?(i.setTimeoutFn=Bl.bind(Ae.globalThisShim),i.clearTimeoutFn=zl.bind(Ae.globalThisShim)):(i.setTimeoutFn=Ae.globalThisShim.setTimeout.bind(Ae.globalThisShim),i.clearTimeoutFn=Ae.globalThisShim.clearTimeout.bind(Ae.globalThisShim))}var Ul=1.33;function ql(i){return typeof i=="string"?Vl(i):Math.ceil((i.byteLength||i.size)*Ul)}function Vl(i){let t=0,e=0;for(let r=0,s=i.length;r<s;r++)t=i.charCodeAt(r),t<128?e+=1:t<2048?e+=2:t<55296||t>=57344?e+=3:(r++,e+=4);return e}function Wl(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}});var Mr=_($i=>{"use strict";Object.defineProperty($i,"__esModule",{value:!0});$i.encode=Kl;$i.decode=Yl;function Kl(i){let t="";for(let e in i)i.hasOwnProperty(e)&&(t.length&&(t+="&"),t+=encodeURIComponent(e)+"="+encodeURIComponent(i[e]));return t}function Yl(i){let t={},e=i.split("&");for(let r=0,s=e.length;r<s;r++){let n=e[r].split("=");t[decodeURIComponent(n[0])]=decodeURIComponent(n[1])}return t}});var Qn=_((ap,Yn)=>{var pt=1e3,mt=pt*60,ft=mt*60,Ye=ft*24,Ql=Ye*7,Xl=Ye*365.25;Yn.exports=function(i,t){t=t||{};var e=typeof i;if(e==="string"&&i.length>0)return Gl(i);if(e==="number"&&isFinite(i))return t.long?Jl(i):Zl(i);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(i))};function Gl(i){if(i=String(i),!(i.length>100)){var t=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(i);if(t){var e=parseFloat(t[1]),r=(t[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return e*Xl;case"weeks":case"week":case"w":return e*Ql;case"days":case"day":case"d":return e*Ye;case"hours":case"hour":case"hrs":case"hr":case"h":return e*ft;case"minutes":case"minute":case"mins":case"min":case"m":return e*mt;case"seconds":case"second":case"secs":case"sec":case"s":return e*pt;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return e;default:return}}}}function Zl(i){var t=Math.abs(i);return t>=Ye?Math.round(i/Ye)+"d":t>=ft?Math.round(i/ft)+"h":t>=mt?Math.round(i/mt)+"m":t>=pt?Math.round(i/pt)+"s":i+"ms"}function Jl(i){var t=Math.abs(i);return t>=Ye?Ti(i,t,Ye,"day"):t>=ft?Ti(i,t,ft,"hour"):t>=mt?Ti(i,t,mt,"minute"):t>=pt?Ti(i,t,pt,"second"):i+" ms"}function Ti(i,t,e,r){var s=t>=e*1.5;return Math.round(i/e)+" "+r+(s?"s":"")}});var Gn=_((lp,Xn)=>{function ec(i){e.debug=e,e.default=e,e.coerce=l,e.disable=o,e.enable=s,e.enabled=a,e.humanize=Qn(),e.destroy=p,Object.keys(i).forEach(d=>{e[d]=i[d]}),e.names=[],e.skips=[],e.formatters={};function t(d){let c=0;for(let m=0;m<d.length;m++)c=(c<<5)-c+d.charCodeAt(m),c|=0;return e.colors[Math.abs(c)%e.colors.length]}e.selectColor=t;function e(d){let c,m=null,f,g;function y(...C){if(!y.enabled)return;let R=y,H=Number(new Date),q=H-(c||H);R.diff=q,R.prev=c,R.curr=H,c=H,C[0]=e.coerce(C[0]),typeof C[0]!="string"&&C.unshift("%O");let D=0;C[0]=C[0].replace(/%([a-zA-Z%])/g,(fe,w)=>{if(fe==="%%")return"%";D++;let P=e.formatters[w];if(typeof P=="function"){let I=C[D];fe=P.call(R,I),C.splice(D,1),D--}return fe}),e.formatArgs.call(R,C),(R.log||e.log).apply(R,C)}return y.namespace=d,y.useColors=e.useColors(),y.color=e.selectColor(d),y.extend=r,y.destroy=e.destroy,Object.defineProperty(y,"enabled",{enumerable:!0,configurable:!1,get:()=>m!==null?m:(f!==e.namespaces&&(f=e.namespaces,g=e.enabled(d)),g),set:C=>{m=C}}),typeof e.init=="function"&&e.init(y),y}function r(d,c){let m=e(this.namespace+(typeof c>"u"?":":c)+d);return m.log=this.log,m}function s(d){e.save(d),e.namespaces=d,e.names=[],e.skips=[];let c=(typeof d=="string"?d:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let m of c)m[0]==="-"?e.skips.push(m.slice(1)):e.names.push(m)}function n(d,c){let m=0,f=0,g=-1,y=0;for(;m<d.length;)if(f<c.length&&(c[f]===d[m]||c[f]==="*"))c[f]==="*"?(g=f,y=m,f++):(m++,f++);else if(g!==-1)f=g+1,y++,m=y;else return!1;for(;f<c.length&&c[f]==="*";)f++;return f===c.length}function o(){let d=[...e.names,...e.skips.map(c=>"-"+c)].join(",");return e.enable(""),d}function a(d){for(let c of e.skips)if(n(d,c))return!1;for(let c of e.names)if(n(d,c))return!0;return!1}function l(d){return d instanceof Error?d.stack||d.message:d}function p(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return e.enable(e.load()),e}Xn.exports=ec});var Qe=_((K,Pi)=>{K.formatArgs=ic;K.save=rc;K.load=sc;K.useColors=tc;K.storage=nc();K.destroy=(()=>{let i=!1;return()=>{i||(i=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();K.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function tc(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let i;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(i=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(i[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function ic(i){if(i[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+i[0]+(this.useColors?"%c ":" ")+"+"+Pi.exports.humanize(this.diff),!this.useColors)return;let t="color: "+this.color;i.splice(1,0,t,"color: inherit");let e=0,r=0;i[0].replace(/%[a-zA-Z%]/g,s=>{s!=="%%"&&(e++,s==="%c"&&(r=e))}),i.splice(r,0,t)}K.log=console.debug||console.log||(()=>{});function rc(i){try{i?K.storage.setItem("debug",i):K.storage.removeItem("debug")}catch{}}function sc(){let i;try{i=K.storage.getItem("debug")||K.storage.getItem("DEBUG")}catch{}return!i&&typeof process<"u"&&"env"in process&&(i=process.env.DEBUG),i}function nc(){try{return localStorage}catch{}}Pi.exports=Gn()(K);var{formatters:oc}=Pi.exports;oc.j=function(i){try{return JSON.stringify(i)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}});var It=_(Re=>{"use strict";var ac=Re&&Re.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(Re,"__esModule",{value:!0});Re.Transport=Re.TransportError=void 0;var lc=ut(),cc=Ei(),dc=Ke(),uc=Mr(),hc=ac(Qe()),pc=(0,hc.default)("engine.io-client:transport"),Ai=class extends Error{constructor(t,e,r){super(t),this.description=e,this.context=r,this.type="TransportError"}};Re.TransportError=Ai;var Lr=class extends cc.Emitter{constructor(t){super(),this.writable=!1,(0,dc.installTimerFunctions)(this,t),this.opts=t,this.query=t.query,this.socket=t.socket,this.supportsBinary=!t.forceBase64}onError(t,e,r){return super.emitReserved("error",new Ai(t,e,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(t){this.readyState==="open"?this.write(t):pc("transport is not open, discarding packets")}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(t){let e=(0,lc.decodePacket)(t,this.socket.binaryType);this.onPacket(e)}onPacket(t){super.emitReserved("packet",t)}onClose(t){this.readyState="closed",super.emitReserved("close",t)}pause(t){}createUri(t,e={}){return t+"://"+this._hostname()+this._port()+this.opts.path+this._query(e)}_hostname(){let t=this.opts.hostname;return t.indexOf(":")===-1?t:"["+t+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(t){let e=(0,uc.encode)(t);return e.length?"?"+e:""}};Re.Transport=Lr});var Dr=_(gt=>{"use strict";var mc=gt&&gt.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(gt,"__esModule",{value:!0});gt.Polling=void 0;var fc=It(),gc=Ke(),Zn=ut(),bc=mc(Qe()),te=(0,bc.default)("engine.io-client:polling"),Or=class extends fc.Transport{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(t){this.readyState="pausing";let e=()=>{te("paused"),this.readyState="paused",t()};if(this._polling||!this.writable){let r=0;this._polling&&(te("we are currently polling - waiting to pause"),r++,this.once("pollComplete",function(){te("pre-pause polling complete"),--r||e()})),this.writable||(te("we are currently writing - waiting to pause"),r++,this.once("drain",function(){te("pre-pause writing complete"),--r||e()}))}else e()}_poll(){te("polling"),this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(t){te("polling got data %s",t);let e=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};(0,Zn.decodePayload)(t,this.socket.binaryType).forEach(e),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"?this._poll():te('ignoring poll - transport state "%s"',this.readyState))}doClose(){let t=()=>{te("writing close packet"),this.write([{type:"close"}])};this.readyState==="open"?(te("transport open - closing"),t()):(te("transport not open - deferring close"),this.once("open",t))}write(t){this.writable=!1,(0,Zn.encodePayload)(t,e=>{this.doWrite(e,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){let t=this.opts.secure?"https":"http",e=this.query||{};return this.opts.timestampRequests!==!1&&(e[this.opts.timestampParam]=(0,gc.randomString)()),!this.supportsBinary&&!e.sid&&(e.b64=1),this.createUri(t,e)}};gt.Polling=Or});var eo=_(Ri=>{"use strict";Object.defineProperty(Ri,"__esModule",{value:!0});Ri.hasCORS=void 0;var Jn=!1;try{Jn=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}Ri.hasCORS=Jn});var Li=_(ue=>{"use strict";var _c=ue&&ue.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(ue,"__esModule",{value:!0});ue.XHR=ue.Request=ue.BaseXHR=void 0;var vc=Dr(),yc=Ei(),to=Ke(),ro=We(),xc=eo(),Cc=_c(Qe()),Ir=(0,Cc.default)("engine.io-client:polling");function wc(){}var Mi=class extends vc.Polling{constructor(t){if(super(t),typeof location<"u"){let e=location.protocol==="https:",r=location.port;r||(r=e?"443":"80"),this.xd=typeof location<"u"&&t.hostname!==location.hostname||r!==t.port}}doWrite(t,e){let r=this.request({method:"POST",data:t});r.on("success",e),r.on("error",(s,n)=>{this.onError("xhr post error",s,n)})}doPoll(){Ir("xhr poll");let t=this.request();t.on("data",this.onData.bind(this)),t.on("error",(e,r)=>{this.onError("xhr poll error",e,r)}),this.pollXhr=t}};ue.BaseXHR=Mi;var Ce=class i extends yc.Emitter{constructor(t,e,r){super(),this.createRequest=t,(0,to.installTimerFunctions)(this,r),this._opts=r,this._method=r.method||"GET",this._uri=e,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var t;let e=(0,to.pick)(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");e.xdomain=!!this._opts.xd;let r=this._xhr=this.createRequest(e);try{Ir("xhr open %s: %s",this._method,this._uri),r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&r.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(t=this._opts.cookieJar)===null||t===void 0||t.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var s;r.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},Ir("xhr data %s",this._data),r.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=i.requestsCount++,i.requests[this._index]=this)}_onError(t){this.emitReserved("error",t,this._xhr),this._cleanup(!0)}_cleanup(t){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=wc,t)try{this._xhr.abort()}catch{}typeof document<"u"&&delete i.requests[this._index],this._xhr=null}}_onLoad(){let t=this._xhr.responseText;t!==null&&(this.emitReserved("data",t),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};ue.Request=Ce;Ce.requestsCount=0;Ce.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",io);else if(typeof addEventListener=="function"){let i="onpagehide"in ro.globalThisShim?"pagehide":"unload";addEventListener(i,io,!1)}}function io(){for(let i in Ce.requests)Ce.requests.hasOwnProperty(i)&&Ce.requests[i].abort()}var kc=function(){let i=so({xdomain:!1});return i&&i.responseType!==null}(),Hr=class extends Mi{constructor(t){super(t);let e=t&&t.forceBase64;this.supportsBinary=kc&&!e}request(t={}){return Object.assign(t,{xd:this.xd},this.opts),new Ce(so,this.uri(),t)}};ue.XHR=Hr;function so(i){let t=i.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!t||xc.hasCORS))return new XMLHttpRequest}catch{}if(!t)try{return new ro.globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}});var Di=_(Me=>{"use strict";var Sc=Me&&Me.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(Me,"__esModule",{value:!0});Me.WS=Me.BaseWS=void 0;var Ec=It(),no=Ke(),$c=ut(),Fr=We(),Tc=Sc(Qe()),Pc=(0,Tc.default)("engine.io-client:websocket"),oo=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative",Oi=class extends Ec.Transport{get name(){return"websocket"}doOpen(){let t=this.uri(),e=this.opts.protocols,r=oo?{}:(0,no.pick)(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(t,e,r)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=t=>this.onClose({description:"websocket connection closed",context:t}),this.ws.onmessage=t=>this.onData(t.data),this.ws.onerror=t=>this.onError("websocket error",t)}write(t){this.writable=!1;for(let e=0;e<t.length;e++){let r=t[e],s=e===t.length-1;(0,$c.encodePacket)(r,this.supportsBinary,n=>{try{this.doWrite(r,n)}catch{Pc("websocket closed before onclose event")}s&&(0,Fr.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){let t=this.opts.secure?"wss":"ws",e=this.query||{};return this.opts.timestampRequests&&(e[this.opts.timestampParam]=(0,no.randomString)()),this.supportsBinary||(e.b64=1),this.createUri(t,e)}};Me.BaseWS=Oi;var Nr=Fr.globalThisShim.WebSocket||Fr.globalThisShim.MozWebSocket,Br=class extends Oi{createSocket(t,e,r){return oo?new Nr(t,e,r):e?new Nr(t,e):new Nr(t)}doWrite(t,e){this.ws.send(e)}};Me.WS=Br});var jr=_(bt=>{"use strict";var Ac=bt&&bt.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(bt,"__esModule",{value:!0});bt.WT=void 0;var Rc=It(),Mc=We(),ao=ut(),Lc=Ac(Qe()),Ht=(0,Lc.default)("engine.io-client:webtransport"),zr=class extends Rc.Transport{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(t){return this.emitReserved("error",t)}this._transport.closed.then(()=>{Ht("transport closed gracefully"),this.onClose()}).catch(t=>{Ht("transport closed due to %s",t),this.onError("webtransport error",t)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(t=>{let e=(0,ao.createPacketDecoderStream)(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=t.readable.pipeThrough(e).getReader(),s=(0,ao.createPacketEncoderStream)();s.readable.pipeTo(t.writable),this._writer=s.writable.getWriter();let n=()=>{r.read().then(({done:a,value:l})=>{if(a){Ht("session is closed");return}Ht("received chunk: %o",l),this.onPacket(l),n()}).catch(a=>{Ht("an error occurred while reading: %s",a)})};n();let o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(t){this.writable=!1;for(let e=0;e<t.length;e++){let r=t[e],s=e===t.length-1;this._writer.write(r).then(()=>{s&&(0,Mc.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var t;(t=this._transport)===null||t===void 0||t.close()}};bt.WT=zr});var Ur=_(Ii=>{"use strict";Object.defineProperty(Ii,"__esModule",{value:!0});Ii.transports=void 0;var Oc=Li(),Dc=Di(),Ic=jr();Ii.transports={websocket:Dc.WS,webtransport:Ic.WT,polling:Oc.XHR}});var Vr=_(qr=>{"use strict";Object.defineProperty(qr,"__esModule",{value:!0});qr.parse=Fc;var Hc=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Nc=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Fc(i){if(i.length>8e3)throw"URI too long";let t=i,e=i.indexOf("["),r=i.indexOf("]");e!=-1&&r!=-1&&(i=i.substring(0,e)+i.substring(e,r).replace(/:/g,";")+i.substring(r,i.length));let s=Hc.exec(i||""),n={},o=14;for(;o--;)n[Nc[o]]=s[o]||"";return e!=-1&&r!=-1&&(n.source=t,n.host=n.host.substring(1,n.host.length-1).replace(/;/g,":"),n.authority=n.authority.replace("[","").replace("]","").replace(/;/g,":"),n.ipv6uri=!0),n.pathNames=Bc(n,n.path),n.queryKey=zc(n,n.query),n}function Bc(i,t){let e=/\/{2,9}/g,r=t.replace(e,"/").split("/");return(t.slice(0,1)=="/"||t.length===0)&&r.splice(0,1),t.slice(-1)=="/"&&r.splice(r.length-1,1),r}function zc(i,t){let e={};return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,s,n){s&&(e[s]=n)}),e}});var Qr=_(he=>{"use strict";var jc=he&&he.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(he,"__esModule",{value:!0});he.Socket=he.SocketWithUpgrade=he.SocketWithoutUpgrade=void 0;var Uc=Ur(),lo=Ke(),qc=Mr(),co=Vr(),Vc=Ei(),uo=ut(),Wr=We(),Wc=jc(Qe()),E=(0,Wc.default)("engine.io-client:socket"),Kr=typeof addEventListener=="function"&&typeof removeEventListener=="function",Nt=[];Kr&&addEventListener("offline",()=>{E("closing %d connection(s) because the network was lost",Nt.length),Nt.forEach(i=>i())},!1);var Xe=class i extends Vc.Emitter{constructor(t,e){if(super(),this.binaryType=Wr.defaultBinaryType,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,t&&typeof t=="object"&&(e=t,t=null),t){let r=(0,co.parse)(t);e.hostname=r.host,e.secure=r.protocol==="https"||r.protocol==="wss",e.port=r.port,r.query&&(e.query=r.query)}else e.host&&(e.hostname=(0,co.parse)(e.host).host);(0,lo.installTimerFunctions)(this,e),this.secure=e.secure!=null?e.secure:typeof location<"u"&&location.protocol==="https:",e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.hostname=e.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=e.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},e.transports.forEach(r=>{let s=r.prototype.name;this.transports.push(s),this._transportsByName[s]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},e),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=(0,qc.decode)(this.opts.query)),Kr&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(E("adding listener for the 'offline' event"),this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Nt.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=(0,Wr.createCookieJar)()),this._open()}createTransport(t){E('creating transport "%s"',t);let e=Object.assign({},this.opts.query);e.EIO=uo.protocol,e.transport=t,this.id&&(e.sid=this.id);let r=Object.assign({},this.opts,{query:e,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[t]);return E("options: %j",r),new this._transportsByName[t](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}let t=this.opts.rememberUpgrade&&i.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";let e=this.createTransport(t);e.open(),this.setTransport(e)}setTransport(t){E("setting transport %s",t.name),this.transport&&(E("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",e=>this._onClose("transport close",e))}onOpen(){E("socket open"),this.readyState="open",i.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(E('socket receive: type "%s", data "%s"',t.type,t.data),this.emitReserved("packet",t),this.emitReserved("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":let e=new Error("server error");e.code=t.data,this._onError(e);break;case"message":this.emitReserved("data",t.data),this.emitReserved("message",t.data);break}else E('packet received with socket readyState "%s"',this.readyState)}onHandshake(t){this.emitReserved("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this._pingInterval=t.pingInterval,this._pingTimeout=t.pingTimeout,this._maxPayload=t.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);let t=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+t,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},t),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){let t=this._getWritablePackets();E("flushing %d packets in socket",t.length),this.transport.send(t),this._prevBufferLen=t.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let e=1;for(let r=0;r<this.writeBuffer.length;r++){let s=this.writeBuffer[r].data;if(s&&(e+=(0,lo.byteLength)(s)),r>0&&e>this._maxPayload)return E("only send %d out of %d packets",r,this.writeBuffer.length),this.writeBuffer.slice(0,r);e+=2}return E("payload size is %d (max: %d)",e,this._maxPayload),this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;let t=Date.now()>this._pingTimeoutTime;return t&&(E("throttled timer detected, scheduling connection close"),this._pingTimeoutTime=0,(0,Wr.nextTick)(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),t}write(t,e,r){return this._sendPacket("message",t,e,r),this}send(t,e,r){return this._sendPacket("message",t,e,r),this}_sendPacket(t,e,r,s){if(typeof e=="function"&&(s=e,e=void 0),typeof r=="function"&&(s=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;let n={type:t,data:e,options:r};this.emitReserved("packetCreate",n),this.writeBuffer.push(n),s&&this.once("flush",s),this.flush()}close(){let t=()=>{this._onClose("forced close"),E("socket closing - telling transport to close"),this.transport.close()},e=()=>{this.off("upgrade",e),this.off("upgradeError",e),t()},r=()=>{this.once("upgrade",e),this.once("upgradeError",e)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():t()}):this.upgrading?r():t()),this}_onError(t){if(E("socket error %j",t),i.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return E("trying next transport"),this.transports.shift(),this._open();this.emitReserved("error",t),this._onClose("transport error",t)}_onClose(t,e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(E('socket close with reason: "%s"',t),this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Kr&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){let r=Nt.indexOf(this._offlineEventListener);r!==-1&&(E("removing listener for the 'offline' event"),Nt.splice(r,1))}this.readyState="closed",this.id=null,this.emitReserved("close",t,e),this.writeBuffer=[],this._prevBufferLen=0}}};he.SocketWithoutUpgrade=Xe;Xe.protocol=uo.protocol;var Hi=class extends Xe{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade){E("starting upgrade probes");for(let t=0;t<this._upgrades.length;t++)this._probe(this._upgrades[t])}}_probe(t){E('probing transport "%s"',t);let e=this.createTransport(t),r=!1;Xe.priorWebsocketSuccess=!1;let s=()=>{r||(E('probe transport "%s" opened',t),e.send([{type:"ping",data:"probe"}]),e.once("packet",c=>{if(!r)if(c.type==="pong"&&c.data==="probe"){if(E('probe transport "%s" pong',t),this.upgrading=!0,this.emitReserved("upgrading",e),!e)return;Xe.priorWebsocketSuccess=e.name==="websocket",E('pausing current transport "%s"',this.transport.name),this.transport.pause(()=>{r||this.readyState!=="closed"&&(E("changing transport and sending upgrade packet"),d(),this.setTransport(e),e.send([{type:"upgrade"}]),this.emitReserved("upgrade",e),e=null,this.upgrading=!1,this.flush())})}else{E('probe transport "%s" failed',t);let m=new Error("probe error");m.transport=e.name,this.emitReserved("upgradeError",m)}}))};function n(){r||(r=!0,d(),e.close(),e=null)}let o=c=>{let m=new Error("probe error: "+c);m.transport=e.name,n(),E('probe transport "%s" failed because of error: %s',t,c),this.emitReserved("upgradeError",m)};function a(){o("transport closed")}function l(){o("socket closed")}function p(c){e&&c.name!==e.name&&(E('"%s" works - aborting "%s"',c.name,e.name),n())}let d=()=>{e.removeListener("open",s),e.removeListener("error",o),e.removeListener("close",a),this.off("close",l),this.off("upgrading",p)};e.once("open",s),e.once("error",o),e.once("close",a),this.once("close",l),this.once("upgrading",p),this._upgrades.indexOf("webtransport")!==-1&&t!=="webtransport"?this.setTimeoutFn(()=>{r||e.open()},200):e.open()}onHandshake(t){this._upgrades=this._filterUpgrades(t.upgrades),super.onHandshake(t)}_filterUpgrades(t){let e=[];for(let r=0;r<t.length;r++)~this.transports.indexOf(t[r])&&e.push(t[r]);return e}};he.SocketWithUpgrade=Hi;var Yr=class extends Hi{constructor(t,e={}){let r=typeof t=="object",s=r?{...t}:{...e};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(n=>Uc.transports[n]).filter(n=>!!n)),super(r?s:t,s)}};he.Socket=Yr});var ho=_(Ni=>{"use strict";Object.defineProperty(Ni,"__esModule",{value:!0});Ni.Fetch=void 0;var Kc=Dr(),Xr=class extends Kc.Polling{doPoll(){this._fetch().then(t=>{if(!t.ok)return this.onError("fetch read error",t.status,t);t.text().then(e=>this.onData(e))}).catch(t=>{this.onError("fetch read error",t)})}doWrite(t,e){this._fetch(t).then(r=>{if(!r.ok)return this.onError("fetch write error",r.status,r);e()}).catch(r=>{this.onError("fetch write error",r)})}_fetch(t){var e;let r=t!==void 0,s=new Headers(this.opts.extraHeaders);return r&&s.set("content-type","text/plain;charset=UTF-8"),(e=this.socket._cookieJar)===null||e===void 0||e.appendCookies(s),fetch(this.uri(),{method:r?"POST":"GET",body:r?t:null,headers:s,credentials:this.opts.withCredentials?"include":"omit"}).then(n=>{var o;return(o=this.socket._cookieJar)===null||o===void 0||o.parseCookies(n.headers.getSetCookie()),n})}};Ni.Fetch=Xr});var go=_(S=>{"use strict";Object.defineProperty(S,"__esModule",{value:!0});S.WebTransport=S.WebSocket=S.NodeWebSocket=S.XHR=S.NodeXHR=S.Fetch=S.nextTick=S.parse=S.installTimerFunctions=S.transports=S.TransportError=S.Transport=S.protocol=S.SocketWithUpgrade=S.SocketWithoutUpgrade=S.Socket=void 0;var po=Qr();Object.defineProperty(S,"Socket",{enumerable:!0,get:function(){return po.Socket}});var mo=Qr();Object.defineProperty(S,"SocketWithoutUpgrade",{enumerable:!0,get:function(){return mo.SocketWithoutUpgrade}});Object.defineProperty(S,"SocketWithUpgrade",{enumerable:!0,get:function(){return mo.SocketWithUpgrade}});S.protocol=po.Socket.protocol;var fo=It();Object.defineProperty(S,"Transport",{enumerable:!0,get:function(){return fo.Transport}});Object.defineProperty(S,"TransportError",{enumerable:!0,get:function(){return fo.TransportError}});var Yc=Ur();Object.defineProperty(S,"transports",{enumerable:!0,get:function(){return Yc.transports}});var Qc=Ke();Object.defineProperty(S,"installTimerFunctions",{enumerable:!0,get:function(){return Qc.installTimerFunctions}});var Xc=Vr();Object.defineProperty(S,"parse",{enumerable:!0,get:function(){return Xc.parse}});var Gc=We();Object.defineProperty(S,"nextTick",{enumerable:!0,get:function(){return Gc.nextTick}});var Zc=ho();Object.defineProperty(S,"Fetch",{enumerable:!0,get:function(){return Zc.Fetch}});var Jc=Li();Object.defineProperty(S,"NodeXHR",{enumerable:!0,get:function(){return Jc.XHR}});var ed=Li();Object.defineProperty(S,"XHR",{enumerable:!0,get:function(){return ed.XHR}});var td=Di();Object.defineProperty(S,"NodeWebSocket",{enumerable:!0,get:function(){return td.WS}});var id=Di();Object.defineProperty(S,"WebSocket",{enumerable:!0,get:function(){return id.WS}});var rd=jr();Object.defineProperty(S,"WebTransport",{enumerable:!0,get:function(){return rd.WT}})});var bo=_(we=>{"use strict";Object.defineProperty(we,"__esModule",{value:!0});we.TimeoutError=void 0;we.singletonPromise=sd;we.timeoutPromise=nd;we.timeoutFunction=od;we.createPromiseDebouncer=ad;we.createMapPromiseDebouncer=ld;function sd(i,t,e=0){if(i?.promise)return i;let r=t();return i?i.promise=r:i={promise:r,cacheDuration:e},r.finally(()=>setTimeout(()=>i.promise=void 0,i.cacheDuration)),i}var Ft=class extends Error{promise;constructor(t){super("Operation Timed Out"),this.promise=t}};we.TimeoutError=Ft;function nd(i,t){return new Promise((e,r)=>{let s=setTimeout(()=>r(new Ft(t)),i);t.then(n=>{clearTimeout(s),e(n)}).catch(n=>{clearTimeout(s),r(n)})})}function od(i,t){return new Promise((e,r)=>{let s=!1,n=t(()=>s),o=setTimeout(()=>{s=!0,r(new Ft(n))},i);n.then(a=>{clearTimeout(o),e(a)}).catch(a=>{clearTimeout(o),r(a)})})}function ad(){let i;return t=>(i||(i=t().finally(()=>i=void 0)),i)}function ld(){let i=new Map;return(t,e,r)=>{let s=JSON.stringify(t),n=i.get(s);return n||(n=r().finally(()=>{if(!e){i.delete(s);return}setTimeout(()=>i.delete(s),e)}),i.set(s,n)),n}}});var me=_(Le=>{"use strict";Object.defineProperty(Le,"__esModule",{value:!0});Le.RpcPeer=Le.RPCResultError=void 0;Le.startPeriodicGarbageCollection=_o;Le.getEvalSource=cd;function _o(){globalThis.gc||console.warn("rpc peer garbage collection not available: global.gc is not exposed.");let i;try{i=globalThis}catch{}let t=0;return setInterval(()=>{let e=Date.now(),r=e-t,s=B.remotesCreated;B.remotesCreated=0;let n=B.remotesCollected;B.remotesCollected=0,(s||n||r>5*60*1e3)&&(t=e,i?.gc?.())},1e4)}var Fi=class i{peer;entry;constructorName;proxyProps;proxyOneWayMethods;static iteratorMethods=new Set(["next","throw","return"]);constructor(t,e,r,s,n){this.peer=t,this.entry=e,this.constructorName=r,this.proxyProps=s,this.proxyOneWayMethods=n}toPrimitive(){let t=this.peer;return`RpcProxy-${t.selfName}:${t.peerName}: ${this.constructorName}`}get(t,e,r){if(e===Symbol.asyncIterator)return this.proxyProps?.[Symbol.asyncIterator.toString()]?()=>new Proxy(()=>{},this):void 0;if(i.iteratorMethods.has(e?.toString())){let n=this.proxyProps?.[Symbol.asyncIterator.toString()]?.[e];if(n)return new Proxy(()=>n,this)}if(e===B.PROPERTY_PROXY_ID)return this.entry.id;if(e==="__proxy_constructor")return this.constructorName;if(e===B.PROPERTY_PROXY_PEER)return this.peer;if(e===B.PROPERTY_PROXY_PROPERTIES)return this.proxyProps;if(e===B.PROPERTY_PROXY_ONEWAY_METHODS)return this.proxyOneWayMethods;if(e===B.PROPERTY_JSON_DISABLE_SERIALIZATION||e===B.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN||e==="then"||e==="constructor")return;if(this.proxyProps?.[e]!==void 0)return this.proxyProps?.[e];let s=B.handleFunctionInvocations(this,t,e,r);return s||new Proxy(()=>e,this)}set(t,e,r,s){return e===B.finalizerIdSymbol?this.entry.finalizerId=r:(this.proxyProps||={},this.proxyProps[e]=r),!0}apply(t,e,r){let s=t()||null,n=this.proxyOneWayMethods?.includes?.(s);if(Object.isFrozen(this.peer.pendingResults))return n?Promise.resolve():Promise.reject(new pe(this.peer,"RpcPeer has been killed (apply) "+t()));let o=[],a={};for(let c of r||[])o.push(this.peer.serialize(c,a));let l={type:"apply",id:void 0,proxyId:this.entry.id,args:o,method:s};if(n)return l.oneway=!0,s===null&&delete l.method,this.peer.send(l,void 0,a),Promise.resolve();let p=this.peer.createPendingResult(s,(c,m)=>{l.id=c,this.peer.send(l,m,a)}),d=this.proxyProps?.[Symbol.asyncIterator.toString()];return!d||s!==d.next&&s!==d.return?p:p.then(c=>s===d.return?{done:!0,value:void 0}:{value:c,done:!1}).catch(c=>{if(c.name==="StopAsyncIteration")return{done:!0,value:void 0};throw c})}},pe=class extends Error{cause;constructor(t,e,r,s){super(`${e}
${t.selfName}:${t.peerName}`),this.cause=r,s?.name&&(this.name=s?.name),s?.stack&&(this.stack=`${r?.stack||s.stack}
${t.peerName}:${t.selfName}`)}};Le.RPCResultError=pe;try{let i=FinalizationRegistry}catch{window.WeakRef=class{target;constructor(e){this.target=e}deref(){return this.target}},window.FinalizationRegistry=class{register(){}}}var B=class i{selfName;peerName;send;params={};pendingResults={};localProxied=new Map;localProxyMap=new Map;remoteWeakProxies={};finalizers=new FinalizationRegistry(t=>this.finalize(t));nameDeserializerMap=new Map;onProxyTypeSerialization=new Map;onProxySerialization;constructorSerializerMap=new Map;transportSafeArgumentTypes=i.getDefaultTransportSafeArgumentTypes();killed;killedSafe;killedDeferred;tags={};yieldedAsyncIterators=new Set;static finalizerIdSymbol=Symbol("rpcFinalizerId");static remotesCollected=0;static remotesCreated=0;static activeRpcPeer;static isRpcProxy(t){return!!t?.[i.PROPERTY_PROXY_ID]}static getDefaultTransportSafeArgumentTypes(){let t=new Set;return t.add(Number.name),t.add(String.name),t.add(Object.name),t.add(Boolean.name),t.add(Array.name),t}static handleFunctionInvocations(t,e,r,s){if(r==="apply")return(n,o)=>t.apply(e,t,o);if(r==="call")return(n,...o)=>t.apply(e,t,o);if(r==="toString"||r===Symbol.toPrimitive)return(n,...o)=>t.toPrimitive()}static getIteratorNext(t){return t[Symbol.asyncIterator]?t[this.PROPERTY_PROXY_PROPERTIES]?.[Symbol.asyncIterator.toString()]?.next||"next":void 0}static prepareProxyProperties(t){let e=t?.[i.PROPERTY_PROXY_PROPERTIES];return t[Symbol.asyncIterator]&&(e||={},e[Symbol.asyncIterator.toString()]||(e[Symbol.asyncIterator.toString()]={next:"next",throw:"throw",return:"return"})),e}static RANDOM_DIGITS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";static RPC_RESULT_ERROR_NAME="RPCResultError";static PROPERTY_PROXY_ID="__proxy_id";static PROPERTY_PROXY_PEER="__proxy_peer";static PROPERTY_PROXY_ONEWAY_METHODS="__proxy_oneway_methods";static PROPERTY_JSON_DISABLE_SERIALIZATION="__json_disable_serialization";static PROPERTY_PROXY_PROPERTIES="__proxy_props";static PROPERTY_JSON_COPY_SERIALIZE_CHILDREN="__json_copy_serialize_children";static PROBED_PROPERTIES=new Set(["then","constructor","__proxy_id","__proxy_constructor",i.PROPERTY_PROXY_PEER,i.PROPERTY_PROXY_ONEWAY_METHODS,i.PROPERTY_JSON_DISABLE_SERIALIZATION,i.PROPERTY_PROXY_PROPERTIES,i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]);constructor(t,e,r){this.selfName=t,this.peerName=e,this.send=r,this.killed=new Promise((s,n)=>{this.killedDeferred={resolve:s,reject:n,method:void 0}}).catch(s=>s.message||"Unknown Error"),this.killedSafe=this.killed.then(()=>{}).catch(()=>{})}static isTransportSafe(t){return t?!t[Symbol.asyncIterator]&&!t[i.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.getDefaultTransportSafeArgumentTypes().has(t.constructor?.name):!0}isTransportSafe(t){return t?!t[Symbol.asyncIterator]&&!t[i.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.transportSafeArgumentTypes.has(t.constructor?.name):!0}static generateId(){return[...new Array(8)].map(()=>i.RANDOM_DIGITS.charAt(Math.floor(Math.random()*i.RANDOM_DIGITS.length))).join("")}createPendingResult(t,e){if(Object.isFrozen(this.pendingResults))return Promise.reject(new pe(this,"RpcPeer has been killed (createPendingResult)"));let r=new Promise((s,n)=>{let o=i.generateId();this.pendingResults[o]={resolve:s,reject:n,method:t},e(o,a=>n(new pe(this,a.message,a)))});return r.catch(()=>{}),r}kill(t){if(Object.isFrozen(this.pendingResults))return;let e=new pe(this,t||"peer was killed");this.killedDeferred.reject(e);for(let r of Object.values(this.pendingResults))r.reject(e);for(let r of this.yieldedAsyncIterators)r.throw(e).catch(()=>{});this.yieldedAsyncIterators.clear(),this.pendingResults=Object.freeze({}),this.params=Object.freeze({}),this.remoteWeakProxies=Object.freeze({}),this.localProxyMap.clear(),this.localProxied.clear()}addSerializer(t,e,r){this.nameDeserializerMap.set(e,r),this.constructorSerializerMap.set(t,e)}finalize(t){i.remotesCollected++,delete this.remoteWeakProxies[t.id];let e={__local_proxy_id:t.id,__local_proxy_finalizer_id:t.finalizerId,type:"finalize"};this.send(e)}async getParam(t){return this.createPendingResult("getParam",(e,r)=>{let s={id:e,type:"param",param:t};this.send(s,r)})}createErrorResult(t,e){return t.result=this.serializeError(e),t.throw=!0,t}deserialize(t,e){if(!t)return t;let r=t[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN];if(r){if(Array.isArray(r)){let f=[];for(let g of r)f.push(this.deserialize(g,e));return f}let m={};for(let[f,g]of Object.entries(t))m[f]=this.deserialize(g,e);return m}let{__remote_proxy_id:s,__remote_proxy_finalizer_id:n,__local_proxy_id:o,__remote_constructor_name:a,__serialized_value:l,__remote_proxy_props:p,__remote_proxy_oneway_methods:d}=t;if(a===i.RPC_RESULT_ERROR_NAME)return this.deserializeError(l);if(s){let m=this.remoteWeakProxies[s]?.deref();m||(m=this.newProxy(s,a,p,d)),m[i.finalizerIdSymbol]=n;let f=this.nameDeserializerMap.get(a);return f?f.deserialize(m,e):m}if(o){let m=this.localProxyMap.get(o);if(!m)throw new pe(this,`invalid local proxy id ${o}`);return m}let c=this.nameDeserializerMap.get(a);return c?c.deserialize(l,e):t}deserializeError(t){let{name:e,stack:r,message:s}=t;return new pe(this,s,void 0,{name:e,stack:r})}serializeError(t){let e={stack:t.stack||"[no stack]",name:t.name||"[no name]",message:t.message||"[no message]"};return{__remote_constructor_name:i.RPC_RESULT_ERROR_NAME,__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_proxy_oneway_methods:void 0,__remote_proxy_props:void 0,__serialized_value:e}}serialize(t,e){if(t?.[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]===!0){if(Array.isArray(t)){let m=[];for(let f of t)m.push(this.serialize(f,e));return{[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]:m}}let c={};for(let[m,f]of Object.entries(t))c[m]=this.serialize(f,e);return c}if(this.isTransportSafe(t))return t;let r=t.__proxy_constructor||t.constructor?.name?.toString();if(t instanceof Error)return this.serializeError(t);let s=this.constructorSerializerMap.get(t.constructor);if(s){r=s;let c=this.nameDeserializerMap.get(s);if(!c)throw new Error("serializer not found for "+s);let m=c.serialize(t,e);return{__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_constructor_name:r,__remote_proxy_props:i.prepareProxyProperties(t),__remote_proxy_oneway_methods:t?.[i.PROPERTY_PROXY_ONEWAY_METHODS],__serialized_value:m}}let n=this.localProxied.get(t);if(n){let{proxyId:c,properties:m}=this.onProxySerialization?.(t)||{proxyId:n.id,properties:i.prepareProxyProperties(t)};if(c!==n.id)throw new Error("onProxySerialization proxy id mismatch");let f=i.generateId();return n.finalizerId=f,{__remote_proxy_id:c,__remote_proxy_finalizer_id:f,__remote_constructor_name:r,__remote_proxy_props:m,__remote_proxy_oneway_methods:t?.[i.PROPERTY_PROXY_ONEWAY_METHODS]}}let{__proxy_id:o,__proxy_peer:a}=t;if(o&&a===this)return{__local_proxy_id:o};this.onProxyTypeSerialization.get(r)?.(t);let{proxyId:l,properties:p}=this.onProxySerialization?.(t)||{proxyId:i.generateId(),properties:i.prepareProxyProperties(t)};return n={id:l,finalizerId:l},this.localProxied.set(t,n),this.localProxyMap.set(l,t),{__remote_proxy_id:l,__remote_proxy_finalizer_id:l,__remote_constructor_name:r,__remote_proxy_props:p,__remote_proxy_oneway_methods:t?.[i.PROPERTY_PROXY_ONEWAY_METHODS]}}newProxy(t,e,r,s){i.remotesCreated++;let n={id:t,finalizerId:void 0},o=new Fi(this,n,e,r,s),a=e==="Function"||e==="AsyncFunction"?function(){}:o,l=new Proxy(a,o),p=new WeakRef(l);return this.remoteWeakProxies[t]=p,this.finalizers.register(o,n),l}handleMessage(t,e){try{i.activeRpcPeer=this,this.handleMessageInternal(t,e)}finally{i.activeRpcPeer=void 0}}sendResult(t,e){this.send(t,r=>{this.send(this.createErrorResult(t,r),void 0,e)},e)}async handleMessageInternal(t,e){if(!Object.isFrozen(this.pendingResults))try{switch(t.type){case"param":{let r=t,s={},n;try{n={type:"result",id:r.id,result:this.serialize(this.params[r.param],s)}}catch(o){this.createErrorResult(n,o)}this.sendResult(n,s);break}case"apply":{let r=t,s={type:"result",id:r.id||""},n={};try{let o=this.localProxyMap.get(r.proxyId);if(!o)throw new Error(`proxy id ${r.proxyId} not found`);let a=[];for(let p of r.args||[])a.push(this.deserialize(p,e));let l;if(r.method){if(!o[r.method])throw new Error(`target ${o?.constructor?.name} does not have method ${r.method}`);let d=i.getIteratorNext(o)===r.method;if(d&&this.yieldedAsyncIterators.delete(o),l=await o[r.method](...a),d){if(l.done)throw{name:"StopAsyncIteration",message:void 0};Object.isFrozen(this.pendingResults)?o.throw(new pe(this,"RpcPeer has been killed (yield)")).catch(()=>{}):this.yieldedAsyncIterators.add(o),l=l.value}}else l=await o(...a);s.result=this.serialize(l,n)}catch(o){this.createErrorResult(s,o)}r.oneway||this.sendResult(s,n);break}case"result":{let r=t,s=this.pendingResults[r.id];if(delete this.pendingResults[r.id],!s)throw new Error(`unknown result ${r.id}`);let n=this.deserialize(r.result,e);r.throw?s.reject(n):s.resolve(n);break}case"finalize":{let r=t,s=this.localProxyMap.get(r.__local_proxy_id);if(s){let n=this.localProxied.get(s);if(r.__local_proxy_finalizer_id&&r.__local_proxy_finalizer_id!==n?.finalizerId)break;this.localProxyMap.delete(r.__local_proxy_id),this.localProxied.delete(s)}break}default:throw new Error(`unknown rpc message type ${t.type}`)}}catch(r){console.error("unhandled rpc error",this.peerName,r);return}}};Le.RpcPeer=B;function cd(){return`
    (() => {
        ${Fi}

        ${B}

        ${_o}

        return {
            startPeriodicGarbageCollection,
            RpcPeer,
            RpcProxy,
        };
    })();
    `}});var vo=_(Bi=>{"use strict";Object.defineProperty(Bi,"__esModule",{value:!0});Bi.MediaObject=void 0;var dd=me(),Gr=class{mimeType;data;__proxy_props;constructor(t,e,r){this.mimeType=t,this.data=e,this.__proxy_props={},r||={},r.mimeType=t,r.convert||=null,r.toMimeTypes||=null;for(let[s,n]of Object.entries(r))dd.RpcPeer.isTransportSafe(n)&&(this.__proxy_props[s]=n),this[s]=n}async getData(){return Promise.resolve(this.data)}};Bi.MediaObject=Gr});var Ge=_(b=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0});b.ScryptedMimeTypes=b.ScryptedInterface=b.MediaPlayerState=b.SecuritySystemObstruction=b.SecuritySystemMode=b.AirQuality=b.AirPurifierMode=b.AirPurifierStatus=b.ChargeState=b.LockState=b.PanTiltZoomMovement=b.ThermostatMode=b.TemperatureUnit=b.FanMode=b.HumidityMode=b.ScryptedDeviceType=b.ScryptedInterfaceDescriptors=b.ScryptedInterfaceMethod=b.ScryptedInterfaceProperty=b.DeviceBase=b.TYPES_VERSION=void 0;b.TYPES_VERSION="0.5.55";var Zr=class{};b.DeviceBase=Zr;var yo;(function(i){i.id="id",i.info="info",i.interfaces="interfaces",i.mixins="mixins",i.name="name",i.nativeId="nativeId",i.pluginId="pluginId",i.providedInterfaces="providedInterfaces",i.providedName="providedName",i.providedRoom="providedRoom",i.providedType="providedType",i.providerId="providerId",i.room="room",i.type="type",i.scryptedRuntimeArguments="scryptedRuntimeArguments",i.on="on",i.brightness="brightness",i.colorTemperature="colorTemperature",i.rgb="rgb",i.hsv="hsv",i.buttons="buttons",i.sensors="sensors",i.running="running",i.paused="paused",i.docked="docked",i.temperatureSetting="temperatureSetting",i.temperature="temperature",i.temperatureUnit="temperatureUnit",i.humidity="humidity",i.resolution="resolution",i.audioVolumes="audioVolumes",i.recordingActive="recordingActive",i.ptzCapabilities="ptzCapabilities",i.lockState="lockState",i.entryOpen="entryOpen",i.batteryLevel="batteryLevel",i.chargeState="chargeState",i.online="online",i.fromMimeType="fromMimeType",i.toMimeType="toMimeType",i.converters="converters",i.binaryState="binaryState",i.tampered="tampered",i.sleeping="sleeping",i.powerDetected="powerDetected",i.audioDetected="audioDetected",i.motionDetected="motionDetected",i.ambientLight="ambientLight",i.occupied="occupied",i.flooded="flooded",i.ultraviolet="ultraviolet",i.luminance="luminance",i.position="position",i.securitySystemState="securitySystemState",i.pm10Density="pm10Density",i.pm25Density="pm25Density",i.vocDensity="vocDensity",i.noxDensity="noxDensity",i.co2ppm="co2ppm",i.airQuality="airQuality",i.airPurifierState="airPurifierState",i.filterChangeIndication="filterChangeIndication",i.filterLifeLevel="filterLifeLevel",i.humiditySetting="humiditySetting",i.fan="fan",i.applicationInfo="applicationInfo",i.chatCompletionCapabilities="chatCompletionCapabilities",i.systemDevice="systemDevice"})(yo||(b.ScryptedInterfaceProperty=yo={}));var xo;(function(i){i.listen="listen",i.probe="probe",i.setMixins="setMixins",i.setName="setName",i.setRoom="setRoom",i.setType="setType",i.getPluginJson="getPluginJson",i.turnOff="turnOff",i.turnOn="turnOn",i.setBrightness="setBrightness",i.getTemperatureMaxK="getTemperatureMaxK",i.getTemperatureMinK="getTemperatureMinK",i.setColorTemperature="setColorTemperature",i.setRgb="setRgb",i.setHsv="setHsv",i.pressButton="pressButton",i.sendNotification="sendNotification",i.start="start",i.stop="stop",i.pause="pause",i.resume="resume",i.dock="dock",i.setTemperature="setTemperature",i.setTemperatureUnit="setTemperatureUnit",i.getPictureOptions="getPictureOptions",i.takePicture="takePicture",i.getAudioStream="getAudioStream",i.setAudioVolumes="setAudioVolumes",i.startDisplay="startDisplay",i.stopDisplay="stopDisplay",i.getVideoStream="getVideoStream",i.getVideoStreamOptions="getVideoStreamOptions",i.getPrivacyMasks="getPrivacyMasks",i.setPrivacyMasks="setPrivacyMasks",i.getVideoTextOverlays="getVideoTextOverlays",i.setVideoTextOverlay="setVideoTextOverlay",i.getRecordingStream="getRecordingStream",i.getRecordingStreamCurrentTime="getRecordingStreamCurrentTime",i.getRecordingStreamOptions="getRecordingStreamOptions",i.getRecordingStreamThumbnail="getRecordingStreamThumbnail",i.deleteRecordingStream="deleteRecordingStream",i.setRecordingActive="setRecordingActive",i.ptzCommand="ptzCommand",i.getRecordedEvents="getRecordedEvents",i.getVideoClip="getVideoClip",i.getVideoClips="getVideoClips",i.getVideoClipThumbnail="getVideoClipThumbnail",i.removeVideoClips="removeVideoClips",i.setVideoStreamOptions="setVideoStreamOptions",i.startIntercom="startIntercom",i.stopIntercom="stopIntercom",i.lock="lock",i.unlock="unlock",i.addPassword="addPassword",i.getPasswords="getPasswords",i.removePassword="removePassword",i.activate="activate",i.deactivate="deactivate",i.isReversible="isReversible",i.closeEntry="closeEntry",i.openEntry="openEntry",i.getDevice="getDevice",i.releaseDevice="releaseDevice",i.adoptDevice="adoptDevice",i.discoverDevices="discoverDevices",i.createDevice="createDevice",i.getCreateDeviceSettings="getCreateDeviceSettings",i.reboot="reboot",i.getRefreshFrequency="getRefreshFrequency",i.refresh="refresh",i.getMediaStatus="getMediaStatus",i.load="load",i.seek="seek",i.skipNext="skipNext",i.skipPrevious="skipPrevious",i.convert="convert",i.convertMedia="convertMedia",i.getSettings="getSettings",i.putSetting="putSetting",i.armSecuritySystem="armSecuritySystem",i.disarmSecuritySystem="disarmSecuritySystem",i.setAirPurifierState="setAirPurifierState",i.getReadmeMarkdown="getReadmeMarkdown",i.getOauthUrl="getOauthUrl",i.onOauthCallback="onOauthCallback",i.canMixin="canMixin",i.getMixin="getMixin",i.releaseMixin="releaseMixin",i.onRequest="onRequest",i.onConnection="onConnection",i.onPush="onPush",i.run="run",i.eval="eval",i.loadScripts="loadScripts",i.saveScript="saveScript",i.forkInterface="forkInterface",i.getDetectionInput="getDetectionInput",i.getObjectTypes="getObjectTypes",i.detectObjects="detectObjects",i.generateObjectDetections="generateObjectDetections",i.getDetectionModel="getDetectionModel",i.setHumidity="setHumidity",i.setFan="setFan",i.startRTCSignalingSession="startRTCSignalingSession",i.createRTCSignalingSession="createRTCSignalingSession",i.getScryptedUserAccessControl="getScryptedUserAccessControl",i.generateVideoFrames="generateVideoFrames",i.connectStream="connectStream",i.getTTYSettings="getTTYSettings",i.getChatCompletion="getChatCompletion",i.streamChatCompletion="streamChatCompletion",i.getTextEmbedding="getTextEmbedding",i.getImageEmbedding="getImageEmbedding",i.callLLMTool="callLLMTool",i.getLLMTools="getLLMTools"})(xo||(b.ScryptedInterfaceMethod=xo={}));b.ScryptedInterfaceDescriptors={ScryptedDevice:{name:"ScryptedDevice",methods:["listen","probe","setMixins","setName","setRoom","setType"],properties:["id","info","interfaces","mixins","name","nativeId","pluginId","providedInterfaces","providedName","providedRoom","providedType","providerId","room","type"]},ScryptedPlugin:{name:"ScryptedPlugin",methods:["getPluginJson"],properties:[]},ScryptedPluginRuntime:{name:"ScryptedPluginRuntime",methods:[],properties:["scryptedRuntimeArguments"]},OnOff:{name:"OnOff",methods:["turnOff","turnOn"],properties:["on"]},Brightness:{name:"Brightness",methods:["setBrightness"],properties:["brightness"]},ColorSettingTemperature:{name:"ColorSettingTemperature",methods:["getTemperatureMaxK","getTemperatureMinK","setColorTemperature"],properties:["colorTemperature"]},ColorSettingRgb:{name:"ColorSettingRgb",methods:["setRgb"],properties:["rgb"]},ColorSettingHsv:{name:"ColorSettingHsv",methods:["setHsv"],properties:["hsv"]},Buttons:{name:"Buttons",methods:[],properties:["buttons"]},PressButtons:{name:"PressButtons",methods:["pressButton"],properties:[]},Sensors:{name:"Sensors",methods:[],properties:["sensors"]},Notifier:{name:"Notifier",methods:["sendNotification"],properties:[]},StartStop:{name:"StartStop",methods:["start","stop"],properties:["running"]},Pause:{name:"Pause",methods:["pause","resume"],properties:["paused"]},Dock:{name:"Dock",methods:["dock"],properties:["docked"]},TemperatureSetting:{name:"TemperatureSetting",methods:["setTemperature"],properties:["temperatureSetting"]},Thermometer:{name:"Thermometer",methods:["setTemperatureUnit"],properties:["temperature","temperatureUnit"]},HumiditySensor:{name:"HumiditySensor",methods:[],properties:["humidity"]},Camera:{name:"Camera",methods:["getPictureOptions","takePicture"],properties:[]},Resolution:{name:"Resolution",methods:[],properties:["resolution"]},Microphone:{name:"Microphone",methods:["getAudioStream"],properties:[]},AudioVolumeControl:{name:"AudioVolumeControl",methods:["setAudioVolumes"],properties:["audioVolumes"]},Display:{name:"Display",methods:["startDisplay","stopDisplay"],properties:[]},VideoCamera:{name:"VideoCamera",methods:["getVideoStream","getVideoStreamOptions"],properties:[]},VideoCameraMask:{name:"VideoCameraMask",methods:["getPrivacyMasks","setPrivacyMasks"],properties:[]},VideoTextOverlays:{name:"VideoTextOverlays",methods:["getVideoTextOverlays","setVideoTextOverlay"],properties:[]},VideoRecorder:{name:"VideoRecorder",methods:["getRecordingStream","getRecordingStreamCurrentTime","getRecordingStreamOptions","getRecordingStreamThumbnail"],properties:["recordingActive"]},VideoRecorderManagement:{name:"VideoRecorderManagement",methods:["deleteRecordingStream","setRecordingActive"],properties:[]},PanTiltZoom:{name:"PanTiltZoom",methods:["ptzCommand"],properties:["ptzCapabilities"]},EventRecorder:{name:"EventRecorder",methods:["getRecordedEvents"],properties:[]},VideoClips:{name:"VideoClips",methods:["getVideoClip","getVideoClips","getVideoClipThumbnail","removeVideoClips"],properties:[]},VideoCameraConfiguration:{name:"VideoCameraConfiguration",methods:["setVideoStreamOptions"],properties:[]},Intercom:{name:"Intercom",methods:["startIntercom","stopIntercom"],properties:[]},Lock:{name:"Lock",methods:["lock","unlock"],properties:["lockState"]},PasswordStore:{name:"PasswordStore",methods:["addPassword","getPasswords","removePassword"],properties:[]},Scene:{name:"Scene",methods:["activate","deactivate","isReversible"],properties:[]},Entry:{name:"Entry",methods:["closeEntry","openEntry"],properties:[]},EntrySensor:{name:"EntrySensor",methods:[],properties:["entryOpen"]},DeviceProvider:{name:"DeviceProvider",methods:["getDevice","releaseDevice"],properties:[]},DeviceDiscovery:{name:"DeviceDiscovery",methods:["adoptDevice","discoverDevices"],properties:[]},DeviceCreator:{name:"DeviceCreator",methods:["createDevice","getCreateDeviceSettings"],properties:[]},Battery:{name:"Battery",methods:[],properties:["batteryLevel"]},Charger:{name:"Charger",methods:[],properties:["chargeState"]},Reboot:{name:"Reboot",methods:["reboot"],properties:[]},Refresh:{name:"Refresh",methods:["getRefreshFrequency","refresh"],properties:[]},MediaPlayer:{name:"MediaPlayer",methods:["getMediaStatus","load","seek","skipNext","skipPrevious"],properties:[]},Online:{name:"Online",methods:[],properties:["online"]},BufferConverter:{name:"BufferConverter",methods:["convert"],properties:["fromMimeType","toMimeType"]},MediaConverter:{name:"MediaConverter",methods:["convertMedia"],properties:["converters"]},Settings:{name:"Settings",methods:["getSettings","putSetting"],properties:[]},BinarySensor:{name:"BinarySensor",methods:[],properties:["binaryState"]},TamperSensor:{name:"TamperSensor",methods:[],properties:["tampered"]},Sleep:{name:"Sleep",methods:[],properties:["sleeping"]},PowerSensor:{name:"PowerSensor",methods:[],properties:["powerDetected"]},AudioSensor:{name:"AudioSensor",methods:[],properties:["audioDetected"]},MotionSensor:{name:"MotionSensor",methods:[],properties:["motionDetected"]},AmbientLightSensor:{name:"AmbientLightSensor",methods:[],properties:["ambientLight"]},OccupancySensor:{name:"OccupancySensor",methods:[],properties:["occupied"]},FloodSensor:{name:"FloodSensor",methods:[],properties:["flooded"]},UltravioletSensor:{name:"UltravioletSensor",methods:[],properties:["ultraviolet"]},LuminanceSensor:{name:"LuminanceSensor",methods:[],properties:["luminance"]},PositionSensor:{name:"PositionSensor",methods:[],properties:["position"]},SecuritySystem:{name:"SecuritySystem",methods:["armSecuritySystem","disarmSecuritySystem"],properties:["securitySystemState"]},PM10Sensor:{name:"PM10Sensor",methods:[],properties:["pm10Density"]},PM25Sensor:{name:"PM25Sensor",methods:[],properties:["pm25Density"]},VOCSensor:{name:"VOCSensor",methods:[],properties:["vocDensity"]},NOXSensor:{name:"NOXSensor",methods:[],properties:["noxDensity"]},CO2Sensor:{name:"CO2Sensor",methods:[],properties:["co2ppm"]},AirQualitySensor:{name:"AirQualitySensor",methods:[],properties:["airQuality"]},AirPurifier:{name:"AirPurifier",methods:["setAirPurifierState"],properties:["airPurifierState"]},FilterMaintenance:{name:"FilterMaintenance",methods:[],properties:["filterChangeIndication","filterLifeLevel"]},Readme:{name:"Readme",methods:["getReadmeMarkdown"],properties:[]},OauthClient:{name:"OauthClient",methods:["getOauthUrl","onOauthCallback"],properties:[]},MixinProvider:{name:"MixinProvider",methods:["canMixin","getMixin","releaseMixin"],properties:[]},HttpRequestHandler:{name:"HttpRequestHandler",methods:["onRequest"],properties:[]},EngineIOHandler:{name:"EngineIOHandler",methods:["onConnection"],properties:[]},PushHandler:{name:"PushHandler",methods:["onPush"],properties:[]},Program:{name:"Program",methods:["run"],properties:[]},Scriptable:{name:"Scriptable",methods:["eval","loadScripts","saveScript"],properties:[]},ClusterForkInterface:{name:"ClusterForkInterface",methods:["forkInterface"],properties:[]},ObjectDetector:{name:"ObjectDetector",methods:["getDetectionInput","getObjectTypes"],properties:[]},ObjectDetection:{name:"ObjectDetection",methods:["detectObjects","generateObjectDetections","getDetectionModel"],properties:[]},ObjectDetectionPreview:{name:"ObjectDetectionPreview",methods:[],properties:[]},ObjectDetectionGenerator:{name:"ObjectDetectionGenerator",methods:[],properties:[]},HumiditySetting:{name:"HumiditySetting",methods:["setHumidity"],properties:["humiditySetting"]},Fan:{name:"Fan",methods:["setFan"],properties:["fan"]},RTCSignalingChannel:{name:"RTCSignalingChannel",methods:["startRTCSignalingSession"],properties:[]},RTCSignalingClient:{name:"RTCSignalingClient",methods:["createRTCSignalingSession"],properties:[]},LauncherApplication:{name:"LauncherApplication",methods:[],properties:["applicationInfo"]},ScryptedUser:{name:"ScryptedUser",methods:["getScryptedUserAccessControl"],properties:[]},VideoFrameGenerator:{name:"VideoFrameGenerator",methods:["generateVideoFrames"],properties:[]},StreamService:{name:"StreamService",methods:["connectStream"],properties:[]},TTY:{name:"TTY",methods:[],properties:[]},TTYSettings:{name:"TTYSettings",methods:["getTTYSettings"],properties:[]},ChatCompletion:{name:"ChatCompletion",methods:["getChatCompletion","streamChatCompletion"],properties:["chatCompletionCapabilities"]},TextEmbedding:{name:"TextEmbedding",methods:["getTextEmbedding"],properties:[]},ImageEmbedding:{name:"ImageEmbedding",methods:["getImageEmbedding"],properties:[]},LLMTools:{name:"LLMTools",methods:["callLLMTool","getLLMTools"],properties:[]},ScryptedSystemDevice:{name:"ScryptedSystemDevice",methods:[],properties:["systemDevice"]},ScryptedDeviceCreator:{name:"ScryptedDeviceCreator",methods:[],properties:[]},ScryptedSettings:{name:"ScryptedSettings",methods:[],properties:[]}};var Co;(function(i){i.Builtin="Builtin",i.Internal="Internal",i.Camera="Camera",i.Fan="Fan",i.Light="Light",i.Switch="Switch",i.Outlet="Outlet",i.Sensor="Sensor",i.Scene="Scene",i.Program="Program",i.Automation="Automation",i.Vacuum="Vacuum",i.Notifier="Notifier",i.Thermostat="Thermostat",i.Lock="Lock",i.PasswordControl="PasswordControl",i.Display="Display",i.SmartDisplay="SmartDisplay",i.Speaker="Speaker",i.SmartSpeaker="SmartSpeaker",i.RemoteDesktop="RemoteDesktop",i.Event="Event",i.Entry="Entry",i.Garage="Garage",i.DeviceProvider="DeviceProvider",i.DataSource="DataSource",i.API="API",i.Buttons="Buttons",i.Doorbell="Doorbell",i.Irrigation="Irrigation",i.Valve="Valve",i.Person="Person",i.SecuritySystem="SecuritySystem",i.WindowCovering="WindowCovering",i.Siren="Siren",i.AirPurifier="AirPurifier",i.Internet="Internet",i.Network="Network",i.Bridge="Bridge",i.LLM="LLM",i.Unknown="Unknown"})(Co||(b.ScryptedDeviceType=Co={}));var wo;(function(i){i.Humidify="Humidify",i.Dehumidify="Dehumidify",i.Auto="Auto",i.Off="Off"})(wo||(b.HumidityMode=wo={}));var ko;(function(i){i.Auto="Auto",i.Manual="Manual"})(ko||(b.FanMode=ko={}));var So;(function(i){i.C="C",i.F="F"})(So||(b.TemperatureUnit=So={}));var Eo;(function(i){i.Off="Off",i.Cool="Cool",i.Heat="Heat",i.HeatCool="HeatCool",i.Auto="Auto",i.FanOnly="FanOnly",i.Purifier="Purifier",i.Eco="Eco",i.Dry="Dry",i.On="On"})(Eo||(b.ThermostatMode=Eo={}));var $o;(function(i){i.Absolute="Absolute",i.Relative="Relative",i.Continuous="Continuous",i.Preset="Preset",i.Home="Home"})($o||(b.PanTiltZoomMovement=$o={}));var To;(function(i){i.Locked="Locked",i.Unlocked="Unlocked",i.Jammed="Jammed"})(To||(b.LockState=To={}));var Po;(function(i){i.Trickle="trickle",i.Charging="charging",i.NotCharging="not-charging"})(Po||(b.ChargeState=Po={}));var Ao;(function(i){i.Inactive="Inactive",i.Idle="Idle",i.Active="Active",i.ActiveNightMode="ActiveNightMode"})(Ao||(b.AirPurifierStatus=Ao={}));var Ro;(function(i){i.Manual="Manual",i.Automatic="Automatic"})(Ro||(b.AirPurifierMode=Ro={}));var Mo;(function(i){i.Unknown="Unknown",i.Excellent="Excellent",i.Good="Good",i.Fair="Fair",i.Inferior="Inferior",i.Poor="Poor"})(Mo||(b.AirQuality=Mo={}));var Lo;(function(i){i.Disarmed="Disarmed",i.HomeArmed="HomeArmed",i.AwayArmed="AwayArmed",i.NightArmed="NightArmed"})(Lo||(b.SecuritySystemMode=Lo={}));var Oo;(function(i){i.Sensor="Sensor",i.Occupied="Occupied",i.Time="Time",i.Error="Error"})(Oo||(b.SecuritySystemObstruction=Oo={}));var Do;(function(i){i.Idle="Idle",i.Playing="Playing",i.Paused="Paused",i.Buffering="Buffering"})(Do||(b.MediaPlayerState=Do={}));var Io;(function(i){i.ScryptedDevice="ScryptedDevice",i.ScryptedPlugin="ScryptedPlugin",i.ScryptedPluginRuntime="ScryptedPluginRuntime",i.OnOff="OnOff",i.Brightness="Brightness",i.ColorSettingTemperature="ColorSettingTemperature",i.ColorSettingRgb="ColorSettingRgb",i.ColorSettingHsv="ColorSettingHsv",i.Buttons="Buttons",i.PressButtons="PressButtons",i.Sensors="Sensors",i.Notifier="Notifier",i.StartStop="StartStop",i.Pause="Pause",i.Dock="Dock",i.TemperatureSetting="TemperatureSetting",i.Thermometer="Thermometer",i.HumiditySensor="HumiditySensor",i.Camera="Camera",i.Resolution="Resolution",i.Microphone="Microphone",i.AudioVolumeControl="AudioVolumeControl",i.Display="Display",i.VideoCamera="VideoCamera",i.VideoCameraMask="VideoCameraMask",i.VideoTextOverlays="VideoTextOverlays",i.VideoRecorder="VideoRecorder",i.VideoRecorderManagement="VideoRecorderManagement",i.PanTiltZoom="PanTiltZoom",i.EventRecorder="EventRecorder",i.VideoClips="VideoClips",i.VideoCameraConfiguration="VideoCameraConfiguration",i.Intercom="Intercom",i.Lock="Lock",i.PasswordStore="PasswordStore",i.Scene="Scene",i.Entry="Entry",i.EntrySensor="EntrySensor",i.DeviceProvider="DeviceProvider",i.DeviceDiscovery="DeviceDiscovery",i.DeviceCreator="DeviceCreator",i.Battery="Battery",i.Charger="Charger",i.Reboot="Reboot",i.Refresh="Refresh",i.MediaPlayer="MediaPlayer",i.Online="Online",i.BufferConverter="BufferConverter",i.MediaConverter="MediaConverter",i.Settings="Settings",i.BinarySensor="BinarySensor",i.TamperSensor="TamperSensor",i.Sleep="Sleep",i.PowerSensor="PowerSensor",i.AudioSensor="AudioSensor",i.MotionSensor="MotionSensor",i.AmbientLightSensor="AmbientLightSensor",i.OccupancySensor="OccupancySensor",i.FloodSensor="FloodSensor",i.UltravioletSensor="UltravioletSensor",i.LuminanceSensor="LuminanceSensor",i.PositionSensor="PositionSensor",i.SecuritySystem="SecuritySystem",i.PM10Sensor="PM10Sensor",i.PM25Sensor="PM25Sensor",i.VOCSensor="VOCSensor",i.NOXSensor="NOXSensor",i.CO2Sensor="CO2Sensor",i.AirQualitySensor="AirQualitySensor",i.AirPurifier="AirPurifier",i.FilterMaintenance="FilterMaintenance",i.Readme="Readme",i.OauthClient="OauthClient",i.MixinProvider="MixinProvider",i.HttpRequestHandler="HttpRequestHandler",i.EngineIOHandler="EngineIOHandler",i.PushHandler="PushHandler",i.Program="Program",i.Scriptable="Scriptable",i.ClusterForkInterface="ClusterForkInterface",i.ObjectDetector="ObjectDetector",i.ObjectDetection="ObjectDetection",i.ObjectDetectionPreview="ObjectDetectionPreview",i.ObjectDetectionGenerator="ObjectDetectionGenerator",i.HumiditySetting="HumiditySetting",i.Fan="Fan",i.RTCSignalingChannel="RTCSignalingChannel",i.RTCSignalingClient="RTCSignalingClient",i.LauncherApplication="LauncherApplication",i.ScryptedUser="ScryptedUser",i.VideoFrameGenerator="VideoFrameGenerator",i.StreamService="StreamService",i.TTY="TTY",i.TTYSettings="TTYSettings",i.ChatCompletion="ChatCompletion",i.TextEmbedding="TextEmbedding",i.ImageEmbedding="ImageEmbedding",i.LLMTools="LLMTools",i.ScryptedSystemDevice="ScryptedSystemDevice",i.ScryptedDeviceCreator="ScryptedDeviceCreator",i.ScryptedSettings="ScryptedSettings"})(Io||(b.ScryptedInterface=Io={}));var Ho;(function(i){i.Url="text/x-uri",i.InsecureLocalUrl="text/x-insecure-local-uri",i.LocalUrl="text/x-local-uri",i.ServerId="text/x-server-id",i.PushEndpoint="text/x-push-endpoint",i.SchemePrefix="x-scrypted/x-scrypted-scheme-",i.MediaStreamUrl="text/x-media-url",i.MediaObject="x-scrypted/x-scrypted-media-object",i.RequestMediaObject="x-scrypted/x-scrypted-request-media-object",i.RequestMediaStream="x-scrypted/x-scrypted-request-stream",i.MediaStreamFeedback="x-scrypted/x-media-stream-feedback",i.FFmpegInput="x-scrypted/x-ffmpeg-input",i.FFmpegTranscodeStream="x-scrypted/x-ffmpeg-transcode-stream",i.RTCSignalingChannel="x-scrypted/x-scrypted-rtc-signaling-channel",i.RTCSignalingSession="x-scrypted/x-scrypted-rtc-signaling-session",i.RTCConnectionManagement="x-scrypted/x-scrypted-rtc-connection-management",i.Image="x-scrypted/x-scrypted-image"})(Ho||(b.ScryptedMimeTypes=Ho={}))});var es=_(_t=>{"use strict";Object.defineProperty(_t,"__esModule",{value:!0});_t.SidebandBufferSerializer=_t.BufferSerializer=void 0;var zi=class{serialize(t){return console.warn("Using slow buffer serialization. Ensure the peer supports SidebandBufferSerializer."),t.toString("base64")}deserialize(t){return console.warn("Using slow buffer deserialization. Ensure the peer supports SidebandBufferSerializer."),Buffer.from(t,"base64")}};_t.BufferSerializer=zi;var Jr=class{bufferSerializer=new zi;serialize(t,e){if(!e)return this.bufferSerializer.serialize(t);let r=e.buffers=e.buffers||[];return r.push(t),r.length-1}deserialize(t,e){return e?.buffers?e.buffers[t]:this.bufferSerializer.deserialize(t)}};_t.SidebandBufferSerializer=Jr});var is=_(ie=>{"use strict";Object.defineProperty(ie,"__esModule",{value:!0});ie.propertyInterfaces=ie.allInterfaceProperties=void 0;ie.getPropertyInterfaces=No;ie.getInterfaceMethods=Fo;ie.getInterfaceProperties=Bo;ie.isValidInterfaceMethod=ud;ie.isValidInterfaceProperty=hd;var ts=Ge();ie.allInterfaceProperties=[].concat(...Object.values(ts.ScryptedInterfaceDescriptors).map(i=>i.properties));function No(i){let t={};for(let e of Object.values(i))for(let r of e.properties)t[r]=e.name;return t}ie.propertyInterfaces=No(ts.ScryptedInterfaceDescriptors);function Fo(i,t){return Object.values(i).filter(e=>t.has(e.name)).map(e=>e.methods).flat()}function Bo(i,t){return Object.values(i).filter(e=>t.has(e.name)).map(e=>e.properties).flat()}function ud(i,t,e){return Fo(i,t).includes(e)||i[ts.ScryptedInterface.ScryptedDevice].methods.includes(e)}function hd(i,t,e){return Bo(i,new Set(t)).includes(e)}});var zo=_(rs=>{"use strict";Object.defineProperty(rs,"__esModule",{value:!0});rs.checkProperty=fd;var vt=Ge(),pd=me(),md=is();function fd(i,t){if(i===vt.ScryptedInterfaceProperty.id)throw new Error("id is read only");if(i===vt.ScryptedInterfaceProperty.nativeId)throw new Error("nativeId is read only");if(i===vt.ScryptedInterfaceProperty.mixins)throw new Error("mixins is read only");if(i===vt.ScryptedInterfaceProperty.interfaces)throw new Error("interfaces is a read only post-mixin computed property, use providedInterfaces");if(pd.RpcPeer.isRpcProxy(t))throw new Error("value must be a primitive type");if(md.propertyInterfaces[i.toString()]===vt.ScryptedInterface.ScryptedDevice&&i!==vt.ScryptedInterfaceProperty.info)throw new Error(`${i.toString()} can not be set. Use DeviceManager.onDevicesChanges or DeviceManager.onDeviceDiscovered to update the device description.`)}});var jo=_(Oe=>{"use strict";Object.defineProperty(Oe,"__esModule",{value:!0});Oe.StorageImpl=Oe.DeviceManagerImpl=Oe.DeviceStateProxyHandler=void 0;var gd=me(),bd=zo(),ss=class{console;nativeId;api;logger;constructor(t,e,r){this.console=r,this.api=t,this.nativeId=e}async ensureLogger(){return this.logger||(this.logger=this.api.getLogger(this.nativeId)),await this.logger}async log(t,e){(await this.ensureLogger()).log(t,e)}a(t){this.log("a",t)}async clear(){(await this.ensureLogger()).clear()}async clearAlert(t){(await this.ensureLogger()).clearAlert(t)}async clearAlerts(){(await this.ensureLogger()).clearAlerts()}d(t){this.log("d",t)}e(t){this.log("e",t)}i(t){this.log("i",t)}v(t){this.log("v",t)}w(t){this.log("w",t)}},Bt=class{deviceManager;id;setState;constructor(t,e,r){this.deviceManager=t,this.id=e,this.setState=r}get(t,e,r){return e==="id"?this.id:e===gd.RpcPeer.PROPERTY_PROXY_PROPERTIES?{id:this.id}:e==="setState"?this.setState:this.deviceManager.systemManager.state[this.id][e]?.value}set(t,e,r,s){return(0,bd.checkProperty)(e.toString(),r),this.deviceManager.systemManager.state[this.id][e]={value:r},this.setState(e.toString(),r),!0}};Oe.DeviceStateProxyHandler=Bt;var ns=class{systemManager;getDeviceConsole;getMixinConsole;api;nativeIds=new Map;deviceStorage=new Map;mixinStorage=new Map;constructor(t,e,r){this.systemManager=t,this.getDeviceConsole=e,this.getMixinConsole=r}async requestRestart(){return this.api.requestRestart()}getDeviceLogger(t){return new ss(this.api,t,this.getDeviceConsole?.(t)||console)}getDeviceState(t){let e=new Bt(this,this.nativeIds.get(t).id,(r,s)=>this.api.setState(t,r,s));return new Proxy(e,e)}createDeviceState(t,e){let r=new Bt(this,t,e);return new Proxy(r,r)}getDeviceStorage(t){let e=this.deviceStorage.get(t);return e||(e=new zt(this,t),this.deviceStorage.set(t,e)),e}getMixinStorage(t,e){let r=this.mixinStorage.get(e);r||(r=new Map,this.mixinStorage.set(e,r));let s=r.get(t);return s||(s=new zt(this,e,`mixin:${t}:`),r.set(t,s)),s}pruneMixinStorage(){for(let t of this.nativeIds.keys()){let e=this.nativeIds.get(t).storage;for(let r of Object.keys(e)){if(!r.startsWith("mixin:"))continue;let[,s]=r.split(":");s&&!this.systemManager.state[s]&&delete e[r]}}}async onMixinEvent(t,e,r,s){return this.api.onMixinEvent(t,e,r,s)}getNativeIds(){return Array.from(this.nativeIds.keys())}async onDeviceDiscovered(t){return this.api.onDeviceDiscovered(t)}async onDeviceRemoved(t){return this.api.onDeviceRemoved(t)}async onDeviceEvent(t,e,r){return this.api.onDeviceEvent(t,e,r)}async onDevicesChanged(t){return this.api.onDevicesChanged(t)}};Oe.DeviceManagerImpl=ns;function ji(i){return i===null?"null":i===void 0?"undefined":i.toString()}var zt=class i{deviceManager;nativeId;prefix;api;static allowedMethods=["length","clear","getItem","setItem","key","removeItem"];static indexedHandler={get(t,e){let r=e.toString();if(i.allowedMethods.includes(r)){let s=t[r];return r==="length"?s:s.bind(t)}return t.getItem(ji(e))},set(t,e,r){return t.setItem(ji(e),r),!0}};constructor(t,e,r){return this.deviceManager=t,this.nativeId=e,this.prefix=r,this.deviceManager=t,this.api=t.api,this.nativeId=e,this.prefix||(this.prefix=""),new Proxy(this,i.indexedHandler)}get storage(){return this.deviceManager.nativeIds.get(this.nativeId).storage}get length(){return Object.keys(this.storage).filter(t=>t.startsWith(this.prefix)).length}clear(){if(!this.prefix)this.deviceManager.nativeIds.get(this.nativeId).storage={};else{let t=this.storage;Object.keys(this.storage).filter(e=>e.startsWith(this.prefix)).forEach(e=>delete t[e])}this.api.setStorage(this.nativeId,this.storage)}getItem(t){return this.storage[this.prefix+t]}key(t){return this.prefix?Object.keys(this.storage).filter(e=>e.startsWith(this.prefix))[t].substring(this.prefix.length):Object.keys(this.storage)[t]}removeItem(t){delete this.storage[this.prefix+t],this.api.setStorage(this.nativeId,this.storage)}setItem(t,e){t=ji(t),e=ji(e),this.storage[this.prefix+t]!==e&&(this.storage[this.prefix+t]=e,this.api.setStorage(this.nativeId,this.storage))}};Oe.StorageImpl=zt});var Uo=_(Ui=>{"use strict";Object.defineProperty(Ui,"__esModule",{value:!0});Ui.EndpointManagerImpl=void 0;var yt=Ge(),os=class{deviceManager;api;pluginId;mediaManager;getEndpoint(t){if(!t)return this.pluginId;let e=this.deviceManager.nativeIds.get(t)?.id;if(!e)throw new Error("invalid nativeId "+t);return t?e:this.pluginId}async getUrlSafeIp(){let t=await this.api.getComponent("SCRYPTED_IP_ADDRESS");return t?.includes(":")?`[${t}]`:t}async getAuthenticatedPath(t){return this.getPath(t)}async getInsecurePublicLocalEndpoint(t){return this.getLocalEndpoint(t,{insecure:!0,public:!0})}async getPublicCloudEndpoint(t){return this.getCloudEndpoint(t,{public:!0})}async getPublicLocalEndpoint(t){return this.getLocalEndpoint(t,{public:!0})}async getPublicPushEndpoint(t){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(t)),yt.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,yt.ScryptedMimeTypes.PushEndpoint)}async getPath(t,e){return`/endpoint/${this.getEndpoint(t)}/${e?.public?"public/":""}`}async getLocalEndpoint(t,e){let r=e?.insecure?"http":"https",s=await this.api.getComponent(e?.insecure?"SCRYPTED_INSECURE_PORT":"SCRYPTED_SECURE_PORT"),n=await this.getPath(t,e);return`${r}://${await this.getUrlSafeIp()}:${s}${n}`}async getCloudEndpoint(t,e){let r=await this.getLocalEndpoint(t,e),s=await this.mediaManager.createMediaObject(Buffer.from(r),yt.ScryptedMimeTypes.LocalUrl);return this.mediaManager.convertMediaObjectToUrl(s,yt.ScryptedMimeTypes.LocalUrl)}async getCloudPushEndpoint(t){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(t)),yt.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,yt.ScryptedMimeTypes.PushEndpoint)}async setLocalAddresses(t){return(await this.api.getComponent("addresses")).setLocalAddresses(t)}async getLocalAddresses(){return await(await this.api.getComponent("addresses")).getLocalAddresses()}async setAccessControlAllowOrigin(t){let e=this;return(await this.deviceManager.systemManager.getComponent("setAccessControlAllowOrigin"))(t)}};Ui.EndpointManagerImpl=os});var qo=_(Ze=>{"use strict";Object.defineProperty(Ze,"__esModule",{value:!0});Ze.WebSocketSerializer=Ze.WebSocketConnection=void 0;Ze.createWebSocketClass=_d;var as=me(),ls=class{events={};dispatchEvent(t){let e=this.events[t.type];if(e)for(let r of e)r(t)}addEventListener(t,e){let r=this.events[t];r||(r=this.events[t]=[]),r.push(e)}removeEventListener(t,e){let r=this.events[t];if(!r)return;let s=r.indexOf(e);s>-1&&r.splice(s,1)}};function qi(i,t){Object.defineProperty(i,"on"+t,{get:function(){throw new Error(`${t} is write only`)},set:function(e){this.events[t]=[e]}})}function _d(i){class t extends ls{connection;_url;_protocols;readyState;constructor(r,s){super(),this.connection=r,this._url=r.url,this._protocols=s,this.readyState=0,i(r,{connect:(n,o)=>{if(n!=null){this.dispatchEvent({type:"error",message:n.toString()});return}this.readyState=1,this.dispatchEvent({type:"open"})},end:()=>{this.readyState=3,this.dispatchEvent({type:"close",reason:"closed"})},error:n=>{this.readyState=3,this.dispatchEvent({type:"error",message:n.toString()})},data:n=>{this.dispatchEvent({type:"message",data:n,source:this})}})}send(r){this.connection.send(r)}get url(){return this._url}get extensions(){return""}close(r){this.connection.close(r)}}return qi(t.prototype,"close"),qi(t.prototype,"error"),qi(t.prototype,"message"),qi(t.prototype,"open"),t}var cs=class{url;websocketMethods;[as.RpcPeer.PROPERTY_PROXY_PROPERTIES];[as.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=["send","close"];constructor(t,e){this.url=t,this.websocketMethods=e,this[as.RpcPeer.PROPERTY_PROXY_PROPERTIES]={url:t}}send(t){return this.websocketMethods.send(t)}close(t){return this.websocketMethods.close(t)}};Ze.WebSocketConnection=cs;var ds=class{WebSocket;serialize(t,e){throw new Error("WebSocketSerializer should only be used for deserialization.")}deserialize(t,e){if(this.WebSocket)return new this.WebSocket(t)}};Ze.WebSocketSerializer=ds});var Wo=_(Je=>{"use strict";Object.defineProperty(Je,"__esModule",{value:!0});Je.EventRegistry=Je.EventListenerRegisterImpl=void 0;Je.getMixinEventName=Vo;var vd=Ge(),jt=class{removeListener;constructor(t){this.removeListener=t}};Je.EventListenerRegisterImpl=jt;function Vo(i){let{event:t,mixinId:e}=i||{};return!t&&typeof i=="string"&&(t=i),t||(t=void 0),e?`${t}-mixin-${e}`:t}var yd=new Set([vd.ScryptedInterface.ScryptedDevice,"Logger"]),us=class{systemListeners=new Set;listeners={};listen(t){let e=this.systemListeners;return e.add(t),new jt(()=>{e.delete(t),t=void 0})}listenDevice(t,e,r){let s=Vo(e),n=`${t}#${s}`,o=this.listeners[n];return o||(o=new Set,this.listeners[n]=o),o.add(r),new jt(()=>{o.delete(r),r=void 0})}notify(t,e,r,s,n,o){let{changed:a,mixinId:l}=o||{};if(s&&!a)return!1;let p={eventId:void 0,eventInterface:r,eventTime:e,property:s,mixinId:l};return this.notifyEventDetails(t,p,n)}notifyEventDetails(t,e,r,s){if(e.eventId||=Math.random().toString(36).substring(2),s||=e.eventInterface,e.property&&!e.mixinId||yd.has(s))for(let a of this.systemListeners)a(t,e,r);let n=this.listeners[`${t}#${s}`];if(n)for(let a of n)a(e,r);let o=this.listeners[`${t}#undefined`];if(o)for(let a of o)a(e,r);return!0}};Je.EventRegistry=us});var Yo=_(Vi=>{"use strict";Object.defineProperty(Vi,"__esModule",{value:!0});Vi.SystemManagerImpl=void 0;var U=Ge(),xd=Wo(),hs=me(),et=is();function Cd(i,t){let e=new ps(i,t);return new Proxy(e,e)}var ps=class{id;systemManager;customProperties;device;constructor(t,e){this.id=t,this.systemManager=e}toPrimitive(){return`ScryptedDevice-${this.id}`}ownKeys(t){let e=new Set(this.systemManager.state[this.id].interfaces.value),r=(0,et.getInterfaceMethods)(this.systemManager.descriptors||U.ScryptedInterfaceDescriptors,e),s=(0,et.getInterfaceProperties)(this.systemManager.descriptors||U.ScryptedInterfaceDescriptors,e);return[...r,...s]}getOwnPropertyDescriptor(t,e){let r=new Set(this.systemManager.state[this.id].interfaces.value),s=(0,et.getInterfaceMethods)(this.systemManager.descriptors||U.ScryptedInterfaceDescriptors,r),n=e.toString();if(s.includes(n))return{configurable:!0};if((0,et.getInterfaceProperties)(this.systemManager.descriptors||U.ScryptedInterfaceDescriptors,r).includes(n))return{configurable:!0,value:this.systemManager.state[this.id][n]?.value}}deleteProperty(t,e){let r=e.toString();return Object.keys(U.ScryptedInterfaceProperty).includes(r)?!1:(this.customProperties||=new Map,this.customProperties.set(e,void 0),!0)}set(t,e,r,s){let n=e.toString();return Object.keys(U.ScryptedInterfaceProperty).includes(n)?!1:(this.customProperties||=new Map,this.customProperties.set(e,r),!0)}get(t,e,r){if(e==="id")return this.id;if(this.customProperties?.has(e))return this.customProperties.get(e);let s=hs.RpcPeer.handleFunctionInvocations(this,t,e,r);if(s)return s;let n=new Set(this.systemManager.state[this.id].interfaces?.value||[]),o=e.toString();if(this.systemManager.propertyInterfaces?.[o]||et.propertyInterfaces[o])return this.systemManager.state[this.id]?.[e]?.value;if((0,et.isValidInterfaceMethod)(this.systemManager.descriptors||U.ScryptedInterfaceDescriptors,n,o))return U.ScryptedInterfaceDescriptors[U.ScryptedInterface.ScryptedDevice].methods.includes(o)?this[e].bind(this):new Proxy(()=>e,this)}ensureDevice(){return this.device||(this.device=this.systemManager.api.getDeviceById(this.id)),this.device}async apply(t,e,r){let s=t();return(await this.ensureDevice())[s](...r)}listen(t,e){return this.systemManager.listenDevice(this.id,t,e)}async setName(t){return this.systemManager.api.setDeviceProperty(this.id,U.ScryptedInterfaceProperty.name,t)}async setRoom(t){return this.systemManager.api.setDeviceProperty(this.id,U.ScryptedInterfaceProperty.room,t)}async setType(t){return this.systemManager.api.setDeviceProperty(this.id,U.ScryptedInterfaceProperty.type,t)}async setMixins(t){await(await this.systemManager.getComponent("plugins")).setMixins(this.id,t)}async probe(){return this.apply(()=>"probe",void 0,[])}},ms=class{promise;constructor(t){this.promise=t}async removeListener(){try{let t=await this.promise;this.promise=void 0,t?.removeListener()}catch(t){console.error("removeListener",t)}}};function Ko(i){let t=i,e=t[hs.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]||[];return e.includes(null)||e.push(null),t[hs.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=e,i}var fs=class{api;state;deviceProxies={};log;events=new xd.EventRegistry;typesVersion;descriptors;propertyInterfaces;getDeviceState(t){return this.state[t]}getSystemState(){return this.state}getDeviceById(t,e){let r;if(this.state[t]){if(e!=null)return;r=t}else for(let n of Object.keys(this.state)){let o=this.state[n];if(o&&o[U.ScryptedInterfaceProperty.pluginId]?.value===t&&o[U.ScryptedInterfaceProperty.nativeId]?.value==e){r=n;break}}if(!r)return;let s=this.deviceProxies[r];return s||(s=this.deviceProxies[r]=Cd(r,this)),s}getDeviceByName(t){for(let e of Object.keys(this.state)){let r=this.state[e];if(r.interfaces?.value?.includes(U.ScryptedInterface.ScryptedPlugin)&&r.pluginId?.value===t)return this.getDeviceById(e);if(r.name.value===t)return this.getDeviceById(e)}}listen(t){return this.events.listen(Ko((e,r,s)=>t(this.getDeviceById(e),r,s)))}listenDevice(t,e,r){let{watch:s}=e||{};return s?this.events.listenDevice(t,e,(n,o)=>r(this.getDeviceById(t),n,o)):new ms(this.api.listenDevice(t,e,Ko((n,o)=>r(this.getDeviceById(t),n,o))))}async removeDevice(t){return this.api.removeDevice(t)}getComponent(t){return this.api.getComponent(t)}setScryptedInterfaceDescriptors(t,e){return this.typesVersion=t,this.descriptors=e,this.propertyInterfaces=(0,et.getPropertyInterfaces)(e),this.api.setScryptedInterfaceDescriptors(t,e)}};Vi.SystemManagerImpl=fs});var Qo=_(Wi=>{"use strict";Object.defineProperty(Wi,"__esModule",{value:!0});Wi.ClusterManagerImpl=void 0;var gs=class{clusterMode;api;clusterWorkerId;clusterServicePromise;constructor(t,e,r){this.clusterMode=t,this.api=e,this.clusterWorkerId=r}getClusterWorkerId(){return this.clusterWorkerId}getClusterAddress(){return process.env.SCRYPTED_CLUSTER_ADDRESS}getClusterMode(){return this.clusterMode}async getClusterWorkers(){return(await this.getClusterService()).getClusterWorkers()}getClusterService(){return this.clusterServicePromise||=this.api.getComponent("cluster-fork"),this.clusterServicePromise}};Wi.ClusterManagerImpl=gs});var Zo=_(Ki=>{"use strict";Object.defineProperty(Ki,"__esModule",{value:!0});Ki.setupPluginRemote=Ed;Ki.attachPluginRemote=$d;var xt=Ge(),_s=me(),Go=es(),Xo=jo(),wd=Uo(),bs=qo(),kd=Yo(),Sd=Qo();async function Ed(i,t,e,r,s){try{i.constructorSerializerMap.get(Buffer)||i.addSerializer(Buffer,"Buffer",new Go.BufferSerializer);let o=await(await i.getParam("getRemote"))(t,e,r),a=i.tags.acl,l=(d,c)=>{if(c=c||s()[d],a&&c){c=Object.assign({},c);for(let f of Object.keys(c))a.shouldRejectProperty(d,f)&&delete c[f];let m=c.interfaces?.value;m&&(m=m.filter(f=>!a.shouldRejectInterface(d,f)),c.interfaces={value:m})}return c},p=()=>{let d=s();if(a){d=Object.assign({},d);for(let c of Object.keys(d)){if(a.shouldRejectDevice(c)){delete d[c];continue}d[c]=l(c,d[c])}}return d};return await o.setSystemState(p()),t.listen((d,c,m)=>{if(!a?.shouldRejectEvent(c.property===xt.ScryptedInterfaceProperty.id?m:d,c)){if(c.eventInterface===xt.ScryptedInterface.ScryptedDevice){c.property===xt.ScryptedInterfaceProperty.id?o.updateDeviceState(m,void 0):o.updateDeviceState(d,l(d));return}c.property&&!c.mixinId?o.notify(d,c,s()[d]?.[c.property]).catch(()=>{}):o.notify(d,c,m).catch(()=>{})}}),o}catch(n){throw new _s.RPCResultError(i,"error while retrieving PluginRemote",n)}}function $d(i,t){let{createMediaManager:e,getServicePort:r,getDeviceConsole:s,getMixinConsole:n}=t||{};i.constructorSerializerMap.get(Buffer)||i.addSerializer(Buffer,"Buffer",new Go.BufferSerializer);let o={},a=new bs.WebSocketSerializer;i.addSerializer(bs.WebSocketConnection,"WebSocketConnection",a);let l,p=new Promise(d=>l=d);return i.params.getRemote=async(d,c,m)=>{a.WebSocket=(0,bs.createWebSocketClass)((w,P)=>{let{url:I}=w;if(I.startsWith("io://")||I.startsWith("ws://")){let N=I.substring(5);o[N]=P,P.connect(void 0,{close:M=>w.close(M),send:M=>w.send(M)})}else throw new Error("unsupported websocket")}),d=await t?.onGetRemote?.(d,c)||d;let f=new kd.SystemManagerImpl,g=new Xo.DeviceManagerImpl(f,s,n),y=new wd.EndpointManagerImpl,C=new Sd.ClusterManagerImpl(void 0,d,void 0),R=await d.getMediaManager();R||(i.params.createMediaManager=async()=>e(f,g));let H=R||await e(f,g);i.params.mediaManager=H,f.api=d,g.api=d;let q=g.getDeviceLogger(void 0);f.log=q;let D={systemManager:f,deviceManager:g,endpointManager:y,mediaManager:H,clusterManager:C,log:q,pluginHostAPI:d,pluginRemoteAPI:void 0,serverVersion:m?.serverVersion,connect:void 0,fork:void 0,connectRPCObject:void 0};delete i.params.getRemote,y.api=d,y.deviceManager=g,y.mediaManager=H,y.pluginId=c;let re=new Xo.StorageImpl(g,void 0),fe={[_s.RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION]:!0,[_s.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]:["notify","updateDeviceState","setSystemState","ioEvent","setNativeId"],getServicePort:r,async createDeviceState(w,P){return g.createDeviceState(w,P)},async ioEvent(w,P,I){let N=o[w];if(N)switch(P){case"message":N.data(I);break;case"close":N.end(),delete o[w];break}},async setNativeId(w,P,I){w===null&&(w=void 0),P?g.nativeIds.set(w?.toString(),{id:P,storage:I}):g.nativeIds.delete(w)},async updateDeviceState(w,P){P?(f.state[w]=P,f.events.notify(w,void 0,xt.ScryptedInterface.ScryptedDevice,void 0,P,{changed:!0})):(delete f.state[w],f.events.notify(void 0,void 0,xt.ScryptedInterface.ScryptedDevice,xt.ScryptedInterfaceProperty.id,w,{changed:!0}))},async notify(w,P,I,N,M,Xt){if(typeof P=="number"){let se=P,ne=I;if(N){let ke=f.state?.[w];if(!ke){q.w(`state not found for ${w}`);return}ke[N]=M,f.events.notify(w,se,ne,N,M.value,{changed:Xt})}else f.events.notify(w,se,ne,N,M,{changed:Xt})}else{let se=P,ne=I;if(se.property&&!se.mixinId){let ke=f.state?.[w];if(!ke){q.w(`state not found for ${w}`);return}ke[se.property]=ne,f.events.notifyEventDetails(w,se,ne.value)}else f.events.notifyEventDetails(w,se,ne)}},async setSystemState(w){f.state=w,g.pruneMixinStorage(),l(D)},async loadZip(w,P,I){let N={__filename:void 0,deviceManager:g,systemManager:f,mediaManager:H,endpointManager:y,localStorage:re,pluginHostAPI:d,WebSocket:function(M){if(typeof M=="string")throw new Error("unsupported websocket");return M},pluginRuntimeAPI:D};N.pluginRuntimeAPI=D;try{return await t.onLoadZip(D,N,w,P,I)}catch(M){throw console.error("plugin start/fork failed",M),M}}};return D.pluginRemoteAPI=fe,fe},p}});var ys=_(Ct=>{"use strict";Object.defineProperty(Ct,"__esModule",{value:!0});Ct.createDuplexRpcPeer=Ad;Ct.createRpcSerializer=Jo;Ct.createRpcDuplexSerializer=vs;Ct.createDataChannelSerializer=Rd;var Td=es(),Pd=me();function Ad(i,t,e,r){let s=vs(r),n=new Pd.RpcPeer(i,t,(o,a,l)=>{try{s.sendMessage(o,a,l)}catch(p){a?.(p),e.destroy()}});return s.setupRpcPeer(n),e.on("data",o=>s.onData(o)),e.on("close",s.onDisconnected),e.on("error",s.onDisconnected),n}function Jo(i){let t,{sendMessageBuffer:e,sendMessageFinish:r}=i,s=!0,n=()=>{s=!1,t.kill("connection closed.")},o=(m,f,g)=>{if(!s){f?.(new Error("peer disconnected"));return}let y=g?.buffers;if(y)for(let C of y)e(C);r(m)},a;return{kill:m=>{t.kill(m)},sendMessage:o,setupRpcPeer:m=>{t=m,t.addSerializer(Buffer,"Buffer",new Td.SidebandBufferSerializer),t.constructorSerializerMap.set(Uint8Array,"Buffer")},onMessageBuffer:m=>{a=a||{},a.buffers||=[],a.buffers.push(m)},onMessageFinish:m=>{let f=a;a=void 0,t.handleMessage(m,f)},onDisconnected:n}}function vs(i){let t=(c,m)=>{let f=Buffer.alloc(5);f.writeUInt32BE(m.length+1,0),f.writeUInt8(c,4),i.write(Buffer.concat([f,m]))},e=c=>m=>t(c,m),r=e(1),s=e(0),n=Jo({sendMessageBuffer:r,sendMessageFinish:c=>s(Buffer.from(JSON.stringify(c)))}),o,a,l,p;return{onData:c=>{for(;c.length;){if(!a){if(o?o=Buffer.concat([o,c]):o=c,o.length<5)return;c=o.slice(5);let g=o.readUInt32BE(0)-1;p=o.readUInt8(4),c.length>=g&&p===0?(a=c.length===g?c:c.slice(0,g),l=g,c=c.slice(g)):(a=Buffer.alloc(g),l=0),o=void 0}let m=a.length-l;if(m){let g=c.slice(0,m);c=c.slice(m),a.set(g,l),l+=g.length}if(l!==a.length)return;let f=a;if(a=void 0,p===0)try{let g=JSON.parse(f.toString());n.onMessageFinish(g)}catch(g){n.kill("message parse failure "+g.message)}else n.onMessageBuffer(f)}},setupRpcPeer:n.setupRpcPeer,sendMessage:n.sendMessage,onDisconnected:n.onDisconnected}}function Rd(i){let t;function r(){if(!t||t.length===0)return;let a=t;t=void 0;for(let l of a){let p=0;for(;p<l.length;){let d=l.length-p,c=Math.min(d,16384),m=l.subarray(p,p+c);i.send(m),p+=c}}}function s(a){let l=!!t;t||(t=[]),t.push(a),l||setTimeout(()=>r(),0)}return vs({write:a=>{s(a)}})}});var ea=_((Hp,Md)=>{Md.exports={name:"@scrypted/client",version:"1.3.26",description:"",main:"dist/packages/client/src/index.js",scripts:{prebuild:"rimraf dist",build:"tsc --outDir dist",prepublishOnly:"npm run build",test:'echo "Error: no test specified" && exit 1'},author:"",license:"ISC",devDependencies:{"@types/ip":"^1.1.3","@types/node":"^24.0.10","@types/ws":"^8.18.1","ts-node":"^10.9.2",typescript:"^5.8.3"},peerDependencies:{"@scrypted/types":"^0.5.44"},dependencies:{"engine.io-client":"^6.6.3","follow-redirects":"^1.15.9",rimraf:"^6.0.1"}}});var ra=_(Ut=>{"use strict";Object.defineProperty(Ut,"__esModule",{value:!0});Ut.isIPV4Address=ta;Ut.isIPV6Address=ia;Ut.isIPAddress=Dd;var Ld=/^(\d{1,3}\.){3,3}\d{1,3}$/,Od=/^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;function ta(i){return Ld.test(i)}function ia(i){return Od.test(i)}function Dd(i){return ta(i)||ia(i)}});var xs=_(Y=>{"use strict";Object.defineProperty(Y,"__esModule",{value:!0});Y.fetchStatusCodeOk=sa;Y.checkStatus=na;Y.getFetchMethod=oa;Y.getHttpFetchAccept=aa;Y.hasHeader=Yi;Y.removeHeader=la;Y.setHeader=Qi;Y.setDefaultHttpFetchAccept=ca;Y.createHeadersArray=da;Y.createStringOrBufferBody=ua;Y.domFetchParseIncomingMessage=ha;Y.domFetch=Id;function sa(i){return i>=200&&i<=299}function na(i){if(!sa(i))throw new Error(`http response statusCode ${i}`);return!0}function oa(i){return i.method||(i.body?"POST":"GET")}function aa(i){switch(i){case"json":return"application/json";case"text":return"text/plain"}}function Yi(i,t){return t=t.toLowerCase(),i.find(([e])=>e.toLowerCase()===t)}function la(i,t){t=t.toLowerCase();let e=i.filter(([r,s])=>r.toLowerCase()!==t);i.length=0,e.forEach(r=>i.push(r))}function Qi(i,t,e){la(i,t),i.push([t,e])}function ca(i,t){if(Yi(i,"Accept"))return;let e=aa(t);e&&Qi(i,"Accept",e)}function da(i){let t=[];if(!i)return t;if(i instanceof Headers){for(let[e,r]of i.entries())t.push([e,r]);return t}if(i instanceof Array){for(let[e,r]of i)t.push([e,r]);return t}for(let e of Object.keys(i)){let r=i[e];t.push([e,r])}return t}function ua(i,t){let e;return typeof t=="object"?(t=JSON.stringify(t),e="application/json"):typeof t=="string"&&(e="text/plain"),e&&!Yi(i,"Content-Type")&&Qi(i,"Content-Type",e),Yi(i,"Content-Length")||(t=Buffer.from(t),Qi(i,"Content-Length",t.length.toString())),t}async function ha(i,t){switch(t){case"json":return i.json();case"text":return i.text();case"readable":return i}return new Uint8Array(await i.arrayBuffer())}async function Id(i){let t=da(i.headers);ca(t,i.responseType);let{body:e}=i;e&&!(e instanceof ReadableStream)&&(e=ua(t,e));let r,s;i.timeout&&(r=new AbortController,s=setTimeout(()=>r.abort(),i.timeout),i.signal?.addEventListener("abort",()=>r.abort(i.signal?.reason)));try{let{url:n}=i,o=await fetch(n,{method:oa(i),credentials:i.withCredentials?"include":void 0,headers:t,signal:r?.signal||i.signal,body:e});if(i?.checkStatusCode===void 0||i?.checkStatusCode)try{if(!(typeof i?.checkStatusCode=="function"?i.checkStatusCode:na)(o.status))throw new Error(`http response statusCode ${o.status}`)}catch(a){throw o.arrayBuffer().catch(()=>{}),a}return{statusCode:o.status,headers:o.headers,body:await ha(o,i.responseType)}}finally{clearTimeout(s)}}});var tt={};Va(tt,{default:()=>Hd});var Hd,it=qa(()=>{"use strict";Hd={}});var fa=_(Vt=>{"use strict";Object.defineProperty(Vt,"__esModule",{value:!0});Vt.getHttpFetchParser=pa;Vt.httpFetchParseIncomingMessage=ma;Vt.httpFetch=jd;var qt=xs();async function Xi(i){let t=[];i.on("data",r=>t.push(r));let{once:e}=(it(),nt(tt));return await e(i,"end"),Buffer.concat(t)}var Nd={async parse(i){return(await Xi(i)).toString()}},Fd={async parse(i){return JSON.parse((await Xi(i)).toString())}},Bd={async parse(i){return Xi(i)}},zd={async parse(i){return i}};function pa(i){switch(i){case"json":return Fd;case"text":return Nd;case"readable":return zd}return Bd}function ma(i,t){return pa(t).parse(i)}async function jd(i){let t=(0,qt.createHeadersArray)(i.headers);(0,qt.setDefaultHttpFetchAccept)(t,i.responseType);let{once:e}=(it(),nt(tt)),{PassThrough:r,Readable:s}=(it(),nt(tt)),{http:n,https:o}=(it(),nt(tt)),{url:a}=i,p=a.toString().startsWith("https:")?o:n,{body:d}=i;if(d&&!(d instanceof s)){let C=new r;C.write(Buffer.from((0,qt.createStringOrBufferBody)(t,d))),C.end(),d=C}let c,m;i.timeout&&(c=new AbortController,m=setTimeout(()=>c.abort(),i.timeout),i.signal?.addEventListener("abort",()=>c.abort(i.signal?.reason)));let f=c?.signal||i.signal;f?.addEventListener("abort",()=>y.destroy(new Error(i.signal?.reason||"abort")));let g={};for(let[C,R]of t)g[C]?g[C].push(R):g[C]=[R];let y=p.request(a,{method:(0,qt.getFetchMethod)(i),rejectUnauthorized:i.rejectUnauthorized,family:i.family,headers:g,signal:f,timeout:i.timeout});d?d.pipe(y):y.end();try{let[C]=await e(y,"response");if(i?.checkStatusCode===void 0||i?.checkStatusCode)try{let H=typeof i?.checkStatusCode=="function"?i.checkStatusCode:qt.checkStatus;if(!C.statusCode||!H(C.statusCode))throw new Error(`http response statusCode ${C.statusCode}`)}catch(H){throw Xi(C).catch(()=>{}),H}let R=new Headers;for(let[H,q]of Object.entries(C.headers))for(let D of typeof q=="string"?[q]:q)R.append(H,D);return{statusCode:C.statusCode,headers:R,body:await ma(C,i.responseType)}}finally{clearTimeout(m)}}});var va=_(A=>{"use strict";var Ud=A&&A.__createBinding||(Object.create?function(i,t,e,r){r===void 0&&(r=e);var s=Object.getOwnPropertyDescriptor(t,e);(!s||("get"in s?!t.__esModule:s.writable||s.configurable))&&(s={enumerable:!0,get:function(){return t[e]}}),Object.defineProperty(i,r,s)}:function(i,t,e,r){r===void 0&&(r=e),i[r]=t[e]}),qd=A&&A.__setModuleDefault||(Object.create?function(i,t){Object.defineProperty(i,"default",{enumerable:!0,value:t})}:function(i,t){i.default=t}),Es=A&&A.__importStar||function(){var i=function(t){return i=Object.getOwnPropertyNames||function(e){var r=[];for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(r[r.length]=s);return r},i(t)};return function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r=i(t),s=0;s<r.length;s++)r[s]!=="default"&&Ud(e,t,r[s]);return qd(e,t),e}}(),Vd=A&&A.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(A,"__esModule",{value:!0});A.ScryptedClientLoginError=A.rpc_serializer=A.rpc=void 0;A.logoutScryptedClient=tu;A.getCurrentBaseUrl=iu;A.loginScryptedClient=_a;A.checkScryptedClientLogin=Ss;A.redirectScryptedLogin=ru;A.combineBaseUrl=Yt;A.redirectScryptedLogout=su;A.connectScryptedClient=nu;var Cs=Es(go()),Wd=bo(),Kd=vo(),Yd=Zo(),ks=me(),ga=ys(),Qd=Vd(ea()),Xd=ra(),Gd=xs(),Zd=fa();A.rpc=Es(me());A.rpc_serializer=Es(ys());var Wt;try{throw new Error}catch{Wt=Gd.domFetch}var Jd=ks.RpcPeer.generateId();function ws(i,t){return new Promise((e,r)=>{let s=a=>{o(),r(a)},n=(...a)=>{o(),e(a)},o=()=>{i.removeListener("error",s),i.removeListener(t,n)};i.once("error",s),i.once(t,n)})}function ba(){return globalThis.navigator?.userAgent.includes("InstalledApp")}function eu(){return globalThis.matchMedia?.("(display-mode: standalone)").matches||ba()}async function tu(i){let t=Yt(i,"logout");return(await Wt({url:t,withCredentials:!0,responseType:"json",rejectUnauthorized:!1})).body}function iu(){let i=new URL(window.location.href);i.search="",i.hash="";let e=window.location.pathname.split("/"),r=e.findIndex(n=>n==="endpoint");if(r===-1)return;let s=e.slice(0,r);return s.push(""),i.pathname=s.join("/"),i.toString()}async function _a(i){let{baseUrl:t,username:e,password:r,change_password:s,maxAge:n}=i;!n&&eu()&&(n=365*24*60*60*1e3);let o=Yt(t,"login"),a=await Wt({url:o,body:{username:e,password:r,change_password:s,maxAge:n},rejectUnauthorized:!1,withCredentials:!0,responseType:"json"});if(a.statusCode!==200)throw new Error("status "+a.statusCode);let{body:l}=a;return{error:l.error,authorization:l.authorization,queryToken:l.queryToken,token:l.token,addresses:l.addresses,externalAddresses:l.externalAddresses,hostname:l.hostname,scryptedCloud:a.headers.get("x-scrypted-cloud")==="true",directAddress:a.headers.get("x-scrypted-direct-address"),cloudAddress:a.headers.get("x-scrypted-cloud-address"),serverId:a.headers.get("x-scrypted-server-id")}}async function Ss(i){let{baseUrl:t}=i||{},e=Yt(t,"login"),r=new Headers;if(i?.previousLoginResult?.queryToken){let o=i?.previousLoginResult.username+":"+i.previousLoginResult.token,a=Buffer.from(o).toString("base64");r.set("Authorization",`Basic ${a}`)}let s=await Wt({url:e,withCredentials:!0,headers:r,rejectUnauthorized:!1,responseType:"json"}),{body:n}=s;return{baseUrl:t,hostname:n.hostname,redirect:n.redirect,username:n.username,expiration:n.expiration,hasLogin:!!n.hasLogin,error:n.error,authorization:n.authorization,queryToken:n.queryToken,token:n.token,addresses:n.addresses,externalAddresses:n.externalAddresses,scryptedCloud:s.headers.get("x-scrypted-cloud")==="true",directAddress:s.headers.get("x-scrypted-direct-address"),cloudAddress:s.headers.get("x-scrypted-cloud-address"),serverId:s.headers.get("x-scrypted-server-id")}}var Kt=class extends Error{result;constructor(t){super(t.error),this.result=t}};A.ScryptedClientLoginError=Kt;function ru(i){let{baseUrl:t,redirect:e}=i||{};if(e=e||"/endpoint/@scrypted/core/public/",t){let s=new URL(e,t);s.searchParams.set("redirect_uri",window.location.href),e=s.toString()}else e=`${e}?redirect_uri=${encodeURIComponent(window.location.href)}`;let r=e;console.log("redirect_uri",r),globalThis.location.href=r}function Yt(i,t){return i?new URL(t,i).toString():"/"+t}async function su(i){globalThis.location.href=Yt(i,"logout")}async function nu(i){let t=Date.now(),{baseUrl:e,pluginId:r,clientName:s,username:n,password:o}=i,a,l,p,d,c,m,f,g,y,C;console.log("@scrypted/client",Qd.default.version);let R={},q=!globalThis.navigator?.userAgent.includes("Chrome")||ba(),D=!1;if(n&&o){let k=await _a(i);k.authorization&&(R.Authorization=k.authorization),p=k.addresses,d=k.externalAddresses,c=k.scryptedCloud,m=k.directAddress,f=k.cloudAddress,a=k.authorization,l=k.queryToken,y=k.token,g=k.hostname,C=k.serverId,console.log("login result",Date.now()-t,k)}else{let Q=function(O){if(O.error||O.redirect)throw new Kt(O);if(!O.authorization||!O.username||!O.queryToken)throw console.error(O),new Error("malformed login result");return O},k=new Set;if(i?.previousLoginResult?.token){for(let O of[...i?.previousLoginResult?.localAddresses||[],i?.previousLoginResult?.directAddress])O&&(q||i.direct)&&k.add(O);for(let O of[...i?.previousLoginResult?.externalAddresses||[],i?.previousLoginResult?.cloudAddress])O&&k.add(O)}let oe=[...k].map(O=>Ss({baseUrl:O,previousLoginResult:i?.previousLoginResult}).then(Q)),Jt=Ss({baseUrl:e,previousLoginResult:i?.previousLoginResult}).then(Q);oe.push(Jt);let L;try{L=await Promise.any(oe),D||=L.baseUrl!==e}catch{L=await Jt}if(D&&console.log("Found direct login. Allowing alternate addresses."),L.error||L.redirect)throw new Kt(L);p=L.addresses,d=L.externalAddresses,c=L.scryptedCloud,m=L.directAddress,f=L.cloudAddress,n=L.username,a=L.authorization,l=L.queryToken,y=L.token,g=L.hostname,C=L.serverId,console.log("login checked",Date.now()-t,L)}let re,fe=`endpoint/${r}/engine.io/api`,w=e?new URL(fe,e).pathname:"/"+fe,P=Math.random().toString(36).substring(3,10),I={path:w,query:{cacheBust:P},withCredentials:!0,extraHeaders:R,rejectUnauthorized:!1,transports:i?.transports},N=e||`${globalThis.location.protocol}//${globalThis.location.host}`,M=[],Xt=q;D||=c,(D&&i.local===void 0&&Xt||i.local)&&p&&M.push(...p);let se=m&&(q||!(0,Xd.isIPAddress)(m));if((D&&i.direct===void 0&&se||i.direct)&&m&&M.push(m),D&&i.direct===void 0||i.direct){f&&M.push(f);for(let k of d||[])M.push(k)}let ne=!!M.length;console.log({tryLocalAddressess:ne});let ke={...I,extraHeaders:{...I.extraHeaders}};ke.extraHeaders.Authorization||=a;let kt=[],Gt=[];if(ne)for(let k of new Set(M)){console.log("trying",k);let Q=new Cs.Socket(k,ke);kt.push(Q),Gt.push((async()=>(await ws(Q,"open"),{connectionType:"http-direct",ready:Q,address:k}))())}let Ta=[...Gt];Gt.push((async()=>{let k=ne?1e3:0;if(console.log("waiting",k),k)try{let oe=Promise.any(Ta);await(0,Wd.timeoutPromise)(k,oe),console.log("found direct connection, aborting scrypted cloud connection");return}catch{}let Q=new Cs.Socket(N,I);return kt.push(Q),await ws(Q,"open"),{ready:Q,address:N,connectionType:c?"http-cloud":"http"}})());let Pa=Promise.any(Gt),{ready:zs,connectionType:js,address:Zt,rpcPeer:Se}=await Pa;console.log("connected",js,Zt),re=zs,kt=kt.filter(k=>k!==zs),kt.forEach(k=>{try{k.close()}catch{}});try{if(!Se){let $=(0,ga.createRpcSerializer)({sendMessageBuffer:T=>re.send(T),sendMessageFinish:T=>re.send(JSON.stringify(T))});Se=new ks.RpcPeer(s||"engine.io-client","api",(T,z,ae)=>{try{$.sendMessage(T,z,ae)}catch(ti){z?.(ti)}}),re.on("message",T=>{T.constructor===Buffer||T.constructor===ArrayBuffer?$.onMessageBuffer(Buffer.from(T)):$.onMessageFinish(JSON.parse(T))}),$.setupRpcPeer(Se)}let k=await(0,Yd.attachPluginRemote)(Se,void 0),{serverVersion:Q,systemManager:oe,deviceManager:Jt,endpointManager:L,mediaManager:O,clusterManager:Aa}=k;console.log("api attached",Date.now()-t),O.createMediaObject=async($,T,z)=>new Kd.MediaObject(T,$,z);let[Ra]=await Promise.all([(async()=>{try{return!!await oe.getComponent("info")}catch{}return!1})()]);console.log("api initialized",Date.now()-t);let Ma=Object.keys(oe.getSystemState()).map($=>oe.getDeviceById($)).find($=>$.pluginId==="@scrypted/core"&&$.nativeId===`user:${n}`),ei=new Map,La=new FinalizationRegistry($=>{$.kill("object finalized")}),Oa=($,T)=>{if(!T?.dedicatedTransport){let ae=ei.get($.port);if(ae)return ae}let z=(async()=>{let ae="engine.io/connectRPCObject",ii={path:new URL(ae,Zt).pathname,query:{cacheBust:P,clusterObject:JSON.stringify($),...l},withCredentials:!0,extraHeaders:R,rejectUnauthorized:!1,transports:i?.transports},ge=new Cs.Socket(Zt,ii),rt=!1,Ee,G,le,qs=()=>{Ee&&(clearTimeout(Ee),Ee=void 0),G&&(clearTimeout(G),G=void 0)},Vs=T?.dedicatedTransport?.receiveTimeout?()=>{Ee&&clearTimeout(Ee),Ee=setTimeout(()=>{le&&le.kill("receive timeout")},T.dedicatedTransport.receiveTimeout)}:void 0,Ji=T?.dedicatedTransport?.sendTimeout?()=>{G&&clearTimeout(G),G=setTimeout(()=>{le&&le.kill("send timeout")},T.dedicatedTransport.sendTimeout)}:void 0;ge.on("close",()=>{if(le?.kill("socket closed"),T?.dedicatedTransport||ei.delete($.port),!rt)throw new Error("peer disconnected before setup completed")});try{await ws(ge,"open");let st=(0,ga.createRpcDuplexSerializer)({write:St=>{Ji?.(),ge.send(St)}});return ge.on("message",St=>{Vs?.(),st.onData(Buffer.from(St))}),le=new ks.RpcPeer(s||"engine.io-client","cluster-proxy",(St,Ws,Ha)=>{try{Ji?.(),st.sendMessage(St,Ws,Ha)}catch(Na){Ws?.(Na)}}),le.killedSafe.finally(()=>{qs(),ge.close()}),st.setupRpcPeer(le),le.tags.localPort=Jd,rt=!0,Vs?.(),Ji?.(),le}catch(st){throw qs(),console.error("failure ipc connect",st),ge.close(),st}})();return T?.dedicatedTransport||ei.set($.port,z),z},Da=async($,T)=>{let z=await ei.get(T);return z?.remoteWeakProxies?Object.values(z.remoteWeakProxies).find(ae=>ae.deref()?.__cluster?.proxyId==$)?.deref():null},Ia=async($,T)=>{let z=$?.__cluster;if(!z)return $;let{port:ae,proxyId:ti}=z,ii=await Da(ti,ae);if(ii)return ii;try{let rt=await Oa(z,T),Ee=await rt.getParam("connectRPCObject");try{let G=await Ee(z);if(!G)throw new Error("ipc object not found?");return T?.dedicatedTransport&&La.register(G,rt),G}catch(G){throw T?.dedicatedTransport&&rt.kill("connectRPCObject failed"),G}}catch(ge){return console.error("failure ipc",ge),$}},Us={userId:Ma?.id,serverVersion:Q,username:n,pluginRemoteAPI:void 0,address:Zt,connectionType:js,admin:Ra,systemManager:oe,clusterManager:Aa,deviceManager:Jt,endpointManager:L,mediaManager:O,disconnect(){Se.kill("disconnect requested")},pluginHostAPI:void 0,rpcPeer:Se,loginResult:{username:n,token:y,directAddress:m,localAddresses:p,externalAddresses:d,scryptedCloud:c,queryToken:l,authorization:a,cloudAddress:f,hostname:g,serverId:C},connectRPCObject:Ia,fork:void 0,connect:void 0};return re.on("close",()=>{Se.kill("socket closed")}),Se.killed.finally(()=>{re.close(),Us.onClose?.()}),Us}catch(k){throw re.close(),k}}});var si=globalThis,ni=si.ShadowRoot&&(si.ShadyCSS===void 0||si.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,er=Symbol(),Ys=new WeakMap,Et=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==er)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(ni&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=Ys.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Ys.set(e,t))}return t}toString(){return this.cssText}},Ie=i=>new Et(typeof i=="string"?i:i+"",void 0,er),x=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new Et(e,i,er)},Qs=(i,t)=>{if(ni)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=si.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},tr=ni?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return Ie(e)})(i):i;var{is:Ka,defineProperty:Ya,getOwnPropertyDescriptor:Qa,getOwnPropertyNames:Xa,getOwnPropertySymbols:Ga,getPrototypeOf:Za}=Object,oi=globalThis,Xs=oi.trustedTypes,Ja=Xs?Xs.emptyScript:"",el=oi.reactiveElementPolyfillSupport,$t=(i,t)=>i,ir={toAttribute(i,t){switch(t){case Boolean:i=i?Ja:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Zs=(i,t)=>!Ka(i,t),Gs={attribute:!0,type:String,converter:ir,reflect:!1,useDefault:!1,hasChanged:Zs};Symbol.metadata??=Symbol("metadata"),oi.litPropertyMetadata??=new WeakMap;var be=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Gs){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Ya(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:n}=Qa(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let a=s?.call(this);n?.call(this,o),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Gs}static _$Ei(){if(this.hasOwnProperty($t("elementProperties")))return;let t=Za(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($t("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($t("properties"))){let e=this.properties,r=[...Xa(e),...Ga(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(tr(s))}else t!==void 0&&e.push(tr(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Qs(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:ir).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=r.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:ir;this._$Em=s;let a=o.fromAttribute(e,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,r,s=!1,n){if(t!==void 0){let o=this.constructor;if(s===!1&&(n=this[t]),r??=o.getPropertyOptions(t),!((r.hasChanged??Zs)(n,e)||r.useDefault&&r.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,n]of r){let{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};be.elementStyles=[],be.shadowRootOptions={mode:"open"},be[$t("elementProperties")]=new Map,be[$t("finalized")]=new Map,el?.({ReactiveElement:be}),(oi.reactiveElementVersions??=[]).push("2.1.2");var sr=globalThis,Js=i=>i,ai=sr.trustedTypes,en=ai?ai.createPolicy("lit-html",{createHTML:i=>i}):void 0,nr="$lit$",_e=`lit$${Math.random().toFixed(9).slice(2)}$`,or="?"+_e,tl=`<${or}>`,Fe=document,Pt=()=>Fe.createComment(""),At=i=>i===null||typeof i!="object"&&typeof i!="function",ar=Array.isArray,an=i=>ar(i)||typeof i?.[Symbol.iterator]=="function",rr=`[ 	
\f\r]`,Tt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,tn=/-->/g,rn=/>/g,He=RegExp(`>|${rr}(?:([^\\s"'>=/]+)(${rr}*=${rr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),sn=/'/g,nn=/"/g,ln=/^(?:script|style|textarea|title)$/i,lr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),u=lr(1),F=lr(2),Du=lr(3),Be=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),on=new WeakMap,Ne=Fe.createTreeWalker(Fe,129);function cn(i,t){if(!ar(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return en!==void 0?en.createHTML(t):t}var dn=(i,t)=>{let e=i.length-1,r=[],s,n=t===2?"<svg>":t===3?"<math>":"",o=Tt;for(let a=0;a<e;a++){let l=i[a],p,d,c=-1,m=0;for(;m<l.length&&(o.lastIndex=m,d=o.exec(l),d!==null);)m=o.lastIndex,o===Tt?d[1]==="!--"?o=tn:d[1]!==void 0?o=rn:d[2]!==void 0?(ln.test(d[2])&&(s=RegExp("</"+d[2],"g")),o=He):d[3]!==void 0&&(o=He):o===He?d[0]===">"?(o=s??Tt,c=-1):d[1]===void 0?c=-2:(c=o.lastIndex-d[2].length,p=d[1],o=d[3]===void 0?He:d[3]==='"'?nn:sn):o===nn||o===sn?o=He:o===tn||o===rn?o=Tt:(o=He,s=void 0);let f=o===He&&i[a+1].startsWith("/>")?" ":"";n+=o===Tt?l+tl:c>=0?(r.push(p),l.slice(0,c)+nr+l.slice(c)+_e+f):l+_e+(c===-2?a:f)}return[cn(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},Rt=class i{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0,a=t.length-1,l=this.parts,[p,d]=dn(t,e);if(this.el=i.createElement(p,r),Ne.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=Ne.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(nr)){let m=d[o++],f=s.getAttribute(c).split(_e),g=/([.?@])?(.*)/.exec(m);l.push({type:1,index:n,name:g[2],strings:f,ctor:g[1]==="."?ci:g[1]==="?"?di:g[1]==="@"?ui:je}),s.removeAttribute(c)}else c.startsWith(_e)&&(l.push({type:6,index:n}),s.removeAttribute(c));if(ln.test(s.tagName)){let c=s.textContent.split(_e),m=c.length-1;if(m>0){s.textContent=ai?ai.emptyScript:"";for(let f=0;f<m;f++)s.append(c[f],Pt()),Ne.nextNode(),l.push({type:2,index:++n});s.append(c[m],Pt())}}}else if(s.nodeType===8)if(s.data===or)l.push({type:2,index:n});else{let c=-1;for(;(c=s.data.indexOf(_e,c+1))!==-1;)l.push({type:7,index:n}),c+=_e.length-1}n++}}static createElement(t,e){let r=Fe.createElement("template");return r.innerHTML=t,r}};function ze(i,t,e=i,r){if(t===Be)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl,n=At(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=ze(i,s._$AS(i,t.values),s,r)),t}var li=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??Fe).importNode(e,!0);Ne.currentNode=s;let n=Ne.nextNode(),o=0,a=0,l=r[0];for(;l!==void 0;){if(o===l.index){let p;l.type===2?p=new ot(n,n.nextSibling,this,t):l.type===1?p=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(p=new hi(n,this,t)),this._$AV.push(p),l=r[++a]}o!==l?.index&&(n=Ne.nextNode(),o++)}return Ne.currentNode=Fe,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},ot=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ze(this,t,e),At(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==Be&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):an(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&At(this._$AH)?this._$AA.nextSibling.data=t:this.T(Fe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Rt.createElement(cn(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new li(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=on.get(t.strings);return e===void 0&&on.set(t.strings,e=new Rt(t)),e}k(t){ar(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let n of t)s===e.length?e.push(r=new i(this.O(Pt()),this.O(Pt()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=Js(t).nextSibling;Js(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},je=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=h}_$AI(t,e=this,r,s){let n=this.strings,o=!1;if(n===void 0)t=ze(this,t,e,0),o=!At(t)||t!==this._$AH&&t!==Be,o&&(this._$AH=t);else{let a=t,l,p;for(t=n[0],l=0;l<n.length-1;l++)p=ze(this,a[r+l],e,l),p===Be&&(p=this._$AH[l]),o||=!At(p)||p!==this._$AH[l],p===h?t=h:t!==h&&(t+=(p??"")+n[l+1]),this._$AH[l]=p}o&&!s&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ci=class extends je{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},di=class extends je{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},ui=class extends je{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=ze(this,t,e,0)??h)===Be)return;let r=this._$AH,s=t===h&&r!==h||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==h&&(r===h||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},hi=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){ze(this,t)}},un={M:nr,P:_e,A:or,C:1,L:dn,R:li,D:an,V:ze,I:ot,H:je,N:di,U:ui,B:ci,F:hi},il=sr.litHtmlPolyfillSupport;il?.(Rt,ot),(sr.litHtmlVersions??=[]).push("3.3.3");var hn=(i,t,e)=>{let r=e?.renderBefore??t,s=r._$litPart$;if(s===void 0){let n=e?.renderBefore??null;r._$litPart$=s=new ot(t.insertBefore(Pt(),n),n,void 0,e??{})}return s._$AI(i),s};var cr=globalThis,v=class extends be{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=hn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Be}};v._$litElement$=!0,v.finalized=!0,cr.litElementHydrateSupport?.({LitElement:v});var rl=cr.litElementPolyfillSupport;rl?.({LitElement:v});(cr.litElementVersions??=[]).push("4.2.2");var sl={feeding:{domain:"binary_sensor",translationKeys:["feeding"],idSuffixes:["_feeding"]},eating:{domain:"binary_sensor",translationKeys:["eating"],idSuffixes:["_eating"]},bowlFill1:{domain:"sensor",translationKeys:["bowl_fill_1"],idSuffixes:["_bowl_fill_1","_bowl_fill_hopper_1"]},bowlFill2:{domain:"sensor",translationKeys:["bowl_fill_2"],idSuffixes:["_bowl_fill_2","_bowl_fill_hopper_2"]},hopperLevel1:{domain:"sensor",translationKeys:["hopper_1_level"],idSuffixes:["_hopper_1_level"]},hopperLevel2:{domain:"sensor",translationKeys:["hopper_2_level"],idSuffixes:["_hopper_2_level"]},desiccantDays:{domain:"sensor",translationKeys:["desiccant_days","desiccant_left"],idSuffixes:["_desiccant_days","_desiccant_left"]},schedule:{domain:"sensor",translationKeys:["schedule"],idSuffixes:["_schedule"]},scheduleCardState:{domain:"sensor",translationKeys:["schedule_card_state"],idSuffixes:["_schedule_card_state"]},feedButton:{domain:"button",translationKeys:["feed"],idSuffixes:["_feed"]},feedButtonHopper1:{domain:"button",translationKeys:["feed_hopper_1"],idSuffixes:["_feed_hopper_1"]},feedButtonHopper2:{domain:"button",translationKeys:["feed_hopper_2"],idSuffixes:["_feed_hopper_2"]},cancelFeedButton:{domain:"button",translationKeys:["cancel_feed"],idSuffixes:["_cancel_feed"]},feedAmount:{domain:"number",translationKeys:["feed_amount"],idSuffixes:["_feed_amount"]},feedAmountHopper1:{domain:"number",translationKeys:["feed_amount_hopper_1"],idSuffixes:["_feed_amount_hopper_1"]},feedAmountHopper2:{domain:"number",translationKeys:["feed_amount_hopper_2"],idSuffixes:["_feed_amount_hopper_2"]},cloudSwitch:{domain:"switch",translationKeys:["cloud","petkit_cloud"],idSuffixes:["_cloud","_petkit_cloud"]},cloudConnection:{domain:"sensor",translationKeys:["cloud_connection"],idSuffixes:["_cloud_connection"]},nightVisionSwitch:{domain:"switch",translationKeys:["night","night_vision"],idSuffixes:["_night","_night_vision"]},statusLedSwitch:{domain:"switch",translationKeys:["light","status_led"],idSuffixes:["_light","_status_led"]},microphoneSwitch:{domain:"switch",translationKeys:["microphone"],idSuffixes:["_microphone"]},volume:{domain:"number",translationKeys:["volume"],idSuffixes:["_volume"]},lastSeenPet:{domain:"sensor",translationKeys:["last_seen_pet"],idSuffixes:["_last_seen_pet"]},dishBefore:{domain:"image",translationKeys:["dish_before"],idSuffixes:["_dish_before"]},dishAfter:{domain:"image",translationKeys:["dish_after"],idSuffixes:["_dish_after"]},wifiNetwork:{domain:"sensor",translationKeys:["wifi_network","wifi","rssi"],idSuffixes:["_wifi_network","_wifi","_rssi"]},lastDetection:{domain:"sensor",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionsToday:{domain:"sensor",translationKeys:["detections_today"],idSuffixes:["_detections_today"]},lastDetectionImage:{domain:"image",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},pendingFace:{domain:"image",translationKeys:["pending_face"],idSuffixes:["_pending_face"]}};function pi(i){return i.slice(0,i.indexOf("."))}function dr(i){return i.slice(i.indexOf(".")+1)}function nl(i,t){if(pi(i.entity_id)!==t.domain)return!1;if(i.translation_key&&t.translationKeys.includes(i.translation_key))return!0;let e=dr(i.entity_id);return t.idSuffixes.some(r=>e.endsWith(r))}function ol(i){let t=i.name??i.original_name;if(t)return t.replace(/\s+present$/i,"").trim()||t;let s=dr(i.entity_id).replace(/_present$/,"").split("_").filter(Boolean).pop();return s?s[0].toUpperCase()+s.slice(1):"Cat"}function al(i){return pi(i.entity_id)!=="binary_sensor"?!1:i.translation_key==="present"||i.translation_key?.endsWith("_present")?!0:dr(i.entity_id).endsWith("_present")}function at(i,t){let e={deviceId:t,catPresence:[]},r=Object.values(i).filter(s=>s.device_id===t&&!s.disabled_by);for(let s of r){if(pi(s.entity_id)==="camera"&&!e.camera){e.camera=s.entity_id;continue}if(pi(s.entity_id)==="media_player"&&!e.speaker){e.speaker=s.entity_id;continue}if(al(s)){e.catPresence.push({entityId:s.entity_id,name:ol(s)});continue}for(let n of Object.entries(sl)){let[o,a]=n;if(!e[o]&&nl(s,a)){e[o]=s.entity_id;break}}}return e.catPresence.sort((s,n)=>s.name.localeCompare(n.name)),e}function lt(i,t){if(t)return i[t]?.config_entries?.[0]}function pn(i,t){let e=r=>r===void 0||r==="unavailable"||r==="unknown";return i.length===0||i.every(e)?"unreachable":t==="on"?"dispensing":"idle"}function ur(i,t){return i==="unreachable"?"Feeder unreachable \u2014 check that kibbled is running":i==="dispensing"?"Dispensing\u2026":t?`Fed ${t}`:"Ready to feed"}function ll(i,t){let e=Math.floor(Math.max(0,t.getTime()-i.getTime())/6e4);if(e<1)return{unit:"now",value:0};if(e<60)return{unit:"minutes",value:e};let r=Math.floor(e/60);return r<24?{unit:"hours",value:r}:{unit:"days",value:Math.floor(r/24)}}function Mt(i,t){let e=ll(i,t);if(e.unit==="now")return"just now";let r=e.unit==="minutes"?"min":e.unit==="hours"?"h":"d";return`${e.value} ${r} ago`}var cl={data:null,error:null,loading:!1},ee=class{constructor(t){this._lastWatched=null;this._requestId=0;this._state=cl;this._onChange=t}get state(){return this._state}sync(t,e){t!==this._lastWatched&&(this._lastWatched=t,this.refresh(e))}refresh(t){let e=++this._requestId;this._state={...this._state,loading:!0,error:null},this._onChange(),t().then(r=>{e===this._requestId&&(this._state={data:r,error:null,loading:!1},this._onChange())},r=>{e===this._requestId&&(this._state={...this._state,error:$e(r),loading:!1},this._onChange())})}};function Ue(i,t){return t.filter(e=>!!e).map(e=>`${e}=${i.states[e]?.state??""}`).join("|")}function $e(i){if(i instanceof Error)return i.message;if(i&&typeof i=="object"&&"message"in i){let t=i.message;if(typeof t=="string"&&t)return t}return"Something went wrong."}var dl={cog:"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",cloudCheck:"M13 19C13 19.34 13.04 19.67 13.09 20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.32 7.4 19 9.05 19 11C20.15 11.13 21.1 11.63 21.86 12.5C22.37 13.07 22.7 13.71 22.86 14.42C21.82 13.54 20.5 13 19 13C18.89 13 18.79 13 18.68 13C18.62 13 18.56 13 18.5 13H17V11C17 9.62 16.5 8.44 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18H13.09C13.04 18.33 13 18.66 13 19M17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84L17.75 19.43Z",cloudLock:"M6.5 18H13V20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.08 7.16 18.73 8.5 18.93 10C18.23 10 17.56 10.19 16.95 10.46C16.84 9.31 16.38 8.31 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18M23 17.3V20.8C23 21.4 22.4 22 21.7 22H16.2C15.6 22 15 21.4 15 20.7V17.2C15 16.6 15.6 16 16.2 16V14.5C16.2 13.1 17.6 12 19 12S21.8 13.1 21.8 14.5V16C22.4 16 23 16.6 23 17.3M20.5 14.5C20.5 13.7 19.8 13.2 19 13.2S17.5 13.7 17.5 14.5V16H20.5V14.5Z",cloudAlert:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M11 7H13V13H11V7Z",cloudQuestion:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M14.43 8.68C14.97 9.13 15.24 9.75 15.24 10.5C15.24 11 15.09 11.41 14.8 11.82C14.5 12.21 14.13 12.5 13.67 12.75C13.41 12.91 13.24 13.07 13.15 13.26C13.06 13.45 13 13.69 13 14H11C11 13.45 11.11 13.08 11.3 12.82C11.5 12.56 11.85 12.25 12.37 11.91C12.63 11.75 12.84 11.56 13 11.32C13.15 11.09 13.23 10.81 13.23 10.5C13.23 10.18 13.14 9.94 12.96 9.76C12.78 9.56 12.5 9.47 12.2 9.47C11.93 9.47 11.71 9.55 11.5 9.7C11.35 9.85 11.25 10.08 11.25 10.39H9.28C9.23 9.64 9.5 9 10.06 8.59C10.6 8.2 11.31 8 12.2 8C13.14 8 13.89 8.23 14.43 8.68Z",airFilter:"M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",wifi:"M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",weatherNight:"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",ledOn:"M11,0V4H13V0H11M18.3,2.29L15.24,5.29L16.64,6.71L19.7,3.71L18.3,2.29M5.71,2.29L4.29,3.71L7.29,6.71L8.71,5.29L5.71,2.29M12,6A4,4 0 0,0 8,10V16H6V18H9V23H11V18H13V23H15V18H18V16H16V10A4,4 0 0,0 12,6M2,9V11H6V9H2M18,9V11H22V9H18Z",microphone:"M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z",microphoneOff:"M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z",volumeOff:"M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z",volumeHigh:"M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",openInNew:"M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",speaker:"M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",refresh:"M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"};function V(i){return F`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d=${dl[i]}></path></svg>`}var fn="#F4A452",gn="#DE8A3A",bn="#3A2C28",_n="#E5484D",mn=["#3FA7A0","#9A5B9E","#7FA05A","#4F86C6"];function mi(i){let t=mn.length;return mn[(i%t+t)%t]}function vn(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0}function hr(i){return i==="empty"||i==="low"||i==="ok"?i:null}var yn={empty:"empty",low:"running low"};function xn(i,t){if(i===null&&t===null)return null;let e=[[1,i],[2,t]].filter(s=>s[1]!==null&&s[1]!=="ok");if(e.length===0)return{text:"Hopper stocked",tone:"ok"};let r=e.some(([,s])=>s==="empty")?"empty":"low";return e.length===2&&e[0][1]===e[1][1]?{text:`Hopper ${yn[e[0][1]]}`,tone:r}:{text:e.map(([s,n])=>`Hopper ${s} ${yn[n]}`).join(" \xB7 "),tone:r}}function Cn(i,t){return i===null&&t===null?{split:!1,hopper1:null,hopper2:null,combined:null}:i===null||t===null?{split:!1,hopper1:i,hopper2:t,combined:i??t}:Math.abs(i-t)<5?{split:!1,hopper1:i,hopper2:t,combined:Math.round((i+t)/2)}:{split:!0,hopper1:i,hopper2:t,combined:null}}var fr=240,wn=176,qe=120,ye=34,Ve=10,gi=fr-Ve*2,hl=18,pr=158,fi=44,ve=ye+8,ce=124,kn=32,Sn=10,pl=9,ml=[-.5,-.2,.1,.4,-.35,.25,0];function fl(i,t,e,r){let s=[0,120,240].map(n=>{let o=(n+r)*Math.PI/180;return F`<circle cx=${(i+Math.cos(o)*e*.55).toFixed(1)} cy=${(t+Math.sin(o)*e*.55).toFixed(1)} r=${(e*.62).toFixed(1)} />`});return F`<g>${s}</g>`}function En(){let i=Ve,t=Ve+gi,e=9;return[`M ${i+e} ${ye}`,`H ${t-e}`,`q ${e} 0 ${e} ${e}`,`C ${t} ${ye+70}, ${qe+fi+30} ${pr-10}, ${qe+fi} ${pr}`,`H ${qe-fi}`,`C ${qe-fi-30} ${pr-10}, ${i} ${ye+70}, ${i} ${ye+e}`,`q 0 ${-e} ${e} ${-e}`,"Z"].join(" ")}function mr(i,t){let r=ce-ve,s=Math.min(18,(t-i)*.16);return[`M ${i} ${ve}`,`H ${t}`,`C ${t} ${ve+r*.55}, ${t-s+14} ${ce}, ${t-s-14} ${ce}`,`H ${i+s+14}`,`C ${i+s-14} ${ce}, ${i} ${ve+r*.55}, ${i} ${ve}`,"Z"].join(" ")}var gr=class extends v{constructor(){super();this._wasFeeding=!1;this._dropping=!1;this.hopper1=null,this.hopper2=null,this.hopperLevel1=null,this.hopperLevel2=null,this.feeding=!1}static{this.properties={hopper1:{type:Number},hopper2:{type:Number},hopperLevel1:{type:String},hopperLevel2:{type:String},feeding:{type:Boolean}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._dropTimer)}willUpdate(e){e.has("feeding")&&(this.feeding&&!this._wasFeeding&&!vn()&&(this._dropping=!0,clearTimeout(this._dropTimer),this._dropTimer=setTimeout(()=>{this._dropping=!1,this.requestUpdate()},900)),this._wasFeeding=this.feeding)}render(){let e=Cn(this.hopper1,this.hopper2),r=e.split?`Bowl side 1 ${Math.round(e.hopper1)}%, side 2 ${Math.round(e.hopper2)}%`:e.combined==null?"Bowl level unknown":`Bowl ${Math.round(e.combined)}% full`,s=Ve+kn,n=Ve+gi-kn,o=e.split?[{x0:s,x1:qe-Sn/2,mark:"01",fraction:e.hopper1/100},{x0:qe+Sn/2,x1:n,mark:"02",fraction:e.hopper2/100}]:[{x0:s,x1:n,mark:null,fraction:e.combined==null?null:e.combined/100}],a=xn(this.hopperLevel1,this.hopperLevel2);return u`
      <svg class="art" viewBox="0 0 ${fr} ${wn}" role="img" aria-label=${r} preserveAspectRatio="xMidYMid meet">
        <title>${r}</title>
        <defs>
          <linearGradient id="silo-body" x1="0" x2="1">
            <stop offset="0" stop-color="var(--silo-shade)" />
            <stop offset="0.18" stop-color="var(--silo-light)" />
            <stop offset="0.62" stop-color="var(--silo-mid)" />
            <stop offset="1" stop-color="var(--silo-dark)" />
          </linearGradient>
          <linearGradient id="silo-cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--silo-light)" />
            <stop offset="1" stop-color="var(--silo-shade)" />
          </linearGradient>
          <linearGradient id="silo-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--silo-glass-edge)" />
            <stop offset="1" stop-color="var(--silo-glass)" />
          </linearGradient>
          <linearGradient id="silo-food" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--kibble-amber)" />
            <stop offset="1" stop-color="var(--kibble-amber-dark)" />
          </linearGradient>
          <filter id="silo-inner" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4" /></filter>
          ${o.map((l,p)=>F`<clipPath id=${`silo-win-${p}`}><path d=${mr(l.x0,l.x1)} /></clipPath>`)}
        </defs>
        <path class="body" d=${En()} />
        <rect class="cap" x=${Ve-4} y=${ye-4} width=${gi+8} height=${hl} rx="9" />
        <rect class="cap-highlight" x=${Ve+6} y=${ye} width=${gi-12} height="4" rx="2" />
        <path class="body-edge" d=${En()} />
        ${o.map((l,p)=>this._renderCavity(l,p))}
        ${this._dropping?this._renderFallingKibble():h}
      </svg>
      ${a?u`<div class="hopper" data-tone=${a.tone} role="status">${a.text}</div>`:h}
    `}_renderCavity(e,r){let s=`url(#silo-win-${r})`,n=e.x1-e.x0,o=e.x0+n/2;if(e.fraction==null)return F`
        <g>
          <path class="glass" d=${mr(e.x0,e.x1)} />
          <text class="unknown" x=${o} y=${(ve+ce)/2+2} text-anchor="middle" dominant-baseline="central">?</text>
          ${e.mark?F`<text class="mark" x=${o} y=${ye+9} text-anchor="middle">${e.mark}</text>`:h}
        </g>
      `;let a=Math.max(0,Math.min(1,e.fraction)),l=ce-(ce-ve)*a,p=[];if(a>0){let d=0;for(let c=l+6;c<ce;c+=pl,d+=1){let m=Math.max(1,Math.floor(n/14));for(let f=0;f<m;f+=1){let g=e.x0+7+f*14+(d%2===0?0:7);g<e.x1-6&&p.push(F`<circle cx=${g.toFixed(1)} cy=${c.toFixed(1)} r="2.6" />`)}}}return F`
      <g>
        <path class="glass" d=${mr(e.x0,e.x1)} />
        <g clip-path=${s}>
          <rect class="glass-inner" x=${e.x0-2} y=${ve-8} width=${n+4} height=${ce-ve+4} filter="url(#silo-inner)" />
          ${a>0?F`
                <rect class="fill" x=${e.x0} y=${l} width=${n} height=${ce-l+2} />
                <g class="texture">${p}</g>
                <rect class="fill-surface" x=${e.x0} y=${l} width=${n} height="2" />
              `:h}
        </g>
        ${e.mark?F`<text class="mark" x=${o} y=${ye+9} text-anchor="middle">${e.mark}</text>`:h}
      </g>
    `}_renderFallingKibble(){let e=ml.map((r,s)=>{let n=qe+r*40,l=`--fall-delay:${s*70}ms;--fall-duration:380ms;--fall-rotate:${(r*180).toFixed(0)}deg;--fall-to:34px;`;return F`<g class="drop" style=${l}>${fl(n,4,6,r*60)}</g>`});return F`<g class="drops">${e}</g>`}static{this.styles=x`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      min-height: 0;
      /* The plastic: the card background lifted toward the text colour in four steps, so the
       * lit face, the mid tone, the turned edges and the rim all come from the theme. */
      --silo-base: var(--card-background-color, var(--ha-card-background, #fff));
      --silo-ink: var(--primary-text-color, #222);
      --silo-light: color-mix(in srgb, var(--silo-base) 78%, var(--silo-ink));
      --silo-mid: color-mix(in srgb, var(--silo-base) 84%, var(--silo-ink));
      --silo-shade: color-mix(in srgb, var(--silo-base) 68%, var(--silo-ink));
      --silo-dark: color-mix(in srgb, var(--silo-base) 58%, var(--silo-ink));
      /* The cavity is the bowl's interior: always darker than the plastic, in both themes, so
       * the level reads as something inside the dish. */
      --silo-glass: color-mix(in srgb, var(--silo-base) 40%, #000);
      --silo-glass-edge: color-mix(in srgb, var(--silo-base) 52%, #000);
    }
    .art {
      display: block;
      width: auto;
      max-width: var(--kibble-bowl-max-width, 190px);
      flex: 1 1 auto;
      min-height: 0;
      max-height: 100%;
      aspect-ratio: ${fr} / ${wn};
      margin: 0 auto;
      overflow: visible;
    }
    /* The hopper line: secondary text when stocked, the card's amber when a side is running
     * low, the theme's error colour when one is empty. */
    .hopper {
      flex: none;
      margin-top: 4px;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.01em;
      line-height: 1.2;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .hopper[data-tone="low"] {
      color: var(--kibble-amber-dark);
    }
    .hopper[data-tone="empty"] {
      color: var(--error-color, #db4437);
      font-weight: 600;
    }
    .body {
      fill: url(#silo-body);
    }
    /* On a light card the near-white plastic needs an edge to read as an object; on a dark
     * card the same 0.14 alpha of the text colour is invisible, which is the point. */
    .body-edge {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-opacity: 0.14;
      stroke-width: 1;
    }
    .cap {
      fill: url(#silo-cap);
    }
    .cap-highlight {
      fill: var(--silo-ink);
      opacity: 0.16;
    }
    .glass {
      fill: url(#silo-glass);
    }
    .glass-inner {
      fill: #000;
      opacity: 0.35;
    }
    .fill {
      fill: url(#silo-food);
      transition: y 500ms cubic-bezier(0.2, 0.8, 0.2, 1), height 500ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .texture circle {
      fill: var(--kibble-amber-dark);
      opacity: 0.55;
    }
    .fill-surface {
      fill: #fff;
      opacity: 0.5;
    }
    .unknown {
      /* Same ink as the printed rim marks, just larger: legible against the dark cavity in
       * either theme, still clearly a label rather than a level. */
      fill: var(--secondary-text-color, var(--primary-text-color));
      font-size: 36px;
      font-weight: 700;
      opacity: 0.6;
    }
    .mark {
      fill: var(--secondary-text-color, var(--primary-text-color));
      opacity: 0.7;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.14em;
      font-family: inherit;
    }
    .drops circle {
      fill: var(--kibble-amber-dark);
      animation: kibble-drop var(--fall-duration) cubic-bezier(0.4, 0, 1, 1) var(--fall-delay) both;
    }
    @keyframes kibble-drop {
      from {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
      }
      15% {
        opacity: 1;
      }
      to {
        transform: translateY(var(--fall-to)) rotate(var(--fall-rotate));
        opacity: 0;
      }
    }
  `}};customElements.define("kibble-bowl",gr);var gl=[1,2,3,4,5],br=class extends v{static{this.properties={value:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.disabled=!1}render(){return u`
      <div class="segments" role="radiogroup" aria-label="Feed amount, portions">
        ${gl.map(t=>u`
            <button
              type="button"
              role="radio"
              aria-checked=${t===this.value}
              class="segment ${t===this.value?"selected":""}"
              ?disabled=${this.disabled}
              @click=${()=>this._select(t)}
            >
              ${t}
            </button>
          `)}
      </div>
    `}_select(t){this.dispatchEvent(new CustomEvent("portion-selected",{detail:{value:t},bubbles:!0,composed:!0}))}static{this.styles=x`
    :host {
      display: block;
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
      transition: background-color 0.15s ease, color 0.15s ease, transform 0.08s ease;
    }
    /* Press feedback -- the small tactile detail that makes a touch panel feel native. */
    .segment:active:not(:disabled) {
      transform: scale(0.96);
    }
    .segment.selected {
      background: var(--kibble-amber);
      color: var(--kibble-ink-on-amber);
    }
    .segment:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .segment:focus-visible {
      outline: 2px solid var(--kibble-amber-dark);
      outline-offset: 2px;
    }
  `}};customElements.define("kibble-segmented-picker",br);var _r=class extends v{static{this.properties={value:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.min=1,this.max=20,this.step=1,this.disabled=!1}render(){return u`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value<=this.min} @click=${this._decrement} aria-label="Fewer portions">
          &minus;
        </button>
        <span class="value">${this.value}</span>
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value>=this.max} @click=${this._increment} aria-label="More portions">
          &plus;
        </button>
      </div>
    `}_decrement(){this._emit(Math.max(this.min,this.value-this.step))}_increment(){this._emit(Math.min(this.max,this.value+this.step))}_emit(t){this.dispatchEvent(new CustomEvent("value-selected",{detail:{value:t},bubbles:!0,composed:!0}))}static{this.styles=x`
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
  `}};customElements.define("kibble-stepper",_r);var vr=class extends v{constructor(){super();this._holding=!1;this._holdTimer=void 0;this._startHold=e=>{this.disabled||(e.preventDefault(),this._holding=!0,this.requestUpdate(),clearTimeout(this._holdTimer),this._holdTimer=setTimeout(()=>{this._holding=!1,this.requestUpdate(),this._activate()},this.holdMs))};this._cancelHold=()=>{clearTimeout(this._holdTimer),this._holding&&(this._holding=!1,this.requestUpdate())};this.label="Hold to feed",this.variant="feed",this.disabled=!1,this.holdMs=600}static{this.properties={label:{type:String},variant:{type:String},disabled:{type:Boolean},holdMs:{type:Number,attribute:"hold-ms"}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._holdTimer)}render(){return u`
      <button
        type="button"
        class="button ${this.variant} ${this._holding?"holding":""}"
        ?disabled=${this.disabled}
        style=${this.variant==="feed"?`--hold-ms: ${this.holdMs}ms`:""}
        @pointerdown=${this.variant==="feed"?this._startHold:void 0}
        @pointerup=${this.variant==="feed"?this._cancelHold:void 0}
        @pointerleave=${this.variant==="feed"?this._cancelHold:void 0}
        @pointercancel=${this.variant==="feed"?this._cancelHold:void 0}
        @click=${this.variant==="cancel"?this._tapActivate:void 0}
      >
        ${this.variant==="feed"?u`<span class="fill"></span>`:""}
        <span class="label">${this.label}</span>
      </button>
    `}_tapActivate(){this.disabled||this._activate()}_activate(){this.dispatchEvent(new CustomEvent("activate",{bubbles:!0,composed:!0}))}static{this.styles=x`
    :host {
      display: block;
    }
    .button {
      position: relative;
      width: 100%;
      height: var(--kibble-feed-button-height, 56px);
      border: none;
      /* Fully rounded: the primary action should read as one confident pill, matching the
         segmented picker above it. */
      border-radius: 999px;
      background: var(--kibble-amber);
      color: var(--kibble-ink-on-amber);
      font-size: var(--kibble-feed-label-size, 18px);
      font-weight: 700;
      cursor: pointer;
      overflow: hidden;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      transition: transform 0.08s ease, box-shadow 0.15s ease;
      box-shadow: 0 1px 2px color-mix(in srgb, var(--kibble-amber-dark) 35%, transparent);
    }
    .button:active:not(:disabled) {
      transform: scale(0.985);
      box-shadow: none;
    }
    .button.cancel {
      background: color-mix(in srgb, var(--kibble-amber-dark) 12%, transparent);
      color: var(--kibble-amber-dark);
      box-shadow: none;
    }
    .button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .button:focus-visible {
      outline: 2px solid var(--primary-text-color);
      outline-offset: 2px;
    }
    .fill {
      position: absolute;
      inset: 0;
      background: var(--kibble-amber-dark);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 150ms ease-out;
    }
    .button.holding .fill {
      transform: scaleX(1);
      transition: transform var(--hold-ms, 600ms) linear;
    }
    .label {
      position: relative;
      z-index: 1;
    }
  `}};customElements.define("kibble-hold-button",vr);var{I:bh}=un;var $n=i=>i.strings===void 0;var Tn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},yr=i=>(...t)=>({_$litDirective$:i,values:t}),bi=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var Lt=(i,t)=>{let e=i._$AN;if(e===void 0)return!1;for(let r of e)r._$AO?.(t,!1),Lt(r,t);return!0},_i=i=>{let t,e;do{if((t=i._$AM)===void 0)break;e=t._$AN,e.delete(i),i=t}while(e?.size===0)},Pn=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),yl(t)}};function _l(i){this._$AN!==void 0?(_i(this),this._$AM=i,Pn(this)):this._$AM=i}function vl(i,t=!1,e=0){let r=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(t)if(Array.isArray(r))for(let n=e;n<r.length;n++)Lt(r[n],!1),_i(r[n]);else r!=null&&(Lt(r,!1),_i(r));else Lt(this,i)}var yl=i=>{i.type==Tn.CHILD&&(i._$AP??=vl,i._$AQ??=_l)},vi=class extends bi{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,r){super._$AT(t,e,r),Pn(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(Lt(this,t),_i(this))}setValue(t){if($n(this._$Ct))this._$Ct._$AI(t,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var Z=()=>new Cr,Cr=class{},xr=new WeakMap,X=yr(class extends vi{render(i){return h}update(i,[t]){let e=t!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=t,this.ht=i.options?.host,this.rt(this.ct=i.element)),h}rt(i){if(this.G!==void 0)if(this.isConnected||(i=void 0),typeof this.G=="function"){let t=this.ht??globalThis,e=xr.get(t);e===void 0&&(e=new WeakMap,xr.set(t,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,i),i!==void 0&&this.G.call(this.ht,i)}else this.G.value=i}get lt(){return typeof this.G=="function"?xr.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function An(i){let t=/^(\d{1,2}):(\d{2})$/.exec(i.trim());if(!t)throw new Error(`Invalid schedule time "${i}"`);let e=Number(t[1]),r=Number(t[2]);if(e>23||r>59)throw new Error(`Invalid schedule time "${i}"`);return e*60+r}function xl(i,t){let e=t.getHours()*60+t.getMinutes(),r=null;for(let s of i){if(!s.enabled)continue;let o=((An(s.time)-e)%1440+1440)%1440;(r===null||o<r.minutesUntil)&&(r={entry:s,minutesUntil:o})}return r}function wr(i,t){let e=An(i);return new Date(2e3,0,1,Math.floor(e/60),e%60).toLocaleTimeString(t,{hour:"numeric",minute:"2-digit"})}var Cl=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function Rn(i,t,e){if(i.length===0)return"No schedule set";let r=xl(i,t);if(!r)return"All feeds paused";let s=i.filter(o=>o.enabled).length,n=Cl[s]??String(s);return`Next feed ${wr(r.entry.time,e)}, ${n} a day`}var kr="dispenser-schedule-card",Sr=class extends v{constructor(){super();this._expanded=!1;this._embedRef=Z();this._configureEmbed=e=>{if(!e||!this.scheduleCardStateEntity)return;let r=e.querySelector(kr);if(r){r.hass=this.hass;return}let s=document.createElement(kr);s.setConfig({type:"custom:dispenser-schedule-card",device:{type:"custom",entity:this.scheduleCardStateEntity,max_entries:24,min_amount:1,max_amount:20,step_amount:1,status_map:["0 -> dispensed","1 -> failed","2 -> pending","3 -> dispensing"],status_pattern:"(?<id>[^,]+),(?<hour>[0-9]{1,2}),(?<minute>[0-9]{1,2}),(?<amount>[0-9]{1,2}),(?<status>[0-9]);?",actions:{add:"kibble.schedule_card_add",edit:"kibble.schedule_card_edit",remove:"kibble.schedule_card_remove",toggle:"kibble.schedule_card_toggle"}},unit_of_measurement:{one:"portion",other:"portions"}}),s.hass=this.hass,e.appendChild(s)};this.entries=[],this.deviceName="Kibble"}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},scheduleCardStateEntity:{type:String},deviceName:{type:String}}}updated(){this._embedRef.value&&this.hass&&(this._embedRef.value.hass=this.hass)}render(){let e=new Date,r=Rn(this.entries,e);return u`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${r}</span>
        <span class="chevron ${this._expanded?"open":""}">${V("chevronDown")}</span>
      </button>
      ${this._expanded?u`<div class="expanded">${this._renderExpanded()}</div>`:h}
    `}_renderExpanded(){if(this._canEmbed())return u`<div ${X(this._configureEmbed)}></div>`;if(this.entries.length===0)return u`<p class="empty">No schedule set</p>`;let e=[...this.entries].sort((r,s)=>r.time.localeCompare(s.time));return u`
      <ul class="entries">
        ${e.map(r=>u`
            <li class=${r.enabled?"":"disabled"}>
              <span class="time">${wr(r.time)}</span>
              <span class="amounts">${r.amount_l}g + ${r.amount_r}g</span>
              <span class="state">${r.enabled?"On":"Paused"}</span>
            </li>
          `)}
      </ul>
    `}_canEmbed(){if(!customElements.get(kr)||!this.scheduleCardStateEntity)return!1;let e=this.hass?.states[this.scheduleCardStateEntity];return e!==void 0&&e.state!=="unavailable"}_toggle(){this._expanded=!this._expanded,this.requestUpdate()}static{this.styles=x`
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
  `}};customElements.define("kibble-schedule-summary",Sr);var wl=3e3;function yi(i,t){if(!t)return null;let e=i.states[t];if(!e)return null;let r=Number(e.state);return Number.isNaN(r)?null:{value:r,min:Number(e.attributes.min??1),max:Number(e.attributes.max??20),step:Number(e.attributes.step??1)}}var Er=class extends v{constructor(){super();this._cloudConfirmArmed=!1;this._cloudConfirmTimer=void 0;this.open=!1}static{this.properties={hass:{attribute:!1},entities:{attribute:!1},open:{type:Boolean,reflect:!0}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._cloudConfirmTimer)}render(){if(!this.open)return h;let e=this.entities;return u`
      <div class="backdrop" @click=${this._close}></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Kibble settings" @keydown=${this._onKeydown}>
        <header>
          <h2>Settings</h2>
          <button type="button" class="icon-button" @click=${this._close} aria-label="Close">${V("close")}</button>
        </header>
        <div class="body">
          ${e.feedButtonHopper1||e.feedButtonHopper2?this._renderHopperSection():h}
          ${e.feedAmount?this._renderMoreAmountSection():h}
          ${this._renderToggles()}
          ${e.volume?this._renderVolume():h}
          ${e.cloudSwitch?this._renderCloud():h}
          ${e.wifiNetwork?this._renderWifi():h}
          ${e.dishBefore||e.dishAfter?this._renderDishPhotos():h}
          ${e.speaker?this._renderSpeaker():h}
          <button type="button" class="device-link" @click=${this._openDevicePage}>
            Open device page ${V("openInNew")}
          </button>
        </div>
      </div>
    `}_renderMoreAmountSection(){let e=yi(this.hass,this.entities.feedAmount);return e?u`
      <section>
        <h3>Feed amount</h3>
        ${this._renderStepper(this.entities.feedAmount,e)}
      </section>
    `:h}_renderHopperSection(){let{feedAmountHopper1:e,feedAmountHopper2:r,feedButtonHopper1:s,feedButtonHopper2:n}=this.entities;return u`
      <section>
        <h3>Per-hopper feed</h3>
        <p class="hint">
          Targets one auger's amount byte. This feeder's firmware spins both augers anyway, so
          expect roughly double into the bowl until a hopper divider is fitted.
        </p>
        <div class="hoppers">
          ${e?u`
                <div class="hopper">
                  <span class="hopper-label">Hopper 1</span>
                  ${this._renderStepper(e,yi(this.hass,e))}
                  ${s?u`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(s)}></kibble-hold-button>`:h}
                </div>
              `:h}
          ${r?u`
                <div class="hopper">
                  <span class="hopper-label">Hopper 2</span>
                  ${this._renderStepper(r,yi(this.hass,r))}
                  ${n?u`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(n)}></kibble-hold-button>`:h}
                </div>
              `:h}
        </div>
      </section>
    `}_renderStepper(e,r){return r?u`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${r.value<=r.min} @click=${()=>this._setNumber(e,Math.max(r.min,r.value-r.step))}>
          &minus;
        </button>
        <span class="step-value">${r.value}</span>
        <button type="button" class="step-btn" ?disabled=${r.value>=r.max} @click=${()=>this._setNumber(e,Math.min(r.max,r.value+r.step))}>
          &plus;
        </button>
      </div>
    `:h}_renderToggles(){let r=[{id:this.entities.nightVisionSwitch,icon:"weatherNight",label:"Night vision"},{id:this.entities.statusLedSwitch,icon:"ledOn",label:"Status LED"},{id:this.entities.microphoneSwitch,icon:"microphone",label:"Microphone"}].filter(s=>s.id!==void 0);return r.length===0?h:u`
      <section>
        <h3>Device</h3>
        ${r.map(s=>this._renderToggleRow(s.id,s.icon,s.label))}
      </section>
    `}_renderToggleRow(e,r,s){let n=this.hass.states[e],o=n?.state==="on",a=!n||n.state==="unavailable";return u`
      <button type="button" class="toggle-row" ?disabled=${a} @click=${()=>this._toggleSwitch(e)}>
        <span class="toggle-icon">${V(r)}</span>
        <span class="toggle-label">${s}</span>
        <span class="toggle-pill ${o?"on":""}"><span class="toggle-knob"></span></span>
      </button>
    `}_renderVolume(){let e=yi(this.hass,this.entities.volume);return e?u`
      <section>
        <h3>Volume</h3>
        <input
          type="range"
          min=${e.min}
          max=${e.max}
          step=${e.step}
          .value=${String(e.value)}
          @change=${r=>this._setNumber(this.entities.volume,Number(r.target.value))}
        />
      </section>
    `:h}_renderCloud(){let r=this.hass.states[this.entities.cloudSwitch]?.state==="on",s=this.entities.cloudConnection?this.hass.states[this.entities.cloudConnection]?.state:void 0;return u`
      <section>
        <h3>Petkit cloud</h3>
        <p class="hint">${s?`Connection: ${s}`:"Turns the feeder's cloud link on or off."}</p>
        <button type="button" class="cloud-toggle ${this._cloudConfirmArmed?"confirming":""}" @click=${this._onCloudToggleClick}>
          ${this._cloudConfirmArmed?`Tap again to turn ${r?"off":"on"}`:r?"On \u2014 tap to turn off":"Off \u2014 tap to turn on"}
        </button>
      </section>
    `}_renderWifi(){let e=this.hass.states[this.entities.wifiNetwork];return u`
      <section>
        <h3>Wi-Fi</h3>
        <p class="hint">${e?e.state:"Unavailable"}</p>
      </section>
    `}_renderDishPhotos(){let e=this.entities.dishBefore?this.hass.states[this.entities.dishBefore]:void 0,r=this.entities.dishAfter?this.hass.states[this.entities.dishAfter]:void 0;return(!e||e.state==="unavailable")&&(!r||r.state==="unavailable")?h:u`
      <section>
        <h3>Last feed</h3>
        <div class="dish-photos">
          ${e&&e.state!=="unavailable"?u`<img src=${String(e.attributes.entity_picture??"")} alt="Before" />`:h}
          ${r&&r.state!=="unavailable"?u`<img src=${String(r.attributes.entity_picture??"")} alt="After" />`:h}
        </div>
      </section>
    `}_renderSpeaker(){let e=this.hass.states[this.entities.speaker];if(!e)return h;let r=typeof e.attributes.volume_level=="number"?e.attributes.volume_level:.5;return u`
      <section>
        <h3>Speaker</h3>
        <p class="hint">${e.state}</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          .value=${String(r)}
          @change=${s=>this.hass.callService("media_player","volume_set",{volume_level:Number(s.target.value)},{entity_id:this.entities.speaker})}
        />
      </section>
    `}_pressButton(e){this.hass.callService("button","press",{},{entity_id:e})}_toggleSwitch(e){this.hass.callService("switch","toggle",{},{entity_id:e})}_setNumber(e,r){this.hass.callService("number","set_value",{value:r},{entity_id:e})}_onCloudToggleClick(){if(this._cloudConfirmArmed){clearTimeout(this._cloudConfirmTimer),this._cloudConfirmArmed=!1,this._toggleSwitch(this.entities.cloudSwitch),this.requestUpdate();return}this._cloudConfirmArmed=!0,this.requestUpdate(),this._cloudConfirmTimer=setTimeout(()=>{this._cloudConfirmArmed=!1,this.requestUpdate()},wl)}_openDevicePage(){let e=this.entities.deviceId;history.pushState(null,"",`/config/devices/device/${e}`),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0})),this._close()}_onKeydown(e){e.key==="Escape"&&this._close()}_close(){this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}static{this.styles=x`
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
    .dish-photos {
      display: flex;
      gap: 10px;
    }
    .dish-photos img {
      width: 50%;
      border-radius: 8px;
      object-fit: cover;
      aspect-ratio: 4 / 3;
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
  `}};customElements.define("kibble-settings-dialog",Er);function J(i,t,e){let r=t.split("/").map(s=>encodeURIComponent(s)).join("/");return`/api/kibble/${encodeURIComponent(i)}/image/${r}/${encodeURIComponent(e)}`}var Te=class{constructor(){this._urls=new Map;this._pending=new Map}get(t,e,r){let s=this._urls.get(e);if(s)return this._urls.delete(e),this._urls.set(e,s),s;let n=this._pending.get(e);if(n)return n.then(()=>r(this._urls.get(e)??null)),null;let o=this._fetch(t,e).then(a=>{this._pending.delete(e),a&&this._remember(e,a),r(a)});return this._pending.set(e,o),null}async _fetch(t,e){if(!t.fetchWithAuth)return null;try{let r=await t.fetchWithAuth(e);if(!r.ok)return null;let s=await r.blob();return URL.createObjectURL(s)}catch{return null}}_remember(t,e){for(this._urls.set(t,e);this._urls.size>200;){let r=this._urls.keys().next().value;if(r===void 0)break;let s=this._urls.get(r);this._urls.delete(r),s&&URL.revokeObjectURL(s)}}dispose(){for(let t of this._urls.values())URL.revokeObjectURL(t);this._urls.clear(),this._pending.clear()}};function Mn(){return F`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `}function Ln(i){let t=0;for(let e=0;e<i.length;e++)t=t*31+i.charCodeAt(e)|0;return mi(t)}var $r=class extends v{constructor(){super();this._cache=new Te;this._imageUrl=null;this._resolvedPath=null;this.name=null,this.colorIndex=null,this.sampleName=null}static{this.properties={hass:{attribute:!1},name:{type:String},colorIndex:{type:Number,attribute:"color-index"},entryId:{type:String,attribute:"entry-id"},sampleName:{type:String,attribute:"sample-name"}}}disconnectedCallback(){super.disconnectedCallback(),this._cache.dispose()}willUpdate(){let e=this.entryId&&this.name&&this.sampleName?J(this.entryId,`sample/${this.name}`,this.sampleName):null;e!==this._resolvedPath&&(this._resolvedPath=e,this._imageUrl=null,!(!e||!this.hass)&&(this._imageUrl=this._cache.get(this.hass,e,r=>{this._resolvedPath===e&&(this._imageUrl=r,this.requestUpdate())})))}render(){if(!this.name)return u`<div class="avatar neutral">${Mn()}</div>`;let e=this.colorIndex!=null?mi(this.colorIndex):Ln(this.name);return u`
      <div class="avatar" style="--kibble-avatar-color: ${e}">
        ${this._imageUrl?u`<img src=${this._imageUrl} alt="" />`:u`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `}static{this.styles=x`
    :host {
      display: inline-block;
      width: var(--kibble-avatar-size, 32px);
      height: var(--kibble-avatar-size, 32px);
      flex: 0 0 auto;
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      background: var(--kibble-avatar-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar.neutral {
      background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent);
      color: var(--secondary-text-color);
      padding: 18%;
      box-sizing: border-box;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .monogram {
      color: #fff;
      font-weight: 600;
      font-size: calc(var(--kibble-avatar-size, 32px) * 0.42);
      line-height: 1;
      user-select: none;
    }
  `}};customElements.define("kibble-avatar",$r);var ya=Wa(va(),1);function Ts(i){for(let t of Object.values(i.entities??{}))if(t.platform==="scrypted"&&t.entity_id.startsWith("sensor.scrypted_token")){let e=i.states[t.entity_id]?.state;if(e&&e!=="unavailable"&&e!=="unknown")return e}}var $s=class{constructor(){this.options={proxy:!0,userAgent:navigator.userAgent,capabilities:{audio:RTCRtpReceiver.getCapabilities?.("audio")??{codecs:[],headerExtensions:[]},video:RTCRtpReceiver.getCapabilities?.("video")??{codecs:[],headerExtensions:[]}},screen:{devicePixelRatio:window.devicePixelRatio,width:screen.width,height:screen.height}};this.__proxy_props={options:this.options}}async getOptions(){return this.options}createPeerConnection(t){if(this.pc)return this.pc;let e=new RTCPeerConnection(t.configuration);this.pc=e,e.addEventListener("iceconnectionstatechange",()=>{["disconnected","failed","closed"].includes(e.iceConnectionState)&&this.onClosed?.()});let r=new MediaStream;if(e.addEventListener("track",s=>{r.addTrack(s.track),this.onTrack?.(r)}),t.datachannel&&e.createDataChannel(t.datachannel.label,t.datachannel.dict),t.audio){let s=e.addTransceiver("audio",t.audio);(t.audio.direction==="sendrecv"||t.audio.direction==="sendonly")&&(this.microphone=s.sender)}return t.video&&e.addTransceiver("video",t.video),e}async createLocalDescription(t,e,r){let s=this.createPeerConnection(e),n=new Promise(p=>{s.onicecandidate=d=>{d.candidate?r?.(JSON.parse(JSON.stringify(d.candidate))):p()},s.onicegatheringstatechange=()=>{s.iceGatheringState==="complete"&&p()}}),o=t==="offer"?await s.createOffer({offerToReceiveAudio:!!e.audio,offerToReceiveVideo:!!e.video}):await s.createAnswer(),a=s.setLocalDescription(o);if(r)return{type:o.type,sdp:o.sdp};await a,await n;let l=s.localDescription??o;return{type:l.type,sdp:l.sdp}}async setRemoteDescription(t,e){await this.createPeerConnection(e).setRemoteDescription(t)}async addIceCandidate(t){await this.pc?.addIceCandidate(t)}async endSession(){}async setMicrophone(t){if(!this.microphone)throw new Error("this stream has no return-audio channel");if(t&&!this.micTrack){let e=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1});this.micTrack=e.getAudioTracks()[0],await this.microphone.replaceTrack(this.micTrack)}this.micTrack&&(this.micTrack.enabled=t)}close(){this.micTrack?.stop(),this.pc?.getSenders().forEach(t=>t.track?.stop()),this.pc?.close(),this.pc=void 0}},Gi=class{constructor(t){this.state="idle";this.hasIntercom=!1;this.onChange=t}async open(t,e){this.close(),this.setState("connecting");try{let r=`${location.origin}/api/scrypted/${t.token}/`,s=await(0,ya.connectScryptedClient)({baseUrl:r,pluginId:"@scrypted/core",clientName:"kibble-card"});this.client=s;let n=s.systemManager.getDeviceById(t.deviceId);if(!n)throw new Error(`Scrypted has no device ${t.deviceId}`);let o=n.interfaces??[];if(!o.includes("RTCSignalingChannel"))throw new Error(`${n.name} has no WebRTC channel in Scrypted`);this.hasIntercom=o.includes("Intercom");let a=new $s;this.session=a,a.onTrack=p=>{e.srcObject!==p&&(e.srcObject=p,e.play().catch(()=>{})),this.setState("live")},a.onClosed=()=>{this.session===a&&this.fail("stream disconnected")};let l=n;this.control=await l.startRTCSignalingSession(a)}catch(r){throw this.fail(r instanceof Error?r.message:String(r)),r}}async talk(t){if(!this.session)throw new Error("not connected");await this.session.setMicrophone(t),await this.control?.setPlayback({audio:t,video:!0})}close(){this.control?.setPlayback({audio:!1,video:!0}).catch(()=>{}),this.control=void 0,this.session?.close(),this.session=void 0,this.client?.disconnect?.(),this.client=void 0,this.state!=="idle"&&this.setState("idle")}fail(t){this.error=t,this.session?.close(),this.session=void 0,this.setState("error")}setState(t){this.state=t,t!=="error"&&(this.error=void 0),this.onChange()}};function xa(i){return Math.min(i*2,3e4)}var ou=8e3,au=2e3,lu=6e4,Ps=class extends v{constructor(){super();this._starting=!1;this._backoffMs=1e3;this._lastProgress=0;this._hiddenPaused=!1;this._live=new Gi(()=>{this._tick=(this._tick??0)+1});this._start=async()=>{let e=Ts(this.hass);if(!e||!this.scryptedId)return;this._starting=!0,this._playing=!0,this._lastProgress=performance.now(),await this.updateComplete;let r=this.renderRoot.querySelector("#video");if(!r){this._starting=!1;return}try{await this._live.open({deviceId:this.scryptedId,token:e},r),this._reconnecting=!1,this._backoffMs=1e3}catch{this._beginReconnect();return}finally{this._starting=!1}};this._onTimeUpdate=()=>{this._lastProgress=performance.now()};this._checkStall=()=>{!this._playing||this._reconnecting||document.hidden||performance.now()-this._lastProgress>ou&&this._beginReconnect()};this._onVisibilityChange=()=>{if(document.hidden){clearTimeout(this._hiddenTimer),this._hiddenTimer=setTimeout(this._pauseForHidden,lu);return}if(clearTimeout(this._hiddenTimer),this._hiddenTimer=void 0,this._hiddenPaused){this._hiddenPaused=!1,this._backoffMs=1e3,this.requestUpdate();return}this._playing&&(this._lastProgress=performance.now())};this._pauseForHidden=()=>{this._hiddenTimer=void 0,!(!this._playing&&!this._reconnecting)&&(this._hiddenPaused=!0,this._reconnecting=!1,clearTimeout(this._reconnectTimer),this._reconnectTimer=void 0,this._live.close(),this._playing=!1,this._talking=!1)};this._stop=()=>{clearTimeout(this._reconnectTimer),this._reconnectTimer=void 0,clearTimeout(this._hiddenTimer),this._hiddenTimer=void 0,this._live.close(),this._playing=!1,this._talking=!1,this._starting=!1,this._reconnecting=!1,this._hiddenPaused=!1,this._backoffMs=1e3};this._toggleMute=()=>{this._muted=!this._muted,this._applyMute()};this._applyMute=()=>{let e=this.renderRoot.querySelector("#video");e&&(e.muted=this._muted,e.play().catch(()=>{}))};this._toggleTalk=async()=>{let e=!this._talking;this._talking=e;try{await this._live.talk(e)}catch{e&&(this._talking=!1)}};this._playing=!1,this._talking=!1,this._muted=!0,this._reconnecting=!1,this._tick=0}static{this.properties={hass:{attribute:!1},cameraEntity:{attribute:!1},scryptedId:{attribute:!1},_playing:{state:!0},_talking:{state:!0},_muted:{state:!0},_reconnecting:{state:!0},_tick:{state:!0}}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),this._stallCheckInterval=setInterval(this._checkStall,au)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibilityChange),clearInterval(this._stallCheckInterval),this._stallCheckInterval=void 0,this._stop()}updated(){if(this._live.state==="error"&&this._playing){this._beginReconnect();return}this._playing||this._starting||this._reconnecting||this._hiddenPaused||!this.hass||!this.scryptedId||!Ts(this.hass)||this._start()}render(){return u`
      <div class="frame">
        ${this._renderStill()}
        ${this._playing?this._renderVideo():h}
        ${this._reconnecting?u`<div class="reconnect" role="status" aria-label="Reconnecting to the feeder's camera">${V("refresh")}</div>`:h}
        <div class="controls">
          ${this._playing?u`<button
                class="chip"
                aria-pressed=${!this._muted}
                aria-label=${this._muted?"Unmute the feeder":"Mute the feeder"}
                title=${this._muted?"Unmute the feeder":"Mute the feeder"}
                @click=${this._toggleMute}
              >
                ${V(this._muted?"volumeOff":"volumeHigh")}
              </button>`:h}
          ${this._playing&&this._live.hasIntercom?u`<button
                class="chip talk"
                aria-pressed=${this._talking}
                aria-label=${this._talking?"Stop talking to the feeder":"Talk to the feeder"}
                title=${this._talking?"Stop talking to the feeder":"Talk to the feeder"}
                @click=${this._toggleTalk}
              >
                ${V(this._talking?"microphone":"microphoneOff")}
              </button>`:h}
        </div>
        ${this._live.state==="error"&&!this._reconnecting?u`<div class="note error">${this._live.error}</div>`:h}
      </div>
    `}_renderVideo(){return u`<video
      id="video"
      autoplay
      playsinline
      ?muted=${this._muted}
      @loadedmetadata=${this._applyMute}
      @timeupdate=${this._onTimeUpdate}
    ></video>`}_renderStill(){if(!this.cameraEntity)return u`<div class="placeholder">No camera on this device</div>`;if(customElements.get("hui-image"))return u`<hui-image .hass=${this.hass} .cameraImage=${this.cameraEntity} cameraView="auto"></hui-image>`;let e=this.hass.states[this.cameraEntity]?.attributes.entity_picture;return typeof e=="string"?u`<img src=${e} alt="The feeder's camera" />`:u`<div class="placeholder">Camera unavailable</div>`}_beginReconnect(){this._playing=!1,this._reconnecting=!0,this._talking=!1,this._live.close(),this._reconnectTimer===void 0&&(this._reconnectTimer=setTimeout(()=>{this._reconnectTimer=void 0,this._start()},this._backoffMs),this._backoffMs=xa(this._backoffMs))}static{this.styles=x`
    :host {
      display: block;
      height: 100%;
    }
    .frame {
      position: absolute;
      inset: 0;
      background: #101010;
    }
    video,
    img,
    hui-image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    video {
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
  `}};customElements.define("kibble-live-hero",Ps);async function Ca(){return customElements.get("bubble-card")?!0:(await Promise.race([customElements.whenDefined("bubble-card"),new Promise(i=>setTimeout(i,2e3))]),!!customElements.get("bubble-card"))}var As=class extends v{constructor(){super(...arguments);this._builtFor=""}static{this.properties={hass:{attribute:!1},config:{attribute:!1}}}updated(){this._sync()}async _sync(){if(!this.config)return;let e=JSON.stringify(this.config);if(e!==this._builtFor){this._builtFor=e;let r=await window.loadCardHelpers?.();if(!r||e!==this._builtFor)return;let s=r.createCardElement({type:"custom:bubble-card",...this.config});this._element?.remove(),this._element=s,this.renderRoot.querySelector(".slot")?.appendChild(s)}this._element&&this.hass&&(this._element.hass=this.hass)}render(){return u`<div class="slot"></div>`}static{this.styles=x`
    :host {
      display: block;
    }
    .slot > * {
      /* Bubble rows carry their own outer margin for stacking; the card lays them out itself. */
      --bubble-margin: 0;
    }
  `}};customElements.define("kibble-bubble-row",As);var cu=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"scrypted_id",selector:{text:{}}},{name:"settings_hash",selector:{text:{}}},{name:"schedule_hash",selector:{text:{}}}],du={device_id:"Kibble device",name:"Name (optional)",scrypted_id:"Scrypted camera id (live view + talk)",settings_hash:"Settings pop-up hash (optional)",schedule_hash:"Schedule handled by dashboard (optional hash)"},Rs=class extends v{constructor(){super(...arguments);this._computeLabel=e=>du[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?u`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${cu}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():h}_renderFallback(){let e=Object.values(this.hass?.entities??{}),r=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return u`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${r.map(s=>u`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
          <span>Schedule pop-up hash (optional)</span>
          <input
            type="text"
            placeholder="#schedule"
            .value=${this._config?.schedule_hash??""}
            @change=${s=>this._updateScheduleHash(s.target.value)}
          />
        </label>
      </div>
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateSettingsHash(e){this._config&&(this._config={...this._config,settings_hash:e||void 0},this._fireConfigChanged())}_updateScheduleHash(e){this._config&&(this._config={...this._config,schedule_hash:e||void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=x`
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
  `}};customElements.define("kibble-card-editor",Rs);function wt(i){return i.kind==="identified"?i.paired_class==="eat"?`${i.cat} ate`:`${i.cat} was here`:i.kind==="eat"?"A cat ate":"A cat came by"}function wa(i,t){return t?i:i.filter(e=>e.kind!=="visit")}function ka(i){let t=!i.manual;if(i.amount==null)return{headline:"Fed",scheduled:t};let e=i.amount===1?"portion":"portions",r=i.hopper&&i.hopper!=="both"?` from hopper ${i.hopper}`:"";return{headline:`Fed ${i.amount} ${e}${r}`,scheduled:t}}function Qt(i){return`${i.getFullYear()}-${i.getMonth()}-${i.getDate()}`}function uu(i,t){if(Qt(i)===Qt(t))return"Today";let e=new Date(t.getFullYear(),t.getMonth(),t.getDate()-1);return Qt(i)===Qt(e)?"Yesterday":i.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}function Sa(i,t){let e=[],r=null;for(let s of i){let n=new Date(s.ts*1e3),o=Qt(n);o!==r&&(r=o,e.push({label:uu(n,t),items:[]})),e[e.length-1].items.push(s)}return e}var Ms=class extends v{constructor(){super();this._closeButtonRef=Z();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&(e.preventDefault(),this._close())};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.imageUrl=null,this.alt=""}static{this.properties={open:{type:Boolean,reflect:!0},imageUrl:{type:String},alt:{type:String}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler)}updated(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus()}render(){return this.open?u`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.alt||"Photo"}>
        <div class="frame" @click=${e=>e.stopPropagation()}>
          ${this.imageUrl?u`<img src=${this.imageUrl} alt=${this.alt} />`:h}
          <button type="button" class="close" aria-label="Close" ${X(this._closeButtonRef)} @click=${this._close}>
            ${V("close")}
          </button>
        </div>
      </div>
    `:h}static{this.styles=x`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.72);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 32px;
      box-sizing: border-box;
    }
    .frame {
      position: relative;
      max-width: min(90vw, 720px);
      max-height: 90vh;
    }
    img {
      display: block;
      max-width: 100%;
      max-height: 90vh;
      border-radius: 8px;
      object-fit: contain;
    }
    .close {
      position: absolute;
      top: -16px;
      right: -16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: #fff;
      color: #111;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
    .close:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: no-preference) {
      .backdrop {
        animation: kibble-lightbox-fade 120ms ease-out;
      }
    }
    @keyframes kibble-lightbox-fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `}};customElements.define("kibble-lightbox",Ms);var hu=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"limit",selector:{number:{min:1,mode:"box"}}},{name:"show_visits",selector:{boolean:{}}}],pu={device_id:"Kibble device",name:"Name (optional)",limit:"Rows before \u201CShow more\u201D (optional, default 30)",show_visits:"Show bare \u201Ca cat came by\u201D rows (optional, default off)"},Ls=class extends v{constructor(){super(...arguments);this._computeLabel=e=>pu[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?u`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${hu}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():h}_renderFallback(){let e=Object.values(this.hass?.entities??{}),r=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return u`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${r.map(s=>u`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
        <label class="checkbox">
          <input
            type="checkbox"
            .checked=${this._config?.show_visits??!1}
            @change=${s=>this._updateShowVisits(s.target.checked)}
          />
          <span>Show bare "a cat came by" rows</span>
        </label>
      </div>
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateLimit(e){if(!this._config)return;let r=Number(e);this._config={...this._config,limit:e&&Number.isFinite(r)?r:void 0},this._fireConfigChanged()}_updateShowVisits(e){this._config&&(this._config={...this._config,show_visits:e?!0:void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=x`
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
    input:not([type="checkbox"]) {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
    }
    .checkbox {
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }
    .checkbox input {
      width: 18px;
      height: 18px;
    }
  `}};customElements.define("kibble-timeline-card-editor",Ls);var mu={deviceId:"",catPresence:[]},Os=30,Ds=class extends v{constructor(){super();this._entities=mu;this._timelineQuery=new ee(()=>this.requestUpdate());this._imageCache=new Te;this._lightboxTrigger=null;this._showMore=()=>{this._visibleCount+=this._config?.limit??Os};this._retryTimeline=()=>{let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId,s=this._config?.show_visits===!0;this._timelineQuery.refresh(()=>e({type:"kibble/timeline",entry_id:r,include_visits:s}).then(n=>n))};this._closeLightbox=()=>{this._lightboxUrl=null,this._lightboxTrigger?.focus(),this._lightboxTrigger=null};this._visibleCount=Os,this._lightboxUrl=null,this._lightboxAlt=""}static{this.properties={hass:{attribute:!1},_config:{state:!0},_visibleCount:{state:!0},_lightboxUrl:{state:!0},_lightboxAlt:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");this._config=e,this._visibleCount=e.limit??Os}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-timeline-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-timeline-card-editor")}disconnectedCallback(){super.disconnectedCallback(),this._imageCache.dispose()}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=at(this.hass.entities??{},e),this._entryId=lt(this.hass.devices??{},e));let r=this.hass?.callWS;if(this.hass&&this._entryId&&r){let s=this._entryId,n=this._config?.show_visits===!0,o=`${Ue(this.hass,[this._entities.lastDetection,this._entities.feeding,this._entities.dishAfter])}|visits=${n}`;this._timelineQuery.sync(o,()=>r({type:"kibble/timeline",entry_id:s,include_visits:n}).then(a=>a))}}render(){if(!this._config||!this.hass)return h;let e=this._timelineQuery.state,r=wa(e.data?.items??[],this._config.show_visits===!0),s=r.slice(0,this._visibleCount),n=Sa(s,new Date),o=r.length>s.length,a=!e.error&&!e.loading&&e.data!==null&&n.length===0;return u`
      <ha-card>
        <div class="container">
          ${this._config.name?u`<div class="label">${this._config.name}</div>`:h}
          <div class="rail">
            ${e.error?this._renderError(e.error):h}
            ${a?this._renderEmpty():h}
            ${n.map(l=>this._renderDay(l))}
            ${o?u`<button type="button" class="show-more" @click=${this._showMore}>Show more</button>`:h}
          </div>
        </div>
      </ha-card>
      <kibble-lightbox
        ?open=${this._lightboxUrl!==null}
        .imageUrl=${this._lightboxUrl}
        .alt=${this._lightboxAlt}
        @close-requested=${this._closeLightbox}
      ></kibble-lightbox>
    `}_renderEmpty(){return u`<p class="empty">Nothing to show yet. Feeds and visits appear here as they happen.</p>`}_renderError(e){return u`
      <div class="error">
        <span>Couldn't load the timeline. ${e}</span>
        <button type="button" @click=${this._retryTimeline}>Try again</button>
      </div>
    `}_renderDay(e){return u`
      <div class="day">
        <div class="day-label">${e.label}</div>
        <div class="day-items">${e.items.map(r=>this._renderItem(r))}</div>
      </div>
    `}_renderItem(e){return e.kind==="identified"?this._renderIdentified(e):e.kind==="eat"?this._renderEat(e):e.kind==="visit"?this._renderVisit(e):this._renderFeed(e)}_renderIdentified(e){let r=this._timeLabel(e.ts);return u`
      <div class="row">
        <span class="time">${r}</span>
        <span class="row-text">${wt(e)}</span>
        ${e.image&&this._entryId?this._renderThumb(J(this._entryId,e.image_kind,e.image),`${e.cat}, ${r}`):h}
      </div>
    `}_renderEat(e){let r=this._timeLabel(e.ts);return u`
      <div class="row">
        <span class="time">${r}</span>
        <span class="row-text">${wt(e)}</span>
        ${e.image&&this._entryId?this._renderThumb(J(this._entryId,"event",e.image),`A cat, ${r}`):h}
      </div>
    `}_renderVisit(e){let r=this._timeLabel(e.ts);return u`
      <div class="row">
        <span class="time">${r}</span>
        <span class="row-text">${wt(e)}</span>
        ${e.image&&this._entryId?this._renderThumb(J(this._entryId,"event",e.image),`A cat, ${r}`):h}
      </div>
    `}_renderFeed(e){let r=this._timeLabel(e.ts),s=this._entryId,n=ka(e);return u`
      <div class="row row-feed">
        <span class="time">${r}</span>
        <span class="row-text feed-text">
          ${n.headline}${n.scheduled?u` <span class="quiet">(scheduled)</span>`:h}
        </span>
        <div class="feed-thumbs">
          ${e.before&&s?this._renderCaptionedThumb(J(s,"feed",e.before),`Bowl before the ${r} feed`,"before"):h}
          ${e.after&&s?this._renderCaptionedThumb(J(s,"feed",e.after),`Bowl after the ${r} feed`,"after"):h}
        </div>
      </div>
    `}_renderThumb(e,r){let s=this._imageCache.get(this.hass,e,()=>this.requestUpdate());return u`
      <button type="button" class="thumb" ?disabled=${!s} aria-label=${`View photo: ${r}`} @click=${n=>this._openLightbox(n,s,r)}>
        ${s?u`<img src=${s} alt="" loading="lazy" />`:h}
      </button>
    `}_renderCaptionedThumb(e,r,s){return u`
      <div class="thumb-slot">
        ${this._renderThumb(e,r)}
        <span class="thumb-caption">${s}</span>
      </div>
    `}_timeLabel(e){return new Date(e*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}_openLightbox(e,r,s){r&&(this._lightboxTrigger=e.currentTarget,this._lightboxUrl=r,this._lightboxAlt=s)}static{this.styles=x`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
    }
    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .container {
      container-type: inline-size;
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
    .day-label {
      padding: 14px 16px 6px 68px;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .day-items {
      margin-left: 60px;
      border-left: 2px solid var(--divider-color);
      display: flex;
      flex-direction: column;
    }
    .row {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding: 6px 16px 6px 12px;
    }
    .time {
      position: absolute;
      left: -60px;
      width: 48px;
      text-align: right;
      font-size: var(--kibble-text-caption);
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .row-text {
      flex: 1 1 auto;
      min-width: 0;
      font-size: var(--kibble-text-body);
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .row-feed {
      min-height: 56px;
    }
    .feed-text {
      font-weight: 500;
    }
    .feed-thumbs {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      flex: 0 0 auto;
    }
    .thumb-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .thumb-caption {
      font-size: 10px;
      color: var(--secondary-text-color);
    }
    .quiet {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .thumb {
      flex: 0 0 auto;
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
      overflow: hidden;
    }
    .thumb:disabled {
      cursor: default;
    }
    .thumb:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .thumb img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .show-more {
      align-self: flex-start;
      margin: 12px 16px 0 68px;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 8px 14px;
      font: inherit;
      font-size: var(--kibble-text-body);
      font-weight: 500;
      cursor: pointer;
      min-height: 40px;
    }
    .show-more:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    @container (max-width: 360px) {
      .day-label {
        padding-left: 52px;
      }
      .day-items {
        margin-left: 44px;
      }
      .time {
        left: -44px;
        width: 36px;
        font-size: 11px;
      }
      .row {
        padding-right: 10px;
      }
    }
  `}};customElements.define("kibble-timeline-card",Ds);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-timeline-card",name:"Kibble Timeline",description:"Today's feeds and who's been by, one rail, newest first, with day separators and photos.",preview:!0});function Ea(i,t,e){return i.guess&&i.guess.score>=t&&e.has(i.guess.cat)?{cat:i.guess.cat,source:"classifier"}:i.vendor_cat&&e.has(i.vendor_cat)?{cat:i.vendor_cat,source:"vendor"}:null}var De=224,fu=.7,gu=.15,Is=class extends v{constructor(){super();this._imgRef=Z();this._canvasRef=Z();this._cancelButtonRef=Z();this._objectUrl=null;this._resolvedFile=null;this._naturalWidth=0;this._naturalHeight=0;this._selection=null;this._lastBlob=null;this._dragState=null;this._keydownHandler=e=>{e.key==="Escape"&&this.open&&(e.preventDefault(),this._close())};this._onImageLoad=()=>{let e=this._imgRef.value;if(!e)return;this._naturalWidth=e.naturalWidth,this._naturalHeight=e.naturalHeight;let r=Math.min(this._naturalWidth,this._naturalHeight)*fu;this._selection={x:(this._naturalWidth-r)/2,y:(this._naturalHeight-r)/2,size:r},this.requestUpdate(),this._drawPreview()};this._onPointerMove=e=>{let r=this._dragState;if(!r||r.pointerId!==e.pointerId||r.scale===0)return;e.preventDefault();let s=(e.clientX-r.startClientX)/r.scale,n=(e.clientY-r.startClientY)/r.scale;if(r.mode==="move")this._selection=this._clamp({...r.startSelection,x:r.startSelection.x+s,y:r.startSelection.y+n});else{let o=Math.max(s,n);this._selection=this._clamp({...r.startSelection,size:r.startSelection.size+o})}this.requestUpdate(),this._drawPreview()};this._endDrag=e=>{this._dragState?.pointerId===e.pointerId&&(this._dragState=null)};this._onSelectionKeydown=e=>{if(!this._selection||this._naturalWidth===0)return;let r=Math.max(2,Math.round(Math.min(this._naturalWidth,this._naturalHeight)*.02)),s={...this._selection};switch(e.key){case"ArrowLeft":s.x-=r;break;case"ArrowRight":s.x+=r;break;case"ArrowUp":s.y-=r;break;case"ArrowDown":s.y+=r;break;case"+":case"=":s.x-=r/2,s.y-=r/2,s.size+=r;break;case"-":case"_":s.x+=r/2,s.y+=r/2,s.size-=r;break;default:return}e.preventDefault(),this._selection=this._clamp(s),this.requestUpdate(),this._drawPreview()};this._useCrop=()=>{let e=this._canvasRef.value;!e||!this._selection||e.toBlob(r=>{r&&(this._lastBlob=r,this.dispatchEvent(new CustomEvent("use-crop",{detail:{blob:r},bubbles:!0,composed:!0})))},"image/jpeg",.9)};this._retry=()=>{this._lastBlob&&this.dispatchEvent(new CustomEvent("use-crop",{detail:{blob:this._lastBlob},bubbles:!0,composed:!0}))};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.file=null,this.catName=null,this.queueIndex=0,this.queueTotal=1,this.busy=!1,this.error=null}static{this.properties={open:{type:Boolean,reflect:!0},file:{attribute:!1},catName:{type:String,attribute:"cat-name"},queueIndex:{type:Number,attribute:"queue-index"},queueTotal:{type:Number,attribute:"queue-total"},busy:{type:Boolean},error:{type:String}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),this._objectUrl&&URL.revokeObjectURL(this._objectUrl)}willUpdate(){this.file!==this._resolvedFile&&(this._resolvedFile=this.file,this._objectUrl&&URL.revokeObjectURL(this._objectUrl),this._objectUrl=this.file?URL.createObjectURL(this.file):null,this._naturalWidth=0,this._naturalHeight=0,this._selection=null,this._lastBlob=null)}updated(e){e.has("open")&&this.open&&this._cancelButtonRef.value?.focus()}render(){if(!this.open)return h;let e=this.queueTotal>1,r=this.queueIndex>=this.queueTotal-1;return u`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${`Crop a photo of ${this.catName??"this cat"}`}>
        <div class="sheet" @click=${s=>s.stopPropagation()}>
          <div class="heading">
            <span>Add a photo of ${this.catName??"this cat"}</span>
            ${e?u`<span class="queue">Photo ${this.queueIndex+1} of ${this.queueTotal}</span>`:h}
          </div>
          <div class="stage">
            ${this._objectUrl?u`<img ${X(this._imgRef)} src=${this._objectUrl} alt="" @load=${this._onImageLoad} />`:h}
            ${this._selection?this._renderSelection():h}
          </div>
          <div class="preview-row">
            <canvas ${X(this._canvasRef)} class="preview" width=${De} height=${De} aria-hidden="true"></canvas>
            <p class="hint">
              Drag the square to cover the cat's face, drag its corner to resize. This becomes the training photo
              -- ${De}\u00d7${De}.
            </p>
          </div>
          ${this.error?u`
                <div class="error">
                  <span>${this.error}</span>
                  <button type="button" @click=${this._retry}>Try again</button>
                </div>
              `:h}
          <div class="actions">
            <button type="button" class="cancel" ${X(this._cancelButtonRef)} ?disabled=${this.busy} @click=${this._close}>
              ${e&&!r?"Skip":"Cancel"}
            </button>
            <button type="button" class="use" ?disabled=${this.busy||!this._selection} @click=${this._useCrop}>
              ${this.busy?"Uploading\u2026":"Use this crop"}
            </button>
          </div>
        </div>
      </div>
    `}_renderSelection(){let e=this._imgRef.value,r=this._selection;if(!e||!r||this._naturalWidth===0)return h;let s=e.getBoundingClientRect(),n=e.parentElement.getBoundingClientRect(),o=s.width/this._naturalWidth,a=s.left-n.left+r.x*o,l=s.top-n.top+r.y*o,p=r.size*o;return u`
      <div
        class="selection"
        tabindex="0"
        role="group"
        aria-label="Face crop area"
        style="left: ${a}px; top: ${l}px; width: ${p}px; height: ${p}px;"
        @pointerdown=${d=>this._beginDrag(d,"move")}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._endDrag}
        @pointercancel=${this._endDrag}
        @keydown=${this._onSelectionKeydown}
      >
        <div
          class="handle"
          @pointerdown=${d=>this._beginDrag(d,"resize")}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._endDrag}
          @pointercancel=${this._endDrag}
        ></div>
      </div>
    `}_beginDrag(e,r){r==="resize"&&e.stopPropagation();let s=this._imgRef.value;!s||!this._selection||this._naturalWidth===0||(e.preventDefault(),e.currentTarget.setPointerCapture(e.pointerId),this._dragState={mode:r,pointerId:e.pointerId,startClientX:e.clientX,startClientY:e.clientY,startSelection:{...this._selection},scale:s.getBoundingClientRect().width/this._naturalWidth})}_clamp(e){let r=Math.min(this._naturalWidth,this._naturalHeight),s=Math.max(8,r*gu),n=Math.min(Math.max(e.size,s),r),o=Math.min(Math.max(e.x,0),this._naturalWidth-n),a=Math.min(Math.max(e.y,0),this._naturalHeight-n);return{x:o,y:a,size:n}}_drawPreview(){let e=this._canvasRef.value,r=this._imgRef.value,s=this._selection;if(!e||!r||!s)return;let n=e.getContext("2d");n&&(n.clearRect(0,0,De,De),n.drawImage(r,s.x,s.y,s.size,s.size,0,0,De,De))}static{this.styles=x`
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
      border-radius: 16px 16px 0 0;
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    .heading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .queue {
      font-size: 12px;
      font-weight: 400;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .stage {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      border-radius: 8px;
      max-height: 50vh;
    }
    .stage img {
      display: block;
      max-width: 100%;
      max-height: 50vh;
      user-select: none;
      -webkit-user-drag: none;
    }
    .selection {
      position: absolute;
      box-sizing: border-box;
      border: 2px solid #fff;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
      cursor: move;
      touch-action: none;
    }
    .selection:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .handle {
      position: absolute;
      right: -9px;
      bottom: -9px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid var(--primary-color, #03a9f4);
      cursor: nwse-resize;
      touch-action: none;
    }
    .preview-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .preview {
      flex: 0 0 auto;
      width: 72px;
      height: 72px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .hint {
      margin: 0;
      font-size: 12px;
      color: var(--secondary-text-color);
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
      font-size: 13px;
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
    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .actions button {
      min-height: 44px;
      border-radius: 8px;
      border: none;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      padding: 0 16px;
    }
    .cancel {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
    }
    .use {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
    }
    .actions button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .actions button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `}};customElements.define("kibble-crop-dialog",Is);var Hs=class extends v{constructor(){super();this._firstButtonRef=Z();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&(e.preventDefault(),this._close())};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.cats=[]}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},cats:{attribute:!1},entryId:{type:String}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler)}updated(e){e.has("open")&&this.open&&this._firstButtonRef.value?.focus()}render(){return this.open?u`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Choose a cat">
        <div class="sheet" @click=${e=>e.stopPropagation()}>
          <div class="heading">Choose a cat</div>
          <div class="rows">
            ${this.cats.map((e,r)=>u`
                <button type="button" class="row" ${r===0?X(this._firstButtonRef):h} @click=${()=>this._choose(e.name)}>
                  <kibble-avatar
                    .hass=${this.hass}
                    .name=${e.name}
                    .colorIndex=${e.color_index}
                    .entryId=${this.entryId}
                    .sampleName=${e.avatar}
                  ></kibble-avatar>
                  <span>${e.name}</span>
                </button>
              `)}
            <button type="button" class="row" ${this.cats.length===0?X(this._firstButtonRef):h} @click=${()=>this._choose("not_a_cat")}>
              <kibble-avatar .name=${null}></kibble-avatar>
              <span>Not a cat</span>
            </button>
            <button type="button" class="row" @click=${()=>this._choose("other")}>
              <kibble-avatar .name=${null}></kibble-avatar>
              <span>Skip</span>
            </button>
          </div>
          <button type="button" class="cancel" @click=${this._close}>Cancel</button>
        </div>
      </div>
    `:h}_choose(e){this.dispatchEvent(new CustomEvent("choice",{detail:{cat:e},bubbles:!0,composed:!0}))}static{this.styles=x`
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
    }
    @media (min-width: 480px) {
      .backdrop {
        align-items: center;
      }
    }
    .sheet {
      width: 100%;
      max-width: 360px;
      max-height: 80vh;
      overflow-y: auto;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: 16px 16px 0 0;
      padding: 16px;
      box-sizing: border-box;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    .heading {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      padding-bottom: 8px;
    }
    .rows {
      display: flex;
      flex-direction: column;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 4px;
      border: none;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 15px;
      text-align: left;
      cursor: pointer;
      min-height: 48px;
      border-radius: 8px;
    }
    .row:hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .row:focus-visible,
    .cancel:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    kibble-avatar {
      --kibble-avatar-size: 32px;
    }
    .cancel {
      width: 100%;
      margin-top: 8px;
      min-height: 44px;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
  `}};customElements.define("kibble-face-picker",Hs);var bu=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"confidence",selector:{number:{min:0,max:1,step:.05,mode:"box"}}}],_u={device_id:"Kibble device",name:"Name (optional)",confidence:"Classifier confidence needed to suggest it (optional, default 0.7)"},Ns=class extends v{constructor(){super(...arguments);this._computeLabel=e=>_u[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?u`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${bu}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():h}_renderFallback(){let e=Object.values(this.hass?.entities??{}),r=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return u`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${r.map(s=>u`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
          <span>Classifier confidence needed to suggest it (optional, default 0.7)</span>
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            .value=${this._config?.confidence!=null?String(this._config.confidence):""}
            @change=${s=>this._updateConfidence(s.target.value)}
          />
        </label>
      </div>
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateConfidence(e){if(!this._config)return;let r=Number(e);this._config={...this._config,confidence:e&&Number.isFinite(r)?r:void 0},this._fireConfigChanged()}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=x`
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
  `}};customElements.define("kibble-cats-card-editor",Ns);var vu={deviceId:"",catPresence:[]};function $a(i){return`cat-${i.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}function yu(i){let t=/^#cat=(.+)$/.exec(i);if(!t)return null;try{return decodeURIComponent(t[1])}catch{return null}}var xu=.7,Cu=5e3,wu=3e3,Fs=class extends v{constructor(){super();this._entities=vu;this._catsQuery=new ee(()=>this.requestUpdate());this._pendingQuery=new ee(()=>this.requestUpdate());this._sampleQueries=new Map;this._timelineQuery=new ee(()=>this.requestUpdate());this._imageCache=new Te;this._lastPendingData=null;this._pickerTrigger=null;this._fileInputRef=Z();this._scrolledTo=null;this._onLocationChanged=()=>{this._scrolledTo=null,this.requestUpdate()};this._onCatMenuFocusOut=e=>{let r=e.currentTarget,s=e.relatedTarget;(!s||!r.contains(s))&&this._closeCatMenu()};this._onCatMenuKeydown=e=>{if(e.key!=="Escape")return;let r=e.currentTarget.querySelector(".cat-menu-trigger");this._closeCatMenu(),r?.focus()};this._onFilesChosen=e=>{let r=e.target,s=r.files?Array.from(r.files).filter(n=>n.type.startsWith("image/")):[];r.value="",s.length!==0&&(this._uploadQueue=s,this._uploadQueueTotal=s.length,this._uploadError=null)};this._onUseCrop=e=>{let r=this._uploadCat;r&&(this._uploadBusy=!0,this._uploadError=null,this._blobToBase64(e.detail.blob).then(s=>{let n=this._callWS("kibble/faces/upload",{cat:r,jpeg_b64:s});if(!n)throw new Error("Not connected.");return n}).then(s=>{this._uploadBusy=!1,s.low_quality&&(this._uploadNotice="The model isn't confident this is a face."),this._advanceUploadQueue(),this._refreshAll()}).catch(s=>{this._uploadBusy=!1,this._uploadError=$e(s)}))};this._onCropDialogClosed=()=>{this._advanceUploadQueue()};this._closePicker=()=>{this._pickerCrop=null,this._pickerTrigger?.focus(),this._pickerTrigger=null};this._onPickerChoice=e=>{let r=this._pickerCrop;this._pickerCrop=null,r&&this._confirm(r,e.detail.cat)};this._hiddenCrops=new Set,this._pickerCrop=null,this._undo=null,this._addName="",this._addBusy=!1,this._addError=null,this._actionError=null,this._openMenuFor=null,this._deleteConfirmFor=null,this._uploadQueue=[],this._uploadQueueTotal=0,this._uploadCat=null,this._uploadBusy=!1,this._uploadError=null,this._uploadNotice=null}static{this.properties={hass:{attribute:!1},_config:{state:!0},_hiddenCrops:{state:!0},_pickerCrop:{state:!0},_undo:{state:!0},_addName:{state:!0},_addBusy:{state:!0},_addError:{state:!0},_actionError:{state:!0},_openMenuFor:{state:!0},_deleteConfirmFor:{state:!0},_uploadQueue:{state:!0},_uploadQueueTotal:{state:!0},_uploadCat:{state:!0},_uploadBusy:{state:!0},_uploadError:{state:!0},_uploadNotice:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Cats card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 8}static getStubConfig(e){return{type:"custom:kibble-cats-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-cats-card-editor")}connectedCallback(){super.connectedCallback(),window.addEventListener("location-changed",this._onLocationChanged),window.addEventListener("hashchange",this._onLocationChanged)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("location-changed",this._onLocationChanged),window.removeEventListener("hashchange",this._onLocationChanged),this._imageCache.dispose(),clearTimeout(this._undoTimer),clearTimeout(this._deleteConfirmTimer)}_confidence(){return this._config?.confidence??xu}updated(){let e=yu(window.location.hash);if(!e||this._scrolledTo===e)return;let r=this.renderRoot.querySelector(`#${CSS.escape($a(e))}`);r&&(this._scrolledTo=e,r.scrollIntoView({behavior:"smooth",block:"start"}),r.classList.add("lit"),setTimeout(()=>r.classList.remove("lit"),2400))}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=at(this.hass.entities??{},e),this._entryId=lt(this.hass.devices??{},e));let r=this.hass?.callWS;if(this.hass&&this._entryId&&r){let s=this._entryId,n=Ue(this.hass,[this._entities.pendingFace,this._entities.lastSeenPet]);this._catsQuery.sync(n,()=>r({type:"kibble/cats",entry_id:s}).then(a=>a)),this._pendingQuery.sync(n,()=>r({type:"kibble/faces/pending",entry_id:s}).then(a=>a)),this._timelineQuery.sync(n,()=>r({type:"kibble/timeline",entry_id:s,include_visits:!1}).then(a=>a));for(let a of this._catsQuery.state.data?.cats??[]){if(this._sampleQueries.has(a.name))continue;let l=new ee(()=>this.requestUpdate());this._sampleQueries.set(a.name,l)}let o=Ue(this.hass,[this._entities.pendingFace]);for(let[a,l]of this._sampleQueries)l.sync(o,()=>r({type:"kibble/faces/samples",entry_id:s,cat:a}).then(p=>p))}this._pendingQuery.state.data!==this._lastPendingData&&(this._lastPendingData=this._pendingQuery.state.data,this._hiddenCrops=new Set)}render(){if(!this._config||!this.hass)return h;let e=this._catsQuery.state.data?.cats??[],s=(this._pendingQuery.state.data?.crops??[]).filter(p=>!this._hiddenCrops.has(p.name)),n=new Set(e.map(p=>p.name)),o=new Set(this._entities.catPresence.filter(p=>this.hass.states[p.entityId]?.state==="on").map(p=>p.name)),a=this._uploadQueue[0]??null,l=this._uploadQueueTotal-this._uploadQueue.length;return u`
      <ha-card>
        <div class="container">
          ${this._config.name?u`<div class="label">${this._config.name}</div>`:h}
          ${this._actionError?this._renderActionError():h}
          ${this._uploadNotice?this._renderUploadNotice():h}
          <section class="header">
            ${e.length===0?u`<p class="empty">No cats yet. Add one to start training.</p>`:u`<div class="cat-list">${e.map(p=>this._renderCatHeader(p,o.has(p.name)))}</div>`}
            ${this._renderAddCat()}
          </section>
          <section class="inbox">
            <div class="inbox-heading">
              <span>${s.length===1?"1 to review":`${s.length} to review`}</span>
            </div>
            ${this._pendingQuery.state.error?this._renderPendingError():h}
            ${s.length===0&&!this._pendingQuery.state.error?u`<p class="empty">Nothing to review. New crops arrive when the feeder identifies a cat in view.</p>`:u`<div class="crop-grid" @keydown=${this._onGridKeydown}>${s.map(p=>this._renderCrop(p,n))}</div>`}
          </section>
          ${e.map(p=>this._renderGallery(p))}
        </div>
      </ha-card>
      ${this._undo?this._renderUndo(this._undo):h}
      <kibble-face-picker
        ?open=${this._pickerCrop!==null}
        .hass=${this.hass}
        .cats=${e}
        .entryId=${this._entryId}
        @choice=${this._onPickerChoice}
        @close-requested=${this._closePicker}
      ></kibble-face-picker>
      <input type="file" accept="image/*" multiple class="visually-hidden" ${X(this._fileInputRef)} @change=${this._onFilesChosen} />
      <kibble-crop-dialog
        ?open=${a!==null}
        .file=${a}
        .catName=${this._uploadCat}
        .queueIndex=${l}
        .queueTotal=${this._uploadQueueTotal}
        .busy=${this._uploadBusy}
        .error=${this._uploadError}
        @use-crop=${this._onUseCrop}
        @close-requested=${this._onCropDialogClosed}
      ></kibble-crop-dialog>
    `}_renderCatHeader(e,r){let s=Math.max(e.last_seen??0,...(this._timelineQuery.state.data?.items??[]).filter(o=>o.kind==="identified"&&o.cat===e.name).map(o=>o.ts)),n=s>0?`seen ${Mt(new Date(s*1e3),new Date)}`:"not seen yet";return u`
      <div class="cat">
        <kibble-avatar
          class=${r?"present":""}
          .hass=${this.hass}
          .name=${e.name}
          .colorIndex=${e.color_index}
          .entryId=${this._entryId}
          .sampleName=${e.avatar}
        ></kibble-avatar>
        <div class="cat-text">
          <span class="cat-name">${e.name}</span>
          <span class="cat-meta">${e.samples===1?"1 sample":`${e.samples} samples`}, ${n}</span>
        </div>
        <div class="cat-menu" @focusout=${this._onCatMenuFocusOut} @keydown=${this._onCatMenuKeydown}>
          <button
            type="button"
            class="cat-menu-trigger"
            aria-haspopup="menu"
            aria-expanded=${this._openMenuFor===e.name}
            aria-label=${`Options for ${e.name}`}
            @click=${()=>this._toggleCatMenu(e.name)}
          >
            &#8942;
          </button>
          ${this._openMenuFor===e.name?this._renderCatMenu(e):h}
        </div>
      </div>
    `}_renderAddCat(){return u`
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
        ${this._addError?u`<span class="inline-error">${this._addError}</span>`:h}
      </form>
    `}async _onAddCatSubmit(e){e.preventDefault();let r=this._addName.trim();if(!(!r||!this._entities.deviceId)){this._addBusy=!0,this._addError=null;try{await this.hass.callService("kibble","add_cat",{device_id:this._entities.deviceId,name:r}),this._addName="",this._refreshCats()}catch(s){this._addError=$e(s)}finally{this._addBusy=!1}}}_renderCatMenu(e){let r=this._deleteConfirmFor===e.name;return u`
      <div class="menu" role="menu">
        <button type="button" role="menuitem" @click=${()=>this._startAddPhotos(e.name)}>Add photos</button>
        <button type="button" role="menuitem" class="danger ${r?"confirming":""}" @click=${()=>this._onDeleteCatClick(e.name)}>
          ${r?"Tap again to delete":"Delete cat\u2026"}
        </button>
      </div>
    `}_toggleCatMenu(e){this._openMenuFor=this._openMenuFor===e?null:e}_closeCatMenu(){this._openMenuFor=null,clearTimeout(this._deleteConfirmTimer),this._deleteConfirmFor=null}_onDeleteCatClick(e){if(this._deleteConfirmFor===e){clearTimeout(this._deleteConfirmTimer),this._deleteConfirmFor=null,this._openMenuFor=null,this._deleteCat(e);return}this._deleteConfirmFor=e,this._deleteConfirmTimer=setTimeout(()=>{this._deleteConfirmFor=null,this.requestUpdate()},wu)}_deleteCat(e){let r=this._callWS("kibble/cats/delete",{name:e});r&&r.then(()=>{this._sampleQueries.delete(e),this._refreshCats()}).catch(s=>{this._actionError={message:`Couldn't delete ${e}. ${$e(s)}`,retry:()=>this._deleteCat(e)}})}_startAddPhotos(e){this._openMenuFor=null,this._uploadCat=e,this._fileInputRef.value?.click()}_advanceUploadQueue(){this._uploadQueue=this._uploadQueue.slice(1),this._uploadError=null,this._uploadQueue.length===0&&(this._uploadCat=null,this._uploadQueueTotal=0)}_blobToBase64(e){return e.arrayBuffer().then(r=>{let s=new Uint8Array(r),n="";for(let o=0;o<s.length;o++)n+=String.fromCharCode(s[o]);return btoa(n)})}_callWS(e,r){let s=this.hass?.callWS,n=this._entryId;return!s||!n?null:s({type:e,entry_id:n,...r}).then(o=>o)}_renderUploadNotice(){return u`
      <div class="notice">
        <span>${this._uploadNotice}</span>
        <button
          type="button"
          aria-label="Dismiss"
          @click=${()=>{this._uploadNotice=null}}
        >
          &times;
        </button>
      </div>
    `}_renderCrop(e,r){let s=Ea(e,this._confidence(),r),n=this._entryId?J(this._entryId,"pending",e.name):null,o=n?this._imageCache.get(this.hass,n,()=>this.requestUpdate()):null;return u`
      <div class="crop">
        <button
          type="button"
          class="crop-thumb"
          ?disabled=${!o}
          aria-label=${s?`Confirm ${s.cat}`:"Choose a cat for this crop"}
          @click=${()=>this._onCropTap(e,s)}
        >
          ${o?u`<img src=${o} alt="" loading="lazy" />`:h}
        </button>
        <button type="button" class="chooser" aria-label="Choose a cat for this crop" @click=${a=>this._openPicker(e,a)}>&#8942;</button>
        <div class="chip ${s?`chip-${s.source}`:"chip-empty"}">
          ${s?u`${s.cat}<span class="mark">${s.source==="classifier"?"AI":"ID"}</span>`:"Tap to choose"}
        </div>
      </div>
    `}_onGridKeydown(e){if(!["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(e.key))return;let s=[...e.currentTarget.querySelectorAll(".crop-thumb")],n=s.indexOf(document.activeElement);if(n===-1)return;e.preventDefault();let o=e.key==="ArrowRight"||e.key==="ArrowDown"?1:-1;s[(n+o+s.length)%s.length]?.focus()}_onCropTap(e,r){if(!r){this._pickerCrop=e;return}this._confirm(e,r.cat)}_openPicker(e,r){this._pickerTrigger=r.currentTarget,this._pickerCrop=e}_confirm(e,r){if(!this._entities.deviceId)return;let s=this._entities.deviceId;this._hiddenCrops=new Set(this._hiddenCrops).add(e.name);let n=r==="not_a_cat"?"Not a cat":r==="other"?"Skip":r;this.hass.callService("kibble","label_face",{device_id:s,crop_id:e.name,cat:r}).then(()=>{this._refreshAll(),this._setUndo({message:`Labelled as ${n}. `,run:()=>{this.hass.callService("kibble","unlabel_face",{device_id:s,cat:r,name:e.name}).then(()=>this._refreshAll())}})}).catch(o=>{let a=new Set(this._hiddenCrops);a.delete(e.name),this._hiddenCrops=a,this._actionError={message:`Couldn't label this crop. ${$e(o)}`,retry:()=>this._confirm(e,r)}})}_setUndo(e){clearTimeout(this._undoTimer),this._undo=e,this._undoTimer=setTimeout(()=>{this._undo=null},Cu)}_renderUndo(e){return u`
      <div class="undo-bar" role="status">
        <span>${e.message}</span>
        <button
          type="button"
          @click=${()=>{clearTimeout(this._undoTimer),this._undo=null,e.run()}}
        >
          Undo
        </button>
      </div>
    `}_renderActionError(){let e=this._actionError;return e?u`
      <div class="error">
        <span>${e.message}</span>
        <button
          type="button"
          @click=${()=>{this._actionError=null,e.retry()}}
        >
          Try again
        </button>
      </div>
    `:h}_renderPendingError(){let e=this._pendingQuery.state.error;return e?u`
      <div class="error">
        <span>Couldn't load the review queue. ${e}</span>
        <button type="button" @click=${()=>this._refreshPending()}>Try again</button>
      </div>
    `:h}_renderGallery(e){let s=(this._sampleQueries.get(e.name)?.state.data?.samples??[]).slice().sort((a,l)=>l.ts-a.ts),n=(this._timelineQuery.state.data?.items??[]).filter(a=>a.kind==="identified"&&a.cat===e.name);if(s.length===0&&e.samples===0&&n.length===0)return h;let o=new Date;return u`
      <section class="gallery" id=${$a(e.name)}>
        <div class="gallery-header">
          <kibble-avatar .hass=${this.hass} .name=${e.name} .colorIndex=${e.color_index} .entryId=${this._entryId} .sampleName=${e.avatar}></kibble-avatar>
          <span class="gallery-name">${e.name}</span>
          <span class="gallery-sub">${n.length===0?"No sightings yet":n.length===1?"1 sighting":`${n.length} sightings`}</span>
        </div>
        ${n.length>0?u`<div class="gallery-grid">${n.map(a=>this._renderSighting(a,o))}</div>`:h}
        ${s.length>0?u`<div class="gallery-sub">${s.length===1?"1 training photo":`${s.length} training photos`}</div>
              <div class="gallery-grid">${s.map(a=>this._renderSample(e.name,a,null))}</div>`:h}
      </section>
    `}_renderSighting(e,r){let s=Mt(new Date(e.ts*1e3),r),n=e.image&&this._entryId?J(this._entryId,e.image_kind,e.image):null,o=n?this._imageCache.get(this.hass,n,()=>this.requestUpdate()):null,a=`${wt(e)}, ${new Date(e.ts*1e3).toLocaleString()}`;return u`
      <div class="sample sighting" title=${a}>
        ${o?u`<img src=${o} alt="" loading="lazy" />`:u`<kibble-avatar .hass=${this.hass} .name=${null} .colorIndex=${null} .entryId=${this._entryId} .sampleName=${null}></kibble-avatar>`}
        <span class="caption">${e.paired_class==="eat"?"ate \xB7 ":""}${s}</span>
      </div>
    `}_renderSample(e,r,s){let n=this._entryId?J(this._entryId,`sample/${e}`,r.name):null,o=n?this._imageCache.get(this.hass,n,()=>this.requestUpdate()):null;return u`
      <div class="sample">
        ${o?u`<img src=${o} alt="" loading="lazy" title=${new Date(r.ts*1e3).toLocaleString()} />`:h}
        <button type="button" class="remove" aria-label=${`Remove this sample of ${e}`} @click=${()=>this._removeSample(e,r)}>
          ${"\xD7"}
        </button>
        ${s?u`<span class="caption">${s}</span>`:h}
      </div>
    `}_removeSample(e,r){if(r.name.startsWith("upload-")){let n=this._callWS("kibble/faces/delete_sample",{cat:e,name:r.name});if(!n)return;n.then(()=>this._refreshAll()).catch(o=>{this._actionError={message:`Couldn't remove this sample. ${$e(o)}`,retry:()=>this._removeSample(e,r)}});return}if(!this._entities.deviceId)return;let s=this._entities.deviceId;this.hass.callService("kibble","unlabel_face",{device_id:s,cat:e,name:r.name}).then(()=>this._refreshAll()).catch(n=>{this._actionError={message:`Couldn't remove this sample. ${$e(n)}`,retry:()=>this._removeSample(e,r)}})}_refreshCats(){let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId;this._catsQuery.refresh(()=>e({type:"kibble/cats",entry_id:r}).then(s=>s))}_refreshPending(){let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId;this._pendingQuery.refresh(()=>e({type:"kibble/faces/pending",entry_id:r}).then(s=>s))}_refreshAll(){if(this._refreshCats(),this._refreshPending(),this.hass?.callWS&&this._entryId){let s=this.hass.callWS,n=this._entryId;this._timelineQuery.refresh(()=>s({type:"kibble/timeline",entry_id:n,include_visits:!1}).then(o=>o))}let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId;for(let[s,n]of this._sampleQueries)n.refresh(()=>e({type:"kibble/faces/samples",entry_id:r,cat:s}).then(o=>o))}static{this.styles=x`
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
    .notice {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-caption);
    }
    .notice button {
      flex: 0 0 auto;
      border: none;
      background: none;
      color: inherit;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      min-width: 32px;
      min-height: 32px;
    }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cat-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .cat {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    kibble-avatar {
      --kibble-avatar-size: 40px;
    }
    kibble-avatar.present {
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--primary-color, #03a9f4);
    }
    .cat-text {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
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
      min-width: 160px;
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
    .menu button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
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
    .inbox {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .inbox-heading {
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .crop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
      gap: 10px;
    }
    .crop {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .crop-thumb {
      width: 100%;
      aspect-ratio: 1;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      padding: 0;
      cursor: pointer;
      overflow: hidden;
    }
    .crop-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .crop-thumb:focus-visible,
    .chooser:focus-visible,
    .remove:focus-visible,
    .add-cat button:focus-visible,
    .add-cat input:focus-visible,
    .undo-bar button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .chooser {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      cursor: pointer;
      line-height: 1;
      font-size: 14px;
    }
    .chip {
      font-size: 11px;
      text-align: center;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .chip-classifier {
      color: var(--primary-color, #03a9f4);
      font-weight: 600;
    }
    .chip-vendor {
      color: var(--primary-text-color);
      font-weight: 500;
    }
    .mark {
      font-size: 9px;
      font-weight: 700;
      padding: 0 4px;
      border-radius: 4px;
      background: color-mix(in srgb, currentColor 16%, transparent);
    }
    .undo-bar {
      position: fixed;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 999px;
      background: #222;
      color: #fff;
      font-size: var(--kibble-text-body);
      z-index: 10;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
    .undo-bar button {
      border: none;
      background: none;
      color: #8ecbff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    @media (prefers-reduced-motion: no-preference) {
      .undo-bar {
        animation: kibble-undo-in 150ms ease-out;
      }
    }
    @keyframes kibble-undo-in {
      from {
        opacity: 0;
        transform: translate(-50%, 8px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    .gallery {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
      scroll-margin-top: 16px;
    }
    .gallery-header {
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 8px;
      outline: 2px solid transparent;
      outline-offset: 4px;
      transition: outline-color 600ms ease;
    }
    .gallery.lit .gallery-header {
      outline-color: var(--kibble-amber, #f2a33c);
    }
    .gallery-name {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .gallery-sub {
      font-size: var(--kibble-text-caption, 12px);
      color: var(--secondary-text-color);
    }
    .sample.sighting kibble-avatar {
      display: block;
      width: 100%;
      height: 100%;
      --kibble-avatar-size: 56px;
    }
    .sample .caption {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 1px 3px;
      font-size: 10px;
      line-height: 1.2;
      color: #fff;
      background: rgba(0, 0, 0, 0.55);
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 0 0 8px 8px;
    }
    .gallery-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sample {
      position: relative;
      width: 56px;
      height: 56px;
    }
    .sample img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      display: block;
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
    @container (max-width: 360px) {
      .crop-grid {
        grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      }
    }
  `}};customElements.define("kibble-cats-card",Fs);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-cats-card",name:"Kibble Cats",description:"Enrolled cats -- delete or add training photos -- plus a one-tap inbox for the feeder's own face crops.",preview:!0});var Su={deviceId:"",catPresence:[]},Eu=[1,2,3,4,5],$u=`
  .bubble-button-card-container { background: var(--kibble-amber, #f2a33c) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: var(--kibble-ink-on-amber, #241a07) !important; }
  .bubble-icon-container { background: color-mix(in srgb, var(--kibble-ink-on-amber, #241a07) 12%, transparent) !important; }
`;function Tu(i,t){return`
  .bubble-button-card-container { height: var(--kibble-touch-target, 48px) !important; ${i?"background: var(--kibble-amber, #f2a33c) !important;":""} ${t?"opacity: 0.5;":""} }
  .bubble-button-card { padding: 0 !important; }
  .bubble-name-container { margin: 0 !important; width: 100%; justify-content: center; }
  .bubble-name { width: 100%; justify-content: center; text-align: center; font-size: 17px; font-weight: 600; ${i?"color: var(--kibble-ink-on-amber, #241a07) !important;":""} }
`}var Pu=`
  .bubble-button-card-container { background: var(--error-color, #d9534f) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: #fff !important; }
`,Bs=class extends v{constructor(){super();this._entities=Su;this._catsQuery=new ee(()=>this.requestUpdate());this._onBubbleAction=e=>{let r=e.detail,s=r?.config?.[`${r.action}_action`];s?.action!=="fire-dom-event"||!s.kibble||(e.stopPropagation(),s.kibble==="portion"&&typeof s.portion=="number"&&this._entities.feedAmount?this.hass.callService("number","set_value",{value:s.portion},{entity_id:this._entities.feedAmount}):s.kibble==="feed"?this._onFeedActivate():s.kibble==="cancel"&&this._onCancelActivate())};this._onFeedActivate=()=>{if(!this._entities.deviceId)return;let e=this._numberState(this._entities.feedAmount)??1;this.hass.callService("kibble","feed",{device_id:this._entities.deviceId,hopper:"both",amount:e})};this._onCancelActivate=()=>{this._entities.deviceId&&this.hass.callService("kibble","cancel_feed",{device_id:this._entities.deviceId})};this._openSettings=()=>{let e=this._config?.settings_hash;if(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}));return}this._settingsOpen=!0};this._closeSettings=()=>{this._settingsOpen=!1};this._settingsOpen=!1,this._bubble=!1,Ca().then(e=>{this._bubble=e})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_settingsOpen:{state:!0},_bubble:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-card-editor")}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(e=>{let r=e[0]?.contentRect,s=r?.height??this.getBoundingClientRect().height,n=r?.width??this.getBoundingClientRect().width;this.classList.toggle("kiosk",s>=440),this.classList.toggle("compact",n<640&&s>0&&s<=520)}),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=at(this.hass.entities??{},e),this._entryId=lt(this.hass.devices??{},e));let r=this.hass?.callWS;if(this.hass&&this._entryId&&r&&this._entities.lastSeenPet){let s=this._entryId;this._catsQuery.sync(Ue(this.hass,[this._entities.lastSeenPet]),()=>r({type:"kibble/cats",entry_id:s}).then(n=>n))}}render(){if(!this._config||!this.hass)return h;let e=this._entities,r=e.feeding?this.hass.states[e.feeding]?.state:void 0,n=[e.feeding,e.bowlFill1,e.bowlFill2,e.schedule].filter(y=>!!y).map(y=>this.hass.states[y]?.state),o=pn(n,r),a=r==="on",l=this._numberState(e.bowlFill1),p=this._numberState(e.bowlFill2),d=hr(e.hopperLevel1&&this.hass.states[e.hopperLevel1]?.state),c=hr(e.hopperLevel2&&this.hass.states[e.hopperLevel2]?.state),m=this._scheduleEntries(),f=this._numberState(e.feedAmount)??1,g=this._heroOverlay(o);return u`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">
                <kibble-live-hero
                  .hass=${this.hass}
                  .cameraEntity=${e.camera}
                  .scryptedId=${this._config.scrypted_id}
                ></kibble-live-hero>
              </div>
              <div class="hero-status">
                <span class="live-dot" ?hidden=${!g.live}></span>
                ${g.catName?u`<kibble-avatar
                      .hass=${this.hass}
                      .name=${g.catName}
                      .colorIndex=${g.colorIndex}
                      .entryId=${this._entryId}
                      .sampleName=${g.avatarSample}
                    ></kibble-avatar>`:h}
                <span class="hero-status-text" data-tone=${g.tone}>${g.text}</span>
              </div>
              <button class="gear-button" aria-label="Settings" @click=${this._openSettings}>${V("cog")}</button>
              ${this._config.name?u`<div class="name-chip">${this._config.name}</div>`:h}
            </div>
            <div class="side">
            <kibble-bowl
              class="bowl-block"
              .hopper1=${l}
              .hopper2=${p}
              .hopperLevel1=${d}
              .hopperLevel2=${c}
              .feeding=${a}
            ></kibble-bowl>
            <div class="feed-controls" @hass-action=${this._onBubbleAction}>
              ${this._bubble?u`<div class="portions">
                      ${this._portionConfigs(f,o==="unreachable"||a).map(y=>u`<kibble-bubble-row .hass=${this.hass} .config=${y}></kibble-bubble-row>`)}
                    </div>
                    <kibble-bubble-row .hass=${this.hass} .config=${this._feedRowConfig(a,o==="unreachable")}></kibble-bubble-row>`:u`<kibble-segmented-picker
                      class="picker-full"
                      .value=${f}
                      ?disabled=${o==="unreachable"||a}
                      @portion-selected=${this._onPortionSelected}
                    ></kibble-segmented-picker>
                    <kibble-stepper
                      class="picker-compact"
                      .value=${f}
                      ?disabled=${o==="unreachable"||a}
                      @value-selected=${this._onPortionSelected}
                    ></kibble-stepper>
                    <kibble-hold-button
                      .label=${a?"Cancel":"Hold to feed"}
                      .variant=${a?"cancel":"feed"}
                      ?disabled=${o==="unreachable"}
                      @activate=${a?this._onCancelActivate:this._onFeedActivate}
                    ></kibble-hold-button>`}
            </div>
            ${this._config.schedule_hash?h:u`<kibble-schedule-summary
                  class="schedule-row"
                  .hass=${this.hass}
                  .entries=${m}
                  .scheduleCardStateEntity=${e.scheduleCardState}
                ></kibble-schedule-summary>`}
            </div>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog .hass=${this.hass} .entities=${e} ?open=${this._settingsOpen} @close-requested=${this._closeSettings}></kibble-settings-dialog>
    `}_numberState(e){if(!e)return null;let r=Number(this.hass.states[e]?.state);return Number.isFinite(r)?r:null}_heroOverlay(e){let r=this._entities.camera,s=r?this.hass.states[r]:void 0,n=s!==void 0&&s.state!=="unavailable";if(e==="unreachable")return{text:ur(e,null),tone:"error",live:n,catName:null,colorIndex:null,avatarSample:null};if(e==="dispensing")return{text:ur(e,null),tone:"amber",live:n,catName:null,colorIndex:null,avatarSample:null};let o=this._catSeen(),a=this._entities.eating,l=a!==void 0&&this.hass.states[a]?.state==="on";if(!o)return{text:l?"Eating now":"Ready to feed",tone:"normal",live:n,catName:null,colorIndex:null,avatarSample:null};let p=this._catsQuery.state.data?.cats.find(d=>d.name===o.name)??null;return{text:l?`${o.name} is eating`:`${o.name} seen ${o.relative}`,tone:"normal",live:n,catName:o.name,colorIndex:p?.color_index??null,avatarSample:p?.avatar??null}}_catSeen(){let e=this._entities.lastSeenPet,r=e?this.hass.states[e]:void 0;return!r||r.state==="unavailable"||r.state.toLowerCase()==="unknown"?null:{name:r.state,relative:Mt(new Date(r.last_changed),new Date)}}_scheduleEntries(){let e=this._entities.schedule;if(!e)return[];let s=this.hass.states[e]?.attributes?.entries;return Array.isArray(s)?s:[]}_portionConfigs(e,r){let s={action:"none"};return Eu.map(n=>{let o={tap_action:r?s:{action:"fire-dom-event",kibble:"portion",portion:n},double_tap_action:s,hold_action:s};return{card_type:"button",button_type:"name",name:String(n),show_icon:!1,show_state:!1,styles:Tu(n===e,r),...o,button_action:o}})}_feedRowConfig(e,r){let s={action:"none"},n={tap_action:e&&!r?{action:"fire-dom-event",kibble:"cancel"}:s,double_tap_action:s,hold_action:!e&&!r?{action:"fire-dom-event",kibble:"feed"}:s};return{card_type:"button",button_type:"name",name:r?"Feeder unreachable":e?"Feeding\u2026 tap to cancel":"Hold to feed",icon:e?"mdi:stop-circle-outline":"mdi:bowl-mix",styles:e?Pu:$u,...n,button_action:n}}_onPortionSelected(e){this._entities.feedAmount&&this.hass.callService("number","set_value",{value:e.detail.value},{entity_id:this._entities.feedAmount})}static{this.styles=x`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${Ie(fn)};
      --kibble-amber-dark: ${Ie(gn)};
      --kibble-ink-on-amber: ${Ie(bn)};
      --kibble-live: ${Ie(_n)};
      --kibble-touch-target: 48px;
      --kibble-feed-button-height: 56px;
      --kibble-number-size: 34px;
      --kibble-feed-label-size: 18px;
      --kibble-status-size: 22px;
      --kibble-segment-size: 16px;
      --kibble-schedule-size: 14px;
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
    .root {
      display: grid;
      height: 100%;
      overflow-y: auto;
      gap: 10px;
      padding-bottom: 10px;
      grid-template-columns: 1fr;
      grid-template-areas: "hero" "bowl" "feed" "schedule";
    }
    /* The feeder's streams are 16:10 (1152x720 sub, 1728x1080 main): the hero keeps that ratio
     * so the fisheye frame is never cropped or stretched to fit a layout guess. */
    .side {
      display: contents;
    }
    .hero {
      grid-area: hero;
      position: relative;
      overflow: hidden;
      aspect-ratio: 16 / 10;
      background: #1c1c1c;
      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
    }
    .hero-media {
      position: absolute;
      inset: 0;
    }
    .hero-media > * {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
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
    .bowl-block {
      grid-area: bowl;
      padding: 8px 14px 0;
      --kibble-bowl-max-width: 300px;
    }
    .feed-controls {
      grid-area: feed;
      padding: 0 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .portions {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }
    .portions > * {
      min-width: 0;
      container-type: inline-size;
      container-name: feed-controls;
    }
    .feed-controls .picker-full {
      display: none;
    }
    .feed-controls .picker-compact {
      display: block;
    }
    @container feed-controls (min-width: 280px) {
      .feed-controls .picker-full {
        display: block;
      }
      .feed-controls .picker-compact {
        display: none;
      }
    }
    .schedule-row {
      grid-area: schedule;
      padding: 0 10px 6px;
    }
    :host(.compact) .root {
      gap: 6px;
    }
    :host(.compact) .hero {
      aspect-ratio: auto;
      height: 80px;
    }
    :host(.compact) .hero-status-text {
      font-size: 12px;
    }
    :host(.compact) .bowl-block {
      padding-top: 2px;
      --kibble-bowl-max-width: 260px;
    }

    /* >=640px: two columns, camera left, silo/feed/schedule stacked right. The camera is 60%
     * of the card at 16:10, so the row is exactly 0.6 * 10/16 = 37.5% of the card width tall;
     * the right column is boxed to that same height so it can never outgrow the video. */
    @container (min-width: 640px) {
      .root {
        grid-template-columns: 60% 1fr;
        grid-template-rows: auto;
        grid-template-areas: "hero side";
        gap: 4px;
        padding-bottom: 0;
        height: auto;
        overflow: visible;
      }
      .hero {
        grid-area: hero;
        align-self: start;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
      }
      .side {
        grid-area: side;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto auto;
        height: calc(100cqw * 0.6 * 10 / 16);
        min-height: 0;
      }
      .bowl-block,
      .feed-controls {
        grid-area: unset;
        align-self: start;
        justify-self: stretch;
        z-index: 0;
        margin: 0;
        width: auto;
        background: none;
        border-radius: 0;
      }
      .bowl-block {
        grid-area: unset;
        align-self: stretch;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 16px 0;
        --kibble-bowl-max-width: 300px;
      }
      .bowl-block > * {
        height: 100%;
        max-height: 100%;
      }
      .feed-controls {
        grid-area: unset;
        padding: 6px 16px 12px;
        --kibble-touch-target: 48px;
        --kibble-segment-size: 16px;
      }
      .schedule-row {
        grid-area: unset;
        padding: 2px 16px 10px;
        align-self: start;
      }
    }
  `}};customElements.define("kibble-card",Bs);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-card",name:"Kibble",description:"The full daily control surface for a Kibble Petkit feeder: live camera, who's been by, feed, and schedule.",preview:!0});export{Bs as KibbleCard};
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
