import {expect} from 'chai';
import Client, {CLIENT_CONFIG_DEFAULTS} from '../src/Client';
import Connection from '../src/Connection';
import {CLIENT_STATES, CLIENT_EVENTS} from '../src/Constants';

function createClient() {
  return new Client({url: 'http://signalr.pwnt.co:1984/raw-connection', transport: 'LongPollingTransport'});
}

describe('LongPollingTransport', function() {
  this.timeout(15000);

  it('Can connect to the server', function(done) {
    createClient()
      .start()
      .then(client => {
        expect(client.state).to.be.equal(CLIENT_STATES.connected);
        done();
      });
  });

  it('Sends the test message', function(done) {
    createClient()
      .start()
      .then(client => client.connection.transport._send({type: 1, value: 'Jack Sparrow!'}))
      .then(() => done());
  });

  //it('Can process recieved message', function() {
  //  const connection = new Connection(createClient());
  //  const testMessage = {
  //    C: 25,
  //    M: {type: 1, value: 'poopypants'},
  //    S: true,
  //    T: false,
  //    L: 1000,
  //    G: 'help'
  //  };
  //
  //  connection._processMessages(testMessage);
  //  expect(connection._lastMessages).to.have.length(1);
  //});

  it('Has a valid GroupsToken', function(done) {
    createClient()
      .start()
      .then(client => client.connection.transport._send({type: 4, value: 'Black Beards Crew'}))
      .then(() => done());
  });

  it('Successfully disconnected from server', function(done) {
    createClient()
      .start()
      .then(client => {
        expect(client.state).to.be.equal(CLIENT_STATES.connected);
        setTimeout(() => {
          debugger;
          client.connection.transport.stop();
          expect(client.state).to.be.equal(CLIENT_STATES.disconnected);
          setTimeout(() => done(), 1000);
        }, 500);
      });
  })
});

