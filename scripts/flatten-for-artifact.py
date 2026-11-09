"""Готовит out/ к публикации как артефакт Claude (сайт лежит во вложенной папке хостинга):
- _next → nxa (папки с «_» в начале зарезервированы);
- все пути от корня → относительные;
- убирает служебные .txt-файлы навигации;
- экранирует символ U+FFFD в скриптах."""
import os, re, shutil, sys

out = sys.argv[1] if len(sys.argv) > 1 else "out"
LOC = "ru|en|de|es|it|fr|ka|pt"

for r, _, files in os.walk(out):
    for f in files:
        if f.endswith(".txt") and f != "robots.txt":
            os.remove(os.path.join(r, f))
for d in ("_not-found", "404"):
    shutil.rmtree(os.path.join(out, d), ignore_errors=True)
if os.path.isdir(os.path.join(out, "_next")):
    shutil.move(os.path.join(out, "_next"), os.path.join(out, "nxa"))

for r, _, files in os.walk(out):
    for f in files:
        p = os.path.join(r, f)
        if not f.endswith((".html", ".js", ".css")):
            continue
        s = open(p, encoding="utf-8").read()
        t = s.replace("/_next/", "/nxa/").replace('"/_next"', '"/nxa"')
        if f.endswith(".js"):
            t = t.replace("�", "\\ufffd")
        if f.endswith(".css"):
            t = t.replace("/nxa/static/media/", "../media/")
        if f.endswith(".html"):
            depth = os.path.relpath(r, out).count(os.sep) + (0 if os.path.relpath(r, out) == "." else 1)
            rel = "../" * depth or "./"
            # В атрибутах — относительные пути; внутри данных страницы пути правит скрипт ниже.
            t = re.sub(r'(href|src)="/nxa/', lambda m: f'{m.group(1)}="{rel}nxa/', t)
            t = re.sub(r'(href|src)="/(%s)/' % LOC, lambda m: f'{m.group(1)}="{rel}{m.group(2)}/', t)
            t = re.sub(r'(href|src)="/(icon\.svg[^"]*)"', lambda m: f'{m.group(1)}="{rel}{m.group(2)}"', t)
            t = t.replace('href="/"', f'href="{rel}index.html"')
            # Базовый путь для догружаемых скриптов — относительно текущей страницы.
            base = ("<script>(function(){var b=new URL(%r,location.href).pathname;self.TURBOPACK_CHUNK_BASE_PATH=b;"
                    "function fix(args){for(var i=0;i<args.length;i++){var x=args[i];if(x&&typeof x[1]==='string')x[1]=x[1].split('\"/nxa/').join('\"'+b);}}"
                    "var a=self.__next_f||[];var cur=function(){fix(arguments);return Array.prototype.push.apply(a,arguments)};"
                    "Object.defineProperty(a,'push',{configurable:true,get:function(){return cur},set:function(fn){cur=function(){fix(arguments);return fn.apply(this,arguments)}}});"
                    "self.__next_f=a})()</script>") % (rel + "nxa/")
            t = t.replace("<head>", "<head>" + base, 1)
        if t != s:
            open(p, "w", encoding="utf-8").write(t)
print("ok")
