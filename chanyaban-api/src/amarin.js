/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
let url = encodeURI('https://www.amarintv.com/tag/การเมือง/');
osmosis
    // Do Google search
    .get(url)
    .paginate(".btn-more")
    .find('#wrapper .thumb-grid .thumbnail')
    .set({
        'link': 'a@href',
        // 'title': '.PostBody',
        // 'date': ".footer .date"
    })
    .data(data => {
        // console.log("data", data);
        osmosis
            // Do Google search
            .get("https://www.amarintv.com/" + data.link)
            .find('#wrapper .col-md-8')
            .set({
                // test: '.EntryBody'
                'title': '.head h1',
                // 'img': '.head > img@src',
                // 'content': ".body",
                // 'tags': [".tags .body .tag"],
                'date': ".head .options .option:last"
            })
            .data(data => {
                // Each iteration, push the data into our array
                console.log("data", data);

            })
            .log(console.log)
            .error(console.log)
            .debug(console.log)
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
