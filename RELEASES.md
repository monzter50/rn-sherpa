# Release Workflow

Guía para gestionar versiones y releases de `rn-sherpa`.

## 📦 Tipos de Releases

### 🔵 Beta Releases (Pre-release)

Versiones de prueba para features en desarrollo.

**Rama:** `beta` o `develop`
**Versión:** `0.1.0-beta.1`, `0.1.0-beta.2`, etc.
**NPM Tag:** `@beta`

#### Flujo de trabajo:

1. Trabaja en la rama `beta` o `develop`
2. Crea un changeset:
   ```bash
   yarn changeset
   ```
3. Commit y push:
   ```bash
   git add .
   git commit -m "feat: nueva funcionalidad"
   git push origin beta
   ```
4. El workflow automáticamente publica a NPM con tag `beta`

**Instalación:**
```bash
npm install rn-sherpa@beta
# o
yarn add rn-sherpa@beta
```

---

### 🟢 Stable Releases (Production)

Versiones estables para producción.

**Rama:** `main`
**Versión:** `0.1.0`, `0.2.0`, `1.0.0`, etc.
**NPM Tag:** `@latest` (default)

#### Flujo de trabajo:

1. Crea una feature branch desde `main`
2. Crea un changeset:
   ```bash
   yarn changeset
   ```
3. Commit y crea un PR hacia `main`
4. Al hacer merge, el workflow crea automáticamente un PR "🚀 Version Packages"
5. Revisa y merge el PR de versiones
6. El workflow publica automáticamente a NPM y crea un GitHub Release

**Instalación:**
```bash
npm install rn-sherpa
# o
yarn add rn-sherpa
```

---

## 📝 Tipos de Cambios

Al crear un changeset, elige el tipo apropiado:

- **patch** - Bugfixes y cambios menores
  - `0.1.0` → `0.1.1`
  - Ejemplo: Corregir un bug, mejorar documentación

- **minor** - Nuevas features (backward compatible)
  - `0.1.0` → `0.2.0`
  - Ejemplo: Agregar un nuevo hook, nueva prop opcional

- **major** - Breaking changes
  - `0.1.0` → `1.0.0`
  - Ejemplo: Cambiar API, remover props, modificar comportamiento

---

## 🛠️ Scripts Disponibles

```bash
# Crear un nuevo changeset
yarn changeset

# Versionar paquetes (testing local)
yarn version-packages

# Publicar a NPM (stable) - manual
yarn release

# Publicar a NPM (beta) - manual
yarn release:beta
```

---

## 🔄 Workflows Automáticos

### CI Workflow
- **Trigger:** Push o PR a `main`
- **Acciones:** Lint, type check, build

### Changeset Version Workflow
- **Trigger:** Push a `main` (excepto version commits)
- **Acciones:** Crea PR con actualizaciones de versión

### Release Workflow
- **Trigger:** Merge de PR de versión
- **Acciones:** Build, publish a NPM, crear GitHub release

### Release Beta Workflow
- **Trigger:** Push a `beta` o `develop`
- **Acciones:** Build, publish a NPM con tag `@beta`

---

## 📋 Ejemplo Completo

### Feature nueva (stable release):

```bash
# 1. Crear feature branch
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios...
# ... código ...

# 3. Crear changeset
yarn changeset
# Seleccionar: rn-sherpa
# Tipo: minor (nueva feature)
# Descripción: "Add new tour animation system"

# 4. Commit
git add .
git commit -m "feat: add new tour animation system"

# 5. Push y crear PR
git push origin feature/nueva-funcionalidad
# Crear PR en GitHub hacia main

# 6. Review y merge PR

# 7. El bot creará PR "🚀 Version Packages"
# - Revisa el CHANGELOG
# - Verifica la versión
# - Merge el PR

# 8. ¡Automáticamente se publica a NPM! 🎉
```

### Bugfix urgente (beta):

```bash
# 1. Switch a beta
git checkout beta

# 2. Hacer fix
# ... código ...

# 3. Crear changeset
yarn changeset
# Tipo: patch
# Descripción: "Fix overlay rendering issue"

# 4. Commit y push
git add .
git commit -m "fix: overlay rendering issue"
git push origin beta

# 5. ¡Se publica automáticamente como beta! 🚀
# Versión: 0.1.0-beta.X
```

---

## ⚙️ Configuración NPM Token

Para que los workflows funcionen, necesitas configurar el `NPM_TOKEN`:

1. Ir a https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Crear un "Automation" token
3. En GitHub: Settings → Secrets and variables → Actions
4. Agregar secret: `NPM_TOKEN`

---

## 🎯 Tips

- Siempre crea changesets descriptivos
- Usa conventional commits: `feat:`, `fix:`, `docs:`, etc.
- Prueba versiones beta antes de stable release
- Revisa el CHANGELOG antes de publicar
- Mantén el README actualizado con breaking changes
