import { useEffect, useMemo, useState } from "react";
import { listPractices } from "../api/practices";
import SkeletonTable from "../components/SkeletonTable";
import useAsync from "../hooks/useAsync";
import { StageIcon } from "../components/Icons";

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
  const [items, setItems] = useState([]);
  const { loading, run } = useAsync();

  const fetchData = () => run(async () => {
    // últimas prácticas actualizadas (puedes ajustar el sort en tu backend)
    const r = await listPractices({ limit: 10 });
    setItems(r.items);
  });

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, []);

  // Conteo por etapa (sobre las últimas 10; si quieres global, crea endpoint de agregación)
  const counts = useMemo(() => {
    const acc = Object.fromEntries(STAGES.map(s => [s, 0]));
    for (const p of items) acc[p.currentStage] = (acc[p.currentStage] || 0) + 1;
    return acc;
  }, [items]);

  const total = items.length || 1;

  return (
    <section>
      <div className="card">
        <h1 className="h1">Dashboard</h1>
        <p className="subtle">Resumen rápido de las prácticas más recientes</p>

        {/* Tarjetas de estado */}
        <div className="row mt-3" style={{ flexWrap: "wrap", gap: 12 }}>
          {STAGES.map(stage => (
            <div key={stage} className="card" style={{ minWidth: 220 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="row">
                  <span className={`badge stage-${stage}`}>
                    <StageIcon stage={stage} />
                    {stage.replaceAll("_", " ")}
                  </span>
                </div>
                <strong style={{ fontSize: 20 }}>
                  {counts[stage] || 0}
                </strong>
              </div>
              <div className="subtle mt-2">
                {(Math.round(((counts[stage] || 0) / total) * 100) || 0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space"></div>

      <div className="card">
        <h2 className="h2">Últimas prácticas actualizadas</h2>
        <p className="subtle">Las 10 más recientes</p>

        {loading ? (
          <SkeletonTable rows={6} />
        ) : (
          <ul className="list mt-3">
            {items.map(p => (
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
            {items.length === 0 && <li className="subtle">No hay prácticas registradas aún.</li>}
          </ul>
        )}
      </div>
    </section>
  );
}
