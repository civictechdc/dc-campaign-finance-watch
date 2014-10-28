#!user/bin/python
import config
from pymongo import MongoClient

client = MongoClient('mongodb://'+config.MONGOLAB_USER+':'+config.MONGOLAB_PW+'@ds041380.mongolab.com:41380/dc-campaign-finance').get_default_database()

def get_collection(collection):
    return client[collection]
