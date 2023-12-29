import { AuthProvider } from 'context/auth';
import { cookies } from 'next/headers';
import { createSupabaseServer } from 'services/supabase';
import { getUser } from 'utils/get-user';

const AuthLayout: BTypes.NLPage<{}, true> = async ({ children }) => {
  const cookiesStore = cookies();
  const { supabase } = createSupabaseServer();

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
    <AuthProvider user={userDefault as any} email={email}>
      {children}
    </AuthProvider>
  );
};

export default AuthLayout;
