'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Heart,
  Home,
  Plus,
  Search,
  Shirt,
  Camera,
  Leaf,
  Clock,
  SlidersHorizontal,
  PackageCheck,
  X,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  LoaderCircle,
} from 'lucide-react';
import { quote, available } from '../lib/prototype.mjs';
import '../app/prototype.css';
type Item = {
  id: number;
  title: string;
  size: number;
  price: number;
  image: number;
  category: string;
  condition: string;
  area: string;
  future?: boolean;
};
const catalog: Item[] = [
  {
    id: 1,
    title: '가을을 닮은 니트와 맨투맨',
    size: 110,
    price: 29000,
    image: 1,
    category: '상의',
    condition: '소매 보풀 있어요',
    area: '침산동',
  },
  {
    id: 2,
    title: '따뜻한 겨울 등원복',
    size: 120,
    price: 34000,
    image: 2,
    category: '꾸러미',
    condition: '깨끗해요',
    area: '산격동',
  },
  {
    id: 3,
    title: '포근한 니트 · 가디건',
    size: 100,
    price: 22000,
    image: 3,
    category: '상의',
    condition: '보풀 조금',
    area: '복현동',
  },
  {
    id: 4,
    title: '매일 입는 기모 바지',
    size: 110,
    price: 18000,
    image: 4,
    category: '하의',
    condition: '무릎 사용감 있어요',
    area: '대현동',
  },
  {
    id: 5,
    title: '다음 겨울의 패딩과 조끼',
    size: 120,
    price: 38000,
    image: 5,
    category: '아우터',
    condition: '판매 전 재확인',
    area: '칠성동',
    future: true,
  },
  {
    id: 6,
    title: '주말 외출 코트 · 원피스',
    size: 110,
    price: 21000,
    image: 6,
    category: '아우터',
    condition: '깨끗해요',
    area: '고성동',
  },
  {
    id: 7,
    title: '데님 멜빵과 줄무늬 티',
    size: 100,
    price: 16000,
    image: 7,
    category: '꾸러미',
    condition: '사용감 적어요',
    area: '침산동',
  },
  {
    id: 8,
    title: '가볍게 입는 바람막이',
    size: 110,
    price: 19000,
    image: 8,
    category: '아우터',
    condition: '깨끗해요',
    area: '산격동',
  },
  {
    id: 9,
    title: '봄날의 가디건 세 벌',
    size: 100,
    price: 24000,
    image: 9,
    category: '상의',
    condition: '보풀 조금',
    area: '복현동',
    future: true,
  },
  {
    id: 10,
    title: '산책할 때 운동화와 모자',
    size: 110,
    price: 17000,
    image: 10,
    category: '잡화',
    condition: '사용감 있어요',
    area: '대현동',
  },
  {
    id: 11,
    title: '시원한 여름 상하의',
    size: 100,
    price: 15000,
    image: 11,
    category: '꾸러미',
    condition: '작은 얼룩 있어요',
    area: '칠성동',
  },
  {
    id: 12,
    title: '살랑이는 가디건과 치마',
    size: 120,
    price: 23000,
    image: 12,
    category: '꾸러미',
    condition: '깨끗해요',
    area: '고성동',
  },
];
type Memory = {
  likes: number[];
  waits: number[];
  owned: number[];
  sold: number[];
  outgrown: boolean;
  listed: boolean;
  ready: boolean;
  size: number;
  customTitle: string;
  purchased: Record<number, number[]>;
};
const initial: Memory = {
  likes: [],
  waits: [],
  owned: [7, 8],
  sold: [],
  outgrown: false,
  listed: false,
  ready: false,
  size: 110,
  customTitle: '110호 가을옷 세 벌',
  purchased: {},
};
const key = 'jaram-prototype-v3';
const money = (n: number) => n.toLocaleString('ko-KR') + '원';
const visual = (p: Item) => (
  <div
    role="img"
    aria-label={p.title}
    className="j-photo"
    style={{
      backgroundImage: `url('/used-clothes${p.image > 6 ? '-2' : '-1'}.png')`,
      backgroundPosition: `${((p.image - 1) % 3) * 50}% ${Math.floor(((p.image - 1) % 6) / 3) * 100}%`,
    }}
  />
);
const navs = [
  ['home', '홈', Home],
  ['waitlist', '기다림', Clock],
  ['sell', '옷 등록', Plus],
  ['closet', '옷장', Shirt],
] as const;
export default function Market() {
  const [m, setM] = useState<Memory>(initial),
    [loaded, setLoaded] = useState(false),
    [route, setRoute] = useState('home'),
    [selected, setSelected] = useState(1),
    [filter, setFilter] = useState('전체'),
    [query, setQuery] = useState(''),
    [onlyLikes, setOnlyLikes] = useState(false),
    [modal, setModal] = useState(''),
    [notice, setNotice] = useState(''),
    [step, setStep] = useState(0),
    [progress, setProgress] = useState(0),
    [answer, setAnswer] = useState(''),
    [labelSize, setLabelSize] = useState('110'),
    [title, setTitle] = useState(initial.customTitle),
    [picked, setPicked] = useState<number[]>([0, 1]),
    [uploaded, setUploaded] = useState<string[]>([]),
    [condition, setCondition] = useState(false),
    [resell, setResell] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const p = catalog.find((x) => x.id === selected) || catalog[0];
  const update = (v: Partial<Memory>) => setM((old) => ({ ...old, ...v }));
  const toast = (s: string) => {
    setNotice(s);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setNotice(''), 3000);
  };
  const go = (r: string) => {
    setRoute(r);
    window.location.hash = '/' + r;
    setModal('');
    scroll.current?.scrollTo({ top: 0 });
  };
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (saved && Array.isArray(saved.owned) && Array.isArray(saved.waits))
        setM({ ...initial, ...saved });
    } catch {}
    setLoaded(true);
    const onHash = () =>
      setRoute(window.location.hash.replace('#/', '').split('/')[0] || 'home');
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(key, JSON.stringify(m));
      } catch {}
  }, [m, loaded]);
  useEffect(() => {
    if (step !== 1) return;
    const timer = setInterval(
      () =>
        setProgress((v) => {
          if (v >= 3) {
            setStep(2);
            return 3;
          }
          return v + 1;
        }),
      650,
    );
    return () => clearInterval(timer);
  }, [step]);
  useEffect(
    () => () => {
      uploaded.forEach(URL.revokeObjectURL);
    },
    [uploaded],
  );
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement;
    const sheet = document.querySelector<HTMLElement>('.j-sheet');
    const focusables = () =>
      Array.from(
        sheet?.querySelectorAll<HTMLElement>(
          'button:not(:disabled),input,a[href]',
        ) || [],
      );
    focusables()[0]?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal('');
      if (e.key === 'Tab') {
        const nodes = focusables(),
          first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      previous?.focus();
    };
  }, [modal]);
  const open = (item: Item) => {
    setSelected(item.id);
    setPicked(
      [0, 1, 2]
        .filter((i) => !(m.purchased[item.id] || []).includes(i))
        .slice(0, 2),
    );
    setCondition(false);
    go('detail');
  };
  const toggle = (field: 'likes' | 'waits', id: number) =>
    setM((old) => ({
      ...old,
      [field]: old[field].includes(id)
        ? old[field].filter((x) => x !== id)
        : [...old[field], id],
    }));
  const startSell = (reuse = false) => {
    setResell(reuse);
    setStep(reuse ? 2 : 0);
    setProgress(0);
    setLabelSize('110');
    setAnswer(reuse ? '없어요' : '');
    setTitle(initial.customTitle);
    go('sell');
  };
  const pieces = [
    { title: '첫 번째 옷', price: Math.round((p.price * 0.38) / 1000) * 1000 },
    { title: '두 번째 옷', price: Math.round((p.price * 0.34) / 1000) * 1000 },
    { title: '세 번째 옷', price: Math.round((p.price * 0.28) / 1000) * 1000 },
  ];
  const cost = quote(picked.map((i) => pieces[i]));
  const list = available(catalog, m.sold).filter(
    (x) =>
      (filter === '전체' ||
        String(x.size) === filter ||
        x.category === filter) &&
      (!onlyLikes || m.likes.includes(x.id)) &&
      (!query || `${x.title} ${x.size} ${x.category}`.includes(query)),
  );
  const card = (item: Item) => (
    <article className="j-card" key={item.id}>
      <button className="j-card-img" onClick={() => open(item)}>
        {visual(item)}
        <span className={'j-photo-tag ' + (item.future ? 'future' : '')}>
          {item.future ? '다음 순환 기다림' : item.size + '호'}
        </span>
      </button>
      <button
        className={'j-heart ' + (m.likes.includes(item.id) ? 'selected' : '')}
        aria-label={m.likes.includes(item.id) ? '찜 해제' : '찜하기'}
        onClick={() => toggle('likes', item.id)}
      >
        <Heart size={18} />
      </button>
      <button className="j-card-copy" onClick={() => open(item)}>
        <span className="j-meta">
          {item.area} · {item.condition}
        </span>
        <h3>{item.title}</h3>
        <strong>
          {money(item.price)}
          {item.future && <small> 예상</small>}
        </strong>
      </button>
    </article>
  );
  const head = (label: string, back = false) => (
    <header className="j-header">
      {back ? (
        <>
          <button
            className="j-icon"
            aria-label="뒤로가기"
            onClick={() => go('home')}
          >
            <ArrowLeft />
          </button>
          <strong>{label}</strong>
        </>
      ) : (
        <a className="j-brand" href="#/home">
          <img src="/favicon.svg" alt="" />
          <span>자람마을</span>
        </a>
      )}
      <div className="j-header-actions">
        <button
          className={'j-icon ' + (onlyLikes ? 'selected' : '')}
          aria-label="찜한 옷 보기"
          onClick={() => {
            setOnlyLikes(!onlyLikes);
            go('home');
          }}
        >
          <Heart size={22} />
        </button>
        <button
          className="j-icon j-bell"
          aria-label="알림 열기"
          onClick={() => setModal('notifications')}
        >
          <Bell size={22} />
          {m.waits.length > 0 && <i />}
        </button>
      </div>
    </header>
  );
  return (
    <main className="j-stage">
      <aside className="j-companion">
        <a className="j-brand" href="#/home">
          <img src="/favicon.svg" alt="" />
          <span>자람마을</span>
        </a>
        <span className="j-overline">아이와 함께, 옷도 자라는 방법</span>
        <h1>
          작아진 옷의
          <br />
          다음 이야기를
          <br />
          <em>이어주세요.</em>
        </h1>
        <p>
          한 번 만난 옷이 다음 아이에게.
          <br />
          우리 아이의 다음 옷은 미리 기다려요.
        </p>
        <div className="j-desktop-path">
          {[
            ['01', '우리 아이에게 맞는 옷 찾기', 'home'],
            ['02', '다음 사이즈 미리 기다리기', 'waitlist'],
            ['03', '작아진 옷, 다시 보내기', 'closet'],
          ].map(([n, t, r]) => (
            <button
              key={n}
              className={route === r ? 'active' : ''}
              onClick={() => go(r)}
            >
              <span>{n}</span>
              {t}
              <ChevronRight size={17} />
            </button>
          ))}
        </div>
        <div className="j-companion-foot">
          <Leaf size={18} />
          <span>옷 하나의 끝이, 다른 아이의 시작으로.</span>
        </div>
      </aside>
      <section className="j-phone" aria-label="자람마을 앱">
        <div className="j-device-bar">
          <span>9:41</span>
          <span className="j-island" />
          <span>LTE ▰</span>
        </div>
        <div ref={scroll} className="j-scroll">
          {route === 'home' && (
            <>
              {head('홈')}
              <div className="j-content">
                <div className="j-location">
                  <MapPin size={14} /> 대구 북구 침산동{' '}
                  <span>우리 동네 옷을 이어요</span>
                </div>
                <label className="j-search">
                  <Search size={20} />
                  <input
                    aria-label="옷 검색"
                    placeholder="어떤 옷을 찾으세요?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button
                      aria-label="검색 지우기"
                      onClick={() => setQuery('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </label>
                <section className="j-growth-card">
                  <div>
                    <span className="j-eyebrow">도윤이의 가을 준비</span>
                    <h2>
                      지금은 {m.size}호,
                      <br />
                      다음 옷은 미리.
                    </h2>
                    <button onClick={() => go('waitlist')}>
                      다음 옷 살펴보기 <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="j-growth-photo">
                    {visual(catalog[7])}
                    <span>
                      {m.size} <ArrowRight size={12} /> {m.size + 10}
                    </span>
                  </div>
                </section>
                <button
                  className="j-reminder"
                  onClick={() => {
                    go('closet');
                    setModal('growth');
                  }}
                >
                  <div className="j-circle">
                    <Shirt size={21} />
                  </div>
                  <div>
                    <strong>
                      {m.outgrown
                        ? '작아진 옷, 다음 아이가 기다려요'
                        : '지난번 산 옷, 아직 잘 맞나요?'}
                    </strong>
                    <span>
                      {m.outgrown
                        ? '옷장에서 다시 판매할 수 있어요'
                        : '한 번 확인하면 다음 옷을 찾기 쉬워요'}
                    </span>
                  </div>
                  <ChevronRight size={17} />
                </button>
                <div className="j-section-title">
                  <h2>{onlyLikes ? '찜한 옷' : '우리 아이에게, 다음 옷'}</h2>
                  <button aria-label="필터" onClick={() => setModal('filters')}>
                    <SlidersHorizontal size={18} />
                  </button>
                </div>
                <div className="j-chips">
                  {['전체', '100', '110', '120', '상의', '아우터'].map((f) => (
                    <button
                      key={f}
                      className={filter === f ? 'active' : ''}
                      onClick={() => setFilter(f)}
                    >
                      {/^\d+$/.test(f) ? f + '호' : f}
                    </button>
                  ))}
                </div>
                {m.listed && (
                  <button className="j-listed" onClick={() => go('closet')}>
                    <CheckCircle2 size={18} />
                    <span>{m.customTitle} 등록 완료</span>
                    <ChevronRight size={16} />
                  </button>
                )}
                <div className="j-grid">{list.map(card)}</div>
                {!list.length && (
                  <div className="j-empty">
                    <Search />
                    <h3>아직 맞는 옷이 없어요</h3>
                    <p>필터를 바꾸거나 다음 옷을 기다려보세요.</p>
                    <button
                      className="j-primary"
                      onClick={() => {
                        setQuery('');
                        setFilter('전체');
                        setOnlyLikes(false);
                      }}
                    >
                      전체 옷 보기
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          {route === 'detail' && (
            <>
              {head('옷 자세히 보기', true)}
              <div className="j-detail-photo">
                {visual(p)}
                <span>
                  {p.future
                    ? '지금은 다른 아이가 입고 있어요'
                    : '낱개도, 함께도 구매할 수 있어요'}
                </span>
              </div>
              <div className="j-content">
                <div className="j-seller">
                  <span className="j-avatar">이</span>
                  <div>
                    <strong>이음이네</strong>
                    <span>{p.area} · 동네 보호자</span>
                  </div>
                  <span className="j-pill">
                    <ShieldCheck size={13} /> 상태 고지
                  </span>
                </div>
                <div className="j-chips">
                  <span>{p.size}호</span>
                  <span>{p.condition}</span>
                </div>
                <h1 className="j-page-title">{p.title}</h1>
                <p className="j-body-copy">
                  한 계절 잘 입힌 옷이에요. 마음에 드는 옷만 골라도 좋아요. 구매
                  전 소매와 라벨, 사용감을 확인해주세요.
                </p>
                <div className="j-fit">
                  <Shirt size={19} />
                  <div>
                    <strong>
                      {p.size === m.size
                        ? '현재 입는 사이즈와 같아요'
                        : '다음 사이즈 후보예요'}
                    </strong>
                    <p>
                      현재 {m.size}호 착용 기록 기준 · 실측 확인이 필요해요.
                    </p>
                  </div>
                </div>
                {p.future && !m.ready ? (
                  <>
                    <h2 className="j-section-heading">
                      작아지면, 우리 아이에게
                    </h2>
                    <div className="j-timeline">
                      <p>
                        <CheckCircle2 /> 이전 아이에게 구매
                      </p>
                      <p>
                        <Shirt /> 지금은 이음이네가 입는 중
                      </p>
                      <p>
                        <Clock /> 다음 순환 때 알려드릴게요
                      </p>
                    </div>
                    <p className="j-body-copy">
                      기다림은 예약이나 결제가 아니에요. 판매자가 결정하면 새
                      사진과 가격을 확인할 수 있어요.
                    </p>
                    <button
                      className="j-primary"
                      onClick={() => {
                        toggle('waits', p.id);
                        toast(
                          m.waits.includes(p.id)
                            ? '기다림을 해제했어요'
                            : '작아지면 알려드릴게요',
                        );
                      }}
                    >
                      {m.waits.includes(p.id)
                        ? '기다림 해제'
                        : '작아지면 알려주세요'}{' '}
                      <Bell size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="j-section-title">
                      <h2>원하는 옷만 골라요</h2>
                      <span>2벌부터 10% 할인</span>
                    </div>
                    {pieces.map((part, i) =>
                      (m.purchased[p.id] || []).includes(i) ? null : (
                        <label className="j-piece" key={i}>
                          <input
                            type="checkbox"
                            checked={picked.includes(i)}
                            onChange={() =>
                              setPicked((v) =>
                                v.includes(i)
                                  ? v.filter((n) => n !== i)
                                  : [...v, i],
                              )
                            }
                          />
                          <Shirt size={22} />
                          <span>
                            {part.title}
                            <small>
                              {i === 2
                                ? '소매에 작은 사용 흔적'
                                : '눈에 띄는 오염 없음'}
                            </small>
                          </span>
                          <strong>{money(part.price)}</strong>
                        </label>
                      ),
                    )}
                    <div className="j-total">
                      <span>선택한 {picked.length}벌</span>
                      <strong>{money(cost.total)}</strong>
                      {cost.discount > 0 && (
                        <small>
                          함께 구매해서 {money(cost.discount)} 아껴요
                        </small>
                      )}
                    </div>
                    <button
                      className="j-primary"
                      disabled={!picked.length || m.sold.includes(p.id)}
                      onClick={() => setModal('purchase')}
                    >
                      {m.sold.includes(p.id)
                        ? '내 옷장에 담긴 옷'
                        : '선택한 옷 구매하기'}
                      <ArrowRight size={18} />
                    </button>
                  </>
                )}
                <button
                  className="j-outline"
                  onClick={() => {
                    if (!m.waits.includes(p.id)) toggle('waits', p.id);
                    go('waitlist');
                  }}
                >
                  이 옷의 다음 순환 기다리기
                </button>
              </div>
            </>
          )}
          {route === 'waitlist' && (
            <>
              {head('기다림')}
              <div className="j-content">
                <span className="j-overline">다음 아이의 옷장</span>
                <h1 className="j-page-title">
                  지금 없어도,
                  <br />
                  미리 기다릴 수 있어요.
                </h1>
                <p className="j-body-copy">
                  다른 아이가 입고 있는 옷도
                  <br />
                  우리 아이의 다음 옷이 될 수 있으니까요.
                </p>
                <button
                  className="j-wait-condition"
                  onClick={() => setModal('filters')}
                >
                  <div>
                    <span>도윤이의 다음 사이즈</span>
                    <strong>{m.size + 10}호 · 가을·겨울</strong>
                  </div>
                  <SlidersHorizontal size={19} />
                </button>
                <div className="j-section-title">
                  <h2>내가 기다리는 옷</h2>
                  <span>{m.waits.length}개</span>
                </div>
                {m.waits.length ? (
                  m.waits.map((id) => {
                    const x = catalog.find((c) => c.id === id)!;
                    return (
                      <div className="j-wait-row" key={id}>
                        <button onClick={() => open(x)}>{visual(x)}</button>
                        <div>
                          <span className="j-eyebrow">
                            {m.ready
                              ? '판매 준비가 되었어요'
                              : '다음 순환 대기 중'}
                          </span>
                          <h3>{x.title}</h3>
                          <small>
                            {x.size}호 · {x.area}
                          </small>
                          <button
                            className="j-text-button"
                            onClick={() =>
                              m.ready ? open(x) : toggle('waits', id)
                            }
                          >
                            {m.ready ? '새 상태 확인하기' : '기다림 해제'}{' '}
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="j-empty compact">
                    <Clock />
                    <h3>기다리는 옷을 담아주세요</h3>
                    <p>판매가 시작되면 알림으로 이어드려요.</p>
                  </div>
                )}
                {m.waits.length > 0 && !m.ready && (
                  <button
                    className="j-outline"
                    onClick={() => {
                      update({ ready: true });
                      toast('예시 알림: 기다리던 옷의 판매 준비가 끝났어요');
                    }}
                  >
                    판매 소식 확인 <Bell size={16} />
                  </button>
                )}
                <div className="j-section-title">
                  <h2>다음 순환을 기다리는 옷</h2>
                </div>
                <div className="j-grid">
                  {catalog
                    .filter((x) => x.future && !m.sold.includes(x.id))
                    .map(card)}
                </div>
              </div>
            </>
          )}
          {route === 'closet' && (
            <>
              {head('옷장')}
              <div className="j-content">
                <div className="j-closet-title">
                  <div>
                    <span className="j-overline">아이와 함께 쌓이는 기록</span>
                    <h1 className="j-page-title">도윤이의 옷장</h1>
                  </div>
                  <span className="j-profile">도</span>
                </div>
                <div className="j-statline">
                  <span>
                    <b>{m.owned.length}</b> 입고 있는 옷
                  </span>
                  <span>
                    <b>{m.waits.length}</b> 기다리는 옷
                  </span>
                  <span>
                    <b>{m.listed ? 1 : 0}</b> 판매 중
                  </span>
                </div>
                <section className="j-closet-check">
                  <span className="j-eyebrow">
                    {m.outgrown ? '다음 순환 준비' : '성장 확인'}
                  </span>
                  <h2>
                    {m.outgrown
                      ? '작아진 옷도, 누군가에겐 딱 맞아요.'
                      : '지난번 산 바람막이, 소매는 잘 맞나요?'}
                  </h2>
                  <p>
                    {m.outgrown
                      ? '기존 정보는 그대로. 달라진 상태만 확인해주세요.'
                      : '아이 키를 다시 재지 않아도 괜찮아요.'}
                  </p>
                  <button
                    className="j-primary"
                    onClick={() =>
                      m.outgrown ? startSell(true) : setModal('growth')
                    }
                  >
                    {m.outgrown ? '이 옷 다시 판매하기' : '착용 상태 확인하기'}
                    <ArrowRight size={17} />
                  </button>
                </section>
                <div className="j-section-title">
                  <h2>지금 입고 있어요</h2>
                  <span>{m.size}호</span>
                </div>
                <div className="j-grid">
                  {catalog.filter((x) => m.owned.includes(x.id)).map(card)}
                </div>
                {m.listed && (
                  <section className="j-sale-record">
                    <PackageCheck />
                    <div>
                      <span className="j-eyebrow">판매 중</span>
                      <h3>{m.customTitle}</h3>
                      <p>낱개·소묶음 구매 가능 · 상태 확인 완료</p>
                    </div>
                  </section>
                )}
                <div className="j-closet-note">
                  <Leaf />
                  <div>
                    <strong>다시 올릴 때 처음부터 쓰지 않아요.</strong>
                    <p>구매한 옷의 정보가 다음 순환에도 이어져요.</p>
                  </div>
                </div>
              </div>
            </>
          )}
          {(route === 'sell' || route === 'review') && (
            <>
              {head('옷 한 번에 등록', true)}
              <div className="j-content">
                <div className="j-steps">
                  {['사진', '정보 확인', '판매 등록'].map((x, i) => (
                    <span
                      key={x}
                      className={
                        i === (step < 2 ? 0 : step === 2 ? 1 : 2)
                          ? 'active'
                          : ''
                      }
                    >
                      <b>{i + 1}</b>
                      {x}
                    </span>
                  ))}
                </div>
                {step === 0 && (
                  <>
                    <h1 className="j-page-title">
                      작아진 옷,
                      <br />한 번에 올려주세요.
                    </h1>
                    <p className="j-body-copy">
                      펼쳐 찍은 사진과 라벨 사진을 준비해주세요.
                      <br />
                      같이 올려도, 원하는 옷만 살 수 있어요.
                    </p>
                    <label className="j-upload">
                      <Camera size={36} />
                      <strong>사진 선택하기</strong>
                      <span>최대 6장 · 기기에서만 미리보기</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                            .filter(
                              (f) =>
                                f.type.startsWith('image/') &&
                                f.size <= 10485760,
                            )
                            .slice(0, 6);
                          setUploaded(files.map((f) => URL.createObjectURL(f)));
                          if (!files.length)
                            toast('10MB 이하 이미지 파일을 선택해주세요');
                        }}
                      />
                    </label>
                    {uploaded.length > 0 && (
                      <div className="j-uploaded">
                        {uploaded.map((src, i) => (
                          <img
                            key={src}
                            src={src}
                            alt={`선택한 사진 ${i + 1}`}
                          />
                        ))}
                      </div>
                    )}
                    <div className="j-demo-note">
                      <strong>AI 분석 미리보기</strong>
                      <p>
                        예시 옷으로 진행되는 시뮬레이션이에요. 내 사진은 기기에서만 확인할 수 있어요.
                      </p>
                    </div>
                    <button
                      className="j-primary"
                      onClick={() => {
                        setProgress(0);
                        setStep(1);
                      }}
                    >
                      예시 옷 분석하기 <ArrowRight size={18} />
                    </button>
                  </>
                )}
                {step === 1 && (
                  <div className="j-analyzing">
                    <div className="j-scanner">
                      {visual(catalog[0])}
                      <div />
                    </div>
                    <h2>옷의 정보를 정리하고 있어요</h2>
                    <p>준비된 예시를 분석하는 과정이에요.</p>
                    {[
                      '옷 3벌 구분하기',
                      '라벨과 사이즈 확인하기',
                      '확인이 필요한 부분 찾기',
                      '판매글 초안 준비하기',
                    ].map((s, i) => (
                      <div key={s} className={i <= progress ? 'done' : ''}>
                        {i < progress ? (
                          <CheckCircle2 size={18} />
                        ) : i === progress ? (
                          <LoaderCircle className="j-spin" size={18} />
                        ) : (
                          <span className="j-hollow" />
                        )}
                        {s}
                      </div>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <>
                    <span className="j-overline">
                      {resell ? '옷장 정보를 불러왔어요' : '예시 분석 결과'}
                    </span>
                    <h1 className="j-page-title">
                      {resell
                        ? '입던 옷의 기록이 있어요.'
                        : '세 벌을 찾았어요.'}
                      <br />두 가지만 확인해주세요.
                    </h1>
                    <div className="j-result-preview">
                      {visual(catalog[resell ? 7 : 0])}
                      <div>
                        <strong>
                          {resell
                            ? '가볍게 입는 바람막이'
                            : '니트 · 맨투맨 · 가디건'}
                        </strong>
                        <span>
                          {resell ? '지난봄 구매 · 110호' : '가을용 상의 세 벌'}
                        </span>
                        <span className="j-pill">
                          <Check size={13} /> 품목 · 색상 정리 완료
                        </span>
                      </div>
                    </div>
                    <section className="j-question">
                      <span>01 · 사이즈</span>
                      <h3>라벨에 적힌 사이즈가 맞나요?</h3>
                      <div className="j-choices">
                        {['100', '110', '120'].map((s) => (
                          <button
                            key={s}
                            className={labelSize === s ? 'active' : ''}
                            onClick={() => setLabelSize(s)}
                          >
                            {s}호
                          </button>
                        ))}
                      </div>
                    </section>
                    <section className="j-question">
                      <span>02 · 상태</span>
                      <h3>소매에 얼룩이 있나요?</h3>
                      <p>확정하기 어려운 부분은 직접 확인해요.</p>
                      <div className="j-choices">
                        {['없어요', '작은 얼룩 있어요'].map((s) => (
                          <button
                            key={s}
                            className={answer === s ? 'active' : ''}
                            onClick={() => setAnswer(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </section>
                    <button
                      className="j-primary"
                      disabled={!answer}
                      onClick={() => {
                        setTitle(
                          resell
                            ? `${labelSize}호 바람막이 다시 보내요`
                            : `${labelSize}호 가을옷 세 벌`,
                        );
                        setStep(3);
                      }}
                    >
                      확인한 정보로 판매글 만들기 <ArrowRight size={18} />
                    </button>
                  </>
                )}
                {step === 3 && (
                  <>
                    <span className="j-overline">마지막 확인</span>
                    <h1 className="j-page-title">
                      이대로 다음 아이에게
                      <br />
                      보내볼까요?
                    </h1>
                    <label className="j-field">
                      판매글 제목
                      <input
                        value={title}
                        maxLength={60}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </label>
                    <div className="j-summary">
                      <p>
                        <span>구성</span>
                        <strong>
                          {resell ? '바람막이 1벌' : '상의 3벌'} · {labelSize}호
                        </strong>
                      </p>
                      <p>
                        <span>상태</span>
                        <strong>
                          {answer === '없어요'
                            ? '눈에 띄는 얼룩 없음'
                            : '소매에 작은 얼룩'}
                        </strong>
                      </p>
                      <p>
                        <span>판매 방식</span>
                        <strong>낱개 · 소묶음 가능</strong>
                      </p>
                      <p>
                        <span>전체 예상가격</span>
                        <strong>
                          {money(
                            resell
                              ? answer === '없어요'
                                ? 12000
                                : 10000
                              : answer === '없어요'
                                ? 27000
                                : 24000,
                          )}
                        </strong>
                      </p>
                    </div>
                    <p className="j-body-copy">
                      {resell
                        ? '옷장에 기록된 바람막이를 다시 판매합니다.'
                        : answer === '없어요'
                          ? '한 계절 입힌 가을 상의 세 벌입니다.'
                          : '가디건 소매에 작은 얼룩이 있어 가격에 반영했습니다.'}{' '}
                      원하는 옷만 선택할 수 있고, 2벌부터 10% 할인해요.
                    </p>
                    <button
                      className="j-primary"
                      disabled={!title.trim()}
                      onClick={() => {
                        update({
                          listed: true,
                          customTitle: title.trim(),
                          ...(resell
                            ? {
                                owned: m.owned.filter((id) => id !== 8),
                                outgrown: false,
                              }
                            : {}),
                        });
                        setStep(4);
                      }}
                    >
                      판매글 등록하기 <Check size={18} />
                    </button>
                    <button className="j-outline" onClick={() => setStep(2)}>
                      정보 다시 확인
                    </button>
                  </>
                )}
                {step === 4 && (
                  <div className="j-success">
                    <div className="j-success-icon">
                      <Check size={36} />
                    </div>
                    <span className="j-overline">다음 순환이 시작됐어요</span>
                    <h1>
                      다음 아이를
                      <br />
                      만날 준비 끝.
                    </h1>
                    <p>
                      등록한 옷은 내 옷장에서 관리할 수 있어요.
                      <br />
                      이제 다음 옷도 찾아볼까요?
                    </p>
                    <button
                      className="j-primary"
                      onClick={() => go('waitlist')}
                    >
                      다음 사이즈 기다리기 <ArrowRight size={18} />
                    </button>
                    <button className="j-outline" onClick={() => go('closet')}>
                      내 옷장에서 확인
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <nav className="j-nav" aria-label="주요 메뉴">
          {navs.map(([r, name, Icon]) => (
            <button
              key={r}
              className={route === r ? 'active' : ''}
              onClick={() => (r === 'sell' ? startSell() : go(r))}
            >
              <Icon size={23} />
              <span>{name}</span>
            </button>
          ))}
        </nav>
        {notice && (
          <div className="j-toast" role="status">
            {notice}
          </div>
        )}
        {modal && (
          <div className="j-overlay" onClick={() => setModal('')}>
            <section
              className="j-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="sheet-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="j-sheet-handle" />
              <button
                className="j-sheet-close j-icon"
                aria-label="닫기"
                onClick={() => setModal('')}
              >
                <X />
              </button>
              {modal === 'growth' && (
                <>
                  <span className="j-overline">성장 옷장 업데이트</span>
                  <h2 id="sheet-title">
                    지난번 바람막이,
                    <br />
                    손목이 보이나요?
                  </h2>
                  <div className="j-sheet-photo">{visual(catalog[7])}</div>
                  <p>110호 · 지난봄 구매한 옷을 기준으로 확인해요.</p>
                  <button
                    className="j-primary"
                    onClick={() => {
                      update({ outgrown: true, size: 120 });
                      setModal('');
                      toast('다음 사이즈를 120호로 준비할게요');
                    }}
                  >
                    네, 소매가 짧아졌어요
                  </button>
                  <button
                    className="j-outline"
                    onClick={() => {
                      update({ outgrown: false, size: 110 });
                      setModal('');
                      toast('아직 잘 맞는 옷으로 기록했어요');
                    }}
                  >
                    아니요, 아직 잘 맞아요
                  </button>
                </>
              )}
              {modal === 'purchase' && (
                <>
                  <span className="j-overline">구매 확인</span>
                  <h2 id="sheet-title">
                    선택한 {picked.length}벌을
                    <br />내 옷장에 담을까요?
                  </h2>
                  <div className="j-summary">
                    <p>
                      <span>상품 합계</span>
                      <strong>{money(cost.subtotal)}</strong>
                    </p>
                    <p>
                      <span>함께 구매 할인</span>
                      <strong>−{money(cost.discount)}</strong>
                    </p>
                    <p>
                      <span>총 상품금액</span>
                      <strong>{money(cost.total)}</strong>
                    </p>
                  </div>
                  <label className="j-consent">
                    <input
                      type="checkbox"
                      checked={condition}
                      onChange={(e) => setCondition(e.target.checked)}
                    />
                    고지된 사용감과 얼룩 여부를 확인했어요.
                  </label>
                  <p className="j-meta">
                    실제 결제나 거래 요청은 발생하지 않아요.
                  </p>
                  <button
                    className="j-primary"
                    disabled={!condition}
                    onClick={() => {
                      setM((old) => {
                        const taken = [
                          ...new Set([
                            ...(old.purchased[p.id] || []),
                            ...picked,
                          ]),
                        ];
                        return {
                          ...old,
                          owned: [...new Set([...old.owned, p.id])],
                          purchased: { ...old.purchased, [p.id]: taken },
                          sold:
                            taken.length === 3
                              ? [...new Set([...old.sold, p.id])]
                              : old.sold,
                          waits: old.waits.filter((id) => id !== p.id),
                        };
                      });
                      go('closet');
                      toast('구매한 옷이 성장 옷장에 기록됐어요');
                    }}
                  >
                    내 옷장에 담기 <PackageCheck size={18} />
                  </button>
                </>
              )}
              {modal === 'notifications' && (
                <>
                  <h2 id="sheet-title">새로운 소식</h2>
                  <button
                    className="j-notification"
                    onClick={() => {
                      go('closet');
                      setModal('growth');
                    }}
                  >
                    <Shirt />
                    <span>
                      <strong>지난번 산 옷은 잘 맞나요?</strong>
                      <small>
                        착용 상태를 확인하고 다음 사이즈를 준비해요.
                      </small>
                    </span>
                  </button>
                  {m.waits.length > 0 && (
                    <button
                      className="j-notification"
                      onClick={() => go('waitlist')}
                    >
                      <Bell />
                      <span>
                        <strong>
                          {m.ready
                            ? '기다리던 옷이 판매 준비됐어요'
                            : '다음 순환을 기다리고 있어요'}
                        </strong>
                        <small>
                          {m.waits.length}개의 옷에 기다림을 남겼어요.
                        </small>
                      </span>
                    </button>
                  )}
                </>
              )}
              {modal === 'filters' && (
                <>
                  <h2 id="sheet-title">우리 아이 사이즈</h2>
                  <p>현재 잘 맞는 옷의 사이즈를 골라주세요.</p>
                  <div className="j-choices">
                    {[100, 110, 120].map((s) => (
                      <button
                        className={m.size === s ? 'active' : ''}
                        key={s}
                        onClick={() => update({ size: s })}
                      >
                        {s}호
                      </button>
                    ))}
                  </div>
                  <button
                    className="j-primary"
                    onClick={() => {
                      setFilter(String(m.size));
                      setModal('');
                      toast('선택한 사이즈를 반영했어요');
                    }}
                  >
                    적용하기
                  </button>
                </>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
