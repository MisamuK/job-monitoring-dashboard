import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Job = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
};

type Filter = "All" | "Running" | "Completed" | "Failed";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [name, setName] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:5153/api/jobs");
    const data = await res.json();
    setJobs(data);
  };

  const createJob = async () => {
    if (!name.trim()) return;

    await fetch("http://localhost:5153/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchJobs();
  };

  const deleteJob = async (id: string) => {
    await fetch(`http://localhost:5153/api/jobs/${id}`, {
      method: "DELETE",
    });

    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 2000);
    return () => clearInterval(interval);
  }, []);

  const total = jobs.length;
  const completed = jobs.filter((j) => j.status === "Completed").length;
  const running = jobs.filter((j) => j.status === "Running").length;
  const failed = jobs.filter((j) => j.status === "Failed").length;

  const filteredJobs = useMemo(() => {
    if (filter === "All") return jobs;
    return jobs.filter((job) => job.status === filter);
  }, [jobs, filter]);

  return (
    <div className="container">
      <h1>📊 Tableau de bord des offres d'emploi</h1>
      <p className="subtitle">
        Surveiller et suivre les tâches asynchrones en temps réel.
      </p>

      <div className="stats">
        <div className="stat-box">
          <span>Total</span>
          <strong>{total}</strong>
        </div>

        <div className="stat-box">
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>

        <div className="stat-box">
          <span>Running</span>
          <strong>{running}</strong>
        </div>

        <div className="stat-box">
          <span>Failed</span>
          <strong>{failed}</strong>
        </div>
      </div>

      <div className="form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du job..."
        />
        <button onClick={createJob}>Créer</button>
      </div>

      <div className="filters">
        {["All", "Running", "Completed", "Failed"].map((item) => (
          <button
            key={item}
            className={filter === item ? "active-filter" : ""}
            onClick={() => setFilter(item as Filter)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="job-list">
        {filteredJobs.length === 0 ? (
          <div className="empty">
            <p>No jobs found for this filter</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div className="card fade-in" key={job.id}>
              <div>
                <h3>{job.name}</h3>
                <p>{new Date(job.createdAt).toLocaleString()}</p>
              </div>

              <div className="actions">
                <span className={`status ${job.status.toLowerCase()}`}>
                  {job.status === "Running" && (
                    <span className="spinner"></span>
                  )}
                  {job.status}
                </span>

                <button
                  className="delete-btn"
                  onClick={() => deleteJob(job.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
