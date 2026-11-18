import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

const PHONE = /^[+\d][\d\s-]{8,16}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export class BuyerDto {
  @IsString() @Length(2, 100) name!: string;
  @IsEmail() @Length(5, 160) email!: string;
  @Matches(PHONE, { message: 'phone must be a mobile number' }) phone!: string;
}

export class ParticipantDto {
  @IsString() @Length(2, 100) full_name!: string;
  @IsOptional() @IsEmail() @Length(5, 160) email?: string;
  @IsOptional()
  @Matches(PHONE, { message: 'phone must be a mobile number' })
  phone?: string;
  @IsIn(['female', 'male', 'non_binary', 'prefer_not_to_say']) gender!: string;
  @Matches(DATE, { message: 'birth_date must be YYYY-MM-DD' })
  birth_date!: string;
}

export class SeatDto {
  @IsUUID() category_id!: string;
  @ValidateNested() @Type(() => ParticipantDto) participant!: ParticipantDto;
  /** Answers keyed by field_key: the organiser's own questions, and the built-in ones (see BUILT_IN_FIELDS). */
  @IsOptional() @IsObject() answers?: Record<string, unknown>;
}

export class CreateRegistrationDto {
  @IsUUID() event_id!: string;
  @ValidateNested() @Type(() => BuyerDto) buyer!: BuyerDto;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats!: SeatDto[];
  /** What the page showed the buyer. If the real total differs (a price tier changed), the booking is refused so nobody pays an unexpected amount. */
  @IsOptional() @IsInt() @Min(0) expected_total_inr?: number;
  /** One per checkout attempt: a retried request returns the same order. */
  @IsOptional() @IsString() @Length(8, 80) idempotency_key?: string;
}
