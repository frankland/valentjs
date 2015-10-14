export default (controller) => {
  let name = controller.getName();
  let module = controller.getModule();

  let configuration = {

  };

  return {
    name,
    module,
    configuration
  }
}
