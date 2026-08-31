import { unstable_setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Stakes from '@/components/Stakes';
import Powers from '@/components/Powers';
import Mechanics from '@/components/Mechanics';
import Protocol from '@/components/Protocol';
import Silicon from '@/components/Silicon';
import Live from '@/components/Live';
import Closing from '@/components/Closing';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Reveal />
      <Nav />
      <Hero />
      <Stakes />
      <hr className="divider" />
      <Powers />
      <hr className="divider" />
      <Mechanics />
      <hr className="divider" />
      <Protocol />
      <hr className="divider" />
      <Silicon />
      <hr className="divider" />
      <Live />
      <hr className="divider" />
      <Closing />
      <Footer />
      <div className="big-foot">SOVEREIGNTY IS CODE</div>
    </>
  );
}
