/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://www.matichon.co.th/politics')
    .find('div.td-main-content > div.td-ss-main-content .td-animation-stack')
    .set({
        'link': '.td-module-thumb a@href',
        // 'details': '.item-details > h3'
        // 'title': '.PostBody',
        // 'date': ".footer .date"
    })
    .data(data => {
        if (data.link) {
            // if (data.link.includes("politics")) {
            // console.log("data", data);
            osmosis
                // Do Google search
                .get(data.link)
                // .get('https://www.matichon.co.th/politics/news_2021413')
                .find('.td-ss-main-content')
                .set({
                    // test: '.EntryBody'
                    'title': 'h1.entry-title',
                    'img': '.td-post-featured-image img@src',
                    'content': ".td-post-content",
                    'date': ".td-module-date @datetime",
                    'tags': [".td-post-source-tags > .td-tags > a"]
                })
                .data(data => {
                    // Each iteration, push the data into our array
                    console.log("data", data);

                })
                .log(console.log)
                .error(console.log)
                .debug(console.log)
            // }
        }
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
