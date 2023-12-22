import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthProvider } from 'context/auth';
import { cookies } from 'next/headers';
import { getUser } from 'utils/get-user';

const AuthLayout: BTypes.NLPage<{}, true> = async ({ children }) => {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookiesStore });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  let userDefault;
  if (session?.user) userDefault = await getUser(session.user, supabase);

  let email;
  if (!session && !error) {
    email = cookiesStore.get('confirm-email')?.value;
  }

  return (
    <AuthProvider
      sessionId={(session?.user as any)?.session_id}
      user={userDefault as any}
      email={email}
    >
      {children}
    </AuthProvider>
  );
};

export default AuthLayout;
