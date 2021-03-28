let express = require('express')
let app = express()
let router = express.Router()
let PORT = process.env.PORT || 8081
const path = require('path')
let h = new Date().toLocaleString()

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/forms'));

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

//add the router
app.use('/', router);
app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT + ' às ' + h);
})