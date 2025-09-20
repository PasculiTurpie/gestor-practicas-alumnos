export default function TableControls({
  searchValue, onSearchChange,
  page, pages, onPageChange,
  limit, onLimitChange,
  rightSlot, placeholder = "Buscar...",
  onExport
}) {
  return (
    <div className="table-controls">
      <div className="row">
        <div className="search">
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.57-4.23A6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5m-6 0A4.5 4.5 0 1 1 14 9.5A4.5 4.5 0 0 1 9.5 14" /></svg>
          <input
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <select className="select-sm" value={limit} onChange={(e) => onLimitChange?.(Number(e.target.value))}>
          {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}/página</option>)}
        </select>
      </div>

      <div className="row">
        {rightSlot}
        {onExport && <button className="btn btn-ghost" onClick={onExport}>Exportar CSV</button>}
        <div className="pagination">
          <button className="page-btn" disabled={page <= 1} onClick={() => onPageChange?.(1)}>«</button>
          <button className="page-btn" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>‹</button>
          <span className="page-indicator">Página {page} de {pages || 1}</span>
          <button className="page-btn" disabled={page >= pages} onClick={() => onPageChange?.(page + 1)}>›</button>
          <button className="page-btn" disabled={page >= pages} onClick={() => onPageChange?.(pages)}>»</button>
        </div>
      </div>
    </div>
  );
}
