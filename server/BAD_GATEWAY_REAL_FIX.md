# Bad Gateway Hatası - Gerçek Neden

## Durum

- ✅ Environment variables doğru (DB_HOST zaten doğruydu)
- ✅ MySQL container çalışıyor
- ✅ Backend container yeşil ışık
- ❌ Bad Gateway hatası alınıyor

## Olası Nedenler

### 1. Backend Node.js Server Başlamamış
NGINX çalışıyor ama Node.js backend başlamamış olabilir.

**Kontrol:** Backend loglarında şunları arayın:
- ❌ `ERROR: /app/dist/server.js not found!`
- ❌ `❌ Database connection failed`
- ❌ `❌ Environment validation failed`

### 2. Backend Port 3000'de Dinlemiyor
Node.js server başlamış ama port 3000'de dinlemiyor olabilir.

**Kontrol:** Backend loglarında şunu arayın:
- ✅ `🚀 Server is running on port 3000`

### 3. NGINX Backend'e Bağlanamıyor
NGINX çalışıyor ama `localhost:3000`'e bağlanamıyor olabilir.

**Kontrol:** Backend container içinde port kontrolü yapın

### 4. Database Connection Başarısız
Database connection başarısız olduğu için server başlamamış olabilir.

**Kontrol:** Backend loglarında şunu arayın:
- ❌ `❌ Database connection failed after all retries`

## Çözüm: Backend Loglarını Kontrol Edin

Dokploy → Backend Container → **Logs** → Son 100 satırı kontrol edin

**Aranacaklar:**
1. ✅ `✅ Environment variables validated`
2. ✅ `✅ Database connection established successfully`
3. ✅ `🚀 Server is running on port 3000`
4. ❌ Herhangi bir ERROR mesajı

## Hızlı Çözüm

### 1. Backend Container'ı Restart
Dokploy → Backend Container → **Restart**

### 2. Logları Kontrol
Restart sonrası logları kontrol edin:
- Server başladı mı?
- Database bağlantısı başarılı mı?
- Port 3000'de dinliyor mu?

### 3. Eğer Hata Varsa
Backend loglarını paylaşın → "BACKEND LOGLAR: [log mesajları]"

## Şimdi Yapın

1. **Backend Container → Logs** → Son 100 satırı kontrol edin
2. **Hata mesajı var mı?** → Varsa paylaşın
3. **VEYA Backend Container → Restart** → Sonra logları kontrol edin

"BACKEND LOGLAR: [log mesajları]" yazın, gerçek nedeni bulalım.

