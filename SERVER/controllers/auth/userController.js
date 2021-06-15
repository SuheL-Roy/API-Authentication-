import { User } from "../../Models";
import CustomErrorHandler from "../../Services/CustomErrorHandler";

const userController = {
   async me(req,res,next){
        try{

            const user = await await User.findOne({_id: req.user._id}).select('-password -updatedAt -__v');
            if(!user){
                return next(CustomErrorHandler.NotFound());

            }
            res.json(user);

        }catch(err){
            return next(err);

        }

    }

}

export default userController;