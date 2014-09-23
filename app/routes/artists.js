/* jshint unused:false */
'use strict';

var fs = require('fs');
var multiparty = require('multiparty');
var Mongo = require('mongodb');
var _ = require('lodash');


var artists = global.nss.db.collection('artists');
var albums = global.nss.db.collection('albums');
var songs = global.nss.db.collection('songs');

exports.index = (req, res)=>{
  artists.find().toArray((err, records)=>{
    res.render('artists/index', {artists: records, title: 'NodeTunes: Artists'});
  });
};

exports.show = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);

  artists.find({_id:_id}).toArray((err, artsts)=>{
      albums.find().toArray((e, albms)=>{

        var albs = _.filter(albms, function(albm) { return albm.artistId.toString() === artsts[0]._id.toString(); });
        console.log(albs);

      res.render('artists/show', {albums: albs, artist: artsts, title: 'NodeTunes: Artist Profile'});
    });
  });

  // artists.find({_id:_id}, (err, artst)=>{

  //
  //
  //   // albums.find().toArray((e, albms)=>{
  //   //
  //   //   albms = albms.map(album => {
  //   //     // album.artist = _(artsts).find(a => {
  //   //     //   return a._id.toString() === album.artistId.toString();
  //   //     // });
  //   //     return album;
  //   //   });
  //   //
  //   //   songs.find(req.query).toArray((e, sngs)=>{
  //   //     sngs = sngs.map(s=>{
  //   //       var al = _(albms).find(a=>a._id.toString() === s.albumId.toString());
  //   //       s.album = al;
  //   //       s.artist = al.artist.name;
  //   //       return s;
  //   //     });
  //   //
  //   //     res.render('songs/index', {artist: artst, albums: albms, songs: sngs, title: 'Songs'});
  //   //   });
  //   // });
  // });
};

exports.create = (req, res)=>{

  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    var artist = {};
    artist.name = fields.name[0];
    artist.photo = files.artistPhoto[0];

    if(fs.existsSync(`${__dirname}/../static/img/${artist.name}`)){
      fs.renameSync(artist.photo.path, `${__dirname}/../static/img/${artist.name}/${artist.photo.originalFilename}`);
    } else {
      fs.mkdirSync(`${__dirname}/../static/img/${artist.name}`);
      fs.renameSync(artist.photo.path, `${__dirname}/../static/img/${artist.name}/${artist.photo.originalFilename}`);
    }



    artists.save(artist, ()=>{
      res.redirect('/artists');
    });
  });
};
