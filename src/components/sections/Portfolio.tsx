import { Carousel } from '../ui/Carousel';
import { SectionTitle } from '../ui/SectionTitle';

interface PortfolioItem {
  title: string;
  img: string;
}

interface PortfolioProps {
  subtitle: string;
  sites: PortfolioItem[];
  logos: PortfolioItem[];
  posts: PortfolioItem[];
}

/**
 * Portfolio Section
 * Block: portfolio
 * Element: portfolio__grid
 */
export function Portfolio({ subtitle, sites, logos, posts }: PortfolioProps) {
  return (
    <section id="portfolio" className="portfolio py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle={subtitle}>
          Trabalhos Recentes
        </SectionTitle>

        <div className="portfolio__grid grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Carousel title="Sites & Sistemas" items={sites} />
          <Carousel title="Identidade Visual & Logos" items={logos} />
          <Carousel title="Social Media & Posts" items={posts} />
        </div>
      </div>
    </section>
  );
}
