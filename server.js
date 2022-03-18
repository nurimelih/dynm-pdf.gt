const express = require('express')
, app = express()
, doT = require('dot')
, engines = require('consolidate')
, fs = require('fs')
, path = require ('path')
, pdf = require('html-pdf');

app.engine('html', engines.dot);
app.set('view engine', 'html');
app.use(express.json());

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));

const options = { format: 'Letter' };

app.get('/', function (req, res) {
  res.send(`<pre><code> 
    {
        "template2": "htmlContent",
        "origin": "Antalya",
        "destination": "Balıkesir"
    }
    </code></pre>
<label>htmlContent:</label>
    <textarea rows=5 cols=100 ><style>div{border:1px solid black; color:black; width:250px; margin: auto;padding:1em;}</style><div>{{=it.origin}}  --> {{=it.destination}}</div><div>Dosya hazırlama tarihi: {{=new Date().toString().substr(0,21)}}</div></textarea>
    <p>use /api url and send this request via post method </p>
    `)
})

app.post('/api', (req, res) => {
  let temp = req.body.template2,
  name = "temp.html",
  
  pdfName = "pdf-temp"
  id = "temp.html";


fs.writeFile("views/"+ name, temp, () => {
    res.render(id, {...req.body}, 
        (err, html) => { 

if(!html)
console.log("html is ", html)
if(err)
console.log("html has ", err) 

            return pdf.create(html || "string", options).toFile(`./${pdfName}.pdf`, 
            (err, res2) => {
                res.render("result", {filePath: res2.filename})
            }
        )})
    })
});

app.listen(5000)