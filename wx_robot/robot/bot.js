const { Wechaty } = require('wechaty')

const config = require('./config')
const onLogin = require('./onLogin')
const onMessage = require('./onMessage')

const onScan = require('./onScan')

const bot = new Wechaty({
    puppet: 'wechaty-puppet-padlocal',
    puppetOptions: {
        token: config.token
    }
}
)

bot
    .on("scan", onScan)
    .on("login", onLogin(bot))
    .on("message", onMessage(bot))
    .start()