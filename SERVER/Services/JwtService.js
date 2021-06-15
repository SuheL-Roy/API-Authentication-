import { JWR_SECRET } from "../config";
import jwt from 'jsonwebtoken';

 


 class JWtService {
     
    static sign( payload , expiry = '120s', secret = JWR_SECRET){
        
        return jwt.sign(payload,secret, {expiresIn: expiry});

    }
    static verify( token, secret = JWR_SECRET){
        
        return jwt.verify(token, secret);

    }
 }

 export default JWtService;