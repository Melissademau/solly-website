'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Building2,
  Briefcase,
  Users,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  MessageCircle,
  Check,
  ChevronDown,
  Layers,
  Wand2,
  Utensils,
  PartyPopper,
  Handshake,
  Loader2,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Sparkle, ScallopEdge, SollyLogo } from '@/components/ui/Doodles';

const B2B_BADGES = [
  'Agences événementielles',
  'Entreprises',
  'Marques',
  'Hôtels & lieux de réception',
  'Wedding & Event planners',
];

const ADVANTAGES = [
  {
    num: '01',
    title: 'Une prestation clé en main',
    description:
      'Installation, production et service : notre équipe prend en charge l’expérience sur place pour vous garantir un déroulement fluide et sans contrainte.',
    icon: Wand2,
    bg: 'bg-[#FFF9E6]',
    border: 'border-[#FDE68A]',
  },
  {
    num: '02',
    title: 'Une expérience personnalisable',
    description:
      'Le chariot, les supports et certains éléments de présentation peuvent s’adapter à l’univers de votre marque ou de votre événement (façade amovible, packaging, univers graphique).',
    icon: Layers,
    bg: 'bg-[#FFF4F7]',
    border: 'border-solly-pink/30',
  },
  {
    num: '03',
    title: 'Plusieurs expériences gourmandes',
    description:
      'Mini pancakes, croffles, cake bar, charcuterie… une offre modulable selon le format de votre opération, en sucré comme en salé.',
    icon: Utensils,
    bg: 'bg-[#FAF7F2]',
    border: 'border-solly-border',
  },
  {
    num: '04',
    title: 'Pensé pour l’événementiel',
    description:
      'Lancements, activations de marque, soirées d’entreprise, séminaires, pop-ups, événements privés ou opérations en centre commercial : un format compact, esthétique et mobile.',
    icon: PartyPopper,
    bg: 'bg-[#FFF4F7]',
    border: 'border-solly-pink/30',
  },
  {
    num: '05',
    title: 'Des collaborations sur mesure',
    description:
      'Pour les professionnels qui organisent régulièrement des événements, Solly peut construire des collaborations récurrentes et des formats adaptés à chaque besoin.',
    icon: Handshake,
    bg: 'bg-[#FFF9E6]',
    border: 'border-[#FDE68A]',
  },
];

const PROJECT_TYPES = [
  { label: 'Activation de marque', icon: '✨' },
  { label: 'Lancement produit', icon: '🚀' },
  { label: 'Événement corporate', icon: '🏢' },
  { label: 'Séminaire', icon: '💡' },
  { label: 'Pop-up', icon: '🛍️' },
  { label: 'Centre commercial', icon: '🏬' },
  { label: 'Cocktail', icon: '🥂' },
  { label: 'Mariage', icon: '💍' },
  { label: 'Événement presse', icon: '📸' },
  { label: 'Animation commerciale', icon: '🎯' },
];

const EXPERIENCES_OPTIONS = [
  { id: 'mini-pancakes', label: 'Mini Pancakes' },
  { id: 'croffles', label: 'Croffles' },
  { id: 'cake-bar', label: 'Cake Bar' },
  { id: 'charcuterie', label: 'Bar à Charcuterie' },
  { id: 'boissons', label: 'Bar à Boissons fraîches' },
];

const COUNTRY_CODES = [
  { country: 'Sénégal', code: '+221', flag: '🇸🇳' },
  { country: 'France', code: '+33', flag: '🇫🇷' },
  { country: "Côte d'Ivoire", code: '+225', flag: '🇨🇮' },
  { country: 'Mali', code: '+223', flag: '🇲🇱' },
  { country: 'Guinée', code: '+224', flag: '🇬🇳' },
  { country: 'Gabon', code: '+241', flag: '🇬🇦' },
  { country: 'Cameroun', code: '+237', flag: '🇨🇲' },
  { country: 'Maroc', code: '+212', flag: '🇲🇦' },
  { country: 'États-Unis / Canada', code: '+1', flag: '🇺🇸' },
  { country: 'Belgique', code: '+32', flag: '🇧🇪' },
  { country: 'Suisse', code: '+41', flag: '🇨🇭' },
  { country: 'Royaume-Uni', code: '+44', flag: '🇬🇧' },
];

export default function PartenairesPage() {
  const [formData, setFormData] = useState({
    company: '',
    contactName: '',
    phone: '',
    countryCode: '+221',
    email: '',
    projectType: 'Activation de marque',
    eventDate: '',
    guestCount: '',
    selectedExperiences: ['cake-bar', 'mini-pancakes'],
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  const toggleExperience = (id: string) => {
    setFormData((prev) => {
      const exists = prev.selectedExperiences.includes(id);
      return {
        ...prev,
        selectedExperiences: exists
          ? prev.selectedExperiences.filter((item) => item !== id)
          : [...prev.selectedExperiences, id],
      };
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.company.trim()) errs.company = 'Nom de l’entreprise ou marque requis';
    if (!formData.contactName.trim()) errs.contactName = 'Nom du contact requis';
    if (!formData.phone.trim()) errs.phone = 'Numéro de téléphone requis';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Adresse email professionnelle valide requise';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const generatedRef = `B2B-${yy}${mm}${dd}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingRef: generatedRef,
          formData: {
            name: `${formData.contactName} (${formData.company})`,
            phone: formData.phone,
            countryCode: formData.countryCode,
            email: formData.email,
            eventType: `[PRO] ${formData.projectType}`,
            eventDate: formData.eventDate,
            guestCount: formData.guestCount ? parseInt(formData.guestCount, 10) : 50,
            address: 'Dakar / Prestation B2B',
            message: `Entreprise: ${formData.company}\nType de projet: ${formData.projectType}\nInvités estimés: ${formData.guestCount || 'Non précisé'}\nExpériences: ${formData.selectedExperiences.join(', ')}\n\nDescription: ${formData.message || 'Aucune'}`,
            budgetDesired: 0,
            budgetMinimum: 0,
          },
        }),
      });
      setRefId(generatedRef);
      setIsSubmitted(true);
    } catch (err) {
      console.error('[B2B Submit Error]', err);
      setRefId(generatedRef);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getB2BWhatsAppUrl = () => {
    const text =
      `Bonjour Solly ! ✨ Je vous contacte au nom de *${formData.company || 'notre entreprise'}* pour un projet événementiel.\n\n` +
      `👤 Contact : ${formData.contactName}\n` +
      `📞 Téléphone : ${formData.countryCode} ${formData.phone}\n` +
      `📧 Email : ${formData.email}\n` +
      `🎯 Type d'opération : ${formData.projectType}\n` +
      `📅 Date envisagée : ${formData.eventDate || 'À définir'}\n` +
      `👥 Personnes estimées : ${formData.guestCount || 'À préciser'}\n` +
      `🍰 Expériences d'intérêt : ${formData.selectedExperiences.join(', ')}\n` +
      (formData.message ? `\n💬 Détails : ${formData.message}\n` : '') +
      (refId ? `\n🔖 Réf. projet : #${refId}\n` : '') +
      `\nPouvons-nous échanger sur vos disponibilités et une proposition personnalisée ? Merci !`;

    return `https://wa.me/221776900458?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left z-10"
            >
              {/* Category Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solly-pink-soft text-solly-pink text-xs font-bold uppercase tracking-wider mb-4 border border-solly-pink/20">
                <Briefcase className="w-3.5 h-3.5 text-solly-pink" />
                <span>Solly B2B & Événements Professionnels</span>
              </div>

              {/* Title with Sparkle */}
              <div className="relative mb-4 inline-block">
                <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-[68px] text-solly-charcoal leading-[1.05] tracking-tight">
                  Solly pour les pros
                </h1>
                <div className="absolute top-0 -right-7 sm:-right-9 text-solly-pink select-none pointer-events-none">
                  <Sparkle size={30} color="#DE1B52" />
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-xl font-medium text-solly-charcoal/90 max-w-xl mb-6 leading-relaxed">
                Une expérience gourmande pensée pour vos événements, vos clients et votre marque.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
                {B2B_BADGES.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-solly-border text-xs font-bold text-solly-charcoal shadow-2xs"
                  >
                    <span className="text-solly-pink">✦</span>
                    <span>{badge}</span>
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <a
                  href="#formulaire-pro"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink/90 shadow-solly-pink transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer text-center"
                >
                  <span>Parlons de votre projet</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="https://wa.me/221776900458?text=Bonjour%20Solly%20!%20Je%20souhaite%20des%20renseignements%20pour%20un%20%C3%A9v%C3%A9nement%20professionnel."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-white hover:bg-solly-cream border border-solly-border text-solly-charcoal font-bold text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Échanger sur WhatsApp</span>
                </a>
              </div>
            </motion.div>

            {/* Right Visual: Branded Cart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-solly-card border border-solly-border bg-white">
                <Image
                  src="/images/solly-assets/06-evenements/chariot-votre-logo.png"
                  alt="Chariot Solly personnalisable avec le logo de votre entreprise ou marque"
                  width={1254}
                  height={1254}
                  priority
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-solly-border shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-solly-charcoal">
                      Façades & packaging personnalisables à votre charte
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold text-solly-pink">Dakar</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. RIBBON SEPARATOR */}
      <section className="relative w-full">
        <ScallopEdge color="#FFD233" height={12} />
        <div className="bg-solly-yellow py-3 px-4">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-bold text-solly-charcoal tracking-wide text-center">
            <Sparkle size={14} color="#2E1C14" />
            <span>Clé en main</span>
            <span className="text-solly-charcoal/40 hidden sm:inline">•</span>
            <span>Production minute sur place</span>
            <span className="text-solly-charcoal/40 hidden sm:inline">•</span>
            <span>Esthétique & photogénique</span>
            <span className="text-solly-charcoal/40 hidden sm:inline">•</span>
            <span>Équipe dédiée</span>
            <Sparkle size={14} color="#2E1C14" />
          </div>
        </div>
      </section>

      {/* 3. SECTION: POURQUOI TRAVAILLER AVEC SOLLY ? (5 AVANTAGES) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-solly-pink-soft text-solly-pink mb-3">
              <Star className="w-3.5 h-3.5 fill-solly-pink text-solly-pink" />
              L’atout Solly
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-solly-charcoal tracking-tight">
              Pourquoi travailler avec Solly ?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-solly-muted font-medium">
              Une solution de traiteur d'animation pensée pour valoriser votre marque et surprendre vos invités.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVANTAGES.map((adv) => {
              const IconComp = adv.icon;
              return (
                <div
                  key={adv.num}
                  className={`rounded-[26px] p-6 sm:p-7 border ${adv.border} ${adv.bg} flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-solly-border flex items-center justify-center text-solly-pink shadow-2xs">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="font-display font-black text-xl text-solly-charcoal/30">
                        {adv.num}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-solly-charcoal mb-2.5">
                      {adv.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium leading-relaxed">
                      {adv.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SECTION: TYPES DE PROJETS B2B */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-solly-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-solly-yellow/30 text-solly-charcoal mb-3">
              Cas d'usages
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-solly-charcoal tracking-tight">
              Des formats adaptés à chaque projet
            </h2>
            <p className="mt-3 text-sm sm:text-base text-solly-muted font-medium">
              Une scénographie gourmande et mobile qui s'intègre harmonieusement dans tous les lieux de réception.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {PROJECT_TYPES.map((type) => (
              <div
                key={type.label}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-solly-border text-center flex flex-col items-center justify-center gap-2 hover:border-solly-pink/40 hover:shadow-2xs transition-all"
              >
                <span className="text-2xl sm:text-3xl mb-0.5">{type.icon}</span>
                <span className="font-display font-extrabold text-xs sm:text-sm text-solly-charcoal leading-tight">
                  {type.label}
                </span>
              </div>
            ))}
          </div>

          {/* Visual Gallery Preview */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xs border border-solly-border">
              <Image
                src="/images/mini-pancakes/pancakes-preview.webp"
                alt="Mini Pancakes en événement d'entreprise"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">Mini Pancakes Solly</span>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xs border border-solly-border">
              <Image
                src="/images/croffles/croffle-preview.webp"
                alt="Croffles croustillants pour pop-up"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">Croffles Caramélisés</span>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xs border border-solly-border">
              <Image
                src="/images/cake-bar/cake-bar-two-cakes.jpg"
                alt="Cake Bar traiteur événementiel"
                fill
                className="object-cover object-[center_60%] hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">Cake Bar Découpé Minute</span>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xs border border-solly-border">
              <Image
                src="/images/solly-assets/04-charcuterie/aperitif-gourmand.png"
                alt="Bar à charcuterie pour cocktail d'entreprise"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">Bar Salé & Charcuterie</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FORMULAIRE B2B */}
      <section id="formulaire-pro" className="py-16 sm:py-24 bg-white border-t border-solly-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-solly-pink-soft text-solly-pink border border-solly-pink/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Devis & Échange personnalisé
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-solly-charcoal tracking-tight">
              Vous avez un projet ? Parlons-en.
            </h2>
            <p className="mt-2.5 text-xs sm:text-base text-solly-muted font-medium max-w-lg mx-auto">
              Remplissez ce court formulaire. Notre équipe dédiée vous recontacte rapidement avec une proposition adaptée à votre cahier des charges.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#FFF4F7] border border-solly-pink/30 rounded-[28px] p-6 sm:p-10 text-center space-y-4 shadow-solly-card"
              >
                <div className="w-16 h-16 rounded-full bg-white border-2 border-solly-pink flex items-center justify-center text-solly-pink mx-auto shadow-2xs">
                  <CheckCircle2 className="w-9 h-9 text-solly-pink" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-solly-pink">
                    Merci ✨
                  </h3>
                  <p className="text-sm sm:text-base text-solly-charcoal font-semibold max-w-md mx-auto leading-relaxed">
                    Notre équipe vous recontacte pour construire une proposition adaptée à votre projet.
                  </p>
                  <p className="text-xs text-solly-muted font-mono pt-1">
                    Référence : #{refId}
                  </p>
                </div>

                <div className="pt-3 max-w-sm mx-auto space-y-2.5">
                  <a
                    href={getB2BWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-display font-bold text-sm sm:text-base shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                    <span>Poursuivre directement sur WhatsApp</span>
                  </a>

                  <Link
                    href="/"
                    className="block w-full py-3 px-6 rounded-full bg-white hover:bg-solly-cream border border-solly-border text-solly-charcoal font-bold text-xs transition-colors"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#FAF7F2] border border-solly-border rounded-[28px] p-6 sm:p-8 shadow-solly-card space-y-5"
              >
                {/* Entreprise & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                      Entreprise / Marque <span className="text-solly-pink">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => {
                          setFormData({ ...formData, company: e.target.value });
                          setErrors({ ...errors, company: '' });
                        }}
                        placeholder="Ex: Agence Horizon, Orange, Groupe X..."
                        className="w-full bg-white border border-solly-border rounded-2xl pl-10 pr-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                      />
                      <Building2 className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.company && (
                      <p className="text-[11px] text-red-500 font-bold mt-1">{errors.company}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                      Nom du contact <span className="text-solly-pink">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => {
                        setFormData({ ...formData, contactName: e.target.value });
                        setErrors({ ...errors, contactName: '' });
                      }}
                      placeholder="Prénom et nom"
                      className="w-full bg-white border border-solly-border rounded-2xl px-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                    />
                    {errors.contactName && (
                      <p className="text-[11px] text-red-500 font-bold mt-1">{errors.contactName}</p>
                    )}
                  </div>
                </div>

                {/* Téléphone WhatsApp & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                      Téléphone / WhatsApp <span className="text-solly-pink">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative shrink-0 w-[92px]">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                          className="w-full bg-white border border-solly-border rounded-2xl pl-2 pr-6 py-3 text-xs font-bold text-solly-charcoal appearance-none focus:outline-none focus:border-solly-pink/60 cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.country} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-solly-charcoal/60 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <div className="relative flex-1">
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            setErrors({ ...errors, phone: '' });
                          }}
                          placeholder="77 000 00 00"
                          className="w-full bg-white border border-solly-border rounded-2xl pl-10 pr-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                        />
                        <Phone className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-red-500 font-bold mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                      Email professionnel <span className="text-solly-pink">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setErrors({ ...errors, email: '' });
                        }}
                        placeholder="contact@entreprise.com"
                        className="w-full bg-white border border-solly-border rounded-2xl pl-10 pr-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                      />
                      <Mail className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-500 font-bold mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Type de projet & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                      Type de projet
                    </label>
                    <div className="relative">
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full bg-white border border-solly-border rounded-2xl px-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold appearance-none focus:outline-none focus:border-solly-pink/60 cursor-pointer"
                      >
                        {PROJECT_TYPES.map((t) => (
                          <option key={t.label} value={t.label}>
                            {t.label}
                          </option>
                        ))}
                        <option value="Autre format sur mesure">Autre format sur mesure</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-solly-charcoal/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                      Date envisagée
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full bg-white border border-solly-border rounded-2xl px-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60"
                      />
                      <Calendar className="w-4 h-4 text-solly-charcoal/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Nombre approximatif de personnes */}
                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                    Nombre approximatif de personnes
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    placeholder="Ex: 50, 100, 250..."
                    className="w-full bg-white border border-solly-border rounded-2xl px-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60"
                  />
                </div>

                {/* Expériences Solly qui vous intéressent */}
                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-2">
                    Expériences Solly qui vous intéressent :
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {EXPERIENCES_OPTIONS.map((exp) => {
                      const isSelected = formData.selectedExperiences.includes(exp.id);
                      return (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => toggleExperience(exp.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-solly-pink-soft text-solly-pink border-solly-pink'
                              : 'bg-white text-solly-charcoal border-solly-border hover:border-solly-pink/40'
                          }`}
                        >
                          <span>{exp.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-solly-pink shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message / description rapide */}
                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                    Message / description rapide du projet
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Lieu de l’événement, durée, objectifs particuliers ou attentes spécifiques..."
                    className="w-full bg-white border border-solly-border rounded-2xl p-3.5 text-base sm:text-sm text-solly-charcoal font-medium focus:outline-none focus:border-solly-pink/60 resize-none"
                  />
                </div>

                {/* Bouton Envoyer ma demande */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 rounded-full bg-solly-pink text-white font-display font-bold text-base hover:bg-solly-pink/90 shadow-solly-pink transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Envoi de votre demande...</span>
                      </>
                    ) : (
                      <>
                        <span>Envoyer ma demande</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-solly-muted text-center mt-2.5">
                    Notre équipe traite votre demande sous 24h ouvrées. Sans engagement.
                  </p>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
