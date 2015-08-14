///<reference path="node.d.ts" />
/*
 * This is a language binding for the ev3dev device APIs. More info at: https://github.com/ev3dev/ev3dev-lang
 * This library complies with spec v0.9.2
 */
var fs = require('fs');
var path = require('path');
//var Enumerable: linqjs.EnumerableStatic = require('linq');
/* CONSTANTS */
var ports = {
    INPUT_AUTO: undefined,
    OUTPUT_AUTO: undefined,
    INPUT_1: 'in1',
    INPUT_2: 'in2',
    INPUT_3: 'in3',
    INPUT_4: 'in4',
    OUTPUT_A: 'outA',
    OUTPUT_B: 'outB',
    OUTPUT_C: 'outC',
    OUTPUT_D: 'outD'
};
///<reference path="node.d.ts" />
///<reference path="include.ts" />
var XError = (function () {
    function XError() {
        var tsargs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tsargs[_i - 0] = arguments[_i];
        }
        Error.apply(this, arguments);
        return new Error();
    }
    return XError;
})();
XError['prototype'] = new Error();
var TraceError = (function () {
    function TraceError(message, innerError) {
        this.message = message;
        this.innerError = innerError;
    }
    TraceError.prototype.toString = function () {
        var str = this.message.trim() + '\r\nInner error:\r\n';
        var innerLines = this.innerError.toString().split('\r\n');
        for (var i in innerLines) {
            innerLines[i] = '  ' + innerLines[i];
        }
        return str + innerLines.join('\r\n');
    };
    return TraceError;
})();
var Device = (function () {
    function Device() {
        this.connected = false;
    }
    Device.prototype.connect = function (deviceRootPath) {
        this.deviceRoot = deviceRootPath;
        this.connected = true;
    };
    Device.prototype.constructPropertyPath = function (property, deviceRoot) {
        return path.join(deviceRoot || this.deviceRoot, property);
    };
    Device.prototype.readNumber = function (property, deviceRoot) {
        var value = this.readProperty(property, deviceRoot);
        if (typeof value !== 'number')
            return NaN;
        return value;
    };
    Device.prototype.readString = function (property, deviceRoot) {
        var value = this.readProperty(property, deviceRoot);
        return String(value);
    };
    Device.prototype.readProperty = function (property, deviceRoot) {
        if (!deviceRoot && !this.connected)
            throw new Error('You must be connected to a device before you can read from it.');
        var rawValue;
        var propertyPath = this.constructPropertyPath(property, deviceRoot);
        try {
            rawValue = fs.readFileSync(propertyPath).toString();
        }
        catch (e) {
            throw new TraceError('There was an error while reading from the property file "' + propertyPath + '".', e);
        }
        rawValue = rawValue.trim();
        var numValue = Number(rawValue);
        if (isNaN(numValue))
            return rawValue;
        else
            return numValue;
    };
    Device.prototype.setProperty = function (property, value) {
        if (!this.connected)
            throw new Error('You must be connected to a device before you can write to it.');
        var propertyPath = this.constructPropertyPath(property);
        try {
            fs.writeFileSync(propertyPath, value.toString());
        }
        catch (e) {
            throw new TraceError('There was an error while writing to the property file "' + propertyPath + '".', e);
        }
    };
    Device.prototype.setNumber = function (property, value) {
        this.setProperty(property, value);
    };
    Device.prototype.setString = function (property, value) {
        this.setProperty(property, value);
    };
    Device.prototype.set = function (propertyDefs) {
        for (var key in propertyDefs) {
            this.setProperty(key, propertyDefs[key]);
        }
    };
    return Device;
})();
///<reference path="node.d.ts" />
///<reference path="include.ts" />
///<reference path="io.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
//~autogen autogen-header
// Sections of the following code were auto-generated based on spec v0.9.2-pre, rev 3. 
//~autogen
var MotorBase = (function (_super) {
    __extends(MotorBase, _super);
    function MotorBase(targetPort, targetDriverName) {
        _super.call(this);
        this.deviceDir = '/sys/class/tacho-motor/'; //Default motor type
        this._deviceIndex = -1;
        this.motorBaseProperties = {
            portName: 'port_name',
            driver: 'driver_name'
        };
        this.port = targetPort;
        var rootPath;
        try {
            var availableDevices = fs.readdirSync(this.deviceDir);
            for (var i in availableDevices) {
                var deviceFile = availableDevices[i];
                rootPath = path.join(this.deviceDir, deviceFile);
                var currentPortName = this.readString(this.motorBaseProperties.portName, rootPath);
                var currentDriverName = this.readString(this.motorBaseProperties.driver, rootPath);
                var satisfiesCondition = ((targetPort == ports.OUTPUT_AUTO)
                    || (targetPort == undefined)
                    || (currentPortName === targetPort)) && ((targetDriverName == undefined || targetDriverName == '')
                    || currentDriverName == targetDriverName);
                if (satisfiesCondition) {
                    this._deviceIndex = Number(deviceFile.substring('motor'.length));
                    break;
                }
            }
            if (this.deviceIndex == -1) {
                console.log('no device found');
                this.connected = false;
                return;
            }
        }
        catch (e) {
            console.log(e);
            this.connected = false;
            return;
        }
        this.connect(rootPath);
    }
    Object.defineProperty(MotorBase.prototype, "deviceIndex", {
        get: function () {
            return this._deviceIndex;
        },
        enumerable: true,
        configurable: true
    });
    return MotorBase;
})(Device);
//Tacho motor
var Motor = (function (_super) {
    __extends(Motor, _super);
    function Motor(port, targetDriverName) {
        this.deviceDir = '/sys/class/tacho-motor/';
        _super.call(this, port, targetDriverName);
    }
    Motor.prototype.reset = function () {
        this.command = 'reset';
    };
    Motor.prototype.stop = function () {
        this.command = 'stop';
    };
    Object.defineProperty(Motor.prototype, "command", {
        //PROPERTIES
        //~autogen js_generic-get-set classes.motor>currentClass
        set: function (value) {
            this.setString("command", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "commands", {
        get: function () {
            return this.readString("commands").split(' ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "countPerRot", {
        get: function () {
            return this.readNumber("count_per_rot");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "driverName", {
        get: function () {
            return this.readString("driver_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "dutyCycle", {
        get: function () {
            return this.readNumber("duty_cycle");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "dutyCycleSp", {
        get: function () {
            return this.readNumber("duty_cycle_sp");
        },
        set: function (value) {
            this.setNumber("duty_cycle_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "encoderPolarity", {
        get: function () {
            return this.readString("encoder_polarity");
        },
        set: function (value) {
            this.setString("encoder_polarity", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "polarity", {
        get: function () {
            return this.readString("polarity");
        },
        set: function (value) {
            this.setString("polarity", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "portName", {
        get: function () {
            return this.readString("port_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "position", {
        get: function () {
            return this.readNumber("position");
        },
        set: function (value) {
            this.setNumber("position", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "positionP", {
        get: function () {
            return this.readNumber("hold_pid/Kp");
        },
        set: function (value) {
            this.setNumber("hold_pid/Kp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "positionI", {
        get: function () {
            return this.readNumber("hold_pid/Ki");
        },
        set: function (value) {
            this.setNumber("hold_pid/Ki", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "positionD", {
        get: function () {
            return this.readNumber("hold_pid/Kd");
        },
        set: function (value) {
            this.setNumber("hold_pid/Kd", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "positionSp", {
        get: function () {
            return this.readNumber("position_sp");
        },
        set: function (value) {
            this.setNumber("position_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speed", {
        get: function () {
            return this.readNumber("speed");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speedSp", {
        get: function () {
            return this.readNumber("speed_sp");
        },
        set: function (value) {
            this.setNumber("speed_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "rampUpSp", {
        get: function () {
            return this.readNumber("ramp_up_sp");
        },
        set: function (value) {
            this.setNumber("ramp_up_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "rampDownSp", {
        get: function () {
            return this.readNumber("ramp_down_sp");
        },
        set: function (value) {
            this.setNumber("ramp_down_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speedRegulationEnabled", {
        get: function () {
            return this.readString("speed_regulation");
        },
        set: function (value) {
            this.setString("speed_regulation", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speedRegulationP", {
        get: function () {
            return this.readNumber("speed_pid/Kp");
        },
        set: function (value) {
            this.setNumber("speed_pid/Kp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speedRegulationI", {
        get: function () {
            return this.readNumber("speed_pid/Ki");
        },
        set: function (value) {
            this.setNumber("speed_pid/Ki", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speedRegulationD", {
        get: function () {
            return this.readNumber("speed_pid/Kd");
        },
        set: function (value) {
            this.setNumber("speed_pid/Kd", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "state", {
        get: function () {
            return this.readString("state").split(' ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "stopCommand", {
        get: function () {
            return this.readString("stop_command");
        },
        set: function (value) {
            this.setString("stop_command", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "stopCommands", {
        get: function () {
            return this.readString("stop_commands").split(' ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "timeSp", {
        get: function () {
            return this.readNumber("time_sp");
        },
        set: function (value) {
            this.setNumber("time_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    //~autogen
    Motor.prototype.applySpeedSp = function (newSp) {
        if (typeof newSp === "number") {
            this.applySpeedSp(new MotorSpeedSp(newSp));
        }
        else {
            this.speedRegulationEnabled = newSp.regulationEnabled;
            if (newSp.dutyCycleSp != undefined)
                this.dutyCycleSp = newSp.dutyCycleSp;
            if (newSp.speedSp != undefined)
                this.speedSp = newSp.speedSp;
        }
    };
    Motor.prototype.sendCommand = function (commandName) {
        if (this.commands.indexOf(commandName) < 0)
            throw new Error('The command ' + commandName + ' is not supported by the device.');
        this.command = commandName;
    };
    Motor.prototype.runForever = function (sp) {
        if (sp != undefined)
            this.applySpeedSp(sp);
        this.sendCommand('run-forever');
    };
    Motor.prototype.start = function (sp) {
        this.runForever(sp);
    };
    Motor.prototype.runToPosition = function (position, speedSp) {
        this.runToAbsolutePosition(position, speedSp);
    };
    Motor.prototype.runToAbsolutePosition = function (position, speedSp) {
        if (speedSp != undefined)
            this.applySpeedSp(speedSp);
        if (position != undefined)
            this.positionSp = position;
        this.sendCommand('run-to-abs-pos');
    };
    Motor.prototype.runForDistance = function (distance, speedSp) {
        this.runToRelativePosition(distance, speedSp);
    };
    Motor.prototype.runToRelativePosition = function (relPos, speedSp) {
        if (speedSp != undefined)
            this.applySpeedSp(speedSp);
        if (relPos != undefined)
            this.positionSp = relPos;
        this.sendCommand('run-to-rel-pos');
    };
    return Motor;
})(MotorBase);
//DC Motor
var DCMotor = (function (_super) {
    __extends(DCMotor, _super);
    function DCMotor(port) {
        this.deviceDir = '/sys/class/dc-motor/';
        _super.call(this, port);
    }
    Object.defineProperty(DCMotor.prototype, "command", {
        //PROPERTIES
        //~autogen js_generic-get-set classes.dcMotor>currentClass
        set: function (value) {
            this.setString("command", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "commands", {
        get: function () {
            return this.readString("commands").split(' ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "driverName", {
        get: function () {
            return this.readString("driver_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "dutyCycle", {
        get: function () {
            return this.readNumber("duty_cycle");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "dutyCycleSp", {
        get: function () {
            return this.readNumber("duty_cycle_sp");
        },
        set: function (value) {
            this.setNumber("duty_cycle_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "polarity", {
        get: function () {
            return this.readString("polarity");
        },
        set: function (value) {
            this.setString("polarity", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "portName", {
        get: function () {
            return this.readString("port_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "rampDownSp", {
        get: function () {
            return this.readNumber("ramp_down_sp");
        },
        set: function (value) {
            this.setNumber("ramp_down_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "rampUpSp", {
        get: function () {
            return this.readNumber("ramp_up_sp");
        },
        set: function (value) {
            this.setNumber("ramp_up_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "state", {
        get: function () {
            return this.readString("state").split(' ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "stopCommand", {
        set: function (value) {
            this.setString("stop_command", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCMotor.prototype, "stopCommands", {
        get: function () {
            return this.readString("stop_commands").split(' ');
        },
        enumerable: true,
        configurable: true
    });
    return DCMotor;
})(MotorBase);
//Servo Motor
var ServoMotor = (function (_super) {
    __extends(ServoMotor, _super);
    function ServoMotor(port) {
        this.deviceDir = '/sys/class/servo-motor/';
        _super.call(this, port);
    }
    Object.defineProperty(ServoMotor.prototype, "command", {
        //PROPERTIES
        //~autogen js_generic-get-set classes.servoMotor>currentClass
        set: function (value) {
            this.setString("command", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "driverName", {
        get: function () {
            return this.readString("driver_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "maxPulseSp", {
        get: function () {
            return this.readNumber("max_pulse_sp");
        },
        set: function (value) {
            this.setNumber("max_pulse_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "midPulseSp", {
        get: function () {
            return this.readNumber("mid_pulse_sp");
        },
        set: function (value) {
            this.setNumber("mid_pulse_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "minPulseSp", {
        get: function () {
            return this.readNumber("min_pulse_sp");
        },
        set: function (value) {
            this.setNumber("min_pulse_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "polarity", {
        get: function () {
            return this.readString("polarity");
        },
        set: function (value) {
            this.setString("polarity", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "portName", {
        get: function () {
            return this.readString("port_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "positionSp", {
        get: function () {
            return this.readNumber("position_sp");
        },
        set: function (value) {
            this.setNumber("position_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "rateSp", {
        get: function () {
            return this.readNumber("rate_sp");
        },
        set: function (value) {
            this.setNumber("rate_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "state", {
        get: function () {
            return this.readString("state").split(' ');
        },
        enumerable: true,
        configurable: true
    });
    return ServoMotor;
})(MotorBase);
var MotorSpeedSp = (function () {
    function MotorSpeedSp(dutyCycleSp) {
        if (dutyCycleSp != undefined) {
            this.regulationEnabled = 'off';
            this.dutyCycleSp = dutyCycleSp;
        }
    }
    MotorSpeedSp.fromRegulated = function (speedSp) {
        var setpoint = new MotorSpeedSp();
        setpoint.regulationEnabled = 'on';
        setpoint.speedSp = speedSp;
        return setpoint;
    };
    MotorSpeedSp.fromUnregulated = function (dutyCycleSp) {
        var setpoint = new MotorSpeedSp();
        setpoint.regulationEnabled = 'off';
        setpoint.dutyCycleSp = dutyCycleSp;
        return setpoint;
    };
    return MotorSpeedSp;
})();
///<reference path="node.d.ts" />
///<reference path="include.ts" />
///<reference path="io.ts" />
var Sensor = (function (_super) {
    __extends(Sensor, _super);
    function Sensor(port, driverNames) {
        _super.call(this);
        this.sensorDeviceDir = '/sys/class/lego-sensor/';
        this._deviceIndex = -1;
        this.port = port;
        var rootPath;
        try {
            var availableDevices = fs.readdirSync(this.sensorDeviceDir);
            for (var i in availableDevices) {
                var file = availableDevices[i];
                rootPath = path.join(this.sensorDeviceDir, file);
                var portName = this.readString("port_name", rootPath);
                var driverName = this.readString("driver_name", rootPath);
                var satisfiesCondition = ((port == ports.INPUT_AUTO)
                    || (port == undefined)
                    || (portName === port)) && ((driverNames == undefined || driverNames == [])
                    || driverNames.indexOf(driverName) != -1);
                if (satisfiesCondition) {
                    this._deviceIndex = Number(file.substring('sensor'.length));
                    break;
                }
            }
            if (this.deviceIndex == -1) {
                this.connected = false;
                return;
            }
        }
        catch (e) {
            console.log(e);
            this.connected = false;
            return;
        }
        this.connect(rootPath);
    }
    Object.defineProperty(Sensor.prototype, "deviceIndex", {
        get: function () {
            return this._deviceIndex;
        },
        enumerable: true,
        configurable: true
    });
    Sensor.prototype.getValue = function (valueIndex) {
        return this.readNumber("value" + valueIndex);
    };
    Sensor.prototype.getFloatValue = function (valueIndex) {
        return this.getValue(valueIndex) / Math.pow(10, this.decimals);
    };
    Object.defineProperty(Sensor.prototype, "command", {
        //PROPERTIES
        //~autogen js_generic-get-set classes.sensor>currentClass
        set: function (value) {
            this.setString("command", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "commands", {
        get: function () {
            return this.readString("commands").split(' ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "decimals", {
        get: function () {
            return this.readNumber("decimals");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "driverName", {
        get: function () {
            return this.readString("driver_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "mode", {
        get: function () {
            return this.readString("mode");
        },
        set: function (value) {
            this.setString("mode", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "modes", {
        get: function () {
            return this.readString("modes").split(' ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "numValues", {
        get: function () {
            return this.readNumber("num_values");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "portName", {
        get: function () {
            return this.readString("port_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "units", {
        get: function () {
            return this.readString("units");
        },
        enumerable: true,
        configurable: true
    });
    return Sensor;
})(Device);
var I2CSensor = (function (_super) {
    __extends(I2CSensor, _super);
    function I2CSensor(port, driverNames) {
        _super.call(this, port, driverNames);
    }
    Object.defineProperty(I2CSensor.prototype, "fwVersion", {
        //~autogen js_generic-get-set classes.i2cSensor>currentClass
        get: function () {
            return this.readString("fw_version");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(I2CSensor.prototype, "pollMs", {
        get: function () {
            return this.readNumber("poll_ms");
        },
        set: function (value) {
            this.setNumber("poll_ms", value);
        },
        enumerable: true,
        configurable: true
    });
    return I2CSensor;
})(Sensor);
///<reference path="node.d.ts" />
///<reference path="include.ts" />
///<reference path="io.ts" />
//~autogen autogen-header
// Sections of the following code were auto-generated based on spec v0.9.2-pre, rev 3. 
//~autogen
var PowerSupply = (function (_super) {
    __extends(PowerSupply, _super);
    function PowerSupply(deviceName) {
        _super.call(this);
        this.powerDeviceDir = '/sys/class/power_supply/';
        this.deviceName = 'legoev3-battery';
        if (deviceName != undefined)
            this.deviceName = deviceName;
        var rootPath;
        try {
            var availableDevices = fs.readdirSync(this.powerDeviceDir);
            if (availableDevices.indexOf(this.deviceName) == -1) {
                this.connected = false;
                return;
            }
            rootPath = path.join(this.powerDeviceDir, availableDevices[availableDevices.indexOf(this.deviceName)]);
        }
        catch (e) {
            console.log(e);
            this.connected = false;
            return;
        }
        this.connect(rootPath /*, [this.sensorProperties.portName]*/);
    }
    Object.defineProperty(PowerSupply.prototype, "powerProperties", {
        get: function () {
            return {
                currentNow: 'current_now',
                voltageNow: 'voltage_now',
                voltageMaxDesign: 'voltage_min_design',
                voltageMinDesign: 'voltage_max_design',
                technology: 'technology',
                type: 'type'
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "measuredCurrent", {
        //PROPERTIES
        //~autogen js_generic-get-set classes.powerSupply>currentClass
        get: function () {
            return this.readNumber("current_now");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "measuredVoltage", {
        get: function () {
            return this.readNumber("voltage_now");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "maxVoltage", {
        get: function () {
            return this.readNumber("voltage_max_design");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "minVoltage", {
        get: function () {
            return this.readNumber("voltage_min_design");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "technology", {
        get: function () {
            return this.readString("technology");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "type", {
        get: function () {
            return this.readString("type");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "voltageVolts", {
        //~autogen
        get: function () {
            return this.measuredVoltage / 1000000;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "currentAmps", {
        get: function () {
            return this.measuredCurrent / 1000000;
        },
        enumerable: true,
        configurable: true
    });
    return PowerSupply;
})(Device);
var LED = (function (_super) {
    __extends(LED, _super);
    function LED(deviceName) {
        _super.call(this);
        this.ledDeviceDir = '/sys/class/leds/';
        //if (deviceName != undefined)
        this.deviceName = deviceName;
        var rootPath;
        try {
            var availableDevices = fs.readdirSync(this.ledDeviceDir);
            if (availableDevices.indexOf(this.deviceName) == -1) {
                this.connected = false;
                return;
            }
            rootPath = path.join(this.ledDeviceDir, availableDevices[availableDevices.indexOf(this.deviceName)]);
        }
        catch (e) {
            console.log(e);
            this.connected = false;
            return;
        }
        this.connect(rootPath);
    }
    Object.defineProperty(LED.prototype, "ledProperties", {
        get: function () {
            return {
                maxBrightness: 'max_brightness',
                brightness: 'brightness',
                trgger: 'trigger'
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LED.prototype, "maxBrightness", {
        //PROPERTIES
        //~autogen js_generic-get-set classes.led>currentClass
        get: function () {
            return this.readNumber("max_brightness");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LED.prototype, "brightness", {
        get: function () {
            return this.readNumber("brightness");
        },
        set: function (value) {
            this.setNumber("brightness", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LED.prototype, "trigger", {
        get: function () {
            return this.readString("trigger");
        },
        set: function (value) {
            this.setString("trigger", value);
        },
        enumerable: true,
        configurable: true
    });
    return LED;
})(Device);
///<reference path="node.d.ts" />
///<reference path="include.ts" />
///<reference path="io.ts" />
///<reference path="motor.ts" />
///<reference path="sensor.ts" />
///<reference path="extras.ts" />
module.exports.ports = ports;
/* CLASS EXPORTS */
//IO
module.exports.Device = Device;
//Motor
module.exports.Motor = Motor;
module.exports.ServoMotor = ServoMotor;
module.exports.DCMotor = DCMotor;
//Sensor
module.exports.Sensor = Sensor;
module.exports.I2CSensor = I2CSensor;
//Extras
module.exports.PowerSupply = PowerSupply;
module.exports.LED = LED;
