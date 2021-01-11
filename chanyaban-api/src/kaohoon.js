/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    .get('https://www.kaohoon.com/content/tag/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87')
    .find('#main .content-item')
    .set({
        'link': 'a@href',
    })
    .data(data => {
        // if (data.link) {            
        console.log("data", data);
        osmosis
            .get(data.link)
            // .get('https://www.kaohoon.com/content/298353') 
            .find('#main')
            .set({
                'title': 'h1.entry-title',
                'img': '.entry-media > img@data-src',
                // 'content': ".entry-content", 
                'date': '.post_date .date',
                'tag': ['.tag a']
            })
            // .follow('https://www.kaohoon.com/content/298353')
            // .find('#main .tag')
            // .set({
            //     tag: "a"
            // })
            .data(data => {
                // Each iteration, push the data into our array
                console.log("data", data);

            })
            .log(console.log)
            .error(console.log)
            .debug(console.log)
        //     }
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
