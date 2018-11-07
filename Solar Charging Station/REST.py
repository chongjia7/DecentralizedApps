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
