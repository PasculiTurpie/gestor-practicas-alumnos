import { useState } from "react";
import { advanceStage } from "../api/practices";

const STAGES = [
  "RECOPILACION_Y_CARPETA",
  "ENTREGA_CARPETA",
  "ENCUESTA_CP",
  "ENVIO_PORTAFOLIO_INSTRUCCIONES",
  "SUPERVISION_PRACTICAS",
  "ENVIO_BORRADOR_PORTAFOLIO",
  "SUBIR_PORTAFOLIO_AULA",
  "NOTA_FINAL_CIERRE",
];

export default function AdvanceStageModal({ practice, onAdvanced, onClose }) {
  const [nextStage, setNextStage] = useState(practice?.currentStage ?? STAGES[0]);
  const [notes, setNotes] = useState("");

  const submit = async () => {
    const updated = await advanceStage(practice._id, { nextStage, notes });
    onAdvanced?.(updated);
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h4 className="h2">Avanzar etapa</h4>
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>

        <div className="mt-3">
          <label className="subtle">Etapa</label>
          <select className="select mt-2" value={nextStage} onChange={e => setNextStage(e.target.value)}>
            {STAGES.map(s => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
          </select>
        </div>

        <div className="mt-3">
          <label className="subtle">Notas</label>
          <textarea className="textarea mt-2" placeholder="Notas (opcional)" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={submit}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
