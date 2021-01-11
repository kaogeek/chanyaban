/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://prachatai.com/politics')
    .find('.view-content .views-row')
    .set({
        // test: ".panel-heading"
        'link': 'a@href'
        // title: ".main-headline"
    })
    .data(data => {
        if (data.link) {
            //         console.log("data", data);
            osmosis
                // Do Google search
                .get("https://prachatai.com/" + data.link)
                // .get('https://prachatai.com/journal/2020/03/86633') 
                .find('#region-content')
                .set({
                    // test: '.EntryBody'
                    'title': '#page-title',
                    'img': 'img@src',
                    'content': ".field-item",
                    'date': ".submitted-by",
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
