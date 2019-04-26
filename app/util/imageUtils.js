import path from 'path';
import { APP_ROOT_DIR, PATH_TO_WATER_MARK_LOGO } from './constant';

export function getWaterMarkImagePath() {
    return path.resolve(APP_ROOT_DIR, PATH_TO_WATER_MARK_LOGO);
}