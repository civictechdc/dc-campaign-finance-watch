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
  # data = str(data_to_save) # Decode the bytes into a useful string
  data_to_save = ' '.join(data_to_save.split())
  data_to_save = data_to_save.replace(',]', ']').replace(',}', '}').replace(',,', ',')
  if not os.path.exists(output_dir):
      os.makedirs(output_dir)
  full_file_name = os.path.join(output_dir, file_name)
  with open(full_file_name, 'w') as f:
      f.write(simplejson.dumps(simplejson.loads(data_to_save), indent=4, sort_keys=True))
  f.close()

# NOW WE NEED A LIST OF THE YEARS AND OFFICES TO CYCLE THROUGH
def generate_yo_list(contributions, input_dir, file_name):
  yo = contributions[['Election Year', 'Office']]
  yo = yo.drop_duplicates()
  yo = yo.reset_index()
  yo = pd.DataFrame(yo[['Election Year', 'Office']]).sort(['Election Year', 'Office'],ascending=[0,1])
  oo = pd.read_csv(os.path.join(input_dir, file_name))
  yo = pd.merge(yo, oo, how='left', left_on='Office', right_on='Office')
  yo = yo.sort(columns=['Election Year','Order'], ascending=[0,1])
  return yo
yo = generate_yo_list(contributions, input_dir, 'office_order.csv')
years = yo['Election Year'].drop_duplicates()  # ALSO, A LIST OF YEARS IS USEFUL

# FOR THE YEAR & OFFICE MENU
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
yojson = generate_yo_json(yo, years)
clean_and_save(yojson, output_dir, 'years and offices.json')


def generate_donor_json(c, year, office, title, htitle):
  graphjson = ''
  c['unique'] = c['Contributor'] + c['Address']
  c = c[['Election Year', 'Office', 'Candidate Name', 'unique']].drop_duplicates()
  c['donors'] = 1
  c = c.groupby(['Election Year', 'Office', 'Candidate Name']).sum()
  c = c.sort(['donors'],ascending=False).reset_index()
  c = c[['Election Year', 'Office', 'Candidate Name', 'donors']]
  cols = '[{"label": "Candidate", "type": "string"},{"label": "' + title + '", "type": "number"}]'
  rows = '['
  if len(c.index) > 0:
    for rnum in range(0, len(c.index)):
      rows = rows + '["' + c['Candidate Name'][rnum] + '", ' + str(c['donors'][rnum]) + ']'
      if rnum + 1 < len(c.index): rows = rows + ','
    rows = rows + ']'
    title = str(office) + ' (' + str(year) + ')'
    options = '{"title": "' + title + '",  "hAxis": {"title": "' + htitle +'"}, "legend": "none"}'
    graphjson = '{"year": "'+ str(year) + '", "title": "' +  title + '", "cols": ' + cols + ', "rows": ' + rows + ', "options": ' + options + '}'
    graphjson = graphjson.replace("'", '"')
  return graphjson


def gr_dn_js(data, year, office):
  title = 'Grassroots Contributors'
  htitle = 'Grassroots Contributors (DC Residents)'
  data = data[(data['state'] ==  'DC') & (data['Contributor Type'] == 'Individual')]
  js = generate_donor_json(data, year, office, title, htitle)
  return js

def co_dn_js(data, year, office):
  title = 'Corporate Contributors'
  htitle = 'Corporate, Business, LLC, LLP, and related PAC Contributors'
  data = data[( (data['Contributor'].str.contains('LLP')) | (data['Contributor'].str.contains('LLC')) | (data['Contributor Type'].str.contains('Business')) | (data['Contributor Type'].str.contains('Corp')) | (data['Contributor Type'].str.contains('Partnership')) )]
  js = generate_donor_json(data, year, office, title, htitle)
  return js


def generate_dollars_json(c, year, office, title, htitle):
  graphjson = ''
  c = c[['Election Year', 'Office', 'Candidate Name', 'Amount']]
  c = c.groupby(['Election Year', 'Office', 'Candidate Name']).sum()
  c = c.sort(['Amount'],ascending=False).reset_index()
  c = c[['Election Year', 'Office', 'Candidate Name', 'Amount']]
  cols = '[{"label": "Candidate", "type": "string"},{"label": "' + title + '", "type": "number"}]'
  rows = '['
  if len(c.index) > 0:
    for rnum in range(0, len(c.index)):
      rows = rows + '["' + c['Candidate Name'][rnum] + '", ' + str(c['Amount'][rnum]) + ']'
      if rnum + 1 < len(c.index): rows = rows + ','
    rows = rows + ']'
    title = str(office) + ' (' + str(year) + ')'
    options = '{"title": "' + title + '",  "hAxis": {"title": "' + htitle +'"}, "legend": "none"}'
    graphjson = '{"year": "'+ str(year) + '", "title": "' +  title + '", "cols": ' + cols + ', "rows": ' + rows + ', "options": ' + options + '}'
    graphjson = graphjson.replace("'", '"')
  return graphjson


def gr_dl_js(data, year, office):
  title = 'Grassroots Dollars'
  htitle = 'Grassroots Dollars (From DC Residents)'
  data = data[(data['state'] ==  'DC') & (data['Contributor Type'] == 'Individual')]
  js = generate_dollars_json(data, year, office, title, htitle)
  return js

def co_dl_js(data, year, office):
  title = 'Corporate Dollars'
  htitle = 'Corporate Dollars (from Corporations, Businesses, LLCs, LLPs, and related PACs)'
  data = data[( (data['Contributor'].str.contains('LLP')) | (data['Contributor'].str.contains('LLC')) | (data['Contributor Type'].str.contains('Business')) | (data['Contributor Type'].str.contains('Corp')) | (data['Contributor Type'].str.contains('Partnership')) )]
  js = generate_dollars_json(data, year, office, title, htitle)
  return js


json_out = ''
for rownum in range(0, len(yo.index)):
  year = yo.iloc[rownum, 0]
  office = yo.iloc[rownum, 1]
  idjson = '"officeyearid": "'+ office.replace(' ', '-') + '-' + str(year) + '"'

  dyo_data = contributions[(contributions['Election Year'] ==  year) & (contributions['Office'] ==  office)].reset_index()
  gdonors = gr_dn_js(dyo_data, year, office).strip()
  cdonors = co_dn_js(dyo_data, year, office).strip()
  gdollars = gr_dl_js(dyo_data, year, office).strip()
  cdollars = co_dl_js(dyo_data, year, office).strip()
  graphsjson = ''
  if len(gdonors) > 0: graphsjson = graphsjson + gdonors
  if (len(graphsjson) > 0) & (len(cdonors)>0): graphsjson =  graphsjson + ',' + cdonors
  if (len(graphsjson) > 0) & (len(gdollars)>0): graphsjson = graphsjson + ',' + gdollars
  if (len(graphsjson) > 0) & (len(cdollars)>0): graphsjson = graphsjson + ',' + cdollars
  graphsjson = '"officeyeardata": [' + graphsjson + ']'
  json_out = json_out + '{' + idjson + ',' + graphsjson + '},'

json_out = '[' + json_out + ']'
clean_and_save(json_out, output_dir, 'graphing-data.json')




