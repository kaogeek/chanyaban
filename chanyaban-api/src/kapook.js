/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://news.kapook.com/politic')
    .find('.hitclip > .temp-1200 li')
    .set({
        'link': 'a@href',
        // 'title': '.PostBody',
        // 'date': ".footer .date"
    })
    .data(data => {
        // console.log("data", data);
        if (data.link) {
            osmosis
                // Do Google search
                .get(data.link)
                // .get('http://hilight.kapook.com/view/200605')
                .find('#container')
                .set({
                    // test: '.EntryBody'
                    'title': '.head_article h1',
                    // 'img': '.main_article > .content > div .img-mobile@src',
                    'img': '.img-mobile@src',
                    // 'img': 'img@src',
                    'content': ".container_article .content",
                    'date': ".article-detail .date"
                }).data(data => {
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
