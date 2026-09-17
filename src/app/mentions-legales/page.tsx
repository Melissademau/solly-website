import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Shield, Building, Server, Lock, Mail, Phone } from 'lucide-react';
import { Sparkle } from '@/components/ui/Doodles';

export const metadata: Metadata = {
  title: 'Mentions Légales & Confidentialité | Solly Dakar',
  description:
    'Consultez les mentions légales, informations sur l’éditeur, hébergeur et protection des données personnelles du site Solly à Dakar.',
  alternates: {
    canonical: 'https://www.monsolly.com/mentions-legales',
  },
};

export default function MentionsLegalesPage() {
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
            <span>TRANSPARENCE JURIDIQUE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-solly-pink tracking-tight leading-tight">
            Mentions Légales & Confidentialité
          </h1>

          <p className="text-sm sm:text-base text-solly-charcoal/80 font-medium mt-3 leading-relaxed">
            Conformément aux dispositions légales relatives à la confiance dans l&apos;économie numérique et à la protection des données personnelles, voici les mentions légales du site <strong>www.monsolly.com</strong>.
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

        {/* Sections */}
        <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-solly-border p-6 sm:p-10 shadow-solly-card space-y-8 sm:space-y-10 text-solly-charcoal text-sm sm:text-base leading-relaxed">
          {/* 1. Éditeur */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <Building className="w-5 h-5 text-solly-pink" />
              <span>1. Éditeur du Site</span>
            </h2>
            <div className="p-4 rounded-2xl bg-solly-cream/50 border border-solly-border/70 space-y-2 text-xs sm:text-sm text-solly-charcoal/85">
              <p><strong>Nom commercial :</strong> SOLLY (Solly Événements Gourmands)</p>
              <p><strong>Activité :</strong> Animation événementielle gourmande nomade, cake bar, service traiteur nomade à Dakar.</p>
              <p><strong>Fondatrice & Directrice de publication :</strong> Melissa De Mauser</p>
              <p><strong>Siège / Localisation :</strong> Dakar, Sénégal</p>
              <p>
                <strong>Courrier électronique :</strong>{' '}
                <a href="mailto:hello@monsolly.com" className="text-solly-pink underline font-bold">
                  hello@monsolly.com
                </a>
              </p>
              <p>
                <strong>Téléphone / WhatsApp professionnel :</strong>{' '}
                <a href="tel:+221776900458" className="text-solly-pink underline font-bold">
                  +221 77 690 04 58
                </a>
              </p>
            </div>
          </section>

          {/* 2. Hébergement */}
          <section className="space-y-3 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <Server className="w-5 h-5 text-solly-pink" />
              <span>2. Hébergement du Site</span>
            </h2>
            <div className="p-4 rounded-2xl bg-solly-cream/50 border border-solly-border/70 space-y-1.5 text-xs sm:text-sm text-solly-charcoal/85">
              <p>Le site <strong>www.monsolly.com</strong> est hébergé par :</p>
              <p><strong>Vercel Inc.</strong></p>
              <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p>
                Site web de l&apos;hébergeur :{' '}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-solly-pink underline">
                  https://vercel.com
                </a>
              </p>
            </div>
          </section>

          {/* 3. Propriété intellectuelle */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <Shield className="w-5 h-5 text-solly-pink" />
              <span>3. Propriété Intellectuelle</span>
            </h2>
            <p className="text-solly-charcoal/80">
              L&apos;ensemble de ce site relève de la législation internationale sur le droit d&apos;auteur et la propriété intellectuelle.
            </p>
            <p className="text-solly-charcoal/80">
              Tous les éléments éditoriaux, graphiques, photographies, logos (notamment le logo SOLLY), vidéos, animations, illustrations, concepts de mise en scène et recettes présentés sur ce site sont la propriété exclusive de SOLLY ou font l&apos;objet d&apos;une autorisation expresse d&apos;utilisation.
            </p>
            <p className="text-solly-charcoal/80">
              Toute reproduction, représentation, modification, publication ou adaptation totale ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est formellement interdite sans l&apos;accord préalable et écrit de SOLLY.
            </p>
          </section>

          {/* 4. Données personnelles */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <Lock className="w-5 h-5 text-solly-pink" />
              <span>4. Protection des Données Personnelles (CDP Sénégal & RGPD)</span>
            </h2>
            <p className="text-solly-charcoal/80">
              SOLLY attache une importance capitale à la confidentialité et à la sécurité de vos données personnelles.
            </p>
            <div className="space-y-2 pt-2 text-xs sm:text-sm text-solly-charcoal/85">
              <p>
                <strong>Données collectées :</strong> Les données recueillies lors d&apos;une simulation ou demande de devis sur notre site (nom, prénom, numéro de téléphone WhatsApp, adresse e-mail, date et lieu de l&apos;événement, nombre d&apos;invités) sont strictement nécessaires à l&apos;élaboration de votre devis personnalisé et au suivi de votre réservation.
              </p>
              <p>
                <strong>Finalité :</strong> Vos données sont traitées uniquement pour répondre à vos demandes, générer vos récapitulatifs, vous envoyer les détails de confirmation et assurer la logistique de votre prestation.
              </p>
              <p>
                <strong>Absence de revente à des tiers :</strong> En aucun cas vos données ne sont vendues, louées, partagées ou transmises à des tiers ou à des régies publicitaires.
              </p>
              <p>
                <strong>Vos droits :</strong> Conformément à la réglementation sénégalaise (loi n° 2008-12 relative à la protection des données à caractère personnel) et aux standards internationaux, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression totale de vos données. Pour exercer ce droit, il vous suffit de nous adresser un simple courriel à{' '}
                <a href="mailto:hello@monsolly.com" className="text-solly-pink underline font-bold">
                  hello@monsolly.com
                </a>.
              </p>
            </div>
          </section>

          {/* 5. Cookies */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>5.</span> Cookies & Traceurs
            </h2>
            <p className="text-solly-charcoal/80">
              Le site <strong>www.monsolly.com</strong> n&apos;utilise aucun cookie publicitaire ou traceur intrusif de profilage.
            </p>
            <p className="text-solly-charcoal/80">
              Seuls des cookies strictement techniques nécessaires au bon fonctionnement de la navigation, à la mémorisation temporaire de votre sélection dans le simulateur de réservation et à la sécurité des transactions peuvent être déposés.
            </p>
          </section>

          {/* 6. Liens Hypertextes */}
          <section className="space-y-2 pt-6 border-t border-solly-border/40">
            <h2 className="text-xl sm:text-2xl font-display font-black text-solly-pink flex items-center gap-2">
              <span>6.</span> Liens Hypertextes
            </h2>
            <p className="text-solly-charcoal/80">
              Le site peut contenir des liens vers des services externes (tels que WhatsApp pour la mise en relation directe). SOLLY ne dispose d&apos;aucun contrôle sur le contenu de ces services tiers et décline toute responsabilité quant à leurs politiques de traitement des données.
            </p>
          </section>
        </div>

        {/* Bloc Contact & Assistance */}
        <div className="mt-8 bg-white rounded-2xl sm:rounded-3xl border border-solly-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-solly-soft">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-solly-charcoal">
              Une question juridique ou administrative ?
            </h3>
            <p className="text-xs sm:text-sm text-solly-muted mt-0.5">
              Contactez-nous directement par e-mail ou WhatsApp.
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
