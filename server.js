var express = require('express');
var bp = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var path = require('path');
var hbs = require('hbs');
var port = 8000;
var md5 = require('md5');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_nodelogin'
});
conn.connect((err)=>{
    if(err) throw err;
    console.log('mysql connected');
});
var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

app.set('views', path.join(__dirname,'view'));
app.set('view engine', 'hbs');

app.get('/', function(req, res){
    // res.sendFile(path.join(__dirname + '/view/v_loginhtml.html'));
    res.render('login/v_login');
});

app.get('/home', function(req, res){
    var name = "gema antikahariadi";
    conn.query("SELECT *FROM tbl_student", (err, studentlist)=>{
        res.render('student/v_show_student',{
            studentlist: studentlist,
            name : name,
        });
    });
});

app.post('/login', function(req, res){
    var username = req.body.xusername;
    var password = md5(req.body.xpassword);
    if(username && password){
        conn.query('select *from tbl_user where username =? and password = ?', [username, password], function(error, results, fields ){
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/home');
                console.log(username);
            }else{
                res.send('Incorrect username or password');
                res.end();
                console.log(password);
            }    
        })
    }
});


// save student
// app.post('/savestudesnt', function(req, res){
//     var id = req.body.xid;
//     var name = req.body.xname;
//     var address = req.body.xaddress;
//     if(id && name && address){
//         conn.query("INSERT INTO tbl_student(student_id, student_name, student_address) VALUES('"+id+"','"+name+"','"+address+"')", (err, results)=>{
//             res.redirect('/home');
//         });
//     };
// });

app.post('/savestudent', function(req, res){
    let data = {
        student_id : req.body.xid,
        student_name : req.body.xname,
        student_address : req.body.xaddress
    }
    query = "INSERT INTO tbl_student SET ?";
    conn.query(query, data, (err, results)=>{
        if(err) throw err;
        res.redirect('/home');
    });
});

app.post('/updatestudent', function(req, res){
    var id = req.body.xid;
    var nim = req.body.xnim;
    var name = req.body.xname;
    var address = req.body.xaddress;
    query = "UPDATE tbl_student set student_id = '"+nim+"', student_name = '"+name+"', student_address = '"+address+"' WHERE id_mahasiswa ='"+id+"'";
    conn.query(query, (err, results)=>{
        if(err) throw err;
        res.redirect('/home');
    });
});

app.post('/delete', function(req, res){
    var id = req.body.xid;
    query = "DELETE FROM tbl_student WHERE id_mahasiswa = '"+id+"'";
    conn.query(query, (err, results)=>{
        if(err) throw err;
        res.redirect('/home');
    })
})




app.listen(8000, ()=>{
    console.log("server is running at 8000 port");
});