'''
CREATE RANKING DATA
THREE TABS: 2010-2014; 2014; 2014 Ballow
Slider = # of donations?
'''

import os
import io
import time
import pandas as pd
import numpy as np
import simplejson

# READ IN CONTRIBUTIONS CSV FILE AND CLEAN IT UP A BIT

input_dir = '../csv'
input_file_name = 'ocf_contributions.csv'
output_dir = '../json'
ocf_retrieval_time = time.ctime(os.path.getctime(os.path.join(input_dir, input_file_name)))


def read_in_contributions(input_dir, input_file_name):
  file_path = os.path.join(input_dir, input_file_name)
  df = pd.read_csv(file_path)
  df['Amount'] = df['Amount']
  df = df[df['Election Year'] > 2009]
  df['Election Year'] = df['Election Year'].astype('int16')
  return df

df = read_in_contributions(input_dir, input_file_name)

df['donor type'] = 'other'

# mark wich donors are grassroots
df.ix[((df['state'] ==  'DC') &
  (df['Contributor Type'] == 'Individual')),
      ['donor type']] = 'grassroots'

# mark wich donors are corporate.  note that changes some LLCs and LLPs that are initally misidentified as grassroots.
df.ix[((df['Contributor'].str.contains('LLP')) |
  (df['Contributor'].str.contains('LLC')) |
  (df['Contributor Type'].str.contains('Business')) |
  (df['Contributor Type'].str.contains('Corp')) |
  (df['Contributor Type'].str.contains('Partnership'))) ,
  ['donor type']] = 'corporate'


ct = pd.crosstab(rows=[df['Election Year'],df['Office'],df['Candidate Name']], cols=[df['donor type']], margins=True)
ct.reset_index(inplace=True)
ct = ct[(ct["grassroots"] + ct["corporate"] + ct["other"] > 25)]

ct['ratio'] = ct.grassroots.map(str) + ':' + ct.corporate.map(str)
ct['metric'] = (ct['grassroots']/(ct['grassroots'] + ct['corporate'] )) - (ct['corporate']/(ct['grassroots'] + ct['corporate'] ))
ct['candidate'] = ct['Candidate Name'].map(str) + ' - ' + ct['Office'].map(str) + ' (' + ct['Election Year'].map(str) + ')'
sortall = ct.sort(['metric', 'grassroots', 'corporate'], ascending=[0, 0, 1])
sortall.reset_index(inplace=True)
sortall['rank'] =  list(range(1,len(sortall)+1))
sortall['rank'] = sortall['rank'].map(str)

sortthisyear = ct[ct['Election Year']==2014].sort(['metric', 'grassroots', 'corporate'], ascending=[0, 0, 1])
sortthisyear.reset_index(inplace=True)
sortthisyear['rank'] = list(range(1,len(sortthisyear)+1))
sortthisyear['rank'] = sortthisyear['rank'].map(str)


output_file_name = 'money-ranking-this-year.json'
sortthisyear[['rank',
         'candidate',
         'ratio'
         ]].to_json(os.path.join(output_dir, output_file_name), orient='split')

print(sortall[['rank', 'candidate', 'ratio']])