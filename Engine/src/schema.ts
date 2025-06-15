export interface OderBook {
    [name : string] : {
        "yes" : {
            [price : number] : {
                total : number,
                orders : {
                    user : string,
                    type : "buy" | "sell",
                    quantity : number,
                }[]
            }
        };
        "no" : {
            [price : number] : {
                total : number,
                orders : {
                    user : string,
                    type : "buy" | "sell",
                    quantity : number,
                }[]
            }
        };
    }
}


export interface Stock_Balance {
    [userId : string] : {
        [name : string] : {
            "yes" : {
                quantity : number,
                locked : number,
            }
            "no" : {
                quantity : number,
                locked : number,
            }
        }
    }
}



export interface user{
    balance : number,
    locked : number,
}


export interface INR_Balance {
    [userId : string] : user;
}


export type stockType = "yes" | "no";

export const OrderBook: OderBook = {};
export const inr_balance : INR_Balance = {
    "probo" : {
        balance: 1000000,
        locked: 0,
    }
}

export const stock_balance : Stock_Balance = {}