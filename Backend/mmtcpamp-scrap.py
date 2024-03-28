import requests
from bs4 import BeautifulSoup as soup
import csv
import time

url = "https://www.mmtcpamp.com/digital-gold"
req = requests.get(url)
req.raise_for_status()

# create Soup
page_soup = soup(req.text, 'html.parser')
filename = "D:\\Programming\\MyProjects\\SIPG-Today\\Backend\\mmtcpamp-digital-gold-price.csv"
gold_price = page_soup.find('span', {'id': 'goldPrice'}).text
Time = time.strftime('%X')
date = time.strftime('%x')
with open(filename, 'a', encoding='utf-8') as b:
    write = csv.writer(b, dialect='excel')
    write.writerow([date,Time,gold_price])