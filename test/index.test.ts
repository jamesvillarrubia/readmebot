/** AUTO-SUMMARY **
   Purpose: This file serves as a command-line interface (CLI) for the project, allowing users to execute the generator functionality from the terminal.

   Key Components:
   - `Command`: Imported from the 'commander' package to handle CLI commands and options.
   - `Generator`: Imported from the local module to handle the generation process.

   Functional Overview: The file sets up a CLI tool using the 'commander' package, defines the version of the tool, and specifies an action that initializes and runs the `Generator` when the CLI command is executed.

   Dependencies and Integrations: Depends on the 'commander' package for CLI functionality and the `Generator` class from the local project to perform the generation tasks.

   Additional Context: This CLI setup is typically used to provide a user-friendly way to interact with the functionalities of the project directly from the command line, enhancing usability and accessibility.
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
