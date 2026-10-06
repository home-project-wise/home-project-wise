document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));

// Awin Publisher MasterTag — loaded once site-wide for affiliate tracking.
(function(){
  if (window.__awinPublisherMasterTagLoaded) return;
  window.__awinPublisherMasterTagLoaded = true;
  var s = document.createElement('script');
  s.src = 'https://www.dwin2.com/pub.3113845.min.js';
  s.async = true;
  document.body.appendChild(s);
})();
