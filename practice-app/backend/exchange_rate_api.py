import requests
import json
import unittest
import math

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

def TRY_to_USD(TRY, rates):
	if("TRY" in rates):
		rate = rates["TRY"]
		if(type(rate) is float and rate != 0):
			return TRY/rate
		else:
			# Rate 0 - Division by zero error
			return float("nan")
	else:
		#API error
		return float("nan")

def USD_to_EUR(USD, rates):
	if(math.isnan(USD)):
		return float("nan")
	else:
		if("EUR" in rates):
			rate = rates["EUR"]
			if(type(rate) is float):
				return USD * rate 
			else:
				# Rate is not numeric
				return float("nan")
		else:
			#API error: Rate of euro not returned 
			return float("nan")

def prices_in_currencies(TRY):
	rates = get_currency_rates()
	USD = TRY_to_USD(TRY, rates)
	EUR = USD_to_EUR(USD, rates)
	return {"TRY": TRY, "USD":USD, "EUR":EUR}

class TestCurrencyAPI(unittest.TestCase):
	def test_api(self):
		rates = get_currency_rates()
		if(rates is not None):
			self.assertTrue("TRY" in rates)
			self.assertTrue("EUR" in rates)

	def test_conversion(self):
		correct_rates = {"EUR": 1.17, "TRY": 7.10}
		self.assertTrue(TRY_to_USD(14.2,correct_rates) == 14.2/7.1)
		self.assertTrue(USD_to_EUR(23,correct_rates) == 23*1.17)
		missing_rates = {"XZC": 1.17, "ABX": 7.10}
		self.assertTrue(math.isnan(TRY_to_USD(14.2,missing_rates)))
		self.assertTrue(math.isnan(USD_to_EUR(14.2,missing_rates)))
		zero_rates = {"EUR": 1.17, "TRY": 0.}
		self.assertTrue(math.isnan(TRY_to_USD(14.2,missing_rates)))



if(__name__ == "__main__"):
	unittest.main()