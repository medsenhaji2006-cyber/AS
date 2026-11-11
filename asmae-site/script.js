(()=>{
'use strict';
/* ═══════════ CONFIGURATION — modifie ici les textes et les photos ═══════════ */
const CONFIG={
 name:'ASMAE',
 intro:'J’ai quelque chose à te montrer...',
 introBtn:'Découvrir',
 lead:'Some people make the world more beautiful just by being in it.',
 photos:[ // une photo + une phrase par entrée (9 au total)
  {src:'images/photo-1.jpg',line:'Parce que ta présence rend tout plus doux.'},
  {src:'images/photo-2.jpg',line:'Parce que ton regard dit ce que les mots n’osent pas.'},
  {src:'images/photo-3.jpg',line:'Parce que tu transformes les instants simples en souvenirs précieux.'},
  {src:'images/photo-4.jpg',line:'Parce que ta lumière se voit sans que tu aies besoin de la chercher.'},
  {src:'images/photo-5.jpg',line:'Parce qu’il y a en toi une élégance qui ne s’apprend pas.'},
  {src:'images/photo-6.jpg',line:'Parce que près de toi, le temps ralentit.'},
  {src:'images/photo-7.jpg',line:'Parce que ta façon d’être est unique, et c’est ce qui la rend précieuse.'},
  {src:'images/photo-8.jpg',line:'Parce que tu donnes envie de devenir une meilleure version de soi.'},
  {src:null,line:'Parce que, tout simplement, tu es toi.'} // ← remplace null par 'images/photo-9.jpg' une fois la 9e photo ajoutée
 ],
 message:[
  'Je ne sais pas toujours comment exprimer ce que je ressens, ni trouver les mots parfaits pour décrire ce que tu représentes pour moi.',
  'Mais je voulais créer quelque chose de différent, quelque chose qui ne soit pas simplement un message, mais un petit univers qui porte une partie de mes sentiments.',
  'Parce que certaines personnes occupent une place particulière dans notre vie, et tu fais partie de ces personnes.',
  'Ce site est juste une petite façon de te montrer à quel point tu es spéciale pour moi.'
 ],
 final1:'Some stories are too beautiful to be described with words.',
 final2:'For you, Asmae. ❤️',
 again:'Revoir notre petit univers',
 music:'' // ex. 'assets/musique.mp3' ; vide = ambiance douce générée par le navigateur
};

/* ═══════════ OUTILS ═══════════ */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
if(!window.gsap||!window.ScrollTrigger){console.warn('GSAP introuvable : une connexion internet est nécessaire pour charger les bibliothèques.');return}
gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,TOUCH=matchMedia('(pointer: coarse)').matches,D=t=>RM?.01:t;
const P=CONFIG.photos,N=P.length,num=i=>String(i+1).padStart(2,'0');
const ph=()=>{const d=document.createElement('div');d.className='ph';d.innerHTML='<span>♡<br>Photo à venir</span>';return d};
const media=(p,i,lazy)=>{if(!p.src)return ph();const m=new Image();m.alt='Photo '+(i+1);m.decoding='async';m.draggable=false;if(lazy)m.loading='lazy';m.onerror=()=>m.replaceWith(ph());m.src=p.src;return m};

/* ═══════════ CONTENU ═══════════ */
$('#introText').textContent=CONFIG.intro;$('#go').textContent=CONFIG.introBtn;
$('.f1').textContent=CONFIG.final1;$('.f2').textContent=CONFIG.final2;$('#again').textContent=CONFIG.again;
$('.lead').innerHTML=CONFIG.lead.split(' ').map(w=>`<span>${w}</span>`).join(' ');
$('#name').innerHTML=[...CONFIG.name].map(c=>`<span>${c}</span>`).join('');$('#name').setAttribute('aria-label',CONFIG.name);
const ring=$('#ring'),grid=$('#grid');
P.forEach((p,i)=>{
 const c=document.createElement('div');c.className='card';c.style.setProperty('--i',i);c.innerHTML='<div class="in"></div>';
 const n=$('.in',c);n.append(media(p,i));n.insertAdjacentHTML('beforeend',`<span class="no">Nº ${num(i)}</span>`);ring.append(c);
 const f=document.createElement('figure');f.className='rs';f.innerHTML=`<div class="fr"></div><b>${num(i)}</b><p></p>`;
 $('.fr',f).append(media(p,i,true));$('p',f).textContent=p.line;f.onclick=()=>openLB(i);grid.append(f);
});
const letter=$('#letter');
CONFIG.message.forEach(t=>{const p=document.createElement('p');p.dataset.t=t;p.innerHTML='<span class="t"></span><span class="h"></span>';$('.h',p).textContent=t;letter.append(p)});

/* ═══════════ THREE.JS — particules flottantes + cœur ═══════════ */
let R,S,C,dust,heart,sc,tg,hb=1,mx=0,my=0;const cam={z:14},hp={p:0,o:0};
try{
 R=new THREE.WebGLRenderer({canvas:$('#bg'),antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
 S=new THREE.Scene();C=new THREE.PerspectiveCamera(60,1,.1,100);
 const tex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#fff');g.addColorStop(.35,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
 const pal=[0xe8b4b8,0xd4b06a,0xf6ecdf,0xc0506e].map(h=>new THREE.Color(h));
 const pts=(n,size,fill,op)=>{
  const pos=new Float32Array(n*3),col=new Float32Array(n*3);
  for(let i=0;i<n;i++){fill(pos,i*3);const c=pal[i%4];col.set([c.r,c.g,c.b],i*3)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const o=new THREE.Points(g,new THREE.PointsMaterial({size,map:tex,vertexColors:true,transparent:true,opacity:op,depthWrite:false,blending:THREE.AdditiveBlending}));
  S.add(o);return o};
 const rnd=a=>(Math.random()-.5)*a;
 dust=pts(TOUCH?350:800,.14,(p,i)=>{p[i]=rnd(36);p[i+1]=rnd(22);p[i+2]=rnd(30)-6},.85);
 const HN=TOUCH?2200:4200;sc=new Float32Array(HN*3);tg=new Float32Array(HN*3);
 heart=pts(HN,.1,(p,i)=>{
  const t=Math.random()*6.2832,k=Math.pow(Math.random(),.4),s=.27;
  tg[i]=16*Math.pow(Math.sin(t),3)*k*s;
  tg[i+1]=(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*k*s+.6;
  tg[i+2]=rnd(5)*(1.15-k);
  const a=Math.random()*6.2832,b=Math.acos(rnd(2)),r=14+Math.random()*10;
  sc[i]=r*Math.sin(b)*Math.cos(a);sc[i+1]=r*Math.sin(b)*Math.sin(a);sc[i+2]=r*Math.cos(b);
  p[i]=sc[i];p[i+1]=sc[i+1];p[i+2]=sc[i+2]},0);
}catch(e){R=null;console.warn('WebGL indisponible : le site fonctionne sans la 3D.')}
const upd=()=>{if(!R)return;const a=heart.geometry.attributes.position.array,e=hp.p*hp.p*(3-2*hp.p);for(let i=0;i<a.length;i++)a[i]=sc[i]+(tg[i]-sc[i])*e;heart.geometry.attributes.position.needsUpdate=true};
const rs=()=>{if(!R)return;R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();hb=Math.min(1,C.aspect*1.25)};
addEventListener('resize',rs);rs();

/* ═══════════ ÉTAT DE LA GALERIE 3D ═══════════ */
const stage=$('#stage'),tilt=$('#tilt'),step=360/N;
let base=0,off=0,cur=0,drag=false,lx=0,mv=0,vis=false;
ScrollTrigger.create({trigger:stage,start:'top bottom',end:'bottom top',onToggle:s=>vis=s.isActive,onUpdate:s=>base=-s.progress*240});
stage.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;mv=0});
['pointerup','pointercancel'].forEach(ev=>addEventListener(ev,()=>drag=false));
addEventListener('pointermove',e=>{
 if(drag){const d=e.clientX-lx;lx=e.clientX;off+=d*.3;mv+=Math.abs(d)}
 if(RM||e.pointerType==='touch')return;
 const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;mx=x;my=y;
 gsap.to('#name',{rotationY:x*18,rotationX:-y*12,duration:1,overwrite:'auto'});
 if(vis)gsap.to(tilt,{rotationX:-y*10,rotationY:x*6,duration:1,overwrite:'auto'});
});
$('.pv',stage).onclick=()=>off+=step;$('.nx',stage).onclick=()=>off-=step;
$$('.card').forEach((c,i)=>{
 const n=$('.in',c),hover=e=>!RM&&e.pointerType!=='touch';
 c.addEventListener('pointerenter',e=>hover(e)&&gsap.to(n,{z:60,scale:1.07,duration:.6,ease:'power3.out'}));
 c.addEventListener('pointermove',e=>{if(!hover(e))return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  gsap.to(n,{rotationY:(x-.5)*22,rotationX:(.5-y)*22,duration:.5,overwrite:'auto'});n.style.setProperty('--mx',x*100+'%');n.style.setProperty('--my',y*100+'%')});
 c.addEventListener('pointerleave',()=>gsap.to(n,{z:0,scale:1,rotationX:0,rotationY:0,duration:.8,ease:'power3.out'}));
 c.addEventListener('click',()=>{if(mv<6)openLB(i)});
});

/* ═══════════ BOUCLE D’ANIMATION ═══════════ */
gsap.ticker.add(t=>{
 if(vis){if(!RM&&!drag)off-=.05;cur+=(base+off-cur)*.08;gsap.set(ring,{rotationY:cur})}
 if(!R)return;
 C.position.set(C.position.x+(mx*2-C.position.x)*.04,C.position.y+(-my*1.2-C.position.y)*.04,cam.z);C.lookAt(0,0,0);
 if(!RM){const a=dust.geometry.attributes.position.array;for(let i=1;i<a.length;i+=3){a[i]+=.004+(i%7)*.0006;if(a[i]>11)a[i]=-11}dust.geometry.attributes.position.needsUpdate=true}
 heart.material.opacity=hp.o;heart.rotation.y=RM?0:Math.sin(t*.35)*.6;heart.scale.setScalar(hb*(1+(RM?0:.035*Math.sin(t*2.6))));
 R.render(S,C);
});

/* ═══════════ VISIONNEUSE (clic sur une photo) ═══════════ */
const lb=$('#lb'),lbm=$('#lbm'),cap=$('figcaption',lb),fig=$('figure',lb);let cu=0,lastF;
const show=(i,dir,first)=>{
 cu=(i+N)%N;const p=P[cu];lbm.replaceChildren(media(p,cu));cap.textContent=`Nº ${num(cu)} — ${p.line}`;
 gsap.fromTo(fig,first?{opacity:0,scale:.55,rotationY:-40,z:-300,filter:'blur(16px)'}:{opacity:0,x:dir*90,rotationY:-dir*28,scale:.92,filter:'blur(10px)'},
  {opacity:1,x:0,z:0,rotationY:0,scale:1,filter:'blur(0px)',duration:D(first?1.1:.8),ease:'power3.out',overwrite:true});
};
function openLB(i){lastF=document.activeElement;lb.hidden=false;gsap.fromTo(lb,{opacity:0},{opacity:1,duration:D(.5)});show(i,0,true);$('.x',lb).focus()}
const closeLB=()=>gsap.to(lb,{opacity:0,duration:D(.4),onComplete:()=>{lb.hidden=true;if(lastF&&lastF.focus)lastF.focus()}});
$('.x',lb).onclick=closeLB;$('.pv',lb).onclick=()=>show(cu-1,-1);$('.nx',lb).onclick=()=>show(cu+1,1);
lb.addEventListener('click',e=>{if(e.target===lb)closeLB()});
addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')closeLB();if(e.key==='ArrowRight')show(cu+1,1);if(e.key==='ArrowLeft')show(cu-1,-1)});

/* ═══════════ SCÈNE 2 — HÉROS ═══════════ */
const resetHero=()=>{gsap.killTweensOf('#name span');gsap.set('.lead span',{opacity:0,y:24,filter:'blur(10px)'});gsap.set('#name span',{opacity:0});gsap.set('.hint',{opacity:0})};
const hero=()=>{
 gsap.timeline()
  .to('.lead span',{opacity:1,y:0,filter:'blur(0px)',duration:D(1),stagger:D(.14),ease:'power2.out'})
  .fromTo('#name span',{opacity:0,z:-600,rotationX:-100,y:60,filter:'blur(18px)'},{opacity:1,z:0,rotationX:0,y:0,filter:'blur(0px)',duration:D(1.6),stagger:D(.14),ease:'expo.out'},'+=.2')
  .to('.hint',{opacity:.8,duration:D(1)})
  .add(()=>{if(!RM)gsap.to('#name span',{y:-8,duration:2.4,ease:'sine.inOut',yoyo:true,repeat:-1,stagger:.18})});
};
resetHero();

/* ═══════════ SCÈNE 1 — INTRO + TRANSITION 3D ═══════════ */
gsap.from('#s1 .box > *',{opacity:0,y:24,duration:D(1.6),stagger:.4,delay:.3});
$('#go').onclick=e=>{
 e.currentTarget.disabled=true;
 gsap.timeline({onComplete:()=>{$('#s1').style.display='none';document.body.classList.remove('lock');document.body.classList.add('live');ScrollTrigger.refresh()}})
  .to('#s1 .box',{scale:2.6,z:350,opacity:0,filter:'blur(16px)',duration:D(1.5),ease:'power3.in'})
  .to(cam,{z:2.5,duration:D(1.5),ease:'power3.in'},0)
  .set('#site',{visibility:'visible'},D(1.4))
  .to('#site',{opacity:1,duration:D(1.4)},D(1.4))
  .to('#s1',{opacity:0,duration:D(1)},D(1.4))
  .to(cam,{z:14,duration:D(2),ease:'power2.out'},D(1.5))
  .add(hero,D(1.9));
};

/* ═══════════ SCROLLTRIGGER — révélations, progression ═══════════ */
ScrollTrigger.batch('.rv',{start:'top 85%',once:true,onEnter:b=>gsap.fromTo(b,{y:40,opacity:0,filter:'blur(8px)'},{y:0,opacity:1,filter:'blur(0px)',duration:D(1.2),stagger:.12,ease:'power3.out'})});
ScrollTrigger.batch('.rs',{start:'top 88%',once:true,onEnter:b=>gsap.fromTo(b,{y:70,opacity:0,rotationX:-18,transformPerspective:900},{y:0,opacity:1,rotationX:0,duration:D(1.3),stagger:.15,ease:'power3.out'})});
const dots=$('#dots');
['#s2','#s3','#s3b','#s4','#s5'].forEach(id=>{
 const s=$(id),b=document.createElement('button');b.title=b.ariaLabel=s.dataset.t;
 b.onclick=()=>s.scrollIntoView({behavior:RM?'auto':'smooth'});dots.append(b);
 ScrollTrigger.create({trigger:s,start:'top 55%',end:'bottom 55%',toggleClass:{targets:b,className:'on'}});
});
gsap.to('#bar i',{scaleX:1,ease:'none',scrollTrigger:{trigger:document.documentElement,start:'top top',end:'bottom bottom',scrub:.3}});
addEventListener('load',()=>ScrollTrigger.refresh());

/* ═══════════ SCÈNE 4 — MACHINE À ÉCRIRE ═══════════ */
let typed=false,ttl;
const type=()=>{
 if(typed)return;typed=true;const ps=$$('p',letter);
 if(RM){ps.forEach(p=>{$('.t',p).textContent=p.dataset.t;$('.h',p).textContent=''});return}
 ttl=gsap.timeline();
 ps.forEach(p=>{const t=p.dataset.t,o={n:0};
  ttl.add(()=>p.classList.add('on'))
   .to(o,{n:t.length,duration:t.length*.03,ease:'none',onUpdate(){const n=Math.round(o.n);$('.t',p).textContent=t.slice(0,n);$('.h',p).textContent=t.slice(n)}})
   .add(()=>p.classList.remove('on')).to({},{duration:.6})});
};
const untype=()=>{if(ttl)ttl.kill();typed=false;$$('p',letter).forEach(p=>{p.classList.remove('on');$('.t',p).textContent='';$('.h',p).textContent=p.dataset.t})};
ScrollTrigger.create({trigger:'#s4',start:'top 45%',onEnter:type});

/* ═══════════ SCÈNE 5 — CŒUR DE PARTICULES ═══════════ */
let fin;
const finale=()=>{
 if(fin)return;
 fin=gsap.timeline()
  .to(hp,{o:.95,duration:D(1.2)})
  .to(hp,{p:1,duration:D(4.2),ease:'power2.inOut',onUpdate:upd},0)
  .fromTo('.f1',{y:30,opacity:0,filter:'blur(10px)'},{y:0,opacity:1,filter:'blur(0px)',duration:D(1.6)},'-=1.2')
  .fromTo('.f2',{y:30,opacity:0,scale:.9},{y:0,opacity:1,scale:1,duration:D(1.6),ease:'power3.out'},'+=.4')
  .to('#again',{opacity:1,duration:D(1)},'+=.2');
};
const unfinale=()=>{if(fin){fin.kill();fin=null}hp.p=0;hp.o=0;upd();gsap.set('.f1,.f2,#again',{opacity:0})};
ScrollTrigger.create({trigger:'#s5',start:'top 50%',onEnter:finale,onLeaveBack:unfinale});

/* ═══════════ BOUTONS : début, rejouer ═══════════ */
$('#top').onclick=()=>scrollTo({top:0,behavior:RM?'auto':'smooth'});
$('#again').onclick=()=>gsap.to('#site',{opacity:0,duration:D(.7),onComplete:()=>{
 scrollTo(0,0);unfinale();untype();resetHero();
 document.body.classList.remove('live');document.body.classList.add('lock');gsap.set('#site',{visibility:'hidden'});
 const s=$('#s1');s.style.display='';gsap.set(s,{opacity:1});gsap.set('#s1 .box',{clearProps:'all'});$('#go').disabled=false;
}});

/* ═══════════ MUSIQUE (jamais lancée automatiquement) ═══════════ */
let ac,mg,au;const mus=$('#mus');
const synth=()=>{
 ac=new(window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=0;
 const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=800;f.connect(mg);mg.connect(ac.destination);
 [98,196,246.94,293.66,392,493.88].forEach((fr,i)=>{
  const o=ac.createOscillator(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();
  o.type=i%2?'sine':'triangle';o.frequency.value=fr;o.detune.value=(i-2)*5;g.gain.value=.09;
  l.frequency.value=.04+i*.025;lg.gain.value=.05;l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(f);o.start();l.start()});
};
mus.onclick=()=>{
 const on=mus.getAttribute('aria-pressed')!=='true';mus.setAttribute('aria-pressed',on);mus.classList.toggle('on',on);
 if(CONFIG.music){au=au||Object.assign(new Audio(CONFIG.music),{loop:true,volume:.5});if(on)au.play().catch(()=>{});else au.pause();return}
 if(!ac)synth();if(ac.resume)ac.resume();
 mg.gain.cancelScheduledValues(ac.currentTime);mg.gain.linearRampToValueAtTime(on?.55:0,ac.currentTime+2);
};
})();
