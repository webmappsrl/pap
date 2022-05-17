import * as fromSettings from './settings.actions';

describe('loadSettingss', () => {
  it('should return an action', () => {
    expect(fromSettings.loadSettingss().type).toBe('[Settings] Load Settingss');
  });
});
