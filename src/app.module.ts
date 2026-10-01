import { Module } from "@nestjs/common";
import { ConvertModule } from "./convert/convert.module";
import { ViewsModule } from "./views/views.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConvertModule,
    ViewsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
