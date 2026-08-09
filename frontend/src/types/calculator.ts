export type MaritalStatus =
  | 'sociedad-conyugal'
  | 'separacion-bienes'
  | 'participacion-gananciales'
  | 'viudo'
  | 'divorciado'
  | 'soltero';

export type Kinship =
  | 'conyuge'
  | 'hijo'
  | 'padre'
  | 'abuelo'
  | 'hermano'
  | 'sobrino'
  | 'otro-colateral'
  | 'fisco';

export interface HeirFormItem {
  id: string;
  relationship: Kinship | '';
}

export interface RealEstateItem {
  id: string;
  fiscalValuation: number | '';
  description?: string;
}

export interface DeductionItem {
  id: string;
  type: string;
  description: string;
  amount: number | '';
}

export interface CalculatorFormData {
  domicilio: string;
  estadoCivil: MaritalStatus | '';
  fechaDefuncion: string;
  tieneLegitimarios: 'si' | 'no';
  herederos: HeirFormItem[];
  inmuebles: RealEstateItem[];
  mueblesValor: number | '';
  usarPresuncionMuebles: boolean;
  deducciones: DeductionItem[];
}

export interface TaxResult {
  exemption_uta: number;
  taxable_base_uta: number;
  tax_base_uta: number;
  surcharge_percent: number;
  final_tax_uta: number;
  final_tax_clp: number;
}

export interface HeirResult {
  relationship: Kinship;
  label: string;
  quota_percent: number;
  amount: number;
  tax: TaxResult;
}

export interface MaritalGainsResult {
  applies: boolean;
  amount: number;
  regime: string;
}

export interface FurniturePresumptionResult {
  applied: boolean;
  amount: number;
}

export interface CalculatorResult {
  succession_order: number;
  succession_order_label: string;
  date_of_death: string | null;
  uta_value: number;
  total_gross_assets: number;
  marital_gains: MaritalGainsResult;
  gross_estate: number;
  furniture_presumption: FurniturePresumptionResult;
  deductions_total: number;
  net_partible_estate: number;
  heirs: HeirResult[];
  total_tax_clp: number;
  warnings: string[];
}
