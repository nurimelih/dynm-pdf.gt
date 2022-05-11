const express = require('express')
, app = express()
, doT = require('dot')
, linq = require('linq')
, engines = require('consolidate')
, path = require ('path')
, pdf = require('html-pdf')

app.engine('html', engines.ejs);
app.set('view engine', 'html');
app.use(express.json({limit: '50mb'}));


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
  let template = req.body.template2,
  name = "temp.html",
  pdfName = "pdf-temp"
  id = "temp.html",
  p = path.join(__dirname, '/', pdfName + ".pdf");


    let tempData = {};
    let keys = Object.keys(req.body.data);
    //keys.forEach(i => { tempData[i] = req.body.parameters[i]})

    req.body.data.forEach((i) => { tempData[i.Key] = i.Value})

    var templateFn = doT.template(template);
    var resultText = templateFn({template:req.body.template2,...tempData, reqData: req.rawHeaders, res: res.body});

    console.log(tempData)

    pdf.create(resultText).toFile(`./${pdfName}.pdf`, 
            (err, res2) => {
                if(err){
                    res.send(resultText + "<div class='color:red'>"+_path+"</div>") 
                }
                else{
                    let result = doT.template('<div>Dosyanız Hazırlandı</div><a href="{{=it.filePath}}">{{=it.filePath}}</a>')({filePath: res2.filename});
                    res.send(result)
                }
            }
        )

});

app.listen(5000)