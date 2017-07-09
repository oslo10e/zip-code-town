import angular from 'angular';
import uiRouter from 'angular-ui-router';
import zipCodeTownComponent from './components/zip-code-town.component';
import zipCodeTownService from './services/zip-code-town.service';

const zipCodeTown = angular
  .module('zip-code-town', [
    uiRouter
  ])
  .component('zipCodeTown', zipCodeTownComponent)
  .service('zipCodeTownService', zipCodeTownService)
  .name;

export default zipCodeTown;
