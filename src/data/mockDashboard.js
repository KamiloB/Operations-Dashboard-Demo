export const demoContext = {
  clubName: "Guerreros Club",
  sportName: "Taekwondo",
  generatedAt: "2026-04-15T10:00:00.000Z",
};

export const enrollments = [
  {
    id: "enr-001",
    status: "pending",
    createdAt: "2026-04-14T08:15:00.000Z",
    student: { fullName: "Sofía Rojas" },
    training: { placeId: "place-centro" },
  },
  {
    id: "enr-002",
    status: "approved",
    createdAt: "2026-04-10T11:20:00.000Z",
    student: { fullName: "Tomás Pérez" },
    training: { placeId: "place-centro" },
  },
  {
    id: "enr-003",
    status: "rejected",
    createdAt: "2026-04-09T16:40:00.000Z",
    student: { fullName: "Laura Díaz" },
    training: { placeId: "place-norte" },
  },
  {
    id: "enr-004",
    status: "pending",
    createdAt: "2026-04-12T14:00:00.000Z",
    student: { fullName: "Mateo Gómez" },
    training: { placeId: "place-sur" },
  },
  {
    id: "enr-005",
    status: "approved",
    createdAt: "2026-03-28T09:30:00.000Z",
    student: { fullName: "Valentina Ruiz" },
    training: { placeId: "place-norte" },
  },
  {
    id: "enr-006",
    status: "approved",
    createdAt: "2026-03-24T09:30:00.000Z",
    student: { fullName: "Samuel Torres" },
    training: { placeId: "place-centro" },
  },
];

export const students = [
  { id: "stu-001", status: "active", student: { fullName: "Tomás Pérez" } },
  { id: "stu-002", status: "active", student: { fullName: "Valentina Ruiz" } },
  { id: "stu-003", status: "active", student: { fullName: "Samuel Torres" } },
  { id: "stu-004", status: "active", student: { fullName: "Sofía Rojas" } },
  { id: "stu-005", status: "active", student: { fullName: "Mateo Gómez" } },
];

export const payments = [
  {
    id: "pay-001",
    studentId: "stu-001",
    amount: 95000,
    status: "paid",
    paidAt: "2026-04-12T11:00:00.000Z",
    validUntil: "2026-05-12T00:00:00.000Z",
  },
  {
    id: "pay-002",
    studentId: "stu-002",
    amount: 90000,
    status: "paid",
    paidAt: "2026-04-02T15:00:00.000Z",
    validUntil: "2026-05-02T00:00:00.000Z",
  },
  {
    id: "pay-003",
    studentId: "stu-003",
    amount: 90000,
    status: "paid",
    paidAt: "2026-03-01T09:00:00.000Z",
    validUntil: "2026-03-31T00:00:00.000Z",
  },
  {
    id: "pay-004",
    studentId: "stu-003",
    amount: 90000,
    status: "paid",
    paidAt: "2026-04-14T09:00:00.000Z",
    validUntil: "2026-05-14T00:00:00.000Z",
  },
];

export const places = [
  { id: "place-centro", name: "Sede Centro" },
  { id: "place-norte", name: "Sede Norte" },
  { id: "place-sur", name: "Sede Sur" },
];
