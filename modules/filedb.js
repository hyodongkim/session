const fs = require('fs');
const db = {};
db.path = 'default';
db.load = ()=>{
    return JSON.parse(fs.readFileSync(db.path + ".json", {encoding:"utf-8"}));
};
db.save = (data)=>{
    fs.writeFileSync(db.path + ".json", JSON.stringify(data), {encoding:'utf-8'});
};

module.exports = db;
