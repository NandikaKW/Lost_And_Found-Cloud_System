import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Tag } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ nav, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = (user?.email || "?").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-paper lg:flex">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-white lg:flex">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Tag size={17} strokeWidth={2.4} />
            <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--color-ok)]" />
          </div>
          <div>
            <p className="font-display text-base font-bold leading-tight text-ink">
              FindBack
            </p>
            <p className="text-[11px] font-medium text-ink-soft">
              Lost &amp; Found Cloud
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3.5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-soft hover:bg-paper hover:text-ink"
                }`
              }
            >
              <item.icon size={17} strokeWidth={2.2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-3.5">
          <div className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 font-mono text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {user?.email}
              </p>
              <p className="text-[11px] font-medium capitalize text-ink-soft">
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="shrink-0 rounded-lg p-1.5 text-ink-soft transition hover:bg-white hover:text-[var(--color-bad)]"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Tag size={15} />
          </div>
          <p className="font-display text-sm font-bold text-ink">FindBack</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-ink-soft hover:bg-paper"
        >
          <LogOut size={17} />
        </button>
      </div>

      {/* Mobile nav */}
      <nav className="sticky top-[53px] z-20 flex gap-1 overflow-x-auto border-b border-line bg-white px-3 py-2 scrollbar-thin lg:hidden">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-soft hover:bg-paper"
              }`
            }
          >
            <item.icon size={14} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        {children}
      </main>
    </div>
  );
}
