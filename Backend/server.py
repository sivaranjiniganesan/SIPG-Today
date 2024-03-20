from flask import Flask

app = Flask(__name__)

@app.route("/member")
def members():
    return {"member":["Sivaranjini","Sasikannan","Sivasankare"]}

if __name__ == "__main__":
    app.run(debug=True)