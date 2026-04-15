// Using native fetch
const testRegistration = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test Verify',
                email: `test_${Date.now()}@example.com`,
                password: 'Test@1234',
                phone: '1234567890',
                role: 'user'
            })
        });

        const data = await response.json();

        console.log('Status Code:', response.status);
        if (response.ok) {
            console.log('✅ Registration SUCCESS:', data);
        } else {
            console.log('❌ Registration FAILURE:', data);
        }
    } catch (error) {
        console.error('❌ Network/Fetch Error:', error.message);
    }
};

testRegistration();
