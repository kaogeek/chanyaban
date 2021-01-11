/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    .get('https://www.tnews.co.th/category/5/%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87')
    // .find('#showNewsList .hotnews .col-sm-6') 
    .find('.container .row:nth-of-type(2) .col-md-3')
    .set({
        // test: "#showNewsList"
        'link': 'a@href',
        title: "h5"
    })
    .data(data => {
        if (data.link) {
            // console.log("data", encodeURI(data.link));
            // console.log("data", data);
            osmosis
                .get(encodeURI(data.link))
                // .get('https://www.tnews.co.th/politic/522065/%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%9E%E0%B8%B4%E0%B8%A8%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B9%8C-%E0%B8%A7%E0%B9%8A%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%94-%E0%B9%84%E0%B8%AD%E0%B9%89%E0%B9%80%E0%B8%A7%E0%B8%A3...%E0%B9%82%E0%B8%94%E0%B8%99%E0%B8%A7%E0%B8%B4%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%90-%E0%B8%9D%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B8%99-%E0%B8%A3%E0%B9%88%E0%B8%A7%E0%B8%A1%E0%B8%84%E0%B8%A7%E0%B9%88%E0%B8%B3%E0%B8%9A%E0%B8%B2%E0%B8%95%E0%B8%A3%E0%B8%94%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%81%E0%B8%9E%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%9B%E0%B8%A1%E0%B8%96%E0%B8%A7%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A2%E0%B9%8C-%E0%B8%8B%E0%B8%B1%E0%B8%81%E0%B8%9F%E0%B8%AD%E0%B8%81%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%AF?utm_source=category&utm_medium=internal_referral&utm_campaign=politic') 
                .find('.col-md-offset-1')
                .set({
                    'title': 'h1.lh17',
                    'img': '.txt-content img@src',
                    'content': ".txt-content",
                    'date': '.content-main > span'
                })
                .data(data => {
                    // Each iteration, push the data into our array
                    console.log("data", data);

                })
                .log(console.log)
                .error(console.log)
                .debug(console.log)
        }
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
