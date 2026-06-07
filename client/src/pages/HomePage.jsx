import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  Users,
  BookOpen,
  FileText,
  Clock,
  BarChart3,
  ArrowRight,
  Github,
  Sparkles,
  Shield,
  Zap,
  Star,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Proposal Management",
      desc: "Submit FYP proposals with ease. Track status, get feedback, and make revisions in real-time.",
      color: "#7A5AF8",
    },
    {
      icon: Users,
      title: "Supervisor Connection",
      desc: "Get paired with experienced supervisors. Communicate and receive expert guidance throughout.",
      color: "#3B82F6",
    },
    {
      icon: Clock,
      title: "Deadline Tracking",
      desc: "Never miss important deadlines. Stay on track with intelligent timeline management.",
      color: "#F59E0B",
    },
    {
      icon: BarChart3,
      title: "Progress Monitoring",
      desc: "Detailed analytics and dashboards for comprehensive project visibility.",
      color: "#10B981",
    },
    {
      icon: Shield,
      title: "File Management",
      desc: "Upload, organize, and share project files securely from one centralized hub.",
      color: "#EF4444",
    },
    {
      icon: BookOpen,
      title: "Feedback & Evaluation",
      desc: "Get constructive feedback and track improvements with detailed evaluation records.",
      color: "#8B5CF6",
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
        background: "#FFFFFF",
        color: "#1E1B4B",
      }}
      className="min-h-screen overflow-x-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        /* ---------- NAV ---------- */
        .nav-bar {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(122,90,248,0.1);
        }

        /* ---------- BUTTONS ---------- */
        .btn-primary {
          background: #7A5AF8;
          color: #fff;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(122,90,248,0.35);
        }
        .btn-primary:hover {
          background: #6849E8;
          box-shadow: 0 6px 24px rgba(122,90,248,0.5);
          transform: translateY(-2px);
        }
        .btn-outline {
          border: 1.5px solid #E5E7EB;
          background: #fff;
          color: #374151;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.25s ease;
        }
        .btn-outline:hover {
          border-color: #7A5AF8;
          color: #7A5AF8;
          background: rgba(122,90,248,0.04);
          transform: translateY(-2px);
        }

        /* ---------- HERO ---------- */
        .hero-section {
          background:
            radial-gradient(ellipse 70% 50% at 5% 0%, rgba(122,90,248,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 95% 10%, rgba(99,102,241,0.07) 0%, transparent 55%),
            #ffffff;
        }
        .hero-badge {
          background: rgba(122,90,248,0.08);
          border: 1px solid rgba(122,90,248,0.2);
          color: #7A5AF8;
        }
        .text-gradient {
          background: linear-gradient(135deg, #7A5AF8 0%, #6366F1 60%, #818CF8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ---------- HERO CARD ---------- */
        .hero-card {
          background: #fff;
          border: 1px solid rgba(122,90,248,0.15);
          border-radius: 24px;
          box-shadow: 0 24px 64px rgba(122,90,248,0.12), 0 4px 16px rgba(0,0,0,0.06);
          animation: float 5s ease-in-out infinite;
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* ---------- FEATURE CARDS ---------- */
        .feat-card {
          background: #fff;
          border: 1px solid #F3F4F6;
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(.175,.885,.32,1.275);
          cursor: default;
        }
        .feat-card:hover {
          transform: translateY(-6px);
          border-color: transparent;
          box-shadow: 0 20px 48px rgba(0,0,0,0.1);
        }
        /* Each card gets its own hover accent via inline style injected below */

        /* ---------- ROLE CARDS ---------- */
        .role-card {
          border-radius: 24px;
          border: 1.5px solid transparent;
          transition: all 0.35s ease;
        }
        .role-card:hover { transform: translateY(-8px); }

        /* ---------- STEP ---------- */
        .step-circle {
          background: linear-gradient(135deg, #7A5AF8, #6366F1);
          box-shadow: 0 8px 24px rgba(122,90,248,0.35);
        }
        .step-connector {
          background: linear-gradient(90deg, rgba(122,90,248,0.4), rgba(122,90,248,0.05));
        }

        /* ---------- CTA ---------- */
        .cta-section {
          background: linear-gradient(135deg, #7A5AF8 0%, #6366F1 50%, #818CF8 100%);
        }

        /* ---------- FOOTER ---------- */
        .footer-section {
          background: #1E1B4B;
          color: #fff;
        }

        /* ---------- DIVIDER ---------- */
        .divider { background: linear-gradient(90deg, transparent, rgba(122,90,248,0.2), transparent); }

        /* ---------- BADGE PULSE ---------- */
        @keyframes pulse-badge {
          0%,100% { box-shadow: 0 0 0 rgba(122,90,248,0); }
          50% { box-shadow: 0 0 16px rgba(122,90,248,0.25); }
        }
        .hero-badge { animation: pulse-badge 3s ease-in-out infinite; }

        /* ---------- STATS ---------- */
        .stat-pill {
          background: #F5F3FF;
          border: 1px solid rgba(122,90,248,0.15);
          border-radius: 14px;
          transition: all 0.25s ease;
        }
        .stat-pill:hover {
          background: rgba(122,90,248,0.08);
          border-color: rgba(122,90,248,0.35);
          transform: translateY(-2px);
        }

        /* ---------- INPUT STYLE (matching login) ---------- */
        .info-chip {
          background: #EEF2FF;
          border-radius: 10px;
          color: #4338CA;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* ---------- SECTION BG ALT ---------- */
        .alt-bg {
          background: #F9FAFB;
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav-bar sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#7A5AF8,#9F7AEA)",
                }}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                FYP <span className="text-gradient">Management</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/register")}
                className="btn-outline px-5 py-2 text-sm"
              >
                Register
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn-primary px-5 py-2 text-sm text-white"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Streamline Your FYP Journey
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6 text-slate-900">
                Smart Final Year
                <br />
                <span className="text-gradient">Project Management</span>
              </h1>
              <p
                className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg"
                style={{ fontFamily: "'DM Sans',sans-serif" }}
              >
                A centralized platform connecting students, supervisors, and
                administrators. Manage proposals, track progress, and
                collaborate — all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="btn-primary px-8 py-3.5 flex items-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="btn-outline px-8 py-3.5"
                >
                  Sign In
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mt-10">
                {[
                  ["500+", "Students"],
                  ["50+", "Supervisors"],
                  ["98%", "Satisfaction"],
                ].map(([n, l]) => (
                  <div key={l} className="stat-pill px-4 py-3 text-center">
                    <div className="text-xl font-bold text-gradient">{n}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Card */}
            <div className="hidden md:flex justify-center">
              <div className="hero-card w-full max-w-md p-6">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
                      My Project
                    </p>
                    <p className="text-slate-900 font-bold mt-0.5">
                      ML-Based Predictive Model
                    </p>
                  </div>
                  <span className="info-chip px-3 py-1 inline-block">
                    Active
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Overall Progress</span>
                    <span className="font-bold" style={{ color: "#7A5AF8" }}>
                      72%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-2 rounded-full w-[72%] transition-all"
                      style={{
                        background: "linear-gradient(90deg,#7A5AF8,#9F7AEA)",
                      }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2.5 mb-5">
                  {[
                    ["Proposal Submitted", true],
                    ["Supervisor Assigned", true],
                    ["Chapter 1 Draft", true],
                    ["Data Collection", false],
                    ["Final Submission", false],
                  ].map(([item, done]) => (
                    <div key={item} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "" : "bg-slate-100"}`}
                        style={done ? { background: "#7A5AF8" } : {}}
                      >
                        {done && (
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${done ? "text-slate-700 font-medium" : "text-slate-400"}`}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Next Deadline chip */}
                <div
                  className="rounded-xl p-3 flex items-center gap-3"
                  style={{
                    background: "#EEF2FF",
                    border: "1px solid rgba(122,90,248,0.2)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(122,90,248,0.15)" }}
                  >
                    <Clock className="w-4 h-4" style={{ color: "#7A5AF8" }} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Next Deadline</p>
                    <p className="text-sm font-bold text-slate-800">
                      Chapter 2 — Jun 20
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider h-px" />

      {/* ── FEATURES ── */}
      <section className="alt-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#7A5AF8" }}
            >
              Capabilities
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
              Everything You <span className="text-gradient">Need</span>
            </h2>
            <p
              className="text-slate-500 text-lg max-w-xl mx-auto"
              style={{ fontFamily: "'DM Sans',sans-serif" }}
            >
              Powerful tools to manage your entire FYP from proposal to
              submission
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <div
                key={i}
                className="feat-card p-7 group"
                style={{ "--hover-color": color }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = `0 20px 48px ${color}22`)
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                  style={{
                    background: `${color}14`,
                    border: `1px solid ${color}30`,
                  }}
                  onMouseEnter={() => {}}
                >
                  <Icon
                    className="w-5 h-5 transition-colors duration-300"
                    style={{ color }}
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {title}
                </h3>
                <p
                  className="text-slate-500 text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider h-px" />

      {/* ── ROLES ── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#7A5AF8" }}
            >
              Built for All
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
              One Platform, <span className="text-gradient">Every Role</span>
            </h2>
            <p
              className="text-slate-500 text-lg max-w-xl mx-auto"
              style={{ fontFamily: "'DM Sans',sans-serif" }}
            >
              Unique tailored workflows for every stakeholder
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Students */}
            <div
              className="role-card p-8"
              style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 20px 48px rgba(59,130,246,0.15)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: "#3B82F6",
                  boxShadow: "0 8px 20px rgba(59,130,246,0.3)",
                }}
              >
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Students
              </h3>
              <p
                className="text-slate-500 text-sm mb-6"
                style={{ fontFamily: "'DM Sans',sans-serif" }}
              >
                Everything to take your project from idea to completion.
              </p>
              <ul className="space-y-3">
                {[
                  "Submit project proposals easily",
                  "Work with assigned supervisors",
                  "Upload deliverables and get feedback",
                  "Track deadlines and progress",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-600 text-sm"
                  >
                    <CheckCircle
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "#3B82F6" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Supervisors */}
            <div
              className="role-card p-8"
              style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 20px 48px rgba(16,185,129,0.15)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: "#10B981",
                  boxShadow: "0 8px 20px rgba(16,185,129,0.3)",
                }}
              >
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Supervisors
              </h3>
              <p
                className="text-slate-500 text-sm mb-6"
                style={{ fontFamily: "'DM Sans',sans-serif" }}
              >
                Tools to guide and evaluate your students effectively.
              </p>
              <ul className="space-y-3">
                {[
                  "Review student proposals",
                  "Provide detailed feedback",
                  "Monitor student progress",
                  "Manage assigned students",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-600 text-sm"
                  >
                    <CheckCircle
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "#10B981" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Admins */}
            <div
              className="role-card p-8"
              style={{ background: "#F5F3FF", border: "1.5px solid #DDD6FE" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 20px 48px rgba(122,90,248,0.15)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: "#7A5AF8",
                  boxShadow: "0 8px 20px rgba(122,90,248,0.35)",
                }}
              >
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Administrators
              </h3>
              <p
                className="text-slate-500 text-sm mb-6"
                style={{ fontFamily: "'DM Sans',sans-serif" }}
              >
                Full oversight and control over the entire system.
              </p>
              <ul className="space-y-3">
                {[
                  "Manage students and supervisors",
                  "Assign supervisors to students",
                  "Set and manage deadlines",
                  "View all projects and analytics",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-600 text-sm"
                  >
                    <CheckCircle
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "#7A5AF8" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="divider h-px" />

      {/* ── HOW IT WORKS ── */}
      <section className="alt-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#7A5AF8" }}
            >
              Process
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p
              className="text-slate-500 text-lg"
              style={{ fontFamily: "'DM Sans',sans-serif" }}
            >
              Four simple steps to get your FYP on track
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Sign Up",
                desc: "Create your account with credentials in seconds",
                icon: Zap,
              },
              {
                step: "02",
                title: "Submit Proposal",
                desc: "Create and submit your FYP proposal for review",
                icon: FileText,
              },
              {
                step: "03",
                title: "Get Assigned",
                desc: "Get paired with the perfect supervisor",
                icon: Users,
              },
              {
                step: "04",
                title: "Track & Execute",
                desc: "Collaborate and track your progress to completion",
                icon: BarChart3,
              },
            ].map(({ step, title, desc }, i) => (
              <div key={i} className="relative text-center group">
                {i < 3 && (
                  <div className="step-connector hidden md:block absolute top-8 right-0 translate-x-1/2 w-[calc(100%-4rem)] h-px z-0" />
                )}
                <div className="relative z-10">
                  <div className="step-circle w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">{step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p
                    className="text-slate-500 text-sm leading-relaxed px-2"
                    style={{ fontFamily: "'DM Sans',sans-serif" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section relative py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 mb-6">
            <Star className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-semibold">
              Join 500+ Active Users
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to Transform Your
            <br />
            FYP Experience?
          </h2>
          <p
            className="text-white/80 text-lg mb-10 max-w-2xl mx-auto"
            style={{ fontFamily: "'DM Sans',sans-serif" }}
          >
            Join hundreds of students and supervisors already using FYP
            Management System to streamline their project workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-white font-bold rounded-2xl transition-all duration-200 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 inline-flex items-center justify-center gap-2 group"
              style={{ color: "#7A5AF8" }}
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 border-2 border-white/40 text-white font-semibold rounded-2xl hover:bg-white/15 transition-all duration-200 hover:-translate-y-1"
            >
              Already have an account?
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-section py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#7A5AF8,#9F7AEA)",
                  }}
                >
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">FYP Management</span>
              </div>
              <p
                className="text-slate-400 text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans',sans-serif" }}
              >
                Streamlining final year projects for students, supervisors, and
                administrators.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Security", "Pricing"] },
              {
                title: "Resources",
                links: ["Documentation", "Blog", "Support"],
              },
              { title: "Company", links: ["About", "Contact", "Privacy"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold text-white mb-4 text-sm tracking-wide">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-purple-400 transition-colors text-sm"
                        style={{ fontFamily: "'DM Sans',sans-serif" }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 FYP Management System. All rights reserved.
            </p>
            <a
              href="#"
              className="text-slate-500 hover:text-purple-400 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
