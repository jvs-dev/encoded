import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, LogOut, Plus, ShieldCheck, Loader2, Search, SlidersHorizontal } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Preloader } from '../components/ui/Preloader';
import { 
  signInWithGoogle, 
  logout, 
  subscribeToAuthChanges, 
  getBlogUserProfile, 
  BlogUser 
} from '../services/authService';
import { getPosts, BlogPost, deletePost } from '../services/blogService';
import { UserRegistration } from '../components/blog/UserRegistration';
import { PostEditor } from '../components/blog/PostEditor';
import { BlogAdminPanel } from '../components/blog/BlogAdminPanel';
import { FeedPost } from '../components/blog/FeedPost';
import { type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';

export default function Blog() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<BlogUser | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'likesCount'>('createdAt');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const isAdmin = profile?.role === 'admin' || user?.email === 'jvssilv4@gmail.com';
  const canPost = profile?.role === 'admin' || profile?.role === 'staff' || user?.email === 'jvssilv4@gmail.com';

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetchingMore, hasMore, lastDoc]);

  const loadMorePosts = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const { posts: data, lastDoc: newLastDoc } = await getPosts(10, lastDoc, sortBy, 'desc');
      if (data.length < 10) {
        setHasMore(false);
      }
      setPosts(prev => [...prev, ...data]);
      setLastDoc(newLastDoc);
    } catch (err) {
      console.error('Error fetching more posts:', err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const resetAndFetch = async () => {
    setIsDataLoading(true);
    setHasMore(true);
    try {
      const { posts: data, lastDoc: initialLastDoc } = await getPosts(10, undefined, sortBy, 'desc');
      setPosts(data);
      setLastDoc(initialLastDoc);
      if (data.length < 10) setHasMore(false);
    } catch (err) {
      console.error('Error resetting and fetching:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      resetAndFetch();
    }
  }, [sortBy]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (u) => {
      setUser(u);
      if (u) {
        const p = await getBlogUserProfile(u.uid);
        if (p) {
          setProfile(p);
          setShowRegistration(false);
        } else {
          setShowRegistration(true);
        }
      } else {
        setProfile(null);
        setShowRegistration(false);
      }
    });

    const fetchInitialPosts = async () => {
      try {
        const { posts: data, lastDoc: initialLastDoc } = await getPosts(10);
        setPosts(data);
        setLastDoc(initialLastDoc);
        if (data.length < 10) setHasMore(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setIsDataLoading(false);
        setTimeout(() => setIsLoading(false), 1500);
      }
    };

    fetchInitialPosts();
    return () => unsubscribe();
  }, []);

  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleDeletePost = async (id: string | undefined) => {
    if (!id) return;
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
      setPostToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir", error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Helmet>
        <title>Blog | Criação de Sites e Marketing Digital em Salvador | INCODED</title>
        <link rel="canonical" href="https://www.incoded.com.br/blog" />
        <meta name="description" content="Acompanhe as últimas tendências de marketing, design e tecnologia no blog oficial da INCODED. Feed interativo para sua empresa." />
        <meta property="og:title" content="Blog | INCODED News Feed" />
        <meta property="og:url" content="https://www.incoded.com.br/blog" />
      </Helmet>

      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>

      <Navbar activeSection="blog" />

      <main className="pt-32 pb-20 px-2 sm:px-6 lg:px-8 max-w-[calc(100vw-40px)] mx-auto">
        {/* Header Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-12">
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-black uppercase tracking-tighter italic"
              >
                Novidades <span className="text-primary text-stroke">De hoje</span>
              </motion.h1>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto relative">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar..." 
                  className="w-full bg-zinc-900 border border-white/10 pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary transition-colors text-white placeholder:text-gray-600"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`bg-zinc-900 border border-white/10 p-3 hover:bg-white/5 transition-colors group ${showFilters ? 'border-primary' : ''}`}
                title="Filtrar"
              >
                <SlidersHorizontal className={`w-5 h-5 ${showFilters ? 'text-primary' : 'text-gray-400'} group-hover:text-primary transition-colors`} />
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-zinc-900 border border-white/10 shadow-2xl p-6 z-[150]"
                  >
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Ordenar por</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => setSortBy('createdAt')}
                            className={`py-2 px-3 text-[10px] font-black uppercase tracking-widest border transition-all ${sortBy === 'createdAt' ? 'border-primary bg-primary/10 text-white' : 'border-white/5 text-gray-400 hover:border-white/20'}`}
                          >
                            Data
                          </button>
                          <button 
                            onClick={() => setSortBy('likesCount')}
                            className={`py-2 px-3 text-[10px] font-black uppercase tracking-widest border transition-all ${sortBy === 'likesCount' ? 'border-primary bg-primary/10 text-white' : 'border-white/5 text-gray-400 hover:border-white/20'}`}
                          >
                            Curtidas
                          </button>
                        </div>
                      </div>

                      <div className="h-px bg-white/5" />

                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Filtrar</h4>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="checkbox"
                              checked={showVerifiedOnly}
                              onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                              className="w-4 h-4 rounded-none bg-black border-white/10 text-primary focus:ring-0 focus:ring-offset-0 checkbox"
                            />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
                              Apenas Verificados
                            </span>
                          </label>

                          {/* Tag Chips */}
                          <div className="pt-2">
                             <h5 className="text-[9px] font-bold uppercase text-gray-600 mb-2">Por Tag</h5>
                             <div className="flex flex-wrap gap-1.5">
                               {Array.from(new Set(posts.flatMap(p => p.tags))).slice(0, 10).map(tag => (
                                 <button
                                   key={tag}
                                   onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                   className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border transition-all ${selectedTag === tag ? 'border-primary bg-primary text-white' : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20'}`}
                                 >
                                   #{tag}
                                 </button>
                               ))}
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-white/5" />

                      <button 
                        onClick={() => {
                          setSortBy('createdAt');
                          setShowVerifiedOnly(false);
                          setSelectedTag(null);
                          setSearchQuery('');
                        }}
                        className="w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors"
                      >
                        Limpar Filtros
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4">
              {!user ? (
                <button 
                  onClick={handleLogin}
                  className="bg-zinc-900 border border-white/10 text-white text-[10px] font-black py-4 px-8 rounded-none flex items-center hover:bg-primary transition-all active:scale-95 tracking-widest uppercase"
                >
                  <LogIn className="w-4 h-4 mr-3" />
                  ENTRAR
                </button>
              ) : (
                <div className="flex items-center gap-4 bg-zinc-900 border border-white/10 p-2 pl-4 rounded-full">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black leading-tight truncate max-w-[100px] uppercase tracking-wider">{profile?.fullName || user.displayName}</p>
                    <p className="text-[8px] text-gray-500 uppercase tracking-widest leading-none mt-0.5">{profile?.role || 'Visitante'}</p>
                  </div>
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    className="w-8 h-8 rounded-full border border-primary/50"
                  />
                  <button 
                    onClick={handleLogout}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                    title="Sair"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Feed Content */}
          <div className="space-y-12">
            {isDataLoading && posts.length === 0 ? (
               Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-[600px] bg-zinc-950 border border-white/10 animate-pulse rounded-none mb-8" />
              ))
            ) : posts.length > 0 ? (
              <>
                {posts
                  .filter(post => {
                    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                    const matchesVerified = showVerifiedOnly ? post.isVerifiedAuthor : true;
                    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
                    
                    return matchesSearch && matchesVerified && matchesTag;
                  })
                  .map((post, index) => (
                  <div 
                    key={post.id} 
                    ref={index === posts.length - 1 ? lastPostElementRef : null}
                  >
                    <FeedPost 
                      post={post}
                      user={user}
                      profile={profile}
                      isAdmin={isAdmin}
                      onDelete={(id) => setPostToDelete(id)}
                    />
                  </div>
                ))}
                
                {isFetchingMore && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}

                {!hasMore && posts.length > 0 && (
                  <div className="text-center py-12 border-t border-white/5 mt-12">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em]">Você chegou ao fim dos insights</p>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center border border-dashed border-white/10">
                <p className="text-gray-500 font-bold mb-4 uppercase tracking-widest">Nenhum post no feed.</p>
                {canPost && (
                   <p className="text-primary text-sm font-black animate-pulse uppercase">Seja o pioneiro da INCODED!</p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {showRegistration && user && (
          <UserRegistration 
            user={user} 
            onComplete={(p) => {
              setProfile(p);
              setShowRegistration(false);
            }} 
          />
        )}
        {showEditor && (
          <PostEditor 
            user={user}
            profile={profile}
            onClose={() => setShowEditor(false)}
            onSuccess={(newPost) => setPosts([newPost, ...posts])}
          />
        )}
        {showAdminPanel && (
          <BlogAdminPanel onClose={() => setShowAdminPanel(false)} />
        )}
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
                <button onClick={() => handleDeletePost(postToDelete)} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-black transition-all">Excluir</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        {isAdmin && (
          <button 
            onClick={() => setShowAdminPanel(true)}
            className="w-14 h-14 bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
            title="Gerenciar Usuários"
          >
            <ShieldCheck className="w-6 h-6" />
          </button>
        )}
        {canPost && !showEditor && (
          <button 
            onClick={() => setShowEditor(true)}
            className="w-14 h-14 bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
            title="Novo Post"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        )}
      </div>
    </div>
  );
}

