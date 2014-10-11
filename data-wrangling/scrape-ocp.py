#!/usr/bin/env python3
# Scrape contract award data

import os
import mechanicalsoup
from bs4 import BeautifulSoup
import tablib

def _text(t):
    """Extract cleaned-up text from the given tag."""
    content = t.text
    cleaned_content = content.replace("\r", '').replace("\n", '').strip()
    return cleaned_content

BASEURL = 'http://app.ocp.dc.gov/RUI/information/award'

# load the data from the ocp site
b = mechanicalsoup.Browser()
res0 = b.get(BASEURL + '/search.asp')  # initialize search session
res1 = b.post(BASEURL + '/search_results.asp')  # fake a search
res2 = b.get(BASEURL + '/search_results_excel.asp')  # download
print("Loaded data")

# clean and soupify
print('cleaning...')
content = res2.text
content = content.replace("\r", '').replace("\n", '').strip()
content = content.replace('</font>', '')  # for some reason this kills beautiful soup
soup = BeautifulSoup(content)
print('soup!')

# grab headers
data = tablib.Dataset()
data_table = soup.find('table').find('table')
header_row = data_table.find('tr')
print(header_row)
headers = [_text(x) for x in header_row.find_all('td')]
data.headers = headers
print("Set headers:", headers)

# add data one row at a time
data_rows = header_row.find_all_next('tr')
for row in data_rows:
    cleaned_row = [_text(x) for x in row.find_all('td')]
    data.append(cleaned_row)

# save to csv file
input_dir = '../csv'
if not os.path.exists(input_dir):
    os.makedirs(input_dir)
filename = os.path.join(input_dir, 'ocp_awards.csv')
with open(filename, 'wb') as f:
    f.write(bytes(data.csv, 'UTF-8'))
print('data written!')
