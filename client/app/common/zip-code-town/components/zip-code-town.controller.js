import _ from 'lodash';

class SearchController {
  constructor($scope, $timeout, zipCodeTownService) {
    'ngInject';

    this.$scope = $scope;
    this.$timeout = $timeout;
    this.zipCodeTownService = zipCodeTownService;

    this.resultsVisible = false;
    this.noResult = false;
    this.zipCodeTowns = [];

    /**
     * register debounced function that load of zip-code-towns
     */
    this.debounced = _.debounce(this.searchZipCodeTowns, 400);
  }

  /**
   * Retrieve towns relative to `this.zipCode`
   */
  searchZipCodeTowns() {
    this.noResult = false;
    const normalizedZipCode = this.normalizeZipCode(this.zipCode);
    this.zipCodeTownService
      .getList(normalizedZipCode)
      .then(zipCodeTowns => {
        this.noResult = _.isEmpty(zipCodeTowns);
        this.zipCodeTowns = zipCodeTowns;
      });
  }

  /**
   * When zipCode field gets focus
   */
  zipCodeFocus() {
    this.resultsVisible = true;
  }

  /**
   * When zipCode value changes
   */
  zipCodeChange() {
    this.debounced();
    this._setZipCodeTown({});
  }

  /**
   * When zipCode field loses focus
   */
  zipCodeBlur() {
    this.$timeout(() => {
      this.resultsVisible = false;
    }, 200);
  }


  /**
   * Click on zipCodeTown in result list
   * @param {Object} zipCodeTown
   */
  clickZipCodeTown(zipCodeTown) {
    if (!this.resultsVisible) {
      // nothing to do
      return;
    }
    this._setZipCodeTown(zipCodeTown);
  }

  /**
   * Returns normalized zipCode, meaning only with numeric digits
   * @param {String} zipCode
   * @returns {String}
   */
  normalizeZipCode(zipCode) {
    if (_.isEmpty(zipCode) || !_.isString(zipCode)) {
      return '';
    }
    return zipCode.replace(/[^\d]/g, '');
  }

  /**
   * Sets current zipCodeTowns
   * @param {Object} zipCodeTown
   * @private
   */
  _setZipCodeTown(zipCodeTown) {
    if (!_.isPlainObject(this.zipCodeTown)) {
      // initialize zipCodeTown if necessary
      this.zipCodeTown = {};
    }
    this.zipCodeTown.zipCode = _.get(zipCodeTown, 'zipCode');
    this.zipCodeTown.town = _.get(zipCodeTown, 'town');
  }
}

export default SearchController;
