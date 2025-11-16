import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { GearCard } from '@/components/GearCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Gear, Category, GearFilters } from '@/types';
import { categoryManagementService } from '@/services/categoryManagementService';
import { useGearStore } from '@/store/gearStore';

export const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { gear, fetchGear, isLoading: gearLoading } = useGearStore();
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [categoryGear, setCategoryGear] = useState<Gear[]>([]);
  const [filters, setFilters] = useState<GearFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (categorySlug) {
        setIsLoading(true);
        try {
          // Get category info from categoryManagementService
          const category = await categoryManagementService.getCategoryBySlug(categorySlug);
          
          if (category) {
            setCategoryInfo(category);
            // Get subcategories
            const children = await categoryManagementService.getChildCategories(category.id);
            setSubCategories(children);
          } else {
            // Category not found
            setCategoryInfo(null);
            setIsLoading(false);
            return;
          }
          
          // Fetch all gear and filter by category
          // Use limit 1000 (max allowed by backend)
          setError(null);
          await fetchGear({}, 1, 1000);
        } catch (error: any) {
          console.error('Failed to load category data:', error);
          const errorMessage = error?.response?.data?.message || error?.message || 'Kategori yüklenirken bir hata oluştu';
          setError(errorMessage);
          setCategoryInfo(null);
          setIsLoading(false);
        }
      }
    };

    loadCategoryData();

    // Listen for category updates
    const handleCategoryUpdate = () => {
      loadCategoryData();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'camp_categories_storage') {
        loadCategoryData();
      }
    };

    window.addEventListener('categoriesUpdated', handleCategoryUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoryUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [categorySlug, fetchGear]);

  useEffect(() => {
    const checkCategory = async () => {
      if (categorySlug) {
        try {
          const category = await categoryManagementService.getCategoryBySlug(categorySlug);
          if (!category) {
            setIsLoading(false);
            return;
          }

          if (gear.length > 0) {
            // Filter gear by category slug or categoryId
            console.log('Filtering gear for category:', categorySlug, 'Category ID:', category.id);
            console.log('Total gear items:', gear.length);
            
            const filtered = gear.filter((item) => {
              // Check categoryId first (most reliable) - exact match
              if (item.categoryId === category.id) {
                console.log('Matched by categoryId:', item.name);
                return true;
              }
              // Check category slug match - most reliable for dynamic IDs
              if (item.category === categorySlug || item.category === category.slug) {
                console.log('Matched by category slug:', item.name);
                return true;
              }
              // Check if categoryId matches slug pattern (cat-{slug})
              if (item.categoryId && item.categoryId === `cat-${categorySlug}`) {
                console.log('Matched by categoryId pattern:', item.name);
                return true;
              }
              // Check if categoryId ends with slug (for dynamic IDs)
              if (item.categoryId && category.slug && item.categoryId.endsWith(category.slug)) {
                console.log('Matched by categoryId suffix:', item.name);
                return true;
              }
              // Check if category is string and includes slug
              if (typeof item.category === 'string' && item.category.includes(categorySlug)) {
                console.log('Matched by category string:', item.name);
                return true;
              }
              // Debug: log non-matching items for this category
              if (item.categoryId && item.categoryId.includes('kamp-ocaklari')) {
                console.log('Debug - gear item has kamp-ocaklari:', {
                  itemName: item.name,
                  itemCategoryId: item.categoryId,
                  itemCategory: item.category,
                  categoryId: category.id,
                  categorySlug: category.slug
                });
              }
              return false;
            });
            
            console.log('Filtered gear count:', filtered.length);
            console.log('Filtered items:', filtered.map(g => g.name));
            
            setCategoryGear(filtered);
            setIsLoading(false);
          } else if (!gearLoading) {
            // If gear is empty and not loading, try fetching again
            console.log('Gear is empty, fetching...');
            setError(null);
            try {
              await fetchGear({}, 1, 1000);
            } catch (fetchError: any) {
              const errorMessage = fetchError?.response?.data?.message || fetchError?.message || 'Ürünler yüklenirken bir hata oluştu';
              setError(errorMessage);
            }
          }
        } catch (error: any) {
          console.error('Failed to check category:', error);
          const errorMessage = error?.response?.data?.message || error?.message || 'Kategori kontrol edilirken bir hata oluştu';
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };
    checkCategory();
  }, [categorySlug, gear, gearLoading, fetchGear]);

  // Apply filters to category gear
  const filteredGear = useMemo(() => {
    let result = [...categoryGear];

    // Apply filters
    if (filters?.minPrice) {
      result = result.filter(g => g.pricePerDay >= filters.minPrice!);
    }
    if (filters?.maxPrice) {
      result = result.filter(g => g.pricePerDay <= filters.maxPrice!);
    }
    if (filters?.available !== undefined) {
      result = result.filter(g => g.available === filters.available);
    }
    // Status filter - handle 'for-sale-or-sold' to show both for-sale and sold items
    if (filters?.status) {
      if (filters.status === 'for-sale-or-sold') {
        // Get status from gear item (fallback to available for backward compatibility)
        result = result.filter(g => {
          const itemStatus = g.status || (g.available ? 'for-sale' : 'sold');
          return itemStatus === 'for-sale' || itemStatus === 'sold';
        });
      } else {
        // Filter by specific status
        result = result.filter(g => {
          const itemStatus = g.status || (g.available ? 'for-sale' : 'sold');
          return itemStatus === filters.status;
        });
      }
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(searchLower) ||
        g.description.toLowerCase().includes(searchLower)
      );
    }
    if (filters?.brand && filters.brand.trim() !== '') {
      const brandLower = filters.brand.toLowerCase().trim();
      result = result.filter(g => {
        // First check if gear has a brand field that matches
        if (g.brand && g.brand.toLowerCase().includes(brandLower)) {
          return true;
        }
        // Then search in name, description, and specifications
        const nameMatch = g.name.toLowerCase().includes(brandLower);
        const descMatch = g.description.toLowerCase().includes(brandLower);
        const specMatch = g.specifications 
          ? Object.values(g.specifications).some(val => 
              String(val).toLowerCase().includes(brandLower)
            )
          : false;
        return nameMatch || descMatch || specMatch;
      });
      console.log('CategoryPage - Brand filter applied:', brandLower, 'Result count:', result.length);
    }
    if (filters?.color && filters.color.trim() !== '') {
      const colorLower = filters.color.toLowerCase().trim();
      result = result.filter(g => {
        // First check if gear has a color field that matches
        if (g.color && g.color.toLowerCase().includes(colorLower)) {
          return true;
        }
        // Then search in name, description, and specifications
        const nameMatch = g.name.toLowerCase().includes(colorLower);
        const descMatch = g.description.toLowerCase().includes(colorLower);
        const specMatch = g.specifications 
          ? Object.values(g.specifications).some(val => 
              String(val).toLowerCase().includes(colorLower)
            )
          : false;
        return nameMatch || descMatch || specMatch;
      });
      console.log('CategoryPage - Color filter applied:', colorLower, 'Result count:', result.length);
    }
    if (filters?.minRating !== undefined) {
      result = result.filter(g => (g.rating || 0) >= filters.minRating!);
    }

    // Apply sorting
    if (filters?.sortBy) {
      result.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.pricePerDay - b.pricePerDay;
          case 'price-desc':
            return b.pricePerDay - a.pricePerDay;
          case 'name-asc':
            return a.name.localeCompare(b.name, 'tr');
          case 'name-desc':
            return b.name.localeCompare(a.name, 'tr');
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          default:
            return 0;
        }
      });
    }

    return result;
  }, [categoryGear, filters]);

  const isLoadingState = isLoading || gearLoading;

  if (isLoadingState) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <>
        <SEO title="Kategori Bulunamadı" description="Aradığınız kategori bulunamadı" />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Kategori Bulunamadı
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Aradığınız kategori mevcut değil.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${categoryInfo.name} - WeCamp | Kamp Ekipmanları ve Malzemeleri`} 
        description={categoryInfo.description || `${categoryInfo.name} kategorisindeki ürünler. ${categoryInfo.name} kiralık kamp malzemeleri ve ekipmanları. Türkiye'nin en kapsamlı kamp pazar yeri.`} 
        keywords={`${categoryInfo.name}, kamp malzemeleri, kamp ekipmanları, kiralık kamp malzemeleri, ${categoryInfo.name} kiralama, outdoor ekipmanları`}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">
                    Hata
                  </h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </p>
                  {error.includes('429') && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                      Çok fazla istek gönderildi. Lütfen birkaç saniye bekleyip sayfayı yenileyin.
                    </p>
                  )}
                  {error.includes('400') && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                      Geçersiz istek. Lütfen sayfayı yenileyin.
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {categoryInfo.icon && <span className="mr-3">{categoryInfo.icon}</span>}
                {categoryInfo.name}
              </h1>
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {isFilterOpen ? 'Filtreleri Gizle' : 'Filtreler'}
              </button>
            </div>
            {categoryInfo.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                {categoryInfo.description}
              </p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="hidden lg:block">
                <FilterSidebar
                  type="gear"
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
              {isFilterOpen && (
                <div className="lg:hidden">
                  <FilterSidebar
                    type="gear"
                    filters={filters}
                    onFilterChange={setFilters}
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Sorting - Right Side */}
              <div className="flex justify-end mb-4">
                <div className="w-full sm:w-auto">
                  <select
                    value={filters.sortBy || ''}
                    onChange={(e) => {
                      setFilters({ ...filters, sortBy: e.target.value || undefined });
                    }}
                    className="w-full sm:w-64 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Sıralama Seçin</option>
                    <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                    <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                    <option value="name-asc">İsim: A-Z</option>
                    <option value="name-desc">İsim: Z-A</option>
                    <option value="newest">En Yeni</option>
                    <option value="oldest">En Eski</option>
                  </select>
                </div>
              </div>
              {/* Sub Categories */}
              {subCategories.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Alt Kategoriler
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subCategories.map((subCat) => (
                      <Link
                        key={subCat.id}
                        to={`/category/${subCat.slug}`}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          {subCat.icon && <span className="text-2xl">{subCat.icon}</span>}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {subCat.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {filteredGear.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Ürünler
                    </h2>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {filteredGear.length} ürün bulundu
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGear.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <GearCard gear={item} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  {categoryGear.length === 0
                    ? 'Bu kategoride henüz ürün bulunmamaktadır.'
                    : 'Aradığınız kriterlere uygun ürün bulunamadı.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

