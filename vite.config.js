import { defineConfig } from 'vite'

export default defineConfig({
  root: './src',  // 指定源代码根目录
  build: {
    outDir: '../dist', // 指定输出目录
  }
})