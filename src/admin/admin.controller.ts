import { AdminService } from './admin.service';

export class AdminController {
    service: AdminService;
    constructor(service: AdminService) {
        this.service = service;
    }
}
