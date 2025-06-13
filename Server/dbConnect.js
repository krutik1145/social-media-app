const mongoose = require('mongoose');

module.exports = async() => {
     const mongoUri = 'mongodb+srv://krutikjain1114:1234@cluster0.hrc6gi1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
      try {
        const connect = await mongoose.connect(mongoUri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
     });

     console.log('mongo db connected');
      } catch (error) {
        console.log(error);
        process.exit(1); // 1 means error is ocurred so exit ho rha hai 
      }
     
}  