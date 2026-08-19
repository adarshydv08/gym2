$base='http://localhost:8080/api'

$ownerCred = @{ identifier='owner@ironfit.in'; password='Password@123' } | ConvertTo-Json
try {
  $owner = Invoke-RestMethod -Uri ($base + '/auth/login') -Method Post -ContentType 'application/json' -Body $ownerCred -ErrorAction Stop
  Write-Output 'OWNER_LOGIN_OK'
  $owner | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Output 'OWNER_LOGIN_FAILED'
  Write-Output $_.Exception.Message
}

$reg = @{ name='Test Member'; email='testmember@example.com'; phone='+919000000001'; password='Test@1234'; role='ROLE_MEMBER'; weightKg=72; heightCm=176; bloodGroup='O+' } | ConvertTo-Json
try {
  $r = Invoke-RestMethod -Uri ($base + '/auth/register') -Method Post -ContentType 'application/json' -Body $reg -ErrorAction Stop
  Write-Output 'REGISTER_OK'
  $r | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Output 'REGISTER_FAILED'
  Write-Output $_.Exception.Message
}

try {
  $ownerToken = $owner.token
  Write-Output ('OWNER_TOKEN=' + $ownerToken)
} catch {
  Write-Output 'NO_OWNER_TOKEN'
}

try {
  $headers = @{ Authorization = "Bearer $ownerToken" }
  $notes = Invoke-RestMethod -Uri ($base + '/notifications/user/1') -Method Get -Headers $headers -ErrorAction Stop
  Write-Output 'OWNER_NOTES_OK'
  $notes | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Output 'OWNER_NOTES_FAILED'
  Write-Output $_.Exception.Message
}

$managerCred = @{ identifier='rahul@ironfit.in'; password='Password@123' } | ConvertTo-Json
try {
  $manager = Invoke-RestMethod -Uri ($base + '/auth/login') -Method Post -ContentType 'application/json' -Body $managerCred -ErrorAction Stop
  Write-Output 'MANAGER_LOGIN_OK'
  $manager | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Output 'MANAGER_LOGIN_FAILED'
  Write-Output $_.Exception.Message
}

try {
  $newUserId = $r.userId
  if ($null -eq $newUserId) { Write-Output 'NO_NEW_USER_ID' } else {
    Write-Output ('NEW_USER_ID=' + $newUserId)
    $managerToken = $manager.token
    $headersM = @{ Authorization = "Bearer $managerToken" }
    $approve = Invoke-RestMethod -Uri ($base + '/managers/users/' + $newUserId + '/approve') -Method Put -Headers $headersM -ErrorAction Stop
    Write-Output 'APPROVE_OK'
    $approve | ConvertTo-Json -Depth 5 | Write-Output
  }
} catch {
  Write-Output 'APPROVE_FAILED'
  Write-Output $_.Exception.Message
}

try {
  $loginNewReq = @{ identifier='testmember@example.com'; password='Test@1234' } | ConvertTo-Json
  $try = Invoke-RestMethod -Uri ($base + '/auth/login') -Method Post -ContentType 'application/json' -Body $loginNewReq -ErrorAction Stop
  Write-Output 'NEW_LOGIN_OK'
  $try | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Output 'NEW_LOGIN_FAILED'
  Write-Output $_.Exception.Message
}
