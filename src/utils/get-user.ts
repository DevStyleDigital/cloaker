import { SupabaseClient, User } from '@supabase/supabase-js';

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

  // const subscription = (await fetch('/api/subscription', { method: 'GET' })
  //   .then((res) => res.json())
  //   .catch(() => null)) as string | null;

  return {
    ...data,
    id: user.id,
    avatar_url: url,
    email: user.email!,
  };
}
