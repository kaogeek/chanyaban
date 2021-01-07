var osmosis = require('osmosis');
var counter = 0;
osmosis
    .get('https://www.nationtv.tv/main/content/politics/')
    // .paginate("a.loadmore[href]",1)
    .find('.container .news-feature .col-md-8 .feature,.container .news-list .col-md-3 .feature')
    .set({
        // test: "#showNewsList"
        'link': '.card-image a@href',
        title: ".card-title"
    })
    .data(data => {
        if (data.link) {
            counter++;
                    // console.log(counter+" data", data);
            osmosis
                .get(data.link)
                // .get('https://www.nationtv.tv/main/content/378764289/') 
                .find('.article-wrapper')
                .set({
                    'title': 'h1.article-title',
                    'img': '.article-feature-image img@src',
                    'content': ".article-body",
                    'date': '.article-date'
                    ,'tags': ['.article-tags li']
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
