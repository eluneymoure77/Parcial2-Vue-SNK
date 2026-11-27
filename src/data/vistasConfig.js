export const VISTAS_CONFIG = {
  personajes: {
    banner: {
      eyebrowHighlight: 'FACES',
      eyebrowSuffix: 'OF THE',
      title: 'FIGHT FOR FREEDOM',
      description:
        'Behind every name there is a story. Discover the cadets, soldiers, and titans who shaped the path from start to finish. Some swore to return freedom; others feared it. All left their mark.',
      mostrarAvisoSpoilers: true,
    },
    errorConexion: {
      modo: 'error-api',
      etiqueta: 'OFFLINE',
      imagenSrc: '/img/pantalla-error/sin-conexion-muros.png',
      imagenAlt: 'Titan breach and lost signal',
      titulo: "The walls are under attack.\nOur scouts couldn't bring the files.",
      descripcion:
        'The soldiers are holding the line against the Titans and signal with the archive is down. Check your connection and try again to reach the squad.',
      notaPie: 'Your search is kept. Hold the line and try again.',
    },
    sinResultados: {
      modo: 'vacio',
      etiqueta: 'NO RESULTS',
      imagenSrc: '/img/pantalla-error/sin-resultados-levi.png',
      imagenAlt: 'No results illustration',
      titulo: 'No recruit matches that name.',
      textoPrimario: 'Clear search',
      notaPie: 'Tip: check spelling or try just the first name.',
    },
  },

  personajeDetalle: {
    banner: {
      eyebrowHighlight: 'DOSSIER',
      eyebrowSuffix: 'OF THE',
      description:
        'Classified scout file, division record, and external archive data for this recruit.',
    },
    errorConexion: {
      modo: 'error-api',
      tituloEncabezado: 'Character dossier',
      estadoEncabezado: 'Offline',
      etiqueta: 'SIGNAL INTERRUPTED',
      imagenSrc: '/img/pantalla-error/titan-bestia-conexion.png',
      imagenAlt:
        'Beast Titan looking confused beside a destroyed transmission tower with a crossed-out signal',
      titulo: "Uh oh... looks like the signal\ndied from a strange anomaly.",
      descripcion:
        "Even the Beast Titan seems puzzled by the broken tower and dropped archive link. Check your connection and try pulling the dossier again.",
      notaPie: 'Strange interference detected. Retry once the signal stabilizes.',
    },
    infiltrado: {
      modo: 'vacio',
      etiqueta: 'CLASSIFIED ANOMALY',
      imagenSrc: '/img/pantalla-error/personaje-infiltrado.png',
      imagenAlt: 'Hooded Scout figure holding a dossier stamped UNKNOWN with a question mark',
      titulo: 'Who is behind the hood?',
      descripcion:
        'No scout with this ID appears in the official records. It could be a broken file number...or an infiltrator operating under a ghost identity.',
      textoPrimario: 'Back to characters',
      destinoPrimario: { name: 'personajes' },
      notaPie: 'Verify the character ID or head back to the characters list.',
    },
  },

  manga: {
    banner: {
      eyebrowPrefix: 'THE',
      eyebrowHighlight: 'ORIGINAL',
      eyebrowSuffix: 'CHRONICLE',
      title: 'MANGA ARCHIVE',
      description:
        'Read the chronicle behind the walls: publication notes, synopsis, and key details from the original manga entry.',
    },
    errorConexion: {
      modo: 'error-api',
      tituloEncabezado: "We couldn't recover the library archives",
      estadoEncabezado: 'Connection interrupted',
      etiqueta: 'OFFLINE',
      imagenSrc: '/img/pantalla-error/erwin-biblioteca-sin-conexion.png',
      imagenAlt: 'Erwin Smith searching an archive book with a lost signal',
      titulo: "The library shelves went quiet.\nWe couldn't recover the library archives.",
      descripcion:
        "Even Commander Erwin couldn't find the chronicle pages while the archive signal is down. Check your connection and try again to retrieve the manga records.",
      notaPie: 'Archive request paused. Hold the line and retry.',
    },
  },

  divisiones: {
    banner: {
      eyebrowPrefix: 'THE',
      eyebrowHighlight: 'THREE',
      title: 'MILITARY DIVISIONS',
      description:
        'Three branches shaped life inside and outside the walls. Explore the emblems and roles of each division across the archive.',
    },
  },

  divisionDetalle: {
    banner: {
      eyebrowHighlight: 'DIVISION',
      eyebrowSuffix: 'OF THE',
    },
  },

  favoritos: {
    banner: {
      eyebrowPrefix: 'YOUR',
      eyebrowHighlight: 'PERSONAL',
      eyebrowSuffix: 'SQUAD',
      title: 'FAVORITES',
      description:
        'Your lineup, always at hand. Review the recruits and titans you saved from the archive.',
    },
    errorConexion: {
      modo: 'error-api',
      tituloEncabezado: 'Your lineup',
      estadoEncabezado: 'Connection interrupted',
      etiqueta: 'MISSION FAILED · OFFLINE',
      imagenSrc: '/img/pantalla-error/shadis-misionfallida.png',
      imagenAlt: 'Keith Shadis holding a red flare and squad checklist with a lost Wi-Fi signal',
      titulo: "Mission failed.\nThe troops aren't responding.",
      descripcion:
        "Instructor Shadis raised the flare, but the signal with the archive is down and your squad roster couldn't be retrieved. Check your connection and try again.",
      notaPie: 'Your saved squad IDs remain safe. Hold position and retry.',
    },
    escuadronVacio: {
      modo: 'vacio',
      varianteVacio: 'escuadron',
      imagenSrc: '/img/pantalla-error/escuadron-vacio-shadis.png',
      imagenAlt: 'Keith Shadis reviewing an empty squad list',
      titulo: 'Your squad is empty',
      descripcion:
        'There is no one in your lineup yet. Explore the characters and add those you want close by. A recruit without a squad is a lone recruit.',
      textoPrimario: 'Explore characters',
      destinoPrimario: { name: 'personajes' },
      textoSecundario: 'Go to manga',
      destinoSecundario: { name: 'manga' },
    },
  },
}