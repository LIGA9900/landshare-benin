// ═══════════════════════════════════════════════════════════════════
// blockchain-service.js — Microservice Node.js
// Pont entre Laravel (PHP) et le smart contract LandShareAnchor
//
// Emplacement : C:\Users\HP\Bureau\landshare-contracts\blockchain-service.js
//
// Démarrage   : node blockchain-service.js
// Port        : 3001
// ═══════════════════════════════════════════════════════════════════

const express    = require('express')
const { ethers } = require('ethers')
const path       = require('path')
require('dotenv').config()

const app  = express()
app.use(express.json())

// ─── Configuration ────────────────────────────────────────────────
const PORT             = process.env.BLOCKCHAIN_PORT || 3001
const PRIVATE_KEY      = process.env.PRIVATE_KEY
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const RPC_URL          = process.env.RPC_URL          || 'http://127.0.0.1:8545'

// ─── ABI du contrat — uniquement les fonctions qu'on utilise ──────
// On n'a pas besoin de l'ABI complet, juste anchor() et verify()
const CONTRACT_ABI = [
    // Ancrer un investissement
    "function anchor(string investRef, string docHash, string terrain, string city, uint256 amount, uint256 sqm) external",

    // Vérifier par référence
    "function verify(string investRef) external view returns (bool found, string docHash, string terrain, string city, uint256 amount, uint256 sqm, uint256 anchoredAt)",

    // Vérifier par hash SHA-256
    "function verifyByHash(string docHash) external view returns (bool found, string investRef, string terrain, uint256 sqm, uint256 anchoredAt)",

    // Nombre total d'ancrages
    "function totalAnchors() external view returns (uint256)",

    // Événement
    "event AnchorCreated(string indexed investRef, string docHash, string terrain, string city, uint256 amount, uint256 sqm, uint256 anchoredAt)"
]

// ─── Connexion au réseau et au contrat ───────────────────────────
let provider
let wallet
let contract

function connect() {
    try {
        provider = new ethers.JsonRpcProvider(RPC_URL)
        wallet   = new ethers.Wallet(PRIVATE_KEY, provider)
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet)
        console.log('✅ Connecté au réseau :', RPC_URL)
        console.log('📍 Contrat           :', CONTRACT_ADDRESS)
        console.log('📬 Wallet            :', wallet.address)
    } catch (err) {
        console.error('❌ Erreur de connexion :', err.message)
    }
}

connect()

// ═══════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════

// ─── Santé du service ─────────────────────────────────────────────
// GET /health
app.get('/health', async (req, res) => {
    try {
        const network = await provider.getNetwork()
        const total   = await contract.totalAnchors()
        res.json({
            status:   'ok',
            network:  network.name,
            chainId:  network.chainId.toString(),
            contract: CONTRACT_ADDRESS,
            total_anchors: total.toString(),
        })
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
})

// ─── Ancrer un investissement ─────────────────────────────────────
// POST /anchor
// Body : { investRef, docHash, terrain, city, amount, sqm }
app.post('/anchor', async (req, res) => {
    const { investRef, docHash, terrain, city, amount, sqm } = req.body

    // Validation des champs requis
    if (!investRef || !docHash || !terrain || !city || !amount || !sqm) {
        return res.status(400).json({
            success: false,
            message: 'Champs requis : investRef, docHash, terrain, city, amount, sqm'
        })
    }

    try {
        console.log(`\n⛓️  Ancrage de ${investRef} en cours...`)

        // Appel au smart contract
        const tx = await contract.anchor(
            investRef,
            docHash,
            terrain,
            city,
            BigInt(Math.round(amount)), // Convertir en uint256
            BigInt(sqm)
        )

        console.log(`📤 Transaction envoyée : ${tx.hash}`)

        // Attendre la confirmation (1 bloc)
        const receipt = await tx.wait(1)

        console.log(`✅ Transaction confirmée dans le bloc ${receipt.blockNumber}`)

        return res.json({
            success:       true,
            tx_hash:       tx.hash,
            block_number:  receipt.blockNumber,
            invest_ref:    investRef,
            explorer_url:  `${process.env.EXPLORER_URL || 'http://localhost'}/tx/${tx.hash}`,
        })

    } catch (err) {
        // Cas spécial : déjà ancré
        if (err.message?.includes('already anchored')) {
            return res.status(409).json({
                success: false,
                code:    'ALREADY_ANCHORED',
                message: `L'investissement ${investRef} est déjà ancré sur la blockchain.`
            })
        }

        console.error(`❌ Erreur ancrage ${investRef} :`, err.message)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

// ─── Vérifier par référence ───────────────────────────────────────
// GET /verify/:investRef
app.get('/verify/:investRef', async (req, res) => {
    const { investRef } = req.params

    try {
        const result = await contract.verify(investRef)

        if (!result[0]) {
            return res.status(404).json({
                success: false,
                found:   false,
                message: `Aucun ancrage trouvé pour la référence ${investRef}`
            })
        }

        return res.json({
            success:     true,
            found:       true,
            invest_ref:  investRef,
            doc_hash:    result[1],
            terrain:     result[2],
            city:        result[3],
            amount:      result[4].toString(),
            sqm:         result[5].toString(),
            anchored_at: new Date(Number(result[6]) * 1000).toISOString(),
            explorer_url: `${process.env.EXPLORER_URL || 'http://localhost'}/address/${CONTRACT_ADDRESS}`,
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

// ─── Vérifier par hash SHA-256 ────────────────────────────────────
// GET /verify-hash/:docHash
app.get('/verify-hash/:docHash', async (req, res) => {
    const { docHash } = req.params

    try {
        const result = await contract.verifyByHash(docHash)

        if (!result[0]) {
            return res.status(404).json({
                success: false,
                found:   false,
                message: 'Aucun investissement trouvé pour ce hash'
            })
        }

        return res.json({
            success:     true,
            found:       true,
            invest_ref:  result[1],
            terrain:     result[2],
            sqm:         result[3].toString(),
            anchored_at: new Date(Number(result[4]) * 1000).toISOString(),
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

// ─── Statistiques ─────────────────────────────────────────────────
// GET /stats
app.get('/stats', async (req, res) => {
    try {
        const total   = await contract.totalAnchors()
        const balance = await provider.getBalance(wallet.address)

        return res.json({
            total_anchors:  total.toString(),
            wallet_address: wallet.address,
            wallet_balance: ethers.formatEther(balance) + ' ETH',
            contract:       CONTRACT_ADDRESS,
            network:        RPC_URL,
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// ═══════════════════════════════════════════════════════════════════
// DÉMARRAGE
// ═══════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`🚀 Blockchain Service démarré sur le port ${PORT}`)
    console.log(`📡 Health check : http://localhost:${PORT}/health`)
    console.log(`⛓️  Anchor       : POST http://localhost:${PORT}/anchor`)
    console.log(`🔍 Verify       : GET  http://localhost:${PORT}/verify/:ref`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
})