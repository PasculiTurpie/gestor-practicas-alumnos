import SortableTh from "./SortableTh";
import useCleanRut from "../hooks/useCleanRut";

export default function StudentsTable({ data = [], sortBy, sortDir, onSort, onEdit, onDelete, onEditStage }) {
  const { cleanRut } = useCleanRut();

  return (
    <table className="table">
      <thead>
        <tr>
          <SortableTh label="Nombre" column="fullName" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
          <SortableTh label="RUT" column="rut" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
          <SortableTh label="NRC" column="nrcCode" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
          <SortableTh label="Correo inst." column="institutionalEmail" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
          <SortableTh label="Celular" column="phone" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
          <SortableTh label="Centro" column="practiceCenter" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(s => (
          <tr key={s._id}>
            <td>{s.fullName}</td>
            <td>{cleanRut(s.rut)}</td>
            <td>{s.nrcCode}</td>
            <td>{s.institutionalEmail}</td>
            <td>{s.phone}</td>
            <td>{s.practiceCenter}</td>
            <td>
              <div className="row">
                <button className="btn btn-ghost" onClick={() => onEdit?.(s)}>Editar</button>
                <button className="btn btn-primary" onClick={() => onEditStage?.(s)}>Etapa</button>
                <button className="btn btn-danger" onClick={() => onDelete?.(s)}>Borrar</button>
              </div>
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr><td colSpan={7} className="subtle" style={{ padding: 12 }}>Sin resultados</td></tr>
        )}
      </tbody>
    </table>
  );
}
