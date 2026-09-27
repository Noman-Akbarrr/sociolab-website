const ESPO_URL = process.env.ESPOCRM_URL || "";
const ESPO_API_KEY = process.env.ESPOCRM_API_KEY || "";

function headers() {
  return {
    "X-Api-Key": ESPO_API_KEY,
    "Content-Type": "application/json",
  };
}

export async function espoFetch<T = any>(
  endpoint: string,
  options?: { method?: string; body?: any; params?: Record<string, string> }
): Promise<T> {
  if (!ESPO_URL || !ESPO_API_KEY) {
    throw new Error("ESPOCRM_URL and ESPOCRM_API_KEY must be set in environment variables");
  }

  const url = new URL(`${ESPO_URL}/api/v1/${endpoint}`);
  if (options?.params) {
    Object.entries(options.params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    method: options?.method || "GET",
    headers: headers(),
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EspoCRM API error ${res.status}: ${text}`);
  }

  return res.json();
}

// ── Convenience helpers ──

export interface EspoListResponse<T> {
  total: number;
  list: T[];
}

export interface EspoRecord {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: string;
  stage?: string;
  amount?: number;
  currency?: string;
  createdAt?: string;
  modifiedAt?: string;
  assignedUserName?: string;
  [key: string]: any;
}

export async function listRecords(
  entity: string,
  params?: Record<string, string>
): Promise<EspoListResponse<EspoRecord>> {
  return espoFetch(entity, { params });
}

export async function getRecord(
  entity: string,
  id: string
): Promise<EspoRecord> {
  return espoFetch(`${entity}/${id}`);
}

export async function getDashboardStats() {
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const [leads, contacts, accounts, opportunities, tasks] = await Promise.all([
    listRecords("Lead", { "orderBy": "createdAt", "order": "desc", "maxRows": "1" }).catch(() => ({ total: 0, list: [] })),
    listRecords("Contact", { "maxRows": "1" }).catch(() => ({ total: 0, list: [] })),
    listRecords("Account", { "maxRows": "1" }).catch(() => ({ total: 0, list: [] })),
    listRecords("Opportunity", { "maxRows": "1" }).catch(() => ({ total: 0, list: [] })),
    listRecords("Task", { "maxRows": "1" }).catch(() => ({ total: 0, list: [] })),
  ]);

  // Recent leads
  const recentLeads = await listRecords("Lead", {
    "orderBy": "createdAt",
    "order": "desc",
    "maxRows": "5",
  }).catch(() => ({ total: 0, list: [] }));

  // Recent opportunities
  const recentOpps = await listRecords("Opportunity", {
    "orderBy": "createdAt",
    "order": "desc",
    "maxRows": "5",
  }).catch(() => ({ total: 0, list: [] }));

  return {
    leads: leads.total,
    contacts: contacts.total,
    accounts: accounts.total,
    opportunities: opportunities.total,
    tasks: tasks.total,
    recentLeads: recentLeads.list,
    recentOpportunities: recentOpps.list,
  };
}
