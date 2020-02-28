const schedule = require('node-schedule');

let rule = new schedule.RecurrenceRule();
rule.hour = [9,17,23]
rule.minute = [20]
function runSchedule (cb) {
    schedule.scheduleJob(rule, function () {
        console.log('定时任务执行一次');
        cb && cb();
    });
}

module.exports = runSchedule;
