import { makeAutoObservable, runInAction } from 'mobx';
import { AnimeEntryDto, AnimeEntryInfo, AnimeEntryFilter } from './title.type';
import { titleService } from './title.service';

// ⚠️ animeId будет устанавливаться динамически через setFilter({ animeId: slug })
const defaultFilter: AnimeEntryFilter = {
  filterText: '',
  skipCount: 0,
  maxResultCount: 10,
  animeId: '',
};

class TitleStore {
  constructor() {
    makeAutoObservable(this);
  }

  entryList?: AnimeEntryInfo[];
  currentEntry?: AnimeEntryInfo;
  totalCount?: number;
  isLoading = false;
  filter: AnimeEntryFilter = { ...defaultFilter };

  // 📥 Список сезонов/записей
  getEntryList = async () => {
    this.isLoading = true;
    try {
      const data = await titleService.getEntryList(this.filter);
      runInAction(() => {
        this.entryList = data.items;
        this.totalCount = data.totalCount;
      });
    } catch (e) {
      console.error('❌ Failed to fetch entries:', e);
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  // 🎯 Текущая запись (если нужна детальная информация по одному сезону)
  getCurrentEntry = async (id: string) => {
    this.isLoading = true;
    try {
      const data = await titleService.getCurrentEntry(id);
      runInAction(() => { this.currentEntry = data; });
    } catch (e) {
      console.error('❌ Failed to fetch current entry:', e);
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  // 🆕 Создание
  createEntry = async (dto: AnimeEntryDto) => {
    this.isLoading = true;
    try {
      await titleService.createEntry(dto);
      await this.getEntryList(); // Автообновление списка
    } catch (e) {
      console.error('❌ Failed to create entry:', e);
      throw e;
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  // ✏️ Обновление
  updateEntry = async (dto: Partial<AnimeEntryDto>, entryId: string) => {
    this.isLoading = true;
    try {
      await titleService.updateEntry(dto, entryId);
      await this.getEntryList();
    } catch (e) {
      console.error('❌ Failed to update entry:', e);
      throw e;
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  // 🗑 Удаление
  deleteEntry = async (id: string) => {
    this.isLoading = true;
    try {
      await titleService.deleteEntry(id);
      await this.getEntryList();
    } catch (e) {
      console.error('❌ Failed to delete entry:', e);
      throw e;
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  // 🔍 Управление фильтрами
  setFilter = (newFilter: Partial<AnimeEntryFilter>) => {
    this.filter = { ...this.filter, ...newFilter };
  };

  resetFilter = () => {
    this.filter = { ...defaultFilter };
  };
}

export const titleStore = new TitleStore();