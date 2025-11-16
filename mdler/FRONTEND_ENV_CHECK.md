# Frontend Environment Variable Kontrolü

## ✅ Environment Variable Doğru

```
VITE_API_BASE_URL=https://api.sadece1deneme.com/api
```

Bu değer **doğru** görünüyor.

## Kontrol Edilmesi Gerekenler

### 1. Frontend Container'da Environment Variable Var mı?

Dokploy → **Frontend Container** → **Environment** → Kontrol edin:
- ✅ `VITE_API_BASE_URL=https://api.sadece1deneme.com/api` olmalı

### 2. Vite Build Sırasında Değişken Enjekte Ediliyor mu?

Vite, environment variable'ları **build sırasında** enjekte eder. Eğer build'den önce eklenmemişse, çalışmaz.

**Çözüm:** Frontend container'ı **redeploy** edin (build sırasında environment variable'ı alır).

### 3. URL Formatı Doğru mu?

✅ `https://api.sadece1deneme.com/api` - **Doğru**
- ✅ `https://` protokolü var
- ✅ Domain doğru: `api.sadece1deneme.com`
- ✅ Path doğru: `/api`

## Frontend Config Kontrolü

`src/config/index.ts` dosyasında:
```typescript
apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
```

Bu, `VITE_API_BASE_URL` environment variable'ını kullanıyor. Eğer yoksa, `http://localhost:8000/api` fallback değerini kullanır.

## Çözüm

### 1. Frontend Container Environment Variables Kontrolü

Dokploy → **Frontend Container** → **Environment**:
- ✅ `VITE_API_BASE_URL=https://api.sadece1deneme.com/api` olmalı

### 2. Frontend Container'ı Redeploy Edin

Environment variable eklendikten sonra:
- Dokploy → **Frontend Container** → **Deploy** veya **Redeploy**
- Build sırasında environment variable enjekte edilir

### 3. Frontend'i Test Edin

Tarayıcıda:
```
https://sadece1deneme.com
```

Browser Console'da (F12):
- Network tab'ında API isteklerini kontrol edin
- İstekler `https://api.sadece1deneme.com/api` adresine gidiyor mu?

## Önemli Not

Vite environment variable'ları **build time**'da enjekte eder. Eğer environment variable build'den sonra eklendiyse, **frontend'i yeniden build etmeniz** (redeploy) gerekir.

## Şimdi Yapın

1. ✅ **Frontend Container → Environment** → `VITE_API_BASE_URL=https://api.sadece1deneme.com/api` var mı?
2. ✅ **Frontend Container → Deploy** (redeploy) → Build sırasında environment variable enjekte edilir
3. ✅ **Frontend'i test edin** → `https://sadece1deneme.com` → Network tab'ında API isteklerini kontrol edin

"FRONTEND ENV VAR VAR, REDEPLOY YAPTIM" yazın, sonra test edelim.

