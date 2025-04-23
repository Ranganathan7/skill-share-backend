import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './common/configuration/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { TaskEntity } from './entities/task.entity';
import { SkillEntity } from './entities/skill.entity';
import { AccountModule } from './account/account.module';
import { TaskModule } from './task/task.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [
    // Import ConfigModule with global config. No need to import in other modules
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    // Registering postgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.user'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.databaseName'),
        entities: [AccountEntity, TaskEntity, SkillEntity],
        synchronize: config.get<boolean>('database.synchronize'),
      }),
    }),
    AccountModule,
    TaskModule,
    OfferModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
