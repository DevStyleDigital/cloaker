export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          devices: Json[];
          blockProviders: Json[];
          blockRedirectUrl: string | null;
          systems: Json[];
          cat: string;
          id: string;
          name: string;
          noBots: boolean;
          noExt: boolean;
          params: Json[];
          publishLocale: string;
          redirects: Json[];
          redirectType: string;
          requestsAmount: number;
          status: string;
          urls: Json;
          useCustomDomain: boolean;
          user_id: string;
          useReadyProvidersList: boolean;
        };
        Insert: {
          devices?: Json[];
          blockProviders?: Json[];
          blockRedirectUrl?: string | null;
          systems?: Json[];
          cat?: string;
          id: string;
          name: string;
          noBots?: boolean;
          noExt?: boolean;
          params?: Json[];
          publishLocale: string;
          redirects?: Json[];
          redirectType?: string;
          requestsAmount?: number;
          status?: string;
          urls?: Json;
          useCustomDomain?: boolean;
          user_id: string;
          useReadyProvidersList?: boolean;
        };
        Update: {
          devices?: Json[];
          blockProviders?: Json[];
          blockRedirectUrl?: string | null;
          systems?: Json[];
          cat?: string;
          id?: string;
          name?: string;
          noBots?: boolean;
          noExt?: boolean;
          params?: Json[];
          publishLocale?: string;
          redirects?: Json[];
          redirectType?: string;
          requestsAmount?: number;
          status?: string;
          urls?: Json;
          useCustomDomain?: boolean;
          user_id?: string;
          useReadyProvidersList?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'campaigns_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
