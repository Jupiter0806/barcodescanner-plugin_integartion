/**
 * Created by jupiterli on 16/11/2016.
 */

(function() {

  starter
    .service('BarcodescannerService', [BarcodescannerService]);

  function BarcodescannerService(LogService) {

    var service = null;
    var isInitialised = false;

    function isServiceAvailable() {
      return isInitialised && service;
    }

    function log(content) {
      console.log('BarcodescannerService:' + content);
      return 'BarcodescannerService:' + content;
    }

    /* ***********************************************************************************************
     *
     * public function
     *
     * ************************************************************************************************/

    return {
      init : function () {
        if (cordova && cordova.plugins && cordova.plugins.barcodeScanner) {
          service = cordova.plugins.barcodeScanner;
        }

        isInitialised = true;
      },

      /**
       * success callback with the context
       *
       * */
      scan : function (onSuccess, onError) {
        if (isServiceAvailable()) {
          service.scan(
            function (result) {
              alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
              onSuccess(result.text);
            },
            function (error) {
              alert("Scanning failed: " + error);
              onError(error);
            },
            {
              "preferFrontCamera" : false, // iOS and Android
              "showFlipCameraButton" : true, // iOS and Android
              "prompt" : "Place a barcode inside the scan area", // supported on Android only
              "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
              "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
            }
          );
        } else {
          onError(log("Service is not available."));
        }
      },

      /**
       * @description
       * Fro now only support text encode as hard coded the encode type.
       *
       * success callback with the img url, the img is located in tmp directory on ios, and it will be replaced by newer
       *  encodings.
       *
       * */
      encode : function (text, onSuccess, onError) {
        if (isServiceAvailable()) {
          service.encode(service.Encode.TEXT_TYPE, text, function(success) {
              alert("encode success: " + success);
              onSuccess(success.file);
            }, function(fail) {
              alert("encoding failed: " + JSON.stringify(fail));
              onError(fail);
            }
          );
        } else {
          onError(log("Service is not available."));
        }
      }
    }
  }

})();
