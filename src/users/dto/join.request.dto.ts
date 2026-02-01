import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'test@test.com',
    description: '이메일 주소',
    required: true,
  })
  @IsEmail({}, { message: '올바른 이메일 주소가아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  public email: string;

  @ApiProperty({
    example: '사주마스터',
    description: '닉네임',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '닉네임은 필수 입력 항목입니다.' })
  @MaxLength(30, { message: '닉네임은 30자 이내로 입력해주세요.' })
  public nickname: string;

  @ApiProperty({
    example: 'password123!',
    description: '비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  public password: string;
}
