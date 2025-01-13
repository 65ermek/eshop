import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url'; // Импортируем необходимые функции

// Экспортируем конфигурацию
export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: 'dist', // Директория для финальной сборки
    },
    server: {
        port: 8084, // Порт для разработки
        host: '0.0.0.0', // Установка хоста, чтобы можно было подключаться по IP
    },
    resolve: {
        alias: {
            // Настраиваем алиас "@" для Vite, чтобы он указывал на папку "src"
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
