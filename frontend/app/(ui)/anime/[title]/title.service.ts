import { AnimeEntryDto, AnimeEntryFilter, AnimeEntryInfo } from './title.type'
import { PageFilteredDto } from '@/types/pageFilteredDto'
import { http } from '@/service/httpService'
import API from '@/service/api'

class TitleService {
  getEntryList = async (filter: AnimeEntryFilter): Promise<PageFilteredDto<AnimeEntryInfo>> => {
    const result = await http.get<PageFilteredDto<AnimeEntryInfo>>(`${API.AnimeEntry}`, filter)
    
    return result
  }

  createEntry = async (dto: AnimeEntryDto) => {
    const result = await http.post(`${API.AnimeEntry}`, dto)

    return result
  }

  getCurrentEntry = async(id: string): Promise<AnimeEntryInfo> => {
    const result = await http.get<AnimeEntryInfo>(`${API.AnimeEntry}${id}`)
    
    return result
  }

  updateEntry = async (dto: Partial<AnimeEntryDto>, entryId: string) => {
    const result = await http.put(`${API.AnimeEntry}${entryId}`, dto)

    return result
  }

  deleteEntry = async(id: string) => {
    const result = await http.delete(`${API.AnimeEntry}${id}`)
    
    return result
  }
}

export const titleService = new TitleService()