# Backend Node.js Başlamıyor - Debug

## ✅ MySQL Durumu

- ✅ MySQL çalışıyor ("ready for connections")
- ✅ Tüm environment variables doğru
- ✅ InnoDB lock hataları (kritik değil)

## ❌ Backend Node.js Başlamıyor

Bad Gateway hatası → Backend Node.js başlamamış.

## Backend Loglarını Kontrol Edin

Dokploy → **Backend Container** → **Logs**

**Kontrol edin:**

### 1. Container Başlangıç Mesajları Var mı?

Loglarda şunlar görünmeli:
```
=== CONTAINER STARTING ===
Current directory: /app
Files in /app:
Files in /app/dist:
Starting NGINX...
NGINX started successfully (PID: X)
Starting Node.js server...
Running: node /app/dist/server.js
```

**Eğer bu mesajlar YOKSA:**
- `start.sh` script'i çalışmıyor
- Backend container'ı **redeploy** edin

### 2. Node.js Başlangıç Mesajları Var mı?

Loglarda şunlar görünmeli:
```
✅ Environment variables validated
📊 Database Configuration:
  Host: dfgdfg-wecampmysql-c6zsle
  Port: 3306
  User: root
  Database: wecamp_marketplace
✅ Database connection established successfully
🚀 Server is running on port 3000 in production mode
```

**Eğer bu mesajlar YOKSA:**
- Node.js başlamıyor veya hata veriyor
- Hata mesajını kontrol edin

### 3. Hata Mesajları Var mı?

Loglarda şunlar görülebilir:
- `ERROR: /app/dist/server.js not found!`
- `❌ Database connection failed`
- `❌ Environment validation failed`
- `Error: Cannot find module ...`

## Hızlı Çözüm

### 1. Backend Container'ı Redeploy Edin

Dokploy → **Backend Container** → **Deploy** veya **Redeploy**

`start.sh` script'i güncellendi, redeploy sonrası loglar görünmeli.

### 2. Backend Loglarını Kontrol Edin

Redeploy sonrası:
- Dokploy → **Backend Container** → **Logs**
- Tüm logları kontrol edin
- Hata mesajı var mı?

### 3. Eğer Hata Varsa

Hata mesajını paylaşın → "BACKEND LOGLAR: [log mesajları]"

## Şimdi Yapın

1. ✅ **Backend Container → Deploy** (redeploy)
2. ✅ **Backend Container → Logs** → Tüm logları kontrol edin
3. ✅ **Hata mesajı var mı?** → Varsa paylaşın

**"REDEPLOY YAPTIM, LOGLAR: [log mesajları]"** yazın.

