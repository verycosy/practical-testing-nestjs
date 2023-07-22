import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class TestUtil {
  static async sleep(ms: number) {
    return await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  static getServer(app: INestApplication) {
    return request(app.getHttpServer());
  }

  static expectResponse(
    response: request.Response,
    statusCode: number,
    partialBody?: object,
  ) {
    expect(response.statusCode).toBe(statusCode);

    if (partialBody) {
      expect(response.body).toMatchObject(partialBody);
    }
  }
}
