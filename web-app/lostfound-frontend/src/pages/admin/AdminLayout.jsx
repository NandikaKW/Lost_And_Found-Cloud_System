import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Boxes, ClipboardCheck } from "lucide-react";
import AppShell from "../../components/AppShell";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/items", label: "Items", icon: Boxes },
  { to: "/admin/claims", label: "Claims", icon: ClipboardCheck },
];

export default function AdminLayout() {
  return (
    <AppShell nav={nav}>
      <Outlet />
    </AppShell>
  );
}
