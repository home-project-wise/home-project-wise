/* HomeProjectWise smart header (design Stage 6, hardened in Stage 8). The header stays in place at the top of the page, hides while you read down, and returns as soon as you scroll up. It never hides while the menu is open or while a link inside it has focus. Without JavaScript the header simply stays sticky. Stage 8: the header height is measured with a ResizeObserver and cached, so no layout is read during load or on scroll (PageSpeed reported a forced reflow). */
(function(){
  if(window.__hpwHeader)return;window.__hpwHeader=1;
  try{
    var h=document.querySelector('body > header.nav');if(!h)return;
    var root=document.documentElement,hh=64,lastY=Math.max(0,window.pageYOffset||0),dir=0,acc=0,ticking=false;
    function setH(v){if(v>0&&v!==hh){hh=v;root.style.setProperty('--hdr-h',v+'px');}}
    function show(){h.classList.remove('nav-hidden');}
    function hide(){if(h.classList.contains('open')||h.contains(document.activeElement))return;h.classList.add('nav-hidden');}
    function onScroll(){
      ticking=false;
      var y=Math.max(0,window.pageYOffset||0),d=y-lastY;lastY=y;
      if(y<=hh){show();dir=0;acc=0;return;}
      if(!d)return;
      var nd=d>0?1:-1;if(nd!==dir){dir=nd;acc=0;}
      acc+=Math.abs(d);
      if(dir>0&&acc>=24)hide();else if(dir<0&&acc>=12)show();
    }
    if('ResizeObserver' in window){
      new ResizeObserver(function(es){var e=es[0],b=e.borderBoxSize&&(e.borderBoxSize[0]||e.borderBoxSize);setH(Math.round(b&&b.blockSize?b.blockSize:e.contentRect.height));}).observe(h);
    }else{
      window.addEventListener('load',function(){requestAnimationFrame(function(){setH(h.offsetHeight);});});
    }
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
    h.addEventListener('focusin',show);
  }catch(e){}
})();
