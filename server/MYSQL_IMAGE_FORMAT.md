# MySQL Container Image Formatı

## Hata
```
Error: Error: invalid reference format
```

## Neden?
Docker image adı formatı yanlış veya eksik.

## Doğru MySQL Image Formatları

### Seçenek 1: MySQL 8.4.7 (Önerilen)
```
mysql:8.4.7
```

### Seçenek 2: MySQL 8.4 (Latest 8.4)
```
mysql:8.4
```

### Seçenek 3: MySQL 8.0.35
```
mysql:8.0.35
```

### Seçenek 4: MySQL Latest
```
mysql:latest
```

## Dokploy'da Nasıl Eklenir?

Dokploy → MySQL Container → **Image** alanına:

**Sadece şunu yazın:**
```
mysql:8.4.7
```

**VEYA:**
```
mysql:8.4
```

## Yanlış Formatlar (Kullanmayın!)

❌ `mysql 8.4.7` (boşluk var)
❌ `mysql:8.4.7:latest` (çift tag)
❌ `mysql/8.4.7` (yanlış format)
❌ `mysql-8.4.7` (tire var)
❌ `mysql` (tag yok - latest kullanılır ama belirsiz)

## Doğru Format

✅ `mysql:8.4.7`
✅ `mysql:8.4`
✅ `mysql:8.0.35`
✅ `mysql:latest`

## Adımlar

1. Dokploy → MySQL Container → **Image** alanına gidin
2. **Sadece şunu yazın:** `mysql:8.4.7`
3. **Save** yapın
4. Container'ı **restart** edin

## Not

Eğer hata devam ederse:
- Image alanını **tamamen temizleyin**
- `mysql:8.4.7` yazın (başında/sonunda boşluk olmadan)
- **Save** yapın

