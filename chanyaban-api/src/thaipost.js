/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    .get('https://www.thaipost.net/main/category/1')
    .find('.container > .row > .col-md-8.col-xs-12 .col-md-12.col-xs-12 , .container > .row > .col-md-8.col-xs-12 .col-md-6.col-xs-6')
    .set({
        // test: ".panel-heading"
        'link': 'p a@href',
        title: "p a"
    })
    .data(data => {
        if (data.link) {
            // console.log("data", data);
            osmosis
                .get(data.link)
                // .get('https://www.thaipost.net/main/detail/58839') 
                .find('.container > div.row > div.col-md-8')
                .set({
                    'title': 'h2',
                    'img': '#contentDetail img@src',
                    // 'content': "#contentDetail",
                    'date': "label",
                    'tags': [".badge.badge-pill.badge-secondary"]
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
