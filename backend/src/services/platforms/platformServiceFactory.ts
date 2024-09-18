import { SleeperService } from "./sleeperService";
import { FleaflickerService } from "./fleaflickerService";

export class PlatformServiceFactory {
  static getService(platformId: string) {
    switch (platformId) {
      case "sleeper":
        return new SleeperService();
      case "fleaflicker":
        return new FleaflickerService();
      default:
        throw new Error(`Unsupported platform: ${platformId}`);
    }
  }
}
