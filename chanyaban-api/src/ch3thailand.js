var osmosis = require('osmosis');

osmosis
    // Do Google search
    .get('http://news.ch3thailand.com/politics')
    .find('div.container article.newstop-big, .news-normal-01')
    .set({
        'link': 'a@href',
        'title': 'a@title'
    })
    .data(data => { 
        if (data.link) { 
//             console.log("data", data);
            osmosis
                // Do Google search
                .get(data.link)
                // .get('http://news.ch3thailand.com/politics/100500')
                .find('article.content-detail')
                .set({ 
                        'title': 'h1.content-head',
                        'img': '.img-hi-news img@src',
                        'content': ".content-news",
                        'date': ".content-des > p.content-des-text:nth-of-type(2)",
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
