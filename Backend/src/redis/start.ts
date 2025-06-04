import { createClient } from 'redis';
export const client = createClient()
export const publish = createClient()
export const subscriber = createClient()


export async function startRedis() {
    try {
        await client.connect();
        console.log('Redis client connected successfully');
        
        await publish.connect();
        console.log('Redis publisher connected successfully');
        
        await subscriber.connect();
        console.log('Redis subscriber connected successfully');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}