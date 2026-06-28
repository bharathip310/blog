import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'motion/react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock login process
      setTimeout(() => {
        login(name || email.split('@')[0], email);
        navigate('/');
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto mt-20 p-10 rounded-[2rem] bg-slate-800/40 backdrop-blur-xl border-t border-l border-white/20 border-b border-r border-black/40 shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.3)] relative"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-2xl opacity-20 -z-10 rounded-[2rem]"></div>
      
      <h2 className="text-4xl font-black tracking-tight text-center mb-10 text-white drop-shadow-md font-display">
        {isLogin ? 'Enter ' : 'Join '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Archive</span>
      </h2>
      
      {error && (
        <div className="mb-8 p-4 rounded-xl border border-rose-400/50 text-rose-400 text-xs tracking-wider uppercase font-bold bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.3)] text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-emerald-400 mb-2 font-display">Display Name</label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-30 group-focus-within:opacity-60 transition duration-500"></div>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="relative w-full bg-slate-900/80 rounded-2xl border border-white/10 px-6 py-4 text-base outline-none text-slate-200 placeholder:text-slate-500 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:border-emerald-400/50 transition-colors font-medium"
                placeholder="John Doe"
              />
            </div>
          </div>
        )}
        <div>
          <label className="block text-xs uppercase tracking-widest font-bold text-emerald-400 mb-2 font-display">Email</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-30 group-focus-within:opacity-60 transition duration-500"></div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="relative w-full bg-slate-900/80 rounded-2xl border border-white/10 px-6 py-4 text-base outline-none text-slate-200 placeholder:text-slate-500 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:border-emerald-400/50 transition-colors font-medium"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest font-bold text-emerald-400 mb-2 font-display">Password</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-30 group-focus-within:opacity-60 transition duration-500"></div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="relative w-full bg-slate-900/80 rounded-2xl border border-white/10 px-6 py-4 text-base outline-none text-slate-200 placeholder:text-slate-500 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:border-emerald-400/50 transition-colors font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl mt-8 text-xs font-bold uppercase tracking-wider shadow-[0_5px_0_#047857,0_10px_20px_rgba(16,185,129,0.4)] active:shadow-[0_0px_0_#047857,0_0px_0_rgba(16,185,129,0.4)] active:translate-y-[5px] transition-all disabled:opacity-50 disabled:active:translate-y-0"
        >
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-8 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 border-t border-white/10 pt-8">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-emerald-400 hover:text-white transition-colors ml-3 font-bold"
        >
          {isLogin ? 'Sign up here' : 'Sign in here'}
        </button>
      </div>
    </motion.div>
  );
}
