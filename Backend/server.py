from flask import Flask
from flask_cors import CORS
import csv
import pandas as pd
import requests
from bs4 import BeautifulSoup as soup
import datetime 
import time

app = Flask(__name__)
CORS(app)
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

    def find_value(value):
        for ran in range(len(value)):
            if ran == 0 or ran == 1:
                gold_Rate_dict['22K Gold'].append(value[ran].replace("₹","").replace(",","").replace(".00",""))
            elif ran == 2 or ran == 3:
                gold_Rate_dict['24K Gold'].append(value[ran].replace("₹","").replace(",","").replace(".00",""))
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
            url = "https://www.iifl.com/gold-rates-today/gold-rate-chennai"
        req = requests.get(url)
        req.raise_for_status()

        # create Soup
        page_soup = soup(req.text, 'html.parser')
        if type =="digital_gold_today":
            digi_gold_price = page_soup.find('span', {'id': 'goldPrice'}).text
        
        else:
            gold_Rate_dict = {}
            for val in page_soup.find_all('h4', {'class': 'gold-rate-box__title mb-0'}):
                gold_Rate_dict[val.text] = []


            
            price = [i.text for i in  page_soup.find_all('span', {'class': 'd-block fw-500 text-truncate'})]
            # change = [i.text.replace("\n","").replace("\u200c","").strip() for i in  page_soup.find_all('span', {'class': 'gold-rate-box__trends-up'})]

            find_value(price)
            # find_value(change)
            last_10_data = []
            table = page_soup.find_all('table')[2]
            table_body = table.find('tbody')

            rows = table_body.find_all('tr')
            for row in rows:
                cols = row.find_all('td')
                cols = [ele.text.strip().replace("\n","").replace("\t","").replace("₹","").replace(",","") for ele in cols]
                last_10_data.append([ele for ele in cols if ele]) 
           

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
        return [{"Today":today,"last_10_days":last_10,"digigold_today":round(float(digigold_today)),"digigold_last_10": digigold_last_10}]

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
        file = "gold-price_epoch.csv"
    df = pd.read_csv(file)

    highest_since = df[df['date'] > date].max()
    highest_since['date'] = datetime.datetime.fromtimestamp(highest_since['date']).strftime('%Y-%m-%d')

    new_df = df[df['date'] > date].reset_index(drop=True)
    epoch_time = int(time.time())
    last_few_days = []
    date_after = date+(30*84600) if date+(30*84600) < epoch_time else epoch_time
    new_data = df[df["date"].between(date,date_after, inclusive = 'both')].reset_index(drop=True) 
    # last_few_days['date'] = pd.to_datetime(last_few_days['date'], unit='s')
   
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
    
    for index, row in new_df.iterrows():
        last_few_days.append([row['date'],row['Gold Price(24 Karat)'],row['Gold Price(22 Karat)'],row['Gold Price(18 Karat)'],row['Gold Price(14 Karat)'],row['Gold Price(10 Karat)']])
    print(last_few_days)
    return [{"Linechart_data":series_data,'highest':highest_since.to_dict(),'last_few_days':last_few_days}]


if __name__ == "__main__":
    app.run(debug=True)