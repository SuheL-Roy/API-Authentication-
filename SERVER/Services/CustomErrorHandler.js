
class CustomErrorHandler extends Error {
    constructor(status , msg){
        super();
        this.status = status;
        this.message = msg;

    }
    static alredyExist (message){
        return new CustomErrorHandler(409, message);

    }
    static wrongcredentials (message = 'Username or Password not valid'){
        return new CustomErrorHandler(401, message);

    }
    static unAuthorized (message = 'unAuthorized'){
        return new CustomErrorHandler(401, message);

    }
    static NotFound (message = '404 not found'){
        return new CustomErrorHandler(404, message);

    }
    static serverError (message = 'internal server Error'){
        return new CustomErrorHandler(500, message);

    }

    
}

export default CustomErrorHandler;