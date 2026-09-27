import { DashShell } from "./client";
import { DashboardView } from "./dashboard/dashboard-view";

export default function NewDashPage() {
  return (
    <DashShell>
      <DashboardView />
    </DashShell>
  );
}
