import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/notifications/check-expired - marks expired listings and notifies owners
export async function POST() {
  try {
    const adminSupabase = createAdminClient();
    const supabase = await createClient();

    // Optional: restrict to admin user if desired
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date().toISOString();

    // Find active products whose listing_expires_at is in the past
    const { data: expiredProducts, error } = await adminSupabase
      .from('products')
      .select('id, user_id, title')
      .lte('listing_expires_at', now)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching expired products:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch expired products' }, { status: 500 });
    }

    if (!expiredProducts || expiredProducts.length === 0) {
      return NextResponse.json({ success: true, message: 'No expired listings found' });
    }

    for (const p of expiredProducts) {
      try {
        await adminSupabase.from('products').update({ status: 'listing_expired' }).eq('id', p.id);
        await adminSupabase.from('notifications').insert({
          user_id: p.user_id,
          type: 'listing_expired',
          title: 'Listing Berakhir',
          message: `Listing untuk produk \"${p.title}\" telah berakhir. Silakan perpanjang paket listing untuk mengaktifkan kembali produk Anda.`,
          related_product_id: p.id,
          link: `/marketplace/manage-product/${p.id}`,
        });
      } catch (e) {
        console.error('Error processing expired product', p.id, e);
      }
    }

    return NextResponse.json({ success: true, processed: expiredProducts.length });
  } catch (error) {
    console.error('check-expired error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
