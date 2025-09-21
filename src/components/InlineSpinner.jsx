export default function InlineSpinner({ size = 16 }) {
  return <span className="spinner" style={{ width: size, height: size, borderWidth: 2, display: "inline-block" }} />;
}
