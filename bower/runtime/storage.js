class Register {

  constructor(type){
    this.type = type;
    this.components = [];
  }

  ok(){

  }

  statistics(){
    for (var component of this.components){
      console.log(component.name);
    }
  }
}


export default Register;
