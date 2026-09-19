import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, token } = await request.json();

    // Token-based login — a long-lived personal access link (/admin?token=...)
    // so the same device doesn't need the username/password every time.
    const envAccessToken = process.env.ADMIN_ACCESS_TOKEN;
    if (token && envAccessToken && token === envAccessToken) {
      return NextResponse.json({
        success: true,
        message: 'Admin authenticated via access token',
      });
    }

    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@quantumnexusglobal.org').toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'qng@admin2026';

    const inputEmail = (email || '').toLowerCase().trim();
    const isEmailMatch =
      inputEmail === envAdminEmail ||
      inputEmail === 'admin' ||
      inputEmail === 'quantumnexusglobal.org' ||
      inputEmail === 'admin@quantumnexusglobal.org';

    const isPasswordMatch = password === envAdminPassword;

    if (isEmailMatch && isPasswordMatch) {
      return NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid admin username / email or password.',
      },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Error in admin auth API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
