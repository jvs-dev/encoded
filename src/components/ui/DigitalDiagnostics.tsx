import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const DigitalDiagnostics = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [businessInfo, setBusinessInfo] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAudit = async () => {
    if (!businessInfo.trim()) return;
    setIsLoading(true);
    setAnalysis('');

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessInfo }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (error) {
      setAnalysis('Ocorreu um erro na análise. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-2xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all group overflow-hidden"
        whileHover={{ y: -5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-400 to-primary opacity-0 group-hover:opacity-20 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700" />
        <Sparkles className="w-6 h-6" />
        <span className="absolute right-full mr-4 bg-white text-black px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          DIAGNÓSTICO DIGITAL IA
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#0a070e]/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-zinc-900 to-black">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Diagnóstico Digital IA</h3>
                    <p className="text-xs text-zinc-400">Powered by INCODED Strategy</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {!analysis && !isLoading ? (
                  <div className="space-y-6">
                    <p className="text-zinc-300">
                      Descreva seu negócio, seu site atual ou o principal desafio que você enfrenta no digital hoje. Nossa IA de estratégia analisará seu cenário instantaneamente.
                    </p>
                    <textarea
                      value={businessInfo}
                      onChange={(e) => setBusinessInfo(e.target.value)}
                      placeholder="Ex: Tenho uma loja de móveis de luxo em Salvador, mas meu site é lento e não recebo leads pelo Google..."
                      className="w-full h-40 bg-zinc-900 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    />
                    <button
                      onClick={handleAudit}
                      disabled={!businessInfo.trim()}
                      className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-all"
                    >
                      GERAR DIAGNÓSTICO <Send className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-zinc-400 animate-pulse">Processando dados e consultando algoritmos estratégicos...</p>
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none">
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6 markdown-body">
                           <ReactMarkdown>{analysis}</ReactMarkdown>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                          <button 
                            onClick={() => {
                              setAnalysis('');
                              setBusinessInfo('');
                            }}
                            className="flex-1 border border-white/10 py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium"
                          >
                            Nova Análise
                          </button>
                          <a 
                            href="https://wa.me/5571999999999" // Replace with real number or dynamic link
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-primary py-3 rounded-xl text-center hover:bg-primary-dark transition-all text-sm font-bold"
                          >
                            Falar com Especialista
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
