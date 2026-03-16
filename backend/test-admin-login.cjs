const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gadgetra');

const { User } = require('./src/models/User.js');
const bcrypt = require('bcryptjs');

async function testAdminLogin() {
  try {
    const email = 'admin@gadgetra.com';
    const password = 'admin123';
    
    console.log('Testing admin login...');
    
    // Find the user exactly like the login controller does
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'yes' : 'no');
    
    if (!user) {
      console.log('Admin user not found in database');
      return;
    }
    
    console.log('User details:');
    console.log('- Name:', user.name);
    console.log('- Email:', user.email);
    console.log('- Role:', user.role);
    console.log('- Password exists:', !!user.password);
    console.log('- Password hash length:', user.password ? user.password.length : 0);
    
    // Test password comparison exactly like the login controller
    console.log('\nTesting password comparison...');
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', passwordMatch);
    
    if (passwordMatch) {
      console.log('✅ Login should work!');
      
      // Test user method too
      const methodMatch = await user.comparePassword(password);
      console.log('User method match result:', methodMatch);
    } else {
      console.log('❌ Login will fail');
      
      // Let's check what's wrong
      console.log('\nDebugging password hash...');
      console.log('Password hash:', user.password);
      
      // Test creating a new hash
      const newHash = await bcrypt.hash(password, 10);
      console.log('New hash would be:', newHash);
      
      // Test the new hash
      const newHashMatch = await bcrypt.compare(password, newHash);
      console.log('New hash matches:', newHashMatch);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testAdminLogin();
