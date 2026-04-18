const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://muhammedjawadmattil786_db_user:JU3fi7r9SjCwWSzN@ac-nhz7ver-shard-00-00.2fzmurn.mongodb.net:27017,ac-nhz7ver-shard-00-01.2fzmurn.mongodb.net:27017,ac-nhz7ver-shard-00-02.2fzmurn.mongodb.net:27017/rebook?ssl=true&replicaSet=atlas-nqbo98-shard-0&authSource=admin&appName=Rebook";

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      isAdmin: Boolean,
      role: String
    });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const adminEmail = "admin@rebook.com";
    const adminData = {
      name: "Jawad Mattil",
      email: adminEmail,
      password: "12345678",
      isAdmin: true,
      role: "Super Admin"
    };

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin exists, updating...");
      await User.updateOne({ email: adminEmail }, adminData);
    } else {
      console.log("Admin not found, creating...");
      await User.create(adminData);
    }

    console.log("Admin user sync complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
