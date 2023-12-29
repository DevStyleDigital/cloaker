'use server';
import { createServerClient } from '@supabase/ssr';
import { cookies as NextCookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

export const createSupabaseServer = <T extends NextRequest | undefined>(
  request?: T,
  secret?: string,
): {
  supabase: SupabaseClient<any, 'public', any>;
  cookies: ReadonlyRequestCookies | RequestCookies;
  response: T extends NextRequest ? NextResponse : undefined;
} => {
  const cookieStore = request?.cookies || NextCookies();
  let response =
    request &&
    NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
          if (!request) return;
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          if (!request) {
            cookieStore.delete({ name, ...options });
            return;
          }
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    },
  );

  return {
    supabase,
    cookies: cookieStore,
    response: response as T extends NextRequest ? NextResponse<unknown> : undefined,
  };
};
