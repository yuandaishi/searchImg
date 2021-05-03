const rq = require("request-promise"); //进入request-promise模块，需要安装request模块
const fs = require('fs');
const cheerio = require('cheerio');
const depositPath = 'D:/吉他相关/新建文件夹/你还要我怎样/图片/阿朱/';//存放照片的位置(要先创建这个文件夹)
module.exports = {
    getPage: async (url) => {
        const data = {
            url,
            res: await rq({//异步执行
                url: url
            })
        }
        return data;
    },
    setFileName: (data, farNode) => {//设置文件夹名称
        const $ = cheerio.load(data.res); //将html转换为可操作的节点
        return $(farNode).text();
    },
    getImagesNum: (data, farNode) => {//根据需要获取的套图, 获取页码
        const $ = cheerio.load(data.res); //将html转换为可操作的节点
        // return $(farNode).length / 2 - 1;
        return $(farNode).length - 1;
    },
    getModelList: (data, farNode, webUrl) => {//获取模特套图url集合
        let list = [];
        const $ = cheerio.load(data.res); //将html转换为可操作的节点
        $(farNode).each(async (i, e) => {
            // let obj = {//不同的页面，写法不同
            //     name: e.attribs.alt, //图片网页的名字，后面作为文件夹名字(根据实际页面)
            //     url: webUrl + e.attribs.href//图片网页的url
            // }
            let url = webUrl + e.attribs.href//图片网页的url
            //console.log(obj)
            list.push(url); //输出目录页查询出来的所有链接地址
        })
        return list;
    },
    getImgObj: (data, farNode, baseImg) => {//获取每页套图的信息
        let list = [];//需要获取的套图名称和url信息
        const $ = cheerio.load(data.res); //将html转换为可操作的节点
        $(farNode).each(async (i, e) => {
            let obj = {//不同的页面，写法不同
                name: e.attribs.alt, //图片网页的名字，后面作为文件夹名字(根据实际页面)
                url: baseImg + e.attribs.src//图片网页的url
            }
            //console.log(obj)
            list.push(obj); //输出目录页查询出来的所有链接地址
        })
        return list;
    },
    mkdirSync: (name) => {//根据需要获取的套图，创建文件夹
        var downloadPath = depositPath + name.replace(/[\!\#%\/<>]/gi, '-');//名称有/的话，则会有路径问题，要把/转化为-
        if (!fs.existsSync(downloadPath)) {//查看是否存在这个文件夹
            fs.mkdirSync(downloadPath);//不存在就建文件夹
            console.log(`文件夹创建成功`);
        } else {
            console.log(`文件夹已经存在`);
        }
    },
    //下载相册照片
    downloadImage: async (list, downloadPath) => {
        // if (data.res) {
        //     var $ = cheerio.load(data.res);
        //     if ($(imgNode).find("img")) {
        //         $(imgNode).find("img").each(async (i, e) => {
        //             let imgSrc = e.attribs.src;//图片地址
        //             let imgSrcArr = imgSrc.split('/');
        //             // let headers = {
        //             //     Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        //             //     "Accept-Encoding": "gzip, deflate",
        //             //     "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        //             //     "Cache-Control": "no-cache",
        //             //     Host: "mtl.xtpxw.com",//修改为相应网站的host
        //             //     Pragma: "no-cache",
        //             //     "Proxy-Connection": "keep-alive",
        //             //     Referer: data.url,
        //             //     "Upgrade-Insecure-Requests": 1,
        //             //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
        //             // };//反防盗链
        //             await rp({
        //                 url: imgSrc,
        //                 resolveWithFullResponse: true,
        //                 //headers
        //             }).pipe(fs.createWriteStream(`${window.downloadPath}/${imgSrcArr[imgSrcArr.length - 1]}`));//下载
        //             console.log(`${window.downloadPath}/${imgSrcArr[imgSrcArr.length - 1]}.jpg下载成功`);
        //         })
        //     } else {
        //         console.log(`${window.downloadPath}/${imgSrcArr[imgSrcArr.length - 1]}.jpg加载失败`);
        //     }
        // }
        //console.log(startNum)
        for (let i = 0; i < list.length; i++) {
            let name = list[i].url.split('/')[list[i].url.split('/').length - 1];
            await rq({
                url: list[i].url,//图片地址
                resolveWithFullResponse: true,
            }).pipe(fs.createWriteStream(`${depositPath}${downloadPath}/${name}`), { autoClose: true });//下载
            console.log(`${name}下载成功`);
            // try {
            //     res.pipe(fs.createWriteStream(`${depositPath}${downloadPath}/${name}`, { autoClose: true }));//下载
            //     console.log(`${downloadPath}/${name}下载成功`);
            // } catch (error) {
            //     console.log(error)
            // }
        }
    }
}

