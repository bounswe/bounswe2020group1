import unittest
import urllib.request
from inscriptis import get_text

url = "http://52.20.110.175:5000"
html = urllib.request.urlopen(url).read().decode('utf-8')
text = get_text(html)
#print(text)
textArray = text.split("\n")


class TestProductPageEndpoint(unittest.TestCase):
    def test_1(self):
        name = textArray[165]
        seller = textArray[168]
        price = textArray[171]
        location = textArray[174]
        details = textArray[177]
        self.assertTrue('Regular Sneakers' in name)
        self.assertTrue('test' in seller)
        self.assertTrue('55' in price)
        self.assertTrue('Izmir' in location)
        self.assertTrue('Testing' in details)


    def test_2(self):

        test1 = 'Product Details' in textArray[193]
        self.assertTrue(test1, "Missing fields")
        sum = textArray[181] + textArray[184] + textArray[187] + textArray[190] + textArray[193]
        test2 = 'test_name' in sum
        self.assertTrue(test2, "Product is created without name field")



    def test_3(self):
        name = textArray[207]
        seller = textArray[210]
        price = textArray[213]
        location = textArray[216]
        details = textArray[219]
        self.assertTrue('test_name' in name, 'Missing name field')
        self.assertTrue('test' in seller, 'Missing seller field')
        self.assertTrue('56' in price, 'Missing price field')
        self.assertTrue('Izmir' in location, 'Missing location field')


if(__name__ == "__main__"):
    unittest.main()