# MySQL Versiyon Downgrade Hatası

## Hata
```
[ERROR] [MY-014061] [InnoDB] Invalid MySQL server downgrade: Cannot downgrade from 80407 to 80035. 
Downgrade is only permitted between patch releases.
```

## Neden?
- MySQL 8.4.7 formatında veriler var (volume'da)
- MySQL 8.0.35 bu formatı okuyamıyor
- MySQL downgrade sadece **patch release'ler** arasında yapılabilir (örn: 8.4.7 → 8.4.6)
- **Major/minor versiyon** downgrade yapılamaz (8.4.x → 8.0.x)

## Çözüm 1: MySQL 8.4.7'e Geri Dön (Önerilen)

### Adımlar:
1. Dokploy → MySQL Container → **Delete** (volume'u silmeden)
2. Yeni MySQL container oluşturun
3. **Image:** `mysql:8.4.7` veya `mysql:8.4`
4. Aynı volume'u kullanın
5. Tüm environment variables'ları ekleyin
6. Container'ı başlatın

**Sonuç:** Veriler korunur, MySQL çalışır.

## Çözüm 2: Volume'u Temizleyip 8.0.35 ile Baştan Başla

⚠️ **DİKKAT:** Bu işlem **TÜM VERİLERİ SİLER!**

### Adımlar:
1. Dokploy → MySQL Container → **Delete**
2. Dokploy → Volumes → MySQL volume'u **Delete**
3. Yeni volume oluşturun
4. MySQL 8.0.35 container'ı oluşturun
5. Tüm environment variables'ları ekleyin

**Sonuç:** Veriler kaybolur, temiz başlangıç.

## Çözüm 3: Mevcut Hataları Görmezden Gel (En Pratik)

MySQL 8.4.7 **çalışıyor** (InnoDB lock hataları sadece başlangıçta görülür).

### Adımlar:
1. MySQL 8.4.7'e geri dönün
2. InnoDB lock hatalarını görmezden gelin
3. Backend'in MySQL'e bağlanıp bağlanamadığını kontrol edin

**Sonuç:** Sistem çalışır, hatalar sadece loglarda görünür.

## Önerilen: Çözüm 1

MySQL 8.4.7'e geri dönün çünkü:
- ✅ Veriler korunur
- ✅ MySQL çalışıyor
- ✅ InnoDB lock hataları sadece başlangıçta görülür, çalışmayı engellemez

## Sonuç

MySQL versiyon downgrade **yapılamaz**. MySQL 8.4.7'e geri dönün ve InnoDB lock hatalarını görmezden gelin - MySQL çalışıyor!

