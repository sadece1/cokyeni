# MySQL Uyarılarını Tamamen Kaldırma

## Mevcut Uyarılar

1. ⚠️ `CA certificate ca.pem is self signed` - Self-signed sertifika uyarısı
2. ⚠️ `Insecure configuration for --pid-file` - PID file güvenlik uyarısı

## Çözüm: Environment Variables

Dokploy → MySQL Container → Environment → **Şu değişkenleri ekleyin:**

### SSL Uyarısını Kaldırmak İçin:
```
MYSQL_SKIP_SSL=1
```

**VEYA** (eğer yukarıdaki çalışmazsa):
```
MYSQL_SSL_MODE=DISABLED
```

### PID File Uyarısını Azaltmak İçin:
Bu uyarı Docker container içinde normal bir durumdur ve MySQL'in çalışmasını engellemez. Ancak log seviyesini düşürerek azaltabiliriz:

```
MYSQL_LOG_LEVEL=ERROR
```

**VEYA** sadece kritik hataları görmek için:
```
MYSQL_LOG_LEVEL=1
```

## Alternatif: Custom Config Dosyası Mount

Eğer environment variables yeterli olmazsa, `server/mysql-custom.cnf` dosyasını MySQL container'a mount edin:

Dokploy → MySQL Container → Volumes:
- **Volume Name:** `mysql-config` (yeni oluştur)
- **Mount Path:** `/etc/mysql/conf.d/custom.cnf`
- **Content:** `server/mysql-custom.cnf` dosyasının içeriği

## Önemli Not

Bu uyarılar MySQL'in çalışmasını **engellemez**. MySQL "ready for connections" durumunda ve backend bağlanabilir.

Ancak logları temiz tutmak için yukarıdaki environment variables'ları ekleyebilirsiniz.

