import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchPost, deletePost, fetchComments, createComment } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { Post, Comment } from '../types';
import { Trash2, Edit } from 'lucide-react';
import { motion } from 'motion/react';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    Promise.all([fetchPost(id), fetchComments(id)])
      .then(([postData, commentsData]) => {
        setPost(postData);
        setComments(commentsData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePost(id!);
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const added = await createComment(id, {
        content: newComment,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous'
      });
      setComments([...comments, { ...added, createdAt: Date.now() }]);
      setNewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <div className="text-center py-24 text-xs uppercase tracking-wider font-bold text-emerald-400 animate-pulse">Loading Universe...</div>;
  if (error || !post) return <div className="text-center py-24 text-xs uppercase tracking-wider font-bold text-rose-400">Error: {error || 'Post not found'}</div>;

  const isAuthor = user?.uid === post.authorId;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto w-full p-8 md:p-12 rounded-[40px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      <article className="mb-16">
        <header className="mb-12 border-b border-white/10 pb-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <h1 className="text-[40px] md:text-[60px] leading-[1] font-bold tracking-tight text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              {post.title}
            </h1>
            {isAuthor && (
              <div className="flex items-center gap-4 shrink-0 mt-4 md:mt-0">
                <Link
                  to={`/edit/${post.id}`}
                  className="text-xs font-bold uppercase tracking-wider border border-white/20 px-6 py-3 rounded-full hover:bg-white/10 hover:border-emerald-400 transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  title="Edit post"
                >
                  <Edit className="w-4 h-4" /> Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-xs font-bold uppercase tracking-wider text-rose-400 border border-rose-400/50 px-6 py-3 rounded-full hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
          <div className="mt-12 text-xs uppercase tracking-widest font-bold text-emerald-400 flex items-center gap-4">
            <span>{post.authorName}</span>
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            <time className="text-cyan-300">{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
        </header>

        <div className="max-w-none text-lg leading-relaxed text-slate-200 whitespace-pre-wrap font-sans drop-shadow-sm">
          {post.content}
        </div>
      </article>

      <section className="pt-16 border-t border-white/10">
        <h3 className="text-3xl font-black tracking-tight text-white mb-12 drop-shadow-md font-display">Discourse ({comments.length})</h3>
        
        <div className="space-y-8 mb-16">
          {comments.length === 0 ? (
            <p className="text-white/40 text-sm uppercase tracking-wider font-semibold bg-white/5 p-6 rounded-2xl border border-white/10 text-center">No comments yet. Be the first to share your thoughts.</p>
          ) : (
            comments.map(comment => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={comment.id} 
                className="p-6 rounded-[1.5rem] bg-slate-800/40 backdrop-blur-xl border-t border-l border-white/20 border-b border-r border-black/40 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4 text-xs uppercase tracking-widest font-bold">
                  <span className="text-emerald-400">{comment.authorName}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <time className="text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</time>
                </div>
                <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap font-medium">{comment.content}</p>
              </motion.div>
            ))
          )}
        </div>

        {user ? (
          <form onSubmit={handleCreateComment} className="pt-12 border-t border-white/10">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-6 font-display">Contribute</h4>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-3xl blur opacity-30 group-focus-within:opacity-60 transition duration-500"></div>
              <textarea
                className="relative w-full bg-slate-900/80 rounded-[1.5rem] border border-white/10 p-6 outline-none text-slate-200 resize-none placeholder:text-slate-500 text-lg shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:border-emerald-400/50 transition-colors"
                rows={4}
                placeholder="What are your thoughts?"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                required
              />
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={submittingComment}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_5px_0_#047857,0_10px_20px_rgba(16,185,129,0.4)] active:shadow-[0_0px_0_#047857,0_0px_0_rgba(16,185,129,0.4)] active:translate-y-[5px] transition-all disabled:opacity-50 disabled:active:translate-y-0"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-12 border-t border-white/10 text-center bg-white/5 rounded-3xl p-8 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <p className="text-slate-300 text-sm font-semibold">
              <Link to="/auth" className="text-emerald-400 font-bold uppercase tracking-wider hover:text-white transition-colors mr-2">Sign in</Link> to leave a comment.
            </p>
          </div>
        )}
      </section>
    </motion.div>
  );
}
