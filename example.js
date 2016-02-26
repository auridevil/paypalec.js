/**
 * Created by Aureliano on 25/02/2016.
 */
var PaypalService = require('./PaypalService');

var service = new PaypalService('pizzayou_api1.digitalx.it','T92JSTXZTA7659CT','Ay.TmA7v2LvvkCfDz98JoqaEbXqyA1Lt8jIpoaOieCvmlJiHfJ.CC.XZ');

var opt = {
'PAYMENTREQUEST_0_PAYMENTACTION':'Authorization',
    'PAYMENTREQUEST_0_AMT':200,
    'PAYMENTREQUEST_0_CURRENCYCODE':'EUR',
    'cancelUrl':'http://pu-libraryservice-test.azurewebsites.net/api/v1/printget',
    'returnUrl':'http://pu-omsservice-test.azurewebsites.net/api/v1/printget',
    'NOSHIPPING':1,
    'ADDROVERRIDE':0,
    'LOGOIMG':'https://pu-imageservice-test.azurewebsites.net/api/Image?id=56cdd74c7143948f58a2383e&width=60'
}

service.askAuthorization(
    100,
    'EUR',
    'http://pu-libraryservice-test.azurewebsites.net/api/v1/printget',
    'http://pu-omsservice-test.azurewebsites.net/api/v1/printget',
    {'NOSHIPPING':1,
        'ADDROVERRIDE':0,
        'LOGOIMG':'https://pu-imageservice-test.azurewebsites.net/api/Image?id=56cdd74c7143948f58a2383e&width=60'
    },
    function onOk(err,res){
        "use strict";
        console.log(service.generatePaymentUrlFromRaw(res));
        //var bodyobj = service.objectify(res)
        //console.log(JSON.stringify(bodyobj));
        //console.log(bodyobj.TOKEN);
        //console.log(service.generatePaymentUrl(bodyobj.TOKEN));
    }
);

service.askExpressCheckoutDetails('EC-65E14382U5340314U',{},
    function onOk(err,res) {
        console.log(JSON.stringify(service.objectify(res)));
    }
)

service.doExpressCheckoutPayment('EC-65E14382U5340314U','7VTM5VUVX4BHW',100,'EUR',{},
    function onOk(err,res) {
        console.log(JSON.stringify(service.objectify(res)));
    }
)

service.doCapture('0YC57350RK521171L',100,'EUR',{},
    function onOk(err,res) {
        console.log(JSON.stringify(service.objectify(res)));
    }
)

service.doVoid('0YC57350RK521171L',{},
    function onOk(err,res) {
        console.log(JSON.stringify(service.objectify(res)));
    }
)