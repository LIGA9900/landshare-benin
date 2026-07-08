// ═══════════════════════════════════════════════════════════════════
// scripts/deploy.js — Déploiement LandShareAnchor sur Polygon Amoy
//
// Commande : npx hardhat run scripts/deploy.js --network amoy
// ═══════════════════════════════════════════════════════════════════

const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Déploiement LandShareAnchor sur", hre.network.name, "...\n");

  // ── Récupère le deployer ─────────────────────────────────────────
  const [deployer] = await hre.ethers.getSigners();
  console.log("📬 Deployer     :", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance MATIC:", hre.ethers.formatEther(balance), "MATIC\n");

  if (balance === 0n) {
    throw new Error("❌ Pas assez de MATIC. Va sur https://www.alchemy.com/faucets/polygon-amoy");
  }

  // ── Déploie le contrat ───────────────────────────────────────────
  const LandShareAnchor = await hre.ethers.getContractFactory("LandShareAnchor");
  console.log("📦 Compilation et déploiement en cours...");

  const contract = await LandShareAnchor.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("\n✅ Contrat déployé avec succès !");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📍 Adresse du contrat :", address);
  console.log("🔗 Polygonscan        :", `https://amoy.polygonscan.com/address/${address}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  console.log("\n📋 Copie cette adresse dans ton .env Laravel :");
  console.log(`CONTRACT_ADDRESS=${address}`);
  console.log(`ALCHEMY_URL=https://polygon-amoy.g.alchemy.com/v2/aDHgG-r34nvJhyKUO3Kd8`);
  console.log(`BLOCKCHAIN_NETWORK=amoy\n`);

  // ── Test : ancrer un investissement de démonstration ─────────────
  console.log("🧪 Test d'ancrage d'un investissement demo...");
  const tx = await contract.anchor(
    "LS-0001",
    "a3f7c9e2b1d84056cf2e73a1b849d012a3f7c9e2b1d84056cf2e73a1b849d012",
    "Calavi Nord",
    "Abomey-Calavi",
    77250,
    5
  );
  await tx.wait();
  console.log("✅ Investissement LS-0001 ancré !");
  console.log("🔗 Tx hash :", tx.hash);

  // ── Vérification ─────────────────────────────────────────────────
  const result = await contract.verify("LS-0001");
  console.log("\n🔍 Vérification LS-0001 :");
  console.log("   Found    :", result[0]);
  console.log("   Terrain  :", result[2]);
  console.log("   Ville    :", result[3]);
  console.log("   Montant  :", result[4].toString(), "FCFA");
  console.log("   m²       :", result[5].toString());
  console.log("\n🎉 Tout fonctionne ! Le contrat est prêt.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erreur :", error.message);
    process.exit(1);
  });