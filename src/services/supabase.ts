import { createClient } from '@supabase/supabase-js';
import { Database } from 'types/supabase';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SB_URL!,
  process.env.NEXT_PUBLIC_SB_KEY!,
);
