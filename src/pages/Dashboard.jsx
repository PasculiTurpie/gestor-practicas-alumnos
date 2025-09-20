import { useEffect, useState } from "react";
import { listPractices } from "../api/practices";

export default function Dashboard() {
  const [data, setData] = useState([]);
  useEffect(() => { listPractices({ limit: 5 }).then(r => setData(r.items)); }, []);

  return (
    <section className="card">
      <h1 className="h1">Dashboard</h1>
      <p className="subtle">Últimas prácticas actualizadas</p>
      <ul className="list mt-3">
        {data.map(p => (
          <li key={p._id} className="list-item">
            <div>
              <strong>{p.studentId?.fullName}</strong>
              <div className="subtle">{p.studentId?.practiceCenter}</div>
            </div>
            <span className={`badge stage-${p.currentStage}`}>{p.currentStage.replaceAll("_", " ")}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
