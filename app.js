const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const dust  = require('dustjs-helpers');
const {Client} = require('pg');

const app = express();

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'recipe',
    password: 'root',
    port: 5432,
  })
  client.connect()

//Assign Dust
app.engine('dust', cons.dust);
//Set default Ext.dust
app.set('view engine', 'dust');
app.set('views', __dirname+'/views');

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.get('/',(req, res)=>{
   
    client.query('SELECT * from recipetable', (err, result)=>{
        if(err){
            console.log(err);
            return;
        }
        res.render('index', {recipes: result.rows})
        
    })
});

app.post('/add', (req, res)=>{
   
    client.query('INSERT INTO recipetable(name, ingredients, directions) VALUES($1, $2, $3)', [req.body.name, req.body.ingredients, req.body.directions])
    .then(res=>{
        console.log('Inserted the data into the table successfully')
    })
    .catch(err=>{
        console.error(err);
    })
    .finally(()=>{
        res.redirect('/');
        
    })
});

app.delete('/delete/:id', (req, res)=>{
    client.query('DELETE FROM recipetable WHERE id = $1', [req.params.id])
    .then(result=>{
        console.log('Deleted the data successfully');
    })
    .catch(err=>{
        console.error(err);
    })
    .finally(()=>{
        res.sendStatus(200);
    })
})

app.post('/edit', (req, res)=>{
    client.query('UPDATE recipetable SET name=$1, ingredients=$2, directions=$3 WHERE id=$4',[req.body.name, req.body.ingredients, req.body.directions, req.body.id])
    .then(result=>{
        console.log('Updation done successfully');
    })
    .catch(err=>{
        console.error(err);
    })
    .finally(()=>{
        res.redirect('/');
    })
})


PORT = 3000;
app.listen(PORT, ()=>{
    console.log('Server running on PORT 3000');
});