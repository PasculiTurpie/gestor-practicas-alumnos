import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "../validation/student.schema";
import { createStudent } from "../api/students";
import { createPractice } from "../api/practices";
import useRut from "../hooks/useCleanRut.js";
import useAsync from "../hooks/useAsync";

export default function StudentForm({ onCreated }) {
  const { cleanRut, isValidRut } = useRut();
  const { loading, run } = useAsync();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = (values) => run(async () => {
    // Validación extra de RUT
    if (!isValidRut(values.rut)) throw new Error("RUT inválido");
    values.rut = cleanRut(values.rut);
    const student = await createStudent(values);
    await createPractice(student._id);
    reset();
    onCreated?.(student);
  }).catch(err => {
    alert(err.message || "No se pudo guardar el alumno");
  });

  return (
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

      <button type="submit" className="btn btn-primary span-2" disabled={loading}>
        {loading ? (<><span className="spinner" />&nbsp;Guardando…</>) : "Registrar alumno + crear práctica"}
      </button>
    </form>
  );
}
