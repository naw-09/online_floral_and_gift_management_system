import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios'; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    try {
      // This calls your Laravel AuthController login method
      const response = await API.post('/login', { email, password });
      
      const { user, token } = response.data;

      // Save to localStorage so interceptor can find the token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return { user };
    } catch (error) {
      // This sends the error back to your Login.jsx to show the message
      throw error;
    }
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);