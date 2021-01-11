/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://www.dailynews.co.th/politics')
    .paginate(".content-pagination > .pagination > li:last > a[href]", 1)
    .find('.left section .content-wrapper .content')
    .set({
        'link': 'a@href',
        // 'title': '.PostBody',
        // 'date': ".footer .date"
    })
    .data(data => {
        // console.log("data", data);
        osmosis
            // Do Google search
            .get("https://www.dailynews.co.th" + data.link)
            .find('#news-article')
            .set({
                // test: '.EntryBody'
                'title': '.article-detail .title',
                'img': '#article-slide img.slide-img@src',
                // 'content': ".article-detail .content-all",
                'date': ".article-detail .date"
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
