var express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql')
var app = express();
const path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
  
app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json())
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'/public')));

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",saveUninitialized:true, resave: false}));

const db  = mysql.createConnection({
    host            : 'localhost',
    user            : 'root',
    password        : '08019899',
    database        : 'mangandakita'
})

db.connect((err)=>{
    if(err) throw err
    console.log("Connected to db")
})

app.get('/',(req,res) => {
    res.render("home")
});

app.all('/admin',(req,res) => {

    if(req.method=="POST"){

        const params = req.body

        const sql = `SELECT adminID FROM admin WHERE adminUname = "${params.adminUname}" AND adminPass = "${params.adminPass}"`

        db.query(sql, (err,results)=>{
            if(err) throw err;

            if(results.length==0){
                res.render("admin",{error:true})
            }

            else if(results.length>0){
                res.redirect("adminDashboard")
            }
        })

    } else {
        res.render("admin",{error:false})
    }

});

app.all('/adminDashboard',(req,res) => {
    res.render("adminDashboard")
});

app.get('/techStack',(req,res) => {
    res.render("tech")
});

app.get('/contactInfo',(req,res) => {
    res.render("contactInfo")
});

app.all('/approval',(req,res) => {
    const sql = `SELECT * FROM users`

    db.query(sql, (err,results)=>{

        if(err) throw err;

        res.render("approval", {data:results})
            
    })
});

app.get('/accept/:id',(req,res) => {
    
    const sql = `UPDATE users SET userStatus = "Accepted" WHERE userID = ${req.params.id}`;

        db.query(sql, (err,result)=>{

            if(err) throw err;

            res.redirect("/approval")

        })
});

app.get('/decline/:id',(req,res) => {
    
    const sql = `UPDATE users SET userStatus = "Declined" WHERE userID = ${req.params.id}`;

        db.query(sql, (err,result)=>{

            if(err) throw err;

            res.redirect("/approval")

        })
});


app.all('/guestLogin',(req,res) => {

    if(req.method=="POST"){

        const params = req.body

        const sql = `SELECT userID FROM users WHERE userUname = "${params.userUname}" AND userPass = "${params.userPass}"`

        db.query(sql, (err,results)=>{
            if(err) throw err;

            if(results.length==0){
                res.render("guestLogin",{error:true})
            }

            else if(results.length>0){
                res.redirect("guestDashboard")
            }
        })

    } else {
        res.render("guestLogin",{error:false})
    }
});

app.all('/guestSignUp',(req,res) => {
   if(req.method=="POST"){

        const params = req.body;

        const sql = "INSERT INTO users SET ?";

        db.query(sql, params, (err,result)=>{

            if(err) throw err;

            db.query("SELECT LAST_INSERT_ID() as id", (err1,result1)=>{
                if(err1) throw err1
                var session = req.session
                session.userid = {id:result1[0].id};
                res.redirect("/guestDashboard")
            })
        })

    } else {
        res.render("guestSignUp")
    }
});

app.all('/guestDashboard',(req,res) => {
    res.render("guestDashboard")
});

app.all('/guestMenu',(req,res) => {
    res.render("guestMenu")
});

app.all('/menu',(req,res) => {

    const sql = `SELECT * FROM products`

    db.query(sql, (err,results)=>{

        if(err) throw err;

        res.render("menu", {data:results})
            
    })
    
});

app.all('/orderForm',(req,res) => {

    const sql = `SELECT * FROM products`

    db.query(sql, (err,results)=>{

        if(err) throw err;

        res.render("orderForm", {data:results})
            
    })
});

app.listen(process.env.PORT||3000)

// orange = f17720
// yellow = ffa630
// light blue = 00a7e1
// blue = 0474ba