// http://www.44932.com
//https://www.jpxgmn.com/
var model = require("./model"),
    basicPath = "https://www.jpxgmn.com/Xgyw/Xgyw5846.html",//协议如果是https，则不能用http代替
    baseImg = 'https://p.plmn5.com',//图片地址前缀
    imageNum,//页码
    startNum = 0, //图片名称
    downloadPath = '';//文件夹名称

const init = async url => {//初始化，获取套图页码，创建套图文件夹
    const data = await model.getPage(url);//获取网页内容
    downloadPath = model.setFileName(data, '.article-title');//定义文件夹名称
    imageNum = model.getImagesNum(data, '.pagination a');//获取这组图片的页码
    model.mkdirSync(downloadPath);//创建文件夹
    for (let i = 0; i < imageNum; i++) {//翻页处理
        let url;
        if (i === 0) {
            url = basicPath;
        } else {
            url = basicPath.substring(0, basicPath.length - 5) + `_${i}.html`
        }
        main(url);
    }
}

const main = async url => {
    const data = await model.getPage(url);
    let list = model.getImgObj(data, 'p img', baseImg);//套图组的信息（名称和url
    await model.downloadImage(list, downloadPath, startNum);//下载图片
    startNum += list.length;
};
init(basicPath);