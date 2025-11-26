// app/google9ad10b3aac9ea576.html/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('google-site-verification: google9ad10b3aac9ea576.html', {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}