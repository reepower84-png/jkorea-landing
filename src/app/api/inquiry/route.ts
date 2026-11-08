import { NextRequest, NextResponse } from "next/server";
import { backupFetch } from "../../../lib/inquiry-backup";

// Discord 웹후크로 알림 직접 전송
async function sendDiscordNotification(name: string, phone: string, message: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Discord webhook URL is not configured");
  }

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

  const response = await backupFetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(embed),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Discord webhook failed: ${response.status} ${errorText}`);
  }
}

// POST - 새 문의 접수 (Discord 직접 전송)
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

    // Discord로 알림 직접 전송
    await sendDiscordNotification(name.trim(), phone.trim(), message.trim());

    return NextResponse.json({
      success: true,
      message: "문의가 접수되었습니다.",
    });
  } catch (error) {
    console.error("Error sending inquiry:", error);
    return NextResponse.json(
      { error: "문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

