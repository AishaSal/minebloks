let initialConversionRate = 0
let lastConversionRate = 0

run()

async function run() {
    while (true) {
        main()
        await new Promise(resolve => setTimeout(resolve, 300000))
    }
}

async function main() {

    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://wax.greymass.com/v1/chain/get_table_rows',
        'headers': {
            'authority': 'wax.greymass.com',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'text/plain;charset=UTF-8',
            'origin': 'https://wax.bloks.io',
            'referer': 'https://wax.bloks.io/',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36'
        },
        body: '{"json":true,"code":"miningntwrkc","scope":"miningntwrkc","table":"config","lower_bound":null,"upper_bound":null,"index_position":1,"key_type":"","limit":"100","reverse":false,"show_payer":true}'

    };
    request(options, function(error, response) {
        if (error) throw new Error(error);

        let obj = JSON.parse(response.body)

        let tokens_pool = obj.rows[0].data.tokens_pool
        let shares_pool = obj.rows[0].data.shares_pool

        let currentConversionRate = Number(tokens_pool / shares_pool * 100000).toFixed(6)

        if (initialConversionRate == 0) initialConversionRate = currentConversionRate

        dt = new Date()

        let minutes = dt.getMinutes()
        if (minutes < 10) minutes = '0' + minutes
        let hour = dt.getHours()
        if (hour < 10) hour = '0' + hour

        //console.log(obj);

        console.log('At ' + hour + ':' + minutes + ' 1,000,000,000 SHARES --> ' + currentConversionRate + ' BTK' + '  [compared to initial: ' + (currentConversionRate - initialConversionRate).toFixed(6) + '  compared to last: ' + (currentConversionRate - lastConversionRate).toFixed(6) + ']')

        lastConversionRate = currentConversionRate

    });

}