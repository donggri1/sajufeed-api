import { PickType } from '@nestjs/swagger';
import { JoinRequestDto } from '../../users/dto/join.request.dto';

export class LoginRequestDto extends PickType(JoinRequestDto,['email','password'] as const){}