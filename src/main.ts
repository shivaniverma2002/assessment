import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction } from 'express';


function globalMiddleWareOne(req:Request,res:Response, next:NextFunction)
{
   console.log("this is the middle ware number 1")
   next()
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(globalMiddleWareOne)
  await app.listen(3000);
}
bootstrap();
