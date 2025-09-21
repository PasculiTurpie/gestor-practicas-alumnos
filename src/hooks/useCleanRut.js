import { useCallback } from "react";

// Limpia: quita puntos/guión y mayúsculas
const clean = (rut = "") =>
  rut.replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();

// DV con algoritmo Módulo 11
const computeDV = (body) => {
  let sum = 0,
    mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const res = 11 - (sum % 11);
  return res === 11 ? "0" : res === 10 ? "K" : String(res);
};

export default function useRut() {
  const cleanRut = useCallback((rut) => clean(rut), []);

  const isValidRut = useCallback((rut) => {
    const r = clean(rut);
    if (r.length < 2) return false;
    const body = r.slice(0, -1);
    const dv = r.slice(-1);
    if (!/^\d+$/.test(body)) return false;
    return computeDV(body) === dv;
  }, []);

  // Opcional: formatear 12.345.678-9 al escribir
  const formatRut = useCallback((rut) => {
    const r = clean(rut);
    if (!r) return "";
    const body = r.slice(0, -1);
    const dv = r.slice(-1);
    // puntuar cuerpo
    const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${withDots}-${dv}`;
  }, []);

  return { cleanRut, isValidRut, formatRut };
}
