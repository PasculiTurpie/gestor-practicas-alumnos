export default function SkeletonTable({ rows = 6 }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="skel-row">
          <div className="skel skel-cell"></div>
          <div className="skel skel-cell"></div>
          <div className="skel skel-cell"></div>
          <div className="skel skel-cell"></div>
          <div className="skel skel-cell"></div>
          <div className="skel skel-cell"></div>
          <div className="skel skel-cell"></div>
        </div>
      ))}
    </div>
  );
}
