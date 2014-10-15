#!/usr/bin/env python3

'''
CLEAN AND WRAGLE DATA INTO JSON
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

c = read_in_contributions(input_dir, input_file_name)

# mark all donors as 'other', to be changed by the grassroots and corporate definitions that follow.  What would Derrida say?
c['donor_type'] = 'other'

# mark wich donors are grassroots
c.ix[((c['state'] ==  'DC') &
  (c['Contributor Type'] == 'Individual')),
  ['donor_type']] = 'grassroots'

# mark wich donors are corporate.  note that changes some LLCs and LLPs that are initally misidentified as grassroots.
c.ix[((c['Contributor'].str.contains('LLP')) |
  (c['Contributor'].str.contains('LLC')) |
  (c['Contributor Type'].str.contains('Business')) |
  (c['Contributor Type'].str.contains('Corp')) |
  (c['Contributor Type'].str.contains('Partnership'))) ,
  ['donor_type']] = 'corporate'

#  GENERATE A LIST OF YEARS AND OFFICES FOR MENUS & GRAPH ITERATION

def clean_and_save(data_to_save, output_dir, file_name):
  data_to_save = ' '.join(data_to_save.split())
  data_to_save = data_to_save.replace(',,', ',').replace(',]', ']').replace(',}', '}')
  if not os.path.exists(output_dir):
      os.makedirs(output_dir)
  full_file_name = os.path.join(output_dir, file_name)
  json_data = simplejson.dumps(simplejson.loads(data_to_save), indent=4, sort_keys=False).replace(',,', ',').replace(',]', ']').replace(',}', '}')
  with open(full_file_name, 'w') as f:
      f.write(json_data)
  f.close()

# NOW WE NEED A LIST OF THE YEARS AND OFFICES TO CYCLE THROUGH
def generate_yo_list(c, input_dir, file_name):
  yo = c[['Election Year', 'Office']]
  yo = yo.drop_duplicates()
  yo = yo.reset_index()
  yo = pd.DataFrame(yo[['Election Year', 'Office']]).sort(['Election Year', 'Office'],ascending=[0,1])
  oo = pd.read_csv(os.path.join(input_dir, file_name))
  yo = pd.merge(yo, oo, how='left', left_on='Office', right_on='Office')
  yo = yo.sort(columns=['Election Year','Order'], ascending=[0,1])
  return yo
yo = generate_yo_list(c, input_dir, 'office_order.csv')
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


def assemble_json(year, office, title, subtitle, notesa, notesb, data, height, options):
  out_data = '{"year": "' + str(year) + \
          '", "office": "' +  office + \
          '", "title": "' +  title + \
          '", "subtitle": "' +  subtitle + \
          '", "notesa": "' +  notesa + \
          '", "notesb": "' +  notesb + \
          '", "height": "' +  str(height) + \
          '", "data": ' + data + \
          ', "options": ' + options + '}'
  return out_data

def generate_grcont_json(df, year, office):
  title = str(office) + ' (' + str(year) + '): Grassroots'
  subtitle = '(Number of DC Residents Contributing)'
  notesa = 'Data retrieved from OCF: ' + str(ocf_retrieval_time)
  notesb = 'Sorted by grassroots contributions and then, for same value results, by corporate contributions'
  options = '{"legend": "none"}'
  myct = pd.crosstab(rows=[df['Election Year'],df['Office'],df['Candidate Name']], cols=[df['donor_type']], margins=True)
  try:
    gr = myct.xs((year, office), level=('Election Year', 'Office')).sort(['grassroots','corporate'], ascending = [0,1])
    data = '[["Candidate", "Grassroots Contributors"],' +  gr['grassroots'].to_json(orient = 'columns').replace('{','[').replace('}',']').replace(',','],[').replace(':',',') + ']'
    height = (len(gr) * 30) + 40
  except:
    try:
      gr = myct.xs((year, office), level=('Election Year', 'Office')).sort(['grassroots'], ascending = 0)
      data = '[["Candidate", "Grassroots Contributors"],' +  gr['grassroots'].to_json(orient = 'columns').replace('{','[').replace('}',']').replace(',','],[').replace(':',',') + ']'
      height = (len(gr) * 30) + 40
    except:
      data = '[[]]'
      height = 1
  gjd = assemble_json(year, office, title, subtitle, notesa, notesb, data, height, options)
  return gjd

def generate_cocont_json(df, year, office):
  title = str(office) + ' (' + str(year) + '): Corporate'
  subtitle = '(Number of Corporations, Businesses, LLCs, LLPs, and related PACs Contributing)'
  notesa = 'Data retrieved from OCF: ' + str(ocf_retrieval_time)
  notesb = 'Sorted by corporate contributions and then, for same value results, by grassrotts contributions'
  options = '{"legend": "none"}'
  myct = pd.crosstab(rows=[df['Election Year'],df['Office'],df['Candidate Name']], cols=[df['donor_type']], margins=True)
  try:
    corp = myct.xs((year, office), level=('Election Year', 'Office')).sort(['corporate','grassroots'], ascending = [1,0])
    data = '[["Candidate", "Corporate Contributors"],' + corp['corporate'].to_json(orient = 'columns').replace('{','[').replace('}',']').replace(',','],[').replace(':',',') + ']'
    height = (len(corp) * 30) + 40
  except:
    try:
      corp = myct.xs((year, office), level=('Election Year', 'Office')).sort(['corporate'], ascending = 1)
      data = '[["Candidate", "Corporate Contributors"],' + corp['corporate'].to_json(orient = 'columns').replace('{','[').replace('}',']').replace(',','],[').replace(':',',') + ']'
      height = (len(corp) * 30) + 40
    except:
      data = '[[]]'
      height = '1'
  cjd = assemble_json(year, office, title, subtitle, notesa, notesb, data, height, options)
  return cjd


json_out = ''
for rownum in range(0, len(yo.index)):
  year = yo.iloc[rownum, 0]
  office = yo.iloc[rownum, 1]
  idjson = '"officeyearid": "'+ office.replace(' ', '-') + '-' + str(year) + '"'
  dyo_data = c[(c['Election Year'] ==  year) & (c['Office'] ==  office)].reset_index()
  gcont = generate_grcont_json(dyo_data, year, office)
  ccont = generate_cocont_json(dyo_data, year, office)
  graphsjson = ''
  if len(gcont) > 0: graphsjson = graphsjson + gcont
  if (len(graphsjson) > 0) & (len(ccont)>0): graphsjson =  graphsjson + ',' + ccont
  # if (len(graphsjson) > 0) & (len(gdollars)>0): graphsjson = graphsjson + ',' + gdollars
  # if (len(graphsjson) > 0) & (len(cdollars)>0): graphsjson = graphsjson + ',' + cdollars
  graphsjson = '"officeyeardata": [' + graphsjson + ']'
  json_out = json_out + '{' + idjson + ',' + graphsjson + '},'

json_out = '[' + json_out + ']'
clean_and_save(json_out, output_dir, 'graphing-data.json')

