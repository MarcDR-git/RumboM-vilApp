# Rumbo móvil (app Android)

Misma app que la versión de PC, pero **sin servidor**: todo se guarda en el propio teléfono (IndexedDB) y funciona sin conexión
(el tiempo, el cambio de moneda, las imágenes por búsqueda y el mapa sí necesitan internet).

## Opción A – Sin instalar nada (GitHub Actions)
1. Crea un repositorio en GitHub y sube **el contenido de esta carpeta** (con la carpeta oculta `.github`).
2. En la pestaña **Actions** → **Android APK** → **Run workflow**.
3. Cuando termine (unos minutos), abre la ejecución y descarga el artefacto **rumbo-apk** (contiene `app-debug.apk`).
4. Pásalo al móvil e instálalo (hay que permitir "instalar apps de origen desconocido").

## Opción B – Con Android Studio
Requisitos: Node 18+, JDK 17 y Android Studio.
```
npm install
npx cap add android
npm run icons        # genera iconos y pantalla de inicio desde resources/
npm run sync
npm run open         # abre Android Studio -> Run (móvil por USB) o Build > Build APK
```
Desde la terminal también: `npm run apk` (el APK queda en `android/app/build/outputs/apk/debug/`).

## Probar en el ordenador antes
`npm run web` y abre http://localhost:8080 (los datos se guardan en el navegador).

## iPhone
`npx cap add ios` y `npx cap open ios` (necesita Mac con Xcode; instalar en tu iPhone sin pagar caduca a los 7 días, permanente requiere cuenta de Apple Developer).

## Importante
- Si desinstalas la app o cambias de móvil **se pierden los datos**: usa Exportar (viajes + To-Do) para hacer copias.
- No cambies el `appId` ni la firma entre versiones, o Android tratará la app como distinta y no verá tus datos.
- Compartir con otros usuarios se hace por archivo (WhatsApp, correo…). Compartir entre cuentas necesitaría un servidor.
