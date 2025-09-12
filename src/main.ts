import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const frontendAppUrl = configService.get("APP_URL", "http://localhost:3000");

  // Enable CORS
  app.enableCors({
    origin: configService.get("CORS_ORIGIN", frontendAppUrl),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global prefix
  app.setGlobalPrefix("api");

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Finesse E-commerce API")
    .setDescription(
      "API documentation for Finesse E-commerce platform built with NestJS"
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = configService.get("PORT", 3000);
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(
    `API Documentation available at: http://localhost:${port}/api/docs`
  );
}

bootstrap();
