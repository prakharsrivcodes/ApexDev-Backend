// Custom Error Class to handle operational errors with status codes
// extend keyword is used for inheriting properties of error and error usually contains message and stack trace not status code

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    // constructor is a special method for creating and initializing an object created with a class. It is called when an instance of the class is created.
   
    // super is used to call the constructor of the parent class (Error in this case) and pass the message to it. This allows the ErrorHandler class to inherit the properties and methods of the Error class, including the message and stack trace.
    super(message);

    // this means to refer to curreetn instance
    // in thsi line we simply created a new property called statusCode and assigned the value of the statusCode parameter to it. This allows us to store the HTTP status code associated with the error, which can be useful for sending appropriate responses to clients.
    this.statusCode = statusCode;


// status code is 
    // Capture the stack trace (excluding constructor call from the stack)
    Error.captureStackTrace(this, this.constructor);
    // this.constructor here in 2lines what it does is simply stack error 
    
  }
}

module.exports = ErrorHandler;