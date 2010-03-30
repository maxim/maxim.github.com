/* http://github.com/madrobby/emile */
// emile.js (c) 2009 Thomas Fuchs
// Licensed under the terms of the MIT license.

(function(emile, container){
  var parseEl = document.createElement('div'),
    props = ('backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth '+
    'borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize '+
    'fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight '+
    'maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft '+
    'paddingRight paddingTop right textIndent top width wordSpacing zIndex').split(' '),
    supportsOpacity = typeof parseEl.style.opacity == 'string', 
    supportsFilters = typeof parseEl.style.filter == 'string',
    reOpacity = /alpha\(opacity=([^\)]+)\)/, 
    setOpacity = function(){ }, 
    getOpacityFromComputed = function(){ return 1; };
    
  if (supportsOpacity) {
    setOpacity = function(el, value){ el.style.opacity = value; };
    getOpacityFromComputed = function(computed) { return computed.opacity; };
  }
  else if (supportsFilters) {
    setOpacity = function(el, value){
      var es = el.style;
      if (reOpacity.test(es.filter)) {
        value = value >= 0.9999 ? '' : ('alpha(opacity=' + (value * 100) + ')');
        es.filter = es.filter.replace(reOpacity, value);
      }
      else {
        es.filter += ' alpha(opacity=' + (value * 100) + ')';
      }
    };
    getOpacityFromComputed = function(comp) {
      var m = comp.filter.match(reOpacity);
      return (m ? (m[1] / 100) : 1) + '';
    };
  }
    
  function interpolate(source,target,pos){ return (source+(target-source)*pos).toFixed(3); }
  function s(str, p, c){ return str.substr(p,c||1); }
  function color(source,target,pos){
    var i = 2, j, c, tmp, v = [], r = [];
    while(j=3,c=arguments[i-1],i--)
      if(s(c,0)=='r') { c = c.match(/\d+/g); while(j--) v.push(~~c[j]); } else {
        if(c.length==4) c='#'+s(c,1)+s(c,1)+s(c,2)+s(c,2)+s(c,3)+s(c,3);
        while(j--) v.push(parseInt(s(c,1+j*2,2), 16)); }
    while(j--) { tmp = ~~(v[j+3]+(v[j]-v[j+3])*pos); r.push(tmp<0?0:tmp>255?255:tmp); }
    return 'rgb('+r.join(',')+')';
  }
  
  function parse(prop){
    var p = parseFloat(prop), q = prop.replace(/^[\-\d\.]+/,'');
    return isNaN(p) ? { v: q, f: color, u: ''} : { v: p, f: interpolate, u: q };
  }
  
  function normalize(style){
    var css, rules = {}, i = props.length, v;
    parseEl.innerHTML = '<div style="'+style+'"></div>';
    css = parseEl.childNodes[0].style;
    while(i--) if(v = css[props[i]]) rules[props[i]] = parse(v);
    return rules;
  } 
  
  container[emile] = function(el, style, opts){
    el = typeof el == 'string' ? document.getElementById(el) : el;
    opts = opts || {};
    var target = normalize(style), comp = el.currentStyle ? el.currentStyle : getComputedStyle(el, null),
      prop, current = {}, start = +new Date, dur = opts.duration||200, finish = start+dur, interval,
      easing = opts.easing || function(pos){ return (-Math.cos(pos*Math.PI)/2) + 0.5; }, curValue;
    for(prop in target) current[prop] = parse(prop === 'opacity' ? getOpacityFromComputed(comp) : comp[prop]);
    interval = setInterval(function(){
      var time = +new Date, pos = time>finish ? 1 : (time-start)/dur;
      for(prop in target) {
        curValue = target[prop].f(current[prop].v,target[prop].v,easing(pos)) + target[prop].u;
        if (prop === 'opacity') setOpacity(el, curValue);
        else el.style[prop] = curValue;
      }
      if(time>finish) { clearInterval(interval); opts.after && opts.after(); }
    },10);
  }
})('emile', this);

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