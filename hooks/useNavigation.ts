// hooks/useAppNavigation.ts
import { useRouter } from 'next/router';
import { useCallback } from 'react';

interface NavigationParams {
  id?: number;
  params?: Record<string, string | string[]>;
  options?: {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
  };
}

export const useAppNavigation = () => {
  const router = useRouter();

  // 基本的なナビゲーション関数
  const navigateTo = useCallback((path: string, options?: NavigationParams['options']) => {
    return router.push(path, undefined, options);
  }, [router]);

  // パラメータ付きのナビゲーション関数
  const navigateWithParams = useCallback((
    basePath: string, 
    params?: Record<string, string | string[]>
  ) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => query.append(key, v));
        } else {
          query.append(key, value);
        }
      });
    }
    const queryString = query.toString();
    return router.push(`${basePath}${queryString ? `?${queryString}` : ''}`);
  }, [router]);

  // 検索パラメータの更新
  const updateSearchParams = useCallback((
    params: Record<string, string | string[]>,
    options: { replace?: boolean; scroll?: boolean } = {}
  ) => {
    const newQuery = { ...router.query, ...params };
    const method = options.replace ? router.replace : router.push;
    
    return method(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true, ...options }
    );
  }, [router]);

  // レストラン関連のナビゲーション
  const restaurantNavigation = {
    toList: useCallback(() => navigateTo('/restaurants'), [navigateTo]),
    
    toDetail: useCallback((id: number) => 
      navigateTo(`/restaurants/${id}`), [navigateTo]),
    
    toSearch: useCallback((params?: Record<string, string | string[]>) => 
      navigateWithParams('/restaurants/search', params), [navigateWithParams]),
    
    toNearby: useCallback(() => 
      navigateTo('/restaurants/nearby'), [navigateTo]),
    
    toCreate: useCallback(() => 
      navigateTo('/restaurants/create'), [navigateTo]),
    
    toEdit: useCallback((id: number) => 
      navigateTo(`/restaurants/${id}/edit`), [navigateTo])
  };

  // ユーザー関連のナビゲーション
  const userNavigation = {
    toProfile: useCallback(() => 
      navigateTo('/profile'), [navigateTo]),
    
    toSettings: useCallback(() => 
      navigateTo('/settings'), [navigateTo]),
    
    toFavorites: useCallback(() => 
      navigateTo('/favorites'), [navigateTo])
  };

  // 認証関連のナビゲーション
  const authNavigation = {
    toLogin: useCallback((returnUrl?: string) => 
      navigateWithParams('/auth/login', returnUrl ? { returnUrl } : undefined), 
      [navigateWithParams]),
    
    toSignup: useCallback(() => 
      navigateTo('/auth/signup'), [navigateTo]),
    
    toForgotPassword: useCallback(() => 
      navigateTo('/auth/forgot-password'), [navigateTo])
  };

  // 戻る機能
  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  // 現在のルート情報
  const routeInfo = {
    currentPath: router.pathname,
    currentQuery: router.query,
    isReady: router.isReady,
    asPath: router.asPath
  };

  return {
    // 基本的なナビゲーション機能
    navigateTo,
    navigateWithParams,
    updateSearchParams,
    goBack,

    // グループ化されたナビゲーション関数
    restaurant: restaurantNavigation,
    user: userNavigation,
    auth: authNavigation,

    // ルート情報
    route: routeInfo
  };
};

// 使用例
export type AppNavigation = ReturnType<typeof useAppNavigation>;