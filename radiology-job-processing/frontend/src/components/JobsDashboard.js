

import React, { useEffect, useState } from "react";
import { listJobs } from "../api/jobs";

const STATUS_COLORS = {
  queued: "#94a3b8",
  processing: "#0ea5e9",
  completed: "#16a34a",
  failed: "#dc2626",
};

const STATUS_BG = {
  queued: "#f1f5f9",
  processing: "#e0f2fe",
  completed: "#dcfce7",
  failed: "#fee2e2",
};

const POLL_INTERVAL_MS = 2000;

export default function JobsDashboard({ refreshSignal }) {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await listJobs();
      setJobs(res.data);
    } catch (err) {
      // Polling errors are non-fatal; just skip this tick.
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshSignal]);

  const counts = jobs.reduce(
    (acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    },
    { queued: 0, processing: 0, completed: 0, failed: 0 }
  );

  return (
    <div className="jd-wrap">
      <style>{`
        .jd-wrap {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px 32px 32px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.08);
        }
        .jd-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .jd-title {
          margin: 0;
          font-size: 17px;
          font-weight: 650;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .jd-live {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 600;
          color: #16a34a;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .jd-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16a34a;
          animation: jd-pulse 1.6s ease-in-out infinite;
        }
        .jd-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .jd-stat {
          border-radius: 12px;
          padding: 14px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .jd-stat-count {
          font-size: 24px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .jd-stat-label {
          font-size: 11.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-top: 2px;
        }
        .jd-table-scroll {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        table.jd-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }
        .jd-table thead th {
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          background: #f8fafc;
          padding: 11px 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        .jd-table tbody td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
        }
        .jd-table tbody tr:last-child td {
          border-bottom: none;
        }
        .jd-table tbody tr:hover {
          background: #f8fafc;
        }
        .jd-mono {
          font-family: "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 12.5px;
          color: #475569;
        }
        .jd-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 650;
          text-transform: capitalize;
        }
        .jd-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .jd-badge-dot.processing {
          animation: jd-pulse 1.4s ease-in-out infinite;
        }
        .jd-error-text {
          color: #b91c1c;
          font-size: 12.5px;
        }
        .jd-empty {
          text-align: center;
          padding: 36px;
          color: #94a3b8;
          font-size: 13.5px;
        }
        @keyframes jd-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.75); }
        }
        @media (max-width: 640px) {
          .jd-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="jd-header">
        <h2 className="jd-title">Live Dashboard</h2>
        <div className="jd-live">
          <span className="jd-live-dot" />
          Live
        </div>
      </div>

      <div className="jd-stats">
        {Object.entries(counts).map(([status, count]) => (
          <div className="jd-stat" key={status}>
            <div className="jd-stat-count" style={{ color: STATUS_COLORS[status] }}>
              {count}
            </div>
            <div className="jd-stat-label">{status}</div>
          </div>
        ))}
      </div>

      <div className="jd-table-scroll">
        <table className="jd-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Attempts</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="jd-mono">{job.id}</td>
                <td>{job.type}</td>
                <td style={{ textTransform: "capitalize" }}>{job.priority}</td>
                <td>
                  <span
                    className="jd-badge"
                    style={{ color: STATUS_COLORS[job.status], background: STATUS_BG[job.status] }}
                  >
                    <span
                      className={`jd-badge-dot${job.status === "processing" ? " processing" : ""}`}
                      style={{ background: STATUS_COLORS[job.status] }}
                    />
                    {job.status}
                  </span>
                </td>
                <td className="jd-mono">{job.attempts}</td>
                <td className="jd-error-text">{job.error_message || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && <div className="jd-empty">No jobs yet. Create one above to get started.</div>}
      </div>
    </div>
  );
}
