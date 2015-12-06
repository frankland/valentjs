import Injector from '../services/injector';
import digest from '../services/digest';



export default class BaseComponentController {

  digest = () => digest(this);
  injector = Injector;

  constructor() {

  }
}
