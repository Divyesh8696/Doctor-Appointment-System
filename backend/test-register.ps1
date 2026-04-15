$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "Test@123"
    phone = "1234567890"
    role = "user"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -Headers $headers
    Write-Host "✅ Registration successful!"
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ Registration failed:"
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message
    }
}
