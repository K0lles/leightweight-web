import express from 'express';
import items from '../data/items.json';
import _ from 'lodash';

const router = express.Router();

let itemsArray = items;

router.get('/', (req, res) => {
    // middleware
    res.json(itemsArray);
})

router.post('/', (req, res) => {
    itemsArray.push(req.body);
    res.status(200).send("OK");
})

router.get('/:id', (req, res) => {
    let id = req.params.id;
    let item = _.find(itemsArray, item => item.id == id);
    if (item) {
        res.json(item);
    }else {
        res.send('NOT FOUND');
    }
})

module.exports = router;