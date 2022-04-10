const STATUS = {
    'PUSHED': 'pushed',
    'PENDING': 'pending',
    'RUNNING': 'running',
    'DONE': 'done',
    'FAIL': 'fail',
}

class JobQueue {
    constructor(maxRunning=3){
        this.jobs = [];
        this.runningJobs = [];
        this.jobIdSequence = 1;
        this.maxRunning = maxRunning
    }
    get runningCount() { 
        return this.runningJobs.length;
    };
    get pendingCount() { 
        return this.jobs.filter(job => job.pending === STATUS.PENDING).length
    };
    get pushedCount() { 
        return this.jobs.filter(job => job.pending === STATUS.PUSHED).length
    };

    pushJob = job => {
        this._setJobStatus(job, STATUS.PUSHED);
        job.start = (...args) => {
            job.args = args;
            this._setJobStatus(job, STATUS.PENDING);
            console.log(this.runningCount, this.pendingCount, this.maxRunning)
            if(this.runningCount < this.maxRunning){
                console.log(`[+]starting jobId: ${job.jobId}`)
                this._setJobStatus(job, STATUS.RUNNING)
                job.run(...args);
            } else {
                console.log(`[-]waiting jobId: ${job.jobId}`)
                this.jobs.push(job);
            }
        }
        job.on('error', reason => {
            this._setJobStatus(job, STATUS.FAIL);
            this._fetchNextJob();

        })
        job.on('end', result => {
            this._setJobStatus(job, STATUS.DONE)
            this._fetchNextJob();
        })
    }
    _fetchNextJob = () => {
        const [nextJob, jobQueueLength] = this._getNextJob();
        if(nextJob === false) return;
        console.log('number of remains:', jobQueueLength);
        nextJob && nextJob.start(...nextJob.args);
    }
    _setJobStatus = (job, status) => {
        job.emit(status)
        job.status = status;
        if(status === STATUS.PUSHED){
            job.jobId = this._getNextJobId();
            return;
        }
        if(status === STATUS.RUNNING){
            this.runningJobs = [...this.runningJobs, job];
            return
        }
        if(status === STATUS.DONE){
            // remove from runningJobs
            this.runningJobs = this.runningJobs.filter(runningJob => runningJob.jobId !== job.jobId);
            return
        }
    }
    _getNextJob = () => {
        const pendingJobsLength = this.jobs.filter(job => job.status = STATUS.PENDING).length;
        if(pendingJobsLength === 0) return [false, pendingJobsLength];
        const nextJobIndex = this.jobs.findIndex(job => job.status === STATUS.PENDING);
        const nextJob = this.jobs[nextJobIndex];
        this.jobs = this.jobs.filter(job => job.jobId !== nextJob.jobId);
        return [nextJob, pendingJobsLength];
    }
    _getNextJobId = () => {
        return this.jobIdSequence++;
    }
}

const createJobQueue = maxRunning => {
    return new JobQueue(maxRunning)
}

module.exports = createJobQueue;
