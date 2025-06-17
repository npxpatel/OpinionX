import { OrderBook, stock_balance, stockType, inr_balance } from "../schema";

export function buy(userId : string, stockSymbol : string, quantity : number, price : number, stockType : stockType){

    let response = "Order placed successfully";

    if(OrderBook[stockSymbol]){
        const altType = stockType === "yes" ? "no" : "yes";
        const altPrice = 1000 - price;

        const obj = OrderBook[stockSymbol][stockType];
        const keys = Object.keys(obj);

        
        const orderPrice = quantity * price;
        if(inr_balance[userId] && inr_balance[userId].balance < orderPrice){
            response = "not enough balance";
            return response;
        }


        if(keys.length == 0){
            inr_balance[userId].balance -= orderPrice;
            inr_balance[userId].locked += orderPrice;
            createOrder(userId, stockSymbol, quantity, altPrice, altType, "buy");
            response = "Bid placed successfully";
            return response;
        }

        
        if(price < Number(keys[0])){
            inr_balance[userId].balance -= orderPrice;
            inr_balance[userId].locked += orderPrice;
            createOrder(userId, stockSymbol, quantity, altPrice, altType, "buy");
            response = "Bid placed successfully";
            return response;
        }


        let remainingQuantity = quantity;
        for(let key in obj){
            const value = Number(key);
            if(remainingQuantity === 0){
                break;
            }
            
            if(value <= price && remainingQuantity != 0){
                const orders = OrderBook[stockSymbol][stockType][value].orders;
                while(orders.length > 0){
                    const Seller = orders[0].user;
                    const SellerType = orders[0].type;
                    const SellerQuantity = orders[0].quantity;

                    if(SellerQuantity >= remainingQuantity){
                        transaction(userId, Seller, SellerType, remainingQuantity, value, stockType, stockSymbol, altType);
                        if(orders[0].quantity === 0){
                            orders.shift();
                        }
                        remainingQuantity = 0;
                        break;
                    }
                    else {
                        transaction(userId, Seller, SellerType, SellerQuantity, value, stockType, stockSymbol, altType);
                        orders.shift();
                        remainingQuantity -= SellerQuantity;
                    }
                }
            }
        }

        if(remainingQuantity > 0) {
             const cost = remainingQuantity * price;
             inr_balance[userId].balance -= cost;
             inr_balance[userId].locked += cost;
             createOrder(userId, stockSymbol, remainingQuantity, altPrice, altType, "buy");
             response = `${quantity - remainingQuantity} matched instantly, ${remainingQuantity} bid placed (₹${cost} locked)`;
            return response;
       }

        return response;
    }
}



export function createOrder(userId : string, stockSymbol : string, quantity : number, price : number, stockType : stockType, type : "buy" | "sell") {
    if(!OrderBook[stockSymbol][stockType][price]){
        OrderBook[stockSymbol][stockType][price] = {
            total : 0,
            orders : []
        }
    }

    OrderBook[stockSymbol][stockType][price].total += quantity;
    const order = {
        user : userId,
        type,
        quantity
    }

    OrderBook[stockSymbol][stockType][price].orders.push(order);
}


export function transaction(userId : string, sellerId : string, sellerType : "buy" | "sell", quantity : number, price : number, stockType : stockType, stockSymbol : string, altType : stockType) {
      
    OrderBook[stockSymbol][stockType][price].total -= quantity;
    OrderBook[stockSymbol][stockType][price].orders[0].quantity -= quantity;


    if(sellerType === "buy"){
          // diff btw === and == is that === checks for type as well and == checks for value only


         // seller case : 
        const lockedMoney = (1000 - price) * quantity;
        inr_balance[sellerId].locked -= lockedMoney;

        if(! stock_balance[sellerId]){
            stock_balance[sellerId] = {};
        }
        if(! stock_balance[sellerId][stockSymbol]){
            stock_balance[sellerId][stockSymbol] = {
                "yes" : {
                    quantity : 0,
                    locked : 0,
                },
                "no" : {
                    quantity : 0,
                    locked : 0,
                }
            }
        }
        stock_balance[sellerId][stockSymbol][altType].quantity += quantity;


        // buyer case :
        if(! stock_balance[userId]){
            stock_balance[userId] = {};
        }

        if(! stock_balance[userId][stockSymbol]){
            stock_balance[userId][stockSymbol] = {
                "yes" : {
                    quantity : 0,
                    locked : 0,
                },
                "no" : {
                    quantity : 0,
                    locked : 0,
                }
            }
        }

        stock_balance[userId][stockSymbol][stockType].quantity += quantity;
        inr_balance[userId].balance -= price * quantity;

    }
    else{
         
        // seller case :
      //  sell yes -> someone who is selling no -> if no one is there -> we place a bid for sell no for alt price
        

        stock_balance[sellerId][stockSymbol][stockType].locked -= quantity;
        
        if(! stock_balance[sellerId][stockSymbol]){
            stock_balance[sellerId][stockSymbol] = {
                "yes" : {
                    quantity : 0,
                    locked : 0,
                },
                "no" : {
                    quantity : 0,
                    locked : 0,
                }
            }
        }
        inr_balance[sellerId].balance += price * quantity;


        //buyer case :
        stock_balance[userId][stockSymbol][altType].locked += quantity;
        inr_balance[userId].balance -= price * quantity;

    }
}
