import { RuleType, Spectral } from '../../../spectral';
import * as ruleset from '../ruleset.json';

describe('host-not-example', () => {
  const s = new Spectral();
  s.addRules({
    'host-not-example': Object.assign(ruleset.rules['host-not-example'], {
      enabled: true,
      type: RuleType[ruleset.rules['host-not-example'].type],
    }),
  });

  test('validate a correct object', async () => {
    const results = await s.run({
      swagger: '2.0',
      paths: {},
      host: 'stoplight.io',
    });
    expect(results.length).toEqual(0);
  });

  test('return errors if server is example.com', async () => {
    const results = await s.run({
      swagger: '2.0',
      paths: {},
      host: 'https://example.com',
    });
    expect(results).toMatchSnapshot();
  });
});