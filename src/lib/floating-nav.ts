const SVG_NS = 'http://www.w3.org/2000/svg';
const storageKey = 'netminn012-theme';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function smoothstep(a: number, b: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function capsuleDistance(x: number, y: number, halfWidth: number, halfHeight: number) {
  const radius = halfHeight;
  const straight = Math.max(0, halfWidth - radius);
  return Math.hypot(Math.max(Math.abs(x) - straight, 0), y) - radius;
}

function createDisplacementMap(width: number, height: number) {
  const ratio = Math.min(1, 360 / width);
  const w = Math.max(96, Math.round(width * ratio));
  const h = Math.max(32, Math.round(height * ratio));
  const canvas = document.createElement('canvas');
  canvas.hidden = true;
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) return null;
  const pixels = context.createImageData(w, h);
  const edgeWidth = Math.max(7, h * .22);

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const cx = x - w / 2;
      const cy = y - h / 2;
      const distance = capsuleDistance(cx, cy, w / 2, h / 2);
      const edge = 1 - smoothstep(-edgeWidth, -1, distance);
      const magnitude = edge * edge;
      const nx = cx / (w / 2);
      const ny = cy / (h / 2);
      const length = Math.hypot(nx, ny) || 1;
      const index = (y * w + x) * 4;
      pixels.data[index] = Math.round((.5 + nx / length * magnitude * .5) * 255);
      pixels.data[index + 1] = Math.round((.5 + ny / length * magnitude * .5) * 255);
      pixels.data[index + 2] = 128;
      pixels.data[index + 3] = 255;
    }
  }
  context.putImageData(pixels, 0, 0);
  return canvas.toDataURL('image/png');
}

function enhanceLiquidNav(nav: HTMLElement) {
  const supportsSvgBackdrop = CSS.supports('backdrop-filter', 'url("#nav-liquid-test")') || CSS.supports('-webkit-backdrop-filter', 'url("#nav-liquid-test")');
  if (!supportsSvgBackdrop) return;
  const svg = document.createElementNS(SVG_NS, 'svg');
  const defs = document.createElementNS(SVG_NS, 'defs');
  const filter = document.createElementNS(SVG_NS, 'filter');
  const image = document.createElementNS(SVG_NS, 'feImage');
  const displacement = document.createElementNS(SVG_NS, 'feDisplacementMap');
  const filterId = 'floating-nav-refraction';
  let previousSize = '';
  svg.classList.add('nav-filter-defs');
  svg.setAttribute('aria-hidden', 'true');
  filter.id = filterId;
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  filter.setAttribute('x', '-4%');
  filter.setAttribute('y', '-18%');
  filter.setAttribute('width', '108%');
  filter.setAttribute('height', '136%');
  image.setAttribute('preserveAspectRatio', 'none');
  displacement.setAttribute('in', 'SourceGraphic');
  displacement.setAttribute('in2', 'map');
  displacement.setAttribute('xChannelSelector', 'R');
  displacement.setAttribute('yChannelSelector', 'G');
  displacement.setAttribute('scale', '18');
  filter.append(image, displacement);
  defs.append(filter);
  svg.append(defs);
  document.body.append(svg);

  const update = () => {
    const rect = nav.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    const size = `${width}x${height}`;
    if (size === previousSize || width < 2 || height < 2) return;
    previousSize = size;
    const map = createDisplacementMap(width, height);
    if (!map) return;
    image.setAttribute('width', String(width));
    image.setAttribute('height', String(height));
    image.setAttribute('href', map);
    nav.style.setProperty('--nav-liquid-filter', `url("#${filterId}")`);
    nav.classList.add('floating-nav--refractive');
  };
  requestAnimationFrame(update);
  new ResizeObserver(() => requestAnimationFrame(update)).observe(nav);
}

const nav = document.querySelector<HTMLElement>('#floating-nav');
const indicator = nav?.querySelector<HTMLElement>('.nav-liquid-indicator');
const items = nav ? [...nav.querySelectorAll<HTMLElement>('[data-nav-item]')] : [];
const topThemeButton = document.querySelector<HTMLButtonElement>('#theme-toggle');
const colorQuery = matchMedia('(prefers-color-scheme: light)');
let activeIndex = 0;
let activeAnimation: Animation | null = null;
let suppressSpyUntil = 0;
let scrollQueued = false;

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  const label = `${theme === 'dark' ? 'ライト' : 'ダーク'}テーマに切り替える`;
  topThemeButton?.setAttribute('aria-label', label);
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem(storageKey, next); } catch { /* unavailable */ }
}

function setActive(index: number, animate = true) {
  if (!nav || !indicator || !items[index]) return;
  const target = items[index];
  const navRect = nav.getBoundingClientRect();
  const indicatorRect = indicator.getBoundingClientRect();
  const baseLeft = 6;
  const from = indicatorRect.left - navRect.left - baseLeft;
  const to = target.offsetLeft - baseLeft;
  const distance = to - from;
  const direction = Math.sign(distance) || 1;
  const stretch = Math.min(2.05, 1 + Math.abs(distance) / Math.max(target.offsetWidth, 1) * .28);

  items.forEach((item, itemIndex) => {
    const selected = itemIndex === index;
    item.classList.toggle('is-active', selected);
    if (item instanceof HTMLAnchorElement) selected ? item.setAttribute('aria-current', 'location') : item.removeAttribute('aria-current');
  });
  activeIndex = index;
  activeAnimation?.cancel();
  indicator.style.width = `${target.offsetWidth}px`;
  indicator.style.transformOrigin = direction > 0 ? 'left center' : 'right center';

  if (!animate || reducedMotion.matches || Math.abs(distance) < 1) {
    indicator.style.transform = `translate3d(${to}px,0,0) scaleX(1)`;
    return;
  }
  nav.classList.add('is-morphing');
  activeAnimation = indicator.animate([
    { transform: `translate3d(${from}px,0,0) scaleX(1)`, offset: 0 },
    { transform: `translate3d(${from + distance * .18}px,0,0) scaleX(${stretch})`, offset: .24 },
    { transform: `translate3d(${to + direction * 5}px,0,0) scaleX(1.06)`, offset: .7 },
    { transform: `translate3d(${to - direction * 2}px,0,0) scaleX(.97)`, offset: .86 },
    { transform: `translate3d(${to}px,0,0) scaleX(1)`, offset: 1 },
  ], { duration: 430, easing: 'cubic-bezier(.2,.82,.2,1)', fill: 'forwards' });
  activeAnimation.onfinish = () => {
    indicator.style.transform = `translate3d(${to}px,0,0) scaleX(1)`;
    nav.classList.remove('is-morphing');
    activeAnimation = null;
  };
}

function updateFromScroll() {
  scrollQueued = false;
  if (performance.now() < suppressSpyUntil) return;
  const marker = scrollY + innerHeight * .32;
  let nextIndex = 0;
  items.forEach((item, index) => {
    const sectionId = item.dataset.section;
    const section = sectionId ? document.getElementById(sectionId) : null;
    if (section && section.offsetTop <= marker) nextIndex = index;
  });
  if (nextIndex !== activeIndex) setActive(nextIndex);
}

items.forEach((item, index) => {
  item.addEventListener('click', event => {
    const sectionId = item.dataset.section;
    const section = sectionId ? document.getElementById(sectionId) : null;
    if (!section) return;
    event.preventDefault();
    suppressSpyUntil = performance.now() + 500;
    setActive(index);
    section.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${sectionId}`);
  });
});

topThemeButton?.addEventListener('click', toggleTheme);
colorQuery.addEventListener('change', event => {
  try { if (localStorage.getItem(storageKey)) return; } catch { /* follow OS */ }
  applyTheme(event.matches ? 'light' : 'dark');
});
addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(updateFromScroll);
}, { passive: true });
addEventListener('resize', () => setActive(activeIndex, false));

applyTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
if (nav) {
  requestAnimationFrame(() => setActive(0, false));
  const scheduleRefraction = () => enhanceLiquidNav(nav);
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(scheduleRefraction, { timeout: 1500 });
  } else {
    setTimeout(scheduleRefraction, 400);
  }
}
