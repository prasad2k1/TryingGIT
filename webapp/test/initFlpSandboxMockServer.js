sap.ui.define([
	"../localService/mockserver",
	"./flpSandbox",
	"sap/ui/fl/FakeLrepConnectorLocalStorage",
	"sap/m/MessageBox"
], function (mockserver, flpSandbox, FakeLrepConnectorLocalStorage, MessageBox) {
	"use strict";

	// initialize the mock server
	var aInitializations = [mockserver.init(), flpSandbox.init()];

	Promise.all(aInitializations).catch(function (oError) {
		MessageBox.error(oError.message);
	}).finally(function () {
		FakeLrepConnectorLocalStorage.enableFakeConnector();
	});
});