import { useState } from 'react';
import { FAQItem } from '../ui/FAQItem';
import { SectionTitle } from '../ui/SectionTitle';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQProps {
  subtitle: string;
  faqs: FAQ[];
}

/**
 * FAQ Section
 * Block: faq
 * Element: faq__list
 */
export function FAQ({ subtitle, faqs }: FAQProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="faq py-24 bg-zinc-950 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle align="center" subtitle={subtitle}>
          Perguntas Frequentes
        </SectionTitle>

        <div className="faq__list border-t border-white/10">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaqIndex === index}
              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
