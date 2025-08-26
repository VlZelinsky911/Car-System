interface ImportMetaEnv {
  readonly VITE_USER_API_URL?: string;
  readonly VITE_VEHICLE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}