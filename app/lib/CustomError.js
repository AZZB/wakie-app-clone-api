function ExtendableBuiltin(cls){
    function ExtendableBuiltin(){
        cls.apply(this, arguments);
    }
    ExtendableBuiltin.prototype = Object.create(cls.prototype);
    Object.setPrototypeOf(ExtendableBuiltin, cls);

    return ExtendableBuiltin;
}


class CustomError extends ExtendableBuiltin(Error) {
  constructor(type = "unknown type", reason = "unknown reason", errors = {}, status = 404) {
    super(type)
    this.description = {type, reason, errors, status}
    this.error = "CustomError"
  }

  log() {
    LOG('CustomError description: ', this.description)
  }

  type() {
    return this.description.type
  }

  reason() {
    return this.description.reason
  }

  errors() {
    return this.description.errors
  }

  status() {
    return this.description.status
  }
}


export default CustomError
