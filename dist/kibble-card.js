var ya=Object.create;var Zt=Object.defineProperty;var xa=Object.getOwnPropertyDescriptor;var Ca=Object.getOwnPropertyNames;var wa=Object.getPrototypeOf,ka=Object.prototype.hasOwnProperty;var Sa=(i,t)=>()=>(i&&(t=i(i=0)),t);var _=(i,t)=>()=>(t||i((t={exports:{}}).exports,t),t.exports),Ea=(i,t)=>{for(var e in t)Zt(i,e,{get:t[e],enumerable:!0})},Ns=(i,t,e,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Ca(t))!ka.call(i,s)&&s!==e&&Zt(i,s,{get:()=>t[s],enumerable:!(r=xa(t,s))||r.enumerable});return i};var Pa=(i,t,e)=>(e=i!=null?ya(wa(i)):{},Ns(t||!i||!i.__esModule?Zt(e,"default",{value:i,enumerable:!0}):e,i)),et=i=>Ns(Zt({},"__esModule",{value:!0}),i);var bi=_(Ee=>{"use strict";Object.defineProperty(Ee,"__esModule",{value:!0});Ee.ERROR_PACKET=Ee.PACKET_TYPES_REVERSE=Ee.PACKET_TYPES=void 0;var ae=Object.create(null);Ee.PACKET_TYPES=ae;ae.open="0";ae.close="1";ae.ping="2";ae.pong="3";ae.message="4";ae.upgrade="5";ae.noop="6";var _n=Object.create(null);Ee.PACKET_TYPES_REVERSE=_n;Object.keys(ae).forEach(i=>{_n[ae[i]]=i});var ll={type:"error",data:"parser error"};Ee.ERROR_PACKET=ll});var Sn=_(At=>{"use strict";Object.defineProperty(At,"__esModule",{value:!0});At.encodePacket=void 0;At.encodePacketToBinary=dl;var cl=bi(),xn=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Cn=typeof ArrayBuffer=="function",wn=i=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(i):i&&i.buffer instanceof ArrayBuffer,kn=({type:i,data:t},e,r)=>xn&&t instanceof Blob?e?r(t):vn(t,r):Cn&&(t instanceof ArrayBuffer||wn(t))?e?r(t):vn(new Blob([t]),r):r(cl.PACKET_TYPES[i]+(t||""));At.encodePacket=kn;var vn=(i,t)=>{let e=new FileReader;return e.onload=function(){let r=e.result.split(",")[1];t("b"+(r||""))},e.readAsDataURL(i)};function yn(i){return i instanceof Uint8Array?i:i instanceof ArrayBuffer?new Uint8Array(i):new Uint8Array(i.buffer,i.byteOffset,i.byteLength)}var xr;function dl(i,t){if(xn&&i.data instanceof Blob)return i.data.arrayBuffer().then(yn).then(t);if(Cn&&(i.data instanceof ArrayBuffer||wn(i.data)))return t(yn(i.data));kn(i,!1,e=>{xr||(xr=new TextEncoder),t(xr.encode(e))})}});var En=_(at=>{"use strict";Object.defineProperty(at,"__esModule",{value:!0});at.decode=at.encode=void 0;var ot="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Rt=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let i=0;i<ot.length;i++)Rt[ot.charCodeAt(i)]=i;var ul=i=>{let t=new Uint8Array(i),e,r=t.length,s="";for(e=0;e<r;e+=3)s+=ot[t[e]>>2],s+=ot[(t[e]&3)<<4|t[e+1]>>4],s+=ot[(t[e+1]&15)<<2|t[e+2]>>6],s+=ot[t[e+2]&63];return r%3===2?s=s.substring(0,s.length-1)+"=":r%3===1&&(s=s.substring(0,s.length-2)+"=="),s};at.encode=ul;var hl=i=>{let t=i.length*.75,e=i.length,r,s=0,n,o,a,c;i[i.length-1]==="="&&(t--,i[i.length-2]==="="&&t--);let f=new ArrayBuffer(t),d=new Uint8Array(f);for(r=0;r<e;r+=4)n=Rt[i.charCodeAt(r)],o=Rt[i.charCodeAt(r+1)],a=Rt[i.charCodeAt(r+2)],c=Rt[i.charCodeAt(r+3)],d[s++]=n<<2|o>>4,d[s++]=(o&15)<<4|a>>2,d[s++]=(a&3)<<6|c&63;return f};at.decode=hl});var $n=_(vi=>{"use strict";Object.defineProperty(vi,"__esModule",{value:!0});vi.decodePacket=void 0;var _i=bi(),pl=En(),ml=typeof ArrayBuffer=="function",fl=(i,t)=>{if(typeof i!="string")return{type:"message",data:Pn(i,t)};let e=i.charAt(0);return e==="b"?{type:"message",data:gl(i.substring(1),t)}:_i.PACKET_TYPES_REVERSE[e]?i.length>1?{type:_i.PACKET_TYPES_REVERSE[e],data:i.substring(1)}:{type:_i.PACKET_TYPES_REVERSE[e]}:_i.ERROR_PACKET};vi.decodePacket=fl;var gl=(i,t)=>{if(ml){let e=(0,pl.decode)(i);return Pn(e,t)}else return{base64:!0,data:i}},Pn=(i,t)=>{switch(t){case"blob":return i instanceof Blob?i:new Blob([i]);case"arraybuffer":default:return i instanceof ArrayBuffer?i:i.buffer}}});var lt=_(K=>{"use strict";Object.defineProperty(K,"__esModule",{value:!0});K.decodePayload=K.decodePacket=K.encodePayload=K.encodePacket=K.protocol=void 0;K.createPacketEncoderStream=vl;K.createPacketDecoderStream=yl;var wr=Sn();Object.defineProperty(K,"encodePacket",{enumerable:!0,get:function(){return wr.encodePacket}});var kr=$n();Object.defineProperty(K,"decodePacket",{enumerable:!0,get:function(){return kr.decodePacket}});var Tn=bi(),An="",bl=(i,t)=>{let e=i.length,r=new Array(e),s=0;i.forEach((n,o)=>{(0,wr.encodePacket)(n,!1,a=>{r[o]=a,++s===e&&t(r.join(An))})})};K.encodePayload=bl;var _l=(i,t)=>{let e=i.split(An),r=[];for(let s=0;s<e.length;s++){let n=(0,kr.decodePacket)(e[s],t);if(r.push(n),n.type==="error")break}return r};K.decodePayload=_l;function vl(){return new TransformStream({transform(i,t){(0,wr.encodePacketToBinary)(i,e=>{let r=e.length,s;if(r<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,r);else if(r<65536){s=new Uint8Array(3);let n=new DataView(s.buffer);n.setUint8(0,126),n.setUint16(1,r)}else{s=new Uint8Array(9);let n=new DataView(s.buffer);n.setUint8(0,127),n.setBigUint64(1,BigInt(r))}i.data&&typeof i.data!="string"&&(s[0]|=128),t.enqueue(s),t.enqueue(e)})}})}var Cr;function yi(i){return i.reduce((t,e)=>t+e.length,0)}function xi(i,t){if(i[0].length===t)return i.shift();let e=new Uint8Array(t),r=0;for(let s=0;s<t;s++)e[s]=i[0][r++],r===i[0].length&&(i.shift(),r=0);return i.length&&r<i[0].length&&(i[0]=i[0].slice(r)),e}function yl(i,t){Cr||(Cr=new TextDecoder);let e=[],r=0,s=-1,n=!1;return new TransformStream({transform(o,a){for(e.push(o);;){if(r===0){if(yi(e)<1)break;let c=xi(e,1);n=(c[0]&128)===128,s=c[0]&127,s<126?r=3:s===126?r=1:r=2}else if(r===1){if(yi(e)<2)break;let c=xi(e,2);s=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),r=3}else if(r===2){if(yi(e)<8)break;let c=xi(e,8),f=new DataView(c.buffer,c.byteOffset,c.length),d=f.getUint32(0);if(d>Math.pow(2,21)-1){a.enqueue(Tn.ERROR_PACKET);break}s=d*Math.pow(2,32)+f.getUint32(4),r=3}else{if(yi(e)<s)break;let c=xi(e,s);a.enqueue((0,kr.decodePacket)(n?c:Cr.decode(c),t)),r=0}if(s===0||s>i){a.enqueue(Tn.ERROR_PACKET);break}}}})}K.protocol=4});var Ci=_(Rn=>{Rn.Emitter=U;function U(i){if(i)return xl(i)}function xl(i){for(var t in U.prototype)i[t]=U.prototype[t];return i}U.prototype.on=U.prototype.addEventListener=function(i,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+i]=this._callbacks["$"+i]||[]).push(t),this};U.prototype.once=function(i,t){function e(){this.off(i,e),t.apply(this,arguments)}return e.fn=t,this.on(i,e),this};U.prototype.off=U.prototype.removeListener=U.prototype.removeAllListeners=U.prototype.removeEventListener=function(i,t){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var e=this._callbacks["$"+i];if(!e)return this;if(arguments.length==1)return delete this._callbacks["$"+i],this;for(var r,s=0;s<e.length;s++)if(r=e[s],r===t||r.fn===t){e.splice(s,1);break}return e.length===0&&delete this._callbacks["$"+i],this};U.prototype.emit=function(i){this._callbacks=this._callbacks||{};for(var t=new Array(arguments.length-1),e=this._callbacks["$"+i],r=1;r<arguments.length;r++)t[r-1]=arguments[r];if(e){e=e.slice(0);for(var r=0,s=e.length;r<s;++r)e[r].apply(this,t)}return this};U.prototype.emitReserved=U.prototype.emit;U.prototype.listeners=function(i){return this._callbacks=this._callbacks||{},this._callbacks["$"+i]||[]};U.prototype.hasListeners=function(i){return!!this.listeners(i).length}});var ze=_(_e=>{"use strict";Object.defineProperty(_e,"__esModule",{value:!0});_e.defaultBinaryType=_e.globalThisShim=_e.nextTick=void 0;_e.createCookieJar=Cl;_e.nextTick=typeof Promise=="function"&&typeof Promise.resolve=="function"?t=>Promise.resolve().then(t):(t,e)=>e(t,0);_e.globalThisShim=typeof self<"u"?self:typeof window<"u"?window:Function("return this")();_e.defaultBinaryType="arraybuffer";function Cl(){}});var je=_(ct=>{"use strict";Object.defineProperty(ct,"__esModule",{value:!0});ct.pick=wl;ct.installTimerFunctions=El;ct.byteLength=$l;ct.randomString=Al;var Pe=ze();function wl(i,...t){return t.reduce((e,r)=>(i.hasOwnProperty(r)&&(e[r]=i[r]),e),{})}var kl=Pe.globalThisShim.setTimeout,Sl=Pe.globalThisShim.clearTimeout;function El(i,t){t.useNativeTimers?(i.setTimeoutFn=kl.bind(Pe.globalThisShim),i.clearTimeoutFn=Sl.bind(Pe.globalThisShim)):(i.setTimeoutFn=Pe.globalThisShim.setTimeout.bind(Pe.globalThisShim),i.clearTimeoutFn=Pe.globalThisShim.clearTimeout.bind(Pe.globalThisShim))}var Pl=1.33;function $l(i){return typeof i=="string"?Tl(i):Math.ceil((i.byteLength||i.size)*Pl)}function Tl(i){let t=0,e=0;for(let r=0,s=i.length;r<s;r++)t=i.charCodeAt(r),t<128?e+=1:t<2048?e+=2:t<55296||t>=57344?e+=3:(r++,e+=4);return e}function Al(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}});var Sr=_(wi=>{"use strict";Object.defineProperty(wi,"__esModule",{value:!0});wi.encode=Rl;wi.decode=Ol;function Rl(i){let t="";for(let e in i)i.hasOwnProperty(e)&&(t.length&&(t+="&"),t+=encodeURIComponent(e)+"="+encodeURIComponent(i[e]));return t}function Ol(i){let t={},e=i.split("&");for(let r=0,s=e.length;r<s;r++){let n=e[r].split("=");t[decodeURIComponent(n[0])]=decodeURIComponent(n[1])}return t}});var Mn=_((Oh,On)=>{var dt=1e3,ut=dt*60,ht=ut*60,Ue=ht*24,Ml=Ue*7,Ll=Ue*365.25;On.exports=function(i,t){t=t||{};var e=typeof i;if(e==="string"&&i.length>0)return Dl(i);if(e==="number"&&isFinite(i))return t.long?Il(i):Hl(i);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(i))};function Dl(i){if(i=String(i),!(i.length>100)){var t=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(i);if(t){var e=parseFloat(t[1]),r=(t[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return e*Ll;case"weeks":case"week":case"w":return e*Ml;case"days":case"day":case"d":return e*Ue;case"hours":case"hour":case"hrs":case"hr":case"h":return e*ht;case"minutes":case"minute":case"mins":case"min":case"m":return e*ut;case"seconds":case"second":case"secs":case"sec":case"s":return e*dt;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return e;default:return}}}}function Hl(i){var t=Math.abs(i);return t>=Ue?Math.round(i/Ue)+"d":t>=ht?Math.round(i/ht)+"h":t>=ut?Math.round(i/ut)+"m":t>=dt?Math.round(i/dt)+"s":i+"ms"}function Il(i){var t=Math.abs(i);return t>=Ue?ki(i,t,Ue,"day"):t>=ht?ki(i,t,ht,"hour"):t>=ut?ki(i,t,ut,"minute"):t>=dt?ki(i,t,dt,"second"):i+" ms"}function ki(i,t,e,r){var s=t>=e*1.5;return Math.round(i/e)+" "+r+(s?"s":"")}});var Dn=_((Mh,Ln)=>{function Nl(i){e.debug=e,e.default=e,e.coerce=c,e.disable=o,e.enable=s,e.enabled=a,e.humanize=Mn(),e.destroy=f,Object.keys(i).forEach(d=>{e[d]=i[d]}),e.names=[],e.skips=[],e.formatters={};function t(d){let l=0;for(let u=0;u<d.length;u++)l=(l<<5)-l+d.charCodeAt(u),l|=0;return e.colors[Math.abs(l)%e.colors.length]}e.selectColor=t;function e(d){let l,u=null,m,g;function k(...y){if(!k.enabled)return;let R=k,N=Number(new Date),V=N-(l||N);R.diff=V,R.prev=l,R.curr=N,l=N,y[0]=e.coerce(y[0]),typeof y[0]!="string"&&y.unshift("%O");let D=0;y[0]=y[0].replace(/%([a-zA-Z%])/g,(he,x)=>{if(he==="%%")return"%";D++;let T=e.formatters[x];if(typeof T=="function"){let H=y[D];he=T.call(R,H),y.splice(D,1),D--}return he}),e.formatArgs.call(R,y),(R.log||e.log).apply(R,y)}return k.namespace=d,k.useColors=e.useColors(),k.color=e.selectColor(d),k.extend=r,k.destroy=e.destroy,Object.defineProperty(k,"enabled",{enumerable:!0,configurable:!1,get:()=>u!==null?u:(m!==e.namespaces&&(m=e.namespaces,g=e.enabled(d)),g),set:y=>{u=y}}),typeof e.init=="function"&&e.init(k),k}function r(d,l){let u=e(this.namespace+(typeof l>"u"?":":l)+d);return u.log=this.log,u}function s(d){e.save(d),e.namespaces=d,e.names=[],e.skips=[];let l=(typeof d=="string"?d:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let u of l)u[0]==="-"?e.skips.push(u.slice(1)):e.names.push(u)}function n(d,l){let u=0,m=0,g=-1,k=0;for(;u<d.length;)if(m<l.length&&(l[m]===d[u]||l[m]==="*"))l[m]==="*"?(g=m,k=u,m++):(u++,m++);else if(g!==-1)m=g+1,k++,u=k;else return!1;for(;m<l.length&&l[m]==="*";)m++;return m===l.length}function o(){let d=[...e.names,...e.skips.map(l=>"-"+l)].join(",");return e.enable(""),d}function a(d){for(let l of e.skips)if(n(d,l))return!1;for(let l of e.names)if(n(d,l))return!0;return!1}function c(d){return d instanceof Error?d.stack||d.message:d}function f(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return e.enable(e.load()),e}Ln.exports=Nl});var qe=_((W,Si)=>{W.formatArgs=Bl;W.save=zl;W.load=jl;W.useColors=Fl;W.storage=Ul();W.destroy=(()=>{let i=!1;return()=>{i||(i=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();W.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function Fl(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let i;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(i=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(i[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function Bl(i){if(i[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+i[0]+(this.useColors?"%c ":" ")+"+"+Si.exports.humanize(this.diff),!this.useColors)return;let t="color: "+this.color;i.splice(1,0,t,"color: inherit");let e=0,r=0;i[0].replace(/%[a-zA-Z%]/g,s=>{s!=="%%"&&(e++,s==="%c"&&(r=e))}),i.splice(r,0,t)}W.log=console.debug||console.log||(()=>{});function zl(i){try{i?W.storage.setItem("debug",i):W.storage.removeItem("debug")}catch{}}function jl(){let i;try{i=W.storage.getItem("debug")||W.storage.getItem("DEBUG")}catch{}return!i&&typeof process<"u"&&"env"in process&&(i=process.env.DEBUG),i}function Ul(){try{return localStorage}catch{}}Si.exports=Dn()(W);var{formatters:ql}=Si.exports;ql.j=function(i){try{return JSON.stringify(i)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}});var Ot=_($e=>{"use strict";var Vl=$e&&$e.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty($e,"__esModule",{value:!0});$e.Transport=$e.TransportError=void 0;var Kl=lt(),Wl=Ci(),Yl=je(),Xl=Sr(),Gl=Vl(qe()),Ql=(0,Gl.default)("engine.io-client:transport"),Ei=class extends Error{constructor(t,e,r){super(t),this.description=e,this.context=r,this.type="TransportError"}};$e.TransportError=Ei;var Er=class extends Wl.Emitter{constructor(t){super(),this.writable=!1,(0,Yl.installTimerFunctions)(this,t),this.opts=t,this.query=t.query,this.socket=t.socket,this.supportsBinary=!t.forceBase64}onError(t,e,r){return super.emitReserved("error",new Ei(t,e,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(t){this.readyState==="open"?this.write(t):Ql("transport is not open, discarding packets")}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(t){let e=(0,Kl.decodePacket)(t,this.socket.binaryType);this.onPacket(e)}onPacket(t){super.emitReserved("packet",t)}onClose(t){this.readyState="closed",super.emitReserved("close",t)}pause(t){}createUri(t,e={}){return t+"://"+this._hostname()+this._port()+this.opts.path+this._query(e)}_hostname(){let t=this.opts.hostname;return t.indexOf(":")===-1?t:"["+t+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(t){let e=(0,Xl.encode)(t);return e.length?"?"+e:""}};$e.Transport=Er});var $r=_(pt=>{"use strict";var Jl=pt&&pt.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(pt,"__esModule",{value:!0});pt.Polling=void 0;var Zl=Ot(),ec=je(),Hn=lt(),tc=Jl(qe()),Z=(0,tc.default)("engine.io-client:polling"),Pr=class extends Zl.Transport{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(t){this.readyState="pausing";let e=()=>{Z("paused"),this.readyState="paused",t()};if(this._polling||!this.writable){let r=0;this._polling&&(Z("we are currently polling - waiting to pause"),r++,this.once("pollComplete",function(){Z("pre-pause polling complete"),--r||e()})),this.writable||(Z("we are currently writing - waiting to pause"),r++,this.once("drain",function(){Z("pre-pause writing complete"),--r||e()}))}else e()}_poll(){Z("polling"),this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(t){Z("polling got data %s",t);let e=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};(0,Hn.decodePayload)(t,this.socket.binaryType).forEach(e),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"?this._poll():Z('ignoring poll - transport state "%s"',this.readyState))}doClose(){let t=()=>{Z("writing close packet"),this.write([{type:"close"}])};this.readyState==="open"?(Z("transport open - closing"),t()):(Z("transport not open - deferring close"),this.once("open",t))}write(t){this.writable=!1,(0,Hn.encodePayload)(t,e=>{this.doWrite(e,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){let t=this.opts.secure?"https":"http",e=this.query||{};return this.opts.timestampRequests!==!1&&(e[this.opts.timestampParam]=(0,ec.randomString)()),!this.supportsBinary&&!e.sid&&(e.b64=1),this.createUri(t,e)}};pt.Polling=Pr});var Nn=_(Pi=>{"use strict";Object.defineProperty(Pi,"__esModule",{value:!0});Pi.hasCORS=void 0;var In=!1;try{In=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}Pi.hasCORS=In});var Ti=_(le=>{"use strict";var ic=le&&le.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(le,"__esModule",{value:!0});le.XHR=le.Request=le.BaseXHR=void 0;var rc=$r(),sc=Ci(),Fn=je(),zn=ze(),nc=Nn(),oc=ic(qe()),Tr=(0,oc.default)("engine.io-client:polling");function ac(){}var $i=class extends rc.Polling{constructor(t){if(super(t),typeof location<"u"){let e=location.protocol==="https:",r=location.port;r||(r=e?"443":"80"),this.xd=typeof location<"u"&&t.hostname!==location.hostname||r!==t.port}}doWrite(t,e){let r=this.request({method:"POST",data:t});r.on("success",e),r.on("error",(s,n)=>{this.onError("xhr post error",s,n)})}doPoll(){Tr("xhr poll");let t=this.request();t.on("data",this.onData.bind(this)),t.on("error",(e,r)=>{this.onError("xhr poll error",e,r)}),this.pollXhr=t}};le.BaseXHR=$i;var ve=class i extends sc.Emitter{constructor(t,e,r){super(),this.createRequest=t,(0,Fn.installTimerFunctions)(this,r),this._opts=r,this._method=r.method||"GET",this._uri=e,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var t;let e=(0,Fn.pick)(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");e.xdomain=!!this._opts.xd;let r=this._xhr=this.createRequest(e);try{Tr("xhr open %s: %s",this._method,this._uri),r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&r.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(t=this._opts.cookieJar)===null||t===void 0||t.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var s;r.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},Tr("xhr data %s",this._data),r.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=i.requestsCount++,i.requests[this._index]=this)}_onError(t){this.emitReserved("error",t,this._xhr),this._cleanup(!0)}_cleanup(t){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=ac,t)try{this._xhr.abort()}catch{}typeof document<"u"&&delete i.requests[this._index],this._xhr=null}}_onLoad(){let t=this._xhr.responseText;t!==null&&(this.emitReserved("data",t),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};le.Request=ve;ve.requestsCount=0;ve.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Bn);else if(typeof addEventListener=="function"){let i="onpagehide"in zn.globalThisShim?"pagehide":"unload";addEventListener(i,Bn,!1)}}function Bn(){for(let i in ve.requests)ve.requests.hasOwnProperty(i)&&ve.requests[i].abort()}var lc=function(){let i=jn({xdomain:!1});return i&&i.responseType!==null}(),Ar=class extends $i{constructor(t){super(t);let e=t&&t.forceBase64;this.supportsBinary=lc&&!e}request(t={}){return Object.assign(t,{xd:this.xd},this.opts),new ve(jn,this.uri(),t)}};le.XHR=Ar;function jn(i){let t=i.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!t||nc.hasCORS))return new XMLHttpRequest}catch{}if(!t)try{return new zn.globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}});var Ri=_(Te=>{"use strict";var cc=Te&&Te.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(Te,"__esModule",{value:!0});Te.WS=Te.BaseWS=void 0;var dc=Ot(),Un=je(),uc=lt(),Or=ze(),hc=cc(qe()),pc=(0,hc.default)("engine.io-client:websocket"),qn=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative",Ai=class extends dc.Transport{get name(){return"websocket"}doOpen(){let t=this.uri(),e=this.opts.protocols,r=qn?{}:(0,Un.pick)(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(t,e,r)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=t=>this.onClose({description:"websocket connection closed",context:t}),this.ws.onmessage=t=>this.onData(t.data),this.ws.onerror=t=>this.onError("websocket error",t)}write(t){this.writable=!1;for(let e=0;e<t.length;e++){let r=t[e],s=e===t.length-1;(0,uc.encodePacket)(r,this.supportsBinary,n=>{try{this.doWrite(r,n)}catch{pc("websocket closed before onclose event")}s&&(0,Or.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){let t=this.opts.secure?"wss":"ws",e=this.query||{};return this.opts.timestampRequests&&(e[this.opts.timestampParam]=(0,Un.randomString)()),this.supportsBinary||(e.b64=1),this.createUri(t,e)}};Te.BaseWS=Ai;var Rr=Or.globalThisShim.WebSocket||Or.globalThisShim.MozWebSocket,Mr=class extends Ai{createSocket(t,e,r){return qn?new Rr(t,e,r):e?new Rr(t,e):new Rr(t)}doWrite(t,e){this.ws.send(e)}};Te.WS=Mr});var Dr=_(mt=>{"use strict";var mc=mt&&mt.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(mt,"__esModule",{value:!0});mt.WT=void 0;var fc=Ot(),gc=ze(),Vn=lt(),bc=mc(qe()),Mt=(0,bc.default)("engine.io-client:webtransport"),Lr=class extends fc.Transport{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(t){return this.emitReserved("error",t)}this._transport.closed.then(()=>{Mt("transport closed gracefully"),this.onClose()}).catch(t=>{Mt("transport closed due to %s",t),this.onError("webtransport error",t)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(t=>{let e=(0,Vn.createPacketDecoderStream)(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=t.readable.pipeThrough(e).getReader(),s=(0,Vn.createPacketEncoderStream)();s.readable.pipeTo(t.writable),this._writer=s.writable.getWriter();let n=()=>{r.read().then(({done:a,value:c})=>{if(a){Mt("session is closed");return}Mt("received chunk: %o",c),this.onPacket(c),n()}).catch(a=>{Mt("an error occurred while reading: %s",a)})};n();let o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(t){this.writable=!1;for(let e=0;e<t.length;e++){let r=t[e],s=e===t.length-1;this._writer.write(r).then(()=>{s&&(0,gc.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var t;(t=this._transport)===null||t===void 0||t.close()}};mt.WT=Lr});var Hr=_(Oi=>{"use strict";Object.defineProperty(Oi,"__esModule",{value:!0});Oi.transports=void 0;var _c=Ti(),vc=Ri(),yc=Dr();Oi.transports={websocket:vc.WS,webtransport:yc.WT,polling:_c.XHR}});var Nr=_(Ir=>{"use strict";Object.defineProperty(Ir,"__esModule",{value:!0});Ir.parse=wc;var xc=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Cc=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function wc(i){if(i.length>8e3)throw"URI too long";let t=i,e=i.indexOf("["),r=i.indexOf("]");e!=-1&&r!=-1&&(i=i.substring(0,e)+i.substring(e,r).replace(/:/g,";")+i.substring(r,i.length));let s=xc.exec(i||""),n={},o=14;for(;o--;)n[Cc[o]]=s[o]||"";return e!=-1&&r!=-1&&(n.source=t,n.host=n.host.substring(1,n.host.length-1).replace(/;/g,":"),n.authority=n.authority.replace("[","").replace("]","").replace(/;/g,":"),n.ipv6uri=!0),n.pathNames=kc(n,n.path),n.queryKey=Sc(n,n.query),n}function kc(i,t){let e=/\/{2,9}/g,r=t.replace(e,"/").split("/");return(t.slice(0,1)=="/"||t.length===0)&&r.splice(0,1),t.slice(-1)=="/"&&r.splice(r.length-1,1),r}function Sc(i,t){let e={};return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,s,n){s&&(e[s]=n)}),e}});var jr=_(ce=>{"use strict";var Ec=ce&&ce.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(ce,"__esModule",{value:!0});ce.Socket=ce.SocketWithUpgrade=ce.SocketWithoutUpgrade=void 0;var Pc=Hr(),Kn=je(),$c=Sr(),Wn=Nr(),Tc=Ci(),Yn=lt(),Fr=ze(),Ac=Ec(qe()),E=(0,Ac.default)("engine.io-client:socket"),Br=typeof addEventListener=="function"&&typeof removeEventListener=="function",Lt=[];Br&&addEventListener("offline",()=>{E("closing %d connection(s) because the network was lost",Lt.length),Lt.forEach(i=>i())},!1);var Ve=class i extends Tc.Emitter{constructor(t,e){if(super(),this.binaryType=Fr.defaultBinaryType,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,t&&typeof t=="object"&&(e=t,t=null),t){let r=(0,Wn.parse)(t);e.hostname=r.host,e.secure=r.protocol==="https"||r.protocol==="wss",e.port=r.port,r.query&&(e.query=r.query)}else e.host&&(e.hostname=(0,Wn.parse)(e.host).host);(0,Kn.installTimerFunctions)(this,e),this.secure=e.secure!=null?e.secure:typeof location<"u"&&location.protocol==="https:",e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.hostname=e.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=e.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},e.transports.forEach(r=>{let s=r.prototype.name;this.transports.push(s),this._transportsByName[s]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},e),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=(0,$c.decode)(this.opts.query)),Br&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(E("adding listener for the 'offline' event"),this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Lt.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=(0,Fr.createCookieJar)()),this._open()}createTransport(t){E('creating transport "%s"',t);let e=Object.assign({},this.opts.query);e.EIO=Yn.protocol,e.transport=t,this.id&&(e.sid=this.id);let r=Object.assign({},this.opts,{query:e,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[t]);return E("options: %j",r),new this._transportsByName[t](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}let t=this.opts.rememberUpgrade&&i.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";let e=this.createTransport(t);e.open(),this.setTransport(e)}setTransport(t){E("setting transport %s",t.name),this.transport&&(E("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",e=>this._onClose("transport close",e))}onOpen(){E("socket open"),this.readyState="open",i.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(E('socket receive: type "%s", data "%s"',t.type,t.data),this.emitReserved("packet",t),this.emitReserved("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":let e=new Error("server error");e.code=t.data,this._onError(e);break;case"message":this.emitReserved("data",t.data),this.emitReserved("message",t.data);break}else E('packet received with socket readyState "%s"',this.readyState)}onHandshake(t){this.emitReserved("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this._pingInterval=t.pingInterval,this._pingTimeout=t.pingTimeout,this._maxPayload=t.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);let t=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+t,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},t),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){let t=this._getWritablePackets();E("flushing %d packets in socket",t.length),this.transport.send(t),this._prevBufferLen=t.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let e=1;for(let r=0;r<this.writeBuffer.length;r++){let s=this.writeBuffer[r].data;if(s&&(e+=(0,Kn.byteLength)(s)),r>0&&e>this._maxPayload)return E("only send %d out of %d packets",r,this.writeBuffer.length),this.writeBuffer.slice(0,r);e+=2}return E("payload size is %d (max: %d)",e,this._maxPayload),this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;let t=Date.now()>this._pingTimeoutTime;return t&&(E("throttled timer detected, scheduling connection close"),this._pingTimeoutTime=0,(0,Fr.nextTick)(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),t}write(t,e,r){return this._sendPacket("message",t,e,r),this}send(t,e,r){return this._sendPacket("message",t,e,r),this}_sendPacket(t,e,r,s){if(typeof e=="function"&&(s=e,e=void 0),typeof r=="function"&&(s=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;let n={type:t,data:e,options:r};this.emitReserved("packetCreate",n),this.writeBuffer.push(n),s&&this.once("flush",s),this.flush()}close(){let t=()=>{this._onClose("forced close"),E("socket closing - telling transport to close"),this.transport.close()},e=()=>{this.off("upgrade",e),this.off("upgradeError",e),t()},r=()=>{this.once("upgrade",e),this.once("upgradeError",e)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():t()}):this.upgrading?r():t()),this}_onError(t){if(E("socket error %j",t),i.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return E("trying next transport"),this.transports.shift(),this._open();this.emitReserved("error",t),this._onClose("transport error",t)}_onClose(t,e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(E('socket close with reason: "%s"',t),this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Br&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){let r=Lt.indexOf(this._offlineEventListener);r!==-1&&(E("removing listener for the 'offline' event"),Lt.splice(r,1))}this.readyState="closed",this.id=null,this.emitReserved("close",t,e),this.writeBuffer=[],this._prevBufferLen=0}}};ce.SocketWithoutUpgrade=Ve;Ve.protocol=Yn.protocol;var Mi=class extends Ve{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade){E("starting upgrade probes");for(let t=0;t<this._upgrades.length;t++)this._probe(this._upgrades[t])}}_probe(t){E('probing transport "%s"',t);let e=this.createTransport(t),r=!1;Ve.priorWebsocketSuccess=!1;let s=()=>{r||(E('probe transport "%s" opened',t),e.send([{type:"ping",data:"probe"}]),e.once("packet",l=>{if(!r)if(l.type==="pong"&&l.data==="probe"){if(E('probe transport "%s" pong',t),this.upgrading=!0,this.emitReserved("upgrading",e),!e)return;Ve.priorWebsocketSuccess=e.name==="websocket",E('pausing current transport "%s"',this.transport.name),this.transport.pause(()=>{r||this.readyState!=="closed"&&(E("changing transport and sending upgrade packet"),d(),this.setTransport(e),e.send([{type:"upgrade"}]),this.emitReserved("upgrade",e),e=null,this.upgrading=!1,this.flush())})}else{E('probe transport "%s" failed',t);let u=new Error("probe error");u.transport=e.name,this.emitReserved("upgradeError",u)}}))};function n(){r||(r=!0,d(),e.close(),e=null)}let o=l=>{let u=new Error("probe error: "+l);u.transport=e.name,n(),E('probe transport "%s" failed because of error: %s',t,l),this.emitReserved("upgradeError",u)};function a(){o("transport closed")}function c(){o("socket closed")}function f(l){e&&l.name!==e.name&&(E('"%s" works - aborting "%s"',l.name,e.name),n())}let d=()=>{e.removeListener("open",s),e.removeListener("error",o),e.removeListener("close",a),this.off("close",c),this.off("upgrading",f)};e.once("open",s),e.once("error",o),e.once("close",a),this.once("close",c),this.once("upgrading",f),this._upgrades.indexOf("webtransport")!==-1&&t!=="webtransport"?this.setTimeoutFn(()=>{r||e.open()},200):e.open()}onHandshake(t){this._upgrades=this._filterUpgrades(t.upgrades),super.onHandshake(t)}_filterUpgrades(t){let e=[];for(let r=0;r<t.length;r++)~this.transports.indexOf(t[r])&&e.push(t[r]);return e}};ce.SocketWithUpgrade=Mi;var zr=class extends Mi{constructor(t,e={}){let r=typeof t=="object",s=r?{...t}:{...e};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(n=>Pc.transports[n]).filter(n=>!!n)),super(r?s:t,s)}};ce.Socket=zr});var Xn=_(Li=>{"use strict";Object.defineProperty(Li,"__esModule",{value:!0});Li.Fetch=void 0;var Rc=$r(),Ur=class extends Rc.Polling{doPoll(){this._fetch().then(t=>{if(!t.ok)return this.onError("fetch read error",t.status,t);t.text().then(e=>this.onData(e))}).catch(t=>{this.onError("fetch read error",t)})}doWrite(t,e){this._fetch(t).then(r=>{if(!r.ok)return this.onError("fetch write error",r.status,r);e()}).catch(r=>{this.onError("fetch write error",r)})}_fetch(t){var e;let r=t!==void 0,s=new Headers(this.opts.extraHeaders);return r&&s.set("content-type","text/plain;charset=UTF-8"),(e=this.socket._cookieJar)===null||e===void 0||e.appendCookies(s),fetch(this.uri(),{method:r?"POST":"GET",body:r?t:null,headers:s,credentials:this.opts.withCredentials?"include":"omit"}).then(n=>{var o;return(o=this.socket._cookieJar)===null||o===void 0||o.parseCookies(n.headers.getSetCookie()),n})}};Li.Fetch=Ur});var Zn=_(w=>{"use strict";Object.defineProperty(w,"__esModule",{value:!0});w.WebTransport=w.WebSocket=w.NodeWebSocket=w.XHR=w.NodeXHR=w.Fetch=w.nextTick=w.parse=w.installTimerFunctions=w.transports=w.TransportError=w.Transport=w.protocol=w.SocketWithUpgrade=w.SocketWithoutUpgrade=w.Socket=void 0;var Gn=jr();Object.defineProperty(w,"Socket",{enumerable:!0,get:function(){return Gn.Socket}});var Qn=jr();Object.defineProperty(w,"SocketWithoutUpgrade",{enumerable:!0,get:function(){return Qn.SocketWithoutUpgrade}});Object.defineProperty(w,"SocketWithUpgrade",{enumerable:!0,get:function(){return Qn.SocketWithUpgrade}});w.protocol=Gn.Socket.protocol;var Jn=Ot();Object.defineProperty(w,"Transport",{enumerable:!0,get:function(){return Jn.Transport}});Object.defineProperty(w,"TransportError",{enumerable:!0,get:function(){return Jn.TransportError}});var Oc=Hr();Object.defineProperty(w,"transports",{enumerable:!0,get:function(){return Oc.transports}});var Mc=je();Object.defineProperty(w,"installTimerFunctions",{enumerable:!0,get:function(){return Mc.installTimerFunctions}});var Lc=Nr();Object.defineProperty(w,"parse",{enumerable:!0,get:function(){return Lc.parse}});var Dc=ze();Object.defineProperty(w,"nextTick",{enumerable:!0,get:function(){return Dc.nextTick}});var Hc=Xn();Object.defineProperty(w,"Fetch",{enumerable:!0,get:function(){return Hc.Fetch}});var Ic=Ti();Object.defineProperty(w,"NodeXHR",{enumerable:!0,get:function(){return Ic.XHR}});var Nc=Ti();Object.defineProperty(w,"XHR",{enumerable:!0,get:function(){return Nc.XHR}});var Fc=Ri();Object.defineProperty(w,"NodeWebSocket",{enumerable:!0,get:function(){return Fc.WS}});var Bc=Ri();Object.defineProperty(w,"WebSocket",{enumerable:!0,get:function(){return Bc.WS}});var zc=Dr();Object.defineProperty(w,"WebTransport",{enumerable:!0,get:function(){return zc.WT}})});var eo=_(ye=>{"use strict";Object.defineProperty(ye,"__esModule",{value:!0});ye.TimeoutError=void 0;ye.singletonPromise=jc;ye.timeoutPromise=Uc;ye.timeoutFunction=qc;ye.createPromiseDebouncer=Vc;ye.createMapPromiseDebouncer=Kc;function jc(i,t,e=0){if(i?.promise)return i;let r=t();return i?i.promise=r:i={promise:r,cacheDuration:e},r.finally(()=>setTimeout(()=>i.promise=void 0,i.cacheDuration)),i}var Dt=class extends Error{promise;constructor(t){super("Operation Timed Out"),this.promise=t}};ye.TimeoutError=Dt;function Uc(i,t){return new Promise((e,r)=>{let s=setTimeout(()=>r(new Dt(t)),i);t.then(n=>{clearTimeout(s),e(n)}).catch(n=>{clearTimeout(s),r(n)})})}function qc(i,t){return new Promise((e,r)=>{let s=!1,n=t(()=>s),o=setTimeout(()=>{s=!0,r(new Dt(n))},i);n.then(a=>{clearTimeout(o),e(a)}).catch(a=>{clearTimeout(o),r(a)})})}function Vc(){let i;return t=>(i||(i=t().finally(()=>i=void 0)),i)}function Kc(){let i=new Map;return(t,e,r)=>{let s=JSON.stringify(t),n=i.get(s);return n||(n=r().finally(()=>{if(!e){i.delete(s);return}setTimeout(()=>i.delete(s),e)}),i.set(s,n)),n}}});var ue=_(Ae=>{"use strict";Object.defineProperty(Ae,"__esModule",{value:!0});Ae.RpcPeer=Ae.RPCResultError=void 0;Ae.startPeriodicGarbageCollection=to;Ae.getEvalSource=Wc;function to(){globalThis.gc||console.warn("rpc peer garbage collection not available: global.gc is not exposed.");let i;try{i=globalThis}catch{}let t=0;return setInterval(()=>{let e=Date.now(),r=e-t,s=B.remotesCreated;B.remotesCreated=0;let n=B.remotesCollected;B.remotesCollected=0,(s||n||r>5*60*1e3)&&(t=e,i?.gc?.())},1e4)}var Di=class i{peer;entry;constructorName;proxyProps;proxyOneWayMethods;static iteratorMethods=new Set(["next","throw","return"]);constructor(t,e,r,s,n){this.peer=t,this.entry=e,this.constructorName=r,this.proxyProps=s,this.proxyOneWayMethods=n}toPrimitive(){let t=this.peer;return`RpcProxy-${t.selfName}:${t.peerName}: ${this.constructorName}`}get(t,e,r){if(e===Symbol.asyncIterator)return this.proxyProps?.[Symbol.asyncIterator.toString()]?()=>new Proxy(()=>{},this):void 0;if(i.iteratorMethods.has(e?.toString())){let n=this.proxyProps?.[Symbol.asyncIterator.toString()]?.[e];if(n)return new Proxy(()=>n,this)}if(e===B.PROPERTY_PROXY_ID)return this.entry.id;if(e==="__proxy_constructor")return this.constructorName;if(e===B.PROPERTY_PROXY_PEER)return this.peer;if(e===B.PROPERTY_PROXY_PROPERTIES)return this.proxyProps;if(e===B.PROPERTY_PROXY_ONEWAY_METHODS)return this.proxyOneWayMethods;if(e===B.PROPERTY_JSON_DISABLE_SERIALIZATION||e===B.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN||e==="then"||e==="constructor")return;if(this.proxyProps?.[e]!==void 0)return this.proxyProps?.[e];let s=B.handleFunctionInvocations(this,t,e,r);return s||new Proxy(()=>e,this)}set(t,e,r,s){return e===B.finalizerIdSymbol?this.entry.finalizerId=r:(this.proxyProps||={},this.proxyProps[e]=r),!0}apply(t,e,r){let s=t()||null,n=this.proxyOneWayMethods?.includes?.(s);if(Object.isFrozen(this.peer.pendingResults))return n?Promise.resolve():Promise.reject(new de(this.peer,"RpcPeer has been killed (apply) "+t()));let o=[],a={};for(let l of r||[])o.push(this.peer.serialize(l,a));let c={type:"apply",id:void 0,proxyId:this.entry.id,args:o,method:s};if(n)return c.oneway=!0,s===null&&delete c.method,this.peer.send(c,void 0,a),Promise.resolve();let f=this.peer.createPendingResult(s,(l,u)=>{c.id=l,this.peer.send(c,u,a)}),d=this.proxyProps?.[Symbol.asyncIterator.toString()];return!d||s!==d.next&&s!==d.return?f:f.then(l=>s===d.return?{done:!0,value:void 0}:{value:l,done:!1}).catch(l=>{if(l.name==="StopAsyncIteration")return{done:!0,value:void 0};throw l})}},de=class extends Error{cause;constructor(t,e,r,s){super(`${e}
${t.selfName}:${t.peerName}`),this.cause=r,s?.name&&(this.name=s?.name),s?.stack&&(this.stack=`${r?.stack||s.stack}
${t.peerName}:${t.selfName}`)}};Ae.RPCResultError=de;try{let i=FinalizationRegistry}catch{window.WeakRef=class{target;constructor(e){this.target=e}deref(){return this.target}},window.FinalizationRegistry=class{register(){}}}var B=class i{selfName;peerName;send;params={};pendingResults={};localProxied=new Map;localProxyMap=new Map;remoteWeakProxies={};finalizers=new FinalizationRegistry(t=>this.finalize(t));nameDeserializerMap=new Map;onProxyTypeSerialization=new Map;onProxySerialization;constructorSerializerMap=new Map;transportSafeArgumentTypes=i.getDefaultTransportSafeArgumentTypes();killed;killedSafe;killedDeferred;tags={};yieldedAsyncIterators=new Set;static finalizerIdSymbol=Symbol("rpcFinalizerId");static remotesCollected=0;static remotesCreated=0;static activeRpcPeer;static isRpcProxy(t){return!!t?.[i.PROPERTY_PROXY_ID]}static getDefaultTransportSafeArgumentTypes(){let t=new Set;return t.add(Number.name),t.add(String.name),t.add(Object.name),t.add(Boolean.name),t.add(Array.name),t}static handleFunctionInvocations(t,e,r,s){if(r==="apply")return(n,o)=>t.apply(e,t,o);if(r==="call")return(n,...o)=>t.apply(e,t,o);if(r==="toString"||r===Symbol.toPrimitive)return(n,...o)=>t.toPrimitive()}static getIteratorNext(t){return t[Symbol.asyncIterator]?t[this.PROPERTY_PROXY_PROPERTIES]?.[Symbol.asyncIterator.toString()]?.next||"next":void 0}static prepareProxyProperties(t){let e=t?.[i.PROPERTY_PROXY_PROPERTIES];return t[Symbol.asyncIterator]&&(e||={},e[Symbol.asyncIterator.toString()]||(e[Symbol.asyncIterator.toString()]={next:"next",throw:"throw",return:"return"})),e}static RANDOM_DIGITS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";static RPC_RESULT_ERROR_NAME="RPCResultError";static PROPERTY_PROXY_ID="__proxy_id";static PROPERTY_PROXY_PEER="__proxy_peer";static PROPERTY_PROXY_ONEWAY_METHODS="__proxy_oneway_methods";static PROPERTY_JSON_DISABLE_SERIALIZATION="__json_disable_serialization";static PROPERTY_PROXY_PROPERTIES="__proxy_props";static PROPERTY_JSON_COPY_SERIALIZE_CHILDREN="__json_copy_serialize_children";static PROBED_PROPERTIES=new Set(["then","constructor","__proxy_id","__proxy_constructor",i.PROPERTY_PROXY_PEER,i.PROPERTY_PROXY_ONEWAY_METHODS,i.PROPERTY_JSON_DISABLE_SERIALIZATION,i.PROPERTY_PROXY_PROPERTIES,i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]);constructor(t,e,r){this.selfName=t,this.peerName=e,this.send=r,this.killed=new Promise((s,n)=>{this.killedDeferred={resolve:s,reject:n,method:void 0}}).catch(s=>s.message||"Unknown Error"),this.killedSafe=this.killed.then(()=>{}).catch(()=>{})}static isTransportSafe(t){return t?!t[Symbol.asyncIterator]&&!t[i.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.getDefaultTransportSafeArgumentTypes().has(t.constructor?.name):!0}isTransportSafe(t){return t?!t[Symbol.asyncIterator]&&!t[i.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.transportSafeArgumentTypes.has(t.constructor?.name):!0}static generateId(){return[...new Array(8)].map(()=>i.RANDOM_DIGITS.charAt(Math.floor(Math.random()*i.RANDOM_DIGITS.length))).join("")}createPendingResult(t,e){if(Object.isFrozen(this.pendingResults))return Promise.reject(new de(this,"RpcPeer has been killed (createPendingResult)"));let r=new Promise((s,n)=>{let o=i.generateId();this.pendingResults[o]={resolve:s,reject:n,method:t},e(o,a=>n(new de(this,a.message,a)))});return r.catch(()=>{}),r}kill(t){if(Object.isFrozen(this.pendingResults))return;let e=new de(this,t||"peer was killed");this.killedDeferred.reject(e);for(let r of Object.values(this.pendingResults))r.reject(e);for(let r of this.yieldedAsyncIterators)r.throw(e).catch(()=>{});this.yieldedAsyncIterators.clear(),this.pendingResults=Object.freeze({}),this.params=Object.freeze({}),this.remoteWeakProxies=Object.freeze({}),this.localProxyMap.clear(),this.localProxied.clear()}addSerializer(t,e,r){this.nameDeserializerMap.set(e,r),this.constructorSerializerMap.set(t,e)}finalize(t){i.remotesCollected++,delete this.remoteWeakProxies[t.id];let e={__local_proxy_id:t.id,__local_proxy_finalizer_id:t.finalizerId,type:"finalize"};this.send(e)}async getParam(t){return this.createPendingResult("getParam",(e,r)=>{let s={id:e,type:"param",param:t};this.send(s,r)})}createErrorResult(t,e){return t.result=this.serializeError(e),t.throw=!0,t}deserialize(t,e){if(!t)return t;let r=t[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN];if(r){if(Array.isArray(r)){let m=[];for(let g of r)m.push(this.deserialize(g,e));return m}let u={};for(let[m,g]of Object.entries(t))u[m]=this.deserialize(g,e);return u}let{__remote_proxy_id:s,__remote_proxy_finalizer_id:n,__local_proxy_id:o,__remote_constructor_name:a,__serialized_value:c,__remote_proxy_props:f,__remote_proxy_oneway_methods:d}=t;if(a===i.RPC_RESULT_ERROR_NAME)return this.deserializeError(c);if(s){let u=this.remoteWeakProxies[s]?.deref();u||(u=this.newProxy(s,a,f,d)),u[i.finalizerIdSymbol]=n;let m=this.nameDeserializerMap.get(a);return m?m.deserialize(u,e):u}if(o){let u=this.localProxyMap.get(o);if(!u)throw new de(this,`invalid local proxy id ${o}`);return u}let l=this.nameDeserializerMap.get(a);return l?l.deserialize(c,e):t}deserializeError(t){let{name:e,stack:r,message:s}=t;return new de(this,s,void 0,{name:e,stack:r})}serializeError(t){let e={stack:t.stack||"[no stack]",name:t.name||"[no name]",message:t.message||"[no message]"};return{__remote_constructor_name:i.RPC_RESULT_ERROR_NAME,__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_proxy_oneway_methods:void 0,__remote_proxy_props:void 0,__serialized_value:e}}serialize(t,e){if(t?.[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]===!0){if(Array.isArray(t)){let u=[];for(let m of t)u.push(this.serialize(m,e));return{[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]:u}}let l={};for(let[u,m]of Object.entries(t))l[u]=this.serialize(m,e);return l}if(this.isTransportSafe(t))return t;let r=t.__proxy_constructor||t.constructor?.name?.toString();if(t instanceof Error)return this.serializeError(t);let s=this.constructorSerializerMap.get(t.constructor);if(s){r=s;let l=this.nameDeserializerMap.get(s);if(!l)throw new Error("serializer not found for "+s);let u=l.serialize(t,e);return{__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_constructor_name:r,__remote_proxy_props:i.prepareProxyProperties(t),__remote_proxy_oneway_methods:t?.[i.PROPERTY_PROXY_ONEWAY_METHODS],__serialized_value:u}}let n=this.localProxied.get(t);if(n){let{proxyId:l,properties:u}=this.onProxySerialization?.(t)||{proxyId:n.id,properties:i.prepareProxyProperties(t)};if(l!==n.id)throw new Error("onProxySerialization proxy id mismatch");let m=i.generateId();return n.finalizerId=m,{__remote_proxy_id:l,__remote_proxy_finalizer_id:m,__remote_constructor_name:r,__remote_proxy_props:u,__remote_proxy_oneway_methods:t?.[i.PROPERTY_PROXY_ONEWAY_METHODS]}}let{__proxy_id:o,__proxy_peer:a}=t;if(o&&a===this)return{__local_proxy_id:o};this.onProxyTypeSerialization.get(r)?.(t);let{proxyId:c,properties:f}=this.onProxySerialization?.(t)||{proxyId:i.generateId(),properties:i.prepareProxyProperties(t)};return n={id:c,finalizerId:c},this.localProxied.set(t,n),this.localProxyMap.set(c,t),{__remote_proxy_id:c,__remote_proxy_finalizer_id:c,__remote_constructor_name:r,__remote_proxy_props:f,__remote_proxy_oneway_methods:t?.[i.PROPERTY_PROXY_ONEWAY_METHODS]}}newProxy(t,e,r,s){i.remotesCreated++;let n={id:t,finalizerId:void 0},o=new Di(this,n,e,r,s),a=e==="Function"||e==="AsyncFunction"?function(){}:o,c=new Proxy(a,o),f=new WeakRef(c);return this.remoteWeakProxies[t]=f,this.finalizers.register(o,n),c}handleMessage(t,e){try{i.activeRpcPeer=this,this.handleMessageInternal(t,e)}finally{i.activeRpcPeer=void 0}}sendResult(t,e){this.send(t,r=>{this.send(this.createErrorResult(t,r),void 0,e)},e)}async handleMessageInternal(t,e){if(!Object.isFrozen(this.pendingResults))try{switch(t.type){case"param":{let r=t,s={},n;try{n={type:"result",id:r.id,result:this.serialize(this.params[r.param],s)}}catch(o){this.createErrorResult(n,o)}this.sendResult(n,s);break}case"apply":{let r=t,s={type:"result",id:r.id||""},n={};try{let o=this.localProxyMap.get(r.proxyId);if(!o)throw new Error(`proxy id ${r.proxyId} not found`);let a=[];for(let f of r.args||[])a.push(this.deserialize(f,e));let c;if(r.method){if(!o[r.method])throw new Error(`target ${o?.constructor?.name} does not have method ${r.method}`);let d=i.getIteratorNext(o)===r.method;if(d&&this.yieldedAsyncIterators.delete(o),c=await o[r.method](...a),d){if(c.done)throw{name:"StopAsyncIteration",message:void 0};Object.isFrozen(this.pendingResults)?o.throw(new de(this,"RpcPeer has been killed (yield)")).catch(()=>{}):this.yieldedAsyncIterators.add(o),c=c.value}}else c=await o(...a);s.result=this.serialize(c,n)}catch(o){this.createErrorResult(s,o)}r.oneway||this.sendResult(s,n);break}case"result":{let r=t,s=this.pendingResults[r.id];if(delete this.pendingResults[r.id],!s)throw new Error(`unknown result ${r.id}`);let n=this.deserialize(r.result,e);r.throw?s.reject(n):s.resolve(n);break}case"finalize":{let r=t,s=this.localProxyMap.get(r.__local_proxy_id);if(s){let n=this.localProxied.get(s);if(r.__local_proxy_finalizer_id&&r.__local_proxy_finalizer_id!==n?.finalizerId)break;this.localProxyMap.delete(r.__local_proxy_id),this.localProxied.delete(s)}break}default:throw new Error(`unknown rpc message type ${t.type}`)}}catch(r){console.error("unhandled rpc error",this.peerName,r);return}}};Ae.RpcPeer=B;function Wc(){return`
    (() => {
        ${Di}

        ${B}

        ${to}

        return {
            startPeriodicGarbageCollection,
            RpcPeer,
            RpcProxy,
        };
    })();
    `}});var io=_(Hi=>{"use strict";Object.defineProperty(Hi,"__esModule",{value:!0});Hi.MediaObject=void 0;var Yc=ue(),qr=class{mimeType;data;__proxy_props;constructor(t,e,r){this.mimeType=t,this.data=e,this.__proxy_props={},r||={},r.mimeType=t,r.convert||=null,r.toMimeTypes||=null;for(let[s,n]of Object.entries(r))Yc.RpcPeer.isTransportSafe(n)&&(this.__proxy_props[s]=n),this[s]=n}async getData(){return Promise.resolve(this.data)}};Hi.MediaObject=qr});var Ke=_(b=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0});b.ScryptedMimeTypes=b.ScryptedInterface=b.MediaPlayerState=b.SecuritySystemObstruction=b.SecuritySystemMode=b.AirQuality=b.AirPurifierMode=b.AirPurifierStatus=b.ChargeState=b.LockState=b.PanTiltZoomMovement=b.ThermostatMode=b.TemperatureUnit=b.FanMode=b.HumidityMode=b.ScryptedDeviceType=b.ScryptedInterfaceDescriptors=b.ScryptedInterfaceMethod=b.ScryptedInterfaceProperty=b.DeviceBase=b.TYPES_VERSION=void 0;b.TYPES_VERSION="0.5.55";var Vr=class{};b.DeviceBase=Vr;var ro;(function(i){i.id="id",i.info="info",i.interfaces="interfaces",i.mixins="mixins",i.name="name",i.nativeId="nativeId",i.pluginId="pluginId",i.providedInterfaces="providedInterfaces",i.providedName="providedName",i.providedRoom="providedRoom",i.providedType="providedType",i.providerId="providerId",i.room="room",i.type="type",i.scryptedRuntimeArguments="scryptedRuntimeArguments",i.on="on",i.brightness="brightness",i.colorTemperature="colorTemperature",i.rgb="rgb",i.hsv="hsv",i.buttons="buttons",i.sensors="sensors",i.running="running",i.paused="paused",i.docked="docked",i.temperatureSetting="temperatureSetting",i.temperature="temperature",i.temperatureUnit="temperatureUnit",i.humidity="humidity",i.resolution="resolution",i.audioVolumes="audioVolumes",i.recordingActive="recordingActive",i.ptzCapabilities="ptzCapabilities",i.lockState="lockState",i.entryOpen="entryOpen",i.batteryLevel="batteryLevel",i.chargeState="chargeState",i.online="online",i.fromMimeType="fromMimeType",i.toMimeType="toMimeType",i.converters="converters",i.binaryState="binaryState",i.tampered="tampered",i.sleeping="sleeping",i.powerDetected="powerDetected",i.audioDetected="audioDetected",i.motionDetected="motionDetected",i.ambientLight="ambientLight",i.occupied="occupied",i.flooded="flooded",i.ultraviolet="ultraviolet",i.luminance="luminance",i.position="position",i.securitySystemState="securitySystemState",i.pm10Density="pm10Density",i.pm25Density="pm25Density",i.vocDensity="vocDensity",i.noxDensity="noxDensity",i.co2ppm="co2ppm",i.airQuality="airQuality",i.airPurifierState="airPurifierState",i.filterChangeIndication="filterChangeIndication",i.filterLifeLevel="filterLifeLevel",i.humiditySetting="humiditySetting",i.fan="fan",i.applicationInfo="applicationInfo",i.chatCompletionCapabilities="chatCompletionCapabilities",i.systemDevice="systemDevice"})(ro||(b.ScryptedInterfaceProperty=ro={}));var so;(function(i){i.listen="listen",i.probe="probe",i.setMixins="setMixins",i.setName="setName",i.setRoom="setRoom",i.setType="setType",i.getPluginJson="getPluginJson",i.turnOff="turnOff",i.turnOn="turnOn",i.setBrightness="setBrightness",i.getTemperatureMaxK="getTemperatureMaxK",i.getTemperatureMinK="getTemperatureMinK",i.setColorTemperature="setColorTemperature",i.setRgb="setRgb",i.setHsv="setHsv",i.pressButton="pressButton",i.sendNotification="sendNotification",i.start="start",i.stop="stop",i.pause="pause",i.resume="resume",i.dock="dock",i.setTemperature="setTemperature",i.setTemperatureUnit="setTemperatureUnit",i.getPictureOptions="getPictureOptions",i.takePicture="takePicture",i.getAudioStream="getAudioStream",i.setAudioVolumes="setAudioVolumes",i.startDisplay="startDisplay",i.stopDisplay="stopDisplay",i.getVideoStream="getVideoStream",i.getVideoStreamOptions="getVideoStreamOptions",i.getPrivacyMasks="getPrivacyMasks",i.setPrivacyMasks="setPrivacyMasks",i.getVideoTextOverlays="getVideoTextOverlays",i.setVideoTextOverlay="setVideoTextOverlay",i.getRecordingStream="getRecordingStream",i.getRecordingStreamCurrentTime="getRecordingStreamCurrentTime",i.getRecordingStreamOptions="getRecordingStreamOptions",i.getRecordingStreamThumbnail="getRecordingStreamThumbnail",i.deleteRecordingStream="deleteRecordingStream",i.setRecordingActive="setRecordingActive",i.ptzCommand="ptzCommand",i.getRecordedEvents="getRecordedEvents",i.getVideoClip="getVideoClip",i.getVideoClips="getVideoClips",i.getVideoClipThumbnail="getVideoClipThumbnail",i.removeVideoClips="removeVideoClips",i.setVideoStreamOptions="setVideoStreamOptions",i.startIntercom="startIntercom",i.stopIntercom="stopIntercom",i.lock="lock",i.unlock="unlock",i.addPassword="addPassword",i.getPasswords="getPasswords",i.removePassword="removePassword",i.activate="activate",i.deactivate="deactivate",i.isReversible="isReversible",i.closeEntry="closeEntry",i.openEntry="openEntry",i.getDevice="getDevice",i.releaseDevice="releaseDevice",i.adoptDevice="adoptDevice",i.discoverDevices="discoverDevices",i.createDevice="createDevice",i.getCreateDeviceSettings="getCreateDeviceSettings",i.reboot="reboot",i.getRefreshFrequency="getRefreshFrequency",i.refresh="refresh",i.getMediaStatus="getMediaStatus",i.load="load",i.seek="seek",i.skipNext="skipNext",i.skipPrevious="skipPrevious",i.convert="convert",i.convertMedia="convertMedia",i.getSettings="getSettings",i.putSetting="putSetting",i.armSecuritySystem="armSecuritySystem",i.disarmSecuritySystem="disarmSecuritySystem",i.setAirPurifierState="setAirPurifierState",i.getReadmeMarkdown="getReadmeMarkdown",i.getOauthUrl="getOauthUrl",i.onOauthCallback="onOauthCallback",i.canMixin="canMixin",i.getMixin="getMixin",i.releaseMixin="releaseMixin",i.onRequest="onRequest",i.onConnection="onConnection",i.onPush="onPush",i.run="run",i.eval="eval",i.loadScripts="loadScripts",i.saveScript="saveScript",i.forkInterface="forkInterface",i.getDetectionInput="getDetectionInput",i.getObjectTypes="getObjectTypes",i.detectObjects="detectObjects",i.generateObjectDetections="generateObjectDetections",i.getDetectionModel="getDetectionModel",i.setHumidity="setHumidity",i.setFan="setFan",i.startRTCSignalingSession="startRTCSignalingSession",i.createRTCSignalingSession="createRTCSignalingSession",i.getScryptedUserAccessControl="getScryptedUserAccessControl",i.generateVideoFrames="generateVideoFrames",i.connectStream="connectStream",i.getTTYSettings="getTTYSettings",i.getChatCompletion="getChatCompletion",i.streamChatCompletion="streamChatCompletion",i.getTextEmbedding="getTextEmbedding",i.getImageEmbedding="getImageEmbedding",i.callLLMTool="callLLMTool",i.getLLMTools="getLLMTools"})(so||(b.ScryptedInterfaceMethod=so={}));b.ScryptedInterfaceDescriptors={ScryptedDevice:{name:"ScryptedDevice",methods:["listen","probe","setMixins","setName","setRoom","setType"],properties:["id","info","interfaces","mixins","name","nativeId","pluginId","providedInterfaces","providedName","providedRoom","providedType","providerId","room","type"]},ScryptedPlugin:{name:"ScryptedPlugin",methods:["getPluginJson"],properties:[]},ScryptedPluginRuntime:{name:"ScryptedPluginRuntime",methods:[],properties:["scryptedRuntimeArguments"]},OnOff:{name:"OnOff",methods:["turnOff","turnOn"],properties:["on"]},Brightness:{name:"Brightness",methods:["setBrightness"],properties:["brightness"]},ColorSettingTemperature:{name:"ColorSettingTemperature",methods:["getTemperatureMaxK","getTemperatureMinK","setColorTemperature"],properties:["colorTemperature"]},ColorSettingRgb:{name:"ColorSettingRgb",methods:["setRgb"],properties:["rgb"]},ColorSettingHsv:{name:"ColorSettingHsv",methods:["setHsv"],properties:["hsv"]},Buttons:{name:"Buttons",methods:[],properties:["buttons"]},PressButtons:{name:"PressButtons",methods:["pressButton"],properties:[]},Sensors:{name:"Sensors",methods:[],properties:["sensors"]},Notifier:{name:"Notifier",methods:["sendNotification"],properties:[]},StartStop:{name:"StartStop",methods:["start","stop"],properties:["running"]},Pause:{name:"Pause",methods:["pause","resume"],properties:["paused"]},Dock:{name:"Dock",methods:["dock"],properties:["docked"]},TemperatureSetting:{name:"TemperatureSetting",methods:["setTemperature"],properties:["temperatureSetting"]},Thermometer:{name:"Thermometer",methods:["setTemperatureUnit"],properties:["temperature","temperatureUnit"]},HumiditySensor:{name:"HumiditySensor",methods:[],properties:["humidity"]},Camera:{name:"Camera",methods:["getPictureOptions","takePicture"],properties:[]},Resolution:{name:"Resolution",methods:[],properties:["resolution"]},Microphone:{name:"Microphone",methods:["getAudioStream"],properties:[]},AudioVolumeControl:{name:"AudioVolumeControl",methods:["setAudioVolumes"],properties:["audioVolumes"]},Display:{name:"Display",methods:["startDisplay","stopDisplay"],properties:[]},VideoCamera:{name:"VideoCamera",methods:["getVideoStream","getVideoStreamOptions"],properties:[]},VideoCameraMask:{name:"VideoCameraMask",methods:["getPrivacyMasks","setPrivacyMasks"],properties:[]},VideoTextOverlays:{name:"VideoTextOverlays",methods:["getVideoTextOverlays","setVideoTextOverlay"],properties:[]},VideoRecorder:{name:"VideoRecorder",methods:["getRecordingStream","getRecordingStreamCurrentTime","getRecordingStreamOptions","getRecordingStreamThumbnail"],properties:["recordingActive"]},VideoRecorderManagement:{name:"VideoRecorderManagement",methods:["deleteRecordingStream","setRecordingActive"],properties:[]},PanTiltZoom:{name:"PanTiltZoom",methods:["ptzCommand"],properties:["ptzCapabilities"]},EventRecorder:{name:"EventRecorder",methods:["getRecordedEvents"],properties:[]},VideoClips:{name:"VideoClips",methods:["getVideoClip","getVideoClips","getVideoClipThumbnail","removeVideoClips"],properties:[]},VideoCameraConfiguration:{name:"VideoCameraConfiguration",methods:["setVideoStreamOptions"],properties:[]},Intercom:{name:"Intercom",methods:["startIntercom","stopIntercom"],properties:[]},Lock:{name:"Lock",methods:["lock","unlock"],properties:["lockState"]},PasswordStore:{name:"PasswordStore",methods:["addPassword","getPasswords","removePassword"],properties:[]},Scene:{name:"Scene",methods:["activate","deactivate","isReversible"],properties:[]},Entry:{name:"Entry",methods:["closeEntry","openEntry"],properties:[]},EntrySensor:{name:"EntrySensor",methods:[],properties:["entryOpen"]},DeviceProvider:{name:"DeviceProvider",methods:["getDevice","releaseDevice"],properties:[]},DeviceDiscovery:{name:"DeviceDiscovery",methods:["adoptDevice","discoverDevices"],properties:[]},DeviceCreator:{name:"DeviceCreator",methods:["createDevice","getCreateDeviceSettings"],properties:[]},Battery:{name:"Battery",methods:[],properties:["batteryLevel"]},Charger:{name:"Charger",methods:[],properties:["chargeState"]},Reboot:{name:"Reboot",methods:["reboot"],properties:[]},Refresh:{name:"Refresh",methods:["getRefreshFrequency","refresh"],properties:[]},MediaPlayer:{name:"MediaPlayer",methods:["getMediaStatus","load","seek","skipNext","skipPrevious"],properties:[]},Online:{name:"Online",methods:[],properties:["online"]},BufferConverter:{name:"BufferConverter",methods:["convert"],properties:["fromMimeType","toMimeType"]},MediaConverter:{name:"MediaConverter",methods:["convertMedia"],properties:["converters"]},Settings:{name:"Settings",methods:["getSettings","putSetting"],properties:[]},BinarySensor:{name:"BinarySensor",methods:[],properties:["binaryState"]},TamperSensor:{name:"TamperSensor",methods:[],properties:["tampered"]},Sleep:{name:"Sleep",methods:[],properties:["sleeping"]},PowerSensor:{name:"PowerSensor",methods:[],properties:["powerDetected"]},AudioSensor:{name:"AudioSensor",methods:[],properties:["audioDetected"]},MotionSensor:{name:"MotionSensor",methods:[],properties:["motionDetected"]},AmbientLightSensor:{name:"AmbientLightSensor",methods:[],properties:["ambientLight"]},OccupancySensor:{name:"OccupancySensor",methods:[],properties:["occupied"]},FloodSensor:{name:"FloodSensor",methods:[],properties:["flooded"]},UltravioletSensor:{name:"UltravioletSensor",methods:[],properties:["ultraviolet"]},LuminanceSensor:{name:"LuminanceSensor",methods:[],properties:["luminance"]},PositionSensor:{name:"PositionSensor",methods:[],properties:["position"]},SecuritySystem:{name:"SecuritySystem",methods:["armSecuritySystem","disarmSecuritySystem"],properties:["securitySystemState"]},PM10Sensor:{name:"PM10Sensor",methods:[],properties:["pm10Density"]},PM25Sensor:{name:"PM25Sensor",methods:[],properties:["pm25Density"]},VOCSensor:{name:"VOCSensor",methods:[],properties:["vocDensity"]},NOXSensor:{name:"NOXSensor",methods:[],properties:["noxDensity"]},CO2Sensor:{name:"CO2Sensor",methods:[],properties:["co2ppm"]},AirQualitySensor:{name:"AirQualitySensor",methods:[],properties:["airQuality"]},AirPurifier:{name:"AirPurifier",methods:["setAirPurifierState"],properties:["airPurifierState"]},FilterMaintenance:{name:"FilterMaintenance",methods:[],properties:["filterChangeIndication","filterLifeLevel"]},Readme:{name:"Readme",methods:["getReadmeMarkdown"],properties:[]},OauthClient:{name:"OauthClient",methods:["getOauthUrl","onOauthCallback"],properties:[]},MixinProvider:{name:"MixinProvider",methods:["canMixin","getMixin","releaseMixin"],properties:[]},HttpRequestHandler:{name:"HttpRequestHandler",methods:["onRequest"],properties:[]},EngineIOHandler:{name:"EngineIOHandler",methods:["onConnection"],properties:[]},PushHandler:{name:"PushHandler",methods:["onPush"],properties:[]},Program:{name:"Program",methods:["run"],properties:[]},Scriptable:{name:"Scriptable",methods:["eval","loadScripts","saveScript"],properties:[]},ClusterForkInterface:{name:"ClusterForkInterface",methods:["forkInterface"],properties:[]},ObjectDetector:{name:"ObjectDetector",methods:["getDetectionInput","getObjectTypes"],properties:[]},ObjectDetection:{name:"ObjectDetection",methods:["detectObjects","generateObjectDetections","getDetectionModel"],properties:[]},ObjectDetectionPreview:{name:"ObjectDetectionPreview",methods:[],properties:[]},ObjectDetectionGenerator:{name:"ObjectDetectionGenerator",methods:[],properties:[]},HumiditySetting:{name:"HumiditySetting",methods:["setHumidity"],properties:["humiditySetting"]},Fan:{name:"Fan",methods:["setFan"],properties:["fan"]},RTCSignalingChannel:{name:"RTCSignalingChannel",methods:["startRTCSignalingSession"],properties:[]},RTCSignalingClient:{name:"RTCSignalingClient",methods:["createRTCSignalingSession"],properties:[]},LauncherApplication:{name:"LauncherApplication",methods:[],properties:["applicationInfo"]},ScryptedUser:{name:"ScryptedUser",methods:["getScryptedUserAccessControl"],properties:[]},VideoFrameGenerator:{name:"VideoFrameGenerator",methods:["generateVideoFrames"],properties:[]},StreamService:{name:"StreamService",methods:["connectStream"],properties:[]},TTY:{name:"TTY",methods:[],properties:[]},TTYSettings:{name:"TTYSettings",methods:["getTTYSettings"],properties:[]},ChatCompletion:{name:"ChatCompletion",methods:["getChatCompletion","streamChatCompletion"],properties:["chatCompletionCapabilities"]},TextEmbedding:{name:"TextEmbedding",methods:["getTextEmbedding"],properties:[]},ImageEmbedding:{name:"ImageEmbedding",methods:["getImageEmbedding"],properties:[]},LLMTools:{name:"LLMTools",methods:["callLLMTool","getLLMTools"],properties:[]},ScryptedSystemDevice:{name:"ScryptedSystemDevice",methods:[],properties:["systemDevice"]},ScryptedDeviceCreator:{name:"ScryptedDeviceCreator",methods:[],properties:[]},ScryptedSettings:{name:"ScryptedSettings",methods:[],properties:[]}};var no;(function(i){i.Builtin="Builtin",i.Internal="Internal",i.Camera="Camera",i.Fan="Fan",i.Light="Light",i.Switch="Switch",i.Outlet="Outlet",i.Sensor="Sensor",i.Scene="Scene",i.Program="Program",i.Automation="Automation",i.Vacuum="Vacuum",i.Notifier="Notifier",i.Thermostat="Thermostat",i.Lock="Lock",i.PasswordControl="PasswordControl",i.Display="Display",i.SmartDisplay="SmartDisplay",i.Speaker="Speaker",i.SmartSpeaker="SmartSpeaker",i.RemoteDesktop="RemoteDesktop",i.Event="Event",i.Entry="Entry",i.Garage="Garage",i.DeviceProvider="DeviceProvider",i.DataSource="DataSource",i.API="API",i.Buttons="Buttons",i.Doorbell="Doorbell",i.Irrigation="Irrigation",i.Valve="Valve",i.Person="Person",i.SecuritySystem="SecuritySystem",i.WindowCovering="WindowCovering",i.Siren="Siren",i.AirPurifier="AirPurifier",i.Internet="Internet",i.Network="Network",i.Bridge="Bridge",i.LLM="LLM",i.Unknown="Unknown"})(no||(b.ScryptedDeviceType=no={}));var oo;(function(i){i.Humidify="Humidify",i.Dehumidify="Dehumidify",i.Auto="Auto",i.Off="Off"})(oo||(b.HumidityMode=oo={}));var ao;(function(i){i.Auto="Auto",i.Manual="Manual"})(ao||(b.FanMode=ao={}));var lo;(function(i){i.C="C",i.F="F"})(lo||(b.TemperatureUnit=lo={}));var co;(function(i){i.Off="Off",i.Cool="Cool",i.Heat="Heat",i.HeatCool="HeatCool",i.Auto="Auto",i.FanOnly="FanOnly",i.Purifier="Purifier",i.Eco="Eco",i.Dry="Dry",i.On="On"})(co||(b.ThermostatMode=co={}));var uo;(function(i){i.Absolute="Absolute",i.Relative="Relative",i.Continuous="Continuous",i.Preset="Preset",i.Home="Home"})(uo||(b.PanTiltZoomMovement=uo={}));var ho;(function(i){i.Locked="Locked",i.Unlocked="Unlocked",i.Jammed="Jammed"})(ho||(b.LockState=ho={}));var po;(function(i){i.Trickle="trickle",i.Charging="charging",i.NotCharging="not-charging"})(po||(b.ChargeState=po={}));var mo;(function(i){i.Inactive="Inactive",i.Idle="Idle",i.Active="Active",i.ActiveNightMode="ActiveNightMode"})(mo||(b.AirPurifierStatus=mo={}));var fo;(function(i){i.Manual="Manual",i.Automatic="Automatic"})(fo||(b.AirPurifierMode=fo={}));var go;(function(i){i.Unknown="Unknown",i.Excellent="Excellent",i.Good="Good",i.Fair="Fair",i.Inferior="Inferior",i.Poor="Poor"})(go||(b.AirQuality=go={}));var bo;(function(i){i.Disarmed="Disarmed",i.HomeArmed="HomeArmed",i.AwayArmed="AwayArmed",i.NightArmed="NightArmed"})(bo||(b.SecuritySystemMode=bo={}));var _o;(function(i){i.Sensor="Sensor",i.Occupied="Occupied",i.Time="Time",i.Error="Error"})(_o||(b.SecuritySystemObstruction=_o={}));var vo;(function(i){i.Idle="Idle",i.Playing="Playing",i.Paused="Paused",i.Buffering="Buffering"})(vo||(b.MediaPlayerState=vo={}));var yo;(function(i){i.ScryptedDevice="ScryptedDevice",i.ScryptedPlugin="ScryptedPlugin",i.ScryptedPluginRuntime="ScryptedPluginRuntime",i.OnOff="OnOff",i.Brightness="Brightness",i.ColorSettingTemperature="ColorSettingTemperature",i.ColorSettingRgb="ColorSettingRgb",i.ColorSettingHsv="ColorSettingHsv",i.Buttons="Buttons",i.PressButtons="PressButtons",i.Sensors="Sensors",i.Notifier="Notifier",i.StartStop="StartStop",i.Pause="Pause",i.Dock="Dock",i.TemperatureSetting="TemperatureSetting",i.Thermometer="Thermometer",i.HumiditySensor="HumiditySensor",i.Camera="Camera",i.Resolution="Resolution",i.Microphone="Microphone",i.AudioVolumeControl="AudioVolumeControl",i.Display="Display",i.VideoCamera="VideoCamera",i.VideoCameraMask="VideoCameraMask",i.VideoTextOverlays="VideoTextOverlays",i.VideoRecorder="VideoRecorder",i.VideoRecorderManagement="VideoRecorderManagement",i.PanTiltZoom="PanTiltZoom",i.EventRecorder="EventRecorder",i.VideoClips="VideoClips",i.VideoCameraConfiguration="VideoCameraConfiguration",i.Intercom="Intercom",i.Lock="Lock",i.PasswordStore="PasswordStore",i.Scene="Scene",i.Entry="Entry",i.EntrySensor="EntrySensor",i.DeviceProvider="DeviceProvider",i.DeviceDiscovery="DeviceDiscovery",i.DeviceCreator="DeviceCreator",i.Battery="Battery",i.Charger="Charger",i.Reboot="Reboot",i.Refresh="Refresh",i.MediaPlayer="MediaPlayer",i.Online="Online",i.BufferConverter="BufferConverter",i.MediaConverter="MediaConverter",i.Settings="Settings",i.BinarySensor="BinarySensor",i.TamperSensor="TamperSensor",i.Sleep="Sleep",i.PowerSensor="PowerSensor",i.AudioSensor="AudioSensor",i.MotionSensor="MotionSensor",i.AmbientLightSensor="AmbientLightSensor",i.OccupancySensor="OccupancySensor",i.FloodSensor="FloodSensor",i.UltravioletSensor="UltravioletSensor",i.LuminanceSensor="LuminanceSensor",i.PositionSensor="PositionSensor",i.SecuritySystem="SecuritySystem",i.PM10Sensor="PM10Sensor",i.PM25Sensor="PM25Sensor",i.VOCSensor="VOCSensor",i.NOXSensor="NOXSensor",i.CO2Sensor="CO2Sensor",i.AirQualitySensor="AirQualitySensor",i.AirPurifier="AirPurifier",i.FilterMaintenance="FilterMaintenance",i.Readme="Readme",i.OauthClient="OauthClient",i.MixinProvider="MixinProvider",i.HttpRequestHandler="HttpRequestHandler",i.EngineIOHandler="EngineIOHandler",i.PushHandler="PushHandler",i.Program="Program",i.Scriptable="Scriptable",i.ClusterForkInterface="ClusterForkInterface",i.ObjectDetector="ObjectDetector",i.ObjectDetection="ObjectDetection",i.ObjectDetectionPreview="ObjectDetectionPreview",i.ObjectDetectionGenerator="ObjectDetectionGenerator",i.HumiditySetting="HumiditySetting",i.Fan="Fan",i.RTCSignalingChannel="RTCSignalingChannel",i.RTCSignalingClient="RTCSignalingClient",i.LauncherApplication="LauncherApplication",i.ScryptedUser="ScryptedUser",i.VideoFrameGenerator="VideoFrameGenerator",i.StreamService="StreamService",i.TTY="TTY",i.TTYSettings="TTYSettings",i.ChatCompletion="ChatCompletion",i.TextEmbedding="TextEmbedding",i.ImageEmbedding="ImageEmbedding",i.LLMTools="LLMTools",i.ScryptedSystemDevice="ScryptedSystemDevice",i.ScryptedDeviceCreator="ScryptedDeviceCreator",i.ScryptedSettings="ScryptedSettings"})(yo||(b.ScryptedInterface=yo={}));var xo;(function(i){i.Url="text/x-uri",i.InsecureLocalUrl="text/x-insecure-local-uri",i.LocalUrl="text/x-local-uri",i.ServerId="text/x-server-id",i.PushEndpoint="text/x-push-endpoint",i.SchemePrefix="x-scrypted/x-scrypted-scheme-",i.MediaStreamUrl="text/x-media-url",i.MediaObject="x-scrypted/x-scrypted-media-object",i.RequestMediaObject="x-scrypted/x-scrypted-request-media-object",i.RequestMediaStream="x-scrypted/x-scrypted-request-stream",i.MediaStreamFeedback="x-scrypted/x-media-stream-feedback",i.FFmpegInput="x-scrypted/x-ffmpeg-input",i.FFmpegTranscodeStream="x-scrypted/x-ffmpeg-transcode-stream",i.RTCSignalingChannel="x-scrypted/x-scrypted-rtc-signaling-channel",i.RTCSignalingSession="x-scrypted/x-scrypted-rtc-signaling-session",i.RTCConnectionManagement="x-scrypted/x-scrypted-rtc-connection-management",i.Image="x-scrypted/x-scrypted-image"})(xo||(b.ScryptedMimeTypes=xo={}))});var Wr=_(ft=>{"use strict";Object.defineProperty(ft,"__esModule",{value:!0});ft.SidebandBufferSerializer=ft.BufferSerializer=void 0;var Ii=class{serialize(t){return console.warn("Using slow buffer serialization. Ensure the peer supports SidebandBufferSerializer."),t.toString("base64")}deserialize(t){return console.warn("Using slow buffer deserialization. Ensure the peer supports SidebandBufferSerializer."),Buffer.from(t,"base64")}};ft.BufferSerializer=Ii;var Kr=class{bufferSerializer=new Ii;serialize(t,e){if(!e)return this.bufferSerializer.serialize(t);let r=e.buffers=e.buffers||[];return r.push(t),r.length-1}deserialize(t,e){return e?.buffers?e.buffers[t]:this.bufferSerializer.deserialize(t)}};ft.SidebandBufferSerializer=Kr});var Xr=_(ee=>{"use strict";Object.defineProperty(ee,"__esModule",{value:!0});ee.propertyInterfaces=ee.allInterfaceProperties=void 0;ee.getPropertyInterfaces=Co;ee.getInterfaceMethods=wo;ee.getInterfaceProperties=ko;ee.isValidInterfaceMethod=Xc;ee.isValidInterfaceProperty=Gc;var Yr=Ke();ee.allInterfaceProperties=[].concat(...Object.values(Yr.ScryptedInterfaceDescriptors).map(i=>i.properties));function Co(i){let t={};for(let e of Object.values(i))for(let r of e.properties)t[r]=e.name;return t}ee.propertyInterfaces=Co(Yr.ScryptedInterfaceDescriptors);function wo(i,t){return Object.values(i).filter(e=>t.has(e.name)).map(e=>e.methods).flat()}function ko(i,t){return Object.values(i).filter(e=>t.has(e.name)).map(e=>e.properties).flat()}function Xc(i,t,e){return wo(i,t).includes(e)||i[Yr.ScryptedInterface.ScryptedDevice].methods.includes(e)}function Gc(i,t,e){return ko(i,new Set(t)).includes(e)}});var So=_(Gr=>{"use strict";Object.defineProperty(Gr,"__esModule",{value:!0});Gr.checkProperty=Zc;var gt=Ke(),Qc=ue(),Jc=Xr();function Zc(i,t){if(i===gt.ScryptedInterfaceProperty.id)throw new Error("id is read only");if(i===gt.ScryptedInterfaceProperty.nativeId)throw new Error("nativeId is read only");if(i===gt.ScryptedInterfaceProperty.mixins)throw new Error("mixins is read only");if(i===gt.ScryptedInterfaceProperty.interfaces)throw new Error("interfaces is a read only post-mixin computed property, use providedInterfaces");if(Qc.RpcPeer.isRpcProxy(t))throw new Error("value must be a primitive type");if(Jc.propertyInterfaces[i.toString()]===gt.ScryptedInterface.ScryptedDevice&&i!==gt.ScryptedInterfaceProperty.info)throw new Error(`${i.toString()} can not be set. Use DeviceManager.onDevicesChanges or DeviceManager.onDeviceDiscovered to update the device description.`)}});var Eo=_(Re=>{"use strict";Object.defineProperty(Re,"__esModule",{value:!0});Re.StorageImpl=Re.DeviceManagerImpl=Re.DeviceStateProxyHandler=void 0;var ed=ue(),td=So(),Qr=class{console;nativeId;api;logger;constructor(t,e,r){this.console=r,this.api=t,this.nativeId=e}async ensureLogger(){return this.logger||(this.logger=this.api.getLogger(this.nativeId)),await this.logger}async log(t,e){(await this.ensureLogger()).log(t,e)}a(t){this.log("a",t)}async clear(){(await this.ensureLogger()).clear()}async clearAlert(t){(await this.ensureLogger()).clearAlert(t)}async clearAlerts(){(await this.ensureLogger()).clearAlerts()}d(t){this.log("d",t)}e(t){this.log("e",t)}i(t){this.log("i",t)}v(t){this.log("v",t)}w(t){this.log("w",t)}},Ht=class{deviceManager;id;setState;constructor(t,e,r){this.deviceManager=t,this.id=e,this.setState=r}get(t,e,r){return e==="id"?this.id:e===ed.RpcPeer.PROPERTY_PROXY_PROPERTIES?{id:this.id}:e==="setState"?this.setState:this.deviceManager.systemManager.state[this.id][e]?.value}set(t,e,r,s){return(0,td.checkProperty)(e.toString(),r),this.deviceManager.systemManager.state[this.id][e]={value:r},this.setState(e.toString(),r),!0}};Re.DeviceStateProxyHandler=Ht;var Jr=class{systemManager;getDeviceConsole;getMixinConsole;api;nativeIds=new Map;deviceStorage=new Map;mixinStorage=new Map;constructor(t,e,r){this.systemManager=t,this.getDeviceConsole=e,this.getMixinConsole=r}async requestRestart(){return this.api.requestRestart()}getDeviceLogger(t){return new Qr(this.api,t,this.getDeviceConsole?.(t)||console)}getDeviceState(t){let e=new Ht(this,this.nativeIds.get(t).id,(r,s)=>this.api.setState(t,r,s));return new Proxy(e,e)}createDeviceState(t,e){let r=new Ht(this,t,e);return new Proxy(r,r)}getDeviceStorage(t){let e=this.deviceStorage.get(t);return e||(e=new It(this,t),this.deviceStorage.set(t,e)),e}getMixinStorage(t,e){let r=this.mixinStorage.get(e);r||(r=new Map,this.mixinStorage.set(e,r));let s=r.get(t);return s||(s=new It(this,e,`mixin:${t}:`),r.set(t,s)),s}pruneMixinStorage(){for(let t of this.nativeIds.keys()){let e=this.nativeIds.get(t).storage;for(let r of Object.keys(e)){if(!r.startsWith("mixin:"))continue;let[,s]=r.split(":");s&&!this.systemManager.state[s]&&delete e[r]}}}async onMixinEvent(t,e,r,s){return this.api.onMixinEvent(t,e,r,s)}getNativeIds(){return Array.from(this.nativeIds.keys())}async onDeviceDiscovered(t){return this.api.onDeviceDiscovered(t)}async onDeviceRemoved(t){return this.api.onDeviceRemoved(t)}async onDeviceEvent(t,e,r){return this.api.onDeviceEvent(t,e,r)}async onDevicesChanged(t){return this.api.onDevicesChanged(t)}};Re.DeviceManagerImpl=Jr;function Ni(i){return i===null?"null":i===void 0?"undefined":i.toString()}var It=class i{deviceManager;nativeId;prefix;api;static allowedMethods=["length","clear","getItem","setItem","key","removeItem"];static indexedHandler={get(t,e){let r=e.toString();if(i.allowedMethods.includes(r)){let s=t[r];return r==="length"?s:s.bind(t)}return t.getItem(Ni(e))},set(t,e,r){return t.setItem(Ni(e),r),!0}};constructor(t,e,r){return this.deviceManager=t,this.nativeId=e,this.prefix=r,this.deviceManager=t,this.api=t.api,this.nativeId=e,this.prefix||(this.prefix=""),new Proxy(this,i.indexedHandler)}get storage(){return this.deviceManager.nativeIds.get(this.nativeId).storage}get length(){return Object.keys(this.storage).filter(t=>t.startsWith(this.prefix)).length}clear(){if(!this.prefix)this.deviceManager.nativeIds.get(this.nativeId).storage={};else{let t=this.storage;Object.keys(this.storage).filter(e=>e.startsWith(this.prefix)).forEach(e=>delete t[e])}this.api.setStorage(this.nativeId,this.storage)}getItem(t){return this.storage[this.prefix+t]}key(t){return this.prefix?Object.keys(this.storage).filter(e=>e.startsWith(this.prefix))[t].substring(this.prefix.length):Object.keys(this.storage)[t]}removeItem(t){delete this.storage[this.prefix+t],this.api.setStorage(this.nativeId,this.storage)}setItem(t,e){t=Ni(t),e=Ni(e),this.storage[this.prefix+t]!==e&&(this.storage[this.prefix+t]=e,this.api.setStorage(this.nativeId,this.storage))}};Re.StorageImpl=It});var Po=_(Fi=>{"use strict";Object.defineProperty(Fi,"__esModule",{value:!0});Fi.EndpointManagerImpl=void 0;var bt=Ke(),Zr=class{deviceManager;api;pluginId;mediaManager;getEndpoint(t){if(!t)return this.pluginId;let e=this.deviceManager.nativeIds.get(t)?.id;if(!e)throw new Error("invalid nativeId "+t);return t?e:this.pluginId}async getUrlSafeIp(){let t=await this.api.getComponent("SCRYPTED_IP_ADDRESS");return t?.includes(":")?`[${t}]`:t}async getAuthenticatedPath(t){return this.getPath(t)}async getInsecurePublicLocalEndpoint(t){return this.getLocalEndpoint(t,{insecure:!0,public:!0})}async getPublicCloudEndpoint(t){return this.getCloudEndpoint(t,{public:!0})}async getPublicLocalEndpoint(t){return this.getLocalEndpoint(t,{public:!0})}async getPublicPushEndpoint(t){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(t)),bt.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,bt.ScryptedMimeTypes.PushEndpoint)}async getPath(t,e){return`/endpoint/${this.getEndpoint(t)}/${e?.public?"public/":""}`}async getLocalEndpoint(t,e){let r=e?.insecure?"http":"https",s=await this.api.getComponent(e?.insecure?"SCRYPTED_INSECURE_PORT":"SCRYPTED_SECURE_PORT"),n=await this.getPath(t,e);return`${r}://${await this.getUrlSafeIp()}:${s}${n}`}async getCloudEndpoint(t,e){let r=await this.getLocalEndpoint(t,e),s=await this.mediaManager.createMediaObject(Buffer.from(r),bt.ScryptedMimeTypes.LocalUrl);return this.mediaManager.convertMediaObjectToUrl(s,bt.ScryptedMimeTypes.LocalUrl)}async getCloudPushEndpoint(t){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(t)),bt.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,bt.ScryptedMimeTypes.PushEndpoint)}async setLocalAddresses(t){return(await this.api.getComponent("addresses")).setLocalAddresses(t)}async getLocalAddresses(){return await(await this.api.getComponent("addresses")).getLocalAddresses()}async setAccessControlAllowOrigin(t){let e=this;return(await this.deviceManager.systemManager.getComponent("setAccessControlAllowOrigin"))(t)}};Fi.EndpointManagerImpl=Zr});var $o=_(We=>{"use strict";Object.defineProperty(We,"__esModule",{value:!0});We.WebSocketSerializer=We.WebSocketConnection=void 0;We.createWebSocketClass=id;var es=ue(),ts=class{events={};dispatchEvent(t){let e=this.events[t.type];if(e)for(let r of e)r(t)}addEventListener(t,e){let r=this.events[t];r||(r=this.events[t]=[]),r.push(e)}removeEventListener(t,e){let r=this.events[t];if(!r)return;let s=r.indexOf(e);s>-1&&r.splice(s,1)}};function Bi(i,t){Object.defineProperty(i,"on"+t,{get:function(){throw new Error(`${t} is write only`)},set:function(e){this.events[t]=[e]}})}function id(i){class t extends ts{connection;_url;_protocols;readyState;constructor(r,s){super(),this.connection=r,this._url=r.url,this._protocols=s,this.readyState=0,i(r,{connect:(n,o)=>{if(n!=null){this.dispatchEvent({type:"error",message:n.toString()});return}this.readyState=1,this.dispatchEvent({type:"open"})},end:()=>{this.readyState=3,this.dispatchEvent({type:"close",reason:"closed"})},error:n=>{this.readyState=3,this.dispatchEvent({type:"error",message:n.toString()})},data:n=>{this.dispatchEvent({type:"message",data:n,source:this})}})}send(r){this.connection.send(r)}get url(){return this._url}get extensions(){return""}close(r){this.connection.close(r)}}return Bi(t.prototype,"close"),Bi(t.prototype,"error"),Bi(t.prototype,"message"),Bi(t.prototype,"open"),t}var is=class{url;websocketMethods;[es.RpcPeer.PROPERTY_PROXY_PROPERTIES];[es.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=["send","close"];constructor(t,e){this.url=t,this.websocketMethods=e,this[es.RpcPeer.PROPERTY_PROXY_PROPERTIES]={url:t}}send(t){return this.websocketMethods.send(t)}close(t){return this.websocketMethods.close(t)}};We.WebSocketConnection=is;var rs=class{WebSocket;serialize(t,e){throw new Error("WebSocketSerializer should only be used for deserialization.")}deserialize(t,e){if(this.WebSocket)return new this.WebSocket(t)}};We.WebSocketSerializer=rs});var Ao=_(Ye=>{"use strict";Object.defineProperty(Ye,"__esModule",{value:!0});Ye.EventRegistry=Ye.EventListenerRegisterImpl=void 0;Ye.getMixinEventName=To;var rd=Ke(),Nt=class{removeListener;constructor(t){this.removeListener=t}};Ye.EventListenerRegisterImpl=Nt;function To(i){let{event:t,mixinId:e}=i||{};return!t&&typeof i=="string"&&(t=i),t||(t=void 0),e?`${t}-mixin-${e}`:t}var sd=new Set([rd.ScryptedInterface.ScryptedDevice,"Logger"]),ss=class{systemListeners=new Set;listeners={};listen(t){let e=this.systemListeners;return e.add(t),new Nt(()=>{e.delete(t),t=void 0})}listenDevice(t,e,r){let s=To(e),n=`${t}#${s}`,o=this.listeners[n];return o||(o=new Set,this.listeners[n]=o),o.add(r),new Nt(()=>{o.delete(r),r=void 0})}notify(t,e,r,s,n,o){let{changed:a,mixinId:c}=o||{};if(s&&!a)return!1;let f={eventId:void 0,eventInterface:r,eventTime:e,property:s,mixinId:c};return this.notifyEventDetails(t,f,n)}notifyEventDetails(t,e,r,s){if(e.eventId||=Math.random().toString(36).substring(2),s||=e.eventInterface,e.property&&!e.mixinId||sd.has(s))for(let a of this.systemListeners)a(t,e,r);let n=this.listeners[`${t}#${s}`];if(n)for(let a of n)a(e,r);let o=this.listeners[`${t}#undefined`];if(o)for(let a of o)a(e,r);return!0}};Ye.EventRegistry=ss});var Oo=_(zi=>{"use strict";Object.defineProperty(zi,"__esModule",{value:!0});zi.SystemManagerImpl=void 0;var q=Ke(),nd=Ao(),ns=ue(),Xe=Xr();function od(i,t){let e=new os(i,t);return new Proxy(e,e)}var os=class{id;systemManager;customProperties;device;constructor(t,e){this.id=t,this.systemManager=e}toPrimitive(){return`ScryptedDevice-${this.id}`}ownKeys(t){let e=new Set(this.systemManager.state[this.id].interfaces.value),r=(0,Xe.getInterfaceMethods)(this.systemManager.descriptors||q.ScryptedInterfaceDescriptors,e),s=(0,Xe.getInterfaceProperties)(this.systemManager.descriptors||q.ScryptedInterfaceDescriptors,e);return[...r,...s]}getOwnPropertyDescriptor(t,e){let r=new Set(this.systemManager.state[this.id].interfaces.value),s=(0,Xe.getInterfaceMethods)(this.systemManager.descriptors||q.ScryptedInterfaceDescriptors,r),n=e.toString();if(s.includes(n))return{configurable:!0};if((0,Xe.getInterfaceProperties)(this.systemManager.descriptors||q.ScryptedInterfaceDescriptors,r).includes(n))return{configurable:!0,value:this.systemManager.state[this.id][n]?.value}}deleteProperty(t,e){let r=e.toString();return Object.keys(q.ScryptedInterfaceProperty).includes(r)?!1:(this.customProperties||=new Map,this.customProperties.set(e,void 0),!0)}set(t,e,r,s){let n=e.toString();return Object.keys(q.ScryptedInterfaceProperty).includes(n)?!1:(this.customProperties||=new Map,this.customProperties.set(e,r),!0)}get(t,e,r){if(e==="id")return this.id;if(this.customProperties?.has(e))return this.customProperties.get(e);let s=ns.RpcPeer.handleFunctionInvocations(this,t,e,r);if(s)return s;let n=new Set(this.systemManager.state[this.id].interfaces?.value||[]),o=e.toString();if(this.systemManager.propertyInterfaces?.[o]||Xe.propertyInterfaces[o])return this.systemManager.state[this.id]?.[e]?.value;if((0,Xe.isValidInterfaceMethod)(this.systemManager.descriptors||q.ScryptedInterfaceDescriptors,n,o))return q.ScryptedInterfaceDescriptors[q.ScryptedInterface.ScryptedDevice].methods.includes(o)?this[e].bind(this):new Proxy(()=>e,this)}ensureDevice(){return this.device||(this.device=this.systemManager.api.getDeviceById(this.id)),this.device}async apply(t,e,r){let s=t();return(await this.ensureDevice())[s](...r)}listen(t,e){return this.systemManager.listenDevice(this.id,t,e)}async setName(t){return this.systemManager.api.setDeviceProperty(this.id,q.ScryptedInterfaceProperty.name,t)}async setRoom(t){return this.systemManager.api.setDeviceProperty(this.id,q.ScryptedInterfaceProperty.room,t)}async setType(t){return this.systemManager.api.setDeviceProperty(this.id,q.ScryptedInterfaceProperty.type,t)}async setMixins(t){await(await this.systemManager.getComponent("plugins")).setMixins(this.id,t)}async probe(){return this.apply(()=>"probe",void 0,[])}},as=class{promise;constructor(t){this.promise=t}async removeListener(){try{let t=await this.promise;this.promise=void 0,t?.removeListener()}catch(t){console.error("removeListener",t)}}};function Ro(i){let t=i,e=t[ns.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]||[];return e.includes(null)||e.push(null),t[ns.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=e,i}var ls=class{api;state;deviceProxies={};log;events=new nd.EventRegistry;typesVersion;descriptors;propertyInterfaces;getDeviceState(t){return this.state[t]}getSystemState(){return this.state}getDeviceById(t,e){let r;if(this.state[t]){if(e!=null)return;r=t}else for(let n of Object.keys(this.state)){let o=this.state[n];if(o&&o[q.ScryptedInterfaceProperty.pluginId]?.value===t&&o[q.ScryptedInterfaceProperty.nativeId]?.value==e){r=n;break}}if(!r)return;let s=this.deviceProxies[r];return s||(s=this.deviceProxies[r]=od(r,this)),s}getDeviceByName(t){for(let e of Object.keys(this.state)){let r=this.state[e];if(r.interfaces?.value?.includes(q.ScryptedInterface.ScryptedPlugin)&&r.pluginId?.value===t)return this.getDeviceById(e);if(r.name.value===t)return this.getDeviceById(e)}}listen(t){return this.events.listen(Ro((e,r,s)=>t(this.getDeviceById(e),r,s)))}listenDevice(t,e,r){let{watch:s}=e||{};return s?this.events.listenDevice(t,e,(n,o)=>r(this.getDeviceById(t),n,o)):new as(this.api.listenDevice(t,e,Ro((n,o)=>r(this.getDeviceById(t),n,o))))}async removeDevice(t){return this.api.removeDevice(t)}getComponent(t){return this.api.getComponent(t)}setScryptedInterfaceDescriptors(t,e){return this.typesVersion=t,this.descriptors=e,this.propertyInterfaces=(0,Xe.getPropertyInterfaces)(e),this.api.setScryptedInterfaceDescriptors(t,e)}};zi.SystemManagerImpl=ls});var Mo=_(ji=>{"use strict";Object.defineProperty(ji,"__esModule",{value:!0});ji.ClusterManagerImpl=void 0;var cs=class{clusterMode;api;clusterWorkerId;clusterServicePromise;constructor(t,e,r){this.clusterMode=t,this.api=e,this.clusterWorkerId=r}getClusterWorkerId(){return this.clusterWorkerId}getClusterAddress(){return process.env.SCRYPTED_CLUSTER_ADDRESS}getClusterMode(){return this.clusterMode}async getClusterWorkers(){return(await this.getClusterService()).getClusterWorkers()}getClusterService(){return this.clusterServicePromise||=this.api.getComponent("cluster-fork"),this.clusterServicePromise}};ji.ClusterManagerImpl=cs});var Ho=_(Ui=>{"use strict";Object.defineProperty(Ui,"__esModule",{value:!0});Ui.setupPluginRemote=dd;Ui.attachPluginRemote=ud;var _t=Ke(),us=ue(),Do=Wr(),Lo=Eo(),ad=Po(),ds=$o(),ld=Oo(),cd=Mo();async function dd(i,t,e,r,s){try{i.constructorSerializerMap.get(Buffer)||i.addSerializer(Buffer,"Buffer",new Do.BufferSerializer);let o=await(await i.getParam("getRemote"))(t,e,r),a=i.tags.acl,c=(d,l)=>{if(l=l||s()[d],a&&l){l=Object.assign({},l);for(let m of Object.keys(l))a.shouldRejectProperty(d,m)&&delete l[m];let u=l.interfaces?.value;u&&(u=u.filter(m=>!a.shouldRejectInterface(d,m)),l.interfaces={value:u})}return l},f=()=>{let d=s();if(a){d=Object.assign({},d);for(let l of Object.keys(d)){if(a.shouldRejectDevice(l)){delete d[l];continue}d[l]=c(l,d[l])}}return d};return await o.setSystemState(f()),t.listen((d,l,u)=>{if(!a?.shouldRejectEvent(l.property===_t.ScryptedInterfaceProperty.id?u:d,l)){if(l.eventInterface===_t.ScryptedInterface.ScryptedDevice){l.property===_t.ScryptedInterfaceProperty.id?o.updateDeviceState(u,void 0):o.updateDeviceState(d,c(d));return}l.property&&!l.mixinId?o.notify(d,l,s()[d]?.[l.property]).catch(()=>{}):o.notify(d,l,u).catch(()=>{})}}),o}catch(n){throw new us.RPCResultError(i,"error while retrieving PluginRemote",n)}}function ud(i,t){let{createMediaManager:e,getServicePort:r,getDeviceConsole:s,getMixinConsole:n}=t||{};i.constructorSerializerMap.get(Buffer)||i.addSerializer(Buffer,"Buffer",new Do.BufferSerializer);let o={},a=new ds.WebSocketSerializer;i.addSerializer(ds.WebSocketConnection,"WebSocketConnection",a);let c,f=new Promise(d=>c=d);return i.params.getRemote=async(d,l,u)=>{a.WebSocket=(0,ds.createWebSocketClass)((x,T)=>{let{url:H}=x;if(H.startsWith("io://")||H.startsWith("ws://")){let F=H.substring(5);o[F]=T,T.connect(void 0,{close:O=>x.close(O),send:O=>x.send(O)})}else throw new Error("unsupported websocket")}),d=await t?.onGetRemote?.(d,l)||d;let m=new ld.SystemManagerImpl,g=new Lo.DeviceManagerImpl(m,s,n),k=new ad.EndpointManagerImpl,y=new cd.ClusterManagerImpl(void 0,d,void 0),R=await d.getMediaManager();R||(i.params.createMediaManager=async()=>e(m,g));let N=R||await e(m,g);i.params.mediaManager=N,m.api=d,g.api=d;let V=g.getDeviceLogger(void 0);m.log=V;let D={systemManager:m,deviceManager:g,endpointManager:k,mediaManager:N,clusterManager:y,log:V,pluginHostAPI:d,pluginRemoteAPI:void 0,serverVersion:u?.serverVersion,connect:void 0,fork:void 0,connectRPCObject:void 0};delete i.params.getRemote,k.api=d,k.deviceManager=g,k.mediaManager=N,k.pluginId=l;let te=new Lo.StorageImpl(g,void 0),he={[us.RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION]:!0,[us.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]:["notify","updateDeviceState","setSystemState","ioEvent","setNativeId"],getServicePort:r,async createDeviceState(x,T){return g.createDeviceState(x,T)},async ioEvent(x,T,H){let F=o[x];if(F)switch(T){case"message":F.data(H);break;case"close":F.end(),delete o[x];break}},async setNativeId(x,T,H){x===null&&(x=void 0),T?g.nativeIds.set(x?.toString(),{id:T,storage:H}):g.nativeIds.delete(x)},async updateDeviceState(x,T){T?(m.state[x]=T,m.events.notify(x,void 0,_t.ScryptedInterface.ScryptedDevice,void 0,T,{changed:!0})):(delete m.state[x],m.events.notify(void 0,void 0,_t.ScryptedInterface.ScryptedDevice,_t.ScryptedInterfaceProperty.id,x,{changed:!0}))},async notify(x,T,H,F,O,Kt){if(typeof T=="number"){let ie=T,re=H;if(F){let xe=m.state?.[x];if(!xe){V.w(`state not found for ${x}`);return}xe[F]=O,m.events.notify(x,ie,re,F,O.value,{changed:Kt})}else m.events.notify(x,ie,re,F,O,{changed:Kt})}else{let ie=T,re=H;if(ie.property&&!ie.mixinId){let xe=m.state?.[x];if(!xe){V.w(`state not found for ${x}`);return}xe[ie.property]=re,m.events.notifyEventDetails(x,ie,re.value)}else m.events.notifyEventDetails(x,ie,re)}},async setSystemState(x){m.state=x,g.pruneMixinStorage(),c(D)},async loadZip(x,T,H){let F={__filename:void 0,deviceManager:g,systemManager:m,mediaManager:N,endpointManager:k,localStorage:te,pluginHostAPI:d,WebSocket:function(O){if(typeof O=="string")throw new Error("unsupported websocket");return O},pluginRuntimeAPI:D};F.pluginRuntimeAPI=D;try{return await t.onLoadZip(D,F,x,T,H)}catch(O){throw console.error("plugin start/fork failed",O),O}}};return D.pluginRemoteAPI=he,he},f}});var ps=_(vt=>{"use strict";Object.defineProperty(vt,"__esModule",{value:!0});vt.createDuplexRpcPeer=md;vt.createRpcSerializer=Io;vt.createRpcDuplexSerializer=hs;vt.createDataChannelSerializer=fd;var hd=Wr(),pd=ue();function md(i,t,e,r){let s=hs(r),n=new pd.RpcPeer(i,t,(o,a,c)=>{try{s.sendMessage(o,a,c)}catch(f){a?.(f),e.destroy()}});return s.setupRpcPeer(n),e.on("data",o=>s.onData(o)),e.on("close",s.onDisconnected),e.on("error",s.onDisconnected),n}function Io(i){let t,{sendMessageBuffer:e,sendMessageFinish:r}=i,s=!0,n=()=>{s=!1,t.kill("connection closed.")},o=(u,m,g)=>{if(!s){m?.(new Error("peer disconnected"));return}let k=g?.buffers;if(k)for(let y of k)e(y);r(u)},a;return{kill:u=>{t.kill(u)},sendMessage:o,setupRpcPeer:u=>{t=u,t.addSerializer(Buffer,"Buffer",new hd.SidebandBufferSerializer),t.constructorSerializerMap.set(Uint8Array,"Buffer")},onMessageBuffer:u=>{a=a||{},a.buffers||=[],a.buffers.push(u)},onMessageFinish:u=>{let m=a;a=void 0,t.handleMessage(u,m)},onDisconnected:n}}function hs(i){let t=(l,u)=>{let m=Buffer.alloc(5);m.writeUInt32BE(u.length+1,0),m.writeUInt8(l,4),i.write(Buffer.concat([m,u]))},e=l=>u=>t(l,u),r=e(1),s=e(0),n=Io({sendMessageBuffer:r,sendMessageFinish:l=>s(Buffer.from(JSON.stringify(l)))}),o,a,c,f;return{onData:l=>{for(;l.length;){if(!a){if(o?o=Buffer.concat([o,l]):o=l,o.length<5)return;l=o.slice(5);let g=o.readUInt32BE(0)-1;f=o.readUInt8(4),l.length>=g&&f===0?(a=l.length===g?l:l.slice(0,g),c=g,l=l.slice(g)):(a=Buffer.alloc(g),c=0),o=void 0}let u=a.length-c;if(u){let g=l.slice(0,u);l=l.slice(u),a.set(g,c),c+=g.length}if(c!==a.length)return;let m=a;if(a=void 0,f===0)try{let g=JSON.parse(m.toString());n.onMessageFinish(g)}catch(g){n.kill("message parse failure "+g.message)}else n.onMessageBuffer(m)}},setupRpcPeer:n.setupRpcPeer,sendMessage:n.sendMessage,onDisconnected:n.onDisconnected}}function fd(i){let t;function r(){if(!t||t.length===0)return;let a=t;t=void 0;for(let c of a){let f=0;for(;f<c.length;){let d=c.length-f,l=Math.min(d,16384),u=c.subarray(f,f+l);i.send(u),f+=l}}}function s(a){let c=!!t;t||(t=[]),t.push(a),c||setTimeout(()=>r(),0)}return hs({write:a=>{s(a)}})}});var No=_((lp,gd)=>{gd.exports={name:"@scrypted/client",version:"1.3.26",description:"",main:"dist/packages/client/src/index.js",scripts:{prebuild:"rimraf dist",build:"tsc --outDir dist",prepublishOnly:"npm run build",test:'echo "Error: no test specified" && exit 1'},author:"",license:"ISC",devDependencies:{"@types/ip":"^1.1.3","@types/node":"^24.0.10","@types/ws":"^8.18.1","ts-node":"^10.9.2",typescript:"^5.8.3"},peerDependencies:{"@scrypted/types":"^0.5.44"},dependencies:{"engine.io-client":"^6.6.3","follow-redirects":"^1.15.9",rimraf:"^6.0.1"}}});var zo=_(Ft=>{"use strict";Object.defineProperty(Ft,"__esModule",{value:!0});Ft.isIPV4Address=Fo;Ft.isIPV6Address=Bo;Ft.isIPAddress=vd;var bd=/^(\d{1,3}\.){3,3}\d{1,3}$/,_d=/^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;function Fo(i){return bd.test(i)}function Bo(i){return _d.test(i)}function vd(i){return Fo(i)||Bo(i)}});var ms=_(Y=>{"use strict";Object.defineProperty(Y,"__esModule",{value:!0});Y.fetchStatusCodeOk=jo;Y.checkStatus=Uo;Y.getFetchMethod=qo;Y.getHttpFetchAccept=Vo;Y.hasHeader=qi;Y.removeHeader=Ko;Y.setHeader=Vi;Y.setDefaultHttpFetchAccept=Wo;Y.createHeadersArray=Yo;Y.createStringOrBufferBody=Xo;Y.domFetchParseIncomingMessage=Go;Y.domFetch=yd;function jo(i){return i>=200&&i<=299}function Uo(i){if(!jo(i))throw new Error(`http response statusCode ${i}`);return!0}function qo(i){return i.method||(i.body?"POST":"GET")}function Vo(i){switch(i){case"json":return"application/json";case"text":return"text/plain"}}function qi(i,t){return t=t.toLowerCase(),i.find(([e])=>e.toLowerCase()===t)}function Ko(i,t){t=t.toLowerCase();let e=i.filter(([r,s])=>r.toLowerCase()!==t);i.length=0,e.forEach(r=>i.push(r))}function Vi(i,t,e){Ko(i,t),i.push([t,e])}function Wo(i,t){if(qi(i,"Accept"))return;let e=Vo(t);e&&Vi(i,"Accept",e)}function Yo(i){let t=[];if(!i)return t;if(i instanceof Headers){for(let[e,r]of i.entries())t.push([e,r]);return t}if(i instanceof Array){for(let[e,r]of i)t.push([e,r]);return t}for(let e of Object.keys(i)){let r=i[e];t.push([e,r])}return t}function Xo(i,t){let e;return typeof t=="object"?(t=JSON.stringify(t),e="application/json"):typeof t=="string"&&(e="text/plain"),e&&!qi(i,"Content-Type")&&Vi(i,"Content-Type",e),qi(i,"Content-Length")||(t=Buffer.from(t),Vi(i,"Content-Length",t.length.toString())),t}async function Go(i,t){switch(t){case"json":return i.json();case"text":return i.text();case"readable":return i}return new Uint8Array(await i.arrayBuffer())}async function yd(i){let t=Yo(i.headers);Wo(t,i.responseType);let{body:e}=i;e&&!(e instanceof ReadableStream)&&(e=Xo(t,e));let r,s;i.timeout&&(r=new AbortController,s=setTimeout(()=>r.abort(),i.timeout),i.signal?.addEventListener("abort",()=>r.abort(i.signal?.reason)));try{let{url:n}=i,o=await fetch(n,{method:qo(i),credentials:i.withCredentials?"include":void 0,headers:t,signal:r?.signal||i.signal,body:e});if(i?.checkStatusCode===void 0||i?.checkStatusCode)try{if(!(typeof i?.checkStatusCode=="function"?i.checkStatusCode:Uo)(o.status))throw new Error(`http response statusCode ${o.status}`)}catch(a){throw o.arrayBuffer().catch(()=>{}),a}return{statusCode:o.status,headers:o.headers,body:await Go(o,i.responseType)}}finally{clearTimeout(s)}}});var Ge={};Ea(Ge,{default:()=>xd});var xd,Qe=Sa(()=>{"use strict";xd={}});var Zo=_(zt=>{"use strict";Object.defineProperty(zt,"__esModule",{value:!0});zt.getHttpFetchParser=Qo;zt.httpFetchParseIncomingMessage=Jo;zt.httpFetch=Ed;var Bt=ms();async function Ki(i){let t=[];i.on("data",r=>t.push(r));let{once:e}=(Qe(),et(Ge));return await e(i,"end"),Buffer.concat(t)}var Cd={async parse(i){return(await Ki(i)).toString()}},wd={async parse(i){return JSON.parse((await Ki(i)).toString())}},kd={async parse(i){return Ki(i)}},Sd={async parse(i){return i}};function Qo(i){switch(i){case"json":return wd;case"text":return Cd;case"readable":return Sd}return kd}function Jo(i,t){return Qo(t).parse(i)}async function Ed(i){let t=(0,Bt.createHeadersArray)(i.headers);(0,Bt.setDefaultHttpFetchAccept)(t,i.responseType);let{once:e}=(Qe(),et(Ge)),{PassThrough:r,Readable:s}=(Qe(),et(Ge)),{http:n,https:o}=(Qe(),et(Ge)),{url:a}=i,f=a.toString().startsWith("https:")?o:n,{body:d}=i;if(d&&!(d instanceof s)){let y=new r;y.write(Buffer.from((0,Bt.createStringOrBufferBody)(t,d))),y.end(),d=y}let l,u;i.timeout&&(l=new AbortController,u=setTimeout(()=>l.abort(),i.timeout),i.signal?.addEventListener("abort",()=>l.abort(i.signal?.reason)));let m=l?.signal||i.signal;m?.addEventListener("abort",()=>k.destroy(new Error(i.signal?.reason||"abort")));let g={};for(let[y,R]of t)g[y]?g[y].push(R):g[y]=[R];let k=f.request(a,{method:(0,Bt.getFetchMethod)(i),rejectUnauthorized:i.rejectUnauthorized,family:i.family,headers:g,signal:m,timeout:i.timeout});d?d.pipe(k):k.end();try{let[y]=await e(k,"response");if(i?.checkStatusCode===void 0||i?.checkStatusCode)try{let N=typeof i?.checkStatusCode=="function"?i.checkStatusCode:Bt.checkStatus;if(!y.statusCode||!N(y.statusCode))throw new Error(`http response statusCode ${y.statusCode}`)}catch(N){throw Ki(y).catch(()=>{}),N}let R=new Headers;for(let[N,V]of Object.entries(y.headers))for(let D of typeof V=="string"?[V]:V)R.append(N,D);return{statusCode:y.statusCode,headers:R,body:await Jo(y,i.responseType)}}finally{clearTimeout(u)}}});var ra=_(A=>{"use strict";var Pd=A&&A.__createBinding||(Object.create?function(i,t,e,r){r===void 0&&(r=e);var s=Object.getOwnPropertyDescriptor(t,e);(!s||("get"in s?!t.__esModule:s.writable||s.configurable))&&(s={enumerable:!0,get:function(){return t[e]}}),Object.defineProperty(i,r,s)}:function(i,t,e,r){r===void 0&&(r=e),i[r]=t[e]}),$d=A&&A.__setModuleDefault||(Object.create?function(i,t){Object.defineProperty(i,"default",{enumerable:!0,value:t})}:function(i,t){i.default=t}),vs=A&&A.__importStar||function(){var i=function(t){return i=Object.getOwnPropertyNames||function(e){var r=[];for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(r[r.length]=s);return r},i(t)};return function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r=i(t),s=0;s<r.length;s++)r[s]!=="default"&&Pd(e,t,r[s]);return $d(e,t),e}}(),Td=A&&A.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(A,"__esModule",{value:!0});A.ScryptedClientLoginError=A.rpc_serializer=A.rpc=void 0;A.logoutScryptedClient=Fd;A.getCurrentBaseUrl=Bd;A.loginScryptedClient=ia;A.checkScryptedClientLogin=_s;A.redirectScryptedLogin=zd;A.combineBaseUrl=qt;A.redirectScryptedLogout=jd;A.connectScryptedClient=Ud;var fs=vs(Zn()),Ad=eo(),Rd=io(),Od=Ho(),bs=ue(),ea=ps(),Md=Td(No()),Ld=zo(),Dd=ms(),Hd=Zo();A.rpc=vs(ue());A.rpc_serializer=vs(ps());var jt;try{throw new Error}catch{jt=Dd.domFetch}var Id=bs.RpcPeer.generateId();function gs(i,t){return new Promise((e,r)=>{let s=a=>{o(),r(a)},n=(...a)=>{o(),e(a)},o=()=>{i.removeListener("error",s),i.removeListener(t,n)};i.once("error",s),i.once(t,n)})}function ta(){return globalThis.navigator?.userAgent.includes("InstalledApp")}function Nd(){return globalThis.matchMedia?.("(display-mode: standalone)").matches||ta()}async function Fd(i){let t=qt(i,"logout");return(await jt({url:t,withCredentials:!0,responseType:"json",rejectUnauthorized:!1})).body}function Bd(){let i=new URL(window.location.href);i.search="",i.hash="";let e=window.location.pathname.split("/"),r=e.findIndex(n=>n==="endpoint");if(r===-1)return;let s=e.slice(0,r);return s.push(""),i.pathname=s.join("/"),i.toString()}async function ia(i){let{baseUrl:t,username:e,password:r,change_password:s,maxAge:n}=i;!n&&Nd()&&(n=365*24*60*60*1e3);let o=qt(t,"login"),a=await jt({url:o,body:{username:e,password:r,change_password:s,maxAge:n},rejectUnauthorized:!1,withCredentials:!0,responseType:"json"});if(a.statusCode!==200)throw new Error("status "+a.statusCode);let{body:c}=a;return{error:c.error,authorization:c.authorization,queryToken:c.queryToken,token:c.token,addresses:c.addresses,externalAddresses:c.externalAddresses,hostname:c.hostname,scryptedCloud:a.headers.get("x-scrypted-cloud")==="true",directAddress:a.headers.get("x-scrypted-direct-address"),cloudAddress:a.headers.get("x-scrypted-cloud-address"),serverId:a.headers.get("x-scrypted-server-id")}}async function _s(i){let{baseUrl:t}=i||{},e=qt(t,"login"),r=new Headers;if(i?.previousLoginResult?.queryToken){let o=i?.previousLoginResult.username+":"+i.previousLoginResult.token,a=Buffer.from(o).toString("base64");r.set("Authorization",`Basic ${a}`)}let s=await jt({url:e,withCredentials:!0,headers:r,rejectUnauthorized:!1,responseType:"json"}),{body:n}=s;return{baseUrl:t,hostname:n.hostname,redirect:n.redirect,username:n.username,expiration:n.expiration,hasLogin:!!n.hasLogin,error:n.error,authorization:n.authorization,queryToken:n.queryToken,token:n.token,addresses:n.addresses,externalAddresses:n.externalAddresses,scryptedCloud:s.headers.get("x-scrypted-cloud")==="true",directAddress:s.headers.get("x-scrypted-direct-address"),cloudAddress:s.headers.get("x-scrypted-cloud-address"),serverId:s.headers.get("x-scrypted-server-id")}}var Ut=class extends Error{result;constructor(t){super(t.error),this.result=t}};A.ScryptedClientLoginError=Ut;function zd(i){let{baseUrl:t,redirect:e}=i||{};if(e=e||"/endpoint/@scrypted/core/public/",t){let s=new URL(e,t);s.searchParams.set("redirect_uri",window.location.href),e=s.toString()}else e=`${e}?redirect_uri=${encodeURIComponent(window.location.href)}`;let r=e;console.log("redirect_uri",r),globalThis.location.href=r}function qt(i,t){return i?new URL(t,i).toString():"/"+t}async function jd(i){globalThis.location.href=qt(i,"logout")}async function Ud(i){let t=Date.now(),{baseUrl:e,pluginId:r,clientName:s,username:n,password:o}=i,a,c,f,d,l,u,m,g,k,y;console.log("@scrypted/client",Md.default.version);let R={},V=!globalThis.navigator?.userAgent.includes("Chrome")||ta(),D=!1;if(n&&o){let C=await ia(i);C.authorization&&(R.Authorization=C.authorization),f=C.addresses,d=C.externalAddresses,l=C.scryptedCloud,u=C.directAddress,m=C.cloudAddress,a=C.authorization,c=C.queryToken,k=C.token,g=C.hostname,y=C.serverId,console.log("login result",Date.now()-t,C)}else{let X=function(L){if(L.error||L.redirect)throw new Ut(L);if(!L.authorization||!L.username||!L.queryToken)throw console.error(L),new Error("malformed login result");return L},C=new Set;if(i?.previousLoginResult?.token){for(let L of[...i?.previousLoginResult?.localAddresses||[],i?.previousLoginResult?.directAddress])L&&(V||i.direct)&&C.add(L);for(let L of[...i?.previousLoginResult?.externalAddresses||[],i?.previousLoginResult?.cloudAddress])L&&C.add(L)}let se=[...C].map(L=>_s({baseUrl:L,previousLoginResult:i?.previousLoginResult}).then(X)),Xt=_s({baseUrl:e,previousLoginResult:i?.previousLoginResult}).then(X);se.push(Xt);let M;try{M=await Promise.any(se),D||=M.baseUrl!==e}catch{M=await Xt}if(D&&console.log("Found direct login. Allowing alternate addresses."),M.error||M.redirect)throw new Ut(M);f=M.addresses,d=M.externalAddresses,l=M.scryptedCloud,u=M.directAddress,m=M.cloudAddress,n=M.username,a=M.authorization,c=M.queryToken,k=M.token,g=M.hostname,y=M.serverId,console.log("login checked",Date.now()-t,M)}let te,he=`endpoint/${r}/engine.io/api`,x=e?new URL(he,e).pathname:"/"+he,T=Math.random().toString(36).substring(3,10),H={path:x,query:{cacheBust:T},withCredentials:!0,extraHeaders:R,rejectUnauthorized:!1,transports:i?.transports},F=e||`${globalThis.location.protocol}//${globalThis.location.host}`,O=[],Kt=V;D||=l,(D&&i.local===void 0&&Kt||i.local)&&f&&O.push(...f);let ie=u&&(V||!(0,Ld.isIPAddress)(u));if((D&&i.direct===void 0&&ie||i.direct)&&u&&O.push(u),D&&i.direct===void 0||i.direct){m&&O.push(m);for(let C of d||[])O.push(C)}let re=!!O.length;console.log({tryLocalAddressess:re});let xe={...H,extraHeaders:{...H.extraHeaders}};xe.extraHeaders.Authorization||=a;let yt=[],Wt=[];if(re)for(let C of new Set(O)){console.log("trying",C);let X=new fs.Socket(C,xe);yt.push(X),Wt.push((async()=>(await gs(X,"open"),{connectionType:"http-direct",ready:X,address:C}))())}let ca=[...Wt];Wt.push((async()=>{let C=re?1e3:0;if(console.log("waiting",C),C)try{let se=Promise.any(ca);await(0,Ad.timeoutPromise)(C,se),console.log("found direct connection, aborting scrypted cloud connection");return}catch{}let X=new fs.Socket(F,H);return yt.push(X),await gs(X,"open"),{ready:X,address:F,connectionType:l?"http-cloud":"http"}})());let da=Promise.any(Wt),{ready:Os,connectionType:Ms,address:Yt,rpcPeer:Ce}=await da;console.log("connected",Ms,Yt),te=Os,yt=yt.filter(C=>C!==Os),yt.forEach(C=>{try{C.close()}catch{}});try{if(!Ce){let P=(0,ea.createRpcSerializer)({sendMessageBuffer:$=>te.send($),sendMessageFinish:$=>te.send(JSON.stringify($))});Ce=new bs.RpcPeer(s||"engine.io-client","api",($,z,ne)=>{try{P.sendMessage($,z,ne)}catch(Qt){z?.(Qt)}}),te.on("message",$=>{$.constructor===Buffer||$.constructor===ArrayBuffer?P.onMessageBuffer(Buffer.from($)):P.onMessageFinish(JSON.parse($))}),P.setupRpcPeer(Ce)}let C=await(0,Od.attachPluginRemote)(Ce,void 0),{serverVersion:X,systemManager:se,deviceManager:Xt,endpointManager:M,mediaManager:L,clusterManager:ua}=C;console.log("api attached",Date.now()-t),L.createMediaObject=async(P,$,z)=>new Rd.MediaObject($,P,z);let[ha]=await Promise.all([(async()=>{try{return!!await se.getComponent("info")}catch{}return!1})()]);console.log("api initialized",Date.now()-t);let pa=Object.keys(se.getSystemState()).map(P=>se.getDeviceById(P)).find(P=>P.pluginId==="@scrypted/core"&&P.nativeId===`user:${n}`),Gt=new Map,ma=new FinalizationRegistry(P=>{P.kill("object finalized")}),fa=(P,$)=>{if(!$?.dedicatedTransport){let ne=Gt.get(P.port);if(ne)return ne}let z=(async()=>{let ne="engine.io/connectRPCObject",Jt={path:new URL(ne,Yt).pathname,query:{cacheBust:T,clusterObject:JSON.stringify(P),...c},withCredentials:!0,extraHeaders:R,rejectUnauthorized:!1,transports:i?.transports},pe=new fs.Socket(Yt,Jt),Je=!1,we,Q,oe,Ds=()=>{we&&(clearTimeout(we),we=void 0),Q&&(clearTimeout(Q),Q=void 0)},Hs=$?.dedicatedTransport?.receiveTimeout?()=>{we&&clearTimeout(we),we=setTimeout(()=>{oe&&oe.kill("receive timeout")},$.dedicatedTransport.receiveTimeout)}:void 0,Yi=$?.dedicatedTransport?.sendTimeout?()=>{Q&&clearTimeout(Q),Q=setTimeout(()=>{oe&&oe.kill("send timeout")},$.dedicatedTransport.sendTimeout)}:void 0;pe.on("close",()=>{if(oe?.kill("socket closed"),$?.dedicatedTransport||Gt.delete(P.port),!Je)throw new Error("peer disconnected before setup completed")});try{await gs(pe,"open");let Ze=(0,ea.createRpcDuplexSerializer)({write:xt=>{Yi?.(),pe.send(xt)}});return pe.on("message",xt=>{Hs?.(),Ze.onData(Buffer.from(xt))}),oe=new bs.RpcPeer(s||"engine.io-client","cluster-proxy",(xt,Is,_a)=>{try{Yi?.(),Ze.sendMessage(xt,Is,_a)}catch(va){Is?.(va)}}),oe.killedSafe.finally(()=>{Ds(),pe.close()}),Ze.setupRpcPeer(oe),oe.tags.localPort=Id,Je=!0,Hs?.(),Yi?.(),oe}catch(Ze){throw Ds(),console.error("failure ipc connect",Ze),pe.close(),Ze}})();return $?.dedicatedTransport||Gt.set(P.port,z),z},ga=async(P,$)=>{let z=await Gt.get($);return z?.remoteWeakProxies?Object.values(z.remoteWeakProxies).find(ne=>ne.deref()?.__cluster?.proxyId==P)?.deref():null},ba=async(P,$)=>{let z=P?.__cluster;if(!z)return P;let{port:ne,proxyId:Qt}=z,Jt=await ga(Qt,ne);if(Jt)return Jt;try{let Je=await fa(z,$),we=await Je.getParam("connectRPCObject");try{let Q=await we(z);if(!Q)throw new Error("ipc object not found?");return $?.dedicatedTransport&&ma.register(Q,Je),Q}catch(Q){throw $?.dedicatedTransport&&Je.kill("connectRPCObject failed"),Q}}catch(pe){return console.error("failure ipc",pe),P}},Ls={userId:pa?.id,serverVersion:X,username:n,pluginRemoteAPI:void 0,address:Yt,connectionType:Ms,admin:ha,systemManager:se,clusterManager:ua,deviceManager:Xt,endpointManager:M,mediaManager:L,disconnect(){Ce.kill("disconnect requested")},pluginHostAPI:void 0,rpcPeer:Ce,loginResult:{username:n,token:k,directAddress:u,localAddresses:f,externalAddresses:d,scryptedCloud:l,queryToken:c,authorization:a,cloudAddress:m,hostname:g,serverId:y},connectRPCObject:ba,fork:void 0,connect:void 0};return te.on("close",()=>{Ce.kill("socket closed")}),Ce.killed.finally(()=>{te.close(),Ls.onClose?.()}),Ls}catch(C){throw te.close(),C}}});var ei=globalThis,ti=ei.ShadowRoot&&(ei.ShadyCSS===void 0||ei.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Xi=Symbol(),Fs=new WeakMap,Ct=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Xi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(ti&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=Fs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Fs.set(e,t))}return t}toString(){return this.cssText}},Oe=i=>new Ct(typeof i=="string"?i:i+"",void 0,Xi),S=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new Ct(e,i,Xi)},Bs=(i,t)=>{if(ti)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=ei.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Gi=ti?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return Oe(e)})(i):i;var{is:$a,defineProperty:Ta,getOwnPropertyDescriptor:Aa,getOwnPropertyNames:Ra,getOwnPropertySymbols:Oa,getPrototypeOf:Ma}=Object,ii=globalThis,zs=ii.trustedTypes,La=zs?zs.emptyScript:"",Da=ii.reactiveElementPolyfillSupport,wt=(i,t)=>i,Qi={toAttribute(i,t){switch(t){case Boolean:i=i?La:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Us=(i,t)=>!$a(i,t),js={attribute:!0,type:String,converter:Qi,reflect:!1,useDefault:!1,hasChanged:Us};Symbol.metadata??=Symbol("metadata"),ii.litPropertyMetadata??=new WeakMap;var me=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=js){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Ta(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:n}=Aa(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let a=s?.call(this);n?.call(this,o),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??js}static _$Ei(){if(this.hasOwnProperty(wt("elementProperties")))return;let t=Ma(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(wt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(wt("properties"))){let e=this.properties,r=[...Ra(e),...Oa(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(Gi(s))}else t!==void 0&&e.push(Gi(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Bs(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:Qi).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=r.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Qi;this._$Em=s;let a=o.fromAttribute(e,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,r,s=!1,n){if(t!==void 0){let o=this.constructor;if(s===!1&&(n=this[t]),r??=o.getPropertyOptions(t),!((r.hasChanged??Us)(n,e)||r.useDefault&&r.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,n]of r){let{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};me.elementStyles=[],me.shadowRootOptions={mode:"open"},me[wt("elementProperties")]=new Map,me[wt("finalized")]=new Map,Da?.({ReactiveElement:me}),(ii.reactiveElementVersions??=[]).push("2.1.2");var Zi=globalThis,qs=i=>i,ri=Zi.trustedTypes,Vs=ri?ri.createPolicy("lit-html",{createHTML:i=>i}):void 0,er="$lit$",fe=`lit$${Math.random().toFixed(9).slice(2)}$`,tr="?"+fe,Ha=`<${tr}>`,De=document,St=()=>De.createComment(""),Et=i=>i===null||typeof i!="object"&&typeof i!="function",ir=Array.isArray,Qs=i=>ir(i)||typeof i?.[Symbol.iterator]=="function",Ji=`[ 	
\f\r]`,kt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ks=/-->/g,Ws=/>/g,Me=RegExp(`>|${Ji}(?:([^\\s"'>=/]+)(${Ji}*=${Ji}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ys=/'/g,Xs=/"/g,Js=/^(?:script|style|textarea|title)$/i,rr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),h=rr(1),G=rr(2),lu=rr(3),He=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Gs=new WeakMap,Le=De.createTreeWalker(De,129);function Zs(i,t){if(!ir(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Vs!==void 0?Vs.createHTML(t):t}var en=(i,t)=>{let e=i.length-1,r=[],s,n=t===2?"<svg>":t===3?"<math>":"",o=kt;for(let a=0;a<e;a++){let c=i[a],f,d,l=-1,u=0;for(;u<c.length&&(o.lastIndex=u,d=o.exec(c),d!==null);)u=o.lastIndex,o===kt?d[1]==="!--"?o=Ks:d[1]!==void 0?o=Ws:d[2]!==void 0?(Js.test(d[2])&&(s=RegExp("</"+d[2],"g")),o=Me):d[3]!==void 0&&(o=Me):o===Me?d[0]===">"?(o=s??kt,l=-1):d[1]===void 0?l=-2:(l=o.lastIndex-d[2].length,f=d[1],o=d[3]===void 0?Me:d[3]==='"'?Xs:Ys):o===Xs||o===Ys?o=Me:o===Ks||o===Ws?o=kt:(o=Me,s=void 0);let m=o===Me&&i[a+1].startsWith("/>")?" ":"";n+=o===kt?c+Ha:l>=0?(r.push(f),c.slice(0,l)+er+c.slice(l)+fe+m):c+fe+(l===-2?a:m)}return[Zs(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},Pt=class i{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0,a=t.length-1,c=this.parts,[f,d]=en(t,e);if(this.el=i.createElement(f,r),Le.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(s=Le.nextNode())!==null&&c.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let l of s.getAttributeNames())if(l.endsWith(er)){let u=d[o++],m=s.getAttribute(l).split(fe),g=/([.?@])?(.*)/.exec(u);c.push({type:1,index:n,name:g[2],strings:m,ctor:g[1]==="."?ni:g[1]==="?"?oi:g[1]==="@"?ai:Ne}),s.removeAttribute(l)}else l.startsWith(fe)&&(c.push({type:6,index:n}),s.removeAttribute(l));if(Js.test(s.tagName)){let l=s.textContent.split(fe),u=l.length-1;if(u>0){s.textContent=ri?ri.emptyScript:"";for(let m=0;m<u;m++)s.append(l[m],St()),Le.nextNode(),c.push({type:2,index:++n});s.append(l[u],St())}}}else if(s.nodeType===8)if(s.data===tr)c.push({type:2,index:n});else{let l=-1;for(;(l=s.data.indexOf(fe,l+1))!==-1;)c.push({type:7,index:n}),l+=fe.length-1}n++}}static createElement(t,e){let r=De.createElement("template");return r.innerHTML=t,r}};function Ie(i,t,e=i,r){if(t===He)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl,n=Et(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=Ie(i,s._$AS(i,t.values),s,r)),t}var si=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??De).importNode(e,!0);Le.currentNode=s;let n=Le.nextNode(),o=0,a=0,c=r[0];for(;c!==void 0;){if(o===c.index){let f;c.type===2?f=new tt(n,n.nextSibling,this,t):c.type===1?f=new c.ctor(n,c.name,c.strings,this,t):c.type===6&&(f=new li(n,this,t)),this._$AV.push(f),c=r[++a]}o!==c?.index&&(n=Le.nextNode(),o++)}return Le.currentNode=De,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},tt=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ie(this,t,e),Et(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==He&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Qs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&Et(this._$AH)?this._$AA.nextSibling.data=t:this.T(De.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Pt.createElement(Zs(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new si(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=Gs.get(t.strings);return e===void 0&&Gs.set(t.strings,e=new Pt(t)),e}k(t){ir(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let n of t)s===e.length?e.push(r=new i(this.O(St()),this.O(St()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=qs(t).nextSibling;qs(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ne=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=p}_$AI(t,e=this,r,s){let n=this.strings,o=!1;if(n===void 0)t=Ie(this,t,e,0),o=!Et(t)||t!==this._$AH&&t!==He,o&&(this._$AH=t);else{let a=t,c,f;for(t=n[0],c=0;c<n.length-1;c++)f=Ie(this,a[r+c],e,c),f===He&&(f=this._$AH[c]),o||=!Et(f)||f!==this._$AH[c],f===p?t=p:t!==p&&(t+=(f??"")+n[c+1]),this._$AH[c]=f}o&&!s&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ni=class extends Ne{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},oi=class extends Ne{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},ai=class extends Ne{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=Ie(this,t,e,0)??p)===He)return;let r=this._$AH,s=t===p&&r!==p||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==p&&(r===p||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},li=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Ie(this,t)}},tn={M:er,P:fe,A:tr,C:1,L:en,R:si,D:Qs,V:Ie,I:tt,H:Ne,N:oi,U:ai,B:ni,F:li},Ia=Zi.litHtmlPolyfillSupport;Ia?.(Pt,tt),(Zi.litHtmlVersions??=[]).push("3.3.3");var rn=(i,t,e)=>{let r=e?.renderBefore??t,s=r._$litPart$;if(s===void 0){let n=e?.renderBefore??null;r._$litPart$=s=new tt(t.insertBefore(St(),n),n,void 0,e??{})}return s._$AI(i),s};var sr=globalThis,v=class extends me{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=rn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return He}};v._$litElement$=!0,v.finalized=!0,sr.litElementHydrateSupport?.({LitElement:v});var Na=sr.litElementPolyfillSupport;Na?.({LitElement:v});(sr.litElementVersions??=[]).push("4.2.2");var Fa={feeding:{domain:"binary_sensor",translationKeys:["feeding"],idSuffixes:["_feeding"]},bowlFill1:{domain:"sensor",translationKeys:["bowl_fill_1"],idSuffixes:["_bowl_fill_1","_bowl_fill_hopper_1"]},bowlFill2:{domain:"sensor",translationKeys:["bowl_fill_2"],idSuffixes:["_bowl_fill_2","_bowl_fill_hopper_2"]},desiccantDays:{domain:"sensor",translationKeys:["desiccant_days","desiccant_left"],idSuffixes:["_desiccant_days","_desiccant_left"]},schedule:{domain:"sensor",translationKeys:["schedule"],idSuffixes:["_schedule"]},scheduleCardState:{domain:"sensor",translationKeys:["schedule_card_state"],idSuffixes:["_schedule_card_state"]},feedButton:{domain:"button",translationKeys:["feed"],idSuffixes:["_feed"]},feedButtonHopper1:{domain:"button",translationKeys:["feed_hopper_1"],idSuffixes:["_feed_hopper_1"]},feedButtonHopper2:{domain:"button",translationKeys:["feed_hopper_2"],idSuffixes:["_feed_hopper_2"]},cancelFeedButton:{domain:"button",translationKeys:["cancel_feed"],idSuffixes:["_cancel_feed"]},feedAmount:{domain:"number",translationKeys:["feed_amount"],idSuffixes:["_feed_amount"]},feedAmountHopper1:{domain:"number",translationKeys:["feed_amount_hopper_1"],idSuffixes:["_feed_amount_hopper_1"]},feedAmountHopper2:{domain:"number",translationKeys:["feed_amount_hopper_2"],idSuffixes:["_feed_amount_hopper_2"]},cloudSwitch:{domain:"switch",translationKeys:["cloud","petkit_cloud"],idSuffixes:["_cloud","_petkit_cloud"]},cloudConnection:{domain:"sensor",translationKeys:["cloud_connection"],idSuffixes:["_cloud_connection"]},nightVisionSwitch:{domain:"switch",translationKeys:["night","night_vision"],idSuffixes:["_night","_night_vision"]},statusLedSwitch:{domain:"switch",translationKeys:["light","status_led"],idSuffixes:["_light","_status_led"]},microphoneSwitch:{domain:"switch",translationKeys:["microphone"],idSuffixes:["_microphone"]},volume:{domain:"number",translationKeys:["volume"],idSuffixes:["_volume"]},lastSeenPet:{domain:"sensor",translationKeys:["last_seen_pet"],idSuffixes:["_last_seen_pet"]},dishBefore:{domain:"image",translationKeys:["dish_before"],idSuffixes:["_dish_before"]},dishAfter:{domain:"image",translationKeys:["dish_after"],idSuffixes:["_dish_after"]},wifiNetwork:{domain:"sensor",translationKeys:["wifi_network","wifi","rssi"],idSuffixes:["_wifi_network","_wifi","_rssi"]},lastDetection:{domain:"sensor",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionsToday:{domain:"sensor",translationKeys:["detections_today"],idSuffixes:["_detections_today"]},lastDetectionImage:{domain:"image",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},pendingFace:{domain:"image",translationKeys:["pending_face"],idSuffixes:["_pending_face"]}};function ci(i){return i.slice(0,i.indexOf("."))}function nr(i){return i.slice(i.indexOf(".")+1)}function Ba(i,t){if(ci(i.entity_id)!==t.domain)return!1;if(i.translation_key&&t.translationKeys.includes(i.translation_key))return!0;let e=nr(i.entity_id);return t.idSuffixes.some(r=>e.endsWith(r))}function za(i){let t=i.name??i.original_name;if(t)return t.replace(/\s+present$/i,"").trim()||t;let s=nr(i.entity_id).replace(/_present$/,"").split("_").filter(Boolean).pop();return s?s[0].toUpperCase()+s.slice(1):"Cat"}function ja(i){return ci(i.entity_id)!=="binary_sensor"?!1:i.translation_key==="present"||i.translation_key?.endsWith("_present")?!0:nr(i.entity_id).endsWith("_present")}function it(i,t){let e={deviceId:t,catPresence:[]},r=Object.values(i).filter(s=>s.device_id===t&&!s.disabled_by);for(let s of r){if(ci(s.entity_id)==="camera"&&!e.camera){e.camera=s.entity_id;continue}if(ci(s.entity_id)==="media_player"&&!e.speaker){e.speaker=s.entity_id;continue}if(ja(s)){e.catPresence.push({entityId:s.entity_id,name:za(s)});continue}for(let n of Object.entries(Fa)){let[o,a]=n;if(!e[o]&&Ba(s,a)){e[o]=s.entity_id;break}}}return e.catPresence.sort((s,n)=>s.name.localeCompare(n.name)),e}function rt(i,t){if(t)return i[t]?.config_entries?.[0]}function sn(i,t){let e=r=>r===void 0||r==="unavailable"||r==="unknown";return i.length===0||i.every(e)?"unreachable":t==="on"?"dispensing":"idle"}function or(i,t){return i==="unreachable"?"Feeder unreachable \u2014 check that kibbled is running":i==="dispensing"?"Dispensing\u2026":t?`Fed ${t}`:"Ready to feed"}function Ua(i,t){let e=Math.floor(Math.max(0,t.getTime()-i.getTime())/6e4);if(e<1)return{unit:"now",value:0};if(e<60)return{unit:"minutes",value:e};let r=Math.floor(e/60);return r<24?{unit:"hours",value:r}:{unit:"days",value:Math.floor(r/24)}}function di(i,t){let e=Ua(i,t);if(e.unit==="now")return"just now";let r=e.unit==="minutes"?"min":e.unit==="hours"?"h":"d";return`${e.value} ${r} ago`}var qa={data:null,error:null,loading:!1},J=class{constructor(t){this._lastWatched=null;this._requestId=0;this._state=qa;this._onChange=t}get state(){return this._state}sync(t,e){t!==this._lastWatched&&(this._lastWatched=t,this.refresh(e))}refresh(t){let e=++this._requestId;this._state={...this._state,loading:!0,error:null},this._onChange(),t().then(r=>{e===this._requestId&&(this._state={data:r,error:null,loading:!1},this._onChange())},r=>{e===this._requestId&&(this._state={...this._state,error:$t(r),loading:!1},this._onChange())})}};function st(i,t){return t.filter(e=>!!e).map(e=>`${e}=${i.states[e]?.state??""}`).join("|")}function $t(i){if(i instanceof Error)return i.message;if(i&&typeof i=="object"&&"message"in i){let t=i.message;if(typeof t=="string"&&t)return t}return"Something went wrong."}var Va={cog:"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",cloudCheck:"M13 19C13 19.34 13.04 19.67 13.09 20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.32 7.4 19 9.05 19 11C20.15 11.13 21.1 11.63 21.86 12.5C22.37 13.07 22.7 13.71 22.86 14.42C21.82 13.54 20.5 13 19 13C18.89 13 18.79 13 18.68 13C18.62 13 18.56 13 18.5 13H17V11C17 9.62 16.5 8.44 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18H13.09C13.04 18.33 13 18.66 13 19M17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84L17.75 19.43Z",cloudLock:"M6.5 18H13V20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.08 7.16 18.73 8.5 18.93 10C18.23 10 17.56 10.19 16.95 10.46C16.84 9.31 16.38 8.31 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18M23 17.3V20.8C23 21.4 22.4 22 21.7 22H16.2C15.6 22 15 21.4 15 20.7V17.2C15 16.6 15.6 16 16.2 16V14.5C16.2 13.1 17.6 12 19 12S21.8 13.1 21.8 14.5V16C22.4 16 23 16.6 23 17.3M20.5 14.5C20.5 13.7 19.8 13.2 19 13.2S17.5 13.7 17.5 14.5V16H20.5V14.5Z",cloudAlert:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M11 7H13V13H11V7Z",cloudQuestion:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M14.43 8.68C14.97 9.13 15.24 9.75 15.24 10.5C15.24 11 15.09 11.41 14.8 11.82C14.5 12.21 14.13 12.5 13.67 12.75C13.41 12.91 13.24 13.07 13.15 13.26C13.06 13.45 13 13.69 13 14H11C11 13.45 11.11 13.08 11.3 12.82C11.5 12.56 11.85 12.25 12.37 11.91C12.63 11.75 12.84 11.56 13 11.32C13.15 11.09 13.23 10.81 13.23 10.5C13.23 10.18 13.14 9.94 12.96 9.76C12.78 9.56 12.5 9.47 12.2 9.47C11.93 9.47 11.71 9.55 11.5 9.7C11.35 9.85 11.25 10.08 11.25 10.39H9.28C9.23 9.64 9.5 9 10.06 8.59C10.6 8.2 11.31 8 12.2 8C13.14 8 13.89 8.23 14.43 8.68Z",airFilter:"M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",wifi:"M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",weatherNight:"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",ledOn:"M11,0V4H13V0H11M18.3,2.29L15.24,5.29L16.64,6.71L19.7,3.71L18.3,2.29M5.71,2.29L4.29,3.71L7.29,6.71L8.71,5.29L5.71,2.29M12,6A4,4 0 0,0 8,10V16H6V18H9V23H11V18H13V23H15V18H18V16H16V10A4,4 0 0,0 12,6M2,9V11H6V9H2M18,9V11H22V9H18Z",microphone:"M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z",volumeHigh:"M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",openInNew:"M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",speaker:"M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z"};function j(i){return G`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d=${Va[i]}></path></svg>`}var on="#F4A452",an="#DE8A3A",ln="#3A2C28",cn="#E5484D",nn=["#3FA7A0","#9A5B9E","#7FA05A","#4F86C6"];function ui(i){let t=nn.length;return nn[(i%t+t)%t]}function dn(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0}function un(i,t){return i===null&&t===null?{split:!1,hopper1:null,hopper2:null,combined:null}:i===null||t===null?{split:!1,hopper1:i,hopper2:t,combined:i??t}:Math.abs(i-t)<5?{split:!1,hopper1:i,hopper2:t,combined:Math.round((i+t)/2)}:{split:!0,hopper1:i,hopper2:t,combined:null}}var ar=260,Wa=200,I=130,ke=60,Fe=116,hi=40,ge=178,lr=46,Ya=10,Xa=78,Ga=86,cr=`M ${I+Fe} ${ke} C ${I+Fe} ${ke+50}, ${I+70} ${ge-13}, ${I+lr} ${ge} A ${lr} ${Ya} 0 0 1 ${I-lr} ${ge} C ${I-70} ${ge-13}, ${I-Fe} ${ke+50}, ${I-Fe} ${ke} A ${Fe} ${hi} 0 0 0 ${I+Fe} ${ke} Z`,Qa=[-.6,-.32,-.06,.2,.46,.66,-.46,.08,.34,-.2];function Ja(i,t,e,r){let s=[0,120,240].map(n=>{let o=(n+r)*Math.PI/180;return G`<circle cx=${(i+Math.cos(o)*e*.55).toFixed(1)} cy=${(t+Math.sin(o)*e*.55).toFixed(1)} r=${(e*.62).toFixed(1)} />`});return G`<g>${s}</g>`}var dr=class extends v{constructor(){super();this._wasFeeding=!1;this._dropping=!1;this._dropTimer=void 0;this.hopper1=null,this.hopper2=null,this.feeding=!1}static{this.properties={hopper1:{type:Number},hopper2:{type:Number},feeding:{type:Boolean}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._dropTimer)}willUpdate(e){e.has("feeding")&&this.feeding&&!this._wasFeeding&&!dn()&&(this._dropping=!0,clearTimeout(this._dropTimer),this._dropTimer=setTimeout(()=>{this._dropping=!1,this.requestUpdate()},900)),this._wasFeeding=this.feeding}render(){let e=un(this.hopper1,this.hopper2);return h`
      <div class="wrap">
        <svg class="art" viewBox="0 0 ${ar} ${Wa}" aria-hidden="true" preserveAspectRatio="xMidYMin meet">
          <defs>
            <clipPath id="bowl-clip"><path d=${cr} /></clipPath>
          </defs>
          <ellipse cx=${I} cy=${ge+14} rx="66" ry="9" class="shadow" />
          <path class="body" d=${cr} />
          <g clip-path="url(#bowl-clip)">
            ${e.split?this._renderSplitFill(e.hopper1,e.hopper2):this._renderFill(e.combined??0,0,ar)}
          </g>
          <path class="outline" d=${cr} />
          <ellipse cx=${I} cy=${ke} rx=${Fe} ry=${hi} class="rim" />
          ${e.split?G`<line class="divider" x1=${I} y1=${ke+hi} x2=${I} y2=${ge} />`:p}
          ${this._dropping?this._renderFallingKibble():p}
        </svg>
        <div class="numbers">
          ${e.split?h`
                <span class="fill-number split">${Math.round(e.hopper1)}<small>%</small></span>
                <span class="fill-number split">${Math.round(e.hopper2)}<small>%</small></span>
              `:h`<span class="fill-number">${e.combined==null?"\u2014":h`${Math.round(e.combined)}<small>%</small>`}</span>`}
        </div>
      </div>
    `}_renderFill(e,r,s){let n=Math.max(0,Math.min(1,e/100)),o=ge-(ge-(ke+hi))*n;return G`
      <rect class="fill" x=${r} y=${o} width=${s} height=${ge-o+20} />
      ${n>0?G`<rect class="fill-surface" x=${r} y=${o-1.5} width=${s} height="3" />`:p}
    `}_renderSplitFill(e,r){return G`
      ${this._renderFill(e,0,I)}
      ${this._renderFill(r,I,ar-I)}
    `}_renderFallingKibble(){let e=Qa.slice(0,7).map((r,s)=>{let n=I+r*(Ga-6),c=`--fall-delay:${s*70}ms;--fall-duration:320ms;--fall-rotate:${(r*180).toFixed(0)}deg;--fall-to:${Xa-30}px;`;return G`<g class="drop" style=${c}>${Ja(n,0,7,r*60)}</g>`});return G`<g class="drops">${e}</g>`}static{this.styles=S`
    :host {
      display: block;
    }
    .wrap {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .art {
      width: 100%;
      max-width: var(--kibble-bowl-max-width, 280px);
      height: auto;
      overflow: visible;
    }
    .shadow {
      fill: rgba(0, 0, 0, 0.16);
    }
    .body {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
    }
    .outline {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 2.6;
      stroke-linejoin: round;
    }
    .rim {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 1.6;
    }
    .divider {
      stroke: var(--primary-text-color);
      stroke-width: 1.6;
      stroke-dasharray: 4 4;
    }
    .fill {
      fill: var(--kibble-amber);
      opacity: 0.9;
      transition: y 400ms ease, height 400ms ease;
    }
    .fill-surface {
      fill: var(--kibble-amber-dark);
    }
    .drops circle {
      fill: var(--kibble-amber-dark);
      animation: kibble-drop var(--fall-duration) cubic-bezier(0.4, 0, 1, 1) var(--fall-delay) both;
    }
    @keyframes kibble-drop {
      from {
        transform: translateY(-40px) rotate(0deg);
        opacity: 0;
      }
      15% {
        opacity: 1;
      }
      to {
        transform: translateY(var(--fall-to)) rotate(var(--fall-rotate));
        opacity: 1;
      }
    }
    .numbers {
      display: flex;
      gap: 22px;
      margin-top: -6px;
    }
    .fill-number {
      font-size: var(--kibble-number-size, 34px);
      font-weight: 700;
      line-height: 1;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .fill-number small {
      font-size: 0.5em;
      font-weight: 600;
      margin-left: 1px;
    }
    .fill-number.split {
      font-size: calc(var(--kibble-number-size, 34px) * 0.72);
    }
  `}};customElements.define("kibble-bowl",dr);var Za=[1,2,3,4,5],ur=class extends v{static{this.properties={value:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.disabled=!1}render(){return h`
      <div class="segments" role="radiogroup" aria-label="Feed amount, portions">
        ${Za.map(t=>h`
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
    `}_select(t){this.dispatchEvent(new CustomEvent("portion-selected",{detail:{value:t},bubbles:!0,composed:!0}))}static{this.styles=S`
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
  `}};customElements.define("kibble-segmented-picker",ur);var hr=class extends v{static{this.properties={value:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.min=1,this.max=20,this.step=1,this.disabled=!1}render(){return h`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value<=this.min} @click=${this._decrement} aria-label="Fewer portions">
          &minus;
        </button>
        <span class="value">${this.value}</span>
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value>=this.max} @click=${this._increment} aria-label="More portions">
          &plus;
        </button>
      </div>
    `}_decrement(){this._emit(Math.max(this.min,this.value-this.step))}_increment(){this._emit(Math.min(this.max,this.value+this.step))}_emit(t){this.dispatchEvent(new CustomEvent("value-selected",{detail:{value:t},bubbles:!0,composed:!0}))}static{this.styles=S`
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
  `}};customElements.define("kibble-stepper",hr);var pr=class extends v{constructor(){super();this._holding=!1;this._holdTimer=void 0;this._startHold=e=>{this.disabled||(e.preventDefault(),this._holding=!0,this.requestUpdate(),clearTimeout(this._holdTimer),this._holdTimer=setTimeout(()=>{this._holding=!1,this.requestUpdate(),this._activate()},this.holdMs))};this._cancelHold=()=>{clearTimeout(this._holdTimer),this._holding&&(this._holding=!1,this.requestUpdate())};this.label="Hold to feed",this.variant="feed",this.disabled=!1,this.holdMs=600}static{this.properties={label:{type:String},variant:{type:String},disabled:{type:Boolean},holdMs:{type:Number,attribute:"hold-ms"}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._holdTimer)}render(){return h`
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
        ${this.variant==="feed"?h`<span class="fill"></span>`:""}
        <span class="label">${this.label}</span>
      </button>
    `}_tapActivate(){this.disabled||this._activate()}_activate(){this.dispatchEvent(new CustomEvent("activate",{bubbles:!0,composed:!0}))}static{this.styles=S`
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
  `}};customElements.define("kibble-hold-button",pr);var{I:ju}=tn;var hn=i=>i.strings===void 0;var pn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},mr=i=>(...t)=>({_$litDirective$:i,values:t}),pi=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var Tt=(i,t)=>{let e=i._$AN;if(e===void 0)return!1;for(let r of e)r._$AO?.(t,!1),Tt(r,t);return!0},mi=i=>{let t,e;do{if((t=i._$AM)===void 0)break;e=t._$AN,e.delete(i),i=t}while(e?.size===0)},mn=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),rl(t)}};function tl(i){this._$AN!==void 0?(mi(this),this._$AM=i,mn(this)):this._$AM=i}function il(i,t=!1,e=0){let r=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(t)if(Array.isArray(r))for(let n=e;n<r.length;n++)Tt(r[n],!1),mi(r[n]);else r!=null&&(Tt(r,!1),mi(r));else Tt(this,i)}var rl=i=>{i.type==pn.CHILD&&(i._$AP??=il,i._$AQ??=tl)},fi=class extends pi{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,r){super._$AT(t,e,r),mn(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(Tt(this,t),mi(this))}setValue(t){if(hn(this._$Ct))this._$Ct._$AI(t,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var nt=()=>new gr,gr=class{},fr=new WeakMap,Be=mr(class extends fi{render(i){return p}update(i,[t]){let e=t!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=t,this.ht=i.options?.host,this.rt(this.ct=i.element)),p}rt(i){if(this.G!==void 0)if(this.isConnected||(i=void 0),typeof this.G=="function"){let t=this.ht??globalThis,e=fr.get(t);e===void 0&&(e=new WeakMap,fr.set(t,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,i),i!==void 0&&this.G.call(this.ht,i)}else this.G.value=i}get lt(){return typeof this.G=="function"?fr.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function sl(i){let t=/^(\d{1,2}):(\d{2})$/.exec(i.trim());if(!t)throw new Error(`Invalid schedule time "${i}"`);let e=Number(t[1]),r=Number(t[2]);if(e>23||r>59)throw new Error(`Invalid schedule time "${i}"`);return e*60+r}function nl(i,t){let e=t.getHours()*60+t.getMinutes(),r=null;for(let s of i){if(!s.enabled)continue;let o=((sl(s.time)-e)%1440+1440)%1440;(r===null||o<r.minutesUntil)&&(r={entry:s,minutesUntil:o})}return r}var ol=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function fn(i,t){if(i.length===0)return"No schedule set";let e=nl(i,t);if(!e)return"All feeds paused";let r=i.filter(n=>n.enabled).length,s=ol[r]??String(r);return`Next feed ${e.entry.time}, ${s} a day`}var br="dispenser-schedule-card",_r=class extends v{constructor(){super();this._expanded=!1;this._embedRef=nt();this._configureEmbed=e=>{if(!e||!this.scheduleCardStateEntity)return;let r=e.querySelector(br);if(r){r.hass=this.hass;return}let s=document.createElement(br);s.setConfig({type:"custom:dispenser-schedule-card",device:{type:"custom",entity:this.scheduleCardStateEntity,max_entries:24,min_amount:1,max_amount:20,step_amount:1,status_map:["0 -> dispensed","1 -> failed","2 -> pending","3 -> dispensing"],status_pattern:"(?<id>[^,]+),(?<hour>[0-9]{1,2}),(?<minute>[0-9]{1,2}),(?<amount>[0-9]{1,2}),(?<status>[0-9]);?",actions:{add:"kibble.schedule_card_add",edit:"kibble.schedule_card_edit",remove:"kibble.schedule_card_remove",toggle:"kibble.schedule_card_toggle"}},unit_of_measurement:{one:"portion",other:"portions"}}),s.hass=this.hass,e.appendChild(s)};this.entries=[],this.deviceName="Kibble"}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},scheduleCardStateEntity:{type:String},deviceName:{type:String}}}updated(){this._embedRef.value&&this.hass&&(this._embedRef.value.hass=this.hass)}render(){let e=new Date,r=fn(this.entries,e);return h`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${r}</span>
        <span class="chevron ${this._expanded?"open":""}">${j("chevronDown")}</span>
      </button>
      ${this._expanded?h`<div class="expanded">${this._renderExpanded()}</div>`:p}
    `}_renderExpanded(){if(this._canEmbed())return h`<div ${Be(this._configureEmbed)}></div>`;if(this.entries.length===0)return h`<p class="empty">No schedule set</p>`;let e=[...this.entries].sort((r,s)=>r.time.localeCompare(s.time));return h`
      <ul class="entries">
        ${e.map(r=>h`
            <li class=${r.enabled?"":"disabled"}>
              <span class="time">${r.time}</span>
              <span class="amounts">${r.amount_l}g + ${r.amount_r}g</span>
              <span class="state">${r.enabled?"On":"Paused"}</span>
            </li>
          `)}
      </ul>
    `}_canEmbed(){if(!customElements.get(br)||!this.scheduleCardStateEntity)return!1;let e=this.hass?.states[this.scheduleCardStateEntity];return e!==void 0&&e.state!=="unavailable"}_toggle(){this._expanded=!this._expanded,this.requestUpdate()}static{this.styles=S`
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
  `}};customElements.define("kibble-schedule-summary",_r);var al=3e3;function gi(i,t){if(!t)return null;let e=i.states[t];if(!e)return null;let r=Number(e.state);return Number.isNaN(r)?null:{value:r,min:Number(e.attributes.min??1),max:Number(e.attributes.max??20),step:Number(e.attributes.step??1)}}var vr=class extends v{constructor(){super();this._cloudConfirmArmed=!1;this._cloudConfirmTimer=void 0;this.open=!1}static{this.properties={hass:{attribute:!1},entities:{attribute:!1},open:{type:Boolean,reflect:!0}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._cloudConfirmTimer)}render(){if(!this.open)return p;let e=this.entities;return h`
      <div class="backdrop" @click=${this._close}></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Kibble settings" @keydown=${this._onKeydown}>
        <header>
          <h2>Settings</h2>
          <button type="button" class="icon-button" @click=${this._close} aria-label="Close">${j("close")}</button>
        </header>
        <div class="body">
          ${e.feedButtonHopper1||e.feedButtonHopper2?this._renderHopperSection():p}
          ${e.feedAmount?this._renderMoreAmountSection():p}
          ${this._renderToggles()}
          ${e.volume?this._renderVolume():p}
          ${e.cloudSwitch?this._renderCloud():p}
          ${e.wifiNetwork?this._renderWifi():p}
          ${e.dishBefore||e.dishAfter?this._renderDishPhotos():p}
          ${e.speaker?this._renderSpeaker():p}
          <button type="button" class="device-link" @click=${this._openDevicePage}>
            Open device page ${j("openInNew")}
          </button>
        </div>
      </div>
    `}_renderMoreAmountSection(){let e=gi(this.hass,this.entities.feedAmount);return e?h`
      <section>
        <h3>Feed amount</h3>
        ${this._renderStepper(this.entities.feedAmount,e)}
      </section>
    `:p}_renderHopperSection(){let{feedAmountHopper1:e,feedAmountHopper2:r,feedButtonHopper1:s,feedButtonHopper2:n}=this.entities;return h`
      <section>
        <h3>Per-hopper feed</h3>
        <p class="hint">
          Targets one auger's amount byte. This feeder's firmware spins both augers anyway, so
          expect roughly double into the bowl until a hopper divider is fitted.
        </p>
        <div class="hoppers">
          ${e?h`
                <div class="hopper">
                  <span class="hopper-label">Hopper 1</span>
                  ${this._renderStepper(e,gi(this.hass,e))}
                  ${s?h`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(s)}></kibble-hold-button>`:p}
                </div>
              `:p}
          ${r?h`
                <div class="hopper">
                  <span class="hopper-label">Hopper 2</span>
                  ${this._renderStepper(r,gi(this.hass,r))}
                  ${n?h`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(n)}></kibble-hold-button>`:p}
                </div>
              `:p}
        </div>
      </section>
    `}_renderStepper(e,r){return r?h`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${r.value<=r.min} @click=${()=>this._setNumber(e,Math.max(r.min,r.value-r.step))}>
          &minus;
        </button>
        <span class="step-value">${r.value}</span>
        <button type="button" class="step-btn" ?disabled=${r.value>=r.max} @click=${()=>this._setNumber(e,Math.min(r.max,r.value+r.step))}>
          &plus;
        </button>
      </div>
    `:p}_renderToggles(){let r=[{id:this.entities.nightVisionSwitch,icon:"weatherNight",label:"Night vision"},{id:this.entities.statusLedSwitch,icon:"ledOn",label:"Status LED"},{id:this.entities.microphoneSwitch,icon:"microphone",label:"Microphone"}].filter(s=>s.id!==void 0);return r.length===0?p:h`
      <section>
        <h3>Device</h3>
        ${r.map(s=>this._renderToggleRow(s.id,s.icon,s.label))}
      </section>
    `}_renderToggleRow(e,r,s){let n=this.hass.states[e],o=n?.state==="on",a=!n||n.state==="unavailable";return h`
      <button type="button" class="toggle-row" ?disabled=${a} @click=${()=>this._toggleSwitch(e)}>
        <span class="toggle-icon">${j(r)}</span>
        <span class="toggle-label">${s}</span>
        <span class="toggle-pill ${o?"on":""}"><span class="toggle-knob"></span></span>
      </button>
    `}_renderVolume(){let e=gi(this.hass,this.entities.volume);return e?h`
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
    `:p}_renderCloud(){let r=this.hass.states[this.entities.cloudSwitch]?.state==="on",s=this.entities.cloudConnection?this.hass.states[this.entities.cloudConnection]?.state:void 0;return h`
      <section>
        <h3>Petkit cloud</h3>
        <p class="hint">${s?`Connection: ${s}`:"Turns the feeder's cloud link on or off."}</p>
        <button type="button" class="cloud-toggle ${this._cloudConfirmArmed?"confirming":""}" @click=${this._onCloudToggleClick}>
          ${this._cloudConfirmArmed?`Tap again to turn ${r?"off":"on"}`:r?"On \u2014 tap to turn off":"Off \u2014 tap to turn on"}
        </button>
      </section>
    `}_renderWifi(){let e=this.hass.states[this.entities.wifiNetwork];return h`
      <section>
        <h3>Wi-Fi</h3>
        <p class="hint">${e?e.state:"Unavailable"}</p>
      </section>
    `}_renderDishPhotos(){let e=this.entities.dishBefore?this.hass.states[this.entities.dishBefore]:void 0,r=this.entities.dishAfter?this.hass.states[this.entities.dishAfter]:void 0;return(!e||e.state==="unavailable")&&(!r||r.state==="unavailable")?p:h`
      <section>
        <h3>Last feed</h3>
        <div class="dish-photos">
          ${e&&e.state!=="unavailable"?h`<img src=${String(e.attributes.entity_picture??"")} alt="Before" />`:p}
          ${r&&r.state!=="unavailable"?h`<img src=${String(r.attributes.entity_picture??"")} alt="After" />`:p}
        </div>
      </section>
    `}_renderSpeaker(){let e=this.hass.states[this.entities.speaker];if(!e)return p;let r=typeof e.attributes.volume_level=="number"?e.attributes.volume_level:.5;return h`
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
    `}_pressButton(e){this.hass.callService("button","press",{},{entity_id:e})}_toggleSwitch(e){this.hass.callService("switch","toggle",{},{entity_id:e})}_setNumber(e,r){this.hass.callService("number","set_value",{value:r},{entity_id:e})}_onCloudToggleClick(){if(this._cloudConfirmArmed){clearTimeout(this._cloudConfirmTimer),this._cloudConfirmArmed=!1,this._toggleSwitch(this.entities.cloudSwitch),this.requestUpdate();return}this._cloudConfirmArmed=!0,this.requestUpdate(),this._cloudConfirmTimer=setTimeout(()=>{this._cloudConfirmArmed=!1,this.requestUpdate()},al)}_openDevicePage(){let e=this.entities.deviceId;history.pushState(null,"",`/config/devices/device/${e}`),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0})),this._close()}_onKeydown(e){e.key==="Escape"&&this._close()}_close(){this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}static{this.styles=S`
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
  `}};customElements.define("kibble-settings-dialog",vr);function be(i,t,e){let r=t.split("/").map(s=>encodeURIComponent(s)).join("/");return`/api/kibble/${encodeURIComponent(i)}/image/${r}/${encodeURIComponent(e)}`}var Se=class{constructor(){this._urls=new Map;this._pending=new Map}get(t,e,r){let s=this._urls.get(e);if(s)return this._urls.delete(e),this._urls.set(e,s),s;let n=this._pending.get(e);if(n)return n.then(()=>r(this._urls.get(e)??null)),null;let o=this._fetch(t,e).then(a=>{this._pending.delete(e),a&&this._remember(e,a),r(a)});return this._pending.set(e,o),null}async _fetch(t,e){if(!t.fetchWithAuth)return null;try{let r=await t.fetchWithAuth(e);if(!r.ok)return null;let s=await r.blob();return URL.createObjectURL(s)}catch{return null}}_remember(t,e){for(this._urls.set(t,e);this._urls.size>200;){let r=this._urls.keys().next().value;if(r===void 0)break;let s=this._urls.get(r);this._urls.delete(r),s&&URL.revokeObjectURL(s)}}dispose(){for(let t of this._urls.values())URL.revokeObjectURL(t);this._urls.clear(),this._pending.clear()}};function gn(){return G`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `}function bn(i){let t=0;for(let e=0;e<i.length;e++)t=t*31+i.charCodeAt(e)|0;return ui(t)}var yr=class extends v{constructor(){super();this._cache=new Se;this._imageUrl=null;this._resolvedPath=null;this.name=null,this.colorIndex=null,this.sampleName=null}static{this.properties={hass:{attribute:!1},name:{type:String},colorIndex:{type:Number,attribute:"color-index"},entryId:{type:String,attribute:"entry-id"},sampleName:{type:String,attribute:"sample-name"}}}disconnectedCallback(){super.disconnectedCallback(),this._cache.dispose()}willUpdate(){let e=this.entryId&&this.name&&this.sampleName?be(this.entryId,`sample/${this.name}`,this.sampleName):null;e!==this._resolvedPath&&(this._resolvedPath=e,this._imageUrl=null,!(!e||!this.hass)&&(this._imageUrl=this._cache.get(this.hass,e,r=>{this._resolvedPath===e&&(this._imageUrl=r,this.requestUpdate())})))}render(){if(!this.name)return h`<div class="avatar neutral">${gn()}</div>`;let e=this.colorIndex!=null?ui(this.colorIndex):bn(this.name);return h`
      <div class="avatar" style="--kibble-avatar-color: ${e}">
        ${this._imageUrl?h`<img src=${this._imageUrl} alt="" />`:h`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `}static{this.styles=S`
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
  `}};customElements.define("kibble-avatar",yr);var sa=Pa(ra(),1);function xs(i){for(let t of Object.values(i.entities??{}))if(t.platform==="scrypted"&&t.entity_id.startsWith("sensor.scrypted_token")){let e=i.states[t.entity_id]?.state;if(e&&e!=="unavailable"&&e!=="unknown")return e}}var ys=class{constructor(){this.options={proxy:!0,userAgent:navigator.userAgent,capabilities:{audio:RTCRtpReceiver.getCapabilities?.("audio")??{codecs:[],headerExtensions:[]},video:RTCRtpReceiver.getCapabilities?.("video")??{codecs:[],headerExtensions:[]}},screen:{devicePixelRatio:window.devicePixelRatio,width:screen.width,height:screen.height}};this.__proxy_props={options:this.options}}async getOptions(){return this.options}createPeerConnection(t){if(this.pc)return this.pc;let e=new RTCPeerConnection(t.configuration);this.pc=e,e.addEventListener("iceconnectionstatechange",()=>{["disconnected","failed","closed"].includes(e.iceConnectionState)&&this.onClosed?.()});let r=new MediaStream;if(e.addEventListener("track",s=>{r.addTrack(s.track),this.onTrack?.(r)}),t.datachannel&&e.createDataChannel(t.datachannel.label,t.datachannel.dict),t.audio){let s=e.addTransceiver("audio",t.audio);(t.audio.direction==="sendrecv"||t.audio.direction==="sendonly")&&(this.microphone=s.sender)}return t.video&&e.addTransceiver("video",t.video),e}async createLocalDescription(t,e,r){let s=this.createPeerConnection(e),n=new Promise(f=>{s.onicecandidate=d=>{d.candidate?r?.(JSON.parse(JSON.stringify(d.candidate))):f()},s.onicegatheringstatechange=()=>{s.iceGatheringState==="complete"&&f()}}),o=t==="offer"?await s.createOffer({offerToReceiveAudio:!!e.audio,offerToReceiveVideo:!!e.video}):await s.createAnswer(),a=s.setLocalDescription(o);if(r)return{type:o.type,sdp:o.sdp};await a,await n;let c=s.localDescription??o;return{type:c.type,sdp:c.sdp}}async setRemoteDescription(t,e){await this.createPeerConnection(e).setRemoteDescription(t)}async addIceCandidate(t){await this.pc?.addIceCandidate(t)}async endSession(){}async setMicrophone(t){if(!this.microphone)throw new Error("this stream has no return-audio channel");if(t&&!this.micTrack){let e=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1});this.micTrack=e.getAudioTracks()[0],await this.microphone.replaceTrack(this.micTrack)}this.micTrack&&(this.micTrack.enabled=t)}close(){this.micTrack?.stop(),this.pc?.getSenders().forEach(t=>t.track?.stop()),this.pc?.close(),this.pc=void 0}},Wi=class{constructor(t){this.state="idle";this.hasIntercom=!1;this.onChange=t}async open(t,e){this.close(),this.setState("connecting");try{let r=`${location.origin}/api/scrypted/${t.token}/`,s=await(0,sa.connectScryptedClient)({baseUrl:r,pluginId:"@scrypted/core",clientName:"kibble-card"});this.client=s;let n=s.systemManager.getDeviceById(t.deviceId);if(!n)throw new Error(`Scrypted has no device ${t.deviceId}`);let o=n.interfaces??[];if(!o.includes("RTCSignalingChannel"))throw new Error(`${n.name} has no WebRTC channel in Scrypted`);this.hasIntercom=o.includes("Intercom");let a=new ys;this.session=a,a.onTrack=f=>{e.srcObject!==f&&(e.srcObject=f,e.play().catch(()=>{})),this.setState("live")},a.onClosed=()=>{this.session===a&&this.fail("stream disconnected")};let c=n;this.control=await c.startRTCSignalingSession(a)}catch(r){throw this.fail(r instanceof Error?r.message:String(r)),r}}async talk(t){if(!this.session)throw new Error("not connected");await this.session.setMicrophone(t),await this.control?.setPlayback({audio:t,video:!0})}close(){this.control?.setPlayback({audio:!1,video:!0}).catch(()=>{}),this.control=void 0,this.session?.close(),this.session=void 0,this.client?.disconnect?.(),this.client=void 0,this.state!=="idle"&&this.setState("idle")}fail(t){this.error=t,this.session?.close(),this.session=void 0,this.setState("error")}setState(t){this.state=t,t!=="error"&&(this.error=void 0),this.onChange()}};var Cs=class extends v{constructor(){super();this._live=new Wi(()=>{this._tick=(this._tick??0)+1});this._start=async()=>{let e=xs(this.hass);if(!e||!this.scryptedId)return;this._playing=!0,await this.updateComplete;let r=this.renderRoot.querySelector("#video");if(r)try{await this._live.open({deviceId:this.scryptedId,token:e},r)}catch{this._playing=!1}};this._stop=()=>{this._live.close(),this._playing=!1,this._talking=!1};this._toggleMute=()=>{this._muted=!this._muted,this._applyMute()};this._applyMute=()=>{let e=this.renderRoot.querySelector("#video");e&&(e.muted=this._muted,e.play().catch(()=>{}))};this._talkStart=async e=>{if(e.preventDefault(),!this._talking){this._talking=!0;try{await this._live.talk(!0)}catch{this._talking=!1}}};this._talkStop=async()=>{if(this._talking){this._talking=!1;try{await this._live.talk(!1)}catch{}}};this._talkKeyDown=e=>{(e.key===" "||e.key==="Enter")&&this._talkStart(e)};this._playing=!1,this._talking=!1,this._muted=!0,this._tick=0}static{this.properties={hass:{attribute:!1},cameraEntity:{attribute:!1},scryptedId:{attribute:!1},_playing:{state:!0},_talking:{state:!0},_muted:{state:!0},_tick:{state:!0}}}disconnectedCallback(){super.disconnectedCallback(),this._stop()}render(){let r=!!((this.hass?xs(this.hass):void 0)&&this.scryptedId);return h`
      <div class="frame">
        ${this._playing?this._renderVideo():this._renderStill()}
        <div class="controls">
          ${r?h`<button
                class="chip"
                aria-pressed=${this._playing}
                @click=${this._playing?this._stop:this._start}
                title=${this._playing?"Stop live view":"Start live view"}
              >
                ${this._playing?j("close"):j("volumeHigh")}
                <span>${this._playing?"Stop":"Live"}</span>
              </button>`:p}
          ${this._playing?h`<button
                class="chip"
                aria-pressed=${!this._muted}
                @click=${this._toggleMute}
                title=${this._muted?"Unmute the feeder":"Mute the feeder"}
              >
                ${j(this._muted?"speaker":"volumeHigh")}
                <span>${this._muted?"Sound off":"Sound on"}</span>
              </button>`:p}
          ${this._playing&&this._live.hasIntercom?h`<button
                class="chip talk"
                data-talking=${this._talking}
                @pointerdown=${this._talkStart}
                @pointerup=${this._talkStop}
                @pointercancel=${this._talkStop}
                @pointerleave=${this._talkStop}
                @keydown=${this._talkKeyDown}
                @keyup=${this._talkStop}
                title="Hold to talk to the feeder"
              >
                ${j("microphone")}
                <span>${this._talking?"Talking\u2026":"Hold to talk"}</span>
              </button>`:p}
        </div>
        ${this._live.state==="connecting"?h`<div class="note">Connecting…</div>`:p}
        ${this._live.state==="error"?h`<div class="note error">${this._live.error}</div>`:p}
      </div>
    `}_renderVideo(){return h`<video id="video" autoplay playsinline ?muted=${this._muted} @loadedmetadata=${this._applyMute}></video>`}_renderStill(){if(!this.cameraEntity)return h`<div class="placeholder">No camera on this device</div>`;if(customElements.get("hui-image"))return h`<hui-image .hass=${this.hass} .cameraImage=${this.cameraEntity} cameraView="auto"></hui-image>`;let e=this.hass.states[this.cameraEntity]?.attributes.entity_picture;return typeof e=="string"?h`<img src=${e} alt="The feeder's camera" />`:h`<div class="placeholder">Camera unavailable</div>`}static{this.styles=S`
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
      gap: 6px;
      min-height: 34px;
      padding: 0 12px;
      border: none;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(2px);
    }
    .chip svg {
      font-size: 16px;
    }
    .chip:hover {
      background: rgba(0, 0, 0, 0.7);
    }
    .chip.talk {
      touch-action: none;
      user-select: none;
    }
    .chip.talk[data-talking="true"] {
      background: var(--kibble-amber, #f2a33c);
      color: var(--kibble-ink-on-amber, #241a07);
    }
    .note {
      position: absolute;
      left: 8px;
      bottom: 50px;
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
  `}};customElements.define("kibble-live-hero",Cs);var qd=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"scrypted_id",selector:{text:{}}},{name:"settings_hash",selector:{text:{}}},{name:"schedule_hash",selector:{text:{}}}],Vd={device_id:"Kibble device",name:"Name (optional)",scrypted_id:"Scrypted camera id (live view + talk)",settings_hash:"Settings pop-up hash (optional)",schedule_hash:"Schedule handled by dashboard (optional hash)"},ws=class extends v{constructor(){super(...arguments);this._computeLabel=e=>Vd[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?h`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${qd}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():p}_renderFallback(){let e=Object.values(this.hass?.entities??{}),r=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return h`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${r.map(s=>h`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateSettingsHash(e){this._config&&(this._config={...this._config,settings_hash:e||void 0},this._fireConfigChanged())}_updateScheduleHash(e){this._config&&(this._config={...this._config,schedule_hash:e||void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=S`
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
  `}};customElements.define("kibble-card-editor",ws);function na(i){return i==="eat"?"ate":i==="visit"?"came by":i==="face"||i==="track"?"identified":"was seen"}function oa(i){if(i.amount==null)return"Fed";let t=i.amount===1?"portion":"portions",e=i.hopper&&i.hopper!=="both"?` from hopper ${i.hopper}`:"";return`Fed ${i.amount} ${t}${e}`}function Vt(i){return`${i.getFullYear()}-${i.getMonth()}-${i.getDate()}`}function Kd(i,t){if(Vt(i)===Vt(t))return"Today";let e=new Date(t.getFullYear(),t.getMonth(),t.getDate()-1);return Vt(i)===Vt(e)?"Yesterday":i.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}function aa(i,t){let e=[],r=null;for(let s of i){let n=new Date(s.ts*1e3),o=Vt(n);o!==r&&(r=o,e.push({label:Kd(n,t),items:[]})),e[e.length-1].items.push(s)}return e}var ks=class extends v{constructor(){super();this._closeButtonRef=nt();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&(e.preventDefault(),this._close())};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.imageUrl=null,this.alt=""}static{this.properties={open:{type:Boolean,reflect:!0},imageUrl:{type:String},alt:{type:String}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler)}updated(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus()}render(){return this.open?h`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.alt||"Photo"}>
        <div class="frame" @click=${e=>e.stopPropagation()}>
          ${this.imageUrl?h`<img src=${this.imageUrl} alt=${this.alt} />`:p}
          <button type="button" class="close" aria-label="Close" ${Be(this._closeButtonRef)} @click=${this._close}>
            ${j("close")}
          </button>
        </div>
      </div>
    `:p}static{this.styles=S`
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
  `}};customElements.define("kibble-lightbox",ks);var Wd=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"limit",selector:{number:{min:1,mode:"box"}}}],Yd={device_id:"Kibble device",name:"Name (optional)",limit:"Rows before \u201CShow more\u201D (optional, default 30)"},Ss=class extends v{constructor(){super(...arguments);this._computeLabel=e=>Yd[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?h`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${Wd}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():p}_renderFallback(){let e=Object.values(this.hass?.entities??{}),r=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return h`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${r.map(s=>h`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateLimit(e){if(!this._config)return;let r=Number(e);this._config={...this._config,limit:e&&Number.isFinite(r)?r:void 0},this._fireConfigChanged()}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=S`
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
  `}};customElements.define("kibble-timeline-card-editor",Ss);var Xd={deviceId:"",catPresence:[]},Es=30,Ps=class extends v{constructor(){super();this._entities=Xd;this._timelineQuery=new J(()=>this.requestUpdate());this._catsQuery=new J(()=>this.requestUpdate());this._imageCache=new Se;this._lightboxTrigger=null;this._showMore=()=>{this._visibleCount+=this._config?.limit??Es};this._retryTimeline=()=>{let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId;this._timelineQuery.refresh(()=>e({type:"kibble/timeline",entry_id:r}).then(s=>s))};this._closeLightbox=()=>{this._lightboxUrl=null,this._lightboxTrigger?.focus(),this._lightboxTrigger=null};this._visibleCount=Es,this._lightboxUrl=null,this._lightboxAlt=""}static{this.properties={hass:{attribute:!1},_config:{state:!0},_visibleCount:{state:!0},_lightboxUrl:{state:!0},_lightboxAlt:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");this._config=e,this._visibleCount=e.limit??Es}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-timeline-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-timeline-card-editor")}disconnectedCallback(){super.disconnectedCallback(),this._imageCache.dispose()}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._config?.device_id&&this.hass&&(this._entities=it(this.hass.entities??{},this._config.device_id),this._entryId=rt(this.hass.devices??{},this._config.device_id));let r=this.hass?.callWS;if(this.hass&&this._entryId&&r){let s=this._entryId,n=st(this.hass,[this._entities.lastDetection,this._entities.feeding,this._entities.dishAfter]);this._timelineQuery.sync(n,()=>r({type:"kibble/timeline",entry_id:s}).then(o=>o)),this._catsQuery.sync(n,()=>r({type:"kibble/cats",entry_id:s}).then(o=>o))}}render(){if(!this._config||!this.hass)return p;let e=this._timelineQuery.state,r=new Map((this._catsQuery.state.data?.cats??[]).map(f=>[f.name,f])),s=e.data?.items??[],n=s.slice(0,this._visibleCount),o=aa(n,new Date),a=s.length>n.length,c=!e.error&&!e.loading&&e.data!==null&&o.length===0;return h`
      <ha-card>
        <div class="container">
          ${this._config.name?h`<div class="label">${this._config.name}</div>`:p}
          <div class="rail">
            ${e.error?this._renderError(e.error):p}
            ${c?this._renderEmpty():p}
            ${o.map(f=>this._renderDay(f,r))}
            ${a?h`<button type="button" class="show-more" @click=${this._showMore}>Show more</button>`:p}
          </div>
        </div>
      </ha-card>
      <kibble-lightbox
        ?open=${this._lightboxUrl!==null}
        .imageUrl=${this._lightboxUrl}
        .alt=${this._lightboxAlt}
        @close-requested=${this._closeLightbox}
      ></kibble-lightbox>
    `}_renderEmpty(){return h`<p class="empty">Nothing to show yet. Feeds and visits appear here as they happen.</p>`}_renderError(e){return h`
      <div class="error">
        <span>Couldn't load the timeline. ${e}</span>
        <button type="button" @click=${this._retryTimeline}>Try again</button>
      </div>
    `}_renderDay(e,r){return h`
      <div class="day">
        <div class="day-label">${e.label}</div>
        <div class="day-items">
          ${e.items.map(s=>s.kind==="detection"?this._renderDetection(s,r):this._renderFeed(s))}
        </div>
      </div>
    `}_renderDetection(e,r){let s=e.cat?r.get(e.cat):void 0,n=this._timeLabel(e.ts),o=e.cat??"a cat";return h`
      <div class="row">
        <span class="time">${n}</span>
        <kibble-avatar
          class="row-avatar"
          .hass=${this.hass}
          .name=${e.cat}
          .colorIndex=${s?.color_index??null}
          .entryId=${this._entryId}
          .sampleName=${s?.avatar??null}
        ></kibble-avatar>
        <span class="row-text">${o} ${na(e.class)}</span>
        ${e.image&&this._entryId?this._renderThumb(be(this._entryId,"event",e.image),`${o}, ${n}`):p}
      </div>
    `}_renderFeed(e){let r=this._timeLabel(e.ts),s=this._entryId;return h`
      <div class="row row-feed">
        <span class="time">${r}</span>
        <span class="row-text feed-text">${oa(e)}</span>
        <div class="feed-thumbs">
          ${e.before&&s?this._renderThumb(be(s,"feed",e.before),`Bowl before the ${r} feed`):p}
          ${e.after&&s?this._renderThumb(be(s,"feed",e.after),`Bowl after the ${r} feed`):p}
        </div>
      </div>
    `}_renderThumb(e,r){let s=this._imageCache.get(this.hass,e,()=>this.requestUpdate());return h`
      <button type="button" class="thumb" ?disabled=${!s} aria-label=${`View photo: ${r}`} @click=${n=>this._openLightbox(n,s,r)}>
        ${s?h`<img src=${s} alt="" loading="lazy" />`:p}
      </button>
    `}_timeLabel(e){return new Date(e*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}_openLightbox(e,r,s){r&&(this._lightboxTrigger=e.currentTarget,this._lightboxUrl=r,this._lightboxAlt=s)}static{this.styles=S`
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
    .row-avatar {
      --kibble-avatar-size: 28px;
      flex: 0 0 auto;
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
      gap: 4px;
      flex: 0 0 auto;
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
  `}};customElements.define("kibble-timeline-card",Ps);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-timeline-card",name:"Kibble Timeline",description:"Today's feeds and visits as one rail, newest first, with day separators and photos.",preview:!0});function la(i,t){return i.guess&&i.guess.score>=t?{cat:i.guess.cat,source:"classifier"}:i.vendor_cat?{cat:i.vendor_cat,source:"vendor"}:null}var $s=class extends v{constructor(){super();this._firstButtonRef=nt();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&(e.preventDefault(),this._close())};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.cats=[]}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},cats:{attribute:!1},entryId:{type:String}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler)}updated(e){e.has("open")&&this.open&&this._firstButtonRef.value?.focus()}render(){return this.open?h`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Choose a cat">
        <div class="sheet" @click=${e=>e.stopPropagation()}>
          <div class="heading">Choose a cat</div>
          <div class="rows">
            ${this.cats.map((e,r)=>h`
                <button type="button" class="row" ${r===0?Be(this._firstButtonRef):p} @click=${()=>this._choose(e.name)}>
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
            <button type="button" class="row" ${this.cats.length===0?Be(this._firstButtonRef):p} @click=${()=>this._choose("not_a_cat")}>
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
    `:p}_choose(e){this.dispatchEvent(new CustomEvent("choice",{detail:{cat:e},bubbles:!0,composed:!0}))}static{this.styles=S`
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
  `}};customElements.define("kibble-face-picker",$s);var Gd=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"confidence",selector:{number:{min:0,max:1,step:.05,mode:"box"}}}],Qd={device_id:"Kibble device",name:"Name (optional)",confidence:"Classifier confidence needed to suggest it (optional, default 0.7)"},Ts=class extends v{constructor(){super(...arguments);this._computeLabel=e=>Qd[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?h`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${Gd}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():p}_renderFallback(){let e=Object.values(this.hass?.entities??{}),r=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return h`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${r.map(s=>h`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateConfidence(e){if(!this._config)return;let r=Number(e);this._config={...this._config,confidence:e&&Number.isFinite(r)?r:void 0},this._fireConfigChanged()}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=S`
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
  `}};customElements.define("kibble-cats-card-editor",Ts);var Jd={deviceId:"",catPresence:[]},Zd=.7,eu=5e3,As=class extends v{constructor(){super();this._entities=Jd;this._catsQuery=new J(()=>this.requestUpdate());this._pendingQuery=new J(()=>this.requestUpdate());this._sampleQueries=new Map;this._imageCache=new Se;this._lastPendingData=null;this._pickerTrigger=null;this._closePicker=()=>{this._pickerCrop=null,this._pickerTrigger?.focus(),this._pickerTrigger=null};this._onPickerChoice=e=>{let r=this._pickerCrop;this._pickerCrop=null,r&&this._confirm(r,e.detail.cat)};this._hiddenCrops=new Set,this._pickerCrop=null,this._undo=null,this._addName="",this._addBusy=!1,this._addError=null,this._actionError=null}static{this.properties={hass:{attribute:!1},_config:{state:!0},_hiddenCrops:{state:!0},_pickerCrop:{state:!0},_undo:{state:!0},_addName:{state:!0},_addBusy:{state:!0},_addError:{state:!0},_actionError:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Cats card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 8}static getStubConfig(e){return{type:"custom:kibble-cats-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-cats-card-editor")}disconnectedCallback(){super.disconnectedCallback(),this._imageCache.dispose(),clearTimeout(this._undoTimer)}_confidence(){return this._config?.confidence??Zd}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._config?.device_id&&this.hass&&(this._entities=it(this.hass.entities??{},this._config.device_id),this._entryId=rt(this.hass.devices??{},this._config.device_id));let r=this.hass?.callWS;if(this.hass&&this._entryId&&r){let s=this._entryId,n=st(this.hass,[this._entities.pendingFace,this._entities.lastSeenPet]);this._catsQuery.sync(n,()=>r({type:"kibble/cats",entry_id:s}).then(o=>o)),this._pendingQuery.sync(n,()=>r({type:"kibble/faces/pending",entry_id:s}).then(o=>o));for(let o of this._catsQuery.state.data?.cats??[]){if(this._sampleQueries.has(o.name))continue;let a=new J(()=>this.requestUpdate());this._sampleQueries.set(o.name,a)}for(let[o,a]of this._sampleQueries)a.sync(n,()=>r({type:"kibble/faces/samples",entry_id:s,cat:o}).then(c=>c))}this._pendingQuery.state.data!==this._lastPendingData&&(this._lastPendingData=this._pendingQuery.state.data,this._hiddenCrops=new Set)}render(){if(!this._config||!this.hass)return p;let e=this._catsQuery.state.data?.cats??[],s=(this._pendingQuery.state.data?.crops??[]).filter(o=>!this._hiddenCrops.has(o.name)),n=new Set(this._entities.catPresence.filter(o=>this.hass.states[o.entityId]?.state==="on").map(o=>o.name));return h`
      <ha-card>
        <div class="container">
          ${this._config.name?h`<div class="label">${this._config.name}</div>`:p}
          ${this._actionError?this._renderActionError():p}
          <section class="header">
            ${e.length===0?h`<p class="empty">No cats yet. Add one to start training.</p>`:h`<div class="cat-list">${e.map(o=>this._renderCatHeader(o,n.has(o.name)))}</div>`}
            ${this._renderAddCat()}
          </section>
          <section class="inbox">
            <div class="inbox-heading">
              <span>${s.length===1?"1 to review":`${s.length} to review`}</span>
            </div>
            ${this._pendingQuery.state.error?this._renderPendingError():p}
            ${s.length===0&&!this._pendingQuery.state.error?h`<p class="empty">Nothing to review. New crops arrive when a cat is identified at the bowl.</p>`:h`<div class="crop-grid" @keydown=${this._onGridKeydown}>${s.map(o=>this._renderCrop(o))}</div>`}
          </section>
          ${e.map(o=>this._renderGallery(o))}
        </div>
      </ha-card>
      ${this._undo?this._renderUndo(this._undo):p}
      <kibble-face-picker
        ?open=${this._pickerCrop!==null}
        .hass=${this.hass}
        .cats=${e}
        .entryId=${this._entryId}
        @choice=${this._onPickerChoice}
        @close-requested=${this._closePicker}
      ></kibble-face-picker>
    `}_renderCatHeader(e,r){let s=e.last_seen!=null?`seen ${di(new Date(e.last_seen*1e3),new Date)}`:"not seen yet";return h`
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
          <span class="cat-meta">${e.samples===1?"1 sample":`${e.samples} samples`}, ${s}</span>
        </div>
      </div>
    `}_renderAddCat(){return h`
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
        ${this._addError?h`<span class="inline-error">${this._addError}</span>`:p}
      </form>
    `}async _onAddCatSubmit(e){e.preventDefault();let r=this._addName.trim();if(!(!r||!this._entities.deviceId)){this._addBusy=!0,this._addError=null;try{await this.hass.callService("kibble","add_cat",{device_id:this._entities.deviceId,name:r}),this._addName="",this._refreshCats()}catch(s){this._addError=$t(s)}finally{this._addBusy=!1}}}_renderCrop(e){let r=la(e,this._confidence()),s=this._entryId?be(this._entryId,"pending",e.name):null,n=s?this._imageCache.get(this.hass,s,()=>this.requestUpdate()):null;return h`
      <div class="crop">
        <button
          type="button"
          class="crop-thumb"
          ?disabled=${!n}
          aria-label=${r?`Confirm ${r.cat}`:"Choose a cat for this crop"}
          @click=${()=>this._onCropTap(e,r)}
        >
          ${n?h`<img src=${n} alt="" loading="lazy" />`:p}
        </button>
        <button type="button" class="chooser" aria-label="Choose a cat for this crop" @click=${o=>this._openPicker(e,o)}>&#8942;</button>
        <div class="chip ${r?`chip-${r.source}`:"chip-empty"}">
          ${r?h`${r.cat}<span class="mark">${r.source==="classifier"?"AI":"ID"}</span>`:"Tap to choose"}
        </div>
      </div>
    `}_onGridKeydown(e){if(!["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(e.key))return;let s=[...e.currentTarget.querySelectorAll(".crop-thumb")],n=s.indexOf(document.activeElement);if(n===-1)return;e.preventDefault();let o=e.key==="ArrowRight"||e.key==="ArrowDown"?1:-1;s[(n+o+s.length)%s.length]?.focus()}_onCropTap(e,r){if(!r){this._pickerCrop=e;return}this._confirm(e,r.cat)}_openPicker(e,r){this._pickerTrigger=r.currentTarget,this._pickerCrop=e}_confirm(e,r){if(!this._entities.deviceId)return;let s=this._entities.deviceId;this._hiddenCrops=new Set(this._hiddenCrops).add(e.name);let n=r==="not_a_cat"?"Not a cat":r==="other"?"Skip":r;this.hass.callService("kibble","label_face",{device_id:s,crop_id:e.name,cat:r}).then(()=>{this._refreshAll(),this._setUndo({message:`Labelled as ${n}. `,run:()=>{this.hass.callService("kibble","unlabel_face",{device_id:s,cat:r,name:e.name}).then(()=>this._refreshAll())}})}).catch(o=>{let a=new Set(this._hiddenCrops);a.delete(e.name),this._hiddenCrops=a,this._actionError={message:`Couldn't label this crop. ${$t(o)}`,retry:()=>this._confirm(e,r)}})}_setUndo(e){clearTimeout(this._undoTimer),this._undo=e,this._undoTimer=setTimeout(()=>{this._undo=null},eu)}_renderUndo(e){return h`
      <div class="undo-bar" role="status">
        <span>${e.message}</span>
        <button
          type="button"
          @click=${()=>{clearTimeout(this._undoTimer),this._undo=null,e.run()}}
        >
          Undo
        </button>
      </div>
    `}_renderActionError(){let e=this._actionError;return e?h`
      <div class="error">
        <span>${e.message}</span>
        <button
          type="button"
          @click=${()=>{this._actionError=null,e.retry()}}
        >
          Try again
        </button>
      </div>
    `:p}_renderPendingError(){let e=this._pendingQuery.state.error;return e?h`
      <div class="error">
        <span>Couldn't load the review queue. ${e}</span>
        <button type="button" @click=${()=>this._refreshPending()}>Try again</button>
      </div>
    `:p}_renderGallery(e){let s=this._sampleQueries.get(e.name)?.state.data?.samples??[];return s.length===0&&e.samples===0?p:h`
      <section class="gallery">
        <div class="gallery-heading">${e.name}, ${e.samples===1?"1 sample":`${e.samples} samples`}</div>
        <div class="gallery-grid">
          ${s.map(n=>this._renderSample(e.name,n))}
        </div>
      </section>
    `}_renderSample(e,r){let s=this._entryId?be(this._entryId,`sample/${e}`,r.name):null,n=s?this._imageCache.get(this.hass,s,()=>this.requestUpdate()):null;return h`
      <div class="sample">
        ${n?h`<img src=${n} alt="" loading="lazy" />`:p}
        <button type="button" class="remove" aria-label=${`Remove this sample of ${e}`} @click=${()=>this._removeSample(e,r)}>
          ${"\xD7"}
        </button>
      </div>
    `}_removeSample(e,r){if(!this._entities.deviceId)return;let s=this._entities.deviceId;this.hass.callService("kibble","unlabel_face",{device_id:s,cat:e,name:r.name}).then(()=>this._refreshAll()).catch(n=>{this._actionError={message:`Couldn't remove this sample. ${$t(n)}`,retry:()=>this._removeSample(e,r)}})}_refreshCats(){let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId;this._catsQuery.refresh(()=>e({type:"kibble/cats",entry_id:r}).then(s=>s))}_refreshPending(){let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId;this._pendingQuery.refresh(()=>e({type:"kibble/faces/pending",entry_id:r}).then(s=>s))}_refreshAll(){this._refreshCats(),this._refreshPending();let e=this.hass?.callWS;if(!e||!this._entryId)return;let r=this._entryId;for(let[s,n]of this._sampleQueries)n.refresh(()=>e({type:"kibble/faces/samples",entry_id:r,cat:s}).then(o=>o))}static{this.styles=S`
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
    }
    .gallery-heading {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
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
  `}};customElements.define("kibble-cats-card",As);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-cats-card",name:"Kibble Cats",description:"Enrolled cats plus a one-tap training inbox for the feeder's own face crops.",preview:!0});var iu={deviceId:"",catPresence:[]},Rs=class extends v{constructor(){super();this._entities=iu;this._catsQuery=new J(()=>this.requestUpdate());this._onFeedActivate=()=>{if(!this._entities.deviceId)return;let e=this._numberState(this._entities.feedAmount)??1;this.hass.callService("kibble","feed",{device_id:this._entities.deviceId,hopper:"both",amount:e})};this._onCancelActivate=()=>{this._entities.deviceId&&this.hass.callService("kibble","cancel_feed",{device_id:this._entities.deviceId})};this._openSettings=()=>{let e=this._config?.settings_hash;if(e){window.location.hash=e;return}this._settingsOpen=!0};this._closeSettings=()=>{this._settingsOpen=!1};this._settingsOpen=!1}static{this.properties={hass:{attribute:!1},_config:{state:!0},_settingsOpen:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-card-editor")}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(e=>{let r=e[0]?.contentRect,s=r?.height??this.getBoundingClientRect().height,n=r?.width??this.getBoundingClientRect().width;this.classList.toggle("kiosk",s>=440),this.classList.toggle("compact",n<640&&s>0&&s<=520)}),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._config?.device_id&&this.hass&&(this._entities=it(this.hass.entities??{},this._config.device_id),this._entryId=rt(this.hass.devices??{},this._config.device_id));let r=this.hass?.callWS;if(this.hass&&this._entryId&&r&&this._entities.lastSeenPet){let s=this._entryId;this._catsQuery.sync(st(this.hass,[this._entities.lastSeenPet]),()=>r({type:"kibble/cats",entry_id:s}).then(n=>n))}}render(){if(!this._config||!this.hass)return p;let e=this._entities,r=e.feeding?this.hass.states[e.feeding]?.state:void 0,n=[e.feeding,e.bowlFill1,e.bowlFill2,e.schedule].filter(m=>!!m).map(m=>this.hass.states[m]?.state),o=sn(n,r),a=r==="on",c=this._numberState(e.bowlFill1),f=this._numberState(e.bowlFill2),d=this._scheduleEntries(),l=this._numberState(e.feedAmount)??1,u=this._heroOverlay(o);return h`
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
                <span class="live-dot" ?hidden=${!u.live}></span>
                ${u.catName?h`<kibble-avatar
                      .hass=${this.hass}
                      .name=${u.catName}
                      .colorIndex=${u.colorIndex}
                      .entryId=${this._entryId}
                      .sampleName=${u.avatarSample}
                    ></kibble-avatar>`:p}
                <span class="hero-status-text" data-tone=${u.tone}>${u.text}</span>
              </div>
              <button class="gear-button" aria-label="Settings" @click=${this._openSettings}>${j("cog")}</button>
              ${this._config.name?h`<div class="name-chip">${this._config.name}</div>`:p}
            </div>
            <kibble-bowl class="bowl-block" .hopper1=${c} .hopper2=${f} .feeding=${a}></kibble-bowl>
            <div class="feed-controls">
              <kibble-segmented-picker
                class="picker-full"
                .value=${l}
                ?disabled=${o==="unreachable"||a}
                @portion-selected=${this._onPortionSelected}
              ></kibble-segmented-picker>
              <kibble-stepper
                class="picker-compact"
                .value=${l}
                ?disabled=${o==="unreachable"||a}
                @value-selected=${this._onPortionSelected}
              ></kibble-stepper>
              <kibble-hold-button
                .label=${a?"Cancel":"Hold to feed"}
                .variant=${a?"cancel":"feed"}
                ?disabled=${o==="unreachable"}
                @activate=${a?this._onCancelActivate:this._onFeedActivate}
              ></kibble-hold-button>
            </div>
            ${this._config.schedule_hash?p:h`<kibble-schedule-summary
                  class="schedule-row"
                  .hass=${this.hass}
                  .entries=${d}
                  .scheduleCardStateEntity=${e.scheduleCardState}
                ></kibble-schedule-summary>`}
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog .hass=${this.hass} .entities=${e} ?open=${this._settingsOpen} @close-requested=${this._closeSettings}></kibble-settings-dialog>
    `}_numberState(e){if(!e)return null;let r=Number(this.hass.states[e]?.state);return Number.isFinite(r)?r:null}_heroOverlay(e){let r=this._entities.camera,s=r?this.hass.states[r]:void 0,n=s!==void 0&&s.state!=="unavailable";if(e==="unreachable")return{text:or(e,null),tone:"error",live:n,catName:null,colorIndex:null,avatarSample:null};if(e==="dispensing")return{text:or(e,null),tone:"amber",live:n,catName:null,colorIndex:null,avatarSample:null};let o=this._catSeen();if(!o)return{text:"Ready to feed",tone:"normal",live:n,catName:null,colorIndex:null,avatarSample:null};let a=this._catsQuery.state.data?.cats.find(c=>c.name===o.name)??null;return{text:`${o.name} seen ${o.relative}`,tone:"normal",live:n,catName:o.name,colorIndex:a?.color_index??null,avatarSample:a?.avatar??null}}_catSeen(){let e=this._entities.lastSeenPet,r=e?this.hass.states[e]:void 0;return!r||r.state==="unavailable"||r.state.toLowerCase()==="unknown"?null:{name:r.state,relative:di(new Date(r.last_changed),new Date)}}_scheduleEntries(){let e=this._entities.schedule;if(!e)return[];let s=this.hass.states[e]?.attributes?.entries;return Array.isArray(s)?s:[]}_onPortionSelected(e){this._entities.feedAmount&&this.hass.callService("number","set_value",{value:e.detail.value},{entity_id:this._entities.feedAmount})}static{this.styles=S`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${Oe(on)};
      --kibble-amber-dark: ${Oe(an)};
      --kibble-ink-on-amber: ${Oe(ln)};
      --kibble-live: ${Oe(cn)};
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
    .hero {
      grid-area: hero;
      position: relative;
      overflow: hidden;
      height: 0;
      padding-bottom: 42%;
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
      --kibble-bowl-max-width: 170px;
    }
    .feed-controls {
      grid-area: feed;
      padding: 0 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
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
      height: 80px;
      padding-bottom: 0;
    }
    :host(.compact) .hero-status-text {
      font-size: 12px;
    }
    :host(.compact) .bowl-block {
      padding-top: 2px;
      --kibble-bowl-max-width: 190px;
    }

    /* >=640px: two columns, camera left full height, bowl/feed/schedule stacked on the right. */
    @container (min-width: 640px) {
      .root {
        grid-template-columns: 60% 1fr;
        grid-template-rows: auto auto 1fr;
        grid-template-areas: "hero bowl" "hero feed" "hero schedule";
        gap: 4px;
        padding-bottom: 0;
      }
      .hero {
        grid-area: hero;
        padding-bottom: 0;
        height: 100%;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
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
        grid-area: bowl;
        padding: 4px 16px 0;
        --kibble-bowl-max-width: 210px;
      }
      .feed-controls {
        grid-area: feed;
        padding: 6px 16px 0;
        --kibble-touch-target: 48px;
        --kibble-segment-size: 16px;
      }
      .schedule-row {
        grid-area: schedule;
        padding: 2px 16px 10px;
        align-self: start;
      }
    }
  `}};customElements.define("kibble-card",Rs);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-card",name:"Kibble",description:"The full daily control surface for a Kibble Petkit feeder: live camera, who's been by, feed, and schedule.",preview:!0});export{Rs as KibbleCard};
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
