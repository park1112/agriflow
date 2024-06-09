// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '../lib/firebaseAdmin';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const userId = decodedToken.uid;
      const userDoc = await adminDb.collection('users').doc(userId).get();
      const role = userDoc.data()?.role;

      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/user', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

// 이 파일을 최상위 폴더에 위치시키고, next.config.js 파일에 이 미들웨어를 등록합니다.
