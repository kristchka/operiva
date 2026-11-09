// Копия действующей функции (для локальной проверки; в репозитории сайта файл не меняется).
const CANONICAL = 'operiva.tech';

export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  if (url.hostname === 'www.' + CANONICAL) {
    url.hostname = CANONICAL;
    return Response.redirect(url.toString(), 301);
  }

  return next();
}
