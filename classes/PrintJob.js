const Job = require('./Job');

class PrintJob extends Job {
    constructor(message, sleepTime, callback){
        super()
        this.message = message;
        this.sleepTime = sleepTime;
        this.callback = callback;
    }
    run(sleepTime){
        setTimeout(() => {
            this.emit('end', this)
            this.callback(this.jobId);
            console.log('end job:', this.jobId, this.timestamp)
        }, sleepTime)
    }
}

const createJob = (sleepTime=1000, message=`create ${new Date()}`, callback=()=>{}) => {
    return new PrintJob(message, sleepTime, callback);
}

module.exports = createJob;