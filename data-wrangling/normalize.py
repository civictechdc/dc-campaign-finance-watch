'''
This script will normalize the names and addresses.
It's likely to be a bit complex because there are many, many crazy errors.
Such is life with publc data.

There are several ways to go about this.  One is with a mapping API. E.g.:

http://opendata.stackexchange.com/questions/115/are-there-any-good-libraries-available-for-doing-normalization-of-company-names

https://opencorporates.com/companies/us_dc

http://brizzled.clapper.org/blog/2012/02/14/simple-address-standardization/

http://gis.stackexchange.com/questions/22339/open-source-address-correction-parser-with-fuzzy-matching

http://stackoverflow.com/questions/4835318/normalize-data-according-to-business-entity-legal-name-class-of-business-dns

My (Don's) guess is that opencorporates will likely be a good way to do our matching,
as it captures many of the relationships between parents and subsidiaries that we will want to account for.

'''

