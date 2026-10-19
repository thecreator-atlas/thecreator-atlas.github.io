(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ root.classList.add('loaded'); }); });

  // ---------- time zones ----------
  var ZONES = [
    ['America/Los_Angeles','Los Angeles'],['America/Denver','Denver'],['America/Chicago','Chicago'],
    ['America/New_York','New York'],['America/Toronto','Toronto'],['America/Sao_Paulo','São Paulo'],
    ['Europe/London','London'],['Europe/Berlin','Berlin'],['Asia/Dubai','Dubai'],['Asia/Kolkata','India'],
    ['Asia/Singapore','Singapore'],['Asia/Manila','Manila'],['Asia/Tokyo','Tokyo'],['Australia/Sydney','Sydney'],
    ['Pacific/Auckland','Auckland']
  ];
  var detected = 'UTC';
  try { detected = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch(e) {}
  var sel = document.getElementById('tz');
  var known = ZONES.some(function(z){ return z[0] === detected; });
  if (!known) ZONES.unshift([detected, detected.replace(/_/g,' ').split('/').pop()]);
  ZONES.forEach(function(z){
    var o = document.createElement('option'); o.value = z[0];
    o.textContent = z[1] + (z[0] === detected ? ' (detected)' : '');
    sel.appendChild(o);
  });
  sel.value = detected;
  window.atlasZone = detected;

  function fmt(zone){
    try { return new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'numeric',minute:'2-digit'}).format(new Date()); }
    catch(e){ return '--:--'; }
  }
  function offsetMin(zone){
    try {
      var parts = new Intl.DateTimeFormat('en-US',{timeZone:zone,timeZoneName:'longOffset'}).formatToParts(new Date());
      var n = parts.filter(function(p){ return p.type === 'timeZoneName'; })[0].value; // GMT+08:00
      var m = n.match(/GMT([+-])(\d{2}):?(\d{2})?/); if (!m) return 0;
      return (m[1] === '-' ? -1 : 1) * (parseInt(m[2],10) * 60 + parseInt(m[3] || '0',10));
    } catch(e){ return 0; }
  }
  window.atlasOffset = offsetMin;
  function tick(){
    document.querySelectorAll('[data-clock]').forEach(function(el){ el.textContent = fmt(el.dataset.clock); });
    var z = sel.value, t = fmt(z);
    document.getElementById('your-time').textContent = t;
    document.getElementById('your-time-2').textContent = t;
    var diff = (offsetMin('Asia/Manila') - offsetMin(z)) / 60;
    var d = document.getElementById('tz-diff');
    if (diff === 0) d.textContent = ', the same time';
    else d.textContent = ', ' + Math.abs(diff) + (Math.abs(diff) === 1 ? ' hour' : ' hours') + (diff > 0 ? ' ahead of you' : ' behind you');
  }
  sel.addEventListener('change', function(){ window.atlasZone = sel.value; tick(); window.dispatchEvent(new CustomEvent('atlas:zone')); });
  tick(); setInterval(tick, 15000);

  // ---------- smooth scroll ----------
  var lenis = null;
  if (!reduce && window.Lenis && !window.matchMedia('(pointer: coarse)').matches) {
    lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true });
    (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var id = a.getAttribute('href'); if (id.length < 2) return;
        var t = document.querySelector(id); if (!t) return;
        e.preventDefault(); lenis.scrollTo(t, { offset: 0 }); history.replaceState(null, '', id);
      });
    });
  }

  // ---------- entrances: content stays visible until it plays ----------
  var rise = document.querySelectorAll('[data-rise]');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('play'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rise.forEach(function(e){ io.observe(e); });
  }

  // ---------- nav ink follows the ground under it ----------
  var nav = document.querySelector('.nav'), lights = [].slice.call(document.querySelectorAll('.light'));

  // ---------- scroll scenes ----------
  var carry = document.getElementById('carry');
  var states = [].slice.call(document.querySelectorAll('.inbox .st'));
  var work = document.getElementById('work');
  var projs = [].slice.call(work.querySelectorAll('.proj'));
  var wNow = document.getElementById('w-now');
  var track = document.getElementById('w-track');
  var desk = window.matchMedia('(min-width: 901px)');
  var STEP = 1.2; // viewports per project
  function sizeWork(){
    track.style.height = desk.matches ? ((projs.length - 1) * STEP * 100 + 100) + 'svh' : '';
  }
  var stage = work.querySelector('.stage');
  var seams = projs.map(function(el){ return el.querySelector('.seam'); });
  function placeSeams(){
    seams.forEach(function(s, i){ (desk.matches ? stage : projs[i]).appendChild(s); });
  }
  placeSeams();
  sizeWork(); desk.addEventListener('change', function(){ sizeWork(); placeSeams(); });

  function setStatus(i, s){
    var el = states[i]; if (!el || el.dataset.s === s) return;
    el.dataset.s = s; el.textContent = s === 'new' ? 'New' : s === 'replied' ? 'Replied' : 'Resolved';
  }
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  function frame(){
    var vh = innerHeight;
    var y = 36, onLight = lights.some(function(s){ var b = s.getBoundingClientRect(); return b.top <= y && b.bottom >= y; });
    nav.classList.toggle('on-light', onLight);
    // globe scene progress
    var r = carry.getBoundingClientRect();
    var p = desk.matches ? clamp(-r.top / (r.height - vh), 0, 1) : clamp((vh - r.top) / (r.height + vh) * 1.6 - .2, 0, 1);
    if (reduce) p = 1;
    window.atlasCarry = p;
    states.forEach(function(_, i){
      var a = 0.08 + i * 0.16;
      setStatus(i, p < a ? 'new' : p < a + 0.08 ? 'replied' : 'resolved');
    });
    // work scene
    if (desk.matches) {
      var wr = track.getBoundingClientRect();
      var scrolled = -wr.top / vh; // in viewports
      var cur = 0;
      projs.forEach(function(el, i){
        var d = i - scrolled / STEP;            // >0 still to come, 0 arrived, <0 passed
        var enter = i === 0 ? 0 : clamp(d / 0.6, 0, 1);              // 1 → just starting, 0 → settled
        var leave = i === projs.length - 1 ? 0 : clamp((-d - 0.4) / 0.6, 0, 1); // 0 until the next one tears in
        var l = el.querySelector('.pane.l'), rr = el.querySelector('.pane.r');
        var seam = seams[i], a = seam.querySelector('.half.a'), b = seam.querySelector('.half.b');
        if (reduce) {
          el.style.opacity = enter < .5 && leave < .5 ? 1 : 0; l.style.transform = rr.style.transform = '';
        } else {
          l.style.transform = 'translate3d(0,' + (enter * 100) + 'svh,0)';
          rr.style.transform = 'translate3d(0,' + (-enter * 100) + 'svh,0)';
          var t = (enter - leave) * 30;
          a.style.transform = 'translate3d(0,' + t + 'svh,0)';
          b.style.transform = 'translate3d(0,' + (-t) + 'svh,0)';
        }
        var op = clamp(1 - Math.max(enter, leave) / 0.12, 0, 1);
        seam.style.opacity = op;
        seam.style.visibility = op < .3 ? 'hidden' : 'visible';
        el.style.zIndex = i + 1;
        var on = enter < .5 && leave < .5;
        el.classList.toggle('on', on); seam.classList.toggle('on', on);
        if (on) cur = i;
        el.style.visibility = enter >= 1 || d < -1.6 ? 'hidden' : 'visible';
      });
      wNow.textContent = cur + 1;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ---------- case dialog ----------
  var dlg = document.getElementById('case');
  projs.forEach(function(el){
    var btn = seams[projs.indexOf(el)].querySelector('[data-open]');
    btn.addEventListener('click', function(){
      document.getElementById('case-h').textContent = seams[projs.indexOf(el)].querySelector('.half.a').textContent;
      document.getElementById('case-desc').innerHTML = el.dataset.desc;
      var body = document.getElementById('case-body'); body.innerHTML = '';
      el.querySelectorAll('.pane').forEach(function(p){
        var c = p.cloneNode(true); c.removeAttribute('style');
        c.querySelectorAll('[id]').forEach(function(n){ n.removeAttribute('id'); });
        body.appendChild(c);
      });
      wireTemplates(body);
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      if (lenis) lenis.stop();
    });
  });
  dlg.querySelector('[data-close]').addEventListener('click', function(){ dlg.close(); });
  dlg.addEventListener('close', function(){ if (lenis) lenis.start(); });
  dlg.addEventListener('click', function(e){ if (e.target === dlg) dlg.close(); });

  // ---------- reply templates ----------
  var sig = '<p><b>Atlas</b>, Customer Support</p>';
  var T = [
    { s:'Re: Where is my order?', b:'<p>Hi <span class="var">name</span>,</p><p>Thanks for reaching out, and sorry for the wait. Your order <span class="var">#number</span> shipped on <span class="var">date</span> with <span class="var">carrier</span>. You can track it here: <span class="var">link</span>.</p><p>It should arrive by <span class="var">date</span>. I\'ll check in with you on <span class="var">date</span> to make sure it got to you.</p><p>If you need anything else, just reply to this email.</p>' + sig },
    { s:'Re: Refund request', b:'<p>Hi <span class="var">name</span>,</p><p>Thanks for letting us know, and I\'m sorry the <span class="var">product</span> didn\'t work out. I\'ve approved your refund of <span class="var">amount</span> to your original payment method.</p><p>It usually shows up within <span class="var">number</span> business days, depending on your bank. I\'ll email you once it\'s processed.</p><p>If you have a minute, I\'d love to know what we could have done better.</p>' + sig },
    { s:'Checking in', b:'<p>Hi <span class="var">name</span>,</p><p>Just following up on your <span class="var">order or request</span> from <span class="var">date</span>. Did everything arrive and work the way you expected?</p><p>If anything still needs fixing, reply here and I\'ll take care of it.</p><p>Thanks again for choosing <span class="var">brand</span>.</p>' + sig }
  ];
  function wireTemplates(scope){
    var btns = scope.querySelectorAll('.ui-tpl button');
    var subj = scope.querySelector('[data-mail-subj]'), body = scope.querySelector('[data-mail-body]');
    if (!btns.length || !subj) return;
    btns.forEach(function(b){
      b.addEventListener('click', function(){
        var i = +b.dataset.t; subj.textContent = T[i].s; body.innerHTML = T[i].b;
        btns.forEach(function(x){ x.setAttribute('aria-pressed', x === b); });
      });
    });
  }
  wireTemplates(work);

  // ---------- services descriptions ----------
  var desc = document.getElementById('svc-desc');
  document.querySelectorAll('.services li[data-d]').forEach(function(li){
    function show(){
      var g = li.closest('.grp').querySelector('h3').textContent;
      desc.innerHTML = '<span></span>'; desc.firstChild.textContent = li.textContent;
      desc.appendChild(document.createTextNode(li.dataset.d));
    }
    li.addEventListener('mouseenter', show); li.addEventListener('focus', show);
  });

  // ---------- copy ----------
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click', function(){
      var el = document.getElementById(b.dataset.copy), t = el.textContent;
      var label = b.dataset.copy === 'v-email' ? 'Email address' : 'Phone number';
      function ok(){ b.textContent = 'Copied'; document.getElementById('copy-status').textContent = label + ' copied'; setTimeout(function(){ b.textContent = 'Copy'; }, 1800); }
      try { navigator.clipboard.writeText(t).then(ok, function(){}); } catch(e){}
    });
  });
})();
