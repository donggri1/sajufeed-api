import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDreamDto {
    @ApiProperty({
        description: '사용자가 꾸었던 꿈 내용',
        example: '밤하늘을 날아가다가 거대한 고래를 만나는 꿈을 꾸었습니다.',
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
