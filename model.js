const rp = require("request-promise"); //进入request-promise模块，需要安装request模块
const fs = require('fs');
const cheerio = require('cheerio');
const depositPath = 'D:/blog/reptile/meizi/';//存放照片的位置(要先创建这个文件夹)
let downloadPath;//下载文件夹的地址
module.exports = {
    getPage: async (url) => {
        const data = {
            url,
            res: await rp({//异步执行
                url: url
            })
        }
        return data;
    },
    getUrl: (data, farNode) => {//获得需要获取的套图信息  父亲节点 '.boxs img li .p_title a'//初始页面。想找的图片的列表页面。不同的网站，方法可能不尽相同
        let list = [];//需要获取的套图名称和url信息
        //console.log(data.res);
        const $ = cheerio.load(data.res); //将html转换为可操作的节点
        $(farNode).each(async (i, e) => {
            let obj = {//不同的页面，写法不同
                name: e.children[0].data, //图片网页的名字，后面作为文件夹名字(根据实际页面)
                url: e.attribs.href//图片网页的url
            }
            //console.log(obj)
            list.push(obj); //输出目录页查询出来的所有链接地址
        })
        return list;
    },
    getTitle: (obj) => {//根据需要获取的套图，创建文件夹
        downloadPath = depositPath + obj.name.replace(/\//gi, '-');//名称有/的话，则会有路径问题，要把/转化为-
        if (!fs.existsSync(downloadPath)) {//查看是否存在这个文件夹
            fs.mkdirSync(downloadPath);//不存在就建文件夹
            console.log(`${obj.name}文件夹创建成功`);
            return true;
        } else {
            console.log(`${obj.name}文件夹已经存在`);
            return false;
        }
    },
    getImagesNum: (res, name, pageNode) => {////根据需要获取的套图, 获取页码
        if (res) {
            let $ = cheerio.load(res);
            let len = $(pageNode)
                .find("a").length;
            if (len == 0) {
                fs.rmdirSync(`${depositPath}${name}`);//删除无法下载的文件夹
                return 0;
            }
            let pageIndex = $(pageNode)
                .find("a")[len - 2].children[0].data;
            return pageIndex;//返回图片总数
        }
    },
    //下载相册照片
    downloadImage: async (data, index, imgNode) => {
        if (data.res) {
            var $ = cheerio.load(data.res);
            if ($(imgNode).find("img")) {
                $(imgNode).find("img").each(async (i, e) => {
                    let imgSrc = e.attribs.src;//图片地址
                    let imgSrcArr=imgSrc.split('/');
                    // let headers = {
                    //     Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    //     "Accept-Encoding": "gzip, deflate",
                    //     "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    //     "Cache-Control": "no-cache",
                    //     Host: "mtl.xtpxw.com",//修改为相应网站的host
                    //     Pragma: "no-cache",
                    //     "Proxy-Connection": "keep-alive",
                    //     Referer: data.url,
                    //     "Upgrade-Insecure-Requests": 1,
                    //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
                    // };//反防盗链
                    await rp({
                        url: imgSrc,
                        resolveWithFullResponse: true,
                        //headers
                    }).pipe(fs.createWriteStream(`${downloadPath}/${imgSrcArr[imgSrcArr.length-1]}`));//下载
                    console.log(`${downloadPath}/${imgSrcArr[imgSrcArr.length-1]}.jpg下载成功`);
                })
            } else {
                console.log(`${downloadPath}/${imgSrcArr[imgSrcArr.length-1]}.jpg加载失败`);
            }
        }
    }
}

