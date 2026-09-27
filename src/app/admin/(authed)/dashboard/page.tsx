import { DashShell } from "../client";
import { DashboardView } from "./dashboard-view";

export default function DashboardPage() {
  return (
    <DashShell>
      <DashboardView />
    </DashShell>
  );
}
