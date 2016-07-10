let request = require('request');
let cheerio = require('cheerio');
let moment = require('moment');
let slackWebhook = process.env.SLACK_WEB_HOOK;
let slack = require('slack-notify')(slackWebhook);

module.exports = () => {

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
              channel: '#events',
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
          let nodeschoolFullDate = $('.event__datetime').text().split(' ');
          let month = moment().month(nodeschoolFullDate[0]).format('M');
          let date = nodeschoolFullDate[1].match(/\d/gi).join('');
          let year = new Date().getFullYear();
          let newDate = new Date(`${month}/${date}/${year}`).getTime();
          let todaysDate = new Date().getTime();

          let oaknsURL = [];
          let oakURLS = $('a');

          for (let key in oakURLS){
            if (oakURLS.hasOwnProperty(key)){
              if (oakURLS[key].type === 'tag'){
                let urlMatcher = oakURLS[key].attribs.href.includes('ti.to');
                if (urlMatcher){
                  oaknsURL.push(oakURLS[key].attribs.href);
                }
              }
            }
          }

          if (newDate > todaysDate){
            slack.send({
              channel: '#events',
              icon_url: 'http://nodeschool.io/oakland/images/nodeschool_oak.png',
              text: oaknsURL[0],
              unfurl_links: true,
              username: 'Oakland Nodefier'
            });
          }

        }
      });
    }
  });
};
