/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    .get('https://mgronline.com/politics/6023/start=0')
    // .find('#showNewsList .hotnews .col-sm-6') 
    .find('.search-display-result .article-item')
    .set({
        // test: "#showNewsList"
        'link': 'a@href',
        // title: "figcaption"
    })
    .data(data => {
        if (data.link) {
            // console.log("data", data);
            osmosis
                .get(data.link)
                // .get('https://mgronline.com/politics/detail/9630000021840') 
                .find('.section-0-0')
                .set({
                    'title': '.header-article h1',
                    'img': '.article-content img@src',
                    'content': ".article-content",
                    'date': '.header-article time'
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
