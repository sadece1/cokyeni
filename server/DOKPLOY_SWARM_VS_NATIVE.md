# Dokploy Swarm vs Native Mod

## Sorun

- Swarm modunda: 5 container var
- 2 tanesi shut down
- 3 tanesi ready ama boş
- Container'lar başlıyor ama hemen crash oluyor

## Çözüm: Native Moda Geçin

Dokploy'da **Swarm mod** yerine **Native mod** kullanın.

### Adımlar:

1. **Dokploy → Backend Container → Advanced** veya **Settings**
2. **Container Mode** veya **Deployment Mode** ayarını bulun
3. **Swarm** yerine **Native** seçin
4. **Save** yapın
5. **Backend Container → Deploy** (redeploy)

## Native Mod Avantajları

- ✅ Daha basit yapı
- ✅ Loglar daha kolay görünür
- ✅ Container'lar daha stabil çalışır
- ✅ Debug daha kolay

## Swarm Mod Sorunları

- ❌ Container'lar sürekli restart olabilir
- ❌ Loglar görünmeyebilir
- ❌ Debug zor
- ❌ Container sayısı artabilir

## Alternatif: Swarm Modda Düzeltme

Eğer Swarm mod kullanmak istiyorsanız:

1. **Tüm container'ları durdurun** → Dokploy → Backend Container → Stop
2. **Container'ları temizleyin** → Dokploy → Backend Container → Delete (gerekirse)
3. **Yeniden deploy edin** → Dokploy → Backend Container → Deploy

## Şimdi Yapın

1. ✅ **Dokploy → Backend Container → Advanced/Settings** → **Native mod** seçin
2. ✅ **Save** yapın
3. ✅ **Backend Container → Deploy** (redeploy)
4. ✅ **Backend Container → Logs** → Logları kontrol edin

"NATIVE MODA GECTIM, REDEPLOY YAPTIM" yazın, sonra logları kontrol edelim.


