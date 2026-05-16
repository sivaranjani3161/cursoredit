import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://127.0.0.1:3001';

async function forward(req: NextRequest, path: string[]) {
  const joinedPath = path.join('/');
  const query = req.nextUrl.search || '';
  const target = `${BACKEND_URL}/api/${joinedPath}${query}`;

  // ── Log every proxied request so you can see what's hitting the backend ──
  console.log(`[proxy] ${req.method} → ${target}`);

  const headers = new Headers();
  const incomingContentType = req.headers.get('content-type');
  if (incomingContentType) headers.set('content-type', incomingContentType);

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: 'no-store',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (incomingContentType?.includes('multipart/form-data')) {
      init.body = await req.formData();
      headers.delete('content-type');
    } else {
      init.body = await req.text();
    }
  }

  try {
    const upstream = await fetch(target, init);
    const body = await upstream.text();

    // ── Log non-2xx responses so you can see what the backend actually says ──
    if (!upstream.ok) {
      console.error(
        `[proxy] ${req.method} ${target} → ${upstream.status} ${upstream.statusText}\n`,
        body.slice(0, 500), // first 500 chars to avoid log spam
      );
    }

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to connect to backend';
    console.error(`[proxy] fetch failed for ${target}:`, msg);
    return NextResponse.json(
      {
        error: 'Backend service unavailable',
        details: msg,
        target,
      },
      { status: 502 },
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}