import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface JobCardProps {
  icon: any;
  title: string;
  type: string;
  description: string;
  requirements: string[];
}

/**
 * JobCard Component
 * Block: job-card
 * Element: job-card__header, job-card__icon, job-card__title, job-card__type, job-card__content, job-card__list
 */
export function JobCard({ icon: Icon, title, type, description, requirements }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="job-card min-w-[85vw] sm:min-w-[350px] md:min-w-0 snap-start border border-white/10 bg-zinc-950 overflow-hidden transition-colors hover:border-white/20">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="job-card__header w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <div className="flex items-center space-x-4">
          <div className="job-card__icon p-3 bg-white/5 rounded-lg text-white">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="job-card__title text-lg font-bold text-white">{title}</h3>
            <span className="job-card__type text-xs font-medium text-gray-500 uppercase tracking-widest">{type}</span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="job-card__content border-t border-white/5"
          >
            <div className="p-6 pt-0 space-y-4">
              <p className="text-gray-400 leading-relaxed mt-4">
                {description}
              </p>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3">Requisitos:</h4>
                <ul className="job-card__list space-y-2">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4">
                <a 
                  href="https://wa.me/5571991895994" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white hover:underline"
                >
                  Candidatar-se via WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
