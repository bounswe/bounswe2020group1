# -*- coding: utf-8 -*-
"""
Created on Mon May 11 13:43:48 2020

@author: BarisAlhan
"""
import sqlite3

import click
from flask import current_app, g
from flask.cli import with_appcontext


'''
    1.Creates a database if it doesn't exist
    2.Returns the current database.
'''
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()