import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
    async upload(file) {
        return file;
    }
}