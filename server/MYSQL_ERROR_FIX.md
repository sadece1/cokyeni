# MySQL InnoDB Lock Hatalarını Çözme

## Hata
```
[ERROR] [MY-012574] [InnoDB] Unable to lock ./ibdata1 error: 11
[ERROR] [MY-012574] [InnoDB] Unable to lock ./#ib_16384_0.dblwr error: 11
```

**Error 11** = "Resource temporarily unavailable" (EAGAIN)

## Neden Oluşur?
1. Docker volume mount permissions sorunları
2. InnoDB dosya kilitleme sorunları
3. Volume'un birden fazla container tarafından kullanılması
4. Volume'un düzgün mount edilmemesi

## Çözüm 1: Environment Variables (Kontrol)

Dokploy → MySQL Container → Environment → **Şunların hepsi olmalı:**

```
MYSQL_INNODB_USE_NATIVE_AIO=0
MYSQL_SKIP_INNODB_LOCK_CHECK=1
MYSQL_INNODB_FLUSH_LOG_AT_TRX_COMMIT=2
MYSQL_INNODB_FLUSH_METHOD=O_DIRECT
```

## Çözüm 2: Volume Permissions (Önemli!)

Dokploy → MySQL Container → Volumes:
- Volume'un **read-write** modda olduğundan emin olun
- Volume'un **owner** ayarlarını kontrol edin
- Volume'un başka bir container tarafından kullanılmadığından emin olun

## Çözüm 3: MySQL Container'ı Tamamen Yeniden Oluşturma

1. **Backup alın** (eğer önemli veri varsa)
2. Dokploy → MySQL Container → **Delete** (volume'u silmeden)
3. Yeni MySQL container oluşturun
4. Aynı volume'u kullanın
5. Tüm environment variables'ları ekleyin

## Çözüm 4: Volume'u Temizleme (Son Çare)

⚠️ **DİKKAT:** Bu işlem tüm verileri siler!

1. Dokploy → MySQL Container → **Stop**
2. Dokploy → Volumes → MySQL volume'u **Delete**
3. Yeni volume oluşturun
4. MySQL container'ı yeniden oluşturun

## Çözüm 5: Log Seviyesini Düşürme (Geçici)

Eğer hatalar devam ederse ama MySQL çalışıyorsa:

```
MYSQL_LOG_LEVEL=ERROR
```

Bu, sadece kritik hataları gösterir, InnoDB lock uyarılarını gizler.

## Önerilen Adımlar

1. ✅ Environment variables'ları kontrol edin
2. ✅ Volume permissions'ı kontrol edin
3. ✅ MySQL container'ı **restart** edin
4. ✅ Hatalar devam ederse → Container'ı **delete** ve **yeniden oluşturun** (volume'u koruyarak)

## Not

Bu hatalar MySQL'in **başlangıcında** görülür ama MySQL **başarıyla başlar** ve çalışır. Ancak logları temiz tutmak için yukarıdaki çözümleri deneyin.

