const fs = require('fs')
const http = require('http')
const url = require('url')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data)

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
                    .replace(/{%IMAGE%}/g, product.image)
                    .replace(/{%PRICE%}/g, product.price)
                    .replace(/{%NUTRIENTS%}/g, product.nutrients)
                    .replace(/{%FROM%}/g, product.from)
                    .replace(/{%QUANTITY%}/g, product.quantity)
                    .replace(/{%DESCRIPTION%}/g, product.description)
                    .replace(/{%ID%}/g, product.id);
    output = product.organic ? output.replace(/{%NOT_ORGANIC%}/g, '') : output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

// SERVER
const server = http.createServer((req, res) => {
    const {query, pathname } = url.parse(req.url, true)

    // Overview Page
    if (pathname === '/overview' || pathname === '/') {
        res.writeHead(200, {'Content-type': 'text/html'})

        const cardsHtml = dataObj.map(obj => replaceTemplate(tempCard, obj)).join('');
        // console.log(cardsHtml)
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output)

    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObj[query.id]
        console.log(product)
        const output = replaceTemplate(tempProduct, product)
        res.end(output)

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(data);

    // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>')
    }

})
//defaults to localhost without setting it to 127.0.0.1
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})