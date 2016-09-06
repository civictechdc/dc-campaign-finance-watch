# -*- coding: utf-8 -*-
"""
Created on Thu Aug  4 19:43:56 2016

@author: brent selby
"""
import numpy as np
import pandas as pd

inputfn="c:/simple.csv"
inputfn="DC_contribs_since_7may15_forAddy.csv"
outputfn="DC_contribs_since_7may15_withAddy.csv"

## read in file
dat=pd.read_csv(inputfn,encoding = 'iso-8859-1')

## add vars in dataframe
#ConfidenceLevel,UNITNUMBER,ZIPCODE,WARD,STNAME,STATE,ADDRNUM,QUADRANT,FULLADDRESS,RES_TYPE
dat['ConfidenceLevel']=np.nan
dat['UNITNUMBER']=np.nan
dat['ZIPCODE']=np.nan
dat['WARD']=""
dat['STNAME']=""
dat['STATE']=""
dat['ADDRNUM']=np.nan
dat['QUADRANT']=""
dat['FULLADDRESS']=""
dat['RES_TYPE']=""

## Loop
for i in range(0, len(dat.index)):
#for i in range(1,10):
    ## filter out non-DC
    #if(dat['Contributor State'][i]=="DC"):
    info=getAddrInfo(dat['Address Raw'][i], dat['Contributor State'][i])
        #getAddrInfo[a:b][i]=info
        # ADD IF STATEMENT FOR NON-INFO
    if(info!=None):
        dat['ConfidenceLevel'][i]=info[0]
        dat['UNITNUMBER'][i]=info[1]
        dat['ZIPCODE'][i]=info[2]
        dat['WARD'][i]=info[3]
        dat['STNAME'][i]=info[4]
        dat['STATE'][i]=info[5]
        dat['ADDRNUM'][i]=info[6]
        dat['QUADRANT'][i]=info[7]
        dat['FULLADDRESS'][i]=info[8]
        dat['RES_TYPE'][i]=info[9]
        
dat.to_csv(outputfn)