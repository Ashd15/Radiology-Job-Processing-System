import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const client = axios.create({ baseURL: API_BASE_URL });

export const createJob = (data) => client.post("/jobs", data);

export const listJobs = () => client.get("/jobs");

export const getJobStatus = (jobId) => client.get(`/jobs/${jobId}/status`);


export const submitReport = (data) => client.post("/reports", data);
