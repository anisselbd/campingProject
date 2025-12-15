import { jsPDF } from 'jspdf';


/**
 * @param {Object} reservation 
 */
export function generateInvoicePDF(reservation) {
    const doc = new jsPDF();


    const primaryColor = [46, 125, 50]; 
    const secondaryColor = [66, 66, 66]; 
    const lightGray = [240, 240, 240];


    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Ô SOLEIL BRULANT', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Votre destination nature de luxe', 105, 28, { align: 'center' });


    doc.setTextColor(...secondaryColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', 20, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Numéro: #${reservation.id_reservation}`, 20, 65);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 71);


    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT', 20, 85);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Client ID: #${reservation.client_id}`, 20, 93);


    doc.setFillColor(...lightGray);
    doc.roundedRect(20, 105, 170, 50, 3, 3, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('DÉTAILS DE LA RÉSERVATION', 25, 115);

    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');


    const arrivee = new Date(reservation.arrivee);
    const depart = new Date(reservation.depart);
    const nuits = Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24));

    doc.text(`Hébergement: #${reservation.hebergement_id}`, 25, 125);
    doc.text(`Date d'arrivée: ${arrivee.toLocaleDateString('fr-FR')}`, 25, 133);
    doc.text(`Date de départ: ${depart.toLocaleDateString('fr-FR')}`, 25, 141);
    doc.text(`Nombre de nuits: ${nuits}`, 25, 149);

    doc.text(`Adultes: ${reservation.adultes}`, 120, 125);
    doc.text(`Enfants: ${reservation.enfants || 0}`, 120, 133);
    doc.text(`Statut: ${getStatusLabel(reservation.statut)}`, 120, 141);


    const startY = 170;


    doc.setFillColor(...primaryColor);
    doc.rect(20, startY, 170, 10, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION', 25, startY + 7);
    doc.text('MONTANT', 160, startY + 7);


    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'normal');

    let currentY = startY + 20;
    const lineHeight = 8;


    const totalHT = parseFloat(reservation.total_sejour || 0);
    const tauxTVA = 0.10; // 10% TVA
    const montantTVA = totalHT * tauxTVA;
    const totalTTC = totalHT + montantTVA;


    doc.text(`Séjour - ${nuits} nuit(s)`, 25, currentY);
    doc.text(`${totalHT.toFixed(2)} €`, 160, currentY);
    currentY += lineHeight;


    doc.setDrawColor(200, 200, 200);
    doc.line(20, currentY, 190, currentY);
    currentY += lineHeight;


    doc.text(`TVA (${(tauxTVA * 100).toFixed(0)}%)`, 25, currentY);
    doc.text(`${montantTVA.toFixed(2)} €`, 160, currentY);
    currentY += lineHeight;


    doc.setFillColor(...lightGray);
    doc.rect(20, currentY - 5, 170, 12, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL TTC', 25, currentY + 3);
    doc.text(`${totalTTC.toFixed(2)} €`, 160, currentY + 3);


    const footerY = 270;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Ô SOLEIL BRULANT - contact@soleilbrulant.fr - Tél: 01 23 45 67 89', 105, footerY, { align: 'center' });
    doc.text('123 Route de la Nature, 75000 Paris, France', 105, footerY + 5, { align: 'center' });
    doc.text('SIRET: 123 456 789 00001 - TVA: FR12345678900', 105, footerY + 10, { align: 'center' });


    doc.save(`facture_${reservation.id_reservation}.pdf`);
}


function getStatusLabel(statut) {
    const statusMap = {
        'confirmee': 'Confirmée',
        'en_attente': 'En attente',
        'annulee': 'Annulée',
        'terminee': 'Terminée'
    };
    return statusMap[statut] || statut;
}
