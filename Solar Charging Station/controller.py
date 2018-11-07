import Adafruit_BBIO.GPIO as GPIO 
import time 
import requests 
import json 

stationID = "123"
url = "http://192.168.1.79:5000/api/stationstate/" + stationID

GPIO.setup("PB_1O", GPIO.OUT) # GPIO - 68 

onStatus = False 

while True:
	r = requests.get(url)
	r = str(r.text)
	result = json.loads(r)

	if (onStatus == False):
		if (results[0] == True):
			print "Switch ON"
			onStatus = True 
			GPIO.output("PB_1O", GPIO.LOW)
	elif (onStatus == True):
		if (result[0] == True):
			print "Switch OFF"
			onStatus = False
			GPIO.output("PB_1O", GPIO.HIGH)

	time.sleep(2)