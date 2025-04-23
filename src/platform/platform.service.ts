import { PlatformRepository } from '../shared/repository/platformRepository';

export class PlatformService {
    platformRepository: PlatformRepository;
    constructor(platformRepository: PlatformRepository) {
        this.platformRepository = platformRepository;
    }
}
