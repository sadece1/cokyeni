# InnoDB Lock Hatalarını Çözme - Detaylı Rehber

## Hata
```
[ERROR] [MY-012574] [InnoDB] Unable to lock ./ibdata1 error: 11
[ERROR] [MY-012574] [InnoDB] Unable to lock ./#ib_16384_0.dblwr error: 11
```

**Error 11** = EAGAIN (Resource temporarily unavailable)

## Neden Oluşur?

1. **Docker Volume Mount Sorunları**
   - Volume'un file system type'ı (ext4, xfs, vb.) ile uyumsuzluk
   - Volume permissions sorunları
   - Volume'un birden fazla container tarafından kullanılması

2. **MySQL 8.4.7 Bilinen Sorunu**
   - InnoDB dosya kilitleme mekanizması Docker container içinde sorun yaşıyor
   - MySQL 8.4.7'de bu hata yaygın

3. **InnoDB Native AIO Sorunu**
   - `MYSQL_INNODB_USE_NATIVE_AIO=0` eklenmiş ama yeterli olmamış

## Çözüm 1: MySQL Container'ı Yeniden Oluşturma (Önerilen)

### Adımlar:
1. **Backup alın** (eğer önemli veri varsa)
   - Dokploy → MySQL Container → Volumes → Volume'u export edin

2. **MySQL Container'ı silin** (volume'u silmeden!)
   - Dokploy → MySQL Container → **Delete**
   - ⚠️ **Volume'u silmeyin!**

3. **Yeni MySQL container oluşturun**
   - Aynı volume'u kullanın
   - Tüm environment variables'ları ekleyin:
     ```
     MYSQL_ROOT_PASSWORD=R96f5Lh9-fPGZPY
     MYSQL_DATABASE=wecamp_marketplace
     MYSQL_USER=root
     MYSQL_PASSWORD=R96f5Lh9-fPGZPY
     MYSQL_INNODB_USE_NATIVE_AIO=0
     MYSQL_INNODB_FLUSH_LOG_AT_TRX_COMMIT=2
     MYSQL_INNODB_FLUSH_METHOD=O_DIRECT
     MYSQL_SKIP_INNODB_LOCK_CHECK=1
     MYSQL_SKIP_SSL=1
     MYSQL_LOG_LEVEL=ERROR
     ```

4. **Container'ı başlatın**

## Çözüm 2: MySQL Versiyonunu Düşürme

MySQL 8.4.7 yerine **8.0.x** kullanın (daha stabil):

Dokploy → MySQL Container → Image:
- `mysql:8.0` veya `mysql:8.0.35`

MySQL 8.0.x'de bu hata daha az görülür.

## Çözüm 3: Volume Permissions Düzeltme

Dokploy → MySQL Container → Volumes:
- Volume'un **read-write** modda olduğundan emin olun
- Volume'un **owner** ayarlarını kontrol edin
- Volume'un başka bir container tarafından kullanılmadığından emin olun

## Çözüm 4: Ek Environment Variables

Dokploy → MySQL Container → Environment → **Ekleyin:**

```
MYSQL_INNODB_FILE_PER_TABLE=1
MYSQL_INNODB_BUFFER_POOL_SIZE=128M
MYSQL_INNODB_LOG_FILE_SIZE=64M
MYSQL_INNODB_FLUSH_METHOD=O_DIRECT
```

## Çözüm 5: Custom MySQL Config Dosyası

`server/mysql-custom.cnf` dosyasını MySQL container'a mount edin:

Dokploy → MySQL Container → Volumes:
- **Volume Name:** `mysql-config` (yeni oluştur)
- **Mount Path:** `/etc/mysql/conf.d/custom.cnf`
- **Content:** `server/mysql-custom.cnf` dosyasının içeriği

## Önemli Not

⚠️ **Bu hatalar MySQL'in çalışmasını engellemez!**

MySQL **başarıyla başlıyor** ve **çalışıyor**. Bu hatalar sadece **başlangıç sırasında** görülür.

**Önemli olan:** Backend'in MySQL'e bağlanıp bağlanamadığı. Backend loglarını kontrol edin!

## Önerilen Sıra

1. ✅ **Backend loglarını kontrol edin** → MySQL'e bağlanabiliyor mu?
2. ✅ Eğer backend çalışıyorsa → **Görmezden gelebilirsiniz**
3. ✅ Eğer backend çalışmıyorsa → **MySQL container'ı yeniden oluşturun**

