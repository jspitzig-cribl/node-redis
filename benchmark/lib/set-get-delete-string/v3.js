import { createClient } from 'redis-v3';
import { once } from 'events';
import { promisify } from 'util';

export default async (host, { randomString }) => {
    const client = createClient({ host }),
        setAsync = promisify(client.set).bind(client),
        getAsync = promisify(client.get).bind(client),
        delAsync = promisify(client.del).bind(client),
        quitAsync = promisify(client.quit).bind(client);

    await once(client, 'connect');

    return {
        benchmark() {
            return new Promise((resolve, reject) => {
                client.batch()
                    .set(randomString, randomString)
                    .get(randomString)
                    .del(randomString)
                    .exec(() => {
                        resolve();
                    });
            })
        },
        teardown() {
            return quitAsync();
        }
    };

};
