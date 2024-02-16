import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchea } from './configs/env.config';
import { getMongoConfig } from './configs/mongoose.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './configs/jwt.config';
import { MailModule } from './mail/mail.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorMessageToArrayFilter } from './shared/filters/error-message-to-array.filter';
import { MongoCastErrorFilter } from './shared/filters/mongo-objectId-cast.filter';
import { ScheduleModule } from '@nestjs/schedule';
import { FirebaseModule } from './firebase/firebase.module';
import { LoggerInterceptor } from './shared/interceptors/logger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchea,
    }),
    TypegooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtConfig,
      global: true,
    }),
    // ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    MailModule,
    // FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorMessageToArrayFilter,
    },
    { provide: APP_FILTER, useClass: MongoCastErrorFilter },
  ],
})
export class AppModule {}
