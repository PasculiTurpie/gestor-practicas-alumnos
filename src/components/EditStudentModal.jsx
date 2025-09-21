import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "../validation/student.schema";
import { updateStudent } from "../api/students";
import useRut from "../hooks/useCleanRut.js";
import useAsync from "../hooks/useAsync.js";

export default function EditStudentModal({ student, onClose, onUpdated }) {
  const { cleanRut, isValidRut } = useRut();
  const { loading, run } = useAsync();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName || "",
        rut: student.rut || "",
        institutionalEmail: student.institutionalEmail || "",
        personalEmail: student.personalEmail || "",
        nrcCode: student.nrcCode || "",
        phone: student.phone || "",
        practiceCenter: student.practiceCenter || "",
        observations: student.observations || "",
      });
    }
  }, [student, reset]);

  const onSubmit = (values) => run(async () => {
    if (!isValidRut(values.rut)) throw new Error("RUT inválido");
    values.rut = cleanRut(values.rut);
    await updateStudent(student._id, values);
    onUpdated?.();
  }).catch(err => {
    alert(err.message || "No se pudo actualizar el alumno");
  });

  if (!student) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h4 className="h2">Editar alumno</h4>
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form mt-3">
          <div>
            <input className="input" placeholder="Nombre completo" {...register("fullName")} />
            {errors.fullName && <small className="subtle" style={{ color: "#dc2626" }}>{errors.fullName.message}</small>}
          </div>

          <div>
            <input className="input" placeholder="RUT (12.345.678-9)" {...register("rut")} />
            {errors.rut && <small className="subtle" style={{ color: "#dc2626" }}>{errors.rut.message}</small>}
          </div>

          <div>
            <input className="input" placeholder="Correo institucional" {...register("institutionalEmail")} />
            {errors.institutionalEmail && <small className="subtle" style={{ color: "#dc2626" }}>{errors.institutionalEmail.message}</small>}
          </div>

          <div>
            <input className="input" placeholder="Correo personal" {...register("personalEmail")} />
            {errors.personalEmail && <small className="subtle" style={{ color: "#dc2626" }}>{errors.personalEmail.message}</small>}
          </div>

          <div>
            <input className="input" placeholder="Código NRC" {...register("nrcCode")} />
            {errors.nrcCode && <small className="subtle" style={{ color: "#dc2626" }}>{errors.nrcCode.message}</small>}
          </div>

          <div>
            <input className="input" placeholder="Celular" {...register("phone")} />
            {errors.phone && <small className="subtle" style={{ color: "#dc2626" }}>{errors.phone.message}</small>}
          </div>

          <div>
            <input className="input" placeholder="Centro de prácticas" {...register("practiceCenter")} />
            {errors.practiceCenter && <small className="subtle" style={{ color: "#dc2626" }}>{errors.practiceCenter.message}</small>}
          </div>

          <div className="span-2">
            <input className="input" placeholder="Observaciones" {...register("observations")} />
          </div>

          <div className="row span-2" style={{ justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (<><span className="spinner" />&nbsp;Guardando…</>) : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
