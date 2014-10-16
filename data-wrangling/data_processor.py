#!user/bin/python
import config
import csv
import datetime
from pymongo import MongoClient

client = MongoClient('mongodb://'+config.MONGOLAB_USER+':'+config.MONGOLAB_PW+'@ds041380.mongolab.com:41380/dc-campaign-finance').get_default_database()

ocp_awards_field_names = ['agency','contract_number','caption','amount','base_contract_period','multi_year','option_yrs_remaining','market_type','nfp','lsdbe','vendor_name']

ocf_contributions_field_name = ['committee_name','candidate_name','contributor','address','city','state','zip','contributor_type','contribution_type','employer_name','employer_address','amount','date_of_receipt','office','election_year']

business_name_endings = ['corporation', 'llp', 'in', 'llc', 'inc', 'lp', 'llc', 'ins', 'pc', 'co', 'corp', 'company', 'i', 'comp', 'unlimited',  'dds', 'ca', 'associates', 'assoc', 'op', 'ltd', 'esq', 'charted', 'inst', 'institution', 'indust', 'industrial', 'blv', 'md',  'pllc', 'phd', 'psy d', 'srv', 'svcs', 'institute', 'services', 'ser', 'servi', 'll', 'svc', 'pa', 'sa', 've', 'cpapc', 'incorporated', 'prod', 'ed', 'solut', 'solutions', 'productions', 'systems', 'chartered', 'industries']

def remove_punctuation_characters(words):
    words = words.translate(None, '.!;:,?\'\"')
    words = words.lower()
    return words

def remove_business_endings(business_name):
    cleaned_of_endings = ''
    words = business_name.split(' ')
    
    for word in words:
        if not word in business_name_endings:
            cleaned_of_endings +=  (' ' + word)
    return cleaned_of_endings

def clean_name(business_name):   
    business_name.strip()
    return remove_business_endings(business_name)

def process_for_acronym(name):
    acronym = None
    acronym_split = name.split('(')
    name = acronym_split[0]
    if len(acronym_split) == 2:
        acronym = acronym_split[1].replace(')', '')
    return (name, acronym)

def process_for_aka(name):
    aka = None
    dba_split = name.split(' dba ')
    name = dba_split[0]
    if len(dba_split) == 2:
        aka = dba_split[1]
    
    ta_split = name.split(' ta ')
    name = ta_split[0]
    if len(ta_split) == 2:
        aka = ta_split[1]

    formerly_split = name.split(' formerly ')
    name = formerly_split[0]
    if len(formerly_split) == 2:
        aka = formerly_split[1]
        
    return (name, aka)

def process_business_name(name):
    name_record = {}
    name_record['original_name'] = name
    name = remove_punctuation_characters(name)
    name, acronym = process_for_acronym(name)
    if acronym:
        name_record['acronym'] = clean_name(acronym)
    name, aka = process_for_aka(name)
    if aka:
        name_record['aka'] = clean_name(aka)
    name_record['clean_name'] = clean_name(name)

    return name_record

def insert_record(doc):
    pass


def process_date(date):
    date_doc = {}
    date_split = date.split('-')
    if len(date_split) == 2:
        try:
            start_date =  date_split[0].strip()
            end_date = date_split[1].strip()
            date_doc['start'] = process_date_value(date_split[0].strip())
            date_doc['end'] = process_date_value(date_split[1].strip())
        except:
            print 'error'
            pass

    return date_doc

def process_date_value(date):
    try:
        date_object = datetime.datetime.strptime(date, '%m/%d/%Y')
    except:
        try:
            date_object = datetime.datetime.strptime(date, '%m/%d/%Y %I:%M:%S') 
        except:
            date_object = ""
    return date_object


def process_record(record):
    processed_record = {}
    processed_record['original_name'] = record['vendor_name']
    processed_record['clean_name'] = clean_name(record['vendor_name'])


def get_collection(collection_name):
    return client[collection_name]

def process_csv_file(file_name, fields):
    file = open(file_name)
    if file:
        list = csv.DictReader(open(file_name), fieldnames=fields)
        return list

def create_company_doc(csv_row):
    company_doc = {}
    company_doc['_id'] = create_company_name_sub_doc(csv_row)
    company_doc['awards'] = process_award(csv_row)
    company_doc['contributions'] = []

    return company_doc
    pass


if __name__ == '__main__':
    award_collection = get_collection('awards')
    records = process_csv_file('../csv/ocp_awards.csv', ocp_awards_field_names)
    next(records)
    for record in records:
        award = {}
        award['name'] = process_business_name(record['vendor_name'])
        try:
            award['amount'] = float(record['amount'])
        except:
            award['amount'] = 0
        award['date'] = process_date(record['base_contract_period'])
        award_collection.insert(award)
