FROM  mongo:3.0.7

COPY dc-campaign-finance-mongodatabase.zip .

# update packages and intall unzip
# unzip db .bson files to root dir
RUN apt-get update \
    && apt-get install unzip \
    && unzip dc-campaign-finance-mongodatabase.zip -d . \
    && apt-get remove --purge -y unzip \
    && rm -rf /var/lib/apt/list/*

# restore mongodb using docker compose name
CMD ["mongorestore", "--host", "mongodb", "-d", "dc-campaign-finance", "--drop", "./dc-campaign-finance-mongodatabase/dc-campaign-finance"]
