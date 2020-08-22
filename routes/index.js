var express = require('express');
const { ObjectID } = require('mongodb');
var router = express.Router();

/* GET home page. */
module.exports = (db) => {
  router.get('/', function (req, res, next) {
    const { checkId, id, checkString, string, checkInteger, integer, checkFloat, float, checkBoolean, boolean, checkDate, startDate, endDate } = req.query;
    let query = new Object();
    const reg = new RegExp(string);

    if (checkId && id) {
      query._id = id;
    }
    if (checkString && string) {
      query.string = reg;
    }
    if (checkInteger && integer) {

      console.log('disini')
      query.integer = parseInt(integer);
    }
    if (checkFloat && float) {
      query.float = parseFloat(float);
    }
    if (checkBoolean && boolean) {
      query.boolean = JSON.parse(bool);
    }
    if (checkDate && startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate }
    }
    const page = req.query.page || 1;
    const limit = 3;

    const offset = (page - 1) * limit;

    //New Page by Pagination
    let url = req.url.includes('page') ? req.url : `/?page=1&` + req.url.slice(2)
    console.log(query)
    db.collection('siswa').count()
      .then((total) => {
        const pages = Math.ceil(total / limit)

        db.collection('siswa').find(query).limit(limit).skip(offset).toArray((err, data) => {
          if (err) return res.json(err)
          console.log(data);

          res.render('index', {
            data,
            page,
            pages,
            url
          })

        })
      }).catch(err => console.log(err))



  });
  router.get('/add', (req, res) => res.render('add'))

  router.post('/add', (req, res) => {
    let insert = req.body;
    let add = {
      "string": insert.string,
      "integer": insert.integer,
      "float": insert.float,
      "date": insert.date,
      "boolean": insert.boolean
    }
    db.collection('siswa').insertOne(add, err => {
      if (err) res.json(err)
    })
    res.redirect('/')
  });

  router.get('/delete/:id', (req, res) => {
    console.log('wkwkw');
    let id = req.params.id
    console.log(id);
    db.collection('siswa').deleteOne({
      "_id": ObjectID(id)
    }, err => {
      if (err) res.json(err)
    })
    res.redirect('/')
  })

  router.get('/edit/:id', (req, res) => {
    let id = req.params.id
    console.log(id);
    db.collection('siswa').findOne({
      "_id": ObjectID(id)

    }, (err, result) => {
      if (err) res.json(err)
      res.status(200).render('edit', {
        data: result
      })
    })
  })

  router.post("/edit/:id", (req, res) => {
    let id = req.params.id
    let insert = req.body
    db.collection('siswa').updateOne({
      _id: ObjectID(id)
    }, {
      $set: {

        "string": insert.string,
        "integer": insert.integer,
        "float": insert.float,
        "date": insert.date,
        "boolean": insert.boolean
      }
    }, err => {
      if (err) res.json(err)
    })
    res.redirect('/')
  })






  return router;
}