var request = require('request');
let cheerio = require('cheerio');
let moment = require('moment');
let slackWebhook = 'https://hooks.slack.com/services/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';
let slack = require('slack-notify')(slackWebhook);

request('http://nodeschool.io/sanfrancisco/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    let $ = cheerio.load(body);
    let nodeschoolFullDate = $('h2').text().split(' ');
    let month = moment().month(nodeschoolFullDate[0]).format('M');
    console.log(month);
    let date = nodeschoolFullDate[1].match(/\d/gi).join('');
    console.log(+date);
    let year = nodeschoolFullDate[2];
    console.log(+year);
    let newDate =  new Date(`${month}/${date}/${year}`).getTime();
    console.log(newDate);

    let todaysDate = new Date().getTime();

    let nsURL = [];

    let urls = $('a');
    for (var key in urls) {
      if( urls.hasOwnProperty( key ) ) {
        // let url = urls[key].attribs;
        // console.log(typeof url);
        // console.log(urls[key]);
        if (urls[key].type === 'tag'){
          // let matcher = urls[key].attribs.href.match(/(ti.to\/nodeschool)/gi);
          let matcher = urls[key].attribs.href.includes('ti.to');
          if (matcher) {
            nsURL.push(urls[key].attribs.href);
          }
        }
      }
    }
    // console.log(urls);
    // urls.filter((url) => {
    //   console.log(url.attribs);
    // });

    if (newDate > todaysDate){
      slack.send({
        channel: '@winston',
        icon_url: 'http://nodeschool.io/sanfrancisco/assets/logo.png',
        text: nsURL[0],
        unfurl_links: true,
        username: 'SF Nodeifier'
      });
    }
  }
});