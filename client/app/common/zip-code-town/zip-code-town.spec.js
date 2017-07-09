import ZipCodeTownModule from './zip-code-town.module'
import $ from 'jquery';

describe('ZipCodeTownModule', () => {
  let $rootScope, $state, $location, $componentController, $compile, $httpBackend, authRequestHandler;
  const content = 'a\tb\n\c\t\d';
  const contentParsed = [{zipCode: 'a', town: 'b'}, {zipCode: 'c', town: 'd'}];

  beforeEach(window.module(ZipCodeTownModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $location = $injector.get('$location');
    $compile = $injector.get('$compile');
    $httpBackend = $injector.get('$httpBackend');

    authRequestHandler = $httpBackend
      .when('GET', 'data/zip-codes/01.txt')
      .respond(content);
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      controller = $componentController('zipCodeTown', {
        $scope: $rootScope.$new()
      });
    });

    it('has a `zipCodeTowns` property', () => { // erase if removing this.name from the controller
      expect(controller).to.have.property('zipCodeTowns');
    });

    it('normalizeZipCode() method', () => {
      expect(controller.normalizeZipCode(' a1 ')).to.eq('1');
    });
  });

  describe('View', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<zip-code-town></zip-code-town>')(scope);
      scope.$apply();
    });

    it('check `input` field in template', () => {
      expect($(template).find('input[ng-model="$ctrl.zipCode"]').length).to.eq(1);
    });

  });

  describe('Service', () => {

    let service;

    beforeEach(inject(function(zipCodeTownService){
      service = zipCodeTownService;
    }));

    it('check `zipCodeTownService._parseZipCodeTownContent()`', () => {
      const result = service
        ._parseZipCodeTownContent(content);
      const expectedResult = contentParsed;
      expect(_.isEqual(result, expectedResult)).to.eq(true);
    });

    it('check `zipCodeTownService.getList(\'\')`', () => {
      let result;

      service
        .getList('')
        .then(response => {
          result = response;
        })
        .finally(() => {
          expect(_.isEqual(result, [])).to.eq(true);
        });

      $rootScope.$apply(); // promises are resolved/dispatched only on next $digest cycle

    });

    it('check `zipCodeTownService.getList(\'012\')`', () => {
      let result;

      service
        ._getZipCodeTowns('01')
        .then(response => {
          result = response;
        })
        .finally(() => {
          expect(_.isEqual(result, contentParsed)).to.eq(true);
        });
      $httpBackend.flush();


    });
  });
});
