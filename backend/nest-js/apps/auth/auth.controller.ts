import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {

async test(){
    return {status:"done"}
}

}
