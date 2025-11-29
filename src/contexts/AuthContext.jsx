import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from profiles table
  const fetchUserRole = async (userId) => {
    try {
      console.log('🔍 Fetching role for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching role:', error);
        
        // ✅ Nếu profile chưa tồn tại, tạo mới với role mặc định
        if (error.code === 'PGRST116') { // Row not found
          console.log('📝 Creating new profile for user:', userId);
          const { data: userData } = await supabase.auth.getUser();
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                email: userData?.user?.email,
                role: 'user',
              },
            ]);

          if (insertError) {
            console.error('❌ Error creating profile:', insertError);
          } else {
            console.log('✅ Profile created with role: user');
            setRole('user');
            return;
          }
        }
        
        setRole('user');
        return;
      }

      console.log('✅ Role fetched successfully:', data?.role);
      setRole(data?.role || 'user');
    } catch (error) {
      console.error('❌ Exception in fetchUserRole:', error);
      setRole('user');
    }
  };

  // Check user session on mount
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
        }
        
        if (!isMounted) return;
        
        if (session?.user) {
          console.log('👤 User session found:', session.user.email);
          setUser(session.user);
          await fetchUserRole(session.user.id);
        } else {
          console.log('👤 No user session');
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error('❌ Error in initAuth:', error);
      } finally {
        if (isMounted) {
          console.log('✅ Auth initialization complete');
          setLoading(false);
        }
      }
    };

    initAuth();

    // Setup auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth event:', event);
        
        if (!isMounted) return;
        
        if (session?.user) {
          console.log('👤 User logged in:', session.user.email);
          setUser(session.user);
          
          // Fetch role on sign in or token refresh
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await fetchUserRole(session.user.id);
          }
        } else {
          console.log('👤 User logged out');
          setUser(null);
          setRole(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('✅ Login successful');
      // Auth listener will handle setting user and fetching role
      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      
      // ✅ Clear state trước khi sign out
      setUser(null);
      setRole(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Logout error:', error);
        throw error;
      }
      
      console.log('✅ Logout successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      // ✅ Vẫn clear state ngay cả khi có lỗi
      setUser(null);
      setRole(null);
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (email, password) => {
    try {
      console.log('📝 Attempting registration for:', email);
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      console.log('✅ User created:', authData.user.id);

      // Create user profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            role: 'user',
            email: authData.user.email,
          },
        ]);

      if (insertError) {
        console.error('❌ Error creating profile:', insertError);
        throw insertError;
      }

      console.log('✅ Profile created successfully');
      return { success: true, user: authData.user };
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
    fetchUserRole,
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