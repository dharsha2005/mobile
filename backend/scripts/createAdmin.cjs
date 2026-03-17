const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple user schema for admin creation
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    // Use the same DB as the backend
    const dbUri = process.env.MONGODB_URI || 'mongodb+srv://onlytamilan6_db_user:08-Aug-05@cluster0.irjjr71.mongodb.net/gadgetra?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');
    
    // Create hashed password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gadgetra.com' });
    if (existingAdmin) {
      console.log('Admin user exists, updating password...');
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('✅ Admin user password updated!');
      console.log('📧 Email: admin@gadgetra.com');
      console.log('🔑 Password: admin123');
      console.log('🎯 Role: admin');
      process.exit(0);
    }
    
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@gadgetra.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@gadgetra.com');
    console.log('🔑 Password: admin123');
    console.log('🎯 Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
