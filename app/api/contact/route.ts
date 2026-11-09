import { NextResponse } from "next/server";

/**
 * Приём обращений из формы и чата.
 * Доставка подключается через CONTACT_WEBHOOK_URL (CRM, бот, почтовый сервис).
 * Пока переменная не задана — возвращаем 503, и форма честно сообщает, что отправка не подключена.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Ловушка для ботов: делаем вид, что всё хорошо.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const payload = {
    source: str(body.source, 20) || "form",
    locale: str(body.locale, 5),
    topic: str(body.topic, 100),
    name: str(body.name, 200),
    company: str(body.company, 200),
    contact: str(body.contact, 200),
    task: str(body.task, 5000),
    receivedAt: new Date().toISOString(),
  };
  if (!payload.name || !payload.contact || !payload.task) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ ok: false, error: "delivery_not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] delivery failed", e);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
