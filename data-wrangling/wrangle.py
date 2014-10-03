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

def readincontributions(input_dir, filename):
  filename = os.path.join(input_dir, filename)
  data = pd.read_csv(filename)
  data['Amount'] = data['Amount'].str.replace(',', '').str.replace('$', '').str.replace('(', '').str.replace(')', '').astype('float')
  data = data[data['Election Year'] > 2009]
  data['Election Year'] = data['Election Year'].astype('int16')
  return data
contributions = readincontributions(input_dir, 'ocf_contributions.csv')


#  GENERATE A LIST OF YEARS AND OFFICES FOR MENUS & GRAPH ITERATION

def cleanAndSave(datatosave, output_dir, filename): 
  datatosave = datatosave.replace('\n', '').replace('\r', '')
  if not os.path.exists(output_dir):
      os.makedirs(output_dir)
  full_filename = os.path.join(output_dir, filename)
  with open(full_filename, 'w') as f:
      f.write(simplejson.dumps(simplejson.loads(datatosave), indent=4, sort_keys=True))
  f.close()

def generateYOlist(contributions, input_dir, oo_filename): 
  yo = contributions[['Election Year', 'Office']]
  yo = yo.drop_duplicates()
  yo = yo.reset_index()
  yo = pd.DataFrame(yo[['Election Year', 'Office']]).sort(['Election Year', 'Office'],ascending=[0,1])
  filename = os.path.join(input_dir, oo_filename)
  oo = pd.read_csv(filename)
  yo = pd.merge(yo, oo, how='left', left_on='Office', right_on='Office')
  yo = yo.sort(columns=['Election Year','Order'], ascending=[0,1])
  return yo

def generateYOjson(yo, years): 
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

yo = generateYOlist(contributions, input_dir, 'office_order.csv')
years = yo['Election Year'].drop_duplicates()
yojson = generateYOjson(yo, years)
cleanAndSave(yojson, output_dir, 'years and offices.json')




# json files for grassroot contributor count graphs
nested = '['
for rownum in range(0, len(yo.index)):
    year = yo.iloc[rownum, 0]
    office = yo.iloc[rownum, 1]
    data = contributions[contributions['Election Year'] ==  year]
    data = data[(data['Office'] ==  office) & (data['state'] ==  'DC') & (data['Contributor Type'] == 'Individual')]
    data['unique'] = data['Contributor'] + data['Address']
    data = data[['Candidate Name', 'unique']].drop_duplicates()
    data['DC Donors'] = 1
    data = data.groupby(['Candidate Name']).sum()
    data = data.sort(['DC Donors'],ascending=False).reset_index()
    data = data[['Candidate Name', 'DC Donors']]
    cols = '[{"label": "Candidate", "type": "string"},{"label": "Grass root Contributors", "type": "number"}]'
    htitle = 'Grassroot Contributors (DC Residents)'
    rows = '['
    for rnum in range(0, len(data.index)):
        rows = rows + '''
            ["''' + data['Candidate Name'][rnum] + '", ' + str(data['DC Donors'][rnum]) + ']'
        if rnum + 1 < len(data.index): rows = rows + ','
    rows = rows + ']'
    title = str(office) + ' (' + str(year) + ')'
    options = '{  "title": "' + title + '",  "hAxis": {"title": "' + htitle +'"}, "legend": "none"}'
    graphjson = '{"year": "'+ str(year) + '", "title": "' +  title + '", "cols": ' + cols + ', "rows": ' + rows + ', "options": ' + options + '}'
    graphjson = graphjson.replace("'", '"')
    if len(rows) > 3:
        nested = nested + graphjson
        if rownum < len(yo.index)-1:
            nested = nested + ','
nested = nested + ']'
nested = nested.replace('\n', '').replace('\r', '').replace('},]', '}]')
cleanAndSave(nested, output_dir, 'grassroot-donors.json')


# json files for grassroot  amount graphs
nested = '['
for rownum in range(0, len(yo.index)):
    year = yo.iloc[rownum, 0]
    office = yo.iloc[rownum, 1]
    data = contributions[contributions['Election Year'] ==  year]
    data = data[(data['Office'] ==  office) & (data['state'] ==  'DC') & (data['Contributor Type'] == 'Individual')]
    data = data.groupby(['Candidate Name']).sum()
    data = data.sort(['Amount'],ascending=False).reset_index()
    data = data[['Candidate Name', 'Amount']]
    cols = '[{"label": "Candidate", "type": "string"},{"label": "Grass root Dolars", "type": "number"}]'

    rows = '['
    for rnum in range(0, len(data.index)):
        rows = rows + '["' + data['Candidate Name'][rnum] + '", ' + str(data['Amount'][rnum]) + ']'
        if rnum + 1 < len(data.index): rows = rows + ','
    rows = rows + ']'
    title = str(office) + ' (' + str(year) + ')'
    options = '{  "title": "' + title + '",  "hAxis": {"title": "Grassroot Dollars (From DC Residents)"}, "legend": "none"}'
    graphjson = '{"year": "'+ str(year) + '", "title": "' +  title + '", "cols": ' + cols + ', "rows": ' + rows + ', "options": ' + options + '}'
    graphjson = graphjson.replace("'", '"')
    if len(rows) > 2:
        nested = nested + graphjson
        if rownum < len(yo.index)-1:
            nested = nested + ','
nested = nested + ']'
cleanAndSave(nested, output_dir, 'grassroot-dollars.json')




# json files for corporate contributor count graphs
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
nested = '['
for rownum in range(0, len(yo.index)):
    year = yo.iloc[rownum, 0]
    office = yo.iloc[rownum, 1]
    data = contributions[contributions['Election Year'] ==  year]
    data = data[(data['Office'] ==  office) & (data['state'] ==  'DC')]
    data = data[( (data['Contributor'].str.contains('LLP')) | (data['Contributor'].str.contains('LLC')) | (data['Contributor Type'].str.contains('Business')) | (data['Contributor Type'].str.contains('Corp')) | (data['Contributor Type'].str.contains('Partnership')) )]
    data['unique'] = data['Contributor'] + data['Address']
    data = data[['Candidate Name', 'unique']].drop_duplicates()
    data['Corp Donors'] = 1
    data = data.groupby(['Candidate Name']).sum()
    data = data.sort(['Corp Donors'],ascending=False).reset_index()
    data = data[['Candidate Name', 'Corp Donors']]
    cols = '[{"label": "Candidate", "type": "string"},{"label": "Corporate Contributors", "type": "number"}]'
    rows = '['
    for rnum in range(0, len(data.index)):
        rows = rows + '["' + data['Candidate Name'][rnum] + '", ' + str(data['Corp Donors'][rnum]) + ']'
        if rnum + 1 < len(data.index): rows = rows + ','
    rows = rows + ']'
    title = str(office) + ' (' + str(year) + ')'
    options = '{  "title": "' + title + '",  "hAxis": {"title": "Corporate Contributors"}, "legend": "none"}'
    graphjson = '{"year": "'+ str(year) + '", "title": "' +  title + '", "cols": ' + cols + ', "rows": ' + rows + ', "options": ' + options + '}'
    graphjson = graphjson.replace("'", '"')
    if len(rows) > 3:
        nested = nested + graphjson
        if rownum +1 < len(yo.index):
            nested = nested + ','
nested = nested + ']'
cleanAndSave(nested, output_dir, 'corporate-donors.json')



# json files for corporate contributor count graphs
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
nested = '['
for rownum in range(0, len(yo.index)):
    year = yo.iloc[rownum, 0]
    office = yo.iloc[rownum, 1]
    data = contributions[contributions['Election Year'] ==  year]
    data = data[(data['Office'] ==  office) & (data['state'] ==  'DC')]
    data = data[( (data['Contributor'].str.contains('LLP')) | (data['Contributor'].str.contains('LLC')) | (data['Contributor Type'].str.contains('Business')) | (data['Contributor Type'].str.contains('Corp')) | (data['Contributor Type'].str.contains('Partnership')) )]
    data = data.groupby(['Candidate Name']).sum()
    data = data.sort(['Amount'],ascending=False).reset_index()
    data = data[['Candidate Name', 'Amount']]
    cols = '[{"label": "Candidate", "type": "string"},{"label": "Corporate Dollars", "type": "number"}]'
    rows = '['
    for rnum in range(0, len(data.index)):
        rows = rows + '["' + data['Candidate Name'][rnum] + '", ' + str(data['Amount'][rnum]) + ']'
        if rnum + 1 < len(data.index): rows = rows + ','
    rows = rows + ']'
    title = str(office) + ' (' + str(year) + ')'
    options = '{  "title": "' + title + '",  "hAxis": {"title": "Corporate Dollars"}, "legend": "none"}'
    graphjson = '{"year": "'+ str(year) + '", "title": "' +  title + '", "cols": ' + cols + ', "rows": ' + rows + ', "options": ' + options + '}'
    graphjson = graphjson.replace("'", '"')
    if len(rows) > 3:
        nested = nested + graphjson
        if rownum +1 < len(yo.index):
            nested = nested + ','
nested = nested + ']'
cleanAndSave(nested, output_dir, 'corporate-dollars.json')

