// The doctor as search engines read it (schema.org), from the confirmed site content only.
export const physicianData = (doctor, siteUrl) => ({
  '@context': 'https://schema.org',
  '@type': 'Physician',
  name: doctor.name,
  alternateName: doctor.knownAs,
  medicalSpecialty: 'Otolaryngologic',
  url: siteUrl,
});
