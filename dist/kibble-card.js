var cl=Object.create;var ni=Object.defineProperty;var dl=Object.getOwnPropertyDescriptor;var ul=Object.getOwnPropertyNames;var hl=Object.getPrototypeOf,pl=Object.prototype.hasOwnProperty;var fl=(t,i)=>()=>(t&&(i=t(t=0)),i);var v=(t,i)=>()=>(i||t((i={exports:{}}).exports,i),i.exports),ml=(t,i)=>{for(var e in i)ni(t,e,{get:i[e],enumerable:!0})},on=(t,i,e,r)=>{if(i&&typeof i=="object"||typeof i=="function")for(let s of ul(i))!pl.call(t,s)&&s!==e&&ni(t,s,{get:()=>i[s],enumerable:!(r=dl(i,s))||r.enumerable});return t};var gl=(t,i,e)=>(e=t!=null?cl(hl(t)):{},on(i||!t||!t.__esModule?ni(e,"default",{value:t,enumerable:!0}):e,t)),ot=t=>on(ni({},"__esModule",{value:!0}),t);var Ci=v(Ae=>{"use strict";Object.defineProperty(Ae,"__esModule",{value:!0});Ae.ERROR_PACKET=Ae.PACKET_TYPES_REVERSE=Ae.PACKET_TYPES=void 0;var he=Object.create(null);Ae.PACKET_TYPES=he;he.open="0";he.close="1";he.ping="2";he.pong="3";he.message="4";he.upgrade="5";he.noop="6";var Zn=Object.create(null);Ae.PACKET_TYPES_REVERSE=Zn;Object.keys(he).forEach(t=>{Zn[he[t]]=t});var Xl={type:"error",data:"parser error"};Ae.ERROR_PACKET=Xl});var no=v(Dt=>{"use strict";Object.defineProperty(Dt,"__esModule",{value:!0});Dt.encodePacket=void 0;Dt.encodePacketToBinary=Zl;var Gl=Ci(),to=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",io=typeof ArrayBuffer=="function",ro=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,so=({type:t,data:i},e,r)=>to&&i instanceof Blob?e?r(i):Jn(i,r):io&&(i instanceof ArrayBuffer||ro(i))?e?r(i):Jn(new Blob([i]),r):r(Gl.PACKET_TYPES[t]+(i||""));Dt.encodePacket=so;var Jn=(t,i)=>{let e=new FileReader;return e.onload=function(){let r=e.result.split(",")[1];i("b"+(r||""))},e.readAsDataURL(t)};function eo(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}var Dr;function Zl(t,i){if(to&&t.data instanceof Blob)return t.data.arrayBuffer().then(eo).then(i);if(io&&(t.data instanceof ArrayBuffer||ro(t.data)))return i(eo(t.data));so(t,!1,e=>{Dr||(Dr=new TextEncoder),i(Dr.encode(e))})}});var oo=v(ut=>{"use strict";Object.defineProperty(ut,"__esModule",{value:!0});ut.decode=ut.encode=void 0;var dt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ht=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<dt.length;t++)Ht[dt.charCodeAt(t)]=t;var Jl=t=>{let i=new Uint8Array(t),e,r=i.length,s="";for(e=0;e<r;e+=3)s+=dt[i[e]>>2],s+=dt[(i[e]&3)<<4|i[e+1]>>4],s+=dt[(i[e+1]&15)<<2|i[e+2]>>6],s+=dt[i[e+2]&63];return r%3===2?s=s.substring(0,s.length-1)+"=":r%3===1&&(s=s.substring(0,s.length-2)+"=="),s};ut.encode=Jl;var ec=t=>{let i=t.length*.75,e=t.length,r,s=0,n,o,a,l;t[t.length-1]==="="&&(i--,t[t.length-2]==="="&&i--);let p=new ArrayBuffer(i),u=new Uint8Array(p);for(r=0;r<e;r+=4)n=Ht[t.charCodeAt(r)],o=Ht[t.charCodeAt(r+1)],a=Ht[t.charCodeAt(r+2)],l=Ht[t.charCodeAt(r+3)],u[s++]=n<<2|o>>4,u[s++]=(o&15)<<4|a>>2,u[s++]=(a&3)<<6|l&63;return p};ut.decode=ec});var lo=v(Si=>{"use strict";Object.defineProperty(Si,"__esModule",{value:!0});Si.decodePacket=void 0;var ki=Ci(),tc=oo(),ic=typeof ArrayBuffer=="function",rc=(t,i)=>{if(typeof t!="string")return{type:"message",data:ao(t,i)};let e=t.charAt(0);return e==="b"?{type:"message",data:sc(t.substring(1),i)}:ki.PACKET_TYPES_REVERSE[e]?t.length>1?{type:ki.PACKET_TYPES_REVERSE[e],data:t.substring(1)}:{type:ki.PACKET_TYPES_REVERSE[e]}:ki.ERROR_PACKET};Si.decodePacket=rc;var sc=(t,i)=>{if(ic){let e=(0,tc.decode)(t);return ao(e,i)}else return{base64:!0,data:t}},ao=(t,i)=>{switch(i){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}}});var ht=v(Q=>{"use strict";Object.defineProperty(Q,"__esModule",{value:!0});Q.decodePayload=Q.decodePacket=Q.encodePayload=Q.encodePacket=Q.protocol=void 0;Q.createPacketEncoderStream=ac;Q.createPacketDecoderStream=lc;var Fr=no();Object.defineProperty(Q,"encodePacket",{enumerable:!0,get:function(){return Fr.encodePacket}});var Nr=lo();Object.defineProperty(Q,"decodePacket",{enumerable:!0,get:function(){return Nr.decodePacket}});var co=Ci(),uo="",nc=(t,i)=>{let e=t.length,r=new Array(e),s=0;t.forEach((n,o)=>{(0,Fr.encodePacket)(n,!1,a=>{r[o]=a,++s===e&&i(r.join(uo))})})};Q.encodePayload=nc;var oc=(t,i)=>{let e=t.split(uo),r=[];for(let s=0;s<e.length;s++){let n=(0,Nr.decodePacket)(e[s],i);if(r.push(n),n.type==="error")break}return r};Q.decodePayload=oc;function ac(){return new TransformStream({transform(t,i){(0,Fr.encodePacketToBinary)(t,e=>{let r=e.length,s;if(r<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,r);else if(r<65536){s=new Uint8Array(3);let n=new DataView(s.buffer);n.setUint8(0,126),n.setUint16(1,r)}else{s=new Uint8Array(9);let n=new DataView(s.buffer);n.setUint8(0,127),n.setBigUint64(1,BigInt(r))}t.data&&typeof t.data!="string"&&(s[0]|=128),i.enqueue(s),i.enqueue(e)})}})}var Hr;function $i(t){return t.reduce((i,e)=>i+e.length,0)}function Ei(t,i){if(t[0].length===i)return t.shift();let e=new Uint8Array(i),r=0;for(let s=0;s<i;s++)e[s]=t[0][r++],r===t[0].length&&(t.shift(),r=0);return t.length&&r<t[0].length&&(t[0]=t[0].slice(r)),e}function lc(t,i){Hr||(Hr=new TextDecoder);let e=[],r=0,s=-1,n=!1;return new TransformStream({transform(o,a){for(e.push(o);;){if(r===0){if($i(e)<1)break;let l=Ei(e,1);n=(l[0]&128)===128,s=l[0]&127,s<126?r=3:s===126?r=1:r=2}else if(r===1){if($i(e)<2)break;let l=Ei(e,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),r=3}else if(r===2){if($i(e)<8)break;let l=Ei(e,8),p=new DataView(l.buffer,l.byteOffset,l.length),u=p.getUint32(0);if(u>Math.pow(2,21)-1){a.enqueue(co.ERROR_PACKET);break}s=u*Math.pow(2,32)+p.getUint32(4),r=3}else{if($i(e)<s)break;let l=Ei(e,s);a.enqueue((0,Nr.decodePacket)(n?l:Hr.decode(l),i)),r=0}if(s===0||s>t){a.enqueue(co.ERROR_PACKET);break}}}})}Q.protocol=4});var Ti=v(ho=>{ho.Emitter=W;function W(t){if(t)return cc(t)}function cc(t){for(var i in W.prototype)t[i]=W.prototype[i];return t}W.prototype.on=W.prototype.addEventListener=function(t,i){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(i),this};W.prototype.once=function(t,i){function e(){this.off(t,e),i.apply(this,arguments)}return e.fn=i,this.on(t,e),this};W.prototype.off=W.prototype.removeListener=W.prototype.removeAllListeners=W.prototype.removeEventListener=function(t,i){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var e=this._callbacks["$"+t];if(!e)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var r,s=0;s<e.length;s++)if(r=e[s],r===i||r.fn===i){e.splice(s,1);break}return e.length===0&&delete this._callbacks["$"+t],this};W.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var i=new Array(arguments.length-1),e=this._callbacks["$"+t],r=1;r<arguments.length;r++)i[r-1]=arguments[r];if(e){e=e.slice(0);for(var r=0,s=e.length;r<s;++r)e[r].apply(this,i)}return this};W.prototype.emitReserved=W.prototype.emit;W.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};W.prototype.hasListeners=function(t){return!!this.listeners(t).length}});var Ke=v(Ce=>{"use strict";Object.defineProperty(Ce,"__esModule",{value:!0});Ce.defaultBinaryType=Ce.globalThisShim=Ce.nextTick=void 0;Ce.createCookieJar=dc;Ce.nextTick=typeof Promise=="function"&&typeof Promise.resolve=="function"?i=>Promise.resolve().then(i):(i,e)=>e(i,0);Ce.globalThisShim=typeof self<"u"?self:typeof window<"u"?window:Function("return this")();Ce.defaultBinaryType="arraybuffer";function dc(){}});var Ye=v(pt=>{"use strict";Object.defineProperty(pt,"__esModule",{value:!0});pt.pick=uc;pt.installTimerFunctions=fc;pt.byteLength=gc;pt.randomString=_c;var Re=Ke();function uc(t,...i){return i.reduce((e,r)=>(t.hasOwnProperty(r)&&(e[r]=t[r]),e),{})}var hc=Re.globalThisShim.setTimeout,pc=Re.globalThisShim.clearTimeout;function fc(t,i){i.useNativeTimers?(t.setTimeoutFn=hc.bind(Re.globalThisShim),t.clearTimeoutFn=pc.bind(Re.globalThisShim)):(t.setTimeoutFn=Re.globalThisShim.setTimeout.bind(Re.globalThisShim),t.clearTimeoutFn=Re.globalThisShim.clearTimeout.bind(Re.globalThisShim))}var mc=1.33;function gc(t){return typeof t=="string"?bc(t):Math.ceil((t.byteLength||t.size)*mc)}function bc(t){let i=0,e=0;for(let r=0,s=t.length;r<s;r++)i=t.charCodeAt(r),i<128?e+=1:i<2048?e+=2:i<55296||i>=57344?e+=3:(r++,e+=4);return e}function _c(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}});var zr=v(Pi=>{"use strict";Object.defineProperty(Pi,"__esModule",{value:!0});Pi.encode=vc;Pi.decode=yc;function vc(t){let i="";for(let e in t)t.hasOwnProperty(e)&&(i.length&&(i+="&"),i+=encodeURIComponent(e)+"="+encodeURIComponent(t[e]));return i}function yc(t){let i={},e=t.split("&");for(let r=0,s=e.length;r<s;r++){let n=e[r].split("=");i[decodeURIComponent(n[0])]=decodeURIComponent(n[1])}return i}});var fo=v((Yp,po)=>{var ft=1e3,mt=ft*60,gt=mt*60,Qe=gt*24,xc=Qe*7,wc=Qe*365.25;po.exports=function(t,i){i=i||{};var e=typeof t;if(e==="string"&&t.length>0)return Cc(t);if(e==="number"&&isFinite(t))return i.long?Sc(t):kc(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))};function Cc(t){if(t=String(t),!(t.length>100)){var i=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(t);if(i){var e=parseFloat(i[1]),r=(i[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return e*wc;case"weeks":case"week":case"w":return e*xc;case"days":case"day":case"d":return e*Qe;case"hours":case"hour":case"hrs":case"hr":case"h":return e*gt;case"minutes":case"minute":case"mins":case"min":case"m":return e*mt;case"seconds":case"second":case"secs":case"sec":case"s":return e*ft;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return e;default:return}}}}function kc(t){var i=Math.abs(t);return i>=Qe?Math.round(t/Qe)+"d":i>=gt?Math.round(t/gt)+"h":i>=mt?Math.round(t/mt)+"m":i>=ft?Math.round(t/ft)+"s":t+"ms"}function Sc(t){var i=Math.abs(t);return i>=Qe?Ai(t,i,Qe,"day"):i>=gt?Ai(t,i,gt,"hour"):i>=mt?Ai(t,i,mt,"minute"):i>=ft?Ai(t,i,ft,"second"):t+" ms"}function Ai(t,i,e,r){var s=i>=e*1.5;return Math.round(t/e)+" "+r+(s?"s":"")}});var go=v((Qp,mo)=>{function $c(t){e.debug=e,e.default=e,e.coerce=l,e.disable=o,e.enable=s,e.enabled=a,e.humanize=fo(),e.destroy=p,Object.keys(t).forEach(u=>{e[u]=t[u]}),e.names=[],e.skips=[],e.formatters={};function i(u){let d=0;for(let f=0;f<u.length;f++)d=(d<<5)-d+u.charCodeAt(f),d|=0;return e.colors[Math.abs(d)%e.colors.length]}e.selectColor=i;function e(u){let d,f=null,m,g;function x(...w){if(!x.enabled)return;let R=x,z=Number(new Date),Y=z-(d||z);R.diff=Y,R.prev=d,R.curr=z,d=z,w[0]=e.coerce(w[0]),typeof w[0]!="string"&&w.unshift("%O");let I=0;w[0]=w[0].replace(/%([a-zA-Z%])/g,(be,C)=>{if(be==="%%")return"%";I++;let P=e.formatters[C];if(typeof P=="function"){let D=w[I];be=P.call(R,D),w.splice(I,1),I--}return be}),e.formatArgs.call(R,w),(R.log||e.log).apply(R,w)}return x.namespace=u,x.useColors=e.useColors(),x.color=e.selectColor(u),x.extend=r,x.destroy=e.destroy,Object.defineProperty(x,"enabled",{enumerable:!0,configurable:!1,get:()=>f!==null?f:(m!==e.namespaces&&(m=e.namespaces,g=e.enabled(u)),g),set:w=>{f=w}}),typeof e.init=="function"&&e.init(x),x}function r(u,d){let f=e(this.namespace+(typeof d>"u"?":":d)+u);return f.log=this.log,f}function s(u){e.save(u),e.namespaces=u,e.names=[],e.skips=[];let d=(typeof u=="string"?u:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let f of d)f[0]==="-"?e.skips.push(f.slice(1)):e.names.push(f)}function n(u,d){let f=0,m=0,g=-1,x=0;for(;f<u.length;)if(m<d.length&&(d[m]===u[f]||d[m]==="*"))d[m]==="*"?(g=m,x=f,m++):(f++,m++);else if(g!==-1)m=g+1,x++,f=x;else return!1;for(;m<d.length&&d[m]==="*";)m++;return m===d.length}function o(){let u=[...e.names,...e.skips.map(d=>"-"+d)].join(",");return e.enable(""),u}function a(u){for(let d of e.skips)if(n(u,d))return!1;for(let d of e.names)if(n(u,d))return!0;return!1}function l(u){return u instanceof Error?u.stack||u.message:u}function p(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return e.enable(e.load()),e}mo.exports=$c});var Xe=v((X,Ri)=>{X.formatArgs=Tc;X.save=Pc;X.load=Ac;X.useColors=Ec;X.storage=Rc();X.destroy=(()=>{let t=!1;return()=>{t||(t=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();X.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function Ec(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let t;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(t=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(t[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function Tc(t){if(t[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+t[0]+(this.useColors?"%c ":" ")+"+"+Ri.exports.humanize(this.diff),!this.useColors)return;let i="color: "+this.color;t.splice(1,0,i,"color: inherit");let e=0,r=0;t[0].replace(/%[a-zA-Z%]/g,s=>{s!=="%%"&&(e++,s==="%c"&&(r=e))}),t.splice(r,0,i)}X.log=console.debug||console.log||(()=>{});function Pc(t){try{t?X.storage.setItem("debug",t):X.storage.removeItem("debug")}catch{}}function Ac(){let t;try{t=X.storage.getItem("debug")||X.storage.getItem("DEBUG")}catch{}return!t&&typeof process<"u"&&"env"in process&&(t=process.env.DEBUG),t}function Rc(){try{return localStorage}catch{}}Ri.exports=go()(X);var{formatters:Lc}=Ri.exports;Lc.j=function(t){try{return JSON.stringify(t)}catch(i){return"[UnexpectedJSONParseError]: "+i.message}}});var Ft=v(Le=>{"use strict";var Mc=Le&&Le.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Le,"__esModule",{value:!0});Le.Transport=Le.TransportError=void 0;var Oc=ht(),Ic=Ti(),Dc=Ye(),Hc=zr(),Fc=Mc(Xe()),Nc=(0,Fc.default)("engine.io-client:transport"),Li=class extends Error{constructor(i,e,r){super(i),this.description=e,this.context=r,this.type="TransportError"}};Le.TransportError=Li;var Br=class extends Ic.Emitter{constructor(i){super(),this.writable=!1,(0,Dc.installTimerFunctions)(this,i),this.opts=i,this.query=i.query,this.socket=i.socket,this.supportsBinary=!i.forceBase64}onError(i,e,r){return super.emitReserved("error",new Li(i,e,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(i){this.readyState==="open"?this.write(i):Nc("transport is not open, discarding packets")}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(i){let e=(0,Oc.decodePacket)(i,this.socket.binaryType);this.onPacket(e)}onPacket(i){super.emitReserved("packet",i)}onClose(i){this.readyState="closed",super.emitReserved("close",i)}pause(i){}createUri(i,e={}){return i+"://"+this._hostname()+this._port()+this.opts.path+this._query(e)}_hostname(){let i=this.opts.hostname;return i.indexOf(":")===-1?i:"["+i+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(i){let e=(0,Hc.encode)(i);return e.length?"?"+e:""}};Le.Transport=Br});var jr=v(bt=>{"use strict";var zc=bt&&bt.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(bt,"__esModule",{value:!0});bt.Polling=void 0;var Bc=Ft(),Uc=Ye(),bo=ht(),jc=zc(Xe()),ie=(0,jc.default)("engine.io-client:polling"),Ur=class extends Bc.Transport{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(i){this.readyState="pausing";let e=()=>{ie("paused"),this.readyState="paused",i()};if(this._polling||!this.writable){let r=0;this._polling&&(ie("we are currently polling - waiting to pause"),r++,this.once("pollComplete",function(){ie("pre-pause polling complete"),--r||e()})),this.writable||(ie("we are currently writing - waiting to pause"),r++,this.once("drain",function(){ie("pre-pause writing complete"),--r||e()}))}else e()}_poll(){ie("polling"),this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(i){ie("polling got data %s",i);let e=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};(0,bo.decodePayload)(i,this.socket.binaryType).forEach(e),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"?this._poll():ie('ignoring poll - transport state "%s"',this.readyState))}doClose(){let i=()=>{ie("writing close packet"),this.write([{type:"close"}])};this.readyState==="open"?(ie("transport open - closing"),i()):(ie("transport not open - deferring close"),this.once("open",i))}write(i){this.writable=!1,(0,bo.encodePayload)(i,e=>{this.doWrite(e,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){let i=this.opts.secure?"https":"http",e=this.query||{};return this.opts.timestampRequests!==!1&&(e[this.opts.timestampParam]=(0,Uc.randomString)()),!this.supportsBinary&&!e.sid&&(e.b64=1),this.createUri(i,e)}};bt.Polling=Ur});var vo=v(Mi=>{"use strict";Object.defineProperty(Mi,"__esModule",{value:!0});Mi.hasCORS=void 0;var _o=!1;try{_o=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}Mi.hasCORS=_o});var Ii=v(pe=>{"use strict";var Vc=pe&&pe.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(pe,"__esModule",{value:!0});pe.XHR=pe.Request=pe.BaseXHR=void 0;var qc=jr(),Wc=Ti(),yo=Ye(),wo=Ke(),Kc=vo(),Yc=Vc(Xe()),Vr=(0,Yc.default)("engine.io-client:polling");function Qc(){}var Oi=class extends qc.Polling{constructor(i){if(super(i),typeof location<"u"){let e=location.protocol==="https:",r=location.port;r||(r=e?"443":"80"),this.xd=typeof location<"u"&&i.hostname!==location.hostname||r!==i.port}}doWrite(i,e){let r=this.request({method:"POST",data:i});r.on("success",e),r.on("error",(s,n)=>{this.onError("xhr post error",s,n)})}doPoll(){Vr("xhr poll");let i=this.request();i.on("data",this.onData.bind(this)),i.on("error",(e,r)=>{this.onError("xhr poll error",e,r)}),this.pollXhr=i}};pe.BaseXHR=Oi;var ke=class t extends Wc.Emitter{constructor(i,e,r){super(),this.createRequest=i,(0,yo.installTimerFunctions)(this,r),this._opts=r,this._method=r.method||"GET",this._uri=e,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var i;let e=(0,yo.pick)(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");e.xdomain=!!this._opts.xd;let r=this._xhr=this.createRequest(e);try{Vr("xhr open %s: %s",this._method,this._uri),r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&r.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(i=this._opts.cookieJar)===null||i===void 0||i.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var s;r.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},Vr("xhr data %s",this._data),r.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=t.requestsCount++,t.requests[this._index]=this)}_onError(i){this.emitReserved("error",i,this._xhr),this._cleanup(!0)}_cleanup(i){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Qc,i)try{this._xhr.abort()}catch{}typeof document<"u"&&delete t.requests[this._index],this._xhr=null}}_onLoad(){let i=this._xhr.responseText;i!==null&&(this.emitReserved("data",i),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};pe.Request=ke;ke.requestsCount=0;ke.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",xo);else if(typeof addEventListener=="function"){let t="onpagehide"in wo.globalThisShim?"pagehide":"unload";addEventListener(t,xo,!1)}}function xo(){for(let t in ke.requests)ke.requests.hasOwnProperty(t)&&ke.requests[t].abort()}var Xc=function(){let t=Co({xdomain:!1});return t&&t.responseType!==null}(),qr=class extends Oi{constructor(i){super(i);let e=i&&i.forceBase64;this.supportsBinary=Xc&&!e}request(i={}){return Object.assign(i,{xd:this.xd},this.opts),new ke(Co,this.uri(),i)}};pe.XHR=qr;function Co(t){let i=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!i||Kc.hasCORS))return new XMLHttpRequest}catch{}if(!i)try{return new wo.globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}});var Hi=v(Me=>{"use strict";var Gc=Me&&Me.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Me,"__esModule",{value:!0});Me.WS=Me.BaseWS=void 0;var Zc=Ft(),ko=Ye(),Jc=ht(),Kr=Ke(),ed=Gc(Xe()),td=(0,ed.default)("engine.io-client:websocket"),So=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative",Di=class extends Zc.Transport{get name(){return"websocket"}doOpen(){let i=this.uri(),e=this.opts.protocols,r=So?{}:(0,ko.pick)(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(i,e,r)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=i=>this.onClose({description:"websocket connection closed",context:i}),this.ws.onmessage=i=>this.onData(i.data),this.ws.onerror=i=>this.onError("websocket error",i)}write(i){this.writable=!1;for(let e=0;e<i.length;e++){let r=i[e],s=e===i.length-1;(0,Jc.encodePacket)(r,this.supportsBinary,n=>{try{this.doWrite(r,n)}catch{td("websocket closed before onclose event")}s&&(0,Kr.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){let i=this.opts.secure?"wss":"ws",e=this.query||{};return this.opts.timestampRequests&&(e[this.opts.timestampParam]=(0,ko.randomString)()),this.supportsBinary||(e.b64=1),this.createUri(i,e)}};Me.BaseWS=Di;var Wr=Kr.globalThisShim.WebSocket||Kr.globalThisShim.MozWebSocket,Yr=class extends Di{createSocket(i,e,r){return So?new Wr(i,e,r):e?new Wr(i,e):new Wr(i)}doWrite(i,e){this.ws.send(e)}};Me.WS=Yr});var Xr=v(_t=>{"use strict";var id=_t&&_t.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(_t,"__esModule",{value:!0});_t.WT=void 0;var rd=Ft(),sd=Ke(),$o=ht(),nd=id(Xe()),Nt=(0,nd.default)("engine.io-client:webtransport"),Qr=class extends rd.Transport{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(i){return this.emitReserved("error",i)}this._transport.closed.then(()=>{Nt("transport closed gracefully"),this.onClose()}).catch(i=>{Nt("transport closed due to %s",i),this.onError("webtransport error",i)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(i=>{let e=(0,$o.createPacketDecoderStream)(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=i.readable.pipeThrough(e).getReader(),s=(0,$o.createPacketEncoderStream)();s.readable.pipeTo(i.writable),this._writer=s.writable.getWriter();let n=()=>{r.read().then(({done:a,value:l})=>{if(a){Nt("session is closed");return}Nt("received chunk: %o",l),this.onPacket(l),n()}).catch(a=>{Nt("an error occurred while reading: %s",a)})};n();let o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(i){this.writable=!1;for(let e=0;e<i.length;e++){let r=i[e],s=e===i.length-1;this._writer.write(r).then(()=>{s&&(0,sd.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var i;(i=this._transport)===null||i===void 0||i.close()}};_t.WT=Qr});var Gr=v(Fi=>{"use strict";Object.defineProperty(Fi,"__esModule",{value:!0});Fi.transports=void 0;var od=Ii(),ad=Hi(),ld=Xr();Fi.transports={websocket:ad.WS,webtransport:ld.WT,polling:od.XHR}});var Jr=v(Zr=>{"use strict";Object.defineProperty(Zr,"__esModule",{value:!0});Zr.parse=ud;var cd=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,dd=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function ud(t){if(t.length>8e3)throw"URI too long";let i=t,e=t.indexOf("["),r=t.indexOf("]");e!=-1&&r!=-1&&(t=t.substring(0,e)+t.substring(e,r).replace(/:/g,";")+t.substring(r,t.length));let s=cd.exec(t||""),n={},o=14;for(;o--;)n[dd[o]]=s[o]||"";return e!=-1&&r!=-1&&(n.source=i,n.host=n.host.substring(1,n.host.length-1).replace(/;/g,":"),n.authority=n.authority.replace("[","").replace("]","").replace(/;/g,":"),n.ipv6uri=!0),n.pathNames=hd(n,n.path),n.queryKey=pd(n,n.query),n}function hd(t,i){let e=/\/{2,9}/g,r=i.replace(e,"/").split("/");return(i.slice(0,1)=="/"||i.length===0)&&r.splice(0,1),i.slice(-1)=="/"&&r.splice(r.length-1,1),r}function pd(t,i){let e={};return i.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,s,n){s&&(e[s]=n)}),e}});var rs=v(fe=>{"use strict";var fd=fe&&fe.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(fe,"__esModule",{value:!0});fe.Socket=fe.SocketWithUpgrade=fe.SocketWithoutUpgrade=void 0;var md=Gr(),Eo=Ye(),gd=zr(),To=Jr(),bd=Ti(),Po=ht(),es=Ke(),_d=fd(Xe()),$=(0,_d.default)("engine.io-client:socket"),ts=typeof addEventListener=="function"&&typeof removeEventListener=="function",zt=[];ts&&addEventListener("offline",()=>{$("closing %d connection(s) because the network was lost",zt.length),zt.forEach(t=>t())},!1);var Ge=class t extends bd.Emitter{constructor(i,e){if(super(),this.binaryType=es.defaultBinaryType,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,i&&typeof i=="object"&&(e=i,i=null),i){let r=(0,To.parse)(i);e.hostname=r.host,e.secure=r.protocol==="https"||r.protocol==="wss",e.port=r.port,r.query&&(e.query=r.query)}else e.host&&(e.hostname=(0,To.parse)(e.host).host);(0,Eo.installTimerFunctions)(this,e),this.secure=e.secure!=null?e.secure:typeof location<"u"&&location.protocol==="https:",e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.hostname=e.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=e.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},e.transports.forEach(r=>{let s=r.prototype.name;this.transports.push(s),this._transportsByName[s]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},e),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=(0,gd.decode)(this.opts.query)),ts&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&($("adding listener for the 'offline' event"),this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},zt.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=(0,es.createCookieJar)()),this._open()}createTransport(i){$('creating transport "%s"',i);let e=Object.assign({},this.opts.query);e.EIO=Po.protocol,e.transport=i,this.id&&(e.sid=this.id);let r=Object.assign({},this.opts,{query:e,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[i]);return $("options: %j",r),new this._transportsByName[i](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}let i=this.opts.rememberUpgrade&&t.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";let e=this.createTransport(i);e.open(),this.setTransport(e)}setTransport(i){$("setting transport %s",i.name),this.transport&&($("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=i,i.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",e=>this._onClose("transport close",e))}onOpen(){$("socket open"),this.readyState="open",t.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(i){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch($('socket receive: type "%s", data "%s"',i.type,i.data),this.emitReserved("packet",i),this.emitReserved("heartbeat"),i.type){case"open":this.onHandshake(JSON.parse(i.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":let e=new Error("server error");e.code=i.data,this._onError(e);break;case"message":this.emitReserved("data",i.data),this.emitReserved("message",i.data);break}else $('packet received with socket readyState "%s"',this.readyState)}onHandshake(i){this.emitReserved("handshake",i),this.id=i.sid,this.transport.query.sid=i.sid,this._pingInterval=i.pingInterval,this._pingTimeout=i.pingTimeout,this._maxPayload=i.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);let i=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+i,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},i),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){let i=this._getWritablePackets();$("flushing %d packets in socket",i.length),this.transport.send(i),this._prevBufferLen=i.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let e=1;for(let r=0;r<this.writeBuffer.length;r++){let s=this.writeBuffer[r].data;if(s&&(e+=(0,Eo.byteLength)(s)),r>0&&e>this._maxPayload)return $("only send %d out of %d packets",r,this.writeBuffer.length),this.writeBuffer.slice(0,r);e+=2}return $("payload size is %d (max: %d)",e,this._maxPayload),this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;let i=Date.now()>this._pingTimeoutTime;return i&&($("throttled timer detected, scheduling connection close"),this._pingTimeoutTime=0,(0,es.nextTick)(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),i}write(i,e,r){return this._sendPacket("message",i,e,r),this}send(i,e,r){return this._sendPacket("message",i,e,r),this}_sendPacket(i,e,r,s){if(typeof e=="function"&&(s=e,e=void 0),typeof r=="function"&&(s=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;let n={type:i,data:e,options:r};this.emitReserved("packetCreate",n),this.writeBuffer.push(n),s&&this.once("flush",s),this.flush()}close(){let i=()=>{this._onClose("forced close"),$("socket closing - telling transport to close"),this.transport.close()},e=()=>{this.off("upgrade",e),this.off("upgradeError",e),i()},r=()=>{this.once("upgrade",e),this.once("upgradeError",e)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():i()}):this.upgrading?r():i()),this}_onError(i){if($("socket error %j",i),t.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return $("trying next transport"),this.transports.shift(),this._open();this.emitReserved("error",i),this._onClose("transport error",i)}_onClose(i,e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if($('socket close with reason: "%s"',i),this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ts&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){let r=zt.indexOf(this._offlineEventListener);r!==-1&&($("removing listener for the 'offline' event"),zt.splice(r,1))}this.readyState="closed",this.id=null,this.emitReserved("close",i,e),this.writeBuffer=[],this._prevBufferLen=0}}};fe.SocketWithoutUpgrade=Ge;Ge.protocol=Po.protocol;var Ni=class extends Ge{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade){$("starting upgrade probes");for(let i=0;i<this._upgrades.length;i++)this._probe(this._upgrades[i])}}_probe(i){$('probing transport "%s"',i);let e=this.createTransport(i),r=!1;Ge.priorWebsocketSuccess=!1;let s=()=>{r||($('probe transport "%s" opened',i),e.send([{type:"ping",data:"probe"}]),e.once("packet",d=>{if(!r)if(d.type==="pong"&&d.data==="probe"){if($('probe transport "%s" pong',i),this.upgrading=!0,this.emitReserved("upgrading",e),!e)return;Ge.priorWebsocketSuccess=e.name==="websocket",$('pausing current transport "%s"',this.transport.name),this.transport.pause(()=>{r||this.readyState!=="closed"&&($("changing transport and sending upgrade packet"),u(),this.setTransport(e),e.send([{type:"upgrade"}]),this.emitReserved("upgrade",e),e=null,this.upgrading=!1,this.flush())})}else{$('probe transport "%s" failed',i);let f=new Error("probe error");f.transport=e.name,this.emitReserved("upgradeError",f)}}))};function n(){r||(r=!0,u(),e.close(),e=null)}let o=d=>{let f=new Error("probe error: "+d);f.transport=e.name,n(),$('probe transport "%s" failed because of error: %s',i,d),this.emitReserved("upgradeError",f)};function a(){o("transport closed")}function l(){o("socket closed")}function p(d){e&&d.name!==e.name&&($('"%s" works - aborting "%s"',d.name,e.name),n())}let u=()=>{e.removeListener("open",s),e.removeListener("error",o),e.removeListener("close",a),this.off("close",l),this.off("upgrading",p)};e.once("open",s),e.once("error",o),e.once("close",a),this.once("close",l),this.once("upgrading",p),this._upgrades.indexOf("webtransport")!==-1&&i!=="webtransport"?this.setTimeoutFn(()=>{r||e.open()},200):e.open()}onHandshake(i){this._upgrades=this._filterUpgrades(i.upgrades),super.onHandshake(i)}_filterUpgrades(i){let e=[];for(let r=0;r<i.length;r++)~this.transports.indexOf(i[r])&&e.push(i[r]);return e}};fe.SocketWithUpgrade=Ni;var is=class extends Ni{constructor(i,e={}){let r=typeof i=="object",s=r?{...i}:{...e};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(n=>md.transports[n]).filter(n=>!!n)),super(r?s:i,s)}};fe.Socket=is});var Ao=v(zi=>{"use strict";Object.defineProperty(zi,"__esModule",{value:!0});zi.Fetch=void 0;var vd=jr(),ss=class extends vd.Polling{doPoll(){this._fetch().then(i=>{if(!i.ok)return this.onError("fetch read error",i.status,i);i.text().then(e=>this.onData(e))}).catch(i=>{this.onError("fetch read error",i)})}doWrite(i,e){this._fetch(i).then(r=>{if(!r.ok)return this.onError("fetch write error",r.status,r);e()}).catch(r=>{this.onError("fetch write error",r)})}_fetch(i){var e;let r=i!==void 0,s=new Headers(this.opts.extraHeaders);return r&&s.set("content-type","text/plain;charset=UTF-8"),(e=this.socket._cookieJar)===null||e===void 0||e.appendCookies(s),fetch(this.uri(),{method:r?"POST":"GET",body:r?i:null,headers:s,credentials:this.opts.withCredentials?"include":"omit"}).then(n=>{var o;return(o=this.socket._cookieJar)===null||o===void 0||o.parseCookies(n.headers.getSetCookie()),n})}};zi.Fetch=ss});var Oo=v(S=>{"use strict";Object.defineProperty(S,"__esModule",{value:!0});S.WebTransport=S.WebSocket=S.NodeWebSocket=S.XHR=S.NodeXHR=S.Fetch=S.nextTick=S.parse=S.installTimerFunctions=S.transports=S.TransportError=S.Transport=S.protocol=S.SocketWithUpgrade=S.SocketWithoutUpgrade=S.Socket=void 0;var Ro=rs();Object.defineProperty(S,"Socket",{enumerable:!0,get:function(){return Ro.Socket}});var Lo=rs();Object.defineProperty(S,"SocketWithoutUpgrade",{enumerable:!0,get:function(){return Lo.SocketWithoutUpgrade}});Object.defineProperty(S,"SocketWithUpgrade",{enumerable:!0,get:function(){return Lo.SocketWithUpgrade}});S.protocol=Ro.Socket.protocol;var Mo=Ft();Object.defineProperty(S,"Transport",{enumerable:!0,get:function(){return Mo.Transport}});Object.defineProperty(S,"TransportError",{enumerable:!0,get:function(){return Mo.TransportError}});var yd=Gr();Object.defineProperty(S,"transports",{enumerable:!0,get:function(){return yd.transports}});var xd=Ye();Object.defineProperty(S,"installTimerFunctions",{enumerable:!0,get:function(){return xd.installTimerFunctions}});var wd=Jr();Object.defineProperty(S,"parse",{enumerable:!0,get:function(){return wd.parse}});var Cd=Ke();Object.defineProperty(S,"nextTick",{enumerable:!0,get:function(){return Cd.nextTick}});var kd=Ao();Object.defineProperty(S,"Fetch",{enumerable:!0,get:function(){return kd.Fetch}});var Sd=Ii();Object.defineProperty(S,"NodeXHR",{enumerable:!0,get:function(){return Sd.XHR}});var $d=Ii();Object.defineProperty(S,"XHR",{enumerable:!0,get:function(){return $d.XHR}});var Ed=Hi();Object.defineProperty(S,"NodeWebSocket",{enumerable:!0,get:function(){return Ed.WS}});var Td=Hi();Object.defineProperty(S,"WebSocket",{enumerable:!0,get:function(){return Td.WS}});var Pd=Xr();Object.defineProperty(S,"WebTransport",{enumerable:!0,get:function(){return Pd.WT}})});var Io=v(Se=>{"use strict";Object.defineProperty(Se,"__esModule",{value:!0});Se.TimeoutError=void 0;Se.singletonPromise=Ad;Se.timeoutPromise=Rd;Se.timeoutFunction=Ld;Se.createPromiseDebouncer=Md;Se.createMapPromiseDebouncer=Od;function Ad(t,i,e=0){if(t?.promise)return t;let r=i();return t?t.promise=r:t={promise:r,cacheDuration:e},r.finally(()=>setTimeout(()=>t.promise=void 0,t.cacheDuration)),t}var Bt=class extends Error{promise;constructor(i){super("Operation Timed Out"),this.promise=i}};Se.TimeoutError=Bt;function Rd(t,i){return new Promise((e,r)=>{let s=setTimeout(()=>r(new Bt(i)),t);i.then(n=>{clearTimeout(s),e(n)}).catch(n=>{clearTimeout(s),r(n)})})}function Ld(t,i){return new Promise((e,r)=>{let s=!1,n=i(()=>s),o=setTimeout(()=>{s=!0,r(new Bt(n))},t);n.then(a=>{clearTimeout(o),e(a)}).catch(a=>{clearTimeout(o),r(a)})})}function Md(){let t;return i=>(t||(t=i().finally(()=>t=void 0)),t)}function Od(){let t=new Map;return(i,e,r)=>{let s=JSON.stringify(i),n=t.get(s);return n||(n=r().finally(()=>{if(!e){t.delete(s);return}setTimeout(()=>t.delete(s),e)}),t.set(s,n)),n}}});var ge=v(Oe=>{"use strict";Object.defineProperty(Oe,"__esModule",{value:!0});Oe.RpcPeer=Oe.RPCResultError=void 0;Oe.startPeriodicGarbageCollection=Do;Oe.getEvalSource=Id;function Do(){globalThis.gc||console.warn("rpc peer garbage collection not available: global.gc is not exposed.");let t;try{t=globalThis}catch{}let i=0;return setInterval(()=>{let e=Date.now(),r=e-i,s=j.remotesCreated;j.remotesCreated=0;let n=j.remotesCollected;j.remotesCollected=0,(s||n||r>5*60*1e3)&&(i=e,t?.gc?.())},1e4)}var Bi=class t{peer;entry;constructorName;proxyProps;proxyOneWayMethods;static iteratorMethods=new Set(["next","throw","return"]);constructor(i,e,r,s,n){this.peer=i,this.entry=e,this.constructorName=r,this.proxyProps=s,this.proxyOneWayMethods=n}toPrimitive(){let i=this.peer;return`RpcProxy-${i.selfName}:${i.peerName}: ${this.constructorName}`}get(i,e,r){if(e===Symbol.asyncIterator)return this.proxyProps?.[Symbol.asyncIterator.toString()]?()=>new Proxy(()=>{},this):void 0;if(t.iteratorMethods.has(e?.toString())){let n=this.proxyProps?.[Symbol.asyncIterator.toString()]?.[e];if(n)return new Proxy(()=>n,this)}if(e===j.PROPERTY_PROXY_ID)return this.entry.id;if(e==="__proxy_constructor")return this.constructorName;if(e===j.PROPERTY_PROXY_PEER)return this.peer;if(e===j.PROPERTY_PROXY_PROPERTIES)return this.proxyProps;if(e===j.PROPERTY_PROXY_ONEWAY_METHODS)return this.proxyOneWayMethods;if(e===j.PROPERTY_JSON_DISABLE_SERIALIZATION||e===j.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN||e==="then"||e==="constructor")return;if(this.proxyProps?.[e]!==void 0)return this.proxyProps?.[e];let s=j.handleFunctionInvocations(this,i,e,r);return s||new Proxy(()=>e,this)}set(i,e,r,s){return e===j.finalizerIdSymbol?this.entry.finalizerId=r:(this.proxyProps||={},this.proxyProps[e]=r),!0}apply(i,e,r){let s=i()||null,n=this.proxyOneWayMethods?.includes?.(s);if(Object.isFrozen(this.peer.pendingResults))return n?Promise.resolve():Promise.reject(new me(this.peer,"RpcPeer has been killed (apply) "+i()));let o=[],a={};for(let d of r||[])o.push(this.peer.serialize(d,a));let l={type:"apply",id:void 0,proxyId:this.entry.id,args:o,method:s};if(n)return l.oneway=!0,s===null&&delete l.method,this.peer.send(l,void 0,a),Promise.resolve();let p=this.peer.createPendingResult(s,(d,f)=>{l.id=d,this.peer.send(l,f,a)}),u=this.proxyProps?.[Symbol.asyncIterator.toString()];return!u||s!==u.next&&s!==u.return?p:p.then(d=>s===u.return?{done:!0,value:void 0}:{value:d,done:!1}).catch(d=>{if(d.name==="StopAsyncIteration")return{done:!0,value:void 0};throw d})}},me=class extends Error{cause;constructor(i,e,r,s){super(`${e}
${i.selfName}:${i.peerName}`),this.cause=r,s?.name&&(this.name=s?.name),s?.stack&&(this.stack=`${r?.stack||s.stack}
${i.peerName}:${i.selfName}`)}};Oe.RPCResultError=me;try{let t=FinalizationRegistry}catch{window.WeakRef=class{target;constructor(e){this.target=e}deref(){return this.target}},window.FinalizationRegistry=class{register(){}}}var j=class t{selfName;peerName;send;params={};pendingResults={};localProxied=new Map;localProxyMap=new Map;remoteWeakProxies={};finalizers=new FinalizationRegistry(i=>this.finalize(i));nameDeserializerMap=new Map;onProxyTypeSerialization=new Map;onProxySerialization;constructorSerializerMap=new Map;transportSafeArgumentTypes=t.getDefaultTransportSafeArgumentTypes();killed;killedSafe;killedDeferred;tags={};yieldedAsyncIterators=new Set;static finalizerIdSymbol=Symbol("rpcFinalizerId");static remotesCollected=0;static remotesCreated=0;static activeRpcPeer;static isRpcProxy(i){return!!i?.[t.PROPERTY_PROXY_ID]}static getDefaultTransportSafeArgumentTypes(){let i=new Set;return i.add(Number.name),i.add(String.name),i.add(Object.name),i.add(Boolean.name),i.add(Array.name),i}static handleFunctionInvocations(i,e,r,s){if(r==="apply")return(n,o)=>i.apply(e,i,o);if(r==="call")return(n,...o)=>i.apply(e,i,o);if(r==="toString"||r===Symbol.toPrimitive)return(n,...o)=>i.toPrimitive()}static getIteratorNext(i){return i[Symbol.asyncIterator]?i[this.PROPERTY_PROXY_PROPERTIES]?.[Symbol.asyncIterator.toString()]?.next||"next":void 0}static prepareProxyProperties(i){let e=i?.[t.PROPERTY_PROXY_PROPERTIES];return i[Symbol.asyncIterator]&&(e||={},e[Symbol.asyncIterator.toString()]||(e[Symbol.asyncIterator.toString()]={next:"next",throw:"throw",return:"return"})),e}static RANDOM_DIGITS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";static RPC_RESULT_ERROR_NAME="RPCResultError";static PROPERTY_PROXY_ID="__proxy_id";static PROPERTY_PROXY_PEER="__proxy_peer";static PROPERTY_PROXY_ONEWAY_METHODS="__proxy_oneway_methods";static PROPERTY_JSON_DISABLE_SERIALIZATION="__json_disable_serialization";static PROPERTY_PROXY_PROPERTIES="__proxy_props";static PROPERTY_JSON_COPY_SERIALIZE_CHILDREN="__json_copy_serialize_children";static PROBED_PROPERTIES=new Set(["then","constructor","__proxy_id","__proxy_constructor",t.PROPERTY_PROXY_PEER,t.PROPERTY_PROXY_ONEWAY_METHODS,t.PROPERTY_JSON_DISABLE_SERIALIZATION,t.PROPERTY_PROXY_PROPERTIES,t.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]);constructor(i,e,r){this.selfName=i,this.peerName=e,this.send=r,this.killed=new Promise((s,n)=>{this.killedDeferred={resolve:s,reject:n,method:void 0}}).catch(s=>s.message||"Unknown Error"),this.killedSafe=this.killed.then(()=>{}).catch(()=>{})}static isTransportSafe(i){return i?!i[Symbol.asyncIterator]&&!i[t.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.getDefaultTransportSafeArgumentTypes().has(i.constructor?.name):!0}isTransportSafe(i){return i?!i[Symbol.asyncIterator]&&!i[t.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.transportSafeArgumentTypes.has(i.constructor?.name):!0}static generateId(){return[...new Array(8)].map(()=>t.RANDOM_DIGITS.charAt(Math.floor(Math.random()*t.RANDOM_DIGITS.length))).join("")}createPendingResult(i,e){if(Object.isFrozen(this.pendingResults))return Promise.reject(new me(this,"RpcPeer has been killed (createPendingResult)"));let r=new Promise((s,n)=>{let o=t.generateId();this.pendingResults[o]={resolve:s,reject:n,method:i},e(o,a=>n(new me(this,a.message,a)))});return r.catch(()=>{}),r}kill(i){if(Object.isFrozen(this.pendingResults))return;let e=new me(this,i||"peer was killed");this.killedDeferred.reject(e);for(let r of Object.values(this.pendingResults))r.reject(e);for(let r of this.yieldedAsyncIterators)r.throw(e).catch(()=>{});this.yieldedAsyncIterators.clear(),this.pendingResults=Object.freeze({}),this.params=Object.freeze({}),this.remoteWeakProxies=Object.freeze({}),this.localProxyMap.clear(),this.localProxied.clear()}addSerializer(i,e,r){this.nameDeserializerMap.set(e,r),this.constructorSerializerMap.set(i,e)}finalize(i){t.remotesCollected++,delete this.remoteWeakProxies[i.id];let e={__local_proxy_id:i.id,__local_proxy_finalizer_id:i.finalizerId,type:"finalize"};this.send(e)}async getParam(i){return this.createPendingResult("getParam",(e,r)=>{let s={id:e,type:"param",param:i};this.send(s,r)})}createErrorResult(i,e){return i.result=this.serializeError(e),i.throw=!0,i}deserialize(i,e){if(!i)return i;let r=i[t.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN];if(r){if(Array.isArray(r)){let m=[];for(let g of r)m.push(this.deserialize(g,e));return m}let f={};for(let[m,g]of Object.entries(i))f[m]=this.deserialize(g,e);return f}let{__remote_proxy_id:s,__remote_proxy_finalizer_id:n,__local_proxy_id:o,__remote_constructor_name:a,__serialized_value:l,__remote_proxy_props:p,__remote_proxy_oneway_methods:u}=i;if(a===t.RPC_RESULT_ERROR_NAME)return this.deserializeError(l);if(s){let f=this.remoteWeakProxies[s]?.deref();f||(f=this.newProxy(s,a,p,u)),f[t.finalizerIdSymbol]=n;let m=this.nameDeserializerMap.get(a);return m?m.deserialize(f,e):f}if(o){let f=this.localProxyMap.get(o);if(!f)throw new me(this,`invalid local proxy id ${o}`);return f}let d=this.nameDeserializerMap.get(a);return d?d.deserialize(l,e):i}deserializeError(i){let{name:e,stack:r,message:s}=i;return new me(this,s,void 0,{name:e,stack:r})}serializeError(i){let e={stack:i.stack||"[no stack]",name:i.name||"[no name]",message:i.message||"[no message]"};return{__remote_constructor_name:t.RPC_RESULT_ERROR_NAME,__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_proxy_oneway_methods:void 0,__remote_proxy_props:void 0,__serialized_value:e}}serialize(i,e){if(i?.[t.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]===!0){if(Array.isArray(i)){let f=[];for(let m of i)f.push(this.serialize(m,e));return{[t.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]:f}}let d={};for(let[f,m]of Object.entries(i))d[f]=this.serialize(m,e);return d}if(this.isTransportSafe(i))return i;let r=i.__proxy_constructor||i.constructor?.name?.toString();if(i instanceof Error)return this.serializeError(i);let s=this.constructorSerializerMap.get(i.constructor);if(s){r=s;let d=this.nameDeserializerMap.get(s);if(!d)throw new Error("serializer not found for "+s);let f=d.serialize(i,e);return{__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_constructor_name:r,__remote_proxy_props:t.prepareProxyProperties(i),__remote_proxy_oneway_methods:i?.[t.PROPERTY_PROXY_ONEWAY_METHODS],__serialized_value:f}}let n=this.localProxied.get(i);if(n){let{proxyId:d,properties:f}=this.onProxySerialization?.(i)||{proxyId:n.id,properties:t.prepareProxyProperties(i)};if(d!==n.id)throw new Error("onProxySerialization proxy id mismatch");let m=t.generateId();return n.finalizerId=m,{__remote_proxy_id:d,__remote_proxy_finalizer_id:m,__remote_constructor_name:r,__remote_proxy_props:f,__remote_proxy_oneway_methods:i?.[t.PROPERTY_PROXY_ONEWAY_METHODS]}}let{__proxy_id:o,__proxy_peer:a}=i;if(o&&a===this)return{__local_proxy_id:o};this.onProxyTypeSerialization.get(r)?.(i);let{proxyId:l,properties:p}=this.onProxySerialization?.(i)||{proxyId:t.generateId(),properties:t.prepareProxyProperties(i)};return n={id:l,finalizerId:l},this.localProxied.set(i,n),this.localProxyMap.set(l,i),{__remote_proxy_id:l,__remote_proxy_finalizer_id:l,__remote_constructor_name:r,__remote_proxy_props:p,__remote_proxy_oneway_methods:i?.[t.PROPERTY_PROXY_ONEWAY_METHODS]}}newProxy(i,e,r,s){t.remotesCreated++;let n={id:i,finalizerId:void 0},o=new Bi(this,n,e,r,s),a=e==="Function"||e==="AsyncFunction"?function(){}:o,l=new Proxy(a,o),p=new WeakRef(l);return this.remoteWeakProxies[i]=p,this.finalizers.register(o,n),l}handleMessage(i,e){try{t.activeRpcPeer=this,this.handleMessageInternal(i,e)}finally{t.activeRpcPeer=void 0}}sendResult(i,e){this.send(i,r=>{this.send(this.createErrorResult(i,r),void 0,e)},e)}async handleMessageInternal(i,e){if(!Object.isFrozen(this.pendingResults))try{switch(i.type){case"param":{let r=i,s={},n;try{n={type:"result",id:r.id,result:this.serialize(this.params[r.param],s)}}catch(o){this.createErrorResult(n,o)}this.sendResult(n,s);break}case"apply":{let r=i,s={type:"result",id:r.id||""},n={};try{let o=this.localProxyMap.get(r.proxyId);if(!o)throw new Error(`proxy id ${r.proxyId} not found`);let a=[];for(let p of r.args||[])a.push(this.deserialize(p,e));let l;if(r.method){if(!o[r.method])throw new Error(`target ${o?.constructor?.name} does not have method ${r.method}`);let u=t.getIteratorNext(o)===r.method;if(u&&this.yieldedAsyncIterators.delete(o),l=await o[r.method](...a),u){if(l.done)throw{name:"StopAsyncIteration",message:void 0};Object.isFrozen(this.pendingResults)?o.throw(new me(this,"RpcPeer has been killed (yield)")).catch(()=>{}):this.yieldedAsyncIterators.add(o),l=l.value}}else l=await o(...a);s.result=this.serialize(l,n)}catch(o){this.createErrorResult(s,o)}r.oneway||this.sendResult(s,n);break}case"result":{let r=i,s=this.pendingResults[r.id];if(delete this.pendingResults[r.id],!s)throw new Error(`unknown result ${r.id}`);let n=this.deserialize(r.result,e);r.throw?s.reject(n):s.resolve(n);break}case"finalize":{let r=i,s=this.localProxyMap.get(r.__local_proxy_id);if(s){let n=this.localProxied.get(s);if(r.__local_proxy_finalizer_id&&r.__local_proxy_finalizer_id!==n?.finalizerId)break;this.localProxyMap.delete(r.__local_proxy_id),this.localProxied.delete(s)}break}default:throw new Error(`unknown rpc message type ${i.type}`)}}catch(r){console.error("unhandled rpc error",this.peerName,r);return}}};Oe.RpcPeer=j;function Id(){return`
    (() => {
        ${Bi}

        ${j}

        ${Do}

        return {
            startPeriodicGarbageCollection,
            RpcPeer,
            RpcProxy,
        };
    })();
    `}});var Ho=v(Ui=>{"use strict";Object.defineProperty(Ui,"__esModule",{value:!0});Ui.MediaObject=void 0;var Dd=ge(),ns=class{mimeType;data;__proxy_props;constructor(i,e,r){this.mimeType=i,this.data=e,this.__proxy_props={},r||={},r.mimeType=i,r.convert||=null,r.toMimeTypes||=null;for(let[s,n]of Object.entries(r))Dd.RpcPeer.isTransportSafe(n)&&(this.__proxy_props[s]=n),this[s]=n}async getData(){return Promise.resolve(this.data)}};Ui.MediaObject=ns});var Ze=v(_=>{"use strict";Object.defineProperty(_,"__esModule",{value:!0});_.ScryptedMimeTypes=_.ScryptedInterface=_.MediaPlayerState=_.SecuritySystemObstruction=_.SecuritySystemMode=_.AirQuality=_.AirPurifierMode=_.AirPurifierStatus=_.ChargeState=_.LockState=_.PanTiltZoomMovement=_.ThermostatMode=_.TemperatureUnit=_.FanMode=_.HumidityMode=_.ScryptedDeviceType=_.ScryptedInterfaceDescriptors=_.ScryptedInterfaceMethod=_.ScryptedInterfaceProperty=_.DeviceBase=_.TYPES_VERSION=void 0;_.TYPES_VERSION="0.5.55";var os=class{};_.DeviceBase=os;var Fo;(function(t){t.id="id",t.info="info",t.interfaces="interfaces",t.mixins="mixins",t.name="name",t.nativeId="nativeId",t.pluginId="pluginId",t.providedInterfaces="providedInterfaces",t.providedName="providedName",t.providedRoom="providedRoom",t.providedType="providedType",t.providerId="providerId",t.room="room",t.type="type",t.scryptedRuntimeArguments="scryptedRuntimeArguments",t.on="on",t.brightness="brightness",t.colorTemperature="colorTemperature",t.rgb="rgb",t.hsv="hsv",t.buttons="buttons",t.sensors="sensors",t.running="running",t.paused="paused",t.docked="docked",t.temperatureSetting="temperatureSetting",t.temperature="temperature",t.temperatureUnit="temperatureUnit",t.humidity="humidity",t.resolution="resolution",t.audioVolumes="audioVolumes",t.recordingActive="recordingActive",t.ptzCapabilities="ptzCapabilities",t.lockState="lockState",t.entryOpen="entryOpen",t.batteryLevel="batteryLevel",t.chargeState="chargeState",t.online="online",t.fromMimeType="fromMimeType",t.toMimeType="toMimeType",t.converters="converters",t.binaryState="binaryState",t.tampered="tampered",t.sleeping="sleeping",t.powerDetected="powerDetected",t.audioDetected="audioDetected",t.motionDetected="motionDetected",t.ambientLight="ambientLight",t.occupied="occupied",t.flooded="flooded",t.ultraviolet="ultraviolet",t.luminance="luminance",t.position="position",t.securitySystemState="securitySystemState",t.pm10Density="pm10Density",t.pm25Density="pm25Density",t.vocDensity="vocDensity",t.noxDensity="noxDensity",t.co2ppm="co2ppm",t.airQuality="airQuality",t.airPurifierState="airPurifierState",t.filterChangeIndication="filterChangeIndication",t.filterLifeLevel="filterLifeLevel",t.humiditySetting="humiditySetting",t.fan="fan",t.applicationInfo="applicationInfo",t.chatCompletionCapabilities="chatCompletionCapabilities",t.systemDevice="systemDevice"})(Fo||(_.ScryptedInterfaceProperty=Fo={}));var No;(function(t){t.listen="listen",t.probe="probe",t.setMixins="setMixins",t.setName="setName",t.setRoom="setRoom",t.setType="setType",t.getPluginJson="getPluginJson",t.turnOff="turnOff",t.turnOn="turnOn",t.setBrightness="setBrightness",t.getTemperatureMaxK="getTemperatureMaxK",t.getTemperatureMinK="getTemperatureMinK",t.setColorTemperature="setColorTemperature",t.setRgb="setRgb",t.setHsv="setHsv",t.pressButton="pressButton",t.sendNotification="sendNotification",t.start="start",t.stop="stop",t.pause="pause",t.resume="resume",t.dock="dock",t.setTemperature="setTemperature",t.setTemperatureUnit="setTemperatureUnit",t.getPictureOptions="getPictureOptions",t.takePicture="takePicture",t.getAudioStream="getAudioStream",t.setAudioVolumes="setAudioVolumes",t.startDisplay="startDisplay",t.stopDisplay="stopDisplay",t.getVideoStream="getVideoStream",t.getVideoStreamOptions="getVideoStreamOptions",t.getPrivacyMasks="getPrivacyMasks",t.setPrivacyMasks="setPrivacyMasks",t.getVideoTextOverlays="getVideoTextOverlays",t.setVideoTextOverlay="setVideoTextOverlay",t.getRecordingStream="getRecordingStream",t.getRecordingStreamCurrentTime="getRecordingStreamCurrentTime",t.getRecordingStreamOptions="getRecordingStreamOptions",t.getRecordingStreamThumbnail="getRecordingStreamThumbnail",t.deleteRecordingStream="deleteRecordingStream",t.setRecordingActive="setRecordingActive",t.ptzCommand="ptzCommand",t.getRecordedEvents="getRecordedEvents",t.getVideoClip="getVideoClip",t.getVideoClips="getVideoClips",t.getVideoClipThumbnail="getVideoClipThumbnail",t.removeVideoClips="removeVideoClips",t.setVideoStreamOptions="setVideoStreamOptions",t.startIntercom="startIntercom",t.stopIntercom="stopIntercom",t.lock="lock",t.unlock="unlock",t.addPassword="addPassword",t.getPasswords="getPasswords",t.removePassword="removePassword",t.activate="activate",t.deactivate="deactivate",t.isReversible="isReversible",t.closeEntry="closeEntry",t.openEntry="openEntry",t.getDevice="getDevice",t.releaseDevice="releaseDevice",t.adoptDevice="adoptDevice",t.discoverDevices="discoverDevices",t.createDevice="createDevice",t.getCreateDeviceSettings="getCreateDeviceSettings",t.reboot="reboot",t.getRefreshFrequency="getRefreshFrequency",t.refresh="refresh",t.getMediaStatus="getMediaStatus",t.load="load",t.seek="seek",t.skipNext="skipNext",t.skipPrevious="skipPrevious",t.convert="convert",t.convertMedia="convertMedia",t.getSettings="getSettings",t.putSetting="putSetting",t.armSecuritySystem="armSecuritySystem",t.disarmSecuritySystem="disarmSecuritySystem",t.setAirPurifierState="setAirPurifierState",t.getReadmeMarkdown="getReadmeMarkdown",t.getOauthUrl="getOauthUrl",t.onOauthCallback="onOauthCallback",t.canMixin="canMixin",t.getMixin="getMixin",t.releaseMixin="releaseMixin",t.onRequest="onRequest",t.onConnection="onConnection",t.onPush="onPush",t.run="run",t.eval="eval",t.loadScripts="loadScripts",t.saveScript="saveScript",t.forkInterface="forkInterface",t.getDetectionInput="getDetectionInput",t.getObjectTypes="getObjectTypes",t.detectObjects="detectObjects",t.generateObjectDetections="generateObjectDetections",t.getDetectionModel="getDetectionModel",t.setHumidity="setHumidity",t.setFan="setFan",t.startRTCSignalingSession="startRTCSignalingSession",t.createRTCSignalingSession="createRTCSignalingSession",t.getScryptedUserAccessControl="getScryptedUserAccessControl",t.generateVideoFrames="generateVideoFrames",t.connectStream="connectStream",t.getTTYSettings="getTTYSettings",t.getChatCompletion="getChatCompletion",t.streamChatCompletion="streamChatCompletion",t.getTextEmbedding="getTextEmbedding",t.getImageEmbedding="getImageEmbedding",t.callLLMTool="callLLMTool",t.getLLMTools="getLLMTools"})(No||(_.ScryptedInterfaceMethod=No={}));_.ScryptedInterfaceDescriptors={ScryptedDevice:{name:"ScryptedDevice",methods:["listen","probe","setMixins","setName","setRoom","setType"],properties:["id","info","interfaces","mixins","name","nativeId","pluginId","providedInterfaces","providedName","providedRoom","providedType","providerId","room","type"]},ScryptedPlugin:{name:"ScryptedPlugin",methods:["getPluginJson"],properties:[]},ScryptedPluginRuntime:{name:"ScryptedPluginRuntime",methods:[],properties:["scryptedRuntimeArguments"]},OnOff:{name:"OnOff",methods:["turnOff","turnOn"],properties:["on"]},Brightness:{name:"Brightness",methods:["setBrightness"],properties:["brightness"]},ColorSettingTemperature:{name:"ColorSettingTemperature",methods:["getTemperatureMaxK","getTemperatureMinK","setColorTemperature"],properties:["colorTemperature"]},ColorSettingRgb:{name:"ColorSettingRgb",methods:["setRgb"],properties:["rgb"]},ColorSettingHsv:{name:"ColorSettingHsv",methods:["setHsv"],properties:["hsv"]},Buttons:{name:"Buttons",methods:[],properties:["buttons"]},PressButtons:{name:"PressButtons",methods:["pressButton"],properties:[]},Sensors:{name:"Sensors",methods:[],properties:["sensors"]},Notifier:{name:"Notifier",methods:["sendNotification"],properties:[]},StartStop:{name:"StartStop",methods:["start","stop"],properties:["running"]},Pause:{name:"Pause",methods:["pause","resume"],properties:["paused"]},Dock:{name:"Dock",methods:["dock"],properties:["docked"]},TemperatureSetting:{name:"TemperatureSetting",methods:["setTemperature"],properties:["temperatureSetting"]},Thermometer:{name:"Thermometer",methods:["setTemperatureUnit"],properties:["temperature","temperatureUnit"]},HumiditySensor:{name:"HumiditySensor",methods:[],properties:["humidity"]},Camera:{name:"Camera",methods:["getPictureOptions","takePicture"],properties:[]},Resolution:{name:"Resolution",methods:[],properties:["resolution"]},Microphone:{name:"Microphone",methods:["getAudioStream"],properties:[]},AudioVolumeControl:{name:"AudioVolumeControl",methods:["setAudioVolumes"],properties:["audioVolumes"]},Display:{name:"Display",methods:["startDisplay","stopDisplay"],properties:[]},VideoCamera:{name:"VideoCamera",methods:["getVideoStream","getVideoStreamOptions"],properties:[]},VideoCameraMask:{name:"VideoCameraMask",methods:["getPrivacyMasks","setPrivacyMasks"],properties:[]},VideoTextOverlays:{name:"VideoTextOverlays",methods:["getVideoTextOverlays","setVideoTextOverlay"],properties:[]},VideoRecorder:{name:"VideoRecorder",methods:["getRecordingStream","getRecordingStreamCurrentTime","getRecordingStreamOptions","getRecordingStreamThumbnail"],properties:["recordingActive"]},VideoRecorderManagement:{name:"VideoRecorderManagement",methods:["deleteRecordingStream","setRecordingActive"],properties:[]},PanTiltZoom:{name:"PanTiltZoom",methods:["ptzCommand"],properties:["ptzCapabilities"]},EventRecorder:{name:"EventRecorder",methods:["getRecordedEvents"],properties:[]},VideoClips:{name:"VideoClips",methods:["getVideoClip","getVideoClips","getVideoClipThumbnail","removeVideoClips"],properties:[]},VideoCameraConfiguration:{name:"VideoCameraConfiguration",methods:["setVideoStreamOptions"],properties:[]},Intercom:{name:"Intercom",methods:["startIntercom","stopIntercom"],properties:[]},Lock:{name:"Lock",methods:["lock","unlock"],properties:["lockState"]},PasswordStore:{name:"PasswordStore",methods:["addPassword","getPasswords","removePassword"],properties:[]},Scene:{name:"Scene",methods:["activate","deactivate","isReversible"],properties:[]},Entry:{name:"Entry",methods:["closeEntry","openEntry"],properties:[]},EntrySensor:{name:"EntrySensor",methods:[],properties:["entryOpen"]},DeviceProvider:{name:"DeviceProvider",methods:["getDevice","releaseDevice"],properties:[]},DeviceDiscovery:{name:"DeviceDiscovery",methods:["adoptDevice","discoverDevices"],properties:[]},DeviceCreator:{name:"DeviceCreator",methods:["createDevice","getCreateDeviceSettings"],properties:[]},Battery:{name:"Battery",methods:[],properties:["batteryLevel"]},Charger:{name:"Charger",methods:[],properties:["chargeState"]},Reboot:{name:"Reboot",methods:["reboot"],properties:[]},Refresh:{name:"Refresh",methods:["getRefreshFrequency","refresh"],properties:[]},MediaPlayer:{name:"MediaPlayer",methods:["getMediaStatus","load","seek","skipNext","skipPrevious"],properties:[]},Online:{name:"Online",methods:[],properties:["online"]},BufferConverter:{name:"BufferConverter",methods:["convert"],properties:["fromMimeType","toMimeType"]},MediaConverter:{name:"MediaConverter",methods:["convertMedia"],properties:["converters"]},Settings:{name:"Settings",methods:["getSettings","putSetting"],properties:[]},BinarySensor:{name:"BinarySensor",methods:[],properties:["binaryState"]},TamperSensor:{name:"TamperSensor",methods:[],properties:["tampered"]},Sleep:{name:"Sleep",methods:[],properties:["sleeping"]},PowerSensor:{name:"PowerSensor",methods:[],properties:["powerDetected"]},AudioSensor:{name:"AudioSensor",methods:[],properties:["audioDetected"]},MotionSensor:{name:"MotionSensor",methods:[],properties:["motionDetected"]},AmbientLightSensor:{name:"AmbientLightSensor",methods:[],properties:["ambientLight"]},OccupancySensor:{name:"OccupancySensor",methods:[],properties:["occupied"]},FloodSensor:{name:"FloodSensor",methods:[],properties:["flooded"]},UltravioletSensor:{name:"UltravioletSensor",methods:[],properties:["ultraviolet"]},LuminanceSensor:{name:"LuminanceSensor",methods:[],properties:["luminance"]},PositionSensor:{name:"PositionSensor",methods:[],properties:["position"]},SecuritySystem:{name:"SecuritySystem",methods:["armSecuritySystem","disarmSecuritySystem"],properties:["securitySystemState"]},PM10Sensor:{name:"PM10Sensor",methods:[],properties:["pm10Density"]},PM25Sensor:{name:"PM25Sensor",methods:[],properties:["pm25Density"]},VOCSensor:{name:"VOCSensor",methods:[],properties:["vocDensity"]},NOXSensor:{name:"NOXSensor",methods:[],properties:["noxDensity"]},CO2Sensor:{name:"CO2Sensor",methods:[],properties:["co2ppm"]},AirQualitySensor:{name:"AirQualitySensor",methods:[],properties:["airQuality"]},AirPurifier:{name:"AirPurifier",methods:["setAirPurifierState"],properties:["airPurifierState"]},FilterMaintenance:{name:"FilterMaintenance",methods:[],properties:["filterChangeIndication","filterLifeLevel"]},Readme:{name:"Readme",methods:["getReadmeMarkdown"],properties:[]},OauthClient:{name:"OauthClient",methods:["getOauthUrl","onOauthCallback"],properties:[]},MixinProvider:{name:"MixinProvider",methods:["canMixin","getMixin","releaseMixin"],properties:[]},HttpRequestHandler:{name:"HttpRequestHandler",methods:["onRequest"],properties:[]},EngineIOHandler:{name:"EngineIOHandler",methods:["onConnection"],properties:[]},PushHandler:{name:"PushHandler",methods:["onPush"],properties:[]},Program:{name:"Program",methods:["run"],properties:[]},Scriptable:{name:"Scriptable",methods:["eval","loadScripts","saveScript"],properties:[]},ClusterForkInterface:{name:"ClusterForkInterface",methods:["forkInterface"],properties:[]},ObjectDetector:{name:"ObjectDetector",methods:["getDetectionInput","getObjectTypes"],properties:[]},ObjectDetection:{name:"ObjectDetection",methods:["detectObjects","generateObjectDetections","getDetectionModel"],properties:[]},ObjectDetectionPreview:{name:"ObjectDetectionPreview",methods:[],properties:[]},ObjectDetectionGenerator:{name:"ObjectDetectionGenerator",methods:[],properties:[]},HumiditySetting:{name:"HumiditySetting",methods:["setHumidity"],properties:["humiditySetting"]},Fan:{name:"Fan",methods:["setFan"],properties:["fan"]},RTCSignalingChannel:{name:"RTCSignalingChannel",methods:["startRTCSignalingSession"],properties:[]},RTCSignalingClient:{name:"RTCSignalingClient",methods:["createRTCSignalingSession"],properties:[]},LauncherApplication:{name:"LauncherApplication",methods:[],properties:["applicationInfo"]},ScryptedUser:{name:"ScryptedUser",methods:["getScryptedUserAccessControl"],properties:[]},VideoFrameGenerator:{name:"VideoFrameGenerator",methods:["generateVideoFrames"],properties:[]},StreamService:{name:"StreamService",methods:["connectStream"],properties:[]},TTY:{name:"TTY",methods:[],properties:[]},TTYSettings:{name:"TTYSettings",methods:["getTTYSettings"],properties:[]},ChatCompletion:{name:"ChatCompletion",methods:["getChatCompletion","streamChatCompletion"],properties:["chatCompletionCapabilities"]},TextEmbedding:{name:"TextEmbedding",methods:["getTextEmbedding"],properties:[]},ImageEmbedding:{name:"ImageEmbedding",methods:["getImageEmbedding"],properties:[]},LLMTools:{name:"LLMTools",methods:["callLLMTool","getLLMTools"],properties:[]},ScryptedSystemDevice:{name:"ScryptedSystemDevice",methods:[],properties:["systemDevice"]},ScryptedDeviceCreator:{name:"ScryptedDeviceCreator",methods:[],properties:[]},ScryptedSettings:{name:"ScryptedSettings",methods:[],properties:[]}};var zo;(function(t){t.Builtin="Builtin",t.Internal="Internal",t.Camera="Camera",t.Fan="Fan",t.Light="Light",t.Switch="Switch",t.Outlet="Outlet",t.Sensor="Sensor",t.Scene="Scene",t.Program="Program",t.Automation="Automation",t.Vacuum="Vacuum",t.Notifier="Notifier",t.Thermostat="Thermostat",t.Lock="Lock",t.PasswordControl="PasswordControl",t.Display="Display",t.SmartDisplay="SmartDisplay",t.Speaker="Speaker",t.SmartSpeaker="SmartSpeaker",t.RemoteDesktop="RemoteDesktop",t.Event="Event",t.Entry="Entry",t.Garage="Garage",t.DeviceProvider="DeviceProvider",t.DataSource="DataSource",t.API="API",t.Buttons="Buttons",t.Doorbell="Doorbell",t.Irrigation="Irrigation",t.Valve="Valve",t.Person="Person",t.SecuritySystem="SecuritySystem",t.WindowCovering="WindowCovering",t.Siren="Siren",t.AirPurifier="AirPurifier",t.Internet="Internet",t.Network="Network",t.Bridge="Bridge",t.LLM="LLM",t.Unknown="Unknown"})(zo||(_.ScryptedDeviceType=zo={}));var Bo;(function(t){t.Humidify="Humidify",t.Dehumidify="Dehumidify",t.Auto="Auto",t.Off="Off"})(Bo||(_.HumidityMode=Bo={}));var Uo;(function(t){t.Auto="Auto",t.Manual="Manual"})(Uo||(_.FanMode=Uo={}));var jo;(function(t){t.C="C",t.F="F"})(jo||(_.TemperatureUnit=jo={}));var Vo;(function(t){t.Off="Off",t.Cool="Cool",t.Heat="Heat",t.HeatCool="HeatCool",t.Auto="Auto",t.FanOnly="FanOnly",t.Purifier="Purifier",t.Eco="Eco",t.Dry="Dry",t.On="On"})(Vo||(_.ThermostatMode=Vo={}));var qo;(function(t){t.Absolute="Absolute",t.Relative="Relative",t.Continuous="Continuous",t.Preset="Preset",t.Home="Home"})(qo||(_.PanTiltZoomMovement=qo={}));var Wo;(function(t){t.Locked="Locked",t.Unlocked="Unlocked",t.Jammed="Jammed"})(Wo||(_.LockState=Wo={}));var Ko;(function(t){t.Trickle="trickle",t.Charging="charging",t.NotCharging="not-charging"})(Ko||(_.ChargeState=Ko={}));var Yo;(function(t){t.Inactive="Inactive",t.Idle="Idle",t.Active="Active",t.ActiveNightMode="ActiveNightMode"})(Yo||(_.AirPurifierStatus=Yo={}));var Qo;(function(t){t.Manual="Manual",t.Automatic="Automatic"})(Qo||(_.AirPurifierMode=Qo={}));var Xo;(function(t){t.Unknown="Unknown",t.Excellent="Excellent",t.Good="Good",t.Fair="Fair",t.Inferior="Inferior",t.Poor="Poor"})(Xo||(_.AirQuality=Xo={}));var Go;(function(t){t.Disarmed="Disarmed",t.HomeArmed="HomeArmed",t.AwayArmed="AwayArmed",t.NightArmed="NightArmed"})(Go||(_.SecuritySystemMode=Go={}));var Zo;(function(t){t.Sensor="Sensor",t.Occupied="Occupied",t.Time="Time",t.Error="Error"})(Zo||(_.SecuritySystemObstruction=Zo={}));var Jo;(function(t){t.Idle="Idle",t.Playing="Playing",t.Paused="Paused",t.Buffering="Buffering"})(Jo||(_.MediaPlayerState=Jo={}));var ea;(function(t){t.ScryptedDevice="ScryptedDevice",t.ScryptedPlugin="ScryptedPlugin",t.ScryptedPluginRuntime="ScryptedPluginRuntime",t.OnOff="OnOff",t.Brightness="Brightness",t.ColorSettingTemperature="ColorSettingTemperature",t.ColorSettingRgb="ColorSettingRgb",t.ColorSettingHsv="ColorSettingHsv",t.Buttons="Buttons",t.PressButtons="PressButtons",t.Sensors="Sensors",t.Notifier="Notifier",t.StartStop="StartStop",t.Pause="Pause",t.Dock="Dock",t.TemperatureSetting="TemperatureSetting",t.Thermometer="Thermometer",t.HumiditySensor="HumiditySensor",t.Camera="Camera",t.Resolution="Resolution",t.Microphone="Microphone",t.AudioVolumeControl="AudioVolumeControl",t.Display="Display",t.VideoCamera="VideoCamera",t.VideoCameraMask="VideoCameraMask",t.VideoTextOverlays="VideoTextOverlays",t.VideoRecorder="VideoRecorder",t.VideoRecorderManagement="VideoRecorderManagement",t.PanTiltZoom="PanTiltZoom",t.EventRecorder="EventRecorder",t.VideoClips="VideoClips",t.VideoCameraConfiguration="VideoCameraConfiguration",t.Intercom="Intercom",t.Lock="Lock",t.PasswordStore="PasswordStore",t.Scene="Scene",t.Entry="Entry",t.EntrySensor="EntrySensor",t.DeviceProvider="DeviceProvider",t.DeviceDiscovery="DeviceDiscovery",t.DeviceCreator="DeviceCreator",t.Battery="Battery",t.Charger="Charger",t.Reboot="Reboot",t.Refresh="Refresh",t.MediaPlayer="MediaPlayer",t.Online="Online",t.BufferConverter="BufferConverter",t.MediaConverter="MediaConverter",t.Settings="Settings",t.BinarySensor="BinarySensor",t.TamperSensor="TamperSensor",t.Sleep="Sleep",t.PowerSensor="PowerSensor",t.AudioSensor="AudioSensor",t.MotionSensor="MotionSensor",t.AmbientLightSensor="AmbientLightSensor",t.OccupancySensor="OccupancySensor",t.FloodSensor="FloodSensor",t.UltravioletSensor="UltravioletSensor",t.LuminanceSensor="LuminanceSensor",t.PositionSensor="PositionSensor",t.SecuritySystem="SecuritySystem",t.PM10Sensor="PM10Sensor",t.PM25Sensor="PM25Sensor",t.VOCSensor="VOCSensor",t.NOXSensor="NOXSensor",t.CO2Sensor="CO2Sensor",t.AirQualitySensor="AirQualitySensor",t.AirPurifier="AirPurifier",t.FilterMaintenance="FilterMaintenance",t.Readme="Readme",t.OauthClient="OauthClient",t.MixinProvider="MixinProvider",t.HttpRequestHandler="HttpRequestHandler",t.EngineIOHandler="EngineIOHandler",t.PushHandler="PushHandler",t.Program="Program",t.Scriptable="Scriptable",t.ClusterForkInterface="ClusterForkInterface",t.ObjectDetector="ObjectDetector",t.ObjectDetection="ObjectDetection",t.ObjectDetectionPreview="ObjectDetectionPreview",t.ObjectDetectionGenerator="ObjectDetectionGenerator",t.HumiditySetting="HumiditySetting",t.Fan="Fan",t.RTCSignalingChannel="RTCSignalingChannel",t.RTCSignalingClient="RTCSignalingClient",t.LauncherApplication="LauncherApplication",t.ScryptedUser="ScryptedUser",t.VideoFrameGenerator="VideoFrameGenerator",t.StreamService="StreamService",t.TTY="TTY",t.TTYSettings="TTYSettings",t.ChatCompletion="ChatCompletion",t.TextEmbedding="TextEmbedding",t.ImageEmbedding="ImageEmbedding",t.LLMTools="LLMTools",t.ScryptedSystemDevice="ScryptedSystemDevice",t.ScryptedDeviceCreator="ScryptedDeviceCreator",t.ScryptedSettings="ScryptedSettings"})(ea||(_.ScryptedInterface=ea={}));var ta;(function(t){t.Url="text/x-uri",t.InsecureLocalUrl="text/x-insecure-local-uri",t.LocalUrl="text/x-local-uri",t.ServerId="text/x-server-id",t.PushEndpoint="text/x-push-endpoint",t.SchemePrefix="x-scrypted/x-scrypted-scheme-",t.MediaStreamUrl="text/x-media-url",t.MediaObject="x-scrypted/x-scrypted-media-object",t.RequestMediaObject="x-scrypted/x-scrypted-request-media-object",t.RequestMediaStream="x-scrypted/x-scrypted-request-stream",t.MediaStreamFeedback="x-scrypted/x-media-stream-feedback",t.FFmpegInput="x-scrypted/x-ffmpeg-input",t.FFmpegTranscodeStream="x-scrypted/x-ffmpeg-transcode-stream",t.RTCSignalingChannel="x-scrypted/x-scrypted-rtc-signaling-channel",t.RTCSignalingSession="x-scrypted/x-scrypted-rtc-signaling-session",t.RTCConnectionManagement="x-scrypted/x-scrypted-rtc-connection-management",t.Image="x-scrypted/x-scrypted-image"})(ta||(_.ScryptedMimeTypes=ta={}))});var ls=v(vt=>{"use strict";Object.defineProperty(vt,"__esModule",{value:!0});vt.SidebandBufferSerializer=vt.BufferSerializer=void 0;var ji=class{serialize(i){return console.warn("Using slow buffer serialization. Ensure the peer supports SidebandBufferSerializer."),i.toString("base64")}deserialize(i){return console.warn("Using slow buffer deserialization. Ensure the peer supports SidebandBufferSerializer."),Buffer.from(i,"base64")}};vt.BufferSerializer=ji;var as=class{bufferSerializer=new ji;serialize(i,e){if(!e)return this.bufferSerializer.serialize(i);let r=e.buffers=e.buffers||[];return r.push(i),r.length-1}deserialize(i,e){return e?.buffers?e.buffers[i]:this.bufferSerializer.deserialize(i)}};vt.SidebandBufferSerializer=as});var ds=v(re=>{"use strict";Object.defineProperty(re,"__esModule",{value:!0});re.propertyInterfaces=re.allInterfaceProperties=void 0;re.getPropertyInterfaces=ia;re.getInterfaceMethods=ra;re.getInterfaceProperties=sa;re.isValidInterfaceMethod=Hd;re.isValidInterfaceProperty=Fd;var cs=Ze();re.allInterfaceProperties=[].concat(...Object.values(cs.ScryptedInterfaceDescriptors).map(t=>t.properties));function ia(t){let i={};for(let e of Object.values(t))for(let r of e.properties)i[r]=e.name;return i}re.propertyInterfaces=ia(cs.ScryptedInterfaceDescriptors);function ra(t,i){return Object.values(t).filter(e=>i.has(e.name)).map(e=>e.methods).flat()}function sa(t,i){return Object.values(t).filter(e=>i.has(e.name)).map(e=>e.properties).flat()}function Hd(t,i,e){return ra(t,i).includes(e)||t[cs.ScryptedInterface.ScryptedDevice].methods.includes(e)}function Fd(t,i,e){return sa(t,new Set(i)).includes(e)}});var na=v(us=>{"use strict";Object.defineProperty(us,"__esModule",{value:!0});us.checkProperty=Bd;var yt=Ze(),Nd=ge(),zd=ds();function Bd(t,i){if(t===yt.ScryptedInterfaceProperty.id)throw new Error("id is read only");if(t===yt.ScryptedInterfaceProperty.nativeId)throw new Error("nativeId is read only");if(t===yt.ScryptedInterfaceProperty.mixins)throw new Error("mixins is read only");if(t===yt.ScryptedInterfaceProperty.interfaces)throw new Error("interfaces is a read only post-mixin computed property, use providedInterfaces");if(Nd.RpcPeer.isRpcProxy(i))throw new Error("value must be a primitive type");if(zd.propertyInterfaces[t.toString()]===yt.ScryptedInterface.ScryptedDevice&&t!==yt.ScryptedInterfaceProperty.info)throw new Error(`${t.toString()} can not be set. Use DeviceManager.onDevicesChanges or DeviceManager.onDeviceDiscovered to update the device description.`)}});var oa=v(Ie=>{"use strict";Object.defineProperty(Ie,"__esModule",{value:!0});Ie.StorageImpl=Ie.DeviceManagerImpl=Ie.DeviceStateProxyHandler=void 0;var Ud=ge(),jd=na(),hs=class{console;nativeId;api;logger;constructor(i,e,r){this.console=r,this.api=i,this.nativeId=e}async ensureLogger(){return this.logger||(this.logger=this.api.getLogger(this.nativeId)),await this.logger}async log(i,e){(await this.ensureLogger()).log(i,e)}a(i){this.log("a",i)}async clear(){(await this.ensureLogger()).clear()}async clearAlert(i){(await this.ensureLogger()).clearAlert(i)}async clearAlerts(){(await this.ensureLogger()).clearAlerts()}d(i){this.log("d",i)}e(i){this.log("e",i)}i(i){this.log("i",i)}v(i){this.log("v",i)}w(i){this.log("w",i)}},Ut=class{deviceManager;id;setState;constructor(i,e,r){this.deviceManager=i,this.id=e,this.setState=r}get(i,e,r){return e==="id"?this.id:e===Ud.RpcPeer.PROPERTY_PROXY_PROPERTIES?{id:this.id}:e==="setState"?this.setState:this.deviceManager.systemManager.state[this.id][e]?.value}set(i,e,r,s){return(0,jd.checkProperty)(e.toString(),r),this.deviceManager.systemManager.state[this.id][e]={value:r},this.setState(e.toString(),r),!0}};Ie.DeviceStateProxyHandler=Ut;var ps=class{systemManager;getDeviceConsole;getMixinConsole;api;nativeIds=new Map;deviceStorage=new Map;mixinStorage=new Map;constructor(i,e,r){this.systemManager=i,this.getDeviceConsole=e,this.getMixinConsole=r}async requestRestart(){return this.api.requestRestart()}getDeviceLogger(i){return new hs(this.api,i,this.getDeviceConsole?.(i)||console)}getDeviceState(i){let e=new Ut(this,this.nativeIds.get(i).id,(r,s)=>this.api.setState(i,r,s));return new Proxy(e,e)}createDeviceState(i,e){let r=new Ut(this,i,e);return new Proxy(r,r)}getDeviceStorage(i){let e=this.deviceStorage.get(i);return e||(e=new jt(this,i),this.deviceStorage.set(i,e)),e}getMixinStorage(i,e){let r=this.mixinStorage.get(e);r||(r=new Map,this.mixinStorage.set(e,r));let s=r.get(i);return s||(s=new jt(this,e,`mixin:${i}:`),r.set(i,s)),s}pruneMixinStorage(){for(let i of this.nativeIds.keys()){let e=this.nativeIds.get(i).storage;for(let r of Object.keys(e)){if(!r.startsWith("mixin:"))continue;let[,s]=r.split(":");s&&!this.systemManager.state[s]&&delete e[r]}}}async onMixinEvent(i,e,r,s){return this.api.onMixinEvent(i,e,r,s)}getNativeIds(){return Array.from(this.nativeIds.keys())}async onDeviceDiscovered(i){return this.api.onDeviceDiscovered(i)}async onDeviceRemoved(i){return this.api.onDeviceRemoved(i)}async onDeviceEvent(i,e,r){return this.api.onDeviceEvent(i,e,r)}async onDevicesChanged(i){return this.api.onDevicesChanged(i)}};Ie.DeviceManagerImpl=ps;function Vi(t){return t===null?"null":t===void 0?"undefined":t.toString()}var jt=class t{deviceManager;nativeId;prefix;api;static allowedMethods=["length","clear","getItem","setItem","key","removeItem"];static indexedHandler={get(i,e){let r=e.toString();if(t.allowedMethods.includes(r)){let s=i[r];return r==="length"?s:s.bind(i)}return i.getItem(Vi(e))},set(i,e,r){return i.setItem(Vi(e),r),!0}};constructor(i,e,r){return this.deviceManager=i,this.nativeId=e,this.prefix=r,this.deviceManager=i,this.api=i.api,this.nativeId=e,this.prefix||(this.prefix=""),new Proxy(this,t.indexedHandler)}get storage(){return this.deviceManager.nativeIds.get(this.nativeId).storage}get length(){return Object.keys(this.storage).filter(i=>i.startsWith(this.prefix)).length}clear(){if(!this.prefix)this.deviceManager.nativeIds.get(this.nativeId).storage={};else{let i=this.storage;Object.keys(this.storage).filter(e=>e.startsWith(this.prefix)).forEach(e=>delete i[e])}this.api.setStorage(this.nativeId,this.storage)}getItem(i){return this.storage[this.prefix+i]}key(i){return this.prefix?Object.keys(this.storage).filter(e=>e.startsWith(this.prefix))[i].substring(this.prefix.length):Object.keys(this.storage)[i]}removeItem(i){delete this.storage[this.prefix+i],this.api.setStorage(this.nativeId,this.storage)}setItem(i,e){i=Vi(i),e=Vi(e),this.storage[this.prefix+i]!==e&&(this.storage[this.prefix+i]=e,this.api.setStorage(this.nativeId,this.storage))}};Ie.StorageImpl=jt});var aa=v(qi=>{"use strict";Object.defineProperty(qi,"__esModule",{value:!0});qi.EndpointManagerImpl=void 0;var xt=Ze(),fs=class{deviceManager;api;pluginId;mediaManager;getEndpoint(i){if(!i)return this.pluginId;let e=this.deviceManager.nativeIds.get(i)?.id;if(!e)throw new Error("invalid nativeId "+i);return i?e:this.pluginId}async getUrlSafeIp(){let i=await this.api.getComponent("SCRYPTED_IP_ADDRESS");return i?.includes(":")?`[${i}]`:i}async getAuthenticatedPath(i){return this.getPath(i)}async getInsecurePublicLocalEndpoint(i){return this.getLocalEndpoint(i,{insecure:!0,public:!0})}async getPublicCloudEndpoint(i){return this.getCloudEndpoint(i,{public:!0})}async getPublicLocalEndpoint(i){return this.getLocalEndpoint(i,{public:!0})}async getPublicPushEndpoint(i){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(i)),xt.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,xt.ScryptedMimeTypes.PushEndpoint)}async getPath(i,e){return`/endpoint/${this.getEndpoint(i)}/${e?.public?"public/":""}`}async getLocalEndpoint(i,e){let r=e?.insecure?"http":"https",s=await this.api.getComponent(e?.insecure?"SCRYPTED_INSECURE_PORT":"SCRYPTED_SECURE_PORT"),n=await this.getPath(i,e);return`${r}://${await this.getUrlSafeIp()}:${s}${n}`}async getCloudEndpoint(i,e){let r=await this.getLocalEndpoint(i,e),s=await this.mediaManager.createMediaObject(Buffer.from(r),xt.ScryptedMimeTypes.LocalUrl);return this.mediaManager.convertMediaObjectToUrl(s,xt.ScryptedMimeTypes.LocalUrl)}async getCloudPushEndpoint(i){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(i)),xt.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,xt.ScryptedMimeTypes.PushEndpoint)}async setLocalAddresses(i){return(await this.api.getComponent("addresses")).setLocalAddresses(i)}async getLocalAddresses(){return await(await this.api.getComponent("addresses")).getLocalAddresses()}async setAccessControlAllowOrigin(i){let e=this;return(await this.deviceManager.systemManager.getComponent("setAccessControlAllowOrigin"))(i)}};qi.EndpointManagerImpl=fs});var la=v(Je=>{"use strict";Object.defineProperty(Je,"__esModule",{value:!0});Je.WebSocketSerializer=Je.WebSocketConnection=void 0;Je.createWebSocketClass=Vd;var ms=ge(),gs=class{events={};dispatchEvent(i){let e=this.events[i.type];if(e)for(let r of e)r(i)}addEventListener(i,e){let r=this.events[i];r||(r=this.events[i]=[]),r.push(e)}removeEventListener(i,e){let r=this.events[i];if(!r)return;let s=r.indexOf(e);s>-1&&r.splice(s,1)}};function Wi(t,i){Object.defineProperty(t,"on"+i,{get:function(){throw new Error(`${i} is write only`)},set:function(e){this.events[i]=[e]}})}function Vd(t){class i extends gs{connection;_url;_protocols;readyState;constructor(r,s){super(),this.connection=r,this._url=r.url,this._protocols=s,this.readyState=0,t(r,{connect:(n,o)=>{if(n!=null){this.dispatchEvent({type:"error",message:n.toString()});return}this.readyState=1,this.dispatchEvent({type:"open"})},end:()=>{this.readyState=3,this.dispatchEvent({type:"close",reason:"closed"})},error:n=>{this.readyState=3,this.dispatchEvent({type:"error",message:n.toString()})},data:n=>{this.dispatchEvent({type:"message",data:n,source:this})}})}send(r){this.connection.send(r)}get url(){return this._url}get extensions(){return""}close(r){this.connection.close(r)}}return Wi(i.prototype,"close"),Wi(i.prototype,"error"),Wi(i.prototype,"message"),Wi(i.prototype,"open"),i}var bs=class{url;websocketMethods;[ms.RpcPeer.PROPERTY_PROXY_PROPERTIES];[ms.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=["send","close"];constructor(i,e){this.url=i,this.websocketMethods=e,this[ms.RpcPeer.PROPERTY_PROXY_PROPERTIES]={url:i}}send(i){return this.websocketMethods.send(i)}close(i){return this.websocketMethods.close(i)}};Je.WebSocketConnection=bs;var _s=class{WebSocket;serialize(i,e){throw new Error("WebSocketSerializer should only be used for deserialization.")}deserialize(i,e){if(this.WebSocket)return new this.WebSocket(i)}};Je.WebSocketSerializer=_s});var da=v(et=>{"use strict";Object.defineProperty(et,"__esModule",{value:!0});et.EventRegistry=et.EventListenerRegisterImpl=void 0;et.getMixinEventName=ca;var qd=Ze(),Vt=class{removeListener;constructor(i){this.removeListener=i}};et.EventListenerRegisterImpl=Vt;function ca(t){let{event:i,mixinId:e}=t||{};return!i&&typeof t=="string"&&(i=t),i||(i=void 0),e?`${i}-mixin-${e}`:i}var Wd=new Set([qd.ScryptedInterface.ScryptedDevice,"Logger"]),vs=class{systemListeners=new Set;listeners={};listen(i){let e=this.systemListeners;return e.add(i),new Vt(()=>{e.delete(i),i=void 0})}listenDevice(i,e,r){let s=ca(e),n=`${i}#${s}`,o=this.listeners[n];return o||(o=new Set,this.listeners[n]=o),o.add(r),new Vt(()=>{o.delete(r),r=void 0})}notify(i,e,r,s,n,o){let{changed:a,mixinId:l}=o||{};if(s&&!a)return!1;let p={eventId:void 0,eventInterface:r,eventTime:e,property:s,mixinId:l};return this.notifyEventDetails(i,p,n)}notifyEventDetails(i,e,r,s){if(e.eventId||=Math.random().toString(36).substring(2),s||=e.eventInterface,e.property&&!e.mixinId||Wd.has(s))for(let a of this.systemListeners)a(i,e,r);let n=this.listeners[`${i}#${s}`];if(n)for(let a of n)a(e,r);let o=this.listeners[`${i}#undefined`];if(o)for(let a of o)a(e,r);return!0}};et.EventRegistry=vs});var ha=v(Ki=>{"use strict";Object.defineProperty(Ki,"__esModule",{value:!0});Ki.SystemManagerImpl=void 0;var K=Ze(),Kd=da(),ys=ge(),tt=ds();function Yd(t,i){let e=new xs(t,i);return new Proxy(e,e)}var xs=class{id;systemManager;customProperties;device;constructor(i,e){this.id=i,this.systemManager=e}toPrimitive(){return`ScryptedDevice-${this.id}`}ownKeys(i){let e=new Set(this.systemManager.state[this.id].interfaces.value),r=(0,tt.getInterfaceMethods)(this.systemManager.descriptors||K.ScryptedInterfaceDescriptors,e),s=(0,tt.getInterfaceProperties)(this.systemManager.descriptors||K.ScryptedInterfaceDescriptors,e);return[...r,...s]}getOwnPropertyDescriptor(i,e){let r=new Set(this.systemManager.state[this.id].interfaces.value),s=(0,tt.getInterfaceMethods)(this.systemManager.descriptors||K.ScryptedInterfaceDescriptors,r),n=e.toString();if(s.includes(n))return{configurable:!0};if((0,tt.getInterfaceProperties)(this.systemManager.descriptors||K.ScryptedInterfaceDescriptors,r).includes(n))return{configurable:!0,value:this.systemManager.state[this.id][n]?.value}}deleteProperty(i,e){let r=e.toString();return Object.keys(K.ScryptedInterfaceProperty).includes(r)?!1:(this.customProperties||=new Map,this.customProperties.set(e,void 0),!0)}set(i,e,r,s){let n=e.toString();return Object.keys(K.ScryptedInterfaceProperty).includes(n)?!1:(this.customProperties||=new Map,this.customProperties.set(e,r),!0)}get(i,e,r){if(e==="id")return this.id;if(this.customProperties?.has(e))return this.customProperties.get(e);let s=ys.RpcPeer.handleFunctionInvocations(this,i,e,r);if(s)return s;let n=new Set(this.systemManager.state[this.id].interfaces?.value||[]),o=e.toString();if(this.systemManager.propertyInterfaces?.[o]||tt.propertyInterfaces[o])return this.systemManager.state[this.id]?.[e]?.value;if((0,tt.isValidInterfaceMethod)(this.systemManager.descriptors||K.ScryptedInterfaceDescriptors,n,o))return K.ScryptedInterfaceDescriptors[K.ScryptedInterface.ScryptedDevice].methods.includes(o)?this[e].bind(this):new Proxy(()=>e,this)}ensureDevice(){return this.device||(this.device=this.systemManager.api.getDeviceById(this.id)),this.device}async apply(i,e,r){let s=i();return(await this.ensureDevice())[s](...r)}listen(i,e){return this.systemManager.listenDevice(this.id,i,e)}async setName(i){return this.systemManager.api.setDeviceProperty(this.id,K.ScryptedInterfaceProperty.name,i)}async setRoom(i){return this.systemManager.api.setDeviceProperty(this.id,K.ScryptedInterfaceProperty.room,i)}async setType(i){return this.systemManager.api.setDeviceProperty(this.id,K.ScryptedInterfaceProperty.type,i)}async setMixins(i){await(await this.systemManager.getComponent("plugins")).setMixins(this.id,i)}async probe(){return this.apply(()=>"probe",void 0,[])}},ws=class{promise;constructor(i){this.promise=i}async removeListener(){try{let i=await this.promise;this.promise=void 0,i?.removeListener()}catch(i){console.error("removeListener",i)}}};function ua(t){let i=t,e=i[ys.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]||[];return e.includes(null)||e.push(null),i[ys.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=e,t}var Cs=class{api;state;deviceProxies={};log;events=new Kd.EventRegistry;typesVersion;descriptors;propertyInterfaces;getDeviceState(i){return this.state[i]}getSystemState(){return this.state}getDeviceById(i,e){let r;if(this.state[i]){if(e!=null)return;r=i}else for(let n of Object.keys(this.state)){let o=this.state[n];if(o&&o[K.ScryptedInterfaceProperty.pluginId]?.value===i&&o[K.ScryptedInterfaceProperty.nativeId]?.value==e){r=n;break}}if(!r)return;let s=this.deviceProxies[r];return s||(s=this.deviceProxies[r]=Yd(r,this)),s}getDeviceByName(i){for(let e of Object.keys(this.state)){let r=this.state[e];if(r.interfaces?.value?.includes(K.ScryptedInterface.ScryptedPlugin)&&r.pluginId?.value===i)return this.getDeviceById(e);if(r.name.value===i)return this.getDeviceById(e)}}listen(i){return this.events.listen(ua((e,r,s)=>i(this.getDeviceById(e),r,s)))}listenDevice(i,e,r){let{watch:s}=e||{};return s?this.events.listenDevice(i,e,(n,o)=>r(this.getDeviceById(i),n,o)):new ws(this.api.listenDevice(i,e,ua((n,o)=>r(this.getDeviceById(i),n,o))))}async removeDevice(i){return this.api.removeDevice(i)}getComponent(i){return this.api.getComponent(i)}setScryptedInterfaceDescriptors(i,e){return this.typesVersion=i,this.descriptors=e,this.propertyInterfaces=(0,tt.getPropertyInterfaces)(e),this.api.setScryptedInterfaceDescriptors(i,e)}};Ki.SystemManagerImpl=Cs});var pa=v(Yi=>{"use strict";Object.defineProperty(Yi,"__esModule",{value:!0});Yi.ClusterManagerImpl=void 0;var ks=class{clusterMode;api;clusterWorkerId;clusterServicePromise;constructor(i,e,r){this.clusterMode=i,this.api=e,this.clusterWorkerId=r}getClusterWorkerId(){return this.clusterWorkerId}getClusterAddress(){return process.env.SCRYPTED_CLUSTER_ADDRESS}getClusterMode(){return this.clusterMode}async getClusterWorkers(){return(await this.getClusterService()).getClusterWorkers()}getClusterService(){return this.clusterServicePromise||=this.api.getComponent("cluster-fork"),this.clusterServicePromise}};Yi.ClusterManagerImpl=ks});var ga=v(Qi=>{"use strict";Object.defineProperty(Qi,"__esModule",{value:!0});Qi.setupPluginRemote=Zd;Qi.attachPluginRemote=Jd;var wt=Ze(),$s=ge(),ma=ls(),fa=oa(),Qd=aa(),Ss=la(),Xd=ha(),Gd=pa();async function Zd(t,i,e,r,s){try{t.constructorSerializerMap.get(Buffer)||t.addSerializer(Buffer,"Buffer",new ma.BufferSerializer);let o=await(await t.getParam("getRemote"))(i,e,r),a=t.tags.acl,l=(u,d)=>{if(d=d||s()[u],a&&d){d=Object.assign({},d);for(let m of Object.keys(d))a.shouldRejectProperty(u,m)&&delete d[m];let f=d.interfaces?.value;f&&(f=f.filter(m=>!a.shouldRejectInterface(u,m)),d.interfaces={value:f})}return d},p=()=>{let u=s();if(a){u=Object.assign({},u);for(let d of Object.keys(u)){if(a.shouldRejectDevice(d)){delete u[d];continue}u[d]=l(d,u[d])}}return u};return await o.setSystemState(p()),i.listen((u,d,f)=>{if(!a?.shouldRejectEvent(d.property===wt.ScryptedInterfaceProperty.id?f:u,d)){if(d.eventInterface===wt.ScryptedInterface.ScryptedDevice){d.property===wt.ScryptedInterfaceProperty.id?o.updateDeviceState(f,void 0):o.updateDeviceState(u,l(u));return}d.property&&!d.mixinId?o.notify(u,d,s()[u]?.[d.property]).catch(()=>{}):o.notify(u,d,f).catch(()=>{})}}),o}catch(n){throw new $s.RPCResultError(t,"error while retrieving PluginRemote",n)}}function Jd(t,i){let{createMediaManager:e,getServicePort:r,getDeviceConsole:s,getMixinConsole:n}=i||{};t.constructorSerializerMap.get(Buffer)||t.addSerializer(Buffer,"Buffer",new ma.BufferSerializer);let o={},a=new Ss.WebSocketSerializer;t.addSerializer(Ss.WebSocketConnection,"WebSocketConnection",a);let l,p=new Promise(u=>l=u);return t.params.getRemote=async(u,d,f)=>{a.WebSocket=(0,Ss.createWebSocketClass)((C,P)=>{let{url:D}=C;if(D.startsWith("io://")||D.startsWith("ws://")){let B=D.substring(5);o[B]=P,P.connect(void 0,{close:L=>C.close(L),send:L=>C.send(L)})}else throw new Error("unsupported websocket")}),u=await i?.onGetRemote?.(u,d)||u;let m=new Xd.SystemManagerImpl,g=new fa.DeviceManagerImpl(m,s,n),x=new Qd.EndpointManagerImpl,w=new Gd.ClusterManagerImpl(void 0,u,void 0),R=await u.getMediaManager();R||(t.params.createMediaManager=async()=>e(m,g));let z=R||await e(m,g);t.params.mediaManager=z,m.api=u,g.api=u;let Y=g.getDeviceLogger(void 0);m.log=Y;let I={systemManager:m,deviceManager:g,endpointManager:x,mediaManager:z,clusterManager:w,log:Y,pluginHostAPI:u,pluginRemoteAPI:void 0,serverVersion:f?.serverVersion,connect:void 0,fork:void 0,connectRPCObject:void 0};delete t.params.getRemote,x.api=u,x.deviceManager=g,x.mediaManager=z,x.pluginId=d;let se=new fa.StorageImpl(g,void 0),be={[$s.RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION]:!0,[$s.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]:["notify","updateDeviceState","setSystemState","ioEvent","setNativeId"],getServicePort:r,async createDeviceState(C,P){return g.createDeviceState(C,P)},async ioEvent(C,P,D){let B=o[C];if(B)switch(P){case"message":B.data(D);break;case"close":B.end(),delete o[C];break}},async setNativeId(C,P,D){C===null&&(C=void 0),P?g.nativeIds.set(C?.toString(),{id:P,storage:D}):g.nativeIds.delete(C)},async updateDeviceState(C,P){P?(m.state[C]=P,m.events.notify(C,void 0,wt.ScryptedInterface.ScryptedDevice,void 0,P,{changed:!0})):(delete m.state[C],m.events.notify(void 0,void 0,wt.ScryptedInterface.ScryptedDevice,wt.ScryptedInterfaceProperty.id,C,{changed:!0}))},async notify(C,P,D,B,L,Zt){if(typeof P=="number"){let ne=P,oe=D;if(B){let $e=m.state?.[C];if(!$e){Y.w(`state not found for ${C}`);return}$e[B]=L,m.events.notify(C,ne,oe,B,L.value,{changed:Zt})}else m.events.notify(C,ne,oe,B,L,{changed:Zt})}else{let ne=P,oe=D;if(ne.property&&!ne.mixinId){let $e=m.state?.[C];if(!$e){Y.w(`state not found for ${C}`);return}$e[ne.property]=oe,m.events.notifyEventDetails(C,ne,oe.value)}else m.events.notifyEventDetails(C,ne,oe)}},async setSystemState(C){m.state=C,g.pruneMixinStorage(),l(I)},async loadZip(C,P,D){let B={__filename:void 0,deviceManager:g,systemManager:m,mediaManager:z,endpointManager:x,localStorage:se,pluginHostAPI:u,WebSocket:function(L){if(typeof L=="string")throw new Error("unsupported websocket");return L},pluginRuntimeAPI:I};B.pluginRuntimeAPI=I;try{return await i.onLoadZip(I,B,C,P,D)}catch(L){throw console.error("plugin start/fork failed",L),L}}};return I.pluginRemoteAPI=be,be},p}});var Ts=v(Ct=>{"use strict";Object.defineProperty(Ct,"__esModule",{value:!0});Ct.createDuplexRpcPeer=iu;Ct.createRpcSerializer=ba;Ct.createRpcDuplexSerializer=Es;Ct.createDataChannelSerializer=ru;var eu=ls(),tu=ge();function iu(t,i,e,r){let s=Es(r),n=new tu.RpcPeer(t,i,(o,a,l)=>{try{s.sendMessage(o,a,l)}catch(p){a?.(p),e.destroy()}});return s.setupRpcPeer(n),e.on("data",o=>s.onData(o)),e.on("close",s.onDisconnected),e.on("error",s.onDisconnected),n}function ba(t){let i,{sendMessageBuffer:e,sendMessageFinish:r}=t,s=!0,n=()=>{s=!1,i.kill("connection closed.")},o=(f,m,g)=>{if(!s){m?.(new Error("peer disconnected"));return}let x=g?.buffers;if(x)for(let w of x)e(w);r(f)},a;return{kill:f=>{i.kill(f)},sendMessage:o,setupRpcPeer:f=>{i=f,i.addSerializer(Buffer,"Buffer",new eu.SidebandBufferSerializer),i.constructorSerializerMap.set(Uint8Array,"Buffer")},onMessageBuffer:f=>{a=a||{},a.buffers||=[],a.buffers.push(f)},onMessageFinish:f=>{let m=a;a=void 0,i.handleMessage(f,m)},onDisconnected:n}}function Es(t){let i=(d,f)=>{let m=Buffer.alloc(5);m.writeUInt32BE(f.length+1,0),m.writeUInt8(d,4),t.write(Buffer.concat([m,f]))},e=d=>f=>i(d,f),r=e(1),s=e(0),n=ba({sendMessageBuffer:r,sendMessageFinish:d=>s(Buffer.from(JSON.stringify(d)))}),o,a,l,p;return{onData:d=>{for(;d.length;){if(!a){if(o?o=Buffer.concat([o,d]):o=d,o.length<5)return;d=o.slice(5);let g=o.readUInt32BE(0)-1;p=o.readUInt8(4),d.length>=g&&p===0?(a=d.length===g?d:d.slice(0,g),l=g,d=d.slice(g)):(a=Buffer.alloc(g),l=0),o=void 0}let f=a.length-l;if(f){let g=d.slice(0,f);d=d.slice(f),a.set(g,l),l+=g.length}if(l!==a.length)return;let m=a;if(a=void 0,p===0)try{let g=JSON.parse(m.toString());n.onMessageFinish(g)}catch(g){n.kill("message parse failure "+g.message)}else n.onMessageBuffer(m)}},setupRpcPeer:n.setupRpcPeer,sendMessage:n.sendMessage,onDisconnected:n.onDisconnected}}function ru(t){let i;function r(){if(!i||i.length===0)return;let a=i;i=void 0;for(let l of a){let p=0;for(;p<l.length;){let u=l.length-p,d=Math.min(u,16384),f=l.subarray(p,p+d);t.send(f),p+=d}}}function s(a){let l=!!i;i||(i=[]),i.push(a),l||setTimeout(()=>r(),0)}return Es({write:a=>{s(a)}})}});var _a=v((Sf,su)=>{su.exports={name:"@scrypted/client",version:"1.3.26",description:"",main:"dist/packages/client/src/index.js",scripts:{prebuild:"rimraf dist",build:"tsc --outDir dist",prepublishOnly:"npm run build",test:'echo "Error: no test specified" && exit 1'},author:"",license:"ISC",devDependencies:{"@types/ip":"^1.1.3","@types/node":"^24.0.10","@types/ws":"^8.18.1","ts-node":"^10.9.2",typescript:"^5.8.3"},peerDependencies:{"@scrypted/types":"^0.5.44"},dependencies:{"engine.io-client":"^6.6.3","follow-redirects":"^1.15.9",rimraf:"^6.0.1"}}});var xa=v(qt=>{"use strict";Object.defineProperty(qt,"__esModule",{value:!0});qt.isIPV4Address=va;qt.isIPV6Address=ya;qt.isIPAddress=au;var nu=/^(\d{1,3}\.){3,3}\d{1,3}$/,ou=/^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;function va(t){return nu.test(t)}function ya(t){return ou.test(t)}function au(t){return va(t)||ya(t)}});var Ps=v(G=>{"use strict";Object.defineProperty(G,"__esModule",{value:!0});G.fetchStatusCodeOk=wa;G.checkStatus=Ca;G.getFetchMethod=ka;G.getHttpFetchAccept=Sa;G.hasHeader=Xi;G.removeHeader=$a;G.setHeader=Gi;G.setDefaultHttpFetchAccept=Ea;G.createHeadersArray=Ta;G.createStringOrBufferBody=Pa;G.domFetchParseIncomingMessage=Aa;G.domFetch=lu;function wa(t){return t>=200&&t<=299}function Ca(t){if(!wa(t))throw new Error(`http response statusCode ${t}`);return!0}function ka(t){return t.method||(t.body?"POST":"GET")}function Sa(t){switch(t){case"json":return"application/json";case"text":return"text/plain"}}function Xi(t,i){return i=i.toLowerCase(),t.find(([e])=>e.toLowerCase()===i)}function $a(t,i){i=i.toLowerCase();let e=t.filter(([r,s])=>r.toLowerCase()!==i);t.length=0,e.forEach(r=>t.push(r))}function Gi(t,i,e){$a(t,i),t.push([i,e])}function Ea(t,i){if(Xi(t,"Accept"))return;let e=Sa(i);e&&Gi(t,"Accept",e)}function Ta(t){let i=[];if(!t)return i;if(t instanceof Headers){for(let[e,r]of t.entries())i.push([e,r]);return i}if(t instanceof Array){for(let[e,r]of t)i.push([e,r]);return i}for(let e of Object.keys(t)){let r=t[e];i.push([e,r])}return i}function Pa(t,i){let e;return typeof i=="object"?(i=JSON.stringify(i),e="application/json"):typeof i=="string"&&(e="text/plain"),e&&!Xi(t,"Content-Type")&&Gi(t,"Content-Type",e),Xi(t,"Content-Length")||(i=Buffer.from(i),Gi(t,"Content-Length",i.length.toString())),i}async function Aa(t,i){switch(i){case"json":return t.json();case"text":return t.text();case"readable":return t}return new Uint8Array(await t.arrayBuffer())}async function lu(t){let i=Ta(t.headers);Ea(i,t.responseType);let{body:e}=t;e&&!(e instanceof ReadableStream)&&(e=Pa(i,e));let r,s;t.timeout&&(r=new AbortController,s=setTimeout(()=>r.abort(),t.timeout),t.signal?.addEventListener("abort",()=>r.abort(t.signal?.reason)));try{let{url:n}=t,o=await fetch(n,{method:ka(t),credentials:t.withCredentials?"include":void 0,headers:i,signal:r?.signal||t.signal,body:e});if(t?.checkStatusCode===void 0||t?.checkStatusCode)try{if(!(typeof t?.checkStatusCode=="function"?t.checkStatusCode:Ca)(o.status))throw new Error(`http response statusCode ${o.status}`)}catch(a){throw o.arrayBuffer().catch(()=>{}),a}return{statusCode:o.status,headers:o.headers,body:await Aa(o,t.responseType)}}finally{clearTimeout(s)}}});var it={};ml(it,{default:()=>cu});var cu,rt=fl(()=>{"use strict";cu={}});var Ma=v(Kt=>{"use strict";Object.defineProperty(Kt,"__esModule",{value:!0});Kt.getHttpFetchParser=Ra;Kt.httpFetchParseIncomingMessage=La;Kt.httpFetch=fu;var Wt=Ps();async function Zi(t){let i=[];t.on("data",r=>i.push(r));let{once:e}=(rt(),ot(it));return await e(t,"end"),Buffer.concat(i)}var du={async parse(t){return(await Zi(t)).toString()}},uu={async parse(t){return JSON.parse((await Zi(t)).toString())}},hu={async parse(t){return Zi(t)}},pu={async parse(t){return t}};function Ra(t){switch(t){case"json":return uu;case"text":return du;case"readable":return pu}return hu}function La(t,i){return Ra(i).parse(t)}async function fu(t){let i=(0,Wt.createHeadersArray)(t.headers);(0,Wt.setDefaultHttpFetchAccept)(i,t.responseType);let{once:e}=(rt(),ot(it)),{PassThrough:r,Readable:s}=(rt(),ot(it)),{http:n,https:o}=(rt(),ot(it)),{url:a}=t,p=a.toString().startsWith("https:")?o:n,{body:u}=t;if(u&&!(u instanceof s)){let w=new r;w.write(Buffer.from((0,Wt.createStringOrBufferBody)(i,u))),w.end(),u=w}let d,f;t.timeout&&(d=new AbortController,f=setTimeout(()=>d.abort(),t.timeout),t.signal?.addEventListener("abort",()=>d.abort(t.signal?.reason)));let m=d?.signal||t.signal;m?.addEventListener("abort",()=>x.destroy(new Error(t.signal?.reason||"abort")));let g={};for(let[w,R]of i)g[w]?g[w].push(R):g[w]=[R];let x=p.request(a,{method:(0,Wt.getFetchMethod)(t),rejectUnauthorized:t.rejectUnauthorized,family:t.family,headers:g,signal:m,timeout:t.timeout});u?u.pipe(x):x.end();try{let[w]=await e(x,"response");if(t?.checkStatusCode===void 0||t?.checkStatusCode)try{let z=typeof t?.checkStatusCode=="function"?t.checkStatusCode:Wt.checkStatus;if(!w.statusCode||!z(w.statusCode))throw new Error(`http response statusCode ${w.statusCode}`)}catch(z){throw Zi(w).catch(()=>{}),z}let R=new Headers;for(let[z,Y]of Object.entries(w.headers))for(let I of typeof Y=="string"?[Y]:Y)R.append(z,I);return{statusCode:w.statusCode,headers:R,body:await La(w,t.responseType)}}finally{clearTimeout(f)}}});var Ha=v(A=>{"use strict";var mu=A&&A.__createBinding||(Object.create?function(t,i,e,r){r===void 0&&(r=e);var s=Object.getOwnPropertyDescriptor(i,e);(!s||("get"in s?!i.__esModule:s.writable||s.configurable))&&(s={enumerable:!0,get:function(){return i[e]}}),Object.defineProperty(t,r,s)}:function(t,i,e,r){r===void 0&&(r=e),t[r]=i[e]}),gu=A&&A.__setModuleDefault||(Object.create?function(t,i){Object.defineProperty(t,"default",{enumerable:!0,value:i})}:function(t,i){t.default=i}),Os=A&&A.__importStar||function(){var t=function(i){return t=Object.getOwnPropertyNames||function(e){var r=[];for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(r[r.length]=s);return r},t(i)};return function(i){if(i&&i.__esModule)return i;var e={};if(i!=null)for(var r=t(i),s=0;s<r.length;s++)r[s]!=="default"&&mu(e,i,r[s]);return gu(e,i),e}}(),bu=A&&A.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(A,"__esModule",{value:!0});A.ScryptedClientLoginError=A.rpc_serializer=A.rpc=void 0;A.logoutScryptedClient=Eu;A.getCurrentBaseUrl=Tu;A.loginScryptedClient=Da;A.checkScryptedClientLogin=Ms;A.redirectScryptedLogin=Pu;A.combineBaseUrl=Xt;A.redirectScryptedLogout=Au;A.connectScryptedClient=Ru;var As=Os(Oo()),_u=Io(),vu=Ho(),yu=ga(),Ls=ge(),Oa=Ts(),xu=bu(_a()),wu=xa(),Cu=Ps(),ku=Ma();A.rpc=Os(ge());A.rpc_serializer=Os(Ts());var Yt;try{throw new Error}catch{Yt=Cu.domFetch}var Su=Ls.RpcPeer.generateId();function Rs(t,i){return new Promise((e,r)=>{let s=a=>{o(),r(a)},n=(...a)=>{o(),e(a)},o=()=>{t.removeListener("error",s),t.removeListener(i,n)};t.once("error",s),t.once(i,n)})}function Ia(){return globalThis.navigator?.userAgent.includes("InstalledApp")}function $u(){return globalThis.matchMedia?.("(display-mode: standalone)").matches||Ia()}async function Eu(t){let i=Xt(t,"logout");return(await Yt({url:i,withCredentials:!0,responseType:"json",rejectUnauthorized:!1})).body}function Tu(){let t=new URL(window.location.href);t.search="",t.hash="";let e=window.location.pathname.split("/"),r=e.findIndex(n=>n==="endpoint");if(r===-1)return;let s=e.slice(0,r);return s.push(""),t.pathname=s.join("/"),t.toString()}async function Da(t){let{baseUrl:i,username:e,password:r,change_password:s,maxAge:n}=t;!n&&$u()&&(n=365*24*60*60*1e3);let o=Xt(i,"login"),a=await Yt({url:o,body:{username:e,password:r,change_password:s,maxAge:n},rejectUnauthorized:!1,withCredentials:!0,responseType:"json"});if(a.statusCode!==200)throw new Error("status "+a.statusCode);let{body:l}=a;return{error:l.error,authorization:l.authorization,queryToken:l.queryToken,token:l.token,addresses:l.addresses,externalAddresses:l.externalAddresses,hostname:l.hostname,scryptedCloud:a.headers.get("x-scrypted-cloud")==="true",directAddress:a.headers.get("x-scrypted-direct-address"),cloudAddress:a.headers.get("x-scrypted-cloud-address"),serverId:a.headers.get("x-scrypted-server-id")}}async function Ms(t){let{baseUrl:i}=t||{},e=Xt(i,"login"),r=new Headers;if(t?.previousLoginResult?.queryToken){let o=t?.previousLoginResult.username+":"+t.previousLoginResult.token,a=Buffer.from(o).toString("base64");r.set("Authorization",`Basic ${a}`)}let s=await Yt({url:e,withCredentials:!0,headers:r,rejectUnauthorized:!1,responseType:"json"}),{body:n}=s;return{baseUrl:i,hostname:n.hostname,redirect:n.redirect,username:n.username,expiration:n.expiration,hasLogin:!!n.hasLogin,error:n.error,authorization:n.authorization,queryToken:n.queryToken,token:n.token,addresses:n.addresses,externalAddresses:n.externalAddresses,scryptedCloud:s.headers.get("x-scrypted-cloud")==="true",directAddress:s.headers.get("x-scrypted-direct-address"),cloudAddress:s.headers.get("x-scrypted-cloud-address"),serverId:s.headers.get("x-scrypted-server-id")}}var Qt=class extends Error{result;constructor(i){super(i.error),this.result=i}};A.ScryptedClientLoginError=Qt;function Pu(t){let{baseUrl:i,redirect:e}=t||{};if(e=e||"/endpoint/@scrypted/core/public/",i){let s=new URL(e,i);s.searchParams.set("redirect_uri",window.location.href),e=s.toString()}else e=`${e}?redirect_uri=${encodeURIComponent(window.location.href)}`;let r=e;console.log("redirect_uri",r),globalThis.location.href=r}function Xt(t,i){return t?new URL(i,t).toString():"/"+i}async function Au(t){globalThis.location.href=Xt(t,"logout")}async function Ru(t){let i=Date.now(),{baseUrl:e,pluginId:r,clientName:s,username:n,password:o}=t,a,l,p,u,d,f,m,g,x,w;console.log("@scrypted/client",xu.default.version);let R={},Y=!globalThis.navigator?.userAgent.includes("Chrome")||Ia(),I=!1;if(n&&o){let k=await Da(t);k.authorization&&(R.Authorization=k.authorization),p=k.addresses,u=k.externalAddresses,d=k.scryptedCloud,f=k.directAddress,m=k.cloudAddress,a=k.authorization,l=k.queryToken,x=k.token,g=k.hostname,w=k.serverId,console.log("login result",Date.now()-i,k)}else{let Z=function(O){if(O.error||O.redirect)throw new Qt(O);if(!O.authorization||!O.username||!O.queryToken)throw console.error(O),new Error("malformed login result");return O},k=new Set;if(t?.previousLoginResult?.token){for(let O of[...t?.previousLoginResult?.localAddresses||[],t?.previousLoginResult?.directAddress])O&&(Y||t.direct)&&k.add(O);for(let O of[...t?.previousLoginResult?.externalAddresses||[],t?.previousLoginResult?.cloudAddress])O&&k.add(O)}let ae=[...k].map(O=>Ms({baseUrl:O,previousLoginResult:t?.previousLoginResult}).then(Z)),ti=Ms({baseUrl:e,previousLoginResult:t?.previousLoginResult}).then(Z);ae.push(ti);let M;try{M=await Promise.any(ae),I||=M.baseUrl!==e}catch{M=await ti}if(I&&console.log("Found direct login. Allowing alternate addresses."),M.error||M.redirect)throw new Qt(M);p=M.addresses,u=M.externalAddresses,d=M.scryptedCloud,f=M.directAddress,m=M.cloudAddress,n=M.username,a=M.authorization,l=M.queryToken,x=M.token,g=M.hostname,w=M.serverId,console.log("login checked",Date.now()-i,M)}let se,be=`endpoint/${r}/engine.io/api`,C=e?new URL(be,e).pathname:"/"+be,P=Math.random().toString(36).substring(3,10),D={path:C,query:{cacheBust:P},withCredentials:!0,extraHeaders:R,rejectUnauthorized:!1,transports:t?.transports},B=e||`${globalThis.location.protocol}//${globalThis.location.host}`,L=[],Zt=Y;I||=d,(I&&t.local===void 0&&Zt||t.local)&&p&&L.push(...p);let ne=f&&(Y||!(0,wu.isIPAddress)(f));if((I&&t.direct===void 0&&ne||t.direct)&&f&&L.push(f),I&&t.direct===void 0||t.direct){m&&L.push(m);for(let k of u||[])L.push(k)}let oe=!!L.length;console.log({tryLocalAddressess:oe});let $e={...D,extraHeaders:{...D.extraHeaders}};$e.extraHeaders.Authorization||=a;let St=[],Jt=[];if(oe)for(let k of new Set(L)){console.log("trying",k);let Z=new As.Socket(k,$e);St.push(Z),Jt.push((async()=>(await Rs(Z,"open"),{connectionType:"http-direct",ready:Z,address:k}))())}let Za=[...Jt];Jt.push((async()=>{let k=oe?1e3:0;if(console.log("waiting",k),k)try{let ae=Promise.any(Za);await(0,_u.timeoutPromise)(k,ae),console.log("found direct connection, aborting scrypted cloud connection");return}catch{}let Z=new As.Socket(B,D);return St.push(Z),await Rs(Z,"open"),{ready:Z,address:B,connectionType:d?"http-cloud":"http"}})());let Ja=Promise.any(Jt),{ready:Js,connectionType:en,address:ei,rpcPeer:Ee}=await Ja;console.log("connected",en,ei),se=Js,St=St.filter(k=>k!==Js),St.forEach(k=>{try{k.close()}catch{}});try{if(!Ee){let E=(0,Oa.createRpcSerializer)({sendMessageBuffer:T=>se.send(T),sendMessageFinish:T=>se.send(JSON.stringify(T))});Ee=new Ls.RpcPeer(s||"engine.io-client","api",(T,V,le)=>{try{E.sendMessage(T,V,le)}catch(ri){V?.(ri)}}),se.on("message",T=>{T.constructor===Buffer||T.constructor===ArrayBuffer?E.onMessageBuffer(Buffer.from(T)):E.onMessageFinish(JSON.parse(T))}),E.setupRpcPeer(Ee)}let k=await(0,yu.attachPluginRemote)(Ee,void 0),{serverVersion:Z,systemManager:ae,deviceManager:ti,endpointManager:M,mediaManager:O,clusterManager:el}=k;console.log("api attached",Date.now()-i),O.createMediaObject=async(E,T,V)=>new vu.MediaObject(T,E,V);let[tl]=await Promise.all([(async()=>{try{return!!await ae.getComponent("info")}catch{}return!1})()]);console.log("api initialized",Date.now()-i);let il=Object.keys(ae.getSystemState()).map(E=>ae.getDeviceById(E)).find(E=>E.pluginId==="@scrypted/core"&&E.nativeId===`user:${n}`),ii=new Map,rl=new FinalizationRegistry(E=>{E.kill("object finalized")}),sl=(E,T)=>{if(!T?.dedicatedTransport){let le=ii.get(E.port);if(le)return le}let V=(async()=>{let le="engine.io/connectRPCObject",si={path:new URL(le,ei).pathname,query:{cacheBust:P,clusterObject:JSON.stringify(E),...l},withCredentials:!0,extraHeaders:R,rejectUnauthorized:!1,transports:t?.transports},_e=new As.Socket(ei,si),st=!1,Te,ee,ce,rn=()=>{Te&&(clearTimeout(Te),Te=void 0),ee&&(clearTimeout(ee),ee=void 0)},sn=T?.dedicatedTransport?.receiveTimeout?()=>{Te&&clearTimeout(Te),Te=setTimeout(()=>{ce&&ce.kill("receive timeout")},T.dedicatedTransport.receiveTimeout)}:void 0,ir=T?.dedicatedTransport?.sendTimeout?()=>{ee&&clearTimeout(ee),ee=setTimeout(()=>{ce&&ce.kill("send timeout")},T.dedicatedTransport.sendTimeout)}:void 0;_e.on("close",()=>{if(ce?.kill("socket closed"),T?.dedicatedTransport||ii.delete(E.port),!st)throw new Error("peer disconnected before setup completed")});try{await Rs(_e,"open");let nt=(0,Oa.createRpcDuplexSerializer)({write:$t=>{ir?.(),_e.send($t)}});return _e.on("message",$t=>{sn?.(),nt.onData(Buffer.from($t))}),ce=new Ls.RpcPeer(s||"engine.io-client","cluster-proxy",($t,nn,al)=>{try{ir?.(),nt.sendMessage($t,nn,al)}catch(ll){nn?.(ll)}}),ce.killedSafe.finally(()=>{rn(),_e.close()}),nt.setupRpcPeer(ce),ce.tags.localPort=Su,st=!0,sn?.(),ir?.(),ce}catch(nt){throw rn(),console.error("failure ipc connect",nt),_e.close(),nt}})();return T?.dedicatedTransport||ii.set(E.port,V),V},nl=async(E,T)=>{let V=await ii.get(T);return V?.remoteWeakProxies?Object.values(V.remoteWeakProxies).find(le=>le.deref()?.__cluster?.proxyId==E)?.deref():null},ol=async(E,T)=>{let V=E?.__cluster;if(!V)return E;let{port:le,proxyId:ri}=V,si=await nl(ri,le);if(si)return si;try{let st=await sl(V,T),Te=await st.getParam("connectRPCObject");try{let ee=await Te(V);if(!ee)throw new Error("ipc object not found?");return T?.dedicatedTransport&&rl.register(ee,st),ee}catch(ee){throw T?.dedicatedTransport&&st.kill("connectRPCObject failed"),ee}}catch(_e){return console.error("failure ipc",_e),E}},tn={userId:il?.id,serverVersion:Z,username:n,pluginRemoteAPI:void 0,address:ei,connectionType:en,admin:tl,systemManager:ae,clusterManager:el,deviceManager:ti,endpointManager:M,mediaManager:O,disconnect(){Ee.kill("disconnect requested")},pluginHostAPI:void 0,rpcPeer:Ee,loginResult:{username:n,token:x,directAddress:f,localAddresses:p,externalAddresses:u,scryptedCloud:d,queryToken:l,authorization:a,cloudAddress:m,hostname:g,serverId:w},connectRPCObject:ol,fork:void 0,connect:void 0};return se.on("close",()=>{Ee.kill("socket closed")}),Ee.killed.finally(()=>{se.close(),tn.onClose?.()}),tn}catch(k){throw se.close(),k}}});var oi=globalThis,ai=oi.ShadowRoot&&(oi.ShadyCSS===void 0||oi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,rr=Symbol(),an=new WeakMap,Et=class{constructor(i,e,r){if(this._$cssResult$=!0,r!==rr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(ai&&i===void 0){let r=e!==void 0&&e.length===1;r&&(i=an.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),r&&an.set(e,i))}return i}toString(){return this.cssText}},He=t=>new Et(typeof t=="string"?t:t+"",void 0,rr),y=(t,...i)=>{let e=t.length===1?t[0]:i.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1],t[0]);return new Et(e,t,rr)},ln=(t,i)=>{if(ai)t.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let r=document.createElement("style"),s=oi.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,t.appendChild(r)}},sr=ai?t=>t:t=>t instanceof CSSStyleSheet?(i=>{let e="";for(let r of i.cssRules)e+=r.cssText;return He(e)})(t):t;var{is:bl,defineProperty:_l,getOwnPropertyDescriptor:vl,getOwnPropertyNames:yl,getOwnPropertySymbols:xl,getPrototypeOf:wl}=Object,li=globalThis,cn=li.trustedTypes,Cl=cn?cn.emptyScript:"",kl=li.reactiveElementPolyfillSupport,Tt=(t,i)=>t,nr={toAttribute(t,i){switch(i){case Boolean:t=t?Cl:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},un=(t,i)=>!bl(t,i),dn={attribute:!0,type:String,converter:nr,reflect:!1,useDefault:!1,hasChanged:un};Symbol.metadata??=Symbol("metadata"),li.litPropertyMetadata??=new WeakMap;var ve=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=dn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(i,r,e);s!==void 0&&_l(this.prototype,i,s)}}static getPropertyDescriptor(i,e,r){let{get:s,set:n}=vl(this.prototype,i)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let a=s?.call(this);n?.call(this,o),this.requestUpdate(i,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??dn}static _$Ei(){if(this.hasOwnProperty(Tt("elementProperties")))return;let i=wl(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(Tt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Tt("properties"))){let e=this.properties,r=[...yl(e),...xl(e)];for(let s of r)this.createProperty(s,e[s])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let r=new Set(i.flat(1/0).reverse());for(let s of r)e.unshift(sr(s))}else i!==void 0&&e.push(sr(i));return e}static _$Eu(i,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(i.set(r,this[r]),delete this[r]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ln(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,r){this._$AK(i,r)}_$ET(i,e){let r=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,r);if(s!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:nr).toAttribute(e,r.type);this._$Em=i,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(i,e){let r=this.constructor,s=r._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let n=r.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:nr;this._$Em=s;let a=o.fromAttribute(e,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(i,e,r,s=!1,n){if(i!==void 0){let o=this.constructor;if(s===!1&&(n=this[i]),r??=o.getPropertyOptions(i),!((r.hasChanged??un)(n,e)||r.useDefault&&r.reflect&&n===this._$Ej?.get(i)&&!this.hasAttribute(o._$Eu(i,r))))return;this.C(i,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,o??e??this[i]),n!==!0||o!==void 0)||(this._$AL.has(i)||(this.hasUpdated||r||(e=void 0),this._$AL.set(i,e)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,n]of r){let{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw i=!1,this._$EM(),r}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};ve.elementStyles=[],ve.shadowRootOptions={mode:"open"},ve[Tt("elementProperties")]=new Map,ve[Tt("finalized")]=new Map,kl?.({ReactiveElement:ve}),(li.reactiveElementVersions??=[]).push("2.1.2");var ar=globalThis,hn=t=>t,ci=ar.trustedTypes,pn=ci?ci.createPolicy("lit-html",{createHTML:t=>t}):void 0,lr="$lit$",ye=`lit$${Math.random().toFixed(9).slice(2)}$`,cr="?"+ye,Sl=`<${cr}>`,ze=document,At=()=>ze.createComment(""),Rt=t=>t===null||typeof t!="object"&&typeof t!="function",dr=Array.isArray,vn=t=>dr(t)||typeof t?.[Symbol.iterator]=="function",or=`[ 	
\f\r]`,Pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fn=/-->/g,mn=/>/g,Fe=RegExp(`>|${or}(?:([^\\s"'>=/]+)(${or}*=${or}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gn=/'/g,bn=/"/g,yn=/^(?:script|style|textarea|title)$/i,ur=t=>(i,...e)=>({_$litType$:t,strings:i,values:e}),c=ur(1),J=ur(2),lh=ur(3),Be=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),_n=new WeakMap,Ne=ze.createTreeWalker(ze,129);function xn(t,i){if(!dr(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return pn!==void 0?pn.createHTML(i):i}var wn=(t,i)=>{let e=t.length-1,r=[],s,n=i===2?"<svg>":i===3?"<math>":"",o=Pt;for(let a=0;a<e;a++){let l=t[a],p,u,d=-1,f=0;for(;f<l.length&&(o.lastIndex=f,u=o.exec(l),u!==null);)f=o.lastIndex,o===Pt?u[1]==="!--"?o=fn:u[1]!==void 0?o=mn:u[2]!==void 0?(yn.test(u[2])&&(s=RegExp("</"+u[2],"g")),o=Fe):u[3]!==void 0&&(o=Fe):o===Fe?u[0]===">"?(o=s??Pt,d=-1):u[1]===void 0?d=-2:(d=o.lastIndex-u[2].length,p=u[1],o=u[3]===void 0?Fe:u[3]==='"'?bn:gn):o===bn||o===gn?o=Fe:o===fn||o===mn?o=Pt:(o=Fe,s=void 0);let m=o===Fe&&t[a+1].startsWith("/>")?" ":"";n+=o===Pt?l+Sl:d>=0?(r.push(p),l.slice(0,d)+lr+l.slice(d)+ye+m):l+ye+(d===-2?a:m)}return[xn(t,n+(t[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),r]},Lt=class t{constructor({strings:i,_$litType$:e},r){let s;this.parts=[];let n=0,o=0,a=i.length-1,l=this.parts,[p,u]=wn(i,e);if(this.el=t.createElement(p,r),Ne.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=Ne.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(lr)){let f=u[o++],m=s.getAttribute(d).split(ye),g=/([.?@])?(.*)/.exec(f);l.push({type:1,index:n,name:g[2],strings:m,ctor:g[1]==="."?ui:g[1]==="?"?hi:g[1]==="@"?pi:je}),s.removeAttribute(d)}else d.startsWith(ye)&&(l.push({type:6,index:n}),s.removeAttribute(d));if(yn.test(s.tagName)){let d=s.textContent.split(ye),f=d.length-1;if(f>0){s.textContent=ci?ci.emptyScript:"";for(let m=0;m<f;m++)s.append(d[m],At()),Ne.nextNode(),l.push({type:2,index:++n});s.append(d[f],At())}}}else if(s.nodeType===8)if(s.data===cr)l.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf(ye,d+1))!==-1;)l.push({type:7,index:n}),d+=ye.length-1}n++}}static createElement(i,e){let r=ze.createElement("template");return r.innerHTML=i,r}};function Ue(t,i,e=t,r){if(i===Be)return i;let s=r!==void 0?e._$Co?.[r]:e._$Cl,n=Rt(i)?void 0:i._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(t),s._$AT(t,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(i=Ue(t,s._$AS(t,i.values),s,r)),i}var di=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:r}=this._$AD,s=(i?.creationScope??ze).importNode(e,!0);Ne.currentNode=s;let n=Ne.nextNode(),o=0,a=0,l=r[0];for(;l!==void 0;){if(o===l.index){let p;l.type===2?p=new at(n,n.nextSibling,this,i):l.type===1?p=new l.ctor(n,l.name,l.strings,this,i):l.type===6&&(p=new fi(n,this,i)),this._$AV.push(p),l=r[++a]}o!==l?.index&&(n=Ne.nextNode(),o++)}return Ne.currentNode=ze,s}p(i){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(i,r,e),e+=r.strings.length-2):r._$AI(i[e])),e++}},at=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,r,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=Ue(this,i,e),Rt(i)?i===h||i==null||i===""?(this._$AH!==h&&this._$AR(),this._$AH=h):i!==this._$AH&&i!==Be&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):vn(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==h&&Rt(this._$AH)?this._$AA.nextSibling.data=i:this.T(ze.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:r}=i,s=typeof r=="number"?this._$AC(i):(r.el===void 0&&(r.el=Lt.createElement(xn(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new di(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(i){let e=_n.get(i.strings);return e===void 0&&_n.set(i.strings,e=new Lt(i)),e}k(i){dr(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let n of i)s===e.length?e.push(r=new t(this.O(At()),this.O(At()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let r=hn(i).nextSibling;hn(i).remove(),i=r}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},je=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,r,s,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=i,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=h}_$AI(i,e=this,r,s){let n=this.strings,o=!1;if(n===void 0)i=Ue(this,i,e,0),o=!Rt(i)||i!==this._$AH&&i!==Be,o&&(this._$AH=i);else{let a=i,l,p;for(i=n[0],l=0;l<n.length-1;l++)p=Ue(this,a[r+l],e,l),p===Be&&(p=this._$AH[l]),o||=!Rt(p)||p!==this._$AH[l],p===h?i=h:i!==h&&(i+=(p??"")+n[l+1]),this._$AH[l]=p}o&&!s&&this.j(i)}j(i){i===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},ui=class extends je{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===h?void 0:i}},hi=class extends je{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==h)}},pi=class extends je{constructor(i,e,r,s,n){super(i,e,r,s,n),this.type=5}_$AI(i,e=this){if((i=Ue(this,i,e,0)??h)===Be)return;let r=this._$AH,s=i===h&&r!==h||i.capture!==r.capture||i.once!==r.once||i.passive!==r.passive,n=i!==h&&(r===h||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},fi=class{constructor(i,e,r){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(i){Ue(this,i)}},Cn={M:lr,P:ye,A:cr,C:1,L:wn,R:di,D:vn,V:Ue,I:at,H:je,N:hi,U:pi,B:ui,F:fi},$l=ar.litHtmlPolyfillSupport;$l?.(Lt,at),(ar.litHtmlVersions??=[]).push("3.3.3");var kn=(t,i,e)=>{let r=e?.renderBefore??i,s=r._$litPart$;if(s===void 0){let n=e?.renderBefore??null;r._$litPart$=s=new at(i.insertBefore(At(),n),n,void 0,e??{})}return s._$AI(t),s};var hr=globalThis,b=class extends ve{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=kn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Be}};b._$litElement$=!0,b.finalized=!0,hr.litElementHydrateSupport?.({LitElement:b});var El=hr.litElementPolyfillSupport;El?.({LitElement:b});(hr.litElementVersions??=[]).push("4.2.2");var Tl={feeding:{domain:"binary_sensor",translationKeys:["feeding"],idSuffixes:["_feeding"]},eating:{domain:"binary_sensor",translationKeys:["eating"],idSuffixes:["_eating"]},bowlFill:{domain:"sensor",translationKeys:["bowl_fill","bowl_fill_1"],idSuffixes:["_bowl_fill","_bowl_fill_1","_bowl_fill_hopper_1"]},hopperLevel1:{domain:"sensor",translationKeys:["hopper_1_level"],idSuffixes:["_hopper_1_level"]},hopperLevel2:{domain:"sensor",translationKeys:["hopper_2_level"],idSuffixes:["_hopper_2_level"]},desiccantDays:{domain:"sensor",translationKeys:["desiccant_days","desiccant_left"],idSuffixes:["_desiccant_days","_desiccant_left"]},schedule:{domain:"sensor",translationKeys:["schedule"],idSuffixes:["_schedule"]},scheduleCardState:{domain:"sensor",translationKeys:["schedule_card_state"],idSuffixes:["_schedule_card_state"]},feedButton:{domain:"button",translationKeys:["feed"],idSuffixes:["_feed"]},feedButtonHopper1:{domain:"button",translationKeys:["feed_hopper_1"],idSuffixes:["_feed_hopper_1"]},feedButtonHopper2:{domain:"button",translationKeys:["feed_hopper_2"],idSuffixes:["_feed_hopper_2"]},cancelFeedButton:{domain:"button",translationKeys:["cancel_feed"],idSuffixes:["_cancel_feed"]},feedAmount:{domain:"number",translationKeys:["feed_amount"],idSuffixes:["_feed_amount"]},feedAmountHopper1:{domain:"number",translationKeys:["feed_amount_hopper_1"],idSuffixes:["_feed_amount_hopper_1"]},feedAmountHopper2:{domain:"number",translationKeys:["feed_amount_hopper_2"],idSuffixes:["_feed_amount_hopper_2"]},cloudSwitch:{domain:"switch",translationKeys:["cloud","petkit_cloud"],idSuffixes:["_cloud","_petkit_cloud"]},stackSelect:{domain:"select",translationKeys:["stack"],idSuffixes:["_stack"]},cloudConnection:{domain:"sensor",translationKeys:["cloud_connection"],idSuffixes:["_cloud_connection"]},nightVisionSwitch:{domain:"switch",translationKeys:["night","night_vision"],idSuffixes:["_night","_night_vision"]},statusLedSwitch:{domain:"switch",translationKeys:["light","status_led"],idSuffixes:["_light","_status_led"]},microphoneSwitch:{domain:"switch",translationKeys:["microphone"],idSuffixes:["_microphone"]},lastSeenPet:{domain:"sensor",translationKeys:["last_seen_pet"],idSuffixes:["_last_seen_pet"]},dishBefore:{domain:"image",translationKeys:["dish_before"],idSuffixes:["_dish_before"]},dishAfter:{domain:"image",translationKeys:["dish_after"],idSuffixes:["_dish_after"]},wifiNetwork:{domain:"sensor",translationKeys:["wifi_network","wifi","rssi"],idSuffixes:["_wifi_network","_wifi","_rssi"]},lastDetection:{domain:"sensor",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionsToday:{domain:"sensor",translationKeys:["detections_today"],idSuffixes:["_detections_today"]},lastDetectionImage:{domain:"image",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionOverlaySwitch:{domain:"switch",translationKeys:["detection_overlay"],idSuffixes:["_detection_overlay"]},pendingFace:{domain:"image",translationKeys:["pending_face"],idSuffixes:["_pending_face"]}};function mi(t){return t.slice(0,t.indexOf("."))}function pr(t){return t.slice(t.indexOf(".")+1)}function Pl(t,i){if(mi(t.entity_id)!==i.domain)return!1;if(t.translation_key&&i.translationKeys.includes(t.translation_key))return!0;let e=pr(t.entity_id);return i.idSuffixes.some(r=>e.endsWith(r))}function Al(t){let i=t.name??t.original_name;if(i)return i.replace(/\s+present$/i,"").trim()||i;let s=pr(t.entity_id).replace(/_present$/,"").split("_").filter(Boolean).pop();return s?s[0].toUpperCase()+s.slice(1):"Cat"}function Rl(t){return mi(t.entity_id)!=="binary_sensor"?!1:t.translation_key==="present"||t.translation_key?.endsWith("_present")?!0:pr(t.entity_id).endsWith("_present")}function lt(t,i){let e={deviceId:i,catPresence:[]},r=Object.values(t).filter(s=>s.device_id===i&&!s.disabled_by);for(let s of r){if(mi(s.entity_id)==="camera"&&!e.camera){e.camera=s.entity_id;continue}if(mi(s.entity_id)==="media_player"&&!e.speaker){e.speaker=s.entity_id;continue}if(Rl(s)){e.catPresence.push({entityId:s.entity_id,name:Al(s)});continue}for(let n of Object.entries(Tl)){let[o,a]=n;if(!e[o]&&Pl(s,a)){e[o]=s.entity_id;break}}}return e.catPresence.sort((s,n)=>s.name.localeCompare(n.name)),e}function ct(t,i){if(i)return t[i]?.config_entries?.[0]}function Sn(t,i){let e=r=>r===void 0||r==="unavailable"||r==="unknown";return t.length===0||t.every(e)?"unreachable":i==="on"?"dispensing":"idle"}function fr(t,i){return t==="unreachable"?"Feeder unreachable \u2014 check that kibbled is running":t==="dispensing"?"Dispensing\u2026":i?`Fed ${i}`:"Ready to feed"}function Ll(t,i){let e=Math.floor(Math.max(0,i.getTime()-t.getTime())/6e4);if(e<1)return{unit:"now",value:0};if(e<60)return{unit:"minutes",value:e};let r=Math.floor(e/60);return r<24?{unit:"hours",value:r}:{unit:"days",value:Math.floor(r/24)}}function Pe(t,i){let e=Ll(t,i);if(e.unit==="now")return"just now";let r=e.unit==="minutes"?"min":e.unit==="hours"?"h":"d";return`${e.value} ${r} ago`}var Ml={data:null,error:null,loading:!1},q=class{constructor(i){this._lastWatched=null;this._requestId=0;this._state=Ml;this._onChange=i}get state(){return this._state}sync(i,e){i!==this._lastWatched&&(this._lastWatched=i,this.refresh(e))}refresh(i){let e=++this._requestId;this._state={...this._state,loading:!0,error:null},this._onChange(),i().then(r=>{e===this._requestId&&(this._state={data:r,error:null,loading:!1},this._onChange())},r=>{e===this._requestId&&(this._state={...this._state,error:te(r),loading:!1},this._onChange())})}};function Ve(t,i){return i.filter(e=>!!e).map(e=>`${e}=${t.states[e]?.state??""}`).join("|")}function te(t){if(t instanceof Error)return t.message;if(t&&typeof t=="object"&&"message"in t){let i=t.message;if(typeof i=="string"&&i)return i}return"Something went wrong."}var Ol={cog:"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",cloudCheck:"M13 19C13 19.34 13.04 19.67 13.09 20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.32 7.4 19 9.05 19 11C20.15 11.13 21.1 11.63 21.86 12.5C22.37 13.07 22.7 13.71 22.86 14.42C21.82 13.54 20.5 13 19 13C18.89 13 18.79 13 18.68 13C18.62 13 18.56 13 18.5 13H17V11C17 9.62 16.5 8.44 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18H13.09C13.04 18.33 13 18.66 13 19M17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84L17.75 19.43Z",cloudLock:"M6.5 18H13V20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.08 7.16 18.73 8.5 18.93 10C18.23 10 17.56 10.19 16.95 10.46C16.84 9.31 16.38 8.31 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18M23 17.3V20.8C23 21.4 22.4 22 21.7 22H16.2C15.6 22 15 21.4 15 20.7V17.2C15 16.6 15.6 16 16.2 16V14.5C16.2 13.1 17.6 12 19 12S21.8 13.1 21.8 14.5V16C22.4 16 23 16.6 23 17.3M20.5 14.5C20.5 13.7 19.8 13.2 19 13.2S17.5 13.7 17.5 14.5V16H20.5V14.5Z",cloudAlert:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M11 7H13V13H11V7Z",cloudQuestion:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M14.43 8.68C14.97 9.13 15.24 9.75 15.24 10.5C15.24 11 15.09 11.41 14.8 11.82C14.5 12.21 14.13 12.5 13.67 12.75C13.41 12.91 13.24 13.07 13.15 13.26C13.06 13.45 13 13.69 13 14H11C11 13.45 11.11 13.08 11.3 12.82C11.5 12.56 11.85 12.25 12.37 11.91C12.63 11.75 12.84 11.56 13 11.32C13.15 11.09 13.23 10.81 13.23 10.5C13.23 10.18 13.14 9.94 12.96 9.76C12.78 9.56 12.5 9.47 12.2 9.47C11.93 9.47 11.71 9.55 11.5 9.7C11.35 9.85 11.25 10.08 11.25 10.39H9.28C9.23 9.64 9.5 9 10.06 8.59C10.6 8.2 11.31 8 12.2 8C13.14 8 13.89 8.23 14.43 8.68Z",airFilter:"M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",wifi:"M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",fullscreen:"M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z",fullscreenExit:"M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z",weatherNight:"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",ledOn:"M11,0V4H13V0H11M18.3,2.29L15.24,5.29L16.64,6.71L19.7,3.71L18.3,2.29M5.71,2.29L4.29,3.71L7.29,6.71L8.71,5.29L5.71,2.29M12,6A4,4 0 0,0 8,10V16H6V18H9V23H11V18H13V23H15V18H18V16H16V10A4,4 0 0,0 12,6M2,9V11H6V9H2M18,9V11H22V9H18Z",microphone:"M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z",microphoneOff:"M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z",volumeOff:"M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z",volumeHigh:"M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",openInNew:"M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",speaker:"M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",refresh:"M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"};function H(t){return J`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d=${Ol[t]}></path></svg>`}var En="#F4A452",Tn="#DE8A3A",Pn="#3A2C28",An="#E5484D",$n=["#3FA7A0","#9A5B9E","#7FA05A","#4F86C6"];function gi(t){let i=$n.length;return $n[(t%i+i)%i]}function Rn(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0}function mr(t){return t==="empty"||t==="low"||t==="ok"?t:null}var Ln={empty:"empty",low:"running low"};function Mn(t,i){if(t===null&&i===null)return null;let e=[[1,t],[2,i]].filter(s=>s[1]!==null&&s[1]!=="ok");if(e.length===0)return{text:"Hopper stocked",tone:"ok"};let r=e.some(([,s])=>s==="empty")?"empty":"low";return e.length===2&&e[0][1]===e[1][1]?{text:`Hopper ${Ln[e[0][1]]}`,tone:r}:{text:e.map(([s,n])=>`Hopper ${s} ${Ln[n]}`).join(" \xB7 "),tone:r}}var Il={"choose-hopper":{start:"confirm-empty"},"confirm-empty":{"empty-confirmed":"collecting"},collecting:{capture:"collecting","review-full":"mark-full"},"mark-full":{"full-marked":"offer-inherit"},"offer-inherit":{"inherit-resolved":"done"},done:{restart:"choose-hopper"}};function xe(t,i){return Il[t][i]??t}function On(t){return t.some(i=>i.portions>0)}function In(t,i){let e=t[t.length-1];return!e||i.score>=e.score?null:{previousPortions:e.portions,previousScore:e.score,newScore:i.score}}function Mt(t){if(!t)return{kind:"never",inheritedFromDisplay:null,measuredAt:null,note:null,finished:!1};let i=typeof t.source=="object"?t.source.inherited_from:null;return{kind:i!==null?"inherited":"measured",inheritedFromDisplay:i!==null?i+1:null,measuredAt:t.measured_at,note:t.note||null,finished:t.full_portions!=null}}function Dn(t,i){if(!t||t.full_portions==null||t.full_score==null)return null;let e=[...t.points].sort((s,n)=>s.portions-n.portions),r=e[0];if(!r)return null;if(i<=r.score)return 0;if(i>=t.full_score)return 100;for(let s=1;s<e.length;s+=1){let n=e[s-1],o=e[s];if(i>o.score)continue;let a=o.score-n.score,l=a<=0?0:(i-n.score)/a,u=(n.portions+l*(o.portions-n.portions))/t.full_portions*100;return Math.max(0,Math.min(100,u))}return 100}function Hn(t){return t?t.hoppers[0]??t.hoppers[1]??null:null}var _r=240,Fn=176,Ot=120,qe=34,We=10,_i=_r-We*2,Hl=18,gr=158,bi=44,we=qe+8,de=124,Nn=32,Fl=9,Nl=[-.5,-.2,.1,.4,-.35,.25,0];function zl(t,i,e,r){let s=[0,120,240].map(n=>{let o=(n+r)*Math.PI/180;return J`<circle cx=${(t+Math.cos(o)*e*.55).toFixed(1)} cy=${(i+Math.sin(o)*e*.55).toFixed(1)} r=${(e*.62).toFixed(1)} />`});return J`<g>${s}</g>`}function zn(){let t=We,i=We+_i,e=9;return[`M ${t+e} ${qe}`,`H ${i-e}`,`q ${e} 0 ${e} ${e}`,`C ${i} ${qe+70}, ${Ot+bi+30} ${gr-10}, ${Ot+bi} ${gr}`,`H ${Ot-bi}`,`C ${Ot-bi-30} ${gr-10}, ${t} ${qe+70}, ${t} ${qe+e}`,`q 0 ${-e} ${e} ${-e}`,"Z"].join(" ")}function br(t,i){let r=de-we,s=Math.min(18,(i-t)*.16);return[`M ${t} ${we}`,`H ${i}`,`C ${i} ${we+r*.55}, ${i-s+14} ${de}, ${i-s-14} ${de}`,`H ${t+s+14}`,`C ${t+s-14} ${de}, ${t} ${we+r*.55}, ${t} ${we}`,"Z"].join(" ")}var vr=class extends b{constructor(){super();this._wasFeeding=!1;this._dropping=!1;this.fill=null,this.hopperLevel1=null,this.hopperLevel2=null,this.feeding=!1,this.calibration=null}static{this.properties={fill:{type:Number},hopperLevel1:{type:String},hopperLevel2:{type:String},feeding:{type:Boolean},calibration:{attribute:!1}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._dropTimer)}willUpdate(e){e.has("feeding")&&(this.feeding&&!this._wasFeeding&&!Rn()&&(this._dropping=!0,clearTimeout(this._dropTimer),this._dropTimer=setTimeout(()=>{this._dropping=!1,this.requestUpdate()},900)),this._wasFeeding=this.feeding)}render(){let e=this.fill==null?null:Dn(this.calibration,this.fill/100),r=e!=null?`Bowl ${Math.round(e)}% full (raw score ${Math.round(this.fill)})`:this.fill==null?"Bowl level unknown":`Bowl ${Math.round(this.fill)}% full`,s=We+Nn,n=We+_i-Nn,o=this.fill==null?null:this.fill/100,a=Mn(this.hopperLevel1,this.hopperLevel2);return c`
      <svg class="art" viewBox="0 0 ${_r} ${Fn}" role="img" aria-label=${r} preserveAspectRatio="xMidYMid meet">
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
          <clipPath id="silo-win"><path d=${br(s,n)} /></clipPath>
        </defs>
        <path class="body" d=${zn()} />
        <rect class="cap" x=${We-4} y=${qe-4} width=${_i+8} height=${Hl} rx="9" />
        <rect class="cap-highlight" x=${We+6} y=${qe} width=${_i-12} height="4" rx="2" />
        <path class="body-edge" d=${zn()} />
        ${this._renderCavity(s,n,o)}
        ${this._dropping?this._renderFallingKibble():h}
      </svg>
      ${e!=null?c`<div class="calibrated" role="status">${Math.round(e)}% full <span class="raw">\u00b7 raw ${Math.round(this.fill)}</span></div>`:h}
      ${a?c`<div class="hopper" data-tone=${a.tone} role="status">${a.text}</div>`:h}
    `}_renderCavity(e,r,s){let n=r-e,o=e+n/2;if(s==null)return J`
        <g>
          <path class="glass" d=${br(e,r)} />
          <text class="unknown" x=${o} y=${(we+de)/2+2} text-anchor="middle" dominant-baseline="central">?</text>
        </g>
      `;let a=Math.max(0,Math.min(1,s)),l=de-(de-we)*a,p=[];if(a>0){let u=0;for(let d=l+6;d<de;d+=Fl,u+=1){let f=Math.max(1,Math.floor(n/14));for(let m=0;m<f;m+=1){let g=e+7+m*14+(u%2===0?0:7);g<r-6&&p.push(J`<circle cx=${g.toFixed(1)} cy=${d.toFixed(1)} r="2.6" />`)}}}return J`
      <g>
        <path class="glass" d=${br(e,r)} />
        <g clip-path="url(#silo-win)">
          <rect class="glass-inner" x=${e-2} y=${we-8} width=${n+4} height=${de-we+4} filter="url(#silo-inner)" />
          ${a>0?J`
                <rect class="fill" x=${e} y=${l} width=${n} height=${de-l+2} />
                <g class="texture">${p}</g>
                <rect class="fill-surface" x=${e} y=${l} width=${n} height="2" />
              `:h}
        </g>
      </g>
    `}_renderFallingKibble(){let e=Nl.map((r,s)=>{let n=Ot+r*40,l=`--fall-delay:${s*70}ms;--fall-duration:380ms;--fall-rotate:${(r*180).toFixed(0)}deg;--fall-to:34px;`;return J`<g class="drop" style=${l}>${zl(n,4,6,r*60)}</g>`});return J`<g class="drops">${e}</g>`}static{this.styles=y`
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
      aspect-ratio: ${_r} / ${Fn};
      margin: 0 auto;
      overflow: visible;
    }
    /* The calibrated readout: a real, meaningful number now that a curve exists, so unlike the
     * raw score it earns primary-text weight -- the raw figure stays too, just secondary,
     * since every existing threshold elsewhere is still keyed to it, never this one. */
    .calibrated {
      flex: none;
      margin-top: 6px;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .calibrated .raw {
      font-weight: 400;
      color: var(--secondary-text-color);
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
  `}};customElements.define("kibble-bowl",vr);var Bl=[1,2,3,4,5],yr=class extends b{static{this.properties={value:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.disabled=!1}render(){return c`
      <div class="segments" role="radiogroup" aria-label="Feed amount, portions">
        ${Bl.map(i=>c`
            <button
              type="button"
              role="radio"
              aria-checked=${i===this.value}
              class="segment ${i===this.value?"selected":""}"
              ?disabled=${this.disabled}
              @click=${()=>this._select(i)}
            >
              ${i}
            </button>
          `)}
      </div>
    `}_select(i){this.dispatchEvent(new CustomEvent("portion-selected",{detail:{value:i},bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-segmented-picker",yr);var xr=class extends b{static{this.properties={value:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.min=1,this.max=20,this.step=1,this.disabled=!1}render(){return c`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value<=this.min} @click=${this._decrement} aria-label="Fewer portions">
          &minus;
        </button>
        <span class="value">${this.value}</span>
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value>=this.max} @click=${this._increment} aria-label="More portions">
          &plus;
        </button>
      </div>
    `}_decrement(){this._emit(Math.max(this.min,this.value-this.step))}_increment(){this._emit(Math.min(this.max,this.value+this.step))}_emit(i){this.dispatchEvent(new CustomEvent("value-selected",{detail:{value:i},bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-stepper",xr);var wr=class extends b{constructor(){super();this._holding=!1;this._holdTimer=void 0;this._startHold=e=>{this.disabled||(e.preventDefault(),this._holding=!0,this.requestUpdate(),clearTimeout(this._holdTimer),this._holdTimer=setTimeout(()=>{this._holding=!1,this.requestUpdate(),this._activate()},this.holdMs))};this._cancelHold=()=>{clearTimeout(this._holdTimer),this._holding&&(this._holding=!1,this.requestUpdate())};this.label="Hold to feed",this.variant="feed",this.disabled=!1,this.holdMs=600}static{this.properties={label:{type:String},variant:{type:String},disabled:{type:Boolean},holdMs:{type:Number,attribute:"hold-ms"}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._holdTimer)}render(){return c`
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
        ${this.variant==="feed"?c`<span class="fill"></span>`:""}
        <span class="label">${this.label}</span>
      </button>
    `}_tapActivate(){this.disabled||this._activate()}_activate(){this.dispatchEvent(new CustomEvent("activate",{bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-hold-button",wr);var{I:Vh}=Cn;var Bn=t=>t.strings===void 0;var Un={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Cr=t=>(...i)=>({_$litDirective$:t,values:i}),vi=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,e,r){this._$Ct=i,this._$AM=e,this._$Ci=r}_$AS(i,e){return this.update(i,e)}update(i,e){return this.render(...e)}};var It=(t,i)=>{let e=t._$AN;if(e===void 0)return!1;for(let r of e)r._$AO?.(i,!1),It(r,i);return!0},yi=t=>{let i,e;do{if((i=t._$AM)===void 0)break;e=i._$AN,e.delete(t),t=i}while(e?.size===0)},jn=t=>{for(let i;i=t._$AM;t=i){let e=i._$AN;if(e===void 0)i._$AN=e=new Set;else if(e.has(t))break;e.add(t),ql(i)}};function jl(t){this._$AN!==void 0?(yi(this),this._$AM=t,jn(this)):this._$AM=t}function Vl(t,i=!1,e=0){let r=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(i)if(Array.isArray(r))for(let n=e;n<r.length;n++)It(r[n],!1),yi(r[n]);else r!=null&&(It(r,!1),yi(r));else It(this,t)}var ql=t=>{t.type==Un.CHILD&&(t._$AP??=Vl,t._$AQ??=jl)},xi=class extends vi{constructor(){super(...arguments),this._$AN=void 0}_$AT(i,e,r){super._$AT(i,e,r),jn(this),this.isConnected=i._$AU}_$AO(i,e=!0){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),e&&(It(this,i),yi(this))}setValue(i){if(Bn(this._$Ct))this._$Ct._$AI(i,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=i,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var U=()=>new Sr,Sr=class{},kr=new WeakMap,F=Cr(class extends xi{render(t){return h}update(t,[i]){let e=i!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=i,this.ht=t.options?.host,this.rt(this.ct=t.element)),h}rt(t){if(this.G!==void 0)if(this.isConnected||(t=void 0),typeof this.G=="function"){let i=this.ht??globalThis,e=kr.get(i);e===void 0&&(e=new WeakMap,kr.set(i,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return typeof this.G=="function"?kr.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function Vn(t){let i=/^(\d{1,2}):(\d{2})$/.exec(t.trim());if(!i)throw new Error(`Invalid schedule time "${t}"`);let e=Number(i[1]),r=Number(i[2]);if(e>23||r>59)throw new Error(`Invalid schedule time "${t}"`);return e*60+r}function Wl(t,i){let e=i.getHours()*60+i.getMinutes(),r=null;for(let s of t){if(!s.enabled)continue;let o=((Vn(s.time)-e)%1440+1440)%1440;(r===null||o<r.minutesUntil)&&(r={entry:s,minutesUntil:o})}return r}function $r(t,i){let e=Vn(t);return new Date(2e3,0,1,Math.floor(e/60),e%60).toLocaleTimeString(i,{hour:"numeric",minute:"2-digit"})}var Kl=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function qn(t,i,e){if(t.length===0)return"No schedule set";let r=Wl(t,i);if(!r)return"All feeds paused";let s=t.filter(o=>o.enabled).length,n=Kl[s]??String(s);return`Next feed ${$r(r.entry.time,e)}, ${n} a day`}var Er="dispenser-schedule-card",Tr=class extends b{constructor(){super();this._expanded=!1;this._embedRef=U();this._configureEmbed=e=>{if(!e||!this.scheduleCardStateEntity)return;let r=e.querySelector(Er);if(r){r.hass=this.hass;return}let s=document.createElement(Er);s.setConfig({type:"custom:dispenser-schedule-card",device:{type:"custom",entity:this.scheduleCardStateEntity,max_entries:24,min_amount:1,max_amount:20,step_amount:1,status_map:["0 -> dispensed","1 -> failed","2 -> pending","3 -> dispensing"],status_pattern:"(?<id>[^,]+),(?<hour>[0-9]{1,2}),(?<minute>[0-9]{1,2}),(?<amount>[0-9]{1,2}),(?<status>[0-9]);?",actions:{add:"kibble.schedule_card_add",edit:"kibble.schedule_card_edit",remove:"kibble.schedule_card_remove",toggle:"kibble.schedule_card_toggle"}},unit_of_measurement:{one:"portion",other:"portions"}}),s.hass=this.hass,e.appendChild(s)};this.entries=[],this.deviceName="Kibble"}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},scheduleCardStateEntity:{type:String},deviceName:{type:String}}}updated(){this._embedRef.value&&this.hass&&(this._embedRef.value.hass=this.hass)}render(){let e=new Date,r=qn(this.entries,e);return c`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${r}</span>
        <span class="chevron ${this._expanded?"open":""}">${H("chevronDown")}</span>
      </button>
      ${this._expanded?c`<div class="expanded">${this._renderExpanded()}</div>`:h}
    `}_renderExpanded(){if(this._canEmbed())return c`<div ${F(this._configureEmbed)}></div>`;if(this.entries.length===0)return c`<p class="empty">No schedule set</p>`;let e=[...this.entries].sort((r,s)=>r.time.localeCompare(s.time));return c`
      <ul class="entries">
        ${e.map(r=>c`
            <li class=${r.enabled?"":"disabled"}>
              <span class="time">${$r(r.time)}</span>
              <span class="amounts">${r.amount_l}g + ${r.amount_r}g</span>
              <span class="state">${r.enabled?"On":"Paused"}</span>
            </li>
          `)}
      </ul>
    `}_canEmbed(){if(!customElements.get(Er)||!this.scheduleCardStateEntity)return!1;let e=this.hass?.states[this.scheduleCardStateEntity];return e!==void 0&&e.state!=="unavailable"}_toggle(){this._expanded=!this._expanded,this.requestUpdate()}static{this.styles=y`
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
  `}};customElements.define("kibble-schedule-summary",Tr);var Yl="calibration_busy";function Pr(t){return`${t} portion${t===1?"":"s"}`}function wi(t){return String(Math.round(t*100))}var Ar=class extends b{constructor(){super();this._closeButtonRef=U();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&this._close()};this._loadCalibration=()=>{let e=this.hass?.callWS,r=this.entryId;if(!e||!r){this._loadError="Not connected.";return}this._loading=!0,this._loadError=null,e({type:"kibble/calibration",entry_id:r}).then(s=>{this._calibration=s,this._loading=!1},s=>{this._loadError=te(s),this._loading=!1})};this._confirmEmpty=()=>{if(this._hopper===null)return;let e=this._hopper,r=this._note.trim();this._runAction({action:"begin",hopper:e,...r?{note:r}:{}},this._confirmEmpty,()=>{this._runAction({action:"point",hopper:e,portions:0},this._confirmEmpty,s=>{this._calibration=s,this._regression=null,this._step=xe(this._step,"empty-confirmed")})})};this._capturePoint=()=>{if(this._hopper===null)return;let e=this._hopper,r=this._hopperData(e)?.points??[],s=(r[r.length-1]?.portions??0)+1;this._runAction({action:"point",hopper:e,portions:s},this._capturePoint,n=>{let o=n.hoppers[e]?.points.find(a=>a.portions===s);this._regression=o?In(r,o):null,this._calibration=n,this._step=xe(this._step,"capture")})};this._confirmMarkFull=()=>{if(this._hopper===null||this._markFullPortions===null)return;let e=this._hopper,r=this._markFullPortions;this._runAction({action:"full",hopper:e,portions:r},this._confirmMarkFull,s=>{this._calibration=s,this._step=xe(this._step,"full-marked")})};this._acceptInherit=()=>{if(this._hopper===null)return;let e=this._hopper,r=e===0?1:0;this._runAction({action:"inherit",hopper:r,from:e},this._acceptInherit,s=>{this._calibration=s,this._inheritedTo=r,this._step=xe(this._step,"inherit-resolved")})};this._runClear=()=>{if(this._hopper===null)return;let e=this._hopper;this._runAction({action:"clear",hopper:e},this._runClear,r=>{this._calibration=r})};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.entryId=void 0,this._resetWizard()}static{this.properties={hass:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0},_step:{state:!0},_hopper:{state:!0},_calibration:{state:!0},_loading:{state:!0},_loadError:{state:!0},_note:{state:!0},_busy:{state:!0},_error:{state:!0},_waitingForBowl:{state:!0},_regression:{state:!0},_markFullPortions:{state:!0},_clearConfirmArmed:{state:!0},_inheritedTo:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),clearTimeout(this._clearConfirmTimer)}updated(e){e.has("open")&&this.open&&(this._resetWizard(),this._closeButtonRef.value?.focus(),this._loadCalibration())}_resetWizard(){this._step="choose-hopper",this._hopper=null,this._calibration=null,this._loading=!1,this._loadError=null,this._note="",this._busy=!1,this._error=null,this._waitingForBowl=!1,this._regression=null,this._markFullPortions=null,this._clearConfirmArmed=!1,this._inheritedTo=null}_hopperData(e){return e===null||!this._calibration?null:this._calibration.hoppers[e]}_runAction(e,r,s){let n=this.hass?.callWS,o=this.entryId;!n||!o||(this._busy=!0,this._error=null,this._waitingForBowl=!1,n({type:"kibble/calibration/action",entry_id:o,...e}).then(a=>{this._busy=!1,s(a),this.dispatchEvent(new CustomEvent("calibration-changed",{bubbles:!0,composed:!0}))},a=>{if(this._busy=!1,a?.code===Yl){this._waitingForBowl=!0;return}this._error={message:te(a),retry:r}}))}_selectHopper(e){this._hopper=e,this._error=null}_beginRequested(){this._note="",this._step=xe(this._step,"start")}_reviewFull(){this._markFullPortions=null,this._step=xe(this._step,"review-full")}_declineInherit(){this._inheritedTo=null,this._step=xe(this._step,"inherit-resolved")}_clearRequested(){if(this._clearConfirmArmed){clearTimeout(this._clearConfirmTimer),this._clearConfirmArmed=!1,this._runClear();return}this._clearConfirmArmed=!0,this._clearConfirmTimer=setTimeout(()=>{this._clearConfirmArmed=!1},3e3)}_restart(){let e=this._hopper===0?1:this._hopper===1?0:null;this._step=xe(this._step,"restart"),this._hopper=e,this._note="",this._markFullPortions=null,this._regression=null,this._inheritedTo=null,this._clearConfirmArmed=!1}render(){return this.open?c`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Calibrate bowl">
        <div class="sheet" @click=${e=>e.stopPropagation()}>
          <header>
            <span>Calibrate bowl</span>
            <button type="button" class="icon-button" ${F(this._closeButtonRef)} @click=${this._close} aria-label="Close">${H("close")}</button>
          </header>
          <div class="body">
            ${!this.hass?.callWS||!this.entryId?c`<p class="hint">Calibration isn't available right now.</p>`:this._renderStep()}
          </div>
        </div>
      </div>
    `:h}_renderStep(){switch(this._step){case"choose-hopper":return this._renderChooseHopper();case"confirm-empty":return this._renderConfirmEmpty();case"collecting":return this._renderCollecting();case"mark-full":return this._renderMarkFull();case"offer-inherit":return this._renderOfferInherit();case"done":return this._renderDone()}}_renderChooseHopper(){return this._loading?c`<p class="hint">Loading calibration\u2026</p>`:this._loadError?c`
        <div class="error">
          <span>Couldn't load calibration. ${this._loadError}</span>
          <button type="button" @click=${this._loadCalibration}>Try again</button>
        </div>
      `:c`
      <p class="hint">Pick a hopper. Each side keeps its own curve, since the two hoppers can hold different food.</p>
      <div class="hopper-rows">${[0,1].map(e=>this._renderHopperRow(e))}</div>
      ${this._hopper!==null?this._renderHopperActions(this._hopper):h}
    `}_renderHopperRow(e){let r=Mt(this._hopperData(e));return c`
      <button type="button" class="hopper-row ${this._hopper===e?"selected":""}" @click=${()=>this._selectHopper(e)}>
        <span class="hopper-row-label">Hopper ${e+1}</span>
        <span class="hopper-row-status">${this._statusLine(r)}</span>
        ${r.note?c`<span class="hopper-row-note">${r.note}</span>`:h}
      </button>
    `}_statusLine(e){if(e.kind==="never")return"Never calibrated";let r=e.measuredAt?Pe(new Date(e.measuredAt*1e3),new Date):null,s=e.finished?"":" (unfinished)";return e.kind==="inherited"?`Inherited from Hopper ${e.inheritedFromDisplay}${r?` \xB7 ${r}`:""}${s}`:`Measured${r?` ${r}`:""}${s}`}_renderHopperActions(e){let r=Mt(this._hopperData(e)),s=e+1;return r.kind==="never"?c`<button type="button" class="primary" @click=${()=>this._beginRequested()}>Calibrate Hopper ${s}</button>`:c`
      <div class="hopper-actions">
        <button type="button" class="danger ${this._clearConfirmArmed?"confirming":""}" ?disabled=${this._busy} @click=${()=>this._clearRequested()}>
          ${this._clearConfirmArmed?"Tap again to clear":"Clear calibration"}
        </button>
        <button type="button" class="primary" @click=${()=>this._beginRequested()}>Recalibrate Hopper ${s}</button>
      </div>
      ${this._renderError()}
    `}_renderConfirmEmpty(){let e=this._hopper;if(e===null)return h;let r=e+1,s=Mt(this._hopperData(e)).kind!=="never";return c`
      <p class="hint">Make sure Hopper ${r}'s side of the bowl is completely empty, then start.</p>
      ${s?c`<div class="warning">Starting discards Hopper ${r}'s existing calibration.</div>`:h}
      <label class="field">
        <span>What food is this? (optional)</span>
        <input
          type="text"
          .value=${this._note}
          placeholder="e.g. freeze-dried on this side"
          @input=${n=>{this._note=n.target.value}}
        />
      </label>
      ${this._waitingForBowl?this._renderWaitingForBowl():h}
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._confirmEmpty}>${this._busy?"Starting\u2026":"Bowl is empty \u2014 start"}</button>
      </div>
    `}_renderCollecting(){let e=this._hopper;if(e===null)return h;let r=this._hopperData(e)?.points??[];return c`
      <p class="hint">Dispense one portion into Hopper ${e+1}'s side yourself, then capture the reading.</p>
      ${this._renderCurve(r)}
      ${this._regression?c`<div class="warning">
            This step's score (${wi(this._regression.newScore)}) is lower than the previous step's (${wi(this._regression.previousScore)}) \u2014 a
            curve that dips can't be interpolated. Recapture this step before continuing.
          </div>`:h}
      ${this._waitingForBowl?this._renderWaitingForBowl():h}
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy||!On(r)} @click=${()=>this._reviewFull()}>This is full</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._capturePoint}>${this._busy?"Capturing\u2026":"Capture reading"}</button>
      </div>
    `}_renderCurve(e){return e.length===0?h:c`
      <ul class="curve">
        ${e.map((r,s)=>{let n=s>0?e[s-1]:null,o=n!==null&&r.score<n.score;return c`
            <li class="curve-row ${o?"dropped":""}">
              <span>${Pr(r.portions)}</span>
              <span class="score">${wi(r.score)}</span>
            </li>
          `})}
      </ul>
    `}_renderMarkFull(){let e=this._hopper;if(e===null)return h;let r=(this._hopperData(e)?.points??[]).filter(s=>s.portions>0);return c`
      <p class="hint">Which step looked full?</p>
      <ul class="curve selectable">
        ${r.map(s=>c`
            <li>
              <button type="button" class="curve-choice ${this._markFullPortions===s.portions?"selected":""}" @click=${()=>this._markFullPortions=s.portions}>
                <span>${Pr(s.portions)}</span>
                <span class="score">${wi(s.score)}</span>
              </button>
            </li>
          `)}
      </ul>
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy||this._markFullPortions===null} @click=${this._confirmMarkFull}>
          ${this._busy?"Saving\u2026":this._markFullPortions===null?"Mark full":`Mark full at ${Pr(this._markFullPortions)}`}
        </button>
      </div>
    `}_renderOfferInherit(){let e=this._hopper;if(e===null)return h;let r=e===0?1:0,s=Mt(this._hopperData(r)).kind!=="never";return c`
      <p class="hint">Hopper ${e+1} is calibrated.</p>
      <p class="hint">
        Copy this curve to Hopper ${r+1}? Only do this if it's the same food in both hoppers \u2014 this is a shortcut for
        "same food," not a second measurement.${s?c` This replaces Hopper ${r+1}'s existing calibration.`:h}
      </p>
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy} @click=${()=>this._declineInherit()}>Not now</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._acceptInherit}>${this._busy?"Copying\u2026":`Copy to Hopper ${r+1}`}</button>
      </div>
    `}_renderDone(){let e=this._hopper;return e===null?h:c`
      <p class="hint">Hopper ${e+1} is calibrated.${this._inheritedTo!==null?c` Copied to Hopper ${this._inheritedTo+1} too.`:h}</p>
      <div class="actions">
        <button type="button" @click=${()=>this._restart()}>Calibrate the other hopper</button>
        <button type="button" class="primary" @click=${this._close}>Done</button>
      </div>
    `}_renderWaitingForBowl(){let e=this._step==="collecting"?this._capturePoint:this._confirmEmpty;return c`
      <div class="warning">
        <span>No clear bowl reading right now \u2014 something may be in the way, or the feeder hasn't reported one yet. Try again in a moment.</span>
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
    `:h}static{this.styles=y`
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
  `}};customElements.define("kibble-calibration-dialog",Ar);function Rr(t){return Number.isNaN(t)?50:Math.min(100,Math.max(0,t))}function Wn(t,i){switch(i){case"ArrowLeft":case"ArrowDown":return Rr(t-5);case"ArrowRight":case"ArrowUp":return Rr(t+5);case"Home":return 0;case"End":return 100;default:return null}}function Kn(t,i){return i.width<=0?50:Rr((t-i.left)/i.width*100)}function Yn(t,i){let e=t||null,r=i||null;return{before:e,after:r,hasPair:e!==null&&r!==null}}var Lr=class extends b{constructor(){super();this._frameRef=U();this._beginDrag=e=>{e.preventDefault(),e.currentTarget.setPointerCapture(e.pointerId),this._updateFromPointer(e.clientX)};this._onDrag=e=>{e.buttons!==0&&(e.preventDefault(),this._updateFromPointer(e.clientX))};this._endDrag=e=>{let r=e.currentTarget;r.hasPointerCapture(e.pointerId)&&r.releasePointerCapture(e.pointerId)};this._onHandleKeydown=e=>{let r=Wn(this._wipePosition,e.key);r!==null&&(e.preventDefault(),this._wipePosition=r)};this.beforeSrc=null,this.afterSrc=null,this.beforeLabel="Before",this.afterLabel="After",this.caption=null,this.aspect=16/9,this._mode="split",this._wipePosition=50}static{this.properties={beforeSrc:{type:String},afterSrc:{type:String},beforeLabel:{type:String},afterLabel:{type:String},caption:{type:String},aspect:{type:Number},_mode:{state:!0},_wipePosition:{state:!0}}}render(){let e=Yn(this.beforeSrc,this.afterSrc);if(!e.before&&!e.after)return h;if(!e.hasPair){let r=e.before??e.after,s=e.before?this.beforeLabel:this.afterLabel;return c`
        <figure class="tile">
          <div class="frame" style="aspect-ratio: ${this.aspect};">
            <img src=${r} alt=${s} loading="lazy" />
            <span class="tag tag-solo">${s}</span>
          </div>
          ${this.caption?c`<figcaption>${this.caption}</figcaption>`:h}
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
        ${this.caption?c`<figcaption>${this.caption}</figcaption>`:h}
      </figure>
    `}_renderSplit(e,r){return c`
      <div class="split">
        <div class="half">
          <img src=${e} alt=${this.beforeLabel} loading="lazy" />
          <span class="tag">${this.beforeLabel}</span>
        </div>
        <div class="divider"></div>
        <div class="half">
          <img src=${r} alt=${this.afterLabel} loading="lazy" />
          <span class="tag">${this.afterLabel}</span>
        </div>
      </div>
    `}_renderWipe(e,r){let s=this._wipePosition;return c`
      <div
        class="wipe"
        ${F(this._frameRef)}
        @pointerdown=${this._beginDrag}
        @pointermove=${this._onDrag}
        @pointerup=${this._endDrag}
        @pointercancel=${this._endDrag}
      >
        <img class="layer" src=${r} alt=${this.afterLabel} loading="lazy" />
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
    `}_setMode(e){this._mode=e}_updateFromPointer(e){let r=this._frameRef.value?.getBoundingClientRect();r&&(this._wipePosition=Kn(e,r))}static{this.styles=y`
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
  `}};customElements.define("kibble-before-after",Lr);var Qn=3e3;function Mr(t,i){if(!i)return null;let e=t.states[i];if(!e)return null;let r=Number(e.state);return Number.isNaN(r)?null:{value:r,min:Number(e.attributes.min??1),max:Number(e.attributes.max??20),step:Number(e.attributes.step??1)}}var Or=class extends b{constructor(){super();this._cloudConfirmArmed=!1;this._cloudConfirmTimer=void 0;this._stackConfirmArmed=!1;this._stackConfirmTimer=void 0;this.open=!1,this._calibrationOpen=!1}static{this.properties={hass:{attribute:!1},entities:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0},_calibrationOpen:{state:!0}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._cloudConfirmTimer),clearTimeout(this._stackConfirmTimer)}render(){if(!this.open)return h;let e=this.entities;return c`
      <div class="backdrop" @click=${this._close}></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Kibble settings" @keydown=${this._onKeydown}>
        <header>
          <h2>Settings</h2>
          <button type="button" class="icon-button" @click=${this._close} aria-label="Close">${H("close")}</button>
        </header>
        <div class="body">
          ${e.feedButtonHopper1||e.feedButtonHopper2?this._renderHopperSection():h}
          ${e.bowlFill?this._renderCalibrationSection():h}
          ${e.feedAmount?this._renderMoreAmountSection():h}
          ${this._renderToggles()}
          ${e.cloudSwitch?this._renderCloud():h}
          ${e.stackSelect?this._renderStack():h}
          ${e.wifiNetwork?this._renderWifi():h}
          ${e.dishBefore||e.dishAfter?this._renderDishPhotos():h}
          ${e.speaker?this._renderSpeaker():h}
          <button type="button" class="device-link" @click=${this._openDevicePage}>
            Open device page ${H("openInNew")}
          </button>
        </div>
      </div>
      <kibble-calibration-dialog
        .hass=${this.hass}
        .entryId=${this.entryId}
        ?open=${this._calibrationOpen}
        @close-requested=${this._closeCalibration}
      ></kibble-calibration-dialog>
    `}_renderMoreAmountSection(){let e=Mr(this.hass,this.entities.feedAmount);return e?c`
      <section>
        <h3>Feed amount</h3>
        ${this._renderStepper(this.entities.feedAmount,e)}
      </section>
    `:h}_renderHopperSection(){let{feedAmountHopper1:e,feedAmountHopper2:r,feedButtonHopper1:s,feedButtonHopper2:n}=this.entities;return c`
      <section>
        <h3>Per-hopper feed</h3>
        <p class="hint">
          Targets one auger's amount byte. This feeder's firmware spins both augers anyway, so
          expect roughly double into the bowl until a hopper divider is fitted.
        </p>
        <div class="hoppers">
          ${e?c`
                <div class="hopper">
                  <span class="hopper-label">Hopper 1</span>
                  ${this._renderStepper(e,Mr(this.hass,e))}
                  ${s?c`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(s)}></kibble-hold-button>`:h}
                </div>
              `:h}
          ${r?c`
                <div class="hopper">
                  <span class="hopper-label">Hopper 2</span>
                  ${this._renderStepper(r,Mr(this.hass,r))}
                  ${n?c`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(n)}></kibble-hold-button>`:h}
                </div>
              `:h}
        </div>
      </section>
    `}_renderCalibrationSection(){return c`
      <section>
        <h3>Bowl calibration</h3>
        <p class="hint">
          Turns the bowl's raw fill reading into a real percentage by dispensing known portions
          into an empty bowl. Each hopper keeps its own curve.
        </p>
        <button type="button" class="cloud-toggle" @click=${this._openCalibration}>Calibrate bowl</button>
      </section>
    `}_renderStepper(e,r){return r?c`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${r.value<=r.min} @click=${()=>this._setNumber(e,Math.max(r.min,r.value-r.step))}>
          &minus;
        </button>
        <span class="step-value">${r.value}</span>
        <button type="button" class="step-btn" ?disabled=${r.value>=r.max} @click=${()=>this._setNumber(e,Math.min(r.max,r.value+r.step))}>
          &plus;
        </button>
      </div>
    `:h}_renderToggles(){let r=[{id:this.entities.nightVisionSwitch,icon:"weatherNight",label:"Night vision"},{id:this.entities.statusLedSwitch,icon:"ledOn",label:"Status LED"},{id:this.entities.microphoneSwitch,icon:"microphone",label:"Microphone"}].filter(s=>s.id!==void 0);return r.length===0?h:c`
      <section>
        <h3>Device</h3>
        ${r.map(s=>this._renderToggleRow(s.id,s.icon,s.label))}
      </section>
    `}_renderToggleRow(e,r,s){let n=this.hass.states[e],o=n?.state==="on",a=!n||n.state==="unavailable";return c`
      <button type="button" class="toggle-row" ?disabled=${a} @click=${()=>this._toggleSwitch(e)}>
        <span class="toggle-icon">${H(r)}</span>
        <span class="toggle-label">${s}</span>
        <span class="toggle-pill ${o?"on":""}"><span class="toggle-knob"></span></span>
      </button>
    `}_renderCloud(){let r=this.hass.states[this.entities.cloudSwitch]?.state==="on",s=this.entities.cloudConnection?this.hass.states[this.entities.cloudConnection]?.state:void 0;return c`
      <section>
        <h3>Petkit cloud</h3>
        <p class="hint">${s?`Connection: ${s}`:"Turns the feeder's cloud link on or off."}</p>
        <button type="button" class="cloud-toggle ${this._cloudConfirmArmed?"confirming":""}" @click=${this._onCloudToggleClick}>
          ${this._cloudConfirmArmed?`Tap again to turn ${r?"off":"on"}`:r?"On \u2014 tap to turn off":"Off \u2014 tap to turn on"}
        </button>
      </section>
    `}_renderWifi(){let e=this.hass.states[this.entities.wifiNetwork];return c`
      <section>
        <h3>Wi-Fi</h3>
        <p class="hint">${e?e.state:"Unavailable"}</p>
      </section>
    `}_renderDishPhotos(){let e=this.entities.dishBefore?this.hass.states[this.entities.dishBefore]:void 0,r=this.entities.dishAfter?this.hass.states[this.entities.dishAfter]:void 0,s=e&&e.state!=="unavailable",n=r&&r.state!=="unavailable";return!s&&!n?h:c`
      <section>
        <h3>Last feed</h3>
        <kibble-before-after
          .beforeSrc=${s?String(e.attributes.entity_picture??""):null}
          .afterSrc=${n?String(r.attributes.entity_picture??""):null}
          aspect="1.333"
        ></kibble-before-after>
      </section>
    `}_renderSpeaker(){let e=this.hass.states[this.entities.speaker];if(!e)return h;let r=typeof e.attributes.volume_level=="number"?e.attributes.volume_level:.5;return c`
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
    `}_pressButton(e){this.hass.callService("button","press",{},{entity_id:e})}_toggleSwitch(e){this.hass.callService("switch","toggle",{},{entity_id:e})}_setNumber(e,r){this.hass.callService("number","set_value",{value:r},{entity_id:e})}_renderStack(){let e=this.hass.states[this.entities.stackSelect];if(!e||e.state==="unavailable")return h;let r=e.state,s=r==="librefeed"?"vendor":"librefeed",n=o=>o==="librefeed"?"LibreFeed":"Petkit stack";return c`
      <section>
        <h3>Stack</h3>
        <p class="hint">Running ${n(r)}. Switching reboots the feeder; it is back in about a minute.</p>
        <button type="button" class="cloud-toggle ${this._stackConfirmArmed?"confirming":""}" @click=${this._onStackClick}>
          ${this._stackConfirmArmed?`Tap again to boot ${n(s)}`:`Switch to ${n(s)}`}
        </button>
      </section>
    `}_onStackClick(){let r=this.hass.states[this.entities.stackSelect]?.state==="librefeed"?"vendor":"librefeed";if(this._stackConfirmArmed){clearTimeout(this._stackConfirmTimer),this._stackConfirmArmed=!1,this.hass.callService("select","select_option",{entity_id:this.entities.stackSelect,option:r}),this.requestUpdate();return}this._stackConfirmArmed=!0,this.requestUpdate(),this._stackConfirmTimer=setTimeout(()=>{this._stackConfirmArmed=!1,this.requestUpdate()},Qn)}_onCloudToggleClick(){if(this._cloudConfirmArmed){clearTimeout(this._cloudConfirmTimer),this._cloudConfirmArmed=!1,this._toggleSwitch(this.entities.cloudSwitch),this.requestUpdate();return}this._cloudConfirmArmed=!0,this.requestUpdate(),this._cloudConfirmTimer=setTimeout(()=>{this._cloudConfirmArmed=!1,this.requestUpdate()},Qn)}_openDevicePage(){let e=this.entities.deviceId;history.pushState(null,"",`/config/devices/device/${e}`),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0})),this._close()}_onKeydown(e){e.key==="Escape"&&this._close()}_openCalibration(){this._calibrationOpen=!0}_closeCalibration(e){e.stopPropagation(),this._calibrationOpen=!1}_close(){this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-settings-dialog",Or);function N(t,i,e){let r=i.split("/").map(s=>encodeURIComponent(s)).join("/");return`/api/kibble/${encodeURIComponent(t)}/image/${r}/${encodeURIComponent(e)}`}var ue=class{constructor(){this._urls=new Map;this._pending=new Map}get(i,e,r){let s=this._urls.get(e);if(s)return this._urls.delete(e),this._urls.set(e,s),s;let n=this._pending.get(e);if(n)return n.then(()=>r(this._urls.get(e)??null)),null;let o=this._fetch(i,e).then(a=>{this._pending.delete(e),a&&this._remember(e,a),r(a)});return this._pending.set(e,o),null}async _fetch(i,e){if(!i.fetchWithAuth)return null;try{let r=await i.fetchWithAuth(e);if(!r.ok)return null;let s=await r.blob();return URL.createObjectURL(s)}catch{return null}}_remember(i,e){for(this._urls.set(i,e);this._urls.size>200;){let r=this._urls.keys().next().value;if(r===void 0)break;let s=this._urls.get(r);this._urls.delete(r),s&&URL.revokeObjectURL(s)}}dispose(){for(let i of this._urls.values())URL.revokeObjectURL(i);this._urls.clear(),this._pending.clear()}};function Xn(){return J`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `}function Gn(t){let i=0;for(let e=0;e<t.length;e++)i=i*31+t.charCodeAt(e)|0;return gi(i)}var Ir=class extends b{constructor(){super();this._cache=new ue;this._imageUrl=null;this._resolvedPath=null;this.name=null,this.colorIndex=null,this.sampleName=null}static{this.properties={hass:{attribute:!1},name:{type:String},colorIndex:{type:Number,attribute:"color-index"},entryId:{type:String,attribute:"entry-id"},sampleName:{type:String,attribute:"sample-name"}}}disconnectedCallback(){super.disconnectedCallback(),this._cache.dispose()}willUpdate(){let e=this.entryId&&this.name&&this.sampleName?N(this.entryId,`sample/${this.name}`,this.sampleName):null;e!==this._resolvedPath&&(this._resolvedPath=e,this._imageUrl=null,!(!e||!this.hass)&&(this._imageUrl=this._cache.get(this.hass,e,r=>{this._resolvedPath===e&&(this._imageUrl=r,this.requestUpdate())})))}render(){if(!this.name)return c`<div class="avatar neutral">${Xn()}</div>`;let e=this.colorIndex!=null?gi(this.colorIndex):Gn(this.name);return c`
      <div class="avatar" style="--kibble-avatar-color: ${e}">
        ${this._imageUrl?c`<img src=${this._imageUrl} alt="" />`:c`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `}static{this.styles=y`
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
  `}};customElements.define("kibble-avatar",Ir);var Fa=gl(Ha(),1);function Ds(t){for(let i of Object.values(t.entities??{}))if(i.platform==="scrypted"&&i.entity_id.startsWith("sensor.scrypted_token")){let e=t.states[i.entity_id]?.state;if(e&&e!=="unavailable"&&e!=="unknown")return e}}var Is=class{constructor(){this.options={proxy:!0,userAgent:navigator.userAgent,capabilities:{audio:RTCRtpReceiver.getCapabilities?.("audio")??{codecs:[],headerExtensions:[]},video:RTCRtpReceiver.getCapabilities?.("video")??{codecs:[],headerExtensions:[]}},screen:{devicePixelRatio:window.devicePixelRatio,width:screen.width,height:screen.height}};this.__proxy_props={options:this.options}}async getOptions(){return this.options}createPeerConnection(i){if(this.pc)return this.pc;let e=new RTCPeerConnection(i.configuration);this.pc=e,e.addEventListener("iceconnectionstatechange",()=>{["disconnected","failed","closed"].includes(e.iceConnectionState)&&this.onClosed?.()});let r=new MediaStream;if(e.addEventListener("track",s=>{r.addTrack(s.track),this.onTrack?.(r)}),i.datachannel&&e.createDataChannel(i.datachannel.label,i.datachannel.dict),i.audio){let s=e.addTransceiver("audio",i.audio);(i.audio.direction==="sendrecv"||i.audio.direction==="sendonly")&&(this.microphone=s.sender)}return i.video&&e.addTransceiver("video",i.video),e}async createLocalDescription(i,e,r){let s=this.createPeerConnection(e),n=new Promise(p=>{s.onicecandidate=u=>{u.candidate?r?.(JSON.parse(JSON.stringify(u.candidate))):p()},s.onicegatheringstatechange=()=>{s.iceGatheringState==="complete"&&p()}}),o=i==="offer"?await s.createOffer({offerToReceiveAudio:!!e.audio,offerToReceiveVideo:!!e.video}):await s.createAnswer(),a=s.setLocalDescription(o);if(r)return{type:o.type,sdp:o.sdp};await a,await n;let l=s.localDescription??o;return{type:l.type,sdp:l.sdp}}async setRemoteDescription(i,e){await this.createPeerConnection(e).setRemoteDescription(i)}async addIceCandidate(i){await this.pc?.addIceCandidate(i)}async endSession(){}async setMicrophone(i){if(!this.microphone)throw new Error("this stream has no return-audio channel");if(i&&!this.micTrack){let e=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1});this.micTrack=e.getAudioTracks()[0],await this.microphone.replaceTrack(this.micTrack)}this.micTrack&&(this.micTrack.enabled=i)}close(){this.micTrack?.stop(),this.pc?.getSenders().forEach(i=>i.track?.stop()),this.pc?.close(),this.pc=void 0}},Ji=class{constructor(i){this.state="idle";this.hasIntercom=!1;this.onChange=i}async open(i,e){this.close(),this.setState("connecting");try{let r=`${location.origin}/api/scrypted/${i.token}/`,s=await(0,Fa.connectScryptedClient)({baseUrl:r,pluginId:"@scrypted/core",clientName:"kibble-card"});this.client=s;let n=s.systemManager.getDeviceById(i.deviceId);if(!n)throw new Error(`Scrypted has no device ${i.deviceId}`);let o=n.interfaces??[];if(!o.includes("RTCSignalingChannel"))throw new Error(`${n.name} has no WebRTC channel in Scrypted`);this.hasIntercom=o.includes("Intercom");let a=new Is;this.session=a,a.onTrack=p=>{e.srcObject!==p&&(e.srcObject=p,e.play().catch(()=>{})),this.setState("live")},a.onClosed=()=>{this.session===a&&this.fail("stream disconnected")};let l=n;this.control=await l.startRTCSignalingSession(a)}catch(r){throw this.fail(r instanceof Error?r.message:String(r)),r}}async talk(i){if(!this.session)throw new Error("not connected");await this.session.setMicrophone(i),await this.control?.setPlayback({audio:i,video:!0})}close(){this.control?.setPlayback({audio:!1,video:!0}).catch(()=>{}),this.control=void 0,this.session?.close(),this.session=void 0,this.client?.disconnect?.(),this.client=void 0,this.state!=="idle"&&this.setState("idle")}fail(i){this.error=i,this.session?.close(),this.session=void 0,this.setState("error")}setState(i){this.state=i,i!=="error"&&(this.error=void 0),this.onChange()}};function Na(t,i,e){return t&&i?{kind:"scrypted",deviceId:t,token:i}:e?{kind:"ha-camera",entityId:e}:{kind:"none"}}function za(t){return Math.min(t*2,3e4)}function er(t){return`${Math.round(t*1e4)/100}%`}function Hs(t){return{left:er(t.x1),top:er(t.y1),width:er(t.x2-t.x1),height:er(t.y2-t.y1)}}function Ba(t){let i=null,e=-1/0;for(let r of t){if(!r.admitted)continue;let s=(r.x2-r.x1)*(r.y2-r.y1);s>e&&(i=r,e=s)}return i}function Ua(t){return t.y1<=.02}function ja(t,i){return i==null?t:`${t} ${Math.round(i*100)}%`}var Lu=8e3,Mu=2e3,Ou=6e4,Iu=1e3,Fs=class extends b{constructor(){super();this._starting=!1;this._backoffMs=1e3;this._lastProgress=0;this._hiddenPaused=!1;this._visionQuery=new q(()=>this.requestUpdate());this._live=new Ji(()=>{this._tick=(this._tick??0)+1});this._start=async()=>{let e=Ds(this.hass);if(!e||!this.scryptedId)return;this._starting=!0,this._playing=!0,this._lastProgress=performance.now(),await this.updateComplete;let r=this.renderRoot.querySelector("#video");if(!r){this._starting=!1;return}try{await this._live.open({deviceId:this.scryptedId,token:e},r),this._reconnecting=!1,this._backoffMs=1e3}catch{this._beginReconnect();return}finally{this._starting=!1}};this._onTimeUpdate=()=>{this._lastProgress=performance.now()};this._checkStall=()=>{this._videoSource().kind==="scrypted"&&(!this._playing||this._reconnecting||document.hidden||performance.now()-this._lastProgress>Lu&&this._beginReconnect())};this._pollVision=()=>{let e=this.hass?.callWS,r=this.entryId;!e||!r||this._visionQuery.refresh(()=>e({type:"kibble/vision/last",entry_id:r}).then(s=>s))};this._onVisibilityChange=()=>{if(this._videoSource().kind==="scrypted"){if(document.hidden){clearTimeout(this._hiddenTimer),this._hiddenTimer=setTimeout(this._pauseForHidden,Ou);return}if(clearTimeout(this._hiddenTimer),this._hiddenTimer=void 0,this._hiddenPaused){this._hiddenPaused=!1,this._backoffMs=1e3,this.requestUpdate();return}this._playing&&(this._lastProgress=performance.now())}};this._pauseForHidden=()=>{this._hiddenTimer=void 0,this._videoSource().kind==="scrypted"&&(!this._playing&&!this._reconnecting||(this._hiddenPaused=!0,this._reconnecting=!1,clearTimeout(this._reconnectTimer),this._reconnectTimer=void 0,this._live.close(),this._playing=!1,this._talking=!1))};this._stop=()=>{clearTimeout(this._reconnectTimer),this._reconnectTimer=void 0,clearTimeout(this._hiddenTimer),this._hiddenTimer=void 0,this._live.close(),this._playing=!1,this._talking=!1,this._starting=!1,this._reconnecting=!1,this._hiddenPaused=!1,this._backoffMs=1e3};this._onFrameClick=e=>{if(e.target.closest?.(".chip")){e.stopPropagation();return}this._expanded||this._expand()};this._collapse=e=>{e?.stopPropagation(),document.removeEventListener("keydown",this._onKeyDown),this._fullscreen&&(document.exitFullscreen?.()??Promise.resolve()).catch(()=>{}),this._expanded=!1};this._onKeyDown=e=>{e.key==="Escape"&&this._collapse()};this._toggleFullscreen=async e=>{if(e.stopPropagation(),this._fullscreen){await(document.exitFullscreen?.()??Promise.resolve()).catch(()=>{});return}let r=this.renderRoot.querySelector("#frame"),s=this.renderRoot.querySelector("#video");try{r?.requestFullscreen?await r.requestFullscreen():s?.webkitEnterFullscreen&&s.webkitEnterFullscreen()}catch{}};this._onFullscreenChange=()=>{let e=this.renderRoot,r=document,s=e.fullscreenElement??e.webkitFullscreenElement??null,n=document.fullscreenElement??r.webkitFullscreenElement??null,o=!1;for(let a=this;a&&n;a=a.host??a.parentNode)if(a===n){o=!0;break}this._fullscreen=s!==null||o};this._toggleMute=()=>{this._muted=!this._muted,this._videoSource().kind==="scrypted"&&this._applyMute()};this._applyMute=()=>{let e=this.renderRoot.querySelector("#video");e&&(e.muted=this._muted,e.play().catch(()=>{}))};this._toggleTalk=async()=>{let e=!this._talking;this._talking=e;try{await this._live.talk(e)}catch{e&&(this._talking=!1)}};this._playing=!1,this._talking=!1,this._muted=!0,this._reconnecting=!1,this._expanded=!1,this._fullscreen=!1,this._tick=0}static{this.properties={hass:{attribute:!1},cameraEntity:{attribute:!1},scryptedId:{attribute:!1},entryId:{attribute:!1},overlayEntity:{attribute:!1},_playing:{state:!0},_talking:{state:!0},_muted:{state:!0},_reconnecting:{state:!0},_expanded:{state:!0},_fullscreen:{state:!0},_tick:{state:!0}}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),document.addEventListener("fullscreenchange",this._onFullscreenChange),document.addEventListener("webkitfullscreenchange",this._onFullscreenChange),this._stallCheckInterval=setInterval(this._checkStall,Mu)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibilityChange),document.removeEventListener("fullscreenchange",this._onFullscreenChange),document.removeEventListener("webkitfullscreenchange",this._onFullscreenChange),document.removeEventListener("keydown",this._onKeyDown),clearInterval(this._stallCheckInterval),this._stallCheckInterval=void 0,clearInterval(this._visionTimer),this._visionTimer=void 0,this._stop()}_videoSource(){return this.hass?Na(this.scryptedId,Ds(this.hass),this.cameraEntity):{kind:"none"}}updated(){this._syncVisionPolling();let e=this._videoSource();if(e.kind!=="scrypted"){(this._playing||this._starting||this._reconnecting||this._hiddenPaused||this._live.state!=="idle")&&this._stop(),this._playing=e.kind==="ha-camera";return}if(this._live.state==="error"&&this._playing){this._beginReconnect();return}this._playing||this._starting||this._reconnecting||this._hiddenPaused||this._start()}render(){let e=this._videoSource();return c`
      ${this._expanded?c`<div class="backdrop" @click=${this._collapse}></div>`:h}
      <div class="frame ${this._expanded?"expanded":""}" id="frame" @click=${this._onFrameClick}>
        ${this._renderStill()}
        ${this._playing?this._renderVideo(e):h}
        ${this._playing?this._renderDetections():h}
        ${this._expanded?c`<div class="topbar">
              <button class="chip" aria-label=${this._fullscreen?"Leave fullscreen":"Fullscreen"} title=${this._fullscreen?"Leave fullscreen":"Fullscreen"} @click=${this._toggleFullscreen}>
                ${H(this._fullscreen?"fullscreenExit":"fullscreen")}
              </button>
              <button class="chip" aria-label="Close" title="Close" @click=${this._collapse}>${H("close")}</button>
            </div>`:h}
        ${e.kind==="scrypted"&&this._reconnecting?c`<div class="reconnect" role="status" aria-label="Reconnecting to the feeder's camera">${H("refresh")}</div>`:h}
        <div class="controls">
          ${this._playing?c`<button
                class="chip"
                aria-pressed=${!this._muted}
                aria-label=${this._muted?"Unmute the feeder":"Mute the feeder"}
                title=${this._muted?"Unmute the feeder":"Mute the feeder"}
                @click=${this._toggleMute}
              >
                ${H(this._muted?"volumeOff":"volumeHigh")}
              </button>`:h}
          ${this._playing&&e.kind==="scrypted"&&this._live.hasIntercom?c`<button
                class="chip talk"
                aria-pressed=${this._talking}
                aria-label=${this._talking?"Stop talking to the feeder":"Talk to the feeder"}
                title=${this._talking?"Stop talking to the feeder":"Talk to the feeder"}
                @click=${this._toggleTalk}
              >
                ${H(this._talking?"microphone":"microphoneOff")}
              </button>`:h}
        </div>
        ${e.kind==="scrypted"&&this._live.state==="error"&&!this._reconnecting?c`<div class="note error">${this._live.error}</div>`:h}
      </div>
    `}_renderVideo(e){return e.kind==="scrypted"?c`<video
        id="video"
        autoplay
        playsinline
        ?muted=${this._muted}
        @loadedmetadata=${this._applyMute}
        @timeupdate=${this._onTimeUpdate}
      ></video>`:e.kind==="ha-camera"&&customElements.get("ha-camera-stream")?c`<ha-camera-stream
        .hass=${this.hass}
        .stateObj=${this.hass.states[e.entityId]}
        .fitMode=${this._expanded?"contain":"cover"}
        .muted=${this._muted}
      ></ha-camera-stream>`:h}_renderStill(){if(!this.cameraEntity)return c`<div class="placeholder">No camera on this device</div>`;if(customElements.get("hui-image"))return c`<hui-image .hass=${this.hass} .cameraImage=${this.cameraEntity} cameraView="auto"></hui-image>`;let e=this.hass.states[this.cameraEntity]?.attributes.entity_picture;return typeof e=="string"?c`<img src=${e} alt="The feeder's camera" />`:c`<div class="placeholder">Camera unavailable</div>`}_renderDetections(){let e=this._visionQuery.state.data?.frame;if(!this._overlayOn()||!e?.detections)return h;let r=e.overlay_suppressed??!0,s=e.detections.filter(a=>a.admitted||r);if(s.length===0)return h;let n=e.cat,o=n?Ba(s):null;return c`
      <div class="detections" aria-hidden="true">
        ${s.map(a=>this._renderDetectionBox(a))}
        ${o&&n?this._renderCatLabel(o,n,e.cat_score??null):h}
      </div>
    `}_renderDetectionBox(e){let r=Hs(e),s=`left:${r.left};top:${r.top};width:${r.width};height:${r.height};`;return c`<div class="det-box ${e.admitted?"":"quiet"}" style=${s}></div>`}_renderCatLabel(e,r,s){let n=Hs(e);return c`<div class="det-label ${Ua(e)?"flip":""}" style="left:${n.left};top:${n.top};">
      ${ja(r,s)}
    </div>`}_beginReconnect(){this._playing=!1,this._reconnecting=!0,this._talking=!1,this._live.close(),this._reconnectTimer===void 0&&(this._reconnectTimer=setTimeout(()=>{this._reconnectTimer=void 0,this._start()},this._backoffMs),this._backoffMs=za(this._backoffMs))}_overlayOn(){let e=this.overlayEntity;return e!==void 0&&this.hass?.states[e]?.state==="on"}_syncVisionPolling(){let e=this._playing&&this._overlayOn()&&!!this.entryId&&!!this.hass?.callWS,r=this._visionTimer!==void 0;if(e!==r){if(!e){this._stopVisionPolling();return}this._pollVision(),this._visionTimer=setInterval(this._pollVision,Iu)}}_stopVisionPolling(){clearInterval(this._visionTimer),this._visionTimer=void 0,this._visionQuery=new q(()=>this.requestUpdate())}_expand(){this._expanded=!0,document.addEventListener("keydown",this._onKeyDown)}static{this.styles=y`
    :host {
      display: block;
      height: 100%;
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
    .frame.expanded video,
    .frame.expanded img,
    .frame.expanded hui-image {
      object-fit: contain;
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
      object-fit: cover; /* ha-camera-stream ignores this on its own host; see .fitMode in _renderVideo */
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
    .detections {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }
    .det-box {
      position: absolute;
      border: 2px solid var(--kibble-amber, #f2a33c);
      border-radius: 3px;
      transition: left 250ms ease, top 250ms ease, width 250ms ease, height 250ms ease;
    }
    .det-box.quiet {
      border: 1px dashed rgba(255, 255, 255, 0.45);
      opacity: 0.6;
    }
    .det-label {
      position: absolute;
      transform: translateY(calc(-100% - 4px));
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.65);
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      transition: left 250ms ease, top 250ms ease;
    }
    .det-label.flip {
      transform: translateY(4px);
    }
  `}};customElements.define("kibble-live-hero",Fs);async function Va(){return customElements.get("bubble-card")?!0:(await Promise.race([customElements.whenDefined("bubble-card"),new Promise(t=>setTimeout(t,2e3))]),!!customElements.get("bubble-card"))}var Ns=class extends b{constructor(){super(...arguments);this._builtFor=""}static{this.properties={hass:{attribute:!1},config:{attribute:!1}}}updated(){this._sync()}async _sync(){if(!this.config)return;let e=JSON.stringify(this.config);if(e!==this._builtFor){this._builtFor=e;let r=await window.loadCardHelpers?.();if(!r||e!==this._builtFor)return;let s=r.createCardElement({type:"custom:bubble-card",...this.config});this._element?.remove(),this._element=s,this.renderRoot.querySelector(".slot")?.appendChild(s)}this._element&&this.hass&&(this._element.hass=this.hass)}render(){return c`<div class="slot"></div>`}static{this.styles=y`
    :host {
      display: block;
    }
    .slot > * {
      /* Bubble rows carry their own outer margin for stacking; the card lays them out itself. */
      --bubble-margin: 0;
    }
  `}};customElements.define("kibble-bubble-row",Ns);var Du=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"scrypted_id",selector:{text:{}}},{name:"settings_hash",selector:{text:{}}},{name:"schedule_hash",selector:{text:{}}}],Hu={device_id:"Kibble device",name:"Name (optional)",scrypted_id:"Scrypted camera id (optional \u2014 adds low-latency video + talk)",settings_hash:"Settings pop-up hash (optional)",schedule_hash:"Schedule handled by dashboard (optional hash)"},zs=class extends b{constructor(){super(...arguments);this._computeLabel=e=>Hu[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${Du}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():h}_renderFallback(){let e=Object.values(this.hass?.entities??{}),r=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return c`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${r.map(s=>c`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateSettingsHash(e){this._config&&(this._config={...this._config,settings_hash:e||void 0},this._fireConfigChanged())}_updateScheduleHash(e){this._config&&(this._config={...this._config,schedule_hash:e||void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-card-editor",zs);function Bs(t){let i=t.image_before??null,e=t.image_after??null;return!i&&!e?null:{before:i,after:e}}function qa(t){return!t.before&&!t.after?null:{before:t.before,after:t.after}}function Us(t,i,e){if(t)return{name:t,kind:i};let r=e?.after??e?.before??null;return r?{name:r,kind:"event"}:null}function kt(t){return t.kind==="identified"?t.paired_class==="eat"?`${t.cat} ate`:`${t.cat} was here`:t.kind==="eat"?"A cat ate":"A cat came by"}function Wa(t,i){return i?t:t.filter(e=>e.kind!=="visit")}function Ka(t){let i=!t.manual,e=t.confirmed===!1;if(t.amount==null)return{headline:"Fed",scheduled:i,unconfirmed:e};let r=t.amount===1?"portion":"portions",s=t.hopper&&t.hopper!=="both"?` from hopper ${t.hopper}`:"";return{headline:`Fed ${t.amount} ${r}${s}`,scheduled:i,unconfirmed:e}}function Gt(t){return`${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`}function Fu(t,i){if(Gt(t)===Gt(i))return"Today";let e=new Date(i.getFullYear(),i.getMonth(),i.getDate()-1);return Gt(t)===Gt(e)?"Yesterday":t.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}function Ya(t,i){let e=[],r=null;for(let s of t){let n=new Date(s.ts*1e3),o=Gt(n);o!==r&&(r=o,e.push({label:Fu(n,i),items:[]})),e[e.length-1].items.push(s)}return e}function Qa(t){let i=(t??"").trim();return i==="none"?"":`max-height:${i||"min(60vh, 560px)"}`}var js=class extends b{constructor(){super();this._closeButtonRef=U();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&(e.preventDefault(),this._close())};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.imageUrl=null,this.alt="",this.beforeUrl=null,this.afterUrl=null,this.beforeLabel="Before",this.afterLabel="After"}static{this.properties={open:{type:Boolean,reflect:!0},imageUrl:{type:String},alt:{type:String},beforeUrl:{type:String},afterUrl:{type:String},beforeLabel:{type:String},afterLabel:{type:String}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler)}updated(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus()}render(){if(!this.open)return h;let e=!!(this.beforeUrl||this.afterUrl);return c`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.alt||"Photo"}>
        <div class="frame ${e?"compare":""}" @click=${r=>r.stopPropagation()}>
          ${e?c`
                <kibble-before-after
                  .beforeSrc=${this.beforeUrl}
                  .afterSrc=${this.afterUrl}
                  .beforeLabel=${this.beforeLabel}
                  .afterLabel=${this.afterLabel}
                  .caption=${this.alt}
                ></kibble-before-after>
              `:this.imageUrl?c`<img src=${this.imageUrl} alt=${this.alt} />`:h}
          <button type="button" class="close" aria-label="Close" ${F(this._closeButtonRef)} @click=${this._close}>
            ${H("close")}
          </button>
        </div>
      </div>
    `}static{this.styles=y`
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
    .frame.compare {
      width: min(90vw, 720px);
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
  `}};customElements.define("kibble-lightbox",js);var Nu=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"limit",selector:{number:{min:1,mode:"box"}}},{name:"show_visits",selector:{boolean:{}}}],zu={device_id:"Kibble device",name:"Name (optional)",limit:"Rows before \u201CShow more\u201D (optional, default 30)",show_visits:"Show bare \u201Ca cat came by\u201D rows (optional, default off)"},Vs=class extends b{constructor(){super(...arguments);this._computeLabel=e=>zu[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${Nu}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():h}_renderFallback(){let e=Object.values(this.hass?.entities??{}),r=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return c`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${r.map(s=>c`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateLimit(e){if(!this._config)return;let r=Number(e);this._config={...this._config,limit:e&&Number.isFinite(r)?r:void 0},this._fireConfigChanged()}_updateShowVisits(e){this._config&&(this._config={...this._config,show_visits:e?!0:void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-timeline-card-editor",Vs);var Bu={deviceId:"",catPresence:[]},qs=30,Ws=class extends b{constructor(){super();this._entities=Bu;this._timelineQuery=new q(()=>this.requestUpdate());this._imageCache=new ue;this._lightboxTrigger=null;this._showMore=()=>{this._visibleCount+=this._config?.limit??qs};this._retryTimeline=()=>{let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId,s=this._config?.show_visits===!0;this._timelineQuery.refresh(()=>e({type:"kibble/timeline",entry_id:r,include_visits:s}).then(n=>n))};this._closeLightbox=()=>{this._lightboxUrl=null,this._comparePair=null,this._lightboxTrigger?.focus(),this._lightboxTrigger=null};this._visibleCount=qs,this._lightboxUrl=null,this._lightboxAlt="",this._comparePair=null}static{this.properties={hass:{attribute:!1},_config:{state:!0},_visibleCount:{state:!0},_lightboxUrl:{state:!0},_lightboxAlt:{state:!0},_comparePair:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");this._config=e,this._visibleCount=e.limit??qs}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-timeline-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-timeline-card-editor")}disconnectedCallback(){super.disconnectedCallback(),this._imageCache.dispose()}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=lt(this.hass.entities??{},e),this._entryId=ct(this.hass.devices??{},e));let r=this.hass?.callWS;if(this.hass&&this._entryId&&r){let s=this._entryId,n=this._config?.show_visits===!0,o=`${Ve(this.hass,[this._entities.lastDetection,this._entities.feeding,this._entities.dishAfter])}|visits=${n}`;this._timelineQuery.sync(o,()=>r({type:"kibble/timeline",entry_id:s,include_visits:n}).then(a=>a))}}render(){if(!this._config||!this.hass)return h;let e=this._timelineQuery.state,r=Wa(e.data?.items??[],this._config.show_visits===!0),s=r.slice(0,this._visibleCount),n=Ya(s,new Date),o=r.length>s.length,a=!e.error&&!e.loading&&e.data!==null&&n.length===0,l=this._comparePair,p=l?.before?this._imageCache.get(this.hass,N(l.entryId,"event",l.before),()=>this.requestUpdate()):null,u=l?.after?this._imageCache.get(this.hass,N(l.entryId,"event",l.after),()=>this.requestUpdate()):null;return c`
      <ha-card>
        <div class="container">
          ${this._config.name?c`<div class="label">${this._config.name}</div>`:h}
          <div class="rail" style=${Qa(this._config.max_height)}>
            ${e.error?this._renderError(e.error):h}
            ${a?this._renderEmpty():h}
            ${n.map(d=>this._renderDay(d))}
            ${o?c`<button type="button" class="show-more" @click=${this._showMore}>Show more</button>`:h}
          </div>
        </div>
      </ha-card>
      <kibble-lightbox
        ?open=${this._lightboxUrl!==null||l!==null}
        .imageUrl=${this._lightboxUrl}
        .beforeUrl=${p}
        .afterUrl=${u}
        .alt=${this._lightboxAlt}
        @close-requested=${this._closeLightbox}
      ></kibble-lightbox>
    `}_renderEmpty(){return c`<p class="empty">Nothing to show yet. Feeds and visits appear here as they happen.</p>`}_renderError(e){return c`
      <div class="error">
        <span>Couldn't load the timeline. ${e}</span>
        <button type="button" @click=${this._retryTimeline}>Try again</button>
      </div>
    `}_renderDay(e){return c`
      <div class="day">
        <div class="day-label">${e.label}</div>
        <div class="day-items">${e.items.map(r=>this._renderItem(r))}</div>
      </div>
    `}_renderItem(e){return e.kind==="identified"?this._renderIdentified(e):e.kind==="eat"?this._renderEat(e):e.kind==="visit"?this._renderVisit(e):this._renderFeed(e)}_renderIdentified(e){let r=this._timeLabel(e.ts),s=Bs(e),n=Us(e.image,e.image_kind,s),o=`${e.cat}, ${r}`;return c`
      <div class="row">
        <span class="time">${r}</span>
        <span class="row-text">${kt(e)}</span>
        ${s?this._renderBowlPair(s,o):h}
        ${n&&this._entryId&&!(s&&n.name===(s.after??s.before))?this._renderThumb(N(this._entryId,n.kind,n.name),o,s?a=>this._openComparePair(a,s,o):void 0):h}
      </div>
    `}_renderEat(e){let r=this._timeLabel(e.ts),s=Bs(e),n=Us(e.image,"event",s),o=`A cat, ${r}`;return c`
      <div class="row">
        <span class="time">${r}</span>
        <span class="row-text">${kt(e)}</span>
        ${s?this._renderBowlPair(s,o):h}
        ${n&&this._entryId&&!(s&&n.name===(s.after??s.before))?this._renderThumb(N(this._entryId,n.kind,n.name),o,s?a=>this._openComparePair(a,s,o):void 0):h}
      </div>
    `}_renderVisit(e){let r=this._timeLabel(e.ts);return c`
      <div class="row">
        <span class="time">${r}</span>
        <span class="row-text">${kt(e)}</span>
        ${e.image&&this._entryId?this._renderThumb(N(this._entryId,"event",e.image),`A cat, ${r}`):h}
      </div>
    `}_renderFeed(e){let r=this._timeLabel(e.ts),s=this._entryId,n=Ka(e),o=qa(e),a=o?.before&&s?this._imageCache.get(this.hass,N(s,"feed",o.before),()=>this.requestUpdate()):null,l=o?.after&&s?this._imageCache.get(this.hass,N(s,"feed",o.after),()=>this.requestUpdate()):null;return c`
      <div class="row row-feed">
        <span class="time">${r}</span>
        <span class="row-text feed-text">
          ${n.headline}${n.scheduled?c` <span class="quiet">(scheduled)</span>`:h}${n.unconfirmed?c` <span class="quiet" title="The feeder dispensed, but its controller never confirmed the amount -- this is the amount that was requested.">(unconfirmed)</span>`:h}
        </span>
        ${o?c`<kibble-before-after class="feed-compare" .beforeSrc=${a} .afterSrc=${l} aspect="2.6"></kibble-before-after>`:c`<span class="feed-no-photo">No photo for this feed</span>`}
      </div>
    `}_renderBowlPair(e,r){if(!this._entryId)return h;let s=this._entryId,n=a=>this._openComparePair(a,e,r),o=(a,l)=>a?this._renderThumb(N(s,"event",a),`${l}: ${r}`,n,"bowl-half"):h;return c`<span class="bowl-pair" title="Bowl before and after">${o(e.before,"Before")}${o(e.after,"After")}</span>`}_renderThumb(e,r,s,n=""){let o=this._imageCache.get(this.hass,e,()=>this.requestUpdate()),a=s?`Compare before and after: ${r}`:`View photo: ${r}`;return c`
      <button type="button" class="thumb ${n}" ?disabled=${!o} aria-label=${a} @click=${l=>s?s(l):this._openLightbox(l,o,r)}>
        ${o?c`<img src=${o} alt="" loading="lazy" />`:h}
      </button>
    `}_timeLabel(e){return new Date(e*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}_openLightbox(e,r,s){r&&(this._lightboxTrigger=e.currentTarget,this._lightboxUrl=r,this._lightboxAlt=s)}_openComparePair(e,r,s){this._entryId&&(this._lightboxTrigger=e.currentTarget,this._comparePair={entryId:this._entryId,before:r.before,after:r.after},this._lightboxAlt=s)}static{this.styles=y`
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
    /* The rail scrolls inside the card rather than lengthening the page -- see
       KibbleTimelineCardConfig.max_height. overscroll-behavior stops a flick at the end of
       the list from scrolling the dashboard behind it, which on a phone is the difference
       between a contained list and an annoying one. */
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
    .day-label {
      /* Sticky so the date stays visible while its own rows scroll past: in a bounded rail
         you can otherwise be three meals deep with no idea which day you are reading. */
      position: sticky;
      top: 0;
      z-index: 1;
      background: var(--ha-card-background, var(--card-background-color, #fff));
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
      flex-wrap: wrap;
      align-items: flex-start;
    }
    .feed-text {
      font-weight: 500;
    }
    /* Capped so a feed row stays the same scale as every other row. At aspect 1.8 and full
       width the tile stood ~250 px tall on a desktop dashboard, four times a meal row, which
       made a routine dispense the loudest thing in the list. */
    .feed-compare {
      flex: 0 1 auto;
      width: min(280px, 45%);
      max-width: 280px;
    }
    .feed-no-photo {
      flex: 1 1 100%;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .quiet {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .bowl-pair {
      display: inline-flex;
      gap: 3px;
      flex: 0 0 auto;
    }
    /* Slightly smaller than the single thumbnail: two of them sit where one used to, so the
       row keeps its height on a phone rather than growing for every meal. */
    .thumb.bowl-half {
      width: 34px;
      height: 34px;
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
  `}};customElements.define("kibble-timeline-card",Ws);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-timeline-card",name:"Kibble Timeline",description:"Today's feeds and who's been by, one rail, newest first, with day separators and photos.",preview:!0});function Ks(t,i){let e=Math.max(t??0,0,...i);return e>0?e:null}function Xa(t,i,e){return t.guess&&t.guess.score>=i&&e.has(t.guess.cat)?{cat:t.guess.cat,source:"classifier"}:t.vendor_cat&&e.has(t.vendor_cat)?{cat:t.vendor_cat,source:"vendor"}:null}var De=224,Uu=.7,ju=.15,Ys=class extends b{constructor(){super();this._imgRef=U();this._canvasRef=U();this._cancelButtonRef=U();this._objectUrl=null;this._resolvedFile=null;this._naturalWidth=0;this._naturalHeight=0;this._selection=null;this._lastBlob=null;this._dragState=null;this._keydownHandler=e=>{e.key==="Escape"&&this.open&&(e.preventDefault(),this._close())};this._onImageLoad=()=>{let e=this._imgRef.value;if(!e)return;this._naturalWidth=e.naturalWidth,this._naturalHeight=e.naturalHeight;let r=Math.min(this._naturalWidth,this._naturalHeight)*Uu;this._selection={x:(this._naturalWidth-r)/2,y:(this._naturalHeight-r)/2,size:r},this.requestUpdate(),this._drawPreview()};this._onPointerMove=e=>{let r=this._dragState;if(!r||r.pointerId!==e.pointerId||r.scale===0)return;e.preventDefault();let s=(e.clientX-r.startClientX)/r.scale,n=(e.clientY-r.startClientY)/r.scale;if(r.mode==="move")this._selection=this._clamp({...r.startSelection,x:r.startSelection.x+s,y:r.startSelection.y+n});else{let o=Math.max(s,n);this._selection=this._clamp({...r.startSelection,size:r.startSelection.size+o})}this.requestUpdate(),this._drawPreview()};this._endDrag=e=>{this._dragState?.pointerId===e.pointerId&&(this._dragState=null)};this._onSelectionKeydown=e=>{if(!this._selection||this._naturalWidth===0)return;let r=Math.max(2,Math.round(Math.min(this._naturalWidth,this._naturalHeight)*.02)),s={...this._selection};switch(e.key){case"ArrowLeft":s.x-=r;break;case"ArrowRight":s.x+=r;break;case"ArrowUp":s.y-=r;break;case"ArrowDown":s.y+=r;break;case"+":case"=":s.x-=r/2,s.y-=r/2,s.size+=r;break;case"-":case"_":s.x+=r/2,s.y+=r/2,s.size-=r;break;default:return}e.preventDefault(),this._selection=this._clamp(s),this.requestUpdate(),this._drawPreview()};this._useCrop=()=>{let e=this._canvasRef.value;!e||!this._selection||e.toBlob(r=>{r&&(this._lastBlob=r,this.dispatchEvent(new CustomEvent("use-crop",{detail:{blob:r},bubbles:!0,composed:!0})))},"image/jpeg",.9)};this._retry=()=>{this._lastBlob&&this.dispatchEvent(new CustomEvent("use-crop",{detail:{blob:this._lastBlob},bubbles:!0,composed:!0}))};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.file=null,this.catName=null,this.queueIndex=0,this.queueTotal=1,this.busy=!1,this.error=null}static{this.properties={open:{type:Boolean,reflect:!0},file:{attribute:!1},catName:{type:String,attribute:"cat-name"},queueIndex:{type:Number,attribute:"queue-index"},queueTotal:{type:Number,attribute:"queue-total"},busy:{type:Boolean},error:{type:String}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),this._objectUrl&&URL.revokeObjectURL(this._objectUrl)}willUpdate(){this.file!==this._resolvedFile&&(this._resolvedFile=this.file,this._objectUrl&&URL.revokeObjectURL(this._objectUrl),this._objectUrl=this.file?URL.createObjectURL(this.file):null,this._naturalWidth=0,this._naturalHeight=0,this._selection=null,this._lastBlob=null)}updated(e){e.has("open")&&this.open&&this._cancelButtonRef.value?.focus()}render(){if(!this.open)return h;let e=this.queueTotal>1,r=this.queueIndex>=this.queueTotal-1;return c`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${`Crop a photo of ${this.catName??"this cat"}`}>
        <div class="sheet" @click=${s=>s.stopPropagation()}>
          <div class="heading">
            <span>Add a photo of ${this.catName??"this cat"}</span>
            ${e?c`<span class="queue">Photo ${this.queueIndex+1} of ${this.queueTotal}</span>`:h}
          </div>
          <div class="stage">
            ${this._objectUrl?c`<img ${F(this._imgRef)} src=${this._objectUrl} alt="" @load=${this._onImageLoad} />`:h}
            ${this._selection?this._renderSelection():h}
          </div>
          <div class="preview-row">
            <canvas ${F(this._canvasRef)} class="preview" width=${De} height=${De} aria-hidden="true"></canvas>
            <p class="hint">
              Drag the square to cover the cat's face, drag its corner to resize. This becomes the training photo
              -- ${De}\u00d7${De}.
            </p>
          </div>
          ${this.error?c`
                <div class="error">
                  <span>${this.error}</span>
                  <button type="button" @click=${this._retry}>Try again</button>
                </div>
              `:h}
          <div class="actions">
            <button type="button" class="cancel" ${F(this._cancelButtonRef)} ?disabled=${this.busy} @click=${this._close}>
              ${e&&!r?"Skip":"Cancel"}
            </button>
            <button type="button" class="use" ?disabled=${this.busy||!this._selection} @click=${this._useCrop}>
              ${this.busy?"Uploading\u2026":"Use this crop"}
            </button>
          </div>
        </div>
      </div>
    `}_renderSelection(){let e=this._imgRef.value,r=this._selection;if(!e||!r||this._naturalWidth===0)return h;let s=e.getBoundingClientRect(),n=e.parentElement.getBoundingClientRect(),o=s.width/this._naturalWidth,a=s.left-n.left+r.x*o,l=s.top-n.top+r.y*o,p=r.size*o;return c`
      <div
        class="selection"
        tabindex="0"
        role="group"
        aria-label="Face crop area"
        style="left: ${a}px; top: ${l}px; width: ${p}px; height: ${p}px;"
        @pointerdown=${u=>this._beginDrag(u,"move")}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._endDrag}
        @pointercancel=${this._endDrag}
        @keydown=${this._onSelectionKeydown}
      >
        <div
          class="handle"
          @pointerdown=${u=>this._beginDrag(u,"resize")}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._endDrag}
          @pointercancel=${this._endDrag}
        ></div>
      </div>
    `}_beginDrag(e,r){r==="resize"&&e.stopPropagation();let s=this._imgRef.value;!s||!this._selection||this._naturalWidth===0||(e.preventDefault(),e.currentTarget.setPointerCapture(e.pointerId),this._dragState={mode:r,pointerId:e.pointerId,startClientX:e.clientX,startClientY:e.clientY,startSelection:{...this._selection},scale:s.getBoundingClientRect().width/this._naturalWidth})}_clamp(e){let r=Math.min(this._naturalWidth,this._naturalHeight),s=Math.max(8,r*ju),n=Math.min(Math.max(e.size,s),r),o=Math.min(Math.max(e.x,0),this._naturalWidth-n),a=Math.min(Math.max(e.y,0),this._naturalHeight-n);return{x:o,y:a,size:n}}_drawPreview(){let e=this._canvasRef.value,r=this._imgRef.value,s=this._selection;if(!e||!r||!s)return;let n=e.getContext("2d");n&&(n.clearRect(0,0,De,De),n.drawImage(r,s.x,s.y,s.size,s.size,0,0,De,De))}static{this.styles=y`
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
  `}};customElements.define("kibble-crop-dialog",Ys);var Qs=class extends b{constructor(){super();this._firstButtonRef=U();this._cache=new ue;this._imageUrl=null;this._resolvedPath=null;this._keydownHandler=e=>{if(!(e.key!=="Escape"||!this.open)){if(e.preventDefault(),this._zoomed){this._zoomed=!1;return}this._close()}};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.cats=[],this.crop=null,this._zoomed=!1}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},cats:{attribute:!1},entryId:{type:String},crop:{attribute:!1},_zoomed:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),this._cache.dispose()}updated(e){e.has("open")&&this.open&&this._firstButtonRef.value?.focus()}willUpdate(){let e=this.entryId&&this.crop?N(this.entryId,"pending",this.crop.name):null;e!==this._resolvedPath&&(this._resolvedPath=e,this._imageUrl=null,this._zoomed=!1,!(!e||!this.hass)&&(this._imageUrl=this._cache.get(this.hass,e,r=>{this._resolvedPath===e&&(this._imageUrl=r,this.requestUpdate())})))}render(){if(!this.open)return h;let e=this.crop,r=e?`Captured ${new Date(e.ts*1e3).toLocaleString()}`:"";return c`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Choose a cat">
        <div class="sheet" @click=${s=>s.stopPropagation()}>
          <div class="heading">Choose a cat</div>
          ${e?c`
                <button
                  type="button"
                  class="preview"
                  ?disabled=${!this._imageUrl}
                  aria-label=${`View full size. ${r}`}
                  @click=${()=>this._zoomed=!0}
                >
                  ${this._imageUrl?c`<img src=${this._imageUrl} alt="" loading="lazy" />`:h}
                </button>
              `:h}
          <div class="rows">
            ${this.cats.map((s,n)=>c`
                <button type="button" class="row" ${n===0?F(this._firstButtonRef):h} @click=${()=>this._choose(s.name)}>
                  <kibble-avatar
                    .hass=${this.hass}
                    .name=${s.name}
                    .colorIndex=${s.color_index}
                    .entryId=${this.entryId}
                    .sampleName=${s.avatar}
                  ></kibble-avatar>
                  <span>${s.name}</span>
                </button>
              `)}
            <button type="button" class="row" ${this.cats.length===0?F(this._firstButtonRef):h} @click=${()=>this._choose("not_a_cat")}>
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
      <kibble-lightbox ?open=${this._zoomed} .imageUrl=${this._imageUrl} .alt=${r} @close-requested=${()=>this._zoomed=!1}></kibble-lightbox>
    `}_choose(e){this.dispatchEvent(new CustomEvent("choice",{detail:{cat:e},bubbles:!0,composed:!0}))}static{this.styles=y`
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
    .preview {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      margin-bottom: 8px;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      padding: 0;
      cursor: pointer;
      overflow: hidden;
    }
    .preview:disabled {
      cursor: default;
    }
    .preview:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      /* Same reasoning as the cats card's crop/sample grids: a real photo, smooth upscale,
       * never "pixelated". */
      image-rendering: auto;
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
  `}};customElements.define("kibble-face-picker",Qs);var Vu=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"confidence",selector:{number:{min:0,max:1,step:.05,mode:"box"}}}],qu={device_id:"Kibble device",name:"Name (optional)",confidence:"Classifier confidence needed to suggest it (optional, default 0.7)"},Xs=class extends b{constructor(){super(...arguments);this._computeLabel=e=>qu[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${Vu}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():h}_renderFallback(){let e=Object.values(this.hass?.entities??{}),r=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return c`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${r.map(s=>c`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateConfidence(e){if(!this._config)return;let r=Number(e);this._config={...this._config,confidence:e&&Number.isFinite(r)?r:void 0},this._fireConfigChanged()}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=y`
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
  `}};customElements.define("kibble-cats-card-editor",Xs);var Wu={deviceId:"",catPresence:[]};function Ga(t){return`cat-${t.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}function Ku(t){let i=/^#cat=(.+)$/.exec(t);if(!i)return null;try{return decodeURIComponent(i[1])}catch{return null}}var Yu=.7,Qu=5e3,Xu=3e3,Gs=class extends b{constructor(){super();this._entities=Wu;this._catsQuery=new q(()=>this.requestUpdate());this._pendingQuery=new q(()=>this.requestUpdate());this._sampleQueries=new Map;this._timelineQuery=new q(()=>this.requestUpdate());this._imageCache=new ue;this._lastPendingData=null;this._pickerTrigger=null;this._fileInputRef=U();this._lightboxTrigger=null;this._scrolledTo=null;this._onLocationChanged=()=>{this._scrolledTo=null,this.requestUpdate()};this._onCatMenuFocusOut=e=>{let r=e.currentTarget,s=e.relatedTarget;(!s||!r.contains(s))&&this._closeCatMenu()};this._onCatMenuKeydown=e=>{if(e.key!=="Escape")return;let r=e.currentTarget.querySelector(".cat-menu-trigger");this._closeCatMenu(),r?.focus()};this._onFilesChosen=e=>{let r=e.target,s=r.files?Array.from(r.files).filter(n=>n.type.startsWith("image/")):[];r.value="",s.length!==0&&(this._uploadQueue=s,this._uploadQueueTotal=s.length,this._uploadError=null)};this._onUseCrop=e=>{let r=this._uploadCat;r&&(this._uploadBusy=!0,this._uploadError=null,this._blobToBase64(e.detail.blob).then(s=>{let n=this._callWS("kibble/faces/upload",{cat:r,jpeg_b64:s});if(!n)throw new Error("Not connected.");return n}).then(s=>{this._uploadBusy=!1,s.low_quality&&(this._uploadNotice="The model isn't confident this is a face."),this._advanceUploadQueue(),this._refreshAll()}).catch(s=>{this._uploadBusy=!1,this._uploadError=te(s)}))};this._onCropDialogClosed=()=>{this._advanceUploadQueue()};this._closePicker=()=>{this._pickerCrop=null,this._pickerTrigger?.focus(),this._pickerTrigger=null};this._onPickerChoice=e=>{let r=this._pickerCrop;this._pickerCrop=null,r&&this._confirm(r,e.detail.cat)};this._closeLightbox=()=>{this._lightboxUrl=null,this._lightboxTrigger?.focus(),this._lightboxTrigger=null};this._hiddenCrops=new Set,this._pickerCrop=null,this._undo=null,this._addName="",this._addBusy=!1,this._addError=null,this._actionError=null,this._openMenuFor=null,this._deleteConfirmFor=null,this._uploadQueue=[],this._uploadQueueTotal=0,this._uploadCat=null,this._uploadBusy=!1,this._uploadError=null,this._uploadNotice=null,this._lightboxUrl=null,this._lightboxAlt=""}static{this.properties={hass:{attribute:!1},_config:{state:!0},_hiddenCrops:{state:!0},_pickerCrop:{state:!0},_undo:{state:!0},_addName:{state:!0},_addBusy:{state:!0},_addError:{state:!0},_actionError:{state:!0},_openMenuFor:{state:!0},_deleteConfirmFor:{state:!0},_uploadQueue:{state:!0},_uploadQueueTotal:{state:!0},_uploadCat:{state:!0},_uploadBusy:{state:!0},_uploadError:{state:!0},_uploadNotice:{state:!0},_lightboxUrl:{state:!0},_lightboxAlt:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Cats card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 8}static getStubConfig(e){return{type:"custom:kibble-cats-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-cats-card-editor")}connectedCallback(){super.connectedCallback(),window.addEventListener("location-changed",this._onLocationChanged),window.addEventListener("hashchange",this._onLocationChanged)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("location-changed",this._onLocationChanged),window.removeEventListener("hashchange",this._onLocationChanged),this._imageCache.dispose(),clearTimeout(this._undoTimer),clearTimeout(this._deleteConfirmTimer)}_confidence(){return this._config?.confidence??Yu}updated(){let e=Ku(window.location.hash);if(!e||this._scrolledTo===e)return;let r=this.renderRoot.querySelector(`#${CSS.escape(Ga(e))}`);r&&(this._scrolledTo=e,r.scrollIntoView({behavior:"smooth",block:"start"}),r.classList.add("lit"),setTimeout(()=>r.classList.remove("lit"),2400))}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=lt(this.hass.entities??{},e),this._entryId=ct(this.hass.devices??{},e));let r=this.hass?.callWS;if(this.hass&&this._entryId&&r){let s=this._entryId,n=Ve(this.hass,[this._entities.pendingFace,this._entities.lastSeenPet]);this._catsQuery.sync(n,()=>r({type:"kibble/cats",entry_id:s}).then(a=>a)),this._pendingQuery.sync(n,()=>r({type:"kibble/faces/pending",entry_id:s}).then(a=>a)),this._timelineQuery.sync(n,()=>r({type:"kibble/timeline",entry_id:s,include_visits:!1}).then(a=>a));for(let a of this._catsQuery.state.data?.cats??[]){if(this._sampleQueries.has(a.name))continue;let l=new q(()=>this.requestUpdate());this._sampleQueries.set(a.name,l)}let o=Ve(this.hass,[this._entities.pendingFace]);for(let[a,l]of this._sampleQueries)l.sync(o,()=>r({type:"kibble/faces/samples",entry_id:s,cat:a}).then(p=>p))}this._pendingQuery.state.data!==this._lastPendingData&&(this._lastPendingData=this._pendingQuery.state.data,this._hiddenCrops=new Set)}render(){if(!this._config||!this.hass)return h;let e=this._catsQuery.state.data?.cats??[],s=(this._pendingQuery.state.data?.crops??[]).filter(p=>!this._hiddenCrops.has(p.name)),n=new Set(e.map(p=>p.name)),o=new Set(this._entities.catPresence.filter(p=>this.hass.states[p.entityId]?.state==="on").map(p=>p.name)),a=this._uploadQueue[0]??null,l=this._uploadQueueTotal-this._uploadQueue.length;return c`
      <ha-card>
        <div class="container">
          ${this._config.name?c`<div class="label">${this._config.name}</div>`:h}
          ${this._actionError?this._renderActionError():h}
          ${this._uploadNotice?this._renderUploadNotice():h}
          <section class="header">
            ${e.length===0?c`<p class="empty">No cats yet. Add one to start training.</p>`:c`<div class="cat-list">${e.map(p=>this._renderCatHeader(p,o.has(p.name)))}</div>`}
            ${this._renderAddCat()}
          </section>
          <section class="inbox">
            <div class="inbox-heading">
              <span>${s.length===1?"1 to review":`${s.length} to review`}</span>
            </div>
            ${this._pendingQuery.state.error?this._renderPendingError():h}
            ${s.length===0&&!this._pendingQuery.state.error?c`<p class="empty">Nothing to review. New crops arrive when the feeder identifies a cat in view.</p>`:c`<div class="crop-grid" @keydown=${this._onGridKeydown}>${s.map(p=>this._renderCrop(p,n))}</div>`}
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
        .crop=${this._pickerCrop}
        @choice=${this._onPickerChoice}
        @close-requested=${this._closePicker}
      ></kibble-face-picker>
      <input type="file" accept="image/*" multiple class="visually-hidden" ${F(this._fileInputRef)} @change=${this._onFilesChosen} />
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
      <kibble-lightbox
        ?open=${this._lightboxUrl!==null}
        .imageUrl=${this._lightboxUrl}
        .alt=${this._lightboxAlt}
        @close-requested=${this._closeLightbox}
      ></kibble-lightbox>
    `}_renderCatHeader(e,r){let s=Ks(e.last_seen,(this._timelineQuery.state.data?.items??[]).filter(o=>o.kind==="identified"&&o.cat===e.name).map(o=>o.ts)),n=s!==null?`seen ${Pe(new Date(s*1e3),new Date)}`:"not seen yet";return c`
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
    `}_renderAddCat(){return c`
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
        ${this._addError?c`<span class="inline-error">${this._addError}</span>`:h}
      </form>
    `}async _onAddCatSubmit(e){e.preventDefault();let r=this._addName.trim();if(!(!r||!this._entities.deviceId)){this._addBusy=!0,this._addError=null;try{await this.hass.callService("kibble","add_cat",{device_id:this._entities.deviceId,name:r}),this._addName="",this._refreshCats()}catch(s){this._addError=te(s)}finally{this._addBusy=!1}}}_renderCatMenu(e){let r=this._deleteConfirmFor===e.name;return c`
      <div class="menu" role="menu">
        <button type="button" role="menuitem" @click=${()=>this._startAddPhotos(e.name)}>Add photos</button>
        <button type="button" role="menuitem" class="danger ${r?"confirming":""}" @click=${()=>this._onDeleteCatClick(e.name)}>
          ${r?"Tap again to delete":"Delete cat\u2026"}
        </button>
      </div>
    `}_toggleCatMenu(e){this._openMenuFor=this._openMenuFor===e?null:e}_closeCatMenu(){this._openMenuFor=null,clearTimeout(this._deleteConfirmTimer),this._deleteConfirmFor=null}_onDeleteCatClick(e){if(this._deleteConfirmFor===e){clearTimeout(this._deleteConfirmTimer),this._deleteConfirmFor=null,this._openMenuFor=null,this._deleteCat(e);return}this._deleteConfirmFor=e,this._deleteConfirmTimer=setTimeout(()=>{this._deleteConfirmFor=null,this.requestUpdate()},Xu)}_deleteCat(e){let r=this._callWS("kibble/cats/delete",{name:e});r&&r.then(()=>{this._sampleQueries.delete(e),this._refreshCats()}).catch(s=>{this._actionError={message:`Couldn't delete ${e}. ${te(s)}`,retry:()=>this._deleteCat(e)}})}_startAddPhotos(e){this._openMenuFor=null,this._uploadCat=e,this._fileInputRef.value?.click()}_advanceUploadQueue(){this._uploadQueue=this._uploadQueue.slice(1),this._uploadError=null,this._uploadQueue.length===0&&(this._uploadCat=null,this._uploadQueueTotal=0)}_blobToBase64(e){return e.arrayBuffer().then(r=>{let s=new Uint8Array(r),n="";for(let o=0;o<s.length;o++)n+=String.fromCharCode(s[o]);return btoa(n)})}_callWS(e,r){let s=this.hass?.callWS,n=this._entryId;return!s||!n?null:s({type:e,entry_id:n,...r}).then(o=>o)}_renderUploadNotice(){return c`
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
    `}_renderCrop(e,r){let s=Xa(e,this._confidence(),r),n=this._entryId?N(this._entryId,"pending",e.name):null,o=n?this._imageCache.get(this.hass,n,()=>this.requestUpdate()):null;return c`
      <div class="crop">
        <button
          type="button"
          class="crop-thumb"
          ?disabled=${!o}
          aria-label=${s?`Confirm ${s.cat}`:"Choose a cat for this crop"}
          @click=${()=>this._onCropTap(e,s)}
        >
          ${o?c`<img src=${o} alt="" loading="lazy" />`:h}
        </button>
        <button type="button" class="chooser" aria-label="Choose a cat for this crop" @click=${a=>this._openPicker(e,a)}>&#8942;</button>
        <div class="chip ${s?`chip-${s.source}`:"chip-empty"}">
          ${s?c`${s.cat}<span class="mark">${s.source==="classifier"?"AI":"ID"}</span>`:"Tap to choose"}
        </div>
      </div>
    `}_onGridKeydown(e){if(!["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(e.key))return;let s=[...e.currentTarget.querySelectorAll(".crop-thumb")],n=s.indexOf(document.activeElement);if(n===-1)return;e.preventDefault();let o=e.key==="ArrowRight"||e.key==="ArrowDown"?1:-1;s[(n+o+s.length)%s.length]?.focus()}_onCropTap(e,r){if(!r){this._pickerCrop=e;return}this._confirm(e,r.cat)}_openPicker(e,r){this._pickerTrigger=r.currentTarget,this._pickerCrop=e}_openLightbox(e,r,s){r&&(this._lightboxTrigger=e.currentTarget,this._lightboxUrl=r,this._lightboxAlt=s)}_confirm(e,r){if(!this._entities.deviceId)return;let s=this._entities.deviceId;this._hiddenCrops=new Set(this._hiddenCrops).add(e.name);let n=r==="not_a_cat"?"Not a cat":r==="other"?"Skip":r;this.hass.callService("kibble","label_face",{device_id:s,crop_id:e.name,cat:r}).then(()=>{this._refreshAll(),this._setUndo({message:`Labelled as ${n}. `,run:()=>{this.hass.callService("kibble","unlabel_face",{device_id:s,cat:r,name:e.name}).then(()=>this._refreshAll())}})}).catch(o=>{let a=new Set(this._hiddenCrops);a.delete(e.name),this._hiddenCrops=a,this._actionError={message:`Couldn't label this crop. ${te(o)}`,retry:()=>this._confirm(e,r)}})}_setUndo(e){clearTimeout(this._undoTimer),this._undo=e,this._undoTimer=setTimeout(()=>{this._undo=null},Qu)}_renderUndo(e){return c`
      <div class="undo-bar" role="status">
        <span>${e.message}</span>
        <button
          type="button"
          @click=${()=>{clearTimeout(this._undoTimer),this._undo=null,e.run()}}
        >
          Undo
        </button>
      </div>
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
    `:h}_renderPendingError(){let e=this._pendingQuery.state.error;return e?c`
      <div class="error">
        <span>Couldn't load the review queue. ${e}</span>
        <button type="button" @click=${()=>this._refreshPending()}>Try again</button>
      </div>
    `:h}_renderGallery(e){let s=(this._sampleQueries.get(e.name)?.state.data?.samples??[]).slice().sort((u,d)=>d.ts-u.ts),n=(this._timelineQuery.state.data?.items??[]).filter(u=>u.kind==="identified"&&u.cat===e.name);if(s.length===0&&e.samples===0&&n.length===0)return h;let o=new Date,a=Ks(e.last_seen,n.map(u=>u.ts)),l=a!==null?Pe(new Date(a*1e3),o):null,p=n.length>0?`${n.length===1?"1 sighting":`${n.length} sightings`}${l?`, seen ${l}`:""}`:l?`Seen ${l}`:"Not seen yet";return c`
      <section class="gallery" id=${Ga(e.name)}>
        <div class="gallery-header">
          <kibble-avatar .hass=${this.hass} .name=${e.name} .colorIndex=${e.color_index} .entryId=${this._entryId} .sampleName=${e.avatar}></kibble-avatar>
          <span class="gallery-name">${e.name}</span>
          <span class="gallery-sub">${p}</span>
        </div>
        ${n.length>0?c`<div class="gallery-grid">${n.map(u=>this._renderSighting(u,o))}</div>`:h}
        ${s.length>0?c`<div class="gallery-sub">${s.length===1?"1 training photo":`${s.length} training photos`}</div>
              <div class="gallery-grid">${s.map(u=>this._renderSample(e.name,u,null))}</div>`:h}
      </section>
    `}_renderSighting(e,r){let s=Pe(new Date(e.ts*1e3),r),n=e.image&&this._entryId?N(this._entryId,e.image_kind,e.image):null,o=n?this._imageCache.get(this.hass,n,()=>this.requestUpdate()):null,a=`${kt(e)}, ${new Date(e.ts*1e3).toLocaleString()}`;return c`
      <div class="sample sighting">
        ${o?c`<button type="button" class="sample-photo" aria-label=${`View full size: ${a}`} @click=${l=>this._openLightbox(l,o,a)}>
              <img src=${o} alt="" loading="lazy" title=${a} />
            </button>`:c`<kibble-avatar .hass=${this.hass} .name=${null} .colorIndex=${null} .entryId=${this._entryId} .sampleName=${null}></kibble-avatar>`}
        <span class="caption">${e.paired_class==="eat"?"ate \xB7 ":""}${s}</span>
      </div>
    `}_renderSample(e,r,s){let n=this._entryId?N(this._entryId,`sample/${e}`,r.name):null,o=n?this._imageCache.get(this.hass,n,()=>this.requestUpdate()):null,a=new Date(r.ts*1e3).toLocaleString();return c`
      <div class="sample">
        ${o?c`<button type="button" class="sample-photo" aria-label=${`View full size, captured ${a}`} @click=${l=>this._openLightbox(l,o,a)}>
              <img src=${o} alt="" loading="lazy" title=${a} />
            </button>`:h}
        <button type="button" class="remove" aria-label=${`Remove this sample of ${e}`} @click=${()=>this._removeSample(e,r)}>
          ${"\xD7"}
        </button>
        ${s?c`<span class="caption">${s}</span>`:h}
      </div>
    `}_removeSample(e,r){if(r.name.startsWith("upload-")){let n=this._callWS("kibble/faces/delete_sample",{cat:e,name:r.name});if(!n)return;n.then(()=>this._refreshAll()).catch(o=>{this._actionError={message:`Couldn't remove this sample. ${te(o)}`,retry:()=>this._removeSample(e,r)}});return}if(!this._entities.deviceId)return;let s=this._entities.deviceId;this.hass.callService("kibble","unlabel_face",{device_id:s,cat:e,name:r.name}).then(()=>this._refreshAll()).catch(n=>{this._actionError={message:`Couldn't remove this sample. ${te(n)}`,retry:()=>this._removeSample(e,r)}})}_refreshCats(){let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId;this._catsQuery.refresh(()=>e({type:"kibble/cats",entry_id:r}).then(s=>s))}_refreshPending(){let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId;this._pendingQuery.refresh(()=>e({type:"kibble/faces/pending",entry_id:r}).then(s=>s))}_refreshAll(){if(this._refreshCats(),this._refreshPending(),this.hass?.callWS&&this._entryId){let s=this.hass.callWS,n=this._entryId;this._timelineQuery.refresh(()=>s({type:"kibble/timeline",entry_id:n,include_visits:!1}).then(o=>o))}let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId;for(let[s,n]of this._sampleQueries)n.refresh(()=>e({type:"kibble/faces/samples",entry_id:r,cat:s}).then(o=>o))}static{this.styles=y`
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
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
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
      /* These are real photos (224x224 JPEGs), not pixel art -- smooth interpolation reads
       * as a slightly soft photo; "pixelated" would read as a blocky one. Explicit because
       * "auto" is also the browser default, and a future "these look blurry, sharpen them"
       * pass should see this comment before reaching for that value. */
      image-rendering: auto;
    }
    .crop-thumb:focus-visible,
    .sample-photo:focus-visible,
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
      --kibble-avatar-size: 96px;
    }
    .sample-photo {
      display: block;
      width: 100%;
      height: 100%;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
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
      width: 96px;
      height: 96px;
    }
    .sample img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      display: block;
      /* Same reasoning as .crop-thumb img: real photos, smooth upscale, never "pixelated". */
      image-rendering: auto;
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
  `}};customElements.define("kibble-cats-card",Gs);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-cats-card",name:"Kibble Cats",description:"Enrolled cats -- delete or add training photos -- plus a one-tap inbox for the feeder's own face crops.",preview:!0});var Zu={deviceId:"",catPresence:[]},Ju=[1,2,3,4,5],eh=`
  .bubble-button-card-container { background: var(--kibble-amber, #f2a33c) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: var(--kibble-ink-on-amber, #241a07) !important; }
  .bubble-icon-container { background: color-mix(in srgb, var(--kibble-ink-on-amber, #241a07) 12%, transparent) !important; }
`;function th(t,i){return`
  .bubble-button-card-container { height: var(--kibble-touch-target, 48px) !important; ${t?"background: var(--kibble-amber, #f2a33c) !important;":""} ${i?"opacity: 0.5;":""} }
  .bubble-button-card { padding: 0 !important; }
  .bubble-name-container { margin: 0 !important; width: 100%; justify-content: center; }
  .bubble-name { width: 100%; justify-content: center; text-align: center; font-size: 17px; font-weight: 600; ${t?"color: var(--kibble-ink-on-amber, #241a07) !important;":""} }
`}var ih=`
  .bubble-button-card-container { background: var(--error-color, #d9534f) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: #fff !important; }
`,Zs=class extends b{constructor(){super();this._entities=Zu;this._catsQuery=new q(()=>this.requestUpdate());this._calibrationQuery=new q(()=>this.requestUpdate());this._calibrationGeneration=0;this._calibrationOpen=!1;this._onBubbleAction=e=>{let r=e.detail,s=r?.config?.[`${r.action}_action`];s?.action!=="fire-dom-event"||!s.kibble||(e.stopPropagation(),s.kibble==="portion"&&typeof s.portion=="number"&&this._entities.feedAmount?this.hass.callService("number","set_value",{value:s.portion},{entity_id:this._entities.feedAmount}):s.kibble==="feed"?this._onFeedActivate():s.kibble==="cancel"?this._onCancelActivate():s.kibble==="calibrate"&&(this._calibrationOpen=!0))};this._onFeedActivate=()=>{if(!this._entities.deviceId)return;let e=this._numberState(this._entities.feedAmount)??1;this.hass.callService("kibble","feed",{device_id:this._entities.deviceId,hopper:"both",amount:e})};this._onCancelActivate=()=>{this._entities.deviceId&&this.hass.callService("kibble","cancel_feed",{device_id:this._entities.deviceId})};this._openSettings=()=>{let e=this._config?.settings_hash;if(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}));return}this._settingsOpen=!0};this._closeSettings=()=>{this._settingsOpen=!1};this._onHashChange=()=>{let e=this._config?.calibrate_hash??"#calibrate";window.location.hash===e&&(this._calibrationOpen=!0)};this._closeCalibration=e=>{e.stopPropagation(),this._calibrationOpen=!1};this._onCalibrationChanged=()=>{this._calibrationGeneration+=1,this.requestUpdate()};this._settingsOpen=!1,this._bubble=!1,Va().then(e=>{this._bubble=e})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_settingsOpen:{state:!0},_bubble:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-card-editor")}connectedCallback(){super.connectedCallback(),window.addEventListener("hashchange",this._onHashChange),window.addEventListener("location-changed",this._onHashChange),this._onHashChange(),this._resizeObserver=new ResizeObserver(e=>{let r=e[0]?.contentRect,s=r?.height??this.getBoundingClientRect().height,n=r?.width??this.getBoundingClientRect().width;this.classList.toggle("kiosk",s>=440),this.classList.toggle("compact",n<640&&s>0&&s<=520)}),this._resizeObserver.observe(this)}disconnectedCallback(){window.removeEventListener("hashchange",this._onHashChange),window.removeEventListener("location-changed",this._onHashChange),super.disconnectedCallback(),this._resizeObserver?.disconnect()}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=lt(this.hass.entities??{},e),this._entryId=ct(this.hass.devices??{},e));let r=this.hass?.callWS;if(this.hass&&this._entryId&&r&&this._entities.lastSeenPet){let s=this._entryId;this._catsQuery.sync(Ve(this.hass,[this._entities.lastSeenPet]),()=>r({type:"kibble/cats",entry_id:s}).then(n=>n))}if(this.hass&&this._entryId&&r&&this._entities.bowlFill){let s=this._entryId;this._calibrationQuery.sync(`${s}:${this._calibrationGeneration}`,()=>r({type:"kibble/calibration",entry_id:s}).then(n=>n))}}render(){if(!this._config||!this.hass)return h;let e=this._entities,r=e.feeding?this.hass.states[e.feeding]?.state:void 0,n=[e.feeding,e.bowlFill,e.schedule].filter(x=>!!x).map(x=>this.hass.states[x]?.state),o=Sn(n,r),a=r==="on",l=this._numberState(e.bowlFill),p=Hn(this._calibrationQuery.state.data),u=mr(e.hopperLevel1&&this.hass.states[e.hopperLevel1]?.state),d=mr(e.hopperLevel2&&this.hass.states[e.hopperLevel2]?.state),f=this._scheduleEntries(),m=this._numberState(e.feedAmount)??1,g=this._heroOverlay(o);return c`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">
                <kibble-live-hero
                  .hass=${this.hass}
                  .cameraEntity=${e.camera}
                  .scryptedId=${this._config.scrypted_id}
                  .entryId=${this._entryId}
                  .overlayEntity=${e.detectionOverlaySwitch}
                ></kibble-live-hero>
              </div>
              <div class="hero-status">
                <span class="live-dot" ?hidden=${!g.live}></span>
                ${g.catName?c`<kibble-avatar
                      .hass=${this.hass}
                      .name=${g.catName}
                      .colorIndex=${g.colorIndex}
                      .entryId=${this._entryId}
                      .sampleName=${g.avatarSample}
                    ></kibble-avatar>`:h}
                <span class="hero-status-text" data-tone=${g.tone}>${g.text}</span>
              </div>
              <button class="gear-button" aria-label="Settings" @click=${this._openSettings}>${H("cog")}</button>
              ${this._config.name?c`<div class="name-chip">${this._config.name}</div>`:h}
            </div>
            <div class="side">
            <kibble-bowl
              class="bowl-block"
              .fill=${l}
              .calibration=${p}
              .hopperLevel1=${u}
              .hopperLevel2=${d}
              .feeding=${a}
            ></kibble-bowl>
            <div class="feed-controls" @hass-action=${this._onBubbleAction}>
              ${this._bubble?c`<div class="portions">
                      ${this._portionConfigs(m,o==="unreachable"||a).map(x=>c`<kibble-bubble-row .hass=${this.hass} .config=${x}></kibble-bubble-row>`)}
                    </div>
                    <kibble-bubble-row .hass=${this.hass} .config=${this._feedRowConfig(a,o==="unreachable")}></kibble-bubble-row>`:c`<kibble-segmented-picker
                      class="picker-full"
                      .value=${m}
                      ?disabled=${o==="unreachable"||a}
                      @portion-selected=${this._onPortionSelected}
                    ></kibble-segmented-picker>
                    <kibble-stepper
                      class="picker-compact"
                      .value=${m}
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
            ${this._config.schedule_hash?h:c`<kibble-schedule-summary
                  class="schedule-row"
                  .hass=${this.hass}
                  .entries=${f}
                  .scheduleCardStateEntity=${e.scheduleCardState}
                ></kibble-schedule-summary>`}
            </div>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog
        .hass=${this.hass}
        .entities=${e}
        .entryId=${this._entryId}
        ?open=${this._settingsOpen}
        @close-requested=${this._closeSettings}
        @calibration-changed=${this._onCalibrationChanged}
      ></kibble-settings-dialog>
      <kibble-calibration-dialog
        .hass=${this.hass}
        .entryId=${this._entryId}
        ?open=${this._calibrationOpen}
        @close-requested=${this._closeCalibration}
        @calibration-changed=${this._onCalibrationChanged}
      ></kibble-calibration-dialog>
    `}_numberState(e){if(!e)return null;let r=Number(this.hass.states[e]?.state);return Number.isFinite(r)?r:null}_heroOverlay(e){let r=this._entities.camera,s=r?this.hass.states[r]:void 0,n=s!==void 0&&s.state!=="unavailable";if(e==="unreachable")return{text:fr(e,null),tone:"error",live:n,catName:null,colorIndex:null,avatarSample:null};if(e==="dispensing")return{text:fr(e,null),tone:"amber",live:n,catName:null,colorIndex:null,avatarSample:null};let o=this._catSeen(),a=this._entities.eating,l=a!==void 0&&this.hass.states[a]?.state==="on";if(!o)return{text:l?"Eating now":"Ready to feed",tone:"normal",live:n,catName:null,colorIndex:null,avatarSample:null};let p=this._catsQuery.state.data?.cats.find(u=>u.name===o.name)??null;return{text:l?`${o.name} is eating`:`${o.name} seen ${o.relative}`,tone:"normal",live:n,catName:o.name,colorIndex:p?.color_index??null,avatarSample:p?.avatar??null}}_catSeen(){let e=this._entities.lastSeenPet,r=e?this.hass.states[e]:void 0;if(!r||r.state==="unavailable"||r.state.toLowerCase()==="unknown")return null;let s=r.attributes?.last_identified,n=typeof s=="string"?new Date(s):new Date(r.last_changed),o=Number.isNaN(n.getTime())?new Date(r.last_changed):n;return{name:r.state,relative:Pe(o,new Date)}}_scheduleEntries(){let e=this._entities.schedule;if(!e)return[];let s=this.hass.states[e]?.attributes?.entries;return Array.isArray(s)?s:[]}_portionConfigs(e,r){let s={action:"none"};return Ju.map(n=>{let o={tap_action:r?s:{action:"fire-dom-event",kibble:"portion",portion:n},double_tap_action:s,hold_action:s};return{card_type:"button",button_type:"name",name:String(n),show_icon:!1,show_state:!1,styles:th(n===e,r),...o,button_action:o}})}_feedRowConfig(e,r){let s={action:"none"},n={tap_action:e&&!r?{action:"fire-dom-event",kibble:"cancel"}:s,double_tap_action:s,hold_action:!e&&!r?{action:"fire-dom-event",kibble:"feed"}:s};return{card_type:"button",button_type:"name",name:r?"Feeder unreachable":e?"Feeding\u2026 tap to cancel":"Hold to feed",icon:e?"mdi:stop-circle-outline":"mdi:bowl-mix",styles:e?ih:eh,...n,button_action:n}}_onPortionSelected(e){this._entities.feedAmount&&this.hass.callService("number","set_value",{value:e.detail.value},{entity_id:this._entities.feedAmount})}static{this.styles=y`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${He(En)};
      --kibble-amber-dark: ${He(Tn)};
      --kibble-ink-on-amber: ${He(Pn)};
      --kibble-live: ${He(An)};
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
    /* On a phone the stacked layout gave the bowl its full 300 px, measured at ~170 px tall
       on a 390x844 screen -- a fifth of the viewport for an illustration, which pushed
       "Hold to feed" (the only thing anyone opens this card in a hurry for) to the fold.
       Scaled to the viewport instead, so the controls stay reachable without scrolling. */
    @container (max-width: 480px) {
      .bowl-block {
        --kibble-bowl-max-width: min(220px, 42vw);
        padding-top: 4px;
      }
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
  `}};customElements.define("kibble-card",Zs);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-card",name:"Kibble",description:"The full daily control surface for a Kibble Petkit feeder: live camera, who's been by, feed, and schedule.",preview:!0});export{Zs as KibbleCard};
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
