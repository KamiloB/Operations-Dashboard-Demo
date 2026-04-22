const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getTotalEnrollments(enrollments = []) {
  return enrollments.length;
}

export function getStatusBreakdown(enrollments = []) {
  const base = { pending: 0, approved: 0, rejected: 0 };

  return enrollments.reduce((acc, enrollment) => {
    if (acc[enrollment.status] !== undefined) {
      acc[enrollment.status] += 1;
    }
    return acc;
  }, base);
}

export function getIncome30Days(payments = [], now = new Date()) {
  const threshold = now.getTime() - 30 * MS_PER_DAY;

  return payments
    .filter((payment) => payment.status === "paid")
    .filter((payment) => new Date(payment.paidAt).getTime() >= threshold)
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);
}

export function getPaymentHealth(students = [], payments = [], now = new Date()) {
  const activeStudents = students.filter((student) => student.status === "active");

  const grouped = payments.reduce((acc, payment) => {
    if (payment.status !== "paid") return acc;
    if (!acc[payment.studentId]) acc[payment.studentId] = [];
    acc[payment.studentId].push(payment);
    return acc;
  }, {});

  const statusByStudent = activeStudents.map((student) => {
    const history = grouped[student.id] || [];

    if (history.length === 0) {
      return {
        studentId: student.id,
        fullName: student.student?.fullName || "Alumno sin nombre",
        state: "expired",
        reason: "Sin pagos registrados",
      };
    }

    const lastPayment = [...history].sort(
      (a, b) => new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime()
    )[0];

    const isValid = new Date(lastPayment.validUntil).getTime() >= now.getTime();

    return {
      studentId: student.id,
      fullName: student.student?.fullName || "Alumno sin nombre",
      state: isValid ? "paid" : "expired",
      reason: isValid
        ? "Pago vigente"
        : `Venció ${new Date(lastPayment.validUntil).toLocaleDateString("es-CO")}`,
    };
  });

  return {
    activeStudents: activeStudents.length,
    paidStudents: statusByStudent.filter((item) => item.state === "paid").length,
    expiredStudents: statusByStudent.filter((item) => item.state === "expired"),
  };
}

export function getEnrollmentsByPlace(enrollments = [], places = []) {
  const placeMap = new Map(places.map((place) => [place.id, place.name]));

  return enrollments.reduce((acc, enrollment) => {
    const placeId = enrollment.training?.placeId || "unknown";
    const placeName = placeMap.get(placeId) || "Sin sede";

    if (!acc[placeName]) acc[placeName] = 0;
    acc[placeName] += 1;
    return acc;
  }, {});
}

export function buildDashboardModel({ enrollments, students, payments, places, now }) {
  const totalEnrollments = getTotalEnrollments(enrollments);
  const enrollmentStatus = getStatusBreakdown(enrollments);
  const income30Days = getIncome30Days(payments, now);
  const paymentHealth = getPaymentHealth(students, payments, now);
  const byPlace = getEnrollmentsByPlace(enrollments, places);

  return {
    totalEnrollments,
    enrollmentStatus,
    income30Days,
    paymentHealth,
    byPlace,
    actionItems: {
      pendingEnrollments: enrollmentStatus.pending,
      expiredPayments: paymentHealth.expiredStudents.length,
    },
  };
}
