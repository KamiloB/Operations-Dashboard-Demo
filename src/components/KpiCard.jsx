const toneMap = {
  neutral: "kpi-neutral",
  warning: "kpi-warning",
  success: "kpi-success",
  danger: "kpi-danger",
};

export default function KpiCard({
  title,
  value,
  hint,
  detail,
  tone = "neutral",
  active = false,
  onClick,
  onDetail,
}) {
  const className = `kpi-card ${toneMap[tone] || toneMap.neutral} ${active ? "kpi-active" : ""}`;

  return (
    <article
      className={className}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <p className="kpi-title">{title}</p>
      <p className="kpi-value">{value}</p>
      {hint && <p className="kpi-hint">{hint}</p>}
      {detail && <p className="kpi-detail">{detail}</p>}
      <button
        className="btn btn-soft"
        onClick={(event) => {
          event.stopPropagation();
          onDetail?.();
        }}
      >
        Ver detalle
      </button>
    </article>
  );
}
