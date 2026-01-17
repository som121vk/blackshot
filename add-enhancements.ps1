$files = @(
    "product.html",
    "checkout.html",
    "category.html",
    "login.html",
    "payment.html",
    "success.html",
    "account.html",
    "shipping-policy.html",
    "refund-policy.html"
)

$basePath = "f:/python/update blackshot website/blackshotsampl-main/blackshotsampl-main"

foreach ($file in $files) {
    $filePath = Join-Path $basePath $file
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Add enhancements.css after style.css if not already present
        if ($content -match 'css/style\.css' -and $content -notmatch 'css/enhancements\.css') {
            $content = $content -replace '(<link rel="stylesheet" href="css/style\.css">)', '$1`r`n    <link rel="stylesheet" href="css/enhancements.css">'
            Write-Host "Added enhancements.css to $file"
        }
        
        # Add enhancements.js before closing body tag if not already present
        if ($content -match 'js/store\.js' -and $content -notmatch 'js/enhancements\.js') {
            $content = $content -replace '(<script src="js/store\.js"></script>)', '$1`r`n    <script src="js/enhancements.js"></script>'
            Write-Host "Added enhancements.js to $file"
        }
        
        # Save the modified content
        Set-Content -Path $filePath -Value $content -NoNewline
        Write-Host "Updated: $file" -ForegroundColor Green
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nAll customer-facing pages have been enhanced!" -ForegroundColor Cyan
