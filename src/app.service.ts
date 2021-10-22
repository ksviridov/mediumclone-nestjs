import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // return 'Hello World!';
    return `
    <div style="width: 700px; height: 900px;" >
      <iframe src="https://unicornhunters.com/" width="100%" height="100%"></iframe>
    </div>
    `;
  }
}
