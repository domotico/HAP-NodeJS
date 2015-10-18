var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;

var serialport = require("serialport");

// here's a fake hardware device that we'll expose to HomeKit
var RELAY_BOARD = {
  sp: null,
  powerOnX: [false, false, false, false],
//   brightness: 100, // percentage

  setPowerOnX: function(on, X) {
    console.log("Turning the light #%d %s!", X, on ? "on" : "off");
    RELAY_BOARD.powerOnX[X-1] = on;
    var cmd="OF";
    if (on) cmd="ON";
    RELAY_BOARD.sp.write("@00"+cmd+X+"\r", function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
    });
  },

//   setBrightness: function(brightness) {
//     console.log("Setting light brightness to %s", brightness);
//     RELAY_BOARD.brightness = brightness;
//   },
  identify: function() {
    console.log("Identify the light!");
  }
};

RELAY_BOARD.sp = new serialport.SerialPort("/dev/tty.usbserial-A6015691", {
	baudrate: 9600,
	parser: serialport.parsers.readline("\n")
},false);
RELAY_BOARD.sp.open(function (error) {
  if ( error ) {
    console.log('failed to open serial: '+error);
  } else {
    console.log('serial open');
    RELAY_BOARD.setPowerOnX(true,1);
    RELAY_BOARD.sp.on('data', function(data) {
      console.log('serial data received: ' + data);
    });
  }
});

// Generate a consistent UUID for our light Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the word "light".
var lightUUID = uuid.generate('hap-nodejs:accessories:relaysboard');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake light.
var light = exports.accessory = new Accessory('Light', lightUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
light.username = "1A:2B:3C:4D:5E:FE";
light.pincode = "123-44-321";

// set some basic properties (these values are arbitrary and setting them is optional)
light
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "domoti.co")
  .setCharacteristic(Characteristic.Model, "KTA-223 RelaysBoard")
  .setCharacteristic(Characteristic.SerialNumber, "KTA223-000001");

// listen for the "identify" event for this Accessory
light.on('identify', function(paired, callback) {
  RELAY_BOARD.identify();
  callback(); // success
});

var lights = [ null, null, null, null ];
var light_on = null;

// Add the actual Lightbulb Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
lights[0] = light.addService(Service.Lightbulb, "cucina", "cucina");
lights[1] = light.addService(Service.Lightbulb, "soggiorno", "soggiorno");
lights[2] = light.addService(Service.Lightbulb, "studio", "studio");
lights[3] = light.addService(Service.Lightbulb, "magazzino", "magazzino");

lights[0].getCharacteristic(Characteristic.On).on('set', function(value, callback) {
    RELAY_BOARD.setPowerOnX(value,1);
    callback(); // Our fake Light is synchronous - this value has been successfully set
});
lights[0].getCharacteristic(Characteristic.On).on('get', function(callback) {
  var err = null; // in case there were any problems
  if (RELAY_BOARD.powerOnX[0]) {
    console.log("Are we on? Yes.");
    callback(err, true);
  } else {
    console.log("Are we on? No.");
    callback(err, false);
  }
});

lights[1].getCharacteristic(Characteristic.On).on('set', function(value, callback) {
    RELAY_BOARD.setPowerOnX(value,2);
    callback(); // Our fake Light is synchronous - this value has been successfully set
});
lights[1].getCharacteristic(Characteristic.On).on('get', function(callback) {
  var err = null; // in case there were any problems
  if (RELAY_BOARD.powerOnX[1]) {
    console.log("Are we on? Yes.");
    callback(err, true);
  } else {
    console.log("Are we on? No.");
    callback(err, false);
  }
});

lights[2].getCharacteristic(Characteristic.On).on('set', function(value, callback) {
    RELAY_BOARD.setPowerOnX(value,3);
    callback(); // Our fake Light is synchronous - this value has been successfully set
});
lights[2].getCharacteristic(Characteristic.On).on('get', function(callback) {
  var err = null; // in case there were any problems
  if (RELAY_BOARD.powerOnX[2]) {
    console.log("Are we on? Yes.");
    callback(err, true);
  } else {
    console.log("Are we on? No.");
    callback(err, false);
  }
});

lights[3].getCharacteristic(Characteristic.On).on('set', function(value, callback) {
    RELAY_BOARD.setPowerOnX(value,4);
    callback(); // Our fake Light is synchronous - this value has been successfully set
});
lights[3].getCharacteristic(Characteristic.On).on('get', function(callback) {
  var err = null; // in case there were any problems
  if (RELAY_BOARD.powerOnX[3]) {
    console.log("Are we on? Yes.");
    callback(err, true);
  } else {
    console.log("Are we on? No.");
    callback(err, false);
  }
});
