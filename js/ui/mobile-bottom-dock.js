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
  function stop(e){if(e){e.preventDefault&&e.preventDefault();e.stopPropagation&&e.stopPropagation();}}
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
      {id:'mars',name:'Mars Colony',level:1,unlockLevel:1,color:'#FF6D2D'},
      {id:'ice',name:'Frozen Moon',level:30,unlockLevel:30,color:'#80D8FF'},
      {id:'saturn',name:'Saturn Rings',level:60,unlockLevel:60,color:'#FFD06A'},
      {id:'toxic',name:'Toxic Venus',level:90,unlockLevel:90,color:'#AEEA00'},
      {id:'cyber',name:'Cyber Planet',level:120,unlockLevel:120,color:'#EA80FC'},
      {id:'void',name:'Galaxy Void',level:150,unlockLevel:150,color:'#FF4081'}
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
    if(id==='ice')return 'Snow Road';
    if(id==='saturn')return 'Gold Rings';
    if(id==='toxic')return 'Green Fog';
    if(id==='cyber')return 'Neon City';
    if(id==='void')return 'Galaxy Void';
    return 'Dust Road';
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
    if(cap)cap.textContent=text||'Planets unlock every 30 levels.';
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
    if(lvl)lvl.textContent='LVL '+level;
    wrap.innerHTML='';
    worlds.forEach(function(w,idx){
      var unlock=w.unlockLevel||w.level||1;
      var unlocked=worldUnlocked(w,level);
      var active=unlocked&&w.id===activeId;
      var isNew=unlocked&&w.id===newId&&!active;
      var focused=w.id===spaceMapFocusId;
      var pulse=w.id===spaceMapPulseId;
      var status=unlocked?(isNew?'NEW':(active?'SELECTED':'READY')):('LVL '+unlock);
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='space-planet space-route-'+idx+' '+(unlocked?'unlocked':'locked')+(active?' active':'')+(isNew?' new':'')+(focused?' focused':'')+(pulse?' pulse':'')+(pulse&&spaceMapPulseType==='denied'?' denied':'');
      btn.style.setProperty('--planetColor',w.color||'#00E5FF');
      btn.style.setProperty('--planetRgb',hexRgb(w.color||'#00E5FF'));
      btn.style.setProperty('--planetDelay',(idx*.08)+'s');
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
          '<span>'+(unlocked?(isNew?'New theme unlocked':(active?'Gameplay theme active':'Tap to choose theme')):'Locked planet')+'</span>'+
        '</span>'+
        '<span class="space-planet-badge">'+status+'</span>';
      wrap.appendChild(btn);
    });
    renderSpaceMapPreview(worldById(spaceMapFocusId,worlds),activeId,newId);
    setMapCaption('Choose an unlocked planet to change the gameplay theme.');
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
      setMapCaption('Choose an unlocked planet to change the gameplay theme.');
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
    var hasNew=show&&!!pendingNewWorldIdSafe();
    dock.classList.toggle('dock-visible',show);
    dock.classList.toggle('has-new-planet',hasNew);
    dock.setAttribute('aria-hidden',show?'false':'true');
    document.body.classList.toggle('mobile-dock-active',show);
    var mapBtn=document.getElementById('dock-map-btn');
    if(mapBtn){
      mapBtn.classList.toggle('has-new-planet',hasNew);
      mapBtn.setAttribute('aria-label',hasNew?'Map - new planet unlocked':'Map');
    }
  };
  window.addEventListener('resize',function(){ if(window.syncMobileBottomDock)window.syncMobileBottomDock(); },{passive:true});
  window.addEventListener('orientationchange',function(){ if(window.syncMobileBottomDock)window.syncMobileBottomDock(); },{passive:true});
  window.addEventListener('pageshow',function(){ if(window.syncMobileBottomDock)window.syncMobileBottomDock(); },{passive:true});
  setTimeout(function(){ if(window.syncMobileBottomDock)window.syncMobileBottomDock(); },0);
})();
