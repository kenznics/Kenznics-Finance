const appDiv = document.querySelector<HTMLDivElement>('#app');
import './style.css';
import { Navbar } from './components/Navbar';

if (appDiv) {
  appDiv.innerHTML = `
  ${Navbar()}
  <div class="p-6">
    <!-- Kotak selamat datang kamu yang warna biru taruh sini! -->
</div>
  <div class= "bg-blue-600 text white p-6 rounded-lg text-center shadow-md">
  <h1 class= "text-2xl font-bold">Halo Full-Stack Developer</h1>
  <p class="mt-2 text-blue-100">Fase 1 Front END DOM & Tailwind berhasil terhubung.</p>
  `;
}