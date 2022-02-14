class envelope {

    constructor(category,amount){
        this.category = category;
        this.balance = amount;
        this.transactions = [];
    }

     creditTransaction(description, amount){
      this.balance += amount;

      this.transactions.push({
         description: description,
         amount : `+${amount}`,
         date : new Date().toISOString().substring(0,10)
      })

     }


     debitTransaction(description, amount){
      if(this.balance<amount){
         return "Your Balance is insufficient"
      }else{

      this.balance-=amount;

      this.transactions.push({
         description: description,
         amount : `-${amount}`,
         date : new Date().toISOString().substring(0,10)
      })
      return "Transaction succesful"
      }
     }



}

module.exports = envelope;