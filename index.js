const model = require("./model"),
    basicPath = "https://www.meitulu.com/t/zhouyanxi/2.html";//协议如果是https，则不能用http代替
const main = async url => {
    let list = [],
        index = 0;
    const data = await model.getPage(url);
    list = model.getUrl(data, '.boxs .img li .p_title a');//套图组的信息（名称和url）
    downLoadImages(list, index);//下载
};
const downLoadImages = async (list, index) => {
    if (list[index]&&model.getTitle(list[index])) {
        let item = await model.getPage(list[index].url),//获取图片所在网页的url
            imageNum = model.getImagesNum(item.res, list[index].name, '#pages');//获取这组图片的页码
        for (var i = 1; i <= imageNum; i++) {
            if (i == 1) {
                var page = await model.getPage(list[index].url);//遍历获取这组图片每一张所在的网页
            } else {
                var page = await model.getPage(list[index].url.substring(0, list[index].url.length - 5) + `_${i}.html`);//遍历获取这组图片每一张所在的网页
            }
            await model.downloadImage(page, i, '.content center');//下载当前页
        }
        index++;
        downLoadImages(list, index);//循环完成下载下一组
    }else{
        index++;
        downLoadImages(list, index);//循环完成下载下一组 
    }
};
main(basicPath);