import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, ShieldCheck, AlertCircle, Phone, Mail, RotateCcw } from 'lucide-react';
import { Sparkle } from '@/components/ui/Doodles';

export const metadata: Metadata = {
  title: 'Politique de Remboursement & Annulation | Solly Dakar',
  description:
    'Consultez les conditions d’annulation, de report et de remboursement de Solly pour vos réservations d’événements gourmands à Dakar.',
  alternates: {
    canonical: 'https://www.monsolly.com/politique-de-remboursement',
  },
};

export default function PolitiqueRemboursementPage() {
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

        {/* En-tête */}
        <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-solly-border p-6 sm:p-10 shadow-solly-card mb-8 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-display font-black uppercase tracking-widest text-solly-pink mb-3">
            <Sparkle size={14} color="#DE1B52" />
            <span>TRANSPARENCE & ENGAGEMENT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-solly-pink tracking-tight leading-tight">
            Politique de Remboursement & Annulation
          </h1>

          <p className="text-sm sm:text-base text-solly-charcoal/80 font-medium mt-3 leading-relaxed">
            Chez <strong>SOLLY</strong>, chaque événement est préparé sur-mesure avec des denrées fraîches,
            une logistique dédiée et l&apos;immobilisation exclusive de notre chariot signature et de son animateur.
            Voici nos règles claires en cas d&apos;imprévu, de report ou d&apos;annulation.
          </p>

          <div className="mt-5 pt-4 border-t border-solly-border/60 flex flex-wrap items-center gap-4 text-xs text-solly-muted">
            <span className="inline-flex items-center gap-1.5 font-semibold text-solly-charcoal">
              <Clock className="w-3.5 h-3.5 text-solly-pink" />
              Dernière mise à jour : Septembre 2026
            </span>
            <span>•</span>
            <span>Dakar, Sénégal</span>
          </div>
        </div>

        {/* Tableau récapitulatif visuel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-solly-border p-5 sm:p-6 shadow-2xs space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Plus de 14 jours</span>
            </div>
            <h3 className="font-display font-bold text-solly-charcoal text-base">
              Report gratuit ou remboursement 50%
            </h3>
            <p className="text-xs text-solly-muted leading-relaxed">
              Report sans frais sur 6 mois (selon dispo) ou remboursement de 50% de l&apos;acompte (50% conservés pour frais administratifs et blocage).
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-solly-border p-5 sm:p-6 shadow-2xs space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Entre 14j et 72h</span>
            </div>
            <h3 className="font-display font-bold text-solly-charcoal text-base">
              Avoir sur 6 mois
            </h3>
            <p className="text-xs text-solly-muted leading-relaxed">
              Pas de remboursement en espèces. Un avoir peut être accordé déduction faite des achats et matières premières déjà approvisionnés.
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-solly-border p-5 sm:p-6 shadow-2xs space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCECEF] text-solly-pink text-xs font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Moins de 72 heures</span>
            </div>
            <h3 className="font-display font-bold text-solly-pink text-base">
              Aucun remboursement
            </h3>
            <p className="text-xs text-solly-muted leading-relaxed">
              L&apos;acompte de 70% est intégralement conservé : les denrées périssables sont cuisinées et le chariot ne peut plus être reloué.
            </p>
          </div>
        </div>

        {/* Détails complets des clauses */}
        <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-solly-border p-6 sm:p-10 shadow-solly-card space-y-8 sm:space-y-10 text-solly-charcoal text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>1.</span> Pourquoi nos réservations sont-elles soumises à un acompte ferme ?
            </h2>
            <p className="text-solly-charcoal/80">
              Chaque prestation Solly mobilise un équipement unique (le chariot jaune Solly avec sa verrerie et ses présentoirs), un maître de bar professionnel et des denrées fraîches haut de gamme (gâteaux moelleux faits maison, crèmes, sauces artisanales, fruits frais de saison, charcuterie).
            </p>
            <p className="text-solly-charcoal/80">
              Dès le versement de l&apos;acompte de 70 %, la date et le créneau horaire sont <strong>définitivement verrouillés pour vous</strong>, et toute autre sollicitation pour ce même jour est refusée.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>2.</span> Conditions d&apos;annulation à l&apos;initiative du Client
            </h2>
            <div className="space-y-3 text-solly-charcoal/85">
              <div className="p-4 rounded-2xl bg-solly-cream/50 border border-solly-border/70 space-y-1.5">
                <h4 className="font-bold text-solly-charcoal text-sm sm:text-base">
                  Cas 1 : Annulation à plus de 14 jours calendaires avant l&apos;événement
                </h4>
                <p className="text-xs sm:text-sm text-solly-charcoal/80">
                  Le client peut choisir :
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 pl-1">
                  <li>Soit de reporter sa prestation sur une nouvelle date dans un délai maximum de 6 mois, sans aucun frais supplémentaire (selon disponibilités de l&apos;agenda Solly).</li>
                  <li>Soit de demander un remboursement de son acompte : <strong>50 % de l&apos;acompte versé sera alors remboursé</strong> sous 7 jours ouvrés (les 50 % restants étant conservés par Solly pour couvrir les frais de blocage du calendrier et le traitement administratif).</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-solly-cream/50 border border-solly-border/70 space-y-1.5">
                <h4 className="font-bold text-solly-charcoal text-sm sm:text-base">
                  Cas 2 : Annulation entre 14 jours et 72 heures avant l&apos;événement
                </h4>
                <p className="text-xs sm:text-sm text-solly-charcoal/80">
                  L&apos;acompte de 70 % n&apos;est pas remboursable en numéraire. Un avoir utilisable sur une prestation future dans les 6 mois pourra être accordé, déduction faite des achats d&apos;ingrédients et des frais de personnalisation déjà engagés.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FCECEF]/60 border border-solly-pink/20 space-y-1.5">
                <h4 className="font-bold text-solly-pink text-sm sm:text-base">
                  Cas 3 : Annulation à moins de 72 heures du Jour J ou absence
                </h4>
                <p className="text-xs sm:text-sm text-solly-charcoal/80">
                  Aucun remboursement, remise ou avoir ne pourra être accordé. L&apos;intégralité de l&apos;acompte de 70 % demeure acquise à Solly à titre d&apos;indemnité forfaitaire d&apos;annulation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>3.</span> Modification de Date ou d&apos;Horaire
            </h2>
            <p className="text-solly-charcoal/80">
              Un imprévu d&apos;agenda ? Vous pouvez demander un report de date ou un décalage d&apos;horaire <strong>sans aucun frais supplémentaire</strong> jusqu&apos;à <strong>7 jours calendaires</strong> avant la date initialement convenue, sous réserve que le chariot Solly soit disponible à votre nouvelle date souhaitée.
            </p>
            <p className="text-xs sm:text-sm text-solly-muted">
              Passé ce délai de 7 jours, une demande de changement de date sera traitée comme une annulation tardive en raison de l&apos;approvisionnement déjà initié.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>4.</span> Annulation par Solly (Cas fortuit & Force Majeure)
            </h2>
            <p className="text-solly-charcoal/80">
              Dans l&apos;hypothèse exceptionnelle où Solly se trouverait dans l&apos;incapacité totale d&apos;assurer la prestation (cas de force majeure, accident grave, intempéries extrêmes empêchant l&apos;acheminement), Solly s&apos;engage à :
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-solly-charcoal/85">
              <li>Proposer en priorité un report sans frais à la date de convenance du client.</li>
              <li>À défaut de report possible, <strong>rembourser intégralement (100 %) les sommes d&apos;ores et déjà perçues</strong>, sous un délai de 72 heures ouvrées, sans indemnité complémentaire.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>5.</span> Comment formuler une demande d&apos;annulation ou de report ?
            </h2>
            <p className="text-solly-charcoal/80">
              Pour être prise en compte et horodatée officiellement, toute demande doit être formulée par écrit via l&apos;un de nos deux canaux officiels :
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex-1 p-3.5 rounded-2xl bg-white border border-solly-border text-xs sm:text-sm flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-solly-pink shrink-0" />
                <span>Par e-mail : <strong>hello@monsolly.com</strong></span>
              </div>
              <div className="flex-1 p-3.5 rounded-2xl bg-white border border-solly-border text-xs sm:text-sm flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>Par WhatsApp officiel : <strong>+221 77 690 04 58</strong></span>
              </div>
            </div>
          </section>
        </div>

        {/* Bloc Contact & Assistance */}
        <div className="mt-8 bg-white rounded-2xl sm:rounded-3xl border border-solly-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-solly-soft">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-solly-charcoal">
              Besoin de modifier une réservation en cours ?
            </h3>
            <p className="text-xs sm:text-sm text-solly-muted mt-0.5">
              Contactez-nous sans attendre avec votre numéro de devis pour trouver la meilleure solution.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/221776900458"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Nous contacter sur WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
