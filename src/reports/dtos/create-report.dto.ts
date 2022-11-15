import {
  IsString,
  IsNumber,
  Max,
  Min,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Min(0)
  @Max(1000000)
  @IsNumber()
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @Min(0)
  @Max(1000000)
  @IsNumber()
  price: number;
}
