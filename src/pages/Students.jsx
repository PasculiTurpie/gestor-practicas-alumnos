import { useEffect, useMemo, useState } from "react";
import { listStudents, deleteStudent } from "../api/students";
import StudentForm from "../components/StudentForm";
import StudentsTable from "../components/StudentsTable";
import TableControls from "../components/TableControls";
import EditStudentModal from "../components/EditStudentModal";
import EditStageFromStudentModal from "../components/EditStageFromStudentModal";
import useCleanRut from "../hooks/useCleanRut";

export default function Students() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("fullName");
  const [sortDir, setSortDir] = useState("asc");
  const [editing, setEditing] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const { cleanRutInList } = useCleanRut();


  const handleExport = () => {
    const cleanItems = cleanRutInList(items, "rut");
    exportCsv("alumnos.csv", cleanItems);
  };

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

  const handleDelete = async (s) => {
    const ok = window.confirm(`¿Eliminar al alumno "${s.fullName}" (NRC ${s.nrcCode})?`);
    if (!ok) return;
    await deleteStudent(s._id);
    if (sorted.length === 1 && page > 1) setPage(page - 1);
    else reload();
  };

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
          onExport={handleExport}
        />
        <StudentsTable
          data={sorted}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onEdit={setEditing}
          onDelete={handleDelete}
          onEditStage={setEditingStage}
        />
      </div>

      {editing && (
        <EditStudentModal
          student={editing}
          onClose={() => setEditing(null)}
          onUpdated={() => { setEditing(null); reload(); }}
        />
      )}

      {editingStage && (
        <EditStageFromStudentModal
          student={editingStage}
          onClose={() => setEditingStage(null)}
          onAdvanced={() => { setEditingStage(null); /* refrescar tablas si quieres */ }}
        />
      )}
    </section>
  );
}
