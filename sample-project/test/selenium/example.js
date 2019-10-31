require('dce-selenium');
const assert = require('assert');

describeS('Test google', function () {
  itS('Search for cats', async function (driver){
    await driver.visit('/');
    await driver.typeInto('input[name="q"]', 'cats');
    await driver.click('input[value="Google Search"][type="submit"]');
    const query = await driver.getQuery();
    assert(query.q = 'cats');
    await driver.scrollTo('div#footcnt');
    await driver.click('a[aria-label="Page 6"]');
    assert(await driver.elementWithContentsExists('Page 6 of about'));
  });
});
