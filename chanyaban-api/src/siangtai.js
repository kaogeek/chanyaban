var osmosis = require('osmosis');
osmosis 
    .get('https://siangtai.com/category/%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87/') 
    .find('.container > .cat > .col-md-8 .columnstyle1__row') 
    .set({ 
        // test: ".panel-heading"
        'link': 'a@href',
        title: ".columnstyle1__title span"
    })
    .data(data => { 
        if (data.link) {            
//         console.log("data", data);
        osmosis 
        .get(data.link) 
        // .get('https://siangtai.com/2020/01/30/%e0%b8%99%e0%b8%b2%e0%b8%a2%e0%b8%81%e0%b8%af-%e0%b8%87%e0%b8%94%e0%b8%87%e0%b8%b2%e0%b8%99%e0%b8%a0%e0%b8%b2%e0%b8%a3%e0%b8%81%e0%b8%b4%e0%b8%88%e0%b8%97%e0%b8%b1%e0%b9%89%e0%b8%87%e0%b8%a7%e0%b8%b1/') 
        .find('.content > div.row > div.col-md-8') 
        .set({ 
            'title': '.content__title',
            'img': '.content__body img@src',
            'content': ".content__body",
            'date': ".content__description .date",
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
