import requests
import json
import unittest

API_KEY = "2YPevc3AbYX7fH67s7cspnEDs8uT5gfIS0lB"


def get_currency_rates():
	URL = f"https://currencyapi.net/api/v1/rates?key={API_KEY}"
	result = requests.get(URL)
	if(result.status_code == 200):
		result = json.loads(result.content)
		if(result["valid"] == True):
			return result["rates"]
		else:
			# API Result Error
			return None
	else:
		# API Error
		return None

class TestCurrencyAPI(unittest.TestCase):
    def test_api(self):
    	rates = get_currency_rates()
    	if(rates is not None):
	        self.assertTrue("TRY" in rates)
	        self.assertTrue("EUR" in rates)

if(__name__ == "__main__"):
	unittest.main()