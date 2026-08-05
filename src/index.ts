export { useDevice } from './useDevice';
export {
  useDeviceType,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
} from './useDeviceType';
export { useOS } from './useOS';
export { detectDevice } from './core/detect';
export { getNavigatorInput } from './core/env';
export type {
  DeviceInfo,
  DeviceType,
  DetectionInput,
  DetectOptions,
  Orientation,
  OS,
  StaticDeviceInfo,
  UADataLike,
} from './types';
