const mysql = require('mysql')
const fs = require('fs');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'maxim', 
    database: 'atdb'
})

const testFolder = '.\\attack-pattern';

db.connect(function(err){
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;     
    }
    else{
        var path = ""
        var phase_name = ""
        var counter = 0;
        fs.readdir(testFolder, (err, files) => {
            files.forEach(file => { //going on all the fiels 
                path = testFolder + "\\" + file;
                fs.readFile(path, 'utf8',  (err, jsonString) => {
                    if(!err){
                        const data = JSON.parse(jsonString) //varibale to store all the data
                        var name = data['objects']['0']['name'] ?? "NA";
                        var description = data['objects']['0']['description'] ?? "NA";
                        var id = data['objects']['0']['id'] ?? "NA";
                        var x_mitre_platforms = data['objects']['0']['x_mitre_platforms'];
                        var x_mitre_detection = data['objects']['0']['x_mitre_detection'] ?? "NA";
                        if (data['objects']['0']['kill_chain_phases'] != undefined){
                            data['objects']['0']['kill_chain_phases'].forEach(value=>{
                                phase_name += value['phase_name'] + ", "
                            })
                        }else{
                            phase_name = "NA"
                        }
                        if (x_mitre_platforms == undefined){
                            x_mitre_platforms = "NA"
                        }
                        else{
                            x_mitre_platforms = x_mitre_platforms.toString();
                        }
                        //sending into the database
                        var sqlInsert = `INSERT INTO attacksinfos (Name, Description, AttackId, x_mitre_platforms, x_mitre_detection, phase_name) VALUES ("${name.replace(/"/g, '\\"')}", "${description.replace(/"/g, '\\"')}", "${id.replace(/"/g, '\\"')}", "${x_mitre_platforms.replace(/"/g, '\\"')}", "${x_mitre_detection.replace(/"/g, '\\"')}", "${phase_name.replace(/"/g, '\\"')}");`
                        db.query(sqlInsert)
                        counter = counter + 1
                        console.log(counter)
                        name = "", description = "", id = "", x_mitre_platforms = "", x_mitre_detection = "", phase_name = "";
                    }
                });

            });
        });
    }
})
