import { JWR_SECRET } from "../config";
import jwt from 'jsonwebtoken';

 


 class JWtService {
     
    static sign( payload , expiry = '60s', secret = JWR_SECRET){
        
        return jwt.sign(payload,secret, {expiresIn: expiry});

    }
 }

 export default JWtService;