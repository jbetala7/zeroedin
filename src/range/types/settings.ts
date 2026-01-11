export type PreloaderType = 'scope' | 'rifle' | 'range' | 'calibration';

export interface GameSettings {
  preloader: PreloaderType;
}

export const DEFAULT_SETTINGS: GameSettings = {
  preloader: 'scope',
};

export const PRELOADER_INFO: Record<PreloaderType, { name: string; description: string }> = {
  scope: {
    name: 'Rifle Scope',
    description: 'Focus through a sniper scope',
  },
  rifle: {
    name: 'Air Rifle',
    description: 'Pump up the pressure',
  },
  range: {
    name: 'Range Setup',
    description: 'Prepare the shooting range',
  },
  calibration: {
    name: 'Calibration',
    description: 'Zero in your optics',
  },
};
