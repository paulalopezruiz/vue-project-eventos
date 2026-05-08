<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
    <a class="navbar-brand">SGE Eventos</a>

    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Panel</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/eventos">Eventos</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/usuarios">Usuarios</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/inscripciones">Inscripciones</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
