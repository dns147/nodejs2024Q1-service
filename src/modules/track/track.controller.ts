import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto, TrackDto, UpdateTrackDto } from './dto/track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAllTracks(): Promise<TrackDto[]> {
    const tracks = await this.trackService.getAllTracks();

    return tracks;
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string): Promise<TrackDto | undefined> {
    const tracks = await this.trackService.getTrackById(id);

    return tracks;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrack(@Body() createTrackDto: CreateTrackDto): Promise<TrackDto> {
    const track = await this.trackService.createTrack(createTrackDto);

    return track;
  }

  @Put(':id')
  async updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<TrackDto> {
    await this.trackService.updateTrack(id, updateTrackDto);

    const track = await this.trackService.getTrackById(id);

    return track;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string) {
    await this.trackService.deleteTrack(id);
  }
}
