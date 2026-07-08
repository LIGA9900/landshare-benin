<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Attestation {{ $investment->reference }}</title>
<style>
  /* ── Reset & base ─────────────────────────────────────────────── */
  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'DejaVu Sans', Arial, sans-serif;
    font-size: 9px;
    color: #1A1A1A;
    background: #ffffff;
    padding: 24px 28px;
    line-height: 1.4;
  }

  /* ── Couleurs LandShare ───────────────────────────────────────── */
  /* Vert  : #1E3A2F   Or : #B8972A   Crème : #F5F0E8 */

  /* ── En-tête ──────────────────────────────────────────────────── */
  .header {
    display: table;
    width: 100%;
    border-bottom: 2px solid #1E3A2F;
    padding-bottom: 10px;
    margin-bottom: 14px;
  }
  .header-left  { display: table-cell; vertical-align: middle; width: 50%; }
  .header-right { display: table-cell; vertical-align: middle; width: 50%; text-align: right; }

  .logo-text {
    font-size: 18px;
    font-weight: bold;
    color: #1E3A2F;
    letter-spacing: 1px;
  }
  .logo-sub {
    font-size: 7px;
    color: #B8972A;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-top: 1px;
  }
  .ref-line {
    font-size: 8px;
    color: #555;
    margin-bottom: 2px;
  }
  .ref-line strong { color: #1E3A2F; }

  /* ── Bandeau titre central ────────────────────────────────────── */
  .title-block {
    background: #1E3A2F;
    text-align: center;
    padding: 12px 20px;
    border-radius: 6px;
    margin-bottom: 14px;
  }
  .title-main {
    font-size: 16px;
    font-weight: bold;
    color: #F5F0E8;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .title-sub {
    font-size: 8px;
    color: rgba(245,240,232,0.7);
    margin-top: 3px;
    letter-spacing: 0.5px;
  }

  /* ── Badge statut ─────────────────────────────────────────────── */
  .badge-ok {
    display: inline-block;
    background: #e8f5e9;
    color: #1E3A2F;
    border: 1px solid #1E3A2F;
    border-radius: 30px;
    padding: 3px 14px;
    font-size: 8px;
    font-weight: bold;
    margin-top: 6px;
    letter-spacing: 0.5px;
  }

  /* ── Grille 2 colonnes ────────────────────────────────────────── */
  .grid-2 { display: table; width: 100%; margin-bottom: 10px; border-spacing: 8px 0; }
  .col     { display: table-cell; width: 50%; vertical-align: top; }

  /* ── Section card ─────────────────────────────────────────────── */
  .card {
    border: 1px solid #E0D9CF;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 10px;
    background: #FDFCFA;
  }
  .card-full {
    border: 1px solid #E0D9CF;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 10px;
    background: #FDFCFA;
  }

  /* ── En-tête de section ───────────────────────────────────────── */
  .section-title {
    font-size: 8px;
    font-weight: bold;
    color: #1E3A2F;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid #E0D9CF;
    padding-bottom: 5px;
    margin-bottom: 8px;
  }
  .section-icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: #1E3A2F;
    color: #F5F0E8;
    border-radius: 50%;
    text-align: center;
    line-height: 14px;
    font-size: 8px;
    margin-right: 5px;
    vertical-align: middle;
  }

  /* ── Tableau de données ───────────────────────────────────────── */
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table tr td {
    padding: 3px 0;
    font-size: 8.5px;
    vertical-align: top;
  }
  .data-table tr td:first-child {
    color: #777;
    width: 45%;
    padding-right: 6px;
    font-size: 8px;
  }
  .data-table tr td:last-child {
    color: #1A1A1A;
    font-weight: bold;
  }

  /* ── Montant total mis en avant ───────────────────────────────── */
  .total-row td {
    padding-top: 6px !important;
    border-top: 1px solid #E0D9CF;
    font-size: 9.5px !important;
  }
  .total-row td:last-child {
    color: #1E3A2F !important;
    font-size: 11px !important;
  }

  /* ── Section hash SHA-256 ─────────────────────────────────────── */
  .hash-block {
    background: #F5F0E8;
    border: 1px solid #D4C9B0;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 10px;
  }
  .hash-label {
    font-size: 7.5px;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  .hash-value {
    font-family: 'DejaVu Sans Mono', monospace;
    font-size: 7.5px;
    color: #1E3A2F;
    word-break: break-all;
    background: #fff;
    border: 1px solid #E0D9CF;
    border-radius: 4px;
    padding: 5px 8px;
    margin-bottom: 3px;
  }
  .hash-verify {
    font-size: 7px;
    color: #B8972A;
  }

  /* ── Pied de page ─────────────────────────────────────────────── */
  .footer-block {
    display: table;
    width: 100%;
    border-top: 2px solid #1E3A2F;
    padding-top: 10px;
    margin-top: 8px;
  }
  .footer-left  { display: table-cell; width: 55%; vertical-align: bottom; }
  .footer-right { display: table-cell; width: 45%; text-align: right; vertical-align: top; }

  .legal-note {
    font-size: 7px;
    color: #999;
    line-height: 1.5;
    font-style: italic;
    max-width: 340px;
  }
  .brand-footer {
    font-size: 7.5px;
    color: #555;
    margin-bottom: 2px;
  }
  .brand-footer strong { color: #1E3A2F; }

  .qr-label {
    font-size: 7px;
    color: #777;
    text-align: center;
    margin-top: 3px;
  }

  /* ── Filigrane diagonal ───────────────────────────────────────── */
  .watermark {
    position: fixed;
    top: 38%;
    left: 15%;
    transform: rotate(-35deg);
    font-size: 72px;
    font-weight: bold;
    color: rgba(30,58,47,0.04);
    text-transform: uppercase;
    letter-spacing: 10px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Ligne séparatrice ────────────────────────────────────────── */
  .divider {
    border: none;
    border-top: 1px solid #E0D9CF;
    margin: 8px 0;
  }

  /* ── Statut paiement ──────────────────────────────────────────── */
  .status-ok {
    color: #1E3A2F;
    font-weight: bold;
    font-size: 8.5px;
  }
  .dot-ok {
    display: inline-block;
    width: 7px;
    height: 7px;
    background: #27AE60;
    border-radius: 50%;
    margin-right: 3px;
    vertical-align: middle;
  }

  /* ── Numéro ATT en haut à droite ─────────────────────────────── */
  .att-number {
    font-size: 9px;
    font-weight: bold;
    color: #1E3A2F;
    background: #F5F0E8;
    border: 1px solid #D4C9B0;
    border-radius: 4px;
    padding: 2px 8px;
    display: inline-block;
    margin-bottom: 2px;
  }
</style>
</head>
<body>

<div class="watermark">LANDSHARE</div>

<!-- ══ EN-TÊTE ════════════════════════════════════════════════════ -->
<div class="header">
  <div class="header-left">
    <div class="logo-text">Land<span style="color:#B8972A;">Share</span></div>
    <div class="logo-sub">Plateforme d'investissement foncier · Bénin</div>
  </div>
  <div class="header-right">
    <div class="att-number">{{ $attestation_number }}</div>
    <div class="ref-line">Référence : <strong>{{ $investment->reference }}</strong></div>
    <div class="ref-line">Date d'émission : <strong>{{ \Carbon\Carbon::parse($investment->confirmed_at)->format('d M Y à H:i') }}</strong></div>
  </div>
</div>

<!-- ══ TITRE CENTRAL ══════════════════════════════════════════════ -->
<div class="title-block">
  <div class="title-main">Attestation d'Investissement</div>
  <div class="title-sub">Preuve officielle d'investissement foncier fractionné</div>
  <div style="text-align:center;">
    <span class="badge-ok">✓ &nbsp; PAIEMENT CONFIRMÉ — INVESTISSEMENT SÉCURISÉ</span>
  </div>
</div>

<!-- ══ MONTANT EN VEDETTE ═════════════════════════════════════════ -->
<table style="width:100%; margin-bottom:10px; border-collapse:collapse;">
  <tr>
    <td style="width:50%; padding-right:5px;">
      <div style="background:#1E3A2F; border-radius:6px; padding:10px 14px; text-align:center;">
        <div style="font-size:7px; color:rgba(245,240,232,0.6); text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">Montant total payé</div>
        <div style="font-size:18px; font-weight:bold; color:#F5F0E8;">{{ number_format($investment->total_paid, 0, ',', ' ') }} FCFA</div>
        <div style="font-size:7px; color:#B8972A; margin-top:2px;">dont {{ number_format($investment->commission, 0, ',', ' ') }} FCFA de commission (3%)</div>
      </div>
    </td>
    <td style="width:50%; padding-left:5px;">
      <div style="border:1px solid #E0D9CF; border-radius:6px; padding:10px 14px; text-align:center; background:#FDFCFA;">
        <div style="font-size:7px; color:#777; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">Parts acquises</div>
        <div style="font-size:18px; font-weight:bold; color:#1E3A2F;">{{ $investment->sqm_bought }} m²</div>
        <div style="font-size:7px; color:#B8972A; margin-top:2px;">à {{ number_format($investment->unit_price, 0, ',', ' ') }} FCFA / m²</div>
      </div>
    </td>
  </tr>
</table>

<!-- ══ GRILLE : INVESTISSEUR + TERRAIN ════════════════════════════ -->
<table style="width:100%; margin-bottom:10px; border-collapse:separate; border-spacing:8px 0;">
  <tr>
    <!-- INVESTISSEUR -->
    <td style="width:50%; vertical-align:top;">
      <div class="card">
        <div class="section-title">
          <span class="section-icon">i</span>Investisseur
        </div>
        <table class="data-table">
          <tr>
            <td>Nom complet</td>
            <td>{{ $investor->full_name }}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{{ $investor->email }}</td>
          </tr>
          <tr>
            <td>Téléphone</td>
            <td>{{ $investor->phone ?? 'N/A' }}</td>
          </tr>
          <tr>
            <td>Pays</td>
            <td>{{ $investor->country ?? 'N/A' }}</td>
          </tr>
          <tr>
            <td>Statut KYC</td>
            <td><span class="status-ok"><span class="dot-ok"></span>Identité vérifiée</span></td>
          </tr>
          <tr>
            <td>Réf. investisseur</td>
            <td>INV-{{ str_pad($investor->id, 5, '0', STR_PAD_LEFT) }}</td>
          </tr>
        </table>
      </div>
    </td>

    <!-- TERRAIN -->
    <td style="width:50%; vertical-align:top;">
      <div class="card">
        <div class="section-title">
          <span class="section-icon">T</span>Terrain concerné
        </div>
        <table class="data-table">
          <tr>
            <td>Nom du terrain</td>
            <td>{{ $investment->land->title }}</td>
          </tr>
          <tr>
            <td>Localisation</td>
            <td>{{ $investment->land->city }}{{ $investment->land->location ? ', '.$investment->land->location : '' }}</td>
          </tr>
          <tr>
            <td>Superficie totale</td>
            <td>{{ number_format($investment->land->total_sqm, 0, ',', ' ') }} m²</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>Terrain foncier</td>
          </tr>
          <tr>
            <td>Statut terrain</td>
            <td>
              @if($investment->land->status === 'published')
                <span class="status-ok"><span class="dot-ok"></span>Publié</span>
              @elseif($investment->land->status === 'full')
                Complet
              @else
                {{ ucfirst($investment->land->status) }}
              @endif
            </td>
          </tr>
          <tr>
            <td>Réf. terrain</td>
            <td>TRN-{{ str_pad($investment->land_id, 4, '0', STR_PAD_LEFT) }}</td>
          </tr>
        </table>
      </div>
    </td>
  </tr>
</table>

<!-- ══ DÉTAILS FINANCIERS ═════════════════════════════════════════ -->
<div class="card-full">
  <div class="section-title">
    <span class="section-icon">F</span>Détails financiers &amp; Informations de paiement
  </div>
  <table style="width:100%; border-collapse:collapse;">
    <!-- Ligne 1 : 4 colonnes -->
    <tr>
      <td style="width:25%; padding:3px 8px 3px 0; vertical-align:top;">
        <div style="font-size:7.5px; color:#777;">Prix unitaire au m²</div>
        <div style="font-size:9px; font-weight:bold; color:#1E3A2F;">{{ number_format($investment->unit_price, 0, ',', ' ') }} FCFA</div>
      </td>
      <td style="width:25%; padding:3px 8px; vertical-align:top; border-left:1px solid #E0D9CF;">
        <div style="font-size:7.5px; color:#777;">Parts acquises</div>
        <div style="font-size:9px; font-weight:bold; color:#1E3A2F;">{{ $investment->sqm_bought }} m²</div>
      </td>
      <td style="width:25%; padding:3px 8px; vertical-align:top; border-left:1px solid #E0D9CF;">
        <div style="font-size:7.5px; color:#777;">Mode de paiement</div>
        <div style="font-size:9px; font-weight:bold; color:#1E3A2F;">{{ $payment_method }}</div>
      </td>
      <td style="width:25%; padding:3px 0 3px 8px; vertical-align:top; border-left:1px solid #E0D9CF;">
        <div style="font-size:7.5px; color:#777;">Date de confirmation</div>
        <div style="font-size:9px; font-weight:bold; color:#1E3A2F;">{{ \Carbon\Carbon::parse($investment->confirmed_at)->format('d/m/Y à H:i') }}</div>
      </td>
    </tr>
    <tr>
      <td colspan="4" style="padding:5px 0 3px 0; border-top:1px solid #E0D9CF;">
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="width:25%; padding:3px 8px 3px 0; vertical-align:top;">
              <div style="font-size:7.5px; color:#777;">Sous-total foncier</div>
              <div style="font-size:9px; font-weight:bold; color:#1E3A2F;">{{ number_format($investment->subtotal, 0, ',', ' ') }} FCFA</div>
            </td>
            <td style="width:25%; padding:3px 8px; vertical-align:top; border-left:1px solid #E0D9CF;">
              <div style="font-size:7.5px; color:#777;">Commission LandShare (3%)</div>
              <div style="font-size:9px; font-weight:bold; color:#B8972A;">{{ number_format($investment->commission, 0, ',', ' ') }} FCFA</div>
            </td>
            <td style="width:25%; padding:3px 8px; vertical-align:top; border-left:1px solid #E0D9CF;">
              <div style="font-size:7.5px; color:#777;">Référence transaction</div>
              <div style="font-size:9px; font-weight:bold; color:#1E3A2F;">{{ $investment->reference }}</div>
            </td>
            <td style="width:25%; padding:3px 0 3px 8px; vertical-align:top; border-left:1px solid #E0D9CF;">
              <div style="font-size:7.5px; color:#777;">Statut paiement</div>
              <div style="font-size:9px;"><span class="status-ok"><span class="dot-ok"></span>Paiement réussi</span></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Total -->
    <tr style="border-top:2px solid #1E3A2F;">
      <td colspan="2" style="padding-top:6px;">
        <div style="font-size:8px; color:#777; text-transform:uppercase; letter-spacing:0.5px;">Montant total payé</div>
      </td>
      <td colspan="2" style="padding-top:6px; text-align:right;">
        <div style="font-size:14px; font-weight:bold; color:#1E3A2F;">{{ number_format($investment->total_paid, 0, ',', ' ') }} FCFA</div>
      </td>
    </tr>
  </table>
</div>

<!-- ══ EMPREINTE SHA-256 + QR CODE ════════════════════════════════ -->
<table style="width:100%; border-collapse:collapse; margin-bottom:10px;">
  <tr>
    <td style="width:72%; vertical-align:top; padding-right:10px;">
      <div class="hash-block">
        <div class="hash-label">■ &nbsp;Empreinte numérique SHA-256 — Vérification d'authenticité</div>
        <div class="hash-value">{{ $hash }}</div>
        <div class="hash-verify">Vérifiable sur : landshare.bj/verifier/{{ $investment->reference }}</div>
      </div>
      <div style="font-size:7px; color:#999; font-style:italic; padding:0 2px;">
        Note légale : Ce document atteste de l'acquisition de {{ $investment->sqm_bought }} m² sur le terrain "{{ $investment->land->title }}" via la plateforme LandShare Bénin. Ce certificat représente un droit économique d'investissement et non un titre de propriété foncière au sens du droit OHADA. Vérifiable en ligne à tout moment.
      </div>
    </td>
    <td style="width:28%; vertical-align:top; text-align:center;">
      @if($qr_code_base64)
        <img src="data:image/png;base64,{{ $qr_code_base64 }}" style="width:90px; height:90px; border:1px solid #E0D9CF; border-radius:4px; padding:3px;"/>
        <div class="qr-label">Scanner pour vérifier l'authenticité</div>
      @else
        <div style="width:90px; height:90px; border:1px solid #E0D9CF; border-radius:4px; display:inline-block; line-height:90px; text-align:center; font-size:7px; color:#999;">QR Code</div>
      @endif
    </td>
  </tr>
</table>

<!-- ══ PIED DE PAGE ═══════════════════════════════════════════════ -->
<div class="footer-block">
  <div class="footer-left">
    <div style="font-size:13px; font-weight:bold; color:#1E3A2F; margin-bottom:1px;">
      Land<span style="color:#B8972A;">Share</span> Bénin
    </div>
    <div style="font-size:7px; color:#777; margin-bottom:4px;">Plateforme certifiée · Investissement foncier participatif</div>
    <div class="legal-note">
      Document officiel — Ne pas modifier<br>
      Généré automatiquement le {{ \Carbon\Carbon::now()->format('d/m/Y à H:i') }}<br>
      © {{ date('Y') }} LandShare Bénin — Tous droits réservés
    </div>
  </div>
  <div class="footer-right">
    <div style="font-size:7.5px; color:#555; margin-bottom:2px;">✉ contact@landshare.bj</div>
    <div style="font-size:7.5px; color:#555; margin-bottom:6px;">🌐 www.landshare.bj</div>
    <div style="font-size:7.5px; font-weight:bold; color:#1E3A2F; border:1px solid #1E3A2F; border-radius:3px; padding:2px 8px; display:inline-block;">
      DOCUMENT OFFICIEL
    </div>
  </div>
</div>

</body>
</html>