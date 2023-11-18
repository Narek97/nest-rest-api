import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  start(): string {
    return `
      <html lang="en">
        <style>
           .server{
               position: absolute;
               top: 50%;
               left: 50%;
               transform: translate(-50%, -50%);
               color: green;
               font-size: 24px;
               text-align: center;
           }
        </style>
        <div class="server">
          <p>
            🙌 Server is running 🙌
          </p>
        </div>
      </html>
    `;
  }
}
