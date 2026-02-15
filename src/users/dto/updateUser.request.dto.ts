import { PartialType } from '@nestjs/mapped-types';
import { JoinRequestDto } from './join.request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateUserDto {


  @ApiProperty({ description: '생년월일', example: '1990-01-01', nullable: true })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: '생년월일은 YYYY-MM-DD 형식이어야 합니다.' })
  birthDate: string | null;

  @ApiProperty({ description: '출생시간 (HH:mm)', example: '14:30', nullable: true })
  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: '출생시간은 HH:mm 형식이어야 합니다.' })
  birthTime: string | null;

  @ApiProperty({ description: '출생시간 모름 여부', default: false })
  @IsBoolean({ message: '출생시간 모름 여부는 불리언 값이어야 합니다.' })
  @IsOptional()
  birthTimeUnknown: boolean;

  @ApiProperty({
    description: '성별',
    enum: ['male', 'female'],
    nullable: true,
    example: 'male'
  })
  @IsEnum(['male', 'female'])
  @IsOptional()
  gender: 'male' | 'female' | null;

  @ApiProperty({
    description: '양력/음력',
    enum: ['solar', 'lunar'],
    default: 'solar'
  })
  @IsEnum(['solar', 'lunar'])
  @IsOptional()
  calendarType: 'solar' | 'lunar';

  @ApiProperty({ description: '출생지 (선택)', example: '서울', nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: '출생지는 255자 이내로 입력해주세요.' })
  birthPlace: string | null;
}
