#!user/bin/python
import csv
import data_util
from business_record import get_business_record

path = '../csv/ocp_awards.csv'

ocp_awards_field_names = ['agency','contract_number','caption','amount','base_contract_period','multi_year','option_yrs_remaining','market_type','nfp','lsdbe','vendor_name']

def process_awards():
    rows = csv.DictReader(open(path), fieldnames=ocp_awards_field_names)
    next(rows)
    for row in rows:
        clean_name = data_util.get_clean_name(row['vendor_name'])
        trading_as = data_util.get_trading_as(row['vendor_name'])
        acronym = data_util.get_acronym(row['vendor_name'])

        business_record = get_business_record(row['vendor_name'], clean_name, trading_as, acronym)
        business_record['awards'].append(create_award_sub_doc(row))

def create_award_sub_doc(csv_row):
    award = {}
    award['contract_period'] = data_util.extract_dates(csv_row(base_contract_period))
    award['description'] = csv_row['caption']
    award['contract_number'] = csv_row['contract_number']
    award['nfp'] = csv_row['nfp']
    try:
        award['amount'] = float(csv_row['amount'])
    except:
        award['amount'] = float(0)
    return award



