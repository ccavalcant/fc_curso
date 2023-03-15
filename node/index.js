const http = require('http');
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb',
  charset: 'utf8'
});

//html string that will be send to browser
var reo ='<html><head><title>People List</title></head><body><h1>Full Cycle Rocks!!</h1>{${table}}</body></html>';

//sets and returns html table with results from sql select
//Receives sql query and callback function to return the table
function setResHtml(sql, cb){
  pool.getConnection((err, con)=>{
    if(err) throw err;

    con.query(sql, (err, res, cols)=>{
      if(err) throw err;

      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ (i+1) +'</td><td>'+ res[i].name +'</td></tr>';
      }
	table ='<table border="1"><tr><th>Nr.</th><th>Name</th></tr>'+ table +'</table>'; 
      con.release(); //Done with mysql connection

      return cb(table);
    });
  });
}

let sql ='SELECT id, name FROM people order by name';

//create the server for browser access
const server = http.createServer((req, res)=>{
  setResHtml(sql, resql=>{
    reo = reo.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(reo, 'utf-8');
    res.end();
  });
});

server.listen(3000, ()=>{
  console.log('Server running at //localhost:3000/');
});
