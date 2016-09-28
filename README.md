paypalec.js 
[![Build Status](https://travis-ci.org/auridevil/paypalec.js.svg?branch=master)](https://travis-ci.org/auridevil/paypalec.js) 

=================
(Yet Another) Library for Paypal Express Checkout for Node.js

Installation
============

The easiest installation is through [NPM](http://npmjs.org):

    npm install paypalec.js
    
Or clone the repo https://github.com/auridevil/paypalec.js and include the `./PaypalService` script.

API
===

Initialize:
    
    var PaypalService = require('paypalec.js');
    var paypalEC = new PaypalService('USER','PWD','SIGNATURE',isProduction);
    
Ask Authorization:
    
    paypalEC.askAuthorization(
        <AMOUNT>,
        <CURRENCYCODE>,
        <cancelURL>,
        <acceptURL,
        {<extraOptions},
        function onOk(err,res){
            if(!err)
                console.log(paypalEC.generatePaymentUrlFromRaw(res));
        });
        
Get Details:

    paypalEC.askExpressCheckoutDetails(<TOKEN>,{},
        function onOk(err,res) {
            if(!err)
                console.log(JSON.stringify(paypalEC.objectify(res)));
        });
        
Do ExpressCheckout Payment:

    paypalEC.doExpressCheckoutPayment(
        <TOKEN>,
        <PAYERID>,
        <AMOUNT>,
        <CURRENCYCODE>,
        {<extraOptions},
        function onOk(err,res) {
            if(!err)
                console.log(JSON.stringify(paypalEC.objectify(res)));
        });
        
Do Capture:

    paypalEC.doCapture(
        <TRANSACTIONID>,
        <AMOUNT>,
        <CURRENCYCODE>,
        {<extraOptions},
        function onOk(err,res) {
            if(!err)
                console.log(JSON.stringify(paypalEC.objectify(res)));
        });

Do Void:

    paypalEC.doVoid(
        <TRANSACTIONID>,
        {<extraOptions},
        function onOk(err,res) {
            if(!err)
                console.log(JSON.stringify(paypalEC.objectify(res)));
        });

Docs
=============

The library is based on the following paypal guide for ExpressCheckout Authorize and Capture:
    https://developer.paypal.com/docs/classic/express-checkout/ht_ec-singleAuthPayment-curl-etc/
    
In the /docs folder you can find a jsDoc of the library with all others methods documented.


Contributions
=============

If you find bugs or want to change functionality, feel free to fork and pull request.

Notes
=====

The library use the es6 language, please make sure your node version supports it (we currently used 4.3.1).



<i>Cheers from digitalx.</i>
