const express = require('express')
const ip = require('ip')
// const ip = '89.28.176.5'
let csv= require('fast-csv');
const fs = require("fs");

const PORT = process.env.PORT || 5900

const app = express()

app.use(express.json())

let stream = fs.createReadStream("IP2LOCATION-LITE-DB1.CSV");

let arr = []
let ips = ipToNum(ip.address())
// let ips = ipToNum(ip)


function ipToNum(ip) {
    let d = ip.split('.')
    return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
}

function numToDot(num) {
    let d = num%256;
    for (let i = 3; i > 0; i--) {
        num = Math.floor(num/256);
        d = num%256 + '.' + d;
    }
    return d;
}

const start = async () => {
    try {app.listen(PORT, () => console.log('Server started on port ' +PORT))
    } catch (e) {
        console.log(e)
    }
}

start()

app.get('/', async (req, res) => {
    csv.parseStream(stream, {headers : true})
        .on("data", function(data){
            arr.push(data)
        })
        .on("end", function(){
            console.log(ips)
            arr.forEach(el => {
                if (ips >= el.startrange & ips <= el.endrange) {

                    const obj = {
                        ip: ip.address(),
                        // ip: ip,
                        startrange: numToDot(el.startrange),
                        endrange: numToDot(el.endrange),
                        country: el.country,
                    }
                    return res.json(obj)
                }

            })
            console.log("done");
        });
})











// function IptoNum(ip) {
//     return Number(
//         ip.split(".").map(d => ("000" + d).substr(-3)).join("")
//     )
// }






// let csv = "text weight\nLorem 15\nIpsum 9";
// let word_array = csv2json(csv,' ');
// console.log(word_array)

















// console.log(ipToNum(ip.address()))

















//
// let os = require('os');
// let ifaces = os.networkInterfaces();
//
// Object.keys(ifaces).forEach(function (ifname) {
//     var alias = 0;
//
//     ifaces[ifname].forEach(function (iface) {
//         if ('IPv4' !== iface.family || iface.internal !== false) {
//             // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
//             return;
//         }
//
//         if (alias >= 1) {
//             // this single interface has multiple ipv4 addresses
//             console.log(ifname + ':' + alias, iface.address);
//         } else {
//             // this interface has only one ipv4 adress
//             console.log(ifname, iface.address);
//         }
//         ++alias;
//     });
// });