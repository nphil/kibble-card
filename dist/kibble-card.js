var su=Object.create;var Ui=Object.defineProperty;var nu=Object.getOwnPropertyDescriptor;var ou=Object.getOwnPropertyNames;var au=Object.getPrototypeOf,lu=Object.prototype.hasOwnProperty;var cu=(i,r)=>()=>(i&&(r=i(i=0)),r);var $=(i,r)=>()=>(r||i((r={exports:{}}).exports,r),r.exports),du=(i,r)=>{for(var e in r)Ui(i,e,{get:r[e],enumerable:!0})},va=(i,r,e,t)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of ou(r))!lu.call(i,s)&&s!==e&&Ui(i,s,{get:()=>r[s],enumerable:!(t=nu(r,s))||t.enumerable});return i};var pu=(i,r,e)=>(e=i!=null?su(au(i)):{},va(r||!i||!i.__esModule?Ui(e,"default",{value:i,enumerable:!0}):e,i)),Tt=i=>va(Ui({},"__esModule",{value:!0}),i);var Ur=$(Xe=>{"use strict";Object.defineProperty(Xe,"__esModule",{value:!0});Xe.ERROR_PACKET=Xe.PACKET_TYPES_REVERSE=Xe.PACKET_TYPES=void 0;var xe=Object.create(null);Xe.PACKET_TYPES=xe;xe.open="0";xe.close="1";xe.ping="2";xe.pong="3";xe.message="4";xe.upgrade="5";xe.noop="6";var Fc=Object.create(null);Xe.PACKET_TYPES_REVERSE=Fc;Object.keys(xe).forEach(i=>{Fc[xe[i]]=i});var Mh={type:"error",data:"parser error"};Xe.ERROR_PACKET=Mh});var Vc=$(wi=>{"use strict";Object.defineProperty(wi,"__esModule",{value:!0});wi.encodePacket=void 0;wi.encodePacketToBinary=Ih;var Lh=Ur(),jc=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Nc=typeof ArrayBuffer=="function",qc=i=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(i):i&&i.buffer instanceof ArrayBuffer,Uc=({type:i,data:r},e,t)=>jc&&r instanceof Blob?e?t(r):zc(r,t):Nc&&(r instanceof ArrayBuffer||qc(r))?e?t(r):zc(new Blob([r]),t):t(Lh.PACKET_TYPES[i]+(r||""));wi.encodePacket=Uc;var zc=(i,r)=>{let e=new FileReader;return e.onload=function(){let t=e.result.split(",")[1];r("b"+(t||""))},e.readAsDataURL(i)};function Bc(i){return i instanceof Uint8Array?i:i instanceof ArrayBuffer?new Uint8Array(i):new Uint8Array(i.buffer,i.byteOffset,i.byteLength)}var Nn;function Ih(i,r){if(jc&&i.data instanceof Blob)return i.data.arrayBuffer().then(Bc).then(r);if(Nc&&(i.data instanceof ArrayBuffer||qc(i.data)))return r(Bc(i.data));Uc(i,!1,e=>{Nn||(Nn=new TextEncoder),r(Nn.encode(e))})}});var Wc=$(Nt=>{"use strict";Object.defineProperty(Nt,"__esModule",{value:!0});Nt.decode=Nt.encode=void 0;var jt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ki=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let i=0;i<jt.length;i++)ki[jt.charCodeAt(i)]=i;var Hh=i=>{let r=new Uint8Array(i),e,t=r.length,s="";for(e=0;e<t;e+=3)s+=jt[r[e]>>2],s+=jt[(r[e]&3)<<4|r[e+1]>>4],s+=jt[(r[e+1]&15)<<2|r[e+2]>>6],s+=jt[r[e+2]&63];return t%3===2?s=s.substring(0,s.length-1)+"=":t%3===1&&(s=s.substring(0,s.length-2)+"=="),s};Nt.encode=Hh;var Oh=i=>{let r=i.length*.75,e=i.length,t,s=0,n,o,a,l;i[i.length-1]==="="&&(r--,i[i.length-2]==="="&&r--);let u=new ArrayBuffer(r),h=new Uint8Array(u);for(t=0;t<e;t+=4)n=ki[i.charCodeAt(t)],o=ki[i.charCodeAt(t+1)],a=ki[i.charCodeAt(t+2)],l=ki[i.charCodeAt(t+3)],h[s++]=n<<2|o>>4,h[s++]=(o&15)<<4|a>>2,h[s++]=(a&3)<<6|l&63;return u};Nt.decode=Oh});var Gc=$(Wr=>{"use strict";Object.defineProperty(Wr,"__esModule",{value:!0});Wr.decodePacket=void 0;var Vr=Ur(),Dh=Wc(),Fh=typeof ArrayBuffer=="function",zh=(i,r)=>{if(typeof i!="string")return{type:"message",data:Kc(i,r)};let e=i.charAt(0);return e==="b"?{type:"message",data:Bh(i.substring(1),r)}:Vr.PACKET_TYPES_REVERSE[e]?i.length>1?{type:Vr.PACKET_TYPES_REVERSE[e],data:i.substring(1)}:{type:Vr.PACKET_TYPES_REVERSE[e]}:Vr.ERROR_PACKET};Wr.decodePacket=zh;var Bh=(i,r)=>{if(Fh){let e=(0,Dh.decode)(i);return Kc(e,r)}else return{base64:!0,data:i}},Kc=(i,r)=>{switch(r){case"blob":return i instanceof Blob?i:new Blob([i]);case"arraybuffer":default:return i instanceof ArrayBuffer?i:i.buffer}}});var qt=$(J=>{"use strict";Object.defineProperty(J,"__esModule",{value:!0});J.decodePayload=J.decodePacket=J.encodePayload=J.encodePacket=J.protocol=void 0;J.createPacketEncoderStream=qh;J.createPacketDecoderStream=Uh;var Un=Vc();Object.defineProperty(J,"encodePacket",{enumerable:!0,get:function(){return Un.encodePacket}});var Vn=Gc();Object.defineProperty(J,"decodePacket",{enumerable:!0,get:function(){return Vn.decodePacket}});var Yc=Ur(),Xc="",jh=(i,r)=>{let e=i.length,t=new Array(e),s=0;i.forEach((n,o)=>{(0,Un.encodePacket)(n,!1,a=>{t[o]=a,++s===e&&r(t.join(Xc))})})};J.encodePayload=jh;var Nh=(i,r)=>{let e=i.split(Xc),t=[];for(let s=0;s<e.length;s++){let n=(0,Vn.decodePacket)(e[s],r);if(t.push(n),n.type==="error")break}return t};J.decodePayload=Nh;function qh(){return new TransformStream({transform(i,r){(0,Un.encodePacketToBinary)(i,e=>{let t=e.length,s;if(t<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,t);else if(t<65536){s=new Uint8Array(3);let n=new DataView(s.buffer);n.setUint8(0,126),n.setUint16(1,t)}else{s=new Uint8Array(9);let n=new DataView(s.buffer);n.setUint8(0,127),n.setBigUint64(1,BigInt(t))}i.data&&typeof i.data!="string"&&(s[0]|=128),r.enqueue(s),r.enqueue(e)})}})}var qn;function Kr(i){return i.reduce((r,e)=>r+e.length,0)}function Gr(i,r){if(i[0].length===r)return i.shift();let e=new Uint8Array(r),t=0;for(let s=0;s<r;s++)e[s]=i[0][t++],t===i[0].length&&(i.shift(),t=0);return i.length&&t<i[0].length&&(i[0]=i[0].slice(t)),e}function Uh(i,r){qn||(qn=new TextDecoder);let e=[],t=0,s=-1,n=!1;return new TransformStream({transform(o,a){for(e.push(o);;){if(t===0){if(Kr(e)<1)break;let l=Gr(e,1);n=(l[0]&128)===128,s=l[0]&127,s<126?t=3:s===126?t=1:t=2}else if(t===1){if(Kr(e)<2)break;let l=Gr(e,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),t=3}else if(t===2){if(Kr(e)<8)break;let l=Gr(e,8),u=new DataView(l.buffer,l.byteOffset,l.length),h=u.getUint32(0);if(h>Math.pow(2,21)-1){a.enqueue(Yc.ERROR_PACKET);break}s=h*Math.pow(2,32)+u.getUint32(4),t=3}else{if(Kr(e)<s)break;let l=Gr(e,s);a.enqueue((0,Vn.decodePacket)(n?l:qn.decode(l),r)),t=0}if(s===0||s>i){a.enqueue(Yc.ERROR_PACKET);break}}}})}J.protocol=4});var Yr=$(Qc=>{Qc.Emitter=Q;function Q(i){if(i)return Vh(i)}function Vh(i){for(var r in Q.prototype)i[r]=Q.prototype[r];return i}Q.prototype.on=Q.prototype.addEventListener=function(i,r){return this._callbacks=this._callbacks||{},(this._callbacks["$"+i]=this._callbacks["$"+i]||[]).push(r),this};Q.prototype.once=function(i,r){function e(){this.off(i,e),r.apply(this,arguments)}return e.fn=r,this.on(i,e),this};Q.prototype.off=Q.prototype.removeListener=Q.prototype.removeAllListeners=Q.prototype.removeEventListener=function(i,r){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var e=this._callbacks["$"+i];if(!e)return this;if(arguments.length==1)return delete this._callbacks["$"+i],this;for(var t,s=0;s<e.length;s++)if(t=e[s],t===r||t.fn===r){e.splice(s,1);break}return e.length===0&&delete this._callbacks["$"+i],this};Q.prototype.emit=function(i){this._callbacks=this._callbacks||{};for(var r=new Array(arguments.length-1),e=this._callbacks["$"+i],t=1;t<arguments.length;t++)r[t-1]=arguments[t];if(e){e=e.slice(0);for(var t=0,s=e.length;t<s;++t)e[t].apply(this,r)}return this};Q.prototype.emitReserved=Q.prototype.emit;Q.prototype.listeners=function(i){return this._callbacks=this._callbacks||{},this._callbacks["$"+i]||[]};Q.prototype.hasListeners=function(i){return!!this.listeners(i).length}});var ft=$(Oe=>{"use strict";Object.defineProperty(Oe,"__esModule",{value:!0});Oe.defaultBinaryType=Oe.globalThisShim=Oe.nextTick=void 0;Oe.createCookieJar=Wh;Oe.nextTick=typeof Promise=="function"&&typeof Promise.resolve=="function"?r=>Promise.resolve().then(r):(r,e)=>e(r,0);Oe.globalThisShim=typeof self<"u"?self:typeof window<"u"?window:Function("return this")();Oe.defaultBinaryType="arraybuffer";function Wh(){}});var mt=$(Ut=>{"use strict";Object.defineProperty(Ut,"__esModule",{value:!0});Ut.pick=Kh;Ut.installTimerFunctions=Xh;Ut.byteLength=Zh;Ut.randomString=ef;var Qe=ft();function Kh(i,...r){return r.reduce((e,t)=>(i.hasOwnProperty(t)&&(e[t]=i[t]),e),{})}var Gh=Qe.globalThisShim.setTimeout,Yh=Qe.globalThisShim.clearTimeout;function Xh(i,r){r.useNativeTimers?(i.setTimeoutFn=Gh.bind(Qe.globalThisShim),i.clearTimeoutFn=Yh.bind(Qe.globalThisShim)):(i.setTimeoutFn=Qe.globalThisShim.setTimeout.bind(Qe.globalThisShim),i.clearTimeoutFn=Qe.globalThisShim.clearTimeout.bind(Qe.globalThisShim))}var Qh=1.33;function Zh(i){return typeof i=="string"?Jh(i):Math.ceil((i.byteLength||i.size)*Qh)}function Jh(i){let r=0,e=0;for(let t=0,s=i.length;t<s;t++)r=i.charCodeAt(t),r<128?e+=1:r<2048?e+=2:r<55296||r>=57344?e+=3:(t++,e+=4);return e}function ef(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}});var Wn=$(Xr=>{"use strict";Object.defineProperty(Xr,"__esModule",{value:!0});Xr.encode=tf;Xr.decode=rf;function tf(i){let r="";for(let e in i)i.hasOwnProperty(e)&&(r.length&&(r+="&"),r+=encodeURIComponent(e)+"="+encodeURIComponent(i[e]));return r}function rf(i){let r={},e=i.split("&");for(let t=0,s=e.length;t<s;t++){let n=e[t].split("=");r[decodeURIComponent(n[0])]=decodeURIComponent(n[1])}return r}});var Jc=$((Zy,Zc)=>{var Vt=1e3,Wt=Vt*60,Kt=Wt*60,bt=Kt*24,sf=bt*7,nf=bt*365.25;Zc.exports=function(i,r){r=r||{};var e=typeof i;if(e==="string"&&i.length>0)return of(i);if(e==="number"&&isFinite(i))return r.long?lf(i):af(i);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(i))};function of(i){if(i=String(i),!(i.length>100)){var r=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(i);if(r){var e=parseFloat(r[1]),t=(r[2]||"ms").toLowerCase();switch(t){case"years":case"year":case"yrs":case"yr":case"y":return e*nf;case"weeks":case"week":case"w":return e*sf;case"days":case"day":case"d":return e*bt;case"hours":case"hour":case"hrs":case"hr":case"h":return e*Kt;case"minutes":case"minute":case"mins":case"min":case"m":return e*Wt;case"seconds":case"second":case"secs":case"sec":case"s":return e*Vt;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return e;default:return}}}}function af(i){var r=Math.abs(i);return r>=bt?Math.round(i/bt)+"d":r>=Kt?Math.round(i/Kt)+"h":r>=Wt?Math.round(i/Wt)+"m":r>=Vt?Math.round(i/Vt)+"s":i+"ms"}function lf(i){var r=Math.abs(i);return r>=bt?Qr(i,r,bt,"day"):r>=Kt?Qr(i,r,Kt,"hour"):r>=Wt?Qr(i,r,Wt,"minute"):r>=Vt?Qr(i,r,Vt,"second"):i+" ms"}function Qr(i,r,e,t){var s=r>=e*1.5;return Math.round(i/e)+" "+t+(s?"s":"")}});var td=$((Jy,ed)=>{function cf(i){e.debug=e,e.default=e,e.coerce=l,e.disable=o,e.enable=s,e.enabled=a,e.humanize=Jc(),e.destroy=u,Object.keys(i).forEach(h=>{e[h]=i[h]}),e.names=[],e.skips=[],e.formatters={};function r(h){let d=0;for(let f=0;f<h.length;f++)d=(d<<5)-d+h.charCodeAt(f),d|=0;return e.colors[Math.abs(d)%e.colors.length]}e.selectColor=r;function e(h){let d,f=null,m,b;function v(..._){if(!v.enabled)return;let k=v,R=Number(new Date),z=R-(d||R);k.diff=z,k.prev=d,k.curr=R,d=R,_[0]=e.coerce(_[0]),typeof _[0]!="string"&&_.unshift("%O");let M=0;_[0]=_[0].replace(/%([a-zA-Z%])/g,(Y,w)=>{if(Y==="%%")return"%";M++;let E=e.formatters[w];if(typeof E=="function"){let I=_[M];Y=E.call(k,I),_.splice(M,1),M--}return Y}),e.formatArgs.call(k,_),(k.log||e.log).apply(k,_)}return v.namespace=h,v.useColors=e.useColors(),v.color=e.selectColor(h),v.extend=t,v.destroy=e.destroy,Object.defineProperty(v,"enabled",{enumerable:!0,configurable:!1,get:()=>f!==null?f:(m!==e.namespaces&&(m=e.namespaces,b=e.enabled(h)),b),set:_=>{f=_}}),typeof e.init=="function"&&e.init(v),v}function t(h,d){let f=e(this.namespace+(typeof d>"u"?":":d)+h);return f.log=this.log,f}function s(h){e.save(h),e.namespaces=h,e.names=[],e.skips=[];let d=(typeof h=="string"?h:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let f of d)f[0]==="-"?e.skips.push(f.slice(1)):e.names.push(f)}function n(h,d){let f=0,m=0,b=-1,v=0;for(;f<h.length;)if(m<d.length&&(d[m]===h[f]||d[m]==="*"))d[m]==="*"?(b=m,v=f,m++):(f++,m++);else if(b!==-1)m=b+1,v++,f=v;else return!1;for(;m<d.length&&d[m]==="*";)m++;return m===d.length}function o(){let h=[...e.names,...e.skips.map(d=>"-"+d)].join(",");return e.enable(""),h}function a(h){for(let d of e.skips)if(n(h,d))return!1;for(let d of e.names)if(n(h,d))return!0;return!1}function l(h){return h instanceof Error?h.stack||h.message:h}function u(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return e.enable(e.load()),e}ed.exports=cf});var gt=$((ee,Zr)=>{ee.formatArgs=pf;ee.save=uf;ee.load=hf;ee.useColors=df;ee.storage=ff();ee.destroy=(()=>{let i=!1;return()=>{i||(i=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();ee.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function df(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let i;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(i=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(i[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function pf(i){if(i[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+i[0]+(this.useColors?"%c ":" ")+"+"+Zr.exports.humanize(this.diff),!this.useColors)return;let r="color: "+this.color;i.splice(1,0,r,"color: inherit");let e=0,t=0;i[0].replace(/%[a-zA-Z%]/g,s=>{s!=="%%"&&(e++,s==="%c"&&(t=e))}),i.splice(t,0,r)}ee.log=console.debug||console.log||(()=>{});function uf(i){try{i?ee.storage.setItem("debug",i):ee.storage.removeItem("debug")}catch{}}function hf(){let i;try{i=ee.storage.getItem("debug")||ee.storage.getItem("DEBUG")}catch{}return!i&&typeof process<"u"&&"env"in process&&(i=process.env.DEBUG),i}function ff(){try{return localStorage}catch{}}Zr.exports=td()(ee);var{formatters:mf}=Zr.exports;mf.j=function(i){try{return JSON.stringify(i)}catch(r){return"[UnexpectedJSONParseError]: "+r.message}}});var Ci=$(Ze=>{"use strict";var bf=Ze&&Ze.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(Ze,"__esModule",{value:!0});Ze.Transport=Ze.TransportError=void 0;var gf=qt(),vf=Yr(),_f=mt(),yf=Wn(),xf=bf(gt()),wf=(0,xf.default)("engine.io-client:transport"),Jr=class extends Error{constructor(r,e,t){super(r),this.description=e,this.context=t,this.type="TransportError"}};Ze.TransportError=Jr;var Kn=class extends vf.Emitter{constructor(r){super(),this.writable=!1,(0,_f.installTimerFunctions)(this,r),this.opts=r,this.query=r.query,this.socket=r.socket,this.supportsBinary=!r.forceBase64}onError(r,e,t){return super.emitReserved("error",new Jr(r,e,t)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(r){this.readyState==="open"?this.write(r):wf("transport is not open, discarding packets")}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(r){let e=(0,gf.decodePacket)(r,this.socket.binaryType);this.onPacket(e)}onPacket(r){super.emitReserved("packet",r)}onClose(r){this.readyState="closed",super.emitReserved("close",r)}pause(r){}createUri(r,e={}){return r+"://"+this._hostname()+this._port()+this.opts.path+this._query(e)}_hostname(){let r=this.opts.hostname;return r.indexOf(":")===-1?r:"["+r+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(r){let e=(0,yf.encode)(r);return e.length?"?"+e:""}};Ze.Transport=Kn});var Yn=$(Gt=>{"use strict";var kf=Gt&&Gt.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(Gt,"__esModule",{value:!0});Gt.Polling=void 0;var Cf=Ci(),$f=mt(),id=qt(),Sf=kf(gt()),fe=(0,Sf.default)("engine.io-client:polling"),Gn=class extends Cf.Transport{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(r){this.readyState="pausing";let e=()=>{fe("paused"),this.readyState="paused",r()};if(this._polling||!this.writable){let t=0;this._polling&&(fe("we are currently polling - waiting to pause"),t++,this.once("pollComplete",function(){fe("pre-pause polling complete"),--t||e()})),this.writable||(fe("we are currently writing - waiting to pause"),t++,this.once("drain",function(){fe("pre-pause writing complete"),--t||e()}))}else e()}_poll(){fe("polling"),this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(r){fe("polling got data %s",r);let e=t=>{if(this.readyState==="opening"&&t.type==="open"&&this.onOpen(),t.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(t)};(0,id.decodePayload)(r,this.socket.binaryType).forEach(e),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"?this._poll():fe('ignoring poll - transport state "%s"',this.readyState))}doClose(){let r=()=>{fe("writing close packet"),this.write([{type:"close"}])};this.readyState==="open"?(fe("transport open - closing"),r()):(fe("transport not open - deferring close"),this.once("open",r))}write(r){this.writable=!1,(0,id.encodePayload)(r,e=>{this.doWrite(e,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){let r=this.opts.secure?"https":"http",e=this.query||{};return this.opts.timestampRequests!==!1&&(e[this.opts.timestampParam]=(0,$f.randomString)()),!this.supportsBinary&&!e.sid&&(e.b64=1),this.createUri(r,e)}};Gt.Polling=Gn});var sd=$(es=>{"use strict";Object.defineProperty(es,"__esModule",{value:!0});es.hasCORS=void 0;var rd=!1;try{rd=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}es.hasCORS=rd});var is=$(we=>{"use strict";var Ef=we&&we.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(we,"__esModule",{value:!0});we.XHR=we.Request=we.BaseXHR=void 0;var Tf=Yn(),Pf=Yr(),nd=mt(),ad=ft(),Af=sd(),Rf=Ef(gt()),Xn=(0,Rf.default)("engine.io-client:polling");function Mf(){}var ts=class extends Tf.Polling{constructor(r){if(super(r),typeof location<"u"){let e=location.protocol==="https:",t=location.port;t||(t=e?"443":"80"),this.xd=typeof location<"u"&&r.hostname!==location.hostname||t!==r.port}}doWrite(r,e){let t=this.request({method:"POST",data:r});t.on("success",e),t.on("error",(s,n)=>{this.onError("xhr post error",s,n)})}doPoll(){Xn("xhr poll");let r=this.request();r.on("data",this.onData.bind(this)),r.on("error",(e,t)=>{this.onError("xhr poll error",e,t)}),this.pollXhr=r}};we.BaseXHR=ts;var De=class i extends Pf.Emitter{constructor(r,e,t){super(),this.createRequest=r,(0,nd.installTimerFunctions)(this,t),this._opts=t,this._method=t.method||"GET",this._uri=e,this._data=t.data!==void 0?t.data:null,this._create()}_create(){var r;let e=(0,nd.pick)(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");e.xdomain=!!this._opts.xd;let t=this._xhr=this.createRequest(e);try{Xn("xhr open %s: %s",this._method,this._uri),t.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){t.setDisableHeaderCheck&&t.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&t.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{t.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{t.setRequestHeader("Accept","*/*")}catch{}(r=this._opts.cookieJar)===null||r===void 0||r.addCookies(t),"withCredentials"in t&&(t.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(t.timeout=this._opts.requestTimeout),t.onreadystatechange=()=>{var s;t.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(t.getResponseHeader("set-cookie"))),t.readyState===4&&(t.status===200||t.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof t.status=="number"?t.status:0)},0))},Xn("xhr data %s",this._data),t.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=i.requestsCount++,i.requests[this._index]=this)}_onError(r){this.emitReserved("error",r,this._xhr),this._cleanup(!0)}_cleanup(r){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Mf,r)try{this._xhr.abort()}catch{}typeof document<"u"&&delete i.requests[this._index],this._xhr=null}}_onLoad(){let r=this._xhr.responseText;r!==null&&(this.emitReserved("data",r),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};we.Request=De;De.requestsCount=0;De.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",od);else if(typeof addEventListener=="function"){let i="onpagehide"in ad.globalThisShim?"pagehide":"unload";addEventListener(i,od,!1)}}function od(){for(let i in De.requests)De.requests.hasOwnProperty(i)&&De.requests[i].abort()}var Lf=function(){let i=ld({xdomain:!1});return i&&i.responseType!==null}(),Qn=class extends ts{constructor(r){super(r);let e=r&&r.forceBase64;this.supportsBinary=Lf&&!e}request(r={}){return Object.assign(r,{xd:this.xd},this.opts),new De(ld,this.uri(),r)}};we.XHR=Qn;function ld(i){let r=i.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!r||Af.hasCORS))return new XMLHttpRequest}catch{}if(!r)try{return new ad.globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}});var ss=$(Je=>{"use strict";var If=Je&&Je.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(Je,"__esModule",{value:!0});Je.WS=Je.BaseWS=void 0;var Hf=Ci(),cd=mt(),Of=qt(),Jn=ft(),Df=If(gt()),Ff=(0,Df.default)("engine.io-client:websocket"),dd=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative",rs=class extends Hf.Transport{get name(){return"websocket"}doOpen(){let r=this.uri(),e=this.opts.protocols,t=dd?{}:(0,cd.pick)(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(t.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(r,e,t)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=r=>this.onClose({description:"websocket connection closed",context:r}),this.ws.onmessage=r=>this.onData(r.data),this.ws.onerror=r=>this.onError("websocket error",r)}write(r){this.writable=!1;for(let e=0;e<r.length;e++){let t=r[e],s=e===r.length-1;(0,Of.encodePacket)(t,this.supportsBinary,n=>{try{this.doWrite(t,n)}catch{Ff("websocket closed before onclose event")}s&&(0,Jn.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){let r=this.opts.secure?"wss":"ws",e=this.query||{};return this.opts.timestampRequests&&(e[this.opts.timestampParam]=(0,cd.randomString)()),this.supportsBinary||(e.b64=1),this.createUri(r,e)}};Je.BaseWS=rs;var Zn=Jn.globalThisShim.WebSocket||Jn.globalThisShim.MozWebSocket,eo=class extends rs{createSocket(r,e,t){return dd?new Zn(r,e,t):e?new Zn(r,e):new Zn(r)}doWrite(r,e){this.ws.send(e)}};Je.WS=eo});var io=$(Yt=>{"use strict";var zf=Yt&&Yt.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(Yt,"__esModule",{value:!0});Yt.WT=void 0;var Bf=Ci(),jf=ft(),pd=qt(),Nf=zf(gt()),$i=(0,Nf.default)("engine.io-client:webtransport"),to=class extends Bf.Transport{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(r){return this.emitReserved("error",r)}this._transport.closed.then(()=>{$i("transport closed gracefully"),this.onClose()}).catch(r=>{$i("transport closed due to %s",r),this.onError("webtransport error",r)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(r=>{let e=(0,pd.createPacketDecoderStream)(Number.MAX_SAFE_INTEGER,this.socket.binaryType),t=r.readable.pipeThrough(e).getReader(),s=(0,pd.createPacketEncoderStream)();s.readable.pipeTo(r.writable),this._writer=s.writable.getWriter();let n=()=>{t.read().then(({done:a,value:l})=>{if(a){$i("session is closed");return}$i("received chunk: %o",l),this.onPacket(l),n()}).catch(a=>{$i("an error occurred while reading: %s",a)})};n();let o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(r){this.writable=!1;for(let e=0;e<r.length;e++){let t=r[e],s=e===r.length-1;this._writer.write(t).then(()=>{s&&(0,jf.nextTick)(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var r;(r=this._transport)===null||r===void 0||r.close()}};Yt.WT=to});var ro=$(ns=>{"use strict";Object.defineProperty(ns,"__esModule",{value:!0});ns.transports=void 0;var qf=is(),Uf=ss(),Vf=io();ns.transports={websocket:Uf.WS,webtransport:Vf.WT,polling:qf.XHR}});var no=$(so=>{"use strict";Object.defineProperty(so,"__esModule",{value:!0});so.parse=Gf;var Wf=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Kf=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Gf(i){if(i.length>8e3)throw"URI too long";let r=i,e=i.indexOf("["),t=i.indexOf("]");e!=-1&&t!=-1&&(i=i.substring(0,e)+i.substring(e,t).replace(/:/g,";")+i.substring(t,i.length));let s=Wf.exec(i||""),n={},o=14;for(;o--;)n[Kf[o]]=s[o]||"";return e!=-1&&t!=-1&&(n.source=r,n.host=n.host.substring(1,n.host.length-1).replace(/;/g,":"),n.authority=n.authority.replace("[","").replace("]","").replace(/;/g,":"),n.ipv6uri=!0),n.pathNames=Yf(n,n.path),n.queryKey=Xf(n,n.query),n}function Yf(i,r){let e=/\/{2,9}/g,t=r.replace(e,"/").split("/");return(r.slice(0,1)=="/"||r.length===0)&&t.splice(0,1),r.slice(-1)=="/"&&t.splice(t.length-1,1),t}function Xf(i,r){let e={};return r.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(t,s,n){s&&(e[s]=n)}),e}});var co=$(ke=>{"use strict";var Qf=ke&&ke.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(ke,"__esModule",{value:!0});ke.Socket=ke.SocketWithUpgrade=ke.SocketWithoutUpgrade=void 0;var Zf=ro(),ud=mt(),Jf=Wn(),hd=no(),em=Yr(),fd=qt(),oo=ft(),tm=Qf(gt()),L=(0,tm.default)("engine.io-client:socket"),ao=typeof addEventListener=="function"&&typeof removeEventListener=="function",Si=[];ao&&addEventListener("offline",()=>{L("closing %d connection(s) because the network was lost",Si.length),Si.forEach(i=>i())},!1);var vt=class i extends em.Emitter{constructor(r,e){if(super(),this.binaryType=oo.defaultBinaryType,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,r&&typeof r=="object"&&(e=r,r=null),r){let t=(0,hd.parse)(r);e.hostname=t.host,e.secure=t.protocol==="https"||t.protocol==="wss",e.port=t.port,t.query&&(e.query=t.query)}else e.host&&(e.hostname=(0,hd.parse)(e.host).host);(0,ud.installTimerFunctions)(this,e),this.secure=e.secure!=null?e.secure:typeof location<"u"&&location.protocol==="https:",e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.hostname=e.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=e.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},e.transports.forEach(t=>{let s=t.prototype.name;this.transports.push(s),this._transportsByName[s]=t}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},e),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=(0,Jf.decode)(this.opts.query)),ao&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(L("adding listener for the 'offline' event"),this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Si.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=(0,oo.createCookieJar)()),this._open()}createTransport(r){L('creating transport "%s"',r);let e=Object.assign({},this.opts.query);e.EIO=fd.protocol,e.transport=r,this.id&&(e.sid=this.id);let t=Object.assign({},this.opts,{query:e,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[r]);return L("options: %j",t),new this._transportsByName[r](t)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}let r=this.opts.rememberUpgrade&&i.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";let e=this.createTransport(r);e.open(),this.setTransport(e)}setTransport(r){L("setting transport %s",r.name),this.transport&&(L("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=r,r.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",e=>this._onClose("transport close",e))}onOpen(){L("socket open"),this.readyState="open",i.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(r){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(L('socket receive: type "%s", data "%s"',r.type,r.data),this.emitReserved("packet",r),this.emitReserved("heartbeat"),r.type){case"open":this.onHandshake(JSON.parse(r.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":let e=new Error("server error");e.code=r.data,this._onError(e);break;case"message":this.emitReserved("data",r.data),this.emitReserved("message",r.data);break}else L('packet received with socket readyState "%s"',this.readyState)}onHandshake(r){this.emitReserved("handshake",r),this.id=r.sid,this.transport.query.sid=r.sid,this._pingInterval=r.pingInterval,this._pingTimeout=r.pingTimeout,this._maxPayload=r.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);let r=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+r,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},r),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){let r=this._getWritablePackets();L("flushing %d packets in socket",r.length),this.transport.send(r),this._prevBufferLen=r.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let e=1;for(let t=0;t<this.writeBuffer.length;t++){let s=this.writeBuffer[t].data;if(s&&(e+=(0,ud.byteLength)(s)),t>0&&e>this._maxPayload)return L("only send %d out of %d packets",t,this.writeBuffer.length),this.writeBuffer.slice(0,t);e+=2}return L("payload size is %d (max: %d)",e,this._maxPayload),this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;let r=Date.now()>this._pingTimeoutTime;return r&&(L("throttled timer detected, scheduling connection close"),this._pingTimeoutTime=0,(0,oo.nextTick)(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),r}write(r,e,t){return this._sendPacket("message",r,e,t),this}send(r,e,t){return this._sendPacket("message",r,e,t),this}_sendPacket(r,e,t,s){if(typeof e=="function"&&(s=e,e=void 0),typeof t=="function"&&(s=t,t=null),this.readyState==="closing"||this.readyState==="closed")return;t=t||{},t.compress=t.compress!==!1;let n={type:r,data:e,options:t};this.emitReserved("packetCreate",n),this.writeBuffer.push(n),s&&this.once("flush",s),this.flush()}close(){let r=()=>{this._onClose("forced close"),L("socket closing - telling transport to close"),this.transport.close()},e=()=>{this.off("upgrade",e),this.off("upgradeError",e),r()},t=()=>{this.once("upgrade",e),this.once("upgradeError",e)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?t():r()}):this.upgrading?t():r()),this}_onError(r){if(L("socket error %j",r),i.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return L("trying next transport"),this.transports.shift(),this._open();this.emitReserved("error",r),this._onClose("transport error",r)}_onClose(r,e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(L('socket close with reason: "%s"',r),this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ao&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){let t=Si.indexOf(this._offlineEventListener);t!==-1&&(L("removing listener for the 'offline' event"),Si.splice(t,1))}this.readyState="closed",this.id=null,this.emitReserved("close",r,e),this.writeBuffer=[],this._prevBufferLen=0}}};ke.SocketWithoutUpgrade=vt;vt.protocol=fd.protocol;var os=class extends vt{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade){L("starting upgrade probes");for(let r=0;r<this._upgrades.length;r++)this._probe(this._upgrades[r])}}_probe(r){L('probing transport "%s"',r);let e=this.createTransport(r),t=!1;vt.priorWebsocketSuccess=!1;let s=()=>{t||(L('probe transport "%s" opened',r),e.send([{type:"ping",data:"probe"}]),e.once("packet",d=>{if(!t)if(d.type==="pong"&&d.data==="probe"){if(L('probe transport "%s" pong',r),this.upgrading=!0,this.emitReserved("upgrading",e),!e)return;vt.priorWebsocketSuccess=e.name==="websocket",L('pausing current transport "%s"',this.transport.name),this.transport.pause(()=>{t||this.readyState!=="closed"&&(L("changing transport and sending upgrade packet"),h(),this.setTransport(e),e.send([{type:"upgrade"}]),this.emitReserved("upgrade",e),e=null,this.upgrading=!1,this.flush())})}else{L('probe transport "%s" failed',r);let f=new Error("probe error");f.transport=e.name,this.emitReserved("upgradeError",f)}}))};function n(){t||(t=!0,h(),e.close(),e=null)}let o=d=>{let f=new Error("probe error: "+d);f.transport=e.name,n(),L('probe transport "%s" failed because of error: %s',r,d),this.emitReserved("upgradeError",f)};function a(){o("transport closed")}function l(){o("socket closed")}function u(d){e&&d.name!==e.name&&(L('"%s" works - aborting "%s"',d.name,e.name),n())}let h=()=>{e.removeListener("open",s),e.removeListener("error",o),e.removeListener("close",a),this.off("close",l),this.off("upgrading",u)};e.once("open",s),e.once("error",o),e.once("close",a),this.once("close",l),this.once("upgrading",u),this._upgrades.indexOf("webtransport")!==-1&&r!=="webtransport"?this.setTimeoutFn(()=>{t||e.open()},200):e.open()}onHandshake(r){this._upgrades=this._filterUpgrades(r.upgrades),super.onHandshake(r)}_filterUpgrades(r){let e=[];for(let t=0;t<r.length;t++)~this.transports.indexOf(r[t])&&e.push(r[t]);return e}};ke.SocketWithUpgrade=os;var lo=class extends os{constructor(r,e={}){let t=typeof r=="object",s=t?{...r}:{...e};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(n=>Zf.transports[n]).filter(n=>!!n)),super(t?s:r,s)}};ke.Socket=lo});var md=$(as=>{"use strict";Object.defineProperty(as,"__esModule",{value:!0});as.Fetch=void 0;var im=Yn(),po=class extends im.Polling{doPoll(){this._fetch().then(r=>{if(!r.ok)return this.onError("fetch read error",r.status,r);r.text().then(e=>this.onData(e))}).catch(r=>{this.onError("fetch read error",r)})}doWrite(r,e){this._fetch(r).then(t=>{if(!t.ok)return this.onError("fetch write error",t.status,t);e()}).catch(t=>{this.onError("fetch write error",t)})}_fetch(r){var e;let t=r!==void 0,s=new Headers(this.opts.extraHeaders);return t&&s.set("content-type","text/plain;charset=UTF-8"),(e=this.socket._cookieJar)===null||e===void 0||e.appendCookies(s),fetch(this.uri(),{method:t?"POST":"GET",body:t?r:null,headers:s,credentials:this.opts.withCredentials?"include":"omit"}).then(n=>{var o;return(o=this.socket._cookieJar)===null||o===void 0||o.parseCookies(n.headers.getSetCookie()),n})}};as.Fetch=po});var _d=$(A=>{"use strict";Object.defineProperty(A,"__esModule",{value:!0});A.WebTransport=A.WebSocket=A.NodeWebSocket=A.XHR=A.NodeXHR=A.Fetch=A.nextTick=A.parse=A.installTimerFunctions=A.transports=A.TransportError=A.Transport=A.protocol=A.SocketWithUpgrade=A.SocketWithoutUpgrade=A.Socket=void 0;var bd=co();Object.defineProperty(A,"Socket",{enumerable:!0,get:function(){return bd.Socket}});var gd=co();Object.defineProperty(A,"SocketWithoutUpgrade",{enumerable:!0,get:function(){return gd.SocketWithoutUpgrade}});Object.defineProperty(A,"SocketWithUpgrade",{enumerable:!0,get:function(){return gd.SocketWithUpgrade}});A.protocol=bd.Socket.protocol;var vd=Ci();Object.defineProperty(A,"Transport",{enumerable:!0,get:function(){return vd.Transport}});Object.defineProperty(A,"TransportError",{enumerable:!0,get:function(){return vd.TransportError}});var rm=ro();Object.defineProperty(A,"transports",{enumerable:!0,get:function(){return rm.transports}});var sm=mt();Object.defineProperty(A,"installTimerFunctions",{enumerable:!0,get:function(){return sm.installTimerFunctions}});var nm=no();Object.defineProperty(A,"parse",{enumerable:!0,get:function(){return nm.parse}});var om=ft();Object.defineProperty(A,"nextTick",{enumerable:!0,get:function(){return om.nextTick}});var am=md();Object.defineProperty(A,"Fetch",{enumerable:!0,get:function(){return am.Fetch}});var lm=is();Object.defineProperty(A,"NodeXHR",{enumerable:!0,get:function(){return lm.XHR}});var cm=is();Object.defineProperty(A,"XHR",{enumerable:!0,get:function(){return cm.XHR}});var dm=ss();Object.defineProperty(A,"NodeWebSocket",{enumerable:!0,get:function(){return dm.WS}});var pm=ss();Object.defineProperty(A,"WebSocket",{enumerable:!0,get:function(){return pm.WS}});var um=io();Object.defineProperty(A,"WebTransport",{enumerable:!0,get:function(){return um.WT}})});var yd=$(Fe=>{"use strict";Object.defineProperty(Fe,"__esModule",{value:!0});Fe.TimeoutError=void 0;Fe.singletonPromise=hm;Fe.timeoutPromise=fm;Fe.timeoutFunction=mm;Fe.createPromiseDebouncer=bm;Fe.createMapPromiseDebouncer=gm;function hm(i,r,e=0){if(i?.promise)return i;let t=r();return i?i.promise=t:i={promise:t,cacheDuration:e},t.finally(()=>setTimeout(()=>i.promise=void 0,i.cacheDuration)),i}var Ei=class extends Error{promise;constructor(r){super("Operation Timed Out"),this.promise=r}};Fe.TimeoutError=Ei;function fm(i,r){return new Promise((e,t)=>{let s=setTimeout(()=>t(new Ei(r)),i);r.then(n=>{clearTimeout(s),e(n)}).catch(n=>{clearTimeout(s),t(n)})})}function mm(i,r){return new Promise((e,t)=>{let s=!1,n=r(()=>s),o=setTimeout(()=>{s=!0,t(new Ei(n))},i);n.then(a=>{clearTimeout(o),e(a)}).catch(a=>{clearTimeout(o),t(a)})})}function bm(){let i;return r=>(i||(i=r().finally(()=>i=void 0)),i)}function gm(){let i=new Map;return(r,e,t)=>{let s=JSON.stringify(r),n=i.get(s);return n||(n=t().finally(()=>{if(!e){i.delete(s);return}setTimeout(()=>i.delete(s),e)}),i.set(s,n)),n}}});var $e=$(et=>{"use strict";Object.defineProperty(et,"__esModule",{value:!0});et.RpcPeer=et.RPCResultError=void 0;et.startPeriodicGarbageCollection=xd;et.getEvalSource=vm;function xd(){globalThis.gc||console.warn("rpc peer garbage collection not available: global.gc is not exposed.");let i;try{i=globalThis}catch{}let r=0;return setInterval(()=>{let e=Date.now(),t=e-r,s=G.remotesCreated;G.remotesCreated=0;let n=G.remotesCollected;G.remotesCollected=0,(s||n||t>5*60*1e3)&&(r=e,i?.gc?.())},1e4)}var ls=class i{peer;entry;constructorName;proxyProps;proxyOneWayMethods;static iteratorMethods=new Set(["next","throw","return"]);constructor(r,e,t,s,n){this.peer=r,this.entry=e,this.constructorName=t,this.proxyProps=s,this.proxyOneWayMethods=n}toPrimitive(){let r=this.peer;return`RpcProxy-${r.selfName}:${r.peerName}: ${this.constructorName}`}get(r,e,t){if(e===Symbol.asyncIterator)return this.proxyProps?.[Symbol.asyncIterator.toString()]?()=>new Proxy(()=>{},this):void 0;if(i.iteratorMethods.has(e?.toString())){let n=this.proxyProps?.[Symbol.asyncIterator.toString()]?.[e];if(n)return new Proxy(()=>n,this)}if(e===G.PROPERTY_PROXY_ID)return this.entry.id;if(e==="__proxy_constructor")return this.constructorName;if(e===G.PROPERTY_PROXY_PEER)return this.peer;if(e===G.PROPERTY_PROXY_PROPERTIES)return this.proxyProps;if(e===G.PROPERTY_PROXY_ONEWAY_METHODS)return this.proxyOneWayMethods;if(e===G.PROPERTY_JSON_DISABLE_SERIALIZATION||e===G.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN||e==="then"||e==="constructor")return;if(this.proxyProps?.[e]!==void 0)return this.proxyProps?.[e];let s=G.handleFunctionInvocations(this,r,e,t);return s||new Proxy(()=>e,this)}set(r,e,t,s){return e===G.finalizerIdSymbol?this.entry.finalizerId=t:(this.proxyProps||={},this.proxyProps[e]=t),!0}apply(r,e,t){let s=r()||null,n=this.proxyOneWayMethods?.includes?.(s);if(Object.isFrozen(this.peer.pendingResults))return n?Promise.resolve():Promise.reject(new Ce(this.peer,"RpcPeer has been killed (apply) "+r()));let o=[],a={};for(let d of t||[])o.push(this.peer.serialize(d,a));let l={type:"apply",id:void 0,proxyId:this.entry.id,args:o,method:s};if(n)return l.oneway=!0,s===null&&delete l.method,this.peer.send(l,void 0,a),Promise.resolve();let u=this.peer.createPendingResult(s,(d,f)=>{l.id=d,this.peer.send(l,f,a)}),h=this.proxyProps?.[Symbol.asyncIterator.toString()];return!h||s!==h.next&&s!==h.return?u:u.then(d=>s===h.return?{done:!0,value:void 0}:{value:d,done:!1}).catch(d=>{if(d.name==="StopAsyncIteration")return{done:!0,value:void 0};throw d})}},Ce=class extends Error{cause;constructor(r,e,t,s){super(`${e}
${r.selfName}:${r.peerName}`),this.cause=t,s?.name&&(this.name=s?.name),s?.stack&&(this.stack=`${t?.stack||s.stack}
${r.peerName}:${r.selfName}`)}};et.RPCResultError=Ce;try{let i=FinalizationRegistry}catch{window.WeakRef=class{target;constructor(e){this.target=e}deref(){return this.target}},window.FinalizationRegistry=class{register(){}}}var G=class i{selfName;peerName;send;params={};pendingResults={};localProxied=new Map;localProxyMap=new Map;remoteWeakProxies={};finalizers=new FinalizationRegistry(r=>this.finalize(r));nameDeserializerMap=new Map;onProxyTypeSerialization=new Map;onProxySerialization;constructorSerializerMap=new Map;transportSafeArgumentTypes=i.getDefaultTransportSafeArgumentTypes();killed;killedSafe;killedDeferred;tags={};yieldedAsyncIterators=new Set;static finalizerIdSymbol=Symbol("rpcFinalizerId");static remotesCollected=0;static remotesCreated=0;static activeRpcPeer;static isRpcProxy(r){return!!r?.[i.PROPERTY_PROXY_ID]}static getDefaultTransportSafeArgumentTypes(){let r=new Set;return r.add(Number.name),r.add(String.name),r.add(Object.name),r.add(Boolean.name),r.add(Array.name),r}static handleFunctionInvocations(r,e,t,s){if(t==="apply")return(n,o)=>r.apply(e,r,o);if(t==="call")return(n,...o)=>r.apply(e,r,o);if(t==="toString"||t===Symbol.toPrimitive)return(n,...o)=>r.toPrimitive()}static getIteratorNext(r){return r[Symbol.asyncIterator]?r[this.PROPERTY_PROXY_PROPERTIES]?.[Symbol.asyncIterator.toString()]?.next||"next":void 0}static prepareProxyProperties(r){let e=r?.[i.PROPERTY_PROXY_PROPERTIES];return r[Symbol.asyncIterator]&&(e||={},e[Symbol.asyncIterator.toString()]||(e[Symbol.asyncIterator.toString()]={next:"next",throw:"throw",return:"return"})),e}static RANDOM_DIGITS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";static RPC_RESULT_ERROR_NAME="RPCResultError";static PROPERTY_PROXY_ID="__proxy_id";static PROPERTY_PROXY_PEER="__proxy_peer";static PROPERTY_PROXY_ONEWAY_METHODS="__proxy_oneway_methods";static PROPERTY_JSON_DISABLE_SERIALIZATION="__json_disable_serialization";static PROPERTY_PROXY_PROPERTIES="__proxy_props";static PROPERTY_JSON_COPY_SERIALIZE_CHILDREN="__json_copy_serialize_children";static PROBED_PROPERTIES=new Set(["then","constructor","__proxy_id","__proxy_constructor",i.PROPERTY_PROXY_PEER,i.PROPERTY_PROXY_ONEWAY_METHODS,i.PROPERTY_JSON_DISABLE_SERIALIZATION,i.PROPERTY_PROXY_PROPERTIES,i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]);constructor(r,e,t){this.selfName=r,this.peerName=e,this.send=t,this.killed=new Promise((s,n)=>{this.killedDeferred={resolve:s,reject:n,method:void 0}}).catch(s=>s.message||"Unknown Error"),this.killedSafe=this.killed.then(()=>{}).catch(()=>{})}static isTransportSafe(r){return r?!r[Symbol.asyncIterator]&&!r[i.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.getDefaultTransportSafeArgumentTypes().has(r.constructor?.name):!0}isTransportSafe(r){return r?!r[Symbol.asyncIterator]&&!r[i.PROPERTY_JSON_DISABLE_SERIALIZATION]&&this.transportSafeArgumentTypes.has(r.constructor?.name):!0}static generateId(){return[...new Array(8)].map(()=>i.RANDOM_DIGITS.charAt(Math.floor(Math.random()*i.RANDOM_DIGITS.length))).join("")}createPendingResult(r,e){if(Object.isFrozen(this.pendingResults))return Promise.reject(new Ce(this,"RpcPeer has been killed (createPendingResult)"));let t=new Promise((s,n)=>{let o=i.generateId();this.pendingResults[o]={resolve:s,reject:n,method:r},e(o,a=>n(new Ce(this,a.message,a)))});return t.catch(()=>{}),t}kill(r){if(Object.isFrozen(this.pendingResults))return;let e=new Ce(this,r||"peer was killed");this.killedDeferred.reject(e);for(let t of Object.values(this.pendingResults))t.reject(e);for(let t of this.yieldedAsyncIterators)t.throw(e).catch(()=>{});this.yieldedAsyncIterators.clear(),this.pendingResults=Object.freeze({}),this.params=Object.freeze({}),this.remoteWeakProxies=Object.freeze({}),this.localProxyMap.clear(),this.localProxied.clear()}addSerializer(r,e,t){this.nameDeserializerMap.set(e,t),this.constructorSerializerMap.set(r,e)}finalize(r){i.remotesCollected++,delete this.remoteWeakProxies[r.id];let e={__local_proxy_id:r.id,__local_proxy_finalizer_id:r.finalizerId,type:"finalize"};this.send(e)}async getParam(r){return this.createPendingResult("getParam",(e,t)=>{let s={id:e,type:"param",param:r};this.send(s,t)})}createErrorResult(r,e){return r.result=this.serializeError(e),r.throw=!0,r}deserialize(r,e){if(!r)return r;let t=r[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN];if(t){if(Array.isArray(t)){let m=[];for(let b of t)m.push(this.deserialize(b,e));return m}let f={};for(let[m,b]of Object.entries(r))f[m]=this.deserialize(b,e);return f}let{__remote_proxy_id:s,__remote_proxy_finalizer_id:n,__local_proxy_id:o,__remote_constructor_name:a,__serialized_value:l,__remote_proxy_props:u,__remote_proxy_oneway_methods:h}=r;if(a===i.RPC_RESULT_ERROR_NAME)return this.deserializeError(l);if(s){let f=this.remoteWeakProxies[s]?.deref();f||(f=this.newProxy(s,a,u,h)),f[i.finalizerIdSymbol]=n;let m=this.nameDeserializerMap.get(a);return m?m.deserialize(f,e):f}if(o){let f=this.localProxyMap.get(o);if(!f)throw new Ce(this,`invalid local proxy id ${o}`);return f}let d=this.nameDeserializerMap.get(a);return d?d.deserialize(l,e):r}deserializeError(r){let{name:e,stack:t,message:s}=r;return new Ce(this,s,void 0,{name:e,stack:t})}serializeError(r){let e={stack:r.stack||"[no stack]",name:r.name||"[no name]",message:r.message||"[no message]"};return{__remote_constructor_name:i.RPC_RESULT_ERROR_NAME,__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_proxy_oneway_methods:void 0,__remote_proxy_props:void 0,__serialized_value:e}}serialize(r,e){if(r?.[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]===!0){if(Array.isArray(r)){let f=[];for(let m of r)f.push(this.serialize(m,e));return{[i.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]:f}}let d={};for(let[f,m]of Object.entries(r))d[f]=this.serialize(m,e);return d}if(this.isTransportSafe(r))return r;let t=r.__proxy_constructor||r.constructor?.name?.toString();if(r instanceof Error)return this.serializeError(r);let s=this.constructorSerializerMap.get(r.constructor);if(s){t=s;let d=this.nameDeserializerMap.get(s);if(!d)throw new Error("serializer not found for "+s);let f=d.serialize(r,e);return{__remote_proxy_id:void 0,__remote_proxy_finalizer_id:void 0,__remote_constructor_name:t,__remote_proxy_props:i.prepareProxyProperties(r),__remote_proxy_oneway_methods:r?.[i.PROPERTY_PROXY_ONEWAY_METHODS],__serialized_value:f}}let n=this.localProxied.get(r);if(n){let{proxyId:d,properties:f}=this.onProxySerialization?.(r)||{proxyId:n.id,properties:i.prepareProxyProperties(r)};if(d!==n.id)throw new Error("onProxySerialization proxy id mismatch");let m=i.generateId();return n.finalizerId=m,{__remote_proxy_id:d,__remote_proxy_finalizer_id:m,__remote_constructor_name:t,__remote_proxy_props:f,__remote_proxy_oneway_methods:r?.[i.PROPERTY_PROXY_ONEWAY_METHODS]}}let{__proxy_id:o,__proxy_peer:a}=r;if(o&&a===this)return{__local_proxy_id:o};this.onProxyTypeSerialization.get(t)?.(r);let{proxyId:l,properties:u}=this.onProxySerialization?.(r)||{proxyId:i.generateId(),properties:i.prepareProxyProperties(r)};return n={id:l,finalizerId:l},this.localProxied.set(r,n),this.localProxyMap.set(l,r),{__remote_proxy_id:l,__remote_proxy_finalizer_id:l,__remote_constructor_name:t,__remote_proxy_props:u,__remote_proxy_oneway_methods:r?.[i.PROPERTY_PROXY_ONEWAY_METHODS]}}newProxy(r,e,t,s){i.remotesCreated++;let n={id:r,finalizerId:void 0},o=new ls(this,n,e,t,s),a=e==="Function"||e==="AsyncFunction"?function(){}:o,l=new Proxy(a,o),u=new WeakRef(l);return this.remoteWeakProxies[r]=u,this.finalizers.register(o,n),l}handleMessage(r,e){try{i.activeRpcPeer=this,this.handleMessageInternal(r,e)}finally{i.activeRpcPeer=void 0}}sendResult(r,e){this.send(r,t=>{this.send(this.createErrorResult(r,t),void 0,e)},e)}async handleMessageInternal(r,e){if(!Object.isFrozen(this.pendingResults))try{switch(r.type){case"param":{let t=r,s={},n;try{n={type:"result",id:t.id,result:this.serialize(this.params[t.param],s)}}catch(o){this.createErrorResult(n,o)}this.sendResult(n,s);break}case"apply":{let t=r,s={type:"result",id:t.id||""},n={};try{let o=this.localProxyMap.get(t.proxyId);if(!o)throw new Error(`proxy id ${t.proxyId} not found`);let a=[];for(let u of t.args||[])a.push(this.deserialize(u,e));let l;if(t.method){if(!o[t.method])throw new Error(`target ${o?.constructor?.name} does not have method ${t.method}`);let h=i.getIteratorNext(o)===t.method;if(h&&this.yieldedAsyncIterators.delete(o),l=await o[t.method](...a),h){if(l.done)throw{name:"StopAsyncIteration",message:void 0};Object.isFrozen(this.pendingResults)?o.throw(new Ce(this,"RpcPeer has been killed (yield)")).catch(()=>{}):this.yieldedAsyncIterators.add(o),l=l.value}}else l=await o(...a);s.result=this.serialize(l,n)}catch(o){this.createErrorResult(s,o)}t.oneway||this.sendResult(s,n);break}case"result":{let t=r,s=this.pendingResults[t.id];if(delete this.pendingResults[t.id],!s)throw new Error(`unknown result ${t.id}`);let n=this.deserialize(t.result,e);t.throw?s.reject(n):s.resolve(n);break}case"finalize":{let t=r,s=this.localProxyMap.get(t.__local_proxy_id);if(s){let n=this.localProxied.get(s);if(t.__local_proxy_finalizer_id&&t.__local_proxy_finalizer_id!==n?.finalizerId)break;this.localProxyMap.delete(t.__local_proxy_id),this.localProxied.delete(s)}break}default:throw new Error(`unknown rpc message type ${r.type}`)}}catch(t){console.error("unhandled rpc error",this.peerName,t);return}}};et.RpcPeer=G;function vm(){return`
    (() => {
        ${ls}

        ${G}

        ${xd}

        return {
            startPeriodicGarbageCollection,
            RpcPeer,
            RpcProxy,
        };
    })();
    `}});var wd=$(cs=>{"use strict";Object.defineProperty(cs,"__esModule",{value:!0});cs.MediaObject=void 0;var _m=$e(),uo=class{mimeType;data;__proxy_props;constructor(r,e,t){this.mimeType=r,this.data=e,this.__proxy_props={},t||={},t.mimeType=r,t.convert||=null,t.toMimeTypes||=null;for(let[s,n]of Object.entries(t))_m.RpcPeer.isTransportSafe(n)&&(this.__proxy_props[s]=n),this[s]=n}async getData(){return Promise.resolve(this.data)}};cs.MediaObject=uo});var _t=$(C=>{"use strict";Object.defineProperty(C,"__esModule",{value:!0});C.ScryptedMimeTypes=C.ScryptedInterface=C.MediaPlayerState=C.SecuritySystemObstruction=C.SecuritySystemMode=C.AirQuality=C.AirPurifierMode=C.AirPurifierStatus=C.ChargeState=C.LockState=C.PanTiltZoomMovement=C.ThermostatMode=C.TemperatureUnit=C.FanMode=C.HumidityMode=C.ScryptedDeviceType=C.ScryptedInterfaceDescriptors=C.ScryptedInterfaceMethod=C.ScryptedInterfaceProperty=C.DeviceBase=C.TYPES_VERSION=void 0;C.TYPES_VERSION="0.5.55";var ho=class{};C.DeviceBase=ho;var kd;(function(i){i.id="id",i.info="info",i.interfaces="interfaces",i.mixins="mixins",i.name="name",i.nativeId="nativeId",i.pluginId="pluginId",i.providedInterfaces="providedInterfaces",i.providedName="providedName",i.providedRoom="providedRoom",i.providedType="providedType",i.providerId="providerId",i.room="room",i.type="type",i.scryptedRuntimeArguments="scryptedRuntimeArguments",i.on="on",i.brightness="brightness",i.colorTemperature="colorTemperature",i.rgb="rgb",i.hsv="hsv",i.buttons="buttons",i.sensors="sensors",i.running="running",i.paused="paused",i.docked="docked",i.temperatureSetting="temperatureSetting",i.temperature="temperature",i.temperatureUnit="temperatureUnit",i.humidity="humidity",i.resolution="resolution",i.audioVolumes="audioVolumes",i.recordingActive="recordingActive",i.ptzCapabilities="ptzCapabilities",i.lockState="lockState",i.entryOpen="entryOpen",i.batteryLevel="batteryLevel",i.chargeState="chargeState",i.online="online",i.fromMimeType="fromMimeType",i.toMimeType="toMimeType",i.converters="converters",i.binaryState="binaryState",i.tampered="tampered",i.sleeping="sleeping",i.powerDetected="powerDetected",i.audioDetected="audioDetected",i.motionDetected="motionDetected",i.ambientLight="ambientLight",i.occupied="occupied",i.flooded="flooded",i.ultraviolet="ultraviolet",i.luminance="luminance",i.position="position",i.securitySystemState="securitySystemState",i.pm10Density="pm10Density",i.pm25Density="pm25Density",i.vocDensity="vocDensity",i.noxDensity="noxDensity",i.co2ppm="co2ppm",i.airQuality="airQuality",i.airPurifierState="airPurifierState",i.filterChangeIndication="filterChangeIndication",i.filterLifeLevel="filterLifeLevel",i.humiditySetting="humiditySetting",i.fan="fan",i.applicationInfo="applicationInfo",i.chatCompletionCapabilities="chatCompletionCapabilities",i.systemDevice="systemDevice"})(kd||(C.ScryptedInterfaceProperty=kd={}));var Cd;(function(i){i.listen="listen",i.probe="probe",i.setMixins="setMixins",i.setName="setName",i.setRoom="setRoom",i.setType="setType",i.getPluginJson="getPluginJson",i.turnOff="turnOff",i.turnOn="turnOn",i.setBrightness="setBrightness",i.getTemperatureMaxK="getTemperatureMaxK",i.getTemperatureMinK="getTemperatureMinK",i.setColorTemperature="setColorTemperature",i.setRgb="setRgb",i.setHsv="setHsv",i.pressButton="pressButton",i.sendNotification="sendNotification",i.start="start",i.stop="stop",i.pause="pause",i.resume="resume",i.dock="dock",i.setTemperature="setTemperature",i.setTemperatureUnit="setTemperatureUnit",i.getPictureOptions="getPictureOptions",i.takePicture="takePicture",i.getAudioStream="getAudioStream",i.setAudioVolumes="setAudioVolumes",i.startDisplay="startDisplay",i.stopDisplay="stopDisplay",i.getVideoStream="getVideoStream",i.getVideoStreamOptions="getVideoStreamOptions",i.getPrivacyMasks="getPrivacyMasks",i.setPrivacyMasks="setPrivacyMasks",i.getVideoTextOverlays="getVideoTextOverlays",i.setVideoTextOverlay="setVideoTextOverlay",i.getRecordingStream="getRecordingStream",i.getRecordingStreamCurrentTime="getRecordingStreamCurrentTime",i.getRecordingStreamOptions="getRecordingStreamOptions",i.getRecordingStreamThumbnail="getRecordingStreamThumbnail",i.deleteRecordingStream="deleteRecordingStream",i.setRecordingActive="setRecordingActive",i.ptzCommand="ptzCommand",i.getRecordedEvents="getRecordedEvents",i.getVideoClip="getVideoClip",i.getVideoClips="getVideoClips",i.getVideoClipThumbnail="getVideoClipThumbnail",i.removeVideoClips="removeVideoClips",i.setVideoStreamOptions="setVideoStreamOptions",i.startIntercom="startIntercom",i.stopIntercom="stopIntercom",i.lock="lock",i.unlock="unlock",i.addPassword="addPassword",i.getPasswords="getPasswords",i.removePassword="removePassword",i.activate="activate",i.deactivate="deactivate",i.isReversible="isReversible",i.closeEntry="closeEntry",i.openEntry="openEntry",i.getDevice="getDevice",i.releaseDevice="releaseDevice",i.adoptDevice="adoptDevice",i.discoverDevices="discoverDevices",i.createDevice="createDevice",i.getCreateDeviceSettings="getCreateDeviceSettings",i.reboot="reboot",i.getRefreshFrequency="getRefreshFrequency",i.refresh="refresh",i.getMediaStatus="getMediaStatus",i.load="load",i.seek="seek",i.skipNext="skipNext",i.skipPrevious="skipPrevious",i.convert="convert",i.convertMedia="convertMedia",i.getSettings="getSettings",i.putSetting="putSetting",i.armSecuritySystem="armSecuritySystem",i.disarmSecuritySystem="disarmSecuritySystem",i.setAirPurifierState="setAirPurifierState",i.getReadmeMarkdown="getReadmeMarkdown",i.getOauthUrl="getOauthUrl",i.onOauthCallback="onOauthCallback",i.canMixin="canMixin",i.getMixin="getMixin",i.releaseMixin="releaseMixin",i.onRequest="onRequest",i.onConnection="onConnection",i.onPush="onPush",i.run="run",i.eval="eval",i.loadScripts="loadScripts",i.saveScript="saveScript",i.forkInterface="forkInterface",i.getDetectionInput="getDetectionInput",i.getObjectTypes="getObjectTypes",i.detectObjects="detectObjects",i.generateObjectDetections="generateObjectDetections",i.getDetectionModel="getDetectionModel",i.setHumidity="setHumidity",i.setFan="setFan",i.startRTCSignalingSession="startRTCSignalingSession",i.createRTCSignalingSession="createRTCSignalingSession",i.getScryptedUserAccessControl="getScryptedUserAccessControl",i.generateVideoFrames="generateVideoFrames",i.connectStream="connectStream",i.getTTYSettings="getTTYSettings",i.getChatCompletion="getChatCompletion",i.streamChatCompletion="streamChatCompletion",i.getTextEmbedding="getTextEmbedding",i.getImageEmbedding="getImageEmbedding",i.callLLMTool="callLLMTool",i.getLLMTools="getLLMTools"})(Cd||(C.ScryptedInterfaceMethod=Cd={}));C.ScryptedInterfaceDescriptors={ScryptedDevice:{name:"ScryptedDevice",methods:["listen","probe","setMixins","setName","setRoom","setType"],properties:["id","info","interfaces","mixins","name","nativeId","pluginId","providedInterfaces","providedName","providedRoom","providedType","providerId","room","type"]},ScryptedPlugin:{name:"ScryptedPlugin",methods:["getPluginJson"],properties:[]},ScryptedPluginRuntime:{name:"ScryptedPluginRuntime",methods:[],properties:["scryptedRuntimeArguments"]},OnOff:{name:"OnOff",methods:["turnOff","turnOn"],properties:["on"]},Brightness:{name:"Brightness",methods:["setBrightness"],properties:["brightness"]},ColorSettingTemperature:{name:"ColorSettingTemperature",methods:["getTemperatureMaxK","getTemperatureMinK","setColorTemperature"],properties:["colorTemperature"]},ColorSettingRgb:{name:"ColorSettingRgb",methods:["setRgb"],properties:["rgb"]},ColorSettingHsv:{name:"ColorSettingHsv",methods:["setHsv"],properties:["hsv"]},Buttons:{name:"Buttons",methods:[],properties:["buttons"]},PressButtons:{name:"PressButtons",methods:["pressButton"],properties:[]},Sensors:{name:"Sensors",methods:[],properties:["sensors"]},Notifier:{name:"Notifier",methods:["sendNotification"],properties:[]},StartStop:{name:"StartStop",methods:["start","stop"],properties:["running"]},Pause:{name:"Pause",methods:["pause","resume"],properties:["paused"]},Dock:{name:"Dock",methods:["dock"],properties:["docked"]},TemperatureSetting:{name:"TemperatureSetting",methods:["setTemperature"],properties:["temperatureSetting"]},Thermometer:{name:"Thermometer",methods:["setTemperatureUnit"],properties:["temperature","temperatureUnit"]},HumiditySensor:{name:"HumiditySensor",methods:[],properties:["humidity"]},Camera:{name:"Camera",methods:["getPictureOptions","takePicture"],properties:[]},Resolution:{name:"Resolution",methods:[],properties:["resolution"]},Microphone:{name:"Microphone",methods:["getAudioStream"],properties:[]},AudioVolumeControl:{name:"AudioVolumeControl",methods:["setAudioVolumes"],properties:["audioVolumes"]},Display:{name:"Display",methods:["startDisplay","stopDisplay"],properties:[]},VideoCamera:{name:"VideoCamera",methods:["getVideoStream","getVideoStreamOptions"],properties:[]},VideoCameraMask:{name:"VideoCameraMask",methods:["getPrivacyMasks","setPrivacyMasks"],properties:[]},VideoTextOverlays:{name:"VideoTextOverlays",methods:["getVideoTextOverlays","setVideoTextOverlay"],properties:[]},VideoRecorder:{name:"VideoRecorder",methods:["getRecordingStream","getRecordingStreamCurrentTime","getRecordingStreamOptions","getRecordingStreamThumbnail"],properties:["recordingActive"]},VideoRecorderManagement:{name:"VideoRecorderManagement",methods:["deleteRecordingStream","setRecordingActive"],properties:[]},PanTiltZoom:{name:"PanTiltZoom",methods:["ptzCommand"],properties:["ptzCapabilities"]},EventRecorder:{name:"EventRecorder",methods:["getRecordedEvents"],properties:[]},VideoClips:{name:"VideoClips",methods:["getVideoClip","getVideoClips","getVideoClipThumbnail","removeVideoClips"],properties:[]},VideoCameraConfiguration:{name:"VideoCameraConfiguration",methods:["setVideoStreamOptions"],properties:[]},Intercom:{name:"Intercom",methods:["startIntercom","stopIntercom"],properties:[]},Lock:{name:"Lock",methods:["lock","unlock"],properties:["lockState"]},PasswordStore:{name:"PasswordStore",methods:["addPassword","getPasswords","removePassword"],properties:[]},Scene:{name:"Scene",methods:["activate","deactivate","isReversible"],properties:[]},Entry:{name:"Entry",methods:["closeEntry","openEntry"],properties:[]},EntrySensor:{name:"EntrySensor",methods:[],properties:["entryOpen"]},DeviceProvider:{name:"DeviceProvider",methods:["getDevice","releaseDevice"],properties:[]},DeviceDiscovery:{name:"DeviceDiscovery",methods:["adoptDevice","discoverDevices"],properties:[]},DeviceCreator:{name:"DeviceCreator",methods:["createDevice","getCreateDeviceSettings"],properties:[]},Battery:{name:"Battery",methods:[],properties:["batteryLevel"]},Charger:{name:"Charger",methods:[],properties:["chargeState"]},Reboot:{name:"Reboot",methods:["reboot"],properties:[]},Refresh:{name:"Refresh",methods:["getRefreshFrequency","refresh"],properties:[]},MediaPlayer:{name:"MediaPlayer",methods:["getMediaStatus","load","seek","skipNext","skipPrevious"],properties:[]},Online:{name:"Online",methods:[],properties:["online"]},BufferConverter:{name:"BufferConverter",methods:["convert"],properties:["fromMimeType","toMimeType"]},MediaConverter:{name:"MediaConverter",methods:["convertMedia"],properties:["converters"]},Settings:{name:"Settings",methods:["getSettings","putSetting"],properties:[]},BinarySensor:{name:"BinarySensor",methods:[],properties:["binaryState"]},TamperSensor:{name:"TamperSensor",methods:[],properties:["tampered"]},Sleep:{name:"Sleep",methods:[],properties:["sleeping"]},PowerSensor:{name:"PowerSensor",methods:[],properties:["powerDetected"]},AudioSensor:{name:"AudioSensor",methods:[],properties:["audioDetected"]},MotionSensor:{name:"MotionSensor",methods:[],properties:["motionDetected"]},AmbientLightSensor:{name:"AmbientLightSensor",methods:[],properties:["ambientLight"]},OccupancySensor:{name:"OccupancySensor",methods:[],properties:["occupied"]},FloodSensor:{name:"FloodSensor",methods:[],properties:["flooded"]},UltravioletSensor:{name:"UltravioletSensor",methods:[],properties:["ultraviolet"]},LuminanceSensor:{name:"LuminanceSensor",methods:[],properties:["luminance"]},PositionSensor:{name:"PositionSensor",methods:[],properties:["position"]},SecuritySystem:{name:"SecuritySystem",methods:["armSecuritySystem","disarmSecuritySystem"],properties:["securitySystemState"]},PM10Sensor:{name:"PM10Sensor",methods:[],properties:["pm10Density"]},PM25Sensor:{name:"PM25Sensor",methods:[],properties:["pm25Density"]},VOCSensor:{name:"VOCSensor",methods:[],properties:["vocDensity"]},NOXSensor:{name:"NOXSensor",methods:[],properties:["noxDensity"]},CO2Sensor:{name:"CO2Sensor",methods:[],properties:["co2ppm"]},AirQualitySensor:{name:"AirQualitySensor",methods:[],properties:["airQuality"]},AirPurifier:{name:"AirPurifier",methods:["setAirPurifierState"],properties:["airPurifierState"]},FilterMaintenance:{name:"FilterMaintenance",methods:[],properties:["filterChangeIndication","filterLifeLevel"]},Readme:{name:"Readme",methods:["getReadmeMarkdown"],properties:[]},OauthClient:{name:"OauthClient",methods:["getOauthUrl","onOauthCallback"],properties:[]},MixinProvider:{name:"MixinProvider",methods:["canMixin","getMixin","releaseMixin"],properties:[]},HttpRequestHandler:{name:"HttpRequestHandler",methods:["onRequest"],properties:[]},EngineIOHandler:{name:"EngineIOHandler",methods:["onConnection"],properties:[]},PushHandler:{name:"PushHandler",methods:["onPush"],properties:[]},Program:{name:"Program",methods:["run"],properties:[]},Scriptable:{name:"Scriptable",methods:["eval","loadScripts","saveScript"],properties:[]},ClusterForkInterface:{name:"ClusterForkInterface",methods:["forkInterface"],properties:[]},ObjectDetector:{name:"ObjectDetector",methods:["getDetectionInput","getObjectTypes"],properties:[]},ObjectDetection:{name:"ObjectDetection",methods:["detectObjects","generateObjectDetections","getDetectionModel"],properties:[]},ObjectDetectionPreview:{name:"ObjectDetectionPreview",methods:[],properties:[]},ObjectDetectionGenerator:{name:"ObjectDetectionGenerator",methods:[],properties:[]},HumiditySetting:{name:"HumiditySetting",methods:["setHumidity"],properties:["humiditySetting"]},Fan:{name:"Fan",methods:["setFan"],properties:["fan"]},RTCSignalingChannel:{name:"RTCSignalingChannel",methods:["startRTCSignalingSession"],properties:[]},RTCSignalingClient:{name:"RTCSignalingClient",methods:["createRTCSignalingSession"],properties:[]},LauncherApplication:{name:"LauncherApplication",methods:[],properties:["applicationInfo"]},ScryptedUser:{name:"ScryptedUser",methods:["getScryptedUserAccessControl"],properties:[]},VideoFrameGenerator:{name:"VideoFrameGenerator",methods:["generateVideoFrames"],properties:[]},StreamService:{name:"StreamService",methods:["connectStream"],properties:[]},TTY:{name:"TTY",methods:[],properties:[]},TTYSettings:{name:"TTYSettings",methods:["getTTYSettings"],properties:[]},ChatCompletion:{name:"ChatCompletion",methods:["getChatCompletion","streamChatCompletion"],properties:["chatCompletionCapabilities"]},TextEmbedding:{name:"TextEmbedding",methods:["getTextEmbedding"],properties:[]},ImageEmbedding:{name:"ImageEmbedding",methods:["getImageEmbedding"],properties:[]},LLMTools:{name:"LLMTools",methods:["callLLMTool","getLLMTools"],properties:[]},ScryptedSystemDevice:{name:"ScryptedSystemDevice",methods:[],properties:["systemDevice"]},ScryptedDeviceCreator:{name:"ScryptedDeviceCreator",methods:[],properties:[]},ScryptedSettings:{name:"ScryptedSettings",methods:[],properties:[]}};var $d;(function(i){i.Builtin="Builtin",i.Internal="Internal",i.Camera="Camera",i.Fan="Fan",i.Light="Light",i.Switch="Switch",i.Outlet="Outlet",i.Sensor="Sensor",i.Scene="Scene",i.Program="Program",i.Automation="Automation",i.Vacuum="Vacuum",i.Notifier="Notifier",i.Thermostat="Thermostat",i.Lock="Lock",i.PasswordControl="PasswordControl",i.Display="Display",i.SmartDisplay="SmartDisplay",i.Speaker="Speaker",i.SmartSpeaker="SmartSpeaker",i.RemoteDesktop="RemoteDesktop",i.Event="Event",i.Entry="Entry",i.Garage="Garage",i.DeviceProvider="DeviceProvider",i.DataSource="DataSource",i.API="API",i.Buttons="Buttons",i.Doorbell="Doorbell",i.Irrigation="Irrigation",i.Valve="Valve",i.Person="Person",i.SecuritySystem="SecuritySystem",i.WindowCovering="WindowCovering",i.Siren="Siren",i.AirPurifier="AirPurifier",i.Internet="Internet",i.Network="Network",i.Bridge="Bridge",i.LLM="LLM",i.Unknown="Unknown"})($d||(C.ScryptedDeviceType=$d={}));var Sd;(function(i){i.Humidify="Humidify",i.Dehumidify="Dehumidify",i.Auto="Auto",i.Off="Off"})(Sd||(C.HumidityMode=Sd={}));var Ed;(function(i){i.Auto="Auto",i.Manual="Manual"})(Ed||(C.FanMode=Ed={}));var Td;(function(i){i.C="C",i.F="F"})(Td||(C.TemperatureUnit=Td={}));var Pd;(function(i){i.Off="Off",i.Cool="Cool",i.Heat="Heat",i.HeatCool="HeatCool",i.Auto="Auto",i.FanOnly="FanOnly",i.Purifier="Purifier",i.Eco="Eco",i.Dry="Dry",i.On="On"})(Pd||(C.ThermostatMode=Pd={}));var Ad;(function(i){i.Absolute="Absolute",i.Relative="Relative",i.Continuous="Continuous",i.Preset="Preset",i.Home="Home"})(Ad||(C.PanTiltZoomMovement=Ad={}));var Rd;(function(i){i.Locked="Locked",i.Unlocked="Unlocked",i.Jammed="Jammed"})(Rd||(C.LockState=Rd={}));var Md;(function(i){i.Trickle="trickle",i.Charging="charging",i.NotCharging="not-charging"})(Md||(C.ChargeState=Md={}));var Ld;(function(i){i.Inactive="Inactive",i.Idle="Idle",i.Active="Active",i.ActiveNightMode="ActiveNightMode"})(Ld||(C.AirPurifierStatus=Ld={}));var Id;(function(i){i.Manual="Manual",i.Automatic="Automatic"})(Id||(C.AirPurifierMode=Id={}));var Hd;(function(i){i.Unknown="Unknown",i.Excellent="Excellent",i.Good="Good",i.Fair="Fair",i.Inferior="Inferior",i.Poor="Poor"})(Hd||(C.AirQuality=Hd={}));var Od;(function(i){i.Disarmed="Disarmed",i.HomeArmed="HomeArmed",i.AwayArmed="AwayArmed",i.NightArmed="NightArmed"})(Od||(C.SecuritySystemMode=Od={}));var Dd;(function(i){i.Sensor="Sensor",i.Occupied="Occupied",i.Time="Time",i.Error="Error"})(Dd||(C.SecuritySystemObstruction=Dd={}));var Fd;(function(i){i.Idle="Idle",i.Playing="Playing",i.Paused="Paused",i.Buffering="Buffering"})(Fd||(C.MediaPlayerState=Fd={}));var zd;(function(i){i.ScryptedDevice="ScryptedDevice",i.ScryptedPlugin="ScryptedPlugin",i.ScryptedPluginRuntime="ScryptedPluginRuntime",i.OnOff="OnOff",i.Brightness="Brightness",i.ColorSettingTemperature="ColorSettingTemperature",i.ColorSettingRgb="ColorSettingRgb",i.ColorSettingHsv="ColorSettingHsv",i.Buttons="Buttons",i.PressButtons="PressButtons",i.Sensors="Sensors",i.Notifier="Notifier",i.StartStop="StartStop",i.Pause="Pause",i.Dock="Dock",i.TemperatureSetting="TemperatureSetting",i.Thermometer="Thermometer",i.HumiditySensor="HumiditySensor",i.Camera="Camera",i.Resolution="Resolution",i.Microphone="Microphone",i.AudioVolumeControl="AudioVolumeControl",i.Display="Display",i.VideoCamera="VideoCamera",i.VideoCameraMask="VideoCameraMask",i.VideoTextOverlays="VideoTextOverlays",i.VideoRecorder="VideoRecorder",i.VideoRecorderManagement="VideoRecorderManagement",i.PanTiltZoom="PanTiltZoom",i.EventRecorder="EventRecorder",i.VideoClips="VideoClips",i.VideoCameraConfiguration="VideoCameraConfiguration",i.Intercom="Intercom",i.Lock="Lock",i.PasswordStore="PasswordStore",i.Scene="Scene",i.Entry="Entry",i.EntrySensor="EntrySensor",i.DeviceProvider="DeviceProvider",i.DeviceDiscovery="DeviceDiscovery",i.DeviceCreator="DeviceCreator",i.Battery="Battery",i.Charger="Charger",i.Reboot="Reboot",i.Refresh="Refresh",i.MediaPlayer="MediaPlayer",i.Online="Online",i.BufferConverter="BufferConverter",i.MediaConverter="MediaConverter",i.Settings="Settings",i.BinarySensor="BinarySensor",i.TamperSensor="TamperSensor",i.Sleep="Sleep",i.PowerSensor="PowerSensor",i.AudioSensor="AudioSensor",i.MotionSensor="MotionSensor",i.AmbientLightSensor="AmbientLightSensor",i.OccupancySensor="OccupancySensor",i.FloodSensor="FloodSensor",i.UltravioletSensor="UltravioletSensor",i.LuminanceSensor="LuminanceSensor",i.PositionSensor="PositionSensor",i.SecuritySystem="SecuritySystem",i.PM10Sensor="PM10Sensor",i.PM25Sensor="PM25Sensor",i.VOCSensor="VOCSensor",i.NOXSensor="NOXSensor",i.CO2Sensor="CO2Sensor",i.AirQualitySensor="AirQualitySensor",i.AirPurifier="AirPurifier",i.FilterMaintenance="FilterMaintenance",i.Readme="Readme",i.OauthClient="OauthClient",i.MixinProvider="MixinProvider",i.HttpRequestHandler="HttpRequestHandler",i.EngineIOHandler="EngineIOHandler",i.PushHandler="PushHandler",i.Program="Program",i.Scriptable="Scriptable",i.ClusterForkInterface="ClusterForkInterface",i.ObjectDetector="ObjectDetector",i.ObjectDetection="ObjectDetection",i.ObjectDetectionPreview="ObjectDetectionPreview",i.ObjectDetectionGenerator="ObjectDetectionGenerator",i.HumiditySetting="HumiditySetting",i.Fan="Fan",i.RTCSignalingChannel="RTCSignalingChannel",i.RTCSignalingClient="RTCSignalingClient",i.LauncherApplication="LauncherApplication",i.ScryptedUser="ScryptedUser",i.VideoFrameGenerator="VideoFrameGenerator",i.StreamService="StreamService",i.TTY="TTY",i.TTYSettings="TTYSettings",i.ChatCompletion="ChatCompletion",i.TextEmbedding="TextEmbedding",i.ImageEmbedding="ImageEmbedding",i.LLMTools="LLMTools",i.ScryptedSystemDevice="ScryptedSystemDevice",i.ScryptedDeviceCreator="ScryptedDeviceCreator",i.ScryptedSettings="ScryptedSettings"})(zd||(C.ScryptedInterface=zd={}));var Bd;(function(i){i.Url="text/x-uri",i.InsecureLocalUrl="text/x-insecure-local-uri",i.LocalUrl="text/x-local-uri",i.ServerId="text/x-server-id",i.PushEndpoint="text/x-push-endpoint",i.SchemePrefix="x-scrypted/x-scrypted-scheme-",i.MediaStreamUrl="text/x-media-url",i.MediaObject="x-scrypted/x-scrypted-media-object",i.RequestMediaObject="x-scrypted/x-scrypted-request-media-object",i.RequestMediaStream="x-scrypted/x-scrypted-request-stream",i.MediaStreamFeedback="x-scrypted/x-media-stream-feedback",i.FFmpegInput="x-scrypted/x-ffmpeg-input",i.FFmpegTranscodeStream="x-scrypted/x-ffmpeg-transcode-stream",i.RTCSignalingChannel="x-scrypted/x-scrypted-rtc-signaling-channel",i.RTCSignalingSession="x-scrypted/x-scrypted-rtc-signaling-session",i.RTCConnectionManagement="x-scrypted/x-scrypted-rtc-connection-management",i.Image="x-scrypted/x-scrypted-image"})(Bd||(C.ScryptedMimeTypes=Bd={}))});var mo=$(Xt=>{"use strict";Object.defineProperty(Xt,"__esModule",{value:!0});Xt.SidebandBufferSerializer=Xt.BufferSerializer=void 0;var ds=class{serialize(r){return console.warn("Using slow buffer serialization. Ensure the peer supports SidebandBufferSerializer."),r.toString("base64")}deserialize(r){return console.warn("Using slow buffer deserialization. Ensure the peer supports SidebandBufferSerializer."),Buffer.from(r,"base64")}};Xt.BufferSerializer=ds;var fo=class{bufferSerializer=new ds;serialize(r,e){if(!e)return this.bufferSerializer.serialize(r);let t=e.buffers=e.buffers||[];return t.push(r),t.length-1}deserialize(r,e){return e?.buffers?e.buffers[r]:this.bufferSerializer.deserialize(r)}};Xt.SidebandBufferSerializer=fo});var go=$(me=>{"use strict";Object.defineProperty(me,"__esModule",{value:!0});me.propertyInterfaces=me.allInterfaceProperties=void 0;me.getPropertyInterfaces=jd;me.getInterfaceMethods=Nd;me.getInterfaceProperties=qd;me.isValidInterfaceMethod=ym;me.isValidInterfaceProperty=xm;var bo=_t();me.allInterfaceProperties=[].concat(...Object.values(bo.ScryptedInterfaceDescriptors).map(i=>i.properties));function jd(i){let r={};for(let e of Object.values(i))for(let t of e.properties)r[t]=e.name;return r}me.propertyInterfaces=jd(bo.ScryptedInterfaceDescriptors);function Nd(i,r){return Object.values(i).filter(e=>r.has(e.name)).map(e=>e.methods).flat()}function qd(i,r){return Object.values(i).filter(e=>r.has(e.name)).map(e=>e.properties).flat()}function ym(i,r,e){return Nd(i,r).includes(e)||i[bo.ScryptedInterface.ScryptedDevice].methods.includes(e)}function xm(i,r,e){return qd(i,new Set(r)).includes(e)}});var Ud=$(vo=>{"use strict";Object.defineProperty(vo,"__esModule",{value:!0});vo.checkProperty=Cm;var Qt=_t(),wm=$e(),km=go();function Cm(i,r){if(i===Qt.ScryptedInterfaceProperty.id)throw new Error("id is read only");if(i===Qt.ScryptedInterfaceProperty.nativeId)throw new Error("nativeId is read only");if(i===Qt.ScryptedInterfaceProperty.mixins)throw new Error("mixins is read only");if(i===Qt.ScryptedInterfaceProperty.interfaces)throw new Error("interfaces is a read only post-mixin computed property, use providedInterfaces");if(wm.RpcPeer.isRpcProxy(r))throw new Error("value must be a primitive type");if(km.propertyInterfaces[i.toString()]===Qt.ScryptedInterface.ScryptedDevice&&i!==Qt.ScryptedInterfaceProperty.info)throw new Error(`${i.toString()} can not be set. Use DeviceManager.onDevicesChanges or DeviceManager.onDeviceDiscovered to update the device description.`)}});var Vd=$(tt=>{"use strict";Object.defineProperty(tt,"__esModule",{value:!0});tt.StorageImpl=tt.DeviceManagerImpl=tt.DeviceStateProxyHandler=void 0;var $m=$e(),Sm=Ud(),_o=class{console;nativeId;api;logger;constructor(r,e,t){this.console=t,this.api=r,this.nativeId=e}async ensureLogger(){return this.logger||(this.logger=this.api.getLogger(this.nativeId)),await this.logger}async log(r,e){(await this.ensureLogger()).log(r,e)}a(r){this.log("a",r)}async clear(){(await this.ensureLogger()).clear()}async clearAlert(r){(await this.ensureLogger()).clearAlert(r)}async clearAlerts(){(await this.ensureLogger()).clearAlerts()}d(r){this.log("d",r)}e(r){this.log("e",r)}i(r){this.log("i",r)}v(r){this.log("v",r)}w(r){this.log("w",r)}},Ti=class{deviceManager;id;setState;constructor(r,e,t){this.deviceManager=r,this.id=e,this.setState=t}get(r,e,t){return e==="id"?this.id:e===$m.RpcPeer.PROPERTY_PROXY_PROPERTIES?{id:this.id}:e==="setState"?this.setState:this.deviceManager.systemManager.state[this.id][e]?.value}set(r,e,t,s){return(0,Sm.checkProperty)(e.toString(),t),this.deviceManager.systemManager.state[this.id][e]={value:t},this.setState(e.toString(),t),!0}};tt.DeviceStateProxyHandler=Ti;var yo=class{systemManager;getDeviceConsole;getMixinConsole;api;nativeIds=new Map;deviceStorage=new Map;mixinStorage=new Map;constructor(r,e,t){this.systemManager=r,this.getDeviceConsole=e,this.getMixinConsole=t}async requestRestart(){return this.api.requestRestart()}getDeviceLogger(r){return new _o(this.api,r,this.getDeviceConsole?.(r)||console)}getDeviceState(r){let e=new Ti(this,this.nativeIds.get(r).id,(t,s)=>this.api.setState(r,t,s));return new Proxy(e,e)}createDeviceState(r,e){let t=new Ti(this,r,e);return new Proxy(t,t)}getDeviceStorage(r){let e=this.deviceStorage.get(r);return e||(e=new Pi(this,r),this.deviceStorage.set(r,e)),e}getMixinStorage(r,e){let t=this.mixinStorage.get(e);t||(t=new Map,this.mixinStorage.set(e,t));let s=t.get(r);return s||(s=new Pi(this,e,`mixin:${r}:`),t.set(r,s)),s}pruneMixinStorage(){for(let r of this.nativeIds.keys()){let e=this.nativeIds.get(r).storage;for(let t of Object.keys(e)){if(!t.startsWith("mixin:"))continue;let[,s]=t.split(":");s&&!this.systemManager.state[s]&&delete e[t]}}}async onMixinEvent(r,e,t,s){return this.api.onMixinEvent(r,e,t,s)}getNativeIds(){return Array.from(this.nativeIds.keys())}async onDeviceDiscovered(r){return this.api.onDeviceDiscovered(r)}async onDeviceRemoved(r){return this.api.onDeviceRemoved(r)}async onDeviceEvent(r,e,t){return this.api.onDeviceEvent(r,e,t)}async onDevicesChanged(r){return this.api.onDevicesChanged(r)}};tt.DeviceManagerImpl=yo;function ps(i){return i===null?"null":i===void 0?"undefined":i.toString()}var Pi=class i{deviceManager;nativeId;prefix;api;static allowedMethods=["length","clear","getItem","setItem","key","removeItem"];static indexedHandler={get(r,e){let t=e.toString();if(i.allowedMethods.includes(t)){let s=r[t];return t==="length"?s:s.bind(r)}return r.getItem(ps(e))},set(r,e,t){return r.setItem(ps(e),t),!0}};constructor(r,e,t){return this.deviceManager=r,this.nativeId=e,this.prefix=t,this.deviceManager=r,this.api=r.api,this.nativeId=e,this.prefix||(this.prefix=""),new Proxy(this,i.indexedHandler)}get storage(){return this.deviceManager.nativeIds.get(this.nativeId).storage}get length(){return Object.keys(this.storage).filter(r=>r.startsWith(this.prefix)).length}clear(){if(!this.prefix)this.deviceManager.nativeIds.get(this.nativeId).storage={};else{let r=this.storage;Object.keys(this.storage).filter(e=>e.startsWith(this.prefix)).forEach(e=>delete r[e])}this.api.setStorage(this.nativeId,this.storage)}getItem(r){return this.storage[this.prefix+r]}key(r){return this.prefix?Object.keys(this.storage).filter(e=>e.startsWith(this.prefix))[r].substring(this.prefix.length):Object.keys(this.storage)[r]}removeItem(r){delete this.storage[this.prefix+r],this.api.setStorage(this.nativeId,this.storage)}setItem(r,e){r=ps(r),e=ps(e),this.storage[this.prefix+r]!==e&&(this.storage[this.prefix+r]=e,this.api.setStorage(this.nativeId,this.storage))}};tt.StorageImpl=Pi});var Wd=$(us=>{"use strict";Object.defineProperty(us,"__esModule",{value:!0});us.EndpointManagerImpl=void 0;var Zt=_t(),xo=class{deviceManager;api;pluginId;mediaManager;getEndpoint(r){if(!r)return this.pluginId;let e=this.deviceManager.nativeIds.get(r)?.id;if(!e)throw new Error("invalid nativeId "+r);return r?e:this.pluginId}async getUrlSafeIp(){let r=await this.api.getComponent("SCRYPTED_IP_ADDRESS");return r?.includes(":")?`[${r}]`:r}async getAuthenticatedPath(r){return this.getPath(r)}async getInsecurePublicLocalEndpoint(r){return this.getLocalEndpoint(r,{insecure:!0,public:!0})}async getPublicCloudEndpoint(r){return this.getCloudEndpoint(r,{public:!0})}async getPublicLocalEndpoint(r){return this.getLocalEndpoint(r,{public:!0})}async getPublicPushEndpoint(r){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(r)),Zt.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,Zt.ScryptedMimeTypes.PushEndpoint)}async getPath(r,e){return`/endpoint/${this.getEndpoint(r)}/${e?.public?"public/":""}`}async getLocalEndpoint(r,e){let t=e?.insecure?"http":"https",s=await this.api.getComponent(e?.insecure?"SCRYPTED_INSECURE_PORT":"SCRYPTED_SECURE_PORT"),n=await this.getPath(r,e);return`${t}://${await this.getUrlSafeIp()}:${s}${n}`}async getCloudEndpoint(r,e){let t=await this.getLocalEndpoint(r,e),s=await this.mediaManager.createMediaObject(Buffer.from(t),Zt.ScryptedMimeTypes.LocalUrl);return this.mediaManager.convertMediaObjectToUrl(s,Zt.ScryptedMimeTypes.LocalUrl)}async getCloudPushEndpoint(r){let e=await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(r)),Zt.ScryptedMimeTypes.PushEndpoint);return this.mediaManager.convertMediaObjectToUrl(e,Zt.ScryptedMimeTypes.PushEndpoint)}async setLocalAddresses(r){return(await this.api.getComponent("addresses")).setLocalAddresses(r)}async getLocalAddresses(){return await(await this.api.getComponent("addresses")).getLocalAddresses()}async setAccessControlAllowOrigin(r){let e=this;return(await this.deviceManager.systemManager.getComponent("setAccessControlAllowOrigin"))(r)}};us.EndpointManagerImpl=xo});var Kd=$(yt=>{"use strict";Object.defineProperty(yt,"__esModule",{value:!0});yt.WebSocketSerializer=yt.WebSocketConnection=void 0;yt.createWebSocketClass=Em;var wo=$e(),ko=class{events={};dispatchEvent(r){let e=this.events[r.type];if(e)for(let t of e)t(r)}addEventListener(r,e){let t=this.events[r];t||(t=this.events[r]=[]),t.push(e)}removeEventListener(r,e){let t=this.events[r];if(!t)return;let s=t.indexOf(e);s>-1&&t.splice(s,1)}};function hs(i,r){Object.defineProperty(i,"on"+r,{get:function(){throw new Error(`${r} is write only`)},set:function(e){this.events[r]=[e]}})}function Em(i){class r extends ko{connection;_url;_protocols;readyState;constructor(t,s){super(),this.connection=t,this._url=t.url,this._protocols=s,this.readyState=0,i(t,{connect:(n,o)=>{if(n!=null){this.dispatchEvent({type:"error",message:n.toString()});return}this.readyState=1,this.dispatchEvent({type:"open"})},end:()=>{this.readyState=3,this.dispatchEvent({type:"close",reason:"closed"})},error:n=>{this.readyState=3,this.dispatchEvent({type:"error",message:n.toString()})},data:n=>{this.dispatchEvent({type:"message",data:n,source:this})}})}send(t){this.connection.send(t)}get url(){return this._url}get extensions(){return""}close(t){this.connection.close(t)}}return hs(r.prototype,"close"),hs(r.prototype,"error"),hs(r.prototype,"message"),hs(r.prototype,"open"),r}var Co=class{url;websocketMethods;[wo.RpcPeer.PROPERTY_PROXY_PROPERTIES];[wo.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=["send","close"];constructor(r,e){this.url=r,this.websocketMethods=e,this[wo.RpcPeer.PROPERTY_PROXY_PROPERTIES]={url:r}}send(r){return this.websocketMethods.send(r)}close(r){return this.websocketMethods.close(r)}};yt.WebSocketConnection=Co;var $o=class{WebSocket;serialize(r,e){throw new Error("WebSocketSerializer should only be used for deserialization.")}deserialize(r,e){if(this.WebSocket)return new this.WebSocket(r)}};yt.WebSocketSerializer=$o});var Yd=$(xt=>{"use strict";Object.defineProperty(xt,"__esModule",{value:!0});xt.EventRegistry=xt.EventListenerRegisterImpl=void 0;xt.getMixinEventName=Gd;var Tm=_t(),Ai=class{removeListener;constructor(r){this.removeListener=r}};xt.EventListenerRegisterImpl=Ai;function Gd(i){let{event:r,mixinId:e}=i||{};return!r&&typeof i=="string"&&(r=i),r||(r=void 0),e?`${r}-mixin-${e}`:r}var Pm=new Set([Tm.ScryptedInterface.ScryptedDevice,"Logger"]),So=class{systemListeners=new Set;listeners={};listen(r){let e=this.systemListeners;return e.add(r),new Ai(()=>{e.delete(r),r=void 0})}listenDevice(r,e,t){let s=Gd(e),n=`${r}#${s}`,o=this.listeners[n];return o||(o=new Set,this.listeners[n]=o),o.add(t),new Ai(()=>{o.delete(t),t=void 0})}notify(r,e,t,s,n,o){let{changed:a,mixinId:l}=o||{};if(s&&!a)return!1;let u={eventId:void 0,eventInterface:t,eventTime:e,property:s,mixinId:l};return this.notifyEventDetails(r,u,n)}notifyEventDetails(r,e,t,s){if(e.eventId||=Math.random().toString(36).substring(2),s||=e.eventInterface,e.property&&!e.mixinId||Pm.has(s))for(let a of this.systemListeners)a(r,e,t);let n=this.listeners[`${r}#${s}`];if(n)for(let a of n)a(e,t);let o=this.listeners[`${r}#undefined`];if(o)for(let a of o)a(e,t);return!0}};xt.EventRegistry=So});var Qd=$(fs=>{"use strict";Object.defineProperty(fs,"__esModule",{value:!0});fs.SystemManagerImpl=void 0;var Z=_t(),Am=Yd(),Eo=$e(),wt=go();function Rm(i,r){let e=new To(i,r);return new Proxy(e,e)}var To=class{id;systemManager;customProperties;device;constructor(r,e){this.id=r,this.systemManager=e}toPrimitive(){return`ScryptedDevice-${this.id}`}ownKeys(r){let e=new Set(this.systemManager.state[this.id].interfaces.value),t=(0,wt.getInterfaceMethods)(this.systemManager.descriptors||Z.ScryptedInterfaceDescriptors,e),s=(0,wt.getInterfaceProperties)(this.systemManager.descriptors||Z.ScryptedInterfaceDescriptors,e);return[...t,...s]}getOwnPropertyDescriptor(r,e){let t=new Set(this.systemManager.state[this.id].interfaces.value),s=(0,wt.getInterfaceMethods)(this.systemManager.descriptors||Z.ScryptedInterfaceDescriptors,t),n=e.toString();if(s.includes(n))return{configurable:!0};if((0,wt.getInterfaceProperties)(this.systemManager.descriptors||Z.ScryptedInterfaceDescriptors,t).includes(n))return{configurable:!0,value:this.systemManager.state[this.id][n]?.value}}deleteProperty(r,e){let t=e.toString();return Object.keys(Z.ScryptedInterfaceProperty).includes(t)?!1:(this.customProperties||=new Map,this.customProperties.set(e,void 0),!0)}set(r,e,t,s){let n=e.toString();return Object.keys(Z.ScryptedInterfaceProperty).includes(n)?!1:(this.customProperties||=new Map,this.customProperties.set(e,t),!0)}get(r,e,t){if(e==="id")return this.id;if(this.customProperties?.has(e))return this.customProperties.get(e);let s=Eo.RpcPeer.handleFunctionInvocations(this,r,e,t);if(s)return s;let n=new Set(this.systemManager.state[this.id].interfaces?.value||[]),o=e.toString();if(this.systemManager.propertyInterfaces?.[o]||wt.propertyInterfaces[o])return this.systemManager.state[this.id]?.[e]?.value;if((0,wt.isValidInterfaceMethod)(this.systemManager.descriptors||Z.ScryptedInterfaceDescriptors,n,o))return Z.ScryptedInterfaceDescriptors[Z.ScryptedInterface.ScryptedDevice].methods.includes(o)?this[e].bind(this):new Proxy(()=>e,this)}ensureDevice(){return this.device||(this.device=this.systemManager.api.getDeviceById(this.id)),this.device}async apply(r,e,t){let s=r();return(await this.ensureDevice())[s](...t)}listen(r,e){return this.systemManager.listenDevice(this.id,r,e)}async setName(r){return this.systemManager.api.setDeviceProperty(this.id,Z.ScryptedInterfaceProperty.name,r)}async setRoom(r){return this.systemManager.api.setDeviceProperty(this.id,Z.ScryptedInterfaceProperty.room,r)}async setType(r){return this.systemManager.api.setDeviceProperty(this.id,Z.ScryptedInterfaceProperty.type,r)}async setMixins(r){await(await this.systemManager.getComponent("plugins")).setMixins(this.id,r)}async probe(){return this.apply(()=>"probe",void 0,[])}},Po=class{promise;constructor(r){this.promise=r}async removeListener(){try{let r=await this.promise;this.promise=void 0,r?.removeListener()}catch(r){console.error("removeListener",r)}}};function Xd(i){let r=i,e=r[Eo.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]||[];return e.includes(null)||e.push(null),r[Eo.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]=e,i}var Ao=class{api;state;deviceProxies={};log;events=new Am.EventRegistry;typesVersion;descriptors;propertyInterfaces;getDeviceState(r){return this.state[r]}getSystemState(){return this.state}getDeviceById(r,e){let t;if(this.state[r]){if(e!=null)return;t=r}else for(let n of Object.keys(this.state)){let o=this.state[n];if(o&&o[Z.ScryptedInterfaceProperty.pluginId]?.value===r&&o[Z.ScryptedInterfaceProperty.nativeId]?.value==e){t=n;break}}if(!t)return;let s=this.deviceProxies[t];return s||(s=this.deviceProxies[t]=Rm(t,this)),s}getDeviceByName(r){for(let e of Object.keys(this.state)){let t=this.state[e];if(t.interfaces?.value?.includes(Z.ScryptedInterface.ScryptedPlugin)&&t.pluginId?.value===r)return this.getDeviceById(e);if(t.name.value===r)return this.getDeviceById(e)}}listen(r){return this.events.listen(Xd((e,t,s)=>r(this.getDeviceById(e),t,s)))}listenDevice(r,e,t){let{watch:s}=e||{};return s?this.events.listenDevice(r,e,(n,o)=>t(this.getDeviceById(r),n,o)):new Po(this.api.listenDevice(r,e,Xd((n,o)=>t(this.getDeviceById(r),n,o))))}async removeDevice(r){return this.api.removeDevice(r)}getComponent(r){return this.api.getComponent(r)}setScryptedInterfaceDescriptors(r,e){return this.typesVersion=r,this.descriptors=e,this.propertyInterfaces=(0,wt.getPropertyInterfaces)(e),this.api.setScryptedInterfaceDescriptors(r,e)}};fs.SystemManagerImpl=Ao});var Zd=$(ms=>{"use strict";Object.defineProperty(ms,"__esModule",{value:!0});ms.ClusterManagerImpl=void 0;var Ro=class{clusterMode;api;clusterWorkerId;clusterServicePromise;constructor(r,e,t){this.clusterMode=r,this.api=e,this.clusterWorkerId=t}getClusterWorkerId(){return this.clusterWorkerId}getClusterAddress(){return process.env.SCRYPTED_CLUSTER_ADDRESS}getClusterMode(){return this.clusterMode}async getClusterWorkers(){return(await this.getClusterService()).getClusterWorkers()}getClusterService(){return this.clusterServicePromise||=this.api.getComponent("cluster-fork"),this.clusterServicePromise}};ms.ClusterManagerImpl=Ro});var tp=$(bs=>{"use strict";Object.defineProperty(bs,"__esModule",{value:!0});bs.setupPluginRemote=Hm;bs.attachPluginRemote=Om;var Jt=_t(),Lo=$e(),ep=mo(),Jd=Vd(),Mm=Wd(),Mo=Kd(),Lm=Qd(),Im=Zd();async function Hm(i,r,e,t,s){try{i.constructorSerializerMap.get(Buffer)||i.addSerializer(Buffer,"Buffer",new ep.BufferSerializer);let o=await(await i.getParam("getRemote"))(r,e,t),a=i.tags.acl,l=(h,d)=>{if(d=d||s()[h],a&&d){d=Object.assign({},d);for(let m of Object.keys(d))a.shouldRejectProperty(h,m)&&delete d[m];let f=d.interfaces?.value;f&&(f=f.filter(m=>!a.shouldRejectInterface(h,m)),d.interfaces={value:f})}return d},u=()=>{let h=s();if(a){h=Object.assign({},h);for(let d of Object.keys(h)){if(a.shouldRejectDevice(d)){delete h[d];continue}h[d]=l(d,h[d])}}return h};return await o.setSystemState(u()),r.listen((h,d,f)=>{if(!a?.shouldRejectEvent(d.property===Jt.ScryptedInterfaceProperty.id?f:h,d)){if(d.eventInterface===Jt.ScryptedInterface.ScryptedDevice){d.property===Jt.ScryptedInterfaceProperty.id?o.updateDeviceState(f,void 0):o.updateDeviceState(h,l(h));return}d.property&&!d.mixinId?o.notify(h,d,s()[h]?.[d.property]).catch(()=>{}):o.notify(h,d,f).catch(()=>{})}}),o}catch(n){throw new Lo.RPCResultError(i,"error while retrieving PluginRemote",n)}}function Om(i,r){let{createMediaManager:e,getServicePort:t,getDeviceConsole:s,getMixinConsole:n}=r||{};i.constructorSerializerMap.get(Buffer)||i.addSerializer(Buffer,"Buffer",new ep.BufferSerializer);let o={},a=new Mo.WebSocketSerializer;i.addSerializer(Mo.WebSocketConnection,"WebSocketConnection",a);let l,u=new Promise(h=>l=h);return i.params.getRemote=async(h,d,f)=>{a.WebSocket=(0,Mo.createWebSocketClass)((w,E)=>{let{url:I}=w;if(I.startsWith("io://")||I.startsWith("ws://")){let N=I.substring(5);o[N]=E,E.connect(void 0,{close:B=>w.close(B),send:B=>w.send(B)})}else throw new Error("unsupported websocket")}),h=await r?.onGetRemote?.(h,d)||h;let m=new Lm.SystemManagerImpl,b=new Jd.DeviceManagerImpl(m,s,n),v=new Mm.EndpointManagerImpl,_=new Im.ClusterManagerImpl(void 0,h,void 0),k=await h.getMediaManager();k||(i.params.createMediaManager=async()=>e(m,b));let R=k||await e(m,b);i.params.mediaManager=R,m.api=h,b.api=h;let z=b.getDeviceLogger(void 0);m.log=z;let M={systemManager:m,deviceManager:b,endpointManager:v,mediaManager:R,clusterManager:_,log:z,pluginHostAPI:h,pluginRemoteAPI:void 0,serverVersion:f?.serverVersion,connect:void 0,fork:void 0,connectRPCObject:void 0};delete i.params.getRemote,v.api=h,v.deviceManager=b,v.mediaManager=R,v.pluginId=d;let V=new Jd.StorageImpl(b,void 0),Y={[Lo.RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION]:!0,[Lo.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]:["notify","updateDeviceState","setSystemState","ioEvent","setNativeId"],getServicePort:t,async createDeviceState(w,E){return b.createDeviceState(w,E)},async ioEvent(w,E,I){let N=o[w];if(N)switch(E){case"message":N.data(I);break;case"close":N.end(),delete o[w];break}},async setNativeId(w,E,I){w===null&&(w=void 0),E?b.nativeIds.set(w?.toString(),{id:E,storage:I}):b.nativeIds.delete(w)},async updateDeviceState(w,E){E?(m.state[w]=E,m.events.notify(w,void 0,Jt.ScryptedInterface.ScryptedDevice,void 0,E,{changed:!0})):(delete m.state[w],m.events.notify(void 0,void 0,Jt.ScryptedInterface.ScryptedDevice,Jt.ScryptedInterfaceProperty.id,w,{changed:!0}))},async notify(w,E,I,N,B,$t){if(typeof E=="number"){let ae=E,le=I;if(N){let ce=m.state?.[w];if(!ce){z.w(`state not found for ${w}`);return}ce[N]=B,m.events.notify(w,ae,le,N,B.value,{changed:$t})}else m.events.notify(w,ae,le,N,B,{changed:$t})}else{let ae=E,le=I;if(ae.property&&!ae.mixinId){let ce=m.state?.[w];if(!ce){z.w(`state not found for ${w}`);return}ce[ae.property]=le,m.events.notifyEventDetails(w,ae,le.value)}else m.events.notifyEventDetails(w,ae,le)}},async setSystemState(w){m.state=w,b.pruneMixinStorage(),l(M)},async loadZip(w,E,I){let N={__filename:void 0,deviceManager:b,systemManager:m,mediaManager:R,endpointManager:v,localStorage:V,pluginHostAPI:h,WebSocket:function(B){if(typeof B=="string")throw new Error("unsupported websocket");return B},pluginRuntimeAPI:M};N.pluginRuntimeAPI=M;try{return await r.onLoadZip(M,N,w,E,I)}catch(B){throw console.error("plugin start/fork failed",B),B}}};return M.pluginRemoteAPI=Y,Y},u}});var Ho=$(ei=>{"use strict";Object.defineProperty(ei,"__esModule",{value:!0});ei.createDuplexRpcPeer=zm;ei.createRpcSerializer=ip;ei.createRpcDuplexSerializer=Io;ei.createDataChannelSerializer=Bm;var Dm=mo(),Fm=$e();function zm(i,r,e,t){let s=Io(t),n=new Fm.RpcPeer(i,r,(o,a,l)=>{try{s.sendMessage(o,a,l)}catch(u){a?.(u),e.destroy()}});return s.setupRpcPeer(n),e.on("data",o=>s.onData(o)),e.on("close",s.onDisconnected),e.on("error",s.onDisconnected),n}function ip(i){let r,{sendMessageBuffer:e,sendMessageFinish:t}=i,s=!0,n=()=>{s=!1,r.kill("connection closed.")},o=(f,m,b)=>{if(!s){m?.(new Error("peer disconnected"));return}let v=b?.buffers;if(v)for(let _ of v)e(_);t(f)},a;return{kill:f=>{r.kill(f)},sendMessage:o,setupRpcPeer:f=>{r=f,r.addSerializer(Buffer,"Buffer",new Dm.SidebandBufferSerializer),r.constructorSerializerMap.set(Uint8Array,"Buffer")},onMessageBuffer:f=>{a=a||{},a.buffers||=[],a.buffers.push(f)},onMessageFinish:f=>{let m=a;a=void 0,r.handleMessage(f,m)},onDisconnected:n}}function Io(i){let r=(d,f)=>{let m=Buffer.alloc(5);m.writeUInt32BE(f.length+1,0),m.writeUInt8(d,4),i.write(Buffer.concat([m,f]))},e=d=>f=>r(d,f),t=e(1),s=e(0),n=ip({sendMessageBuffer:t,sendMessageFinish:d=>s(Buffer.from(JSON.stringify(d)))}),o,a,l,u;return{onData:d=>{for(;d.length;){if(!a){if(o?o=Buffer.concat([o,d]):o=d,o.length<5)return;d=o.slice(5);let b=o.readUInt32BE(0)-1;u=o.readUInt8(4),d.length>=b&&u===0?(a=d.length===b?d:d.slice(0,b),l=b,d=d.slice(b)):(a=Buffer.alloc(b),l=0),o=void 0}let f=a.length-l;if(f){let b=d.slice(0,f);d=d.slice(f),a.set(b,l),l+=b.length}if(l!==a.length)return;let m=a;if(a=void 0,u===0)try{let b=JSON.parse(m.toString());n.onMessageFinish(b)}catch(b){n.kill("message parse failure "+b.message)}else n.onMessageBuffer(m)}},setupRpcPeer:n.setupRpcPeer,sendMessage:n.sendMessage,onDisconnected:n.onDisconnected}}function Bm(i){let r;function t(){if(!r||r.length===0)return;let a=r;r=void 0;for(let l of a){let u=0;for(;u<l.length;){let h=l.length-u,d=Math.min(h,16384),f=l.subarray(u,u+d);i.send(f),u+=d}}}function s(a){let l=!!r;r||(r=[]),r.push(a),l||setTimeout(()=>t(),0)}return Io({write:a=>{s(a)}})}});var rp=$((T1,jm)=>{jm.exports={name:"@scrypted/client",version:"1.3.26",description:"",main:"dist/packages/client/src/index.js",scripts:{prebuild:"rimraf dist",build:"tsc --outDir dist",prepublishOnly:"npm run build",test:'echo "Error: no test specified" && exit 1'},author:"",license:"ISC",devDependencies:{"@types/ip":"^1.1.3","@types/node":"^24.0.10","@types/ws":"^8.18.1","ts-node":"^10.9.2",typescript:"^5.8.3"},peerDependencies:{"@scrypted/types":"^0.5.44"},dependencies:{"engine.io-client":"^6.6.3","follow-redirects":"^1.15.9",rimraf:"^6.0.1"}}});var op=$(Ri=>{"use strict";Object.defineProperty(Ri,"__esModule",{value:!0});Ri.isIPV4Address=sp;Ri.isIPV6Address=np;Ri.isIPAddress=Um;var Nm=/^(\d{1,3}\.){3,3}\d{1,3}$/,qm=/^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;function sp(i){return Nm.test(i)}function np(i){return qm.test(i)}function Um(i){return sp(i)||np(i)}});var Oo=$(te=>{"use strict";Object.defineProperty(te,"__esModule",{value:!0});te.fetchStatusCodeOk=ap;te.checkStatus=lp;te.getFetchMethod=cp;te.getHttpFetchAccept=dp;te.hasHeader=gs;te.removeHeader=pp;te.setHeader=vs;te.setDefaultHttpFetchAccept=up;te.createHeadersArray=hp;te.createStringOrBufferBody=fp;te.domFetchParseIncomingMessage=mp;te.domFetch=Vm;function ap(i){return i>=200&&i<=299}function lp(i){if(!ap(i))throw new Error(`http response statusCode ${i}`);return!0}function cp(i){return i.method||(i.body?"POST":"GET")}function dp(i){switch(i){case"json":return"application/json";case"text":return"text/plain"}}function gs(i,r){return r=r.toLowerCase(),i.find(([e])=>e.toLowerCase()===r)}function pp(i,r){r=r.toLowerCase();let e=i.filter(([t,s])=>t.toLowerCase()!==r);i.length=0,e.forEach(t=>i.push(t))}function vs(i,r,e){pp(i,r),i.push([r,e])}function up(i,r){if(gs(i,"Accept"))return;let e=dp(r);e&&vs(i,"Accept",e)}function hp(i){let r=[];if(!i)return r;if(i instanceof Headers){for(let[e,t]of i.entries())r.push([e,t]);return r}if(i instanceof Array){for(let[e,t]of i)r.push([e,t]);return r}for(let e of Object.keys(i)){let t=i[e];r.push([e,t])}return r}function fp(i,r){let e;return typeof r=="object"?(r=JSON.stringify(r),e="application/json"):typeof r=="string"&&(e="text/plain"),e&&!gs(i,"Content-Type")&&vs(i,"Content-Type",e),gs(i,"Content-Length")||(r=Buffer.from(r),vs(i,"Content-Length",r.length.toString())),r}async function mp(i,r){switch(r){case"json":return i.json();case"text":return i.text();case"readable":return i}return new Uint8Array(await i.arrayBuffer())}async function Vm(i){let r=hp(i.headers);up(r,i.responseType);let{body:e}=i;e&&!(e instanceof ReadableStream)&&(e=fp(r,e));let t,s;i.timeout&&(t=new AbortController,s=setTimeout(()=>t.abort(),i.timeout),i.signal?.addEventListener("abort",()=>t.abort(i.signal?.reason)));try{let{url:n}=i,o=await fetch(n,{method:cp(i),credentials:i.withCredentials?"include":void 0,headers:r,signal:t?.signal||i.signal,body:e});if(i?.checkStatusCode===void 0||i?.checkStatusCode)try{if(!(typeof i?.checkStatusCode=="function"?i.checkStatusCode:lp)(o.status))throw new Error(`http response statusCode ${o.status}`)}catch(a){throw o.arrayBuffer().catch(()=>{}),a}return{statusCode:o.status,headers:o.headers,body:await mp(o,i.responseType)}}finally{clearTimeout(s)}}});var kt={};du(kt,{default:()=>Wm});var Wm,Ct=cu(()=>{"use strict";Wm={}});var vp=$(Li=>{"use strict";Object.defineProperty(Li,"__esModule",{value:!0});Li.getHttpFetchParser=bp;Li.httpFetchParseIncomingMessage=gp;Li.httpFetch=Qm;var Mi=Oo();async function _s(i){let r=[];i.on("data",t=>r.push(t));let{once:e}=(Ct(),Tt(kt));return await e(i,"end"),Buffer.concat(r)}var Km={async parse(i){return(await _s(i)).toString()}},Gm={async parse(i){return JSON.parse((await _s(i)).toString())}},Ym={async parse(i){return _s(i)}},Xm={async parse(i){return i}};function bp(i){switch(i){case"json":return Gm;case"text":return Km;case"readable":return Xm}return Ym}function gp(i,r){return bp(r).parse(i)}async function Qm(i){let r=(0,Mi.createHeadersArray)(i.headers);(0,Mi.setDefaultHttpFetchAccept)(r,i.responseType);let{once:e}=(Ct(),Tt(kt)),{PassThrough:t,Readable:s}=(Ct(),Tt(kt)),{http:n,https:o}=(Ct(),Tt(kt)),{url:a}=i,u=a.toString().startsWith("https:")?o:n,{body:h}=i;if(h&&!(h instanceof s)){let _=new t;_.write(Buffer.from((0,Mi.createStringOrBufferBody)(r,h))),_.end(),h=_}let d,f;i.timeout&&(d=new AbortController,f=setTimeout(()=>d.abort(),i.timeout),i.signal?.addEventListener("abort",()=>d.abort(i.signal?.reason)));let m=d?.signal||i.signal;m?.addEventListener("abort",()=>v.destroy(new Error(i.signal?.reason||"abort")));let b={};for(let[_,k]of r)b[_]?b[_].push(k):b[_]=[k];let v=u.request(a,{method:(0,Mi.getFetchMethod)(i),rejectUnauthorized:i.rejectUnauthorized,family:i.family,headers:b,signal:m,timeout:i.timeout});h?h.pipe(v):v.end();try{let[_]=await e(v,"response");if(i?.checkStatusCode===void 0||i?.checkStatusCode)try{let R=typeof i?.checkStatusCode=="function"?i.checkStatusCode:Mi.checkStatus;if(!_.statusCode||!R(_.statusCode))throw new Error(`http response statusCode ${_.statusCode}`)}catch(R){throw _s(_).catch(()=>{}),R}let k=new Headers;for(let[R,z]of Object.entries(_.headers))for(let M of typeof z=="string"?[z]:z)k.append(R,M);return{statusCode:_.statusCode,headers:k,body:await gp(_,i.responseType)}}finally{clearTimeout(f)}}});var wp=$(F=>{"use strict";var Zm=F&&F.__createBinding||(Object.create?function(i,r,e,t){t===void 0&&(t=e);var s=Object.getOwnPropertyDescriptor(r,e);(!s||("get"in s?!r.__esModule:s.writable||s.configurable))&&(s={enumerable:!0,get:function(){return r[e]}}),Object.defineProperty(i,t,s)}:function(i,r,e,t){t===void 0&&(t=e),i[t]=r[e]}),Jm=F&&F.__setModuleDefault||(Object.create?function(i,r){Object.defineProperty(i,"default",{enumerable:!0,value:r})}:function(i,r){i.default=r}),jo=F&&F.__importStar||function(){var i=function(r){return i=Object.getOwnPropertyNames||function(e){var t=[];for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[t.length]=s);return t},i(r)};return function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var t=i(r),s=0;s<t.length;s++)t[s]!=="default"&&Zm(e,r,t[s]);return Jm(e,r),e}}(),eb=F&&F.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(F,"__esModule",{value:!0});F.ScryptedClientLoginError=F.rpc_serializer=F.rpc=void 0;F.logoutScryptedClient=db;F.getCurrentBaseUrl=pb;F.loginScryptedClient=xp;F.checkScryptedClientLogin=Bo;F.redirectScryptedLogin=ub;F.combineBaseUrl=Oi;F.redirectScryptedLogout=hb;F.connectScryptedClient=fb;var Do=jo(_d()),tb=yd(),ib=wd(),rb=tp(),zo=$e(),_p=Ho(),sb=eb(rp()),nb=op(),ob=Oo(),ab=vp();F.rpc=jo($e());F.rpc_serializer=jo(Ho());var Ii;try{throw new Error}catch{Ii=ob.domFetch}var lb=zo.RpcPeer.generateId();function Fo(i,r){return new Promise((e,t)=>{let s=a=>{o(),t(a)},n=(...a)=>{o(),e(a)},o=()=>{i.removeListener("error",s),i.removeListener(r,n)};i.once("error",s),i.once(r,n)})}function yp(){return globalThis.navigator?.userAgent.includes("InstalledApp")}function cb(){return globalThis.matchMedia?.("(display-mode: standalone)").matches||yp()}async function db(i){let r=Oi(i,"logout");return(await Ii({url:r,withCredentials:!0,responseType:"json",rejectUnauthorized:!1})).body}function pb(){let i=new URL(window.location.href);i.search="",i.hash="";let e=window.location.pathname.split("/"),t=e.findIndex(n=>n==="endpoint");if(t===-1)return;let s=e.slice(0,t);return s.push(""),i.pathname=s.join("/"),i.toString()}async function xp(i){let{baseUrl:r,username:e,password:t,change_password:s,maxAge:n}=i;!n&&cb()&&(n=365*24*60*60*1e3);let o=Oi(r,"login"),a=await Ii({url:o,body:{username:e,password:t,change_password:s,maxAge:n},rejectUnauthorized:!1,withCredentials:!0,responseType:"json"});if(a.statusCode!==200)throw new Error("status "+a.statusCode);let{body:l}=a;return{error:l.error,authorization:l.authorization,queryToken:l.queryToken,token:l.token,addresses:l.addresses,externalAddresses:l.externalAddresses,hostname:l.hostname,scryptedCloud:a.headers.get("x-scrypted-cloud")==="true",directAddress:a.headers.get("x-scrypted-direct-address"),cloudAddress:a.headers.get("x-scrypted-cloud-address"),serverId:a.headers.get("x-scrypted-server-id")}}async function Bo(i){let{baseUrl:r}=i||{},e=Oi(r,"login"),t=new Headers;if(i?.previousLoginResult?.queryToken){let o=i?.previousLoginResult.username+":"+i.previousLoginResult.token,a=Buffer.from(o).toString("base64");t.set("Authorization",`Basic ${a}`)}let s=await Ii({url:e,withCredentials:!0,headers:t,rejectUnauthorized:!1,responseType:"json"}),{body:n}=s;return{baseUrl:r,hostname:n.hostname,redirect:n.redirect,username:n.username,expiration:n.expiration,hasLogin:!!n.hasLogin,error:n.error,authorization:n.authorization,queryToken:n.queryToken,token:n.token,addresses:n.addresses,externalAddresses:n.externalAddresses,scryptedCloud:s.headers.get("x-scrypted-cloud")==="true",directAddress:s.headers.get("x-scrypted-direct-address"),cloudAddress:s.headers.get("x-scrypted-cloud-address"),serverId:s.headers.get("x-scrypted-server-id")}}var Hi=class extends Error{result;constructor(r){super(r.error),this.result=r}};F.ScryptedClientLoginError=Hi;function ub(i){let{baseUrl:r,redirect:e}=i||{};if(e=e||"/endpoint/@scrypted/core/public/",r){let s=new URL(e,r);s.searchParams.set("redirect_uri",window.location.href),e=s.toString()}else e=`${e}?redirect_uri=${encodeURIComponent(window.location.href)}`;let t=e;console.log("redirect_uri",t),globalThis.location.href=t}function Oi(i,r){return i?new URL(r,i).toString():"/"+r}async function hb(i){globalThis.location.href=Oi(i,"logout")}async function fb(i){let r=Date.now(),{baseUrl:e,pluginId:t,clientName:s,username:n,password:o}=i,a,l,u,h,d,f,m,b,v,_;console.log("@scrypted/client",sb.default.version);let k={},z=!globalThis.navigator?.userAgent.includes("Chrome")||yp(),M=!1;if(n&&o){let S=await xp(i);S.authorization&&(k.Authorization=S.authorization),u=S.addresses,h=S.externalAddresses,d=S.scryptedCloud,f=S.directAddress,m=S.cloudAddress,a=S.authorization,l=S.queryToken,v=S.token,b=S.hostname,_=S.serverId,console.log("login result",Date.now()-r,S)}else{let ie=function(U){if(U.error||U.redirect)throw new Hi(U);if(!U.authorization||!U.username||!U.queryToken)throw console.error(U),new Error("malformed login result");return U},S=new Set;if(i?.previousLoginResult?.token){for(let U of[...i?.previousLoginResult?.localAddresses||[],i?.previousLoginResult?.directAddress])U&&(z||i.direct)&&S.add(U);for(let U of[...i?.previousLoginResult?.externalAddresses||[],i?.previousLoginResult?.cloudAddress])U&&S.add(U)}let be=[...S].map(U=>Bo({baseUrl:U,previousLoginResult:i?.previousLoginResult}).then(ie)),Bi=Bo({baseUrl:e,previousLoginResult:i?.previousLoginResult}).then(ie);be.push(Bi);let q;try{q=await Promise.any(be),M||=q.baseUrl!==e}catch{q=await Bi}if(M&&console.log("Found direct login. Allowing alternate addresses."),q.error||q.redirect)throw new Hi(q);u=q.addresses,h=q.externalAddresses,d=q.scryptedCloud,f=q.directAddress,m=q.cloudAddress,n=q.username,a=q.authorization,l=q.queryToken,v=q.token,b=q.hostname,_=q.serverId,console.log("login checked",Date.now()-r,q)}let V,Y=`endpoint/${t}/engine.io/api`,w=e?new URL(Y,e).pathname:"/"+Y,E=Math.random().toString(36).substring(3,10),I={path:w,query:{cacheBust:E},withCredentials:!0,extraHeaders:k,rejectUnauthorized:!1,transports:i?.transports},N=e||`${globalThis.location.protocol}//${globalThis.location.host}`,B=[],$t=z;M||=d,(M&&i.local===void 0&&$t||i.local)&&u&&B.push(...u);let ae=f&&(z||!(0,nb.isIPAddress)(f));if((M&&i.direct===void 0&&ae||i.direct)&&f&&B.push(f),M&&i.direct===void 0||i.direct){m&&B.push(m);for(let S of h||[])B.push(S)}let le=!!B.length;console.log({tryLocalAddressess:le});let ce={...I,extraHeaders:{...I.extraHeaders}};ce.extraHeaders.Authorization||=a;let ii=[],Fi=[];if(le)for(let S of new Set(B)){console.log("trying",S);let ie=new Do.Socket(S,ce);ii.push(ie),Fi.push((async()=>(await Fo(ie,"open"),{connectionType:"http-direct",ready:ie,address:S}))())}let Kp=[...Fi];Fi.push((async()=>{let S=le?1e3:0;if(console.log("waiting",S),S)try{let be=Promise.any(Kp);await(0,tb.timeoutPromise)(S,be),console.log("found direct connection, aborting scrypted cloud connection");return}catch{}let ie=new Do.Socket(N,I);return ii.push(ie),await Fo(ie,"open"),{ready:ie,address:N,connectionType:d?"http-cloud":"http"}})());let Gp=Promise.any(Fi),{ready:ua,connectionType:ha,address:zi,rpcPeer:ze}=await Gp;console.log("connected",ha,zi),V=ua,ii=ii.filter(S=>S!==ua),ii.forEach(S=>{try{S.close()}catch{}});try{if(!ze){let H=(0,_p.createRpcSerializer)({sendMessageBuffer:O=>V.send(O),sendMessageFinish:O=>V.send(JSON.stringify(O))});ze=new zo.RpcPeer(s||"engine.io-client","api",(O,X,ge)=>{try{H.sendMessage(O,X,ge)}catch(Ni){X?.(Ni)}}),V.on("message",O=>{O.constructor===Buffer||O.constructor===ArrayBuffer?H.onMessageBuffer(Buffer.from(O)):H.onMessageFinish(JSON.parse(O))}),H.setupRpcPeer(ze)}let S=await(0,rb.attachPluginRemote)(ze,void 0),{serverVersion:ie,systemManager:be,deviceManager:Bi,endpointManager:q,mediaManager:U,clusterManager:Yp}=S;console.log("api attached",Date.now()-r),U.createMediaObject=async(H,O,X)=>new ib.MediaObject(O,H,X);let[Xp]=await Promise.all([(async()=>{try{return!!await be.getComponent("info")}catch{}return!1})()]);console.log("api initialized",Date.now()-r);let Qp=Object.keys(be.getSystemState()).map(H=>be.getDeviceById(H)).find(H=>H.pluginId==="@scrypted/core"&&H.nativeId===`user:${n}`),ji=new Map,Zp=new FinalizationRegistry(H=>{H.kill("object finalized")}),Jp=(H,O)=>{if(!O?.dedicatedTransport){let ge=ji.get(H.port);if(ge)return ge}let X=(async()=>{let ge="engine.io/connectRPCObject",qi={path:new URL(ge,zi).pathname,query:{cacheBust:E,clusterObject:JSON.stringify(H),...l},withCredentials:!0,extraHeaders:k,rejectUnauthorized:!1,transports:i?.transports},Se=new Do.Socket(zi,qi),St=!1,Be,de,ve,ma=()=>{Be&&(clearTimeout(Be),Be=void 0),de&&(clearTimeout(de),de=void 0)},ba=O?.dedicatedTransport?.receiveTimeout?()=>{Be&&clearTimeout(Be),Be=setTimeout(()=>{ve&&ve.kill("receive timeout")},O.dedicatedTransport.receiveTimeout)}:void 0,As=O?.dedicatedTransport?.sendTimeout?()=>{de&&clearTimeout(de),de=setTimeout(()=>{ve&&ve.kill("send timeout")},O.dedicatedTransport.sendTimeout)}:void 0;Se.on("close",()=>{if(ve?.kill("socket closed"),O?.dedicatedTransport||ji.delete(H.port),!St)throw new Error("peer disconnected before setup completed")});try{await Fo(Se,"open");let Et=(0,_p.createRpcDuplexSerializer)({write:ri=>{As?.(),Se.send(ri)}});return Se.on("message",ri=>{ba?.(),Et.onData(Buffer.from(ri))}),ve=new zo.RpcPeer(s||"engine.io-client","cluster-proxy",(ri,ga,iu)=>{try{As?.(),Et.sendMessage(ri,ga,iu)}catch(ru){ga?.(ru)}}),ve.killedSafe.finally(()=>{ma(),Se.close()}),Et.setupRpcPeer(ve),ve.tags.localPort=lb,St=!0,ba?.(),As?.(),ve}catch(Et){throw ma(),console.error("failure ipc connect",Et),Se.close(),Et}})();return O?.dedicatedTransport||ji.set(H.port,X),X},eu=async(H,O)=>{let X=await ji.get(O);return X?.remoteWeakProxies?Object.values(X.remoteWeakProxies).find(ge=>ge.deref()?.__cluster?.proxyId==H)?.deref():null},tu=async(H,O)=>{let X=H?.__cluster;if(!X)return H;let{port:ge,proxyId:Ni}=X,qi=await eu(Ni,ge);if(qi)return qi;try{let St=await Jp(X,O),Be=await St.getParam("connectRPCObject");try{let de=await Be(X);if(!de)throw new Error("ipc object not found?");return O?.dedicatedTransport&&Zp.register(de,St),de}catch(de){throw O?.dedicatedTransport&&St.kill("connectRPCObject failed"),de}}catch(Se){return console.error("failure ipc",Se),H}},fa={userId:Qp?.id,serverVersion:ie,username:n,pluginRemoteAPI:void 0,address:zi,connectionType:ha,admin:Xp,systemManager:be,clusterManager:Yp,deviceManager:Bi,endpointManager:q,mediaManager:U,disconnect(){ze.kill("disconnect requested")},pluginHostAPI:void 0,rpcPeer:ze,loginResult:{username:n,token:v,directAddress:f,localAddresses:u,externalAddresses:h,scryptedCloud:d,queryToken:l,authorization:a,cloudAddress:m,hostname:b,serverId:_},connectRPCObject:tu,fork:void 0,connect:void 0};return V.on("close",()=>{ze.kill("socket closed")}),ze.killed.finally(()=>{V.close(),fa.onClose?.()}),fa}catch(S){throw V.close(),S}}});var Vi=globalThis,Wi=Vi.ShadowRoot&&(Vi.ShadyCSS===void 0||Vi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Rs=Symbol(),_a=new WeakMap,si=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==Rs)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(Wi&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=_a.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&_a.set(e,r))}return r}toString(){return this.cssText}},K=i=>new si(typeof i=="string"?i:i+"",void 0,Rs),x=(i,...r)=>{let e=i.length===1?i[0]:r.reduce((t,s,n)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new si(e,i,Rs)},ya=(i,r)=>{if(Wi)i.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),s=Vi.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,i.appendChild(t)}},Ms=Wi?i=>i:i=>i instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return K(e)})(i):i;var{is:uu,defineProperty:hu,getOwnPropertyDescriptor:fu,getOwnPropertyNames:mu,getOwnPropertySymbols:bu,getPrototypeOf:gu}=Object,Ki=globalThis,xa=Ki.trustedTypes,vu=xa?xa.emptyScript:"",_u=Ki.reactiveElementPolyfillSupport,ni=(i,r)=>i,Ls={toAttribute(i,r){switch(r){case Boolean:i=i?vu:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,r){let e=i;switch(r){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ka=(i,r)=>!uu(i,r),wa={attribute:!0,type:String,converter:Ls,reflect:!1,useDefault:!1,hasChanged:ka};Symbol.metadata??=Symbol("metadata"),Ki.litPropertyMetadata??=new WeakMap;var Ee=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=wa){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(r,t,e);s!==void 0&&hu(this.prototype,r,s)}}static getPropertyDescriptor(r,e,t){let{get:s,set:n}=fu(this.prototype,r)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let a=s?.call(this);n?.call(this,o),this.requestUpdate(r,a,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??wa}static _$Ei(){if(this.hasOwnProperty(ni("elementProperties")))return;let r=gu(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(ni("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ni("properties"))){let e=this.properties,t=[...mu(e),...bu(e)];for(let s of t)this.createProperty(s,e[s])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let s of t)e.unshift(Ms(s))}else r!==void 0&&e.push(Ms(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ya(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),s=this.constructor._$Eu(r,t);if(s!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:Ls).toAttribute(e,t.type);this._$Em=r,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(r,e){let t=this.constructor,s=t._$Eh.get(r);if(s!==void 0&&this._$Em!==s){let n=t.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Ls;this._$Em=s;let a=o.fromAttribute(e,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(r,e,t,s=!1,n){if(r!==void 0){let o=this.constructor;if(s===!1&&(n=this[r]),t??=o.getPropertyOptions(r),!((t.hasChanged??ka)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:s,wrapped:n},o){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??e??this[r]),n!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),s===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,n]of t){let{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};Ee.elementStyles=[],Ee.shadowRootOptions={mode:"open"},Ee[ni("elementProperties")]=new Map,Ee[ni("finalized")]=new Map,_u?.({ReactiveElement:Ee}),(Ki.reactiveElementVersions??=[]).push("2.1.2");var Hs=globalThis,Ca=i=>i,Gi=Hs.trustedTypes,$a=Gi?Gi.createPolicy("lit-html",{createHTML:i=>i}):void 0,Os="$lit$",Te=`lit$${Math.random().toFixed(9).slice(2)}$`,Ds="?"+Te,yu=`<${Ds}>`,nt=document,ai=()=>nt.createComment(""),li=i=>i===null||typeof i!="object"&&typeof i!="function",Fs=Array.isArray,Ra=i=>Fs(i)||typeof i?.[Symbol.iterator]=="function",Is=`[ 	
\f\r]`,oi=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Sa=/-->/g,Ea=/>/g,rt=RegExp(`>|${Is}(?:([^\\s"'>=/]+)(${Is}*=${Is}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ta=/'/g,Pa=/"/g,Ma=/^(?:script|style|textarea|title)$/i,zs=i=>(r,...e)=>({_$litType$:i,strings:r,values:e}),c=zs(1),D=zs(2),gg=zs(3),Pe=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Aa=new WeakMap,st=nt.createTreeWalker(nt,129);function La(i,r){if(!Fs(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return $a!==void 0?$a.createHTML(r):r}var Ia=(i,r)=>{let e=i.length-1,t=[],s,n=r===2?"<svg>":r===3?"<math>":"",o=oi;for(let a=0;a<e;a++){let l=i[a],u,h,d=-1,f=0;for(;f<l.length&&(o.lastIndex=f,h=o.exec(l),h!==null);)f=o.lastIndex,o===oi?h[1]==="!--"?o=Sa:h[1]!==void 0?o=Ea:h[2]!==void 0?(Ma.test(h[2])&&(s=RegExp("</"+h[2],"g")),o=rt):h[3]!==void 0&&(o=rt):o===rt?h[0]===">"?(o=s??oi,d=-1):h[1]===void 0?d=-2:(d=o.lastIndex-h[2].length,u=h[1],o=h[3]===void 0?rt:h[3]==='"'?Pa:Ta):o===Pa||o===Ta?o=rt:o===Sa||o===Ea?o=oi:(o=rt,s=void 0);let m=o===rt&&i[a+1].startsWith("/>")?" ":"";n+=o===oi?l+yu:d>=0?(t.push(u),l.slice(0,d)+Os+l.slice(d)+Te+m):l+Te+(d===-2?a:m)}return[La(i,n+(i[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},ci=class i{constructor({strings:r,_$litType$:e},t){let s;this.parts=[];let n=0,o=0,a=r.length-1,l=this.parts,[u,h]=Ia(r,e);if(this.el=i.createElement(u,t),st.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=st.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(Os)){let f=h[o++],m=s.getAttribute(d).split(Te),b=/([.?@])?(.*)/.exec(f);l.push({type:1,index:n,name:b[2],strings:m,ctor:b[1]==="."?Xi:b[1]==="?"?Qi:b[1]==="@"?Zi:at}),s.removeAttribute(d)}else d.startsWith(Te)&&(l.push({type:6,index:n}),s.removeAttribute(d));if(Ma.test(s.tagName)){let d=s.textContent.split(Te),f=d.length-1;if(f>0){s.textContent=Gi?Gi.emptyScript:"";for(let m=0;m<f;m++)s.append(d[m],ai()),st.nextNode(),l.push({type:2,index:++n});s.append(d[f],ai())}}}else if(s.nodeType===8)if(s.data===Ds)l.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf(Te,d+1))!==-1;)l.push({type:7,index:n}),d+=Te.length-1}n++}}static createElement(r,e){let t=nt.createElement("template");return t.innerHTML=r,t}};function ot(i,r,e=i,t){if(r===Pe)return r;let s=t!==void 0?e._$Co?.[t]:e._$Cl,n=li(r)?void 0:r._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(r=ot(i,s._$AS(i,r.values),s,t)),r}var Yi=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,s=(r?.creationScope??nt).importNode(e,!0);st.currentNode=s;let n=st.nextNode(),o=0,a=0,l=t[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new Pt(n,n.nextSibling,this,r):l.type===1?u=new l.ctor(n,l.name,l.strings,this,r):l.type===6&&(u=new Ji(n,this,r)),this._$AV.push(u),l=t[++a]}o!==l?.index&&(n=st.nextNode(),o++)}return st.currentNode=nt,s}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},Pt=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=ot(this,r,e),li(r)?r===p||r==null||r===""?(this._$AH!==p&&this._$AR(),this._$AH=p):r!==this._$AH&&r!==Pe&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Ra(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==p&&li(this._$AH)?this._$AA.nextSibling.data=r:this.T(nt.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,s=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=ci.createElement(La(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new Yi(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(r){let e=Aa.get(r.strings);return e===void 0&&Aa.set(r.strings,e=new ci(r)),e}k(r){Fs(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let n of r)s===e.length?e.push(t=new i(this.O(ai()),this.O(ai()),this,this.options)):t=e[s],t._$AI(n),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=Ca(r).nextSibling;Ca(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},at=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,s,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=r,this.name=e,this._$AM=s,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(r,e=this,t,s){let n=this.strings,o=!1;if(n===void 0)r=ot(this,r,e,0),o=!li(r)||r!==this._$AH&&r!==Pe,o&&(this._$AH=r);else{let a=r,l,u;for(r=n[0],l=0;l<n.length-1;l++)u=ot(this,a[t+l],e,l),u===Pe&&(u=this._$AH[l]),o||=!li(u)||u!==this._$AH[l],u===p?r=p:r!==p&&(r+=(u??"")+n[l+1]),this._$AH[l]=u}o&&!s&&this.j(r)}j(r){r===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},Xi=class extends at{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===p?void 0:r}},Qi=class extends at{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==p)}},Zi=class extends at{constructor(r,e,t,s,n){super(r,e,t,s,n),this.type=5}_$AI(r,e=this){if((r=ot(this,r,e,0)??p)===Pe)return;let t=this._$AH,s=r===p&&t!==p||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,n=r!==p&&(t===p||s);s&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},Ji=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){ot(this,r)}},Ha={M:Os,P:Te,A:Ds,C:1,L:Ia,R:Yi,D:Ra,V:ot,I:Pt,H:at,N:Qi,U:Zi,B:Xi,F:Ji},xu=Hs.litHtmlPolyfillSupport;xu?.(ci,Pt),(Hs.litHtmlVersions??=[]).push("3.3.3");var Oa=(i,r,e)=>{let t=e?.renderBefore??r,s=t._$litPart$;if(s===void 0){let n=e?.renderBefore??null;t._$litPart$=s=new Pt(r.insertBefore(ai(),n),n,void 0,e??{})}return s._$AI(i),s};var Bs=globalThis,y=class extends Ee{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=Oa(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Pe}};y._$litElement$=!0,y.finalized=!0,Bs.litElementHydrateSupport?.({LitElement:y});var wu=Bs.litElementPolyfillSupport;wu?.({LitElement:y});(Bs.litElementVersions??=[]).push("4.2.2");var ku={feeding:{domain:"binary_sensor",translationKeys:["feeding"],idSuffixes:["_feeding"]},eating:{domain:"binary_sensor",translationKeys:["eating"],idSuffixes:["_eating"]},bowlFill:{domain:"sensor",translationKeys:["bowl_fill","bowl_fill_1"],idSuffixes:["_bowl_fill","_bowl_fill_1","_bowl_fill_hopper_1"]},hopperLevel1:{domain:"sensor",translationKeys:["hopper_1_level"],idSuffixes:["_hopper_1_level"]},hopperLevel2:{domain:"sensor",translationKeys:["hopper_2_level"],idSuffixes:["_hopper_2_level"]},hopperRemaining1:{domain:"sensor",translationKeys:["hopper_1_remaining"],idSuffixes:["_hopper_1_remaining"]},hopperRemaining2:{domain:"sensor",translationKeys:["hopper_2_remaining"],idSuffixes:["_hopper_2_remaining"]},markFullHopper1:{domain:"button",translationKeys:["hopper_1_full"],idSuffixes:["_hopper_1_full"]},markFullHopper2:{domain:"button",translationKeys:["hopper_2_full"],idSuffixes:["_hopper_2_full"]},markFullBoth:{domain:"button",translationKeys:["hopper_full"],idSuffixes:["_hopper_full"]},hopperDivider:{domain:"switch",translationKeys:["hopper_divider"],idSuffixes:["_hopper_divider"]},hopperFood1:{domain:"text",translationKeys:["hopper_1_food"],idSuffixes:["_hopper_1_food"]},hopperFood2:{domain:"text",translationKeys:["hopper_2_food"],idSuffixes:["_hopper_2_food"]},desiccantDays:{domain:"sensor",translationKeys:["desiccant_days","desiccant_left"],idSuffixes:["_desiccant_days","_desiccant_left"]},schedule:{domain:"sensor",translationKeys:["schedule"],idSuffixes:["_schedule"]},scheduleCardState:{domain:"sensor",translationKeys:["schedule_card_state"],idSuffixes:["_schedule_card_state"]},feedButton:{domain:"button",translationKeys:["feed"],idSuffixes:["_feed"]},feedButtonHopper1:{domain:"button",translationKeys:["feed_hopper_1"],idSuffixes:["_feed_hopper_1"]},feedButtonHopper2:{domain:"button",translationKeys:["feed_hopper_2"],idSuffixes:["_feed_hopper_2"]},cancelFeedButton:{domain:"button",translationKeys:["cancel_feed"],idSuffixes:["_cancel_feed"]},callCatsButton:{domain:"button",translationKeys:["call_cats"],idSuffixes:["_call_cats"]},feedAmount:{domain:"number",translationKeys:["feed_amount"],idSuffixes:["_feed_amount"]},feedAmountHopper1:{domain:"number",translationKeys:["feed_amount_hopper_1"],idSuffixes:["_feed_amount_hopper_1"]},feedAmountHopper2:{domain:"number",translationKeys:["feed_amount_hopper_2"],idSuffixes:["_feed_amount_hopper_2"]},cloudSwitch:{domain:"switch",translationKeys:["cloud","petkit_cloud"],idSuffixes:["_cloud","_petkit_cloud"]},stackSelect:{domain:"select",translationKeys:["stack"],idSuffixes:["_stack"]},cloudConnection:{domain:"sensor",translationKeys:["cloud_connection"],idSuffixes:["_cloud_connection"]},nightVisionSwitch:{domain:"switch",translationKeys:["night","night_vision"],idSuffixes:["_night","_night_vision"]},statusLedSwitch:{domain:"switch",translationKeys:["light","status_led"],idSuffixes:["_light","_status_led"]},microphoneSwitch:{domain:"switch",translationKeys:["microphone"],idSuffixes:["_microphone"]},lastSeenPet:{domain:"sensor",translationKeys:["last_seen_pet"],idSuffixes:["_last_seen_pet"]},dishBefore:{domain:"image",translationKeys:["dish_before"],idSuffixes:["_dish_before"]},dishAfter:{domain:"image",translationKeys:["dish_after"],idSuffixes:["_dish_after"]},wifiNetwork:{domain:"sensor",translationKeys:["wifi_network","wifi","rssi"],idSuffixes:["_wifi_network","_wifi","_rssi"]},lastDetection:{domain:"sensor",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionsToday:{domain:"sensor",translationKeys:["detections_today"],idSuffixes:["_detections_today"]},lastDetectionImage:{domain:"image",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionOverlaySwitch:{domain:"switch",translationKeys:["detection_overlay"],idSuffixes:["_detection_overlay"]}};function er(i){return i.slice(0,i.indexOf("."))}function js(i){return i.slice(i.indexOf(".")+1)}function Cu(i,r){if(er(i.entity_id)!==r.domain)return!1;if(i.translation_key&&r.translationKeys.includes(i.translation_key))return!0;let e=js(i.entity_id);return r.idSuffixes.some(t=>e.endsWith(t))}function $u(i){let r=i.name??i.original_name;if(r)return r.replace(/\s+present$/i,"").trim()||r;let s=js(i.entity_id).replace(/_present$/,"").split("_").filter(Boolean).pop();return s?s[0].toUpperCase()+s.slice(1):"Cat"}function Su(i){return er(i.entity_id)!=="binary_sensor"?!1:i.translation_key==="present"||i.translation_key?.endsWith("_present")?!0:js(i.entity_id).endsWith("_present")}function je(i,r){let e={deviceId:r,catPresence:[]},t=Object.values(i).filter(s=>s.device_id===r&&!s.disabled_by);for(let s of t){if(er(s.entity_id)==="camera"&&!e.camera){e.camera=s.entity_id;continue}if(er(s.entity_id)==="media_player"&&!e.speaker){e.speaker=s.entity_id;continue}if(Su(s)){e.catPresence.push({entityId:s.entity_id,name:$u(s)});continue}for(let n of Object.entries(ku)){let[o,a]=n;if(!e[o]&&Cu(s,a)){e[o]=s.entity_id;break}}}return e.catPresence.sort((s,n)=>s.name.localeCompare(n.name)),e}function At(i,r){if(!r)return;let e=i[r];return e?.config_entry_id??e?.config_entries?.[0]}function Da(i,r){let e=t=>t===void 0||t==="unavailable"||t==="unknown";return i.length===0||i.every(e)?"unreachable":r==="on"?"dispensing":"idle"}function Ns(i,r){return i==="unreachable"?"Feeder unreachable. Check that kibbled is running":i==="dispensing"?"Dispensing\u2026":r?`Fed ${r}`:"Ready to feed"}function tr(i,r){let e=Math.floor(Math.max(0,r.getTime()-i.getTime())/6e4);if(e<1)return{unit:"now",value:0};if(e<60)return{unit:"minutes",value:e};let t=Math.floor(e/60);return t<24?{unit:"hours",value:t}:{unit:"days",value:Math.floor(t/24)}}function Fa(i,r){let e=tr(i,r);if(e.unit==="now")return"just now";let t=e.unit==="minutes"?"m":e.unit==="hours"?"h":"d";return`${e.value}${t} ago`}function Rt(i,r){let e=tr(i,r);if(e.unit==="now")return"just now";let t=e.unit==="minutes"?"min":e.unit==="hours"?"h":"d";return`${e.value} ${t} ago`}var Eu={data:null,error:null,loading:!1},re=class{constructor(r){this._lastWatched=null;this._requestId=0;this._state=Eu;this._onChange=r}get state(){return this._state}sync(r,e){r!==this._lastWatched&&(this._lastWatched=r,this.refresh(e))}refresh(r){let e=++this._requestId;this._state={...this._state,loading:!0,error:null},this._onChange(),r().then(t=>{e===this._requestId&&(this._state={data:t,error:null,loading:!1},this._onChange())},t=>{e===this._requestId&&(this._state={...this._state,error:j(t),loading:!1},this._onChange())})}patch(r){this._state.data!==null&&(this._state={...this._state,data:r(this._state.data)},this._onChange())}};function za(i,r){return r.filter(e=>!!e).map(e=>`${e}=${i.states[e]?.state??""}`).join("|")}function j(i){if(i instanceof Error)return i.message;if(i&&typeof i=="object"&&"message"in i){let r=i.message;if(typeof r=="string"&&r)return r}return"Something went wrong."}function ir(i){let r=i?.attributes?.entries;return Array.isArray(r)?r:[]}function Mt(i){let r=/^(\d{1,2}):(\d{2})$/.exec(i.trim());if(!r)throw new Error(`Invalid schedule time "${i}"`);let e=Number(r[1]),t=Number(r[2]);if(e>23||t>59)throw new Error(`Invalid schedule time "${i}"`);return e*60+t}function Tu(i,r){let e=r.getHours()*60+r.getMinutes(),t=null;for(let s of i){if(!s.enabled)continue;let o=((Mt(s.time)-e)%1440+1440)%1440;(t===null||o<t.minutesUntil)&&(t={entry:s,minutesUntil:o})}return t}function Ne(i,r){let e=Mt(i);return new Date(2e3,0,1,Math.floor(e/60),e%60).toLocaleTimeString(r,{hour:"numeric",minute:"2-digit"})}var Pu=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function Ba(i,r,e){if(i.length===0)return"No schedule set";let t=Tu(i,r);if(!t)return"All feeds paused";let s=i.filter(o=>o.enabled).length,n=Pu[s]??String(s);return`Next feed ${Ne(t.entry.time,e)}, ${n} a day`}var di=20;function Au(i){return i===1?"1 portion":`${i} portions`}function lt(i,r){let e=r?.trim();return e||`Hopper ${i}`}function pi(i,r,e,t){if(r)return Au(Math.max(i.amount_l,i.amount_r));let s=[];return i.amount_l>0&&s.push(`${lt(1,e)} ${i.amount_l}`),i.amount_r>0&&s.push(`${lt(2,t)} ${i.amount_r}`),s.length>0?s.join(" + "):"No food"}function rr(i){return[...i].sort((r,e)=>Mt(r.time)-Mt(e.time))}function Us(i){if(!/^\d{1,2}:\d{2}$/.test(i.time.trim()))return"Pick a time";try{Mt(i.time)}catch{return"Pick a time"}for(let r of[i.amount_l,i.amount_r])if(!Number.isInteger(r)||r<0||r>di)return`Portions go from 0 to ${di}`;return i.amount_l===0&&i.amount_r===0?"Pick at least one portion":null}function qs(i){let r=Mt(i),e=String(Math.floor(r/60)).padStart(2,"0"),t=String(r%60).padStart(2,"0");return`${e}:${t}:00`}function ja(i,r){return{device_id:i,time:qs(r.time),hopper1_g:r.amount_l,hopper2_g:r.amount_r,enabled:!0}}function Na(i,r,e){if(!i.some(t=>t.id===r))throw new Error("That feed was removed meanwhile. Reopen the schedule and try again.");return i.map(t=>t.id===r?{entry_id:t.id,time:qs(e.time),hopper1_g:e.amount_l,hopper2_g:e.amount_r,enabled:t.enabled}:{entry_id:t.id,time:qs(t.time),hopper1_g:t.amount_l,hopper2_g:t.amount_r,enabled:t.enabled})}function Vs(i){if(typeof i=="string"&&i.trim())return i.trim();if(typeof i=="object"&&i!==null){let r=i.message;if(typeof r=="string"&&r.trim())return r.trim()}return"Home Assistant did not accept the change"}var _e=class{constructor(){this._urls=new Map;this._refs=new Map;this._pending=new Set;this._waiters=new Map}acquire(r,e,t){let s=e.id;this._refs.set(s,(this._refs.get(s)??0)+1);let n=this._urls.get(s);if(n!==void 0)return n;let o=this._waiters.get(s)??new Set;return o.add(t),this._waiters.set(s,o),this._pending.has(s)||(this._pending.add(s),this._fetch(r,e.url).then(a=>{this._pending.delete(s);let l=this._waiters.get(s);this._waiters.delete(s),a&&(this._refs.get(s)??0)>0?this._urls.set(s,a):a&&URL.revokeObjectURL(a);for(let u of l??[])u(a)})),null}release(r){let e=(this._refs.get(r)??0)-1;if(e>0){this._refs.set(r,e);return}this._refs.delete(r),queueMicrotask(()=>{(this._refs.get(r)??0)>0||this._evictIfOverCap()})}_evictIfOverCap(){if(!(this._urls.size<=200))for(let[r,e]of this._urls){if(this._urls.size<=200)break;(this._refs.get(r)??0)>0||(this._urls.delete(r),URL.revokeObjectURL(e))}}async _fetch(r,e){if(!r.fetchWithAuth)return null;try{let t=await r.fetchWithAuth(e);if(!t.ok)return null;let s=await t.blob();return URL.createObjectURL(s)}catch{return null}}dispose(){for(let r of this._urls.values())URL.revokeObjectURL(r);this._urls.clear(),this._refs.clear(),this._pending.clear(),this._waiters.clear()}},qe=class{constructor(){this._acquiredId=null;this._cache=null;this._url=null;this._failed=!1}get url(){return this._url}get failed(){return this._failed}retry(r,e,t,s){this._release(),this._url=null,this._failed=!1,this.sync(r,e,t,s)}sync(r,e,t,s){if((t?.id??null)!==this._acquiredId&&(this._release(),this._url=null,this._failed=!1),!t||!r||!e||this._acquiredId===t.id)return;this._acquiredId=t.id,this._cache=e;let o=t.id,a=e.acquire(r,t,l=>{this._acquiredId===o&&(this._url=l,this._failed=l===null,s())});a!==null&&(this._url=a)}_release(){this._acquiredId&&this._cache&&this._cache.release(this._acquiredId),this._acquiredId=null,this._cache=null}dispose(){this._release(),this._url=null,this._failed=!1}};var Ru={cog:"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",cloudCheck:"M13 19C13 19.34 13.04 19.67 13.09 20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.32 7.4 19 9.05 19 11C20.15 11.13 21.1 11.63 21.86 12.5C22.37 13.07 22.7 13.71 22.86 14.42C21.82 13.54 20.5 13 19 13C18.89 13 18.79 13 18.68 13C18.62 13 18.56 13 18.5 13H17V11C17 9.62 16.5 8.44 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18H13.09C13.04 18.33 13 18.66 13 19M17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84L17.75 19.43Z",cloudLock:"M6.5 18H13V20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.08 7.16 18.73 8.5 18.93 10C18.23 10 17.56 10.19 16.95 10.46C16.84 9.31 16.38 8.31 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18M23 17.3V20.8C23 21.4 22.4 22 21.7 22H16.2C15.6 22 15 21.4 15 20.7V17.2C15 16.6 15.6 16 16.2 16V14.5C16.2 13.1 17.6 12 19 12S21.8 13.1 21.8 14.5V16C22.4 16 23 16.6 23 17.3M20.5 14.5C20.5 13.7 19.8 13.2 19 13.2S17.5 13.7 17.5 14.5V16H20.5V14.5Z",cloudAlert:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M11 7H13V13H11V7Z",cloudQuestion:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M14.43 8.68C14.97 9.13 15.24 9.75 15.24 10.5C15.24 11 15.09 11.41 14.8 11.82C14.5 12.21 14.13 12.5 13.67 12.75C13.41 12.91 13.24 13.07 13.15 13.26C13.06 13.45 13 13.69 13 14H11C11 13.45 11.11 13.08 11.3 12.82C11.5 12.56 11.85 12.25 12.37 11.91C12.63 11.75 12.84 11.56 13 11.32C13.15 11.09 13.23 10.81 13.23 10.5C13.23 10.18 13.14 9.94 12.96 9.76C12.78 9.56 12.5 9.47 12.2 9.47C11.93 9.47 11.71 9.55 11.5 9.7C11.35 9.85 11.25 10.08 11.25 10.39H9.28C9.23 9.64 9.5 9 10.06 8.59C10.6 8.2 11.31 8 12.2 8C13.14 8 13.89 8.23 14.43 8.68Z",airFilter:"M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",wifi:"M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",fullscreen:"M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z",fullscreenExit:"M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z",weatherNight:"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",ledOn:"M11,0V4H13V0H11M18.3,2.29L15.24,5.29L16.64,6.71L19.7,3.71L18.3,2.29M5.71,2.29L4.29,3.71L7.29,6.71L8.71,5.29L5.71,2.29M12,6A4,4 0 0,0 8,10V16H6V18H9V23H11V18H13V23H15V18H18V16H16V10A4,4 0 0,0 12,6M2,9V11H6V9H2M18,9V11H22V9H18Z",microphone:"M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z",microphoneOff:"M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z",volumeOff:"M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z",volumeHigh:"M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",openInNew:"M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",speaker:"M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",refresh:"M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",check:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",dotsVertical:"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",helpCircle:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6C9.79,6 8,7.79 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",eye:"M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",eyeOff:"M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",deleteOutline:"M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",undo:"M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",plus:"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",cat:"M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M11,14H13L12.3,15.39C12.5,16.03 13.06,16.5 13.75,16.5A1.5,1.5 0 0,0 15.25,15H15.75A2,2 0 0,1 13.75,17C13,17 12.35,16.59 12,16V16H12C11.65,16.59 11,17 10.25,17A2,2 0 0,1 8.25,15H8.75A1.5,1.5 0 0,0 10.25,16.5C10.94,16.5 11.5,16.03 11.7,15.39L11,14Z",play:"M8,5.14V19.14L19,12.14L8,5.14Z",flash:"M7,2V13H10V22L17,10H13L17,2H7Z",cancel:"M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C10.1 4 8.4 4.6 7.1 5.7L18.3 16.9C19.3 15.5 20 13.8 20 12C20 7.6 16.4 4 12 4M16.9 18.3L5.7 7.1C4.6 8.4 4 10.1 4 12C4 16.4 7.6 20 12 20C13.9 20 15.6 19.4 16.9 18.3Z",imageBroken:"M21,5V11.59L18,8.58L14,12.59L10,8.59L6,12.59L3,9.58V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5M18,11.42L21,14.43V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V12.42L6,15.41L10,11.41L14,15.41",chevronLeft:"M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",chevronRight:"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",arrowExpand:"M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z",arrowCollapse:"M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z",imageMultiple:"M21,17H7V3H21M21,1H7A2,2 0 0,0 5,3V17A2,2 0 0,0 7,19H21A2,2 0 0,0 23,17V3A2,2 0 0,0 21,1M3,5H1V21A2,2 0 0,0 3,23H19V21H3M15.96,10.29L13.21,13.83L11.25,11.47L8.5,15H19.5L15.96,10.29Z"};function g(i){return D`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d=${Ru[i]}></path></svg>`}var qa="0.29.0";var sr="#43A96A",Va="#2F8551",nr="#10301D",Wa="#F4A452",or="#DE8A3A",Ka="#3A2C28",Ga="#E5484D",Ua=["#3FA7A0","#9A5B9E","#7FA05A","#4F86C6"];function W(i){let r=Ua.length;return Ua[(i%r+r)%r]}function Ya(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0}function Gs(i){return i==="empty"||i==="low"||i==="ok"?i:null}function Ys(i){if(!i)return null;let r=i.state,e=r==="unknown"||r==="unavailable"||r===""?null:Number(r),t=i.attributes??{};return{portions:e!=null&&Number.isFinite(e)?e:null,fullAt:typeof t.full_at=="string"?t.full_at:null,portionsSinceFull:typeof t.portions_since_full=="number"?t.portions_since_full:null,fullToLow:typeof t.full_to_low=="number"?t.full_to_low:null}}var ar=.34,Ks={empty:0,low:.2,ok:.64};function Xa(i,r){let e=tr(i,r);if(e.unit==="now")return"just now";let t=e.unit==="minutes"?"minute":e.unit==="hours"?"hour":"day";return`${e.value} ${t}${e.value===1?"":"s"} ago`}function Lu(i){if(!i)return null;let r=new Date(i);return Number.isNaN(r.getTime())?null:r}var Iu=30;function Hu(i,r){let t=1-(i??0)/(Iu*r);return Math.max(Ks.ok,Math.min(1,t))}function Ou(i,r){let e=r>0?Math.max(0,Math.min(1,i/r)):0;return ar+(1-ar)*e}function Ws(i,r,e,t=new Date){let s=i===null?2:1,n=Lu(e?.fullAt??null),o=e?.portionsSinceFull??null,a=o!=null&&o>0?`, ${o} portion${o===1?"":"s"} since`:"",l=n?`Filled ${Xa(n,t)}${a}`:null;if(r===null)return{index:i,level:null,tone:"unknown",headline:"Unknown",fillFraction:null,detail:null};if(r==="low"||r==="empty")return{index:i,level:r,tone:r,headline:r==="low"?"Low":"Empty",fillFraction:Ks[r],detail:l};if(e?.portions!=null&&e.fullToLow!=null&&e.fullToLow>0){let{portions:u,fullToLow:h}=e,d=Math.round(u),f=`About ${d} portion${d===1?"":"s"} left`;return{index:i,level:r,tone:"ok",headline:`About ${d} left`,fillFraction:Ou(u,h),detail:n?`${f} \xB7 filled ${Xa(n,t)}`:f}}return n?{index:i,level:r,tone:"ok",headline:`Filled ${Fa(n,t)}`,fillFraction:Hu(o,s),detail:l}:{index:i,level:r,tone:"ok",headline:"Stocked",fillFraction:Ks.ok,detail:null}}function Qa(i){return i.index===null?"Hopper":`Hopper ${i.index}`}function Lt(i){if(!i||i.state==="unavailable"||i.state==="unknown")return null;let r=i.state.trim();return r.length>0?r:null}function ui(i,r,e){return i===1?r:i===2?e:null}function ct(i,r){if(i.index===null)return Qa(i);let e=r?.trim();return e||Qa(i)}function lr(i,r=null){let e=ct(i,r);if(i.tone==="unknown")return`${e}: level unknown`;let t=`${e}: ${i.headline}`;return i.detail?`${t}. ${i.detail}`:t}var Za={empty:0,low:1,ok:2};function Ja(i,r){return i==null||r==null?null:i+r}function Du(i,r,e,t){let s=[i,r].filter(l=>l!==null),n=s.length===0?null:s.reduce((l,u)=>Za[l]<=Za[u]?l:u);if(!e&&!t)return{level:n,remaining:null};let o=[e?.fullAt,t?.fullAt].filter(l=>typeof l=="string"),a=[e?.portionsSinceFull,t?.portionsSinceFull].filter(l=>typeof l=="number");return{level:n,remaining:{portions:Ja(e?.portions??null,t?.portions??null),fullAt:o.length?o.reduce((l,u)=>Date.parse(l)>=Date.parse(u)?l:u):null,portionsSinceFull:a.length?a.reduce((l,u)=>l+u,0):null,fullToLow:Ja(e?.fullToLow??null,t?.fullToLow??null)}}}function cr(i,r,e,t,s,n=new Date){if(!i)return[Ws(1,r,t,n),Ws(2,e,s,n)];let{level:o,remaining:a}=Du(r,e,t,s);return[Ws(null,o,a,n)]}var Fu={"choose-hopper":{start:"confirm-empty"},"confirm-empty":{"empty-confirmed":"collecting"},collecting:{capture:"collecting","review-full":"mark-full"},"mark-full":{"full-marked":"offer-inherit"},"offer-inherit":{"inherit-resolved":"done"},done:{restart:"choose-hopper"}};function Ae(i,r){return Fu[i][r]??i}function el(i){return i.some(r=>r.portions>0)}function tl(i,r){let e=i[i.length-1];return!e||r.score>=e.score?null:{previousPortions:e.portions,previousScore:e.score,newScore:r.score}}function hi(i){if(!i)return{kind:"never",inheritedFromDisplay:null,measuredAt:null,note:null,finished:!1};let r=typeof i.source=="object"?i.source.inherited_from:null;return{kind:r!==null?"inherited":"measured",inheritedFromDisplay:r!==null?r+1:null,measuredAt:i.measured_at,note:i.note||null,finished:i.full_portions!=null}}function il(i,r){if(!i||i.full_portions==null||i.full_score==null)return null;let e=[...i.points].sort((s,n)=>s.portions-n.portions),t=e[0];if(!t)return null;if(r<=t.score)return 0;if(r>=i.full_score)return 100;for(let s=1;s<e.length;s+=1){let n=e[s-1],o=e[s];if(r>o.score)continue;let a=o.score-n.score,l=a<=0?0:(r-n.score)/a,h=(n.portions+l*(o.portions-n.portions))/i.full_portions*100;return Math.max(0,Math.min(100,h))}return 100}function rl(i){return i?i.hoppers[0]??i.hoppers[1]??null:null}function sl(i,r){return i??(r?"1":"both")}var nl=300,ol=250,se=70,ne=160,ue=16,Re=116,dt=24,Bu=132,pr=160,Qs=150,fr=182,ul=72,ju=7,Zs=238,ur=5,Nu=6e4,Me={top:"#f0b774",mid:"#c9853f",deep:"#8e5424",hi:"#ffe1b8"},Ue={top:"#f6e7cc",mid:"#dcc19a",deep:"#b3916a",hi:"#fffaf0"},al={frosted:{name:"Frosted glass",body:["#1f2835","#141a23"],stroke:"#ffffff26",sheen:.1,chute:["#8b98a6","#4d5864"],bowl:["#262f3b","#11161d"],rim:"#c3ccd6",light:!1},ceramic:{name:"Soft ceramic",body:["#ffffff","#e7edf3"],stroke:"#1a253122",sheen:.45,chute:["#c9d2db","#9aa7b4"],bowl:["#ffffff","#dfe6ee"],rim:"#ffffff",light:!0}},dr={ok:"var(--kibble-feed, #43a96a)",low:"var(--kibble-amber-dark, #de8a3a)",empty:"var(--error-color, #db4437)",unknown:"var(--secondary-text-color, #8b98a6)"};function qu(i,r,e,t){let s=[0,120,240].map(n=>{let o=(n+t)*Math.PI/180;return D`<circle cx=${(i+Math.cos(o)*e*.55).toFixed(1)} cy=${(r+Math.sin(o)*e*.55).toFixed(1)} r=${(e*.62).toFixed(1)} />`});return D`<g>${s}</g>`}function Uu(){return D`
    <pattern id="tex-dot" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
      <circle cx="2" cy="2" r="1.2" fill="#000" opacity="0.13" />
      <circle cx="5.5" cy="5.5" r="1.2" fill="#fff" opacity="0.09" />
    </pattern>
    <pattern id="tex-fleck" width="11" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
      <path d="M1 2h4M7 6h3M2 7h2" stroke="#6b5234" stroke-width="1.3" stroke-linecap="round" opacity="0.28" />
      <path d="M6 1.5h2" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.35" />
    </pattern>
  `}function hr(i,r){return D`
    <linearGradient id=${i} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${r.top} />
      <stop offset="0.55" stop-color=${r.mid} />
      <stop offset="1" stop-color=${r.deep} />
    </linearGradient>
  `}function Vu(i,r,e,t,s,n,o){let a=t-r;return D`
    <rect x=${i} y=${r} width=${e} height=${a} fill="url(#${s})" />
    <rect x=${i} y=${r} width=${e} height=${a} fill="url(#${n})" />
    <rect x=${i} y=${r} width=${e} height="2" fill=${o} opacity="0.85" />
  `}function Wu(i,r){let e=r.length===1,t=r.map(s=>s.fraction>.01?Vu(s.x,ue+6+(Re-12)*(1-s.fraction),s.w,ue+Re,s.gradientId,s.textureId,s.food.hi):p);return D`
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
      ${Uu()}
      ${hr("hopper-food-1",Me)}
      ${hr("hopper-food-2",Ue)}
      <clipPath id="hopper-interior-clip">
        <rect x=${se+3} y=${ue+3} width=${ne-6} height=${Re-6} rx=${dt-3} />
      </clipPath>
      <filter id="hopper-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect x=${se} y=${ue+6} width=${ne} height=${Re} rx=${dt} fill="#000" opacity=${i.light?.08:.35} filter="url(#hopper-shadow-blur)" />
    <rect x=${se} y=${ue} width=${ne} height=${Re} rx=${dt} fill="url(#hopper-body)" />
    <g clip-path="url(#hopper-interior-clip)">
      ${t}
      <rect x=${se} y=${ue} width=${ne} height=${Re} fill="url(#hopper-inner-shadow)" />
    </g>
    ${e?p:D`<line x1=${se+ne/2} x2=${se+ne/2} y1=${ue+8} y2=${ue+Re-8} stroke=${i.light?"#1a253140":"#ffffff40"} stroke-width="2" stroke-linecap="round" />`}
    <rect x=${se} y=${ue} width=${ne} height=${Re} rx=${dt} fill="url(#hopper-sheen)" />
    <rect x=${se+.75} y=${ue+.75} width=${ne-1.5} height=${Re-1.5} rx=${dt} fill="none" stroke=${i.stroke} stroke-width="1.5" />
    <path d="M${se+dt} ${ue+1.5} H${se+ne-dt}" stroke="#fff" stroke-opacity=${i.light?.9:.18} stroke-width="1.2" stroke-linecap="round" />
  `}function Ku(i,r){let e=Bu,t=pr;return D`
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
  `}function hl(i){let r=Zs-ur,e=r-fr;return r-e*Math.max(0,Math.min(1,i))}function fl(){let i=Qs,r=fr,e=ul-ur,t=Zs-ur;return`M${i-e} ${r} C${i-e+2} ${r+37} ${i-38} ${t} ${i} ${t} C${i+38} ${t} ${i+e-2} ${r+37} ${i+e} ${r} Z`}function Gu(i,r,e){let t=Qs,s=fr,n=ul,o=ju,a=Zs,l=`M${t-n} ${s} C${t-n+2} ${s+40} ${t-42} ${a} ${t} ${a} C${t+42} ${a} ${t+n-2} ${s+40} ${t+n} ${s} Z`,u=a-ur,h=fl(),d=r==null?0:Math.max(0,Math.min(1,r)),f=Math.max(0,Math.min(1,e)),m=hl(d),b=n*2,v=d>.02,_=v&&f>.01,k=Math.max(0,1-f-.06).toFixed(3),R=Math.min(1,1-f+.06).toFixed(3);return D`
    <defs>
      ${hr("bowl-food-1",Me)}
      ${hr("bowl-food-2",Ue)}
      <clipPath id="bowl-interior-clip"><path d=${h} /></clipPath>
      <linearGradient id="bowl-wall" x1="0" x2="1">
        <stop offset="0" stop-color=${i.bowl[0]} stop-opacity="0.55" />
        <stop offset="0.2" stop-color="#fff" stop-opacity=${i.light?.5:.1} />
        <stop offset="0.45" stop-color=${i.bowl[1]} stop-opacity="0.25" />
        <stop offset="0.9" stop-color="#fff" stop-opacity=${i.light?.3:.06} />
        <stop offset="1" stop-color=${i.bowl[0]} stop-opacity="0.55" />
      </linearGradient>
      <linearGradient id="bowl-mix-gradient" x1="0" x2="1">
        <stop offset=${k} stop-color="#fff" stop-opacity="0" />
        <stop offset=${R} stop-color="#fff" stop-opacity="1" />
      </linearGradient>
      <mask id="bowl-mix-mask" maskContentUnits="userSpaceOnUse">
        <rect x=${t-n} y=${s-10} width=${b} height=${a-s+20} fill="url(#bowl-mix-gradient)" />
      </mask>
    </defs>
    <ellipse cx=${t} cy=${a+5} rx=${n*.7} ry="5" fill="#000" opacity=${i.light?.1:.4} />
    <path d=${h} fill=${i.light?"#e9eef3":"#0b0f15"} />
    <g clip-path="url(#bowl-interior-clip)">
      ${v?D`
            <rect x=${t-n} y=${m} width=${b} height=${u-m+2} fill="url(#bowl-food-1)" />
            <rect x=${t-n} y=${m} width=${b} height=${u-m+2} fill="url(#tex-dot)" />
            ${_?D`<g mask="url(#bowl-mix-mask)">
                  <rect x=${t-n} y=${m} width=${b} height=${u-m+2} fill="url(#bowl-food-2)" />
                  <rect x=${t-n} y=${m} width=${b} height=${u-m+2} fill="url(#tex-fleck)" />
                </g>`:p}
            <rect x=${t-n} y=${m} width=${b} height="2" fill="#fff" opacity="0.55" />
          `:p}
    </g>
    <path d=${l} fill="url(#bowl-wall)" stroke=${i.light?"#1a253126":"#ffffff30"} stroke-width="1.5" />
    <ellipse cx=${t} cy=${s} rx=${n} ry=${o} fill="none" stroke=${i.light?"#ffffff":i.rim} stroke-width="2.5" />
  `}function Yu(i){return i==="1"?[Me.mid,Me.top,Me.deep]:i==="2"?[Ue.mid,Ue.top,Ue.deep]:[Me.mid,Me.top,Ue.mid,Ue.top]}var ll=600,cl=[{dx:-1.3,rotationDeg:-10,phase:0},{dx:1.1,rotationDeg:14,phase:1/3},{dx:-.2,rotationDeg:4,phase:2/3}];function Xu(i,r,e,t,s){let n=r>=3?cl:cl.slice(0,2),o=(s-t).toFixed(1),a=n.map((l,u)=>{let d=`--fall-delay:${Math.round(l.phase*ll)}ms;--fall-duration:${ll}ms;--fall-to:${o}px;`;return D`<g class="pour-piece" style=${d} fill=${i[u%i.length]}>${qu(e+l.dx,t,3.6,l.rotationDeg)}</g>`});return D`
    <defs>
      <clipPath id="pour-clip">
        <rect x=${e-6} y=${pr-4} width="12" height=${fr-pr+4} />
        <path d=${fl()} />
      </clipPath>
    </defs>
    <g class="pour-pieces" clip-path="url(#pour-clip)">${a}</g>
  `}function dl(i,r,e){if(i==null)return"Bowl level unknown";let t=r??i*100;return e?`Bowl about ${Math.round(t)}% full`:`Bowl ${Math.round(t)}% full`}function pl(i,r,e){return i.length===1?`${ct(i[0],null)}: ${i[0].headline}`:i.map(t=>`${ct(t,ui(t.index,r,e))}: ${t.headline}`).join(", ")}function Qu(i,r,e){let t=ct(i,r),s=lr(i,r);return c`
    <button type="button" class="chip" data-tone=${i.tone} style=${`--chip-c:${dr[i.tone]}`} aria-label=${s} title=${i.detail??""} @click=${e}>
      <span class="chip-dot"></span>
      <span class="chip-name">${t}</span>
      <span class="chip-word">${i.headline}</span>
    </button>
  `}var Xs=class extends y{constructor(){super();this._wasFeeding=!1;this._dropping=!1;this.fill=null,this.hopperLevel1=null,this.hopperLevel2=null,this.hopperRemaining1=null,this.hopperRemaining2=null,this.singleHopper=!1,this.food1=null,this.food2=null,this.feeding=!1,this.portions=1,this.calibration=null,this.darkMode=!1,this.bowlMix=0,this.pourSource=null}static{this.properties={fill:{type:Number},hopperLevel1:{type:String},hopperLevel2:{type:String},hopperRemaining1:{attribute:!1},hopperRemaining2:{attribute:!1},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},feeding:{type:Boolean},portions:{type:Number},calibration:{attribute:!1},darkMode:{type:Boolean},bowlMix:{type:Number},pourSource:{attribute:!1},fillSource:{type:String}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._dropTimer)}_openHopperDetail(){this.dispatchEvent(new CustomEvent("hopper-detail-requested",{bubbles:!0,composed:!0}))}willUpdate(e){e.has("feeding")&&(this.feeding&&!this._wasFeeding?(clearTimeout(this._dropTimer),this._dropping=!0,this._dropTimer=setTimeout(()=>{this._dropping=!1,this.requestUpdate()},Nu)):!this.feeding&&this._wasFeeding&&this._dropping&&(clearTimeout(this._dropTimer),this._dropTimer=setTimeout(()=>{this._dropping=!1,this.requestUpdate()},900)),this._wasFeeding=this.feeding)}_compartments(e){if(e.length===1){let n=e[0];return[{x:se,w:ne,fraction:n.fillFraction??0,food:Me,gradientId:"hopper-food-1",textureId:"tex-dot",toneColor:dr[n.tone]}]}let[t,s]=e;return[{x:se,w:ne/2,fraction:t.fillFraction??0,food:Me,gradientId:"hopper-food-1",textureId:"tex-dot",toneColor:dr[t.tone]},{x:se+ne/2,w:ne/2,fraction:s.fillFraction??0,food:Ue,gradientId:"hopper-food-2",textureId:"tex-fleck",toneColor:dr[s.tone]}]}render(){let e=this.darkMode?al.frosted:al.ceramic,t=cr(this.singleHopper,this.hopperLevel1,this.hopperLevel2,this.hopperRemaining1,this.hopperRemaining2),s=this._compartments(t),n=this.fill==null?null:il(this.calibration,this.fill/100),o=this.fill==null?null:this.fill/100,a=sl(this.pourSource,this.singleHopper),l=Yu(a),u=pr-2,h=hl(o??0),d=this.fillSource==="estimate",f=`${pl(t,this.food1,this.food2)}. ${dl(o,n,d)}`;return c`
      <svg class="art" viewBox="0 0 ${nl} ${ol}" role="img" aria-label=${f} preserveAspectRatio="xMidYMid meet">
        <g class="hopper-scene">
          <title>${pl(t,this.food1,this.food2)}</title>
          ${Wu(e,s)}
        </g>
        ${Ku(e,this.feeding)}
        <g class="bowl-scene">
          <title>${dl(o,n,d)}</title>
          ${Gu(e,o,this.bowlMix)}
        </g>
        ${this._dropping&&!Ya()?Xu(l,this.portions,Qs,u,h):p}
      </svg>
      ${n!=null?c`<div class="calibrated" role="status">${Math.round(n)}% full <span class="raw">\u00b7 raw ${Math.round(this.fill)}</span></div>`:p}
      <div class="chips">${t.map(m=>Qu(m,ui(m.index,this.food1,this.food2),()=>this._openHopperDetail()))}</div>
    `}static{this.styles=x`
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
      aspect-ratio: ${nl} / ${ol};
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
  `}};customElements.define("kibble-bowl",Xs);function ml(i,r){return i>0&&r>0?{hopper:"both",amount:i,amount2:r}:i>0?{hopper:"1",amount:i}:r>0?{hopper:"2",amount:r}:null}function Js(i,r){if(!r)return null;let e=r.detection_areas_hash??"#detection-areas";if(i===e)return"detection-areas";let t=r.calibrate_hash??"#calibrate";return i===t?"calibrate":null}function bl(i,r,e=new Date){if(r)return 0;let t=(e.getTime()-432e5)/1e3;for(let s of i){if(s.kind!=="feed"||s.start<t)continue;let n=s.feed?.sides;if(!n||n.length===0)continue;let o=n.reduce((l,u)=>l+u.portions,0);if(o<=0)continue;return(n.find(l=>l.hopper===2)?.portions??0)/o}return 0}var mr={phase:"idle",elapsedMs:0},br={timeoutMs:1e4};function gl(){return{phase:"requesting",elapsedMs:0}}function vl(i,r,e){if(i.phase!=="requesting")return i;let t=i.elapsedMs+r;return t>=e.timeoutMs?{phase:"timeout",elapsedMs:e.timeoutMs}:{phase:"requesting",elapsedMs:t}}function _l(i,r){return r?{phase:"feeding",elapsedMs:0}:i.phase==="feeding"?mr:i}function en(){return mr}var tn=class extends y{static{this.properties={value:{type:String},options:{attribute:!1},groupLabel:{type:String,attribute:"group-label"},disabled:{type:Boolean},contentFit:{type:Boolean,attribute:"content-fit"}}}constructor(){super(),this.value="",this.options=[],this.groupLabel="",this.disabled=!1,this.contentFit=!1}render(){return c`
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
    `}_select(r){this.dispatchEvent(new CustomEvent("option-selected",{detail:{value:r},bubbles:!0,composed:!0}))}static{this.styles=x`
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
  `}};customElements.define("kibble-segmented-picker",tn);var rn=class extends y{static{this.properties={value:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.min=1,this.max=20,this.step=1,this.disabled=!1}render(){return c`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value<=this.min} @click=${this._decrement} aria-label="Fewer portions">
          &minus;
        </button>
        <span class="value">${this.value}</span>
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value>=this.max} @click=${this._increment} aria-label="More portions">
          &plus;
        </button>
      </div>
    `}_decrement(){this._emit(Math.max(this.min,this.value-this.step))}_increment(){this._emit(Math.min(this.max,this.value+this.step))}_emit(r){this.dispatchEvent(new CustomEvent("value-selected",{detail:{value:r},bubbles:!0,composed:!0}))}static{this.styles=x`
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
  `}};customElements.define("kibble-stepper",rn);var{I:Zu}=Ha,yl=i=>i;var wl=i=>i.strings===void 0,xl=()=>document.createComment(""),It=(i,r,e)=>{let t=i._$AA.parentNode,s=r===void 0?i._$AB:r._$AA;if(e===void 0){let n=t.insertBefore(xl(),s),o=t.insertBefore(xl(),s);e=new Zu(n,o,i,i.options)}else{let n=e._$AB.nextSibling,o=e._$AM,a=o!==i;if(a){let l;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(l=i._$AU)!==o._$AU&&e._$AP(l)}if(n!==s||a){let l=e._$AA;for(;l!==n;){let u=yl(l).nextSibling;yl(t).insertBefore(l,s),l=u}}}return e},Ve=(i,r,e=i)=>(i._$AI(r,e),i),Ju={},gr=(i,r=Ju)=>i._$AH=r,kl=i=>i._$AH,vr=i=>{i._$AR(),i._$AA.remove()};var _r={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},pt=i=>(...r)=>({_$litDirective$:i,values:r}),We=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,e,t){this._$Ct=r,this._$AM=e,this._$Ci=t}_$AS(r,e){return this.update(r,e)}update(r,e){return this.render(...e)}};var fi=(i,r)=>{let e=i._$AN;if(e===void 0)return!1;for(let t of e)t._$AO?.(r,!1),fi(t,r);return!0},yr=i=>{let r,e;do{if((r=i._$AM)===void 0)break;e=r._$AN,e.delete(i),i=r}while(e?.size===0)},Cl=i=>{for(let r;r=i._$AM;i=r){let e=r._$AN;if(e===void 0)r._$AN=e=new Set;else if(e.has(i))break;e.add(i),ih(r)}};function eh(i){this._$AN!==void 0?(yr(this),this._$AM=i,Cl(this)):this._$AM=i}function th(i,r=!1,e=0){let t=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(r)if(Array.isArray(t))for(let n=e;n<t.length;n++)fi(t[n],!1),yr(t[n]);else t!=null&&(fi(t,!1),yr(t));else fi(this,i)}var ih=i=>{i.type==_r.CHILD&&(i._$AP??=th,i._$AQ??=eh)},xr=class extends We{constructor(){super(...arguments),this._$AN=void 0}_$AT(r,e,t){super._$AT(r,e,t),Cl(this),this.isConnected=r._$AU}_$AO(r,e=!0){r!==this.isConnected&&(this.isConnected=r,r?this.reconnected?.():this.disconnected?.()),e&&(fi(this,r),yr(this))}setValue(r){if(wl(this._$Ct))this._$Ct._$AI(r,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=r,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var T=()=>new nn,nn=class{},sn=new WeakMap,P=pt(class extends xr{render(i){return p}update(i,[r]){let e=r!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=r,this.ht=i.options?.host,this.rt(this.ct=i.element)),p}rt(i){if(this.G!==void 0)if(this.isConnected||(i=void 0),typeof this.G=="function"){let r=this.ht??globalThis,e=sn.get(r);e===void 0&&(e=new WeakMap,sn.set(r,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,i),i!==void 0&&this.G.call(this.ht,i)}else this.G.value=i}get lt(){return typeof this.G=="function"?sn.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var mi={phase:"idle",elapsedMs:0,firedStages:[],releaseProgress:0},wr={durationMs:1500,stageThresholds:[.33,.66,.86],nearCompleteAt:.88,drainMs:300};function $l(){return{phase:"charging",elapsedMs:0,firedStages:[],releaseProgress:0}}function Sl(i,r,e){if(i.phase==="charging"){let t=i.elapsedMs+r;return t>=e.durationMs?{phase:"completed",elapsedMs:e.durationMs,firedStages:i.firedStages,releaseProgress:0}:{...i,elapsedMs:t}}if(i.phase==="draining"){let t=i.elapsedMs+r;return t>=e.drainMs?mi:{...i,elapsedMs:t}}return i}function El(i,r){if(i.phase!=="charging")return i;let e=Math.min(1,i.elapsedMs/r.durationMs);return{phase:"draining",elapsedMs:0,firedStages:[],releaseProgress:e}}function kr(i,r){if(i.phase==="idle")return 0;if(i.phase==="completed")return 1;if(i.phase==="charging")return Math.min(1,i.elapsedMs/r.durationMs);let e=r.drainMs>0?Math.min(1,i.elapsedMs/r.drainMs):1;return i.releaseProgress*(1-e)}function Tl(i,r){return i.phase!=="charging"?!1:kr(i,r)>=r.nearCompleteAt}function Pl(i,r){if(i.phase!=="charging")return[];let e=kr(i,r),t=[];return r.stageThresholds.forEach((s,n)=>{e>=s&&!i.firedStages.includes(n)&&t.push(n)}),t}function Al(i,r){return r.length===0?i:{...i,firedStages:[...i.firedStages,...r]}}function oe(i){typeof window>"u"||window.dispatchEvent(new CustomEvent("haptic",{detail:i}))}var rh=600,sh=260,nh=450,bi=6,Ml=["#34d3c3","#9b87f5","#f7c948"];function oh(i){let r=1-i;return 1-r*r*r}var on=class extends y{constructor(){super();this._holdState=mi;this._config=wr;this._pointerId=null;this._rafId=null;this._lastFrameMs=0;this._reducedMotion=!1;this._completed=!1;this._buttonRef=T();this._tapFlashRef=T();this._shockRef=T();this._ringRef=T();this._triangle1Ref=T();this._triangle2Ref=T();this._dotRefs=Array.from({length:8},()=>T());this._onPointerDown=e=>{if(this.disabled||this._holdState.phase==="charging")return;e.preventDefault();let t=e.currentTarget;try{t.setPointerCapture(e.pointerId),this._pointerId=e.pointerId}catch{}this._begin()};this._onPointerUp=e=>{this._pointerId!==null&&e.pointerId!==this._pointerId||this._release()};this._onKeyDown=e=>{e.key!==" "&&e.key!=="Enter"||e.repeat||this.disabled||this._holdState.phase==="charging"||(e.preventDefault(),this._begin())};this._onKeyUp=e=>{e.key!==" "&&e.key!=="Enter"||this._release()};this._onBlur=()=>{this._release()};this._suppressOsGesture=e=>{e.preventDefault()};this._tapActivate=()=>{this.disabled||(this._prefersReducedMotion()||this._playTapPulse(),this._activate())};this._chargeFrame=e=>{let t=Math.min(48,e-this._lastFrameMs);this._lastFrameMs=e;let s=this._holdState.phase;this._holdState=Sl(this._holdState,t,this._config);let n=Pl(this._holdState,this._config);if(n.length>0&&(this._holdState=Al(this._holdState,n),this._onStagesCrossed()),this._paintProgress(this._displayProgress()),s!=="completed"&&this._holdState.phase==="completed"){this._onCompleted();return}this._holdState.phase==="charging"||this._holdState.phase==="draining"?this._rafId=requestAnimationFrame(this._chargeFrame):(this._rafId=null,this.requestUpdate())};this.label="Hold to feed",this.variant="feed",this.disabled=!1,this.holdMs=1500,this.pending=!1}static{this.properties={label:{type:String},variant:{type:String},disabled:{type:Boolean},holdMs:{type:Number,attribute:"hold-ms"},pending:{type:Boolean}}}disconnectedCallback(){super.disconnectedCallback(),this._stopChargeLoop(),clearTimeout(this._settleTimer),clearTimeout(this._staticGlowTimer),this._holdState=mi,this._pointerId=null}firstUpdated(){this._paintProgress(0)}updated(e){e.has("disabled")&&this.disabled&&this._release(),e.has("holdMs")&&(this._config={...wr,durationMs:this._duration()})}_duration(){return Number.isFinite(this.holdMs)&&this.holdMs>0?this.holdMs:1500}_prefersReducedMotion(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0}_emblemTemplate(){let e=this._dotRefs.map((t,s)=>{let n=s/this._dotRefs.length*Math.PI*2,o=(24+Math.cos(n)*21).toFixed(2),a=(24+Math.sin(n)*21).toFixed(2);return D`<circle ${P(t)} class="dot" cx=${o} cy=${a} r="1.8"></circle>`});return D`
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
                  <span class="label-check" aria-hidden="true">${g("check")}</span>
                </span>
              `:c`<span class="tap-flash" ${P(this._tapFlashRef)} aria-hidden="true"></span>
                <span class="label"><span class="label-text">${this.label}</span></span>`}
        </button>
      </div>
    `}_begin(){this._reducedMotion=this._prefersReducedMotion(),this._config={...wr,durationMs:this._duration()},this._holdState=$l(),this._completed=!1,clearTimeout(this._settleTimer),this.requestUpdate(),this._paintProgress(0),this._lastFrameMs=performance.now(),this._stopChargeLoop(),this._rafId=requestAnimationFrame(this._chargeFrame)}_release(){this._releasePointerCapture(),this._pointerId=null,this._holdState.phase==="charging"&&(this._holdState=El(this._holdState,this._config),this.requestUpdate())}_releasePointerCapture(){let e=this._pointerId,t=this._buttonRef.value;if(!(e===null||!t))try{t.hasPointerCapture(e)&&t.releasePointerCapture(e)}catch{}}_playTapPulse(){let e=this._buttonRef.value,t=this._tapFlashRef.value;e?.classList.remove("tap-pulse"),t?.classList.remove("flash-pulse"),e?.offsetWidth,e?.classList.add("tap-pulse"),t?.classList.add("flash-pulse")}_activate(){this.dispatchEvent(new CustomEvent("activate",{bubbles:!0,composed:!0}))}_stopChargeLoop(){this._rafId!=null&&cancelAnimationFrame(this._rafId),this._rafId=null}_displayProgress(){let e=kr(this._holdState,this._config);if(this._holdState.phase!=="draining"||this._config.drainMs<=0)return e;let t=this._holdState.releaseProgress;if(t<=0)return 0;let s=Math.min(1,this._holdState.elapsedMs/this._config.drainMs);return t*(1-oh(s))}_tierColor(e){let t=0;for(let s of this._config.stageThresholds)e>=s&&(t+=1);return Ml[Math.min(t,Ml.length-1)]}_paintProgress(e){let t=this._buttonRef.value;if(!t)return;let s=Math.max(0,Math.min(1,e)),n=this._tierColor(s);t.style.setProperty("--p",s.toFixed(4)),t.style.setProperty("--c",n);let o=Tl(this._holdState,this._config)&&!this._reducedMotion;t.classList.toggle("tense",o);let a=(u,h)=>Math.max(0,Math.min(1,(s-u)/(h-u))),l=u=>(100-u*100).toFixed(2);this._ringRef.value?.setAttribute("stroke-dashoffset",l(a(0,.45))),this._triangle1Ref.value?.setAttribute("stroke-dashoffset",l(a(.3,.7))),this._triangle2Ref.value?.setAttribute("stroke-dashoffset",l(a(.6,.95))),this._dotRefs.forEach((u,h)=>{u.value?.classList.toggle("lit",s>=(h+1)/(this._dotRefs.length+1))})}_onStagesCrossed(){oe("light"),this._pulseShock(!1)}_pulseShock(e){let t=this._shockRef.value;if(t){if(clearTimeout(this._staticGlowTimer),t.classList.remove("go","static"),t.classList.toggle("complete",e),t.offsetWidth,this._reducedMotion){t.classList.add("static"),this._staticGlowTimer=window.setTimeout(()=>t.classList.remove("static","complete"),e?nh:sh);return}t.classList.add("go")}}_onCompleted(){this._releasePointerCapture(),this._pointerId=null,this._completed=!0,this.requestUpdate(),oe("success"),this._pulseShock(!0),this._activate(),this._settleTimer=window.setTimeout(()=>{this._completed=!1,this._holdState=mi,this._paintProgress(0),this.requestUpdate()},rh)}static{this.styles=x`
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
      left: ${bi}px;
      top: 50%;
      transform: translateY(-50%);
      width: calc(var(--kibble-feed-button-height, 56px) - ${bi*2}px);
      height: calc(var(--kibble-feed-button-height, 56px) - ${bi*2}px);
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
      padding-left: calc(${bi}px + (var(--kibble-feed-button-height, 56px) - ${bi*2}px) + 8px);
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
  `}};customElements.define("kibble-hold-button",on);var Ll={time:"12:00",amount_l:1,amount_r:0},an=class extends y{constructor(){super();this._openNew=()=>{this._error=null,this._confirmRemove=!1,this._draft={...Ll},this._target="new"};this._closeForm=()=>{this._target=null,this._confirmRemove=!1};this._onTimeInput=e=>{this._draft={...this._draft,time:e.target.value}};this._onSubmit=e=>{e.preventDefault(),this._save()};this.entries=[],this.food1=null,this.food2=null,this._target=null,this._draft={...Ll},this._confirmRemove=!1,this._busy=!1,this._error=null,this._toggling=new Set}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},deviceId:{type:String},food1:{type:String},food2:{type:String},_target:{state:!0},_draft:{state:!0},_confirmRemove:{state:!0},_busy:{state:!0},_error:{state:!0},_toggling:{state:!0}}}willUpdate(e){e.has("entries")&&this._target!==null&&this._target!=="new"&&!this.entries.some(t=>t.id===this._target)&&this._closeForm()}render(){let e=rr(this.entries);return c`
      ${this._error?c`<p class="error" role="alert">${this._error}</p>`:p}
      ${e.length===0&&this._target!=="new"?c`<p class="empty">No feeds scheduled</p>`:p}
      <ul class="entries">
        ${e.map(t=>c`<li>${this._target===t.id?this._renderForm(t):this._renderRow(t)}</li>`)}
      </ul>
      ${this._target==="new"?c`<div class="form-slot">${this._renderForm(null)}</div>`:c`
            <button type="button" class="add" ?disabled=${this._busy||!this.deviceId} @click=${this._openNew}>
              <span class="add-icon">${g("plus")}</span><span>Add feed</span>
            </button>
          `}
    `}_renderRow(e){let t=`${Ne(e.time)}, ${pi(e,!1,this.food1,this.food2)}, ${e.enabled?"on":"paused"}`;return c`
      <div class="row ${e.enabled?"":"paused"}">
        <button type="button" class="row-main" aria-label="Edit feed: ${t}" ?disabled=${this._busy} @click=${()=>this._openEdit(e)}>
          <span class="time">${Ne(e.time)}</span>
          ${this._renderAmount(lt(1,this.food1),e.amount_l)} ${this._renderAmount(lt(2,this.food2),e.amount_r)}
        </button>
        <button
          type="button"
          class="switch ${e.enabled?"on":""}"
          role="switch"
          aria-checked=${e.enabled}
          aria-label="${Ne(e.time)} feed ${e.enabled?"on":"paused"}"
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
    `}_renderForm(e){if(e&&this._confirmRemove)return this._renderRemoveConfirm(e);let t=this._draft,s=Us(t),n=lt(1,this.food1),o=lt(2,this.food2);return c`
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
            .max=${di}
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
            .max=${di}
            aria-label="${o} portions"
            ?disabled=${this._busy}
            @value-selected=${a=>this._setAmount("amount_r",a)}
          ></kibble-stepper>
        </div>
        ${s?c`<p class="hint" role="status">${s}</p>`:p}
        <div class="actions">
          ${e?c`<button type="button" class="btn danger-text" ?disabled=${this._busy} @click=${()=>this._confirmRemove=!0}>
                <span class="btn-icon">${g("deleteOutline")}</span><span>Remove</span>
              </button>`:p}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${this._busy} @click=${this._closeForm}>Cancel</button>
          <button type="submit" class="btn primary" ?disabled=${this._busy||s!==null}>${this._busy?"Saving\u2026":"Save"}</button>
        </div>
      </form>
    `}_renderRemoveConfirm(e){return c`
      <div class="form" role="alertdialog" aria-label="Remove this feed?">
        <h3>Remove the ${Ne(e.time)} feed?</h3>
        <p class="confirm-text">
          ${pi(e,!1,this.food1,this.food2)} will no longer be given at that time. This cannot be undone.
        </p>
        <div class="actions">
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${this._busy} @click=${()=>this._confirmRemove=!1}>Keep</button>
          <button type="button" class="btn danger" ?disabled=${this._busy} @click=${()=>this._remove(e)}>
            ${this._busy?"Removing\u2026":"Remove feed"}
          </button>
        </div>
      </div>
    `}_openEdit(e){this._error=null,this._confirmRemove=!1,this._draft={time:e.time.padStart(5,"0"),amount_l:e.amount_l,amount_r:e.amount_r},this._target=e.id}_setAmount(e,t){t.stopPropagation(),this._draft={...this._draft,[e]:t.detail.value}}async _run(e,t){this._error=null,this._busy=!0;try{return await t(),!0}catch(s){return this._error=`${e}: ${Vs(s)}`,!1}finally{this._busy=!1}}async _save(){let e=this._target;if(e===null||Us(this._draft)!==null)return;let t=this.deviceId;if(!t){this._error="Could not save the feed: the feeder was not found";return}let s=this._draft;await this._run("Could not save the feed",()=>e==="new"?this.hass.callService("kibble","schedule_add",ja(t,s)):this.hass.callService("kibble","schedule_set",{device_id:t,entries:Na(this.entries,e,s)}))&&(oe("success"),this._closeForm())}async _remove(e){let t=this.deviceId;if(!t){this._error="Could not remove the feed: the feeder was not found";return}await this._run("Could not remove the feed",()=>this.hass.callService("kibble","schedule_remove",{device_id:t,entry_id:e.id}))&&this._closeForm()}async _toggle(e){let t=this.deviceId;if(t){this._error=null,this._toggling=new Set(this._toggling).add(e.id);try{await this.hass.callService("kibble","schedule_set_enabled",{device_id:t,entry_id:e.id,enabled:!e.enabled})}catch(s){this._error=`Could not ${e.enabled?"pause":"turn on"} the feed: ${Vs(s)}`}finally{let s=new Set(this._toggling);s.delete(e.id),this._toggling=s}}}static{this.styles=x`
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
  `}};customElements.define("kibble-schedule-editor",an);var ln="dispenser-schedule-card",cn=class extends y{constructor(){super();this._embedRef=T();this._configureEmbed=e=>{if(!e||!this.scheduleCardStateEntity)return;let t=e.querySelector(ln);if(t){t.hass=this.hass;return}let s=document.createElement(ln);s.setConfig({type:"custom:dispenser-schedule-card",device:{type:"custom",entity:this.scheduleCardStateEntity,max_entries:24,min_amount:1,max_amount:20,step_amount:1,status_map:["0 -> dispensed","1 -> failed","2 -> pending","3 -> dispensing"],status_pattern:"(?<id>[^,]+),(?<hour>[0-9]{1,2}),(?<minute>[0-9]{1,2}),(?<amount>[0-9]{1,2}),(?<status>[0-9]);?",actions:{add:"kibble.schedule_card_add",edit:"kibble.schedule_card_edit",remove:"kibble.schedule_card_remove",toggle:"kibble.schedule_card_toggle"}},unit_of_measurement:{one:"portion",other:"portions"}}),s.hass=this.hass,e.appendChild(s)};this.entries=[],this.singleHopper=!1,this.food1=null,this.food2=null}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},scheduleCardStateEntity:{type:String},singleHopper:{type:Boolean},deviceId:{type:String},food1:{type:String},food2:{type:String}}}updated(){this._embedRef.value&&this.hass&&(this._embedRef.value.hass=this.hass)}render(){if(!this.singleHopper)return c`<kibble-schedule-editor
        .hass=${this.hass}
        .entries=${this.entries}
        .deviceId=${this.deviceId}
        .food1=${this.food1}
        .food2=${this.food2}
      ></kibble-schedule-editor>`;if(this._canEmbed())return c`<div ${P(this._configureEmbed)}></div>`;if(this.entries.length===0)return c`<p class="empty">No schedule set</p>`;let e=rr(this.entries);return c`
      <ul class="entries">
        ${e.map(t=>c`
            <li class=${t.enabled?"":"disabled"}>
              <span class="time">${Ne(t.time)}</span>
              <span class="amounts">${pi(t,!0)}</span>
              <span class="state">${t.enabled?"On":"Paused"}</span>
            </li>
          `)}
      </ul>
    `}_canEmbed(){if(!customElements.get(ln)||!this.scheduleCardStateEntity)return!1;let e=this.hass?.states[this.scheduleCardStateEntity];return e!==void 0&&e.state!=="unavailable"}static{this.styles=x`
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
  `}};customElements.define("kibble-schedule-body",cn);var dn=class extends y{constructor(){super();this._expanded=!1;this.entries=[],this.deviceName="Kibble",this.singleHopper=!1,this.food1=null,this.food2=null}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},scheduleCardStateEntity:{type:String},deviceName:{type:String},singleHopper:{type:Boolean},deviceId:{type:String},food1:{type:String},food2:{type:String}}}render(){let e=new Date,t=Ba(this.entries,e);return c`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${t}</span>
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
          </div>`:p}
    `}_toggle(){this._expanded=!this._expanded,this.requestUpdate()}static{this.styles=x`
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
  `}};customElements.define("kibble-schedule-summary",dn);var ah="calibration_busy";function pn(i){return`${i} portion${i===1?"":"s"}`}function Cr(i){return String(Math.round(i*100))}var un=class extends y{constructor(){super();this._closeButtonRef=T();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&this._close()};this._loadCalibration=()=>{let e=this.hass?.callWS,t=this.entryId;if(!e||!t){this._loadError="Not connected.";return}this._loading=!0,this._loadError=null,e({type:"kibble/calibration",entry_id:t}).then(s=>{this._calibration=s,this._loading=!1},s=>{this._loadError=j(s),this._loading=!1})};this._confirmEmpty=()=>{if(this._hopper===null)return;let e=this._hopper,t=this._note.trim();this._runAction({action:"begin",hopper:e,...t?{note:t}:{}},this._confirmEmpty,()=>{this._runAction({action:"point",hopper:e,portions:0},this._confirmEmpty,s=>{this._calibration=s,this._regression=null,this._step=Ae(this._step,"empty-confirmed")})})};this._capturePoint=()=>{if(this._hopper===null)return;let e=this._hopper,t=this._hopperData(e)?.points??[],s=(t[t.length-1]?.portions??0)+1;this._runAction({action:"point",hopper:e,portions:s},this._capturePoint,n=>{let o=n.hoppers[e]?.points.find(a=>a.portions===s);this._regression=o?tl(t,o):null,this._calibration=n,this._step=Ae(this._step,"capture")})};this._confirmMarkFull=()=>{if(this._hopper===null||this._markFullPortions===null)return;let e=this._hopper,t=this._markFullPortions;this._runAction({action:"full",hopper:e,portions:t},this._confirmMarkFull,s=>{this._calibration=s,this._step=this.singleHopper?"done":Ae(this._step,"full-marked")})};this._acceptInherit=()=>{if(this._hopper===null)return;let e=this._hopper,t=e===0?1:0;this._runAction({action:"inherit",hopper:t,from:e},this._acceptInherit,s=>{this._calibration=s,this._inheritedTo=t,this._step=Ae(this._step,"inherit-resolved")})};this._runClear=()=>{if(this._hopper===null)return;let e=this._hopper;this._runAction({action:"clear",hopper:e},this._runClear,t=>{this._calibration=t})};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.singleHopper=!1,this.food1=null,this.food2=null,this.entryId=void 0,this._resetWizard()}static{this.properties={hass:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},_step:{state:!0},_hopper:{state:!0},_calibration:{state:!0},_loading:{state:!0},_loadError:{state:!0},_note:{state:!0},_busy:{state:!0},_error:{state:!0},_waitingForBowl:{state:!0},_regression:{state:!0},_markFullPortions:{state:!0},_clearConfirmArmed:{state:!0},_inheritedTo:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),clearTimeout(this._clearConfirmTimer)}updated(e){e.has("open")&&this.open&&(this._resetWizard(),this._closeButtonRef.value?.focus(),this._loadCalibration())}_resetWizard(){this._step="choose-hopper",this._hopper=null,this._calibration=null,this._loading=!1,this._loadError=null,this._note="",this._busy=!1,this._error=null,this._waitingForBowl=!1,this._regression=null,this._markFullPortions=null,this._clearConfirmArmed=!1,this._inheritedTo=null}_hopperData(e){return e===null||!this._calibration?null:this._calibration.hoppers[e]}_runAction(e,t,s){let n=this.hass?.callWS,o=this.entryId;!n||!o||(this._busy=!0,this._error=null,this._waitingForBowl=!1,n({type:"kibble/calibration/action",entry_id:o,...e}).then(a=>{this._busy=!1,s(a),this.dispatchEvent(new CustomEvent("calibration-changed",{bubbles:!0,composed:!0}))},a=>{if(this._busy=!1,a?.code===ah){this._waitingForBowl=!0;return}this._error={message:j(a),retry:t}}))}_selectHopper(e){this._hopper=e,this._error=null}_beginRequested(){this._note="",this._step=Ae(this._step,"start")}_reviewFull(){this._markFullPortions=null,this._step=Ae(this._step,"review-full")}_declineInherit(){this._inheritedTo=null,this._step=Ae(this._step,"inherit-resolved")}_clearRequested(){if(this._clearConfirmArmed){clearTimeout(this._clearConfirmTimer),this._clearConfirmArmed=!1,this._runClear();return}this._clearConfirmArmed=!0,this._clearConfirmTimer=setTimeout(()=>{this._clearConfirmArmed=!1},3e3)}_restart(){let e=this._hopper===0?1:this._hopper===1?0:null;this._step=Ae(this._step,"restart"),this._hopper=e,this._note="",this._markFullPortions=null,this._regression=null,this._inheritedTo=null,this._clearConfirmArmed=!1}render(){return this.open?c`
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
    `}_renderHopperRow(e){let t=hi(this._hopperData(e));return c`
      <button type="button" class="hopper-row ${this._hopper===e?"selected":""}" @click=${()=>this._selectHopper(e)}>
        <span class="hopper-row-label">${this._hopperRowLabel(e)}</span>
        <span class="hopper-row-status">${this._statusLine(t)}</span>
        ${t.note?c`<span class="hopper-row-note">${t.note}</span>`:p}
      </button>
    `}_statusLine(e){if(e.kind==="never")return"Never calibrated";let t=e.measuredAt?Rt(new Date(e.measuredAt*1e3),new Date):null,s=e.finished?"":" (unfinished)";return e.kind==="inherited"?`Inherited from Hopper ${e.inheritedFromDisplay}${t?` \xB7 ${t}`:""}${s}`:`Measured${t?` ${t}`:""}${s}`}_renderHopperActions(e){let t=hi(this._hopperData(e)),s=this._hopperLabel(e);return t.kind==="never"?c`<button type="button" class="primary" @click=${()=>this._beginRequested()}>Calibrate ${s}</button>`:c`
      <div class="hopper-actions">
        <button type="button" class="danger ${this._clearConfirmArmed?"confirming":""}" ?disabled=${this._busy} @click=${()=>this._clearRequested()}>
          ${this._clearConfirmArmed?"Tap again to clear":"Clear calibration"}
        </button>
        <button type="button" class="primary" @click=${()=>this._beginRequested()}>Recalibrate ${s}</button>
      </div>
      ${this._renderError()}
    `}_renderConfirmEmpty(){let e=this._hopper;if(e===null)return p;let t=this._hopperLabel(e),s=hi(this._hopperData(e)).kind!=="never";return c`
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
            This step's score (${Cr(this._regression.newScore)}) is lower than the previous step's (${Cr(this._regression.previousScore)}). A
            curve that dips can't be interpolated. Recapture this step before continuing.
          </div>`:p}
      ${this._waitingForBowl?this._renderWaitingForBowl():p}
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy||!el(t)} @click=${()=>this._reviewFull()}>This is full</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._capturePoint}>${this._busy?"Capturing\u2026":"Capture reading"}</button>
      </div>
    `}_renderCurve(e){return e.length===0?p:c`
      <ul class="curve">
        ${e.map((t,s)=>{let n=s>0?e[s-1]:null,o=n!==null&&t.score<n.score;return c`
            <li class="curve-row ${o?"dropped":""}">
              <span>${pn(t.portions)}</span>
              <span class="score">${Cr(t.score)}</span>
            </li>
          `})}
      </ul>
    `}_renderMarkFull(){let e=this._hopper;if(e===null)return p;let t=(this._hopperData(e)?.points??[]).filter(s=>s.portions>0);return c`
      <p class="hint">Which step looked full?</p>
      <ul class="curve selectable">
        ${t.map(s=>c`
            <li>
              <button type="button" class="curve-choice ${this._markFullPortions===s.portions?"selected":""}" @click=${()=>this._markFullPortions=s.portions}>
                <span>${pn(s.portions)}</span>
                <span class="score">${Cr(s.score)}</span>
              </button>
            </li>
          `)}
      </ul>
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy||this._markFullPortions===null} @click=${this._confirmMarkFull}>
          ${this._busy?"Saving\u2026":this._markFullPortions===null?"Mark full":`Mark full at ${pn(this._markFullPortions)}`}
        </button>
      </div>
    `}_renderOfferInherit(){let e=this._hopper;if(e===null)return p;let t=e===0?1:0,s=hi(this._hopperData(t)).kind!=="never";return c`
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
    `:p}static{this.styles=x`
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
  `}};customElements.define("kibble-calibration-dialog",un);function ut(i){return Math.min(1,Math.max(0,i))}function Le(i,r,e){return e.width<=0||e.height<=0?{x:0,y:0}:{x:ut((i-e.left)/e.width),y:ut((r-e.top)/e.height)}}function gi(i,r){return[Math.min(i.x,r.x),Math.min(i.y,r.y),Math.max(i.x,r.x),Math.max(i.y,r.y)]}function Ke(i){return Math.max(0,i[2]-i[0])}function Ht(i){return Math.max(0,i[3]-i[1])}function Il(i,r=.01){return Ke(i)>=r&&Ht(i)>=r}function $r(i){if(!Array.isArray(i)||i.length!==4)return null;let r=i.map(Number);if(r.some(t=>!Number.isFinite(t)))return null;let e=[r[0],r[1],r[2],r[3]];return e.some(t=>t<0||t>1)||Ke(e)<=0||Ht(e)<=0?null:e}function hn(i){return Array.isArray(i)?i.flatMap(r=>{let e=$r(r);return e?[e]:[]}):[]}var Hl=["nw","n","ne","e","se","s","sw","w"];function Sr(i,r){let[e,t,s,n]=i,o=(e+s)/2,a=(t+n)/2;switch(r){case"nw":return{x:e,y:t};case"n":return{x:o,y:t};case"ne":return{x:s,y:t};case"e":return{x:s,y:a};case"se":return{x:s,y:n};case"s":return{x:o,y:n};case"sw":return{x:e,y:n};case"w":return{x:e,y:a}}}var fn=.02;function mn(i,r,e,t=fn){let[s,n,o,a]=i,l=ut(e.x),u=ut(e.y);return(r==="nw"||r==="w"||r==="sw")&&(s=Math.min(l,o-t)),(r==="ne"||r==="e"||r==="se")&&(o=Math.max(l,s+t)),(r==="nw"||r==="n"||r==="ne")&&(n=Math.min(u,a-t)),(r==="sw"||r==="s"||r==="se")&&(a=Math.max(u,n+t)),[s,n,o,a]}function vi(i,r,e){let t=Ke(i),s=Ht(i),n=Math.min(Math.max(i[0]+r,0),Math.max(0,1-t)),o=Math.min(Math.max(i[1]+e,0),Math.max(0,1-s));return[n,o,n+t,o+s]}var Ge=[1/3,2/3,2/3,1];function Er(i){return String(Math.round(i*1e4)/100)+"%"}function Pr(i){return{left:Er(i[0]),top:Er(i[1]),width:Er(i[2]-i[0]),height:Er(i[3]-i[1])}}function Ot(i,r){let e=r[2]-r[0],t=r[3]-r[1];if(e<=0||t<=0||i[2]<=i[0]||i[3]<=i[1])return null;let s=Math.max(i[0],r[0]),n=Math.max(i[1],r[1]),o=Math.min(i[2],r[2]),a=Math.min(i[3],r[3]);return o<=s||a<=n?null:[(s-r[0])/e,(n-r[1])/t,(o-r[0])/e,(a-r[1])/t]}function Tr(i,r,e){return Math.min(e,Math.max(r,i))}function lh(i,r,e){return i.left<r.left+r.width+e&&i.left+i.width+e>r.left&&i.top<r.top+r.height+e&&i.top+i.height+e>r.top}function Ol(i,r,e,t=4,s=0){let n=Math.max(0,s),o=[...i].sort((l,u)=>l.box[0]+l.box[2]-(u.box[0]+u.box[2])),a=[];for(let l of o){let u=l.height??22,h=Math.max(0,r-l.width),d=Math.max(0,e-u),f=l.box[0]*r,m=l.box[1]*e,b=m-u-t<n,v=Tr(f,0,h),_=Math.max(m+t,n),k=Tr(b?_:m-u-t,0,d),R=new Set([v,0,h]);for(let w of a)R.add(Tr(w.left+w.width+t,0,h)),R.add(Tr(w.left-l.width-t,0,h));let z=[...R].sort((w,E)=>Math.abs(w-v)-Math.abs(E-v)),M=[k],V=u+t;for(let w=V;w<=e;w+=V){let E=k+w,I=k-w;E<=d&&M.push(E),I>=(b?_:n)&&M.push(I)}let Y;for(let w of M){for(let E of z){let I={key:l.key,left:E,top:w,flipped:b,width:l.width,height:u};if(!a.some(N=>lh(I,N,t))){Y=I;break}}if(Y)break}a.push(Y??{key:l.key,left:v,top:k,flipped:b,width:l.width,height:u})}return a.map(({key:l,left:u,top:h,flipped:d})=>({key:l,left:u,top:h,flipped:d}))}var ch=1e3,Ar=.01,dh=50,ph={nw:"nwse-resize",n:"ns-resize",ne:"nesw-resize",e:"ew-resize",se:"nwse-resize",s:"ns-resize",sw:"nesw-resize",w:"ew-resize"},bn=class extends y{constructor(){super();this._imageRef=T();this._cancelRef=T();this._imageUrl=null;this._imagePath=null;this._objectUrl=null;this._masks=[];this._bowl=Ge;this._baseline=null;this._selected=null;this._hidden=new Set;this._undoStack=[];this._drawStart=null;this._drawing=null;this._pointerId=null;this._edit=null;this._showDetections=!1;this._visionFrame=null;this._visionTimer=void 0;this._confirmDiscard=!1;this._loading=!1;this._saving=!1;this._error=null;this._loadGeneration=0;this._onImageLoad=()=>{this.requestUpdate()};this._pollVision=()=>{let e=this.hass?.callWS,t=this.entryId;!e||!t||e({type:"kibble/vision/last",entry_id:t}).then(s=>{this._visionFrame=s.frame,this.requestUpdate()},()=>{})};this._toggleDetections=()=>{this._showDetections=!this._showDetections,this._showDetections?(this._pollVision(),this._visionTimer=setInterval(this._pollVision,ch)):this._stopVisionPolling(),this.requestUpdate()};this._onStagePointerDown=e=>{if(this._saving||e.button!==0)return;let t=this._imageRef.value;if(!t)return;let s=Le(e.clientX,e.clientY,t.getBoundingClientRect());this._selected=null,this._drawStart=s,this._drawing=[s.x,s.y,s.x,s.y],this._pointerId=e.pointerId,e.currentTarget.setPointerCapture(e.pointerId),e.preventDefault(),this.requestUpdate()};this._onStageMove=e=>{if(this._pointerId!==e.pointerId||!this._drawStart)return;let t=this._imageRef.value;if(!t)return;let s=Le(e.clientX,e.clientY,t.getBoundingClientRect());this._drawing=gi(this._drawStart,s),this.requestUpdate()};this._onStageUp=e=>{if(this._pointerId!==e.pointerId||!this._drawStart)return;let t=this._imageRef.value;if(t){let s=Le(e.clientX,e.clientY,t.getBoundingClientRect()),n=gi(this._drawStart,s);Il(n)&&(this._pushUndo(),this._masks=[...this._masks,n],this._selected={kind:"mask",index:this._masks.length-1})}this._finishStageDraw(e)};this._onStageCancel=e=>{this._pointerId===e.pointerId&&this._finishStageDraw(e)};this._beginMove=(e,t)=>{if(this._saving||e.button!==0)return;e.stopPropagation();let s=this._imageRef.value;if(!s)return;this._pushUndo(),this._selected=t;let n=Le(e.clientX,e.clientY,s.getBoundingClientRect());this._edit={pointerId:e.pointerId,target:t,handle:null,start:n,original:this._areaFor(t)},e.currentTarget.setPointerCapture(e.pointerId),e.preventDefault(),this.requestUpdate()};this._beginResize=(e,t,s)=>{if(this._saving||e.button!==0)return;e.stopPropagation();let n=this._imageRef.value;if(!n)return;this._pushUndo(),this._selected=t;let o=Le(e.clientX,e.clientY,n.getBoundingClientRect());this._edit={pointerId:e.pointerId,target:t,handle:s,start:o,original:this._areaFor(t)},e.currentTarget.setPointerCapture(e.pointerId),e.preventDefault(),this.requestUpdate()};this._onEditMove=e=>{let t=this._edit;if(!t||t.pointerId!==e.pointerId)return;let s=this._imageRef.value;if(!s)return;let n=Le(e.clientX,e.clientY,s.getBoundingClientRect()),o=t.handle?mn(t.original,t.handle,n):vi(t.original,n.x-t.start.x,n.y-t.start.y);this._setAreaFor(t.target,o),this.requestUpdate()};this._onEditEnd=e=>{let t=this._edit;if(!t||t.pointerId!==e.pointerId)return;let s=e.currentTarget;s.hasPointerCapture(e.pointerId)&&s.releasePointerCapture(e.pointerId),this._edit=null,this.requestUpdate()};this._selectTarget=e=>{this._selected=e,this.requestUpdate()};this._toggleVisibility=e=>{let t=new Set(this._hidden);t.has(e)?t.delete(e):(t.add(e),this._selected?.kind==="mask"&&this._selected.index===e&&(this._selected=null)),this._hidden=t,this.requestUpdate()};this._deleteMask=e=>{this._pushUndo(),this._masks=this._masks.filter((t,s)=>s!==e),this._hidden=new Set([...this._hidden].filter(t=>t!==e).map(t=>t>e?t-1:t)),this._selected?.kind==="mask"&&(this._selected.index===e?this._selected=null:this._selected.index>e&&(this._selected={kind:"mask",index:this._selected.index-1})),this.requestUpdate()};this._resetBowl=()=>{this._pushUndo(),this._bowl=Ge,this.requestUpdate()};this._undo=()=>{let e=this._undoStack.pop();e&&(this._masks=e.masks,this._bowl=e.bowl,this._selected=null,this.requestUpdate())};this._onKeydown=e=>{if(e.key==="Escape"&&!this._saving){e.preventDefault(),this._requestClose();return}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="z"&&!this._saving){e.preventDefault(),this._undo();return}if(!this._selected||this._saving)return;let s={ArrowLeft:{x:-Ar,y:0},ArrowRight:{x:Ar,y:0},ArrowUp:{x:0,y:-Ar},ArrowDown:{x:0,y:Ar}}[e.key];if(s){e.preventDefault(),this._pushUndo();let n=this._areaFor(this._selected),o=e.shiftKey?mn(n,"se",{x:n[2]+s.x,y:n[3]+s.y}):vi(n,s.x,s.y);this._setAreaFor(this._selected,o),this.requestUpdate();return}(e.key==="Delete"||e.key==="Backspace")&&this._selected.kind==="mask"&&(e.preventDefault(),this._deleteMask(this._selected.index))};this._requestClose=()=>{if(!this._saving){if(this._isDirty()&&!this._confirmDiscard){this._confirmDiscard=!0,this.requestUpdate();return}this._confirmDiscard=!1,this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}};this._keepEditing=()=>{this._confirmDiscard=!1,this.requestUpdate()};this.open=!1}static{this.properties={hass:{attribute:!1},cameraEntity:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0}}}disconnectedCallback(){super.disconnectedCallback(),this._revokeObjectUrl(),this._stopVisionPolling()}updated(e){e.has("open")&&this.open&&(this._cancelRef.value?.focus(),this._loadEditor()),e.has("open")&&!this.open&&(this._drawStart=null,this._drawing=null,this._pointerId=null,this._edit=null,this._selected=null,this._confirmDiscard=!1,this._showDetections=!1,this._stopVisionPolling())}render(){if(!this.open)return p;let e=!this._loading&&!this._saving&&!!this.entryId;return c`
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
        ${this._selected&&e?Hl.map(n=>this._renderHandle(e,this._selected,n)):p}
      </div>
    `}_renderDetections(){return(this._visionFrame?.detections??[]).map(t=>{let s=Pr([t.x1,t.y1,t.x2,t.y2]),n=`left:${s.left};top:${s.top};width:${s.width};height:${s.height};`;return c`<div class="detection ${t.admitted?"":"quiet"}" style=${n}></div>`})}_renderShape(e,t,s,n,o){let a=`left:${e[0]*100}%;top:${e[1]*100}%;width:${Ke(e)*100}%;height:${Ht(e)*100}%;`;return c`
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
    `}_renderHandle(e,t,s){let n=Sr(e,s),o=`left:${n.x*100}%;top:${n.y*100}%;cursor:${ph[s]};`;return c`
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
    `}_renderDrawingPreview(e){let t=`left:${e[0]*100}%;top:${e[1]*100}%;width:${Ke(e)*100}%;height:${Ht(e)*100}%;`;return c`<div class="shape mask drawing" style=${t}><div class="shape-body"></div></div>`}_renderMaskRow(e,t){let s=this._selected?.kind==="mask"&&this._selected.index===t,n=this._hidden.has(t);return c`
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
          ${g(n?"eyeOff":"eye")}
        </button>
        <button type="button" class="icon-button" aria-label="Delete mask ${t+1}" @click=${()=>this._deleteMask(t)}>
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
    `}async _loadEditor(){let e=++this._loadGeneration;this._error=null,this._selected=null,this._drawing=null,this._undoStack=[],this._hidden=new Set,this._confirmDiscard=!1,this._loading=!0,this.requestUpdate(),await Promise.all([this._loadAreas(),this._loadImage()]),e===this._loadGeneration&&(this._loading=!1,this.requestUpdate())}async _loadAreas(){let e=this.hass?.callWS;if(!e||!this.entryId){this._masks=[],this._bowl=Ge,this._baseline={masks:[],bowl:Ge};return}try{let[t,s]=await Promise.all([e({type:"kibble/vision/areas",entry_id:this.entryId}),e({type:"kibble/vision/bowl",entry_id:this.entryId})]);this._masks=hn(t.exclude),this._bowl=$r(s.bowl_roi)??Ge}catch(t){this._error=j(t),this._masks=[],this._bowl=Ge}this._baseline={masks:this._masks,bowl:this._bowl}}async _loadImage(){let e=this.cameraEntity?this.hass?.states[this.cameraEntity]:void 0,t=typeof e?.attributes.entity_picture=="string"?e.attributes.entity_picture:null;if(!(t===this._imagePath&&this._imageUrl)){if(this._imagePath=t,!t){this._imageUrl||this.requestUpdate();return}if(!this.hass.fetchWithAuth){this._imageUrl=t,this.requestUpdate();return}try{let s=await this.hass.fetchWithAuth(t);if(!s.ok)throw new Error("Camera still could not be loaded.");let n=await s.blob(),o=URL.createObjectURL(n);this._revokeObjectUrl(),this._objectUrl=o,this._imageUrl=o}catch(s){this._imageUrl||(this._error=s instanceof Error?s.message:"Camera still could not be loaded.")}this.requestUpdate()}}_stageAspectRatio(){let e=this._imageRef.value;return e&&e.naturalWidth>0&&e.naturalHeight>0?e.naturalWidth/e.naturalHeight:this._visionFrame?.w&&this._visionFrame?.h?this._visionFrame.w/this._visionFrame.h:16/9}_stopVisionPolling(){this._visionTimer!==void 0&&clearInterval(this._visionTimer),this._visionTimer=void 0}_finishStageDraw(e){let t=e.currentTarget;t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId),this._pointerId=null,this._drawStart=null,this._drawing=null,this.requestUpdate()}_onShapeContextMenu(e,t){e.preventDefault(),t.kind==="mask"&&this._deleteMask(t.index)}_areaFor(e){return e.kind==="bowl"?this._bowl:this._masks[e.index]}_setAreaFor(e,t){e.kind==="bowl"?this._bowl=t:this._masks=this._masks.map((s,n)=>n===e.index?t:s)}_pushUndo(){this._undoStack.push({masks:this._masks,bowl:this._bowl}),this._undoStack.length>dh&&this._undoStack.shift()}_isDirty(){if(!this._baseline)return!1;let e=t=>t.map(s=>Math.round(s*1e4)).join(",");return this._masks.length!==this._baseline.masks.length||e(this._bowl)!==e(this._baseline.bowl)?!0:this._masks.some((t,s)=>e(t)!==e(this._baseline.masks[s]))}async _save(){let e=this.hass?.callWS;if(!(!e||!this.entryId)){this._saving=!0,this._error=null,this.requestUpdate();try{try{await e({type:"kibble/vision/areas/set",entry_id:this.entryId,exclude:this._masks})}catch(n){throw new Error(`Could not save masks. ${j(n)}`)}try{await e({type:"kibble/vision/bowl/set",entry_id:this.entryId,bowl_roi:this._bowl})}catch(n){throw new Error(`Masks saved, but the bowl zone failed to save. ${j(n)}`)}let[t,s]=await Promise.all([e({type:"kibble/vision/areas",entry_id:this.entryId}),e({type:"kibble/vision/bowl",entry_id:this.entryId})]);this._masks=hn(t.exclude),this._bowl=$r(s.bowl_roi)??Ge,this._baseline={masks:this._masks,bowl:this._bowl},this._undoStack=[],this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(t){this._error=t instanceof Error?t.message:"Could not save detection areas."}finally{this._saving=!1,this.requestUpdate()}this._error||this._requestClose()}}_revokeObjectUrl(){this._objectUrl&&URL.revokeObjectURL(this._objectUrl),this._objectUrl=null}static{this.styles=x`
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
  `}};customElements.define("kibble-detection-areas-dialog",bn);function gn(i){return Number.isNaN(i)?50:Math.min(100,Math.max(0,i))}function Dl(i,r){switch(r){case"ArrowLeft":case"ArrowDown":return gn(i-5);case"ArrowRight":case"ArrowUp":return gn(i+5);case"Home":return 0;case"End":return 100;default:return null}}function Fl(i,r){return r.width<=0?50:gn((i-r.left)/r.width*100)}function zl(i,r){let e=i||null,t=r||null;return{before:e,after:t,hasPair:e!==null&&t!==null}}var vn=class extends y{constructor(){super();this._frameRef=T();this._beginDrag=e=>{e.preventDefault(),e.currentTarget.setPointerCapture(e.pointerId),this._updateFromPointer(e.clientX)};this._onDrag=e=>{e.buttons!==0&&(e.preventDefault(),this._updateFromPointer(e.clientX))};this._endDrag=e=>{let t=e.currentTarget;t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId)};this._onHandleKeydown=e=>{let t=Dl(this._wipePosition,e.key);t!==null&&(e.preventDefault(),this._wipePosition=t)};this.beforeSrc=null,this.afterSrc=null,this.beforeLabel="Before",this.afterLabel="After",this.caption=null,this.aspect=16/9,this._mode="split",this._wipePosition=50}static{this.properties={beforeSrc:{type:String},afterSrc:{type:String},beforeLabel:{type:String},afterLabel:{type:String},caption:{type:String},aspect:{type:Number},_mode:{state:!0},_wipePosition:{state:!0}}}render(){let e=zl(this.beforeSrc,this.afterSrc);if(!e.before&&!e.after)return p;if(!e.hasPair){let t=e.before??e.after,s=e.before?this.beforeLabel:this.afterLabel;return c`
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
    `}_setMode(e){this._mode=e}_updateFromPointer(e){let t=this._frameRef.value?.getBoundingClientRect();t&&(this._wipePosition=Fl(e,t))}static{this.styles=x`
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
  `}};customElements.define("kibble-before-after",vn);var Bl=3e3;function _n(i,r){if(!r)return null;let e=i.states[r];if(!e)return null;let t=Number(e.state);return Number.isNaN(t)?null:{value:t,min:Number(e.attributes.min??1),max:Number(e.attributes.max??20),step:Number(e.attributes.step??1)}}var yn=class extends y{constructor(){super();this._cloudConfirmArmed=!1;this._cloudConfirmTimer=void 0;this._stackConfirmArmed=!1;this._stackConfirmTimer=void 0;this.open=!1,this.singleHopper=!1,this.food1=null,this.food2=null,this._calibrationOpen=!1,this._detectionAreasOpen=!1}static{this.properties={hass:{attribute:!1},entities:{attribute:!1},entryId:{attribute:!1},open:{type:Boolean,reflect:!0},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},_calibrationOpen:{state:!0},_detectionAreasOpen:{state:!0}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._cloudConfirmTimer),clearTimeout(this._stackConfirmTimer)}render(){if(!this.open)return p;let e=this.entities;return c`
      <div class="backdrop" @click=${this._close}></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Kibble settings" @keydown=${this._onKeydown}>
        <header>
          <h2>Settings</h2>
          <button type="button" class="icon-button" @click=${this._close} aria-label="Close">${g("close")}</button>
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
    `}_renderMoreAmountSection(){let e=_n(this.hass,this.entities.feedAmount);return e?c`
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
                  ${this._renderStepper(e,_n(this.hass,e))}
                  ${s?c`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(s)}></kibble-hold-button>`:p}
                </div>
              `:p}
          ${t&&!this.singleHopper?c`
                <div class="hopper">
                  <span class="hopper-label">${this._hopperFeedLabel(2)}</span>
                  ${this._renderStepper(t,_n(this.hass,t))}
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
        <span class="toggle-icon">${g(t)}</span>
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
    `}_onStackClick(){let t=this.hass.states[this.entities.stackSelect]?.state==="librefeed"?"vendor":"librefeed";if(this._stackConfirmArmed){clearTimeout(this._stackConfirmTimer),this._stackConfirmArmed=!1,this.hass.callService("select","select_option",{entity_id:this.entities.stackSelect,option:t}),this.requestUpdate();return}this._stackConfirmArmed=!0,this.requestUpdate(),this._stackConfirmTimer=setTimeout(()=>{this._stackConfirmArmed=!1,this.requestUpdate()},Bl)}_onCloudToggleClick(){if(this._cloudConfirmArmed){clearTimeout(this._cloudConfirmTimer),this._cloudConfirmArmed=!1,this._toggleSwitch(this.entities.cloudSwitch),this.requestUpdate();return}this._cloudConfirmArmed=!0,this.requestUpdate(),this._cloudConfirmTimer=setTimeout(()=>{this._cloudConfirmArmed=!1,this.requestUpdate()},Bl)}_openDevicePage(){let e=this.entities.deviceId;history.pushState(null,"",`/config/devices/device/${e}`),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0})),this._close()}_onKeydown(e){e.key==="Escape"&&this._close()}_openCalibration(){this._calibrationOpen=!0}_openDetectionAreas(){this._detectionAreasOpen=!0}_closeDetectionAreas(e){e.stopPropagation(),this._detectionAreasOpen=!1}_closeCalibration(e){e.stopPropagation(),this._calibrationOpen=!1}_close(){this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}static{this.styles=x`
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
  `}};customElements.define("kibble-settings-dialog",yn);var hh=46,Ie=5,Dt=8,ht=34,xn=7,fh=2,jl=8,mh=7,bh=2,gh=24,vh=48;function Nl(i){let r=`hopper-clip-${i.index??"all"}`,e=i.index===null?vh:gh,t=e+Ie*2,s=Ie+(e-jl)/2,n=(Dt+ht*(1-ar)).toFixed(1),o=i.fillFraction;return D`
    <svg class="tank" data-tone=${i.tone} data-wide=${i.index===null} viewBox="0 0 ${t} ${hh}" aria-hidden="true">
      <defs>
        <clipPath id=${r}><rect x=${Ie} y=${Dt} width=${e} height=${ht} rx=${xn} /></clipPath>
      </defs>
      <rect class="tank-cap" x=${s} y=${fh} width=${jl} height=${mh} rx=${bh} />
      <rect class="tank-body" x=${Ie} y=${Dt} width=${e} height=${ht} rx=${xn} />
      ${o!=null&&o>0?D`<g clip-path="url(#${r})"><rect class="tank-fill" x=${Ie} y=${(Dt+ht*(1-o)).toFixed(1)} width=${e} height=${(ht*o+1).toFixed(1)} /></g>`:""}
      ${i.tone!=="unknown"?D`<line class="tank-low-line" x1=${Ie+2} y1=${n} x2=${Ie+e-2} y2=${n} />`:D`<text class="tank-unknown" x=${Ie+e/2} y=${Dt+ht/2+1} text-anchor="middle" dominant-baseline="central">\u2013</text>`}
      <rect class="tank-outline" x=${Ie} y=${Dt} width=${e} height=${ht} rx=${xn} />
    </svg>
  `}var ql=`
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
`;var _h=1100,wn=class extends y{constructor(){super();this._closeButtonRef=T();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&this._close()};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.hopperLevel1=null,this.hopperLevel2=null,this.hopperRemaining1=null,this.hopperRemaining2=null,this.singleHopper=!1,this.food1=null,this.food2=null,this._confirmed=null}static{this.properties={hass:{attribute:!1},entities:{attribute:!1},open:{type:Boolean,reflect:!0},hopperLevel1:{attribute:!1},hopperLevel2:{attribute:!1},hopperRemaining1:{attribute:!1},hopperRemaining2:{attribute:!1},singleHopper:{type:Boolean},food1:{type:String},food2:{type:String},_confirmed:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),clearTimeout(this._confirmTimer)}updated(e){e.has("open")&&this.open&&(clearTimeout(this._confirmTimer),this._confirmed=null,this._closeButtonRef.value?.focus())}_entityFor(e){return e==="1"?this.entities?.markFullHopper1:e==="2"?this.entities?.markFullHopper2:this.entities?.markFullBoth}_markFull(e){let t=this._entityFor(e);t&&(this.hass.callService("button","press",{},{entity_id:t}),clearTimeout(this._confirmTimer),this._confirmed=e,oe("success"),this._confirmTimer=window.setTimeout(()=>{this._confirmed=null,this.requestUpdate()},_h))}render(){if(!this.open)return p;let e=cr(this.singleHopper,this.hopperLevel1,this.hopperLevel2,this.hopperRemaining1,this.hopperRemaining2),t=!!(this.entities?.markFullHopper1||this.entities?.markFullHopper2||this.entities?.markFullBoth);return c`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.singleHopper?"Hopper":"Hoppers"}>
        <div class="sheet" @click=${s=>s.stopPropagation()}>
          <header>
            <span>${this.singleHopper?"Hopper":"Hoppers"}</span>
            <button type="button" class="icon-button" ${P(this._closeButtonRef)} @click=${this._close} aria-label="Close">${g("close")}</button>
          </header>
          <div class="body">
            ${e.map(s=>this._renderRow(s,ui(s.index,this.food1,this.food2)))}
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
    `}_renderRow(e,t){let s=ct(e,t),n=lr(e,t);return c`
      <div class="hopper-row" data-tone=${e.tone} aria-label=${n}>
        <span class="hopper-row-glyph">${Nl(e)}</span>
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
        ${o?c`<span class="mark-check">${g("check")}</span><span>Marked full</span>`:t}
      </button>
    `}static{this.styles=x`
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
    ${K(ql)}
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
  `}};customElements.define("kibble-hopper-sheet",wn);function He(){return D`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `}function ye(i){let r=0;for(let e=0;e<i.length;e++)r=r*31+i.charCodeAt(e)|0;return W(r)}var kn=class extends y{constructor(){super();this._ref=new qe;this._visible=!1;this._observer=null;this._reportedFailure=null;this.alt="",this.rounded=!1,this.fit="cover",this.eager=!1}static{this.properties={hass:{attribute:!1},asset:{attribute:!1},cache:{attribute:!1},alt:{type:String},rounded:{type:Boolean},fit:{type:String},eager:{type:Boolean}}}connectedCallback(){super.connectedCallback(),this._visible=!1,this._observer=new IntersectionObserver(e=>{e.some(t=>t.isIntersecting)&&this._markVisible()},{rootMargin:"200px"}),this._observer.observe(this),requestAnimationFrame(()=>{if(this._visible||!this.isConnected)return;let e=this.getBoundingClientRect(),t=window.innerHeight||document.documentElement.clientHeight;e.width>0&&e.height>0&&e.bottom>-200&&e.top<t+200&&this._markVisible()})}_markVisible(){this._visible||(this._visible=!0,this._sync(),this.requestUpdate(),this._observer?.disconnect(),this._observer=null)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=null,this._ref.dispose()}willUpdate(e){this.eager&&!this._visible&&this._markVisible(),(e.has("asset")||e.has("cache")||e.has("hass"))&&this._sync()}_sync(){this._visible&&this._ref.sync(this.hass,this.cache,this.asset,()=>this.requestUpdate())}updated(){let e=this._ref.failed?this.asset?.id??null:null;e!==this._reportedFailure&&(this._reportedFailure=e,e&&this.dispatchEvent(new CustomEvent("image-failed",{bubbles:!0,composed:!0})))}get failed(){return this._ref.failed}retry(){this._reportedFailure=null,this._ref.retry(this.hass,this.cache,this.asset,()=>this.requestUpdate()),this.requestUpdate()}render(){let e=this._ref.url;return c`
      <div class="box ${this.rounded?"rounded":""}">
        ${e?c`<img src=${e} alt=${this.alt} style="object-fit:${this.fit}" />`:c`<div class="placeholder">${this._ref.failed?g("imageBroken"):p}</div>`}
      </div>
    `}static{this.styles=x`
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
  `}};customElements.define("kibble-image",kn);var Cn=class extends y{constructor(){super();this._ownCache=new _e;this.name=null,this.colorIndex=null,this.asset=null}static{this.properties={hass:{attribute:!1},name:{type:String},colorIndex:{type:Number,attribute:"color-index"},asset:{attribute:!1},cache:{attribute:!1}}}disconnectedCallback(){super.disconnectedCallback(),this._ownCache.dispose()}render(){if(!this.name)return c`<div class="avatar neutral">${He()}</div>`;let e=this.colorIndex!=null?W(this.colorIndex):ye(this.name);return c`
      <div class="avatar" style="--kibble-avatar-color: ${e}">
        ${this.asset?c`<kibble-image rounded .hass=${this.hass} .asset=${this.asset} .cache=${this.cache??this._ownCache} alt=""></kibble-image>`:c`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `}static{this.styles=x`
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
  `}};customElements.define("kibble-avatar",Cn);var $n=new EventTarget,Sn="kibble-review-changed";function _i(i){$n.dispatchEvent(new CustomEvent(Sn,{detail:{entryId:i}}))}function Ft(i,r){let e=t=>{t.detail.entryId===i()&&r()};return $n.addEventListener(Sn,e),()=>$n.removeEventListener(Sn,e)}async function Ul(i,r,e,t){let s=[],n=null,o=null;for(let a=0;a<20&&(o=await i({type:r,entry_id:e,limit:t,...n?{cursor:n}:{}}),s.push(...o.items),!(!o.has_more||!o.cursor));a++)n=o.cursor;return{items:s,last:o}}async function En(i,r){let{items:e,last:t}=await Ul(i,"kibble/review",r,60);return{items:e,total:t?.total??e.length}}async function Tn(i,r){let{items:e}=await Ul(i,"kibble/timeline",r,100);return e.filter(t=>t.kind==="eat"||t.kind==="visit")}async function Vl(i,r){return(await i({type:"kibble/review",entry_id:r,limit:1})).total}var Pn=pt(class extends We{constructor(){super(...arguments),this.key=p}render(i,r){return this.key=i,r}update(i,[r,e]){return r!==this.key&&(gr(i),this.key=r),e}});var Wl=(i,r,e)=>{let t=new Map;for(let s=r;s<=e;s++)t.set(i[s],s);return t},Kl=pt(class extends We{constructor(i){if(super(i),i.type!==_r.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,r,e){let t;e===void 0?e=r:r!==void 0&&(t=r);let s=[],n=[],o=0;for(let a of i)s[o]=t?t(a,o):o,n[o]=e(a,o),o++;return{values:n,keys:s}}render(i,r,e){return this.dt(i,r,e).values}update(i,[r,e,t]){let s=kl(i),{values:n,keys:o}=this.dt(r,e,t);if(!Array.isArray(s))return this.ut=o,n;let a=this.ut??=[],l=[],u,h,d=0,f=s.length-1,m=0,b=n.length-1;for(;d<=f&&m<=b;)if(s[d]===null)d++;else if(s[f]===null)f--;else if(a[d]===o[m])l[m]=Ve(s[d],n[m]),d++,m++;else if(a[f]===o[b])l[b]=Ve(s[f],n[b]),f--,b--;else if(a[d]===o[b])l[b]=Ve(s[d],n[b]),It(i,l[b+1],s[d]),d++,b--;else if(a[f]===o[m])l[m]=Ve(s[f],n[m]),It(i,s[d],s[f]),f--,m++;else if(u===void 0&&(u=Wl(o,m,b),h=Wl(a,d,f)),u.has(a[d]))if(u.has(a[f])){let v=h.get(o[m]),_=v!==void 0?s[v]:null;if(_===null){let k=It(i,s[d]);Ve(k,n[m]),l[m]=k}else l[m]=Ve(_,n[m]),It(i,s[d],_),s[v]=null;m++}else vr(s[f]),f--;else vr(s[d]),d++;for(;m<=b;){let v=It(i,l[b+1]);Ve(v,n[m]),l[m++]=v}for(;d<=f;){let v=s[d++];v!==null&&vr(v)}return this.ut=o,gr(i,l),Pe}});var Rr=class{constructor(){this._held=new Map}sync(r,e,t){let s=new Map;if(r&&e)for(let n of t)n&&s.set(n.id,n);for(let[n,o]of this._held)s.has(n)&&o===e||(o.release(n),this._held.delete(n));for(let[n,o]of s)this._held.has(n)||(this._held.set(n,e),e.acquire(r,o,()=>{}))}dispose(){for(let[r,e]of this._held)e.release(r);this._held.clear()}};function Mr(i,r){return{cats:i.map(({cat:e,ate:t})=>({cat:e,ate:t})),notACat:r==="not_a_cat",subjects:{}}}function Yl(i,r,e){let t=i.cats.some(s=>s.cat===r);return{...i,notACat:!1,cats:t?i.cats.filter(s=>s.cat!==r):[...i.cats,{cat:r,ate:e}]}}function Xl(i){return i.notACat?{...i,notACat:!1}:{...i,notACat:!0,cats:[]}}function An(i,r,e){return{...i,cats:i.cats.map(t=>t.cat===r?{...t,ate:e}:t)}}function Ql(i,r,e,t){let s={...i.subjects,[r]:e};return e==="not_a_cat"||i.cats.some(n=>n.cat===e)?{...i,subjects:s}:{...i,subjects:s,notACat:!1,cats:[...i.cats,{cat:e,ate:t}]}}function Zl(i,r,e){if(!i.cats.some(s=>s.cat===e))return"neutral";let t=r.find(s=>s.cat===e);return t&&!t.confirmed?"suggested":"confirmed"}function Jl(i,r,e){let t=Object.entries(i.subjects).map(([o,a])=>({sid:Number(o),label:a})),s=t.length?{subjects:t}:{};return i.notACat?e==="not_a_cat"&&!t.length?{kind:"close",text:"Done"}:{kind:"save",text:"Confirm not a cat",request:{verdict:"not_a_cat",...s}}:i.cats.length===0?{kind:"blocked",text:"Pick who was here"}:e!=="not_a_cat"&&r.length===i.cats.length&&r.every(o=>o.confirmed&&i.cats.some(a=>a.cat===o.cat&&a.ate===o.ate))&&!t.length?{kind:"close",text:"Done"}:{kind:"save",text:"Confirm "+ec(i.cats.map(o=>o.cat)),request:{cats:i.cats.map(o=>({...o})),...s}}}function ec(i){return i.length<=1?i[0]??"":i.length===2?i[0]+" and "+i[1]:i.slice(0,-1).join(", ")+", and "+i[i.length-1]}function tc(i,r){if(r.identity==="not_a_cat")return"Not a cat";if(i.length===0)return"Who was here?";let e=new Map;for(let t of i){let s=r.open?t.ate?"is eating":"is here":t.ate?"ate":"came by",n=e.get(s)??[];n.push(t.cat),e.set(s,n)}return[...e].map(([t,s])=>ec(s)+" "+t).join(", ")}function Gl(i,r,e){return Math.min(e,Math.max(r,i))}function ic(i,r,e,t,s,n=8,o=8){if(!(r>0)||!(e>0))return{left:0,top:0,flipped:!1};let a=Math.max(0,Math.min(o,r/2,e/2)),l=Math.min(Math.max(0,t),Math.max(0,r-a*2)),u=Math.min(Math.max(0,s),Math.max(0,e-a*2)),h=r-a-l,d=e-a-u,f=(i[0]+i[2])/2*r,m=Gl(f-l/2,a,h),b=i[3]*e+n,v=i[1]*e-n-u,_=b<=d,k=v>=a,R=!_&&k;return{left:m,top:Gl(R?v:b,a,d),flipped:R}}function rc(i,r){if(r.length<2)return[];let e=r.map(n=>({cat:n.cat,samples:[]})),t=new Map(e.map(n=>[n.cat,n])),s=[];for(let n of i){let o=n.cat?t.get(n.cat):void 0;o?o.samples.push(n):s.push(n)}return s.length>0&&e.reduce((o,a)=>a.samples.length>o.samples.length?a:o).samples.push(...s),e}async function Lr(i,r,e){let t=i.callWS;if(!t)throw new Error("Not connected.");let s=await t({type:"kibble/session/label",entry_id:r,uid:e.uid,...e.cats?{cats:e.cats}:{},...e.verdict?{verdict:e.verdict}:{}});for(let n of e.subjects??[])s=await t({type:"kibble/session/subject",entry_id:r,uid:s.event.uid,sid:n.sid,label:n.label});return s}function sc(i){return i.kind==="feed"?null:i.thumb??i.scene??null}function Mn(i){return i.kind!=="feed"&&!i.open&&i.cat===null}function nc(i){let r=Math.floor(i/60),e=i%60;return r===0?`${e} sec`:e===0?`${r} min`:`${r} min ${e} sec`}function Ir(i){return i.kind!=="eat"||i.open||i.end==null||i.end<=i.start?null:nc(i.end-i.start)}function oc(i,r){return!Number.isFinite(i)||!Number.isFinite(r)||r<=i?null:nc(Math.floor(r-i))}function Ye(i){return i.open?i.kind==="eat"?"is eating":"is here":i.kind==="eat"?"ate":"came by"}function Hr(i){return i.kind==="feed"?zt(i):i.cat?`${i.cat} ${Ye(i)}`:i.kind==="eat"?"Someone is eating":"Someone is here"}function Rn(i){return`${i} portion${i===1?"":"s"}`}function zt(i){let r=i.feed;if(!r||r.portions==null)return"Fed";if(r.single||r.sides.length===0)return`Fed ${Rn(r.portions)}`;if(r.sides.length===1){let[s]=r.sides,n=s.food?`of ${s.food}`:`from hopper ${s.hopper}`;return`Fed ${Rn(s.portions)} ${n}`}let[e,t]=r.sides;return e.food&&t.food?`Fed ${e.portions} ${e.food} and ${t.portions} ${t.food}`:e.portions===t.portions?`Fed ${Rn(e.portions)} from each hopper`:`Fed ${e.portions} from hopper ${e.hopper} and ${t.portions} from hopper ${t.hopper}`}function he(i,r){return new Date(i*1e3).toLocaleTimeString(r,{hour:"numeric",minute:"2-digit"})}function Ln(i,r,e){let t=new Date(i*1e3),s=he(i,e),n=a=>new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime(),o=Math.round((n(r)-n(t))/864e5);return o<=0?s:o<7?`${t.toLocaleDateString(e,{weekday:"short"})} ${s}`:`${t.toLocaleDateString(e,{month:"short",day:"numeric"})} ${s}`}function Or(i){return i.kind!=="eat"&&i.kind!=="feed"||!i.before||!i.after?null:{before:i.before,after:i.after}}var yh=5*60;function xh(i){return i.length<2?i[0]??"":i.length===2?i[0]+" and "+i[1]:i.slice(0,-1).join(", ")+", and "+i[i.length-1]}function Dr(i){return[...i].sort((r,e)=>+(e.kind==="eat")-+(r.kind==="eat")||+(r.cat===null)-+(e.cat===null))}function ac(i){let r=Dr(i),e=r.map(n=>n.cat??"Who?"),t=r.every(n=>n.kind===r[0]?.kind),s=r.every(n=>n.open===r[0]?.open);if(t&&s&&r[0]?.kind!=="feed"){let n=r[0]?.kind,o=r[0]?.open?n==="eat"?"are eating":"are here":n==="eat"?"ate":"came by";return xh(e)+" "+o}return r.map((n,o)=>e[o]+" "+Ye(n)).join(", ")}function lc(i,r=Date.now()/1e3){let e=new Map;for(let o of i){if(o.session===null||o.session===void 0)continue;let a=e.get(o.session)??[];a.push(o),e.set(o.session,a)}let t=new Map;for(let o of e.values()){let a=[...o].sort((d,f)=>d.start-f.start),l=[],u=Number.NEGATIVE_INFINITY,h=()=>{if(l.length>1){let d=new Set(l.map(_=>_.uid)),f=i.filter(_=>d.has(_.uid)),m=Math.min(...f.map(_=>_.start)),b=Math.max(...f.map(_=>Math.max(_.start,_.end??r))),v={event:f[0],events:f,together:!0,start:m,end:b};for(let _ of f)t.set(_.uid,v)}l=[],u=Number.NEGATIVE_INFINITY};for(let d of a){let f=Math.max(d.start,d.end??r);l.length>0&&d.start>u&&h(),l.push(d),u=Math.max(u,f)}h()}let s=[],n=new Set;for(let o of i){let a=t.get(o.uid);if(a){n.has(a)||(n.add(a),s.push(a));continue}let l=s[s.length-1];if(l&&!l.together&&l.event.kind===o.kind&&l.event.cat===o.cat&&l.event.start-o.start<=yh){l.events.push(o);continue}s.push({event:o,events:[o]})}return s.sort((o,a)=>(a.start??a.event.start)-(o.start??o.event.start))}function cc(i,r){return`${r} ${i==="eat"?"meal":i==="feed"?"feed":"visit"}${r===1?"":"s"}`}function yi(i){return`${i.getFullYear()}-${i.getMonth()}-${i.getDate()}`}function wh(i,r){if(yi(i)===yi(r))return"Today";let e=new Date(r.getFullYear(),r.getMonth(),r.getDate()-1);return yi(i)===yi(e)?"Yesterday":i.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}function dc(i,r){let e=[],t=null;for(let s of i){let n=new Date((s.start??s.event.start)*1e3),o=yi(n);o!==t&&(t=o,e.push({label:wh(n,r),groups:[]})),e[e.length-1].groups.push(s)}return e}var kh="clamp(360px, calc(100dvh - 200px), 900px)";function In(i){let r=(i??"").trim();return r==="none"?"":`max-height:${r||kh}`}function Fr(i){return Math.min(i*2,3e4)}function uc(i,r){if(i.altKey)return null;let e=i.key.length===1?i.key.toLowerCase():i.key;if(i.ctrlKey||i.metaKey)return e==="z"&&!i.repeat?{type:"undo"}:null;if(e==="ArrowLeft")return{type:"photo",delta:-1};if(e==="ArrowRight")return{type:"photo",delta:1};if(i.repeat)return null;if(e==="z"||e==="u"||e==="Backspace")return{type:"undo"};if(e==="s"||e==="ArrowUp"||e==="ArrowDown")return{type:"scene"};let t=r.find(s=>s.hotkey===e);return t?{type:"answer",optionId:t.id}:null}var pc=10,Ch=.5,$h=24;function hc(i,r){return Math.abs(i)<pc&&Math.abs(r)<pc?null:Math.abs(i)>Math.abs(r)*1.2}function fc(i){return Math.min(140,Math.max(64,i*.25))}function mc(i,r){return i===0?{side:null,progress:0}:{side:i<0?"left":"right",progress:Math.min(1,Math.abs(i)/fc(r))}}function bc(i,r,e){let t=i<0?"left":"right";return Math.abs(i)>=fc(e)||Math.abs(r)>=Ch&&Math.abs(i)>=$h&&Math.sign(r)===Math.sign(i)?t:null}function gc(i,r){let e=r.filter(t=>t.kind==="cat");return e.length!==2?null:(i==="left"?e[0]:e[1]).id}var vc={unknown:0,unsure:1,guess:2};function zr(i,r){let e=new Map,t=new Set;for(let n of[...i,...r]){if(n.kind==="feed")continue;let o=n.session??n.uid;(n.identity==="reviewed"||n.identity==="not_a_cat"||n.open)&&t.add(o);let a=e.get(o)??new Map;a.set(n.uid,n),e.set(o,a)}let s=[];for(let[n,o]of e){if(t.has(n))continue;let a=[...o.values()].sort((b,v)=>b.start-v.start||b.uid.localeCompare(v.uid)),l=a.filter(b=>b.identity==="auto"&&b.cat),u=a.some(b=>b.identity!=="auto"||!b.cat),h=l.map(b=>b.confidence).filter(b=>typeof b=="number"),d=h.length?Math.min(...h):null,f=u?"unknown":d!==null&&d<.75?"unsure":"guess",m=a.find(b=>b.thumb)??a[0];s.push({key:n,event:{...m,start:a[0].start},tier:f,guesses:[...new Set(l.map(b=>b.cat))],confidence:d,isMeal:a.some(b=>b.kind==="eat"),photos:a.reduce((b,v)=>b+(v.sample_count??0),0)})}return s.sort((n,o)=>vc[n.tier]-vc[o.tier]||o.event.start-n.event.start||n.key.localeCompare(o.key))}function _c(i){let r=i.map(e=>({id:"cat:"+e.name,kind:"cat",cat:e.name,label:e.name}));return i.length>=2&&r.push({id:"several",kind:"several",cat:null,label:i.length===2?"Both":"More than one"}),r.push({id:"not_a_cat",kind:"not_a_cat",cat:null,label:"Not a cat"}),r.push({id:"unknown",kind:"unknown",cat:null,label:"Can\u2019t tell"}),r.map((e,t)=>({...e,hotkey:t<9?String(t+1):null}))}function yc(i,r){if(i.length===0)return null;let e=i.length===1?"cat:"+i[0]:"several";return r.some(t=>t.id===e)?e:null}function xc(i,r){return{kind:"cats",cats:[{cat:i,ate:r}]}}function Br(i,r,e){return{kind:"cats",cats:i.map(t=>({cat:t,ate:e&&r.includes(t)}))}}function jr(i){return[{id:"all",label:i.length===2?"Both":"All",ate:[...i]},...i.map(r=>({id:"cat:"+r,label:r,ate:[r]}))]}function wc(i,r){return r.kind==="cats"?{uid:i.event.uid,cats:r.cats.map(e=>({...e}))}:{uid:i.event.uid,verdict:r.kind}}function Sh(i,r){return i.kind!=="cats"||r.kind!=="cats"?i.kind===r.kind:i.cats.length!==r.cats.length?!1:i.cats.every(e=>r.cats.some(t=>t.cat===e.cat&&t.ate===e.ate))}function kc(i){return i.kind!=="cats"?i.kind:i.cats.length===1?"cat:"+i.cats[0].cat:"several"}function Hn(i,r){let e=[],t=new Set,s=n=>{!n||t.has(n.id)||(t.add(n.id),e.push(n))};s(i.thumb);for(let n of r??[])s(n.body??n.face);return e}function Cc(i,r){let e=new Map,t=0;for(let n of i){if(!n.guess||!r.includes(n.guess))continue;let o=n.guess_confidence??.5;e.set(n.guess,(e.get(n.guess)??0)+o),t+=o}let s=null;for(let[n,o]of e)(!s||o>s.confidence)&&(s={cat:n,confidence:o});return!s||t<=0||s.confidence/t<.6?null:{cat:s.cat,confidence:s.confidence/t}}function On(i,r){let e=[...i];if(r){let t=e.findIndex(s=>s.key===r||s.event.uid===r);t>0&&e.unshift(...e.splice(t,1))}return{items:e,position:0,records:{},history:[],streak:0,seq:0}}function pe(i){return i.items[i.position]??null}function Dn(i,r){let e=new Set(i.history),t=[];for(let s=i.position+1;s<i.items.length&&t.length<r;s++){let n=i.items[s];e.has(n.key)||t.push(n)}return t}function $c(i,r,e){let t=new Set(r);for(let s=e;s<i.length;s++)if(!t.has(i[s].key))return s;return i.length}function Sc(i,r){let e=pe(i);if(!e)return i;let t=i.records[e.key],s=[...i.history.filter(l=>l!==e.key),e.key],n=t!==void 0&&t.status!=="failed"&&Sh(t.answer,r),o=n?i.seq:i.seq+1,a=n?t:{key:e.key,answer:r,status:"queued",seq:o,attempts:0,error:null,gone:!1};return{...i,seq:o,records:{...i.records,[e.key]:a},history:s,streak:i.streak+1,position:$c(i.items,s,i.position+1)}}function Ec(i){let r=i.history[i.history.length-1];if(r===void 0)return i;let e=i.items.findIndex(n=>n.key===r),t=i.history.slice(0,-1);if(e===-1)return{...i,history:t,streak:0};let s={...i.records};return s[r]?.status==="queued"&&delete s[r],{...i,history:t,records:s,streak:0,position:e}}function Tc(i){let r=null;for(let e of Object.values(i.records)){if(e.status==="saving")return null;e.status==="queued"&&(!r||e.seq<r.seq)&&(r=e)}return r}function Fn(i,r,e,t){let s=i.records[r];return!s||s.seq!==e?i:{...i,records:{...i.records,[r]:t(s)}}}function Pc(i,r,e){return Fn(i,r,e,t=>({...t,status:"saving",attempts:t.attempts+1,error:null}))}function Ac(i,r,e){return Fn(i,r,e,t=>({...t,status:"saved",error:null}))}function Rc(i,r,e,t,s=!1){return Fn(i,r,e,n=>({...n,status:"failed",error:t,gone:s}))}function Nr(i){let r=!1,e={};for(let[t,s]of Object.entries(i.records))s.status==="failed"&&!s.gone?(e[t]={...s,status:"queued",error:null},r=!0):e[t]=s;return r?{...i,records:e}:i}function Mc(i){let r=new Set(Object.values(i.records).filter(t=>t.gone).map(t=>t.key));if(r.size===0)return i;let e=Object.fromEntries(Object.entries(i.records).filter(([t])=>!r.has(t)));return{...i,records:e,history:i.history.filter(t=>!r.has(t))}}function qr(i){let r={pending:0,failed:0,gone:0};for(let e of Object.values(i.records))e.status==="queued"||e.status==="saving"?r.pending++:e.status==="failed"&&e.gone?r.gone++:e.status==="failed"&&r.failed++;return r}function zn(i,r){let e=i.items.slice(0,i.position+1),t=new Set(e.map(u=>u.key)),s=new Set(r.map(u=>u.key)),o=[...i.items.slice(i.position+1).filter(u=>!s.has(u.key)&&i.records[u.key]!==void 0),...r.filter(u=>!t.has(u.key))],a=[...e,...o],l=i.position>=i.items.length?$c(a,i.history,e.length):i.position;return{...i,items:a,position:l}}function Bt(i,r=20){let e=i.history.length,t=new Set(i.history),s=i.items.reduce((o,a)=>o+(t.has(a.key)?0:1),0),n=Math.floor(e/r)*r;return{done:e,remaining:s,batchDone:e-n,batchSize:Math.min(r,e-n+s)}}function Lc(i,r=20){let e=Bt(i,r);return e.done>0&&e.done%r===0&&e.remaining>0}function Ic(i,r){let e=new Map(r.map(n=>[n,{cat:n,visits:0,photos:0}])),t={total:0,cats:[],notACat:0,cantTell:0},s=new Map(i.items.map(n=>[n.key,n]));for(let n of i.history){let o=i.records[n];if(!(!o||o.gone))if(t.total++,o.answer.kind==="not_a_cat")t.notACat++;else if(o.answer.kind==="unknown")t.cantTell++;else for(let a of o.answer.cats){let l=e.get(a.cat)??{cat:a.cat,visits:0,photos:0};l.visits++,o.answer.cats.length===1&&(l.photos+=s.get(n)?.photos??0),e.set(a.cat,l)}}return t.cats=[...e.values()],t}function Hc(i,r){let e={};for(let t of r){let s=i.find(n=>n.name===t.name)?.training.total??0;e[t.name]=Math.max(0,t.training.total-s)}return e}var xi=class extends y{static{this.shadowRootOptions={...y.shadowRootOptions,delegatesFocus:!0}}static{this.properties={hass:{attribute:!1},cache:{attribute:!1},label:{type:String},cats:{attribute:!1},icon:{type:String},state:{type:String,reflect:!0},hint:{type:String},caption:{type:String},disabled:{type:Boolean,reflect:!0},busy:{type:Boolean},pop:{type:Boolean}}}constructor(){super(),this.label="",this.cats=[],this.icon=null,this.state="neutral",this.hint=null,this.caption=null,this.disabled=!1,this.busy=!1,this.pop=!1}render(){let r=this.cats.length===1?W(this.cats[0].color):null;return c`
      <button type="button" class=${this.state} aria-pressed=${this.state==="selected"} ?disabled=${this.disabled} style=${r?`--choice-color:${r}`:""}>
        <span class="picture ${this.cats.length>1?"several":""}">
          ${this.cats.length?this.cats.slice(0,3).map(e=>c`<kibble-avatar .hass=${this.hass} .name=${e.name} .colorIndex=${e.color} .asset=${e.avatar} .cache=${this.cache}></kibble-avatar>`):c`<span class="glyph">${this.icon?g(this.icon):p}</span>`}
          ${this.busy?c`<span class="badge spinner">${g("refresh")}</span>`:this.state==="selected"?c`<span class="badge check ${this.pop?"pop":""}">${g("check")}</span>`:p}
        </span>
        <span class="text">
          <span class="label">${this.label}</span>
          ${this.caption?c`<span class="caption">${this.caption}</span>`:p}
        </span>
        ${this.hint?c`<kbd aria-hidden="true">${this.hint}</kbd>`:p}
      </button>
    `}static{this.styles=x`
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
  `}};customElements.define("kibble-choice",xi);var Oc=260,Eh=600,Th=2e4,Dc=2e3,Ph=3,Ah=2,Rh=[0,3e3,9e3],Bn=class extends y{constructor(){super();this._open=!1;this._phase="loading";this._loadError=null;this._queue=null;this._stage="review";this._follow=null;this._photoIndex=0;this._scene=!1;this._leaving=null;this._gains=null;this._imageFailed=!1;this._ownCats=[];this._catsBefore=null;this._details=new Map;this._detailsAsked=new Set;this._preloader=new Rr;this._generation=0;this._gainTimers=[];this._retryDelay=Dc;this._connected=!0;this._swipe=null;this._dragged=!1;this._focusedKey=null;this._undo=()=>{if(this._follow){this._follow=null;return}let e=this._queue;!e||e.history.length===0||(clearTimeout(this._leaveTimer),this._leaving=null,this._queue=Ec(e),this._stage="review",this._clearGainTimers(),this._resetPhoto(),oe("light"))};this._keepGoing=()=>{this._stage="review",this._clearGainTimers()};this._enterSummary=()=>{this._stage="summary",this._follow=null,oe("success"),this._clearGainTimers(),this._gainTimers=Rh.map(e=>setTimeout(()=>void this._readCats(!1),e))};this._retryNow=()=>{this._queue&&(this._queue=Nr(this._queue),this._pump())};this._dismissGone=()=>{this._queue&&(this._queue=Mc(this._queue))};this._close=()=>{if(!this._open)return;this._open=!1,this._follow=null,this._clearGainTimers(),clearTimeout(this._leaveTimer),this._leaving=null;let e=this._queue,t=e?.history.length??0,s=e?qr(e):{pending:0,failed:0,gone:0};if(t>0&&this._announce(),s.failed>0){let n=s.failed===1?"1 answer is not saved yet. Open Check visits to try again.":`${s.failed} answers are not saved yet. Open Check visits to try again.`;this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:n},bubbles:!0,composed:!0}))}s.pending+s.failed===0&&(this._queue=null,this._generation++),this.dispatchEvent(new CustomEvent("review-closed",{detail:{answered:t},bubbles:!0,composed:!0}))};this._onCancel=e=>{e.preventDefault(),this._follow?this._follow=null:this._close()};this._onFrameClick=e=>{e.target===e.currentTarget&&this._close()};this._onKeydown=e=>{if(e.stopPropagation(),e.key==="Escape"||e.key==="Tab"||e.key==="Enter"||e.key===" "||this._view()!=="review")return;let t=uc(e,this._keyOptions());t&&(e.preventDefault(),this._run(t))};this._toggleScene=()=>{(this._queue?pe(this._queue):null)?.event.scene&&(this._scene=!this._scene,this._imageFailed=!1)};this._retryImage=()=>{this._imageFailed=!1,this.renderRoot.querySelector(".card.current kibble-image")?.retry()};this._onPointerDown=e=>{if(this._dragged=!1,e.button!==0||!this._swipeEnabled()||e.composedPath().some(s=>s instanceof HTMLButtonElement))return;let t=e.currentTarget;this._swipe={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:e.timeStamp,velocity:0,sideways:null,armed:null,el:t,width:t.offsetWidth}};this._onPointerMove=e=>{let t=this._swipe;if(!t||e.pointerId!==t.id)return;let s=e.clientX-t.x;if(t.sideways===null){if(t.sideways=hc(s,e.clientY-t.y),t.sideways===!1){this._swipe=null;return}if(t.sideways===null)return;t.el.setPointerCapture(t.id),t.el.classList.add("dragging"),this._dragged=!0}let n=e.timeStamp-t.lastT;n>0&&(t.velocity=(e.clientX-t.lastX)/n),t.lastX=e.clientX,t.lastT=e.timeStamp;let o=mc(s,t.width);t.el.style.setProperty("--dx",`${s}px`),t.el.style.setProperty("--tilt",`${s/t.width*10}deg`),t.el.style.setProperty("--swipe",String(o.progress)),t.el.dataset.side=o.side??"";let a=o.progress>=1?o.side:null;a!==t.armed&&(t.armed=a,t.el.toggleAttribute("data-armed",a!==null),a&&oe("light"))};this._onPointerUp=e=>{let t=this._swipe;if(this._swipe=null,!t||e.pointerId!==t.id||!t.sideways)return;t.el.classList.remove("dragging");let n=e.type==="pointercancel"?null:bc(e.clientX-t.x,t.velocity,t.width),o=n?gc(n,this._options()):null;if(n&&o){this._choose(o,n);return}t.el.style.removeProperty("--dx"),t.el.style.removeProperty("--tilt"),t.el.style.removeProperty("--swipe"),t.el.removeAttribute("data-armed"),delete t.el.dataset.side};this._onCardClick=e=>{if(this._dragged){this._dragged=!1;return}e.composedPath().some(t=>t instanceof HTMLButtonElement)||this._toggleScene()};this.cats=[]}static{this.properties={hass:{attribute:!1},entryId:{type:String},cats:{attribute:!1},cache:{attribute:!1},_open:{state:!0},_phase:{state:!0},_loadError:{state:!0},_queue:{state:!0},_stage:{state:!0},_follow:{state:!0},_photoIndex:{state:!0},_scene:{state:!0},_leaving:{state:!0},_gains:{state:!0},_imageFailed:{state:!0},_ownCats:{state:!0}}}show(e){if(!this._open){if(this._open=!0,this._stage="review",this._follow=null,this._resetPhoto(),this._gains=null,this._queue&&this._unsaved()>0){this._queue=Nr(this._queue),this._phase="ready",this._pump(),this._reload();return}this._queue=null,this._details.clear(),this._detailsAsked.clear(),this._load(e??null)}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._leaveTimer),clearTimeout(this._announceTimer),clearTimeout(this._retryTimer),this._clearGainTimers(),this._preloader.dispose()}willUpdate(e){if(!e.has("hass"))return;let t=this.hass?.connected!==!1;t&&!this._connected&&this._queue&&(this._queue=Nr(this._queue),queueMicrotask(()=>this._pump())),this._connected=t}updated(){let e=this.renderRoot.querySelector("dialog");if(e&&this._open&&!e.open&&e.showModal(),e&&!this._open&&e.open&&e.close(),!this._open){this._preloader.sync(void 0,void 0,[]);return}this._warmUp(),this._moveFocus()}async _load(e){let t=this.hass?.callWS,s=this.entryId,n=++this._generation;if(this._loadError=null,!t||!s){this._phase="error",this._loadError="Not connected.";return}this._phase="loading",this._readCats(!0);try{let o=await En(t,s);if(n!==this._generation)return;let a=zr(o.items,[]),l=!e||a.some(d=>d.key===e||d.event.uid===e);a.length>0&&l&&(this._queue=On(a,e),this._phase="ready");let u=await Tn(t,s);if(n!==this._generation)return;let h=zr(o.items,u);this._queue=this._queue?zn(this._queue,h):On(h,e),this._phase="ready"}catch(o){if(n!==this._generation)return;this._queue?this._phase="ready":(this._phase="error",this._loadError=j(o))}}async _reload(){let e=this.hass?.callWS,t=this.entryId;if(!e||!t)return;let s=this._generation;try{let[n,o]=await Promise.all([En(e,t),Tn(e,t)]);if(s!==this._generation||!this._queue)return;this._queue=zn(this._queue,zr(n.items,o))}catch{}}async _readCats(e){let t=this.hass?.callWS,s=this.entryId;if(!t||!s)return;let n=this._generation;try{let o=await t({type:"kibble/cats",entry_id:s});if(n!==this._generation)return;this._ownCats=o.cats,e?this._catsBefore=o.cats:this._catsBefore&&(this._gains=Hc(this._catsBefore,o.cats))}catch{}}_roster(){return this.cats.length?this.cats:this._ownCats}_options(){return _c(this._roster())}_warmUp(){let e=this._queue,t=this.hass,s=this.entryId,n=e?pe(e):null;if(!e||!n||!t?.callWS||!s){this._preloader.sync(void 0,void 0,[]);return}let o=Dn(e,Ph);for(let l of[n,...o.slice(0,Ah)]){if(this._detailsAsked.has(l.key))continue;this._detailsAsked.add(l.key);let u=this._generation;t.callWS({type:"kibble/event",entry_id:s,uid:l.event.uid}).then(h=>{u===this._generation&&(this._details.set(l.key,h),this.requestUpdate())},()=>{})}let a=Hn(n.event,this._details.get(n.key)?.samples??null);this._preloader.sync(t,this.cache,[n.event.scene,...a.slice(0,6),...o.map(l=>l.event.thumb??l.event.scene)])}_resetPhoto(){this._photoIndex=0,this._scene=!1,this._imageFailed=!1}_choose(e,t){let s=this._queue,n=s?pe(s):null;if(!s||!n||this._view()!=="review")return;let a=this._options().find(u=>u.id===e);if(!a)return;let l=this._roster();if(a.kind==="cat"){let u=l.findIndex(d=>d.name===a.cat),h=t??(l.length===2?u===0?"left":"right":"up");this._commit(n,xc(a.cat,n.isMeal),h,a.label,l.filter(d=>d.name===a.cat));return}if(a.kind==="several"){let u=l.map(h=>h.name);u.length>2?this._follow={mode:"pick",cats:[]}:n.isMeal?this._follow={mode:"ate",cats:u}:this._commit(n,Br(u,[],!1),"up",a.label,l);return}this._commit(n,{kind:a.kind},"down",a.label,[])}_togglePicked(e){let t=this._follow;if(!t||t.mode!=="pick")return;let s=t.cats.includes(e)?t.cats.filter(n=>n!==e):[...t.cats,e];this._follow={mode:"pick",cats:s}}_finishPick(){let e=this._follow,t=this._queue?pe(this._queue):null;if(!e||!t||e.cats.length<2)return;let n=this._roster().filter(o=>e.cats.includes(o.name));t.isMeal?this._follow={mode:"ate",cats:n.map(o=>o.name)}:this._commit(t,Br(n.map(o=>o.name),[],!1),"up","More than one",n)}_chooseAte(e){let t=this._follow,s=this._queue?pe(this._queue):null;if(!t||t.mode!=="ate"||!s)return;let n=this._roster().filter(o=>t.cats.includes(o.name));this._commit(s,Br(t.cats,e,!0),"up",t.cats.length===2?"Both":"More than one",n)}_commit(e,t,s,n,o){let a=this._queue;a&&(this._leaving={item:e,side:s,label:n,cats:o},clearTimeout(this._leaveTimer),this._leaveTimer=setTimeout(()=>{this._leaving=null},Oc),this._queue=Sc(a,t),this._follow=null,this._resetPhoto(),Lc(this._queue)?(this._stage="batch",oe("success"),this._reload()):pe(this._queue)?oe("light"):this._enterSummary(),this._pump())}_clearGainTimers(){for(let e of this._gainTimers)clearTimeout(e);this._gainTimers=[]}_unsaved(){if(!this._queue)return 0;let e=qr(this._queue);return e.pending+e.failed}_pump(){let e=this._queue,t=this.hass,s=this.entryId;if(!e||!t?.callWS||!s)return;let n=Tc(e),o=n?e.items.find(f=>f.key===n.key):void 0;if(!n||!o)return;let{key:a,seq:l}=n;this._queue=Pc(e,a,l);let u=!1,h=(f,m)=>{if(!u){if(u=!0,clearTimeout(d),m)this._queue&&(this._queue=Ac(this._queue,a,l)),this._retryDelay=Dc,this._scheduleAnnounce();else{let b=typeof f=="object"&&f!==null&&"code"in f&&f.code==="not_found";this._queue&&(this._queue=Rc(this._queue,a,l,j(f),b)),b||this._scheduleRetry()}this._pump()}},d=setTimeout(()=>h(new Error("Timed out."),!1),Th);Lr(t,s,wc(o,n.answer)).then(()=>h(null,!0),f=>h(f,!1))}_scheduleRetry(){this._retryTimer===void 0&&(this._retryTimer=setTimeout(()=>{this._retryTimer=void 0,this._retryDelay=Fr(this._retryDelay),this._retryNow()},this._retryDelay))}_scheduleAnnounce(){clearTimeout(this._announceTimer),this._announceTimer=setTimeout(()=>this._announce(),Eh)}_announce(){clearTimeout(this._announceTimer),this._announceTimer=void 0,this.entryId&&_i(this.entryId)}_keyOptions(){let e=this._follow;return e?e.mode==="ate"?jr(e.cats).map((t,s)=>({id:"ate:"+t.id,hotkey:String(s+1)})):this._roster().map((t,s)=>({id:"pick:"+t.name,hotkey:s<9?String(s+1):null})):this._options()}_run(e){if(e.type==="undo")this._undo();else if(e.type==="scene")this._toggleScene();else if(e.type==="photo")this._stepPhoto(e.delta);else if(e.optionId.startsWith("ate:")){let t=jr(this._follow?.cats??[]).find(s=>"ate:"+s.id===e.optionId);t&&this._chooseAte(t.ate)}else e.optionId.startsWith("pick:")?this._togglePicked(e.optionId.slice(5)):this._choose(e.optionId)}async _moveFocus(){let e=this._queue,t=e?pe(e):null,s=this._view()+":"+(t?.key??"")+":"+(this._follow?.mode??""),n=this.renderRoot.querySelector("[data-autofocus]"),o=this.renderRoot.querySelector(".answers"),a=n!==null&&o!==null&&this.shadowRoot?.activeElement===o;if(s===this._focusedKey&&!a)return;this._focusedKey=s;let l=n??o;l instanceof xi&&await l.updateComplete,s===this._focusedKey&&l?.focus({preventScroll:!0})}_photosFor(e){return Hn(e.event,this._details.get(e.key)?.samples??null)}_stepPhoto(e){let t=this._queue?pe(this._queue):null;if(!t)return;let s=this._photosFor(t).length;s<2||this._showPhoto((this._photoIndex+e+s)%s)}_showPhoto(e){this._photoIndex=e,this._scene=!1,this._imageFailed=!1}_swipeEnabled(){return this._view()==="review"&&!this._follow&&this._roster().length===2}_view(){let e=this._queue;return this._phase!=="ready"||!e?this._phase==="ready"?"loading":this._phase:this._stage!=="review"?this._stage:pe(e)?"review":e.history.length>0?"summary":"empty"}render(){return c`
      <dialog aria-label="Check visits" @cancel=${this._onCancel} @keydown=${this._onKeydown}>
        ${this._open?this._renderFrame():p}
      </dialog>
    `}_renderFrame(){let e=this._view(),t=this._queue,s=t?pe(t):null;return c`
      <div class="frame" @click=${this._onFrameClick}>
        <div class="panel view-${e}">
          ${this._renderTop(e,t)}
          <div class="stage">${this._renderStage(e,t,s)}</div>
          <div class="answers" tabindex="-1" role="group" aria-label=${this._title(e,t)}>${this._renderAnswers(e,t,s)}</div>
          ${this._renderFooter(e,t)}
          <p class="sr-only" aria-live="polite">${e==="review"&&s?this._spoken(s):""}</p>
        </div>
      </div>
    `}_title(e,t){return e==="review"?this._follow?.mode==="ate"?"Who ate?":"Who was here?":e==="batch"?"Batch done":e==="summary"?t&&Bt(t).remaining>0?"Done for now":"All caught up":e==="empty"?"Nothing to check":"Check visits"}_renderTop(e,t){let s=t&&(e==="review"||e==="batch")?Bt(t):null,n=e==="batch",o=s?n?s.batchSize:Math.min(s.batchDone+1,s.batchSize):0,a=s?s.remaining-(s.batchSize-s.batchDone):0,l=s?n?1:s.batchDone/Math.max(1,s.batchSize):0,u=t?.streak??0;return c`
      <header class="top">
        <div class="titles">
          <h2 class="title">${this._title(e,t)}</h2>
          ${s&&e==="review"?c`<span class="count">${o} of ${s.batchSize}</span>${a>0?c`<span class="later">${a} more after</span>`:p}`:p}
        </div>
        ${u>=3&&e==="review"?Pn(u,c`<span class="streak" aria-label=${`${u} in a row`}>${g("flash")}${u}</span>`):p}
        <button type="button" class="icon-btn" aria-label="Close" @click=${this._close}>${g("close")}</button>
        ${s?c`<div class="bar" role="progressbar" aria-label="This batch" aria-valuemin="0" aria-valuemax=${s.batchSize} aria-valuenow=${n?s.batchSize:s.batchDone}>
              <span style=${`transform:scaleX(${l})`}></span>
            </div>`:p}
      </header>
    `}_renderStage(e,t,s){if(e==="loading")return c`<div class="card placeholder" aria-label="Loading"></div>`;if(e==="error")return c`<div class="result"><span class="result-glyph muted">${g("cloudAlert")}</span><p class="result-line">${this._loadError??"Couldn\u2019t load visits."}</p></div>`;if(e==="empty")return c`<div class="result"><span class="result-glyph muted cat">${He()}</span><p class="result-line">Every visit has a name.</p></div>`;if(!t)return p;if(e==="batch"||e==="summary")return this._renderResult(e,t);let n=[];this._leaving&&this._leaving.item.key!==s?.key&&n.push({item:this._leaving.item,role:"leaving"}),s&&n.push({item:s,role:"current"});let o=Dn(t,1)[0];return o&&!n.some(a=>a.item.key===o.key)&&n.push({item:o,role:"next"}),c`
      <div class="deck">${Kl(n,a=>a.item.key,a=>this._renderCard(a.item,a.role))}</div>
      ${s?this._renderStrip(s):p}
    `}_renderCard(e,t){let s=this.hass?.locale?.language??this.hass?.language,n=Ln(e.event.start,new Date,s);if(t!=="current"){let h=t==="leaving"?this._leaving:null;return c`
        <div class="card ${t} ${h?"to-"+h.side:""}" aria-hidden="true">
          ${this._renderPhoto(e.event.thumb??e.event.scene,"")}
          ${h?c`<span class="stamp shown">${this._renderStampBody(h.cats,h.label)}</span>`:p}
        </div>
      `}let o=this._photosFor(e),a=this._scene?e.event.scene:o[this._photoIndex]??o[0]??e.event.scene,l=this._roster(),u=this._swipeEnabled();return c`
      <div
        class="card current ${u?"swipeable":""}"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @click=${this._onCardClick}
        @image-failed=${()=>{this._imageFailed=!0}}
      >
        ${this._renderPhoto(a,`${e.isMeal?"Meal":"Visit"}, ${n}`)}
        ${this._imageFailed?c`<div class="photo-error">${g("imageBroken")}<span>Photo didn\u2019t load</span><button type="button" class="pill-btn" @click=${this._retryImage}>Retry</button></div>`:p}
        <div class="chips">
          <span class="chip">${n}</span>
          <span class="chip">${e.isMeal?"Meal":"Visit"}</span>
        </div>
        ${e.event.scene?c`<button type="button" class="icon-btn on-photo scene-btn" aria-pressed=${this._scene} aria-label=${this._scene?"Show close-up":"Show whole scene"} @click=${this._toggleScene}>${g(this._scene?"arrowCollapse":"arrowExpand")}</button>`:p}
        ${u?c`
              <span class="stamp left">${this._renderStampBody([l[0]],l[0].name)}</span>
              <span class="stamp right">${this._renderStampBody([l[1]],l[1].name)}</span>
              <span class="swipe-hint left" aria-hidden="true">${g("chevronLeft")}<kibble-avatar .hass=${this.hass} .name=${l[0].name} .colorIndex=${l[0].color} .asset=${l[0].avatar} .cache=${this.cache}></kibble-avatar></span>
              <span class="swipe-hint right" aria-hidden="true"><kibble-avatar .hass=${this.hass} .name=${l[1].name} .colorIndex=${l[1].color} .asset=${l[1].avatar} .cache=${this.cache}></kibble-avatar>${g("chevronRight")}</span>
            `:p}
      </div>
    `}_renderPhoto(e,t){return e?c`<kibble-image eager fit="contain" .hass=${this.hass} .cache=${this.cache} .asset=${e} alt=${t}></kibble-image>`:c`<span class="no-photo">${He()}</span>`}_renderStampBody(e,t){return c`
      <span class="stamp-body" style=${e.length===1?`--stamp-color:${W(e[0].color)}`:""}>
        ${e.map(s=>c`<kibble-avatar .hass=${this.hass} .name=${s.name} .colorIndex=${s.color} .asset=${s.avatar} .cache=${this.cache}></kibble-avatar>`)}
        <span>${t}</span>
      </span>
    `}_renderStrip(e){let t=this._photosFor(e);return t.length<2?p:c`
      <div class="strip" role="group" aria-label="Photos of this visit">
        ${t.map((s,n)=>c`
            <button type="button" class="strip-btn" aria-pressed=${!this._scene&&n===this._photoIndex} aria-label=${`Photo ${n+1} of ${t.length}`} @click=${()=>this._showPhoto(n)}>
              <kibble-image .hass=${this.hass} .cache=${this.cache} .asset=${s} alt=""></kibble-image>
            </button>
          `)}
      </div>
    `}_renderResult(e,t){let s=this._roster(),n=Ic(t,s.map(l=>l.name)),o=Bt(t),a=n.cats.filter(l=>l.visits>0);return c`
      <div class="result">
        <span class="result-glyph done">${g("check")}</span>
        <p class="result-big">${n.total} ${n.total===1?"visit":"visits"} done</p>
        ${e==="batch"?c`<p class="result-line">${o.remaining} to go</p>`:p}
        ${a.length?c`<ul class="tallies">
              ${a.map(l=>{let u=s.find(d=>d.name===l.cat),h=e==="summary"?this._gains?.[l.cat]??0:0;return c`
                  <li class="tally" style=${u?`--tally-color:${W(u.color)}`:""}>
                    <kibble-avatar .hass=${this.hass} .name=${l.cat} .colorIndex=${u?.color??null} .asset=${u?.avatar??null} .cache=${this.cache}></kibble-avatar>
                    <span class="tally-text"><span class="tally-name">${l.cat}</span><span class="tally-sub">${l.visits} ${l.visits===1?"visit":"visits"}</span></span>
                    ${h>0?Pn(h,c`<span class="tally-gain"><strong>+${h}</strong><span>photos learned</span></span>`):p}
                  </li>
                `})}
            </ul>`:p}
        ${n.notACat+n.cantTell>0?c`<p class="result-others">
              ${n.notACat>0?c`<span class="chip">${g("cancel")}${n.notACat} not a cat</span>`:p}
              ${n.cantTell>0?c`<span class="chip">${g("helpCircle")}${n.cantTell} can\u2019t tell</span>`:p}
            </p>`:p}
      </div>
    `}_renderAnswers(e,t,s){if(e==="loading")return p;if(e==="error")return c`<div class="actions"><button type="button" class="primary-btn" data-autofocus @click=${()=>void this._load(null)}>Try again</button></div>`;if(e==="empty")return c`<div class="actions"><button type="button" class="primary-btn" data-autofocus @click=${this._close}>Done</button></div>`;if(e==="batch")return c`<div class="actions">
        <button type="button" class="primary-btn" data-autofocus @click=${this._keepGoing}>Keep going</button>
        <button type="button" class="plain-btn" @click=${this._enterSummary}>Stop here</button>
      </div>`;if(e==="summary"){let f=t?Bt(t).remaining>0:!1;return c`<div class="actions">
        ${f?c`<button type="button" class="plain-btn" @click=${this._keepGoing}>Keep going</button>`:p}
        <button type="button" class="primary-btn" data-autofocus @click=${this._close}>Done</button>
      </div>`}if(!t||!s)return p;let n=this._roster(),o=this._follow;if(o?.mode==="ate"){let f=n.filter(b=>o.cats.includes(b.name)),m=this._details.get(s.key)?.cats.filter(b=>b.ate).map(b=>b.cat)??[];return c`<div class="answer-row">
        ${jr(o.cats).map((b,v)=>{let _=m.length>0&&m.length===b.ate.length&&b.ate.every(k=>m.includes(k));return c`<kibble-choice
            .hass=${this.hass}
            .cache=${this.cache}
            .label=${b.label}
            .cats=${f.filter(k=>b.ate.includes(k.name))}
            .state=${_?"suggested":"neutral"}
            .hint=${String(v+1)}
            @click=${()=>this._chooseAte(b.ate)}
          ></kibble-choice>`})}
      </div>`}if(o?.mode==="pick")return c`
        <div class="answer-row">
          ${n.map((f,m)=>c`<kibble-choice
              .hass=${this.hass}
              .cache=${this.cache}
              .label=${f.name}
              .cats=${[f]}
              .state=${o.cats.includes(f.name)?"selected":"neutral"}
              .hint=${m<9?String(m+1):null}
              @click=${()=>this._togglePicked(f.name)}
            ></kibble-choice>`)}
        </div>
        <div class="actions"><button type="button" class="primary-btn" ?disabled=${o.cats.length<2} @click=${()=>this._finishPick()}>Next</button></div>
      `;let a=this._options(),l=this._guessFor(s,a),u=t.records[s.key],h=u?kc(u.answer):null,d=f=>{let m=f.id===h?"selected":!h&&f.id===l.optionId?"suggested":"neutral",b=f.kind==="cat"?n.filter(v=>v.name===f.cat):f.kind==="several"?n:[];return c`<kibble-choice
        .hass=${this.hass}
        .cache=${this.cache}
        .label=${f.label}
        .cats=${b}
        .icon=${f.kind==="not_a_cat"?"cancel":f.kind==="unknown"?"helpCircle":null}
        .state=${m}
        .hint=${f.hotkey}
        .caption=${m==="suggested"?l.caption:m==="selected"?"Your answer":null}
        ?data-autofocus=${m!=="neutral"}
        @click=${()=>this._choose(f.id)}
      ></kibble-choice>`};return c`
      <div class="answer-row cats">${a.filter(f=>f.kind==="cat").map(d)}</div>
      <div class="answer-row">${a.filter(f=>f.kind!=="cat").map(d)}</div>
    `}_guessFor(e,t){if(e.guesses.length>0){let o=e.confidence!==null?` ${Math.round(e.confidence*100)}%`:"";return{optionId:yc(e.guesses,t),caption:"Guess"+o}}let s=this._details.get(e.key)?.samples,n=s?Cc(s,this._roster().map(o=>o.name)):null;return n?{optionId:"cat:"+n.cat,caption:"Guess"}:{optionId:null,caption:null}}_spoken(e){let t=this.hass?.locale?.language??this.hass?.language,s=e.guesses.length?` Kibble guesses ${e.guesses.join(" and ")}.`:"";return`${e.isMeal?"Meal":"Visit"}, ${Ln(e.event.start,new Date,t)}.${s}`}_renderFooter(e,t){let s=t?qr(t):{pending:0,failed:0,gone:0},n=!!this._follow||t!==null&&t.history.length>0,o=e==="review"||e==="batch"||e==="summary",a=this.hass?.connected===!1;return c`
      <footer class="footer">
        ${o?c`<button type="button" class="plain-btn undo" ?disabled=${!n} @click=${this._undo}>${g("undo")}<span>${this._follow?"Back":"Undo"}</span><kbd aria-hidden="true">Z</kbd></button>`:c`<span></span>`}
        <div class="status" role="status">
          ${s.failed>0?c`<span class="status-text error">${g("cloudAlert")}${s.failed} not saved</span><button type="button" class="pill-btn" @click=${this._retryNow}>Retry</button>`:s.gone>0?c`<span class="status-text">${s.gone===1?"1 visit no longer exists":`${s.gone} visits no longer exist`}</span><button type="button" class="pill-btn" @click=${this._dismissGone}>OK</button>`:a?c`<span class="status-text">${g("cloudAlert")}Offline</span>`:s.pending>0?c`<span class="status-text saving" aria-label="Saving">${g("refresh")}${s.pending>3?s.pending:p}</span>`:t&&t.history.length>0?c`<span class="status-text" aria-label="All saved">${g("cloudCheck")}</span>`:p}
        </div>
      </footer>
    `}static{this.styles=x`
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
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
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
    .later {
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .streak {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 4px 8px 4px 4px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
      color: var(--primary-color, #03a9f4);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
    }
    .bar {
      grid-column: 1 / -1;
      height: 4px;
      border-radius: 2px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .bar span {
      display: block;
      height: 100%;
      border-radius: 2px;
      background: var(--primary-color, #03a9f4);
      transform-origin: left center;
      transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
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
    .icon-btn.on-photo {
      position: absolute;
      background: color-mix(in srgb, var(--card-background-color, #fff) 86%, transparent);
    }
    .scene-btn {
      top: 8px;
      right: 8px;
    }

    /* ---- Stage ---- */
    .stage {
      grid-area: stage;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
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
      cursor: pointer;
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
      animation: kibble-review-leave-up ${Oc}ms ease-in forwards;
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
    .chips {
      position: absolute;
      left: 8px;
      bottom: 8px;
      display: flex;
      gap: 4px;
      pointer-events: none;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 12px;
      line-height: 16px;
      font-variant-numeric: tabular-nums;
      background: color-mix(in srgb, var(--card-background-color, #fff) 86%, transparent);
      color: var(--primary-text-color);
    }
    .chip svg {
      font-size: 14px;
      color: var(--secondary-text-color);
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
    .strip {
      flex: none;
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 2px;
      scrollbar-width: none;
    }
    .strip-btn {
      flex: none;
      width: 48px;
      height: 48px;
      padding: 0;
      border: 0;
      border-radius: 8px;
      overflow: hidden;
      background: none;
      cursor: pointer;
      opacity: 0.6;
      transition:
        opacity 150ms ease-out,
        transform 90ms ease-out;
    }
    .strip-btn[aria-pressed="true"] {
      opacity: 1;
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 0;
    }
    .strip-btn:active {
      transform: scale(0.94);
    }

    /* ---- Result cards (batch, summary, empty, error) ---- */
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
    .result-glyph.cat svg {
      width: 56px;
      height: 56px;
    }
    .result-big {
      margin: 0;
      font-size: 34px;
      font-weight: 500;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
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
    .tally-gain {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .tally-gain strong {
      font-size: 22px;
      font-weight: 500;
      line-height: 1.1;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .result-others {
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }
    .result-others .chip {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
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
      grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
      gap: 8px;
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
      justify-content: space-between;
      gap: 12px;
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
    .status {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
    }
    .status-text {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .status-text svg {
      font-size: 20px;
    }
    .status-text.error {
      color: var(--error-color, #db4437);
    }
    .pill-btn {
      min-height: 48px;
      padding: 0 16px;
      border: 0;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
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
      .answer-row {
        grid-template-columns: minmax(0, 1fr);
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
      /* Too short for five stacked answers: back to the phone's two rows, so none scrolls away. */
      .answer-row {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      }
      .title {
        font-size: 16px;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .card.placeholder {
        animation: kibble-review-pulse 1.2s ease-in-out infinite alternate;
      }
      .streak {
        animation: kibble-review-bump 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
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
      .tally-gain {
        animation: kibble-review-bump 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .status-text.saving svg {
        animation: kibble-review-spin 0.9s linear infinite;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .card,
      .bar span,
      .icon-btn,
      .primary-btn,
      .plain-btn,
      .strip-btn {
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
      .plain-btn:active:not(:disabled),
      .strip-btn:active {
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
    @keyframes kibble-review-bump {
      from {
        transform: scale(0.8);
        opacity: 0.4;
      }
      to {
        transform: scale(1);
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
  `}};customElements.define("kibble-review-queue",Bn);var jn=class extends y{constructor(){super();this._count=null;this._generation=0;this._stopListening=null;this._loadCount=()=>{let e=this.hass?.callWS,t=this.entryId;if(!e||!t)return;this._countedEntry=t;let s=++this._generation;Vl(e,t).then(n=>{s===this._generation&&(this._count=n)},()=>{})};this.cats=[],this.variant="bar"}static{this.properties={hass:{attribute:!1},entryId:{type:String},cats:{attribute:!1},cache:{attribute:!1},variant:{type:String,reflect:!0},revision:{attribute:!1},_count:{state:!0}}}open(e){this.renderRoot.querySelector("kibble-review-queue")?.show(e)}connectedCallback(){super.connectedCallback(),this._stopListening=Ft(()=>this.entryId,()=>this._loadCount())}disconnectedCallback(){super.disconnectedCallback(),this._stopListening?.(),this._stopListening=null,this._generation++}willUpdate(e){!!(this.hass?.callWS&&this.entryId)&&(this.entryId!==this._countedEntry||e.has("revision"))&&this._loadCount()}render(){let e=this._count??0,t=e>0?`Check visits, ${e} ${e===1?"needs":"need"} a name`:"Check visits";return c`
      ${this.variant==="chip"?e>0?c`<button type="button" class="chip" aria-label=${t} @click=${()=>this.open()}>${g("helpCircle")}<span>${e} to check</span></button>`:p:c`<button type="button" class="bar" aria-label=${t} @click=${()=>this.open()}>
            <span class="bar-glyph">${g("helpCircle")}</span>
            <span class="bar-label">Check visits</span>
            ${e>0?c`<span class="badge">${e}</span>`:p}
            <span class="bar-chevron">${g("chevronRight")}</span>
          </button>`}
      <kibble-review-queue .hass=${this.hass} .entryId=${this.entryId} .cats=${this.cats} .cache=${this.cache} @review-closed=${this._loadCount}></kibble-review-queue>
    `}static{this.styles=x`
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
  `}};customElements.define("kibble-review-entry",jn);var kp=pu(wp(),1);function qo(i){for(let r of Object.values(i.entities??{}))if(r.platform==="scrypted"&&r.entity_id.startsWith("sensor.scrypted_token")){let e=i.states[r.entity_id]?.state;if(e&&e!=="unavailable"&&e!=="unknown")return e}}var No=class{constructor(){this.options={proxy:!0,userAgent:navigator.userAgent,capabilities:{audio:RTCRtpReceiver.getCapabilities?.("audio")??{codecs:[],headerExtensions:[]},video:RTCRtpReceiver.getCapabilities?.("video")??{codecs:[],headerExtensions:[]}},screen:{devicePixelRatio:window.devicePixelRatio,width:screen.width,height:screen.height}};this.__proxy_props={options:this.options}}async getOptions(){return this.options}createPeerConnection(r){if(this.pc)return this.pc;let e=new RTCPeerConnection(r.configuration);this.pc=e,e.addEventListener("iceconnectionstatechange",()=>{["disconnected","failed","closed"].includes(e.iceConnectionState)&&this.onClosed?.()});let t=new MediaStream;if(e.addEventListener("track",s=>{t.addTrack(s.track),this.onTrack?.(t)}),r.datachannel&&e.createDataChannel(r.datachannel.label,r.datachannel.dict),r.audio){let s=e.addTransceiver("audio",r.audio);(r.audio.direction==="sendrecv"||r.audio.direction==="sendonly")&&(this.microphone=s.sender)}return r.video&&e.addTransceiver("video",r.video),e}async createLocalDescription(r,e,t){let s=this.createPeerConnection(e),n=new Promise(u=>{s.onicecandidate=h=>{h.candidate?t?.(JSON.parse(JSON.stringify(h.candidate))):u()},s.onicegatheringstatechange=()=>{s.iceGatheringState==="complete"&&u()}}),o=r==="offer"?await s.createOffer({offerToReceiveAudio:!!e.audio,offerToReceiveVideo:!!e.video}):await s.createAnswer(),a=s.setLocalDescription(o);if(t)return{type:o.type,sdp:o.sdp};await a,await n;let l=s.localDescription??o;return{type:l.type,sdp:l.sdp}}async setRemoteDescription(r,e){await this.createPeerConnection(e).setRemoteDescription(r)}async addIceCandidate(r){await this.pc?.addIceCandidate(r)}async endSession(){}async setMicrophone(r){if(!this.microphone)throw new Error("this stream has no return-audio channel");if(r&&!this.micTrack){let e=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1});this.micTrack=e.getAudioTracks()[0],await this.microphone.replaceTrack(this.micTrack)}this.micTrack&&(this.micTrack.enabled=r)}close(){this.micTrack?.stop(),this.pc?.getSenders().forEach(r=>r.track?.stop()),this.pc?.close(),this.pc=void 0}},ys=class{constructor(r){this.state="idle";this.hasIntercom=!1;this.onChange=r}async open(r,e){this.close(),this.setState("connecting");try{let t=`${location.origin}/api/scrypted/${r.token}/`,s=await(0,kp.connectScryptedClient)({baseUrl:t,pluginId:"@scrypted/core",clientName:"kibble-card"});this.client=s;let n=s.systemManager.getDeviceById(r.deviceId);if(!n)throw new Error(`Scrypted has no device ${r.deviceId}`);let o=n.interfaces??[];if(!o.includes("RTCSignalingChannel"))throw new Error(`${n.name} has no WebRTC channel in Scrypted`);this.hasIntercom=o.includes("Intercom");let a=new No;this.session=a,a.onTrack=u=>{e.srcObject!==u&&(e.srcObject=u,e.play().catch(()=>{})),this.setState("live")},a.onClosed=()=>{this.session===a&&this.fail("stream disconnected")};let l=n;this.control=await l.startRTCSignalingSession(a)}catch(t){throw this.fail(t instanceof Error?t.message:String(t)),t}}async talk(r){if(!this.session)throw new Error("not connected");await this.session.setMicrophone(r),await this.control?.setPlayback({audio:r,video:!0})}close(){this.control?.setPlayback({audio:!1,video:!0}).catch(()=>{}),this.control=void 0,this.session?.close(),this.session=void 0,this.client?.disconnect?.(),this.client=void 0,this.state!=="idle"&&this.setState("idle")}fail(r){this.error=r,this.session?.close(),this.session=void 0,this.setState("error")}setState(r){this.state=r,r!=="error"&&(this.error=void 0),this.onChange()}};function Cp(i,r,e){return i&&r?{kind:"scrypted",deviceId:i,token:r}:e?{kind:"ha-camera",entityId:e}:{kind:"none"}}var Di={visible:!0},mb={visible:!1};function $p(i){return i.visible?{state:i,consumed:!1}:{state:Di,consumed:!0}}function Sp(i,r){return r?i:mb}function Ep(i,r){return i.visible&&!r}var gb=8e3,vb=2e3,_b=6e4,yb=1e3,xb=1e4,wb=1100,kb=1,Cb=2.4,$b=64,Uo=class extends y{constructor(){super();this._starting=!1;this._backoffMs=1e3;this._lastProgress=0;this._hiddenPaused=!1;this._visionQuery=new re(()=>this.requestUpdate());this._watchedStillImg=null;this._live=new ys(()=>{this._tick=(this._tick??0)+1});this._onScryptedLoadedMetadata=()=>{this._applyMute();let e=this.renderRoot.querySelector("#video");e&&this._reportMediaAspect(e.videoWidth,e.videoHeight)};this._onStillImgLoad=e=>{let t=e.target;this._reportMediaAspect(t.naturalWidth,t.naturalHeight)};this._start=async()=>{let e=qo(this.hass);if(!e||!this.scryptedId)return;this._starting=!0,this._playing=!0,this._lastProgress=performance.now(),await this.updateComplete;let t=this.renderRoot.querySelector("#video");if(!t){this._starting=!1;return}try{await this._live.open({deviceId:this.scryptedId,token:e},t),this._reconnecting=!1,this._backoffMs=1e3}catch{this._beginReconnect();return}finally{this._starting=!1}};this._onTimeUpdate=()=>{this._lastProgress=performance.now()};this._checkStall=()=>{this._videoSource().kind==="scrypted"&&(!this._playing||this._reconnecting||document.hidden||performance.now()-this._lastProgress>gb&&this._beginReconnect())};this._pollVision=()=>{let e=this.hass?.callWS,t=this.entryId;!e||!t||this._visionQuery.refresh(()=>e({type:"kibble/vision/last",entry_id:t}).then(s=>s))};this._onVisibilityChange=()=>{if(this._videoSource().kind==="scrypted"){if(document.hidden){clearTimeout(this._hiddenTimer),this._hiddenTimer=setTimeout(this._pauseForHidden,_b);return}if(clearTimeout(this._hiddenTimer),this._hiddenTimer=void 0,this._hiddenPaused){this._hiddenPaused=!1,this._backoffMs=1e3,this.requestUpdate();return}this._playing&&(this._lastProgress=performance.now())}};this._pauseForHidden=()=>{this._hiddenTimer=void 0,this._videoSource().kind==="scrypted"&&(!this._playing&&!this._reconnecting||(this._hiddenPaused=!0,this._reconnecting=!1,clearTimeout(this._reconnectTimer),this._reconnectTimer=void 0,this._live.close(),this._playing=!1,this._talking=!1))};this._stop=()=>{clearTimeout(this._reconnectTimer),this._reconnectTimer=void 0,clearTimeout(this._hiddenTimer),this._hiddenTimer=void 0,this._live.close(),this._playing=!1,this._talking=!1,this._starting=!1,this._reconnecting=!1,this._hiddenPaused=!1,this._backoffMs=1e3};this._onFrameClick=e=>{if(!this._overlayIdle.visible){this._applyOverlayIdle($p(this._overlayIdle).state),this._armIdleTimer(),e.stopPropagation();return}if(this._onOverlayActivity(),e.target.closest?.(".chip")){e.stopPropagation();return}this._expanded||this._expand()};this._collapse=e=>{e?.stopPropagation(),this._onOverlayActivity(),document.removeEventListener("keydown",this._onKeyDown),this._fullscreen&&(document.exitFullscreen?.()??Promise.resolve()).catch(()=>{}),this._expanded=!1};this._onKeyDown=e=>{e.key==="Escape"&&this._collapse()};this._toggleFullscreen=async e=>{if(e.stopPropagation(),this._onOverlayActivity(),this._fullscreen){await(document.exitFullscreen?.()??Promise.resolve()).catch(()=>{});return}let t=this.renderRoot.querySelector("#frame"),s=this.renderRoot.querySelector("#video");try{t?.requestFullscreen?await t.requestFullscreen():s?.webkitEnterFullscreen&&s.webkitEnterFullscreen()}catch{}};this._onFullscreenChange=()=>{let e=this.renderRoot,t=document,s=e.fullscreenElement??e.webkitFullscreenElement??null,n=document.fullscreenElement??t.webkitFullscreenElement??null,o=!1;for(let a=this;a&&n;a=a.host??a.parentNode)if(a===n){o=!0;break}this._fullscreen=s!==null||o};this._toggleMute=()=>{this._onOverlayActivity(),this._muted=!this._muted,this._videoSource().kind==="scrypted"&&this._applyMute()};this._applyMute=()=>{let e=this.renderRoot.querySelector("#video");e&&(e.muted=this._muted,e.play().catch(()=>{}))};this._toggleTalk=async()=>{this._onOverlayActivity();let e=!this._talking;this._talking=e;try{await this._live.talk(e)}catch{e&&(this._talking=!1)}};this._callCats=e=>{if(e.stopPropagation(),this._onOverlayActivity(),this._callingCats||!this.callCatsEntity)return;let t=this.callCatsEntity;this._callingCats=!0,this._pulsingCue=!0,this._cooldownTimer=setTimeout(()=>{this._callingCats=!1},xb),this._pulseTimer=setTimeout(()=>{this._pulsingCue=!1},wb),this.hass.callService("button","press",{entity_id:t}).catch(()=>{})};this._onOverlayActivity=()=>{this._applyOverlayIdle(Di),this._armIdleTimer()};this._onFrameFocusIn=e=>{this._onOverlayActivity();let t=e.target;this._controlsFocusVisible=typeof t.matches=="function"&&t.matches(":focus-visible")};this._onFrameFocusOut=e=>{let t=e.relatedTarget,s=this.renderRoot.querySelector("#frame");(!t||!s?.contains(t))&&(this._controlsFocusVisible=!1)};this._onIdleTimerFired=()=>{this._idleTimer=void 0,this._applyOverlayIdle(Sp(this._overlayIdle,this._idlePinned()))};this.cats=[],this._playing=!1,this._talking=!1,this._muted=!0,this._reconnecting=!1,this._expanded=!1,this._fullscreen=!1,this._tick=0,this._callingCats=!1,this._pulsingCue=!1,this._overlayIdle=Di,this._controlsFocusVisible=!1}static{this.properties={hass:{attribute:!1},cameraEntity:{attribute:!1},cats:{attribute:!1},cache:{attribute:!1},scryptedId:{attribute:!1},entryId:{attribute:!1},overlayEntity:{attribute:!1},callCatsEntity:{attribute:!1},externalPin:{attribute:!1},_playing:{state:!0},_talking:{state:!0},_muted:{state:!0},_reconnecting:{state:!0},_expanded:{state:!0},_fullscreen:{state:!0},_tick:{state:!0},_callingCats:{state:!0},_pulsingCue:{state:!0},_overlayIdle:{state:!0},_controlsFocusVisible:{state:!0}}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),document.addEventListener("fullscreenchange",this._onFullscreenChange),document.addEventListener("webkitfullscreenchange",this._onFullscreenChange),this._stallCheckInterval=setInterval(this._checkStall,vb),this._armIdleTimer()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibilityChange),document.removeEventListener("fullscreenchange",this._onFullscreenChange),document.removeEventListener("webkitfullscreenchange",this._onFullscreenChange),document.removeEventListener("keydown",this._onKeyDown),clearInterval(this._stallCheckInterval),this._stallCheckInterval=void 0,clearInterval(this._visionTimer),this._visionTimer=void 0,clearTimeout(this._cooldownTimer),this._cooldownTimer=void 0,clearTimeout(this._pulseTimer),this._pulseTimer=void 0,clearTimeout(this._idleTimer),this._idleTimer=void 0,this._stop()}_videoSource(){return this.hass?Cp(this.scryptedId,qo(this.hass),this.cameraEntity):{kind:"none"}}updated(e){this._syncVisionPolling(),this._syncStillAspectWatch(),(e.has("_talking")||e.has("_pulsingCue")||e.has("_controlsFocusVisible")||e.has("externalPin"))&&this._syncIdlePin();let t=this._videoSource();if(t.kind!=="scrypted"){(this._starting||this._reconnecting||this._hiddenPaused||this._live.state!=="idle")&&this._stop(),this._playing=t.kind==="ha-camera";return}if(this._live.state==="error"&&this._playing){this._beginReconnect();return}this._playing||this._starting||this._reconnecting||this._hiddenPaused||this._start()}render(){let e=this._videoSource();return c`
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
                ${g(this._fullscreen?"fullscreenExit":"fullscreen")}
              </button>
              <button class="chip" aria-label="Close" title="Close" @click=${this._collapse}>${g("close")}</button>
            </div>`:p}
        ${e.kind==="scrypted"&&this._reconnecting?c`<div class="reconnect" role="status" aria-label="Reconnecting to the feeder's camera">${g("refresh")}</div>`:p}
        <div class="controls ${this._overlayIdle.visible?"":"idle-hidden"}">
          ${this._playing?c`<button
                class="chip"
                aria-pressed=${!this._muted}
                aria-label=${this._muted?"Unmute the feeder":"Mute the feeder"}
                title=${this._muted?"Unmute the feeder":"Mute the feeder"}
                @click=${this._toggleMute}
              >
                ${g(this._muted?"volumeOff":"volumeHigh")}
              </button>`:p}
          ${this._playing&&e.kind==="scrypted"&&this._live.hasIntercom?c`<button
                class="chip talk"
                aria-pressed=${this._talking}
                aria-label=${this._talking?"Stop talking to the feeder":"Talk to the feeder"}
                title=${this._talking?"Stop talking to the feeder":"Talk to the feeder"}
                @click=${this._toggleTalk}
              >
                ${g(this._talking?"microphone":"microphoneOff")}
              </button>`:p}
          ${this._callCatsAvailable()?c`<button
                class="chip call-cats ${this._pulsingCue?"pulsing":""}"
                aria-label="Call the cats"
                title="Call the cats"
                ?disabled=${this._callingCats}
                @click=${this._callCats}
              >
                ${g("cat")}
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
      ></ha-camera-stream>`:p}_renderStill(){if(!this.cameraEntity)return c`<div class="placeholder">No camera on this device</div>`;if(customElements.get("hui-image"))return c`<hui-image .hass=${this.hass} .cameraImage=${this.cameraEntity} cameraView="auto"></hui-image>`;let e=this.hass.states[this.cameraEntity]?.attributes.entity_picture;return typeof e=="string"?c`<img src=${e} alt="The feeder's camera" @load=${this._onStillImgLoad} />`:c`<div class="placeholder">Camera unavailable</div>`}_reportMediaAspect(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)return;let s=Math.min(Cb,Math.max(kb,e/t));this._reportedAspect!==void 0&&Math.abs(this._reportedAspect-s)<.001||(this._reportedAspect=s,this.style.setProperty("--kibble-hero-aspect",String(s)),this.dispatchEvent(new CustomEvent("media-aspect-changed",{detail:{ratio:s},bubbles:!0,composed:!0})))}_syncStillAspectWatch(){let t=this.renderRoot.querySelector("hui-image")?.shadowRoot?.querySelector("img")??null;t!==this._watchedStillImg&&(this._watchedStillImg&&this._watchedStillImg.removeEventListener("load",this._onStillImgLoad),this._watchedStillImg=t,t&&(t.complete&&t.naturalWidth>0&&this._reportMediaAspect(t.naturalWidth,t.naturalHeight),t.addEventListener("load",this._onStillImgLoad,{once:!0})))}_renderDetections(){let e=this._visionQuery.state.data?.frame;if(!this._overlayOn()||!e?.detections)return p;let t=e.overlay_suppressed??!0,s=e.detections.filter(o=>o.admitted||t);if(s.length===0)return p;let n=s.map((o,a)=>{let l=o.cat||null,u=l?this.cats?.find(d=>d.name===l):void 0,h=o.admitted&&l!==null;return{key:`vision-${o.sid??"unmatched"}-${a}`,box:[o.x1,o.y1,o.x2,o.y2],tone:o.admitted?h?"cat":"unknown":"clutter",color:h?u?W(u.color):ye(l):void 0,label:h?l:void 0,avatar:u?.avatar??null}});return c`<kibble-box-overlay class="detections" .boxes=${n} .hass=${this.hass} .cache=${this.cache} .labelSafeTop=${$b}></kibble-box-overlay>`}_beginReconnect(){this._playing=!1,this._reconnecting=!0,this._talking=!1,this._live.close(),this._reconnectTimer===void 0&&(this._reconnectTimer=setTimeout(()=>{this._reconnectTimer=void 0,this._start()},this._backoffMs),this._backoffMs=Fr(this._backoffMs))}_overlayOn(){let e=this.overlayEntity;return e!==void 0&&this.hass?.states[e]?.state==="on"}_syncVisionPolling(){let e=this._playing&&this._overlayOn()&&!!this.entryId&&!!this.hass?.callWS,t=this._visionTimer!==void 0;if(e!==t){if(!e){this._stopVisionPolling();return}this._pollVision(),this._visionTimer=setInterval(this._pollVision,yb)}}_stopVisionPolling(){clearInterval(this._visionTimer),this._visionTimer=void 0,this._visionQuery=new re(()=>this.requestUpdate())}_expand(){this._expanded=!0,document.addEventListener("keydown",this._onKeyDown)}_callCatsAvailable(){let e=this.callCatsEntity;return e!==void 0&&this.hass?.states[e]?.state!=="unavailable"}notifyActivity(){this._onOverlayActivity()}_applyOverlayIdle(e){let t=e.visible!==this._overlayIdle.visible;this._overlayIdle=e,t&&this.dispatchEvent(new CustomEvent("overlay-idle-changed",{detail:{visible:e.visible},bubbles:!0,composed:!0}))}_idlePinned(){return this._talking||this._pulsingCue||this._controlsFocusVisible||!!this.externalPin}_syncIdlePin(){if(this._idlePinned()){clearTimeout(this._idleTimer),this._idleTimer=void 0,this._overlayIdle.visible||this._applyOverlayIdle(Di);return}this._idleTimer===void 0&&this._armIdleTimer()}_armIdleTimer(){clearTimeout(this._idleTimer),this._idleTimer=void 0,Ep(this._overlayIdle,this._idlePinned())&&(this._idleTimer=setTimeout(this._onIdleTimerFired,5e3))}static{this.styles=x`
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
  `}};customElements.define("kibble-live-hero",Uo);async function Tp(){return customElements.get("bubble-card")?!0:(await Promise.race([customElements.whenDefined("bubble-card"),new Promise(i=>setTimeout(i,2e3))]),!!customElements.get("bubble-card"))}var Vo=class extends y{constructor(){super(...arguments);this._builtFor=""}static{this.properties={hass:{attribute:!1},config:{attribute:!1}}}updated(){this._sync()}async _sync(){if(!this.config)return;let e=JSON.stringify(this.config);if(e!==this._builtFor){this._builtFor=e;let t=await window.loadCardHelpers?.();if(!t||e!==this._builtFor)return;let s=t.createCardElement({type:"custom:bubble-card",...this.config});this._element?.remove(),this._element=s,this.renderRoot.querySelector(".slot")?.appendChild(s)}this._element&&this.hass&&(this._element.hass=this.hass)}render(){return c`<div class="slot"></div>`}static{this.styles=x`
    :host {
      display: block;
    }
    .slot > * {
      /* Bubble rows carry their own outer margin for stacking; the card lays them out itself. */
      --bubble-margin: 0;
    }
  `}};customElements.define("kibble-bubble-row",Vo);var Sb=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"scrypted_id",selector:{text:{}}},{name:"settings_hash",selector:{text:{}}},{name:"detection_areas_hash",selector:{text:{}}},{name:"schedule_hash",selector:{text:{}}}],Eb={device_id:"Kibble device",name:"Name (optional)",scrypted_id:"Scrypted camera id (optional, adds low-latency video and talk)",settings_hash:"Settings pop-up hash (optional)",detection_areas_hash:"Detection areas pop-up hash (optional)",schedule_hash:"Schedule handled by dashboard (optional hash)"},Wo=class extends y{constructor(){super(...arguments);this._computeLabel=e=>Eb[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${Sb}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateSettingsHash(e){this._config&&(this._config={...this._config,settings_hash:e||void 0},this._fireConfigChanged())}_updateDetectionAreasHash(e){this._config&&(this._config={...this._config,detection_areas_hash:e||void 0},this._fireConfigChanged())}_updateScheduleHash(e){this._config&&(this._config={...this._config,schedule_hash:e||void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=x`
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
  `}};customElements.define("kibble-card-editor",Wo);var ws=class{constructor(r){this._onChanged=r;this._unsubscribe=null;this._subscribing=!1}sync(r,e){e!==this._entryId&&(this._entryId=e,this._resubscribe(r,e))}async _resubscribe(r,e){let t=this._unsubscribe;if(this._unsubscribe=null,t&&await t().catch(()=>{}),!(!r?.connection||!e||this._subscribing)){this._subscribing=!0;try{let s=await r.connection.subscribeMessage(()=>{this._entryId===e&&this._onChanged()},{type:"kibble/timeline/subscribe",entry_id:e});if(this._subscribing=!1,this._entryId!==e){s().catch(()=>{});return}this._unsubscribe=s}catch{this._subscribing=!1}}}dispose(){let r=this._unsubscribe;this._unsubscribe=null,this._entryId=void 0,r&&r().catch(()=>{})}};var ks=class{constructor(r){this._onChange=r;this.state={items:null,loading:!1,loadingMore:!1,cursor:null,hasMore:!1,error:null};this._key=null;this._generation=0;this._lastLimit=30;this._live=new ws(()=>this._onLiveChange())}sync(r,e,t){this._lastHass=r,this._lastEntryId=e,this._lastLimit=t,this._live.sync(r,e);let s=e?`${e}:${t}`:null;s!==this._key&&(this._key=s,!(!r?.callWS||!e)&&this._readPage(r,e,t,null,++this._generation,!0))}loadMore(r,e,t){!r?.callWS||!e||this.state.loading||this.state.loadingMore||!this.state.hasMore||this._readPage(r,e,t,this.state.cursor,this._generation,!1)}refresh(r,e,t){!r?.callWS||!e||this._readPage(r,e,t,null,++this._generation,!0)}replaceItem(r,e){let t=this.state.items;if(!t)return;let s=t.findIndex(o=>o.uid===r);if(s===-1)return;let n=t.slice();n[s]=e,this.state={...this.state,items:n},this._onChange()}removeItem(r){let e=this.state.items;e&&e.some(t=>t.uid===r)&&(this.state={...this.state,items:e.filter(t=>t.uid!==r)},this._onChange())}restoreItems(r){this.state={...this.state,items:r},this._onChange()}_onLiveChange(){this.refresh(this._lastHass,this._lastEntryId,this._lastLimit)}async _readPage(r,e,t,s,n,o){this.state=o?{...this.state,loading:!0,error:null}:{...this.state,loadingMore:!0,error:null},this._onChange();try{let a=await r.callWS({type:"kibble/timeline",entry_id:e,limit:t,...s?{cursor:s}:{}});if(n!==this._generation)return;let l=o?a.items:[...this.state.items??[],...a.items];this.state={items:l,loading:!1,loadingMore:!1,cursor:a.cursor,hasMore:a.has_more,error:null}}catch(a){if(n!==this._generation)return;this.state={...this.state,loading:!1,loadingMore:!1,error:j(a)}}this._onChange()}dispose(){this._generation+=1,this._live.dispose()}};async function Pp(i,r,e){if(!i.callWS)throw new Error("Not connected.");return(await i.callWS({type:"kibble/sample/label",entry_id:r,sample_uid:e.sampleUid,label:e.label})).sample}function Tb(i,r){return i.label==="unknown"?null:i.label==="not_a_cat"?"Not a cat":`${i.label} ${Ye(i.event)} at ${he(i.event.start,r)}`}function Pb(i){return i<=0?null:`${i} photo${i===1?"":"s"} updated`}function Ap(i,r){let e=new Map;for(let n of i.events)e.set(n.uid,n);let t=[];for(let n of e.values()){let o=Tb(n,r);o&&t.push(o)}let s=Pb(i.photosUpdated);return s&&t.push(s),t.length===0?null:`Saved: ${t.join(", ")}`}function Rp(i,r){let e=i*1e3-r-3e3;return Math.max(0,e)/1e3}var Ko=class extends y{constructor(){super();this._focusTrigger=null;this._pointerDown=e=>{this._pickerKey&&!e.composedPath().includes(this)&&this._closePicker(!1)};this._keyDown=e=>{e.key!=="Escape"||!this._pickerKey||(e.preventDefault(),e.stopPropagation(),this._closePicker(!0))};this._repositionLabels=()=>{let e=this.getBoundingClientRect();if(e.width<=0||e.height<=0)return;let t=[...this.renderRoot.querySelectorAll(".label")],s=this.boxes.flatMap(a=>{let l=a.label??(a.tone==="not-cat"?"Not a cat":null);if(!l)return[];let h=t.find(d=>d.dataset.labelKey===a.key)?.getBoundingClientRect();return[{key:a.key,box:a.box,width:h?.width||Math.max(44,l.length*7+34),height:h?.height||22}]}),n=Object.fromEntries(Ol(s,e.width,e.height,4,this.labelSafeTop).map(a=>[a.key,a])),o=Object.keys(n);o.length===Object.keys(this._labelPositions).length&&o.every(a=>{let l=this._labelPositions[a],u=n[a];return l?.left===u?.left&&l?.top===u?.top&&l?.flipped===u?.flipped})||(this._labelPositions=n)};this._repositionPicker=()=>{if(!this._pickerKey)return;let e=this.boxes.find(l=>l.key===this._pickerKey),t=this.renderRoot.querySelector(".picker"),s=this.getBoundingClientRect();if(!e||!t||s.width<=0||s.height<=0)return;let n=t.getBoundingClientRect(),o=ic(e.box,s.width,s.height,n.width,n.height),a=this._pickerPlacement;a?.left===o.left&&a.top===o.top&&a.flipped===o.flipped||(this._pickerPlacement=o)};this.boxes=[],this.cats=[],this.busy=!1,this.labelSafeTop=0,this._labelPositions={},this._pickerKey=null,this._pickerPlacement=null}static{this.properties={boxes:{attribute:!1},hass:{attribute:!1},cache:{attribute:!1},cats:{attribute:!1},busy:{type:Boolean},labelSafeTop:{attribute:!1},_labelPositions:{state:!0},_pickerKey:{state:!0},_pickerPlacement:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("pointerdown",this._pointerDown,!0),window.addEventListener("keydown",this._keyDown,!0)}firstUpdated(){this._resizeObserver=new ResizeObserver(()=>{this._repositionLabels(),this._repositionPicker()}),this._resizeObserver.observe(this),this._repositionLabels()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("pointerdown",this._pointerDown,!0),window.removeEventListener("keydown",this._keyDown,!0),this._resizeObserver?.disconnect(),this._resizeObserver=void 0}updated(e){(e.has("boxes")||e.has("labelSafeTop"))&&this._repositionLabels(),e.has("boxes")&&this._pickerKey&&!this.boxes.some(t=>t.key===this._pickerKey)&&this._closePicker(!1),(e.has("_pickerKey")||e.has("boxes")||e.has("cats"))&&this._repositionPicker()}_openPicker(e,t){this.busy||e.subjectSid==null||(this._focusTrigger=t.currentTarget,this._pickerPlacement=null,this._pickerKey=e.key,this.updateComplete.then(async()=>{this._repositionPicker(),await this.updateComplete,this.renderRoot.querySelector(".picker-option:not([disabled])")?.focus()}))}_closePicker(e){let t=this._focusTrigger;this._pickerKey=null,this._pickerPlacement=null,this._focusTrigger=null,e&&t?.focus()}_chooseSubject(e,t){this.busy||e.subjectSid==null||(this._closePicker(!0),this.dispatchEvent(new CustomEvent("subject-label-requested",{detail:{sid:e.subjectSid,label:t},bubbles:!0,composed:!0})))}render(){let e=this.boxes.some(s=>s.selectable),t=this.boxes.find(s=>s.key===this._pickerKey);return c`
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
    </div>`}_renderBox(e){let t=Pr(e.box),s=`left:${t.left};top:${t.top};width:${t.width};height:${t.height};--box-color:${e.color??"rgba(255,255,255,.9)"};`,n=e.emphasis??"normal",o=e.label??(e.tone==="not-cat"?"Not a cat":null),a=this._labelPositions[e.key],l=a?`left:${a.left}px;top:${a.top}px;`:`left:${t.left};top:${t.top};`;return c`
      <div class="box-wrap tone-${e.tone} emphasis-${n}" style=${s}>
        <span class="stroke"></span>
        ${e.selectable?c`<button type="button" class="hit" aria-label=${o?`Name ${o}`:"Name this animal"} @click=${u=>this._openPicker(e,u)}></button>`:p}
      </div>
      ${o?c`<span class="label tone-${e.tone} emphasis-${n}" data-label-key=${e.key} style=${l}>
        ${e.tone==="cat"?c`<span class="avatar-ring" style=${`--box-color:${e.color??"var(--primary-color)"}`}><span class="monogram" aria-hidden="true">${o.trim().charAt(0).toUpperCase()}</span>${e.avatar?c`<kibble-image .hass=${this.hass} .asset=${e.avatar} .cache=${this.cache} alt=""></kibble-image>`:p}</span>`:e.tone==="unknown"?c`<span class="unknown-avatar">?</span>`:p}
        <span class="label-text">${o}</span>
      </span>`:p}`}static{this.styles=x`
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
  `}};customElements.define("kibble-box-overlay",Ko);var Ab=["button:not([disabled])","[href]","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),Rb=350,Mb=700,Lb=48,Go=class extends y{constructor(){super();this._index=0;this._pendingOption=null;this._justSavedUid=null;this._closeRef=T();this._touchStartX=0;this._touchStartY=0;this._keydownHandler=e=>{if(!this.open)return;if(e.key==="Escape"){e.preventDefault(),this._requestClose();return}if(e.key==="ArrowLeft"){e.preventDefault(),this._go(-1);return}if(e.key==="ArrowRight"){e.preventDefault(),this._go(1);return}if(e.key!=="Tab")return;let t=[...this.renderRoot.querySelectorAll(Ab)];if(t.length===0){e.preventDefault(),this._closeRef.value?.focus();return}let s=this.renderRoot.querySelector(":focus"),n=s?t.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=t.length)&&(e.preventDefault(),(e.shiftKey?t[t.length-1]:t[0])?.focus())};this._requestClose=()=>{this.dispatchEvent(new CustomEvent("viewer-close-requested",{bubbles:!0,composed:!0}))};this._onTouchStart=e=>{let t=e.touches[0];t&&(this._touchStartX=t.clientX,this._touchStartY=t.clientY)};this._onTouchEnd=e=>{let t=e.changedTouches[0];if(!t)return;let s=t.clientX-this._touchStartX,n=t.clientY-this._touchStartY;Math.abs(s)<Lb||Math.abs(s)<Math.abs(n)*1.5||this._go(s<0?1:-1)};this._requestBoxesVisibility=()=>{this.dispatchEvent(new CustomEvent("boxes-visibility-requested",{detail:{visible:!this.showBoxes},bubbles:!0,composed:!0}))};this.open=!1,this.cats=[],this.samples=[],this.initialIndex=0,this.event=null,this.busyUid=null,this.error=null,this.showBoxes=!0}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},cache:{attribute:!1},cats:{attribute:!1},samples:{attribute:!1},initialIndex:{type:Number},event:{attribute:!1},busyUid:{attribute:!1},error:{type:String},showBoxes:{type:Boolean},_index:{state:!0},_justSavedUid:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),clearTimeout(this._justSavedTimer),clearTimeout(this._advanceTimer)}willUpdate(e){if(e.has("open")&&this.open&&(this._index=this.initialIndex,this._justSavedUid=null,this._pendingOption=null),e.has("busyUid")){let t=e.get("busyUid");this._pendingOption=null,t&&this.busyUid===null&&!this.error&&this.samples[this._index]?.uid===t&&this._flashSaved(t)}}updated(e){e.has("open")&&this.open&&this._closeRef.value?.focus()}_flashSaved(e){clearTimeout(this._justSavedTimer),this._justSavedUid=e,this._justSavedTimer=setTimeout(()=>{this._justSavedUid=null},Mb),clearTimeout(this._advanceTimer),this._advanceTimer=setTimeout(()=>{this._index<this.samples.length-1&&this._go(1)},Rb)}_go(e){let t=this._index+e;t<0||t>=this.samples.length||(this._index=t,this._justSavedUid=null)}_catColor(e){let t=this.cats.find(s=>s.name===e);return t?W(t.color):ye(e)}_photoOverlayBoxes(e){if(!e.body||!e.box||!e.crop)return[];let t=Ot(e.box,e.crop);if(!t)return[];let s=e.label??e.guess,n=s==="not_a_cat"?"not-cat":s&&s!=="skip"?"cat":"unknown",o=n==="cat"?this.cats.find(a=>a.name===s):null;return[{key:"sample:"+e.uid,box:t,tone:n,label:s&&s!=="not_a_cat"&&s!=="skip"?s:n==="not-cat"?"Not a cat":"Who?",color:s&&s!=="not_a_cat"&&s!=="skip"?this._catColor(s):void 0,avatar:o?.avatar??null},...e.peers.flatMap((a,l)=>{let u=Ot(a,e.crop);return u?[{key:"peer:"+e.uid+":"+l,box:u,tone:"peer"}]:[]})]}render(){if(!this.open)return p;let e=this.samples[this._index];if(!e)return p;let t=this.samples.length,s=e.body??e.face,n=e.body&&e.face?e.face:null,o=this.busyUid!==null;return c`
      <div class="scrim" role="dialog" aria-modal="true" aria-label=${`Photo ${this._index+1} of ${t}`} @click=${this._requestClose}>
        <div class="panel" @click=${a=>a.stopPropagation()} @touchstart=${this._onTouchStart} @touchend=${this._onTouchEnd}>
          <div class="panel-top">
            <span class="counter">${this._index+1} / ${t}</span>
            <button type="button" class="close" ${P(this._closeRef)} aria-label="Close photo" @click=${this._requestClose}>${g("close")}</button>
          </div>
          <div class="stage">
            ${s?c`<div class="image-frame"><kibble-image .hass=${this.hass} .asset=${s} .cache=${this.cache} alt="" fit="contain"></kibble-image>${e.body&&this.showBoxes?c`<kibble-box-overlay .boxes=${this._photoOverlayBoxes(e)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>`:p}</div>`:p}
            ${e.body&&e.box&&e.crop?c`<button type="button" class="box-toggle" aria-pressed=${this.showBoxes} aria-label=${this.showBoxes?"Hide boxes":"Show boxes"} @click=${this._requestBoxesVisibility}>${g(this.showBoxes?"eye":"eyeOff")}</button>`:p}
            ${n?c`<span class="face-inset"><kibble-image .hass=${this.hass} .asset=${n} .cache=${this.cache} alt="" rounded></kibble-image></span>`:p}
            <button type="button" class="nav prev" aria-label="Previous photo" ?disabled=${this._index===0} @click=${()=>this._go(-1)}>
              <span class="chevron chevron-left">${g("chevronDown")}</span>
            </button>
            <button type="button" class="nav next" aria-label="Next photo" ?disabled=${this._index===t-1} @click=${()=>this._go(1)}>
              <span class="chevron chevron-right">${g("chevronDown")}</span>
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
    `}_choiceState(e,t){return e==="skip"?t.review==="skip"?"confirmed":"neutral":t.review!==null?t.review===e?"confirmed":"neutral":t.label===e?"suggested":"neutral"}_renderChoice(e,t,s,n){let o=this._choiceState(e,s);return c`<kibble-choice
      .hass=${this.hass}
      .cache=${this.cache}
      .label=${t?t.name:e==="skip"?"Don\u2019t use":"Not a cat"}
      .cats=${t?[t]:[]}
      .icon=${t?null:e==="skip"?"eyeOff":"cancel"}
      .state=${o==="confirmed"?"selected":o}
      .busy=${n&&this.busyUid===s.uid&&this._pendingOption===e}
      .pop=${this._justSavedUid===s.uid&&o==="confirmed"}
      ?disabled=${n}
      @click=${()=>this._choose(e,s)}
    ></kibble-choice>`}_choose(e,t){let s=this.event?.identity==="reviewed"&&this.event.cat===e;this._pendingOption=e,this.dispatchEvent(new CustomEvent("sample-label-requested",{detail:{sampleUid:t.uid,label:s?"follow":e},bubbles:!0,composed:!0}))}static{this.styles=x`
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
    .chip-row {
      flex-shrink: 0;
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 12px 12px max(12px, env(safe-area-inset-bottom));
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .chip-row kibble-choice {
      flex: 1 1 0;
      min-width: 76px;
    }
    .viewer-error {
      flex-shrink: 0;
      margin: 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(219, 68, 55, 0.25);
      color: #ffb4ac;
      font-size: 14px;
    }
    .box-toggle:focus-visible,
    .close:focus-visible,
    .nav:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  `}};customElements.define("kibble-photo-viewer",Go);var Ib=["button:not([disabled])","[href]","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),Hb=3600,Ob=1.6,Yo=12,Db=6,Qo="kibble:show-boxes",Xo="kibble-boxes-visibility-changed";function Fb(){try{return localStorage.getItem(Qo)!=="false"}catch{return!0}}var Zo=class extends y{constructor(){super();this._draft=null;this._photosExpanded=!1;this._viewerIndex=null;this._zoom=null;this._lastEventUid=null;this._beforeRef=new qe;this._afterRef=new qe;this._sceneRef=new qe;this._closeButtonRef=T();this._videoRef=T();this._clipSrc=null;this._clipError=!1;this._clipEventUid=null;this._keydownHandler=e=>{if(!this.open||e.key==="Escape"&&e.composedPath().some(a=>a instanceof Element&&a.matches(".picker"))||this._viewerIndex!==null)return;if(e.key==="Escape"){e.preventDefault(),this._zoom?this._zoom=null:this._close();return}if(e.key!=="Tab")return;let t=[...this.renderRoot.querySelectorAll(Ib)];if(t.length===0){e.preventDefault(),this._closeButtonRef.value?.focus();return}let s=this.renderRoot.querySelector(":focus"),n=s?t.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=t.length)&&(e.preventDefault(),(e.shiftKey?t[t.length-1]:t[0])?.focus())};this._onSharedBoxesChange=e=>{let t=e.detail?.visible;typeof t=="boolean"&&(this._showBoxes=t)};this._onStorage=e=>{e.key===Qo&&(this._showBoxes=e.newValue!=="false")};this._toggleBoxes=()=>this._setBoxesVisible(!this._showBoxes);this._onSubjectLabelSelected=e=>{let t=this.summary;if(!t)return;let s=this._draft??Mr(this._sessionCatsFor(t),t.identity);this._draft=Ql(s,e.detail.sid,e.detail.label,t.kind==="eat")};this._onBoxesVisibilityRequested=e=>{let t=e.detail?.visible;typeof t=="boolean"&&this._setBoxesVisible(t)};this._onViewerClose=()=>{this._viewerIndex=null};this._retrySamples=()=>{this.dispatchEvent(new CustomEvent("samples-retry-requested",{bubbles:!0,composed:!0}))};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.cats=[],this.summary=null,this.samples=null,this.samplesFailed=!1,this.group=[],this.groupTogether=!1,this.busy=!1,this.error=null,this.sampleBusyUid=null,this.sceneSubjects=[],this.sessionCats=null,this.multipleCats=!1,this._showBoxes=Fb()}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},entryId:{type:String},cache:{attribute:!1},cats:{attribute:!1},summary:{attribute:!1},samples:{attribute:!1},sceneSubjects:{attribute:!1},sessionCats:{attribute:!1},multipleCats:{type:Boolean},samplesFailed:{type:Boolean},group:{attribute:!1},groupTogether:{type:Boolean},busy:{type:Boolean},error:{type:String},sampleBusyUid:{attribute:!1},_photosExpanded:{state:!0},_viewerIndex:{state:!0},_zoom:{state:!0},_clipSrc:{state:!0},_clipError:{state:!0},_showBoxes:{state:!0},_draft:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler),window.addEventListener(Xo,this._onSharedBoxesChange),window.addEventListener("storage",this._onStorage)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),window.removeEventListener(Xo,this._onSharedBoxesChange),window.removeEventListener("storage",this._onStorage),this._beforeRef.dispose(),this._afterRef.dispose(),this._sceneRef.dispose(),this._stopClipPlayback()}_setBoxesVisible(e){this._showBoxes=e;try{localStorage.setItem(Qo,String(e))}catch{}window.dispatchEvent(new CustomEvent(Xo,{detail:{visible:e}}))}willUpdate(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus();let t=this.summary;this._beforeRef.sync(this.hass,this.cache,t?.before,()=>this.requestUpdate()),this._afterRef.sync(this.hass,this.cache,t?.after,()=>this.requestUpdate()),this._sceneRef.sync(this.hass,this.cache,t?.scene??null,()=>this.requestUpdate());let s=t?.uid??null;s!==this._lastEventUid&&(this._lastEventUid=s,this._photosExpanded=!1,this._viewerIndex=null,this._zoom=null,this._draft=null),e.has("sessionCats")&&(this._draft=null),(e.has("open")&&!this.open||s!==this._clipEventUid)&&(this._clipEventUid=s,this._releaseClip())}render(){let e=this.summary;if(!this.open||!e)return p;let t=this._sessionCatsFor(e),s=this._draft??Mr(t,e.identity),n=e.kind==="feed",o=this.hass?.locale?.language??this.hass?.language,a=n?zt(e):this._draftTitle(e,s),l=this._stageKind(e);return c`
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
    `}_catColor(e){let t=this.cats.find(s=>s.name===e);return t?W(t.color):ye(e)}_sceneOverlayBoxes(){let e=this._draft?.subjects??{};return this.sceneSubjects.map((t,s)=>{let n=t.sid!==null&&e[t.sid]!==void 0?e[t.sid]:t.label,o=n&&n!=="not_a_cat"?n:null,a=o?this.cats.find(u=>u.name===o):null,l=o?"cat":n==="not_a_cat"?"not-cat":"unknown";return{key:"scene:"+s,box:t.box,tone:l,label:o??(l==="not-cat"?"Not a cat":"Who?"),color:o?this._catColor(o):void 0,avatar:a?.avatar??null,selectable:t.sid!==null,subjectSid:t.sid,subjectLabel:n}})}_renderBoxesToggle(){return c`<button type="button" class="box-toggle" aria-pressed=${this._showBoxes} aria-label=${this._showBoxes?"Hide boxes":"Show boxes"} @click=${e=>{e.stopPropagation(),this._toggleBoxes()}}>${g(this._showBoxes?"eye":"eyeOff")}</button>`}_photoOverlayBoxes(e){if(!e.body||!e.box||!e.crop)return[];let t=Ot(e.box,e.crop);if(!t)return[];let s=e.label??e.guess,n=s==="not_a_cat"?"not-cat":s&&s!=="skip"?"cat":"unknown",o=n==="cat"?this.cats.find(a=>a.name===s):null;return[{key:"sample:"+e.uid,box:t,tone:n,color:s&&s!=="not_a_cat"&&s!=="skip"?this._catColor(s):void 0,avatar:o?.avatar??null},...e.peers.flatMap((a,l)=>{let u=Ot(a,e.crop);return u?[{key:"peer:"+e.uid+":"+l,box:u,tone:"peer"}]:[]})]}_draftTitle(e,t){return tc(t.cats,{identity:t.notACat?"not_a_cat":"auto",open:e.open})}_renderHeader(e,t,s,n){let o=Ir(e),a=n.cats.find(d=>d.ate)?.cat??n.cats[0]?.cat??e.cat,l=a?this._catColor(a):null,u=t?zt(e):this._draftTitle(e,n),h=this.group.findIndex(d=>d.uid===e.uid);return c`
      <header>
        ${this.group.length>1&&!this.groupTogether?this._renderPager(h):p}
        <div class="heading">
          <span class="title">${u}</span>
          <span class="meta">
            ${he(e.start,s)}${o?c`, ${o}`:p}
            ${e.open?this._renderLiveBadge(l):p}
          </span>
        </div>
        <button type="button" class="close" ${P(this._closeButtonRef)} @click=${this._close} aria-label="Close">${g("close")}</button>
      </header>
    `}_renderLiveBadge(e){return c`
      <span class="live-badge" style="--dot-color:${e??"var(--kibble-live, #e5484d)"}" aria-label="Happening now">
        <span class="live-core"></span>
        <span class="live-pulse"></span>
      </span>
    `}_renderPager(e){let t=this.group.length;return c`
      <div class="pager">
        <button type="button" class="pager-btn" aria-label="Previous event" ?disabled=${e<=0} @click=${()=>this._goToGroupIndex(e-1)}>
          <span class="chevron chevron-left">${g("chevronDown")}</span>
        </button>
        <span class="pager-count">${e+1} of ${t}</span>
        <button
          type="button"
          class="pager-btn"
          aria-label="Next event"
          ?disabled=${e===-1||e>=t-1}
          @click=${()=>this._goToGroupIndex(e+1)}
        >
          <span class="chevron chevron-right">${g("chevronDown")}</span>
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
                      ${g("play")}
                    </button>
                  `:p}
            `:p}
        ${this._showBoxes&&this.sceneSubjects.length?c`<kibble-box-overlay .boxes=${this._sceneOverlayBoxes()} .hass=${this.hass} .cache=${this.cache} .cats=${this.cats} .busy=${this.busy} @subject-label-requested=${this._onSubjectLabelSelected}></kibble-box-overlay>`:p}
        ${this.sceneSubjects.length?this._renderBoxesToggle():p}
      </div>
    `}async _playClip(e){let t=this.hass,s=this.entryId;if(!t?.callWS||!s||!e.clip)return;let n=`/api/kibble/${s}/clip/${e.uid}`;try{let o=await t.callWS({type:"auth/sign_path",path:n,expires:Hb});if(this.summary?.uid!==e.uid)return;this._clipError=!1,this._clipSrc=o.path}catch{this._clipError=!0}}_seekClip(e){let t=this._videoRef.value;!t||!e.clip||(t.currentTime=Rp(e.start,e.clip.start_ms))}_onClipError(){this._stopClipPlayback(),this._clipError=!0}_stopClipPlayback(){let e=this._videoRef.value;e&&(e.pause(),e.removeAttribute("src"),e.load()),this._clipSrc=null}_releaseClip(){this._stopClipPlayback(),this._clipError=!1}_renderCompare(){return c`<kibble-before-after class="compare" .beforeSrc=${this._beforeRef.url} .afterSrc=${this._afterRef.url} .aspect=${Ob}></kibble-before-after>`}_renderZoom(){let e=this.summary;return c`
      <div class="zoom" @click=${t=>{t.stopPropagation(),this._zoom=null}}>
        <div class="zoom-scene" @click=${t=>t.stopPropagation()}>
          <kibble-image .hass=${this.hass} .asset=${this._zoom} .cache=${this.cache} alt="" fit="contain"></kibble-image>
          ${e&&this._showBoxes&&this.sceneSubjects.length?c`<kibble-box-overlay .boxes=${this._sceneOverlayBoxes()} .hass=${this.hass} .cache=${this.cache} .cats=${this.cats} .busy=${this.busy} @subject-label-requested=${this._onSubjectLabelSelected}></kibble-box-overlay>`:p}
        </div>
        ${this.sceneSubjects.length?this._renderBoxesToggle():p}
        <button type="button" class="zoom-close" aria-label="Close photo" @click=${t=>{t.stopPropagation(),this._zoom=null}}>${g("close")}</button>
      </div>
    `}_sessionCatsFor(e){return this.sessionCats?this.sessionCats:e.cat?[{cat:e.cat,ate:e.kind==="eat",confirmed:e.identity==="reviewed",confidence:e.confidence??null,photos:e.sample_count??0}]:[]}_requestSessionLabel(e,t=!1){this.dispatchEvent(new CustomEvent("session-label-requested",{detail:{...e,closeOnSuccess:t},bubbles:!0,composed:!0}))}_setDraft(e,t){this.busy||(this._draft=t(this._draft??Mr(this._sessionCatsFor(e),e.identity)))}_renderIdentity(e,t,s){let n=e.kind==="eat";return c`
      <div class="identity">
        <div class="identity-heading">
          <span class="identity-title">Who was here?</span>
          <span class="identity-hint ${this.multipleCats&&s.cats.length<2&&!s.notACat?"identity-hint-multiple":""}">${this.multipleCats&&s.cats.length<2&&!s.notACat?"Looks like more than one cat. Tap everyone who was here":"Tap everyone who was here"}</span>
        </div>
        <div class="chip-grid" role="group" aria-label="Who was here?">
          ${this.cats.map(o=>this._renderIdentityChip(o,e,t,s))}
          ${this._renderNotACatChip(e,s)}
          <kibble-choice
            label="Can\u2019t tell"
            .icon=${"helpCircle"}
            .state=${e.identity==="unknown"?"selected":"neutral"}
            ?disabled=${this.busy||e.identity==="unknown"}
            @click=${()=>this._requestSessionLabel({uid:e.uid,verdict:"unknown"},!0)}
          ></kibble-choice>
        </div>
        ${n&&s.cats.length>=2?c`<div class="meal-roles" role="group" aria-label="Who ate?">${s.cats.map(o=>c`
          <div class="meal-role"><span class="meal-cat">${o.cat}</span><div class="meal-role-options" role="group" aria-label=${o.cat}>
            <button type="button" aria-pressed=${o.ate} ?disabled=${this.busy} @click=${()=>this._setDraft(e,a=>An(a,o.cat,!0))}>Ate</button>
            <button type="button" aria-pressed=${!o.ate} ?disabled=${this.busy} @click=${()=>this._setDraft(e,a=>An(a,o.cat,!1))}>Came by</button>
          </div></div>`)}</div>`:p}
        ${this.error?c`<p class="identity-error">${this.error}</p>`:p}
      </div>
    `}_renderIdentityChip(e,t,s,n){let o=Zl(n,s,e.name);return c`<kibble-choice
      .hass=${this.hass}
      .cache=${this.cache}
      .label=${e.name}
      .cats=${[e]}
      .state=${o==="confirmed"?"selected":o}
      ?disabled=${this.busy}
      @click=${()=>this._setDraft(t,a=>Yl(a,e.name,t.kind==="eat"))}
    ></kibble-choice>`}_renderNotACatChip(e,t){return c`<kibble-choice
      label="Not a cat"
      .icon=${"cancel"}
      .state=${t.notACat?"selected":"neutral"}
      ?disabled=${this.busy}
      @click=${()=>this._setDraft(e,Xl)}
    ></kibble-choice>`}_renderPhotos(e,t){if(this.samplesFailed)return c`<div class="photos"><div class="photos-heading">Photos</div><p class="photos-error"><span>Couldn't load photos.</span> <button type="button" @click=${this._retrySamples}>Retry</button></p></div>`;if(this.samples===null)return c`<div class="photos"><div class="photos-heading">Photos</div><div class="photos-grid">${Array.from({length:Db},()=>c`<div class="photo-skeleton"></div>`)}</div></div>`;if(this.samples.length===0)return p;let s=rc(this.samples,t);return s.length===0?c`<div class="photos"><div class="photos-heading"><span>Photos</span><span class="photos-count">${this.samples.length}</span></div>${this._renderPhotoGrid(this.samples)}</div>`:c`<div class="photos">${s.map(n=>c`
      <section class="photo-section" aria-label=${n.cat+" photos"}>
        <div class="photos-heading"><span><span class="photo-section-dot" style=${"--section-color:"+(this._catColor(n.cat)??"var(--secondary-text-color)")}></span>${n.cat}</span><span class="photos-count">${n.samples.length}</span></div>
        ${this._renderPhotoGrid(n.samples)}
      </section>`)}</div>`}_renderPhotoGrid(e){let t=this._photosExpanded||e.length<=Yo,s=t?e:e.slice(0,Yo),n=e.length-Yo;return c`<div class="photos-grid">
      ${s.map(o=>this._renderPhotoTile(o,this.samples.findIndex(a=>a.uid===o.uid)))}
      ${t?p:c`<button type="button" class="photo-tile photo-more" @click=${()=>{this._photosExpanded=!0}}>+${n}</button>`}
    </div>`}_sampleBadge(e){return e.review===null?null:e.review==="skip"?{kind:"skip"}:e.review==="not_a_cat"?{kind:"not_a_cat"}:e.review!==e.cat?{kind:"cat",name:e.review,cat:this.cats.find(t=>t.name===e.review)??null}:null}_renderPhotoTile(e,t){let s=e.body??e.face,n=this._sampleBadge(e),o=n!==null&&n.kind!=="cat";return c`
      <button type="button" class="photo-tile ${o?"dim":""}" aria-label=${`Photo ${t+1} of ${this.samples.length}`} @click=${()=>{this._viewerIndex=t}}>
        ${s?c`<kibble-image .hass=${this.hass} .asset=${s} .cache=${this.cache} alt=""></kibble-image>`:c`<span class="photo-neutral">${He()}</span>`}
        ${n?this._renderPhotoBadge(n):p}
        ${this._showBoxes&&e.body&&e.box&&e.crop?c`<kibble-box-overlay .boxes=${this._photoOverlayBoxes(e)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>`:p}
      </button>`}_renderPhotoBadge(e){return e.kind==="cat"?c`<span class="photo-badge photo-badge-avatar"><kibble-avatar .hass=${this.hass} .name=${e.name} .colorIndex=${e.cat?.color??null} .asset=${e.cat?.avatar??null} .cache=${this.cache}></kibble-avatar></span>`:c`<span class="photo-badge photo-badge-icon">${g(e.kind==="skip"?"eyeOff":"close")}</span>`}_renderFooter(e,t,s){let n=Jl(s,t,e.identity),o=n.kind==="save"?()=>this._requestSessionLabel({uid:e.uid,...n.request},!0):this._close;return c`<footer><button type="button" class="primary-btn" ?disabled=${this.busy||n.kind==="blocked"} @click=${o}>${this.busy&&n.kind==="save"?"Saving":n.text}</button></footer>`}static{this.styles=x`
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
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 8px;
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
      font-size: 14px;
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
      border-radius: 8px;
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
      font-size: 14px;
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
    .photo-badge-icon {
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff));
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
  `}};customElements.define("kibble-label-sheet",Zo);var zb=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"limit",selector:{number:{min:1,mode:"box"}}}],Bb={device_id:"Kibble device",name:"Name (optional)",limit:"Rows before \u201CShow more\u201D (optional, default 30)"},Jo=class extends y{constructor(){super(...arguments);this._computeLabel=e=>Bb[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${zb}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateLimit(e){if(!this._config)return;let t=Number(e);this._config={...this._config,limit:e&&Number.isFinite(t)?t:void 0},this._fireConfigChanged()}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=x`
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
  `}};customElements.define("kibble-timeline-card-editor",Jo);var jb={deviceId:"",catPresence:[]},Cs=30,ea=class extends y{constructor(){super();this._entities=jb;this._timelineFeed=new ks(()=>this.requestUpdate());this._imageCache=new _e;this._catsQuery=new re(()=>this.requestUpdate());this._detailGeneration=0;this._sheetTrigger=null;this._sentinelRef=T();this._railRef=T();this._sentinelObserver=null;this._observedSentinel=null;this._observedSentinelCapped=null;this._newestKnownUid=null;this._animateUids=new Set;this._sheetReviewedEvents=new Map;this._sheetPhotoUids=new Set;this._stopReviewListening=null;this._onRailScroll=()=>{this._updateEdges()};this._onEventRequested=e=>{this._loadEventDetail(e.detail.uid)};this._onSamplesRetryRequested=()=>{let e=this._sheetSummary?.uid;e&&this._loadEventDetail(e)};this._closeSheet=()=>{let e=Ap({events:[...this._sheetReviewedEvents.values()],photosUpdated:this._sheetPhotoUids.size},this._locale());this._sheetSummary=null,this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._sheetSamplesFailed=!1,this._sheetSampleBusyUid=null,this._sheetGroup=[],this._sheetTogether=!1,this._sheetError=null,this._sheetReviewedEvents=new Map,this._sheetPhotoUids=new Set,this._sheetTrigger?.focus(),this._sheetTrigger=null,e&&this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:e},bubbles:!0,composed:!0}))};this._onSessionLabelRequested=e=>{let t=this._entryId,s=this.hass;if(!t||!s?.callWS)return;let{uid:n,cats:o,verdict:a,subjects:l,closeOnSuccess:u}=e.detail,h={uid:n,...o?{cats:o}:{},...a?{verdict:a}:{},...l?.length?{subjects:l}:{}};this._sheetBusy=!0,this._sheetError=null,Lr(s,t,h).then(d=>{this._sheetBusy=!1,this._applySheetDetail(d),_i(t);for(let f of this._sheetReviewedEvents.keys())(f===d.event.uid||f.startsWith(d.event.uid+":"))&&this._sheetReviewedEvents.delete(f);if(h.verdict)this._sheetReviewedEvents.set(d.event.uid,{uid:d.event.uid,event:d.event,label:h.verdict});else for(let f of h.cats??[]){let m=d.event.uid+":"+f.cat;this._sheetReviewedEvents.set(m,{uid:m,event:{kind:f.ate?"eat":"visit",open:d.event.open,start:d.event.start},label:f.cat})}u?this._closeSheet():this.requestUpdate()}).catch(d=>{this._sheetBusy=!1,this._sheetError=d instanceof Error?d.message:"Couldn't save this label.",this.requestUpdate()})};this._onSampleLabelRequested=e=>{let t=this._entryId,s=this.hass;if(!t||!s?.callWS)return;let{sampleUid:n,label:o}=e.detail;this._sheetSampleBusyUid=n,this._sheetError=null,Pp(s,t,{sampleUid:n,label:o}).then(a=>{this._sheetSampleBusyUid=null,this._sheetSamples&&(this._sheetSamples=this._sheetSamples.map(u=>u.uid===a.uid?a:u)),this._sheetPhotoUids.add(n);let l=this._sheetSummary?.uid;l&&this._loadEventDetail(l,!0),_i(t),this.requestUpdate()}).catch(a=>{this._sheetSampleBusyUid=null,this._sheetError=a instanceof Error?a.message:"Couldn't save this label.",this.requestUpdate()})};this._loadOlder=()=>{this._timelineFeed.loadMore(this.hass,this._entryId,this._config?.limit??Cs)};this._retryTimeline=()=>{this._timelineFeed.refresh(this.hass,this._entryId,this._config?.limit??Cs)};this._sheetSummary=null,this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._sheetSamplesFailed=!1,this._sheetSampleBusyUid=null,this._sheetGroup=[],this._sheetTogether=!1,this._sheetBusy=!1,this._sheetError=null,this._edgeTop=!1,this._edgeBottom=!1}static{this.properties={hass:{attribute:!1},_config:{state:!0},_sheetSummary:{state:!0},_sheetSamples:{state:!0},_sheetSceneSubjects:{state:!0},_sheetSessionCats:{state:!0},_sheetMultipleCats:{state:!0},_sheetSamplesFailed:{state:!0},_sheetSampleBusyUid:{state:!0},_sheetGroup:{state:!0},_sheetTogether:{state:!0},_sheetBusy:{state:!0},_sheetError:{state:!0},_edgeTop:{state:!0},_edgeBottom:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-timeline-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-timeline-card-editor")}connectedCallback(){super.connectedCallback(),this._stopReviewListening=Ft(()=>this._entryId,()=>{this._timelineFeed.refresh(this.hass,this._entryId,this._config?.limit??Cs),this._refreshCats()})}disconnectedCallback(){super.disconnectedCallback(),this._stopReviewListening?.(),this._stopReviewListening=null,this._imageCache.dispose(),this._timelineFeed.dispose(),this._sentinelObserver?.disconnect(),this._detailGeneration+=1}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=je(this.hass.entities??{},e),this._entryId=At(this.hass.devices??{},e)),this._timelineFeed.sync(this.hass,this._entryId,this._config?.limit??Cs);let t=this.hass?.callWS;if(this.hass&&this._entryId&&t&&this._entryId!==this._catsEntryId){this._catsEntryId=this._entryId;let s=this._entryId;this._catsQuery.sync(s,()=>t({type:"kibble/cats",entry_id:s}).then(n=>n))}this._syncAnimation()}_syncAnimation(){let e=this._timelineFeed.state.items;if(!e||e.length===0)return;let t=e[0].uid;if(t===this._newestKnownUid){this._animateUids=new Set;return}let s=new Set;if(this._newestKnownUid!==null)for(let n of e){if(n.uid===this._newestKnownUid)break;s.add(n.uid)}this._animateUids=s,this._newestKnownUid=t}updated(){this._syncSentinel(),this._updateEdges()}_syncSentinel(){let e=this._sentinelRef.value??null,t=In(this._config?.max_height)!=="";if(!(e===this._observedSentinel&&t===this._observedSentinelCapped)){if(this._sentinelObserver?.disconnect(),this._observedSentinel=e,this._observedSentinelCapped=t,!e){this._sentinelObserver=null;return}this._sentinelObserver=new IntersectionObserver(s=>{s.some(n=>n.isIntersecting)&&this._loadOlder()},{root:t?this._railRef.value:null,rootMargin:"200px"}),this._sentinelObserver.observe(e)}}_updateEdges(){let e=this._railRef.value;if(!e){(this._edgeTop||this._edgeBottom)&&(this._edgeTop=!1,this._edgeBottom=!1);return}let t=e.scrollTop>2,s=e.scrollHeight-e.scrollTop-e.clientHeight>2;t!==this._edgeTop&&(this._edgeTop=t),s!==this._edgeBottom&&(this._edgeBottom=s)}_locale(){return this.hass?.locale?.language??this.hass?.language}_catColor(e){if(!e)return null;let t=this._catsQuery.state.data?.cats.find(s=>s.name===e);return t?W(t.color):ye(e)}render(){if(!this._config||!this.hass)return p;let e=this._timelineFeed.state,t=lc(e.items??[],Date.now()/1e3),s=dc(t,new Date),n=e.hasMore,o=!e.error&&!e.loading&&e.items!==null&&s.length===0;return c`
      <ha-card>
        <div class="container">
          ${this._config.name?c`<div class="label">${this._config.name}</div>`:p}
          <kibble-review-entry
            class="review-entry"
            .hass=${this.hass}
            .entryId=${this._entryId}
            .cats=${this._catsQuery.state.data?.cats??[]}
            .cache=${this._imageCache}
            .revision=${e.items}
          ></kibble-review-entry>
          <div class="rail-wrap">
            <div class="rail" style=${In(this._config.max_height)} @scroll=${this._onRailScroll} ${P(this._railRef)}>
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
      </div>`}_renderTogether(e){let t=ac(e.events),s=e.start!=null&&e.end!=null?oc(e.start,e.end):null;return c`
      <div class="together-heading">
        <button type="button" class="together-open" aria-label=${t} @click=${n=>this._openSheet(e,n.currentTarget)}>
          <span class="title together-title">${this._renderTogetherTitle(e.events)}</span>
        </button>
      </div>
      ${s?c`<span class="meta">for ${s}</span>`:p}
      ${this._renderTogetherMedia(e)}`}_renderTogetherTitle(e){let t=Dr(e),s=t.map(a=>a.cat?c`<span class="cat-name" style="color:${this._catColor(a.cat)??"var(--secondary-text-color)"}">${a.cat}</span>`:c`<span class="together-unknown-name">Who?</span>`),n=c`${s.map((a,l)=>c`${l===0?p:l===s.length-1?s.length===2?" and ":", and ":", "}${a}`)}`,o=t[0];if(o&&o.kind!=="feed"&&t.every(a=>a.kind===o.kind&&a.open===o.open)){let a=o.open?o.kind==="eat"?"are eating":"are here":Ye(o);return c`${n} ${a}`}return c`${t.map((a,l)=>c`${l?", ":p}${s[l]} ${Ye(a)}`)}`}_togetherDotStyle(e){let t=Dr(e);if(t.length===0)return"var(--secondary-text-color)";let s=100/t.length;return`conic-gradient(${t.map((o,a)=>`${o.cat?this._catColor(o.cat)??"var(--secondary-text-color)":"var(--secondary-text-color)"} ${a*s}% ${(a+1)*s}%`).join(", ")})`}_renderTogetherMedia(e){let t=e.events,s=t.find(l=>l.kind==="eat"&&Or(l)!==null),n=t.find(l=>l.kind==="eat"&&!!l.clip&&!!l.scene)??t.find(l=>!!l.scene)??t.find(l=>l.kind==="eat"&&!!l.clip)??t.find(l=>l.kind==="eat"&&!!l.thumb)??t.find(l=>!!l.thumb)??e.event,o=t.find(l=>l.scene)?.scene??t.find(l=>l.thumb)?.thumb??null,a={...e,event:n};if(s){let l=Or(s);if(l){let u={...e,event:s};return o?c`
          <div class="media media-eat">
            ${this._renderPhotoButton(a,o,"photo-tile photo-third")}
            ${this._renderComparePair(u,l,"third")}
          </div>
        `:c`<div class="media media-eat">${this._renderComparePair(u,l,"full")}</div>`}}return c`<div class="media">${this._renderPhotoButton(a,o,"photo-tile photo-visit")}</div>`}_renderKnown(e,t){let s=e.event;return c`
      ${this._renderTitle(e,t)}
      ${this._renderMeta(s)}
      ${this._renderMedia(e,s)}`}_renderTitle(e,t){let s=e.event,n=s.kind==="feed"?c`${zt(s)}`:s.cat?c`<span class="cat-name" style="color:${t}">${s.cat}</span> ${Ye(s)}`:c`${s.open?s.kind==="eat"?"Someone is eating":"Someone is here":"Who was here?"}`,o=Mn(s),a=o?`Who was here? ${he(s.start,this._locale())}`:`Review ${Hr(s)}, ${he(s.start,this._locale())}`;return c`<button type="button" class="title-open ${o?"asks":""}" aria-label=${a} @click=${l=>this._openRow(e,l.currentTarget)}>
      <span class="title-line">
        <span class="title">${n}</span>
        ${o?c`<span class="ask-chevron">${g("chevronRight")}</span>`:p}
        ${s.open?this._renderLiveRing(t):p}
        ${e.events.length>1?c`<span class="count-badge">${cc(s.kind,e.events.length)}</span>`:p}
      </span></button>`}_openRow(e,t){let s=e.event;e.together!==!0&&Mn(s)?this.renderRoot.querySelector("kibble-review-entry")?.open(s.session??s.uid):this._openSheet(e,t)}_renderLiveRing(e){return c`
      <span class="live-badge" style="--dot-color:${e}" aria-label="Happening now">
        <span class="live-core"></span>
        <span class="live-pulse"></span>
      </span>
    `}_renderMeta(e){if(e.kind==="feed")return p;let t=Ir(e);return t?c`<span class="meta">for ${t}</span>`:p}_renderMedia(e,t){let s=Or(t);if(t.kind==="feed")return s?this._renderComparePair(e,s,"full"):p;let n=sc(t);return t.kind==="eat"&&s?n?c`
        <div class="media media-eat">
          ${this._renderPhotoButton(e,n,"photo-tile photo-third")}
          ${this._renderComparePair(e,s,"third")}
        </div>
      `:c`<div class="media media-eat">${this._renderComparePair(e,s,"full")}</div>`:c`<div class="media">${this._renderPhotoButton(e,n,"photo-tile photo-visit")}</div>`}_renderPhotoButton(e,t,s){let n=e.event,o=n.kind==="eat"&&!!n.clip,a=`View and correct: ${Hr(n)}, ${he(n.start,this._locale())}${o?". Has video.":""}`;return c`
      <button type="button" class="${s}" aria-label=${a} @click=${l=>this._openRow(e,l.currentTarget)}>
        ${t?c`<kibble-image .hass=${this.hass} .asset=${t} .cache=${this._imageCache} alt=""></kibble-image>`:c`<span class="neutral-icon">${He()}</span>`}
        ${o?c`<span class="clip-badge">${g("play")}</span>`:p}
      </button>
    `}_renderComparePair(e,t,s){let n=`View and correct: ${Hr(e.event)}, ${he(e.event.start,this._locale())}`;return c`
      <div class="compare-pair ${s==="full"?"compare-full":"compare-third"}">
        <button type="button" class="compare-tile" aria-label=${`${n}. Before.`} @click=${o=>this._openRow(e,o.currentTarget)}>
          ${t.before?c`<kibble-image .hass=${this.hass} .asset=${t.before} .cache=${this._imageCache} alt=""></kibble-image>`:p}
          <span class="compare-label">Before</span>
        </button>
        <button type="button" class="compare-tile" aria-label=${`${n}. After.`} @click=${o=>this._openRow(e,o.currentTarget)}>
          ${t.after?c`<kibble-image .hass=${this.hass} .asset=${t.after} .cache=${this._imageCache} alt=""></kibble-image>`:p}
          <span class="compare-label">After</span>
        </button>
      </div>
    `}_refreshCats(){let e=this.hass,t=this._entryId,s=e?.callWS;!s||!t||this._catsQuery.refresh(()=>s({type:"kibble/cats",entry_id:t}).then(n=>n))}_applySheetDetail(e){this._sheetSummary=e.event,this._sheetSamples=e.samples,this._sheetSceneSubjects=e.scene_subjects,this._sheetSessionCats=e.cats,this._sheetMultipleCats=e.multiple_cats,this._sheetSamplesFailed=!1,this.requestUpdate()}_loadEventDetail(e,t=!1){let s=this._sheetGroup.find(l=>l.uid===e);s&&(this._sheetSummary=s),t||(this._sheetSamples=null,this._sheetSceneSubjects=[],this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._sheetSamplesFailed=!1),this._sheetError=null;let n=++this._detailGeneration,o=this.hass?.callWS,a=this._entryId;if(!o||!a){this._sheetSamplesFailed=!t;return}o({type:"kibble/event",entry_id:a,uid:e}).then(l=>{n===this._detailGeneration&&this._applySheetDetail(l)}).catch(()=>{n===this._detailGeneration&&(t||(this._sheetSamplesFailed=!0),this.requestUpdate())})}_openSheet(e,t){this._sheetTrigger=t,this._sheetGroup=e.events,this._sheetTogether=e.together===!0,this._sheetReviewedEvents=new Map,this._sheetPhotoUids=new Set,this._sheetSessionCats=null,this._sheetMultipleCats=!1,this._loadEventDetail(e.event.uid)}static{this.styles=x`
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
  `}};customElements.define("kibble-timeline-card",ea);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-timeline-card",name:"Kibble Timeline",description:"Today's feeds and who's been by, one calm list, newest first, with real photos.",preview:!0});var Mp={items:null,total:0,pageIndex:0,hasNext:!1,hasPrevious:!1,loading:!1,error:null},ti=class{constructor(r,e){this._type=r;this._onChange=e;this.state=Mp;this._cursors=[null];this._key=null;this._generation=0}sync(r,e,t,s){if(e!==this._key){if(this._key=e,this._cursors=[null],!r?.callWS||!e){this.state=Mp;return}this._load(r,t,s,0,++this._generation)}}refresh(r,e,t){!r?.callWS||!this._key||this._load(r,e,t,this.state.pageIndex,++this._generation)}next(r,e,t){!r?.callWS||this.state.loading||!this.state.hasNext||this._load(r,e,t,this.state.pageIndex+1,this._generation)}previous(r,e,t){!r?.callWS||this.state.loading||this.state.pageIndex===0||this._load(r,e,t,this.state.pageIndex-1,this._generation)}async _load(r,e,t,s,n){this.state={...this.state,loading:!0,error:null},this._onChange();try{let o=this._cursors[s]??null,a={type:this._type,limit:t,...e,...o?{cursor:o}:{}},l=await r.callWS(a);if(n!==this._generation)return;this._cursors[s+1]=l.cursor,this.state={items:l.items,total:l.total,pageIndex:s,hasNext:l.has_more,hasPrevious:s>0,loading:!1,error:null}}catch(o){if(n!==this._generation)return;this.state={...this.state,loading:!1,error:j(o)}}this._onChange()}dispose(){this._generation+=1}};function ta(i){let r=i/1048576;if(r<1e3)return`${r<10?r.toFixed(1):Math.round(r)} MB`;let e=r/1024;return`${e<10?e.toFixed(1):Math.round(e)} GB`}function Lp(i){let r=i.retention_days===1?"1 day":`${i.retention_days} days`;return`Using ${ta(i.used_bytes)}, keeping ${r}`}function Ip(i){return i?`Feeder buffer ${ta(i.used_bytes)} of ${ta(i.cap_bytes)}`:null}var Nb="cat_recognition",qb={learning:"learning",paused:"paused",learned:"learned"};function Ub(i){return i.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Hp(i,r,e){let t=`cat_recognition_${Ub(e)}`;for(let s of Object.values(i))if(!(s.device_id!==r||s.disabled_by)&&s.entity_id.startsWith("sensor.")&&s.translation_key===Nb&&(s.unique_id?s.unique_id.endsWith(t):s.entity_id.endsWith(`_${t}`)))return s.entity_id}function Op(i,r){if(!r)return null;let e=i.states[r];if(!e||e.state==="unknown"||e.state==="unavailable")return null;let t=Number(e.state);if(!Number.isFinite(t))return null;let s=qb[String(e.attributes.learning_state)]??"learning";return{percent:Math.max(0,Math.min(100,t)),state:s}}var Vb={nw:"se",ne:"sw",se:"nw",sw:"ne"},Wb={se:{x:1,y:1},sw:{x:-1,y:1},ne:{x:1,y:-1},nw:{x:-1,y:-1}},Dp=fn;function ia(i){return Number.isFinite(i.width)&&Number.isFinite(i.height)&&i.width>0&&i.height>0}function $s(i){if(!ia(i))return[0,0,1,1];let{width:r,height:e}=i;if(r===e)return[0,0,1,1];if(r>e){let s=e/r/2;return[.5-s,0,.5+s,1]}let t=r/e/2;return[0,.5-t,1,.5+t]}function Fp(i,r,e){return vi(i,r,e)}function zp(i,r,e,t,s=Dp){if(!ia(t))return i;let{width:n,height:o}=t,a=Sr(i,Vb[r]),l=Wb[r],u=Math.abs(e.x-a.x)*n,h=Math.abs(e.y-a.y)*o,d=(l.x>0?1-a.x:a.x)*n,f=(l.y>0?1-a.y:a.y)*o,m=s*Math.min(n,o),b=Math.min(Math.max(u,h,m),d,f),v=ut(a.x+l.x*(b/n)),_=ut(a.y+l.y*(b/o));return gi(a,{x:v,y:_})}function Bp(i,r,e,t=Dp){if(!ia(e)||!Number.isFinite(r)||r<=0)return i;let{width:s,height:n}=e,o=(i[0]+i[2])/2,a=(i[1]+i[3])/2,l=t*Math.min(s,n),u=Math.min(s,n),h=Math.min(u,Math.max(l,Ke(i)*s*r)),d=h/s/2,f=h/n/2,m=Math.min(1-d,Math.max(d,o)),b=Math.min(1-f,Math.max(f,a));return[m-d,b-f,m+d,b+f]}function ra(i,r){return Math.hypot(i.x-r.x,i.y-r.y)}var Kb=[0,0,1,1];function Gb(i,r,e=1600){let t=Math.max(i,r);if(t<=0||t<=e)return{width:i,height:r};let s=e/t;return{width:Math.max(1,Math.round(i*s)),height:Math.max(1,Math.round(r*s))}}async function jp(i){if(typeof createImageBitmap!="function")return null;try{return await createImageBitmap(i,{imageOrientation:"from-image"})}catch{return null}}async function Np(i){if(typeof Image>"u"||typeof URL>"u")return null;let r=URL.createObjectURL(i);try{return await new Promise((e,t)=>{let s=new Image;s.onload=()=>e(s),s.onerror=()=>t(new Error("decode failed")),s.src=r})}catch{return null}finally{URL.revokeObjectURL(r)}}async function Ss(i){let r=await jp(i)??await Np(i);if(!r)return null;try{let{width:e,height:t}="naturalWidth"in r?{width:r.naturalWidth,height:r.naturalHeight}:{width:r.width,height:r.height};return e>0&&t>0?{width:e,height:t}:null}finally{"close"in r&&r.close()}}async function Es(i,r=Kb,e=1600){let t=await jp(i)??await Np(i);if(!t)return i;try{let{width:s,height:n}="naturalWidth"in t?{width:t.naturalWidth,height:t.naturalHeight}:{width:t.width,height:t.height};if(s<=0||n<=0)return i;let[o,a,l,u]=r,h=Math.min(s-1,Math.max(0,Math.round(o*s))),d=Math.min(n-1,Math.max(0,Math.round(a*n))),f=Math.max(1,Math.round((l-o)*s)),m=Math.max(1,Math.round((u-a)*n)),{width:b,height:v}=Gb(f,m,e),_=document.createElement("canvas");_.width=b,_.height=v;let k=_.getContext("2d");return k?(k.drawImage(t,h,d,f,m,0,0,b,v),await new Promise(z=>_.toBlob(z,"image/jpeg",.85))??i):i}catch{return i}finally{"close"in t&&t.close()}}function Ts(i,r){return r===i?i.name:`${i.name.replace(/\.[^./\\]+$/,"")||"photo"}.jpg`}var Yb={queued:!0,compressing:!0,uploading:!0,added:!1,duplicate:!1,no_cat:!1,error:!1,canceled:!1},Xb={queued:!1,compressing:!1,uploading:!1,added:!0,duplicate:!0,no_cat:!0,error:!0,canceled:!0},Ps=class{constructor(r,e,t=2){this._handlers=r;this._onChange=e;this._concurrency=t;this._items=new Map;this._order=[];this._controllers=new Map;this._active=0;this._disposed=!1}get items(){return this._order.map(r=>this._items.get(r))}get(r){return this._items.get(r)}enqueue(r){let e=!1;for(let t of r)this._items.has(t)||(this._items.set(t,{id:t,status:"queued",message:null}),this._order.push(t),e=!0);e&&this._onChange()}start(){this._pump()}retry(r){let e=this._items.get(r);!e||e.status!=="error"||(this._items.set(r,{id:r,status:"queued",message:null}),this._onChange(),this._pump())}cancelPending(){let r=!1;for(let e of this._order){let t=this._items.get(e);Yb[t.status]&&(t.status==="queued"?(this._items.set(e,{id:e,status:"canceled",message:null}),r=!0):this._controllers.get(e)?.abort())}r&&this._onChange()}get allSettled(){return this._order.length>0&&this._order.every(r=>Xb[this._items.get(r).status])}tally(){let r={added:0,duplicate:0,no_cat:0,error:0,canceled:0};for(let e of this._items.values())e.status in r&&(r[e.status]+=1);return r}dispose(){this._disposed=!0;for(let r of this._controllers.values())r.abort()}_pump(){if(!this._disposed)for(;this._active<this._concurrency;){let r=this._order.find(e=>this._items.get(e)?.status==="queued");if(!r)return;this._run(r)}}_run(r){let e=new AbortController;this._controllers.set(r,e),this._active++,this._set(r,"compressing",null),this._handlers.compress(r,e.signal).then(t=>(this._set(r,"uploading",null),this._handlers.upload(r,t,e.signal))).then(t=>{this._set(r,t.status,t.message??null)}).catch(t=>{let s=e.signal.aborted||t instanceof DOMException&&t.name==="AbortError";this._set(r,s?"canceled":"error",s?null:t instanceof Error?t.message:"Couldn't upload this photo.")}).finally(()=>{this._controllers.delete(r),this._active--,this._pump()})}_set(r,e,t){this._items.has(r)&&(this._items.set(r,{id:r,status:e,message:t}),this._onChange())}};async function qp(i,r,e,t){if(i.fetchWithAuth)return i.fetchWithAuth(r,{method:"POST",body:e,signal:t});let s=i.auth?.data.access_token;if(!s||!i.hassUrl)throw new Error("Not authenticated.");let n=new Headers({Authorization:`Bearer ${s}`});return fetch(new URL(r,i.hassUrl),{method:"POST",body:e,headers:n,signal:t})}async function Up(i,r,e,t,s,n){let o=new FormData;o.append("file",t,s);let a=await qp(i,`/api/kibble/${r}/upload/training/${encodeURIComponent(e)}`,o,n);try{return await a.json()}catch{throw new Error(`Upload failed (${a.status}).`)}}async function Vp(i,r,e,t,s,n){let o=new FormData;o.append("file",t,s);let a=await qp(i,`/api/kibble/${r}/upload/avatar/${encodeURIComponent(e)}`,o,n);try{return await a.json()}catch{throw new Error(`Upload failed (${a.status}).`)}}var Qb=["nw","ne","se","sw"],sa=class extends y{constructor(){super();this._stageRef=T();this._pointers=new Map;this._dragCorner=null;this._dragMoveStart=null;this._pinchStart=null;this._resizeObserver=null;this.imageUrl="",this.naturalWidth=0,this.naturalHeight=0,this.crop=[0,0,1,1],this.circleGuide=!1,this.interactive=!0,this.fitParent=!1}static{this.properties={imageUrl:{type:String},naturalWidth:{type:Number},naturalHeight:{type:Number},crop:{attribute:!1},circleGuide:{type:Boolean},interactive:{type:Boolean},fitParent:{type:Boolean}}}connectedCallback(){super.connectedCallback(),this.fitParent&&this.parentElement&&typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(()=>this._applyParentFit()),this._resizeObserver.observe(this.parentElement))}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._resizeObserver=null}updated(e){this.fitParent&&(e.has("naturalWidth")||e.has("naturalHeight"))&&this._applyParentFit()}_applyParentFit(){let e=this.parentElement;if(!e||this.naturalWidth<=0||this.naturalHeight<=0)return;let t=e.clientWidth,s=e.clientHeight;if(t<=0||s<=0)return;let n=Math.min(t/this.naturalWidth,s/this.naturalHeight);this.style.width=`${Math.max(1,this.naturalWidth*n)}px`,this.style.height=`${Math.max(1,this.naturalHeight*n)}px`}_pointToNormalized(e,t){let s=this._stageRef.value?.getBoundingClientRect();return s?Le(e,t,s):null}_emitChange(e){this.crop=e,this.dispatchEvent(new CustomEvent("crop-changed",{detail:{crop:e},bubbles:!0,composed:!0}))}_beginPinch(){this._dragCorner=null,this._dragMoveStart=null;let e=[...this._pointers.values()];e.length<2||(this._pinchStart={distance:ra(e[0],e[1]),crop:this.crop})}_capture(e){this._stageRef.value?.setPointerCapture(e.pointerId);let t=this._pointToNormalized(e.clientX,e.clientY);t&&this._pointers.set(e.pointerId,t)}_onHandlePointerDown(e,t){t.preventDefault(),t.stopPropagation(),this._capture(t),this._pointers.size>=2?this._beginPinch():this._dragCorner=e}_onBodyPointerDown(e){if(!this.interactive)return;if(e.preventDefault(),this._capture(e),this._pointers.size>=2){this._beginPinch();return}let t=this._pointToNormalized(e.clientX,e.clientY);t&&(this._dragMoveStart={point:t,crop:this.crop})}_onPointerMove(e){if(!this._pointers.has(e.pointerId))return;let t=this._pointToNormalized(e.clientX,e.clientY);if(!t)return;this._pointers.set(e.pointerId,t);let s={width:this.naturalWidth,height:this.naturalHeight};if(this._pinchStart&&this._pointers.size>=2){let n=[...this._pointers.values()],o=ra(n[0],n[1]);this._pinchStart.distance>0&&this._emitChange(Bp(this._pinchStart.crop,o/this._pinchStart.distance,s));return}if(this._dragCorner){this._emitChange(zp(this.crop,this._dragCorner,t,s));return}this._dragMoveStart&&this._emitChange(Fp(this._dragMoveStart.crop,t.x-this._dragMoveStart.point.x,t.y-this._dragMoveStart.point.y))}_onPointerUp(e){this._pointers.delete(e.pointerId),this._pointers.size<2&&(this._pinchStart=null),this._pointers.size===0&&(this._dragCorner=null,this._dragMoveStart=null)}render(){let[e,t,s,n]=this.crop,o=`left:${e*100}%;top:${t*100}%;width:${(s-e)*100}%;height:${(n-t)*100}%;`,a=this.naturalWidth>0&&this.naturalHeight>0?`${this.naturalWidth} / ${this.naturalHeight}`:"1 / 1";return c`
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
          ${this.interactive?Qb.map(l=>c`<button type="button" class="handle handle-${l}" aria-label="Resize crop" @pointerdown=${u=>this._onHandlePointerDown(l,u)}></button>`):p}
        </div>
      </div>
    `}static{this.styles=x`
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
  `}};customElements.define("kibble-crop-editor",sa);var Zb=["button:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),na=class extends y{constructor(){super();this._queue=null;this._tileGeneration=0;this._loadedFiles=null;this._closeButtonRef=T();this._keydownHandler=e=>{if(!this.open)return;if(e.key==="Escape"){e.preventDefault(),this._adjustingId?this._adjustingId=null:this._requestClose();return}if(e.key!=="Tab")return;let t=[...this.renderRoot.querySelectorAll(Zb)];if(t.length===0)return;let s=this.renderRoot.querySelector(":focus"),n=s?t.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=t.length)&&(e.preventDefault(),(e.shiftKey?t[t.length-1]:t[0])?.focus())};this.open=!1,this.files=[],this._tiles=[],this._adjustingId=null,this._queueTick=0}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},entryId:{type:String},cat:{type:String},files:{attribute:!1},_tiles:{state:!0},_adjustingId:{state:!0},_queueTick:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),this._disposeTiles(),this._queue?.dispose()}willUpdate(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus(),this.open&&this.files!==this._loadedFiles&&(this._loadedFiles=this.files,this._resetForFiles(this.files))}_disposeTiles(){for(let e of this._tiles)URL.revokeObjectURL(e.objectUrl)}_resetForFiles(e){this._queue?.dispose(),this._queue=null,this._disposeTiles(),this._adjustingId=null;let t=++this._tileGeneration;this._tiles=e.map((s,n)=>({id:`f${n}`,file:s,objectUrl:URL.createObjectURL(s),naturalSize:null,crop:[0,0,1,1]}));for(let s of this._tiles)Ss(s.file).then(n=>{t!==this._tileGeneration||!n||(s.naturalSize=n,s.crop=$s(n),this.requestUpdate())})}_removeTile(e){let t=this._tiles.find(s=>s.id===e);t&&URL.revokeObjectURL(t.objectUrl),this._tiles=this._tiles.filter(s=>s.id!==e)}_onCropChanged(e,t){let s=this._tiles.find(n=>n.id===e);s&&(s.crop=t),this.requestUpdate()}_startUpload(){let e=this.hass,t=this.entryId,s=this.cat;if(!e||!t||!s||this._tiles.length===0||this._queue)return;let n=this._tiles,o=new Ps({compress:a=>Es(n.find(l=>l.id===a).file,n.find(l=>l.id===a).crop),upload:async(a,l,u)=>{let h=n.find(f=>f.id===a),d=await Up(e,t,s,l,Ts(h.file,l),u);return{status:d.status,message:d.message}}},()=>{this._queueTick++},2);o.enqueue(n.map(a=>a.id)),o.start(),this._queue=o,this._queueTick++}_requestClose(){this._queue?.cancelPending(),this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}render(){if(!this.open)return p;let e=this._adjustingId?this._tiles.find(t=>t.id===this._adjustingId):void 0;return c`
      <div class="backdrop" role="dialog" aria-modal="true" aria-label="Add photos">
        <div class="sheet">
          <header>
            <span class="title">Add photos${this.cat?c` of ${this.cat}`:p}</span>
            <button type="button" class="close" ${P(this._closeButtonRef)} @click=${()=>this._requestClose()} aria-label="Close">${g("close")}</button>
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
    `}_renderTileStatus(e,t,s){return t==="queued"?p:t==="compressing"||t==="uploading"?c`<span class="tile-badge busy" aria-label="Uploading">${g("refresh")}</span>`:t==="added"?c`<span class="tile-badge added" aria-label="Added">${g("check")}</span>`:t==="duplicate"?c`<span class="tile-badge muted">Duplicate</span>`:t==="no_cat"?c`<span class="tile-badge muted">Not a cat</span>`:t==="canceled"?c`<span class="tile-badge muted">Canceled</span>`:c`
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
    `}_tallyPhrase(e){let t=[];return e.added&&t.push(`${e.added} added`),e.duplicate&&t.push(`${e.duplicate} duplicate${e.duplicate===1?"":"s"}`),e.no_cat&&t.push(`${e.no_cat} not a cat`),e.error&&t.push(`${e.error} failed`),e.canceled&&t.push(`${e.canceled} canceled`),t.length>0?t.join(", "):"Nothing added."}_renderAdjust(e){return c`
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
    `}static{this.styles=x`
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
  `}};customElements.define("kibble-add-photos-sheet",na);var oa=24,Jb=["button:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),aa=class extends y{constructor(){super();this._trainingFeed=new ti("kibble/training",()=>this.requestUpdate());this._uploadObjectUrl="";this._uploadGeneration=0;this._closeButtonRef=T();this._fileInputRef=T();this._keydownHandler=e=>{if(!this.open)return;if(e.key==="Escape"){e.preventDefault(),this._uploadFile?this._cancelUpload():this._requestClose();return}if(e.key!=="Tab")return;let t=[...this.renderRoot.querySelectorAll(Jb)];if(t.length===0)return;let s=this.renderRoot.querySelector(":focus"),n=s?t.indexOf(s):-1,o=e.shiftKey?n-1:n+1;(n===-1||o<0||o>=t.length)&&(e.preventDefault(),(e.shiftKey?t[t.length-1]:t[0])?.focus())};this.open=!1,this.cat=null,this._uploadFile=null,this._uploadNaturalSize=null,this._uploadCrop=[0,0,1,1],this._busy=!1,this._error=null}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},entryId:{type:String},cache:{attribute:!1},cat:{attribute:!1},_uploadFile:{state:!0},_uploadNaturalSize:{state:!0},_uploadCrop:{attribute:!1},_busy:{state:!0},_error:{state:!0}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler),this._trainingFeed.dispose(),this._cancelUpload()}willUpdate(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus(),e.has("open")&&!this.open&&(this._cancelUpload(),this._error=null);let t=this.hass,s=this.entryId,n=this.cat;this.open&&t?.callWS&&s&&n&&this._trainingFeed.sync(t,`${s}:${n.name}`,this._feedParams(),oa)}_feedParams(){return{entry_id:this.entryId,cat:this.cat?.name}}_requestClose(){this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}_emitChanged(e,t){let s=this.cat;s&&this.dispatchEvent(new CustomEvent("avatar-changed",{detail:{cat:s.name,avatar:e,avatarCustom:t},bubbles:!0,composed:!0}))}async _chooseExisting(e){let t=this.hass,s=this.entryId,n=this.cat;if(!(!t?.callWS||!s||!n||!e||this._busy)){this._busy=!0,this._error=null;try{let o=await t.callWS({type:"kibble/cats/avatar/set",entry_id:s,cat:n.name,asset_id:e.id});this._emitChanged(o.avatar,!0),this._requestClose()}catch(o){this._error=j(o)}finally{this._busy=!1}}}async _onReset(){let e=this.hass,t=this.entryId,s=this.cat;if(!(!e?.callWS||!t||!s||this._busy)){this._busy=!0,this._error=null;try{let n=await e.callWS({type:"kibble/cats/avatar/clear",entry_id:t,cat:s.name});this._emitChanged(n.avatar,!1),this._requestClose()}catch(n){this._error=j(n)}finally{this._busy=!1}}}_onFileChosen(e){let t=e.target,s=t.files?.[0]??null;if(t.value="",!s)return;this._uploadFile=s,this._uploadObjectUrl=URL.createObjectURL(s),this._uploadNaturalSize=null,this._uploadCrop=[0,0,1,1];let n=++this._uploadGeneration;Ss(s).then(o=>{n!==this._uploadGeneration||!o||(this._uploadNaturalSize=o,this._uploadCrop=$s(o))})}_cancelUpload(){this._uploadObjectUrl&&URL.revokeObjectURL(this._uploadObjectUrl),this._uploadObjectUrl="",this._uploadFile=null,this._uploadNaturalSize=null}async _confirmUpload(){let e=this.hass,t=this.entryId,s=this.cat,n=this._uploadFile;if(!(!e||!t||!s||!n||this._busy)){this._busy=!0,this._error=null;try{let o=await Es(n,this._uploadCrop),a=await Vp(e,t,s.name,o,Ts(n,o),new AbortController().signal);if(a.error||!a.avatar){this._error=a.error??"Couldn't save that photo.";return}this._emitChanged(a.avatar,!0),this._requestClose()}catch(o){this._error=o instanceof Error?o.message:"Couldn't save that photo."}finally{this._busy=!1}}}render(){let e=this.cat;return!this.open||!e?p:c`
      <div class="backdrop" role="dialog" aria-modal="true" aria-label=${`Change ${e.name}'s picture`}>
        <div class="sheet">
          <header>
            <span class="title">Change picture</span>
            <button type="button" class="close" ${P(this._closeButtonRef)} @click=${()=>this._requestClose()} aria-label="Close">${g("close")}</button>
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
        <button type="button" ?disabled=${!e.hasPrevious||e.loading} @click=${()=>this._trainingFeed.previous(this.hass,this._feedParams(),oa)}>Previous</button>
        <button type="button" ?disabled=${!e.hasNext||e.loading} @click=${()=>this._trainingFeed.next(this.hass,this._feedParams(),oa)}>Next</button>
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
    `}static{this.styles=x`
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
  `}};customElements.define("kibble-avatar-picker",aa);var eg=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}}],tg={device_id:"Kibble device",name:"Name (optional)"},la=class extends y{constructor(){super(...arguments);this._computeLabel=e=>tg[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?c`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${eg}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=x`
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
  `}};customElements.define("kibble-cats-card-editor",la);var ig={deviceId:"",catPresence:[]},it=24,rg=3e3,sg={learning:"still learning",paused:"learning paused",learned:"learned"},ca=class extends y{constructor(){super();this._entities=ig;this._catsQuery=new re(()=>this.requestUpdate());this._trainingFeeds=new Map;this._imageCache=new _e;this._stopReviewListening=null;this._onCatMenuFocusOut=e=>{let t=e.currentTarget,s=e.relatedTarget;(!s||!t.contains(s))&&this._closeCatMenu()};this._onCatMenuKeydown=e=>{if(e.key!=="Escape")return;let t=e.currentTarget.querySelector(".cat-menu-trigger");this._closeCatMenu(),t?.focus()};this._onAvatarChanged=e=>{let{cat:t,avatar:s,avatarCustom:n}=e.detail;this._catsQuery.patch(o=>({...o,cats:o.cats.map(a=>a.name===t?{...a,avatar:s,avatar_custom:n}:a)}))};this._addName="",this._addBusy=!1,this._addError=null,this._actionError=null,this._openMenuFor=null,this._deleteConfirmFor=null,this._expandedTraining=null,this._addPhotosOpen=!1,this._addPhotosCat=null,this._addPhotosFiles=[],this._avatarPickerCat=null}static{this.properties={hass:{attribute:!1},_config:{state:!0},_addName:{state:!0},_addBusy:{state:!0},_addError:{state:!0},_actionError:{state:!0},_openMenuFor:{state:!0},_deleteConfirmFor:{state:!0},_expandedTraining:{state:!0},_addPhotosOpen:{state:!0},_addPhotosCat:{state:!0},_addPhotosFiles:{state:!0},_avatarPickerCat:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Cats card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 8}static getStubConfig(e){return{type:"custom:kibble-cats-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-cats-card-editor")}connectedCallback(){super.connectedCallback(),this._stopReviewListening=Ft(()=>this._entryId,()=>{this._refreshCats();let e=this._expandedTraining;e&&this._trainingFeed(e).refresh(this.hass,{entry_id:this._entryId,cat:e},it)})}disconnectedCallback(){super.disconnectedCallback(),this._stopReviewListening?.(),this._stopReviewListening=null,this._imageCache.dispose();for(let e of this._trainingFeeds.values())e.dispose();clearTimeout(this._deleteConfirmTimer)}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=je(this.hass.entities??{},e),this._entryId=At(this.hass.devices??{},e));let t=this.hass?.callWS,s=this._entryId;if(this.hass&&s&&t&&(this._catsQuery.sync(s,()=>t({type:"kibble/cats",entry_id:s}).then(n=>n)),this._expandedTraining)){let n=this._expandedTraining;this._trainingFeed(n).sync(this.hass,`${s}:${n}`,{entry_id:s,cat:n},it)}}_trainingFeed(e){let t=this._trainingFeeds.get(e);return t||(t=new ti("kibble/training",()=>this.requestUpdate()),this._trainingFeeds.set(e,t)),t}render(){if(!this._config||!this.hass)return p;let e=this._catsQuery.state.data?.cats??[],t=this._catsQuery.state.data?.storage??null,s=t?Ip(t.device_spool):null;return c`
      <ha-card>
        <div class="container">
          ${this._config.name?c`<div class="label">${this._config.name}</div>`:p}
          ${this._actionError?this._renderActionError():p}
          <section class="roster">
            ${e.length===0?c`<p class="empty">No cats yet. Add one to start training.</p>`:c`<div class="cat-list">${e.map(n=>this._renderCatTile(n))}</div>`}
            ${this._renderAddCat()}
          </section>
          ${this._expandedTraining?this._renderTrainingPanel(this._expandedTraining):p}
          ${e.length>0?c`<kibble-review-entry .hass=${this.hass} .entryId=${this._entryId} .cats=${e} .cache=${this._imageCache} .revision=${this._catsQuery.state.data}></kibble-review-entry>`:p}
          ${t?c`
                <p class="storage-line">
                  <span>${Lp(t)}</span>
                  ${s?c`<span class="quiet">${s}</span>`:p}
                </p>
              `:p}
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
    `:p}_renderCatTile(e){let t=new Date,s=e.last_seen!=null?`Seen ${Rt(new Date(e.last_seen*1e3),t)}`:"Not seen yet",n=`${e.meals_today} ${e.meals_today===1?"meal":"meals"} today`,o=e.training.total===0?"Not trained yet":`${e.training.total} ${e.training.total===1?"photo":"photos"} trained`,a=this._config?.device_id,l=this.hass&&a?Hp(this.hass.entities??{},a,e.name):void 0,u=this.hass?Op(this.hass,l):null;return c`
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
                <span class="learning-state">${u.percent}% recognized, ${sg[u.state]}</span>
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
            ${g("dotsVertical")}
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
    `}_toggleCatMenu(e){this._openMenuFor=this._openMenuFor===e?null:e}_closeCatMenu(){this._openMenuFor=null,clearTimeout(this._deleteConfirmTimer),this._deleteConfirmFor=null}_toggleTraining(e){this._openMenuFor=null,this._expandedTraining=this._expandedTraining===e?null:e}_openAvatarPicker(e){this._openMenuFor=null,this._avatarPickerCat=e}_closeAvatarPicker(){this._avatarPickerCat=null,this._refreshCats()}_onDeleteCatClick(e){if(this._deleteConfirmFor===e){clearTimeout(this._deleteConfirmTimer),this._deleteConfirmFor=null,this._openMenuFor=null,this._deleteCat(e);return}this._deleteConfirmFor=e,this._deleteConfirmTimer=setTimeout(()=>{this._deleteConfirmFor=null,this.requestUpdate()},rg)}_deleteCat(e){let t=this._callWS("kibble/cats/delete",{name:e});t&&t.then(()=>{this._trainingFeeds.delete(e),this._expandedTraining===e&&(this._expandedTraining=null),this._refreshCats()}).catch(s=>{this._actionError={message:`Couldn't delete ${e}. ${j(s)}`,retry:()=>this._deleteCat(e)}})}_renderAddCat(){return c`
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
    `}async _onAddCatSubmit(e){e.preventDefault();let t=this._addName.trim(),s=t?this._callWS("kibble/cats/add",{name:t}):null;if(s){this._addBusy=!0,this._addError=null;try{await s,this._addName="",this._refreshCats()}catch(n){this._addError=j(n)}finally{this._addBusy=!1}}}_renderTrainingPanel(e){let t=this._trainingFeed(e),s=t.state;return c`
      <section class="training">
        <div class="training-heading">
          <span>${e}\u2019s training photos${s.items!==null?` (${s.total})`:""}</span>
          <button type="button" class="icon-button" aria-label="Close training photos" @click=${()=>this._toggleTraining(e)}>${g("close")}</button>
        </div>
        <div class="training-actions">
          <button type="button" class="add-photos-button" @click=${()=>this._openAddPhotos(e)}>Add photos</button>
        </div>
        ${s.error?this._renderPagedError(s.error,()=>t.refresh(this.hass,{entry_id:this._entryId,cat:e},it)):p}
        ${s.items&&s.items.length===0?c`<p class="empty">No training photos yet.</p>`:p}
        <div class="training-grid">${(s.items??[]).map(n=>this._renderTrainingTile(e,n))}</div>
        ${this._renderPager(s,it,()=>t.previous(this.hass,{entry_id:this._entryId,cat:e},it),()=>t.next(this.hass,{entry_id:this._entryId,cat:e},it))}
      </section>
    `}_renderTrainingTile(e,t){let s=new Date(t.created*1e3).toLocaleDateString();return c`
      <div class="training-tile">
        <span class="training-crops">
          ${t.body?c`<kibble-image .hass=${this.hass} .asset=${t.body} .cache=${this._imageCache} alt=""></kibble-image>`:p}
          ${t.face?c`<kibble-image .hass=${this.hass} .asset=${t.face} .cache=${this._imageCache} alt=""></kibble-image>`:p}
        </span>
        <button type="button" class="remove" aria-label=${`Remove this training photo of ${e}, added ${s}`} @click=${()=>this._removeTraining(e,t.uid)}>
          ${g("close")}
        </button>
      </div>
    `}_removeTraining(e,t){let s=this._callWS("kibble/training/remove",{uids:[t]});s&&s.then(()=>{this._trainingFeed(e).refresh(this.hass,{entry_id:this._entryId,cat:e},it),this._refreshCats()}).catch(n=>{this._actionError={message:`Couldn't remove this photo. ${j(n)}`,retry:()=>this._removeTraining(e,t)}})}_openAddPhotos(e){this._addPhotosCat=e,this.renderRoot.querySelector(".add-photos-file-input")?.click()}_onAddPhotosChosen(e){let t=e.target,s=t.files?[...t.files]:[];t.value="",s.length!==0&&(this._addPhotosFiles=s,this._addPhotosOpen=!0)}_closeAddPhotos(){this._addPhotosOpen=!1;let e=this._addPhotosCat;this._refreshCats(),e&&this._expandedTraining===e&&this._trainingFeed(e).refresh(this.hass,{entry_id:this._entryId,cat:e},it)}_renderPager(e,t,s,n){if(e.items===null||!e.hasNext&&!e.hasPrevious)return p;let o=e.pageIndex*t+1,a=e.pageIndex*t+e.items.length;return c`
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
    `}_refreshCats(){let e=this.hass?.callWS,t=this._entryId;!e||!t||this._catsQuery.refresh(()=>e({type:"kibble/cats",entry_id:t}).then(s=>s))}_callWS(e,t){let s=this.hass?.callWS,n=this._entryId;return!s||!n?null:s({type:e,entry_id:n,...t}).then(o=>o)}static{this.styles=x`
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
  `}};customElements.define("kibble-cats-card",ca);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-cats-card",name:"Kibble Cats",description:"Enrolled cats, presence, and the review queue for whatever the feeder couldn't name.",preview:!0});var ng={deviceId:"",catPresence:[]},da=class extends y{constructor(){super(...arguments);this._entities=ng}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble schedule card: `device_id` is required.");this._config=e}getCardSize(){return 4}static getStubConfig(e){return{type:"custom:kibble-schedule-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}willUpdate(){let e=this._config?.device_id;this.hass&&e&&(this.hass.entities!==this._resolvedEntities||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDeviceId=e,this._entities=je(this.hass.entities??{},e))}render(){if(!this._config||!this.hass)return p;let e=this._entities,t=this.hass.states,s=e.schedule?t[e.schedule]:void 0,n=e.hopperDivider!=null&&t[e.hopperDivider]?.state==="off";return c`
      <ha-card>
        ${!s||s.state==="unavailable"?c`<p class="unavailable">The schedule is unavailable right now</p>`:c`<kibble-schedule-body
              .hass=${this.hass}
              .entries=${ir(s)}
              .scheduleCardStateEntity=${e.scheduleCardState}
              .singleHopper=${n}
              .deviceId=${e.deviceId}
              .food1=${e.hopperFood1?Lt(t[e.hopperFood1]):null}
              .food2=${e.hopperFood2?Lt(t[e.hopperFood2]):null}
            ></kibble-schedule-body>`}
      </ha-card>
    `}static{this.styles=x`
    :host {
      display: block;
      /* The tokens the schedule editor draws with; the hero sets the same ones on its own host. */
      --kibble-feed: ${K(sr)};
      --kibble-ink-on-feed: ${K(nr)};
      --kibble-amber-dark: ${K(or)};
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
  `}};customElements.define("kibble-schedule-card",da);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-schedule-card",name:"Kibble Schedule",description:"The feeding schedule, already open: per-hopper amounts with the divider fitted. For a dashboard pop-up.",preview:!0});var ag={deviceId:"",catPresence:[]},Wp=[1,2,3,4,5],lg=Wp.map(i=>({value:String(i),label:String(i)})),cg=`
  .bubble-button-card-container { background: var(--kibble-feed, #43a96a) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: var(--kibble-ink-on-amber, #241a07) !important; }
  .bubble-icon-container { background: color-mix(in srgb, var(--kibble-ink-on-amber, #241a07) 12%, transparent) !important; }
`;function dg(i,r){return`
  .bubble-button-card-container { height: var(--kibble-touch-target, 48px) !important; ${i?"background: var(--kibble-feed, #43a96a) !important;":""} ${r?"opacity: 0.5;":""} }
  .bubble-button-card { padding: 0 !important; }
  .bubble-name-container { margin: 0 !important; width: 100%; justify-content: center; }
  .bubble-name { width: 100%; justify-content: center; text-align: center; font-size: 17px; font-weight: 600; ${i?"color: var(--kibble-ink-on-amber, #241a07) !important;":""} }
`}var pg=`
  .bubble-button-card-container { background: var(--error-color, #d9534f) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: #fff !important; }
`,pa=class extends y{constructor(){super();this._entities=ag;this._wasFeedingForRequest=!1;this._timelineGeneration=0;this._timelineQuery=new re(()=>this.requestUpdate());this._imageCache=new _e;this._catsQuery=new re(()=>this.requestUpdate());this._calibrationQuery=new re(()=>this.requestUpdate());this._calibrationGeneration=0;this._calibrationOpen=!1;this._detectionAreasOpen=!1;this._hopperSheetOpen=!1;this._onBubbleAction=e=>{let t=e.detail,s=t?.config?.[`${t.action}_action`];s?.action!=="fire-dom-event"||!s.kibble||(e.stopPropagation(),s.kibble==="portion"&&typeof s.portion=="number"&&this._entities.feedAmount?this.hass.callService("number","set_value",{value:s.portion},{entity_id:this._entities.feedAmount}):s.kibble==="feed"?this._onFeedActivate():s.kibble==="cancel"?this._onCancelActivate():s.kibble==="calibrate"&&(this._calibrationOpen=!0))};this._onHopper1PortionSelected=e=>{this._setHopperPortion(this._entities.feedAmountHopper1,e)};this._onHopper2PortionSelected=e=>{this._setHopperPortion(this._entities.feedAmountHopper2,e)};this._onFeedActivate=async()=>{if(!this._entities.deviceId||this._feedRequest.phase==="requesting")return;let t=this._singleHopper()?{hopper:"both",amount:this._numberState(this._entities.feedAmount)??1}:ml(this._numberState(this._entities.feedAmountHopper1)??0,this._numberState(this._entities.feedAmountHopper2)??0);if(t){this._clearFeedRequestTimeoutTimer(),this._clearFeedErrorTimer(),this._feedError=null,this._feedRequest=gl(),this._armFeedRequestTimeout(),this._pourSource=t.hopper;try{await this.hass.callService("kibble","feed",{device_id:this._entities.deviceId,hopper:t.hopper,amount:t.amount,...t.amount2!==void 0?{amount2:t.amount2}:{}})}catch{this._clearFeedRequestTimeoutTimer(),this._feedRequest=en(),this._pourSource=null,this._feedError="Try hold again",this._resetFeedErrorAfter(5e3)}}};this._onCancelActivate=()=>{this._entities.deviceId&&this.hass.callService("kibble","cancel_feed",{device_id:this._entities.deviceId})};this._openSettings=()=>{this._notifyHeroActivity();let e=this._config?.settings_hash;if(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}));return}this._settingsOpen=!0};this._notifyHeroActivity=()=>{this.renderRoot.querySelector("kibble-live-hero")?.notifyActivity()};this._onHeroOverlayIdleChanged=e=>{this._heroControlsVisible=e.detail.visible};this._onMediaAspectChanged=e=>{let t=e.detail?.ratio;!Number.isFinite(t)||t<=0||this.renderRoot.querySelector(".hero")?.style.setProperty("--kibble-hero-aspect",String(t))};this._closeSettings=()=>{this._settingsOpen=!1};this._onHashChange=()=>{let e=Js(window.location.hash,this._config);e==="calibrate"&&(this._calibrationOpen=!0),e==="detection-areas"&&(this._detectionAreasOpen=!0)};this._closeCalibration=e=>{e.stopPropagation(),this._calibrationOpen=!1,this._clearPopupHash()};this._closeDetectionAreas=e=>{e.stopPropagation(),this._detectionAreasOpen=!1,this._clearPopupHash()};this._openHopperSheet=()=>{this._hopperSheetOpen=!0};this._closeHopperSheet=e=>{e.stopPropagation(),this._hopperSheetOpen=!1};this._onCalibrationChanged=()=>{this._calibrationGeneration+=1,this.requestUpdate()};this._settingsOpen=!1,this._bubble=!1,this._feedRequest=mr,this._feedError=null,this._pourSource=null,this._heroControlsVisible=!0,Tp().then(e=>{this._bubble=e})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_settingsOpen:{state:!0},_calibrationOpen:{state:!0},_detectionAreasOpen:{state:!0},_hopperSheetOpen:{state:!0},_bubble:{state:!0},_feedRequest:{state:!0},_feedError:{state:!0},_pourSource:{state:!0},_heroControlsVisible:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-card-editor")}connectedCallback(){super.connectedCallback(),window.addEventListener("hashchange",this._onHashChange),window.addEventListener("location-changed",this._onHashChange),this._onHashChange(),this._resizeObserver=new ResizeObserver(e=>{let t=e[0]?.contentRect,s=t?.height??this.getBoundingClientRect().height,n=t?.width??this.getBoundingClientRect().width;this.classList.toggle("kiosk",s>=440),this.classList.toggle("compact",n<640&&s>0&&s<=520)}),this._resizeObserver.observe(this)}disconnectedCallback(){window.removeEventListener("hashchange",this._onHashChange),window.removeEventListener("location-changed",this._onHashChange),this._clearFeedRequestTimeoutTimer(),this._clearFeedErrorTimer(),super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._imageCache.dispose()}willUpdate(){let e=this._config?.device_id;this.classList.toggle("dual-hopper",this.hass?!this._singleHopper():!1),this.hass&&e&&(this.hass.entities!==this._resolvedEntities||this.hass.devices!==this._resolvedDevices||e!==this._resolvedDeviceId)&&(this._resolvedEntities=this.hass.entities,this._resolvedDevices=this.hass.devices,this._resolvedDeviceId=e,this._entities=je(this.hass.entities??{},e),this._entryId=At(this.hass.devices??{},e));let t=this.hass?.callWS;if(this.hass&&this._entryId&&t&&this._entities.lastSeenPet){let s=this._entryId;this._catsQuery.sync(za(this.hass,[this._entities.lastSeenPet]),()=>t({type:"kibble/cats",entry_id:s}).then(n=>n))}if(this.hass&&this._entryId&&t&&this._entities.bowlFill){let s=this._entryId;this._calibrationQuery.sync(`${s}:${this._calibrationGeneration}`,()=>t({type:"kibble/calibration",entry_id:s}).then(n=>n))}if(this.hass&&this._entities.feeding){let s=this.hass.states[this._entities.feeding]?.state==="on";s!==this._wasFeedingForRequest&&(this._wasFeedingForRequest=s,this._feedRequest=_l(this._feedRequest,s),s?(this._clearFeedRequestTimeoutTimer(),this._feedError=null):this._pourSource=null,this._timelineGeneration+=1)}if(this.hass&&this._entryId&&t){let s=this._entryId;this._timelineQuery.sync(`${s}:${this._timelineGeneration}`,()=>t({type:"kibble/timeline",entry_id:s,limit:5}).then(n=>n))}}render(){if(!this._config||!this.hass)return p;let e=this._entities,t=e.feeding?this.hass.states[e.feeding]?.state:void 0,n=[e.feeding,e.bowlFill,e.schedule].filter(ce=>!!ce).map(ce=>this.hass.states[ce]?.state),o=Da(n,t),a=t==="on",l=this._numberState(e.bowlFill),u=e.bowlFill?this.hass.states[e.bowlFill]?.attributes?.source??null:null,h=rl(this._calibrationQuery.state.data),d=Gs(e.hopperLevel1&&this.hass.states[e.hopperLevel1]?.state),f=Gs(e.hopperLevel2&&this.hass.states[e.hopperLevel2]?.state),m=e.hopperRemaining1?Ys(this.hass.states[e.hopperRemaining1]):null,b=e.hopperRemaining2?Ys(this.hass.states[e.hopperRemaining2]):null,v=this._singleHopper(),_=e.hopperFood1?Lt(this.hass.states[e.hopperFood1]):null,k=e.hopperFood2?Lt(this.hass.states[e.hopperFood2]):null,R=this._scheduleEntries(),z=this._numberState(e.feedAmount)??1,M=this._numberState(e.feedAmountHopper1)??0,V=this._numberState(e.feedAmountHopper2)??0,Y=v?z:M+V,w=this._heroOverlay(o),E=this._feedError??(this._feedRequest.phase==="requesting"?"Requesting\u2026":"Hold to feed"),I=a?"Feeding":E,N=!v&&M===0&&V===0,B=o==="unreachable"||!a&&this._feedRequest.phase==="requesting"||N,$t=!a&&this._feedRequest.phase==="requesting",ae=this.hass.themes?.darkMode===!0,le=bl(this._timelineQuery.state.data?.items??[],v);return c`
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
                    ></kibble-avatar>`:p}
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
              .singleHopper=${v}
              .food1=${_}
              .food2=${k}
              .feeding=${a}
              .portions=${Y}
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
              ${v?c`
                    <kibble-segmented-picker
                      class="picker-full"
                      .value=${String(z)}
                      .options=${lg}
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
                      <span class="hopper-row-label">${_??"Hopper 1"}</span>
                      <kibble-stepper
                        .value=${M}
                        .min=${0}
                        .max=${5}
                        aria-label="${_??"Hopper 1"} portions"
                        ?disabled=${o==="unreachable"||a}
                        @value-selected=${this._onHopper1PortionSelected}
                      ></kibble-stepper>
                    </div>
                    <div class="hopper-row">
                      <span class="hopper-row-label">${k??"Hopper 2"}</span>
                      <kibble-stepper
                        .value=${V}
                        .min=${0}
                        .max=${5}
                        aria-label="${k??"Hopper 2"} portions"
                        ?disabled=${o==="unreachable"||a}
                        @value-selected=${this._onHopper2PortionSelected}
                      ></kibble-stepper>
                    </div>
                  `}
              <kibble-hold-button
                .label=${I}
                .variant=${a?"cancel":"feed"}
                ?disabled=${B}
                ?pending=${$t}
                @activate=${a?this._onCancelActivate:this._onFeedActivate}
              ></kibble-hold-button>
            </div>
            </div>
            ${this._config.schedule_hash?p:c`<kibble-schedule-summary
                  class="schedule-row"
                  .hass=${this.hass}
                  .entries=${R}
                  .scheduleCardStateEntity=${e.scheduleCardState}
                  .singleHopper=${v}
                  .deviceId=${e.deviceId}
                  .food1=${_}
                  .food2=${k}
                ></kibble-schedule-summary>`}
            </div>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog
        .hass=${this.hass}
        .entities=${e}
        .entryId=${this._entryId}
        .singleHopper=${v}
        .food1=${_}
        .food2=${k}
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
        .singleHopper=${v}
        .food1=${_}
        .food2=${k}
        @close-requested=${this._closeHopperSheet}
      ></kibble-hopper-sheet>
      <kibble-calibration-dialog
        .hass=${this.hass}
        .entryId=${this._entryId}
        .singleHopper=${v}
        .food1=${_}
        .food2=${k}
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
    `}_numberState(e){if(!e)return null;let t=Number(this.hass.states[e]?.state);return Number.isFinite(t)?t:null}_heroOverlay(e){let t=this._entities.camera,s=t?this.hass.states[t]:void 0,n=s!==void 0&&s.state!=="unavailable";if(e==="unreachable")return{text:Ns(e,null),tone:"error",live:n,catName:null,colorIndex:null,avatarAsset:null};if(e==="dispensing")return{text:Ns(e,null),tone:"amber",live:n,catName:null,colorIndex:null,avatarAsset:null};let o=this._catSeen(),a=this._entities.eating,l=a!==void 0&&this.hass.states[a]?.state==="on";if(!o)return{text:l?"Eating now":"Ready to feed",tone:"normal",live:n,catName:null,colorIndex:null,avatarAsset:null};let u=this._catsQuery.state.data?.cats.find(h=>h.name===o.name)??null;return{text:l?`${o.name} is eating`:`${o.name} seen ${o.relative}`,tone:"normal",live:n,catName:o.name,colorIndex:u?.color??null,avatarAsset:u?.avatar??null}}_catSeen(){let e=this._entities.lastSeenPet,t=e?this.hass.states[e]:void 0;if(!t||t.state==="unavailable"||t.state.toLowerCase()==="unknown")return null;let s=t.attributes?.last_identified,n=typeof s=="string"?new Date(s):new Date(t.last_changed),o=Number.isNaN(n.getTime())?new Date(t.last_changed):n;return{name:t.state,relative:Rt(o,new Date)}}_scheduleEntries(){let e=this._entities.schedule;return ir(e?this.hass.states[e]:void 0)}_portionConfigs(e,t){let s={action:"none"};return Wp.map(n=>{let o={tap_action:t?s:{action:"fire-dom-event",kibble:"portion",portion:n},double_tap_action:s,hold_action:s};return{card_type:"button",button_type:"name",name:String(n),show_icon:!1,show_state:!1,styles:dg(n===e,t),...o,button_action:o}})}_feedRowConfig(e,t){let s={action:"none"},n={tap_action:e&&!t?{action:"fire-dom-event",kibble:"cancel"}:s,double_tap_action:s,hold_action:!e&&!t?{action:"fire-dom-event",kibble:"feed"}:s};return{card_type:"button",button_type:"name",name:t?"Feeder unreachable":e?"Feeding\u2026 tap to cancel":"Hold to feed",icon:e?"mdi:stop-circle-outline":"mdi:bowl-mix",styles:e?pg:cg,...n,button_action:n}}_onPortionSelected(e){this._setHopperPortion(this._entities.feedAmount,e)}_setHopperPortion(e,t){if(!e)return;let s=Number(t.detail.value);Number.isFinite(s)&&this.hass.callService("number","set_value",{value:s},{entity_id:e})}_singleHopper(){let e=this._entities.hopperDivider;return e!=null&&this.hass.states[e]?.state==="off"}_armFeedRequestTimeout(){this._clearFeedRequestTimeoutTimer(),this._feedRequestTimeoutTimer=setTimeout(()=>{this._feedRequestTimeoutTimer=void 0,this._feedRequest.phase==="requesting"&&(this._feedRequest=vl(this._feedRequest,br.timeoutMs,br),this._pourSource=null,this._feedError="No response from the feeder",this._resetFeedErrorAfter(5e3))},br.timeoutMs)}_clearFeedRequestTimeoutTimer(){this._feedRequestTimeoutTimer!==void 0&&clearTimeout(this._feedRequestTimeoutTimer),this._feedRequestTimeoutTimer=void 0}_resetFeedErrorAfter(e){this._clearFeedErrorTimer(),this._feedErrorTimer=setTimeout(()=>{this._feedErrorTimer=void 0,this._feedError=null,this._feedRequest=en()},e)}_clearFeedErrorTimer(){this._feedErrorTimer!==void 0&&clearTimeout(this._feedErrorTimer),this._feedErrorTimer=void 0}_clearPopupHash(){Js(window.location.hash,this._config)!==null&&history.replaceState(null,"",`${window.location.pathname}${window.location.search}`)}static{this.styles=x`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${K(Wa)};
      --kibble-amber-dark: ${K(or)};
      /* The feed action, deliberately not the food's amber -- see the token's own doc. */
      --kibble-feed: ${K(sr)};
      --kibble-feed-dark: ${K(Va)};
      --kibble-ink-on-feed: ${K(nr)};
      --kibble-ink-on-amber: ${K(Ka)};
      --kibble-live: ${K(Ga)};
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
  `}};console.info(`%c KIBBLE-CARD %c ${qa} `,"background:#43A96A;color:#10301D;font-weight:700","background:#10301D;color:#fff");customElements.define("kibble-card",pa);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-card",name:"Kibble",description:"The full daily control surface for a Kibble Petkit feeder: live camera, who's been by, feed, and schedule.",preview:!0});export{pa as KibbleCard};
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

lit-html/directives/keyed.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
