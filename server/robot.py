import RPi.GPIO as GPIO
import time
import json
from enum import Enum
import sys

class Movements(Enum):
    FORWARD = 'forward'
    BACKWARD = 'backward'
    LEFT = 'left'
    RIGHT = 'right'


CONFIG_FILE = './config.json'

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

with open(CONFIG_FILE, 'r') as f:
    data = json.load(f)

motor1_pins = (data["motorPins"]["motor1"][0], data["motorPins"]["motor1"][1]) # front_left
motor2_pins = (data["motorPins"]["motor2"][0], data["motorPins"]["motor2"][1]) # front_right
motor3_pins = (data["motorPins"]["motor3"][0], data["motorPins"]["motor3"][1]) # back_right
motor4_pins = (data["motorPins"]["motor4"][0], data["motorPins"]["motor4"][1]) # back_left

allMotorPins = [motor1_pins, motor2_pins, motor3_pins, motor4_pins]

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
    pinsArr = []
    print(pinsInfo)
    for pin in range(len(pinsInfo["direction"])):
        pinsArr.append(GPIO.PWM(allMotorPins[pin][pinsInfo["direction"][pin]], pinsInfo["speed"][pin]))

    for p in pinsArr:
        p.start(1)

    time.sleep(sleep_time)

    for p in pinsArr:
        p.stop()

if len(sys.argv) != 3:
    print("error")
    sys.exit(1)
make_move(sys.argv[1], int(sys.argv[2]))