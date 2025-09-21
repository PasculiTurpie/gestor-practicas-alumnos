import { useForm } from "react-hook-form";
import { createStudent } from "../api/students";
import { createPractice } from "../api/practices";
import useRut from "../hooks/useCleanRut.js";

export default function StudentForm({ onCreated }) {
  const { cleanRut, isValidRut /*, formatRut*/ } = useRut();

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm();
  const rutValue = watch("rut");

  const onSubmit = async (values) => {
    // Normalizamos RUT antes de enviar
    values.rut = cleanRut(values.rut);
    const student = await createStudent(values);
    await createPractice(student._id);
    reset();
    onCreated?.(student);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form mt-3">
      <input
        className="input"
        placeholder="Nombre completo"
        {...register("fullName", { required: "El nombre es obligatorio" })}
      />
      <div>
        <input
          className="input"
          placeholder="RUT (12.345.678-9)"
          {...register("rut", {
            required: "El RUT es obligatorio",
            validate: (v) => isValidRut(v) || "RUT inválido",
          })}
        // Si quisieras formatear en vivo, descomenta:
        // onBlur={() => setValue("rut", formatRut(rutValue))}
        />
        {errors.rut && <div className="subtle" style={{ color: "#dc2626" }}>{errors.rut.message}</div>}
      </div>

      <input className="input" placeholder="Correo institucional" {...register("institutionalEmail", { required: "Correo institucional requerido" })} />
      <input className="input" placeholder="Correo personal" {...register("personalEmail")} />
      <input className="input" placeholder="Código NRC" {...register("nrcCode", { required: "NRC requerido" })} />
      <input className="input" placeholder="Celular" {...register("phone", { required: "Celular requerido" })} />
      <input className="input" placeholder="Centro de prácticas" {...register("practiceCenter", { required: "Centro requerido" })} />
      <input className="input" placeholder="Observaciones" {...register("observations")} />

      <button type="submit" className="btn btn-primary span-2">Registrar alumno + crear práctica</button>
    </form>
  );
}
