const {createLogger,transports,format}=require('winston');

const logger=createLogger({
    level:'info',
    format:format.combine(
        format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        format.json()
    ),
    transports:[
        new transports.File({filename:'debug.log'}),
    ]
})

module.exports=logger;