var J=globalThis,ee=J.ShadowRoot&&(J.ShadyCSS===void 0||J.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,be=Symbol(),Ye=new WeakMap,z=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==be)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(ee&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=Ye.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Ye.set(e,t))}return t}toString(){return this.cssText}},E=r=>new z(typeof r=="string"?r:r+"",void 0,be),h=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new z(e,r,be)},Xe=(r,t)=>{if(ee)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=J.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},fe=ee?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return E(e)})(r):r;var{is:Pt,defineProperty:Rt,getOwnPropertyDescriptor:Kt,getOwnPropertyNames:Ut,getOwnPropertySymbols:Dt,getPrototypeOf:Bt}=Object,te=globalThis,Je=te.trustedTypes,Vt=Je?Je.emptyScript:"",zt=te.reactiveElementPolyfillSupport,O=(r,t)=>r,ge={toAttribute(r,t){switch(t){case Boolean:r=r?Vt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},tt=(r,t)=>!Pt(r,t),et={attribute:!0,type:String,converter:ge,reflect:!1,useDefault:!1,hasChanged:tt};Symbol.metadata??=Symbol("metadata"),te.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=et){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Rt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:n}=Kt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let d=s?.call(this);n?.call(this,o),this.requestUpdate(t,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??et}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=Bt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,i=[...Ut(e),...Dt(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(fe(s))}else t!==void 0&&e.push(fe(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Xe(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:ge).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:ge;this._$Em=s;let d=o.fromAttribute(e,n.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(t!==void 0){let o=this.constructor;if(s===!1&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??tt)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:o}=n,d=this[s];o!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,n,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[O("elementProperties")]=new Map,$[O("finalized")]=new Map,zt?.({ReactiveElement:$}),(te.reactiveElementVersions??=[]).push("2.1.2");var _e=globalThis,it=r=>r,ie=_e.trustedTypes,st=ie?ie.createPolicy("lit-html",{createHTML:r=>r}):void 0,ye="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,xe="?"+C,Ot=`<${xe}>`,T=document,j=()=>T.createComment(""),q=r=>r===null||typeof r!="object"&&typeof r!="function",$e=Array.isArray,dt=r=>$e(r)||typeof r?.[Symbol.iterator]=="function",ve=`[ 	
\f\r]`,F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rt=/-->/g,nt=/>/g,S=RegExp(`>|${ve}(?:([^\\s"'>=/]+)(${ve}*=${ve}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ot=/'/g,at=/"/g,ct=/^(?:script|style|textarea|title)$/i,Ce=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),a=Ce(1),_=Ce(2),Ii=Ce(3),L=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),lt=new WeakMap,A=T.createTreeWalker(T,129);function pt(r,t){if(!$e(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return st!==void 0?st.createHTML(t):t}var ht=(r,t)=>{let e=r.length-1,i=[],s,n=t===2?"<svg>":t===3?"<math>":"",o=F;for(let d=0;d<e;d++){let c=r[d],m,f,u=-1,g=0;for(;g<c.length&&(o.lastIndex=g,f=o.exec(c),f!==null);)g=o.lastIndex,o===F?f[1]==="!--"?o=rt:f[1]!==void 0?o=nt:f[2]!==void 0?(ct.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=S):f[3]!==void 0&&(o=S):o===S?f[0]===">"?(o=s??F,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,m=f[1],o=f[3]===void 0?S:f[3]==='"'?at:ot):o===at||o===ot?o=S:o===rt||o===nt?o=F:(o=S,s=void 0);let v=o===S&&r[d+1].startsWith("/>")?" ":"";n+=o===F?c+Ot:u>=0?(i.push(m),c.slice(0,u)+ye+c.slice(u)+C+v):c+C+(u===-2?d:v)}return[pt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},W=class r{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0,d=t.length-1,c=this.parts,[m,f]=ht(t,e);if(this.el=r.createElement(m,i),A.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=A.nextNode())!==null&&c.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(ye)){let g=f[o++],v=s.getAttribute(u).split(C),X=/([.?@])?(.*)/.exec(g);c.push({type:1,index:n,name:X[2],strings:v,ctor:X[1]==="."?re:X[1]==="?"?ne:X[1]==="@"?oe:H}),s.removeAttribute(u)}else u.startsWith(C)&&(c.push({type:6,index:n}),s.removeAttribute(u));if(ct.test(s.tagName)){let u=s.textContent.split(C),g=u.length-1;if(g>0){s.textContent=ie?ie.emptyScript:"";for(let v=0;v<g;v++)s.append(u[v],j()),A.nextNode(),c.push({type:2,index:++n});s.append(u[g],j())}}}else if(s.nodeType===8)if(s.data===xe)c.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(C,u+1))!==-1;)c.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(t,e){let i=T.createElement("template");return i.innerHTML=t,i}};function M(r,t,e=r,i){if(t===L)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,n=q(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=M(r,s._$AS(r,t.values),s,i)),t}var se=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);A.currentNode=s;let n=A.nextNode(),o=0,d=0,c=i[0];for(;c!==void 0;){if(o===c.index){let m;c.type===2?m=new R(n,n.nextSibling,this,t):c.type===1?m=new c.ctor(n,c.name,c.strings,this,t):c.type===6&&(m=new ae(n,this,t)),this._$AV.push(m),c=i[++d]}o!==c?.index&&(n=A.nextNode(),o++)}return A.currentNode=T,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},R=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=M(this,t,e),q(t)?t===l||t==null||t===""?(this._$AH!==l&&this._$AR(),this._$AH=l):t!==this._$AH&&t!==L&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):dt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==l&&q(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=W.createElement(pt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new se(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=lt.get(t.strings);return e===void 0&&lt.set(t.strings,e=new W(t)),e}k(t){$e(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let n of t)s===e.length?e.push(i=new r(this.O(j()),this.O(j()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=it(t).nextSibling;it(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=l,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=l}_$AI(t,e=this,i,s){let n=this.strings,o=!1;if(n===void 0)t=M(this,t,e,0),o=!q(t)||t!==this._$AH&&t!==L,o&&(this._$AH=t);else{let d=t,c,m;for(t=n[0],c=0;c<n.length-1;c++)m=M(this,d[i+c],e,c),m===L&&(m=this._$AH[c]),o||=!q(m)||m!==this._$AH[c],m===l?t=l:t!==l&&(t+=(m??"")+n[c+1]),this._$AH[c]=m}o&&!s&&this.j(t)}j(t){t===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},re=class extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===l?void 0:t}},ne=class extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==l)}},oe=class extends H{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=M(this,t,e,0)??l)===L)return;let i=this._$AH,s=t===l&&i!==l||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==l&&(i===l||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ae=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}},ut={M:ye,P:C,A:xe,C:1,L:ht,R:se,D:dt,V:M,I:R,H,N:ne,U:oe,B:re,F:ae},Ft=_e.litHtmlPolyfillSupport;Ft?.(W,R),(_e.litHtmlVersions??=[]).push("3.3.3");var mt=(r,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let n=e?.renderBefore??null;i._$litPart$=s=new R(t.insertBefore(j(),n),n,void 0,e??{})}return s._$AI(r),s};var ke=globalThis,p=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=mt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};p._$litElement$=!0,p.finalized=!0,ke.litElementHydrateSupport?.({LitElement:p});var jt=ke.litElementPolyfillSupport;jt?.({LitElement:p});(ke.litElementVersions??=[]).push("4.2.2");var qt={feeding:{domain:"binary_sensor",translationKeys:["feeding"],idSuffixes:["_feeding"]},bowlFill1:{domain:"sensor",translationKeys:["bowl_fill_1"],idSuffixes:["_bowl_fill_1","_bowl_fill_hopper_1"]},bowlFill2:{domain:"sensor",translationKeys:["bowl_fill_2"],idSuffixes:["_bowl_fill_2","_bowl_fill_hopper_2"]},desiccantDays:{domain:"sensor",translationKeys:["desiccant_days","desiccant_left"],idSuffixes:["_desiccant_days","_desiccant_left"]},schedule:{domain:"sensor",translationKeys:["schedule"],idSuffixes:["_schedule"]},scheduleCardState:{domain:"sensor",translationKeys:["schedule_card_state"],idSuffixes:["_schedule_card_state"]},feedButton:{domain:"button",translationKeys:["feed"],idSuffixes:["_feed"]},feedButtonHopper1:{domain:"button",translationKeys:["feed_hopper_1"],idSuffixes:["_feed_hopper_1"]},feedButtonHopper2:{domain:"button",translationKeys:["feed_hopper_2"],idSuffixes:["_feed_hopper_2"]},cancelFeedButton:{domain:"button",translationKeys:["cancel_feed"],idSuffixes:["_cancel_feed"]},feedAmount:{domain:"number",translationKeys:["feed_amount"],idSuffixes:["_feed_amount"]},feedAmountHopper1:{domain:"number",translationKeys:["feed_amount_hopper_1"],idSuffixes:["_feed_amount_hopper_1"]},feedAmountHopper2:{domain:"number",translationKeys:["feed_amount_hopper_2"],idSuffixes:["_feed_amount_hopper_2"]},cloudSwitch:{domain:"switch",translationKeys:["cloud","petkit_cloud"],idSuffixes:["_cloud","_petkit_cloud"]},cloudConnection:{domain:"sensor",translationKeys:["cloud_connection"],idSuffixes:["_cloud_connection"]},nightVisionSwitch:{domain:"switch",translationKeys:["night","night_vision"],idSuffixes:["_night","_night_vision"]},statusLedSwitch:{domain:"switch",translationKeys:["light","status_led"],idSuffixes:["_light","_status_led"]},microphoneSwitch:{domain:"switch",translationKeys:["microphone"],idSuffixes:["_microphone"]},volume:{domain:"number",translationKeys:["volume"],idSuffixes:["_volume"]},lastSeenPet:{domain:"sensor",translationKeys:["last_seen_pet"],idSuffixes:["_last_seen_pet"]},dishBefore:{domain:"image",translationKeys:["dish_before"],idSuffixes:["_dish_before"]},dishAfter:{domain:"image",translationKeys:["dish_after"],idSuffixes:["_dish_after"]},wifiNetwork:{domain:"sensor",translationKeys:["wifi_network","wifi","rssi"],idSuffixes:["_wifi_network","_wifi","_rssi"]},lastDetection:{domain:"sensor",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},detectionsToday:{domain:"sensor",translationKeys:["detections_today"],idSuffixes:["_detections_today"]},lastDetectionImage:{domain:"image",translationKeys:["last_detection"],idSuffixes:["_last_detection"]},pendingFace:{domain:"image",translationKeys:["pending_face"],idSuffixes:["_pending_face"]}};function le(r){return r.slice(0,r.indexOf("."))}function we(r){return r.slice(r.indexOf(".")+1)}function Wt(r,t){if(le(r.entity_id)!==t.domain)return!1;if(r.translation_key&&t.translationKeys.includes(r.translation_key))return!0;let e=we(r.entity_id);return t.idSuffixes.some(i=>e.endsWith(i))}function Qt(r){let t=r.name??r.original_name;if(t)return t.replace(/\s+present$/i,"").trim()||t;let s=we(r.entity_id).replace(/_present$/,"").split("_").filter(Boolean).pop();return s?s[0].toUpperCase()+s.slice(1):"Cat"}function Gt(r){return le(r.entity_id)!=="binary_sensor"?!1:r.translation_key==="present"||r.translation_key?.endsWith("_present")?!0:we(r.entity_id).endsWith("_present")}function K(r,t){let e={deviceId:t,catPresence:[]},i=Object.values(r).filter(s=>s.device_id===t&&!s.disabled_by);for(let s of i){if(le(s.entity_id)==="camera"&&!e.camera){e.camera=s.entity_id;continue}if(le(s.entity_id)==="media_player"&&!e.speaker){e.speaker=s.entity_id;continue}if(Gt(s)){e.catPresence.push({entityId:s.entity_id,name:Qt(s)});continue}for(let n of Object.entries(qt)){let[o,d]=n;if(!e[o]&&Wt(s,d)){e[o]=s.entity_id;break}}}return e.catPresence.sort((s,n)=>s.name.localeCompare(n.name)),e}function U(r,t){if(t)return r[t]?.config_entries?.[0]}function bt(r,t){let e=i=>i===void 0||i==="unavailable"||i==="unknown";return r.length===0||r.every(e)?"unreachable":t==="on"?"dispensing":"idle"}function Ee(r,t){return r==="unreachable"?"Feeder unreachable \u2014 check that kibbled is running":r==="dispensing"?"Dispensing\u2026":t?`Fed ${t}`:"Ready to feed"}function Zt(r,t){let e=Math.floor(Math.max(0,t.getTime()-r.getTime())/6e4);if(e<1)return{unit:"now",value:0};if(e<60)return{unit:"minutes",value:e};let i=Math.floor(e/60);return i<24?{unit:"hours",value:i}:{unit:"days",value:Math.floor(i/24)}}function de(r,t){let e=Zt(r,t);if(e.unit==="now")return"just now";let i=e.unit==="minutes"?"min":e.unit==="hours"?"h":"d";return`${e.value} ${i} ago`}var Yt={data:null,error:null,loading:!1},y=class{constructor(t){this._lastWatched=null;this._requestId=0;this._state=Yt;this._onChange=t}get state(){return this._state}sync(t,e){t!==this._lastWatched&&(this._lastWatched=t,this.refresh(e))}refresh(t){let e=++this._requestId;this._state={...this._state,loading:!0,error:null},this._onChange(),t().then(i=>{e===this._requestId&&(this._state={data:i,error:null,loading:!1},this._onChange())},i=>{e===this._requestId&&(this._state={...this._state,error:Q(i),loading:!1},this._onChange())})}};function D(r,t){return t.filter(e=>!!e).map(e=>`${e}=${r.states[e]?.state??""}`).join("|")}function Q(r){if(r instanceof Error)return r.message;if(r&&typeof r=="object"&&"message"in r){let t=r.message;if(typeof t=="string"&&t)return t}return"Something went wrong."}var Xt={cog:"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",cloudCheck:"M13 19C13 19.34 13.04 19.67 13.09 20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.32 7.4 19 9.05 19 11C20.15 11.13 21.1 11.63 21.86 12.5C22.37 13.07 22.7 13.71 22.86 14.42C21.82 13.54 20.5 13 19 13C18.89 13 18.79 13 18.68 13C18.62 13 18.56 13 18.5 13H17V11C17 9.62 16.5 8.44 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18H13.09C13.04 18.33 13 18.66 13 19M17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84L17.75 19.43Z",cloudLock:"M6.5 18H13V20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.08 7.16 18.73 8.5 18.93 10C18.23 10 17.56 10.19 16.95 10.46C16.84 9.31 16.38 8.31 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18M23 17.3V20.8C23 21.4 22.4 22 21.7 22H16.2C15.6 22 15 21.4 15 20.7V17.2C15 16.6 15.6 16 16.2 16V14.5C16.2 13.1 17.6 12 19 12S21.8 13.1 21.8 14.5V16C22.4 16 23 16.6 23 17.3M20.5 14.5C20.5 13.7 19.8 13.2 19 13.2S17.5 13.7 17.5 14.5V16H20.5V14.5Z",cloudAlert:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M11 7H13V13H11V7Z",cloudQuestion:"M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M14.43 8.68C14.97 9.13 15.24 9.75 15.24 10.5C15.24 11 15.09 11.41 14.8 11.82C14.5 12.21 14.13 12.5 13.67 12.75C13.41 12.91 13.24 13.07 13.15 13.26C13.06 13.45 13 13.69 13 14H11C11 13.45 11.11 13.08 11.3 12.82C11.5 12.56 11.85 12.25 12.37 11.91C12.63 11.75 12.84 11.56 13 11.32C13.15 11.09 13.23 10.81 13.23 10.5C13.23 10.18 13.14 9.94 12.96 9.76C12.78 9.56 12.5 9.47 12.2 9.47C11.93 9.47 11.71 9.55 11.5 9.7C11.35 9.85 11.25 10.08 11.25 10.39H9.28C9.23 9.64 9.5 9 10.06 8.59C10.6 8.2 11.31 8 12.2 8C13.14 8 13.89 8.23 14.43 8.68Z",airFilter:"M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",wifi:"M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",weatherNight:"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",ledOn:"M11,0V4H13V0H11M18.3,2.29L15.24,5.29L16.64,6.71L19.7,3.71L18.3,2.29M5.71,2.29L4.29,3.71L7.29,6.71L8.71,5.29L5.71,2.29M12,6A4,4 0 0,0 8,10V16H6V18H9V23H11V18H13V23H15V18H18V16H16V10A4,4 0 0,0 12,6M2,9V11H6V9H2M18,9V11H22V9H18Z",microphone:"M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z",volumeHigh:"M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",openInNew:"M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",speaker:"M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z"};function x(r){return _`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d=${Xt[r]}></path></svg>`}var gt="#F4A452",vt="#DE8A3A",_t="#3A2C28",yt="#E5484D",ft=["#3FA7A0","#9A5B9E","#7FA05A","#4F86C6"];function ce(r){let t=ft.length;return ft[(r%t+t)%t]}function xt(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0}function $t(r,t){return r===null&&t===null?{split:!1,hopper1:null,hopper2:null,combined:null}:r===null||t===null?{split:!1,hopper1:r,hopper2:t,combined:r??t}:Math.abs(r-t)<5?{split:!1,hopper1:r,hopper2:t,combined:Math.round((r+t)/2)}:{split:!0,hopper1:r,hopper2:t,combined:null}}var ei=260,ti=200,b=130,B=60,I=116,Ct=40,G=178,Se=46,ii=10,N=78,Ae=86,si=46,ri=`M ${b+I} ${B} C ${b+I} ${B+50}, ${b+70} ${G-13}, ${b+Se} ${G} A ${Se} ${ii} 0 0 1 ${b-Se} ${G} C ${b-70} ${G-13}, ${b-I} ${B+50}, ${b-I} ${B} A ${I} ${Ct} 0 0 0 ${b+I} ${B} Z`,Le=[-.6,-.32,-.06,.2,.46,.66,-.46,.08,.34,-.2];function ni(r,t,e){let i=(r+t)/2;return`M ${r} ${N} Q ${i} ${N-2*e} ${t} ${N} Z`}function oi(r,t,e,i){let s=N-2*i;return(1-r)*(1-r)*N+2*(1-r)*r*s+r*r*N}function kt(r,t,e,i){let s=[0,120,240].map(n=>{let o=(n+i)*Math.PI/180;return _`<circle cx=${(r+Math.cos(o)*e*.55).toFixed(1)} cy=${(t+Math.sin(o)*e*.55).toFixed(1)} r=${(e*.62).toFixed(1)} />`});return _`<g>${s}</g>`}function Te(r,t,e,i){if(e<=.02)return l;let s=si*e,n=Math.round(6+4*e),o=[];for(let d=0;d<n;d++){let c=(d+.5)/n,m=r+(t-r)*c,f=oi(c,r,t,s),u=Le[(d+i)%Le.length]*6,g=5.5+(d+i)%3*1.4,v=d===0||d===n-1?d===0?-3:3:0;o.push(kt(m+v,f+u-2,g,d*47+i*13))}return _`
    <path d=${ni(r,t,s)} class="fill" />
    <g class="texture">${o}</g>
  `}var Me=class extends p{constructor(){super();this._wasFeeding=!1;this._dropping=!1;this._dropTimer=void 0;this.hopper1=null,this.hopper2=null,this.feeding=!1}static{this.properties={hopper1:{type:Number},hopper2:{type:Number},feeding:{type:Boolean}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._dropTimer)}willUpdate(e){e.has("feeding")&&this.feeding&&!this._wasFeeding&&!xt()&&(this._dropping=!0,clearTimeout(this._dropTimer),this._dropTimer=setTimeout(()=>{this._dropping=!1,this.requestUpdate()},900)),this._wasFeeding=this.feeding}render(){let e=$t(this.hopper1,this.hopper2);return a`
      <div class="wrap">
        <svg class="art" viewBox="0 0 ${ei} ${ti}" aria-hidden="true" preserveAspectRatio="xMidYMin meet">
          <ellipse cx=${b} cy=${G+14} rx="66" ry="9" class="shadow" />
          <path class="body" d=${ri} />
          ${e.split?this._renderSplitBasin(e.hopper1,e.hopper2):this._renderSingleBasin(e.combined??0)}
          <ellipse cx=${b} cy=${B} rx=${I} ry=${Ct} class="rim" />
          ${this._dropping?this._renderFallingKibble():l}
        </svg>
        <div class="numbers">
          ${e.split?a`
                <span class="fill-number split">${Math.round(e.hopper1)}<small>%</small></span>
                <span class="fill-number split">${Math.round(e.hopper2)}<small>%</small></span>
              `:a`<span class="fill-number">${e.combined==null?"\u2014":a`${Math.round(e.combined)}<small>%</small>`}</span>`}
        </div>
      </div>
    `}_renderSingleBasin(e){let i=e/100;return _`
      <g>
        <ellipse cx=${b} cy="62" rx="100" ry="32" class="basin-far" />
        <ellipse cx=${b} cy="68" rx="90" ry="25" class="basin-near" />
        ${Te(b-Ae*(.32+.68*Math.sqrt(i)),b+Ae*(.32+.68*Math.sqrt(i)),i,0)}
      </g>
    `}_renderSplitBasin(e,i){let s=b-44,n=b+44,o=40,d=e/100,c=i/100;return _`
      <g>
        <ellipse cx=${b} cy="62" rx="100" ry="32" class="basin-far" />
        <ellipse cx=${b} cy="68" rx="90" ry="25" class="basin-near" />
        ${Te(s-o*(.35+.65*Math.sqrt(d)),s+o*(.35+.65*Math.sqrt(d)),d,1)}
        ${Te(n-o*(.35+.65*Math.sqrt(c)),n+o*(.35+.65*Math.sqrt(c)),c,4)}
        <g class="divider">
          <line x1=${b-3} y1="46" x2=${b-3} y2="90" />
          <line x1=${b+3} y1="46" x2=${b+3} y2="90" />
        </g>
      </g>
    `}_renderFallingKibble(){let e=Le.slice(0,7).map((i,s)=>{let n=b+i*(Ae-6),c=`--fall-delay:${s*70}ms;--fall-duration:320ms;--fall-rotate:${(i*180).toFixed(0)}deg;--fall-to:${N-30}px;`;return _`<g class="drop" style=${c}>${kt(n,0,7,i*60)}</g>`});return _`<g class="drops">${e}</g>`}static{this.styles=h`
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
      stroke: var(--primary-text-color);
      stroke-width: 2.6;
      stroke-linejoin: round;
    }
    .rim {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 1.6;
    }
    .basin-far {
      fill: var(--divider-color);
    }
    .basin-near {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.16));
    }
    .divider line {
      stroke: var(--primary-text-color);
      stroke-width: 1.4;
    }
    .fill {
      fill: var(--kibble-amber);
    }
    .texture circle {
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
  `}};customElements.define("kibble-bowl",Me);var ai=[1,2,3,4,5],He=class extends p{static{this.properties={value:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.disabled=!1}render(){return a`
      <div class="segments" role="radiogroup" aria-label="Feed amount, portions">
        ${ai.map(t=>a`
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
    `}_select(t){this.dispatchEvent(new CustomEvent("portion-selected",{detail:{value:t},bubbles:!0,composed:!0}))}static{this.styles=h`
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
  `}};customElements.define("kibble-segmented-picker",He);var Ie=class extends p{static{this.properties={value:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},disabled:{type:Boolean}}}constructor(){super(),this.value=1,this.min=1,this.max=20,this.step=1,this.disabled=!1}render(){return a`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value<=this.min} @click=${this._decrement} aria-label="Fewer portions">
          &minus;
        </button>
        <span class="value">${this.value}</span>
        <button type="button" class="step-btn" ?disabled=${this.disabled||this.value>=this.max} @click=${this._increment} aria-label="More portions">
          &plus;
        </button>
      </div>
    `}_decrement(){this._emit(Math.max(this.min,this.value-this.step))}_increment(){this._emit(Math.min(this.max,this.value+this.step))}_emit(t){this.dispatchEvent(new CustomEvent("value-selected",{detail:{value:t},bubbles:!0,composed:!0}))}static{this.styles=h`
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
  `}};customElements.define("kibble-stepper",Ie);var Ne=class extends p{constructor(){super();this._holding=!1;this._holdTimer=void 0;this._startHold=e=>{this.disabled||(e.preventDefault(),this._holding=!0,this.requestUpdate(),clearTimeout(this._holdTimer),this._holdTimer=setTimeout(()=>{this._holding=!1,this.requestUpdate(),this._activate()},this.holdMs))};this._cancelHold=()=>{clearTimeout(this._holdTimer),this._holding&&(this._holding=!1,this.requestUpdate())};this.label="Hold to feed",this.variant="feed",this.disabled=!1,this.holdMs=600}static{this.properties={label:{type:String},variant:{type:String},disabled:{type:Boolean},holdMs:{type:Number,attribute:"hold-ms"}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._holdTimer)}render(){return a`
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
        ${this.variant==="feed"?a`<span class="fill"></span>`:""}
        <span class="label">${this.label}</span>
      </button>
    `}_tapActivate(){this.disabled||this._activate()}_activate(){this.dispatchEvent(new CustomEvent("activate",{bubbles:!0,composed:!0}))}static{this.styles=h`
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
  `}};customElements.define("kibble-hold-button",Ne);var{I:us}=ut;var wt=r=>r.strings===void 0;var Et={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Pe=r=>(...t)=>({_$litDirective$:r,values:t}),pe=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var Z=(r,t)=>{let e=r._$AN;if(e===void 0)return!1;for(let i of e)i._$AO?.(t,!1),Z(i,t);return!0},he=r=>{let t,e;do{if((t=r._$AM)===void 0)break;e=t._$AN,e.delete(r),r=t}while(e?.size===0)},St=r=>{for(let t;t=r._$AM;r=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(r))break;e.add(r),pi(t)}};function di(r){this._$AN!==void 0?(he(this),this._$AM=r,St(this)):this._$AM=r}function ci(r,t=!1,e=0){let i=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(t)if(Array.isArray(i))for(let n=e;n<i.length;n++)Z(i[n],!1),he(i[n]);else i!=null&&(Z(i,!1),he(i));else Z(this,r)}var pi=r=>{r.type==Et.CHILD&&(r._$AP??=ci,r._$AQ??=di)},ue=class extends pe{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),St(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(Z(this,t),he(this))}setValue(t){if(wt(this._$Ct))this._$Ct._$AI(t,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var V=()=>new Ke,Ke=class{},Re=new WeakMap,P=Pe(class extends ue{render(r){return l}update(r,[t]){let e=t!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=t,this.ht=r.options?.host,this.rt(this.ct=r.element)),l}rt(r){if(this.G!==void 0)if(this.isConnected||(r=void 0),typeof this.G=="function"){let t=this.ht??globalThis,e=Re.get(t);e===void 0&&(e=new WeakMap,Re.set(t,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,r),r!==void 0&&this.G.call(this.ht,r)}else this.G.value=r}get lt(){return typeof this.G=="function"?Re.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function hi(r){let t=/^(\d{1,2}):(\d{2})$/.exec(r.trim());if(!t)throw new Error(`Invalid schedule time "${r}"`);let e=Number(t[1]),i=Number(t[2]);if(e>23||i>59)throw new Error(`Invalid schedule time "${r}"`);return e*60+i}function ui(r,t){let e=t.getHours()*60+t.getMinutes(),i=null;for(let s of r){if(!s.enabled)continue;let o=((hi(s.time)-e)%1440+1440)%1440;(i===null||o<i.minutesUntil)&&(i={entry:s,minutesUntil:o})}return i}var mi=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function At(r,t){if(r.length===0)return"No schedule set";let e=ui(r,t);if(!e)return"All feeds paused";let i=r.filter(n=>n.enabled).length,s=mi[i]??String(i);return`Next feed ${e.entry.time}, ${s} a day`}var Ue="dispenser-schedule-card",De=class extends p{constructor(){super();this._expanded=!1;this._embedRef=V();this._configureEmbed=e=>{if(!e||!this.scheduleCardStateEntity)return;let i=e.querySelector(Ue);if(i){i.hass=this.hass;return}let s=document.createElement(Ue);s.setConfig({type:"custom:dispenser-schedule-card",device:{type:"custom",entity:this.scheduleCardStateEntity,max_entries:24,min_amount:1,max_amount:20,step_amount:1,status_map:["0 -> dispensed","1 -> failed","2 -> pending","3 -> dispensing"],status_pattern:"(?<id>[^,]+),(?<hour>[0-9]{1,2}),(?<minute>[0-9]{1,2}),(?<amount>[0-9]{1,2}),(?<status>[0-9]);?",actions:{add:"kibble.schedule_card_add",edit:"kibble.schedule_card_edit",remove:"kibble.schedule_card_remove",toggle:"kibble.schedule_card_toggle"}},unit_of_measurement:{one:"portion",other:"portions"}}),s.hass=this.hass,e.appendChild(s)};this.entries=[],this.deviceName="Kibble"}static{this.properties={hass:{attribute:!1},entries:{attribute:!1},scheduleCardStateEntity:{type:String},scheduleHash:{type:String},deviceName:{type:String}}}updated(){this._embedRef.value&&this.hass&&(this._embedRef.value.hass=this.hass)}render(){let e=new Date,i=At(this.entries,e);return this.scheduleHash?a`
        <button type="button" class="row" @click=${this._toggle} aria-label="Open schedule">
          <span>${i}</span>
          <span class="chevron">${x("openInNew")}</span>
        </button>
      `:a`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${i}</span>
        <span class="chevron ${this._expanded?"open":""}">${x("chevronDown")}</span>
      </button>
      ${this._expanded?a`<div class="expanded">${this._renderExpanded()}</div>`:l}
    `}_renderExpanded(){if(this._canEmbed())return a`<div ${P(this._configureEmbed)}></div>`;if(this.entries.length===0)return a`<p class="empty">No schedule set</p>`;let e=[...this.entries].sort((i,s)=>i.time.localeCompare(s.time));return a`
      <ul class="entries">
        ${e.map(i=>a`
            <li class=${i.enabled?"":"disabled"}>
              <span class="time">${i.time}</span>
              <span class="amounts">${i.amount_l}g + ${i.amount_r}g</span>
              <span class="state">${i.enabled?"On":"Paused"}</span>
            </li>
          `)}
      </ul>
    `}_canEmbed(){if(!customElements.get(Ue)||!this.scheduleCardStateEntity)return!1;let e=this.hass?.states[this.scheduleCardStateEntity];return e!==void 0&&e.state!=="unavailable"}_toggle(){if(this.scheduleHash){window.location.hash=this.scheduleHash;return}this._expanded=!this._expanded,this.requestUpdate()}static{this.styles=h`
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
  `}};customElements.define("kibble-schedule-summary",De);var bi=3e3;function me(r,t){if(!t)return null;let e=r.states[t];if(!e)return null;let i=Number(e.state);return Number.isNaN(i)?null:{value:i,min:Number(e.attributes.min??1),max:Number(e.attributes.max??20),step:Number(e.attributes.step??1)}}var Be=class extends p{constructor(){super();this._cloudConfirmArmed=!1;this._cloudConfirmTimer=void 0;this.open=!1}static{this.properties={hass:{attribute:!1},entities:{attribute:!1},open:{type:Boolean,reflect:!0}}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._cloudConfirmTimer)}render(){if(!this.open)return l;let e=this.entities;return a`
      <div class="backdrop" @click=${this._close}></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Kibble settings" @keydown=${this._onKeydown}>
        <header>
          <h2>Settings</h2>
          <button type="button" class="icon-button" @click=${this._close} aria-label="Close">${x("close")}</button>
        </header>
        <div class="body">
          ${e.feedButtonHopper1||e.feedButtonHopper2?this._renderHopperSection():l}
          ${e.feedAmount?this._renderMoreAmountSection():l}
          ${this._renderToggles()}
          ${e.volume?this._renderVolume():l}
          ${e.cloudSwitch?this._renderCloud():l}
          ${e.wifiNetwork?this._renderWifi():l}
          ${e.dishBefore||e.dishAfter?this._renderDishPhotos():l}
          ${e.speaker?this._renderSpeaker():l}
          <button type="button" class="device-link" @click=${this._openDevicePage}>
            Open device page ${x("openInNew")}
          </button>
        </div>
      </div>
    `}_renderMoreAmountSection(){let e=me(this.hass,this.entities.feedAmount);return e?a`
      <section>
        <h3>Feed amount</h3>
        ${this._renderStepper(this.entities.feedAmount,e)}
      </section>
    `:l}_renderHopperSection(){let{feedAmountHopper1:e,feedAmountHopper2:i,feedButtonHopper1:s,feedButtonHopper2:n}=this.entities;return a`
      <section>
        <h3>Per-hopper feed</h3>
        <p class="hint">
          Targets one auger's amount byte. This feeder's firmware spins both augers anyway, so
          expect roughly double into the bowl until a hopper divider is fitted.
        </p>
        <div class="hoppers">
          ${e?a`
                <div class="hopper">
                  <span class="hopper-label">Hopper 1</span>
                  ${this._renderStepper(e,me(this.hass,e))}
                  ${s?a`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(s)}></kibble-hold-button>`:l}
                </div>
              `:l}
          ${i?a`
                <div class="hopper">
                  <span class="hopper-label">Hopper 2</span>
                  ${this._renderStepper(i,me(this.hass,i))}
                  ${n?a`<kibble-hold-button label="Hold to feed" @activate=${()=>this._pressButton(n)}></kibble-hold-button>`:l}
                </div>
              `:l}
        </div>
      </section>
    `}_renderStepper(e,i){return i?a`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${i.value<=i.min} @click=${()=>this._setNumber(e,Math.max(i.min,i.value-i.step))}>
          &minus;
        </button>
        <span class="step-value">${i.value}</span>
        <button type="button" class="step-btn" ?disabled=${i.value>=i.max} @click=${()=>this._setNumber(e,Math.min(i.max,i.value+i.step))}>
          &plus;
        </button>
      </div>
    `:l}_renderToggles(){let i=[{id:this.entities.nightVisionSwitch,icon:"weatherNight",label:"Night vision"},{id:this.entities.statusLedSwitch,icon:"ledOn",label:"Status LED"},{id:this.entities.microphoneSwitch,icon:"microphone",label:"Microphone"}].filter(s=>s.id!==void 0);return i.length===0?l:a`
      <section>
        <h3>Device</h3>
        ${i.map(s=>this._renderToggleRow(s.id,s.icon,s.label))}
      </section>
    `}_renderToggleRow(e,i,s){let n=this.hass.states[e],o=n?.state==="on",d=!n||n.state==="unavailable";return a`
      <button type="button" class="toggle-row" ?disabled=${d} @click=${()=>this._toggleSwitch(e)}>
        <span class="toggle-icon">${x(i)}</span>
        <span class="toggle-label">${s}</span>
        <span class="toggle-pill ${o?"on":""}"><span class="toggle-knob"></span></span>
      </button>
    `}_renderVolume(){let e=me(this.hass,this.entities.volume);return e?a`
      <section>
        <h3>Volume</h3>
        <input
          type="range"
          min=${e.min}
          max=${e.max}
          step=${e.step}
          .value=${String(e.value)}
          @change=${i=>this._setNumber(this.entities.volume,Number(i.target.value))}
        />
      </section>
    `:l}_renderCloud(){let i=this.hass.states[this.entities.cloudSwitch]?.state==="on",s=this.entities.cloudConnection?this.hass.states[this.entities.cloudConnection]?.state:void 0;return a`
      <section>
        <h3>Petkit cloud</h3>
        <p class="hint">${s?`Connection: ${s}`:"Turns the feeder's cloud link on or off."}</p>
        <button type="button" class="cloud-toggle ${this._cloudConfirmArmed?"confirming":""}" @click=${this._onCloudToggleClick}>
          ${this._cloudConfirmArmed?`Tap again to turn ${i?"off":"on"}`:i?"On \u2014 tap to turn off":"Off \u2014 tap to turn on"}
        </button>
      </section>
    `}_renderWifi(){let e=this.hass.states[this.entities.wifiNetwork];return a`
      <section>
        <h3>Wi-Fi</h3>
        <p class="hint">${e?e.state:"Unavailable"}</p>
      </section>
    `}_renderDishPhotos(){let e=this.entities.dishBefore?this.hass.states[this.entities.dishBefore]:void 0,i=this.entities.dishAfter?this.hass.states[this.entities.dishAfter]:void 0;return(!e||e.state==="unavailable")&&(!i||i.state==="unavailable")?l:a`
      <section>
        <h3>Last feed</h3>
        <div class="dish-photos">
          ${e&&e.state!=="unavailable"?a`<img src=${String(e.attributes.entity_picture??"")} alt="Before" />`:l}
          ${i&&i.state!=="unavailable"?a`<img src=${String(i.attributes.entity_picture??"")} alt="After" />`:l}
        </div>
      </section>
    `}_renderSpeaker(){let e=this.hass.states[this.entities.speaker];if(!e)return l;let i=typeof e.attributes.volume_level=="number"?e.attributes.volume_level:.5;return a`
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
    `}_pressButton(e){this.hass.callService("button","press",{},{entity_id:e})}_toggleSwitch(e){this.hass.callService("switch","toggle",{},{entity_id:e})}_setNumber(e,i){this.hass.callService("number","set_value",{value:i},{entity_id:e})}_onCloudToggleClick(){if(this._cloudConfirmArmed){clearTimeout(this._cloudConfirmTimer),this._cloudConfirmArmed=!1,this._toggleSwitch(this.entities.cloudSwitch),this.requestUpdate();return}this._cloudConfirmArmed=!0,this.requestUpdate(),this._cloudConfirmTimer=setTimeout(()=>{this._cloudConfirmArmed=!1,this.requestUpdate()},bi)}_openDevicePage(){let e=this.entities.deviceId;history.pushState(null,"",`/config/devices/device/${e}`),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0})),this._close()}_onKeydown(e){e.key==="Escape"&&this._close()}_close(){this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))}static{this.styles=h`
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
  `}};customElements.define("kibble-settings-dialog",Be);function k(r,t,e){let i=t.split("/").map(s=>encodeURIComponent(s)).join("/");return`/api/kibble/${encodeURIComponent(r)}/image/${i}/${encodeURIComponent(e)}`}var w=class{constructor(){this._urls=new Map;this._pending=new Map}get(t,e,i){let s=this._urls.get(e);if(s)return this._urls.delete(e),this._urls.set(e,s),s;let n=this._pending.get(e);if(n)return n.then(()=>i(this._urls.get(e)??null)),null;let o=this._fetch(t,e).then(d=>{this._pending.delete(e),d&&this._remember(e,d),i(d)});return this._pending.set(e,o),null}async _fetch(t,e){if(!t.fetchWithAuth)return null;try{let i=await t.fetchWithAuth(e);if(!i.ok)return null;let s=await i.blob();return URL.createObjectURL(s)}catch{return null}}_remember(t,e){for(this._urls.set(t,e);this._urls.size>200;){let i=this._urls.keys().next().value;if(i===void 0)break;let s=this._urls.get(i);this._urls.delete(i),s&&URL.revokeObjectURL(s)}}dispose(){for(let t of this._urls.values())URL.revokeObjectURL(t);this._urls.clear(),this._pending.clear()}};function Tt(){return _`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `}function Lt(r){let t=0;for(let e=0;e<r.length;e++)t=t*31+r.charCodeAt(e)|0;return ce(t)}var Ve=class extends p{constructor(){super();this._cache=new w;this._imageUrl=null;this._resolvedPath=null;this.name=null,this.colorIndex=null,this.sampleName=null}static{this.properties={hass:{attribute:!1},name:{type:String},colorIndex:{type:Number,attribute:"color-index"},entryId:{type:String,attribute:"entry-id"},sampleName:{type:String,attribute:"sample-name"}}}disconnectedCallback(){super.disconnectedCallback(),this._cache.dispose()}willUpdate(){let e=this.entryId&&this.name&&this.sampleName?k(this.entryId,`sample/${this.name}`,this.sampleName):null;e!==this._resolvedPath&&(this._resolvedPath=e,this._imageUrl=null,!(!e||!this.hass)&&(this._imageUrl=this._cache.get(this.hass,e,i=>{this._resolvedPath===e&&(this._imageUrl=i,this.requestUpdate())})))}render(){if(!this.name)return a`<div class="avatar neutral">${Tt()}</div>`;let e=this.colorIndex!=null?ce(this.colorIndex):Lt(this.name);return a`
      <div class="avatar" style="--kibble-avatar-color: ${e}">
        ${this._imageUrl?a`<img src=${this._imageUrl} alt="" />`:a`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `}static{this.styles=h`
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
  `}};customElements.define("kibble-avatar",Ve);var fi=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"settings_hash",selector:{text:{}}},{name:"schedule_hash",selector:{text:{}}}],gi={device_id:"Kibble device",name:"Name (optional)",settings_hash:"Settings pop-up hash (optional)",schedule_hash:"Schedule pop-up hash (optional)"},ze=class extends p{constructor(){super(...arguments);this._computeLabel=e=>gi[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?a`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${fi}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():l}_renderFallback(){let e=Object.values(this.hass?.entities??{}),i=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return a`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${i.map(s=>a`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateSettingsHash(e){this._config&&(this._config={...this._config,settings_hash:e||void 0},this._fireConfigChanged())}_updateScheduleHash(e){this._config&&(this._config={...this._config,schedule_hash:e||void 0},this._fireConfigChanged())}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=h`
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
  `}};customElements.define("kibble-card-editor",ze);function Mt(r){return r==="eat"?"ate":r==="visit"?"came by":r==="face"||r==="track"?"identified":"was seen"}function Ht(r){if(r.amount==null)return"Fed";let t=r.amount===1?"portion":"portions",e=r.hopper&&r.hopper!=="both"?` from hopper ${r.hopper}`:"";return`Fed ${r.amount} ${t}${e}`}function Y(r){return`${r.getFullYear()}-${r.getMonth()}-${r.getDate()}`}function vi(r,t){if(Y(r)===Y(t))return"Today";let e=new Date(t.getFullYear(),t.getMonth(),t.getDate()-1);return Y(r)===Y(e)?"Yesterday":r.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}function It(r,t){let e=[],i=null;for(let s of r){let n=new Date(s.ts*1e3),o=Y(n);o!==i&&(i=o,e.push({label:vi(n,t),items:[]})),e[e.length-1].items.push(s)}return e}var Oe=class extends p{constructor(){super();this._closeButtonRef=V();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&(e.preventDefault(),this._close())};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.imageUrl=null,this.alt=""}static{this.properties={open:{type:Boolean,reflect:!0},imageUrl:{type:String},alt:{type:String}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler)}updated(e){e.has("open")&&this.open&&this._closeButtonRef.value?.focus()}render(){return this.open?a`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.alt||"Photo"}>
        <div class="frame" @click=${e=>e.stopPropagation()}>
          ${this.imageUrl?a`<img src=${this.imageUrl} alt=${this.alt} />`:l}
          <button type="button" class="close" aria-label="Close" ${P(this._closeButtonRef)} @click=${this._close}>
            ${x("close")}
          </button>
        </div>
      </div>
    `:l}static{this.styles=h`
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
  `}};customElements.define("kibble-lightbox",Oe);var _i=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"limit",selector:{number:{min:1,mode:"box"}}}],yi={device_id:"Kibble device",name:"Name (optional)",limit:"Rows before \u201CShow more\u201D (optional, default 30)"},Fe=class extends p{constructor(){super(...arguments);this._computeLabel=e=>yi[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?a`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${_i}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():l}_renderFallback(){let e=Object.values(this.hass?.entities??{}),i=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return a`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${i.map(s=>a`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateLimit(e){if(!this._config)return;let i=Number(e);this._config={...this._config,limit:e&&Number.isFinite(i)?i:void 0},this._fireConfigChanged()}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=h`
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
  `}};customElements.define("kibble-timeline-card-editor",Fe);var xi={deviceId:"",catPresence:[]},je=30,qe=class extends p{constructor(){super();this._entities=xi;this._timelineQuery=new y(()=>this.requestUpdate());this._catsQuery=new y(()=>this.requestUpdate());this._imageCache=new w;this._lightboxTrigger=null;this._showMore=()=>{this._visibleCount+=this._config?.limit??je};this._retryTimeline=()=>{let e=this.hass?.callWS;if(!e||!this._entryId)return;let i=this._entryId;this._timelineQuery.refresh(()=>e({type:"kibble/timeline",entry_id:i}).then(s=>s))};this._closeLightbox=()=>{this._lightboxUrl=null,this._lightboxTrigger?.focus(),this._lightboxTrigger=null};this._visibleCount=je,this._lightboxUrl=null,this._lightboxAlt=""}static{this.properties={hass:{attribute:!1},_config:{state:!0},_visibleCount:{state:!0},_lightboxUrl:{state:!0},_lightboxAlt:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");this._config=e,this._visibleCount=e.limit??je}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-timeline-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-timeline-card-editor")}disconnectedCallback(){super.disconnectedCallback(),this._imageCache.dispose()}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._config?.device_id&&this.hass&&(this._entities=K(this.hass.entities??{},this._config.device_id),this._entryId=U(this.hass.devices??{},this._config.device_id));let i=this.hass?.callWS;if(this.hass&&this._entryId&&i){let s=this._entryId,n=D(this.hass,[this._entities.lastDetection,this._entities.feeding,this._entities.dishAfter]);this._timelineQuery.sync(n,()=>i({type:"kibble/timeline",entry_id:s}).then(o=>o)),this._catsQuery.sync(n,()=>i({type:"kibble/cats",entry_id:s}).then(o=>o))}}render(){if(!this._config||!this.hass)return l;let e=this._timelineQuery.state,i=new Map((this._catsQuery.state.data?.cats??[]).map(m=>[m.name,m])),s=e.data?.items??[],n=s.slice(0,this._visibleCount),o=It(n,new Date),d=s.length>n.length,c=!e.error&&!e.loading&&e.data!==null&&o.length===0;return a`
      <ha-card>
        <div class="container">
          ${this._config.name?a`<div class="label">${this._config.name}</div>`:l}
          <div class="rail">
            ${e.error?this._renderError(e.error):l}
            ${c?this._renderEmpty():l}
            ${o.map(m=>this._renderDay(m,i))}
            ${d?a`<button type="button" class="show-more" @click=${this._showMore}>Show more</button>`:l}
          </div>
        </div>
      </ha-card>
      <kibble-lightbox
        ?open=${this._lightboxUrl!==null}
        .imageUrl=${this._lightboxUrl}
        .alt=${this._lightboxAlt}
        @close-requested=${this._closeLightbox}
      ></kibble-lightbox>
    `}_renderEmpty(){return a`<p class="empty">Nothing to show yet. Feeds and visits appear here as they happen.</p>`}_renderError(e){return a`
      <div class="error">
        <span>Couldn't load the timeline. ${e}</span>
        <button type="button" @click=${this._retryTimeline}>Try again</button>
      </div>
    `}_renderDay(e,i){return a`
      <div class="day">
        <div class="day-label">${e.label}</div>
        <div class="day-items">
          ${e.items.map(s=>s.kind==="detection"?this._renderDetection(s,i):this._renderFeed(s))}
        </div>
      </div>
    `}_renderDetection(e,i){let s=e.cat?i.get(e.cat):void 0,n=this._timeLabel(e.ts),o=e.cat??"a cat";return a`
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
        <span class="row-text">${o} ${Mt(e.class)}</span>
        ${e.image&&this._entryId?this._renderThumb(k(this._entryId,"event",e.image),`${o}, ${n}`):l}
      </div>
    `}_renderFeed(e){let i=this._timeLabel(e.ts),s=this._entryId;return a`
      <div class="row row-feed">
        <span class="time">${i}</span>
        <span class="row-text feed-text">${Ht(e)}</span>
        <div class="feed-thumbs">
          ${e.before&&s?this._renderThumb(k(s,"feed",e.before),`Bowl before the ${i} feed`):l}
          ${e.after&&s?this._renderThumb(k(s,"feed",e.after),`Bowl after the ${i} feed`):l}
        </div>
      </div>
    `}_renderThumb(e,i){let s=this._imageCache.get(this.hass,e,()=>this.requestUpdate());return a`
      <button type="button" class="thumb" ?disabled=${!s} aria-label=${`View photo: ${i}`} @click=${n=>this._openLightbox(n,s,i)}>
        ${s?a`<img src=${s} alt="" loading="lazy" />`:l}
      </button>
    `}_timeLabel(e){return new Date(e*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}_openLightbox(e,i,s){i&&(this._lightboxTrigger=e.currentTarget,this._lightboxUrl=i,this._lightboxAlt=s)}static{this.styles=h`
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
  `}};customElements.define("kibble-timeline-card",qe);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-timeline-card",name:"Kibble Timeline",description:"Today's feeds and visits as one rail, newest first, with day separators and photos.",preview:!0});function Nt(r,t){return r.guess&&r.guess.score>=t?{cat:r.guess.cat,source:"classifier"}:r.vendor_cat?{cat:r.vendor_cat,source:"vendor"}:null}var We=class extends p{constructor(){super();this._firstButtonRef=V();this._keydownHandler=e=>{e.key==="Escape"&&this.open&&(e.preventDefault(),this._close())};this._close=()=>{this.dispatchEvent(new CustomEvent("close-requested",{bubbles:!0,composed:!0}))};this.open=!1,this.cats=[]}static{this.properties={open:{type:Boolean,reflect:!0},hass:{attribute:!1},cats:{attribute:!1},entryId:{type:String}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler)}updated(e){e.has("open")&&this.open&&this._firstButtonRef.value?.focus()}render(){return this.open?a`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Choose a cat">
        <div class="sheet" @click=${e=>e.stopPropagation()}>
          <div class="heading">Choose a cat</div>
          <div class="rows">
            ${this.cats.map((e,i)=>a`
                <button type="button" class="row" ${i===0?P(this._firstButtonRef):l} @click=${()=>this._choose(e.name)}>
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
            <button type="button" class="row" ${this.cats.length===0?P(this._firstButtonRef):l} @click=${()=>this._choose("not_a_cat")}>
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
    `:l}_choose(e){this.dispatchEvent(new CustomEvent("choice",{detail:{cat:e},bubbles:!0,composed:!0}))}static{this.styles=h`
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
  `}};customElements.define("kibble-face-picker",We);var $i=[{name:"device_id",required:!0,selector:{device:{filter:{integration:"kibble"}}}},{name:"name",selector:{text:{}}},{name:"confidence",selector:{number:{min:0,max:1,step:.05,mode:"box"}}}],Ci={device_id:"Kibble device",name:"Name (optional)",confidence:"Classifier confidence needed to suggest it (optional, default 0.7)"},Qe=class extends p{constructor(){super(...arguments);this._computeLabel=e=>Ci[e.name]??e.name}static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config=e}render(){return this._config?customElements.get("ha-form")?a`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${$i}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `:this._renderFallback():l}_renderFallback(){let e=Object.values(this.hass?.entities??{}),i=Object.values(this.hass?.devices??{}).filter(s=>e.some(n=>n.device_id===s.id&&n.platform==="kibble"));return a`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${s=>this._updateDeviceId(s.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${i.map(s=>a`<option value=${s.id} ?selected=${s.id===this._config?.device_id}>${s.name_by_user??s.name}</option>`)}
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
    `}_formValueChanged(e){this._config=e.detail.value,this._fireConfigChanged()}_updateDeviceId(e){this._config&&(this._config={...this._config,device_id:e},this._fireConfigChanged())}_updateName(e){this._config&&(this._config={...this._config,name:e||void 0},this._fireConfigChanged())}_updateConfidence(e){if(!this._config)return;let i=Number(e);this._config={...this._config,confidence:e&&Number.isFinite(i)?i:void 0},this._fireConfigChanged()}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static{this.styles=h`
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
  `}};customElements.define("kibble-cats-card-editor",Qe);var ki={deviceId:"",catPresence:[]},wi=.7,Ei=5e3,Ge=class extends p{constructor(){super();this._entities=ki;this._catsQuery=new y(()=>this.requestUpdate());this._pendingQuery=new y(()=>this.requestUpdate());this._sampleQueries=new Map;this._imageCache=new w;this._lastPendingData=null;this._pickerTrigger=null;this._closePicker=()=>{this._pickerCrop=null,this._pickerTrigger?.focus(),this._pickerTrigger=null};this._onPickerChoice=e=>{let i=this._pickerCrop;this._pickerCrop=null,i&&this._confirm(i,e.detail.cat)};this._hiddenCrops=new Set,this._pickerCrop=null,this._undo=null,this._addName="",this._addBusy=!1,this._addError=null,this._actionError=null}static{this.properties={hass:{attribute:!1},_config:{state:!0},_hiddenCrops:{state:!0},_pickerCrop:{state:!0},_undo:{state:!0},_addName:{state:!0},_addBusy:{state:!0},_addError:{state:!0},_actionError:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble Cats card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 8}static getStubConfig(e){return{type:"custom:kibble-cats-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-cats-card-editor")}disconnectedCallback(){super.disconnectedCallback(),this._imageCache.dispose(),clearTimeout(this._undoTimer)}_confidence(){return this._config?.confidence??wi}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._config?.device_id&&this.hass&&(this._entities=K(this.hass.entities??{},this._config.device_id),this._entryId=U(this.hass.devices??{},this._config.device_id));let i=this.hass?.callWS;if(this.hass&&this._entryId&&i){let s=this._entryId,n=D(this.hass,[this._entities.pendingFace,this._entities.lastSeenPet]);this._catsQuery.sync(n,()=>i({type:"kibble/cats",entry_id:s}).then(o=>o)),this._pendingQuery.sync(n,()=>i({type:"kibble/faces/pending",entry_id:s}).then(o=>o));for(let o of this._catsQuery.state.data?.cats??[]){if(this._sampleQueries.has(o.name))continue;let d=new y(()=>this.requestUpdate());this._sampleQueries.set(o.name,d)}for(let[o,d]of this._sampleQueries)d.sync(n,()=>i({type:"kibble/faces/samples",entry_id:s,cat:o}).then(c=>c))}this._pendingQuery.state.data!==this._lastPendingData&&(this._lastPendingData=this._pendingQuery.state.data,this._hiddenCrops=new Set)}render(){if(!this._config||!this.hass)return l;let e=this._catsQuery.state.data?.cats??[],s=(this._pendingQuery.state.data?.crops??[]).filter(o=>!this._hiddenCrops.has(o.name)),n=new Set(this._entities.catPresence.filter(o=>this.hass.states[o.entityId]?.state==="on").map(o=>o.name));return a`
      <ha-card>
        <div class="container">
          ${this._config.name?a`<div class="label">${this._config.name}</div>`:l}
          ${this._actionError?this._renderActionError():l}
          <section class="header">
            ${e.length===0?a`<p class="empty">No cats yet. Add one to start training.</p>`:a`<div class="cat-list">${e.map(o=>this._renderCatHeader(o,n.has(o.name)))}</div>`}
            ${this._renderAddCat()}
          </section>
          <section class="inbox">
            <div class="inbox-heading">
              <span>${s.length===1?"1 to review":`${s.length} to review`}</span>
            </div>
            ${this._pendingQuery.state.error?this._renderPendingError():l}
            ${s.length===0&&!this._pendingQuery.state.error?a`<p class="empty">Nothing to review. New crops arrive when a cat is identified at the bowl.</p>`:a`<div class="crop-grid" @keydown=${this._onGridKeydown}>${s.map(o=>this._renderCrop(o))}</div>`}
          </section>
          ${e.map(o=>this._renderGallery(o))}
        </div>
      </ha-card>
      ${this._undo?this._renderUndo(this._undo):l}
      <kibble-face-picker
        ?open=${this._pickerCrop!==null}
        .hass=${this.hass}
        .cats=${e}
        .entryId=${this._entryId}
        @choice=${this._onPickerChoice}
        @close-requested=${this._closePicker}
      ></kibble-face-picker>
    `}_renderCatHeader(e,i){let s=e.last_seen!=null?`seen ${de(new Date(e.last_seen*1e3),new Date)}`:"not seen yet";return a`
      <div class="cat">
        <kibble-avatar
          class=${i?"present":""}
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
    `}_renderAddCat(){return a`
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
        ${this._addError?a`<span class="inline-error">${this._addError}</span>`:l}
      </form>
    `}async _onAddCatSubmit(e){e.preventDefault();let i=this._addName.trim();if(!(!i||!this._entities.deviceId)){this._addBusy=!0,this._addError=null;try{await this.hass.callService("kibble","add_cat",{device_id:this._entities.deviceId,name:i}),this._addName="",this._refreshCats()}catch(s){this._addError=Q(s)}finally{this._addBusy=!1}}}_renderCrop(e){let i=Nt(e,this._confidence()),s=this._entryId?k(this._entryId,"pending",e.name):null,n=s?this._imageCache.get(this.hass,s,()=>this.requestUpdate()):null;return a`
      <div class="crop">
        <button
          type="button"
          class="crop-thumb"
          ?disabled=${!n}
          aria-label=${i?`Confirm ${i.cat}`:"Choose a cat for this crop"}
          @click=${()=>this._onCropTap(e,i)}
        >
          ${n?a`<img src=${n} alt="" loading="lazy" />`:l}
        </button>
        <button type="button" class="chooser" aria-label="Choose a cat for this crop" @click=${o=>this._openPicker(e,o)}>&#8942;</button>
        <div class="chip ${i?`chip-${i.source}`:"chip-empty"}">
          ${i?a`${i.cat}<span class="mark">${i.source==="classifier"?"AI":"ID"}</span>`:"Tap to choose"}
        </div>
      </div>
    `}_onGridKeydown(e){if(!["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(e.key))return;let s=[...e.currentTarget.querySelectorAll(".crop-thumb")],n=s.indexOf(document.activeElement);if(n===-1)return;e.preventDefault();let o=e.key==="ArrowRight"||e.key==="ArrowDown"?1:-1;s[(n+o+s.length)%s.length]?.focus()}_onCropTap(e,i){if(!i){this._pickerCrop=e;return}this._confirm(e,i.cat)}_openPicker(e,i){this._pickerTrigger=i.currentTarget,this._pickerCrop=e}_confirm(e,i){if(!this._entities.deviceId)return;let s=this._entities.deviceId;this._hiddenCrops=new Set(this._hiddenCrops).add(e.name);let n=i==="not_a_cat"?"Not a cat":i==="other"?"Skip":i;this.hass.callService("kibble","label_face",{device_id:s,crop_id:e.name,cat:i}).then(()=>{this._refreshAll(),this._setUndo({message:`Labelled as ${n}. `,run:()=>{this.hass.callService("kibble","unlabel_face",{device_id:s,cat:i,name:e.name}).then(()=>this._refreshAll())}})}).catch(o=>{let d=new Set(this._hiddenCrops);d.delete(e.name),this._hiddenCrops=d,this._actionError={message:`Couldn't label this crop. ${Q(o)}`,retry:()=>this._confirm(e,i)}})}_setUndo(e){clearTimeout(this._undoTimer),this._undo=e,this._undoTimer=setTimeout(()=>{this._undo=null},Ei)}_renderUndo(e){return a`
      <div class="undo-bar" role="status">
        <span>${e.message}</span>
        <button
          type="button"
          @click=${()=>{clearTimeout(this._undoTimer),this._undo=null,e.run()}}
        >
          Undo
        </button>
      </div>
    `}_renderActionError(){let e=this._actionError;return e?a`
      <div class="error">
        <span>${e.message}</span>
        <button
          type="button"
          @click=${()=>{this._actionError=null,e.retry()}}
        >
          Try again
        </button>
      </div>
    `:l}_renderPendingError(){let e=this._pendingQuery.state.error;return e?a`
      <div class="error">
        <span>Couldn't load the review queue. ${e}</span>
        <button type="button" @click=${()=>this._refreshPending()}>Try again</button>
      </div>
    `:l}_renderGallery(e){let s=this._sampleQueries.get(e.name)?.state.data?.samples??[];return s.length===0&&e.samples===0?l:a`
      <section class="gallery">
        <div class="gallery-heading">${e.name}, ${e.samples===1?"1 sample":`${e.samples} samples`}</div>
        <div class="gallery-grid">
          ${s.map(n=>this._renderSample(e.name,n))}
        </div>
      </section>
    `}_renderSample(e,i){let s=this._entryId?k(this._entryId,`sample/${e}`,i.name):null,n=s?this._imageCache.get(this.hass,s,()=>this.requestUpdate()):null;return a`
      <div class="sample">
        ${n?a`<img src=${n} alt="" loading="lazy" />`:l}
        <button type="button" class="remove" aria-label=${`Remove this sample of ${e}`} @click=${()=>this._removeSample(e,i)}>
          ${"\xD7"}
        </button>
      </div>
    `}_removeSample(e,i){if(!this._entities.deviceId)return;let s=this._entities.deviceId;this.hass.callService("kibble","unlabel_face",{device_id:s,cat:e,name:i.name}).then(()=>this._refreshAll()).catch(n=>{this._actionError={message:`Couldn't remove this sample. ${Q(n)}`,retry:()=>this._removeSample(e,i)}})}_refreshCats(){let e=this.hass?.callWS;if(!e||!this._entryId)return;let i=this._entryId;this._catsQuery.refresh(()=>e({type:"kibble/cats",entry_id:i}).then(s=>s))}_refreshPending(){let e=this.hass?.callWS;if(!e||!this._entryId)return;let i=this._entryId;this._pendingQuery.refresh(()=>e({type:"kibble/faces/pending",entry_id:i}).then(s=>s))}_refreshAll(){this._refreshCats(),this._refreshPending();let e=this.hass?.callWS;if(!e||!this._entryId)return;let i=this._entryId;for(let[s,n]of this._sampleQueries)n.refresh(()=>e({type:"kibble/faces/samples",entry_id:i,cat:s}).then(o=>o))}static{this.styles=h`
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
  `}};customElements.define("kibble-cats-card",Ge);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-cats-card",name:"Kibble Cats",description:"Enrolled cats plus a one-tap training inbox for the feeder's own face crops.",preview:!0});var Ai={deviceId:"",catPresence:[]},Ze=class extends p{constructor(){super();this._entities=Ai;this._catsQuery=new y(()=>this.requestUpdate());this._onFeedActivate=()=>{if(!this._entities.deviceId)return;let e=this._numberState(this._entities.feedAmount)??1;this.hass.callService("kibble","feed",{device_id:this._entities.deviceId,hopper:"both",amount:e})};this._onCancelActivate=()=>{this._entities.deviceId&&this.hass.callService("kibble","cancel_feed",{device_id:this._entities.deviceId})};this._openSettings=()=>{let e=this._config?.settings_hash;if(e){window.location.hash=e;return}this._settingsOpen=!0};this._closeSettings=()=>{this._settingsOpen=!1};this._settingsOpen=!1}static{this.properties={hass:{attribute:!1},_config:{state:!0},_settingsOpen:{state:!0}}}setConfig(e){if(!e.device_id)throw new Error("Kibble card: a device is required. Choose it in the card editor.");this._config=e}getCardSize(){return 6}static getStubConfig(e){return{type:"custom:kibble-card",device_id:Object.values(e.entities??{}).find(s=>s.platform==="kibble")?.device_id??""}}static getConfigElement(){return document.createElement("kibble-card-editor")}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(e=>{let i=e[0]?.contentRect,s=i?.height??this.getBoundingClientRect().height,n=i?.width??this.getBoundingClientRect().width;this.classList.toggle("kiosk",s>=440),this.classList.toggle("compact",n<640&&s>0&&s<=520)}),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._config?.device_id&&this.hass&&(this._entities=K(this.hass.entities??{},this._config.device_id),this._entryId=U(this.hass.devices??{},this._config.device_id));let i=this.hass?.callWS;if(this.hass&&this._entryId&&i&&this._entities.lastSeenPet){let s=this._entryId;this._catsQuery.sync(D(this.hass,[this._entities.lastSeenPet]),()=>i({type:"kibble/cats",entry_id:s}).then(n=>n))}}render(){if(!this._config||!this.hass)return l;let e=this._entities,i=e.feeding?this.hass.states[e.feeding]?.state:void 0,n=[e.feeding,e.bowlFill1,e.bowlFill2,e.schedule].filter(v=>!!v).map(v=>this.hass.states[v]?.state),o=bt(n,i),d=i==="on",c=this._numberState(e.bowlFill1),m=this._numberState(e.bowlFill2),f=this._scheduleEntries(),u=this._numberState(e.feedAmount)??1,g=this._heroOverlay(o);return a`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">${this._renderCamera(e.camera)}</div>
              <div class="hero-status">
                <span class="live-dot" ?hidden=${!g.live}></span>
                ${g.catName?a`<kibble-avatar
                      .hass=${this.hass}
                      .name=${g.catName}
                      .colorIndex=${g.colorIndex}
                      .entryId=${this._entryId}
                      .sampleName=${g.avatarSample}
                    ></kibble-avatar>`:l}
                <span class="hero-status-text" data-tone=${g.tone}>${g.text}</span>
              </div>
              <button class="gear-button" aria-label="Settings" @click=${this._openSettings}>${x("cog")}</button>
              ${this._config.name?a`<div class="name-chip">${this._config.name}</div>`:l}
            </div>
            <kibble-bowl class="bowl-block" .hopper1=${c} .hopper2=${m} .feeding=${d}></kibble-bowl>
            <div class="feed-controls">
              <kibble-segmented-picker
                class="picker-full"
                .value=${u}
                ?disabled=${o==="unreachable"||d}
                @portion-selected=${this._onPortionSelected}
              ></kibble-segmented-picker>
              <kibble-stepper
                class="picker-compact"
                .value=${u}
                ?disabled=${o==="unreachable"||d}
                @value-selected=${this._onPortionSelected}
              ></kibble-stepper>
              <kibble-hold-button
                .label=${d?"Cancel":"Hold to feed"}
                .variant=${d?"cancel":"feed"}
                ?disabled=${o==="unreachable"}
                @activate=${d?this._onCancelActivate:this._onFeedActivate}
              ></kibble-hold-button>
            </div>
            <kibble-schedule-summary
              class="schedule-row"
              .hass=${this.hass}
              .entries=${f}
              .scheduleCardStateEntity=${e.scheduleCardState}
              .scheduleHash=${this._config.schedule_hash}
            ></kibble-schedule-summary>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog .hass=${this.hass} .entities=${e} ?open=${this._settingsOpen} @close-requested=${this._closeSettings}></kibble-settings-dialog>
    `}_renderCamera(e){if(!e)return a`<div class="hero-placeholder">No camera on this device</div>`;if(customElements.get("hui-image"))return a`<hui-image .hass=${this.hass} .cameraImage=${e} cameraView="live"></hui-image>`;let i=this.hass.states[e],s=i?.attributes.entity_picture;return!i||i.state==="unavailable"||!s?a`<div class="hero-placeholder">Camera unavailable</div>`:a`<img src=${s} alt="Live view of the feeder" />`}_numberState(e){if(!e)return null;let i=Number(this.hass.states[e]?.state);return Number.isFinite(i)?i:null}_heroOverlay(e){let i=this._entities.camera,s=i?this.hass.states[i]:void 0,n=s!==void 0&&s.state!=="unavailable";if(e==="unreachable")return{text:Ee(e,null),tone:"error",live:n,catName:null,colorIndex:null,avatarSample:null};if(e==="dispensing")return{text:Ee(e,null),tone:"amber",live:n,catName:null,colorIndex:null,avatarSample:null};let o=this._catSeen();if(!o)return{text:"Ready to feed",tone:"normal",live:n,catName:null,colorIndex:null,avatarSample:null};let d=this._catsQuery.state.data?.cats.find(c=>c.name===o.name)??null;return{text:`${o.name} seen ${o.relative}`,tone:"normal",live:n,catName:o.name,colorIndex:d?.color_index??null,avatarSample:d?.avatar??null}}_catSeen(){let e=this._entities.lastSeenPet,i=e?this.hass.states[e]:void 0;return!i||i.state==="unavailable"||i.state.toLowerCase()==="unknown"?null:{name:i.state,relative:de(new Date(i.last_changed),new Date)}}_scheduleEntries(){let e=this._entities.schedule;if(!e)return[];let s=this.hass.states[e]?.attributes?.entries;return Array.isArray(s)?s:[]}_onPortionSelected(e){this._entities.feedAmount&&this.hass.callService("number","set_value",{value:e.detail.value},{entity_id:this._entities.feedAmount})}static{this.styles=h`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${E(gt)};
      --kibble-amber-dark: ${E(vt)};
      --kibble-ink-on-amber: ${E(_t)};
      --kibble-live: ${E(yt)};
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
  `}};customElements.define("kibble-card",Ze);window.customCards=window.customCards||[];window.customCards.push({type:"kibble-card",name:"Kibble",description:"The full daily control surface for a Kibble Petkit feeder: live camera, who's been by, feed, and schedule.",preview:!0});export{Ze as KibbleCard};
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
