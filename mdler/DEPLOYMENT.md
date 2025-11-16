# WeCamp Frontend Deployment Guide

## Hostinger VPS + Dokploy Deployment

Frontend uygulamasının Hostinger VPS'te Dokploy ile deployment rehberi.

## Ön Hazırlık

### 1. Backend API'nin Hazır Olması

Frontend deploy edilmeden önce backend API'nin çalışır durumda olması gerekir.
Backend deployment için: `server/DEPLOYMENT.md` dosyasına bakın.

## Deployment Adımları

### 1. Environment Variables Ayarlama

Proje root dizininde `.env` dosyası oluşturun:

```env
VITE_API_BASE_URL=https://api.wecamp.com.tr/api
VITE_APP_NAME=WeCamp
VITE_APP_DESCRIPTION=Doğada unutulmaz kamp deneyimleri için kamp alanları ve kiralık kamp malzemeleri
```

**Önemli**: `.env` dosyasını asla git'e commit etmeyin!

### 2. Build ve Deploy

#### Option 1: Dokploy ile Otomatik Build

1. Dokploy panelinde "Applications" → "Create Application"
2. "Node.js" veya "Docker" seçin
3. Repository URL'yi girin veya dosyaları upload edin

**Build Commands**:
```bash
npm ci
npm run build
```

**Output Directory**: `dist`

#### Option 2: Manuel Build ve Upload

```bash
# Local'de build et
npm run build

# dist klasörünü server'a yükle
# Dokploy static hosting veya NGINX ile serve et
```

### 3. Dokploy Static Hosting Yapılandırması

1. Dokploy panelinde "Static Sites" bölümüne gidin
2. "Create Static Site" tıklayın
3. Ayarlar:
   - **Name**: wecamp-frontend
   - **Build Command**: `npm ci && npm run build`
   - **Output Directory**: dist
   - **Node Version**: 18

### 4. Domain ve SSL Ayarları

1. Domain ekleyin: `wecamp.com.tr` ve `www.wecamp.com.tr`
2. SSL Certificate: Let's Encrypt
3. Auto-redirect www to non-www (veya tersi, tercihinize göre)

**DNS Ayarları (Hostinger Domain Panel)**:
```
A Record: wecamp.com.tr → [VPS IP Adresi]
A Record: www.wecamp.com.tr → [VPS IP Adresi]
```

### 5. NGINX Konfigürasyonu (Eğer Dokploy Static değil de manual NGINX kullanıyorsanız)

`nginx.conf` dosyası proje root'unda hazır durumda. Bu dosya:
- SPA routing için index.html fallback
- Gzip compression
- Cache headers
- Security headers
- Health check endpoint

Dokploy bu dosyayı otomatik kullanacaktır.

### 6. Deployment'ı Başlatma

1. Tüm ayarları kontrol edin
2. "Deploy" butonuna tıklayın
3. Build loglarını takip edin
4. Deployment tamamlandığında siteyi ziyaret edin: `https://wecamp.com.tr`

## Deployment Sonrası Kontroller

### Frontend Erişimi
```bash
curl https://wecamp.com.tr
```

### API Bağlantısı
1. Siteyi açın
2. Developer Console'u açın
3. Network tab'inde API isteklerini kontrol edin
4. `https://api.wecamp.com.tr/api` adresine istekler gittiğini doğrulayın

### Test Login
1. Siteyi açın
2. Login sayfasına gidin: `https://wecamp.com.tr/login`
3. Admin credentials ile giriş yapın:
   - Email: `admin@campscape.com`
   - Password: `Admin123!`

## Environment Variables Özeti

### Development (.env.local)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=WeCamp
VITE_APP_DESCRIPTION=Doğada unutulmaz kamp deneyimleri için kamp alanları ve kiralık kamp malzemeleri
```

### Production (.env)
```env
VITE_API_BASE_URL=https://api.wecamp.com.tr/api
VITE_APP_NAME=WeCamp
VITE_APP_DESCRIPTION=Doğada unutulmaz kamp deneyimleri için kamp alanları ve kiralık kamp malzemeleri
```

## Build Optimizasyonu

Build sırasında Vite otomatik olarak:
- Code splitting
- Minification
- Tree shaking
- Asset optimization
yapar.

### Build Boyutunu Kontrol Etme
```bash
npm run build
# dist klasörünün boyutunu kontrol edin
du -sh dist/
```

### Build Performansını İyileştirme

Eğer build çok uzun sürüyorsa:
1. `vite.config.ts`'de build optimization ayarlarını kontrol edin
2. Gereksiz dependencies'leri kaldırın
3. Dynamic imports kullanın

## Güvenlik

### API Base URL
- Production'da HTTPS kullanın
- Backend API CORS ayarlarını doğru yapın
- Frontend domain'i backend ALLOWED_ORIGINS'e ekleyin

### Authentication
- Token'lar localStorage'da saklanır
- Otomatik logout 401 hatalarında
- XSS protection (Vite default)

### CSP (Content Security Policy)
NGINX konfigürasyonunda security headers tanımlı.

## Monitoring ve Analytics

### Error Tracking
Hataları takip etmek için:
1. Browser console'da hataları kontrol edin
2. Backend logs'unda API hatalarını kontrol edin

### Performance
- Lighthouse ile performance score kontrol edin
- Core Web Vitals'ı izleyin

## Güncelleme ve Bakım

### Yeni Version Deploy Etme

1. Kod değişikliklerini yap
2. Local'de test et: `npm run dev`
3. Build et: `npm run build`
4. Dokploy'da "Rebuild" tıkla veya git push ile otomatik deploy

### Cache Temizleme

Yeni version'dan sonra kullanıcılar eski versiyonu görüyorsa:
1. Build hash'leri otomatik değişir (Vite)
2. Kullanıcılara hard refresh yapmaları söylenebilir (Ctrl+Shift+R)
3. Service Worker kullanıyorsanız, update stratejisi uygulayın

## Sorun Giderme

### Blank Page / White Screen
1. Browser console'da JavaScript hatalarını kontrol edin
2. Network tab'de failed requests kontrol edin
3. `.env` dosyasının doğru olduğunu kontrol edin
4. Build'in başarılı olduğunu kontrol edin

### API Connection Errors
1. Backend'in çalıştığını kontrol edin
2. CORS ayarlarını kontrol edin
3. VITE_API_BASE_URL'in doğru olduğunu kontrol edin
4. Network tab'de request headers'ları kontrol edin

### 404 on Page Refresh
- NGINX konfigürasyonunun SPA fallback içerdiğini kontrol edin
- `try_files $uri $uri/ /index.html;` satırının olduğundan emin olun

### Slow Loading
1. Build bundle size'ı kontrol edin
2. Code splitting yapılmış mı kontrol edin
3. Images optimize edilmiş mi kontrol edin
4. CDN kullanımı düşünün

## Production Checklist

- [ ] Backend API çalışıyor ve erişilebilir
- [ ] .env dosyası production values ile oluşturuldu
- [ ] Build başarılı: `npm run build`
- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası aktif (Let's Encrypt)
- [ ] API CORS ayarları frontend domain'i içeriyor
- [ ] Admin şifresi değiştirildi
- [ ] Test login başarılı
- [ ] Tüm sayfalar çalışıyor
- [ ] Responsive design mobilde test edildi
- [ ] Browser console'da hata yok
- [ ] Performance acceptable (Lighthouse > 80)

## Destek ve İletişim

Sorun yaşarsanız:
1. Browser Developer Tools → Console ve Network tabs
2. Backend API health check: `https://api.wecamp.com.tr/health`
3. Dokploy build logs
4. NGINX error logs

## Environment Variables Reference

| Variable | Development | Production | Açıklama |
|----------|-------------|------------|----------|
| VITE_API_BASE_URL | http://localhost:3000/api | https://api.wecamp.com.tr/api | Backend API base URL |
| VITE_APP_NAME | WeCamp | WeCamp | Uygulama adı |
| VITE_APP_DESCRIPTION | [açıklama] | [açıklama] | Uygulama açıklaması |

## Next Steps

Deployment tamamlandıktan sonra:
1. Google Analytics ekleyin (opsiyonel)
2. SEO optimizasyonu yapın
3. Sitemap oluşturun
4. robots.txt ekleyin
5. Favicon ve meta tags'leri güncelleyin
6. Social media preview'ları test edin
7. Mobile app wrapper düşünün (opsiyonel)

