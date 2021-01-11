/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://www.khaosod.co.th/politics')
    .paginate('.udpg__ul > .udpg__li:last-of-type > a[href]', 1)
    .find('.container .udblock, .udblock--top_down')
    .set({
        'link': 'a@href',
    })
    .data(data => {
        if (data.link) {
            // console.log("data", data);
            osmosis
                // Do Google search
                .get(data.link)
                // .get('https://www.khaosod.co.th/politics/news_3791017')
                .find('main.content > article')
                .set({
                    // test: '.EntryBody'
                    'title': 'h1',
                    'img': '.udsg__featured-image@data-src',
                    // 'content': ".udsg__content",
                    'date': ".udsg__meta-wrap:last-of-type > .udsg__meta-left",
                    'tag': [".udsg__tag-item"]
                })
                // .follow('.udsg__tag > .udsg__tag-item')
                // .set({
                //     'tag': ".udsg__tag-link"
                // })
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
