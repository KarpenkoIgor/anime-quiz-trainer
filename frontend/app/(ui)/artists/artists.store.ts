import { makeAutoObservable, runInAction } from 'mobx';
import { ArtistDto, IArtist } from './artists.type';
import { artistsService } from './artists.service';
import { FilterRequestDto } from '@/types/filterRequestDto';

const defaultFilter: FilterRequestDto = {
  filterText: '',
  skipCount: 0,
  maxResultCount: 10,
};

class ArtistsStore {
  constructor() {
    makeAutoObservable(this);
  }

  artistList?: IArtist[];
  currentArtist?: IArtist;
  totalCount?: number;
  isLoading = false;
  filter: FilterRequestDto = { ...defaultFilter };

  // 📥 Получение списка
  getArtists = async () => {
    this.isLoading = true;
    try {
      const data = await artistsService.getArtists(this.filter);
      runInAction(() => {
        this.artistList = data.items;
        this.totalCount = data.totalCount;
      });
    } catch (e) {
      console.error('❌ Failed to fetch artists:', e);
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  // 🎯 Получение одного артиста
  getCurrentArtist = async (id: string) => {
    this.isLoading = true;
    try {
      const data = await artistsService.getCurrentArtist(id);
      runInAction(() => { this.currentArtist = data; });
    } catch (e) {
      console.error('❌ Failed to fetch artist:', e);
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  // 🆕 Создание
  createArtist = async (dto: ArtistDto) => {
    this.isLoading = true;
    try {
      await artistsService.createArtist(dto);
      await this.getArtists(); // Автообновление списка
    } catch (e) {
      console.error('❌ Failed to create artist:', e);
      throw e; // Пробрасываем для обработки в UI
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  // ✏️ Обновление
  updateArtist = async (dto: ArtistDto, id: string) => {
    this.isLoading = true;
    try {
      await artistsService.updateArtist(dto, id);
      await this.getArtists();
    } catch (e) {
      console.error('❌ Failed to update artist:', e);
      throw e;
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  // 🗑 Удаление
  deleteArtist = async (id: string) => {
    this.isLoading = true;
    try {
      await artistsService.deleteArtist(id);
      await this.getArtists();
    } catch (e) {
      console.error('❌ Failed to delete artist:', e);
      throw e;
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  // 🔍 Управление фильтрами
  setFilter = (newFilter: FilterRequestDto) => {
    this.filter = { ...this.filter, ...newFilter };
  };

  resetFilter = () => {
    this.filter = { ...defaultFilter };
  };
}

export const artistsStore = new ArtistsStore();