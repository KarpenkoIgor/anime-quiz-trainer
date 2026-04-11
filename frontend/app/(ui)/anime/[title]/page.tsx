'use client';

import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'next/navigation';
import {
  Box, Typography, Grid, Paper, Chip, Button, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox,
  Card, CardContent, CardActions, List, ListItem, ListItemText, Divider,
  CircularProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

// 🔹 1. Сторы (деструктуризация)
import { animeStore } from '../anime.store';
import { tagStore } from '../CreateTagModal/tag.store';
import { IAnimeDto } from '../anime.type';
import { titleStore } from './title.store';
import { AnimeEntryDto, AnimeEntryInfo } from './title.type';
import { authStore } from '@/Auth/auth.store';

// 🔹 2. Типы

const AnimeTitlePage: FC = () => {
  // ─────────────────────────────────────────────────────────────
  // 🔹 1. Хуки библиотек / Next.js
  // ─────────────────────────────────────────────────────────────
  const params = useParams();
  const title = params.title as string;

  // ─────────────────────────────────────────────────────────────
  // 🔹 2. Деструктуризация сторов
  // ─────────────────────────────────────────────────────────────
  const { currentAnime, isLoading: animeLoading, getAnime, updateAnime } = animeStore;
  const { tagList, getTagList } = tagStore;
  const { entryList, isLoading: entryLoading, getEntryList, createEntry, updateEntry, deleteEntry, setFilter } = titleStore;
  const isAdmin = authStore.isAdmin;

  // ─────────────────────────────────────────────────────────────
  // 🔹 3. React стейты
  // ─────────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editTitleEn, setEditTitleEn] = useState('');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [isEditSeasonModalOpen, setIsEditSeasonModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [seasonForm, setSeasonForm] = useState<Partial<AnimeEntryDto>>({ title: '', titleEn: '', type: 0 });
  const [editingEntry, setEditingEntry] = useState<AnimeEntryInfo | null>(null);

  // ─────────────────────────────────────────────────────────────
  // 🔹 4. Переменные + useMemo
  // ─────────────────────────────────────────────────────────────
  const visibleEntries = useMemo(() => entryList || [], [entryList]);
  const expandedEntry = useMemo(() => visibleEntries.find(e => e.id === expandedEntryId), [visibleEntries, expandedEntryId]);

  // ─────────────────────────────────────────────────────────────
  // 🔹 5. Синхронные функции + коллбеки
  // ─────────────────────────────────────────────────────────────
  const handleToggleTag = useCallback((tagId: string) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]);
  }, []);

  const handleExpandEntry = useCallback((id: string) => {
    setExpandedEntryId(prev => prev === id ? null : id);
  }, []);

  const handleOpenEditSeason = (entry: AnimeEntryInfo) => {
    if (!title) return;
    setEditingEntry(entry);
    setSeasonForm({ title: entry.title, titleEn: entry.titleEn, type: entry.type, animeId: title });
    setIsEditSeasonModalOpen(true);
  };

  const handleCloseSeasonModals = useCallback(() => {
    setIsSeasonModalOpen(false);
    setIsEditSeasonModalOpen(false);
    setEditingEntry(null);
    setSeasonForm({ title: '', titleEn: '', type: 0 });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 🔹 6. Асинхронные функции + коллбеки
  // ─────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!title) return;
    await Promise.all([
      getAnime(title),
      (async () => { setFilter({ animeId: title, skipCount: 0 }); await getEntryList(); })(),
      isAdmin ? getTagList() : Promise.resolve(),
    ]);
  }, [title, isAdmin]);

  const handleSaveTitle = useCallback(async () => {
    if (!currentAnime?.id) return;
    try {
      const dto: IAnimeDto = {
        title: editTitle,
        titleEn: editTitleEn,
        tagIds: selectedTags,
      };
      await updateAnime(dto, currentAnime.id);
    } catch (e) {
      console.error('❌ Failed to update anime:', e);
    } finally {
      setIsEditing(false);
    }
  }, [currentAnime?.id, editTitle, editTitleEn, selectedTags]);

  const handleSaveSeason = useCallback(async () => {
    if (!seasonForm.title || !title) return;
    try {
      await createEntry({ ...seasonForm, animeId: title } as AnimeEntryDto);
      handleCloseSeasonModals();
    } catch (e) {
      console.error('❌ Failed to create entry:', e);
    }
  }, [seasonForm, title]);

   
  const handleUpdateSeason = useCallback(async () => {
    if (!editingEntry?.id || !seasonForm.title) return;
    try {
      await updateEntry(seasonForm as Partial<AnimeEntryDto>, editingEntry.id);
      handleCloseSeasonModals();
    } catch (e) {
      console.error('❌ Failed to update entry:', e);
    }
  }, [editingEntry?.id, seasonForm]);

  const handleDeleteSeason = useCallback(async (id: string) => {
    try {
      await deleteEntry(id);
      if (expandedEntryId === id) setExpandedEntryId(null);
    } catch (e) {
      console.error('❌ Failed to delete entry:', e);
    }
  }, [expandedEntryId]);

  const handleSaveTags = useCallback(async () => {
    if (!currentAnime?.id) return;
    try {
      const dto: IAnimeDto = {
        title: currentAnime.title,
        titleEn: currentAnime.titleEn,
        tagIds: selectedTags,
      };
      await updateAnime(dto, currentAnime.id);
      setIsTagModalOpen(false);
    } catch (e) {
      console.error('❌ Failed to update tags:', e);
    }
  }, [currentAnime, selectedTags]);

  // ─────────────────────────────────────────────────────────────
  // 🔹 7. useEffect
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (currentAnime) {
       
      setEditTitle(currentAnime.title || '');
      setEditTitleEn(currentAnime.titleEn || '');
      setSelectedTags(currentAnime.tags?.map(t => t.id) || []);
    }
  }, [currentAnime]);

  // ─────────────────────────────────────────────────────────────
  // 🔹 8. Render
  // ─────────────────────────────────────────────────────────────
  if (animeLoading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (!currentAnime) return <Alert severity="warning" sx={{ mt: 4 }}>Аниме не найдено</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', minHeight: '80vh' }}>
      
      {/* 🔹 Заголовок + редактирование */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 4 }}>
        <Box>
          {isEditing ? (
            <>
              <TextField value={editTitle} onChange={e => setEditTitle(e.target.value)} fullWidth size="small" sx={{ mb: 1, maxWidth: 400 }} />
              <TextField value={editTitleEn} onChange={e => setEditTitleEn(e.target.value)} fullWidth size="small" sx={{ maxWidth: 400 }} />
            </>
          ) : (
            <>
              <Typography variant="h3" sx={{ mb: 0.5 }}>{currentAnime.title}</Typography>
              <Typography variant="h6" color="text.secondary">{currentAnime.titleEn}</Typography>
            </>
          )}
        </Box>
        {isAdmin && (
          <IconButton onClick={isEditing ? handleSaveTitle : () => setIsEditing(true)} color={isEditing ? 'success' : 'default'}>
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        )}
      </Box>

      {/* 🔹 Сетка: Картинка+Теги / Описание */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ width: '100%', aspectRatio: '3/4', bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, mb: 2 }}>
            <Typography color="text.secondary">Постер аниме</Typography>
          </Paper>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {currentAnime.tags?.map(tag => <Chip key={tag.id} label={tag.name} size="small" />)}
            {isAdmin && isEditing && (
              <Chip icon={<EditIcon fontSize="small" />} label="Ред. теги" onClick={() => setIsTagModalOpen(true)} variant="outlined" clickable />
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ p: 3, minHeight: 250, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Описание</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {'Место для описания...'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 🔹 Сезоны: заголовок + кнопка добавления */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Сезоны</Typography>
        {isAdmin && <IconButton onClick={() => setIsSeasonModalOpen(true)}><AddIcon /></IconButton>}
      </Box>

      {/* 🔹 Сезоны: список (горизонтальный скролл) */}
      {entryLoading ? (
        <CircularProgress size={30} sx={{ mt: 2 }} />
      ) : (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, scrollbarWidth: 'thin' }}>
          {visibleEntries.map(entry => {
            const isExpanded = expandedEntryId === entry.id;
            return (
              <Card key={entry.id} sx={{ minWidth: 200, maxWidth: 220, flexShrink: 0, border: isExpanded ? '2px solid #1976d2' : '1px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="h6" noWrap>{entry.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{entry.titleEn}</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>Тип: {entry.type}</Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ justifyContent: 'space-between', px: 2 }}>
                  <Box sx={{ display: 'flex' }}>
                    {isAdmin && (
                      <>
                        <IconButton size="small" color="primary" onClick={() => handleOpenEditSeason(entry)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteSeason(entry.id)}><DeleteIcon fontSize="small" /></IconButton>
                      </>
                    )}
                  </Box>
                  <IconButton size="small" onClick={() => handleExpandEntry(entry.id)}>
                    <ExpandMoreIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </IconButton>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}

      {/* 🔹 Детали развёрнутого сезона */}
      {expandedEntry && (
        <Paper elevation={4} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Информация о сезоне</Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
            <Typography><b>Название:</b> {expandedEntry.title}</Typography>
            <Typography><b>Создан:</b> {new Date(expandedEntry.createdAt).toLocaleDateString()}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>Опенинги / Эндинги:</Typography>
          <List dense>
            <ListItem><ListItemText primary="Загрузка опенингов..." secondary="Скоро будет интегрирован сервис" /></ListItem>
          </List>
        </Paper>
      )}

      {/* 🔹 Модалка: Редактирование тегов */}
      <Dialog open={isTagModalOpen} onClose={() => setIsTagModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Управление тегами</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5, maxHeight: 300, overflowY: 'auto' }}>
            {tagList?.map(tag => (
              <FormControlLabel
                key={tag.id}
                control={<Checkbox checked={selectedTags.includes(tag.id)} onChange={() => handleToggleTag(tag.id)} />}
                label={tag.name}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsTagModalOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleSaveTags}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Модалка: Добавление сезона */}
      <Dialog open={isSeasonModalOpen} onClose={handleCloseSeasonModals} maxWidth="xs" fullWidth>
        <DialogTitle>Добавить сезон</DialogTitle>
        <DialogContent>
          <TextField label="Название" value={seasonForm.title} onChange={e => setSeasonForm({ ...seasonForm, title: e.target.value })} fullWidth sx={{ mt: 1, mb: 2 }} />
          <TextField label="Название (EN)" value={seasonForm.titleEn} onChange={e => setSeasonForm({ ...seasonForm, titleEn: e.target.value })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Тип (число)" type="number" value={seasonForm.type} onChange={e => setSeasonForm({ ...seasonForm, type: Number(e.target.value) })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSeasonModals}>Отмена</Button>
          <Button variant="contained" onClick={handleSaveSeason}>Создать</Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Модалка: Редактирование сезона */}
      <Dialog open={isEditSeasonModalOpen} onClose={handleCloseSeasonModals} maxWidth="xs" fullWidth>
        <DialogTitle>Редактировать сезон</DialogTitle>
        <DialogContent>
          <TextField label="Название" value={seasonForm.title} onChange={e => setSeasonForm({ ...seasonForm, title: e.target.value })} fullWidth sx={{ mt: 1, mb: 2 }} />
          <TextField label="Название (EN)" value={seasonForm.titleEn} onChange={e => setSeasonForm({ ...seasonForm, titleEn: e.target.value })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Тип (число)" type="number" value={seasonForm.type} onChange={e => setSeasonForm({ ...seasonForm, type: Number(e.target.value) })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSeasonModals}>Отмена</Button>
          <Button variant="contained" onClick={handleUpdateSeason}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default observer(AnimeTitlePage);