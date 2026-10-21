import { InMemoryRegistrationGateway } from './InMemoryRegistrationGateway';

describe('Registro · adaptador en memoria', () => {
  it('resuelve una simulación sin recibir ni guardar datos personales', async () => {
    const gateway = new InMemoryRegistrationGateway(0);
    await expect(gateway.simulate()).resolves.toBeUndefined();
    expect(Object.keys(gateway)).not.toContain('values');
  });

  it('permite simular un rechazo determinista', async () => {
    const gateway = new InMemoryRegistrationGateway(0, true);
    await expect(gateway.simulate()).rejects.toThrow('Simulated registration failure');
  });
});
