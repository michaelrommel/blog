import { db } from '$lib/server/keydb';
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

const cache1 = {
	time: 0,
	data: null
};
const cache2 = {
	time: 0,
	data: null
};

async function getTotalPerCountry(r) {
	const now = Date.now() / 1000;
	let totalPerCountry = [];
	if (!cache2.data || now - cache2.time > 24 * 3600) {
		for (const cc of countrylist) {
			let no_of_hackers = await r.scard(`f2b:${cc}`);
			if (no_of_hackers > 0) {
				totalPerCountry.push({
					country: cc,
					hackers: no_of_hackers
				});
			}
		}
		cache2.data = totalPerCountry;
		cache2.time = now;
		return totalPerCountry;
	} else {
		return cache2.data;
	}
}

async function getWeekData(r) {
	const past = (n) => {
		let d = new Date();
		d.setDate(d.getDate() - Math.abs(n));
		return d;
	};

	const now = Date.now() / 1000;
	let perCountry = [];
	let perJail = [];
	if (!cache1.data || now - cache1.time > 600) {
		for (let n = 7; n >= 0; n--) {
			const day = past(n);
			let shortDate = format(day, 'yyyy-MM-dd');
			let fullDate = day.toISOString();
			let countryhacks = { day: fullDate };
			let jailhacks = { day: fullDate };
			let total = await r.scard(`f2b:${shortDate}`);
			if (total > 100) {
				// let's skip all the individual requests
				countryhacks[total.toString()] = 10;
				jailhacks[total.toString()] = 10;
			} else {
				let bans = await r.smembers(`f2b:${shortDate}`);
				// console.log(`day: ${shortDate}, bans: ${JSON.stringify(bans)}`);
				for (const banid of bans) {
					const ban = await r.hgetall(`f2b:${banid}`);
					countryhacks[ban.country] = (countryhacks[ban.country] ?? 0) + 1;
					jailhacks[ban.jail] = (jailhacks[ban.jail] ?? 0) + 1;
				}
			}
			perCountry.push(countryhacks);
			perJail.push(jailhacks);
		}
		cache1.data = [perCountry, perJail];
		cache1.time = now;
		return [perCountry, perJail];
	} else {
		return cache1.data;
	}
}

export async function GET() {
	const [perCountry, perJail] = await getWeekData(db);
	const totalPerCountry = await getTotalPerCountry(db);

	db.disconnect();

	return json({
		perCountry,
		perJail,
		totalPerCountry
	});
}
