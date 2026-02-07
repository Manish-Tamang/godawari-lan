import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // Use Service Role Key if available to bypass RLS in API
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll(cookiesToSet) {
          },
        },
      }
    );

    const teamName = formData.get('teamName') as string;
    const iglName = formData.get('iglName') as string;
    const iglPhone = formData.get('iglPhone') as string;
    const playersJson = formData.get('players') as string;
    const paymentScreenshot = formData.get('paymentScreenshot') as File;

    console.log('[API] New registration request for team:', teamName);

    if (!teamName || !iglName || !iglPhone || !playersJson || !paymentScreenshot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const players = JSON.parse(playersJson);

    // 1. Upload screenshot to Supabase Storage
    const fileExt = paymentScreenshot.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    console.log('[API] Uploading screenshot:', filePath);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(filePath, paymentScreenshot);

    if (uploadError) {
      console.error('[API] Storage error:', uploadError);
      throw new Error(`Storage error: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(filePath);

    // 2. Insert team into database
    console.log('[API] Inserting team into DB...');
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .insert({
        team_name: teamName,
        igl_name: iglName,
        igl_phone: iglPhone,
        payment_screenshot_url: publicUrl,
        status: 'pending',
        payment_amount: 250,
      })
      .select()
      .single();

    if (teamError) {
      console.error('[API] Team table error:', teamError);
      throw new Error(`Database error (teams): ${teamError.message}`);
    }

    // 3. Insert players
    console.log('[API] Inserting players...');
    const playersToInsert = players.map((p: any) => ({
      team_id: teamData.id,
      name: p.name,
      uid: p.uid,
    }));

    const { error: playersError } = await supabase
      .from('players')
      .insert(playersToInsert);

    if (playersError) {
      console.error('[API] Players table error:', playersError);
      throw new Error(`Database error (players): ${playersError.message}`);
    }

    console.log('[API] Registration complete!');
    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      teamId: teamData.id
    });

  } catch (error: any) {
    console.error('[API] Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process registration' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check if session exists
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: teams, error } = await supabase
    .from('teams')
    .select('*, players(*)');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mappedRegistrations = teams.map((team: any) => ({
    id: team.id,
    teamName: team.team_name,
    iglName: team.igl_name,
    iglPhone: team.igl_phone,
    players: team.players.map((p: any) => ({
      name: p.name,
      uid: p.uid,
    })),
    paymentScreenshot: team.payment_screenshot_url,
    status: team.status,
    createdAt: team.created_at,
    paymentAmount: team.payment_amount,
    paymentVerified: team.payment_verified,
  }));

  return NextResponse.json({
    registrations: mappedRegistrations,
    total: mappedRegistrations.length,
    pending: mappedRegistrations.filter((r: any) => r.status === 'pending').length,
    approved: mappedRegistrations.filter((r: any) => r.status === 'approved').length,
    rejected: mappedRegistrations.filter((r: any) => r.status === 'rejected').length,
  });
}
