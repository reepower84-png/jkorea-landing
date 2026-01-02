import { NextRequest, NextResponse } from "next/server";

// 어드민 비밀번호 설정 (실제 운영 시 환경변수로 관리 권장)
const ADMIN_PASSWORD = "jkorea2024!";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      // 인증 성공 - 세션 토큰 생성
      const token = Buffer.from(`admin:${Date.now()}`).toString("base64");

      const response = NextResponse.json({
        success: true,
        message: "인증되었습니다.",
      });

      // 쿠키에 토큰 저장 (24시간 유효)
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24시간
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "인증 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 인증 상태 확인
export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token");

  if (token && token.value) {
    try {
      const decoded = Buffer.from(token.value, "base64").toString();
      if (decoded.startsWith("admin:")) {
        return NextResponse.json({ authenticated: true });
      }
    } catch {
      // 토큰 파싱 실패
    }
  }

  return NextResponse.json({ authenticated: false });
}

// 로그아웃
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "로그아웃되었습니다.",
  });

  response.cookies.delete("admin_token");

  return response;
}
