var request = require("request");
var express = require("express");

var app = express();

app.get("/home", function(req, res) {
    getBusToHome(function(str) {
        res.send(str);
    });
});

app.get("/work", function(req, res) {
    getBusToWork(function(str) {
        res.send(str);
    });
});

app.listen(3002);


function toJSON(str) {
    str = str.replace("**YGKJ", "");
    str = str.replace("YGKJ##", "");
    str = JSON.parse(str);
    return str.jsonr.data;
}

function getBus(bus, lineId, order) {
    return new Promise(function(resolve, reject) {
        request("https://api.chelaile.net.cn/bus/line!lineDetail.action?sign=&v=5.40.0&s=IOS&sv=10.3&vc=10450&cityId=014&lineId="+lineId+"&targetOrder="+order, function(err, res, body) {
            if (err) throw err;
            var data = toJSON(body);
            var buses = data.buses;
            var index = -1;
            for (var i=0; i<buses.length; i++) {
                if (buses[i].order > order) {
                    index = i-1;
                    break;
                }
            }
            if (index >= 0) {
                var lastOrder = order - buses[index].order;
                if (lastOrder == 0) {
                    resolve(bus + "还有" + buses[index].distanceToSc + "米");
                } else {
                    resolve(bus + "还有" + lastOrder + "个站");
                }
            } else {
				resolve(bus + "没车了");
			}
        });
    })
}

async function getBusToHome(cb) {  //  大冲->西乡

    var str1 = await getBus("338", "0755-03380-1", "15");

    var str2 = await getBus("M194", "0755102697037", "29");

    var str3 = await getBus("M433", "0755-M4333-0", "22");

    var str4 = await getBus("M530", "0755-00305-0", "8");

    var str = str1 + "<br>" + str2 + "<br>" + str3 + "<br>" + str4;

    if (cb) {
        cb(str);
    }
}

async function getBusToWork(cb) {  //  西乡->大冲

    var str1 = await getBus("338", "0755-03380-0", "22");
    
    var str2 = await getBus("M194", "0755102695723", "12");

    var str3 = await getBus("M433", "0755-M4333-1", "28");

    var str4 = await getBus("M530", "0755-00305-1", "29");

    var str = str1 + "<br>" + str2 + "<br>" + str3 + "<br>" + str4;

    if (cb) {
       cb(str);
    }
}

