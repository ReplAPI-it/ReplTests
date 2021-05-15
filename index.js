import path from 'path';
import rimraf from 'rimraf';
import AdmZip from 'adm-zip';
import express from 'express';
import rateLimit from 'express-rate-limit';
import testsAPI from './utils/testsAPI.js';

const app = express();

app.use(
	'/*',
	rateLimit({
		windowMs: 5 * 60 * 1000,
		max: 100,
	})
);

app.get('/', (req, res) => {
	res.end('Send Get Requests to `/[username]/[slug]`');
});

app.get('/:username/:slug', async (req, res) => {
	const { username, slug } = req.params;
	const { testname } = req.query;
	const result = await testsAPI(username, slug);
	if(result[0] === true) {
		if(testname) {
			const zipPath = path.join(process.cwd(), `${slug.toLowerCase()}.zip`)
			const zip = new AdmZip(zipPath);
			const entry = zip.getEntry(`${testname.toLowerCase()}.test.${result[1] === 'nodejs' ? 'js' : result[1] === 'python3' ? 'py' : 'java'}`);
			
			res.end(zip.readAsText(entry));
			rimraf(zipPath, () => {});
		} else {
			const zipPath = path.join(process.cwd(), `${slug.toLowerCase()}.zip`)
			res.download(zipPath);
			rimraf(zipPath, () => {});
		}
	} else {
		res.end(result);
	}
});

app.listen(3000);
