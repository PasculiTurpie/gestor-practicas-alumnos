export function exportCsv(filename, rows) {
  if (!rows || !rows.length) return;

  const processValue = (val) => {
    if (val == null) return "";
    // escapamos comillas dobles
    let v = val.toString().replace(/"/g, '""');
    // envolvemos con comillas si hay coma o salto
    if (/[",\n]/.test(v)) v = `"${v}"`;
    return v;
  };

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => processValue(r[h])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
