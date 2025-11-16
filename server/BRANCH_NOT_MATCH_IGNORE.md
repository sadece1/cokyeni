# Branch Not Match - Görmezden Gelebilirsiniz

## Durum

- ✅ GitHub'da 1 branch var (`main`)
- ✅ Dokploy'da da `main` seçili
- ❌ Hala "Branch Not Match" hatası alınıyor

## Önemli

**Branch Not Match hatası Bad Gateway ile ilgili değil!**

Bu hata sadece **deployment webhook'u** için. Eğer deployment'ları **manuel** yapıyorsanız (Dokploy'dan Deploy butonuna basarak), bu hatayı görmezden gelebilirsiniz.

## Asıl Sorun: Bad Gateway

Bad Gateway hatası backend'in çalışmamasından kaynaklanıyor. Backend loglarını kontrol etmeliyiz.

## Çözüm: Backend Loglarını Kontrol Edin

Dokploy → **Backend Container** → **Logs** → Son 100 satırı kontrol edin

**Aranacaklar:**
1. ✅ `✅ Environment variables validated`
2. ✅ `✅ Database connection established successfully`
3. ✅ `🚀 Server is running on port 3000`
4. ❌ Herhangi bir ERROR mesajı

## Olası Hatalar

### Hata 1: Database Connection Failed
```
❌ Database connection attempt 1/5 failed: ...
```

**Çözüm:**
- MySQL container çalışıyor mu?
- `DB_HOST` doğru mu?

### Hata 2: server.js Not Found
```
ERROR: /app/dist/server.js not found!
```

**Çözüm:** Backend container'ı **redeploy** edin

### Hata 3: Environment Validation Failed
```
❌ Environment validation failed: ...
```

**Çözüm:** Eksik environment variable'ı ekleyin

## Branch Not Match İçin

Eğer deployment'ları manuel yapıyorsanız:
- ✅ Bu hatayı görmezden gelebilirsiniz
- ✅ Dokploy'dan **Deploy** butonuna basarak deployment yapabilirsiniz

Eğer otomatik deployment istiyorsanız:
- GitHub webhook ayarlarını kontrol edin
- Dokploy webhook URL'ini kontrol edin

## Şimdi Yapın

1. **Backend Container → Logs** → Son 100 satırı kontrol edin
2. **Hata mesajı var mı?** → Varsa paylaşın
3. **VEYA Backend Container → Restart** → Sonra logları kontrol edin

**"BACKEND LOGLAR: [log mesajları]"** yazın, Bad Gateway hatasını çözelim.

Branch Not Match hatasını şimdilik görmezden gelebilirsiniz - deployment'ları manuel yapabilirsiniz.

