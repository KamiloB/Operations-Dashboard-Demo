const statusLabel = {
  pending: "Pendientes",
  approved: "Aprobadas",
  rejected: "Rechazadas",
};

const statusTone = {
  pending: "status-pending",
  approved: "status-approved",
  rejected: "status-rejected",
};

export default function StatusBreakdown({ status }) {
  const total = Object.values(status).reduce((sum, count) => sum + count, 0);

  return (
    <section className="panel-card">
      <header className="panel-header">
        <h3>Metricas de inscripciones</h3>
        <span className="muted">{total} registros</span>
      </header>

      <div className="status-list">
        {Object.entries(status).map(([key, count]) => {
          const percent = total === 0 ? 0 : Math.round((count / total) * 100);
          return (
            <article key={key} className="status-row">
              <div className="row-top">
                <span className={`status-chip ${statusTone[key]}`}>{statusLabel[key]}</span>
                <strong>{count}</strong>
              </div>
              <div className="bar-track">
                <div className={`bar-fill ${statusTone[key]}`} style={{ width: `${percent}%` }} />
              </div>
              <small>{percent}% del total</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}
