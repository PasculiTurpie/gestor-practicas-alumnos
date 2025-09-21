import { useEffect, useState } from "react";
import { getPracticeByStudent, advanceStage } from "../api/practices";

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

export default function EditStageFromStudentModal({ student, onClose, onAdvanced }) {
  const [practice, setPractice] = useState(null);
  const [nextStage, setNextStage] = useState(STAGES[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const p = await getPracticeByStudent(student._id);
        if (ignore) return;
        setPractice(p);
        setNextStage(p.currentStage || STAGES[0]);
      } catch (e) {
        // si no hay práctica creada
        setPractice(null);
      } finally {
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [student]);

  const submit = async () => {
    if (!practice?._id) return;
    await advanceStage(practice._id, { nextStage, notes });
    onAdvanced?.();
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h4 className="h2">Etapa de práctica — {student.fullName}</h4>
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>

        {loading ? (
          <p className="subtle">Cargando...</p>
        ) : !practice ? (
          <p className="subtle">Este alumno aún no tiene práctica creada.</p>
        ) : (
          <>
            <div className="mt-3">
              <div className="subtle">Etapa actual</div>
              <div style={{ marginTop: 6, fontWeight: 700 }}>
                {practice.currentStage.replaceAll("_", " ")}
              </div>
            </div>

            <div className="mt-3">
              <label className="subtle">Nueva etapa</label>
              <select className="select mt-2" value={nextStage} onChange={e => setNextStage(e.target.value)}>
                {STAGES.map(s => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
              </select>
            </div>

            <div className="mt-3">
              <label className="subtle">Notas (opcional)</label>
              <textarea className="textarea mt-2" placeholder="Notas" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" onClick={submit}>Guardar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
