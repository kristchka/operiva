// Копия действующего обработчика (для локальной проверки; в репозитории сайта файл не меняется).
const LIMIT_BYTES = 8192;
const MIN_FILL_MS = 2500;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

const CTRL = new RegExp('[\\u0000-\\u001F\\u007F]', 'g');

function clean(v, limit) {
  if (typeof v !== 'string') return '';
  return v.replace(CTRL, '').trim().slice(0, limit);
}

export async function onRequestPost({ request, env }) {
  if (Number(request.headers.get('content-length') || 0) > LIMIT_BYTES) {
    return json(413, { ok: false, error: 'too_large' });
  }

  let data;
  try {
    data = await request.json();
  } catch (e) {
    return json(400, { ok: false, error: 'bad_json' });
  }

  if (clean(data.website, 100) !== '') return json(200, { ok: true });

  const elapsed = Number(data.elapsed) || 0;
  if (elapsed > 0 && elapsed < MIN_FILL_MS) return json(200, { ok: true });

  const name = clean(data.name, 120);
  const contact = clean(data.contact, 180);
  if (!name || !contact) return json(422, { ok: false, error: 'required' });

  const token = env.TELEGRAM_BOT_TOKEN;
  const chat = env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return json(503, { ok: false, error: 'not_configured' });

  const origin = (() => {
    try { return new URL(request.url).origin; } catch (e) { return ''; }
  })();
  const host = origin.replace(/^https?:\/\//, '');
  const isPreview = /\.pages\.dev$/.test(host);
  const source = isPreview ? 'НОВЫЙ САЙТ (служебный адрес)' : 'НОВЫЙ САЙТ';
  const page = clean(data.page, 300) || '/';

  const lines = [
    '[' + source + ']',
    '',
    'Форма: ' + (clean(data.form, 60) || 'не указана'),
    'Имя: ' + name,
    'Компания: ' + (clean(data.company, 160) || 'не указано'),
    'Отрасль: ' + (clean(data.industry, 120) || 'не указано'),
    'Процесс: ' + (clean(data.process, 600) || 'не указано'),
    'Контакт: ' + contact,
    '',
    'Страница: ' + origin + page,
    'Время: ' + new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
  ];

  // Локальная проверка: вместо Telegram пишем текст уведомления в лог.
  if (env.LOCAL_DRY_RUN) { console.log('LEAD>>' + JSON.stringify(lines)); return json(200, { ok: true }); }

  const res = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text: lines.join('\n'), disable_web_page_preview: true }),
  });

  if (!res.ok) {
    return json(502, { ok: false, error: 'delivery_failed' });
  }

  return json(200, { ok: true });
}

export function onRequestGet() {
  return json(405, { ok: false, error: 'method_not_allowed' });
}
