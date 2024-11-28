// hooks/useAppNavigation.ts
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useAppNavigation = () => {
  const router = useRouter();

  // レストラン関連のナビゲーション
  const restaurantNavigation = {
    // 一覧ページへ
    toList: useCallback(() => 
      router.push('/restaurants'), [router]),
    
    // 詳細ページへ
    toDetail: useCallback((restaurantId: number) => 
      router.push(`/restaurants/${restaurantId}`), [router]),
    
    // 検索ページへ
    toSearch: useCallback(() => 
      router.push('/restaurants/search'), [router]),
  };

  // 基本的なナビゲーション機能
  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    restaurant: restaurantNavigation,
    goBack,
    currentPath: router.pathname
  };
};

// 型定義のエクスポート
export type AppNavigation = ReturnType<typeof useAppNavigation>;