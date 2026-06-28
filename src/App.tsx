/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';
import AuthPage from './pages/Auth';
import { LogOut, PenSquare, Home as HomeIcon } from 'lucide-react';
import { motion } from 'motion/react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex justify-between items-center px-6 md:px-8 py-4 mx-4 mt-6 rounded-[2rem] bg-slate-800/40 backdrop-blur-xl border-t border-l border-white/20 border-b border-r border-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] sticky top-6 z-50"
    >
      <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-3 text-white hover:text-emerald-400 transition-colors font-display">
        <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 rounded-xl shadow-[0_4px_0_#047857]">
          <HomeIcon className="w-5 h-5 text-white" />
        </div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 filter drop-shadow-lg">BLOG3D</span>
      </Link>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link
              to="/new"
              className="text-xs font-bold uppercase tracking-wider text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            >
              <PenSquare className="w-4 h-4" />
              Write
            </Link>
            <div className="text-xs font-semibold text-white/60 border-l border-white/10 pl-6 shrink-0 max-w-[120px] truncate tracking-wider" title={user.email || ''}>
              {user.email?.split('@')[0]}
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 bg-rose-500/10 px-4 py-2 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-[0_5px_0_#047857,0_10px_20px_rgba(16,185,129,0.4)] active:shadow-[0_0px_0_#047857,0_0px_0_rgba(16,185,129,0.4)] active:translate-y-[5px] transition-all"
          >
            Sign In
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen font-sans flex flex-col text-slate-100 overflow-x-hidden selection:bg-emerald-500/30">
          <Navbar />
          <main className="max-w-5xl mx-auto w-full px-6 md:px-12 py-16 flex-grow relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/new" element={<EditPost />} />
              <Route path="/edit/:id" element={<EditPost />} />
              <Route path="/post/:id" element={<PostDetail />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

