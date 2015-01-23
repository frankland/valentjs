var colors = [
  '#008EBA',
  '#99CC00',
  '#AA66CC',
  '#FD7400',
  '#723147',
  '#FF5F5F',
  '#AC59D6',
  '#6B5D99',
  '#FFBB33',
  '#FF4444',
  '#1F8A70',
  '#9BCF2E',
  '#004358',
  '#979C9C',
  '#962D3E',
  '#35478C',
  '#5F9C6D',
  '#FD7400',
  '#16193B',
  '#7FB2F0'
];

var counter = 0;

function getColor() {
  if (counter == colors.length) {
    counter = 0;
  }

  return colors[counter++];
}

export default class Logger {
  constructor(background, color){
    this.background = background;
    this.color = color;
  }

  static getNextColor() {
    return getColor();
  }

  setBackgroundColor(background) {
    this.background = background;
  }

  setColor(color) {
    this.color = color;
  }

  log(){
    console.log.apply(console, arguments);
  }

  logColored(message) {
    console.log(`%c ${message}`, `background: ${this.background}; color: ${this.color}`);
  }
}
