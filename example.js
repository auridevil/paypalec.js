/**
 * Created by Aureliano on 25/02/2016.
 */
var PaypalService = require('./PaypalService');

var service = new PaypalService(<USER>,<PWD>,<SIGNATURE>);

service.askAuthorization(
    100,
    'EUR',
    'http://digitalx.it/',
    'http://digitalx.it/',
    {
        'NOSHIPPING':1,
        'ADDROVERRIDE':0
    },
    function onOk(err,res){
        "use strict";
        console.log(service.generatePaymentUrlFromRaw(res));
    }
);

service.askExpressCheckoutDetails(<TRANSACTIONID>,{},
    function onOk(err,res) {
        console.log(JSON.stringify(service.objectify(res)));
    }
)

service.doExpressCheckoutPayment(<TRANSACTIONID>,<PAYERID>,100,'EUR',{},
    function onOk(err,res) {
        console.log(JSON.stringify(service.objectify(res)));
    }
)

service.doCapture(<TRANSACTIONID>,100,'EUR',{},
    function onOk(err,res) {
        console.log(JSON.stringify(service.objectify(res)));
    }
)

service.doVoid(<TRANSACTIONID>,{},
    function onOk(err,res) {
        console.log(JSON.stringify(service.objectify(res)));
    }
)