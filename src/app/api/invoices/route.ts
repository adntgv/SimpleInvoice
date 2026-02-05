import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as any)
          );
        },
      },
    }
  );
}

export async function GET(request: Request) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const anonymous_token = searchParams.get('anonymous_token');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });

  if (user) {
    query = query.eq('user_id', user.id);
  } else if (anonymous_token) {
    query = query.eq('anonymous_token', anonymous_token);
  } else {
    return NextResponse.json({ invoices: [] });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ invoices: data });
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const invoiceData = {
    ...body,
    user_id: user?.id || null,
  };

  const { data, error } = await supabase
    .from('invoices')
    .insert(invoiceData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ invoice: data });
}
