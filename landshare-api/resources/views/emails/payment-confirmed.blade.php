<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Paiement confirmé</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #F5F0E8; color: #1A1A1A; }
        .container { max-width: 580px; margin: 30px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(30,58,47,0.1); }
        .header { background: linear-gradient(135deg, #1E3A2F, #2D5241); padding: 28px; text-align: center; }
        .logo { font-size: 22px; font-weight: 700; color: #F5F0E8; margin-bottom: 10px; }
        .logo span { color: #B8972A; }
        .success-icon { font-size: 40px; margin-bottom: 10px; }
        .header h1 { font-size: 18px; color: #F5F0E8; margin-bottom: 4px; }
        .header p { font-size: 12px; color: rgba(245,240,232,0.6); }
        .body { padding: 28px; }
        .greeting { font-size: 14px; font-weight: 600; color: #1E3A2F; margin-bottom: 10px; }
        .text { font-size: 13px; color: #4A3F35; line-height: 1.7; margin-bottom: 16px; }
        .amount-card { background: linear-gradient(135deg, #1E3A2F, #2D5241); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px; }
        .amount-label { font-size: 10px; color: rgba(245,240,232,0.5); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .amount-value { font-size: 28px; font-weight: 700; color: #D4AD3A; margin-bottom: 6px; }
        .amount-sqm { font-size: 13px; color: rgba(245,240,232,0.7); }
        .details-card { background: #F5F0E8; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
        .detail-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(30,58,47,0.06); font-size: 12px; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #8C8278; }
        .detail-value { font-weight: 600; color: #1A1A1A; }
        .detail-value.ref { font-family: monospace; color: #1E3A2F; }
        .attestation-banner { background: rgba(184,151,42,0.1); border: 1px solid rgba(184,151,42,0.25); border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; }
        .attestation-title { font-size: 12px; font-weight: 700; color: #8B6D14; margin-bottom: 4px; }
        .attestation-text { font-size: 11px; color: #6B5B2E; line-height: 1.5; }
        .cta { text-align: center; margin: 20px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #1E3A2F, #2D5241); color: #F5F0E8; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; }
        .footer { background: #F5F0E8; padding: 18px 28px; text-align: center; border-top: 1px solid rgba(30,58,47,0.08); }
        .footer p { font-size: 11px; color: #8C8278; line-height: 1.6; }
        .footer a { color: #1E3A2F; text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>
<div class="container">

    <!-- Header -->
    <div class="header">
        <div class="logo">Land<span>Share</span></div>
        <div class="success-icon">✅</div>
        <h1>Paiement confirmé !</h1>
        <p>Votre investissement a été validé avec succès</p>
    </div>

    <!-- Body -->
    <div class="body">
        <p class="greeting">Bonjour {{ $investor->first_name }},</p>
        <p class="text">
            Votre paiement a été <strong>confirmé avec succès</strong>.
            Vous êtes désormais propriétaire de
            <strong>{{ $investment->sqm_bought }} m²</strong>
            sur le terrain <strong>{{ $land->title }}</strong>.
        </p>

        <!-- Montant -->
        <div class="amount-card">
            <div class="amount-label">Montant payé</div>
            <div class="amount-value">{{ number_format($investment->total_paid, 0, ',', ' ') }} FCFA</div>
            <div class="amount-sqm">{{ $investment->sqm_bought }} m² acquis · {{ $land->city }}</div>
        </div>

        <!-- Détails -->
        <div class="details-card">
            <div class="detail-row">
                <span class="detail-label">Référence</span>
                <span class="detail-value ref">{{ $investment->reference }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Terrain</span>
                <span class="detail-value">{{ $land->title }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Localisation</span>
                <span class="detail-value">{{ $land->location ?? $land->city }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Prix unitaire</span>
                <span class="detail-value">{{ number_format($investment->unit_price, 0, ',', ' ') }} FCFA/m²</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Sous-total</span>
                <span class="detail-value">{{ number_format($investment->subtotal, 0, ',', ' ') }} FCFA</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Commission (3%)</span>
                <span class="detail-value">{{ number_format($investment->commission, 0, ',', ' ') }} FCFA</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Confirmé le</span>
                <span class="detail-value">{{ $investment->confirmed_at->format('d/m/Y à H:i') }}</span>
            </div>
            @if($investment->certificate_url)
            <div class="detail-row">
                <span class="detail-label">Attestation</span>
                <span class="detail-value ref">ATT-{{ date('Y') }}-LS-{{ str_pad($investment->id, 5, '0', STR_PAD_LEFT) }}</span>
            </div>
            @endif
        </div>

        <!-- Attestation -->
        <div class="attestation-banner">
            <div class="attestation-title">🏅 Votre attestation PDF est disponible</div>
            <div class="attestation-text">
                Connectez-vous à votre tableau de bord pour télécharger votre attestation
                de propriété. Ce document est vérifiable hors-ligne grâce à son hash SHA-256.
            </div>
        </div>

        <!-- CTA -->
        <div class="cta">
            <a href="{{ config('app.url') }}/dashboard" class="btn">
                Voir mon portefeuille →
            </a>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>
            © {{ date('Y') }} LandShare Bénin · Tous droits réservés<br>
            <a href="{{ config('app.url') }}">www.landshare.bj</a> ·
            <a href="mailto:contact@landshare.bj">contact@landshare.bj</a>
        </p>
    </div>

</div>
</body>
</html>