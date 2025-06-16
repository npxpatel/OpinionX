import { publish } from './start.js'

export async function publishMessage(channel : string, message : string){
    try{
        await publish.publish(channel, message);
        console.log(`Message published to channel ${channel}: ${message}`);
    }
    catch (error){
        console.error(`Error publishing message to channel ${channel}:`, error);
    }
}