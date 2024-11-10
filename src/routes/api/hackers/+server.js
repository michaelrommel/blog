import { Redis } from 'ioredis';
import { json } from '@sveltejs/kit';
import { format } from 'date-fns';

const countrylist = [
	// {{{
	'PS',
	'BD',
	'BE',
	'MY',
	'VE',
	'PK',
	'SL',
	'LV',
	'PA',
	'PL',
	'UY',
	'AT',
	'IT',
	'CH',
	'DZ',
	'BO',
	'AM',
	'NZ',
	'ME',
	'DM',
	'BY',
	'BJ',
	'CO',
	'RE',
	'PT',
	'CL',
	'IR',
	'SE',
	'PF',
	'TG',
	'PH',
	'SY',
	'LB',
	'AR',
	'KG',
	'RW',
	'NO',
	'UA',
	'TJ',
	'IE',
	'KH',
	'CG',
	'HN',
	'BG',
	'AO',
	'JP',
	'MV',
	'MM',
	'TR',
	'JO',
	'RS',
	'AZ',
	'MA',
	'MD',
	'ZA',
	'TT',
	'TH',
	'TN',
	'UG',
	'CZ',
	'ST',
	'SG',
	'BR',
	'GQ',
	'ET',
	'PY',
	'TW',
	'CA',
	'BB',
	'SZ',
	'FR',
	'AE',
	'LK',
	'LT',
	'GA',
	'SA',
	'EG',
	'LS',
	'HU',
	'KE',
	'MX',
	'RU',
	'GT',
	'ZM',
	'AL',
	'GE',
	'BA',
	'MU',
	'ES',
	'BT',
	'AG',
	'GH',
	'SN',
	'AU',
	'LY',
	'MO',
	'DK',
	'CN',
	'PR',
	'IN',
	'KZ',
	'NL',
	'IQ',
	'HR',
	'MT',
	'DO',
	'CM',
	'DE',
	'NI',
	'EC',
	'BF',
	'UZ',
	'SI',
	'HK',
	'GR',
	'VN',
	'KR',
	'NP',
	'NG',
	'SC',
	'GN',
	'PE',
	'CI',
	'US',
	'NA',
	'ZW',
	'MK',
	'BW',
	'RO',
	'ID',
	'TZ',
	'GM',
	'LA',
	'FI',
	'IL',
	'EE',
	'KW',
	'GB'
	// }}}
];

export async function GET({ url, params }) {
	const r = new Redis('192.168.30.1');
	const perCountry = [];
	const perJail = [];
	const past = (n) => {
		let d = new Date();
		d.setDate(d.getDate() - Math.abs(n));
		return d;
	};
	const countrySet = new Set();
	const jailSet = new Set();
	for (let n = 7; n >= 0; n--) {
		const day = past(n);
		let shortDate = format(day, 'yyyy-MM-dd');
		let fullDate = day.toISOString();
		console.log(day);
		let countryhacks = { day: fullDate };
		let jailhacks = { day: fullDate };
		let total = await r.scard(`f2b:${shortDate}`);
		if (total > 100) {
			// let's skip all the individual requests
			countrySet.add(total.toString());
			countryhacks[total.toString()] = 10;
			jailSet.add(total.toString());
			jailhacks[total.toString()] = 10;
		} else {
			let bans = await r.smembers(`f2b:${shortDate}`);
			console.log(`day: ${shortDate}, bans: ${JSON.stringify(bans)}`);
			for (const banid of bans) {
				const ban = await r.hgetall(`f2b:${banid}`);
				console.log(`ban: ${JSON.stringify(ban)}, cc: ${ban.country}`);
				countrySet.add(ban.country);
				if (countryhacks[ban.country] !== undefined) {
					countryhacks[ban.country] += 1;
				} else {
					countryhacks[ban.country] = 1;
				}
				jailSet.add(ban.jail);
				if (jailhacks[ban.jail] !== undefined) {
					jailhacks[ban.jail] += 1;
				} else {
					jailhacks[ban.jail] = 1;
				}
			}
		}
		perCountry.push(countryhacks);
		perJail.push(jailhacks);
	}
	for (const day of perCountry) {
		const seenCountries = Object.keys(day);
		countrySet.forEach((cc) => {
			if (!seenCountries.includes(cc)) {
				day[cc] = 0;
			}
		});
	}
	for (const day of perJail) {
		const seenJails = Object.keys(day);
		jailSet.forEach((j) => {
			if (!seenJails.includes(j)) {
				day[j] = 0;
			}
		});
	}
	// for (const cc of countrylist) {
	// 	console.log(`f2b:${cc}`);
	// 	let no_of_hackers = await r.scard(`f2b:${cc}`);
	// 	console.log(`country: ${cc}, hackers: ${JSON.stringify(no_of_hackers)}`);
	// 	data.push({
	// 		day: '2024-11-10',
	// 		country: cc,
	// 		hackers: no_of_hackers
	// 	});
	// }
	return json({
		perCountry,
		perJail
	});
}
