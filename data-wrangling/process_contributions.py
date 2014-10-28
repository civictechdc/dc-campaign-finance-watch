#!user/bin/python
import csv
from business_record import get_business_record, save_business_record
import data_util

path = '../csv/ocp_contributions.csv'

ocf_contributions_field_name = ['committee_name','candidate_name','contributor','address','city','state','zip','contributor_type','contribution_type','employer_name','employer_address','amount','date_of_receipt','office','election_year']

def process_contributions():
    rows = csv.DictReader(open(path, fieldnames=ocf_contributions_field_name)
    next(rows)
        for row in rows:
            if row['contribution_type'] == 'Individual':
                business_record = process_individual_record(row)
                if row['contributor'] not in business_record:
                    business_record['employees'].append(row['contributor'])
                    business_record['contributions'].append(create_contribution_sub_doc(row))
                    save_business_record(business_record)
            else:
                business_record = process_corporate_record(row)
                business_record['contributions'].append(create_contribution_sub_doc(row))
                save_business_record(business_record)


def process_corporate_record(row):
        clean_name = data_util.get_clean_name(row['contributor'])
        trading_as = data_util.get_trading_as(row['contributor'])
        acronym = data_util.get_acronym(row['contributor'])

        business_record = get_business_record(row['contributor'], clean_name, trading_as, acronym)
        return business_record


def process_individual_record_employer(row):
    if row['employer_name'] and row['employer_name'] != 'None' and row['employer_name'] != '':
        clean_name = data_util.get_clean_name(row['employer_name'])
        trading_as = data_util.get_trading_as(row['employer_name'])
        acronym = data_util.get_acronym(row['employer_name'])

        business_record = get_business_record(row['employer_name'], clean_name, trading_as, acronym)
        
        return business_record

def create_contribution_sub_doc(row):
    contribution = {}
    contribution['amount'] = row['amount']
    contribution['candidate'] = row['candidate_name']
    contribution['committee_name'] = row['committee_name']
    contribution['date'] = data_util.extract_dates(row['date_of_receipt'])
    contribution['election_year'] = row['election_year']
    contribution['office'] = row['office']
    return contribution
                
