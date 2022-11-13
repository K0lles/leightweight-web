import express from 'express';
import items from './data/items.json';
import _ from 'lodash';
import ItemRoute from './routes/ItemRoute';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';

const URL_ITEMS = '/api/v1/items';

const port = 3000;
const server = express();
server.set('views', path.join('views'));
server.set('view engine', 'ejs');

server.use(morgan('tiny'));
server.use(bodyParser.json());

server.listen(port);
server.use(URL_ITEMS, ItemRoute);

server.get('/', (req, res) => {
    res.render('index', {items});
})