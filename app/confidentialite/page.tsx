import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Maison de la Famille de St-François",
  description: "Politique de confidentialité et protection des renseignements personnels.",
};

const sectionClass = "space-y-4";
const listClass = "list-disc space-y-2 pl-6";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-16 text-lg">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">Politique de confidentialité</h1>
        <p>Maison de la Famille de St-François</p>
        <p className="text-base">Entrée en vigueur et dernière mise à jour : 20 août 2026</p>
      </header>

      <section className={sectionClass}>
        <h2 className="text-2xl font-bold">Notre engagement</h2>
        <p>
          Nous protégeons les renseignements personnels qui nous sont confiés et limitons leur collecte,
          leur utilisation et leur communication à ce qui est nécessaire pour offrir nos activités, nos
          services et notre milieu de vie familial.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-bold">Renseignements recueillis et raisons de la collecte</h2>
        <ul className={listClass}>
          <li>Coordonnées et messages transmis par le formulaire de contact, afin de répondre à votre demande.</li>
          <li>Adresse courriel et preuve de consentement à l’infolettre, afin de transmettre notre programmation et nos nouvelles.</li>
          <li>Renseignements d’identité, coordonnées et renseignements familiaux nécessaires à l’adhésion et aux inscriptions.</li>
          <li>Renseignements concernant un enfant, sa santé, ses allergies et les contacts d’urgence lorsqu’ils sont nécessaires à une activité ou à la halte-garderie.</li>
          <li>Renseignements liés aux paiements, à l’exclusion des numéros complets de carte, qui sont traités directement par Stripe.</li>
          <li>Données techniques nécessaires à la sécurité, à l’authentification et au fonctionnement du site.</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-bold">Consentement et renseignements concernant les enfants</h2>
        <p>
          Nous demandons un consentement clair lorsque celui-ci est requis. L’inscription d’un enfant doit
          être effectuée par son parent, son tuteur ou une personne autorisée. Les renseignements sensibles
          ne sont utilisés que pour assurer la sécurité, l’accompagnement et la prestation du service demandé.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-bold">Fournisseurs et communication hors Québec</h2>
        <p>
          Pour exploiter le site et fournir nos services, nous utilisons notamment Sanity pour la gestion des
          données, Clerk pour l’authentification, Stripe pour les paiements, Resend pour les courriels et
          l’infolettre, Vercel pour l’hébergement et Google Maps pour la carte. Certains fournisseurs peuvent
          traiter ou conserver des renseignements à l’extérieur du Québec. Nous limitons les renseignements
          transmis à ce qui est nécessaire à leurs fonctions.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-bold">Témoins de connexion et mesure d’audience</h2>
        <p>
          Le site utilise des témoins essentiels au fonctionnement, notamment pour l’authentification et la
          sécurité. Nous n’utilisons actuellement aucun outil publicitaire ni Google Analytics. La carte
          Google Maps peut toutefois être soumise aux pratiques de Google lorsqu’elle est chargée.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-bold">Conservation et sécurité</h2>
        <p>
          Les renseignements sont accessibles uniquement aux personnes qui en ont besoin dans l’exercice de
          leurs fonctions. Ils sont conservés pendant la durée nécessaire aux fins décrites, aux obligations
          légales et à la gestion de nos activités, puis supprimés ou anonymisés de façon sécuritaire lorsque
          leur conservation n’est plus requise.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-bold">Vos droits</h2>
        <p>
          Vous pouvez demander l’accès à vos renseignements, leur rectification, le retrait de votre
          consentement ou formuler une plainte. Le retrait du consentement peut limiter certains services
          lorsque les renseignements sont nécessaires pour les offrir. Chaque infolettre comprendra aussi un
          mécanisme de désabonnement.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-bold">Responsables de la protection des renseignements personnels</h2>
        <p>Judith Ferron et Vicky Blanchard, cogestionnaires</p>
        <address className="not-italic">
          Maison de la Famille de St-François<br />
          8190, boulevard Lévesque Est, Laval (Québec) H7A 1V4<br />
          Téléphone : <a className="underline" href="tel:+14506656510">450-665-6510</a><br />
          Courriels : <a className="underline" href="mailto:coordorh@maisonfamillestfrancois.com">coordorh@maisonfamillestfrancois.com</a>{" "}
          et <a className="underline" href="mailto:coordofinances@maisonfamillestfrancois.com">coordofinances@maisonfamillestfrancois.com</a>
        </address>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-bold">Modifications et questions</h2>
        <p>
          Nous publierons toute modification importante sur cette page avec sa date de mise à jour. Pour une
          question générale, vous pouvez aussi utiliser notre <Link href="/contact" className="underline">formulaire de contact</Link>.
        </p>
      </section>
    </main>
  );
}
