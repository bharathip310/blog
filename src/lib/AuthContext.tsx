import { createContext, useContext, useState } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('mock_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (name: string, email: string) => {
    const newUser = { uid: 'user-' + Date.now(), email, displayName: name };
    localStorage.setItem('mock_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('mock_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
