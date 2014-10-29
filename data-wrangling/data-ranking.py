
'''
CREATE RANKING DATA
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

df['donors'] = 1
# see who's being naughty
df['complete data'] = 0
df['complete data'] = (pd.notnull(df['Employer Name']) &
                       pd.notnull(df['Employer Address']) |
                       df['Employer Address'].str.contains('''N/A''') |
                       df['Employer Address'].str.contains('none') |
                       df['Employer Address'].str.contains('unemployed') |
                       df['Employer Address'].str.contains('self') |
                       df['Employer Address'].str.contains('Self') |
                       df['Employer Name'].str.contains('''N/A''') |
                       df['Employer Name'].str.contains('none') |
                       df['Employer Name'].str.contains('unemployed') |
                       df['Employer Name'].str.contains('self') |
                       df['Employer Name'].str.contains('Self'))

df['required data'] = (pd.notnull(df['Employer Name']) |
                       df['Employer Name'].str.contains('''N/A''') |
                       df['Employer Name'].str.contains('none') |
                       df['Employer Name'].str.contains('unemployed') |
                       df['Employer Name'].str.contains('self') |
                       df['Employer Name'].str.contains('Self'))


subset = df[['Election Year', 'Office', 'Candidate Name', 'complete data', 'required data', 'donors']]
grouped = subset.groupby(['Election Year', 'Office', 'Candidate Name']).agg({'complete data' : np.mean, 'required data' : np.mean, 'donors' : np.sum }).reset_index()

sorted = grouped.sort('complete data', ascending=False)
sc = sorted[(sorted['Election Year'] > 2013) & (sorted['donors'] > 25)].reset_index()
sc['percent data complete'] = sc['complete data'] * 100
sc['padc'] = np.where(sc['percent data complete']<9.5, ' ', '')
sc['percent data complete'] = sc['percent data complete'].round(0).map(int).map(str) + '%'
sc['percent data complete'] = sc['padc'] + sc['percent data complete']

sc['percent data required'] = sc['required data'] * 100
sc['padr'] = np.where(sc['percent data required']<9.5, ' ', '')
sc['percent data required'] = sc['percent data required'].round(0).map(int).map(str) + '%'
sc['percent data required'] = sc['padr'] + sc['percent data required']

sc['candidate'] = sc['Candidate Name'].map(str) + ' ' + sc['Office'].map(str) + ' (' + sc['Election Year'].map(str) + ')'
sc['rank'] =  list(range(1,len(sc)+1))
sc['rank'] = sc['rank'].map(str)
output_file_name = 'data-ranking-this-year.json'
sc[['rank',
    'candidate',
    'donors',
    'percent data required',
    'percent data complete'
    ]].to_json(os.path.join(output_dir, output_file_name), orient='split')

sc[['rank',
    'candidate',
    'donors',
    'percent data required',
    'percent data complete']]

