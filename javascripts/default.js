/* http://github.com/madrobby/emile */
(function(f,a){var h=document.createElement("div"),g=("backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex").split(" ");function e(j,k,l){return(j+(k-j)*l).toFixed(3)}function i(k,j,l){return k.substr(j,l||1)}function c(l,p,s){var n=2,m,q,o,t=[],k=[];while(m=3,q=arguments[n-1],n--){if(i(q,0)=="r"){q=q.match(/\d+/g);while(m--){t.push(~~q[m])}}else{if(q.length==4){q="#"+i(q,1)+i(q,1)+i(q,2)+i(q,2)+i(q,3)+i(q,3)}while(m--){t.push(parseInt(i(q,1+m*2,2),16))}}}while(m--){o=~~(t[m+3]+(t[m]-t[m+3])*s);k.push(o<0?0:o>255?255:o)}return"rgb("+k.join(",")+")"}function b(l){var k=parseFloat(l),j=l.replace(/^[\-\d\.]+/,"");return isNaN(k)?{v:j,f:c,u:""}:{v:k,f:e,u:j}}function d(m){var l,n={},k=g.length,j;h.innerHTML='<div style="'+m+'"></div>';l=h.childNodes[0].style;while(k--){if(j=l[g[k]]){n[g[k]]=b(j)}}return n}a[f]=function(p,m,j){p=typeof p=="string"?document.getElementById(p):p;j=j||{};var r=d(m),q=p.currentStyle?p.currentStyle:getComputedStyle(p,null),l,s={},n=+new Date,k=j.duration||200,u=n+k,o,t=j.easing||function(v){return(-Math.cos(v*Math.PI)/2)+0.5};for(l in r){s[l]=b(q[l])}o=setInterval(function(){var v=+new Date,w=v>u?1:(v-n)/k;for(l in r){p.style[l]=r[l].f(s[l].v,r[l].v,t(w))+r[l].u}if(v>u){clearInterval(o);j.after&&j.after()}},10)}})("emile",this);

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
  
  var summaryEls = [ ];
  function absolutizeSummaryEls() {
    var emEls = document.getElementsByTagName('em');
    for (var i = 0, len = emEls.length; i < len; i++) {
      var left = emEls[i].offsetLeft,
          top = emEls[i].offsetTop,
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
      left: titleEl.offsetLeft + 'px',
      top: titleEl.offsetTop + 'px',
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
    summarizeBtn.innerHTML = 'Summarize';
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