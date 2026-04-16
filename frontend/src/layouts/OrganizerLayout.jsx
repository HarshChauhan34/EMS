import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function OrganizerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navClass = (path) =>
    `group relative overflow-hidden px-4 py-3 rounded-2xl text-center md:text-left transition-all duration-300 font-medium ${
      isActive(path)
        ? "bg-linear-to-r from-pink-500 via-violet-500 to-purple-600 text-white shadow-lg shadow-pink-500/20"
        : "text-slate-200 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10"
    }`;

  return (
    <div className="site-shell min-h-screen flex text-white">
      {/* SIDEBAR */}
      <aside className="glass-panel hidden md:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-white/10 rounded-none">
        <div className="relative flex h-full flex-col p-6">
          <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute bottom-10 -right-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

          {/* BRAND */}
          <div className="relative mb-10">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 via-violet-500 to-purple-600 text-xl shadow-lg">
                🎟
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">Organizer</h2>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Event Studio
                </p>
              </div>
            </div>
          </div>

          {/* NAV */}
          <nav className="relative flex flex-col gap-3">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/organizer")}
              className={navClass("/organizer")}
            >
              <span className="relative z-10">📊 Dashboard</span>
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/organizer/create-event")}
              className={navClass("/organizer/create-event")}
            >
              <span className="relative z-10">➕ Create Event</span>
            </motion.button>
          </nav>

          {/* FOOTER */}
          <div className="relative mt-auto pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-xs text-slate-400">
              © 2026 EventPro
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE NAV */}
      <div className="glass-panel fixed bottom-0 left-0 right-0 z-30 grid md:hidden grid-cols-2 gap-2 border-t border-white/10 rounded-none p-2">
        <button
          onClick={() => navigate("/organizer")}
          className={`${navClass("/organizer")} px-2 py-2 text-center text-[11px] leading-tight`}
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/organizer/create-event")}
          className={`${navClass("/organizer/create-event")} px-2 py-2 text-center text-[11px] leading-tight`}
        >
          Create Event
        </button>
      </div>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-4 pt-4 pb-24 md:ml-72 md:p-8 md:pt-8 md:pb-8">
        <div className="min-h-[calc(100vh-8rem)] rounded-[28px] border border-white/10 bg-white/3 p-3 sm:p-4 md:p-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default OrganizerLayout;
