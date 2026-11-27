<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  logoSrc: {
    type: String,
    default: '/img/logo-snk.png',
  },
})

</script>

<template>
  <footer class="snk-footer">
    <div class="mx-auto flex max-w-7xl flex-col gap-8 sm:gap-10">
      <!-- Fila superior: Logo + Navegación + Redes sociales -->
      <div class="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
        <RouterLink :to="{ name: 'home' }" class="inline-flex shrink-0 items-center" aria-label="Back to home">
          <img
            :src="logoSrc"
            alt="Attack on Titan — Shingeki no Kyojin"
            class="snk-footer-logo"
          />
        </RouterLink>

        <div class="flex flex-col items-center gap-5 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end md:gap-8 lg:gap-10">
          <nav aria-label="Footer navigation" class="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
            <RouterLink :to="{ name: 'home' }" class="snk-footer-link">
              Home
            </RouterLink>
            <RouterLink :to="{ name: 'personajes' }" class="snk-footer-link">
              Characters
            </RouterLink>
            <RouterLink :to="{ name: 'manga' }" class="snk-footer-link">
              Manga
            </RouterLink>
            <RouterLink :to="{ name: 'divisiones' }" class="snk-footer-link">
              Divisions
            </RouterLink>
            <RouterLink :to="{ name: 'favoritos' }" class="snk-footer-link">
              Favorites
            </RouterLink>
          </nav>

          <!-- Redes sociales -->
          <ul class="flex items-center justify-center gap-3.5 sm:gap-4" aria-label="Social media links">
            <li>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                class="snk-footer-social"
              >
                <i class="ri-youtube-fill text-base leading-none" aria-hidden="true"></i>
              </a>
            </li>

            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                class="snk-footer-social"
              >
                <i class="ri-facebook-fill text-base leading-none" aria-hidden="true"></i>
              </a>
            </li>

            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                class="snk-footer-social"
              >
                <i class="ri-twitter-x-fill text-base leading-none" aria-hidden="true"></i>
              </a>
            </li>

            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                class="snk-footer-social"
              >
                <i class="ri-instagram-fill text-base leading-none" aria-hidden="true"></i>
              </a>
            </li>

            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                class="snk-footer-social"
              >
                <i class="ri-linkedin-fill text-base leading-none" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Fila inferior: Legales + Copyright -->
      <div class="flex flex-col items-center justify-between gap-3 pt-2 text-center sm:flex-row sm:text-left">
        <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <RouterLink :to="{ name: 'home' }" class="snk-footer-legal-link">
            Privacy policy
          </RouterLink>
          <RouterLink :to="{ name: 'home' }" class="snk-footer-legal-link">
            Terms and conditions
          </RouterLink>
        </div>

        <p class="font-sans text-xs sm:text-sm text-hueso/80">
          @All rights reserved - Shingeki no Kyojin
        </p>
      </div>
    </div>
  </footer>
</template>