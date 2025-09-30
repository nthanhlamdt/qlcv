// Test script to check if cookies are being set correctly
const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login and cookie setting...');

    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:');
    for (let [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    const data = await response.json();
    console.log('Response data:', data);

    // Test if cookies are set
    const setCookieHeader = response.headers.get('set-cookie');
    console.log('Set-Cookie header:', setCookieHeader);

  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin();
