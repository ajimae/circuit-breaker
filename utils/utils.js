class Objects {
  constructor() { }
  /**
   * merge all the objects
   * @param  {...any} objects 
   */
  static extend(...objects) {
    return Object.assign({}, ...objects.map(function(v) { return v }))
  }

  /**
   * get all object keys
   * @param {*} object 
   */
  static keys(object) {
    return Object.keys(object)
  }

  /**
   * get all object values
   * @param {*} object 
   */
  static values(object) {
    return Object.values(object)
  }

  /**
   * get all object entries
   * @param {*} object 
   */
  static entries(object) {
    return Object.entries(object)
  }

  // you can add to this list of methods
}

async function ping(list, { fetch }) {
  for (var i = 0; i < list.length; i++) {
    try {
      const response = await fetch(list[i].toString())
      const json = await response.json();

      // return the frist living server
      if (json.success) return list[i]
    } catch (err) {
      continue;
    }
  }

  // no server is alive
  return null;
}

module.exports = {
  Objects,
  ping
}
