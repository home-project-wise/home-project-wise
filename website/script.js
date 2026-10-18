document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));

// Awin Publisher MasterTag: loaded only after the visitor accepts it in the consent banner.
(function(){
  var KEY = 'hpw_awin_consent';
  function loadTag(){
    if (window.__awinPublisherMasterTagLoaded) return;
    window.__awinPublisherMasterTagLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://www.dwin2.com/pub.3113845.min.js';
    s.async = true;
    document.body.appendChild(s);
  }
  var saved = null;
  try { saved = window.localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'accepted') { loadTag(); return; }
  if (saved === 'declined') { return; }
  var bar = document.createElement('div');
  bar.className = 'consent-banner';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Cookie choice');
  bar.innerHTML = '<p>We use a tracking tag from our affiliate network, Awin, to credit purchases made through our links. It may set cookies. You can accept or decline; the site works the same either way. <a href="privacy.html">Privacy</a></p><div class="consent-actions"><button type="button" class="consent-accept">Accept</button><button type="button" class="consent-decline">Decline</button></div>';
  function choose(v){
    try { window.localStorage.setItem(KEY, v); } catch (e) {}
    if (bar.parentNode) bar.parentNode.removeChild(bar);
    if (v === 'accepted') loadTag();
  }
  bar.querySelector('.consent-accept').addEventListener('click', function(){ choose('accepted'); });
  bar.querySelector('.consent-decline').addEventListener('click', function(){ choose('declined'); });
  document.body.appendChild(bar);
})();
