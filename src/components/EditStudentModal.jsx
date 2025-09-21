import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateStudent } from "../api/students";

export default function EditStudentModal({ student, onClose, onUpdated }) {
  const { register, handleSubmit, reset } = useForm();

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

  const onSubmit = async (values) => {
    await updateStudent(student._id, values);
    onUpdated?.();
  };

  if (!student) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h4 className="h2">Editar alumno</h4>
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form mt-3">
          <input className="input" placeholder="Nombre completo" {...register("fullName", { required: true })} />
          <input className="input" placeholder="RUT (12.345.678-9)" {...register("rut", { required: true })} />
          <input className="input" placeholder="Correo institucional" {...register("institutionalEmail", { required: true })} />
          <input className="input" placeholder="Correo personal" {...register("personalEmail")} />
          <input className="input" placeholder="Código NRC" {...register("nrcCode", { required: true })} />
          <input className="input" placeholder="Celular" {...register("phone", { required: true })} />
          <input className="input" placeholder="Centro de prácticas" {...register("practiceCenter", { required: true })} />
          <input className="input" placeholder="Observaciones" {...register("observations")} />
          <div className="row span-2" style={{ justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}
