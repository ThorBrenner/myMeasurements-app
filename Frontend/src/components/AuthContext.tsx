import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Calling /auth/me with token:", token);
      fetch("http://localhost:8000/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(5000),
      })
        .then((res) => {
          console.log("/auth/me response status:", res.status);
          if (!res.ok) throw new Error("Failed to fetch user data");
          return res.json();
        })
        .then((data) => {
          console.log("User data received:", data);
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch((err) => {
          console.error("/auth/me error:", err);
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(5000)
      });

      console.log('Login response:', res); 

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Login failed:', errorData);
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await res.json();
      console.log("Login success:", data); 
      localStorage.setItem("token", data.access_token);

      // Fetch user data immediately after login
      const userRes = await fetch("http://localhost:8000/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!userRes.ok) throw new Error("Failed to fetch user profile");

      const userData = await userRes.json();
      console.log("User from login fetch /me:", userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
        signal: AbortSignal.timeout(5000)
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      const success = await login(email, password);
      return success;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
