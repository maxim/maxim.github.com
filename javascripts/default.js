// emile.js (c) 2009 Thomas Fuchs
// Licensed under the terms of the MIT license.
(function(k,b){var o=document.createElement("div"),l=("backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex").split(" "),m=typeof o.style.opacity=="string",f=typeof o.style.filter=="string",n=document.defaultView,a=n&&typeof n.getComputedStyle!=="undefined",h=/alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,c=function(){},i=function(){return"1"};if(m){c=function(q,r){q.style.opacity=r};i=function(q){return q.opacity}}else{if(f){c=function(q,r){var s=q.style;if(q.currentStyle&&!q.currentStyle.hasLayout){s.zoom=1}if(h.test(s.filter)){r=r>=0.9999?"":("alpha(opacity="+(r*100)+")");s.filter=s.filter.replace(h,r)}else{s.filter+=" alpha(opacity="+(r*100)+")"}};i=function(r){var q=r.filter.match(h);return(q?(q[1]/100):1)+""}}}function j(q,r,s){return(q+(r-q)*s).toFixed(3)}function p(r,q,s){return r.substr(q,s||1)}function e(s,x,z){var u=2,t,y,w,A=[],q=[];while(t=3,y=arguments[u-1],u--){if(p(y,0)=="r"){y=y.match(/\d+/g);while(t--){A.push(~~y[t])}}else{if(y.length==4){y="#"+p(y,1)+p(y,1)+p(y,2)+p(y,2)+p(y,3)+p(y,3)}while(t--){A.push(parseInt(p(y,1+t*2,2),16))}}}while(t--){w=~~(A[t+3]+(A[t]-A[t+3])*z);q.push(w<0?0:w>255?255:w)}return"rgb("+q.join(",")+")"}function d(t){var s=parseFloat(t),r=t.replace(/^[\-\d\.]+/,"");return isNaN(s)?{v:r,f:e,u:""}:{v:s,f:j,u:r}}function g(t){var s,u={},r=l.length,q;o.innerHTML='<div style="'+t+'"></div>';s=o.childNodes[0].style;while(r--){if(q=s[l[r]]){u[l[r]]=d(q)}}return u}b[k]=function(w,t,q){w=typeof w=="string"?document.getElementById(w):w;q=q||{};var z=g(t),y=a?n.getComputedStyle(w,null):w.currentStyle,s,A={},u=+new Date,r=q.duration||200,C=u+r,v,B=q.easing||function(D){return(-Math.cos(D*Math.PI)/2)+0.5},x;for(s in z){A[s]=d(s==="opacity"?i(y):y[s])}v=setInterval(function(){var D=+new Date,E=D>C?1:(D-u)/r;for(s in z){x=z[s].f(A[s].v,z[s].v,B(E))+z[s].u;if(s==="opacity"){c(w,x)}else{w.style[s]=x}}if(D>C){clearInterval(v);q.after&&q.after()}},10)}})("emile",this);

/* ga */
var _gaq = [['_setAccount', 'UA-2029229-5'], ['_trackPageview']];
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function(){
  function byId(id) {
    return (typeof id === 'string' ? document.getElementById(id) : id);
  }
  function removeEl(el) {
    el.parentNode.removeChild(el);
  }
  function setElStyles(el, styles) {
    for (var name in styles) {
      el.style[name] = styles[name];
    }
  }
  var getComputedStyle = function(el) { return el.style; }, 
      view = document.defaultView;
  if (view && view.getComputedStyle) {
    getComputedStyle = function(el){ return view.getComputedStyle(el, ''); };
  }
  else if (document.documentElement.currentStyle) {
    getComputedStyle = function(el){ return el.currentStyle; };
  }
  function getOffset(el, direction) {
    var offsetProp = 'offset' + (direction.charAt(0).toUpperCase() + direction.slice(1)),
        offsetValue = el[offsetProp],
        cs;
    while ((el = el.offsetParent) && (cs = getComputedStyle(el))) {
      offsetValue += el[offsetProp];
    }
    return offsetValue;
  }
  
  var summaryEls = [ ];
  function absolutizeSummaryEls() {
    var emEls = document.getElementsByTagName('em');
    for (var i = 0, len = emEls.length; i < len; i++) {
      var left = getOffset(emEls[i], 'left'),
          top = getOffset(emEls[i], 'top'),
          clone = emEls[i].cloneNode(true);
      setElStyles(clone, {
        position: 'absolute',
        left: left + 'px',
        top: top + 'px'
      });
      document.body.appendChild(clone);
      summaryEls.push(clone);
    }
    var titleEl = byId('title');
    var titleClone = titleEl.cloneNode(true);
    setElStyles(titleClone, {
      position: 'absolute',
      left: getOffset(titleEl, 'left') + 'px',
      top: getOffset(titleEl, 'top') + 'px',
      width: titleEl.offsetWidth + 'px',
      margin: 0
    });
    titleClone.id = 'title-clone';
    document.body.appendChild(titleClone);
  }
  
  function centerElementAt(element, top) {
    element.style.left = '50%';
    element.style.marginLeft = -(element.offsetWidth / 2) + 'px';
    emile(element, 'top:' + top + 'px', { duration: 500 });
  }
  
  function showSummaryEls() {
    var top = 130, animationInterval = 100;
    emile('content', 'opacity:0', {
      duration: 500,
      after: function(){
        setTimeout(function() {
          if (summaryEls.length) {
            top += 30;
            centerElementAt(summaryEls.shift(), top);
            setTimeout(arguments.callee, animationInterval);
          }
          else {
            summarizeBtn.disabled = false;
          }
        }, animationInterval);
      }
    });
  }
  
  function removeSummaryEls() {
    var ems = [ ];
    for (var i = 0, els = document.body.childNodes, len = els.length; i < len; i++) {
      if (els[i].tagName === 'EM') {
        ems.push(els[i]);
      }
    }
    (function(){
      if (ems.length) {
        var el = ems.shift();
        emile(el, 'left:-500px', { 
          after: (function(el){
            return function() {
              removeEl(el);
            };
          })(el)
        });
        setTimeout(arguments.callee, 50);
      }
      else {
        summarizeBtn.disabled = false;
      }
    })();
  }
  
  var summarizeBtn = byId('summarize');
  var isSummarized = false;
  
  function hideSummary() {
    summarizeBtn.disabled = true;
    isSummarized = false;
    summarizeBtn.innerHTML = 'Summarize!';
    removeSummaryEls();
    removeEl(byId('title-clone'));
    setTimeout(function(){
      emile('content', 'opacity:1', { duration: 500 });
    }, 700);
  }
  
  function showSummary() {
    summarizeBtn.disabled = true;
    isSummarized = true;
    summarizeBtn.innerHTML = 'Show content';
    absolutizeSummaryEls();
    showSummaryEls();
  }
  
  summarizeBtn.style.display = '';
  summarizeBtn.onclick = function() {
    if (isSummarized) {
      hideSummary();
    }
    else {
      showSummary();
    }
  };
})();