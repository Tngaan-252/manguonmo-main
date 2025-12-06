import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user session on mount from localStorage
  useEffect(() => {
    console.log('🚀 Initializing auth from localStorage...');
    
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        console.log('✅ User found in localStorage:', userData.email);
        setUser(userData);
        setRole(userData.role);
      } else {
        console.log('👤 No user in localStorage');
      }
    } catch (error) {
      console.error('❌ Error loading user from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function - Query from users table
  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Query from users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('password', password) // ⚠️ Plain text comparison
        .maybeSingle();

      if (error) {
        console.error('❌ Login query error:', error);
        throw new Error('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }

      if (!userData) {
        console.log('❌ Invalid credentials');
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      console.log('✅ Login successful:', userData.email);
      
      // Save user to state and localStorage
      setUser(userData);
      setRole(userData.role);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      
      // Clear state and localStorage
      setUser(null);
      setRole(null);
      localStorage.removeItem('user');
      
      console.log('✅ Logout successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Register function - Insert into users table
  const register = async (email, password, name) => {
    try {
      console.log('📝 Attempting registration for:', email);
      
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (existingUser) {
        throw new Error('Email này đã được đăng ký');
      }

      // Insert new user into users table
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: email.toLowerCase().trim(),
            password: password, // ⚠️ Should be hashed in production
            role: 'user',
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating user:', insertError);
        throw new Error('Không thể tạo tài khoản. Vui lòng thử lại.');
      }

      console.log('✅ User created:', newUser.id);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: newUser.id,
            email: email.toLowerCase().trim(),
            name: name.trim(),
            role: 'user',
          },
        ]);

      if (profileError) {
        console.error('⚠️ Error creating profile (non-critical):', profileError);
        // Don't throw - profile is optional
      }

      console.log('✅ Registration successful');
      return { success: true, user: newUser };
    } catch (error) {
      console.error('❌ Register error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    role,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};