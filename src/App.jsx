import { useMemo, useState } from "react";
import KpiCard from "./components/KpiCard";
import StatusBreakdown from "./components/StatusBreakdown";
import { demoContext, enrollments, students, payments, places } from "./data/mockDashboard";
import { buildDashboardModel } from "./utils/metrics";

const formatCOP = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const weekday = new Intl.DateTimeFormat("es-CO", { dateStyle: "long" });
const NOW = new Date("2026-04-16T00:00:00.000Z");

const TAB_OPTIONS = [
  { key: "today", label: "Hoy", days: 1 },
  { key: "7d", label: "7 días", days: 7 },
  { key: "30d", label: "30 días", days: 30 },
];

function SocialIcon({ href, label, children }) {
  return (
    <a
      className="social-link"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
    >
      {children}
    </a>
  );
}

export default function App() {
  const [timeTab, setTimeTab] = useState("30d");
  const [viewMode, setViewMode] = useState("list");
  const [kpiFilter, setKpiFilter] = useState("all");
  const [sessionPayments, setSessionPayments] = useState(payments);
  const [resolvedExpired, setResolvedExpired] = useState({});
  const [notice, setNotice] = useState("");

  const selectedTab = TAB_OPTIONS.find((tab) => tab.key === timeTab) || TAB_OPTIONS[2];

  const filteredEnrollments = useMemo(() => {
    const threshold = NOW.getTime() - selectedTab.days * 24 * 60 * 60 * 1000;
    return enrollments.filter(
      (enrollment) => new Date(enrollment.createdAt).getTime() >= threshold
    );
  }, [selectedTab.days]);

  const filteredPayments = useMemo(() => {
    const threshold = NOW.getTime() - selectedTab.days * 24 * 60 * 60 * 1000;
    return sessionPayments.filter((payment) => new Date(payment.paidAt).getTime() >= threshold);
  }, [sessionPayments, selectedTab.days]);

  const periodDashboard = useMemo(
    () =>
      buildDashboardModel({
        enrollments: filteredEnrollments,
        students,
        payments: filteredPayments,
        places,
        now: NOW,
      }),
    [filteredEnrollments, filteredPayments]
  );

  const fullDashboard = useMemo(
    () =>
      buildDashboardModel({ enrollments, students, payments: sessionPayments, places, now: NOW }),
    [sessionPayments]
  );

  const enrollmentsByPlace = Object.entries(periodDashboard.byPlace).sort(([, a], [, b]) => b - a);

  const filteredEnrollmentList = useMemo(() => {
    if (kpiFilter === "all") return filteredEnrollments;
    if (kpiFilter === "total") return filteredEnrollments;
    return filteredEnrollments.filter((item) => item.status === kpiFilter);
  }, [filteredEnrollments, kpiFilter]);

  const openDetail = (filter) => {
    setKpiFilter(filter);
    setNotice(
      `Filtro activo: ${filter === "all" ? "todos" : filter}. Simulación en sesión actual.`
    );
    setTimeout(() => setNotice(""), 2200);
  };

  const handleWhatsapp = (student) => {
    const message = encodeURIComponent(
      `Hola ${student.fullName}, te escribimos desde ${demoContext.clubName} para regularizar tu pago vencido.`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener,noreferrer");
    setNotice(`Se abrió WhatsApp para ${student.fullName}. Acción simulada.`);
    setTimeout(() => setNotice(""), 2200);
  };

  const markAsPaid = (student) => {
    const paidAt = new Date(NOW);
    const validUntil = new Date(NOW);
    validUntil.setDate(validUntil.getDate() + 30);

    setSessionPayments((prev) => [
      {
        id: `pay-demo-${crypto.randomUUID()}`,
        studentId: student.studentId,
        amount: 90000,
        status: "paid",
        paidAt: paidAt.toISOString(),
        validUntil: validUntil.toISOString(),
      },
      ...prev,
    ]);

    setNotice(`${student.fullName} marcado como pagado (mock).`);
    setTimeout(() => setNotice(""), 2200);
  };

  const resolveExpired = (student) => {
    setResolvedExpired((prev) => ({ ...prev, [student.studentId]: true }));
    setNotice(`Caso de ${student.fullName} marcado como resuelto en esta sesión.`);
    setTimeout(() => setNotice(""), 2200);
  };

  const visibleExpired = fullDashboard.paymentHealth.expiredStudents.filter(
    (student) => !resolvedExpired[student.studentId]
  );

  return (
    <main className="dashboard-shell">
      <header className="hero">
        <p className="eyebrow">Demo interactivo</p>
        <h1>Dashboard operativo: estado y acciones pendientes</h1>
        <p>
          {demoContext.clubName} · {demoContext.sportName} · Corte al{" "}
          {weekday.format(new Date(demoContext.generatedAt))}
        </p>

        <div className="social-links" aria-label="Redes y portafolio">
          <SocialIcon href="https://www.instagram.com/kamilo_blandon" label="Instagram">
            <svg viewBox="0 0 24 24">
              <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://github.com/KamiloB" label="GitHub">
            <svg viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.17-1.11-1.48-1.11-1.48-.91-.61.07-.59.07-.59 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.25-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.56 1.42.21 2.47.11 2.73.64.72 1.03 1.63 1.03 2.75 0 3.95-2.35 4.83-4.59 5.08.36.32.68.95.68 1.93v2.86c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://kamilob.dev" label="Portafolio">
            <svg viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.93 9h-3.07a15.6 15.6 0 0 0-1.37-5.02A8.03 8.03 0 0 1 19.93 11zM12 4c1.37 0 2.95 2.2 3.57 7H8.43C9.05 6.2 10.63 4 12 4zM4.07 13h3.07a15.6 15.6 0 0 0 1.37 5.02A8.03 8.03 0 0 1 4.07 13zm3.07-2H4.07a8.03 8.03 0 0 1 4.44-5.02A15.6 15.6 0 0 0 7.14 11zm4.86 9c-1.37 0-2.95-2.2-3.57-7h7.14c-.62 4.8-2.2 7-3.57 7zm3.49-1.98A15.6 15.6 0 0 0 16.86 13h3.07a8.03 8.03 0 0 1-4.44 5.02z" />
            </svg>
          </SocialIcon>
        </div>
      </header>

      <section className="controls-bar panel-card">
        <div className="tab-group" role="tablist" aria-label="Rango de tiempo">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              className={`chip-btn ${timeTab === tab.key ? "chip-active" : ""}`}
              aria-selected={timeTab === tab.key}
              onClick={() => setTimeTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="toggle-group" aria-label="Cambiar vista">
          <button
            className={`chip-btn ${viewMode === "list" ? "chip-active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            Vista lista
          </button>
          <button
            className={`chip-btn ${viewMode === "cards" ? "chip-active" : ""}`}
            onClick={() => setViewMode("cards")}
          >
            Vista tarjetas
          </button>
        </div>
      </section>

      {notice && <p className="session-note">{notice}</p>}

      <section className="alert-grid">
        <article className="action-card action-danger">
          <h2>⚠ Pagos vencidos</h2>
          <p className="big-number">{visibleExpired.length}</p>
          <p>
            {visibleExpired.length > 0
              ? "Alumnos que requieren seguimiento inmediato."
              : "No hay alumnos con pagos vencidos."}
          </p>
        </article>

        <article className="action-card action-warning">
          <h2>🕒 Inscripciones pendientes</h2>
          <p className="big-number">{periodDashboard.actionItems.pendingEnrollments}</p>
          <p>Solicitudes esperando revisión administrativa para pasar a alumnos activos.</p>
        </article>
      </section>

      <section className="kpi-grid">
        <KpiCard
          title="Total registros"
          value={periodDashboard.totalEnrollments}
          hint={
            selectedTab.key === "today"
              ? "Total de registros de hoy"
              : `Total de registros de los últimos ${selectedTab.label.toLowerCase()}`
          }
          detail="Click para filtrar la lista"
          tone="neutral"
          active={kpiFilter === "total" || kpiFilter === "all"}
          onClick={() => setKpiFilter("total")}
          onDetail={() => openDetail("total")}
        />
        <KpiCard
          title="Pending"
          value={periodDashboard.enrollmentStatus.pending}
          hint="Pendientes por validar"
          detail="Click para filtrar los pagos pendientes"
          tone="warning"
          active={kpiFilter === "pending"}
          onClick={() => setKpiFilter("pending")}
          onDetail={() => openDetail("pending")}
        />
        <KpiCard
          title="Approved"
          value={periodDashboard.enrollmentStatus.approved}
          hint="Convertidas a alumnos"
          detail="Click para filtrar los pagos aprobados"
          tone="success"
          active={kpiFilter === "approved"}
          onClick={() => setKpiFilter("approved")}
          onDetail={() => openDetail("approved")}
        />
        <KpiCard
          title="Rejected"
          value={periodDashboard.enrollmentStatus.rejected}
          hint="No avanzaron en revisión"
          detail="Click para filtrar los pagos rechazados"
          tone="danger"
          active={kpiFilter === "rejected"}
          onClick={() => setKpiFilter("rejected")}
          onDetail={() => openDetail("rejected")}
        />
      </section>

      <section className="content-grid">
        <StatusBreakdown status={periodDashboard.enrollmentStatus} />

        <section className="panel-card">
          <header className="panel-header">
            <h3>Pagos vencidos</h3>
          </header>

          <div className="duo-stats">
            <div>
              <p>Alumnos activos</p>
              <strong>{fullDashboard.paymentHealth.activeStudents}</strong>
            </div>
            <div>
              <p>Al día</p>
              <strong className="text-success">{fullDashboard.paymentHealth.paidStudents}</strong>
            </div>
          </div>

          <h4 className="list-title">Requieren acción</h4>
          <ul className="risk-list">
            {visibleExpired.map((student) => (
              <li key={student.studentId}>
                <div>
                  <span>{student.fullName}</span>
                  <span className="status-chip status-rejected">{student.reason}</span>
                </div>
                <div className="inline-actions">
                  <button className="btn btn-soft" onClick={() => handleWhatsapp(student)}>
                    Contactar por WhatsApp
                  </button>
                  <button className="btn btn-soft" onClick={() => markAsPaid(student)}>
                    Marcar como pagado
                  </button>
                  <button className="btn btn-primary" onClick={() => resolveExpired(student)}>
                    Resolver
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel-card">
          <header className="panel-header">
            <h3>Ingresos y sedes</h3>
            <span className="muted">Agrupaciones operativas ({selectedTab.label})</span>
          </header>

          <article className="income-box">
            <p>Ingresos del periodo</p>
            <strong>{formatCOP(periodDashboard.income30Days)}</strong>
          </article>

          <h4 className="list-title">Inscripciones por sede</h4>
          <div className="place-list">
            {enrollmentsByPlace.map(([name, count]) => (
              <div key={name} className="place-row">
                <span>{name}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="panel-card">
        <header className="panel-header">
          <h3>Bandeja de detalle ({selectedTab.label})</h3>
          <span className="muted">Filtro activo: {kpiFilter}</span>
        </header>

        {viewMode === "list" ? (
          <ul className="detail-list">
            {filteredEnrollmentList.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.student?.fullName || "Alumno"}</strong>
                  <p>
                    {new Date(item.createdAt).toLocaleDateString("es-CO")} · {item.id}
                  </p>
                </div>
                <span className={`status-chip status-${item.status}`}>{item.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="detail-cards">
            {filteredEnrollmentList.map((item) => (
              <article key={item.id} className="mini-card">
                <p className="muted">{item.id}</p>
                <h4>{item.student?.fullName || "Alumno"}</h4>
                <p>{new Date(item.createdAt).toLocaleDateString("es-CO")}</p>
                <span className={`status-chip status-${item.status}`}>{item.status}</span>
              </article>
            ))}
          </div>
        )}

        {filteredEnrollmentList.length === 0 && (
          <p className="muted">No hay registros para este filtro.</p>
        )}
      </section>
    </main>
  );
}
