import express from 'express';

const router = express.Router();
import  {registerController} from '../controllers/index.js';

router.post('/register', registerController.register);




export default router;