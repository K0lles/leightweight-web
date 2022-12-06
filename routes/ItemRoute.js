import express from 'express';
import items from '../data/items.json';
import _ from 'lodash';
import mongoose from 'mongoose';

const DB_URL = 'mongodb://mongodb:27017/node_database';
const DB_USER = '';
const DB_PASSWORD = '';

const router = express.Router();

let itemsArray = items;

mongoose.connect(DB_URL);
const db = mongoose.connection;
db.once('open', () => {
    console.log('DB connection is established');
});

const SimpleItemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String
})

const SimpleItemModel = mongoose.model('SimpleItem', SimpleItemSchema);

router.get('/', (req, res) => {
    SimpleItemModel.find((error, itemsDB) => {
        if (error) {
            res.status(500).send(error);
            return handleError(error);
        }
        if (itemsDB) {
            res.json(itemsDB);
        }
    })
    res.json(items);
})

router.post('/', (req, res) => {
    const id = mongoose.Types.ObjectId();
    const itemToPersist = Object.assign({
        _id: id
    }, req.body
    );

    const item = new SimpleItemModel(itemToPersist);
    item.save(error => {
        if(error) {
            res.status(500).send(error);
            return handleError(error);
        }
        res.json(item);
    })
    // itemsArray.push(req.body);
    // res.status(200).send("OK");
})

router.get('/:id', (req, res) => {
    let id = req.params.id;
    SimpleItemModel.findById(id, (error, item) => {
        if(error) {
            res.status(500).send(error);
            return handleError(error);
        }
        if(item) {
            res.json(item);
        }
        else {
            res.status(404).send('Item was not found inside database');
        }
    })
    // let item = _.find(itemsArray, item => item.id == id);
    // if (item) {
    //     res.json(item);
    // }else {
    //     res.send('NOT FOUND');
    // }
})

router.delete('/:id', (req, res) =>{
    const id = req.params.id;
    SimpleItemModel.findByIdAndDelete(id, (error, item) => {
        if(error){
            res.status(500).send(error);
            return handleError(error);
        }
        res.status(200).send('Item is DELETED!');
    });
});

router.put('/:id', (req, res)=>{
    const id = req.params.id;
    SimpleItemModel.findById(id, (error, item) => {
        if (error){
            res.status(500).send(error);
            return handleError(error);
        }
        if(item){
            item.name = req.body.name;
            item.description = req.body.description;
            item.save( error => {
                    if(error){
                        res.status(500).send(error);
                        return handleError(error);
                    }
                    res.json(item);
                }
            );
        }
    });
});

function errorHandler(err, req, res, next){
    res.status(500);
    res.render('error',{error: err});
}

module.exports = router;