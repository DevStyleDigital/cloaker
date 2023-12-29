import { SupabaseClient, User } from '@supabase/supabase-js';

export async function getUser(
  user: User | null,
  supabase: SupabaseClient<any, 'public', any>,
) {
  if (!user) return null;
  const data = user.user_metadata;

  let subscription;
  if (
    typeof data?.subscription?.token === 'string' &&
    typeof data?.subscription?.secret === 'string'
  )
    subscription = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/api/subscription`,
      {
        method: 'POST',
        body: JSON.stringify({
          token: data.subscription.token,
          secret: data.subscription.secret,
        }),
      },
    )
      .then((r) => r.json())
      .then((r) => r.subscription)
      .catch(() => null);

  let avatar_url;
  if (data.avatar_url) {
    const { data: image } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.avatar_url);
    avatar_url = image ? image.publicUrl : undefined;
  }

  return {
    ...data,
    subscription,
    avatar_url,
    id: user.id,
    email: user.email!,
  };
}
