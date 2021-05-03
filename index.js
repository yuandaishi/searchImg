// http://www.44932.com
//https://www.jpxgmn.com/ https://p.plmn5.com
//https://www.xrmn.cc/ https://pic.xrmn.cc
var model = require("./model"),
    basicPath = "https://www.xrmn.cc/azhu.html",//协议如果是https，则不能用http代替
    // baseImg = 'https://p.plmn5.com',//图片地址前缀 https://www.jpxgmn.com/
    baseImg = 'https://pic.xrmn.cc',//图片地址前缀 https://www.xrmn.cc/
    webUrl = 'https://www.xrmn.cc',//网页地址url
    imageNum,//页码
    startNum = 0, //图片名称
    downloadPath = '';//文件夹名称

const init = async basicPath => {//初始化，获取套图页码，创建套图文件夹
    const dataMain = await model.getPage(basicPath);//获取网页内容
    let list = await getList(dataMain, webUrl);
    // console.log(list);
    // return
    for (let i = 58; i < list.length; i++) {
        //console.log(list[i].url)
        const data = await model.getPage(list[i]);//获取网页内容
        // downloadPath = model.setFileName(data, '.article-title');//定义文件夹名称 https://www.jpxgmn.com/
        // imageNum = model.getImagesNum(data, '.pagination a');//获取这组图片的页码 https://www.jpxgmn.com/
        downloadPath = model.setFileName(data, 'h1');
        imageNum = model.getImagesNum(data, '.page a');//获取这组图片的页码
        //console.log(imageNum)
        model.mkdirSync(downloadPath);//创建文件夹(同步)
        for (let j = 0; j < imageNum; j++) {//翻页处理
            let url;
            if (j === 0) {
                url = list[i];
            } else {
                url = list[i].substring(0, list[i].length - 5) + `_${j}.html`
            }
            await main(url);
        }
    }
    // console.log(url)
    // const data = await model.getPage(basicPath);//获取网页内容
    // // downloadPath = model.setFileName(data, '.article-title');//定义文件夹名称 https://www.jpxgmn.com/
    // // imageNum = model.getImagesNum(data, '.pagination a');//获取这组图片的页码 https://www.jpxgmn.com/
    // downloadPath = model.setFileName(data, 'h1');
    // imageNum = model.getImagesNum(data, '.page a');//获取这组图片的页码
    // // console.log(imageNum)
    // model.mkdirSync(downloadPath);//创建文件夹
    // for (let j = 0; j < imageNum; j++) {//翻页处理
    //     let url = basicPath;
    //     if (j === 0) {
    //         url = url;
    //     } else {
    //         url = url.substring(0, url.length - 5) + `_${j}.html`
    //     }
    //     main(url);
    // }
}


const getList = async (data, url) => {//获取人物套图list
    let list = await model.getModelList(data, '.update_area_lists .i_list a', url);
    return list;
}

const main = async url => {
    const data = await model.getPage(url);
    let list = model.getImgObj(data, 'p img', baseImg);//套图组的信息（名称和url
    await model.downloadImage(list, downloadPath);//下载图片
    //startNum += list.length;
};
init(basicPath);