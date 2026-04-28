import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * SectionTitle Component
 * Block: section-title
 * Element: section-title__heading, section-title__subtitle
 */
export function SectionTitle({ children, subtitle, align = 'left', className = "" }: SectionTitleProps) {
  return (
    <div className={`section-title ${align === 'center' ? 'text-center' : ''} mb-12 ${className}`}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title__heading text-3xl md:text-5xl font-bold tracking-tight mb-6"
      >
        {children}
      </motion.h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`section-title__subtitle text-xl text-gray-400 max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
