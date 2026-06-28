import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { createPost, fetchPost, updatePost } from '../lib/api';
import { motion } from 'motion/react';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (isEditing) {
      fetchPost(id)
        .then(data => {
            // Check auth (simplified for UI, API doesn't strictly check right now)
            if (data.authorId !== user.uid) {
                navigate('/');
            }
            setTitle(data.title);
            setContent(data.content);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, user, navigate, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await updatePost(id, { title, content });
        navigate(`/post/${id}`);
      } else {
        const res = await createPost({
          title,
          content,
          authorId: user.uid,
          authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous'
        });
        navigate(`/post/${res.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save post');
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-24 text-xs uppercase tracking-wider font-bold text-emerald-400 animate-pulse font-display">Loading Universe...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-none"
    >
      <h1 className="text-[50px] md:text-[70px] leading-[1] font-black tracking-tight mb-16 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] font-display">
        {isEditing ? 'Revise ' : 'Draft '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Issue</span>
      </h1>
      
      {error && (
        <div className="mb-8 p-4 rounded-xl border border-rose-400/50 text-rose-400 text-xs tracking-wider uppercase font-bold bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <div className="mb-12">
          <label className="block text-xs uppercase tracking-widest font-bold text-emerald-400 mb-4 font-display">Headline</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-3xl blur opacity-30 group-focus-within:opacity-60 transition duration-500"></div>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="relative w-full bg-slate-900/80 rounded-[1.5rem] border border-white/10 px-8 py-6 text-2xl md:text-3xl font-bold tracking-tight outline-none text-slate-200 placeholder:text-slate-500 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:border-emerald-400/50 transition-colors font-display"
              placeholder="An interesting title..."
            />
          </div>
        </div>
        <div className="mb-16">
          <label className="block text-xs uppercase tracking-widest font-bold text-emerald-400 mb-4 font-display">Editorial Content</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-3xl blur opacity-30 group-focus-within:opacity-60 transition duration-500"></div>
            <textarea
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={15}
              className="relative w-full bg-slate-900/80 rounded-[1.5rem] border border-white/10 p-8 text-lg leading-relaxed outline-none text-slate-200 placeholder:text-slate-500 min-h-[400px] resize-y shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:border-emerald-400/50 transition-colors font-medium"
              placeholder="Write your story here..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-6 pt-8 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-white/20 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all text-white hover:border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_5px_0_#047857,0_10px_20px_rgba(16,185,129,0.4)] active:shadow-[0_0px_0_#047857,0_0px_0_rgba(16,185,129,0.4)] active:translate-y-[5px] transition-all disabled:opacity-50 disabled:active:translate-y-0"
          >
            {saving ? 'Saving...' : isEditing ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
