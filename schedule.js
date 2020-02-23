const schedule = require('node-schedule');

function runSchedule (cb) {
    // {hour: 7, minute: 0}
    schedule.scheduleJob({ minute: null }, function () {
        console.log('定时任务执行一次');
            cb && cb();
    });
}

module.exports = runSchedule;