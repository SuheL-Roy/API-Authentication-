import express from 'express';

const router = express.Router();
import auth from '../middlewares/auth.js';
import  {loginController, registerController, userController, refreshController, productController} from '../controllers/index.js';
import admin from '../middlewares/admin.js';

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);
router.post('/refresh', refreshController.refresh);
router.post('/logout',auth, loginController.logout);

router.post('/products', [auth,admin], productController.store);

router.put('/products/:id',[auth,admin], productController.update);
router.delete('/products/:id',[auth,admin], productController.destroyed);

router.get('/products', productController.index);
router.get('/products/:id', productController.show);










export default router;