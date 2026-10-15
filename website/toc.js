(function(){
  var m=document.querySelector('main.article');
  if(!m) return;
  var hs=[].slice.call(m.querySelectorAll('h2')).filter(function(h){
    return h.textContent.trim().length>0 && !h.closest('.article-newsletter, aside, footer');
  });
  if(hs.length<5) return;
  var used={};
  function slug(t){return t.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)||'section';}
  hs.forEach(function(h){
    if(!h.id){
      var s=slug(h.textContent),n=s,i=2;
      while(document.getElementById(n)||used[n]){n=s+'-'+i++;}
      h.id=n;
    }
    used[h.id]=1;
  });
  var nav=document.createElement('nav');
  nav.className='toc';
  nav.setAttribute('aria-label','On this page');
  var d=document.createElement('details');
  if(window.matchMedia&&window.matchMedia('(min-width:700px)').matches) d.open=true;
  var sm=document.createElement('summary');
  sm.textContent='On this page';
  d.appendChild(sm);
  var ol=document.createElement('ol');
  hs.forEach(function(h){
    var li=document.createElement('li'),a=document.createElement('a');
    a.href='#'+h.id;
    a.textContent=h.textContent.trim().replace(/^\d+\.\s*/,'');
    li.appendChild(a);ol.appendChild(li);
  });
  d.appendChild(ol);nav.appendChild(d);
  hs[0].parentNode.insertBefore(nav,hs[0]);
})();
