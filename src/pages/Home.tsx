import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../lib/api';
import { Post } from '../types';
import { motion } from 'motion/react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-24 text-xs uppercase tracking-wider font-bold text-emerald-400 animate-pulse font-display">Loading Universe...</div>;
  }

  if (error) {
    return <div className="text-center py-24 text-xs uppercase tracking-wider font-bold text-rose-400 font-display">Error: {error}</div>;
  }

  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-32 rounded-[2rem] bg-slate-800/40 backdrop-blur-xl border-t border-l border-white/20 border-b border-r border-black/40 shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.3)]"
      >
        <h3 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 font-display">No content yet.</h3>
        <p className="text-slate-400 text-sm font-semibold">Be the first to curate a post.</p>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 relative perspective-1000"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 blur-3xl opacity-30 -z-10 rounded-full"></div>
        <h1 className="text-[60px] md:text-[90px] leading-[1.1] font-black tracking-tight text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] font-display transform-gpu" style={{ transform: 'translateZ(20px)' }}>
          Discover <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">The Future</span>
        </h1>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <motion.article 
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            key={post.id} 
            className="relative p-8 rounded-[2rem] bg-slate-800/40 backdrop-blur-xl border-t border-l border-white/20 border-b border-r border-black/40 shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_30px_60px_rgba(16,185,129,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] hover:-translate-y-4 hover:scale-[1.02] transition-all duration-300 group flex flex-col perspective-1000"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none transform translate-z-10"></div>
            <h2 className="text-3xl font-black tracking-tight mb-4 text-white group-hover:text-emerald-400 transition-colors line-clamp-2 font-display relative z-10">
              <Link to={`/post/${post.id}`}>
                {post.title}
              </Link>
            </h2>
            <div className="text-xs uppercase tracking-widest font-bold text-teal-300 mb-6 flex items-center gap-3 relative z-10">
              <span className="truncate max-w-[120px]">{post.authorName}</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              <time>{new Date(post.createdAt).toLocaleDateString()}</time>
            </div>
            <p className="text-slate-300 line-clamp-3 leading-relaxed text-base mb-8 flex-grow relative z-10 font-medium">
              {post.content}
            </p>
            <div className="mt-auto relative z-10">
              <Link to={`/post/${post.id}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-white transition-colors group/link">
                Read Article
                <span className="block w-6 h-[2px] bg-emerald-400 group-hover/link:w-12 group-hover/link:bg-white transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
