const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gadgetra');

const { User } = require('./src/models/User.js');

async function updateAdminPassword() {
  try {
    const email = 'admin@gadgetra.com';
    const password = 'admin123';
    
    console.log('Updating password for admin user:', email);
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Admin user not found');
      return;
    }
    
    console.log('Admin user found:', user.name);
    
    // Update the password (this will trigger the pre-save hook to hash it)
    user.password = password;
    await user.save();
    
    console.log('Password updated successfully');
    
    // Test the new password
    const passwordMatch = await user.comparePassword(password);
    console.log('Password test result:', passwordMatch ? 'SUCCESS' : 'FAILED');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateAdminPassword();
