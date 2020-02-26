const schedule = require('node-schedule');

function runSchedule (cb) {
    let rule = new schedule.RecurrenceRule();  
    let times = [8,12,14,17,20,23];  
    rule.hour = times;  
    schedule.scheduleJob(rule, function () {
        console.log('定时任务执行一次');
        cb && cb();
    });
}

module.exports = runSchedule;
