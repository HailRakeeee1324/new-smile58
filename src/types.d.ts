declare module "react" {
  const React: any;
  export default React;
  export const useEffect: any;
  export const useMemo: any;
  export const useRef: any;
  export const useState: any;
  export const Suspense: any;
  export const lazy: any;
  export const startTransition: any;
}
declare module "react-dom/client" { export const createRoot: any; }
declare module "lucide-react" {
  export const BadgeCheck: any;
  export const Building2: any;
  export const CalendarDays: any;
  export const ChevronLeft: any;
  export const ChevronRight: any;
  export const ClipboardList: any;
  export const Clock: any;
  export const Gem: any;
  export const HandHeart: any;
  export const HeartPulse: any;
  export const MapPin: any;
  export const Menu: any;
  export const Moon: any;
  export const Phone: any;
  export const Search: any;
  export const ShieldCheck: any;
  export const Smile: any;
  export const Sparkles: any;
  export const Sun: any;
  export const UserRound: any;
  export const X: any;
}
declare module "*.css";
declare namespace JSX { interface IntrinsicElements { [elemName: string]: any; } }
interface ImportMeta { env: Record<string, string | undefined>; }
interface Window {
  ym?: (...args: any[]) => void;
  dataLayer?: any[];
  __nyMetrikaScriptLoaded?: boolean;
  __nyMetrikaInitialized?: boolean;
  __nyMetrikaQueue?: any[];
  smartCaptcha?: any;
}
