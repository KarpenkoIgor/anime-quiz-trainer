'use client';

import { Box, Modal, TextField, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authStore } from '@/Auth/auth.store';

// 1. Схема валидации
const registerSchema = z.object({
  email: z.email({ message: 'Введите корректный email' }),
  password: z.string().min(6, { message: 'Минимум 6 символов' }),
  username: z.string().trim().min(1, { message: 'Поле не может быть пустым' }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  // 2. Хук формы
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', username: '' },
    mode: 'onChange', // валидация при вводе
  });

  // 3. Отправка
  const onSubmit = async (data: RegisterFormData) => {
    authStore.createUser(data);

    setValue('email', '');
    setValue('password', '');
    setValue('username', '');

    onClose()
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="register-modal-title">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: 400 },
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6" id="register-modal-title" sx={{ mb: 1 }}>
          Регистрация
        </Typography>

        <TextField
          label="Имя Аккаунта"
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          fullWidth
        />

        <TextField
          label="Email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />

        <TextField
          label="Пароль"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
        />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Зарегистрироваться'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}