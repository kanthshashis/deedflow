import { BuyerProfile, EntityType } from "./types";

export interface LegalGrammarTokens {
  partyTitle: string; // "Allottee" | "Allottees"
  partyReference: string; // "the Party of the First Part" | "the Parties of the First Part"
  pronounSubject: string; // "he/she" | "they" | "it"
  pronounPossessive: string; // "his/her" | "their" | "its"
  pronounObject: string; // "him/her" | "them" | "it"
  heirsClause: string;
  representationClause: string;
  singularPluralVerb: (singular: string, plural: string) => string;
}

export function generateLegalGrammar(profile: BuyerProfile): LegalGrammarTokens {
  const { entityType, fullName, coBuyerName, gpaHolderName, gpaDocumentNumber, authorizedSignatoryName, designation } = profile;

  switch (entityType) {
    case "joint":
      return {
        partyTitle: "Allottees",
        partyReference: "the Parties of the Second Part (hereinafter collectively referred to as the 'Allottees')",
        pronounSubject: "they",
        pronounPossessive: "their",
        pronounObject: "them",
        heirsClause: "their respective heirs, legal representatives, executors, administrators, and assigns",
        representationClause: `${fullName} and ${coBuyerName || "Co-Buyer"} (jointly and severally liable)`,
        singularPluralVerb: (_s, p) => p,
      };

    case "nri_gpa":
      return {
        partyTitle: "Allottee",
        partyReference: "the Party of the Second Part (hereinafter referred to as the 'Allottee')",
        pronounSubject: "he/she",
        pronounPossessive: "his/her",
        pronounObject: "him/her",
        heirsClause: "his/her heirs, legal representatives, executors, administrators, and assigns",
        representationClause: `${fullName}, represented herein by his/her duly appointed and constituted General Power of Attorney (GPA) Holder, Mr./Ms. ${gpaHolderName || "[GPA HOLDER NAME]"}, vide registered GPA Document No. ${gpaDocumentNumber || "[GPA DOC NO]"}`,
        singularPluralVerb: (s, _p) => s,
      };

    case "company":
      return {
        partyTitle: "Allottee",
        partyReference: "the Party of the Second Part (hereinafter referred to as the 'Allottee')",
        pronounSubject: "it",
        pronounPossessive: "its",
        pronounObject: "it",
        heirsClause: "its successors-in-interest, liquidators, and permitted assigns",
        representationClause: `${fullName}, a corporate entity incorporated under applicable law, acting through its Authorized Signatory, Mr./Ms. ${authorizedSignatoryName || "[SIGNATORY NAME]"}, ${designation || "Authorized Representative"}, pursuant to Board Resolution dated [BOARD RESOLUTION DATE]`,
        singularPluralVerb: (s, _p) => s,
      };

    case "sole":
    default:
      return {
        partyTitle: "Allottee",
        partyReference: "the Party of the Second Part (hereinafter referred to as the 'Allottee')",
        pronounSubject: "he/she",
        pronounPossessive: "his/her",
        pronounObject: "him/her",
        heirsClause: "his/her heirs, legal representatives, executors, administrators, and assigns",
        representationClause: `${fullName}`,
        singularPluralVerb: (s, _p) => s,
      };
  }
}
