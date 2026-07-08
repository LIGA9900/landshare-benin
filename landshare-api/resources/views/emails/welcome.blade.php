<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur LandShare</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #F5F0E8; color: #1A1A1A; }
        .container { max-width: 580px; margin: 30px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(30,58,47,0.1); }
        .header { background: linear-gradient(135deg, #1E3A2F, #2D5241); padding: 32px 28px; text-align: center; }
        .header h1 { font-size: 22px; color: #F5F0E8; margin-bottom: 6px; }
        .header p { font-size: 13px; color: rgba(245,240,232,0.6); }
        .logo { font-size: 26px; font-weight: 700; color: #F5F0E8; margin-bottom: 12px; }
        .logo span { color: #B8972A; }
        .body { padding: 32px 28px; }
        .greeting { font-size: 15px; font-weight: 600; color: #1E3A2F; margin-bottom: 12px; }
        .text { font-size: 13px; color: #4A3F35; line-height: 1.7; margin-bottom: 16px; }
        .features { background: #F5F0E8; border-radius: 10px; padding: 18px; margin-bottom: 20px; }
        .feature { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
        .feature:last-child { margin-bottom: 0; }
        .feature-icon { font-size: 18px; flex-shrink: 0; }
        .feature-text { font-size: 12px; color: #4A3F35; line-height: 1.5; }
        .feature-title { font-weight: 700; color: #1E3A2F; display: block; margin-bottom: 2px; }
        .cta { text-align: center; margin: 24px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #1E3A2F, #2D5241); color: #F5F0E8; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; }
        .kyc-banner { background: rgba(184,151,42,0.1); border: 1px solid rgba(184,151,42,0.25); border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; }
        .kyc-title { font-size: 12px; font-weight: 700; color: #8B6D14; margin-bottom: 4px; }
        .kyc-text { font-size: 11px; color: #6B5B2E; line-height: 1.5; }
        .footer { background: #F5F0E8; padding: 20px 28px; text-align: center; border-top: 1px solid rgba(30,58,47,0.08); }
        .footer p { font-size: 11px; color: #8C8278; line-height: 1.6; }
        .footer a { color: #1E3A2F; text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>
<div class="container">

    <!-- Header -->
    <div class="header">
        <div class="logo">Land<span>Share</span></div>
        <h1>Bienvenue {{ $first_name}} ! 🎉</h1>
        <p>Votre compte a été créé avec succès</p>
    </div>

    <!-- Body -->
    <div class="body">
        <p class="greeting">Bonjour {{ $full_name}},</p>
        <p class="text">
            Nous sommes ravis de vous accueillir sur <strong>LandShare Bénin</strong>,
            la première plateforme d'investissement foncier fractionné au Bénin.
            Vous pouvez désormais investir dans des terrains certifiés à partir de 1 m².
        </p>

        <!-- Features -->
        <div class="features">
            <div class="feature">
                <span class="feature-icon">🗺️</span>
                <div class="feature-text">
                    <span class="feature-title">Terrains certifiés notaire</span>
                    Chaque terrain est vérifié et certifié par un notaire agréé au Bénin.
                </div>
            </div>
            <div class="feature">
                <span class="feature-icon">📐</span>
                <div class="feature-text">
                    <span class="feature-title">Investissez à partir de 1 m²</span>
                    Devenez propriétaire foncier avec un budget adapté à votre situation.
                </div>
            </div>
            <div class="feature">
                <span class="feature-icon">🏅</span>
                <div class="feature-text">
                    <span class="feature-title">Attestation PDF sécurisée</span>
                    Chaque investissement génère une attestation vérifiable par hash SHA-256.
                </div>
            </div>
            <div class="feature">
                <span class="feature-icon">💳</span>
                <div class="feature-text">
                    <span class="feature-title">Paiement Mobile Money & Carte</span>
                    MTN MoMo, Moov Money, Stripe et Paystack acceptés.
                </div>
            </div>
        </div>

        <!-- KYC Banner -->
        <div class="kyc-banner">
            <div class="kyc-title">⚠️ Étape suivante : Vérifiez votre identité (KYC)</div>
            <div class="kyc-text">
                Pour pouvoir investir, vous devez soumettre une pièce d'identité valide.
                Cette vérification est obligatoire et prend moins de 24h.
            </div>
        </div>

        <!-- CTA -->
        <div class="cta">
            <a href="{{ config('app.url') }}/dashboard" class="btn">
                Accéder à mon tableau de bord →
            </a>
        </div>

        <p class="text" style="font-size:12px; color:#8C8278;">
            Si vous avez des questions, contactez-nous à
            <a href="mailto:contact@landshare.bj" style="color:#1E3A2F;">contact@landshare.bj</a>
        </p>
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