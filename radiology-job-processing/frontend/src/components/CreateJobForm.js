
import React, { useState } from "react";
import { createJob } from "../api/jobs";

const JOB_TYPES = ["CT Scan", "MRI", "Chest X-Ray"];

export default function CreateJobForm({ onJobCreated }) {
  const [type, setType] = useState(JOB_TYPES[0]);
  const [priority, setPriority] = useState("standard");
  const [patient, setPatient] = useState("");
  const [studyId, setStudyId] = useState("");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createJob({
        type,
        priority,
        payload: {
          patient,
          study_id: studyId,
          simulate_failure: simulateFailure,
        },
      });
      setPatient("");
      setStudyId("");
      setSimulateFailure(false);
      if (onJobCreated) onJobCreated();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cjf-card">
      <style>{`
        .cjf-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px 32px 32px;
          margin-bottom: 28px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.08);
        }
        .cjf-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
        }
        .cjf-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, #0ea5e9, #0369a1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cjf-title {
          margin: 0;
          font-size: 17px;
          font-weight: 650;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .cjf-subtitle {
          margin: 2px 0 0;
          font-size: 12.5px;
          color: #64748b;
        }
        .cjf-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 4px;
        }
        .cjf-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }
        .cjf-field.full {
          grid-column: 1 / -1;
        }
        .cjf-label {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .cjf-select, .cjf-input {
          font: inherit;
          font-size: 14.5px;
          padding: 10px 12px;
          border-radius: 9px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
        }
        .cjf-select:hover, .cjf-input:hover {
          border-color: #cbd5e1;
        }
        .cjf-select:focus, .cjf-input:focus {
          border-color: #0ea5e9;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
        }
        .cjf-priority {
          display: inline-flex;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          overflow: hidden;
          width: fit-content;
        }
        .cjf-priority button {
          font: inherit;
          font-size: 13.5px;
          font-weight: 600;
          padding: 9px 18px;
          border: none;
          background: #f8fafc;
          color: #64748b;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .cjf-priority button:not(:last-child) {
          border-right: 1.5px solid #e2e8f0;
        }
        .cjf-priority button.active {
          background: #0f172a;
          color: #ffffff;
        }
        .cjf-priority button.active.urgent {
          background: #dc2626;
        }
        .cjf-checkbox-row {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 20px;
          user-select: none;
        }
        .cjf-checkbox-row input {
          width: 16px;
          height: 16px;
          accent-color: #0ea5e9;
          cursor: pointer;
        }
        .cjf-checkbox-row label {
          font-size: 13.5px;
          color: #475569;
          cursor: pointer;
        }
        .cjf-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 9px;
          margin-bottom: 16px;
        }
        .cjf-submit {
          font: inherit;
          font-size: 14.5px;
          font-weight: 650;
          padding: 11px 22px;
          border: none;
          border-radius: 9px;
          background: linear-gradient(135deg, #0ea5e9, #0369a1);
          color: #ffffff;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.1s ease;
          box-shadow: 0 4px 12px -4px rgba(3, 105, 161, 0.5);
        }
        .cjf-submit:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .cjf-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 640px) {
          .cjf-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cjf-header">
        <div className="cjf-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16m8-8H4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h2 className="cjf-title">Upload Radiology Case</h2>
          <p className="cjf-subtitle">Submit a new imaging study for processing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="cjf-grid">
          <div className="cjf-field">
            <label className="cjf-label">Study Type</label>
            <select className="cjf-select" value={type} onChange={(e) => setType(e.target.value)}>
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="cjf-field">
            <label className="cjf-label">Priority</label>
            <div className="cjf-priority">
              <button
                type="button"
                className={priority === "standard" ? "active" : ""}
                onClick={() => setPriority("standard")}
              >
                Standard
              </button>
              <button
                type="button"
                className={priority === "urgent" ? "active urgent" : ""}
                onClick={() => setPriority("urgent")}
              >
                Urgent
              </button>
            </div>
          </div>

          <div className="cjf-field">
            <label className="cjf-label">Patient Name</label>
            <input
              className="cjf-input"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              placeholder="e.g. Jane Doe"
              required
            />
          </div>

          <div className="cjf-field">
            <label className="cjf-label">Study ID</label>
            <input
              className="cjf-input"
              value={studyId}
              onChange={(e) => setStudyId(e.target.value)}
              placeholder="e.g. ST-10234"
              required
            />
          </div>
        </div>

        <div className="cjf-checkbox-row">
          <input
            id="simulateFailure"
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
          />
          <label htmlFor="simulateFailure">Simulate failure (for testing)</label>
        </div>

        {error && <div className="cjf-error">{error}</div>}

        <button className="cjf-submit" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Create Job"}
        </button>
      </form>
    </div>
  );
}

