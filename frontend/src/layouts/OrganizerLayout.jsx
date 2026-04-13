import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function OrganizerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navClass = (path) =>
    `group relative overflow-hidden px-4 py-3 rounded-2xl text-left transition-all duration-300 font-medium ${
      isActive(path)
        ? "bg-gradient-to-r from-pink-500 via-violet-500 to-purple-600 text-white shadow-lg shadow-pink-500/20"
        : "text-slate-200 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10"
    }`;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#081120] via-[#151a35] to-[#24195c] text-white">
      {/* SIDEBAR */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
        <div className="relative flex h-full flex-col p-6">
          <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute bottom-10 -right-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

          {/* BRAND */}
          <div className="relative mb-10">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-violet-500 to-purple-600 text-xl shadow-lg">
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

      {/* MOBILE TOPBAR */}
      <div className="fixed top-0 left-0 right-0 z-30 flex md:hidden items-center justify-between border-b border-white/10 bg-[#081120]/80 px-4 py-4 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-violet-500 to-purple-600 shadow-lg">
            🎟
          </div>
          <div>
            <h2 className="text-lg font-bold leading-none">Organizer</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Event Studio
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-30 grid md:hidden grid-cols-2 gap-2 border-t border-white/10 bg-[#081120]/85 p-3 backdrop-blur-2xl">
        <button
          onClick={() => navigate("/organizer")}
          className={`${navClass("/organizer")} px-3 py-2 text-center text-sm`}
        >
          📊
        </button>

        <button
          onClick={() => navigate("/organizer/create-event")}
          className={`${navClass("/organizer/create-event")} px-3 py-2 text-center text-sm`}
        >
          ➕
        </button>
      </div>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-4 pt-24 md:p-8 md:ml-72 md:pt-8 pb-24 md:pb-8">
        <div className="min-h-[calc(100vh-8rem)] rounded-[28px] border border-white/10 bg-white/[0.03] p-3 sm:p-4 md:p-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default OrganizerLayout;
