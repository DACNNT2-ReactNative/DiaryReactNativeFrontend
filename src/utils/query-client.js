import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            staleTime: 5 * 1000,
            retry: false,
        },
    },
});