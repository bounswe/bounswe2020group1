import requests
import json
import unittest

def get_location_of_clients_ip():
	URL = 'https://ipapi.co/json/'
	result = requests.get(URL)
	if(result.status_code == 200):
		result = json.loads(result.content)
		return result["city"], result["region"], result["country_name"]
	else:
		return None

def get_location_of_a_specific_ip(ip):
	URL = 'https://ipapi.co/'+ip+'/json/'
	result = requests.get(URL)
	if(result.status_code == 200):
		result = json.loads(result.content)
		return result["city"], result["region"], result["country_name"]
	else:
		return None

class TestLocationAPI(unittest.TestCase):
	def test_api(self):
		city, region, country = get_location_of_clients_ip()
		self.assertTrue(city is not None)
		self.assertTrue(region is not None)
		self.assertTrue(country is not None)

	def test_location(self):
		temp_ip = '37.130.106.32'
		city, region, country = get_location_of_a_specific_ip(temp_ip)
		self.assertTrue(city == "Istanbul")
		self.assertTrue(region == "Istanbul")
		self.assertTrue(country == "Turkey")


if(__name__ == "__main__"):
	unittest.main()
