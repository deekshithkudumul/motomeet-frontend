import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8000";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.get(`${API}/api/auth/me`)
        .then(res => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const form = new FormData();
    form.append("username", email);
    form.append("password", password);
    const res = await axios.post(`${API}/api/auth/login`, form);
    localStorage.setItem("token", res.data.access_token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.access_token}`;
    setToken(res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await axios.post(`${API}/api/auth/register`, data);
    localStorage.setItem("token", res.data.access_token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.access_token}`;
    setToken(res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, API }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);