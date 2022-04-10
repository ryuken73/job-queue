const createJobQueue = require('./classes/JobQueue');
const createPrintJob = require('./classes/PrintJob');
const createForkJob = require('./classes/ForkJob');

const jobQueue = createJobQueue(3);
const urls = [
    'https://www.youtube.com/watch?v=rWzNdMhnYIs'
]
const ytdlCmd = 'youtube-dl'
const options = ['-v', '-f', 'best']

const downloader = createForkJob(ytdlCmd);
urls.forEach(url => {
    jobQueue.pushJob(downloader);
    downloader.start([...options, url]);
    console.log('send command to start from main:', downloader.jobId)
})


// const jobs = new Array(10);
// jobs.fill(0)
// const pushJobs = jobs.map(job => createPrintJob())
// pushJobs.forEach(job => {
//     jobQueue.pushJob(job)
//     job.start(Math.random()*5000);
//     console.log('send command start from main:', job.jobId)
// });
