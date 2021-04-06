import { Message, ReloadMessage, RouterMessage } from '../../src/view/messages/messageTypes';
import { assertType, assertNotType, Equals } from '../testUtils';

describe('Message test', () => {
  it('Message should only contains two properties including one type property', () => {
    const noTypeMessage = {
      payload: '',
    };

    const wrongTypeMessage = {
      type: 'OTHER',
    };

    const extraPropertyMessage = {
      payload: 'ROUTER',
      other: '',
    };

    assertNotType<Equals<typeof noTypeMessage, Message>>();
    assertNotType<Equals<typeof wrongTypeMessage, Message>>();
    assertNotType<Equals<typeof extraPropertyMessage, Message>>();
  });

  it('Router message should contain valid payload', () => {
    const validRouterMessage: RouterMessage = {
      type: 'ROUTER',
      payload: '/overview',
    };

    const noPayloadRouterMessage = {
      type: 'ROUTER',
    };

    const wrongPayloadRouterMessage = {
      type: 'ROUTER',
      payload: '/other',
    };

    assertType<Equals<typeof validRouterMessage, RouterMessage>>();
    assertNotType<Equals<typeof noPayloadRouterMessage, RouterMessage>>();
    assertNotType<Equals<typeof wrongPayloadRouterMessage, RouterMessage>>();

  });

  it('Reload message should only contain type property', () => {
    const validReloadMessage: ReloadMessage = {
      type: 'RELOAD',
    };

    const extraPropertyReloadMessage = {
      type: 'RELOAD',
      payload: true,
    };

    assertType<Equals<typeof validReloadMessage, ReloadMessage>>();
    assertNotType<Equals<typeof extraPropertyReloadMessage, RouterMessage>>();
  });
});
