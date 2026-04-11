'use client';

import { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import {
  Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Pagination, Typography, CircularProgress, Alert, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { IArtist } from './artists.type';
import { artistsStore } from './artists.store';

// 🔹 2. Деструктуризация стора

const ArtistsPage: FC = () => {
  // ─────────────────────────────────────────────────────────────
  // 🔹 1. Хуки библиотек / Next.js
  // ─────────────────────────────────────────────────────────────
  // (Здесь могут быть useParams, useRouter и т.д. при необходимости)

  // ─────────────────────────────────────────────────────────────
  // 🔹 2. Деструктуризация стора
  // ─────────────────────────────────────────────────────────────
  const { artistList, totalCount, isLoading, filter, getArtists, createArtist, updateArtist, deleteArtist, setFilter } = artistsStore;

  // ─────────────────────────────────────────────────────────────
  // 🔹 3. React стейты
  // ─────────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState(filter.filterText || '');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formValue, setFormValue] = useState('');
  const [targetArtist, setTargetArtist] = useState<IArtist | null>(null);

  // ─────────────────────────────────────────────────────────────
  // 🔹 4. Переменные + useMemo
  // ─────────────────────────────────────────────────────────────
  const pageSize = filter.maxResultCount || 10;
  const currentPage = Math.floor((filter.skipCount || 0) / pageSize) + 1;
  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / pageSize));
  const visibleArtists = useMemo(() => artistList || [], [artistList]);

  // ─────────────────────────────────────────────────────────────
  // 🔹 5. Синхронные функции + коллбеки
  // ─────────────────────────────────────────────────────────────
  const handleCloseModals = useCallback(() => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setTargetArtist(null);
    setFormValue('');
  }, []);

  const handleOpenEdit = useCallback((artist: IArtist) => {
    setTargetArtist(artist);
    setFormValue(artist.name);
    setIsEditOpen(true);
  }, []);

  const handleOpenDelete = useCallback((artist: IArtist) => {
    setTargetArtist(artist);
    setIsDeleteOpen(true);
  }, []);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    setFilter({ skipCount: (page - 1) * pageSize });
  }, []);

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
    setFilter({ filterText: value, skipCount: 0 });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 🔹 6. Асинхронные функции + коллбеки
  // ─────────────────────────────────────────────────────────────
  const handleCreate = useCallback(async () => {
    if (!formValue.trim()) return;
    try {
      await createArtist({ name: formValue });
      handleCloseModals();
    } catch (e) {
      console.error('❌ Create failed:', e);
    }
  }, [formValue]);

  const handleUpdate = useCallback(async () => {
    if (!targetArtist || !formValue.trim()) return;
    try {
      // ⚠️ По вашей сигнатуре сервиса updateArtist принимает только ArtistDto.
      // Если бэкенду нужен ID, добавьте его в DTO: { id: targetArtist.id, name: formValue }
      await updateArtist({ name: formValue }, targetArtist.id);
      handleCloseModals();
    } catch (e) {
      console.error('❌ Update failed:', e);
    }
  }, [targetArtist, formValue]);

  const handleDelete = useCallback(async () => {
    if (!targetArtist?.id) return;
    try {
      await deleteArtist(targetArtist.id);
      handleCloseModals();
    } catch (e) {
      console.error('❌ Delete failed:', e);
    }
  }, [targetArtist]);

  // ─────────────────────────────────────────────────────────────
  // 🔹 7. useEffect
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    getArtists();
  }, []);

  useEffect(() => {
    getArtists();
  }, [filter.filterText, filter.skipCount]);

  // ─────────────────────────────────────────────────────────────
  // 🔹 8. Render
  // ─────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto', minHeight: '80vh' }}>
      
      {/* 🔹 Поиск + Кнопка добавления */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          size="small"
          placeholder="Поиск артиста..."
          value={searchInput}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
          }}
          sx={{ width: 300 }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setFormValue(''); setIsCreateOpen(true); }}>
          Добавить артиста
        </Button>
      </Box>

      {/* 🔹 Таблица */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell align="right" sx={{ width: 120 }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={2} align="center"><CircularProgress size={24} /></TableCell></TableRow>
            ) : visibleArtists.length === 0 ? (
              <TableRow><TableCell colSpan={2} align="center"><Alert severity="info">Артисты не найдены</Alert></TableCell></TableRow>
            ) : (
              visibleArtists.map((artist: IArtist) => (
                <TableRow key={artist.id} hover>
                  <TableCell>{artist.name}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleOpenEdit(artist)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleOpenDelete(artist)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🔹 Пагинация */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* 🔹 Модалка: Создание */}
      <Dialog open={isCreateOpen} onClose={handleCloseModals} maxWidth="xs" fullWidth>
        <DialogTitle>Новый артист</DialogTitle>
        <DialogContent>
          <TextField
            label="Имя"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModals}>Отмена</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isLoading || !formValue.trim()}>Создать</Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Модалка: Редактирование */}
      <Dialog open={isEditOpen} onClose={handleCloseModals} maxWidth="xs" fullWidth>
        <DialogTitle>Редактировать артиста</DialogTitle>
        <DialogContent>
          <TextField
            label="Имя"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModals}>Отмена</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={isLoading || !formValue.trim()}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Модалка: Удаление */}
      <Dialog open={isDeleteOpen} onClose={handleCloseModals}>
        <DialogTitle>Удалить артиста?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить <b>{targetArtist?.name}</b>? Это действие нельзя отменить.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModals}>Отмена</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={isLoading}>Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default observer(ArtistsPage);