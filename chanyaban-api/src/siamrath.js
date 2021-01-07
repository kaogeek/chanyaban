var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://siamrath.co.th/politics') 
    .find('#block-system-main .col-md-4') 
    .set({ 
        // test: ".panel-heading"
        'link': 'a@href',
        title: "h5"
    })
    .data(data => { 
        if (data.link) {            
//         console.log("data", data);
        osmosis
        // Do Google search
        .get("https://siamrath.co.th/"+data.link) 
        // .get('https://siamrath.co.th/n/136763') 
        .find('.main-container') 
        .set({
            // test: '.EntryBody'
            'title': 'h1.page-header',
            'img': '#block-system-main .node-image img@src',
            'content': "#block-system-main div.row",
            'date': ".submitted > span:nth-of-type(4)",
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
