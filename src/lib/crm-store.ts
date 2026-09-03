import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_FILE = path.join(process.cwd(), ".puck", "crm.json");

function uid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

export type CrmData = {
  pipelineStages: any[];
  companies: any[];
  contacts: any[];
  deals: any[];
  projects: any[];
  tasks: any[];
  tickets: any[];
  ticketMessages: any[];
  activities: any[];
  teamMembers: any[];
  services: any[];
  testimonials: any[];
};

const DEFAULT_STAGES = [
  { id: uid(), name: "new", label: "New Lead", order: 0, color: "#6b7280", isClosed: false, isWon: false, createdAt: now(), updatedAt: now() },
  { id: uid(), name: "qualified", label: "Qualified", order: 1, color: "#3b82f6", isClosed: false, isWon: false, createdAt: now(), updatedAt: now() },
  { id: uid(), name: "proposal", label: "Proposal Sent", order: 2, color: "#8b5cf6", isClosed: false, isWon: false, createdAt: now(), updatedAt: now() },
  { id: uid(), name: "negotiation", label: "Negotiation", order: 3, color: "#f59e0b", isClosed: false, isWon: false, createdAt: now(), updatedAt: now() },
  { id: uid(), name: "won", label: "Won", order: 4, color: "#22c55e", isClosed: true, isWon: true, createdAt: now(), updatedAt: now() },
  { id: uid(), name: "lost", label: "Lost", order: 5, color: "#ef4444", isClosed: true, isWon: false, createdAt: now(), updatedAt: now() },
];

function emptyData(): CrmData {
  const nowStr = now();
  const stages = DEFAULT_STAGES;

  const companies = [
    { id: uid(), name: "TechCorp Pakistan", domain: "techcorp.pk", industry: "Technology", size: "50-200", website: "https://techcorp.pk", tags: ["enterprise"], notes: "Large enterprise client", createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "Green Valley Foods", domain: "greenvalley.pk", industry: "Food & Beverage", size: "10-50", website: "https://greenvalley.pk", tags: ["sme"], notes: "Growing food chain", createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "NovaTech Solutions", domain: "novatech.io", industry: "Software", size: "200+", website: "https://novatech.io", tags: ["enterprise", "tech"], notes: "Software development company", createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "Atlas Logistics", domain: "atlaslogistics.pk", industry: "Logistics", size: "100-500", website: "https://atlaslogistics.pk", tags: ["enterprise"], notes: "National logistics provider", createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "BrightFuture Academy", domain: "brightfuture.edu.pk", industry: "Education", size: "50-200", website: "https://brightfuture.edu.pk", tags: ["education"], notes: "Leading educational institution", createdAt: nowStr, updatedAt: nowStr },
  ];

  const contacts = [
    { id: uid(), companyId: companies[0].id, firstName: "Ahmed", lastName: "Khan", email: "ahmed@techcorp.pk", phone: "+923001234567", title: "CTO", role: "decision-maker", source: "website", tags: [], notes: "", createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), companyId: companies[1].id, firstName: "Sara", lastName: "Ali", email: "sara@greenvalley.pk", phone: "+923007654321", title: "Marketing Director", role: "champion", source: "referral", tags: [], notes: "", createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), companyId: companies[2].id, firstName: "Usman", lastName: "Raza", email: "usman@novatech.io", phone: "+923009876543", title: "CEO", role: "decision-maker", source: "linkedin", tags: [], notes: "", createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), companyId: companies[3].id, firstName: "Fatima", lastName: "Noor", email: "fatima@atlaslogistics.pk", phone: "+923001112233", title: "Operations Manager", role: "influencer", source: "cold-outreach", tags: [], notes: "", createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), companyId: companies[4].id, firstName: "Hassan", lastName: "Malik", email: "hassan@brightfuture.edu.pk", phone: "+923004445566", title: "Director", role: "decision-maker", source: "event", tags: [], notes: "", createdAt: nowStr, updatedAt: nowStr },
  ];

  const deals = [
    { id: uid(), title: "TechCorp Website Redesign", companyId: companies[0].id, value: 1500000, currency: "PKR", stageId: stages[2].id, probability: 60, ownerId: "admin", contactIds: [contacts[0].id], expectedClose: "2026-09-30", closedAt: null, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), title: "Green Valley E-commerce", companyId: companies[1].id, value: 800000, currency: "PKR", stageId: stages[1].id, probability: 40, ownerId: "admin", contactIds: [contacts[1].id], expectedClose: "2026-10-15", closedAt: null, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), title: "NovaTech Mobile App", companyId: companies[2].id, value: 2500000, currency: "PKR", stageId: stages[3].id, probability: 75, ownerId: "admin", contactIds: [contacts[2].id], expectedClose: "2026-09-20", closedAt: null, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), title: "Atlas Fleet Tracking", companyId: companies[3].id, value: 1200000, currency: "PKR", stageId: stages[0].id, probability: 10, ownerId: "admin", contactIds: [contacts[3].id], expectedClose: "2026-11-01", closedAt: null, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), title: "BrightFuture LMS Portal", companyId: companies[4].id, value: 600000, currency: "PKR", stageId: stages[4].id, probability: 100, ownerId: "admin", contactIds: [contacts[4].id], expectedClose: "2026-08-15", closedAt: nowStr, createdAt: nowStr, updatedAt: nowStr },
  ];

  const projects = [
    { id: uid(), name: "BrightFuture LMS Portal", companyId: companies[4].id, dealId: deals[4].id, status: "active", startDate: "2026-08-01", endDate: "2026-10-30", budget: 600000, currency: "PKR", billingType: "fixed", description: "Learning management system for students", createdAt: nowStr, updatedAt: nowStr },
  ];

  const services = [
    { id: uid(), name: "Web Development", slug: "web-development", description: "Custom websites and web applications built with modern technologies.", shortDesc: "Custom websites & web apps", href: "/services/web-development", price: null, period: null, featured: true, features: ["Responsive Design", "SEO Optimized", "CMS Integration", "E-commerce"], icon: "code", order: 0, active: true, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "Mobile App Development", slug: "mobile-apps", description: "Native and cross-platform mobile applications for iOS and Android.", shortDesc: "iOS & Android apps", href: "/services/mobile-apps", price: null, period: null, featured: true, features: ["iOS & Android", "React Native", "Push Notifications", "Offline Support"], icon: "smartphone", order: 1, active: true, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "UI/UX Design", slug: "uiux-design", description: "User-centered design that drives engagement and conversions.", shortDesc: "User-centered design", href: "/services/uiux-design", price: null, period: null, featured: true, features: ["User Research", "Wireframing", "Prototyping", "Design Systems"], icon: "palette", order: 2, active: true, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "Digital Marketing", slug: "digital-marketing", description: "Data-driven marketing strategies that deliver measurable results.", shortDesc: "Data-driven marketing", href: "/services/digital-marketing", price: null, period: null, featured: true, features: ["SEO", "PPC", "Social Media", "Analytics"], icon: "trending-up", order: 3, active: true, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "Cloud & DevOps", slug: "cloud-devops", description: "Scalable cloud infrastructure and CI/CD pipelines.", shortDesc: "Cloud infrastructure", href: "/services/cloud-devops", price: null, period: null, featured: false, features: ["AWS/Azure", "Docker", "CI/CD", "Monitoring"], icon: "cloud", order: 4, active: true, createdAt: nowStr, updatedAt: nowStr },
  ];

  const teamMembers = [
    { id: uid(), name: "Ali Raza", role: "CEO & Founder", bio: "Visionary leader with 15+ years in tech.", photo: null, linkedin: null, twitter: null, email: "ali@sociolab.com.pk", order: 0, active: true, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "Sana Tariq", role: "Head of Design", bio: "Award-winning designer passionate about user experience.", photo: null, linkedin: null, twitter: null, email: "sana@sociolab.com.pk", order: 1, active: true, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "Bilal Ahmed", role: "Lead Developer", bio: "Full-stack developer specializing in React and Node.js.", photo: null, linkedin: null, twitter: null, email: "bilal@sociolab.com.pk", order: 2, active: true, createdAt: nowStr, updatedAt: nowStr },
    { id: uid(), name: "Ayesha Khan", role: "Project Manager", bio: "Certified PMP with a track record of delivering on time.", photo: null, linkedin: null, twitter: null, email: "ayesha@sociolab.com.pk", order: 3, active: true, createdAt: nowStr, updatedAt: nowStr },
  ];

  const activities = [
    { id: uid(), type: "deal-created", subject: "Created deal TechCorp Website Redesign", body: null, userId: "admin", dealId: deals[0].id, companyId: companies[0].id, contactId: contacts[0].id, projectId: null, ticketId: null, createdAt: nowStr },
    { id: uid(), type: "deal-created", subject: "Created deal Green Valley E-commerce", body: null, userId: "admin", dealId: deals[1].id, companyId: companies[1].id, contactId: contacts[1].id, projectId: null, ticketId: null, createdAt: nowStr },
    { id: uid(), type: "deal-stage-changed", subject: "Deal moved to Proposal Sent", body: "NovaTech Mobile App proposal sent", userId: "admin", dealId: deals[2].id, companyId: companies[2].id, contactId: null, projectId: null, ticketId: null, createdAt: nowStr },
    { id: uid(), type: "project-created", subject: "Created project BrightFuture LMS Portal", body: null, userId: "admin", dealId: deals[4].id, companyId: companies[4].id, contactId: null, projectId: projects[0].id, ticketId: null, createdAt: nowStr },
  ];

  return {
    pipelineStages: stages,
    companies,
    contacts,
    deals,
    projects,
    tasks: [],
    tickets: [],
    ticketMessages: [],
    activities,
    teamMembers,
    services,
    testimonials: [],
  };
}

function readDb(): CrmData {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) as CrmData;
    }
  } catch {
    // corrupt — start fresh
  }
  const data = emptyData();
  writeDb(data);
  return data;
}

function writeDb(db: CrmData) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

function patch<K extends keyof CrmData>(table: K, fn: (db: CrmData) => void) {
  const db = readDb();
  fn(db);
  writeDb(db);
  return db;
}

// ── Pipeline Stages ──

export function getStages() {
  return readDb().pipelineStages.sort((a: any, b: any) => a.order - b.order);
}

export function createStage(data: any) {
  const stage = { id: uid(), ...data, createdAt: now(), updatedAt: now() };
  patch("pipelineStages", (db) => db.pipelineStages.push(stage));
  return stage;
}

export function updateStage(id: string, data: any) {
  let updated: any = null;
  patch("pipelineStages", (db) => {
    const i = db.pipelineStages.findIndex((s: any) => s.id === id);
    if (i >= 0) { db.pipelineStages[i] = { ...db.pipelineStages[i], ...data, updatedAt: now() }; updated = db.pipelineStages[i]; }
  });
  return updated;
}

export function deleteStage(id: string) {
  patch("pipelineStages", (db) => { db.pipelineStages = db.pipelineStages.filter((s: any) => s.id !== id); });
}

// ── Companies ──

export function getCompanies(opts: { search?: string; page?: number; limit?: number } = {}) {
  const { search = "", page = 1, limit = 50 } = opts;
  let list = readDb().companies;
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((c: any) => c.name?.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q));
  }
  list.sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const total = list.length;
  const start = (page - 1) * limit;
  return { companies: list.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) };
}

export function getCompany(id: string) {
  return readDb().companies.find((c: any) => c.id === id) || null;
}

export function createCompany(data: any) {
  const company = { id: uid(), tags: [], ...data, createdAt: now(), updatedAt: now() };
  patch("companies", (db) => db.companies.push(company));
  return company;
}

export function updateCompany(id: string, data: any) {
  let updated: any = null;
  patch("companies", (db) => {
    const i = db.companies.findIndex((c: any) => c.id === id);
    if (i >= 0) { db.companies[i] = { ...db.companies[i], ...data, updatedAt: now() }; updated = db.companies[i]; }
  });
  return updated;
}

export function deleteCompany(id: string) {
  patch("companies", (db) => { db.companies = db.companies.filter((c: any) => c.id !== id); });
}

// ── Contacts ──

export function getContacts(opts: { companyId?: string; search?: string; page?: number; limit?: number } = {}) {
  const { companyId, search = "", page = 1, limit = 50 } = opts;
  let list = readDb().contacts;
  if (companyId) list = list.filter((c: any) => c.companyId === companyId);
  if (search) { const q = search.toLowerCase(); list = list.filter((c: any) => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)); }
  list.sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const total = list.length;
  const start = (page - 1) * limit;
  return { contacts: list.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) };
}

export function getContact(id: string) {
  return readDb().contacts.find((c: any) => c.id === id) || null;
}

export function createContact(data: any) {
  const contact = { id: uid(), ...data, createdAt: now(), updatedAt: now() };
  patch("contacts", (db) => db.contacts.push(contact));
  return contact;
}

export function updateContact(id: string, data: any) {
  let updated: any = null;
  patch("contacts", (db) => {
    const i = db.contacts.findIndex((c: any) => c.id === id);
    if (i >= 0) { db.contacts[i] = { ...db.contacts[i], ...data, updatedAt: now() }; updated = db.contacts[i]; }
  });
  return updated;
}

export function deleteContact(id: string) {
  patch("contacts", (db) => { db.contacts = db.contacts.filter((c: any) => c.id !== id); });
}

// ── Deals ──

export function getDeals(opts: { stageId?: string; companyId?: string; search?: string; page?: number; limit?: number } = {}) {
  const { stageId, companyId, search = "", page = 1, limit = 50 } = opts;
  const db = readDb();
  let list = db.deals;
  if (stageId) list = list.filter((d: any) => d.stageId === stageId);
  if (companyId) list = list.filter((d: any) => d.companyId === companyId);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((d: any) => d.title?.toLowerCase().includes(q) || db.companies.find((c: any) => c.id === d.companyId)?.name?.toLowerCase().includes(q));
  }
  // Enrich with relations
  list = list.map((d: any) => ({
    ...d,
    company: db.companies.find((c: any) => c.id === d.companyId) || { id: d.companyId, name: "Unknown" },
    stage: db.pipelineStages.find((s: any) => s.id === d.stageId) || { id: d.stageId, label: "Unknown", color: "#999", isClosed: false, isWon: false },
    owner: { id: d.ownerId, name: "Admin" },
    contacts: (d.contactIds || []).map((cid: string) => ({ contact: db.contacts.find((c: any) => c.id === cid) || { id: cid, firstName: "Unknown", lastName: "", email: "" } })),
    _count: { activities: db.activities.filter((a: any) => a.dealId === d.id).length },
  }));
  list.sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const total = list.length;
  const start = (page - 1) * limit;
  const paged = list.slice(start, start + limit);

  const stages = db.pipelineStages.sort((a: any, b: any) => a.order - b.order);
  const dealsByStage = stages.map((stage: any) => ({
    stage,
    deals: list.filter((d: any) => d.stageId === stage.id),
  }));

  return { deals: paged, dealsByStage, stages, total, page, totalPages: Math.ceil(total / limit) };
}

export function getDeal(id: string) {
  const db = readDb();
  const deal = db.deals.find((d: any) => d.id === id);
  if (!deal) return null;
  return {
    ...deal,
    company: db.companies.find((c: any) => c.id === deal.companyId) || { id: deal.companyId, name: "Unknown" },
    stage: db.pipelineStages.find((s: any) => s.id === deal.stageId) || { id: deal.stageId, label: "Unknown", color: "#999", isClosed: false, isWon: false },
    owner: { id: deal.ownerId, name: "Admin" },
    contacts: (deal.contactIds || []).map((cid: string) => ({ contact: db.contacts.find((c: any) => c.id === cid) })),
    activities: db.activities.filter((a: any) => a.dealId === deal.id).map((a: any) => ({ ...a, user: { id: a.userId, name: "Admin" } })).sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    projects: db.projects.filter((p: any) => p.dealId === deal.id),
  };
}

export function createDeal(data: any, userId?: string) {
  const deal = { id: uid(), ownerId: userId || "admin", contactIds: [], ...data, createdAt: now(), updatedAt: now() };
  patch("deals", (db) => db.deals.push(deal));
  return deal;
}

export function updateDeal(id: string, data: any) {
  let updated: any = null;
  patch("deals", (db) => {
    const i = db.deals.findIndex((d: any) => d.id === id);
    if (i >= 0) { db.deals[i] = { ...db.deals[i], ...data, updatedAt: now() }; updated = db.deals[i]; }
  });
  return updated;
}

export function deleteDeal(id: string) {
  patch("deals", (db) => { db.deals = db.deals.filter((d: any) => d.id !== id); });
}

// ── Projects ──

export function getProjects(opts: { companyId?: string; status?: string; search?: string; page?: number; limit?: number } = {}) {
  const { companyId, status, search = "", page = 1, limit = 50 } = opts;
  let list = readDb().projects;
  if (companyId) list = list.filter((p: any) => p.companyId === companyId);
  if (status) list = list.filter((p: any) => p.status === status);
  if (search) { const q = search.toLowerCase(); list = list.filter((p: any) => p.name?.toLowerCase().includes(q)); }
  list.sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const total = list.length;
  const start = (page - 1) * limit;
  return { projects: list.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) };
}

export function getProject(id: string) {
  const db = readDb();
  const project = db.projects.find((p: any) => p.id === id);
  if (!project) return null;
  return {
    ...project,
    company: db.companies.find((c: any) => c.id === project.companyId) || { id: project.companyId, name: "Unknown" },
    tasks: db.tasks.filter((t: any) => t.projectId === project.id),
    _count: { tasks: db.tasks.filter((t: any) => t.projectId === project.id).length },
  };
}

export function createProject(data: any) {
  const project = { id: uid(), status: "kickoff", ...data, createdAt: now(), updatedAt: now() };
  patch("projects", (db) => db.projects.push(project));
  return project;
}

export function updateProject(id: string, data: any) {
  let updated: any = null;
  patch("projects", (db) => {
    const i = db.projects.findIndex((p: any) => p.id === id);
    if (i >= 0) { db.projects[i] = { ...db.projects[i], ...data, updatedAt: now() }; updated = db.projects[i]; }
  });
  return updated;
}

export function deleteProject(id: string) {
  patch("projects", (db) => { db.projects = db.projects.filter((p: any) => p.id !== id); });
}

// ── Tasks ──

export function getTasks(opts: { projectId?: string; assigneeId?: string; status?: string } = {}) {
  const { projectId, assigneeId, status } = opts;
  let list = readDb().tasks;
  if (projectId) list = list.filter((t: any) => t.projectId === projectId);
  if (assigneeId) list = list.filter((t: any) => t.assigneeId === assigneeId);
  if (status) list = list.filter((t: any) => t.status === status);
  list.sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return list;
}

export function createTask(data: any) {
  const task = { id: uid(), status: "todo", priority: "medium", ...data, createdAt: now(), updatedAt: now() };
  patch("tasks", (db) => db.tasks.push(task));
  return task;
}

export function updateTask(id: string, data: any) {
  let updated: any = null;
  patch("tasks", (db) => {
    const i = db.tasks.findIndex((t: any) => t.id === id);
    if (i >= 0) { db.tasks[i] = { ...db.tasks[i], ...data, updatedAt: now() }; updated = db.tasks[i]; }
  });
  return updated;
}

export function deleteTask(id: string) {
  patch("tasks", (db) => { db.tasks = db.tasks.filter((t: any) => t.id !== id); });
}

// ── Tickets ──

export function getTickets(opts: { companyId?: string; status?: string; search?: string; page?: number; limit?: number } = {}) {
  const { companyId, status, search = "", page = 1, limit = 50 } = opts;
  let list = readDb().tickets;
  if (companyId) list = list.filter((t: any) => t.companyId === companyId);
  if (status) list = list.filter((t: any) => t.status === status);
  if (search) { const q = search.toLowerCase(); list = list.filter((t: any) => t.subject?.toLowerCase().includes(q)); }
  list.sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const total = list.length;
  const start = (page - 1) * limit;
  return { tickets: list.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) };
}

export function getTicket(id: string) {
  const db = readDb();
  const ticket = db.tickets.find((t: any) => t.id === id);
  if (!ticket) return null;
  return {
    ...ticket,
    company: db.companies.find((c: any) => c.id === ticket.companyId) || { id: ticket.companyId, name: "Unknown" },
    assignee: ticket.assigneeId ? { id: ticket.assigneeId, name: "Admin" } : null,
    messages: db.ticketMessages.filter((m: any) => m.ticketId === ticket.id).sort((a: any, b: any) => (a.createdAt || "").localeCompare(b.createdAt || "")),
    activities: db.activities.filter((a: any) => a.ticketId === ticket.id).map((a: any) => ({ ...a, user: { id: a.userId, name: "Admin" } })).sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    _count: { messages: db.ticketMessages.filter((m: any) => m.ticketId === ticket.id).length },
  };
}

let ticketCounter = 1000;
export function createTicket(data: any) {
  const db = readDb();
  ticketCounter = Math.max(ticketCounter, ...db.tickets.map((t: any) => parseInt(t.number?.replace("TK-", "") || "0")));
  const ticket = { id: uid(), number: `TK-${ticketCounter + 1}`, status: "open", priority: "medium", ...data, createdAt: now(), updatedAt: now() };
  patch("tickets", (db) => db.tickets.push(ticket));
  return ticket;
}

export function updateTicket(id: string, data: any) {
  let updated: any = null;
  patch("tickets", (db) => {
    const i = db.tickets.findIndex((t: any) => t.id === id);
    if (i >= 0) { db.tickets[i] = { ...db.tickets[i], ...data, updatedAt: now() }; updated = db.tickets[i]; }
  });
  return updated;
}

export function createTicketMessage(data: any) {
  const msg = { id: uid(), ...data, createdAt: now() };
  patch("ticketMessages", (db) => db.ticketMessages.push(msg));
  return msg;
}

// ── Activities ──

export function getActivities(opts: { dealId?: string; companyId?: string; projectId?: string; ticketId?: string; page?: number; limit?: number } = {}) {
  const { dealId, companyId, projectId, ticketId, page = 1, limit = 50 } = opts;
  let list = readDb().activities;
  if (dealId) list = list.filter((a: any) => a.dealId === dealId);
  if (companyId) list = list.filter((a: any) => a.companyId === companyId);
  if (projectId) list = list.filter((a: any) => a.projectId === projectId);
  if (ticketId) list = list.filter((a: any) => a.ticketId === ticketId);
  list.sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const total = list.length;
  const start = (page - 1) * limit;
  return { activities: list.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) };
}

export function createActivity(data: any, userId?: string) {
  const activity = { id: uid(), userId: userId || "admin", ...data, createdAt: now() };
  patch("activities", (db) => db.activities.push(activity));
  return activity;
}

// ── Team Members ──

export function getTeamMembers() {
  return readDb().teamMembers.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));
}

export function getTeamMember(id: string) {
  return readDb().teamMembers.find((m: any) => m.id === id) || null;
}

export function createTeamMember(data: any) {
  const member = { id: uid(), ...data, createdAt: now(), updatedAt: now() };
  patch("teamMembers", (db) => db.teamMembers.push(member));
  return member;
}

export function updateTeamMember(id: string, data: any) {
  let updated: any = null;
  patch("teamMembers", (db) => {
    const i = db.teamMembers.findIndex((m: any) => m.id === id);
    if (i >= 0) { db.teamMembers[i] = { ...db.teamMembers[i], ...data, updatedAt: now() }; updated = db.teamMembers[i]; }
  });
  return updated;
}

export function deleteTeamMember(id: string) {
  patch("teamMembers", (db) => { db.teamMembers = db.teamMembers.filter((m: any) => m.id !== id); });
}

// ── Services ──

export function getServices() {
  return readDb().services;
}

export function getService(id: string) {
  return readDb().services.find((s: any) => s.id === id) || null;
}

export function createService(data: any) {
  const service = { id: uid(), ...data, createdAt: now(), updatedAt: now() };
  patch("services", (db) => db.services.push(service));
  return service;
}

export function updateService(id: string, data: any) {
  let updated: any = null;
  patch("services", (db) => {
    const i = db.services.findIndex((s: any) => s.id === id);
    if (i >= 0) { db.services[i] = { ...db.services[i], ...data, updatedAt: now() }; updated = db.services[i]; }
  });
  return updated;
}

export function deleteService(id: string) {
  patch("services", (db) => { db.services = db.services.filter((s: any) => s.id !== id); });
}

// ── Testimonials ──

export function getTestimonials() {
  return readDb().testimonials;
}

export function createTestimonial(data: any) {
  const t = { id: uid(), approved: false, ...data, createdAt: now(), updatedAt: now() };
  patch("testimonials", (db) => db.testimonials.push(t));
  return t;
}

export function updateTestimonial(id: string, data: any) {
  let updated: any = null;
  patch("testimonials", (db) => {
    const i = db.testimonials.findIndex((t: any) => t.id === id);
    if (i >= 0) { db.testimonials[i] = { ...db.testimonials[i], ...data, updatedAt: now() }; updated = db.testimonials[i]; }
  });
  return updated;
}

export function deleteTestimonial(id: string) {
  patch("testimonials", (db) => { db.testimonials = db.testimonials.filter((t: any) => t.id !== id); });
}

// ── Dashboard Stats ──

export function getDashboardStats(userId?: string) {
  const db = readDb();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const dealsCount = db.deals.length;
  const openDeals = db.deals.filter((d: any) => {
    const stage = db.pipelineStages.find((s: any) => s.id === d.stageId);
    return stage && !stage.isClosed;
  });
  const pipelineValue = openDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
  const wonDeals = db.deals.filter((d: any) => {
    const stage = db.pipelineStages.find((s: any) => s.id === d.stageId);
    return stage?.isWon && d.createdAt >= monthStart;
  });
  const activeProjects = db.projects.filter((p: any) => ["kickoff", "active"].includes(p.status)).length;
  const openTickets = db.tickets.filter((t: any) => ["open", "waiting-client", "in-progress"].includes(t.status)).length;

  const recentDeals = db.deals.slice(0, 5).map((d: any) => ({
    ...d,
    company: db.companies.find((c: any) => c.id === d.companyId) || { id: d.companyId, name: "Unknown" },
    stage: db.pipelineStages.find((s: any) => s.id === d.stageId) || { id: d.stageId, label: "Unknown", color: "#999", isClosed: false, isWon: false },
  }));

  const recentActivities = db.activities.slice(0, 8).map((a: any) => ({
    ...a,
    user: { id: a.userId, name: "Admin" },
    deal: a.dealId ? db.deals.find((d: any) => d.id === a.dealId) ? { id: a.dealId, title: db.deals.find((d: any) => d.id === a.dealId)?.title } : null : null,
    company: a.companyId ? db.companies.find((c: any) => c.id === a.companyId) ? { id: a.companyId, name: db.companies.find((c: any) => c.id === a.companyId)?.name } : null : null,
    project: a.projectId ? db.projects.find((p: any) => p.id === a.projectId) ? { id: a.projectId, name: db.projects.find((p: any) => p.id === a.projectId)?.name } : null : null,
  }));

  return { dealsCount, pipelineValue, wonDealsThisMonth: wonDeals.length, activeProjects, openTickets, recentDeals, recentActivities };
}

// ── Raw DB access (for admin pages needing relations) ──

export function __readDb(): CrmData {
  return readDb();
}
