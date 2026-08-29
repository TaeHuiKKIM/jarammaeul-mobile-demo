const ASSET = 'https://raw.githubusercontent.com/TaeHuiKKIM/jarammaeul-mobile-demo/main/public';
const routes = ['home', 'detail', 'sell', 'review', 'waitlist', 'closet'];
const products = [
  ['110호 가을 상의 6벌','110호','가을','29,000원','침산동 · 0.8km',1],
  ['120호 겨울 등원룩 5벌','120호','겨울','34,000원','산격동 · 1.2km',2],
  ['100호 니트·가디건 4벌','100호','봄·가을','22,000원','복현동 · 1.5km',3],
  ['110호 기모 바지 4벌','110호','겨울','18,000원','대현동 · 2.0km',4],
  ['120호 패딩·조끼 3벌','120호','겨울','38,000원','칠성동 · 2.3km',5],
  ['110호 코트·원피스 3벌','110호','봄·가을','21,000원','고성동 · 2.7km',6],
  ['100호 데님 멜빵·티셔츠 2벌','100호','봄·가을','16,000원','침산동 · 0.6km',7],
  ['110호 바람막이 등원룩 2벌','110호','봄·가을','19,000원','산격동 · 1.1km',8],
  ['100호 봄 가디건 3벌','100호','봄·가을','24,000원','복현동 · 1.4km',9],
  ['아동 운동화·모자 꾸러미','110호','봄·가을','17,000원','대현동 · 1.9km',10],
  ['100호 여름 상하의 4벌','100호','여름','15,000원','칠성동 · 2.2km',11],
  ['120호 가디건·치마 2벌','120호','가을','23,000원','고성동 · 2.5km',12],
];
const state = { route:'home', selected:products[0], added:false, waiting:false };
const screen = document.querySelector('#screen');
const toast = document.querySelector('#toast');

const iconPaths = {
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
  'arrow-left': '<path d="m15 18-6-6 6-6"/>',
};
const icon = (name) => `<svg class="ui-icon" data-icon="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;
const visual = (index, alt, extra='') => `<div class="product-visual visual-${index} ${extra}" role="img" aria-label="${alt}"></div>`;
const header = () => `<header class="brand-header"><div class="brand"><img src="${ASSET}/favicon.svg" alt=""><div><strong>자람마을</strong><span>대구 북구 · 생활권</span></div></div><button class="plain icon-only" aria-label="알림">${icon('bell')}</button></header>`;
const top = (title) => `<header class="screen-top"><button class="icon-only" data-back aria-label="뒤로가기">${icon('arrow-left')}</button><strong>${title}</strong><button class="plain icon-only" aria-label="찜하기">${icon('heart')}</button></header>`;
const tags = (size, season) => `<div class="tags"><span>${size}</span><span>${season}</span></div>`;

function productRow(p, fresh=false) {
  return `<button class="product-row" data-product="${p[5]}">${visual(p[5],p[0])}<div class="product-copy">${tags(p[1],p[2])}<strong>${p[0]}</strong><b>${p[3]}</b><small class="${fresh?'recent-meta':''}">${fresh?'<span></span>김태희 · 방금 전':p[4]}</small></div></button>`;
}

function home() {
  return `<div class="screen">${header()}<div class="content"><label class="search">검색<input id="search" placeholder="성장꾸러미 검색"></label><div class="chips">${['전체','100호','110호','120호','봄·가을','겨울'].map(x=>`<button>${x}</button>`).join('')}</div><section class="cycle-flow" aria-label="우리 아이 성장순환"><div><span>지금</span><strong>110호 정리 중</strong></div><i>→</i><div><span>이어서</span><strong>판매 준비</strong></div><i>→</i><div><span>다음</span><strong>120호 기다림</strong></div></section><div class="feed-title"><strong>우리 동네 성장꾸러미</strong><span>${products.length}개의 꾸러미</span><button>최신순</button></div><div class="product-list">${state.added?productRow([...products[0]],true):''}${products.map(p=>productRow(p)).join('')}</div></div><button class="fab" data-route="sell" aria-label="성장꾸러미 등록">＋</button></div>`;
}

function detail() {
  const p=state.selected;
  return `<div class="screen">${top('성장꾸러미 상세')}<div class="detail-hero">${visual(p[5],p[0])}<span>6벌 구성</span></div><div class="content detail"><div class="seller"><div class="avatar">자</div><div><strong>자람이네</strong><small>${p[4]}</small></div><em>생활권 인증</em></div>${tags(p[1],p[2])}<h1>${p[0]}</h1><h2>${p[3]}</h2><dl><dt>예상 착용시기</dt><dd>지금부터 초겨울까지</dd><dt>구성</dt><dd>니트 2, 맨투맨 2, 가디건 1, 바지 1</dd><dt>추천 이유</dt><dd>현재 옷장에서 다음 교체 시기에 맞는 구성입니다.</dd></dl><div class="notice"><strong>다음 옷 기다림과 맞아요</strong><span>120호 · 겨울 · 상의/아우터</span></div><button class="primary" data-route="waitlist">다음 옷 기다림 등록</button></div></div>`;
}

function sell() {
  return `<div class="screen">${top('성장꾸러미 등록')}<div class="content"><section class="step"><b>1</b><div><strong>사진을 한 번에 올려주세요</strong><small>같은 계절·사이즈 옷 6장을 선택했어요.</small></div></section><div class="photo-grid">${[1,3,2,4,5,6].map((n,i)=>`<div>${visual(n,'아동복 사진 '+(i+1))}<span>${i+1}</span></div>`).join('')}</div><section class="step"><b>2</b><div><strong>사진에서 정보를 읽었어요</strong><small>틀린 정보가 있는지만 확인해주세요.</small></div></section><div class="read-result"><div class="result-head"><img src="${ASSET}/jarammaeul-symbol.png" alt=""><strong>110호 가을 성장꾸러미</strong><span>확인 필요 1개</span></div>${tags('상의 5벌','바지 1벌')}<p>가을 · 상태 양호</p><small>가디건 1벌은 직접 확인해주세요.</small></div><button class="primary" data-route="review">판매글 확인</button></div></div>`;
}

function review() {
  return `<div class="screen">${top('판매글 확인')}<div class="content review"><div class="review-cover">${visual(1,'110호 가을 성장꾸러미')}<div><span>자동 입력</span><strong>110호 가을 상의 6벌 성장꾸러미</strong><small>침산동 · 직거래</small></div></div><section><header><strong>사진에서 읽은 정보</strong><button>수정</button></header><p>니트 2 · 맨투맨 2 · 가디건 1 · 바지 1</p><p>가을~초겨울 · 상태 양호</p></section><section><header><strong>내가 확인한 정보</strong><span>확인 완료</span></header><p>판매가격 <b>29,000원</b></p><p>대구 북구 침산동</p></section><button class="primary" data-action="complete">등록 완료</button></div></div>`;
}

function waitlist() {
  return `<div class="screen">${header()}<div class="content"><div class="intro"><span>다음 성장단계</span><h1>우리 아이의 다음 옷 기다림</h1><p>현재 옷장을 기준으로 필요한 조건을 먼저 모아요.</p></div><div class="child"><strong>현재 110호 · 키 106cm</strong><small>가을옷 정리 중 · 겨울옷 준비 필요</small></div><div class="conditions"><div><span>사이즈</span><b>120호</b></div><div><span>계절</span><b>겨울</b></div><div><span>품목</span><b>상의·아우터</b></div></div><h3>추천 성장꾸러미</h3><div class="wide-product">${visual(5,'120호 겨울 성장꾸러미')}<div>${tags('120호','겨울')}<strong>겨울 등원룩 5벌</strong><b>34,000원</b><small>산격동 · 1.2km</small></div></div><label class="toggle"><div><strong>입고 알림 받기</strong><small>조건에 맞는 옷이 올라오면 알려드려요.</small></div><input type="checkbox" ${state.waiting?'checked':''}></label></div></div>`;
}

function closet() {
  return `<div class="screen">${header()}<div class="content"><div class="intro"><span>김태희님의 옷장</span><h1>내 옷장</h1><p>입고 있는 옷부터 다음 순환까지 한눈에 봐요.</p></div><div class="stats"><div><b>18</b><span>현재 옷</span></div><div><b>4</b><span>곧 작아질 옷</span></div><div><b>12</b><span>순환 완료</span></div></div><div class="outgrown"><div><strong>작아질 가능성이 높은 옷 4벌</strong><small>110호 가을옷 · 최근 착용 기록 기준</small></div><button data-route="sell">판매 준비</button></div><h3>현재 입는 옷</h3><div class="closet-grid">${[1,2,4].map((n,i)=>`<div>${visual(n,['니트','가디건','바지'][i])}<span>${['니트','가디건','바지'][i]}</span></div>`).join('')}</div><div class="cycle"><strong>이번 달 3벌이 다음 아이에게 갔어요</strong><span>누적 순환 12벌 · 예상 절약 84,000원</span></div></div></div>`;
}

const views={home,detail,sell,review,waitlist,closet};
function render(){ screen.innerHTML=views[state.route](); document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===state.route||(state.route==='detail'&&b.dataset.route==='home')||(state.route==='review'&&b.dataset.route==='sell'))); }
function go(route){ state.route=routes.includes(route)?route:'home'; location.hash='/'+state.route; render(); screen.scrollTop=0; }
function showToast(message){ toast.textContent=message; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2200); }

document.addEventListener('click',e=>{ const button=e.target.closest('button'); if(!button)return; if(button.dataset.route)go(button.dataset.route); if(button.dataset.product){state.selected=products.find(p=>p[5]===Number(button.dataset.product))||products[0];go('detail');} if(button.dataset.back)history.back(); if(button.dataset.action==='complete'){state.added=true;go('home');showToast('성장꾸러미가 등록됐어요');} });
document.addEventListener('change',e=>{if(e.target.matches('.toggle input')){state.waiting=e.target.checked;showToast(state.waiting?'입고 알림을 켰어요':'입고 알림을 껐어요');}});
window.addEventListener('hashchange',()=>{const route=location.hash.replace('#/','').split('/')[0];state.route=routes.includes(route)?route:'home';render();});
state.route=routes.includes(location.hash.replace('#/',''))?location.hash.replace('#/',''):'home';
render();
