import express from 'express';
import { startRedis} from './redis/start';
import getApi from './router/getApi';
import postApi from './router/postApi';

export const app = express()
app.use(express.json());

startRedis();

app.use('/postapi', postApi);
app.use('/getapi', getApi);

app.get("/test", (req, res) =>{
    res.send("Hello World!");
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})