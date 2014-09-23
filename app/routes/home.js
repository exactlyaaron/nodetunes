'use strict';

exports.index = (req, res)=>{
  res.render('home/index', {title: 'NodeTunes: Home'});
};

exports.about = (req, res)=>{
  res.render('home/about', {title: 'NodeTunes: About'});
};

exports.help = (req, res)=>{
  res.render('home/help', {title: 'Node.js: Help'});
};
