import requests
import json
import unittest

def get_text_response(comment_text):
    api_url = "https://plino.herokuapp.com/api/v1/classify/"
    payload = \
    {
    'email_text': comment_text
    }
    
    headers = {'content-type': 'application/json'}
    # query our API
    response = requests.post(api_url, data=json.dumps(payload), headers=headers)
    #print(response.status_code)
    return response.text

def is_spam(comment_text):
    api_url = "https://plino.herokuapp.com/api/v1/classify/"
    payload = \
    {
    'email_text': comment_text
    }
    
    headers = {'content-type': 'application/json'}
    # query our API
    response = requests.post(api_url, data=json.dumps(payload), headers=headers)
    if response.json().get('email_class')=='spam':
        return True
    return False


class Test_Spam_Detection_API(unittest.TestCase):
    def test_api(self):
        comment="This is not a spam sentence."
        results = get_text_response(comment)
        if(results is not None):
            self.assertTrue("email_class" in results)
            self.assertTrue("email_text" in results)
            self.assertTrue("status" in results)
            
    def test_the_result(self):
        comment="This is a spam comment.This is a spam comment."
        self.assertTrue(is_spam(comment))
                        
if(__name__ == "__main__"):
    unittest.main()
    
        

