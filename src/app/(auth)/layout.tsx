import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthProvider } from 'context/auth';
import { cookies } from 'next/headers';
import { getUser } from 'utils/get-user';

const AuthLayout: BTypes.NLPage<{}, true> = async ({ children }) => {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookiesStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userDefault = await getUser(session?.user || null, supabase);

  return (
    <AuthProvider sessionId={(session?.user as any).session_id} user={userDefault as any}>
      {children}
    </AuthProvider>
  );
};

export default AuthLayout;
