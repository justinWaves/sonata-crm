// apps/web/app/page.tsx
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturesGrid from '@/components/FeaturesGrid';
import PricingTable from '@/components/PricingTable';
import SocialProof from '@/components/SocialProof';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <>
      <Header showTechLogin={true} />
      <main>
        <Hero />
        <FeaturesGrid />
        <PricingTable />
        <SocialProof />
        <CTASection />
      </main>
    </>
  );
}
