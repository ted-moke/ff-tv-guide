import { SleeperService } from "./sleeperService";
import { FleaflickerService } from "./fleaflickerService";

export class PlatformServiceFactory {
  private static sleeperService: SleeperService;
  private static fleaflickerService: FleaflickerService;

  static getService(platformId: string) {
    switch (platformId) {
      case "sleeper":
        if (!this.sleeperService) {
          this.sleeperService = SleeperService.getInstance();
        }
        return this.sleeperService;
      case "fleaflicker":
        if (!this.fleaflickerService) {
          this.fleaflickerService = FleaflickerService.getInstance();
        }
        return this.fleaflickerService;
      default:
        throw new Error(`Unsupported platform: ${platformId}`);
    }
  }
}