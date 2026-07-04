/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CONFIG
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const C={
  laneW:8, speed:13, gateMin:26, gateMax:42,
  obstMin:72, obstMax:110, bossDist:520,
  // V121 Gameplay control: horizontal drag sensitivity is x3 versus the old .014.
  inputDragSensitivity:.042,
  // V76 Dynamic Speed Ramp: starts normal, builds tension near boss.
  speedRampMax:.55, speedRampAnnounceAt:.70, gateCompressMax:.30,
  // V100 Boss Reflex Mini-Game: 5s UI sequence, fast correct inputs remove more AI.
  bossMiniDurationMs:5000, bossMiniPerfectMs:340, bossMiniLateMs:760, bossMiniGapMs:125, bossMiniMissGapMs:260, bossMiniMaxMisses:4, bossMiniSwipeMin:36,
  // V80 Near-Miss Comeback: creates a danger â†’ recovery story inside each run.
  dangerEnterRatio:.20, dangerRecoverRatio:.40, dangerComebackCoins:50, dangerPulseEvery:2.5,
  // V81 Crowd Milestone Spectacle: short slow-mo peaks at 100/200/500.
  milestoneSlowmoScale:.25, milestoneSlowmoDuration:.35,
  // V77 Fever Mode: rewards a clean good-gate streak without breaking balance.
  feverCombo:5, feverDuration:8, feverCoinMult:1.5, feverCompleteCoins:50,
  initCrowd:12, maxInst:280, segLen:24, segs:9,
  gates:[
    // Kid-readable labels stay small; v keeps the tuned gameplay strength.
    {t:'add',  v:10,  lbl:'+5',   col:0x1B5E20, tc:'#69F0AE', good:true,  w:18},
    {t:'add',  v:20,  lbl:'+10',  col:0x006064, tc:'#00E5FF', good:true,  w:18},
    {t:'add',  v:50,  lbl:'+15',  col:0x0D47A1, tc:'#64B5F6', good:true,  w:12},
    {t:'add',  v:100, lbl:'+20',  col:0x4A148C, tc:'#EA80FC', good:true,  w:6},
    {t:'mult', v:2,   lbl:'X2',   col:0xE65100, tc:'#FFD740', good:true,  w:16},
    {t:'sub',  v:20,  lbl:'-5',   col:0xB71C1C, tc:'#FF8A80', good:false, w:13},
    {t:'sub',  v:50,  lbl:'-10',  col:0x880000, tc:'#FF5252', good:false, w:10},
    {t:'sub',  v:100, lbl:'-15',  col:0x5D0000, tc:'#FF1744', good:false, w:7},
    {t:'sub',  v:120, lbl:'-20',  col:0x3E0000, tc:'#FF1744', good:false, w:4},
    {t:'double_bad', lbl:'/2',    col:0x4A148C, tc:'#EA80FC', good:false, w:5},
  ]
};

const DIFFICULTY_LEVEL_OFFSET=2;
const BONUS_LEVEL_INTERVAL=3;
const BONUS_LEVEL_REWARD_MULT=1.35;
const BONUS_LEVEL_ORB_COIN_BASE=2;
function gameplayDifficultyLevel(level){
  const playerLv=Math.max(1,Math.round(num(level || currentRunLevel || (playerData&&playerData.level) || 1,1)));
  return playerLv+DIFFICULTY_LEVEL_OFFSET;
}
function isBonusLevel(level){
  const playerLv=Math.max(1,Math.round(num(level || currentRunLevel || (playerData&&playerData.level) || 1,1)));
  return playerLv%BONUS_LEVEL_INTERVAL===0;
}
function bonusLevelOrbCoinValue(level){
  const playerLv=Math.max(1,Math.round(num(level || currentRunLevel || (playerData&&playerData.level) || 1,1)));
  return BONUS_LEVEL_ORB_COIN_BASE+Math.min(8,Math.floor(playerLv/6));
}

function drawGatePersonIcon(ctx,x,y,s,opt={}){
  const alpha=opt.alpha==null?1:opt.alpha;
  const fill=opt.fill||'#fff';
  const stroke=opt.stroke||'rgba(0,0,0,.72)';
  ctx.save();
  ctx.globalAlpha*=alpha;
  ctx.lineJoin='round';ctx.lineCap='round';
  ctx.shadowColor=opt.glow||fill;ctx.shadowBlur=opt.glowBlur==null?16:opt.glowBlur;
  ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=7*s;
  ctx.beginPath();ctx.arc(x,y-31*s,15*s,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.beginPath();
  if(ctx.roundRect)ctx.roundRect(x-19*s,y-12*s,38*s,54*s,15*s); else ctx.rect(x-19*s,y-12*s,38*s,54*s);
  ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-15*s,y+39*s);ctx.lineTo(x-31*s,y+70*s);ctx.moveTo(x+15*s,y+39*s);ctx.lineTo(x+31*s,y+70*s);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-18*s,y+2*s);ctx.lineTo(x-43*s,y+22*s);ctx.moveTo(x+18*s,y+2*s);ctx.lineTo(x+43*s,y+22*s);ctx.stroke();
  if(opt.slash){ctx.shadowColor='#FF1744';ctx.shadowBlur=18;ctx.strokeStyle='#FF1744';ctx.lineWidth=10*s;ctx.beginPath();ctx.moveTo(x-48*s,y+62*s);ctx.lineTo(x+48*s,y-64*s);ctx.stroke();}
  ctx.restore();
}

function drawGateDangerIcon(ctx,x,y,s,tc){
  ctx.save();
  const c=tc||'#FFD740';
  ctx.shadowColor=c;ctx.shadowBlur=30;ctx.fillStyle='rgba(255,215,64,.96)';
  ctx.strokeStyle='rgba(0,0,0,.74)';ctx.lineWidth=12*s;
  ctx.beginPath();ctx.moveTo(x,y-70*s);ctx.lineTo(x+78*s,y+66*s);ctx.lineTo(x-78*s,y+66*s);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;ctx.fillStyle='#190018';ctx.font=`900 ${94*s}px "Arial Black",Impact,Arial`;
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('!',x,y+8*s);
  ctx.restore();
}

function drawGateCopyIcon(ctx,x,y,s,tc){
  ctx.save();
  ctx.fillStyle='rgba(255,215,64,.18)';ctx.beginPath();ctx.arc(x,y+8*s,96*s,0,Math.PI*2);ctx.fill();
  drawGatePersonIcon(ctx,x-38*s,y+5*s,s,{fill:'#fff',glow:tc||'#FFD740'});
  drawGatePersonIcon(ctx,x+42*s,y+5*s,s,{fill:'#FFF176',glow:tc||'#FFD740'});
  ctx.restore();
}

function drawGateHalfIcon(ctx,x,y,s,tc){
  ctx.save();
  ctx.fillStyle='rgba(234,128,252,.14)';ctx.beginPath();ctx.arc(x,y+10*s,102*s,0,Math.PI*2);ctx.fill();
  drawGateDangerIcon(ctx,x,y-44*s,.62*s,tc||'#EA80FC');
  drawGatePersonIcon(ctx,x-42*s,y+44*s,.76*s,{fill:'#fff',glow:tc||'#EA80FC'});
  drawGatePersonIcon(ctx,x+44*s,y+44*s,.76*s,{fill:'#C6B6FF',alpha:.34,slash:true,glow:tc||'#EA80FC'});
  ctx.restore();
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PERF â€” Mobile detection (one flag, set once at startup)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  || window.innerWidth <= 900
  || window.matchMedia('(pointer: coarse)').matches;
const REDUCED_MOTION_QUERY = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

function prefersReducedMotion(){
  return !!(REDUCED_MOTION_QUERY && REDUCED_MOTION_QUERY.matches);
}
function motionScale(){
  return prefersReducedMotion() ? .28 : 1;
}
function syncMotionPreferenceClass(){
  const reduce=prefersReducedMotion();
  document.documentElement.classList.toggle('reduce-motion',reduce);
  if(document.body)document.body.classList.toggle('reduce-motion',reduce);
}
syncMotionPreferenceClass();
if(REDUCED_MOTION_QUERY){
  const onMotionChange=()=>syncMotionPreferenceClass();
  if(REDUCED_MOTION_QUERY.addEventListener)REDUCED_MOTION_QUERY.addEventListener('change',onMotionChange);
  else if(REDUCED_MOTION_QUERY.addListener)REDUCED_MOTION_QUERY.addListener(onMotionChange);
}

function reloadAppSafely(){
  if(location.protocol==='file:'){
    console.warn('Reload skipped on file:// to avoid browser origin restrictions. Run a local server for full reload behavior.');
    const b=document.getElementById('perf-toggle');
    if(b)b.textContent='REOPEN';
    return;
  }
  location.reload();
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   V87 PERFORMANCE MODE â€” HD default + Lite toggle + procedural characters
   Goal: less heat on weak devices, HD by default, same gameplay.
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const PerfMode={
  key:'lastStandPerfModeV85',
  mem:Number(navigator.deviceMemory||4),
  cores:Number(navigator.hardwareConcurrency||4),
  rawMode:'hd',
  init(){
    try{
      const saved=localStorage.getItem(this.key);
      this.rawMode=(saved==='lite'||saved==='hd')?saved:'hd';
    }catch(e){this.rawMode='hd';}
    this.applyCaps();
    this.refreshUI();
  },
  lowDevice(){return IS_MOBILE && (this.mem<=4 || this.cores<=4 || innerWidth<=430 || (devicePixelRatio||1)>=3);},
  get lite(){return this.rawMode==='lite';},
  targetFps(){return this.lite?45:60;},
  dprCap(){return this.lite?1.0:(IS_MOBILE?1.25:2);},
  crowdCap(){return this.lite?220:(IS_MOBILE?260:280);},
  particlePool(){return this.lite?14:24;},
  particleCount(){return this.lite?16:24;},
  startSquadCap(){return this.lite?3:(IS_MOBILE?5:8);},
  applyCaps(){C.maxInst=Math.min(C.maxInst,this.crowdCap());},
  label(){return this.lite?'LITE':'HD';},
  refreshUI(){
    const b=document.getElementById('perf-toggle');
    if(!b)return;
    b.textContent=this.label();
    b.title='Performance mode: '+this.label()+' - tap to switch HD/LITE';
    b.classList.toggle('perf-lite',this.lite);
    b.classList.toggle('perf-hd',!this.lite);
  },
  toggle(e){
    if(e){e.preventDefault();e.stopPropagation();}
    const next=this.rawMode==='lite'?'hd':'lite';
    try{localStorage.setItem(this.key,next);}catch(err){}
    this.rawMode=next;
    this.refreshUI();
    const b=document.getElementById('perf-toggle');
    if(b)b.textContent='RELOAD';
    setTimeout(()=>reloadAppSafely(),120);
  }
};
PerfMode.init();
window.PerfMode=PerfMode;
window.toggleQuality=function(e){PerfMode.toggle(e);};


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   V75 SENSORY PACK â€” Web Audio + Mobile Haptics
   Safe: no external files, starts only after user gesture.
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const Sensory={
  ctx:null,master:null,unlocked:false,lastPlay:{},
  get enabled(){return !playerData || !playerData.flags || playerData.flags.sound!==false;},
  init(){
    if(this.ctx)return true;
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return false;
    try{
      this.ctx=new AC();
      this.master=this.ctx.createGain();
      this.master.gain.value=.22;
      this.master.connect(this.ctx.destination);
      return true;
    }catch(e){return false;}
  },
  unlock(){
    if(!this.enabled)return;
    if(!this.init())return;
    if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});
    if(this.master){
      try{this.master.gain.cancelScheduledValues(this.ctx.currentTime);this.master.gain.setTargetAtTime(.22,this.ctx.currentTime,.035);}catch(e){this.master.gain.value=.22;}
    }
    this.unlocked=true;
    this.refreshUI();
  },
  refreshUI(){
    const b=document.getElementById('sound-toggle');
    if(!b)return;
    const on=this.enabled;
    b.textContent=on?'SOUND ON':'SOUND OFF';
    b.classList.toggle('sound-off',!on);
  },
  shouldPlay(kind,minGap){
    if(!this.enabled)return false;
    if(!this.init())return false;
    if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});
    if(this.master && this.master.gain.value<.05){
      try{this.master.gain.setTargetAtTime(.22,this.ctx.currentTime,.035);}catch(e){this.master.gain.value=.22;}
    }
    const now=performance.now();
    const gap=minGap==null?(IS_MOBILE?55:35):minGap;
    if(this.lastPlay[kind] && now-this.lastPlay[kind]<gap)return false;
    this.lastPlay[kind]=now;
    return true;
  },
  tone(freq,endFreq,dur,type,gain){
    if(!this.ctx||!this.master)return;
    const t=this.ctx.currentTime;
    const osc=this.ctx.createOscillator();
    const g=this.ctx.createGain();
    osc.type=type||'triangle';
    osc.frequency.setValueAtTime(freq,t);
    if(endFreq)osc.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),t+dur);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001,gain||.12),t+.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    osc.connect(g);g.connect(this.master);
    osc.start(t);osc.stop(t+dur+.025);
  },
  noise(dur,gain,filterFreq){
    if(!this.ctx||!this.master)return;
    const sr=this.ctx.sampleRate;
    const len=Math.max(1,Math.floor(sr*dur));
    const buffer=this.ctx.createBuffer(1,len,sr);
    const data=buffer.getChannelData(0);
    for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);
    const src=this.ctx.createBufferSource();src.buffer=buffer;
    const g=this.ctx.createGain();g.gain.value=gain||.08;
    const f=this.ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=filterFreq||1600;f.Q.value=5;
    src.connect(f);f.connect(g);g.connect(this.master);src.start();
  },
  arpeggio(combo){
    const notes=[261.63,329.63,392.00,493.88,523.25];
    const n=notes[Math.min(notes.length-1,Math.max(0,(combo||1)-1)%notes.length)];
    this.tone(n,n*1.18,.11,'triangle',.10);
  },
  play(kind,opts){
    opts=opts||{};
    if(!this.shouldPlay(kind))return;
    switch(kind){
      case 'start':
        this.tone(220,440,.18,'triangle',.10);setTimeout(()=>this.tone(330,660,.14,'triangle',.08),70);break;
      case 'gateGood':
        this.tone(opts.mult?260:200,opts.mult?760:600,.18,'triangle',opts.mult?.16:.12);
        if((opts.combo||0)>=2)this.arpeggio(opts.combo);
        break;
      case 'gateBad':
        this.tone(350,80,.22,'sawtooth',.12);this.noise(.10,.035,700);break;
      case 'halve':
        this.tone(420,70,.28,'sawtooth',.16);this.noise(.16,.05,500);break;
      case 'coin':
        this.tone(720,1040,.075,'sine',.055);break;
      case 'combo':
        this.arpeggio(opts.combo||3);break;
      case 'feverStart':
        this.tone(260,880,.30,'triangle',.16);setTimeout(()=>this.tone(520,1320,.22,'sine',.12),120);this.noise(.18,.035,3200);break;
      case 'feverEnd':
        this.tone(660,440,.18,'triangle',.08);break;
      case 'feverBreak':
        this.tone(440,90,.32,'sawtooth',.16);this.noise(.18,.045,620);break;
      case 'milestone':
        this.tone(330,880,.24,'triangle',.15);this.noise(.22,.05,2200);break;
      case 'danger':
        this.tone(520,130,.30,'sawtooth',.13);this.noise(.16,.045,560);break;
      case 'comeback':
        this.tone(240,720,.22,'triangle',.15);setTimeout(()=>this.tone(480,1100,.18,'sine',.12),95);this.noise(.18,.04,2400);break;
      case 'skin':
        this.tone(420,920,.20,'sine',.12);setTimeout(()=>this.tone(640,1280,.16,'triangle',.08),80);break;
      case 'chest':
        this.tone(180,420,.20,'triangle',.14);setTimeout(()=>this.tone(520,1240,.26,'sine',.16),120);this.noise(.25,.06,2800);break;
      case 'bossStart':
        this.tone(90,55,.45,'sawtooth',.15);this.noise(.25,.05,450);break;
      case 'bossTap':
        this.tone(140,320,.07,'square',.08);this.noise(.055,.035,900);break;
      case 'bossWin':
        this.tone(220,660,.28,'triangle',.16);setTimeout(()=>this.tone(440,990,.25,'triangle',.15),130);break;
      case 'bossLose':
        this.tone(160,50,.48,'sawtooth',.18);this.noise(.22,.05,420);break;
      case 'deny':
        this.tone(180,120,.12,'square',.07);break;
      default:
        this.tone(440,660,.10,'sine',.06);
    }
  }
};
const Haptic={
  enabled(){return IS_MOBILE && navigator.vibrate && (!playerData || !playerData.flags || playerData.flags.haptic!==false);},
  pulse(kind){
    if(!this.enabled())return;
    const patterns={
      start:20,gateGood:30,gateBad:[40,20,40],halve:[60,15,60,15,80],combo:35,
      feverStart:[35,20,70],feverEnd:40,feverBreak:[70,20,100],
      milestone:60,danger:[60,20,60],comeback:[40,20,100],skin:[35,20,65],chest:[50,30,90],deny:25,
      bossStart:[40,25,40],bossTap:20,bossWin:[80,30,80,30,120],bossLose:[200]
    };
    try{navigator.vibrate(patterns[kind]||20);}catch(e){}
  }
};
function toggleSound(e){
  if(e&&e.stopPropagation)e.stopPropagation();
  if(!playerData)loadGame();
  playerData.flags=playerData.flags||{};
  playerData.flags.sound=playerData.flags.sound===false;
  playerData.flags.soundUserSet=true;
  saveGame();
  Sensory.refreshUI();
  if(playerData.flags.sound){Sensory.unlock();Sensory.play('start');}
  else if(Sensory.master){try{Sensory.master.gain.setTargetAtTime(0.0001,Sensory.ctx.currentTime,.03);}catch(err){}}
}
window.Sensory=Sensory;
window.Haptic=Haptic;
window.toggleSound=toggleSound;
['pointerdown','touchstart','keydown'].forEach(ev=>window.addEventListener(ev,()=>Sensory.unlock(),{once:true,passive:true}));

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STATE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
let renderer,scene,camera,clock,dummy;
let worldRoadTexCache={};
let elapsed=0, gState='MENU';
// FPS cap: skip frames arriving faster than 60 Hz on 90/120 Hz displays
const _TARGET_FRAME_MS = 1000 / (window.PerfMode ? PerfMode.targetFps() : 60);
let _lastFrameTs = 0;
let crowd=C.initCrowd, peak=C.initCrowd;
// V88: remember the run's original START squad so all initial players can use leader-style fire.
let runStartCrowd=C.initCrowd;
let members=[];
let dist=0, crowdX=0, tgtX=0;
let dragging=false, lastTX=0;
let shield=false, combo=0, streak=0;
// V76: run tension curve. speedUpShown prevents repeated dopamine spam.
let speedUpShown=false,currentRunSpeed=C.speed,currentRunSpeedMult=1;
// V77 Fever Mode state
let feverActive=false,feverTimer=0,feverNextCombo=5,feverBonusCoinsThisRun=0;
// V80 Near-Miss Comeback state: low crowd becomes a recoverable story, not only punishment.
let inDangerZone=false,dangerPeak=0,dangerPulseTimer=0,comebackCoinsThisRun=0;
// V81 Crowd Milestone Spectacle state.
let gameTimeScale=1,gameTimeScaleTimer=0,armyModeActive=false;
let maxComboThisRun=0,lastComboBonusCoins=0,lastBaseRunReward=0;
let lastGoalReward=0,lastGoalCompleted=false,lastGoalTitle='',lastGoalProgressText='';
let lastMilestoneBonus=0,lastMilestoneTitle='',lastMilestoneCount=0,lastMilestoneBest=0;
let lastFailReason='',lastFailFix='';
let lastWorldUnlocked=false,lastWorldName='',lastWorldUnlockBonus=0,lastWorldUnlockId='',currentThemeId='';
let activeRunModifier=null,activeMicroGoals=[],runStats=null,freshnessBonusCoinsThisRun=0,riskDebtThisRun=0,runPacingBeat=0,comebackUsed=false,lastFreshnessResultText='';
let resurrectUsedThisRun=false,resurrectOfferState=null,resurrectOfferSeq=0;
let shakeAmt=0,shakeDur=0;
let gates_=[],laneTiles=[],particles_=[],orbs_=[];
let obstacles_=[];
let nextGateZ=32,nextOrbZ=45,nextObstZ=70;
let runCamIntroActive=false,runCamIntroT=0,runCamIntroDur=1;
let runCamIntroSX=0,runCamIntroSY=14,runCamIntroSZ=-22,runCamIntroLX=0,runCamIntroLY=2,runCamIntroLZ=24;
let bossActive=false,bossPhase=0,bossHP=100,bossClash=0;
let bossRobots=[],bossGroup=null,bossCore=null;
// Boss clash animation + slow-motion fight timeline
let bossHumanBaseZ=0,bossAIBaseZ=0,humanChargeOff=0,aiChargeOff=0;
let bossClashDone=false,bossPlayerWins=false;
let bossFightStart=0,bossFightDuration=3.5,bossFightStartWorld=0;
let bossFightInitHumans=0,bossFightInitAI=0,bossFightFinalHumans=0,bossFightFinalAI=0;
// During huge final fights the real numbers can be 1000+, while only a capped amount is drawn.
// These helpers make the VISIBLE fighters shrink with the counters, so both sides clearly disappear.
let bossVisualHumanStart=0,bossVisualAIStart=0;
let bossFightFXT=0,bossFightLastProgress=-1;
let bossSparkLast=0;
// V100 Boss Reflex Mini-Game: UI prompts during the slow-motion clash.
let bossTapEnabled=false,bossMiniActive=false,bossMiniFinished=false,bossMiniStarted=0,bossMiniEndsAt=0,bossMiniNextAt=0;
let bossMiniPrompt=null,bossMiniPromptStarted=0,bossMiniCombo=0,bossMiniPerfectStreak=0,bossMiniMisses=0,bossMiniDamage=0,bossMiniSeq=0,bossMiniPointer=null,bossMiniFeedbackSeq=0,bossMiniLastPromptType='';
let runMilestoneHits={};
let iHead,iBody,iArmL,iArmR,iLegL,iLegR,iEyeL,iEyeR,iFootL,iFootR,iBelt;
let rHead,rBody,rArm,rLeg,rAnt,rGlow,rEyeL,rEyeR,rCore,rShoulderL,rShoulderR;
let winDanceStart=0,celebrationZ=0,celebrationCX=0,celebrationBurstT=0;
let postDanceStart=0,postDanceZ=0,winSeq=0;
let flashEl;
let lastRewardFlashAt=0,lastFloatAt=0,activeFloatCount=0;
let dailyPopupTimer=0,pendingDailyPopup=null;
let forcedItems_=[],nextForcedZ=85;
// Special effect timers
let freezeTimer=0,regenTimer=0,regenAcc=0,goldRushTimer=0,invertTimer=0;
// Track gate choices for boss difficulty
let goodChoices=0, badChoices=0;
// Celestial objects
let planets_=[];
let skyStarsGroup=null, skyBrightGroup=null, skyBackdrop=null, cameraStarBackdrop=null, cameraAtmosphereOverlay=null;
let worldAtmosphereGroup=null, activeAtmosphereId='', marsAtmosphere=null;
// Consequence labels above upcoming gate
let nextGateConsequence=null;
// Dodge warn throttle
let lastDodgeShow=0;
let cxVar=0; // global cx for updateRunning
let crowdJuiceT=0, crowdJuiceGood=true, gateSparkT=0;
let secretCrowdWave=null,secretCrowdWaveCooldown=0,secretCrowdWaveLastKind=-1;
let badGateShockLast=0;
let roadPulseT=0,roadPulseGood=true,roadPulsePower=0;
let runnerTrailT=0,runnerTrailSide=1,runnerTrailLastX=0;
// Cached hot-path DOM refs (populated after renderer init)
let _hudCrowdEl=null,_hudProgEl=null,_hudDistEl=null,_hudFloatsEl=null;
let _dodgeWarnEl=null,_dangerEdgeEl=null;
// HUD change-detection: only touch DOM when value actually changed
let _lastHudCrowd=-1,_lastHudDist=-1,_hudLastDistPaint=0;
// Frame counter for sub-sampling expensive but slow-changing updates
let _frameN=0;
// Lazy-init flag for robot meshes (created only at boss fight start)
let _robotMeshesReady=false;


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   V50 DRAMA FX MANAGER â€” low-cost cinematic tension/release
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const DRAMA_POWER = IS_MOBILE ? 0.55 : 1;
const DramaFX={
  vignette:null,layer:null,lastWarn:0,lastRelief:0,lastDamage:0,lastRing:0,lastBoss:0,lastTick:0,
  init(){
    if(!this.vignette){
      this.vignette=document.createElement('div');
      this.vignette.id='drama-vignette';
      document.body.appendChild(this.vignette);
    }
    if(!this.layer){
      this.layer=document.createElement('div');
      this.layer.id='drama-toast-layer';
      document.body.appendChild(this.layer);
    }
  },
  flash(kind,dur){
    this.init();
    const el=this.vignette;
    el.className='';
    void el.offsetWidth;
    el.className=kind||'warn';
    clearTimeout(el._t);
    el._t=setTimeout(()=>{el.className='';},dur||260);
  },
  toast(txt,color,size,top,dur){
    this.init();
    const t=document.createElement('div');
    t.className='drama-toast '+(size||'medium');
    t.textContent=txt;
    t.style.color=color||'#fff';
    if(top!=null)t.style.top=top+'px';
    this.layer.appendChild(t);
    setTimeout(()=>t.remove(),dur||900);
  },
  ring(x,y,kind){
    const now=performance.now();
    if(now-this.lastRing<(IS_MOBILE?150:85))return;
    this.lastRing=now;
    const r=document.createElement('div');
    r.className='drama-impact-ring '+(kind||'cyan');
    r.style.left=(x==null?innerWidth*.5:x)+'px';
    r.style.top=(y==null?innerHeight*.52:y)+'px';
    document.body.appendChild(r);
    setTimeout(()=>r.remove(),720);
  },
  warnObstacle(obs){
    const now=performance.now();
    if(now-this.lastWarn<(IS_MOBILE?900:650))return;
    this.lastWarn=now;
    if(_dodgeWarnEl){
      _dodgeWarnEl.classList.remove('show','relief');
      _dodgeWarnEl.textContent='';
    }
    this.flash('warn',IS_MOBILE?180:230);
  },
  nearMiss(hard){
    const now=performance.now();
    if(now-this.lastRelief<(IS_MOBILE?430:300))return;
    this.lastRelief=now;
    if(_dodgeWarnEl){
      _dodgeWarnEl.textContent=hard?'NICE DODGE!':'CLEAN!';
      _dodgeWarnEl.classList.add('show','relief');
      clearTimeout(_dodgeWarnEl._reliefT);
      _dodgeWarnEl._reliefT=setTimeout(()=>{_dodgeWarnEl.classList.remove('show','relief');_dodgeWarnEl.textContent='DODGE!';},520);
    }
    this.flash('relief',hard?260:180);
    this.ring(innerWidth*.5,innerHeight*.52,hard?'green':'cyan');
    if(hard){
      this.toast('NICE DODGE!','#00FF88',IS_MOBILE?'small':'medium',innerHeight*.47,760);
      shake(.10*DRAMA_POWER);
    }
  },
  damage(amount,worldX,worldZ,opts){
    amount=Math.max(0,Math.round(amount||0));
    if(!amount)return;
    opts=opts||{};
    const now=performance.now();
    const big=opts.big || amount>=40 || amount>=Math.max(12,peak*.16);
    if(now-this.lastDamage>(IS_MOBILE?170:115)){
      this.lastDamage=now;
      this.flash('damage',big?320:220);
      this.ring(innerWidth*.5,innerHeight*.54,'red');
      if(_hudCrowdEl){
        _hudCrowdEl.classList.remove('drama-hit-pulse');
        void _hudCrowdEl.offsetWidth;
        _hudCrowdEl.classList.add('drama-hit-pulse');
      }
    }
    if(big){
      this.toast('BIG HIT!','#FF5252',IS_MOBILE?'medium':'big',innerHeight*.40,850);
      shake((.42+Math.min(amount,120)*.002)*DRAMA_POWER);
      if(worldX!=null&&worldZ!=null)burst(worldX,1.2,worldZ,0xFF3030,IS_MOBILE?10:18);
    }else{
      shake((.16+Math.min(amount,35)*.004)*DRAMA_POWER);
    }
  },
  bossIntro(msg,cz){
    const now=performance.now();
    if(now-this.lastBoss<700)return;
    this.lastBoss=now;
    this.flash('warn',420);
    this.ring(innerWidth*.5,innerHeight*.48,'red');
    this.toast('AI ARMY INCOMING','#FF5252',IS_MOBILE?'medium':'big',innerHeight*.36,900);
    shake(.78*DRAMA_POWER);
    if(typeof burst==='function'){
      burst(0,4,cz+14,0xFF3030,IS_MOBILE?14:24);
      if(!IS_MOBILE)burst(0,4,cz+14,0xFF8800,18);
    }
  },
  clashImpact(humanCZ,aiCZ,duration){
    this.flash('warn',260);
    this.ring(innerWidth*.5,innerHeight*.46,'gold');
    if(!bossMiniActive)this.toast('CLASH!','#FFD740',IS_MOBILE?'medium':'big',innerHeight*.42,780);
    shake(1.0*DRAMA_POWER);
    const mid=(humanCZ+aiCZ)/2;
    if(typeof burst==='function')burst(0,1.8,mid,0xFFD740,IS_MOBILE?16:24);
  },
  clashTick(hLoss,aiLoss,humanCZ,aiCZ,p){
    const now=performance.now();
    if(now-this.lastTick<(IS_MOBILE?520:360))return;
    if((hLoss||0)+(aiLoss||0)<=0)return;
    this.lastTick=now;
    const playerTakingBig=(hLoss||0)>=Math.max(5,bossFightInitHumans*.025);
    if(playerTakingBig){
      this.flash('damage',170);
      if(_hudCrowdEl){_hudCrowdEl.classList.remove('drama-hit-pulse');void _hudCrowdEl.offsetWidth;_hudCrowdEl.classList.add('drama-hit-pulse');}
    }else if((aiLoss||0)>0 && p>.25 && !IS_MOBILE){
      this.ring(innerWidth*.5,innerHeight*.48,'gold');
    }
  },
  finalHit(win,humanCZ,aiCZ){
    if(win){
      this.flash('victory',520);
      this.ring(innerWidth*.5,innerHeight*.44,'gold');
      this.toast('FINAL HIT!','#FFD740','big',innerHeight*.34,920);
      setTimeout(()=>this.toast('AI DESTROYED!','#00FF88',IS_MOBILE?'medium':'big',innerHeight*.43,900),180);
      shake(1.08*DRAMA_POWER);
      if(typeof burst==='function'){
        burst(0,3,humanCZ,0x00FF88,IS_MOBILE?18:24);
        burst(0,3,aiCZ,0xFFD740,IS_MOBILE?12:20);
      }
    }else{
      this.flash('defeat',620);
      this.toast('DEFEATED...','#FF3030','big',innerHeight*.43,920);
      shake(1.18*DRAMA_POWER);
    }
  }
};
window.DramaFX=DramaFX;


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   META SYSTEMS V19 â€” ECONOMY / DAILY API / PC UI / NO EMOJI
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const SAVE_VERSION=19;
const SAVE_KEY='last_stand_3d_meta_v19';
const LEGACY_SAVE_KEYS=['last_stand_3d_meta_v18','last_stand_3d_meta_v17','last_stand_3d_meta_v16','last_stand_3d_meta_v15','last_stand_3d_meta_v14','last_stand_3d_meta_v13'];
const CROWD_MILESTONE_DEFS=[
  {id:'m25',threshold:25,title:'25 HEROES',sub:'Squad online',color:'#69F0AE',burst:0x69F0AE,bonus:80,kind:'small'},
  {id:'m50',threshold:50,title:'50 HEROES',sub:'Resistance grows!',color:'#69F0AE',burst:0x00FFAA,bonus:120,kind:'small'},
  {id:'m100',threshold:100,title:'100 CROWD!',sub:'THE ARMY IS FORMING',color:'#FFD740',burst:0xFFD740,bonus:220,kind:'gold'},
  {id:'m150',threshold:150,title:'150 STRONG',sub:'Momentum locked',color:'#80D8FF',burst:0x80D8FF,bonus:300,kind:'blue'},
  {id:'m200',threshold:200,title:'200 STRONG',sub:'UNSTOPPABLE FORCE',color:'#00E5FF',burst:0x00E5FF,bonus:420,kind:'blue'},
  {id:'m300',threshold:300,title:'300 UNITED',sub:'The road is yours',color:'#B388FF',burst:0xB388FF,bonus:650,kind:'violet'},
  {id:'m500',threshold:500,title:'ARMY MODE',sub:'500 UNITED - AI IS DOOMED',color:'#FF8F00',burst:0xFF8F00,bonus:1000,kind:'army'},
  {id:'m750',threshold:750,title:'750 LEGENDS',sub:'Human wave unstoppable',color:'#FF4081',burst:0xFF4081,bonus:1600,kind:'legend'},
  {id:'m1000',threshold:1000,title:'1000 HEROES',sub:'Last stand became a legion',color:'#FFD740',burst:0xFFD740,bonus:2500,kind:'legend'}
];
const START_UNITS_TABLE=[0,1,2,3,4,5,6,7,8,9,10];
const SKINS=[
  {id:'default',name:'Default',rarity:'COMMON',price:0,body:'#1E88E5',accent:'#4FC3F7',skin:'#FFCC80',shoe:'#0B1730',glow:'#4FC3F7',desc:'Classic survivor team.'},
  {id:'ice',name:'Ice Runner',rarity:'RARE',price:900,body:'#7CEBFF',accent:'#D8FAFF',skin:'#B3F5FF',shoe:'#E0F7FA',glow:'#80D8FF',desc:'First rare skin. Still reachable early.'},
  {id:'fire',name:'Fire Squad',rarity:'RARE',price:2600,body:'#FF6D00',accent:'#FFD740',skin:'#FFAB40',shoe:'#3E0900',glow:'#FF6D00',desc:'Hot orange texture with energy.'},
  {id:'robot',name:'Robot Unit',rarity:'EPIC',price:7200,body:'#78909C',accent:'#00E5FF',skin:'#B0BEC5',shoe:'#263238',glow:'#00E5FF',desc:'Metallic grid texture.'},
  {id:'ninja',name:'Ninja',rarity:'EPIC',price:15500,body:'#161820',accent:'#D500F9',skin:'#ECEFF1',shoe:'#050508',glow:'#D500F9',desc:'Dark stealth skin.'},
  {id:'gold',name:'Gold Hero',rarity:'LEGENDARY',price:42000,body:'#FFD740',accent:'#FFF59D',skin:'#FFE082',shoe:'#5D4037',glow:'#FFD740',desc:'Premium gold shine.'},
  {id:'toxic',name:'Toxic',rarity:'LEGENDARY',price:90000,body:'#76FF03',accent:'#C6FF00',skin:'#B2FF59',shoe:'#1B5E20',glow:'#76FF03',desc:'Green bubbles and danger energy.'},
  {id:'galaxy',name:'Galaxy',rarity:'MYTHIC',price:220000,body:'#6A1B9A',accent:'#00E5FF',skin:'#CE93D8',shoe:'#09001A',glow:'#EA80FC',desc:'Mythic endgame skin with stars.'},
  {id:'shadow',name:'Shadow',rarity:'MYTHIC',price:500000,body:'#070B1F',accent:'#6C63FF',skin:'#C7D8FF',shoe:'#02030A',glow:'#7C4DFF',desc:'Silent violet shadow with soft night energy.'},
  {id:'plasma',name:'Plasma Ranger',rarity:'LEGENDARY',price:650000,body:'#00B8D4',accent:'#FF4FD8',skin:'#C8F7FF',shoe:'#050019',glow:'#00E5FF',fx:'plasma',desc:'Premium plasma suit with pulsing energy.'},
  {id:'samurai',name:'Neon Samurai',rarity:'LEGENDARY',price:720000,body:'#D32F2F',accent:'#FFD740',skin:'#FFE0B2',shoe:'#11050A',glow:'#FF4081',fx:'samurai',desc:'Blade-bright armor for clean boss hits.'},
  {id:'angel',name:'Solar Angel',rarity:'LEGENDARY',price:800000,body:'#FFFDE7',accent:'#FFD740',skin:'#FFE0B2',shoe:'#6D4C41',glow:'#FFF176',fx:'angel',desc:'Radiant rescue armor with soft gold wings.'},
  {id:'demon',name:'Inferno Demon',rarity:'LEGENDARY',price:890000,body:'#8B0000',accent:'#FF1744',skin:'#FF8A65',shoe:'#1A0000',glow:'#FF1744',fx:'demon',desc:'High-risk inferno gear with fierce payout.'},
  {id:'dragon',name:'Dragon Scale',rarity:'LEGENDARY',price:980000,body:'#00A86B',accent:'#FFD740',skin:'#B2FF59',shoe:'#06351F',glow:'#69F0AE',fx:'dragon',desc:'Scaled armor that shrugs off bad gates.'},
  {id:'crystal',name:'Crystal Prism',rarity:'LEGENDARY',price:1080000,body:'#B3E5FC',accent:'#EA80FC',skin:'#E1F5FE',shoe:'#512DA8',glow:'#B388FF',fx:'crystal',desc:'Prismatic suit with sharper boss focus.'},
  {id:'thunder',name:'Thunder Volt',rarity:'MYTHIC',price:1180000,body:'#263238',accent:'#FFEA00',skin:'#CFD8DC',shoe:'#0B0E11',glow:'#FFEA00',fx:'thunder',desc:'Storm armor that cracks boss shields.'},
  {id:'ghost',name:'Ghost Phase',rarity:'MYTHIC',price:1280000,body:'#CFD8DC',accent:'#80D8FF',skin:'#ECEFF1',shoe:'#263238',glow:'#B0BEC5',fx:'ghost',desc:'Phase suit that rewards clean dodges.'},
  {id:'alien',name:'Alien Core',rarity:'MYTHIC',price:1380000,body:'#64DD17',accent:'#18FFFF',skin:'#CCFF90',shoe:'#102A14',glow:'#18FFFF',fx:'alien',desc:'Bio-core skin that boosts orbs and gates.'},
  {id:'royal',name:'Royal Guard',rarity:'MYTHIC',price:1480000,body:'#283593',accent:'#FFD740',skin:'#D7CCC8',shoe:'#100A3D',glow:'#FFD740',fx:'royal',desc:'Regal armor with better run payouts.'},
  {id:'pharaoh',name:'Pharaoh Sun',rarity:'MYTHIC',price:1580000,body:'#F9A825',accent:'#00B8D4',skin:'#FFCC80',shoe:'#3E2723',glow:'#FFD740',fx:'pharaoh',desc:'Ancient sun tech that empowers orbs.'},
  {id:'cyber_king',name:'Cyber King',rarity:'MYTHIC',price:1660000,body:'#311B92',accent:'#00E5FF',skin:'#B39DDB',shoe:'#050014',glow:'#00E5FF',fx:'cyber',desc:'Royal grid armor for boss reflex control.'},
  {id:'void_knight',name:'Void Knight',rarity:'MYTHIC',price:1740000,body:'#080015',accent:'#7C4DFF',skin:'#B0BEC5',shoe:'#000000',glow:'#7C4DFF',fx:'void',desc:'Elite knight armor that breaks bosses faster.'},
  {id:'frost_lord',name:'Frost Lord',rarity:'MYTHIC',price:1800000,body:'#E0F7FA',accent:'#40C4FF',skin:'#B2EBF2',shoe:'#01579B',glow:'#84FFFF',fx:'frost',desc:'Frozen crown armor with strong red-gate guard.'},
  {id:'solar_flare',name:'Solar Flare',rarity:'MYTHIC',price:1860000,body:'#FFB300',accent:'#FF3D00',skin:'#FFD180',shoe:'#4E2600',glow:'#FFAB00',fx:'solar',desc:'Sun-charged suit for stronger good gates.'},
  {id:'quantum_shift',name:'Quantum Shift',rarity:'MYTHIC',price:1910000,body:'#00B0FF',accent:'#D500F9',skin:'#B3E5FC',shoe:'#0D0030',glow:'#EA80FC',fx:'quantum',desc:'Reality-shift suit with boss and orb bonuses.'},
  {id:'mecha_gold',name:'Mecha Gold',rarity:'MYTHIC',price:1950000,body:'#C8A600',accent:'#00E5FF',skin:'#FFE082',shoe:'#212121',glow:'#FFD740',fx:'mecha',desc:'Premium mecha armor with top-tier rewards.'},
  {id:'crimson_reaper',name:'Crimson Reaper',rarity:'MYTHIC',price:1980000,body:'#2A0008',accent:'#FF1744',skin:'#B0BEC5',shoe:'#000000',glow:'#FF1744',fx:'reaper',desc:'Final-strike cloak with boss pressure.'},
  {id:'nebula_crown',name:'Nebula Crown',rarity:'MYTHIC',price:1990000,body:'#4A148C',accent:'#FF80AB',skin:'#CE93D8',shoe:'#09001A',glow:'#FF80AB',fx:'nebula',desc:'Cosmic crown suit with stellar orb pull.'},
  {id:'omega_prime',name:'Omega Prime',rarity:'MYTHIC',price:2000000,body:'#FFFFFF',accent:'#00E676',skin:'#E0F2F1',shoe:'#101818',glow:'#00E676',fx:'omega',desc:'Ultimate premium skin with balanced power.'}
];
const RARITY_COLORS={COMMON:'#90A4AE',RARE:'#00E5FF',EPIC:'#EA80FC',LEGENDARY:'#FFD740',MYTHIC:'#FF4081'};
const MISSION_DEFS=[
  {id:'win1',title:'Win 1 level',target:1,reward:150,unit:'win',progress:()=>Math.min(1,playerData.stats.wins||0)},
  {id:'crowd80',title:'Reach 80 humans',target:80,reward:200,unit:'humans',progress:()=>Math.min(80,playerData.bestCrowd||0)}
];
const NEXT_RUN_GOAL_IDS=['crowd','combo','good','win'];
const DAILY_CHALLENGE_REWARD=400;
const DAILY_CHALLENGE_CHEST_PROGRESS=25;
const DAILY_CHALLENGES=[
  {id:'daily_win',title:'Win Today',desc:'Defeat the AI Army once.',stat:'win',target:()=>1},
  {id:'daily_good',title:'Good Route',desc:'Pick good gates in one run.',stat:'good',target:lv=>lv>=12?7:5},
  {id:'daily_combo',title:'Combo Chain',desc:'Reach a strong combo.',stat:'combo',target:lv=>lv>=12?7:5},
  {id:'daily_crowd',title:'Big Crowd',desc:'Reach today\'s crowd target.',stat:'crowd',target:lv=>Math.min(320,120+lv*9)},
  {id:'daily_orbs',title:'Orb Sweep',desc:'Collect glowing orbs.',stat:'orbs',target:lv=>lv>=10?16:10},
  {id:'daily_dodge',title:'Clean Dodges',desc:'Dodge obstacles cleanly.',stat:'dodges',target:()=>2,minLevel:2},
  {id:'daily_rescue',title:'Last Stand',desc:'Trigger one rescue moment.',stat:'comeback',target:()=>1,minLevel:3},
  {id:'daily_distance',title:'Reach The Clash',desc:'Reach the boss road.',stat:'distance',target:()=>100},
  {id:'daily_perfect',title:'Clean Picks',desc:'Pick good gates and avoid bad ones.',stat:'cleanGood',target:lv=>lv>=10?5:4}
];
function buildNextRunGoal(id){
  const lv=playerData?Math.max(1,playerData.level||1):1;
  if(id==='crowd'){
    const target=Math.min(520,120+Math.floor((lv-1)/2)*30);
    return{id,target,reward:180+Math.min(220,lv*10)};
  }
  if(id==='combo'){
    const target=lv>=10?7:5;
    return{id,target,reward:240+Math.min(220,lv*9)};
  }
  if(id==='good'){
    const target=lv>=8?5:4;
    return{id,target,reward:220+Math.min(200,lv*8)};
  }
  return{id:'win',target:1,reward:300+Math.min(240,lv*12)};
}
function goalTitle(goal){
  if(!goal)return'Choose good gates';
  if(goal.id==='crowd')return'Reach '+goal.target+' humans';
  if(goal.id==='combo')return'Reach Combo x'+goal.target;
  if(goal.id==='good')return'Pick '+goal.target+' good gates';
  return'Defeat the AI Army';
}
function goalUnit(goal){
  if(!goal)return'';
  if(goal.id==='crowd')return' humans';
  if(goal.id==='combo')return' combo';
  if(goal.id==='good')return' gates';
  return' win';
}
function createNextRunGoal(prevId){
  const statsRuns=playerData&&playerData.stats?playerData.stats.runs||0:0;
  const level=playerData?playerData.level||1:1;
  let idx=(statsRuns+level)%NEXT_RUN_GOAL_IDS.length;
  if(prevId&&NEXT_RUN_GOAL_IDS[idx]===prevId)idx=(idx+1)%NEXT_RUN_GOAL_IDS.length;
  return buildNextRunGoal(NEXT_RUN_GOAL_IDS[idx]);
}
function ensureNextRunGoal(){
  if(!playerData||!playerData.content)return null;
  let g=playerData.content.nextRunGoal;
  if(!g||!NEXT_RUN_GOAL_IDS.includes(g.id)){
    g=createNextRunGoal();
    playerData.content.nextRunGoal=g;
  }
  return g;
}
function nextRunGoalProgress(goal,win){
  if(!goal)return 0;
  if(goal.id==='crowd')return Math.max(0,Math.round(peak||0));
  if(goal.id==='combo')return Math.max(0,Math.round(maxComboThisRun||0));
  if(goal.id==='good')return Math.max(0,Math.round(goodChoices||0));
  return win?1:0;
}
function updateNextRunGoalUI(){
  if(!playerData)return;
  const goal=ensureNextRunGoal();
  if(!goal)return;
  const prog=0,pct=0;
  setText('next-goal-title',goalTitle(goal));
  setText('next-goal-progress',prog+'/'+goal.target+goalUnit(goal));
  setText('next-goal-reward','+'+goal.reward+' COINS');
  setBar('next-goal-fill',pct);
}
function updateResultRunGoal(kind){
  const el=document.getElementById(kind+'-goal-result');
  if(!el)return;
  el.classList.toggle('goal-complete',!!lastGoalCompleted);
  if(lastGoalCompleted){
    el.textContent='GOAL COMPLETE - +'+lastGoalReward+' COINS';
  }else{
    el.textContent='GOAL '+lastGoalProgressText+' - '+(lastGoalTitle||'Try again');
  }
}
function checkNextRunGoal(win){
  lastGoalReward=0;lastGoalCompleted=false;lastGoalTitle='';lastGoalProgressText='';
  const goal=ensureNextRunGoal();
  if(!goal)return 0;
  const prog=Math.min(goal.target,nextRunGoalProgress(goal,win));
  lastGoalTitle=goalTitle(goal);
  lastGoalProgressText=prog+'/'+goal.target;
  if(prog>=goal.target){
    lastGoalCompleted=true;
    lastGoalReward=goal.reward;
    addCoins(lastGoalReward,{silent:true});
    floatTxt('GOAL +'+lastGoalReward+' COINS',innerWidth*.5,innerHeight*.29,'#69F0AE',34,'spin');
    rewardFlash('green');shake(.35);
    playerData.content.nextRunGoal=createNextRunGoal(goal.id);
    return lastGoalReward;
  }
  return 0;
}
function dailyChallengeDate(ts=Date.now()){
  if(typeof tunisLocalDate==='function')return tunisLocalDate(ts);
  try{return new Date(ts).toLocaleDateString('en-CA');}catch(e){return new Date(ts).toISOString().slice(0,10);}
}
function dateSeed(date){
  const s=String(date||dailyChallengeDate());
  let n=0;
  for(let i=0;i<s.length;i++)n=(n*31+s.charCodeAt(i))>>>0;
  return n;
}
function availableDailyChallenges(level){
  level=Math.max(1,Math.round(num(level || (playerData&&playerData.level) || 1,1)));
  return DAILY_CHALLENGES.filter(c=>!c.minLevel||level>=c.minLevel);
}
function dailyChallengeTarget(challenge){
  const lv=Math.max(1,Math.round(num(playerData&&playerData.level,1)));
  return Math.max(1,Math.round(typeof challenge.target==='function'?challenge.target(lv):challenge.target||1));
}
function todaysDailyChallenge(date){
  date=date||dailyChallengeDate();
  const pool=availableDailyChallenges(playerData?playerData.level:1);
  const challenge=pool[dateSeed(date)%pool.length]||DAILY_CHALLENGES[0];
  return Object.assign({},challenge,{date,targetValue:dailyChallengeTarget(challenge),reward:DAILY_CHALLENGE_REWARD,chestProgress:DAILY_CHALLENGE_CHEST_PROGRESS});
}
function ensureDailyChallengeState(date){
  if(!playerData||!playerData.content)return null;
  date=date||dailyChallengeDate();
  const challenge=todaysDailyChallenge(date);
  const state=playerData.content.dailyChallenge=Object.assign({date:'',id:'',completed:false,claimedAt:0},playerData.content.dailyChallenge||{});
  if(state.date!==date||state.id!==challenge.id){
    state.date=date;
    state.id=challenge.id;
    state.completed=false;
    state.claimedAt=0;
  }
  return {state,challenge};
}
function dailyChallengeProgress(challenge,win){
  if(!challenge)return 0;
  const stats=runStats||{};
  if(challenge.stat==='win')return win?1:0;
  if(challenge.stat==='good')return Math.max(0,Math.round(stats.good||goodChoices||0));
  if(challenge.stat==='combo')return Math.max(0,Math.round(maxComboThisRun||combo||0));
  if(challenge.stat==='crowd')return Math.max(0,Math.round(peak||crowd||0));
  if(challenge.stat==='orbs')return Math.max(0,Math.round(stats.orbs||0));
  if(challenge.stat==='dodges')return Math.max(0,Math.round(stats.dodges||0));
  if(challenge.stat==='risk')return Math.max(0,Math.round(stats.risk||0));
  if(challenge.stat==='comeback')return Math.max(0,Math.round(stats.comeback||0));
  if(challenge.stat==='distance')return Math.max(0,Math.min(100,Math.round(runProgress01()*100)));
  if(challenge.stat==='cleanGood')return (badChoices||0)>0?0:Math.max(0,Math.round(goodChoices||0));
  return 0;
}
function renderDailyChallengeUI(){
  const info=ensureDailyChallengeState();
  const title=document.getElementById('daily-challenge-title');
  const text=document.getElementById('daily-challenge-text');
  const reward=document.getElementById('daily-challenge-reward');
  if(!info||!title||!text)return;
  const {state,challenge}=info;
  const target=challenge.targetValue;
  title.textContent=challenge.title;
  reward&&(reward.textContent='+'+challenge.reward+' coins + chest charge');
  if(state.completed){
    text.textContent='Completed today. New challenge tomorrow.';
    setBar('daily-challenge-fill',100);
  }else{
    text.textContent=challenge.desc+' 0/'+target;
    setBar('daily-challenge-fill',0);
  }
}
function updateResultDailyChallenge(kind){
  const el=document.getElementById(kind+'-daily-challenge');
  if(!el)return;
  el.classList.toggle('daily-complete',!!lastDailyChallengeCompleted);
  if(lastDailyChallengeCompleted){
    el.innerHTML='<span>DAILY COMPLETE</span> <b>+'+lastDailyChallengeReward+' COINS + CHEST</b>';
  }else{
    el.innerHTML='<span>DAILY '+(lastDailyChallengeProgressText||'0/1')+'</span> <b>'+(lastDailyChallengeTitle||'TRY TOMORROW')+'</b>';
  }
}
function checkDailyChallenge(win){
  lastDailyChallengeCompleted=false;lastDailyChallengeReward=0;lastDailyChallengeTitle='';lastDailyChallengeProgressText='';
  const info=ensureDailyChallengeState();
  if(!info)return 0;
  const {state,challenge}=info;
  const target=challenge.targetValue;
  const prog=Math.min(target,dailyChallengeProgress(challenge,win));
  lastDailyChallengeTitle=challenge.title;
  lastDailyChallengeProgressText=prog+'/'+target;
  if(state.completed){
    lastDailyChallengeTitle='Completed today';
    lastDailyChallengeProgressText='DONE';
    return 0;
  }
  if(prog>=target){
    state.completed=true;
    state.claimedAt=Date.now();
    lastDailyChallengeCompleted=true;
    lastDailyChallengeReward=challenge.reward;
    addCoins(challenge.reward,{silent:true});
    chargeSkinChestProgress(challenge.chestProgress||DAILY_CHALLENGE_CHEST_PROGRESS);
    floatTxt('DAILY +'+challenge.reward+' COINS',innerWidth*.5,innerHeight*.25,'#FFD740',34,'spin');
    rewardFlash('gold');shake(.36);
    return challenge.reward;
  }
  return 0;
}
function ensureMilestoneState(){
  if(!playerData||!playerData.content)return null;
  const state=playerData.content.milestones=Object.assign({claimed:{},best:0,totalBonus:0},playerData.content.milestones||{});
  state.claimed=Object.assign({},state.claimed||{});
  state.best=Math.max(0,Math.round(num(state.best,0)));
  state.totalBonus=Math.max(0,Math.round(num(state.totalBonus,0)));
  return state;
}
function nextCrowdMilestone(){
  const state=ensureMilestoneState();
  if(!state)return CROWD_MILESTONE_DEFS[0];
  return CROWD_MILESTONE_DEFS.find(def=>state.claimed[def.id]!==true)||null;
}
function renderCrowdMilestoneUI(){
  const card=document.getElementById('crowd-milestone-card');
  if(!card||!playerData)return;
  const state=ensureMilestoneState();
  const next=nextCrowdMilestone();
  const title=document.getElementById('crowd-milestone-title');
  const progress=document.getElementById('crowd-milestone-progress');
  const reward=document.getElementById('crowd-milestone-reward');
  const fill=document.getElementById('crowd-milestone-fill');
  card.classList.toggle('complete',!next);
  if(!next){
    if(title)title.textContent='All crowd milestones claimed';
    if(progress)progress.textContent='BEST '+Math.max(state.best,playerData.bestCrowd||0);
    if(reward)reward.textContent='+'+shortCoinAmount(state.totalBonus)+' earned';
    if(fill)fill.style.width='100%';
    return;
  }
  const best=Math.max(state.best,playerData.bestCrowd||0);
  const pct=Math.min(100,best/next.threshold*100);
  if(title)title.textContent='Reach '+next.threshold+' humans';
  if(progress)progress.textContent=Math.min(best,next.threshold)+'/'+next.threshold;
  if(reward)reward.textContent='+'+shortCoinAmount(next.bonus)+' coins';
  if(fill)fill.style.width=pct+'%';
}
function checkCrowdMilestoneRewards(){
  lastMilestoneBonus=0;lastMilestoneTitle='';lastMilestoneCount=0;lastMilestoneBest=0;
  const state=ensureMilestoneState();
  if(!state)return 0;
  const best=Math.max(0,Math.round(Math.max(peak||0,crowd||0)));
  state.best=Math.max(state.best,best);
  lastMilestoneBest=best;
  const earned=[];
  for(const def of CROWD_MILESTONE_DEFS){
    if(best>=def.threshold&&state.claimed[def.id]!==true){
      state.claimed[def.id]=true;
      earned.push(def);
    }
  }
  if(!earned.length)return 0;
  const total=earned.reduce((sum,def)=>sum+Math.max(0,Math.round(def.bonus||0)),0);
  state.totalBonus=Math.max(0,Math.round((state.totalBonus||0)+total));
  lastMilestoneBonus=total;
  lastMilestoneCount=earned.length;
  lastMilestoneTitle=earned[earned.length-1].title;
  addCoins(total,{silent:true});
  floatTxt('MILESTONE +'+total,innerWidth*.5,innerHeight*.24,'#FFD740',36,'spin');
  rewardFlash('gold');shake(.34);
  return total;
}
function updateResultMilestone(kind){
  const el=document.getElementById(kind+'-milestone-result');
  if(!el)return;
  el.classList.toggle('milestone-complete',lastMilestoneBonus>0);
  if(lastMilestoneBonus>0){
    el.innerHTML='<span>'+lastMilestoneTitle+'</span> <b>+'+lastMilestoneBonus+' COINS</b>';
  }else{
    const next=nextCrowdMilestone();
    if(next){
      const best=Math.max(lastMilestoneBest,playerData?playerData.bestCrowd||0:0);
      el.innerHTML='<span>MILESTONE '+Math.min(best,next.threshold)+'/'+next.threshold+'</span> <b>NEXT +'+next.bonus+'</b>';
    }else{
      el.innerHTML='<span>MILESTONES COMPLETE</span> <b>ALL CLAIMED</b>';
    }
  }
}
const WORLD_UNLOCK_INTERVAL=20;
const WORLD_DEFS=[
  {
    id:'mars',name:'Mercury',level:1,unlockLevel:1,color:'#D8E6FF',
    sky:'#071327',fog:'#16283A',road:'#17283E',edge:'#D8E6FF',dash:'#FFFFFF',good:'#7CFFEA',bad:'#FF5B5B',star:'#FFFFFF',planet:'#BFD7FF',accent:'#EAF4FF',
    fogDensity:.010,
    texture:'mercury_graphite',floorTexture:'mercury_graphite',skyType:'mercury_orbit',particleType:'stardust',backdrop:'mercury_orbit',roadStyle:'mercury_road',
    obstacleStyle:'rocks',gateStyle:'dust_gate',enemyStyle:'mars_enemy',visualMood:'graphite_mercury_orbit',
    teaserMessage:'Mercury orbit unlocked'
  },
  {
    id:'ice',name:'Venus',level:20,unlockLevel:20,color:'#FFC928',
    sky:'#241500',fog:'#5C3400',road:'#4A2E00',edge:'#FFC928',dash:'#FFF176',good:'#FFE66D',bad:'#FF5B5B',star:'#FFF4B8',planet:'#FFB000',accent:'#FFF176',
    fogDensity:.014,
    texture:'acid_bubbles',floorTexture:'acid_bubbles',skyType:'toxic_venus',particleType:'acid_rain',backdrop:'toxic_venus',roadStyle:'acid_road',
    obstacleStyle:'toxic_blocks',gateStyle:'acid_gate',enemyStyle:'toxic_enemy',visualMood:'golden_venus_pressure',
    teaserMessage:'Venus cloud route unlocked'
  },
  {
    id:'saturn',name:'Earth',level:40,unlockLevel:40,color:'#18A0FF',
    sky:'#041F34',fog:'#0A3D5F',road:'#073F35',edge:'#18A0FF',dash:'#7FDBFF',good:'#54F58B',bad:'#FF5B5B',star:'#D8F7FF',planet:'#1E88E5',accent:'#54F58B',
    fogDensity:.011,
    texture:'acid_bubbles',floorTexture:'acid_bubbles',skyType:'abyss_biolume',particleType:'bubbles_jellyfish',backdrop:'ocean_abyss',roadStyle:'abyss_road',
    obstacleStyle:'reef_blocks',gateStyle:'biolume_gate',enemyStyle:'abyss_enemy',visualMood:'blue_green_earth_orbit',
    teaserMessage:'Earth blue orbit unlocked'
  },
  {
    id:'toxic',name:'Mars',level:60,unlockLevel:60,color:'#FF5B2E',
    sky:'#1F0704',fog:'#4C1308',road:'#5A1B0C',edge:'#FF5B2E',dash:'#FFB84A',good:'#FFD166',bad:'#FF1744',star:'#FFD1A0',planet:'#E74725',accent:'#FFB84A',
    fogDensity:.010,
    texture:'mars_cracks',floorTexture:'mars_cracks',skyType:'dust_sky',particleType:'red_dust',backdrop:'mars_moons',roadStyle:'cracked_road',
    obstacleStyle:'rocks',gateStyle:'dust_gate',enemyStyle:'mars_enemy',visualMood:'red_mars_dust',
    teaserMessage:'Mars dust route unlocked'
  },
  {
    id:'cyber',name:'Jupiter',level:80,unlockLevel:80,color:'#FF9F3D',
    sky:'#180D04',fog:'#3E220A',road:'#4A2A12',edge:'#FF9F3D',dash:'#FFE0A6',good:'#FFD166',bad:'#FF4081',star:'#FFE6C4',planet:'#D9822B',accent:'#FFE0A6',
    fogDensity:.009,
    texture:'ring_stripes',floorTexture:'ring_stripes',skyType:'saturn_rings',particleType:'ring_debris',backdrop:'saturn_rings',roadStyle:'ring_road',
    obstacleStyle:'ring_rocks',gateStyle:'orbit_gate',enemyStyle:'saturn_enemy',visualMood:'amber_jupiter_storm',
    teaserMessage:'Jupiter storm route unlocked'
  },
  {
    id:'void',name:'Saturn',level:100,unlockLevel:100,color:'#FFE066',
    sky:'#09071F',fog:'#211C40',road:'#26204A',edge:'#FFE066',dash:'#FFF0B8',good:'#FFD740',bad:'#FF1744',star:'#FFF3C4',planet:'#FFD166',accent:'#C7A6FF',
    fogDensity:.009,
    texture:'ring_stripes',floorTexture:'ring_stripes',skyType:'saturn_rings',particleType:'ring_debris',backdrop:'saturn_rings',roadStyle:'ring_road',
    obstacleStyle:'ring_rocks',gateStyle:'orbit_gate',enemyStyle:'saturn_enemy',visualMood:'premium_saturn_rings',
    teaserMessage:'Saturn ring orbit unlocked'
  },
  {
    id:'neon_tokyo',name:'Uranus',level:120,unlockLevel:120,color:'#45F4FF',
    sky:'#031A22',fog:'#0A4050',road:'#0D4A56',edge:'#45F4FF',dash:'#D9FFFF',good:'#80F4FF',bad:'#FF1744',star:'#D9FFFF',planet:'#45F4FF',accent:'#B8FFF9',
    fogDensity:.008,
    texture:'ice_cracks',floorTexture:'ice_cracks',skyType:'frozen_moon',particleType:'snow',backdrop:'frozen_moon',roadStyle:'ice_road',
    obstacleStyle:'ice_blocks',gateStyle:'frost_gate',enemyStyle:'ice_enemy',visualMood:'pale_uranus_ice',
    teaserMessage:'Uranus ice orbit unlocked'
  },
  {
    id:'lava_core',name:'Neptune',level:140,unlockLevel:140,color:'#315CFF',
    sky:'#020817',fog:'#071A56',road:'#0C1C68',edge:'#315CFF',dash:'#8AA8FF',good:'#00E5FF',bad:'#FF1744',star:'#C8D8FF',planet:'#2446E8',accent:'#7DA2FF',
    fogDensity:.012,
    texture:'void_stars',floorTexture:'void_stars',skyType:'galaxy_void',particleType:'cosmic_dust',backdrop:'galaxy_void',roadStyle:'void_road',
    obstacleStyle:'void_shards',gateStyle:'star_gate',enemyStyle:'void_enemy',visualMood:'deep_neptune_wind',
    teaserMessage:'Neptune deep orbit unlocked'
  },
  {
    id:'ocean_abyss',name:'Pluto',level:160,unlockLevel:160,color:'#C66BFF',
    sky:'#10071C',fog:'#2A1642',road:'#321B50',edge:'#C66BFF',dash:'#F3E8FF',good:'#B388FF',bad:'#FF4081',star:'#F3E8FF',planet:'#A34DE8',accent:'#E8D5FF',
    fogDensity:.008,
    texture:'ice_cracks',floorTexture:'ice_cracks',skyType:'frozen_moon',particleType:'snow',backdrop:'frozen_moon',roadStyle:'ice_road',
    obstacleStyle:'ice_blocks',gateStyle:'frost_gate',enemyStyle:'ice_enemy',visualMood:'icy_pluto_edge',
    teaserMessage:'Pluto frost orbit unlocked'
  },
  {
    id:'crystal_realm',name:'Kepler 22b',level:180,unlockLevel:180,color:'#35F56D',
    sky:'#061F12',fog:'#0E3A22',road:'#123B23',edge:'#35F56D',dash:'#C8FFD6',good:'#7CFF8A',bad:'#FF5B5B',star:'#D9FFE2',planet:'#2DDA63',accent:'#B9FF6A',
    fogDensity:.010,
    texture:'green_world',floorTexture:'green_world',skyType:'green_orbit',particleType:'leaf_sparks',backdrop:'green_world',roadStyle:'green_road',
    obstacleStyle:'rocks',gateStyle:'dust_gate',enemyStyle:'mars_enemy',visualMood:'green_world_garden',
    teaserMessage:'Kepler 22b route unlocked'
  },
  {
    id:'digital_void',name:'Haumea',level:200,unlockLevel:200,color:'#FFB3D9',
    sky:'#160713',fog:'#3A1730',road:'#3E1C33',edge:'#FFB3D9',dash:'#FFFFFF',good:'#FFB6C8',bad:'#FF1744',star:'#FFF7F2',planet:'#F59AC7',accent:'#FFFFFF',
    fogDensity:.009,
    texture:'ring_stripes',floorTexture:'ring_stripes',skyType:'prism_sky',particleType:'crystal_shards',backdrop:'crystal_realm',roadStyle:'prism_road',
    obstacleStyle:'crystal_shards',gateStyle:'prism_gate',enemyStyle:'crystal_enemy',visualMood:'haumea_pearl_spin',
    teaserMessage:'Haumea pearl orbit unlocked'
  },
  {
    id:'cosmic_storm',name:'Sun',level:220,unlockLevel:220,color:'#FFD000',
    sky:'#1B0900',fog:'#4A1D00',road:'#4C2100',edge:'#FFD000',dash:'#FFF176',good:'#FFD740',bad:'#FF1744',star:'#FFFFFF',planet:'#FFB000',accent:'#FFF176',
    fogDensity:.012,
    texture:'void_stars',floorTexture:'void_stars',skyType:'cosmic_storm',particleType:'lightning_nebula',backdrop:'cosmic_storm',roadStyle:'storm_road',
    obstacleStyle:'void_shards',gateStyle:'storm_gate',enemyStyle:'storm_enemy',visualMood:'sun_finale_radiance',
    teaserMessage:'Sun finale unlocked'
  
  }
];
const V18_BALANCE={
  winBase:85,
  winLevel:14,
  failBase:32,
  failLevel:5,
  crowdWin:7.6,
  crowdFail:2.9,
  winBonus:90
};
const RUN_MODIFIERS=[
  {id:'rush',name:'Rush Road',short:'RUSH',desc:'Faster road, bigger payout',speedMul:1.08,gateSpacingMul:.94,rewardMult:1.08,accent:'#00E5FF'},
  {id:'rescue',name:'Rescue Signal',short:'RESCUE',desc:'One stronger comeback moment',speedMul:.98,gateSpacingMul:1.04,comebackBoost:8,rewardMult:1.03,accent:'#69F0AE'},
  {id:'focus',name:'Boss Focus',short:'FOCUS',desc:'Longer reflex window, smaller reward',speedMul:1,gateSpacingMul:1.02,bossMiniMs:90,bossMisses:1,rewardMult:.98,accent:'#EA80FC'},
  {id:'flow',name:'Flow Run',short:'FLOW',desc:'More breathing room for combos',speedMul:.96,gateSpacingMul:1.08,rewardMult:1.02,accent:'#80D8FF'}
];
const WORLD_TRAITS={
  mars:{name:'Mercury Dash',desc:'Rescue moments feel brighter and stronger.',comebackBoost:4,accent:'#D8E6FF'},
  ice:{name:'Venus Glow',desc:'Red gates are a little gentler.',badReduction:.06,accent:'#FFC928'},
  saturn:{name:'Earth Gift',desc:'Run rewards are slightly higher.',rewardMult:1.04,accent:'#18A0FF'},
  toxic:{name:'Mars Rally',desc:'Comeback rescue is stronger.',comebackBoost:7,accent:'#FF5B2E'},
  cyber:{name:'Jupiter Calm',desc:'Boss reflex timing is easier.',bossMiniMs:65,accent:'#FF9F3D'},
  void:{name:'Saturn Pull',desc:'Orbs are worth more during runs.',orbBonus:1,accent:'#FFE066'},
  neon_tokyo:{name:'Uranus Flow',desc:'More breathing room for combos.',gateSpacingMul:1.04,bossMiniMs:45,accent:'#45F4FF'},
  lava_core:{name:'Neptune Boost',desc:'Bigger reward with a trickier route.',rewardMult:1.07,badReduction:-.04,accent:'#315CFF'},
  ocean_abyss:{name:'Pluto Light',desc:'Orbs pull in extra humans.',orbEvery:4,comebackBoost:4,accent:'#C66BFF'},
  crystal_realm:{name:'Green Focus',desc:'Boss prompts stay readable for longer.',bossMiniMs:90,accent:'#35F56D'},
  digital_void:{name:'Haumea Spark',desc:'More breathing room for combos and boss prompts.',gateSpacingMul:1.03,bossMiniMs:70,accent:'#FFB3D9'},
  cosmic_storm:{name:'Sun Finale',desc:'A bright final reward with a brave boss challenge.',rewardMult:1.09,bossDebt:6,accent:'#FFD000'}
};
const SKIN_TRAITS={
  default:{name:'Balanced',desc:'No passive. Clean classic run.'},
  ice:{name:'Chill Guard',desc:'Red gates hurt 10% less.',badReduction:.10},
  fire:{name:'Spark Start',desc:'Good gates add a little extra crowd.',goodBonus:.06},
  robot:{name:'Scanner',desc:'Boss reflex timing is easier.',bossMiniMs:110},
  ninja:{name:'Clean Dodge',desc:'Obstacle dodges give bonus coins.',dodgeCoins:7},
  gold:{name:'Premium Loot',desc:'Run rewards are slightly higher.',rewardMult:1.05},
  toxic:{name:'Regen Boost',desc:'Comeback rescue gives extra humans.',comebackBoost:6},
  galaxy:{name:'Star Pull',desc:'Orbs are worth more during runs.',orbBonus:1},
  shadow:{name:'Boss Breaker',desc:'Perfect boss hits deal +1 damage.',bossDamage:1},
  plasma:{name:'Plasma Surge',desc:'Good gates add more humans.',goodBonus:.08},
  samurai:{name:'Blade Focus',desc:'Perfect boss hits deal +1 damage and dodges pay coins.',bossDamage:1,dodgeCoins:5},
  angel:{name:'Rescue Halo',desc:'Comeback rescue is stronger and red gates hurt less.',comebackBoost:10,badReduction:.05},
  demon:{name:'Inferno Payout',desc:'Run rewards are higher.',rewardMult:1.08},
  dragon:{name:'Scale Guard',desc:'Red gates hurt 12% less.',badReduction:.12},
  crystal:{name:'Prism Focus',desc:'Boss reflex timing is much easier.',bossMiniMs:130},
  thunder:{name:'Storm Breaker',desc:'Perfect boss hits deal +1 damage.',bossDamage:1},
  ghost:{name:'Phase Dodge',desc:'Obstacle dodges give bigger bonus coins.',dodgeCoins:12},
  alien:{name:'Core Mutation',desc:'Orbs are worth more and good gates add extra crowd.',orbBonus:1,goodBonus:.04},
  royal:{name:'Royal Bonus',desc:'Run rewards are higher.',rewardMult:1.07},
  pharaoh:{name:'Sun Relic',desc:'Orbs are worth much more during runs.',orbBonus:2},
  cyber_king:{name:'King Scanner',desc:'Boss reflex timing is greatly easier.',bossMiniMs:150},
  void_knight:{name:'Void Breaker',desc:'Perfect boss hits deal +1 damage.',bossDamage:1},
  frost_lord:{name:'Frost Wall',desc:'Red gates hurt 16% less.',badReduction:.16},
  solar_flare:{name:'Solar Charge',desc:'Good gates add a lot more humans.',goodBonus:.10},
  quantum_shift:{name:'Quantum Pull',desc:'Boss timing is easier and orbs are worth more.',bossMiniMs:100,orbBonus:1},
  mecha_gold:{name:'Mecha Loot',desc:'Run rewards are much higher.',rewardMult:1.10},
  crimson_reaper:{name:'Reaper Strike',desc:'Boss hits are stronger and rewards improve.',bossDamage:1,rewardMult:1.04},
  nebula_crown:{name:'Nebula Pull',desc:'Orbs are worth much more and boss timing is easier.',orbBonus:2,bossMiniMs:80},
  omega_prime:{name:'Omega Balance',desc:'Good gates, defense, and rewards all improve.',goodBonus:.08,badReduction:.08,rewardMult:1.06}
};
let playerData=null;
let selectedSkinId='default';
let lastRunReward=0,lastRunWin=false,runRewardGranted=false,currentRunLevel=1;
let lastRunStreakBefore=0,lastRunStreakAfter=0,lastRunStreakBonusCoins=0,lastRunStreakMultiplier=1,lastRunStreakBroken=false;
let lastDailyChallengeCompleted=false,lastDailyChallengeReward=0,lastDailyChallengeTitle='',lastDailyChallengeProgressText='';
let trialSkinId='',trialSkinActive=false,lastTrialSkinId='',lastTrialSkinName='';
let lastSkinChestBefore=0,lastSkinChestAfter=0,lastSkinChestAdvanced=false,skinRevealOpen=false,skinRevealSeq=0;
let matHuman=null,matHumanBody=null,matHumanSkin=null,matShoe=null,matBelt=null,skinTexCache={};

function freshData(){return{
  version:SAVE_VERSION,coins:250,level:1,bestCrowd:0,
  skins:{equipped:'default',owned:['default']},
  stats:{runs:0,wins:0,totalCoins:0},
  content:{missions:{},bossChestWins:0,runStreak:0,skinChest:{progress:0,pendingSkin:null,claimedAt:0,totalOpened:0},milestones:{claimed:{},best:0,totalBonus:0},daily:{lastClaimDate:'',streak:0,lastServerCheck:0,lastLocalTimestamp:0,lastLocalDate:'',lastClaimSource:''},dailyChallenge:{date:'',id:'',completed:false,claimedAt:0},nextRunGoal:null,unlockedWorlds:{mars:true},selectedWorld:'mars',newWorldId:null},
  flags:{sound:true,soundUserSet:false,haptic:true},
  meta:{createdAt:Date.now(),updatedAt:Date.now()}
};}
function readFirstSave(){
  const keys=[SAVE_KEY].concat(LEGACY_SAVE_KEYS);
  for(const key of keys){
    try{
      const raw=localStorage.getItem(key);
      if(raw)return{key,data:JSON.parse(raw)};
    }catch(e){}
  }
  return{key:null,data:null};
}
function num(v,fallback=0){v=Number(v);return Number.isFinite(v)?v:fallback;}
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function levelCurveValue(playerLv,earlyValues,afterStep,maxValue){
  playerLv=Math.max(1,Math.round(num(playerLv,1)));
  if(playerLv<=earlyValues.length)return earlyValues[playerLv-1];
  return Math.min(maxValue,earlyValues[earlyValues.length-1]+(playerLv-earlyValues.length)*afterStep);
}
function targetHumansCurve(playerLv){
  return levelCurveValue(playerLv,[120,130,145,160,175],8,240);
}
function requiredGoodCurve(playerLv){
  const v=levelCurveValue(playerLv,[.55,.64,.65,.67,.69],.012,.76);
  return Math.round(v*100)/100;
}
function bossMinAICurve(playerLv){
  return levelCurveValue(playerLv,[28,34,42,50,60],6,150);
}
function bossWinMultCurve(playerLv){
  const v=levelCurveValue(playerLv,[.36,.38,.40,.42,.44],.01,.56);
  return Math.round(v*100)/100;
}
function bossLoseMultCurve(playerLv){
  const v=levelCurveValue(playerLv,[1.18,1.25,1.33,1.42,1.52],.045,1.95);
  return Math.round(v*100)/100;
}
function pacingCurveValue(playerLv,earlyValues,afterStep,limitValue){
  playerLv=Math.max(1,Math.round(num(playerLv,1)));
  if(playerLv<=earlyValues.length)return earlyValues[playerLv-1];
  const raw=earlyValues[earlyValues.length-1]+(playerLv-earlyValues.length)*afterStep;
  return afterStep<0?Math.max(limitValue,raw):Math.min(limitValue,raw);
}
function runSpeedCurve(playerLv){
  const v=pacingCurveValue(playerLv,[.94,.98,1.00,1.02,1.04],.005,1.08);
  return Math.round(v*100)/100;
}
function runRampCurve(playerLv){
  const v=pacingCurveValue(playerLv,[.35,.65,.82,.94,1.00],0,1);
  return Math.round(v*100)/100;
}
function gateSpacingCurve(playerLv){
  const v=pacingCurveValue(playerLv,[1.18,1.08,1.03,1.00,.98],-.01,.92);
  return Math.round(v*100)/100;
}
function obstacleSpacingCurve(playerLv){
  const v=pacingCurveValue(playerLv,[1.35,1.35,1.24,1.16,1.10],-.015,1);
  return Math.round(v*100)/100;
}
function forcedSpacingCurve(playerLv){
  const v=pacingCurveValue(playerLv,[1.30,1.30,1.30,1.25,1.16],-.02,1);
  return Math.round(v*100)/100;
}
function firstGateZCurve(playerLv){return Math.round(pacingCurveValue(playerLv,[42,38,36,34,32],-1,30));}
function firstOrbZCurve(playerLv){return Math.round(pacingCurveValue(playerLv,[18,32,40,45,45],0,45));}
function firstObstacleZCurve(playerLv){return Math.round(pacingCurveValue(playerLv,[999999,150,126,106,90],-2,84));}
function firstForcedZCurve(playerLv){return Math.round(pacingCurveValue(playerLv,[999999,999999,999999,180,148],-4,118));}
function runDifficultyProfile(level){
  const playerLv=Math.max(1,Math.round(num(level || currentRunLevel || (playerData&&playerData.level) || 1,1)));
  const lv=gameplayDifficultyLevel(playerLv);
  const bonus=isBonusLevel(playerLv);
  return{
    level:lv,
    playerLevel:playerLv,
    bonusLevel:bonus,
    difficultyOffset:DIFFICULTY_LEVEL_OFFSET,
    allowGates:playerLv>=1,
    allowBadGates:playerLv>=1,
    allowObstacles:playerLv>=2,
    allowBossMini:playerLv>=3,
    allowForcedItems:playerLv>=4,
    allowMult:playerLv>=2,
    allowMaxGate:playerLv>=5,
    allowHeavyBad:playerLv>=4,
    allowDanger:playerLv>=5,
    speedMul:runSpeedCurve(playerLv),
    rampScale:runRampCurve(playerLv),
    gateSpacingMul:gateSpacingCurve(playerLv),
    obstacleSpacingMul:obstacleSpacingCurve(playerLv),
    forcedSpacingMul:forcedSpacingCurve(playerLv),
    firstGateZ:firstGateZCurve(playerLv),
    firstOrbZ:bonus?14:firstOrbZCurve(playerLv),
    firstObstacleZ:firstObstacleZCurve(playerLv),
    firstForcedZ:firstForcedZCurve(playerLv),
    previewSecondGateZ:firstGateZCurve(playerLv)+52,
    previewNextGateZ:firstGateZCurve(playerLv)+96,
    previewNextObstacleZ:firstObstacleZCurve(playerLv)>=999999?999999:firstObstacleZCurve(playerLv)+74,
    previewNextForcedZ:firstForcedZCurve(playerLv)>=999999?999999:firstForcedZCurve(playerLv)+70,
    targetHumans:targetHumansCurve(playerLv),
    requiredGood:requiredGoodCurve(playerLv),
    defaultGoodRatio:Math.max(.55,requiredGoodCurve(playerLv)-.03),
    bossMinAI:bossMinAICurve(playerLv),
    bossWinMult:bossWinMultCurve(playerLv),
    bossLoseMult:bossLoseMultCurve(playerLv),
    bossMiniMisses:lv<=5?5:lv<=8?4:3,
    bossMiniPerfectMs:lv<=5?420:lv<=8?370:340,
    bossMiniLateMs:lv<=5?920:lv<=8?820:760,
    lesson:bonus?'BONUS COIN LEVEL':playerLv<=1?'GOOD VS BAD':playerLv===2?'DODGE + COPY':playerLv===3?'REFLEX BOSS':playerLv===4?'POWER ITEMS':playerLv===5?'/2 GATES':'FULL RUN'
  };
}
function gateAllowedForProgression(g,profile){
  profile=profile||runDifficultyProfile();
  if(!g)return false;
  if(g.good){
    if(g.t==='mult'&&!profile.allowMult)return false;
    if(g.t==='mult'&&g.v>=3&&!profile.allowMaxGate)return false;
    if(g.t==='add'&&g.v>=100&&!profile.allowMaxGate)return false;
    if(g.t==='add'&&g.v>=50&&profile.level<4)return false;
    return true;
  }
  if(!profile.allowBadGates)return false;
  if(g.t==='double_bad')return !!profile.allowDanger;
  if((g.v||0)>=100)return !!profile.allowHeavyBad;
  if((g.v||0)>=50)return profile.level>=4;
  return true;
}
function initRunSpawnSchedule(){
  const profile=runDifficultyProfile();
  nextGateZ=profile.allowGates?(profile.firstGateZ||36):999999;
  nextOrbZ=profile.firstOrbZ||45;
  nextObstZ=profile.allowObstacles?(profile.firstObstacleZ||84):999999;
  nextForcedZ=profile.allowForcedItems?(profile.firstForcedZ||110):999999;
}
function sanitizeData(data){
  const base=freshData();
  data=data&&typeof data==='object'?data:{};
  const clean=Object.assign({},base,data);
  clean.version=SAVE_VERSION;
  clean.coins=Math.max(0,Math.round(num(clean.coins,base.coins)));
  clean.level=Math.max(1,Math.round(num(clean.level,base.level)));
  clean.bestCrowd=Math.max(0,Math.round(num(clean.bestCrowd,0)));
  clean.stats=Object.assign({},base.stats,data.stats||{});
  clean.stats.runs=Math.max(0,Math.round(num(clean.stats.runs,0)));
  clean.stats.wins=Math.max(0,Math.round(num(clean.stats.wins,0)));
  clean.stats.totalCoins=Math.max(0,Math.round(num(clean.stats.totalCoins,0)));
  clean.content=Object.assign({},base.content,data.content||{});
  clean.content.missions=Object.assign({},base.content.missions,(data.content&&data.content.missions)||{});
  clean.content.unlockedWorlds={mars:true};
  for(const w of WORLD_DEFS){
    if(clean.level>=(w.unlockLevel||w.level||1))clean.content.unlockedWorlds[w.id]=true;
  }
  let selectedWorldId=String(clean.content.selectedWorld||base.content.selectedWorld||'mars');
  let selectedWorld=WORLD_DEFS.find(w=>w.id===selectedWorldId);
  if(!selectedWorld||!clean.content.unlockedWorlds[selectedWorld.id]){
    selectedWorld=WORLD_DEFS[0];
    for(const w of WORLD_DEFS){
      if(clean.content.unlockedWorlds[w.id])selectedWorld=w;
    }
  }
  clean.content.selectedWorld=(selectedWorld&&selectedWorld.id)||'mars';
  const newWorldId=String(clean.content.newWorldId||'');
  const newWorld=WORLD_DEFS.find(w=>w.id===newWorldId);
  clean.content.newWorldId=(newWorld&&clean.content.unlockedWorlds[newWorld.id]&&newWorld.id!==clean.content.selectedWorld)?newWorld.id:null;
  clean.content.bossChestWins=clamp(Math.round(num(clean.content.bossChestWins,0)),0,3);
  clean.content.runStreak=Math.max(0,Math.min(999,Math.round(num(clean.content.runStreak,0))));
  const hasSavedMilestones=!!(data.content&&data.content.milestones);
  const rawMilestones=(data.content&&data.content.milestones)||clean.content.milestones||base.content.milestones;
  clean.content.milestones=Object.assign({},base.content.milestones,rawMilestones||{});
  clean.content.milestones.claimed=Object.assign({},base.content.milestones.claimed,(rawMilestones&&rawMilestones.claimed)||{});
  clean.content.milestones.best=Math.max(0,Math.round(hasSavedMilestones?num(clean.content.milestones.best,0):num(clean.bestCrowd,0)));
  clean.content.milestones.totalBonus=Math.max(0,Math.round(num(clean.content.milestones.totalBonus,0)));
  for(const def of CROWD_MILESTONE_DEFS){
    if(clean.content.milestones.claimed[def.id]!==true)delete clean.content.milestones.claimed[def.id];
    if(clean.content.milestones.best>=def.threshold)clean.content.milestones.claimed[def.id]=true;
  }
  const rawSkinChest=(data.content&&data.content.skinChest)||clean.content.skinChest||base.content.skinChest;
  clean.content.skinChest=Object.assign({},base.content.skinChest,rawSkinChest||{});
  clean.content.skinChest.progress=clamp(Math.round(num(clean.content.skinChest.progress,0)),0,100);
  const pendingSkin=String(clean.content.skinChest.pendingSkin||'');
  clean.content.skinChest.pendingSkin=SKINS.some(s=>s.id===pendingSkin&&s.id!=='default')?pendingSkin:null;
  clean.content.skinChest.claimedAt=Math.max(0,Math.round(num(clean.content.skinChest.claimedAt,0)));
  clean.content.skinChest.totalOpened=Math.max(0,Math.round(num(clean.content.skinChest.totalOpened,0)));
  clean.content.daily=Object.assign({},base.content.daily,(data.content&&data.content.daily)||{});
  clean.content.daily.lastClaimDate=String(clean.content.daily.lastClaimDate||'');
  clean.content.daily.streak=Math.max(0,Math.round(num(clean.content.daily.streak,0)));
  clean.content.daily.lastServerCheck=Math.max(0,Math.round(num(clean.content.daily.lastServerCheck,0)));
  clean.content.daily.lastLocalTimestamp=Math.max(0,Math.round(num(clean.content.daily.lastLocalTimestamp,0)));
  clean.content.daily.lastLocalDate=String(clean.content.daily.lastLocalDate||'');
  clean.content.daily.lastClaimSource=String(clean.content.daily.lastClaimSource||'');
  clean.content.dailyChallenge=Object.assign({},base.content.dailyChallenge,(data.content&&data.content.dailyChallenge)||{});
  clean.content.dailyChallenge.date=String(clean.content.dailyChallenge.date||'');
  clean.content.dailyChallenge.id=String(clean.content.dailyChallenge.id||'');
  clean.content.dailyChallenge.completed=clean.content.dailyChallenge.completed===true;
  clean.content.dailyChallenge.claimedAt=Math.max(0,Math.round(num(clean.content.dailyChallenge.claimedAt,0)));
  const rawGoal=(data.content&&data.content.nextRunGoal)||clean.content.nextRunGoal||null;
  if(rawGoal&&typeof rawGoal==='object'&&['crowd','combo','good','win'].includes(rawGoal.id)){
    clean.content.nextRunGoal={id:rawGoal.id,target:Math.max(1,Math.round(num(rawGoal.target,1))),reward:Math.max(50,Math.round(num(rawGoal.reward,150)))};
  }else{
    clean.content.nextRunGoal=null;
  }
  clean.flags=Object.assign({},base.flags,data.flags||{});
  // V75 sensory migration: older saves carried sound:false only because no sound engine existed yet.
  // Once the user manually toggles sound, soundUserSet preserves their real preference.
  clean.flags.soundUserSet=clean.flags.soundUserSet===true;
  if(clean.flags.soundUserSet!==true && data.flags && data.flags.sound===false)clean.flags.sound=true;
  if(typeof clean.flags.sound!=='boolean')clean.flags.sound=true;
  if(typeof clean.flags.haptic!=='boolean')clean.flags.haptic=true;
  clean.meta=Object.assign({},base.meta,data.meta||{});
  clean.meta.updatedAt=Date.now();
  clean.skins=Object.assign({},base.skins,data.skins||{});
  let owned=Array.isArray(clean.skins.owned)?clean.skins.owned.slice():['default'];
  owned=owned.filter((id,i,arr)=>SKINS.some(s=>s.id===id)&&arr.indexOf(id)===i);
  if(!owned.includes('default'))owned.unshift('default');
  clean.skins.owned=owned;
  if(!SKINS.some(s=>s.id===clean.skins.equipped)||!owned.includes(clean.skins.equipped))clean.skins.equipped='default';
  return clean;
}
function seedUnlockedWorldsForCurrentLevel(){
  if(!playerData||!playerData.content)return;
  playerData.content.unlockedWorlds=playerData.content.unlockedWorlds||{};
  for(const w of WORLD_DEFS){
    if((playerData.level||1)>=w.level)playerData.content.unlockedWorlds[w.id]=true;
  }
}
function loadGame(){
  const found=readFirstSave();
  playerData=sanitizeData(found.data||freshData());
  seedUnlockedWorldsForCurrentLevel();
  ensureNextRunGoal();
  selectedSkinId=playerData.skins.equipped;
  // Save once under the V19 key so old V13-V17 saves migrate safely.
  saveGame();
}
function saveGame(){
  try{
    if(!playerData)return;
    playerData=sanitizeData(playerData);
    playerData.meta.updatedAt=Date.now();
    localStorage.setItem(SAVE_KEY,JSON.stringify(playerData));
  }catch(e){}
}
function resetMetaProgress(){
  playerData=freshData();selectedSkinId='default';saveGame();applyEquippedSkin();refreshMetaUI();
}

function coinFxLayer(){
  let layer=document.getElementById('coin-fx-layer');
  if(layer)return layer;
  layer=document.createElement('div');
  layer.id='coin-fx-layer';
  layer.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:260;overflow:hidden';
  document.body.appendChild(layer);
  return layer;
}
function appendCoinFxNode(node){
  const layer=coinFxLayer();
  layer.appendChild(node);
  if(layer.children.length>80){
    Array.from(layer.children).slice(0,40).forEach(el=>el.remove());
  }
}

/* V48 UNIVERSAL COIN FLOW â€” gain: source â†’ wallet, spend: wallet â†’ clicked thing */
const CoinFX={
  lastClickEl:null,
  lastClickAt:0,
  clickSelectors:'.skin-card,.shop-action,.content-btn,.dev-tools-btn,.daily-card,.chest-card,.result-coins,.result-goal,.result-daily-challenge,.result-combo,.result-close-hook,.result-chest,.result-wallet,.meta-pill,.side-btn,.shop-tab,.next-run-goal-card',
  remember(el){
    if(!el)return;
    this.lastClickEl=el;
    this.lastClickAt=performance.now();
  },
  freshClick(maxAge){
    return (this.lastClickEl && performance.now()-this.lastClickAt<(maxAge||1500)) ? this.lastClickEl : null;
  },
  _visCache:new WeakMap(),
  visible(el){
    if(!el || !el.getBoundingClientRect)return false;
    // Cache result for 200 ms to avoid forced layout on every coin animation tick
    const now=performance.now();
    const cached=this._visCache.get(el);
    if(cached && now-cached.t < 200) return cached.v;
    const r=el.getBoundingClientRect();
    if(!r.width || !r.height){ this._visCache.set(el,{v:false,t:now}); return false; }
    const st=getComputedStyle(el);
    const v=st.display!=='none' && st.visibility!=='hidden' && Number(st.opacity||1)>0;
    this._visCache.set(el,{v,t:now});
    return v;
  },
  activeWallet(){
    const ids=['win-total-wallet','over-total-wallet','shop-coins','ui-coins'];
    for(const id of ids){
      const el=document.getElementById(id);
      if(this.visible(el))return el;
    }
    return document.getElementById('ui-coins')||document.getElementById('shop-coins');
  },
  center(el,fallback){
    if(!this.visible(el))return fallback||{x:innerWidth*.5,y:innerHeight*.5};
    const r=el.getBoundingClientRect();
    return {x:r.left+r.width/2,y:r.top+r.height/2};
  },
  pulse(el,cls){
    if(!el)return;
    const target=el.closest('.result-wallet,.meta-pill,.skin-card,.shop-action,.dev-tools-btn,.content-btn,.side-btn')||el;
    target.classList.remove(cls||'coin-flow-pop');
    void target.offsetWidth;
    target.classList.add(cls||'coin-flow-pop');
    setTimeout(()=>target.classList.remove(cls||'coin-flow-pop'),720);
  },
  fly(fromEl,toEl,amount,opts){
    opts=opts||{};
    if(!fromEl||!toEl||!this.visible(toEl))return;
    if(!this.visible(fromEl))fromEl=this.freshClick(1800)||fromEl;
    if(!this.visible(fromEl))return;
    const from=this.center(fromEl),to=this.center(toEl);
    const n=Math.max(1,Math.round(Number(amount)||1));
    const count=opts.count||Math.min(22,Math.max(8,Math.round(n/(opts.spend?85:95))));
    const duration=opts.duration||980;
    const spread=opts.spend?18:48;
    this.pulse(fromEl,opts.spend?'coin-flow-pop':'coin-flow-pop');
    for(let i=0;i<count;i++){
      const c=document.createElement('span');
      c.className='fly-coin icon-coin coin-flow-coin';
      const sx=from.x+(Math.random()-.5)*spread;
      const sy=from.y+(Math.random()-.5)*spread;
      c.style.left=sx+'px';
      c.style.top=sy+'px';
      c.style.transform='translate(-50%,-50%) scale('+(opts.spend?'.88':'1')+')';
      c.style.transition='transform '+duration+'ms cubic-bezier(.18,.82,.22,1), opacity '+duration+'ms ease-out';
      c.style.transitionDelay=(i*(opts.spend?24:34))+'ms';
      appendCoinFxNode(c);
      const dx=to.x-sx,dy=to.y-sy;
      requestAnimationFrame(()=>{
        c.style.transform='translate(calc(-50% + '+dx+'px), calc(-50% + '+dy+'px)) scale('+(opts.spend?'.42':'.36')+')';
        c.style.opacity=opts.spend?'.16':'.18';
      });
      setTimeout(()=>c.remove(),duration+420+i*(opts.spend?24:34));
    }
    setTimeout(()=>this.pulse(toEl,opts.spend?'coin-spend-target':'coin-flow-pop'),duration-150);
  },
  gain(amount,source){
    const wallet=this.activeWallet();
    if(!wallet)return;
    const from=source||this.freshClick(1400);
    if(!from)return;
    this.fly(from,wallet,amount,{spend:false});
  },
  spend(amount,target){
    const wallet=this.activeWallet();
    const to=target||this.freshClick(1800);
    if(!wallet||!to)return;
    this.fly(wallet,to,amount,{spend:true,count:Math.min(18,Math.max(7,Math.round((Number(amount)||1)/110))),duration:920});
  }
};
document.addEventListener('pointerdown',e=>{
  const el=e.target&&e.target.closest?e.target.closest(CoinFX.clickSelectors):null;
  if(el)CoinFX.remember(el);
},{capture:true,passive:true});

const IS_LOCAL_DEV = location.hostname==='localhost' || location.hostname==='127.0.0.1' || location.search.includes('devmode=true');
const AdManager={
  watchedThisSession:0,
  lastAdTime:0,
  intent:'',
  MAX_ADS_PER_SESSION:5,
  MIN_GAP_BETWEEN_ADS:60000,
  canShow(){
    const now=Date.now();
    return this.watchedThisSession<this.MAX_ADS_PER_SESSION && (now-this.lastAdTime)>this.MIN_GAP_BETWEEN_ADS;
  },
  record(){
    this.watchedThisSession++;
    this.lastAdTime=Date.now();
  },
  muted:false,
  muteAudio(){
    if(this.muted)return;
    this.muted=true;
    try{if(Sensory.master)Sensory.master.gain.value=0.0001;}catch(e){}
  },
  restoreAudio(){
    if(!this.muted)return;
    this.muted=false;
    try{if(Sensory.master)Sensory.master.gain.value=0.22;}catch(e){}
  }
};
const REWARDED_AD_SECONDS=3;
let rewardedAdTimer=0;
let rewardedAdEndsAt=0;
let rewardedAdRaf=0;
function rewardedAdContextLabel(context){
  const ctx=String(context||'').replace(/_/g,' ').trim();
  if(!ctx)return 'REWARDED AD';
  if(ctx==='resurrect')return 'REVIVE AD';
  if(ctx==='bonus boost')return 'BONUS AD';
  if(ctx==='skin trial')return 'TRIAL AD';
  return ctx.toUpperCase()+' AD';
}
function renderRewardedAdTimer(){
  const overlay=document.getElementById('rewarded-ad-overlay');
  if(!overlay||!rewardedAdEndsAt)return;
  const now=performance&&performance.now?performance.now():Date.now();
  const left=Math.max(0,rewardedAdEndsAt-now);
  const pct=rewardedAdTimer>0?left/rewardedAdTimer:0;
  const count=document.getElementById('rewarded-ad-count');
  const fill=document.getElementById('rewarded-ad-fill');
  if(count)count.textContent=String(Math.max(1,Math.ceil(left/1000)));
  if(fill)fill.style.transform='scaleX('+Math.max(0,Math.min(1,pct))+')';
  if(left>0){
    rewardedAdRaf=requestAnimationFrame(renderRewardedAdTimer);
  }
}
function showRewardedAdOverlay(context,seconds){
  const overlay=document.getElementById('rewarded-ad-overlay');
  if(!overlay)return;
  hideRewardedAdOverlay(false);
  const duration=Math.max(900,Math.round((seconds||REWARDED_AD_SECONDS)*1000));
  rewardedAdTimer=duration;
  rewardedAdEndsAt=(performance&&performance.now?performance.now():Date.now())+duration;
  const kicker=document.getElementById('rewarded-ad-kicker');
  const sub=document.getElementById('rewarded-ad-sub');
  const fill=document.getElementById('rewarded-ad-fill');
  if(kicker)kicker.textContent=rewardedAdContextLabel(context);
  if(sub)sub.textContent='Reward in '+Math.ceil(duration/1000)+' seconds.';
  if(fill)fill.style.transform='scaleX(1)';
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden','false');
  renderRewardedAdTimer();
}
function hideRewardedAdOverlay(reset){
  if(rewardedAdRaf){
    cancelAnimationFrame(rewardedAdRaf);
    rewardedAdRaf=0;
  }
  if(reset!==false){
    rewardedAdTimer=0;
    rewardedAdEndsAt=0;
  }
  const overlay=document.getElementById('rewarded-ad-overlay');
  if(overlay){
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden','true');
  }
}
function showRewardedAd(opts){
  opts=opts||{};
  AdManager.intent=opts.context||'unknown';
  if(!AdManager.canShow()){
    hideRewardedAdOverlay();
    if(opts.onFail)opts.onFail('frequency_limit');
    return;
  }
  const complete=()=>{
    AdManager.record();
    AdManager.restoreAudio();
    hideRewardedAdOverlay();
    if(opts.onComplete)opts.onComplete();
  };
  const fail=(reason)=>{
    AdManager.restoreAudio();
    hideRewardedAdOverlay();
    if(opts.onFail)opts.onFail(reason||'ad_error');
  };
  const sdk=window.CrazyGames&&window.CrazyGames.SDK;
  if(sdk&&sdk.ad&&typeof sdk.ad.requestAd==='function'){
    AdManager.muteAudio();
    showRewardedAdOverlay(opts.context,REWARDED_AD_SECONDS);
    try{
      sdk.ad.requestAd('rewarded',{
        adStarted:()=>showRewardedAdOverlay(opts.context,REWARDED_AD_SECONDS),
        adFinished:complete,
        adError:()=>fail('ad_error')
      });
    }catch(e){fail('ad_exception');}
    return;
  }
  if(IS_LOCAL_DEV){
    AdManager.muteAudio();
    showRewardedAdOverlay(opts.context,REWARDED_AD_SECONDS);
    setTimeout(complete,REWARDED_AD_SECONDS*1000);
  }else{
    fail('sdk_unavailable');
  }
}
window.AdManager=AdManager;
window.showRewardedAd=showRewardedAd;

function addCoins(amount,sourceOrOptions){
  if(!playerData)return 0;
  const v=Math.max(0,Math.round(num(amount,0)));
  const opts=(sourceOrOptions&&sourceOrOptions.nodeType)?{source:sourceOrOptions}:(sourceOrOptions||{});
  playerData.coins=Math.max(0,Math.round(num(playerData.coins,0)+v));
  playerData.stats.totalCoins=Math.max(0,Math.round(num(playerData.stats.totalCoins,0)+v));
  const resultFlow=(typeof gState!=='undefined')&&['CELEBRATE','GAMEOVER','POST_DANCE_RUN','WIN'].includes(gState);
  if(v>0 && !opts.silent && !(resultFlow&&!opts.source)){
    setTimeout(()=>CoinFX.gain(v,opts.source),30);
  }
  return v;
}
function spendCoins(amount,targetOrOptions){
  if(!playerData)return false;
  const cost=Math.max(0,Math.round(num(amount,0)));
  const opts=(targetOrOptions&&targetOrOptions.nodeType)?{target:targetOrOptions}:(targetOrOptions||{});
  if(playerData.coins<cost)return false;
  playerData.coins=Math.max(0,playerData.coins-cost);
  if(cost>0 && !opts.silent){
    setTimeout(()=>CoinFX.spend(cost,opts.target),20);
  }
  return true;
}
function unlockSkin(id){
  const s=skinById(id);
  if(!s)return false;
  if(!playerData.skins.owned.includes(s.id))playerData.skins.owned.push(s.id);
  return true;
}
function equipSkin(id){
  const s=skinById(id);
  if(!s||!ownsSkin(s.id))return false;
  playerData.skins.equipped=s.id;selectedSkinId=s.id;return true;
}
function saveAndRefresh(){saveGame();refreshMetaUI();}


const SaveManager={load:loadGame,save:saveGame,reset:resetMetaProgress,sanitize:sanitizeData};
const EconomyManager={add:addCoins,spend:spendCoins,canAfford:(cost)=>!!playerData&&playerData.coins>=cost,reward:calcRunReward};
const SkinManager={list:SKINS,byId:skinById,owns:ownsSkin,unlock:unlockSkin,equip:equipSkin,active:()=>skinById(activeRunSkinId())};
const MissionManager={defs:MISSION_DEFS,check:checkMissions,render:renderMissions};
const ChestManager={progress:bossChestProgress,open:claimBossChest};
const WorldManager={defs:WORLD_DEFS,current:currentWorldDef,next:nextWorldDef};
const UIManager={refresh:refreshMetaUI,shop:renderShop,content:renderContentUI,popup:showChestPopup};
function skinById(id){return SKINS.find(s=>s.id===id)||SKINS[0];}
function ownsSkin(id){return playerData&&playerData.skins.owned.includes(id);}
function activeRunSkinId(){
  if(trialSkinActive&&trialSkinId){
    const trial=skinById(trialSkinId);
    if(trial&&trial.id===trialSkinId)return trial.id;
  }
  return (playerData&&playerData.skins&&playerData.skins.equipped)||'default';
}
function activeSkinTrait(id){
  const key=id || activeRunSkinId();
  return SKIN_TRAITS[key]||SKIN_TRAITS.default;
}
function activeWorldTrait(w){
  const world=w || (typeof selectedWorldDef==='function'?selectedWorldDef():null) || (typeof currentWorldDef==='function'?currentWorldDef():null);
  return WORLD_TRAITS[(world&&world.id)||'mars']||WORLD_TRAITS.mars;
}
function runModifierSeed(){
  const runs=playerData&&playerData.stats?Math.max(0,Math.round(playerData.stats.runs||0)):0;
  const level=playerData?Math.max(1,Math.round(playerData.level||1)):1;
  const world=(typeof selectedWorldDef==='function'?selectedWorldDef():null)||WORLD_DEFS[0];
  const wIdx=Math.max(0,WORLD_DEFS.findIndex(w=>w.id===(world&&world.id)));
  return runs+level*3+wIdx*5;
}
function predictedRunModifier(){
  return RUN_MODIFIERS[runModifierSeed()%RUN_MODIFIERS.length]||RUN_MODIFIERS[0];
}
function microGoalTemplates(mod){
  const level=playerData?Math.max(1,playerData.level||1):1;
  return [
    {id:'good',title:'Good Gates',target:level>=10?5:4,reward:45+Math.min(80,level*4),stat:'good'},
    {id:'orbs',title:'Collect Orbs',target:level>=8?16:12,reward:35+Math.min(70,level*3),stat:'orbs'},
    {id:'combo',title:'Combo x'+(level>=10?6:5),target:level>=10?6:5,reward:55+Math.min(85,level*4),stat:'combo'},
    {id:'crowd',title:'Reach Crowd',target:Math.min(220,70+level*8),reward:60+Math.min(100,level*4),stat:'crowd'},
    {id:'dodge',title:'Clean Dodges',target:2,reward:45+Math.min(75,level*4),stat:'dodges',minLevel:2},
    {id:'win',title:'Beat Boss',target:1,reward:90+Math.min(140,level*6),stat:'win'}
  ].filter(g=>(!g.minLevel||level>=g.minLevel)&&g.enabled!==false);
}
function buildMicroGoalSet(mod){
  const pool=microGoalTemplates(mod);
  if(!pool.length)return [];
  const seed=runModifierSeed()+((mod&&RUN_MODIFIERS.findIndex(x=>x.id===mod.id))||0);
  const out=[];
  for(let i=0;out.length<3&&i<pool.length*2;i++){
    const g=pool[(seed+i*2)%pool.length];
    if(!out.some(x=>x.id===g.id))out.push(Object.assign({progress:0,complete:false},g));
  }
  return out.slice(0,3);
}
function microGoalProgress(goal,win){
  if(!goal)return 0;
  const stats=runStats||{};
  if(goal.stat==='good')return Math.max(0,Math.round(stats.good||0));
  if(goal.stat==='orbs')return Math.max(0,Math.round(stats.orbs||0));
  if(goal.stat==='combo')return Math.max(0,Math.round(maxComboThisRun||combo||0));
  if(goal.stat==='crowd')return Math.max(0,Math.round(peak||crowd||0));
  if(goal.stat==='dodges')return Math.max(0,Math.round(stats.dodges||0));
  if(goal.stat==='risk')return Math.max(0,Math.round(stats.risk||0));
  if(goal.stat==='win')return win?1:0;
  return 0;
}
function microGoalLine(goal,win){
  const p=Math.min(goal.target,microGoalProgress(goal,win));
  return goal.title+' '+p+'/'+goal.target;
}
function renderFreshnessMenu(){
  const mod=(gState==='RUNNING'||gState==='BOSS')&&activeRunModifier?activeRunModifier:predictedRunModifier();
  const trait=activeWorldTrait();
  const skin=activeSkinTrait();
  const sub=document.getElementById('menu-run-modifier');
  if(sub)sub.textContent=(mod?mod.name:'Fresh Run')+' - '+(trait&&trait.name?trait.name:'World Trait');
  const chip=document.querySelector('#s-menu .season-chip');
  if(chip)chip.textContent=(mod&&mod.short?mod.short:'FRESH')+' RUN';
  const list=document.getElementById('session-goals-list');
  if(list){
    const liveGoals=(gState==='RUNNING'||gState==='BOSS')&&activeMicroGoals&&activeMicroGoals.length;
    const goals=liveGoals?activeMicroGoals:buildMicroGoalSet(mod);
    list.innerHTML='';
    const rows=[
      {k:'MOD',t:mod?mod.desc:'New twist every run',c:mod&&mod.accent},
      {k:'WORLD',t:trait?trait.desc:'World trait active',c:trait&&trait.accent},
      {k:'SKIN',t:skin?skin.desc:'Skin passive active',c:skin&&skin.accent}
    ];
    goals.slice(0,2).forEach(g=>rows.push({k:'GOAL',t:g.title+' +'+g.reward,c:'#69F0AE'}));
    rows.slice(0,5).forEach(r=>{
      const el=document.createElement('div');
      el.className='session-goal-row';
      if(r.c){el.style.setProperty('--freshAccent',r.c);setColorAlphaVars(el,'freshAccent',r.c,[.26,.28,.55]);}
      el.innerHTML='<b>'+r.k+'</b><span>'+r.t+'</span>';
      list.appendChild(el);
    });
  }
}
function renderFreshnessHUD(win){
 
  if(!hud)return;
  const active=gState==='RUNNING'||gState==='BOSS';
  hud.classList.toggle('show',active);
  if(!active)return;
  const mod=activeRunModifier||predictedRunModifier();
  const label=document.getElementById('fresh-mod-label');
  if(label){
    label.textContent=(mod&&mod.short?mod.short:'FRESH')+' - '+(activeWorldTrait().name||'WORLD');
    const freshAccent=(mod&&mod.accent)||activeWorldTrait().accent||'#00E5FF';
    label.style.setProperty('--freshAccent',freshAccent);
    setColorAlphaVars(label,'freshAccent',freshAccent,[.26,.28,.55]);
  }
  const list=document.getElementById('fresh-goals-live');
  if(list){
    list.innerHTML='';
    activeMicroGoals.slice(0,3).forEach(g=>{
      const p=Math.min(g.target,microGoalProgress(g,win));
      const item=document.createElement('div');
      item.className='fresh-goal'+(g.complete?' done':'');
      item.innerHTML='<span>'+g.title+'</span><b>'+p+'/'+g.target+'</b>';
      list.appendChild(item);
    });
  }
}
function resetFreshnessRunState(){
  activeRunModifier=null;
  activeMicroGoals=[];
  runStats={good:0,bad:0,orbs:0,dodges:0,risk:0,comeback:0};
  freshnessBonusCoinsThisRun=0;
  riskDebtThisRun=0;
  runPacingBeat=0;
  comebackUsed=false;
  lastFreshnessResultText='';
  document.body.classList.remove('run-mod-rush','run-mod-rescue','run-mod-bounty','run-mod-focus','run-mod-flow');
}
function startFreshnessRun(){
  resetFreshnessRunState();
  activeRunModifier=predictedRunModifier();
  activeMicroGoals=buildMicroGoalSet(activeRunModifier);
  if(activeRunModifier)document.body.classList.add('run-mod-'+activeRunModifier.id);
  renderFreshnessHUD();
  renderFreshnessMenu();
  setTimeout(()=>{
    if(gState==='RUNNING'&&activeRunModifier){
      phaseFlash(activeRunModifier.name.toUpperCase());
      floatTxt(activeRunModifier.short+' RUN',innerWidth*.5,innerHeight*.36,activeRunModifier.accent||'#00E5FF',38,'streak');
    }
  },520);
}
function freshnessRewardMultiplier(){
  const mod=activeRunModifier||null;
  const skin=activeSkinTrait();
  const trait=activeWorldTrait();
  let mult=1;
  if(mod&&mod.rewardMult)mult*=mod.rewardMult;
  if(skin&&skin.rewardMult)mult*=skin.rewardMult;
  if(trait&&trait.rewardMult)mult*=trait.rewardMult;
  return Math.max(.85,Math.min(1.25,mult));
}
function freshnessSpeedMultiplier(){
  const mod=activeRunModifier||null,trait=activeWorldTrait();
  return (mod&&mod.speedMul?mod.speedMul:1)*(trait&&trait.speedMul?trait.speedMul:1);
}
function freshnessGateSpacingMultiplier(){
  const mod=activeRunModifier||null,trait=activeWorldTrait();
  return (mod&&mod.gateSpacingMul?mod.gateSpacingMul:1)*(trait&&trait.gateSpacingMul?trait.gateSpacingMul:1);
}
function freshnessBossMsBonus(){
  const mod=activeRunModifier||null,trait=activeWorldTrait(),skin=activeSkinTrait();
  return (mod&&mod.bossMiniMs||0)+(trait&&trait.bossMiniMs||0)+(skin&&skin.bossMiniMs||0);
}
function freshnessBossMissBonus(){
  const mod=activeRunModifier||null;
  return mod&&mod.bossMisses?mod.bossMisses:0;
}
function badGateLossMultiplier(){
  const skin=activeSkinTrait(),trait=activeWorldTrait();
  return Math.max(.70,1-(skin&&skin.badReduction||0)-(trait&&trait.badReduction||0));
}
function goodGateGainMultiplier(){
  const skin=activeSkinTrait();
  return 1+(skin&&skin.goodBonus||0);
}
function orbPickupBonus(){
  const skin=activeSkinTrait(),trait=activeWorldTrait();
  let bonus=skin&&skin.orbBonus?skin.orbBonus:0;
  if(trait&&trait.orbEvery&&runStats&&(runStats.orbs||0)>0&&(runStats.orbs||0)%trait.orbEvery===0)bonus+=1;
  return bonus;
}
function addCrowdMembers(gain){
  gain=Math.max(0,Math.round(gain||0));
  if(gain<=0)return;
  const n2=members.length;
  const golden=2.399963229;
  const scale=Math.sqrt(n2+gain)*.50;
  for(let g=0;g<gain;g++){
    const r=Math.sqrt((n2+g+.5)/(n2+gain))*scale;
    const theta=(n2+g)*golden;
    members.push({ox:r*Math.cos(theta),oz:r*Math.sin(theta)*.7,ph:((n2+g)*.618)*Math.PI*2});
  }
}
function recordFreshEvent(kind,amount,win){
  if(!runStats)runStats={good:0,bad:0,orbs:0,dodges:0,risk:0,comeback:0};
  if(kind&&Object.prototype.hasOwnProperty.call(runStats,kind))runStats[kind]+=Math.max(1,Math.round(amount||1));
  checkMicroGoals(win);
  renderFreshnessHUD(win);
}
function checkMicroGoals(win){
  if(!activeMicroGoals||!activeMicroGoals.length)return;
  activeMicroGoals.forEach(g=>{
    g.progress=microGoalProgress(g,win);
    if(!g.complete&&g.progress>=g.target){
      g.complete=true;
      const reward=Math.max(0,Math.round(g.reward||0));
      if(reward>0){
         
        floatTxt(g.title.toUpperCase()+' +'+reward,innerWidth*.5,innerHeight*.30,'#69F0AE',28,'streak');
        rewardFlash('green');
      }
      if(window.Sensory)Sensory.play('combo',{combo:4});
      if(window.Haptic)Haptic.pulse('combo');
    }
  });
}
function maybeTriggerComebackEvent(cz){
  if(comebackUsed||gState!=='RUNNING'||dist<95||dist>C.bossDist-95||!runStats)return;
  const target=typeof targetHumansForLevel==='function'?targetHumansForLevel():80;
  const trigger=Math.max(3,Math.round(Math.max(peak||0,target)*.16));
  if(crowd>trigger)return;
  const mod=activeRunModifier||{};
  const trait=activeWorldTrait();
  const skin=activeSkinTrait();
  const gain=10+(mod.comebackBoost||0)+(trait.comebackBoost||0)+(skin.comebackBoost||0);
  comebackUsed=true;
  runStats.comeback++;
  crowd=Math.min(9999,crowd+gain);
  peak=Math.max(peak,crowd);
  addCrowdMembers(gain);
  triggerRoadPulse(true,1.2);
  rewardFlash('green');
  shake(.30);
  phaseFlash('RESCUE SIGNAL!');
  floatTxt('RESCUE +'+gain,innerWidth*.5,innerHeight*.42,'#69F0AE',42,'spin');
  if(window.Sensory)Sensory.play('comeback');
  if(window.Haptic)Haptic.pulse('comeback');
  recordFreshEvent('comeback',1);
  updateHUD();
}
function updateRunPacing(p){
  if(runPacingBeat<1&&p>=.28){
    runPacingBeat=1;
    phaseFlash('BUILD PHASE');
    floatTxt('BUILD TEAM',innerWidth*.5,innerHeight*.42,'#00E5FF',32,'streak');
  }else if(runPacingBeat<2&&p>=.58){
    runPacingBeat=2;
    phaseFlash('DANGER PHASE');
    triggerRoadPulse(false,.75);
  }else if(runPacingBeat<3&&p>=.82){
    runPacingBeat=3;
    phaseFlash('BOSS SOON');
    rewardFlash('blue');
  }
}
function summarizeFreshnessResult(win){
  const done=(activeMicroGoals||[]).filter(g=>g.complete).length;
  const mod=activeRunModifier||predictedRunModifier();
  const mult=freshnessRewardMultiplier();
  const bonus=freshnessBonusCoinsThisRun>0?' +'+freshnessBonusCoinsThisRun+' goal coins':'';
  lastFreshnessResultText=(done?done+'/'+(activeMicroGoals.length||3)+' fresh goals done':'Fresh goals ready')+' - '+(mod?mod.name:'next run rotates')+(mult!==1?' x'+mult.toFixed(2)+' reward':'')+bonus+'.';
  return lastFreshnessResultText;
}
function startingCrowdCount(){return 1;}
function calcRunReward(win,survivors){
  const safeSurvivors=Math.max(0,Math.round(survivors||0));
  const b=V18_BALANCE;
  const base=win ? b.winBase+currentRunLevel*b.winLevel : b.failBase+currentRunLevel*b.failLevel;
  // V19: diminishing returns. 10,000 humans no longer means 20k+ coins.
  // This keeps Mythic skins rare while still rewarding big crowds.
  const crowdPower=Math.sqrt(safeSurvivors);
  const crowdBonus=crowdPower*(win?b.crowdWin:b.crowdFail);
  const hugeCrowdBonus=win?Math.min(320,Math.log10(Math.max(10,safeSurvivors))*70):0;
  const winBonus=win?b.winBonus:0;
  const raw=base+crowdBonus+hugeCrowdBonus+winBonus;
  return Math.max(win?115:35,Math.round(raw));
}
function comboBonusRateFor(maxCombo){
  maxCombo=Math.max(0,Math.round(maxCombo||0));
  if(maxCombo>=10)return .25;
  if(maxCombo>=7)return .18;
  if(maxCombo>=5)return .12;
  if(maxCombo>=3)return .07;
  return 0;
}
function comboBonusNameFor(maxCombo){
  if(maxCombo>=10)return 'PERFECT RUN';
  if(maxCombo>=7)return 'HOT STREAK';
  if(maxCombo>=5)return 'FEVER';
  if(maxCombo>=3)return 'COMBO';
  return 'BUILD COMBO';
}
function savedRunStreak(){
  return Math.max(0,Math.round(num(playerData&&playerData.content?playerData.content.runStreak:0,0)));
}
function streakMultiplierFor(runStreak){
  runStreak=Math.max(0,Math.round(num(runStreak,0)));
  if(runStreak<2)return 1;
  return Math.min(1.25,1+Math.min(5,runStreak-1)*.05);
}
function streakMultiplierLabel(mult){
  return 'x'+(Math.round(num(mult,1)*100)/100).toFixed(2).replace(/\.00$/,'');
}
function applyRunStreakReward(win,coinsBeforeStreak){
  lastRunStreakBefore=savedRunStreak();
  lastRunStreakAfter=win?lastRunStreakBefore+1:0;
  lastRunStreakBroken=!win&&lastRunStreakBefore>=3;
  lastRunStreakMultiplier=win?streakMultiplierFor(lastRunStreakAfter):1;
  lastRunStreakBonusCoins=win?Math.max(0,Math.round(Math.max(0,coinsBeforeStreak)*(lastRunStreakMultiplier-1))):0;
  if(playerData&&playerData.content)playerData.content.runStreak=lastRunStreakAfter;
  return lastRunStreakBonusCoins;
}
function updateRunStreakBadge(){
  const el=document.getElementById('ui-run-streak');
  if(!el||!playerData||!playerData.content)return;
  const streak=savedRunStreak();
  const count=el.querySelector('[data-role="streak-count"]');
  const mult=el.querySelector('[data-role="streak-mult"]');
  if(!count||!mult)return;
  el.classList.toggle('hot',streak>=2);
  count.textContent=String(streak);
  mult.textContent=streak>=2?streakMultiplierLabel(streakMultiplierFor(streak)):'NEXT WIN';
}
function updateResultRunStreak(kind){
  const el=document.getElementById(kind+'-run-streak');
  if(!el)return;
  el.classList.remove('streak-hot','streak-broken');
  if(lastRunWin){
    const hot=lastRunStreakAfter>=2;
    el.classList.toggle('streak-hot',hot);
    const main=lastRunStreakAfter+' WIN STREAK';
    const sub=hot?streakMultiplierLabel(lastRunStreakMultiplier)+' REWARD +'+lastRunStreakBonusCoins:'WIN AGAIN TO MULTIPLY';
    el.innerHTML='<span>'+main+'</span> <b>'+sub+'</b>';
  }else if(lastRunStreakBroken){
    el.classList.add('streak-broken');
    el.innerHTML='<span>'+lastRunStreakBefore+'-WIN STREAK BROKEN</span> <b>START THE NEXT CHAIN</b>';
  }else{
    el.innerHTML='<span>RUN STREAK</span> <b>WIN TO START</b>';
  }
}
function registerGoodCombo(){
  const oldRate=comboBonusRateFor(maxComboThisRun);
  maxComboThisRun=Math.max(maxComboThisRun,combo);
  const newRate=comboBonusRateFor(maxComboThisRun);
  if(newRate>oldRate){
    const label=comboBonusNameFor(maxComboThisRun)+' BONUS!';
    floatTxt(label,innerWidth*.5,innerHeight*.31,newRate>=.18?'#FFD740':'#00E5FF',30,'streak');
    rewardFlash(newRate>=.18?'gold':'blue');
    shake(newRate>=.18?.35:.20);
    Sensory.play('combo',{combo:maxComboThisRun});Haptic.pulse('combo');
  }
}
function updateResultComboBonus(kind){
  const el=document.getElementById(kind+'-combo-bonus');
  if(!el)return;
  const rate=comboBonusRateFor(maxComboThisRun);
  el.classList.toggle('combo-hot',lastComboBonusCoins>0);
  if(lastComboBonusCoins>0){
    el.textContent=maxComboThisRun+' +'+lastComboBonusCoins;
  }else if(maxComboThisRun>0){
    el.textContent=String(maxComboThisRun);
  }else{
    el.textContent='0';
  }
}

let autoChestOpening=false;
let autoChestOpenSeq=0;
function resultScreenVisible(kind){
  const el=document.getElementById(kind==='over'?'s-over':'s-win');
  return !!(el&&el.style.display!=='none');
}
function postGameRewardBlocksChest(kind){
  const trial=document.getElementById(kind+'-trial-skin');
  if(trial&&trial.classList.contains('show')&&trial.classList.contains('reward-show'))return true;
  return !!(postGameRewardState&&postGameRewardState.open&&!postGameRewardState.claimed&&postGameRewardState.kind===kind);
}
function cancelAutoBossChestOpen(){
  autoChestOpenSeq++;
  autoChestOpening=false;
}
function autoOpenBossChestAfterResult(kind){
  kind=kind==='over'?'over':'win';
  if(!playerData||bossChestProgress()<3||autoChestOpening)return;
  autoChestOpening=true;
  const seq=++autoChestOpenSeq;
  const waitThenOpen=(delay)=>{
    setTimeout(()=>{
      if(seq!==autoChestOpenSeq)return;
      if(!playerData||bossChestProgress()<3||!resultScreenVisible(kind)){
        autoChestOpening=false;
        return;
      }
      if(postGameRewardBlocksChest(kind)){
        waitThenOpen(1100);
        return;
      }
      if(skinChestBlocksResult()){
        waitThenOpen(1300);
        return;
      }
      claimBossChest(true);
      autoChestOpening=false;
    },delay);
  };
  waitThenOpen(6200);
}
function grantRunReward(win){
  if(runRewardGranted)return lastRunReward;
  runRewardGranted=true;lastRunWin=!!win;
  resetSkinChestResultState();
  checkMicroGoals(!!win);
  lastBaseRunReward=Math.round(calcRunReward(win,crowd)*freshnessRewardMultiplier());
  const comboRate=comboBonusRateFor(maxComboThisRun);
  const fullComboBonus=Math.round(lastBaseRunReward*comboRate);
  lastComboBonusCoins=win?fullComboBonus:Math.round(fullComboBonus*.35);
  const preStreakCoins=lastBaseRunReward+lastComboBonusCoins;
  const streakBonus=applyRunStreakReward(!!win,preStreakCoins);
  const resultCoins=preStreakCoins+streakBonus;
  lastRunReward=resultCoins+freshnessBonusCoinsThisRun;
  addCoins(resultCoins,{silent:true});
  playerData.bestCrowd=Math.max(playerData.bestCrowd,peak,crowd);
  playerData.stats.runs++;
  if(win){
    playerData.stats.wins++;
    playerData.level++;
    playerData.content.bossChestWins=Math.min(3,(playerData.content.bossChestWins||0)+1);
    advanceSkinChest(true);
  }
  const milestoneBonus=checkCrowdMilestoneRewards();
  if(milestoneBonus>0)lastRunReward+=milestoneBonus;
  const goalBonus=checkNextRunGoal(win);
  if(goalBonus>0)lastRunReward+=goalBonus;
  const dailyBonus=checkDailyChallenge(win);
  if(dailyBonus>0)lastRunReward+=dailyBonus;
  const bonus=checkMissions(true);
  if(bonus>0)lastRunReward+=bonus;
  summarizeFreshnessResult(!!win);
  saveGame();refreshMetaUI();return lastRunReward;
}

function showGlobalLevelUp(card){
  if(!card)return;
  document.querySelectorAll('.global-level-up').forEach(el=>el.remove());
  const r=card.getBoundingClientRect();
  const badge=document.createElement('div');
  badge.className='global-level-up';
  badge.textContent='LEVEL UP!';
  badge.style.left=(r.left+r.width/2)+'px';
  badge.style.top=Math.max(76,r.top-10)+'px';
  document.body.appendChild(badge);
  setTimeout(()=>badge.remove(),1050);
}


function checkMissions(showPop){
  if(!playerData||!playerData.content)return 0;
  let total=0,names=[];
  for(const m of MISSION_DEFS){
    if(playerData.content.missions[m.id])continue;
    const prog=m.progress();
    if(prog>=m.target){
      playerData.content.missions[m.id]=true;
      addCoins(m.reward);
      total+=m.reward;names.push(m.title);
    }
  }
  if(total>0&&showPop){
    rewardFlash('gold');shake(.35);
    floatTxt('MISSION +'+total+' COINS',innerWidth*.5,innerHeight*.35,'#FFD740',38,'spin');
  }
  return total;
}
function currentWorldDef(){
  let cur=WORLD_DEFS[0];
  for(const w of WORLD_DEFS){if(playerData&&playerData.level>=w.level)cur=w;}
  return cur;
}
function nextWorldDef(){return WORLD_DEFS.find(w=>playerData&&playerData.level<w.level)||null;}
function worldDefByLevel(level){
  let cur=WORLD_DEFS[0];
  for(const w of WORLD_DEFS){if(level>=w.level)cur=w;}
  return cur;
}
function worldIsUnlocked(w,level){
  if(!w)return false;
  const lv=Math.max(1,Math.round(num(level || (playerData&&playerData.level) || 1,1)));
  if(w.id==='mars')return true;
  if(playerData&&playerData.content&&playerData.content.unlockedWorlds&&playerData.content.unlockedWorlds[w.id])return true;
  return lv>=(w.unlockLevel||w.level||1);
}
function highestUnlockedWorldDef(level){
  let cur=WORLD_DEFS[0];
  for(const w of WORLD_DEFS){
    if(worldIsUnlocked(w,level))cur=w;
  }
  return cur;
}
function selectedWorldDef(){
  const fallback=highestUnlockedWorldDef(playerData?playerData.level:currentRunLevel);
  if(!playerData||!playerData.content)return fallback;
  const id=String(playerData.content.selectedWorld||'');
  const selected=WORLD_DEFS.find(w=>w.id===id);
  if(selected&&worldIsUnlocked(selected,playerData.level))return selected;
  playerData.content.selectedWorld=(fallback&&fallback.id)||'mars';
  return fallback;
}
function selectWorldTheme(id){
  if(!playerData)loadGame();
  const w=WORLD_DEFS.find(x=>x.id===id);
  if(!w)return {ok:false,reason:'missing'};
  if(!worldIsUnlocked(w,playerData?playerData.level:1)){
    return {ok:false,reason:'locked',world:w,unlockLevel:w.unlockLevel||w.level||1};
  }
  playerData.content=playerData.content||{};
  playerData.content.selectedWorld=w.id;
  if(playerData.content.newWorldId===w.id)playerData.content.newWorldId=null;
  saveGame();
  applyWorldTheme(w,true);
  if(window.MenuGameplayPreview){
    MenuGameplayPreview.invalidate();
    MenuGameplayPreview.level=0;
    if(gState==='MENU'){
      requestAnimationFrame(()=>MenuGameplayPreview.ensure());
      setTimeout(()=>MenuGameplayPreview.ensure(),80);
    }
  }
  refreshMetaUI();
  return {ok:true,world:w};
}
function pendingNewWorldId(){
  if(!playerData||!playerData.content)return '';
  const id=String(playerData.content.newWorldId||'');
  const w=WORLD_DEFS.find(x=>x.id===id);
  if(!w||!worldIsUnlocked(w,playerData.level)||id===playerData.content.selectedWorld)return '';
  return id;
}
function clearNewWorldNotice(id){
  if(!playerData||!playerData.content||!playerData.content.newWorldId)return false;
  if(id&&playerData.content.newWorldId!==id)return false;
  playerData.content.newWorldId=null;
  saveGame();
  refreshMetaUI();
  return true;
}
function worldUnlockBonus(world){
  return Math.max(300,Math.round(num(world&&world.unlockBonus,300)));
}
function checkWorldUnlockAfterWin(oldLevel,newLevel){
  if(!playerData||!playerData.content)return null;
  const oldWorld=worldDefByLevel(oldLevel);
  const newWorld=worldDefByLevel(newLevel);
  lastWorldUnlocked=false;lastWorldName='';lastWorldUnlockBonus=0;lastWorldUnlockId='';
  if(!oldWorld||!newWorld||oldWorld.id===newWorld.id)return null;
  playerData.content.unlockedWorlds=playerData.content.unlockedWorlds||{};
  const firstUnlock=!playerData.content.unlockedWorlds[newWorld.id];
  playerData.content.unlockedWorlds[newWorld.id]=true;
  lastWorldUnlocked=true;
  lastWorldName=newWorld.name;
  lastWorldUnlockId=newWorld.id;
  playerData.content.newWorldId=newWorld.id;
  if(firstUnlock){
    lastWorldUnlockBonus=worldUnlockBonus(newWorld);
    addCoins(lastWorldUnlockBonus,{silent:true});
  }
  saveGame();
  refreshMetaUI();
  return {world:newWorld,first:firstUnlock,bonus:lastWorldUnlockBonus};
}
function currentWorldTheme(){
  return selectedWorldDef() || worldDefByLevel(currentRunLevel || (playerData?playerData.level:1));
}
window.worldIsUnlocked=worldIsUnlocked;
window.selectedWorldDef=selectedWorldDef;
window.selectWorldTheme=selectWorldTheme;
window.pendingNewWorldId=pendingNewWorldId;
window.clearNewWorldNotice=clearNewWorldNotice;
function hexNum(hex){return parseInt(String(hex||'#ffffff').replace('#',''),16);}
function rgbaFromHex(hex,a){
  hex=String(hex||'#ffffff').replace('#','');
  if(hex.length===3)hex=hex.split('').map(c=>c+c).join('');
  const n=parseInt(hex,16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  return 'rgba('+r+','+g+','+b+','+a+')';
}
function setColorAlphaVars(el,prefix,hex,alphas){
  if(!el)return;
  alphas.forEach(a=>{
    const pct=Math.round(a*100);
    el.style.setProperty('--'+prefix+'-'+pct,rgbaFromHex(hex,a));
  });
}
function setBodyWorldClass(w){
  document.body.classList.remove('world-neon','world-lava','world-mars','world-ice','world-saturn','world-toxic','world-cyber','world-void','world-neon_tokyo','world-lava_core','world-ocean_abyss','world-crystal_realm','world-digital_void','world-cosmic_storm');
  document.body.classList.add('world-'+(w?w.id:'mars'));
  const root=document.documentElement;
  const worldColor=w?w.color:'#00E5FF';
  const edgeColor=w?w.edge:'#00E5FF';
  root.style.setProperty('--worldColor',worldColor);
  root.style.setProperty('--worldColorSoft',rgbaFromHex(worldColor,.24));
  setColorAlphaVars(root,'worldColor',worldColor,[.24,.26,.45,.46,.52,.64,.78]);
  setColorAlphaVars(root,'worldEdge',edgeColor,[.45]);
  document.documentElement.style.setProperty('--worldRoad',w?w.road:'#101D4C');
  document.documentElement.style.setProperty('--worldEdge',edgeColor);
  document.documentElement.style.setProperty('--worldGood',w?w.good:'#00E676');
  document.documentElement.style.setProperty('--worldBad',w?w.bad:'#FF5252');
}
function isMarsDustSky(w){
  // All worlds now use the custom atmosphere system (no generic star backdrop)
  return !!(w);
}
function applyWorldTheme(w,announce){
  if(!w)return;
  const marsDustSky=isMarsDustSky(w);
  currentThemeId=w.id;
  setBodyWorldClass(w);
  if(scene){
    scene.background=new THREE.Color(hexNum(w.sky));
    scene.fog=new THREE.FogExp2(hexNum(w.fog),Number.isFinite(w.fogDensity)?w.fogDensity:(w.id==='void'?.012:.009));
  }
  if(renderer&&renderer.setClearColor)renderer.setClearColor(hexNum(w.sky),1);
  if(laneTiles&&laneTiles.length){
    const roadMap=getWorldRoadTex(w);
    window.__activeRoadTex=roadMap;
    laneTiles.forEach(g=>{
      g.children.forEach((ch,i)=>{
        if(!ch.material)return;
        const role=(ch.userData&&ch.userData.role)||'';
        if(role==='marsDeco'){
          ch.visible=(w.floorTexture||w.texture)==='mars_cracks';
          if(ch.material.color){ch.material.color.set(hexNum(w.accent||w.edge));}
          if(ch.material.emissive){ch.material.emissive.set(hexNum(w.fog));}
          ch.material.needsUpdate=true;
          return;
        }
        if(role==='roadReact'){
          ch.visible=true;
          if(ch.material.color){ch.material.color.set(hexNum(w.good||w.edge));}
          if(ch.material.opacity!==undefined)ch.material.opacity=0;
          ch.material.needsUpdate=true;
          return;
        }
        if(role==='road'||i===0){
          if(ch.material.map!==roadMap){ch.material.map=roadMap;}
          if(ch.material.color){ch.material.color.set(0xffffff);}
          ch.material.emissive&&ch.material.emissive.set(hexNum(w.road||w.fog||'#101D4C'));
          if(ch.material.emissiveIntensity!==undefined)ch.material.emissiveIntensity=.035;
        }
        else if(role==='edge'||i===1||i===2){
          if(ch.material.color){ch.material.color.set(hexNum(w.edge||w.color||'#00E5FF'));}
        }
        else if(ch.material.color){
          ch.material.color.set(hexNum(w.dash||w.accent||'#004466'));
        }
        if(ch.material.opacity!==undefined&&(role==='dash'||i>2))ch.material.opacity=w.id==='void'?.75:.50;
        ch.material.needsUpdate=true;
      });
    });
  }
  if(skyBackdrop&&skyBackdrop.material){
    skyBackdrop.visible=!marsDustSky;
    skyBackdrop.material.opacity=marsDustSky?0:(w.id==='void'?.52:w.id==='lava'?.42:.34);
    skyBackdrop.material.color&&skyBackdrop.material.color.set(hexNum(w.star));
    skyBackdrop.material.needsUpdate=true;
  }
  if(skyStarsGroup){
    skyStarsGroup.visible=!marsDustSky;
    skyStarsGroup.traverse(o=>{if(o.material&&o.material.color){o.material.color.set(hexNum(w.star));o.material.opacity=marsDustSky?0:(w.id==='void'?.58:w.id==='lava'?.40:.48);o.material.needsUpdate=true;}});
  }
  if(skyBrightGroup){
    skyBrightGroup.visible=!marsDustSky;
    skyBrightGroup.traverse(o=>{if(o.material&&o.material.color){o.material.color.set(hexNum(w.accent));o.material.opacity=marsDustSky?0:(w.id==='void'?.72:.50);o.material.needsUpdate=true;}});
  }
  planets_.forEach((p,i)=>{
    p.visible=!marsDustSky;
    if(p.material){p.material.color.set(hexNum(i%2?w.accent:w.planet));p.material.emissive.set(hexNum(w.fog));p.material.emissiveIntensity=w.id==='void'?.45:w.id==='lava'?.38:.25;p.material.needsUpdate=true;}
    p.children.forEach(c=>{c.visible=!marsDustSky;if(c.material&&c.material.color){c.material.color.set(hexNum(w.accent));c.material.opacity=marsDustSky?0:(w.id==='void'?.55:.38);c.material.needsUpdate=true;}});
  });
  if(cameraStarBackdrop&&cameraStarBackdrop.material){
    cameraStarBackdrop.visible=!marsDustSky;
    cameraStarBackdrop.material.transparent=true;
    cameraStarBackdrop.material.opacity=marsDustSky?0:(w.id==='void'?1:.92);
    cameraStarBackdrop.material.needsUpdate=true;
  }
  applyWorldAtmosphere(w);
  // Build matching climate system for this world
  buildClimate(w);
  if(announce){phaseFlash(w.name.toUpperCase());floatTxt(w.name.toUpperCase(),innerWidth*.5,innerHeight*.28,w.color,38,'spin');}
}
function themeGateColor(type){const w=currentWorldTheme();return type.good?hexNum(w.good):hexNum(w.bad);}
function themeGateText(type){const w=currentWorldTheme();return type.good?w.good:w.bad;}
function updateResultWorld(kind){
  const el=document.getElementById(kind+'-world-result');
  if(!el)return;
  const cur=currentWorldDef();
  const next=nextWorldDef();
  const level=playerData?Math.max(1,playerData.level||1):1;
  const safeName=v=>String(v||'WORLD').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
  function worldProgress(nextDef){
    if(!nextDef)return 100;
    const prevLevel=cur&&cur.level?cur.level:1;
    const span=Math.max(1,nextDef.level-prevLevel);
    return Math.max(6,Math.min(96,((level-prevLevel)/span)*100));
  }
  const nextColor=(lastWorldUnlocked?(cur&&cur.color):next&&next.color)||'#FFD740';
  el.style.setProperty('--worldColor',(cur&&cur.color)||'#00E5FF');
  el.style.setProperty('--nextWorldColor',nextColor);
  setColorAlphaVars(el,'worldColor',(cur&&cur.color)||'#00E5FF',[.24,.26]);
  setColorAlphaVars(el,'nextWorldColor',nextColor,[.25,.28,.32,.34,.42,.45,.52,.62]);
  el.classList.toggle('world-unlocked',!!lastWorldUnlocked);
  el.classList.toggle('world-max',!lastWorldUnlocked&&!next);
  if(lastWorldUnlocked){
    el.innerHTML=`
      <div class="world-teaser-top"><div class="world-chip">NEW WORLD</div><div class="world-level-pill">${lastWorldUnlockBonus>0?'+'+lastWorldUnlockBonus:'UNLOCKED'}</div></div>
      <div class="world-teaser-body">
        <div class="world-preview"><div class="world-orb-preview"></div><div class="world-road-preview"></div><div class="world-gate-preview bad"></div><div class="world-gate-preview good"></div></div>
        <div class="world-next-copy">
          <div class="world-kicker">Unlocked road</div>
          <div class="world-next-name">${safeName(lastWorldName||cur.name)}</div>
          <div class="world-next-hint">${lastWorldUnlockBonus>0?'Bonus +'+lastWorldUnlockBonus+' coins':'New road is live.'}</div>
          <div class="world-teaser-bar"><div class="world-teaser-fill" style="width:100%"></div></div>
        </div>
      </div>`;
    return;
  }
  if(next){
    const left=Math.max(0,next.level-level);
    const pct=worldProgress(next);
    el.innerHTML=`
      <div class="world-teaser-top"><div class="world-chip">NEXT WORLD</div><div class="world-level-pill">LVL ${next.level}</div></div>
      <div class="world-teaser-body">
        <div class="world-preview"><div class="world-orb-preview"></div><div class="world-road-preview"></div><div class="world-gate-preview bad"></div><div class="world-gate-preview good"></div></div>
        <div class="world-next-copy">
          <div class="world-kicker">Current: ${safeName(cur.name)}</div>
          <div class="world-next-name">${safeName(next.name)}</div>
          <div class="world-next-hint">${left===1?'1 level left':left+' levels left'}</div>
          <div class="world-progress-row"><span>PROGRESS</span><span>${Math.round(pct)}%</span></div>
          <div class="world-teaser-bar"><div class="world-teaser-fill" style="width:${pct}%"></div></div>
        </div>
      </div>`;
  }else{
    el.innerHTML=`
      <div class="world-teaser-top"><div class="world-chip">ALL WORLDS</div><div class="world-level-pill">MAX</div></div>
      <div class="world-teaser-body">
        <div class="world-preview"><div class="world-orb-preview"></div><div class="world-road-preview"></div><div class="world-gate-preview bad"></div><div class="world-gate-preview good"></div></div>
        <div class="world-next-copy">
          <div class="world-kicker">Current final road</div>
          <div class="world-next-name">${safeName(cur.name)}</div>
          <div class="world-next-hint">Final road reached.</div>
          <div class="world-teaser-bar"><div class="world-teaser-fill" style="width:100%"></div></div>
        </div>
      </div>`;
  }
}

function hideWorldUnlockCinematic(){
  const p=document.getElementById('world-unlock-popup');
  if(!p)return;
  p.classList.remove('show','ready');
}
function showWorldUnlockCinematic(world,bonus){
  const p=document.getElementById('world-unlock-popup');
  if(!p||!world)return;
  p.style.setProperty('--unlockColor',world.color||'#FFD740');
  setColorAlphaVars(p,'unlockColor',world.color||'#FFD740',[.20,.22,.28,.32,.35,.38,.42,.45,.50,.62]);
  setText('world-unlock-name',world.name||'New Planet');
  setText('world-unlock-level','LEVEL '+(world.level||world.unlockLevel||'?')+' ROAD');
  setText('world-unlock-bonus',bonus>0?('PLANET BONUS +'+bonus+' COINS'):'NEW ROAD LIVE');
  setText('world-unlock-message',world.teaserMessage||'New planet unlocked');
  p.classList.remove('ready');
  p.classList.add('show');
  rewardFlash('gold');shake(.75);
  floatTxt('NEW PLANET!',innerWidth*.5,innerHeight*.24,world.color||'#FFD740',42,'spin');
  setTimeout(()=>p.classList.add('ready'),520);
  clearTimeout(p._autoHideTimer);
  p._autoHideTimer=setTimeout(()=>hideWorldUnlockCinematic(),5200);
}


function bossChestProgress(){return Math.max(0,Math.min(3,(playerData&&playerData.content?playerData.content.bossChestWins:0)||0));}
function ensureSkinChest(){
  if(!playerData)return null;
  playerData.content=playerData.content||{};
  if(!playerData.content.skinChest)playerData.content.skinChest={progress:0,pendingSkin:null,claimedAt:0,totalOpened:0};
  const chest=playerData.content.skinChest;
  chest.progress=clamp(Math.round(num(chest.progress,0)),0,100);
  if(chest.pendingSkin&&!SKINS.some(s=>s.id===chest.pendingSkin&&s.id!=='default'))chest.pendingSkin=null;
  chest.claimedAt=Math.max(0,Math.round(num(chest.claimedAt,0)));
  chest.totalOpened=Math.max(0,Math.round(num(chest.totalOpened,0)));
  return chest;
}
function skinChestProgress(){
  const chest=ensureSkinChest();
  return chest?chest.progress:0;
}
function skinChestWinCount(progress){
  return Math.max(0,Math.min(4,Math.round((progress==null?skinChestProgress():progress)/25)));
}
function resetSkinChestResultState(){
  lastSkinChestBefore=skinChestProgress();
  lastSkinChestAfter=lastSkinChestBefore;
  lastSkinChestAdvanced=false;
}
function pickSkinChestReward(){
  const unowned=SKINS.filter(s=>s.id!=='default'&&s.price>0&&!ownsSkin(s.id));
  if(!unowned.length)return {id:'__coins__',bonus:500};
  const weighted=unowned.map(s=>Object.assign({},
    s,
    {w:s.rarity==='COMMON'?8:s.rarity==='RARE'?5:s.rarity==='EPIC'?3:s.rarity==='LEGENDARY'?2:1}
  ));
  const total=weighted.reduce((sum,s)=>sum+s.w,0);
  let roll=Math.random()*total;
  for(const s of weighted){
    roll-=s.w;
    if(roll<=0)return s;
  }
  return weighted[0];
}
function chargeSkinChestProgress(amount){
  const chest=ensureSkinChest();
  if(!chest){resetSkinChestResultState();return null;}
  if(chest.pendingSkin){
    chest.progress=100;
    if(!lastSkinChestAdvanced)lastSkinChestBefore=100;
    lastSkinChestAfter=100;
    return skinById(chest.pendingSkin);
  }
  const before=chest.progress;
  const after=Math.min(100,before+Math.max(0,Math.round(num(amount,25))));
  chest.progress=after;
  if(!lastSkinChestAdvanced)lastSkinChestBefore=before;
  lastSkinChestAfter=after;
  lastSkinChestAdvanced=true;
  if(after>=100){
    const reward=pickSkinChestReward();
    if(reward.id==='__coins__'){
      chest.progress=0;
      chest.pendingSkin=null;
      chest.claimedAt=Date.now();
      chest.totalOpened++;
      addCoins(reward.bonus,{silent:true});
      lastSkinChestAfter=100;
      setTimeout(()=>showRewardPopup('COLLECTION COMPLETE','All skins owned.<br>Skin Chest paid <b style="color:#FFD740">+'+reward.bonus+' coins</b>.','coins'),900);
      return reward;
    }
    chest.progress=100;
    chest.pendingSkin=reward.id;
    return reward;
  }
  return null;
}
function advanceSkinChest(isWin){
  const chest=ensureSkinChest();
  if(!chest){resetSkinChestResultState();return null;}
  lastSkinChestBefore=chest.progress;
  lastSkinChestAfter=chest.progress;
  lastSkinChestAdvanced=false;
  if(!isWin)return null;
  return chargeSkinChestProgress(25);
}
function skinChestTease(progress,pending,kind){
  const wins=skinChestWinCount(progress);
  if(pending)return 'CHEST READY - CLAIM YOUR SKIN';
  if(wins>=3)return '3/4 WINS - CHEST ALMOST FULL';
  if(kind==='over')return 'Win games to charge the skin chest.';
  if(lastSkinChestAdvanced)return '+25% charged. Win '+(4-wins)+' more.';
  return 'Win games to charge.';
}
function updateResultSkinChest(kind,animate){
  const chest=ensureSkinChest();
  const box=document.getElementById(kind+'-skin-chest');
  if(!box||!chest)return;
  const fill=document.getElementById(kind+'-skin-chest-fill');
  const count=document.getElementById(kind+'-skin-chest-count');
  const tease=document.getElementById(kind+'-skin-chest-tease');
  const pending=!!chest.pendingSkin;
  const from=(kind==='win'&&lastSkinChestAdvanced)?lastSkinChestBefore:chest.progress;
  const to=(kind==='win'&&lastSkinChestAdvanced)?lastSkinChestAfter:chest.progress;
  box.classList.toggle('ready',pending||to>=100);
  box.classList.toggle('charged',lastSkinChestAdvanced&&kind==='win');
  if(count)count.textContent=(pending?'READY':skinChestWinCount(to)+'/4 WINS');
  if(tease)tease.textContent=skinChestTease(to,pending,kind);
  if(fill){
    fill.style.width=Math.max(0,Math.min(100,from))+'%';
    if(animate&&from!==to){
      requestAnimationFrame(()=>setTimeout(()=>{fill.style.width=Math.max(0,Math.min(100,to))+'%';},120));
    }else{
      fill.style.width=Math.max(0,Math.min(100,to))+'%';
    }
  }
}
function pendingSkinChestSkin(){
  const chest=ensureSkinChest();
  return chest&&chest.pendingSkin?skinById(chest.pendingSkin):null;
}
function skinChestBlocksResult(){
  return skinRevealOpen||!!pendingSkinChestSkin();
}
function scheduleSkinRevealAfterResult(kind){
  kind=kind==='over'?'over':'win';
  if(!pendingSkinChestSkin())return;
  const seq=++skinRevealSeq;
  const waitThenReveal=(delay)=>{
    setTimeout(()=>{
      if(seq!==skinRevealSeq)return;
      const skin=pendingSkinChestSkin();
      if(!skin||!resultScreenVisible(kind))return;
      if(postGameRewardBlocksChest(kind)){
        waitThenReveal(1100);
        return;
      }
      triggerSkinRevealCinematic(skin);
    },delay);
  };
  waitThenReveal(5600);
}
function closeSkinReveal(){
  const overlay=document.getElementById('skin-reveal-overlay');
  if(!overlay)return;
  skinRevealOpen=false;
  overlay.classList.remove('show','phase-shake','phase-crack','phase-burst','phase-silhouette','phase-color','phase-name','phase-claim','claiming');
  overlay.setAttribute('aria-hidden','true');
}
function triggerSkinRevealCinematic(skin){
  skin=skin||pendingSkinChestSkin();
  if(!skin)return;
  const overlay=document.getElementById('skin-reveal-overlay');
  if(!overlay)return;
  const avatar=document.getElementById('skin-reveal-avatar');
  const rarity=document.getElementById('skin-reveal-rarity');
  const name=document.getElementById('skin-reveal-name');
  const desc=document.getElementById('skin-reveal-desc');
  const adBtn=document.getElementById('skin-reveal-ad-btn');
  const coinBtn=document.getElementById('skin-reveal-coin-btn');
  overlay.style.setProperty('--skinRevealColor',skin.glow||'#FFD740');
  overlay.style.setProperty('--skinRevealRarity',rarityColor(skin.rarity));
  setColorAlphaVars(overlay,'skinRevealColor',skin.glow||'#FFD740',[.16,.24,.32,.42,.55,.70]);
  setColorAlphaVars(overlay,'skinRevealRarity',rarityColor(skin.rarity),[.22,.35,.55]);
  if(avatar){
    avatar.className='skin-reveal-avatar skin-'+skin.id;
    avatar.dataset.fx=skin.fx||skin.id;
    avatar.style.setProperty('--skinColor',skin.body);
    avatar.style.setProperty('--skinGlow',skin.glow);
    avatar.style.background='linear-gradient(160deg,'+skin.accent+','+skin.body+' 62%,#050512)';
    avatar.innerHTML='<span class="texture-layer"></span>';
  }
  if(rarity){rarity.textContent=skin.rarity;rarity.style.color=rarityColor(skin.rarity);}
  if(name)name.textContent=skin.name.toUpperCase();
  if(desc)desc.textContent=skin.desc;
  if(adBtn){adBtn.textContent='WATCH AD - CLAIM FREE';adBtn.disabled=false;}
  if(coinBtn){coinBtn.textContent='400 COINS';coinBtn.disabled=false;}
  skinRevealOpen=true;
  overlay.setAttribute('aria-hidden','false');
  overlay.className='skin-reveal-overlay show';
  const phases=[
    [0,'phase-shake'],
    [500,'phase-crack'],
    [1100,'phase-burst'],
    [1400,'phase-silhouette'],
    [2000,'phase-color'],
    [2500,'phase-name'],
    [3000,'phase-claim']
  ];
  phases.forEach(([delay,cls])=>setTimeout(()=>{if(skinRevealOpen)overlay.classList.add(cls);},delay));
  Sensory.play('chest');Haptic.pulse('chest');
  setTimeout(()=>{if(skinRevealOpen){Sensory.play('skin');Haptic.pulse('skin');}},1450);
  setTimeout(()=>{if(skinRevealOpen){rewardFlash('gold');shake(.65);}},2100);
}
function finishSkinChestClaim(skinId,method){
  const chest=ensureSkinChest();
  const skin=skinById(skinId||(chest&&chest.pendingSkin));
  if(!chest||!skin||skin.id==='default')return false;
  unlockSkin(skin.id);
  equipSkin(skin.id);
  chest.pendingSkin=null;
  chest.progress=0;
  chest.claimedAt=Date.now();
  chest.totalOpened++;
  lastSkinChestBefore=0;
  lastSkinChestAfter=0;
  lastSkinChestAdvanced=false;
  saveGame();
  applyEquippedSkin();
  refreshMetaUI();
  updateResultSkinChest('win');
  updateResultSkinChest('over');
  playEquipCelebration(skin.id,method);
  return true;
}
function claimSkinWithAd(skinId){
  const chest=ensureSkinChest();
  const id=skinId||chest&&chest.pendingSkin;
  const skin=skinById(id);
  if(!chest||!id||!skin||skin.id==='default')return;
  const overlay=document.getElementById('skin-reveal-overlay');
  const btn=document.getElementById('skin-reveal-ad-btn');
  if(overlay)overlay.classList.add('claiming');
  if(btn){btn.textContent='AD LOADING';btn.disabled=true;}
  showRewardedAd({
    context:'skin_chest',
    onComplete:()=>finishSkinChestClaim(id,'ad'),
    onFail:(reason)=>{
      if(overlay)overlay.classList.remove('claiming');
      if(btn){btn.textContent=reason==='frequency_limit'?'AD LIMIT - USE COINS':'TRY AD AGAIN';btn.disabled=false;}
      Sensory.play('bad');Haptic.pulse('bad');
    }
  });
}
function claimSkinWithCoins(skinId,cost){
  const chest=ensureSkinChest();
  const id=skinId||chest&&chest.pendingSkin;
  const skin=skinById(id);
  const price=Math.max(0,Math.round(num(cost,400)));
  if(!chest||!id||!skin||skin.id==='default')return;
  const target=document.getElementById('skin-reveal-coin-btn')||document.getElementById('skin-reveal-overlay');
  if(!spendCoins(price,target)){
    floatTxt('NEED '+Math.max(0,price-(playerData?playerData.coins:0))+' COINS',innerWidth*.5,innerHeight*.48,'#FF8A80',36,'boom');
    Sensory.play('deny');Haptic.pulse('deny');
    return;
  }
  finishSkinChestClaim(id,'coins');
}
function playEquipCelebration(skinId,method){
  const skin=skinById(skinId);
  closeSkinReveal();
  rewardFlash('gold');
  shake(.85);
  ringBurst(0,0,56);
  floatTxt('NEW SKIN!',innerWidth*.5,innerHeight*.38,skin.glow,62,'spin');
  setTimeout(()=>floatTxt((method==='coins'?'PURCHASED':'EQUIPPED'),innerWidth*.5,innerHeight*.52,'#00E676',42,'boom'),560);
  Sensory.play('skin');Haptic.pulse('skin');
}
window.claimSkinWithAd=claimSkinWithAd;
window.claimSkinWithCoins=claimSkinWithCoins;
function renderMissions(){
  const list=document.getElementById('mission-list');if(!list||!playerData)return;
  list.innerHTML='';
  for(const m of MISSION_DEFS){
    const done=!!playerData.content.missions[m.id];
    const prog=done?m.target:m.progress();
    const pct=Math.min(100,(prog/m.target)*100);
    const row=document.createElement('div');row.className='mission-item'+(done?' done':'');
    row.innerHTML=`<div class="mission-kid-main"><div class="mission-name">${done?'DONE ':''}${m.title}</div><div class="mission-progress"><b>${Math.floor(prog)}/${m.target}</b> ${m.unit}<div class="tiny-bar"><div class="tiny-fill" style="width:${pct}%"></div></div></div></div><div class="mission-reward">${done?'OK':'+'+m.reward}</div>`;
    list.appendChild(row);
  }
}
function renderContentUI(){
  if(!playerData)return;
  renderMissions();updateNextRunGoalUI();
  const cp=bossChestProgress(),ready=cp>=3;
  setText('boss-chest-sub',ready?'Ready - it opens automatically after the game.':'Win '+(3-cp)+' more level'+(3-cp>1?'s':'')+' to open.');
  setText('boss-chest-action',ready?'OPEN':cp+'/3');
  setText('chest-button-sub',ready?'READY':cp+'/3 wins');
  setText('shop-chest-tab-text',ready?'CHEST READY':'CHEST '+cp+'/3');
  setBar('boss-chest-fill',cp/3*100);
  const card=document.getElementById('boss-chest-card'),btn=document.getElementById('boss-chest-action'),tab=document.getElementById('shop-chest-tab'),quick=document.getElementById('quick-chest-btn');
  if(card)card.classList.toggle('ready',ready);
  if(btn)btn.classList.toggle('not-ready',!ready);
  if(tab)tab.classList.toggle('ready',ready);
  if(quick)quick.classList.toggle('locked',!ready);
  const next=nextWorldDef(),cur=currentWorldDef();setBodyWorldClass(selectedWorldDef()||cur);
  const orb=document.getElementById('world-orb');
  if(next){
    const prev=cur.level,pct=Math.min(100,Math.max(0,(playerData.level-prev)/(next.level-prev)*100));
  setText('world-title','Next World: '+next.name);setText('world-sub','Unlock at Level '+next.level+' - current '+playerData.level);setBar('world-fill',pct);
    if(orb)orb.style.setProperty('--worldColor',next.color);
  }else{
    setText('world-title','All Worlds Previewed');setText('world-sub','Current: '+cur.name+' - more worlds later');setBar('world-fill',100);
    if(orb)orb.style.setProperty('--worldColor',cur.color);
  }
  updateResultChest('win');updateResultChest('over');updateResultSkinChest('win');updateResultSkinChest('over');
}
function updateResultChest(kind){
  const el=document.getElementById(kind+'-chest-result');if(!el||!playerData)return;
  const cp=bossChestProgress();
  if(kind==='win')el.textContent=cp>=3?'Boss Chest ready - opens after rewards':'Boss Chest: '+cp+'/3 wins';
  else el.textContent=cp>=3?'Boss Chest ready - opens after result':'Boss Chest charges only when you win: '+cp+'/3';
}
function claimBossChest(autoOpened){
  if(!playerData)return;
  const cp=bossChestProgress();
  if(cp<3){if(!autoOpened){floatTxt('WIN '+(3-cp)+' MORE!',innerWidth*.5,innerHeight*.42,'#FFD740',34,'boom');Sensory.play('deny');Haptic.pulse('deny');}return;}
  const coinReward=360+Math.floor(playerData.level*18)+Math.floor(Math.random()*181);
  let skinReward=null;
  const next=nextLockedSkin();
  // Chests can help early collection, but they do NOT skip Legendary/Mythic prices.
  if(next&&['RARE','EPIC'].includes(next.rarity)&&Math.random()<0.10){skinReward=next;unlockSkin(next.id);equipSkin(next.id);}
  playerData.content.bossChestWins=0;
  addCoins(coinReward,{silent:true});
  saveGame();applyEquippedSkin();refreshMetaUI();rewardFlash('gold');shake(.7);Sensory.play('chest');Haptic.pulse('chest');
  showChestPopup(coinReward,skinReward,!!autoOpened);
}
function resetChestPopupClasses(){
  const p=document.getElementById('chest-popup');
  if(!p)return;
  p.classList.remove('chest-reveal','opening','opened','reward-revealed');
}
function showRewardPopup(title,body,iconType){
  resetChestPopupClasses();
  const p=document.getElementById('chest-popup'),txt=document.getElementById('chest-popup-text'),ttl=document.getElementById('reward-popup-title'),ico=document.getElementById('reward-popup-icon'),btn=document.getElementById('chest-claim-btn');
  if(ttl)ttl.textContent=title;
  if(ico){
    const key=String(iconType||'chest').toLowerCase();
    const cls=(key==='daily'||key==='gift')?'icon-gift':(key==='coin'||key==='coins')?'icon-coin':'icon-chest';
    ico.className='reward-icon '+cls;
    ico.textContent='';
  }
  if(txt)txt.innerHTML=body;
  if(btn)btn.style.display='';
  if(p)p.classList.add('show');
}
function chestRewardBody(coins,skin,autoOpened){
  const auto=autoOpened?'<span style="color:rgba(255,255,255,.62)">Auto-opened after victory</span><br>':'';
  if(skin){
    return auto+'<b style="color:'+rarityColor(skin.rarity)+'">'+skin.rarity+' REVEAL</b><br>NEW SKIN: <b style="color:'+rarityColor(skin.rarity)+'">'+skin.name+'</b><br><b style="color:#FFD740">+'+coins+' coins</b>';
  }
  return auto+'You won <b style="color:#FFD740">+'+coins+' coins</b><br>Keep winning for more rewards!';
}
function activeChestCoinTarget(){
  const win=document.getElementById('s-win'),over=document.getElementById('s-over'),menu=document.getElementById('s-menu'),shop=document.getElementById('s-shop');
  if(win&&win.style.display!=='none')return document.getElementById('win-total-wallet')||document.getElementById('ui-coins');
  if(over&&over.style.display!=='none')return document.getElementById('over-total-wallet')||document.getElementById('ui-coins');
  if(shop&&shop.style.display!=='none')return document.getElementById('shop-coins');
  if(menu&&menu.style.display!=='none')return document.getElementById('ui-coins');
  return document.getElementById('ui-coins');
}
function animateChestCoinsToWallet(coins){
  const icon=document.getElementById('reward-popup-icon');
  const target=activeChestCoinTarget();
  if(!icon||!target)return;
  const a=icon.getBoundingClientRect(),b=target.getBoundingClientRect();
  if(!a.width||!b.width)return;
  const startX=a.left+a.width/2,startY=a.top+a.height/2;
  const endX=b.left+b.width/2,endY=b.top+b.height/2;
  const count=Math.min(24,Math.max(12,Math.round((Number(coins)||1)/70)));
  for(let i=0;i<count;i++){
    const c=document.createElement('span');
    c.className='chest-fly-coin icon-coin';
    const sx=startX+(Math.random()-.5)*90,sy=startY+(Math.random()-.5)*56;
    c.style.left=sx+'px';c.style.top=sy+'px';
    c.style.transition='transform 1.05s cubic-bezier(.18,.82,.22,1), opacity 1.05s ease-out';
    c.style.transitionDelay=(i*24)+'ms';
    appendCoinFxNode(c);
    const dx=endX-sx,dy=endY-sy;
    requestAnimationFrame(()=>{
      c.style.transform='translate(calc(-50% + '+dx+'px), calc(-50% + '+dy+'px)) scale(.35)';
      c.style.opacity='.12';
    });
    setTimeout(()=>c.remove(),1350+i*24);
  }
  setTimeout(()=>{
    const wallet=target.closest('.result-wallet,.meta-pill')||target;
    wallet.classList.remove('wallet-pop');
    void wallet.offsetWidth;
    wallet.classList.add('wallet-pop');
  },850);
}
function chestShardBurst(){
  const icon=document.getElementById('reward-popup-icon');
  if(!icon)return;
  const r=icon.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  const colors=['#FFD740','#FFF176','#00E5FF','#FF8F00','#FFFFFF'];
  for(let i=0;i<34;i++){
    const s=document.createElement('span');
    s.className='chest-shard';
    const a=(Math.PI*2*i/34)+(Math.random()*.45);
    const d=80+Math.random()*150;
    s.style.left=cx+'px';s.style.top=cy+'px';
    s.style.background=colors[i%colors.length];
    s.style.boxShadow='0 0 13px '+colors[i%colors.length];
    s.style.setProperty('--sx',Math.cos(a)*d+'px');
    s.style.setProperty('--sy',Math.sin(a)*d+'px');
    s.style.animationDelay=(i*8)+'ms';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),1100+i*8);
  }
}
function showChestPopup(coins,skin,autoOpened){
  const p=document.getElementById('chest-popup'),txt=document.getElementById('chest-popup-text'),ttl=document.getElementById('reward-popup-title'),ico=document.getElementById('reward-popup-icon'),btn=document.getElementById('chest-claim-btn');
  if(!p)return;
  resetChestPopupClasses();
  if(ttl)ttl.textContent='BOSS CHEST';
  if(txt)txt.innerHTML='Opening...';
  if(btn){btn.style.display='';btn.textContent='CLAIMED';}
  if(ico){ico.className='reward-icon icon-chest';ico.textContent='';}
  p.classList.add('show','chest-reveal');
  rewardFlash('gold');shake(.22);
  setTimeout(()=>{p.classList.add('opening');shake(.60);},420);
  setTimeout(()=>{p.classList.remove('opening');p.classList.add('opened');chestShardBurst();rewardFlash('gold');shake(.85);},1250);
  setTimeout(()=>{
    if(ttl)ttl.textContent=skin?(skin.rarity+' SKIN!'):'BOSS CHEST OPENED!';
    if(ico){
      ico.className='reward-icon '+(skin?'icon-skins':'icon-coin');
      ico.textContent='';
    }
    if(txt)txt.innerHTML=chestRewardBody(coins,skin,autoOpened);
    p.classList.add('reward-revealed');
    animateChestCoinsToWallet(coins);
  },1750);
}
function closeChestPopup(){
  const p=document.getElementById('chest-popup');
  if(p){
    p.classList.remove('show');
    setTimeout(()=>resetChestPopupClasses(),120);
  }
}


/* V51 META DOPAMINE LOOP â€” one active hook only, no particle loops */
(function(){
  const HOT_CLASSES=['meta-hot','meta-ready','meta-almost','meta-shine','meta-play-glow'];
  function safeText(v){return String(v==null?'':v).replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));}
  function pctClamp(v){return Math.max(0,Math.min(100,Number(v)||0));}
  function addBadge(el,text){
    if(!el||!text)return;
    let b=el.querySelector(':scope > .meta-hook-badge');
    if(!b){b=document.createElement('span');b.className='meta-hook-badge';el.appendChild(b);}
    b.textContent=text;
  }
  function clearElement(el){
    if(!el)return;
    HOT_CLASSES.forEach(c=>el.classList.remove(c));
    const b=el.querySelector(':scope > .meta-hook-badge');
    if(b)b.remove();
  }
  function skinInfo(){
    const next=(typeof nextLockedSkin==='function')?nextLockedSkin():null;
    if(!next||!playerData)return{next:null,pct:100,need:0};
    const coins=Math.max(0,Number(playerData.coins)||0);
    const price=Math.max(1,Number(next.price)||1);
    return{next,pct:pctClamp((coins/price)*100),need:Math.max(0,price-coins)};
  }
  function worldInfo(){
    if(typeof nextWorldDef!=='function'||typeof currentWorldDef!=='function'||!playerData)return{next:null,pct:100,need:0};
    const next=nextWorldDef();
    const cur=currentWorldDef();
    if(!next)return{next:null,pct:100,need:0};
    const level=Math.max(1,Number(playerData.level)||1);
    const base=Math.max(1,cur&&cur.level?cur.level:1);
    const span=Math.max(1,next.level-base);
    return{next,pct:pctClamp(((level-base)/span)*100),need:Math.max(1,next.level-level)};
  }
  function chestInfo(){
    const cp=(typeof bossChestProgress==='function')?bossChestProgress():0;
    return{progress:cp,pct:pctClamp(cp/3*100),need:Math.max(0,3-cp),ready:cp>=3};
  }
  function goalInfo(){
    const g=(typeof ensureNextRunGoal==='function')?ensureNextRunGoal():null;
    if(!g)return{goal:null,title:'Next run goal',reward:0,target:1,progressText:'0/1',pct:0};
    return{goal:g,title:(typeof goalTitle==='function'?goalTitle(g):'Next run goal'),reward:g.reward||0,target:g.target||1,progressText:'0/'+g.target+(typeof goalUnit==='function'?goalUnit(g):''),pct:0};
  }
  function pickBestHook(kind){
    const chest=chestInfo();
    if(chest.ready)return{type:'chest',state:'ready',badge:'OPEN',label:'GIFT',title:'Boss Chest ready!',progressText:'3/3 WINS',rewardText:'OPEN NOW',pct:100,sub:'Open it now, then run again for the next chest.'};
    if(chest.need===1)return{type:'chest',state:'almost',badge:'1 WIN',label:'GIFT',title:'1 win to open Boss Chest',progressText:chest.progress+'/3 WINS',rewardText:'BIG REWARD',pct:chest.pct,sub:'One more victory unlocks a big reward.'};
    const skin=skinInfo();
    if(skin.next&&skin.pct>=100)return{type:'skin',state:'ready',badge:'BUY',label:'SKIN',title:'Ready to buy '+skin.next.name,progressText:'ENOUGH COINS',rewardText:'OPEN SHOP',pct:100,sub:'Grab the skin passive, then try the next fresh run.'};
    if(skin.next&&skin.pct>=85)return{type:'skin',state:'almost',badge:'ALMOST',label:'SKIN',title:'Only '+skin.need+' coins for '+skin.next.name,progressText:Math.round(skin.pct)+'% UNLOCKED',rewardText:'NEW SKIN',pct:skin.pct,sub:'One more run can unlock your next skin.'};
    if(skin.next&&skin.pct>=65&&kind==='result')return{type:'skin',state:'almost',badge:Math.round(skin.pct)+'%',label:'SKIN',title:'Next skin: '+skin.next.name,progressText:Math.round(skin.pct)+'% UNLOCKED',rewardText:skin.need+' COINS LEFT',pct:skin.pct,sub:'Keep the coin flow going.'};
    const world=worldInfo();
    if(world.next&&world.pct>=80)return{type:'world',state:'almost',badge:'SOON',label:'WORLD',title:world.need+' level'+(world.need>1?'s':'')+' to '+world.next.name,progressText:Math.round(world.pct)+'% ROAD',rewardText:'NEW PLANET',pct:world.pct,sub:'New colors, new road, new planet vibe.'};
    const goal=goalInfo();
    if(kind==='over'&&window.lastFailFix)return{type:'fix',state:'almost',badge:'FIX',label:'FIX',title:safeText(lastFailFix),progressText:'TRY STRONGER',rewardText:'WIN BACK',pct:70,sub:'Cleaner gates can flip the final fight.'};
    return{type:'goal',state:'normal',badge:'GOAL',label:'GIFT',title:goal.title,progressText:goal.progressText,rewardText:'+'+goal.reward+' COINS',pct:goal.pct,sub:'Complete it next run for +'+goal.reward+' coins.'};
  }
  function clearMenu(){
    ['boss-chest-card','next-world-card'].forEach(id=>clearElement(document.getElementById(id)));
    clearElement(document.querySelector('#s-menu .next-skin-mini.v14'));
    clearElement(document.querySelector('#s-menu .play-big.v14'));
    clearElement(document.getElementById('next-run-goal-card'));
  }
  function renderSmartRewardCard(hook){
    const card=document.getElementById('next-run-goal-card');
    if(!card||!hook)return;
    const label=card.querySelector('.goal-kid-label');
    const title=document.getElementById('next-goal-title');
    const progress=document.getElementById('next-goal-progress');
    const reward=document.getElementById('next-goal-reward');
    const icon=card.querySelector('.goal-kid-icon');
    card.classList.remove('smart-next-reward','smart-chest','smart-skin','smart-world','smart-goal','smart-fix','smart-ready','meta-ready','meta-almost','meta-hot','meta-shine');
    card.classList.add('smart-next-reward','meta-hot','meta-shine','smart-'+(hook.type==='fix'?'fix':hook.type));
    card.classList.toggle('smart-ready',hook.type==='chest'&&hook.state==='ready');
    card.classList.toggle('meta-ready',hook.state==='ready');
    card.classList.toggle('meta-almost',hook.state==='almost');
    card.style.pointerEvents=(hook.type==='chest'&&hook.state==='ready')?'auto':'none';
    card.onclick=(hook.type==='chest'&&hook.state==='ready'&&typeof claimBossChest==='function')?()=>claimBossChest():null;
    if(label){label.textContent=hook.label||'GIFT';label.setAttribute('data-state',hook.badge||'');}
    if(title)title.textContent=hook.title||'Next reward';
    if(progress)progress.textContent=hook.progressText||'';
    if(reward)reward.textContent=hook.rewardText||'';
    setBar('next-goal-fill',pctClamp(hook.pct));
    if(icon){
      icon.classList.add('smart-icon');
      icon.setAttribute('data-type',hook.type);
    }
  }
  window.MetaDopamine={
    refreshMenu(){
      if(!playerData)return;
      clearMenu();
      const hook=pickBestHook('menu');
      renderSmartRewardCard(hook);
      const play=document.querySelector('#s-menu .play-big.v14');
      if(play)play.classList.add('meta-play-glow');
    },
    prepareResult(kind){
      if(!playerData)return;
      const hook=pickBestHook(kind);
      const box=document.getElementById(kind+'-one-more-hook');
      const title=document.getElementById(kind+'-one-more-title');
      const sub=document.getElementById(kind+'-one-more-sub');
      if(!box)return;
      box.className='one-more-hook '+hook.type;
      const k=box.querySelector('.one-more-kicker');
      if(k)k.textContent=hook.type==='fix'?'NEXT FIX':'ONE MORE RUN';
      if(title)title.textContent=hook.title;
      if(sub)sub.textContent=hook.sub+(window.lastFreshnessResultText?' '+window.lastFreshnessResultText:(lastFreshnessResultText?' '+lastFreshnessResultText:''));
    },
    pickBestHook,
    renderSmartRewardCard
  };
})();



const TIME_API_URLS=[
  'https://timeapi.io/api/Time/current/zone?timeZone=Africa/Tunis',
  'https://gateway.timeapi.world/timezone/Africa/Tunis'
];
const DAILY_LOCAL_COOLDOWN=86400000;
const DAILY_SERVER_TIMEOUT_MS=2600;
let dailyCheckInProgress=false,dailyLastStatus='checking server time...';
function tunisLocalDate(ts=Date.now()){
  try{return new Date(ts).toLocaleDateString('en-CA',{timeZone:'Africa/Tunis'});}catch(e){return new Date(ts).toISOString().slice(0,10);}
}
function parseApiDate(data){
  if(!data||typeof data!=='object')return '';
  if(typeof data.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(data.date))return data.date;
  const raw=data.dateTime||data.datetime||data.utc_datetime||data.currentLocalTime||data.currentDateTime||'';
  if(typeof raw==='string'&&raw.length>=10)return raw.slice(0,10);
  if(Number.isFinite(Number(data.unixtime))){
    return new Date(Number(data.unixtime)*1000).toLocaleDateString('en-CA',{timeZone:'Africa/Tunis'});
  }
  return '';
}
async function fetchJsonWithTimeout(url,timeout=DAILY_SERVER_TIMEOUT_MS){
  const ctrl=typeof AbortController!=='undefined'?new AbortController():null;
  const timer=ctrl?setTimeout(()=>ctrl.abort(),timeout):null;
  try{
    const r=await fetch(url,{cache:'no-store',signal:ctrl?ctrl.signal:undefined});
    if(!r.ok)throw new Error('bad time api response');
    return await r.json();
  }finally{
    if(timer)clearTimeout(timer);
  }
}
async function getServerToday(){
  for(const url of TIME_API_URLS){
    try{
      const data=await fetchJsonWithTimeout(url);
      const d=parseApiDate(data);
      if(d)return d;
    }catch(e){}
  }
  throw new Error('time api unavailable');
}
function dailyRewardAmount(){
  const streak=Math.min(7,(playerData&&playerData.content&&playerData.content.daily?playerData.content.daily.streak:0)+1);
  return 450+streak*110+Math.min(250,Math.floor((playerData?playerData.level:1)*8));
}
function canUseLocalDailyFallback(d,now=Date.now()){
  if(!d)return false;
  const today=tunisLocalDate(now);
  const lastLocal=Number(d.lastLocalTimestamp||0);
  if(String(d.lastLocalDate||'')===today)return false;
  if(String(d.lastClaimDate||'')===today)return false;
  if(lastLocal>0 && now-lastLocal<DAILY_LOCAL_COOLDOWN)return false;
  return true;
}
function markDailyClaim(d,date,source,now=Date.now()){
  d.lastClaimDate=date;
  d.lastLocalDate=date;
  d.lastLocalTimestamp=now;
  d.lastClaimSource=source||'server';
  if(source==='server')d.lastServerCheck=now;
  d.streak=Math.min(30,(d.streak||0)+1);
}
function renderDailyUI(status){
  if(status)dailyLastStatus=status;
  const d=playerData&&playerData.content?playerData.content.daily:null;
  const label=document.getElementById('daily-goal-text');
  if(!label)return;
  if(!d){label.textContent='Daily gift: loading...';setBar('daily-goal-fill',0);return;}
  if(dailyLastStatus==='ready'){
    label.textContent='Daily gift ready. Opening after the menu preview.';setBar('daily-goal-fill',100);
  }else if(dailyLastStatus==='local-ready'){
    label.textContent='Offline gift ready. Opening after the menu preview.';setBar('daily-goal-fill',100);
  }else if(dailyLastStatus==='claimed'){
    label.textContent='Daily gift claimed today. Come back tomorrow.';setBar('daily-goal-fill',100);
  }else if(dailyLastStatus==='local-claimed'){
    label.textContent='Offline gift claimed. Next gift unlocks tomorrow.';setBar('daily-goal-fill',100);
  }else if(dailyLastStatus==='offline'){
    label.textContent='Daily gift saved offline. Try again tomorrow.';setBar('daily-goal-fill',65);
  }else{
    label.textContent='Checking daily gift...';setBar('daily-goal-fill',55);
  }
}
async function checkDailyRewardAuto(){
  if(!playerData||dailyCheckInProgress)return;
  dailyCheckInProgress=true;renderDailyUI('checking');
  const d=playerData.content.daily;
  const now=Date.now();
  try{
    const today=await getServerToday();
    d.lastServerCheck=now;
    if(d.lastClaimDate!==today){
      const reward=dailyRewardAmount();
      markDailyClaim(d,today,'server',now);
      addCoins(reward,{silent:true});
      saveGame();refreshMetaUI();showDailyPopup(reward,d.streak,'server');
    }else{
      // Keep local timestamp synced so a later offline check cannot double-claim the same day.
      d.lastLocalDate=today;
      if(!d.lastLocalTimestamp)d.lastLocalTimestamp=now;
      d.lastClaimSource=d.lastClaimSource||'server';
      dailyLastStatus='claimed';renderDailyUI('claimed');saveGame();
    }
  }catch(e){
    const localToday=tunisLocalDate(now);
    if(canUseLocalDailyFallback(d,now)){
      const reward=dailyRewardAmount();
      markDailyClaim(d,localToday,'local',now);
      addCoins(reward,{silent:true});
      saveGame();refreshMetaUI();showDailyPopup(reward,d.streak,'local');
      dailyLastStatus='local-claimed';renderDailyUI('local-claimed');
    }else{
      dailyLastStatus='local-claimed';renderDailyUI('local-claimed');saveGame();
    }
  }
  dailyCheckInProgress=false;
}
function flushDailyPopup(){
  if(!pendingDailyPopup)return;
  clearTimeout(dailyPopupTimer);
  dailyPopupTimer=0;
  const menu=document.getElementById('s-menu');
  const canOpen=gState==='MENU'&&menu&&menu.style.display!=='none'&&!document.body.classList.contains('shop-mode')&&!document.body.classList.contains('result-mode');
  if(!canOpen){
    dailyPopupTimer=setTimeout(flushDailyPopup,1200);
    return;
  }
  if(window.MenuGameplayPreview&&!document.body.classList.contains('menu-preview-ready')){
    dailyPopupTimer=setTimeout(flushDailyPopup,650);
    return;
  }
  const gift=pendingDailyPopup;
  pendingDailyPopup=null;
  showDailyPopupNow(gift.coins,gift.streak,gift.source);
}
function showDailyPopup(coins,streak,source){
  pendingDailyPopup={coins,streak,source};
  dailyLastStatus=source==='local'?'local-ready':'ready';
  renderDailyUI(dailyLastStatus);
  clearTimeout(dailyPopupTimer);
  dailyPopupTimer=setTimeout(flushDailyPopup,window.MenuGameplayPreview?1450:900);
}
function showDailyPopupNow(coins,streak,source){
  const verified=source==='local'?'Offline fallback used':'Server time verified';
  showRewardPopup('DAILY GIFT',verified+'.<br>You won <b style="color:#FFD740">+'+coins+' coins</b><br>Streak: <b>'+streak+'</b> day'+(streak>1?'s':'')+'.','gift');
  dailyLastStatus=source==='local'?'local-claimed':'claimed';
  renderDailyUI(dailyLastStatus);
  setTimeout(()=>CoinFX.gain(coins,document.getElementById('reward-popup-icon')),220);
}

function nextLockedSkin(){return SKINS.find(s=>!ownsSkin(s.id)&&s.price>0)||null;}
function refreshMetaUI(){
  if(!playerData)return;
  setText('ui-level',playerData.level);setText('menu-level-label',playerData.level);setText('ui-best',playerData.bestCrowd);setText('ui-coins',playerData.coins);setText('shop-coins',playerData.coins);setText('win-total-coins',playerData.coins);setText('over-total-coins',playerData.coins);renderMenuTrack();updateNextRunGoalUI();
  setText('ui-start-preview',startingCrowdCount());setText('ui-equipped-skin',skinById(playerData.skins.equipped).name.toUpperCase());
  setText('ui-skins-owned',playerData.skins.owned.length+'/'+SKINS.length);
  const next=nextLockedSkin();
  const pct=next?Math.min(100,playerData.coins/next.price*100):100;
  if(next){
    setText('next-skin-text','Next skin: '+next.name);setText('next-skin-percent',Math.round(pct)+'%');setBar('next-skin-fill',pct);
    renderDailyUI();
  }else{
    setText('next-skin-text','All skins unlocked!');setText('next-skin-percent','100%');setBar('next-skin-fill',100);
    renderDailyUI();
  }
  updateRunStreakBadge();
  renderDailyChallengeUI();
  renderCrowdMilestoneUI();
  renderContentUI();renderPreviewSquad();renderShop();renderFreshnessMenu();
  if(window.Sensory)Sensory.refreshUI();
  if(window.MetaDopamine)window.MetaDopamine.refreshMenu();
  if(window.syncMobileBottomDock)window.syncMobileBottomDock();
}

function renderMenuTrack(){
  const wrap=document.querySelector('#s-menu .stage-track-bar');
  if(!wrap||!playerData)return;
  const nodes=Array.from(wrap.querySelectorAll('.stage-node')).filter(n=>!n.classList.contains('skull'));
  const activeCount=Math.max(1,Math.min(nodes.length,((playerData.level-1)%nodes.length)+1));
  nodes.forEach((n,i)=>n.classList.toggle('active',i<activeCount));
}
function setScreenMode(mode){
  syncMotionPreferenceClass();
  document.body.classList.toggle('menu-mode',mode==='menu');
  document.body.classList.toggle('playing-mode',mode==='play');
  document.body.classList.toggle('shop-mode',mode==='shop');
  document.body.classList.toggle('result-mode',mode==='result');
  renderFreshnessHUD();
}
function handleMenuTap(e){
  if(document.getElementById('s-menu').style.display==='none')return;
  const interactive=e.target.closest('.menu-action,.meta-top,.side-btn,.content-btn,.shop-back,.shop-tab,.skin-card,.shop-action,.btn');
  if(interactive)return;
  if(window.isMobileBottomDockActive&&window.isMobileBottomDockActive())return;
  startGame();
}

function openShop(){
  Sensory.play('start');
  setScreenMode('shop');
  ['s-menu','s-over','s-win'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.style.display='none';
  });
  const shop=document.getElementById('s-shop');
  if(shop)shop.style.display='flex';
  selectedSkinId=playerData.skins.equipped;
  renderShop();
}
function closeShop(){setScreenMode('menu');gState='MENU';document.getElementById('s-shop').style.display='none';document.getElementById('s-menu').style.display='flex';refreshMetaUI();checkDailyRewardAuto();if(window.MenuGameplayPreview)setTimeout(()=>MenuGameplayPreview.ensure(),0);}
function rarityColor(r){return RARITY_COLORS[r]||'#fff';}
function shortCoinAmount(v){
  const n=Math.max(0,Math.round(num(v,0)));
  if(n>=1000000){
    const digits=n>=10000000?1:2;
    return (n/1000000).toFixed(digits).replace(/\.0+$/,'').replace(/(\.\d)0$/,'$1')+'M';
  }
  if(n>=1000)return (n/1000).toFixed(n>=100000?0:1).replace(/\.0$/,'')+'K';
  return String(n);
}
function skinPriceLabel(v){return shortCoinAmount(v)+' COINS';}
function skinAuraLabel(s){
  if(!s||s.id==='default')return 'STARTER AURA';
  if(s.fx&&s.rarity==='MYTHIC')return s.price>=1900000?'ULTIMATE AURA':'MYTHIC AURA';
  if(s.fx&&s.rarity==='LEGENDARY')return 'PREMIUM AURA';
  if(s.rarity==='MYTHIC')return 'ELITE AURA';
  if(s.rarity==='LEGENDARY')return 'GOLD AURA';
  if(s.rarity==='EPIC')return 'POWER AURA';
  if(s.rarity==='RARE')return 'ELEMENTAL AURA';
  return 'CLASSIC AURA';
}
function hexToRgba(hex,a){
  hex=(hex||'#00E5FF').replace('#','');
  if(hex.length===3)hex=hex.split('').map(c=>c+c).join('');
  const n=parseInt(hex,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
}
function setText(id,val){const el=document.getElementById(id);if(el)el.textContent=val;}
function setBar(id,pct){const el=document.getElementById(id);if(el)el.style.width=Math.max(0,Math.min(100,pct))+'%';}
function renderPreviewSquad(){
  const wrap=document.getElementById('preview-squad');if(!wrap||!playerData)return;
  const s=skinById(playerData.skins.equipped);wrap.innerHTML='';
  for(let i=0;i<5;i++){
    const d=document.createElement('div');d.className='preview-human skin-'+s.id;
    d.dataset.fx=s.fx||s.id;
    d.style.setProperty('--skinColor',s.body);d.style.setProperty('--skinGlow',s.glow);d.style.background=`linear-gradient(160deg,${s.accent},${s.body} 62%,#050512)`;d.innerHTML='<span class="texture-layer"></span>'; 
    d.style.animationDelay=(i*.08)+'s';wrap.appendChild(d);
  }
  setText('preview-active-name',s.name.toUpperCase());
}
function updateNextSkinWidgets(prefix){
  const next=nextLockedSkin();
  if(!next){
    setText(prefix+'text','All skins unlocked!');setText(prefix+'percent','100%');setBar(prefix+'fill',100);return;
  }
  const pct=Math.min(100,playerData.coins/next.price*100);
  setText(prefix+'text',next.name+' - '+shortCoinAmount(Math.min(playerData.coins,next.price))+'/'+shortCoinAmount(next.price)+' COINS');
  setText(prefix+'percent',Math.round(pct)+'%');setBar(prefix+'fill',pct);
}
function updateResultNextSkin(kind){
  const next=nextLockedSkin();
  const t=document.getElementById(kind+'-next-text'),f=document.getElementById(kind+'-next-fill');
  if(!t||!f)return;
  if(!next){t.textContent='Collection complete - all skins unlocked!';f.style.width='100%';return;}
  const pct=Math.min(100,playerData.coins/next.price*100);
  t.textContent='Next skin: '+next.name+' - '+shortCoinAmount(Math.min(playerData.coins,next.price))+'/'+shortCoinAmount(next.price)+' coins';
  f.style.width=pct+'%';
}
function trySkinForRun(id){
  const s=skinById(id);
  if(!s||!playerData)return;
  if(ownsSkin(s.id)){
    selectedSkinId=s.id;
    renderShop();
    skinAction();
    return;
  }
  if(s.price<=0)return;
  showRewardedAd({
    context:'skin_trial',
    onComplete(){
      trialSkinId=s.id;
      trialSkinActive=true;
      lastTrialSkinId='';
      lastTrialSkinName='';
      selectedSkinId=s.id;
      applyEquippedSkin();
      refreshMetaUI();
      rewardFlash('blue');
      Sensory.play('skin');Haptic.pulse('skin');
      floatTxt('TRIAL: '+s.name.toUpperCase(),innerWidth*.5,innerHeight*.42,s.glow,34,'spin');
      startGame();
    },
    onFail(){
      floatTxt('AD NOT READY',innerWidth*.5,innerHeight*.45,'#FF8A80',32,'boom');
      Sensory.play('deny');Haptic.pulse('deny');
    }
  });
}
window.trySkinForRun=trySkinForRun;
function captureTrialSkinResult(){
  if(!trialSkinActive||!trialSkinId)return false;
  const s=skinById(trialSkinId);
  if(!s||s.id!==trialSkinId)return false;
  lastTrialSkinId=s.id;
  lastTrialSkinName=s.name;
  trialSkinActive=false;
  trialSkinId='';
  applyEquippedSkin();
  refreshMetaUI();
  return true;
}
function updateResultTrialSkin(kind){
  const el=document.getElementById(kind+'-trial-skin');
  if(!el)return;
  const s=lastTrialSkinId?skinById(lastTrialSkinId):null;
  const show=!!(s&&s.id===lastTrialSkinId&&!ownsSkin(s.id));
  el.classList.toggle('show',show);
  if(!show){
    el.innerHTML='';
    return;
  }
  const affordable=playerData&&playerData.coins>=s.price;
  el.style.setProperty('--trialSkinGlow',s.glow);
  el.innerHTML=`<div class="result-trial-copy"><span>TRIAL ENDED</span><b>BUY ${s.name.toUpperCase()}?</b><small>${skinPriceLabel(s.price)} - ${activeSkinTrait(s.id).desc||'Fresh style only.'}</small></div><button class="result-trial-buy${affordable?'':' locked'}" type="button" onclick="buyTrialSkin('${s.id}')">${affordable?'BUY':'NEED '+skinPriceLabel(s.price-playerData.coins)}</button>`;
}
function buyTrialSkin(id){
  const s=skinById(id);
  if(!s||!playerData)return;
  if(ownsSkin(s.id)){
    equipSkin(s.id);
  }else{
    const target=document.querySelector('.result-trial-skin.show')||document.getElementById('skin-action');
    if(!spendCoins(s.price,target)){
      floatTxt('NEED '+Math.max(0,s.price-playerData.coins)+' COINS',innerWidth*.5,innerHeight*.45,'#FF8A80',34,'boom');
      Sensory.play('deny');Haptic.pulse('deny');
      updateResultTrialSkin('win');updateResultTrialSkin('over');
      return;
    }
    unlockSkin(s.id);
    equipSkin(s.id);
  }
  lastTrialSkinId='';
  lastTrialSkinName='';
  saveGame();applyEquippedSkin();refreshMetaUI();renderShop();
  updateResultWallet('win',playerData.coins);updateResultWallet('over',playerData.coins);
  updateResultTrialSkin('win');updateResultTrialSkin('over');
  rewardFlash('gold');shake(.42);
  Sensory.play('skin');Haptic.pulse('skin');
  floatTxt('SKIN BOUGHT!',innerWidth*.5,innerHeight*.42,s.glow,40,'spin');
}
window.buyTrialSkin=buyTrialSkin;
function renderShop(){
  const grid=document.getElementById('skin-grid');if(!grid||!playerData)return;
  grid.innerHTML='';
  for(const s of SKINS){
    const owned=ownsSkin(s.id),equipped=playerData.skins.equipped===s.id,buyable=!owned&&playerData.coins>=s.price;
    const card=document.createElement('div');card.className='skin-card'+(selectedSkinId===s.id?' selected':'')+(owned?'':' locked')+(buyable?' buyable':'')+(owned?' affordable':'');
    if(s.fx)card.classList.add('premium-skin');
    card.dataset.rarity=s.rarity;
    card.style.borderColor=selectedSkinId===s.id?rarityColor(s.rarity):rarityColor(s.rarity);
    card.style.setProperty('--rarityColor',rarityColor(s.rarity));
    card.style.setProperty('--skinGlow',s.glow);
    setColorAlphaVars(card,'rarityColor',rarityColor(s.rarity),[.16,.42,.45,.48,.52]);
    setColorAlphaVars(card,'skinGlow',s.glow,[.36,.42,.70]);
    card.onclick=()=>{CoinFX.remember(card);selectedSkinId=s.id;renderShop();};
    const price=s.price>0?`<div class="price-tag">${owned?'OWNED':shortCoinAmount(s.price)}</div>`:'';
    const tryBtn=!owned&&s.price>0?`<button class="skin-try-btn" type="button" onclick="event.stopPropagation();trySkinForRun('${s.id}')">TRY</button>`:'';
    card.innerHTML=`<div class="rarity-tag" style="background:${rarityColor(s.rarity)}33;color:${rarityColor(s.rarity)}">${s.rarity[0]}</div><div class="skin-avatar skin-${s.id}" data-fx="${s.fx||s.id}" style="--skinColor:${s.body};--skinGlow:${s.glow};background:linear-gradient(160deg,${s.accent},${s.body} 64%,#050512)"><span class="texture-layer"></span></div>${owned?'':'<div class="lock-big">LOCK</div>'}${equipped?'<div class="equipped-badge">ON</div>':''}${price}${tryBtn}`;
    grid.appendChild(card);
  }
  const s=skinById(selectedSkinId),owned=ownsSkin(s.id),equipped=playerData.skins.equipped===s.id;
  const n=document.getElementById('skin-detail-name'),d=document.getElementById('skin-detail-desc'),a=document.getElementById('skin-action');
  if(n)n.textContent=s.name;
    if(d)d.textContent=s.rarity+' - '+s.desc+' Passive: '+(activeSkinTrait(s.id).desc||'Fresh style only.')+(owned?'':' - '+skinPriceLabel(s.price));
  const big=document.getElementById('big-skin-preview'),stage=document.getElementById('big-skin-stage'),rar=document.getElementById('skin-rarity-big');
  if(big){big.className='big-skin skin-'+s.id;big.dataset.fx=s.fx||s.id;big.style.setProperty('--skinColor',s.body);big.style.setProperty('--skinGlow',s.glow);setColorAlphaVars(big,'skinGlow',s.glow,[.36,.42,.70]);big.style.background=`linear-gradient(160deg,${s.accent},${s.body} 62%,#050512)`;big.innerHTML='<span class="texture-layer"></span>';}
  if(stage){stage.style.setProperty('--previewGlow',hexToRgba(s.glow,.32));stage.style.setProperty('--previewAura',hexToRgba(s.glow,.48));stage.style.setProperty('--rarityColor',rarityColor(s.rarity));setColorAlphaVars(stage,'rarityColor',rarityColor(s.rarity),[.16,.42,.45,.48,.52]);}
  if(rar){rar.innerHTML='<span>'+s.rarity+'</span><small>'+skinAuraLabel(s)+'</small>';rar.style.color=rarityColor(s.rarity);rar.style.setProperty('--rarityColor',rarityColor(s.rarity));rar.style.setProperty('--skinAura',hexToRgba(s.glow,.50));setColorAlphaVars(rar,'rarityColor',rarityColor(s.rarity),[.16,.42,.45,.48,.52]);}
  const prog=document.getElementById('shop-progress');
  if(prog){
    if(!owned&&s.price>0){prog.classList.add('show');const pct=Math.min(100,playerData.coins/s.price*100);setText('shop-progress-text',shortCoinAmount(Math.min(playerData.coins,s.price))+'/'+shortCoinAmount(s.price)+' coins');setText('shop-progress-percent',Math.round(pct)+'%');setBar('shop-progress-fill',pct);}else{prog.classList.remove('show');}
  }
  renderContentUI();
  if(a){
    a.className='shop-action';
    if(equipped){a.textContent='EQUIPPED';a.classList.add('locked');}
    else if(owned){a.textContent='EQUIP';a.classList.add('equip');}
    else if(playerData.coins>=s.price){a.textContent='BUY '+skinPriceLabel(s.price);}
    else{a.textContent='NEED '+skinPriceLabel(s.price-playerData.coins);a.classList.add('locked');}
  }
}
function skinAction(){
  const s=skinById(selectedSkinId);if(!s)return;
  if(playerData.skins.equipped===s.id)return;
  if(ownsSkin(s.id)){
    if(equipSkin(s.id)){saveGame();applyEquippedSkin();refreshMetaUI();rewardFlash('blue');Sensory.play('skin');Haptic.pulse('skin');floatTxt('EQUIPPED!',innerWidth*.5,innerHeight*.45,s.glow,38,'spin');}
    return;
  }
  if(!spendCoins(s.price,document.querySelector('.skin-card.selected')||document.getElementById('big-skin-preview')||document.getElementById('skin-action'))){floatTxt('NEED '+Math.max(0,s.price-playerData.coins)+' COINS',innerWidth*.5,innerHeight*.45,'#FF8A80',38,'boom');Sensory.play('deny');Haptic.pulse('deny');return;}
  unlockSkin(s.id);equipSkin(s.id);saveGame();applyEquippedSkin();refreshMetaUI();rewardFlash('gold');shake(.5);Sensory.play('skin');Haptic.pulse('skin');floatTxt('NEW SKIN!',innerWidth*.5,innerHeight*.45,s.glow,48,'spin');
}
function fakeComingSoon(txt){floatTxt(txt+' SOON!',innerWidth*.5,innerHeight*.44,'#EA80FC',36,'boom');}

function updateResultWallet(kind,total){
  const el=document.getElementById(kind+'-total-coins');
  if(el)el.textContent=Math.max(0,Math.round(total));
}
function animateWalletCount(kind,from,to,duration){
  const el=document.getElementById(kind+'-total-coins');
  if(!el){return;}
  from=Math.max(0,Math.round(from));
  to=Math.max(0,Math.round(to));
  const start=performance.now();
  function step(now){
    const p=Math.min(1,(now-start)/(duration||850));
    const eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(from+(to-from)*eased);
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function animateRewardCoinsToWallet(kind,reward){
  const source=document.getElementById(kind+'-coins');
  const wallet=document.getElementById(kind+'-total-wallet');
  if(!source||!wallet)return;
  const s=source.getBoundingClientRect();
  const w=wallet.getBoundingClientRect();
  if(!s.width||!w.width)return;
  const startX=s.left+s.width/2;
  const startY=s.top+s.height/2;
  const endX=w.left+w.width/2;
  const endY=w.top+w.height/2;
  const amount=Math.max(1,Number(reward)||1);
  const count=Math.min(20,Math.max(10,Math.round(amount/95)));
  source.classList.remove('coin-pop');
  void source.offsetWidth;
  source.classList.add('coin-pop');
  for(let i=0;i<count;i++){
    const c=document.createElement('span');
    c.className='fly-coin icon-coin';
    const spreadX=(Math.random()-.5)*90;
    const spreadY=(Math.random()-.5)*36;
    c.style.left=(startX+spreadX)+'px';
    c.style.top=(startY+spreadY)+'px';
    c.style.transform='translate(-50%,-50%) scale(1)';
    c.style.transition='transform 1.04s cubic-bezier(.18,.82,.22,1), opacity 1.04s ease-out';
    c.style.transitionDelay=(i*38)+'ms';
    appendCoinFxNode(c);
    const dx=endX-(startX+spreadX);
    const dy=endY-(startY+spreadY);
    requestAnimationFrame(()=>{
      c.style.transform='translate(calc(-50% + '+dx+'px), calc(-50% + '+dy+'px)) scale(.38)';
      c.style.opacity='.18';
    });
    setTimeout(()=>c.remove(),1400+i*50);
  }
  setTimeout(()=>{
    wallet.classList.remove('wallet-pop');
    void wallet.offsetWidth;
    wallet.classList.add('wallet-pop');
  },870);
}
function playResultCoinReward(kind,reward){
  const before=Math.max(0,(playerData?playerData.coins:0)-Math.max(0,Math.round(Number(reward)||0)));
  const after=playerData?playerData.coins:before;
  updateResultWallet(kind,before);
  setTimeout(()=>{
    animateRewardCoinsToWallet(kind,reward);
    animateWalletCount(kind,before,after,1270);
  },180);
}

function ladderStepIds(kind){
  if(kind==='win')return ['win-stars','win-coins','win-skin-chest','win-milestone-result','win-goal-result','win-daily-challenge','win-trial-skin','win-next-skin','win-chest-result','win-world-result','win-one-more-hook'];
  return ['over-msg','over-fail-tip','over-close-hook','over-coins','over-skin-chest','over-milestone-result','over-goal-result','over-daily-challenge','over-trial-skin','over-next-skin','over-chest-result','over-one-more-hook'];
}
function clearRewardLadder(kind){
  if(typeof closePostGameReward==='function')closePostGameReward();
  const screen=document.getElementById(kind==='win'?'s-win':'s-over');
  if(screen)screen.classList.remove('ladder-active');
  for(const id of ladderStepIds(kind)){
    const el=document.getElementById(id);
    if(el)el.classList.remove('reward-show');
  }
  const row=screen?screen.querySelector('.result-row'):null;
  if(row)row.classList.remove('reward-show');
}
function resetRewardLadder(kind){
  const screen=document.getElementById(kind==='win'?'s-win':'s-over');
  if(!screen)return;
  clearRewardLadder(kind);
  screen.classList.add('ladder-active');
  const fill=document.getElementById(kind+'-next-fill');
  if(fill){
    const target=fill.style.width||'0%';
    fill.dataset.rewardTarget=target;
    fill.style.width='0%';
  }
}
function showRewardStep(kind,id){
  const el=document.getElementById(id);
  if(!el)return;
  el.classList.add('reward-show');
  if(id===kind+'-next-skin'){
    const fill=document.getElementById(kind+'-next-fill');
    if(fill){
      const target=fill.dataset.rewardTarget||fill.style.width||'0%';
      fill.style.width='0%';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{fill.style.width=target;}));
    }
  }
}
function showRewardButtons(kind){
  const screen=document.getElementById(kind==='win'?'s-win':'s-over');
  const row=screen?screen.querySelector('.result-row'):null;
  if(row)row.classList.add('reward-show');
}
function playRewardLadder(kind,reward){
  if(window.MetaDopamine)window.MetaDopamine.prepareResult(kind);
  resetRewardLadder(kind);
  const rewardResultSeq=++postGameRewardResultSeq;
  postGameRewardShownSeq=0;
  const isWin=kind==='win';
  const seq=isWin
    ? [
        ['win-stars',220],
        ['win-coins',520,'coins'],
        ['win-milestone-result',820,'milestone'],
        ['win-daily-challenge',1040],
        ['win-trial-skin',1260],
        ['win-next-skin',1500],
        ['win-world-result',1800],
        ['post-reward',2140,'postReward'],
        ['buttons',2500]
      ]
    : [
        ['over-msg',260],
        ['over-fail-tip',640],
        ['over-close-hook',980],
        ['over-coins',1320,'coins'],
        ['over-milestone-result',1580,'milestone'],
        ['over-daily-challenge',1840],
        ['over-trial-skin',2060],
        ['over-next-skin',2360],
        ['post-reward',2740,'postReward'],
        ['buttons',3180]
      ];
  for(const [id,delay,type] of seq){
    setTimeout(()=>{
      if(rewardResultSeq!==postGameRewardResultSeq||!postGameRewardScreenVisible(kind))return;
      if(id==='buttons'){showRewardButtons(kind);return;}
      if(type==='postReward'){showPostGameReward(kind,reward,rewardResultSeq);return;}
      showRewardStep(kind,id);
      if(type==='coins')playResultCoinReward(kind,reward);
      if(type==='streak'&&lastRunStreakBroken){rewardFlash('red');shake(.28);}
      if(type==='milestone'&&lastMilestoneBonus>0){rewardFlash('gold');shake(.28);}
      if(id.includes('chest')){rewardFlash('gold');shake(.18);}
    },delay);
  }
  // V91 fallback: if the ladder timer was throttled, try again after buttons are visible.
  setTimeout(()=>showPostGameReward(kind,reward,rewardResultSeq),isWin?4550:4590);
  setTimeout(()=>showPostGameReward(kind,reward,rewardResultSeq),isWin?5600:5650);
  setTimeout(()=>{const p=activePostRewardPanel(kind); if(p && !p.classList.contains('show')) showPostGameReward(kind,reward,rewardResultSeq);}, isWin?6800:6900);
}



/* V90 RESULT-PANEL REWARD SPINNER â€” same page + same glass theme */
let postGameRewardState=null;
let postGameRewardSeq=0;
let postGameRewardResultSeq=0;
let postGameRewardShownSeq=0;
function postGameRewardScreenVisible(kind){
  const el=document.getElementById(kind==='win'?'s-win':'s-over');
  return !!(el&&el.style.display!=='none');
}
function activePostRewardPanel(kind){
  return document.getElementById(kind+'-result-bonus');
}
function postRewardRole(root,role){
  return root?root.querySelector('[data-role="'+role+'"]'):null;
}
function postRewardClaimSmall(root){
  return root?root.querySelector('.result-bonus-claim small'):null;
}
function postGameRewardBase(reward,kind){
  const safe=Math.max(0,Math.round(Number(reward)||0));
  if(kind==='win')return Math.max(20,Math.min(250,Math.round(safe*.18)||20));
  return Math.max(10,Math.min(120,Math.round(safe*.14)||10));
}
function hideAllPostRewardPanels(){
  document.querySelectorAll('.result-bonus-card').forEach(panel=>{
    panel.classList.remove('show','claimed','stopped','decision','ad-offer','ad-loading','ad-success','ad-failed','result-x2','result-x3','result-xhalf','result-x0','result-x5','result-x1','active-x2','active-x3','active-xhalf','active-x0','active-x5','active-x1');
    panel.removeAttribute('data-active-mult');
    panel.removeAttribute('data-result-mult');
    panel.removeAttribute('data-ad-mult');
    panel.querySelectorAll('.result-bonus-zone').forEach(z=>z.classList.remove('won'));
    const offer=postRewardRole(panel,'ad-offer');
    if(offer){
      offer.setAttribute('aria-hidden','true');
      offer.classList.remove('show');
    }
    panel.style.display='';
    panel.style.opacity='';
    panel.style.visibility='';
    panel.style.transform='';
    panel.style.filter='';
    panel.style.animation='';
    panel.setAttribute('aria-hidden','true');
  });
  document.body.classList.remove('post-reward-pending');
}
const BONUS_STOP_REGIONS=[
  {mult:2,from:0.00,to:0.38,cls:'x2',label:'x2 NICE!',tone:'good'},
  {mult:.5,from:0.38,to:0.52,cls:'xhalf',label:'x0.5 PARTIAL',tone:'low'},
  {mult:5,from:0.52,to:0.60,cls:'x5',label:'x5 JACKPOT!',tone:'jackpot'},
  {mult:1,from:0.60,to:1.00,cls:'x1',label:'x1 SAFE!',tone:'safe'}
];
const BONUS_AD_BOOST_POOLS={
  '0.5':[1,2,3],
  1:[2,3,4],
  2:[5,7,10],
  3:[6,9,12],
  5:[10,15,20]
};
function bonusRegionAt(progress){
  const p=Math.max(0,Math.min(.9999,Number(progress)||0));
  return BONUS_STOP_REGIONS.find(r=>p>=r.from&&p<r.to)||BONUS_STOP_REGIONS[BONUS_STOP_REGIONS.length-1];
}
function pickPostRewardAdMult(mult){
  const pool=BONUS_AD_BOOST_POOLS[mult]||null;
  if(!pool||!pool.length)return 0;
  return pool[Math.floor(Math.random()*pool.length)]||0;
}
function renderPostRewardAdOffer(st){
  if(!st)return;
  const panel=activePostRewardPanel(st.kind);
  if(!panel)return;
  const offer=postRewardRole(panel,'ad-offer');
  if(!offer)return;
  const before=postRewardRole(panel,'ad-before');
  const after=postRewardRole(panel,'ad-after');
  const title=postRewardRole(panel,'ad-title');
  const sub=postRewardRole(panel,'ad-sub');
  const watch=panel.querySelector('.result-ad-watch');
  const show=!!(st.stopped&&st.normalMult>0&&st.offerMult>st.normalMult&&!st.claimed);
  offer.classList.toggle('show',show);
  offer.setAttribute('aria-hidden',show?'false':'true');
  panel.classList.toggle('ad-offer',show);
  panel.dataset.adMult=show?String(st.offerMult):'';
  if(show&&st.offerMult===3)panel.classList.add('active-x3');
  if(!show)panel.classList.remove('active-x3');
  if(before)before.textContent='x'+(st.normalMult||0);
  if(after)after.textContent='x'+(st.offerMult||0);
  if(title)title.textContent=st.adWatched?'AD COMPLETE':st.adLoading?'AD BOOST LOADING':st.offerMult>=10?'MAKE IT x'+st.offerMult:'BOOST TO x'+st.offerMult;
  if(sub)sub.textContent=st.adWatched?'Boost applied. Coins are flying now.':st.adLoading?'Rewarded ad loading. Stay ready.':'Watch ad to upgrade '+(st.normalCoins||0)+' coins into '+(st.boostedCoins||0)+'.';
  if(watch)watch.textContent=st.adWatched?'AD COMPLETE':st.adLoading?'LOADING AD':'WATCH AD x'+(st.offerMult||0);
}
function clearBonusCursorLoop(st){
  if(!st)return;
  if(st.raf){
    cancelAnimationFrame(st.raf);
    st.raf=0;
  }
  if(st.tickTimer){
    clearInterval(st.tickTimer);
    st.tickTimer=0;
  }
}
function renderBonusCursor(st){
  if(!st)return;
  const panel=activePostRewardPanel(st.kind);
  if(!panel)return;
  const cursor=postRewardRole(panel,'cursor');
  const track=postRewardRole(panel,'track');
  const finalEl=postRewardRole(panel,'final');
  const action=postRewardRole(panel,'action');
  const region=bonusRegionAt(st.progress);
  panel.dataset.activeMult=String(region.mult);
  panel.classList.remove('active-x2','active-x3','active-xhalf','active-x0','active-x5','active-x1');
  panel.classList.add('active-'+region.cls);
  if(cursor&&track){
    const trackW=track.offsetWidth||312;
    cursor.style.setProperty('--bonus-cursor-x',(trackW*Math.max(0,Math.min(1,st.progress)))+'px');
  }
  if(!st.stopped){
    if(finalEl)finalEl.textContent='STOP';
    if(action)action.textContent='TAP TO STOP';
  }
}
function startBonusCursor(st){
  clearBonusCursorLoop(st);
  st.running=true;
  st.stopped=false;
  st.progress=.02;
  st.dir=1;
  st.lastFrame=performance.now();
  const speed=0.62; // visible left-right movement, about 1.6s per side
  const tick=()=>{
    if(!postGameRewardState||postGameRewardState!==st||!st.running)return;
    const now=performance.now();
    const dt=Math.min(.055,Math.max(.001,(now-st.lastFrame)/1000));
    st.lastFrame=now;
    st.progress+=st.dir*speed*dt;
    if(st.progress>=1){
      st.progress=1-(st.progress-1);
      st.dir=-1;
    }else if(st.progress<=0){
      st.progress=-st.progress;
      st.dir=1;
    }
    renderBonusCursor(st);
  };
  renderBonusCursor(st);
  // setInterval is more reliable here than CSS animation / RAF because screen performance rules can pause visual animations.
  st.tickTimer=setInterval(tick,16);
}
function showPostGameReward(kind,reward,resultSeq){
  if(kind!=='win')return;
  if(resultSeq&&resultSeq!==postGameRewardResultSeq)return;
  if(!postGameRewardScreenVisible(kind))return;
  const rankEl=document.getElementById('win-stars');
  const currentRank=rankEl?String(rankEl.textContent||'').trim():'';
  if(currentRank!=='RANK SSS')return;
  const panel=activePostRewardPanel(kind);
  if(!panel||!playerData)return;
  if(postGameRewardState&&postGameRewardState.open&&postGameRewardState.kind===kind)return;
  if(postGameRewardShownSeq===postGameRewardResultSeq)return;
  const base=postGameRewardBase(reward,kind);
  if(base<=0)return;
  postGameRewardShownSeq=postGameRewardResultSeq;
  postGameRewardState={open:true,claimed:false,kind,base,mult:null,normalMult:null,offerMult:0,finalCoins:0,normalCoins:0,boostedCoins:0,adLoading:false,adWatched:false,phase:'running',seq:++postGameRewardSeq,running:false,stopped:false,progress:.02,dir:1,raf:0,tickTimer:0,lastFrame:0};
  hideAllPostRewardPanels();
  const title=postRewardRole(panel,'title');
  const baseEl=postRewardRole(panel,'base');
  const finalEl=postRewardRole(panel,'final');
  const action=postRewardRole(panel,'action');
  const small=postRewardClaimSmall(panel);
  if(title)title.textContent=kind==='win'?'BOSS BONUS':'RUN BONUS';
  if(baseEl)baseEl.textContent=base;
  if(finalEl)finalEl.textContent='STOP';
  if(action)action.textContent='TAP TO STOP';
  if(small)small.textContent='STOP BONUS';
  panel.className='result-bonus-card show';
  panel.style.display='flex';
  panel.style.opacity='1';
  panel.style.visibility='visible';
  panel.style.transform='none';
  panel.style.filter='none';
  panel.style.animation='none';
  panel.setAttribute('aria-hidden','false');
  document.body.classList.add('post-reward-pending');
  renderPostRewardAdOffer(postGameRewardState);
  const hostPanel=panel.closest('.result-panel');
  if(hostPanel){
    try{ hostPanel.scrollTop = Math.max(0, panel.offsetTop - 12); }catch(e){}
  }
  startBonusCursor(postGameRewardState);
  const resultPanel=panel.closest('.result-panel');
  if(resultPanel && resultPanel.scrollIntoView){
    try{panel.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}
  }
  Sensory.play('reward');
  Haptic.pulse('reward');
}
function postGameRewardBurst(){
  const st=postGameRewardState;
  const panel=st?activePostRewardPanel(st.kind):document.querySelector('.result-bonus-card.show');
  const btn=panel?panel.querySelector('.result-bonus-claim'):null;
  if(!btn)return;
  const r=btn.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  const count=st&&st.mult===5?46:st&&st.mult<1?18:30;
  for(let i=0;i<count;i++){
    const s=document.createElement('span');
    s.className='post-reward-burst '+(st&&st.regionCls?'burst-'+st.regionCls:(st?'burst-x'+st.mult:''));
    const a=Math.PI*2*i/count+Math.random()*.35;
    const d=(st&&st.mult===5?80:48)+Math.random()*(st&&st.mult===5?150:105);
    s.style.left=cx+'px';
    s.style.top=cy+'px';
    s.style.setProperty('--bx',Math.cos(a)*d+'px');
    s.style.setProperty('--by',Math.sin(a)*d+'px');
    s.style.animationDelay=(i*7)+'ms';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),980+i*7);
  }
}
function closePostGameReward(clearState){
  if(postGameRewardState)clearBonusCursorLoop(postGameRewardState);
  hideAllPostRewardPanels();
  if(clearState!==false)postGameRewardState=null;
}
function stopPostGameReward(){
  const st=postGameRewardState;
  if(!st||st.claimed||st.stopped)return;
  st.running=false;
  st.stopped=true;
  st.phase='stopped';
  clearBonusCursorLoop(st);
  const region=bonusRegionAt(st.progress);
  st.mult=region.mult;
  st.normalMult=region.mult;
  st.regionCls=region.cls;
  st.normalCoins=Math.max(0,Math.round(st.base*region.mult));
  st.finalCoins=st.normalCoins;
  st.offerMult=region.mult>0?pickPostRewardAdMult(region.mult):0;
  st.boostedCoins=st.offerMult>0?Math.max(0,Math.round(st.base*st.offerMult)):0;
  if(st.offerMult>region.mult)st.phase='offer';
  const panel=activePostRewardPanel(st.kind);
  if(panel){
    panel.classList.add('stopped','result-'+region.cls);
    panel.dataset.resultMult=String(region.mult);
    const finalEl=postRewardRole(panel,'final');
    const action=postRewardRole(panel,'action');
    const small=postRewardClaimSmall(panel);
    if(finalEl)finalEl.textContent='+'+st.finalCoins;
    if(action)action.textContent=st.phase==='offer'?'CLAIM OR BOOST':region.label;
    if(small)small.textContent='NORMAL CLAIM';
    panel.querySelectorAll('.result-bonus-zone').forEach(z=>z.classList.remove('won'));
    const zone=panel.querySelector('.zone-'+region.cls);
    if(zone)zone.classList.add('won');
    renderPostRewardAdOffer(st);
  }
  if(region.mult===5){
    rewardFlash('gold');shake(.75);Sensory.play('chest');Haptic.pulse('chest');
    floatTxt('x5 JACKPOT!',innerWidth*.5,innerHeight*.34,'#FFD740',48,'spin');
  }else if(region.mult<1){
    shake(.18);Sensory.play('reward');Haptic.pulse('reward');
    floatTxt(region.label,innerWidth*.5,innerHeight*.34,'#B0BEC5',34,'');
  }else{
    rewardFlash(region.mult>=3?'blue':'gold');shake(.35);Sensory.play('reward');Haptic.pulse('reward');
    floatTxt(region.label,innerWidth*.5,innerHeight*.34,region.mult>=3?'#00E5FF':'#69F0AE',38,'spin');
  }
}
function watchPostGameRewardAd(){
  const st=postGameRewardState;
  if(!st||st.claimed||!st.stopped||st.normalMult<=0||!st.offerMult||st.offerMult<=st.normalMult)return;
  if(st.adLoading)return;
  st.adLoading=true;
  st.phase='ad-loading';
  const panel=activePostRewardPanel(st.kind);
  if(panel){
    panel.classList.add('ad-loading');
    const title=postRewardRole(panel,'ad-title');
    const sub=postRewardRole(panel,'ad-sub');
    const action=postRewardRole(panel,'action');
    const finalEl=postRewardRole(panel,'final');
    const small=postRewardClaimSmall(panel);
    if(title)title.textContent='AD BOOST LOADING';
    if(sub)sub.textContent='Rewarded ad loading. Stay ready.';
    if(action)action.textContent='AD BOOST';
    if(finalEl)finalEl.textContent='x'+st.offerMult;
    if(small)small.textContent='REWARDED AD';
    renderPostRewardAdOffer(st);
  }
  Sensory.play('reward');Haptic.pulse('reward');
  showRewardedAd({
    context:'bonus_boost',
    onComplete:()=>{
      if(postGameRewardState!==st||st.claimed)return;
      st.adLoading=false;
      st.adWatched=true;
      st.phase='ad-success';
      st.mult=st.offerMult;
      st.finalCoins=st.boostedCoins;
      const p=activePostRewardPanel(st.kind);
      if(p){
        p.classList.remove('ad-loading');
        p.classList.add('ad-success');
        const title=postRewardRole(p,'ad-title');
        const sub=postRewardRole(p,'ad-sub');
        const action=postRewardRole(p,'action');
        const finalEl=postRewardRole(p,'final');
        const small=postRewardClaimSmall(p);
        const watch=p.querySelector('.result-ad-watch');
        if(title)title.textContent='AD COMPLETE';
        if(sub)sub.textContent='Boost applied. Coins are flying now.';
        if(action)action.textContent='BOOSTED x'+st.offerMult;
        if(finalEl)finalEl.textContent='+'+st.finalCoins;
        if(small)small.textContent='AD REWARD';
        if(watch)watch.textContent='AD COMPLETE';
      }
      rewardFlash('gold');shake(st.offerMult>=10?.72:.45);Sensory.play(st.offerMult>=10?'chest':'reward');Haptic.pulse('reward');
      floatTxt('AD BOOST x'+st.offerMult,innerWidth*.5,innerHeight*.32,st.offerMult>=10?'#FFD740':'#00E5FF',46,'spin');
      setTimeout(()=>claimPostGameReward('ad'),360);
    },
    onFail:(reason)=>{
      if(postGameRewardState!==st||st.claimed)return;
      st.adLoading=false;
      st.phase='ad-failed';
      const p=activePostRewardPanel(st.kind);
      if(p){
        p.classList.remove('ad-loading');
        p.classList.add('ad-failed');
        const title=postRewardRole(p,'ad-title');
        const sub=postRewardRole(p,'ad-sub');
        const action=postRewardRole(p,'action');
        const small=postRewardClaimSmall(p);
        if(title)title.textContent=reason==='frequency_limit'?'AD LIMIT REACHED':'AD NOT READY';
        if(sub)sub.textContent='Claim the normal bonus now, or try again in a bit.';
        if(action)action.textContent='CLAIM NORMAL';
        if(small)small.textContent='NORMAL CLAIM';
      }
      Sensory.play('bad');Haptic.pulse('bad');
    }
  });
}
function claimPostGameReward(mode){
  const st=postGameRewardState;
  if(!st||st.claimed||!playerData){closePostGameReward();return;}
  if(st.running&&!st.stopped){stopPostGameReward();return;}
  if(st.adLoading)return;
  if(mode==='ad'&&!st.adWatched){watchPostGameRewardAd();return;}
  if(mode==='normal'&&!st.adWatched){
    st.mult=st.normalMult;
    st.finalCoins=st.normalCoins;
    st.phase='claim-normal';
  }
  st.claimed=true;
  const panel=activePostRewardPanel(st.kind);
  if(panel){
    panel.classList.add('claimed');
    panel.classList.toggle('ad-success',!!st.adWatched);
    renderPostRewardAdOffer(st);
  }
  const before=Math.max(0,Math.round(playerData.coins||0));
  const gained=addCoins(st.finalCoins,{silent:true});
  saveGame();refreshMetaUI();
  updateResultWallet(st.kind,before);
  if(gained>0){
    animateWalletCount(st.kind,before,playerData.coins,950);
    const claimBtn=panel?panel.querySelector('.result-bonus-claim'):null;
    if(claimBtn && typeof CoinFX!=='undefined' && CoinFX.gain){
      CoinFX.gain(gained,claimBtn);
    }else{
      animateRewardCoinsToWallet(st.kind,gained);
    }
    postGameRewardBurst();
    floatTxt((st.adWatched?'AD BONUS +':'BONUS +')+gained,innerWidth*.5,innerHeight*.34,st.adWatched?'#FFD740':'#FFD740',44,'spin');
  }else{
    updateResultWallet(st.kind,before);
    postGameRewardBurst();
  }
  setTimeout(()=>closePostGameReward(),gained>0?1200:850);
}
document.addEventListener('keydown',e=>{
  const panel=document.querySelector('.result-bonus-card.show');
  if(!panel)return;
  if(e.code==='Space'||e.key===' '||e.key==='Enter'){
    e.preventDefault();
    claimPostGameReward();
  }
});
document.addEventListener('pointerdown',e=>{
  const card=e.target&&e.target.closest?e.target.closest('.result-bonus-card.show'):null;
  if(!card)return;
  if(e.target.closest('.result-bonus-skip'))return;
  const st=postGameRewardState;
  const wantsMainClaim=e.target.closest('.result-bonus-claim');
  const wantsStop=e.target.closest('.result-bonus-track,.result-bonus-hit,.result-bonus-zone,.result-bonus-cursor');
  if(wantsMainClaim)return;
  if(wantsStop&&st&&!st.stopped){
    e.preventDefault();
    claimPostGameReward();
  }
},{capture:true});

function targetHumansForLevel(){
  const profile=runDifficultyProfile(currentRunLevel);
  return profile.targetHumans||targetHumansCurve(currentRunLevel||1);
}
function buildFailTip(){
  const total=(goodChoices||0)+(badChoices||0);
  const target=targetHumansForLevel();
  const early=dist < C.bossDist*.55;
  const peakNow=Math.max(peak||0,crowd||0);
  if(early || peakNow<target*.85){
    return{reason:'Small team',fix:'Pick better gates',msg:'You need more humans before the final fight.'};
  }
  if(total>=3 && maxComboThisRun<3){
    return{reason:'Low combo',fix:'Keep good gates',msg:'A stronger combo gives better rewards.'};
  }
  if((bossFightInitAI>0||bossActive||bossClashDone) && !bossPlayerWins){
    return{reason:'AI was stronger',fix:'Save more humans',msg:'Reach the clash with a bigger team.'};
  }
  return{reason:'Need more coins',fix:'Win more runs',msg:'Earn coins from cleaner runs and boss wins.'};
}
function applyFailTipToResult(tip){
  lastFailReason=tip.reason;
  lastFailFix=tip.fix;
  setText('fail-reason',tip.reason);
  setText('fail-fix',tip.fix);
}

function updateLossCloseHook(tip){
  const reachedBoss=!!(bossFightInitAI>0||bossActive||bossClashDone);
  const pctRaw=(C&&C.bossDist)?(dist/C.bossDist)*100:0;
  const pct=reachedBoss?100:Math.max(0,Math.min(99,Math.round(pctRaw)));
  setText('over-dist-pct',pct+'%');
  setBar('over-dist-fill',0);
  setTimeout(()=>setBar('over-dist-fill',pct),80);

  let gap='Reach the final clash with a bigger team.';
  if(reachedBoss&&bossFightInitAI>0){
    const humanStart=Math.max(0,Math.round(bossFightInitHumans||0));
    const aiStart=Math.max(0,Math.round(bossFightInitAI||0));
    const target=targetHumansForLevel();
    const needHumans=Math.max(0,aiStart-humanStart+5);
    if(needHumans>0){
      gap='You needed <b>'+needHumans+'</b> more humans before the clash.';
    }else if(maxComboThisRun<5){
      gap='A bigger combo could flip this fight. Aim for <b>COMBO x5</b>.';
    }else if(humanStart<target){
      gap='Target for this level: <b>'+target+'</b> humans before the AI army.';
    }else{
      gap='This was close. Cleaner gates can flip it.';
    }
  }else{
    const remaining=Math.max(0,Math.round((C&&C.bossDist?C.bossDist:520)-dist));
    if(crowd<=0){
      gap='You lost the team early. Avoid red gates and rebuild fast.';
    }else if(pct>=70){
      gap='Only <b>'+remaining+'</b> distance left before the AI army.';
    }else if(tip&&tip.reason==='Small team'){
      gap='Build a bigger team before the final fight.';
    }else{
      gap='Push farther next run and save humans for the clash.';
    }
  }
  const el=document.getElementById('over-dist-gap');
  if(el)el.innerHTML=gap;
}
function dynamicWinTitle(survivors){
  if(survivors>=300)return 'AI ARMY OBLITERATED!';
  if(survivors>=120)return 'AI ARMY DESTROYED!';
  return 'AI ARMY DEFEATED!';
}
function survivorResultText(survivors){
  const n=Math.max(0,Math.round(Number(survivors)||0));
  return n+' survivor'+(n===1?'':'s')+' remain'+(n===1?'s':'')+'. Reward saved.';
}
function dynamicLoseTitle(){
  return crowd<=0?'HUMANS LOST':'MISSION FAILED';
}
function updateWinResultActionForWorldUnlock(world){
  const btn=document.getElementById('win-play-btn');
  if(!btn)return;
  if(world){
    btn.classList.remove('btn-blue');
    btn.classList.add('btn-map-unlock');
    btn.innerHTML='<span class="ui-icon icon-map" aria-hidden="true"></span>NEW MAP';
    btn.onclick=continueToWorldMap;
    btn.setAttribute('aria-label','Open new map for '+(world.name||'new planet'));
  }else{
    btn.classList.add('btn-blue');
    btn.classList.remove('btn-map-unlock');
    btn.innerHTML='<span class="ui-icon icon-play" aria-hidden="true"></span>PLAY';
    btn.onclick=startGame;
    btn.setAttribute('aria-label','Play next level');
  }
}

function continueToMenu(){
  cancelAutoBossChestOpen();
  closePostGameReward();
  closeResurrectOffer();
  closeSkinReveal();
  skinRevealSeq++;
  resurrectOfferState=null;
  hideWorldUnlockCinematic();
  postGameRewardResultSeq++;
  postGameRewardShownSeq=0;
  clearRewardLadder('win');clearRewardLadder('over');
  gState='MENU';
  setScreenMode('menu');
  document.getElementById('s-win').style.display='none';document.getElementById('s-over').style.display='none';document.getElementById('s-shop').style.display='none';document.getElementById('s-win').classList.remove('active');document.getElementById('s-over').classList.remove('active');
  document.getElementById('s-menu').style.display='flex';refreshMetaUI();checkDailyRewardAuto();
  const bossHud=document.getElementById('boss-hud');
  if(bossHud)bossHud.style.display='none';
  hideClashCounters();
  if(window.MenuGameplayPreview){
    MenuGameplayPreview.invalidate();
    requestAnimationFrame(()=>MenuGameplayPreview.ensure());
    setTimeout(()=>MenuGameplayPreview.ensure(),80);
  }
}
function continueToWorldMap(){
  const id=pendingNewWorldId() || lastWorldUnlockId || '';
  continueToMenu();
  setTimeout(()=>{
    if(window.openSpaceMap)window.openSpaceMap(null,{autoSelectNew:true,worldId:id,fromResult:true});
  },140);
}
function drawSpecialSkinTex(ctx,s){
  const fx=s.fx||s.id, accent=s.accent||'#fff', glow=s.glow||accent, body=s.body||accent;
  const w=192,h=192;
  const line=(col,width,points)=>{
    ctx.strokeStyle=col;ctx.lineWidth=width;ctx.beginPath();
    points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.stroke();
  };
  const dot=(x,y,r,col)=>{
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  };
  ctx.save();
  ctx.globalAlpha=.92;
  if(fx==='plasma'){
    ctx.fillStyle='rgba(0,0,0,.24)';ctx.fillRect(0,0,w,h);
    for(let i=0;i<9;i++)line(i%2?accent:glow,3,[[Math.random()*w,0],[40+Math.random()*112,96],[Math.random()*w,h]]);
    for(let i=0;i<24;i++)dot(Math.random()*w,Math.random()*h,3+Math.random()*9,hexToRgba(i%2?accent:glow,.22));
  }else if(fx==='samurai'){
    ctx.fillStyle='rgba(20,0,0,.30)';ctx.fillRect(0,0,w,h);
    for(let y=12;y<h;y+=25){ctx.fillStyle=hexToRgba(accent,.22);ctx.fillRect(0,y,w,8);}
    line(glow,7,[[12,170],[178,24]]);line('rgba(255,255,255,.65)',2,[[28,160],[178,42]]);
  }else if(fx==='angel'){
    const rg=ctx.createRadialGradient(96,40,8,96,96,130);rg.addColorStop(0,hexToRgba(glow,.65));rg.addColorStop(1,'transparent');ctx.fillStyle=rg;ctx.fillRect(0,0,w,h);
    for(let a=-70;a<=70;a+=14)line(hexToRgba(accent,.36),3,[[96,26],[96+Math.sin(a)*96,h]]);
    ctx.strokeStyle=hexToRgba('#ffffff',.52);ctx.lineWidth=4;ctx.beginPath();ctx.arc(96,62,36,0,Math.PI*2);ctx.stroke();
  }else if(fx==='demon'){
    ctx.fillStyle='rgba(0,0,0,.34)';ctx.fillRect(0,0,w,h);
    for(let i=0;i<22;i++){ctx.fillStyle=i%2?hexToRgba(accent,.44):hexToRgba(glow,.36);ctx.beginPath();ctx.ellipse(Math.random()*w,130+Math.random()*66,8+Math.random()*18,20+Math.random()*32,Math.random()*Math.PI,0,Math.PI*2);ctx.fill();}
    for(let i=0;i<8;i++)line(hexToRgba('#000000',.45),3,[[Math.random()*w,0],[Math.random()*w,h]]);
  }else if(fx==='dragon'){
    ctx.fillStyle=hexToRgba('#001b10',.30);ctx.fillRect(0,0,w,h);
    ctx.strokeStyle=hexToRgba(accent,.55);ctx.lineWidth=3;
    for(let y=-10;y<h+20;y+=18){for(let x=-12;x<w+20;x+=24){ctx.beginPath();ctx.arc(x+(y%36?12:0),y,15,0,Math.PI);ctx.stroke();}}
  }else if(fx==='crystal'){
    for(let i=0;i<26;i++){ctx.fillStyle=hexToRgba(i%2?accent:glow,.25);ctx.beginPath();const x=Math.random()*w,y=Math.random()*h,r=16+Math.random()*28;ctx.moveTo(x,y-r);ctx.lineTo(x+r,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r,y);ctx.closePath();ctx.fill();ctx.strokeStyle=hexToRgba('#ffffff',.28);ctx.stroke();}
  }else if(fx==='thunder'){
    ctx.fillStyle='rgba(0,0,0,.34)';ctx.fillRect(0,0,w,h);
    for(let x=18;x<w;x+=45)line(glow,6,[[x,0],[x+28,52],[x+7,56],[x+48,130],[x+22,124],[x+46,h]]);
    for(let i=0;i<18;i++)dot(Math.random()*w,Math.random()*h,2,hexToRgba(accent,.75));
  }else if(fx==='ghost'){
    ctx.fillStyle='rgba(255,255,255,.16)';ctx.fillRect(0,0,w,h);
    for(let y=6;y<h;y+=22){ctx.strokeStyle=hexToRgba(glow,.34);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(44,y+28,112,y-24,w,y+12);ctx.stroke();}
  }else if(fx==='alien'){
    ctx.fillStyle=hexToRgba('#001d12',.28);ctx.fillRect(0,0,w,h);
    for(let i=0;i<34;i++){dot(Math.random()*w,Math.random()*h,5+Math.random()*11,hexToRgba(i%3?accent:glow,.32));}
    ctx.strokeStyle=hexToRgba(glow,.55);ctx.lineWidth=2;for(let i=0;i<10;i++){ctx.beginPath();ctx.ellipse(Math.random()*w,Math.random()*h,18,7,Math.random()*Math.PI,0,Math.PI*2);ctx.stroke();}
  }else if(fx==='royal'){
    ctx.fillStyle='rgba(0,0,35,.30)';ctx.fillRect(0,0,w,h);
    for(let y=14;y<h;y+=38)line(hexToRgba(accent,.48),5,[[0,y],[48,y+22],[96,y],[144,y+22],[w,y]]);
    for(let i=0;i<5;i++)dot(34+i*31,42,5,hexToRgba(glow,.65));
  }else if(fx==='pharaoh'){
    const rg=ctx.createRadialGradient(96,82,8,96,82,120);rg.addColorStop(0,hexToRgba(accent,.70));rg.addColorStop(1,'transparent');ctx.fillStyle=rg;ctx.fillRect(0,0,w,h);
    for(let a=0;a<Math.PI*2;a+=Math.PI/12)line(hexToRgba(accent,.34),3,[[96,82],[96+Math.cos(a)*120,82+Math.sin(a)*120]]);
    for(let y=20;y<h;y+=34)line(hexToRgba(glow,.50),2,[[0,y],[w,y+12]]);
  }else if(fx==='cyber'){
    ctx.strokeStyle=hexToRgba(glow,.44);ctx.lineWidth=2;
    for(let v=0;v<=w;v+=18){line(hexToRgba(glow,.30),1,[[v,0],[v,h]]);line(hexToRgba(accent,.24),1,[[0,v],[w,v]]);}
    for(let i=0;i<14;i++){ctx.fillStyle=hexToRgba(accent,.30);ctx.fillRect(Math.random()*150,Math.random()*170,30,7);}
  }else if(fx==='void'){
    ctx.fillStyle='rgba(0,0,0,.58)';ctx.fillRect(0,0,w,h);
    for(let i=0;i<130;i++)dot(Math.random()*w,Math.random()*h,Math.random()*2.2,hexToRgba(i%6?accent:glow,.75));
    line(hexToRgba(glow,.42),4,[[24,130],[62,80],[105,110],[150,40],[182,88]]);
  }else if(fx==='frost'){
    ctx.fillStyle=hexToRgba('#ffffff',.16);ctx.fillRect(0,0,w,h);
    for(let i=0;i<20;i++){const x=Math.random()*w,y=Math.random()*h;line(hexToRgba(glow,.46),2,[[x,y],[x+22,y-18],[x+36,y-4]]);}
    for(let i=0;i<36;i++)dot(Math.random()*w,Math.random()*h,2+Math.random()*3,hexToRgba('#ffffff',.42));
  }else if(fx==='solar'){
    const rg=ctx.createRadialGradient(96,120,10,96,96,140);rg.addColorStop(0,hexToRgba(accent,.76));rg.addColorStop(.45,hexToRgba(glow,.34));rg.addColorStop(1,'transparent');ctx.fillStyle=rg;ctx.fillRect(0,0,w,h);
    for(let a=0;a<Math.PI*2;a+=Math.PI/10)line(hexToRgba(glow,.46),5,[[96,96],[96+Math.cos(a)*128,96+Math.sin(a)*128]]);
  }else if(fx==='quantum'){
    ctx.strokeStyle=hexToRgba(accent,.44);ctx.lineWidth=3;
    for(let i=0;i<18;i++){const x=Math.random()*160,y=Math.random()*160,r=14+Math.random()*18;ctx.strokeRect(x,y,r,r);ctx.strokeRect(x+5,y+5,r,r);}
    for(let i=0;i<24;i++)dot(Math.random()*w,Math.random()*h,2+Math.random()*4,hexToRgba(glow,.60));
  }else if(fx==='mecha'){
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle=hexToRgba('#ffffff',.24);ctx.lineWidth=3;
    for(let y=10;y<h;y+=36){for(let x=8;x<w;x+=42){ctx.strokeRect(x,y,31,24);dot(x+25,y+7,3,hexToRgba(glow,.55));}}
    line(hexToRgba(accent,.48),5,[[0,112],[w,72]]);
  }else if(fx==='reaper'){
    ctx.fillStyle='rgba(0,0,0,.52)';ctx.fillRect(0,0,w,h);
    for(let i=0;i<10;i++)line(hexToRgba(glow,.50),4,[[Math.random()*w,0],[Math.random()*w,h]]);
    for(let y=0;y<h;y+=20){ctx.strokeStyle=hexToRgba('#000000',.40);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,y);ctx.quadraticCurveTo(96,y+28,w,y);ctx.stroke();}
  }else if(fx==='nebula'){
    const rg=ctx.createRadialGradient(70,60,6,96,96,150);rg.addColorStop(0,hexToRgba(accent,.62));rg.addColorStop(.38,hexToRgba(glow,.30));rg.addColorStop(1,'transparent');ctx.fillStyle=rg;ctx.fillRect(0,0,w,h);
    for(let i=0;i<160;i++)dot(Math.random()*w,Math.random()*h,Math.random()*2.2,hexToRgba(i%7?'#ffffff':glow,.78));
  }else if(fx==='omega'){
    ctx.fillStyle=hexToRgba('#ffffff',.18);ctx.fillRect(0,0,w,h);
    ctx.strokeStyle=hexToRgba(glow,.46);ctx.lineWidth=3;
    for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(96,96,18+i*13,0,Math.PI*2);ctx.stroke();}
    for(let x=0;x<w;x+=32)line(hexToRgba(accent,.36),2,[[x,0],[w-x,h]]);
  }
  ctx.restore();
}
function makeSkinTex(s){
  if(skinTexCache[s.id])return skinTexCache[s.id];
  const cv=document.createElement('canvas');cv.width=192;cv.height=192;const ctx=cv.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,192,192);
  grad.addColorStop(0,s.accent);grad.addColorStop(.48,s.body);grad.addColorStop(1,'#050512');
  ctx.fillStyle=grad;ctx.fillRect(0,0,192,192);
  // universal fabric/paint grain
  for(let i=0;i<900;i++){
    ctx.fillStyle=`rgba(255,255,255,${Math.random()*.055})`;
    ctx.fillRect(Math.random()*192,Math.random()*192,1,1);
  }
  ctx.globalAlpha=.95;
  if(s.id==='ice'){
    ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=4;
    for(let x=-120;x<260;x+=26){ctx.beginPath();ctx.moveTo(x,192);ctx.lineTo(x+130,0);ctx.stroke();}
    ctx.fillStyle='rgba(128,216,255,.26)';for(let i=0;i<26;i++){ctx.beginPath();ctx.arc(Math.random()*192,Math.random()*192,3+Math.random()*6,0,Math.PI*2);ctx.fill();}
  } else if(s.id==='fire'){
    const fg=ctx.createLinearGradient(0,192,0,10);fg.addColorStop(0,'rgba(255,215,64,.75)');fg.addColorStop(.36,'rgba(255,111,0,.50)');fg.addColorStop(.78,'rgba(255,23,68,.16)');fg.addColorStop(1,'transparent');ctx.fillStyle=fg;ctx.fillRect(0,0,192,192);
    for(let i=0;i<18;i++){ctx.fillStyle=i%2?'rgba(255,215,64,.36)':'rgba(255,23,68,.32)';ctx.beginPath();ctx.ellipse(Math.random()*192,155+Math.random()*44,14+Math.random()*22,24+Math.random()*35,Math.random()*Math.PI,0,Math.PI*2);ctx.fill();}
  } else if(s.id==='robot'){
    ctx.strokeStyle='rgba(0,229,255,.42)';ctx.lineWidth=2;
    for(let v=0;v<192;v+=20){ctx.beginPath();ctx.moveTo(v,0);ctx.lineTo(v,192);ctx.stroke();ctx.beginPath();ctx.moveTo(0,v);ctx.lineTo(192,v);ctx.stroke();}
    ctx.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<10;i++){ctx.fillRect(Math.random()*160,Math.random()*160,24,8);}
  } else if(s.id==='ninja'){
    ctx.fillStyle='rgba(0,0,0,.55)';for(let y=8;y<192;y+=28){ctx.fillRect(0,y,192,10);}ctx.strokeStyle='rgba(213,0,249,.42)';ctx.lineWidth=3;ctx.strokeRect(18,18,156,156);ctx.strokeRect(34,34,124,124);
  } else if(s.id==='gold'){
    ctx.fillStyle='rgba(255,255,255,.24)';for(let x=-160;x<260;x+=34){ctx.beginPath();ctx.moveTo(x,192);ctx.lineTo(x+140,0);ctx.lineTo(x+165,0);ctx.lineTo(x+25,192);ctx.fill();}
    ctx.strokeStyle='rgba(93,64,55,.20)';ctx.lineWidth=3;for(let y=14;y<192;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(192,y+20);ctx.stroke();}
  } else if(s.id==='toxic'){
    ctx.fillStyle='rgba(12,30,0,.30)';ctx.fillRect(0,0,192,192);ctx.strokeStyle='rgba(198,255,0,.58)';ctx.lineWidth=3;for(let i=0;i<42;i++){ctx.beginPath();ctx.arc(Math.random()*192,Math.random()*192,4+Math.random()*14,0,Math.PI*2);ctx.stroke();}
  } else if(s.id==='galaxy'){
    ctx.fillStyle='rgba(0,0,32,.70)';ctx.fillRect(0,0,192,192);for(let i=0;i<170;i++){ctx.fillStyle=i%7?'rgba(255,255,255,.82)':'rgba(0,229,255,.92)';const r=1+Math.random()*2.4;ctx.fillRect(Math.random()*192,Math.random()*192,r,r);}
    const ng=ctx.createRadialGradient(60,60,10,96,96,140);ng.addColorStop(0,'rgba(234,128,252,.55)');ng.addColorStop(.42,'rgba(0,229,255,.20)');ng.addColorStop(1,'transparent');ctx.fillStyle=ng;ctx.fillRect(0,0,192,192);
  } else if(s.id==='shadow'){
    const vg=ctx.createRadialGradient(52,44,4,96,96,150);
    vg.addColorStop(0,'rgba(124,77,255,.48)');
    vg.addColorStop(.34,'rgba(24,32,88,.42)');
    vg.addColorStop(1,'rgba(0,0,0,.70)');
    ctx.fillStyle=vg;ctx.fillRect(0,0,192,192);
    for(let y=4;y<192;y+=22){
      ctx.strokeStyle=y%44?'rgba(124,77,255,.34)':'rgba(128,216,255,.24)';
      ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(44,y-22,104,y+28,192,y-4);ctx.stroke();
    }
    ctx.fillStyle='rgba(199,216,255,.70)';
    for(let i=0;i<42;i++){ctx.fillRect(Math.random()*192,Math.random()*192,1+Math.random()*1.8,1+Math.random()*1.8);}
  } else if(s.fx){
    drawSpecialSkinTex(ctx,s);
  } else {
    ctx.strokeStyle='rgba(255,255,255,.20)';ctx.lineWidth=3;for(let x=-128;x<256;x+=24){ctx.beginPath();ctx.moveTo(x,192);ctx.lineTo(x+150,0);ctx.stroke();}
  }
  ctx.globalAlpha=1;
  const tex=new THREE.CanvasTexture(cv);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(1,1);skinTexCache[s.id]=tex;return tex;
}
function applyEquippedSkin(){
  if(!playerData||!matHumanBody)return;
  const s=skinById(activeRunSkinId());const tex=makeSkinTex(s);
  const legendary=s.rarity==='LEGENDARY'||s.rarity==='MYTHIC';
  const metal=s.id==='robot'||s.id==='gold'||s.id==='mecha_gold'||s.fx==='cyber'||s.fx==='omega';
  matHumanBody.color.set(s.body);matHumanBody.emissive.set(s.glow);matHumanBody.emissiveIntensity=legendary?.34:.22;matHumanBody.map=tex;matHumanBody.roughness=metal?.30:.48;matHumanBody.metalness=metal?.45:.06;matHumanBody.needsUpdate=true;
  matHuman.color.set(s.accent);matHuman.emissive.set(s.glow);matHuman.emissiveIntensity=legendary?.28:.18;matHuman.map=tex;matHuman.roughness=metal?.30:.50;matHuman.metalness=metal?.35:.04;matHuman.needsUpdate=true;
  matHumanSkin.color.set(s.skin);matHumanSkin.emissive.set(s.glow);matHumanSkin.emissiveIntensity=s.id==='galaxy'||s.id==='shadow'?.08:.03;matHumanSkin.needsUpdate=true;
  matShoe.color.set(s.shoe);matShoe.emissive.set(s.glow);matShoe.emissiveIntensity=.10;matShoe.needsUpdate=true;
  matBelt.color.set(rarityColor(s.rarity));matBelt.needsUpdate=true;
  if(typeof LeaderFX!=='undefined'&&LeaderFX&&LeaderFX.applySkin)LeaderFX.applySkin(s);
  const bg=document.getElementById('prog-bg');
  if(bg)bg.style.background=s.body+'33';
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   RENDERER + SCENE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function detectWebGL(){
  try{
    const canvas=document.createElement('canvas');
    return !!(window.WebGLRenderingContext&&(canvas.getContext('webgl')||canvas.getContext('experimental-webgl')));
  }catch(e){return false;}
}
function showWebGLFallback(){
  document.body.innerHTML='<div class="webgl-fallback" style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#06000f;font-family:Rajdhani,Arial,sans-serif;text-align:center;color:#fff;padding:2rem"><div><div style="font-size:52px;margin-bottom:16px">!</div><h2 style="font-size:28px;color:#FFD740;margin:0 0 12px">DEVICE NOT SUPPORTED</h2><p style="color:rgba(255,255,255,.70);font-size:16px;line-height:1.7;margin:0">Your browser does not support 3D graphics (WebGL).<br>Try Chrome or Firefox on a newer device.</p></div></div>';
}
if(!detectWebGL()){
  showWebGLFallback();
  throw new Error('WebGL not supported');
}
const rendererDpr=Math.min(window.devicePixelRatio||1, window.PerfMode ? PerfMode.dprCap() : (IS_MOBILE?1.25:2));
renderer=new THREE.WebGLRenderer({antialias:!IS_MOBILE&&rendererDpr<2,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);
// Mobile: cap DPR at 1.25 (cuts fragment work ~56% vs DPR=2)
renderer.setPixelRatio(rendererDpr);
// Mobile: no shadow maps â€” biggest single GPU saving, invisible at this camera angle
renderer.shadowMap.enabled=!IS_MOBILE;
if(!IS_MOBILE) renderer.shadowMap.type=THREE.PCFSoftShadowMap;
// Mobile: skip ACES filmic tone-map + sRGB conversion post-process passes
// sRGBEncoding: built-in shader output path â€” essentially free on all devices.
// LinearToneMapping on mobile: just colourÃ—exposure, almost no cost vs ACESFilmic.
renderer.outputEncoding  = THREE.sRGBEncoding; // always â€” preserves correct colours
renderer.toneMapping     = IS_MOBILE ? THREE.LinearToneMapping : THREE.ACESFilmicToneMapping;
// Slightly higher exposure on mobile to match ACES brightness without the ACES cost
renderer.toneMappingExposure = IS_MOBILE ? 1.55 : 1.2;
document.body.prepend(renderer.domElement);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, window.PerfMode ? PerfMode.dprCap() : (IS_MOBILE?1.25:2)));refreshScreenSpaceBackdrops();});
flashEl=document.getElementById('reward-flash');
// Cache hot-path DOM refs once (elements exist in HTML from page load)
_hudCrowdEl  = document.getElementById('crowd-lbl');
_hudProgEl   = document.getElementById('prog-fill');
_hudDistEl   = document.getElementById('dist-lbl');
_hudFloatsEl = document.getElementById('floats');
_dodgeWarnEl = document.getElementById('dodge-warn');
_dangerEdgeEl= document.getElementById('danger-edge');

scene=new THREE.Scene();
scene.background=new THREE.Color(0x070010);
scene.fog=new THREE.FogExp2(0x0d0018,.009);
camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,220);
camera.position.set(0,9,-12);
camera.lookAt(0,0,20);

const amb=new THREE.AmbientLight(0x0a0020,.6); scene.add(amb);
const hemi=new THREE.HemisphereLight(0x2244aa,0x110022,.7); scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff5e0,1.25);
sun.position.set(10,22,8);
if(!IS_MOBILE){
  sun.castShadow=true;
  sun.shadow.mapSize.set(512,512); // was 1024 â€” 4Ã— memory saving; 512 still sharp enough
  sun.shadow.camera.left=sun.shadow.camera.bottom=-30;
  sun.shadow.camera.right=sun.shadow.camera.top=30;
  sun.shadow.camera.far=100;
}
scene.add(sun);
const aiLight=new THREE.PointLight(0xFF3030,2.5,35); aiLight.position.set(0,6,30); scene.add(aiLight);
const humanLight=new THREE.PointLight(0x0099FF,1.8,28); humanLight.position.set(0,4,-8); scene.add(humanLight);

clock=new THREE.Clock();
dummy=new THREE.Object3D();


function paintRedDustSky(ctx,w,h){
  const g=ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'#4a0d12');
  g.addColorStop(.28,'#34101a');
  g.addColorStop(.62,'#220a16');
  g.addColorStop(1,'#170713');
  ctx.fillStyle=g;
  ctx.fillRect(0,0,w,h);

  const glow=ctx.createRadialGradient(w*.5,h*.15,10,w*.5,h*.32,w*.7);
  glow.addColorStop(0,'rgba(255,140,75,.20)');
  glow.addColorStop(.45,'rgba(255,90,45,.10)');
  glow.addColorStop(1,'rgba(255,90,45,0)');
  ctx.fillStyle=glow;
  ctx.fillRect(0,0,w,h);

  for(let i=0;i<170;i++){
    const y=h*.18+Math.random()*h*.55;
    const a=.018+Math.random()*.045;
    ctx.fillStyle=`rgba(255,190,130,${a})`;
    ctx.fillRect(Math.random()*w,y,30+Math.random()*170,1+Math.random()*2.2);
  }

  for(let i=0;i<95;i++){
    const x=Math.random()*w;
    const y=Math.random()*h;
    const r=.35+Math.random()*1.05;
    const a=.08+Math.random()*.22;
    ctx.beginPath();
    ctx.fillStyle=`rgba(255,240,225,${a})`;
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }
}


// Full-screen star layer attached to the camera.
// This fills ALL empty black parts of the screen, including the lower sides under the road.
function initCameraStarBackdrop(){
  const cv=document.createElement('canvas');
  cv.width=IS_MOBILE?640:1280; cv.height=IS_MOBILE?360:720;
  const ctx=cv.getContext('2d');
  paintRedDustSky(ctx,cv.width,cv.height);
  const tex=new THREE.CanvasTexture(cv);
  tex.minFilter=THREE.LinearFilter;
  tex.magFilter=THREE.LinearFilter;
  cameraStarBackdrop=new THREE.Mesh(
    new THREE.PlaneGeometry(2,2),
    new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:1,depthWrite:false,depthTest:false,fog:false})
  );
  cameraStarBackdrop.position.set(0,0,-100);
  cameraStarBackdrop.userData.screenSpace=true;
  cameraStarBackdrop.renderOrder=-10000;
  scene.add(camera);
  camera.add(cameraStarBackdrop);
  refreshScreenSpaceBackdrops();
}
initCameraStarBackdrop();

function fitPlaneToCamera(mesh,distance,pad=1.08){
  if(!mesh||!camera)return;
  const dist=Math.max(.01,distance||Math.abs(mesh.position.z)||100);
  const vFov=(camera.fov*Math.PI)/180;
  const h=2*Math.tan(vFov/2)*dist*pad;
  const w=h*camera.aspect;
  mesh.scale.set(w/2,h/2,1);
}
function refreshScreenSpaceBackdrops(){
  if(skyBackdrop&&skyBackdrop.userData&&skyBackdrop.userData.screenSpace){
    fitPlaneToCamera(skyBackdrop,Math.abs(skyBackdrop.position.z),1.12);
  }
  if(cameraStarBackdrop&&cameraStarBackdrop.userData&&cameraStarBackdrop.userData.screenSpace){
    fitPlaneToCamera(cameraStarBackdrop,Math.abs(cameraStarBackdrop.position.z),1.10);
  }
  if(cameraAtmosphereOverlay&&cameraAtmosphereOverlay.userData&&cameraAtmosphereOverlay.userData.screenSpace){
    fitPlaneToCamera(cameraAtmosphereOverlay,Math.abs(cameraAtmosphereOverlay.position.z),1.14);
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   LANE (road with glowing edges)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function initLane(){
  const roadTex=makeRoadTex();
  window.__activeRoadTex=roadTex;
  const sm=new THREE.MeshLambertMaterial({map:roadTex,color:0xffffff,emissive:0x001018,emissiveIntensity:.05});
  const em=new THREE.MeshBasicMaterial({color:0x00BFFF,transparent:true,opacity:.82});
  const dash=new THREE.MeshBasicMaterial({color:0x00336688,transparent:true,opacity:.5});
  const reactTex=makeRoadReactTex();
  const reactGeo=new THREE.PlaneGeometry(C.laneW*.72,C.segLen*1.10);
  for(let i=0;i<C.segs;i++){
    const g=new THREE.Group();
    const f=new THREE.Mesh(new THREE.BoxGeometry(C.laneW,.12,C.segLen),sm);
    f.userData.role='road';
    f.receiveShadow=true; g.add(f);
    for(const sx of[-C.laneW/2,C.laneW/2]){
      const e=new THREE.Mesh(new THREE.BoxGeometry(.08,.20,C.segLen),em);
      e.userData.role='edge';
      e.position.set(sx,.12,0); g.add(e);
    }
    const react=new THREE.Mesh(reactGeo,new THREE.MeshBasicMaterial({
      map:reactTex,color:0x00E5FF,transparent:true,opacity:0,depthWrite:false,
      blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false
    }));
    react.userData.role='roadReact';
    react.rotation.x=-Math.PI/2;
    react.position.set(0,.095,0);
    react.renderOrder=1;
    g.add(react);
    for(let j=-C.segLen/2+3;j<C.segLen/2;j+=7){
      const d=new THREE.Mesh(new THREE.BoxGeometry(.07,.14,3.2),dash);
      d.userData.role='dash';
      d.position.set(0,.07,j); g.add(d);
    }
    addMarsFloorDeco(g,i);
    g.position.z=i*C.segLen-6;
    scene.add(g); laneTiles.push(g);
  }
})();

function makeRoadReactTex(){
  const cv=document.createElement('canvas');cv.width=128;cv.height=256;
  const ctx=cv.getContext('2d');
  ctx.clearRect(0,0,128,256);
  const gx=ctx.createLinearGradient(0,0,128,0);
  gx.addColorStop(0,'rgba(255,255,255,0)');
  gx.addColorStop(.22,'rgba(255,255,255,.10)');
  gx.addColorStop(.50,'rgba(255,255,255,.88)');
  gx.addColorStop(.78,'rgba(255,255,255,.10)');
  gx.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=gx;ctx.fillRect(0,0,128,256);
  ctx.globalCompositeOperation='lighter';
  for(let y=-24;y<280;y+=48){
    const gy=ctx.createLinearGradient(0,y,0,y+38);
    gy.addColorStop(0,'rgba(255,255,255,0)');
    gy.addColorStop(.45,'rgba(255,255,255,.55)');
    gy.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=gy;
    ctx.beginPath();
    ctx.moveTo(64,y);
    ctx.lineTo(98,y+22);
    ctx.lineTo(76,y+22);
    ctx.lineTo(76,y+38);
    ctx.lineTo(52,y+38);
    ctx.lineTo(52,y+22);
    ctx.lineTo(30,y+22);
    ctx.closePath();
    ctx.fill();
  }
  const tex=new THREE.CanvasTexture(cv);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.repeat.set(1,2.6);
  tex.offset.set(0,0);
  tex.userData={scrollSpeed:1.15};
  return tex;
}

function makeRoadTex(){
  // V15: neon metal road texture with direction arrows, tiny scratches, and animated UV offset.
  const cv=document.createElement('canvas'); cv.width=256;cv.height=256;
  const ctx=cv.getContext('2d');
  const g=ctx.createLinearGradient(0,0,0,256);
  g.addColorStop(0,'#161622'); g.addColorStop(.48,'#090A13'); g.addColorStop(1,'#17172A');
  ctx.fillStyle=g; ctx.fillRect(0,0,256,256);
  // asphalt/metal noise
  for(let i=0;i<1600;i++){
    const a=Math.random()*.085;
    ctx.fillStyle=`rgba(${120+Math.random()*70|0},${150+Math.random()*70|0},255,${a})`;
    ctx.fillRect(Math.random()*256,Math.random()*256,1,1);
  }
  // road grid
  ctx.lineWidth=1;
  for(let y=0;y<256;y+=32){ctx.strokeStyle='rgba(0,229,255,.13)';ctx.beginPath();ctx.moveTo(0,y+.5);ctx.lineTo(256,y+.5);ctx.stroke();}
  for(let x=0;x<256;x+=32){ctx.strokeStyle='rgba(255,255,255,.05)';ctx.beginPath();ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,256);ctx.stroke();}
  // central energy strip
  const cg=ctx.createLinearGradient(106,0,150,0);
  cg.addColorStop(0,'rgba(0,229,255,0)');cg.addColorStop(.48,'rgba(0,229,255,.22)');cg.addColorStop(.52,'rgba(255,255,255,.26)');cg.addColorStop(1,'rgba(0,229,255,0)');
  ctx.fillStyle=cg;ctx.fillRect(96,0,64,256);
  ctx.strokeStyle='rgba(0,229,255,.44)';ctx.lineWidth=2;
  ctx.setLineDash([20,18]);ctx.beginPath();ctx.moveTo(128,0);ctx.lineTo(128,256);ctx.stroke();ctx.setLineDash([]);
  // arrows showing forward motion
  for(let y=-12;y<276;y+=64){
    ctx.fillStyle='rgba(0,229,255,.18)';ctx.beginPath();ctx.moveTo(128,y);ctx.lineTo(150,y+28);ctx.lineTo(136,y+28);ctx.lineTo(136,y+50);ctx.lineTo(120,y+50);ctx.lineTo(120,y+28);ctx.lineTo(106,y+28);ctx.closePath();ctx.fill();
  }
  // cyan edge glow baked into texture
  ctx.fillStyle='rgba(0,229,255,.10)';ctx.fillRect(0,0,14,256);ctx.fillRect(242,0,14,256);
  const tex=new THREE.CanvasTexture(cv);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.repeat.set(1,4);
  tex.offset.set(0,0);
  tex.userData={scrollSpeed:.42,worldKey:'default'};
  window.__roadTexV15=tex;
  return tex;
}

function makeThemedRoadTex(w){
  const cv=document.createElement('canvas'); cv.width=512; cv.height=512;
  const ctx=cv.getContext('2d');
  const road=hexToRgbStr(w.road||'#101D4C');
  const fog=hexToRgbStr(w.fog||w.sky||'#050716');
  const edge=hexToRgbStr(w.edge||w.color||'#00E5FF');
  const dash=hexToRgbStr(w.dash||w.accent||w.edge||'#80D8FF');
  const star=hexToRgbStr(w.star||'#FFFFFF');
  const base=ctx.createLinearGradient(0,0,0,512);
  base.addColorStop(0,'rgba('+road+',.98)');
  base.addColorStop(.50,'rgba('+fog+',.96)');
  base.addColorStop(1,'rgba('+road+',.92)');
  ctx.fillStyle=base;
  ctx.fillRect(0,0,512,512);

  for(let i=0;i<2100;i++){
    const a=.025+Math.random()*.075;
    ctx.fillStyle='rgba('+star+','+a+')';
    ctx.fillRect(Math.random()*512,Math.random()*512,1+Math.random()*1.5,1+Math.random()*1.5);
  }

  ctx.lineWidth=1;
  for(let y=0;y<512;y+=42){
    ctx.strokeStyle='rgba('+dash+',.18)';
    ctx.beginPath();ctx.moveTo(0,y+.5);ctx.lineTo(512,y+.5);ctx.stroke();
  }
  for(let x=0;x<512;x+=48){
    ctx.strokeStyle='rgba('+star+',.055)';
    ctx.beginPath();ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,512);ctx.stroke();
  }

  const center=ctx.createLinearGradient(176,0,336,0);
  center.addColorStop(0,'rgba('+edge+',0)');
  center.addColorStop(.46,'rgba('+edge+',.16)');
  center.addColorStop(.50,'rgba('+star+',.18)');
  center.addColorStop(.54,'rgba('+edge+',.16)');
  center.addColorStop(1,'rgba('+edge+',0)');
  ctx.fillStyle=center;
  ctx.fillRect(132,0,248,512);

  ctx.setLineDash([32,28]);
  ctx.lineWidth=4;
  ctx.strokeStyle='rgba('+dash+',.42)';
  ctx.beginPath();ctx.moveTo(256,0);ctx.lineTo(256,512);ctx.stroke();
  ctx.setLineDash([]);

  for(let y=-20;y<552;y+=78){
    ctx.fillStyle='rgba('+dash+',.18)';
    ctx.beginPath();
    ctx.moveTo(256,y);
    ctx.lineTo(294,y+34);
    ctx.lineTo(274,y+34);
    ctx.lineTo(274,y+58);
    ctx.lineTo(238,y+58);
    ctx.lineTo(238,y+34);
    ctx.lineTo(218,y+34);
    ctx.closePath();
    ctx.fill();
  }

  const left=ctx.createLinearGradient(0,0,110,0);
  left.addColorStop(0,'rgba('+edge+',.54)');
  left.addColorStop(.30,'rgba('+edge+',.22)');
  left.addColorStop(1,'rgba('+edge+',0)');
  ctx.fillStyle=left; ctx.fillRect(0,0,112,512);
  const right=ctx.createLinearGradient(512,0,402,0);
  right.addColorStop(0,'rgba('+edge+',.54)');
  right.addColorStop(.30,'rgba('+edge+',.22)');
  right.addColorStop(1,'rgba('+edge+',0)');
  ctx.fillStyle=right; ctx.fillRect(400,0,112,512);

  if(w.id==='ice'){
    ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=2;
    for(let x=-120;x<620;x+=58){ctx.beginPath();ctx.moveTo(x,512);ctx.lineTo(x+210,0);ctx.stroke();}
  }else if(w.id==='toxic'){
    ctx.fillStyle='rgba('+edge+',.12)';
    for(let i=0;i<34;i++){ctx.beginPath();ctx.arc(Math.random()*512,Math.random()*512,5+Math.random()*18,0,Math.PI*2);ctx.fill();}
  }else if(w.id==='cyber'){
    ctx.strokeStyle='rgba('+edge+',.26)';ctx.lineWidth=2;
    for(let y=16;y<512;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();}
  }else if(w.id==='void'){
    ctx.fillStyle='rgba('+star+',.24)';
    for(let i=0;i<80;i++){ctx.fillRect(Math.random()*512,Math.random()*512,1.4,1.4);}
  }

  const tex=new THREE.CanvasTexture(cv);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.repeat.set(1,w.id==='saturn'?4.4:4.9);
  tex.offset.set(0,0);
  tex.anisotropy=renderer&&renderer.capabilities?Math.min(4,renderer.capabilities.getMaxAnisotropy()):1;
  tex.userData={scrollSpeed:(w.id==='cyber' ? .72 : (w.id==='ice' ? .48 : .58)),worldKey:w.id||'themed'};
  return tex;
}
function getWorldRoadTex(w){
  const key=(w&&w.id)||'default';
  if(worldRoadTexCache[key])return worldRoadTexCache[key];
  if(!w){worldRoadTexCache[key]=makeRoadTex();return worldRoadTexCache[key];}
  const wantsMarsRoad=(w.name||'').toLowerCase()==='mars'||w.visualMood==='red_mars_dust';
  worldRoadTexCache[key]=wantsMarsRoad?makeMarsRoadTex():makeThemedRoadTex(w);
  return worldRoadTexCache[key];
}

function makeMarsRoadTex(){
  const cv=document.createElement('canvas'); cv.width=512; cv.height=512;
  const ctx=cv.getContext('2d');

  // Layer 1: warm Mars asphalt/soil base.
  const base=ctx.createLinearGradient(0,0,0,512);
  base.addColorStop(0,'#7B2C18');
  base.addColorStop(.38,'#4A1B12');
  base.addColorStop(.72,'#2B0C08');
  base.addColorStop(1,'#8A3219');
  ctx.fillStyle=base;
  ctx.fillRect(0,0,512,512);

  // Layer 2: fine red dust noise, light enough for mobile performance.
  for(let i=0;i<2600;i++){
    const warm=150+Math.random()*90|0;
    const a=.035+Math.random()*.10;
    ctx.fillStyle=`rgba(${warm},${55+Math.random()*45|0},${24+Math.random()*20|0},${a})`;
    ctx.fillRect(Math.random()*512,Math.random()*512,1+Math.random()*1.8,1+Math.random()*1.8);
  }

  // Layer 3: soft vertical dust streaks to sell forward speed.
  for(let i=0;i<42;i++){
    const x=40+Math.random()*432;
    const y=Math.random()*512;
    const len=34+Math.random()*120;
    const alpha=.055+Math.random()*.10;
    const g=ctx.createLinearGradient(x,y,x,y+len);
    g.addColorStop(0,'rgba(255,176,87,0)');
    g.addColorStop(.35,`rgba(255,176,87,${alpha})`);
    g.addColorStop(1,'rgba(255,176,87,0)');
    ctx.strokeStyle=g;
    ctx.lineWidth=1+Math.random()*2.2;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+(Math.random()-.5)*10,y+len);
    ctx.stroke();
  }

  // Layer 4: central worn tire/runner path, but still readable under gates.
  const mid=ctx.createLinearGradient(180,0,332,0);
  mid.addColorStop(0,'rgba(255,109,45,0)');
  mid.addColorStop(.45,'rgba(255,109,45,.13)');
  mid.addColorStop(.5,'rgba(255,210,122,.08)');
  mid.addColorStop(.55,'rgba(255,109,45,.13)');
  mid.addColorStop(1,'rgba(255,109,45,0)');
  ctx.fillStyle=mid;
  ctx.fillRect(150,0,212,512);

  // Layer 5: procedural cracks. Broken poly-lines with small branches.
  function crack(x,y,len,ang,depth){
    let cx=x,cy=y;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    const steps=3+Math.floor(Math.random()*5);
    for(let s=0;s<steps;s++){
      const step=len/steps*(.72+Math.random()*.55);
      ang+=(Math.random()-.5)*.9;
      cx+=Math.cos(ang)*step;
      cy+=Math.sin(ang)*step;
      ctx.lineTo(cx,cy);
      if(depth>0&&Math.random()<.38){
        const bx=cx,by=cy;
        ctx.save();
        ctx.lineWidth=Math.max(.7,ctx.lineWidth*.58);
        crack(bx,by,len*.26,ang+(Math.random()<.5?1:-1)*(1.0+Math.random()*.8),depth-1);
        ctx.restore();
        ctx.beginPath();ctx.moveTo(cx,cy);
      }
    }
    ctx.stroke();
  }
  ctx.lineCap='round';
  ctx.lineJoin='round';
  for(let i=0;i<34;i++){
    const x=24+Math.random()*464;
    const y=Math.random()*512;
    ctx.lineWidth=.8+Math.random()*1.8;
    ctx.strokeStyle=Math.random()<.25?'rgba(255,179,91,.20)':'rgba(22,5,2,.42)';
    crack(x,y,22+Math.random()*76,Math.PI/2+(Math.random()-.5)*1.4,Math.random()<.45?1:0);
  }

  // Layer 6: glowing hot edge dust baked into the texture.
  const left=ctx.createLinearGradient(0,0,92,0);
  left.addColorStop(0,'rgba(255,109,45,.45)');
  left.addColorStop(.26,'rgba(255,109,45,.20)');
  left.addColorStop(1,'rgba(255,109,45,0)');
  ctx.fillStyle=left; ctx.fillRect(0,0,92,512);
  const right=ctx.createLinearGradient(512,0,420,0);
  right.addColorStop(0,'rgba(255,109,45,.45)');
  right.addColorStop(.26,'rgba(255,109,45,.20)');
  right.addColorStop(1,'rgba(255,109,45,0)');
  ctx.fillStyle=right; ctx.fillRect(420,0,92,512);

  // Layer 7: dashed sandy center hint, less neon than old road.
  ctx.setLineDash([28,26]);
  ctx.lineWidth=4;
  ctx.strokeStyle='rgba(255,210,122,.32)';
  ctx.beginPath();ctx.moveTo(256,0);ctx.lineTo(256,512);ctx.stroke();
  ctx.setLineDash([]);

  const tex=new THREE.CanvasTexture(cv);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.repeat.set(1,5.25);
  tex.offset.set(0,0);
  tex.anisotropy=renderer&&renderer.capabilities?Math.min(4,renderer.capabilities.getMaxAnisotropy()):1;
  tex.userData={scrollSpeed:.58,worldKey:'mars_cracks'};
  return tex;
}

function addMarsFloorDeco(tileGroup,tileIndex){
  if(!tileGroup||typeof THREE==='undefined')return;
  const geo=addMarsFloorDeco.geo||(addMarsFloorDeco.geo=new THREE.DodecahedronGeometry(1,0));
  const mat=addMarsFloorDeco.mat||(addMarsFloorDeco.mat=new THREE.MeshStandardMaterial({color:0x8E321A,roughness:.92,metalness:0,emissive:0x2A0702,emissiveIntensity:.12}));
  const glowMat=addMarsFloorDeco.glowMat||(addMarsFloorDeco.glowMat=new THREE.MeshBasicMaterial({color:0xFF6D2D,transparent:true,opacity:.24,depthWrite:false}));
  const seedBase=(tileIndex+1)*9973;
  function rnd(n){const x=Math.sin(seedBase+n*37.17)*10000;return x-Math.floor(x);}
  let k=0;
  for(const side of[-1,1]){
    for(let i=0;i<4;i++){
      const rock=new THREE.Mesh(geo,mat);
      rock.userData.role='marsDeco';
      const scale=.08+rnd(++k)*.22;
      rock.scale.set(scale*(1+rnd(++k)*1.4),scale*.45,scale*(.8+rnd(++k)*1.2));
      rock.position.set(side*(C.laneW*.5+.42+rnd(++k)*1.15),.10, -C.segLen*.5+2+rnd(++k)*(C.segLen-4));
      rock.rotation.set(rnd(++k)*Math.PI,rnd(++k)*Math.PI,rnd(++k)*Math.PI);
      rock.castShadow=false;rock.receiveShadow=false;
      tileGroup.add(rock);
      if(i===0){
        const glow=new THREE.Mesh(new THREE.CircleGeometry(.32+rnd(++k)*.20,16),glowMat);
        glow.userData.role='marsDeco';
        glow.position.set(rock.position.x,.018,rock.position.z);
        glow.rotation.x=-Math.PI/2;
        tileGroup.add(glow);
      }
    }
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SKY â€” Stars + Planets
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initSky(){
  skyStarsGroup=new THREE.Group(); scene.add(skyStarsGroup);
  skyBrightGroup=new THREE.Group(); scene.add(skyBrightGroup);

  // Simple black backdrop with a few star dots.
  const starCv=document.createElement('canvas');
  starCv.width=IS_MOBILE?768:1536; starCv.height=IS_MOBILE?512:1024;
  const sctx=starCv.getContext('2d');
  paintRedDustSky(sctx,starCv.width,starCv.height);
  const starTex=new THREE.CanvasTexture(starCv);
  starTex.wrapS=starTex.wrapT=THREE.ClampToEdgeWrapping;
  skyBackdrop=new THREE.Mesh(
    new THREE.PlaneGeometry(2,2),
    new THREE.MeshBasicMaterial({map:starTex,transparent:true,opacity:.34,depthWrite:false,depthTest:false,fog:false})
  );
  skyBackdrop.position.set(0,0,-112);
  skyBackdrop.userData.screenSpace=true;
  skyBackdrop.renderOrder=-10020;
  camera.add(skyBackdrop);
  refreshScreenSpaceBackdrops();

  // Wide star field.
  const sCnt=520;
  const pos=new Float32Array(sCnt*3);
  for(let i=0;i<sCnt;i++){
    pos[i*3]=(Math.random()-.5)*620;
    pos[i*3+1]=2+Math.random()*118;
    pos[i*3+2]=(Math.random()-.5)*680;
  }
  const sg=new THREE.BufferGeometry();
  sg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  skyStarsGroup.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xCCDDFF,size:.26,transparent:true,opacity:.48,fog:false})));

  // Bright star cluster.
  const bCnt=60;
  const bpos=new Float32Array(bCnt*3);
  for(let i=0;i<bCnt;i++){
    bpos[i*3]=(Math.random()-.5)*560;
    bpos[i*3+1]=3+Math.random()*110;
    bpos[i*3+2]=(Math.random()-.5)*680;
  }
  const bg2=new THREE.BufferGeometry();
  bg2.setAttribute('position',new THREE.BufferAttribute(bpos,3));
  skyBrightGroup.add(new THREE.Points(bg2,new THREE.PointsMaterial({color:0xFFFFFF,size:.42,transparent:true,opacity:.50,fog:false})));

  // Extra dense central stars to fill the empty middle black zone around the road.
  const cCnt=180;
  const cpos=new Float32Array(cCnt*3);
  for(let i=0;i<cCnt;i++){
    cpos[i*3]=(Math.random()-.5)*250;
    cpos[i*3+1]=1.4+Math.random()*54;
    cpos[i*3+2]=(Math.random()-.5)*520;
  }
  const cg=new THREE.BufferGeometry();
  cg.setAttribute('position',new THREE.BufferAttribute(cpos,3));
  skyStarsGroup.add(new THREE.Points(cg,new THREE.PointsMaterial({color:0xBFE7FF,size:.20,transparent:true,opacity:.26,fog:false})));

  // Low horizon stars fill the black space near the road/camera line.
  const hCnt=120;
  const hpos=new Float32Array(hCnt*3);
  for(let i=0;i<hCnt;i++){
    hpos[i*3]=(Math.random()-.5)*520;
    hpos[i*3+1]=.8+Math.random()*28;
    hpos[i*3+2]=(Math.random()-.5)*620;
  }
  const hg=new THREE.BufferGeometry();
  hg.setAttribute('position',new THREE.BufferAttribute(hpos,3));
  skyStarsGroup.add(new THREE.Points(hg,new THREE.PointsMaterial({color:0x9FD8FF,size:.18,transparent:true,opacity:.22,fog:false})));

  // Planets â€” store relative offsets, always ahead of camera
  const pDefs=[
    {r:3.2, col:0x4488CC, emCol:0x2266AA, y:38, relX:-55, relZ:90,  rings:true},
    {r:1.8, col:0xCC6644, emCol:0x883322, y:32, relX:65,  relZ:130, rings:false},
    {r:5.0, col:0xAACC88, emCol:0x668844, y:45, relX:15,  relZ:180, rings:true},
    {r:1.2, col:0xDDAA33, emCol:0xAA7711, y:26, relX:-75, relZ:110, rings:false},
  ];
  for(const pd of pDefs){
    const pm=new THREE.MeshLambertMaterial({color:pd.col,emissive:pd.emCol,emissiveIntensity:.25,fog:false});
    const planet=new THREE.Mesh(new THREE.SphereGeometry(pd.r,16,12),pm);
    planet.position.set(pd.relX,pd.y,pd.relZ);
    planet.userData={relX:pd.relX,relZ:pd.relZ};
    scene.add(planet);
    if(pd.rings){
      const ringGeo=new THREE.TorusGeometry(pd.r*1.7,.28,4,40);
      const ringMat=new THREE.MeshBasicMaterial({color:pd.col,transparent:true,opacity:.4,side:THREE.DoubleSide,fog:false});
      const ring=new THREE.Mesh(ringGeo,ringMat);
      ring.rotation.x=Math.PI*.28;
      planet.add(ring);
    }
    planets_.push(planet);
  }
}
initSky();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   V52 WORLD ATMOSPHERE â€” Mars sky + background planet prototype
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function makeMarsHazeTex(c1,c2,c3){
  // c1=mid haze color, c2=streak color, c3=bottom dark color  (all CSS rgb strings)
  c1=c1||'255,109,45'; c2=c2||'255,188,112'; c3=c3||'80,18,8';
  const cv=document.createElement('canvas');cv.width=512;cv.height=256;
  const ctx=cv.getContext('2d');ctx.clearRect(0,0,512,256);
  const h=ctx.createLinearGradient(0,0,0,256);
  h.addColorStop(0,'rgba('+c1+',0)');
  h.addColorStop(.35,'rgba('+c1+',.10)');
  h.addColorStop(.68,'rgba('+c1+',.28)');
  h.addColorStop(1,'rgba('+c3+',.38)');
  ctx.fillStyle=h;ctx.fillRect(0,0,512,256);
  for(let i=0;i<220;i++){
    const y=110+Math.random()*140;
    const a=.025+Math.random()*.08;
    ctx.fillStyle='rgba('+c2+','+a+')';
    ctx.fillRect(Math.random()*512,y,18+Math.random()*90,1+Math.random()*2);
  }
  const tex=new THREE.CanvasTexture(cv);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.minFilter=THREE.LinearFilter;tex.magFilter=THREE.LinearFilter;
  tex.userData={kind:'marsHaze'};
  return tex;
}
function makeMarsGlowTex(){
  const cv=document.createElement('canvas');cv.width=256;cv.height=256;
  const ctx=cv.getContext('2d');
  const g=ctx.createRadialGradient(128,128,4,128,128,126);
  g.addColorStop(0,'rgba(255,230,190,.95)');
  g.addColorStop(.18,'rgba(255,138,61,.48)');
  g.addColorStop(.54,'rgba(217,90,43,.18)');
  g.addColorStop(1,'rgba(217,90,43,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,256,256);
  const tex=new THREE.CanvasTexture(cv);
  tex.minFilter=THREE.LinearFilter;tex.magFilter=THREE.LinearFilter;
  return tex;
}
function makeMarsMoonTex(){
  const cv=document.createElement('canvas');cv.width=256;cv.height=256;
  const ctx=cv.getContext('2d');ctx.clearRect(0,0,256,256);
  const g=ctx.createRadialGradient(92,72,8,128,128,100);
  g.addColorStop(0,'#FFE2B0');g.addColorStop(.28,'#D95A2B');g.addColorStop(.72,'#6D2414');g.addColorStop(1,'#1B0704');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(128,128,96,0,Math.PI*2);ctx.fill();
  for(let i=0;i<28;i++){
    const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*78;
    const x=128+Math.cos(a)*r,y=128+Math.sin(a)*r,cr=3+Math.random()*12;
    ctx.fillStyle='rgba(42,12,6,'+(.12+Math.random()*.22)+')';
    ctx.beginPath();ctx.arc(x,y,cr,0,Math.PI*2);ctx.fill();
  }
  ctx.strokeStyle='rgba(255,210,122,.20)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(128,128,93,0,Math.PI*2);ctx.stroke();
  const tex=new THREE.CanvasTexture(cv);
  tex.minFilter=THREE.LinearFilter;tex.magFilter=THREE.LinearFilter;
  return tex;
}
function clearWorldAtmosphere(){
  if(cameraAtmosphereOverlay){
    if(cameraAtmosphereOverlay.material&&cameraAtmosphereOverlay.material.map)cameraAtmosphereOverlay.material.map.dispose&&cameraAtmosphereOverlay.material.map.dispose();
    cameraAtmosphereOverlay.material&&cameraAtmosphereOverlay.material.dispose&&cameraAtmosphereOverlay.material.dispose();
    cameraAtmosphereOverlay.geometry&&cameraAtmosphereOverlay.geometry.dispose&&cameraAtmosphereOverlay.geometry.dispose();
    camera.remove(cameraAtmosphereOverlay);
    cameraAtmosphereOverlay=null;
  }
  if(worldAtmosphereGroup){
    worldAtmosphereGroup.traverse(o=>{
      if(o.geometry)o.geometry.dispose&&o.geometry.dispose();
      if(o.material){
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{if(m.map)m.map.dispose&&m.map.dispose();m.dispose&&m.dispose();});
      }
    });
    scene.remove(worldAtmosphereGroup);
  }
  worldAtmosphereGroup=null;activeAtmosphereId='';marsAtmosphere=null;
}
function hexToRgbStr(hex){
  const n=hexNum(hex),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  return r+','+g+','+b;
}
function applyWorldAtmosphere(w){
  if(!scene||!w)return;
  const wanted=w.id||'mars';
  if(activeAtmosphereId===wanted)return;
  clearWorldAtmosphere();
  createWorldAtmosphere(w);
}
function createWorldAtmosphere(w){
  const accentRgb=hexToRgbStr(w.accent||w.edge||'#FF8A3D');
  const fogRgb=hexToRgbStr(w.fog||'#351008');
  const starRgb=hexToRgbStr(w.star||'#FFD1A0');

  worldAtmosphereGroup=new THREE.Group();
  worldAtmosphereGroup.name='world-atmosphere-'+w.id;
  worldAtmosphereGroup.renderOrder=-200;
  scene.add(worldAtmosphereGroup);
  activeAtmosphereId=w.id;
  marsAtmosphere={haze:null,dust:null,moons:[],meteors:[],baseSeed:Math.random()*1000};

  const hazeTex=makeMarsHazeTex(accentRgb,starRgb,fogRgb);
  const haze=new THREE.Mesh(
    new THREE.PlaneGeometry(2,2),
    new THREE.MeshBasicMaterial({map:hazeTex,color:0xffffff,transparent:true,opacity:w.id==='mars'?.82:.50,depthWrite:false,depthTest:false,side:THREE.DoubleSide,fog:false})
  );
  haze.position.set(0,0,-111);
  haze.userData={screenSpace:true,kind:'marsHaze'};
  haze.renderOrder=-10030;
  camera.add(haze);
  cameraAtmosphereOverlay=haze;
  refreshScreenSpaceBackdrops();
  marsAtmosphere.haze=haze;

  const glowTex=makeMarsGlowTex();
  const moonTex=makeMarsMoonTex();
  const moonGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:hexNum(w.accent||'#FF8A3D'),transparent:true,opacity:.50,depthWrite:false,fog:false}));
  moonGlow.scale.set(18,18,1);moonGlow.position.set(46,39,150);moonGlow.userData={relX:46,relY:39,relZ:150,spin:.02};
  worldAtmosphereGroup.add(moonGlow);
  const moon=new THREE.Sprite(new THREE.SpriteMaterial({map:moonTex,color:hexNum(w.planet||'#D95A2B'),transparent:true,opacity:.94,depthWrite:false,fog:false}));
  moon.scale.set(7.2,7.2,1);moon.position.set(46,39,150);moon.userData={relX:46,relY:39,relZ:150,spin:.04};
  worldAtmosphereGroup.add(moon);
  marsAtmosphere.moons.push(moonGlow,moon);

  const tiny=new THREE.Mesh(
    new THREE.SphereGeometry(1.15,14,10),
    new THREE.MeshBasicMaterial({color:hexNum(w.star||'#FFD1A0'),transparent:true,opacity:.78,fog:false})
  );
  tiny.position.set(-58,32,118);tiny.userData={relX:-58,relY:32,relZ:118,orbit:.7};
  worldAtmosphereGroup.add(tiny);marsAtmosphere.moons.push(tiny);

  const dustColor=hexNum(w.accent||w.edge||'#FF8A3D');
  const cnt=(innerWidth<760||/iPhone|iPad|Android/i.test(navigator.userAgent))?70:105;
  const pos=new Float32Array(cnt*3);
  const alpha=new Float32Array(cnt);
  for(let i=0;i<cnt;i++){
    pos[i*3]=(Math.random()-.5)*150;
    pos[i*3+1]=4+Math.random()*45;
    pos[i*3+2]=28+Math.random()*150;
    alpha[i]=Math.random();
  }
  const dg=new THREE.BufferGeometry();
  dg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  dg.setAttribute('dustAlpha',new THREE.BufferAttribute(alpha,1));
  const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:dustColor,size:.34,transparent:true,opacity:.34,depthWrite:false,fog:false}));
  dust.userData={relZ:0,base:pos.slice ? pos.slice(0) : new Float32Array(pos)};
  worldAtmosphereGroup.add(dust);marsAtmosphere.dust=dust;

  const meteorColor=hexNum(w.dash||w.star||'#FFD27A');
  for(let i=0;i<7;i++){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(8+Math.random()*7,.10),
      new THREE.MeshBasicMaterial({color:meteorColor,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide,fog:false}));
    m.position.set(-85+Math.random()*170,38+Math.random()*40,70+Math.random()*120);
    m.rotation.z=-.22-Math.random()*.16;
    m.userData={relZ:m.position.z,speed:.18+Math.random()*.25,phase:Math.random()*Math.PI*2,baseX:m.position.x,baseY:m.position.y};
    worldAtmosphereGroup.add(m);marsAtmosphere.meteors.push(m);
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CLIMATE SYSTEM â€” per-world weather
   Single THREE.Points per effect = 1 draw call, mobile safe.
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
let climateSystem=null; // {id, points[], sprites[], state{}}
// IS_MOBILE declared globally above â€” using that one here

function clearClimate(){
  if(!climateSystem)return;
  climateSystem.points.forEach(p=>{
    if(p.geometry)p.geometry.dispose();
    if(p.material){if(p.material.map)p.material.map.dispose();p.material.dispose();}
    scene.remove(p);
    camera.remove(p);
  });
  climateSystem.sprites&&climateSystem.sprites.forEach(s=>{
    if(s.material){if(s.material.map)s.material.map.dispose();s.material.dispose();}
    scene.remove(s);camera.remove(s);
  });
  climateSystem=null;
}

function buildClimate(w){
  clearClimate();
  if(!scene||!camera||!w)return;
  const id=w.id;
  const pts=[],sprites=[],state={};
  const isMob=IS_MOBILE;

  /* â”€â”€ helpers â”€â”€ */
  function makePoints(cnt,colorHex,size,opacity,useCam){
    const pos=new Float32Array(cnt*3);
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.PointsMaterial({color:colorHex,size,transparent:true,opacity,depthWrite:false,fog:false,sizeAttenuation:true});
    const mesh=new THREE.Points(geo,mat);
    mesh.renderOrder=-100;
    mesh.frustumCulled=false;
    if(useCam)camera.add(mesh);else scene.add(mesh);
    pts.push(mesh);
    return{mesh,pos,cnt};
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     MARS â€” red dust storm
     Stronger than base atmosphere dust; adds near-ground rolling sand.
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  if(id==='mars'||id==='lava_core'){
    const cnt=isMob?60:100;
    const d=makePoints(cnt,hexNum(w.accent||'#FF9550'),id==='lava_core' ? .34 : .28,id==='lava_core' ? .38 : .28,false);
    for(let i=0;i<cnt;i++){
      d.pos[i*3]  =(Math.random()-.5)*80;
      d.pos[i*3+1]=.4+Math.random()*3.5;   // near ground
      d.pos[i*3+2]=(Math.random()-.5)*80;
    }
    d.mesh.geometry.attributes.position.needsUpdate=true;
    state.sandPos=d.pos; state.sandMesh=d.mesh; state.sandCnt=cnt;

    // Distant upper haze streaks
    const cnt2=isMob?30:55;
    const d2=makePoints(cnt2,hexNum(w.dash||w.star||'#FF6D2D'),id==='lava_core' ? .22 : .18,id==='lava_core' ? .26 : .18,false);
    for(let i=0;i<cnt2;i++){
      d2.pos[i*3]  =(Math.random()-.5)*120;
      d2.pos[i*3+1]=8+Math.random()*18;
      d2.pos[i*3+2]=(Math.random()-.5)*120;
    }
    d2.mesh.geometry.attributes.position.needsUpdate=true;
    state.hazePos=d2.pos; state.hazeMesh=d2.mesh; state.hazeCnt=cnt2;
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     ICE â€” snowfall + aurora bands
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  else if(id==='ice'){
    const cnt=isMob?90:160;
    const d=makePoints(cnt,0xE8FDFF,.16,.60,false);
    const velY=new Float32Array(cnt);
    const wobble=new Float32Array(cnt);
    for(let i=0;i<cnt;i++){
      d.pos[i*3]  =(Math.random()-.5)*80;
      d.pos[i*3+1]=2+Math.random()*30;
      d.pos[i*3+2]=(Math.random()-.5)*80;
      velY[i]=.8+Math.random()*1.2;
      wobble[i]=Math.random()*Math.PI*2;
    }
    d.mesh.geometry.attributes.position.needsUpdate=true;
    state.snowPos=d.pos; state.snowMesh=d.mesh; state.snowCnt=cnt;
    state.snowVelY=velY; state.snowWobble=wobble;

    // Aurora â€” thin horizontal point bands in screen space
    const aur=isMob?40:70;
    const ad=makePoints(aur,0x80D8FF,.22,.30,true);
    for(let i=0;i<aur;i++){
      ad.pos[i*3]  =(Math.random()-.5)*3.5;
      ad.pos[i*3+1]=.55+Math.random()*.35;
      ad.pos[i*3+2]=-115;
    }
    ad.mesh.geometry.attributes.position.needsUpdate=true;
    state.aurPos=ad.pos; state.aurMesh=ad.mesh; state.aurCnt=aur;
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     SATURN â€” golden debris drift (slow ring-particle rain)
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  else if(id==='saturn'||id==='crystal_realm'){
    const cnt=isMob?70:120;
    const d=makePoints(cnt,hexNum(w.color||w.accent||'#FFD06A'),.20,.40,false);
    const angV=new Float32Array(cnt);
    const radii=new Float32Array(cnt);
    for(let i=0;i<cnt;i++){
      const a=Math.random()*Math.PI*2;
      const r=25+Math.random()*50;
      radii[i]=r;
      d.pos[i*3]  =Math.cos(a)*r;
      d.pos[i*3+1]=5+Math.random()*22;
      d.pos[i*3+2]=Math.sin(a)*r;
      angV[i]=(.003+Math.random()*.005)*(Math.random()<.5?1:-1);
    }
    d.mesh.geometry.attributes.position.needsUpdate=true;
    state.ringPos=d.pos; state.ringMesh=d.mesh; state.ringCnt=cnt;
    state.ringAngV=angV; state.ringRadii=radii;
    state.ringAngs=new Float32Array(cnt).map((_,i)=>Math.atan2(d.pos[i*3+2],d.pos[i*3]));

    // Soft purple sparkles
    const cnt2=isMob?30:55;
    const d2=makePoints(cnt2,hexNum(w.good||w.accent||'#B388FF'),.14,.35,false);
    for(let i=0;i<cnt2;i++){
      d2.pos[i*3]  =(Math.random()-.5)*100;
      d2.pos[i*3+1]=12+Math.random()*20;
      d2.pos[i*3+2]=(Math.random()-.5)*100;
    }
    d2.mesh.geometry.attributes.position.needsUpdate=true;
    state.sparkPos=d2.pos; state.sparkMesh=d2.mesh; state.sparkCnt=cnt2;
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     TOXIC â€” acid rain + rising mist bubbles
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  else if(id==='toxic'||id==='ocean_abyss'){
    // Falling acid drops
    const cnt=isMob?80:140;
    const d=makePoints(cnt,hexNum(w.good||w.accent||'#AEEA00'),id==='ocean_abyss' ? .14 : .10,id==='ocean_abyss' ? .42 : .55,false);
    const dropVY=new Float32Array(cnt);
    for(let i=0;i<cnt;i++){
      d.pos[i*3]  =(Math.random()-.5)*80;
      d.pos[i*3+1]=.5+Math.random()*28;
      d.pos[i*3+2]=(Math.random()-.5)*80;
      dropVY[i]=3+Math.random()*4;
    }
    d.mesh.geometry.attributes.position.needsUpdate=true;
    state.dropPos=d.pos; state.dropMesh=d.mesh; state.dropCnt=cnt;
    state.dropVY=dropVY;

    // Rising mist bubbles
    const cnt2=isMob?35:60;
    const d2=makePoints(cnt2,hexNum(w.accent||w.edge||'#69F0AE'),id==='ocean_abyss' ? .28 : .22,id==='ocean_abyss' ? .38 : .28,false);
    const bubVY=new Float32Array(cnt2);
    for(let i=0;i<cnt2;i++){
      d2.pos[i*3]  =(Math.random()-.5)*70;
      d2.pos[i*3+1]=Math.random()*4;
      d2.pos[i*3+2]=(Math.random()-.5)*70;
      bubVY[i]=.4+Math.random()*.8;
    }
    d2.mesh.geometry.attributes.position.needsUpdate=true;
    state.bubPos=d2.pos; state.bubMesh=d2.mesh; state.bubCnt=cnt2;
    state.bubVY=bubVY;
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     CYBER â€” neon pixel glitch rain (matrix-style vertical streams)
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  else if(id==='cyber'||id==='neon_tokyo'||id==='digital_void'){
    const cnt=isMob?80:140;
    // Mix of pink and cyan drops
    const d=makePoints(cnt,hexNum(w.color||w.accent||'#EA80FC'),.13,.65,false);
    const d2=makePoints(Math.floor(cnt*.6),hexNum(w.edge||w.good||'#00E5FF'),.13,.55,false);
    const vY=new Float32Array(cnt);
    const vY2=new Float32Array(Math.floor(cnt*.6));
    for(let i=0;i<cnt;i++){
      d.pos[i*3]  =(Math.random()-.5)*80;
      d.pos[i*3+1]=.5+Math.random()*30;
      d.pos[i*3+2]=(Math.random()-.5)*80;
      vY[i]=4+Math.random()*6;
    }
    d.mesh.geometry.attributes.position.needsUpdate=true;
    for(let i=0;i<Math.floor(cnt*.6);i++){
      d2.pos[i*3]  =(Math.random()-.5)*80;
      d2.pos[i*3+1]=.5+Math.random()*30;
      d2.pos[i*3+2]=(Math.random()-.5)*80;
      vY2[i]=3+Math.random()*5;
    }
    d2.mesh.geometry.attributes.position.needsUpdate=true;
    state.cberPos=d.pos; state.cberMesh=d.mesh; state.cberCnt=cnt; state.cberVY=vY;
    state.cberPos2=d2.pos; state.cberMesh2=d2.mesh; state.cberCnt2=Math.floor(cnt*.6); state.cberVY2=vY2;

    // Horizontal scan-line flickers in screen-space
    const sl=isMob?12:20;
    const sd=makePoints(sl,hexNum(w.dash||w.color||'#EA80FC'),.10,.40,true);
    for(let i=0;i<sl;i++){
      sd.pos[i*3]  =(Math.random()-.5)*3.2;
      sd.pos[i*3+1]=(Math.random()-.5)*2.0;
      sd.pos[i*3+2]=-114;
    }
    sd.mesh.geometry.attributes.position.needsUpdate=true;
    state.scanPos=sd.pos; state.scanMesh=sd.mesh; state.scanCnt=sl;
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     VOID â€” star-shard lightning pulses + drifting cosmic dust
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  else if(id==='void'||id==='cosmic_storm'){
    const cnt=isMob?60:110;
    const d=makePoints(cnt,hexNum(w.good||w.star||'#FFD740'),.16,.50,false);
    const d2=makePoints(Math.floor(cnt*.7),hexNum(w.accent||w.bad||'#FF4081'),.12,.40,false);
    for(let i=0;i<cnt;i++){
      d.pos[i*3]  =(Math.random()-.5)*100;
      d.pos[i*3+1]=2+Math.random()*28;
      d.pos[i*3+2]=(Math.random()-.5)*100;
    }
    d.mesh.geometry.attributes.position.needsUpdate=true;
    for(let i=0;i<Math.floor(cnt*.7);i++){
      d2.pos[i*3]  =(Math.random()-.5)*100;
      d2.pos[i*3+1]=2+Math.random()*28;
      d2.pos[i*3+2]=(Math.random()-.5)*100;
    }
    d2.mesh.geometry.attributes.position.needsUpdate=true;
    state.voidPos=d.pos; state.voidMesh=d.mesh; state.voidCnt=cnt;
    state.voidPos2=d2.pos; state.voidMesh2=d2.mesh; state.voidCnt2=Math.floor(cnt*.7);
    state.lightningT=0; state.lightningDur=0; state.lightningNext=1+Math.random()*3;

    // Lightning bolt: single thin screen-space line simulated with points
    const lb=isMob?18:30;
    const ld=makePoints(lb,hexNum(w.edge||w.good||'#FFD740'),.08,.0,true); // starts invisible
    for(let i=0;i<lb;i++){
      ld.pos[i*3]=(Math.random()-.5)*.2;
      ld.pos[i*3+1]=.4-i/lb*.8;
      ld.pos[i*3+2]=-114;
    }
    ld.mesh.geometry.attributes.position.needsUpdate=true;
    state.ltPos=ld.pos; state.ltMesh=ld.mesh; state.ltCnt=lb;
  }

  climateSystem={id,points:pts,sprites,state};
}

function updateClimate(dt,t){
  if(!climateSystem||!camera)return;
  const {id,state}=climateSystem;
  const cz=camera.position.z;
  const cx=camera.position.x;

  /* â”€â”€ MARS: rolling ground-level sand + upper haze drift â”€â”€ */
  if(id==='mars'||id==='lava_core'){
    const{sandPos,sandCnt,sandMesh,hazePos,hazeCnt,hazeMesh}=state;
    const sp=sandPos;
    for(let i=0;i<sandCnt;i++){
      sp[i*3]  +=dt*(1.2+((i%7)*.18));
      sp[i*3+1]+=Math.sin(t*.6+i)*.012;
      if(sp[i*3]-cx> 42)sp[i*3]-=84;
      if(sp[i*3]-cx<-42)sp[i*3]+=84;
      // keep centred on camera Z
      const dz=sp[i*3+2]-cz;
      if(dz>42)sp[i*3+2]-=84;
      if(dz<-42)sp[i*3+2]+=84;
    }
    sandMesh.geometry.attributes.position.needsUpdate=true;
    sandMesh.position.set(0,0,0);

    const hp=hazePos;
    for(let i=0;i<hazeCnt;i++){
      hp[i*3]  +=dt*(.5+((i%5)*.06));
      if(hp[i*3]-cx>62)hp[i*3]-=124;
      if(hp[i*3]-cx<-62)hp[i*3]+=124;
      const dz=hp[i*3+2]-cz;
      if(dz>62)hp[i*3+2]-=124;
      if(dz<-62)hp[i*3+2]+=124;
    }
    hazeMesh.geometry.attributes.position.needsUpdate=true;
  }

  /* â”€â”€ ICE: snowfall + aurora shimmer â”€â”€ */
  else if(id==='ice'){
    const{snowPos,snowCnt,snowMesh,snowVelY,snowWobble,aurPos,aurCnt,aurMesh}=state;
    for(let i=0;i<snowCnt;i++){
      snowPos[i*3]  +=Math.sin(t*.4+snowWobble[i])*.008;
      snowPos[i*3+1]-=dt*snowVelY[i];
      // keep z near camera
      const dz=snowPos[i*3+2]-cz;
      if(dz>42)snowPos[i*3+2]-=84;
      if(dz<-42)snowPos[i*3+2]+=84;
      const dx=snowPos[i*3]-cx;
      if(dx>42)snowPos[i*3]-=84;
      if(dx<-42)snowPos[i*3]+=84;
      if(snowPos[i*3+1]<-.5)snowPos[i*3+1]=28+Math.random()*4;
    }
    snowMesh.geometry.attributes.position.needsUpdate=true;
    snowMesh.position.set(0,0,0);

    // Aurora: slowly drift the band vertically + pulse opacity
    for(let i=0;i<aurCnt;i++){
      aurPos[i*3]  +=dt*(i%2?.004:-.003);
      aurPos[i*3+1]=.58+Math.sin(t*.15+i*.3)*.08;
    }
    aurMesh.geometry.attributes.position.needsUpdate=true;
    aurMesh.material.opacity=.15+Math.abs(Math.sin(t*.2))*.22;
    aurMesh.material.color.setHex(Math.sin(t*.12)>.2?0x80D8FF:0x69F0AE);
  }

  /* â”€â”€ SATURN: ring-debris orbit + purple sparkle drift â”€â”€ */
  else if(id==='saturn'||id==='crystal_realm'){
    const{ringPos,ringCnt,ringMesh,ringAngV,ringRadii,ringAngs,sparkPos,sparkCnt,sparkMesh}=state;
    for(let i=0;i<ringCnt;i++){
      ringAngs[i]+=ringAngV[i]*dt*60;
      ringPos[i*3]  =cx+Math.cos(ringAngs[i])*ringRadii[i];
      ringPos[i*3+1]+=Math.sin(t*.25+i)*.004;
      ringPos[i*3+2]=cz+Math.sin(ringAngs[i])*ringRadii[i];
      if(ringPos[i*3+1]>28)ringPos[i*3+1]=5;
      if(ringPos[i*3+1]<4) ringPos[i*3+1]=5;
    }
    ringMesh.geometry.attributes.position.needsUpdate=true;
    ringMesh.position.set(0,0,0);

    for(let i=0;i<sparkCnt;i++){
      sparkPos[i*3]  +=dt*(.08-(i%3)*.05);
      sparkPos[i*3+1]+=Math.sin(t*.3+i)*.005;
      const dz=sparkPos[i*3+2]-cz;
      if(dz>52)sparkPos[i*3+2]-=104;
      if(dz<-52)sparkPos[i*3+2]+=104;
      const dx=sparkPos[i*3]-cx;
      if(dx>52)sparkPos[i*3]-=104;
      if(dx<-52)sparkPos[i*3]+=104;
    }
    sparkMesh.geometry.attributes.position.needsUpdate=true;
    sparkMesh.position.set(0,0,0);
    ringMesh.material.opacity=.25+Math.abs(Math.sin(t*.18))*.18;
  }

  /* â”€â”€ TOXIC: acid rain falling + mist bubbles rising â”€â”€ */
  else if(id==='toxic'||id==='ocean_abyss'){
    const{dropPos,dropCnt,dropMesh,dropVY,bubPos,bubCnt,bubMesh,bubVY}=state;
    for(let i=0;i<dropCnt;i++){
      dropPos[i*3+1]-=dt*dropVY[i];
      const dz=dropPos[i*3+2]-cz;
      if(dz>42)dropPos[i*3+2]-=84;
      if(dz<-42)dropPos[i*3+2]+=84;
      const dx=dropPos[i*3]-cx;
      if(dx>42)dropPos[i*3]-=84;
      if(dx<-42)dropPos[i*3]+=84;
      if(dropPos[i*3+1]<-.5)dropPos[i*3+1]=28+Math.random()*4;
    }
    dropMesh.geometry.attributes.position.needsUpdate=true;
    dropMesh.position.set(0,0,0);

    for(let i=0;i<bubCnt;i++){
      bubPos[i*3]  +=Math.sin(t*.5+i*.7)*.008;
      bubPos[i*3+1]+=dt*bubVY[i];
      const dz=bubPos[i*3+2]-cz;
      if(dz>38)bubPos[i*3+2]-=76;
      if(dz<-38)bubPos[i*3+2]+=76;
      const dx=bubPos[i*3]-cx;
      if(dx>38)bubPos[i*3]-=76;
      if(dx<-38)bubPos[i*3]+=76;
      if(bubPos[i*3+1]>12)bubPos[i*3+1]=Math.random()*.5;
    }
    bubMesh.geometry.attributes.position.needsUpdate=true;
    bubMesh.position.set(0,0,0);
    dropMesh.material.opacity=.40+Math.sin(t*.8)*.15;
  }

  /* â”€â”€ CYBER: glitch pixel rain + scan line flicker â”€â”€ */
  else if(id==='cyber'||id==='neon_tokyo'||id==='digital_void'){
    const{cberPos,cberCnt,cberMesh,cberVY,cberPos2,cberCnt2,cberMesh2,cberVY2,scanPos,scanCnt,scanMesh}=state;
    for(let i=0;i<cberCnt;i++){
      cberPos[i*3+1]-=dt*cberVY[i];
      const dz=cberPos[i*3+2]-cz;
      if(dz>42)cberPos[i*3+2]-=84;
      if(dz<-42)cberPos[i*3+2]+=84;
      const dx=cberPos[i*3]-cx;
      if(dx>42)cberPos[i*3]-=84;
      if(dx<-42)cberPos[i*3]+=84;
      if(cberPos[i*3+1]<-.5){cberPos[i*3+1]=30+Math.random()*4;cberPos[i*3]=(Math.random()-.5)*80+cx;}
    }
    cberMesh.geometry.attributes.position.needsUpdate=true;
    cberMesh.position.set(0,0,0);

    for(let i=0;i<cberCnt2;i++){
      cberPos2[i*3+1]-=dt*cberVY2[i];
      const dz=cberPos2[i*3+2]-cz;
      if(dz>42)cberPos2[i*3+2]-=84;
      if(dz<-42)cberPos2[i*3+2]+=84;
      const dx=cberPos2[i*3]-cx;
      if(dx>42)cberPos2[i*3]-=84;
      if(dx<-42)cberPos2[i*3]+=84;
      if(cberPos2[i*3+1]<-.5){cberPos2[i*3+1]=30+Math.random()*4;cberPos2[i*3]=(Math.random()-.5)*80+cx;}
    }
    cberMesh2.geometry.attributes.position.needsUpdate=true;
    cberMesh2.position.set(0,0,0);

    // Scan lines flicker position + opacity
    for(let i=0;i<scanCnt;i++){
      if(Math.random()<.04)scanPos[i*3+1]=(Math.random()-.5)*2.0; // random glitch jump
    }
    scanMesh.geometry.attributes.position.needsUpdate=true;
    scanMesh.material.opacity=.15+Math.abs(Math.sin(t*4.5+.5))*.35;
    cberMesh.material.opacity=.45+Math.abs(Math.sin(t*3))*.25;
  }

  /* â”€â”€ VOID: cosmic dust drift + lightning pulses â”€â”€ */
  else if(id==='void'||id==='cosmic_storm'){
    const{voidPos,voidCnt,voidMesh,voidPos2,voidCnt2,voidMesh2,ltPos,ltCnt,ltMesh}=state;
    for(let i=0;i<voidCnt;i++){
      voidPos[i*3]  +=dt*(.06+(i%5)*.01);
      voidPos[i*3+1]+=Math.sin(t*.2+i)*.004;
      const dz=voidPos[i*3+2]-cz;
      if(dz>52)voidPos[i*3+2]-=104;
      if(dz<-52)voidPos[i*3+2]+=104;
      const dx=voidPos[i*3]-cx;
      if(dx>52)voidPos[i*3]-=104;
      if(dx<-52)voidPos[i*3]+=104;
    }
    voidMesh.geometry.attributes.position.needsUpdate=true;
    voidMesh.position.set(0,0,0);

    for(let i=0;i<voidCnt2;i++){
      voidPos2[i*3]  -=dt*(.04+(i%3)*.008);
      voidPos2[i*3+1]+=Math.cos(t*.18+i)*.003;
      const dz=voidPos2[i*3+2]-cz;
      if(dz>52)voidPos2[i*3+2]-=104;
      if(dz<-52)voidPos2[i*3+2]+=104;
      const dx=voidPos2[i*3]-cx;
      if(dx>52)voidPos2[i*3]-=104;
      if(dx<-52)voidPos2[i*3]+=104;
    }
    voidMesh2.geometry.attributes.position.needsUpdate=true;
    voidMesh2.position.set(0,0,0);

    // Lightning bolt pulse
    state.lightningT+=dt;
    if(state.lightningT>state.lightningNext){
      state.lightningT=0;
      state.lightningNext=1.5+Math.random()*4;
      state.lightningDur=.18+Math.random()*.14;
      // re-randomise bolt shape
      const bx=(Math.random()-.5)*1.2;
      for(let i=0;i<ltCnt;i++){
        ltPos[i*3]  =bx+(Math.random()-.5)*.08;
        ltPos[i*3+1]=.45-i/ltCnt*.9;
        ltPos[i*3+2]=-114;
      }
      ltMesh.geometry.attributes.position.needsUpdate=true;
    }
    const lt=ltMesh;
    if(state.lightningDur>0){
      state.lightningDur-=dt;
      lt.material.opacity=.7+Math.random()*.3;
      lt.material.size=IS_MOBILE?.10:.12;
    }else{
      lt.material.opacity=Math.max(0,lt.material.opacity-dt*3);
    }
    lt.material.needsUpdate=true;
    voidMesh.material.opacity=.30+Math.abs(Math.sin(t*.22))*.22;
  }
}

function updateWorldAtmosphere(dt,t){
  if(!worldAtmosphereGroup&&!(activeAtmosphereId&&marsAtmosphere))return;
  if(worldAtmosphereGroup){
    worldAtmosphereGroup.position.z=camera.position.z;
    worldAtmosphereGroup.position.x=camera.position.x*.035;
  }
  if(!activeAtmosphereId||!marsAtmosphere)return;
  if(marsAtmosphere.haze&&marsAtmosphere.haze.material&&marsAtmosphere.haze.material.map){
    marsAtmosphere.haze.material.map.offset.x=(marsAtmosphere.haze.material.map.offset.x+dt*.006)%1;
    marsAtmosphere.haze.material.map.offset.y=.03+Math.sin(t*.08)*.004;
    marsAtmosphere.haze.rotation.z=Math.sin(t*.045)*.01;
  }
  if(marsAtmosphere.dust){
    // On mobile: update dust particles every 2nd frame to halve GPU upload cost
    if(!IS_MOBILE || _frameN%2===0){
      const attr=marsAtmosphere.dust.geometry.attributes.position;
      const arr=attr.array;
      for(let i=0;i<arr.length;i+=3){
        arr[i]+=dt*(.52+((i%17)*.012));
        arr[i+1]+=Math.sin(t*.35+i)*dt*.012;
        if(arr[i]>78)arr[i]=-78;
      }
      attr.needsUpdate=true;
    }
    marsAtmosphere.dust.rotation.y=Math.sin(t*.06)*.025;
  }
  marsAtmosphere.moons.forEach((m,i)=>{
    if(m.isSprite){
      m.material.rotation=(m.material.rotation||0)+dt*(i?-.035:.022);
      m.position.y=m.userData.relY+Math.sin(t*.18+i)*.55;
    }else{
      m.position.x=m.userData.relX+Math.sin(t*.13+m.userData.orbit)*2.0;
      m.position.y=m.userData.relY+Math.cos(t*.11+m.userData.orbit)*.65;
      m.rotation.y+=dt*.05;
    }
  });
  marsAtmosphere.meteors.forEach((m,i)=>{
    m.position.x=m.userData.baseX+Math.sin(t*.08+i)*8 - ((t*m.userData.speed*7)%180);
    if(m.position.x<-95)m.userData.baseX+=180;
    m.position.y=m.userData.baseY+Math.sin(t*.16+i)*2;
    m.material.opacity=.14+Math.max(0,Math.sin(t*.7+i))* .22;
  });
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CROWD â€” Sunflower Formation
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function rebuildFormation(){
  const n=Math.min(crowd,C.maxInst);
  const golden=2.399963229;
  const scale=Math.sqrt(n)*.50;
  members=[];
  for(let i=0;i<n;i++){
    const r=Math.sqrt((i+.5)/n)*scale;
    const theta=i*golden;
    members.push({ox:r*Math.cos(theta),oz:r*Math.sin(theta)*.7,ph:(i*.618)*Math.PI*2});
  }
}

/* V88 LETHAL HIT FX
   When a red gate or obstacle kills the last humans, the player should explode
   like normal defeated runners instead of staying on screen or being clamped to 1.
*/
function hideAllPlayerVisualsNow(){
  try{
    if(iHead&&dummy){
      const H=new THREE.Matrix4().makeTranslation(0,-999,0);
      for(let i=0;i<C.maxInst;i++)hideHumanInstance(i,H);
      [iHead,iBody,iArmL,iArmR,iLegL,iLegR,iEyeL,iEyeR,iFootL,iFootR,iBelt].forEach(m=>{if(m)m.instanceMatrix.needsUpdate=true;});
    }
  }catch(e){}
  if(window.LeaderFX&&LeaderFX.hide)LeaderFX.hide();
}

function explodeCrowdMembersAt(kill,baseX,baseZ,col,opts){
  opts=opts||{};
  kill=Math.max(0,Math.round(kill||0));
  if(!kill)return;
  const visible=Math.max(1,Math.min(members.length||kill,kill));
  const maxBursts=opts.all?(IS_MOBILE?14:24):(IS_MOBILE?8:14);
  const step=Math.max(1,Math.floor(visible/maxBursts));
  let shown=0;
  for(let i=0;i<visible&&shown<maxBursts;i+=step){
    const m=members[Math.max(0,Math.min(members.length-1,i))]||{ox:0,oz:0};
    burst(baseX+(m.ox||0),.55,baseZ+(m.oz||0),col||0xFF3030,opts.all?(IS_MOBILE?14:22):(IS_MOBILE?8:12));
    shown++;
  }
  if(opts.all||kill>=40){
    burst(baseX,1.15,baseZ,col||0xFF3030,IS_MOBILE?24:36);
    ringBurst(baseX,baseZ,IS_MOBILE?16:24);
  }
}

function triggerBadGateShock(kill,kind,gz){
  kill=Math.max(0,Math.round(kill||0));
  if(!kill)return;
  const now=performance.now();
  const half=kind==='half';
  const big=half||kill>=50||crowd<=0;
  if(now-badGateShockLast>(IS_MOBILE?220:150)){
    badGateShockLast=now;
    const shock=document.createElement('div');
    shock.className='bad-gate-shock '+(big?'big':'small')+(half?' halve':'');
    const label=document.createElement('div');
    label.className='bad-gate-shock-label';
    label.textContent=half?'- HALF TEAM':'-'+kill+' HUMANS';
    shock.appendChild(label);
    document.body.appendChild(shock);
    setTimeout(()=>shock.remove(),big?720:560);
  }
  const col=half?0xEA80FC:0xFF3030;
  const sparks=big?(IS_MOBILE?18:30):(IS_MOBILE?10:18);
  burst(cxVar,.95,gz,col,sparks);
  burst(cxVar,1.65,gz,0xFF8A65,Math.max(6,Math.floor(sparks*.45)));
  if(big||kill>=25){
    ringBurst(cxVar,gz,IS_MOBILE?12:18);
    setTimeout(()=>ringBurst(cxVar,gz,IS_MOBILE?8:12),90);
  }
  floatTxt(half?'TEAM CUT':(big?'TEAM HIT':'OUCH'),innerWidth*.5,innerHeight*.48,half?'#EA80FC':'#FF5252',big?40:30,'boom');
}

function finishLethalCrowdHit(x,z,col){
  crowd=0;
  members=[];
  hideAllPlayerVisualsNow();
  updateHUD();
  phaseFlash('HUMANS LOST!');
  floatTxt('LOST!',innerWidth*.5,innerHeight*.42,'#FF5252',62,'boom');
  shake(.95*DRAMA_POWER);
  rewardFlash('red');
}

function makePatternTex(kind){
  const cv=document.createElement('canvas'); cv.width=128; cv.height=128;
  const ctx=cv.getContext('2d');
  if(kind==='skin'){
    const g=ctx.createRadialGradient(44,36,8,64,64,92);
    g.addColorStop(0,'#FFE0A8'); g.addColorStop(.55,'#FFB96C'); g.addColorStop(1,'#D98535');
    ctx.fillStyle=g; ctx.fillRect(0,0,128,128);
    for(let i=0;i<220;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*.10})`;ctx.fillRect(Math.random()*128,Math.random()*128,1,1);}
    ctx.fillStyle='rgba(255,120,90,.20)';ctx.beginPath();ctx.arc(30,66,16,0,Math.PI*2);ctx.arc(98,66,16,0,Math.PI*2);ctx.fill();
  } else if(kind==='human'){
    const g=ctx.createLinearGradient(0,0,128,128);
    g.addColorStop(0,'#4FC3F7'); g.addColorStop(.5,'#1976D2'); g.addColorStop(1,'#0D47A1');
    ctx.fillStyle=g; ctx.fillRect(0,0,128,128);
    ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=3;
    for(let x=-128;x<256;x+=18){ctx.beginPath();ctx.moveTo(x,128);ctx.lineTo(x+128,0);ctx.stroke();}
    ctx.fillStyle='rgba(255,255,255,.16)';ctx.fillRect(0,0,128,14);
    ctx.fillStyle='rgba(0,0,40,.18)';ctx.fillRect(0,106,128,22);
  } else if(kind==='shoe'){
    const g=ctx.createLinearGradient(0,0,128,128);
    g.addColorStop(0,'#26374F'); g.addColorStop(1,'#030812'); ctx.fillStyle=g; ctx.fillRect(0,0,128,128);
    ctx.strokeStyle='rgba(0,229,255,.35)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,92);ctx.lineTo(128,92);ctx.stroke();
  } else {
    const g=ctx.createLinearGradient(0,0,128,128);
    g.addColorStop(0,'#FF6B6B'); g.addColorStop(.45,'#9E1B1B'); g.addColorStop(1,'#210006');
    ctx.fillStyle=g; ctx.fillRect(0,0,128,128);
    ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=1;
    for(let x=0;x<128;x+=16){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,128);ctx.stroke();}
    for(let y=0;y<128;y+=16){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(128,y);ctx.stroke();}
    ctx.strokeStyle='rgba(255,210,120,.26)';ctx.lineWidth=2;
    for(let i=0;i<18;i++){const y=Math.random()*128;ctx.beginPath();ctx.moveTo(Math.random()*50,y);ctx.lineTo(80+Math.random()*48,y+Math.random()*18-9);ctx.stroke();}
    ctx.fillStyle='rgba(255,40,40,.30)';ctx.fillRect(0,54,128,20);
  }
  const tex=new THREE.CanvasTexture(cv);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.repeat.set(kind==='robot'?2:1,kind==='robot'?2:1);
  return tex;
}

function initCrowd(){
  const N=C.maxInst,dyn=THREE.DynamicDrawUsage;
  const skinTex=makePatternTex('skin'),humanTex=makePatternTex('human'),shoeTex=makePatternTex('shoe');
  // Softer human clay + visible cloth texture
  matHuman=new THREE.MeshStandardMaterial({color:0x4FC3F7,map:humanTex,roughness:.56,metalness:.03,emissive:0x001830,emissiveIntensity:.18});
  matHumanBody=new THREE.MeshStandardMaterial({color:0x1E88E5,map:humanTex,roughness:.50,metalness:.04,emissive:0x001020,emissiveIntensity:.16});
  matHumanSkin=new THREE.MeshStandardMaterial({color:0xFFCC80,map:skinTex,roughness:.72,metalness:0,emissive:0x221100,emissiveIntensity:.08});
  const eyeM=new THREE.MeshBasicMaterial({color:0x050610});
  matShoe=new THREE.MeshStandardMaterial({color:0x0B1730,map:shoeTex,roughness:.46,metalness:.12,emissive:0x001A30,emissiveIntensity:.12});
  matBelt=new THREE.MeshBasicMaterial({color:0xFFD740});
  // Robot materials/meshes are built lazily in ensureRobotMeshes() â€” not here.
  // Segment counts scaled down on mobile (fewer verts = faster vertex shader)
  const hS=IS_MOBILE?10:18, hR=IS_MOBILE?8:12;
  const cS=IS_MOBILE?8:14,  aS=IS_MOBILE?6:10;
  // Bigger head + expressive eyes
  iHead=new THREE.InstancedMesh(new THREE.SphereGeometry(.29,hS,hR),matHumanSkin,N);
  iEyeL=new THREE.InstancedMesh(new THREE.SphereGeometry(.035,8,6),eyeM,N);
  iEyeR=new THREE.InstancedMesh(new THREE.SphereGeometry(.035,8,6),eyeM,N);
  // Wider, rounder body (capsule-like)
  iBody=new THREE.InstancedMesh(new THREE.CylinderGeometry(.14,.22,.46,cS),matHumanBody,N);
  iBelt=new THREE.InstancedMesh(new THREE.BoxGeometry(.42,.055,.08),matBelt,N);
  // Arms/legs with better rounded silhouettes
  const armG=new THREE.CylinderGeometry(.078,.060,.36,aS);
  iArmL=new THREE.InstancedMesh(armG,matHuman,N);
  iArmR=new THREE.InstancedMesh(armG.clone(),matHuman,N);
  const legG=new THREE.CylinderGeometry(.086,.066,.39,aS);
  iLegL=new THREE.InstancedMesh(legG,matHuman,N);
  iLegR=new THREE.InstancedMesh(legG.clone(),matHuman,N);
  iFootL=new THREE.InstancedMesh(new THREE.BoxGeometry(.20,.08,.28),matShoe,N);
  iFootR=new THREE.InstancedMesh(new THREE.BoxGeometry(.20,.08,.28),matShoe,N);
  // Robot meshes are NOT created here â€” ensureRobotMeshes() lazy-inits them
  // when the boss fight actually begins, saving 2,400 idle draw calls.
  [iHead,iBody,iArmL,iArmR,iLegL,iLegR,iEyeL,iEyeR,iFootL,iFootR,iBelt].forEach(m=>{
    if(!IS_MOBILE) m.castShadow=true;
    m.instanceMatrix.setUsage(dyn); scene.add(m);
  });
  LeaderFX.init();
  clearInst(); rebuildFormation();
}

// Called once when the boss fight begins â€” robot meshes live only then
function ensureRobotMeshes(){
  if(_robotMeshesReady) return;
  _robotMeshesReady=true;
  const dyn=THREE.DynamicDrawUsage;
  const robotTex=makePatternTex('robot');
  const rm    =new THREE.MeshStandardMaterial({color:0xD32F2F,map:robotTex,roughness:.32,metalness:.72,emissive:0x550000,emissiveIntensity:.62});
  const rmDark=new THREE.MeshStandardMaterial({color:0x2A0508,map:robotTex,roughness:.28,metalness:.88,emissive:0x220000,emissiveIntensity:.45});
  const rmGlow=new THREE.MeshBasicMaterial({color:0xFF3030,transparent:true,opacity:.55});
  const antM  =new THREE.MeshBasicMaterial({color:0xFF3030});
  const rEyeM =new THREE.MeshBasicMaterial({color:0xFFEB3B});
  const rCoreM=new THREE.MeshBasicMaterial({color:0xFF1744,transparent:true,opacity:.9});
  rHead    =new THREE.InstancedMesh(new THREE.BoxGeometry(.32,.26,.26),rm,200);
  rBody    =new THREE.InstancedMesh(new THREE.BoxGeometry(.25,.42,.21),rmDark,200);
  rArm     =new THREE.InstancedMesh(new THREE.BoxGeometry(.115,.31,.115),rm,400);
  rLeg     =new THREE.InstancedMesh(new THREE.BoxGeometry(.105,.32,.105),rmDark,400);
  rAnt     =new THREE.InstancedMesh(new THREE.SphereGeometry(.065,8,6),antM,200);
  rGlow    =new THREE.InstancedMesh(new THREE.SphereGeometry(.20,10,8),rmGlow,200);
  rEyeL    =new THREE.InstancedMesh(new THREE.SphereGeometry(.035,8,6),rEyeM,200);
  rEyeR    =new THREE.InstancedMesh(new THREE.SphereGeometry(.035,8,6),rEyeM,200);
  rCore    =new THREE.InstancedMesh(new THREE.SphereGeometry(.07,10,8),rCoreM,200);
  rShoulderL=new THREE.InstancedMesh(new THREE.SphereGeometry(.075,8,6),rm,200);
  rShoulderR=new THREE.InstancedMesh(new THREE.SphereGeometry(.075,8,6),rm,200);
  [rHead,rBody,rArm,rLeg,rAnt,rGlow,rEyeL,rEyeR,rCore,rShoulderL,rShoulderR].forEach(m=>{
    m.instanceMatrix.setUsage(dyn); scene.add(m);
  });
  // Now that robot meshes exist, clear them to hidden position
  const H=new THREE.Matrix4().makeTranslation(0,-999,0);
  if(_robotMeshesReady){
    for(let i=0;i<200;i++){
      rHead.setMatrixAt(i,H);rBody.setMatrixAt(i,H);rAnt.setMatrixAt(i,H);rGlow.setMatrixAt(i,H);
      rEyeL.setMatrixAt(i,H);rEyeR.setMatrixAt(i,H);rCore.setMatrixAt(i,H);
      rShoulderL.setMatrixAt(i,H);rShoulderR.setMatrixAt(i,H);
    }
    for(let i=0;i<400;i++){rArm.setMatrixAt(i,H);rLeg.setMatrixAt(i,H);}
  }
}

function clearInst(){
  const H=new THREE.Matrix4().makeTranslation(0,-999,0);
  for(let i=0;i<C.maxInst;i++){
    iHead.setMatrixAt(i,H);iBody.setMatrixAt(i,H);iBelt.setMatrixAt(i,H);
    iArmL.setMatrixAt(i,H);iArmR.setMatrixAt(i,H);
    iLegL.setMatrixAt(i,H);iLegR.setMatrixAt(i,H);
    iEyeL.setMatrixAt(i,H);iEyeR.setMatrixAt(i,H);
    iFootL.setMatrixAt(i,H);iFootR.setMatrixAt(i,H);
  }
  if(_robotMeshesReady){
    for(let i=0;i<200;i++){
      rHead.setMatrixAt(i,H);rBody.setMatrixAt(i,H);rAnt.setMatrixAt(i,H);rGlow.setMatrixAt(i,H);
      rEyeL.setMatrixAt(i,H);rEyeR.setMatrixAt(i,H);rCore.setMatrixAt(i,H);
      rShoulderL.setMatrixAt(i,H);rShoulderR.setMatrixAt(i,H);
    }
    for(let i=0;i<400;i++){rArm.setMatrixAt(i,H);rLeg.setMatrixAt(i,H);}
  }
  [iHead,iBody,iArmL,iArmR,iLegL,iLegR,iEyeL,iEyeR,iFootL,iFootR,iBelt].forEach(m=>m.instanceMatrix.needsUpdate=true);
  if(_robotMeshesReady)[rHead,rBody,rArm,rLeg,rAnt,rGlow,rEyeL,rEyeR,rCore,rShoulderL,rShoulderR].forEach(m=>m.instanceMatrix.needsUpdate=true);
}

function set3(mesh,idx,x,y,z,rx,ry,rz,sy,sx){
  dummy.position.set(x,y,z);
  dummy.rotation.set(rx||0,ry||0,rz||0);
  dummy.scale.set(sx||1,sy||1,1);
  dummy.updateMatrix();
  mesh.setMatrixAt(idx,dummy.matrix);
}

function hideHumanInstance(idx,H){
  iHead.setMatrixAt(idx,H);iBody.setMatrixAt(idx,H);iBelt.setMatrixAt(idx,H);
  iArmL.setMatrixAt(idx,H);iArmR.setMatrixAt(idx,H);
  iLegL.setMatrixAt(idx,H);iLegR.setMatrixAt(idx,H);
  iEyeL.setMatrixAt(idx,H);iEyeR.setMatrixAt(idx,H);
  iFootL.setMatrixAt(idx,H);iFootR.setMatrixAt(idx,H);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   V58 LEADER FX â€” one premium player, followers stay cheap
   Performance idea: keep the crowd InstancedMesh, replace only instance #0
   with a single normal mesh leader + one aura ring.
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   V62 LEADER STYLE LAB â€” saved menu controls
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/* V65 FINAL LEADER STYLE LOCKED:
   Leader Size 1.50x
   Flame Size 5.00x
   Flame Height 0.39x
   Flame Opacity 2.59x
   Aura Ring 0.59x
   Head Glow 0.47x
   Halo Glow 0.65x
*/
const LeaderStyle={
  key:'lastStandLeaderStyleV62',
  defaults:{flameMode:'ghost',scale:1.50,flameSize:5.00,flameHeight:0.39,flameOpacity:2.59,aura:0.59,headGlow:0.47,halo:0.65,customColor:'skin'},
  presets:{
    soft:{flameMode:'soft',scale:.96,flameSize:.78,flameHeight:.78,flameOpacity:.70,aura:.72,headGlow:.82,halo:.75,customColor:'#8deeff'},
    ghost:{flameMode:'ghost',scale:1.00,flameSize:1.00,flameHeight:1.00,flameOpacity:1.00,aura:1.00,headGlow:1.00,halo:1.00,customColor:'#00e5ff'},
    big:{flameMode:'fire',scale:1.10,flameSize:1.35,flameHeight:1.22,flameOpacity:1.25,aura:1.18,headGlow:1.35,halo:1.28,customColor:'#ff9f43'},
    clean:{flameMode:'off',scale:1.04,flameSize:0,flameHeight:1,flameOpacity:0,aura:.85,headGlow:.95,halo:.55,customColor:'#ffffff'}
  },
  settings:null,
  load(){
    // Final locked leader style. Old dev-tool localStorage values are ignored.
    this.settings=Object.assign({},this.defaults);
    return this.settings;
  },
  get(){return this.settings||this.load();},
  save(){try{localStorage.setItem(this.key,JSON.stringify(this.get()));}catch(e){}},
  set(k,v){
    const s=this.get();
    if(k==='flameMode')s[k]=String(v);
    else if(k==='customColor')s[k]=String(v||'#00e5ff');
    else s[k]=Math.max(0,Number(v));
    this.save();
    this.syncUI();
    this.applyNow();
  },
  applyPreset(name){
    if(!this.presets[name])return;
    this.settings=Object.assign({},this.defaults,this.presets[name]);
    this.save();
    this.syncUI(name);
    this.applyNow();
  },
  reset(){
    this.settings=Object.assign({},this.defaults);
    this.save();
    this.syncUI();
    this.applyNow();
  },
  applyNow(){
    try{
      if(typeof LeaderFX!=='undefined'&&LeaderFX&&LeaderFX.ready){
        LeaderFX.applySkin(skinById(playerData&&playerData.skins?playerData.skins.equipped:'default'));
      }
    }catch(e){}
  },
  fmt(k,v){
    if(k==='flameMode')return String(v).toUpperCase();
    if(k==='customColor')return String(v).toUpperCase();
    return Number(v).toFixed(2)+'x';
  },
  syncUI(activePreset){
    const s=this.get();
    Object.keys(this.defaults).forEach(k=>{
      const el=document.getElementById('ls-'+k);
      const lb=document.getElementById('ls-'+k+'-label');
      if(el)el.value=s[k];
      if(lb)lb.textContent=this.fmt(k,s[k]);
    });
    document.querySelectorAll('#leader-style-presets button').forEach(b=>{
      b.classList.toggle('active',!!activePreset&&b.dataset.preset===activePreset);
    });
  }
};
window.LeaderStyle=LeaderStyle;
const LeaderStyleUI={
  toggle(e){if(e)e.stopPropagation();LeaderStyle.load();LeaderStyle.syncUI();document.getElementById('dev-tools')?.classList.add('open');document.getElementById('dev-open-pill')?.classList.add('hide');},
  close(e){if(e)e.stopPropagation();},
  input(k,v,e){if(e)e.stopPropagation();LeaderStyle.set(k,v);},
  preset(name,e){if(e)e.stopPropagation();LeaderStyle.applyPreset(name);},
  reset(e){if(e)e.stopPropagation();LeaderStyle.reset();}
};
window.LeaderStyleUI=LeaderStyleUI;
setTimeout(()=>{LeaderStyle.load();LeaderStyle.syncUI();},0);

const LEADER_FX_POWER=IS_MOBILE?.46:.72;
const LEADER_AURA_POWER=IS_MOBILE?.58:.70;
const LeaderFX={
  group:null,ready:false,currentSkinId:'',
  bodyM:null,headM:null,accentM:null,skinM:null,shoeM:null,eyeM:null,mouthM:null,auraM:null,haloM:null,flameCapM:null,
  flameTex:null,flameMs:[],
  parts:{},
  makeFlameTexture(){
    if(this.flameTex)return this.flameTex;
    const c=document.createElement('canvas'); c.width=64; c.height=128;
    const g=c.getContext('2d');
    g.clearRect(0,0,64,128);

    // Soft vertical flame/wisp, not a circle: narrow at bottom, wider in the middle, fades at top.
    const flame=g.createLinearGradient(0,128,0,0);
    flame.addColorStop(0,'rgba(255,255,255,0)');
    flame.addColorStop(.16,'rgba(255,255,255,.70)');
    flame.addColorStop(.45,'rgba(255,255,255,.92)');
    flame.addColorStop(.78,'rgba(255,255,255,.35)');
    flame.addColorStop(1,'rgba(255,255,255,0)');

    g.beginPath();
    g.moveTo(32,126);
    g.bezierCurveTo(15,92,18,48,31,6);
    g.bezierCurveTo(48,46,52,92,32,126);
    g.closePath();
    g.fillStyle=flame;
    g.fill();

    const core=g.createRadialGradient(32,92,2,32,72,28);
    core.addColorStop(0,'rgba(255,255,255,.85)');
    core.addColorStop(.45,'rgba(255,255,255,.24)');
    core.addColorStop(1,'rgba(255,255,255,0)');
    g.globalCompositeOperation='lighter';
    g.fillStyle=core;
    g.fillRect(0,0,64,128);
    g.globalCompositeOperation='source-over';

    const tex=new THREE.CanvasTexture(c);
    tex.needsUpdate=true;
    this.flameTex=tex;
    return tex;
  },
  init(){
    if(this.ready)return;
    this.ready=true;
    const s=skinById(playerData&&playerData.skins?playerData.skins.equipped:'default');
    this.group=new THREE.Group();
    this.group.name='LeaderFX_SinglePremiumPlayer';
    this.group.visible=false;
    this.bodyM=new THREE.MeshStandardMaterial({color:s.body,roughness:.40,metalness:.07,emissive:s.glow,emissiveIntensity:.36*LEADER_FX_POWER});
    this.headM=new THREE.MeshStandardMaterial({color:s.body,roughness:.35,metalness:.06,emissive:s.glow,emissiveIntensity:.48*LEADER_FX_POWER});
    this.accentM=new THREE.MeshStandardMaterial({color:s.accent,roughness:.38,metalness:.08,emissive:s.glow,emissiveIntensity:.42*LEADER_FX_POWER});
    this.skinM=new THREE.MeshStandardMaterial({color:s.skin,roughness:.62,metalness:0,emissive:s.glow,emissiveIntensity:.10*LEADER_FX_POWER});
    this.shoeM=new THREE.MeshStandardMaterial({color:s.shoe,roughness:.45,metalness:.10,emissive:s.glow,emissiveIntensity:.14*LEADER_FX_POWER});
    this.eyeM=new THREE.MeshBasicMaterial({color:0x102032});
    this.mouthM=new THREE.MeshBasicMaterial({color:0x102032});
    this.auraM=new THREE.MeshBasicMaterial({color:s.glow,transparent:true,opacity:(IS_MOBILE?.20:.27)*LEADER_AURA_POWER,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
    this.haloM=new THREE.MeshBasicMaterial({color:s.glow,transparent:true,opacity:(IS_MOBILE?.07:.11)*LEADER_AURA_POWER,depthWrite:false,blending:THREE.AdditiveBlending});
    this.flameCapM=new THREE.MeshBasicMaterial({color:s.glow,transparent:true,opacity:(IS_MOBILE?.12:.17)*LEADER_AURA_POWER,depthWrite:false,blending:THREE.AdditiveBlending});

    const hSeg=IS_MOBILE?12:20, cSeg=IS_MOBILE?10:16;
    this.parts.aura=new THREE.Mesh(new THREE.RingGeometry(.38,.58,IS_MOBILE?28:42),this.auraM);
    this.parts.aura.rotation.x=-Math.PI/2;
    this.parts.aura.position.set(0,.045,.02);
    this.parts.halo=new THREE.Mesh(new THREE.SphereGeometry(.43,hSeg,IS_MOBILE?8:12),this.haloM);
    this.parts.halo.position.set(0,1.03,.01);
    this.parts.head=new THREE.Mesh(new THREE.SphereGeometry(.34,hSeg,IS_MOBILE?10:14),this.headM);
    this.parts.body=new THREE.Mesh(new THREE.CylinderGeometry(.16,.25,.54,cSeg),this.bodyM);
    this.parts.belt=new THREE.Mesh(new THREE.BoxGeometry(.50,.065,.10),this.accentM);
    const armG=new THREE.CylinderGeometry(.086,.066,.42,IS_MOBILE?8:12);
    const legG=new THREE.CylinderGeometry(.096,.074,.43,IS_MOBILE?8:12);
    this.parts.armL=new THREE.Mesh(armG,this.accentM);this.parts.armR=new THREE.Mesh(armG.clone(),this.accentM);
    this.parts.legL=new THREE.Mesh(legG,this.skinM);this.parts.legR=new THREE.Mesh(legG.clone(),this.skinM);
    this.parts.footL=new THREE.Mesh(new THREE.BoxGeometry(.24,.09,.31),this.shoeM);this.parts.footR=new THREE.Mesh(new THREE.BoxGeometry(.24,.09,.31),this.shoeM);
    this.parts.eyeL=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),this.eyeM);this.parts.eyeR=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),this.eyeM);
    this.parts.mouth=new THREE.Mesh(new THREE.BoxGeometry(.17,.030,.026),this.mouthM);
    this.parts.eyeL.visible=false;this.parts.eyeR.visible=false;this.parts.mouth.visible=false;

    // Ghost Rider style head flame: attached to the head, no smoke physics, no circular trail.
    const flameTex=this.makeFlameTexture();
    const flameCount=IS_MOBILE?2:3;
    const flameG=new THREE.PlaneGeometry(.44,.78);
    for(let fi=0;fi<flameCount;fi++){
      const fm=new THREE.MeshBasicMaterial({
        map:flameTex,color:s.glow,transparent:true,opacity:(IS_MOBILE?.28:.36)*LEADER_AURA_POWER,
        depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending
      });
      const fp=new THREE.Mesh(flameG, fm);
      fp.name='LeaderHeadGhostFlame_'+fi;
      fp.renderOrder=8;
      fp.frustumCulled=false;
      this.flameMs.push(fm);
      this.parts['flame'+fi]=fp;
    }
    this.parts.flameCap=new THREE.Mesh(new THREE.SphereGeometry(.28,IS_MOBILE?10:16,IS_MOBILE?8:12),this.flameCapM);
    this.parts.flameCap.name='LeaderHeadGlowCap';

    Object.values(this.parts).forEach(p=>{p.castShadow=false;p.frustumCulled=false;this.group.add(p);});
    scene.add(this.group);
    this.applySkin(s);
  },
  rescaleModels(){
    const sc=this.baseScale*1.50;
    let maxH=1.38;
    Object.values(this.models).forEach(obj=>{
      const c=obj.userData.rawCenter||{x:0,y:0,z:0};
      const minY=Number.isFinite(obj.userData.rawMinY)?obj.userData.rawMinY:0;
      const rawH=Math.max(1,obj.userData.rawHeight||96);
      obj.scale.setScalar(sc);
      obj.position.set(-c.x*sc,-minY*sc,-c.z*sc);
      obj.userData.finalHeight=rawH*sc;
      maxH=Math.max(maxH,obj.userData.finalHeight);
    });
    this.modelHeight=maxH;
  },
  applySkin(s){
    if(!s)return;
    this.currentSkinId=s.id;
    if(!this.ready||!this.bodyM)return;
    const myth=s.rarity==='LEGENDARY'||s.rarity==='MYTHIC';
    const metal=s.id==='robot'||s.id==='gold'||s.id==='mecha_gold'||s.fx==='cyber'||s.fx==='omega';
    const ls=(window.LeaderStyle&&LeaderStyle.get)?LeaderStyle.get():{headGlow:1,aura:1,halo:1,flameOpacity:1,flameMode:'ghost',customColor:'#00e5ff'};
    const fxColor=(ls.customColor==='skin'||!ls.customColor)?s.glow:((ls.customColor&&/^#/.test(ls.customColor))?ls.customColor:s.glow);
    const pow=LEADER_FX_POWER*(myth?1.15:1);
    const headMul=Number(ls.headGlow||1);
    this.bodyM.color.set(s.body);this.bodyM.emissive.set(fxColor);this.bodyM.emissiveIntensity=.34*pow*(.75+headMul*.25);this.bodyM.map=null;this.bodyM.roughness=metal?.30:.42;this.bodyM.metalness=metal?.42:.08;this.bodyM.needsUpdate=true;
    this.headM.color.set(s.body);this.headM.emissive.set(fxColor);this.headM.emissiveIntensity=.52*pow*headMul;this.headM.map=null;this.headM.roughness=metal?.30:.40;this.headM.metalness=metal?.38:.06;this.headM.needsUpdate=true;
    this.accentM.color.set(s.accent);this.accentM.emissive.set(fxColor);this.accentM.emissiveIntensity=.44*pow*(.75+headMul*.25);this.accentM.map=null;this.accentM.roughness=metal?.28:.40;this.accentM.metalness=metal?.45:.08;this.accentM.needsUpdate=true;
    this.skinM.color.set(s.skin);this.skinM.emissive.set(fxColor);this.skinM.emissiveIntensity=.12*pow;this.skinM.map=null;this.skinM.needsUpdate=true;
    this.shoeM.color.set(s.shoe);this.shoeM.emissive.set(fxColor);this.shoeM.emissiveIntensity=.14*pow;this.shoeM.needsUpdate=true;
    this.auraM.color.set(s.glow);this.auraM.opacity=(IS_MOBILE?.18:.25)*LEADER_AURA_POWER;this.auraM.needsUpdate=true;
    this.haloM.color.set(s.glow);this.haloM.opacity=(IS_MOBILE?.06:.095)*LEADER_AURA_POWER;this.haloM.needsUpdate=true;
    this.flameCapM.color.set(fxColor);this.flameCapM.needsUpdate=true;
    this.flameMs.forEach(m=>{m.color.set(fxColor);m.needsUpdate=true;});
  },
  setPart(p,x,y,z,rx,ry,rz,sx,sy,sz){
    p.position.set(x,y,z);
    p.rotation.set(rx||0,ry||0,rz||0);
    p.scale.set(sx||1,sy||1,sz||1);
  },
  updatePose(pose){
    if(!this.ready||!this.group)this.init();
    if(!this.group)return;
    this.group.visible=true;
    const ls=(window.LeaderStyle&&LeaderStyle.get)?LeaderStyle.get():{flameMode:'ghost',scale:1,flameSize:1,flameHeight:1,flameOpacity:1,aura:1,headGlow:1,halo:1};
    const s=(IS_MOBILE?1.11:1.17)*Number(ls.scale||1);
    const t=pose.t||elapsed||0, ph=pose.ph||0;
    const pulse=1+Math.sin(t*4.2+ph)*.025;
    this.group.position.set(pose.x,0,pose.z);
    this.group.scale.setScalar(s*pulse);

    const faceZ=(pose.isBoss||pose.isDance)?.295:.282;
    const headGlow=1+Math.max(0,Math.sin(t*6.0+ph))*0.18;
    this.haloM.opacity=(IS_MOBILE?.045:.075)*LEADER_AURA_POWER*headGlow*Number(ls.halo||1);
    this.auraM.opacity=(IS_MOBILE?.14:.20)*LEADER_AURA_POWER*(pose.isFight?.65:1)*Number(ls.aura||1);

    const auraScale=(1+Math.sin(t*3.0+ph)*.09)*Math.max(.2,Number(ls.aura||1));
    this.setPart(this.parts.aura,0,.045,.02,-Math.PI/2,0,t*.75,auraScale,auraScale,1);
    const haloScale=1.02*(.6+Math.max(.2,Number(ls.halo||1))*.4);
    this.setPart(this.parts.halo,0,pose.HY+.02,.03,0,0,0,haloScale,haloScale,haloScale);
    this.setPart(this.parts.head,0,pose.HY,.015+Math.sin(pose.headTilt||0)*.015,(pose.lean||0)+(pose.headTilt||0),pose.bodyYaw||0,0,1.05,1.05,1.05);

    // Attached flame crown. It follows the head exactly, so it never becomes circle-smoke behind the player.
    const mode=String(ls.flameMode||'ghost');
    const modeOpacity=mode==='off'?0:(mode==='soft'?.62:(mode==='fire'?1.20:1));
    const modeSize=mode==='soft'?.82:(mode==='fire'?1.18:1);
    const flameBaseY=pose.HY+.38+(Number(ls.flameHeight||1)-1)*.13;
    const flameZ=.045;
    const fightBoost=pose.isFight?1.12:1;
    const danceBoost=pose.isDance?1.12:1;
    const flamePulse=1+Math.sin(t*(mode==='fire'?9.5:8.0)+ph)*.10;
    const flameOpacityBase=(IS_MOBILE?.23:.32)*LEADER_AURA_POWER*(pose.isFight?.92:1)*danceBoost*Number(ls.flameOpacity||1)*modeOpacity;
    for(let fi=0;fi<this.flameMs.length;fi++){
      const fp=this.parts['flame'+fi];
      fp.visible=mode!=='off';
      const wave=Math.sin(t*(5.6+fi*.55)+(mode==='fire'?t*1.1:0)+ph+fi*1.7);
      this.flameMs[fi].opacity=flameOpacityBase*(.78+Math.max(0,wave)*.28);
      const yaw=(fi===0?0:(fi===1?1.05:-1.05));
      this.setPart(
        fp,
        Math.sin(t*3.4+ph+fi)*.018,
        flameBaseY+.035*fi,
        flameZ+.015*fi,
        .04*Math.sin(t*3.1+ph+fi),
        yaw,
        .10*Math.sin(t*4.2+ph+fi),
        (.88+fi*.10)*flamePulse*fightBoost*Number(ls.flameSize||1)*modeSize,
        (1.00+fi*.16)*(1+Math.max(0,wave)*.16)*danceBoost*Number(ls.flameSize||1)*Number(ls.flameHeight||1)*modeSize,
        1
      );
    }
    this.flameCapM.opacity=(IS_MOBILE?.075:.12)*LEADER_AURA_POWER*(1+Math.max(0,Math.sin(t*7.0+ph))*.35)*Number(ls.headGlow||1)*(mode==='off'?.35:1);
    const capScale=Math.max(.2,Number(ls.headGlow||1));
    this.setPart(this.parts.flameCap,0,pose.HY+.14,.02,0,0,0,capScale,capScale,capScale);

    this.setPart(this.parts.eyeL,-.105,pose.HY+.045,faceZ,0,0,0,1,1,1);
    this.setPart(this.parts.eyeR,.105,pose.HY+.045,faceZ,0,0,0,1,1,1);
    this.setPart(this.parts.mouth,0,pose.HY-.085,faceZ+.012,0,0,0,1+Math.sin(t*5+ph)*.08,1,1);
    this.setPart(this.parts.body,0,pose.BY,0,pose.lean||0,pose.bodyYaw||0,0,1,1.04,1);
    this.setPart(this.parts.belt,0,pose.BY-.055,.135,0,pose.bodyYaw||0,0,1,1,1);

    const AL=pose.isDance?.26:.20, LL=pose.isDance?.23:.215;
    if(pose.isDance){
      const beat=Math.sin(t*7.5+ph), aswg=pose.aswg||0, swg=pose.swg||0, alt=Math.sin(t*4+ph)>0?1:-1;
      const up=Math.max(0,beat);
      this.setPart(this.parts.armL,-.235,pose.SY+.10+up*.24,.055+Math.sin(aswg)*.115,-1.08+aswg*.28,0,.75*alt);
      this.setPart(this.parts.armR,.235,pose.SY+.10+Math.max(0,-beat)*.24,.055-Math.sin(aswg)*.115,1.08-aswg*.28,0,-.75*alt);
      this.setPart(this.parts.legL,-.115,pose.HIP-LL*Math.cos(swg),.07+LL*Math.sin(swg),swg*.74,0,.14);
      this.setPart(this.parts.legR,.115,pose.HIP-LL*Math.cos(-swg),.07+LL*Math.sin(-swg),-swg*.74,0,-.14);
      this.setPart(this.parts.footL,-.115,pose.HIP-.38+Math.abs(Math.sin(t*6+ph))*.055,.095+LL*Math.sin(swg),0,pose.bodyYaw||0,swg*.22);
      this.setPart(this.parts.footR,.115,pose.HIP-.38+Math.abs(Math.sin(t*6+ph+Math.PI))*.055,.095+LL*Math.sin(-swg),0,pose.bodyYaw||0,-swg*.22);
    }else if(pose.isFight){
      const punchL=Math.max(0,Math.sin(t*5.1+ph));
      const punchR=Math.max(0,Math.sin(t*5.1+ph+Math.PI));
      const guard=Math.sin(t*2.55+ph)>0?1:-1;
      const swg=pose.swg||0;
      this.setPart(this.parts.armL,-.21,pose.SY+.035+punchL*.04,.115+punchL*.34,-.58+punchL*1.10,0,.48*guard);
      this.setPart(this.parts.armR,.21,pose.SY+.035+punchR*.04,.115+punchR*.34,-.58+punchR*1.10,0,-.48*guard);
      this.setPart(this.parts.legL,-.12,pose.HIP-.17+Math.abs(swg)*.04,.065+LL*Math.sin(swg)*.45,swg*.68,0,.13);
      this.setPart(this.parts.legR,.12,pose.HIP-.17+Math.abs(swg)*.04,.065+LL*Math.sin(-swg)*.45,-swg*.68,0,-.13);
      this.setPart(this.parts.footL,-.13,pose.HIP-.39,.095+LL*Math.sin(swg)*.35,0,pose.bodyYaw||0,swg*.30);
      this.setPart(this.parts.footR,.13,pose.HIP-.39,.095+LL*Math.sin(-swg)*.35,0,pose.bodyYaw||0,-swg*.30);
    }else{
      const swg=pose.swg||0, aswg=pose.aswg||0;
      this.setPart(this.parts.armL,-.215,pose.SY-AL*Math.cos(aswg),.045+AL*Math.sin(aswg),aswg,0,.42);
      this.setPart(this.parts.armR,.215,pose.SY-AL*Math.cos(-aswg),.045+AL*Math.sin(-aswg),-aswg,0,-.42);
      this.setPart(this.parts.legL,-.11,pose.HIP-LL*Math.cos(swg),.04+LL*Math.sin(swg),swg,0,0);
      this.setPart(this.parts.legR,.11,pose.HIP-LL*Math.cos(-swg),.04+LL*Math.sin(-swg),-swg,0,0);
      this.setPart(this.parts.footL,-.11,pose.HIP-.36,.085+LL*Math.sin(swg),0,pose.bodyYaw||0,swg*.25);
      this.setPart(this.parts.footR,.11,pose.HIP-.36,.085+LL*Math.sin(-swg),0,pose.bodyYaw||0,-swg*.25);
    }
  },
  hide(){if(this.group)this.group.visible=false;}
};
/* PROCEDURAL CHARACTER RENDERING */

function drawCrowd(cx,cz,t,mode){
  const H=new THREE.Matrix4().makeTranslation(0,-999,0);
  const n=members.length;
  const isDance=mode==='dance'||gState==='CELEBRATE';
  const isFight=mode==='fight'||(gState==='BOSS'&&bossClashDone);
  const isBoss=mode==='boss'||isFight||gState==='BOSS';
  let leaderDrawn=false;
  for(let i=0;i<C.maxInst;i++){
    if(i<n){
      const m=members[i];
      const ph=m.ph;
      const run=Math.sin(t*9+ph);
      const run2=Math.sin(t*9+ph+Math.PI);
      const beat=Math.sin(t*7.5+ph);
      const beat2=Math.sin(t*15+ph);
      let wx=cx+m.ox,wz=cz+m.oz;
      if(crowdJuiceT>0){
        const j=crowdJuiceT;
        const pop=Math.sin((1-j)*Math.PI)*j;
        wx+=Math.sin(t*14+ph)*.10*pop;
        wz+=Math.cos(t*12+ph)*.08*pop;
      }
      let BY,HY,SY,HIP,swg,aswg,lean,bodyYaw,headTilt;
      if(isDance){
        wx+=Math.sin(t*3.1+ph)*.16;
        wz+=Math.cos(t*2.7+ph)*.12;
        const bounce=Math.abs(beat)*.16+.04*Math.sin(t*20+ph);
        BY=.56+bounce;
        HY=1.03+bounce;
        SY=BY+.23;
        HIP=BY-.22;
        swg=Math.sin(t*6.5+ph)*.72;
        aswg=Math.sin(t*8.5+ph)*1.18;
        lean=Math.sin(t*3.6+ph)*.28;
        bodyYaw=Math.sin(t*2.5+ph)*.38;
        headTilt=Math.sin(t*5.5+ph)*.22;
      }else{
        if(isFight){
          // Slow-motion melee stance: crouch, lean forward, and punch toward the AI line.
          const fightBeat=Math.sin(t*5.1+ph);
          const heavyBeat=Math.sin(t*2.55+ph*.7);
          const bob=.035+Math.abs(fightBeat)*.055;
          wx+=Math.sin(t*2.2+ph)*.055;
          wz+=Math.max(0,fightBeat)*.075;
          swg=Math.sin(t*3.2+ph)*.35;
          aswg=fightBeat*1.22;
          BY=.49+bob;
          HY=.97+bob;
          SY=BY+.20;
          HIP=BY-.23;
          lean=.22+Math.max(0,fightBeat)*.10;
          bodyYaw=heavyBeat*.18;
          headTilt=Math.sin(t*4.7+ph)*.10;
        }else{
          const stride=isBoss?7.5:9;
          swg=Math.sin(t*stride+ph)*(isBoss ? .48 : .62);
          aswg=-swg*.92;
          const bob=Math.abs(Math.sin(t*stride+ph))*(isBoss ? .035 : .060);
          const sideSway=Math.sin(t*stride*.5+ph)*.025;
          wx+=sideSway;
          BY=.52+bob;
          HY=.99+bob;
          SY=BY+.19;
          HIP=BY-.22;
          lean=isBoss ? .03 : .10;
          bodyYaw=Math.sin(t*stride*.45+ph)*(isBoss ? .08 : .14);
          headTilt=Math.sin(t*stride*.7+ph)*.035;
        }
      }
      if(crowdJuiceT>0){
        const j=crowdJuiceT;
        const pop=Math.sin((1-j)*Math.PI)*j;
        BY+=pop*(crowdJuiceGood?.18:-.06);
        HY+=pop*(crowdJuiceGood?.18:-.06);
        lean+=pop*(crowdJuiceGood?.10:.18);
      }
      const secretPose=secretCrowdWavePose(m,t);
      if(secretPose){
        const spreadScale=secretPose.spread||0;
        wx+=m.ox*spreadScale;
        wz+=m.oz*spreadScale;
        BY+=secretPose.y;
        HY+=secretPose.y;
        SY+=secretPose.y;
        HIP+=secretPose.y*.45;
        aswg+=(secretPose.arm||0)*(Math.sin(ph)>0?1:-1);
        lean+=secretPose.lean||0;
        headTilt+=(secretPose.arm||0)*.10*Math.sin(ph);
      }
      if(i===0){
        hideHumanInstance(i,H);
        const leaderPose={x:wx,z:wz,BY,HY,SY,HIP,swg,aswg,lean,bodyYaw,headTilt,isDance,isFight,isBoss,t,ph};
        LeaderFX.updatePose(leaderPose);
        leaderDrawn=true;
        continue;
      }
      const AL=isDance ? .24 : .18,LL=isDance ? .21 : .20;
      const faceZ=(isBoss||isDance) ? .255 : .245;
      // Main clay body
      set3(iHead,i,wx,HY,wz+Math.sin(headTilt)*.015,lean+headTilt,bodyYaw,0,1.03,1.03);
      set3(iEyeL,i,wx-.085,HY+.035,wz+faceZ,0,0,0);
      set3(iEyeR,i,wx+.085,HY+.035,wz+faceZ,0,0,0);
      set3(iBody,i,wx,BY,wz,lean,bodyYaw,0,1,1);
      set3(iBelt,i,wx,BY-.05,wz+.12,0,bodyYaw,0);
      if(isDance){
        // Victory dance: one arm up, one arm out, then swap on the beat.
        const up=Math.max(0,beat);
        const alt=Math.sin(t*4+ph)>0?1:-1;
        set3(iArmL,i,wx-.21,SY+.08+up*.20,wz+.04+Math.sin(aswg)*.10,-1.02+aswg*.26,0,.65*alt);
        set3(iArmR,i,wx+.21,SY+.08+Math.max(0,-beat)*.20,wz+.04-Math.sin(aswg)*.10,1.02-aswg*.26,0,-.65*alt);
        set3(iLegL,i,wx-.10,HIP-LL*Math.cos(swg),wz+LL*Math.sin(swg),swg*.70,0,.12);
        set3(iLegR,i,wx+.10,HIP-LL*Math.cos(-swg),wz+LL*Math.sin(-swg),-swg*.70,0,-.12);
        set3(iFootL,i,wx-.10,HIP-.35+Math.abs(Math.sin(t*6+ph))*.05,wz+.08+LL*Math.sin(swg),0,bodyYaw,swg*.20);
        set3(iFootR,i,wx+.10,HIP-.35+Math.abs(Math.sin(t*6+ph+Math.PI))*.05,wz+.08+LL*Math.sin(-swg),0,bodyYaw,-swg*.20);
      }else if(isFight){
        // Alternating punch / block animation during the slow final clash.
        const punchL=Math.max(0,Math.sin(t*5.1+ph));
        const punchR=Math.max(0,Math.sin(t*5.1+ph+Math.PI));
        const guard=Math.sin(t*2.55+ph)>0?1:-1;
        set3(iArmL,i,wx-.18,SY+.02+punchL*.035,wz+.10+punchL*.30,-.55+punchL*1.05,0,.42*guard);
        set3(iArmR,i,wx+.18,SY+.02+punchR*.035,wz+.10+punchR*.30,-.55+punchR*1.05,0,-.42*guard);
        set3(iLegL,i,wx-.105,HIP-.16+Math.abs(swg)*.035,wz+.05+LL*Math.sin(swg)*.45,swg*.65,0,.12);
        set3(iLegR,i,wx+.105,HIP-.16+Math.abs(swg)*.035,wz+.05+LL*Math.sin(-swg)*.45,-swg*.65,0,-.12);
        set3(iFootL,i,wx-.115,HIP-.36,wz+.08+LL*Math.sin(swg)*.35,0,bodyYaw,swg*.28);
        set3(iFootR,i,wx+.115,HIP-.36,wz+.08+LL*Math.sin(-swg)*.35,0,bodyYaw,-swg*.28);
      }else{
        set3(iArmL,i,wx-.19,SY-AL*Math.cos(aswg),wz+AL*Math.sin(aswg),aswg,0,.38);
        set3(iArmR,i,wx+.19,SY-AL*Math.cos(-aswg),wz+AL*Math.sin(-aswg),-aswg,0,-.38);
        set3(iLegL,i,wx-.095,HIP-LL*Math.cos(swg),wz+LL*Math.sin(swg),swg,0,0);
        set3(iLegR,i,wx+.095,HIP-LL*Math.cos(-swg),wz+LL*Math.sin(-swg),-swg,0,0);
        set3(iFootL,i,wx-.095,HIP-.33,wz+.07+LL*Math.sin(swg),0,bodyYaw,swg*.25);
        set3(iFootR,i,wx+.095,HIP-.33,wz+.07+LL*Math.sin(-swg),0,bodyYaw,-swg*.25);
      }
    } else {
      hideHumanInstance(i,H);
    }
  }
  if(!leaderDrawn){LeaderFX.hide();}
  [iHead,iBody,iArmL,iArmR,iLegL,iLegR,iEyeL,iEyeR,iFootL,iFootR,iBelt].forEach(m=>m.instanceMatrix.needsUpdate=true);
}

function drawRobots(t,mode){
  const allAlive=bossRobots.filter(r=>r.alive);
  const visibleN=bossVisibleAIFor(allAlive.length);
  const alive=allAlive.slice(0,visibleN);
  const isFight=mode==='fight'||(gState==='BOSS'&&bossClashDone);
  const H=new THREE.Matrix4().makeTranslation(0,-999,0);
  for(let i=0;i<200;i++){
    if(i<alive.length){
      const r=alive[i];
      const ph=r.ph||i*.9;
      const step=Math.sin(t*(isFight?5.0:7.5)+ph);
      const bob=Math.abs(step)*(isFight?.075:.055);
      const swg=step*(isFight?.66:.48);
      const glitchX=Math.sin(t*23+i*1.7)*(isFight?.035:.018);
      const glitchY=Math.sin(t*31+i*.73)*(isFight?.025:.012);
      const lean=isFight?(-.30+Math.max(0,step)*.10):(-.12+Math.sin(t*5+ph)*.06);
      const x=r.x+glitchX,z=r.z+(isFight? -Math.max(0,step)*.055:0);
      set3(rHead,i,x,.91+bob+glitchY,z,lean,0,Math.sin(t*(isFight?5.6:4)+ph)*(isFight?.16:.08));
      set3(rBody,i,x,.48+bob*.55,z,lean*.35,0,0);
      set3(rAnt,i,x,1.15+bob+Math.abs(Math.sin(t*13+ph))*.05,z-.025);
      set3(rGlow,i,x,.58+bob*.45,z-.02,0,0,0,1+Math.sin(t*(isFight?12:8)+ph)*.22,1+Math.sin(t*(isFight?12:8)+ph)*.22);
      set3(rEyeL,i,x-.075,.94+bob,z-.145);
      set3(rEyeR,i,x+.075,.94+bob,z-.145);
      set3(rCore,i,x,.55+bob*.4,z-.13,0,0,0,1+Math.sin(t*(isFight?14:10)+ph)*.28,1+Math.sin(t*(isFight?14:10)+ph)*.28);
      set3(rShoulderL,i,x-.18,.64+bob*.45,z-.02);
      set3(rShoulderR,i,x+.18,.64+bob*.45,z-.02);
      if(isFight){
        const punchL=Math.max(0,Math.sin(t*5.0+ph+Math.PI));
        const punchR=Math.max(0,Math.sin(t*5.0+ph));
        set3(rArm,i*2,x-.205,.60+bob-.05*Math.cos(swg),z-.09-punchL*.27,-.85-punchL*.75,0,.18);
        set3(rArm,i*2+1,x+.205,.60+bob-.05*Math.cos(-swg),z-.09-punchR*.27,-.85-punchR*.75,0,-.18);
        set3(rLeg,i*2,x-.08,.25+bob*.5-.09*Math.cos(-swg),z+.06*Math.sin(-swg),-swg*.5,0,0);
        set3(rLeg,i*2+1,x+.08,.25+bob*.5-.09*Math.cos(swg),z+.06*Math.sin(swg),swg*.5,0,0);
      }else{
        set3(rArm,i*2,x-.205,.60+bob-.12*Math.cos(swg),z-.02+.12*Math.sin(swg),swg,0,.16);
        set3(rArm,i*2+1,x+.205,.60+bob-.12*Math.cos(-swg),z-.02+.12*Math.sin(-swg),-swg,0,-.16);
        set3(rLeg,i*2,x-.08,.27+bob*.5-.16*Math.cos(-swg),z+.15*Math.sin(-swg),-swg,0,0);
        set3(rLeg,i*2+1,x+.08,.27+bob*.5-.16*Math.cos(swg),z+.15*Math.sin(swg),swg,0,0);
      }
    } else {
      rHead.setMatrixAt(i,H);rBody.setMatrixAt(i,H);
      rAnt.setMatrixAt(i,H);rGlow.setMatrixAt(i,H);
      rEyeL.setMatrixAt(i,H);rEyeR.setMatrixAt(i,H);rCore.setMatrixAt(i,H);
      rShoulderL.setMatrixAt(i,H);rShoulderR.setMatrixAt(i,H);
      if(i*2+1<400){rArm.setMatrixAt(i*2,H);rArm.setMatrixAt(i*2+1,H);rLeg.setMatrixAt(i*2,H);rLeg.setMatrixAt(i*2+1,H);}
    }
  }
  if(_robotMeshesReady)[rHead,rBody,rArm,rLeg,rAnt,rGlow,rEyeL,rEyeR,rCore,rShoulderL,rShoulderR].forEach(m=>m.instanceMatrix.needsUpdate=true);
}

function crowdR(){return Math.max(.7,Math.sqrt(Math.min(crowd,C.maxInst)*.5)*.52);}

function shouldTrySecretCrowdWave(type,before,after){
  if(gState!=='RUNNING'||!type||!type.good||secretCrowdWave||secretCrowdWaveCooldown>0)return false;
  before=Math.max(0,Math.round(before||0));
  after=Math.max(0,Math.round(after||0));
  const gain=after-before;
  if(after<120||gain<45)return false;
  if(type.t==='mult'&&before>=350&&gain>=250)return Math.random()<.38;
  if(type.t==='mult'&&before>=180&&gain>=140)return Math.random()<.18;
  if(gain>=180&&combo>=4)return Math.random()<.14;
  if(after>=220&&combo>=5)return Math.random()<.08;
  return false;
}
function pickSecretCrowdWaveKind(){
  const pool=[0,1,2].filter(k=>k!==secretCrowdWaveLastKind);
  const kind=pool[Math.floor(Math.random()*pool.length)]||0;
  secretCrowdWaveLastKind=kind;
  return kind;
}
function triggerSecretCrowdWave(type,before,after,gz){
  if(!shouldTrySecretCrowdWave(type,before,after))return;
  const kind=pickSecretCrowdWaveKind();
  const names=['TEAM WAVE','MEGA JUMP','SPIRAL CHEER'];
  const colors=['#00E5FF','#FFD740','#69F0AE'];
  secretCrowdWave={kind,t:0,dur:kind===1?1.45:1.75,z:gz||dist+8,before,after};
  secretCrowdWaveCooldown=9+Math.random()*6;
  crowdJuiceT=Math.max(crowdJuiceT,1.05);
  crowdJuiceGood=true;
  triggerRunSlowMo(.22,.45);
  rewardFlash(kind===1?'gold':'blue');
  shake(kind===1?.62:.46);
  floatTxt(names[kind],innerWidth*.5,innerHeight*.34,colors[kind],kind===1?50:42,'boom');
  ringBurst(cxVar,gz||dist+8,kind===1?72:54);
  burst(cxVar,2.0,gz||dist+8,kind===1?0xFFD740:kind===2?0x69F0AE:0x00E5FF,IS_MOBILE?28:48);
  if(kind===2)setTimeout(()=>sparkleRain(cxVar,gz||dist+8,true),120);
  if(window.DramaFX)DramaFX.toast(names[kind],colors[kind],IS_MOBILE?'medium':'big',innerHeight*.39,950);
  if(window.Sensory)Sensory.play('milestone');
  if(window.Haptic)Haptic.pulse('milestone');
}
function secretCrowdWavePose(m,t){
  if(!secretCrowdWave||!m)return null;
  const w=secretCrowdWave;
  const p=Math.max(0,Math.min(1,w.t/w.dur));
  const fade=Math.sin(Math.PI*p);
  const distFromCenter=Math.sqrt((m.ox||0)*(m.ox||0)+(m.oz||0)*(m.oz||0));
  if(w.kind===0){
    const front=p*7.5;
    const band=Math.max(0,1-Math.abs(distFromCenter-front)/1.25);
    const amp=band*fade;
    return{y:.34*amp,arm:1.25*amp,lean:-.18*amp,spread:.10*amp};
  }
  if(w.kind===1){
    const pulse=Math.pow(Math.max(0,Math.sin(Math.PI*p*2)),.65);
    const amp=pulse*fade;
    return{y:.48*amp,arm:1.55*amp,lean:-.12*amp,spread:.07*amp};
  }
  const angle=Math.atan2(m.oz||0,m.ox||0);
  const sweep=Math.sin(angle+p*7.5-distFromCenter*.34);
  const amp=Math.max(0,sweep)*fade;
  return{y:.26*amp,arm:1.15*amp,lean:.20*amp,spread:.14*amp};
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   GATES â€” fill most of road width
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function makeGateTex(type,col,tc){
  const lbl=(type&&type.lbl)||'';
  const isGood=!!(type&&type.good);
  const cv=document.createElement('canvas'); cv.width=360;cv.height=260;
  const ctx=cv.getContext('2d');
  ctx.clearRect(0,0,360,260);
  const glass=ctx.createLinearGradient(0,0,0,260);
  if(isGood){
    glass.addColorStop(0,'rgba(0,255,180,.55)');glass.addColorStop(.42,'rgba(0,150,255,.32)');glass.addColorStop(1,'rgba(0,20,50,.10)');
  }else{
    glass.addColorStop(0,'rgba(255,45,45,.60)');glass.addColorStop(.45,'rgba(130,0,70,.38)');glass.addColorStop(1,'rgba(25,0,20,.14)');
  }
  if(ctx.roundRect)ctx.roundRect(7,7,346,246,30); else ctx.rect(7,7,346,246);
  ctx.fillStyle=glass;ctx.fill();

  // outer glow frame
  ctx.shadowColor=tc||'#fff';ctx.shadowBlur=38;ctx.strokeStyle=tc||'#fff';ctx.lineWidth=9;
  if(ctx.roundRect)ctx.roundRect(10,10,340,240,30); else ctx.rect(10,10,340,240);
  ctx.stroke();ctx.shadowBlur=0;
  // animated-look scanlines and glass shine baked in
  ctx.fillStyle='rgba(255,255,255,.16)';if(ctx.roundRect)ctx.roundRect(18,18,324,48,22); else ctx.rect(18,18,324,48);ctx.fill();
  ctx.strokeStyle=isGood?'rgba(185,255,230,.22)':'rgba(255,210,210,.23)';ctx.lineWidth=4;
  for(let x=-360;x<460;x+=34){ctx.beginPath();ctx.moveTo(x,252);ctx.lineTo(x+210,8);ctx.stroke();}

  if(isGood){
    for(let i=0;i<36;i++){ctx.fillStyle=`rgba(255,255,255,${.16+Math.random()*.35})`;ctx.beginPath();ctx.arc(24+Math.random()*312,26+Math.random()*206,1+Math.random()*2.5,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='rgba(0,255,170,.22)';ctx.beginPath();ctx.arc(180,132,76,0,Math.PI*2);ctx.fill();
  }else{
    // danger cracks
    ctx.strokeStyle='rgba(255,255,255,.32)';ctx.lineWidth=3;
    for(let i=0;i<9;i++){const sx=40+Math.random()*280, sy=35+Math.random()*170;ctx.beginPath();ctx.moveTo(sx,sy);for(let k=0;k<4;k++)ctx.lineTo(sx+(Math.random()-.5)*70,sy+(k+1)*18);ctx.stroke();}
    ctx.fillStyle='rgba(0,0,0,.14)';for(let y=22;y<238;y+=28){ctx.fillRect(16,y,328,11);}
  }

  if(type&&type.t==='mult'&&type.v===2){
    drawGateCopyIcon(ctx,180,110,.72,tc);
  }else if(type&&type.t==='double_bad'){
    drawGateHalfIcon(ctx,180,89,.72,tc);
  }else{
    // symbol/name: number only, huge and readable
    const fs=lbl.length>=6?66:lbl.length>=4?90:lbl.length===3?112:130;
    ctx.font=`900 ${fs}px "Arial Black",Impact,Arial`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.lineWidth=13;ctx.strokeStyle='rgba(0,0,0,.72)';ctx.shadowColor=tc||'#fff';ctx.shadowBlur=34;
    ctx.strokeText(lbl,180,142);ctx.fillStyle='#fff';ctx.fillText(lbl,180,142);ctx.shadowBlur=0;
  }
  // icon chip
  ctx.font='900 38px Arial Black,Arial';ctx.fillStyle=tc||'#fff';ctx.shadowColor=tc||'#fff';ctx.shadowBlur=18;ctx.fillText(isGood?'+':type&&type.t==='double_bad'?'!':'-',180,45);ctx.shadowBlur=0;
  const tex=new THREE.CanvasTexture(cv);tex.anisotropy=4;return tex;
}

const gateAuraTexCache={};
function makeGateAuraTex(kind){
  if(gateAuraTexCache[kind])return gateAuraTexCache[kind];
  const cv=document.createElement('canvas');cv.width=256;cv.height=256;
  const ctx=cv.getContext('2d');
  const good=kind==='good', halve=kind==='halve';
  const core=good?'rgba(0,255,190,.58)':halve?'rgba(234,128,252,.52)':'rgba(255,68,68,.50)';
  const mid=good?'rgba(0,229,255,.22)':halve?'rgba(255,64,129,.20)':'rgba(255,138,101,.18)';
  const edge=good?'rgba(255,215,64,.06)':halve?'rgba(234,128,252,.05)':'rgba(255,23,68,.05)';
  const g=ctx.createRadialGradient(128,128,8,128,128,128);
  g.addColorStop(0,core);g.addColorStop(.34,mid);g.addColorStop(.72,edge);g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,256,256);
  ctx.globalCompositeOperation='lighter';
  ctx.strokeStyle=good?'rgba(220,255,245,.22)':halve?'rgba(255,210,255,.20)':'rgba(255,225,210,.18)';
  ctx.lineWidth=3;
  for(let i=-80;i<330;i+=30){
    ctx.beginPath();ctx.moveTo(i,238);ctx.lineTo(i+120,20);ctx.stroke();
  }
  ctx.strokeStyle=good?'rgba(255,215,64,.18)':halve?'rgba(234,128,252,.17)':'rgba(255,82,82,.18)';
  ctx.lineWidth=5;ctx.strokeRect(36,34,184,188);
  const tex=new THREE.CanvasTexture(cv);
  tex.anisotropy=2;
  gateAuraTexCache[kind]=tex;
  return tex;
}

function shiftBright(hex,f){
  let c=parseInt(hex.slice(1),16);
  const r=Math.min(255,((c>>16)&0xff)*f)|0;
  const g=Math.min(255,((c>>8)&0xff)*f)|0;
  const b=Math.min(255,(c&0xff)*f)|0;
  return '#'+(r<<16|g<<8|b).toString(16).padStart(6,'0');
}
function wRand(pool){
  const tot=pool.reduce((s,x)=>s+x.w,0);
  let r=Math.random()*tot;
  for(const x of pool){r-=x.w;if(r<=0)return x;}
  return pool[pool.length-1];
}

function spawnGate(z){
  const profile=runDifficultyProfile();
  if(!profile.allowGates)return;
  const gatePool=C.gates.filter(g=>gateAllowedForProgression(g,profile));
  const goodPool=gatePool.filter(g=>g.good);
  const badPool=gatePool.filter(g=>!g.good);
  if(!goodPool.length)return;
  let L,R;
  if(feverActive){
    // During Fever, the gate table becomes luckier but still not guaranteed.
    const feverPool=gatePool.map(g=>({...g,w:g.w*(g.good?2.5:.3)}));
    L=wRand(feverPool); R=wRand(feverPool);
    // Never spawn a double-bad pair during Fever; this keeps the state readable and rewarding.
    if(!L.good&&!R.good){
      if(Math.random()>.5)L=wRand(goodPool);
      else R=wRand(goodPool);
    }
  }else if(!profile.allowBadGates||!badPool.length){
    L=wRand(goodPool);
    R=wRand(goodPool);
    if(goodPool.length>1&&R===L)R=wRand(goodPool.filter(g=>g!==L));
  }else{
    const good=wRand(goodPool);
    const bad=wRand(badPool);
    const leftGood=Math.random()>.5;
    L=leftGood?good:bad; R=leftGood?bad:good;
  }
  const halfW=C.laneW*.47;
  const lx=-halfW/2-.18, rx=halfW/2+.18;

  function mkPanel(type,px){
    const capColor=themeGateColor(type);
    const textColor=themeGateText(type);
    // FrontSide only â€” prevents back-face from showing through and causing blur
    const frontMat=new THREE.MeshLambertMaterial({
      map:makeGateTex(type,capColor,textColor),
      transparent:true,opacity:type.good?.90:.94,side:THREE.FrontSide,depthWrite:true,
      emissive:capColor,emissiveIntensity:type.good?.18:.14
    });
    const m=new THREE.Mesh(new THREE.BoxGeometry(halfW-.1,4.2,.08),frontMat);
    m.position.set(px,2.1,z); m.castShadow=false;
    const auraKind=type.good?'good':type.t==='double_bad'?'halve':'bad';
    const aura=new THREE.Mesh(
      new THREE.PlaneGeometry(halfW+.85,4.95),
      new THREE.MeshBasicMaterial({
        map:makeGateAuraTex(auraKind),color:capColor,transparent:true,opacity:type.good?.08:.055,
        blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide
      })
    );
    aura.position.set(px,2.1,z-.07);
    aura.visible=false;
    aura.renderOrder=2;m.renderOrder=3;
    // Glowing top bar
    const top=new THREE.Mesh(new THREE.BoxGeometry(halfW-.1,.14,.14),new THREE.MeshBasicMaterial({color:capColor,transparent:true,opacity:.9}));
    top.position.set(px,4.2,z);
    top.renderOrder=4;
    scene.add(aura,m,top);
    // Dummy post and ring (null) to keep object shape consistent
    const post=null, ring=null;
    return{m,top,post,ring,aura,type,px,halfW,baseEmissive:type.good?.14:.08,lockFx:false};
  }
  const lp=mkPanel(L,lx), rp=mkPanel(R,rx);
  gates_.push({lp,rp,z,hit:false});
}

function updateConsequenceBar(gates){
  // Show consequence labels for the NEXT unhit gate only
  const next=gates.find(g=>!g.hit&&g.z>cxVar+5);
  const bar=document.getElementById('consequence-bar');
  if(next&&next.z-(dist+5)<45){
    const lType=next.lp.type, rType=next.rp.type;
    document.getElementById('cq-left').textContent=lType.lbl;
    document.getElementById('cq-left').style.color=themeGateText(lType);
    document.getElementById('cq-left').style.borderColor=rgbaFromHex(themeGateText(lType),.44);
    document.getElementById('cq-right').textContent=rType.lbl;
    document.getElementById('cq-right').style.color=themeGateText(rType);
    document.getElementById('cq-right').style.borderColor=rgbaFromHex(themeGateText(rType),.44);
    bar.classList.add('show');
  } else {
    bar.classList.remove('show');
  }
}

function updateGatePanelDopamine(panel,g,cx,cz,t,pulse){
  if(!panel||!panel.m)return;
  const dz=g.z-cz;
  const ahead=clamp((46-dz)/38,0,1)*clamp((dz+5)/10,0,1);
  const lateral=clamp(1-Math.abs(cx-panel.px)/(panel.halfW*.82),0,1);
  const selected=ahead*lateral;
  const good=!!panel.type.good;
  const breathe=Math.sin(t*(good?7.4:6.2)+g.z*.09+panel.px*.7);
  const xBoost=selected*(good?.055:.032)+ahead*.025*breathe;
  const yBoost=ahead*(good?.04:.025)+selected*.02;
  panel.m.scale.x=pulse*(1+xBoost);
  panel.m.scale.y=pulse*(1+yBoost);
  if(panel.m.material&&panel.m.material.emissiveIntensity!=null){
    panel.m.material.emissiveIntensity=panel.baseEmissive+ahead*(good?.34:.19)+selected*(good?.24:.10);
  }
  if(panel.top){
    panel.top.scale.x=1+ahead*.13+selected*.10;
    panel.top.scale.y=1+ahead*.18;
    if(panel.top.material)panel.top.material.opacity=.68+ahead*.22+selected*.10;
  }
  if(panel.aura){
    panel.aura.visible=ahead>.02;
    panel.aura.scale.x=1+ahead*.18+selected*.18+Math.max(0,breathe)*.025;
    panel.aura.scale.y=1+ahead*.12+selected*.10;
    if(panel.aura.material){
      panel.aura.material.opacity=(good?.055:.04)+ahead*(good?.22:.15)+selected*(good?.18:.08);
    }
  }
  if(good&&ahead>.56&&lateral>.72){
    if(!panel.lockFx){
      panel.lockFx=true;
      burst(panel.px,2.15,g.z,themeGateColor(panel.type),IS_MOBILE?8:14);
      if(!IS_MOBILE)ringBurst(panel.px,g.z,8);
    }
  }else if(ahead<.25||lateral<.42){
    panel.lockFx=false;
  }
}

function updateGates(cx,cz,t){
  updateConsequenceBar(gates_);
  for(const g of gates_){
    const pulse=1+Math.sin(t*4+g.z*.1)*.03;
    updateGatePanelDopamine(g.lp,g,cx,cz,t,pulse);
    updateGatePanelDopamine(g.rp,g,cx,cz,t,pulse);
    // rings removed
    if(!g.hit){
      const dz=Math.abs(cz-g.z);
      if(dz<crowdR()+1.0){
        const dL=Math.abs(cx-g.lp.px), dR=Math.abs(cx-g.rp.px);
        if(dL<g.lp.halfW*.58){applyGate(g.lp.type,cz);g.hit=true;scene.remove(g.lp.m,g.lp.top,g.lp.post,g.lp.ring,g.lp.aura);}
        else if(dR<g.rp.halfW*.58){applyGate(g.rp.type,cz);g.hit=true;scene.remove(g.rp.m,g.rp.top,g.rp.post,g.rp.ring,g.rp.aura);}
        else if(dz<.8){if(dL<dR){applyGate(g.lp.type,cz);scene.remove(g.lp.m,g.lp.top,g.lp.post,g.lp.ring,g.lp.aura);}else{applyGate(g.rp.type,cz);scene.remove(g.rp.m,g.rp.top,g.rp.post,g.rp.ring,g.rp.aura);}g.hit=true;}
      }
    }
  }
  for(let i=gates_.length-1;i>=0;i--){
    const g=gates_[i];
    if(g.z<cz-34){scene.remove(g.lp.m,g.lp.top,g.lp.post,g.lp.ring,g.lp.aura,g.rp.m,g.rp.top,g.rp.post,g.rp.ring,g.rp.aura);gates_.splice(i,1);}
  }
}

function playerGateLabel(type,fallback){
  if(!type)return fallback||'';
  return type.lbl||fallback||'';
}

function applyGate(type,gz){
  const sx=innerWidth*.5, sy=innerHeight*.55;
  // Track choices for boss difficulty calculation
  if(type.good) goodChoices++; else badChoices++;
  recordFreshEvent(type.good?'good':'bad',1);
  if(type.t==='risk')recordFreshEvent('risk',1);

  crowdJuiceT=type.good?.75:.55;
  crowdJuiceGood=!!type.good;
  gateSparkT=.45;
  triggerRoadPulse(type.good,type.t==='mult'?1.25:type.t==='double_bad'?1.3:1.0);

  if(type.t==='add'){
    const before=crowd;
    const gain=Math.max(1,Math.round((type.v||0)*goodGateGainMultiplier()));
    crowd=Math.min(9999,crowd+gain);
    const after=crowd;
    floatTxt(playerGateLabel(type,'+'),sx,sy,type.tc||'#69F0AE',60,'boom');
    combo++; streak++; registerGoodCombo();checkFeverTrigger();awardFeverGateReward(type);
    burst(cxVar,1,gz,0x00FFAA,30);
    sparkleRain(cxVar,gz,type.good);
    rebuildFormation(); rewardFlash('blue'); uiFeedbackPulse('good',420); shake(.18);
    triggerSecretCrowdWave(type,before,after,gz);
    Sensory.play('gateGood',{combo,mult:false});Haptic.pulse('gateGood');
  } else if(type.t==='mult'){
    const before=crowd;
    crowd=Math.min(9999,Math.floor(crowd*type.v));
    const extra=Math.max(0,Math.round((crowd-before)*(goodGateGainMultiplier()-1)*.35));
    if(extra>0)crowd=Math.min(9999,crowd+extra);
    const after=crowd;
    floatTxt(playerGateLabel(type,'BOOST'),sx,sy,type.tc||'#FFD740',72,'spin');
    combo++; streak++; registerGoodCombo();checkFeverTrigger();awardFeverGateReward(type);
    burst(cxVar,1,gz,0xFFD740,48); rebuildFormation();
    rewardFlash('gold'); uiFeedbackPulse('perfect',620); shake(.52);
    triggerSecretCrowdWave(type,before,after,gz);
    Sensory.play('gateGood',{combo,mult:true});Haptic.pulse('gateGood');
    ringBurst(cxVar,gz); sparkleRain(cxVar,gz,true);
  } else if(type.t==='sub'){
    const before=Math.max(0,Math.round(crowd||0));
    const kill=Math.min(before,Math.max(0,Math.round((type.v||0)*badGateLossMultiplier())));
    crowd=Math.max(0,before-kill);
    floatTxt(playerGateLabel(type,'-'),sx,sy,type.tc||'#FF5252',62,'boom');
    if(feverActive)endFever('broken');
    combo=0; streak=0;feverNextCombo=C.feverCombo||5;
    explodeCrowdMembersAt(kill,cxVar,gz,0xFF3030,{all:crowd<=0});
    members.splice(Math.max(0,members.length-kill),kill);
    DramaFX.damage(kill,cxVar,gz,{big:kill>=50||crowd<=0});
    triggerBadGateShock(kill,'sub',gz);
    burst(cxVar,1,gz,0xFF3030,IS_MOBILE?12:22); sparkleRain(cxVar,gz,false);
    if(crowd<=0)finishLethalCrowdHit(cxVar,gz,0xFF3030);
    else if(crowd<peak*.25) showDanger();
    document.getElementById('crowd-lbl').style.color='#FF5252';
    setTimeout(()=>document.getElementById('crowd-lbl').style.color='#fff',700);
    rewardFlash('red'); uiFeedbackPulse('bad',460);
    Sensory.play('gateBad');Haptic.pulse('gateBad');
  } else if(type.t==='double_bad'){
    const kill=Math.max(1,Math.floor((crowd/2)*badGateLossMultiplier()));
    crowd=Math.max(1,crowd-kill);
    members.splice(members.length-Math.min(kill,members.length));
    rebuildFormation();
    floatTxt(playerGateLabel(type,'DANGER'),sx,sy,type.tc||'#EA80FC',56,'spin');
    if(feverActive)endFever('broken');
    rewardFlash('red'); uiFeedbackPulse('bad',520); combo=0; streak=0;feverNextCombo=C.feverCombo||5;
    DramaFX.damage(kill,cxVar,gz,{big:true});
    triggerBadGateShock(kill,'half',gz);
    burst(cxVar,1,gz,0xEA80FC,IS_MOBILE?14:24); sparkleRain(cxVar,gz,false); ringBurst(cxVar,gz);
    if(crowd<peak*.25) showDanger();
    Sensory.play('halve');Haptic.pulse('halve');
  }
  peak=Math.max(peak,crowd);
  checkMicroGoals(false);
  updateComboUI();
  updateNearMissSystem(0);
  if(combo>=3) floatTxt('x'+combo,innerWidth*.78,innerHeight*.42,'#FFD740',28,'streak');
  if(combo>=5) floatTxt('HOT x'+combo,innerWidth*.22,innerHeight*.45,'#FF8F00',30,'streak');
  milestones();
  updateHUD();
  if(crowd<=0) doLose();
}

function sparkleRain(x,z,good){
  const colors=good?[0x00FFAA,0x00E5FF,0xFFD740,0xFFFFFF]:[0xFF3030,0xFF1744,0xEA80FC,0xFFD740];
  for(let i=0;i<3;i++){
    const px=x+(Math.random()-.5)*5.5;
    const py=2.2+Math.random()*3.2;
    const pz=z+(Math.random()-.5)*3.2;
    burst(px,py,pz,colors[Math.floor(Math.random()*colors.length)],8+Math.floor(Math.random()*7));
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   RING BURST â€” dopamine mult reward
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function ringBurst(x,z,count){
  // Uses the particle pool â€” avoids alloc AND the drawRange=Infinity crash
  // that the old raw-push pattern caused in updateParticles.
  const n=Math.min(count||24,_PART_N);
  let slot=null;
  for(let k=0;k<_POOL_MAX;k++){if(!_partPool[k].active){slot=_partPool[k];break;}}
  if(!slot) return; // pool full â€” skip rather than crash
  slot.active=true;
  slot.life=1.2;
  slot.pts.material.color.setHex(0xFFD740);
  slot.pts.material.size=.44;
  slot.pts.material.opacity=1;
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2;
    slot.pos[i*3  ]=x;
    slot.pos[i*3+1]=1.5;
    slot.pos[i*3+2]=z;
    slot.vel[i*3  ]=Math.cos(a)*8;
    slot.vel[i*3+1]=3+Math.random()*3;
    slot.vel[i*3+2]=Math.sin(a)*8;
  }
  for(let i=n;i<_PART_N;i++) slot.pos[i*3+1]=-9999;
  slot.pts.geometry.attributes.position.needsUpdate=true;
  slot.pts.geometry.setDrawRange(0,n);
  scene.add(slot.pts);
  particles_.push(slot);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FORCED ITEMS â€” large floor items
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function spawnForcedItem(z){
  const profile=runDifficultyProfile();
  if(!profile.allowForcedItems)return;
  const itemTypes=[
    {t:'add',v:20,lbl:'+10',col:0x00897B,emCol:0x00FFCC,good:true},
    {t:'add',v:50,lbl:'+15',col:0x0D47A1,emCol:0x64B5F6,good:true},
    {t:'add',v:100,lbl:'+20',col:0x4A148C,emCol:0xEA80FC,good:true},
    {t:'mult',v:2,lbl:'X2',col:0xE65100,emCol:0xFFD740,good:true},
    {t:'sub',v:50,lbl:'-10',col:0xB71C1C,emCol:0xFF3030,good:false},
    {t:'sub',v:100,lbl:'-15',col:0x880000,emCol:0xFF1744,good:false},
    {t:'sub',v:120,lbl:'-20',col:0x3E0000,emCol:0xFF1744,good:false},
    {t:'double_bad',lbl:'/2',col:0x4A148C,emCol:0xEA80FC,good:false},
  ];
  const pool=itemTypes.filter(type=>gateAllowedForProgression(type,profile));
  if(pool.length<2)return;
  const goodPool=pool.filter(type=>type.good);
  const badPool=pool.filter(type=>!type.good);
  let A=goodPool.length?goodPool[Math.floor(Math.random()*goodPool.length)]:pool[Math.floor(Math.random()*pool.length)];
  let B=badPool.length?badPool[Math.floor(Math.random()*badPool.length)]:pool[Math.floor(Math.random()*pool.length)];
  if(B===A&&pool.length>1){
    const alt=pool.filter(type=>type!==A);
    B=alt[Math.floor(Math.random()*alt.length)];
  }
  const IW=3.2, lx=-1.8, rx=1.8;
  function mkItem(type,px){
    const grp=new THREE.Group();
    const slabMat=new THREE.MeshLambertMaterial({color:type.col,emissive:type.emCol,emissiveIntensity:.35});
    const slab=new THREE.Mesh(new THREE.BoxGeometry(IW,.22,2.4),slabMat);
    slab.position.y=.11; grp.add(slab);
    const lTex=makeForcedItemTex(type.lbl,type.col,type.emCol,type.good);
    const lMesh=new THREE.Mesh(new THREE.BoxGeometry(IW-.3,1.1,.12),new THREE.MeshBasicMaterial({map:lTex}));
    lMesh.position.set(0,.7,0); grp.add(lMesh);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(IW*.44,.08,8,32),new THREE.MeshBasicMaterial({color:type.emCol,transparent:true,opacity:.65}));
    ring.rotation.x=Math.PI/2; ring.position.y=.14; grp.add(ring);
    grp.position.set(px,.0,z);
    grp.userData={type,ring};
    scene.add(grp);
    return grp;
  }
  const left=mkItem(A,lx),right=mkItem(B,rx);
  forcedItems_.push({left,right,z,hit:false,leftType:A,rightType:B,lx,rx,IW});
}
function makeForcedItemTex(lbl,col,emCol,isGood){
  const cv=document.createElement('canvas');cv.width=256;cv.height=128;
  const ctx=cv.getContext('2d');
  const hx='#'+col.toString(16).padStart(6,'0');
  const ex='#'+emCol.toString(16).padStart(6,'0');
  const g=ctx.createLinearGradient(0,0,256,128);
  g.addColorStop(0,hx);g.addColorStop(.55,shiftBright(hx,1.55));g.addColorStop(1,hx);
  ctx.fillStyle=g;
  if(ctx.roundRect)ctx.roundRect(2,2,252,124,18);else ctx.rect(2,2,252,124);
  ctx.fill();
  ctx.shadowColor=ex;ctx.shadowBlur=18;
  ctx.strokeStyle=ex;ctx.lineWidth=5;
  if(ctx.roundRect)ctx.roundRect(2,2,252,124,18);else ctx.rect(2,2,252,124);
  ctx.stroke();ctx.shadowBlur=0;
  ctx.strokeStyle=isGood?'rgba(255,255,255,.18)':'rgba(255,210,210,.18)';ctx.lineWidth=4;
  for(let x=-160;x<300;x+=38){ctx.beginPath();ctx.moveTo(x,126);ctx.lineTo(x+120,2);ctx.stroke();}
  const fs=lbl.length>=4?46:lbl.length===3?58:70;
  ctx.shadowColor=ex;ctx.shadowBlur=20;
  ctx.font=`900 ${fs}px "Arial Black",Impact,Arial`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=8;ctx.strokeStyle='rgba(0,0,0,.58)';
  ctx.strokeText(lbl,128,68);
  ctx.fillStyle='#fff';ctx.fillText(lbl,128,68);
  return new THREE.CanvasTexture(cv);
}
function updateForcedItems(cx,cz,t){
  const profile=runDifficultyProfile();
  if(profile.allowForcedItems){
  while(nextForcedZ<cz+90&&dist<C.bossDist-60){
    // Ensure forced items don't spawn on top of gates or obstacles
    for(const g of gates_){if(Math.abs(g.z-nextForcedZ)<32)nextForcedZ=g.z+32;}
    for(const obs of obstacles_){if(Math.abs(obs.z-nextForcedZ)<32)nextForcedZ=obs.z+32;}
    spawnForcedItem(nextForcedZ);
    nextForcedZ+=(65+Math.random()*40)*(profile.forcedSpacingMul||1);
  }
  }
  for(let i=forcedItems_.length-1;i>=0;i--){
    const fi=forcedItems_[i];
    if(!fi.hit){
      fi.left.userData.ring.rotation.z+=.06;
      fi.right.userData.ring.rotation.z-=.06;
      fi.left.position.y=Math.sin(t*3+i)*.06;
      fi.right.position.y=Math.sin(t*3+i+Math.PI)*.06;
      const dz=Math.abs(cz-fi.z);
      if(dz<1.4){
        fi.hit=true;
        const dL=Math.abs(cx-fi.lx),dR=Math.abs(cx-fi.rx);
        const chosen=dL<dR?fi.leftType:fi.rightType;
        applyGate(chosen,cz);
        burst(cx,1,cz,chosen.good?0x00FFAA:0xFF3030,18);
        scene.remove(fi.left);scene.remove(fi.right);
        forcedItems_.splice(i,1);continue;
      }
    }
    if(fi.z<cz-28){scene.remove(fi.left);scene.remove(fi.right);forcedItems_.splice(i,1);}
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ORBS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
// Shared orb geometry + material (created once, reused for every spawn)
const _orbGeo = new THREE.SphereGeometry(.20,9,7);
const _orbMat = new THREE.MeshLambertMaterial({color:0xFFD740,emissive:0xFF8F00,emissiveIntensity:.6});

function spawnOrbs(z){
  const n=3+Math.floor(Math.random()*5);
  for(let i=0;i<n;i++){
    const m=new THREE.Mesh(_orbGeo,_orbMat); // reuse shared geometry + material
    m.position.set((Math.random()-.5)*(C.laneW-1.6),.90,z+i*3.5);
    // No castShadow on mobile (shadows disabled globally)
    if(!IS_MOBILE) m.castShadow=true;
    scene.add(m);
    orbs_.push({m,done:false});
  }
}
function updateOrbs(cx,cz,t){
  for(let i=orbs_.length-1;i>=0;i--){
    const o=orbs_[i];
    if(o.done){scene.remove(o.m);orbs_.splice(i,1);continue;}
    o.m.position.y=.90+Math.sin(t*4+i*1.4)*.16;
    o.m.rotation.y+=.08;
    const dx=o.m.position.x-cx,dz=o.m.position.z-cz;
    const d=Math.sqrt(dx*dx+dz*dz);
    const pullRange=3.2;
    if(d<pullRange&&d>.05){
      const pull=.035;
      o.m.position.x-=dx*pull;
      o.m.position.z-=dz*pull;
    }
    if(d<crowdR()+.7){
      o.done=true;
      recordFreshEvent('orbs',1);
      const gain=(goldRushTimer>0?5:1)+orbPickupBonus();
      crowd=Math.min(9999,crowd+gain);
      floatTxt('+'+(gain),innerWidth*.5+(Math.random()-.5)*80,innerHeight*.54,'#FFD740',26,gain>1?'spin':'');
      burst(o.m.position.x,o.m.position.y,o.m.position.z,0xFFD740,gain>1?16:8);
      const n2=members.length;
      const golden=2.399963229;
      const scale=Math.sqrt(n2+gain)*.50;
      for(let g=0;g<gain;g++){
        const r=Math.sqrt((n2+g+.5)/(n2+gain))*scale;
        const theta=(n2+g)*golden;
        members.push({ox:r*Math.cos(theta),oz:r*Math.sin(theta)*.7,ph:((n2+g)*.618)*Math.PI*2});
      }
      Sensory.play('coin');
      updateHUD();
    }
    if(o.m.position.z<cz-24){scene.remove(o.m);orbs_.splice(i,1);}
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PARTICLES â€” pooled (no alloc per burst)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
// Pre-allocate a pool of Points objects. burst() checks one out;
// updateParticles() checks it back in when life <= 0.
const _POOL_MAX = window.PerfMode ? PerfMode.particlePool() : 24;   // max concurrent particle bursts
const _PART_N   = window.PerfMode ? PerfMode.particleCount() : 24;   // max particles per burst
const _partPool = (function(){
  const pool=[];
  for(let k=0;k<_POOL_MAX;k++){
    const pos=new Float32Array(_PART_N*3);
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    geo.attributes.position.setUsage(THREE.DynamicDrawUsage);
    const mat=new THREE.PointsMaterial({color:0xffffff,size:.30,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
    const pts=new THREE.Points(geo,mat);
    pts.frustumCulled=false;
    pool.push({pts,pos,vel:new Float32Array(_PART_N*3),life:0,active:false});
  }
  return pool;
})();

function burst(x,y,z,col,n=20){
  n=Math.min(n,_PART_N);
  // Find an idle slot in the pool
  let slot=null;
  for(let k=0;k<_POOL_MAX;k++){if(!_partPool[k].active){slot=_partPool[k];break;}}
  if(!slot) return; // pool exhausted; skip burst rather than allocate
  slot.active=true;
  slot.life=1;
  slot.pts.material.color.setHex(col);
  slot.pts.material.opacity=1;
  for(let i=0;i<n;i++){
    slot.pos[i*3  ]=x+(Math.random()-.5)*2.0;
    slot.pos[i*3+1]=y+Math.random()*1.6;
    slot.pos[i*3+2]=z+(Math.random()-.5)*2.0;
    slot.vel[i*3  ]=(Math.random()-.5)*6;
    slot.vel[i*3+1]=Math.random()*7+2;
    slot.vel[i*3+2]=(Math.random()-.5)*6;
  }
  // Hide unused slots
  for(let i=n;i<_PART_N;i++){slot.pos[i*3+1]=-9999;}
  slot.pts.geometry.attributes.position.needsUpdate=true;
  slot.pts.geometry.setDrawRange(0,n);
  scene.add(slot.pts);
  particles_.push(slot);
}
function updateParticles(dt){
  for(let i=particles_.length-1;i>=0;i--){
    const p=particles_[i];
    p.life-=dt*1.8;
    p.pts.material.opacity=Math.max(0,p.life);
    const n=p.pts.geometry.drawRange.count;
    for(let j=0;j<n;j++){
      p.pos[j*3  ]+=p.vel[j*3  ]*dt;
      p.pos[j*3+1]+=p.vel[j*3+1]*dt;
      p.pos[j*3+2]+=p.vel[j*3+2]*dt;
      p.vel[j*3+1]-=9.8*dt;
    }
    p.pts.geometry.attributes.position.needsUpdate=true;
    if(p.life<=0){
      scene.remove(p.pts);
      p.active=false;
      particles_.splice(i,1);
    }
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   OBSTACLES â€” wall with gap
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function makeObstacleTex(kind){
  const cv=document.createElement('canvas');cv.width=192;cv.height=192;const ctx=cv.getContext('2d');
  const danger=kind==='danger';
  const g=ctx.createLinearGradient(0,0,192,192);
  g.addColorStop(0,danger?'#2A0208':'#062718');g.addColorStop(.52,danger?'#11101B':'#0B1020');g.addColorStop(1,danger?'#430006':'#082B22');
  ctx.fillStyle=g;ctx.fillRect(0,0,192,192);
  ctx.strokeStyle=danger?'rgba(255,48,48,.34)':'rgba(0,255,136,.24)';ctx.lineWidth=3;
  for(let v=0;v<192;v+=24){ctx.beginPath();ctx.moveTo(v,0);ctx.lineTo(v,192);ctx.stroke();ctx.beginPath();ctx.moveTo(0,v);ctx.lineTo(192,v);ctx.stroke();}
  // hazard diagonal tape
  for(let x=-192;x<384;x+=34){ctx.fillStyle=danger?'rgba(255,215,64,.35)':'rgba(0,255,136,.22)';ctx.beginPath();ctx.moveTo(x,192);ctx.lineTo(x+22,192);ctx.lineTo(x+214,0);ctx.lineTo(x+192,0);ctx.closePath();ctx.fill();}
  for(let i=0;i<420;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*.08})`;ctx.fillRect(Math.random()*192,Math.random()*192,1,1);}
  const tex=new THREE.CanvasTexture(cv);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(2,2);return tex;
}

// Pre-baked obstacle textures (made once, reused every spawn)
const _obstTexSafe   = (function(){ return makeObstacleTex('safe');   })();
const _obstTexDanger = (function(){ return makeObstacleTex('danger'); })();

function spawnObstacle(z){
  const profile=runDifficultyProfile();
  const gapOptions=[-C.laneW*.28,0,C.laneW*.28];
  const gapX=gapOptions[Math.floor(Math.random()*3)];
  // Progressive difficulty: first obstacle levels teach the gap before hard walls appear.
  const hardChance=profile.level<=4?0:profile.level<=6?.08:.20;
  const isEasy=Math.random()>=hardChance;
  const gapW=isEasy?(profile.level<=4?6.2:5.5):(profile.level<=8?3.4:2.8);
  const wallTex=isEasy?_obstTexSafe:_obstTexDanger; // reuse cached texture
  const wt=currentWorldTheme();
  const safeCol=hexNum(wt.good),dangerCol=hexNum(wt.bad),accentCol=hexNum(wt.accent);
  const wallMat=new THREE.MeshStandardMaterial({color:isEasy?hexNum(wt.road):0x21050a,map:wallTex,roughness:.36,metalness:.45,emissive:isEasy?safeCol:dangerCol,emissiveIntensity:isEasy?.18:.48});
  const warnMat=new THREE.MeshStandardMaterial({color:isEasy?safeCol:dangerCol,roughness:.28,metalness:.25,emissive:isEasy?safeCol:dangerCol,emissiveIntensity:.45});
  const stripeMat=new THREE.MeshBasicMaterial({color:isEasy?accentCol:0xFFD740,transparent:true,opacity:.92});
  const laserMat=new THREE.MeshBasicMaterial({color:isEasy?safeCol:dangerCol,transparent:true,opacity:.75,blending:THREE.AdditiveBlending});
  // Track every geo/mat created so we can dispose on removal (prevents GPU leak)
  const _trackGeos=[],_trackMats=[wallMat,warnMat,stripeMat,laserMat];
  const grp=new THREE.Group();
  function mkObstMesh(geo,mat){ _trackGeos.push(geo); return new THREE.Mesh(geo,mat); }
  function mkWallBlock(x1,x2,side){
    const w=x2-x1; if(w<.1)return;
    const wall=mkObstMesh(new THREE.BoxGeometry(w,5.5,.55),wallMat);
    wall.position.set(x1+w/2,2.75,0);
    if(!IS_MOBILE){wall.castShadow=true;wall.receiveShadow=true;}
    grp.add(wall);
    // horizontal hazard bands
    for(let s=0;s<6;s++){
      const st=mkObstMesh(new THREE.BoxGeometry(Math.max(.15,w*.16),.75,.60),s%2===0?warnMat:stripeMat);
      st.position.set(x1+w/2-w*.40+s*w*.16,2.35+Math.sin(s)*.42,.035);st.rotation.z=(s%2?-.15:.15);grp.add(st);
    }
    // red/cyan laser lip at dangerous cut edge
    const lipX=side==='left'?x2:x1;
    const lip=mkObstMesh(new THREE.BoxGeometry(.12,5.75,.72),laserMat);
    lip.position.set(lipX,2.85,.05);grp.add(lip);
    const top=mkObstMesh(new THREE.BoxGeometry(w,.46,.70),warnMat);top.position.set(x1+w/2,5.62,0);grp.add(top);
    const glowTop=mkObstMesh(new THREE.BoxGeometry(w,.12,.76),laserMat);glowTop.position.set(x1+w/2,5.90,.04);grp.add(glowTop);
    // small teeth pointing to gap so danger is readable
    const toothGeo=new THREE.ConeGeometry(.16,.42,3); _trackGeos.push(toothGeo);
    for(let k=0;k<Math.max(1,Math.floor(w/.65));k++){
      const tooth=new THREE.Mesh(toothGeo,laserMat);tooth.rotation.z=side==='left'?-Math.PI/2:Math.PI/2;tooth.rotation.y=Math.PI/2;tooth.position.set(side==='left'?x2-.10:x1+.10,.65+k%5*.82,.12);grp.add(tooth);
    }
  }
  const wall1x1=-C.laneW/2, wall1x2=gapX-gapW/2;
  const wall2x1=gapX+gapW/2, wall2x2=C.laneW/2;
  mkWallBlock(wall1x1,wall1x2,'left');
  mkWallBlock(wall2x1,wall2x2,'right');
  const gfMat=new THREE.MeshBasicMaterial({color:0x00FF88,transparent:true,opacity:.72,blending:THREE.AdditiveBlending}); _trackMats.push(gfMat);
  const gapFloor=mkObstMesh(new THREE.BoxGeometry(gapW,.10,.72),gfMat);
  gapFloor.position.set(gapX,.075,0);grp.add(gapFloor);
  const srMat=new THREE.MeshBasicMaterial({color:0x00FF88,transparent:true,opacity:.58,blending:THREE.AdditiveBlending}); _trackMats.push(srMat);
  const safeRing=mkObstMesh(new THREE.TorusGeometry(gapW*.34,.035,6,40),srMat);
  safeRing.rotation.x=Math.PI/2;safeRing.position.set(gapX,.18,0);grp.add(safeRing);
  grp.position.set(0,0,z);
  scene.add(grp);
  obstacles_.push({grp,z,gapX,gapW,isEasy,wall1x1,wall1x2,wall2x1,wall2x2,hit:false,safeRing,_trackGeos,_trackMats});
}

function updateObstacles(cx,cz,t){
  const profile=runDifficultyProfile();
  if(profile.allowObstacles){
  while(nextObstZ<cz+90&&dist<C.bossDist-60){
    // Ensure obstacle doesn't spawn on top of a gate (min 30 gap each side)
    for(const g of gates_){if(Math.abs(g.z-nextObstZ)<30)nextObstZ=g.z+30;}
    spawnObstacle(nextObstZ);
    nextObstZ+=(C.obstMin+Math.random()*(C.obstMax-C.obstMin))*(profile.obstacleSpacingMul||1);
  }
  }
  // DODGE WARN: use cached DOM ref (no getElementById on every frame)
  const nextO=obstacles_.find(o=>!o.hit&&o.z>cz);
  const now=elapsed;
  if(nextO&&nextO.z-cz<12&&now-lastDodgeShow>.8){
    DramaFX.warnObstacle(nextO);
  } else if(!nextO||nextO.z-cz>=14){
    if(_dodgeWarnEl){_dodgeWarnEl.classList.remove('show','relief');_dodgeWarnEl.textContent='DODGE!';}
  }

  for(let i=obstacles_.length-1;i>=0;i--){
    const obs=obstacles_[i];
    if(!obs.hit){
      const dz=Math.abs(cz-obs.z);
      if(dz<1.3){
        obs.hit=true;lastDodgeShow=now;
        if(_dodgeWarnEl) _dodgeWarnEl.classList.remove('show');
        let killed=0; const dead=[];
        members.forEach((m,idx)=>{
          const wx=cx+m.ox;
          const leftEdge=-C.laneW/2, rightEdge=C.laneW/2;
          const hasLeftWall=obs.wall1x2>obs.wall1x1+.05;
          const hasRightWall=obs.wall2x1<obs.wall2x2-.05;
          // Kill only on real obstacle material.
          // If the obstacle touches one road edge, also cut the runners outside THAT edge.
          // The open side stays safe, so an empty side does not delete anyone.
          const hitsWall1=hasLeftWall&&wx>=obs.wall1x1&&wx<=obs.wall1x2;
          const hitsWall2=hasRightWall&&wx>=obs.wall2x1&&wx<=obs.wall2x2;
          const outsideBlockedLeft=hasLeftWall&&wx<leftEdge;
          const outsideBlockedRight=hasRightWall&&wx>rightEdge;
          if(hitsWall1||hitsWall2||outsideBlockedLeft||outsideBlockedRight)dead.push(idx);
        });
        dead.forEach(idx=>{const m=members[idx];if(m)burst(cx+m.ox,.5,cz+(m.oz||0),0xEF5350,10);});
        dead.sort((a,b)=>b-a);
        dead.forEach(idx=>members.splice(idx,1));
        killed=dead.length;
        if(killed>0){
          crowd=Math.max(0,crowd-killed);
          if(crowd<=0)explodeCrowdMembersAt(killed,cx,cz,0xEF5350,{all:true});
          floatTxt('-'+killed,innerWidth*.5,innerHeight*.54,'#FF5252',killed>=40?42:34,'boom');
          rewardFlash('red');uiFeedbackPulse('bad',460);
          DramaFX.damage(killed,cx,cz,{big:killed>=40||crowd<=0});
          if(crowd<=0){finishLethalCrowdHit(cx,cz,0xEF5350);doLose();return;}
          if(crowd<peak*.25)showDanger();
          updateHUD();
        } else {
          const hardDodge=(!obs.isEasy)||Math.abs(cx-obs.gapX)>obs.gapW*.24;
          if(hardDodge){
            DramaFX.nearMiss(true);
            burst(cx,1.5,cz,0x00E676,IS_MOBILE?10:18);
          }else{
            DramaFX.nearMiss(false);
            if(!IS_MOBILE)burst(cx,1.5,cz,0x00E676,12);
          }
          recordFreshEvent('dodges',1);
          const dodgeCoins=activeSkinTrait().dodgeCoins||0;
          if(dodgeCoins>0){ 
            addCoins(dodgeCoins,{source:_dodgeWarnEl||document.getElementById('hud')});
            floatTxt('DODGE +'+dodgeCoins,innerWidth*.5,innerHeight*.48,'#69F0AE',24,'streak');
          }
          rewardFlash('green');uiFeedbackPulse(hardDodge?'perfect':'good',hardDodge?520:380);
          combo++;streak++;updateComboUI();
        }
      }
    }
    if(obs.z<cz-38){
      scene.remove(obs.grp);
      // Dispose GPU resources to prevent memory leak over a long run
      if(obs._trackGeos) obs._trackGeos.forEach(g=>g.dispose());
      if(obs._trackMats) obs._trackMats.forEach(m=>m.dispose());
      obstacles_.splice(i,1);
    }
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   AI ARMY BOSS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function buildAIArmy(z){
  bossGroup=new THREE.Group();
  const shipMat=new THREE.MeshStandardMaterial({color:0x740009,roughness:.28,metalness:.78,emissive:0xFF0000,emissiveIntensity:.28});
  const darkMat=new THREE.MeshStandardMaterial({color:0x160008,roughness:.22,metalness:.9,emissive:0x330000,emissiveIntensity:.35});
  const glowMat=new THREE.MeshBasicMaterial({color:0xFF3030,transparent:true,opacity:.75});
  const hull=new THREE.Mesh(new THREE.BoxGeometry(14,.8,7),shipMat);
  hull.position.set(0,12,z+12);
  const nose=new THREE.Mesh(new THREE.ConeGeometry(3.6,5.2,4),shipMat);
  nose.rotation.x=Math.PI/2; nose.rotation.z=Math.PI/4; nose.position.set(0,12,z+7.4);
  const dome=new THREE.Mesh(new THREE.SphereGeometry(2.55,20,12),new THREE.MeshBasicMaterial({color:0xFF1100,transparent:true,opacity:.74}));
  dome.position.set(0,13,z+12);
  const belly=new THREE.Mesh(new THREE.BoxGeometry(12,.14,5.5),glowMat);
  belly.position.set(0,11.62,z+12);
  const wingL=new THREE.Mesh(new THREE.BoxGeometry(5,.35,4.6),darkMat);
  const wingR=wingL.clone();
  wingL.position.set(-7.4,11.85,z+12.4);wingR.position.set(7.4,11.85,z+12.4);
  wingL.rotation.z=.20;wingR.rotation.z=-.20;
  const engineGeo=new THREE.CylinderGeometry(.42,.60,1.2,12);
  const engineL=new THREE.Mesh(engineGeo,glowMat),engineR=new THREE.Mesh(engineGeo,glowMat);
  engineL.rotation.x=Math.PI/2;engineR.rotation.x=Math.PI/2;
  engineL.position.set(-3.4,11.7,z+15.8);engineR.position.set(3.4,11.7,z+15.8);
  const laser=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,10,8),new THREE.MeshBasicMaterial({color:0xFF1744,transparent:true,opacity:.35}));
  laser.rotation.x=Math.PI/2;laser.position.set(0,8.7,z+6.5);
  bossGroup.add(hull,nose,dome,belly,wingL,wingR,engineL,engineR,laser);
  scene.add(bossGroup);
  bossCore=dome;
}
function spawnWave(phase,baseZ,customCount){
  const counts=[0,20,32,48];
  const n=customCount!==undefined?customCount:counts[Math.min(phase,3)];
  bossAIBaseZ=baseZ;
  bossRobots=[];
  const golden=2.399963229;
  const scale=Math.sqrt(n)*.55;
  for(let i=0;i<n;i++){
    const r=Math.sqrt((i+.5)/n)*scale;
    const theta=i*golden;
    bossRobots.push({relX:r*Math.cos(theta),relZ:r*Math.sin(theta)*.7,x:0,z:baseZ,alive:true,ph:Math.random()*Math.PI*2});
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   V100 BOSS REFLEX MINI-GAME â€” swipe/tap prompts remove AI
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function setBossTapUI(active){
  const zone=document.getElementById('boss-tap-zone');
  if(!zone)return;
  const profile=runDifficultyProfile();
  zone.classList.toggle('active',!!active);
  document.body.classList.toggle('boss-mini-focus',!!active);
  zone.classList.remove('perfect','hit','miss','fail','win');
  zone.setAttribute('aria-hidden',active?'false':'true');
  if(!active){
    zone.classList.remove('cooldown');
    const fill=document.getElementById('boss-tap-fill');if(fill)fill.style.width='0%';
    const timeFill=document.getElementById('boss-mini-time-fill');if(timeFill)timeFill.style.width='0%';
    const prompt=document.getElementById('boss-mini-prompt');if(prompt){prompt.textContent='READY';prompt.className='';}
    const inst=document.getElementById('boss-mini-instruction');if(inst)inst.textContent='SWIPE OR TAP';
    const feedback=document.getElementById('boss-mini-feedback');if(feedback){feedback.textContent='';feedback.className='';}
    const combo=document.getElementById('boss-mini-combo');if(combo)combo.textContent='0';
    const damage=document.getElementById('boss-mini-damage');if(damage)damage.textContent='0';
    const misses=document.getElementById('boss-mini-misses');if(misses){misses.textContent='0/'+((profile.bossMiniMisses||C.bossMiniMaxMisses||4)+freshnessBossMissBonus());misses.className='';}
    const cap=document.getElementById('boss-tap-caption');if(cap)cap.textContent='FAST -2 | LATE -1 | ! MISS';
  }
}
function updateBossTapUI(){
  const fill=document.getElementById('boss-tap-fill');
  if(fill)fill.style.width=Math.round(clamp01(bossMiniPerfectStreak/4)*100)+'%';
  const combo=document.getElementById('boss-mini-combo');
  if(combo)combo.textContent=String(bossMiniCombo);
  const damage=document.getElementById('boss-mini-damage');
  if(damage)damage.textContent=String(bossMiniDamage);
  const misses=document.getElementById('boss-mini-misses');
  if(misses){
    const maxMiss=(runDifficultyProfile().bossMiniMisses||C.bossMiniMaxMisses||4)+freshnessBossMissBonus();
    misses.textContent=bossMiniMisses+'/'+maxMiss;
    misses.className=bossMiniMisses>=maxMiss-1?'danger':bossMiniMisses>0?'warn':'';
  }
  const cap=document.getElementById('boss-tap-caption');
  if(cap)cap.textContent=bossMiniPerfectStreak>=2?'x2 RHYTHM':'FAST -2 | LATE -1 | ! MISS';
}
function resetBossTapFight(){
  bossTapEnabled=false;bossMiniActive=false;bossMiniFinished=false;bossMiniStarted=0;bossMiniEndsAt=0;bossMiniNextAt=0;
  bossMiniPrompt=null;bossMiniPromptStarted=0;bossMiniCombo=0;bossMiniPerfectStreak=0;bossMiniMisses=0;bossMiniDamage=0;bossMiniPointer=null;bossMiniLastPromptType='';bossMiniFeedbackSeq++;
  setBossTapUI(false);
}
function setBossAttritionOutcome(playerWins,effectiveHumans,effectiveAI){
  const baseH=Math.max(0,Math.round(bossFightInitHumans||0));
  const baseAI=Math.max(0,Math.round(bossFightInitAI||0));
  const hPower=Math.max(0,Math.round(effectiveHumans==null?baseH:effectiveHumans));
  const aiPower=Math.max(0,Math.round(effectiveAI==null?baseAI:effectiveAI));
  if(playerWins){
    bossPlayerWins=true;
    let finalHumans=Math.max(1,Math.min(baseH,hPower-aiPower));
    if(bossClashDone&&bossFightStart>0)finalHumans=Math.min(finalHumans,Math.max(1,crowd||0));
    bossFightFinalHumans=finalHumans;
    bossFightFinalAI=0;
  }else{
    bossPlayerWins=false;
    bossFightFinalHumans=0;
    bossFightFinalAI=Math.max(1,Math.min(baseAI,aiPower-hPower));
  }
}
const BOSS_MINI_PROMPTS=[
  {type:'up',symbol:'↑',instruction:'SWIPE UP'},
  {type:'down',symbol:'↓',instruction:'SWIPE DOWN'},
  {type:'left',symbol:'←',instruction:'SWIPE LEFT'},
  {type:'right',symbol:'→',instruction:'SWIPE RIGHT'},
  {type:'tap',symbol:'TAP',instruction:'TAP NOW'}
];
function bossMiniNow(){return performance&&performance.now?performance.now():Date.now();}
function bossMiniPickPrompt(){
  let pool=BOSS_MINI_PROMPTS;
  const avoid=(bossMiniPrompt&&bossMiniPrompt.type)||bossMiniLastPromptType;
  if(avoid&&BOSS_MINI_PROMPTS.length>1)pool=BOSS_MINI_PROMPTS.filter(p=>p.type!==avoid);
  return pool[Math.floor(Math.random()*pool.length)];
}
function bossMiniSetFeedback(txt,cls){
  const zone=document.getElementById('boss-tap-zone');
  if(zone){
    zone.classList.remove('perfect','hit','miss','fail','win');
    if(cls)zone.classList.add(cls);
  }
  const feedback=document.getElementById('boss-mini-feedback');
  if(feedback){
    const seq=++bossMiniFeedbackSeq;
    feedback.className='';
    feedback.textContent=txt||'';
    if(txt){
      void feedback.offsetWidth;
      feedback.className=(cls||'')+' show';
      if(cls!=='win'&&cls!=='fail'){
        setTimeout(()=>{
          if(seq===bossMiniFeedbackSeq){
            feedback.classList.remove('show');
            feedback.textContent='';
          }
        },360);
      }
    }
  }
}
function bossMiniPop(x,y,text,cls){
  const p=document.createElement('div');
  p.className='boss-tap-pop '+(cls||'normal');
  p.textContent=text||'HIT';
  p.style.left=(x||innerWidth*.5)+'px';
  p.style.top=(y||innerHeight*.72)+'px';
  document.body.appendChild(p);
  setTimeout(()=>p.remove(),520);
}
function bossMiniApplyDamage(damage){
  const beforeAI=bossRobots.filter(r=>r.alive).length;
  const extra=(damage>=2?(activeSkinTrait().bossDamage||0):0);
  const applied=Math.min(beforeAI,Math.max(0,Math.round((damage||0)+extra)));
  if(applied<=0)return beforeAI;
  const afterAI=Math.max(0,beforeAI-applied);
  bossMiniDamage+=applied;
  bossFightFinalAI=Math.max(0,Math.round((bossFightFinalAI||0)-applied));
  removeFrontRobots(applied,beforeAI,afterAI);
  updateClashCounters(crowd,afterAI,0,applied);
  document.getElementById('boss-fill').style.width=(bossFightInitAI?afterAI/bossFightInitAI*100:0)+'%';
  if(afterAI<=0||bossFightFinalAI<=0){
    bossPlayerWins=true;
    bossFightFinalAI=0;
    bossFightFinalHumans=Math.max(1,crowd||bossFightFinalHumans||1);
  }
  return afterAI;
}
function bossMiniSpawnPrompt(){
  if(!bossMiniActive)return;
  const now=bossMiniNow();
  if(now>=bossMiniEndsAt){endBossMiniGame('timeout');return;}
  bossMiniPrompt=bossMiniPickPrompt();
  bossMiniLastPromptType=bossMiniPrompt.type;
  bossMiniPromptStarted=now;
  const prompt=document.getElementById('boss-mini-prompt');
  if(prompt){
    prompt.className='';
    void prompt.offsetWidth;
    prompt.className='prompt-'+bossMiniPrompt.type+' prompt-pop';
    prompt.textContent=bossMiniPrompt.symbol;
  }
  const inst=document.getElementById('boss-mini-instruction');
  if(inst)inst.textContent=bossMiniPrompt.instruction;
  updateBossTapUI();
}
function bossMiniResolvePrompt(result,x,y){
  if(!bossMiniActive||!bossMiniPrompt)return;
  const now=bossMiniNow();
  bossMiniPrompt=null;
  if(result==='perfect'){
    bossMiniCombo++;
    bossMiniPerfectStreak++;
    const afterAI=bossMiniApplyDamage(2);
    bossMiniSetFeedback('-2','perfect');
    bossMiniPop(x,y,'-2','perfect');
    Sensory.play('bossTap');Haptic.pulse('bossTap');
    shake((.32+Math.min(6,bossMiniPerfectStreak)*.035)*(IS_MOBILE?.85:1));
    rewardFlash(bossMiniPerfectStreak>=3?'green':'gold');
    uiFeedbackPulse('perfect',520);pulseBossBar('boss-perfect-hit');
    burst((Math.random()-.5)*4,1.25,(bossHumanBaseZ+bossAIBaseZ)/2+(Math.random()-.5)*2.1,0x00E676,IS_MOBILE?16:28);
    if(afterAI<=0){endBossMiniGame('win');return;}
    bossMiniNextAt=now+Math.max(75,(C.bossMiniGapMs||125)-Math.min(55,bossMiniCombo*6));
  }else if(result==='late'){
    bossMiniCombo++;
    bossMiniPerfectStreak=0;
    const afterAI=bossMiniApplyDamage(1);
    bossMiniSetFeedback('-1','hit');
    bossMiniPop(x,y,'-1','hit');
    Sensory.play('bossTap');Haptic.pulse('bossTap');
    shake(IS_MOBILE?.12:.18);
    uiFeedbackPulse('good',360);pulseBossBar('boss-late-hit');
    burst((Math.random()-.5)*4,1.25,(bossHumanBaseZ+bossAIBaseZ)/2+(Math.random()-.5)*2.1,0xFFD740,IS_MOBILE?10:16);
    if(afterAI<=0){endBossMiniGame('win');return;}
    bossMiniNextAt=now+(C.bossMiniGapMs||125);
  }else{
    bossMiniCombo=0;
    bossMiniPerfectStreak=0;
    bossMiniMisses++;
    const missText=result==='short'?'SWIPE':'!';
    bossMiniSetFeedback(missText,'miss');
    bossMiniPop(x,y,missText,'miss');
    Sensory.play('bad');Haptic.pulse('bad');
    shake(IS_MOBILE?.08:.12);
    uiFeedbackPulse('bad-soft',320);pulseBossBar('boss-miss-hit');
    bossMiniNextAt=now+(C.bossMiniMissGapMs||260);
    if(bossMiniMisses>=((runDifficultyProfile().bossMiniMisses||C.bossMiniMaxMisses||4)+freshnessBossMissBonus())){endBossMiniGame('fail');return;}
  }
  updateBossTapUI();
}
function handleBossMiniInput(input,x,y){
  if(!bossMiniActive||!bossTapEnabled||gState!=='BOSS'||!bossClashDone||!bossMiniPrompt)return;
  if(input==='short'){bossMiniResolvePrompt('short',x,y);return;}
  const correct=input===bossMiniPrompt.type;
  if(!correct){bossMiniResolvePrompt('wrong',x,y);return;}
  const reaction=bossMiniNow()-bossMiniPromptStarted;
  const profile=runDifficultyProfile();
  if(reaction<=((profile.bossMiniPerfectMs||C.bossMiniPerfectMs||340)+freshnessBossMsBonus()))bossMiniResolvePrompt('perfect',x,y);
  else if(reaction<=((profile.bossMiniLateMs||C.bossMiniLateMs||760)+freshnessBossMsBonus()))bossMiniResolvePrompt('late',x,y);
  else bossMiniResolvePrompt('miss',x,y);
}
function bossMiniInputFromVector(dx,dy){
  const absX=Math.abs(dx),absY=Math.abs(dy);
  if(Math.max(absX,absY)<(C.bossMiniSwipeMin||36))return'short';
  if(absX>absY)return dx>0?'right':'left';
  return dy>0?'down':'up';
}
function startBossMiniGame(){
  if(bossMiniActive||bossMiniFinished||!runDifficultyProfile().allowBossMini)return;
  bossMiniActive=true;bossMiniFinished=false;bossTapEnabled=true;bossMiniSeq++;
  bossMiniStarted=bossMiniNow();
  bossMiniEndsAt=bossMiniStarted+(C.bossMiniDurationMs||5000);
  bossMiniNextAt=bossMiniStarted;
  bossMiniPrompt=null;bossMiniPromptStarted=0;bossMiniCombo=0;bossMiniPerfectStreak=0;bossMiniMisses=0;bossMiniDamage=0;bossMiniPointer=null;bossMiniLastPromptType='';
  setBossTapUI(true);
  updateBossTapUI();
  bossMiniSetFeedback('', '');
  phaseFlash('COMBAT REFLEX!');
}
function endBossMiniGame(reason){
  if(!bossMiniActive&&bossMiniFinished)return;
  bossMiniActive=false;bossMiniFinished=true;bossTapEnabled=false;bossMiniPrompt=null;bossMiniPointer=null;
  if(reason==='win'){
    bossMiniSetFeedback('AI BROKEN!','win');
    phaseFlash('AI ARMY BROKEN!');
    rewardFlash('green');
    const elapsed=Math.max(.1,bossClash-bossFightStart);
    bossFightDuration=Math.min(bossFightDuration,elapsed+.55);
  }else if(reason==='fail'){
    bossMiniSetFeedback('BOOST FAILED','fail');
    phaseFlash('BOOST FAILED');
  }else{
    const msg=bossMiniDamage>0?'BOOST DAMAGE -'+bossMiniDamage+' AI':'NO BOOST DAMAGE';
    bossMiniSetFeedback(msg,bossMiniDamage>0?'win':'fail');
    phaseFlash(msg);
  }
  setTimeout(()=>{if(!bossMiniActive)setBossTapUI(false);},reason==='win'?620:reason==='fail'?820:980);
}
function updateBossMiniGame(){
  if(!bossMiniActive)return;
  const now=bossMiniNow();
  const total=C.bossMiniDurationMs||5000;
  const remain=clamp01((bossMiniEndsAt-now)/total);
  const timeFill=document.getElementById('boss-mini-time-fill');
  if(timeFill)timeFill.style.width=Math.round(remain*100)+'%';
  if(now>=bossMiniEndsAt){endBossMiniGame('timeout');return;}
  if(bossMiniPrompt&&now-bossMiniPromptStarted>(runDifficultyProfile().bossMiniLateMs||C.bossMiniLateMs||760)){
    bossMiniResolvePrompt('miss',innerWidth*.5,innerHeight*.56);
    return;
  }
  if(!bossMiniPrompt&&now>=bossMiniNextAt)bossMiniSpawnPrompt();
}
function initBossTapZone(){
  const zone=document.getElementById('boss-tap-zone');
  if(!zone||zone.dataset.ready==='1')return;
  zone.dataset.ready='1';
  const onBossMiniPointerDown=e=>{
    if(!bossMiniActive)return;
    bossMiniPointer={id:e.pointerId,x:e.clientX,y:e.clientY,t:bossMiniNow(),handled:false};
    if(bossMiniPrompt&&bossMiniPrompt.type==='tap'){
      bossMiniPointer.handled=true;
      handleBossMiniInput('tap',e.clientX,e.clientY);
    }
  };
  const onBossMiniPointerUp=e=>{
    if(!bossMiniActive||!bossMiniPointer||bossMiniPointer.id!==e.pointerId)return;
    const start=bossMiniPointer;
    bossMiniPointer=null;
    if(start.handled)return;
    handleBossMiniInput(bossMiniInputFromVector(e.clientX-start.x,e.clientY-start.y),e.clientX,e.clientY);
  };
  document.addEventListener('pointerdown',onBossMiniPointerDown,{passive:true,capture:true});
  document.addEventListener('pointerup',onBossMiniPointerUp,{passive:true,capture:true});
  document.addEventListener('pointercancel',()=>{bossMiniPointer=null;},{passive:true,capture:true});
  document.addEventListener('keydown',e=>{
    if(!bossMiniActive)return;
    const keyMap={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',' ':'tap',Space:'tap',Enter:'tap'};
    const input=keyMap[e.key]||keyMap[e.code];
    if(!input)return;
    e.preventDefault();
    handleBossMiniInput(input,innerWidth*.5,innerHeight*.58);
  });
}

function beginBoss(cz){
  const profile=runDifficultyProfile();
  if(feverActive)endFever('complete');
  resetBossTapFight();
  Sensory.play('bossStart');Haptic.pulse('bossStart');
  ensureRobotMeshes(); // lazy-init robot InstancedMeshes only when boss actually starts
  gState='BOSS';
  bossClash=0; bossClashDone=false;
  bossHumanBaseZ=cz;
  bossAIBaseZ=cz+28;
  humanChargeOff=0; aiChargeOff=0;

  // V19 final balance: fair early levels, harder later, no impossible wall.
  // Good decisions and a big crowd carry a close fight.
  const total=goodChoices+badChoices;
  const goodRatio=total>0?goodChoices/total:(profile.defaultGoodRatio||0.5);
  const badRatio =total>0?badChoices/total:(1-goodRatio);
  const diffMult=Math.exp((badRatio-goodRatio)*0.72);
  const bossLevel=profile.level||currentRunLevel;
  const levelPressure=clamp((bossLevel-1)/18,0,.55);
  const requiredGood=profile.requiredGood;
  const targetHumans=profile.targetHumans;
  const goodEnough = crowd>=1000 ? goodRatio>=0.50 : goodRatio>=requiredGood;
  const bigEnough  = crowd>=1000 || crowd>=targetHumans;
  const playerWins = (goodEnough && bigEnough) || (crowd>=targetHumans*1.35 && goodRatio>=Math.max(.50,requiredGood-.12));
  bossPlayerWins=playerWins;
  bossFightStart=0;bossFightDuration=3.5;bossFightStartWorld=0;
  bossFightInitHumans=0;bossFightInitAI=0;bossFightFinalHumans=0;bossFightFinalAI=0;
  bossVisualHumanStart=0;bossVisualAIStart=0;
  bossFightFXT=0;bossFightLastProgress=-1;bossSparkLast=0;

  const winMult=clamp((profile.bossWinMult||.36)+levelPressure*.04,.24,.56);
  const loseMult=clamp((profile.bossLoseMult||1.18)+levelPressure*.08,.95,1.95);
  const finalMult = playerWins ? Math.min(diffMult, winMult) : Math.max(diffMult, loseMult);
  const minAI=profile.bossMinAI||bossMinAICurve(profile.playerLevel||currentRunLevel||1);
  const aiCount=Math.max(minAI, Math.round(crowd*finalMult)+Math.max(0,Math.round(riskDebtThisRun||0))+Math.max(0,Math.round((activeWorldTrait().bossDebt)||0)));
  const pct=Math.round(goodRatio*100);
  document.getElementById('boss-title').textContent=`${pct}% GOOD`;

  buildAIArmy(cz);
  spawnWave(1,bossAIBaseZ,aiCount);
  rebuildBossHumanFormation();

  gates_.forEach(g=>scene.remove(g.lp.m,g.lp.top,g.lp.post,g.lp.ring,g.lp.aura,g.rp.m,g.rp.top,g.rp.post,g.rp.ring,g.rp.aura));gates_=[];
  orbs_.forEach(o=>scene.remove(o.m));orbs_=[];
  obstacles_.forEach(o=>scene.remove(o.grp));obstacles_=[];
  forcedItems_.forEach(fi=>{scene.remove(fi.left);scene.remove(fi.right);});forcedItems_=[];

  document.getElementById('boss-hud').style.display='block';
  document.getElementById('boss-fill').style.width='100%';
  updateClashCounters(crowd,aiCount,0,0);
  document.getElementById('dodge-warn').classList.remove('show');
  document.getElementById('consequence-bar').classList.remove('show');

  const threshold = Math.round(requiredGood*100)+'%';
  const condTxt = playerWins ? `FINAL CLASH!` : (!goodEnough&&!bigEnough)?`NEED ${threshold} GOOD & ${targetHumans}+`:`${!goodEnough?`NEED ${threshold} GOOD`:'NEED '+targetHumans+'+ HUMANS'}`;
  phaseFlash(condTxt);
  DramaFX.bossIntro(condTxt,cz);
}

function bossVisibleHumansFor(humans){
  humans=Math.max(0,Math.round(humans));
  if(humans<=0)return 0;
  if(!bossClashDone||bossFightInitHumans<=0)return Math.min(humans,C.maxInst);
  const start=bossVisualHumanStart||Math.min(bossFightInitHumans,C.maxInst);
  const ratio=clamp01(humans/Math.max(1,bossFightInitHumans));
  return Math.max(1,Math.min(C.maxInst,Math.round(start*ratio)));
}
function bossVisibleAIFor(ai){
  ai=Math.max(0,Math.round(ai));
  if(ai<=0)return 0;
  if(!bossClashDone||bossFightInitAI<=0)return Math.min(ai,200);
  const start=bossVisualAIStart||Math.min(bossFightInitAI,200);
  const ratio=clamp01(ai/Math.max(1,bossFightInitAI));
  return Math.max(1,Math.min(200,Math.round(start*ratio)));
}

function rebuildBossHumanFormation(){
  // Use the visible boss count, not only the raw crowd number.
  // Example: 1000 â†’ 900 humans still shows fewer fighters on-screen.
  const n=bossVisibleHumansFor(crowd);
  members=[];
  const golden=2.399963229;
  const scale=Math.sqrt(Math.max(1,n))*.55;
  for(let i=0;i<n;i++){
    const r=Math.sqrt((i+.5)/Math.max(1,n))*scale;
    const theta=i*golden;
    members.push({ox:r*Math.cos(theta),oz:r*Math.sin(theta)*.7,ph:i*0.618*Math.PI*2});
  }
}


function rebuildCelebrationFormation(){
  // Round dance formation: survivors spread into a party circle after victory.
  const n=Math.min(crowd,C.maxInst);
  const golden=2.399963229;
  const scale=Math.min(7.2,Math.sqrt(n)*.58);
  members=[];
  for(let i=0;i<n;i++){
    const ring=Math.sqrt((i+.5)/Math.max(1,n))*scale;
    const theta=i*golden;
    members.push({ox:ring*Math.cos(theta),oz:ring*Math.sin(theta)*.72,ph:(i*.618)*Math.PI*2});
  }
}

function phaseFlash(txt){
  const el=document.getElementById('phase-flash');
  el.textContent=txt;el.className='on';
  setTimeout(()=>el.className='',prefersReducedMotion()?1250:2400);
}

function clamp01(v){return Math.max(0,Math.min(1,v));}
function mix(a,b,p){return a+(b-a)*p;}
function easeOutCubic(v){v=clamp01(v);return 1-Math.pow(1-v,3);}
function easeInOutSine(v){v=clamp01(v);return -(Math.cos(Math.PI*v)-1)/2;}
function beginRunCameraIntro(){
  const cz=dist+5;
  runCamIntroActive=true;
  runCamIntroT=0;
  runCamIntroDur=IS_MOBILE ? .82 : 1.08;
  runCamIntroSX=cxVar*.08;
  runCamIntroSY=IS_MOBILE?13.2:15.2;
  runCamIntroSZ=cz-(IS_MOBILE?23:28);
  runCamIntroLX=cxVar*.04;
  runCamIntroLY=2.15;
  runCamIntroLZ=cz+24;
  camera.position.set(runCamIntroSX,runCamIntroSY,runCamIntroSZ);
  camera.lookAt(runCamIntroLX,runCamIntroLY,runCamIntroLZ);
}
function calcClashDuration(totalFighters){
  // 2s for tiny fights, smoothly grows to 7s for huge armies.
  const sizeScore=Math.log10(Math.max(2,totalFighters));
  return Math.max(2,Math.min(7,2+sizeScore*1.45));
}
function removeFrontHumans(amount,humanCZ,beforeHumans,afterHumans){
  if(amount<=0||members.length===0)return;
  // Convert real counter loss into visible fighter loss. This fixes huge armies where
  // the counter drops but the capped 3D crowd used to stay visually unchanged.
  const beforeV=bossVisibleHumansFor(beforeHumans===undefined?crowd+amount:beforeHumans);
  const afterV=bossVisibleHumansFor(afterHumans===undefined?crowd:afterHumans);
  const visualLoss=Math.max(0,Math.min(members.length,beforeV-afterV));
  const sparks=Math.max(1,visualLoss||Math.min(3,amount));

  const sorted=[...members.keys()].sort((a,b)=>members[b].oz-members[a].oz);
  sorted.slice(0,Math.min(sparks,members.length)).forEach(idx=>{
    const m=members[idx];
    burst(cxVar+m.ox,.9,humanCZ+m.oz,0x4FC3F7,7);
  });
  sorted.slice(0,visualLoss).sort((a,b)=>b-a).forEach(idx=>members.splice(idx,1));
  rebuildBossHumanFormation();
}
function removeFrontRobots(amount,beforeAI,afterAI){
  if(amount<=0)return;
  const alive=bossRobots.filter(r=>r.alive).sort((a,b)=>a.relZ-b.relZ);
  // Same visual-cap fix for AI: even if there are 500 robots, the 200 visible ones
  // now shrink according to the remaining AI percentage.
  const beforeV=bossVisibleAIFor(beforeAI===undefined?alive.length:beforeAI);
  const afterV=bossVisibleAIFor(afterAI===undefined?Math.max(0,alive.length-amount):afterAI);
  const visualLoss=Math.max(0,beforeV-afterV);
  const sparks=Math.max(1,visualLoss||Math.min(4,amount));
  alive.slice(0,Math.min(sparks,alive.length)).forEach(r=>burst(r.x,1,r.z,0xFF3030,8));
  alive.slice(0,Math.min(amount,alive.length)).forEach(r=>{r.alive=false;});
}
function forceBossAIRemaining(targetAI){
  targetAI=Math.max(0,Math.round(targetAI||0));
  const alive=bossRobots.filter(r=>r.alive).sort((a,b)=>a.relZ-b.relZ);
  const removeN=Math.max(0,alive.length-targetAI);
  if(!removeN)return;
  alive.slice(0,removeN).forEach((r,i)=>{
    if(i<(IS_MOBILE?6:12))burst(r.x,1,r.z,0xFF3030,8);
    r.alive=false;
  });
}
function screenFightSpark(intense){
  const now=performance&&performance.now?performance.now():Date.now();
  if(now-bossSparkLast<(intense?130:220))return;
  bossSparkLast=now;
  const el=document.createElement('div');
  el.className='fight-spark-burst '+(intense?'big':'');
  el.style.left=(46+Math.random()*8)+'vw';
  el.style.top=(42+Math.random()*10)+'vh';
  el.style.setProperty('--spark-rot',(Math.random()*50-25)+'deg');
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),intense?560:440);
}
function meleeSparks(humanCZ,aiCZ,intense){
  const mid=(humanCZ+aiCZ)/2;
  const n=intense?8:4;
  screenFightSpark(intense);
  for(let i=0;i<n;i++){
    const x=(Math.random()-.5)*Math.min(7.4,Math.max(2,crowdR()*1.45));
    const col=Math.random()>.55?0xFFD740:(Math.random()>.5?0xFF3030:0x00E5FF);
    burst(x,1.15+Math.random()*1.8,mid+(Math.random()-.5)*2.9,col,intense?13:8);
  }
  if(intense){ringBurst(0,mid);shake(.26);}else if(Math.random()>.62){shake(.12);}
}

function updateBoss(dt,t){
  bossClash+=dt;

  // Before contact, both armies charge toward each other.
  const chargeSpeed=10;
  const totalGap=14;
  const charged=Math.min(totalGap, bossClash*chargeSpeed);
  humanChargeOff=charged;
  aiChargeOff=-charged;

  let humanCZ=bossHumanBaseZ+humanChargeOff;
  let aiCZ=bossAIBaseZ+aiChargeOff;

  const aliveNow=bossRobots.filter(r=>r.alive);
  const hRadius=Math.max(0.7, Math.sqrt(Math.min(crowd,C.maxInst)*0.5)*0.52);
  const aRadius=Math.max(0.7, Math.sqrt(aliveNow.length*0.5)*0.52);
  const gap=aiCZ-humanCZ;
  const overlap=hRadius+aRadius-gap;

  if(!bossClashDone && overlap>0){
    bossClashDone=true;
    bossFightStart=bossClash;
    bossFightStartWorld=t;
    bossFightInitHumans=Math.max(0,crowd);
    bossFightInitAI=Math.max(0,aliveNow.length);
    bossVisualHumanStart=Math.min(bossFightInitHumans,C.maxInst);
    bossVisualAIStart=Math.min(bossFightInitAI,200);
    const profile=runDifficultyProfile();
    const miniMinDuration=profile.allowBossMini?(C.bossMiniDurationMs||5000)/1000+.35:0;
    bossFightDuration=Math.max(calcClashDuration(bossFightInitHumans+bossFightInitAI),miniMinDuration);

    setBossAttritionOutcome(bossPlayerWins,bossFightInitHumans,bossFightInitAI);
    bossFightFXT=0;bossSparkLast=0;
    bossFightLastProgress=-1;
    meleeSparks(humanCZ,aiCZ,true);
    phaseFlash(` SLOW-MO CLASH ${bossFightDuration.toFixed(1)}s`);
    if(profile.allowBossMini)startBossMiniGame();
    DramaFX.clashImpact(humanCZ,aiCZ,bossFightDuration);
  }

  if(bossClashDone){
    const fightElapsed=Math.max(0,bossClash-bossFightStart);
    const p=clamp01(fightElapsed/bossFightDuration);
    const eased=easeInOutSine(p);
    updateBossMiniGame();

    // Lock armies together and add breathing push/pull so the melee feels alive.
    const clashMid=(bossHumanBaseZ+14)+Math.sin(t*1.4)*.16;
    humanCZ=clashMid-2.15+Math.sin(t*2.2)*.13;
    aiCZ=clashMid+2.15-Math.sin(t*2.0)*.13;

    // Progressively apply casualties on BOTH sides instead of instant deletion.
    let humanLossTick=0, aiLossTick=0;
    const desiredHumans=Math.round(bossFightInitHumans+(bossFightFinalHumans-bossFightInitHumans)*eased);
    const currentHumans=crowd;
    if(!bossMiniActive && desiredHumans<currentHumans){
      const loss=Math.min(currentHumans-desiredHumans,Math.max(1,Math.ceil(bossFightInitHumans*.035)));
      humanLossTick=loss;
      const beforeHumans=currentHumans;
      crowd=Math.max(0,currentHumans-loss);
      removeFrontHumans(loss,humanCZ,beforeHumans,crowd);
      updateHUD();
    }

    const alive=bossRobots.filter(r=>r.alive);
    const desiredAI=Math.round(bossFightInitAI+(bossFightFinalAI-bossFightInitAI)*eased);
    if(!bossMiniActive && desiredAI<alive.length){
      const loss=Math.min(alive.length-desiredAI,Math.max(1,Math.ceil(bossFightInitAI*.045)));
      aiLossTick=loss;
      const beforeAI=alive.length;
      const afterAI=Math.max(0,alive.length-loss);
      removeFrontRobots(loss,beforeAI,afterAI);
    }

    const aiRemaining=bossRobots.filter(r=>r.alive).length;
    updateClashCounters(crowd,aiRemaining,humanLossTick,aiLossTick);
    DramaFX.clashTick(humanLossTick,aiLossTick,humanCZ,aiCZ,p);
    document.getElementById('boss-fill').style.width=(bossFightInitAI?aiRemaining/bossFightInitAI*100:0)+'%';
    const bossTime=Math.ceil(Math.max(0,bossFightDuration-fightElapsed));
    document.getElementById('boss-title').textContent=(bossMiniActive?'REFLEX ':'')+bossTime+'s | HUMANS '+crowd+' VS AI '+aiRemaining;

    if(t-bossFightFXT>.28){
      bossFightFXT=t;
      meleeSparks(humanCZ,aiCZ,p>.45);
      if(!bossMiniActive && Math.random()>.55) floatTxt(Math.random()>.5?'POW!':'CLASH!',innerWidth*(.42+Math.random()*.16),innerHeight*(.43+Math.random()*.10),'#FFD740',24,'boom');
    }

    if(p>=1){
      if(bossPlayerWins){
        // Guarantee the cinematic result matches the boss condition.
        crowd=Math.max(1,bossFightFinalHumans);
        rebuildBossHumanFormation();
        bossRobots.forEach(r=>r.alive=false);
        document.getElementById('boss-fill').style.width='0%';
        updateHUD();
        updateClashCounters(crowd,0,0,bossFightFinalAI===0?0:0);
        bossTapEnabled=false;setBossTapUI(false);
        floatTxt('VICTORY!',innerWidth*.5,innerHeight*.42,'#00FF88',62,'spin');
        rewardFlash('green');
        DramaFX.finalHit(true,humanCZ,aiCZ);
        setTimeout(()=>doWin(),900); gState='DONE'; return;
      }else{
        bossTapEnabled=false;setBossTapUI(false);
        forceBossAIRemaining(bossFightFinalAI);
        const finalAI=bossRobots.filter(r=>r.alive).length;
        crowd=0; members=[]; updateHUD();
        updateClashCounters(0,finalAI,0,0);
        rewardFlash('red');
        DramaFX.finalHit(false,humanCZ,aiCZ);
        setTimeout(()=>doLose(),900); gState='DONE'; return;
      }
    }
  }

  // Update robot absolute positions.
  for(const r of bossRobots){
    if(r.alive){ r.x=r.relX; r.z=bossAIBaseZ+r.relZ+aiChargeOff; }
  }
  if(bossClashDone){
    const fightElapsed=Math.max(0,bossClash-bossFightStart);
    const p=clamp01(fightElapsed/bossFightDuration);
    const squeeze=1.0+Math.sin(t*3.0)*.05;
    for(const r of bossRobots){
      if(r.alive){
        r.x=r.relX*squeeze;
        r.z=aiCZ+r.relZ*.38-Math.sin(t*2.6+r.ph)*.08;
      }
    }
  }

  const animT=bossClashDone ? bossFightStartWorld+(t-bossFightStartWorld)*.42 : t;
  drawCrowd(cxVar,humanCZ,animT,bossClashDone?'fight':'boss');
  drawRobots(animT,bossClashDone?'fight':'boss');

  if(bossCore){bossCore.rotation.y+=dt*(bossClashDone?1.05:2);bossCore.scale.setScalar(1+Math.sin(t*(bossClashDone?2.1:4))*.06);}
  if(bossGroup){
    bossGroup.position.y=Math.sin(t*(bossClashDone?.65:1.2))*.4;
    bossGroup.position.x=cxVar*.1+Math.sin(t*1.1)*.15;
  }

  const midZ=(humanCZ+aiCZ)/2;
  camera.position.x+=(cxVar*.05-camera.position.x)*3*dt;
  camera.position.z+=(midZ-18-camera.position.z)*(bossClashDone?1.05:1.5)*dt;
  camera.position.y+=((bossClashDone?14.5:18)-camera.position.y)*2*dt;
  camera.lookAt(0,1.35,midZ+(bossClashDone?1.4:4));
  updateCameraShake(dt);
}
function resolveClash(){}

function flashCounter(id){
  const el=document.getElementById(id);
  if(!el)return;
  el.classList.remove('hit');
  void el.offsetWidth;
  el.classList.add('hit');
}
function flashLoss(id,loss){
  const el=document.getElementById(id);
  if(!el)return;
  if(loss>0){
    el.textContent='-'+loss;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }else{
    el.textContent='';
    el.classList.remove('show');
  }
}
function updateClashCounters(humans,ai,hLoss=0,aiLoss=0){
  const wrap=document.getElementById('clash-counts');
  if(!wrap)return;
  wrap.style.display='flex';
  const hNum=document.getElementById('human-count-num');
  const aNum=document.getElementById('ai-count-num');
  if(hNum&&hNum.textContent!==String(Math.max(0,humans))){hNum.textContent=Math.max(0,humans);flashCounter('human-count-num');}
  if(aNum&&aNum.textContent!==String(Math.max(0,ai))){aNum.textContent=Math.max(0,ai);flashCounter('ai-count-num');}
  flashLoss('human-loss',hLoss);
  flashLoss('ai-loss',aiLoss);
}
function hideClashCounters(){
  const wrap=document.getElementById('clash-counts');
  if(wrap)wrap.style.display='none';
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HUD + EFFECTS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function updateHUD(){
  // â”€â”€ Crowd label: only repaint + animate when crowd actually changes â”€â”€
  // distRnd changes EVERY frame (dist ticks up continuously), so we must
  // NOT gate the crowd animation on it â€” that caused the trembling bug.
  const now=performance.now();
  if(crowd!==_lastHudCrowd){
    _lastHudCrowd=crowd;
    if(_hudCrowdEl){
      _hudCrowdEl.textContent=crowd+' HUMANS';
      // Pulse only on real crowd changes (gate hit, orb pick-up, etc.)
      _hudCrowdEl.classList.remove('pop');
      void _hudCrowdEl.offsetWidth; // restart CSS animation
      _hudCrowdEl.classList.add('pop');
    }
  }
  // â”€â”€ Progress bar + dist label: update every frame but NO animation â”€â”€
  if(now-_hudLastDistPaint<33)return;
  const distRnd=Math.round(dist);
  if(distRnd!==_lastHudDist){
    _hudLastDistPaint=now;
    _lastHudDist=distRnd;
    const pct=Math.min(100,(dist/C.bossDist)*100);
    if(_hudProgEl) _hudProgEl.style.width=pct+'%';
    if(_hudDistEl) _hudDistEl.textContent='LEVEL '+currentRunLevel+' - '+Math.round(pct)+'%';
  }
}
function updateComboUI(){
  const bar=document.getElementById('combo-bar');
  combo>0?bar.classList.add('show'):bar.classList.remove('show');
  for(let i=0;i<5;i++) document.getElementById('cd'+i).classList.toggle('lit',i<combo);
  const sh=document.getElementById('streak-hud');
  if(streak>=2){
    const rate=comboBonusRateFor(maxComboThisRun);
    sh.classList.add('show');
    document.getElementById('streak-lbl').textContent=rate>0?'COIN BONUS':'STREAK';
    document.getElementById('streak-val').textContent=rate>0?'BONUS':'x'+streak;
  }
  else sh.classList.remove('show');
}
function rewardFlash(type){
  if(!flashEl)return;
  const now=performance&&performance.now?performance.now():Date.now();
  const minGap=prefersReducedMotion()?520:(document.body.classList.contains('boss-mini-focus')?220:135);
  if(now-lastRewardFlashAt<minGap)return;
  if(prefersReducedMotion()&&type!=='red'&&type!=='green')return;
  if(document.body.classList.contains('boss-mini-focus')&&(type==='gold'||type==='blue'))return;
  lastRewardFlashAt=now;
  flashEl.className=''; void flashEl.offsetWidth; flashEl.className=type;
}
function uiFeedbackPulse(kind,duration){
  if(prefersReducedMotion()&&kind!=='bad')return;
  const cls='feedback-'+kind;
  document.body.classList.remove(cls);
  void document.body.offsetWidth;
  document.body.classList.add(cls);
  setTimeout(()=>document.body.classList.remove(cls),(duration||520)*motionScale());
}
function pulseBossBar(kind){
  const fill=document.getElementById('boss-fill');
  if(!fill)return;
  fill.classList.remove('boss-perfect-hit','boss-late-hit','boss-miss-hit');
  void fill.offsetWidth;
  fill.classList.add(kind);
  setTimeout(()=>fill.classList.remove(kind),560);
}
function floatTxt(txt,x,y,col,sz,anim){
  const label=String(txt==null?'':txt);
  const baseSize=Math.max(12,Number(sz)||36);
  const important=baseSize>=42||/VICTORY|DANGER|FEVER|COMEBACK|ARMY|LEVEL|NEW|BOSS|FAILED|LOST/i.test(label);
  const maxActive=document.body.classList.contains('boss-mini-focus')?2:(IS_MOBILE?3:5);
  const now=performance&&performance.now?performance.now():Date.now();
  if(!important&&activeFloatCount>=maxActive)return;
  if(!important&&now-lastFloatAt<(IS_MOBILE?160:95))return;
  lastFloatAt=now;
  const el=document.createElement('div');
  el.className='ft'+(anim&&!prefersReducedMotion()?' '+anim:'');
  const vw=Math.max(1,window.innerWidth||innerWidth||800);
  const vh=Math.max(1,window.innerHeight||innerHeight||600);
  const fitSize=Math.max(18,Math.min(baseSize,Math.floor((vw-28)/(Math.max(4,label.length)*.56))));
  const finalSize=IS_MOBILE?Math.max(16,Math.floor(fitSize*.55)):Math.max(20,Math.min(baseSize,fitSize+4));
  const safeX=clamp(Number(x)||vw*.5,14,vw-14);
  let minY=48,maxY=vh-58;
  if(IS_MOBILE){
    minY=76;
    maxY=gState==='MENU'?vh-172:(gState==='RUNNING'?vh-190:vh-86);
  }
  if(document.body.classList.contains('boss-mini-focus')){
    minY=Math.max(minY,72);
    maxY=Math.min(maxY,Math.floor(vh*.72));
  }
  const safeY=clamp(Number(y)||vh*.5,minY,Math.max(minY+8,maxY));
  const color=col||'#fff';
  el.textContent=label;
  el.style.cssText=`left:${safeX}px;top:${safeY}px;translate:-50% 0;color:${color};font-size:${finalSize}px;text-shadow:0 0 12px ${color};max-width:calc(100vw - 24px);overflow:hidden;text-overflow:ellipsis;text-align:center`;
  el.setAttribute('aria-hidden','true');
  // Use cached ref (or fallback query if called before init)
  const host=_hudFloatsEl||document.getElementById('floats');
  if(!host)return;
  activeFloatCount++;
  host.appendChild(el);
  setTimeout(()=>{activeFloatCount=Math.max(0,activeFloatCount-1);el.remove();},prefersReducedMotion()?900:1500);
}
function resetNearMissState(){
  inDangerZone=false;dangerPeak=0;dangerPulseTimer=0;comebackCoinsThisRun=0;
  const lbl=_hudCrowdEl||document.getElementById('crowd-lbl');
  if(lbl)lbl.classList.remove('critical');
  if(_dangerEdgeEl)_dangerEdgeEl.classList.remove('warn');
}
function enterDangerZone(){
  if(inDangerZone||gState!=='RUNNING')return;
  if((peak||0)<25)return; // avoid noisy warnings in the first seconds of tiny runs
  inDangerZone=true;
  dangerPeak=Math.max(peak||0,crowd||0);
  dangerPulseTimer=0;
  const lbl=_hudCrowdEl||document.getElementById('crowd-lbl');
  if(lbl)lbl.classList.add('critical');
  showDanger({lite:true});
  if(window.DramaFX){DramaFX.flash('damage',360);DramaFX.toast('CRITICAL - FIND A GATE!','#FF1744',IS_MOBILE?'medium':'big',innerHeight*.38,1100);}
  if(window.Sensory)Sensory.play('danger');
  if(window.Haptic)Haptic.pulse('danger');
}
function awardComeback(){
  if(!inDangerZone)return;
  inDangerZone=false;
  const lbl=_hudCrowdEl||document.getElementById('crowd-lbl');
  if(lbl)lbl.classList.remove('critical');
  if(_dangerEdgeEl)_dangerEdgeEl.classList.remove('warn');
  const bonus=C.dangerComebackCoins||50;
  comebackCoinsThisRun+=addCoins(bonus,{source:lbl||document.getElementById('hud')});
  floatTxt('COMEBACK! +'+bonus,innerWidth*.5,innerHeight*.36,'#69F0AE',58,'boom');
  if(window.DramaFX){DramaFX.flash('relief',360);DramaFX.ring(innerWidth*.5,innerHeight*.50,'green');DramaFX.toast('COMEBACK!','#69F0AE',IS_MOBILE?'medium':'big',innerHeight*.42,900);}
  rewardFlash('blue');
  shake(.58*DRAMA_POWER);
  streak+=2;
  updateComboUI();
  if(typeof burst==='function')burst(cxVar,2,dist+7,0x69F0AE,IS_MOBILE?18:32);
  if(typeof sparkleRain==='function')sparkleRain(cxVar,dist+7,true);
  if(window.Sensory)Sensory.play('comeback');
  if(window.Haptic)Haptic.pulse('comeback');
  updateHUD();
}
function updateNearMissSystem(dt){
  if(gState!=='RUNNING')return;
  const p=Math.max(peak||0,crowd||0);
  if(p<25)return;
  const enterAt=Math.max(1,Math.floor(p*(C.dangerEnterRatio||.20)));
  if(!inDangerZone && crowd<=enterAt)enterDangerZone();
  if(inDangerZone){
    dangerPulseTimer-=dt||0;
    if(dangerPulseTimer<=0){
      dangerPulseTimer=C.dangerPulseEvery||2.5;
      if(_dangerEdgeEl)_dangerEdgeEl.classList.add('warn');
      if(window.DramaFX)DramaFX.flash('warn',180);
      shake(.18*DRAMA_POWER);
    }
    const recoverAt=Math.max(2,Math.ceil((dangerPeak||p)*(C.dangerRecoverRatio||.40)));
    if(crowd>=recoverAt)awardComeback();
  }
}
function showDanger(opts){
  opts=opts||{};
  if(_dangerEdgeEl) _dangerEdgeEl.classList.add('warn');
  const now=performance.now();
  if(opts.lite||!showDanger._last||now-showDanger._last>900){
    showDanger._last=now;
    floatTxt('DANGER!',innerWidth*.5,innerHeight*.36,'#FF5252',46,'boom');
  }
  rewardFlash('red');
  if(!opts.keep)setTimeout(()=>{ if(!inDangerZone && _dangerEdgeEl) _dangerEdgeEl.classList.remove('warn'); },2200);
}
function showMilestone(txt,sub,col){
  const m=document.getElementById('milestone-banner');
  document.getElementById('m-txt').textContent=txt;
  document.getElementById('m-txt').style.color=col||'#FFD740';
  document.getElementById('m-sub').textContent=sub||'';
  m.classList.remove('show'); void m.offsetWidth; m.classList.add('show');
  setTimeout(()=>m.classList.remove('show'),2600);
}
function triggerRunSlowMo(duration,scale){
  gameTimeScale=Math.max(.08,Math.min(1,scale||C.milestoneSlowmoScale||.25));
  gameTimeScaleTimer=Math.max(gameTimeScaleTimer,duration||C.milestoneSlowmoDuration||.35);
}
function updateRunTimeScale(rawDt){
  if(gameTimeScaleTimer>0){
    gameTimeScaleTimer-=rawDt;
    if(gameTimeScaleTimer<=0){gameTimeScaleTimer=0;gameTimeScale=1;}
  }else if(gameTimeScale!==1){
    gameTimeScale=1;
  }
}
function setCrowdMilestonePop(){
  const lbl=document.getElementById('crowd-lbl');
  if(!lbl)return;
  lbl.classList.remove('milestone-pop');
  void lbl.offsetWidth;
  lbl.classList.add('milestone-pop');
  clearTimeout(lbl._milestonePopT);
  lbl._milestonePopT=setTimeout(()=>lbl.classList.remove('milestone-pop'),620);
}
function crowdSpectacle(title,sub,color,burstColor,opts){
  opts=opts||{};
  showMilestone(title,sub,color);
  triggerRunSlowMo(opts.slowDur||C.milestoneSlowmoDuration,opts.slowScale||C.milestoneSlowmoScale);
  rewardFlash(opts.flash||'gold');
  shake(opts.shake||.7);
  setCrowdMilestonePop();
  ringBurst(cxVar,dist+8,opts.ringCount||48);
  burst(cxVar,2.2,dist+7,burstColor||0xFFD740,opts.burstCount||(IS_MOBILE?32:56));
  const rains=opts.rainCount||1;
  for(let i=0;i<rains;i++)setTimeout(()=>sparkleRain(cxVar,dist+8,true),i*120);
  if(window.DramaFX){
    DramaFX.ring(innerWidth*.5,innerHeight*.48,opts.ringKind||'gold');
    DramaFX.toast(title,color||'#FFD740',opts.toastSize||'big',innerHeight*.36,opts.toastDur||1150);
  }
  if(window.Sensory)Sensory.play('milestone');
  if(window.Haptic)Haptic.pulse('milestone');
}
function activateArmyMode(){
  if(armyModeActive)return;
  armyModeActive=true;
  document.body.classList.add('army-mode');
  const lbl=document.getElementById('crowd-lbl');
  if(lbl)lbl.classList.add('army-mode');
}
function resetMilestoneSpectacle(){
  gameTimeScale=1;gameTimeScaleTimer=0;armyModeActive=false;
  document.body.classList.remove('army-mode','milestone-blue');
  const lbl=document.getElementById('crowd-lbl');
  if(lbl)lbl.classList.remove('army-mode','milestone-pop');
}
function triggerCrowdMilestone(def){
  if(!def)return;
  if(def.kind==='small'){
    showMilestone(def.title,def.sub,def.color);
    burst(cxVar,2,dist+6,def.burst||0x00FFAA,def.threshold>=50?30:22);
    setCrowdMilestonePop();
    rewardFlash('green');
    if(window.Sensory)Sensory.play('milestone');
    if(window.Haptic)Haptic.pulse('milestone');
    return;
  }
  const opts={ringCount:48,burstCount:IS_MOBILE?38:64,shake:.75,flash:'gold',ringKind:'gold'};
  if(def.kind==='blue')Object.assign(opts,{ringCount:56,burstCount:IS_MOBILE?42:72,shake:.9,flash:'blue',ringKind:'cyan',rainCount:2});
  if(def.kind==='violet')Object.assign(opts,{ringCount:62,burstCount:IS_MOBILE?46:78,shake:.92,flash:'blue',ringKind:'cyan',rainCount:3});
  if(def.kind==='army')Object.assign(opts,{ringCount:72,burstCount:IS_MOBILE?52:88,shake:1.05,flash:'gold',ringKind:'gold',rainCount:4,toastDur:1600});
  if(def.kind==='legend')Object.assign(opts,{ringCount:82,burstCount:IS_MOBILE?58:98,shake:1.12,flash:'gold',ringKind:'gold',rainCount:5,toastDur:1800});
  if(def.kind==='army'||def.threshold>=500)activateArmyMode();
  crowdSpectacle(def.title,def.sub,def.color,def.burst||0xFFD740,opts);
  if(def.threshold===200){
    document.body.classList.add('milestone-blue');
    setTimeout(()=>document.body.classList.remove('milestone-blue'),1050);
  }
  floatTxt(def.title,innerWidth*.5,innerHeight*(def.threshold>=500?.31:.33),def.color||'#FFD740',def.threshold>=500?86:76,'spin');
  if(def.kind==='army'||def.kind==='legend'){
    if(window.Sensory)Sensory.play('feverStart');
    if(window.Haptic)Haptic.pulse('feverStart');
  }
}
function milestones(){
  for(const def of CROWD_MILESTONE_DEFS){
    if(!runMilestoneHits[def.id]&&crowd>=def.threshold){
      runMilestoneHits[def.id]=true;
      triggerCrowdMilestone(def);
    }
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CAMERA SHAKE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function shake(amt){
  const scale=motionScale();
  if(scale<=.3&&amt<.75)return;
  shakeAmt=Math.max(shakeAmt,(amt||0)*scale);
  shakeDur=prefersReducedMotion()?.18:.42;
}
function updateCameraShake(dt){
  if(shakeDur>0){
    shakeDur-=dt;
    const dur=prefersReducedMotion()?.18:.42;
    const s=shakeAmt*(shakeDur/dur);
    camera.position.x+=(Math.random()-.5)*s;
    camera.position.y+=(Math.random()-.5)*s*.35;
    if(shakeDur<=0)shakeAmt=0;
  }
}

function canOfferResurrect(sourceState){
  if(resurrectUsedThisRun||runRewardGranted)return false;
  if(sourceState!=='RUNNING')return false;
  if(dist<45||dist>C.bossDist-25)return false;
  return true;
}
const RESURRECT_DECISION_SECONDS=5;
let resurrectDecisionRaf=0;
let resurrectDecisionUntil=0;
let resurrectDecisionSeconds=RESURRECT_DECISION_SECONDS;
function stopResurrectDecisionTimer(){
  if(resurrectDecisionRaf){
    cancelAnimationFrame(resurrectDecisionRaf);
    resurrectDecisionRaf=0;
  }
  resurrectDecisionUntil=0;
}
function startResurrectDecisionTimer(seconds){
  stopResurrectDecisionTimer();
  resurrectDecisionSeconds=Math.max(2,Number(seconds)||RESURRECT_DECISION_SECONDS);
  resurrectDecisionUntil=(performance&&performance.now?performance.now():Date.now())+resurrectDecisionSeconds*1000;
  const tick=()=>{
    if(gState!=='RESURRECT_OFFER'||!resurrectOfferState)return;
    const now=performance&&performance.now?performance.now():Date.now();
    const left=Math.max(0,resurrectDecisionUntil-now);
    const pct=left/(resurrectDecisionSeconds*1000);
    const count=document.getElementById('resurrect-countdown');
    const fill=document.getElementById('resurrect-count-fill');
    if(count)count.textContent=String(Math.max(1,Math.ceil(left/1000)));
    if(fill)fill.style.transform='scaleX('+Math.max(0,Math.min(1,pct))+')';
    if(left<=0){
      stopResurrectDecisionTimer();
      declineResurrectOffer(true);
      return;
    }
    resurrectDecisionRaf=requestAnimationFrame(tick);
  };
  tick();
}
function setResurrectOfferVisible(show){
  const offer=document.getElementById('resurrect-offer');
  if(!offer)return;
  offer.classList.toggle('show',!!show);
  offer.setAttribute('aria-hidden',show?'false':'true');
}
function showResurrectOffer(){
  const offer=document.getElementById('resurrect-offer');
  if(!offer||!resurrectOfferState){finalizeLoss();return;}
  const pct=Math.max(0,Math.min(99,Math.round((resurrectOfferState.dist/C.bossDist)*100)));
  setText('resurrect-progress',pct+'%');
  setText('resurrect-peak',String(Math.max(0,Math.round(resurrectOfferState.peak||0))));
  setText('resurrect-sub','Watch an ad to revive 30 humans and keep this run alive.');
  const btn=document.getElementById('resurrect-watch-btn');
  if(btn){btn.textContent='WATCH AD';btn.classList.remove('loading');btn.disabled=false;}
  gState='RESURRECT_OFFER';
  setResurrectOfferVisible(true);
  startResurrectDecisionTimer(RESURRECT_DECISION_SECONDS);
  Sensory.play('reward');
  Haptic.pulse('reward');
}
function closeResurrectOffer(){
  stopResurrectDecisionTimer();
  setResurrectOfferVisible(false);
  const btn=document.getElementById('resurrect-watch-btn');
  if(btn){btn.textContent='WATCH AD';btn.classList.remove('loading');btn.disabled=false;}
}
function declineResurrectOffer(timedOut){
  closeResurrectOffer();
  resurrectOfferState=null;
  if(timedOut){
    floatTxt('LOSS TAKEN',innerWidth*.5,innerHeight*.42,'#FF6B6B',36,'');
  }
  finalizeLoss();
}
function claimResurrectWithAd(){
  if(!resurrectOfferState)return;
  stopResurrectDecisionTimer();
  const btn=document.getElementById('resurrect-watch-btn');
  if(btn){btn.textContent='LOADING';btn.classList.add('loading');btn.disabled=true;}
  setText('resurrect-sub','Rewarded ad loading. Your team is standing by.');
  showRewardedAd({
    context:'resurrect',
    onComplete:executeResurrect,
    onFail:(reason)=>{
      const b=document.getElementById('resurrect-watch-btn');
      if(b){b.textContent='TRY AGAIN';b.classList.remove('loading');b.disabled=false;}
      setText('resurrect-sub',reason==='frequency_limit'?'Ad limit reached. Take the loss for now.':'Ad not ready. Try again or take the loss.');
      startResurrectDecisionTimer(4);
      Sensory.play('bad');Haptic.pulse('bad');
    }
  });
}
function executeResurrect(){
  const st=resurrectOfferState;
  if(!st)return;
  resurrectUsedThisRun=true;
  resurrectOfferState=null;
  closeResurrectOffer();
  gState='RUNNING';
  setScreenMode('play');
  crowd=30;
  peak=Math.max(peak||0,crowd);
  combo=0;streak=0;feverNextCombo=C.feverCombo||5;
  inDangerZone=false;dangerPeak=0;dangerPulseTimer=0;
  clearInst();
  rebuildFormation();
  drawCrowd(cxVar,dist+5,elapsed,'run');
  document.getElementById('crowd-lbl').style.color='#fff';
  document.getElementById('danger-edge').classList.remove('warn');
  document.getElementById('dodge-warn').classList.remove('show');
  document.getElementById('consequence-bar').classList.remove('show');
  updateHUD();
  rewardFlash('green');
  shake(.55);
  ringBurst(cxVar,dist+5,34);
  floatTxt('REVIVED +30',innerWidth*.5,innerHeight*.42,'#69F0AE',48,'spin');
  Sensory.play('chest');Haptic.pulse('bossWin');
}
window.claimResurrectWithAd=claimResurrectWithAd;
window.declineResurrectOffer=declineResurrectOffer;

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   WIN / LOSE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function doWin(){
  if(gState==='CELEBRATE'||gState==='POST_DANCE_RUN'||gState==='WIN')return;
  if(feverActive)endFever('complete');
  const seq=++winSeq;
  Sensory.play('bossWin');Haptic.pulse('bossWin');
  gState='CELEBRATE';
  renderFreshnessHUD();
  winDanceStart=elapsed;
  celebrationBurstT=elapsed;
  celebrationCX=0;
  celebrationZ=(bossHumanBaseZ||dist+5)+7;
  document.getElementById('boss-hud').style.display='none';
  resetBossTapFight();
  resetNearMissState();
  hideClashCounters();
  document.getElementById('dodge-warn').classList.remove('show');
  document.getElementById('consequence-bar').classList.remove('show');
  if(bossGroup)scene.remove(bossGroup);
  bossGroup=null;bossCore=null;
  bossRobots.forEach(r=>r.alive=false);
  rebuildCelebrationFormation();
  phaseFlash('VICTORY DANCE!');
  floatTxt('DANCE PARTY!',innerWidth*.5,innerHeight*.36,'#FFD740',48,'spin');
  (IS_MOBILE?[0,360,760,1180,1660,2240]:[0,220,440,660,880,1120,1400,1700,2050,2400,2800]).forEach(d=>setTimeout(()=>{
    burst((Math.random()-.5)*13,Math.random()*5+1,celebrationZ+Math.random()*5-1,
      [0xFF1744,0xFFD740,0x00E676,0x00BFFF,0xEA80FC][Math.floor(Math.random()*5)],IS_MOBILE?16:24);
    shake(IS_MOBILE?.24:.45);
  },d));
  let reward=grantRunReward(true);
  const worldUnlock=checkWorldUnlockAfterWin(currentRunLevel,playerData.level);
  if(worldUnlock&&worldUnlock.bonus>0){reward+=worldUnlock.bonus;lastRunReward+=worldUnlock.bonus;}
  const walletBefore=Math.max(0,playerData.coins-reward);
  const stars=crowd>=250?'RANK SSS':crowd>=90?'RANK SS':crowd>=35?'RANK S':'RANK A';
  document.getElementById('win-title').textContent=dynamicWinTitle(crowd);
  document.getElementById('win-stars').textContent=stars;
  document.getElementById('win-coins').textContent='+'+reward+' COINS';
  updateResultWallet('win',walletBefore);
  updateResultRunStreak('win');
  updateResultComboBonus('win');
  updateResultMilestone('win');
  updateResultRunGoal('win');
  updateResultDailyChallenge('win');
  updateResultNextSkin('win');
  updateResultChest('win');
  updateResultSkinChest('win');
  updateResultWorld('win');
  updateWinResultActionForWorldUnlock(lastWorldUnlocked?worldUnlock.world:null);

  // After the dance, let the survivors continue forward while the camera stays locked in place.
  setTimeout(()=>{
    if(seq!==winSeq||gState!=='CELEBRATE')return;
    gState='POST_DANCE_RUN';
    postDanceStart=elapsed;
    postDanceZ=celebrationZ;
    phaseFlash('KEEP GOING!');
    floatTxt('ONWARD!',innerWidth*.5,innerHeight*.36,'#00E5FF',44,'streak');
    if(lastWorldUnlocked){setTimeout(()=>{phaseFlash('NEW WORLD!');floatTxt(lastWorldName.toUpperCase(),innerWidth*.5,innerHeight*.30,'#FFD740',42,'spin');rewardFlash('gold');shake(.55);},700);}
  },3600);

  // Show the win panel only after the player has seen the team run away.
  setTimeout(()=>{
    if(seq!==winSeq||gState!=='POST_DANCE_RUN')return;
    gState='WIN';
    captureTrialSkinResult();
    setScreenMode('result');
    document.getElementById('s-win').style.display='flex';
    document.getElementById('s-win').classList.add('active');
    document.getElementById('s-over').classList.remove('active');
    updateResultSkinChest('win',true);
    updateResultTrialSkin('win');
    playRewardLadder('win',reward);
    scheduleSkinRevealAfterResult('win');
    autoOpenBossChestAfterResult('win');
  },8000);
}
function doLose(){
  if(gState==='GAMEOVER'||gState==='RESURRECT_OFFER')return;
  const sourceState=gState;
  if(feverActive)endFever('broken');
  gState='GAMEOVER';
  renderFreshnessHUD();
  Sensory.play('bossLose');Haptic.pulse('bossLose');
  document.getElementById('boss-hud').style.display='none';
  resetBossTapFight();
  resetNearMissState();
  hideClashCounters();
  document.getElementById('dodge-warn').classList.remove('show');
  document.getElementById('consequence-bar').classList.remove('show');
  shake(1.0*DRAMA_POWER); rewardFlash('red'); DramaFX.flash('defeat',520);
  if(canOfferResurrect(sourceState)){
    resurrectOfferState={seq:++resurrectOfferSeq,dist,peak,crowd:Math.max(0,crowd||0),sourceState};
    setTimeout(()=>{
      if(resurrectOfferState&&resurrectOfferState.seq===resurrectOfferSeq&&gState==='GAMEOVER')showResurrectOffer();
    },800);
    return;
  }
  finalizeLoss();
}
function finalizeLoss(){
  gState='GAMEOVER';
  closeResurrectOffer();
  const reward=grantRunReward(false);
  const walletBefore=Math.max(0,playerData.coins-reward);
  const tip=buildFailTip();
  applyFailTipToResult(tip);
  updateLossCloseHook(tip);
  const msg=crowd<=0?'All humans lost.':tip.msg;
  document.getElementById('over-title').textContent=dynamicLoseTitle();
  document.getElementById('over-msg').innerHTML=msg+'<br>Your coins are saved.';
  document.getElementById('over-coins').textContent='+'+reward+' COINS';
  updateResultWallet('over',walletBefore);
  updateResultRunStreak('over');
  updateResultComboBonus('over');
  updateResultMilestone('over');
  updateResultRunGoal('over');
  updateResultDailyChallenge('over');
  updateResultNextSkin('over');
  updateResultChest('over');
  updateResultSkinChest('over');
  setTimeout(()=>{
    captureTrialSkinResult();
    setScreenMode('result');
    document.getElementById('s-over').style.display='flex';
    document.getElementById('s-over').classList.add('active');
    document.getElementById('s-win').classList.remove('active');
    updateResultSkinChest('over');
    updateResultTrialSkin('over');
    playRewardLadder('over',reward);
    scheduleSkinRevealAfterResult('over');
    autoOpenBossChestAfterResult('over');
  },1100);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   RUNNING UPDATE â€” special effect ticks
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function updateSpecialEffects(dt){
  // Freeze
  if(freezeTimer>0){
    freezeTimer-=dt;
    // tgtX clamped tighter during freeze
    tgtX*=.90;
    if(freezeTimer<=0){floatTxt('FREEZE!',innerWidth*.5,innerHeight*.55,'#80D8FF',36);}
  }
  // Regen
  if(regenTimer>0){
    regenTimer-=dt; regenAcc+=dt;
    if(regenAcc>=.5){
      regenAcc=0;
      crowd=Math.min(9999,crowd+1);
      const n2=members.length;
      const golden=2.399963229;
      const scale=Math.sqrt(n2+1)*.50;
      const r=Math.sqrt((n2+.5)/(n2+1))*scale;
      members.push({ox:r*Math.cos(n2*golden),oz:r*Math.sin(n2*golden)*.7,ph:(n2*.618)*Math.PI*2});
      floatTxt('+1',innerWidth*.5+(Math.random()-.5)*60,innerHeight*.58,'#B9F6CA',22);
      updateHUD();
    }
  }
  if(crowdJuiceT>0)crowdJuiceT=Math.max(0,crowdJuiceT-dt*1.7);
  if(gateSparkT>0)gateSparkT=Math.max(0,gateSparkT-dt*2.5);
  if(roadPulseT>0)roadPulseT=Math.max(0,roadPulseT-dt*1.65);
  if(roadPulsePower>0)roadPulsePower=Math.max(0,roadPulsePower-dt*1.15);
  if(secretCrowdWaveCooldown>0)secretCrowdWaveCooldown=Math.max(0,secretCrowdWaveCooldown-dt);
  if(secretCrowdWave){
    secretCrowdWave.t+=dt;
    if(secretCrowdWave.t>=secretCrowdWave.dur)secretCrowdWave=null;
  }
  // Gold rush timer
  if(goldRushTimer>0) goldRushTimer-=dt;
  // Invert
  if(invertTimer>0) invertTimer-=dt;
}

function triggerRoadPulse(good,power){
  roadPulseGood=!!good;
  roadPulseT=Math.max(roadPulseT,good ? .86 : 1.0);
  roadPulsePower=Math.max(roadPulsePower,power||1);
}
function updateRoadInteraction(dt,t,cz,preview){
  if(!laneTiles||!laneTiles.length)return;
  const w=currentWorldTheme();
  const speedP=clamp((currentRunSpeedMult-1)/Math.max(.01,C.speedRampMax||.55),0,1);
  const feverP=feverActive?1:0;
  const pulse=clamp01(roadPulseT);
  const pulseCol=hexNum(feverP?'#FFD740':(roadPulseGood?(w.good||w.edge):(w.bad||'#FF3030')));
  const calmCol=hexNum(w.edge||w.good||'#00E5FF');
  const activeColor=pulse>0.03||feverP?pulseCol:calmCol;
  const baseGlow=(preview ? .016 : .026)+speedP*.040+feverP*.095+gateSparkT*.034;
  const runnerX=clamp(cxVar*.34,-C.laneW*.22,C.laneW*.22);
  let reactMapUpdated=false;
  for(const tile of laneTiles){
    const rel=(tile.position.z||0)-cz;
    const near=clamp(1-Math.abs(rel)/(C.segLen*4.8),0,1);
    const flow=(Math.sin(t*6.2+rel*.34)*.5+.5)*near;
    const waveAt=(1-pulse)*C.segLen*3.2;
    const wave=pulse>0?Math.max(0,1-Math.abs(rel-waveAt)/(C.segLen*.88))*roadPulsePower:0;
    const intensity=Math.min(IS_MOBILE?.46:.68,baseGlow*near+flow*.035+wave*.34);
    for(const ch of tile.children){
      const role=(ch.userData&&ch.userData.role)||'';
      if(role==='roadReact'){
        ch.visible=intensity>.01;
        ch.position.x=runnerX;
        ch.scale.x=1+speedP*.10+wave*.22+feverP*.12;
        ch.scale.y=1+speedP*.20+wave*.32;
        if(ch.material){
          ch.material.color&&ch.material.color.set(activeColor);
          ch.material.opacity=intensity;
          if(ch.material.map&&!reactMapUpdated){
            const rs=(ch.material.map.userData&&ch.material.map.userData.scrollSpeed)||1;
            ch.material.map.offset.y=(ch.material.map.offset.y+dt*rs*(1+speedP*.85+feverP*.65))%1;
            reactMapUpdated=true;
          }
        }
      }else if(role==='edge'){
        ch.scale.y=1+near*(speedP*.35+feverP*.42)+wave*.78;
        if(ch.material){
          ch.material.color&&ch.material.color.set(activeColor);
          if(ch.material.opacity!==undefined)ch.material.opacity=Math.min(1,.66+speedP*.14+feverP*.15+wave*.20);
        }
      }else if(role==='dash'){
        ch.scale.y=1+speedP*.22+wave*.28;
        if(ch.material){
          ch.material.color&&ch.material.color.set(activeColor);
          if(ch.material.opacity!==undefined)ch.material.opacity=Math.min(.86,.36+speedP*.14+feverP*.16+wave*.22);
        }
      }else if(role==='road'&&ch.material){
        if(ch.material.emissive)ch.material.emissive.set(activeColor);
        if(ch.material.emissiveIntensity!==undefined)ch.material.emissiveIntensity=.020+speedP*.045+feverP*.075+wave*.075;
      }
    }
  }
}

function updateRunnerTrailFX(dt,t,cz){
  if(crowd<=0||!scene)return;
  runnerTrailT-=dt;
  const steer=clamp(Math.abs(cxVar-runnerTrailLastX)*10,0,1);
  runnerTrailLastX=cxVar;
  const speedP=clamp((currentRunSpeedMult-1)/Math.max(.01,C.speedRampMax||.55),0,1);
  const feverP=feverActive?1:0;
  const baseInterval=IS_MOBILE?(feverActive ? .14 : .20):(feverActive ? .09 : .13);
  if(runnerTrailT>0&&steer<.55)return;
  runnerTrailT=Math.max(.045,baseInterval-steer*.045-speedP*.028-feverP*.025);
  const w=currentWorldTheme();
  const col=feverActive?0xFFD740:(steer>.45?hexNum(w.good||w.edge):hexNum(w.dash||w.accent||'#00E5FF'));
  const spread=Math.min(1.35,Math.max(.36,crowdR()*.18));
  runnerTrailSide*=-1;
  const x=cxVar+runnerTrailSide*spread*(.45+Math.random()*.38)+(Math.random()-.5)*.24;
  const z=cz-1.1-Math.random()*1.7;
  const n=Math.floor(((IS_MOBILE?2:4)+Math.floor((speedP+feverP+steer)*(IS_MOBILE?2:4)))*(IS_MOBILE?.3:1));
  burst(x,.08,z,col,n);
  if(steer>.68&&!IS_MOBILE){
    burst(cxVar-runnerTrailSide*.55,.14,cz-2.2,hexNum(w.edge||w.good||'#00E5FF'),3);
  }
}

function runProgress01(){return C.bossDist>0?Math.max(0,Math.min(1,dist/C.bossDist)):0;}
function currentSpeedForRun(){
  const profile=runDifficultyProfile();
  const p=runProgress01();
  const rampMax=(C.speedRampMax||0)*(profile.rampScale==null?1:profile.rampScale);
  const ramp=1+Math.min(rampMax,rampMax*p);
  currentRunSpeedMult=ramp;
  currentRunSpeed=C.speed*(profile.speedMul||1)*ramp*freshnessSpeedMultiplier();
  return currentRunSpeed;
}
function gateSpacingFactorForRun(){
  const profile=runDifficultyProfile();
  const p=runProgress01();
  const compressMax=(C.gateCompressMax||0)*(profile.rampScale==null?1:profile.rampScale);
  return (1-Math.min(compressMax,compressMax*p))*(profile.gateSpacingMul||1)*freshnessGateSpacingMultiplier();
}
function maybeShowSpeedUpMoment(){
  if(speedUpShown)return;
  if((runDifficultyProfile().rampScale||0)<.25)return;
  if(runProgress01()<(C.speedRampAnnounceAt||.7))return;
  speedUpShown=true;
  triggerRoadPulse(true,.85);
  rewardFlash('blue');
  shake(.12,.12);
  floatTxt('SPEED UP!',innerWidth*.5,innerHeight*.40,'#00E5FF',46,'spin');
  if(window.Sensory)Sensory.play('combo',{combo:5});
  if(window.Haptic)Haptic.pulse('combo');
}

function resetFeverState(){
  feverActive=false;feverTimer=0;feverNextCombo=C.feverCombo||5;feverBonusCoinsThisRun=0;
  const overlay=document.getElementById('fever-overlay');
  const hud=document.getElementById('fever-hud');
  const fill=document.getElementById('fever-fill');
  const time=document.getElementById('fever-time');
  const crowdLbl=document.getElementById('crowd-lbl');
  if(overlay){overlay.classList.remove('show','broken');overlay.style.display='';}
  if(hud)hud.classList.remove('show');
  if(fill)fill.style.width='100%';
  if(time)time.textContent=(C.feverDuration||8).toFixed(1)+'s';
  if(crowdLbl)crowdLbl.classList.remove('fever');
}
function checkFeverTrigger(){
  if(feverActive||gState!=='RUNNING')return;
  const need=feverNextCombo||C.feverCombo||5;
  if(combo>=need)startFever();
}
function startFever(){
  feverActive=true;
  feverTimer=C.feverDuration||8;
  feverNextCombo=(combo||0)+(C.feverCombo||5);
  const overlay=document.getElementById('fever-overlay');
  const hud=document.getElementById('fever-hud');
  const crowdLbl=document.getElementById('crowd-lbl');
  if(overlay){overlay.classList.remove('broken');overlay.classList.add('show');}
  if(hud)hud.classList.add('show');
  if(crowdLbl)crowdLbl.classList.add('fever');
  triggerRoadPulse(true,1.35);
  rewardFlash('gold');shake(.62);ringBurst(cxVar,dist+8);sparkleRain(cxVar,dist+8,true);
  floatTxt('FEVER MODE!',innerWidth*.5,innerHeight*.34,'#FFD740',64,'spin');
  if(window.Sensory)Sensory.play('feverStart');
  if(window.Haptic)Haptic.pulse('feverStart');
}
function endFever(reason){
  if(!feverActive)return;
  feverActive=false;
  const overlay=document.getElementById('fever-overlay');
  const hud=document.getElementById('fever-hud');
  const crowdLbl=document.getElementById('crowd-lbl');
  if(crowdLbl)crowdLbl.classList.remove('fever');
  if(hud)hud.classList.remove('show');
  if(reason==='broken'){
    if(overlay){overlay.classList.remove('show');overlay.classList.add('broken');setTimeout(()=>overlay.classList.remove('broken'),430);}
    triggerRoadPulse(false,1.25);
    rewardFlash('red');shake(.55);
    floatTxt('FEVER BROKEN',innerWidth*.5,innerHeight*.38,'#FF5252',42,'boom');
    if(window.Sensory)Sensory.play('feverBreak');
    if(window.Haptic)Haptic.pulse('feverBreak');
  }else{
    if(overlay)overlay.classList.remove('show','broken');
    const bonus=C.feverCompleteCoins||50;
    feverBonusCoinsThisRun+=addCoins(bonus,{source:document.getElementById('fever-hud')});
    saveGame();refreshMetaUI();
    triggerRoadPulse(true,1.0);
    rewardFlash('gold');shake(.25);
    floatTxt('FEVER COMPLETE +'+bonus,innerWidth*.5,innerHeight*.39,'#FFD740',38,'streak');
    if(window.Sensory)Sensory.play('feverEnd');
    if(window.Haptic)Haptic.pulse('feverEnd');
    feverNextCombo=(combo||0)+(C.feverCombo||5);
  }
}
function updateFever(dt){
  if(!feverActive)return;
  feverTimer-=dt;
  const dur=C.feverDuration||8;
  const pct=Math.max(0,Math.min(100,(feverTimer/dur)*100));
  const fill=document.getElementById('fever-fill');
  const time=document.getElementById('fever-time');
  if(fill)fill.style.width=pct+'%';
  if(time)time.textContent=Math.max(0,feverTimer).toFixed(1)+'s';
  if(feverTimer<=0)endFever('complete');
}
function awardFeverGateReward(type){
  if(!feverActive||!type||!type.good)return;
  const bonus=type.t==='mult'?12:Math.max(3,Math.round((type.v||10)*.08));
  if(bonus<=0)return;
  feverBonusCoinsThisRun+=addCoins(bonus,{source:document.getElementById('fever-hud')});
  floatTxt('FEVER +'+bonus,innerWidth*.50,innerHeight*.49,'#FFD740',24,'streak');
}

function updateRunning(dt,t){
  const currentSpeed=currentSpeedForRun();
  dist+=currentSpeed*dt;
  maybeShowSpeedUpMoment();
  updateRunPacing(runProgress01());
  updateFever(dt);
  if(window.__activeRoadTex){
    const rs=(window.__activeRoadTex.userData&&window.__activeRoadTex.userData.scrollSpeed)||.42;
    const roadBoost=1+(currentRunSpeedMult-1)*.42+(feverActive ? .38 : 0)+roadPulseT*.16;
    window.__activeRoadTex.offset.y=(window.__activeRoadTex.offset.y+dt*rs*roadBoost)%1;
  }
  const inv=invertTimer>0?-1:1;
  cxVar+=(tgtX*inv-cxVar)*5.5*dt;
  const cz=dist+5;
  maybeTriggerComebackEvent(cz);

  drawCrowd(cxVar,cz,t);
  updateRunnerTrailFX(dt,t,cz);

  humanLight.position.x=cxVar; humanLight.position.z=cz-2;
  aiLight.position.z=cz+35; aiLight.intensity=1.5+Math.sin(t*3)*.8;

  const camTargetX=cxVar*.28, camTargetY=9, camTargetZ=cz-13;
  const lookTargetX=cxVar*.18, lookTargetY=1.5, lookTargetZ=cz+11;
  if(runCamIntroActive){
    runCamIntroT+=dt;
    const p=clamp01(runCamIntroT/runCamIntroDur);
    const e=easeOutCubic(p);
    const arc=Math.sin(Math.PI*p);
    camera.position.set(
      mix(runCamIntroSX,camTargetX,e)+arc*cxVar*.05,
      mix(runCamIntroSY,camTargetY,e)+arc*(IS_MOBILE ? .55 : .95),
      mix(runCamIntroSZ,camTargetZ,e)
    );
    camera.lookAt(
      mix(runCamIntroLX,lookTargetX,e),
      mix(runCamIntroLY,lookTargetY,e),
      mix(runCamIntroLZ,lookTargetZ,e)
    );
    if(p>=1)runCamIntroActive=false;
  }else{
    camera.position.x+=(camTargetX-camera.position.x)*5*dt;
    camera.position.z=camTargetZ; camera.position.y=camTargetY;
    camera.lookAt(lookTargetX,lookTargetY,lookTargetZ);
  }
  updateCameraShake(dt);

  // Rotate planets slowly + follow camera. Mars uses its own atmosphere, so the generic
  // space planets/star layers stay hidden to avoid the white-star sky bug.
  // On mobile: only recalculate every 4th frame (planet movement is imperceptible per-frame)
  const marsDustSky=isMarsDustSky(currentWorldTheme());
  if(!IS_MOBILE || _frameN%4===0){
    for(const p of planets_){
      p.visible=!marsDustSky;
      if(!marsDustSky){
        p.rotation.y+=.001*(IS_MOBILE?4:1); // compensate for skipped frames
        p.position.x=p.userData.relX;
        p.position.z=camera.position.z+p.userData.relZ;
      }
    }
  }
  // Stars: follow camera every 2 frames on mobile
  if(!IS_MOBILE || _frameN%2===0){
    if(skyStarsGroup){skyStarsGroup.visible=!marsDustSky;skyStarsGroup.position.z=camera.position.z;skyStarsGroup.rotation.y=Math.sin(t*.018)*.018;}
    if(skyBrightGroup){skyBrightGroup.visible=!marsDustSky;skyBrightGroup.position.z=camera.position.z;skyBrightGroup.rotation.y=Math.sin(t*.024)*.014;}
    if(skyBackdrop){skyBackdrop.visible=!marsDustSky;skyBackdrop.material.map.offset.x=0; skyBackdrop.material.map.offset.y=0; skyBackdrop.rotation.z=Math.sin(t*.012)*.003;}
    if(cameraStarBackdrop){cameraStarBackdrop.visible=!marsDustSky;if(!marsDustSky)cameraStarBackdrop.material.opacity=.96; cameraStarBackdrop.rotation.z=Math.sin(t*.02)*.002;}
  }

  // Recycle lane tiles
  for(const tile of laneTiles){
    if(tile.position.z<camera.position.z-C.segLen)
      tile.position.z+=C.segs*C.segLen;
  }

  const profile=runDifficultyProfile();
  if(profile.allowGates){
  while(nextGateZ<cz+72&&dist<C.bossDist-30){
    // Ensure gate doesn't overlap an obstacle (min 28 gap)
    for(const obs of obstacles_){if(Math.abs(obs.z-nextGateZ)<28)nextGateZ=obs.z+28;}
    spawnGate(nextGateZ);
    const gateGap=C.gateMin+Math.random()*(C.gateMax-C.gateMin);
    nextGateZ+=gateGap*gateSpacingFactorForRun();
  }
  }
  while(nextOrbZ<cz+72&&dist<C.bossDist-25){
    spawnOrbs(nextOrbZ);
    nextOrbZ+=13+Math.random()*11;
  }

  updateGates(cxVar,cz,t);
  updateOrbs(cxVar,cz,t);
  updateObstacles(cxVar,cz,t);
  updateForcedItems(cxVar,cz,t);
  updateRoadInteraction(dt,t,cz,false);
  updateSpecialEffects(dt);
  updateNearMissSystem(dt);
  updateHUD(); // internally throttled â€” only repaints when values change

  if(crowd<=0){doLose();return;}
  if(dist>=C.bossDist&&!bossActive){bossActive=true;beginBoss(cz);}
}

function updateCelebration(dt,t){
  const local=t-winDanceStart;
  const z=celebrationZ||dist+12;
  drawCrowd(celebrationCX,z,t,'dance');
  humanLight.position.x=Math.sin(local*2)*2;
  humanLight.position.z=z;
  humanLight.intensity=2.2+Math.sin(t*6)*.7;
  aiLight.position.z=z+16;
  aiLight.intensity=.8+Math.sin(t*9)*.25;
  const orbit=local*.72;
  const radius=16;
  camera.position.x+=(Math.sin(orbit)*radius-camera.position.x)*2.5*dt;
  camera.position.z+=(z-12+Math.cos(orbit)*5-camera.position.z)*2.5*dt;
  camera.position.y+=(8.5+Math.sin(local*2.2)*.7-camera.position.y)*2.8*dt;
  camera.lookAt(0,1.3,z+.8);
  updateCameraShake(dt);
  if(t-celebrationBurstT>.42){
    celebrationBurstT=t;
    burst((Math.random()-.5)*10,2+Math.random()*4,z+2+Math.random()*5,
      [0xFFD740,0x00E676,0x00BFFF,0xFF1744,0xEA80FC][Math.floor(Math.random()*5)],18);
  }
  updateHUD();
}

function updatePostDanceRun(dt,t){
  // The camera is intentionally NOT updated here: it stays where the dance ended.
  // Only the survivors move forward, so they run away from the fixed camera.
  postDanceZ+=C.speed*.75*dt;
  const local=t-postDanceStart;
  const sideWave=Math.sin(local*1.5)*.08;
  drawCrowd(celebrationCX+sideWave,postDanceZ,t,'run');

  humanLight.position.x=celebrationCX;
  humanLight.position.z=postDanceZ;
  humanLight.intensity=Math.max(.75,2.2-local*.22);
  aiLight.intensity=.25;

  if(t-celebrationBurstT>.62){
    celebrationBurstT=t;
    burst(celebrationCX+(Math.random()-.5)*8,2+Math.random()*3,postDanceZ+1+Math.random()*4,
      [0xFFD740,0x00E676,0x00BFFF][Math.floor(Math.random()*3)],12);
  }
  updateCameraShake(dt);
  updateHUD();
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   GAME LOOP
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function loop(now){
  requestAnimationFrame(loop);
  if(document.hidden){_lastFrameTs=now;return;}
  // FPS cap â€” on 90/120 Hz displays skip frames that arrive before 16.67 ms have passed.
  // This cuts battery drain and keeps the game logic running at a stable 60 Hz cadence.
  if(now - _lastFrameTs < _TARGET_FRAME_MS - 1) return;
  _lastFrameTs = now;
  _frameN = (_frameN + 1) & 0xFFFF; // wrapping frame counter for sub-sampling

  let dt=clock.getDelta();if(dt>.1)dt=.1;
  updateRunTimeScale(dt);
  const simDt=dt*gameTimeScale;
  elapsed+=simDt;
  if(gState==='RUNNING')updateRunning(simDt,elapsed);
  else if(gState==='BOSS')updateBoss(simDt,elapsed);
  else if(gState==='CELEBRATE')updateCelebration(simDt,elapsed);
  else if(gState==='POST_DANCE_RUN')updatePostDanceRun(simDt,elapsed);
  else if(gState==='MENU'&&window.MenuGameplayPreview&&(!(window.PerfMode&&PerfMode.lite)||_frameN%2===0))MenuGameplayPreview.update(simDt*((window.PerfMode&&PerfMode.lite)?2:1),elapsed);
  const perfLite=window.PerfMode&&PerfMode.lite;
  if(!perfLite || _frameN%2===0){
    updateWorldAtmosphere(simDt*(perfLite?2:1),elapsed);
    updateClimate(simDt*(perfLite?2:1),elapsed);
  }
  updateParticles(simDt);
  renderer.render(scene,camera);
}

function showScreenTouch(x,y,tone){
  const p=document.createElement('span');
  p.className='screen-touch-ripple '+(tone||'ui');
  p.style.left=Math.max(0,Math.min(innerWidth,Number(x)||innerWidth*.5))+'px';
  p.style.top=Math.max(0,Math.min(innerHeight,Number(y)||innerHeight*.5))+'px';
  document.body.appendChild(p);
  setTimeout(()=>p.remove(),520);
}
document.addEventListener('pointerdown',e=>{
  const tone=bossMiniActive?'boss':(gState==='RUNNING'||gState==='BOSS')?'run':'ui';
  showScreenTouch(e.clientX,e.clientY,tone);
},{capture:true,passive:true});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   INPUT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initInput(){
  const cv=renderer.domElement;
  cv.addEventListener('touchstart',e=>{if(gState!=='RUNNING'&&gState!=='BOSS')return;dragging=true;lastTX=e.touches[0].clientX;e.preventDefault();},{passive:false});
  cv.addEventListener('touchmove',e=>{
    if(!dragging||(gState!=='RUNNING'&&gState!=='BOSS'))return;
    const dx=e.touches[0].clientX-lastTX;lastTX=e.touches[0].clientX;
    const inv=invertTimer>0?-1:1;
    tgtX=Math.max(-C.laneW*.44,Math.min(C.laneW*.44,tgtX-dx*(C.inputDragSensitivity||.042)*inv));
    e.preventDefault();
  },{passive:false});
  cv.addEventListener('touchend',()=>dragging=false);
  cv.addEventListener('mousedown',e=>{if(gState!=='RUNNING'&&gState!=='BOSS')return;dragging=true;lastTX=e.clientX;});
  cv.addEventListener('mousemove',e=>{
    if(!dragging||(gState!=='RUNNING'&&gState!=='BOSS'))return;
    const dx=e.clientX-lastTX;lastTX=e.clientX;
    const inv=invertTimer>0?-1:1;
    tgtX=Math.max(-C.laneW*.44,Math.min(C.laneW*.44,tgtX-dx*(C.inputDragSensitivity||.042)*inv));
  });
  cv.addEventListener('mouseup',()=>dragging=false);
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   V55 LIVE GAMEPLAY MENU PREVIEW
   Preloads the first meters of the real run while the player is still in the menu.
   Performance rule: no collisions / no AI / no spawn loops while MENU, only real static objects + idle crowd.
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const MenuGameplayPreview={
  ready:false,
  preparing:false,
  level:0,
  lastBuilt:0,
  decorative:null,
  ensure(){
    if(this.preparing)return;
    if(!scene||!playerData||!renderer)return;
    const menu=document.getElementById('s-menu');
    if(!menu||menu.style.display==='none'||gState!=='MENU')return;
    const level=playerData.level||1;
    if(this.ready&&this.level===level)return;
    this.preparing=true;
    try{this.build(level);}catch(err){console.warn('MenuGameplayPreview build skipped',err);}
    this.preparing=false;
  },
  build(level){
    const now=performance&&performance.now?performance.now():Date.now();
    if(now-this.lastBuilt<350)return;
    this.lastBuilt=now;
    currentRunLevel=level||1;
    applyWorldTheme(selectedWorldDef(),false);
    resetState();
    // Fill the visible road with REAL gameplay items. These stay when PLAY starts.
    spawnOrbs(16);
    spawnOrbs(24);
    spawnOrbs(36);
    const profile=runDifficultyProfile(level);
    if(profile.allowGates)spawnGate(profile.firstGateZ||36);
    if(profile.allowObstacles)spawnObstacle(profile.firstObstacleZ||84);
    spawnOrbs(70);
    if(profile.allowGates)spawnGate(profile.previewSecondGateZ||88);
    if(profile.allowForcedItems)spawnForcedItem(profile.firstForcedZ||118);
    initRunSpawnSchedule();
    nextOrbZ=Math.max(nextOrbZ,92);
    if(profile.allowGates)nextGateZ=Math.max(nextGateZ,profile.previewNextGateZ||128);
    if(profile.allowObstacles)nextObstZ=Math.max(nextObstZ,profile.previewNextObstacleZ||108);
    if(profile.allowForcedItems)nextForcedZ=Math.max(nextForcedZ,profile.previewNextForcedZ||170);
    dist=0;cxVar=0;tgtX=0;speedUpShown=false;currentRunSpeed=C.speed;currentRunSpeedMult=1;resetFeverState();resetNearMissState();resetMilestoneSpectacle();
    camera.position.set(0,9,-12);
    camera.lookAt(0,1.5,16);
    drawCrowd(0,5,elapsed||0,'menu');
    this.ready=true;
    this.level=currentRunLevel;
    document.body.classList.add('menu-preview-ready');
  },
  activate(level){
    if(!this.ready||this.level!==(level||1))return false;
    // Keep the preloaded real items and simply turn the paused preview into the run.
    this.ready=false;
    document.body.classList.remove('menu-preview-ready');
    dist=0;cxVar=0;tgtX=0;speedUpShown=false;currentRunSpeed=C.speed;currentRunSpeedMult=1;resetFeverState();resetNearMissState();resetMilestoneSpectacle();
    crowd=Math.max(1,crowd||startingCrowdCount());
    peak=Math.max(peak||crowd,crowd);
    bossActive=false;bossPhase=0;bossHP=100;bossClash=0;
    lastDodgeShow=0;crowdJuiceT=0;gateSparkT=0;crowdJuiceGood=true;roadPulseT=0;roadPulsePower=0;roadPulseGood=true;runnerTrailT=0;runnerTrailSide=1;runnerTrailLastX=0;secretCrowdWave=null;secretCrowdWaveCooldown=0;
  const shieldEl=document.getElementById('shield-b');if(shieldEl)shieldEl.style.display='none';
    document.getElementById('boss-hud').style.display='none';
    hideClashCounters();
    document.getElementById('dodge-warn').classList.remove('show');
    document.getElementById('danger-edge').classList.remove('warn');
    document.getElementById('consequence-bar').classList.remove('show');
    document.getElementById('streak-hud').classList.remove('show');
    document.getElementById('combo-bar').classList.remove('show');
    updateHUD();
    return true;
  },
  update(dt,t){
    if(!this.ready){this.ensure();return;}
    const menu=document.getElementById('s-menu');
    if(!menu||menu.style.display==='none')return;
    const breathe=Math.sin(t*1.7)*.08;
    drawCrowd(Math.sin(t*.8)*.10,5+breathe,t,'menu');
    humanLight.position.x=Math.sin(t*.8)*.25;
    humanLight.position.z=4.5;
    humanLight.intensity=1.55+Math.sin(t*2.3)*.22;
    aiLight.position.z=45;
    aiLight.intensity=.9+Math.sin(t*2.1)*.18;
    if(window.__activeRoadTex){
      const rs=(window.__activeRoadTex.userData&&window.__activeRoadTex.userData.scrollSpeed)||.42;
      window.__activeRoadTex.offset.y=(window.__activeRoadTex.offset.y+dt*rs*.34)%1;
    }
    updateRoadInteraction(dt,t,5,true);
    for(const g of gates_){
      const pulse=1+Math.sin(t*3+g.z*.08)*.018;
      updateGatePanelDopamine(g.lp,g,0,0,t,pulse);
      updateGatePanelDopamine(g.rp,g,0,0,t,pulse);
    }
    for(let i=0;i<orbs_.length;i++){
      const o=orbs_[i]; if(!o||!o.m)continue;
      o.m.position.y=.90+Math.sin(t*3.2+i)*.12;
      o.m.rotation.y+=IS_MOBILE?.035:.055;
    }
    for(const obs of obstacles_){
      if(obs.safeRing)obs.safeRing.rotation.z+=IS_MOBILE?.018:.03;
    }
    for(const fi of forcedItems_){
      if(!fi)continue;
      if(fi.left&&fi.left.userData&&fi.left.userData.ring)fi.left.userData.ring.rotation.z+=.025;
      if(fi.right&&fi.right.userData&&fi.right.userData.ring)fi.right.userData.ring.rotation.z-=.025;
    }
    camera.position.x+=(0-camera.position.x)*2.2*dt;
    camera.position.y+=(9-camera.position.y)*2.2*dt;
    camera.position.z+=(-12-camera.position.z)*2.2*dt;
    camera.lookAt(0,1.45,18);
  },
  invalidate(){this.ready=false;document.body.classList.remove('menu-preview-ready');}
};
window.MenuGameplayPreview=MenuGameplayPreview;

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   GAME CONTROL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function startGame(){
  cancelAutoBossChestOpen();
  closePostGameReward();
  closeResurrectOffer();
  closeSkinReveal();
  skinRevealSeq++;
  resurrectOfferState=null;
  Sensory.unlock();Sensory.play('start');Haptic.pulse('start');
  hideWorldUnlockCinematic();
  clearRewardLadder('win');clearRewardLadder('over');
  gState='RUNNING';
  setScreenMode('play');
  document.getElementById('s-menu').style.display='none';
  document.getElementById('s-shop').style.display='none';
  document.getElementById('s-over').style.display='none';
  document.getElementById('s-win').style.display='none';
  document.getElementById('s-over').classList.remove('active');
  document.getElementById('s-win').classList.remove('active');
  if(!playerData)loadGame();
  currentRunLevel=playerData?playerData.level:1;
  trialSkinActive=!!trialSkinId;
  lastTrialSkinId='';
  lastTrialSkinName='';
  applyEquippedSkin();
  applyWorldTheme(selectedWorldDef(),true);
  runRewardGranted=false;lastRunReward=0;resurrectUsedThisRun=false;
  const usedPreview=window.MenuGameplayPreview&&MenuGameplayPreview.activate(currentRunLevel);
  if(!usedPreview)resetState();
  startFreshnessRun();
  beginRunCameraIntro();
  triggerRoadPulse(true,.80);
  updateHUD();
  floatTxt('START '+crowd,innerWidth*.5,innerHeight*.48,'#00E5FF',44,'spin');
  const profile=runDifficultyProfile(currentRunLevel);
  setTimeout(()=>{if(gState==='RUNNING')phaseFlash(profile.lesson);},320);
}
function restart(){startGame();}
function resetState(){
  const startCount=playerData?startingCrowdCount():C.initCrowd;
  runStartCrowd=startCount;
  crowd=startCount;peak=startCount;
  dist=0;cxVar=0;tgtX=0;speedUpShown=false;currentRunSpeed=C.speed;currentRunSpeedMult=1;resetFeverState();resetNearMissState();resetMilestoneSpectacle();
  shield=false;combo=0;streak=0;maxComboThisRun=0;lastComboBonusCoins=0;lastBaseRunReward=0;lastRunStreakBefore=0;lastRunStreakAfter=savedRunStreak();lastRunStreakBonusCoins=0;lastRunStreakMultiplier=1;lastRunStreakBroken=false;lastGoalReward=0;lastGoalCompleted=false;lastGoalTitle='';lastGoalProgressText='';lastMilestoneBonus=0;lastMilestoneTitle='';lastMilestoneCount=0;lastMilestoneBest=0;lastDailyChallengeCompleted=false;lastDailyChallengeReward=0;lastDailyChallengeTitle='';lastDailyChallengeProgressText='';lastFailReason='';lastFailFix='';lastWorldUnlocked=false;lastWorldName='';lastWorldUnlockBonus=0;lastWorldUnlockId='';goodChoices=0;badChoices=0;
  runMilestoneHits={};
  bossActive=false;bossPhase=0;bossHP=100;bossClash=0;
  bossHumanBaseZ=0;bossAIBaseZ=0;humanChargeOff=0;aiChargeOff=0;bossClashDone=false;
  runCamIntroActive=false;runCamIntroT=0;
  initRunSpawnSchedule();
  freezeTimer=0;regenTimer=0;regenAcc=0;goldRushTimer=0;invertTimer=0;
  winDanceStart=0;celebrationZ=0;celebrationCX=0;celebrationBurstT=0;postDanceStart=0;postDanceZ=0;winSeq++;
  lastDodgeShow=0;crowdJuiceT=0;gateSparkT=0;crowdJuiceGood=true;roadPulseT=0;roadPulsePower=0;roadPulseGood=true;runnerTrailT=0;runnerTrailSide=1;runnerTrailLastX=0;secretCrowdWave=null;secretCrowdWaveCooldown=0;
  gates_.forEach(g=>scene.remove(g.lp.m,g.lp.top,g.lp.post,g.lp.ring,g.lp.aura,g.rp.m,g.rp.top,g.rp.post,g.rp.ring,g.rp.aura));gates_=[];
  orbs_.forEach(o=>scene.remove(o.m));orbs_=[];
  particles_.forEach(p=>scene.remove(p.pts));particles_=[];
  // Climate persists but rebuild to re-anchor positions to camera
  if(climateSystem){const w=currentWorldTheme();if(w)buildClimate(w);}
  obstacles_.forEach(o=>scene.remove(o.grp));obstacles_=[];
  forcedItems_.forEach(fi=>{scene.remove(fi.left);scene.remove(fi.right);});forcedItems_=[];
  bossRobots=[];
  if(bossGroup){scene.remove(bossGroup);bossGroup=null;bossCore=null;}
  laneTiles.forEach((t,i)=>t.position.z=i*C.segLen-6);
  camera.position.set(0,9,-12);
  clearInst();rebuildFormation();
  const sh=document.getElementById('shield-b');if(sh)sh.style.display='none';
  document.getElementById('boss-hud').style.display='none';
  hideClashCounters();
  document.getElementById('dodge-warn').classList.remove('show');
  document.getElementById('danger-edge').classList.remove('warn');
  document.getElementById('consequence-bar').classList.remove('show');
  document.getElementById('streak-hud').classList.remove('show');
  document.getElementById('prog-fill').style.width='0%';
  document.getElementById('boss-fill').style.width='100%';
  document.getElementById('boss-title').textContent='AI ARMY INCOMING';
  document.getElementById('crowd-lbl').style.color='#fff';
  document.getElementById('combo-bar').classList.remove('show');
  for(let i=0;i<5;i++) document.getElementById('cd'+i).classList.remove('lit');
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DEV TEST BAR â€” safe local testing helpers
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const DevTools={
  open:false,
  lastMessage:'Ready',
  log(msg){
    this.lastMessage=msg||'Ready';
    const el=document.getElementById('dev-status');
    if(el)el.textContent=this.lastMessage;
    if(typeof floatTxt==='function')floatTxt(this.lastMessage,innerWidth*.5,innerHeight*.18,'#FFD740',26,'boom');
  },
  ensure(){
    if(!playerData)loadGame();
    return !!playerData;
  },
  save(){
    if(!this.ensure())return;
    saveGame();
    refreshMetaUI();
    this.refresh();
  },
  setOpen(v){
    this.open=!!v;
    const panel=document.getElementById('dev-tools');
    const pill=document.getElementById('dev-open-pill');
    document.body.classList.toggle('dev-tools-open',this.open);
    if(panel)panel.classList.toggle('open',this.open);
    if(pill)pill.classList.toggle('hide',this.open);
    this.refresh();
  },
  toggle(){this.setOpen(!this.open);},
  num(id,fallback){
    const el=document.getElementById(id);
    const v=el?Number(el.value):fallback;
    return Number.isFinite(v)?v:fallback;
  },
  setInput(id,value){
    const el=document.getElementById(id);
    if(!el||document.activeElement===el)return;
    el.value=value;
  },
  refresh(){
    const chip=document.getElementById('dev-state-chip');
    if(chip)chip.textContent=gState||'MENU';
    if(!playerData)return;
    this.setInput('dev-level-input',playerData.level||1);
    this.setInput('dev-coins-input',playerData.coins||0);
    this.setInput('dev-crowd-input',Math.max(1,Math.round(crowd||startingCrowdCount())));
    const world=worldDefByLevel(currentRunLevel || playerData.level || 1);
    const read=document.getElementById('dev-live-readout');
    if(read)read.textContent='LVL '+(playerData.level||1)+' - '+(playerData.coins||0)+' coins - '+(world?world.name:'theme');
},
  setLevel(level){
    if(!this.ensure())return;
    playerData.level=Math.max(1,Math.round(Number(level)||1));
    currentRunLevel=playerData.level;
    ensureNextRunGoal();
    saveGame();
    applyWorldTheme(selectedWorldDef(),true);
    refreshMetaUI();
    this.refresh();
    this.log('Level set to '+playerData.level);
  },
  setCoins(coins){
    if(!this.ensure())return;
    const before=Math.max(0,Math.round(playerData.coins||0));
    const trigger=CoinFX.freshClick(2000)||document.getElementById('dev-coins-input');
    playerData.coins=Math.max(0,Math.round(Number(coins)||0));
    const after=Math.max(0,Math.round(playerData.coins||0));
    saveGame();
    refreshMetaUI();
    if(after>before)CoinFX.gain(after-before,trigger);
    if(before>after)CoinFX.spend(before-after,trigger);
    this.refresh();
    this.log('Coins set to '+playerData.coins);
  },
  addCoins(amount){
    if(!this.ensure())return;
    addCoins(amount,CoinFX.freshClick(2000)||document.getElementById('dev-tools'));
    saveGame();
    refreshMetaUI();
    rewardFlash('gold');
    this.refresh();
    this.log('Added '+amount+' coins');
  },
  setCrowd(value){
    if(!this.ensure())return;
    const n=Math.max(1,Math.round(Number(value)||1));
    crowd=n;peak=Math.max(peak||0,n);
    if(gState==='BOSS'){
      rebuildBossHumanFormation();
    }else if(gState==='RUNNING'||gState==='CELEBRATE'||gState==='POST_DANCE_RUN'){
      rebuildFormation();
    }
    updateHUD();
    this.refresh();
    this.log('Crowd set to '+n);
  },
  unlockSkins(){
    if(!this.ensure())return;
    playerData.skins.owned=SKINS.map(s=>s.id);
    saveGame();
    refreshMetaUI();
    renderShop();
    rewardFlash('gold');
    this.refresh();
    this.log('All skins unlocked');
  },
  equipSkin(id){
    if(!this.ensure())return;
    unlockSkin(id);
    equipSkin(id);
    saveGame();
    applyEquippedSkin();
    refreshMetaUI();
    renderShop();
    this.refresh();
    this.log('Equipped '+skinById(id).name);
  },
  applyWorld(id,unlock){
    if(!this.ensure())return;
    const w=WORLD_DEFS.find(x=>x.id===id);
    if(!w)return;
    if(unlock){
      playerData.level=Math.max(playerData.level||1,w.level);
      currentRunLevel=playerData.level;
      saveGame();
      refreshMetaUI();
    }
    if(worldIsUnlocked(w,playerData.level)){
      const res=selectWorldTheme(w.id);
      this.refresh();
      this.log((unlock?'Unlocked ':'Selected ')+w.name);
      return res;
    }else{
      currentRunLevel=w.level;
    }
    applyWorldTheme(w,true);
    this.refresh();
    this.log('Theme: '+w.name);
  },
  showMenu(){
    gState='MENU';
    setScreenMode('menu');
    ['s-shop','s-over','s-win'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});
    const menu=document.getElementById('s-menu');
    if(menu)menu.style.display='flex';
    const boss=document.getElementById('boss-hud');if(boss)boss.style.display='none';
    hideClashCounters();
    refreshMetaUI();
    if(window.MenuGameplayPreview){
      MenuGameplayPreview.invalidate();
      requestAnimationFrame(()=>MenuGameplayPreview.ensure());
      setTimeout(()=>MenuGameplayPreview.ensure(),80);
    }
    this.refresh();
    this.log('Back to menu');
  },
  startRun(){
    startGame();
    this.refresh();
    this.log('Run started');
  },
  bossNow(){
    if(gState!=='RUNNING'&&gState!=='BOSS')startGame();
    this.setCrowd(this.num('dev-crowd-input',Math.max(150,crowd||150)));
    goodChoices=Math.max(goodChoices,5);
    badChoices=0;
    beginBoss(dist+26);
    this.refresh();
    this.log('Boss test started');
  },
  winNow(){
    if(gState!=='RUNNING'&&gState!=='BOSS')startGame();
    this.setCrowd(this.num('dev-crowd-input',Math.max(180,crowd||180)));
    goodChoices=Math.max(goodChoices,5);
    badChoices=0;
    if(!runStats)runStats={good:0,bad:0,orbs:0,dodges:0,risk:0,comeback:0};
    const dailyInfo=(typeof ensureDailyChallengeState==='function')?ensureDailyChallengeState():null;
    const dailyStat=dailyInfo&&dailyInfo.challenge?dailyInfo.challenge.stat:'';
    if(dailyStat==='good'||dailyStat==='cleanGood')runStats.good=Math.max(runStats.good||0,dailyInfo.challenge.targetValue||5);
    if(dailyStat==='orbs')runStats.orbs=Math.max(runStats.orbs||0,dailyInfo.challenge.targetValue||10);
    if(dailyStat==='dodges')runStats.dodges=Math.max(runStats.dodges||0,dailyInfo.challenge.targetValue||2);
    if(dailyStat==='risk')runStats.risk=Math.max(runStats.risk||0,dailyInfo.challenge.targetValue||1);
    if(dailyStat==='comeback')runStats.comeback=Math.max(runStats.comeback||0,dailyInfo.challenge.targetValue||1);
    if(dailyStat==='combo')maxComboThisRun=Math.max(maxComboThisRun,dailyInfo.challenge.targetValue||5);
    if(dailyStat==='crowd')peak=Math.max(peak||0,dailyInfo.challenge.targetValue||crowd||180);
    if(dailyStat==='distance')dist=Math.max(dist,(C&&C.bossDist?C.bossDist:520));
    if(gState!=='BOSS')beginBoss(dist+22);
    doWin();
    this.refresh();
    this.log('Win result test');
  },
  loseNow(){
    if(gState!=='RUNNING'&&gState!=='BOSS')startGame();
    crowd=Math.max(0,Math.min(crowd,3));
    peak=Math.max(peak||0,crowd);
    doLose();
    this.refresh();
    this.log('Lose result test');
  },
  resetSave(){
    if(!confirm('Reset all local test progress?'))return;
    resetMetaProgress();
    currentRunLevel=playerData.level;
    applyWorldTheme(selectedWorldDef(),true);
    this.refresh();
    this.log('Save reset');
  },
  renderWorldButtons(){
    const wrap=document.getElementById('dev-world-buttons');
    if(!wrap||!Array.isArray(WORLD_DEFS))return;
    wrap.innerHTML='';
    WORLD_DEFS.forEach(w=>{
      const btn=document.createElement('button');
      btn.className='dev-tools-btn dark';
      btn.textContent=w.name.toUpperCase()+' - LVL '+w.level;
      btn.style.borderColor=w.color+'88';
      btn.style.boxShadow='inset 0 0 12px '+w.color+'22';
      btn.setAttribute('data-dev-world',w.id);
      wrap.appendChild(btn);
    });
  },
  handle(action){
    if(!action)return;
    if(action==='close')return this.setOpen(false);
    if(action==='set-level')return this.setLevel(this.num('dev-level-input',1));
    if(action==='set-coins')return this.setCoins(this.num('dev-coins-input',0));
    if(action==='set-crowd')return this.setCrowd(this.num('dev-crowd-input',100));
    if(action==='level-down')return this.setLevel((playerData?playerData.level:1)-1);
    if(action==='level-up')return this.setLevel((playerData?playerData.level:1)+1);
    if(action==='coins-10k')return this.addCoins(10000);
    if(action==='coins-100k')return this.addCoins(100000);
    if(action==='unlock-skins')return this.unlockSkins();
    if(action==='equip-shadow')return this.equipSkin('shadow');
    if(action==='shop')return openShop(),this.log('Shop opened'),this.refresh();
    if(action==='start-run')return this.startRun();
    if(action==='boss-now')return this.bossNow();
    if(action==='menu')return this.showMenu();
    if(action==='win-now')return this.winNow();
    if(action==='lose-now')return this.loseNow();
    if(action==='reward-flash')return rewardFlash('gold'),shake(.45),showMilestone('FX TEST','flash + shake'),this.log('FX tested');
    if(action==='reset-save')return this.resetSave();
  },
  install(){
    const panel=document.getElementById('dev-tools');
    const pill=document.getElementById('dev-open-pill');
    if(panel){
      ['click','mousedown','mouseup','touchstart','touchmove','touchend'].forEach(ev=>{
        panel.addEventListener(ev,e=>e.stopPropagation(),{passive:false});
      });
      panel.addEventListener('click',e=>{
        const worldBtn=e.target.closest('[data-dev-world]');
        if(worldBtn){this.applyWorld(worldBtn.getAttribute('data-dev-world'),e.shiftKey);return;}
        const btn=e.target.closest('[data-dev-action]');
        if(btn){CoinFX.remember(btn);this.handle(btn.getAttribute('data-dev-action'));}
      });
    }
    if(pill){
      ['click','mousedown','mouseup','touchstart','touchend'].forEach(ev=>{
        pill.addEventListener(ev,e=>{e.stopPropagation(); if(ev==='click'||ev==='touchend')this.toggle();},{passive:false});
      });
    }
    document.addEventListener('keydown',e=>{
      if(e.key==='F2'||e.key==='`'){
        e.preventDefault();
        this.toggle();
      }
    });
    this.renderWorldButtons();
    setInterval(()=>{ if(this.open) this.refresh(); },700); // poll only when panel visible
    this.refresh();
  }
};
window.DevTools=DevTools;

DevTools.install();
DramaFX.init();


setScreenMode('menu');loadGame();applyWorldTheme(selectedWorldDef(),false);initCrowd();applyEquippedSkin();initInput();initBossTapZone();refreshMetaUI();checkDailyRewardAuto();if(window.MenuGameplayPreview)MenuGameplayPreview.ensure();loop();
