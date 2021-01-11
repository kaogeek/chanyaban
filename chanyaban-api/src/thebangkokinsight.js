/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://www.thebangkokinsight.com/tag/%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87/')
    .find('.posts-listing article.post--vertical')
    .set({
        // test: ".panel-heading"
        'link': 'a@href',
        // title: ".post__title"
    })
    .data(data => {
        if (data.link) {
            // console.log("data", data);
            osmosis
                // Do Google search
                .get(data.link)
                // .get('https://www.thebangkokinsight.com/296965/') 
                .find('.single-content')
                .set({
                    'title': '.entry-title',
                    'img': 'img@src',
                    'content': ".single-body",
                    'date': "time.time",
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
