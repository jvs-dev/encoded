import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Typewriter } from "../ui/Typewriter";

interface HeroProps {
  subtitle: string;
  videoUrl?: string;
  onTrackClick: (label: string) => void;
}

/**
 * Hero Section
 */
export function Hero({ subtitle, videoUrl, onTrackClick }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, [videoUrl]);

  return (
    <section
      id="home"
      className="hero relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden bg-[#0a070e] flex flex-col justify-center min-h-[75vh]"
    >
      <div className="hero__bg absolute inset-0 z-0">
        <video
          ref={videoRef}
          key={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40 grayscale scale-x-[-1]"
        >
          <source src={videoUrl || "/videowork.mp4"} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"></div>
        <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[80%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[70%] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      </div>

      <div className="hero__content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full flex flex-col items-center text-center mt-12"
        >
          <h1 className="hero__title text-[60px] font-bold tracking-tighter leading-[1.1] mb-6 w-full">
            <Typewriter />
          </h1>

          <p className="hero__subtitle text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>

          <div className="hero__actions flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              onClick={() => onTrackClick("Solicitar Orçamento (Hero)")}
              href={`https://wa.me/5571991895994?text=${encodeURIComponent("Olá! Vi o site da INCODED e gostaria de impulsionar meu negócio com um projeto de alto nível.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center bg-primary text-white px-8 py-4 font-bold text-lg hover:bg-primary-dark transition-all group relative overflow-hidden active:scale-95 rounded-xl shadow-xl shadow-primary/20 w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              Iniciar um projeto
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              onClick={() => onTrackClick("Ver Serviços (Hero)")}
              href="#servicos"
              className="inline-flex justify-center items-center border border-white/20 text-white px-8 py-4 font-bold text-lg hover:bg-white/5 transition-colors active:scale-95 rounded-xl w-full sm:w-auto"
            >
              Ver portfólio
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?u=client${i}`}
                  alt={`Feedback de Cliente INCODED ${i}`}
                  className="w-10 h-10 rounded-full border-2 border-black object-cover z-10"
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-white">+30 empresas</p>
              <p className="text-xs text-gray-500">
                Impulsionadas pela nossa engenharia
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
