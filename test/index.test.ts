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
