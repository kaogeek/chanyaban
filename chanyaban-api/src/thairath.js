var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://www.thairath.co.th/news/politic')
    // .find('aside.css-1xuuifk ,.eqom6ue5 > .container > .row > .col-md-3')
    // .paginate("button.pagination", 3)
    .find('aside.css-1xuuifk > .container >.row')
    .delay(5000)
    // .find('aside')
    .set({
        'link': 'class',
        // 'title': '.PostBody',
        // 'date': ".footer .date"
    })
    .data(data => { 
        console.log("data", data);
        // osmosis
        // // Do Google search
        // // .get(data.link) 
        // .get('http:////www.sanook.com/news/8045059/') 
        // .find('.EntryContent') 
        // .set({
        //     test: '.EntryBody'
        //     // 'title': '.title',
        //     // 'img': '.thumbnail > img@src',
        //     // 'content': ".ReaderWrap",
        //     // 'date': "time"
        // })
        // .data(data => {
        //     // Each iteration, push the data into our array
        //     console.log("data", data);
    
        // })
        // .log(console.log)
        // .error(console.log)
        // .debug(console.log)

    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
