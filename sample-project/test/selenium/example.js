require('dce-selenium');
const assert = require('assert');

describeS('Test google', function () {
  // To test one function at a time, use itS.only('Search for... '), ...
  itS('Search for cats', async function (driver) {
    // Search for cats, default host www.google.com defined in config.json
    await driver.visit('/');
    await driver.typeInto('input[name="q"]', 'cats');
    await driver.click('input[value="Google Search"][type="submit"]');
    const query = await driver.getQuery();
    assert(query.q = 'cats');

    // Navigate to page 6 in the results
    await driver.scrollTo('div#footcnt');
    await driver.click('a[aria-label="Page 6"]');

    // Make sure you reached expected location
    assert(await driver.elementWithContentsExists('Page 6 of about'));
  });
  itS('Searches using a function from command.js', async function(driver) {
    // searchFor is a custom function defined in commands.js
    await driver.searchFor('dogs');
    const query = await driver.getQuery();
    assert(query.q = 'dogs');
  });
});
