const request = require('request');
const schedule = require('node-schedule');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

module.exports = function monitoring(url, timer) {
    class CheckSite {
        constructor(url) {
            this.url = url;
            this.scheduleCheck();
        }

        scheduleCheck() {
            schedule.scheduleJob(`*/${timer} * * * * *`, () => {
                this.check();
            });
        }

        check() {
            request(this.url, (err, res, body) => {
                if (err) {
                    console.log(`Site down (Error : ${err.code})`);
                    logger.info(`Site down (Error : ${err.code})`);
                } else {
                    console.log(`Site up (Status Code : ${res.statusCode})`);
                    logger.info(`Site up (Status Code : ${res.statusCode})`);
                }
            });
        }
    }
    return new CheckSite(url);
}
