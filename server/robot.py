import RPi.GPIO as GPIO
import time
import json

CONFIG_FILE = './config.json'

GPIO.setmode(GPIO.BCM)


with open(CONFIG_FILE, 'r') as f:
    data = json.load(f)

print(data)

# motor1_pins = (data.motor, 3)
# motor2_pins = (4, 17)
# motor3_pins = (27, 22)
# motor4_pins = (10, 9)