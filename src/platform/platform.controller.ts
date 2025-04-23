import { PlatformService } from './platform.service';

export class PlatformController {
    service: PlatformService;
    constructor(service: PlatformService) {
        this.service = service;
    }
}
