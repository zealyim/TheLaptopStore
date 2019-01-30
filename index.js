const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'); //__dirname is defined in node.js since ES6 for home folder
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
    // console.log('someone access server');
    // console.log('yes');
    const pathName = url.parse(req.url, true).pathname;
    const query = url.parse(req.url, true).query;
    const id = query.id;

    // PRODUCT OVERVIEW
    if (pathName === '/products' || pathName === '/') {

        res.writeHead(200, {'Content-type': 'text/html'});

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                res.end(overviewOutput.replace('{%CARDS%}', cardsOutput));
            });
            
        });
        // res.end('this is the product page');
        
    }
    // LAPTOP DETAIL
    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {'Content-type': 'text/html'});

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });

        // res.end(`this is the laptop page for laptop ${id}`);
        
    } 
    // IMAGES
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {

        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(data);
        });
    }
    // URL NOT FOUND
    else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('URL was not found!');
    }

});

server.listen(1337, '127.0.0.1', () => {
    console.log('listening for request');
});

function replaceTemplate (originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}