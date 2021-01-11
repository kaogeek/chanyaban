/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
const moment = require('moment/moment');

osmosis
    // Do Google search
    .get('https://news.mthai.com/politics-news')
    .paginate(".wp-pagenavi a.nextpostslink[href]", 1)
    // .paginate("", 100)
    .find('div.post-list > .column > .category-politics-news')
    .set({
        'link': '.post-thumbnail-wrap > a@href'
    })
    .data(data => {
        osmosis
            .get(data.link)
            .find('#main > .main-article')
            .set({
                'title': '.entry-title',
                // 'img': '.post-thumbnail-wrap img@src',
                // 'content': ".entry-content-inner",
                // 'tags': [".tags-links .label"],
                'date': "time.entry-date@datetime"
            })
            .data(data => {
                data.date = data.date ? moment(data.date, '', '').toDate() : new Date();
                console.log(data);
            })
            .error(console.log)
            .debug(console.log)
    })
    // .log(console.log)
    .error(console.log)
    .debug(console.log)