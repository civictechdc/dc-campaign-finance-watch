#!user/bin/python
import datetime

business_name_endings = ['corporation', 'llp', 'in', 'llc', 'inc', 'lp', 'llc', 'ins', 'pc', 'co', 'corp', 'company', 'i', 'comp', 'unlimited',  'dds', 'ca', 'associates', 'assoc', 'op', 'ltd', 'esq', 'charted', 'inst', 'institution', 'indust', 'industrial', 'blv', 'md',  'pllc', 'phd', 'psy d', 'srv', 'svcs', 'institute', 'services', 'ser', 'servi', 'll', 'svc', 'pa', 'sa', 've', 'cpapc', 'incorporated', 'prod', 'ed', 'solut', 'solutions', 'productions', 'systems', 'chartered', 'industries']

def extract_dates(date_string):
    date_split = date_string.split('-')
    if len(date_split) == 2:
        date = {}
        start_date =  date_split[0].strip()
        end_date = date_split[1].strip()
        date['start'] = __parse_date(date_split[0].strip())
        date['end'] = __parse_date(date_split[1].strip())
    elif len(date_split) == 1:
        date = __parse_date(date_split[0].strip())
    else:
        print 'error with this date'
        date = ''

    return date

def __parse_date(date_string):
    try:
        date_object = datetime.datetime.strptime(date_string, '%m/%d/%Y')
    except:
        try:
            date_object = datetime.datetime.strptime(date_string, '%m/%d/%Y %I:%M:%S') 
        except:
            date_object = ""
    return date_object
    
def get_clean_name(name):
    name = name.strip()
    name = __remove_punctuation_characters(name)
    name = __remove_business_endings(name)
    name.replace(' dba ', '')
    name.replace(' ta ', '')
    name.replace(' formerly ', '')
    return name

#TODO: handle cases where there are multiple of theses
def get_trading_as(name):
    trading_as = None
    dba_split = name.split(' dba ')
    if len(dba_split) == 2:
        aka = dba_split[1]
    
    ta_split = name.split(' ta ')
    if len(ta_split) == 2:
        aka = ta_split[1]

    formerly_split = name.split(' formerly ')
    if len(formerly_split) == 2:
        aka = formerly_split[1]
        
    return trading_as



def get_acronym(name):
    acronym = None
    acronym_split = name.split('(')
    if len(acronym_split) == 2:
        acronym = acronym_split[1].replace(')', '')
    return  acronym

def __remove_punctuation_characters(name): 
    name = name.translate(None, '()[]{}.!;:,?\'\"')
    name = name.lower()
    return name

def __remove_business_endings(name):
    cleaned_of_endings = ''
    words = name.split(' ')
    
    for word in words:
        if not word in business_name_endings:
            cleaned_of_endings +=  (' ' + word)
    return cleaned_of_endings
    
