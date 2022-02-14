/*
Budgeting WebApp API that uses the envelope budgetting method.
NB. It includes a default savings envelope that stores money left-over when
a new monthly income is added. 
*/


const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const envelope = require('./envelope.js');
const savings = new envelope(savings,0); //First envelope that stores savings
let totalBudget = 5000;   //Total monthly amount
let allocatedBudget = [100]; //array that holds each envelope's allocated monthly budget. 100 allocated to savings by default
let envelopes = [savings];

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.listen(PORT,()=>{
console.log('Listening on port '+PORT);
});


app.get('/',(req,res)=>{

    res.send('Hello World')
 
})

//add an envelope
app.post('/api/addenvelope',(req,res)=>{

try{
let budgetCheck=0;
const name = req.body.name;
const amount = req.body.amount;

allocatedBudget.forEach(
    budget =>{
        budgetCheck+=budget;
    }
)

if((budgetCheck+amount)<=totalBudget){
envelopes.push(new envelope(name,amount));
allocatedBudget.push(amount);


res.send(`Entry saved \nName: ${name}\nAmount: ${amount}`);
}else{
res.send('Total Budget Exceeded, Cannot add envelope');

}


}catch(error){
console.log(error);
}

}

)

//retrieve all envelopes
app.get('/api/all',(req,res)=>{

    res.send(envelopes);

})

//retrieve a single envelope
app.get('/api/envelopes/:envelopeName',(req,res)=>{
    let name = req.params.envelopeName;
    
    let result = envelopes.find(found => found.category === name);
    
    res.json(result);
})

//deduct from balance
app.post('/api/envelopes/update/debit',(req,res)=>{
/*
req.body will have two params, description and amount which will be passed to the debitTransaction
method within the envelope object
*/
try{let name = req.body.name;
let description = req.body.description;
let amount = parseInt(req.body.amount);

let index = envelopes.findIndex(element=>element.category === name);

envelopes[index].debitTransaction(description,amount);

res.send(envelopes[index]);
}catch(error){
res.send(" Hmm... It appears you entered a wrong envelope name.")
}

})

//Refill budget and store left over funds in savings
app.post('/api/envelopes/update/credit',(req,res)=>{
//first for loop index starts at 1 cos savings envelope is at index 0
const savings = 0;

    for(let i = 1; i<envelopes.length;i++){
        savings+=envelopes[i].balance;
        envelopes[i].balance=0;
    }

    envelopes[0].creditTransaction('Left Overs',savings);

    for(let i = 0; i<envelopes.length;i++){ //Refills envelopes with allocated budget generated from when it was first created
        envelopes[i].creditTransaction('Monthly Refill',allocatedBudget[i]);
    }

})

//delete envelope
app.get('/api/envelopes/delete/:envelopeName', (req,res)=>{
    let name = req.params.envelopeName;

    let temp = envelopes.filter(element=>element.category!==name);
    envelopes = temp;

    res.send(envelopes);

})