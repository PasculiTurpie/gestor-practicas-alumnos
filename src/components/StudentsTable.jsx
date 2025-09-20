import SortableTh from "./SortableTh";

export default function StudentsTable({ data = [], sortBy, sortDir, onSort }) {
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
        </tr>
      </thead>
      <tbody>
        {data.map(s => (
          <tr key={s._id}>
            <td>{s.fullName}</td>
            <td>{s.rut}</td>
            <td>{s.nrcCode}</td>
            <td>{s.institutionalEmail}</td>
            <td>{s.phone}</td>
            <td>{s.practiceCenter}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
