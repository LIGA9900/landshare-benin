<?php

// ─── config/blockchain.php ────────────────────────────────────────
// Fichier de configuration blockchain pour Laravel
// À placer dans : landshare-api/config/blockchain.php

return [

    // URL du microservice Node.js
    'service_url' => env('BLOCKCHAIN_SERVICE_URL', 'http://localhost:3001'),

    // Réseau actif : localhost | amoy | bnbtest
    'network' => env('BLOCKCHAIN_NETWORK', 'localhost'),

    // Adresse du smart contract déployé
    'contract_address' => env('BLOCKCHAIN_CONTRACT_ADDRESS', ''),

    // Activer ou désactiver l'ancrage blockchain
    // Mettre false pour désactiver sans toucher au code
    'enabled' => env('BLOCKCHAIN_ENABLED', true),

];
