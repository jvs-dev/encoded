import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Image, Tag, Type, Layout, Send } from 'lucide-react';
import { createPost } from '../../services/blogService';
import { BlogUser } from '../../services/authService';

interface PostEditorProps {
  user: any;
  profile: BlogUser | null;
  onClose: () => void;
  onSuccess: (post: any) => void;
}

export function PostEditor({ user, profile, onClose, onSuccess }: PostEditorProps) {
  const isMasterAdmin = user?.email === 'jvssilv4@gmail.com';
  const isAdmin = profile?.role === 'admin' || isMasterAdmin;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: '',
    isSystemPost: isAdmin,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile && !isMasterAdmin) return;
    
    setIsSubmitting(true);
    try {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const post = await createPost({
        title: formData.title,
        slug,
        content: formData.content,
        excerpt: formData.excerpt,
        coverImage: formData.coverImage,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        authorId: user.uid,
        authorName: formData.isSystemPost ? 'INCODED' : (profile?.fullName || user?.displayName || 'Admin'),
        authorRole: profile?.role || 'admin',
        isVerifiedAuthor: isMasterAdmin || profile?.isVerified || profile?.role === 'admin' || profile?.role === 'staff',
        isSystemPost: formData.isSystemPost,
      });

      onSuccess(post);
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Erro ao publicar. Verifique se todos os campos estão corretos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-white/10 w-full max-w-4xl my-8 p-8 shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary/20 flex items-center justify-center">
             <Layout className="text-primary w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black italic tracking-tight">NOVO ARTIGO</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center">
                <Type className="w-3 h-3 mr-2" /> Título do Post
              </label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-none focus:border-primary outline-none text-lg font-bold"
                placeholder="Ex: Como otimizar seu funil de vendas em 2024"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center">
                <Layout className="w-3 h-3 mr-2" /> Resumo (Excerpt)
              </label>
              <textarea 
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-none focus:border-primary outline-none h-24 resize-none text-sm leading-relaxed"
                placeholder="Breve descrição que aparecerá no card do blog..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center">
                <Image className="w-3 h-3 mr-2" /> URL da Imagem de Capa
              </label>
              <input 
                type="url" 
                value={formData.coverImage}
                onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-none focus:border-primary outline-none text-sm"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center">
                <Tag className="w-3 h-3 mr-2" /> Tags (separadas por vírgula)
              </label>
              <input 
                type="text" 
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-none focus:border-primary outline-none text-sm"
                placeholder="Estratégia, Marketing, Tecnologia"
              />
            </div>

            {isAdmin && (
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={formData.isSystemPost}
                  onChange={(e) => setFormData({...formData, isSystemPost: e.target.checked})}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                  Publicar como INCODED (Oficial)
                </span>
              </label>
            )}
          </div>

          <div className="space-y-6 flex flex-col h-full">
            <div className="space-y-2 flex-grow flex flex-col">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Conteúdo (Markdown suportado)</label>
              <textarea 
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-none focus:border-primary outline-none flex-grow h-[300px] font-mono text-sm leading-relaxed"
                placeholder="Escreva seu artigo aqui..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 transition-all"
              >
                CANCELAR
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] bg-primary hover:bg-primary-dark text-white font-black py-4 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Publicando...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    PUBLICAR ARTIGO
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
