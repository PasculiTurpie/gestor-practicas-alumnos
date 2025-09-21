import { useEffect, useMemo, useState } from "react";
import { listPractices } from "../api/practices";
import AdvanceStageModal from "../components/AdvanceStageModal";
import TableControls from "../components/TableControls";
import SortableTh from "../components/SortableTh";
import { StageIcon } from "../components/Icons";
import SkeletonTable from "../components/SkeletonTable";
import useAsync from "../hooks/useAsync";
import { exportCsv } from "../utils/exportsCsv.js";

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

export default function Practices() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  // controles
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [stage, setStage] = useState("");
  const [q, setQ] = useState("");

  // sort
  const [sortBy, setSortBy] = useState("student"); // student | center | stage
  const [sortDir, setSortDir] = useState("asc");

  const { loading, run } = useAsync();

  const fetchData = () => run(async () => {
    const r = await listPractices({ page, limit, stage: stage || undefined });
    setItems(r.items);
    setPages(r.pages || 1);
  });

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [page, limit, stage]);

  // Filtro en cliente por texto (alumno/centro)
  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const ql = q.toLowerCase();
    return items.filter(p => {
      const txt = `${p.studentId?.fullName ?? ""} ${p.studentId?.practiceCenter ?? ""}`.toLowerCase();
      return txt.includes(ql);
    });
  }, [items, q]);

  // Orden en cliente
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const keyFn = (p) => {
      if (sortBy === "student") return (p.studentId?.fullName ?? "").toLowerCase();
      if (sortBy === "center") return (p.studentId?.practiceCenter ?? "").toLowerCase();
      if (sortBy === "stage") return (p.currentStage ?? "").toLowerCase();
      return "";
    };
    arr.sort((a, b) => {
      const av = keyFn(a), bv = keyFn(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const handleSort = (col, dir) => { setSortBy(col); setSortDir(dir); };

  const handleExport = () => {
    const rows = sorted.map(p => ({
      Alumno: p.studentId?.fullName ?? "",
      Centro: p.studentId?.practiceCenter ?? "",
      Etapa: p.currentStage?.replaceAll("_", " ") ?? "",
    }));
    exportCsv("practicas.csv", rows);
  };

  return (
    <section className="card">
      <h1 className="h1">Prácticas</h1>
      <p className="subtle">Gestión de etapas y seguimiento</p>

      <TableControls
        searchValue={q}
        onSearchChange={setQ}
        page={page}
        pages={pages}
        onPageChange={loading ? () => { } : setPage}
        limit={limit}
        onLimitChange={(n) => { if (!loading) { setPage(1); setLimit(n); } }}
        rightSlot={
          <select className="select-sm" value={stage} onChange={(e) => { setPage(1); setStage(e.target.value); }}>
            <option value="">Todas las etapas</option>
            {STAGES.map(s => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
          </select>
        }
        placeholder="Buscar por alumno o centro..."
        onExport={handleExport}
      />

      {loading ? (
        <SkeletonTable rows={6} />
      ) : (
        <table className="table mt-3">
          <thead>
            <tr>
              <SortableTh label="Alumno" column="student" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
              <SortableTh label="Centro" column="center" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
              <SortableTh label="Etapa actual" column="stage" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => (
              <tr key={p._id}>
                <td>{p.studentId?.fullName}</td>
                <td>{p.studentId?.practiceCenter}</td>
                <td>
                  <span className={`badge stage-${p.currentStage}`}>
                    <StageIcon stage={p.currentStage} />
                    {p.currentStage.replaceAll("_", " ")}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary" onClick={() => setSelected(p)}>Avanzar</button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={4} className="subtle" style={{ padding: 12 }}>Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      )}

      {selected && (
        <AdvanceStageModal
          practice={selected}
          onAdvanced={() => { setSelected(null); fetchData(); }}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
