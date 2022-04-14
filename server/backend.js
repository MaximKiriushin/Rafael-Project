const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require("cors");
const VirusTotalApi = require("virustotal-api");
const curl = new (require( 'curl-request' ))();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({ //conecting to the database
    host: 'localhost',
    user: 'root', 
    password: 'maxim', 
    database: 'atdb'

})

app.use(function (req, res, next){
    res.header("Access-Control-Allow-Origins", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

});

app.get('/getAttacksNames', (req, res) => { //getting all the names and thje descriptions from the database and sending it into localhost:3001/getAttackNames
    db.query("SELECT Name,Description FROM attacksinfos", (err, result) => {
        if (err) {
            console.log(err);
        }else{
            res.send(result)
        }
    })
})


app.post('/getInfoAboutName', (req, res) => { //making a qeury that searching for a specific attack by her name
    const attackName = req.body.attackName;
    db.query(`SELECT * FROM attacksinfos WHERE Name ="${attackName}";`, (err, result) => {
        if (err) {
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.post('/getVirusTotalInfo', (req, res) => { //chacking the site by his url and giving the use the result
    const siteName = req.body.siteName;
    const VirusTotalApi = require("virustotal-api");
    const virusTotal = new VirusTotalApi("42f09fe2e1c4f63de203d4f966b8c0e0197356f73cbcb992f8417bdee5d305fe");
    virusTotal
    .urlReport(siteName, false, 1)
    .then(response => {
    let resource = response.resource;
    res.send(response)
    })

    .catch(err => res.send("Site doesnt exist"));
})


app.post('/sendAnalysis', (req, res) => {//This function is sending specfic file to analysis by the path and returning to the user the task id that he can to search it in the function bellow
    const { exec } = require("child_process");
    const filePath = req.body.filePath;
    exec(`curl -H "Authorization: Bearer 9pFfa_nGbQ-IiZQp__5QcA" -F file=@${filePath} http://localhost:8090/tasks/create/file`, (error, data, getter) => {

        if(error){
            res.send("Error in packge");
            return;
        }
        if(getter){
            console.log("data", data)
            res.send(data)
            return;
        }
        res.send(data)
    });

})

app.post('/getAnalysis', (req, res) => { //this function is taking the task id from the user and searching it on cuckoo sanbox and reatuning the score to the user
    const packgeId = req.body.packgeId;
    curl.setHeaders([
        "Authorization: Bearer 9pFfa_nGbQ-IiZQp__5QcA"
    ])
    .get('http://localhost:8090/tasks/report/' + packgeId)
    .then(({statusCode, body, headers}) => {
        if(body['message'] !== "Report not found"){
            res.send(body['info'])
        }else{
            res.send("Cant find this id.")
        }
    })
    .catch((e) => {
        res.send(body);
    });
})

app.listen(3001, () => {
    //console.log("EveryThing should work fine.\n");
})