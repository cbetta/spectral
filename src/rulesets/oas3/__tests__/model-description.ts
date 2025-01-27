import { DiagnosticSeverity } from '@stoplight/types';
import { RuleType, Spectral } from '../../../spectral';
import * as ruleset from '../index.json';

describe('model-description', () => {
  const s = new Spectral();
  s.addRules({
    'model-description': Object.assign(ruleset.rules['model-description'], {
      recommended: true,
      type: RuleType[ruleset.rules['model-description'].type],
    }),
  });

  test('validate a correct object', async () => {
    const results = await s.run({
      openapi: '3.0.0',
      paths: {},
      components: {
        schemas: {
          user: {
            description: 'this describes the user model',
          },
        },
      },
    });
    expect(results.length).toEqual(0);
  });

  test('return errors if a definition is missing description', async () => {
    const results = await s.run({
      openapi: '3.0.0',
      paths: {},
      components: {
        schemas: {
          user: {},
        },
      },
    });
    expect(results).toEqual([
      {
        code: 'model-description',
        message: 'Model `description` must be present and non-empty string.',
        path: ['components', 'schemas', 'user', 'description'],
        range: {
          end: {
            character: 16,
            line: 5,
          },
          start: {
            character: 13,
            line: 5,
          },
        },
        severity: DiagnosticSeverity.Warning,
      },
    ]);
  });
});
