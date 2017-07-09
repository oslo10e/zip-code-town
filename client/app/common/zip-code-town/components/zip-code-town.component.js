import template from './zip-code-town.html';
import controller from './zip-code-town.controller';
import './zip-code-town.scss';

const searchComponent = {
  bindings: {
    zipCodeTown: '='
  },
  template,
  controller
};

export default searchComponent;
