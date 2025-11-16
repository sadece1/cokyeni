# Container Not Found Hatası

## Hata
```
Error response from daemon: No such container: select-a-container
```

## Neden Oluşur?

1. **Container adı yanlış yazılmış**
   - Dokploy'da container adı farklı olabilir
   - Container silinmiş olabilir

2. **Container henüz oluşturulmamış**
   - Container deploy edilmemiş
   - Container başlatılmamış

3. **Dokploy'da container seçilmemiş**
   - Bir komut çalıştırırken container seçilmemiş
   - "select-a-container" placeholder metni kalmış

## Çözüm

### 1. Container Adlarını Kontrol Edin

Dokploy → **Projects** → **DFGDFG** → Container listesini kontrol edin:

- **Frontend Container:** `dfgdfg-asdasd-knb3mu` (veya benzeri)
- **Backend Container:** `dfgdfg-asda-ulpk0w` (veya benzeri)
- **MySQL Container:** `wecamp-mysql` (veya benzeri)

### 2. Doğru Container Adını Kullanın

Dokploy'da bir komut çalıştırırken:
- Container dropdown'dan **doğru container'ı seçin**
- "select-a-container" placeholder'ını kullanmayın

### 3. Container'ları Kontrol Edin

Dokploy → **Projects** → **DFGDFG**:
- Tüm container'ların **Running** durumunda olduğundan emin olun
- Eğer bir container yoksa, **yeniden oluşturun**

## Dokploy'da Container Adlarını Bulma

1. Dokploy → **Projects** → **DFGDFG**
2. Container listesini görüntüleyin
3. Her container'ın **tam adını** not edin

## Örnek Container Adları

- Frontend: `dfgdfg-asdasd-knb3mu`
- Backend: `dfgdfg-asda-ulpk0w`
- MySQL: `wecamp-mysql` veya `dfgdfg-wecampmysql-c6zsle`

## Hangi İşlemde Hata Aldınız?

1. **Container restart** mı?
2. **Container logs** mu?
3. **Container exec** mi?
4. **Başka bir işlem** mi?

Hangi işlemde hata aldığınızı belirtin, daha spesifik çözüm sunabilirim.

