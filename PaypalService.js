/**
 * Created by Aureliano on 23/02/2016.
 * This is the PaypalService class
 */

'use strict';
const MODULE_NAME = 'PaypalService';
const querystring = require('querystring');
const request = require('request');
const underscore = require('underscore');
const assert = require('assert');

// Paypal Sandbox API host
var SANDBOX_API_HOST    = process.env.PAYPAL_SANDBOX_API_HOST || 'https://api-3t.sandbox.paypal.com/nvp';
// Paypal Production API host
var PRODUCTION_API_HOST = process.env.PAYPAL_PRODUCTION_API_HOST || 'https://api-3t.paypal.com/nvp';
// Paypal API version
var API_VERSION         = process.env.PAYPAL_API_VERSION || '109.0';
// Paypal Sandbox Payment host
var SANDBOX_PAY_URL     = process.env.PAYPAL_SANDBOX_PAY_HOST || 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=';
// Paypal Production Payment host
var PRODUCTION_PAY_URL  = process.env.PAYPAL_PRODUCTION_PAY_HOST || 'https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=';


/**
 * Paypal Service
 */
class PaypalService{

    /**
     * Instanciate a new paypal service
     * @param username api username
     * @param password api password
     * @param signature api signature
     * @param production flag for enable production use (default is sandbox)
     */
    constructor(username,password,signature,production){

        assert(username,MODULE_NAME + ': API Username is required');
        assert(password,MODULE_NAME + ': API password is required');
        assert(signature,MODULE_NAME + ': API signature is required');

        // init
        this.user = username;
        this.pwd = password;
        this.signature = signature;
        this.sandbox = !production;
    }

    /**
     * Ask Authorization to paypal servers for SetExpressCheckout
     * @param amount
     * @param currencycode e.g. EUR
     * @param cancelUrl
     * @param returnUrl
     * @param options extra options
     * @param onComplete call back actions
     */
    askAuthorization(amount,currencycode,cancelUrl,returnUrl,options,onComplete){

        assert(amount,MODULE_NAME + ': Numeric amount is required');
        assert(currencycode,MODULE_NAME + ': currencycode is required' );
        assert(cancelUrl,MODULE_NAME + ': cancelUrl is required');
        assert(returnUrl,MODULE_NAME + ': returnUrl is required')

        // create option
        var opt = {
            'PAYMENTREQUEST_0_PAYMENTACTION':'Authorization',
            'PAYMENTREQUEST_0_AMT':amount,
            'PAYMENTREQUEST_0_CURRENCYCODE':currencycode,
            cancelUrl,
            returnUrl,
        };

        // merge with additional option
        if(options){
            opt = underscore.extend(opt,options);
        }

        // fire request
        this.request(opt,'SetExpressCheckout',onComplete);
    }

    /**
     * Ask GetExpressCheckoutDetails to paypal
     * @param token of the transaction
     * @param option extra options
     * @param onComplete callback action
     */
    askExpressCheckoutDetails(token,options,onComplete){

        // validate token
        assert(token,MODULE_NAME + ': Token is required');

        var opt = {
            'TOKEN':token
        };

        // merge with additional option
        if(options){
            opt = underscore.extend(opt,options);
        }

        // fire request
        this.request(opt,'GetExpressCheckoutDetails',onComplete);
    }

    /**
     * Confirm payment authorization on paypal server
     * @param token transaction
     * @param payerid from the returnUrl of the Authorization or from the ExpressCheckoutDetails
     * @param amount
     * @param currencycode
     * @param option extra options
     * @param onComplete callback
     */
    doExpressCheckoutPayment(token,payerid,amount,currencycode,options,onComplete){

        assert(token,MODULE_NAME + ': Token is required');
        assert(payerid,MODULE_NAME + ': payer id is required' );
        assert(amount,MODULE_NAME + ': Numeric amount is required');
        assert(currencycode,MODULE_NAME + ': currencycode is required' );

        var opt = {
            'PAYMENTREQUEST_0_PAYMENTACTION':'Authorization',
            'TOKEN':token,
            'PAYERID':payerid,
            'PAYMENTREQUEST_0_CURRENCYCODE':currencycode,
            'PAYMENTREQUEST_0_AMT':amount
        };

        // merge with additional option
        if(options){
            opt = underscore.extend(opt,options);
        }

        // fire request
        this.request(opt,'DoExpressCheckoutPayment',onComplete);
    }

    /**
     * Execute the doCapture of the amount
     * @param transationID from the doExpressCheckoutPayment transaction
     * @param amount authorized
     * @param currencycode
     * @param options extra options
     * @param onComplete callback
     */
    doCapture(transationID,amount,currencycode,options,onComplete){

        assert(transationID,MODULE_NAME + ': transation ID is required' );
        assert(amount,MODULE_NAME + ': Numeric amount is required');
        assert(currencycode,MODULE_NAME + ': currencycode is required' );

        var opt = {
            'COMPLETETYPE':'Complete',
            'AUTHORIZATIONID':transationID,
            'AMT':amount,
            'CURRENCYCODE':currencycode
        };

        // merge with additional option
        if(options){
            opt = underscore.extend(opt,options);
        }

        // fire request
        this.request(opt,'DoCapture',onComplete);
    }

    /**
     * Execute the doVoid of the amount
     * @param transationID from the doExpressCheckoutPayment transaction
     * @param options extra option
     * @param onComplete callback
     */
    doVoid(transationID,options,onComplete){

        assert(transationID,MODULE_NAME + ': transation ID is required' );

        var opt = {
            'AUTHORIZATIONID':transationID
        };

        // merge with additional option
        if(options){
            opt = underscore.extend(opt,options);
        }

        // fire request
        this.request(opt,'DoVoid',onComplete);
    }

    /**
     * get the paypalUrl
     * @returns {*}
     */
    get paypalUrl(){
        if(this.sandbox){
            return SANDBOX_API_HOST;
        }else{
            return PRODUCTION_API_HOST;
        }
    }

    /**
     * Read the transaction ID to Capture / Void
     * @param body from the doExpressCheckoutPayment
     * @returns the value of the transation id
     */
    readTransactionIDFromAuthBody(body){
        var obj = {};
        if(underscore.isString(body)){
            obj = this.objectify(body);
        }
        return obj.PAYMENTINFO_0_TRANSACTIONID;
    }
    /**
     * generate the payment url
     * @param token
     * @returns {*}
     */

    generatePaymentUrl(token){
        if(this.sandbox){
            return SANDBOX_PAY_URL + token;
        }else{
            return PRODUCTION_PAY_URL + token;
        }
    }

    /**
     * generate the payment url from body object
     * @param token
     * @returns {*}
     */
    generatePaymentUrlFromBody(body){
        return this.generatePaymentUrl(body.TOKEN);
    }

    /**
     * generate the payment url from body object
     * @param token
     * @returns {*}
     */
    generatePaymentUrlFromRaw(rawbody){
        var body = this.objectify(rawbody);
        return this.generatePaymentUrlFromBody(body);
    }

    /**
     * Convert body to object
     * @param body
     * @returns {{}}
     */
    objectify(body){
        if(!body){
            return {};
        }else{
            let pairArray = body.split('&')
            let object = {};
            for(let i=0; i<pairArray.length; i++){
                var line = pairArray[i];
                if(line){
                    var splittedLine = line.split('=');
                    object[splittedLine[0]]=splittedLine[1];
                }
            }
            return object;
        }
    }

    /**
     * perform request
     */
    request(options, method, onComplete){

        var form = {
            USER: this.user,
            PWD: this.pwd,
            SIGNATURE: this.signature,
            VERSION: API_VERSION,
            METHOD: method
        };

        form = underscore.extend(form,options);

        var formData = querystring.stringify(form);
        var contentLength = formData.length;

        request({
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            uri: this.paypalUrl,
            body: formData,
            method: 'POST'
        }, function (err, res, body) {
            if(res.statusCode==200){
                onComplete(null,body);
            }else{
                onComplete(err,{res,body});
            }
        });
    }

};

/** Exports */
module.exports = PaypalService;


