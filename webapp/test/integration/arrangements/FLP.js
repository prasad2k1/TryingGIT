/* eslint-disable sap-no-proprietary-browser-api */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/dom/includeStylesheet",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/fl/FakeLrepConnectorLocalStorage",
	"../../../localService/mockserver",
	"PrNamespace/PrName/test/flpSandbox"
], function (Opa5, HashChanger, includeStylesheet, ODataModel, FakeLrepConnectorLocalStorage, mockserver, flpSandbox) {
	"use strict";

	/**
	 *  Manually set OPA styles when running test with the FLP Sandbox.
	 *  Function is executed after DOM is available
	 *  */
	function fnSetupFLPStyles() {
		// include standard OPA styles
		includeStylesheet(sap.ui.require.toUrl("sap/ui/test/OpaCss.css"));
	}

	// eslint-disable-next-line no-unused-expressions
	document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fnSetupFLPStyles) : fnSetupFLPStyles();

	return Opa5.extend("PrNamespace.PrName.test.integration.arrangements.FLP", {
		/**
		 * Initializes mock server and flp sandbox, then sets the hash intent to simulate pressing on the app tile
		 * @param {object} oOptionsParameter An object that contains the configuration for starting up the app
		 * @param {integer} oOptionsParameter.delay A custom delay to start the app with
		 * @param {string} oOptionsParameter.intent The intent to start the FLP sandbox with initially, may also contain an in-app hash as a shortcut
		 * @param {string} [oOptionsParameter.hash] The in-app hash can also be passed separately for better readability in tests
		 * @param {boolean} [oOptionsParameter.autoWait=true] Automatically wait for pending requests while the application is starting up
		 */
		iStartMyFLPApp: function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};
			oOptions.autoWait = typeof oOptions.autoWait !== "undefined" ? oOptions.autoWait : true;
			// start the app with a minimal delay to make tests fast but still async to discover basic timing issues
			oOptions.delay = oOptions.delay || 1;

			this._clearSharedData();

			// configure mock server with the current options
			var aInitializations = [mockserver.init(oOptions), flpSandbox.init()];

			// Wait for all initialization promises of mock server and sandbox to be fulfilled.
			// After that enable the fake LRepConnector
			this.iWaitForPromise(Promise.all(aInitializations));
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			this.waitFor({
				autoWait: oOptions.autoWait,
				success: function () {
					new HashChanger().setHash(oOptions.intent + (oOptions.hash ? "&/" + oOptions.hash : ""));
				}
			});
		},
		iRestartTheAppWithTheRememberedItem: function (oOptions) {
			this.waitFor({
				success: function () {
					var sObjectId = this.getContext().currentItem.id;
					oOptions.hash = "ProductSet/" + encodeURIComponent(sObjectId);
					this.iStartMyFLPApp(oOptions);
				}
			});
		},
		/**
		 * Navigating to home screen to unload the app component
		 * @returns {sap.ui.test.Opa5.waitFor} Assertion that is always executed
		 */
		iLeaveMyFLPApp: function () {
			return this.waitFor({
				success: function () {
					new HashChanger().setHash("Shell-home");
				}
			});
		},
		_clearSharedData: function () {
			// clear shared metadata in ODataModel to allow tests for loading the metadata
			ODataModel.mSharedData = { server: {}, service: {}, meta: {} };
		}
	});

});
