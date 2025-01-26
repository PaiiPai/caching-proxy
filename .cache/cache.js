class Cache {
	constructor(origin) {
		this.origin = origin;
		this.data = {};
	}

	save(path, response) {
		// Save the value in the cache
		this.data[path] = response;
	}

	get(path) {
		// Retrieve saved data from the cache
		return this.data[path];
	}
}

module.exports = Cache;
