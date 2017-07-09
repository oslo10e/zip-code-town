import _ from 'lodash';

/* max result count */
const resultSize = 10;

/* file path */
const filePath = 'data/zip-codes/';

class zipCodeTownService {
  constructor($http, $q) {
    'ngInject';
    this.$http = $http;
    this.$q = $q;
    this.inCache = {};
  }

  test() {
    return 'a';
  }

  /**
   * Returns zipCodeTowns that corresponds to given `zipCode`
   * @param {String} zipCode beginning of the searched zipped
   * @returns {Promise} Promise that is resolved by an array of {zipCode, town} objects sorted by town name with a maximum of resultSize elements
   */
  getList(zipCode) {
    if (_.isEmpty(zipCode) || zipCode.length < 2) {
      // zipcode too short
      return this.$q.resolve([]);
    }
    const begin = zipCode.substr(0, 2);
    return this
      ._getZipCodeTowns(begin)
      .then(zipCodeTowns => {
        const results = _.chain(zipCodeTowns)
          .filter(zipCodeTown => {
            return _.startsWith(zipCodeTown.zipCode, zipCode);
          })
          .map(zipCodeTown => {
            zipCodeTown.key = `${zipCodeTown.zipCode}-${zipCodeTown.town}`;
            return zipCodeTown;
          })
          .uniqBy('key')
          .slice(0, resultSize)
          .orderBy('town')
          .value();
        return results;
      })
      .catch(e => {
        if (_.get(e, 'status') === 404) {
          // file not found. Return empty array
          return [];
        }
        // unexpected case
        throw e;
      });
  }

  /**
   *
   * @param context
   * @returns {*}
   * @private
   */
  _parseZipCodeTownContent(context) {
    return _.chain(context)
      .split('\n')
      .map(line => {
        const splited = _.split(line, '\t');
        return splited.length > 1 ? {
          zipCode: splited[0],
          town: splited[1]
        } : null;
      })
      .remove()
      .value();
  }

  /**
   * Returns the content of the file that corresponds to zipCode beginning
   * @param {String} begin ZipCode beginning (2 digits)
   * @returns {Promise} Promise that returns containt of json file
   * @private
   */
  _getZipCodeTowns(begin) {
    if (_.has(this.inCache, begin)) {
      /* file already in cache */
      return this.$q.resolve(this.inCache[begin]);
    }
    return this
      .$http
      .get(`${filePath}${begin}.txt`)
      .then(json => {
        const content = _.get(json, 'data');
        this.inCache[begin] = this._parseZipCodeTownContent(content);
        return this.inCache[begin];
      });
  }
}

export default zipCodeTownService;
