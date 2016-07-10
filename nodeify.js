let request = require('request');
let cheerio = require('cheerio');
let moment = require('moment');
let slackWebhook = process.env.SLACK_WEB_HOOK;
console.log('slackWebhook ', slackWebhook);
let slack = require('slack-notify')(slackWebhook);

let nodeifier = () => {

  let nodeschoolURLs = ['http://nodeschool.io/sanfrancisco/', 'http://nodeschool.io/oakland/'];

  nodeschoolURLs.forEach((url) => {
    if (url.includes('sanfrancisco')){
      request(url, (error, response, body) => {
        if (!error && response.statusCode === 200){
          let $ = cheerio.load(body);
          let nodeschoolFullDate = $('h2').text().split(' ');
          let month = moment().month(nodeschoolFullDate[0]).format('M');
          let date = nodeschoolFullDate[1].match(/\d/gi).join('');
          let year = nodeschoolFullDate[2];
          let newDate = new Date(`${month}/${date}/${year}`).getTime();
          let todaysDate = new Date().getTime();

          let sfnsURL = [];
          let sfURLS = $('a');

          for (let key in sfURLS){
            if (sfURLS.hasOwnProperty(key)){
              if (sfURLS[key].type === 'tag'){
                let urlMatcher = sfURLS[key].attribs.href.includes('ti.to');
                if (urlMatcher){
                  sfnsURL.push(sfURLS[key].attribs.href);
                }
              }
            }
          }

          if (newDate > todaysDate){
            slack.send({
              channel: '@phil',
              icon_url: 'http://nodeschool.io/sanfrancisco/assets/logo.png',
              text: sfnsURL[0],
              unfurl_links: true,
              username: 'SF Nodeifier'
            });

          }
        }
      });
    } else {
      request(url, (error, response, body) => {
        if (!error && response.statusCode === 200){
          let $ = cheerio.load(body);
          let nodeschoolFullDate = $('.event__datetime');
        }
      });
    }
  });
};

nodeifier();




// let sfNode() => {
//
//   request('http://nodeschool.io/sanfrancisco/', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       let $ = cheerio.load(body);
//       let nodeschoolFullDate = $('h2').text().split(' ');
//       let month = moment().month(nodeschoolFullDate[0]).format('M');
//       let date = nodeschoolFullDate[1].match(/\d/gi).join('');
//       let year = nodeschoolFullDate[2];
//       let newDate =  new Date(`${month}/${date}/${year}`).getTime();
//
//       let todaysDate = new Date().getTime();
//
//       let sfnsURL = [];
//       let sfurls = $('a');
//
//       for (var key in sfurls) {
//         if( urls.hasOwnProperty( key ) ) {
//           // let url = urls[key].attribs;
//           // console.log(typeof url);
//           // console.log(urls[key]);
//           if (sfurls[key].type === 'tag'){
//             // let matcher = urls[key].attribs.href.match(/(ti.to\/nodeschool)/gi);
//             let matcher = sfurls[key].attribs.href.includes('ti.to');
//             if (matcher) {
//               sfnsURL.push(sfurls[key].attribs.href);
//             }
//           }
//         }
//       }
//
//
//       if (newDate > todaysDate){
//         slack.send({
//           channel: '@phil',
          // icon_url: 'http://nodeschool.io/sanfrancisco/assets/logo.png',
          // text: nsURL[0],
          // unfurl_links: true,
          // username: 'SF Nodeifier'
//         });
//       }
//     }
//   });
//
// };
//
// let oakNode() => {
//
//   request('http://nodeschool.io/oakland/', function(error, response, body){
//     if (!error && response.statusCode === 200) {
//       let $ = cheerio.load(body);
//       let nodeschoolFullDate = $('.event__datetime')
//     }
//   });
//   let oaknsURL = [];
//
//   let oakurls = $('a');
//
// };
