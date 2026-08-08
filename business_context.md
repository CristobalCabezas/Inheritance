# Business Context & Domain Specification: Chilean Inheritance Calculator & "Posesión Efectiva" Form System

---

## 1. Executive Summary & Project Vision

This document establishes the legal, functional, architectural, and business domain specification for the **Inheritance** project to guide AI agents and human engineers in implementing both the backend (**Django REST Framework + PostgreSQL**) and frontend (**React + TypeScript + Vite + Vanilla CSS**).

The objective is to provide a comprehensive, intuitive web application tailored to the Republic of Chile's legal system, serving two synergistic use cases:

1. **Mode 1: Anonymous Inheritance Simulator & Distribution Calculator:**
   - Enables users to compute and visualize the legal distribution of an estate according to the rules of the Chilean Civil Code (*Código Civil de Chile*).
   - **Strict Data Privacy:** Does not solicit or store personally identifiable information (PII) such as full names, national ID numbers (RUT), exact street addresses, or civil status certificates. It strictly processes kinship relationships, marital regimes, asset types, valuations at the opening of succession, and deductible debts.
   - Outputs interactive distribution charts, percentage breakdowns, monetary values per heir ($ CLP), and estimated Chilean Inheritance Tax according to Law No. 16,271 (*Ley de Impuesto a las Herencias, Asignaciones y Donaciones*).

2. **Mode 2: Official "Posesión Efectiva" Form Generator (Civil Registry - SRCeI):**
   - A formal administrative extension for filing an Intestate Inheritance Declaration (*Posesión Efectiva Intestada*) before the Chilean Civil Registry and Identification Service (*Servicio de Registro Civil e Identificación - SRCeI*) pursuant to Law No. 19,903.
   - Captures formal metadata: complete identity of the deceased (*causante*), applicants, and heirs (validating Chilean RUT with Modulo 11 checksum), cadastral and title registration for real estate (Land Registry - *Conservador de Bienes Raíces [CBR]*, Fojas, Número, Año, SII Tax Roll / *Rol de Avalúo*), motor vehicles (License Plate / *PPU*), bank accounts, securities, and documented liabilities.
   - **Outputs:** Generation of the official, printable/fillable PDF matching Forms F-1 and F-2 from the Civil Registry, along with an optimized structured summary payload for direct online filing using *ClaveÚnica* on `registrocivil.cl`.

---

## 2. Chilean Legal & Regulatory Framework

The calculation engine and data models must strictly comply with Chilean statutory doctrine:

1. **Civil Code of the Republic of Chile (*Código Civil*) — Book III ("De la sucesión por causa de muerte"):**
   - **Articles 980 to 996:** Statutory rules governing Intestate Succession (*Sucesión Abintestato*) and Orders of Succession.
   - **Articles 984 to 987:** Right of Representation (*Derecho de Representación*) and Transmission.
   - **Article 959:** General Estate Deductions (*Bajas Generales de la Herencia* — debt obligations, last illness expenses, funeral and probate costs).
   - **Articles 1167 et seq.:** Forced heirship shares and statutory legitimates (*Asignaciones forzosas y legítimas*).
   - **Articles 1715 et seq. & 1764 et seq.:** Matrimonial property regimes (*Sociedad Conyugal*) and liquidation of marital gains (*Gananciales*).
2. **Law No. 19,903:**
   - Establishes the administrative procedure for granting the *Posesión Efectiva* of intestate estates through the Civil Registry without requiring legal counsel / attorney sponsorship.
3. **Law No. 16,271 (Taxation on Inheritances, Allocations, and Donations):**
   - **Article 2:** Progressive tax brackets measured in Annual Tax Units (*Unidades Tributarias Anuales - UTA*).
   - **Articles 46 & 47:** Mandatory asset appraisal standards, including the **statutory 20% furniture/household goods presumption (*presunción de ajuar*)** on real estate when no movable goods are declared.
   - **Articles 2 & 3:** Statutory personal exemptions (50 UTA for forced heirs; 5 UTA for collaterals) and statutory surcharges.
4. **Law No. 20,830 (Civil Union Agreement - AUC):**
   - Grants the surviving civil partner (*conviviente civil sobreviviente*) identical succession, forced heirship, and tax status as a surviving spouse (*cónyuge sobreviviente*).
5. **D.F.L. No. 2 of 1959:**
   - Special tax exemptions and regulations for affordable social housing (*viviendas económicas*).

---

## 3. Statutory Orders of Succession (Intestate Estate)

The calculation engine determines heir eligibility and legal quotas through a cascading, mutually exclusive hierarchy:

```mermaid
flowchart TD
    Start([Opening of Succession / Opening of Estate]) --> Q1{Are there Children or their Descendants by Representation?}
    
    %% 1st Order
    Q1 -- Yes --> O1[1st Order of Succession: Descendants]
    O1 --> O1_Calc[Children and Surviving Spouse / Civil Partner concur]
    O1_Calc --> O1_Rules["1st Order Rules:
    - 1 child + spouse: 50% / 50% split
    - 2+ children + spouse: Spouse receives double each child's portion
    - Statutory Spouse Floor: Minimum 25% of the gross estate
    - Children divide the remaining estate equally
    - Grandchildren inherit by representation of deceased children"]

    %% 2nd Order
    Q1 -- No --> Q2{Is there a Surviving Spouse / Partner or Ascendants?}
    Q2 -- Yes --> O2[2nd Order of Succession: Ascendants & Spouse]
    O2 --> O2_Case{Who is present?}
    O2_Case -- Spouse + Ascendants --> O2_Both[2/3 for Spouse | 1/3 for Ascendants]
    O2_Case -- Spouse Only --> O2_Spouse[100% for Spouse]
    O2_Case -- Ascendants Only --> O2_Asc[100% for closest Ascendants divided equally]

    %% 3rd Order
    Q2 -- No --> Q3{Are there Siblings or their Descendants / Nephews?}
    Q3 -- Yes --> O3[3rd Order of Succession: Siblings]
    O3 --> O3_Rules["3rd Order Rules:
    - Full siblings (doble conjunción) receive double the portion of half siblings (simple conjunción)
    - Nephews/nieces represent deceased siblings by stirpes"]

    %% 4th Order
    Q3 -- No --> Q4{Are there other Collaterals up to 6th Degree?}
    Q4 -- Yes --> O4[4th Order of Succession: Other Collaterals]
    O4 --> O4_Rules["4th Order Rules:
    - Closest degree excludes further degrees (uncles/aunts 3°, cousins 4°, etc.)
    - Full blood relatives receive double portion"]

    %% 5th Order
    Q4 -- No --> O5[5th Order of Succession: State of Chile / Treasury]
    O5 --> O5_Rules[100% allocated to the Treasury of Chile - Fisco]
```

### 3.1. Mathematical Formulation for the 1st Order (Descendants + Spouse/AUC)
Let $H$ be the count of living children or represented child stirpes ($H \ge 1$), and $C \in \{0, 1\}$ indicate the presence of a surviving spouse/civil partner:

1. **If $C = 0$ (No spouse/partner):**
   $$\text{Quota per Child } (Q_h) = \frac{1}{H} = \frac{100\%}{H}$$

2. **If $C = 1$ and $H = 1$ (One child + spouse):**
   $$Q_c = 50\% = 0.50, \quad Q_h = 50\% = 0.50$$

3. **If $C = 1$ and $2 \le H \le 6$ (Standard ratio where spouse gets twice a child's share):**
   - Spouse has weight $2$; each child has weight $1$.
   $$\text{Total Units} = 2 + H$$
   $$Q_c = \frac{2}{2 + H}, \quad Q_h = \frac{1}{2 + H}$$

4. **If $C = 1$ and $H \ge 7$ (Statutory 25% floor protection under Art. 988 Civil Code):**
   - The standard ratio would yield $\frac{2}{2 + 7} = \frac{2}{9} \approx 22.2\%$, violating the statutory floor.
   - The law guarantees the spouse a minimum of one quarter (25%) of the estate:
   $$Q_c = 25\% = 0.25$$
   $$Q_h = \frac{1 - 0.25}{H} = \frac{0.75}{H}$$

### 3.2. Right of Representation (*Derecho de Representación* - Arts. 984–987)
- **Legal Concept:** A statutory legal fiction where an heir takes the place, degree, and rights of their predeceased, disinherited, or unworthy ancestor.
- **Allowed Scopes:**
  1. In the direct descending line of the deceased (*hijos fallecidos $\rightarrow$ nietos*).
  2. In the descending line of siblings (*hermanos fallecidos $\rightarrow$ sobrinos*).
- **Stirpes Rule (*División por Estirpes*):** Representatives share equally among themselves the single quota that would have belonged to the represented person.

---

## 4. Marital Property Regimes & Liquidation of Marital Gains (*Gananciales*)

A critical legal distinction must be enforced between the marital community property and the actual probate estate (*acervo hereditario*):

```
+-------------------------------------------------------------------------+
|                  TOTAL MARITAL / COMMUNITY ASSETS                       |
+------------------------------------+------------------------------------+
| 50% SPOUSE'S MARITAL GAINS         |     50% DECEASED'S GROSS ESTATE    |
| (Propiedad del cónyuge sobreviviente|        (Acervo Hereditario Bruto)  |
|  Exempt from probate & inheritance |                                    |
|  taxes, belongs directly to spouse)|                                    |
+------------------------------------+------------------------------------+
                                                        |
                                                        v
                                     +------------------------------------+
                                     | (-) General Deductions (Art. 959)  |
                                     |     - Documented debts             |
                                     |     - Last illness expenses        |
                                     |     - Funeral and burial costs     |
                                     +------------------------------------+
                                                        |
                                                        v
                                     +------------------------------------+
                                     |      NET PARTIBLE ESTATE           |
                                     | (Distributed to heirs according to |
                                     |  succession orders; spouse also    |
                                     |  inherits here as statutory heir)  |
                                     +------------------------------------+
```

### Supported Regimes:
1. **Sociedad Conyugal (Community Property):**
   - Assets acquired for valuable consideration during marriage belong to the community fund (*haber social*).
   - 50% is allocated directly to the surviving spouse as *gananciales* (not part of inheritance).
   - 50% enters the deceased's gross estate.
   - Separate assets belonging exclusively to the deceased (*bienes propios*, e.g., inherited before or during marriage) enter 100% into the gross estate.
2. **Separación Total de Bienes (Separate Property):**
   - 100% of assets titled under the deceased enter the probate estate.
3. **Participación en los Gananciales:**
   - Credit of participation is computed; the net credit in favor of the deceased enters the estate.
4. **Acuerdo de Unión Civil (AUC):**
   - Either community of property (50% split) or complete separation of assets.

---

## 5. Asset Valuation & The 20% Furniture Presumption (*Regla de Ajuar*)

### 5.1. Real Estate (*Bienes Inmuebles*)
- Valued according to the official **Fiscal Assessment (*Avalúo Fiscal*)** issued by the Internal Revenue Service (*SII*) for the semester of death.
- Must record whether the property is urban or rural, if it benefits from D.F.L. 2 tax exemptions, and full registration details (CBR, Fojas, Número, Año, Rol).

### 5.2. Movable Assets & The Statutory 20% Presumption (Art. 46 Law 16,271)
- **Legal Presumption of Household Goods (*Presunción de Ajuar*):** Under Chilean tax law, it is legally presumed that real property used as the principal residence contains furniture and household goods.
- **Functional Rule:**
  - If the user itemizes specific movable assets (vehicles, savings, shares), their values are summed directly.
  - **If NO movable assets are itemized:** The system must provide a pre-checked/suggested option to **impute 20% of the fiscal valuation of the principal real estate property** as presumed furniture/household goods (*ajuar*), in strict compliance with Article 46 of Law 16,271 for *Posesión Efectiva* filings.

### 5.3. Motor Vehicles (*Vehículos Motorizados*)
- Appraised using the official SII fiscal valuation table corresponding to the license plate (*PPU*), make, model, and year of manufacturing.

### 5.4. Cash, Bank Accounts, Shares, Mutual Funds
- Nominal balance and accumulated interest up to the date of death.

---

## 6. General Deductions & Inheritance Tax Computation (Law 16,271)

### 6.1. General Estate Deductions (*Bajas Generales* - Art. 959 Civil Code)
Before estate distribution, the following liabilities are subtracted from the gross estate:
1. Expenses of the deceased's last illness remaining unpaid at death.
2. Funeral, cemetery, and burial expenses.
3. Administrative and legal fees for probate / *posesión efectiva*.
4. Documented debts of the deceased not covered by credit life insurance (*seguro de desgravamen*).
5. Mandatory statutory alimony obligations (*asignaciones alimenticias forzosas*).

$$\text{Net Partible Estate} = \text{Gross Estate Assets} - \text{General Deductions}$$

### 6.2. Progressive Inheritance Tax Scale (Table in UTA)
Calculated individually on each heir's net allocation converted to **Annual Tax Units (*Unidades Tributarias Anuales - UTA*)**:

| Bracket (Allocation in UTA) | Marginal Rate (%) | Deduction in UTA |
| :--- | :---: | :---: |
| 0 to 50 UTA | 1.0% | 0.00 |
| Over 50 up to 100 UTA | 2.5% | 0.75 |
| Over 100 up to 150 UTA | 5.0% | 3.25 |
| Over 150 up to 200 UTA | 7.5% | 7.00 |
| Over 200 up to 250 UTA | 10.0% | 12.00 |
| Over 250 up to 300 UTA | 15.0% | 24.50 |
| Over 300 up to 1,200 UTA | 20.0% | 39.50 |
| Over 1,200 UTA | 25.0% | 99.50 |

### 6.3. Kinship Exemptions and Tax Surcharges:
- **Spouse, Civil Partner, Children, Grandchildren, Parents, Grandparents:** Exempt up to **50 UTA** per heir (Art. 2 Law 16,271). No surcharge (0%).
- **Siblings, Uncles/Aunts, Nephews/Nieces, Cousins (Collaterals up to 4th degree):** Exempt up to **5 UTA**. Surcharge of **+20%** on the computed tax.
- **5th and 6th degree collaterals or non-relatives:** No exemption (0 UTA). Surcharge of **+40%** on the computed tax.

---

## 7. Functional Requirements & User Experience Flow

```
+--------------------------------------------------------------------------+
|                     UNIFIED PROGRESSIVE USER FLOW                        |
+--------------------------------------------------------------------------+
|  [STEP 1] Deceased's Overview (Date of Death, Last Domicile / Commune)   |
|  [STEP 2] Marital Status & Property Regime (Sociedad Conyugal, etc.)     |
|  [STEP 3] Heir Family Tree (Legitimarios, Representation, Succession)    |
|  [STEP 4] Asset & Debt Inventory (Real Estate, 20% Ajuar, Liabilities)   |
+--------------------------------------------------------------------------+
                                     |
                                     v
+--------------------------------------------------------------------------+
|               MODE 1: INSTANT SIMULATOR & DISTRIBUTION                   |
| - Real-time breakdown of legal percentages and dollar amounts ($ CLP)   |
| - Interactive visual distribution charts & marital gains separation      |
| - Estimated SII Inheritance Tax calculation per beneficiary              |
+--------------------------------------------------------------------------+
                                     |
                                     v [Action: "Proceed to Posesión Efectiva"]
+--------------------------------------------------------------------------+
|          MODE 2: OFFICIAL CIVIL REGISTRY FORM GENERATOR (SRCeI)          |
| - Step-by-step entry of RUTs (with Modulo 11 validation) & Names         |
| - Real Estate registry data (CBR, Fojas, Número, Año, Rol)              |
| - Vehicle License Plates (PPU), Bank accounts, and inventory validation   |
| - Downloadable official F-1 / F-2 Civil Registry PDF Form                |
| - Structured digital summary for filing on registrocivil.cl ClaveÚnica   |
+--------------------------------------------------------------------------+
```

### FR-01: Deceased Profile and Territorial Domicile
- Date of death (determines applicable UTA/UTM values and fiscal valuation period).
- Last domicile (Commune and Region): determines territorial jurisdiction for Civil Registry and SII regional office.
- Marital status: Single, Married (*Sociedad Conyugal*, *Separación de Bienes*, *Participación en Gananciales*), Civil Union (*AUC*), Widowed, Divorced.

### FR-02: Heirs, Kinship Tree & Representation
- Intuitive selector for forced heirs (*legitimarios*):
  - **With legitimarios (1st & 2nd Order):** Children, surviving spouse/partner, ascendants.
  - **Without legitimarios (3rd, 4th & 5th Order):** Siblings (full vs. half), other collaterals up to 6th degree, or State Treasury.
- Support for **Representation Trees**: ability to mark a child or sibling as predeceased and attach their descendants (grandchildren or nephews/nieces).
- Smart validation that blocks conflicting orders (e.g., presence of children disables collateral succession).

### FR-03: Valued Asset & Liability Inventory
- **Real Estate:** SII Tax Roll (*Rol de Avalúo*), Commune, Fiscal Appraisal, Social/Community flag, D.F.L. 2 status.
- **Movable Assets & Furniture:**
  - Itemized manual entry.
  - **20% Furniture Presumption Toggle:** Automatically calculates and imputes 20% of the primary residence fiscal value when no movable goods are listed.
- **Vehicles:** License Plate (*PPU*), SII valuation.
- **Other Assets:** Bank accounts, mutual funds, corporate shares.
- **General Deductions / Debts:** Funeral expenses, medical debts, non-insured bank loans.

### FR-04: Calculation Engine & Simulation Output
- Instant, state-independent calculation of:
  - Surviving spouse's marital gains (*gananciales*, 50% community property).
  - Deceased's gross estate.
  - Deductible liabilities.
  - Net partible estate.
  - Percentage and monetary share ($ CLP) for every heir.
  - Estimated inheritance tax in UTA and CLP.

### FR-05: Civil Registry Form & Export Formats
- Complete formal identities:
  - Applicant (*Solicitante*): Names, RUT (with Modulo 11 check), address, email, phone.
  - Deceased (*Causante*): Names, RUT, profession, place of death.
  - Heirs (*Herederos*): Names, RUT, date of birth, marital status, kinship.
  - Property Titles: Conservador de Bienes Raíces (CBR), Fojas, Número, Año.
- **Outputs:**
  - **Official PDF Form:** Exact visual reproduction of Civil Registry Form F-1 and Schedule F-2.
  - **Digital Filing Summary:** Structured JSON payload and step-by-step copy assistant for the online ClaveÚnica procedure.

---

## 8. Canonical Data Model & JSON Schema

```json
{
  "mode": "simulator",
  "deceased": {
    "rut": "12.345.678-9",
    "firstName": "Juan",
    "lastName": "Pérez González",
    "dateOfDeath": "2025-05-10",
    "maritalStatus": "married_sociedad_conyugal",
    "lastDomicile": {
      "street": "Av. Libertador Bernardo O'Higgins 1234",
      "commune": "Santiago",
      "region": "Metropolitana de Santiago"
    }
  },
  "spouseOrPartner": {
    "isAlive": true,
    "relationship": "spouse",
    "rut": "13.456.789-K",
    "fullName": "María Soto Riquelme"
  },
  "heirs": [
    {
      "id": "h-1",
      "relationship": "child",
      "fullName": "Carlos Pérez Soto",
      "rut": "18.123.456-7",
      "isAlive": true,
      "subRepresentation": []
    },
    {
      "id": "h-2",
      "relationship": "child_deceased",
      "fullName": "Andrea Pérez Soto (Deceased)",
      "isAlive": false,
      "subRepresentation": [
        {
          "id": "rep-1",
          "relationship": "grandchild",
          "fullName": "Matías González Pérez",
          "rut": "22.333.444-5",
          "isAlive": true
        }
      ]
    }
  ],
  "assets": {
    "realEstates": [
      {
        "id": "re-1",
        "description": "Principal Residence",
        "commune": "Santiago",
        "siiRol": "1234-56",
        "fiscalValuation": 120000000,
        "isSocialAsset": true,
        "isDfl2": true,
        "cbr": {
          "cbrName": "Conservador de Bienes Raíces de Santiago",
          "fojas": "12345",
          "number": "6789",
          "year": 2010
        }
      }
    ],
    "use20PercentFurniturePresumption": true,
    "movableAssets": [],
    "vehicles": [
      {
        "id": "veh-1",
        "ppu": "ABCD-12",
        "brand": "Toyota",
        "model": "Yaris",
        "year": 2020,
        "fiscalValuation": 7500000,
        "isSocialAsset": true
      }
    ],
    "otherAssets": []
  },
  "liabilities": {
    "generalDeductions": [
      {
        "type": "funeral_expenses",
        "description": "Funeral and burial service expenses",
        "amount": 2500000
      }
    ]
  }
}
```

---

## 9. Technical Architecture & Component Responsibilities

### 9.1. Backend: Django + Django REST Framework + PostgreSQL
- **App `api` Directory Structure:**
  - `models.py`: Storage for *Posesión Efectiva* drafts (encrypted personal data at rest, UUID primary keys).
  - `views.py` / `viewsets`:
    - `POST /api/calculator/evaluate/`: Stateless, public endpoint performing pure mathematical and legal allocation.
    - `POST /api/succession/save-draft/`: Saves encrypted drafts returning a secure resumption token.
    - `POST /api/succession/generate-pdf/`: Generates and streams the official Civil Registry F-1/F-2 PDF via ReportLab / WeasyPrint.
  - `services/calculator.py`: Pure Python business logic implementing the Civil Code succession tree, marital gains liquidation, and Law 16,271 tax brackets.
  - `services/pdf_generator.py`: PDF rendering engine calibrated to the exact pixel/millimeter layout of the official Civil Registry forms.

### 9.2. Frontend: React + TypeScript + Vite + Vanilla CSS
- **Modular Components:**
  - `CalculatorWizard`: Multi-step responsive wizard with real-time reactive feedback.
  - `KinshipTreeSelector`: Visual heir tree builder supporting representation branches.
  - `AssetManager`: Real estate, vehicle, and asset forms with the automatic 20% furniture presumption toggle.
  - `ResultsBreakdown`: Interactive charts showing marital gains vs. gross estate vs. heir quotas and tax liabilities.
  - `PosesionEfectivaModal`: Dedicated workflow for completing RUTs, CBR title data, and triggering PDF export.
- **Utility Validators:**
  - `validateRut`: Chilean Modulo 11 checksum algorithm and auto-formatter (`12.345.678-K`).
  - `formatCLP` / `formatUTA`: Accurate currency and legal tax unit formatting.

---

## 10. AI Agent Engineering Directives

When building or updating features in this codebase:
1. **Legal Precision:** Never approximate or invent succession distribution logic. Every calculation must be grounded strictly in the Chilean Civil Code (Arts. 980+) and Law 16,271.
2. **Marital Gains Segregation:** Always isolate the 50% marital gains (*gananciales*) belonging to the surviving spouse before dividing the deceased's estate.
3. **20% Furniture Presumption (*Ajuar*):** Ensure the 20% presumption toggle operates seamlessly and is prominently communicated to the user.
4. **Simulator Privacy:** Keep Mode 1 completely anonymous and free of mandatory identity fields (RUTs or names).
5. **Aesthetics & Usability:** Maintain a polished, professional, fintech/legal-grade UI with clear Chilean Spanish terminology, elegant dark/light contrast, and fluid micro-interactions.
