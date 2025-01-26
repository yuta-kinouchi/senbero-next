// hooks/useAppNavigation.ts
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useAppNavigation = () => {
  const router = useRouter();

  // レストラン関連のナビゲーション
  const restaurantNavigation = {
    toList: useCallback(() => 
      router.push('/restaurants'), [router]),
    
    toDetail: useCallback((restaurantId: number) => 
      router.push(`/restaurants/${restaurantId}`), [router]),

    toEdit: useCallback((restaurantId: number) => 
      router.push(`/restaurants/${restaurantId}/edit`), [router]),
    
    toSearch: useCallback(() => 
      router.push('/restaurants/search'), [router]),

    afterEdit: useCallback((restaurantId: string) => 
      router.push(`/restaurants/${restaurantId}`), [router])
  };

  // 現在のルートパラメータ取得用
  const getCurrentId = useCallback(() => {
    return router.query.id as string;
  }, [router.query]);

  return {
    restaurant: restaurantNavigation,
    getCurrentId,
    currentPath: router.pathname
  };
};
// 型定義のエクスポート
export type AppNavigation = ReturnType<typeof useAppNavigation>;