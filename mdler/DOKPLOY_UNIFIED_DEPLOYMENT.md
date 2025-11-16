# Dokploy Unified Deployment Rehberi

## Genel Bakış

Bu rehber, **frontend ve backend'i tek bir container'da** Dokploy ile deploy etmek için hazırlanmıştır. NGINX reverse proxy kullanarak:
- **Frontend**: Static files olarak `/` root'ta serve edilir
- **Backend API**: `/api/*` endpoint'lerinde proxy edilir
- **Uploads**: `/uploads` endpoint'inde serve edilir

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
    sadece1deneme.com
    - / → Frontend (static)
    - /api/* → Backend API
    - /uploads → Backend uploads
```

## Avantajlar

✅ **Tek deployment** - Daha basit yönetim
✅ **Tek domain** - CORS sorunları yok
✅ **Daha az kaynak** - Tek container
✅ **Kolay setup** - Tek application
✅ **Internete açılabilir** - Port 80 üzerinden

## Dokploy'da Deployment

### 1. Yeni Application Oluşturma

1. Dokploy dashboard'da **"Projects"** → **"New Project"** veya mevcut projeye **"New Application"**
2. **Application Name**: `wecamp-unified`
3. **Type**: Docker
4. **Source**: Git repository seçin veya `dokploy.json` dosyasını import edin

### 2. Dockerfile Konfigürasyonu

- **Dockerfile Path**: `Dockerfile.unified` (root dizinde)
- **Build Context**: `.` (root dizin)
- **Build Arguments**: 
  ```
  VITE_API_BASE_URL=/api
  ```

**Önemli**: `VITE_API_BASE_URL=/api` relative path olmalı (absolute URL değil). Bu sayede aynı domain'de çalışır.

### 3. Environment Variables

#### Secrets (Gizli Bilgiler - Dokploy'da Secret olarak işaretle)

```
DB_HOST=dfgdfg-wecampmysql-c6zsle
DB_USER=root
DB_PASSWORD=******** (MySQL şifresi)
DB_NAME=wecamp_marketplace
DB_PORT=3306
JWT_SECRET=******** (min 32 karakter, önerilen 64+)
JWT_REFRESH_SECRET=******** (opsiyonel, JWT_SECRET kullanılır)
FRONTEND_URL=https://sadece1deneme.com
ALLOWED_ORIGINS=https://sadece1deneme.com,https://www.sadece1deneme.com
```

**Not**: `DB_HOST` değeri **MySQL container'ın tam adı** olmalı. Dokploy'da container'lar birbirine container adı ile bağlanır.

#### Normal Environment Variables

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

### 4. Persistent Volumes

```
/app/uploads → wecamp-unified-uploads
/app/logs → wecamp-unified-logs
```

### 5. MySQL Service

MySQL container'ın çalıştığından emin olun:

- **Container Name**: `dfgdfg-wecampmysql-c6zsle` (veya Dokploy'da görünen tam ad)
- **Database Name**: `wecamp_marketplace`
- **User**: `root` (veya oluşturduğunuz user)
- **Password**: MySQL şifresi

**Önemli**: `DB_HOST` environment variable'ında MySQL container'ın **tam adını** kullanın.

### 6. Domain ve SSL

1. **"Domains"** bölümüne gidin
2. Domain ekleyin: `sadece1deneme.com` ve `www.sadece1deneme.com`
3. SSL: **Let's Encrypt** (otomatik)
4. **Force HTTPS**: Aktif

### 7. Port Mapping

- **Container Port**: `80` (NGINX)
- **Public Port**: `80` (veya Dokploy otomatik yönetir)

### 8. Health Check

- **Path**: `/health`
- **Interval**: `30s`
- **Timeout**: `3s`
- **Retries**: `3`
- **Start Period**: `40s` (NGINX + Node.js başlatma süresi)

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

1. **MySQL Service** → Önce database'i deploy edin ve çalıştığından emin olun
2. **Unified Application** → Database hazır olduktan sonra deploy edin

## Frontend API Configuration

Frontend'de API base URL zaten yapılandırılmış:

```typescript
// src/config/index.ts
apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
```

Build sırasında `VITE_API_BASE_URL=/api` olarak ayarlandığı için, frontend otomatik olarak aynı domain'deki `/api` endpoint'ini kullanacak (relative path).

## Deployment Sonrası Kontroller

### 1. Health Check

```bash
curl https://sadece1deneme.com/health
# Backend health check - should return "healthy"
```

### 2. Frontend Erişimi

```bash
curl https://sadece1deneme.com
# Should return HTML (frontend)
```

### 3. API Endpoint Test

```bash
curl https://sadece1deneme.com/api/health
# Should return backend health status
```

### 4. Browser Test

1. `https://sadece1deneme.com` adresini açın
2. Developer Console → Network tab
3. API isteklerinin `/api/*` endpoint'lerine gittiğini kontrol edin
4. CORS hatası olmamalı (aynı domain)

## Troubleshooting

### Backend Çalışmıyor

**Logs kontrol**:
```
Dokploy → wecamp-unified → Logs
```

**Çözüm**:
1. Environment variables'ları kontrol edin
2. Database bağlantısını kontrol edin (`DB_HOST` doğru mu?)
3. Port 3000'in açık olduğunu kontrol edin
4. Supervisor logs: `/var/log/supervisor/nodejs.err.log`

### Frontend Görünmüyor

**Çözüm**:
1. Build'in başarılı olduğunu kontrol edin
2. `/app/frontend-dist` dizininde dosyalar olduğunu kontrol edin
3. NGINX config'i kontrol edin

### API İstekleri Çalışmıyor

**Çözüm**:
1. Backend'in çalıştığını kontrol edin: `curl https://sadece1deneme.com/health`
2. NGINX proxy ayarlarını kontrol edin
3. Frontend'de API base URL'in `/api` olduğunu kontrol edin

### 502 Bad Gateway

**Çözüm**:
1. Backend'in çalıştığını kontrol edin
2. Supervisor'ın her iki servisi de başlattığını kontrol edin
3. Port 3000'in dinlendiğini kontrol edin
4. Container logs'ları kontrol edin

### Database Bağlantı Hatası

**Çözüm**:
1. MySQL container'ın çalıştığını kontrol edin
2. `DB_HOST` değerinin MySQL container'ın **tam adı** olduğunu kontrol edin
3. `DB_USER`, `DB_PASSWORD`, `DB_NAME` değerlerini kontrol edin
4. MySQL container'ın aynı Docker network'ünde olduğunu kontrol edin

## Production Checklist

- [ ] MySQL service deploy edildi ve çalışıyor
- [ ] MySQL container adı doğru (`DB_HOST`)
- [ ] Environment variables ayarlandı
- [ ] Secrets ayarlandı (DB_PASSWORD, JWT_SECRET)
- [ ] Build arguments ayarlandı (`VITE_API_BASE_URL=/api`)
- [ ] Database migrations çalıştırıldı
- [ ] Health check başarılı: `https://sadece1deneme.com/health`
- [ ] Frontend erişilebilir: `https://sadece1deneme.com`
- [ ] API endpoint'leri çalışıyor: `https://sadece1deneme.com/api/*`
- [ ] SSL sertifikası aktif
- [ ] Persistent volumes mount edildi
- [ ] Logs görüntülenebiliyor
- [ ] Test login başarılı

## Ayrı Deployment vs Unified Deployment

### Ayrı Deployment
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

## Önemli Notlar

1. ✅ `Dockerfile.unified` kullanılmalı (normal Dockerfile değil)
2. ✅ `VITE_API_BASE_URL=/api` olmalı (relative path, absolute URL değil)
3. ✅ MySQL container adı doğru olmalı (`DB_HOST`)
4. ✅ Supervisor hem NGINX hem Node.js'i başlatır
5. ✅ Port 80 üzerinden internete açılabilir
6. ✅ Tek domain kullanılır (CORS sorunları yok)

