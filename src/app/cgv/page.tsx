import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Phone, Mail, Clock } from 'lucide-react';
import { Sparkle } from '@/components/ui/Doodles';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente (CGV) | Solly Dakar',
  description:
    'Consultez les Conditions Générales de Vente de Solly pour les prestations de chariot événementiel, cake bar et bars gourmands à Dakar.',
  alternates: {
    canonical: 'https://www.monsolly.com/cgv',
  },
};

export default function CGVPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-solly-cream/40 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation retour */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-solly-muted hover:text-solly-pink transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>

        {/* En-tête de la page */}
        <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-solly-border p-6 sm:p-10 shadow-solly-card mb-8 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-display font-black uppercase tracking-widest text-solly-pink mb-3">
            <Sparkle size={14} color="#DE1B52" />
            <span>INFORMATIONS CONTRACTUELLES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-solly-pink tracking-tight leading-tight">
            Conditions Générales de Vente (CGV)
          </h1>

          <p className="text-sm sm:text-base text-solly-charcoal/80 font-medium mt-3 leading-relaxed">
            Les présentes Conditions Générales de Vente régissent l&apos;ensemble des prestations
            d&apos;animation et de traiteur nomade proposées par <strong>SOLLY</strong> à Dakar et sa région
            (Chariot événementiel signature, Cake Bar personnalisé, Bar à boissons fraîches et Bar à charcuterie).
          </p>

          <div className="mt-5 pt-4 border-t border-solly-border/60 flex flex-wrap items-center gap-4 text-xs text-solly-muted">
            <span className="inline-flex items-center gap-1.5 font-semibold text-solly-charcoal">
              <Clock className="w-3.5 h-3.5 text-solly-pink" />
              Dernière mise à jour : Septembre 2026
            </span>
            <span>•</span>
            <span>Applicable à toute réservation</span>
          </div>
        </div>

        {/* Encadré Points Clés */}
        <div className="bg-[#FFF8E3] border border-[#FDE68A] rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-8 text-xs sm:text-sm text-amber-950 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 font-display font-bold text-amber-900 text-sm sm:text-base">
            <span>✨</span>
            <span>En résumé : les 3 règles clés de votre réservation Solly</span>
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-amber-900/90 font-medium">
            <li>
              <strong>Devis valable 72 heures :</strong> les disponibilités de date et tarifs sont garantis pendant 72h.
            </li>
            <li>
              <strong>Acompte de 70 % à la réservation :</strong> la date n&apos;est définitivement bloquée qu&apos;à réception de cet acompte. Sa réception vaut acceptation des présentes CGV.
            </li>
            <li>
              <strong>Solde de 30 % au Jour J :</strong> réglable avant le début de l&apos;installation et de la prestation.
            </li>
          </ul>
        </div>

        {/* Corps des Articles */}
        <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-solly-border p-6 sm:p-10 shadow-solly-card space-y-8 sm:space-y-10 text-solly-charcoal text-sm sm:text-base leading-relaxed">
          {/* Article 1 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>1.</span> Objet & Champ d&apos;application
            </h2>
            <p className="text-solly-charcoal/80">
              Les présentes Conditions Générales de Vente (CGV) s&apos;appliquent à toutes les commandes
              passées auprès de <strong>SOLLY</strong> (marque exploitée par Melissa De Mauser à Dakar, Sénégal),
              soit directement via le site web{' '}
              <Link href="/" className="text-solly-pink underline font-semibold">
                www.monsolly.com
              </Link>
              , soit par WhatsApp ou par e-mail.
            </p>
            <p className="text-solly-charcoal/80">
              Toute commande passée implique l&apos;adhésion entière, sans réserve et sans restriction du client
              aux présentes conditions, qui prévalent sur tout autre document.
            </p>
          </section>

          {/* Article 2 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>2.</span> Émission du Devis & Durée de Validité
            </h2>
            <p className="text-solly-charcoal/80">
              Chaque événement fait l&apos;objet d&apos;un devis chiffré personnalisé en fonction de la date,
              du lieu précis à Dakar, du nombre d&apos;invités et des bars choisis (Cake Bar, Boissons, Charcuterie).
            </p>
            <div className="bg-solly-cream/60 rounded-xl p-3.5 border border-solly-border/70 text-xs sm:text-sm font-medium text-solly-charcoal">
              ⏱️ <strong>Validité de 72 heures :</strong> Le devis émis est strictement valable pendant un délai
              de <strong>72 heures</strong> à compter de son envoi. Passé ce délai, Solly se réserve le droit de
              libérer l&apos;option de réservation sur le calendrier et de réévaluer ses disponibilités et tarifs.
            </div>
          </section>

          {/* Article 3 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>3.</span> Réservation Ferme & Modalités de Paiement
            </h2>
            <p className="text-solly-charcoal/80">
              La commande n&apos;est réputée ferme, définitive et enregistrée dans le calendrier Solly qu&apos;à
              la condition cumulative du respect des conditions suivantes :
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-solly-charcoal/85">
              <li>
                <strong>Acompte de 70 % :</strong> Versement d&apos;un acompte obligatoire de <strong>70 % du montant total du devis</strong> lors de la validation. La date de l&apos;événement n&apos;est définitivement réservée qu&apos;après réception effective de cet acompte.
              </li>
              <li>
                <strong>Solde de 30 % au Jour J :</strong> Le solde restant de <strong>30 %</strong> est intégralement exigible le Jour J de la prestation, avant le début de l&apos;installation de l&apos;animation par l&apos;équipe Solly.
              </li>
            </ul>
            <p className="text-solly-charcoal/80 pt-1">
              <strong>Moyens de règlement acceptés :</strong> Transfert Wave ou Orange Money au{' '}
              <strong>+221 77 690 04 58</strong>, virement bancaire sur compte désigné, ou paiement en espèces avec reçu.
            </p>
            <div className="p-3 bg-[#FCECEF] rounded-xl border border-solly-pink/20 text-xs font-bold text-solly-pink">
              ⚠️ La réception de l&apos;acompte de 70 % constitue un accord ferme et contractuel avec acceptation pleine et entière des présentes CGV.
            </div>
          </section>

          {/* Article 4 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>4.</span> Prestations Incluses & Déroulement
            </h2>
            <p className="text-solly-charcoal/80">
              Sauf mention contraire explicite figurant sur le devis validé, l&apos;expérience Solly inclut :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-solly-border shadow-2xs space-y-1">
                <div className="font-bold text-solly-charcoal text-xs sm:text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-solly-pink shrink-0" />
                  <span>Chariot jaune & Décoration</span>
                </div>
                <p className="text-xs text-solly-muted">
                  Le chariot signature Solly jaune soleil, les arts de la table, les contenants et barquettes de présentation.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-solly-border shadow-2xs space-y-1">
                <div className="font-bold text-solly-charcoal text-xs sm:text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-solly-pink shrink-0" />
                  <span>Service & Maître de Bar</span>
                </div>
                <p className="text-xs text-solly-muted">
                  Présence d&apos;un membre de l&apos;équipe Solly pour animer, servir avec le sourire et accompagner vos convives.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-solly-border shadow-2xs space-y-1">
                <div className="font-bold text-solly-charcoal text-xs sm:text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-solly-pink shrink-0" />
                  <span>Installation & Démontage</span>
                </div>
                <p className="text-xs text-solly-muted">
                  Arrivée préalable de l&apos;équipe pour l&apos;installation complète, et démontage propre à l&apos;issue de la prestation.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-solly-border shadow-2xs space-y-1">
                <div className="font-bold text-solly-charcoal text-xs sm:text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-solly-pink shrink-0" />
                  <span>Logistique & Déplacement (Dakar)</span>
                </div>
                <p className="text-xs text-solly-muted">
                  Acheminement du matériel dans le périmètre de Dakar convenu au devis (frais kilométriques éventuels hors zone).
                </p>
              </div>
            </div>
          </section>

          {/* Article 5 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>5.</span> Conditions d&apos;Accès & Obligations du Client
            </h2>
            <p className="text-solly-charcoal/80">
              Pour assurer le bon déroulement de l&apos;animation et la sécurité du matériel et des invités, le client s&apos;engage à :
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-solly-charcoal/85">
              <li>
                <strong>Accès physique au lieu :</strong> Fournir un accès dégagé (largeur minimale de passage de 90 cm) permettant le roulement du chariot. En cas d&apos;escaliers ou d&apos;accès difficile sans ascenseur, le client doit impérativement le signaler avant l&apos;émission du devis.
              </li>
              <li>
                <strong>Stabilité du sol :</strong> Disposer d&apos;un sol plat, propre et stable (évitement des sols meubles, sable non stabilisé ou pentes prononcées).
              </li>
              <li>
                <strong>Conditions météo (Prestations extérieures) :</strong> En cas de vent violent, pluie battante ou fort ensoleillement, le client doit mettre à disposition un espace abrité (tente, pergola, préau ou intérieur).
              </li>
            </ul>
          </section>

          {/* Article 6 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>6.</span> Allergènes & Sécurité Alimentaire
            </h2>
            <p className="text-solly-charcoal/80">
              Nos fabrications et garnitures (gâteaux, crèmes, sauces, toppings, charcuterie) peuvent contenir ou avoir été en contact avec des allergènes majeurs : gluten, œufs, produits laitiers, arachides, fruits à coque.
            </p>
            <p className="text-solly-charcoal/80">
              Le client a l&apos;obligation d&apos;informer Solly par écrit au moins <strong>5 jours avant l&apos;événement</strong> de toute allergie ou intolérance grave connue parmi ses invités. Solly ne saurait être tenue responsable de réactions allergiques en cas d&apos;omission de notification préalable.
            </p>
          </section>

          {/* Article 7 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>7.</span> Modification, Annulation & Remboursement
            </h2>
            <p className="text-solly-charcoal/80">
              Toute annulation ou demande de report d&apos;événement est régie par notre{' '}
              <Link href="/politique-de-remboursement" className="text-solly-pink underline font-bold">
                Politique de Remboursement & d&apos;Annulation
              </Link>
              . En raison du caractère périssable des denrées alimentaires et du blocage exclusif du chariot pour votre date, l&apos;acompte de 70 % n&apos;est pas remboursable à moins de 14 jours de l&apos;événement.
            </p>
          </section>

          {/* Article 8 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>8.</span> Responsabilité & Force Majeure
            </h2>
            <p className="text-solly-charcoal/80">
              Solly ne saurait être tenue responsable des retards ou de l&apos;inexécution de ses obligations en cas de force majeure telle que reconnue par la jurisprudence (catastrophes naturelles, émeutes, intempéries exceptionnelles rendant les axes routiers de Dakar impraticables, coupures générales d&apos;énergie).
            </p>
            <p className="text-solly-charcoal/80">
              En cas de dégradation du chariot ou du matériel causée délibérément par les convives de l&apos;événement, les frais de remise en état pourront être refacturés au client.
            </p>
          </section>

          {/* Article 9 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>9.</span> Droit à l&apos;Image
            </h2>
            <p className="text-solly-charcoal/80">
              Sauf refus express formulé par écrit par le client avant l&apos;événement, Solly se réserve le droit de réaliser des photographies ou courtes vidéos du chariot et de la mise en scène décorative lors de l&apos;événement, à des fins exclusives de promotion sur ses réseaux sociaux et son site web, dans le strict respect de la dignité et de la vie privée des convives.
            </p>
          </section>

          {/* Article 10 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>10.</span> Droit Applicable & Règlement des Litiges
            </h2>
            <p className="text-solly-charcoal/80">
              Les présentes CGV sont soumises à la législation en vigueur en République du Sénégal. En cas de différend ou de litige survenu à l&apos;occasion de l&apos;interprétation ou de l&apos;exécution d&apos;une prestation, les parties s&apos;engagent à rechercher prioritairement une solution amiable. À défaut d&apos;accord amiable, les tribunaux compétents de Dakar seront seuls compétents.
            </p>
          </section>
        </div>

        {/* Bloc Contact & Assistance */}
        <div className="mt-8 bg-white rounded-2xl sm:rounded-3xl border border-solly-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-solly-soft">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-solly-charcoal">
              Une question sur nos conditions ?
            </h3>
            <p className="text-xs sm:text-sm text-solly-muted mt-0.5">
              Notre équipe est à votre écoute pour vous renseigner avec bienveillance.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="mailto:hello@monsolly.com"
              className="px-4 py-2.5 rounded-full border border-solly-border text-xs font-bold text-solly-charcoal hover:text-solly-pink hover:border-solly-pink/40 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-solly-pink" />
              <span>hello@monsolly.com</span>
            </a>
            <a
              href="https://wa.me/221776900458"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+221 77 690 04 58</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
