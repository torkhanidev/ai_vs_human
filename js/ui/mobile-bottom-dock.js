(function(){
  var spaceMapFocusId=null;
  var spaceMapPulseId=null;
  var spaceMapPulseType='';
  var spaceMapNewId=null;
  function active(){
    return window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
  }
  function menuVisible(){
    var menu=document.getElementById('s-menu');
    return !!(menu && menu.style.display!=='none' && document.body.classList.contains('menu-mode'));
  }
  function dockVisible(){
    return active() && menuVisible();
  }
  function stop(e){if(e){e.preventDefault&&e.preventDefault();e.stopPropagation&&e.stopPropagation();}blurDockFocus(document.getElementById('mobile-bottom-dock'));}
  function blurDockFocus(dock){
    try{
      var activeEl=document.activeElement;
      if(dock&&activeEl&&dock.contains(activeEl)&&activeEl.blur)activeEl.blur();
    }catch(err){}
  }
  window.isMobileBottomDockActive=active;
  window.dockStartGame=function(e){
    stop(e);
    if(typeof startGame==='function')startGame();
    if(window.syncMobileBottomDock)window.syncMobileBottomDock();
  };
  window.dockOpenShop=function(e){
    stop(e);
    if(typeof openShop==='function')openShop();
    if(window.syncMobileBottomDock)window.syncMobileBottomDock();
  };
  function spaceMapFallbackWorlds(){
    return [
      {id:'mars',name:'Mercury',level:1,unlockLevel:1,color:'#D8E6FF'},
      {id:'ice',name:'Venus',level:20,unlockLevel:20,color:'#FFC928'},
      {id:'saturn',name:'Earth',level:40,unlockLevel:40,color:'#18A0FF'},
      {id:'toxic',name:'Mars',level:60,unlockLevel:60,color:'#FF5B2E'},
      {id:'cyber',name:'Jupiter',level:80,unlockLevel:80,color:'#FF9F3D'},
      {id:'void',name:'Saturn',level:100,unlockLevel:100,color:'#FFE066'},
      {id:'neon_tokyo',name:'Uranus',level:120,unlockLevel:120,color:'#45F4FF'},
      {id:'lava_core',name:'Neptune',level:140,unlockLevel:140,color:'#315CFF'},
      {id:'ocean_abyss',name:'Pluto',level:160,unlockLevel:160,color:'#C66BFF'},
      {id:'crystal_realm',name:'Kepler 22b',level:180,unlockLevel:180,color:'#35F56D'},
      {id:'digital_void',name:'Haumea',level:200,unlockLevel:200,color:'#FFB3D9'},
      {id:'cosmic_storm',name:'Sun',level:220,unlockLevel:220,color:'#FFD000'}
    ];
  }
  function spaceMapWorlds(){
    try{
      if(typeof WORLD_DEFS!=='undefined'&&WORLD_DEFS&&WORLD_DEFS.length)return WORLD_DEFS;
    }catch(err){}
    return spaceMapFallbackWorlds();
  }
  function spaceMapLevel(){
    try{
      if(typeof playerData!=='undefined'&&playerData&&playerData.level)return Math.max(1,Math.round(playerData.level));
    }catch(err){}
    var ui=document.getElementById('ui-level');
    return Math.max(1,Math.round(Number(ui&&ui.textContent)||1));
  }
  function activeWorldId(level,worlds){
    try{
      if(typeof selectedWorldDef==='function'){
        var cur=selectedWorldDef();
        if(cur&&cur.id)return cur.id;
      }
    }catch(err){}
    try{
      if(typeof currentWorldDef==='function'){
        var levelWorld=currentWorldDef();
        if(levelWorld&&levelWorld.id)return levelWorld.id;
      }
    }catch(err){}
    var active=worlds[0]&&worlds[0].id;
    for(var i=0;i<worlds.length;i++){
      if(level>=(worlds[i].unlockLevel||worlds[i].level||1))active=worlds[i].id;
    }
    return active;
  }
  function worldUnlocked(w,level){
    try{
      if(typeof worldIsUnlocked==='function')return !!worldIsUnlocked(w,level);
    }catch(err){}
    try{
      if(typeof playerData!=='undefined'&&playerData&&playerData.content&&playerData.content.unlockedWorlds&&playerData.content.unlockedWorlds[w.id])return true;
    }catch(err){}
    return level>=(w.unlockLevel||w.level||1);
  }
  function worldById(id,worlds){
    worlds=worlds||spaceMapWorlds();
    for(var i=0;i<worlds.length;i++){
      if(worlds[i].id===id)return worlds[i];
    }
    return worlds[0]||null;
  }
  function worldMood(w){
    var id=w&&w.id;
    if(id==='ice')return 'Cloud Orbit';
    if(id==='saturn')return 'Blue Orbit';
    if(id==='toxic')return 'Dust Orbit';
    if(id==='cyber')return 'Storm Orbit';
    if(id==='void')return 'Ring Orbit';
    if(id==='neon_tokyo')return 'Ice Orbit';
    if(id==='lava_core')return 'Deep Orbit';
    if(id==='ocean_abyss')return 'Frost Orbit';
    if(id==='crystal_realm')return 'Green Orbit';
    if(id==='digital_void')return 'Pearl Orbit';
    if(id==='cosmic_storm')return 'Final Shine';
    return 'Swift Orbit';
  }
  function worldTier(w){
    var lv=w&&Number(w.unlockLevel||w.level||1)||1;
    if(lv>=180)return 'ELITE';
    if(lv>=120)return 'ADVANCED';
    if(lv>=60)return 'DEEP SPACE';
    if(lv>=20)return 'ORIGINAL';
    return 'START';
  }
  function unlockedWorldCount(worlds,level){
    var count=0;
    for(var i=0;i<worlds.length;i++){
      if(worldUnlocked(worlds[i],level))count++;
    }
    return count;
  }
  function nextLockedWorld(worlds,level){
    for(var i=0;i<worlds.length;i++){
      if(!worldUnlocked(worlds[i],level))return worlds[i];
    }
    return null;
  }
  function nextWorldProgress(worlds,level){
    worlds=worlds||spaceMapWorlds();
    level=Math.max(1,Math.round(Number(level)||1));
    var prev=worlds[0]||null;
    var next=null;
    for(var i=0;i<worlds.length;i++){
      var unlock=worlds[i].unlockLevel||worlds[i].level||1;
      if(level>=unlock)prev=worlds[i];
      else{next=worlds[i];break;}
    }
    if(!next)return {pct:100,next:null,prev:prev};
    var prevUnlock=prev?(prev.unlockLevel||prev.level||1):1;
    var nextUnlock=next.unlockLevel||next.level||1;
    var span=Math.max(1,nextUnlock-prevUnlock);
    var pct=Math.max(0,Math.min(100,((level-prevUnlock)/span)*100));
    return {pct:pct,next:next,prev:prev};
  }
  function spaceMapRoutePoints(worlds){
    var base=[
      {x:12,y:18},{x:38,y:10},{x:66,y:18},{x:88,y:34},
      {x:64,y:45},{x:36,y:37},{x:12,y:52},{x:34,y:68},
      {x:62,y:60},{x:88,y:76},{x:72,y:86},{x:50,y:92}
    ];
    worlds=worlds||[];
    return worlds.map(function(_,idx){
      if(base[idx])return base[idx];
      var t=idx*Math.PI*.62;
      return {x:50+Math.cos(t)*Math.min(38,16+idx*2),y:52+Math.sin(t)*Math.min(34,14+idx*1.6)};
    });
  }
  function pendingNewWorldIdSafe(){
    try{
      if(typeof pendingNewWorldId==='function')return pendingNewWorldId()||'';
    }catch(err){}
    try{
      if(typeof playerData!=='undefined'&&playerData&&playerData.content&&playerData.content.newWorldId)return String(playerData.content.newWorldId);
    }catch(err){}
    return '';
  }
  function clearNewWorldNoticeSafe(id){
    try{
      if(typeof clearNewWorldNotice==='function')return clearNewWorldNotice(id);
    }catch(err){}
    return false;
  }
  function escText(v){
    return String(v==null?'':v).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
  }
  function hexRgb(hex){
    hex=String(hex||'#00E5FF').replace('#','');
    if(hex.length===3)hex=hex.split('').map(function(c){return c+c;}).join('');
    var n=parseInt(hex,16);
    if(!Number.isFinite(n))return '0,229,255';
    return ((n>>16)&255)+','+((n>>8)&255)+','+(n&255);
  }
  function setMapCaption(text){
    var cap=document.getElementById('space-map-caption');
    if(cap)cap.textContent=text||'Planets unlock every 20 levels.';
  }
  function hideSpaceMapUnlockBox(){
    var box=document.getElementById('space-map-unlock-box');
    if(!box)return;
    clearTimeout(showSpaceMapUnlockBox._hideTimer);
    box.classList.remove('show','ready');
    box.setAttribute('aria-hidden','true');
  }
  function showSpaceMapUnlockBox(world){
    var box=document.getElementById('space-map-unlock-box');
    if(!box||!world)return;
    box.style.setProperty('--unlockColor',world.color||'#FFD740');
    var name=document.getElementById('space-map-unlock-name');
    var level=document.getElementById('space-map-unlock-level');
    var bonus=document.getElementById('space-map-unlock-bonus');
    var msg=document.getElementById('space-map-unlock-message');
    if(name)name.textContent=world.name||'New Planet';
    if(level)level.textContent='LEVEL '+(world.level||world.unlockLevel||'?')+' ROAD';
    if(bonus)bonus.textContent='SELECTED';
    if(msg)msg.textContent='NEW WORLD READY';
    box.classList.remove('ready');
    box.classList.add('show');
    box.setAttribute('aria-hidden','false');
    clearTimeout(showSpaceMapUnlockBox._readyTimer);
    clearTimeout(showSpaceMapUnlockBox._hideTimer);
    showSpaceMapUnlockBox._readyTimer=setTimeout(function(){box.classList.add('ready');},180);
    showSpaceMapUnlockBox._hideTimer=setTimeout(function(){hideSpaceMapUnlockBox();},2200);
  }
  window.closeSpaceMapUnlockBox=function(e){
    stop(e);
    hideSpaceMapUnlockBox();
  };
  function renderSpaceMapPreview(world,activeId,newId){
    var panel=document.getElementById('space-map-preview');
    if(!panel||!world)return;
    var level=spaceMapLevel();
    var unlock=world.unlockLevel||world.level||1;
    var unlocked=worldUnlocked(world,level);
    var activeTheme=unlocked&&world.id===activeId;
    var isNew=unlocked&&world.id===newId&&!activeTheme;
    var missing=Math.max(0,unlock-level);
    var color=world.color||'#00E5FF';
    var showAction=!activeTheme;
    panel.className='space-map-preview '+(unlocked?'unlocked':'locked')+(activeTheme?' active no-action':'')+(isNew?' new':'');
    panel.style.setProperty('--planetColor',color);
    panel.style.setProperty('--planetRgb',hexRgb(color));
    panel.style.setProperty('--planetSky',world.sky||'#06091f');
    panel.style.setProperty('--planetRoad',world.road||world.good||color);
    panel.innerHTML=
      '<div class="space-preview-visual" aria-hidden="true">'+
        '<span class="space-preview-orbit"></span>'+
        '<span class="space-preview-orb"></span>'+
        '<span class="space-preview-road"></span>'+
      '</div>'+
      '<div class="space-preview-copy">'+
        '<div class="space-preview-kicker">'+(isNew?'NEW THEME':(activeTheme?'ACTIVE THEME':(unlocked?'READY THEME':'LOCKED PLANET')))+'</div>'+
        '<div class="space-preview-name">'+escText(world.name||world.id)+'</div>'+
        '<div class="space-preview-sub">'+(unlocked?escText(worldMood(world)):(missing+' level'+(missing===1?'':'s')+' left'))+'</div>'+
        '<div class="space-preview-swatches" aria-hidden="true">'+
          '<span style="background:'+(world.sky||'#050716')+'"></span>'+
          '<span style="background:'+(world.road||color)+'"></span>'+
          '<span style="background:'+(world.good||color)+'"></span>'+
        '</div>'+
      '</div>'+
      (showAction?('<button class="space-preview-action" type="button" '+(!unlocked?'disabled':'')+'>'+
        (unlocked?'SELECT':'LVL '+unlock)+
      '</button>'):'');
    var action=panel.querySelector('.space-preview-action');
    if(action&&unlocked&&!activeTheme){
      action.onclick=function(e){window.spaceMapConfirmTheme(e,world.id);};
    }
  }
  function renderSpaceMap(){
    var wrap=document.getElementById('space-map-planets');
    if(!wrap)return;
    var level=spaceMapLevel();
    var worlds=spaceMapWorlds();
    var activeId=activeWorldId(level,worlds);
    var newId=spaceMapNewId||pendingNewWorldIdSafe();
    if(!spaceMapFocusId||!worldById(spaceMapFocusId,worlds))spaceMapFocusId=activeId;
    var lvl=document.getElementById('space-map-level');
    var readyCount=unlockedWorldCount(worlds,level);
    if(lvl)lvl.textContent='LVL '+level+' - '+readyCount+'/'+worlds.length;
    var points=spaceMapRoutePoints(worlds);
    var routeHtml='<svg class="space-route-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">';
    for(var li=1;li<worlds.length;li++){
      var from=points[li-1],to=points[li];
      var lineWorld=worlds[li];
      var lineUnlocked=worldUnlocked(lineWorld,level);
      routeHtml+='<line class="space-route-line '+(lineUnlocked?'unlocked':'locked')+'" x1="'+from.x+'" y1="'+from.y+'" x2="'+to.x+'" y2="'+to.y+'" style="--lineColor:'+(lineWorld.color||'#00E5FF')+';--lineRgb:'+hexRgb(lineWorld.color||'#00E5FF')+'"></line>';
    }
    routeHtml+='</svg>';
    wrap.classList.add('route-space');
    wrap.innerHTML=routeHtml;
    worlds.forEach(function(w,idx){
      var unlock=w.unlockLevel||w.level||1;
      var unlocked=worldUnlocked(w,level);
      var active=unlocked&&w.id===activeId;
      var isNew=unlocked&&w.id===newId&&!active;
      var focused=w.id===spaceMapFocusId;
      var pulse=w.id===spaceMapPulseId;
      var missing=Math.max(0,unlock-level);
      var status=unlocked?(isNew?'NEW':(active?'SELECTED':'READY')):(missing+' LVL');
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='space-planet space-route-'+idx+' '+(unlocked?'unlocked':'locked')+(active?' active':'')+(isNew?' new':'')+(focused?' focused':'')+(pulse?' pulse':'')+(pulse&&spaceMapPulseType==='denied'?' denied':'');
      btn.style.setProperty('--planetColor',w.color||'#00E5FF');
      btn.style.setProperty('--planetRgb',hexRgb(w.color||'#00E5FF'));
      btn.style.setProperty('--planetDelay',(idx*.08)+'s');
      btn.style.setProperty('--mapX',(points[idx]&&points[idx].x||50)+'%');
      btn.style.setProperty('--mapY',(points[idx]&&points[idx].y||50)+'%');
      btn.dataset.worldId=w.id;
      btn.setAttribute('aria-pressed',active?'true':'false');
      btn.onclick=function(e){spaceMapPlanetTap(e,w.id);};
      btn.innerHTML=
        '<span class="space-planet-node">'+
          '<span class="space-orbit"></span>'+
          '<span class="space-planet-orb"></span>'+
        '</span>'+
        '<span class="space-planet-copy">'+
          '<b>'+escText(w.name||w.id)+'</b>'+
          '<span>'+(unlocked?(isNew?'New theme unlocked':(active?'Gameplay theme active':worldTier(w)+' - '+worldMood(w))):('Unlocks at level '+unlock))+'</span>'+
        '</span>'+
        '<span class="space-planet-badge">'+status+'</span>';
      wrap.appendChild(btn);
    });
    renderSpaceMapPreview(worldById(spaceMapFocusId,worlds),activeId,newId);
    var next=nextLockedWorld(worlds,level);
    setMapCaption(next?('Worlds '+readyCount+'/'+worlds.length+' ready. Next: '+next.name+' at level '+(next.unlockLevel||next.level)+'.'):('All '+worlds.length+' worlds are ready. Choose any planet theme.'));
    if(spaceMapPulseId){
      clearTimeout(renderSpaceMap._pulseTimer);
      renderSpaceMap._pulseTimer=setTimeout(function(){spaceMapPulseId=null;spaceMapPulseType='';},520);
    }
  }
  function triggerSpaceMapJourney(world){
    var wrap=document.getElementById('space-map-planets');
    if(!wrap||!world)return;
    var target=wrap.querySelector('.space-planet[data-world-id="'+world.id+'"]');
    var y=92;
    if(target&&target.getBoundingClientRect){
      var wr=wrap.getBoundingClientRect();
      var tr=target.getBoundingClientRect();
      y=Math.max(28,Math.round(tr.top+tr.height*.5-wr.top-7));
    }
    wrap.style.setProperty('--journeyRgb',hexRgb(world.color||'#FFD740'));
    wrap.style.setProperty('--journeyY',y+'px');
    if(target){
      var x=(target.style.getPropertyValue('--mapX')||'50%').replace('%','');
      var yy=(target.style.getPropertyValue('--mapY')||'50%').replace('%','');
      wrap.style.setProperty('--journeyX',x+'%');
      wrap.style.setProperty('--journeyYPct',yy+'%');
    }
    wrap.classList.remove('journey');
    void wrap.offsetWidth;
    wrap.classList.add('journey');
    clearTimeout(triggerSpaceMapJourney._timer);
    triggerSpaceMapJourney._timer=setTimeout(function(){wrap.classList.remove('journey');},1700);
  }
  function flashSelectedWorld(world){
    try{if(typeof phaseFlash==='function')phaseFlash((world.name||'NEW WORLD').toUpperCase());}catch(err){}
    try{if(typeof floatTxt==='function')floatTxt('NEW WORLD READY',innerWidth*.5,innerHeight*.30,world.color||'#FFD740',36,'spin');}catch(err){}
    try{if(typeof rewardFlash==='function')rewardFlash('gold');}catch(err){}
    try{if(typeof shake==='function')shake(.42);}catch(err){}
    try{if(typeof triggerRoadPulse==='function')triggerRoadPulse(true,.95);}catch(err){}
  }
  window.renderSpaceMap=renderSpaceMap;
  window.openSpaceMap=function(e,opts){
    stop(e);
    opts=opts||{};
    var overlay=document.getElementById('space-map-overlay');
    if(!overlay)return;
    var worlds=spaceMapWorlds();
    var requestedId=opts.worldId&&worldById(opts.worldId,worlds)?opts.worldId:'';
    var pendingId=requestedId||pendingNewWorldIdSafe();
    var autoWorld=pendingId?worldById(pendingId,worlds):null;
    var shouldAuto=!!(autoWorld&&worldUnlocked(autoWorld,spaceMapLevel())&&(opts.autoSelectNew||pendingNewWorldIdSafe()));
    spaceMapNewId=shouldAuto?'':pendingNewWorldIdSafe();
    spaceMapFocusId=(autoWorld&&autoWorld.id)||activeWorldId(spaceMapLevel(),worlds);
    if(shouldAuto){
      if(typeof selectWorldTheme==='function'){
        var result=selectWorldTheme(autoWorld.id);
        if(!result||!result.ok)autoWorld=null;
      }else{
        clearNewWorldNoticeSafe(autoWorld.id);
      }
      if(autoWorld){
        spaceMapPulseId=autoWorld.id;
        spaceMapPulseType='selected';
        spaceMapNewId='';
        spaceMapFocusId=autoWorld.id;
      }
    }
    renderSpaceMap();
    if(autoWorld&&shouldAuto)triggerSpaceMapJourney(autoWorld);
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('space-map-open');
    if(autoWorld&&shouldAuto){
      showSpaceMapUnlockBox(autoWorld);
      flashSelectedWorld(autoWorld);
      setMapCaption('NEW PLANET SELECTED');
    }else if(spaceMapNewId){
      var nw=worldById(spaceMapNewId,worlds);
      setMapCaption('NEW PLANET: '+(nw&&nw.name?nw.name:'Planet')+'. Tap SELECT to use it.');
      clearNewWorldNoticeSafe(spaceMapNewId);
    }else{
      hideSpaceMapUnlockBox();
      var readyCount=unlockedWorldCount(worlds,spaceMapLevel());
      var next=nextLockedWorld(worlds,spaceMapLevel());
      setMapCaption(next?('Worlds '+readyCount+'/'+worlds.length+' ready. Next: '+next.name+' at level '+(next.unlockLevel||next.level)+'.'):('All '+worlds.length+' worlds are ready. Choose any planet theme.'));
    }
    try{if(typeof Sensory!=='undefined'&&Sensory.play)Sensory.play('start');}catch(err){}
  };
  window.closeSpaceMap=function(e){
    stop(e);
    var overlay=document.getElementById('space-map-overlay');
    if(!overlay)return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('space-map-open');
    spaceMapNewId=null;
    hideSpaceMapUnlockBox();
  };
  window.spaceMapBackdropTap=function(e){
    if(e&&e.target&&e.currentTarget&&e.target!==e.currentTarget)return;
    window.closeSpaceMap(e);
  };
  window.spaceMapPlanetTap=function(e,id){
    stop(e);
    var worlds=spaceMapWorlds();
    var level=spaceMapLevel();
    var w=worlds.find(function(x){return x.id===id;});
    if(!w)return;
    var unlock=w.unlockLevel||w.level||1;
    var activeId=activeWorldId(level,worlds);
    spaceMapFocusId=w.id;
    if(!worldUnlocked(w,level)){
      spaceMapPulseId=w.id;
      spaceMapPulseType='denied';
      renderSpaceMap();
      setMapCaption('Reach level '+unlock+' to unlock '+w.name+'.');
      try{if(typeof Haptic!=='undefined'&&Haptic.pulse)Haptic.pulse('bad');}catch(err){}
      return;
    }
    renderSpaceMap();
    setMapCaption(w.id===activeId?w.name+' is already your active theme.':'Preview '+w.name+', then tap SELECT.');
    try{if(typeof Haptic!=='undefined'&&Haptic.pulse)Haptic.pulse('tap');}catch(err){}
  };
  window.spaceMapConfirmTheme=function(e,id){
    stop(e);
    var worlds=spaceMapWorlds();
    var level=spaceMapLevel();
    var w=worldById(id,worlds);
    if(!w)return;
    var unlock=w.unlockLevel||w.level||1;
    spaceMapFocusId=w.id;
    if(!worldUnlocked(w,level)){
      spaceMapPulseId=w.id;
      spaceMapPulseType='denied';
      renderSpaceMap();
      setMapCaption('Reach level '+unlock+' to unlock '+w.name+'.');
      try{if(typeof Haptic!=='undefined'&&Haptic.pulse)Haptic.pulse('bad');}catch(err){}
      return;
    }
    if(typeof selectWorldTheme==='function'){
      var result=selectWorldTheme(w.id);
      if(result&&result.ok){
        spaceMapPulseId=w.id;
        spaceMapPulseType='selected';
        if(spaceMapNewId===w.id)spaceMapNewId=null;
        renderSpaceMap();
        setMapCaption(w.name+' selected as your gameplay theme.');
        try{if(typeof Sensory!=='undefined'&&Sensory.play)Sensory.play('start');}catch(err){}
        window.closeSpaceMap(e);
      }else if(result&&result.reason==='locked'){
        setMapCaption(w.name+' unlocks at level '+unlock+'.');
      }
    }else{
      spaceMapPulseId=w.id;
      spaceMapPulseType='selected';
      if(spaceMapNewId===w.id)spaceMapNewId=null;
      renderSpaceMap();
      setMapCaption(w.name+' selected as your gameplay theme.');
      window.closeSpaceMap(e);
    }
    try{if(typeof Haptic!=='undefined'&&Haptic.pulse)Haptic.pulse('tap');}catch(err){}
  };
  window.dockOpenSpaceMap=function(e){
    if(typeof window.openSpaceMap==='function')window.openSpaceMap(e);
  };
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&document.body.classList.contains('space-map-open'))window.closeSpaceMap(e);
  });
  window.syncMobileBottomDock=function(){
    var dock=document.getElementById('mobile-bottom-dock');
    if(!dock)return;
    var show=dockVisible();
    var hasNew=!!pendingNewWorldIdSafe();
    var worlds=spaceMapWorlds();
    var progress=nextWorldProgress(worlds,spaceMapLevel());
    var progressPct=hasNew?100:progress.pct;
    if(!show)blurDockFocus(dock);
    dock.classList.toggle('dock-visible',show);
    dock.classList.toggle('has-new-planet',show&&hasNew);
    try{dock.inert=!show;}catch(err){}
    dock.setAttribute('aria-hidden',show?'false':'true');
    document.body.classList.toggle('mobile-dock-active',show);
    var mapBtns=[document.getElementById('dock-map-btn'),document.getElementById('pc-map-btn')];
    for(var i=0;i<mapBtns.length;i++){
      var mapBtn=mapBtns[i];
      if(!mapBtn)continue;
      mapBtn.style.setProperty('--dock-map-progress',progressPct.toFixed(2)+'%');
      mapBtn.style.setProperty('--dock-map-progress-deg',(progressPct*3.6).toFixed(2)+'deg');
      mapBtn.style.setProperty('--dock-map-ring-opacity',progressPct>0?1:0);
      mapBtn.classList.toggle('has-new-planet',hasNew);
      mapBtn.setAttribute('aria-label',hasNew?'Map - new planet unlocked':(progress.next?'Map - next planet '+Math.round(progressPct)+'%':'Map - all planets unlocked'));
    }
  };
  window.addEventListener('resize',function(){ if(window.syncMobileBottomDock)window.syncMobileBottomDock(); },{passive:true});
  window.addEventListener('orientationchange',function(){ if(window.syncMobileBottomDock)window.syncMobileBottomDock(); },{passive:true});
  window.addEventListener('pageshow',function(){ if(window.syncMobileBottomDock)window.syncMobileBottomDock(); },{passive:true});
  setTimeout(function(){ if(window.syncMobileBottomDock)window.syncMobileBottomDock(); },0);
})();
