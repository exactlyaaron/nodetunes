/* jshint unused:false */

'use strict';

var artists = global.nss.db.collection('artists');
var albums  = global.nss.db.collection('albums');
var songs   = global.nss.db.collection('songs');
var Mongo   = require('mongodb');
var _       = require('lodash');


exports.index = (req, res)=>{

    var allGenres = [];

    artists.find().toArray((e, artsts)=>{
      albums.find().toArray((e, albms)=>{

        albms = albms.map(album => {
          album.artist = _(artsts).find(a => {
            return a._id.toString() === album.artistId.toString();
          });
          return album;
        });

        songs.find(req.query).toArray((e, sngs)=>{
          sngs = sngs.map(s=>{
            var al = _(albms).find(a=>a._id.toString() === s.albumId.toString());

            s.genres.forEach(x=>{
              allGenres.push(x);
            });

            s.album = al;
            s.artist = al.artist.name;
            return s;
          });

          allGenres = _.uniq(allGenres);


          res.render('songs/index', {genres: allGenres, artists: artsts, albums: albms, songs: sngs, title: 'Songs'});
        });
      });
    });

};






exports.filter = (req, res)=>{

  artists.find().toArray((e, artsts)=>{
    albums.find().toArray((e, albms)=>{

      albms = albms.map(album => {
        album.artist = _(artsts).find(a => {
          return a._id.toString() === album.artistId.toString();
        });
        return album;
      });

      var genre = req.params.genre;

      songs.find({genres: {$in: [req.params.genre]}}).toArray((e, sngs)=>{

        //{ field: { $in: [<value1>, <value2>, ... <valueN> ] } }

        sngs = sngs.map(s=>{
          var al = _(albms).find(a=>a._id.toString() === s.albumId.toString());

          // s.genres.forEach(x=>{
          //   allGenres.push(x);
          // });

          s.album = al;
          s.artist = al.artist.name;
          return s;
        });

        res.render('songs/filter', {genre: genre, artists: artsts, albums: albms, songs: sngs, title: 'Songs'});
      });
    });
  });
};







exports.create = (req, res)=>{
  var path = require('path');
  var fs   = require('fs');
  var mp   = require('multiparty');
  var fm   = new mp.Form();

  fm.parse(req, (err, fields, files)=>{
    var name       = fields.name[0];
    var normalized = name.split(' ').map(w=>w.trim()).map(w=>w.toLowerCase()).join('');
    var genres     = fields.genres[0].split(',').map(w=>w.trim()).map(w=>w.toLowerCase());
    //var artistId   = album.artistId;
    var albumId    = Mongo.ObjectID(fields.albumId[0]);
    var extension  = path.extname(files.file[0].path);
    var newPathRel = `/audios/${albumId}/${normalized}${extension}`;

    var bseDir     = `${__dirname}/../static/audios`;
    //var artDir     = `${bseDir}/${artistId}`;
    var albDir     = `${bseDir}/${albumId}`;
    var newPathAbs = `${albDir}/${normalized}${extension}`;
    var oldPathAbs = files.file[0].path;

    //if(!fs.existsSync(artDir)){fs.mkdirSync(artDir);}
    if(!fs.existsSync(albDir)){fs.mkdirSync(albDir);}
    fs.renameSync(oldPathAbs, newPathAbs);

    var song      = {};
    song.name     = name;
    song.genres   = genres;
    //song.artistId = artistId;
    song.albumId  = albumId;
    song.file     = newPathRel;

    //console.log(song);

    songs.save(song, ()=>res.redirect('/songs'));
  });
};





exports.destroy = (req, res)=>{
  var rimraf = require('rimraf');
  var _id = Mongo.ObjectID(req.params.id);

  songs.find({_id:_id}).toArray((err, sngs)=>{
    var path = `${__dirname}/../static${sngs[0].file}`;
    rimraf.sync(path);
  });

  songs.findAndRemove({_id: _id}, ()=>{
    res.redirect('/songs');
  });

};







//sdlfkjsdflkj
