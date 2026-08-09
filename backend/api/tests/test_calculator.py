from django.test import TestCase
from api.services.calculator import evaluate_inheritance, compute_tax_for_allocation


class CalculatorServiceTestCase(TestCase):
    def test_1st_order_1_child_and_spouse(self):
        """1 child + spouse: 50% / 50% split."""
        payload = {
            "maritalStatus": "separacion-bienes",
            "heirs": [
                {"relationship": "conyuge"},
                {"relationship": "hijo"},
            ],
            "assets": {
                "realEstates": [{"fiscalValuation": 100000000}],
                "movablesValue": 0,
                "use20PercentFurniturePresumption": False,
            },
            "deductions": [],
        }
        result = evaluate_inheritance(payload)
        self.assertEqual(result["succession_order"], 1)
        self.assertEqual(result["net_partible_estate"], 100000000)
        self.assertEqual(len(result["heirs"]), 2)
        
        spouse = next(h for h in result["heirs"] if h["relationship"] == "conyuge")
        child = next(h for h in result["heirs"] if h["relationship"] == "hijo")
        self.assertEqual(spouse["quota_percent"], 50.0)
        self.assertEqual(spouse["amount"], 50000000)
        self.assertEqual(child["quota_percent"], 50.0)
        self.assertEqual(child["amount"], 50000000)

    def test_1st_order_2_children_and_spouse(self):
        """2 children + spouse: spouse gets 2x child share (2/4 = 50%, each child 1/4 = 25%)."""
        payload = {
            "maritalStatus": "separacion-bienes",
            "heirs": [
                {"relationship": "conyuge"},
                {"relationship": "hijo"},
                {"relationship": "hijo"},
            ],
            "assets": {
                "realEstates": [{"fiscalValuation": 120000000}],
                "movablesValue": 0,
                "use20PercentFurniturePresumption": False,
            },
        }
        result = evaluate_inheritance(payload)
        self.assertEqual(result["succession_order"], 1)
        spouse = next(h for h in result["heirs"] if h["relationship"] == "conyuge")
        children = [h for h in result["heirs"] if h["relationship"] == "hijo"]
        self.assertEqual(spouse["quota_percent"], 50.0)
        self.assertEqual(spouse["amount"], 60000000)
        for c in children:
            self.assertEqual(c["quota_percent"], 25.0)
            self.assertEqual(c["amount"], 30000000)

    def test_1st_order_7_children_spouse_25_percent_floor(self):
        """7 children + spouse: spouse receives statutory 25% minimum floor."""
        payload = {
            "maritalStatus": "separacion-bienes",
            "heirs": [{"relationship": "conyuge"}] + [{"relationship": "hijo"} for _ in range(7)],
            "assets": {
                "realEstates": [{"fiscalValuation": 100000000}],
                "movablesValue": 0,
            },
        }
        result = evaluate_inheritance(payload)
        spouse = next(h for h in result["heirs"] if h["relationship"] == "conyuge")
        self.assertEqual(spouse["quota_percent"], 25.0)
        self.assertEqual(spouse["amount"], 25000000)

    def test_sociedad_conyugal_gananciales_split(self):
        """Sociedad conyugal splits 50% gananciales before inheritance partition."""
        payload = {
            "maritalStatus": "sociedad-conyugal",
            "heirs": [
                {"relationship": "conyuge"},
                {"relationship": "hijo"},
            ],
            "assets": {
                "realEstates": [{"fiscalValuation": 100000000}],
                "movablesValue": 0,
            },
        }
        result = evaluate_inheritance(payload)
        self.assertTrue(result["marital_gains"]["applies"])
        self.assertEqual(result["marital_gains"]["amount"], 50000000)
        self.assertEqual(result["gross_estate"], 50000000)
        self.assertEqual(result["net_partible_estate"], 50000000)
        # Inside the 50M inheritance, spouse gets 50% (25M) and child gets 50% (25M)
        spouse = next(h for h in result["heirs"] if h["relationship"] == "conyuge")
        child = next(h for h in result["heirs"] if h["relationship"] == "hijo")
        self.assertEqual(spouse["amount"], 25000000)
        self.assertEqual(child["amount"], 25000000)

    def test_20_percent_ajuar_presumption(self):
        """Presumption adds 20% of real estate value as movable goods."""
        payload = {
            "maritalStatus": "separacion-bienes",
            "heirs": [{"relationship": "hijo"}],
            "assets": {
                "realEstates": [{"fiscalValuation": 100000000}],
                "use20PercentFurniturePresumption": True,
            },
        }
        result = evaluate_inheritance(payload)
        self.assertTrue(result["furniture_presumption"]["applied"])
        self.assertEqual(result["furniture_presumption"]["amount"], 20000000)
        self.assertEqual(result["net_partible_estate"], 120000000)

    def test_2nd_order_spouse_and_parents(self):
        """2nd order: 2/3 for spouse, 1/3 divided among parents."""
        payload = {
            "maritalStatus": "separacion-bienes",
            "heirs": [
                {"relationship": "conyuge"},
                {"relationship": "padre"},
                {"relationship": "padre"},
            ],
            "assets": {
                "realEstates": [{"fiscalValuation": 90000000}],
            },
        }
        result = evaluate_inheritance(payload)
        self.assertEqual(result["succession_order"], 2)
        spouse = next(h for h in result["heirs"] if h["relationship"] == "conyuge")
        parents = [h for h in result["heirs"] if h["relationship"] == "padre"]
        self.assertAlmostEqual(spouse["quota_percent"], 66.6667, places=3)
        self.assertEqual(spouse["amount"], 60000000)
        for p in parents:
            self.assertAlmostEqual(p["quota_percent"], 16.6667, places=3)
            self.assertEqual(p["amount"], 15000000)
