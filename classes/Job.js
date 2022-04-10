const EventEmitter = require('events');
class Job extends EventEmitter {
    constructor(){
        super();
        this.jobId = null;
        this.args = null;
        this.timestamp = {};
    }
    set jobId(id){ this._jobId = id };
    get jobId(){ return this._jobId };
    set args(args){ this._args = args };
    get args(){ return this._args };

    set status(status){ 
        this._status = status;
        this.timestamp[`${status}Time`] = Date.now();
    };
    get status(){ return this._status };

}

module.exports = Job;