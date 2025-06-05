import express from 'express';
import { generateUniqueId, queue} from "../utilityFunctions"
import { subscriber } from '../redis/start';

const router = express.Router();

router.post("/user/create/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = {userId}
    const id = generateUniqueId();

    subscriber.subscribe(id, (message : any) => {
        subscriber.unsubscribe(id);
        res.json({ message });
    })

    queue("/user/create/:userId", data, id);
})


router.post("/symbol/create/:stockSymbol", async (req, res) => {
    const id = generateUniqueId();
    const stockSymbol = req.params.stockSymbol;
    const data = {stockSymbol}
    
    subscriber.subscribe(id, (message : any) => {
        subscriber.unsubscribe(id);
        res.json({ message });
    })

    queue("/symbol/create/:stockSymbol", data, id);
})


// "Onramp" = converting real-world currency (fiat) → in-app balance or digital asset.

router.post("/onramp/inr", async (req, res) => {
    const id = generateUniqueId();
    const {userId, amount} = req.body;
    const paise = amount * 100;
    
    subscriber.subscribe(id, (message : any) => {
        subscriber.unsubscribe(id);
        res.json({ message });
    })

    queue("/onramp/inr", {userId, amount : paise}, id);
})



router.post("/order/buy", async (req, res) => {
    const id = generateUniqueId();
    const {userId, stockSymbol, quantity, price, stockType} = req.body;

    subscriber.subscribe(id, (msg : any) => {
        subscriber.unsubscribe(id);
        res.json({msg});
    })

    queue("/order/buy", {userId, stockSymbol, quantity, price, stockType}, id);
})




router.post("/order/sell", async (req, res) =>{
    const id = generateUniqueId();
    const {userId, stockSymbol, quantity, price, stockType} = req.body;

    subscriber.subscribe(id, (msg : any) => {
        subscriber.unsubscribe(id);
        res.json({msg});
    })

    queue("/order/sell", {userId, stockSymbol, quantity, price, stockType}, id);
})


export default router;