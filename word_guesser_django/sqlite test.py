# -*- coding: utf-8 -*-
"""
Created on Wed Sep 27 15:07:12 2023

@author: erict
"""

import sqlite3
from typing import Iterable

db_path = "db.sqlite3"

def insert(con: sqlite3.Connection, data: Iterable):

    data_str = ""
    
    l = len(data)
    
    for i in range(l):
        
        if type(data[i]) != str:
            data_str += str(data[i])

        else:
            data_str += '"' + data[i] + '"'
            
        if i != l - 1:
            data_str += ", "

    command = f"INSERT INTO DICTIONARY VALUES ({data_str})"
    
    con.execute(command)
    
    con.commit()

    return

    
def select(con: sqlite3.Connection, names: Iterable = []):
    
    data_str = ""
    
    if len(names) == 0:
        data_str = "*"
        
    else:
        data_str = ", ".join(names)
        
    command = f"SELECT {data_str} FROM dictionary_word"
    
    res = con.execute(command)
    
    return res.fetchall()


def connect(db_path: str):
    
    con = sqlite3.connect(db_path)
    
    return con

def close(con: sqlite3.Connection):
    
    con.close()
    
    return

