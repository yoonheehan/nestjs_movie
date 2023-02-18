import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      // 클라에서 보낸 데이터 요소 중에 dto에 필요없는 것은 넣질 않는다.
      whitelist: true,
      // 클라에서 보낸 데이터 요소중에 없는 것을 명시한다.
      forbidNonWhitelisted: true,
      // 들어오는 param 형태를 string이 아닌 number로 들어오게 한다.
      transform: true,
    }));
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my Movie API');
  });

  describe("/movies", () => {
    it("GET", () => {
      return request(app.getHttpServer())
      .get("/movies")
      .expect(200)
      .expect([]);
    });

    it("POST 201", () => {
      return request(app.getHttpServer())
      .post("/movies")
      .send({
        title: "Test Movie",
        genres: ['test'],
        year: 2000,
      })
      .expect(201);
    });

    it("POST 400", () => {
      return request(app.getHttpServer())
      .post("/movies")
      .send({
        title: "Test Movie",
        genres: ['test'],
        year: 2000,
        other: "thing"
      })
      .expect(400);
    });

    it("DELETE", () => {
      return request(app.getHttpServer())
      .delete("/movies")
      .expect(404);
    });

  });

  describe("/movies/:id", () => {
    it("GET 200", () => {
      return request(app.getHttpServer())
      .get("/movies/1")
      .expect(200);
    });
    it("GET 404", () => {
      return request(app.getHttpServer())
      .get("/movies/999")
      .expect(404);
    });
    it("PATCH 200", () => {
      return request(app.getHttpServer())
      .patch("/movies/1")
      .send({title: "updated Test"})
      .expect(200);
    });
    it("DELETE 200", () => {
      return request(app.getHttpServer())
      .delete("/movies/1")
      .expect(200);
    });
  })
  
});
