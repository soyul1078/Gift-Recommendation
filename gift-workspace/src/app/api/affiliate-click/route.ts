import { NextResponse } from "next/server";

type Body = { merchant?: string; giftId?: string };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const merchant =
    typeof body.merchant === "string" ? body.merchant.slice(0, 32) : "";
  const giftId =
    typeof body.giftId === "string" ? body.giftId.slice(0, 64) : "";
  if (!merchant || !giftId) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const webhook = process.env.AFFILIATE_CLICK_WEBHOOK?.trim();
  if (webhook) {
    const payload = JSON.stringify({
      merchant,
      giftId,
      at: new Date().toISOString(),
    });
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
    } catch {
      /* webhook 실패는 사용자 동선에 영향 없음 */
    }
  }

  return new NextResponse(null, { status: 204 });
}
