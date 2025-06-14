import fs from 'fs';

class Cache {
  constructor(origin, port) {
    this.origin = origin;
    this.port = port || 8000;
    this.clear();
  }

  save(key, value) {
    // Save the value in the cache
    const cachedData = this.get();
    if (key && value !== undefined) {
      cachedData.data[key] = value;
      fs.writeFile('./data.json', JSON.stringify(cachedData), (err) => err && console.error('Error saving in cache: ', err));
    } else {
      console.error('Error saving in cache: Key or value is missing');
    }
  }

  get(path) {
    // Retrieve saved data from the cache
    const jsonFile = fs.readFileSync('./data.json', { encoding: 'utf8' });
    const jsObj = JSON.parse(jsonFile);

    if (!path) {
      return jsObj;
    }
    return jsObj.data[path];
  }

  clear() {
    // Clear all data in this cache instance
    const initData = { origin: this.origin, port: this.port, data: {} }; // initialize cache data
    fs.writeFileSync('./data.json', JSON.stringify(initData));
  }
}

module.exports = Cache;
