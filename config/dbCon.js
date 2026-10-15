const mongoose = require('mongoose');
module.exports = {
  connectDB: async () => {
    try {
      mongoose.set("strictQuery", false)
      await mongoose.connect(process.env.mongo_cloud, { useNewUrlParser: true });
      console.log('database Connected');
    } catch (err) {
      console.error('Error database not connected', err);
    }
  }
}

// module.exports = {
//     connectDB: async (dbUrl)=>{
//         mongoose.set("strictQuery", false);
//         return mongoose.connect(dbUrl,()=>console.log('db connected'))
//     }
// }