/**
 * Chilean Currency and Tax Unit Formatters
 */

export function formatCLP(amount: number): string {
  if (isNaN(amount)) return '$0';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  if (isNaN(value)) return '0%';
  return `${value.toLocaleString('es-CL', { maximumFractionDigits: 2 })}%`;
}

export function formatUTA(utaValue: number): string {
  if (isNaN(utaValue)) return '0 UTA';
  return `${utaValue.toLocaleString('es-CL', { maximumFractionDigits: 2 })} UTA`;
}
