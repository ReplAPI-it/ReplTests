import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import AdmZip from 'adm-zip';
import ReplAPI from 'replapi-it';
import { nanoid } from 'nanoid';

const replapi = ReplAPI({
	username: 'ReplAPIit',
});

async function unitTestNode(tmpPath, unitTests) {
	if (!fs.existsSync(tmpPath)) {
		fs.mkdirSync(tmpPath);
	} else if (fs.readdirSync(tmpPath).length > 0) {
		rimraf(tmpPath, () => {
			fs.mkdirSync(tmpPath);
		});
	}

	unitTests.tests.forEach((test) => {
		if (
			!fs.existsSync(path.join(tmpPath, `${test.name.toLowerCase()}.test.js`))
		) {
			fs.writeFileSync(
				path.join(tmpPath, `${test.name.toLowerCase()}.test.js`),
				`// Test ${test.id}: ${test.name}
// Run this file using Jest
// https://jestjs.io/docs/getting-started

const index = require('./index.js');
${unitTests.meta?.imports?.trim() || ''}

beforeEach(() => {
	${unitTests.meta?.setup?.trim() || ''}
});

afterEach(() => {
	${unitTests.meta?.tearDown?.trim() || ''}
});

test('${test.name}', () => {
	${test.code.trim()}
});
`,
				{ encoding: 'utf8' }
			);
		}
	});
}

async function unitTestPython(tmpPath, unitTests) {
	if (!fs.existsSync(tmpPath)) {
		fs.mkdirSync(tmpPath);
	} else if (fs.readdirSync(tmpPath).length > 0) {
		rimraf(tmpPath, () => {
			fs.mkdirSync(tmpPath);
		});
	}

	unitTests.tests.forEach((test) => {
		if (
			!fs.existsSync(path.join(tmpPath, `${test.name.toLowerCase()}.test.py`))
		) {
			fs.writeFileSync(
				path.join(tmpPath, `${test.name.toLowerCase()}.test.py`),
				`# Test ${test.id}: ${test.name}
# Run this file using unittest
# https://docs.python.org/3/library/unittest.html

import unittest
from main import *
${unitTests.meta?.imports?.trim() || ''}

def setUpModule:
	${unitTests.meta?.setup?.trim() || ''}
	
def tearDownModule:
	${unitTests.meta?.tearDown?.trim() || ''}

class UnitTest(unittest.TestCase):

	def setUp(self):
		super(UnitTest, self).setUp()
		setUpModule()

	def test_${test.name.toLowerCase()}(self):
		${test.code.trim()}

	def tearDown(self):
		super(UnitTest, self).tearDown()
		tearDownModule()

if __name__ == '__main__':
    unittest.main()
`,
				{ encoding: 'utf8' }
			);
		}
	});
}

async function unitTestJava(tmpPath, unitTests) {
	if (!fs.existsSync(tmpPath)) {
		fs.mkdirSync(tmpPath);
	} else if (fs.readdirSync(tmpPath).length > 0) {
		rimraf(tmpPath, () => {
			fs.mkdirSync(tmpPath);
		});
	}

	unitTests.tests.forEach((test) => {
		if (
			!fs.existsSync(path.join(tmpPath, `${test.name.toLowerCase()}.test.java`))
		) {
			fs.writeFileSync(
				path.join(tmpPath, `${test.name.toLowerCase()}.test.java`),
				`// Test ${test.id}: ${test.name}
// Run this file using JUnit
// https://junit.org/junit5/docs/current/user-guide/

import org.junit.Before;
import org.junit.After;
import org.junit.Test;
import static org.junit.Assert.*;
${unitTests.meta?.imports?.trim() || ''}

class StandardTests {

	@BeforeEach
	void init() {
		${unitTests.meta?.setup?.trim() || ''}
	}

	@Test
	void test${test.name.toLowerCase()}() {
		${test.code.trim()}
	}

	@AfterEach
	void tearDown() {
		${unitTests.meta?.tearDown?.trim() || ''}
	}
}
`,
				{ encoding: 'utf8' }
			);
		}
	});
}

export default async function testsAPI(username, slug) {
	const myRepl = new replapi.Repl(username, slug);
	const { language, unitTests } =
		await myRepl.replGraphQLData();
	if (unitTests !== null) {
		const tmpPath = path.join(process.cwd(), nanoid());
		switch(language) {
			case 'nodejs': 
				unitTestNode(tmpPath, unitTests);
				break;
			case 'python3':
				unitTestPython(tmpPath, unitTests);
				break;
			case 'java10':
				unitTestJava(tmpPath, unitTests);
				break;
			default:
				return JSON.stringify({ error: `Unit Testing not available for ${language} repls.` });
				break;
		}
		const zip = new AdmZip();
		zip.addLocalFolder(tmpPath);
		zip.writeZip(
			path.join(process.cwd(), `${slug.toLowerCase()}.zip`)
		);
		rimraf(tmpPath, () => {});
	} else {
		return JSON.stringify({ error: 'No Unit Testing on Specified Repl.' });
	}
	return [true, language];
}
