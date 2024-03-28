from flask import Flask
from flask_cors import CORS
import csv

app = Flask(__name__)
CORS(app)
def get_data(file):
    with open(file, 'r') as file:
        csv_reader = csv.DictReader(file)
        data = [row for row in csv_reader]
    return data

@app.route("/")
def links():
    return {"Data Links":["https://sipg-today.onrender.com/gold-price","https://sipg-today.onrender.com/digital-gold-3months","https://sipg-today.onrender.com/digital-gold-years"]}

@app.route("/gold-price")
def gold_price():
    return get_data("gold-price.csv")

@app.route("/digital-gold-3months")
def digital_gold_3months():
    return get_data("digital-gold.csv")

@app.route("/digital-gold-years")
def digital_gold_years():
    return get_data("mmtcpamp-digital-gold-price.csv")

if __name__ == "__main__":
    app.run(debug=True)