// testSignup.js
// This script tests the signup endpoint of the Tribtel backend.

async function testSignup() {
  const res = await fetch("http://localhost:4000/api/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "testuser",
      email: "test@example.com",
      password: "secret"
    })
  });

  const data = await res.json();
  console.log("Response from backend:", data);
}

testSignup();
