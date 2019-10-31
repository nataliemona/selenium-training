# Selenium

## Resources

DCE Selenium Library  
[https://github.com/harvard-edtech/dce-selenium](https://github.com/harvard-edtech/dce-selenium)

* Our selenium library meant to simplify writing selenium tests.
* Selenium library with wrappers for common driver functions.
* Runs with Chrome, Safari, and Firefox web drivers.
* Takes screenshots accessible in your testing folder after a test runs.


selenium-webdriver documentation  
[https://seleniumhq.github.io/selenium/docs/api/javascript/index.html](https://seleniumhq.github.io/selenium/docs/api/javascript/index.html)

* If the functionality you need is not possible with the dce-selenium functions, you can also use the JavaScript selenium-webdriver.
* If you find you are needing to do something frequently using selenium-webdriver, you should contribute a wrapper function to dce-selenium!

CSS Selector reference 
[https://www.w3schools.com/cssref/css_selectors.asp](https://www.w3schools.com/cssref/css_selectors.asp)


## What is dce-selenium?

### Built on Mocha

Mocha testing uses `describe` and `it`

dce-selenium is built on mocha and uses `describeS` instead of `describe` and `itS` instead of `it`

`describeS` is for grouping

`itS` are test cases

`describeS` can be nested...

```
describeS('galaxy', function() {
  describeS('earth', function() {
    describeS('cambridge', function() {
      itS('birds should fly', function() {
        ...test code...
      });
    });
  });
});
```

### Custom driver functions simplify using selenium

To call a driver function, call await driver.functionName().

| All dce-selenium driver functions are asynchronous. Never call driver function without `await`! |
| ---|

Visit a website:
`await driver.visit('www.website.com');`

Fill out a form:
`await driver.typeInto('#name', 'Mallory');`

Click on an element by css selector:
`await driver.click('#button');`

Or alternatively, click on an element by contents:
`await driver.click('Submit');`

## Element Selection

Write code that identifies the indended elements consistently.


####  Selecting elements with CSS selectors

Many of dce-selenium's driver functions use CSS selectors to identify HTML elements.

| Selector  | Example  | Description |
|-----------|----------|-------------|
| element | 'table'  | Selects all `button` elements.|   
| .class |  '.results' | Elements with class `results`, `table.results`for table with class results. |  
| #id |  'button#name' | Selects `<button id=name/>` | 
| [attribute=value] | 'div[role="navigation"]'  | Selects `<div role="navigation"/>` | 

* Multiple selectors can be chained together in the format `element.class1.class2#id[key="value"]`
* More syntax for CSS selectors: [https://www.w3schools.com/cssref/css_selectors.asp](https://www.w3schools.com/cssref/css_selectors.asp)

Driver functions:

```
// Returns a element object
await driver.getElement('button');

// Returns a bool
await driver.elementExists('button');
await driver.elementAbsent('button');
```

* If multiple elements match your criteria, the first one will be used so make sure your CSS selectors include enough information to uniquely identify your target element!

#### Selecting elements by contents

```
// Returns an object
await driver.getElementByContents('Submit');
await driver.getElementByContents('Submit', 'button');

// Returns a bool
await driver.elementWithContentsExists('Submit', 'button');
await driver.elementWithContentsAbsent('Submit', 'button');
```

#### Selecting elements using relationships

Problem: You want to click the button in line with "Test Assignment 2" but the
button itself has no unique identifiers

`await driver.clickByContents('Submit');` will click the wrong button, it will click the first button element it finds which will be the "Test Assignment 1" button or another button on the same page

```
<div>
	<div class="row>
		<div class="col">
			<h4 class="item-title">Test Assignment 1</h4>
		</div>
		<div class="col item-buttons">
			<button>Submit</button>
		</div>
	</div>
	<div class="row>
		<div class="col">
			<h4 class="item-title">Test Assignment 2</h4>
		</div>
		<div class="col item-buttons">
			<button>Submit</button>
		</div>
	</div>
</div>
```

Solution:

```
// Find the h4 element with contents "Test Assignment 2"
const titleEl = await driver.getElementByContents("Test Assignment 2");

// Use parentOf to find the row div
const col = await driver.parentOf(titleEl);
const row = await driver.parentOf(col);

// Use descendantOf to find the button in this row
const button = await driver.descendantOf(row, 'button');
```

## Interaction

Clicking

```
await driver.click('button');
await driver.clickByContents('Submit', 'button');
```

Typing

```
await driver.typeInto('input#username', 'Mallory');

or

const usernameField = await driver.getElement('input#username');
await driver.typeInto(usernameField, driver.BACKSPACE);
```

Scrolling

```
await driver.scrollTo('div#footer');

or

const footer = await driver.getElement('div#footer');
await driver.scrollTo(footer);
```

## Rendering and Timing

This finicky and one of the biggest challenges when writing selenium tests!

Different browsers render elements in slightly different orders so you will find timing errors as you run your tests in different browsers.

Avoid the case where you receive an error that an element doesn't exist or is not interactable when in fact it just has not rendered yet.

* If a click causes a page transition...
	*	Can you check the URL? Use `await driver.waitForLocation(location);`
	*  If the URL is difficult to check or the app is a single page app (React/CACCL!), you need to cleverly check if elements have rendered.

Many ways to wait:

		// Not recommended to wait for arbitrary units of time
		// But sometimes this is useful for debugging
		await driver.wait([timeout]);
		
		// Wait for specific elements to render
		await driver.waitForElementVisible(cssSelector, [timeout]);
		await driver.waitForElementWithContentsVisible(contents, [cssSelector], [timeout]);
		
		// Wait for url to match
		await driver.waitForLocation(location);

## Development/debugging Tips

* Use `await driver.pause();` for debugging. Either at the end of your test or right before your error. Don't forget to remove it later.
* Use `Date.now()` to generate a unique identifier for something you create during your test. This makes it easier to check if your test generated the item.
* Try to get your test working in one browser first.
* Use the snapshots (automatically generated and placed in `test/selenium/snapshots/`).
* Insert `.only` after `describeS` or `itS` to test one test at a time.
* Log `await driver.getElementInnerHTML(await driver.parentOf(element));`

# Practice

## Set up a practice project

1. Update to the latest version with `npm i -g npm`.

2. Create a folder for selenium training and cd into it.

3. Create a NPM project: `npm init`, use the defaults for everything (when prompted to enter a package name, etc)

4. Install dce-selenium: `npm install dce-selenium`

5. Add dce-selenium to your NPM project: `npm init dce-selenium`

6. You should now have a `test` folder, create the folder `test/selenium` and cd into it.

7. Create a file `test/selenium/example.js`


## Write your first test

In example.js

Import dce-selenium `require('dce-selenium');`

```
describeS('Test google', function () {
  itS('Visits google', async function (driver) {
    await driver.visit('https://www.google.com');
  });
});
```

## Run your test

`npm run selenium` to run tests on Chrome, Firefox, and safari

Run your test on a specific browser  
`npm run selenium --chrome`   
`npm run selenium --firefox`   
`npm run selenium --safari`  

Run your test on headless Chrome
`npm run selenium --headless-chrome`

After you run your test, look in your test folder, you should see a new folder called "snapshots" with screenshots from while your test was executing.


## Do a Google search

1. Set a default host

	Create a `config.json`
	
		{ "defaultHost": "www.google.com" }
		
2. Navigate to google

3. Search for something

4. Verify that you reached the results page for that search

5. Navigate to a link in the search results or another page in the search results and verify that your reach your intended destination

## Custom functions

In your `test/selenium` folder create a file called `commands.js`.

Here you can write custom functions that can be used by multiple tests.

Inside `commands.js`, instead of calling `await driver.func()` use `await this.func()`.

	module.exports = {
		async searchFor(term) {
			await this.visit(...);
			// your code here
		},
		async anotherCustomFunction() {
		},
	}
	
In `example.js`

	describeS('Test google', function () {
  		itS('Navigates in google search results', async function (driver) {
    		await driver.searchFor('cats');
    		// more testing code
    	});
 	 });
 	 
## CACCL Course Admin Tools

Shared `course-admin-tools/test/selenium` folder?

Shared config `config.json` and custom functions `commands.js`?

Please suggest or contribute new functions! Driver functions are defined in `classes/Driver.js` in the `harvard-edtech/dce-selenium` repo.