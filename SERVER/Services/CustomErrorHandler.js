
class CustomErrorHandler extends Error {
    constructor(status , msg){
        super();
        this.status = status;
        this.message = msg;

    }
    static alredyExist (message){
        return new CustomErrorHandler(409, message)

    }
    static wrongcredentials (message = 'Username or Password not valid'){
        return new CustomErrorHandler(401, message)

    }
}

export default CustomErrorHandler;