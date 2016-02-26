/**
 * Created by Aureliano on 26/02/2016.
 */

/** mocha test */
var assert = require('assert');
var underscore = require('underscore');

var user_api = process.env.PAYPAYL_USER || 'enter user here';
var user_pwd = process.env.PAYPAL_PWD || 'enter pwd here'
var signature = process.env.PAYPAL_SGNT || 'enter signature here';
var detailTransactionID = 'EC-65E14382U5340314U';
var payerID = '7VTM5VUVX4BHW';

/** TEST COVERAGE IS ONLY FOR SANDBOX ENVIROMENT */

describe('Class Instance', function () {

    var PayPalService = require('../PaypalService');
    var obj = new PayPalService(user_api,user_pwd,signature);

    it('should be a paypayl instance', function(){
        var desc = obj instanceof PayPalService;
        assert.equal(desc,true);
    });

    it('should use sandboxmode as default',function(){
        assert.equal(obj.sandbox,true)
    });

    var objP =  new PayPalService(user_api,user_pwd,signature,true);
    it('should use production as setted',function(){
        assert.equal(objP.sandbox,false)
    });
});

describe('Invoke Paypal',function() {
    var PayPalService = require('../PaypalService');
    var obj = new PayPalService(user_api,user_pwd,signature);

    it('should askAuthorization',function(){
        obj.askAuthorization(
            100,
            'EUR',
            'http://digitalx.it/',
            'http://digitalx.it/',
            { },
            function onOk(err,res){
                if(err)throw err;
                console.log(service.generatePaymentUrlFromRaw(res));
                assert.equal(underscore.isString(service.generatePaymentUrlFromRaw(res)),true);
                done();
            });
    });

    it('should askDetails',function(){
        obj.askExpressCheckoutDetails(
            'EC-65E14382U5340314U',
            function onOk(err,res){
                if(err)throw err;
                assert.equal(obj.objectify(res).ACK,'success');
                done();
            });
    });

    it('should askDetails',function(){
        obj.askExpressCheckoutDetails(
            detailTransactionID,
            function onOk(err,res){
                if(err)throw err;
                assert.equal(obj.objectify(res).ACK,'success');
                done();
            });
    });

    it('should doExpressCheckoutPayment',function(){
        obj.doExpressCheckoutPayment(
            detailTransactionID,
            payerID,
            100,
            'EUR',
            function onOk(err,res){
                if(err)throw err;
                assert.equal(obj.objectify(res).ACK,'success');
                done();
            });
    });

    it('should doCapture',function(){
        obj.doExpressCheckoutPayment(
            detailTransactionID,
            payerID,
            100,
            'EUR',
            function onOk(err,res){
                if(err)throw err;
                assert.equal(obj.objectify(res).ACK,'SuccessWithWarning');
                done();
            });
    });

    it('should fail doVoid of captured transaction',function(){
        obj.doExpressCheckoutPayment(
            detailTransactionID,
            payerID,
            100,
            'EUR',
            function onOk(err,res){
                if(err)throw err;
                assert.equal(obj.objectify(res).ACK,'Failure');
                done();
            });
    });


})
