import { prisma } from "@/lib/prisma";

// ── Pipelines ──

export async function getPipelines() {
  const pipelines = await prisma.pipeline.findMany({
    include: { _count: { select: { deals: true, stages: true } } },
    orderBy: { createdAt: "asc" },
  });
  return pipelines;
}

export async function getPipeline(id: string) {
  return prisma.pipeline.findUnique({ where: { id }, include: { stages: { orderBy: { order: "asc" } }, _count: { select: { deals: true } } } });
}

export async function createPipeline(data: any) {
  const pipeline = await prisma.pipeline.create({
    data: {
      name: data.name,
      description: data.description || null,
      color: data.color || "#3b82f6",
      stages: {
        create: [
          { name: "new", label: "New Lead", order: 0, color: "#6b7280" },
          { name: "qualified", label: "Qualified", order: 1, color: "#3b82f6" },
          { name: "proposal", label: "Proposal Sent", order: 2, color: "#8b5cf6" },
          { name: "won", label: "Won", order: 3, color: "#22c55e", isClosed: true, isWon: true },
          { name: "lost", label: "Lost", order: 4, color: "#ef4444", isClosed: true },
        ],
      },
    },
    include: { stages: true },
  });
  return pipeline;
}

export async function updatePipeline(id: string, data: any) {
  return prisma.pipeline.update({ where: { id }, data: { name: data.name, description: data.description, color: data.color } });
}

export async function deletePipeline(id: string) {
  await prisma.pipeline.delete({ where: { id } });
}

// ── Pipeline Stages ──

export async function getStages(pipelineId?: string) {
  if (pipelineId) {
    return prisma.pipelineStage.findMany({ where: { pipelineId }, orderBy: { order: "asc" } });
  }
  return prisma.pipelineStage.findMany({ orderBy: { order: "asc" } });
}

export async function createStage(pipelineId: string, data: any) {
  return prisma.pipelineStage.create({ data: { pipelineId, name: data.name, label: data.label, color: data.color || "#6b7280", order: data.order ?? 0, isClosed: data.isClosed ?? false, isWon: data.isWon ?? false } });
}

export async function updateStage(id: string, data: any) {
  return prisma.pipelineStage.update({ where: { id }, data });
}

export async function deleteStage(id: string, reassignToId?: string) {
  if (reassignToId) {
    await prisma.deal.updateMany({ where: { stageId: id }, data: { stageId: reassignToId } });
  }
  await prisma.pipelineStage.delete({ where: { id } });
}

export async function reorderStages(pipelineId: string, stageIds: string[]) {
  const updates = stageIds.map((sid, i) =>
    prisma.pipelineStage.update({ where: { id: sid }, data: { order: i } })
  );
  await prisma.$transaction(updates);
}

// ── Companies ──

export async function getCompanies(opts: { search?: string; page?: number; limit?: number } = {}) {
  const { search = "", page = 1, limit = 50 } = opts;
  const where: any = {};
  if (search) {
    const q = search.toLowerCase();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { industry: { contains: q, mode: "insensitive" } },
    ];
  }
  const [companies, total] = await Promise.all([
    prisma.company.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.company.count({ where }),
  ]);
  return { companies, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getCompany(id: string) {
  return prisma.company.findUnique({ where: { id } });
}

export async function createCompany(data: any) {
  return prisma.company.create({ data: { name: data.name, domain: data.domain, industry: data.industry, size: data.size, website: data.website, linkedin: data.linkedin, notes: data.notes, tags: data.tags || [] } });
}

export async function updateCompany(id: string, data: any) {
  return prisma.company.update({ where: { id }, data });
}

export async function deleteCompany(id: string) {
  await prisma.company.delete({ where: { id } });
}

// ── Contacts ──

export async function getContacts(opts: { companyId?: string; search?: string; page?: number; limit?: number } = {}) {
  const { companyId, search = "", page = 1, limit = 50 } = opts;
  const where: any = {};
  if (companyId) where.companyId = companyId;
  if (search) {
    const q = search.toLowerCase();
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({ where, include: { company: true }, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.contact.count({ where }),
  ]);
  return { contacts, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getContact(id: string) {
  return prisma.contact.findUnique({ where: { id }, include: { company: true, deals: { include: { deal: true } } } });
}

export async function createContact(data: any) {
  return prisma.contact.create({ data: { companyId: data.companyId, firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone, title: data.title, role: data.role, source: data.source, status: data.status || "active", tags: data.tags || [], notes: data.notes } });
}

export async function updateContact(id: string, data: any) {
  return prisma.contact.update({ where: { id }, data });
}

export async function deleteContact(id: string) {
  await prisma.contact.delete({ where: { id } });
}

// ── Deals ──

export async function getDeals(opts: { pipelineId?: string; stageId?: string; companyId?: string; search?: string; page?: number; limit?: number } = {}) {
  const { pipelineId, stageId, companyId, search = "", page = 1, limit = 50 } = opts;
  const where: any = {};
  if (pipelineId) where.pipelineId = pipelineId;
  if (stageId) where.stageId = stageId;
  if (companyId) where.companyId = companyId;
  if (search) {
    const q = search.toLowerCase();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { company: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  const include = {
    company: true,
    stage: true,
    owner: { select: { id: true, name: true } },
    contacts: { include: { contact: true } },
    _count: { select: { activities: true } },
  };

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({ where, include, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.deal.count({ where }),
  ]);

  // Group by stage for kanban view
  const stages = await prisma.pipelineStage.findMany({
    where: pipelineId ? { pipelineId } : {},
    orderBy: { order: "asc" },
  });

  const dealsByStage = stages.map((stage) => ({
    stage,
    deals: deals.filter((d) => d.stageId === stage.id),
  }));

  return { deals, dealsByStage, stages, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getDeal(id: string) {
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      company: true,
      pipeline: true,
      stage: true,
      owner: { select: { id: true, name: true } },
      contacts: { include: { contact: true } },
      activities: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
      projects: true,
    },
  });
  return deal;
}

export async function createDeal(data: any, userId?: string) {
  return prisma.deal.create({
    data: {
      title: data.title,
      companyId: data.companyId,
      pipelineId: data.pipelineId,
      value: data.value || 0,
      currency: data.currency || "PKR",
      stageId: data.stageId,
      probability: data.probability || 10,
      expectedClose: data.expectedClose || null,
      ownerId: userId || "admin",
      contactName: data.contactName || null,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      address: data.address || null,
      city: data.city || null,
      country: data.country || null,
      source: data.source || null,
      dealType: data.dealType || null,
      priority: data.priority || "medium",
      notes: data.notes || null,
    },
  });
}

export async function createDealForPipeline(pipelineId: string, data: any, userId?: string) {
  return createDeal({ ...data, pipelineId }, userId);
}

export async function updateDeal(id: string, data: any) {
  return prisma.deal.update({ where: { id }, data });
}

export async function deleteDeal(id: string) {
  await prisma.deal.delete({ where: { id } });
}

// ── Projects ──

export async function getProjects(opts: { companyId?: string; status?: string; search?: string; page?: number; limit?: number } = {}) {
  const { companyId, status, search = "", page = 1, limit = 50 } = opts;
  const where: any = {};
  if (companyId) where.companyId = companyId;
  if (status) where.status = status;
  if (search) {
    const q = search.toLowerCase();
    where.OR = [{ name: { contains: q, mode: "insensitive" } }];
  }
  const [projects, total] = await Promise.all([
    prisma.project.findMany({ where, include: { company: true }, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.project.count({ where }),
  ]);
  return { projects, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      company: true,
      assignee: { select: { id: true, name: true, email: true } },
      deal: { select: { id: true, title: true, value: true, currency: true } },
      tasks: { include: { assignee: { select: { id: true, name: true } } } },
      invoices: { orderBy: { createdAt: "desc" } },
      submissions: { orderBy: { submittedAt: "desc" } },
      activities: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 10 },
      _count: { select: { tasks: true, invoices: true, submissions: true, tickets: true } },
    },
  });
}

export async function createProject(data: any) {
  return prisma.project.create({
    data: {
      name: data.name,
      companyId: data.companyId,
      dealId: data.dealId,
      assigneeId: data.assigneeId || null,
      status: data.status || "kickoff",
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      budget: data.budget,
      currency: data.currency || "USD",
      billingType: data.billingType || "fixed",
      description: data.description,
    },
  });
}

export async function updateProject(id: string, data: any) {
  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
}

// ── Tasks ──

export async function getTasks(opts: { projectId?: string; assigneeId?: string; status?: string } = {}) {
  const { projectId, assigneeId, status } = opts;
  const where: any = {};
  if (projectId) where.projectId = projectId;
  if (assigneeId) where.assigneeId = assigneeId;
  if (status) where.status = status;
  return prisma.task.findMany({ where, include: { assignee: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } });
}

export async function createTask(data: any) {
  return prisma.task.create({
    data: {
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      status: data.status || "todo",
      priority: data.priority || 0,
      assigneeId: data.assigneeId || null,
    },
  });
}

export async function updateTask(id: string, data: any) {
  return prisma.task.update({ where: { id }, data });
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
}

// ── Submissions ──

export async function getSubmissions(opts: { projectId?: string; status?: string; page?: number; limit?: number } = {}) {
  const { projectId, status, page = 1, limit = 50 } = opts;
  const where: any = {};
  if (projectId) where.projectId = projectId;
  if (status) where.status = status;
  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({ where, orderBy: { submittedAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.submission.count({ where }),
  ]);
  return { submissions, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getSubmission(id: string) {
  return prisma.submission.findUnique({ where: { id }, include: { project: { select: { id: true, name: true } } } });
}

export async function createSubmission(data: any) {
  return prisma.submission.create({
    data: {
      projectId: data.projectId,
      title: data.title,
      description: data.description || null,
      status: data.status || "pending",
      files: data.files || [],
      feedback: data.feedback || null,
    },
  });
}

export async function updateSubmission(id: string, data: any) {
  return prisma.submission.update({ where: { id }, data });
}

export async function deleteSubmission(id: string) {
  await prisma.submission.delete({ where: { id } });
}

// ── Invoices ──

export async function getInvoices(opts: { projectId?: string; status?: string } = {}) {
  const where: any = {};
  if (opts.projectId) where.projectId = opts.projectId;
  if (opts.status) where.status = opts.status;
  return prisma.invoice.findMany({ where, orderBy: { createdAt: "desc" } });
}

export async function createInvoice(data: any) {
  let number = data.number;
  if (!number) {
    const count = await prisma.invoice.count();
    const year = new Date().getFullYear();
    number = `INV-${year}-${String(count + 1).padStart(3, "0")}`;
  }
  const existing = await prisma.invoice.findUnique({ where: { number } });
  if (existing) {
    const count = await prisma.invoice.count();
    const year = new Date().getFullYear();
    number = `INV-${year}-${String(count + 1).padStart(3, "0")}`;
  }
  return prisma.invoice.create({
    data: {
      number,
      projectId: data.projectId,
      amount: data.amount,
      currency: data.currency || "USD",
      status: data.status || "draft",
      dueDate: new Date(data.dueDate),
    },
  });
}

export async function updateInvoice(id: string, data: any) {
  return prisma.invoice.update({ where: { id }, data });
}

export async function deleteInvoice(id: string) {
  await prisma.invoice.delete({ where: { id } });
}

// ── Tickets ──

export async function getTickets(opts: { companyId?: string; status?: string; search?: string; page?: number; limit?: number } = {}) {
  const { companyId, status, search = "", page = 1, limit = 50 } = opts;
  const where: any = {};
  if (companyId) where.companyId = companyId;
  if (status) where.status = status;
  if (search) {
    const q = search.toLowerCase();
    where.OR = [{ subject: { contains: q, mode: "insensitive" } }];
  }
  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({ where, include: { company: true, assignee: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.ticket.count({ where }),
  ]);
  return { tickets, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getTicket(id: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      company: true,
      assignee: { select: { id: true, name: true } },
      messages: { orderBy: { createdAt: "asc" } },
      activities: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
      _count: { select: { messages: true } },
    },
  });
  return ticket;
}

let ticketCounter = 1000;
export async function createTicket(data: any) {
  const lastTicket = await prisma.ticket.findFirst({ orderBy: { createdAt: "desc" }, select: { number: true } });
  if (lastTicket?.number) {
    const num = parseInt(lastTicket.number.replace("TK-", "") || "0");
    if (num > ticketCounter) ticketCounter = num;
  }
  const number = `TK-${ticketCounter + 1}`;
  return prisma.ticket.create({
    data: {
      number,
      subject: data.subject,
      description: data.description,
      status: data.status || "open",
      priority: data.priority || "medium",
      companyId: data.companyId,
      contactId: data.contactId,
      projectId: data.projectId,
      assigneeId: data.assigneeId,
    },
  });
}

export async function updateTicket(id: string, data: any) {
  return prisma.ticket.update({ where: { id }, data });
}

export async function createTicketMessage(data: any) {
  return prisma.ticketMessage.create({
    data: {
      ticketId: data.ticketId,
      authorId: data.authorId,
      authorType: data.authorType,
      body: data.body,
      internal: data.internal ?? false,
    },
  });
}

// ── Activities ──

export async function getActivities(opts: { dealId?: string; companyId?: string; projectId?: string; ticketId?: string; page?: number; limit?: number } = {}) {
  const { dealId, companyId, projectId, ticketId, page = 1, limit = 50 } = opts;
  const where: any = {};
  if (dealId) where.dealId = dealId;
  if (companyId) where.companyId = companyId;
  if (projectId) where.projectId = projectId;
  if (ticketId) where.ticketId = ticketId;
  const [activities, total] = await Promise.all([
    prisma.activity.findMany({ where, include: { user: { select: { id: true, name: true } }, deal: { select: { id: true, title: true } }, company: { select: { id: true, name: true } }, project: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.activity.count({ where }),
  ]);
  return { activities, total, page, totalPages: Math.ceil(total / limit) };
}

export async function createActivity(data: any, userId?: string) {
  return prisma.activity.create({
    data: {
      type: data.type,
      subject: data.subject,
      body: data.body,
      userId: userId || null,
      dealId: data.dealId || null,
      companyId: data.companyId || null,
      contactId: data.contactId || null,
      projectId: data.projectId || null,
      ticketId: data.ticketId || null,
      taskId: data.taskId || null,
    },
  });
}

// ── Team Members ──

export async function getTeamMembers() {
  return prisma.teamMember.findMany({ orderBy: { name: "asc" } });
}

export async function getTeamMember(id: string) {
  return prisma.teamMember.findUnique({ where: { id } });
}

export async function createTeamMember(data: any) {
  return prisma.teamMember.create({ data: { name: data.name, role: data.role, bio: data.bio, photo: data.photo, linkedin: data.linkedin, twitter: data.twitter, email: data.email, order: data.order ?? 0, active: data.active ?? true } });
}

export async function updateTeamMember(id: string, data: any) {
  return prisma.teamMember.update({ where: { id }, data });
}

export async function deleteTeamMember(id: string) {
  await prisma.teamMember.delete({ where: { id } });
}

// ── Services ──

export async function getServices() {
  return prisma.service.findMany({ orderBy: { order: "asc" } });
}

export async function getService(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

export async function createService(data: any) {
  return prisma.service.create({ data: { name: data.name, slug: data.slug, description: data.description, shortDesc: data.shortDesc, href: data.href, price: data.price, period: data.period, featured: data.featured ?? false, features: data.features || [], icon: data.icon, order: data.order ?? 0, active: data.active ?? true } });
}

export async function updateService(id: string, data: any) {
  return prisma.service.update({ where: { id }, data });
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
}

// ── Testimonials ──

export async function getTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createTestimonial(data: any) {
  return prisma.testimonial.create({ data: { quote: data.quote, name: data.name, role: data.role, company: data.company, photo: data.photo, approved: data.approved ?? false, caseStudyId: data.caseStudyId, projectId: data.projectId } });
}

export async function updateTestimonial(id: string, data: any) {
  return prisma.testimonial.update({ where: { id }, data });
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
}

// ── Dashboard Stats ──

export async function getDashboardStats(userId?: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [dealsCount, openDeals, wonDealsThisMonth, activeProjects, openTickets, recentDeals, recentActivities] = await Promise.all([
    prisma.deal.count(),
    prisma.deal.findMany({ where: { stage: { isClosed: false } }, include: { stage: true } }),
    prisma.deal.count({ where: { stage: { isWon: true }, createdAt: { gte: monthStart } } }),
    prisma.project.count({ where: { status: { in: ["kickoff", "active"] } } }),
    prisma.ticket.count({ where: { status: { in: ["open", "waiting-client", "in-progress"] } } }),
    prisma.deal.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { company: true, stage: true } }),
    prisma.activity.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { user: { select: { id: true, name: true } }, deal: { select: { id: true, title: true } }, company: { select: { id: true, name: true } }, project: { select: { id: true, name: true } } } }),
  ]);

  const pipelineValue = openDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);

  return { dealsCount, pipelineValue, wonDealsThisMonth, activeProjects, openTickets, recentDeals, recentActivities };
}

// ── Direct Prisma access for API routes needing raw queries ──

export { prisma as db };
