const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive= require('massive');
require('dotenv').config();

const app = express();
app.use( bodyParser.json() );
app.use( cors() );

massive(process.env.CONNECTION_STRING)
  .then(dbInstance=>{
    // NOT good practice. Usually we want to create our tables in Postico or through the DB's console (pgweb).
    // dbInstance.create_table().then(c=>console.log(c));
    dbInstance.new_planes();
    app.set('db', dbInstance);
  }).catch(console.log);

  app.get('/api/airplanes/:id', (req,res)=>{
    // We must redefine db because it is not available in this functional scope.
    const db= req.app.get('db');
    // We use an array just in case we have multiple values we want to pass into get_planes.
    // Here, $1 refers to the FIRST value in the array since SQL is not 0-indexed. 
    db.get_planes([req.params.id])
    .then((response)=>{
      return res.status(200).json(response);
    }).catch(err=>{
      console.log(err);
    })
  })

const port= process.env.PORT || 3000
app.listen( port , () => { console.log(`We live baby! ${port}`); } );
