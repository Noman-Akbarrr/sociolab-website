export type Deal = {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  priority: string;
  owner: string;
  closeDate: string;
  source: string;
  createdAt: string;
};

export const DEALS: Deal[] = [
  { id: "1", title: "Website Redesign", company: "TechCorp", value: 45000, stage: "Proposal", priority: "high", owner: "Ali Ahmed", closeDate: "2026-10-15", source: "Website", createdAt: "2026-09-01" },
  { id: "2", title: "SEO Campaign", company: "GreenLeaf", value: 12000, stage: "Qualified", priority: "medium", owner: "Sara Khan", closeDate: "2026-10-20", source: "Referral", createdAt: "2026-09-05" },
  { id: "3", title: "Social Media Package", company: "UrbanStyle", value: 8500, stage: "Lead", priority: "low", owner: "Ali Ahmed", closeDate: "2026-11-01", source: "Instagram", createdAt: "2026-09-10" },
  { id: "4", title: "PPC Management", company: "FinServe", value: 24000, stage: "Negotiation", priority: "high", owner: "Bilal Raza", closeDate: "2026-10-08", source: "LinkedIn", createdAt: "2026-08-20" },
  { id: "5", title: "Brand Identity", company: "StartupX", value: 15000, stage: "Closed Won", priority: "medium", owner: "Sara Khan", closeDate: "2026-09-25", source: "Website", createdAt: "2026-08-15" },
  { id: "6", title: "Email Marketing", company: "HealthPlus", value: 6000, stage: "Lead", priority: "low", owner: "Bilal Raza", closeDate: "2026-11-10", source: "Cold Call", createdAt: "2026-09-12" },
  { id: "7", title: "Content Strategy", company: "EduLearn", value: 18000, stage: "Proposal", priority: "medium", owner: "Ali Ahmed", closeDate: "2026-10-25", source: "Website", createdAt: "2026-09-08" },
  { id: "8", title: "Video Production", company: "FoodiesCo", value: 32000, stage: "Closed Won", priority: "high", owner: "Sara Khan", closeDate: "2026-09-20", source: "Referral", createdAt: "2026-07-30" },
  { id: "9", title: "Analytics Setup", company: "RetailHub", value: 5500, stage: "Qualified", priority: "low", owner: "Bilal Raza", closeDate: "2026-10-30", source: "Website", createdAt: "2026-09-14" },
  { id: "10", title: "Full Funnel Campaign", company: "TechCorp", value: 65000, stage: "Negotiation", priority: "high", owner: "Ali Ahmed", closeDate: "2026-10-12", source: "LinkedIn", createdAt: "2026-08-25" },
];

export const STAGES = [
  { id: "lead", name: "Lead", color: "#9CA3AF" },
  { id: "qualified", name: "Qualified", color: "#5B8DEF" },
  { id: "proposal", name: "Proposal", color: "#FF9800" },
  { id: "negotiation", name: "Negotiation", color: "#9C27B0" },
  { id: "closed-won", name: "Closed Won", color: "#4CAF50" },
];

export const CONTACTS = [
  { id: "1", firstName: "John", lastName: "Smith", email: "john@techcorp.com", phone: "+1 555-0101", company: "TechCorp", status: "Active", createdAt: "2026-08-15" },
  { id: "2", firstName: "Emily", lastName: "Davis", email: "emily@greenleaf.com", phone: "+1 555-0102", company: "GreenLeaf", status: "Active", createdAt: "2026-08-20" },
  { id: "3", firstName: "Michael", lastName: "Brown", email: "michael@urbanstyle.com", phone: "+1 555-0103", company: "UrbanStyle", status: "Inactive", createdAt: "2026-09-01" },
  { id: "4", firstName: "Sarah", lastName: "Wilson", email: "sarah@finserve.com", phone: "+1 555-0104", company: "FinServe", status: "Active", createdAt: "2026-07-10" },
  { id: "5", firstName: "David", lastName: "Lee", email: "david@startupx.com", phone: "+1 555-0105", company: "StartupX", status: "Active", createdAt: "2026-09-05" },
  { id: "6", firstName: "Lisa", lastName: "Anderson", email: "lisa@healthplus.com", phone: "+1 555-0106", company: "HealthPlus", status: "Lead", createdAt: "2026-09-10" },
  { id: "7", firstName: "James", lastName: "Taylor", email: "james@edulearn.com", phone: "+1 555-0107", company: "EduLearn", status: "Active", createdAt: "2026-08-25" },
  { id: "8", firstName: "Anna", lastName: "Martin", email: "anna@foodiesco.com", phone: "+1 555-0108", company: "FoodiesCo", status: "Active", createdAt: "2026-07-20" },
];

export const COMPANIES = [
  { id: "1", name: "TechCorp", domain: "techcorp.com", industry: "Technology", size: "200+", website: "https://techcorp.com", deals: 2, contacts: 3, createdAt: "2026-07-01" },
  { id: "2", name: "GreenLeaf", domain: "greenleaf.com", industry: "Environment", size: "50-100", website: "https://greenleaf.com", deals: 1, contacts: 2, createdAt: "2026-07-15" },
  { id: "3", name: "UrbanStyle", domain: "urbanstyle.com", industry: "Fashion", size: "10-50", website: "https://urbanstyle.com", deals: 1, contacts: 1, createdAt: "2026-08-01" },
  { id: "4", name: "FinServe", domain: "finserve.com", industry: "Finance", size: "500+", website: "https://finserve.com", deals: 1, contacts: 2, createdAt: "2026-06-20" },
  { id: "5", name: "StartupX", domain: "startupx.io", industry: "SaaS", size: "10-50", website: "https://startupx.io", deals: 1, contacts: 1, createdAt: "2026-08-10" },
  { id: "6", name: "HealthPlus", domain: "healthplus.com", industry: "Healthcare", size: "100-200", website: "https://healthplus.com", deals: 1, contacts: 1, createdAt: "2026-09-01" },
  { id: "7", name: "EduLearn", domain: "edulearn.com", industry: "Education", size: "50-100", website: "https://edulearn.com", deals: 1, contacts: 1, createdAt: "2026-08-20" },
  { id: "8", name: "FoodiesCo", domain: "foodiesco.com", industry: "Food & Beverage", size: "10-50", website: "https://foodiesco.com", deals: 1, contacts: 1, createdAt: "2026-07-10" },
  { id: "9", name: "RetailHub", domain: "retailhub.com", industry: "Retail", size: "200+", website: "https://retailhub.com", deals: 1, contacts: 2, createdAt: "2026-09-05" },
];

export const PROJECTS = [
  { id: "1", name: "TechCorp Website Redesign", company: "TechCorp", status: "active", assignee: "Ali Ahmed", startDate: "2026-09-15", endDate: "2026-12-15", budget: 45000 },
  { id: "2", name: "GreenLeaf SEO Campaign", company: "GreenLeaf", status: "active", assignee: "Sara Khan", startDate: "2026-10-01", endDate: "2027-03-01", budget: 12000 },
  { id: "3", name: "FinServe PPC Setup", company: "FinServe", status: "kickoff", assignee: "Bilal Raza", startDate: "2026-10-10", endDate: "2026-11-30", budget: 24000 },
  { id: "4", name: "StartupX Brand Identity", company: "StartupX", status: "done", assignee: "Sara Khan", startDate: "2026-08-01", endDate: "2026-09-25", budget: 15000 },
  { id: "5", name: "FoodiesCo Video Series", company: "FoodiesCo", status: "done", assignee: "Ali Ahmed", startDate: "2026-07-15", endDate: "2026-09-20", budget: 32000 },
  { id: "6", name: "EduLearn Content Plan", company: "EduLearn", status: "paused", assignee: "Bilal Raza", startDate: "2026-09-20", endDate: "2026-12-20", budget: 18000 },
];

export const TICKETS = [
  { id: "1", number: "SOC-1001", subject: "Website login issue", status: "open", priority: "high", assignee: "Ali Ahmed", company: "TechCorp", createdAt: "2026-09-25" },
  { id: "2", number: "SOC-1002", subject: "Campaign report delay", status: "in-progress", priority: "medium", assignee: "Sara Khan", company: "GreenLeaf", createdAt: "2026-09-24" },
  { id: "3", number: "SOC-1003", subject: "Invoice not received", status: "waiting-client", priority: "low", assignee: "Bilal Raza", company: "FinServe", createdAt: "2026-09-23" },
  { id: "4", number: "SOC-1004", subject: "Design revision request", status: "open", priority: "medium", assignee: "Ali Ahmed", company: "StartupX", createdAt: "2026-09-22" },
  { id: "5", number: "SOC-1005", subject: "Access to analytics dashboard", status: "resolved", priority: "low", assignee: "Sara Khan", company: "HealthPlus", createdAt: "2026-09-20" },
  { id: "6", number: "SOC-1006", subject: "Content approval needed", status: "open", priority: "high", assignee: "Bilal Raza", company: "EduLearn", createdAt: "2026-09-19" },
];

export const USERS = [
  { id: "1", name: "Ali Ahmed", email: "ali@sociolab.com", role: "super_admin", status: "Active", lastLogin: "2026-09-27" },
  { id: "2", name: "Sara Khan", email: "sara@sociolab.com", role: "admin", status: "Active", lastLogin: "2026-09-27" },
  { id: "3", name: "Bilal Raza", email: "bilal@sociolab.com", role: "sales_executive", status: "Active", lastLogin: "2026-09-26" },
  { id: "4", name: "Freelancer One", email: "freelancer1@sociolab.com", role: "freelancer", status: "Active", lastLogin: "2026-09-25" },
];

export const PIPELINES = [
  { id: "1", name: "Sales Pipeline", description: "Main sales pipeline", color: "#FF5500", dealCount: 12, totalValue: 540000 },
  { id: "2", name: "Marketing Pipeline", description: "Marketing campaigns", color: "#4CAF50", dealCount: 8, totalValue: 320000 },
  { id: "3", name: "Partnerships", description: "Strategic partnerships", color: "#9C27B0", dealCount: 4, totalValue: 340000 },
];
