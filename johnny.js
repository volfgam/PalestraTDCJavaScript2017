// Johnny-Five
var five = require("johnny-five");
var board = new five.Board();

//Express
var express = require('express');
var app = express();
var server = app.listen(8012);
console.log('Servidor Express Iniciado');

var valorLeituraLuz = 0;
var temperatura = 0;
var rele = false;

app.get('/leSensorLuz', function(req, res){
  console.log('Luminozidade: ' + valorLeituraLuz);
  res.send(valorLeituraLuz.toString());
});

app.get('/temperatura', function(req, res){
  console.log('temperatura: ' + temperatura);
  res.send(temperatura.toString());
});

app.get('/pulse', function(req, res){
  // Create a standard `led` component
  // on a valid pwm pin
  var led = new five.Led(11);
  led.pulse();
  setTimeout(function() {
    // stop() terminates the interval
    // off() shuts the led off
    led.stop().off();
  }, 10000);
  res.send('ok');
});


app.get('/rele', function(req, res){
  console.log('rele: ' + req.query.ligado);
  rele = req.query.ligado;
  res.send(rele.toString());
  var relay = new five.Relay(7);
  if (rele == 'true')
  {
    relay.on();
  } 
  if (rele == 'false') {
    relay.off();
  }
  
});

board.on("ready", function () {
  // Create a new `photoresistor` hardware instance.
  photoresistor = new five.Sensor({
    pin: "A13",
    freq: 250
  });

  // "data" get the current reading from the photoresistor
  photoresistor.on("data", function () {
    valorLeituraLuz = this.value; 
    //console.log(this.value);
  });

  //Termometro
  var thermometer = new five.Thermometer({
    controller: "GROVE",
    pin: "A14"
  });

  thermometer.on("data", function() {
    if (temperatura === Math.round(this.celsius)) {
      return;
    }

    temperatura = Math.round(this.celsius);
  });

  

});