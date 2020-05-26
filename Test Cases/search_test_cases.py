import unittest
import json
import requests
root_url = "http://52.20.110.175:5000/"

def get_search_results(keyword):
    url = f"{root_url}/search?keyword={keyword}&json=True"
    response = requests.get(url)
    if(response.status_code == 200):
        products = json.loads(response.content)
    else:
        products = []
    product_set =  set(product["id"] for product in products)
    return product_set

class TestSearchEndpoint(unittest.TestCase):
    def test_1(self):
        # Test case to search the keyword "book"
        products = get_search_results("book")
        # Expected search results include:
        # "Pear Notebook" - id: 2
        # "Gamer Notebook" - id: 5
        # "Book - The Stranger by Albert Camus" - id: 3
        # "Book - Animal Farm by George Orwell" - id: 4
        expected_products = {2,3,4,5}
        self.assertTrue(expected_products.issubset(products))

    def test_2(self):
        # Test case to search the keyword "black"
        products = get_search_results("black")
        # Expected search results include:
        # "Black Study Lamp" - id: 6
        # "Black and White Towel" - id: 9
        expected_products = {6,9}
        self.assertTrue(expected_products.issubset(products))


    def test_3(self):
        # Test case to search the keyword "computer"
        products = get_search_results("computer")
        # Expected search results include:
        # "Pear Notebook" - id: 2
        # "Gamer Notebook" - id: 5
        expected_products = {2,5}
        self.assertTrue(expected_products.issubset(products))

    def test_4(self):
        # Test case to search the keyword "bath"
        products = get_search_results("bath")
        # Expected search results include:
        # ""Black and White Towel" - id: 9
        # "Blue Towel" - id: 8
        expected_products = {8,9}
        self.assertTrue(expected_products.issubset(products))

    def test_5(self):
        # Test case to search the keyword "read"
        products = get_search_results("read")
        # Expected search results include:
        # "Book - The Stranger by Albert Camus" - id: 3
        # "Book - Animal Farm by George Orwell" - id: 4
        # "Black Study Lamp" - id: 6
        # "Blue Study Lamp" - id: 7
        expected_products = {3,4,6,7}
        self.assertTrue(expected_products.issubset(products))



if(__name__ == "__main__"):
    unittest.main()
