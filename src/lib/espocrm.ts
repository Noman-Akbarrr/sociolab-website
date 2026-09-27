import { cookies } from "next/headers";

const ESPO_URL = process.env.ESPOCRM_URL || "";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("espo_auth")?.value;
  if (!auth) return null;
  return { "Authorization": `Basic ${auth}` };
}

async function headers() {
  const auth = await getAuthHeader();
  return {
    ...auth,
    "Content-Type": "application/json",
  };
}

export async function espoFetch<T = any>(
  endpoint: string,
  options?: { method?: string; body?: any; params?: Record<string, string> }
): Promise<T> {
  if (!ESPO_URL) {
    throw new Error("ESPOCRM_URL must be set in environment variables");
  }

  const authHeaders = await getAuthHeader();
  if (!authHeaders) {
    throw new Error("Not authenticated");
  }

  const url = new URL(`${ESPO_URL}/api/v1/${endpoint}`);
  if (options?.params) {
    Object.entries(options.params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    method: options?.method || "GET",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
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
  const [leads, contacts, accounts, opportunities, tasks] = await Promise.all([
    listRecords("Lead", { "orderBy": "createdAt", "order": "desc", "maxRows": "1" }).catch(() => ({ total: 0, list: [] })),
    listRecords("Contact", { "maxRows": "1" }).catch(() => ({ total: 0, list: [] })),
    listRecords("Account", { "maxRows": "1" }).catch(() => ({ total: 0, list: [] })),
    listRecords("Opportunity", { "maxRows": "1" }).catch(() => ({ total: 0, list: [] })),
    listRecords("Task", { "maxRows": "1" }).catch(() => ({ total: 0, list: [] })),
  ]);

  const recentLeads = await listRecords("Lead", {
    "orderBy": "createdAt",
    "order": "desc",
    "maxRows": "10",
  }).catch(() => ({ total: 0, list: [] }));

  const recentOpps = await listRecords("Opportunity", {
    "orderBy": "createdAt",
    "order": "desc",
    "maxRows": "10",
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
