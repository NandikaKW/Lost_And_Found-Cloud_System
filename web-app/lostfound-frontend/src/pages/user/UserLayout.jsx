import { Outlet } from "react-router-dom";
import { Search, PackagePlus, Boxes, ClipboardList } from "lucide-react";
import AppShell from "../../components/AppShell";

const nav = [
  { to: "/app", label: "Browse", icon: Search, end: true },
  { to: "/app/report", label: "Report item", icon: PackagePlus },
  { to: "/app/my-items", label: "My items", icon: Boxes },
  { to: "/app/my-claims", label: "My claims", icon: ClipboardList },
];

export default function UserLayout() {
  return (
    <AppShell nav={nav}>
      <Outlet />
    </AppShell>
  );
}
