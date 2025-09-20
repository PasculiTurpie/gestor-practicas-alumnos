import { useEffect, useState, useMemo } from "react";
import { listStudents } from "../api/students";
import StudentForm from "../components/StudentForm";
import StudentsTable from "../components/StudentsTable";
import TableControls from "../components/TableControls";
import { exportCsv } from "../utils/exportsCsv.js";

export default function Students() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");

  // estado de orden
  const [sortBy, setSortBy] = useState("fullName"); // fullName | rut | nrcCode | practiceCenter | phone | institutionalEmail
  const [sortDir, setSortDir] = useState("asc");

  const reload = () =>
    listStudents({ page, limit, q: q || undefined }).then(r => {
      setItems(r.items); setPages(r.pages || 1);
    });

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [page, limit, q]);

  const sorted = useMemo(() => {
    const arr = [...items];
    const get = (o, key) => (o?.[key] ?? "").toString().toLowerCase();
    arr.sort((a, b) => {
      const av = get(a, sortBy);
      const bv = get(b, sortBy);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [items, sortBy, sortDir]);

  const handleSort = (col, dir) => { setSortBy(col); setSortDir(dir); };

  return (
    <section>
      <div className="card">
        <h1 className="h1">Alumnos</h1>
        <p className="subtle">Registro y administración de estudiantes en práctica</p>
        <StudentForm onCreated={() => { setPage(1); reload(); }} />
      </div>

      <div className="space"></div>

      <div className="card">
        <h2 className="h2">Listado</h2>
        <TableControls
          searchValue={q}
          onSearchChange={(v) => { setPage(1); setQ(v); }}
          page={page}
          pages={pages}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={(n) => { setPage(1); setLimit(n); }}
          onExport={() => {
            const rows = sorted.map(s => ({
              Nombre: s.fullName,
              RUT: s.rut,
              NRC: s.nrcCode,
              "Correo inst.": s.institutionalEmail,
              Celular: s.phone,
              Centro: s.practiceCenter,
            }));
            exportCsv("alumnos.csv", rows);
          }}
        />
        <StudentsTable
          data={sorted}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </div>
    </section>
  );
}
