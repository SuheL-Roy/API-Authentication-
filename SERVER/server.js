
import express  from 'express'
import { APP_PORT , DB_URL } from './config/index.js';
import routes from './Routes/index.js';
import errorHandler from './middlewares/errorHandeling.js'
import  mongoose  from 'mongoose';
import path  from 'path';

const app = express();



mongoose.connect(DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex:true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log("DB connected...");
});



global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/api', routes);
app.use('/uploads', express.static('uploads'));
app.use(errorHandler);

app.listen(APP_PORT , () => console.log(`listening on port ${APP_PORT}`));