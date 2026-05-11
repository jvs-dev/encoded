import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Calendar, User, CheckCircle, ShieldCheck, Tag, Share2, MessageCircle, Trash2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Preloader } from '../components/ui/Preloader';
import { getPostBySlug, BlogPost, deletePost } from '../services/blogService';
import { subscribeToAuthChanges, getBlogUserProfile } from '../services/authService';
import Markdown from 'react-markdown';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (u) => {
      if (u) {
        const profile = await getBlogUserProfile(u.uid);
        setIsAdmin(profile?.role === 'admin' || u.email === 'jvssilv4@gmail.com');
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        try {
          const data = await getPostBySlug(slug);
          setPost(data);
        } catch (err) {
          console.error('Error fetching post:', err);
        } finally {
          setTimeout(() => setIsLoading(false), 1500);
        }
      }
    };
    fetchPost();
  }, [slug]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheck className="w-4 h-4 text-primary" />;
      case 'staff': return <CheckCircle className="w-4 h-4 text-sky-400" />;
      case 'client': return <Tag className="w-4 h-4 text-emerald-400" />;
      default: return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'staff': return 'Equipe INCODED';
      case 'client': return 'Cliente VIP';
      default: return '';
    }
  };

  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleDeleteInfo = async () => {
    if (!post?.id) return;
    try {
      await deletePost(post.id);
      navigate('/blog');
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir o post.');
    }
  };

  const handleShare = async () => {
    if (!post) return;
    
    const shareData = {
      title: `${post.title} | Blog INCODED`,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  };

  if (!isLoading && !post) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black mb-4 italic">POST NÃO <span className="text-primary italic">ENCONTRADO</span></h1>
        <Link to="/blog" className="text-gray-400 hover:text-white transition-colors flex items-center">
          <ChevronLeft className="w-4 h-4 mr-2" /> Voltar ao Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Helmet>
        <title>{post ? `${post.title} | Blog INCODED` : 'Blog INCODED'}</title>
        <link rel="canonical" href={`https://www.incoded.com.br/blog/${slug}`} />
        <meta name="description" content={post?.excerpt || 'Post do blog INCODED'} />
        <meta property="og:title" content={post ? `${post.title} | Blog INCODED` : 'Blog INCODED'} />
        <meta property="og:url" content={`https://www.incoded.com.br/blog/${slug}`} />
      </Helmet>

      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>

      <Navbar activeSection="blog" />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center text-primary text-xs font-black uppercase tracking-widest mb-10 hover:translate-x-[-4px] transition-transform">
          <ChevronLeft className="w-4 h-4 mr-2" /> Voltar para o Blog
        </Link>

        {post && (
          <article>
            <header className="mb-12">
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags?.map((tag, i) => (
                  <span key={i} className="bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary italic">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black mb-10 leading-tight italic">
                {post.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-8 border-y border-white/10">
                <div className="flex items-center gap-4">
                  {post.isSystemPost ? (
                    <div className="w-12 h-12 rounded-full bg-white border border-primary flex items-center justify-center p-2 overflow-hidden ring-2 ring-black">
                      <img src="/logo.svg" alt="INCODED" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-black uppercase tracking-widest flex items-center gap-2">
                       {post.authorName}
                       {post.isVerifiedAuthor && <CheckCircle className="w-4 h-4 text-sky-400 fill-sky-400/20" />}
                       {getRoleIcon(post.authorRole)}
                    </p>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                      {getRoleLabel(post.authorRole)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-gray-500 text-xs font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : '--/--/--'}
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <button onClick={handleShare} className="hover:text-primary transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Compartilhar
                  </button>
                  {isAdmin && (
                    <>
                      <div className="h-4 w-px bg-white/10" />
                      <button onClick={(e) => { e.preventDefault(); setPostToDelete(post.id); }} className="hover:text-red-500 text-red-500/80 transition-colors flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
            </header>

            <div className="relative aspect-video mb-12 border border-white/10 overflow-hidden">
              <img 
                src={post.coverImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070'} 
                alt={post.title} 
                className="w-full h-full object-cover grayscale opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
            </div>

            <div className="prose prose-invert prose-primary max-w-none mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Markdown>{post.content}</Markdown>
            </div>

            <footer className="pt-12 border-t border-white/10 text-center md:text-left">
              <div className="bg-zinc-950 p-10 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <h3 className="text-xl font-black mb-6 italic">GOSTOU DESTE <span className="text-primary italic underline decoration-2 underline-offset-4">CONTEÚDO</span>?</h3>
                <p className="text-gray-400 mb-8 max-w-2xl leading-relaxed">
                  A INCODED transforma estratégias complexas em interfaces simples e funcionais. Se sua empresa precisa de resultados assim, vamos conversar.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link to="/#contato" className="bg-primary text-white font-black px-8 py-4 hover:bg-primary-dark transition-all">Fale Conosco</Link>
                  <button className="bg-white/5 border border-white/10 text-white font-black px-8 py-4 hover:bg-white/10 transition-all flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Comentar
                  </button>
                </div>
              </div>
            </footer>
          </article>
        )}
      </main>
      
      <AnimatePresence>
        {postToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-none max-w-sm w-full text-center"
            >
              <h3 className="text-xl font-black mb-4 uppercase italic">Confirmar <span className="text-primary">Exclusão</span></h3>
              <p className="text-gray-400 mb-8">Esta ação não pode ser desfeita. O post será apagado permanentemente.</p>
              <div className="flex gap-4">
                <button onClick={() => setPostToDelete(null)} className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition-all">Cancelar</button>
                <button onClick={() => handleDeleteInfo()} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-black transition-all">Excluir</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
