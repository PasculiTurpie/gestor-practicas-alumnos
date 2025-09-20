import { Chevron } from "./Icons";

export default function SortableTh({ label, column, sortBy, sortDir, onSort }) {
  const active = sortBy === column;
  const nextDir = active ? (sortDir === "asc" ? "desc" : "asc") : "asc";
  return (
    <th
      className={`th-sortable ${active ? "th-active" : ""}`}
      onClick={() => onSort?.(column, nextDir)}
      scope="col"
      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
    >
      {label}
      <span className="sort-icon" aria-hidden="true">
        <Chevron dir="up" />
        <Chevron dir="down" />
      </span>
    </th>
  );
}
