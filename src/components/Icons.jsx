export const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {dir === "up"
      ? <path fill="currentColor" d="M7 14l5-5 5 5z" />
      : <path fill="currentColor" d="M7 10l5 5 5-5z" />}
  </svg>
);

export const StageIcon = ({ stage }) => {
  const map = {
    RECOPILACION_Y_CARPETA: <path d="M4 4h16v4H4zM4 10h10v2H4zM4 14h8v2H4z" fill="currentColor" />,            // doc list
    ENTREGA_CARPETA: <path d="M10 4l2 2h8v12H4V4z" fill="currentColor" />,                                    // folder
    ENCUESTA_CP: <path d="M7 4h10v14H7z M9 7h6v2H9zm0 4h6v2H9z" fill="currentColor" />,                       // form
    ENVIO_PORTAFOLIO_INSTRUCCIONES: <path d="M12 2l3 3h-2v6h-2V5H9zM5 12h14v8H5z" fill="currentColor" />,    // upload-ish
    SUPERVISION_PRACTICAS: <path d="M10 8a4 4 0 118 0 4 4 0 01-8 0zM4 20a8 8 0 0116 0H4z" fill="currentColor" />, // user/eye
    ENVIO_BORRADOR_PORTAFOLIO: <path d="M4 4h12l4 4v12H4z" fill="currentColor" />,                          // file draft
    SUBIR_PORTAFOLIO_AULA: <path d="M12 3l4 4h-3v6h-2V7H8zM5 14h14v7H5z" fill="currentColor" />,             // upload box
    NOTA_FINAL_CIERRE: <path d="M6 4h12v16H6z M9 12h6v2H9z M9 8h6v2H9z" fill="currentColor" />,              // checklist
  };
  return <svg viewBox="0 0 24 24" className="i" aria-hidden="true">{map[stage] ?? <circle cx="12" cy="12" r="5" fill="currentColor" />}</svg>;
};
