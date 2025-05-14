import { TradeService } from "../tradeService";
import { FleaflickerTradeService } from "./fleaflickerTradeService";
import { SleeperTradeService } from "./sleeperTradeService";

export class TradeServiceFactory {
  static getTradeService(platformName: string): TradeService {
    switch (platformName.toLowerCase()) {
      case 'sleeper':
        return SleeperTradeService.getInstance();
      case 'fleaflicker':
        return FleaflickerTradeService.getInstance();
      default:
        throw new Error(`Unsupported platform: ${platformName}`);
    }
  }
} 