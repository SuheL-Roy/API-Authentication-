
import Joi from 'joi';
import { User } from '../../Models';
import CustomErrorHandler from '../../Services/CustomErrorHandler';
import bcrypt from 'bcrypt';
import JWtService from '../../Services/JwtService';

const loginController = {

    async login(req, res , next){

        const loginSchema = Joi.object({
         email: Joi.string().email().required(),
         password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required()

        });
        const {error } = loginSchema.validate(req.body);

        if(error){
            return next(error);
        }
        
        try{
            const user = await User.findOne({ email: req.body.email })
            if(!user){
                return next(CustomErrorHandler.wrongcredentials());
            }
            const match = await bcrypt.compare(req.body.password, user.password);
            if(!match){
                return next(CustomErrorHandler.wrongcredentials());

            }
          const  acces_token = JWtService.sign({ _id: user._id, role: user.role });
           
          res.json({acces_token: acces_token});


        }catch(err){
            return next(err)

        }
    }

};

export default loginController;