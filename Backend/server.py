from flask import Flask
from flask_cors import CORS
import csv
import pandas as pd
import requests
from bs4 import BeautifulSoup as soup
import datetime 
import time
import json
from re import sub

app = Flask(__name__)
CORS(app)

class RangeDict(dict):
    def __getitem__(self, item):
        if not isinstance(item, range): # or xrange in Python 2
            for key in self:
                if item in key:
                    return self[key]
            raise KeyError(item)
        else:
            return super().__getitem__(item) # or super(RangeDict, self) for Python 2

color_bin = RangeDict({range(0,3000): '#ffffff', range(4500,4800): '#f6dfe5', range(4800,5000): '#f2d0d9'
                       ,range(5000,5500): '#eec0cc', range(5500,5800): '#eab1c0',range(5800,6100): '#e5a1b3',
                       range(6100,6400): '#e192a7', range(6400,6800): '#dd839b',range(6800,7100): '#d9738e',
                       range(7100,7300): '#d46482',range(7300,7500): '#d05475',range(7500,8000): '#cc4569'})



days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
def get_week(epoch):
    
    day = time.strftime('%A', time.localtime(epoch))
    return days.index(day)

def get_data(file):
    with open(file, 'r') as file:
        csv_reader = csv.DictReader(file)
        data = [row for row in csv_reader]
    return data
def get_gold_price(file,year):
    
    if file == "digital-gold.csv":
        year_list = ["==Year 2020==","==Year 2021==","==Year 2022==","==Year 2023==","==Year 2024=="]
        DESIRED_COLUMNS = ["Digital_Gold_Price"]
    else:
        year_list = ["==Year 2024==","==Year 2023==","==Year 2022==","==Year 2021==","==Year 2020==","==Year 2019==","==Year 2018==","==Year 2017=="]
        DESIRED_COLUMNS =  ["Gold Price(24 Karat)","Gold Price(22 Karat)","Gold Price(18 Karat)","Gold Price(14 Karat)","Gold Price(10 Karat)"]
    selected_row = []

    df = pd.read_csv(file)
    year_index = []
    for i in year_list:
        
        year_index.append(df.index[df[DESIRED_COLUMNS[0]] == i].tolist()[0])
    year_index.append(len(df))
    selected_index = year_index[year_list.index(year)] + 1
    after_index = year_index[year_list.index(year)+1]

    for i in range(selected_index,after_index):
        selected_row.append(df.iloc[i])
    series_data = []
    for row in DESIRED_COLUMNS:       
        data_value = []
        for i in selected_row:
            data_value.append({'x':int(i[row].split("||")[0]) * (1000), 'y':int(i[row].split("||")[1])})
        series_data.append({
        "data": data_value,
        "name": row,
        'type': 'spline'
        })
    return series_data

def current_gold_rate(type):

    def find_value(id):
        gold_rate_table = page_soup.find('div', {'id': id})
        count = 1
        for i in gold_rate_table.find_all('td',{'class':'rate'}):
            if count == 3:
                today_gold_rate = i.text
            count = count + 1
        if id == "tab_kunit_24":
            gold_Rate_dict['24K Gold'] = today_gold_rate.replace("₹","").replace(",","").replace(".00","")
        else:
          gold_Rate_dict['22K Gold'] =  today_gold_rate.replace("₹","").replace(",","").replace(".00","")

    if type == "digigold_last_10":
        last10_digi_gold = []
        test_new_list = get_gold_price("digital-gold.csv","==Year 2024==")[0]["data"]
        last_10 = test_new_list[-10:]
        for i in reversed(last_10):
            last10_digi_gold.append(i['y'])
        
        # for i in reversed(last_10):
        #     last10_digi_gold.append(i)


    
    else:
        if type == "digital_gold_today":
            url = "https://www.mmtcpamp.com/digital-gold"
        else:
            url = "https://www.exchange-rates.org/precious-metals/gold-price/india/2024"
        req = requests.get(url)
        req.raise_for_status()

        # create Soup
        page_soup = soup(req.text, 'html.parser')
        if type =="digital_gold_today":
            digi_gold_price = page_soup.find('span', {'id': 'goldPrice'}).text
        
        else:
            gold_Rate_dict = {}
            gold_Rate_dict['24K Gold'] = []
            gold_Rate_dict['22K Gold'] = []
            
            find_value('tab_kunit_24')
            find_value('tab_kunit_22')
            # find_value(change)
            data = []
            last_10_data = []
            url = "https://www.exchange-rates.org/precious-metals/gold-price/india/2024"
            req = requests.get(url)
            req.raise_for_status()
            new_data = []
            # create Soup
            page_soup = soup(req.text, 'html.parser')
            table = page_soup.find('table', attrs={'class':'metal-history-table'})
            table_body = table.find('tbody')
            rows = table_body.find_all('tr')
            for row in rows:
                new = []
            # #         if row.has_attr("class"):
            #         if row.has_attr("class") 'month-row-bottom' not in row['class']:
                cols = row.find_all('td',{'class':'rate'})

                for ele in reversed(cols):
                    new.append(round(float(sub(r'[^\d.]', '', ele.text.strip()))/31.1035))
                new_data.append(new)
                
            # print(new_data)
            count = 0
            for row in reversed(new_data):
            #     print(row[])
                if count <= 11 and len(row) > 0:
                    last_10_data.append(row[3])
                count = count + 1
           

    if type == "today":
        return gold_Rate_dict
    elif type == "digital_gold_today":
        return digi_gold_price
    elif type == "digigold_last_10":
        return last10_digi_gold
    else:
        return last_10_data

@app.route("/current-gold-price")
def current_gold():
        today = current_gold_rate("today")
        last_10 = current_gold_rate("last_10_days")
        digigold_today = current_gold_rate("digital_gold_today")
        digigold_last_10 = current_gold_rate("digigold_last_10")
        return [{"Today":today, "last_10_days":last_10, "digigold_today":round(float(digigold_today)),"digigold_last_10": digigold_last_10}]

@app.route("/digital-gold-price/2024")
def digital_gold_price_2024():
    return get_gold_price("digital-gold.csv","==Year 2024==")

@app.route("/digital-gold-price/2023")
def digital_gold_price_2023():
    return get_gold_price("digital-gold.csv","==Year 2023==")

@app.route("/digital-gold-price/2022")
def digital_gold_price_2022():
    return get_gold_price("digital-gold.csv","==Year 2022==")

@app.route("/digital-gold-price/2021")
def digital_gold_price_2021():
    return get_gold_price("digital-gold.csv","==Year 2021==")

@app.route("/digital-gold-price/2020")
def digital_gold_price_2020():
    return get_gold_price("digital-gold.csv","==Year 2020==")


@app.route("/gold-price/2024")
def gold_price_2024():
    return get_gold_price("gold-price.csv","==Year 2024==")

@app.route("/gold-price/2023")
def gold_price_2023():
    return get_gold_price("gold-price.csv","==Year 2023==")

@app.route("/gold-price/2022")
def gold_price_2022():
    return get_gold_price("gold-price.csv","==Year 2022==")

@app.route("/gold-price/2021")
def gold_price_2021():
    return get_gold_price("gold-price.csv","==Year 2021==")

@app.route("/gold-price/2020")
def gold_price_2020():
    return get_gold_price("gold-price.csv","==Year 2020==")

@app.route("/gold-price/2019")
def gold_price_2019():
    return get_gold_price("gold-price.csv","==Year 2019==")

@app.route("/gold-price/2018")
def gold_price_2018():
    return get_gold_price("gold-price.csv","==Year 2018==")

@app.route("/gold-price/2017")
def gold_price_2017():
    return get_gold_price("gold-price.csv","==Year 2017==")


@app.route("/digital-gold-years")
def digital_gold_years():
    return get_data("mmtcpamp-digital-gold-price.csv")

@app.route("/sipg-today/<type>/<int:date>")
def sipg_today(date,type):
    if type == "physical_gold":
        price_name = 'Gold Price(22 Karat)'
        file = "gold-price_epoch.csv"
    else:
        price_name = 'price'
        file = "digital-gold.csv"
    df = pd.read_csv(file)

    if type == "digital_gold":
        df = df[df["Digital_Gold_Price"].str.contains("==Year") == False]
        df[['date', 'price']] = df['Digital_Gold_Price'].str.rsplit('||', expand=True)
        df = df.drop('Digital_Gold_Price', axis=1)
        df["date"] = pd.to_numeric(df["date"])

    highest_since = df[df['date'] > date].max()
    highest_since['date'] = datetime.datetime.fromtimestamp(highest_since['date']).strftime('%Y-%m-%d')

    
    given_date = date
    if len(df[df['date'] == given_date]) == 0:
        date_one =  df[df['date'] > given_date].min()['date']
        low = df[df['date'] == date_one].reset_index(drop=True)
        low['day'] = "Price around the time you purchased"
    else:
        low = df[df['date'] == given_date].reset_index(drop=True)
        low['day'] = "Price on the day you purchased"
        
    print(low)
    low['date'] = low.date.apply(lambda d: datetime.datetime.fromtimestamp(int(d)).strftime("%Y-%m-%d"))
     
    
    
    

    new_df = df[df['date'] > date].reset_index(drop=True)
    # epoch_time = int(time.time())
    last_few_days = []
    # date_after = date+(30*84600) if date+(30*84600) < epoch_time else epoch_time
    # new_data = df[df["date"].between(date,date_after, inclusive = 'both')].reset_index(drop=True) 
    # # last_few_days['date'] = pd.to_datetime(last_few_days['date'], unit='s')

    epoch_now = int(time.time())
    last_60 = df[df["date"].between(epoch_now-(60*84600),epoch_now, inclusive = 'neither')].reset_index(drop=True)
    high_date = last_60['date'].max()
    high_60 = last_60[last_60['date'] == high_date]
    heatmap_data = []
    first_date = ""
    for i,k in last_60.iterrows():
        if first_date == "":
            first_date = k['date'] + 86400
            data_dump = {'date':datetime.datetime.fromtimestamp(k['date']).strftime('%Y-%m-%d'),'price':int(k[price_name]),'x':int(get_week(k['date'])),'color':color_bin[int(k[price_name])]}
            heatmap_data.append(data_dump)
        else:
            
            if k['date'] == first_date:
                data_dump = {'date':datetime.datetime.fromtimestamp(k['date']).strftime('%Y-%m-%d'),'price':int(k[price_name]),'x':int(get_week(k['date'])),'color':color_bin[int(k[price_name])]} 
                heatmap_data.append(data_dump)
                first_date = first_date + 86400
            else:
                while k['date'] != first_date:
                    data_dump = {'date':datetime.datetime.fromtimestamp(first_date).strftime('%Y-%m-%d'),'price':'','x':int(get_week(first_date)),'color':'#ffffff'}
                    first_date = first_date + 86400
                    heatmap_data.append(data_dump)
                if  k['date'] == first_date:
                    data_dump = {'date':datetime.datetime.fromtimestamp(k['date']).strftime('%Y-%m-%d'),'price':int(k[price_name]),'x':int(get_week(k['date'])),'color':color_bin[int(k[price_name])]} 
                    first_date = first_date + 86400
                    heatmap_data.append(data_dump)

    series_data = []
    for i in new_df.columns.tolist():
        
        if i!= "date":
            data = []
            for val in range(0,len(new_df['date'])):
                
                data.append({'x':int(new_df['date'][val] *1000),'y':int(new_df[i][val])})
            series_data.append({
                "data": data,
                "name": i,
                'type': 'spline'
                })      
            
    new_df["date"] = new_df.date.apply(lambda d: datetime.datetime.fromtimestamp(int(d)).strftime("%Y-%m-%d"))
    # print(series_data)
    if type == "digital_gold":
        for index, row in new_df.iterrows():
            last_few_days.append([row['date'],row['price']])
    else:
        for index, row in new_df.iterrows():
            last_few_days.append([row['date'],row['Gold Price(24 Karat)'],row['Gold Price(22 Karat)'],row['Gold Price(18 Karat)'],row['Gold Price(14 Karat)'],row['Gold Price(10 Karat)']])
        #  
    if low[price_name][0] >= high_60[price_name].values[0]:
        result = "Price seems to be lesser than the day you purchased"
    else:
        result = "Price seems to be higher than the day you purchased"

    min_number = last_60[price_name].to_list()[0]
    min_count = 0
    min_date = 0


    for key, value in last_60.iterrows():
        
        if value[price_name] < min_number:
            
            min_number = value[price_name]
            min_date = value['date']
            min_count = min_count + 1
        else:
            min_number = value[price_name]
    if min_count == 0:
        result += "...Also the price is keep increasing for last 2 months"
        
    else:
        if min_count == 1:
            result += "...Also the price is fluctuating(Price is reduced once) in last 2 months.."
        else:  
            result += "...Also the price is fluctuating in last 2 months..Price got reduced {0} times".format(str(min_count))
    
    return [{"Linechart_data":series_data, "on_price":low.to_dict(), 'highest':highest_since.to_dict(),'heatmap_data':heatmap_data,"result": result}]


if __name__ == "__main__":
    app.run(debug=True)