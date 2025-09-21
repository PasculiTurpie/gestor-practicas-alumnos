export default function LoaderOverlay({ show, text = "Cargando..." }) {
  if (!show) return null;
  return (
    <div className="loader-overlay">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div className="spinner" />
        <div style={{ color: "#fff", fontWeight: 700 }}>{text}</div>
      </div>
    </div>
  );
}
