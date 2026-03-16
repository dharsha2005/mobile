const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gadgetra');

const { User } = require('./src/models/User.js');
const bcrypt = require('bcryptjs');

async function checkPassword() {
  try {
    const email = 'admin@gadgetra.com';
    const password = 'admin123';
    
    console.log('Checking password for:', email);
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', user.name);
    console.log('Password hash exists:', !!user.password);
    console.log('Password hash length:', user.password ? user.password.length : 0);
    console.log('Password hash (first 50 chars):', user.password ? user.password.substring(0, 50) + '...' : 'N/A');
    
    // Test password comparison
    console.log('\nTesting password comparison...');
    
    // Test with bcrypt directly
    const directCompare = await bcrypt.compare(password, user.password);
    console.log('Direct bcrypt compare result:', directCompare);
    
    // Test with user method
    const methodCompare = await user.comparePassword(password);
    console.log('User method compare result:', methodCompare);
    
    // Test if password needs rehashing
    console.log('\nTesting password rehash...');
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(password, salt);
    console.log('New hash generated');
    
    // Compare new hash with old hash
    const hashesMatch = newHash === user.password;
    console.log('Hashes match:', hashesMatch);
    
    // Test with new hash
    const newHashCompare = await bcrypt.compare(password, newHash);
    console.log('New hash compare result:', newHashCompare);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkPassword();
