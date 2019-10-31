module.exports = {
	async searchFor(term) {
    // In your custom functions file, call driver functions with 'this'
    // instead of 'driver'
		await this.visit('/');
    await this.typeInto('input[name="q"]', term);
    await this.click('input[value="Google Search"][type="submit"]');
	}
}
