# Coolify Unified Deployment Rehberi

## Genel Bakış

Bu rehber, **frontend ve backend'i tek bir container'da** çalıştırmak için hazırlanmıştır. NGINX reverse proxy kullanarak:
- **Frontend**: Static files olarak `/` root'ta serve edilir
- **Backend API**: `/api/*` endpoint'lerinde proxy edilir

## Deployment Yapısı

```
┌─────────────────────────────────┐
│   Unified Container             │
│                                 │
│   ┌──────────┐  ┌──────────┐  │
│   │  NGINX   │  │  Node.js │  │
│   │  :80     │  │  :3000   │  │
│   └────┬─────┘  └────┬─────┘  │
│        │             │         │
│        └─────┬───────┘         │
│              │                 │
│         ┌────▼────┐            │
│         │ Reverse │            │
│         │  Proxy  │            │
│         └─────────┘            │
└─────────────────────────────────┘
         │
         ▼
    wecamp.com.tr
    - / → Frontend (static)
    - /api/* → Backend API
    - /uploads → Backend uploads
```

## Avantajlar

✅ **Tek deployment** - Daha basit yönetim
✅ **Tek domain** - CORS sorunları yok
✅ **Daha az kaynak** - Tek container
✅ **Kolay setup** - Tek application

## Dezavantajlar

❌ **Bağımsız scaling yok** - Frontend ve backend birlikte scale edilir
❌ **Bağımsız güncelleme yok** - Birini güncellerken diğeri de restart olur
❌ **Tek nokta arıza** - Bir servis çökerse diğeri de etkilenir

## Coolify'da Deployment

### 1. Yeni Application Oluşturma

1. Coolify dashboard'da **"Applications"** → **"New Application"**
2. **Application Name**: `wecamp-unified`
3. **Source**: Git repository seçin
4. **Build Pack**: `Docker` seçin

### 2. Dockerfile Konfigürasyonu

- **Dockerfile Path**: `Dockerfile.unified` (root dizinde)
- **Build Context**: `.` (root dizin)
- **Docker Compose**: Kullanmıyoruz

### 3. Environment Variables

#### Backend Environment Variables

**Required Secrets** (Sensitive - Secret olarak işaretle):
```
DB_HOST=wecamp-mysql
DB_USER=wecamp_user
DB_PASSWORD=******** (secret)
DB_NAME=wecamp_marketplace
DB_PORT=3306
JWT_SECRET=******** (min 64 karakter, secret)
JWT_REFRESH_SECRET=******** (min 64 karakter, secret)
FRONTEND_URL=https://wecamp.com.tr
ALLOWED_ORIGINS=https://wecamp.com.tr,https://www.wecamp.com.tr
```

**General Environment Variables**:
```
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=/app/uploads
MAX_USER_UPLOAD_QUOTA=1073741824
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_UPLOADS_PER_HOUR=50
ENABLE_CSRF=false
ENABLE_VIRUS_SCAN=false
REQUIRE_VIRUS_SCAN=false
HTTPS_ENFORCE=true
MAX_JSON_SIZE=1mb
MAX_URLENCODED_SIZE=1mb
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

#### Frontend Build Arguments

**Build Arguments** (Build-time variables):
```
VITE_API_BASE_URL=/api
```

**Önemli**: Frontend build sırasında API base URL'i `/api` olarak ayarlanır (relative path). Bu sayede aynı domain'de çalışır.

### 4. Persistent Volumes

```
/app/uploads → wecamp-unified-uploads
/app/logs → wecamp-unified-logs
```

### 5. MySQL Service

Coolify'da **"Services"** → **"MySQL"** oluşturun:

- **Service Name**: `wecamp-mysql`
- **Version**: `8.0`
- **Database Name**: `wecamp_marketplace`
- **Root Password**: (güçlü bir şifre)
- **Volume**: `wecamp-mysql-data`

**Önemli**: `DB_HOST=wecamp-mysql` olarak ayarlayın (internal service name).

### 6. Domain ve SSL

1. **"Domains"** bölümüne gidin
2. Domain ekleyin: `wecamp.com.tr` ve `www.wecamp.com.tr`
3. SSL: **Let's Encrypt** (otomatik)
4. **Force HTTPS**: Aktif

### 7. Port Mapping

- **Container Port**: `80` (NGINX)
- **Public Port**: Coolify otomatik yönetir

### 8. Health Check

- **Path**: `/health`
- **Interval**: `30s`
- **Timeout**: `3s`
- **Retries**: `3`

### 9. Resource Limits

```
CPU Limit: 1000m
Memory Limit: 512Mi
CPU Request: 500m
Memory Request: 256Mi
```

### 10. Deploy

1. Tüm ayarları kontrol edin
2. **"Deploy"** butonuna tıklayın
3. Build loglarını takip edin
4. Deployment tamamlandığında test edin

## Deployment Sırası

1. **MySQL Service** → Önce database'i deploy edin
2. **Unified Application** → Database hazır olduktan sonra deploy edin

## Frontend API Configuration

Frontend'de API base URL zaten yapılandırılmış:

```typescript
// src/config/index.ts
apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
```

Build sırasında `VITE_API_BASE_URL=/api` olarak ayarlandığı için, frontend otomatik olarak aynı domain'deki `/api` endpoint'ini kullanacak (relative path).

**Önemli**: Build argument olarak `VITE_API_BASE_URL=/api` ayarlayın (absolute URL değil, relative path).

## Deployment Sonrası Kontroller

### 1. Health Check

```bash
curl https://wecamp.com.tr/health
# Backend health check - should return "healthy"
```

### 2. Frontend Erişimi

```bash
curl https://wecamp.com.tr
# Should return HTML (frontend)
```

### 3. API Endpoint Test

```bash
curl https://wecamp.com.tr/api/health
# Should return backend health status
```

### 4. Browser Test

1. `https://wecamp.com.tr` adresini açın
2. Developer Console → Network tab
3. API isteklerinin `/api/*` endpoint'lerine gittiğini kontrol edin
4. CORS hatası olmamalı (aynı domain)

## Troubleshooting

### Backend Çalışmıyor

**Logs kontrol**:
```bash
# Coolify'da application logs'ları kontrol edin
# Supervisor logs: /var/log/supervisor/nodejs.err.log
```

**Çözüm**:
1. Environment variables'ları kontrol edin
2. Database bağlantısını kontrol edin
3. Port 3000'in açık olduğunu kontrol edin

### Frontend Görünmüyor

**Çözüm**:
1. Build'in başarılı olduğunu kontrol edin
2. `/app/frontend-dist` dizininde dosyalar olduğunu kontrol edin
3. NGINX config'i kontrol edin

### API İstekleri Çalışmıyor

**Çözüm**:
1. Backend'in çalıştığını kontrol edin: `curl https://wecamp.com.tr/health`
2. NGINX proxy ayarlarını kontrol edin
3. Frontend'de API base URL'in `/api` olduğunu kontrol edin

### 502 Bad Gateway

**Çözüm**:
1. Backend'in çalıştığını kontrol edin
2. Supervisor'ın her iki servisi de başlattığını kontrol edin
3. Port 3000'in dinlendiğini kontrol edin

## Production Checklist

- [ ] MySQL service deploy edildi ve çalışıyor
- [ ] Environment variables ayarlandı
- [ ] Build arguments ayarlandı (`VITE_API_BASE_URL=/api`)
- [ ] Database migrations çalıştırıldı
- [ ] Health check başarılı: `https://wecamp.com.tr/health`
- [ ] Frontend erişilebilir: `https://wecamp.com.tr`
- [ ] API endpoint'leri çalışıyor: `https://wecamp.com.tr/api/*`
- [ ] SSL sertifikası aktif
- [ ] Persistent volumes mount edildi
- [ ] Logs görüntülenebiliyor
- [ ] Test login başarılı

## Ayrı Deployment vs Unified Deployment

### Ayrı Deployment (Önceki Rehber)
- ✅ Bağımsız scaling
- ✅ Bağımsız güncellemeler
- ✅ Daha iyi resource management
- ❌ Daha karmaşık setup
- ❌ CORS yapılandırması gerekli
- ❌ İki domain gerekli

### Unified Deployment (Bu Rehber)
- ✅ Daha basit setup
- ✅ Tek domain
- ✅ CORS sorunları yok
- ✅ Daha az kaynak
- ❌ Bağımsız scaling yok
- ❌ Bağımsız güncelleme yok

## Sonuç

Unified deployment, **küçük-orta ölçekli projeler** için idealdir. Tek bir container'da hem frontend hem backend çalışır, yönetimi daha basittir.

Eğer proje büyürse ve bağımsız scaling gerekiyorsa, **ayrı deployment** yapısına geçebilirsiniz.

