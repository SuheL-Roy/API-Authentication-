import { Product } from "../Models";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../Services/CustomErrorHandler";
import Joi from "joi";
import fs from "fs";
import productSchema from "../validators/productvalidator";


 const storage = multer.diskStorage({

     destination: (req, file, cb) => cb(null, 'uploads/'),

     filename: (req, file, cb) => {
         const uniqueName = `${Date.now()}-${Math.round(
             Math.random() * 1e9
         )}${path.extname(file.originalname)}`;
        
         cb(null, uniqueName);
     },
 });

 const handleMultipartData = multer({
     storage,
     limits: { fileSize: 1000000 * 5 },
 }).single('image');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) { 
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         console.log(file)
//         cb(null, 'nitesh' + '-' + Date.now() + path.extname(file.originalname));
//     } 
// });

// const fileFilter = (req, file, cb) => {
//     cb(null, true);
// };

// const handleMultipartData = multer({
//     storage: storage,

//     fileFilter: fileFilter,

// }).single('image'); 

const productController = {
    async store(req, res, next) {
      
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            //console.log(req.file);
            const filePath = req.file.path;
            const myStr = filePath;
            const newStr = myStr.replace(/\\/g, '/');
            
           //console.log(newStr);

      const { error } = productSchema.validate(req.body);

      if (error) {
        fs.unlink(`${appRoot}/${newStr}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });
        return next(error);
      }
      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.create({
          name,
          price,
          size,
          image: newStr,
        });
      } catch (err) {
        return next(err);
      }

      res.status(201).json(document);
    });
  },
  update(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      let filePath;

      if (req.file) {
        filePath = req.file.path;
        var myStr = filePath;
        var newStr = myStr.replace(/\\/g, '/');
      }

      const { error } = productSchema.validate(req.body);

      if (error) {
        if (req.file) {
          fs.unlink(`${appRoot}/${newStr}`, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError(err.message));
            }
          });
        }
        return next(error);
      }
      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            name,
            price,
            size,
            ...(req.file && { image: newStr }),
          },
          { new: true }
        );
      } catch (err) {
        return next(err);
      }

      res.status(201).json(document);
    });
  },
  async destroyed(req, res, next) {
    const document = await Product.findByIdAndRemove({ _id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    const imagePath = document._doc.image;
    //console.log(imagePath);
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }
      res.json(document);
    });
    
  },
  async index(req, res, next) {
    let document;
    try {
      document = await Product.find()
        .select("-updatedAt -__v")
        .sort({ _id: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(document);
  },
   async show(req, res, next) {
     let documents;
     try{
      documents = await Product.findOne({_id:req.params.id })
      .select("-updatedAt -__v");


     }catch(err){
       return next(CustomErrorHandler.serverError());
     }

      return res.json(documents);
   }
};

export default productController;
