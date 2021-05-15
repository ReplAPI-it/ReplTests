> Part of the [ReplAPI.it Project](https://replit.com/@ReplAPIit)

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


# ReplTest
ReplTest is a simple API that will fetch Unit Tests for available Repls and setup files that you can download and run instantly!

## Usage
The API can be found at:
`https:/testsapi.replapiit.repl.co`

Available Endpoints include:
* `/{username}/{repl-slug}?testname={testname}`

The output is a zipfile containing all of your tests, ready to use in their specific environments.  
*Note*: You are able to fetch specified files with the `?testname=` parameter at the end of your url.

## Examples
Fetching: `https://testsapi.replapiit.repl.co/HelperFurret/Example-Project-with-Unit-Tests-Node`  
Returns:
```txt
example-project-with-unit-tests-node.zip
```

Fetching: `https://testsapi.replapiit.repl.co/HelperFurret/Example-Project-with-Unit-Tests-Python?filename=ExampleTest1`  
Returns:
```txt
# Test 33190: ExampleTest1
# Run this file using unittest
# https://docs.python.org/3/library/unittest.html

import unittest
from main import *
from add import *

def setUpModule:
	print('Setup!')
	
def tearDownModule:
	print('Teardown!')

class UnitTest(unittest.TestCase):

	def setUp(self):
		super(UnitTest, self).setUp()
		setUpModule()

	def test_exampletest1(self):
		self.assertEquals(add(1, 2), 3)

	def tearDown(self):
		super(UnitTest, self).tearDown()
		tearDownModule()

if __name__ == '__main__':
    unittest.main()
```

[contributors-shield]: https://img.shields.io/github/contributors/ReplAPI-it/ReplTests.svg?style=for-the-badge
[contributors-url]: https://github.com/ReplAPI-it/ReplTests/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ReplAPI-its/ReplTest.svg?style=for-the-badge
[forks-url]: https://github.com/ReplAPI-it/ReplTests/network/members
[stars-shield]: https://img.shields.io/github/stars/ReplAPI-it/ReplTests.svg?style=for-the-badge
[stars-url]: https://github.com/ReplAPI-it/ReplTests/stargazers
[issues-shield]: https://img.shields.io/github/issues/ReplAPI-it/ReplTests.svg?style=for-the-badge
[issues-url]: https://github.com/ReplAPI-it/ReplTests/issues
[license-shield]: https://img.shields.io/github/license/ReplAPI-it/ReplTests.svg?style=for-the-badge
[license-url]: https://github.com/ReplAPI-it/ReplTests/blob/master/LICENSE.txt
