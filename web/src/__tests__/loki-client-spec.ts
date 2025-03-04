import { getFetchConfig } from '../loki-client';

describe('Loki Client', () => {
  it('should generate a valid config', () => {
    expect(getFetchConfig({ config: undefined, tenant: 'application' })).toEqual({
      endpoint: '/api/proxy/plugin/logging-view-plugin/backend/api/logs/v1/application',
    });
    expect(getFetchConfig({ config: { useTenantInHeader: true }, tenant: 'application' })).toEqual({
      endpoint: '/api/proxy/plugin/logging-view-plugin/backend',
      requestInit: { headers: { 'X-Scope-OrgID': 'application' } },
    });
    expect(
      getFetchConfig({ config: { useTenantInHeader: false }, tenant: 'infrastructure' }),
    ).toEqual({
      endpoint: '/api/proxy/plugin/logging-view-plugin/backend/api/logs/v1/infrastructure',
    });
  });
});
