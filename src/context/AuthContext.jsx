import React, { createContext, useContext, useState, useEffect } from "react";
import {
  subscribeToAuthChanges,
  loginUser,
  registerUser,
  logoutUser,
  resetPassword,
  updateUserProfile,
  isFirebaseConfigured
} from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    const loggedUser = await loginUser(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (name, email, password, role = "student", extraData = {}) => {
    const registeredUser = await registerUser(name, email, password, role, extraData);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const reset = async (email) => {
    return await resetPassword(email);
  };

  const updateProfileData = async (data) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  };

  const isSuperAdminUser = Boolean(
    user &&
    user.role === "admin" &&
    (user.email || "").toLowerCase() === "aslamsamejo9192@gmail.com"
  );

  const value = {
    user,
    role: isSuperAdminUser ? "admin" : user?.role || null,
    isAdmin: isSuperAdminUser,
    isStudent: Boolean(user && !isSuperAdminUser),
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
    resetPassword: reset,
    updateProfile: updateProfileData,
    isFirebaseConfigured
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
