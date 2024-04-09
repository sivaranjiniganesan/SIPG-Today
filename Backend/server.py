from flask import Flask
from flask_cors import CORS
import csv
import pandas as pd

app = Flask(__name__)
CORS(app)
def get_data(file):
    with open(file, 'r') as file:
        csv_reader = csv.DictReader(file)
        data = [row for row in csv_reader]
    return data
def get_gold_price(file,year):
    DESIRED_COLUMNS =  ["Gold Price(24 Karat)","Gold Price(22 Karat)","Gold Price(18 Karat)","Gold Price(14 Karat)","Gold Price(10 Karat)"]
    selected_row = []
    df = pd.read_csv(file)


    year_list = ["==Year 2024==","==Year 2023==","==Year 2022==","==Year 2021==","==Year 2020==","==Year 2019==","==Year 2018==","==Year 2017=="]
    year_index = []
    for i in year_list:
        year_index.append(df.index[df['Gold Price(24 Karat)'] == i].tolist()[0])
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
        'type': 'line'
        })
    return series_data

@app.route("/")
def links():
     
        return {"Data Links":["https://sipg-today.onrender.com/gold-price","https://sipg-today.onrender.com/digital-gold-3months","https://sipg-today.onrender.com/digital-gold-years"]}

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

@app.route("/digital-gold-3months")
def digital_gold_3months():
    return get_data("digital-gold.csv")

@app.route("/digital-gold-years")
def digital_gold_years():
    return get_data("mmtcpamp-digital-gold-price.csv")

if __name__ == "__main__":
    app.run(debug=True)