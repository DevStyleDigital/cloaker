import { SupabaseClient, User } from '@supabase/supabase-js';
import { jwt } from 'services/jwt';

export async function getUser(
  user: User | null,
  supabase: SupabaseClient<any, 'public', any>,
) {
  if (!user) return null;
  const data = user.user_metadata;

  let url;
  if (data.avatar_url) {
    const { data: blob } = await supabase.storage
      .from('avatars')
      .download(data.avatar_url);

    url = blob ? URL.createObjectURL(blob) : undefined;
  }

  let subscription;
  if (
    typeof data?.subscription?.token === 'string' &&
    typeof data?.subscription?.secret === 'string'
  )
    subscription = await jwt
      .verify(data.subscription.token, data.subscription.secret)
      .then((r) => r.subscription)
      .catch(() => null);

  return {
    ...data,
    subscription,
    id: user.id,
    avatar_url: url,
    email: user.email!,
  };
}
