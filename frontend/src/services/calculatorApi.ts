import type { CalculatorFormData, CalculatorResult } from '../types/calculator';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function evaluateCalculator(data: CalculatorFormData): Promise<CalculatorResult> {
  const payload = {
    dateOfDeath: data.fechaDefuncion || null,
    maritalStatus: data.estadoCivil || 'soltero',
    lastDomicile: data.domicilio,
    heirs: data.herederos
      .filter((h) => h.relationship !== '')
      .map((h) => ({ relationship: h.relationship })),
    assets: {
      realEstates: data.inmuebles
        .filter((i) => typeof i.fiscalValuation === 'number' && i.fiscalValuation > 0)
        .map((i) => ({
          fiscalValuation: Number(i.fiscalValuation),
        })),
      movablesValue:
        typeof data.mueblesValor === 'number' ? Number(data.mueblesValor) : 0,
      use20PercentFurniturePresumption: data.usarPresuncionMuebles,
    },
    deductions: data.deducciones
      .filter((d) => typeof d.amount === 'number' && d.amount > 0)
      .map((d) => ({
        type: d.type,
        description: d.description,
        amount: Number(d.amount),
      })),
  };

  const response = await fetch(`${API_BASE_URL}/calculator/evaluate/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMsg = `Error en el servidor (${response.status})`;
    try {
      const errData = await response.json();
      if (errData.error) errorMsg = errData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}
