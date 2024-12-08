---
thumbnailUrl: "/articles/assets/2022-01-27-code-sample/thumbnail.png"
thumbnailTitle: "Icon showing a code snippet"
structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { 
        "@type": "Person", 
        "name": "Michael Rommel",
        "url": "https://michaelrommel.com/info/about",
        "image": "https://avatars.githubusercontent.com/u/919935?s=100&v=4"
    },
    "dateModified": "2022-01-27T13:10:45+01:00",
    "datePublished": "2022-01-27T13:10:45+01:00",
    "headline": "Markdown Code Sample Page",
    "abstract": "Showcasing a code fragment with syntax & line highlighting, as well as ligatures."
}
tags: ["locked", "create", "code"]
published: true
---

# Here is a code sample

These introduction sentences do not make any sense, they are just for testing ligatures.

> Those are just affectionate pearls of flawless, infinite wisdom strung together offhand
like surfboards drawn in a raffle.

Believing in them would be a futile affair,
like creating an offbeat, flickering light in a flux compensator, carried firmly
on the back of a leafhopper to a difficult cliffhanger in a Norwegian fjord.


```javascript
'use strict';

import forge from 'node-forge';

export const validateCertificate = async (pem, verified) => {
	if (verified !== 'SUCCESS') {
		throw new Error('certificate not valid');
	}
	const cert = forge.pki.certificateFromPem(pem); // [!code highlight]
	const altNames = cert
		.getExtension('subjectAltName')
		.altNames.flatMap((alt) => {
			// only altNames of type DNS=2 are valid and wildcard
			// domains shall be removed
			// if ((alt.type === 2) && !(alt.value.match(/^\*\./))) {
			if (alt.type === 2) {
				return alt.value;
			} else {
				return null;
			}
		});
	const allNames = getUniqueNames(cert, altNames);

	const cred = {
		sub: null,
		err: false,
		msg: true,
		cert: cert,
		skid: cert.getExtension('subjectKeyIdentifier').subjectKeyIdentifier
	};
	if (!allNames) {
		cred.read = ['certs'];
		cred.write = allNames.map((san) => {
			// check, escape and convert into regex
			const valid = /^[-a-zA-Z0-9*.]+$/;
			if (!valid.test(san)) {
				throw new Error('invalid san names in certificate');
			}
			const escdot = /\./g;
			san = san.replace(escdot, '\\.');
			const escstar = /\*/g;
			san = san.replace(escstar, '\\*');
			return `^${san}$`;
		});
	}
	return cred;
};

export const getSubjectKeyIdentifierFromCert = (pem) => {
	const cert = forge.pki.certificateFromPem(pem);
	return cert.getExtension('subjectKeyIdentifier').subjectKeyIdentifier;
};

export const getIdentifiersFromCSR = (pem) => {
	// parse csr and gather all CN and SANs
	const csr = forge.pki.certificationRequestFromPem(pem);
	if (csr.getAttribute({ name: 'extensionRequest' }) === null) {
		throw new Error('CSR contains no extension request');
	}
	const altNames = csr
		.getAttribute({ name: 'extensionRequest' })
		.extensions.filter((e) => e.name === 'subjectAltName')
		.map((e) =>
			e.altNames.map((alt) => {
				// only altNames of type DNS=2 are valid
				if (alt.type === 2) {
					return alt.value;
				} else {
					return null;
				}
			})
		)
		.flat();
	return getUniqueNames(csr, altNames);
};

export const getCommonNameFromCSR = (pem) => {
	const csr = forge.pki.certificationRequestFromPem(pem);
	return getCn(csr);
};

const getUniqueNames = (certOrCsr, altNames) => {
	const commonName = getCn(certOrCsr);
	// check if subjectname is amongst altnames also true if
	// SAN list is empty, e.g. because of wrong types
	if (!altNames.includes(commonName)) {
		throw new Error('common name is not among SANs');
	}
	const csrAllNames = [commonName, ...altNames];
	// reduce to unique values, remove null values
	const csrUniqueNames = csrAllNames.filter(uniqueFilter);
	return csrUniqueNames;
};

const getCn = (certOrCsr) => {
	const commonName = certOrCsr.subject.attributes
		.filter((a) => a.name === 'commonName')
		.map((a) => a.value)
		.flat()[0];
	if (!commonName) {
		throw new Error('cert or CSR contains no common name');
	}
	return commonName;
};

function uniqueFilter(value, index, self) {
	return self.indexOf(value) === index && value !== null;
}
```
