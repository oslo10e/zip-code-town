import angular from 'angular';
import zipCodeTownModule from './zip-code-town/zip-code-town.module';

const commonModule = angular
  .module('app.common', [
    zipCodeTownModule
  ])
  .name;

export default commonModule;
