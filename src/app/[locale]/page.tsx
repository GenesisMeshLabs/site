import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import TrustCycle from '@/components/TrustCycle';
import Stakes from '@/components/Stakes';
import Powers from '@/components/Powers';
import Mechanics from '@/components/Mechanics';
import Protocol from '@/components/Protocol';
import Silicon from '@/components/Silicon';
import LiveNetwork from '@/components/LiveNetwork';
import Closing from '@/components/Closing';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'footer' });

  return (
    <>
      <Reveal />
      <Nav />
      <Hero />
      <TrustCycle />
      <hr className="divider" />
      <Mechanics />
      <hr className="divider" />
      <LiveNetwork />
      <hr className="divider" />
      <Protocol />
      <hr className="divider" />
      <Stakes />
      <hr className="divider" />
      <Powers />
      <hr className="divider" />
      <Silicon />
      <hr className="divider" />
      <Closing />
      <Footer />
      <div className="big-foot">{t('tagline')}</div>
    </>
  );
}
