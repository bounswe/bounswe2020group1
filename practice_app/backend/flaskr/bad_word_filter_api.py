import requests
import unittest

def get_comment_response(comment):
    Apikey="7659a86259mshe8a5891ca31e243p158290jsn67802ecfea9d"
    Url = "https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter"
  
    payload = "censor-character=*&content="+comment
    headers = {
        'x-rapidapi-host': "neutrinoapi-bad-word-filter.p.rapidapi.com",
        'x-rapidapi-key':Apikey ,
        'content-type': "application/x-www-form-urlencoded"
        }
    response = requests.request("POST", Url, data=payload, headers=headers)
    return response.text

def is_comment_inapporiate(comment):
    Apikey="7659a86259mshe8a5891ca31e243p158290jsn67802ecfea9d"
    Url = "https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter"
  
    payload = "censor-character=*&content="+comment
    headers = {
        'x-rapidapi-host': "neutrinoapi-bad-word-filter.p.rapidapi.com",
        'x-rapidapi-key':Apikey ,
        'content-type': "application/x-www-form-urlencoded"
        }
    response = requests.request("POST", Url, data=payload, headers=headers)
    if response.json().get('is-bad'):
        return True #bad word
    return False      

class Test_Bad_Word_Filter_API(unittest.TestCase):
    def test_api(self):
        comment="This is a quality product so i like it"
        results = get_comment_response(comment)
        if(results is not None):
            self.assertTrue("is-bad" in results)
            self.assertTrue("bad-words-total" in results)
            self.assertTrue("bad-words-list" in results)
            self.assertTrue("censored-content" in results)
            
    def test_the_result(self):
        comment="This is a fucking product so i don't like it"
        self.assertTrue(is_comment_inapporiate(comment))
                        
if(__name__ == "__main__"):
    unittest.main()

    
