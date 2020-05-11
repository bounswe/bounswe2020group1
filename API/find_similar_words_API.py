import requests
import json
import unittest

def get_words_with_similar_meaning(word):
    URL = 'https://api.datamuse.com/words?ml=' + word.replace(" ", "+")
    all_results = requests.get(URL)
    all_results = json.loads(all_results.content)
    similar_words = []
    for result in all_results:
        similar_words.append(result["word"])
    return similar_words

def get_words_with_similar_sound(word):
    URL = 'https://api.datamuse.com/words?sl=' + word.replace(" ", "+")
    all_results = requests.get(URL)
    all_results = json.loads(all_results.content)
    sound_like_words = []
    for result in all_results:
        sound_like_words.append(result["word"])
    return sound_like_words
    
def get_words_with_similar_spelling(word):
    URL = 'https://api.datamuse.com/words?sp=' + word.replace(" ", "+")
    all_results = requests.get(URL)
    all_results = json.loads(all_results.content)
    spelled_like_words = []
    for result in all_results:
        spelled_like_words.append(result["word"])
    return spelled_like_words
    
def get_words_strongly_associated_with(word):
    URL = 'https://api.datamuse.com/words?rel_trg=' + word.replace(" ", "+")
    all_results = requests.get(URL)
    all_results = json.loads(all_results.content)
    strongly_associated_words = []
    for result in all_results:
        strongly_associated_words.append(result["word"])
    return strongly_associated_words   

def get_suggestions(word):
    URL = 'https://api.datamuse.com/sug?s=' + word.replace(" ", "+")
    all_results = requests.get(URL)
    all_results = json.loads(all_results.content)
    suggestions = []
    for result in all_results:
        suggestions.append(result["word"])
    return suggestions 