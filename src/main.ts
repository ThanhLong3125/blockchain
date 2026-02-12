import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Blockchain API')
    .setDescription('API documentation for Blockchain system')
    .setVersion('1.0')
    .addTag('Blockchain')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger docs: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
