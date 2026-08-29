import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '자람마을 | 아동복 성장순환 데모',
  description: '사진 한 번으로 성장꾸러미를 만들고 다음 사이즈 구매까지 연결하는 자람마을 모바일 데모',
  icons: { icon: '/favicon.svg', apple: '/jarammaeul-symbol.png' },
  openGraph: { title: '자람마을 | 아동복 성장순환 데모', description: '작아진 옷은 보내고, 다음 옷을 맞이하는 생활권 아동복 순환서비스', images: ['/jarammaeul-logo.png'] },
  twitter: { card: 'summary_large_image', title: '자람마을 | 아동복 성장순환 데모', description: '작아진 옷은 보내고, 다음 옷을 맞이하는 생활권 아동복 순환서비스', images: ['/jarammaeul-logo.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
