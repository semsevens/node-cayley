'use strict';

const CommonImport = require('../../util/CommonImport');

const types = ['query', 'shape'];

const Path = require('./Path');
const Query = require('./Query');

class Gizmo {

  constructor(promisify, requestWithDefaultOpts, queryLang) {
    this._promisify = promisify;
    this._request = requestWithDefaultOpts;
    this._queryLang = queryLang;
  }

  type(type) {
    if (!type || types.indexOf(type) === -1) {
      throw new Error("Please pass in valid type, can be: 'query' or 'shape'.");
    }
    const gizmo = new this.constructor(this._promisify, this._request);
    gizmo._query = gizmo._query.bind(gizmo, type);
    return gizmo;
  }

  V() {
    return this._v(Array.prototype.slice.call(arguments));
  }

  Vertex() {
    return this._v(Array.prototype.slice.call(arguments));
  }

  M() {
    return this.Morphism();
  }

  Morphism() {
    const path = new Path(['M', []]);
    return path;
  }

  _v() {
    const query = new Query(['V', arguments[0]], this._promisify);
    query._query = this._query;
    return query;
  }

  _query(type, gizmoText, callback) {
    if (types.indexOf(type) === -1) {
      type = types[0];
    }
    this._request.post({
      uri: '/' + type + '/' + this._queryLang,
      body: gizmoText
    }, (err, res, resBody) => {
      if (err) {
        callback(err);
      } else {
        callback(null, JSON.parse(resBody));
      }
    });
  }

}

module.exports = Gizmo;

