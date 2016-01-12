# -*- coding: utf-8 -*-
"""
Created on Mon Dec  7 19:44:57 2015

@author: brentselby
"""

#Available data:
#['STNAME', 'CENSUS_TRACT', 'FULLADDRESS', 'STATUS', 'IMAGEURL',
# 'HAS_CONDO_UNIT', 'NATIONALGRID', 'SSL', 'YCOORD', 'QUADRANT',
# 'WARD', 'WARD_2012', 'HAS_SSL', 'HAS_ALIAS', 'HAS_RES_UNIT',
# 'VOTE_PRCNCT', 'LATITUDE', 'SMD_2002', 'IMAGEDIR', 'ROC', 'ANC_2002',
# 'RES_TYPE', 'XCOORD', 'STREETVIEWURL', 'WARD_2002', 'LONGITUDE',
# 'FOCUS_IMPROVEMENT_AREA', 'PSA', 'STATE', 'STREET_TYPE', 'MARID',
# 'ConfidenceLevel', 'POLDIST', 'ANC', 'ROADWAYSEGID', 'ADDRNUMSUFFIX',
# 'ADDRESS_ID', 'IMAGENAME', 'ANC_2012', 'ZIPCODE', 'SMD', 'SMD_2012',
# 'NBHD_ACTION', 'CLUSTER_', 'ADDRNUM', 'CITY']

import requests

def getAddrInfo(addr):
    r = requests.post(
    'http://citizenatlas.dc.gov/newwebservices/locationverifier.asmx/findLocation2',
    data={'f': 'json', 'str': addr})
    r2=r.json()
    
    if(r2.get('returnDataset')==None):
        return None
    
    c=(r2.get('returnDataset')).get('Table1')[0]
    

    return [c.get('ConfidenceLevel'),
    r2.get('UNITNUMBER'),
    c.get('ZIPCODE'),
    c.get('WARD'),
    c.get('STNAME'),
    c.get('STATE'),
    c.get('ADDRNUM'),
    c.get('QUADRANT'),
    c.get('FULLADDRESS'),
    c.get('RES_TYPE')]


def getWard(addr):
    r = requests.post(
    'http://citizenatlas.dc.gov/newwebservices/locationverifier.asmx/findLocation2',
    data={'f': 'json', 'str': addr})
    r2=r.json()


    c=(r2.get('returnDataset')).get('Table1')[0]

    return [c.get('ConfidenceLevel'),c.get('WARD')]


def getAllAddrInfo(addr):
    r = requests.post(
    'http://citizenatlas.dc.gov/newwebservices/locationverifier.asmx/findLocation2',
    data={'f': 'json', 'str': addr})
    r2=r.json()


    c=(r2.get('returnDataset')).get('Table1')[0]
        
    return [r2.get('UNITNUMBER'),
    c.get('ADDRNUM'),
    c.get('ADDRNUMSUFFIX'),
    c.get('ANC'),
    c.get('ANC_2002'),
    c.get('ANC_2012'),
    c.get('CENSUS_TRACT'),
    c.get('CITY'),
    c.get('CLUSTER_'),
    c.get('ConfidenceLevel'),
    c.get('FOCUS_IMPROVEMENT_AREA'),
    c.get('FULLADDRESS'),
    c.get('HAS_ALIAS'),
    c.get('HAS_CONDO_UNIT'),
    c.get('HAS_RES_UNIT'),
    c.get('HAS_SSL'),
    c.get('IMAGEDIR'),
    c.get('IMAGENAME'),
    c.get('IMAGEURL'),
    c.get('LATITUDE'),
    c.get('LONGITUDE'),
    c.get('MARID'),
    c.get('NATIONALGRID'),
    c.get('NBHD_ACTION'),
    c.get('POLDIST'),
    c.get('PSA'),
    c.get('QUADRANT'),
    c.get('RES_TYPE'),
    c.get('ROADWAYSEGID'),
    c.get('ROC'),
    c.get('SMD'),
    c.get('SMD_2002'),
    c.get('SMD_2012'),
    c.get('SSL'),
    c.get('STATE'),
    c.get('STATUS'),
    c.get('STNAME'),
    c.get('STREETVIEWURL'),
    c.get('STREET_TYPE'),
    c.get('VOTE_PRCNCT'),
    c.get('WARD'),
    c.get('WARD_2002'),
    c.get('WARD_2012'),
    c.get('XCOORD'),
    c.get('YCOORD'),
    c.get('ZIPCODE')]