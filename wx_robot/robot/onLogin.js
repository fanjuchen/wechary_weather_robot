const request = require('request');
const config = require('./config')
const schedule = require('./schedule')
const querystring = require('querystring');
const { JsonRpcError } = require('json-rpc-peer');

module.exports = bot => {
    return async function onLogin(usr){
        console.log(`${usr}登录成功`);
        await start_job(bot);
    }
}


function get_weather(){
    return new Promise((resolve, reject) => {
        let url = 'http://127.0.0.1:5000/weather?lon=119.30899&lat=26.06204'
        request({
            url: url, timeout:2000
        }, (error, response, body) => {  
            if(!error && response.statusCode == 200){
                try{
                    weather_info = JSON.parse(body)["weather_info"]
                    resolve(weather_info)}
                catch(e){
                    resolve(e)
                }
            }
            else{resolve('天气查询错误!')}
        })
       
    })    
}


async function start_job(bot){
    let names = config.names
    console.log('已经设定每日任务');
    schedule.setSchedule('0 21 * * *', async () => {
        for(var i=0; i<names.length; i++){
            let contact = await bot.Contact.find(names[i])
            let result = await get_weather()
            try{
                await contact.say(result)
                console.log('任务完成！')
            }catch(e){
                console.log(`error the exception is ${e}`)
            }
            
        }
    })
   
}