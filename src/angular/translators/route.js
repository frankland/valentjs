export default (route) => {
  let name = route.getName();
  let module = route.getModule();

  let configuration = {

  };

  return {
    name,
    module,
    configuration
  }
}
