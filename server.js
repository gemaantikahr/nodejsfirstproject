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
    if(req.session.username){
        res.redirect('/home')
    }else{
        console.log('nini');
        res.render('login/v_login');
    };
});

app.get('/home', function(req, res){
    if(req.session.username){
        conn.query("SELECT *FROM tbl_student", (err, studentlist)=>{
            res.render('student/v_show_student',{
                studentlist: studentlist,
                name : ssn.user,
            });
        });
    }else{
        res.redirect('/');
    }
    
});

app.post('/login', function(req, res){
    var username = req.body.xusername;
    var password = md5(req.body.xpassword);
    ssn = req.session;
    ssn.user = req.body.xusername;
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
    });
});

app.get('/course', function(req, res){
    var name = req.session.username; 
    if(req.session.username){
        query = "SELECT *FROM tbl_course";
        conn.query(query, (err, courselist)=>{
            if(err) throw err;
            res.render('course/v_course',{
                courselist:courselist,
                name : name
            });
        });
    }else{
        res.redirect('/');
    }
});

app.get('/logout',function(req,res){
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });

  //relation
  app.get('/relation', function(req, res){      
    var name = req.session.username;
    if(name){
        query = "SELECT *FROM tbl_student";
        conn.query(query, (err, studentlist)=>{
            if(err) throw err;
            res.render('relation/v_relation', {
                name : name,
                studentlist : studentlist
            });
        });
    }else{
        res.redirect('/');
    }
  });



app.listen(8000, ()=>{
    console.log("server is running at 8000 port");
});