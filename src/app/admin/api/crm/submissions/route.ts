import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { isFreelancer } from "@/lib/auth/roles";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const projectId = request.nextUrl.searchParams.get("projectId") || "";
  const status = request.nextUrl.searchParams.get("status") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

  const result = await store.getSubmissions({ projectId, status, page, limit });

  // Freelancers can only see their own submissions
  if (isFreelancer(user)) {
    const filtered = {
      ...result,
      submissions: result.submissions.filter((s: any) => s.submitterId === user.id),
    };
    return NextResponse.json(filtered);
  }

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    projectId: string;
    taskId?: string;
    title: string;
    description?: string;
    status?: string;
    files?: string[];
    feedback?: string;
    submitterId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.projectId || !body.title) {
    return NextResponse.json({ error: "Project ID and title required." }, { status: 400 });
  }

  const submission = await store.createSubmission({
    projectId: body.projectId,
    taskId: body.taskId,
    title: body.title,
    description: body.description,
    status: body.status || "pending",
    files: body.files || [],
    feedback: body.feedback,
    submitterId: body.submitterId || user.id,
  });

  await store.createActivity({
    type: "submission-created",
    subject: `Submitted "${submission.title}"`,
    projectId: body.projectId,
  }, user.id);

  return NextResponse.json({ submission });
}
