/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Worklist",
	"./pages/App"
], function (opaTest) {
	"use strict";

	QUnit.module("Worklist");

	opaTest("Should see the table with all entries", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyFLPApp({
			intent: "PrTitle-display"
		});

		// Assertions
		Then.onTheWorklistPage.theTableShouldHaveAllEntries().
			and.theTableShouldContainOnlyFormattedUnitNumbers().
			and.theTitleShouldDisplayTheTotalAmountOfItems();
	});

	opaTest("Search for the First object should deliver results that contain the firstObject in the name", function (Given, When, Then) {
		//Actions
		When.onTheWorklistPage.iSearchForTheFirstObject();

		// Assertions
		Then.onTheWorklistPage.theTableShowsOnlyObjectsWithTheSearchStringInTheirTitle();
	});

	opaTest("Entering something that cannot be found into search field and pressing search field's refresh should leave the list as it was", function (Given, When, Then) {
		//Actions
		When.onTheWorklistPage.iSearchForSomethingWithNoResults().
			and.iClearTheSearch();

		// Assertions
		Then.onTheWorklistPage.theTableHasEntries();
	});

	opaTest("Should open the share menu and display the share buttons", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iPressOnTheShareButton();

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheShareEmailButton();

		// Cleanup
		Then.iLeaveMyFLPApp();
	});

});
