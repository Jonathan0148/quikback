import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("DOCUMENTATION")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("documentation", app, document);
}