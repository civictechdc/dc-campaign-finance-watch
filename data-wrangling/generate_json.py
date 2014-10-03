#!/usr/bin/env python3

'''
CLEAN AND WRAGLE DATA INTO JSON
'''

import os
import io
import pandas as pd
import numpy as np
import simplejson

# READ IN CONTRIBUTIONS CSV FILE AND CLEAN IT UP A BIT

input_dir = '../csv'
output_dir = '../json'

def read_in_contributions(input_dir, file_name):
  file_name = os.path.join(input_dir, file_name)
  data = pd.read_csv(file_name)
  data['Amount'] = data['Amount'].str.replace(',', '').str.replace('$', '').str.replace('(', '').str.replace(')', '').astype('float')
  data = data[data['Election Year'] > 2009]
  data['Election Year'] = data['Election Year'].astype('int16')
  return data

contributions = read_in_contributions(input_dir, 'ocf_contributions.csv')

#  GENERATE A LIST OF YEARS AND OFFICES FOR MENUS & GRAPH ITERATION

def clean_and_save(data_to_save, output_dir, file_name):
  data_to_save = data_to_save.replace('\n', '').replace('\r', '').replace('},]', '}]').replace('},}', '}}')
  if not os.path.exists(output_dir):
      os.makedirs(output_dir)
  full_file_name = os.path.join(output_dir, file_name)
  with open(full_file_name, 'w') as f:
      f.write(simplejson.dumps(simplejson.loads(data_to_save), indent=4, sort_keys=True))
  f.close()

def generate_yo_list(contributions, input_dir, file_name):
  yo = contributions[['Election Year', 'Office']]
  yo = yo.drop_duplicates()
  yo = yo.reset_index()
  yo = pd.DataFrame(yo[['Election Year', 'Office']]).sort(['Election Year', 'Office'],ascending=[0,1])
  oo = pd.read_csv(os.path.join(input_dir, file_name))
  yo = pd.merge(yo, oo, how='left', left_on='Office', right_on='Office')
  yo = yo.sort(columns=['Election Year','Order'], ascending=[0,1])
  return yo

def generate_yo_json(yo, years):
  yojson = '['
  for yearnum in range(0, len(years.index)):
      year = years.iloc[yearnum]
      yojson = yojson + '{"year": "'+ str(year) + '", "offices": ['
      oneyear = yo[yo['Election Year'] ==  year]
      offices = oneyear['Office']
      for officenum in range(0, len(offices.index)):
          office = offices.iloc[officenum]
          yojson = yojson + '"' + office + '"'
          if officenum < len(offices.index)-1:
              yojson = yojson + ','
      yojson = yojson + ']}'
      if yearnum < len(years.index)-1:
          yojson = yojson + ','
  yojson = yojson + ']'
  return yojson

yo = generate_yo_list(contributions, input_dir, 'office_order.csv')
years = yo['Election Year'].drop_duplicates()
yojson = generate_yo_json(yo, years)
clean_and_save(yojson, output_dir, 'years and offices.json')


def generate_donors_json(c, yo, title, htitle):
  c['unique'] = c['Contributor'] + c['Address']
  c = c[['Election Year', 'Office', 'Candidate Name', 'unique']].drop_duplicates()
  c['donors'] = 1
  c = c.groupby(['Election Year', 'Office', 'Candidate Name']).sum()
  c = c.sort(['donors'],ascending=False).reset_index()
  c = c[['Election Year', 'Office', 'Candidate Name', 'donors']]
  donor_json = '{'
  for rownum in range(0, len(yo.index)):
    year = yo.iloc[rownum, 0]
    office = yo.iloc[rownum, 1]
    data = c[(c['Election Year'] ==  year) & (c['Office'] ==  office)].reset_index()
    id_json = '"' + office + ' (' + str(year) + ')": '
    cols = '[{"label": "Candidate", "type": "string"},{"label": "Grass Root Contributors", "type": "number"}]'
    rows = '['
    if len(data.index) > 0:
      for rnum in range(0, len(data.index)):
        rows = rows + '["' + data['Candidate Name'][rnum] + '", ' + str(data['donors'][rnum]) + ']'
        if rnum + 1 < len(data.index): rows = rows + ','
      rows = rows + ']'
      title = str(office) + ' (' + str(year) + ')'
      options = '{  "title": "' + title + '",  "hAxis": {"title": "' + htitle +'"}, "legend": "none"}'
      graphjson = '{"year": "'+ str(year) + '", "title": "' +  title + '", "cols": ' + cols + ', "rows": ' + rows + ', "options": ' + options + '}'
      graphjson = graphjson.replace("'", '"')
      if len(rows) > 3:
        donor_json = donor_json + id_json + graphjson
        if rownum < len(yo.index)-1:
          donor_json = donor_json + ','
  donor_json = donor_json + '}'
  return donor_json

c = contributions
c = c[(c['state'] ==  'DC') & (c['Contributor Type'] == 'Individual')]
title = 'Grass Root Contributors'
htitle = 'Grassroot Contributors (DC Residents)'
grd = generate_donors_json(c, yo, title, htitle)
clean_and_save(grd, output_dir, 'gr-donors.json')

