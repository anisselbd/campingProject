
export let consentGranted = true;


/**
 * @param {boolean} granted 
 */
export const setConsent = (granted) => {
    consentGranted = granted;
    if (window.gtag) {
        window.gtag('consent', 'update', {
            analytics_storage: granted ? 'granted' : 'denied'
        });
    }

    console.log(`[GA4] Consentement analytics : ${granted ? 'ACCORDÉ' : 'REFUSÉ'}`);
};

export const initGA = () => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!measurementId) {
        console.warn('[GA4] Measurement ID non configuré. Analytics désactivé.');
        console.warn('[GA4] Ajoutez VITE_GA_MEASUREMENT_ID dans votre fichier .env');
        return;
    }
    if (!window.gtag) {
        console.warn('[GA4] gtag not loaded yet. Will initialize when available.');
        return;
    }
    console.log('[GA4] Analytics initialisé avec ID:', measurementId);
};

/**
 * @param {string} path 
 * @param {string} title 
 */
export const trackPageView = (path, title) => {
    if (!consentGranted) {
        console.log('[GA4] Page view bloqué (pas de consentement):', path);
        return;
    }
    if (!window.gtag) {
        console.warn('[GA4] gtag non disponible. Page view ignoré:', path);
        return;
    }
    window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title
    });
    if (import.meta.env.DEV) {
        console.log(`[GA4] Page view: ${path} → ${title || document.title}`);
    }
};

/**
 * @param {string} eventName 
 * @param {Object} parameters 
 */
export const trackEvent = (eventName, parameters = {}) => {
    if (!consentGranted) {
        console.log(`[GA4] Événement bloqué (pas de consentement): ${eventName}`);
        return;
    }
    if (!window.gtag) {
        console.warn(`[GA4] gtag non disponible. Événement ignoré: ${eventName}`);
        return;
    }
    window.gtag('event', eventName, parameters);
    if (import.meta.env.DEV) {
        console.log(`[GA4] Événement: ${eventName}`, parameters);
    }
};

/**
 * @param {Object} hebergement 
 */
export const trackViewHebergement = (hebergement) => {
    trackEvent('view_hebergement', {
        hebergement_id: hebergement.id_hebergement,
        hebergement_nom: hebergement.nom_commercial,
        hebergement_type: hebergement.type_hebergement,
        prix_base: hebergement.prix_base_nuitee || 0
    });
};

/**
 * @param {Object} hebergement 
 */
export const trackStartReservation = (hebergement) => {
    trackEvent('start_reservation', {
        hebergement_id: hebergement.id_hebergement,
        hebergement_nom: hebergement.nom_commercial
    });
};

/**
 * @param {Object} data 
 */
export const trackReservationSubmitted = (data) => {
    trackEvent('reservation_submitted', {
        hebergement_id: data.hebergement_id,
        nb_nuits: data.nb_nuits,
        nb_personnes: data.nb_personnes,
        montant_total: data.montant_total,
        saison: data.saison || 'unknown'
    });
};

/**
 * @param {Object} data // ça c'est pas du js mais du jsdoc
 */
export const trackPaymentSuccess = (data) => {
    trackEvent('payment_success', {
        reservation_id: data.reservation_id,
        montant: data.montant,
        payment_method: 'stripe'
    });
};

if (typeof window !== 'undefined') {
    const checkGtagLoaded = setInterval(() => {
        if (window.gtag) {
            initGA();
            clearInterval(checkGtagLoaded);
        }
    }, 100);
    setTimeout(() => clearInterval(checkGtagLoaded), 10000);
}
