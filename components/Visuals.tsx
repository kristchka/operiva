import type { Dict } from "@/content";

/** Схема НАЛ: ядро и три вида памяти. Общий принцип, без внутреннего устройства. */
export function NalVisual({ center, labels }: { center: string; labels: string[] }) {
  return (
    <div className="nal-visual" role="img" aria-label={`${center}: ${labels.join(", ")}`}>
      <span className="ring r3" />
      <span className="ring r2" />
      <span className="ring r1" />
      <span className="nal-core">{center}</span>
      <span className="nal-tag" style={{ top: "68%", left: "50%", transform: "translateX(-50%)" }}>{labels[0]}</span>
      <span className="nal-tag" style={{ top: "18%", left: "8%" }}>{labels[1]}</span>
      <span className="nal-tag" style={{ bottom: "6%", right: "4%" }}>{labels[2]}</span>
    </div>
  );
}

/** Сайт клиента со встроенным помощником — демонстрация. */
export function SiteMock({ m }: { m: Dict["mock"] }) {
  return (
    <div className="site-mock" aria-hidden>
      <div className="bar"><i /><i /><i /></div>
      <div className="page">
        <div className="ph" style={{ width: "40%", height: 14 }} />
        <div className="ph" style={{ width: "70%" }} />
        <div className="ph" style={{ width: "55%" }} />
        <div className="ph" style={{ width: "62%" }} />
        <div className="widget">
          <div className="bubble ai">{m.widgetHello}</div>
          <div className="bubble guest">{m.widgetQ}</div>
          <div className="bubble ai">{m.widgetA}</div>
          <div className="lead-ok">✓ {m.widgetLead}</div>
        </div>
      </div>
    </div>
  );
}
