#!/usr/bin/env python3
'''This is really just a bookmark to a straightforward donwload link for limited data'''


import os
from urllib import request

csv_dir = '../csv'
if not os.path.exists(csv_dir):
    os.makedirs(csv_dir)

filename = os.path.join(csv_dir, 'ocf_contributions_quick.csv')
conurl = 'http://www.ocf.dc.gov/dsearch/printrpt_con.asp?ob1=agyname&type=pcc&searchtype=adv&printtype=csv'
request.urlretrieve (conurl, filename)

filename = os.path.join(csv_dir, 'ocf_expenditures_quick.csv')
expurl = 'http://www.ocf.dc.gov/dsearch/printrpt_exp.asp?ob1=agyname&type=pcc&searchtype=rec&printtype=csv'
request.urlretrieve (expurl, filename)

