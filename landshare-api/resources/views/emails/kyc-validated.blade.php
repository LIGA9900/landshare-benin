<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>KYC Validé</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #F5F0E8; color: #1A1A1A; }
        .container { max-width: 580px; margin: 30px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(30,58,47,0.1); }
        .header { background: linear-gradient(135deg, #1E3A2F, #2D5241); padding: 28px; text-align: center; }
        .logo { font-size: 22px; font-weight: 700; color: #F5F0E8; margin-bottom: 10px; }
        .logo span { color: #B8972A; }
        .header h1 { font-size: 18px; color: #F5F0E8; margin-bottom: 4px; }
        .header p { font-size: 12px; color: rgba(245,240,232,0.6); }
        .body { padding: 28px; }
        .greeting { font-size: 14px; font-weight: 600; color: #1E3A2F; margin-bottom: 10px; }
        .text { font-size: 13px; color: #4A3F35; line-height: 1.7; margin-bottom: 16px; }
        .validated-card { background: rgba(39,174,96,0.08); border: 1px solid rgba(39,174,96,0.2); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px; }
        .validated-icon { font-size: 36px; margin-bottom: 8px; }
        .validated-title { font-size: 16px; font-weight: 700; color: #27AE60; margin-bottom: 4px; }
        .validated-sub { font-size: 12px; color: #4A7A5A; }
        .steps { margin-bottom: 20px; }
        .step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
        .step-num { width: 28px; height: 28px; background: #1E3A2F; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #F5F0E8; font-size: 12px; font-weight: 700; flex-shrink: 0; }
        .step-content { flex: 1; }
        .step-title { font-size: 12px; font-weight: 700; color: #1E3A2F; margin-bottom: 2px; }
        .step-text { font-size: 11px; color: #6B6459; line-height: 1.5; }
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
        <h1>🪪 Identité vérifiée !</h1>
        <p>Votre compte est maintenant pleinement actif</p>
    </div>

    <!-- Body -->
    <div class="body">
        <p class="greeting">Bonjour {{ $user->first_name }},</p>
        <p class="text">
            Excellente nouvelle ! Votre identité a été <strong>vérifiée et validée</strong>
            par notre équipe. Vous pouvez désormais investir librement sur LandShare Bénin.
        </p>

        <!-- Badge validé -->
        <div class="validated-card">
            <div class="validated-icon">✅</div>
            <div class="validated-title">KYC Validé</div>
            <div class="validated-sub">Compte {{ $user->full_name }} · Validé le {{ now()->format('d/m/Y') }}</div>
        </div>

        <p class="text">Voici comment commencer à investir :</p>

        <!-- Étapes -->
        <div class="steps">
            <div class="step">
                <div class="step-num">1</div>
                <div class="step-content">
                    <div class="step-title">Explorez les terrains disponibles</div>
                    <div class="step-text">Parcourez notre catalogue de terrains certifiés au Bénin.</div>
                </div>
            </div>
            <div class="step">
                <div class="step-num">2</div>
                <div class="step-content">
                    <div class="step-title">Choisissez votre nombre de m²</div>
                    <div class="step-text">Investissez à partir de 1 m² selon votre budget.</div>
                </div>
            </div>
            <div class="step">
                <div class="step-num">3</div>
                <div class="step-content">
                    <div class="step-title">Payez via Mobile Money ou carte</div>
                    <div class="step-text">MTN MoMo, Moov Money, Stripe ou Paystack acceptés.</div>
                </div>
            </div>
            <div class="step">
                <div class="step-num">4</div>
                <div class="step-content">
                    <div class="step-title">Recevez votre attestation PDF</div>
                    <div class="step-text">Un certificat sécurisé généré automatiquement après paiement.</div>
                </div>
            </div>
        </div>

        <!-- CTA -->
        <div class="cta">
            <a href="{{ config('app.url') }}/terrains" class="btn">
                Explorer les terrains →
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