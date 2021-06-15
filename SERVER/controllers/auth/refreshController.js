import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../Models";
import CustomErrorHandler from "../../Services/CustomErrorHandler";
import JWtService from "../../Services/JwtService";

const refreshController = {
  async refresh(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    let refreshtoken;

    try {
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });

      if (!refreshtoken) {
        return next(CustomErrorHandler.unAuthorized("invalid refresh token"));
      }

      let userId;
      try {
        const { _id } = await JWtService.verify(
          refreshtoken.token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (err) {
        return next(CustomErrorHandler.unAuthorized("invalid refresh token"));
      }
      const user = await User.findOne({ _id: userId });

      if(!user){
        return next(CustomErrorHandler.unAuthorized("No user found"));

      }
        const  acces_token = JWtService.sign({ _id: user._id, role: user.role });
          const refresh_token = JWtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

          await RefreshToken.create({ token: refresh_token });
           
          res.json({acces_token: acces_token,refresh_token: refresh_token});

    } catch (err) {
      return next(new Error(" somthing went wrong " + err.message));
    }
  },
};

export default refreshController;
