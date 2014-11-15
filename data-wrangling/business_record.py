#!user/bin/python
import campaign_mongo_client

business_collection = campaign_mongo_client.get_collection("businesses")

def get_business_record(original_name='', clean_name='', acronym='', trading_as=''):
    business_records = business_collection.find({"$or":[{"name.original_name":original_name},{"name.clean_name":clean_name}, {"name.trading_as":trading_as}, {"name.acronym":acronym}]})

    business_record = business_collection.find_one({"name.clean_name":clean_name})
    if not business_record:
        business_record = business_collection.find_one({"name.original_name":original_name})


    if not  business_record:
        record = {}
        
        # create the name sub-doc
        name = {}
        name["original_name"] = [original_name]
        name["clean_name"] = clean_name
        name["trading_as"] = [trading_as]
        name["acronym"] = [acronym]
        record["name"] = name

        #create all other fields
        record["awards"] = []
        record["contributions"] = []
        record["employees"] = []
        return record
    else:
        if original_name not in business_record["name"]["original_name"]:
            business_record["name"]["original_name"].append(original_name)
        if acronym not in business_record["name"]["acronym"]:
            business_record["name"]["acronym"].append(acronym)
        if trading_as not in business_record["name"]["trading_as"]:
            business_record["name"]["trading_as"].append(trading_as)

        return business_record

def save_business_record(business_record):
    business_collection.save(business_record, business_record)
