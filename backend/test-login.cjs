const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gadgetra');

const { User } = require('./src/models/User');

async function testLogin() {
  try {
    console.log('Testing login process...');
    
    // Step 1: Find user
    const email = 'admin@gadgetra.com';
    const password = 'admin123';
    
    console.log('Step 1: Finding user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.name);
    console.log('✅ User has password:', !!user.password);
    
    // Step 2: Test password comparison
    console.log('Step 2: Testing password comparison...');
    const passwordMatch = await user.comparePassword(password);
    
    if (passwordMatch) {
      console.log('✅ Password matches - Login should work!');
    } else {
      console.log('❌ Password does not match');
    }
    
    // Step 3: Test with wrong password
    console.log('Step 3: Testing with wrong password...');
    const wrongPasswordMatch = await user.comparePassword('wrongpassword');
    
    if (wrongPasswordMatch) {
      console.log('❌ Wrong password matched - This should not happen!');
    } else {
      console.log('✅ Wrong password correctly rejected');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testLogin();
