/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    .get('https://postjung.com/tag/%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87')
    .find('.splist > .xbox')
    .set({
        // test: ".panel-heading"
        'link': 'a@href',
        // title: ".xtitle"
    })
    .data(data => {
        if (data.link) {
            //         console.log("data", data);
            osmosis
                .get(data.link)
                // .get('https://board.postjung.com/1200213') 
                .find('.mainbox')
                .set({
                    'title': 'h1',
                    'img': 'img@src',
                    'content': "#maincontent",
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
