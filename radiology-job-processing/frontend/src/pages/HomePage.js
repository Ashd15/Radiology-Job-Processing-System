


// import React, { useState } from "react";
// import CreateJobForm from "../components/CreateJobForm";
// import JobsDashboard from "../components/JobsDashboard";

// export default function HomePage() {
//   const [refreshSignal, setRefreshSignal] = useState(0);
//   const [reportOpen, setReportOpen] = useState(false);
//   const [reportText, setReportText] = useState("");
//   const [reportSubmitting, setReportSubmitting] = useState(false);
//   const [reportError, setReportError] = useState(null);
//   const [reportSuccess, setReportSuccess] = useState(false);

//   const handleReportSubmit = async (e) => {
//     e.preventDefault();
//     setReportError(null);
//     setReportSubmitting(true);
//     try {
//       // TODO: wire this up to your real endpoint, e.g.:
//       // await submitReport({ text: reportText });
//       await new Promise((resolve) => setTimeout(resolve, 700));
//       setReportSuccess(true);
//       setReportText("");
//       setTimeout(() => {
//         setReportOpen(false);
//         setReportSuccess(false);
//       }, 900);
//     } catch (err) {
//       setReportError(err.response?.data?.error || "Could not submit report.");
//     } finally {
//       setReportSubmitting(false);
//     }
//   };

//   const closeModal = () => {
//     if (reportSubmitting) return;
//     setReportOpen(false);
//     setReportError(null);
//     setReportText("");
//   };

//   return (
//     <div className="hp-page">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

//         .hp-page {
//           min-height: 100vh;
//           background: #f1f5f9;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//         }
//         .hp-header {
//           background: linear-gradient(135deg, #0b1220 0%, #0f2438 100%);
//           padding: 28px 0;
//           margin-bottom: 32px;
//         }
//         .hp-header-inner {
//           max-width: 960px;
//           margin: 0 auto;
//           padding: 0 24px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 20px;
//         }
//         .hp-brand {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }
//         .hp-mark {
//           width: 40px;
//           height: 40px;
//           border-radius: 11px;
//           background: linear-gradient(135deg, #0ea5e9, #0369a1);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//         }
//         .hp-title {
//           margin: 0;
//           font-size: 20px;
//           font-weight: 750;
//           color: #f8fafc;
//           letter-spacing: -0.01em;
//         }
//         .hp-subtitle {
//           margin: 2px 0 0;
//           font-size: 12.5px;
//           color: #94a3b8;
//         }
//         .hp-report-btn {
//           font: inherit;
//           font-size: 13.5px;
//           font-weight: 650;
//           padding: 10px 18px;
//           border-radius: 9px;
//           border: 1.5px solid rgba(148, 163, 184, 0.35);
//           background: rgba(255, 255, 255, 0.06);
//           color: #f8fafc;
//           cursor: pointer;
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           transition: background 0.15s ease, border-color 0.15s ease;
//           white-space: nowrap;
//         }
//         .hp-report-btn:hover {
//           background: rgba(255, 255, 255, 0.12);
//           border-color: rgba(148, 163, 184, 0.55);
//         }
//         .hp-content {
//           max-width: 960px;
//           margin: 0 auto;
//           padding: 0 24px 48px;
//         }

//         /* Modal */
//         .hp-overlay {
//           position: fixed;
//           inset: 0;
//           background: rgba(15, 23, 42, 0.55);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//           z-index: 50;
//           animation: hp-fade-in 0.15s ease;
//         }
//         .hp-modal {
//           background: #ffffff;
//           border-radius: 16px;
//           width: 100%;
//           max-width: 480px;
//           padding: 26px 26px 24px;
//           box-shadow: 0 20px 60px -12px rgba(15, 23, 42, 0.35);
//           animation: hp-rise-in 0.18s ease;
//         }
//         .hp-modal-header {
//           display: flex;
//           align-items: flex-start;
//           justify-content: space-between;
//           margin-bottom: 6px;
//         }
//         .hp-modal-title {
//           margin: 0;
//           font-size: 16.5px;
//           font-weight: 700;
//           color: #0f172a;
//         }
//         .hp-modal-sub {
//           margin: 4px 0 18px;
//           font-size: 13px;
//           color: #64748b;
//         }
//         .hp-close {
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #94a3b8;
//           padding: 4px;
//           line-height: 0;
//           border-radius: 6px;
//         }
//         .hp-close:hover {
//           color: #475569;
//           background: #f1f5f9;
//         }
//         .hp-textarea {
//           width: 100%;
//           min-height: 140px;
//           font: inherit;
//           font-size: 14px;
//           padding: 12px 14px;
//           border-radius: 10px;
//           border: 1.5px solid #e2e8f0;
//           background: #f8fafc;
//           color: #0f172a;
//           resize: vertical;
//           outline: none;
//           box-sizing: border-box;
//           transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
//         }
//         .hp-textarea:focus {
//           border-color: #0ea5e9;
//           background: #ffffff;
//           box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
//         }
//         .hp-modal-actions {
//           display: flex;
//           justify-content: flex-end;
//           gap: 10px;
//           margin-top: 18px;
//         }
//         .hp-btn-secondary {
//           font: inherit;
//           font-size: 13.5px;
//           font-weight: 600;
//           padding: 10px 16px;
//           border-radius: 9px;
//           border: 1.5px solid #e2e8f0;
//           background: #ffffff;
//           color: #475569;
//           cursor: pointer;
//         }
//         .hp-btn-secondary:hover {
//           background: #f8fafc;
//         }
//         .hp-btn-primary {
//           font: inherit;
//           font-size: 13.5px;
//           font-weight: 650;
//           padding: 10px 18px;
//           border-radius: 9px;
//           border: none;
//           background: linear-gradient(135deg, #0ea5e9, #0369a1);
//           color: #ffffff;
//           cursor: pointer;
//         }
//         .hp-btn-primary:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }
//         .hp-modal-error {
//           background: #fef2f2;
//           border: 1px solid #fecaca;
//           color: #b91c1c;
//           font-size: 12.5px;
//           padding: 9px 12px;
//           border-radius: 8px;
//           margin-top: 12px;
//         }
//         .hp-modal-success {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           background: #f0fdf4;
//           border: 1px solid #bbf7d0;
//           color: #15803d;
//           font-size: 13px;
//           font-weight: 600;
//           padding: 10px 12px;
//           border-radius: 8px;
//           margin-top: 12px;
//         }
//         @keyframes hp-fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes hp-rise-in {
//           from { opacity: 0; transform: translateY(8px) scale(0.98); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @media (max-width: 560px) {
//           .hp-header-inner { flex-direction: column; align-items: flex-start; }
//         }
//       `}</style>

//       <header className="hp-header">
//         <div className="hp-header-inner">
//           <div className="hp-brand">
//             <div className="hp-mark">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                 <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="1.8" />
//                 <path d="M12 8v4l3 2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             </div>
//             <div>
//               <h1 className="hp-title">Radiology Job Processing System</h1>
//               <p className="hp-subtitle">Submit, track, and report on imaging studies</p>
//             </div>
//           </div>

//           <button className="hp-report-btn" onClick={() => setReportOpen(true)}>
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
//               <path
//                 d="M9 2h6l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
//                 stroke="currentColor"
//                 strokeWidth="1.6"
//                 strokeLinejoin="round"
//               />
//               <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//             </svg>
//             Create Report
//           </button>
//         </div>
//       </header>

//       <div className="hp-content">
//         <CreateJobForm onJobCreated={() => setRefreshSignal((n) => n + 1)} />
//         <JobsDashboard refreshSignal={refreshSignal} />
//       </div>

//       {reportOpen && (
//         <div className="hp-overlay" onClick={closeModal}>
//           <div className="hp-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="hp-modal-header">
//               <div>
//                 <h3 className="hp-modal-title">Create Report</h3>
//               </div>
//               <button className="hp-close" onClick={closeModal} aria-label="Close">
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                   <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//                 </svg>
//               </button>
//             </div>
//             <p className="hp-modal-sub">Write up findings or notes and submit them below.</p>

//             <form onSubmit={handleReportSubmit}>
//               <textarea
//                 className="hp-textarea"
//                 value={reportText}
//                 onChange={(e) => setReportText(e.target.value)}
//                 placeholder="Type your report here…"
//                 required
//                 autoFocus
//               />

//               {reportError && <div className="hp-modal-error">{reportError}</div>}
//               {reportSuccess && (
//                 <div className="hp-modal-success">
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                     <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>
//                   Report submitted
//                 </div>
//               )}

//               <div className="hp-modal-actions">
//                 <button type="button" className="hp-btn-secondary" onClick={closeModal} disabled={reportSubmitting}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="hp-btn-primary" disabled={reportSubmitting}>
//                   {reportSubmitting ? "Submitting…" : "Submit Report"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }     



import React, { useState } from "react";
import CreateJobForm from "../components/CreateJobForm";
import JobsDashboard from "../components/JobsDashboard";
import { submitReport } from "../api/jobs";

export default function HomePage() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportError(null);
    setReportSubmitting(true);
    try {
      await submitReport({ content: reportText });
      setReportSuccess(true);
      setReportText("");
      setTimeout(() => {
        setReportOpen(false);
        setReportSuccess(false);
      }, 900);
    } catch (err) {
      setReportError(err.response?.data?.error || "Could not submit report.");
    } finally {
      setReportSubmitting(false);
    }
  };

  const closeModal = () => {
    if (reportSubmitting) return;
    setReportOpen(false);
    setReportError(null);
    setReportText("");
  };

  return (
    <div className="hp-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .hp-page {
          min-height: 100vh;
          background: #f1f5f9;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .hp-header {
          background: linear-gradient(135deg, #0b1220 0%, #0f2438 100%);
          padding: 28px 0;
          margin-bottom: 32px;
        }
        .hp-header-inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .hp-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hp-mark {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: linear-gradient(135deg, #0ea5e9, #0369a1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hp-title {
          margin: 0;
          font-size: 20px;
          font-weight: 750;
          color: #f8fafc;
          letter-spacing: -0.01em;
        }
        .hp-subtitle {
          margin: 2px 0 0;
          font-size: 12.5px;
          color: #94a3b8;
        }
        .hp-report-btn {
          font: inherit;
          font-size: 13.5px;
          font-weight: 650;
          padding: 10px 18px;
          border-radius: 9px;
          border: 1.5px solid rgba(148, 163, 184, 0.35);
          background: rgba(255, 255, 255, 0.06);
          color: #f8fafc;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease, border-color 0.15s ease;
          white-space: nowrap;
        }
        .hp-report-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(148, 163, 184, 0.55);
        }
        .hp-content {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 24px 48px;
        }

        /* Modal */
        .hp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 50;
          animation: hp-fade-in 0.15s ease;
        }
        .hp-modal {
          background: #ffffff;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          padding: 26px 26px 24px;
          box-shadow: 0 20px 60px -12px rgba(15, 23, 42, 0.35);
          animation: hp-rise-in 0.18s ease;
        }
        .hp-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .hp-modal-title {
          margin: 0;
          font-size: 16.5px;
          font-weight: 700;
          color: #0f172a;
        }
        .hp-modal-sub {
          margin: 4px 0 18px;
          font-size: 13px;
          color: #64748b;
        }
        .hp-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 4px;
          line-height: 0;
          border-radius: 6px;
        }
        .hp-close:hover {
          color: #475569;
          background: #f1f5f9;
        }
        .hp-textarea {
          width: 100%;
          min-height: 140px;
          font: inherit;
          font-size: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          resize: vertical;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
        }
        .hp-textarea:focus {
          border-color: #0ea5e9;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
        }
        .hp-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }
        .hp-btn-secondary {
          font: inherit;
          font-size: 13.5px;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 9px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          cursor: pointer;
        }
        .hp-btn-secondary:hover {
          background: #f8fafc;
        }
        .hp-btn-primary {
          font: inherit;
          font-size: 13.5px;
          font-weight: 650;
          padding: 10px 18px;
          border-radius: 9px;
          border: none;
          background: linear-gradient(135deg, #0ea5e9, #0369a1);
          color: #ffffff;
          cursor: pointer;
        }
        .hp-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .hp-modal-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 12.5px;
          padding: 9px 12px;
          border-radius: 8px;
          margin-top: 12px;
        }
        .hp-modal-success {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 12px;
          border-radius: 8px;
          margin-top: 12px;
        }
        @keyframes hp-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes hp-rise-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 560px) {
          .hp-header-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <header className="hp-header">
        <div className="hp-header-inner">
          <div className="hp-brand">
            <div className="hp-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="1.8" />
                <path d="M12 8v4l3 2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="hp-title">Radiology Job Processing System</h1>
              <p className="hp-subtitle">Submit, track, and report on imaging studies</p>
            </div>
          </div>

          <button className="hp-report-btn" onClick={() => setReportOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 2h6l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Create Report
          </button>
        </div>
      </header>

      <div className="hp-content">
        <CreateJobForm onJobCreated={() => setRefreshSignal((n) => n + 1)} />
        <JobsDashboard refreshSignal={refreshSignal} />
      </div>

      {reportOpen && (
        <div className="hp-overlay" onClick={closeModal}>
          <div className="hp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-modal-header">
              <div>
                <h3 className="hp-modal-title">Create Report</h3>
              </div>
              <button className="hp-close" onClick={closeModal} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className="hp-modal-sub">Write up findings or notes and submit them below.</p>

            <form onSubmit={handleReportSubmit}>
              <textarea
                className="hp-textarea"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Type your report here…"
                required
                autoFocus
              />

              {reportError && <div className="hp-modal-error">{reportError}</div>}
              {reportSuccess && (
                <div className="hp-modal-success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Report submitted
                </div>
              )}

              <div className="hp-modal-actions">
                <button type="button" className="hp-btn-secondary" onClick={closeModal} disabled={reportSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="hp-btn-primary" disabled={reportSubmitting}>
                  {reportSubmitting ? "Submitting…" : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
