/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { type User as SBUser, type Session } from '@supabase/supabase-js';
import { supabase } from 'services/supabase';
import cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { CopySlash } from 'lucide-react';

type User = {
  id: string;
  email: string;
  name: string;
  phone: string | undefined;
  avatar: string | undefined;
};
type AuthContextProps = {
  signIn: (e: string, p: string) => Promise<string>;
  signUp: (e: string, p: string, meta: { name: string; tel: string }) => Promise<string>;
  signOut: () => Promise<void>;
  setLoading: (l: boolean) => void;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: BTypes.FCChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthContextProps['user']>(null);
  const [loading, setLoading] = useState<AuthContextProps['loading']>(false);

  function handleSession(session: Session | null) {
    if (!session?.access_token) {
      Object.entries(window.localStorage).forEach(([k]) =>
        k.includes('auth-token') ? window.localStorage.removeItem(k) : undefined,
      );
      return cookies.remove('__AUTH');
    }
    cookies.set('__AUTH', session.access_token, {
      expires: session.expires_in,
      path: '/',
    });
  }

  function handleUser(data: { session: Session | null; user: SBUser | null } | null) {
    if (data?.user && data?.session) {
      handleSession(data.session);
      setUser({
        email: data.user.email!,
        id: data.user.id,
        phone: data.user.phone || data.user.user_metadata.phone,
        name: data.user.user_metadata.name,
        avatar: data.user.user_metadata.photo,
      });
      return;
    }
    handleSession(null);
    setUser(null);
    router.push('/login');
  }

  const signIn: AuthContextProps['signIn'] = async (email, password) => {
    setLoading(true);
    return await supabase.auth
      .signInWithPassword({ email, password })
      .then((res) => {
        if (res.error) throw res.error.message;
        handleUser(res.data);
        return 'success';
      })
      .catch((e) => {
        throw e;
      });
  };

  const signUp: AuthContextProps['signUp'] = async (email, password, meta) => {
    setLoading(true);
    return await supabase.auth
      .signUp({
        email,
        password,
        phone: meta.tel,
        options: { data: { name: meta.name, phone: meta.tel } },
      })
      .then((res) => {
        if (res.error) throw res.error.message;
        handleUser(res.data);
        return 'success';
      })
      .catch((e) => {
        throw e;
      });
  };

  const signOut = async () => {
    setLoading(true);
    return supabase.auth
      .signOut()
      .then(() => handleUser(null))
      .catch(() => handleUser(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) =>
      handleUser({ user: session?.user || null, session }),
    );
  }, []);

  const value = useMemo(
    () => ({ user, loading, setLoading, signIn, signOut, signUp }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
