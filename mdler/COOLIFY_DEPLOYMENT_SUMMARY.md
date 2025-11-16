# Coolify Deployment - Hızlı Başlangıç

## İki Seçenek Var

### 1. Ayrı Deployment (Önerilen - Production için)
- ✅ Backend ve Frontend ayrı container'larda
- ✅ Bağımsız scaling
- ✅ Bağımsız güncellemeler
- 📄 **Rehber**: `COOLIFY_DEPLOYMENT.md`

**Yapı**:
```
Frontend (wecamp.com.tr) → Backend (api.wecamp.com.tr) → MySQL
```

### 2. Unified Deployment (Basit - Küçük projeler için)
- ✅ Tek container'da hem frontend hem backend
- ✅ Tek domain
- ✅ Daha basit setup
- 📄 **Rehber**: `COOLIFY_UNIFIED_DEPLOYMENT.md`

**Yapı**:
```
Unified Container (wecamp.com.tr)
  - / → Frontend
  - /api → Backend
  - MySQL (ayrı service)
```

## Hangi Seçeneği Seçmeliyim?

### Unified Deployment Seçin Eğer:
- ✅ Küçük-orta ölçekli proje
- ✅ Basit setup istiyorsunuz
- ✅ Tek domain kullanmak istiyorsunuz
- ✅ CORS yapılandırmasından kaçınmak istiyorsunuz

### Ayrı Deployment Seçin Eğer:
- ✅ Production ortamı
- ✅ Yüksek trafik bekleniyor
- ✅ Bağımsız scaling gerekiyor
- ✅ Frontend ve backend'i ayrı güncellemek istiyorsunuz

## Unified Deployment Hızlı Başlangıç

### 1. Coolify'da Application Oluştur
- Name: `wecamp-unified`
- Dockerfile: `Dockerfile.unified`
- Build Context: `.`

### 2. Build Arguments
```
VITE_API_BASE_URL=/api
```

### 3. Environment Variables
Backend için gerekli tüm env vars (DB, JWT, vs.)

### 4. Domain
- `wecamp.com.tr`
- SSL: Let's Encrypt

### 5. Deploy!

## Dosyalar

- `Dockerfile.unified` - Unified container için Dockerfile
- `nginx.unified.conf` - NGINX config (frontend + backend proxy)
- `supervisord.conf` - NGINX + Node.js'yi birlikte çalıştırır
- `COOLIFY_UNIFIED_DEPLOYMENT.md` - Detaylı rehber

## Notlar

- Frontend build sırasında `VITE_API_BASE_URL=/api` olarak ayarlanır
- Backend `/api/*` endpoint'lerinde çalışır
- NGINX frontend'i serve eder, `/api` isteklerini backend'e proxy eder
- Supervisor hem NGINX hem Node.js'yi çalıştırır

