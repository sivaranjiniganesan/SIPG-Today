from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route("/member")
def members():
    return {"member":["Sivaranjini","Sasikannan","Sivasankare"]}

if __name__ == "__main__":
    app.run(debug=True)