import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trash2, 
  Calendar, 
  User as UserIcon, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { BlogPost, toggleLike, addComment, getComments, BlogComment } from '../../services/blogService';
import { BlogUser } from '../../services/authService';

interface FeedPostProps {
  post: BlogPost;
  user: any;
  profile: BlogUser | null;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export function FeedPost({ post, user, profile, isAdmin, onDelete }: FeedPostProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likedBy?.includes(user?.uid) || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  const isLongPost = post.content.length > 500;
  const displayedContent = isExpanded ? post.content : post.content.slice(0, 500) + (isLongPost ? '...' : '');

  const handleLike = async () => {
    if (!user) return;
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    try {
      await toggleLike(post.id!, user.uid, !newLikedState);
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert on error
      setIsLiked(!newLikedState);
      setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
    }
  };

  const loadComments = async () => {
    if (!post.id) return;
    try {
      const data = await getComments(post.id);
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const commentData = {
        postId: post.id!,
        userId: user.uid,
        userName: profile?.fullName || user.displayName || 'Anônimo',
        userPhoto: user.photoURL,
        content: newComment.trim(),
      };
      const added = await addComment(commentData);
      setComments([...comments, { ...added, id: (added as any).id }]);
      setNewComment('');
      setCommentsCount(prev => prev + 1);
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0a070e] border border-white/10 mb-8 overflow-hidden group"
    >
      {/* Post Header */}
      <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            {post.isSystemPost ? (
              <div className="w-10 h-10 rounded-full bg-white border border-primary flex items-center justify-center p-2 overflow-hidden ring-2 ring-black">
                <img src="/logo.svg" alt="INCODED" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm uppercase tracking-wider">{post.authorName}</span>
              {post.isVerifiedAuthor && <CheckCircle className="w-3 h-3 text-sky-400 fill-sky-400/20" />}
              <span className="text-[10px] text-gray-500 uppercase font-black px-2 py-0.5 border border-white/10">
                {post.authorRole === 'admin' ? 'Administrador' : post.authorRole === 'staff' ? 'Equipe' : 'Autor'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">
              <Calendar className="w-3 h-3" />
              {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : '--/--/--'}
            </div>
          </div>
        </div>

        {isAdmin && (
          <button 
            onClick={() => onDelete(post.id!)}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Excluir Post"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Post Cover (Conditional) */}
      {post.coverImage && (
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="p-4 md:p-8">
        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-2xl md:text-3xl font-black mb-6 hover:text-primary transition-colors italic uppercase leading-tight">
            {post.title}
          </h2>
        </Link>

        <div className="prose prose-invert prose-primary max-w-none text-gray-300 text-lg leading-relaxed">
          <Markdown>{displayedContent}</Markdown>
        </div>

        {isLongPost && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 text-primary font-black uppercase text-sm flex items-center gap-2 hover:underline group/btn"
          >
            {isExpanded ? (
              <>Recolher <ChevronUp className="w-4 h-4 group-hover/btn:-translate-y-1 transition-transform" /></>
            ) : (
              <>Continuar lendo <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" /></>
            )}
          </button>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map(tag => (
            <span key={tag} className="text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Interaction Bar */}
      <div className="px-4 py-4 md:px-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-black text-sm">{likesCount}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 transition-colors ${showComments ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="font-black text-sm">{commentsCount}</span>
          </button>
        </div>

        <button className="text-gray-400 hover:text-white transition-colors">
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#0a070e] border-t border-white/5"
          >
            <div className="p-4 md:p-6">
              {/* Comment Input */}
              {user ? (
                <form onSubmit={handleAddComment} className="flex gap-4 mb-8">
                  <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escreva um comentário..."
                      className="w-full bg-white/5 border border-white/10 px-6 py-3 rounded-none outline-none focus:border-primary transition-colors text-sm"
                    />
                    <button 
                      type="submit"
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-2 disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 border border-dashed border-white/10 mb-8">
                  <p className="text-gray-500 text-sm italic">Faça login para comentar.</p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                      <img src={comment.userPhoto} alt="" className="w-8 h-8 rounded-full border border-white/10" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-xs uppercase text-primary-light">{comment.userName}</span>
                          <span className="text-[8px] text-gray-500 font-bold uppercase">
                            {comment.createdAt ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString() : 'Agora'}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 text-xs uppercase tracking-[0.2em] py-8">Seja o primeiro a comentar</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
