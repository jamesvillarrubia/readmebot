/** AUTO-SUMMARY **
   Purpose: This file is designed to test the `Greeter` class functionality within the project using Mocha and Chai for unit testing.

   Key Components:
   - `Greeter`: Class from the project that generates greeting messages.
   - Testing libraries: Uses `chai` for assertions, `mocha` for structuring tests, `sinon` for spies, and `nock` for mocking HTTP requests.

   Functional Overview: The file includes tests to ensure the `Greeter` class correctly returns a greeting message, verifies that the `greet` method is called the correct number of times, and includes a setup for testing HTTP requests (commented out).

   Dependencies and Integrations: Relies on the `Greeter` class from the project. It uses `chai`, `mocha`, `sinon`, and `nock` for testing functionalities, which are essential for running the tests and ensuring the reliability of the `Greeter` class methods.

   Additional Context: This test suite is crucial for maintaining the reliability of the `Greeter` class as the project evolves, ensuring that changes do not break existing functionality.
*** END-SUMMARY **/

import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import nock from 'nock';
import { Greeter } from '../src/index';

describe('Greeter Class', () => {
  it('should return the correct greeting message', () => {
    const greeter = new Greeter('World');
    expect(greeter.greet()).to.equal('Hello, World!');
  });

  it('should call the greet method once', () => {
    const greeter = new Greeter('World');
    const greetSpy = sinon.spy(greeter, 'greet');
    greeter.greet();
    expect(greetSpy.calledOnce).to.be.true;
  });

  // Example of using nock if your class had an HTTP request
  it('should make an HTTP request', async () => {
    const scope = nock('http://example.com')
      .get('/greet')
      .reply(200, { message: 'Hello, World!' });

    // Assuming your Greeter class had a method that makes an HTTP request
    // const response = await greeter.makeHttpRequest();
    // expect(response.message).to.equal('Hello, World!');

    scope.done();
  });
});
