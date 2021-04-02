const request = require('request')
const urlencode = require("urlencode")

const head = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
}
var base_url = 'https://www.kdtv.cc/search.php?searchword='

module.exports = bot => {
    return async function onMessage(msg){
        if (msg.self()) return
        console.log(msg.talker().name())
        if(msg.text().search('#') != -1){
            msg.say('请稍等~~~~')
            let movie_info = await get_movie_info(msg.text().replace('#', ''))
            let contact = bot.Contact.load(msg.talker().id)
            
            eval(movie_info).forEach(element => {
                let result = `${element['title']}\n链接地址:${element['url']}\n请在浏览器打开!`
                contact.say(result)
                        
            });
        }
    }
}

function get_movie_info(title){
    return new Promise((resolve, reject) => {
        request({
            url: `http://127.0.0.1:5000/movie?title=${urlencode(title)}`, timeout:3000
        }, (error, response, body) => {
            if(!error && response.statusCode == 200){
                try{
                    resolve(eval(body))
                }catch(e){
                    console.log(`error! ${e}`)
                    resolve([])
                }
                
            }
        })

    })
}


