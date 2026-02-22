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

  @ApiProperty({ description: '이름', example: '홍길동', nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: '이름은 50자 이내로 입력해주세요.' })
  name: string | null;

  @ApiProperty({ description: '국가 코드 (ISO 3166-1 alpha-2)', example: 'KR', nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(10, { message: '국가 코드는 10자 이내로 입력해주세요.' })
  countryCode: string | null;

  @ApiProperty({ description: '지역/주 코드', example: '11', nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(10, { message: '지역 코드는 10자 이내로 입력해주세요.' })
  stateCode: string | null;

  @ApiProperty({ description: '도시명', example: '서울', nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: '도시명은 100자 이내로 입력해주세요.' })
  cityName: string | null;
}
