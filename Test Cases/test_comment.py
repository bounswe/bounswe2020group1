import unittest
import json
import requests
import urllib.request
from inscriptis import get_text


url1 = "http://52.20.110.175:5000/product/0"
html1 = urllib.request.urlopen(url1).read().decode('utf-8')
text1 = get_text(html1)

url2 = "http://52.20.110.175:5000/product/3"
html2 = urllib.request.urlopen(url2).read().decode('utf-8')
text2 = get_text(html2)

url3 = "http://52.20.110.175:5000/product/8"
html3 = urllib.request.urlopen(url3).read().decode('utf-8')
text3 = get_text(html3)

url4 = "http://52.20.110.175:5000/product/2"
html4 = urllib.request.urlopen(url4).read().decode('utf-8')
text4 = get_text(html4)

class testComment(unittest.TestCase):
	def test_1(self):
		productComment = "This product is wonderful"
		self.assertTrue(productComment in text1)


	def test_2(self):
		productComment = "Awesome book!"
		self.assertTrue(productComment in text2)

	def test_3(self):
		productComment = "Nice and soft!"
		self.assertTrue(productComment in text3)

	def test_4(self):
		productComment = "Really classy, and has a good battery."
		self.assertTrue(productComment in text4)



if(__name__ == "__main__"):
    unittest.main()