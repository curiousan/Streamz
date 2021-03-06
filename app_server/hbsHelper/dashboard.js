'use strict';
const dayjs = require('dayjs');
const hbsHelpers = (hbs) => {
  return hbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + './../views',
    helpers: {
      test: (test) => {
        return test + 'sucessed';
      },
      ownVideo: (currentUser, mediaOwner) => {
        const username = currentUser.facebook.email || currentUser.local.email;
        if (mediaOwner === username) {
          return '<button  type="button" class="btn btn-sm btn-outline-info btn-video-edit mr-2">Edit</button><button type="button" class="btn btn-sm btn-outline-dark btn-video-delete">delete</button>';
        }
        return '';
      },
      formatDateTime: (date) => {
        return dayjs(date).format('DD MMM, YYYY');
      },
      fixDesc: (string) => {
        if (string) return string.substring(0, 27).concat('..');
        return ''
      },
    },
  });
};

module.exports = hbsHelpers;
