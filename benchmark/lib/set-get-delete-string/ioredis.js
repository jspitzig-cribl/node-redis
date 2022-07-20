import Redis from 'ioredis';

export default async (host, { randomString }) => {
    const client = new Redis({
        host,
        lazyConnect: true
    });

    await client.connect();

    return {
        benchmark() {
            return new Promise((resolve, reject) => {
                client.pipeline()
                    .set(randomString, randomString)
                    .get(randomString)
                    .del(randomString)
                    .exec(() => {
                        resolve();
                    });
            });
        },
        teardown() {
            return client.disconnect();
        }
    }
};
