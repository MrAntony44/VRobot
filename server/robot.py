import RPi.GPIO as GPIO
import time
import json
from enum import Enum
import sys

GLOBAL_CONFIG = './global_conf.json'
CONFIG_FILE = 'server/config.json'

with open(GLOBAL_CONFIG, 'r') as f:
    movementValues = json.load(f)["movements"]

with open(CONFIG_FILE, 'r') as f:
    motorPinValues = json.load(f)["motorPins"]

class Movements(Enum):
    FORWARD, BACKWARD, LEFT, RIGHT = movementValues

motor1_pins = tuple(motorPinValues['motor1'])
motor2_pins = tuple(motorPinValues['motor2'])
motor3_pins = tuple(motorPinValues['motor3'])
motor4_pins = tuple(motorPinValues['motor4'])

allMotorPins = [motor1_pins, motor2_pins, motor3_pins, motor4_pins]

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

for pins in allMotorPins:
    for pin in pins:
        GPIO.setup(pin, GPIO.OUT)

def make_move(move, time):
    if move == Movements.FORWARD.value:
        # move forward
        pinsInfo = {
            "direction": [0, 0, 0, 0],
            "speed": [1, 1, 1, 1],
        }
    elif move == Movements.BACKWARD.value:
        # move backward
        pinsInfo = {
            "direction": [1, 1, 1, 1],
            "speed": [1, 1, 1, 1],
        }
    elif move == Movements.LEFT.value:
        # turn left
        pinsInfo = {
            "direction": [1, 0, 0, 1],
            "speed": [1, 1, 1, 1],
        }
    elif move == Movements.RIGHT.value:
        # turn right
        pinsInfo = {
            "direction": [0, 1, 1, 0],
            "speed": [1, 1, 1, 1],
        }
    else:
        print("Error: invalid move command")
        sys.exit(1)
    
    move_set(pinsInfo, time)
    GPIO.cleanup()

def move_set(pinsInfo, sleep_time):
    print(pinsInfo)
    for pin in range(len(pinsInfo["direction"])):
        GPIO.output(allMotorPins[pin][pinsInfo["direction"][pin]], GPIO.HIGH)

    time.sleep(sleep_time)

    GPIO.cleanup()

if len(sys.argv) != 3:
    raise ValueError("Error! Invalid number of arguments")
make_move(sys.argv[1], int(sys.argv[2]))