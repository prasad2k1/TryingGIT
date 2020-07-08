/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"PrNamespace/PrName/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});