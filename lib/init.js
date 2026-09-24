/* eslint-disable */
// @ts-nocheck
export function initSite() {
(function(){
  "use strict";
  /* dice pips */
  function pips(el,n){
    if(!el) return;
    var pos={1:[[50,50]],2:[[28,28],[72,72]],3:[[26,26],[50,50],[74,74]],
      4:[[28,28],[72,28],[28,72],[72,72]],5:[[26,26],[74,26],[50,50],[26,74],[74,74]],
      6:[[28,24],[28,50],[28,76],[72,24],[72,50],[72,76]]};
    pos[n].forEach(function(p){var i=document.createElement("i");i.style.left="calc("+p[0]+"% - 4.5px)";i.style.top="calc("+p[1]+"% - 4.5px)";el.appendChild(i);});
  }
  pips(document.getElementById("heroDie"),5);
  pips(document.getElementById("spinDie1"),3);
  pips(document.getElementById("spinDie2"),6);

  /* mobile side drawer */
  var burger=document.getElementById("burger"),menu=document.getElementById("menu"),
      drawer=document.getElementById("sideDrawer"),scrim=document.getElementById("scrim"),sdClose=document.getElementById("sdClose");
  function openNav(){document.body.classList.add("nav-open");}
  function closeNav(){document.body.classList.remove("nav-open");}
  burger.addEventListener("click",function(){document.body.classList.contains("nav-open")?closeNav():openNav();});
  scrim.addEventListener("click",closeNav);
  sdClose.addEventListener("click",closeNav);
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeNav();});
  drawer.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){
    closeNav();
    var href=a.getAttribute("href");
    drawer.querySelectorAll("a").forEach(function(x){x.classList.remove("on");});a.classList.add("on");
    menu.querySelectorAll("a").forEach(function(x){x.classList.toggle("on",x.getAttribute("href")===href);});
  });});

  /* FAQ */
  var FAQ=[
    {q:"01. How can I play these games (for beginners)?",a:"Just tap Play Now, create a free account, make a deposit and jump into any game in the lobby. Every game has a quick how-to, and our 24/7 support is one click away."},
    {q:"02. If I play games and lose by any chance, how will I pay?",a:"You only ever play with the credits you've deposited — there's never a hidden bill. Set deposit and loss limits any time to stay fully in control."},
    {q:"03. What are the benefits of playing here?",a:"Fast payouts, a 200% welcome bonus, daily free spins, weekend tournaments with real prize pools, and a five-tier VIP club with cashback and a personal host."},
    {q:"04. How fast are withdrawals?",a:"Most e-wallet and crypto withdrawals clear in under 15 minutes after approval. Cards and bank transfers take a little longer."},
    {q:"05. Which payment methods are supported?",a:"Visa, Mastercard, PayPal, Skrill, Neteller, Bitcoin, Ethereum and bank transfer — all with instant deposits and no fees."},
    {q:"06. How do you keep my account safe?",a:"We use bank-grade 256-bit SSL encryption, strict access controls and optional identity verification to protect your account and winnings."},
    {q:"07. Do you have a mobile version?",a:"Yes — Play2win is fully responsive and runs in any modern mobile browser, no download required."}
  ];
  function accHtml(list){return list.map(function(f){
    return '<div class="acc"><button type="button">'+f.q+'<span class="ai">&#9662;</span></button><div class="body"><p>'+f.a+'</p></div></div>';
  }).join("");}
  document.getElementById("faqList").innerHTML=accHtml(FAQ.slice(0,4));
  var faqsList=document.getElementById("faqsList"); if(faqsList) faqsList.innerHTML=accHtml(FAQ);
  document.addEventListener("click",function(e){
    var b=e.target.closest(".acc > button"); if(b) b.parentElement.classList.toggle("open");
  });

  /* ---- shared: flags, money, random win ---- */
  var C={
    India:["#ff9933","#ffffff","#138808"], USA:["#3c3b6e","#b22234"], Brazil:["#009c3b","#ffdf00"],
    Germany:["#111111","#dd0000","#ffce00"], Japan:["#ffffff","#bc002d"], Canada:["#d52b1e","#ffffff","#d52b1e"],
    UK:["#012169","#c8102e","#ffffff"], Spain:["#aa151b","#f1bf00","#aa151b"], Nigeria:["#008751","#ffffff","#008751"],
    Mexico:["#006847","#ffffff","#ce1126"], France:["#0055a4","#ffffff","#ef4135"], Italy:["#009246","#ffffff","#ce2b37"],
    Turkey:["#e30a17","#ffffff"], Egypt:["#ce1126","#ffffff","#111111"], Australia:["#00247d","#ffffff"]
  };
  function flagBg(cols){
    return cols.length===2 ? "linear-gradient(180deg,"+cols[0]+" 50%,"+cols[1]+" 50%)"
      : "linear-gradient(180deg,"+cols[0]+" 33.33%,"+cols[1]+" 33.33% 66.66%,"+cols[2]+" 66.66%)";
  }
  function fl(co){return '<span class="fl" style="background:'+flagBg(C[co]||["#888","#555"])+'"></span>';}
  function money(n){return "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});}
  function randWin(){return Math.round((Math.random()*Math.random()*14800+90)*100)/100;}

  /* ---- live leaderboard ---- */
  var boardEl=document.getElementById("board");
  var LB=[
    {n:"Rozina Khan",co:"India",amt:4365.25},
    {n:"Gozina Hezzez",co:"USA",amt:3980.50},
    {n:"Redwan Rizaj",co:"Turkey",amt:3620.00},
    {n:"Omer Rinki",co:"Egypt",amt:2890.75},
    {n:"Lucas Moreau",co:"France",amt:2140.10}
  ];
  function renderBoard(bump){
    LB.sort(function(a,b){return b.amt-a.amt;});
    boardEl.innerHTML=LB.map(function(p,i){
      return '<div class="brow'+(p.n===bump?" bump":"")+'"><span class="rk">0'+(i+1)+'</span>'+
        '<svg class="fl-svg" viewBox="0 0 24 24"><use href="#flag-us"/></svg>'+
        '<span class="nm">'+p.n+'</span><span class="amt">'+money(p.amt)+'</span></div>';
    }).join("");
  }
  renderBoard();
  setInterval(function(){var p=LB[Math.floor(Math.random()*LB.length)];p.amt+=randWin();renderBoard(p.n);},3500);

  /* ---- notification sound (Web Audio, unlocked on first interaction) ---- */
  var actx=null;
  function ensureAudio(){if(actx)return;try{actx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){actx=null;}}
  function unlock(){ensureAudio();if(actx&&actx.state==="suspended")actx.resume();}
  ["pointerdown","keydown","touchstart"].forEach(function(ev){window.addEventListener(ev,unlock,{once:true});});
  function chime(){
    if(!actx)return;
    var t=actx.currentTime;
    [[880,0],[1174.66,0.08],[1567.98,0.16]].forEach(function(p){
      var o=actx.createOscillator(),g=actx.createGain();
      o.type="sine";o.frequency.value=p[0];o.connect(g);g.connect(actx.destination);
      var s=t+p[1];
      g.gain.setValueAtTime(0.0001,s);
      g.gain.exponentialRampToValueAtTime(0.16,s+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001,s+0.3);
      o.start(s);o.stop(s+0.32);
    });
  }

  /* ---- recent-win toasts (top right, minimal) ---- */
  var WINNERS=[
    {n:"Rozina Khan",co:"India"},{n:"Gozina Hezzez",co:"USA"},{n:"Redwan Rizaj",co:"Turkey"},
    {n:"Omer Rinki",co:"Egypt"},{n:"Lucas Moreau",co:"France"},{n:"Sofia Rossi",co:"Italy"},
    {n:"Diego Santos",co:"Brazil"},{n:"Emma Becker",co:"Germany"},{n:"Yuki Tanaka",co:"Japan"},
    {n:"Aiden Walker",co:"Canada"},{n:"Olivia Smith",co:"UK"},{n:"Mateo García",co:"Spain"},
    {n:"Chidi Okafor",co:"Nigeria"},{n:"Camila Ruiz",co:"Mexico"},{n:"Jack Wilson",co:"Australia"}
  ];
  var toastWrap=document.getElementById("winToasts");
  function showWin(){
    var w=WINNERS[Math.floor(Math.random()*WINNERS.length)];
    var el=document.createElement("div");
    el.className="win-toast";
    el.innerHTML='<svg class="fl-svg" viewBox="0 0 24 24"><use href="#flag-us"/></svg><span class="nm">'+w.n+'</span><span class="won">won</span><span class="amt">'+money(randWin())+'</span>';
    toastWrap.appendChild(el);
    while(toastWrap.children.length>5) toastWrap.removeChild(toastWrap.firstChild);
    requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add("in");});});
    chime();
    setTimeout(function(){el.classList.remove("in");setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},450);},5600);
  }
  function burst(){
    showWin();
    // sometimes a couple of wins land almost together
    var extra=Math.random()<0.45 ? (Math.random()<0.35?2:1) : 0;
    for(var i=0;i<extra;i++){ (function(d){setTimeout(showWin,d);})(300+i*350); }
  }
  function loopWins(){burst();setTimeout(loopWins,5000+Math.random()*5000);}
  setTimeout(loopWins,2500);

  /* ---- live wins feed (name, US location, game, amount, time) ---- */
  var WNAMES=["Emma Becker","Lucas Moore","Diego Santos","Olivia Smith","Jack Wilson","Mia Turner","Noah Reed","Ava Brooks","Ethan Clark","Sofia Lopez","Liam Carter","Chloe Adams","Mason Cruz","Isla Reyes","Owen Hayes","Zoe Parker"];
  var WCITIES=[["New York","NY"],["Los Angeles","CA"],["Chicago","IL"],["Houston","TX"],["Miami","FL"],["Las Vegas","NV"],["Seattle","WA"],["Boston","MA"],["Atlanta","GA"],["Denver","CO"],["Phoenix","AZ"],["Dallas","TX"],["Austin","TX"],["Portland","OR"],["Nashville","TN"],["San Diego","CA"]];
  var WGAMES=["Golden Ace","Neon Reels","Mega Grand","Live Blackjack","Diamond Deal","Ruby Fortune","Ocean Hunter","Starlight Spin","Baccarat Royale","European Roulette","Dragon Fish","Emerald Wilds"];
  var WAV=[["#ff3dd6","#8a3fe6"],["#3aa0ff","#5a1fb0"],["#f5a623","#d0691e"],["#37d399","#128a5a"],["#e94db2","#7b2ff7"],["#22b8cf","#0e6b7d"]];
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function makeWin(t){var n=pick(WNAMES),c=pick(WCITIES),g=pick(WAV);
    return {n:n,ini:initials(n),city:c[0],st:c[1],game:pick(WGAMES),g:g,amt:randWin(),time:t||"just now"};}
  function winRowHtml(w){
    return '<div class="win-row"><div class="wr-av" style="background:linear-gradient(150deg,'+w.g[0]+','+w.g[1]+')">'+w.ini+'</div>'+
      '<div class="wr-main"><div class="wr-name">'+w.n+'</div>'+
      '<div class="wr-sub"><svg class="fl-svg" viewBox="0 0 24 24"><use href="#flag-us"/></svg>'+w.city+', '+w.st+' &middot; <b>'+w.game+'</b></div></div>'+
      '<div class="wr-amt"><b>'+money(w.amt)+'</b><span class="wr-time">'+w.time+'</span></div></div>';
  }
  var feed=document.getElementById("winsFeed");
  if(feed){
    ["just now","1m ago","2m ago","4m ago","6m ago"].forEach(function(t){feed.insertAdjacentHTML("beforeend",winRowHtml(makeWin(t)));});
    function addWin(){
      feed.insertAdjacentHTML("afterbegin",winRowHtml(makeWin("just now")));
      while(feed.children.length>6) feed.removeChild(feed.lastChild);
    }
    (function loop(){setTimeout(function(){addWin();loop();},3500+Math.random()*2600);})();
    var wt=document.getElementById("winsToday");
    if(wt){var n=4812;setInterval(function(){n+=Math.floor(Math.random()*3)+1;wt.textContent=n.toLocaleString("en-US");},2600);}
  }

  /* ---- testimonials marquee ---- */
  var TST=[
    {n:"Rozina Khan",co:"India",g:["#ff3dd6","#8a3fe6"],q:"Cashed out in under ten minutes — the fastest payout I've ever seen. The live jackpot feed is genuinely addictive!"},
    {n:"Lucas Moreau",co:"France",g:["#3aa0ff","#5a1fb0"],q:"Loads of games and the live tables actually feel real. Support answered me at 3am. Seriously impressed."},
    {n:"Emma Becker",co:"Germany",g:["#f5a623","#d0691e"],q:"Signed up for the free spins and stayed for the tournaments. Won my first $500 over a single weekend."},
    {n:"Diego Santos",co:"Brazil",g:["#37d399","#128a5a"],q:"Clean app, buttery smooth on my phone, and the VIP cashback is actually worth something."},
    {n:"Olivia Smith",co:"UK",g:["#e94db2","#7b2ff7"],q:"The layout makes it so easy to find what I want, and deposits land instantly every time."},
    {n:"Yuki Tanaka",co:"Japan",g:["#22b8cf","#5a1fb0"],q:"Best daily jackpot around. The win pop-ups keep me coming back every single night."}
  ];
  function initials(n){return n.split(" ").map(function(w){return w[0];}).join("").slice(0,2).toUpperCase();}
  var mq=document.getElementById("marquee");
  if(mq){
    var html=TST.map(function(t){
      return '<div class="tcard"><div class="thead">'+
        '<div class="av" style="background:linear-gradient(150deg,'+t.g[0]+','+t.g[1]+')">'+initials(t.n)+'</div>'+
        '<div><div class="tn">'+t.n+'</div><div class="tr"><svg class="fl-svg" viewBox="0 0 24 24"><use href="#flag-us"/></svg>United States</div></div></div>'+
        '<div class="stars">★★★★★</div><div class="quote">"'+t.q+'"</div></div>';
    }).join("");
    mq.innerHTML=html+html; /* duplicate for seamless loop */
  }

  /* countdown */
  var th=document.getElementById("th"),tm=document.getElementById("tm"),ts=document.getElementById("ts");
  var total=14*3600+53*60+32;
  function pad(n){return n<10?"0"+n:""+n;}
  function tick(){
    if(total<=0) total=14*3600+53*60+32;
    total--;
    th.textContent=pad(Math.floor(total/3600));
    tm.textContent=pad(Math.floor((total%3600)/60));
    ts.textContent=pad(total%60);
  }
  tick();setInterval(tick,1000);

  /* live "players online" jitter (updates all copies) */
  var onlineEls=document.querySelectorAll(".online-count");
  if(onlineEls.length){
    var online=12480;
    setInterval(function(){
      online+=Math.floor(Math.random()*61)-28;
      if(online<9000)online=9000+Math.floor(Math.random()*400);
      var s=online.toLocaleString("en-US");
      onlineEls.forEach(function(el){el.textContent=s;});
    },2200);
  }

  /* promo bar dismiss */
  var pc=document.getElementById("promoClose");
  if(pc) pc.addEventListener("click",function(){document.body.classList.add("promo-hidden");});

  /* transparent header -> solid on scroll + back-to-top button */
  var hdr=document.querySelector("header"),toTop=document.getElementById("toTop");
  function onScroll(){
    if(hdr) hdr.classList.toggle("scrolled",window.scrollY>16);
    if(toTop) toTop.classList.toggle("show",window.scrollY>500);
  }
  onScroll();
  window.addEventListener("scroll",onScroll,{passive:true});
  if(toTop) toTop.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"});});

  /* ---- sub-page router ---- */
  var PAGES=["casino","promo","events","how-to-play","faqs","support","terms","privacy","responsible","cookies"];
  var homeView=document.getElementById("page-home");
  var titles={casino:"Casino — Play2win",promo:"Promotions — Play2win",events:"Tournaments — Play2win",
    "how-to-play":"How to Play — Play2win",faqs:"FAQ — Play2win",support:"Support — Play2win",
    terms:"Terms — Play2win",privacy:"Privacy — Play2win",responsible:"Responsible Gaming — Play2win",cookies:"Cookies — Play2win"};
  function routePages(){
    var id=(location.hash||"").slice(1);
    var isPage=PAGES.indexOf(id)>=0;
    homeView.style.display=isPage?"none":"";
    PAGES.forEach(function(p){var el=document.getElementById("page-"+p); if(el) el.style.display=(p===id)?"":"none";});
    document.title=isPage?(titles[id]||"Play2win Casino"):"Play2win Casino";
    if(isPage){ window.scrollTo(0,0); }
    else if(id && id!=="home"){ var sec=document.getElementById(id); if(sec){ requestAnimationFrame(function(){sec.scrollIntoView();}); } }
    else { window.scrollTo(0,0); }
  }
  window.addEventListener("hashchange",routePages);
  routePages();

  /* support form (demo) */
  var sf=document.getElementById("supportForm");
  if(sf) sf.addEventListener("submit",function(e){e.preventDefault();
    var b=sf.querySelector('button[type="submit"]'); b.innerHTML="Message sent &#10003;"; b.disabled=true;
    setTimeout(function(){b.innerHTML='<svg><use href="#ic-mail"/></svg>Send Message';b.disabled=false;sf.reset();},2200);
  });

  /* subscribe demo */
  var sf=document.getElementById("subForm");
  sf.addEventListener("submit",function(e){
    e.preventDefault();var btn=sf.querySelector("button");var old=btn.innerHTML;
    btn.innerHTML="&#10003;";setTimeout(function(){btn.innerHTML=old;sf.reset();},1800);
  });
})();
}
