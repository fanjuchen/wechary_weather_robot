// 调度任务
const schedule = require('node-schedule');
// date 定时格式类似crond
// callback 回调函数
function setSchedule(date, callback) {
    schedule.scheduleJob(date, callback);
  }
module.exports = {
    setSchedule
};