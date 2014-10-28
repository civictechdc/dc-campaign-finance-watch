#!user/bin/python
import campaign_mongo_client

business_collection = campaign_mongo_client.get_collection("businesses")

def get_business_record(original_name, clean_name, acronym, trading_as):
        business_records = business_collection.find({"$or":[{"name.original_name":orginal_name},{"name.clean_name":clean_name}, {"name.trading_as":trading_as}, {"name.acronym":acronym}]})
    if len(business_records) > 1:
        print "possible duplicate entries for " + clean_name
        return None
    elif:
        print "new business discovered :" + clean_name + " adding a record"
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
        record = business_records[0]
        if original_name not in record["name"]["original_name"]:
            record["name"]["original_name"].append(original_name)
        if acronym not in record["name"]["acronym"]:
            record["name"]["acronym"].append(acronym)
        if trading_as not in record["name"]["trading_as"]:
            record["name"]["trading_as"].append(trading_as)

        return record

