// Based url
const BASEURLOBJ = {
    'dev': 'http://party.chuangwo.net',
    'prod': 'http://183.136.177.184:10108'
} 
const LOGINURLOBJ = {
    'dev': 'http://dev.chuangwo.net:17988',
    'prod': 'https://www.qttzzj.com',
}

const ACTIVITY = {
    'dev': 'http://dev.chuangwo.net:17988/pcMallHome/index.html#/activityDetail',
    'prod': 'https://mall.qttzzj.com/index.html#/activityDetail',
}


const LIMITFILE = 10 //文件上传最大（M）

module.exports = {
    BASEURL: BASEURLOBJ[process.env.API_EVN],
    LOGINURL: LOGINURLOBJ[process.env.API_EVN],
    ACTIVITYURL: ACTIVITY[process.env.API_EVN],
    LIMITFILE
}