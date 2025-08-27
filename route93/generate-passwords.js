// Generate proper bcrypt password hashes for production seeding
const bcrypt = require('bcryptjs');

async function generateHashes() {
  const adminPassword = 'admin123';
  const customerPassword = 'customer123';
  
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const customerHash = await bcrypt.hash(customerPassword, 10);
  
  console.log('Generated password hashes for production seeding:');
  console.log('');
  console.log('Admin password hash:');
  console.log(adminHash);
  console.log('');
  console.log('Customer password hash:');
  console.log(customerHash);
  console.log('');
  console.log('Copy these hashes into your seed-production.sql file');
}

generateHashes().catch(console.error);

