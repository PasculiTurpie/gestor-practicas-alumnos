// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { listPractices, getPracticeStats } from "../api/practices";
import SkeletonTable from "../components/SkeletonTable";
import useAsync from "../hooks/useAsync";
import { StageIcon } from "../components/Icons";
import InlineSpinner from "../components/InlineSpinner";
import { download } from "../utils/download";

const STAGES = [
  "RECOPILACION_Y_CARPETA",
  "ENTREGA_CARPETA",
  "ENCUESTA_CP",
  "ENVIO_PORTAFOLIO_INSTRUCCIONES",
  "SUPERVISION_PRACTICAS",
  "ENVIO_BORRADOR_PORTAFOLIO",
  "SUBIR_PORTAFOLIO_AULA",
  "NOTA_FINAL_CIERRE",
];

export default function Dashboard() {
  const [latest, setLatest] = useState([]);
  const [stats, setStats] = useState({
    totals: { total: 0, open: 0, closed: 0 },
    byStage: [],
    byCenterTop5: [],
    range: { from: null, to: null },
  });

  // filtros de rango (opcional)
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { loading: loadingLatest, run: runLatest } = useAsync();
  const { loading: loadingStats, run: runStats } = useAsync();

  const fetchLatest = () =>
    runLatest(async () => {
      const r = await listPractices({ limit: 10 });
      setLatest(r.items || []);
    });

  const fetchStats = () =>
    runStats(async () => {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const s = await getPracticeStats(params);
      setStats(s);
    });

  useEffect(() => {
    fetchLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  // Mapa de counts por etapa (global)
  const countsGlobal = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s, 0]));
    for (const row of stats.byStage || []) map[row.stage] = row.count;
    return map;
  }, [stats]);

  const totalGlobal = stats?.totals?.total || 1;

  // ---- Export CSV helpers ----
  const API = import.meta.env.VITE_API_URL;
  const buildQs = () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return params.toString();
  };
  const exportByStage = () => {
    const qs = buildQs();
    const url = `${API}/practices/stats/export?dataset=byStage${qs ? `&${qs}` : ""}`;
    download(url, `practicas_byStage${qs ? `_${qs.replace(/=|&/g, "-")}` : ""}.csv`);
  };
  const exportTopCenters = () => {
    const qs = buildQs();
    const url = `${API}/practices/stats/export?dataset=byCenterTop5${qs ? `&${qs}` : ""}`;
    download(url, `practicas_topCenters${qs ? `_${qs.replace(/=|&/g, "-")}` : ""}.csv`);
  };
  const exportTotals = () => {
    const qs = buildQs();
    const url = `${API}/practices/stats/export?dataset=totals${qs ? `&${qs}` : ""}`;
    download(url, `practicas_totals${qs ? `_${qs.replace(/=|&/g, "-")}` : ""}.csv`);
  };

  return (
    <section>
      {/* Panel superior: filtros + totales + por etapa + top centros */}
      <div className="card">
        <h1 className="h1">Dashboard</h1>
        <p className="subtle">Estadísticas globales (filtrables por fecha)</p>

        {/* Filtros de fecha y export */}
        <div className="row mt-3" style={{ gap: 10, flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <label className="subtle">Desde</label>
            <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="subtle">Hasta</label>
            <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          {loadingStats && <InlineSpinner />}

          <div className="row" style={{ gap: 8, marginLeft: "auto" }}>
            <button className="btn btn-ghost" onClick={exportByStage}>Exportar etapas CSV</button>
            <button className="btn btn-ghost" onClick={exportTopCenters}>Exportar centros CSV</button>
            <button className="btn btn-ghost" onClick={exportTotals}>Exportar totales CSV</button>
          </div>
        </div>

        {/* Totales */}
        <div className="row mt-3" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="card" style={{ minWidth: 220 }}>
            <strong style={{ fontSize: 20 }}>{stats.totals.total}</strong>
            <div className="subtle">Total prácticas</div>
          </div>
          <div className="card" style={{ minWidth: 220 }}>
            <strong style={{ fontSize: 20 }}>{stats.totals.open}</strong>
            <div className="subtle">En curso</div>
          </div>
          <div className="card" style={{ minWidth: 220 }}>
            <strong style={{ fontSize: 20 }}>{stats.totals.closed}</strong>
            <div className="subtle">Cerradas</div>
          </div>
        </div>

        {/* Conteo por etapa (global) */}
        <div className="row mt-3" style={{ flexWrap: "wrap", gap: 12 }}>
          {STAGES.map((stage) => (
            <div key={stage} className="card" style={{ minWidth: 220 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className={`badge stage-${stage}`}>
                  <StageIcon stage={stage} />
                  {stage.replaceAll("_", " ")}
                </span>
                <strong style={{ fontSize: 20 }}>{countsGlobal[stage] || 0}</strong>
              </div>
              <div className="subtle mt-2">
                {(Math.round(((countsGlobal[stage] || 0) / (totalGlobal || 1)) * 100) || 0)}%
              </div>
            </div>
          ))}
        </div>

        {/* Top 5 centros */}
        <div className="row mt-3" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="card" style={{ width: "100%" }}>
            <h3 className="h2">Top 5 Centros</h3>
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>Centro</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {(stats.byCenterTop5 || []).map(({ center, count }) => (
                  <tr key={center || "N/A"}>
                    <td>{center || "N/A"}</td>
                    <td>{count}</td>
                  </tr>
                ))}
                {(stats.byCenterTop5 || []).length === 0 && (
                  <tr>
                    <td colSpan={2} className="subtle" style={{ padding: 12 }}>
                      Sin datos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space"></div>

      {/* Últimas prácticas actualizadas */}
      <div className="card">
        <h2 className="h2">Últimas prácticas actualizadas</h2>
        <p className="subtle">Las 10 más recientes</p>

        {loadingLatest ? (
          <SkeletonTable rows={6} />
        ) : (
          <ul className="list mt-3">
            {latest.map((p) => (
              <li key={p._id} className="list-item">
                <div>
                  <strong>{p.studentId?.fullName}</strong>
                  <div className="subtle">{p.studentId?.practiceCenter}</div>
                </div>
                <span className={`badge stage-${p.currentStage}`}>
                  <StageIcon stage={p.currentStage} />
                  {p.currentStage.replaceAll("_", " ")}
                </span>
              </li>
            ))}
            {latest.length === 0 && <li className="subtle">No hay prácticas registradas aún.</li>}
          </ul>
        )}
      </div>
    </section>
  );
}
