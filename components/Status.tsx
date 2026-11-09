import type { Readiness } from "@/lib/site";
import type { Dict } from "@/content";

export function formatEta(eta: string, d: Dict) {
  const [y, m] = eta.split("-").map(Number);
  return `${d.ui.months[m - 1]} ${y}`;
}

export function Status({ r, d, showNoDate = false }: { r: Readiness; d: Dict; showNoDate?: boolean }) {
  return (
    <div className="badges">
      {r.kind === "pilot" ? (
        <span className="badge badge-pilot">{d.ui.status.pilot}</span>
      ) : (
        <span className="badge badge-proto">{d.ui.status.prototype}</span>
      )}
      {r.kind === "prototype" && r.eta && (
        <span className="badge badge-eta">
          {d.ui.status.eta}: {formatEta(r.eta, d)}*
        </span>
      )}
      {r.kind === "prototype" && !r.eta && showNoDate && (
        <span className="badge badge-eta">{d.ui.status.noDate}</span>
      )}
    </div>
  );
}

export function DemoBadge({ label }: { label: string }) {
  return <span className="badge badge-demo">{label}</span>;
}
