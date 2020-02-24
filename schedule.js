const schedule = require('node-schedule');

function runSchedule (cb) {
    // {hour: 7, minute: 0}
    // {minute: null}
    schedule.scheduleJob({ hour: 7, minute: 0 }, function () {
        console.log('定时任务执行一次');
            cb && cb();
    });
}

module.exports = runSchedule;
