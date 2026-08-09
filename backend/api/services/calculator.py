"""
Chilean Inheritance Calculator & Distribution Engine
Compliant with Chilean Civil Code (Arts. 980+), Law 16.271 and Law 19.903.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime


# Reference UTA values (CLP) by year (approx. 12 x December UTM)
UTA_VALUES: Dict[int, float] = {
    2020: 603888.0,
    2021: 650000.0,
    2022: 730000.0,
    2023: 770000.0,
    2024: 800088.0,
    2025: 835000.0,
    2026: 860000.0,
}
DEFAULT_UTA_VALUE: float = 860000.0


# Progressive Inheritance Tax Table (Law 16.271, Art. 2)
# Tuples of (max_uta, rate, deduction_uta)
TAX_BRACKETS = [
    (50.0, 0.01, 0.0),
    (100.0, 0.025, 0.75),
    (150.0, 0.05, 3.25),
    (200.0, 0.075, 7.00),
    (250.0, 0.10, 12.00),
    (300.0, 0.15, 24.50),
    (1200.0, 0.20, 39.50),
    (float('inf'), 0.25, 99.50),
]


def get_uta_value(date_of_death_str: Optional[str] = None) -> float:
    """Returns the applicable UTA value based on date of death year."""
    if date_of_death_str:
        try:
            year = datetime.strptime(date_of_death_str, "%Y-%m-%d").year
            return UTA_VALUES.get(year, DEFAULT_UTA_VALUE)
        except (ValueError, TypeError):
            pass
    return DEFAULT_UTA_VALUE


def compute_tax_for_allocation(allocation_clp: float, relationship: str, uta_value: float) -> Dict[str, Any]:
    """
    Computes inheritance tax for an heir's allocation under Law 16.271.
    """
    if relationship == "fisco" or allocation_clp <= 0:
        return {
            "exemption_uta": 0.0,
            "taxable_base_uta": 0.0,
            "tax_base_uta": 0.0,
            "surcharge_percent": 0.0,
            "final_tax_uta": 0.0,
            "final_tax_clp": 0.0,
        }

    allocation_uta = allocation_clp / uta_value

    # Determine personal exemption and kinship surcharge
    if relationship in ["conyuge", "hijo", "padre", "abuelo"]:
        # Category 1: Forced heirs & direct ascendants/descendants
        exemption_uta = 50.0
        surcharge_rate = 0.0
    elif relationship in ["hermano", "sobrino"]:
        # Category 2: Collaterals up to 4th degree
        exemption_uta = 5.0
        surcharge_rate = 0.20
    else:
        # Category 3: Other collaterals / non-relatives
        exemption_uta = 0.0
        surcharge_rate = 0.40

    taxable_base_uta = max(0.0, allocation_uta - exemption_uta)

    if taxable_base_uta <= 0:
        return {
            "exemption_uta": exemption_uta,
            "taxable_base_uta": 0.0,
            "tax_base_uta": 0.0,
            "surcharge_percent": surcharge_rate * 100.0,
            "final_tax_uta": 0.0,
            "final_tax_clp": 0.0,
        }

    # Evaluate bracket
    tax_base_uta = 0.0
    for max_uta, rate, deduction in TAX_BRACKETS:
        if taxable_base_uta <= max_uta:
            tax_base_uta = max(0.0, (taxable_base_uta * rate) - deduction)
            break

    final_tax_uta = tax_base_uta * (1.0 + surcharge_rate)
    final_tax_clp = final_tax_uta * uta_value

    return {
        "exemption_uta": exemption_uta,
        "taxable_base_uta": round(taxable_base_uta, 4),
        "tax_base_uta": round(tax_base_uta, 4),
        "surcharge_percent": surcharge_rate * 100.0,
        "final_tax_uta": round(final_tax_uta, 4),
        "final_tax_clp": round(final_tax_clp, 0),
    }


def evaluate_inheritance(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main evaluation pipeline for the Chilean Inheritance Calculation Engine.
    """
    warnings: List[str] = []

    # 1. Extraction of basic info
    date_of_death = payload.get("dateOfDeath")
    marital_status = payload.get("maritalStatus", "soltero")
    last_domicile = payload.get("lastDomicile", "")
    uta_value = get_uta_value(date_of_death)

    # 2. Asset & Liabilities evaluation
    assets_data = payload.get("assets", {})
    real_estates = assets_data.get("realEstates", [])
    total_real_estate = sum(float(re.get("fiscalValuation", 0) or 0) for re in real_estates)

    use_20_percent = assets_data.get("use20PercentFurniturePresumption", False)
    if use_20_percent:
        total_movable = total_real_estate * 0.20
    else:
        total_movable = float(assets_data.get("movablesValue", 0) or 0)

    total_gross_assets = total_real_estate + total_movable

    # Deductions / Debts (Art. 959 Civil Code)
    deductions_data = payload.get("deductions", [])
    total_deductions = sum(float(d.get("amount", 0) or 0) for d in deductions_data)

    # 3. Marital Gains (Gananciales) Separation
    # If married in 'sociedad_conyugal' and spouse is present, 50% belongs directly to spouse
    has_spouse = any(h.get("relationship") == "conyuge" for h in payload.get("heirs", []))
    is_sociedad_conyugal = marital_status in ["sociedad-conyugal", "sociedad_conyugal"]

    if is_sociedad_conyugal and has_spouse:
        marital_gains_amount = total_gross_assets * 0.50
        estate_gross = total_gross_assets * 0.50
        marital_gains_applies = True
    else:
        marital_gains_amount = 0.0
        estate_gross = total_gross_assets
        marital_gains_applies = False

    net_partible_estate = max(0.0, estate_gross - total_deductions)

    # 4. Heir & Succession Order Resolution
    raw_heirs = payload.get("heirs", [])
    if not raw_heirs:
        raw_heirs = [{"relationship": "fisco"}]
        warnings.append("No se indicaron herederos. La masa hereditaria se asigna al Fisco (5° orden).")

    # Group counts
    children_count = sum(1 for h in raw_heirs if h.get("relationship") == "hijo")
    spouse_present = any(h.get("relationship") == "conyuge" for h in raw_heirs)
    parents_count = sum(1 for h in raw_heirs if h.get("relationship") == "padre")
    abuelos_count = sum(1 for h in raw_heirs if h.get("relationship") == "abuelo")
    siblings_count = sum(1 for h in raw_heirs if h.get("relationship") == "hermano")
    nephews_count = sum(1 for h in raw_heirs if h.get("relationship") == "sobrino")
    other_collaterals_count = sum(1 for h in raw_heirs if h.get("relationship") == "otro-colateral")
    fisco_present = any(h.get("relationship") == "fisco" for h in raw_heirs)

    participating_heirs: List[Dict[str, Any]] = []
    succession_order = 1
    succession_order_label = ""

    # Order 1: Children / Descendants + Spouse
    if children_count > 0:
        succession_order = 1
        succession_order_label = "1° Orden: De los descendientes (Hijos y Cónyuge)"
        if parents_count > 0 or abuelos_count > 0 or siblings_count > 0 or nephews_count > 0 or other_collaterals_count > 0:
            warnings.append("Habiendo hijos (1° orden), la ley excluye a los ascendientes y colaterales de la herencia.")

        H = children_count
        if not spouse_present:
            # 100% split equally among children
            quota_child = 1.0 / H
            for i in range(H):
                participating_heirs.append({
                    "relationship": "hijo",
                    "label": f"Hijo(a) {i+1}",
                    "quota_percent": round(quota_child * 100.0, 4),
                    "amount": round(net_partible_estate * quota_child, 0),
                })
        else:
            if H == 1:
                # 1 child + spouse: 50% / 50% split
                quota_spouse = 0.50
                quota_child = 0.50
            elif 2 <= H <= 6:
                # Spouse gets 2x child share (weight: 2 for spouse, 1 for each child)
                total_units = 2.0 + H
                quota_spouse = 2.0 / total_units
                quota_child = 1.0 / total_units
            else: # H >= 7
                # Statutory minimum 25% floor for spouse (Art. 988 Civil Code)
                quota_spouse = 0.25
                quota_child = 0.75 / H

            participating_heirs.append({
                "relationship": "conyuge",
                "label": "Cónyuge / Conviviente Civil",
                "quota_percent": round(quota_spouse * 100.0, 4),
                "amount": round(net_partible_estate * quota_spouse, 0),
            })
            for i in range(H):
                participating_heirs.append({
                    "relationship": "hijo",
                    "label": f"Hijo(a) {i+1}",
                    "quota_percent": round(quota_child * 100.0, 4),
                    "amount": round(net_partible_estate * quota_child, 0),
                })

    # Order 2: Ascendants + Spouse
    elif spouse_present or parents_count > 0 or abuelos_count > 0:
        succession_order = 2
        succession_order_label = "2° Orden: De los ascendientes y cónyuge"
        if siblings_count > 0 or nephews_count > 0 or other_collaterals_count > 0:
            warnings.append("Habiendo cónyuge o ascendientes (2° orden), los colaterales quedan excluidos.")

        # Closest ascendant excludes remote (parents exclude grandparents)
        ascendants_count = parents_count if parents_count > 0 else abuelos_count
        ascendant_rel = "padre" if parents_count > 0 else "abuelo"
        ascendant_name = "Padre / Madre" if parents_count > 0 else "Abuelo(a)"

        if spouse_present and ascendants_count > 0:
            quota_spouse = 2.0 / 3.0 # 66.6667%
            quota_ascendant = (1.0 / 3.0) / ascendants_count
            participating_heirs.append({
                "relationship": "conyuge",
                "label": "Cónyuge / Conviviente Civil",
                "quota_percent": round(quota_spouse * 100.0, 4),
                "amount": round(net_partible_estate * quota_spouse, 0),
            })
            for i in range(ascendants_count):
                participating_heirs.append({
                    "relationship": ascendant_rel,
                    "label": f"{ascendant_name} {i+1}",
                    "quota_percent": round(quota_ascendant * 100.0, 4),
                    "amount": round(net_partible_estate * quota_ascendant, 0),
                })
        elif spouse_present and ascendants_count == 0:
            participating_heirs.append({
                "relationship": "conyuge",
                "label": "Cónyuge / Conviviente Civil",
                "quota_percent": 100.0,
                "amount": round(net_partible_estate, 0),
            })
        else: # Only ascendants
            quota_ascendant = 1.0 / ascendants_count
            for i in range(ascendants_count):
                participating_heirs.append({
                    "relationship": ascendant_rel,
                    "label": f"{ascendant_name} {i+1}",
                    "quota_percent": round(quota_ascendant * 100.0, 4),
                    "amount": round(net_partible_estate * quota_ascendant, 0),
                })

    # Order 3: Siblings
    elif siblings_count > 0:
        succession_order = 3
        succession_order_label = "3° Orden: De los hermanos"
        if nephews_count > 0 or other_collaterals_count > 0:
            warnings.append("Habiendo hermanos directos, concurren por cabezas en partes iguales.")
        quota_sibling = 1.0 / siblings_count
        for i in range(siblings_count):
            participating_heirs.append({
                "relationship": "hermano",
                "label": f"Hermano(a) {i+1}",
                "quota_percent": round(quota_sibling * 100.0, 4),
                "amount": round(net_partible_estate * quota_sibling, 0),
            })

    # Order 4: Other collaterals (Nephews, cousins, uncles)
    elif nephews_count > 0 or other_collaterals_count > 0:
        succession_order = 4
        succession_order_label = "4° Orden: De los colaterales"
        collat_count = nephews_count if nephews_count > 0 else other_collaterals_count
        collat_rel = "sobrino" if nephews_count > 0 else "otro-colateral"
        collat_name = "Sobrino(a)" if nephews_count > 0 else "Colateral"
        quota_collat = 1.0 / collat_count
        for i in range(collat_count):
            participating_heirs.append({
                "relationship": collat_rel,
                "label": f"{collat_name} {i+1}",
                "quota_percent": round(quota_collat * 100.0, 4),
                "amount": round(net_partible_estate * quota_collat, 0),
            })

    # Order 5: Fisco (State of Chile)
    else:
        succession_order = 5
        succession_order_label = "5° Orden: Del Fisco"
        participating_heirs.append({
            "relationship": "fisco",
            "label": "Fisco de Chile",
            "quota_percent": 100.0,
            "amount": round(net_partible_estate, 0),
        })

    # 5. Compute Inheritance Tax for each participating heir
    total_tax_clp = 0.0
    for heir in participating_heirs:
        tax_info = compute_tax_for_allocation(heir["amount"], heir["relationship"], uta_value)
        heir["tax"] = tax_info
        total_tax_clp += tax_info["final_tax_clp"]

    return {
        "succession_order": succession_order,
        "succession_order_label": succession_order_label,
        "date_of_death": date_of_death,
        "uta_value": uta_value,
        "total_gross_assets": round(total_gross_assets, 0),
        "marital_gains": {
            "applies": marital_gains_applies,
            "amount": round(marital_gains_amount, 0),
            "regime": marital_status,
        },
        "gross_estate": round(estate_gross, 0),
        "furniture_presumption": {
            "applied": use_20_percent,
            "amount": round(total_real_estate * 0.20 if use_20_percent else 0.0, 0),
        },
        "deductions_total": round(total_deductions, 0),
        "net_partible_estate": round(net_partible_estate, 0),
        "heirs": participating_heirs,
        "total_tax_clp": round(total_tax_clp, 0),
        "warnings": warnings,
    }
