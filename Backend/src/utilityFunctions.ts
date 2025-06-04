import { client } from './redis/start';

export function generateUniqueId(){
    let id = "";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
        id += Math.floor(Math.random() * 10);
    }
    return id;
}

export function queue (endpoint : string, data : object, id : string){
    const queueData = {
        endpoint: endpoint,
        data: data,
        id: id
    }

    console.log("Queueing data:", queueData);
    client.lPush('queue', JSON.stringify(queueData))
}