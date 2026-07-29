import { Module } from "@nestjs/common";
import { AppModule } from "@/app.module";
import { SeedProvidersModule } from "./providers/seed-providers.module";

@Module({
  imports: [AppModule, SeedProvidersModule],
})
export class SeedRootModule {}
