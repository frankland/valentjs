import Component from '../flow-component';

class Service extends Component {

  constructor(name) {
    super(name);
  }

  src(src) {
    this.config.src = src;
    return this;
  }
}

export default Service;
