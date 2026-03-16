const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gadgetra');

const { User } = require('./src/models/User');

async function checkUsers() {
  try {
    const users = await User.find({});
    console.log('All users in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      console.log(`  Password exists: ${!!user.password}`);
      console.log(`  User ID: ${user._id}`);
    });
    
    const adminUser = await User.findOne({ email: 'admin@gadgetra.com' });
    if (adminUser) {
      console.log('\nAdmin user found:');
      console.log(`- Name: ${adminUser.name}`);
      console.log(`- Email: ${adminUser.email}`);
      console.log(`- Role: ${adminUser.role}`);
      console.log(`- Password hash: ${adminUser.password ? 'exists' : 'missing'}`);
      
      // Test password comparison
      const testResult = await adminUser.comparePassword('admin123');
      console.log(`- Password test (admin123): ${testResult ? 'PASS' : 'FAIL'}`);
    } else {
      console.log('\nAdmin user NOT found!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers();
