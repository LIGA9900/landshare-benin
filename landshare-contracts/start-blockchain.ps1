# ================================================================
# start-blockchain.ps1 - Demarre le stack blockchain LandShare
# ================================================================

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  LandShare Blockchain Stack" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# ── Chemin vers le .env Laravel ──────────────────────────────────
# Modifie ce chemin si ton projet Laravel est ailleurs
$laravelEnvPath = "C:\Users\HP\Desktop\landshare-api\.env"

# Etape 1 : Lancer le reseau Hardhat dans un nouveau terminal
Write-Host "[1/3] Demarrage du reseau Hardhat local..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$PSScriptRoot'; Write-Host 'Hardhat Node actif' -ForegroundColor Green; npx hardhat node"

Write-Host "      OK - Reseau Hardhat demarre"
Write-Host "      Attente 5 secondes..."
Start-Sleep -Seconds 5

# Etape 2 : Deployer le contrat
Write-Host ""
Write-Host "[2/3] Deploiement du smart contract..." -ForegroundColor Cyan

$deployOutput = & npx hardhat run scripts/deploy.js --network localhost 2>&1

# Extraire l'adresse du contrat depuis la sortie du script
$contractLine = $deployOutput | Select-String "CONTRACT_ADDRESS="
if ($contractLine) {
    $contractAddress = ($contractLine.ToString() -split "=")[1].Trim()
} else {
    $contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    Write-Host "      Adresse par defaut utilisee" -ForegroundColor Yellow
}

Write-Host "      OK - Contrat deploye : $contractAddress" -ForegroundColor Green

# ── Mise a jour automatique du .env Laravel ──────────────────────
Write-Host ""
Write-Host "      Mise a jour du .env Laravel..." -ForegroundColor Cyan

if (Test-Path $laravelEnvPath) {
    # Lire le contenu du .env
    $envContent = Get-Content $laravelEnvPath -Raw

    # Remplacer la valeur de BLOCKCHAIN_CONTRACT_ADDRESS
    if ($envContent -match "BLOCKCHAIN_CONTRACT_ADDRESS=") {
        $envContent = $envContent -replace `
            "BLOCKCHAIN_CONTRACT_ADDRESS=.*", `
            "BLOCKCHAIN_CONTRACT_ADDRESS=$contractAddress"
        Set-Content $laravelEnvPath $envContent -NoNewline
        Write-Host "      OK - .env Laravel mis a jour automatiquement" -ForegroundColor Green
    } else {
        # La ligne n'existe pas encore, on l'ajoute
        Add-Content $laravelEnvPath "`nBLOCKCHAIN_CONTRACT_ADDRESS=$contractAddress"
        Write-Host "      OK - BLOCKCHAIN_CONTRACT_ADDRESS ajoute au .env" -ForegroundColor Green
    }
} else {
    Write-Host "      ATTENTION - .env Laravel introuvable : $laravelEnvPath" -ForegroundColor Red
    Write-Host "      Mets a jour manuellement : BLOCKCHAIN_CONTRACT_ADDRESS=$contractAddress" -ForegroundColor Yellow
}

# Etape 3 : Configurer les variables et demarrer le microservice
Write-Host ""
Write-Host "[3/3] Demarrage du microservice (port 3001)..." -ForegroundColor Cyan

$env:PRIVATE_KEY      = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
$env:CONTRACT_ADDRESS = $contractAddress
$env:RPC_URL          = "http://127.0.0.1:8545"
$env:BLOCKCHAIN_PORT  = "3001"

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Stack blockchain pret !" -ForegroundColor Green
Write-Host "  Contrat  : $contractAddress" -ForegroundColor White
Write-Host "  Health   : http://localhost:3001/health" -ForegroundColor White
Write-Host "  Laravel  : .env mis a jour automatiquement" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Lancer le microservice (bloque ce terminal)
node blockchain-service.js