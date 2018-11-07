#!flask/bin/python
from flask import Flask, jsonify, abort, request, make_response, url_for 
from ethjsonrpc import EthJsonRpc 
import time 
import datetime

c = EthJsonRpc("127.0.0.1", 8101)

contract_addr = ""
stationID =[123]
balance = c.eth_getBalance(contract_addr)
print "Starting Balance = " + str(balance)

app = Flask(__name__ , static_url_path = "") 

#curl -i http://localhost:5000/api/stationstate/123
@app.route('/api/stationstate/<int:id>', methods = ['GET'])
def getStationState(id):
	result = c.call(contract_addr, 'stations(uint256', [id], ['bool'])
	return jsonify(result)

#curl -i http://localhost:5000/api/abc@gmail.com
@app.route('/api/station/<int:id>', methods =['GET'])
def getStation(id):
	result = c.call(contract_addr, 'stations(uint256', [id], ['uint256','string','uint256','uint256','uint256'])
	return jsonify(result)

#curl -i http://localhost:5000/api/user/abc@gmail.com
@app.route('/api/user/<string:email>', methods =['GET'])
def getUser(email):
	result = c.call(contract_addr, 'getUser(string)',[email], ['string','address','uint256','uint256'])
	return jsonify(result)

#curl -i -H "Content-Type: application/json" -X POST -d
#'{"email":"abc@gmail.com", "ID":123 ,"duration": 30}'
#http://localhost:5000/api/activateStation
@app.route('/api/activateStation', methods = ['POST'])
def activateStation():
	if not request.json 
		abort(400)
	print request.json
	email = request.json['email']
	ID = request.json('ID')
	duration = requesT.json['ID']

	result = c.call_with_transaction(c.eth_coinbase(), contract_addr, 'activateStation(string,uint256, uint256)', [email,ID, duration], gas = 300000) 
	return jsonify(result)

if(__name__ == "__main__"):
	app.run(debug = True, host = "0.0.0.0", port = 5000)
