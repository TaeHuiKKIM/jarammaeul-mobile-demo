'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Bell, Check, ChevronDown, Heart, Home, Layers3, MapPin, PackagePlus, Search, Shirt, ShoppingBag, Sprout } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

type Route = 'home' | 'detail' | 'sell' | 'review' | 'waitlist' | 'closet';
type Product = { id: number; title: string; size: string; season: string; condition: string; price: string; area: string; distance: string; count: number };

const products: Product[] = [
  { id: 1, title: '110호 가을 상의 6벌', size: '110호', season: '가을', condition: '양호', price: '29,000원', area: '침산동', distance: '0.8km', count: 6 },
  { id: 2, title: '120호 겨울 등원룩 5벌', size: '120호', season: '겨울', condition: '깨끗함', price: '34,000원', area: '산격동', distance: '1.2km', count: 5 },
  { id: 3, title: '100호 니트·가디건 4벌', size: '100호', season: '봄·가을', condition: '양호', price: '22,000원', area: '복현동', distance: '1.5km', count: 4 },
  { id: 4, title: '110호 기모 바지 4벌', size: '110호', season: '겨울', condition: '사용감 적음', price: '18,000원', area: '대현동', distance: '2.0km', count: 4 },
  { id: 5, title: '120호 패딩·조끼 3벌', size: '120호', season: '겨울', condition: '양호', price: '38,000원', area: '칠성동', distance: '2.3km', count: 3 },
  { id: 6, title: '110호 코트·원피스 3벌', size: '110호', season: '봄·가을', condition: '깨끗함', price: '21,000원', area: '고성동', distance: '2.7km', count: 3 },
  { id: 7, title: '100호 데님 멜빵·티셔츠 2벌', size: '100호', season: '봄·가을', condition: '깨끗함', price: '16,000원', area: '침산동', distance: '0.6km', count: 2 },
  { id: 8, title: '110호 바람막이 등원룩 2벌', size: '110호', season: '봄·가을', condition: '사용감 적음', price: '19,000원', area: '산격동', distance: '1.1km', count: 2 },
  { id: 9, title: '100호 봄 가디건 3벌', size: '100호', season: '봄·가을', condition: '깨끗함', price: '24,000원', area: '복현동', distance: '1.4km', count: 3 },
  { id: 10, title: '아동 운동화·모자 꾸러미', size: '110호', season: '봄·가을', condition: '양호', price: '17,000원', area: '대현동', distance: '1.9km', count: 3 },
  { id: 11, title: '100호 여름 상하의 4벌', size: '100호', season: '여름', condition: '사용감 적음', price: '15,000원', area: '칠성동', distance: '2.2km', count: 4 },
  { id: 12, title: '120호 가디건·치마 2벌', size: '120호', season: '가을', condition: '깨끗함', price: '23,000원', area: '고성동', distance: '2.5km', count: 2 },
];
const newListingProduct: Product = { ...products[0], id: 1, title: '110호 가을 성장꾸러미 6벌', area: '김태희 · 침산동', distance: '방금 전' };
const categories = ['전체', '100호', '110호', '120호', '봄·가을', '겨울'];

function routeFromHash(): Route {
  const value = window.location.hash.replace('#/', '').split('/')[0] as Route;
  return ['home', 'detail', 'sell', 'review', 'waitlist', 'closet'].includes(value) ? value : 'home';
}

export default function JaramVillageDemo() {
  const [route, setRoute] = useState<Route>('home');
  const [filter, setFilter] = useState('전체');
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);
  const [addedListing, setAddedListing] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const sync = () => setRoute(routeFromHash());
    sync(); window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const navigate = (next: Route) => { window.location.hash = `/${next}`; };
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2400); };
  const filteredProducts = useMemo(() => products.filter((product) => {
    const categoryMatch = filter === '전체' || product.size === filter || product.season === filter;
    const queryMatch = !query.trim() || `${product.title} ${product.size} ${product.season}`.toLowerCase().includes(query.trim().toLowerCase());
    return categoryMatch && queryMatch;
  }), [filter, query]);

  return (
    <main className="demo-stage">
      <section className="phone-shell" aria-label="자람마을 모바일 데모">
        <div className="phone-hardware" aria-hidden="true"><span /></div>
        <div className="app-shell">
          <div className="app-scroll" id="app-scroll">
            {route === 'home' && <HomeScreen filter={filter} query={query} products={filteredProducts} addedListing={addedListing} onFilter={setFilter} onQuery={setQuery} onOpen={(product) => { setSelectedProduct(product); navigate('detail'); }} onSell={() => navigate('sell')} />}
            {route === 'detail' && <DetailScreen product={selectedProduct} onBack={() => navigate('home')} onWait={() => navigate('waitlist')} />}
            {route === 'sell' && <SellScreen onBack={() => navigate('home')} onReview={() => navigate('review')} />}
            {route === 'review' && <ReviewScreen onBack={() => navigate('sell')} onComplete={() => { setAddedListing(true); showToast('성장꾸러미가 등록됐어요'); navigate('home'); }} />}
            {route === 'waitlist' && <WaitlistScreen enabled={waitlistEnabled} onToggle={(checked) => { setWaitlistEnabled(checked); showToast(checked ? '120호 겨울옷 입고 알림을 켰어요' : '입고 알림을 껐어요'); }} />}
            {route === 'closet' && <ClosetScreen onSell={() => navigate('sell')} />}
          </div>
          <BottomNav route={route} navigate={navigate} />
          <div id="toast" className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">{toast}</div>
        </div>
      </section>
      <noscript>화면 이동을 보려면 JavaScript를 켜주세요.</noscript>
    </main>
  );
}

function BrandHeader({ compact = false }: { compact?: boolean }) {
  return <header className={`brand-header ${compact ? 'compact' : ''}`}><div className="location-block"><img src="/favicon.svg" alt="자람마을" className="brand-symbol" /><div><strong>자람마을</strong><button type="button" aria-label="생활권 선택">대구 북구 · 생활권 <ChevronDown /></button></div></div><button type="button" className="icon-button" aria-label="알림"><Bell /></button></header>;
}

function HomeScreen({ filter, query, products, addedListing, onFilter, onQuery, onOpen, onSell }: { filter: string; query: string; products: Product[]; addedListing: boolean; onFilter: (value: string) => void; onQuery: (value: string) => void; onOpen: (product: Product) => void; onSell: () => void }) {
  return <div className="screen home-screen"><BrandHeader /><div className="screen-content"><div className="search-wrap"><Search aria-hidden="true" /><Input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="성장꾸러미 검색" aria-label="성장꾸러미 검색" /></div><div className="category-row" aria-label="카테고리">{categories.map((category) => <button key={category} type="button" className={filter === category ? 'active' : ''} onClick={() => onFilter(category)}>{category}</button>)}</div><section className="cycle-flow" aria-label="우리 아이 성장순환"><div><span>지금</span><strong>110호 정리 중</strong></div><i aria-hidden="true">→</i><div><span>이어서</span><strong>판매 준비</strong></div><i aria-hidden="true">→</i><div><span>다음</span><strong>120호 기다림</strong></div></section><div className="section-heading feed-heading"><div><strong>{filter === '전체' ? '우리 동네 성장꾸러미' : `${filter} 성장꾸러미`}</strong><span>{products.length}개의 꾸러미</span></div><button type="button">최신순</button></div><div className="product-grid">{addedListing && <ProductCard product={newListingProduct} onOpen={() => onOpen(newListingProduct)} highlight />}{products.map((product) => <ProductCard key={product.id} product={product} onOpen={() => onOpen(product)} />)}</div>{products.length === 0 && <div className="empty-state"><Search /><strong>조건에 맞는 성장꾸러미가 없어요</strong><span>다음 옷 기다림을 등록하면 알려드릴게요.</span></div>}</div><button type="button" className="floating-sell" onClick={onSell} aria-label="성장꾸러미 등록"><PackagePlus /></button></div>;
}

function ProductCard({ product, onOpen, highlight = false }: { product: Product; onOpen: () => void; highlight?: boolean }) {
  return <button type="button" className={`product-card ${highlight ? 'new-listing' : ''}`} onClick={onOpen} aria-label={`${product.title} 상세 보기`}><div className="product-image"><ProductVisual index={product.id} alt={product.title} /></div><div className="product-copy"><div className="tag-line"><span>{product.size}</span><span>{product.season}</span></div><strong>{product.title}</strong><b>{product.price}</b><small className={highlight ? 'recent-meta' : ''}>{highlight && <span aria-hidden="true" />}{product.area} · {product.distance}</small></div></button>;
}

function ProductVisual({ index, alt, className = '' }: { index: number; alt: string; className?: string }) {
  const normalized = ((index - 1) % 12) + 1;
  return <div className={`product-visual visual-${normalized} ${className}`} role="img" aria-label={alt} />;
}

function ScreenTop({ title, onBack }: { title: string; onBack?: () => void }) {
  return <header className="screen-top">{onBack ? <button className="icon-button" type="button" onClick={onBack} aria-label="뒤로가기"><ArrowLeft /></button> : <span className="top-spacer" />}<strong>{title}</strong><button className="icon-button" type="button" aria-label="찜하기"><Heart /></button></header>;
}

function DetailScreen({ product, onBack, onWait }: { product: Product; onBack: () => void; onWait: () => void }) {
  return <div className="screen detail-screen"><ScreenTop title="성장꾸러미 상세" onBack={onBack} /><div className="detail-hero"><ProductVisual index={product.id} alt={product.title} /><span>{product.count}벌 구성</span></div><div className="detail-body"><div className="seller-line"><div className="avatar">자</div><div><strong>자람이네</strong><span><MapPin /> {product.area} · {product.distance}</span></div><Badge variant="secondary">생활권 인증</Badge></div><div className="detail-title"><div className="tag-line"><span>{product.size}</span><span>{product.season}</span><span>{product.condition}</span></div><h1>{product.title}</h1><strong>{product.price}</strong></div><div className="info-list"><div><Sprout /><span><b>예상 착용시기</b>지금부터 초겨울까지</span></div><div><Layers3 /><span><b>구성</b>니트 2, 맨투맨 2, 가디건 1, 바지 1</span></div><div><img src="/jarammaeul-symbol.png" alt="" className="inline-brand-mark" /><span><b>추천 이유</b>현재 110호를 정리 중인 아이에게 맞는 다음 교체 흐름이에요.</span></div></div><div className="match-card"><span>다음 옷 기다림과 맞아요</span><strong>120호 · 겨울 · 상의/아우터</strong><button type="button" onClick={onWait}>추천 흐름 보기</button></div></div><div className="sticky-actions"><Button variant="outline" className="heart-action" aria-label="찜"><Heart /></Button><Button className="brand-button" onClick={onWait}>다음 옷 기다림 등록</Button></div></div>;
}

function SellScreen({ onBack, onReview }: { onBack: () => void; onReview: () => void }) {
  const samples = [1, 3, 2, 4, 5, 6];
  return <div className="screen sell-screen"><ScreenTop title="성장꾸러미 등록" onBack={onBack} /><div className="screen-content compact-content"><div className="step-heading"><span>1</span><div><strong>사진을 한 번에 올려주세요</strong><small>같은 계절·사이즈 옷을 6장 선택했어요.</small></div></div><div className="sample-grid">{samples.map((index) => <div key={index}><ProductVisual index={index} alt={`아동복 샘플 ${index}`} /><span>{index}</span></div>)}</div><div className="step-heading"><span>2</span><div><strong>사진에서 정보를 읽었어요</strong><small>틀린 정보가 있는지만 확인해주세요.</small></div></div><div className="ai-result-card"><div className="ai-result-head"><img src="/jarammaeul-symbol.png" alt="" className="mini-brand-icon" /><strong>110호 가을 성장꾸러미</strong><Badge variant="outline">확인 필요 1개</Badge></div><div className="result-tags"><span>상의 5벌</span><span>바지 1벌</span><span>가을</span><span>상태 양호</span></div><div className="check-row"><Check /><span>라벨 5장 확인</span><small>가디건 1벌은 직접 확인해주세요</small></div></div><Button className="brand-button full-button" onClick={onReview}>판매글 확인</Button></div></div>;
}

function ReviewScreen({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  return <div className="screen review-screen"><ScreenTop title="판매글 확인" onBack={onBack} /><div className="screen-content compact-content"><div className="review-cover"><ProductVisual index={1} alt="110호 가을 성장꾸러미" /><div><Badge variant="secondary">자동 입력</Badge><strong>110호 가을 상의 6벌 성장꾸러미</strong><span>침산동 · 직거래</span></div></div><ReviewSection guardian={false} /><ReviewSection guardian /><Button className="brand-button full-button" onClick={onComplete}>등록 완료</Button></div></div>;
}

function ReviewSection({ guardian }: { guardian: boolean }) {
  return <section className={`review-section ${guardian ? 'guardian' : ''}`}><div><span>{guardian ? '내가 확인한 정보' : '사진에서 읽은 정보'}</span>{guardian ? <Badge variant="secondary"><Check /> 확인 완료</Badge> : <button type="button">수정</button>}</div><dl>{guardian ? <><dt>가격범위</dt><dd>26,000~32,000원</dd><dt>판매가격</dt><dd><strong>29,000원</strong></dd><dt>생활권</dt><dd>대구 북구 침산동</dd></> : <><dt>구성</dt><dd>니트 2 · 맨투맨 2 · 가디건 1 · 바지 1</dd><dt>계절</dt><dd>가을~초겨울</dd><dt>상태</dt><dd>양호 · 미세 사용감</dd></>}</dl></section>;
}

function WaitlistScreen({ enabled, onToggle }: { enabled: boolean; onToggle: (checked: boolean) => void }) {
  return <div className="screen waitlist-screen"><BrandHeader compact /><div className="screen-content"><div className="page-intro"><span className="eyebrow">다음 성장단계</span><h1>우리 아이의 다음 옷 기다림</h1><p>현재 옷장을 기준으로 필요한 조건을 먼저 모아요.</p></div><div className="child-card"><div className="child-icon"><Sprout /></div><div><strong>현재 110호 · 키 106cm</strong><span>가을옷 정리 중 · 겨울옷 준비 필요</span></div><button type="button">수정</button></div><section className="condition-card"><div className="condition-head"><span>기다리는 조건</span><Badge>추천 조건</Badge></div><div className="condition-grid"><div><span>사이즈</span><strong>120호</strong></div><div><span>계절</span><strong>겨울</strong></div><div><span>품목</span><strong>상의·아우터</strong></div></div></section><div className="recommend-heading"><div><strong>추천 성장꾸러미</strong><span>왜 추천했나요?</span></div><small>현재 치수와 계절을 기준으로 골랐어요.</small></div><div className="wide-product"><ProductVisual index={5} alt="120호 겨울 성장꾸러미" /><div><div className="tag-line"><span>120호</span><span>겨울</span></div><strong>겨울 등원룩 5벌</strong><b>34,000원</b><small>산격동 · 1.2km</small></div></div><div className="notify-card"><div><Bell /><span><strong>입고 알림 받기</strong><small>{enabled ? '조건에 맞는 옷이 올라오면 알려드려요.' : '알림을 켜면 새 성장꾸러미를 놓치지 않아요.'}</small></span></div><Switch checked={enabled} onCheckedChange={onToggle} aria-label="입고 알림" /></div></div></div>;
}

function ClosetScreen({ onSell }: { onSell: () => void }) {
  return <div className="screen closet-screen"><BrandHeader compact /><div className="screen-content"><div className="page-intro"><span className="eyebrow">김태희님의 옷장</span><h1>내 옷장</h1><p>입고 있는 옷부터 다음 순환까지 한눈에 봐요.</p></div><div className="closet-stats"><div><strong>18</strong><span>현재 옷</span></div><div><strong>4</strong><span>곧 작아질 옷</span></div><div><strong>12</strong><span>순환 완료</span></div></div><div className="outgrown-card"><div><span><Shirt /><b>작아질 가능성이 높은 옷 4벌</b></span><small>110호 가을옷 · 최근 착용 기록 기준</small></div><Button className="brand-button" onClick={onSell}>판매 준비</Button></div><section className="closet-section"><div className="section-heading"><div><span>현재 입는 옷</span><strong>110호 · 가을</strong></div><button type="button">전체보기</button></div><div className="closet-thumbs">{[1, 2, 4].map((index, position) => <div key={index}><ProductVisual index={index} alt={`현재 옷 ${position + 1}`} /><span>{['니트', '가디건', '바지'][position]}</span></div>)}</div></section><div className="cycle-summary"><Sprout /><div><strong>이번 달 3벌이 다음 아이에게 갔어요</strong><span>누적 순환 12벌 · 예상 절약 84,000원</span></div></div></div></div>;
}

function BottomNav({ route, navigate }: { route: Route; navigate: (route: Route) => void }) {
  const items: { route: Route; label: string; icon: typeof Home }[] = [{ route: 'home', label: '홈', icon: Home }, { route: 'waitlist', label: '기다림', icon: Bell }, { route: 'sell', label: '등록', icon: PackagePlus }, { route: 'closet', label: '옷장', icon: ShoppingBag }];
  return <nav className="bottom-nav" aria-label="주요 메뉴">{items.map((item) => { const Icon = item.icon; const active = route === item.route || (route === 'detail' && item.route === 'home') || (route === 'review' && item.route === 'sell'); return <button key={item.route} type="button" className={active ? 'active' : ''} onClick={() => navigate(item.route)} aria-current={active ? 'page' : undefined}><Icon /><span>{item.label}</span></button>; })}</nav>;
}
