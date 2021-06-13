
import express  from 'express'
import { APP_PORT , DB_URL } from './config/index.js';
import routes from './Routes/index.js';
import errorHandler from './middlewares/errorHandeling.js'
import  mongoose  from 'mongoose';

const app = express();
app.use(express.json());

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




app.use('/api', routes);


app.use(errorHandler);

app.listen(APP_PORT , () => console.log(`listening on port ${APP_PORT}`));