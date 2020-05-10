const express = require('express');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const mongoClient = require('mongodb').MongoClient;
// const {validate, ValidationError, Joi} = require('express-validation');

// const loginValidation = {
//     body: Joi.object({
//         // id: Joi.string().id().required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
//     })
// }

const url = 'mongodb://localhost:27017/rest-api';

let app = express();
app.use(logger('dev'));
app.use(bodyParser.json());

const client = new mongoClient(url, {useUnifiedTopology: true});

client.connect((err)=>{
    if(err) return process.exit(1);

    const db = client.db('rest-api');

    app.get('/accounts', (req,res)=>{
        db.collection('accounts').find({}, {sort: {_id: -1}}).toArray((err,accounts)=>{
            if(err) return next(err);
            res.send(accounts);
        }) ;
    });

    app.post('/accounts',  (req,res)=>{
        let newAccount = req.body;
        db.collection('accounts').insertOne(newAccount, (err,result)=>{
            if(err) return next(err);
            res.send(result);
        });
    });

    // app.use(function(err,req,res,next){
    //     if (err instanceof ValidationError){
    //         return res.status(err.statusCode).json(err);
    //     }
    //     return res.status(500).json(err);
    // });

    app.put('/accounts/:id', (req,res)=>{
        db.collection('accounts').updateOne({_id: mongodb.ObjectID(req.params.id)}, {$set: req.body}, (err,result)=>{
            if (err) return next(err);
            res.send(result);
        });
    });

    app.delete('/accounts:id', (req,res)=>{
        db.collection('accounts').remove({_id: mongodb.ObjectID(req.param.id)}, (err,result)=>{
            if(err) return next(err);
            res.send(result);
        });
    });
    app.use(errorHandler());
    app.listen(3000);

})