export interface User {
    data: any;
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    roles?: string[];
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
