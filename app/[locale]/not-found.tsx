import Link from "@/components/SmartLink";

export default function NotFound() {
  return (
    <section className="hero page-hero">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1>Страница не найдена / Page not found</h1>
        <Link className="btn btn-primary" href="/">OPERIVA →</Link>
      </div>
    </section>
  );
}
