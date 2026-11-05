import { Hero } from '@/components/home/Hero';
import { IngredientMarquee } from '@/components/home/IngredientMarquee';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Manifesto } from '@/components/home/Manifesto';
import { FeaturedRoutes } from '@/components/home/FeaturedRoutes';
import { Story } from '@/components/home/Story';
import { FAQ } from '@/components/home/FAQ';
import { MomentsGallery } from '@/components/home/MomentsGallery';
import { FinalCTA } from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <IngredientMarquee />
      <HowItWorks />
      <Manifesto />
      <FeaturedRoutes />
      <Story />
      <FAQ />
      <MomentsGallery />
      <FinalCTA />
    </>
  );
}
