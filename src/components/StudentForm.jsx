import { useForm } from "react-hook-form";
import { createStudent } from "../api/students";
import { createPractice } from "../api/practices";

export default function StudentForm({ onCreated }) {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (values) => {
    const student = await createStudent(values);
    await createPractice(student._id);
    reset();
    onCreated?.(student);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form mt-3">
      <input className="input" placeholder="Nombre completo" {...register("fullName", { required: true })} />
      <input className="input" placeholder="RUT (12.345.678-9)" {...register("rut", { required: true })} />
      <input className="input" placeholder="Correo institucional" {...register("institutionalEmail", { required: true })} />
      <input className="input" placeholder="Correo personal" {...register("personalEmail")} />
      <input className="input" placeholder="Código NRC" {...register("nrcCode", { required: true })} />
      <input className="input" placeholder="Celular" {...register("phone", { required: true })} />
      <input className="input" placeholder="Centro de prácticas" {...register("practiceCenter", { required: true })} />
      <input className="input" placeholder="Observaciones" {...register("observations")} />
      <button type="submit" className="btn btn-primary span-2">Registrar alumno + crear práctica</button>
    </form>
  );
}
