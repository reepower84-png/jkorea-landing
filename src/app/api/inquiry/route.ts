import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Discord 웹후크로 알림 전송
async function sendDiscordNotification(name: string, phone: string, message: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Discord webhook URL is not configured");
    return;
  }

  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const timestamp = koreaTime.toISOString().replace('T', ' ').slice(0, 19);

  const embed = {
    embeds: [
      {
        title: "🔔 새로운 상담 문의가 접수되었습니다",
        color: 0xf59e0b,
        fields: [
          {
            name: "👤 이름",
            value: name,
            inline: true,
          },
          {
            name: "📞 연락처",
            value: phone,
            inline: true,
          },
          {
            name: "💬 문의 내용",
            value: message,
            inline: false,
          },
        ],
        footer: {
          text: "조력자들 | 상담 문의",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(embed),
    });

    if (!response.ok) {
      console.error("Discord webhook failed:", response.status, await response.text());
    }
  } catch (error) {
    console.error("Discord webhook error:", error);
  }
}

// POST - 새 문의 접수
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    // 유효성 검사
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    // 전화번호 형식 검증 (간단한 검증)
    const phoneRegex = /^[0-9-]{10,14}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "올바른 전화번호 형식을 입력해주세요." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("inquiries")
      .insert([
        {
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim(),
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "데이터 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    // Discord로 알림 전송 (비동기로 처리, 실패해도 사용자 응답에 영향 없음)
    sendDiscordNotification(name.trim(), phone.trim(), message.trim());

    return NextResponse.json({
      success: true,
      message: "문의가 접수되었습니다.",
      id: data.id,
    });
  } catch (error) {
    console.error("Error saving inquiry:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET - 문의 목록 조회 (어드민용)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "문의 목록을 불러오는데 실패했습니다." },
        { status: 500 }
      );
    }

    // 프론트엔드 호환을 위해 created_at을 createdAt으로 변환
    const inquiries = data.map((item) => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      message: item.message,
      createdAt: item.created_at,
      status: item.status,
    }));

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "문의 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

// PATCH - 문의 상태 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID와 상태를 입력해주세요." },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "contacted", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "유효하지 않은 상태입니다." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "상태 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "상태가 업데이트되었습니다.",
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "상태 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }
}

// DELETE - 문의 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "삭제할 문의 ID를 입력해주세요." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("inquiries").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "문의 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "문의가 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "문의 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
