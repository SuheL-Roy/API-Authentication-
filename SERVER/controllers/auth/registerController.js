import Joi from "joi";
import { User } from "../../Models";
import bcrypt from "bcrypt";
import JWtService from "../../Services/JwtService";
import CustomErrorHandler from "../../Services/CustomErrorHandler.js";

const registerController = {
  async register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: Joi.ref("password"),
    });

    //console.log(req.body);
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alredyExist("this email is already Exist.")
        );
      }
    } catch (err) {
      return next(err);
    }

    const { name, email, password } = req.body;

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedpassword,
    });

    let acces_token;

    try {
      const result = await user.save();
      acces_token = JWtService.sign({ _id: result._id, role: result.role });
    } catch (err) {}

    res.json({ acces_token: acces_token });
  },
};

export default registerController;
