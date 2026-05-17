import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, User, Mail, Phone, ArrowRight } from 'lucide-react';
import { registerBlogUser } from '../../services/authService';

interface UserRegistrationProps {
  user: any; // Firebase user
  onComplete: (profile: any) => void;
}

export function UserRegistration({ user, onComplete }: UserRegistrationProps) {
  const [formData, setFormData] = useState({
    fullName: user.displayName || '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const profile = await registerBlogUser(
        user.uid,
        user.email!,
        formData.fullName,
        formData.phone
      );
      onComplete(profile);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a070e]/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <User className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Quase lá!</h2>
          <p className="text-gray-400 text-sm">
            Para interagir no blog da INCODED, complete seu perfil abaixo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                required
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                placeholder="Ex: João Silva"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                disabled
                type="email" 
                value={user.email || ''}
                className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-lg opacity-50 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">WhatsApp / Celular</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                required
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg flex items-center justify-center group transition-all disabled:opacity-50 mt-6"
          >
            {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro'}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
