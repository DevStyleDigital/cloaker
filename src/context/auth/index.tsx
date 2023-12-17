'use client';
import {
  SupabaseClient,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  user: {
    id: string;
    name: string;
    avatar_url: string | undefined;
    phone: string;
    email: string;
    block_providers: string[];
  } | null;
  supabase: SupabaseClient<any, 'public', any>;
  setUser: React.Dispatch<React.SetStateAction<AuthContextType['user']>>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: BTypes.FCChildren) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();

      let url;
      if (data.avatar_url) {
        const { data: blob } = await supabase.storage
          .from('avatars')
          .download(data.avatar_url);

        url = blob ? URL.createObjectURL(blob) : undefined;
      }

      setUser({
        id: data.id,
        name: data.name,
        avatar_url: url,
        phone: data.phone,
        email: session?.user.email!,
        block_providers: data.block_providers,
      });
    });

    return () => {
      supabase.auth.onAuthStateChange(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signOut: () => {
          supabase.auth.signOut();
          router.push('/login');
        },
        supabase,
        setUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
