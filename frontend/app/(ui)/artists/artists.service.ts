import { ArtistDto, IArtist } from './artists.type';
import { FilterRequestDto } from '@/types/filterRequestDto';
import { PageFilteredDto } from '@/types/pageFilteredDto';
import { http } from '@/service/httpService';
import API from '@/service/api';

class ArtistsService {
  getArtists = async (filter: FilterRequestDto): Promise<PageFilteredDto<IArtist>> => {
    const result = await http.get<PageFilteredDto<IArtist>>(`${API.Artist}`, filter);

    return result;
  }

  createArtist = async(artist: ArtistDto) => {
    const result = await http.post<PageFilteredDto<IArtist>>(`${API.Artist}`, artist);

    return result;
  }

  getCurrentArtist = async (artistId: string): Promise<IArtist> => {
    const result = await http.get<IArtist>(`${API.Artist}${artistId}`);

    return result;
  }

  updateArtist = async(artist: ArtistDto, id: string) => {
    const result = await http.put<PageFilteredDto<IArtist>>(`${API.Artist}${id}`, artist);

    return result;
  }

  deleteArtist = async(artistId: string) => {
    const result = await http.delete<PageFilteredDto<IArtist>>(`${API.Artist}${artistId}`);

    return result;
  }
}
export const artistsService = new ArtistsService();
