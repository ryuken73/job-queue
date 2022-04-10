const Job = require('./Job');
const {execFile} = require('child_process');

class ForkJob extends Job {
    constructor(cmd, callback){
        super()
        this.cmd = cmd;
        this.callback = callback;
    }
    run(args){
        console.log(`start process: "${this.cmd} ${args.join(' ')}"`);
        const child = execFile(this.cmd, args, (error, stdout, stderr) => {
            if(error){
                console.log(error)
                this.emit('error', error)
            }
            console.log(stdout)
            console.log(stderr)
        })
        child.on('exit', () => this.emit('end'))
    }
}

const createJob = (cmdString, callback=()=>{}) => {
    return new ForkJob(cmdString, callback);
}

module.exports = createJob;