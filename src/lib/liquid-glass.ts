const NS='http://www.w3.org/2000/svg';
const supported=typeof CSS!=='undefined'&&(CSS.supports('backdrop-filter','url("#lg-test")')||CSS.supports('-webkit-backdrop-filter','url("#lg-test")'));
const svg=document.createElementNS(NS,'svg'); svg.classList.add('liquid-glass-defs'); svg.setAttribute('aria-hidden','true');
const defs=document.createElementNS(NS,'defs'); svg.append(defs); document.body.append(svg); let sequence=0;
const smooth=(a:number,b:number,v:number)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t)};
function sdf(x:number,y:number,w:number,h:number,r:number){const qx=Math.abs(x)-w+r,qy=Math.abs(y)-h+r;return Math.min(Math.max(qx,qy),0)+Math.hypot(Math.max(qx,0),Math.max(qy,0))-r}
function createMap(width:number,height:number){
 const ratio=Math.min(1,220/Math.max(width,height)),w=Math.max(32,Math.round(width*ratio)),h=Math.max(32,Math.round(height*ratio));
 const canvas=document.createElement('canvas'); canvas.hidden=true; canvas.width=w; canvas.height=h;
 const context=canvas.getContext('2d',{alpha:false}); if(!context)return null; const pixels=context.createImageData(w,h),edge=Math.max(10,Math.min(24,Math.min(w,h)*.22));
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const cx=x-w/2,cy=y-h/2,d=sdf(cx,cy,w/2,h/2,Math.min(26*ratio,h/2-1)),e=1-smooth(-edge,-1,d),m=e*e,l=Math.hypot(cx/(w/2),cy/(h/2))||1,i=(y*w+x)*4;pixels.data[i]=Math.round((.5+cx/(w/2)/l*m*.5)*255);pixels.data[i+1]=Math.round((.5+cy/(h/2)/l*m*.5)*255);pixels.data[i+2]=128;pixels.data[i+3]=255}
 context.putImageData(pixels,0,0); return canvas.toDataURL('image/png');
}
function enhance(el:HTMLElement){
 const id=`liquid-glass-${sequence++}`,filter=document.createElementNS(NS,'filter'),image=document.createElementNS(NS,'feImage'),map=document.createElementNS(NS,'feDisplacementMap'); let last='';
 filter.id=id; filter.setAttribute('color-interpolation-filters','sRGB'); filter.setAttribute('x','-8%');filter.setAttribute('y','-16%');filter.setAttribute('width','116%');filter.setAttribute('height','132%');
 image.setAttribute('preserveAspectRatio','none');map.setAttribute('in','SourceGraphic');map.setAttribute('in2','map');map.setAttribute('xChannelSelector','R');map.setAttribute('yChannelSelector','G');map.setAttribute('scale',el.dataset.strength??'20');filter.append(image,map);defs.append(filter);
 const update=()=>{const rect=el.getBoundingClientRect(),w=Math.round(rect.width),h=Math.round(rect.height),size=`${w}x${h}`;if(w<2||h<2||size===last)return;last=size;const data=createMap(w,h);if(!data)return;image.setAttribute('width',String(w));image.setAttribute('height',String(h));image.setAttribute('href',data);el.style.setProperty('--liquid-filter',`url("#${id}")`);el.classList.add('liquid-glass--enhanced')};
 update(); const observer=new ResizeObserver(()=>requestAnimationFrame(update));observer.observe(el);
}
if(supported){
 const elements=[...document.querySelectorAll<HTMLElement>('[data-liquid-glass]')];
 const schedule=window.requestIdleCallback??((callback:IdleRequestCallback)=>window.setTimeout(()=>callback({didTimeout:false,timeRemaining:()=>16}),1));
 const next=()=>{const element=elements.shift();if(!element)return;enhance(element);if(elements.length)schedule(next,{timeout:800})};
 schedule(next,{timeout:800});
}else document.documentElement.classList.add('no-svg-backdrop');
