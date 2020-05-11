# -*- coding: utf-8 -*-
"""
Created on Mon May 11 13:21:17 2020

@author: BarisAlhan
"""

import os
from flask import Flask

def create_app(test_config = None):
    
    app = Flask(__name__, instance_relative_config=True)
    
    
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    
    app.config.from_mapping(
        SECRET_KEY='tursu',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    
    
    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)
        
    
    @app.route('/')
    def hello():
        return 'Welcome to Tursu!'
    
    
    return app