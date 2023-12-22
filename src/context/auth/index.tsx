'use client';
import {
  SupabaseClient,
  User,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUser } from 'utils/get-user';
import { EmailConfirmDialog } from './email-confirm-dialog';

export type AuthUser = {
  id: string;
  name: string;
  avatar_url: string | undefined;
  phone: string;
  email: string;
  block_providers: string[];
  subscription: string | null;
  addr: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
};

type AuthContextType = {
  user: AuthUser | null;
  supabase: SupabaseClient<any, 'public', any>;
  setUser: React.Dispatch<React.SetStateAction<AuthContextType['user']>>;
  setEmailDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({
  children,
  user: userDefault,
  sessionId,
  email: emailDefault,
}: BTypes.FCChildren & {
  user?: AuthContextType['user'];
  sessionId?: string;
  email?: string;
}) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [emailDialogOpen, setEmailDialogOpen] = useState(!!emailDefault || false);
  const [user, setUser] = useState<AuthContextType['user']>(userDefault || null);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) return;
      if ((session.user as any).session_id === sessionId) return;
      console.log('asdhbsjkafdjk');
      const user = await getUser(session.user, supabase);
      setUser(user as any);
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
          supabase.auth.signOut().finally(() => router.push('/login'));
        },
        supabase,
        setUser,
        user,
        setEmailDialogOpen,
      }}
    >
      {!!emailDefault && (
        <EmailConfirmDialog
          supabase={supabase}
          open={emailDialogOpen}
          onClose={() => setEmailDialogOpen(false)}
          email={emailDefault}
        />
      )}
      {children}
    </AuthContext.Provider>
  );
};
