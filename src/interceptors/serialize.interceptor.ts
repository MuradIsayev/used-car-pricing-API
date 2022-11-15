import {
  NestInterceptor,
  UseInterceptors,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
  // Means as long as you give me a class, I'm gonna be happy
}
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  /* Typescript is gonna check all the methods that exists in NestInterceptor interface and make sure
    that our class properly implements all those different methods.
    */
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //  Run something before a request is handled by the request handler
    // console.log('I am running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // Data argument is the incoming user entity. Then we turn data into an instance of the User DTO

        // Run something before response is sent out
        // console.log('I am running before response is sent out', data);
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
        /* Last setting ensures that whenever we have an instance of UserDto and 
        try to turn it into plain JSON, its only going to share(expose) properties that marked as Expose() 
        */
      }),
    );
  }
}
